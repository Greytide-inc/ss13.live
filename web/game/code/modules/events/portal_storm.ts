// From code/modules/events/portal_storm.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(315, "/datum/round_event/portal_storm/syndicate_shocktroop", "/datum/round_event/portal_storm", {
	boss_types: null,
	hostile_types: null,
});

// /datum/round_event/portal_storm/syndicate_shocktroop/proc/<init>  (code/modules/events/portal_storm.dm:9)
rt.def("/datum/round_event/portal_storm/syndicate_shocktroop/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "boss_types", rt.alist(f, [T("/mob/living/simple_animal/hostile/syndicate/melee/space/stormtrooper"), 2]));
	$0 = $0;
	rt.setSv(f, "hostile_types", rt.alist(f, [T("/mob/living/simple_animal/hostile/syndicate/melee/space"), 8, T("/mob/living/simple_animal/hostile/syndicate/ranged/space"), 2]));
	return f.dot;
});

rt.type(316, "/datum/round_event/portal_storm/portal_storm_narsie", "/datum/round_event/portal_storm", {
	boss_types: null,
	hostile_types: null,
});

// /datum/round_event/portal_storm/portal_storm_narsie/proc/<init>  (code/modules/events/portal_storm.dm:20)
rt.def("/datum/round_event/portal_storm/portal_storm_narsie/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "boss_types", rt.alist(f, [T("/mob/living/simple_animal/hostile/construct/builder"), 6]));
	$0 = $0;
	rt.setSv(f, "hostile_types", rt.alist(f, [T("/mob/living/simple_animal/hostile/construct/armored/hostile"), 8, T("/mob/living/simple_animal/hostile/construct/wraith/hostile"), 6]));
	return f.dot;
});

rt.type(314, "/datum/round_event/portal_storm", "/datum/round_event", {
	boss_spawn: null,
	boss_types: null,
	number_of_bosses: null,
	next_boss_spawn: null,
	hostiles_spawn: null,
	hostile_types: null,
	number_of_hostiles: null,
	station_areas: null,
	storm: null,
	startWhen: 7,
	endWhen: 999,
	announceWhen: 1,
});

// /datum/round_event/portal_storm/proc/<init>  (code/modules/events/portal_storm.dm:29)
rt.def("/datum/round_event/portal_storm/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "boss_spawn", rt.list());
	$0 = $0;
	rt.setSv(f, "boss_types", rt.list());
	$0 = $0;
	rt.setSv(f, "hostiles_spawn", rt.list());
	$0 = $0;
	rt.setSv(f, "hostile_types", rt.list());
	$0 = $0;
	rt.setSv(f, "station_areas", rt.list());
	return f.dot;
});

// /datum/round_event/portal_storm/proc/setup  (code/modules/events/portal_storm.dm:40)
rt.def("/datum/round_event/portal_storm/proc/setup", function setup(f: Frame) {
	let boss: Value = null, hostile: Value = null, b_spawns: Value = null, F: Value = null, h_spawns: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [boss, hostile, b_spawns, F, h_spawns, _T, $e];
	rt.setSv(f, "storm", (rt.setSv(f, "storm", rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/obj/tesla_engine/energy_ball.dmi"), "energy_ball_fast", 5]))));
	rt.setFv(f, "color", rt.sv(f, "storm"), "#00FF00");
	rt.setSv(f, "station_areas", rt.call(f, P("/proc/get_areas_in_z"), null, [2]));
	rt.setSv(f, "number_of_bosses", 0);
	boss = null;
	rt.forList(f, 0, rt.sv(f, "boss_types"));
	while (($e = rt.next(f, 0)) !== undefined) {
		boss = $e;
		rt.modSrcVar(f, "number_of_bosses", rt.index(rt.sv(f, "boss_types"), live(boss)), add);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "number_of_hostiles", 0);
	hostile = null;
	rt.forList(f, 0, rt.sv(f, "hostile_types"));
	while (($e = rt.next(f, 0)) !== undefined) {
		hostile = $e;
		rt.modSrcVar(f, "number_of_hostiles", rt.index(rt.sv(f, "hostile_types"), live(hostile)), add);
	}
	rt.endFor(f, 0);
	b_spawns = rt.callName(f, rt.gl("generic_event_spawns"), "Copy", []);
	while (rt.gt(rt.sv(f, "number_of_bosses"), rt.len(f, rt.sv(f, "boss_spawn")))) {
		if (!truthy((F = rt.getStep(f, rt.call(f, P("/proc/pick_n_take"), null, [live(b_spawns)]), 0)))) {
			F = rt.call(f, P("/proc/safepick"), null, [rt.call(f, P("/proc/get_area_turfs"), null, [rt.op(f, "PickUnweighted", [1], [rt.sv(f, "station_areas")])])]);
		}
		rt.modSrcVar(f, "boss_spawn", live(F), add);
	}
	h_spawns = rt.callName(f, rt.gl("generic_event_spawns"), "Copy", []);
	while (rt.gt(rt.sv(f, "number_of_hostiles"), rt.len(f, rt.sv(f, "hostiles_spawn")))) {
		if (!truthy((_T = rt.getStep(f, rt.call(f, P("/proc/pick_n_take"), null, [live(h_spawns)]), 0)))) {
			_T = rt.call(f, P("/proc/safepick"), null, [rt.call(f, P("/proc/get_area_turfs"), null, [rt.op(f, "PickUnweighted", [1], [rt.sv(f, "station_areas")])])]);
		}
		rt.modSrcVar(f, "hostiles_spawn", live(_T), add);
	}
	rt.setSv(f, "next_boss_spawn", add(rt.sv(f, "startWhen"), rt.call(f, P("/proc/Ceiling"), null, [divide(multiply(2, rt.sv(f, "number_of_hostiles")), rt.sv(f, "number_of_bosses"))])));
	return f.dot;
});

// /datum/round_event/portal_storm/proc/announce  (code/modules/events/portal_storm.dm:71)  may sleep
rt.def("/datum/round_event/portal_storm/proc/announce", function* announce(f: Frame) {
	yield* g.call(f, P("/proc/playsound_global"), null, [null, rt.rsc("sound/magic/lightning_chargeup.ogg"), "repeat", 0, "channel", 1, "volume", 100], rt.Args.Named);
	yield* g.call(f, P("/proc/sleep"), null, [80]);
	yield* g.call(f, P("/proc/priority_announce"), null, [fmt("Massive bluespace anomaly detected en route to ＀. Brace for impact.", [(yield* g.call(f, P("/proc/station_name"), null, []))])]);
	yield* g.call(f, P("/proc/sleep"), null, [20]);
	yield* g.call(f, P("/proc/playsound_global"), null, [null, rt.rsc("sound/magic/lightningbolt.ogg"), "repeat", 0, "channel", 1, "volume", 100], rt.Args.Named);
	return f.dot;
}, true, { waitfor: false });

// /datum/round_event/portal_storm/proc/tick  (code/modules/events/portal_storm.dm:78)  may sleep
rt.def("/datum/round_event/portal_storm/proc/tick", function* tick(f: Frame) {
	let type: Value = null;
	f.vars = () => [type];
	yield* g.srcCall(f, "spawn_effects");
	if (truthy((yield* g.srcCall(f, "spawn_hostile")))) {
		type = (yield* g.call(f, P("/proc/safepick"), null, [rt.sv(f, "hostile_types")]));
		rt.setAt(rt.sv(f, "hostile_types"), live(type), subtract(rt.index(rt.sv(f, "hostile_types"), live(type)), 1));
		yield* g.srcCall(f, "spawn_mob", live(type), rt.sv(f, "hostiles_spawn"));
		if (!truthy(rt.index(rt.sv(f, "hostile_types"), live(type)))) {
			(rt.modSrcVar(f, "hostile_types", live(type), subtract));
		}
	}
	if (truthy((yield* g.srcCall(f, "spawn_boss")))) {
		type = (yield* g.call(f, P("/proc/safepick"), null, [rt.sv(f, "boss_types")]));
		rt.setAt(rt.sv(f, "boss_types"), live(type), subtract(rt.index(rt.sv(f, "boss_types"), live(type)), 1));
		yield* g.srcCall(f, "spawn_mob", live(type), rt.sv(f, "boss_spawn"));
		if (!truthy(rt.index(rt.sv(f, "boss_types"), live(type)))) {
			(rt.modSrcVar(f, "boss_types", live(type), subtract));
		}
	}
	yield* g.srcCall(f, "time_to_end");
	return f.dot;
}, true);

// /datum/round_event/portal_storm/proc/spawn_mob  (code/modules/events/portal_storm.dm:97)  may sleep
rt.def("/datum/round_event/portal_storm/proc/spawn_mob", function* spawn_mob(f: Frame, type: Value, spawn_list: Value) {
	let _T: Value = null;
	f.vars = () => [type, spawn_list, _T];
	if (!truthy(live(type))) {
		return live(f.dot);
	}
	if (!truthy((_T = (yield* g.call(f, P("/proc/pick_n_take"), null, [live(spawn_list)]))))) {
		return live(f.dot);
	}
	yield* g.new_(f, live(type), [live(_T)]);
	yield* g.srcCall(f, "spawn_effects", live(_T));
	return f.dot;
}, true);

// /datum/round_event/portal_storm/proc/spawn_effects  (code/modules/events/portal_storm.dm:107)
rt.def("/datum/round_event/portal_storm/proc/spawn_effects", function spawn_effects(f: Frame, _T: Value) {
	let V: Value = null, A: Value = null, F: Value = null;
	let $e: any;
	f.vars = () => [_T, V, A, F, $e];
	if (truthy(live(_T))) {
		_T = rt.getStep(f, live(_T), 10);
		rt.call(f, P("/proc/flick_overlay_static"), null, [rt.sv(f, "storm"), live(_T), 15]);
		rt.call(f, P("/proc/playsound"), null, [live(_T), rt.rsc("sound/magic/lightningbolt.ogg"), 100, 1]);
	} else {
		V = null;
		rt.forList(f, 0, rt.sv(f, "station_areas"));
		while (($e = rt.next(f, 0)) !== undefined) {
			V = $e;
			A = live(V);
			F = rt.getStep(f, rt.op(f, "PickUnweighted", [1], [rt.fv(f, "contents", live(A))]), 0);
			rt.call(f, P("/proc/flick_overlay_static"), null, [rt.sv(f, "storm"), live(F), 15]);
			rt.call(f, P("/proc/playsound"), null, [live(F), rt.rsc("sound/magic/lightningbolt.ogg"), 80, 1]);
		}
		rt.endFor(f, 0);
	}
	return f.dot;
});

// /datum/round_event/portal_storm/proc/spawn_hostile  (code/modules/events/portal_storm.dm:118)
rt.def("/datum/round_event/portal_storm/proc/spawn_hostile", function spawn_hostile(f: Frame) {
	if ((!truthy(rt.sv(f, "hostile_types")) || !truthy(rt.len(f, rt.sv(f, "hostile_types"))))) {
		return 0;
	}
	return rt.call(f, P("/proc/IsMultiple"), null, [rt.sv(f, "activeFor"), 2]);
});

// /datum/round_event/portal_storm/proc/spawn_boss  (code/modules/events/portal_storm.dm:123)
rt.def("/datum/round_event/portal_storm/proc/spawn_boss", function spawn_boss(f: Frame) {
	if ((!truthy(rt.sv(f, "boss_types")) || !truthy(rt.len(f, rt.sv(f, "boss_types"))))) {
		return 0;
	}
	if (!isEqual(rt.sv(f, "activeFor"), rt.sv(f, "next_boss_spawn"))) return f.dot;
	rt.modSrcVar(f, "next_boss_spawn", rt.call(f, P("/proc/Ceiling"), null, [divide(rt.sv(f, "number_of_hostiles"), rt.sv(f, "number_of_bosses"))]), add);
	return 1;
});

// /datum/round_event/portal_storm/proc/time_to_end  (code/modules/events/portal_storm.dm:131)
rt.def("/datum/round_event/portal_storm/proc/time_to_end", function time_to_end(f: Frame) {
	if ((!truthy(rt.len(f, rt.sv(f, "hostile_types"))) && !truthy(rt.len(f, rt.sv(f, "boss_types"))))) {
		rt.setSv(f, "endWhen", rt.sv(f, "activeFor"));
	}
	if (!(!truthy(rt.sv(f, "number_of_hostiles")) && truthy(rt.sv(f, "number_of_bosses")))) return f.dot;
	rt.setSv(f, "endWhen", rt.sv(f, "activeFor"));
	return f.dot;
});
