// Based on /tg/station's code/datums/diseases/advance/symptoms/itching.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(1004, "/datum/symptom/itching", "/datum/symptom", {
	name: "Itching",
	stealth: 0,
	resistance: 3,
	stage_speed: 3,
	transmittable: 1,
	level: 1,
	severity: 1,
});

// itching.dm:30
rt.def("/datum/symptom/itching/proc/Activate", function Activate(f: Frame, A: Value) {
	let M: Value = null;
	parent_proc();
	if (prob(GLOB.SYMPTOM_ACTIVATION_PROB)) {
		to_chat((M = A.affected_mob), `<span class='warning'>Your ${pick("back", "arm", "leg", "elbow", "head")} itches.</span>`);
	}
	return f.dot;
}, false);
