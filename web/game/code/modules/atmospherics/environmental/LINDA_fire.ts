// Based on /tg/station's code/modules/atmospherics/environmental/LINDA_fire.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// LINDA_fire.dm:2
rt.def("/atom/proc/temperature_expose", function temperature_expose(f: Frame, air: Value, exposed_temperature: Value, exposed_volume: Value) {
	return null;
});

// LINDA_fire.dm:11
rt.def("/turf/open/proc/hotspot_expose", function* hotspot_expose(f: Frame, exposed_temperature: Value, exposed_volume: Value, soh: Value) {
	let air_contents: Value = null;
	if (!(air_contents = this.return_air())) {
		return 0;
	}
	let oxy: Value = rt.index(air_contents.gases, "o2") ? rt.index(rt.index(air_contents.gases, "o2"), 1) : 0;
	let tox: Value = rt.index(air_contents.gases, "plasma") ? rt.index(rt.index(air_contents.gases, "plasma"), 1) : 0;
	if (this.active_hotspot) {
		if (soh) {
			if (tox > 0.5 && oxy > 0.5) {
				if (this.active_hotspot.temperature < exposed_temperature) {
					this.active_hotspot.temperature = exposed_temperature;
				}
				if (this.active_hotspot.volume < exposed_volume) {
					this.active_hotspot.volume = exposed_volume;
				}
			}
		}
		return 1;
	}
	let igniting: Value = 0;
	if (exposed_temperature > 373.15 && tox > 0.5) {
		igniting = 1;
	}
	if (igniting) {
		if (oxy < 0.5 || tox < 0.5) {
			return 0;
		}
		this.active_hotspot = (yield* new_(T("/obj/effect/hotspot"), this));
		this.active_hotspot.temperature = exposed_temperature;
		this.active_hotspot.volume = exposed_volume;
		this.active_hotspot.just_spawned = (this.current_cycle < GLOB.SSair.times_fired ? 1 : 0);
		GLOB.SSair.add_to_active(this, 0);
	}
	return igniting;
}, true);

rt.type(12039, "/obj/effect/hotspot", "/obj/effect", {
	volume: 125,
	temperature: 373.15,
	just_spawned: 1,
	bypassing: 0,
	anchored: 1,
	light_range: 3,
	light_color: "#FAA019",
	mouse_opacity: 0,
	icon: rt.rsc("icons/effects/fire.dmi"),
	icon_state: "1",
	layer: 2.04,
});

// LINDA_fire.dm:61
rt.def("/obj/effect/hotspot/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	GLOB.SSair.hotspots += this;
	yield* this.perform_exposure();
	yield* this.setDir(pick(GLOB.cardinal));
	this.air_update_turf();
	return f.dot;
}, true);

// LINDA_fire.dm:71
rt.def("/obj/effect/hotspot/proc/perform_exposure", function* perform_exposure(f: Frame) {
	let location: Value = null, affected: Value = null, A: Value = null, AT: Value = null;
	if (!rt.istype((location = this.loc), T("/turf/open")) || !location.air) {
		return 0;
	}
	location.active_hotspot = this;
	if (this.volume > 2375) {
		this.bypassing = 1;
	} else {
		this.bypassing = 0;
	}
	if (this.bypassing) {
		if (!this.just_spawned) {
			this.volume = rt.index(location.air.reaction_results, "fire") * FIRE_GROWTH_RATE;
			this.temperature = location.air.temperature;
		}
	} else {
		(affected = (yield* location.air.remove_ratio(this.volume / location.air.volume))).temperature = this.temperature;
		yield* affected.react();
		this.temperature = affected.temperature;
		this.volume = rt.index(affected.reaction_results, "fire") * FIRE_GROWTH_RATE;
		yield* location.assume_air(affected);
	}
	for (A of each(this.loc)) {
		if ((AT = A) && AT != this) {
			yield* AT.fire_act(this.temperature, this.volume);
		}
	}
	return 0;
}, true);

// LINDA_fire.dm:106
rt.def("/obj/effect/hotspot/proc/process", function* process(f: Frame) {
	let location: Value = null, radiated_temperature: Value = null, t: Value = null, _T: Value = null;
	if (this.just_spawned) {
		this.just_spawned = 0;
		return 0;
	}
	if (!rt.istype((location = this.loc), T("/turf/open"))) {
		yield* qdel(this);
		return f.dot;
	}
	if (location.excited_group) {
		location.excited_group.reset_cooldowns();
	}
	if (this.temperature < 373.15 || this.volume <= 1) {
		yield* qdel(this);
		return f.dot;
	}
	if (!location.air || !rt.index(location.air.gases, "plasma") || !rt.index(location.air.gases, "o2") || rt.index(rt.index(location.air.gases, "plasma"), 1) < 0.5 || rt.index(rt.index(location.air.gases, "o2"), 1) < 0.5) {
		yield* qdel(this);
		return f.dot;
	}
	yield* this.perform_exposure();
	if (this.bypassing) {
		this.icon_state = "3";
		yield* location.burn_tile();
		if (location.air.temperature > 423.15) {
			radiated_temperature = location.air.temperature * 0.85;
			for (t of each(location.atmos_adjacent_turfs)) {
				if ((_T = t).active_hotspot) {
					yield* _T.hotspot_expose(radiated_temperature, 625);
				}
			}
		}
	} else if (this.volume > 1000) {
		this.icon_state = "2";
	} else {
		this.icon_state = "1";
	}
	if (this.temperature > location.max_fire_temperature_sustained) {
		location.max_fire_temperature_sustained = this.temperature;
	}
	if (location.heat_capacity && this.temperature > location.heat_capacity) {
		location.to_be_destroyed = 1;
	}
	return 1;
}, true, { waitfor: false });

// LINDA_fire.dm:153
rt.def("/obj/effect/hotspot/proc/Destroy", function* Destroy(f: Frame) {
	let _T: Value = null;
	this.set_light(0);
	GLOB.SSair.hotspots -= this;
	if (rt.istype((_T = this.loc), T("/turf/open")) && _T.active_hotspot == this) {
		_T.active_hotspot = null;
	}
	yield* this.DestroyTurf();
	this.loc = null;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// LINDA_fire.dm:163
rt.def("/obj/effect/hotspot/proc/DestroyTurf", function* DestroyTurf(f: Frame) {
	let _T: Value = null, chance_of_deletion: Value = null;
	if (!isturf(this.loc)) return f.dot;
	if (!(_T = this.loc).to_be_destroyed) return f.dot;
	if (_T.heat_capacity) {
		chance_of_deletion = _T.max_fire_temperature_sustained / _T.heat_capacity * 8;
	} else {
		chance_of_deletion = 100;
	}
	if (prob(chance_of_deletion)) {
		yield* _T.ChangeTurf(_T.baseturf);
	} else {
		_T.to_be_destroyed = 0;
		_T.max_fire_temperature_sustained = 0;
	}
	return f.dot;
}, true);

// LINDA_fire.dm:178
rt.def("/obj/effect/hotspot/proc/Crossed", function* Crossed(f: Frame, L: Value) {
	yield* parent_proc();
	if (!rt.istype(L, T("/mob/living"))) return f.dot;
	yield* L.fire_act(this.temperature, this.volume);
	return f.dot;
}, true);
