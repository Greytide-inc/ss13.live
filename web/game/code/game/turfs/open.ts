// Based on /tg/station's code/game/turfs/open.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(4785, "/turf/open/indestructible/sound", "/turf/open/indestructible", {
	sound: null,
	name: "squeeky floor",
});

// open.dm:21
rt.def("/turf/open/indestructible/sound/proc/Entered", function Entered(f: Frame, AM: Value) {
	if (!rt.istype(AM, T("/mob"))) return f.dot;
	playsound(this, this.sound, 50, 1);
	return f.dot;
});

rt.type(4786, "/turf/open/indestructible/necropolis", "/turf/open/indestructible", {
	name: "necropolis floor",
	desc: "It's regarding you suspiciously.",
	icon: rt.rsc("icons/turf/floors.dmi"),
	icon_state: "necro1",
	baseturf: rt.typePath("/turf/open/indestructible/necropolis"),
	initial_gas_mix: "o2=14;n2=23;TEMP=300",
});

// open.dm:33
rt.def("/turf/open/indestructible/necropolis/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!prob(12)) return f.dot;
	this.icon_state = `necro${rand(2, 3)}`;
	return f.dot;
}, true);

// open.dm:69
rt.def("/turf/open/proc/Initalize_Atmos", function Initalize_Atmos(f: Frame, times_fired: Value) {
	let direction: Value = null, enemy_tile: Value = null, enemy_air: Value = null, is_active: Value = null;
	let $0: any, $e: any;
	this.excited = 0;
	this.update_visuals();
	this.current_cycle = times_fired;
	let atmos_adjacent_turfs: Value = this.atmos_adjacent_turfs;
	for (direction of each(GLOB.cardinal)) {
		if (!rt.istype((enemy_tile = rt.getStep(f, this, direction)), T("/turf/open"))) {
			if (atmos_adjacent_turfs) {
				atmos_adjacent_turfs -= enemy_tile;
			}
			continue;
		}
		enemy_air = enemy_tile.return_air();
		if (enemy_tile.current_cycle < times_fired) {
			if (this.CanAtmosPass == -1) {
				$0 = this.CanAtmosPass(enemy_tile);
			} else if (this.CanAtmosPass == -2) {
				$0 = (!this.density ? 1 : 0);
			} else {
				$0 = this.CanAtmosPass;
			}
			if ($0) {
				if (!atmos_adjacent_turfs) {
					atmos_adjacent_turfs = list();
				}
				if (!enemy_tile.atmos_adjacent_turfs) {
					enemy_tile.atmos_adjacent_turfs = list();
				}
				rt.setAt(atmos_adjacent_turfs, enemy_tile, 1);
				rt.setAt(enemy_tile.atmos_adjacent_turfs, this, 1);
			} else {
				if (atmos_adjacent_turfs) {
					atmos_adjacent_turfs -= enemy_tile;
				}
				if (enemy_tile.atmos_adjacent_turfs) {
					enemy_tile.atmos_adjacent_turfs -= this;
				}
				if (enemy_tile.atmos_adjacent_turfs && !rt.len(f, enemy_tile.atmos_adjacent_turfs)) {
					enemy_tile.atmos_adjacent_turfs = null;
				}
				continue;
			}
		} else if (!atmos_adjacent_turfs || !rt.index(atmos_adjacent_turfs, enemy_tile)) {
			continue;
		}
		if (is_active = this.air.compare(enemy_air)) {
			if (!this.excited) {
				this.excited = 1;
				(rt.modField(f, GLOB.SSair, "active_turfs", this, rt.bitOr));
			}
		}
	}
	if (atmos_adjacent_turfs && !rt.len(f, atmos_adjacent_turfs)) {
		atmos_adjacent_turfs = null;
	}
	if (!atmos_adjacent_turfs) return f.dot;
	this.atmos_adjacent_turfs = atmos_adjacent_turfs;
	return f.dot;
});

// open.dm:115
rt.def("/turf/open/proc/GetHeatCapacity", function GetHeatCapacity(f: Frame) {
	f.dot = this.air.heat_capacity();
	return f.dot;
});

// open.dm:122
rt.def("/turf/open/proc/TakeTemperature", function TakeTemperature(f: Frame, temp: Value) {
	this.air.temperature += temp;
	this.air_update_turf();
	return f.dot;
});

// open.dm:125
rt.def("/turf/open/proc/freon_gas_act", function* freon_gas_act(f: Frame) {
	let I: Value = null, L: Value = null;
	let $e: any;
	for (I of each(this.contents, T("/obj"))) {
		if (!(I.secondary_flags ? rt.index(I.secondary_flags, "frozen") : 0)) {
			I.make_frozen_visual();
		}
	}
	for (L of each(this.contents, T("/mob/living"))) {
		if (L.bodytemperature <= 50) {
			yield* L.apply_status_effect(T("/datum/status_effect/freon"));
		}
	}
	yield* this.MakeSlippery(TURF_WET_PERMAFROST, 5);
	return 1;
}, true);

// open.dm:135
rt.def("/turf/open/proc/water_vapor_gas_act", function* water_vapor_gas_act(f: Frame) {
	let M: Value = null, O: Value = null, hotspot: Value = null;
	yield* this.MakeSlippery({ min_wet_time: 10, wet_time_to_add: 5 });
	for (M of each(this, T("/mob/living/simple_animal/slime"))) {
		yield* M.apply_water();
	}
	this.clean_blood();
	for (O of each(this, T("/obj/effect"))) {
		if (rt.istype(O, T("/obj/effect/decal/cleanable")) || rt.istype(O, T("/obj/effect/rune"))) {
			yield* qdel(O);
		}
	}
	if ((hotspot = rt.locateIn(f, T("/obj/effect/hotspot"), this)) && !rt.istype(this, T("/turf/open/space"))) {
		this.air.temperature = max(min(this.air.temperature - 2000, this.air.temperature / 2), 0);
		yield* qdel(hotspot);
	}
	return 1;
}, true);

// open.dm:152
rt.def("/turf/open/proc/handle_slip", function* handle_slip(f: Frame, C: Value, knockdown_amount: Value, O: Value, lube: Value) {
	let buckled_obj: Value = null, I: Value = null;
	let $0: any, $1: any, $e: any;
	if (rt.bitAnd(C.movement_type, 2)) {
		return 0;
	}
	if (!this.has_gravity(this)) return f.dot;
	if (C.buckled) {
		buckled_obj = C.buckled;
		if (!rt.bitAnd(lube, GALOSHES_DONT_HELP)) {
			return 0;
		}
	} else {
		if (C.lying || !rt.bitAnd(C.status_flags, 2)) {
			return 0;
		}
		if (C.m_intent == "walk" && rt.bitAnd(lube, NO_SLIP_WHEN_WALKING)) {
			return 0;
		}
	}
	if (!rt.bitAnd(lube, SLIDE_ICE)) {
		$0 = C;
		if (O) {
			$1 = ` on the ${O.name}`;
		} else {
			$1 = "";
		}
		to_chat($0, `<span class='notice'>You slipped${$1}!</span>`);
		$0 = C;
		if (O) {
			$1 = ` on the ${O.name}`;
		} else {
			$1 = "";
		}
		$0.log_message(`<font color='orange'>Slipped${$1}${rt.bitAnd(lube, SLIDE) ? " (LUBE)" : ""}!</font>`, "Attack log");
	}
	if (!rt.bitAnd(lube, SLIDE_ICE)) {
		playsound(C.loc, rt.rsc("sound/misc/slip.ogg"), 50, 1, -3);
	}
	for (I of each(C.held_items, T("/obj/item"))) {
		yield* C.accident(I);
	}
	let olddir: Value = C.dir;
	if (!rt.bitAnd(lube, SLIDE_ICE)) {
		yield* C.Knockdown(knockdown_amount);
		yield* C.stop_pulling();
	} else {
		yield* C.Stun(20);
	}
	if (buckled_obj) {
		yield* buckled_obj.unbuckle_mob(C);
		(lube = rt.modify(lube, SLIDE_ICE, rt.bitOr));
	}
	if (rt.bitAnd(lube, SLIDE)) {
		yield* new_(T("/datum/forced_movement"), C, get_ranged_target_turf(C, olddir, 4), 1, 0, (yield* new_(T("/datum/callback"), C, P("/mob/proc/spin"), 1, 1)));
	} else if (rt.bitAnd(lube, SLIDE_ICE)) {
		yield* new_(T("/datum/forced_movement"), C, get_ranged_target_turf(C, olddir, 1), 1, 0);
	}
	return 1;
}, true);

// open.dm:192
rt.def("/turf/open/proc/MakeSlippery", function* MakeSlippery(f: Frame, wet_setting: Value, min_wet_time: Value, wet_time_to_add: Value) {
	let F: Value = null;
	wet_setting ??= TURF_WET_WATER;
	min_wet_time ??= 0;
	wet_time_to_add ??= 0;
	this.wet_time = max(this.wet_time + wet_time_to_add, min_wet_time);
	if (this.wet >= wet_setting) {
		return f.dot;
	}
	this.wet = wet_setting;
	if (wet_setting != TURF_DRY) {
		if (this.wet_overlay) {
			this.cut_overlay(this.wet_overlay);
		} else {
			this.wet_overlay = mutable_appearance();
		}
		if (rt.istype((F = this), T("/turf/open/floor"))) {
			if (wet_setting == TURF_WET_PERMAFROST) {
				this.wet_overlay.icon = rt.rsc("icons/effects/water.dmi");
				this.wet_overlay.icon_state = "ice_floor";
			} else if (wet_setting == TURF_WET_ICE) {
				this.wet_overlay.icon = rt.rsc("icons/turf/overlays.dmi");
				this.wet_overlay.icon_state = "snowfloor";
			} else {
				this.wet_overlay.icon = rt.rsc("icons/effects/water.dmi");
				this.wet_overlay.icon_state = "wet_floor_static";
			}
		} else {
			this.wet_overlay.icon = rt.rsc("icons/effects/water.dmi");
			this.wet_overlay.icon_state = "wet_static";
		}
		this.add_overlay(this.wet_overlay);
	}
	yield* this.HandleWet();
	return f.dot;
}, true);

// open.dm:219
rt.def("/turf/open/proc/MakeDry", function MakeDry(f: Frame, wet_setting: Value) {
	wet_setting ??= TURF_WET_WATER;
	if (this.wet > wet_setting || !this.wet) {
		return f.dot;
	}
	rt.spawnTail(f, rand(0, 20), "/turf/open/proc/MakeDry: spawn at game/turfs/open.dm:219", wet_setting);
	return f.dot;
});

// a spawn(rt.call(f, P("/proc/rand"), null, [0, 20])) body of /turf/open/proc/MakeDry, a named tail so a world snapshot can hold it while it waits.
rt.tail("/turf/open/proc/MakeDry: spawn at game/turfs/open.dm:219", function* (f: Frame, wet_setting: Value) {
	if (this.wet == 4) {
		this.wet = 3;
	} else if (this.wet == 3) {
		this.wet = 1;
	} else {
		this.wet = 0;
		if (this.wet_overlay) {
			this.cut_overlay(this.wet_overlay);
		}
	}
	return null;
});

// open.dm:232
rt.def("/turf/open/proc/HandleWet", function* HandleWet(f: Frame) {
	let O: Value = null;
	let $e: any;
	if (!this.wet) {
		return f.dot;
	}
	if (!this.wet_time && this.wet < TURF_WET_ICE) {
		this.MakeDry(TURF_WET_ICE);
	}
	if (this.wet_time > MAXIMUM_WET_TIME) {
		this.wet_time = MAXIMUM_WET_TIME;
	}
	if (this.wet == TURF_WET_ICE && this.air.temperature > T0C) {
		for (O of each(this.contents, T("/obj"))) {
			if (O.secondary_flags ? rt.index(O.secondary_flags, "frozen") : 0) {
				O.make_unfrozen();
			}
		}
		this.MakeDry(TURF_WET_ICE);
		yield* this.MakeSlippery(TURF_WET_WATER);
	}
	if (this.wet != TURF_WET_PERMAFROST) {
		if (rt.inRange(this.air.temperature, -1e+31, T0C)) {
			if (this.wet != TURF_WET_ICE && this.wet) {
				this.MakeDry(TURF_WET_ICE);
				yield* this.MakeSlippery(TURF_WET_ICE);
			}
		} else if (rt.inRange(this.air.temperature, T0C, T20C)) {
			this.wet_time = max(0, this.wet_time - 1);
		} else if (rt.inRange(this.air.temperature, T20C, 313.15)) {
			this.wet_time = max(0, this.wet_time - 2);
		} else if (rt.inRange(this.air.temperature, 313.15, 333.15)) {
			this.wet_time = max(0, this.wet_time - 3);
		} else if (rt.inRange(this.air.temperature, 333.15, 353.15)) {
			this.wet_time = max(0, this.wet_time - 5);
		} else if (rt.inRange(this.air.temperature, 353.15, 373.15)) {
			this.wet_time = max(0, this.wet_time - 10);
		} else if (rt.inRange(this.air.temperature, 373.15, 1e+31)) {
			this.wet_time = 0;
		}
	} else if (this.GetTemperature() > BODYTEMP_COLD_DAMAGE_LIMIT) {
		this.MakeDry(TURF_WET_PERMAFROST);
	} else {
		this.wet_time = max(0, this.wet_time - 5);
	}
	if (this.wet && this.wet < TURF_WET_ICE && !this.wet_time) {
		this.MakeDry(TURF_WET_ICE);
	}
	if (!this.wet && this.wet_time) {
		this.wet_time = 0;
	}
	if (!this.wet) return f.dot;
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/turf/open/proc/HandleWet"))), 15, 1);
	return f.dot;
}, true);
