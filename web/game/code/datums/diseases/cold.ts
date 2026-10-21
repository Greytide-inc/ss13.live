// From code/datums/diseases/cold.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(950, "/datum/disease/cold", "/datum/disease", {
	name: "The Cold",
	max_stages: 3,
	spread_flags: 64,
	cure_text: "Rest & Spaceacillin",
	cures: null,
	agent: "XY-rhinovirus",
	permeability_mod: 0.5,
	desc: "If left untreated the subject will contract the flu.",
	severity: "Minor",
	viable_mobtypes: null,
});

// /datum/disease/cold/proc/<init>  (code/datums/diseases/cold.dm:6)
rt.def("/datum/disease/cold/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "cures", rt.list("spaceacillin"));
	$0 = $0;
	rt.setSv(f, "viable_mobtypes", rt.list(T("/mob/living/carbon/human"), T("/mob/living/carbon/monkey")));
	return f.dot;
});

// /datum/disease/cold/proc/stage_act  (code/datums/diseases/cold.dm:14)  may sleep
rt.def("/datum/disease/cold/proc/stage_act", function* stage_act(f: Frame) {
	let Flu: Value = null;
	let $0: any;
	f.vars = () => [Flu, $0];
	yield* g.callSuper(f, [], rt.Args.Same);
	$0 = rt.sv(f, "stage");
	if ($0 === 2) {
		if ((truthy(rt.fv(f, "lying", rt.sv(f, "affected_mob"))) && truthy(rt.op(f, "Prob", [], [40])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='notice'>You feel better.</span>"]);
			yield* g.srcCall(f, "cure");
			return live(f.dot);
		}
		if ((truthy(rt.op(f, "Prob", [], [1])) && truthy(rt.op(f, "Prob", [], [5])))) {
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
		if (truthy(rt.op(f, "Prob", [], [1]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='danger'>Mucous runs down the back of your throat.</span>"]);
		}
	} else if ($0 === 3) {
		if ((truthy(rt.fv(f, "lying", rt.sv(f, "affected_mob"))) && truthy(rt.op(f, "Prob", [], [25])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='notice'>You feel better.</span>"]);
			yield* g.srcCall(f, "cure");
			return live(f.dot);
		}
		if ((truthy(rt.op(f, "Prob", [], [1])) && truthy(rt.op(f, "Prob", [], [1])))) {
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
		if (truthy(rt.op(f, "Prob", [], [1]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='danger'>Mucous runs down the back of your throat.</span>"]);
		}
		if (!(truthy(rt.op(f, "Prob", [], [1])) && truthy(rt.op(f, "Prob", [], [50])))) return f.dot;
		if (truthy((yield* g.callName(f, rt.fv(f, "resistances", rt.sv(f, "affected_mob")), "Find", [T("/datum/disease/flu")])))) return f.dot;
		Flu = (yield* g.new_(f, T("/datum/disease/flu"), [0]));
		yield* g.callName(f, rt.sv(f, "affected_mob"), "ContractDisease", [live(Flu)]);
		yield* g.srcCall(f, "cure");
	}
	return f.dot;
}, true);
