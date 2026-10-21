// From code/datums/wires/r_n_d.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1072, "/datum/wires/r_n_d", "/datum/wires", {
	holder_type: rt.typePath("/obj/machinery/r_n_d"),
	randomize: 1,
});

// /datum/wires/r_n_d/proc/New  (code/datums/wires/r_n_d.dm:10)
rt.def("/datum/wires/r_n_d/proc/New", function New(f: Frame) {
	rt.setSv(f, "wires", rt.list("Hack", "Disable", "High Voltage Ground"));
	rt.callSrc(f, "add_duds", [5]);
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["holder"] });

// /datum/wires/r_n_d/proc/interactable  (code/datums/wires/r_n_d.dm:14)
rt.def("/datum/wires/r_n_d/proc/interactable", function interactable(f: Frame, user: Value) {
	let R: Value = null;
	f.vars = () => [R];
	if (!truthy(rt.gv(f, "panel_open", (R = rt.sv(f, "holder"))))) return f.dot;
	return 1;
});

// /datum/wires/r_n_d/proc/get_status  (code/datums/wires/r_n_d.dm:19)
rt.def("/datum/wires/r_n_d/proc/get_status", function get_status(f: Frame) {
	let R: Value = null, status: Value = null;
	let $0: any;
	f.vars = () => [R, status, $0];
	R = rt.sv(f, "holder");
	status = rt.list();
	if (truthy(rt.fv(f, "disabled", live(R)))) {
		$0 = "off";
	} else {
		$0 = "on";
	}
	status = rt.modify(live(status), fmt("The red light is ＀.", [$0]), add);
	if (truthy(rt.fv(f, "shocked", live(R)))) {
		$0 = "off";
	} else {
		$0 = "on";
	}
	status = rt.modify(live(status), fmt("The green light is ＀.", [$0]), add);
	if (truthy(rt.fv(f, "hacked", live(R)))) {
		$0 = "off";
	} else {
		$0 = "on";
	}
	return (status = rt.modify(live(status), fmt("The blue light is ＀.", [$0]), add));
});

// /datum/wires/r_n_d/proc/on_pulse  (code/datums/wires/r_n_d.dm:28)  may sleep
rt.def("/datum/wires/r_n_d/proc/on_pulse", function* on_pulse(f: Frame, wire: Value) {
	let R: Value = null;
	let $0: any;
	f.vars = () => [wire, R, $0];
	R = rt.sv(f, "holder");
	$0 = live(wire);
	if ($0 === "Hack") {
		rt.setFv(f, "hacked", live(R), (!truthy(rt.fv(f, "hacked", live(R))) ? 1 : 0));
	} else if ($0 === "Disable") {
		rt.setFv(f, "disabled", live(R), (!truthy(rt.fv(f, "disabled", live(R))) ? 1 : 0));
	} else if ($0 === "High Voltage Ground") {
		rt.setFv(f, "shocked", live(R), 1);
		yield* g.call(f, P("/proc/sleep"), null, [100]);
		if (!truthy(live(R))) return f.dot;
		rt.setFv(f, "shocked", live(R), 0);
	}
	return f.dot;
}, true, { waitfor: false });

// /datum/wires/r_n_d/proc/on_cut  (code/datums/wires/r_n_d.dm:41)
rt.def("/datum/wires/r_n_d/proc/on_cut", function on_cut(f: Frame, wire: Value, mend: Value) {
	let R: Value = null;
	let $0: any;
	f.vars = () => [R, $0];
	R = rt.sv(f, "holder");
	$0 = live(wire);
	if ($0 === "Hack") {
		rt.setFv(f, "hacked", live(R), (!truthy(live(mend)) ? 1 : 0));
	} else if ($0 === "Disable") {
		rt.setFv(f, "disabled", live(R), (!truthy(live(mend)) ? 1 : 0));
	} else if ($0 === "High Voltage Ground") {
		rt.setFv(f, "shocked", live(R), (!truthy(live(mend)) ? 1 : 0));
	}
	return f.dot;
});
