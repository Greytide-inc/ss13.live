#!/usr/bin/env node
// dt-tidy.mjs - Detranslate robot (plans/archive/detranslate.md step 7b): removes lines that do nothing from game code and keeps _dm-lines.json's DM lines.
// Usage (from web/): node tools/dt-tidy.mjs RULE [--check] [FILE...]   (no FILE: every .ts under game/; --check writes nothing)
// Rules (each removed line did nothing):
//   null-default   `if (X === null) {` / `X = null;` / `}`: a DM argument default of null (it already is null)
//   f-vars         a proc's (or tail's) own `f.vars = () => [...];` line: translate-tg writes that list itself now
//   dead-return    a `return f.dot;` line right after a statement that always returns or throws (an if/else whose every branch does)
// _dm-lines.json rows ([dmFile, startLine, (relLine, col, dmLine)*], rel to the rt.def line, see src/translate/error-lines.ts):
// an entry on a removed line moves to the start of the next kept line (same order: the DM line it set still covers that line),
// an exact call entry there is dropped (its call is gone), later entries move up. Then every column of every kept line of a
// changed proc is looked up in the old and new row, and the tool stops with nothing written if any DM line differs.
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { relative, resolve } from "node:path";
import ts from "typescript";
import { dmText, parseDm } from "./remap-dm-cols.mjs";

const web = resolve(import.meta.dirname, ".."), game = resolve(web, "game"), dmPath = resolve(game, "_dm-lines.json");
/** A statement after which nothing runs: return, throw, a block holding one, an if/else ending on both sides. */
const ends = (s) => ts.isReturnStatement(s) || ts.isThrowStatement(s) || (ts.isBlock(s) && s.statements.some(ends))
	|| (ts.isIfStatement(s) && !!s.elseStatement && ends(s.thenStatement) && ends(s.elseStatement));
/** Each rule: (text, lines, file) -> the 0-based line numbers to remove. */
const RULES = {
	"null-default": (text, lines) => {
		const out = [];
		for (let i = 0; i < lines.length; i++) {
			const m = lines[i].match(/^(\t+)if \((\w+) === null\) \{$/);
			if (m && lines[i + 1] === `${m[1]}\t${m[2]} = null;` && lines[i + 2] === `${m[1]}}`) { out.push(i, i + 1, i + 2); i += 2; }
		}
		return out;
	},
	"f-vars": (text, lines, file) => {
		const sf = ts.createSourceFile(file, text, ts.ScriptTarget.ES2022, true, ts.ScriptKind.TS), out = [];
		for (const st of sf.statements) {
			const e = ts.isExpressionStatement(st) ? st.expression : null, fn = e && ts.isCallExpression(e) && /^rt\.(def|tail)$/.test(e.expression.getText(sf)) ? e.arguments[1] : null;
			if (!fn || !ts.isFunctionExpression(fn)) continue;
			for (const s of fn.body.statements) {
				const line = sf.getLineAndCharacterOfPosition(s.getStart(sf)).line;
				if (/^f\.vars = \(\) => \[[^\]]*\];$/.test(s.getText(sf)) && lines[line] === `\t${s.getText(sf)}`) out.push(line);
			}
		}
		return out;
	},
	"dead-return": (text, lines, file) => {
		const sf = ts.createSourceFile(file, text, ts.ScriptTarget.ES2022, true, ts.ScriptKind.TS), out = [];
		const visit = (n) => {
			const list = ts.isBlock(n) || ts.isSourceFile(n) || ts.isCaseClause(n) || ts.isDefaultClause(n) ? n.statements : null;
			if (list) for (let i = 1; i < list.length; i++) {
				const st = list[i], line = sf.getLineAndCharacterOfPosition(st.getStart(sf)).line;
				if (ends(list[i - 1]) && st.getText(sf) === "return f.dot;" && /^\t+return f\.dot;$/.test(lines[line])) out.push(line);
			}
			ts.forEachChild(n, visit);
		};
		visit(sf);
		return out;
	},
};
const [rule, ...rest] = process.argv.slice(2);
const check = rest.includes("--check"), named = rest.filter((a) => a !== "--check");
if (!RULES[rule]) { console.error(`usage: node tools/dt-tidy.mjs ${Object.keys(RULES).join("|")} [--check] [FILE...]`); process.exit(2); }

const walk = (d, out = []) => { for (const e of readdirSync(d)) { const p = resolve(d, e); if (statSync(p).isDirectory()) walk(p, out); else if (e.endsWith(".ts")) out.push(p); } return out; };
const files = named.length ? named.map((p) => resolve(p)) : walk(game);
const rows = parseDm(readFileSync(dmPath, "utf8")), byKey = new Map(rows.map((r) => [r.key, r]));

/** error-lines.ts `at`: the DM line of rel line `rel`, column `col`, in row entries `e`. */
function dmAt(e, rel, col) {
	let v = e[1], exact;
	for (let i = 2; i < e.length; i += 3) {
		const l = e[i], c = e[i + 1];
		if (c < 0) { if (l === rel && -1 - c === col) exact = e[i + 2]; }
		else if (l < rel || (l === rel && c <= col)) v = e[i + 2];
	}
	return exact !== undefined ? exact : v;
}
/** The row entries after removing rel lines `gone` (a sorted array of [from, to) ranges). */
function shiftRow(e, gone) {
	const out = e.slice(0, 2);
	for (let i = 2; i < e.length; i += 3) {
		let l = e[i], c = e[i + 1], up = 0, drop = false;
		for (const [a, b] of gone) {
			if (l >= b) up += b - a;
			else if (l >= a) { if (c < 0) drop = true; else { up += l - a; c = 0; } break; }
		}
		if (!drop) out.push(l - up, c, e[i + 2]);
	}
	return out;
}

let nFiles = 0, nSites = 0, nRows = 0, nChecked = 0;
const writes = [];
for (const p of files) {
	const text = readFileSync(p, "utf8"), lines = text.split("\n"), file = relative(game, p);
	const keep = new Array(lines.length).fill(true), gone = RULES[rule](text, lines, file);
	if (!gone.length) continue;
	for (const i of gone) keep[i] = false;
	const sites = rule === "null-default" ? gone.length / 3 : gone.length;
	// the rt.def each line belongs to (translate-tg: the last top-level rt.def at or before it), its nth, and removed ranges per def
	const defs = [], count = new Map();
	for (let i = 0; i < lines.length; i++) {
		const m = lines[i].match(/^rt\.def\("([^"]+)"/);
		if (m) { const nth = (count.get(m[1]) ?? 0) + 1; count.set(m[1], nth); defs.push({ line: i, key: `${file}|${m[1]}${nth > 1 ? `#${nth}` : ""}`, gone: [] }); }
	}
	let d = -1;
	for (let i = 0; i < lines.length; i++) {
		while (d + 1 < defs.length && defs[d + 1].line <= i) d++;
		if (keep[i]) continue;
		if (d < 0) { console.error(`${file}:${i + 1}: removed line before any rt.def`); process.exit(1); }
		const g = defs[d].gone, rel = i - defs[d].line;
		if (g.length && g[g.length - 1][1] === rel) g[g.length - 1][1]++; else g.push([rel, rel + 1]);
	}
	for (const df of defs) {
		const r = byKey.get(df.key);
		if (!df.gone.length || !r || r.arr.length < 3) continue;
		const next = shiftRow(r.arr, df.gone);
		// every kept line of this proc, old rel -> new rel, every column: same DM line
		const end = defs[defs.indexOf(df) + 1]?.line ?? lines.length;
		for (let i = df.line, nrel = 0; i < end; i++) {
			if (!keep[i]) continue;
			const rel = i - df.line;
			for (let col = 0; col <= lines[i].length; col++) {
				if (dmAt(r.arr, rel, col) !== dmAt(next, nrel, col)) { console.error(`${file}:${i + 1} col ${col} (${df.key}): DM line ${dmAt(r.arr, rel, col)} would become ${dmAt(next, nrel, col)}`); process.exit(1); }
				nChecked++;
			}
			nrel++;
		}
		r.arr = next; nRows++;
	}
	writes.push([p, lines.filter((_, i) => keep[i]).join("\n")]);
	nFiles++; nSites += sites;
}
console.log(`dt-tidy ${rule}: ${nSites} sites in ${nFiles} files, ${nRows} _dm-lines rows moved, ${nChecked} columns checked same DM line${check ? " (--check: nothing written)" : ""}`);
if (!check) {
	for (const [p, t] of writes) writeFileSync(p, t);
	writeFileSync(dmPath, dmText(rows));
}
