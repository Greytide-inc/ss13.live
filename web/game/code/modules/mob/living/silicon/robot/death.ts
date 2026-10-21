// From code/modules/mob/living/silicon/robot/death.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/silicon/robot/proc/gib_animation  (code/modules/mob/living/silicon/robot/death.dm:3)  may sleep
rt.def("/mob/living/silicon/robot/proc/gib_animation", function* gib_animation(f: Frame) {
	yield* g.new_(f, T("/obj/effect/temp_visual/gib_animation"), [rt.sv(f, "loc"), "gibbed-r"]);
	return f.dot;
}, true);

// /mob/living/silicon/robot/proc/dust  (code/modules/mob/living/silicon/robot/death.dm:7)  may sleep
rt.def("/mob/living/silicon/robot/proc/dust", function* dust(f: Frame) {
	if (truthy(rt.sv(f, "mmi"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "mmi")]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /mob/living/silicon/robot/proc/spawn_dust  (code/modules/mob/living/silicon/robot/death.dm:11)  may sleep
rt.def("/mob/living/silicon/robot/proc/spawn_dust", function* spawn_dust(f: Frame) {
	yield* g.new_(f, T("/obj/effect/decal/remains/robot"), [rt.sv(f, "loc")]);
	return f.dot;
}, true);

// /mob/living/silicon/robot/proc/dust_animation  (code/modules/mob/living/silicon/robot/death.dm:14)  may sleep
rt.def("/mob/living/silicon/robot/proc/dust_animation", function* dust_animation(f: Frame) {
	yield* g.new_(f, T("/obj/effect/temp_visual/dust_animation"), [rt.sv(f, "loc"), "dust-r"]);
	return f.dot;
}, true);

// /mob/living/silicon/robot/proc/death  (code/modules/mob/living/silicon/robot/death.dm:17)  may sleep
rt.def("/mob/living/silicon/robot/proc/death", function* death(f: Frame) {
	if (isEqual(rt.sv(f, "stat"), 2)) {
		return live(f.dot);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "locked", 0);
	yield* g.srcCall(f, "update_canmove");
	if ((truthy(rt.sv(f, "camera")) && truthy(rt.fv(f, "status", rt.sv(f, "camera"))))) {
		yield* g.callName(f, rt.sv(f, "camera"), "toggle_cam", [live(f.src), 0]);
	}
	yield* g.srcCall(f, "update_headlamp", 1);
	yield* g.srcCall(f, "uneq_all");
	yield* g.srcCall(f, "update_icons");
	yield* g.srcCall(f, "unbuckle_all_mobs", 1);
	return f.dot;
}, true, { args: ["gibbed"] });
