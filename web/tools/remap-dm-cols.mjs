#!/usr/bin/env node
// remap-dm-cols.mjs - After a codemod changed text INSIDE game lines, move the column entries of game/_dm-lines.json to where the old characters went.
// Usage (from web/): node tools/remap-dm-cols.mjs REV [--rows-changed-in COMMIT] [--check]
//   REV = the commit BEFORE the codemod (the text the current columns were written against); --check writes nothing.
//   --rows-changed-in COMMIT: rows that COMMIT rewrote in _dm-lines.json were written against COMMIT's own text, so their old text
//   is taken at COMMIT instead of REV (needed once, columns of most rows date from translation, tail rows from 3259ba13).
// Entries are [dmFile, startLine, (relLine, col, dmLine)*]; col > 0 = "from here on", col < 0 = exact call column (-1-col), 0 = line start.
// Per changed line: token-level LCS of old (REV) vs new text. A column on a kept character moves with it. A column on a DELETED
// token (e.g. a removed paren, a renamed call head `callSrc` -> `srcCall`) is "ambiguous": it moves to the START of the gap
// in the new line (just after the previous kept token), where the replacement text begins; for "from here on" entries that is
// the same place, for exact (call-name) entries it is the new call name when the name was replaced.
// Tokens are [\w$] runs or single chars; LCS on tokens. A changed middle too big for the LCS (>4M cells) counts as all deleted.
// Rerunning with REV=HEAD (files unchanged) changes nothing. Lines are never added/removed by codemods, so line numbers stay.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const web = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** Parse _dm-lines.json text into rows {key, arr, comma} (one proc per line; the format is rewritten byte-identically). */
export function parseDm(text) {
	const rows = [];
	for (const l of text.split("\n")) {
		const m = l.match(/^("[^"]*"):(.*?)(,?)$/);
		if (m) rows.push({ key: JSON.parse(m[1]), arr: JSON.parse(m[2]), comma: m[3] });
	}
	return rows;
}
export const dmText = (rows) => "{\n" + rows.map((r) => `${JSON.stringify(r.key)}:${JSON.stringify(r.arr)}${r.comma}`).join("\n") + "\n}\n";

/** The index of the game line (0-based) holding the nth rt.def of procPath, or -1. */
export function defLine(lines, path, nth) {
	const needle = `rt.def("${path}"`;
	let c = 0;
	for (let i = 0; i < lines.length; i++) if (lines[i].includes(needle) && ++c === nth) return i;
	return -1;
}
export function splitKey(key) {
	const [file, rest] = key.split("|"), m = rest.match(/^(.*?)(?:#(\d+))?$/);
	return { file, path: m[1], nth: +(m[2] || 1) };
}
/** Column of an entry's c (null for 0 = line start). */
export const colOf = (c) => (c === 0 ? null : c < 0 ? -1 - c : c);
export const encodeCol = (orig, col) => (orig < 0 ? -1 - col : col);

/** Split a line into tokens: runs of [\w$] or single other chars. Returns the start offsets (with a.length appended). */
function tokenStarts(a) {
	const st = [];
	for (let i = 0; i < a.length; i++) if (!(i > 0 && /[\w$]/.test(a[i]) && /[\w$]/.test(a[i - 1]))) st.push(i);
	st.push(a.length);
	return st;
}
/**
 * map[p] for p in 0..a.length: new column of old column p; del[p] = 1 if old char p was in a deleted/replaced token.
 * Token-level LCS (identifiers stay whole, so `callSrc` -> `srcCall` is a replaced token, not a scramble of letters).
 * A char of a kept token moves with it; a char of a deleted token maps to the START of the gap in the new line (just after
 * the previous kept token), where the replacement text (if any) begins.
 */
export function alignCols(a, b) {
	const map = new Int32Array(a.length + 1), del = new Uint8Array(a.length + 1);
	const as = tokenStarts(a), bs = tokenStarts(b), na = as.length - 1, nb = bs.length - 1;
	const same = (i, j) => as[i + 1] - as[i] === bs[j + 1] - bs[j] && a.startsWith(b.slice(bs[j], bs[j + 1]), as[i]);
	let s = 0;
	while (s < na && s < nb && same(s, s)) s++;
	let ea = na, eb = nb;
	while (ea > s && eb > s && same(ea - 1, eb - 1)) { ea--; eb--; }
	const match = new Int32Array(na).fill(-1); // old token -> new token
	for (let i = 0; i < s; i++) match[i] = i;
	for (let i = ea; i < na; i++) match[i] = i + eb - ea;
	const n = ea - s, m = eb - s;
	if (n > 0 && m > 0 && n * m <= 4e6) {
		const W = m + 1, t = new Uint16Array((n + 1) * W);
		for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--)
			t[i * W + j] = same(s + i, s + j) ? t[(i + 1) * W + j + 1] + 1 : Math.max(t[(i + 1) * W + j], t[i * W + j + 1]);
		let i = 0, j = 0;
		while (i < n && j < m) {
			if (same(s + i, s + j) && t[i * W + j] === t[(i + 1) * W + j + 1] + 1) { match[s + i] = s + j; i++; j++; }
			else if (t[i * W + j + 1] >= t[(i + 1) * W + j]) j++;
			else i++;
		}
	}
	let ptr = 0; // new column just after the last kept token
	for (let i = 0; i < na; i++) {
		const j = match[i];
		for (let p = as[i]; p < as[i + 1]; p++) {
			if (j >= 0) map[p] = bs[j] + (p - as[i]);
			else { map[p] = ptr; del[p] = 1; }
		}
		if (j >= 0) ptr = bs[j + 1];
	}
	map[a.length] = b.length;
	return { map, del };
}

/** Remap every column entry from the files at oldText(file) to the current ones. Returns {rows, stats, problems}. */
export function remap(rows, oldLinesOf, newLinesOf) {
	const st = { entries: 0, lineStart: 0, unchanged: 0, moved: 0, ambiguous: 0, ambiguousExact: 0, unresolved: 0, kept_char_mismatch: 0 };
	const al = new Map();
	for (const r of rows) {
		if (r.arr.length < 3) continue;
		const { file, path, nth } = splitKey(r.key), o = oldLinesOf(file, r.key), n = newLinesOf(file);
		for (let i = 2; i < r.arr.length; i += 3) {
			const c = r.arr[i + 1], col = colOf(c);
			if (col === null) { st.lineStart++; continue; }
			st.entries++;
			if (!o || !n) { st.unresolved++; continue; }
			const od = defLine(o, path, nth), nd = defLine(n, path, nth), l = r.arr[i];
			if (od < 0 || nd < 0) { st.unresolved++; continue; }
			const ol = o[od + l] ?? "", nl = n[nd + l] ?? "";
			if (ol === nl) { st.unchanged++; continue; }
			const k = ol + "\0" + nl;
			let a = al.get(k);
			if (!a) al.set(k, a = alignCols(ol, nl));
			const nc = col <= ol.length ? a.map[col] : col + nl.length - ol.length;
			if (col < ol.length && a.del[col]) { st.ambiguous++; if (c < 0) st.ambiguousExact++; }
			else {
				if (nc === col) st.unchanged++; else st.moved++;
				if (ol[col] !== nl[nc]) st.kept_char_mismatch++; // self-check: a kept character must be the same character at its new column
			}
			r.arr[i + 1] = encodeCol(c, nc);
		}
	}
	return st;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	const rev = process.argv[2], check = process.argv.includes("--check");
	const ri = process.argv.indexOf("--rows-changed-in"), own = ri > 0 ? process.argv[ri + 1] : null;
	if (!rev) { console.error("usage: node tools/remap-dm-cols.mjs REV [--check]"); process.exit(2); }
	const path = resolve(web, "game/_dm-lines.json"), rows = parseDm(readFileSync(path, "utf8"));
	const cache = (f) => { const m = new Map(); return (file) => { if (!m.has(file)) m.set(file, f(file)); return m.get(file); }; };
	const ownRows = new Set();
	if (own) for (const l of execFileSync("git", ["show", "--format=", "-U0", own, "--", "game/_dm-lines.json"], { cwd: web, maxBuffer: 1 << 28 }).toString().split("\n")) {
		const m = l.match(/^\+("[^"]*"):/);
		if (m) ownRows.add(JSON.parse(m[1]));
	}
	const show = (r, file) => { try { return execFileSync("git", ["show", `${r}:web/game/${file}`], { cwd: web, maxBuffer: 1 << 28, stdio: ["ignore", "pipe", "ignore"] }).toString().split("\n"); } catch { return null; } };
	const byRev = { [rev]: cache((file) => show(rev, file)), ...(own ? { [own]: cache((file) => show(own, file)) } : {}) };
	const oldLines = (file, key) => byRev[ownRows.has(key) ? own : rev](file);
	if (own) console.log(`${ownRows.size} rows use the text at ${own}, the rest the text at ${rev}`);
	const newLines = cache((file) => existsSync(resolve(web, "game", file)) ? readFileSync(resolve(web, "game", file), "utf8").split("\n") : null);
	const st = remap(rows, oldLines, newLines);
	console.log(st, "(entries = non-zero columns; moved + ambiguous + unchanged + unresolved == entries)");
	if (!check) writeFileSync(path, dmText(rows));
}
