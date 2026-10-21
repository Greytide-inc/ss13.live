// From code/datums/diseases/gbs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(956, "/datum/disease/gbs", "/datum/disease", {
	name: "GBS",
	max_stages: 5,
	spread_text: "On contact",
	spread_flags: 32,
	cure_text: "Synaptizine & Sulfur",
	cures: null,
	cure_chance: 15,
	agent: "Gravitokinetic Bipotential SADS+",
	disease_flags: 7,
	permeability_mod: 1,
	severity: "BIOHAZARD THREAT!",
	viable_mobtypes: null,
});

// /datum/disease/gbs/proc/<init>  (code/datums/diseases/gbs.dm:10)
rt.def("/datum/disease/gbs/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "cures", rt.list("synaptizine", "sulfur"));
	$0 = $0;
	rt.setSv(f, "viable_mobtypes", rt.list(T("/mob/living/carbon/human")));
	return f.dot;
});

// /datum/disease/gbs/proc/stage_act  (code/datums/diseases/gbs.dm:16)  may sleep
rt.def("/datum/disease/gbs/proc/stage_act", function* stage_act(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	yield* g.callSuper(f, [], rt.Args.Same);
	$0 = rt.sv(f, "stage");
	if ($0 === 2) {
		if (truthy(rt.op(f, "Prob", [], [45]))) {
			yield* g.callName(f, rt.sv(f, "affected_mob"), "adjustToxLoss", [5]);
			yield* g.callName(f, rt.sv(f, "affected_mob"), "updatehealth", []);
		}
		if (truthy(rt.op(f, "Prob", [], [1]))) {
			yield* g.callName(f, rt.sv(f, "affected_mob"), "emote", ["sneeze"]);
		}
	} else if ($0 === 3) {
		if (truthy(rt.op(f, "Prob", [], [5]))) {
			yield* g.callName(f, rt.sv(f, "affected_mob"), "emote", ["cough"]);
		} else {
			if (truthy(rt.op(f, "Prob", [], [5]))) {
				yield* g.callName(f, rt.sv(f, "affected_mob"), "emote", ["gasp"]);
			}
		}
		if (truthy(rt.op(f, "Prob", [], [10]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='danger'>You're starting to feel very weak...</span>"]);
		}
	} else if ($0 === 4) {
		if (truthy(rt.op(f, "Prob", [], [10]))) {
			yield* g.callName(f, rt.sv(f, "affected_mob"), "emote", ["cough"]);
		}
		yield* g.callName(f, rt.sv(f, "affected_mob"), "adjustToxLoss", [5]);
		yield* g.callName(f, rt.sv(f, "affected_mob"), "updatehealth", []);
	} else if ($0 === 5) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='danger'>Your body feels as if it's trying to rip itself open...</span>"]);
		if (!truthy(rt.op(f, "Prob", [], [50]))) return f.dot;
		yield* g.callName(f, rt.sv(f, "affected_mob"), "gib", []);
	} else {
		return live(f.dot);
	}
	return f.dot;
}, true);
