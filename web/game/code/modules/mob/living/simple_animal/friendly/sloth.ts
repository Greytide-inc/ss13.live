// From code/modules/mob/living/simple_animal/friendly/sloth.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /mob/living/simple_animal/sloth/proc/<init>  (code/modules/mob/living/simple_animal/friendly/sloth.dm:8)
rt.def("/mob/living/simple_animal/sloth/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "speak_emote", rt.list("yawns"));
	rt.setSv(f, "emote_hear", rt.list("snores.", "yawns."));
	rt.setSv(f, "emote_see", rt.list("dozes off.", "looks around sleepily."));
	$0 = $0;
	rt.setSv(f, "butcher_results", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab"), 3]));
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

// /mob/living/simple_animal/sloth/citrus/proc/<init>  (code/modules/mob/living/simple_animal/friendly/sloth.dm:40)
rt.def("/mob/living/simple_animal/sloth/citrus/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "butcher_results", rt.alist(f, [T("/obj/item/toy/spinningtoy"), 1]));
	return f.dot;
});
