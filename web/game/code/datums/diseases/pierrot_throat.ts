// From code/datums/diseases/pierrot_throat.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(959, "/datum/disease/pierrot_throat", "/datum/disease", {
	name: "Pierrot's Throat",
	max_stages: 4,
	spread_text: "Airborne",
	cure_text: "Banana products, especially banana bread.",
	cures: null,
	cure_chance: 75,
	agent: "H0NI<42 Virus",
	permeability_mod: 0.75,
	desc: "If left untreated the subject will probably drive others to insanity.",
	severity: "Medium",
	longevity: 400,
	viable_mobtypes: null,
});

// /datum/disease/pierrot_throat/proc/<init>  (code/datums/diseases/pierrot_throat.dm:6)
rt.def("/datum/disease/pierrot_throat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "cures", rt.list("banana"));
	$0 = $0;
	rt.setSv(f, "viable_mobtypes", rt.list(T("/mob/living/carbon/human")));
	return f.dot;
});

// /datum/disease/pierrot_throat/proc/stage_act  (code/datums/diseases/pierrot_throat.dm:16)  may sleep
rt.def("/datum/disease/pierrot_throat/proc/stage_act", function* stage_act(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	yield* g.callSuper(f, [], rt.Args.Same);
	$0 = rt.sv(f, "stage");
	if ($0 === 1) {
		if (truthy(rt.op(f, "Prob", [], [10]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='danger'>You feel a little silly.</span>"]);
		}
	} else if ($0 === 2) {
		if (truthy(rt.op(f, "Prob", [], [10]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='danger'>You start seeing rainbows.</span>"]);
		}
	} else if ($0 === 3) {
		if (truthy(rt.op(f, "Prob", [], [10]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='danger'>Your thoughts are interrupted by a loud <b>HONK!</b></span>"]);
		}
	} else if ($0 === 4) {
		if (!truthy(rt.op(f, "Prob", [], [5]))) return f.dot;
		yield* g.callName(f, rt.sv(f, "affected_mob"), "say", [rt.op(f, "PickUnweighted", [1], [rt.list("HONK!", "Honk!", "Honk.", "Honk?", "Honk!!", "Honk?!", "Honk...")])]);
	}
	return f.dot;
}, true);
