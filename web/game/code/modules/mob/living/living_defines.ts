// Based on /tg/station's code/modules/mob/living/living_defines.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(4809, "/mob/living", "/mob", {
	ownedSoullinks: null,
	sharedSoullinks: null,
	maxHealth: 100,
	health: 100,
	bruteloss: 0,
	oxyloss: 0,
	toxloss: 0,
	fireloss: 0,
	cloneloss: 0,
	brainloss: 0,
	staminaloss: 0,
	hallucination: 0,
	last_special: 0,
	incorporeal_move: 0,
	surgeries: null,
	now_pushing: null,
	cameraFollow: null,
	tod: null,
	on_fire: 0,
	fire_stacks: 0,
	bloodcrawl: 0,
	holder: null,
	ventcrawler: 0,
	limb_destroyer: 0,
	mob_size: 2,
	metabolism_efficiency: 1,
	staticOverlays: null,
	has_limbs: 0,
	pipes_shown: null,
	last_played_vent: null,
	smoke_delay: 0,
	bubble_icon: "default",
	last_bumped: 0,
	unique_name: 0,
	butcher_results: null,
	hellbound: 0,
	weather_immunities: null,
	stun_absorption: null,
	blood_volume: 0,
	ranged_ability: null,
	status_effects: null,
	implants: null,
	riding_datum: null,
	selected_default_language: null,
	last_taste_time: null,
	last_taste_text: null,
	hud_possible: null,
	pressure_resistance: 10,
	see_invisible: 25,
	sight: 0,
	see_in_dark: 2,
});

// living_defines.dm:30
rt.def("/mob/living/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.hud_possible = list("1", "2", "15");

	this.surgeries = list();

	this.staticOverlays = list();

	this.pipes_shown = list();

	this.weather_immunities = list();
	return f.dot;
});
