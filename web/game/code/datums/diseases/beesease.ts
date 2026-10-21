// From code/datums/diseases/beesease.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(948, "/datum/disease/beesease", "/datum/disease", {
	name: "Beesease",
	form: "Infection",
	max_stages: 4,
	spread_text: "On contact",
	spread_flags: 32,
	cure_text: "Sugar",
	cures: null,
	agent: "Apidae Infection",
	desc: "If left untreated subject will regurgitate bees.",
	severity: "Dangerous!",
	viable_mobtypes: null,
});

// /datum/disease/beesease/proc/<init>  (code/datums/diseases/beesease.dm:8)
rt.def("/datum/disease/beesease/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "cures", rt.list("sugar"));
	$0 = $0;
	rt.setSv(f, "viable_mobtypes", rt.list(T("/mob/living/carbon/human"), T("/mob/living/carbon/monkey")));
	return f.dot;
});

// /datum/disease/beesease/proc/stage_act  (code/datums/diseases/beesease.dm:15)  may sleep
rt.def("/datum/disease/beesease/proc/stage_act", function* stage_act(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	yield* g.callSuper(f, [], rt.Args.Same);
	$0 = rt.sv(f, "stage");
	if ($0 === 2) {
		if (truthy(rt.op(f, "Prob", [], [2]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='notice'>You taste honey in your mouth.</span>"]);
		}
	} else if ($0 === 3) {
		if (truthy(rt.op(f, "Prob", [], [10]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='notice'>Your stomach rumbles.</span>"]);
		}
		if (truthy(rt.op(f, "Prob", [], [2]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='danger'>Your stomach stings painfully.</span>"]);
			if (truthy(rt.op(f, "Prob", [], [20]))) {
				yield* g.callName(f, rt.sv(f, "affected_mob"), "adjustToxLoss", [2]);
				yield* g.callName(f, rt.sv(f, "affected_mob"), "updatehealth", []);
			}
		}
	} else if ($0 === 4) {
		if (truthy(rt.op(f, "Prob", [], [10]))) {
			yield* g.callName(f, rt.sv(f, "affected_mob"), "visible_message", [fmt("<span class='danger'>＀ buzzes.</span>", [rt.sv(f, "affected_mob")]), "<span class='userdanger'>Your stomach buzzes violently!</span>"]);
		}
		if (truthy(rt.op(f, "Prob", [], [5]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='danger'>You feel something moving in your throat.</span>"]);
		}
		if (truthy(rt.op(f, "Prob", [], [1]))) {
			yield* g.callName(f, rt.sv(f, "affected_mob"), "visible_message", [fmt("<span class='danger'>＀ coughs up a swarm of bees!</span>", [rt.sv(f, "affected_mob")]), "<span class='userdanger'>You cough up a swarm of bees!</span>"]);
			yield* g.new_(f, T("/mob/living/simple_animal/hostile/poison/bees"), [rt.fv(f, "loc", rt.sv(f, "affected_mob"))]);
		}
	}
	return live(f.dot);
}, true);
