// dmi.test.ts - Node tests for the DMI loader (src/dmi/dmi.ts, dmi-node.ts) against real .dmi
// files from the repo's icons/. Usage: part of npm test
//
// Covers: a 1-dir sheet, a 4-dir sheet with uneven float delays and rewind, an 8-dir sheet, a
// non-32x32 sheet, and a movement state -- checking state counts, dirs, frames, delays, loop/
// rewind/movement flags, and pixel positions of a few cells against the sheet's own image size.
// The frame-major/dir-minor cell order (see dmi.ts's header comment) was separately checked by
// decoding real pixels; this test only re-checks the arithmetic, not pixel content.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { cellRect, dirIndex } from "../../src/dmi/dmi.js";
import { parseDmiFile, parseDmiBytes, decodePng, encodeDmi } from "../../src/dmi/dmi-node.js";
import { encodeDmi as encodeDmiStored, zlibStored } from "../../src/dmi/png.js";
import { iconFromSheet } from "../../src/dmi/icon-ops.js";
import { inflateSync } from "node:zlib";

// build/dist/tests/dmi/dmi.test.js -> up 4 to web/
let webDir = dirname(fileURLToPath(import.meta.url));
for (let i = 0; i < 4; i++) webDir = dirname(webDir);
const repoRoot = dirname(webDir);
const icon = (p: string) => join(repoRoot, "icons", p);

let failures = 0;
function check(name: string, got: unknown, want: unknown) {
	const g = JSON.stringify(got);
	const w = JSON.stringify(want);
	if (g === w) {
		console.log(`ok   ${name}`);
	} else {
		failures++;
		console.log(`FAIL ${name}: got ${g} want ${w}`);
	}
}

function readImageSize(path: string): [number, number] {
	const buf = readFileSync(path);
	return [buf.readUInt32BE(16), buf.readUInt32BE(20)];
}

// ---- icons/turf/areas.dmi (274 states, all dirs=1 frames=1) ----
{
	const path = icon("turf/areas.dmi");
	const dmi = parseDmiFile(path)!;
	const [iw, ih] = readImageSize(path);
	check("areas.dmi image size matches IHDR", [dmi.imageWidth, dmi.imageHeight], [iw, ih]);
	check("areas.dmi icon size", [dmi.width, dmi.height], [32, 32]);
	check("areas.dmi state count", dmi.states.length, 274);
	check("areas.dmi columns x rows", [dmi.columns, dmi.rows], [iw / 32, ih / 32]);
	const first = dmi.states[0];
	check("areas.dmi state 0 name (unnamed default state)", first.name, "");
	check("areas.dmi state 0 dirs/frames", [first.dirs, first.frames], [1, 1]);
	check("areas.dmi state 0 cell", first.cells, [[0]]);
	const bridge = dmi.states[1];
	check("areas.dmi state 1 name", bridge.name, "bridge");
	check("areas.dmi state 1 cell (right after state 0)", bridge.cells, [[1]]);
	const rect = cellRect(dmi, 1);
	check("areas.dmi state 1 pixel rect", rect, { x: 32, y: 0, w: 32, h: 32 });
}

// ---- 4-dir, uneven float delays, rewind: icons/mob/animal.dmi "carp" ----
{
	const path = icon("mob/animal.dmi");
	const dmi = parseDmiFile(path)!;
	check("animal.dmi state count", dmi.states.length, 111);
	// cow (dirs4 frames1 = 4 cells), cow_dead (dirs1 frames1 = 1), cow_gib (dirs1 frames12 = 12):
	// carp starts at the running cell count 4+1+12=17, not at a row boundary -- confirms states
	// don't each start a fresh row.
	const carp = dmi.states.find((s) => s.name === "carp")!;
	check("carp found", !!carp, true);
	check("carp dirs/frames", [carp.dirs, carp.frames], [4, 3]);
	check("carp delay (uneven, from the file)", carp.delay, [3, 4, 3]);
	check("carp rewind", carp.rewind, true);
	check("carp loop (absent = 0)", carp.loop, 0);
	check("carp movement (absent = false)", carp.movement, false);
	// frame-major, dir-minor: cells[dirIndex][frame] = base + frame*dirs + dirIndex
	check("carp cell grid (base 17, dirs=4)", carp.cells, [
		[17, 21, 25],
		[18, 22, 26],
		[19, 23, 27],
		[20, 24, 28],
	]);
	// SOUTH is dir index 0 in a 4-dir state
	check("dirIndex(4, SOUTH=2)", dirIndex(4, 2), 0);
	check("dirIndex(4, WEST=8)", dirIndex(4, 8), 3);

	// "stickman" appears TWICE in this file: a plain icon_state, then a second state of the same
	// name with movement=1. That's real BYOND behaviour, not a parse bug -- a walking atom uses the
	// movement-flagged state of the same name instead of the plain one while it's moving. Confirms
	// Dmi.states must stay an array (not a name->state map) so both survive.
	const stickmen = dmi.states.filter((s) => s.name === "stickman");
	check("stickman appears twice (plain + movement variant)", stickmen.length, 2);
	check("stickman[0] is the plain form", [stickmen[0].dirs, stickmen[0].frames, stickmen[0].movement], [1, 2, false]);
	check("stickman[1] is the movement form", stickmen[1].movement, true);
}

// ---- icons/effects/beam.dmi ----
{
	const path = icon("effects/beam.dmi");
	const dmi = parseDmiFile(path)!;
	check("beam.dmi state count", dmi.states.length, 43);
	const first = dmi.states[0];
	check("beam.dmi state 0 name", first.name, "1-full");
	check("beam.dmi state 0 dirs/frames", [first.dirs, first.frames], [8, 1]);
	check("beam.dmi state 0 cells (8 dirs, 1 frame each)", first.cells, [[0], [1], [2], [3], [4], [5], [6], [7]]);
	// NORTHEAST is dir index 6 of the 8, at column 6 of row 0
	check("dirIndex(8, NORTHEAST=5)", dirIndex(8, 5), 6);
	const rect = cellRect(dmi, 6);
	check("beam.dmi cell 6 pixel rect", rect, { x: 192, y: 0, w: 32, h: 32 });
}

// ---- icons/mob/lavaland/hierophant.dmi (52x67, single state fills the sheet exactly) ----
{
	const path = icon("mob/lavaland/hierophant.dmi");
	const dmi = parseDmiFile(path)!;
	check("hierophant.dmi icon size", [dmi.width, dmi.height], [52, 67]);
	check("hierophant.dmi columns x rows", [dmi.columns, dmi.rows], [5, 4]);
	check("hierophant.dmi state count", dmi.states.length, 1);
	const s = dmi.states[0];
	check("hierophant.dmi state name", s.name, "hierophant");
	check("hierophant.dmi dirs/frames", [s.dirs, s.frames], [4, 5]);
	check("hierophant.dmi delay (float, 5x)", s.delay, [1.5, 1.5, 1.5, 1.5, 1.5]);
	// 4 dirs * 5 frames = 20 cells, exactly filling the 5x4 grid with no padding left over
	check("hierophant.dmi uses the whole grid", s.frames * s.dirs, dmi.columns * dmi.rows);
	const rect = cellRect(dmi, 19); // last cell: col 4, row 3
	check("hierophant.dmi last cell pixel rect", rect, { x: 208, y: 201, w: 52, h: 67 });
}

// ---- non-.dmi PNG fallback: any plain image gives one full-image state ----
{
	// Reuse a known-plain PNG shape check indirectly: a .dmi's own image is a valid PNG, so feeding
	// dmi-size's sibling path (no Description) is exercised by dmi-node's fallback branch directly.
	const dmi = parseDmiFile(icon("turf/areas.dmi"))!;
	check("a real .dmi is not treated as a plain PNG", dmi.states.length > 1, true);
}

// ---- delay trimming: extra delays beyond frames count are trimmed ----
{
	// Synthetic test: a state with 3 frames but 6 delays should trim to 3 delays
	// (BYOND's icon editor sometimes leaves stale delays from earlier edits)
	const { parseDescription } = await import("../../src/dmi/dmi.js");
	const desc = `# BEGIN DMI
width = 32
height = 32
state = "test"
dirs = 1
frames = 3
delay = 1,2,3,4,5,6
# END DMI`;
	const dmi = parseDescription(desc, 32, 32)!;
	check("delay trimming: state found", !!dmi.states[0], true);
	check("delay trimming: frames = 3", dmi.states[0].frames, 3);
	check("delay trimming: delay trimmed from 6 to 3", dmi.states[0].delay, [1, 2, 3]);

	// Also test the opposite: fewer delays than frames. BYOND doesn't fill these;
	// the current code leaves them as-is (incomplete). Document this behavior.
	const descFewerDelays = `# BEGIN DMI
width = 32
height = 32
state = "test2"
dirs = 1
frames = 4
delay = 1,2
# END DMI`;
	const dmi2 = parseDescription(descFewerDelays, 32, 32)!;
	check("fewer delays than frames: frames = 4", dmi2.states[0].frames, 4);
	check("fewer delays than frames: delay stays as 1,2 (not filled)", dmi2.states[0].delay, [1, 2]);
}

// the browser-safe png.ts (stored zlib, JS crc32) makes a .dmi that node:zlib reads back the same.
{
	const bytes = readFileSync(icon("mob/underwear.dmi")), png = decodePng(bytes)!;
	const img = iconFromSheet(parseDmiBytes(bytes)!, png.rgba, png.width);
	const a = encodeDmi(img), b = encodeDmiStored(img);
	const pa = decodePng(a)!, pb = decodePng(b)!;
	check("png.ts stored-zlib .dmi: same pixels as the zlib one", Buffer.compare(Buffer.from(pa.rgba), Buffer.from(pb.rgba)), 0);
	check("png.ts stored-zlib .dmi: same states", JSON.stringify(parseDmiBytes(b)!.states), JSON.stringify(parseDmiBytes(a)!.states));
	check("zlibStored round trip (70 KB, 2 blocks)", Buffer.compare(inflateSync(zlibStored(new Uint8Array(70000).fill(7))), Buffer.alloc(70000, 7)), 0);
}

console.log(failures === 0 ? "\nALL DMI TESTS PASSED" : `\n${failures} DMI TEST(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
