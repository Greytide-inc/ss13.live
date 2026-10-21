// From code/datums/wires/suit_storage_unit.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1075, "/datum/wires/suit_storage_unit", "/datum/wires", {
	holder_type: rt.typePath("/obj/machinery/suit_storage_unit"),
	proper_name: "Suit Storage Unit",
});

// /datum/wires/suit_storage_unit/proc/New  (code/datums/wires/suit_storage_unit.dm:10)
rt.def("/datum/wires/suit_storage_unit/proc/New", function New(f: Frame) {
	rt.setSv(f, "wires", rt.list("Hack", "Safety", "High Voltage Circuit"));
	rt.callSrc(f, "add_duds", [2]);
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["holder"] });

// /datum/wires/suit_storage_unit/proc/interactable  (code/datums/wires/suit_storage_unit.dm:14)
rt.def("/datum/wires/suit_storage_unit/proc/interactable", function interactable(f: Frame, user: Value) {
	let SSU: Value = null;
	f.vars = () => [SSU];
	if (!truthy(rt.gv(f, "panel_open", (SSU = rt.sv(f, "holder"))))) return f.dot;
	return 1;
});

// /datum/wires/suit_storage_unit/proc/get_status  (code/datums/wires/suit_storage_unit.dm:19)
rt.def("/datum/wires/suit_storage_unit/proc/get_status", function get_status(f: Frame) {
	let SSU: Value = null, status: Value = null;
	let $0: any;
	f.vars = () => [SSU, status, $0];
	SSU = rt.sv(f, "holder");
	status = rt.list();
	if (truthy(rt.fv(f, "uv_super", live(SSU)))) {
		$0 = "glowing";
	} else {
		$0 = "dim";
	}
	status = rt.modify(live(status), fmt("The UV bulb is ＀.", [$0]), add);
	if (truthy(rt.fv(f, "safeties", live(SSU)))) {
		$0 = "off";
	} else {
		$0 = "on";
	}
	return (status = rt.modify(live(status), fmt("The service light is ＀.", [$0]), add));
});

// /datum/wires/suit_storage_unit/proc/on_pulse  (code/datums/wires/suit_storage_unit.dm:26)  may sleep
rt.def("/datum/wires/suit_storage_unit/proc/on_pulse", function* on_pulse(f: Frame, wire: Value) {
	let SSU: Value = null;
	let $0: any;
	f.vars = () => [wire, SSU, $0];
	SSU = rt.sv(f, "holder");
	$0 = live(wire);
	if ($0 === "Hack") {
		rt.setFv(f, "uv_super", live(SSU), (!truthy(rt.fv(f, "uv_super", live(SSU))) ? 1 : 0));
	} else if ($0 === "Safety") {
		rt.setFv(f, "safeties", live(SSU), (!truthy(rt.fv(f, "safeties", live(SSU))) ? 1 : 0));
	} else if ($0 === "High Voltage Circuit") {
		if (!truthy(live(f.usr))) return f.dot;
		yield* g.callName(f, live(SSU), "shock", [live(f.usr)]);
	}
	return f.dot;
}, true);

// /datum/wires/suit_storage_unit/proc/on_cut  (code/datums/wires/suit_storage_unit.dm:37)  may sleep
rt.def("/datum/wires/suit_storage_unit/proc/on_cut", function* on_cut(f: Frame, wire: Value, mend: Value) {
	let SSU: Value = null;
	let $0: any;
	f.vars = () => [wire, mend, SSU, $0];
	SSU = rt.sv(f, "holder");
	$0 = live(wire);
	if ($0 === "Hack") {
		rt.setFv(f, "uv_super", live(SSU), (!truthy(live(mend)) ? 1 : 0));
	} else if ($0 === "Safety") {
		rt.setFv(f, "safeties", live(SSU), live(mend));
	} else if ($0 === "High Voltage Circuit") {
		if (!truthy(live(f.usr))) return f.dot;
		yield* g.callName(f, live(SSU), "shock", [live(f.usr)]);
	}
	return f.dot;
}, true);
