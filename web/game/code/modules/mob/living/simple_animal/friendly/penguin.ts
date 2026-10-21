// From code/modules/mob/living/simple_animal/friendly/penguin.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /mob/living/simple_animal/pet/penguin/proc/<init>  (code/modules/mob/living/simple_animal/friendly/penguin.dm:11)
rt.def("/mob/living/simple_animal/pet/penguin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "speak", rt.list("Gah Gah!", "NOOT NOOT!", "NOOT!", "Noot", "noot", "Prah!", "Grah!"));
	rt.setSv(f, "speak_emote", rt.list("squawks", "gakkers"));
	rt.setSv(f, "emote_hear", rt.list("squawk!", "gakkers!", "noots.", "NOOTS!"));
	rt.setSv(f, "emote_see", rt.list("shakes its beak.", "flaps it's wings.", "preens itself."));
	$0 = $0;
	rt.setSv(f, "faction", rt.list("penguin"));
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

// /mob/living/simple_animal/pet/penguin/emperor/proc/<init>  (code/modules/mob/living/simple_animal/friendly/penguin.dm:24)
rt.def("/mob/living/simple_animal/pet/penguin/emperor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "butcher_results", rt.list());
	return f.dot;
});
