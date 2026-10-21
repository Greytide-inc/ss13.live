// From code/modules/atmospherics/machinery/pipes/heat_exchange/manifold.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10557, "/obj/machinery/atmospherics/pipe/heat_exchanging/manifold", "/obj/machinery/atmospherics/pipe/heat_exchanging", {
	initialize_directions_he: 13,
	device_type: 3,
	icon_state: "manifold",
	name: "pipe manifold",
	desc: "A manifold composed of regular pipes",
	dir: 2,
});

// /obj/machinery/atmospherics/pipe/heat_exchanging/manifold/proc/SetInitDirections  (code/modules/atmospherics/machinery/pipes/heat_exchange/manifold.dm:14)
rt.def("/obj/machinery/atmospherics/pipe/heat_exchanging/manifold/proc/SetInitDirections", function SetInitDirections(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.sv(f, "dir");
	if ($0 === 1) {
		rt.setSv(f, "initialize_directions_he", 14);
	} else if ($0 === 2) {
		rt.setSv(f, "initialize_directions_he", 13);
	} else if ($0 === 4) {
		rt.setSv(f, "initialize_directions_he", 11);
	} else if ($0 === 8) {
		rt.setSv(f, "initialize_directions_he", 7);
	}
	return f.dot;
});

// /obj/machinery/atmospherics/pipe/heat_exchanging/manifold/proc/update_icon  (code/modules/atmospherics/machinery/pipes/heat_exchange/manifold.dm:25)
rt.def("/obj/machinery/atmospherics/pipe/heat_exchanging/manifold/proc/update_icon", function update_icon(f: Frame) {
	let invis: Value = null, I: Value = null;
	let $0: any, $e: any;
	f.vars = () => [invis, I, $0, $e];
	if (truthy(rt.sv(f, "invisibility"))) {
		$0 = "-f";
	} else {
		$0 = "";
	}
	rt.setSv(f, "icon_state", fmt("manifold_center＀", [(invis = $0)]));
	rt.callSrc(f, "cut_overlays", []);
	I = null;
	rt.forRange(f, 0, 1, rt.sv(f, "device_type"), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (truthy(rt.index(rt.sv(f, "nodes"), live(I)))) {
			rt.callSrc(f, "add_overlay", [rt.callSrc(f, "getpipeimage", [rt.rsc("icons/obj/atmospherics/pipes/heat.dmi"), fmt("manifold_intact＀", [live(invis)]), rt.getDir(f, live(f.src), rt.index(rt.sv(f, "nodes"), live(I)))])]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

rt.type(10558, "/obj/machinery/atmospherics/pipe/heat_exchanging/manifold4w", "/obj/machinery/atmospherics/pipe/heat_exchanging", {
	initialize_directions_he: 15,
	device_type: 4,
	icon_state: "manifold4w",
	name: "4-way pipe manifold",
	desc: "A manifold composed of heat-exchanging pipes",
});

// /obj/machinery/atmospherics/pipe/heat_exchanging/manifold4w/proc/SetInitDirections  (code/modules/atmospherics/machinery/pipes/heat_exchange/manifold.dm:48)
rt.def("/obj/machinery/atmospherics/pipe/heat_exchanging/manifold4w/proc/SetInitDirections", function SetInitDirections(f: Frame) {
	rt.setSv(f, "initialize_directions_he", rt.initial(f, live(f.src), "initialize_directions_he"));
	return f.dot;
});

// /obj/machinery/atmospherics/pipe/heat_exchanging/manifold4w/proc/update_icon  (code/modules/atmospherics/machinery/pipes/heat_exchange/manifold.dm:51)
rt.def("/obj/machinery/atmospherics/pipe/heat_exchanging/manifold4w/proc/update_icon", function update_icon(f: Frame) {
	let invis: Value = null, I: Value = null;
	let $0: any, $e: any;
	f.vars = () => [invis, I, $0, $e];
	if (truthy(rt.sv(f, "invisibility"))) {
		$0 = "-f";
	} else {
		$0 = "";
	}
	rt.setSv(f, "icon_state", fmt("manifold4w_center＀", [(invis = $0)]));
	rt.callSrc(f, "cut_overlays", []);
	I = null;
	rt.forRange(f, 0, 1, rt.sv(f, "device_type"), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (truthy(rt.index(rt.sv(f, "nodes"), live(I)))) {
			rt.callSrc(f, "add_overlay", [rt.callSrc(f, "getpipeimage", [rt.rsc("icons/obj/atmospherics/pipes/heat.dmi"), fmt("manifold_intact＀", [live(invis)]), rt.getDir(f, live(f.src), rt.index(rt.sv(f, "nodes"), live(I)))])]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});
