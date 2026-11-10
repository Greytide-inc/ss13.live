// Based on /tg/station's code/modules/mob/living/simple_animal/friendly/butterfly.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(5078, "/mob/living/simple_animal/butterfly", "/mob/living/simple_animal", {
	icon_living: "butterfly",
	icon_dead: "butterfly_dead",
	turns_per_move: 1,
	response_help: "shoos",
	response_disarm: "brushes aside",
	response_harm: "squashes",
	speak_emote: null,
	harm_intent_damage: 1,
	friendly: "nudges",
	pass_flags: 21,
	gold_core_spawnable: 2,
	verb_say: "flutters",
	verb_ask: "flutters inquisitively",
	verb_exclaim: "flutters intensely",
	verb_yell: "flutters intensely",
	name: "butterfly",
	desc: "A colorful butterfly, how'd it get up here?",
	icon_state: "butterfly",
	maxHealth: 2,
	health: 2,
	density: 0,
	movement_type: 2,
	ventcrawler: 2,
	mob_size: 0,
});

// butterfly.dm:11
rt.def("/mob/living/simple_animal/butterfly/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.speak_emote = list("flutters");
	return f.dot;
});

// butterfly.dm:28
rt.def("/mob/living/simple_animal/butterfly/proc/Initialize", function* Initialize(f: Frame) {
	let newcolor: Value = null;
	yield* parent_proc();
	this.add_atom_colour((newcolor = rt.op(f, "Rgb", [1, 3], [rand(0, 255), rand(0, 255), rand(0, 255)])), FIXED_COLOUR_PRIORITY);
	return f.dot;
}, true);
