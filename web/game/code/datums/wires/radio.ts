// From code/datums/wires/radio.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1073, "/datum/wires/radio", "/datum/wires", {
	holder_type: rt.typePath("/obj/item/device/radio"),
	proper_name: "Radio",
});

// /datum/wires/radio/proc/New  (code/datums/wires/radio.dm:10)
rt.def("/datum/wires/radio/proc/New", function New(f: Frame) {
	rt.setSv(f, "wires", rt.list("Signal", "Recieve", "Transmit"));
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["holder"] });

// /datum/wires/radio/proc/interactable  (code/datums/wires/radio.dm:13)
rt.def("/datum/wires/radio/proc/interactable", function interactable(f: Frame, user: Value) {
	let R: Value = null;
	f.vars = () => [R];
	if (!truthy(rt.gv(f, "b_stat", (R = rt.sv(f, "holder"))))) return f.dot;
	return 1;
});

// /datum/wires/radio/proc/on_pulse  (code/datums/wires/radio.dm:18)
rt.def("/datum/wires/radio/proc/on_pulse", function on_pulse(f: Frame, index: Value) {
	let R: Value = null;
	let $0: any;
	f.vars = () => [R, $0];
	R = rt.sv(f, "holder");
	$0 = live(index);
	if ($0 === "Signal") {
		rt.setFv(f, "listening", live(R), (!truthy(rt.fv(f, "listening", live(R))) ? 1 : 0));
		rt.setFv(f, "broadcasting", live(R), rt.fv(f, "listening", live(R)));
	} else if ($0 === "Recieve") {
		rt.setFv(f, "listening", live(R), (!truthy(rt.fv(f, "listening", live(R))) ? 1 : 0));
	} else if ($0 === "Transmit") {
		rt.setFv(f, "broadcasting", live(R), (!truthy(rt.fv(f, "broadcasting", live(R))) ? 1 : 0));
	}
	return f.dot;
});
