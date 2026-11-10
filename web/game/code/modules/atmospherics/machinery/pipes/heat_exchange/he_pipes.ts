// Based on /tg/station's code/modules/atmospherics/machinery/pipes/heat_exchange/he_pipes.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


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

// he_pipes.dm:13
rt.def("/obj/machinery/atmospherics/pipe/heat_exchanging/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.add_atom_colour("#404040", FIXED_COLOUR_PRIORITY);
	return f.dot;
}, true);

// he_pipes.dm:17
rt.def("/obj/machinery/atmospherics/pipe/heat_exchanging/proc/can_be_node", function can_be_node(f: Frame, target: Value) {
	if (!rt.istype(target, T("/obj/machinery/atmospherics/pipe/heat_exchanging"))) {
		return 0;
	}
	if (!rt.bitAnd(target.initialize_directions_he, rt.getDir(f, target, this))) return f.dot;
	return 1;
});

// he_pipes.dm:26
rt.def("/obj/machinery/atmospherics/pipe/heat_exchanging/proc/GetInitDirections", function GetInitDirections(f: Frame) {
	return rt.bitOr(parent_proc(), this.initialize_directions_he);
});

// he_pipes.dm:30
rt.def("/obj/machinery/atmospherics/pipe/heat_exchanging/proc/process_atmos", function process_atmos(f: Frame) {
	let _T: Value = null, OT: Value = null, m: Value = null, L: Value = null;
	let $e: any;
	let environment_temperature: Value = 0;
	let pipe_air: Value = this.return_air();
	if (rt.istype((_T = this.loc), T("/turf"))) {
		if (rt.istype(_T, T("/turf/open/floor/plating/lava"))) {
			environment_temperature = 5000;
		} else if (_T.blocks_air) {
			environment_temperature = _T.temperature;
		} else {
			environment_temperature = (OT = _T).GetTemperature();
		}
	} else {
		environment_temperature = _T.temperature;
	}
	if (rt.op(f, "Abs", [], [environment_temperature - pipe_air.temperature]) > this.minimum_temperature_difference) {
		this.parent.temperature_interact(_T, this.volume, this.thermal_conductivity);
	}
	if (!this.has_buckled_mobs()) return f.dot;
	let hc: Value = pipe_air.heat_capacity();
	let heat_source: Value = rt.index(this.buckled_mobs, 1);
	let $0: any = pipe_air.temperature * hc + heat_source.bodytemperature * rt.len(f, this.buckled_mobs) * 3500;
	let $1: any = hc;
	let avg_temp: Value = $0 / ($1 + (this.buckled_mobs ? rt.len(f, this.buckled_mobs) * 3500 : 0));
	for (m of each(this.buckled_mobs)) {
		(L = m).bodytemperature = avg_temp;
	}
	pipe_air.temperature = avg_temp;
	return f.dot;
});

// he_pipes.dm:62
rt.def("/obj/machinery/atmospherics/pipe/heat_exchanging/proc/process", function* process(f: Frame) {
	let pipe_air: Value = null, h_r: Value = null, h_g: Value = null, h_b: Value = null, scale: Value = null, m: Value = null, buckled_mob: Value = null;
	if (!this.parent) {
		return f.dot;
	}
	if ((pipe_air = this.return_air()).temperature && (this.icon_temperature > 500 || pipe_air.temperature > 500)) {
		if (rt.op(f, "Abs", [], [pipe_air.temperature - this.icon_temperature]) > 10) {
			this.icon_temperature = pipe_air.temperature;
			h_r = heat2colour_r(this.icon_temperature);
			h_g = heat2colour_g(this.icon_temperature);
			h_b = heat2colour_b(this.icon_temperature);
			if (this.icon_temperature < 2000) {
				scale = (this.icon_temperature - 500) / 1500;
				h_r = 64 + (h_r - 64) * scale;
				h_g = 64 + (h_g - 64) * scale;
				h_b = 64 + (h_b - 64) * scale;
			}
			rt.op(f, "Animate", [2, 8], [null, this, "color", rt.op(f, "Rgb", [1, 3], [h_r, h_g, h_b]), "time", 20, "easing", 1]);
		}
	}
	if (!this.has_buckled_mobs()) return f.dot;
	let heat_limit: Value = 1000;
	if (!(pipe_air.temperature > heat_limit + 1)) return f.dot;
	for (m of each(this.buckled_mobs)) {
		yield* (buckled_mob = m).apply_damage(4 * rt.op(f, "LogE", [], [pipe_air.temperature - heat_limit]), "fire", "chest");
	}
	return f.dot;
}, true, { waitfor: false });
