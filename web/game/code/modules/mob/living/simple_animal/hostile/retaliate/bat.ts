// From code/modules/mob/living/simple_animal/hostile/retaliate/bat.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4935, "/mob/living/simple_animal/hostile/retaliate/bat", "/mob/living/simple_animal/hostile/retaliate", {
	max_co2: 0,
	min_oxy: 0,
	max_tox: 0,
	pass_flags: 1,
	name: "Space Bat",
	desc: "A rare breed of bat which roosts in spaceships, probably not vampiric.",
	icon_state: "bat",
	icon_living: "bat",
	icon_dead: "bat_dead",
	icon_gib: "bat_dead",
	turns_per_move: 1,
	response_help: "brushes aside",
	response_disarm: "flails at",
	response_harm: "hits",
	speak_chance: 0,
	maxHealth: 15,
	health: 15,
	see_in_dark: 10,
	harm_intent_damage: 6,
	melee_damage_lower: 6,
	melee_damage_upper: 5,
	attacktext: "bites",
	butcher_results: null,
	faction: null,
	attack_sound: rt.rsc("sound/weapons/bite.ogg"),
	obj_damage: 0,
	environment_smash: 0,
	ventcrawler: 2,
	mob_size: 0,
	movement_type: 2,
	speak_emote: null,
	atmos_requirements: null,
	minbodytemp: 0,
});

// /mob/living/simple_animal/hostile/retaliate/bat/proc/<init>  (code/modules/mob/living/simple_animal/hostile/retaliate/bat.dm:20)
rt.def("/mob/living/simple_animal/hostile/retaliate/bat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "butcher_results", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab"), 1]));
	$0 = $0;
	rt.setSv(f, "faction", rt.list("hostile"));
	$0 = $0;
	rt.setSv(f, "speak_emote", rt.list("squeaks"));
	rt.setSv(f, "atmos_requirements", rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]));
	return f.dot;
});
