// From code/modules/mob/living/simple_animal/hostile/stickman.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4990, "/mob/living/simple_animal/hostile/stickman", "/mob/living/simple_animal/hostile", {
	changesummons: rt.typePath("/datum/action/boss/wizard_summon_minions"),
	summoned_by_wizard: 0,
	stat_attack: 1,
	robust_searching: 1,
	check_friendly_fire: 1,
	name: "Angry Stick Man",
	desc: "A being from a realm with only 2 dimensions. At least it's trying to stay faced towards you.",
	icon_state: "stickman",
	icon_living: "stickman",
	icon_dead: "stickman_dead",
	icon_gib: "syndicate_gib",
	gender: "male",
	speak_chance: 0,
	turns_per_move: 5,
	response_help: "pokes",
	response_disarm: "shoves",
	response_harm: "hits",
	speed: 0,
	environment_smash: 0,
	maxHealth: 100,
	health: 100,
	harm_intent_damage: 5,
	obj_damage: 0,
	melee_damage_lower: 10,
	melee_damage_upper: 10,
	attacktext: "punches",
	attack_sound: rt.rsc("sound/weapons/punch1.ogg"),
	a_intent: "harm",
	atmos_requirements: null,
	unsuitable_atmos_damage: 15,
	faction: null,
	status_flags: 8,
});

// /mob/living/simple_animal/hostile/stickman/proc/<init>  (code/modules/mob/living/simple_animal/hostile/stickman.dm:27)
rt.def("/mob/living/simple_animal/hostile/stickman/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "atmos_requirements", rt.alist(f, ["min_oxy", 5, "max_oxy", 0, "min_tox", 0, "max_tox", 1, "min_co2", 0, "max_co2", 5, "min_n2", 0, "max_n2", 0]));
	rt.setSv(f, "faction", rt.list("hostile", "stickman"));
	return f.dot;
});

rt.type(4991, "/mob/living/simple_animal/hostile/stickman/ranged", "/mob/living/simple_animal/hostile/stickman", {
	ranged: 1,
	retreat_distance: 5,
	minimum_distance: 5,
	projectilesound: rt.rsc("sound/misc/bang.ogg"),
	icon_state: "stickmanranged",
	icon_living: "stickmanranged",
	casingtype: rt.typePath("/obj/item/ammo_casing/c45nostamina"),
	loot: null,
});

// /mob/living/simple_animal/hostile/stickman/ranged/proc/<init>  (code/modules/mob/living/simple_animal/hostile/stickman.dm:43)
rt.def("/mob/living/simple_animal/hostile/stickman/ranged/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "loot", rt.list(T("/obj/item/weapon/gun/ballistic/automatic/pistol/stickman")));
	return f.dot;
});

// /mob/living/simple_animal/hostile/stickman/proc/Initialize  (code/modules/mob/living/simple_animal/hostile/stickman.dm:54)  may sleep
rt.def("/mob/living/simple_animal/hostile/stickman/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/effect/temp_visual/paper_scatter"), [live(f.src)]);
	rt.setSv(f, "summoned_by_wizard", live(f.args[1]));
	return f.dot;
}, true, { args: ["mapload", "wizard_summoned"] });

// /mob/living/simple_animal/hostile/stickman/proc/death  (code/modules/mob/living/simple_animal/hostile/stickman.dm:59)  may sleep
rt.def("/mob/living/simple_animal/hostile/stickman/proc/death", function* death(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!isEqual(rt.sv(f, "summoned_by_wizard"), 1)) return f.dot;
	rt.incGl("summoned_minions", -1, true);
	return f.dot;
}, true);
