// From code/datums/status_effects/gas.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(939, "/datum/status_effect/freon", "/datum/status_effect", {
	cube: null,
	id: "frozen",
	duration: 100,
	status_type: 1,
	alert_type: rt.typePath("/obj/screen/alert/status_effect/freon"),
});

// /datum/status_effect/freon/proc/on_apply  (code/datums/status_effects/gas.dm:14)  may sleep
rt.def("/datum/status_effect/freon/proc/on_apply", function* on_apply(f: Frame) {
	if (!truthy(rt.fv(f, "stat", rt.sv(f, "owner")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='userdanger'>You become frozen in a cube!</span>"]);
	}
	rt.setSv(f, "cube", (yield* g.call(f, P("/proc/icon"), null, [rt.rsc("icons/effects/freeze.dmi"), "ice_cube"])));
	yield* g.callName(f, rt.sv(f, "owner"), "add_overlay", [rt.sv(f, "cube")]);
	yield* g.callName(f, rt.sv(f, "owner"), "update_canmove", []);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/status_effect/freon/proc/tick  (code/datums/status_effects/gas.dm:22)  may sleep
rt.def("/datum/status_effect/freon/proc/tick", function* tick(f: Frame) {
	yield* g.callName(f, rt.sv(f, "owner"), "update_canmove", []);
	if (!(truthy(rt.sv(f, "owner")) && rt.ge(rt.fv(f, "bodytemperature", rt.sv(f, "owner")), 310.05499267578125))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /datum/status_effect/freon/proc/on_remove  (code/datums/status_effects/gas.dm:27)  may sleep
rt.def("/datum/status_effect/freon/proc/on_remove", function* on_remove(f: Frame) {
	if (!truthy(rt.fv(f, "stat", rt.sv(f, "owner")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "The cube melts!"]);
	}
	yield* g.callName(f, rt.sv(f, "owner"), "cut_overlay", [rt.sv(f, "cube")]);
	rt.modField(f, rt.sv(f, "owner"), "bodytemperature", 100, add);
	yield* g.callName(f, rt.sv(f, "owner"), "update_canmove", []);
	return f.dot;
}, true);
