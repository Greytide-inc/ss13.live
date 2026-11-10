// Based on /tg/station's code/modules/holodeck/mobs.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(5073, "/mob/living/simple_animal/holodeck_monkey", "/mob/living/simple_animal", {
	name: "monkey",
	desc: "A holographic creature fond of bananas.",
	icon: rt.rsc("icons/mob/monkey.dmi"),
	icon_state: "monkey1",
	icon_living: "monkey1",
	icon_dead: "monkey1_dead",
	speak_emote: null,
	emote_hear: null,
	emote_see: null,
	speak_chance: 1,
	turns_per_move: 2,
	butcher_results: null,
	response_help: "pets",
	response_disarm: "pushes aside",
	response_harm: "kicks",
});

// mobs.dm:12
rt.def("/mob/living/simple_animal/holodeck_monkey/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.speak_emote = list("chimpers");

	this.emote_hear = list("chimpers.");
	this.emote_see = list("scratches.", "looks around.");

	this.butcher_results = list();
	return f.dot;
});
