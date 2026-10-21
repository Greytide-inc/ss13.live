// From code/modules/mob/living/simple_animal/slime/death.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/simple_animal/slime/proc/death  (code/modules/mob/living/simple_animal/slime/death.dm:2)  may sleep
rt.def("/mob/living/simple_animal/slime/proc/death", function* death(f: Frame, gibbed: Value) {
	let M: Value = null, R: Value = null, E: Value = null;
	let $e: any;
	f.vars = () => [gibbed, M, R, E, $e];
	if (isEqual(rt.sv(f, "stat"), 2)) {
		return live(f.dot);
	}
	if (!truthy(live(gibbed))) {
		if (truthy(rt.sv(f, "is_adult"))) {
			rt.setFv(f, "rabid", (M = (yield* g.new_(f, T("/mob/living/simple_animal/slime"), [rt.sv(f, "loc"), rt.sv(f, "colour")]))), 1);
			yield* g.callName(f, live(M), "regenerate_icons", []);
			rt.setSv(f, "is_adult", 0);
			rt.setSv(f, "maxHealth", 150);
			R = null;
			rt.forList(f, 0, rt.sv(f, "actions"), T("/datum/action/innate/slime/reproduce"));
			while (($e = rt.next(f, 0)) !== undefined) {
				R = $e;
				yield* g.callName(f, live(R), "Remove", [live(f.src)]);
			}
			rt.endFor(f, 0);
			yield* g.callName(f, (E = (yield* g.new_(f, T("/datum/action/innate/slime/evolve"), []))), "Grant", [live(f.src)]);
			yield* g.callSrc(f, "revive", ["full_heal", 1], rt.Args.Named);
			yield* g.srcCall(f, "regenerate_icons");
			yield* g.srcCall(f, "update_name");
			return live(f.dot);
		}
	}
	if (truthy(rt.sv(f, "buckled"))) {
		yield* g.callSrc(f, "Feedstop", ["silent", 1], rt.Args.Named);
	}
	rt.setSv(f, "stat", 2);
	yield* g.srcCall(f, "cut_overlays");
	yield* g.srcCall(f, "update_canmove");
	if ((truthy(rt.gl("SSticker")) && truthy(rt.fv(f, "mode", rt.gl("SSticker"))))) {
		yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "check_win", []);
	}
	return (yield* g.callSuper(f, [live(gibbed)]));
}, true);

// /mob/living/simple_animal/slime/proc/gib  (code/modules/mob/living/simple_animal/slime/death.dm:35)  may sleep
rt.def("/mob/living/simple_animal/slime/proc/gib", function* gib(f: Frame) {
	yield* g.srcCall(f, "death", 1);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /mob/living/simple_animal/slime/proc/Destroy  (code/modules/mob/living/simple_animal/slime/death.dm:40)  may sleep
rt.def("/mob/living/simple_animal/slime/proc/Destroy", function* Destroy(f: Frame) {
	let X: Value = null;
	let $e: any;
	f.vars = () => [X, $e];
	X = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/computer/camera_advanced/xenobio"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		if (truthy((rt.isIn(f, live(f.src), rt.fv(f, "stored_slimes", live(X))) ? 1 : 0))) {
			(rt.modField(f, live(X), "stored_slimes", live(f.src), subtract));
		}
	}
	rt.endFor(f, 0);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);
