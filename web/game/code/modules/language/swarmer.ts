// Based on /tg/station's code/modules/language/swarmer.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(2786, "/datum/language/swarmer", "/datum/language", {
	name: "Swarmer",
	desc: "A language only consisting of musical notes.",
	speech_verb: "tones",
	ask_verb: "tones inquisitively",
	exclaim_verb: "tones loudly",
	spans: null,
	key: "s",
	flags: 1,
	space_chance: 100,
	sentence_chance: 0,
	default_priority: 60,
	icon_state: "swarmer",
	syllables: null,
});

// swarmer.dm:7
rt.def("/datum/language/swarmer/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.spans = list("robot");
	this.syllables = list("C", "C", "C#", "Db", "D", "D", "D#", "Eb", "E", "E", "F", "F", "F#", "Gb", "G", "G", "G#", "Ab", "A", "A", "A#", "Bb", "B", "B");
	return f.dot;
});
