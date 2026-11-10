// Based on /tg/station's code/modules/mob/living/simple_animal/hostile/retaliate/ghost.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4938, "/mob/living/simple_animal/hostile/retaliate/ghost", "/mob/living/simple_animal/hostile/retaliate", {
	ghost_hair_style: null,
	ghost_hair_color: null,
	ghost_hair: null,
	ghost_facial_hair_style: null,
	ghost_facial_hair_color: null,
	ghost_facial_hair: null,
	random: 1,
	pressure_resistance: 300,
	name: "ghost",
	desc: "A soul of the dead, spooky.",
	icon: rt.rsc("icons/mob/mob.dmi"),
	icon_state: "ghost",
	icon_living: "ghost",
	speak_chance: 0,
	turns_per_move: 5,
	response_help: "passes through",
	response_disarm: "shoves",
	response_harm: "hits",
	a_intent: "harm",
	healable: 0,
	speed: 0,
	maxHealth: 40,
	health: 40,
	harm_intent_damage: 10,
	melee_damage_lower: 15,
	melee_damage_upper: 15,
	del_on_death: 1,
	emote_see: null,
	attacktext: "grips",
	attack_sound: rt.rsc("sound/hallucinations/growl1.ogg"),
	speak_emote: null,
	deathmessage: "wails, disintegrating into a pile of ectoplasm!",
	loot: null,
	atmos_requirements: null,
	minbodytemp: 0,
	maxbodytemp: 1500,
	movement_type: 2,
	gold_core_spawnable: 0,
});

// ghost.dm:24
rt.def("/mob/living/simple_animal/hostile/retaliate/ghost/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.emote_see = list("weeps silently", "groans", "mumbles");

	this.speak_emote = list("weeps");

	this.loot = list(T("/obj/item/weapon/ectoplasm"));
	this.atmos_requirements = rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]);
	return f.dot;
});

// ghost.dm:42
rt.def("/mob/living/simple_animal/hostile/retaliate/ghost/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.give_hair();
	this.set_light(1, 2);
	if (!this.random) return f.dot;
	const die = rand(0, 1);
	if (die === 0) {
		this.name = `ghost of ${pick(GLOB.first_names_male)} ${pick(GLOB.last_names)}`;
	} else if (die === 1) {
		this.name = `ghost of ${pick(GLOB.first_names_female)} ${pick(GLOB.last_names)}`;
	}
	return f.dot;
}, true);

// ghost.dm:54
rt.def("/mob/living/simple_animal/hostile/retaliate/ghost/proc/give_hair", function give_hair(f: Frame) {
	if (this.ghost_hair_style !== null) {
		this.ghost_hair = mutable_appearance(rt.rsc("icons/mob/human_face.dmi"), `hair_${this.ghost_hair_style}`, -8);
		this.ghost_hair.alpha = 200;
		this.ghost_hair.color = this.ghost_hair_color;
		this.add_overlay(this.ghost_hair);
	}
	if (this.ghost_facial_hair_style === null) return f.dot;
	this.ghost_facial_hair = mutable_appearance(rt.rsc("icons/mob/human_face.dmi"), `facial_${this.ghost_facial_hair_style}`, -8);
	this.ghost_facial_hair.alpha = 200;
	this.ghost_facial_hair.color = this.ghost_facial_hair_color;
	this.add_overlay(this.ghost_facial_hair);
	return f.dot;
});
