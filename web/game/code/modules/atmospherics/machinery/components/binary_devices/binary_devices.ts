// Based on /tg/station's code/modules/atmospherics/machinery/components/binary_devices/binary_devices.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(10561, "/obj/machinery/atmospherics/components/binary", "/obj/machinery/atmospherics/components", {
	initialize_directions: 3,
	device_type: 2,
	icon: rt.rsc("icons/obj/atmospherics/components/binary_devices.dmi"),
	dir: 2,
	use_power: 1,
	layer: 2.49,
});

// binary_devices.dm:10
rt.def("/obj/machinery/atmospherics/components/binary/proc/SetInitDirections", function SetInitDirections(f: Frame) {
	if (this.dir === 1) {
		this.initialize_directions = 3;
	} else if (this.dir === 2) {
		this.initialize_directions = 3;
	} else if (this.dir === 4) {
		this.initialize_directions = 12;
	} else if (this.dir === 8) {
		this.initialize_directions = 12;
	}
	return f.dot;
});

// binary_devices.dm:23
rt.def("/obj/machinery/atmospherics/components/binary/proc/hide", function hide(f: Frame, intact: Value) {
	this.update_icon();
	parent_proc(intact);
	return f.dot;
});

// binary_devices.dm:31
rt.def("/obj/machinery/atmospherics/components/binary/proc/getNodeConnects", function getNodeConnects(f: Frame) {
	return list(turn(this.dir, 180), this.dir);
});
