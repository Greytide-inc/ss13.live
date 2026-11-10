// Based on /tg/station's code/datums/diseases/advance/symptoms/voice_change.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1018, "/datum/symptom/voice_change", "/datum/symptom", {
	name: "Voice Change",
	stealth: -2,
	resistance: -3,
	stage_speed: -3,
	transmittable: -1,
	level: 6,
	severity: 2,
});

// voice_change.dm:29
rt.def("/datum/symptom/voice_change/proc/Activate", function Activate(f: Frame, A: Value) {
	let M: Value = null, H: Value = null;
	parent_proc();
	if (prob(GLOB.SYMPTOM_ACTIVATION_PROB)) {
		M = A.affected_mob;
		if (A.stage === 1 || A.stage === 2 || A.stage === 3 || A.stage === 4) {
			to_chat(M, `<span class='warning'>${pick("Your throat hurts.", "You clear your throat.")}</span>`);
		} else if (rt.istype(M, T("/mob/living/carbon/human"))) {
			(H = M).SetSpecialVoice(H.dna.species.random_name(H.gender));
		}
	}
	return f.dot;
}, false);

// voice_change.dm:44
rt.def("/datum/symptom/voice_change/proc/End", function End(f: Frame, A: Value) {
	let H: Value = null;
	parent_proc();
	if (rt.istype(A.affected_mob, T("/mob/living/carbon/human"))) {
		(H = A.affected_mob).UnsetSpecialVoice();
	}
	return f.dot;
}, false);
