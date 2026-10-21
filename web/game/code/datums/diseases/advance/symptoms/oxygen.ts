// From code/datums/diseases/advance/symptoms/oxygen.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1005, "/datum/symptom/oxygen", "/datum/symptom", {
	name: "Self-Respiration",
	stealth: 1,
	resistance: -3,
	stage_speed: -3,
	transmittable: -4,
	level: 6,
});

// /datum/symptom/oxygen/proc/Activate  (code/datums/diseases/advance/symptoms/oxygen.dm:28)  may sleep
rt.def("/datum/symptom/oxygen/proc/Activate", function* Activate(f: Frame) {
	let M: Value = null;
	let $0: any;
	f.vars = () => [M, $0];
	yield* g.callSuper(f, [], rt.Args.Same);
	M = rt.fv(f, "affected_mob", live(f.args[0]));
	$0 = rt.fv(f, "stage", live(f.args[0]));
	if ($0 === 4 || $0 === 5) {
		yield* g.callName(f, live(M), "adjustOxyLoss", [-3, 0]);
		if (rt.ge(rt.fv(f, "losebreath", live(M)), 4)) {
			(rt.modField(f, live(M), "losebreath", 2, subtract));
		}
	} else {
		if (truthy(rt.op(f, "Prob", [], [multiply(rt.gl("SYMPTOM_ACTIVATION_PROB"), 3)]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='notice'>＀</span>", [rt.op(f, "PickUnweighted", [3], ["Your lungs feel great.", "You realize you haven't been breathing.", "You don't feel the need to breathe."])])]);
		}
	}
	return live(f.dot);
}, true, { args: ["A"] });
