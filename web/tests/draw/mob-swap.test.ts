// mob-swap: a predicted step into a mob the server listed in u.swap (both on help intent: /mob/living/MobBump swaps them) is drawn at once,
// and that mob slides into the tile yours left. Before, such a step waited a whole ping for the server (skip "blocked", F9 2026-10-25 and
// 2026-10-28: 90-150 ms key->move passing someone). The server's swap then takes over both glides where they are: no jump back.
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
const eye = { x: 100, y: 50, z: 2 }, ME = 3, IAN = 5, FLOOR = 7, FREE = 2 ** 49 - 1 - 2 ** ((0 + 3) * 7 + 1 + 3); // every tile but Ian's (1, 0)
let seq = 0;
const base = (full: boolean, e = eye) => ({ seq: ++seq, full, worldTime: seq * 0.5, key: "k", view: 7, eyeTile: { ...e }, sight: null, apps: [] as [number, any][], gone: [] as number[], tiles: [] as [number, number, number[]][], moved: [] as any[], screen: null as any, anims: [] as any[], pred: [ME, FREE], swap: [IAN, 1, 0] } as any);
const vs = viewStats as any;
// where Ian is drawn, map px east of eye.x's left edge (his tile's origin plus his glide)
const ianX = (): number => { for (let dx = -2; dx <= 2; dx++) { const it = (vs.tileItems(eye.x + dx, eye.y) as { id?: number; originX: number; appearance: any }[]).find((i) => i.appearance.iconState === "ian"); if (it) return it.originX - eye.x * 32; } return NaN; };

const u0 = base(true);
u0.apps.push([ME, app({ iconState: "human", layer: 4 })], [IAN, app({ iconState: "ian", layer: 4 })], [FLOOR, app({ iconState: "floor", layer: 1 })]);
for (let dy = -4; dy <= 4; dy++) for (let dx = -6; dx <= 6; dx++) u0.tiles.push([eye.x + dx, eye.y + dy, dx === 0 && dy === 0 ? [FLOOR, ME] : dx === 1 && dy === 0 ? [FLOOR, IAN] : [FLOOR]]);
v.update(u0 as never); step();
const x0 = ianX();
assert.strictEqual(x0, 32, `Ian starts a tile east (${x0})`);

// 1. East: drawn at once, Ian heads west
v.predictKey("EAST", true); step(); frames(48);
assert.deepStrictEqual(sent, [4], "the step is sent");
assert.strictEqual(vs.predSteps, 1, `the step into Ian is drawn ahead (skips ${JSON.stringify(vs.predSkip)})`);
assert.strictEqual(vs.predSwap, 1, "Ian is drawn swapping");
const xMid = ianX();
assert.ok(xMid < 32 && xMid > 0, `Ian slides west (${xMid})`);
v.predictKey("EAST", false);

// 2. the server swaps the two (Ian first in moved, as MobBump moves him first): both glides go on, Ian keeps sliding from where he is
const u1 = base(false, { ...eye, x: eye.x + 1 }); u1.steps = 1; u1.swap = [IAN, -1, 0];
u1.moved.push([IAN, eye.x + 1, eye.y, eye.x, eye.y, 8, 1], [ME, eye.x, eye.y, eye.x + 1, eye.y, 8, 1]);
u1.tiles.push([eye.x, eye.y, [FLOOR, IAN]], [eye.x + 1, eye.y, [FLOOR, ME]]);
v.update(u1 as never); step();
const xAfter = ianX();
assert.ok(Math.abs(xAfter - xMid) <= 8, `no jump when the server's swap lands (${xMid} -> ${xAfter})`);
frames(300);
assert.strictEqual(vs.predOk, 1, `the server's step matched the drawn one (ok ${vs.predOk}, wrong ${vs.predWrong})`);
assert.strictEqual(ianX(), 0, `Ian ends on your old tile (${ianX()})`);
assert.deepStrictEqual(vs.predJumps, [], "your mob and the camera don't jump either");

// 3. a diagonal step through Ian's tile isn't guessed (tg refuses swaps mid-diagonal): it waits for the server
const before = vs.predSteps;
const u2 = base(false, { ...eye, x: eye.x + 1 }); u2.swap = [IAN, -1, 0];
v.update(u2 as never); step();
v.predictKey("WEST", true); v.predictKey("NORTH", true); step(); frames(32);
assert.strictEqual(vs.predSteps, before, "a diagonal past Ian waits for the server");
v.predictKey("WEST", false); v.predictKey("NORTH", false);
console.log("mob-swap: ok (a step into a help-intent mob is drawn at once, the other mob slides back, the server's swap doesn't jump)");
