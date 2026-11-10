#!/usr/bin/env node
// pb-dmcheck.mjs - Proof for a robot that moves text inside procs (pb-temps): REV's game files vs the working tree, token by token.
// Usage (from web/): node tools/pb-dmcheck.mjs REV      (REV = the commit before the robot ran)
// Per proc row of game/_dm-lines.json, every word / string / number token (minus `$N`, type names, if / else / let) gets the DM line the
// table gives it (error-lines.ts's lookup). The multiset of (token, DM line) must be the same before and after; differences are printed.
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { relative, resolve } from "node:path";
import { defLine, parseDm, splitKey } from "./remap-dm-cols.mjs";

const web = resolve(import.meta.dirname, "..");
const rev = process.argv[2];
if (!rev) { console.error("usage: node tools/pb-dmcheck.mjs REV"); process.exit(2); }
const git = (a) => execFileSync("git", a, { cwd: web, maxBuffer: 1 << 30 }).toString();
const oldRows = parseDm(git(["show", `${rev}:web/game/_dm-lines.json`])), newRows = parseDm(readFileSync(resolve(web, "game/_dm-lines.json"), "utf8"));
const SKIP = new Set(["if", "else", "let", "any", "Value", "const", "return"]);
const TOK = /"(?:[^"\\]|\\.)*"|[A-Za-z_$][\w$]*|\d+/g;

function lookup(arr, d, line, col) { // line absolute (0-based), as in error-lines.ts' `at`
	let v = arr[1], exact;
	for (let i = 2; i < arr.length; i += 3) {
		const l = d + arr[i], c = arr[i + 1];
		if (c < 0) { if (l === line && -1 - c === col) exact = arr[i + 2]; } else if (l < line || (l === line && c <= col)) v = arr[i + 2];
	}
	return exact ?? v;
}
function tokens(lines, d, end, arr) {
	const out = new Map();
	for (let l = d; l < end; l++) {
		const t = lines[l];
		if (t.trimStart().startsWith("//")) continue;
		for (const m of t.matchAll(TOK)) {
			if (SKIP.has(m[0]) || /^\$\d+$/.test(m[0])) continue;
			const k = `${m[0]} @${lookup(arr, d, l, m.index)}`;
			out.set(k, (out.get(k) ?? 0) + 1);
		}
	}
	return out;
}
const walk = (d, out = []) => { for (const e of readdirSync(d)) { const p = resolve(d, e); if (statSync(p).isDirectory()) walk(p, out); else if (e.endsWith(".ts")) out.push(p); } return out; };
const byFile = (rows) => { const m = new Map(); for (const r of rows) { const { file } = splitKey(r.key); (m.get(file) ?? m.set(file, []).get(file)).push(r); } return m; };
const oldBy = byFile(oldRows), newBy = byFile(newRows);
let bad = 0, procs = 0, same = 0;
const changed = git(["diff", "--name-only", rev, "--", "game"]).split("\n").filter((f) => f.endsWith(".ts")).map((f) => f.replace(/^web\/game\//, ""));
for (const file of changed) {
	let oldText; try { oldText = git(["show", `${rev}:web/game/${file}`]); } catch { continue; }
	const newText = readFileSync(resolve(web, "game", file), "utf8"), ol = oldText.split("\n"), nl = newText.split("\n");
	const pos = (rows, ls) => rows.map((r) => { const { path, nth } = splitKey(r.key); return { r, d: defLine(ls, path, nth), key: r.key }; }).filter((x) => x.d >= 0).sort((a, b) => a.d - b.d);
	const O = pos(oldBy.get(file) ?? [], ol), N = new Map(pos(newBy.get(file) ?? [], nl).map((x, i, a) => [x.key, { ...x, end: a[i + 1]?.d ?? nl.length }]));
	O.forEach((x, i) => {
		const n = N.get(x.key); if (!n || x.r.arr.length < 3) return;
		procs++;
		const a = tokens(ol, x.d, O[i + 1]?.d ?? ol.length, x.r.arr), b = tokens(nl, n.d, n.end, n.r.arr);
		const diff = [];
		for (const k of new Set([...a.keys(), ...b.keys()])) if ((a.get(k) ?? 0) !== (b.get(k) ?? 0)) diff.push(`${k} ${a.get(k) ?? 0}->${b.get(k) ?? 0}`);
		if (diff.length) { bad++; if (bad <= 15) console.log(`${x.key}: ${diff.slice(0, 6).join("; ")}`); } else same++;
	});
}
console.log(`pb-dmcheck: ${procs} procs compared, ${same} same, ${bad} differ`);
process.exit(bad ? 1 : 0);
