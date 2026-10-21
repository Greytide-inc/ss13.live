// hit-test (3ae): a transformed owner (lying mob) is hit on its drawn pixels, and icon-x/icon-y are in the icon's own pixels.
// mouse_opacity 2 (whole box), so no canvas is needed.
import assert from "node:assert";
// station-client.ts is the page's entry and touches the DOM on import: give it a stub.
(globalThis as Record<string, unknown>).document = new Proxy({}, { get: () => () => new Proxy(function () {}, { get: () => () => {}, set: () => true }) });
(globalThis as Record<string, unknown>).window = globalThis;
const { hitTest } = await import("../../src/render/hit-test.js");
const { itemsOf } = await import("../../src/render/client-scene.js");

const dmi = { width: 32, height: 32, imageWidth: 32, imageHeight: 32, columns: 1, rows: 1, states: [{ name: "s", dirs: 1, frames: 1, delay: [], loop: 0, rewind: false, cells: [[0]] }] };
const icons = new Map([["i.dmi", { dmi, img: null }]]) as never;
const app = (o: Record<string, unknown> = {}) => ({ icon: "i.dmi", iconState: "s", dir: 2, alpha: 255, color: null, transform: null, pixelX: 0, pixelY: 0, layer: 2, plane: 0, overlays: [], mouseOpacity: 2, ...o }) as never as any;
const scene = (a: any) => ({ mapItems: itemsOf(a, 0, 0, 1), hudItems: [], masters: new Map() }) as never as any;
const at = (p: any, x: number, y: number) => hitTest(p, icons, x, y, 0);

// Turned 90 clockwise (a=0,b=1,d=-1,e=0) then moved 32 px right: the 32x32 box now sits at x 32..63, y 0..31 either way (square).
// Use a 2x scale instead to see growth: box grows to x -16..47, y -16..47.
const big = scene(app({ transform: [2, 0, 0, 0, 2, 0] }));
assert.ok(at(big, -10, -10) && at(big, 40, 40), "scaled 2x: hits outside the 32 box");
assert.equal(at(big, 50, 20), null);
assert.deepEqual([at(big, 16, 16)!.iconX, at(big, 16, 16)!.iconY], [17, 16], "scaled: icon coords are the icon's own pixels");
assert.equal(at(big, -16, -16)!.iconX, 1); // top-left drawn corner = icon pixel 1,32
assert.equal(at(big, -16, -16)!.iconY, 32);

// Translate 32 px east (c=32): upright box is now empty, moved box hits.
const moved = scene(app({ transform: [1, 0, 32, 0, 1, 0] }));
assert.equal(at(moved, 10, 10), null); assert.ok(at(moved, 40, 10));
assert.equal(at(moved, 33, 31)!.iconX, 2);

// Wide 64x32 icon turned 90: drawn tall (x 16..47 about centre 32,16 -> y -16..47). Upright's empty corner misses.
dmi.width = 64; dmi.imageWidth = 64;
const rot = scene(app({ transform: [0, 1, 0, -1, 0, 0] }));
assert.equal(at(rot, 5, 16), null, "left of the turned box"); // upright box spans x 0..63, turned spans x 16..47
assert.ok(at(rot, 32, -10), "above the upright box, inside the turned one");
assert.equal(at(rot, 60, 16), null);
// clockwise turn: the icon's right end (x=63, mid) lands at the bottom: canvas (32, 47) -> icon-x 64
const r = at(rot, 32, 46)!; assert.ok(r.iconX >= 63, `iconX ${r.iconX}`);
// an overlay follows its owner's turn
const ov = scene(app({ icon: null, transform: [0, 1, 0, -1, 0, 0], overlays: [app()] }));
assert.ok(at(ov, 32, -10), "overlay of a turned owner hits on the turned box");
console.log("hit-test: ok");
