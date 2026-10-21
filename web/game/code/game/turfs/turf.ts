// From code/game/turfs/turf.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4412, "/turf", "/atom", {
	intact: 1,
	baseturf: rt.typePath("/turf/open/space"),
	temperature: 293.15,
	to_be_destroyed: 0,
	max_fire_temperature_sustained: 0,
	blocks_air: 0,
	obscured: null,
	blueprint_data: null,
	explosion_level: 0,
	explosion_id: 0,
	decals: null,
	requires_activation: null,
	changing_turf: 0,
	thermal_conductivity: 0.05,
	heat_capacity: 1,
	temperature_archived: null,
	atmos_adjacent_turfs: null,
	atmos_supeconductivity: 0,
	archived_cycle: 0,
	current_cycle: 0,
	initial_gas_mix: "o2=22;n2=82;TEMP=293.15",
	dynamic_lighting: 1,
	lighting_corners_initialised: 0,
	affecting_lights: null,
	lighting_object: null,
	corners: null,
	has_opaque_atom: 0,
	fixed_underlay: null,
	layer: 2,
	icon: rt.rsc("icons/turf/floors.dmi"),
	level: 1,
	flags: 4,
	luminosity: 1,
}, { tmp: ["lighting_corners_initialised","affecting_lights","lighting_object","corners","has_opaque_atom"] });

// /turf/proc/vv_edit_var  (code/game/turfs/turf.dm:29)
rt.def("/turf/proc/vv_edit_var", function vv_edit_var(f: Frame) {
	if (truthy((rt.isIn(f, live(f.args[0]), rt.gl("banned_edits#3")) ? 1 : 0))) {
		return 0;
	}
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["var_name", "new_value"] });

// /turf/proc/Initialize  (code/game/turfs/turf.dm:35)  may sleep
rt.def("/turf/proc/Initialize", function* Initialize(f: Frame) {
	let AM: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [AM, A, $e];
	if (truthy(rt.sv(f, "initialized"))) {
		yield* g.call(f, P("/proc/stack_trace"), null, [fmt("Warning: ＀(＀) initialized multiple times!", [live(f.src), rt.sv(f, "type")])]);
	}
	rt.setSv(f, "initialized", 1);
	yield* g.srcCall(f, "levelupdate");
	if (truthy(rt.sv(f, "smooth"))) {
		yield* g.call(f, P("/proc/queue_smooth"), null, [live(f.src)]);
	}
	yield* g.srcCall(f, "visibilityChanged");
	AM = null;
	rt.forList(f, 0, live(f.src), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		AM = $e;
		yield* g.srcCall(f, "Entered", live(AM));
	}
	rt.endFor(f, 0);
	A = rt.sv(f, "loc");
	if ((!truthy(rt.fv(f, "dynamic_lighting", live(f.src))) && truthy(rt.fv(f, "dynamic_lighting", live(A))))) {
		yield* g.srcCall(f, "add_overlay", T("/obj/effect/fullbright"));
	}
	if (truthy(rt.sv(f, "requires_activation"))) {
		yield* g.srcCall(f, "CalculateAdjacentTurfs");
		yield* g.callName(f, rt.gl("SSair"), "add_to_active", [live(f.src)]);
	}
	if ((truthy(rt.sv(f, "light_power")) && truthy(rt.sv(f, "light_range")))) {
		yield* g.srcCall(f, "update_light");
	}
	if (truthy(rt.sv(f, "opacity"))) {
		rt.setSv(f, "has_opaque_atom", 1);
	}
	return 0;
}, true);

// /turf/proc/Initalize_Atmos  (code/game/turfs/turf.dm:62)
rt.def("/turf/proc/Initalize_Atmos", function Initalize_Atmos(f: Frame, times_fired: Value) {
	rt.callSrc(f, "CalculateAdjacentTurfs", []);
	return f.dot;
});

// /turf/proc/Destroy  (code/game/turfs/turf.dm:66)  may sleep
rt.def("/turf/proc/Destroy", function* Destroy(f: Frame) {
	let B: Value = null, A: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [B, A, I, $e];
	f.dot = 2;
	if (!truthy(rt.sv(f, "changing_turf"))) {
		yield* g.call(f, P("/proc/stack_trace"), null, ["Incorrect turf deletion"]);
	}
	rt.setSv(f, "changing_turf", 0);
	if (truthy(live(f.args[0]))) {
		yield* g.callSuper(f, [], rt.Args.Same);
		B = (yield* g.new_(f, rt.fv(f, "turf", rt.world()), [live(f.src)]));
		A = null;
		rt.forList(f, 0, rt.fv(f, "contents", live(B)));
		while (($e = rt.next(f, 0)) !== undefined) {
			A = $e;
			yield* g.call(f, P("/proc/qdel"), null, [live(A)]);
		}
		rt.endFor(f, 0);
		I = null;
		rt.forList(f, 0, rt.fv(f, "vars", live(B)));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			rt.setAt(rt.fv(f, "vars", live(B)), live(I), null);
		}
		rt.endFor(f, 0);
		return live(f.dot);
	}
	yield* g.callName(f, rt.gl("SSair"), "remove_from_active", [live(f.src)]);
	yield* g.srcCall(f, "visibilityChanged");
	rt.setSv(f, "initialized", 0);
	rt.setSv(f, "requires_activation", 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["force"] });

// /turf/proc/attack_hand  (code/game/turfs/turf.dm:85)  may sleep
rt.def("/turf/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, live(user), "Move_Pulled", [live(f.src)]);
	return f.dot;
}, true);

// /turf/proc/attackby  (code/game/turfs/turf.dm:88)  may sleep
rt.def("/turf/proc/attackby", function* attackby(f: Frame, C: Value, user: Value, params: Value) {
	let coil: Value = null, LC: Value = null;
	let $e: any;
	f.vars = () => [C, user, params, coil, LC, $e];
	if ((truthy((yield* g.srcCall(f, "can_lay_cable"))) && truthy((rt.istype(live(C), T("/obj/item/stack/cable_coil")) ? 1 : 0)))) {
		coil = live(C);
		LC = null;
		rt.forList(f, 0, live(f.src), T("/obj/structure/cable"));
		while (($e = rt.next(f, 0)) !== undefined) {
			LC = $e;
			if ((isEqual(rt.fv(f, "d1", live(LC)), 0) || isEqual(rt.fv(f, "d2", live(LC)), 0))) {
				yield* g.callName(f, live(LC), "attackby", [live(C), live(user)]);
				return live(f.dot);
			}
		}
		rt.endFor(f, 0);
		yield* g.callName(f, live(coil), "place_turf", [live(f.src), live(user)]);
		return 1;
	}
	return 0;
}, true);

// /turf/proc/CanPass  (code/game/turfs/turf.dm:100)  may sleep
rt.def("/turf/proc/CanPass", function* CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	let obstacle: Value = null;
	let $e: any;
	f.vars = () => [mover, target, height, obstacle, $e];
	if (live(height) === null) {
		height = 1.5;
	}
	if (!truthy(live(target))) {
		return 0;
	}
	if (truthy((rt.istype(live(mover), T("/atom/movable")) ? 1 : 0))) {
		return (!truthy(rt.sv(f, "density")) ? 1 : 0);
	}
	if ((truthy(rt.fv(f, "blocks_air", live(target))) || truthy(rt.sv(f, "blocks_air")))) {
		return 0;
	}
	obstacle = null;
	rt.forList(f, 0, live(f.src), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		obstacle = $e;
		if (!truthy((yield* g.callName(f, live(obstacle), "CanPass", [live(mover), live(target), live(height)])))) {
			return 0;
		}
	}
	rt.endFor(f, 0);
	obstacle = null;
	rt.forList(f, 0, live(target), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		obstacle = $e;
		if (!truthy((yield* g.callName(f, live(obstacle), "CanPass", [live(mover), live(f.src), live(height)])))) {
			return 0;
		}
	}
	rt.endFor(f, 0);
	return 1;
}, true);

// /turf/proc/Enter  (code/game/turfs/turf.dm:119)  may sleep
rt.def("/turf/proc/Enter", function* Enter(f: Frame, mover: Value, forget: Value) {
	let obstacle: Value = null, large_dense: Value = null, border_obstacle: Value = null, tompost_bump: Value = null, top_layer: Value = null, obstacle_3: Value = null;
	let $e: any;
	let L: Value = null, sk: Value = null, r: Value = null;
	f.vars = () => [mover, forget, obstacle, large_dense, border_obstacle, tompost_bump, top_layer, obstacle_3, L, sk, r, $e];
	if (!truthy(live(mover))) {
		return 1;
	}
	// stress2c: CheckExit and CanPass only for the atoms where the call can matter (a type with its own CheckExit / CanPass, or
	// a dense atom): hook_list, see src/vm/natives-world.ts. Everything else runs the base proc, which lets the mover go.
	const chk = truthy(rt.call(f, P("/proc/hook_check_mode"), null, []));
	if (truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(mover))]))) && (L = rt.call(f, P("/proc/hook_list"), null, [rt.fv(f, "loc", live(mover)), 4])) !== null) {
		obstacle = null;
		rt.forList(f, 0, live(L), T("/obj"));
		while (($e = rt.next(f, 0)) !== undefined) {
			obstacle = $e;
			sk = (chk ? rt.call(f, P("/proc/hook_skips"), null, [live(obstacle), 4]) : 0);
			r = (yield* g.callName(f, live(obstacle), "CheckExit", [live(mover), live(f.src)]));
			if (chk) rt.call(f, P("/proc/hook_check"), null, [sk, r, 4]);
			if (((!truthy(live(r)) && !isEqual(live(obstacle), live(mover))) && !isEqual(live(obstacle), live(forget)))) {
				yield* g.callName(f, live(mover), "Bump", [live(obstacle), 1]);
				return 0;
			}
		}
		rt.endFor(f, 0);
	}
	large_dense = rt.list();
	border_obstacle = null;
	if ((L = rt.call(f, P("/proc/hook_list"), null, [live(f.src), 5])) !== null) {
		rt.forList(f, 0, live(L), T("/atom/movable"));
		while (($e = rt.next(f, 0)) !== undefined) {
			border_obstacle = $e;
			if (truthy(rt.bitAnd(rt.fv(f, "flags", live(border_obstacle)), 512))) {
				sk = (chk ? rt.call(f, P("/proc/hook_skips"), null, [live(border_obstacle), 5]) : 0);
				r = (yield* g.callName(f, live(border_obstacle), "CanPass", [live(mover), rt.fv(f, "loc", live(mover)), 1]));
				if (chk) rt.call(f, P("/proc/hook_check"), null, [sk, r, 5]);
				if ((!truthy(live(r)) && !isEqual(live(forget), live(border_obstacle)))) {
					yield* g.callName(f, live(mover), "Bump", [live(border_obstacle), 1]);
					return 0;
				}
			} else {
				large_dense = rt.modify(live(large_dense), live(border_obstacle), add);
			}
		}
		rt.endFor(f, 0);
	}
	if (!truthy((yield* g.callName(f, live(f.src), "CanPass", [live(mover), live(f.src)])))) {
		yield* g.callName(f, live(mover), "Bump", [live(f.src), 1]);
		return 0;
	}
	tompost_bump = null;
	top_layer = 0;
	obstacle_3 = null;
	rt.forList(f, 0, live(large_dense), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		obstacle_3 = $e;
		sk = (chk ? rt.call(f, P("/proc/hook_skips"), null, [live(obstacle_3), 5]) : 0);
		r = (yield* g.callName(f, live(obstacle_3), "CanPass", [live(mover), rt.fv(f, "loc", live(mover)), 1]));
		if (chk) rt.call(f, P("/proc/hook_check"), null, [sk, r, 5]);
		if ((!truthy(live(r)) && !isEqual(live(forget), live(obstacle_3)))) {
			if (rt.gt(rt.fv(f, "layer", live(obstacle_3)), live(top_layer))) {
				tompost_bump = live(obstacle_3);
				top_layer = rt.fv(f, "layer", live(obstacle_3));
			}
		}
	}
	rt.endFor(f, 0);
	if (truthy(live(tompost_bump))) {
		yield* g.callName(f, live(mover), "Bump", [live(tompost_bump), 1]);
		return 0;
	}
	return 1;
}, true);

// /turf/proc/Entered  (code/game/turfs/turf.dm:159)
rt.def("/turf/proc/Entered", function Entered(f: Frame, AM: Value) {
	if (!(truthy(rt.sv(f, "explosion_level")) && truthy(rt.callName(f, live(AM), "ex_check", [rt.sv(f, "explosion_id")])))) return f.dot;
	rt.callName(f, live(AM), "ex_act", [rt.sv(f, "explosion_level")]);
	return f.dot;
});

// /turf/open/proc/Entered  (code/game/turfs/turf.dm:163)  may sleep
rt.def("/turf/open/proc/Entered", function* Entered(f: Frame) {
	let M: Value = null, O: Value = null;
	let $0: any;
	f.vars = () => [M, O, $0];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0))) {
		if (truthy(rt.bitAnd(rt.gv(f, "movement_type", (M = live(f.args[0]))), 2))) {
			return live(f.dot);
		}
		$0 = rt.sv(f, "wet");
		if ($0 === 1) {
			if (!truthy((yield* g.callName(f, live(M), "slip", [60, null, 1])))) {
				rt.setFv(f, "inertia_dir", live(M), 0);
			}
		} else if ($0 === 2) {
			if (truthy((yield* g.callName(f, live(M), "slip", [80, null, 6])))) {
				rt.setFv(f, "confused", live(M), (yield* g.call(f, P("/proc/max"), null, [rt.fv(f, "confused", live(M)), 8])));
			}
		} else if ($0 === 3) {
			yield* g.callName(f, live(M), "slip", [120, null, 6]);
		} else if ($0 === 4) {
			yield* g.callName(f, live(M), "slip", [120, null, 12]);
		} else if ($0 === 5) {
			yield* g.callName(f, live(M), "slip", [80, null, 6]);
		}
	}
	if (!((truthy((rt.istype(live(f.args[0]), T("/obj")) ? 1 : 0)) && truthy(rt.sv(f, "air"))) && rt.gt(rt.fv(f, "temperature", rt.sv(f, "air")), 273.1499938964844))) return f.dot;
	if (truthy(rt.gv(f, "secondary_flags", (O = live(f.args[0]))))) {
		$0 = rt.index(rt.fv(f, "secondary_flags", live(O)), "frozen");
	} else {
		$0 = 0;
	}
	if (!truthy($0)) return f.dot;
	yield* g.callName(f, live(O), "make_unfrozen", []);
	return f.dot;
}, true, { args: ["AM"] });

// /turf/proc/levelupdate  (code/game/turfs/turf.dm:192)  may sleep
rt.def("/turf/proc/levelupdate", function* levelupdate(f: Frame) {
	let O: Value = null;
	let $e: any;
	f.vars = () => [O, $e];
	O = null;
	rt.forList(f, 0, live(f.src), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if (isEqual(rt.fv(f, "level", live(O)), 1)) {
			yield* g.callName(f, live(O), "hide", [rt.fv(f, "intact", live(f.src))]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /turf/open/space/proc/levelupdate  (code/game/turfs/turf.dm:198)  may sleep
rt.def("/turf/open/space/proc/levelupdate", function* levelupdate(f: Frame) {
	let O: Value = null;
	let $e: any;
	f.vars = () => [O, $e];
	O = null;
	rt.forList(f, 0, live(f.src), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if (isEqual(rt.fv(f, "level", live(O)), 1)) {
			yield* g.callName(f, live(O), "hide", [0]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /turf/proc/RemoveLattice  (code/game/turfs/turf.dm:204)  may sleep
rt.def("/turf/proc/RemoveLattice", function* RemoveLattice(f: Frame) {
	let L: Value = null;
	f.vars = () => [L];
	if (!truthy((L = rt.locateIn(f, T("/obj/structure/lattice"), live(f.src))))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(L)]);
	return f.dot;
}, true);

// /turf/proc/TerraformTurf  (code/game/turfs/turf.dm:210)  may sleep
rt.def("/turf/proc/TerraformTurf", function* TerraformTurf(f: Frame, path: Value, defer_change: Value, ignore_air: Value) {
	f.vars = () => [path, defer_change, ignore_air];
	if (live(defer_change) === null) {
		defer_change = 0;
	}
	if (live(ignore_air) === null) {
		ignore_air = 0;
	}
	return (yield* g.srcCall(f, "ChangeTurf", live(path), live(defer_change), live(ignore_air)));
}, true);

// /turf/proc/ChangeTurf  (code/game/turfs/turf.dm:214)  may sleep
rt.def("/turf/proc/ChangeTurf", function* ChangeTurf(f: Frame, path: Value, defer_change: Value, ignore_air: Value) {
	let old_baseturf: Value = null, W: Value = null;
	f.vars = () => [path, defer_change, ignore_air, old_baseturf, W];
	if (live(defer_change) === null) {
		defer_change = 0;
	}
	if (live(ignore_air) === null) {
		ignore_air = 0;
	}
	if (!truthy(live(path))) {
		return live(f.dot);
	}
	if ((!truthy(rt.gl("use_preloader")) && isEqual(live(path), rt.sv(f, "type")))) {
		return live(f.src);
	}
	old_baseturf = rt.sv(f, "baseturf");
	rt.setSv(f, "changing_turf", 1);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	rt.setFv(f, "baseturf", (W = (yield* g.new_(f, live(path), [live(f.src)]))), live(old_baseturf));
	if (!truthy(live(defer_change))) {
		yield* g.callName(f, live(W), "AfterChange", [live(ignore_air)]);
	}
	return live(W);
}, true);

// /turf/proc/AfterChange  (code/game/turfs/turf.dm:232)  may sleep
rt.def("/turf/proc/AfterChange", function* AfterChange(f: Frame, ignore_air: Value) {
	let C: Value = null, turfs_to_check: Value = null, I: Value = null, _T: Value = null, FD: Value = null;
	let $e: any;
	f.vars = () => [ignore_air, C, turfs_to_check, I, _T, FD, $e];
	if (live(ignore_air) === null) {
		ignore_air = 0;
	}
	yield* g.srcCall(f, "levelupdate");
	yield* g.srcCall(f, "CalculateAdjacentTurfs");
	if (!truthy((yield* g.srcCall(f, "can_have_cabling")))) {
		C = null;
		rt.forList(f, 0, rt.sv(f, "contents"), T("/obj/structure/cable"));
		while (($e = rt.next(f, 0)) !== undefined) {
			C = $e;
			yield* g.callName(f, live(C), "deconstruct", []);
		}
		rt.endFor(f, 0);
	}
	turfs_to_check = rt.bitOr((yield* g.call(f, P("/proc/get_adjacent_open_turfs"), null, [live(f.src)])), live(f.src));
	I = null;
	rt.forList(f, 0, live(turfs_to_check));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		_T = live(I);
		FD = null;
		rt.forList(f, 1, live(_T), T("/obj/machinery/door/firedoor"));
		while (($e = rt.next(f, 1)) !== undefined) {
			FD = $e;
			yield* g.callName(f, live(FD), "CalculateAffectingAreas", []);
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/queue_smooth_neighbors"), null, [live(f.src)]);
	yield* g.srcCall(f, "HandleTurfChange", live(f.src));
	return f.dot;
}, true);

// /turf/open/proc/AfterChange  (code/game/turfs/turf.dm:251)  may sleep
rt.def("/turf/open/proc/AfterChange", function* AfterChange(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "RemoveLattice");
	if (truthy(live(f.args[0]))) return f.dot;
	yield* g.srcCall(f, "Assimilate_Air");
	return f.dot;
}, true, { args: ["ignore_air"] });

// /turf/open/proc/Assimilate_Air  (code/game/turfs/turf.dm:261)
rt.def("/turf/open/proc/Assimilate_Air", function Assimilate_Air(f: Frame) {
	let total: Value = null, total_gases: Value = null, turf_count: Value = null, _T: Value = null, S: Value = null, S_gases: Value = null, id: Value = null, air_gases: Value = null, id_4: Value = null;
	let $e: any;
	f.vars = () => [total, total_gases, turf_count, _T, S, S_gases, id, air_gases, id_4, $e];
	if (truthy(rt.sv(f, "blocks_air"))) {
		return live(f.dot);
	}
	total = rt.new_(f, T("/datum/gas_mixture"), []);
	total_gases = rt.fv(f, "gases", live(total));
	turf_count = rt.length(rt.sv(f, "atmos_adjacent_turfs"));
	_T = null;
	rt.forList(f, 0, rt.sv(f, "atmos_adjacent_turfs"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		if (!truthy(rt.gv(f, "air", (S = live(_T))))) {
			continue;
		}
		S_gases = rt.gv(f, "gases", rt.fv(f, "air", live(S)));
		id = null;
		rt.forList(f, 1, live(S_gases));
		while (($e = rt.next(f, 1)) !== undefined) {
			id = $e;
			rt.callName(f, live(total), "assert_gas", [live(id)]);
			rt.modAt(rt.index(live(total_gases), live(id)), 1, rt.index(rt.index(live(S_gases), live(id)), 1), add);
		}
		rt.endFor(f, 1);
		rt.modField(f, live(total), "temperature", rt.gv(f, "temperature", rt.fv(f, "air", live(S))), add);
	}
	rt.endFor(f, 0);
	rt.callName(f, rt.sv(f, "air"), "copy_from", [live(total)]);
	if (!truthy(live(turf_count))) {
		return live(f.dot);
	}
	air_gases = rt.fv(f, "gases", rt.sv(f, "air"));
	id_4 = null;
	rt.forList(f, 0, live(air_gases));
	while (($e = rt.next(f, 0)) !== undefined) {
		id_4 = $e;
		(rt.modAt(rt.index(live(air_gases), live(id_4)), 1, live(turf_count), divide));
	}
	rt.endFor(f, 0);
	(rt.modField(f, rt.sv(f, "air"), "temperature", live(turf_count), divide));
	rt.callName(f, rt.gl("SSair"), "add_to_active", [live(f.src)]);
	return f.dot;
});

// /turf/proc/ReplaceWithLattice  (code/game/turfs/turf.dm:288)  may sleep
rt.def("/turf/proc/ReplaceWithLattice", function* ReplaceWithLattice(f: Frame) {
	yield* g.srcCall(f, "ChangeTurf", rt.sv(f, "baseturf"));
	yield* g.new_(f, T("/obj/structure/lattice"), [rt.locate(rt.sv(f, "x"), rt.sv(f, "y"), rt.sv(f, "z"))]);
	return f.dot;
}, true);

// /turf/proc/phase_damage_creatures  (code/game/turfs/turf.dm:292)  may sleep
rt.def("/turf/proc/phase_damage_creatures", function* phase_damage_creatures(f: Frame, damage: Value, U: Value) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [damage, U, M, $e];
	if (live(U) === null) {
		U = null;
	}
	M = null;
	rt.forList(f, 0, live(f.src), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (isEqual(live(M), live(U))) {
			continue;
		}
		yield* g.callName(f, live(M), "adjustBruteLoss", [live(damage)]);
		yield* g.callName(f, live(M), "Unconscious", [multiply(live(damage), 4)]);
	}
	rt.endFor(f, 0);
	M = null;
	rt.forList(f, 0, live(f.src), T("/obj/mecha"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		yield* g.callName(f, live(M), "take_damage", [multiply(live(damage), 2), "brute", "melee", 1]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /turf/proc/Bless  (code/game/turfs/turf.dm:301)
rt.def("/turf/proc/Bless", function Bless(f: Frame) {
	(rt.modSrcVar(f, "flags", 1, rt.bitOr));
	return f.dot;
});

// /turf/proc/storage_contents_dump_act  (code/game/turfs/turf.dm:304)  may sleep
rt.def("/turf/proc/storage_contents_dump_act", function* storage_contents_dump_act(f: Frame, src_object: Value, user: Value) {
	let things: Value = null, progress: Value = null;
	f.vars = () => [src_object, user, things, progress];
	if (truthy(rt.getLen(f, rt.fv(f, "contents", live(src_object))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>You start dumping out the contents...</span>"]);
		if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.usr), null, 20, "target", live(src_object)], rt.Args.Named)))) {
			return 0;
		}
	}
	things = (yield* g.callName(f, rt.fv(f, "contents", live(src_object)), "Copy", []));
	progress = (yield* g.new_(f, T("/datum/progressbar"), [live(user), rt.len(f, live(things)), live(f.src)]));
	while (truthy((yield* g.call(f, P("/proc/do_after"), null, [live(f.usr), 10, 1, live(f.src), 0, (yield* g.new_(f, T("/datum/callback"), [live(src_object), P("/obj/item/weapon/storage/proc/mass_remove_from_storage"), live(f.src), live(things), live(progress)]))])))) {
		yield* g.call(f, P("/proc/sleep"), null, [1]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(progress)]);
	return 1;
}, true);

// /turf/proc/Distance  (code/game/turfs/turf.dm:323)
rt.def("/turf/proc/Distance", function Distance(f: Frame, _T: Value) {
	return rt.call(f, P("/proc/get_dist"), null, [live(f.src), live(_T)]);
}, false, { argTypes: [{ path: "/turf" }] });

// /turf/proc/Distance_cardinal  (code/game/turfs/turf.dm:329)
rt.def("/turf/proc/Distance_cardinal", function Distance_cardinal(f: Frame, _T: Value) {
	if ((!truthy(live(f.src)) || !truthy(live(_T)))) {
		return 0;
	}
	return add(rt.op(f, "Abs", [], [subtract(rt.sv(f, "x"), rt.fv(f, "x", live(_T)))]), rt.op(f, "Abs", [], [subtract(rt.sv(f, "y"), rt.fv(f, "y", live(_T)))]));
}, false, { argTypes: [{ path: "/turf" }] });

// /turf/proc/singularity_act  (code/game/turfs/turf.dm:336)  may sleep
rt.def("/turf/proc/singularity_act", function* singularity_act(f: Frame) {
	let O: Value = null;
	let $e: any;
	f.vars = () => [O, $e];
	if (truthy(rt.sv(f, "intact"))) {
		O = null;
		rt.forList(f, 0, rt.sv(f, "contents"), T("/obj"));
		while (($e = rt.next(f, 0)) !== undefined) {
			O = $e;
			if (!isEqual(rt.fv(f, "level", live(O)), 1)) {
				continue;
			}
			if (isEqual(rt.fv(f, "invisibility", live(O)), 100)) {
				yield* g.callName(f, live(O), "singularity_act", []);
			}
		}
		rt.endFor(f, 0);
	}
	yield* g.srcCall(f, "ChangeTurf", rt.fv(f, "baseturf", live(f.src)));
	return 2;
}, true);

// /turf/proc/can_lay_cable  (code/game/turfs/turf.dm:348)
rt.def("/turf/proc/can_lay_cable", function can_lay_cable(f: Frame) {
	return rt.bitAnd(rt.callSrc(f, "can_have_cabling", []), (!truthy(rt.sv(f, "intact")) ? 1 : 0));
});

// /turf/proc/visibilityChanged  (code/game/turfs/turf.dm:352)
rt.def("/turf/proc/visibilityChanged", function visibilityChanged(f: Frame) {
	if (!truthy(rt.gl("SSticker"))) return f.dot;
	rt.callName(f, rt.gl("cameranet"), "updateVisibility", [live(f.src)]);
	return f.dot;
});

// /turf/proc/contents_explosion  (code/game/turfs/turf.dm:360)  may sleep
rt.def("/turf/proc/contents_explosion", function* contents_explosion(f: Frame, severity: Value, target: Value) {
	let affecting_level: Value = null, V: Value = null, A: Value = null, AM: Value = null;
	let $e: any;
	f.vars = () => [severity, target, affecting_level, V, A, AM, $e];
	affecting_level = null;
	if (isEqual(live(severity), 1)) {
		affecting_level = 1;
	} else {
		if (truthy((yield* g.srcCall(f, "is_shielded")))) {
			affecting_level = 3;
		} else {
			if (truthy(rt.sv(f, "intact"))) {
				affecting_level = 2;
			} else {
				affecting_level = 1;
			}
		}
	}
	V = null;
	rt.forList(f, 0, rt.sv(f, "contents"));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		if (rt.ge(rt.gv(f, "level", (A = live(V))), live(affecting_level))) {
			if (truthy((rt.istype(live(A), T("/atom/movable")) ? 1 : 0))) {
				if (!truthy((yield* g.callName(f, (AM = live(A)), "ex_check", [rt.sv(f, "explosion_id")])))) {
					continue;
				}
			}
			yield* g.callName(f, live(A), "ex_act", [live(severity), live(target)]);
			if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
				yield* g.call(f, P("/proc/stoplag"), null, []);
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /turf/proc/narsie_act  (code/game/turfs/turf.dm:380)  may sleep
rt.def("/turf/proc/narsie_act", function* narsie_act(f: Frame, force: Value, ignore_mobs: Value, probability: Value) {
	let I: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [force, ignore_mobs, probability, I, A, $e];
	if (live(probability) === null) {
		probability = 20;
	}
	f.dot = (rt.op(f, "Prob", [], [live(probability)]) || live(force));
	I = null;
	rt.forList(f, 0, live(f.src));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		A = live(I);
		if ((truthy(live(ignore_mobs)) && truthy((yield* g.call(f, P("/proc/ismob"), null, [live(A)]))))) {
			continue;
		}
		if ((truthy((yield* g.call(f, P("/proc/ismob"), null, [live(A)]))) || truthy(live(f.dot)))) {
			yield* g.callName(f, live(A), "narsie_act", []);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /turf/proc/ratvar_act  (code/game/turfs/turf.dm:389)  may sleep
rt.def("/turf/proc/ratvar_act", function* ratvar_act(f: Frame, force: Value, ignore_mobs: Value, probability: Value) {
	let I: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [force, ignore_mobs, probability, I, A, $e];
	if (live(probability) === null) {
		probability = 40;
	}
	f.dot = (rt.op(f, "Prob", [], [live(probability)]) || live(force));
	I = null;
	rt.forList(f, 0, live(f.src));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		A = live(I);
		if ((truthy(live(ignore_mobs)) && truthy((yield* g.call(f, P("/proc/ismob"), null, [live(A)]))))) {
			continue;
		}
		if ((truthy((yield* g.call(f, P("/proc/ismob"), null, [live(A)]))) || truthy(live(f.dot)))) {
			yield* g.callName(f, live(A), "ratvar_act", []);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /turf/proc/add_blueprints  (code/game/turfs/turf.dm:404)
rt.def("/turf/proc/add_blueprints", function add_blueprints(f: Frame, AM: Value) {
	let I: Value = null;
	f.vars = () => [I];
	rt.setFv(f, "appearance", (I = rt.new_(f, T("/image"), [])), rt.fv(f, "appearance", live(AM)));
	rt.setFv(f, "appearance_flags", live(I), 14);
	rt.setFv(f, "loc", live(I), live(f.src));
	rt.callName(f, live(I), "setDir", [rt.fv(f, "dir", live(AM))]);
	rt.setFv(f, "alpha", live(I), 128);
	if (!truthy(rt.sv(f, "blueprint_data"))) {
		rt.setSv(f, "blueprint_data", rt.list());
	}
	rt.modSrcVar(f, "blueprint_data", live(I), add);
	return f.dot;
});

// /turf/proc/add_blueprints_preround  (code/game/turfs/turf.dm:417)
rt.def("/turf/proc/add_blueprints_preround", function add_blueprints_preround(f: Frame, AM: Value) {
	if (truthy(rt.callName(f, rt.gl("SSticker"), "HasRoundStarted", []))) return f.dot;
	rt.callSrc(f, "add_blueprints", [live(AM)]);
	return f.dot;
});

// /turf/proc/empty  (code/game/turfs/turf.dm:422)  may sleep
rt.def("/turf/proc/empty", function* empty(f: Frame, turf_type: Value) {
	let T0: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [turf_type, T0, A, $e];
	if (live(turf_type) === null) {
		turf_type = T("/turf/open/space");
	}
	T0 = live(f.src);
	A = null;
	rt.forList(f, 0, (yield* g.callName(f, live(T0), "GetAllContents", [])));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (truthy((rt.istype(live(A), T("/mob/dead")) ? 1 : 0))) {
			continue;
		}
		if (truthy((rt.istype(live(A), T("/obj/effect/landmark")) ? 1 : 0))) {
			continue;
		}
		if (truthy((rt.istype(live(A), T("/obj/docking_port")) ? 1 : 0))) {
			continue;
		}
		if (isEqual(live(A), live(T0))) {
			continue;
		}
		yield* g.call(f, P("/proc/qdel"), null, [null, live(A), "force", 1], rt.Args.Named);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, live(T0), "ChangeTurf", [live(turf_type)]);
	yield* g.callName(f, rt.gl("SSair"), "remove_from_active", [live(T0)]);
	yield* g.callName(f, live(T0), "CalculateAdjacentTurfs", []);
	yield* g.callName(f, rt.gl("SSair"), "add_to_active", [live(T0), 1]);
	return f.dot;
}, true);

// /turf/proc/acid_act  (code/game/turfs/turf.dm:446)  may sleep
rt.def("/turf/proc/acid_act", function* acid_act(f: Frame, acidpwr: Value, acid_volume: Value) {
	let acid_type: Value = null, has_acid_effect: Value = null, O: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [acidpwr, acid_volume, acid_type, has_acid_effect, O, A, $e];
	f.dot = 1;
	acid_type = T("/obj/effect/acid");
	if (rt.ge(live(acidpwr), 200)) {
		acid_type = T("/obj/effect/acid/alien");
	}
	has_acid_effect = 0;
	O = null;
	rt.forList(f, 0, live(f.src), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if ((truthy(rt.sv(f, "intact")) && isEqual(rt.fv(f, "level", live(O)), 1))) {
			continue;
		}
		if (truthy(rt.op(f, "IsType", [], [live(O), live(acid_type)]))) {
			rt.setFv(f, "acid_level", (A = live(O)), (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "level", live(A)), multiply(live(acid_volume), live(acidpwr))), 12000])));
			has_acid_effect = 1;
			continue;
		}
		yield* g.callName(f, live(O), "acid_act", [live(acidpwr), live(acid_volume)]);
	}
	rt.endFor(f, 0);
	if (truthy(live(has_acid_effect))) return f.dot;
	yield* g.new_(f, live(acid_type), [live(f.src), live(acidpwr), live(acid_volume)]);
	return f.dot;
}, true);

// /turf/proc/copyTurf  (code/game/turfs/turf.dm:468)  may sleep
rt.def("/turf/proc/copyTurf", function* copyTurf(f: Frame, _T: Value) {
	let O: Value = null, group: Value = null;
	let $e: any;
	f.vars = () => [_T, O, group, $e];
	if (!isEqual(rt.fv(f, "type", live(_T)), rt.sv(f, "type"))) {
		O = null;
		if (truthy(rt.len(f, rt.sv(f, "underlays")))) {
			yield* g.callName(f, rt.gv(f, "underlays", (O = (yield* g.new_(f, T("/obj"), [])))), "Add", [live(_T)]);
		}
		yield* g.callName(f, live(_T), "ChangeTurf", [rt.sv(f, "type")]);
		group = null;
		rt.forList(f, 0, rt.sv(f, "decals"));
		while (($e = rt.next(f, 0)) !== undefined) {
			group = $e;
			yield* g.callName(f, live(_T), "add_decal", [rt.index(rt.sv(f, "decals"), live(group)), live(group)]);
		}
		rt.endFor(f, 0);
		if (truthy(rt.len(f, rt.sv(f, "underlays")))) {
			rt.setFv(f, "underlays", live(_T), rt.fv(f, "underlays", live(O)));
		}
	}
	if (!isEqual(rt.fv(f, "icon_state", live(_T)), rt.sv(f, "icon_state"))) {
		rt.setFv(f, "icon_state", live(_T), rt.sv(f, "icon_state"));
	}
	if (!isEqual(rt.fv(f, "icon", live(_T)), rt.sv(f, "icon"))) {
		rt.setFv(f, "icon", live(_T), rt.sv(f, "icon"));
	}
	if (truthy(rt.sv(f, "color"))) {
		rt.setFv(f, "atom_colours", live(_T), (yield* g.callName(f, rt.sv(f, "atom_colours"), "Copy", [])));
		yield* g.callName(f, live(_T), "update_atom_colour", []);
	}
	if (!isEqual(rt.fv(f, "dir", live(_T)), rt.sv(f, "dir"))) {
		yield* g.callName(f, live(_T), "setDir", [rt.sv(f, "dir")]);
	}
	return live(_T);
}, true);

// /turf/proc/handle_fall  (code/game/turfs/turf.dm:490)
rt.def("/turf/proc/handle_fall", function handle_fall(f: Frame, faller: Value, forced: Value) {
	rt.setFv(f, "lying", live(faller), rt.op(f, "PickUnweighted", [2], [90, 270]));
	if (!truthy(live(forced))) {
		return live(f.dot);
	}
	if (!truthy(rt.callSrc(f, "has_gravity", [live(f.src)]))) return f.dot;
	rt.call(f, P("/proc/playsound"), null, [live(f.src), "bodyfall", 50, 1]);
	return f.dot;
});

// /turf/proc/add_decal  (code/game/turfs/turf.dm:498)
rt.def("/turf/proc/add_decal", function add_decal(f: Frame, decal: Value, group: Value) {
	if (!truthy(rt.sv(f, "decals"))) {
		rt.setSv(f, "decals", rt.list());
	}
	if (!truthy(rt.index(rt.sv(f, "decals"), live(group)))) {
		rt.setAt(rt.sv(f, "decals"), live(group), rt.list());
	}
	rt.modAt(rt.sv(f, "decals"), live(group), live(decal), add);
	rt.callSrc(f, "add_overlay", [rt.index(rt.sv(f, "decals"), live(group))]);
	return f.dot;
});

// /turf/proc/remove_decal  (code/game/turfs/turf.dm:505)
rt.def("/turf/proc/remove_decal", function remove_decal(f: Frame, group: Value) {
	if (!truthy(rt.sv(f, "decals"))) {
		rt.setSv(f, "decals", rt.list());
	}
	rt.callSrc(f, "cut_overlay", [rt.index(rt.sv(f, "decals"), live(group))]);
	rt.setAt(rt.sv(f, "decals"), live(group), null);
	return f.dot;
});

// /turf/proc/photograph  (code/game/turfs/turf.dm:510)
rt.def("/turf/proc/photograph", function photograph(f: Frame, limit: Value) {
	let I: Value = null, V: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [limit, I, V, A, $e];
	if (live(limit) === null) {
		limit = 20;
	}
	rt.modField(f, (I = rt.new_(f, T("/image"), [])), "overlays", live(f.src), add);
	V = null;
	rt.forList(f, 0, rt.sv(f, "contents"));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		if (truthy(rt.gv(f, "invisibility", (A = live(V))))) {
			continue;
		}
		rt.modField(f, live(I), "overlays", live(A), add);
		if (truthy(live(limit))) {
			limit = rt.inc(live(limit), -1);
		} else {
			return live(I);
		}
	}
	rt.endFor(f, 0);
	return live(I);
});
