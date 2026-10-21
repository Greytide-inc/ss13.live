// sight-pop-in.test.ts - plans/archive/sight-pop-in.md. viewSight (vm/view-los.ts) for the box's own eye gives what clientSight worked out before
// (inner view from the cropped box, the outer ring from the whole box), and for a tile off the centre the same as a box built round that tile;
// on random worlds of walls, lamps and lit areas. The box goes to the page (opq + lum) and comes back the same (step 2). unionExtra (step 3), with
// the eye's own sight, is line of sight from every tile reachable in up to UNION_R steps (paths walked out one by one here), so it holds all the page
// can see from there (viewSight, light too), and an L corridor's far leg is in it. pageSight (step 4) gives that viewSight in world tiles from
// the box as sent (the eye's own sight past it: the camera trails the stepped-to tile while it glides), every tile it shows was sent, and it gives up on a step too far or another view size.

import assert from "node:assert/strict";
import { computeLos, cropLosBox, newLosBox, viewSight, type LosBox } from "../../src/vm/view-los.js";
import { PRED_R, PRED_W, UNION_R, unionExtra } from "../../src/worker/client-view.js";
import { pageSees, pageSight, withSight } from "../../src/render/sight-pop-in.js";
import { packLum, packOpacity, unpackLum, unpackOpacity } from "../../src/render/sight-shadow.js";

let seed = 11;
const rnd = (n: number) => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed % n; };

/** a world of W x H cells; box() cuts the box of half-size rx, ry round (x, y) out of it, past its edge clear and lit (as world.ts losBox) */
function world(W: number, H: number, litShare = 9, wallShare = 4) {
	const op = new Uint8Array(W * H).map(() => (rnd(wallShare) === 0 ? 1 : 0)), lamp = new Int32Array(W * H).map(() => (rnd(12) === 0 ? 1 + rnd(4) : 0));
	const lit = new Uint8Array(W * H).map(() => (rnd(litShare) === 0 ? 1 : 0));
	const box = (x: number, y: number, rx: number, ry: number): LosBox => {
		const b = newLosBox(2 * rx + 1, 2 * ry + 1);
		for (let j = 0; j < b.h; j++) for (let i = 0; i < b.w; i++) {
			const wx = x - rx + i, wy = y - ry + j, k = i + j * b.w;
			if (wx < 0 || wy < 0 || wx >= W || wy >= H) { b.areaLit[k] = 1; continue; }
			b.opaque[k] = op[wx + wy * W]; b.lamp[k] = lamp[wx + wy * W]; b.areaLit[k] = lit[wx + wy * W];
		}
		return b;
	};
	return box;
}

/** clientSight's sums before viewSight */
function before(box: LosBox, rx: number, ry: number, ring: number, sid: number): number[] {
	const w = box.w, h = box.h, vis: number[] = [];
	const outer = computeLos(box, sid, false), inner = computeLos(cropLosBox(box, ring), sid, false);
	for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
		const out = x < ring || y < ring || x >= w - ring || y >= h - ring;
		vis.push((out ? outer[x + y * w] : inner[x - ring + (y - ring) * (w - 2 * ring)]) !== 0 ? 1 : 0);
	}
	return vis;
}

let offCentre = 0, cells = 0;
for (let run = 0; run < 60; run++) {
	const W = 40, H = 34, box = world(W, H), rx = 5 + rnd(5), ry = 5 + rnd(3), sid = rnd(4), R = 3, ring = 1 + R;
	const x = rnd(W), y = rnd(H), b = box(x, y, rx + ring, ry + ring);
	assert.deepEqual([...viewSight(b, b.ex, b.ey, rx, ry, ring, sid)], before(b, rx, ry, ring, sid), `run ${run}: the server's own tile`);
	// the page, stepped up to R tiles off the server's tile: its view (plus the 1-tile glide ring) from the sent box
	const dx = rnd(2 * R + 1) - R, dy = rnd(2 * R + 1) - R;
	const got = viewSight(b, b.ex + dx, b.ey + dy, rx, ry, 1, sid), want = viewSight(box(x + dx, y + dy, rx + 1, ry + 1), rx + 1, ry + 1, rx, ry, 1, sid);
	assert.deepEqual([...got], [...want], `run ${run}: stepped ${dx},${dy}`);
	if (dx || dy) offCentre++;
	// step 2: the page's copy of the box (opq + lum, through JSON as on the wire) gives the same sight
	const o = unpackOpacity(JSON.parse(JSON.stringify(packOpacity(0, 0, b.w, b.h, b.opaque)))), pb = unpackLum(o, JSON.parse(JSON.stringify(packLum(b.lamp, b.areaLit))));
	assert.ok(pb && [...pb.lamp].join() === [...b.lamp].join() && [...pb.areaLit].join() === [...b.areaLit].join(), `run ${run}: lum round trip`);
	assert.deepEqual([...viewSight(pb, pb.ex + dx, pb.ey + dy, rx, ry, 1, sid)], [...got], `run ${run}: the page's copy`);
	cells += got.reduce((a, v) => a + v, 0);
}
// step 3: the union, against every path of up to UNION_R steps walked out (a diagonal only with both straight steps free)
const bit = (dx: number, dy: number) => 2 ** ((dy + PRED_R) * PRED_W + dx + PRED_R);
let grew = 0, pageShown = 0, trail = 0;
for (let run = 0; run < 30; run++) {
	const W = 40, H = 34, box = world(W, H, run % 2 ? 9 : 1, run % 2 ? 4 : 15), rx = 5 + rnd(5), ry = 5 + rnd(3), sid = rnd(4), ring = 1 + PRED_R; // odd runs dark and walled, even all lit and open
	const x = 4 + rnd(W - 8), y = 4 + rnd(H - 8), b = box(x, y, rx + ring, ry + ring);
	let free = bit(0, 0);
	const isFree = new Set<string>(["0,0"]);
	for (let dy = -PRED_R; dy <= PRED_R; dy++) for (let dx = -PRED_R; dx <= PRED_R; dx++) if ((dx || dy) && rnd(3) !== 0) { free += bit(dx, dy); isFree.add(`${dx},${dy}`); }
	const own = viewSight(b, b.ex, b.ey, rx, ry, ring, sid), reach = new Set<string>(["0,0"]);
	const walk = (ax: number, ay: number, n: number): void => {
		if (n === UNION_R) return;
		for (let sy = -1; sy <= 1; sy++) for (let sx = -1; sx <= 1; sx++) {
			const nx = ax + sx, ny = ay + sy, f = (a: number, c: number) => isFree.has(`${a},${c}`);
			if ((!sx && !sy) || !f(nx, ny) || (sx && sy && !(f(ax + sx, ay) && f(ax, ay + sy)))) continue;
			reach.add(`${nx},${ny}`); walk(nx, ny, n + 1);
		}
	};
	walk(0, 0, 0);
	const want = own.slice(), at = (k: number, vw: number, dx: number, dy: number) => (k % vw) + PRED_R + dx + (Math.floor(k / vw) + PRED_R + dy) * b.w;
	const extra = unionExtra(b, free, rx, ry, ring), got = own.map((v, k) => v | extra[k]);
	for (const r of reach) {
		const [dx, dy] = r.split(",").map(Number), wb = box(x + dx, y + dy, rx + 1, ry + 1), vw = 2 * rx + 3;
		const los = computeLos(wb, sid, true), page = viewSight(wb, rx + 1, ry + 1, rx, ry, 1, sid);
		for (let k = 0; k < los.length; k++) {
			if (los[k] && (dx || dy)) want[at(k, vw, dx, dy)] = 1; // the eye's own tile: own, light and all
			if (page[k]) assert.equal(got[at(k, vw, dx, dy)], 1, `union run ${run}: the page at ${dx},${dy} sees a tile not sent`);
		}
	}
	assert.deepEqual([...got], [...want], `union run ${run}`);
	// step 4: the page's own sight, from the box as sent, for each tile it may have stepped to
	const X0 = 100, Y0 = 50, opq = JSON.parse(JSON.stringify(packOpacity(X0, Y0, b.w, b.h, b.opaque, own))), lum = JSON.parse(JSON.stringify(packLum(b.lamp, b.areaLit)));
	for (const r of reach) {
		const [dx, dy] = r.split(",").map(Number), ps = pageSight(opq, lum, dx, dy, rx, ry, sid)!, vw = 2 * rx + 3;
		const page = viewSight(box(x + dx, y + dy, rx + 1, ry + 1), rx + 1, ry + 1, rx, ry, 1, sid);
		let n = 0;
		for (let j = 0; j < b.h; j++) for (let i = 0; i < b.w; i++) {
			const si = i - (PRED_R + dx), sj = j - (PRED_R + dy), inside = si >= 0 && sj >= 0 && si < vw && sj < 2 * ry + 3;
			const sees = pageSees(ps, X0 + i, Y0 + j);
			// round the stepped-to tile its own sight; further out (the strip behind you the camera still shows while it glides there) the eye's, as sent
			assert.equal(sees, inside ? page[si + sj * vw] === 1 : own[i + j * b.w] === 1, `page run ${run} at ${dx},${dy}: tile ${i},${j}`);
			if (!inside && own[i + j * b.w]) trail++;
			if (sees) { n++; assert.equal(got[i + j * b.w], 1, `page run ${run}: shows a tile not sent`); }
		}
		pageShown += n; // a dark world (no lamps, no see_in_dark) shows nothing
		assert.ok(!pageSees(ps, X0 - 1, Y0) && !pageSees(ps, X0 + b.w, Y0));
	}
	assert.ok(pageSight(opq, lum, PRED_R, 0, rx, ry, sid) && pageSight(opq, lum, PRED_R + 1, 0, rx, ry, sid) === null, "PRED_R steps ahead, not more");
	assert.equal(pageSight(opq, lum, 0, 0, rx + 1, ry, sid), null, "another view");
	assert.equal(pageSight(opq, ["A"], 0, 0, rx, ry, sid), null, "lum of another box");
	const ws = withSight(opq, pageSight(opq, lum, 0, 0, rx, ry, sid)!);
	assert.equal(unpackOpacity(ws).vis!.length, b.w * b.h);
	grew += got.reduce((a, v) => a + v, 0) - own.reduce((a, v) => a + v, 0);
}
assert.ok(grew > 0 && pageShown > 200, `the union adds tiles (${grew}); the page shows some (${pageShown})`);
assert.ok(trail > 50, `tiles past the stepped-to view the eye sees: ${trail}`);
{ // an L corridor, all lit: the eye UNION_R tiles short of the corner sees nothing of the leg going north; the union does
	const rx = 7, ry = 7, ring = 1 + PRED_R, b = newLosBox(2 * (rx + ring) + 1, 2 * (ry + ring) + 1);
	b.opaque.fill(1); b.areaLit.fill(1);
	const clear = (x: number, y: number) => { b.opaque[b.ex + x + (b.ey + y) * b.w] = 0; };
	for (let x = -6; x <= UNION_R; x++) clear(x, 0);
	for (let y = 1; y <= 8; y++) clear(UNION_R, y);
	let free = 0;
	for (let dy = -PRED_R; dy <= PRED_R; dy++) for (let dx = -PRED_R; dx <= PRED_R; dx++) if (!b.opaque[b.ex + dx + (b.ey + dy) * b.w]) free += bit(dx, dy);
	const own = viewSight(b, b.ex, b.ey, rx, ry, ring, 0), extra = unionExtra(b, free, rx, ry, ring), got = own.map((v, k) => v | extra[k]), at = (v: Uint8Array, x: number, y: number) => v[b.ex + x + (b.ey + y) * b.w];
	assert.equal(at(own, UNION_R, 6), 0, "the far leg is hidden from the eye");
	assert.equal(at(got, UNION_R, 6), 1, "the union sends it");
	assert.equal(at(got, 0, 5), 0, "rock beside the leg stays hidden");
}
assert.ok(offCentre > 40 && cells > 1000, `${offCentre} off-centre runs, ${cells} cells seen`);
console.log(`sight-pop-in: viewSight matches on 60 random worlds (${offCentre} stepped off the centre); union matches walked paths on 30 (+${grew} tiles); L corridor; page sight from each`);
