// From code/modules/holodeck/mobs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /mob/living/simple_animal/holodeck_monkey/proc/<init>  (code/modules/holodeck/mobs.dm:12)
rt.def("/mob/living/simple_animal/holodeck_monkey/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "speak_emote", rt.list("chimpers"));
	$0 = $0;
	rt.setSv(f, "emote_hear", rt.list("chimpers."));
	rt.setSv(f, "emote_see", rt.list("scratches.", "looks around."));
	$0 = $0;
	rt.setSv(f, "butcher_results", rt.list());
	return f.dot;
});
