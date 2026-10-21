// From code/datums/diseases/advance/symptoms/confusion.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(985, "/datum/symptom/confusion", "/datum/symptom", {
	name: "Confusion",
	stealth: 1,
	resistance: -1,
	stage_speed: -3,
	transmittable: 0,
	level: 4,
	severity: 2,
});

// /datum/symptom/confusion/proc/Activate  (code/datums/diseases/advance/symptoms/confusion.dm:30)
rt.def("/datum/symptom/confusion/proc/Activate", function Activate(f: Frame) {
	let M: Value = null;
	let $0: any;
	f.vars = () => [M, $0];
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.op(f, "Prob", [], [rt.gl("SYMPTOM_ACTIVATION_PROB")]))) {
		M = rt.fv(f, "affected_mob", live(f.args[0]));
		$0 = rt.fv(f, "stage", live(f.args[0]));
		if ($0 === 1 || $0 === 2 || $0 === 3 || $0 === 4) {
			rt.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='warning'>＀</span>", [rt.op(f, "PickUnweighted", [2], ["Your head hurts.", "Your mind blanks for a moment."])])]);
		} else {
			rt.call(f, P("/proc/to_chat"), null, [live(M), "<span class='userdanger'>You can't think straight!</span>"]);
			rt.setFv(f, "confused", live(M), rt.call(f, P("/proc/min"), null, [100, add(rt.fv(f, "confused", live(M)), 8)]));
		}
	}
	return live(f.dot);
}, false, { args: ["A"] });
