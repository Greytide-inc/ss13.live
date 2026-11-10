// Based on /tg/station's code/modules/atmospherics/machinery/pipes/heat_exchange/simple.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(10559, "/obj/machinery/atmospherics/pipe/heat_exchanging/simple", "/obj/machinery/atmospherics/pipe/heat_exchanging", {
	initialize_directions_he: 3,
	device_type: 2,
	icon_state: "intact",
	name: "pipe",
	desc: "A one meter section of heat-exchanging pipe",
	dir: 2,
});

// simple.dm:13
rt.def("/obj/machinery/atmospherics/pipe/heat_exchanging/simple/proc/SetInitDirections", function SetInitDirections(f: Frame) {
	if (rt.isIn(f, this.dir, GLOB.diagonals)) {
		this.initialize_directions_he = this.dir;
	}
	if (this.dir === 1 || this.dir === 2) {
		this.initialize_directions_he = 3;
	} else if (this.dir === 4 || this.dir === 8) {
		this.initialize_directions_he = 12;
	}
	return f.dot;
});

// simple.dm:22
rt.def("/obj/machinery/atmospherics/pipe/heat_exchanging/simple/proc/normalize_dir", function normalize_dir(f: Frame) {
	if (this.dir == 2) {
		this.setDir(1);
	} else {
		if (this.dir != 8) return f.dot;
		this.setDir(4);
	}
	return f.dot;
});

// simple.dm:28
rt.def("/obj/machinery/atmospherics/pipe/heat_exchanging/simple/proc/atmosinit", function* atmosinit(f: Frame) {
	this.normalize_dir();
	yield* parent_proc();
	return f.dot;
}, true);

// simple.dm:32
rt.def("/obj/machinery/atmospherics/pipe/heat_exchanging/simple/proc/update_icon", function update_icon(f: Frame) {
	this.normalize_dir();
	parent_proc();
	return f.dot;
});
