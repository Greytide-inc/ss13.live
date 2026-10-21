// From code/modules/mob/living/simple_animal/hostile/killertomato.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4966, "/mob/living/simple_animal/hostile/killertomato", "/mob/living/simple_animal/hostile", {
	name: "Killer Tomato",
	desc: "It's a horrifyingly enormous beef tomato, and it's packing extra beef!",
	icon_state: "tomato",
	icon_living: "tomato",
	icon_dead: "tomato_dead",
	gender: "neuter",
	speak_chance: 0,
	turns_per_move: 5,
	maxHealth: 30,
	health: 30,
	see_in_dark: 3,
	butcher_results: null,
	response_help: "prods",
	response_disarm: "pushes aside",
	response_harm: "smacks",
	melee_damage_lower: 8,
	melee_damage_upper: 12,
	attacktext: "slams",
	attack_sound: rt.rsc("sound/weapons/punch1.ogg"),
	ventcrawler: 2,
	faction: null,
	atmos_requirements: null,
	minbodytemp: 150,
	maxbodytemp: 500,
	gold_core_spawnable: 1,
});

// /mob/living/simple_animal/hostile/killertomato/proc/<init>  (code/modules/mob/living/simple_animal/hostile/killertomato.dm:13)
rt.def("/mob/living/simple_animal/hostile/killertomato/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "butcher_results", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/killertomato"), 2]));
	$0 = $0;
	rt.setSv(f, "faction", rt.list("plants"));
	rt.setSv(f, "atmos_requirements", rt.alist(f, ["min_oxy", 5, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]));
	return f.dot;
});
