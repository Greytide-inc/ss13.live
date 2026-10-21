// From code/datums/diseases/flu.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(954, "/datum/disease/flu", "/datum/disease", {
	name: "The Flu",
	max_stages: 3,
	spread_text: "Airborne",
	cure_text: "Spaceacillin",
	cures: null,
	cure_chance: 10,
	agent: "H13N1 flu virion",
	permeability_mod: 0.75,
	desc: "If left untreated the subject will feel quite unwell.",
	severity: "Medium",
	viable_mobtypes: null,
});

// /datum/disease/flu/proc/<init>  (code/datums/diseases/flu.dm:6)
rt.def("/datum/disease/flu/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "cures", rt.list("spaceacillin"));
	$0 = $0;
	rt.setSv(f, "viable_mobtypes", rt.list(T("/mob/living/carbon/human"), T("/mob/living/carbon/monkey")));
	return f.dot;
});

// /datum/disease/flu/proc/stage_act  (code/datums/diseases/flu.dm:15)  may sleep
rt.def("/datum/disease/flu/proc/stage_act", function* stage_act(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	yield* g.callSuper(f, [], rt.Args.Same);
	$0 = rt.sv(f, "stage");
	if ($0 === 2) {
		if ((truthy(rt.fv(f, "lying", rt.sv(f, "affected_mob"))) && truthy(rt.op(f, "Prob", [], [20])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='notice'>You feel better.</span>"]);
			rt.incSrcVar(f, "stage", -1, true);
			return live(f.dot);
		}
		if (truthy(rt.op(f, "Prob", [], [1]))) {
			yield* g.callName(f, rt.sv(f, "affected_mob"), "emote", ["sneeze"]);
		}
		if (truthy(rt.op(f, "Prob", [], [1]))) {
			yield* g.callName(f, rt.sv(f, "affected_mob"), "emote", ["cough"]);
		}
		if (truthy(rt.op(f, "Prob", [], [1]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='danger'>Your muscles ache.</span>"]);
			if (truthy(rt.op(f, "Prob", [], [20]))) {
				yield* g.callName(f, rt.sv(f, "affected_mob"), "take_bodypart_damage", [1]);
			}
		}
		if (truthy(rt.op(f, "Prob", [], [1]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='danger'>Your stomach hurts.</span>"]);
			if (truthy(rt.op(f, "Prob", [], [20]))) {
				yield* g.callName(f, rt.sv(f, "affected_mob"), "adjustToxLoss", [1]);
				yield* g.callName(f, rt.sv(f, "affected_mob"), "updatehealth", []);
			}
		}
	} else if ($0 === 3) {
		if ((truthy(rt.fv(f, "lying", rt.sv(f, "affected_mob"))) && truthy(rt.op(f, "Prob", [], [15])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='notice'>You feel better.</span>"]);
			rt.incSrcVar(f, "stage", -1, true);
			return live(f.dot);
		}
		if (truthy(rt.op(f, "Prob", [], [1]))) {
			yield* g.callName(f, rt.sv(f, "affected_mob"), "emote", ["sneeze"]);
		}
		if (truthy(rt.op(f, "Prob", [], [1]))) {
			yield* g.callName(f, rt.sv(f, "affected_mob"), "emote", ["cough"]);
		}
		if (truthy(rt.op(f, "Prob", [], [1]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='danger'>Your muscles ache.</span>"]);
			if (truthy(rt.op(f, "Prob", [], [20]))) {
				yield* g.callName(f, rt.sv(f, "affected_mob"), "take_bodypart_damage", [1]);
			}
		}
		if (truthy(rt.op(f, "Prob", [], [1]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='danger'>Your stomach hurts.</span>"]);
			if (truthy(rt.op(f, "Prob", [], [20]))) {
				yield* g.callName(f, rt.sv(f, "affected_mob"), "adjustToxLoss", [1]);
				yield* g.callName(f, rt.sv(f, "affected_mob"), "updatehealth", []);
			}
		}
	}
	return live(f.dot);
}, true);
