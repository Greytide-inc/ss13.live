// From code/modules/surgery/organs/appendix.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9486, "/obj/item/organ/appendix", "/obj/item/organ", {
	inflamed: 0,
	name: "appendix",
	icon_state: "appendix",
	zone: "groin",
	slot: "appendix",
});

// /obj/item/organ/appendix/proc/update_icon  (code/modules/surgery/organs/appendix.dm:10)
rt.def("/obj/item/organ/appendix/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.sv(f, "inflamed"))) {
		rt.setSv(f, "icon_state", "appendixinflamed");
		rt.setSv(f, "name", "inflamed appendix");
	} else {
		rt.setSv(f, "icon_state", "appendix");
		rt.setSv(f, "name", "appendix");
	}
	return f.dot;
});

// /obj/item/organ/appendix/proc/Remove  (code/modules/surgery/organs/appendix.dm:17)  may sleep
rt.def("/obj/item/organ/appendix/proc/Remove", function* Remove(f: Frame) {
	let A: Value = null;
	let $e: any;
	f.vars = () => [A, $e];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	A = null;
	rt.forList(f, 0, rt.fv(f, "viruses", live(f.args[0])), T("/datum/disease/appendicitis"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		yield* g.callName(f, live(A), "cure", []);
		rt.setSv(f, "inflamed", 1);
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "update_icon");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M", "special"] });

// /obj/item/organ/appendix/proc/Insert  (code/modules/surgery/organs/appendix.dm:24)  may sleep
rt.def("/obj/item/organ/appendix/proc/Insert", function* Insert(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "inflamed"))) return f.dot;
	yield* g.callName(f, live(f.args[0]), "AddDisease", [(yield* g.new_(f, T("/datum/disease/appendicitis"), []))]);
	return f.dot;
}, true, { args: ["M", "special"] });

// /obj/item/organ/appendix/proc/prepare_eat  (code/modules/surgery/organs/appendix.dm:29)  may sleep
rt.def("/obj/item/organ/appendix/proc/prepare_eat", function* prepare_eat(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	S = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(rt.sv(f, "inflamed"))) {
		yield* g.callName(f, rt.fv(f, "reagents", live(S)), "add_reagent", ["bad_food", 5]);
	}
	return live(S);
}, true);
