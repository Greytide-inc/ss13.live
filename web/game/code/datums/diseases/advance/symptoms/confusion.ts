// Based on /tg/station's code/datums/diseases/advance/symptoms/confusion.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(985, "/datum/symptom/confusion", "/datum/symptom", {
	name: "Confusion",
	stealth: 1,
	resistance: -1,
	stage_speed: -3,
	transmittable: 0,
	level: 4,
	severity: 2,
});

// confusion.dm:30
rt.def("/datum/symptom/confusion/proc/Activate", function Activate(f: Frame, A: Value) {
	let M: Value = null;
	parent_proc();
	if (prob(GLOB.SYMPTOM_ACTIVATION_PROB)) {
		M = A.affected_mob;
		if (A.stage === 1 || A.stage === 2 || A.stage === 3 || A.stage === 4) {
			to_chat(M, `<span class='warning'>${pick("Your head hurts.", "Your mind blanks for a moment.")}</span>`);
		} else {
			to_chat(M, "<span class='userdanger'>You can't think straight!</span>");
			M.confused = min(100, M.confused + 8);
		}
	}
	return f.dot;
}, false);
