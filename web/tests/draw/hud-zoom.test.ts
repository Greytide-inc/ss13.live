// zooming (client.view 19x15 -> 27x21 -> 37x29, or in to 15x11 / 9x7) changes only the map. The HUD is laid out
// against the base view (client.baseView) and fitted into the zoomed view, so in pane pixels (pane width / the width that shows, boxW:
// a zoomed view is a little wider than the base shape and its sides are cut off, so the pane keeps its shape) every
// screen object has the same size and place, lies inside the pane, and a click at its centre hits it. Full-view overlays
// ("WEST,SOUTH to EAST,NORTH") tile the whole zoomed view instead.
import assert from "node:assert";
(globalThis as Record<string, unknown>).document = new Proxy({}, { get: () => () => new Proxy(function () {}, { get: () => () => {}, set: () => true }) });
(globalThis as Record<string, unknown>).window = globalThis;
const { buildPrepared } = await import("../../src/render/client-scene.js");
const { hitTest } = await import("../../src/render/hit-test.js");

const dmi = { width: 32, height: 32, imageWidth: 32, imageHeight: 32, columns: 1, rows: 1, states: [{ name: "s", dirs: 1, frames: 1, delay: [], loop: 0, rewind: false, cells: [[0]] }] };
const icons = new Map([["i.dmi", { dmi, img: null }]]) as never;
const app = (o: Record<string, unknown> = {}) => ({ icon: "i.dmi", iconState: "s", dir: 2, alpha: 255, color: null, transform: null, pixelX: 0, pixelY: 0, layer: 2, plane: 21, overlays: [], mouseOpacity: 2, invisibility: 0, ...o }) as never as any;
const locs = ["WEST,SOUTH", "EAST,SOUTH", "WEST,NORTH", "EAST,NORTH", "CENTER,SOUTH", "EAST-4:22,SOUTH+1", "WEST+2,CENTER"];
const screen = locs.map((l) => ({ type: "/obj/screen/b", screen_loc: l, appearance: app() })).concat([{ type: "/obj/screen/fullscreen/blind", screen_loc: "WEST,SOUTH to EAST,NORTH", appearance: app({ plane: 20 }) }])
	.map((s, i) => ({ ...s, id: i + 1 }));
const eye = { x: 100, y: 50, z: 2 };
const PANE = 1200; // pane width in px

const rects: Record<string, { x: number; y: number; w: number; h: number }[]> = {};
for (const view of ["19x15", "27x21", "37x29", "15x11", "9x7"]) {
	const p = buildPrepared({ key: "k", ckey: "k", view, baseView: "19x15", eyeTile: eye, screen } as never, []);
	const k = PANE / p.boxW!, cut = (p.canvasW - p.boxW!) / 2 * k; // pane px per view px; what is cut off each side
	assert.ok(Math.abs(p.boxW! / p.canvasH - 19 / 15) < 1e-9 && cut >= 0, `${view}: shows the base view's shape (${p.boxW}x${p.canvasH})`);
	const out: { x: number; y: number; w: number; h: number }[] = [];
	for (const it of p.hudItems) {
		const f = it.hk ?? { k: 1, dx: 0, dy: 0 };
		const r = { x: (it.originX * f.k + f.dx) * k, y: (it.originY * f.k + f.dy) * k, w: 32 * f.k * k, h: 32 * f.k * k };
		if (it.appearance.plane === 20) { // the blind overlay: tiles the whole view, unscaled
			assert.ok(!it.hk, `${view}: full-view overlay is laid out in view pixels`);
			continue;
		}
		assert.ok(r.x - cut >= -1e-6 && r.y >= -1e-6 && r.x - cut + r.w <= PANE + 1e-6 && r.y + r.h <= p.canvasH * k + 1e-6, `${view}: item ${it.id} inside the pane: ${JSON.stringify(r)}`);
		const cx = Math.floor((r.x + r.w / 2) / k), cy = Math.floor((r.y + r.h / 2) / k); // click at the centre, in canvas px
		const hit = hitTest(p, icons, cx, cy, 0);
		assert.strictEqual(hit?.item.id, it.id, `${view}: click at the centre of item ${it.id} hits ${hit?.item.id}`);
		out.push(r);
	}
	const cover = p.hudItems.filter((i) => i.appearance.plane === 20).length;
	assert.strictEqual(cover, view === "19x15" ? 19 * 15 : +view.split("x")[0] * +view.split("x")[1], `${view}: blind tiles cover the whole view`);
	rects[view] = out.sort((a, b) => a.x - b.x || a.y - b.y);
}
const ref = rects["19x15"];
assert.strictEqual(ref.length, locs.length);
for (const [view, rs] of Object.entries(rects)) {
	assert.strictEqual(rs.length, ref.length);
	for (const r of rs) assert.ok(Math.abs(r.w / ref[0].w - 1) < 0.02, `${view}: HUD item size ${r.w.toFixed(1)} vs ${ref[0].w} (within 2%)`);
}
console.log("hud-zoom: ok", Object.entries(rects).map(([v, rs]) => `${v}: ${rs[0].w.toFixed(1)}px`).join(", "));
