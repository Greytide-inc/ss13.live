// From code/modules/mob/living/simple_animal/hostile/pirate.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4976, "/mob/living/simple_animal/hostile/pirate", "/mob/living/simple_animal/hostile", {
	name: "Pirate",
	desc: "Does what he wants cause a pirate is free.",
	icon: rt.rsc("icons/mob/simple_human.dmi"),
	icon_state: "piratemelee",
	icon_living: "piratemelee",
	icon_dead: "piratemelee_dead",
	speak_chance: 0,
	turns_per_move: 5,
	response_help: "pushes",
	response_disarm: "shoves",
	response_harm: "hits",
	speed: 0,
	maxHealth: 100,
	health: 100,
	harm_intent_damage: 5,
	obj_damage: 60,
	melee_damage_lower: 30,
	melee_damage_upper: 30,
	attacktext: "slashes",
	attack_sound: rt.rsc("sound/weapons/bladeslice.ogg"),
	atmos_requirements: null,
	unsuitable_atmos_damage: 15,
	speak_emote: null,
	loot: null,
	del_on_death: 1,
	faction: null,
});

// /mob/living/simple_animal/hostile/pirate/proc/<init>  (code/modules/mob/living/simple_animal/hostile/pirate.dm:24)
rt.def("/mob/living/simple_animal/hostile/pirate/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "atmos_requirements", rt.alist(f, ["min_oxy", 5, "max_oxy", 0, "min_tox", 0, "max_tox", 1, "min_co2", 0, "max_co2", 5, "min_n2", 0, "max_n2", 0]));
	$0 = $0;
	rt.setSv(f, "speak_emote", rt.list("yarrs"));
	$0 = $0;
	rt.setSv(f, "loot", rt.list(T("/obj/effect/mob_spawn/human/corpse/pirate"), T("/obj/item/weapon/melee/energy/sword/pirate")));
	$0 = $0;
	rt.setSv(f, "faction", rt.list("pirate"));
	return f.dot;
});

rt.type(4977, "/mob/living/simple_animal/hostile/pirate/ranged", "/mob/living/simple_animal/hostile/pirate", {
	projectilesound: rt.rsc("sound/weapons/laser.ogg"),
	ranged: 1,
	rapid: 1,
	retreat_distance: 5,
	minimum_distance: 5,
	name: "Pirate Gunner",
	icon_state: "pirateranged",
	icon_living: "pirateranged",
	icon_dead: "piratemelee_dead",
	projectiletype: rt.typePath("/obj/item/projectile/beam/laser"),
	loot: null,
});

// /mob/living/simple_animal/hostile/pirate/ranged/proc/<init>  (code/modules/mob/living/simple_animal/hostile/pirate.dm:43)
rt.def("/mob/living/simple_animal/hostile/pirate/ranged/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "loot", rt.list(T("/obj/effect/mob_spawn/human/corpse/pirate/ranged"), T("/obj/item/weapon/gun/energy/laser")));
	return f.dot;
});

rt.type(4978, "/mob/living/simple_animal/hostile/pirate/space", "/mob/living/simple_animal/hostile/pirate", {
	name: "Space Pirate",
	icon_state: "piratespace",
	icon_living: "piratespace",
	atmos_requirements: null,
	minbodytemp: 0,
	speed: 1,
});

// /mob/living/simple_animal/hostile/pirate/space/proc/<init>  (code/modules/mob/living/simple_animal/hostile/pirate.dm:50)
rt.def("/mob/living/simple_animal/hostile/pirate/space/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "atmos_requirements", rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]));
	return f.dot;
});

rt.type(4979, "/mob/living/simple_animal/hostile/pirate/space/ranged", "/mob/living/simple_animal/hostile/pirate/space", {
	projectilesound: rt.rsc("sound/weapons/laser.ogg"),
	ranged: 1,
	rapid: 1,
	retreat_distance: 5,
	minimum_distance: 5,
	name: "Space Pirate Gunner",
	icon_state: "piratespaceranged",
	icon_living: "piratespaceranged",
	projectiletype: rt.typePath("/obj/item/projectile/beam/laser"),
	loot: null,
});

// /mob/living/simple_animal/hostile/pirate/space/ranged/proc/<init>  (code/modules/mob/living/simple_animal/hostile/pirate.dm:64)
rt.def("/mob/living/simple_animal/hostile/pirate/space/ranged/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "loot", rt.list(T("/obj/effect/mob_spawn/human/corpse/pirate/ranged"), T("/obj/item/weapon/gun/energy/laser")));
	return f.dot;
});
