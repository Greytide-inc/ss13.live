// From code/modules/mob/living/simple_animal/hostile/skeleton.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4985, "/mob/living/simple_animal/hostile/skeleton", "/mob/living/simple_animal/hostile", {
	robust_searching: 1,
	stat_attack: 1,
	name: "reanimated skeleton",
	desc: "A real bonefied skeleton, doesn't seem like it wants to socialize.",
	icon: rt.rsc("icons/mob/simple_human.dmi"),
	icon_state: "skeleton",
	icon_living: "skeleton",
	icon_dead: "skeleton",
	gender: "neuter",
	turns_per_move: 5,
	speak_emote: null,
	emote_see: null,
	a_intent: "harm",
	maxHealth: 40,
	health: 40,
	speed: 1,
	harm_intent_damage: 5,
	melee_damage_lower: 15,
	melee_damage_upper: 15,
	minbodytemp: 0,
	maxbodytemp: 1500,
	healable: 0,
	attacktext: "slashes",
	attack_sound: rt.rsc("sound/hallucinations/growl1.ogg"),
	atmos_requirements: null,
	unsuitable_atmos_damage: 10,
	gold_core_spawnable: 1,
	faction: null,
	see_in_dark: 8,
	lighting_alpha: 128,
	deathmessage: "collapses into a pile of bones!",
	del_on_death: 1,
	loot: null,
});

// /mob/living/simple_animal/hostile/skeleton/proc/<init>  (code/modules/mob/living/simple_animal/hostile/skeleton.dm:10)
rt.def("/mob/living/simple_animal/hostile/skeleton/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "speak_emote", rt.list("rattles"));
	$0 = $0;
	rt.setSv(f, "emote_see", rt.list("rattles"));
	rt.setSv(f, "atmos_requirements", rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]));
	$0 = $0;
	rt.setSv(f, "faction", rt.list("skeleton"));
	$0 = $0;
	rt.setSv(f, "loot", rt.list(T("/obj/effect/decal/remains/human")));
	return f.dot;
});

rt.type(4986, "/mob/living/simple_animal/hostile/skeleton/eskimo", "/mob/living/simple_animal/hostile/skeleton", {
	name: "undead eskimo",
	desc: "The reanimated remains of some poor traveler.",
	icon_state: "eskimo",
	icon_living: "eskimo",
	icon_dead: "eskimo_dead",
	maxHealth: 55,
	health: 55,
	gold_core_spawnable: 0,
	melee_damage_lower: 17,
	melee_damage_upper: 20,
	deathmessage: "collapses into a pile of bones, its gear falling to the floor!",
	loot: null,
});

// /mob/living/simple_animal/hostile/skeleton/eskimo/proc/<init>  (code/modules/mob/living/simple_animal/hostile/skeleton.dm:48)
rt.def("/mob/living/simple_animal/hostile/skeleton/eskimo/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "loot", rt.list(T("/obj/effect/decal/remains/human"), T("/obj/item/weapon/twohanded/spear"), T("/obj/item/clothing/shoes/winterboots"), T("/obj/item/clothing/suit/hooded/wintercoat")));
	return f.dot;
});

rt.type(4987, "/mob/living/simple_animal/hostile/skeleton/templar", "/mob/living/simple_animal/hostile/skeleton", {
	name: "undead templar",
	desc: "The reanimated remains of a holy templar knight.",
	icon_state: "templar",
	icon_living: "templar",
	icon_dead: "templar_dead",
	maxHealth: 150,
	health: 150,
	speed: 2,
	gold_core_spawnable: 0,
	speak_chance: 1,
	speak: null,
	force_threshold: 10,
	obj_damage: 50,
	melee_damage_lower: 25,
	melee_damage_upper: 30,
	deathmessage: "collapses into a pile of bones, its gear clanging as it hits the ground!",
	loot: null,
});

// /mob/living/simple_animal/hostile/skeleton/templar/proc/<init>  (code/modules/mob/living/simple_animal/hostile/skeleton.dm:71)
rt.def("/mob/living/simple_animal/hostile/skeleton/templar/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "speak", rt.list("THE GODS WILL IT!", "DEUS VULT!", "REMOVE KABAB!"));
	$0 = $0;
	rt.setSv(f, "loot", rt.list(T("/obj/effect/decal/remains/human"), T("/obj/item/clothing/suit/armor/riot/knight/templar"), T("/obj/item/clothing/head/helmet/knight/templar"), T("/obj/item/weapon/claymore/weak")));
	return f.dot;
});

rt.type(4988, "/mob/living/simple_animal/hostile/skeleton/ice", "/mob/living/simple_animal/hostile/skeleton", {
	name: "ice skeleton",
	desc: "A reanimated skeleton protected by a thick sheet of natural ice armor. Looks slow, though.",
	speed: 5,
	maxHealth: 75,
	health: 75,
	color: "#72e4fa",
	loot: null,
});

// /mob/living/simple_animal/hostile/skeleton/ice/proc/<init>  (code/modules/mob/living/simple_animal/hostile/skeleton.dm:83)
rt.def("/mob/living/simple_animal/hostile/skeleton/ice/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "loot", rt.list(T("/obj/effect/decal/remains/human")));
	return f.dot;
});
