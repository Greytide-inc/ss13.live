// From code/modules/mob/living/living_defines.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /mob/living/proc/<init>  (code/modules/mob/living/living_defines.dm:30)
rt.def("/mob/living/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "hud_possible", rt.list("1", "2", "15"));
	$0 = $0;
	rt.setSv(f, "surgeries", rt.list());
	$0 = $0;
	rt.setSv(f, "staticOverlays", rt.list());
	$0 = $0;
	rt.setSv(f, "pipes_shown", rt.list());
	$0 = $0;
	rt.setSv(f, "weather_immunities", rt.list());
	return f.dot;
});
