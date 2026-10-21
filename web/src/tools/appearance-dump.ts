// appearance-dump - Node script that builds BuiltAppearance records (src/appearance/
// appearance.ts) for a hand-picked set of real tg atoms, plus a small 5x5 scene, and writes them
// to web/build/2c/appearances.json for the browser drawing page (web/draw/) to fetch and render.
//
// Reuses appearance.test.ts's setup exactly (game tree + new VM + vfs bundle + runGlobalInit +
// vm.map.resize + vm.newObject): no full boot, no map load of Box Station:
// that's enough to get real atoms with real New()-computed vars (e.g. the airlock's `layer`).
//
// Usage: npm run appearance-dump (needs build/game-types.js and translated-tg.js from node tools/translate-tg.mjs, and
// web/build/vfs-bundle.json; no tgstation.json any more).

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { VM } from "../vm/interpreter.js";
import type { DMType } from "../vm/objtree.js";
import { loadGame } from "./game-tree.js";
import { DMList, DMObject } from "../vm/objects.js";
import { NORTH, SOUTH, EAST, WEST } from "../vm/world.js";
import { Vfs } from "../vfs/vfs.js";
import type { VfsBundle } from "../vfs/bundle-format.js";
import { buildAppearance, type BuiltAppearance } from "../appearance/appearance.js";

// build/dist/src/tools/appearance-dump.js -> up 4 to web/
let webDir = dirname(fileURLToPath(import.meta.url));
for (let i = 0; i < 4; i++) webDir = dirname(webDir);
const repoRoot = dirname(webDir);
const bundlePath = resolve(repoRoot, "web/build/vfs-bundle.json");
const outDir = resolve(repoRoot, "web/build/2c");
const outPath = resolve(outDir, "appearances.json");

const { tree, install } = await loadGame();
const vm = new VM(tree);
install(vm);
if (existsSync(bundlePath)) {
	vm.vfs = new Vfs(JSON.parse(readFileSync(bundlePath, "utf8")) as VfsBundle);
} else {
	console.error(`missing ${bundlePath}: run npm run bundle-vfs first`);
	process.exit(1);
}
const rtErrors: string[] = [];
vm.onRuntimeError = (e) => rtErrors.push(`${e.message} in ${e.proc}`);
vm.runGlobalInit();

// 5x5 scene (columns 1-5) + one extra column (6) as scratch space for the single-atom gallery,
// so converting scene turfs to wall/floor never collides with atoms placed for the gallery.
const W = 5, H = 5;
vm.map.resize(6, Math.max(H, 6), 1);

function type(p: string): DMType {
	const t = tree.getType(p);
	if (!t) throw new Error(`missing type ${p}`);
	return t;
}

function turfAt(x: number, y: number) {
	const t = vm.map.turfAt(x, y, 1);
	if (!t) throw new Error(`no turf at ${x},${y}`);
	return t;
}

/** Re-types the turf at x,y to `typePath` (runs its real New()) and returns the atom. Floor turfs
 *  set icon_state in Initialize() (not run by this lightweight setup), so apply
 *  their own documented default (`icon_regular_floor`) explicitly to get a real sprite, not blank. */
function setTurf(x: number, y: number, typePath: string): DMObject {
	const t = vm.newObject(type(typePath), [turfAt(x, y)]) as DMObject;
	if (typePath === "/turf/open/floor" && !t.getVar("icon_state")) t.setVar("icon_state", "floor");
	return t;
}

const imageType = type("/image");
function image(opts: { icon?: string; iconState?: string; dir?: number; layer?: number; plane?: number; color?: string; alpha?: number }): DMObject {
	const img = vm.newObject(imageType, []) as DMObject;
	if (opts.icon !== undefined) img.setVar("icon", opts.icon);
	if (opts.iconState !== undefined) img.setVar("icon_state", opts.iconState);
	if (opts.dir !== undefined) img.setVar("dir", opts.dir);
	if (opts.layer !== undefined) img.setVar("layer", opts.layer);
	if (opts.plane !== undefined) img.setVar("plane", opts.plane);
	if (opts.color !== undefined) img.setVar("color", opts.color);
	if (opts.alpha !== undefined) img.setVar("alpha", opts.alpha);
	return img;
}

interface AtomEntry {
	id: string;
	label: string;
	appearance: BuiltAppearance;
}
const atoms: AtomEntry[] = [];

// ---- floor turf ----
{
	const floor = setTurf(1, 6, "/turf/open/floor");
	atoms.push({ id: "floor", label: "floor turf", appearance: buildAppearance(floor) });
}

// ---- wall ----
{
	const wall = setTurf(2, 6, "/turf/closed/wall");
	atoms.push({ id: "wall", label: "wall", appearance: buildAppearance(wall) });
}

// ---- airlock, with a bolt-light overlay (something with overlays) ----
{
	const floor = setTurf(3, 6, "/turf/open/floor");
	const airlock = vm.newObject(type("/obj/machinery/door/airlock"), [floor]) as DMObject;
	// A real overlay state (see code/game/machinery/doors/airlock.dm's get_airlock_overlay calls),
	// with an explicit icon (its own overlays.dmi, distinct from the airlock's base sprite sheet).
	const boltLight = image({ icon: "icons/obj/doors/airlocks/station/overlays.dmi", iconState: "lights_bolts" });
	airlock.setVar("overlays", new DMList([boltLight] as never[]));
	atoms.push({ id: "airlock", label: "airlock (with bolt-light overlay)", appearance: buildAppearance(airlock) });
}

// ---- items ----
{
	const floor = setTurf(4, 6, "/turf/open/floor");
	const screwdriver = vm.newObject(type("/obj/item/weapon/screwdriver"), [floor]) as DMObject;
	atoms.push({ id: "screwdriver", label: "screwdriver", appearance: buildAppearance(screwdriver) });
	const crowbar = vm.newObject(type("/obj/item/weapon/crowbar"), [floor]) as DMObject;
	atoms.push({ id: "crowbar", label: "crowbar", appearance: buildAppearance(crowbar) });
	const taser = vm.newObject(type("/obj/item/weapon/gun/energy/taser"), [floor]) as DMObject;
	atoms.push({ id: "taser", label: "energy taser", appearance: buildAppearance(taser) });
}

// ---- cow, all 4 directions (a mob) ----
{
	const floor = setTurf(5, 6, "/turf/open/floor");
	const cow = vm.newObject(type("/mob/living/simple_animal/cow"), [floor]) as DMObject;
	for (const [name, dir] of [["south", SOUTH], ["north", NORTH], ["east", EAST], ["west", WEST]] as const) {
		cow.setVar("dir", dir);
		atoms.push({ id: `cow-${name}`, label: `cow, facing ${name}`, appearance: buildAppearance(cow) });
	}
}

// ---- 96x96 sprite with a pixel offset (jungle tree, small) ----
{
	const floor = setTurf(1, 1, "/turf/open/floor"); // scratch tile, overwritten below by the scene anyway is fine (scene sets it again)
	const tree2 = vm.newObject(type("/obj/structure/flora/tree/jungle/small"), [floor]) as DMObject;
	atoms.push({ id: "jungle-tree-small", label: "jungle tree, small (96x96, pixel offset)", appearance: buildAppearance(tree2) });
}

// ---- color + alpha on a plain obj ----
{
	const obj = vm.newObject(type("/obj"), [turfAt(6, 1)]) as DMObject;
	obj.setVar("icon", "icons/obj/tools.dmi");
	obj.setVar("icon_state", "wrench");
	obj.setVar("color", "#ff4444");
	obj.setVar("alpha", 160);
	atoms.push({ id: "colored-alpha", label: "plain obj, red tint + alpha 160", appearance: buildAppearance(obj) });
}

// ---- the 5x5 scene: floor everywhere, one wall tile, one door tile, one stacked tile ----
interface Tile {
	x: number;
	y: number;
	appearances: BuiltAppearance[];
}
const tiles: Tile[] = [];
for (let y = 1; y <= H; y++) {
	for (let x = 1; x <= W; x++) {
		const floor = setTurf(x, y, "/turf/open/floor");
		const layer: BuiltAppearance[] = [buildAppearance(floor)];
		tiles.push({ x, y, appearances: layer });
	}
}
function tileAt(x: number, y: number): Tile {
	const t = tiles.find((t) => t.x === x && t.y === y);
	if (!t) throw new Error(`no scene tile ${x},${y}`);
	return t;
}
// wall at (4,2)
{
	const wall = setTurf(4, 2, "/turf/closed/wall");
	tileAt(4, 2).appearances = [buildAppearance(wall)];
}
// door at (2,4)
{
	const airlock = vm.newObject(type("/obj/machinery/door/airlock"), [turfAt(2, 4)]) as DMObject;
	tileAt(2, 4).appearances.push(buildAppearance(airlock));
}
// 3 stacked objects at (3,3), to show layer order
{
	const floor = turfAt(3, 3);
	const crowbar = vm.newObject(type("/obj/item/weapon/crowbar"), [floor]) as DMObject;
	const taser = vm.newObject(type("/obj/item/weapon/gun/energy/taser"), [floor]) as DMObject;
	const screwdriver = vm.newObject(type("/obj/item/weapon/screwdriver"), [floor]) as DMObject;
	const t = tileAt(3, 3);
	t.appearances.push(buildAppearance(crowbar), buildAppearance(taser), buildAppearance(screwdriver));
}
// each tile's stack sorted by (plane, layer) ascending, so the drawing page can just draw in order
for (const t of tiles) t.appearances.sort((a, b) => a.plane - b.plane || a.layer - b.layer);

if (rtErrors.length) {
	console.error(`${rtErrors.length} VM runtime error(s) while building fixtures:`);
	for (const e of rtErrors.slice(0, 10)) console.error(`  ${e}`);
	process.exit(1);
}

mkdirSync(outDir, { recursive: true });
const dump = {
	builtAt: new Date().toISOString(),
	atoms,
	scene: { width: W, height: H, tiles },
};
writeFileSync(outPath, JSON.stringify(dump, null, 2));
console.log(`wrote ${atoms.length} atoms + ${tiles.length} scene tiles to ${outPath}`);
