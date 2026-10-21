// From code/modules/atmospherics/machinery/pipes/heat_exchange/he_pipes.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10555, "/obj/machinery/atmospherics/pipe/heat_exchanging", "/obj/machinery/atmospherics/pipe", {
	initialize_directions_he: null,
	minimum_temperature_difference: 20,
	thermal_conductivity: 0.1,
	icon_temperature: 293.15,
	level: 2,
	buckle_lying: 1,
	icon: rt.rsc("icons/obj/atmospherics/pipes/heat.dmi"),
	color: "#404040",
	resistance_flags: 3,
});

// /obj/machinery/atmospherics/pipe/heat_exchanging/proc/New  (code/modules/atmospherics/machinery/pipes/heat_exchange/he_pipes.dm:13)  may sleep
rt.def("/obj/machinery/atmospherics/pipe/heat_exchanging/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "add_atom_colour", "#404040", 4);
	return f.dot;
}, true);

// /obj/machinery/atmospherics/pipe/heat_exchanging/proc/can_be_node  (code/modules/atmospherics/machinery/pipes/heat_exchange/he_pipes.dm:17)
rt.def("/obj/machinery/atmospherics/pipe/heat_exchanging/proc/can_be_node", function can_be_node(f: Frame, target: Value) {
	if (!truthy((rt.istype(live(target), T("/obj/machinery/atmospherics/pipe/heat_exchanging")) ? 1 : 0))) {
		return 0;
	}
	if (!truthy(rt.bitAnd(rt.fv(f, "initialize_directions_he", live(target)), rt.getDir(f, live(target), live(f.src))))) return f.dot;
	return 1;
});

// /obj/machinery/atmospherics/pipe/heat_exchanging/proc/GetInitDirections  (code/modules/atmospherics/machinery/pipes/heat_exchange/he_pipes.dm:26)
rt.def("/obj/machinery/atmospherics/pipe/heat_exchanging/proc/GetInitDirections", function GetInitDirections(f: Frame) {
	return rt.bitOr(rt.callSuper(f, [], rt.Args.Same), rt.sv(f, "initialize_directions_he"));
});

// /obj/machinery/atmospherics/pipe/heat_exchanging/proc/process_atmos  (code/modules/atmospherics/machinery/pipes/heat_exchange/he_pipes.dm:30)
rt.def("/obj/machinery/atmospherics/pipe/heat_exchanging/proc/process_atmos", function process_atmos(f: Frame) {
	let environment_temperature: Value = null, pipe_air: Value = null, _T: Value = null, OT: Value = null, hc: Value = null, heat_source: Value = null, avg_temp: Value = null, m: Value = null, L: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [environment_temperature, pipe_air, _T, OT, hc, heat_source, avg_temp, m, L, $0, $1, $2, $e];
	environment_temperature = 0;
	pipe_air = rt.callSrc(f, "return_air", []);
	if (truthy((rt.istype((_T = rt.sv(f, "loc")), T("/turf")) ? 1 : 0))) {
		if (truthy((rt.istype(live(_T), T("/turf/open/floor/plating/lava")) ? 1 : 0))) {
			environment_temperature = 5000;
		} else {
			if (truthy(rt.fv(f, "blocks_air", live(_T)))) {
				environment_temperature = rt.fv(f, "temperature", live(_T));
			} else {
				environment_temperature = rt.callName(f, (OT = live(_T)), "GetTemperature", []);
			}
		}
	} else {
		environment_temperature = rt.fv(f, "temperature", live(_T));
	}
	if (rt.gt(rt.op(f, "Abs", [], [subtract(live(environment_temperature), rt.fv(f, "temperature", live(pipe_air)))]), rt.sv(f, "minimum_temperature_difference"))) {
		rt.callName(f, rt.sv(f, "parent"), "temperature_interact", [live(_T), rt.sv(f, "volume"), rt.sv(f, "thermal_conductivity")]);
	}
	if (!truthy(rt.callSrc(f, "has_buckled_mobs", []))) return f.dot;
	hc = rt.callName(f, live(pipe_air), "heat_capacity", []);
	heat_source = rt.index(rt.sv(f, "buckled_mobs"), 1);
	$0 = add(multiply(rt.fv(f, "temperature", live(pipe_air)), live(hc)), multiply(multiply(rt.fv(f, "bodytemperature", live(heat_source)), rt.len(f, rt.sv(f, "buckled_mobs"))), 3500));
	$1 = live(hc);
	if (truthy(rt.sv(f, "buckled_mobs"))) {
		$2 = multiply(rt.len(f, rt.sv(f, "buckled_mobs")), 3500);
	} else {
		$2 = 0;
	}
	avg_temp = divide($0, add($1, $2));
	m = null;
	rt.forList(f, 0, rt.sv(f, "buckled_mobs"));
	while (($e = rt.next(f, 0)) !== undefined) {
		m = $e;
		rt.setFv(f, "bodytemperature", (L = live(m)), live(avg_temp));
	}
	rt.endFor(f, 0);
	rt.setFv(f, "temperature", live(pipe_air), live(avg_temp));
	return f.dot;
});

// /obj/machinery/atmospherics/pipe/heat_exchanging/proc/process  (code/modules/atmospherics/machinery/pipes/heat_exchange/he_pipes.dm:62)  may sleep
rt.def("/obj/machinery/atmospherics/pipe/heat_exchanging/proc/process", function* process(f: Frame) {
	let pipe_air: Value = null, h_r: Value = null, h_g: Value = null, h_b: Value = null, scale: Value = null, heat_limit: Value = null, m: Value = null, buckled_mob: Value = null;
	let $e: any;
	f.vars = () => [pipe_air, h_r, h_g, h_b, scale, heat_limit, m, buckled_mob, $e];
	if (!truthy(rt.sv(f, "parent"))) {
		return live(f.dot);
	}
	if ((truthy(rt.gv(f, "temperature", (pipe_air = (yield* g.srcCall(f, "return_air"))))) && (rt.gt(rt.sv(f, "icon_temperature"), 500) || rt.gt(rt.fv(f, "temperature", live(pipe_air)), 500)))) {
		if (rt.gt(rt.op(f, "Abs", [], [subtract(rt.fv(f, "temperature", live(pipe_air)), rt.sv(f, "icon_temperature"))]), 10)) {
			rt.setSv(f, "icon_temperature", rt.fv(f, "temperature", live(pipe_air)));
			h_r = (yield* g.call(f, P("/proc/heat2colour_r"), null, [rt.sv(f, "icon_temperature")]));
			h_g = (yield* g.call(f, P("/proc/heat2colour_g"), null, [rt.sv(f, "icon_temperature")]));
			h_b = (yield* g.call(f, P("/proc/heat2colour_b"), null, [rt.sv(f, "icon_temperature")]));
			if (rt.lt(rt.sv(f, "icon_temperature"), 2000)) {
				scale = divide(subtract(rt.sv(f, "icon_temperature"), 500), 1500);
				h_r = add(64, multiply(subtract(live(h_r), 64), live(scale)));
				h_g = add(64, multiply(subtract(live(h_g), 64), live(scale)));
				h_b = add(64, multiply(subtract(live(h_b), 64), live(scale)));
			}
			rt.op(f, "Animate", [2, 8], [null, live(f.src), "color", rt.op(f, "Rgb", [1, 3], [live(h_r), live(h_g), live(h_b)]), "time", 20, "easing", 1]);
		}
	}
	if (!truthy((yield* g.srcCall(f, "has_buckled_mobs")))) return f.dot;
	heat_limit = 1000;
	if (!rt.gt(rt.fv(f, "temperature", live(pipe_air)), add(live(heat_limit), 1))) return f.dot;
	m = null;
	rt.forList(f, 0, rt.sv(f, "buckled_mobs"));
	while (($e = rt.next(f, 0)) !== undefined) {
		m = $e;
		yield* g.callName(f, (buckled_mob = live(m)), "apply_damage", [multiply(4, rt.op(f, "LogE", [], [subtract(rt.fv(f, "temperature", live(pipe_air)), live(heat_limit))])), "fire", "chest"]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { waitfor: false });
