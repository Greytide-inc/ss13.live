// From code/datums/diseases/advance/symptoms/weakness.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1022, "/datum/symptom/weakness", "/datum/symptom", {
	name: "Weakness",
	stealth: -1,
	resistance: -1,
	stage_speed: -2,
	transmittable: -2,
	level: 3,
	severity: 3,
});

// /datum/symptom/weakness/proc/Activate  (code/datums/diseases/advance/symptoms/weakness.dm:29)  may sleep
rt.def("/datum/symptom/weakness/proc/Activate", function* Activate(f: Frame) {
	let M: Value = null;
	let $0: any;
	f.vars = () => [M, $0];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.op(f, "Prob", [], [rt.gl("SYMPTOM_ACTIVATION_PROB")]))) {
		M = rt.fv(f, "affected_mob", live(f.args[0]));
		$0 = rt.fv(f, "stage", live(f.args[0]));
		if ($0 === 1 || $0 === 2) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='warning'>＀</span>", [rt.op(f, "PickUnweighted", [2], ["You feel weak.", "You feel lazy."])])]);
		} else if ($0 === 3 || $0 === 4) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='warning'><b>＀</span>", [rt.op(f, "PickUnweighted", [2], ["You feel very frail.", "You think you might faint."])])]);
			yield* g.callName(f, live(M), "adjustStaminaLoss", [15]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='userdanger'>＀</span>", [rt.op(f, "PickUnweighted", [2], ["You feel tremendously weak!", "Your body trembles as exhaustion creeps over you."])])]);
			yield* g.callName(f, live(M), "adjustStaminaLoss", [30]);
			if ((rt.gt((yield* g.callName(f, live(M), "getStaminaLoss", [])), 60) && !truthy(rt.fv(f, "stat", live(M))))) {
				yield* g.callName(f, live(M), "visible_message", [fmt("<span class='warning'>＀ faints!</span>", [live(M)]), "<span class='userdanger'>You swoon and faint...</span>"]);
				yield* g.callName(f, live(M), "AdjustSleeping", [100]);
			}
		}
	}
	return live(f.dot);
}, true, { args: ["A"] });
