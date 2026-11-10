// Based on /tg/station's code/datums/diseases/advance/symptoms/hallucigen.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(995, "/datum/symptom/hallucigen", "/datum/symptom", {
	name: "Hallucigen",
	stealth: -2,
	resistance: -3,
	stage_speed: -3,
	transmittable: -1,
	level: 5,
	severity: 3,
});

// hallucigen.dm:29
rt.def("/datum/symptom/hallucigen/proc/Activate", function Activate(f: Frame, A: Value) {
	let M: Value = null;
	parent_proc();
	if (prob(GLOB.SYMPTOM_ACTIVATION_PROB)) {
		M = A.affected_mob;
		if (A.stage === 1 || A.stage === 2) {
			to_chat(M, `<span class='warning'>${pick("Something appears in your peripheral vision, then winks out.", "You hear a faint whispher with no source.", "Your head aches.")}</span>`);
		} else if (A.stage === 3 || A.stage === 4) {
			to_chat(M, `<span class='danger'>${pick("Something is following you.", "You are being watched.", "You hear a whisper in your ear.", "Thumping footsteps slam toward you from nowhere.")}</span>`);
		} else {
			to_chat(M, `<span class='userdanger'>${pick("Oh, your head...", "Your head pounds.", "They're everywhere! Run!", "Something in the shadows...")}</span>`);
			M.hallucination += 25;
		}
	}
	return f.dot;
}, false);
