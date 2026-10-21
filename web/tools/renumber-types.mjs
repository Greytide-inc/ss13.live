// renumber-types.mjs - After deleting rt.type(N, ...) lines from web/game, close the gaps in the type ids (they must be 0..n-1, in order).
// Usage (from web/): node tools/renumber-types.mjs   [--dry]
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { resolve, join } from "node:path";
const root = resolve(import.meta.dirname, "../game");
const files = [];
(function walk(d) { for (const n of readdirSync(d)) { const p = join(d, n); statSync(p).isDirectory() ? walk(p) : p.endsWith(".ts") && files.push(p); } })(root);
const re = /^(rt\.type\()(\d+)(,)/gm;
const ids = new Set();
const texts = new Map();
for (const f of files) { const s = readFileSync(f, "utf8"); texts.set(f, s); for (const m of s.matchAll(re)) ids.add(+m[2]); }
const sorted = [...ids].sort((a, b) => a - b), map = new Map(sorted.map((id, i) => [id, i]));
let moved = 0;
for (const [f, s] of texts) {
	const t = s.replace(re, (_, a, id, c) => { const n = map.get(+id); if (n !== +id) moved++; return a + n + c; });
	if (t !== s && !process.argv.includes("--dry")) writeFileSync(f, t);
}
console.log(`${sorted.length} types, ${moved} ids renumbered${process.argv.includes("--dry") ? " (dry run)" : ""}`);
