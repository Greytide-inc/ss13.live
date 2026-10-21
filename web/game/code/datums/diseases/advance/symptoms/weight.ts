// From code/datums/diseases/advance/symptoms/weight.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1023, "/datum/symptom/weight_gain", "/datum/symptom", {
	name: "Weight Gain",
	stealth: -3,
	resistance: -3,
	stage_speed: -2,
	transmittable: -2,
	level: 4,
	severity: 1,
});

// /datum/symptom/weight_gain/proc/Activate  (code/datums/diseases/advance/symptoms/weight.dm:29)
rt.def("/datum/symptom/weight_gain/proc/Activate", function Activate(f: Frame) {
	let M: Value = null;
	let $0: any;
	f.vars = () => [M, $0];
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.op(f, "Prob", [], [rt.gl("SYMPTOM_ACTIVATION_PROB")]))) {
		M = rt.fv(f, "affected_mob", live(f.args[0]));
		$0 = rt.fv(f, "stage", live(f.args[0]));
		if ($0 === 1 || $0 === 2 || $0 === 3 || $0 === 4) {
			rt.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='warning'>＀</span>", [rt.op(f, "PickUnweighted", [2], ["You feel blubbery.", "Your stomach hurts."])])]);
		} else {
			rt.setFv(f, "overeatduration", live(M), rt.call(f, P("/proc/min"), null, [add(rt.fv(f, "overeatduration", live(M)), 100), 600]));
			rt.setFv(f, "nutrition", live(M), rt.call(f, P("/proc/min"), null, [add(rt.fv(f, "nutrition", live(M)), 100), 550]));
		}
	}
	return live(f.dot);
}, false, { args: ["A"] });

rt.type(1024, "/datum/symptom/weight_loss", "/datum/symptom", {
	name: "Weight Loss",
	stealth: -3,
	resistance: -2,
	stage_speed: -2,
	transmittable: -2,
	level: 3,
	severity: 1,
});

// /datum/symptom/weight_loss/proc/Activate  (code/datums/diseases/advance/symptoms/weight.dm:71)
rt.def("/datum/symptom/weight_loss/proc/Activate", function Activate(f: Frame) {
	let M: Value = null;
	let $0: any;
	f.vars = () => [M, $0];
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.op(f, "Prob", [], [rt.gl("SYMPTOM_ACTIVATION_PROB")]))) {
		M = rt.fv(f, "affected_mob", live(f.args[0]));
		$0 = rt.fv(f, "stage", live(f.args[0]));
		if ($0 === 1 || $0 === 2 || $0 === 3 || $0 === 4) {
			rt.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='warning'>＀</span>", [rt.op(f, "PickUnweighted", [2], ["You feel hungry.", "You crave for food."])])]);
		} else {
			rt.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='warning'><i>＀</i></span>", [rt.op(f, "PickUnweighted", [3], ["So hungry...", "You'd kill someone for a bite of food...", "Hunger cramps seize you..."])])]);
			rt.setFv(f, "overeatduration", live(M), rt.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "overeatduration", live(M)), 100), 0]));
			rt.setFv(f, "nutrition", live(M), rt.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "nutrition", live(M)), 100), 0]));
		}
	}
	return live(f.dot);
}, false, { args: ["A"] });

rt.type(1025, "/datum/symptom/weight_even", "/datum/symptom", {
	name: "Weight Even",
	stealth: -3,
	resistance: -2,
	stage_speed: -2,
	transmittable: -2,
	level: 4,
});

// /datum/symptom/weight_even/proc/Activate  (code/datums/diseases/advance/symptoms/weight.dm:113)
rt.def("/datum/symptom/weight_even/proc/Activate", function Activate(f: Frame) {
	let M: Value = null;
	let $0: any;
	f.vars = () => [M, $0];
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.op(f, "Prob", [], [rt.gl("SYMPTOM_ACTIVATION_PROB")]))) {
		M = rt.fv(f, "affected_mob", live(f.args[0]));
		$0 = rt.fv(f, "stage", live(f.args[0]));
		if ($0 === 4 || $0 === 5) {
			rt.setFv(f, "overeatduration", live(M), 0);
			rt.setFv(f, "nutrition", live(M), 500);
		}
	}
	return live(f.dot);
}, false, { args: ["A"] });
