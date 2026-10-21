// mech-turn: predicted mech steps on the page (u.predTurn, client-scene.ts). A key in a direction the mech doesn't face only turns it
// (domove -> mechturn): drawn turned at once, not moved; the next key in that direction steps. The server finishing the turn (it moves
// nothing) must not count as a refused step: the step drawn after it stays, and the server's move takes it over.
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
const host = { innerHTML: "", appendChild() {}, style: { setProperty() {} }, dispatchEvent() {}, querySelector: () => null } as never as HTMLElement;
const sent: number[] = [];
const v = liveClientView(host, () => assert.fail("resync asked"), (d) => sent.push(d));
const eye = { x: 100, y: 50, z: 2 }, MECH = 3, FLOOR = 7, ALL = 2 ** 49 - 1;
let seq = 0;
const base = (full: boolean, e = eye) => ({ seq: ++seq, full, worldTime: seq * 0.5, key: "k", view: 7, eyeTile: { ...e }, sight: null, apps: [] as [number, any][], gone: [] as number[], tiles: [] as [number, number, number[]][], moved: [] as any[], screen: null as any, anims: [] as any[], pred: [MECH, ALL], predTurn: 1 } as any);
const mechDir = () => ((viewStats as any).tileItems(eye.x, eye.y) as { appearance: any }[]).find((it) => it.appearance.iconState === "ripley")?.appearance.dir;
const vs = viewStats as any;

const u0 = base(true);
u0.apps.push([MECH, app({ iconState: "ripley", layer: 4 })], [FLOOR, app({ iconState: "floor", layer: 1 })]);
for (let dy = -4; dy <= 4; dy++) for (let dx = -6; dx <= 6; dx++) u0.tiles.push([eye.x + dx, eye.y + dy, dx === 0 && dy === 0 ? [FLOOR, MECH] : [FLOOR]]);
v.update(u0 as never); step();

// 1. west, facing south: a turn. Sent, drawn turned, not moved.
v.predictKey("WEST", true); step(); clock += 20; step();
assert.deepStrictEqual(sent, [8], "the turn is sent");
assert.strictEqual(vs.predTurns, 1, "drawn as a turn");
assert.strictEqual(vs.predSteps, 0, "not as a step");
assert.strictEqual(mechDir(), 8, `drawn facing west at once (predFace ${vs.predFace}, items ${JSON.stringify(((viewStats as any).tileItems(eye.x, eye.y) as any[]).map((i) => [i.appearance.iconState, i.appearance.dir]))})`);

// 2. still held, a step's time later: now it faces west, so this one steps
clock += 250; step();
assert.deepStrictEqual(sent, [8, 8], "the step is sent");
assert.strictEqual(vs.predSteps, 1, "drawn as a step");

// 3. the server did the turn (steps 1, nothing moved): the drawn step stays
const u1 = base(false); u1.apps.push([MECH, app({ iconState: "ripley", layer: 4, dir: 8 })]); u1.steps = 1;
v.update(u1 as never); step();
// 4. the server's step: it takes over the drawn one
const u2 = base(false, { ...eye, x: eye.x - 1 }); u2.moved.push([MECH, eye.x, eye.y, eye.x - 1, eye.y, 8, 1]); u2.steps = 2;
v.update(u2 as never); step();
assert.strictEqual(vs.predOk, 1, `the server's step matched the drawn one (ok ${vs.predOk}, wrong ${vs.predWrong})`);
v.predictKey("WEST", false);
console.log("mech-turn: ok (a new direction turns at once, the next key steps, the server's turn doesn't undo the drawn step)");
