// Based on /tg/station's code/datums/diseases/advance/symptoms/weight.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(1023, "/datum/symptom/weight_gain", "/datum/symptom", {
	name: "Weight Gain",
	stealth: -3,
	resistance: -3,
	stage_speed: -2,
	transmittable: -2,
	level: 4,
	severity: 1,
});

// weight.dm:29
rt.def("/datum/symptom/weight_gain/proc/Activate", function Activate(f: Frame, A: Value) {
	let M: Value = null;
	parent_proc();
	if (prob(GLOB.SYMPTOM_ACTIVATION_PROB)) {
		M = A.affected_mob;
		if (A.stage === 1 || A.stage === 2 || A.stage === 3 || A.stage === 4) {
			to_chat(M, `<span class='warning'>${pick("You feel blubbery.", "Your stomach hurts.")}</span>`);
		} else {
			M.overeatduration = min(M.overeatduration + 100, 600);
			M.nutrition = min(M.nutrition + 100, NUTRITION_LEVEL_FULL);
		}
	}
	return f.dot;
}, false);

rt.type(1024, "/datum/symptom/weight_loss", "/datum/symptom", {
	name: "Weight Loss",
	stealth: -3,
	resistance: -2,
	stage_speed: -2,
	transmittable: -2,
	level: 3,
	severity: 1,
});

// weight.dm:71
rt.def("/datum/symptom/weight_loss/proc/Activate", function Activate(f: Frame, A: Value) {
	let M: Value = null;
	parent_proc();
	if (prob(GLOB.SYMPTOM_ACTIVATION_PROB)) {
		M = A.affected_mob;
		if (A.stage === 1 || A.stage === 2 || A.stage === 3 || A.stage === 4) {
			to_chat(M, `<span class='warning'>${pick("You feel hungry.", "You crave for food.")}</span>`);
		} else {
			to_chat(M, `<span class='warning'><i>${pick("So hungry...", "You'd kill someone for a bite of food...", "Hunger cramps seize you...")}</i></span>`);
			M.overeatduration = max(M.overeatduration - 100, 0);
			M.nutrition = max(M.nutrition - 100, 0);
		}
	}
	return f.dot;
}, false);

rt.type(1025, "/datum/symptom/weight_even", "/datum/symptom", {
	name: "Weight Even",
	stealth: -3,
	resistance: -2,
	stage_speed: -2,
	transmittable: -2,
	level: 4,
});

// weight.dm:113
rt.def("/datum/symptom/weight_even/proc/Activate", function Activate(f: Frame, A: Value) {
	let M: Value = null;
	parent_proc();
	if (prob(GLOB.SYMPTOM_ACTIVATION_PROB)) {
		M = A.affected_mob;
		if (A.stage === 4 || A.stage === 5) {
			M.overeatduration = 0;
			M.nutrition = 500;
		}
	}
	return f.dot;
}, false);
