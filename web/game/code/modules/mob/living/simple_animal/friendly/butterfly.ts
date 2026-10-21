// From code/modules/mob/living/simple_animal/friendly/butterfly.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /mob/living/simple_animal/butterfly/proc/<init>  (code/modules/mob/living/simple_animal/friendly/butterfly.dm:11)
rt.def("/mob/living/simple_animal/butterfly/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "speak_emote", rt.list("flutters"));
	return f.dot;
});

// /mob/living/simple_animal/butterfly/proc/Initialize  (code/modules/mob/living/simple_animal/friendly/butterfly.dm:28)  may sleep
rt.def("/mob/living/simple_animal/butterfly/proc/Initialize", function* Initialize(f: Frame) {
	let newcolor: Value = null;
	f.vars = () => [newcolor];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "add_atom_colour", (newcolor = rt.op(f, "Rgb", [1, 3], [(yield* g.call(f, P("/proc/rand"), null, [0, 255])), (yield* g.call(f, P("/proc/rand"), null, [0, 255])), (yield* g.call(f, P("/proc/rand"), null, [0, 255]))])), 4);
	return f.dot;
}, true);
