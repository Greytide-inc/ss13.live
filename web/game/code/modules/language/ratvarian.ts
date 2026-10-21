// From code/modules/language/ratvarian.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /datum/language/ratvar/proc/<init>  (code/modules/language/ratvarian.dm:10)
rt.def("/datum/language/ratvar/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "spans", rt.list("robot"));
	return f.dot;
});

// /datum/language/ratvar/proc/scramble  (code/modules/language/ratvarian.dm:14)
rt.def("/datum/language/ratvar/proc/scramble", function scramble(f: Frame, input: Value) {
	f.dot = rt.call(f, P("/proc/text2ratvar"), null, [live(input)]);
	return f.dot;
});

// /datum/language/ratvar/proc/get_spoken_verb  (code/modules/language/ratvarian.dm:17)
rt.def("/datum/language/ratvar/proc/get_spoken_verb", function get_spoken_verb(f: Frame) {
	if (!truthy(live(f.args[0]))) {
		return rt.op(f, "PickUnweighted", [1], [rt.gl("random_speech_verbs")]);
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["msg_end"] });
