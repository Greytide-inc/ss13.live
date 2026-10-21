// From code/modules/atmospherics/machinery/pipes/manifold4w.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10481, "/obj/machinery/atmospherics/pipe/manifold4w", "/obj/machinery/atmospherics/pipe", {
	initialize_directions: 15,
	device_type: 4,
	icon: rt.rsc("icons/obj/atmospherics/pipes/manifold.dmi"),
	icon_state: "manifold4w",
	name: "4-way pipe manifold",
	desc: "A manifold composed of regular pipes",
});

// /obj/machinery/atmospherics/pipe/manifold4w/proc/SetInitDirections  (code/modules/atmospherics/machinery/pipes/manifold4w.dm:16)
rt.def("/obj/machinery/atmospherics/pipe/manifold4w/proc/SetInitDirections", function SetInitDirections(f: Frame) {
	rt.setSv(f, "initialize_directions", rt.initial(f, live(f.src), "initialize_directions"));
	return f.dot;
});

// /obj/machinery/atmospherics/pipe/manifold4w/proc/update_icon  (code/modules/atmospherics/machinery/pipes/manifold4w.dm:19)
rt.def("/obj/machinery/atmospherics/pipe/manifold4w/proc/update_icon", function update_icon(f: Frame) {
	let invis: Value = null, I: Value = null;
	let $0: any, $e: any;
	f.vars = () => [invis, I, $0, $e];
	if (truthy(rt.sv(f, "invisibility"))) {
		$0 = "-f";
	} else {
		$0 = "";
	}
	rt.setSv(f, "icon_state", fmt("manifold4w_center＀", [(invis = $0)]));
	rt.callSrc(f, "cut_overlays", []);
	I = null;
	rt.forRange(f, 0, 1, rt.sv(f, "device_type"), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (truthy(rt.index(rt.sv(f, "nodes"), live(I)))) {
			rt.callSrc(f, "add_overlay", [rt.callSrc(f, "getpipeimage", [rt.rsc("icons/obj/atmospherics/pipes/manifold.dmi"), fmt("manifold_full＀", [live(invis)]), rt.getDir(f, live(f.src), rt.index(rt.sv(f, "nodes"), live(I)))])]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});
