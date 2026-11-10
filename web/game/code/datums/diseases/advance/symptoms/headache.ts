// Based on /tg/station's code/datums/diseases/advance/symptoms/headache.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(996, "/datum/symptom/headache", "/datum/symptom", {
	name: "Headache",
	stealth: -1,
	resistance: 4,
	stage_speed: 2,
	transmittable: 0,
	level: 1,
	severity: 1,
});

// headache.dm:30
rt.def("/datum/symptom/headache/proc/Activate", function Activate(f: Frame, A: Value) {
	let M: Value = null;
	parent_proc();
	if (prob(GLOB.SYMPTOM_ACTIVATION_PROB)) {
		to_chat((M = A.affected_mob), `<span class='warning'>${pick("Your head hurts.", "Your head starts pounding.")}</span>`);
	}
	return f.dot;
}, false);
