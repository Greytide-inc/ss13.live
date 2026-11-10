// Based on /tg/station's code/controllers/subsystem/weather.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(51, "/datum/controller/subsystem/weather", "/datum/controller/subsystem", {
	processing: null,
	existing_weather: null,
	eligible_zlevels: null,
	name: "Weather",
	flags: 4,
	wait: 10,
	runlevels: 4,
});

// weather.dm:2
rt.def("/datum/controller/subsystem/weather/proc/New", function* New(f: Frame) {
	if (GLOB.SSweather != this) {
		if (rt.istype(GLOB.SSweather, T("/datum/controller/subsystem/weather"))) {
			yield* this.Recover();
			yield* qdel(GLOB.SSweather);
		}
		GLOB.SSweather = this;
	}
	this.PreInit();
	return f.dot;
}, true);

// weather.dm:7
rt.def("/datum/controller/subsystem/weather/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.processing = list();

	this.existing_weather = list();

	this.eligible_zlevels = list(5);
	return f.dot;
});

// weather.dm:12
rt.def("/datum/controller/subsystem/weather/proc/fire", function* fire(f: Frame) {
	let V: Value = null, W: Value = null, L: Value = null, Z: Value = null, possible_weather_for_this_z: Value = null, V_2: Value = null, WE: Value = null, W_2: Value = null;
	for (V of each(this.processing)) {
		if ((W = V).aesthetic) {
			continue;
		}
		L = null;
		for (L of each(GLOB.mob_list, T("/mob/living"))) {
			if (W.can_impact(L)) {
				yield* W.impact(L);
			}
		}
	}
	for (Z of each(this.eligible_zlevels)) {
		possible_weather_for_this_z = list();
		V_2 = null;
		for (V_2 of each(this.existing_weather)) {
			if ((WE = V_2).target_z == Z && WE.probability) {
				rt.setAt(possible_weather_for_this_z, WE, WE.probability);
			}
		}
		yield* this.run_weather((W_2 = pickweight(possible_weather_for_this_z)).name, Z);
		this.eligible_zlevels -= Z;
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/datum/controller/subsystem/weather/proc/make_z_eligible"), Z)), rand(3000, 6000) + W_2.weather_duration_upper, 1);
	}
	return f.dot;
}, true);

// weather.dm:31
rt.def("/datum/controller/subsystem/weather/proc/Initialize", function* Initialize(f: Frame, start_timeofday: Value) {
	let V: Value = null, W: Value = null;
	yield* parent_proc();
	for (V of each(typesof(T("/datum/weather")) - T("/datum/weather"))) {
		W = V;
		yield* new_(W);
	}
	return f.dot;
}, true);

// weather.dm:37
rt.def("/datum/controller/subsystem/weather/proc/run_weather", function* run_weather(f: Frame, weather_name: Value, Z: Value) {
	let V: Value = null, W: Value = null;
	if (!weather_name) {
		return f.dot;
	}
	for (V of each(this.existing_weather)) {
		if ((W = V).name == weather_name && W.target_z == Z) {
			yield* W.telegraph();
		}
	}
	return f.dot;
}, true);

// weather.dm:45
rt.def("/datum/controller/subsystem/weather/proc/make_z_eligible", function make_z_eligible(f: Frame, zlevel: Value) {
	(rt.modSrcVar(f, "eligible_zlevels", zlevel, rt.bitOr));
	return f.dot;
});
