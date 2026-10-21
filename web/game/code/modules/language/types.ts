// Types declared in code/modules/language that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../build/dist/src/translate/runtime.js";

rt.type(2776, "/datum/language/beachbum", "/datum/language", {
	name: "Beachtongue",
	desc: "An ancient language from the distant Beach Planet. People magically learn to speak it under the influence of space drugs.",
	speech_verb: "mumbles",
	ask_verb: "grills",
	exclaim_verb: "hollers",
	key: "u",
	space_chance: 85,
	default_priority: 90,
	syllables: null,
	icon_state: "beach",
});
rt.type(2778, "/datum/language/common", "/datum/language", {
	name: "Galactic Common",
	desc: "The common galactic tongue.",
	speech_verb: "says",
	whisper_verb: "whispers",
	key: "0",
	flags: 6,
	default_priority: 100,
	icon_state: "galcom",
	syllables: null,
});
rt.type(2779, "/datum/language/draconic", "/datum/language", {
	name: "Draconic",
	desc: "The common language of lizard-people, composed of sibilant hisses and rattles.",
	speech_verb: "hisses",
	ask_verb: "hisses",
	exclaim_verb: "roars",
	key: "o",
	flags: 2,
	space_chance: 40,
	syllables: null,
	icon_state: "lizard",
	default_priority: 90,
});
rt.type(2782, "/datum/language/monkey", "/datum/language", {
	name: "Chimpanzee",
	desc: "Ook ook ook.",
	speech_verb: "chimpers",
	ask_verb: "chimpers",
	exclaim_verb: "screeches",
	key: "1",
	space_chance: 100,
	syllables: null,
	default_priority: 80,
	icon_state: "animal",
});
rt.type(2785, "/datum/language/slime", "/datum/language", {
	name: "Slime",
	desc: "A melodic and complex language spoken by slimes. Some of the notes are inaudible to humans.",
	speech_verb: "warbles",
	ask_verb: "warbles",
	exclaim_verb: "warbles",
	key: "k",
	syllables: null,
	default_priority: 70,
	icon_state: "slime",
});
rt.type(2787, "/datum/language/xenocommon", "/datum/language", {
	name: "Xenomorph",
	desc: "The common tongue of the xenomorphs.",
	speech_verb: "hisses",
	ask_verb: "hisses",
	exclaim_verb: "hisses",
	key: "4",
	syllables: null,
	default_priority: 50,
	icon_state: "xeno",
});
rt.type(2795, "/datum/language_holder/drone/syndicate", "/datum/language_holder/drone", {
	only_speaks_language: null,
});
rt.type(7512, "/obj/item/weapon/codespeak_manual/unlimited", "/obj/item/weapon/codespeak_manual", {
	charges: 1e+31,
	name: "deluxe codespeak manual",
});
