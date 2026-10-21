// put-down: predicted put-down on the page (predictPut, client-scene.ts). A click on a table the server listed in put takes the held item out of
// the hand slot and its in-hand sprite off the mob at once, and draws it on the table centred on the click, sliding there from the mob; the
// server's copy landing a ping later carries on the same slide (its own slide isn't played again). A click the server refused puts it back
// in the hand; the drop key puts it on the mob's tile.
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
let raf = 0;
const step = () => { const f = frame; frame = null; if (f) f(++raf); };
const host = { innerHTML: "", appendChild() {}, style: { setProperty() {} }, dispatchEvent() {}, querySelector: () => null } as never as HTMLElement;
const v = liveClientView(host, () => assert.fail("resync asked"));
const eye = { x: 100, y: 50, z: 2 }, MOB = 3, ITEM = 4, TABLE = 5, HAND = 6, FLOOR = 7;
let seq = 0;
const base = (full: boolean) => ({ seq: ++seq, full, worldTime: seq * 0.5, key: "k", view: 7, eyeTile: { ...eye }, sight: null, apps: [] as [number, any][], gone: [] as number[], tiles: [] as [number, number, number[]][], moved: [] as any[], screen: null as any, anims: [] as any[] } as any);
const inHand = app({ icon: null, iconState: "ih-crowbar", layer: 4.997 });
const mobApp = app({ layer: 4, iconState: "body", overlays: [inHand] });
const held = app({ iconState: "crowbar", layer: 20, plane: 20 });
const handScreen: [number, string, unknown][] = [[HAND, "/obj/screen/inventory/hand/right", "CENTER:-16,SOUTH:5"], [ITEM, "/obj/item/weapon/crowbar", "CENTER:-16,SOUTH:5"]];
const put = { id: ITEM, layer: 3, plane: 0, ih: [null, "ih-crowbar"], keys: ["Q"], on: [[TABLE, 1, 0, 1]] };
const ALL = 2 ** 49 - 1;
const items = (x: number, y: number) => ((viewStats as any).tileItems(x, y) as { appearance: any; originX: number }[]);
const itemAt = (x: number, y: number) => items(x, y).find((it) => it.appearance.iconState === "crowbar");
const hasInHand = () => items(eye.x, eye.y).some((it) => it.appearance.iconState === "ih-crowbar" || it.appearance.overlays?.some((o: any) => o.iconState === "ih-crowbar"));
const held_ = () => v.hudState("held");

const u0 = base(true);
u0.apps.push([MOB, mobApp], [ITEM, held], [TABLE, app({ iconState: "table" })], [HAND, app({ overlays: [app({ iconState: "hand_active" })] })], [FLOOR, app({ iconState: "floor", layer: 1 })]);
for (let dy = -4; dy <= 4; dy++) for (let dx = -6; dx <= 6; dx++) u0.tiles.push([eye.x + dx, eye.y + dy, dx === 0 && dy === 0 ? [FLOOR, MOB] : dx === 1 && dy === 0 ? [FLOOR, TABLE] : [FLOOR]]);
u0.screen = handScreen;
u0.pred = [MOB, ALL];
u0.put = put;
v.update(u0 as never); step();
v.predictKey("X", false); // prediction on (the page turns it on at the first key)
assert.ok(hasInHand() && held_().includes(`${ITEM} `), "before: held, in-hand sprite on the mob");

// 1. a click on the table at icon-x=24: the item leaves the hand and shows on the table, sliding from the mob to pixel_x 8
v.predictPut(TABLE, "icon-x=24;icon-y=16;left=1"); step();
assert.ok(!held_().includes(`${ITEM} `), `at the click: out of the hand (${held_()})`);
assert.ok(!hasInHand(), "at the click: in-hand sprite off the mob");
const at0 = itemAt(eye.x + 1, eye.y);
assert.ok(at0, "at the click: on the table's tile");
assert.strictEqual(at0!.appearance.layer, 3, "floor layer");
assert.ok(at0!.appearance.pixelX < -20, `slide starts at the mob: pixelX ${at0!.appearance.pixelX}`);
clock += 150; step();
const mid = itemAt(eye.x + 1, eye.y)!.appearance.pixelX;
assert.ok(mid > -24 && mid < 8, `mid-slide: ${mid}`);
// the server's copy lands mid-slide (with its own slide: the page draws its own for that item) and the mob's look without the sprite comes a tick later
const u1 = base(false);
u1.tiles.push([eye.x + 1, eye.y, [FLOOR, TABLE, ITEM]]);
u1.apps.push([ITEM, app({ iconState: "crowbar", layer: 3, pixelX: 8 })]);
u1.screen = [handScreen[0]];
u1.anims.push(["a", ITEM, 1, 3, 1, 3, 0, [["pixel_x", -24, 8]]]);
u1.pred = [MOB, ALL];
u1.apps.push([MOB, mobApp]); // the old look again (a turn): the sprite stays off
v.update(u1 as never); step();
assert.strictEqual((viewStats as any).predPutOk, 1, "landed");
assert.ok(!hasInHand(), "a mob look still with the sprite: kept off");
const after = itemAt(eye.x + 1, eye.y)!.appearance.pixelX;
assert.ok(after >= mid && after < 8, `the slide goes on from where it was, not restarted: ${mid} -> ${after}`);
clock += 200; step();
assert.strictEqual(itemAt(eye.x + 1, eye.y)!.appearance.pixelX, 8, "slide done: pixel_x 8");
assert.strictEqual(items(eye.x + 1, eye.y).filter((it) => it.appearance.iconState === "crowbar").length, 1, "drawn once");
const u2 = base(false);
u2.apps.push([MOB, app({ ...mobApp, overlays: [] })]);
u2.pred = [MOB, ALL];
v.update(u2 as never); step();
assert.ok(!hasInHand(), "the server's mob look");

// 2. picked up again, put on the table, refused (the click's answer sends its look still in the hand): back in the hand
const u3 = base(false);
u3.tiles.push([eye.x + 1, eye.y, [FLOOR, TABLE]]);
u3.apps.push([ITEM, held], [MOB, mobApp]);
u3.screen = handScreen;
u3.pred = [MOB, ALL];
u3.put = put;
v.update(u3 as never); step();
assert.ok(held_().includes(`${ITEM} `) && hasInHand(), "held again");
clock += 3000; step();
v.predictPut(TABLE, "icon-x=16;icon-y=16;left=1"); step();
assert.ok(!held_().includes(`${ITEM} `) && itemAt(eye.x + 1, eye.y), "put again");
const u4 = base(false);
u4.apps.push([ITEM, held]);
u4.pred = [MOB, ALL];
u4.put = put;
v.update(u4 as never); step();
assert.ok(held_().includes(`${ITEM} `) && hasInHand() && !itemAt(eye.x + 1, eye.y), "refused: back in the hand, sprite back on the mob, off the table");
assert.strictEqual((viewStats as any).predPutBack, 1, "counted back");

// 3. the drop key: on the mob's tile, no slide
v.predictPut(null, "", "Q"); step();
const d = itemAt(eye.x, eye.y);
assert.ok(d && d.appearance.pixelX === 0 && !held_().includes(`${ITEM} `) && !hasInHand(), "dropped on your tile at once");
v.predictPut(null, "", "E"); // other keys: nothing
console.log("put-down: ok (put on a table, slide carried on by the server's copy, refused one back in the hand, drop key)");
