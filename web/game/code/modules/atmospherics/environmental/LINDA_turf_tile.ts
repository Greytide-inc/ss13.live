// Based on /tg/station's code/modules/atmospherics/environmental/LINDA_turf_tile.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4497, "/turf/open", "/turf", {
	slowdown: 0,
	wet: 0,
	wet_time: 0,
	wet_overlay: null,
	pressure_difference: 0,
	pressure_direction: 0,
	pressure_pull_x: 0,
	pressure_pull_y: 0,
	excited_group: null,
	excited: 0,
	recently_active: 0,
	air: null,
	active_hotspot: null,
	atmos_cooldown: 0,
	planetary_atmos: 0,
	atmos_overlay_types: null,
	CanAtmosPass: -1,
});

// LINDA_turf_tile.dm:39
rt.def("/turf/open/proc/Initialize", function* Initialize(f: Frame) {
	if (!this.blocks_air) {
		this.air = (yield* new_(T("/datum/gas_mixture")));
		this.air.copy_from_turf(this);
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// LINDA_turf_tile.dm:46
rt.def("/turf/open/proc/Destroy", function* Destroy(f: Frame) {
	let _T: Value = null;
	if (this.active_hotspot) {
		yield* qdel(this.active_hotspot);
		this.active_hotspot = null;
	}
	for (_T of each(this.atmos_adjacent_turfs)) {
		GLOB.SSair.add_to_active(_T);
	}
	return (yield* parent_proc());
}, true);

// LINDA_turf_tile.dm:56
rt.def("/turf/open/proc/assume_air", function assume_air(f: Frame, giver: Value) {
	if (!giver) {
		return 0;
	}
	this.air.merge(giver);
	this.update_visuals();
	return 1;
});

// LINDA_turf_tile.dm:63
rt.def("/turf/open/proc/remove_air", function* remove_air(f: Frame, amount: Value) {
	let ours: Value = this.return_air();
	let removed: Value = (yield* ours.remove(amount));
	yield* this.update_visuals();
	return removed;
}, true);

// LINDA_turf_tile.dm:69
rt.def("/turf/open/proc/copy_air_with_tile", function copy_air_with_tile(f: Frame, _T: Value) {
	if (!rt.istype(_T, T("/turf/open"))) return f.dot;
	this.air.copy_from(_T.air);
	return f.dot;
});

// LINDA_turf_tile.dm:77
rt.def("/turf/proc/return_air", function return_air(f: Frame) {
	let GM: Value = null;
	(GM = new_(T("/datum/gas_mixture"))).copy_from_turf(this);
	return GM;
});

// LINDA_turf_tile.dm:85
rt.def("/turf/proc/temperature_expose", function temperature_expose(f: Frame) {
	if (!(this.temperature > this.heat_capacity)) return f.dot;
	this.to_be_destroyed = 1;
	return f.dot;
});

// LINDA_turf_tile.dm:89
rt.def("/turf/proc/archive", function archive(f: Frame) {
	this.temperature_archived = this.temperature;
	return f.dot;
});

// LINDA_turf_tile.dm:92
rt.def("/turf/open/proc/archive", function archive(f: Frame) {
	this.air.archive();
	this.archived_cycle = GLOB.SSair.times_fired;
	this.temperature_archived = this.temperature;
	return f.dot;
});

// LINDA_turf_tile.dm:99
rt.def("/turf/open/proc/update_visuals", function update_visuals(f: Frame) {
	let overlay: Value = null;
	let new_overlay_types: Value = this.tile_graphic();
	if (this.atmos_overlay_types) {
		for (overlay of each(this.atmos_overlay_types - new_overlay_types)) {
			this.cut_overlay(overlay);
		}
	}
	if (rt.len(f, new_overlay_types)) {
		if (this.atmos_overlay_types) {
			this.add_overlay(new_overlay_types - this.atmos_overlay_types);
		} else {
			this.add_overlay(new_overlay_types);
		}
	}
	if (new_overlay_types && !rt.len(f, new_overlay_types)) {
		new_overlay_types = null;
	}
	this.atmos_overlay_types = new_overlay_types;
	return f.dot;
});

// LINDA_turf_tile.dm:115
rt.def("/turf/open/proc/tile_graphic", function tile_graphic(f: Frame) {
	let id: Value = null, gas: Value = null, gas_meta: Value = null, gas_overlay: Value = null;
	f.dot = new_(T("/list"));
	if (!this.air) return f.dot;
	let gases: Value = this.air.gases;
	for (id of each(gases)) {
		gas = rt.index(gases, id);
		gas_meta = rt.index(gas, 3);
		if ((gas_overlay = rt.index(gas_meta, 4)) && rt.index(gas, 1) > rt.index(gas_meta, 3)) {
			f.dot += gas_overlay;
		}
	}
	return f.dot;
});

// LINDA_turf_tile.dm:138
rt.def("/turf/proc/process_cell", function process_cell(f: Frame, fire_count: Value) {
	GLOB.SSair.remove_from_active(this);
	return f.dot;
});

// LINDA_turf_tile.dm:141
rt.def("/turf/open/proc/process_cell", function* process_cell(f: Frame, fire_count: Value) {
	let planet_atmos: Value = null, t: Value = null, enemy_tile: Value = null, should_share_air: Value = null, enemy_air: Value = null, enemy_excited_group: Value = null, EG: Value = null, EG_10: Value = null, difference: Value = null, last_share: Value = null, G: Value = null, EG_7: Value = null, last_share_7: Value = null;
	if (this.archived_cycle < fire_count) {
		this.archive();
	}
	this.current_cycle = fire_count;
	let adjacent_turfs: Value = this.atmos_adjacent_turfs;
	let our_excited_group: Value = this.excited_group;
	let adjacent_turfs_length: Value = rt.length(adjacent_turfs);
	let cached_atmos_cooldown: Value = this.atmos_cooldown + 1;
	if (planet_atmos = this.planetary_atmos) {
		adjacent_turfs_length++;
	}
	let our_air: Value = this.air;
	for (t of each(adjacent_turfs)) {
		enemy_tile = t;
		if (fire_count > enemy_tile.current_cycle) {
			enemy_tile.archive();
			should_share_air = 0;
			enemy_air = enemy_tile.air;
			if (enemy_tile.excited) {
				enemy_excited_group = enemy_tile.excited_group;
				if (our_excited_group) {
					if (enemy_excited_group) {
						if (our_excited_group != enemy_excited_group) {
							our_excited_group.merge_groups(enemy_excited_group);
							our_excited_group = this.excited_group;
						}
						should_share_air = 1;
					} else if (this.recently_active == 1 && enemy_tile.recently_active == 1 || our_air.compare(enemy_air)) {
						our_excited_group.add_turf(enemy_tile);
						should_share_air = 1;
					}
				} else if (enemy_excited_group) {
					if (this.recently_active == 1 && enemy_tile.recently_active == 1 || our_air.compare(enemy_air)) {
						enemy_excited_group.add_turf(this);
						our_excited_group = this.excited_group;
						should_share_air = 1;
					}
				} else if (this.recently_active == 1 && enemy_tile.recently_active == 1 || our_air.compare(enemy_air)) {
					(EG = (yield* new_(T("/datum/excited_group")))).add_turf(this);
					EG.add_turf(enemy_tile);
					our_excited_group = this.excited_group;
					should_share_air = 1;
				}
			} else if (our_air.compare(enemy_air)) {
				GLOB.SSair.add_to_active(enemy_tile);
				if (our_excited_group) {
					our_excited_group.add_turf(enemy_tile);
				} else {
					(EG_10 = (yield* new_(T("/datum/excited_group")))).add_turf(this);
					EG_10.add_turf(enemy_tile);
					our_excited_group = this.excited_group;
				}
				should_share_air = 1;
			}
			if (should_share_air) {
				if (difference = our_air.share(enemy_air, adjacent_turfs_length)) {
					if (difference > 0) {
						this.consider_pressure_difference(enemy_tile, difference);
					} else {
						enemy_tile.consider_pressure_difference(this, -difference);
					}
				}
				if ((last_share = our_air.last_share) > 10.398379) {
					our_excited_group.reset_cooldowns();
					cached_atmos_cooldown = 0;
				} else if (last_share > 0.1039838) {
					our_excited_group.dismantle_cooldown = 0;
					cached_atmos_cooldown = 0;
				}
			}
		}
	}
	if (planet_atmos) {
		(G = (yield* new_(T("/datum/gas_mixture")))).copy_from_turf(this);
		G.archive();
		if (our_air.compare(G)) {
			if (!our_excited_group) {
				(EG_7 = (yield* new_(T("/datum/excited_group")))).add_turf(this);
				our_excited_group = this.excited_group;
			}
			our_air.share(G, adjacent_turfs_length);
			if ((last_share_7 = our_air.last_share) > 10.398379) {
				our_excited_group.reset_cooldowns();
				cached_atmos_cooldown = 0;
			} else if (last_share_7 > 0.1039838) {
				our_excited_group.dismantle_cooldown = 0;
				cached_atmos_cooldown = 0;
			}
		}
	}
	yield* our_air.react(this);
	yield* this.update_visuals();
	let remove: Value = 1;
	if (our_air.temperature > 493.15) {
		if (yield* this.consider_superconductivity({ starting: 1 })) {
			remove = 0;
		}
	}
	if (!our_excited_group && remove || cached_atmos_cooldown > 32) {
		GLOB.SSair.remove_from_active(this);
	}
	this.atmos_cooldown = cached_atmos_cooldown;
	return f.dot;
}, true);

// LINDA_turf_tile.dm:249
// tg_js: every outflow also adds its pull to pressure_pull_x/y, so two pulls at a right angle push diagonally
// (2017 tg kept only the strongest neighbour, so objects staircased towards a breach).
rt.def("/turf/open/proc/consider_pressure_difference", function consider_pressure_difference(f: Frame, _T: Value, difference: Value) {
	(rt.modField(f, GLOB.SSair, "high_pressure_delta", this, rt.bitOr));
	let dir: Value = rt.getDir(f, this, _T);
	if (rt.bitAnd(dir, 4)) this.pressure_pull_x = this.pressure_pull_x + difference;
	if (rt.bitAnd(dir, 8)) this.pressure_pull_x = this.pressure_pull_x - difference;
	if (rt.bitAnd(dir, 1)) this.pressure_pull_y = this.pressure_pull_y + difference;
	if (rt.bitAnd(dir, 2)) this.pressure_pull_y = this.pressure_pull_y - difference;
	if (!(difference > this.pressure_difference)) return f.dot;
	this.pressure_direction = dir;
	this.pressure_difference = difference;
	return f.dot;
});

// LINDA_turf_tile.dm:255
// tg_js: the push is the summed pull snapped to the nearest of the 8 directions (0.4142 = tan 22.5 degrees);
// pulls that cancel out fall back to the strongest neighbour, as 2017 tg did.
rt.def("/turf/open/proc/high_pressure_movements", function high_pressure_movements(f: Frame) {
	let M: Value = null;
	let x: Value = this.pressure_pull_x;
	let y: Value = this.pressure_pull_y;
	this.pressure_pull_x = 0;
	this.pressure_pull_y = 0;
	let ax: Value = x < 0 ? -x : x;
	let ay: Value = y < 0 ? -y : y;
	let dir: Value = 0;
	if (ax > ay * 0.4142) dir = dir + (x > 0 ? 4 : 8);
	if (ay > ax * 0.4142) dir = dir + (y > 0 ? 1 : 2);
	if (!dir) dir = this.pressure_direction;
	for (M of each(this, T("/atom/movable"))) {
		M.experience_pressure_difference(this.pressure_difference, dir);
	}
	return f.dot;
});

// LINDA_turf_tile.dm:266
rt.def("/atom/movable/proc/experience_pressure_difference", function* experience_pressure_difference(f: Frame, pressure_difference: Value, direction: Value, pressure_resistance_prob_delta: Value) {
	pressure_resistance_prob_delta ??= 0;
	let PROBABILITY_OFFSET: Value = 25;
	let PROBABILITY_BASE_PRECENT: Value = 75;
	f.dot = 0;
	if (!(!this.anchored && !this.pulledby)) return f.dot;
	f.dot = 1;
	if (!(this.last_high_pressure_movement_air_cycle < GLOB.SSair.times_fired)) return f.dot;
	let move_prob: Value = 100;
	if (this.pressure_resistance > 0) {
		move_prob = pressure_difference / this.pressure_resistance * 75 - 25;
	}
	if (!((move_prob += pressure_resistance_prob_delta) > 25 && prob(move_prob))) return f.dot;
	yield* step(this, direction);
	this.last_high_pressure_movement_air_cycle = GLOB.SSair.times_fired;
	return f.dot;
}, true, { waitfor: false });

rt.type(1843, "/datum/excited_group", "/datum", {
	turf_list: null,
	breakdown_cooldown: 0,
	dismantle_cooldown: 0,
});

// LINDA_turf_tile.dm:280
rt.def("/datum/excited_group/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.turf_list = list();
	return f.dot;
});

// LINDA_turf_tile.dm:288
rt.def("/datum/excited_group/proc/add_turf", function add_turf(f: Frame, _T: Value) {
	this.turf_list += _T;
	_T.excited_group = this;
	_T.recently_active = 1;
	this.reset_cooldowns();
	return f.dot;
});

// LINDA_turf_tile.dm:294
rt.def("/datum/excited_group/proc/merge_groups", function merge_groups(f: Frame, E: Value) {
	let t: Value = null, _T: Value = null;
	if (rt.len(f, this.turf_list) > rt.len(f, E.turf_list)) {
		GLOB.SSair.excited_groups -= E;
		for (t of each(E.turf_list)) {
			(_T = t).excited_group = this;
			this.turf_list += _T;
		}
		this.reset_cooldowns();
	} else {
		GLOB.SSair.excited_groups -= this;
		t = null;
		for (t of each(this.turf_list)) {
			(_T = t).excited_group = E;
			E.turf_list += _T;
		}
		E.reset_cooldowns();
	}
	return f.dot;
});

// LINDA_turf_tile.dm:315
rt.def("/datum/excited_group/proc/self_breakdown", function* self_breakdown(f: Frame, space_is_all_consuming: Value) {
	let t: Value = null, _T: Value = null, id: Value = null;
	space_is_all_consuming ??= 0;
	let A: Value = (yield* new_(T("/datum/gas_mixture")));
	let A_gases: Value = A.gases;
	let turf_list: Value = this.turf_list;
	let turflen: Value = rt.len(f, turf_list);
	let space_in_group: Value = 0;
	for (t of each(turf_list)) {
		_T = t;
		if (space_is_all_consuming && !space_in_group && rt.istype(_T.air, T("/datum/gas_mixture/immutable/space"))) {
			space_in_group = 1;
			yield* qdel(A);
			A = (yield* new_(T("/datum/gas_mixture/immutable/space")));
		}
		yield* A.merge(_T.air);
	}
	for (id of each(A_gases)) {
		rt.setAt(rt.index(A_gases, id), 1, rt.index(rt.index(A_gases, id), 1) / turflen);
	}
	t = null;
	for (t of each(turf_list)) {
		(_T = t).air.copy_from(A);
		_T.atmos_cooldown = 0;
		yield* _T.update_visuals();
	}
	this.breakdown_cooldown = 0;
	return f.dot;
}, true);

// LINDA_turf_tile.dm:343
rt.def("/datum/excited_group/proc/dismantle", function dismantle(f: Frame) {
	let t: Value = null, _T: Value = null;
	for (t of each(this.turf_list)) {
		(_T = t).excited = 0;
		_T.recently_active = 0;
		_T.excited_group = null;
		GLOB.SSair.active_turfs -= _T;
	}
	this.garbage_collect();
	return f.dot;
});

// LINDA_turf_tile.dm:352
rt.def("/datum/excited_group/proc/garbage_collect", function garbage_collect(f: Frame) {
	let t: Value = null, _T: Value = null;
	for (t of each(this.turf_list)) {
		(_T = t).excited_group = null;
	}
	this.turf_list.Cut();
	GLOB.SSair.excited_groups -= this;
	return f.dot;
});

// LINDA_turf_tile.dm:360
rt.def("/turf/proc/conductivity_directions", function conductivity_directions(f: Frame) {
	if (this.archived_cycle < GLOB.SSair.times_fired) {
		this.archive();
	}
	return 15;
});

// LINDA_turf_tile.dm:366
rt.def("/turf/open/proc/conductivity_directions", function conductivity_directions(f: Frame) {
	let direction: Value = null, _T: Value = null;
	if (this.blocks_air) {
		return parent_proc();
	}
	for (direction of each(GLOB.cardinal)) {
		if (!rt.isIn(f, (_T = rt.getStep(f, this, direction)), this.atmos_adjacent_turfs) && !rt.bitAnd(this.atmos_supeconductivity, direction)) {
			(f.dot = rt.modify(f.dot, direction, rt.bitOr));
		}
	}
	return f.dot;
});

// LINDA_turf_tile.dm:373
rt.def("/turf/proc/neighbor_conduct_with_src", function* neighbor_conduct_with_src(f: Frame, other: Value) {
	if (!other.blocks_air) {
		other.temperature_share_open_to_solid(this);
	} else {
		other.share_temperature_mutual_solid(this, this.thermal_conductivity);
	}
	yield* this.temperature_expose(null, this.temperature, null);
	return f.dot;
}, true);

// LINDA_turf_tile.dm:381
rt.def("/turf/open/proc/neighbor_conduct_with_src", function* neighbor_conduct_with_src(f: Frame, other: Value) {
	let _T: Value = null;
	if (this.blocks_air) {
		yield* parent_proc();
		return f.dot;
	}
	if (!other.blocks_air) {
		(_T = other).air.temperature_share(this.air, 0.1);
	} else {
		this.temperature_share_open_to_solid(other);
	}
	GLOB.SSair.add_to_active(this, 0);
	return f.dot;
}, true);

// LINDA_turf_tile.dm:392
rt.def("/turf/proc/super_conduct", function* super_conduct(f: Frame) {
	let conductivity_directions: Value = null, direction: Value = null, neighbor: Value = null;
	if (conductivity_directions = this.conductivity_directions()) {
		for (direction of each(GLOB.cardinal)) {
			if (rt.bitAnd(conductivity_directions, direction)) {
				if (!(neighbor = rt.getStep(f, this, direction)).thermal_conductivity) {
					continue;
				}
				if (neighbor.archived_cycle < GLOB.SSair.times_fired) {
					neighbor.archive();
				}
				yield* neighbor.neighbor_conduct_with_src(this);
				neighbor.consider_superconductivity();
			}
		}
	}
	this.radiate_to_spess();
	this.finish_superconduction();
	return f.dot;
}, true);

// LINDA_turf_tile.dm:416
rt.def("/turf/proc/finish_superconduction", function finish_superconduction(f: Frame, temp: Value) {
	temp ??= this.temperature;
	if (!(temp < 303.15)) return f.dot;
	GLOB.SSair.active_super_conductivity -= this;
	return 0;
});

// LINDA_turf_tile.dm:422
rt.def("/turf/open/proc/finish_superconduction", function finish_superconduction(f: Frame) {
	if (!this.blocks_air) {
		this.temperature = this.air.temperature_share(null, this.thermal_conductivity, this.temperature, this.heat_capacity);
	}
	parent_proc(this.blocks_air ? this.temperature : this.air.temperature);
	return f.dot;
});

// LINDA_turf_tile.dm:427
rt.def("/turf/proc/consider_superconductivity", function consider_superconductivity(f: Frame) {
	if (!this.thermal_conductivity) {
		return 0;
	}
	(rt.modField(f, GLOB.SSair, "active_super_conductivity", this, rt.bitOr));
	return 1;
});

// LINDA_turf_tile.dm:434
rt.def("/turf/open/proc/consider_superconductivity", function consider_superconductivity(f: Frame, starting: Value) {
	let $1: any;
	let $0: any = this.air.temperature;
	if (starting) {

		$1 = 493.15;
	} else {
		$1 = 303.15;
	}
	if ($0 < $1) {
		return 0;
	}
	if (this.air.heat_capacity() < 0.519919) {
		return 0;
	}
	return parent_proc();
}, false);

rt.type(4413, "/turf/closed", "/turf", {
	thermite: 0,
	layer: 2.05,
	opacity: 1,
	density: 1,
	blocks_air: 1,
	CanAtmosPass: 0,
});

// LINDA_turf_tile.dm:441
rt.def("/turf/closed/proc/consider_superconductivity", function consider_superconductivity(f: Frame, starting: Value) {
	let $0: any = this.temperature;
	if ($0 < (starting ? 493.15 : 303.15)) {
		return 0;
	}
	return parent_proc();
}, false);

// LINDA_turf_tile.dm:446
rt.def("/turf/proc/radiate_to_spess", function radiate_to_spess(f: Frame) {
	let heat: Value = null;
	if (!(this.temperature > T0C)) return f.dot;
	let delta_temperature: Value = this.temperature_archived - TCMB;
	if (!(this.heat_capacity > 0 && rt.op(f, "Abs", [], [delta_temperature]) > MINIMUM_TEMPERATURE_DELTA_TO_CONSIDER)) return f.dot;
	this.temperature -= (heat = this.thermal_conductivity * delta_temperature * (this.heat_capacity * 700000 / (this.heat_capacity + 700000))) / this.heat_capacity;
	return f.dot;
});

// LINDA_turf_tile.dm:455
rt.def("/turf/open/proc/temperature_share_open_to_solid", function temperature_share_open_to_solid(f: Frame, sharer: Value) {
	sharer.temperature = this.air.temperature_share(null, sharer.thermal_conductivity, sharer.temperature, sharer.heat_capacity);
	return f.dot;
});

// LINDA_turf_tile.dm:458
rt.def("/turf/proc/share_temperature_mutual_solid", function share_temperature_mutual_solid(f: Frame, sharer: Value, conduction_coefficient: Value) {
	let delta_temperature: Value = null, heat: Value = null;
	if (!(rt.op(f, "Abs", [], [(delta_temperature = this.temperature_archived - sharer.temperature_archived)]) > MINIMUM_TEMPERATURE_DELTA_TO_CONSIDER && this.heat_capacity && sharer.heat_capacity)) return f.dot;
	this.temperature -= (heat = conduction_coefficient * delta_temperature * (this.heat_capacity * sharer.heat_capacity / (this.heat_capacity + sharer.heat_capacity))) / this.heat_capacity;
	sharer.temperature += heat / sharer.heat_capacity;
	return f.dot;
});
