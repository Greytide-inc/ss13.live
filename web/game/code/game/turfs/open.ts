// From code/game/turfs/open.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4785, "/turf/open/indestructible/sound", "/turf/open/indestructible", {
	sound: null,
	name: "squeeky floor",
});

// /turf/open/indestructible/sound/proc/Entered  (code/game/turfs/open.dm:21)
rt.def("/turf/open/indestructible/sound/proc/Entered", function Entered(f: Frame, AM: Value) {
	if (!truthy((rt.istype(live(AM), T("/mob")) ? 1 : 0))) return f.dot;
	rt.call(f, P("/proc/playsound"), null, [live(f.src), rt.sv(f, "sound"), 50, 1]);
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

// /turf/open/indestructible/necropolis/proc/Initialize  (code/game/turfs/open.dm:33)  may sleep
rt.def("/turf/open/indestructible/necropolis/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.op(f, "Prob", [], [12]))) return f.dot;
	rt.setSv(f, "icon_state", fmt("necro＀", [(yield* g.call(f, P("/proc/rand"), null, [2, 3]))]));
	return f.dot;
}, true);

// /turf/open/proc/Initalize_Atmos  (code/game/turfs/open.dm:69)
rt.def("/turf/open/proc/Initalize_Atmos", function Initalize_Atmos(f: Frame, times_fired: Value) {
	let atmos_adjacent_turfs: Value = null, direction: Value = null, enemy_tile: Value = null, enemy_air: Value = null, is_active: Value = null;
	let $0: any, $e: any;
	f.vars = () => [atmos_adjacent_turfs, direction, enemy_tile, enemy_air, is_active, $0, $e];
	rt.setSv(f, "excited", 0);
	rt.callSrc(f, "update_visuals", []);
	rt.setSv(f, "current_cycle", live(times_fired));
	atmos_adjacent_turfs = rt.fv(f, "atmos_adjacent_turfs", live(f.src));
	direction = null;
	rt.forList(f, 0, rt.gl("cardinal"));
	while (($e = rt.next(f, 0)) !== undefined) {
		direction = $e;
		if (!truthy((rt.istype((enemy_tile = rt.getStep(f, live(f.src), live(direction))), T("/turf/open")) ? 1 : 0))) {
			if (truthy(live(atmos_adjacent_turfs))) {
				(atmos_adjacent_turfs = rt.modify(live(atmos_adjacent_turfs), live(enemy_tile), subtract));
			}
			continue;
		}
		enemy_air = rt.callName(f, live(enemy_tile), "return_air", []);
		if (rt.lt(rt.fv(f, "current_cycle", live(enemy_tile)), live(times_fired))) {
			if (isEqual(rt.fv(f, "CanAtmosPass", live(f.src)), -1)) {
				$0 = rt.callName(f, live(f.src), "CanAtmosPass", [live(enemy_tile)]);
			} else {
				if (isEqual(rt.fv(f, "CanAtmosPass", live(f.src)), -2)) {
					$0 = (!truthy(rt.fv(f, "density", live(f.src))) ? 1 : 0);
				} else {
					$0 = rt.fv(f, "CanAtmosPass", live(f.src));
				}
			}
			if (truthy($0)) {
				if (!truthy(live(atmos_adjacent_turfs))) {
					atmos_adjacent_turfs = rt.list();
				}
				if (!truthy(rt.fv(f, "atmos_adjacent_turfs", live(enemy_tile)))) {
					rt.setFv(f, "atmos_adjacent_turfs", live(enemy_tile), rt.list());
				}
				rt.setAt(live(atmos_adjacent_turfs), live(enemy_tile), 1);
				rt.setAt(rt.fv(f, "atmos_adjacent_turfs", live(enemy_tile)), live(f.src), 1);
			} else {
				if (truthy(live(atmos_adjacent_turfs))) {
					(atmos_adjacent_turfs = rt.modify(live(atmos_adjacent_turfs), live(enemy_tile), subtract));
				}
				if (truthy(rt.fv(f, "atmos_adjacent_turfs", live(enemy_tile)))) {
					(rt.modField(f, live(enemy_tile), "atmos_adjacent_turfs", live(f.src), subtract));
				}
				if ((truthy(rt.fv(f, "atmos_adjacent_turfs", live(enemy_tile))) && !truthy(rt.getLen(f, rt.fv(f, "atmos_adjacent_turfs", live(enemy_tile)))))) {
					rt.setFv(f, "atmos_adjacent_turfs", live(enemy_tile), null);
				}
				continue;
			}
		} else {
			if ((!truthy(live(atmos_adjacent_turfs)) || !truthy(rt.index(live(atmos_adjacent_turfs), live(enemy_tile))))) {
				continue;
			}
		}
		if (truthy((is_active = rt.callName(f, rt.sv(f, "air"), "compare", [live(enemy_air)])))) {
			if (!truthy(rt.sv(f, "excited"))) {
				rt.setSv(f, "excited", 1);
				(rt.modField(f, rt.gl("SSair"), "active_turfs", live(f.src), rt.bitOr));
			}
		}
	}
	rt.endFor(f, 0);
	if ((truthy(live(atmos_adjacent_turfs)) && !truthy(rt.len(f, live(atmos_adjacent_turfs))))) {
		atmos_adjacent_turfs = null;
	}
	if (!truthy(live(atmos_adjacent_turfs))) return f.dot;
	rt.setFv(f, "atmos_adjacent_turfs", live(f.src), live(atmos_adjacent_turfs));
	return f.dot;
});

// /turf/open/proc/GetHeatCapacity  (code/game/turfs/open.dm:115)
rt.def("/turf/open/proc/GetHeatCapacity", function GetHeatCapacity(f: Frame) {
	f.dot = rt.callName(f, rt.sv(f, "air"), "heat_capacity", []);
	return f.dot;
});

// /turf/open/proc/TakeTemperature  (code/game/turfs/open.dm:122)
rt.def("/turf/open/proc/TakeTemperature", function TakeTemperature(f: Frame, temp: Value) {
	rt.modField(f, rt.sv(f, "air"), "temperature", live(temp), add);
	rt.callSrc(f, "air_update_turf", []);
	return f.dot;
});

// /turf/open/proc/freon_gas_act  (code/game/turfs/open.dm:125)  may sleep
rt.def("/turf/open/proc/freon_gas_act", function* freon_gas_act(f: Frame) {
	let I: Value = null, L: Value = null;
	let $0: any, $e: any;
	f.vars = () => [I, L, $0, $e];
	I = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (truthy(rt.fv(f, "secondary_flags", live(I)))) {
			$0 = rt.index(rt.fv(f, "secondary_flags", live(I)), "frozen");
		} else {
			$0 = 0;
		}
		if (!truthy($0)) {
			yield* g.callName(f, live(I), "make_frozen_visual", []);
		}
	}
	rt.endFor(f, 0);
	L = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if (rt.le(rt.fv(f, "bodytemperature", live(L)), 50)) {
			yield* g.callName(f, live(L), "apply_status_effect", [T("/datum/status_effect/freon")]);
		}
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "MakeSlippery", 4, 5);
	return 1;
}, true);

// /turf/open/proc/water_vapor_gas_act  (code/game/turfs/open.dm:135)  may sleep
rt.def("/turf/open/proc/water_vapor_gas_act", function* water_vapor_gas_act(f: Frame) {
	let M: Value = null, O: Value = null, hotspot: Value = null;
	let $e: any;
	f.vars = () => [M, O, hotspot, $e];
	yield* g.callSrc(f, "MakeSlippery", ["min_wet_time", 10, "wet_time_to_add", 5], rt.Args.Named);
	M = null;
	rt.forList(f, 0, live(f.src), T("/mob/living/simple_animal/slime"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		yield* g.callName(f, live(M), "apply_water", []);
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "clean_blood");
	O = null;
	rt.forList(f, 0, live(f.src), T("/obj/effect"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if ((truthy((rt.istype(live(O), T("/obj/effect/decal/cleanable")) ? 1 : 0)) || truthy((rt.istype(live(O), T("/obj/effect/rune")) ? 1 : 0)))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(O)]);
		}
	}
	rt.endFor(f, 0);
	if ((truthy((hotspot = rt.locateIn(f, T("/obj/effect/hotspot"), live(f.src)))) && !truthy((rt.istype(live(f.src), T("/turf/open/space")) ? 1 : 0)))) {
		rt.setFv(f, "temperature", rt.sv(f, "air"), (yield* g.call(f, P("/proc/max"), null, [(yield* g.call(f, P("/proc/min"), null, [subtract(rt.fv(f, "temperature", rt.sv(f, "air")), 2000), divide(rt.fv(f, "temperature", rt.sv(f, "air")), 2)])), 0])));
		yield* g.call(f, P("/proc/qdel"), null, [live(hotspot)]);
	}
	return 1;
}, true);

// /turf/open/proc/handle_slip  (code/game/turfs/open.dm:152)  may sleep
rt.def("/turf/open/proc/handle_slip", function* handle_slip(f: Frame, C: Value, knockdown_amount: Value, O: Value, lube: Value) {
	let buckled_obj: Value = null, I: Value = null, olddir: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [C, knockdown_amount, O, lube, buckled_obj, I, olddir, $0, $1, $2, $e];
	if (truthy(rt.bitAnd(rt.fv(f, "movement_type", live(C)), 2))) {
		return 0;
	}
	if (!truthy((yield* g.srcCall(f, "has_gravity", live(f.src))))) return f.dot;
	buckled_obj = null;
	if (truthy(rt.fv(f, "buckled", live(C)))) {
		buckled_obj = rt.fv(f, "buckled", live(C));
		if (!truthy(rt.bitAnd(live(lube), 4))) {
			return 0;
		}
	} else {
		if ((truthy(rt.fv(f, "lying", live(C))) || !truthy(rt.bitAnd(rt.fv(f, "status_flags", live(C)), 2)))) {
			return 0;
		}
		if ((isEqual(rt.fv(f, "m_intent", live(C)), "walk") && truthy(rt.bitAnd(live(lube), 1)))) {
			return 0;
		}
	}
	if (!truthy(rt.bitAnd(live(lube), 8))) {
		$0 = live(C);
		if (truthy(live(O))) {
			$1 = fmt(" on the ＀", [rt.fv(f, "name", live(O))]);
		} else {
			$1 = "";
		}
		yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You slipped＀!</span>", [$1])]);
		$0 = live(C);
		if (truthy(live(O))) {
			$1 = fmt(" on the ＀", [rt.fv(f, "name", live(O))]);
		} else {
			$1 = "";
		}
		if (truthy(rt.bitAnd(live(lube), 2))) {
			$2 = " (LUBE)";
		} else {
			$2 = "";
		}
		yield* g.callName(f, $0, "log_message", [fmt("<font color='orange'>Slipped＀＀!</font>", [$1, $2]), "Attack log"]);
	}
	if (!truthy(rt.bitAnd(live(lube), 8))) {
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(C)), rt.rsc("sound/misc/slip.ogg"), 50, 1, -3]);
	}
	I = null;
	rt.forList(f, 0, rt.fv(f, "held_items", live(C)), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		yield* g.callName(f, live(C), "accident", [live(I)]);
	}
	rt.endFor(f, 0);
	olddir = rt.fv(f, "dir", live(C));
	if (!truthy(rt.bitAnd(live(lube), 8))) {
		yield* g.callName(f, live(C), "Knockdown", [live(knockdown_amount)]);
		yield* g.callName(f, live(C), "stop_pulling", []);
	} else {
		yield* g.callName(f, live(C), "Stun", [20]);
	}
	if (truthy(live(buckled_obj))) {
		yield* g.callName(f, live(buckled_obj), "unbuckle_mob", [live(C)]);
		(lube = rt.modify(live(lube), 8, rt.bitOr));
	}
	if (truthy(rt.bitAnd(live(lube), 2))) {
		yield* g.new_(f, T("/datum/forced_movement"), [live(C), (yield* g.call(f, P("/proc/get_ranged_target_turf"), null, [live(C), live(olddir), 4])), 1, 0, (yield* g.new_(f, T("/datum/callback"), [live(C), P("/mob/proc/spin"), 1, 1]))]);
	} else {
		if (truthy(rt.bitAnd(live(lube), 8))) {
			yield* g.new_(f, T("/datum/forced_movement"), [live(C), (yield* g.call(f, P("/proc/get_ranged_target_turf"), null, [live(C), live(olddir), 1])), 1, 0]);
		}
	}
	return 1;
}, true);

// /turf/open/proc/MakeSlippery  (code/game/turfs/open.dm:192)  may sleep
rt.def("/turf/open/proc/MakeSlippery", function* MakeSlippery(f: Frame, wet_setting: Value, min_wet_time: Value, wet_time_to_add: Value) {
	let F: Value = null;
	f.vars = () => [wet_setting, min_wet_time, wet_time_to_add, F];
	if (live(wet_setting) === null) {
		wet_setting = 1;
	}
	if (live(min_wet_time) === null) {
		min_wet_time = 0;
	}
	if (live(wet_time_to_add) === null) {
		wet_time_to_add = 0;
	}
	rt.setSv(f, "wet_time", (yield* g.call(f, P("/proc/max"), null, [add(rt.sv(f, "wet_time"), live(wet_time_to_add)), live(min_wet_time)])));
	if (rt.ge(rt.sv(f, "wet"), live(wet_setting))) {
		return live(f.dot);
	}
	rt.setSv(f, "wet", live(wet_setting));
	if (!isEqual(live(wet_setting), 0)) {
		if (truthy(rt.sv(f, "wet_overlay"))) {
			yield* g.srcCall(f, "cut_overlay", rt.sv(f, "wet_overlay"));
		} else {
			rt.setSv(f, "wet_overlay", (yield* g.call(f, P("/proc/mutable_appearance"), null, [])));
		}
		if (truthy((rt.istype((F = live(f.src)), T("/turf/open/floor")) ? 1 : 0))) {
			if (isEqual(live(wet_setting), 4)) {
				rt.setFv(f, "icon", rt.sv(f, "wet_overlay"), rt.rsc("icons/effects/water.dmi"));
				rt.setFv(f, "icon_state", rt.sv(f, "wet_overlay"), "ice_floor");
			} else {
				if (isEqual(live(wet_setting), 3)) {
					rt.setFv(f, "icon", rt.sv(f, "wet_overlay"), rt.rsc("icons/turf/overlays.dmi"));
					rt.setFv(f, "icon_state", rt.sv(f, "wet_overlay"), "snowfloor");
				} else {
					rt.setFv(f, "icon", rt.sv(f, "wet_overlay"), rt.rsc("icons/effects/water.dmi"));
					rt.setFv(f, "icon_state", rt.sv(f, "wet_overlay"), "wet_floor_static");
				}
			}
		} else {
			rt.setFv(f, "icon", rt.sv(f, "wet_overlay"), rt.rsc("icons/effects/water.dmi"));
			rt.setFv(f, "icon_state", rt.sv(f, "wet_overlay"), "wet_static");
		}
		yield* g.srcCall(f, "add_overlay", rt.sv(f, "wet_overlay"));
	}
	yield* g.srcCall(f, "HandleWet");
	return f.dot;
}, true);

// /turf/open/proc/MakeDry  (code/game/turfs/open.dm:219)
rt.def("/turf/open/proc/MakeDry", function MakeDry(f: Frame, wet_setting: Value) {
	f.vars = () => [wet_setting];
	if (live(wet_setting) === null) {
		wet_setting = 1;
	}
	if ((rt.gt(rt.sv(f, "wet"), live(wet_setting)) || !truthy(rt.sv(f, "wet")))) {
		return live(f.dot);
	}
	rt.spawnTail(f, rt.call(f, P("/proc/rand"), null, [0, 20]), "/turf/open/proc/MakeDry: spawn at game/turfs/open.dm:219", wet_setting);
	return f.dot;
});

// a spawn(rt.call(f, P("/proc/rand"), null, [0, 20])) body of /turf/open/proc/MakeDry, a named tail so a world snapshot can hold it while it waits.
rt.tail("/turf/open/proc/MakeDry: spawn at game/turfs/open.dm:219", function* (f: Frame, wet_setting: Value) {
	f.vars = () => [wet_setting];
	if (isEqual(rt.sv(f, "wet"), 4)) {
		rt.setSv(f, "wet", 3);
	} else {
		if (isEqual(rt.sv(f, "wet"), 3)) {
			rt.setSv(f, "wet", 1);
		} else {
			rt.setSv(f, "wet", 0);
			if (truthy(rt.sv(f, "wet_overlay"))) {
				yield* g.srcCall(f, "cut_overlay", rt.sv(f, "wet_overlay"));
			}
		}
	}
	return null;
});

// /turf/open/proc/HandleWet  (code/game/turfs/open.dm:232)  may sleep
rt.def("/turf/open/proc/HandleWet", function* HandleWet(f: Frame) {
	let O: Value = null;
	let $0: any, $e: any;
	f.vars = () => [O, $0, $e];
	if (!truthy(rt.sv(f, "wet"))) {
		return live(f.dot);
	}
	if ((!truthy(rt.sv(f, "wet_time")) && rt.lt(rt.sv(f, "wet"), 3))) {
		yield* g.srcCall(f, "MakeDry", 3);
	}
	if (rt.gt(rt.sv(f, "wet_time"), 300)) {
		rt.setSv(f, "wet_time", 300);
	}
	if ((isEqual(rt.sv(f, "wet"), 3) && rt.gt(rt.fv(f, "temperature", rt.sv(f, "air")), 273.1499938964844))) {
		O = null;
		rt.forList(f, 0, rt.sv(f, "contents"), T("/obj"));
		while (($e = rt.next(f, 0)) !== undefined) {
			O = $e;
			if (truthy(rt.fv(f, "secondary_flags", live(O)))) {
				$0 = rt.index(rt.fv(f, "secondary_flags", live(O)), "frozen");
			} else {
				$0 = 0;
			}
			if (truthy($0)) {
				yield* g.callName(f, live(O), "make_unfrozen", []);
			}
		}
		rt.endFor(f, 0);
		yield* g.srcCall(f, "MakeDry", 3);
		yield* g.srcCall(f, "MakeSlippery", 1);
	}
	if (!isEqual(rt.sv(f, "wet"), 4)) {
		$0 = rt.fv(f, "temperature", rt.sv(f, "air"));
		if (rt.inRange($0, -9.999999848243207e+30, 273.1499938964844)) {
			if ((!isEqual(rt.sv(f, "wet"), 3) && truthy(rt.sv(f, "wet")))) {
				yield* g.srcCall(f, "MakeDry", 3);
				yield* g.srcCall(f, "MakeSlippery", 3);
			}
		} else if (rt.inRange($0, 273.1499938964844, 293.1499938964844)) {
			rt.setSv(f, "wet_time", (yield* g.call(f, P("/proc/max"), null, [0, subtract(rt.sv(f, "wet_time"), 1)])));
		} else if (rt.inRange($0, 293.1499938964844, 313.1499938964844)) {
			rt.setSv(f, "wet_time", (yield* g.call(f, P("/proc/max"), null, [0, subtract(rt.sv(f, "wet_time"), 2)])));
		} else if (rt.inRange($0, 313.1499938964844, 333.1499938964844)) {
			rt.setSv(f, "wet_time", (yield* g.call(f, P("/proc/max"), null, [0, subtract(rt.sv(f, "wet_time"), 3)])));
		} else if (rt.inRange($0, 333.1499938964844, 353.1499938964844)) {
			rt.setSv(f, "wet_time", (yield* g.call(f, P("/proc/max"), null, [0, subtract(rt.sv(f, "wet_time"), 5)])));
		} else if (rt.inRange($0, 353.1499938964844, 373.1499938964844)) {
			rt.setSv(f, "wet_time", (yield* g.call(f, P("/proc/max"), null, [0, subtract(rt.sv(f, "wet_time"), 10)])));
		} else if (rt.inRange($0, 373.1499938964844, 9.999999848243207e+30)) {
			rt.setSv(f, "wet_time", 0);
		}
	} else {
		if (rt.gt((yield* g.srcCall(f, "GetTemperature")), 260.1499938964844)) {
			yield* g.srcCall(f, "MakeDry", 4);
		} else {
			rt.setSv(f, "wet_time", (yield* g.call(f, P("/proc/max"), null, [0, subtract(rt.sv(f, "wet_time"), 5)])));
		}
	}
	if (((truthy(rt.sv(f, "wet")) && rt.lt(rt.sv(f, "wet"), 3)) && !truthy(rt.sv(f, "wet_time")))) {
		yield* g.srcCall(f, "MakeDry", 3);
	}
	if ((!truthy(rt.sv(f, "wet")) && truthy(rt.sv(f, "wet_time")))) {
		rt.setSv(f, "wet_time", 0);
	}
	if (!truthy(rt.sv(f, "wet"))) return f.dot;
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/turf/open/proc/HandleWet")])), 15, 1]);
	return f.dot;
}, true);
