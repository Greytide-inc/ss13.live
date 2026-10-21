// From code/modules/mob/living/simple_animal/hostile/mining_mobs/mining_mobs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4998, "/mob/living/simple_animal/hostile/asteroid", "/mob/living/simple_animal/hostile", {
	crusher_loot: null,
	throw_message: "bounces off of",
	icon_aggro: null,
	fromtendril: 0,
	vision_range: 2,
	atmos_requirements: null,
	faction: null,
	weather_immunities: null,
	obj_damage: 30,
	environment_smash: 2,
	minbodytemp: 0,
	maxbodytemp: 1e+31,
	response_help: "pokes",
	response_disarm: "shoves",
	response_harm: "strikes",
	status_flags: 0,
	a_intent: "harm",
	see_in_dark: 8,
	lighting_alpha: 128,
	mob_size: 3,
});

// /mob/living/simple_animal/hostile/asteroid/proc/<init>  (code/modules/mob/living/simple_animal/hostile/mining_mobs/mining_mobs.dm:4)
rt.def("/mob/living/simple_animal/hostile/asteroid/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "atmos_requirements", rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]));
	$0 = $0;
	rt.setSv(f, "faction", rt.list("mining"));
	rt.setSv(f, "weather_immunities", rt.list("lava", "ash"));
	return f.dot;
});

// /mob/living/simple_animal/hostile/asteroid/proc/Initialize  (code/modules/mob/living/simple_animal/hostile/mining_mobs/mining_mobs.dm:25)  may sleep
rt.def("/mob/living/simple_animal/hostile/asteroid/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "apply_status_effect", T("/datum/status_effect/crusher_damage"));
	return f.dot;
}, true, { args: ["mapload"] });

// /mob/living/simple_animal/hostile/asteroid/proc/Aggro  (code/modules/mob/living/simple_animal/hostile/mining_mobs/mining_mobs.dm:29)  may sleep
rt.def("/mob/living/simple_animal/hostile/asteroid/proc/Aggro", function* Aggro(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (isEqual(rt.sv(f, "vision_range"), rt.sv(f, "aggro_vision_range"))) return f.dot;
	rt.setSv(f, "icon_state", rt.sv(f, "icon_aggro"));
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/asteroid/proc/LoseAggro  (code/modules/mob/living/simple_animal/hostile/mining_mobs/mining_mobs.dm:34)
rt.def("/mob/living/simple_animal/hostile/asteroid/proc/LoseAggro", function LoseAggro(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (isEqual(rt.sv(f, "stat"), 2)) {
		return live(f.dot);
	}
	rt.setSv(f, "icon_state", rt.sv(f, "icon_living"));
	return f.dot;
});

// /mob/living/simple_animal/hostile/asteroid/proc/bullet_act  (code/modules/mob/living/simple_animal/hostile/mining_mobs/mining_mobs.dm:40)  may sleep
rt.def("/mob/living/simple_animal/hostile/asteroid/proc/bullet_act", function* bullet_act(f: Frame) {
	if (!truthy(rt.sv(f, "stat"))) {
		yield* g.srcCall(f, "Aggro");
	}
	if ((rt.lt(rt.fv(f, "damage", live(f.args[0])), 30) && !isEqual(rt.fv(f, "damage_type", live(f.args[0])), "brute"))) {
		rt.setFv(f, "damage", live(f.args[0]), divide(rt.fv(f, "damage", live(f.args[0])), 3));
		yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ has a reduced effect on ＀!</span>", [live(f.args[0]), live(f.src)]));
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["P"] });

// /mob/living/simple_animal/hostile/asteroid/proc/hitby  (code/modules/mob/living/simple_animal/hostile/mining_mobs/mining_mobs.dm:48)  may sleep
rt.def("/mob/living/simple_animal/hostile/asteroid/proc/hitby", function* hitby(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item")) ? 1 : 0))) {
		_T = live(f.args[0]);
		if (!truthy(rt.sv(f, "stat"))) {
			yield* g.srcCall(f, "Aggro");
		}
		if (rt.le(rt.fv(f, "throwforce", live(_T)), 20)) {
			yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>The ＀ ＀ ＀!</span>", [rt.fv(f, "name", live(_T)), rt.sv(f, "throw_message"), rt.fv(f, "name", live(f.src))]));
			return live(f.dot);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["AM"] });

// /mob/living/simple_animal/hostile/asteroid/proc/death  (code/modules/mob/living/simple_animal/hostile/mining_mobs/mining_mobs.dm:58)  may sleep
rt.def("/mob/living/simple_animal/hostile/asteroid/proc/death", function* death(f: Frame, gibbed: Value) {
	let C: Value = null;
	f.vars = () => [gibbed, C];
	if (((truthy((C = (yield* g.srcCall(f, "has_status_effect", T("/datum/status_effect/crusher_damage"))))) && truthy(rt.sv(f, "crusher_loot"))) && truthy(multiply(rt.op(f, "Prob", [], [divide(rt.fv(f, "total_damage", live(C)), rt.sv(f, "maxHealth"))]), 5)))) {
		yield* g.srcCall(f, "spawn_crusher_loot");
	}
	yield* g.callSuper(f, [live(gibbed)]);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/asteroid/proc/handle_temperature_damage  (code/modules/mob/living/simple_animal/hostile/mining_mobs/mining_mobs.dm:68)  may sleep
rt.def("/mob/living/simple_animal/hostile/asteroid/proc/handle_temperature_damage", function* handle_temperature_damage(f: Frame) {
	if (rt.lt(rt.sv(f, "bodytemperature"), rt.sv(f, "minbodytemp"))) {
		yield* g.srcCall(f, "adjustBruteLoss", 2);
	} else {
		if (!rt.gt(rt.sv(f, "bodytemperature"), rt.sv(f, "maxbodytemp"))) return f.dot;
		yield* g.srcCall(f, "adjustBruteLoss", 20);
	}
	return f.dot;
}, true);
