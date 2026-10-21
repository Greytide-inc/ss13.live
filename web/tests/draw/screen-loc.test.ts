// screen-loc.test - Checks src/render/screen-loc.ts's parseScreenLoc() against:
//   1) a hand-computed table of >=20 distinct screen_loc forms, at view 15x15 (tg's world.view=7),
//      each checked against an expected result computed by hand from BYOND's documented rules;
//   2) every distinct screen_loc value actually found in tg's own DM source
//      (tests/draw/screen-locs.json, produced by `npm run extract-screen-locs`), checking that
//      none of them errors (dynamic ones have their "[...]" runtime expressions replaced with a
//      placeholder number first, since those aren't real values until BYOND substitutes them).
//
// Usage: part of npm test (tests/all.mjs)

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { parseScreenLoc, isScreenLocError, type ScreenLocPlacement } from "../../src/render/screen-loc.js";

// build/dist/tests/draw/screen-loc.test.js -> up 4 to web/
let webDir = dirname(fileURLToPath(import.meta.url));
for (let i = 0; i < 4; i++) webDir = dirname(webDir);
const extractedPath = resolve(webDir, "tests/draw/screen-locs.json");

const VIEW_W = 15;
const VIEW_H = 15;

let failures = 0;
function fail(msg: string): void {
	failures++;
	console.log(`FAIL ${msg}`);
}

function coord(tile: number, pixel = 0) {
	return { tile, pixel };
}

function place(x: { tile: number; pixel: number }, y: { tile: number; pixel: number }, toX?: { tile: number; pixel: number }, toY?: { tile: number; pixel: number }): ScreenLocPlacement {
	const p: ScreenLocPlacement = { x, y };
	if (toX) p.toX = toX;
	if (toY) p.toY = toY;
	return p;
}

interface Case {
	name: string;
	input: string;
	expect: { placements: ScreenLocPlacement[]; mapName?: string } | "error" | "empty";
}

// --- 1) hand-computed cases, view 15x15 (CENTER = tile 8; WEST/SOUTH = 1; EAST/NORTH = 15) ------
const cases: Case[] = [
	{ name: "plain tile pair", input: "1,1", expect: { placements: [place(coord(1), coord(1))] } },
	{ name: "plain tile pair, no spaces around =", input: "1,0", expect: { placements: [place(coord(1), coord(0))] } },
	{ name: "west/south keyword pair (ui_inventory)", input: "WEST:6,SOUTH:5", expect: { placements: [place(coord(1, 6), coord(1, 5))] } },
	{ name: "center with pixel (ui_health)", input: "EAST-1:28,CENTER-1:15", expect: { placements: [place(coord(14, 28), coord(7, 15))] } },
	{ name: "center offset both axes (ui_belt)", input: "CENTER-3:14,SOUTH:5", expect: { placements: [place(coord(5, 14), coord(1, 5))] } },
	{ name: "negative pixel offset (ui_alien_language_menu clone)", input: "WEST:6,NORTH:-3", expect: { placements: [place(coord(1, 6), coord(15, -3))] } },
	{ name: "CENTER+-1 (tg's ui_hand_position right hand, 3j)", input: "CENTER+-1:16,SOUTH+0:5", expect: { placements: [place(coord(7, 16), coord(1, 5))] } },
	{ name: "bare CENTER,CENTER", input: "CENTER,CENTER", expect: { placements: [place(coord(8), coord(8))] } },
	{
		name: "bare NORTH,WEST (direction keywords self-identify axis, order-independent per BYOND docs)",
		input: "NORTH,WEST",
		expect: { placements: [place(coord(1), coord(15))] },
	},
	{
		name: "y-then-x order, axis self-identified (ui_ai_core: SOUTH:6,WEST means x=WEST,y=SOUTH:6)",
		input: "SOUTH:6,WEST",
		expect: { placements: [place(coord(1), coord(1, 6))] },
	},
	{ name: "keyword offset without colon, y-then-x order (ui_ai_camera_light)", input: "SOUTH:6,WEST+3", expect: { placements: [place(coord(4), coord(1, 6))] } },
	{ name: "double-digit multi-char offset (ui_alert1)", input: "EAST-1:28,CENTER+5:27", expect: { placements: [place(coord(14, 28), coord(13, 27))] } },
	{ name: "extra internal spaces (ui_borg_sensor)", input: "CENTER-3:16, SOUTH:5", expect: { placements: [place(coord(5, 16), coord(1, 5))] } },
	{ name: "extra spaces before colon (ui_inv2)", input: "CENTER-1  :16,SOUTH:5", expect: { placements: [place(coord(7, 16), coord(1, 5))] } },
	{
		name: "spaces around colon and comma, y-then-x order (ui_ghost_pai: SOUTH anchors y, CENTER+2 is x)",
		input: "SOUTH: 6, CENTER+2:24",
		expect: { placements: [place(coord(10, 24), coord(1, 6))] },
	},
	{ name: "empty string means hidden", input: "", expect: "empty" },
	{ name: "empty pixel offset after colon (storage boxes template)", input: "5:,7", expect: { placements: [place(coord(5, 0), coord(7))] } },
	{ name: "range form, plain numbers", input: "7,7 to 10,8", expect: { placements: [place(coord(7), coord(7), coord(10), coord(8))] } },
	{ name: "range form, keywords (fullscreen full-tile overlays)", input: "WEST,SOUTH to EAST,NORTH", expect: { placements: [place(coord(1), coord(1), coord(15), coord(15))] } },
	{ name: "range form with pixel offsets", input: "4:16,2:16 to 19:16,17:16", expect: { placements: [place(coord(4, 16), coord(2, 16), coord(19, 16), coord(17, 16))] } },
	{
		name: "single word CENTER (plane_master.dm/click.dm: centers on both axes)",
		input: "CENTER",
		expect: { placements: [place(coord(8), coord(8))] },
	},
	{ name: "map-name prefix", input: "hudmap:1,1", expect: { placements: [place(coord(1), coord(1))], mapName: "hudmap" } },
	{ name: "unrecognised garbage", input: "not a screen loc", expect: "error" },
	{ name: "double-negative-looking keyword offset (ui_deitypower)", input: "EAST-1:28,CENTER-1:15", expect: { placements: [place(coord(14, 28), coord(7, 15))] } },
	{ name: "flat multi-pair list (documented BYOND form, unused by tg)", input: "1,1,15,15", expect: { placements: [place(coord(1), coord(1)), place(coord(15), coord(15))] } },
];

for (const c of cases) {
	const result = parseScreenLoc(c.input, VIEW_W, VIEW_H);
	if (c.expect === "error") {
		if (!isScreenLocError(result)) fail(`${c.name}: expected an error, got ${JSON.stringify(result)}`);
		continue;
	}
	if (isScreenLocError(result)) {
		fail(`${c.name}: expected success, got error "${result.error}" for "${c.input}"`);
		continue;
	}
	if (c.expect === "empty") {
		if (result.placements.length !== 0) fail(`${c.name}: expected no placements, got ${JSON.stringify(result.placements)}`);
		continue;
	}
	const got = JSON.stringify(result.placements);
	const want = JSON.stringify(c.expect.placements);
	if (got !== want) fail(`${c.name}: placements mismatch\n  got:  ${got}\n  want: ${want}`);
	if (c.expect.mapName !== undefined && result.mapName !== c.expect.mapName) {
		fail(`${c.name}: expected mapName "${c.expect.mapName}", got ${JSON.stringify(result.mapName)}`);
	}
}
console.log(`${cases.length} hand-computed cases checked`);

// --- 2) every screen_loc value tg's own source actually uses --------------------------------
interface Extracted {
	entries: { raw: string; dynamic: boolean }[];
}
let extracted: Extracted;
try {
	extracted = JSON.parse(readFileSync(extractedPath, "utf8"));
} catch (e) {
	fail(`could not read ${extractedPath} -- run "npm run extract-screen-locs" first (${(e as Error).message})`);
	extracted = { entries: [] };
}

// Replaces every top-level "[...]" DM interpolation with a placeholder integer, respecting nesting
// (e.g. movable_screen_objects.dm's "[screen_loc_X[1]]" is one interpolation unit, a list index
// expression, not two separate "[...]" runs -- a naive non-nesting regex would mis-split it).
function substituteBrackets(s: string): string {
	let out = "";
	let i = 0;
	while (i < s.length) {
		if (s[i] === "[") {
			let depth = 1;
			let j = i + 1;
			while (j < s.length && depth > 0) {
				if (s[j] === "[") depth++;
				else if (s[j] === "]") depth--;
				j++;
			}
			out += "3";
			i = j;
		} else {
			out += s[i];
			i++;
		}
	}
	return out;
}

let dynamicSubstituted = 0;
for (const { raw, dynamic } of extracted.entries) {
	// Dynamic values contain unresolved DM interpolation, e.g. "CENTER+[x_off]:16,SOUTH:5" --
	// substitute a placeholder integer for every "[...]" so the surrounding syntax (which is real,
	// tg-authored screen_loc structure) still gets exercised.
	const value = dynamic ? substituteBrackets(raw) : raw;
	if (dynamic) dynamicSubstituted++;
	const result = parseScreenLoc(value, VIEW_W, VIEW_H);
	if (isScreenLocError(result)) {
		fail(`extracted value errored: raw="${raw}" substituted="${value}" -> ${result.error}`);
	}
}
console.log(`${extracted.entries.length} extracted tg screen_loc values checked (${dynamicSubstituted} dynamic, placeholder-substituted), 0 errors expected`);

console.log(failures === 0 ? "\nALL SCREEN-LOC TESTS PASSED" : `\n${failures} screen-loc test failure(s)`);
if (failures) process.exitCode = 1;
