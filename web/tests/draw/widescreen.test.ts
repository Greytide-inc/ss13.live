// widescreen (ws1): a "19x15" client.view gives a 608x480 canvas, the eye tile at the centre column, map tiles
// placed across all 19 columns, and HUD screen_locs anchored to the 19-wide edges (EAST, CENTER); view 7 stays 480x480.
import assert from "node:assert";
// client-scene.ts is a page entry and touches the DOM on import: give it a stub (as hit-test.test.ts).
(globalThis as Record<string, unknown>).document = new Proxy({}, { get: () => () => new Proxy(function () {}, { get: () => () => {}, set: () => true }) });
(globalThis as Record<string, unknown>).window = globalThis;
const { buildPrepared, viewHalf } = await import("../../src/render/client-scene.js");

const app = (o: Record<string, unknown> = {}) => ({ icon: "i.dmi", iconState: "s", dir: 2, alpha: 255, color: null, transform: null, pixelX: 0, pixelY: 0, layer: 2, plane: 0, overlays: [], mouseOpacity: 1, invisibility: 0, ...o }) as never as any;
const eye = { x: 100, y: 50, z: 2 };
const tiles = (hx: number, hy: number) => {
	const out = [];
	for (let dx = -hx - 1; dx <= hx + 1; dx++) for (let dy = -hy - 1; dy <= hy + 1; dy++) out.push({ x: eye.x + dx, y: eye.y + dy, appearances: [app({ iconState: `${dx},${dy}` })] });
	return out;
};
const screen = [
	{ type: "/obj/screen/fullscreen/brute", screen_loc: "CENTER-7,CENTER-7", appearance: app({ plane: 20 }) },
	{ type: "/obj/screen/craft", screen_loc: "EAST-4:22,SOUTH:5", appearance: app({ plane: 21 }) },
	{ type: "/obj/screen/inventory", screen_loc: "WEST:6,SOUTH:5", appearance: app({ plane: 21 }) },
];
const at = (p: any, state: string) => p.mapItems.find((i: any) => i.appearance.iconState === state);
const hud = (p: any, plane: number, k = 0) => p.hudItems.filter((i: any) => i.appearance.plane === plane)[k];

assert.deepStrictEqual(viewHalf("19x15"), [9, 7]);
assert.deepStrictEqual(viewHalf(7), [7, 7]);
assert.deepStrictEqual(viewHalf("21x15"), [10, 7]);

// 19x15
const w = buildPrepared({ key: "k", ckey: "k", view: "19x15", eyeTile: eye, screen } as never, tiles(9, 7));
assert.strictEqual(w.canvasW, 608);
assert.strictEqual(w.canvasH, 480);
assert.deepStrictEqual([w.geom!.viewW, w.geom!.viewH, w.geom!.minX, w.geom!.minY], [19, 15, 91, 43]);
assert.deepStrictEqual([at(w, "0,0").originX, at(w, "0,0").originY], [9 * 32, 7 * 32], "eye tile at the centre of the 19x15 canvas");
assert.deepStrictEqual([at(w, "-9,7").originX, at(w, "-9,7").originY], [0, 0], "top-left view tile");
assert.deepStrictEqual([at(w, "9,-7").originX, at(w, "9,-7").originY], [18 * 32, 14 * 32], "bottom-right view tile");
assert.ok(at(w, "-10,0") && at(w, "10,0"), "the camera-glide ring is kept just off the canvas");
assert.deepStrictEqual([hud(w, 20).originX, hud(w, 20).originY], [2 * 32, 14 * 32], "CENTER-7,CENTER-7 starts at column 3 (CENTER is 10)");
assert.deepStrictEqual([hud(w, 21).originX, hud(w, 21).originY], [14 * 32 + 22, 14 * 32 - 5], "EAST-4:22 is column 15 of 19");
assert.deepStrictEqual([hud(w, 21, 1).originX], [6], "WEST:6 stays at the left edge");

// 15x15 (view 7) as before
const s = buildPrepared({ key: "k", ckey: "k", view: 7, eyeTile: eye, screen } as never, tiles(7, 7));
assert.strictEqual(s.canvasW, 480);
assert.strictEqual(s.canvasH, 480);
assert.deepStrictEqual([at(s, "0,0").originX, at(s, "0,0").originY], [7 * 32, 7 * 32]);
assert.deepStrictEqual([hud(s, 20).originX, hud(s, 21).originX], [0, 10 * 32 + 22], "CENTER-7 is column 1, EAST-4:22 is 12:-10 as tg's old ui_crafting");

console.log("widescreen: ok (19x15 -> 608x480 canvas, map and HUD placed; 15x15 unchanged)");
