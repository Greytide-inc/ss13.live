// From code/modules/mob/living/simple_animal/hostile/russian.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4980, "/mob/living/simple_animal/hostile/russian", "/mob/living/simple_animal/hostile", {
	name: "Russian",
	desc: "For the Motherland!",
	icon: rt.rsc("icons/mob/simple_human.dmi"),
	icon_state: "russianmelee",
	icon_living: "russianmelee",
	icon_dead: "russianmelee_dead",
	icon_gib: "syndicate_gib",
	speak_chance: 0,
	turns_per_move: 5,
	response_help: "pokes",
	response_disarm: "shoves",
	response_harm: "hits",
	speed: 0,
	maxHealth: 100,
	health: 100,
	harm_intent_damage: 5,
	melee_damage_lower: 15,
	melee_damage_upper: 15,
	attacktext: "punches",
	attack_sound: rt.rsc("sound/weapons/punch1.ogg"),
	a_intent: "harm",
	loot: null,
	atmos_requirements: null,
	unsuitable_atmos_damage: 15,
	faction: null,
	status_flags: 8,
	del_on_death: 1,
});

// /mob/living/simple_animal/hostile/russian/proc/<init>  (code/modules/mob/living/simple_animal/hostile/russian.dm:23)
rt.def("/mob/living/simple_animal/hostile/russian/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "loot", rt.list(T("/obj/effect/mob_spawn/human/corpse/russian"), T("/obj/item/weapon/kitchen/knife")));
	rt.setSv(f, "atmos_requirements", rt.alist(f, ["min_oxy", 5, "max_oxy", 0, "min_tox", 0, "max_tox", 1, "min_co2", 0, "max_co2", 5, "min_n2", 0, "max_n2", 0]));
	$0 = $0;
	rt.setSv(f, "faction", rt.list("russian"));
	return f.dot;
});

rt.type(4981, "/mob/living/simple_animal/hostile/russian/ranged", "/mob/living/simple_animal/hostile/russian", {
	ranged: 1,
	retreat_distance: 5,
	minimum_distance: 5,
	projectilesound: rt.rsc("sound/weapons/gunshot.ogg"),
	icon_state: "russianranged",
	icon_living: "russianranged",
	loot: null,
	casingtype: rt.typePath("/obj/item/ammo_casing/n762"),
});

// /mob/living/simple_animal/hostile/russian/ranged/proc/<init>  (code/modules/mob/living/simple_animal/hostile/russian.dm:35)
rt.def("/mob/living/simple_animal/hostile/russian/ranged/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "loot", rt.list(T("/obj/effect/mob_spawn/human/corpse/russian/ranged"), T("/obj/item/weapon/gun/ballistic/revolver/nagant")));
	return f.dot;
});

rt.type(4982, "/mob/living/simple_animal/hostile/russian/ranged/mosin", "/mob/living/simple_animal/hostile/russian/ranged", {
	loot: null,
	casingtype: rt.typePath("/obj/item/ammo_casing/a762"),
});

// /mob/living/simple_animal/hostile/russian/ranged/mosin/proc/<init>  (code/modules/mob/living/simple_animal/hostile/russian.dm:45)
rt.def("/mob/living/simple_animal/hostile/russian/ranged/mosin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "loot", rt.list(T("/obj/effect/mob_spawn/human/corpse/russian/ranged"), T("/obj/item/weapon/gun/ballistic/shotgun/boltaction")));
	return f.dot;
});

rt.type(4983, "/mob/living/simple_animal/hostile/russian/ranged/trooper", "/mob/living/simple_animal/hostile/russian/ranged", {
	icon_state: "russianrangedelite",
	icon_living: "russianrangedelite",
	maxHealth: 150,
	health: 150,
	casingtype: rt.typePath("/obj/item/ammo_casing/shotgun/buckshot"),
	loot: null,
});

// /mob/living/simple_animal/hostile/russian/ranged/trooper/proc/<init>  (code/modules/mob/living/simple_animal/hostile/russian.dm:55)
rt.def("/mob/living/simple_animal/hostile/russian/ranged/trooper/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "loot", rt.list(T("/obj/effect/mob_spawn/human/corpse/russian/ranged/trooper"), T("/obj/item/weapon/gun/ballistic/shotgun/lethal")));
	return f.dot;
});

rt.type(4984, "/mob/living/simple_animal/hostile/russian/ranged/officer", "/mob/living/simple_animal/hostile/russian/ranged", {
	rapid: 1,
	name: "Russian Officer",
	icon_state: "russianofficer",
	icon_living: "russianofficer",
	maxHealth: 65,
	health: 65,
	casingtype: rt.typePath("/obj/item/ammo_casing/c9mm"),
	loot: null,
});

// /mob/living/simple_animal/hostile/russian/ranged/officer/proc/<init>  (code/modules/mob/living/simple_animal/hostile/russian.dm:66)
rt.def("/mob/living/simple_animal/hostile/russian/ranged/officer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "loot", rt.list(T("/obj/effect/mob_spawn/human/corpse/russian/ranged/officer"), T("/obj/item/weapon/gun/ballistic/automatic/pistol/APS")));
	return f.dot;
});

// /mob/living/simple_animal/hostile/russian/ranged/officer/proc/Aggro  (code/modules/mob/living/simple_animal/hostile/russian.dm:70)  may sleep
rt.def("/mob/living/simple_animal/hostile/russian/ranged/officer/proc/Aggro", function* Aggro(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "summon_backup", 15);
	yield* g.srcCall(f, "say", "V BOJ!!");
	return f.dot;
}, true);
