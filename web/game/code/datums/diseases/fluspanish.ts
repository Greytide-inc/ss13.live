// From code/datums/diseases/fluspanish.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(955, "/datum/disease/fluspanish", "/datum/disease", {
	name: "Spanish inquisition Flu",
	max_stages: 3,
	spread_text: "Airborne",
	cure_text: "Spaceacillin & Anti-bodies to the common flu",
	cures: null,
	cure_chance: 10,
	agent: "1nqu1s1t10n flu virion",
	permeability_mod: 0.75,
	desc: "If left untreated the subject will burn to death for being a heretic.",
	severity: "Dangerous!",
	viable_mobtypes: null,
});

// /datum/disease/fluspanish/proc/<init>  (code/datums/diseases/fluspanish.dm:6)
rt.def("/datum/disease/fluspanish/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "cures", rt.list("spaceacillin"));
	$0 = $0;
	rt.setSv(f, "viable_mobtypes", rt.list(T("/mob/living/carbon/human")));
	return f.dot;
});

// /datum/disease/fluspanish/proc/stage_act  (code/datums/diseases/fluspanish.dm:15)  may sleep
rt.def("/datum/disease/fluspanish/proc/stage_act", function* stage_act(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	yield* g.callSuper(f, [], rt.Args.Same);
	$0 = rt.sv(f, "stage");
	if ($0 === 2) {
		rt.modField(f, rt.sv(f, "affected_mob"), "bodytemperature", 10, add);
		if (truthy(rt.op(f, "Prob", [], [5]))) {
			yield* g.callName(f, rt.sv(f, "affected_mob"), "emote", ["sneeze"]);
		}
		if (truthy(rt.op(f, "Prob", [], [5]))) {
			yield* g.callName(f, rt.sv(f, "affected_mob"), "emote", ["cough"]);
		}
		if (truthy(rt.op(f, "Prob", [], [1]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='danger'>You're burning in your own skin!</span>"]);
			yield* g.callName(f, rt.sv(f, "affected_mob"), "take_bodypart_damage", [0, 5]);
		}
	} else if ($0 === 3) {
		rt.modField(f, rt.sv(f, "affected_mob"), "bodytemperature", 20, add);
		if (truthy(rt.op(f, "Prob", [], [5]))) {
			yield* g.callName(f, rt.sv(f, "affected_mob"), "emote", ["sneeze"]);
		}
		if (truthy(rt.op(f, "Prob", [], [5]))) {
			yield* g.callName(f, rt.sv(f, "affected_mob"), "emote", ["cough"]);
		}
		if (truthy(rt.op(f, "Prob", [], [5]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='danger'>You're burning in your own skin!</span>"]);
			yield* g.callName(f, rt.sv(f, "affected_mob"), "take_bodypart_damage", [0, 5]);
		}
	}
	return live(f.dot);
}, true);
