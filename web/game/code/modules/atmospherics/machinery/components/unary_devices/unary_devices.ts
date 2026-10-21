// From code/modules/atmospherics/machinery/components/unary_devices/unary_devices.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10582, "/obj/machinery/atmospherics/components/unary", "/obj/machinery/atmospherics/components", {
	initialize_directions: 2,
	device_type: 1,
	icon: rt.rsc("icons/obj/atmospherics/components/unary_devices.dmi"),
	dir: 2,
});

// /obj/machinery/atmospherics/components/unary/proc/SetInitDirections  (code/modules/atmospherics/machinery/components/unary_devices/unary_devices.dm:8)
rt.def("/obj/machinery/atmospherics/components/unary/proc/SetInitDirections", function SetInitDirections(f: Frame) {
	rt.setSv(f, "initialize_directions", rt.sv(f, "dir"));
	return f.dot;
});

// /obj/machinery/atmospherics/components/unary/proc/on_construction  (code/modules/atmospherics/machinery/components/unary_devices/unary_devices.dm:14)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/proc/on_construction", function* on_construction(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/machinery/atmospherics/components/unary/proc/hide  (code/modules/atmospherics/machinery/components/unary_devices/unary_devices.dm:18)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/proc/hide", function* hide(f: Frame, intact: Value) {
	f.vars = () => [intact];
	yield* g.srcCall(f, "update_icon");
	yield* g.callSuper(f, [live(intact)]);
	return f.dot;
}, true);
