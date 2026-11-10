// Based on /tg/station's code/modules/atmospherics/machinery/pipes/manifold.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(10444, "/obj/machinery/atmospherics/pipe/manifold", "/obj/machinery/atmospherics/pipe", {
	initialize_directions: 13,
	device_type: 3,
	icon: rt.rsc("icons/obj/atmospherics/pipes/manifold.dmi"),
	icon_state: "manifold",
	name: "pipe manifold",
	desc: "A manifold composed of regular pipes",
	dir: 2,
});

// manifold.dm:17
rt.def("/obj/machinery/atmospherics/pipe/manifold/proc/SetInitDirections", function SetInitDirections(f: Frame) {
	if (this.dir === 1) {
		this.initialize_directions = 14;
	} else if (this.dir === 2) {
		this.initialize_directions = 13;
	} else if (this.dir === 4) {
		this.initialize_directions = 11;
	} else if (this.dir === 8) {
		this.initialize_directions = 7;
	}
	return f.dot;
});

// manifold.dm:28
rt.def("/obj/machinery/atmospherics/pipe/manifold/proc/update_icon", function update_icon(f: Frame) {
	let invis: Value = null, I: Value = null;
	let $e: any;
	this.icon_state = `manifold_center${(invis = this.invisibility ? "-f" : "")}`;
	this.cut_overlays();
	rt.forRange(f, 0, 1, this.device_type, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (rt.index(this.nodes, I)) {
			this.add_overlay(this.getpipeimage(rt.rsc("icons/obj/atmospherics/pipes/manifold.dmi"), `manifold_full${invis}`, rt.getDir(f, this, rt.index(this.nodes, I))));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});
