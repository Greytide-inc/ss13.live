// Based on /tg/station's code/datums/diseases/advance/symptoms/vision.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(1016, "/datum/symptom/visionloss", "/datum/symptom", {
	name: "Hyphema",
	stealth: -1,
	resistance: -4,
	stage_speed: -4,
	transmittable: -3,
	level: 5,
	severity: 4,
});

// vision.dm:29
rt.def("/datum/symptom/visionloss/proc/Activate", function* Activate(f: Frame, A: Value) {
	let eyes: Value = null;
	yield* parent_proc();
	if (!prob(GLOB.SYMPTOM_ACTIVATION_PROB)) return f.dot;
	let M: Value = A.affected_mob;
	if (!(eyes = M.getorganslot("eyes_sight"))) {
		return f.dot;
	}
	if (A.stage === 1 || A.stage === 2) {
		to_chat(M, "<span class='warning'>Your eyes itch.</span>");
	} else if (A.stage === 3 || A.stage === 4) {
		to_chat(M, "<span class='warning'><b>Your eyes burn!</b></span>");
		yield* M.blur_eyes(10);
		yield* M.adjust_eye_damage(1);
	} else {
		to_chat(M, "<span class='userdanger'>Your eyes burn horrificly!</span>");
		yield* M.blur_eyes(20);
		yield* M.adjust_eye_damage(5);
		if (eyes.eye_damage >= 10) {
			yield* M.become_nearsighted();
			if (prob(eyes.eye_damage - 10 + 1)) {
				if (yield* M.become_blind()) {
					to_chat(M, "<span class='userdanger'>You go blind!</span>");
				}
			}
		}
	}
	return f.dot;
}, true);

rt.type(1017, "/datum/symptom/visionaid", "/datum/symptom", {
	name: "Ocular Restoration",
	stealth: -1,
	resistance: -3,
	stage_speed: -2,
	transmittable: -4,
	level: 4,
});

// vision.dm:80
rt.def("/datum/symptom/visionaid/proc/Activate", function* Activate(f: Frame, A: Value) {
	let eyes: Value = null;
	yield* parent_proc();
	let M: Value = A.affected_mob;
	if (!(eyes = M.getorganslot("eyes_sight"))) {
		return f.dot;
	}
	if (A.stage === 4 || A.stage === 5) {
		if (rt.bitAnd(M.disabilities, 1)) {
			if (prob(20)) {
				to_chat(M, "<span class='warning'>Your vision slowly returns...</span>");
				yield* M.cure_blind();
				yield* M.cure_nearsighted();
				yield* M.blur_eyes(35);
			} else if (rt.bitAnd(M.disabilities, 8)) {
				to_chat(M, "<span class='warning'>The blackness in your peripheral vision fades.</span>");
				yield* M.cure_nearsighted();
				yield* M.blur_eyes(10);
			} else if (M.eye_blind || M.eye_blurry) {
				yield* M.set_blindness(0);
				yield* M.set_blurriness(0);
			} else if (eyes.eye_damage > 0) {
				yield* M.adjust_eye_damage(-1);
			}
		}
	} else if (prob(GLOB.SYMPTOM_ACTIVATION_PROB * 3)) {
		to_chat(M, `<span class='notice'>${pick("Your eyes feel great.", "You are now blinking manually.", "You don't feel the need to blink.")}</span>`);
	}
	return f.dot;
}, true);
