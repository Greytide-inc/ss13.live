// rider-cam: a rider buckled to your mob (a human on a cyborg's back) is in pred's moved-with ids (client-view.ts riders) and steps with it.
// The server's moved list can name the rider before the mob: its step has the same tiles as the eye's, and must not restart the camera (or
// its own glide) as a server step behind the predicted one: the camera snapped back ~26 px every step (F9 2026-10-23, cyborg_buckle_bug).
import assert from "node:assert";
const ctx = new Proxy({}, { get: () => () => {}, set: () => true });
(globalThis as Record<string, unknown>).document = { createElement: () => ({ width: 0, height: 0, className: "", style: {}, getContext: () => ctx }), getElementById: (id: string) => (id === "status" ? { textContent: "" } : null), head: { append() {} } };
(globalThis as Record<string, unknown>).window = globalThis;
(globalThis as Record<string, unknown>).location = { search: "?renderer=canvas" };
let clock = 1000;
Object.defineProperty(globalThis, "performance", { value: { now: () => clock }, configurable: true });
let frame: ((t: number) => void) | null = null;
(globalThis as Record<string, unknown>).requestAnimationFrame = (f: (t: number) => void) => { frame = f; return 1; };
(globalThis as Record<string, unknown>).setTimeout = () => 0; // steps go out from frames here
const { liveClientView, viewStats } = await import("../../src/render/client-scene.js");

const app = (o: Record<string, unknown> = {}) => ({ icon: null, iconState: "", dir: 2, alpha: 255, color: null, transform: null, pixelX: 0, pixelY: 0, layer: 2, plane: 0, overlays: [], mouseOpacity: 1, invisibility: 0, ...o }) as never as any;
const step = () => { const f = frame; frame = null; if (f) f(clock); };
const frames = (ms: number) => { for (let t = 0; t < ms; t += 16) { clock += 16; step(); } };
const host = { innerHTML: "", appendChild() {}, style: { setProperty() {} }, dispatchEvent() {}, querySelector: () => null } as never as HTMLElement;
const sent: number[] = [];
const v = liveClientView(host, () => assert.fail("resync asked"), (d) => sent.push(d));
const eye = { x: 100, y: 50, z: 2 }, BORG = 3, RIDER = 5, FLOOR = 7, ALL = 2 ** 49 - 1;
let seq = 0;
const base = (full: boolean, e = eye) => ({ seq: ++seq, full, worldTime: seq * 0.5, key: "k", view: 7, eyeTile: { ...e }, sight: null, apps: [] as [number, any][], gone: [] as number[], tiles: [] as [number, number, number[]][], moved: [] as any[], screen: null as any, anims: [] as any[], pred: [BORG, ALL, RIDER] } as any);
const vs = viewStats as any;

const u0 = base(true);
u0.apps.push([BORG, app({ iconState: "robot", layer: 4 })], [RIDER, app({ iconState: "human", layer: 4.1 })], [FLOOR, app({ iconState: "floor", layer: 1 })]);
for (let dy = -4; dy <= 4; dy++) for (let dx = -6; dx <= 6; dx++) u0.tiles.push([eye.x + dx, eye.y + dy, dx === 0 && dy === 0 ? [FLOOR, BORG, RIDER] : [FLOOR]]);
v.update(u0 as never); step();

// East held: the step is drawn ahead at once; a few frames into it the server takes it, naming the rider first.
v.predictKey("EAST", true); step(); frames(48);
assert.deepStrictEqual(sent, [4], "the step is sent");
assert.strictEqual(vs.predSteps, 1, "drawn ahead");
const u1 = base(false, { ...eye, x: eye.x + 1 }); u1.steps = 1;
u1.moved.push([RIDER, eye.x, eye.y, eye.x + 1, eye.y, 8, 1], [BORG, eye.x, eye.y, eye.x + 1, eye.y, 8, 1]);
v.update(u1 as never); frames(48);
v.predictKey("EAST", false); frames(200);
assert.strictEqual(vs.predOk, 1, `the server's step matched the drawn one (ok ${vs.predOk}, wrong ${vs.predWrong})`);
assert.deepStrictEqual(vs.predJumps, [], "neither the mob nor the camera jumps when the server's step lands");
console.log("rider-cam: ok (a rider named before your mob in moved doesn't restart the camera)");
