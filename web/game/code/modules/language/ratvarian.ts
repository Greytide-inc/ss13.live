// Based on /tg/station's code/modules/language/ratvarian.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(2784, "/datum/language/ratvar", "/datum/language", {
	name: "Ratvarian",
	desc: "A timeless language full of power and incomprehensible to the unenlightened.",
	ask_verb: "requests",
	exclaim_verb: "proclaims",
	whisper_verb: "imparts",
	key: "r",
	default_priority: 10,
	spans: null,
	icon_state: "ratvar",
}, { global: { random_speech_verbs: 670 } });

// ratvarian.dm:10
rt.def("/datum/language/ratvar/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.spans = list("robot");
	return f.dot;
});

// ratvarian.dm:14
rt.def("/datum/language/ratvar/proc/scramble", function scramble(f: Frame, input: Value) {
	f.dot = text2ratvar(input);
	return f.dot;
});
