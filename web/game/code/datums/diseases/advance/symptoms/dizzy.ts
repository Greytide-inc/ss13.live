// From code/datums/diseases/advance/symptoms/dizzy.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(988, "/datum/symptom/dizzy", "/datum/symptom", {
	name: "Dizziness",
	stealth: 2,
	resistance: -2,
	stage_speed: -3,
	transmittable: -1,
	level: 4,
	severity: 2,
});

// /datum/symptom/dizzy/proc/Activate  (code/datums/diseases/advance/symptoms/dizzy.dm:29)
rt.def("/datum/symptom/dizzy/proc/Activate", function Activate(f: Frame) {
	let M: Value = null;
	let $0: any;
	f.vars = () => [M, $0];
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.op(f, "Prob", [], [rt.gl("SYMPTOM_ACTIVATION_PROB")]))) {
		M = rt.fv(f, "affected_mob", live(f.args[0]));
		$0 = rt.fv(f, "stage", live(f.args[0]));
		if ($0 === 1 || $0 === 2 || $0 === 3 || $0 === 4) {
			rt.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='warning'>＀</span>", [rt.op(f, "PickUnweighted", [2], ["You feel dizzy.", "Your head spins."])])]);
		} else {
			rt.call(f, P("/proc/to_chat"), null, [live(M), "<span class='userdanger'>A wave of dizziness washes over you!</span>"]);
			rt.callName(f, live(M), "Dizzy", [5]);
		}
	}
	return live(f.dot);
}, false, { args: ["A"] });
