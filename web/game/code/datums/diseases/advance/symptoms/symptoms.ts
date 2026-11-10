// Based on /tg/station's code/datums/diseases/advance/symptoms/symptoms.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(981, "/datum/symptom", "/datum", {
	name: "",
	stealth: 0,
	resistance: 0,
	stage_speed: 0,
	transmittable: 0,
	level: 0,
	severity: 0,
	id: "",
}, { global: { SYMPTOM_ACTIVATION_PROB: 642 } });

// symptoms.dm:19
rt.def("/datum/symptom/proc/New", function New(f: Frame) {
	let S: Value = GLOB.list_symptoms;
	let i: Value = 1;
	while (i <= rt.len(f, S)) {
		if (this.type == rt.index(S, i)) {
			this.id = `${i}`;
			return f.dot;
		}
		i++;
	}
	CRASH("We couldn't assign an ID!");
	return f.dot;
});
