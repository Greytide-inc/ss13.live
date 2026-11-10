// Based on /tg/station's code/modules/atmospherics/machinery/components/trinary_devices/trinary_devices.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(10575, "/obj/machinery/atmospherics/components/trinary", "/obj/machinery/atmospherics/components", {
	flipped: 0,
	initialize_directions: 11,
	device_type: 3,
	icon: rt.rsc("icons/obj/atmospherics/components/trinary_devices.dmi"),
	dir: 2,
	use_power: 1,
	layer: 2.48,
});

// trinary_devices.dm:12
rt.def("/obj/machinery/atmospherics/components/trinary/proc/SetInitDirections", function SetInitDirections(f: Frame) {
	if (this.dir === 1) {
		this.initialize_directions = 7;
	} else if (this.dir === 2) {
		this.initialize_directions = 11;
	} else if (this.dir === 4) {
		this.initialize_directions = 14;
	} else if (this.dir === 8) {
		this.initialize_directions = 13;
	}
	return f.dot;
});

// trinary_devices.dm:39
rt.def("/obj/machinery/atmospherics/components/trinary/proc/getNodeConnects", function getNodeConnects(f: Frame) {
	let node1_connect: Value = turn(this.dir, -180);
	let node2_connect: Value = turn(this.dir, -90);
	let node3_connect: Value = this.dir;
	if (this.flipped) {
		node1_connect = turn(node1_connect, 180);
		node3_connect = turn(node3_connect, 180);
	}
	return list(node1_connect, node2_connect, node3_connect);
});
