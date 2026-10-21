// extract-screen-locs - Pulls every distinct `screen_loc` string literal used in tg's own DM
// source (code/_onclick/hud/*.dm, code/__DEFINES/*.dm, and any other screen_loc assignment in
// code/) so screen-loc.test.ts can run the real parser (src/render/screen-loc.ts) against every
// form tg 2017 actually uses, not just hand-picked examples.
//
// Two kinds of literal are collected, both written to tests/draw/screen-locs.json (committed --
// regenerate with `npm run extract-screen-locs` if tg's DM source changes):
//   - "static": no DM string interpolation ("[...]") -- parseable as-is.
//   - "dynamic": contains "[...]" (a runtime expression, e.g. `"CENTER+[x_off]:16,SOUTH:5"` from
//     ui_hand_position()) -- not a real screen_loc string until BYOND substitutes the bracketed
//     expression with a number at runtime. The test substitutes a placeholder number for every
//     "[...]" before parsing, to still exercise the surrounding syntax (colon/offset/range forms)
//     without needing a real DM evaluator.
//
// Usage: npm run extract-screen-locs (run from web/, needs the repo's code/ directory at ../code
// relative to web/).

import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

// build/dist/src/tools/extract-screen-locs.js -> up 4 to web/
let webDir = dirname(fileURLToPath(import.meta.url));
for (let i = 0; i < 4; i++) webDir = dirname(webDir);
const repoRoot = dirname(webDir);
const codeDir = resolve(repoRoot, "code");
const outPath = resolve(webDir, "tests/draw/screen-locs.json");

function walk(dir: string, out: string[]): void {
	for (const name of readdirSync(dir)) {
		const full = join(dir, name);
		const st = statSync(full);
		if (st.isDirectory()) walk(full, out);
		else if (name.endsWith(".dm")) out.push(full);
	}
}

const files: string[] = [];
walk(codeDir, files);

const values = new Set<string>();

// 1) Any `screen_loc = "..."` or `screen_loc="..."` assignment anywhere in code/.
const assignRe = /screen_loc\s*=\s*"([^"]*)"/g;
// 2) `#define ui_xxx "..."` (the named screen_loc constants in _onclick/hud/_defines.dm).
const defineRe = /^#define\s+ui_\w+\s+"([^"]*)"/gm;
// 3) `return"..."` / `return "..."` inside the ui_*_position() procs in the same file (these
//    build a screen_loc string with a runtime x/y offset baked in via string interpolation).
const returnRe = /return\s*"([^"]*)"/g;

for (const file of files) {
	const text = readFileSync(file, "utf8");
	for (const m of text.matchAll(assignRe)) values.add(m[1]!);
	if (file.endsWith("_defines.dm") && file.includes("_onclick/hud")) {
		for (const m of text.matchAll(defineRe)) values.add(m[1]!);
		for (const m of text.matchAll(returnRe)) values.add(m[1]!);
	}
}

const entries = [...values].sort().map((raw) => ({
	raw,
	dynamic: raw.includes("["),
}));

writeFileSync(outPath, JSON.stringify({ builtAt: new Date().toISOString(), entries }, null, "\t") + "\n");
console.log(`wrote ${entries.length} distinct screen_loc values (${entries.filter((e) => e.dynamic).length} dynamic) to ${outPath}`);
