// From code/game/machinery/lightswitch.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10802, "/obj/machinery/light_switch", "/obj/machinery", {
	on: 1,
	area: null,
	otherarea: null,
	anchored: 1,
	name: "light switch",
	icon: rt.rsc("icons/obj/power.dmi"),
	icon_state: "light1",
});

// /obj/machinery/light_switch/proc/Initialize  (code/game/machinery/lightswitch.dm:15)  may sleep
rt.def("/obj/machinery/light_switch/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "area", (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)])));
	if (truthy(rt.sv(f, "otherarea"))) {
		rt.setSv(f, "area", rt.locateIn(f, (yield* g.call(f, P("/proc/text2path"), null, [fmt("/area/＀", [rt.sv(f, "otherarea")])])), rt.world()));
	}
	if (!truthy(rt.sv(f, "name"))) {
		rt.setSv(f, "name", fmt("light switch (＀)", [rt.fv(f, "name", rt.sv(f, "area"))]));
	}
	rt.setSv(f, "on", rt.fv(f, "lightswitch", rt.sv(f, "area")));
	yield* g.srcCall(f, "updateicon");
	return f.dot;
}, true);

// /obj/machinery/light_switch/proc/updateicon  (code/game/machinery/lightswitch.dm:28)
rt.def("/obj/machinery/light_switch/proc/updateicon", function updateicon(f: Frame) {
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 2))) {
		rt.setSv(f, "icon_state", "light-p");
	} else {
		if (truthy(rt.sv(f, "on"))) {
			rt.setSv(f, "icon_state", "light1");
		} else {
			rt.setSv(f, "icon_state", "light0");
		}
	}
	return f.dot;
});

// /obj/machinery/light_switch/proc/examine  (code/game/machinery/lightswitch.dm:37)
rt.def("/obj/machinery/light_switch/proc/examine", function examine(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.callSuper(f, [], rt.Args.Same);
	$0 = live(f.args[0]);
	if (truthy(rt.sv(f, "on"))) {
		$1 = "on";
	} else {
		$1 = "off";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("It is ＀.", [$1])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/machinery/light_switch/proc/attack_paw  (code/game/machinery/lightswitch.dm:42)  may sleep
rt.def("/obj/machinery/light_switch/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, live(f.src), "attack_hand", [live(user)]);
	return f.dot;
}, true);

// /obj/machinery/light_switch/proc/attack_hand  (code/game/machinery/lightswitch.dm:46)  may sleep
rt.def("/obj/machinery/light_switch/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let A: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [user, A, L, $e];
	rt.setSv(f, "on", (!truthy(rt.sv(f, "on")) ? 1 : 0));
	A = null;
	rt.forList(f, 0, rt.fv(f, "related", rt.sv(f, "area")), T("/area"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		rt.setFv(f, "lightswitch", live(A), rt.sv(f, "on"));
		yield* g.callName(f, live(A), "updateicon", []);
		L = null;
		rt.forList(f, 1, live(A), T("/obj/machinery/light_switch"));
		while (($e = rt.next(f, 1)) !== undefined) {
			L = $e;
			rt.setFv(f, "on", live(L), rt.sv(f, "on"));
			yield* g.callName(f, live(L), "updateicon", []);
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, rt.sv(f, "area"), "power_change", []);
	return f.dot;
}, true);

// /obj/machinery/light_switch/proc/power_change  (code/game/machinery/lightswitch.dm:60)
rt.def("/obj/machinery/light_switch/proc/power_change", function power_change(f: Frame) {
	if (truthy(rt.sv(f, "otherarea"))) return f.dot;
	if (truthy(rt.callSrc(f, "powered", [2]))) {
		(rt.modSrcVar(f, "stat", 16777213, rt.bitAnd));
	} else {
		(rt.modSrcVar(f, "stat", 2, rt.bitOr));
	}
	rt.callSrc(f, "updateicon", []);
	return f.dot;
});

// /obj/machinery/light_switch/proc/emp_act  (code/game/machinery/lightswitch.dm:69)  may sleep
rt.def("/obj/machinery/light_switch/proc/emp_act", function* emp_act(f: Frame) {
	if (!truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		yield* g.srcCall(f, "power_change");
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["severity"] });
