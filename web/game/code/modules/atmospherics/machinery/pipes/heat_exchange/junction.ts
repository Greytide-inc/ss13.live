// From code/modules/atmospherics/machinery/pipes/heat_exchange/junction.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10556, "/obj/machinery/atmospherics/pipe/heat_exchanging/junction", "/obj/machinery/atmospherics/pipe/heat_exchanging", {
	minimum_temperature_difference: 300,
	thermal_conductivity: 0,
	initialize_directions: 1,
	initialize_directions_he: 2,
	device_type: 2,
	icon: rt.rsc("icons/obj/atmospherics/pipes/junction.dmi"),
	icon_state: "intact",
	name: "junction",
	desc: "A one meter junction that connects regular and heat-exchanging pipe",
	dir: 2,
});

// /obj/machinery/atmospherics/pipe/heat_exchanging/junction/proc/SetInitDirections  (code/modules/atmospherics/machinery/pipes/heat_exchange/junction.dm:18)
rt.def("/obj/machinery/atmospherics/pipe/heat_exchanging/junction/proc/SetInitDirections", function SetInitDirections(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.sv(f, "dir");
	if ($0 === 2) {
		rt.setSv(f, "initialize_directions", 1);
		rt.setSv(f, "initialize_directions_he", 2);
	} else if ($0 === 1) {
		rt.setSv(f, "initialize_directions", 2);
		rt.setSv(f, "initialize_directions_he", 1);
	} else if ($0 === 4) {
		rt.setSv(f, "initialize_directions", 8);
		rt.setSv(f, "initialize_directions_he", 4);
	} else if ($0 === 8) {
		rt.setSv(f, "initialize_directions", 4);
		rt.setSv(f, "initialize_directions_he", 8);
	}
	return f.dot;
});

// /obj/machinery/atmospherics/pipe/heat_exchanging/junction/proc/getNodeConnects  (code/modules/atmospherics/machinery/pipes/heat_exchange/junction.dm:33)
rt.def("/obj/machinery/atmospherics/pipe/heat_exchanging/junction/proc/getNodeConnects", function getNodeConnects(f: Frame) {
	return rt.list(rt.call(f, P("/proc/turn"), null, [rt.sv(f, "dir"), 180]), rt.sv(f, "dir"));
});

// /obj/machinery/atmospherics/pipe/heat_exchanging/junction/proc/can_be_node  (code/modules/atmospherics/machinery/pipes/heat_exchange/junction.dm:37)
rt.def("/obj/machinery/atmospherics/pipe/heat_exchanging/junction/proc/can_be_node", function can_be_node(f: Frame, target: Value, iteration: Value) {
	let init_dir: Value = null, H: Value = null;
	let $0: any;
	f.vars = () => [init_dir, H, $0];
	init_dir = null;
	$0 = live(iteration);
	if ($0 === 1) {
		init_dir = rt.fv(f, "initialize_directions", live(target));
	} else if ($0 === 2) {
		if (!truthy((rt.istype((H = live(target)), T("/obj/machinery/atmospherics/pipe/heat_exchanging")) ? 1 : 0))) {
			return 0;
		}
		init_dir = rt.fv(f, "initialize_directions_he", live(H));
	}
	if (!truthy(rt.bitAnd(live(init_dir), rt.getDir(f, live(target), live(f.src))))) return f.dot;
	return 1;
});
