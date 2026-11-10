#!/usr/bin/env node
// pb-defines - names tg's #defines back into web/game procs (phrasebook step 4): `H.stat == 2` -> `H.stat == DEAD`, `rt.bitAnd(f, 4096)` -> `rt.bitAnd(f, GODMODE)`.
// A number gets the name only where the DM line it came from wrote that define (matched in order, value for value); anything else stays a number.
// Writes game/_defines.d.ts (the names; translate-tg writes the numbers back). Usage: node tools/pb-defines.mjs [--check] [--show N] [--why] [files...]
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import { scopeNames, procFunction } from "./proc-calls.mjs";
import { DEFINES_FILE, isDefineUse, readDefines } from "./define-names.mjs";

const web = path.join(import.meta.dirname, "..");
const gameDir = path.join(web, "game");
const dmRoot = path.join(process.env.HOME, "Desktop/projects/tgstation");
const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const showN = args.includes("--show") ? +args[args.indexOf("--show") + 1] : 0;
const explicit = args.filter((a, i) => !a.startsWith("--") && args[i - 1] !== "--show");
const walk = (d, ext) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
	e.isDirectory() ? walk(path.join(d, e.name), ext) : e.name.endsWith(ext) && !e.name.endsWith(".d.ts") ? [path.join(d, e.name)] : []);

// ---- DM: the files' text without comments (line numbers kept), and the #defines
const dmText = new Map();
function dmLines(rel) {
	let l = dmText.get(rel);
	if (!l) {
		let t;
		try { t = fs.readFileSync(path.join(dmRoot, rel), "utf8"); } catch { t = ""; }
		l = stripComments(t).split("\n");
		dmText.set(rel, l);
	}
	return l;
}
function stripComments(t) {
	let o = "", i = 0, str = false, depth = 0;
	while (i < t.length) {
		const c = t[i], d = t[i + 1];
		if (str) { o += c; if (c === "\\") { o += d ?? ""; i += 2; continue; } if (c === '"') str = false; i++; continue; }
		if (c === '"') { str = true; o += c; i++; continue; }
		if (c === "/" && d === "/") { while (i < t.length && t[i] !== "\n") i++; continue; }
		if (c === "/" && d === "*") { i += 2; depth = 1; while (i < t.length && depth) { if (t[i] === "\n") o += "\n"; if (t[i] === "/" && t[i + 1] === "*") { depth++; i++; } else if (t[i] === "*" && t[i + 1] === "/") { depth--; i++; } i++; } continue; }
		o += c; i++;
	}
	return o;
}
const defs = new Map(); // name -> [{ file, line, text, fn }]
for (const f of walk(path.join(dmRoot, "code"), ".dm")) {
	const rel = path.relative(dmRoot, f), lines = dmLines(rel);
	for (let i = 0; i < lines.length; i++) {
		const m = /^\s*#define\s+([A-Za-z_]\w*)(\()?\s*(.*)$/.exec(lines[i]);
		if (!m) continue;
		let text = m[3], n = i;
		while (/\\\s*$/.test(text) && n + 1 < lines.length) { text = text.replace(/\\\s*$/, " ") + lines[++n]; }
		(defs.get(m[1]) ?? defs.set(m[1], []).get(m[1])).push({ file: rel, line: i + 1, text: text.trim(), fn: !!m[2] });
	}
}
const resolved = new Map(); // "name|file" -> { v, from } | null
function define(name, file, seen = new Set()) { // the number NAME means in DM file `file`, or null when it isn't a plain number (or isn't a define); undefined when no such define
	const cands = defs.get(name);
	if (!cands) return undefined;
	const key = `${name}|${file}`;
	if (resolved.has(key)) return resolved.get(key);
	if (seen.has(key)) return null;
	seen.add(key);
	let pick = cands.filter((c) => c.file === file);
	if (!pick.length) pick = cands.filter((c) => c.file.startsWith("code/__DEFINES/"));
	if (!pick.length) pick = cands;
	let r = null;
	const vals = pick.map((c) => c.fn ? null : evalDefine(c.text, c.file, seen));
	if (vals.every((x) => x && x.v === vals[0]?.v)) r = { v: vals[0].v, from: `${pick[0].file}:${pick[0].line}` };
	else if (vals.length > 1) { const last = vals[vals.length - 1]; if (pick.every((c) => c.file === file) && last) r = { v: last.v, from: `${pick[pick.length - 1].file}:${pick[pick.length - 1].line}` }; }
	seen.delete(key);
	resolved.set(key, r);
	return r;
}
function evalDefine(text, file, seen) { // a plain number, or an integer expression of numbers and other plain defines; else null
	let t = text.replace(/\s+$/, "");
	if (!t || /["'\[\]{}]/.test(t)) return null;
	let bad = false;
	t = t.replace(/[A-Za-z_]\w*/g, (w) => {
		if (/^0x/i.test(w)) return w;
		const d = define(w, file, seen);
		if (!d) { bad = true; return "0"; }
		return d.v < 0 ? `(${d.v})` : String(d.v);
	});
	if (bad || !/^[\d\s.x+\-*/()|&<>^%a-fA-F]+$/.test(t) || /<<\s*\d{2,}|[a-df-wyzA-WYZ]/.test(t.replace(/0x[0-9a-fA-F]+/g, "0"))) return null;
	let v;
	try { v = Function(`"use strict";return (${t})`)(); } catch { return null; }
	if (typeof v !== "number" || !Number.isFinite(v) || Math.abs(v) > 16777216) return null;
	if (!Number.isInteger(v) && !/^-?\d*\.\d+$/.test(t.trim()) ) return null;
	return { v };
}

// ---- DM tokens of a line: the numbers and the defines that mean numbers; `opaque` where a define we can't read stands (the line is skipped)
const expCache = new Map();
function expansion(w, file, depth) { // the numbers a macro we can't name leaves in the code (JS has them as plain literals): from its replacement text
	if (depth > 4) return [];
	const key = `${w}|${file}`;
	let r = expCache.get(key);
	if (!r) {
		const c = defs.get(w);
		const pick = c.filter((x) => x.file === file)[0] ?? c.filter((x) => x.file.startsWith("code/__DEFINES/"))[0] ?? c[0];
		expCache.set(key, []);
		const body = pick.fn ? pick.text.replace(/^[^)]*\)\s*/, "") : pick.text;
		r = dmTokens(body, pick.file, depth + 1).map((t) => ({ v: t.v, name: null, exp: true })).filter((t) => t.v !== undefined);
		expCache.set(key, r);
	}
	return r;
}
function dmTokens(line, file, depth = 0) {
	const out = [];
	let i = 0;
	const s = line;
	const scan = (end) => {
		while (i < end) {
			const c = s[i];
			if (c === '"') { // a string: its [..] parts are code
				i++;
				while (i < end && s[i] !== '"') {
					if (s[i] === "\\") { i += 2; continue; }
					if (s[i] === "[") { i++; let d = 1, st = i; while (i < end && d) { if (s[i] === "[") d++; else if (s[i] === "]") d--; i++; } scanRange(st, i - 1); continue; }
					i++;
				}
				i++;
				continue;
			}
			if (c === "'") { i++; while (i < end && s[i] !== "'") i++; i++; continue; }
			if (/[A-Za-z_]/.test(c)) {
				let j = i; while (j < end && /\w/.test(s[j])) j++;
				const w = s.slice(i, j), prev = s[i - 1];
				i = j;
				if (prev === ".") continue;
				const d = define(w, file);
				if (d === undefined) continue;
				if (d === null && depth === 0 && !defs.get(w).some((x) => x.fn) && /^\d/.test(defs.get(w)[0].text)) { out.push({ v: Number(defs.get(w)[0].text.split(/\s/)[0]), name: null }); continue; }
				if (d === null || defs.get(w).some((x) => x.fn)) { for (const t of expansion(w, file, depth)) out.push(t); }
				else out.push({ v: d.v, name: w, from: d.from });
				continue;
			}
			if (/\d/.test(c) || (c === "." && /\d/.test(s[i + 1] ?? "") && !/[\w)\]]/.test(s[i - 1] ?? ""))) {
				const m = /^(0x[0-9a-fA-F]+|\d*\.?\d+(?:[eE][+-]?\d+)?|\d+\.)/.exec(s.slice(i, end));
				if (!m) { i++; continue; }
				i += m[0].length;
				out.push({ v: Number(m[0].replace(/\.$/, "")), name: null });
				continue;
			}
			i++;
		}
	};
	const scanRange = (a, b) => { const save = i; i = a; scan(b); i = save; };
	scan(s.length);
	return out;
}

if (flag("--undo")) { // every use of a name in game/_defines.d.ts back to its number (what the build writes)
	const tbl = readDefines();
	let n = 0;
	for (const f of walk(gameDir, ".ts")) {
		const text = fs.readFileSync(f, "utf8");
		if (![...tbl.keys()].some((k) => text.includes(k))) continue;
		const sf = ts.createSourceFile(f, text, ts.ScriptTarget.ES2022, true, ts.ScriptKind.TS), scope = scopeNames(sf), cuts = [];
		const visit = (x) => { if (isDefineUse(x, tbl, scope)) cuts.push([x.getStart(sf), x.end, tbl.get(x.text)]); ts.forEachChild(x, visit); };
		visit(sf);
		if (!cuts.length) continue;
		let out = "", at = 0;
		for (const [a, b, r] of cuts) { out += text.slice(at, a) + r; at = b; }
		fs.writeFileSync(f, out + text.slice(at));
		n += cuts.length;
	}
	console.log(`undone: ${n} names back to numbers`);
	process.exit(0);
}

function readPrior() { // game/_defines.d.ts as an earlier run left it: name -> { v, from }
	const m = new Map();
	if (!fs.existsSync(DEFINES_FILE)) return m;
	let blk = "";
	for (const l of fs.readFileSync(DEFINES_FILE, "utf8").split("\n")) {
		const h = /^\/\/ (code\/\S+\.dm)$/.exec(l), x = /^declare const (\w+): (\S+); \/\/ :(\d+)$/.exec(l);
		if (h) blk = h[1];
		else if (x) m.set(x[1], { v: Number(x[2]), from: `${blk}:${x[3]}` });
	}
	return m;
}
const prior = readPrior();
// ---- the game files
const fileSites = new Map(); // file -> { text, sites: [{ a, b, name, v, from }] }
const stats = { procs: 0, procsNoDm: 0, procsInit: 0, wholeProc: 0, byGroup: 0, groupsSkipped: 0, literals: 0, named: 0, opaqueSkips: 0, mismatch: 0 };
const missed = []; // [file, line, js tokens, dm tokens] for a line where a define-valued DM token exists but the line didn't align
const dmEntries = JSON.parse(fs.readFileSync(path.join(gameDir, "_dm-lines.json"), "utf8"));

function jsTokens(fn) { // the numeric literals of a proc's body in order: { v (abs), neg, node, a, b }
	const out = [];
	const visit = (n) => {
		if (ts.isNumericLiteral(n)) {
			const p = n.parent;
			if (ts.isElementAccessExpression(p) && p.argumentExpression === n && p.expression.getText() === "f.args") return;
			if (ts.isCallExpression(p) && ts.isPropertyAccessExpression(p.expression) && p.expression.getText() === "rt.next") return;
			if (ts.isPropertyAssignment(p) && p.name === n) return;
			const neg = ts.isPrefixUnaryExpression(p) && p.operator === ts.SyntaxKind.MinusToken;
			out.push({ v: Number(n.text), neg, node: neg ? p : n, lit: n });
			return;
		}
		ts.forEachChild(n, visit);
	};
	visit(fn.body);
	return out;
}
function procExtent(lines, start) { // DM lines [first, last] (1-based) of the proc a `// x.dm:N` line N belongs to (its header, or its first statement)
	const ind = (l) => /^(\t*)/.exec(l)[1].length;
	const code = (l = "") => l.trim() && !/^\s*#/.test(l);
	let hdr = start;
	const first = lines[start - 1] ?? "";
	if (!/^\s*(\/[\w\/]+|(proc|verb)\/\w+)\s*\(/.test(first)) { // a statement: its header is the nearest line above that sits less deep
		let i = start - 1;
		while (i > 0 && !(code(lines[i - 1]) && ind(lines[i - 1]) < ind(first))) i--;
		hdr = Math.max(i, 1);
	}
	const h = lines[hdr - 1] ?? "";
	let end = start;
	for (let i = hdr; i < lines.length; i++) {
		const l = lines[i];
		if (!l.trim()) continue;
		if (/^\s*#/.test(l)) { end = i + 1; continue; }
		if (ind(l) <= ind(h)) break;
		end = i + 1;
	}
	return [hdr, end];
}

function doFile(file) {
	const text = fs.readFileSync(file, "utf8");
	const rel = path.relative(gameDir, file);
	const sf = ts.createSourceFile(file, text, ts.ScriptTarget.ES2022, true, ts.ScriptKind.TS);
	const sites = [];
	const nth = new Map();
	let scope = null;
	for (const st of sf.statements) {
		if (!ts.isExpressionStatement(st) || !ts.isCallExpression(st.expression) || st.expression.expression.getText(sf) !== "rt.def") continue;
		const [pa, fn] = st.expression.arguments;
		if (!pa || !ts.isStringLiteral(pa) || !fn || !ts.isFunctionExpression(fn)) continue;
		const k = (nth.get(pa.text) ?? 0) + 1;
		nth.set(pa.text, k);
		stats.procs++;
		const e = dmEntries[`${rel}|${pa.text}${k > 1 ? `#${k}` : ""}`];
		if (!e || e[0] === "?") { stats.procsNoDm++; continue; }
		if (/\/proc\/(<init>|InitGlobal\w*)$/.test(pa.text)) { stats.procsInit++; continue; } // their DM lines are var lines / a macro: not a proc body
		const dmFile = e[0], lines = dmLines(dmFile), defLine = sf.getLineAndCharacterOfPosition(st.getStart(sf)).line + 1;
		const js = jsTokens(fn);
		stats.literals += js.length;
		const dmAll = [];
		const [hdr, end] = procExtent(lines, e[1]);
		for (let l = hdr; l <= end; l++) for (const t of dmTokens(lines[l - 1] ?? "", dmFile)) dmAll.push({ ...t, line: l });
		if (!dmAll.some((t) => t.name)) continue;
		// the JS literals against the DM tokens, in order: a longest common subsequence by value. The translator adds literals (`? 1 : 0`) and
		// DM folds some (`2|256`); a name goes on only where the two extreme alignments (match as early / as late as possible) agree.
		scope ??= scopeNames(sf);
		const D = dmAll, n = D.length, m = js.length;
		if (process.env.DBG === pa.text) console.log(e[1], end, D.map((d) => (d.name ?? "") + "=" + d.v + "@" + d.line).join(" "), "\nJS", js.map((x) => x.v).join(" "));
		const eq = (i, j) => Math.abs(D[i].v) === js[j].v;
		const dp = Array.from({ length: n + 1 }, () => new Int32Array(m + 1));
		for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i][j] = eq(i, j) ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
		const walk = (early) => {
			const out = new Map();
			let i = 0, j = 0;
			while (i < n && j < m) {
				if (early) {
					if (eq(i, j) && dp[i][j] === dp[i + 1][j + 1] + 1) { out.set(i, j); i++; j++; }
					else if (dp[i + 1][j] >= dp[i][j + 1]) i++; else j++;
				} else {
					if (dp[i + 1][j] === dp[i][j]) i++;
					else if (dp[i][j + 1] === dp[i][j]) j++;
					else { out.set(i, j); i++; j++; }
				}
			}
			return out;
		};
		const w1 = walk(true), w2 = walk(false);
		for (let i = 0; i < n; i++) {
			const d = D[i];
			if (!d.name) continue;
			const j1 = w1.get(i), j2 = w2.get(i);
			if (j1 === undefined || j1 !== j2) { stats.groupsSkipped++; if (flag("--why")) missed.push(`${rel}:${defLine} ${pa.text} ${dmFile.split("/").pop()}:${e[1]}-${end} ${d.name}=${d.v} ${j1 === undefined && j2 === undefined ? "unmatched" : "ambiguous"}; js [${js.map((x) => (x.neg ? "-" : "") + x.v)}]`); continue; }
			const j = js[j1];
			if (d.v < 0 ? !j.neg : j.neg) continue;
			stats.byGroup++;
			const a = j.node.getStart(sf), b = j.node.end;
			const lc = sf.getLineAndCharacterOfPosition(a);
			sites.push({ a, b, name: d.name, v: d.v, from: d.from, line: lc.line + 1, col: lc.character, key: `${rel}|${pa.text}${k > 1 ? `#${k}` : ""}`, defLine });
		}
	}
	if (sites.length) fileSites.set(file, { text, sites, sf });
}

const files = explicit.length ? explicit.map((f) => path.resolve(f)) : walk(gameDir, ".ts");
for (const f of files) doFile(f);

// ---- one value per name (the most used; the __DEFINES one on a tie), then the sites
const perName = new Map();
for (const { sites } of fileSites.values()) for (const s of sites) {
	const m = perName.get(s.name) ?? perName.set(s.name, new Map()).get(s.name);
	const r = m.get(s.v) ?? m.set(s.v, { n: 0, from: s.from }).get(s.v);
	r.n++;
}
const canon = new Map(); // name -> { v, from }
let disagree = 0;
for (const [name, m] of perName) {
	if (prior.has(name)) { canon.set(name, prior.get(name)); if (m.size > 1 || !m.has(prior.get(name).v)) disagree++; continue; }
	const best = [...m].sort((x, y) => (y[1].from.startsWith("code/__DEFINES/") - x[1].from.startsWith("code/__DEFINES/")) || y[1].n - x[1].n)[0];
	canon.set(name, { v: best[0], from: best[1].from });
	if (m.size > 1) disagree++;
}
// a name that already stands bare somewhere in a proc (unbound) would be read as the define: drop it
const had = readDefines(); // names an earlier run put on are fine
const table = new Map([...canon].filter(([k]) => !had.has(k)).map(([k, v]) => [k, String(v.v)]));
const clash = new Map();
for (const f of walk(gameDir, ".ts")) {
	const text = fs.readFileSync(f, "utf8");
	if (![...canon.keys()].some((k) => text.includes(k))) continue;
	const sf = ts.createSourceFile(f, text, ts.ScriptTarget.ES2022, true, ts.ScriptKind.TS), scope = scopeNames(sf);
	const visit = (n) => { if (ts.isIdentifier(n) && isDefineUse(n, table, scope)) clash.set(n.text, (clash.get(n.text) ?? 0) + 1); ts.forEachChild(n, visit); };
	visit(sf);
}
for (const k of clash.keys()) canon.delete(k);
// names a proc or file binds (a local `TRUE`, ...) keep that meaning at their own sites; the build checks scope, so a site where the name is bound is skipped here too
let applied = 0, scopedOut = 0, valueOut = 0;
const used = new Map();
const edits = new Map();
for (const [file, { text, sites, sf }] of fileSites) {
	const scope = scopeNames(sf);
	const keep = [];
	const posToNode = new Map();
	const visit = (n) => { if (ts.isNumericLiteral(n) || ts.isPrefixUnaryExpression(n)) posToNode.set(n.getStart(sf), n); ts.forEachChild(n, visit); };
	visit(sf);
	for (const s of sites) {
		const c = canon.get(s.name);
		if (!c) continue;
		if (c.v !== s.v) { valueOut++; continue; }
		const node = posToNode.get(s.a);
		if (scope.all(node).has(s.name)) { scopedOut++; continue; }
		keep.push(s);
	}
	keep.sort((x, y) => x.a - y.a);
	for (const s of keep) used.set(s.name, (used.get(s.name) ?? 0) + 1);
	applied += keep.length;
	edits.set(file, keep);
}
console.log(`procs ${stats.procs} (${stats.procsNoDm} without DM lines, ${stats.procsInit} <init>/InitGlobal skipped); literals ${stats.literals}; aligned whole-proc ${stats.wholeProc}, by DM line ${stats.byGroup}; lines with names but not aligned ${stats.groupsSkipped} (${stats.opaqueSkips} with a define we can't read)`);
console.log(`names ${canon.size} (${disagree} with more than one value in the game; ${clash.size} dropped, already bare in procs: ${[...clash].map(([k, n]) => k + "x" + n).join(" ")}); sites ${applied} in ${[...edits].filter(([, e]) => e.length).length} files; ${valueOut} dropped for the other value of a name, ${scopedOut} where the name is bound`);
if (showN) {
	const top = [...used].sort((a, b) => b[1] - a[1]);
	console.log("top: " + top.slice(0, showN).map(([k, n]) => `${k}=${canon.get(k).v}x${n}`).join(" "));
}
if (flag("--why")) fs.writeFileSync(path.join(web, "build/pb-defines-missed.txt"), missed.join("\n") + "\n");
if (flag("--check")) process.exit(0);

// ---- write
let wrote = 0;
for (const [file, keep] of edits) {
	if (!keep.length) continue;
	const text = fileSites.get(file).text;
	let out = "", at = 0;
	for (const s of keep) { out += text.slice(at, s.a) + s.name; at = s.b; }
	out += text.slice(at);
	fs.writeFileSync(file, out);
	wrote++;
}
for (const [k, c] of prior) if (!used.has(k)) { used.set(k, 0); canon.set(k, c); }
// _dm-lines.json holds columns of the game text: a line whose number became a longer or shorter name moves the columns after it
const moved = new Map(); // key -> [{ line, col, delta }]
for (const keep of edits.values()) for (const s of keep) (moved.get(s.key) ?? moved.set(s.key, []).get(s.key)).push({ line: s.line, col: s.col, delta: s.name.length - (s.b - s.a), defLine: s.defLine });
const dmFileText = fs.readFileSync(path.join(gameDir, "_dm-lines.json"), "utf8").split("\n");
let rowsMoved = 0;
for (let i = 0; i < dmFileText.length; i++) {
	const m = /^("[^"]+"):(\[.*\])(,?)$/.exec(dmFileText[i]);
	if (!m) continue;
	const ed = moved.get(JSON.parse(m[1]));
	if (!ed) continue;
	const arr = JSON.parse(m[2]);
	for (let j = 2; j < arr.length; j += 3) {
		const c = arr[j + 1], exact = c < 0, col = exact ? -1 - c : c, line = ed[0].defLine + arr[j];
		const shift = ed.reduce((t, x) => t + (x.line === line && x.col < col ? x.delta : 0), 0);
		if (shift) { arr[j + 1] = exact ? -1 - (col + shift) : col + shift; }
	}
	dmFileText[i] = `${m[1]}:${JSON.stringify(arr)}${m[3]}`;
	rowsMoved++;
}
if (!flag("--check")) fs.writeFileSync(path.join(gameDir, "_dm-lines.json"), dmFileText.join("\n"));
console.log(`_dm-lines.json: ${rowsMoved} procs' columns moved`);
const byFile = new Map();
for (const [name, n] of used) { const c = canon.get(name); const f = c.from.replace(/:\d+$/, ""); (byFile.get(f) ?? byFile.set(f, []).get(f)).push([name, c]); }
let d = "// tg's #defines that web/game procs name (phrasebook step 4), written by tools/pb-defines.mjs. Ambient: a proc just writes DEAD; the build (translate-tg) writes the number back,\n// so the bundle is the same. Each block is one tg file; the comment beside a name is its line there.\n";
for (const f of [...byFile.keys()].sort()) {
	d += `\n// ${f}\n`;
	for (const [name, c] of byFile.get(f).sort((x, y) => x[0].localeCompare(y[0]))) d += `declare const ${name}: ${c.v}; // :${c.from.split(":").pop()}\n`;
}
fs.writeFileSync(DEFINES_FILE, d);
console.log(`wrote ${wrote} files and ${path.relative(web, DEFINES_FILE)} (${used.size} names)`);
