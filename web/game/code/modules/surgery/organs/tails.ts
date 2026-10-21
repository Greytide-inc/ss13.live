// From code/modules/surgery/organs/tails.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9522, "/obj/item/organ/tail/cat", "/obj/item/organ/tail", {
	name: "cat tail",
	desc: "Who's wagging now?",
	icon_state: "severedtail",
});

// /obj/item/organ/tail/cat/proc/Insert  (code/modules/surgery/organs/tails.dm:13)  may sleep
rt.def("/obj/item/organ/tail/cat/proc/Insert", function* Insert(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "color", rt.fv(f, "hair_color", live(f.args[0])));
	rt.setAt(rt.gv(f, "features", rt.fv(f, "dna", live(f.args[0]))), "tail_human", "Cat");
	yield* g.callName(f, live(f.args[0]), "update_body", []);
	return f.dot;
}, true, { args: ["H", "special", "drop_if_replaced"] });

// /obj/item/organ/ears/cat/proc/Remove  (code/modules/surgery/organs/tails.dm:19)  may sleep
rt.def("/obj/item/organ/ears/cat/proc/Remove", function* Remove(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, live(f.args[0]), "endTailWag", []);
	rt.setAt(rt.gv(f, "features", rt.fv(f, "dna", live(f.args[0]))), "tail_human", "None");
	rt.setSv(f, "color", rt.fv(f, "hair_color", live(f.args[0])));
	yield* g.callName(f, live(f.args[0]), "update_body", []);
	return f.dot;
}, true, { args: ["H", "special"] });
