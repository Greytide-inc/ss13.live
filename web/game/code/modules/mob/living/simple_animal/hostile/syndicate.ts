// From code/modules/mob/living/simple_animal/hostile/syndicate.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4889, "/mob/living/simple_animal/hostile/syndicate", "/mob/living/simple_animal/hostile", {
	name: "Syndicate Operative",
	desc: "Death to Nanotrasen.",
	icon: rt.rsc("icons/mob/simple_human.dmi"),
	icon_state: "syndicate",
	icon_living: "syndicate",
	icon_dead: "syndicate_dead",
	icon_gib: "syndicate_gib",
	speak_chance: 0,
	turns_per_move: 5,
	response_help: "pokes",
	response_disarm: "shoves",
	response_harm: "hits",
	speed: 0,
	stat_attack: 1,
	robust_searching: 1,
	maxHealth: 100,
	health: 100,
	harm_intent_damage: 5,
	melee_damage_lower: 10,
	melee_damage_upper: 10,
	attacktext: "punches",
	attack_sound: rt.rsc("sound/weapons/punch1.ogg"),
	a_intent: "harm",
	loot: null,
	atmos_requirements: null,
	unsuitable_atmos_damage: 15,
	faction: null,
	check_friendly_fire: 1,
	status_flags: 8,
	del_on_death: 1,
});

// /mob/living/simple_animal/hostile/syndicate/proc/<init>  (code/modules/mob/living/simple_animal/hostile/syndicate.dm:36)
rt.def("/mob/living/simple_animal/hostile/syndicate/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "loot", rt.list(T("/obj/effect/mob_spawn/human/corpse/syndicatesoldier")));
	rt.setSv(f, "atmos_requirements", rt.alist(f, ["min_oxy", 5, "max_oxy", 0, "min_tox", 0, "max_tox", 1, "min_co2", 0, "max_co2", 5, "min_n2", 0, "max_n2", 0]));
	$0 = $0;
	rt.setSv(f, "faction", rt.list("syndicate"));
	return f.dot;
});

rt.type(4898, "/mob/living/simple_animal/hostile/syndicate/melee", "/mob/living/simple_animal/hostile/syndicate", {
	melee_damage_lower: 25,
	melee_damage_upper: 30,
	icon_state: "syndicatemelee",
	icon_living: "syndicatemelee",
	loot: null,
	attacktext: "slashes",
	attack_sound: rt.rsc("sound/weapons/bladeslice.ogg"),
	armour_penetration: 28,
	status_flags: 0,
	maxHealth: 170,
	health: 170,
});

// /mob/living/simple_animal/hostile/syndicate/melee/proc/<init>  (code/modules/mob/living/simple_animal/hostile/syndicate.dm:51)
rt.def("/mob/living/simple_animal/hostile/syndicate/melee/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "loot", rt.list(T("/obj/effect/gibspawner/human")));
	return f.dot;
});

// /mob/living/simple_animal/hostile/syndicate/melee/proc/bullet_act  (code/modules/mob/living/simple_animal/hostile/syndicate.dm:60)  may sleep
rt.def("/mob/living/simple_animal/hostile/syndicate/melee/proc/bullet_act", function* bullet_act(f: Frame) {
	if (!truthy(live(f.args[0]))) {
		return live(f.dot);
	}
	if (truthy(rt.op(f, "Prob", [], [50]))) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ blocks ＀ with its shield!</span>", [live(f.src), live(f.args[0])]));
	return 0;
}, true, { args: ["Proj"] });

rt.type(4899, "/mob/living/simple_animal/hostile/syndicate/melee/space", "/mob/living/simple_animal/hostile/syndicate/melee", {
	atmos_requirements: null,
	minbodytemp: 0,
	icon_state: "syndicatemeleespace",
	icon_living: "syndicatemeleespace",
	name: "Syndicate Commando",
	loot: null,
	speed: 1,
});

// /mob/living/simple_animal/hostile/syndicate/melee/space/proc/<init>  (code/modules/mob/living/simple_animal/hostile/syndicate.dm:70)
rt.def("/mob/living/simple_animal/hostile/syndicate/melee/space/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "atmos_requirements", rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]));
	$0 = $0;
	rt.setSv(f, "loot", rt.list(T("/obj/effect/gibspawner/human")));
	return f.dot;
});

rt.type(4900, "/mob/living/simple_animal/hostile/syndicate/melee/space/stormtrooper", "/mob/living/simple_animal/hostile/syndicate/melee/space", {
	icon_state: "syndicatemeleestormtrooper",
	icon_living: "syndicatemeleestormtrooper",
	name: "Syndicate Stormtrooper",
	maxHealth: 340,
	health: 340,
	loot: null,
});

// /mob/living/simple_animal/hostile/syndicate/melee/space/stormtrooper/proc/<init>  (code/modules/mob/living/simple_animal/hostile/syndicate.dm:87)
rt.def("/mob/living/simple_animal/hostile/syndicate/melee/space/stormtrooper/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "loot", rt.list(T("/obj/effect/gibspawner/human")));
	return f.dot;
});

rt.type(4890, "/mob/living/simple_animal/hostile/syndicate/ranged", "/mob/living/simple_animal/hostile/syndicate", {
	ranged: 1,
	rapid: 1,
	retreat_distance: 5,
	minimum_distance: 5,
	icon_state: "syndicateranged",
	icon_living: "syndicateranged",
	casingtype: rt.typePath("/obj/item/ammo_casing/c45nostamina"),
	projectilesound: rt.rsc("sound/weapons/gunshot_smg.ogg"),
	loot: null,
});

// /mob/living/simple_animal/hostile/syndicate/ranged/proc/<init>  (code/modules/mob/living/simple_animal/hostile/syndicate.dm:100)
rt.def("/mob/living/simple_animal/hostile/syndicate/ranged/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "loot", rt.list(T("/obj/effect/gibspawner/human")));
	return f.dot;
});

rt.type(4892, "/mob/living/simple_animal/hostile/syndicate/ranged/space", "/mob/living/simple_animal/hostile/syndicate/ranged", {
	icon_state: "syndicaterangedspace",
	icon_living: "syndicaterangedspace",
	name: "Syndicate Commando",
	atmos_requirements: null,
	minbodytemp: 0,
	speed: 1,
	loot: null,
});

// /mob/living/simple_animal/hostile/syndicate/ranged/space/proc/<init>  (code/modules/mob/living/simple_animal/hostile/syndicate.dm:106)
rt.def("/mob/living/simple_animal/hostile/syndicate/ranged/space/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "atmos_requirements", rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]));
	$0 = $0;
	rt.setSv(f, "loot", rt.list(T("/obj/effect/gibspawner/human")));
	return f.dot;
});

rt.type(4893, "/mob/living/simple_animal/hostile/syndicate/ranged/space/stormtrooper", "/mob/living/simple_animal/hostile/syndicate/ranged/space", {
	icon_state: "syndicaterangedstormtrooper",
	icon_living: "syndicaterangedstormtrooper",
	name: "Syndicate Stormtrooper",
	maxHealth: 200,
	health: 200,
	projectilesound: rt.rsc("sound/weapons/gunshot.ogg"),
	casingtype: rt.typePath("/obj/item/ammo_casing/shotgun/buckshot"),
	loot: null,
});

// /mob/living/simple_animal/hostile/syndicate/ranged/space/stormtrooper/proc/<init>  (code/modules/mob/living/simple_animal/hostile/syndicate.dm:122)
rt.def("/mob/living/simple_animal/hostile/syndicate/ranged/space/stormtrooper/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "loot", rt.list(T("/obj/effect/gibspawner/human")));
	return f.dot;
});

rt.type(4901, "/mob/living/simple_animal/hostile/syndicate/civilian", "/mob/living/simple_animal/hostile/syndicate", {
	minimum_distance: 10,
	retreat_distance: 10,
	obj_damage: 0,
	environment_smash: 0,
});

// /mob/living/simple_animal/hostile/syndicate/civilian/proc/Aggro  (code/modules/mob/living/simple_animal/hostile/syndicate.dm:133)  may sleep
rt.def("/mob/living/simple_animal/hostile/syndicate/civilian/proc/Aggro", function* Aggro(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "summon_backup", 15);
	yield* g.srcCall(f, "say", "GUARDS!!");
	return f.dot;
}, true);

rt.type(4993, "/mob/living/simple_animal/hostile/viscerator", "/mob/living/simple_animal/hostile", {
	pass_flags: 1,
	name: "viscerator",
	desc: "A small, twin-bladed machine capable of inflicting very deadly lacerations.",
	icon_state: "viscerator_attack",
	icon_living: "viscerator_attack",
	health: 25,
	maxHealth: 25,
	melee_damage_lower: 15,
	melee_damage_upper: 15,
	obj_damage: 0,
	environment_smash: 0,
	attacktext: "cuts",
	attack_sound: rt.rsc("sound/weapons/bladeslice.ogg"),
	faction: null,
	atmos_requirements: null,
	minbodytemp: 0,
	mob_size: 0,
	movement_type: 2,
	limb_destroyer: 1,
	speak_emote: null,
	bubble_icon: "syndibot",
	gold_core_spawnable: 1,
	del_on_death: 1,
	deathmessage: "is smashed into pieces!",
});

// /mob/living/simple_animal/hostile/viscerator/proc/<init>  (code/modules/mob/living/simple_animal/hostile/syndicate.dm:152)
rt.def("/mob/living/simple_animal/hostile/viscerator/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "faction", rt.list("syndicate"));
	rt.setSv(f, "atmos_requirements", rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]));
	$0 = $0;
	rt.setSv(f, "speak_emote", rt.list("states"));
	return f.dot;
});
