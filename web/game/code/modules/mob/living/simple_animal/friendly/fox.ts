// Based on /tg/station's code/modules/mob/living/simple_animal/friendly/fox.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(5064, "/mob/living/simple_animal/pet/fox", "/mob/living/simple_animal/pet", {
	name: "fox",
	desc: "It's a fox.",
	icon: rt.rsc("icons/mob/pets.dmi"),
	icon_state: "fox",
	icon_living: "fox",
	icon_dead: "fox_dead",
	speak: null,
	speak_emote: null,
	emote_hear: null,
	emote_see: null,
	speak_chance: 1,
	turns_per_move: 5,
	see_in_dark: 6,
	butcher_results: null,
	response_help: "pets",
	response_disarm: "gently pushes aside",
	response_harm: "kicks",
	gold_core_spawnable: 2,
});

// fox.dm:16
rt.def("/mob/living/simple_animal/pet/fox/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.speak = list("Ack-Ack", "Ack-Ack-Ack-Ackawoooo", "Geckers", "Awoo", "Tchoff");
	this.speak_emote = list("geckers", "barks");
	this.emote_hear = list("howls.", "barks.");
	this.emote_see = list("shakes its head.", "shivers.");

	this.butcher_results = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab"), 3]);
	return f.dot;
});
