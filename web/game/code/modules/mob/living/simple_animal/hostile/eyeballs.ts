// Based on /tg/station's code/modules/mob/living/simple_animal/hostile/eyeballs.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(4908, "/mob/living/simple_animal/hostile/carp/eyeball", "/mob/living/simple_animal/hostile/carp", {
	name: "eyeball",
	desc: "An odd looking creature, it won't stop staring...",
	icon_state: "eyeball",
	icon_living: "eyeball",
	icon_gib: "",
	gender: "neuter",
	response_help: "pets",
	response_disarm: "gently pushes aside",
	response_harm: "hits",
	emote_taunt: null,
	taunt_chance: 25,
	maxHealth: 45,
	health: 45,
	speak_emote: null,
	harm_intent_damage: 15,
	obj_damage: 60,
	melee_damage_lower: 20,
	melee_damage_upper: 25,
	attacktext: "blinks at",
	attack_sound: rt.rsc("sound/weapons/pierce.ogg"),
	movement_type: 2,
	faction: null,
	del_on_death: 1,
});

// eyeballs.dm:13
rt.def("/mob/living/simple_animal/hostile/carp/eyeball/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.emote_taunt = list("glares");

	this.speak_emote = list("telepathically cries");

	this.faction = list("spooky");
	return f.dot;
});
