#!/usr/bin/env node
// gas-diff - Compares two gas dumps (from the `gasdump` scenario action) exactly and lists the first differences; exit 0 identical, 1 differ.
// Usage: node tools/gas-diff.mjs A.json B.json   or   node tools/gas-diff.mjs DIR_A DIR_B  (every NAME.json in both dirs)
import { readFileSync, readdirSync, statSync } from "node:fs";
const [a, b] = process.argv.slice(2);
if (!a || !b) { console.error("usage: gas-diff.mjs A B (two files or two dirs)"); process.exit(2); }
const pairs = [];
if (statSync(a).isDirectory()) {
	const names = new Set([...readdirSync(a), ...readdirSync(b)].filter((f) => f.endsWith(".json")));
	for (const n of [...names].sort()) pairs.push([n, `${a}/${n}`, `${b}/${n}`]);
} else pairs.push(["", a, b]);
let count = 0;
const shown = [];
const note = (what) => { if (count++ < 20) shown.push(what); };
const walk = (path, x, y) => {
	if (x && y && typeof x === "object" && typeof y === "object") {
		for (const k of new Set([...Object.keys(x), ...Object.keys(y)])) {
			if (!(k in x)) note(`${path}/${k}: only in B: ${JSON.stringify(y[k])}`);
			else if (!(k in y)) note(`${path}/${k}: only in A: ${JSON.stringify(x[k])}`);
			else walk(`${path}/${k}`, x[k], y[k]);
		}
	} else if (!Object.is(x, y)) note(`${path}: ${JSON.stringify(x)} -> ${JSON.stringify(y)}`);
};
for (const [n, fa, fb] of pairs) {
	let ja, jb;
	try { ja = JSON.parse(readFileSync(fa, "utf8")); jb = JSON.parse(readFileSync(fb, "utf8")); } catch (e) { note(`${n}: cannot read ${fa} / ${fb}: ${e.message}`); continue; }
	walk(n, ja, jb);
}
if (count) { console.log(shown.join("\n")); console.log(`gas-diff: ${count} difference${count === 1 ? "" : "s"}${count > 20 ? " (first 20 shown)" : ""}`); process.exit(1); }
console.log(`gas-diff: identical (${pairs.length} dump${pairs.length === 1 ? "" : "s"})`);
