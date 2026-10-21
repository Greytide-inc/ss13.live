// From code/game/gamemodes/miniantags/abduction/machinery/pad.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10441, "/obj/machinery/abductor/pad", "/obj/machinery/abductor", {
	teleport_target: null,
	anchored: 1,
	name: "Alien Telepad",
	desc: "Use this to transport to and from the humans' habitat.",
	icon: rt.rsc("icons/obj/abductor.dmi"),
	icon_state: "alien-pad-idle",
});

// /obj/machinery/abductor/pad/proc/Warp  (code/game/gamemodes/miniantags/abduction/machinery/pad.dm:10)  may sleep
rt.def("/obj/machinery/abductor/pad/proc/Warp", function* Warp(f: Frame, target: Value) {
	f.vars = () => [target];
	if (truthy(rt.fv(f, "buckled", live(target)))) return f.dot;
	yield* g.callName(f, live(target), "forceMove", [rt.getStep(f, live(f.src), 0)]);
	return f.dot;
}, true);

// /obj/machinery/abductor/pad/proc/Send  (code/game/gamemodes/miniantags/abduction/machinery/pad.dm:14)  may sleep
rt.def("/obj/machinery/abductor/pad/proc/Send", function* Send(f: Frame) {
	let target: Value = null;
	let $e: any;
	f.vars = () => [target, $e];
	if (rt.sv(f, "teleport_target") === null) {
		rt.setSv(f, "teleport_target", rt.index(rt.gl("teleportlocs"), rt.op(f, "PickUnweighted", [1], [rt.gl("teleportlocs")])));
	}
	yield* g.call(f, P("/proc/flick"), null, ["alien-pad", live(f.src)]);
	target = null;
	rt.forList(f, 0, rt.sv(f, "loc"), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		target = $e;
		yield* g.callName(f, live(target), "forceMove", [rt.sv(f, "teleport_target")]);
		yield* g.new_(f, T("/obj/effect/temp_visual/dir_setting/ninja"), [rt.getStep(f, live(target), 0), rt.fv(f, "dir", live(target))]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(target), "<span class='warning'>The instability of the warp leaves you disoriented!</span>"]);
		yield* g.callName(f, live(target), "Stun", [60]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/machinery/abductor/pad/proc/Retrieve  (code/game/gamemodes/miniantags/abduction/machinery/pad.dm:24)  may sleep
rt.def("/obj/machinery/abductor/pad/proc/Retrieve", function* Retrieve(f: Frame, target: Value) {
	f.vars = () => [target];
	yield* g.call(f, P("/proc/flick"), null, ["alien-pad", live(f.src)]);
	yield* g.new_(f, T("/obj/effect/temp_visual/dir_setting/ninja"), [rt.getStep(f, live(target), 0), rt.fv(f, "dir", live(target))]);
	yield* g.srcCall(f, "Warp", live(target));
	return f.dot;
}, true);

// /obj/machinery/abductor/pad/proc/MobToLoc  (code/game/gamemodes/miniantags/abduction/machinery/pad.dm:29)  may sleep
rt.def("/obj/machinery/abductor/pad/proc/MobToLoc", function* MobToLoc(f: Frame, place: Value, target: Value) {
	f.vars = () => [place, target];
	yield* g.new_(f, T("/obj/effect/temp_visual/teleport_abductor"), [live(place)]);
	yield* g.call(f, P("/proc/sleep"), null, [80]);
	yield* g.call(f, P("/proc/flick"), null, ["alien-pad", live(f.src)]);
	yield* g.callName(f, live(target), "forceMove", [live(place)]);
	yield* g.new_(f, T("/obj/effect/temp_visual/dir_setting/ninja"), [rt.getStep(f, live(target), 0), rt.fv(f, "dir", live(target))]);
	return f.dot;
}, true);

// /obj/machinery/abductor/pad/proc/PadToLoc  (code/game/gamemodes/miniantags/abduction/machinery/pad.dm:36)  may sleep
rt.def("/obj/machinery/abductor/pad/proc/PadToLoc", function* PadToLoc(f: Frame, place: Value) {
	let target: Value = null;
	let $e: any;
	f.vars = () => [place, target, $e];
	yield* g.new_(f, T("/obj/effect/temp_visual/teleport_abductor"), [live(place)]);
	yield* g.call(f, P("/proc/sleep"), null, [80]);
	yield* g.call(f, P("/proc/flick"), null, ["alien-pad", live(f.src)]);
	target = null;
	rt.forList(f, 0, rt.getStep(f, live(f.src), 0), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		target = $e;
		yield* g.callName(f, live(target), "forceMove", [live(place)]);
		yield* g.new_(f, T("/obj/effect/temp_visual/dir_setting/ninja"), [rt.getStep(f, live(target), 0), rt.fv(f, "dir", live(target))]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(11528, "/obj/effect/temp_visual/teleport_abductor", "/obj/effect/temp_visual", {
	name: "Huh",
	icon: rt.rsc("icons/obj/abductor.dmi"),
	icon_state: "teleport",
	duration: 80,
});

// /obj/effect/temp_visual/teleport_abductor/proc/Initialize  (code/game/gamemodes/miniantags/abduction/machinery/pad.dm:51)  may sleep
rt.def("/obj/effect/temp_visual/teleport_abductor/proc/Initialize", function* Initialize(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.callName(f, (S = (yield* g.new_(f, T("/datum/effect_system/spark_spread"), []))), "set_up", [10, 0, rt.sv(f, "loc")]);
	yield* g.callName(f, live(S), "start", []);
	return f.dot;
}, true);
