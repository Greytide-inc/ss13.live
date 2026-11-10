// Based on /tg/station's code/modules/mob/living/carbon/human/human_defines.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4811, "/mob/living/carbon/human", "/mob/living/carbon", {
	hair_color: "000",
	hair_style: "Bald",
	facial_hair_color: "000",
	facial_hair_style: "Shaved",
	eye_color: "000",
	skin_tone: "caucasian1",
	lip_style: null,
	lip_color: "white",
	age: 30,
	underwear: "Nude",
	undershirt: "Nude",
	socks: "Nude",
	backbag: "Department Backpack",
	wear_suit: null,
	w_uniform: null,
	belt: null,
	wear_id: null,
	r_store: null,
	l_store: null,
	s_store: null,
	special_voice: "",
	bleed_rate: 0,
	bleedsuppress: 0,
	name_override: null,
	drunkenness: 0,
	handcrafting: null,
	hud_possible: null,
	pressure_resistance: 25,
	can_buckle: 1,
	buckle_lying: 0,
	name: "Unknown",
	real_name: "Unknown",
	voice_name: "Unknown",
	icon: rt.rsc("icons/mob/human.dmi"),
	icon_state: "caucasian_m",
	possible_a_intents: null,
	can_ride_typecache: null,
});

// human_defines.dm:48
rt.def("/mob/living/carbon/human/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.hud_possible = list("1", "2", "3", "4", "5", "6", "7", "15");
	this.possible_a_intents = list("help", "disarm", "grab", "harm");

	this.can_ride_typecache = list(T("/mob/living/carbon/human"), T("/mob/living/simple_animal/slime"), T("/mob/living/simple_animal/parrot"));
	return f.dot;
});
