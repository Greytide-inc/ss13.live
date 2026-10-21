// From code/datums/wires/vending.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1078, "/datum/wires/vending", "/datum/wires", {
	holder_type: rt.typePath("/obj/machinery/vending"),
	proper_name: "Vending Unit",
});

// /datum/wires/vending/proc/New  (code/datums/wires/vending.dm:10)
rt.def("/datum/wires/vending/proc/New", function New(f: Frame) {
	rt.setSv(f, "wires", rt.list("Throw", "High Voltage Ground", "Speaker", "Contraband", "ID Scan"));
	rt.callSrc(f, "add_duds", [1]);
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["holder"] });

// /datum/wires/vending/proc/interactable  (code/datums/wires/vending.dm:14)  may sleep
rt.def("/datum/wires/vending/proc/interactable", function* interactable(f: Frame, user: Value) {
	let V: Value = null;
	f.vars = () => [user, V];
	V = rt.sv(f, "holder");
	if (((!truthy((rt.istype(live(user), T("/mob/living/silicon")) ? 1 : 0)) && truthy(rt.fv(f, "seconds_electrified", live(V)))) && truthy((yield* g.callName(f, live(V), "shock", [live(user), 100]))))) {
		return 0;
	}
	if (!truthy(rt.fv(f, "panel_open", live(V)))) return f.dot;
	return 1;
}, true);

// /datum/wires/vending/proc/get_status  (code/datums/wires/vending.dm:21)
rt.def("/datum/wires/vending/proc/get_status", function get_status(f: Frame) {
	let V: Value = null, status: Value = null;
	let $0: any;
	f.vars = () => [V, status, $0];
	V = rt.sv(f, "holder");
	status = rt.list();
	if (truthy(rt.fv(f, "seconds_electrified", live(V)))) {
		$0 = "on";
	} else {
		$0 = "off";
	}
	status = rt.modify(live(status), fmt("The orange light is ＀.", [$0]), add);
	if (truthy(rt.fv(f, "shoot_inventory", live(V)))) {
		$0 = "off";
	} else {
		$0 = "blinking";
	}
	status = rt.modify(live(status), fmt("The red light is ＀.", [$0]), add);
	if (truthy(rt.fv(f, "extended_inventory", live(V)))) {
		$0 = "on";
	} else {
		$0 = "off";
	}
	status = rt.modify(live(status), fmt("The green light is ＀.", [$0]), add);
	if (truthy(rt.fv(f, "scan_id", live(V)))) {
		$0 = "purple";
	} else {
		$0 = "yellow";
	}
	status = rt.modify(live(status), fmt("A ＀ light is on.", [$0]), add);
	if (truthy(rt.fv(f, "shut_up", live(V)))) {
		$0 = "off";
	} else {
		$0 = "on";
	}
	return (status = rt.modify(live(status), fmt("The speaker light is ＀.", [$0]), add));
});

// /datum/wires/vending/proc/on_pulse  (code/datums/wires/vending.dm:31)
rt.def("/datum/wires/vending/proc/on_pulse", function on_pulse(f: Frame, wire: Value) {
	let V: Value = null;
	let $0: any;
	f.vars = () => [V, $0];
	V = rt.sv(f, "holder");
	$0 = live(wire);
	if ($0 === "Throw") {
		rt.setFv(f, "shoot_inventory", live(V), (!truthy(rt.fv(f, "shoot_inventory", live(V))) ? 1 : 0));
	} else if ($0 === "Contraband") {
		rt.setFv(f, "extended_inventory", live(V), (!truthy(rt.fv(f, "extended_inventory", live(V))) ? 1 : 0));
	} else if ($0 === "High Voltage Ground") {
		rt.setFv(f, "seconds_electrified", live(V), 30);
	} else if ($0 === "ID Scan") {
		rt.setFv(f, "scan_id", live(V), (!truthy(rt.fv(f, "scan_id", live(V))) ? 1 : 0));
	} else if ($0 === "Speaker") {
		rt.setFv(f, "shut_up", live(V), (!truthy(rt.fv(f, "shut_up", live(V))) ? 1 : 0));
	}
	return f.dot;
});

// /datum/wires/vending/proc/on_cut  (code/datums/wires/vending.dm:45)
rt.def("/datum/wires/vending/proc/on_cut", function on_cut(f: Frame, wire: Value, mend: Value) {
	let V: Value = null;
	let $0: any;
	f.vars = () => [V, $0];
	V = rt.sv(f, "holder");
	$0 = live(wire);
	if ($0 === "Throw") {
		rt.setFv(f, "shoot_inventory", live(V), (!truthy(live(mend)) ? 1 : 0));
	} else if ($0 === "Contraband") {
		rt.setFv(f, "extended_inventory", live(V), 0);
	} else if ($0 === "High Voltage Ground") {
		if (truthy(live(mend))) {
			rt.setFv(f, "seconds_electrified", live(V), 0);
		} else {
			rt.setFv(f, "seconds_electrified", live(V), -1);
		}
	} else if ($0 === "ID Scan") {
		rt.setFv(f, "scan_id", live(V), live(mend));
	} else if ($0 === "Speaker") {
		rt.setFv(f, "shut_up", live(V), live(mend));
	}
	return f.dot;
});
