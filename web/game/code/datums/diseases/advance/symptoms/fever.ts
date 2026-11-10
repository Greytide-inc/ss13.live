// Based on /tg/station's code/datums/diseases/advance/symptoms/fever.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(989, "/datum/symptom/fever", "/datum/symptom", {
	name: "Fever",
	stealth: 0,
	resistance: 3,
	stage_speed: 3,
	transmittable: 2,
	level: 2,
	severity: 2,
});

// fever.dm:29
rt.def("/datum/symptom/fever/proc/Activate", function Activate(f: Frame, A: Value) {
	let M: Value = null;
	parent_proc();
	if (prob(GLOB.SYMPTOM_ACTIVATION_PROB)) {
		to_chat((M = A.affected_mob), `<span class='warning'>${pick("You feel hot.", "You feel like you're burning.")}</span>`);
		if (M.bodytemperature < BODYTEMP_HEAT_DAMAGE_LIMIT) {
			this.Heat(M, A);
		}
	}
	return f.dot;
}, false);

// fever.dm:39
rt.def("/datum/symptom/fever/proc/Heat", function Heat(f: Frame, M: Value, A: Value) {
	let get_heat: Value = rt.op(f, "Sqrt", [], [max(21, 21 + A.totalTransmittable() * 2)]) + rt.op(f, "Sqrt", [], [max(21, 20 + A.totalStageSpeed() * 3)]);
	M.bodytemperature = min(M.bodytemperature + get_heat * A.stage, 359.15);
	return 1;
});
