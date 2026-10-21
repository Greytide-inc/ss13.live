// From code/datums/diseases/advance/symptoms/sneeze.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1012, "/datum/symptom/sneeze", "/datum/symptom", {
	name: "Sneezing",
	stealth: -2,
	resistance: 3,
	stage_speed: 0,
	transmittable: 4,
	level: 1,
	severity: 1,
});

// /datum/symptom/sneeze/proc/Activate  (code/datums/diseases/advance/symptoms/sneeze.dm:30)  may sleep
rt.def("/datum/symptom/sneeze/proc/Activate", function* Activate(f: Frame) {
	let M: Value = null;
	let $0: any;
	f.vars = () => [M, $0];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.op(f, "Prob", [], [rt.gl("SYMPTOM_ACTIVATION_PROB")]))) {
		M = rt.fv(f, "affected_mob", live(f.args[0]));
		$0 = rt.fv(f, "stage", live(f.args[0]));
		if ($0 === 1 || $0 === 2 || $0 === 3) {
			yield* g.callName(f, live(M), "emote", ["sniff"]);
		} else {
			yield* g.callName(f, live(M), "emote", ["sneeze"]);
			yield* g.callName(f, live(f.args[0]), "spread", [rt.fv(f, "holder", live(f.args[0])), 5]);
		}
	}
	return live(f.dot);
}, true, { args: ["A"] });
