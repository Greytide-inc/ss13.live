// From code/game/machinery/doors/poddoor.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10292, "/obj/machinery/door/poddoor", "/obj/machinery/door", {
	id: 1,
	sub_door: 1,
	explosion_block: 3,
	heat_proof: 1,
	safe: 0,
	damage_deflection: 70,
	name: "blast door",
	desc: "A heavy duty blast door that opens mechanically.",
	icon: rt.rsc("icons/obj/doors/blastdoor.dmi"),
	icon_state: "closed",
	obj_integrity: 600,
	max_integrity: 600,
	armor: null,
	resistance_flags: 2,
});

// /obj/machinery/door/poddoor/proc/<init>  (code/game/machinery/doors/poddoor.dm:13)
rt.def("/obj/machinery/door/poddoor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 50, "bullet", 100, "laser", 100, "energy", 100, "bomb", 50, "bio", 100, "rad", 100, "fire", 100, "acid", 70]));
	return f.dot;
});

rt.type(10295, "/obj/machinery/door/poddoor/shuttledock", "/obj/machinery/door/poddoor", {
	checkdir: 4,
	turftype: rt.typePath("/turf/open/space"),
});

// /obj/machinery/door/poddoor/shuttledock/proc/check  (code/game/machinery/doors/poddoor.dm:31)
rt.def("/obj/machinery/door/poddoor/shuttledock/proc/check", function check(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	if (!truthy(rt.op(f, "IsType", [], [(_T = rt.getStep(f, live(f.src), rt.sv(f, "checkdir"))), rt.sv(f, "turftype")]))) {
		rt.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/obj/machinery/door/proc/open")]);
	} else {
		rt.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/obj/machinery/door/proc/close")]);
	}
	return f.dot;
});

// /obj/machinery/door/poddoor/proc/Bumped  (code/game/machinery/doors/poddoor.dm:39)  may sleep
rt.def("/obj/machinery/door/poddoor/proc/Bumped", function* Bumped(f: Frame) {
	if (truthy(rt.sv(f, "density"))) {
		return 0;
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["AM"] });

// /obj/machinery/door/poddoor/proc/ex_act  (code/game/machinery/doors/poddoor.dm:45)
rt.def("/obj/machinery/door/poddoor/proc/ex_act", function ex_act(f: Frame) {
	if (isEqual(live(f.args[0]), 3)) {
		return live(f.dot);
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["severity", "target"], waitfor: false });

// /obj/machinery/door/poddoor/proc/do_animate  (code/game/machinery/doors/poddoor.dm:50)
rt.def("/obj/machinery/door/poddoor/proc/do_animate", function do_animate(f: Frame, animation: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(animation);
	if ($0 === "opening") {
		rt.call(f, P("/proc/flick"), null, ["opening", live(f.src)]);
	} else if ($0 === "closing") {
		rt.call(f, P("/proc/flick"), null, ["closing", live(f.src)]);
	}
	return f.dot;
});

// /obj/machinery/door/poddoor/proc/update_icon  (code/game/machinery/doors/poddoor.dm:58)
rt.def("/obj/machinery/door/poddoor/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.sv(f, "density"))) {
		rt.setSv(f, "icon_state", "closed");
	} else {
		rt.setSv(f, "icon_state", "open");
	}
	return f.dot;
});

// /obj/machinery/door/poddoor/proc/try_to_crowbar  (code/game/machinery/doors/poddoor.dm:66)  may sleep
rt.def("/obj/machinery/door/poddoor/proc/try_to_crowbar", function* try_to_crowbar(f: Frame, I: Value, user: Value) {
	f.vars = () => [I, user];
	if (!truthy(rt.bitAnd(rt.sv(f, "stat"), 2))) return f.dot;
	yield* g.srcCall(f, "open", 1);
	return f.dot;
}, true);
