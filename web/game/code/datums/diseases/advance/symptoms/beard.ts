// Based on /tg/station's code/datums/diseases/advance/symptoms/beard.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(982, "/datum/symptom/beard", "/datum/symptom", {
	name: "Facial Hypertrichosis",
	stealth: -3,
	resistance: -1,
	stage_speed: -3,
	transmittable: -1,
	level: 4,
	severity: 1,
});

// beard.dm:28
rt.def("/datum/symptom/beard/proc/Activate", function* Activate(f: Frame, A: Value) {
	let M: Value = null, H: Value = null;
	yield* parent_proc();
	if (prob(GLOB.SYMPTOM_ACTIVATION_PROB)) {
		if (rt.istype((M = A.affected_mob), T("/mob/living/carbon/human"))) {
			H = M;
			if (A.stage === 1 || A.stage === 2) {
				to_chat(H, "<span class='warning'>Your chin itches.</span>");
				if (H.facial_hair_style == "Shaved") {
					H.facial_hair_style = "Jensen Beard";
					yield* H.update_hair();
				}
			} else if (A.stage === 3 || A.stage === 4) {
				to_chat(H, "<span class='warning'>You feel tough.</span>");
				if (H.facial_hair_style != "Dwarf Beard" && H.facial_hair_style != "Very Long Beard" && H.facial_hair_style != "Full Beard") {
					H.facial_hair_style = "Full Beard";
					yield* H.update_hair();
				}
			} else {
				to_chat(H, "<span class='warning'>You feel manly!</span>");
				if (H.facial_hair_style != "Dwarf Beard" && H.facial_hair_style != "Very Long Beard") {
					H.facial_hair_style = pick("Dwarf Beard", "Very Long Beard");
					yield* H.update_hair();
				}
			}
		}
	}
	return f.dot;
}, true);
