// From code/modules/mob/living/simple_animal/hostile/alien.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4943, "/mob/living/simple_animal/hostile/alien", "/mob/living/simple_animal/hostile", {
	name: "alien hunter",
	desc: "Hiss!",
	icon: rt.rsc("icons/mob/alien.dmi"),
	icon_state: "alienh",
	icon_living: "alienh",
	icon_dead: "alienh_dead",
	icon_gib: "syndicate_gib",
	gender: "female",
	response_help: "pokes",
	response_disarm: "shoves",
	response_harm: "hits",
	speed: 0,
	butcher_results: null,
	maxHealth: 125,
	health: 125,
	harm_intent_damage: 5,
	obj_damage: 60,
	melee_damage_lower: 25,
	melee_damage_upper: 25,
	attacktext: "slashes",
	speak_emote: null,
	bubble_icon: "alien",
	a_intent: "harm",
	attack_sound: rt.rsc("sound/weapons/bladeslice.ogg"),
	atmos_requirements: null,
	unsuitable_atmos_damage: 15,
	faction: null,
	status_flags: 8,
	minbodytemp: 0,
	see_in_dark: 8,
	lighting_alpha: 128,
	unique_name: 1,
	gold_core_spawnable: 0,
	death_sound: rt.rsc("sound/voice/hiss6.ogg"),
	deathmessage: "lets out a waning guttural screech, green blood bubbling from its maw...",
});

// /mob/living/simple_animal/hostile/alien/proc/<init>  (code/modules/mob/living/simple_animal/hostile/alien.dm:14)
rt.def("/mob/living/simple_animal/hostile/alien/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "butcher_results", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/xeno"), 4, T("/obj/item/stack/sheet/animalhide/xeno"), 1]));
	$0 = $0;
	rt.setSv(f, "speak_emote", rt.list("hisses"));
	rt.setSv(f, "atmos_requirements", rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]));
	$0 = $0;
	rt.setSv(f, "faction", rt.list("alien"));
	return f.dot;
});

rt.type(4944, "/mob/living/simple_animal/hostile/alien/drone", "/mob/living/simple_animal/hostile/alien", {
	plant_cooldown: 30,
	plants_off: 0,
	name: "alien drone",
	icon_state: "aliend",
	icon_living: "aliend",
	icon_dead: "aliend_dead",
	melee_damage_lower: 15,
	melee_damage_upper: 15,
});

// /mob/living/simple_animal/hostile/alien/drone/proc/handle_automated_action  (code/modules/mob/living/simple_animal/hostile/alien.dm:50)  may sleep
rt.def("/mob/living/simple_animal/hostile/alien/drone/proc/handle_automated_action", function* handle_automated_action(f: Frame) {
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	rt.incSrcVar(f, "plant_cooldown", -1, true);
	if (!isEqual(rt.sv(f, "AIStatus"), 2)) return f.dot;
	if (!((!truthy(rt.sv(f, "plants_off")) && truthy(rt.op(f, "Prob", [], [10]))) && rt.le(rt.sv(f, "plant_cooldown"), 0))) return f.dot;
	rt.setSv(f, "plant_cooldown", rt.initial(f, live(f.src), "plant_cooldown"));
	yield* g.srcCall(f, "SpreadPlants");
	return f.dot;
}, true, { waitfor: false });

rt.type(4946, "/mob/living/simple_animal/hostile/alien/queen", "/mob/living/simple_animal/hostile/alien", {
	sterile: 1,
	plants_off: 0,
	egg_cooldown: 30,
	plant_cooldown: 30,
	name: "alien queen",
	icon_state: "alienq",
	icon_living: "alienq",
	icon_dead: "alienq_dead",
	health: 250,
	maxHealth: 250,
	melee_damage_lower: 15,
	melee_damage_upper: 15,
	ranged: 1,
	retreat_distance: 5,
	minimum_distance: 5,
	move_to_delay: 4,
	butcher_results: null,
	projectiletype: rt.typePath("/obj/item/projectile/neurotox"),
	projectilesound: rt.rsc("sound/weapons/pierce.ogg"),
	status_flags: 0,
	unique_name: 0,
});

// /mob/living/simple_animal/hostile/alien/queen/proc/<init>  (code/modules/mob/living/simple_animal/hostile/alien.dm:87)
rt.def("/mob/living/simple_animal/hostile/alien/queen/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "butcher_results", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/xeno"), 4, T("/obj/item/stack/sheet/animalhide/xeno"), 1]));
	return f.dot;
});

// /mob/living/simple_animal/hostile/alien/queen/proc/handle_automated_action  (code/modules/mob/living/simple_animal/hostile/alien.dm:99)  may sleep
rt.def("/mob/living/simple_animal/hostile/alien/queen/proc/handle_automated_action", function* handle_automated_action(f: Frame) {
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	rt.incSrcVar(f, "egg_cooldown", -1, true);
	rt.incSrcVar(f, "plant_cooldown", -1, true);
	if (!isEqual(rt.sv(f, "AIStatus"), 2)) return f.dot;
	if (((!truthy(rt.sv(f, "plants_off")) && truthy(rt.op(f, "Prob", [], [10]))) && rt.le(rt.sv(f, "plant_cooldown"), 0))) {
		rt.setSv(f, "plant_cooldown", rt.initial(f, live(f.src), "plant_cooldown"));
		yield* g.srcCall(f, "SpreadPlants");
	}
	if (!((!truthy(rt.sv(f, "sterile")) && truthy(rt.op(f, "Prob", [], [10]))) && rt.le(rt.sv(f, "egg_cooldown"), 0))) return f.dot;
	rt.setSv(f, "egg_cooldown", rt.initial(f, live(f.src), "egg_cooldown"));
	yield* g.srcCall(f, "LayEggs");
	return f.dot;
}, true, { waitfor: false });

// /mob/living/simple_animal/hostile/alien/proc/SpreadPlants  (code/modules/mob/living/simple_animal/hostile/alien.dm:112)  may sleep
rt.def("/mob/living/simple_animal/hostile/alien/proc/SpreadPlants", function* SpreadPlants(f: Frame) {
	if ((!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")]))) || truthy((rt.istype(rt.sv(f, "loc"), T("/turf/open/space")) ? 1 : 0)))) {
		return live(f.dot);
	}
	if (truthy(rt.locateIn(f, T("/obj/structure/alien/weeds/node"), rt.getStep(f, live(f.src), 0)))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "visible_message", fmt("<span class='alertalien'>＀ has planted some alien weeds!</span>", [live(f.src)]));
	yield* g.new_(f, T("/obj/structure/alien/weeds/node"), [rt.sv(f, "loc")]);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/alien/proc/LayEggs  (code/modules/mob/living/simple_animal/hostile/alien.dm:120)  may sleep
rt.def("/mob/living/simple_animal/hostile/alien/proc/LayEggs", function* LayEggs(f: Frame) {
	if ((!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")]))) || truthy((rt.istype(rt.sv(f, "loc"), T("/turf/open/space")) ? 1 : 0)))) {
		return live(f.dot);
	}
	if (truthy(rt.locateIn(f, T("/obj/structure/alien/egg"), rt.getStep(f, live(f.src), 0)))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "visible_message", fmt("<span class='alertalien'>＀ has laid an egg!</span>", [live(f.src)]));
	yield* g.new_(f, T("/obj/structure/alien/egg"), [rt.sv(f, "loc")]);
	return f.dot;
}, true);

rt.type(4947, "/mob/living/simple_animal/hostile/alien/queen/large", "/mob/living/simple_animal/hostile/alien/queen", {
	name: "alien empress",
	icon: rt.rsc("icons/mob/alienqueen.dmi"),
	icon_state: "alienq",
	icon_living: "alienq",
	icon_dead: "alienq_dead",
	bubble_icon: "alienroyal",
	move_to_delay: 4,
	maxHealth: 400,
	health: 400,
	butcher_results: null,
	mob_size: 3,
	gold_core_spawnable: 0,
});

// /mob/living/simple_animal/hostile/alien/queen/large/proc/<init>  (code/modules/mob/living/simple_animal/hostile/alien.dm:137)
rt.def("/mob/living/simple_animal/hostile/alien/queen/large/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "butcher_results", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/xeno"), 10, T("/obj/item/stack/sheet/animalhide/xeno"), 2]));
	return f.dot;
});

// /mob/living/simple_animal/hostile/alien/proc/handle_temperature_damage  (code/modules/mob/living/simple_animal/hostile/alien.dm:148)  may sleep
rt.def("/mob/living/simple_animal/hostile/alien/proc/handle_temperature_damage", function* handle_temperature_damage(f: Frame) {
	if (rt.lt(rt.sv(f, "bodytemperature"), rt.sv(f, "minbodytemp"))) {
		yield* g.srcCall(f, "adjustBruteLoss", 2);
	} else {
		if (!rt.gt(rt.sv(f, "bodytemperature"), rt.sv(f, "maxbodytemp"))) return f.dot;
		yield* g.srcCall(f, "adjustBruteLoss", 20);
	}
	return f.dot;
}, true);

rt.type(4948, "/mob/living/simple_animal/hostile/alien/maid", "/mob/living/simple_animal/hostile/alien", {
	name: "lusty xenomorph maid",
	melee_damage_lower: 0,
	melee_damage_upper: 0,
	a_intent: "help",
	friendly: "caresses",
	obj_damage: 0,
	environment_smash: 0,
	gold_core_spawnable: 1,
	icon_state: "maid",
	icon_living: "maid",
	icon_dead: "maid_dead",
});

// /mob/living/simple_animal/hostile/alien/maid/proc/AttackingTarget  (code/modules/mob/living/simple_animal/hostile/alien.dm:168)  may sleep
rt.def("/mob/living/simple_animal/hostile/alien/maid/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if (!truthy((rt.istype(rt.sv(f, "target"), T("/atom/movable")) ? 1 : 0))) return f.dot;
	if (truthy((rt.istype(rt.sv(f, "target"), T("/obj/effect/decal/cleanable")) ? 1 : 0))) {
		yield* g.srcCall(f, "visible_message", fmt("＀ cleans up ％！.", [live(f.src), rt.sv(f, "target")]));
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "target")]);
		return 1;
	}
	yield* g.callName(f, (M = rt.sv(f, "target")), "clean_blood", []);
	yield* g.srcCall(f, "visible_message", fmt("＀ polishes ％！.", [live(f.src), rt.sv(f, "target")]));
	return 1;
}, true);
