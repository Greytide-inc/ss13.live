// Based on /tg/station's code/modules/mob/living/simple_animal/hostile/carp.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4902, "/mob/living/simple_animal/hostile/carp", "/mob/living/simple_animal/hostile", {
	pressure_resistance: 200,
	name: "space carp",
	desc: "A ferocious, fang-bearing creature that resembles a fish.",
	icon_state: "carp",
	icon_living: "carp",
	icon_dead: "carp_dead",
	icon_gib: "carp_gib",
	speak_chance: 0,
	turns_per_move: 5,
	butcher_results: null,
	response_help: "pets",
	response_disarm: "gently pushes aside",
	response_harm: "hits",
	emote_taunt: null,
	taunt_chance: 30,
	speed: 0,
	maxHealth: 25,
	health: 25,
	harm_intent_damage: 8,
	obj_damage: 50,
	melee_damage_lower: 15,
	melee_damage_upper: 15,
	attacktext: "bites",
	attack_sound: rt.rsc("sound/weapons/bite.ogg"),
	speak_emote: null,
	atmos_requirements: null,
	minbodytemp: 0,
	maxbodytemp: 1500,
	faction: null,
	movement_type: 2,
	gold_core_spawnable: 1,
});

// carp.dm:10
rt.def("/mob/living/simple_animal/hostile/carp/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.butcher_results = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/carpmeat"), 2]);

	this.emote_taunt = list("gnashes");

	this.speak_emote = list("gnashes");
	this.atmos_requirements = rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]);

	this.faction = list("carp");
	return f.dot;
});

// carp.dm:42
rt.def("/mob/living/simple_animal/hostile/carp/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	let H: Value = null;
	f.dot = (yield* parent_proc());
	if (!(f.dot && rt.istype(this.target, T("/mob/living/carbon/human")))) return f.dot;
	yield* (H = this.target).adjustStaminaLoss(8);
	return f.dot;
}, true);

rt.type(4907, "/mob/living/simple_animal/hostile/carp/cayenne", "/mob/living/simple_animal/hostile/carp", {
	name: "Cayenne",
	desc: "A failed Syndicate experiment in weaponized space carp technology, it now serves as a lovable mascot.",
	gender: "female",
	speak_emote: null,
	gold_core_spawnable: 0,
	faction: null,
	AIStatus: 3,
});

// carp.dm:76
rt.def("/mob/living/simple_animal/hostile/carp/cayenne/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.speak_emote = list("squeaks");

	this.faction = list("syndicate");
	return f.dot;
});
