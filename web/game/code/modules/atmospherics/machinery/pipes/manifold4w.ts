// Based on /tg/station's code/modules/atmospherics/machinery/pipes/manifold4w.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(10481, "/obj/machinery/atmospherics/pipe/manifold4w", "/obj/machinery/atmospherics/pipe", {
	initialize_directions: 15,
	device_type: 4,
	icon: rt.rsc("icons/obj/atmospherics/pipes/manifold.dmi"),
	icon_state: "manifold4w",
	name: "4-way pipe manifold",
	desc: "A manifold composed of regular pipes",
});

// manifold4w.dm:16
rt.def("/obj/machinery/atmospherics/pipe/manifold4w/proc/SetInitDirections", function SetInitDirections(f: Frame) {
	this.initialize_directions = rt.initial(f, this, "initialize_directions");
	return f.dot;
});

// manifold4w.dm:19
rt.def("/obj/machinery/atmospherics/pipe/manifold4w/proc/update_icon", function update_icon(f: Frame) {
	let invis: Value = null, I: Value = null;
	let $e: any;
	this.icon_state = `manifold4w_center${(invis = this.invisibility ? "-f" : "")}`;
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
