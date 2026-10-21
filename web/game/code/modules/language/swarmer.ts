// From code/modules/language/swarmer.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /datum/language/swarmer/proc/<init>  (code/modules/language/swarmer.dm:7)
rt.def("/datum/language/swarmer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "spans", rt.list("robot"));
	rt.setSv(f, "syllables", rt.list("C", "C", "C#", "Db", "D", "D", "D#", "Eb", "E", "E", "F", "F", "F#", "Gb", "G", "G", "G#", "Ab", "A", "A", "A#", "Bb", "B", "B"));
	return f.dot;
});
