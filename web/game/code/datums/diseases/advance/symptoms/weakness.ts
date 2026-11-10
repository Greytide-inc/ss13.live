// Based on /tg/station's code/datums/diseases/advance/symptoms/weakness.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(1022, "/datum/symptom/weakness", "/datum/symptom", {
	name: "Weakness",
	stealth: -1,
	resistance: -1,
	stage_speed: -2,
	transmittable: -2,
	level: 3,
	severity: 3,
});

// weakness.dm:29
rt.def("/datum/symptom/weakness/proc/Activate", function* Activate(f: Frame, A: Value) {
	let M: Value = null;
	yield* parent_proc();
	if (prob(GLOB.SYMPTOM_ACTIVATION_PROB)) {
		M = A.affected_mob;
		if (A.stage === 1 || A.stage === 2) {
			to_chat(M, `<span class='warning'>${pick("You feel weak.", "You feel lazy.")}</span>`);
		} else if (A.stage === 3 || A.stage === 4) {
			to_chat(M, `<span class='warning'><b>${pick("You feel very frail.", "You think you might faint.")}</span>`);
			yield* M.adjustStaminaLoss(15);
		} else {
			to_chat(M, `<span class='userdanger'>${pick("You feel tremendously weak!", "Your body trembles as exhaustion creeps over you.")}</span>`);
			yield* M.adjustStaminaLoss(30);
			if (M.getStaminaLoss() > 60 && !M.stat) {
				M.visible_message(`<span class='warning'>${M} faints!</span>`, "<span class='userdanger'>You swoon and faint...</span>");
				yield* M.AdjustSleeping(100);
			}
		}
	}
	return f.dot;
}, true);
