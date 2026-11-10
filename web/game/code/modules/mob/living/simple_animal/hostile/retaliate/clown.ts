// Based on /tg/station's code/modules/mob/living/simple_animal/hostile/retaliate/clown.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4936, "/mob/living/simple_animal/hostile/retaliate/clown", "/mob/living/simple_animal/hostile/retaliate", {
	name: "Clown",
	desc: "A denizen of clown planet",
	icon: rt.rsc("icons/mob/simple_human.dmi"),
	icon_state: "clown",
	icon_living: "clown",
	icon_dead: "clown_dead",
	icon_gib: "clown_gib",
	turns_per_move: 5,
	response_help: "pokes",
	response_disarm: "gently pushes aside",
	response_harm: "robusts",
	speak: null,
	emote_see: null,
	speak_chance: 1,
	a_intent: "harm",
	maxHealth: 75,
	health: 75,
	speed: 0,
	harm_intent_damage: 8,
	melee_damage_lower: 10,
	melee_damage_upper: 10,
	attacktext: "attacks",
	attack_sound: rt.rsc("sound/items/bikehorn.ogg"),
	obj_damage: 0,
	environment_smash: 0,
	del_on_death: 1,
	loot: null,
	atmos_requirements: null,
	minbodytemp: 270,
	maxbodytemp: 370,
	unsuitable_atmos_damage: 10,
});

// clown.dm:28
rt.def("/mob/living/simple_animal/hostile/retaliate/clown/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.speak = list("HONK", "Honk!", "Welcome to clown planet!");
	this.emote_see = list("honks", "squeaks");

	this.loot = list(T("/obj/effect/mob_spawn/human/clown/corpse"));
	this.atmos_requirements = rt.alist(f, ["min_oxy", 5, "max_oxy", 0, "min_tox", 0, "max_tox", 1, "min_co2", 0, "max_co2", 5, "min_n2", 0, "max_n2", 0]);
	return f.dot;
});

// clown.dm:36
rt.def("/mob/living/simple_animal/hostile/retaliate/clown/proc/handle_temperature_damage", function* handle_temperature_damage(f: Frame) {
	if (this.bodytemperature < this.minbodytemp) {
		yield* this.adjustBruteLoss(10);
	} else {
		if (!(this.bodytemperature > this.maxbodytemp)) return f.dot;
		yield* this.adjustBruteLoss(15);
	}
	return f.dot;
}, true);

// clown.dm:42
rt.def("/mob/living/simple_animal/hostile/retaliate/clown/proc/attack_hand", function* attack_hand(f: Frame, M: Value) {
	yield* parent_proc();
	playsound(this.loc, rt.rsc("sound/items/bikehorn.ogg"), 50, 1);
	return f.dot;
}, true);
