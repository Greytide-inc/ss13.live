// Based on /tg/station's code/modules/mob/living/simple_animal/hostile/retaliate/bat.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


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

// bat.dm:20
rt.def("/mob/living/simple_animal/hostile/retaliate/bat/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.butcher_results = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab"), 1]);

	this.faction = list("hostile");

	this.speak_emote = list("squeaks");
	this.atmos_requirements = rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]);
	return f.dot;
});
