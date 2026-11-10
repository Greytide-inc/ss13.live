// Based on /tg/station's code/datums/weather/weather.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(1051, "/datum/weather", "/datum", {
	name: "space wind",
	desc: "Heavy gusts of wind blanket the area, periodically knocking down anyone caught in the open.",
	telegraph_message: "<span class='warning'>The wind begins to pick up.</span>",
	telegraph_duration: 300,
	telegraph_sound: null,
	telegraph_overlay: null,
	weather_message: "<span class='userdanger'>The wind begins to blow ferociously!</span>",
	weather_duration: 1200,
	weather_duration_lower: 1200,
	weather_duration_upper: 1500,
	weather_sound: null,
	weather_overlay: null,
	weather_color: null,
	end_message: "<span class='danger'>The wind relents its assault.</span>",
	end_duration: 300,
	end_sound: null,
	end_overlay: null,
	impacted_areas: null,
	protected_areas: null,
	target_z: 2,
	overlay_layer: 10,
	aesthetic: 0,
	immunity_type: "storm",
	stage: 4,
	probability: 0,
	area_type: rt.typePath("/area/space"),
});

// weather.dm:31
rt.def("/datum/weather/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.impacted_areas = list();

	this.protected_areas = list();
	return f.dot;
});

// weather.dm:44
rt.def("/datum/weather/proc/New", function New(f: Frame) {
	parent_proc();
	(rt.modField(f, GLOB.SSweather, "existing_weather", this, rt.bitOr));
	return f.dot;
});

// weather.dm:48
rt.def("/datum/weather/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.SSweather.existing_weather -= this;
	yield* parent_proc();
	return f.dot;
}, true);

// weather.dm:52
rt.def("/datum/weather/proc/telegraph", function* telegraph(f: Frame) {
	let V: Value = null, A: Value = null, M: Value = null;
	if (this.stage == STARTUP_STAGE) {
		return f.dot;
	}
	this.stage = STARTUP_STAGE;
	let affectareas: Value = list();
	for (V of each(get_areas(this.area_type))) {
		affectareas += V;
	}
	V = null;
	for (V of each(this.protected_areas)) {
		affectareas -= get_areas(V);
	}
	V = null;
	for (V of each(affectareas)) {
		if ((A = V).z == this.target_z) {
			(rt.modSrcVar(f, "impacted_areas", A, rt.bitOr));
		}
	}
	this.weather_duration = rand(this.weather_duration_lower, this.weather_duration_upper);
	this.update_areas();
	V = null;
	for (V of each(GLOB.player_list)) {
		if ((M = V).z == this.target_z) {
			if (this.telegraph_message) {
				to_chat(M, this.telegraph_message);
			}
			if (this.telegraph_sound) {
				rt.op(f, "Output", [], [M, sound(this.telegraph_sound)], false);
			}
		}
	}
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/datum/weather/proc/start"))), this.telegraph_duration);
	return f.dot;
}, true);

// weather.dm:76
rt.def("/datum/weather/proc/start", function* start(f: Frame) {
	let V: Value = null, M: Value = null;
	if (this.stage >= MAIN_STAGE) {
		return f.dot;
	}
	this.stage = MAIN_STAGE;
	this.update_areas();
	for (V of each(GLOB.player_list)) {
		if ((M = V).z == this.target_z) {
			if (this.weather_message) {
				to_chat(M, this.weather_message);
			}
			if (this.weather_sound) {
				rt.op(f, "Output", [], [M, sound(this.weather_sound)], false);
			}
		}
	}
	if (!this.isprocessing) {
		this.isprocessing = 1;
		GLOB.SSweather.processing += this;
	}
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/datum/weather/proc/wind_down"))), this.weather_duration);
	return f.dot;
}, true);

// weather.dm:91
rt.def("/datum/weather/proc/wind_down", function* wind_down(f: Frame) {
	let V: Value = null, M: Value = null;
	if (this.stage >= WIND_DOWN_STAGE) {
		return f.dot;
	}
	this.stage = WIND_DOWN_STAGE;
	this.update_areas();
	for (V of each(GLOB.player_list)) {
		if ((M = V).z == this.target_z) {
			if (this.end_message) {
				to_chat(M, this.end_message);
			}
			if (this.end_sound) {
				rt.op(f, "Output", [], [M, sound(this.end_sound)], false);
			}
		}
	}
	this.isprocessing = 0;
	GLOB.SSweather.processing -= this;
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/datum/weather/proc/end"))), this.end_duration);
	return f.dot;
}, true);

// weather.dm:106
rt.def("/datum/weather/proc/end", function end(f: Frame) {
	if (this.stage == END_STAGE) {
		return 1;
	}
	this.stage = END_STAGE;
	this.update_areas();
	return f.dot;
});

// weather.dm:112
rt.def("/datum/weather/proc/can_impact", function can_impact(f: Frame, L: Value) {
	let mob_turf: Value = null;
	if ((mob_turf = rt.getStep(f, L, 0)) && mob_turf.z != this.target_z) {
		return f.dot;
	}
	if (rt.isIn(f, this.immunity_type, L.weather_immunities)) {
		return f.dot;
	}
	if (!rt.isIn(f, get_area(L), this.impacted_areas)) {
		return f.dot;
	}
	return 1;
});

// weather.dm:125
rt.def("/datum/weather/proc/update_areas", function update_areas(f: Frame) {
	let V: Value = null, N: Value = null;
	let $e: any;
	for (V of each(this.impacted_areas)) {
		(N = V).layer = this.overlay_layer;
		N.icon = rt.rsc("icons/effects/weather_effects.dmi");
		N.color = this.weather_color;
		if (this.stage === STARTUP_STAGE) {
			N.icon_state = this.telegraph_overlay;
		} else if (this.stage === MAIN_STAGE) {
			N.icon_state = this.weather_overlay;
		} else if (this.stage === WIND_DOWN_STAGE) {
			N.icon_state = this.end_overlay;
		} else if (this.stage === END_STAGE) {
			N.color = null;
			N.icon_state = "";
			N.icon = rt.rsc("icons/turf/areas.dmi");
			N.layer = AREA_LAYER;
			N.set_opacity(0);
		}
	}
	return f.dot;
});
