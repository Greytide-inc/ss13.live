// draw.test - Automated check that every icon/icon_state pair produced by
// appearance-dump.ts (web/build/2c/appearances.json) resolves to a real state in its .dmi, via the
// Node DMI loader (src/dmi/dmi-node.ts). Catches typos in hand-picked type paths/icon_states before
// they reach the drawing page. Does not check dir/frame validity, just "does this state exist".
//
// Usage: part of npm test (needs web/build/2c/appearances.json: run npm run appearance-dump first).

import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { parseDmiFile, decodePng } from "../../src/dmi/dmi-node.js";
import type { BuiltAppearance } from "../../src/appearance/appearance.js";
import { applyColorMatrix } from "../../src/render/color-matrix.js";

// build/dist/tests/draw/draw.test.js -> up 4 to web/
let webDir = dirname(fileURLToPath(import.meta.url));
for (let i = 0; i < 4; i++) webDir = dirname(webDir);
const repoRoot = dirname(webDir);
const dumpPath = resolve(repoRoot, "web/build/2c/appearances.json");

interface Dump {
	atoms: { id: string; label: string; appearance: BuiltAppearance }[];
	scene: { tiles: { x: number; y: number; appearances: BuiltAppearance[] }[] };
}

let failures = 0;
function fail(msg: string): void {
	failures++;
	console.log(`FAIL ${msg}`);
}

// --- color-matrix math (station-client.ts's lighting-plane renderer) -----------------
//
// BYOND matrix format check: an identity matrix (each output channel equals its own input channel,
// no constant) must leave every pixel unchanged.
{
	const identity = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0];
	const px = new Uint8ClampedArray([10, 20, 30, 40]);
	applyColorMatrix(px, identity);
	if (px[0] !== 10 || px[1] !== 20 || px[2] !== 30 || px[3] !== 40) {
		fail(`color matrix: identity changed (10,20,30,40) to (${px[0]},${px[1]},${px[2]},${px[3]})`);
	} else {
		console.log("color matrix: identity leaves pixels unchanged -- OK");
	}
}

// A real tg-shaped lighting matrix (code/modules/lighting/lighting_object.dm's update(): row0=R-input
// ("cr"), row1=G-input ("cg"), row2=B-input ("cb"), row3=A-input ("ca"), row4=constant, alpha column
// forced to 1). icons/effects/lighting_object.dmi's "" state has, at its top-left corner pixel, a
// pure-blue-channel input (0, 0, 255, 1) (confirmed by inspecting the .dmi directly), so with the red
// corner cr=(1,0.2,0.2), green corner cg=(0.2,1,0.2), blue corner cb=(0.2,0.2,1) and alpha corner
// ca=(0,0,0), that corner's output should equal cb's own color (0.2,0.2,1), forced fully opaque.
{
	const cr = [1, 0.2, 0.2], cg = [0.2, 1, 0.2], cb = [0.2, 0.2, 1], ca = [0, 0, 0];
	const lightingMatrix = [
		cr[0], cr[1], cr[2], 0,
		cg[0], cg[1], cg[2], 0,
		cb[0], cb[1], cb[2], 0,
		ca[0], ca[1], ca[2], 0,
		0, 0, 0, 1,
	];
	const topLeftCorner = new Uint8ClampedArray([0, 0, 255, 1]); // pure blue-channel input
	applyColorMatrix(topLeftCorner, lightingMatrix);
	const expected = [Math.round(cb[0] * 255), Math.round(cb[1] * 255), Math.round(cb[2] * 255), 255];
	const got = [topLeftCorner[0], topLeftCorner[1], topLeftCorner[2], topLeftCorner[3]];
	if (got[0] !== expected[0] || got[1] !== expected[1] || got[2] !== expected[2] || got[3] !== expected[3]) {
		fail(`color matrix: lighting matrix on blue-channel corner gave (${got.join(",")}), expected (${expected.join(",")})`);
	} else {
		console.log("color matrix: tg lighting matrix on a known corner pixel gives the expected color -- OK");
	}
}

// a space-side wall exactly as BYOND 511 lit it (web/reference/lighting-probe, probe tile a8 105,66: a
// flashlight-strength lamp on the space tile west of it). Its corners: SW 0.694, SE 0.532, NE and NW 0 (those
// corners touch only walls and space, which give tg's lights no corners). Drawn through the real
// lighting_object.dmi base state, the wall's top edge must come out black and its bottom edge lit: that is
// the dark wall edge seen in play, and it's tg's look, not a renderer fault.
{
	const dmiPath = resolve(repoRoot, "icons/effects/lighting_object.dmi");
	const bytes = readFileSync(dmiPath);
	const dmi = parseDmiFile(dmiPath);
	const png = decodePng(bytes);
	const st = dmi?.states.find((s) => s.name === "");
	if (!dmi || !png || !st) {
		fail("lt1: lighting_object.dmi base state not found");
	} else {
		const cell = st.cells[0][0];
		const cx = (cell % dmi.columns) * dmi.width, cy = Math.floor(cell / dmi.columns) * dmi.height;
		const byondMatrix = [0.687, 0.687, 0.687, 0, 0.531, 0.531, 0.531, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
		const at = (x: number, y: number): number[] => {
			const i = ((cy + y) * png.width + cx + x) * 4;
			const px = new Uint8ClampedArray(png.rgba.subarray(i, i + 4));
			applyColorMatrix(px, byondMatrix);
			return [...px];
		};
		const w = dmi.width - 1, h = dmi.height - 1;
		const nw = at(0, 0), ne = at(w, 0), sw = at(0, h), se = at(w, h);
		const near = (p: number[], v: number) => Math.abs(p[0] - v) <= 2 && Math.abs(p[1] - v) <= 2 && Math.abs(p[2] - v) <= 2;
		if (!near(nw, 0) || !near(ne, 0) || !near(sw, Math.round(0.687 * 255)) || !near(se, Math.round(0.531 * 255))) {
			fail(`lt1: BYOND's space-side wall lighting drew NW ${nw} NE ${ne} SW ${sw} SE ${se}, expected black top, lit bottom`);
			process.exitCode = 1;
		} else {
			console.log("lt1: space-side wall lit as BYOND computed it: top corners black, bottom corners lit -- OK");
		}
	}
}

if (!existsSync(dumpPath)) {
	fail(`${dumpPath} missing: run npm run appearance-dump first`); // counted, so the HUD part below doesn't print "ALL DRAW TESTS PASSED"
	process.exitCode = 1;
} else {
	const dump = JSON.parse(readFileSync(dumpPath, "utf8")) as Dump;

	// Collect every (icon, iconState) pair used, from atoms + their overlays + every scene tile.
	const pairs = new Set<string>();
	function collect(a: BuiltAppearance | { icon: string | null; iconState: string }): void {
		if (a.icon) pairs.add(`${a.icon}\u0000${a.iconState}`);
	}
	for (const a of dump.atoms) {
		collect(a.appearance);
		for (const o of a.appearance.overlays) collect(o);
	}
	for (const t of dump.scene.tiles) {
		for (const a of t.appearances) {
			collect(a);
			for (const o of a.overlays) collect(o);
		}
	}

	console.log(`checking ${pairs.size} distinct (icon, icon_state) pairs...`);
	const dmiCache = new Map<string, ReturnType<typeof parseDmiFile> | null>();
	let checked = 0;
	for (const pair of pairs) {
		const [icon, iconState] = pair.split("\u0000");
		if (!iconState) continue; // blank icon_state is valid BYOND (no visible state); nothing to check
		let dmi = dmiCache.get(icon);
		if (dmi === undefined) {
			const path = resolve(repoRoot, icon);
			dmi = existsSync(path) ? parseDmiFile(path) : null;
			dmiCache.set(icon, dmi);
		}
		if (!dmi) {
			fail(`${icon}: file not found or not a readable .dmi/PNG`);
			continue;
		}
		const found = dmi.states.some((s) => s.name === iconState);
		if (!found) fail(`${icon}: no state named "${iconState}" (has: ${dmi.states.slice(0, 5).map((s) => s.name).join(", ")}${dmi.states.length > 5 ? ", ..." : ""})`);
		checked++;
	}
	console.log(`${checked} pairs resolved (icon_state set)`);

	console.log(failures === 0 ? "\nALL DRAW TESTS PASSED" : `\n${failures} draw test failure(s)`);
	if (failures) process.exitCode = 1;
}

// --- every icon_state the connected-player scene needs (web/build/2i/client.json's
// client.screen HUD objects) -- same "does this state exist" check as above, for whichever .dmi
// files client-scene.ts loads for the HUD. The map half of that scene draws from station.json
// (already checked above) or, once it lands, client.viewTiles, in the same appearance shape.
const clientDumpPath = resolve(repoRoot, "web/build/2i/client.json");
if (!existsSync(clientDumpPath)) {
	console.log(`(skipped: ${clientDumpPath} missing -- run npm run boot -- --connect <key> first)`);
} else {
	interface ClientDump {
		clients: { screen: { type: string; screen_loc: string | null; appearance: BuiltAppearance }[] }[];
	}
	const dump = JSON.parse(readFileSync(clientDumpPath, "utf8")) as ClientDump;
	const pairs = new Set<string>();
	const collect = (a: { icon: string | null; iconState: string }) => {
		if (a.icon) pairs.add(`${a.icon}\u0000${a.iconState}`);
	};
	for (const c of dump.clients) {
		for (const s of c.screen) {
			collect(s.appearance);
			for (const o of s.appearance.overlays) collect(o);
		}
	}
	console.log(`checking ${pairs.size} distinct (icon, icon_state) pairs from client.json's HUD...`);
	const dmiCache = new Map<string, ReturnType<typeof parseDmiFile> | null>();
	let checked = 0;
	let misses = 0;
	for (const pair of pairs) {
		const [icon, iconState] = pair.split("\u0000");
		if (!iconState) continue;
		let dmi = dmiCache.get(icon);
		if (dmi === undefined) {
			const path = resolve(repoRoot, icon);
			dmi = existsSync(path) ? parseDmiFile(path) : null;
			dmiCache.set(icon, dmi);
		}
		if (!dmi) {
			fail(`${icon}: file not found or not a readable .dmi/PNG`);
			continue;
		}
		const found = dmi.states.some((s) => s.name === iconState);
		if (!found) {
			// Not a hard failure here, unlike the hand-picked atoms above: client.json is live VM data,
			// and BYOND doesn't validate icon_state against the .dmi at compile time either -- a state
			// that genuinely isn't in the sheet just draws nothing (see sprite-lookup.ts's findState),
			// same as it would in a real client. Known case: /obj/screen/click_catcher's icon_state
			// "click_catcher" (code/_onclick/click.dm:435) isn't in icons/mob/screen_gen.dmi (118 states,
			// none named click*) -- a real tg asset gap, not ours to fix.
			misses++;
			console.log(`(note) ${icon}: no state named "${iconState}" -- drawn as nothing, matches BYOND for a missing icon_state`);
		}
		checked++;
	}
	console.log(`${checked} HUD pairs checked, ${misses} not found in their sheet (drawn as nothing, not a failure)`);
	console.log(failures === 0 ? "\nALL DRAW TESTS PASSED (incl. client HUD)" : `\n${failures} draw test failure(s)`);
	if (failures) process.exitCode = 1;
}
