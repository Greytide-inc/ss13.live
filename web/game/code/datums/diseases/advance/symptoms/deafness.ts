// Based on /tg/station's code/datums/diseases/advance/symptoms/deafness.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(987, "/datum/symptom/deafness", "/datum/symptom", {
	name: "Deafness",
	stealth: -1,
	resistance: -2,
	stage_speed: -1,
	transmittable: -3,
	level: 4,
	severity: 3,
});

// deafness.dm:29
rt.def("/datum/symptom/deafness/proc/Activate", function Activate(f: Frame, A: Value) {
	parent_proc();
	if (!prob(GLOB.SYMPTOM_ACTIVATION_PROB)) return f.dot;
	let M: Value = A.affected_mob;
	if (A.stage === 3 || A.stage === 4) {
		to_chat(M, `<span class='warning'>${pick("You hear a ringing in your ear.", "Your ears pop.")}</span>`);
	} else if (A.stage === 5) {
		to_chat(M, "<span class='userdanger'>Your ears pop and begin ringing loudly!</span>");
		M.minimumDeafTicks(20);
	}
	return f.dot;
}, false);
