// Based on /tg/station's code/modules/language/drone.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(2780, "/datum/language/drone", "/datum/language", {
	name: "Drone",
	desc: "A heavily encoded damage control coordination stream, with special flags for hats.",
	speech_verb: "chitters",
	ask_verb: "chitters inquisitively",
	exclaim_verb: "chitters loudly",
	spans: null,
	key: "d",
	flags: 1,
	syllables: null,
	space_chance: 0,
	sentence_chance: 0,
	default_priority: 20,
	icon_state: "drone",
});

// drone.dm:7
rt.def("/datum/language/drone/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.spans = list("robot");
	this.syllables = list(".", "|");
	return f.dot;
});
