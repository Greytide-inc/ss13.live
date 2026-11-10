// Based on /tg/station's code/modules/mob/living/simple_animal/hostile/nanotrasen.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4973, "/mob/living/simple_animal/hostile/nanotrasen", "/mob/living/simple_animal/hostile", {
	stat_attack: 1,
	robust_searching: 1,
	search_objects: 1,
	name: "Nanotrasen Private Security Officer",
	desc: "An officer part of Nanotrasen's private security force, he seems rather unpleased to meet you.",
	icon: rt.rsc("icons/mob/simple_human.dmi"),
	icon_state: "nanotrasen",
	icon_living: "nanotrasen",
	icon_dead: null,
	icon_gib: "syndicate_gib",
	speak_chance: 12,
	turns_per_move: 5,
	response_help: "pokes",
	response_disarm: "shoves",
	response_harm: "hits",
	speed: 0,
	maxHealth: 100,
	health: 100,
	harm_intent_damage: 5,
	melee_damage_lower: 10,
	melee_damage_upper: 15,
	attacktext: "punches",
	attack_sound: rt.rsc("sound/weapons/punch1.ogg"),
	a_intent: "harm",
	loot: null,
	atmos_requirements: null,
	unsuitable_atmos_damage: 15,
	faction: null,
	status_flags: 8,
	speak: null,
});

// nanotrasen.dm:25
rt.def("/mob/living/simple_animal/hostile/nanotrasen/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.loot = list(T("/obj/effect/mob_spawn/human/corpse/nanotrasensoldier"));
	this.atmos_requirements = rt.alist(f, ["min_oxy", 5, "max_oxy", 0, "min_tox", 0, "max_tox", 1, "min_co2", 0, "max_co2", 5, "min_n2", 0, "max_n2", 0]);

	this.faction = list("nanotrasenprivate");
	this.speak = list("Stop resisting!", "I AM THE LAW!", "Face the wrath of the golden bolt!", "Stop breaking the law, asshole!");
	return f.dot;
});

// nanotrasen.dm:35
rt.def("/mob/living/simple_animal/hostile/nanotrasen/proc/Aggro", function* Aggro(f: Frame) {
	yield* parent_proc();
	yield* this.summon_backup(15);
	yield* this.say("411 in progress, requesting backup!");
	return f.dot;
}, true);

rt.type(4974, "/mob/living/simple_animal/hostile/nanotrasen/ranged", "/mob/living/simple_animal/hostile/nanotrasen", {
	ranged: 1,
	retreat_distance: 3,
	minimum_distance: 5,
	projectilesound: rt.rsc("sound/weapons/gunshot.ogg"),
	icon_state: "nanotrasenranged",
	icon_living: "nanotrasenranged",
	casingtype: rt.typePath("/obj/item/ammo_casing/c45"),
	loot: null,
});

// nanotrasen.dm:48
rt.def("/mob/living/simple_animal/hostile/nanotrasen/ranged/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.loot = list(T("/obj/item/weapon/gun/ballistic/automatic/pistol/m1911"), T("/obj/effect/mob_spawn/human/corpse/nanotrasensoldier"));
	return f.dot;
});

rt.type(4975, "/mob/living/simple_animal/hostile/nanotrasen/ranged/smg", "/mob/living/simple_animal/hostile/nanotrasen/ranged", {
	rapid: 1,
	projectilesound: rt.rsc("sound/weapons/gunshot_smg.ogg"),
	icon_state: "nanotrasenrangedsmg",
	icon_living: "nanotrasenrangedsmg",
	casingtype: rt.typePath("/obj/item/ammo_casing/c46x30mm"),
	loot: null,
});

// nanotrasen.dm:58
rt.def("/mob/living/simple_animal/hostile/nanotrasen/ranged/smg/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.loot = list(T("/obj/item/weapon/gun/ballistic/automatic/wt550"), T("/obj/effect/mob_spawn/human/corpse/nanotrasensoldier"));
	return f.dot;
});
