// Based on /tg/station's code/modules/atmospherics/machinery/pipes/heat_exchange/manifold.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(10557, "/obj/machinery/atmospherics/pipe/heat_exchanging/manifold", "/obj/machinery/atmospherics/pipe/heat_exchanging", {
	initialize_directions_he: 13,
	device_type: 3,
	icon_state: "manifold",
	name: "pipe manifold",
	desc: "A manifold composed of regular pipes",
	dir: 2,
});

// manifold.dm:14
rt.def("/obj/machinery/atmospherics/pipe/heat_exchanging/manifold/proc/SetInitDirections", function SetInitDirections(f: Frame) {
	if (this.dir === 1) {
		this.initialize_directions_he = 14;
	} else if (this.dir === 2) {
		this.initialize_directions_he = 13;
	} else if (this.dir === 4) {
		this.initialize_directions_he = 11;
	} else if (this.dir === 8) {
		this.initialize_directions_he = 7;
	}
	return f.dot;
});

// manifold.dm:25
rt.def("/obj/machinery/atmospherics/pipe/heat_exchanging/manifold/proc/update_icon", function update_icon(f: Frame) {
	let invis: Value = null, I: Value = null;
	let $e: any;
	this.icon_state = `manifold_center${(invis = this.invisibility ? "-f" : "")}`;
	this.cut_overlays();
	rt.forRange(f, 0, 1, this.device_type, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (rt.index(this.nodes, I)) {
			this.add_overlay(this.getpipeimage(rt.rsc("icons/obj/atmospherics/pipes/heat.dmi"), `manifold_intact${invis}`, rt.getDir(f, this, rt.index(this.nodes, I))));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

rt.type(10558, "/obj/machinery/atmospherics/pipe/heat_exchanging/manifold4w", "/obj/machinery/atmospherics/pipe/heat_exchanging", {
	initialize_directions_he: 15,
	device_type: 4,
	icon_state: "manifold4w",
	name: "4-way pipe manifold",
	desc: "A manifold composed of heat-exchanging pipes",
});

// manifold.dm:48
rt.def("/obj/machinery/atmospherics/pipe/heat_exchanging/manifold4w/proc/SetInitDirections", function SetInitDirections(f: Frame) {
	this.initialize_directions_he = rt.initial(f, this, "initialize_directions_he");
	return f.dot;
});

// manifold.dm:51
rt.def("/obj/machinery/atmospherics/pipe/heat_exchanging/manifold4w/proc/update_icon", function update_icon(f: Frame) {
	let invis: Value = null, I: Value = null;
	let $e: any;
	this.icon_state = `manifold4w_center${(invis = this.invisibility ? "-f" : "")}`;
	this.cut_overlays();
	rt.forRange(f, 0, 1, this.device_type, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (rt.index(this.nodes, I)) {
			this.add_overlay(this.getpipeimage(rt.rsc("icons/obj/atmospherics/pipes/heat.dmi"), `manifold_intact${invis}`, rt.getDir(f, this, rt.index(this.nodes, I))));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});
