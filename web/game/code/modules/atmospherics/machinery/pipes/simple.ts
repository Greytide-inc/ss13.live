// From code/modules/atmospherics/machinery/pipes/simple.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10518, "/obj/machinery/atmospherics/pipe/simple", "/obj/machinery/atmospherics/pipe", {
	initialize_directions: 3,
	device_type: 2,
	icon: rt.rsc("icons/obj/atmospherics/pipes/simple.dmi"),
	icon_state: "intact",
	name: "pipe",
	desc: "A one meter section of regular pipe.",
	dir: 2,
});

// /obj/machinery/atmospherics/pipe/simple/proc/SetInitDirections  (code/modules/atmospherics/machinery/pipes/simple.dm:19)
rt.def("/obj/machinery/atmospherics/pipe/simple/proc/SetInitDirections", function SetInitDirections(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy((rt.isIn(f, rt.sv(f, "dir"), rt.gl("diagonals")) ? 1 : 0))) {
		rt.setSv(f, "initialize_directions", rt.sv(f, "dir"));
	}
	$0 = rt.sv(f, "dir");
	if ($0 === 1 || $0 === 2) {
		rt.setSv(f, "initialize_directions", 3);
	} else if ($0 === 4 || $0 === 8) {
		rt.setSv(f, "initialize_directions", 12);
	}
	return f.dot;
});

// /obj/machinery/atmospherics/pipe/simple/proc/atmosinit  (code/modules/atmospherics/machinery/pipes/simple.dm:28)  may sleep
rt.def("/obj/machinery/atmospherics/pipe/simple/proc/atmosinit", function* atmosinit(f: Frame) {
	yield* g.srcCall(f, "normalize_dir");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/machinery/atmospherics/pipe/simple/proc/normalize_dir  (code/modules/atmospherics/machinery/pipes/simple.dm:32)
rt.def("/obj/machinery/atmospherics/pipe/simple/proc/normalize_dir", function normalize_dir(f: Frame) {
	if (isEqual(rt.sv(f, "dir"), 2)) {
		rt.callSrc(f, "setDir", [1]);
	} else {
		if (!isEqual(rt.sv(f, "dir"), 8)) return f.dot;
		rt.callSrc(f, "setDir", [4]);
	}
	return f.dot;
});

// /obj/machinery/atmospherics/pipe/simple/proc/update_icon  (code/modules/atmospherics/machinery/pipes/simple.dm:38)
rt.def("/obj/machinery/atmospherics/pipe/simple/proc/update_icon", function update_icon(f: Frame) {
	rt.callSrc(f, "normalize_dir", []);
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});
