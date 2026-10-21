// From code/datums/diseases/rhumba_beat.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(961, "/datum/disease/rhumba_beat", "/datum/disease", {
	name: "The Rhumba Beat",
	max_stages: 5,
	spread_text: "On contact",
	spread_flags: 32,
	cure_text: "Chick Chicky Boom!",
	cures: null,
	agent: "Unknown",
	permeability_mod: 1,
	severity: "BIOHAZARD THREAT!",
	viable_mobtypes: null,
});

// /datum/disease/rhumba_beat/proc/<init>  (code/datums/diseases/rhumba_beat.dm:7)
rt.def("/datum/disease/rhumba_beat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "cures", rt.list("plasma"));
	$0 = $0;
	rt.setSv(f, "viable_mobtypes", rt.list(T("/mob/living/carbon/human")));
	return f.dot;
});

// /datum/disease/rhumba_beat/proc/stage_act  (code/datums/diseases/rhumba_beat.dm:14)  may sleep
rt.def("/datum/disease/rhumba_beat/proc/stage_act", function* stage_act(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (isEqual(rt.fv(f, "ckey", rt.sv(f, "affected_mob")), "rosham")) {
		yield* g.callName(f, live(f.src), "cure", []);
		return live(f.dot);
	}
	$0 = rt.sv(f, "stage");
	if ($0 === 2) {
		if (truthy(rt.op(f, "Prob", [], [45]))) {
			yield* g.callName(f, rt.sv(f, "affected_mob"), "adjustToxLoss", [5]);
			yield* g.callName(f, rt.sv(f, "affected_mob"), "updatehealth", []);
		}
		if (truthy(rt.op(f, "Prob", [], [1]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='danger'>You feel strange...</span>"]);
		}
	} else if ($0 === 3) {
		if (truthy(rt.op(f, "Prob", [], [5]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='danger'>You feel the urge to dance...</span>"]);
		} else {
			if (truthy(rt.op(f, "Prob", [], [5]))) {
				yield* g.callName(f, rt.sv(f, "affected_mob"), "emote", ["gasp"]);
			} else {
				if (truthy(rt.op(f, "Prob", [], [10]))) {
					yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='danger'>You feel the need to chick chicky boom...</span>"]);
				}
			}
		}
	} else if ($0 === 4) {
		if (truthy(rt.op(f, "Prob", [], [10]))) {
			yield* g.callName(f, rt.sv(f, "affected_mob"), "emote", ["gasp"]);
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='danger'>You feel a burning beat inside...</span>"]);
		}
		if (truthy(rt.op(f, "Prob", [], [20]))) {
			yield* g.callName(f, rt.sv(f, "affected_mob"), "adjustToxLoss", [5]);
			yield* g.callName(f, rt.sv(f, "affected_mob"), "updatehealth", []);
		}
	} else if ($0 === 5) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='danger'>Your body is unable to contain the Rhumba Beat...</span>"]);
		if (!truthy(rt.op(f, "Prob", [], [50]))) return f.dot;
		yield* g.callName(f, rt.sv(f, "affected_mob"), "gib", []);
	} else {
		return live(f.dot);
	}
	return f.dot;
}, true);
