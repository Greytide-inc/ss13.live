// Based on /tg/station's code/datums/diseases/advance/symptoms/vomit.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(1019, "/datum/symptom/vomit", "/datum/symptom", {
	name: "Vomiting",
	stealth: -2,
	resistance: -1,
	stage_speed: 0,
	transmittable: 1,
	level: 3,
	severity: 4,
});

// vomit.dm:33
rt.def("/datum/symptom/vomit/proc/Activate", function* Activate(f: Frame, A: Value) {
	let M: Value = null;
	yield* parent_proc();
	if (prob(GLOB.SYMPTOM_ACTIVATION_PROB / 2)) {
		M = A.affected_mob;
		if (A.stage === 1 || A.stage === 2 || A.stage === 3 || A.stage === 4) {
			to_chat(M, `<span class='warning'>${pick("You feel nauseous.", "You feel like you're going to throw up!")}</span>`);
		} else {
			yield* this.Vomit(M);
		}
	}
	return f.dot;
}, true);

// vomit.dm:45
rt.def("/datum/symptom/vomit/proc/Vomit", function* Vomit(f: Frame, M: Value) {
	yield* M.vomit(20);
	return f.dot;
}, true);

rt.type(1020, "/datum/symptom/vomit/blood", "/datum/symptom/vomit", {
	name: "Blood Vomiting",
	stealth: -2,
	resistance: -1,
	stage_speed: -1,
	transmittable: 1,
	level: 4,
	severity: 5,
});

// vomit.dm:78
rt.def("/datum/symptom/vomit/blood/proc/Vomit", function* Vomit(f: Frame, M: Value) {
	yield* M.vomit(0, 1);
	return f.dot;
}, true);

rt.type(1021, "/datum/symptom/vomit/projectile", "/datum/symptom/vomit", {
	name: "Projectile Vomiting",
	stealth: -2,
	level: 4,
});

// vomit.dm:106
rt.def("/datum/symptom/vomit/projectile/proc/Vomit", function* Vomit(f: Frame, M: Value) {
	yield* M.vomit(6, { distance: 5 });
	return f.dot;
}, true);
