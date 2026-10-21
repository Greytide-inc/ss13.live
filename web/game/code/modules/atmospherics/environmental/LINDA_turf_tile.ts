// From code/modules/atmospherics/environmental/LINDA_turf_tile.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /turf/open/proc/Initialize  (code/modules/atmospherics/environmental/LINDA_turf_tile.dm:39)  may sleep
rt.def("/turf/open/proc/Initialize", function* Initialize(f: Frame) {
	if (!truthy(rt.sv(f, "blocks_air"))) {
		rt.setSv(f, "air", (yield* g.new_(f, T("/datum/gas_mixture"), [])));
		yield* g.callName(f, rt.sv(f, "air"), "copy_from_turf", [live(f.src)]);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /turf/open/proc/Destroy  (code/modules/atmospherics/environmental/LINDA_turf_tile.dm:46)  may sleep
rt.def("/turf/open/proc/Destroy", function* Destroy(f: Frame) {
	let _T: Value = null;
	let $e: any;
	f.vars = () => [_T, $e];
	if (truthy(rt.sv(f, "active_hotspot"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "active_hotspot")]);
		rt.setSv(f, "active_hotspot", null);
	}
	_T = null;
	rt.forList(f, 0, rt.sv(f, "atmos_adjacent_turfs"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		yield* g.callName(f, rt.gl("SSair"), "add_to_active", [live(_T)]);
	}
	rt.endFor(f, 0);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /turf/open/proc/assume_air  (code/modules/atmospherics/environmental/LINDA_turf_tile.dm:56)
rt.def("/turf/open/proc/assume_air", function assume_air(f: Frame, giver: Value) {
	if (!truthy(live(giver))) {
		return 0;
	}
	rt.callName(f, rt.sv(f, "air"), "merge", [live(giver)]);
	rt.callSrc(f, "update_visuals", []);
	return 1;
});

// /turf/open/proc/remove_air  (code/modules/atmospherics/environmental/LINDA_turf_tile.dm:63)  may sleep
rt.def("/turf/open/proc/remove_air", function* remove_air(f: Frame, amount: Value) {
	let ours: Value = null, removed: Value = null;
	f.vars = () => [amount, ours, removed];
	ours = (yield* g.srcCall(f, "return_air"));
	removed = (yield* g.callName(f, live(ours), "remove", [live(amount)]));
	yield* g.srcCall(f, "update_visuals");
	return live(removed);
}, true);

// /turf/open/proc/copy_air_with_tile  (code/modules/atmospherics/environmental/LINDA_turf_tile.dm:69)
rt.def("/turf/open/proc/copy_air_with_tile", function copy_air_with_tile(f: Frame, _T: Value) {
	if (!truthy((rt.istype(live(_T), T("/turf/open")) ? 1 : 0))) return f.dot;
	rt.callName(f, rt.sv(f, "air"), "copy_from", [rt.fv(f, "air", live(_T))]);
	return f.dot;
});

// /turf/open/proc/copy_air  (code/modules/atmospherics/environmental/LINDA_turf_tile.dm:74)
rt.def("/turf/open/proc/copy_air", function copy_air(f: Frame, copy: Value) {
	if (!truthy(live(copy))) return f.dot;
	rt.callName(f, rt.sv(f, "air"), "copy_from", [live(copy)]);
	return f.dot;
});

// /turf/proc/return_air  (code/modules/atmospherics/environmental/LINDA_turf_tile.dm:77)
rt.def("/turf/proc/return_air", function return_air(f: Frame) {
	let GM: Value = null;
	f.vars = () => [GM];
	rt.callName(f, (GM = rt.new_(f, T("/datum/gas_mixture"), [])), "copy_from_turf", [live(f.src)]);
	return live(GM);
});

// /turf/proc/temperature_expose  (code/modules/atmospherics/environmental/LINDA_turf_tile.dm:85)
rt.def("/turf/proc/temperature_expose", function temperature_expose(f: Frame) {
	if (!rt.gt(rt.sv(f, "temperature"), rt.sv(f, "heat_capacity"))) return f.dot;
	rt.setSv(f, "to_be_destroyed", 1);
	return f.dot;
});

// /turf/proc/archive  (code/modules/atmospherics/environmental/LINDA_turf_tile.dm:89)
rt.def("/turf/proc/archive", function archive(f: Frame) {
	rt.setSv(f, "temperature_archived", rt.sv(f, "temperature"));
	return f.dot;
});

// /turf/open/proc/archive  (code/modules/atmospherics/environmental/LINDA_turf_tile.dm:92)
rt.def("/turf/open/proc/archive", function archive(f: Frame) {
	rt.callName(f, rt.sv(f, "air"), "archive", []);
	rt.setSv(f, "archived_cycle", rt.fv(f, "times_fired", rt.gl("SSair")));
	rt.setSv(f, "temperature_archived", rt.sv(f, "temperature"));
	return f.dot;
});

// /turf/open/proc/update_visuals  (code/modules/atmospherics/environmental/LINDA_turf_tile.dm:99)
rt.def("/turf/open/proc/update_visuals", function update_visuals(f: Frame) {
	let new_overlay_types: Value = null, overlay: Value = null;
	let $e: any;
	f.vars = () => [new_overlay_types, overlay, $e];
	new_overlay_types = rt.callSrc(f, "tile_graphic", []);
	if (truthy(rt.sv(f, "atmos_overlay_types"))) {
		overlay = null;
		rt.forList(f, 0, subtract(rt.sv(f, "atmos_overlay_types"), live(new_overlay_types)));
		while (($e = rt.next(f, 0)) !== undefined) {
			overlay = $e;
			rt.callSrc(f, "cut_overlay", [live(overlay)]);
		}
		rt.endFor(f, 0);
	}
	if (truthy(rt.len(f, live(new_overlay_types)))) {
		if (truthy(rt.sv(f, "atmos_overlay_types"))) {
			rt.callSrc(f, "add_overlay", [subtract(live(new_overlay_types), rt.sv(f, "atmos_overlay_types"))]);
		} else {
			rt.callSrc(f, "add_overlay", [live(new_overlay_types)]);
		}
	}
	if ((truthy(live(new_overlay_types)) && !truthy(rt.len(f, live(new_overlay_types))))) {
		new_overlay_types = null;
	}
	rt.setSv(f, "atmos_overlay_types", live(new_overlay_types));
	return f.dot;
});

// /turf/open/proc/tile_graphic  (code/modules/atmospherics/environmental/LINDA_turf_tile.dm:115)
rt.def("/turf/open/proc/tile_graphic", function tile_graphic(f: Frame) {
	let gases: Value = null, id: Value = null, gas: Value = null, gas_meta: Value = null, gas_overlay: Value = null;
	let $e: any;
	f.vars = () => [gases, id, gas, gas_meta, gas_overlay, $e];
	f.dot = rt.new_(f, T("/list"), []);
	if (!truthy(rt.sv(f, "air"))) return f.dot;
	gases = rt.fv(f, "gases", rt.sv(f, "air"));
	id = null;
	rt.forList(f, 0, live(gases));
	while (($e = rt.next(f, 0)) !== undefined) {
		id = $e;
		gas = rt.index(live(gases), live(id));
		gas_meta = rt.index(live(gas), 3);
		if ((truthy((gas_overlay = rt.index(live(gas_meta), 4))) && rt.gt(rt.index(live(gas), 1), rt.index(live(gas_meta), 3)))) {
			f.dot = rt.modify(live(f.dot), live(gas_overlay), add);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /turf/proc/process_cell  (code/modules/atmospherics/environmental/LINDA_turf_tile.dm:138)
rt.def("/turf/proc/process_cell", function process_cell(f: Frame, fire_count: Value) {
	rt.callName(f, rt.gl("SSair"), "remove_from_active", [live(f.src)]);
	return f.dot;
});

// /turf/open/proc/process_cell  (code/modules/atmospherics/environmental/LINDA_turf_tile.dm:141)  may sleep
rt.def("/turf/open/proc/process_cell", function* process_cell(f: Frame, fire_count: Value) {
	let adjacent_turfs: Value = null, our_excited_group: Value = null, adjacent_turfs_length: Value = null, cached_atmos_cooldown: Value = null, planet_atmos: Value = null, our_air: Value = null, t: Value = null, enemy_tile: Value = null, should_share_air: Value = null, enemy_air: Value = null, enemy_excited_group: Value = null, EG: Value = null, EG_10: Value = null, difference: Value = null, last_share: Value = null, G: Value = null, EG_7: Value = null, last_share_7: Value = null, remove: Value = null;
	let $e: any;
	f.vars = () => [fire_count, adjacent_turfs, our_excited_group, adjacent_turfs_length, cached_atmos_cooldown, planet_atmos, our_air, t, enemy_tile, should_share_air, enemy_air, enemy_excited_group, EG, EG_10, difference, last_share, G, EG_7, last_share_7, remove, $e];
	if (rt.lt(rt.sv(f, "archived_cycle"), live(fire_count))) {
		yield* g.srcCall(f, "archive");
	}
	rt.setSv(f, "current_cycle", live(fire_count));
	adjacent_turfs = rt.sv(f, "atmos_adjacent_turfs");
	our_excited_group = rt.sv(f, "excited_group");
	adjacent_turfs_length = rt.length(live(adjacent_turfs));
	cached_atmos_cooldown = add(rt.sv(f, "atmos_cooldown"), 1);
	if (truthy((planet_atmos = rt.sv(f, "planetary_atmos")))) {
		adjacent_turfs_length = rt.inc(live(adjacent_turfs_length), 1);
	}
	our_air = rt.sv(f, "air");
	t = null;
	rt.forList(f, 0, live(adjacent_turfs));
	while (($e = rt.next(f, 0)) !== undefined) {
		t = $e;
		enemy_tile = live(t);
		if (rt.gt(live(fire_count), rt.fv(f, "current_cycle", live(enemy_tile)))) {
			yield* g.callName(f, live(enemy_tile), "archive", []);
			should_share_air = 0;
			enemy_air = rt.fv(f, "air", live(enemy_tile));
			if (truthy(rt.fv(f, "excited", live(enemy_tile)))) {
				enemy_excited_group = rt.fv(f, "excited_group", live(enemy_tile));
				if (truthy(live(our_excited_group))) {
					if (truthy(live(enemy_excited_group))) {
						if (!isEqual(live(our_excited_group), live(enemy_excited_group))) {
							yield* g.callName(f, live(our_excited_group), "merge_groups", [live(enemy_excited_group)]);
							our_excited_group = rt.sv(f, "excited_group");
						}
						should_share_air = 1;
					} else {
						if (((isEqual(rt.sv(f, "recently_active"), 1) && isEqual(rt.fv(f, "recently_active", live(enemy_tile)), 1)) || truthy((yield* g.callName(f, live(our_air), "compare", [live(enemy_air)]))))) {
							yield* g.callName(f, live(our_excited_group), "add_turf", [live(enemy_tile)]);
							should_share_air = 1;
						}
					}
				} else {
					if (truthy(live(enemy_excited_group))) {
						if (((isEqual(rt.sv(f, "recently_active"), 1) && isEqual(rt.fv(f, "recently_active", live(enemy_tile)), 1)) || truthy((yield* g.callName(f, live(our_air), "compare", [live(enemy_air)]))))) {
							yield* g.callName(f, live(enemy_excited_group), "add_turf", [live(f.src)]);
							our_excited_group = rt.sv(f, "excited_group");
							should_share_air = 1;
						}
					} else {
						if (((isEqual(rt.sv(f, "recently_active"), 1) && isEqual(rt.fv(f, "recently_active", live(enemy_tile)), 1)) || truthy((yield* g.callName(f, live(our_air), "compare", [live(enemy_air)]))))) {
							yield* g.callName(f, (EG = (yield* g.new_(f, T("/datum/excited_group"), []))), "add_turf", [live(f.src)]);
							yield* g.callName(f, live(EG), "add_turf", [live(enemy_tile)]);
							our_excited_group = rt.sv(f, "excited_group");
							should_share_air = 1;
						}
					}
				}
			} else {
				if (truthy((yield* g.callName(f, live(our_air), "compare", [live(enemy_air)])))) {
					yield* g.callName(f, rt.gl("SSair"), "add_to_active", [live(enemy_tile)]);
					if (truthy(live(our_excited_group))) {
						yield* g.callName(f, live(our_excited_group), "add_turf", [live(enemy_tile)]);
					} else {
						yield* g.callName(f, (EG_10 = (yield* g.new_(f, T("/datum/excited_group"), []))), "add_turf", [live(f.src)]);
						yield* g.callName(f, live(EG_10), "add_turf", [live(enemy_tile)]);
						our_excited_group = rt.sv(f, "excited_group");
					}
					should_share_air = 1;
				}
			}
			if (truthy(live(should_share_air))) {
				if (truthy((difference = (yield* g.callName(f, live(our_air), "share", [live(enemy_air), live(adjacent_turfs_length)]))))) {
					if (rt.gt(live(difference), 0)) {
						yield* g.srcCall(f, "consider_pressure_difference", live(enemy_tile), live(difference));
					} else {
						yield* g.callName(f, live(enemy_tile), "consider_pressure_difference", [live(f.src), rt.neg(live(difference))]);
					}
				}
				if (rt.gt((last_share = rt.fv(f, "last_share", live(our_air))), 10.3983793258667)) {
					yield* g.callName(f, live(our_excited_group), "reset_cooldowns", []);
					cached_atmos_cooldown = 0;
				} else {
					if (rt.gt(live(last_share), 0.1039837971329689)) {
						rt.setFv(f, "dismantle_cooldown", live(our_excited_group), 0);
						cached_atmos_cooldown = 0;
					}
				}
			}
		}
	}
	rt.endFor(f, 0);
	if (truthy(live(planet_atmos))) {
		yield* g.callName(f, (G = (yield* g.new_(f, T("/datum/gas_mixture"), []))), "copy_from_turf", [live(f.src)]);
		yield* g.callName(f, live(G), "archive", []);
		if (truthy((yield* g.callName(f, live(our_air), "compare", [live(G)])))) {
			if (!truthy(live(our_excited_group))) {
				yield* g.callName(f, (EG_7 = (yield* g.new_(f, T("/datum/excited_group"), []))), "add_turf", [live(f.src)]);
				our_excited_group = rt.sv(f, "excited_group");
			}
			yield* g.callName(f, live(our_air), "share", [live(G), live(adjacent_turfs_length)]);
			if (rt.gt((last_share_7 = rt.fv(f, "last_share", live(our_air))), 10.3983793258667)) {
				yield* g.callName(f, live(our_excited_group), "reset_cooldowns", []);
				cached_atmos_cooldown = 0;
			} else {
				if (rt.gt(live(last_share_7), 0.1039837971329689)) {
					rt.setFv(f, "dismantle_cooldown", live(our_excited_group), 0);
					cached_atmos_cooldown = 0;
				}
			}
		}
	}
	yield* g.callName(f, live(our_air), "react", [live(f.src)]);
	yield* g.srcCall(f, "update_visuals");
	remove = 1;
	if (rt.gt(rt.fv(f, "temperature", live(our_air)), 493.1499938964844)) {
		if (truthy((yield* g.callSrc(f, "consider_superconductivity", ["starting", 1], rt.Args.Named)))) {
			remove = 0;
		}
	}
	if (((!truthy(live(our_excited_group)) && truthy(live(remove))) || rt.gt(live(cached_atmos_cooldown), 32))) {
		yield* g.callName(f, rt.gl("SSair"), "remove_from_active", [live(f.src)]);
	}
	rt.setSv(f, "atmos_cooldown", live(cached_atmos_cooldown));
	return f.dot;
}, true);

// /turf/open/proc/consider_pressure_difference  (code/modules/atmospherics/environmental/LINDA_turf_tile.dm:249)
// tg_js: every outflow also adds its pull to pressure_pull_x/y, so two pulls at a right angle push diagonally
// (2017 tg kept only the strongest neighbour, so objects staircased towards a breach).
rt.def("/turf/open/proc/consider_pressure_difference", function consider_pressure_difference(f: Frame, _T: Value, difference: Value) {
	let dir: Value = null;
	f.vars = () => [_T, difference, dir];
	(rt.modField(f, rt.gl("SSair"), "high_pressure_delta", live(f.src), rt.bitOr));
	dir = rt.getDir(f, live(f.src), live(_T));
	if (truthy(rt.bitAnd(live(dir), 4))) rt.setSv(f, "pressure_pull_x", add(rt.sv(f, "pressure_pull_x"), live(difference)));
	if (truthy(rt.bitAnd(live(dir), 8))) rt.setSv(f, "pressure_pull_x", subtract(rt.sv(f, "pressure_pull_x"), live(difference)));
	if (truthy(rt.bitAnd(live(dir), 1))) rt.setSv(f, "pressure_pull_y", add(rt.sv(f, "pressure_pull_y"), live(difference)));
	if (truthy(rt.bitAnd(live(dir), 2))) rt.setSv(f, "pressure_pull_y", subtract(rt.sv(f, "pressure_pull_y"), live(difference)));
	if (!rt.gt(live(difference), rt.sv(f, "pressure_difference"))) return f.dot;
	rt.setSv(f, "pressure_direction", live(dir));
	rt.setSv(f, "pressure_difference", live(difference));
	return f.dot;
});

// /turf/open/proc/high_pressure_movements  (code/modules/atmospherics/environmental/LINDA_turf_tile.dm:255)
// tg_js: the push is the summed pull snapped to the nearest of the 8 directions (0.4142 = tan 22.5 degrees);
// pulls that cancel out fall back to the strongest neighbour, as 2017 tg did.
rt.def("/turf/open/proc/high_pressure_movements", function high_pressure_movements(f: Frame) {
	let M: Value = null, x: Value = null, y: Value = null, ax: Value = null, ay: Value = null, dir: Value = null;
	let $e: any;
	f.vars = () => [M, x, y, ax, ay, dir, $e];
	x = rt.sv(f, "pressure_pull_x");
	y = rt.sv(f, "pressure_pull_y");
	rt.setSv(f, "pressure_pull_x", 0);
	rt.setSv(f, "pressure_pull_y", 0);
	ax = rt.lt(live(x), 0) ? rt.neg(live(x)) : live(x);
	ay = rt.lt(live(y), 0) ? rt.neg(live(y)) : live(y);
	dir = 0;
	if (rt.gt(live(ax), multiply(live(ay), 0.4142))) dir = add(live(dir), rt.gt(live(x), 0) ? 4 : 8);
	if (rt.gt(live(ay), multiply(live(ax), 0.4142))) dir = add(live(dir), rt.gt(live(y), 0) ? 1 : 2);
	if (!truthy(live(dir))) dir = rt.sv(f, "pressure_direction");
	M = null;
	rt.forList(f, 0, live(f.src), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		rt.callName(f, live(M), "experience_pressure_difference", [rt.sv(f, "pressure_difference"), live(dir)]);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /atom/movable/proc/experience_pressure_difference  (code/modules/atmospherics/environmental/LINDA_turf_tile.dm:266)  may sleep
rt.def("/atom/movable/proc/experience_pressure_difference", function* experience_pressure_difference(f: Frame, pressure_difference: Value, direction: Value, pressure_resistance_prob_delta: Value) {
	let PROBABILITY_OFFSET: Value = null, PROBABILITY_BASE_PRECENT: Value = null, move_prob: Value = null;
	f.vars = () => [pressure_difference, direction, pressure_resistance_prob_delta, PROBABILITY_OFFSET, PROBABILITY_BASE_PRECENT, move_prob];
	if (live(pressure_resistance_prob_delta) === null) {
		pressure_resistance_prob_delta = 0;
	}
	PROBABILITY_OFFSET = 25;
	PROBABILITY_BASE_PRECENT = 75;
	f.dot = 0;
	if (!(!truthy(rt.sv(f, "anchored")) && !truthy(rt.sv(f, "pulledby")))) return f.dot;
	f.dot = 1;
	if (!rt.lt(rt.sv(f, "last_high_pressure_movement_air_cycle"), rt.fv(f, "times_fired", rt.gl("SSair")))) return f.dot;
	move_prob = 100;
	if (rt.gt(rt.sv(f, "pressure_resistance"), 0)) {
		move_prob = subtract(multiply(divide(live(pressure_difference), rt.sv(f, "pressure_resistance")), 75), 25);
	}
	if (!(rt.gt((move_prob = rt.modify(live(move_prob), live(pressure_resistance_prob_delta), add)), 25) && truthy(rt.op(f, "Prob", [], [live(move_prob)])))) return f.dot;
	yield* g.call(f, P("/proc/step"), null, [live(f.src), live(direction)]);
	rt.setSv(f, "last_high_pressure_movement_air_cycle", rt.fv(f, "times_fired", rt.gl("SSair")));
	return f.dot;
}, true, { waitfor: false });

rt.type(1843, "/datum/excited_group", "/datum", {
	turf_list: null,
	breakdown_cooldown: 0,
	dismantle_cooldown: 0,
});

// /datum/excited_group/proc/<init>  (code/modules/atmospherics/environmental/LINDA_turf_tile.dm:280)
rt.def("/datum/excited_group/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "turf_list", rt.list());
	return f.dot;
});

// /datum/excited_group/proc/add_turf  (code/modules/atmospherics/environmental/LINDA_turf_tile.dm:288)
rt.def("/datum/excited_group/proc/add_turf", function add_turf(f: Frame, _T: Value) {
	rt.modSrcVar(f, "turf_list", live(_T), add);
	rt.setFv(f, "excited_group", live(_T), live(f.src));
	rt.setFv(f, "recently_active", live(_T), 1);
	rt.callSrc(f, "reset_cooldowns", []);
	return f.dot;
});

// /datum/excited_group/proc/merge_groups  (code/modules/atmospherics/environmental/LINDA_turf_tile.dm:294)
rt.def("/datum/excited_group/proc/merge_groups", function merge_groups(f: Frame, E: Value) {
	let t: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [t, _T, $e];
	if (rt.gt(rt.len(f, rt.sv(f, "turf_list")), rt.getLen(f, rt.fv(f, "turf_list", live(E))))) {
		(rt.modField(f, rt.gl("SSair"), "excited_groups", live(E), subtract));
		t = null;
		rt.forList(f, 0, rt.fv(f, "turf_list", live(E)));
		while (($e = rt.next(f, 0)) !== undefined) {
			t = $e;
			rt.setFv(f, "excited_group", (_T = live(t)), live(f.src));
			rt.modSrcVar(f, "turf_list", live(_T), add);
		}
		rt.endFor(f, 0);
		rt.callSrc(f, "reset_cooldowns", []);
	} else {
		(rt.modField(f, rt.gl("SSair"), "excited_groups", live(f.src), subtract));
		t = null;
		rt.forList(f, 0, rt.sv(f, "turf_list"));
		while (($e = rt.next(f, 0)) !== undefined) {
			t = $e;
			rt.setFv(f, "excited_group", (_T = live(t)), live(E));
			rt.modField(f, live(E), "turf_list", live(_T), add);
		}
		rt.endFor(f, 0);
		rt.callName(f, live(E), "reset_cooldowns", []);
	}
	return f.dot;
});

// /datum/excited_group/proc/self_breakdown  (code/modules/atmospherics/environmental/LINDA_turf_tile.dm:315)  may sleep
rt.def("/datum/excited_group/proc/self_breakdown", function* self_breakdown(f: Frame, space_is_all_consuming: Value) {
	let A: Value = null, A_gases: Value = null, turf_list: Value = null, turflen: Value = null, space_in_group: Value = null, t: Value = null, _T: Value = null, id: Value = null;
	let $e: any;
	f.vars = () => [space_is_all_consuming, A, A_gases, turf_list, turflen, space_in_group, t, _T, id, $e];
	if (live(space_is_all_consuming) === null) {
		space_is_all_consuming = 0;
	}
	A = (yield* g.new_(f, T("/datum/gas_mixture"), []));
	A_gases = rt.fv(f, "gases", live(A));
	turf_list = rt.fv(f, "turf_list", live(f.src));
	turflen = rt.len(f, live(turf_list));
	space_in_group = 0;
	t = null;
	rt.forList(f, 0, live(turf_list));
	while (($e = rt.next(f, 0)) !== undefined) {
		t = $e;
		_T = live(t);
		if (((truthy(live(space_is_all_consuming)) && !truthy(live(space_in_group))) && truthy((rt.istype(rt.fv(f, "air", live(_T)), T("/datum/gas_mixture/immutable/space")) ? 1 : 0)))) {
			space_in_group = 1;
			yield* g.call(f, P("/proc/qdel"), null, [live(A)]);
			A = (yield* g.new_(f, T("/datum/gas_mixture/immutable/space"), []));
		}
		yield* g.callName(f, live(A), "merge", [rt.fv(f, "air", live(_T))]);
	}
	rt.endFor(f, 0);
	id = null;
	rt.forList(f, 0, live(A_gases));
	while (($e = rt.next(f, 0)) !== undefined) {
		id = $e;
		rt.setAt(rt.index(live(A_gases), live(id)), 1, divide(rt.index(rt.index(live(A_gases), live(id)), 1), live(turflen)));
	}
	rt.endFor(f, 0);
	t = null;
	rt.forList(f, 0, live(turf_list));
	while (($e = rt.next(f, 0)) !== undefined) {
		t = $e;
		yield* g.callName(f, rt.gv(f, "air", (_T = live(t))), "copy_from", [live(A)]);
		rt.setFv(f, "atmos_cooldown", live(_T), 0);
		yield* g.callName(f, live(_T), "update_visuals", []);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "breakdown_cooldown", 0);
	return f.dot;
}, true);

// /datum/excited_group/proc/dismantle  (code/modules/atmospherics/environmental/LINDA_turf_tile.dm:343)
rt.def("/datum/excited_group/proc/dismantle", function dismantle(f: Frame) {
	let t: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [t, _T, $e];
	t = null;
	rt.forList(f, 0, rt.sv(f, "turf_list"));
	while (($e = rt.next(f, 0)) !== undefined) {
		t = $e;
		rt.setFv(f, "excited", (_T = live(t)), 0);
		rt.setFv(f, "recently_active", live(_T), 0);
		rt.setFv(f, "excited_group", live(_T), null);
		(rt.modField(f, rt.gl("SSair"), "active_turfs", live(_T), subtract));
	}
	rt.endFor(f, 0);
	rt.callSrc(f, "garbage_collect", []);
	return f.dot;
});

// /datum/excited_group/proc/garbage_collect  (code/modules/atmospherics/environmental/LINDA_turf_tile.dm:352)
rt.def("/datum/excited_group/proc/garbage_collect", function garbage_collect(f: Frame) {
	let t: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [t, _T, $e];
	t = null;
	rt.forList(f, 0, rt.sv(f, "turf_list"));
	while (($e = rt.next(f, 0)) !== undefined) {
		t = $e;
		rt.setFv(f, "excited_group", (_T = live(t)), null);
	}
	rt.endFor(f, 0);
	rt.callName(f, rt.sv(f, "turf_list"), "Cut", []);
	(rt.modField(f, rt.gl("SSair"), "excited_groups", live(f.src), subtract));
	return f.dot;
});

// /turf/proc/conductivity_directions  (code/modules/atmospherics/environmental/LINDA_turf_tile.dm:360)
rt.def("/turf/proc/conductivity_directions", function conductivity_directions(f: Frame) {
	if (rt.lt(rt.sv(f, "archived_cycle"), rt.fv(f, "times_fired", rt.gl("SSair")))) {
		rt.callSrc(f, "archive", []);
	}
	return 15;
});

// /turf/open/proc/conductivity_directions  (code/modules/atmospherics/environmental/LINDA_turf_tile.dm:366)
rt.def("/turf/open/proc/conductivity_directions", function conductivity_directions(f: Frame) {
	let direction: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [direction, _T, $e];
	if (truthy(rt.sv(f, "blocks_air"))) {
		return rt.callSuper(f, [], rt.Args.Same);
	}
	direction = null;
	rt.forList(f, 0, rt.gl("cardinal"));
	while (($e = rt.next(f, 0)) !== undefined) {
		direction = $e;
		if ((!truthy((rt.isIn(f, (_T = rt.getStep(f, live(f.src), live(direction))), rt.sv(f, "atmos_adjacent_turfs")) ? 1 : 0)) && !truthy(rt.bitAnd(rt.sv(f, "atmos_supeconductivity"), live(direction))))) {
			(f.dot = rt.modify(live(f.dot), live(direction), rt.bitOr));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /turf/proc/neighbor_conduct_with_src  (code/modules/atmospherics/environmental/LINDA_turf_tile.dm:373)  may sleep
rt.def("/turf/proc/neighbor_conduct_with_src", function* neighbor_conduct_with_src(f: Frame, other: Value) {
	f.vars = () => [other];
	if (!truthy(rt.fv(f, "blocks_air", live(other)))) {
		yield* g.callName(f, live(other), "temperature_share_open_to_solid", [live(f.src)]);
	} else {
		yield* g.callName(f, live(other), "share_temperature_mutual_solid", [live(f.src), rt.sv(f, "thermal_conductivity")]);
	}
	yield* g.srcCall(f, "temperature_expose", null, rt.sv(f, "temperature"), null);
	return f.dot;
}, true);

// /turf/open/proc/neighbor_conduct_with_src  (code/modules/atmospherics/environmental/LINDA_turf_tile.dm:381)  may sleep
rt.def("/turf/open/proc/neighbor_conduct_with_src", function* neighbor_conduct_with_src(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	if (truthy(rt.sv(f, "blocks_air"))) {
		yield* g.callSuper(f, [], rt.Args.Same);
		return live(f.dot);
	}
	if (!truthy(rt.fv(f, "blocks_air", live(f.args[0])))) {
		yield* g.callName(f, rt.gv(f, "air", (_T = live(f.args[0]))), "temperature_share", [rt.sv(f, "air"), 0.10000000149011612]);
	} else {
		yield* g.srcCall(f, "temperature_share_open_to_solid", live(f.args[0]));
	}
	yield* g.callName(f, rt.gl("SSair"), "add_to_active", [live(f.src), 0]);
	return f.dot;
}, true, { args: ["other"] });

// /turf/proc/super_conduct  (code/modules/atmospherics/environmental/LINDA_turf_tile.dm:392)  may sleep
rt.def("/turf/proc/super_conduct", function* super_conduct(f: Frame) {
	let conductivity_directions: Value = null, direction: Value = null, neighbor: Value = null;
	let $e: any;
	f.vars = () => [conductivity_directions, direction, neighbor, $e];
	if (truthy((conductivity_directions = (yield* g.srcCall(f, "conductivity_directions"))))) {
		direction = null;
		rt.forList(f, 0, rt.gl("cardinal"));
		while (($e = rt.next(f, 0)) !== undefined) {
			direction = $e;
			if (truthy(rt.bitAnd(live(conductivity_directions), live(direction)))) {
				if (!truthy(rt.gv(f, "thermal_conductivity", (neighbor = rt.getStep(f, live(f.src), live(direction)))))) {
					continue;
				}
				if (rt.lt(rt.fv(f, "archived_cycle", live(neighbor)), rt.fv(f, "times_fired", rt.gl("SSair")))) {
					yield* g.callName(f, live(neighbor), "archive", []);
				}
				yield* g.callName(f, live(neighbor), "neighbor_conduct_with_src", [live(f.src)]);
				yield* g.callName(f, live(neighbor), "consider_superconductivity", []);
			}
		}
		rt.endFor(f, 0);
	}
	yield* g.srcCall(f, "radiate_to_spess");
	yield* g.srcCall(f, "finish_superconduction");
	return f.dot;
}, true);

// /turf/proc/finish_superconduction  (code/modules/atmospherics/environmental/LINDA_turf_tile.dm:416)
rt.def("/turf/proc/finish_superconduction", function finish_superconduction(f: Frame, temp: Value) {
	f.vars = () => [temp];
	if (live(temp) === null) {
		temp = rt.sv(f, "temperature");
	}
	if (!rt.lt(live(temp), 303.1499938964844)) return f.dot;
	(rt.modField(f, rt.gl("SSair"), "active_super_conductivity", live(f.src), subtract));
	return 0;
});

// /turf/open/proc/finish_superconduction  (code/modules/atmospherics/environmental/LINDA_turf_tile.dm:422)
rt.def("/turf/open/proc/finish_superconduction", function finish_superconduction(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (!truthy(rt.sv(f, "blocks_air"))) {
		rt.setSv(f, "temperature", rt.callName(f, rt.sv(f, "air"), "temperature_share", [null, rt.sv(f, "thermal_conductivity"), rt.sv(f, "temperature"), rt.sv(f, "heat_capacity")]));
	}
	if (truthy(rt.sv(f, "blocks_air"))) {
		$0 = rt.sv(f, "temperature");
	} else {
		$0 = rt.fv(f, "temperature", rt.sv(f, "air"));
	}
	rt.callSuper(f, [$0]);
	return f.dot;
});

// /turf/proc/consider_superconductivity  (code/modules/atmospherics/environmental/LINDA_turf_tile.dm:427)
rt.def("/turf/proc/consider_superconductivity", function consider_superconductivity(f: Frame) {
	if (!truthy(rt.sv(f, "thermal_conductivity"))) {
		return 0;
	}
	(rt.modField(f, rt.gl("SSair"), "active_super_conductivity", live(f.src), rt.bitOr));
	return 1;
});

// /turf/open/proc/consider_superconductivity  (code/modules/atmospherics/environmental/LINDA_turf_tile.dm:434)
rt.def("/turf/open/proc/consider_superconductivity", function consider_superconductivity(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	$0 = rt.fv(f, "temperature", rt.sv(f, "air"));
	if (truthy(live(f.args[0]))) {
		$0 = $0;
		$1 = 493.1499938964844;
	} else {
		$1 = 303.1499938964844;
	}
	if (rt.lt($0, $1)) {
		return 0;
	}
	if (rt.lt(rt.callName(f, rt.sv(f, "air"), "heat_capacity", []), 0.5199189782142639)) {
		return 0;
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["starting"] });

rt.type(4413, "/turf/closed", "/turf", {
	thermite: 0,
	layer: 2.05,
	opacity: 1,
	density: 1,
	blocks_air: 1,
	CanAtmosPass: 0,
});

// /turf/closed/proc/consider_superconductivity  (code/modules/atmospherics/environmental/LINDA_turf_tile.dm:441)
rt.def("/turf/closed/proc/consider_superconductivity", function consider_superconductivity(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	$0 = rt.sv(f, "temperature");
	if (truthy(live(f.args[0]))) {
		$1 = 493.1499938964844;
	} else {
		$1 = 303.1499938964844;
	}
	if (rt.lt($0, $1)) {
		return 0;
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["starting"] });

// /turf/proc/radiate_to_spess  (code/modules/atmospherics/environmental/LINDA_turf_tile.dm:446)
rt.def("/turf/proc/radiate_to_spess", function radiate_to_spess(f: Frame) {
	let delta_temperature: Value = null, heat: Value = null;
	f.vars = () => [delta_temperature, heat];
	if (!rt.gt(rt.sv(f, "temperature"), 273.1499938964844)) return f.dot;
	delta_temperature = subtract(rt.sv(f, "temperature_archived"), 2.700000047683716);
	if (!(rt.gt(rt.sv(f, "heat_capacity"), 0) && rt.gt(rt.op(f, "Abs", [], [live(delta_temperature)]), 0.5))) return f.dot;
	(rt.modSrcVar(f, "temperature", divide((heat = multiply(multiply(rt.sv(f, "thermal_conductivity"), live(delta_temperature)), divide(multiply(rt.sv(f, "heat_capacity"), 700000), add(rt.sv(f, "heat_capacity"), 700000)))), rt.sv(f, "heat_capacity")), subtract));
	return f.dot;
});

// /turf/open/proc/temperature_share_open_to_solid  (code/modules/atmospherics/environmental/LINDA_turf_tile.dm:455)
rt.def("/turf/open/proc/temperature_share_open_to_solid", function temperature_share_open_to_solid(f: Frame, sharer: Value) {
	rt.setFv(f, "temperature", live(sharer), rt.callName(f, rt.sv(f, "air"), "temperature_share", [null, rt.fv(f, "thermal_conductivity", live(sharer)), rt.fv(f, "temperature", live(sharer)), rt.fv(f, "heat_capacity", live(sharer))]));
	return f.dot;
});

// /turf/proc/share_temperature_mutual_solid  (code/modules/atmospherics/environmental/LINDA_turf_tile.dm:458)
rt.def("/turf/proc/share_temperature_mutual_solid", function share_temperature_mutual_solid(f: Frame, sharer: Value, conduction_coefficient: Value) {
	let delta_temperature: Value = null, heat: Value = null;
	f.vars = () => [delta_temperature, heat];
	if (!((rt.gt(rt.op(f, "Abs", [], [(delta_temperature = subtract(rt.sv(f, "temperature_archived"), rt.fv(f, "temperature_archived", live(sharer))))]), 0.5) && truthy(rt.sv(f, "heat_capacity"))) && truthy(rt.fv(f, "heat_capacity", live(sharer))))) return f.dot;
	(rt.modSrcVar(f, "temperature", divide((heat = multiply(multiply(live(conduction_coefficient), live(delta_temperature)), divide(multiply(rt.sv(f, "heat_capacity"), rt.fv(f, "heat_capacity", live(sharer))), add(rt.sv(f, "heat_capacity"), rt.fv(f, "heat_capacity", live(sharer)))))), rt.sv(f, "heat_capacity")), subtract));
	rt.modField(f, live(sharer), "temperature", divide(live(heat), rt.fv(f, "heat_capacity", live(sharer))), add);
	return f.dot;
});
