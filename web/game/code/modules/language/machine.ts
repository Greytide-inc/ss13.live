// Based on /tg/station's code/modules/language/machine.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(2781, "/datum/language/machine", "/datum/language", {
	name: "Encoded Audio Language",
	desc: "An efficient language of encoded tones developed by synthetics and cyborgs.",
	speech_verb: "whistles",
	ask_verb: "chirps",
	exclaim_verb: "whistles loudly",
	spans: null,
	key: "6",
	flags: 1,
	syllables: null,
	space_chance: 10,
	default_priority: 90,
	icon_state: "eal",
});

// machine.dm:7
rt.def("/datum/language/machine/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.spans = list("robot");
	this.syllables = list("beep", "beep", "beep", "beep", "beep", "boop", "boop", "boop", "bop", "bop", "dee", "dee", "doo", "doo", "hiss", "hss", "buzz", "buzz", "bzz", "ksssh", "keey", "wurr", "wahh", "tzzz");
	return f.dot;
});
