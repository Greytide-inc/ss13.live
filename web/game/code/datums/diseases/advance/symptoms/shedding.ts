// Based on /tg/station's code/datums/diseases/advance/symptoms/shedding.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(1008, "/datum/symptom/shedding", "/datum/symptom", {
	name: "Alopecia",
	stealth: -1,
	resistance: -1,
	stage_speed: -1,
	transmittable: 2,
	level: 4,
	severity: 1,
});

// shedding.dm:28
rt.def("/datum/symptom/shedding/proc/Activate", function* Activate(f: Frame, A: Value) {
	let M: Value = null;
	yield* parent_proc();
	if (!prob(GLOB.SYMPTOM_ACTIVATION_PROB)) return f.dot;
	to_chat((M = A.affected_mob), `<span class='warning'>${pick("Your scalp itches.", "Your skin feels flakey.")}</span>`);
	if (!rt.istype(M, T("/mob/living/carbon/human"))) return f.dot;
	let H: Value = M;
	if (A.stage === 3 || A.stage === 4) {
		if (H.hair_style != "Bald" && H.hair_style != "Balding Hair") {
			to_chat(H, "<span class='warning'>Your hair starts to fall out in clumps...</span>");
			yield* addtimer((yield* new_(T("/datum/callback"), this, P("/datum/symptom/shedding/proc/Shed"), H, 0)), 50);
		}
	} else if (A.stage === 5) {
		if (!(H.facial_hair_style != "Shaved" || H.hair_style != "Bald")) return f.dot;
		to_chat(H, "<span class='warning'>Your hair starts to fall out in clumps...</span>");
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/datum/symptom/shedding/proc/Shed"), H, 1)), 50);
	}
	return f.dot;
}, true);

// shedding.dm:46
rt.def("/datum/symptom/shedding/proc/Shed", function* Shed(f: Frame, H: Value, fullbald: Value) {
	if (fullbald) {
		H.facial_hair_style = "Shaved";
		H.hair_style = "Bald";
	} else {
		H.hair_style = "Balding Hair";
	}
	yield* H.update_hair();
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living/carbon/human" }, {  }] });
