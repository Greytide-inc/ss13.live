// From code/modules/atmospherics/machinery/components/trinary_devices/trinary_devices.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10575, "/obj/machinery/atmospherics/components/trinary", "/obj/machinery/atmospherics/components", {
	flipped: 0,
	initialize_directions: 11,
	device_type: 3,
	icon: rt.rsc("icons/obj/atmospherics/components/trinary_devices.dmi"),
	dir: 2,
	use_power: 1,
	layer: 2.48,
});

// /obj/machinery/atmospherics/components/trinary/proc/SetInitDirections  (code/modules/atmospherics/machinery/components/trinary_devices/trinary_devices.dm:12)
rt.def("/obj/machinery/atmospherics/components/trinary/proc/SetInitDirections", function SetInitDirections(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.sv(f, "dir");
	if ($0 === 1) {
		rt.setSv(f, "initialize_directions", 7);
	} else if ($0 === 2) {
		rt.setSv(f, "initialize_directions", 11);
	} else if ($0 === 4) {
		rt.setSv(f, "initialize_directions", 14);
	} else if ($0 === 8) {
		rt.setSv(f, "initialize_directions", 13);
	}
	return f.dot;
});

// /obj/machinery/atmospherics/components/trinary/proc/getNodeConnects  (code/modules/atmospherics/machinery/components/trinary_devices/trinary_devices.dm:39)
rt.def("/obj/machinery/atmospherics/components/trinary/proc/getNodeConnects", function getNodeConnects(f: Frame) {
	let node1_connect: Value = null, node2_connect: Value = null, node3_connect: Value = null;
	f.vars = () => [node1_connect, node2_connect, node3_connect];
	node1_connect = rt.call(f, P("/proc/turn"), null, [rt.sv(f, "dir"), -180]);
	node2_connect = rt.call(f, P("/proc/turn"), null, [rt.sv(f, "dir"), -90]);
	node3_connect = rt.sv(f, "dir");
	if (truthy(rt.sv(f, "flipped"))) {
		node1_connect = rt.call(f, P("/proc/turn"), null, [live(node1_connect), 180]);
		node3_connect = rt.call(f, P("/proc/turn"), null, [live(node3_connect), 180]);
	}
	return rt.list(live(node1_connect), live(node2_connect), live(node3_connect));
});
