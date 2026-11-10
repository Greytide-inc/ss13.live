// Based on /tg/station's code/modules/atmospherics/machinery/pipes/heat_exchange/junction.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


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

// junction.dm:18
rt.def("/obj/machinery/atmospherics/pipe/heat_exchanging/junction/proc/SetInitDirections", function SetInitDirections(f: Frame) {
	if (this.dir === 2) {
		this.initialize_directions = 1;
		this.initialize_directions_he = 2;
	} else if (this.dir === 1) {
		this.initialize_directions = 2;
		this.initialize_directions_he = 1;
	} else if (this.dir === 4) {
		this.initialize_directions = 8;
		this.initialize_directions_he = 4;
	} else if (this.dir === 8) {
		this.initialize_directions = 4;
		this.initialize_directions_he = 8;
	}
	return f.dot;
});

// junction.dm:33
rt.def("/obj/machinery/atmospherics/pipe/heat_exchanging/junction/proc/getNodeConnects", function getNodeConnects(f: Frame) {
	return list(turn(this.dir, 180), this.dir);
});

// junction.dm:37
rt.def("/obj/machinery/atmospherics/pipe/heat_exchanging/junction/proc/can_be_node", function can_be_node(f: Frame, target: Value, iteration: Value) {
	let init_dir: Value = null, H: Value = null;
	if (iteration === 1) {
		init_dir = target.initialize_directions;
	} else if (iteration === 2) {
		if (!rt.istype((H = target), T("/obj/machinery/atmospherics/pipe/heat_exchanging"))) {
			return 0;
		}
		init_dir = H.initialize_directions_he;
	}
	if (!rt.bitAnd(init_dir, rt.getDir(f, target, this))) return f.dot;
	return 1;
});
