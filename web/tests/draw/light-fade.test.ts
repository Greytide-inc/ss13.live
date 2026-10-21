// light fade: a lighting object whose look changes is drawn as a mix of the old look and the new one, going from old to new over the time of the
// latest glide (100 ms with none), so a carried light slides with its carrier. Lighting objects add up on their plane (BLEND_ADD), so the looks'
// alphas must always sum to 255 (never brighter than either). Checked on the kept tile's draw items at set times: the old
// look alone before, old + new sharing the alpha mid-way, a second change joining in, the new look alone (same object) after, and then no
// more rebuilds. The page's own check (kept items vs fresh ones) must stay clean throughout.
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
const light = (v: number, state = "") => app({ plane: 15, layer: 15, blendMode: 2, mouseOpacity: 0, iconState: state, color: state ? null : [v, v, v, 0, v, v, v, 0, v, v, v, 0, v, v, v, 0, 0, 0, 0, 1] });
let raf = 0; // each frame its own timestamp (the page runs its frame hooks once per timestamp)
const step = () => { const f = frame; frame = null; assert(f, "no frame requested"); f(++raf); };
const host = { innerHTML: "", appendChild() {}, style: { setProperty() {} }, dispatchEvent() {}, querySelector: () => null } as never as HTMLElement;
const v = liveClientView(host, () => assert.fail("resync asked"));
const eye = { x: 100, y: 50, z: 2 }, FLOOR = 1, LIGHT = 2, MOB = 3;
let seq = 0;
const base = (full: boolean) => ({ seq: ++seq, full, worldTime: seq * 0.5, key: "k", view: 7, eyeTile: { ...eye }, sight: null, apps: [] as [number, any][], gone: [] as number[], tiles: [] as [number, number, number[]][], moved: [] as any[], screen: null as any, anims: [] as any[] });
const items = () => ((viewStats as any).tileItems(eye.x, eye.y) as { appearance: any }[]).filter((i) => i.appearance.plane === 15);
const model = { floor: app(), light: light(0.2), mob: app({ layer: 4 }) };
const dump = () => ({ builtAt: "", worldTime: seq, clients: [{ key: "k", ckey: "k", view: 7, eyeTile: { ...eye }, screen: [], viewTiles: [{ x: eye.x, y: eye.y, appearances: [model.floor, model.mob, model.light] }, { x: eye.x + 1, y: eye.y, appearances: [] }] }] }) as never;
const clean = (what: string) => { const d = v.check(dump()); assert.deepStrictEqual(d, [], `${what}: ${d.join("; ")}`); };
const change = (a: any, moved = false) => { const u = base(false); model.light = a; u.apps.push([LIGHT, a]); if (moved) u.moved.push([MOB, eye.x - 1, eye.y, eye.x, eye.y, 8, 1]); v.update(u as never); step(); };
const near = (a: number, b: number, what: string) => { assert.ok(Math.abs(a - b) < 0.5, `${what}: ${a} vs ${b}`); near1(); };
const near1 = () => { const sum = items().reduce((n, i) => n + i.appearance.alpha, 0); assert.ok(Math.abs(sum - 255) < 1e-6, `alphas sum to ${sum}, not 255`); };

const u0 = base(true);
u0.apps.push([FLOOR, model.floor], [LIGHT, model.light], [MOB, model.mob]);
u0.tiles.push([eye.x, eye.y, [FLOOR, LIGHT, MOB]], [eye.x + 1, eye.y, []]);
v.update(u0 as never); step();
const a0 = model.light;
assert.deepStrictEqual(items().map((i) => i.appearance), [a0], "a first (full) view: no fade");
clean("full");

// A change with nothing gliding: 100 ms.
const a1 = light(0.8);
change(a1);
assert.strictEqual(items().length, 2);
assert.strictEqual(items()[0].appearance, a0, "the old look underneath, as it was");
assert.deepStrictEqual([items()[1].appearance.color, items()[1].appearance.alpha], [a1.color, 0], "the new look on top, from nothing");
clock += 50; step();
near(items()[1].appearance.alpha, 127.5, "half-way");
near(items()[0].appearance.alpha, 127.5, "the old look has gone down by as much");
assert.strictEqual(items()[1].appearance.color, a1.color, "the same matrix array every frame (the renderer keeps its texture by it)");
clean("mid-fade");
// A second change before the first is over: three looks, the first two as they were.
const a2 = light(0, "dark");
change(a2);
assert.strictEqual(items().length, 3);
near(items()[0].appearance.alpha, 127.5, "the first two looks as they were"); near(items()[1].appearance.alpha, 127.5, "the first two looks as they were");
assert.deepStrictEqual([items()[2].appearance.iconState, items()[2].appearance.alpha], ["dark", 0]);
clock += 50; step();
near(items()[0].appearance.alpha, 0, "the oldest look is gone");
near(items()[1].appearance.alpha, 127.5, "the middle one shares with the newest");
near(items()[2].appearance.alpha, 127.5, "second half-way");
clock += 51; step();
assert.deepStrictEqual(items().map((i) => i.appearance), [a2], "over: the new look alone, the very object the update sent");
{ const n = viewStats.applied; step(); step(); assert.strictEqual(viewStats.applied, n, "no more rebuilds once the fade is over"); }
clean("after");

// With a glide in the same update (8 px a tick, 50 ms ticks: 200 ms a tile) the fade takes as long as the glide.
const a3 = light(0.5);
change(a3, true);
clock += 100; step();
near(items().at(-1)!.appearance.alpha, 127.5, "half-way through a 200 ms glide");
clock += 101; step(); step();
assert.deepStrictEqual(items().map((i) => i.appearance), [a3]);
// An update a tick after the glide started (the lighting subsystem runs after the move) still takes the glide's time.
const u = base(false); u.moved.push([MOB, eye.x, eye.y, eye.x + 1, eye.y, 8, 1]); u.tiles.push([eye.x, eye.y, [FLOOR, LIGHT]], [eye.x + 1, eye.y, [MOB]]); v.update(u as never); step();
clock += 50;
const a4 = light(0.1);
change(a4);
clock += 100; step();
near(items().at(-1)!.appearance.alpha, 127.5, "half-way, 200 ms fade started a tick after the step");
// Not a lighting object: no fade. A full update: fades dropped.
const ub = base(false); model.floor = app({ iconState: "x" }); ub.apps.push([FLOOR, model.floor]); v.update(ub as never); step();
assert.strictEqual((viewStats as any).tileItems(eye.x, eye.y).filter((i: any) => i.appearance.plane === 0).length, 1, "a floor's new look shows at once");
const uf = base(true); uf.apps.push([FLOOR, model.floor], [LIGHT, a4], [MOB, model.mob]); uf.tiles.push([eye.x, eye.y, [FLOOR, LIGHT]], [eye.x + 1, eye.y, [MOB]]); v.update(uf as never); step();
assert.deepStrictEqual(items().map((i) => i.appearance), [a4], "a full update shows the lights as they are");
console.log("light-fade: ok (old look under, new one fading in over 100 ms or the glide's time; stacked changes; ends on the sent appearance)");
