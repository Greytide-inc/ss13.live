// Based on /tg/station's code/datums/diseases/advance/symptoms/oxygen.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(1005, "/datum/symptom/oxygen", "/datum/symptom", {
	name: "Self-Respiration",
	stealth: 1,
	resistance: -3,
	stage_speed: -3,
	transmittable: -4,
	level: 6,
});

// oxygen.dm:28
rt.def("/datum/symptom/oxygen/proc/Activate", function* Activate(f: Frame, A: Value) {
	yield* parent_proc();
	let M: Value = A.affected_mob;
	if (A.stage === 4 || A.stage === 5) {
		yield* M.adjustOxyLoss(-3, 0);
		if (M.losebreath >= 4) {
			M.losebreath -= 2;
		}
	} else if (prob(GLOB.SYMPTOM_ACTIVATION_PROB * 3)) {
		to_chat(M, `<span class='notice'>${pick("Your lungs feel great.", "You realize you haven't been breathing.", "You don't feel the need to breathe.")}</span>`);
	}
	return f.dot;
}, true);
