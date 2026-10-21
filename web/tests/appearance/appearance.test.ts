// appearance.test.ts - Node tests for the appearance builder (src/appearance/appearance.ts)
// against real tg types from the game (build/game-types.js + translated-tg.js, src/tools/game-tree.ts; no
// tgstation.json any more), created in the VM: the game tree + `new VM(tree)` + install, then
// vm.newObject() on real types (no full boot -- no Master, no map load, no tick loop).
//
// Usage: part of npm test (needs node tools/translate-tg.mjs run first).
//
// Covers:
//  - a wall (/turf/closed/wall): basic icon/icon_state/dir/layer/plane read straight off a real type.
//  - an airlock (/obj/machinery/door/airlock) placed on a turf, whose own New() sets `layer`: checks
//    the builder reflects a value computed by real DM code, not just a static default. Also carries
//    hand-built overlays/underlays (as real code would add via image()/mutable_appearance()) to
//    exercise: default (floating) layer/plane, an overlay with its own explicit dir/layer, nested
//    overlay-on-overlay, and the icon/icon_state/dir inheritance rule.
//  - a human mob (/mob/living/carbon/human) with its own overlays list, showing a second real atom
//    type works the same way (no mob-specific special-casing needed).
//  - color (a hex string and a color-matrix list) and alpha on a plain object, plus a /matrix
//    `transform`, checked as pass-through (not inherited by overlays).

import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { VM } from "../../src/vm/interpreter.js";
import { loadGame } from "../../src/tools/game-tree.js";
import { DMList, DMObject } from "../../src/vm/objects.js";
import { EAST, SOUTH } from "../../src/vm/world.js";
import { Vfs } from "../../src/vfs/vfs.js";
import type { VfsBundle } from "../../src/vfs/bundle-format.js";
import { buildAppearance, FLOAT_LAYER } from "../../src/appearance/appearance.js";

// build/dist/tests/appearance/appearance.test.js -> up 4 to web/
let webDir = dirname(fileURLToPath(import.meta.url));
for (let i = 0; i < 4; i++) webDir = dirname(webDir);
const repoRoot = dirname(webDir);
const gamePath = resolve(repoRoot, "web/build/game-types.js");
const bundlePath = resolve(repoRoot, "web/build/vfs-bundle.json");

let failures = 0;
function check(name: string, got: unknown, want: unknown): void {
	const g = JSON.stringify(got);
	const w = JSON.stringify(want);
	if (g === w) {
		console.log(`ok   ${name}`);
	} else {
		failures++;
		console.log(`FAIL ${name}: got ${g} want ${w}`);
	}
}

// BYOND numbers are float32 (Math.fround'd throughout the VM), so a literal like 2.05 comes back
// as its nearest float32 (2.049999952316284): compare with a float32-scale tolerance, not exact.
function close(name: string, got: number, want: number, eps = 1e-4): void {
	if (Math.abs(got - want) < eps) console.log(`ok   ${name}`);
	else {
		failures++;
		console.log(`FAIL ${name}: got ${got} want ${want}`);
	}
}

if (!existsSync(gamePath)) {
	console.log(`FAIL ${gamePath} missing: run node tools/translate-tg.mjs`);
	process.exitCode = 1;
} else {
	const { tree, install } = await loadGame();
	const vm = new VM(tree);
	install(vm);
	if (existsSync(bundlePath)) {
		vm.vfs = new Vfs(JSON.parse(readFileSync(bundlePath, "utf8")) as VfsBundle);
	}
	const rtErrors: string[] = [];
	vm.onRuntimeError = (e) => rtErrors.push(`${e.message} in ${e.proc}`);
	vm.runGlobalInit();
	// A single 1x1x1 world: enough to give turfs a loc to build atoms on, no map load, no boot.
	vm.map.resize(1, 1, 1);
	const turf0 = vm.map.turfAt(1, 1, 1)!;

	const type = (p: string) => {
		const t = tree.getType(p);
		if (!t) throw new Error(`missing type ${p}`);
		return t;
	};
	const imageType = type("/image");
	const matrixType = type("/matrix");

	/** A plain overlay/underlay image, built the same way DM's image() proc would (natives-misc.ts). */
	function image(opts: { icon?: string; iconState?: string; dir?: number; layer?: number; plane?: number; color?: string; alpha?: number; pixelX?: number; pixelY?: number }): DMObject {
		const img = vm.newObject(imageType, []) as DMObject;
		if (opts.icon !== undefined) img.setVar("icon", opts.icon);
		if (opts.iconState !== undefined) img.setVar("icon_state", opts.iconState);
		if (opts.dir !== undefined) img.setVar("dir", opts.dir);
		if (opts.layer !== undefined) img.setVar("layer", opts.layer);
		if (opts.plane !== undefined) img.setVar("plane", opts.plane);
		if (opts.color !== undefined) img.setVar("color", opts.color);
		if (opts.alpha !== undefined) img.setVar("alpha", opts.alpha);
		if (opts.pixelX !== undefined) img.setVar("pixel_x", opts.pixelX);
		if (opts.pixelY !== undefined) img.setVar("pixel_y", opts.pixelY);
		return img;
	}

	function setList(obj: DMObject, varName: string, items: DMObject[] | number[]): void {
		obj.setVar(varName, new DMList(items as never[]));
	}

	// ---- wall: a plain /turf/closed/wall, straight from real tg source values ----
	{
		const wallType = type("/turf/closed/wall");
		const wall = vm.newObject(wallType, [turf0]) as DMObject; // re-types turf0 in place
		const a = buildAppearance(wall);
		check("wall icon", a.icon, "icons/turf/walls/wall.dmi");
		check("wall icon_state", a.iconState, "wall");
		check("wall dir (default SOUTH)", a.dir, SOUTH);
		close("wall layer (CLOSED_TURF_LAYER)", a.layer, 2.05);
		check("wall plane (default)", a.plane, 0);
		check("wall alpha (default)", a.alpha, 255);
		check("wall color (default)", a.color, null);
		check("wall transform (default)", a.transform, null);
		check("wall has no overlays by default", a.overlays, []);
		check("wall maptext (unset, default null)", a.maptext, null);
		check("wall maptext_width (default 32)", a.maptextWidth, 32);
		check("wall maptext_height (default 32)", a.maptextHeight, 32);
		check("wall maptext_x (default 0)", a.maptextX, 0);
		check("wall maptext_y (default 0)", a.maptextY, 0);
	}

	// ---- airlock: real New() sets layer; hand-built overlays/underlays exercise flattening ----
	{
		const airlockType = type("/obj/machinery/door/airlock");
		const airlock = vm.newObject(airlockType, [turf0]) as DMObject;
		const rawIcon = airlock.getVar("icon") as { path: string };
		check("airlock icon path", rawIcon.path, "icons/obj/doors/airlocks/station/public.dmi");
		check("airlock icon_state", airlock.getVar("icon_state"), "closed");
		close("airlock layer set by its own New() (CLOSED_DOOR_LAYER, density=1)", airlock.getVar("layer") as number, 3.1);

		// A default-everything overlay (as `overlays += image('bolts.dmi', "bolts-animation")` would
		// give): floating layer/plane, no dir/icon_state of its own -> inherits the airlock's.
		const boltLight = image({ iconState: "bolts-fast" });
		// An overlay with its own explicit dir and an absolute (non-floating) layer: keeps both.
		const fixedDirOverlay = image({ iconState: "sparks", dir: EAST, layer: 5, alpha: 128 });
		// A nested overlay-on-overlay: boltLight itself carries one more layer above it.
		const nestedGlow = image({ iconState: "glow" }); // no icon/dir of its own: inherits from boltLight
		setList(boltLight, "overlays", [nestedGlow]);
		// An underlay with an explicit plane (not floating): should NOT inherit the airlock's plane.
		const fixedPlaneUnderlay = image({ iconState: "shadow", plane: 7 });

		setList(airlock, "overlays", [boltLight, fixedDirOverlay]);
		setList(airlock, "underlays", [fixedPlaneUnderlay]);

		const a = buildAppearance(airlock);
		check("airlock overlays count (2 overlays + their nesting + 1 underlay = 4 flattened layers)", a.overlays.length, 4);

		const byState = (s: string) => a.overlays.find((l) => l.iconState === s)!;

		const bolt = byState("bolts-fast");
		check("boltLight inherits airlock's icon (unset on the overlay)", bolt.icon, "icons/obj/doors/airlocks/station/public.dmi");
		check("boltLight inherits airlock's dir (default SOUTH on the overlay)", bolt.dir, a.dir);
		check("boltLight plane floats to the airlock's plane (FLOAT_PLANE default)", bolt.plane, a.plane);
		close("boltLight floating layer: airlock.layer + (1000+FLOAT_LAYER)/1000", bolt.layer, a.layer + (1000 + FLOAT_LAYER) / 1000);

		const sparks = byState("sparks");
		check("fixedDirOverlay keeps its own explicit dir", sparks.dir, EAST);
		check("fixedDirOverlay keeps its own absolute layer", sparks.layer, 5);
		check("fixedDirOverlay keeps its own alpha (not inherited)", sparks.alpha, 128);
		check("explicit-layer overlay is flagged (3h: renderer sorts it globally)", sparks.explicitLayer, true);
		check("floating overlay is not flagged", bolt.explicitLayer, undefined);
		check("fixedDirOverlay icon still inherits (icon unset on it)", sparks.icon, "icons/obj/doors/airlocks/station/public.dmi");

		const glow = byState("glow");
		check("nested overlay inherits from its immediate parent (boltLight), not the airlock", glow.icon, bolt.icon);
		check("nested overlay inherits boltLight's resolved dir", glow.dir, bolt.dir);
		close("nested overlay draws in boltLight's slot (ov1: same layer, just after it)", glow.layer, bolt.layer);

		const shadow = byState("shadow");
		check("fixedPlaneUnderlay keeps its own explicit plane (not floated)", shadow.plane, 7);
		close("fixedPlaneUnderlay floating layer (underlay side of the formula)", shadow.layer, a.layer + FLOAT_LAYER / 1000);

		// Draw order: ascending (plane, layer). shadow (plane 7) sorts after everything on plane 0/default.
		check("overlays sorted by (plane, layer) ascending", a.overlays.map((l) => l.iconState), (() => {
			const withoutShadow = [bolt, sparks, glow].sort((x, y) => x.plane - y.plane || x.layer - y.layer).map((l) => l.iconState);
			// shadow's plane (7) is higher than the others' (airlock's own plane, default 0), so last.
			return [...withoutShadow, "shadow"];
		})());
	}

	// ---- nested overlays (ov1): BYOND 511 results from tests/render-rules/nested.dm (x = tile) ----
	{
		const objType = type("/obj");
		const mk = (over: DMObject[]) => {
			const o = vm.newObject(objType, [turf0]) as DMObject;
			o.setVar("layer", 3);
			setList(o, "overlays", over);
			return buildAppearance(o).overlays;
		};
		const nest = (parent: DMObject, kids: DMObject[]) => (setList(parent, "overlays", kids), parent);
		const states = (ovs: { iconState: string }[]) => ovs.map((l) => l.iconState).join(",");
		// a child's pixel offset adds to its parent's.
		let ov = mk([nest(image({ iconState: "o", pixelY: 16 }), [image({ iconState: "y", pixelX: 16 })])]);
		check("x2 nested child is placed relative to its parent", [ov[1].pixelX, ov[1].pixelY], [16, 16]);
		// a later sibling draws over the whole group, whatever the child's float layer.
		for (const kl of [FLOAT_LAYER - 25, FLOAT_LAYER])
			check(`x4/x6 sibling over nested child (child layer ${kl})`, states(mk([nest(image({ iconState: "o" }), [image({ iconState: "y", layer: kl })]), image({ iconState: "q" })])), "o,y,q");
		// a child at FLOAT_LAYER-25 still draws over its parent.
		check("x8 nested child over its parent", states(mk([nest(image({ iconState: "o" }), [image({ iconState: "y", layer: FLOAT_LAYER - 25 })])])), "o,y");
		// a sibling at FLOAT_LAYER-25 goes under the whole group.
		check("x10 low sibling under the group", states(mk([nest(image({ iconState: "o" }), [image({ iconState: "y" })]), image({ iconState: "q", layer: FLOAT_LAYER - 25 })])), "q,o,y");
		// cryo shape: a raised image with a mob's overlays copied onto it, then the cover.
		ov = mk([nest(image({ iconState: "mob", pixelY: 22 }), [image({ iconState: "body", layer: -26 }), image({ iconState: "uniform", layer: -20 })]), image({ iconState: "cover-off" })]);
		check("cryo: body parts raised with the image, cover drawn last", ov.map((l) => `${l.iconState}@${l.pixelY}`).join(","), "mob@22,body@22,uniform@22,cover-off@0");
		// nested underlay goes just under its parent; parent's alpha carries down.
		const u = image({ iconState: "o", alpha: 128 });
		setList(u, "underlays", [image({ iconState: "under" })]);
		ov = mk([u]);
		check("nested underlay just before its parent, with the parent's alpha", ov.map((l) => `${l.iconState}:${l.alpha}`).join(","), "under:128,o:128");
	}

	// ---- overlay dir vs owner dir (ov1): BYOND 511 row 7 of tests/render-rules/nested.dm ----
	{
		const objType = type("/obj");
		const drawnDir = (ownerDir: number, img: DMObject) => {
			const o = vm.newObject(objType, [turf0]) as DMObject;
			o.setVar("dir", ownerDir);
			o.setVar("overlays", vm.appearances.newOverlayList(o, img)); // snapshots, as `overlays += img` makes
			return buildAppearance(o).overlays[0].dir;
		};
		const NORTH = 1, SOUTH_ = SOUTH;
		const icon = "icons/obj/atmospherics/pipes/manifold.dmi";
		check("x2 image(dir = SOUTH) on a NORTH owner stays SOUTH", drawnDir(NORTH, vm.newObject(imageType, [icon, null, "manifold_full", null, SOUTH_]) as DMObject), SOUTH_);
		check("x6 image(dir = EAST) on a NORTH owner stays EAST", drawnDir(NORTH, vm.newObject(imageType, [icon, null, "manifold_full", null, EAST]) as DMObject), EAST);
		check("x12 image(icon, null, state, FLOAT_LAYER, SOUTH) on EAST stays SOUTH", drawnDir(EAST, vm.newObject(imageType, [icon, null, "manifold_full", FLOAT_LAYER, SOUTH_]) as DMObject), SOUTH_);
		check("x7-ish image with no dir argument follows its EAST owner", drawnDir(EAST, vm.newObject(imageType, [icon, "manifold_full"]) as DMObject), EAST);
		const copied = vm.newObject(imageType, []) as DMObject;
		vm.appearances.write(copied, vm.appearances.read(vm.newObject(imageType, [icon, null, "manifold_full", null, SOUTH_]) as DMObject));
		check("x3 its look copied into a new image (appearance =) still stays SOUTH", drawnDir(EAST, copied), SOUTH_);
		const lay = vm.newObject(imageType, [icon, null, "manifold_full", null, SOUTH_]) as DMObject;
		check("image(dir = D) leaves layer FLOAT_LAYER", lay.getVar("layer"), FLOAT_LAYER);
	}

	// ---- human mob: a second real atom type, with its own overlays ----
	{
		const humanType = type("/mob/living/carbon/human");
		const human = vm.newObject(humanType, [turf0]) as DMObject;
		const hair = image({ icon: "icons/mob/human_face.dmi", iconState: "hair_ponytail", color: "#8b4513" });
		setList(human, "overlays", [hair]);
		const a = buildAppearance(human);
		check("human has an icon (real tg default)", typeof a.icon, "string");
		check("human overlay resolved", a.overlays.length, 1);
		check("human overlay icon (explicit, not inherited)", a.overlays[0].icon, "icons/mob/human_face.dmi");
		check("human overlay icon_state", a.overlays[0].iconState, "hair_ponytail");
		check("human overlay color (own, not inherited)", a.overlays[0].color, "#8b4513");
		check("human overlay dir inherits human's dir", a.overlays[0].dir, a.dir);
	}

	// ---- color/alpha/transform pass-through on a plain object ----
	{
		const obj = vm.newObject(type("/obj"), [turf0]) as DMObject;
		obj.setVar("color", "#ff0000");
		obj.setVar("alpha", 128);
		const a1 = buildAppearance(obj);
		check("plain color string passes through", a1.color, "#ff0000");
		check("plain alpha passes through", a1.alpha, 128);

		const matrixColor = new DMList([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0]);
		obj.setVar("color", matrixColor);
		const a2 = buildAppearance(obj);
		check("color matrix list flattens to a plain number array", a2.color, matrixColor.items);

		const m = vm.newObject(matrixType, [2, 0, 4, 0, 3, 5]) as DMObject;
		obj.setVar("transform", m);
		const a3 = buildAppearance(obj);
		check("transform matrix flattens to [a,b,c,d,e,f]", a3.transform, [2, 0, 4, 0, 3, 5]);

		obj.setVar("transform", null);
		const a4 = buildAppearance(obj);
		check("no transform -> null (identity)", a4.transform, null);
	}

	// ---- maptext: own value only (not inherited by overlays), custom box vars pass through ----
	{
		const obj = vm.newObject(type("/obj"), [turf0]) as DMObject;
		obj.setVar("maptext", "<font color='red'>Hi</font>");
		obj.setVar("maptext_width", 64);
		obj.setVar("maptext_height", 16);
		obj.setVar("maptext_x", 2);
		obj.setVar("maptext_y", -3);
		const withOverlay = image({ iconState: "tag" });
		setList(obj, "overlays", [withOverlay]);
		const a = buildAppearance(obj);
		check("maptext string passes through", a.maptext, "<font color='red'>Hi</font>");
		check("maptext_width passes through (non-default)", a.maptextWidth, 64);
		check("maptext_height passes through (non-default)", a.maptextHeight, 16);
		check("maptext_x passes through", a.maptextX, 2);
		check("maptext_y passes through", a.maptextY, -3);
		check("overlay does NOT inherit the owner's maptext", a.overlays[0].maptext, null);
		check("overlay with no maptext_width/height/x/y set gets plain defaults (32,32,0,0)", [
			a.overlays[0].maptextWidth, a.overlays[0].maptextHeight, a.overlays[0].maptextX, a.overlays[0].maptextY,
		], [32, 32, 0, 0]);

		obj.setVar("maptext", "");
		const a2 = buildAppearance(obj);
		check("empty-string maptext reads back as null (unset), same as BYOND treating it as no text", a2.maptext, null);
	}

	if (rtErrors.length) {
		failures++;
		console.log(`FAIL ${rtErrors.length} VM runtime error(s) while building test fixtures:`);
		for (const e of rtErrors.slice(0, 10)) console.log(`     ${e}`);
	}

	console.log(failures === 0 ? "\nALL APPEARANCE TESTS PASSED" : `\n${failures} appearance test failure(s)`);
	if (failures) process.exitCode = 1;
}
