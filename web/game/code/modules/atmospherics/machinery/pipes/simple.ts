// Based on /tg/station's code/modules/atmospherics/machinery/pipes/simple.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(10518, "/obj/machinery/atmospherics/pipe/simple", "/obj/machinery/atmospherics/pipe", {
	initialize_directions: 3,
	device_type: 2,
	icon: rt.rsc("icons/obj/atmospherics/pipes/simple.dmi"),
	icon_state: "intact",
	name: "pipe",
	desc: "A one meter section of regular pipe.",
	dir: 2,
});

// simple.dm:19
rt.def("/obj/machinery/atmospherics/pipe/simple/proc/SetInitDirections", function SetInitDirections(f: Frame) {
	if (rt.isIn(f, this.dir, GLOB.diagonals)) {
		this.initialize_directions = this.dir;
	}
	if (this.dir === 1 || this.dir === 2) {
		this.initialize_directions = 3;
	} else if (this.dir === 4 || this.dir === 8) {
		this.initialize_directions = 12;
	}
	return f.dot;
});

// simple.dm:28
rt.def("/obj/machinery/atmospherics/pipe/simple/proc/atmosinit", function* atmosinit(f: Frame) {
	this.normalize_dir();
	yield* parent_proc();
	return f.dot;
}, true);

// simple.dm:32
rt.def("/obj/machinery/atmospherics/pipe/simple/proc/normalize_dir", function normalize_dir(f: Frame) {
	if (this.dir == 2) {
		this.setDir(1);
	} else {
		if (this.dir != 8) return f.dot;
		this.setDir(4);
	}
	return f.dot;
});

// simple.dm:38
rt.def("/obj/machinery/atmospherics/pipe/simple/proc/update_icon", function update_icon(f: Frame) {
	this.normalize_dir();
	parent_proc();
	return f.dot;
});
