// Based on /tg/station's code/datums/diseases/advance/symptoms/cough.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(986, "/datum/symptom/cough", "/datum/symptom", {
	name: "Cough",
	stealth: -1,
	resistance: 3,
	stage_speed: 1,
	transmittable: 2,
	level: 1,
	severity: 1,
});

// cough.dm:29
rt.def("/datum/symptom/cough/proc/Activate", function* Activate(f: Frame, A: Value) {
	let M: Value = null, I: Value = null;
	yield* parent_proc();
	if (prob(GLOB.SYMPTOM_ACTIVATION_PROB)) {
		M = A.affected_mob;
		if (A.stage === 1 || A.stage === 2 || A.stage === 3) {
			to_chat(M, `<span notice='warning'>${pick("You swallow excess mucus.", "You lightly cough.")}</span>`);
		} else {
			yield* M.emote("cough");
			if ((I = M.get_active_held_item()) && I.w_class == WEIGHT_CLASS_TINY) {
				yield* M.drop_item();
			}
		}
	}
	return f.dot;
}, true);
