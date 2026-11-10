// Based on /tg/station's code/modules/mob/living/simple_animal/friendly/sloth.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(5090, "/mob/living/simple_animal/sloth", "/mob/living/simple_animal", {
	icon_living: "sloth",
	icon_dead: "sloth_dead",
	speak_emote: null,
	emote_hear: null,
	emote_see: null,
	speak_chance: 1,
	turns_per_move: 5,
	response_help: "pets",
	response_disarm: "gently pushes aside",
	response_harm: "kicks",
	gold_core_spawnable: 2,
	melee_damage_lower: 18,
	melee_damage_upper: 18,
	speed: 2,
	name: "sloth",
	desc: "An adorable, sleepy creature.",
	icon: rt.rsc("icons/mob/pets.dmi"),
	icon_state: "sloth",
	butcher_results: null,
	health: 50,
	maxHealth: 50,
});

// sloth.dm:8
rt.def("/mob/living/simple_animal/sloth/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.speak_emote = list("yawns");
	this.emote_hear = list("snores.", "yawns.");
	this.emote_see = list("dozes off.", "looks around sleepily.");

	this.butcher_results = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab"), 3]);
	return f.dot;
});

rt.type(5092, "/mob/living/simple_animal/sloth/citrus", "/mob/living/simple_animal/sloth", {
	icon_living: "cool_sloth",
	icon_dead: "cool_sloth_dead",
	gold_core_spawnable: 0,
	name: "Citrus",
	desc: "Cargo's pet sloth. She's dressed in a horrible sweater.",
	icon_state: "cool_sloth",
	gender: "female",
	butcher_results: null,
});

// sloth.dm:40
rt.def("/mob/living/simple_animal/sloth/citrus/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.butcher_results = rt.alist(f, [T("/obj/item/toy/spinningtoy"), 1]);
	return f.dot;
});
