// Based on /tg/station's code/datums/diseases/advance/symptoms/youth.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1026, "/datum/symptom/youth", "/datum/symptom", {
	name: "Eternal Youth",
	stealth: 3,
	resistance: 4,
	stage_speed: 4,
	transmittable: -4,
	level: 5,
});

// youth.dm:28
rt.def("/datum/symptom/youth/proc/Activate", function Activate(f: Frame, A: Value) {
	let M: Value = null, H: Value = null;
	parent_proc();
	if (prob(GLOB.SYMPTOM_ACTIVATION_PROB * 2)) {
		if (rt.istype((M = A.affected_mob), T("/mob/living/carbon/human"))) {
			H = M;
			if (A.stage === 1) {
				if (H.age > 41) {
					H.age = 41;
					to_chat(H, "<span class='notice'>You haven't had this much energy in years!</span>");
				}
			} else if (A.stage === 2) {
				if (H.age > 36) {
					H.age = 36;
					to_chat(H, "<span class='notice'>You're suddenly in a good mood.</span>");
				}
			} else if (A.stage === 3) {
				if (H.age > 31) {
					H.age = 31;
					to_chat(H, "<span class='notice'>You begin to feel more lithe.</span>");
				}
			} else if (A.stage === 4) {
				if (H.age > 26) {
					H.age = 26;
					to_chat(H, "<span class='notice'>You feel reinvigorated.</span>");
				}
			} else if (A.stage === 5) {
				if (H.age > 21) {
					H.age = 21;
					to_chat(H, "<span class='notice'>You feel like you can take on the world!</span>");
				}
			}
		}
	}
	return f.dot;
}, false);
