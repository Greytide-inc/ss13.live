// From code/modules/mob/living/simple_animal/friendly/fox.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /mob/living/simple_animal/pet/fox/proc/<init>  (code/modules/mob/living/simple_animal/friendly/fox.dm:16)
rt.def("/mob/living/simple_animal/pet/fox/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "speak", rt.list("Ack-Ack", "Ack-Ack-Ack-Ackawoooo", "Geckers", "Awoo", "Tchoff"));
	rt.setSv(f, "speak_emote", rt.list("geckers", "barks"));
	rt.setSv(f, "emote_hear", rt.list("howls.", "barks."));
	rt.setSv(f, "emote_see", rt.list("shakes its head.", "shivers."));
	$0 = $0;
	rt.setSv(f, "butcher_results", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab"), 3]));
	return f.dot;
});
