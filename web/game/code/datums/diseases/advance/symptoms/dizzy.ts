// Based on /tg/station's code/datums/diseases/advance/symptoms/dizzy.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(988, "/datum/symptom/dizzy", "/datum/symptom", {
	name: "Dizziness",
	stealth: 2,
	resistance: -2,
	stage_speed: -3,
	transmittable: -1,
	level: 4,
	severity: 2,
});

// dizzy.dm:29
rt.def("/datum/symptom/dizzy/proc/Activate", function Activate(f: Frame, A: Value) {
	let M: Value = null;
	parent_proc();
	if (prob(GLOB.SYMPTOM_ACTIVATION_PROB)) {
		M = A.affected_mob;
		if (A.stage === 1 || A.stage === 2 || A.stage === 3 || A.stage === 4) {
			to_chat(M, `<span class='warning'>${pick("You feel dizzy.", "Your head spins.")}</span>`);
		} else {
			to_chat(M, "<span class='userdanger'>A wave of dizziness washes over you!</span>");
			M.Dizzy(5);
		}
	}
	return f.dot;
}, false);
