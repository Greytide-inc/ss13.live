// Based on /tg/station's code/datums/diseases/advance/symptoms/skin.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1010, "/datum/symptom/vitiligo", "/datum/symptom", {
	name: "Vitiligo",
	stealth: -3,
	resistance: -1,
	stage_speed: -1,
	transmittable: -2,
	level: 5,
	severity: 1,
});

// skin.dm:28
rt.def("/datum/symptom/vitiligo/proc/Activate", function* Activate(f: Frame, A: Value) {
	let M: Value = null, H: Value = null;
	yield* parent_proc();
	if (prob(GLOB.SYMPTOM_ACTIVATION_PROB)) {
		if (rt.istype((M = A.affected_mob), T("/mob/living/carbon/human"))) {
			if ((H = M).skin_tone == "albino") {
				return f.dot;
			}
			if (A.stage === 5) {
				H.skin_tone = "albino";
				yield* H.update_body(0);
			} else {
				H.visible_message(`<span class='warning'>${H} looks a bit pale...</span>`, "<span class='notice'>Your skin suddenly appears lighter...</span>");
			}
		}
	}
	return f.dot;
}, true);

rt.type(1011, "/datum/symptom/revitiligo", "/datum/symptom", {
	name: "Revitiligo",
	stealth: -3,
	resistance: -1,
	stage_speed: -1,
	transmittable: -2,
	level: 5,
	severity: 1,
});

// skin.dm:72
rt.def("/datum/symptom/revitiligo/proc/Activate", function* Activate(f: Frame, A: Value) {
	let M: Value = null, H: Value = null;
	yield* parent_proc();
	if (prob(GLOB.SYMPTOM_ACTIVATION_PROB)) {
		if (rt.istype((M = A.affected_mob), T("/mob/living/carbon/human"))) {
			if ((H = M).skin_tone == "african2") {
				return f.dot;
			}
			if (A.stage === 5) {
				H.skin_tone = "african2";
				yield* H.update_body(0);
			} else {
				H.visible_message(`<span class='warning'>${H} looks a bit dark...</span>`, "<span class='notice'>Your skin suddenly appears darker...</span>");
			}
		}
	}
	return f.dot;
}, true);
