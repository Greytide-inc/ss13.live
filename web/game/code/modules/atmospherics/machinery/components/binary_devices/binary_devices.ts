// From code/modules/atmospherics/machinery/components/binary_devices/binary_devices.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10561, "/obj/machinery/atmospherics/components/binary", "/obj/machinery/atmospherics/components", {
	initialize_directions: 3,
	device_type: 2,
	icon: rt.rsc("icons/obj/atmospherics/components/binary_devices.dmi"),
	dir: 2,
	use_power: 1,
	layer: 2.49,
});

// /obj/machinery/atmospherics/components/binary/proc/SetInitDirections  (code/modules/atmospherics/machinery/components/binary_devices/binary_devices.dm:10)
rt.def("/obj/machinery/atmospherics/components/binary/proc/SetInitDirections", function SetInitDirections(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.sv(f, "dir");
	if ($0 === 1) {
		rt.setSv(f, "initialize_directions", 3);
	} else if ($0 === 2) {
		rt.setSv(f, "initialize_directions", 3);
	} else if ($0 === 4) {
		rt.setSv(f, "initialize_directions", 12);
	} else if ($0 === 8) {
		rt.setSv(f, "initialize_directions", 12);
	}
	return f.dot;
});

// /obj/machinery/atmospherics/components/binary/proc/hide  (code/modules/atmospherics/machinery/components/binary_devices/binary_devices.dm:23)
rt.def("/obj/machinery/atmospherics/components/binary/proc/hide", function hide(f: Frame, intact: Value) {
	rt.callSrc(f, "update_icon", []);
	rt.callSuper(f, [live(intact)]);
	return f.dot;
});

// /obj/machinery/atmospherics/components/binary/proc/getNodeConnects  (code/modules/atmospherics/machinery/components/binary_devices/binary_devices.dm:31)
rt.def("/obj/machinery/atmospherics/components/binary/proc/getNodeConnects", function getNodeConnects(f: Frame) {
	return rt.list(rt.call(f, P("/proc/turn"), null, [rt.sv(f, "dir"), 180]), rt.sv(f, "dir"));
});
