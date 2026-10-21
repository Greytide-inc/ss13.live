// view-marks.test.ts - vm.viewMarks: each kind of change marks exactly the
// turfs whose picture it changes, and nothing is marked with marks off, for an area look var, or for a move
// inside a container. Real tg types, a 4x1x1 world, no boot (like tests/appearance/appearance.test.ts).

import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { VM } from "../../src/vm/interpreter.js";
import { loadGame } from "../../src/tools/game-tree.js";
import { DMList, DMObject } from "../../src/vm/objects.js";
import { DMAtom, registerViewMarks, unregisterViewMarks } from "../../src/vm/world.js";
import type { Value } from "../../src/vm/value.js";

let webDir = dirname(fileURLToPath(import.meta.url));
for (let i = 0; i < 4; i++) webDir = dirname(webDir);
let failures = 0;

if (!existsSync(resolve(webDir, "build/game-types.js"))) {
	console.log("skip view-marks (build/game-types.js missing: run a boot-check or build:static first)");
} else {
	const { tree, install } = await loadGame();
	const vm = new VM(tree);
	install(vm);
	vm.onRuntimeError = (e) => console.log(`runtime error: ${e.message} in ${e.proc}`);
	vm.runGlobalInit();
	vm.map.resize(4, 1, 1);
	const type = (p: string) => {
		const t = tree.getType(p);
		if (!t) throw new Error(`missing type ${p}`);
		return t;
	};
	const T = [1, 2, 3, 4].map((x) => vm.map.turfAt(x, 1, 1)!);
	const objType = type("/obj"), imgType = type("/image");
	const areaA = vm.map.areaFor(type("/area")), areaB = vm.map.areaFor(type("/area/space"));
	for (const t of T) vm.map.setArea(t, areaA);

	const names = (s: Set<DMAtom>) => [...s].map((t) => t.x).sort().join(",");
	let cur = new Set<DMAtom>();
	/** Runs f with marks on; the marked turfs' x coordinates must be `want` (comma list, "" = none). */
	function marked(label: string, want: string, f: () => void): void {
		const s = new Set<DMAtom>();
		cur = s;
		registerViewMarks(s);
		try { f(); } finally { unregisterViewMarks(s); }
		const got = names(s);
		if (got === want) console.log(`ok   ${label}: ${got || "nothing"}`);
		else { failures++; console.log(`FAIL ${label}: marked [${got}] want [${want}]`); }
	}
	const mk = (t: DMAtom) => vm.newObject(objType, [t]) as DMAtom;

	const o1 = mk(T[0]);
	const box = mk(T[1]);
	const inner = vm.newObject(objType, [box]) as DMAtom; // inside a container
	const img = () => vm.newObject(imgType, []) as DMObject;

	marked("marks off marks nothing", "", () => { unregisterViewMarks(cur); o1.setVar("icon_state", "x"); });
	{ // two ViewDiffers: each has its own set, clearing one leaves the other's marks
		const a = new Set<DMAtom>(), b = new Set<DMAtom>();
		registerViewMarks(a); registerViewMarks(b);
		o1.setVar("icon_state", "two"); a.clear(); T[2].setVar("icon_state", "two");
		const ok = names(a) === "3" && names(b) === "1,3";
		unregisterViewMarks(a); T[3].setVar("icon_state", "two");
		const ok2 = names(a) === "3" && names(b) === "1,3,4"; // a is unregistered: no more marks
		unregisterViewMarks(b);
		o1.setVar("icon_state", "three");
		const ok3 = names(b) === "1,3,4";
		if (ok && ok2 && ok3) console.log("ok   two sets: independent clear, unregister stops marks");
		else { failures++; console.log(`FAIL two sets: a=[${names(a)}] b=[${names(b)}] ${ok} ${ok2} ${ok3}`); }
	}
	marked("look var on an object", "1", () => o1.setVar("icon_state", "a"));
	marked("look var on a turf", "3", () => T[2].setVar("icon_state", "a"));
	marked("non-look var (desc)", "", () => o1.setVar("desc", "hi"));
	marked("look var on an object in a container", "", () => inner.setVar("icon_state", "a"));
	marked("look var on an area", "", () => areaA.setVar("icon_state", "a"));
	marked("move in (from turf 1)", "1,3", () => vm.map.setLoc(o1, T[2]));
	marked("move between turfs", "1,3", () => { vm.map.setLoc(o1, T[0]); vm.map.setLoc(o1, T[2]); cur.delete(T[0]); vm.map.setLoc(o1, T[0]); });
	marked("move out (loc = null)", "1", () => vm.map.setLoc(o1, null));
	marked("move into a container from a turf", "1", () => { vm.map.setLoc(o1, T[0]); cur.clear(); vm.map.setLoc(o1, box); });
	marked("move inside a container", "", () => { vm.map.setLoc(inner, o1); vm.map.setLoc(inner, box); });
	marked("move out of a container onto a turf", "4", () => vm.map.setLoc(inner, T[3]));
	vm.map.setLoc(inner, box);
	marked("new object on a turf", "4", () => { mk(T[3]); });
	marked("deleted object on a turf", "2", () => vm.markDeleted(box));
	// overlays: through the VM's own write path (`overlays += x`, `-=`, Cut, assignment)
	const o2 = mk(T[1]);
	const ov = (): DMList => vm.getField(o2, "overlays") as DMList;
	marked("overlays += (first read builds the list)", "2", () => { ov().add(img()); });
	const i1 = img();
	marked("overlays += second", "2", () => { ov().add(i1); });
	marked("overlays -=", "2", () => { ov().remove(i1); });
	marked("overlays Cut", "2", () => { ov().cut(0, ov().len); });
	marked("overlays .len =", "2", () => { ov().add(img()); cur.clear(); ov().setLen(0); });
	marked("overlays Insert", "2", () => { ov().insert(0, [img()]); });
	marked("overlays Swap-like setItem", "2", () => { ov().setItem(0, img()); });
	marked("overlays = value", "2", () => vm.setField(o2, "overlays", img()));
	marked("underlays +=", "2", () => { (vm.getField(o2, "underlays") as DMList).add(img()); });
	const in2 = vm.newObject(objType, [o2]) as DMAtom;
	marked("overlays += on an object in a container", "", () => { (vm.getField(in2, "overlays") as DMList).add(img()); });
	const tov = (vm.getField(T[3], "overlays") as DMList);
	marked("turf overlays +=", "4", () => tov.add(img()));
	const image = img();
	marked("overlays += on an /image", "", () => { (vm.getField(image, "overlays") as DMList).add(img()); });
	marked("overlays on an area", "", () => { (vm.getField(areaA, "overlays") as DMList).add(img()); });
	// turf / area changes
	marked("turf retyped in place", "1", () => { vm.map.prepareTurf(type("/turf/closed/wall"), 1, 1, 1); });
	marked("turf area change", "3", () => vm.map.setArea(T[2], areaB));
	marked("area.contents = L (drops turfs, takes one)", "1,3", () => {
		vm.setField(areaB, "contents", new DMList([T[0] as Value]));
	});
	marked("turf deleted", "2", () => vm.markDeleted(vm.map.turfAt(2, 1, 1)!));
	marked("world resize drops turfs (and fills the deleted cell 2)", "2,3,4", () => { vm.map.resize(2, 1, 1); });
	marked("world grows: new turfs", "3,4", () => { vm.map.resize(4, 1, 1); });
	if (failures) { console.log(`${failures} view-marks failure(s)`); process.exitCode = 1; }
}
