// From code/datums/diseases/anxiety.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(946, "/datum/disease/anxiety", "/datum/disease", {
	name: "Severe Anxiety",
	form: "Infection",
	max_stages: 4,
	spread_text: "On contact",
	spread_flags: 32,
	cure_text: "Ethanol",
	cures: null,
	agent: "Excess Lepidopticides",
	desc: "If left untreated subject will regurgitate butterflies.",
	severity: "Medium",
	viable_mobtypes: null,
});

// /datum/disease/anxiety/proc/<init>  (code/datums/diseases/anxiety.dm:8)
rt.def("/datum/disease/anxiety/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "cures", rt.list("ethanol"));
	$0 = $0;
	rt.setSv(f, "viable_mobtypes", rt.list(T("/mob/living/carbon/human"), T("/mob/living/carbon/monkey")));
	return f.dot;
});

// /datum/disease/anxiety/proc/stage_act  (code/datums/diseases/anxiety.dm:15)  may sleep
rt.def("/datum/disease/anxiety/proc/stage_act", function* stage_act(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	yield* g.callSuper(f, [], rt.Args.Same);
	$0 = rt.sv(f, "stage");
	if ($0 === 2) {
		if (truthy(rt.op(f, "Prob", [], [5]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='notice'>You feel anxious.</span>"]);
		}
	} else if ($0 === 3) {
		if (truthy(rt.op(f, "Prob", [], [10]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='notice'>Your stomach flutters.</span>"]);
		}
		if (truthy(rt.op(f, "Prob", [], [5]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='notice'>You feel panicky.</span>"]);
		}
		if (truthy(rt.op(f, "Prob", [], [2]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='danger'>You're overtaken with panic!</span>"]);
			rt.modField(f, rt.sv(f, "affected_mob"), "confused", (yield* g.call(f, P("/proc/rand"), null, [2, 3])), add);
		}
	} else if ($0 === 4) {
		if (truthy(rt.op(f, "Prob", [], [10]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='danger'>You feel butterflies in your stomach.</span>"]);
		}
		if (truthy(rt.op(f, "Prob", [], [5]))) {
			yield* g.callName(f, rt.sv(f, "affected_mob"), "visible_message", [fmt("<span class='danger'>＀ stumbles around in a panic.</span>", [rt.sv(f, "affected_mob")]), "<span class='userdanger'>You have a panic attack!</span>"]);
			rt.modField(f, rt.sv(f, "affected_mob"), "confused", (yield* g.call(f, P("/proc/rand"), null, [6, 8])), add);
			rt.modField(f, rt.sv(f, "affected_mob"), "jitteriness", (yield* g.call(f, P("/proc/rand"), null, [6, 8])), add);
		}
		if (truthy(rt.op(f, "Prob", [], [2]))) {
			yield* g.callName(f, rt.sv(f, "affected_mob"), "visible_message", [fmt("<span class='danger'>＀ coughs up butterflies!</span>", [rt.sv(f, "affected_mob")]), "<span class='userdanger'>You cough up butterflies!</span>"]);
			yield* g.new_(f, T("/mob/living/simple_animal/butterfly"), [rt.fv(f, "loc", rt.sv(f, "affected_mob"))]);
			yield* g.new_(f, T("/mob/living/simple_animal/butterfly"), [rt.fv(f, "loc", rt.sv(f, "affected_mob"))]);
		}
	}
	return live(f.dot);
}, true);
