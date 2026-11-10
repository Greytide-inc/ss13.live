// Based on /tg/station's code/datums/diseases/advance/symptoms/shivering.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(1009, "/datum/symptom/shivering", "/datum/symptom", {
	name: "Shivering",
	stealth: 0,
	resistance: 2,
	stage_speed: 2,
	transmittable: 2,
	level: 2,
	severity: 2,
});

// shivering.dm:29
rt.def("/datum/symptom/shivering/proc/Activate", function Activate(f: Frame, A: Value) {
	let M: Value = null;
	parent_proc();
	if (prob(GLOB.SYMPTOM_ACTIVATION_PROB)) {
		to_chat((M = A.affected_mob), `<span class='warning'>${pick("You feel cold.", "You start shivering.")}</span>`);
		if (M.bodytemperature < BODYTEMP_COLD_DAMAGE_LIMIT) {
			this.Chill(M, A);
		}
	}
	return f.dot;
}, false);

// shivering.dm:38
rt.def("/datum/symptom/shivering/proc/Chill", function Chill(f: Frame, M: Value, A: Value) {
	let get_cold: Value = rt.op(f, "Sqrt", [], [16 + A.totalStealth() * 2]) + rt.op(f, "Sqrt", [], [21 + A.totalResistance() * 2]);
	M.bodytemperature = min(M.bodytemperature - get_cold * A.stage, 261.15);
	return 1;
});
