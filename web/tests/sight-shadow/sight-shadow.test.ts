// sight-shadow.test.ts - The opacity sent to the page (packOpacity) comes back the same, the page's line of sight (litShare) gives the
// expected shadow for a lone wall, the shadow polygons (shadowPolys) cover exactly the spots lineClear finds blocked, the soft shadows
// (softDark) light and darken the spots expected for a lone wall, a corridor, a doorway and a diagonal gap, and, per station map, how often it disagrees with the server's tile rules (computeLos, line of sight
// only): sight-shadows step 1. shadowStrength gives full / dim / none per form (step 4). tgDark (the "smoothed tg" look) is black on hidden tiles, clear in the middle of a
// shown floor tile, fades near a hidden one and cuts the inside corner of a staircase; hardTile is the same with no fade, per tile. "hidden but lit" is the case that shows (a black square in a lit wedge); the counts are printed, not checked.
// The map part needs build/game-types.js (skipped without it). Station maps are read at runtime by tg's own reader (reader.dm), which
// lets a var miss its ";" (BoxStation's server vent) and holds new/newlist() values: the strict .dmm parser gets the ";" added and nulls.

import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { eyePoints, inPoly, lineClear, litShare, packOpacity, SHADOW_DIM, shadowPolys, shadowStrength, softDark, tgDark, unpackOpacity, hardTile, inCorners, HARD_HIDDEN } from "../../src/render/sight-shadow.js";
import { computeLos, newLosBox } from "../../src/vm/view-los.js";
import { parseDmms } from "../../src/vm/dmm.js";
import { loadGame } from "../../src/tools/game-tree.js";

let webDir = dirname(fileURLToPath(import.meta.url));
for (let i = 0; i < 4; i++) webDir = dirname(webDir);

let seed = 7;
const rnd = (n: number) => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed % n; };

// how strong the shadow is drawn per form (step 4): full for crew and the blob (SEE_SELF only), dimmed with mesons (SEE_TURFS) or thermals
// (SEE_MOBS), none for a ghost or the AI (all three) or with no box sent
assert.equal(shadowStrength(0, true), 1);
assert.equal(shadowStrength(32, true), 1);
assert.equal(shadowStrength(16, true), SHADOW_DIM);
assert.equal(shadowStrength(4, true), SHADOW_DIM);
assert.equal(shadowStrength(60, true), 0);
assert.equal(shadowStrength(0, false), 0);

// packing: random boxes come back as they went
for (let run = 0; run < 50; run++) {
	const w = 1 + rnd(30), h = 1 + rnd(30), o = new Uint8Array(w * h).map(() => (rnd(3) === 0 ? 1 : 0));
	const v = new Uint8Array(w * h).map((_, k) => (k * 7 + run) % 3 === 0 ? 1 : 0); // not rnd(): the random tests below keep their seeds
	const p = packOpacity(5, 9, w, h, o, v), u = unpackOpacity(structuredClone(p));
	assert.deepEqual([u.x0, u.y0, u.w, u.h, [...u.opaque], [...u.vis!]], [5, 9, w, h, [...o], [...v]]);
	assert.equal(unpackOpacity(packOpacity(5, 9, w, h, o)).vis, null);
}

// the smooth look: a 7x7 box, all shown floor but a staircase of hidden tiles (2,2), (3,2), (2,3) (outside the box counts as hidden too,
// so the points are kept away from its edge)
{
	const w = 7, h = 7, o = new Uint8Array(w * h), v = new Uint8Array(w * h).fill(1);
	for (const [x, y] of [[2, 2], [3, 2], [2, 3]]) v[x + y * w] = 0;
	assert.equal(tgDark(v, o, w, h, 2.5, 2.5), 1); // hidden: black
	assert.equal(tgDark(v, o, w, h, 5.5, 5.5), 0); // far from it: clear
	assert.equal(tgDark(v, o, w, h, -0.5, 3.5), 1); // outside the box: hidden
	const near = tgDark(v, o, w, h, 4.05, 2.5); // a twentieth of a tile from hidden (3,2): partly dark
	assert.ok(near > 0 && near < 1, String(near));
	assert.equal(tgDark(v, o, w, h, 4.5, 2.5), 0);
	// (3,3) has hidden tiles west and south: its south-west half is black (the step reads as a slope), its north-east corner clear
	assert.equal(tgDark(v, o, w, h, 3.2, 3.2), 1);
	assert.equal(tgDark(v, o, w, h, 3.8, 3.8), 0);
	assert.equal(tgDark(v, o, w, h, 3.2, 3.2, 0), 1);
	o[3 + 3 * w] = 1; // a wall there instead: shown whole
	assert.equal(tgDark(v, o, w, h, 3.2, 3.2), 0);
}

// the hard smoothed tg look per tile (hardTile + inCorners, what the page stamps) is tgDark with no fade, on every pixel of random boxes
for (let run = 0; run < 30; run++) {
	const w = 9, h = 7, res = 32, v = new Uint8Array(w * h).map((_, k) => (k * 5 + run * 3) % 3 ? 1 : 0), o = new Uint8Array(w * h).map((_, k) => (k * 7 + run) % 4 ? 0 : 1);
	for (let ty = 0; ty < h; ty++) for (let tx = 0; tx < w; tx++) {
		const t = hardTile(v, o, w, h, tx, ty);
		for (let r = 0; r < res; r++) for (let c = 0; c < res; c++) {
			const u = (c + 0.5) / res, vv = 1 - (r + 0.5) / res, on = t === HARD_HIDDEN || (t > 0 && inCorners(t, u, vv));
			assert.equal(on, tgDark(v, o, w, h, tx + u, ty + vv, 0) >= 0.5, `run ${run} tile ${tx},${ty} px ${c},${r}`);
		}
	}
}

// a lone wall two tiles east of the eye: the tile straight behind it is dark, the wall itself lit, the ones beside the shadow partly lit
{
	const w = 9, h = 9, o = new Uint8Array(w * h), at = (x: number, y: number) => x + y * w;
	o[at(6, 4)] = 1;
	const s = litShare(o, w, h, 4.5, 4.5);
	assert.equal(s[at(6, 4)], 1);
	assert.equal(s[at(7, 4)], 0);
	assert.equal(s[at(8, 4)], 0);
	assert.ok(s[at(8, 5)] > 0 && s[at(8, 5)] < 1, `beside the shadow: ${s[at(8, 5)]}`);
	assert.equal(s[at(4, 8)], 1);
	// walls meeting at a corner leave no gap: the tile past the corner is dark
	const d = new Uint8Array(w * h);
	d[at(5, 4)] = 1; d[at(4, 5)] = 1; // east and north of the eye
	assert.equal(litShare(d, w, h, 4.5, 4.5)[at(5, 5)], 0);
}
// an eye a hair below a lone wall: its shadow fans out nearly 180°, and a spot up and to the side behind the wall is still in it
// (the far edge used to be one straight line between the two far corners, which cut back across close to the eye)
{
	const w = 9, h = 9, o = new Uint8Array(w * h);
	o[3 + 7 * w] = 1;
	const polys = shadowPolys(o, w, h, 3.3365, 6.9925, [], 0);
	assert.equal(lineClear(o, w, h, 3.3365, 6.9925, 1.75, 8.9, 1, 8), false);
	assert.ok(polys.some((p) => inPoly(p, 1.75, 8.9)));
}
// shadow polygons: in shadow exactly where a straight line from the eye point is blocked (random rooms, eyes and spots; no tile grown,
// so the two agree everywhere but on outlines, which random spots don't hit)
for (let run = 0; run < 200; run++) {
	const w = 5 + rnd(20), h = 5 + rnd(20), o = new Uint8Array(w * h).map(() => (rnd(10) < 3 ? 1 : 0));
	let et: number;
	do et = rnd(w * h); while (o[et]);
	const px = (et % w) + rnd(1000) / 1000 + 0.0005, py = Math.floor(et / w) + rnd(1000) / 1000 + 0.0005;
	const polys = shadowPolys(o, w, h, px, py, [], 0);
	for (let k = 0; k < 200; k++) {
		const x = (rnd(w * 1000) + 0.37) / 1000, y = (rnd(h * 1000) + 0.61) / 1000, tx = Math.floor(x), ty = Math.floor(y);
		assert.equal(polys.some((p) => inPoly(p, x, y)), !lineClear(o, w, h, px, py, x, y, tx, ty), `run ${run}: eye ${px},${py} spot ${x},${y}`);
	}
}

// the soft shadows on four rooms (9x9, eye at a tile centre)
{
	const w = 9, h = 9, room = (walls: [number, number][]) => { const o = new Uint8Array(w * h); for (const [x, y] of walls) o[x + y * w] = 1; return o; };
	const dark = (o: Uint8Array, ex: number, ey: number, x: number, y: number) => softDark(eyePoints(ex, ey).map(([px, py]) => shadowPolys(o, w, h, px, py)), x, y);
	// a lone wall: its face lit, straight behind it black, beside it lit
	const lone = room([[6, 4]]);
	assert.equal(dark(lone, 4.5, 4.5, 6.2, 4.5), 0);
	assert.equal(dark(lone, 4.5, 4.5, 8.5, 4.5), 1);
	assert.equal(dark(lone, 4.5, 4.5, 8.5, 6.5), 0);
	// a corridor along y = 4: lit to its far end, black past its walls
	const corridor = room(Array.from({ length: 9 }, (_, x) => [[x, 3], [x, 5]] as [number, number][]).flat());
	assert.equal(dark(corridor, 1.5, 4.5, 8.5, 4.5), 0);
	assert.equal(dark(corridor, 1.5, 4.5, 5.5, 7.5), 1);
	// a doorway at x = 4 in a wall along y = 6: straight through lit, far to the side black, a soft edge between
	const door = room([0, 1, 2, 3, 5, 6, 7, 8].map((x) => [x, 6] as [number, number]));
	assert.equal(dark(door, 4.5, 3.5, 4.5, 8.5), 0);
	assert.equal(dark(door, 4.5, 3.5, 0.5, 8.5), 1);
	const edge = Array.from({ length: 40 }, (_, i) => dark(door, 4.5, 3.5, 4.5 + i / 10, 8.5));
	assert.ok(edge.some((d) => d > 0 && d < 1), `doorway edge: ${edge.join(" ")}`);
	// a diagonal gap: walls east and north of the eye meet at a corner; the tile past the corner is black, the walls' faces lit
	const diag = room([[5, 4], [4, 5]]);
	assert.equal(dark(diag, 4.5, 4.5, 5.6, 5.6), 1);
	assert.equal(dark(diag, 4.5, 4.5, 5.2, 4.5), 0);
}
console.log("sight-shadow.test: unit ok");

if (!existsSync(resolve(webDir, "build/game-types.js"))) {
	console.log("skip sight-shadow maps (build/game-types.js missing: run a boot-check or build:static first)");
} else {
	const { tree } = await loadGame();
	const RX = 9, RY = 7, W = 2 * RX + 1, H = 2 * RY + 1, EYES = 400; // DEFAULT_VIEW 19x15 (config.txt)
	const num = (v: unknown) => (typeof v === "number" ? v : 0);
	for (const name of ["boxstation", "metastation", "deltastation", "pubbystation", "omegastation", "cerestation", "runtimestation"]) {
		const cfg = JSON.parse(readFileSync(resolve(webDir, `../_maps/${name}.json`), "utf8"));
		const file = `${cfg.map_path}/${cfg.map_file}`;
		const [m] = parseDmms([file], (f) => readFileSync(resolve(webDir, "../_maps", f), "utf8").replace(/([^;{\s])\n\t(?=\w+ = )/g, "$1;\n\t").replace(/= (?:newlist|new)(?=[\s(\/])[^;\n]*/g, "= null"), (p) => tree.getType(p));
		const mx = m.MaxX, my = m.MaxY, opaque = new Uint8Array(mx * my), floor: number[] = [];
		for (const b of m.Blocks) {
			if (b.Z !== 1) continue;
			b.Cells.forEach((cn, i) => {
				const c = m.CellDefinitions[cn], x = b.X + (i % b.Width) - 1, y = b.Y + b.Height - 1 - Math.floor(i / b.Width) - 1, k = x + y * mx;
				if (!c?.Turf) return;
				const opOf = (o: { Type: number; VarOverrides?: Record<string, unknown> }) => num(o.VarOverrides?.opacity ?? tree.types[o.Type].vars.get("opacity"));
				let op = opOf(c.Turf) !== 0;
				for (const o of c.Objects ?? []) if (opOf(o)) op = true;
				opaque[k] = op ? 1 : 0;
				const p = tree.types[c.Turf.Type].path;
				if (!op && p.startsWith("/turf/open") && !p.startsWith("/turf/open/space")) floor.push(k);
			});
		}
		seed = 7;
		let seen = 0, lit = 0, hiddenLit = 0, hiddenHalf = 0, shownDark = 0, shownDarkFloor = 0, polyMs = 0, polyN = 0;
		const box = newLosBox(W, H);
		for (let e = 0; e < EYES; e++) {
			const k = floor[rnd(floor.length)], ex = k % mx, ey = (k - ex) / mx;
			for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
				const x = ex - RX + i, y = ey - RY + j;
				box.opaque[i + j * W] = x >= 0 && y >= 0 && x < mx && y < my ? opaque[x + y * mx] : 0;
				box.areaLit[i + j * W] = 1;
			}
			const vis = computeLos(box, 0, true), share = litShare(box.opaque, W, H, RX + 0.5, RY + 0.5);
			const t0 = performance.now();
			for (const [px, py] of eyePoints(RX + 0.5, RY + 0.5)) polyN += shadowPolys(box.opaque, W, H, px, py).length;
			polyMs += performance.now() - t0;
			for (let t = 0; t < W * H; t++) {
				if (vis[t]) seen++;
				if (share[t] > 0) lit++;
				if (!vis[t] && share[t] > 0) hiddenLit++;
				if (!vis[t] && share[t] >= 0.5) hiddenHalf++;
				if (vis[t] && share[t] === 0) { shownDark++; if (!box.opaque[t]) shownDarkFloor++; }
			}
		}
		const pc = (a: number, b: number) => `${((100 * a) / b).toFixed(2)}%`;
		console.log(`${name.padEnd(15)} ${EYES} eyes: server shows ${seen}, shadow lights ${lit}; hidden but lit ${hiddenLit} (${pc(hiddenLit, lit)} of lit), half or more lit ${hiddenHalf} (${pc(hiddenHalf, lit)}); shown but all in shadow ${shownDark} (${pc(shownDark, seen)} of shown; not walls ${pc(shownDarkFloor, seen)}); soft shadows ${(polyN / EYES).toFixed(0)} polygons in ${(polyMs / EYES).toFixed(2)} ms an eye`);
	}
}
