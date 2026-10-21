// From code/datums/wires/particle_accelerator.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1071, "/datum/wires/particle_accelerator/control_box", "/datum/wires/particle_accelerator", {
	holder_type: rt.typePath("/obj/machinery/particle_accelerator/control_box"),
	proper_name: "Particle Accelerator",
});

// /datum/wires/particle_accelerator/control_box/proc/New  (code/datums/wires/particle_accelerator.dm:10)
rt.def("/datum/wires/particle_accelerator/control_box/proc/New", function New(f: Frame) {
	rt.setSv(f, "wires", rt.list("Power", "Strength", "Limiter", "Interface"));
	rt.callSrc(f, "add_duds", [2]);
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["holder"] });

// /datum/wires/particle_accelerator/control_box/proc/interactable  (code/datums/wires/particle_accelerator.dm:14)
rt.def("/datum/wires/particle_accelerator/control_box/proc/interactable", function interactable(f: Frame, user: Value) {
	let C: Value = null;
	f.vars = () => [C];
	if (!isEqual(rt.gv(f, "construction_state", (C = rt.sv(f, "holder"))), 2)) return f.dot;
	return 1;
});

// /datum/wires/particle_accelerator/control_box/proc/on_pulse  (code/datums/wires/particle_accelerator.dm:19)
rt.def("/datum/wires/particle_accelerator/control_box/proc/on_pulse", function on_pulse(f: Frame, wire: Value) {
	let C: Value = null;
	let $0: any;
	f.vars = () => [C, $0];
	C = rt.sv(f, "holder");
	$0 = live(wire);
	if ($0 === "Power") {
		rt.callName(f, live(C), "toggle_power", []);
	} else if ($0 === "Strength") {
		rt.callName(f, live(C), "add_strength", []);
	} else if ($0 === "Interface") {
		rt.setFv(f, "interface_control", live(C), (!truthy(rt.fv(f, "interface_control", live(C))) ? 1 : 0));
	} else if ($0 === "Limiter") {
		rt.callName(f, live(C), "visible_message", [fmt("＀<b>＀</b> makes a large whirring noise.", [rt.call(f, P("/proc/bicon"), null, [live(C)]), live(C)])]);
	}
	return f.dot;
});

// /datum/wires/particle_accelerator/control_box/proc/on_cut  (code/datums/wires/particle_accelerator.dm:31)
rt.def("/datum/wires/particle_accelerator/control_box/proc/on_cut", function on_cut(f: Frame, wire: Value, mend: Value) {
	let C: Value = null, i: Value = null;
	let $0: any, $1: any;
	f.vars = () => [C, i, $0, $1];
	C = rt.sv(f, "holder");
	$0 = live(wire);
	if ($0 === "Power") {
		if (isEqual(rt.fv(f, "active", live(C)), (!truthy(live(mend)) ? 1 : 0))) {
			rt.callName(f, live(C), "toggle_power", []);
		}
	} else if ($0 === "Strength") {
		i = null;
		i = 1;
		while (rt.lt(live(i), 3)) {
			rt.callName(f, live(C), "remove_strength", []);
			i = rt.inc(live(i), 1);
		}
	} else if ($0 === "Interface") {
		if (!truthy(live(mend))) {
			rt.setFv(f, "interface_control", live(C), 0);
		}
	} else if ($0 === "Limiter") {
		$0 = live(C);
		if (truthy(live(mend))) {
			$1 = 2;
		} else {
			$1 = 3;
		}
		rt.setFv(f, "strength_upper_limit", $0, $1);
		if (!rt.lt(rt.fv(f, "strength_upper_limit", live(C)), rt.fv(f, "strength", live(C)))) return f.dot;
		rt.callName(f, live(C), "remove_strength", []);
	}
	return f.dot;
});
