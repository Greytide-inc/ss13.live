// Based on /tg/station's code/modules/atmospherics/machinery/components/unary_devices/unary_devices.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(10582, "/obj/machinery/atmospherics/components/unary", "/obj/machinery/atmospherics/components", {
	initialize_directions: 2,
	device_type: 1,
	icon: rt.rsc("icons/obj/atmospherics/components/unary_devices.dmi"),
	dir: 2,
});

// unary_devices.dm:8
rt.def("/obj/machinery/atmospherics/components/unary/proc/SetInitDirections", function SetInitDirections(f: Frame) {
	this.initialize_directions = this.dir;
	return f.dot;
});

// unary_devices.dm:14
rt.def("/obj/machinery/atmospherics/components/unary/proc/on_construction", function* on_construction(f: Frame) {
	yield* parent_proc();
	yield* this.update_icon();
	return f.dot;
}, true);

// unary_devices.dm:18
rt.def("/obj/machinery/atmospherics/components/unary/proc/hide", function* hide(f: Frame, intact: Value) {
	yield* this.update_icon();
	yield* parent_proc(intact);
	return f.dot;
}, true);
