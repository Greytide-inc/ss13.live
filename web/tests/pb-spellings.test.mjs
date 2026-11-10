// pb-spellings.test.mjs - phrasebook's ratchet: counts each engine spelling the game files still
// borrow (`rt.istype(`, `return f.dot`...) in web/game and fails if one went up. A phrasebook step lowers its own line to
// the new count. Counts are occurrences, not lines. No build needed. Usage (from web/): node tests/pb-spellings.test.mjs
import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const FLOOR = [
	// step 2, headers; step 3, file tops
	["translated once from the DM", /translated once from the DM/g, 0],
	["build/dist runtime import", /build\/dist\/src\/translate\/runtime\.js/g, 0],
	["full rt destructure", /^const \{ T, P, g, truthy, isEqual, add, subtract, multiply, divide, fmt \} = rt;$/gm, 0],
	// defines (step 4): the bit calls stay calls (DM's are 16-bit), only their numbers got names
	["rt.bitAnd(", /\brt\.bitAnd\(/g, 1735],
	["rt.bitOr(", /\brt\.bitOr\(/g, 102],
	// step 5, types
	["rt.istype(", /\brt\.istype\(/g, 5976],
	['T("/...")', /\bT\("\//g, 24154],
	// step 6, lists
	["rt.index(", /\brt\.index\(/g, 4175],
	["rt.setAt(", /\brt\.setAt\(/g, 2548],
	["rt.at(", /\brt\.at\(/g, 2496],
	["rt.isIn(", /\brt\.isIn\(/g, 1297],
	// step 7, engine helpers
	["rt.getStep(", /\brt\.getStep\(/g, 2366],
	["rt.worldTime", /\brt\.worldTime\b/g, 993],
	["rt.world()", /\brt\.world\(\)/g, 940],
	["rt.locateIn(", /\brt\.locateIn\(/g, 622],
	["rt.op(", /\brt\.op\(/g, 1286],
	["g.op(", /\bg\.op\(/g, 513],
	// step 8, return values and arguments
	["return f.dot", /\breturn f\.dot\b/g, 33259],
	["f.args[", /\bf\.args\[/g, 3525],
	// step 9, spawns
	["rt.tail(", /\brt\.tail\(/g, 261],
	// step 10, text macros
	["fmt(", /\bfmt\(/g, 2762],
	// step 11, one spelling per thing
	["rt.callSrc(", /\brt\.callSrc\(/g, 25],
	["rt.call(", /\brt\.call\(/g, 198],
	["rt.fv(", /\brt\.fv\(/g, 75],
	["rt.forList(", /\brt\.forList\(/g, 61],
	["f.src", /\bf\.src\b/g, 572],
	// step 12, scratch values
	["$N", /\$\d+\b/g, 8084],
	["rt.sv(", /\brt\.sv\(/g, 331],
	// step 13, tidy: `else {` that opens with an `if` (the ones left have more after it)
	["else { if", /else \{\n\t*if \(/g, 559],
];

const files = [];
const walk = (dir) => {
	for (const e of readdirSync(dir, { withFileTypes: true })) {
		const p = join(dir, e.name);
		if (e.isDirectory()) walk(p);
		else if (e.name.endsWith(".ts")) files.push(p);
	}
};
walk(resolve(import.meta.dirname, "../game"));
const text = files.map((f) => readFileSync(f, "utf8")).join("\n");

let failures = 0;
for (const [name, re, floor] of FLOOR) {
	const n = (text.match(re) ?? []).length;
	if (n > floor) { failures++; console.log(`FAIL ${name}: ${n}, was ${floor} (a step lowers it, nothing raises it)`); }
	else if (n < floor) console.log(`lower ${name} to ${n} (was ${floor})`);
}
console.log(`${FLOOR.length - failures}/${FLOOR.length} spellings at or under their floor (${files.length} files)`);
process.exit(failures ? 1 : 0);
