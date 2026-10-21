// From code/datums/diseases/cold9.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(951, "/datum/disease/cold9", "/datum/disease", {
	name: "The Cold",
	max_stages: 3,
	spread_text: "On contact",
	spread_flags: 32,
	cure_text: "Common Cold Anti-bodies & Spaceacillin",
	cures: null,
	agent: "ICE9-rhinovirus",
	desc: "If left untreated the subject will slow, as if partly frozen.",
	severity: "Medium",
	viable_mobtypes: null,
});

// /datum/disease/cold9/proc/<init>  (code/datums/diseases/cold9.dm:7)
rt.def("/datum/disease/cold9/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "cures", rt.list("spaceacillin"));
	$0 = $0;
	rt.setSv(f, "viable_mobtypes", rt.list(T("/mob/living/carbon/human")));
	return f.dot;
});

// /datum/disease/cold9/proc/stage_act  (code/datums/diseases/cold9.dm:14)  may sleep
rt.def("/datum/disease/cold9/proc/stage_act", function* stage_act(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	yield* g.callSuper(f, [], rt.Args.Same);
	$0 = rt.sv(f, "stage");
	if ($0 === 2) {
		(rt.modField(f, rt.sv(f, "affected_mob"), "bodytemperature", 10, subtract));
		if ((truthy(rt.op(f, "Prob", [], [1])) && truthy(rt.op(f, "Prob", [], [10])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='notice'>You feel better.</span>"]);
			yield* g.srcCall(f, "cure");
			return live(f.dot);
		}
		if (truthy(rt.op(f, "Prob", [], [1]))) {
			yield* g.callName(f, rt.sv(f, "affected_mob"), "emote", ["sneeze"]);
		}
		if (truthy(rt.op(f, "Prob", [], [1]))) {
			yield* g.callName(f, rt.sv(f, "affected_mob"), "emote", ["cough"]);
		}
		if (truthy(rt.op(f, "Prob", [], [1]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='danger'>Your throat feels sore.</span>"]);
		}
		if (truthy(rt.op(f, "Prob", [], [5]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='danger'>You feel stiff.</span>"]);
		}
	} else if ($0 === 3) {
		(rt.modField(f, rt.sv(f, "affected_mob"), "bodytemperature", 20, subtract));
		if (truthy(rt.op(f, "Prob", [], [1]))) {
			yield* g.callName(f, rt.sv(f, "affected_mob"), "emote", ["sneeze"]);
		}
		if (truthy(rt.op(f, "Prob", [], [1]))) {
			yield* g.callName(f, rt.sv(f, "affected_mob"), "emote", ["cough"]);
		}
		if (truthy(rt.op(f, "Prob", [], [1]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='danger'>Your throat feels sore.</span>"]);
		}
		if (!truthy(rt.op(f, "Prob", [], [10]))) return f.dot;
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='danger'>You feel stiff.</span>"]);
	}
	return f.dot;
}, true);
