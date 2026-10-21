// From code/modules/language/machine.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /datum/language/machine/proc/<init>  (code/modules/language/machine.dm:7)
rt.def("/datum/language/machine/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "spans", rt.list("robot"));
	rt.setSv(f, "syllables", rt.list("beep", "beep", "beep", "beep", "beep", "boop", "boop", "boop", "bop", "bop", "dee", "dee", "doo", "doo", "hiss", "hss", "buzz", "buzz", "bzz", "ksssh", "keey", "wurr", "wahh", "tzzz"));
	return f.dot;
});

// /datum/language/machine/proc/get_random_name  (code/modules/language/machine.dm:17)
rt.def("/datum/language/machine/proc/get_random_name", function get_random_name(f: Frame) {
	if (truthy(rt.op(f, "Prob", [], [70]))) {
		return fmt("＀-＀", [rt.op(f, "PickUnweighted", [1], [rt.gl("posibrain_names")]), rt.call(f, P("/proc/rand"), null, [100, 999])]);
	}
	return rt.op(f, "PickUnweighted", [1], [rt.gl("ai_names")]);
});
