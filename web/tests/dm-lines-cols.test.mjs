// dm-lines-cols.test.mjs - Guard: every column entry in game/_dm-lines.json must still sit on a token start of its current game line.
// Codemods that change text within lines must run `node tools/remap-dm-cols.mjs <commit before the codemod>` (see web/game/README.md);
// else error-lines.ts reports the wrong DM line. Cheap check: the character at the column is not in the middle of an identifier/number
// (previous char not [\w$]) and inside the line; exact (negative) columns also need to sit on an identifier/bracket/quote start (a call name).
// Usage (from web/): node tests/dm-lines-cols.test.mjs [ALT_DM_JSON_PATH [GAME_DIR]]   (alt files are for showing it fails on stale data)
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { colOf, defLine, parseDm, splitKey } from "../tools/remap-dm-cols.mjs";

const web = resolve(import.meta.dirname, "..");
const dmPath = process.argv[2] ?? resolve(web, "game/_dm-lines.json"), gameDir = process.argv[3] ?? resolve(web, "game");
const rows = parseDm(readFileSync(dmPath, "utf8"));
const files = new Map();
const linesOf = (f) => { if (!files.has(f)) files.set(f, readFileSync(resolve(gameDir, f), "utf8").split("\n")); return files.get(f); };
// 281 entries were already mid-identifier when translation wrote them (about 257, long fmt/P() lines) and 24 drifted in the remap; stale data gives ~33000.
// 263 on 2026-10-07 after blanking 7 hand-rewritten procs that had drifted it to 398.
const BUDGET = 275; // 263 + a little slack: the 7 unblanked rewrites found on 2026-10-07 added 3-36 each, so most fail on the first one
let total = 0, bad = 0, noDef = 0;
const shown = [];
for (const r of rows) {
	if (r.arr.length < 3) continue;
	const { file, path, nth } = splitKey(r.key), lines = linesOf(file), d = defLine(lines, path, nth);
	if (d < 0) { noDef++; continue; }
	for (let i = 2; i < r.arr.length; i += 3) {
		const col = colOf(r.arr[i + 1]);
		if (col === null) continue;
		total++;
		const line = lines[d + r.arr[i]] ?? "", ch = line[col] ?? "", prev = line[col - 1] ?? "";
		const ok = col <= line.length && !(/[\w$]/.test(ch) && /[\w$]/.test(prev)) && !(r.arr[i + 1] < 0 && !/[\w$(\[!"'`-]/.test(ch));
		if (!ok) { bad++; if (shown.length < 5) shown.push(`${r.key} line+${r.arr[i]} col ${col}: ${JSON.stringify(line.slice(Math.max(0, col - 15), col))}|${JSON.stringify(line.slice(col, col + 15))}`); }
	}
}
console.log(`dm-lines-cols: ${total} column entries, ${bad} not at a token start (budget ${BUDGET}), ${noDef} procs without rt.def`);
for (const s of shown) console.log("  e.g. " + s);
if (bad > BUDGET || noDef) { console.log("dm-lines-cols: FAILED (a proc rewritten by hand: set its row in game/_dm-lines.json to [\"?\",0]; a codemod: run tools/remap-dm-cols.mjs <commit before the codemod>. See game/README.md)"); process.exit(1); }
console.log("dm-lines-cols: OK");
