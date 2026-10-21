// From code/datums/diseases/advance/symptoms/cough.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(986, "/datum/symptom/cough", "/datum/symptom", {
	name: "Cough",
	stealth: -1,
	resistance: 3,
	stage_speed: 1,
	transmittable: 2,
	level: 1,
	severity: 1,
});

// /datum/symptom/cough/proc/Activate  (code/datums/diseases/advance/symptoms/cough.dm:29)  may sleep
rt.def("/datum/symptom/cough/proc/Activate", function* Activate(f: Frame) {
	let M: Value = null, I: Value = null;
	let $0: any;
	f.vars = () => [M, I, $0];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.op(f, "Prob", [], [rt.gl("SYMPTOM_ACTIVATION_PROB")]))) {
		M = rt.fv(f, "affected_mob", live(f.args[0]));
		$0 = rt.fv(f, "stage", live(f.args[0]));
		if ($0 === 1 || $0 === 2 || $0 === 3) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span notice='warning'>＀</span>", [rt.op(f, "PickUnweighted", [2], ["You swallow excess mucus.", "You lightly cough."])])]);
		} else {
			yield* g.callName(f, live(M), "emote", ["cough"]);
			if ((truthy((I = (yield* g.callName(f, live(M), "get_active_held_item", [])))) && isEqual(rt.fv(f, "w_class", live(I)), 1))) {
				yield* g.callName(f, live(M), "drop_item", []);
			}
		}
	}
	return live(f.dot);
}, true, { args: ["A"] });
