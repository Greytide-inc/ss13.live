// statusdisplay.test.mjs - a status display set to Message has maptext drawn inside its own 32x32 tile (also with the wall
// pixel_y/pixel_x the map gives it), and set_picture (Red Alert) removes the maptext and shows the picture overlay.
// No boot: loads the game tree, makes one /obj/machinery/status_display, calls its own procs.
// Usage (from web/, after `npx tsc -p .`): node tests/static/statusdisplay.test.mjs
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
const web = resolve(import.meta.dirname, "../..");
const imp = (p) => import(pathToFileURL(resolve(web, p)).href);
const { loadGame } = await imp("build/dist/src/tools/game-tree.js");
const { VM } = await imp("build/dist/src/vm/interpreter.js");
const rt = await imp("build/dist/src/translate/runtime.js");
const { buildAppearance } = await imp("build/dist/src/appearance/appearance.js");
globalThis.document ??= new Proxy({}, { get: () => () => new Proxy(function () {}, { get: () => () => {}, set: () => true }) }); // station-client.ts reads the page at import
const { drawAppearance } = await imp("build/dist/src/render/station-client.js");
const { maptextBoxRect } = await imp("build/dist/src/render/maptext.js");
const { tree, install } = await loadGame();
const vm = new VM(tree);
install(vm);
vm.runGlobalInit();
const T = "/obj/machinery/status_display";
const sd = vm.newObject(tree.getType(T));
const call = (name, args) => vm.call(rt.P(`${T}/proc/${name}`), args, sd);
let bad = 0;
const check = (ok, msg) => { console.log((ok ? "ok   " : "FAIL ") + msg); if (!ok) bad++; };
const inTile = (a, px, py) => { const r = maptextBoxRect(a, 0, 0, 32); return r.x >= 0 && r.y >= 0 && r.x + r.w <= 32 && r.y + r.h <= 32; };

rt.setFv({}, "mode", sd, 2);
call("set_message", ["we r", "fukd"]);
rt.setFv({}, "mode", sd, 2);
call("update", []);
let a = buildAppearance(sd);
check(typeof a.maptext === "string" && a.maptext.includes("we r") && a.maptext.includes("fukd"), "Message mode: maptext holds both lines");
check(inTile(a), `maptext box ${JSON.stringify(maptextBoxRect(a, 0, 0, 32))} is inside the 32x32 tile`);
call("set_picture", ["redalert"]);
rt.setFv({}, "mode", sd, 3);
call("update", []);
a = buildAppearance(sd);
check(!a.maptext, "after Red Alert (set_picture): maptext is gone");
// drawing: a wall display with pixel_x 32 / pixel_y -32 (the map does this) draws its text clipped to the box on ITS tile
const rects = [];
const ctx = new Proxy({}, { get: (_, k) => k === "rect" ? (...r) => rects.push(r) : k === "measureText" ? () => ({ width: 5 }) : () => {}, set: () => true });
call("set_message", ["we r", "fukd"]); rt.setFv({}, "mode", sd, 2); call("update", []);
rt.setFv({}, "pixel_x", sd, 32); rt.setFv({}, "pixel_y", sd, -32);
a = buildAppearance(sd);
drawAppearance(ctx, a, new Map(), 100, 200);
// tile origin (100,200) top-left; pixel_x 32 -> +32 right; pixel_y -32 -> +32 down; box 32x26 bottom-aligned in the tile (y +6)
check(JSON.stringify(rects[0]) === JSON.stringify([132, 238, 32, 26]), "drawn clip rect with pixel_x/pixel_y: " + JSON.stringify(rects[0]) + " want [132,238,32,26]");
process.exit(bad ? 1 : 0);
