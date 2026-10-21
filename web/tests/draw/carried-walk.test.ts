// carried-walk: a carried light walked a step past a wall corner. Its tiles stay put in the world: a corner that a wall keeps dark from both
// tiles gets no light at any point in the step (they used to glide with the mob, so the next tile's shape lit it mid-step, then snapped back:
// the seclite flicker), and a corner both tiles light follows the mob as drawn (strengthAt from its glide). The light at a world corner is
// summed over the lighting items drawn round it, each item's four corners mixed by where the point falls in it.
import assert from "node:assert";
const ctx = new Proxy({}, { get: () => () => {}, set: () => true });
(globalThis as Record<string, unknown>).document = { createElement: () => ({ width: 0, height: 0, className: "", style: {}, getContext: () => ctx }), getElementById: (id: string) => (id === "status" ? { textContent: "" } : null), head: { append() {} } };
(globalThis as Record<string, unknown>).window = globalThis;
(globalThis as Record<string, unknown>).location = { search: "?renderer=canvas" };
let clock = 1000;
Object.defineProperty(globalThis, "performance", { value: { now: () => clock }, configurable: true });
let frame: ((t: number) => void) | null = null;
(globalThis as Record<string, unknown>).requestAnimationFrame = (f: (t: number) => void) => { frame = f; return 1; };
const { liveClientView, viewStats } = await import("../../src/render/client-scene.js");

const app = (o: Record<string, unknown> = {}) => ({ icon: null, iconState: "", dir: 2, alpha: 255, color: null, transform: null, pixelX: 0, pixelY: 0, layer: 2, plane: 0, overlays: [], mouseOpacity: 1, invisibility: 0, ...o }) as never as any;
const dark = () => app({ plane: 15, layer: 15, blendMode: 2, mouseOpacity: 0, iconState: "dark" });
let raf = 0;
const step = () => { const f = frame; frame = null; if (f) f(++raf); };
const host = { innerHTML: "", appendChild() {}, style: { setProperty() {} }, dispatchEvent() {}, querySelector: () => null } as never as HTMLElement;
const v = liveClientView(host, () => assert.fail("resync asked"));
const eye = { x: 100, y: 50, z: 2 }, MOB = 3, T = 32;
let seq = 0;
const base = (full: boolean) => ({ seq: ++seq, full, worldTime: seq * 0.5, key: "k", view: 7, eyeTile: { ...eye }, sight: null, apps: [] as [number, any][], gone: [] as number[], tiles: [] as [number, number, number[]][], moved: [] as any[], screen: null as any, anims: [] as any[] } as any);
// the red light at world corner (cx, cy), in half tiles from the middle of tile (100, 50)
const lightAt = (cx: number, cy: number) => {
	const X = (eye.x + 0.5 + cx / 2) * T, Y = (1 - (eye.y + 0.5 + cy / 2)) * T;
	let n = 0;
	for (let x = eye.x - 6; x <= eye.x + 6; x++) for (let y = eye.y - 4; y <= eye.y + 4; y++) for (const it of (viewStats as any).tileItems(x, y) as { appearance: any; originX: number; originY: number }[]) {
		const a = it.appearance, u = (X - it.originX) / T, w = (Y - it.originY) / T;
		if (a.plane !== 15 || !Array.isArray(a.color) || u < 0 || u >= 1 || w < 0 || w >= 1) continue;
		const c = a.color, mix = c[0] * (1 - u) * w + c[4] * u * w + c[8] * (1 - u) * (1 - w) + c[12] * u * (1 - w); // SW, SE, NW, NE
		n += (a.alpha / 255) * mix;
	}
	return n;
};
// a light of power 1, range 3, white, from tile (sx, 0): every corner it reaches but `cut` (half tiles from tile (100, 50)), as the server sends it
const RANGE = 3, k = (cx: number, cy: number, sx: number) => Math.max(0, 1 - Math.sqrt((cx / 2 - sx) ** 2 + (cy / 2) ** 2 + 1) / RANGE);
const light = (sx: number, cut: [number, number]) => {
	const out = [MOB, 0, 0, 1, 1, RANGE, 1, 1, 1];
	for (let cx = -9; cx <= 11; cx += 2) for (let cy = -7; cy <= 7; cy += 2) {
		if ((cx === cut[0] && cy === cut[1]) || k(cx, cy, sx) <= 0) continue;
		out.push(cx - 2 * sx, cy, 0, 0, 0);
	}
	return out;
};
const W: [number, number] = [3, 1]; // the corner a wall keeps dark, from both tiles

const u0 = base(true);
u0.apps.push([MOB, app({ layer: 4 })]);
let id = 10;
for (let dy = -4; dy <= 4; dy++) for (let dx = -6; dx <= 6; dx++) { u0.apps.push([id, dark()]); u0.tiles.push([eye.x + dx, eye.y + dy, dx || dy ? [id] : [id, MOB]]); id++; }
u0.light = light(0, W);
v.update(u0 as never); step();
const near = (a: number, b: number, what: string, tol = 0.02) => assert.ok(Math.abs(a - b) < tol, `${what}: ${a.toFixed(3)} vs ${b.toFixed(3)}`);
near(lightAt(-1, -1), k(-1, -1, 0), "standing: the mob tile's SW corner");
near(lightAt(...W), 0, "standing: the walled corner");

// the mob steps east (glide 400 ms: 4 px a 50 ms tick) and the server's shape from the new tile comes with it
const u1 = base(false);
u1.tiles.push([eye.x, eye.y, [10 + 4 * 13 + 6]], [eye.x + 1, eye.y, [10 + 4 * 13 + 7, MOB]]);
u1.moved.push([MOB, eye.x, eye.y, eye.x + 1, eye.y, 4, 1]);
u1.light = light(1, W);
v.update(u1 as never); step();
let worst = 0;
for (let t = 0; t <= 400; t += 50) {
	worst = Math.max(worst, lightAt(...W));
	near(lightAt(-1, -1), k(-1, -1, t / 400), `${t} ms into the step: a corner both tiles light, from where the mob is drawn`, 0.03);
	clock += 50; step();
}
near(worst, 0, "the walled corner, at its brightest during the step");
step(); step();
near(lightAt(1, -1), k(1, -1, 1), "after: the new tile's SW corner");
near(lightAt(...W), 0, "after: the walled corner");
console.log("carried-walk: ok (a carried light's tiles stay put in the world; its strength follows the mob)");
