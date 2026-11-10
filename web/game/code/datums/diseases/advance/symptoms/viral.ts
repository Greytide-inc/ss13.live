// Based on /tg/station's code/datums/diseases/advance/symptoms/viral.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(1013, "/datum/symptom/viraladaptation", "/datum/symptom", {
	name: "Viral self-adaptation",
	stealth: 3,
	resistance: 5,
	stage_speed: -3,
	transmittable: 0,
	level: 3,
});

// viral.dm:25
rt.def("/datum/symptom/viraladaptation/proc/Activate", function Activate(f: Frame, A: Value) {
	parent_proc();
	if (!prob(GLOB.SYMPTOM_ACTIVATION_PROB)) return f.dot;
	let M: Value = A.affected_mob;
	if (A.stage === 1) {
		to_chat(M, "<span class='notice'>You feel off, but no different from before.</span>");
	} else if (A.stage === 5) {
		to_chat(M, "<span class='notice'>You feel better, but nothing interesting happens.</span>");
	}
	return f.dot;
}, false);

// viral.dm:58
rt.def("/datum/symptom/viraladaptation/proc/Activate", function Activate(f: Frame, A: Value) {
	parent_proc();
	if (!prob(GLOB.SYMPTOM_ACTIVATION_PROB)) return f.dot;
	let M: Value = A.affected_mob;
	if (A.stage === 1) {
		to_chat(M, "<span class='notice'>You feel better, but no different from before.</span>");
	} else if (A.stage === 5) {
		to_chat(M, "<span class='notice'>You feel off, but nothing interesting happens.</span>");
	}
	return f.dot;
}, false);

rt.type(1015, "/datum/symptom/viralreverse", "/datum/symptom", {
	name: "Viral aggressive metabolism",
	stealth: 0,
	resistance: 1,
	stage_speed: -2,
	transmittable: 3,
	level: 3,
});

// viral.dm:95
rt.def("/datum/symptom/viralreverse/proc/Activate", function* Activate(f: Frame, A: Value) {
	let M: Value = null;
	yield* parent_proc();
	if (prob(GLOB.SYMPTOM_ACTIVATION_PROB)) {
		yield* this.Heal((M = A.affected_mob), A);
	}
	return f.dot;
}, true);

// viral.dm:102
rt.def("/datum/symptom/viralreverse/proc/Heal", function* Heal(f: Frame, M: Value, A: Value) {
	A.stage -= 1;
	if (!(A.stage < 2)) return f.dot;
	yield* A.cure();
	return f.dot;
}, true);

// viral.dm:107
rt.def("/datum/symptom/viralreverse/proc/Start", function Start(f: Frame, A: Value) {
	A.stage = 5;
	return f.dot;
});
