// Based on /tg/station's code/modules/mob/living/simple_animal/friendly/penguin.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(5066, "/mob/living/simple_animal/pet/penguin", "/mob/living/simple_animal/pet", {
	response_help: "pets",
	response_disarm: "bops",
	response_harm: "kicks",
	speak: null,
	speak_emote: null,
	emote_hear: null,
	emote_see: null,
	faction: null,
	see_in_dark: 5,
	speak_chance: 1,
	turns_per_move: 10,
	icon: rt.rsc("icons/mob/penguins.dmi"),
});

// penguin.dm:11
rt.def("/mob/living/simple_animal/pet/penguin/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.speak = list("Gah Gah!", "NOOT NOOT!", "NOOT!", "Noot", "noot", "Prah!", "Grah!");
	this.speak_emote = list("squawks", "gakkers");
	this.emote_hear = list("squawk!", "gakkers!", "noots.", "NOOTS!");
	this.emote_see = list("shakes its beak.", "flaps it's wings.", "preens itself.");

	this.faction = list("penguin");
	return f.dot;
});

rt.type(5067, "/mob/living/simple_animal/pet/penguin/emperor", "/mob/living/simple_animal/pet/penguin", {
	name: "Emperor penguin",
	real_name: "penguin",
	desc: "Emperor of all he surveys.",
	icon_state: "penguin",
	icon_living: "penguin",
	icon_dead: "penguin_dead",
	butcher_results: null,
	gold_core_spawnable: 2,
});

// penguin.dm:24
rt.def("/mob/living/simple_animal/pet/penguin/emperor/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.butcher_results = list();
	return f.dot;
});
