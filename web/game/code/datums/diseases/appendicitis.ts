// From code/datums/diseases/appendicitis.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(947, "/datum/disease/appendicitis", "/datum/disease", {
	form: "Condition",
	name: "Appendicitis",
	max_stages: 3,
	cure_text: "Surgery",
	agent: "Shitty Appendix",
	permeability_mod: 1,
	desc: "If left untreated the subject will become very weak, and may vomit often.",
	severity: "Dangerous!",
	longevity: 1000,
	disease_flags: 6,
	spread_flags: 2,
	visibility_flags: 2,
	viable_mobtypes: null,
	required_organs: null,
});

// /datum/disease/appendicitis/proc/<init>  (code/datums/diseases/appendicitis.dm:7)
rt.def("/datum/disease/appendicitis/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "viable_mobtypes", rt.list(T("/mob/living/carbon/human")));
	$0 = $0;
	rt.setSv(f, "required_organs", rt.list(T("/obj/item/organ/appendix")));
	return f.dot;
});

// /datum/disease/appendicitis/proc/stage_act  (code/datums/diseases/appendicitis.dm:18)  may sleep
rt.def("/datum/disease/appendicitis/proc/stage_act", function* stage_act(f: Frame) {
	let A: Value = null;
	let $0: any;
	f.vars = () => [A, $0];
	yield* g.callSuper(f, [], rt.Args.Same);
	$0 = rt.sv(f, "stage");
	if ($0 === 1) {
		if (truthy(rt.op(f, "Prob", [], [5]))) {
			yield* g.callName(f, rt.sv(f, "affected_mob"), "emote", ["cough"]);
		}
	} else if ($0 === 2) {
		if (truthy((A = (yield* g.callName(f, rt.sv(f, "affected_mob"), "getorgan", [T("/obj/item/organ/appendix")]))))) {
			rt.setFv(f, "inflamed", live(A), 1);
			yield* g.callName(f, live(A), "update_icon", []);
		}
		if (truthy(rt.op(f, "Prob", [], [3]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='warning'>You feel a stabbing pain in your abdomen!</span>"]);
			yield* g.callName(f, rt.sv(f, "affected_mob"), "Stun", [(yield* g.call(f, P("/proc/rand"), null, [40, 60]))]);
			yield* g.callName(f, rt.sv(f, "affected_mob"), "adjustToxLoss", [1]);
		}
	} else if ($0 === 3) {
		if (!truthy(rt.op(f, "Prob", [], [1]))) return f.dot;
		yield* g.callName(f, rt.sv(f, "affected_mob"), "vomit", [95]);
	}
	return f.dot;
}, true);
