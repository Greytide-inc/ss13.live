// From code/modules/language/drone.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /datum/language/drone/proc/<init>  (code/modules/language/drone.dm:7)
rt.def("/datum/language/drone/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "spans", rt.list("robot"));
	rt.setSv(f, "syllables", rt.list(".", "|"));
	return f.dot;
});
