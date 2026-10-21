// Types declared in code/modules/mob/living/carbon/human that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";

rt.type(508, "/datum/emote/living/carbon/human/cry", "/datum/emote/living/carbon/human", {
	key: "cry",
	key_third_person: "cries",
	message: "cries.",
	emote_type: 2,
});
rt.type(509, "/datum/emote/living/carbon/human/dap", "/datum/emote/living/carbon/human", {
	key: "dap",
	key_third_person: "daps",
	message: "sadly can't find anybody to give daps to, and daps themself. Shameful.",
	message_param: "give daps to %t.",
	restraint_check: 1,
});
rt.type(510, "/datum/emote/living/carbon/human/eyebrow", "/datum/emote/living/carbon/human", {
	key: "eyebrow",
	message: "raises an eyebrow.",
});
rt.type(511, "/datum/emote/living/carbon/human/grumble", "/datum/emote/living/carbon/human", {
	key: "grumble",
	key_third_person: "grumbles",
	message: "grumbles!",
	emote_type: 2,
});
rt.type(512, "/datum/emote/living/carbon/human/handshake", "/datum/emote/living/carbon/human", {
	key: "handshake",
	message: "shakes their own hands.",
	message_param: "shakes hands with %t.",
	restraint_check: 1,
	emote_type: 2,
});
rt.type(513, "/datum/emote/living/carbon/human/hug", "/datum/emote/living/carbon/human", {
	key: "hug",
	key_third_person: "hugs",
	message: "hugs themself.",
	message_param: "hugs %t.",
	restraint_check: 1,
	emote_type: 2,
});
rt.type(514, "/datum/emote/living/carbon/human/mumble", "/datum/emote/living/carbon/human", {
	key: "mumble",
	key_third_person: "mumbles",
	message: "mumbles!",
	emote_type: 2,
});
rt.type(515, "/datum/emote/living/carbon/human/pale", "/datum/emote/living/carbon/human", {
	key: "pale",
	message: "goes pale for a second.",
});
rt.type(516, "/datum/emote/living/carbon/human/raise", "/datum/emote/living/carbon/human", {
	key: "raise",
	key_third_person: "raises",
	message: "raises a hand.",
	restraint_check: 1,
});
rt.type(517, "/datum/emote/living/carbon/human/salute", "/datum/emote/living/carbon/human", {
	key: "salute",
	key_third_person: "salutes",
	message: "salutes.",
	message_param: "salutes to %t.",
	restraint_check: 1,
});
rt.type(518, "/datum/emote/living/carbon/human/shrug", "/datum/emote/living/carbon/human", {
	key: "shrug",
	key_third_person: "shrugs",
	message: "shrugs.",
});
rt.type(4075, "/datum/species/abductor", "/datum/species", {
	scientist: 0,
	team: 1,
	name: "Abductor",
	id: "abductor",
	say_mod: "gibbers",
	sexes: 0,
	species_traits: null,
	mutanttongue: rt.typePath("/obj/item/organ/tongue/abductor"),
});
rt.type(4078, "/datum/species/corporate", "/datum/species", {
	name: "Corporate Agent",
	id: "agent",
	hair_alpha: 0,
	say_mod: "declares",
	speedmod: -2,
	brutemod: 0.7,
	burnmod: 0.65,
	coldmod: 0,
	heatmod: 0.5,
	punchdamagelow: 20,
	punchdamagehigh: 30,
	punchstunthreshold: 25,
	attack_verb: "smash",
	attack_sound: rt.rsc("sound/weapons/resonator_blast.ogg"),
	blacklisted: 1,
	use_skintones: 0,
	species_traits: null,
	sexes: 0,
});
