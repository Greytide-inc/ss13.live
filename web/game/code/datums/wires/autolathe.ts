// From code/datums/wires/autolathe.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1063, "/datum/wires/autolathe", "/datum/wires", {
	holder_type: rt.typePath("/obj/machinery/autolathe"),
	proper_name: "Autolathe",
});

// /datum/wires/autolathe/proc/New  (code/datums/wires/autolathe.dm:10)
rt.def("/datum/wires/autolathe/proc/New", function New(f: Frame) {
	rt.setSv(f, "wires", rt.list("Hack", "Disable", "High Voltage Ground", "High Voltage Circuit"));
	rt.callSrc(f, "add_duds", [6]);
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["holder"] });

// /datum/wires/autolathe/proc/interactable  (code/datums/wires/autolathe.dm:14)
rt.def("/datum/wires/autolathe/proc/interactable", function interactable(f: Frame, user: Value) {
	let A: Value = null;
	f.vars = () => [A];
	if (!truthy(rt.gv(f, "panel_open", (A = rt.sv(f, "holder"))))) return f.dot;
	return 1;
});

// /datum/wires/autolathe/proc/get_status  (code/datums/wires/autolathe.dm:19)
rt.def("/datum/wires/autolathe/proc/get_status", function get_status(f: Frame) {
	let A: Value = null, status: Value = null;
	let $0: any;
	f.vars = () => [A, status, $0];
	A = rt.sv(f, "holder");
	status = rt.list();
	if (truthy(rt.fv(f, "disabled", live(A)))) {
		$0 = "on";
	} else {
		$0 = "off";
	}
	status = rt.modify(live(status), fmt("The red light is ＀.", [$0]), add);
	if (truthy(rt.fv(f, "hacked", live(A)))) {
		$0 = "on";
	} else {
		$0 = "off";
	}
	return (status = rt.modify(live(status), fmt("The blue light is ＀.", [$0]), add));
});

// /datum/wires/autolathe/proc/on_pulse  (code/datums/wires/autolathe.dm:26)  may sleep
rt.def("/datum/wires/autolathe/proc/on_pulse", function* on_pulse(f: Frame, wire: Value) {
	let A: Value = null;
	let $0: any;
	f.vars = () => [wire, A, $0];
	A = rt.sv(f, "holder");
	$0 = live(wire);
	if ($0 === "Hack") {
		yield* g.callName(f, live(A), "adjust_hacked", [(!truthy(rt.fv(f, "hacked", live(A))) ? 1 : 0)]);
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(A), P("/obj/machinery/autolathe/proc/reset"), live(wire)])), 60]);
	} else if ($0 === "High Voltage Ground") {
		rt.setFv(f, "shocked", live(A), (!truthy(rt.fv(f, "shocked", live(A))) ? 1 : 0));
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(A), P("/obj/machinery/autolathe/proc/reset"), live(wire)])), 60]);
	} else if ($0 === "Disable") {
		rt.setFv(f, "disabled", live(A), (!truthy(rt.fv(f, "disabled", live(A))) ? 1 : 0));
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(A), P("/obj/machinery/autolathe/proc/reset"), live(wire)])), 60]);
	}
	return f.dot;
}, true);

// /datum/wires/autolathe/proc/on_cut  (code/datums/wires/autolathe.dm:39)  may sleep
rt.def("/datum/wires/autolathe/proc/on_cut", function* on_cut(f: Frame, wire: Value, mend: Value) {
	let A: Value = null;
	let $0: any;
	f.vars = () => [wire, mend, A, $0];
	A = rt.sv(f, "holder");
	$0 = live(wire);
	if ($0 === "Hack") {
		yield* g.callName(f, live(A), "adjust_hacked", [(!truthy(live(mend)) ? 1 : 0)]);
	} else if ($0 === "High Voltage Ground") { // tg bug: tested WIRE_HACK twice, so cutting the shock wire did nothing (modern tg: WIRE_SHOCK)
		rt.setFv(f, "shocked", live(A), (!truthy(live(mend)) ? 1 : 0));
	} else if ($0 === "Disable") {
		rt.setFv(f, "disabled", live(A), (!truthy(live(mend)) ? 1 : 0));
	} else if ($0 === "High Voltage Circuit") {
		yield* g.callName(f, live(A), "shock", [live(f.usr), 50]);
	}
	return f.dot;
}, true);
