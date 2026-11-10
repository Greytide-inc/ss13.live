// Based on /tg/station's code/modules/mob/living/carbon/status_procs.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;

// status_procs.dm:18
rt.def("/mob/living/carbon/proc/set_eye_damage", function* set_eye_damage(f: Frame, amount: Value) {
	let eyes: Value = null;
	if (!(eyes = this.getorganslot("eyes_sight"))) {
		return f.dot;
	}
	eyes.eye_damage = max(amount, 0);
	if (eyes.eye_damage > 20) {
		if (eyes.eye_damage > 30) {
			yield* this.overlay_fullscreen("eye_damage", T("/obj/screen/fullscreen/impaired"), 2);
		} else {
			yield* this.overlay_fullscreen("eye_damage", T("/obj/screen/fullscreen/impaired"), 1);
		}
	} else {
		yield* this.clear_fullscreen("eye_damage");
	}
	return f.dot;
}, true);

// status_procs.dm:31
rt.def("/mob/living/carbon/proc/adjust_eye_damage", function* adjust_eye_damage(f: Frame, amount: Value) {
	let eyes: Value = null;
	if (!(eyes = this.getorganslot("eyes_sight"))) {
		return f.dot;
	}
	eyes.eye_damage = max(eyes.eye_damage + amount, 0);
	if (eyes.eye_damage > 20) {
		if (eyes.eye_damage > 30) {
			yield* this.overlay_fullscreen("eye_damage", T("/obj/screen/fullscreen/impaired"), 2);
		} else {
			yield* this.overlay_fullscreen("eye_damage", T("/obj/screen/fullscreen/impaired"), 1);
		}
	} else {
		yield* this.clear_fullscreen("eye_damage");
	}
	return f.dot;
}, true);

// status_procs.dm:44
rt.def("/mob/living/carbon/proc/adjust_drugginess", function* adjust_drugginess(f: Frame, amount: Value) {
	let old_druggy: Value = this.druggy;
	if (amount > 0) {
		this.druggy += amount;
		if (!old_druggy) {
			yield* this.overlay_fullscreen("high", T("/obj/screen/fullscreen/high"));
			yield* this.throw_alert("high", T("/obj/screen/alert/high"));
		}
	} else {
		if (!old_druggy) return f.dot;
		this.druggy = max(this.druggy + amount, 0);
		if (this.druggy) return f.dot;
		yield* this.clear_fullscreen("high");
		yield* this.clear_alert("high");
	}
	return f.dot;
}, true);

// status_procs.dm:56
rt.def("/mob/living/carbon/proc/set_drugginess", function* set_drugginess(f: Frame, amount: Value) {
	let old_druggy: Value = this.druggy;
	this.druggy = amount;
	if (amount > 0) {
		if (!old_druggy) {
			yield* this.overlay_fullscreen("high", T("/obj/screen/fullscreen/high"));
			yield* this.throw_alert("high", T("/obj/screen/alert/high"));
		}
	} else {
		if (!old_druggy) return f.dot;
		yield* this.clear_fullscreen("high");
		yield* this.clear_alert("high");
	}
	return f.dot;
}, true);

// status_procs.dm:68
rt.def("/mob/living/carbon/proc/cure_blind", function* cure_blind(f: Frame) {
	if (!rt.bitAnd(this.disabilities, 1)) return f.dot;
	(rt.modSrcVar(f, "disabilities", 16777214, rt.bitAnd));
	yield* this.adjust_blindness(-1);
	return 1;
}, true);

// status_procs.dm:73
rt.def("/mob/living/carbon/proc/become_blind", function* become_blind(f: Frame) {
	if (rt.bitAnd(this.disabilities, 1)) return f.dot;
	(rt.modSrcVar(f, "disabilities", 1, rt.bitOr));
	yield* this.blind_eyes(1);
	return 1;
}, true);

// status_procs.dm:79
rt.def("/mob/living/carbon/proc/cure_nearsighted", function* cure_nearsighted(f: Frame) {
	if (!rt.bitAnd(this.disabilities, 8)) return f.dot;
	(rt.modSrcVar(f, "disabilities", 16777207, rt.bitAnd));
	yield* this.clear_fullscreen("nearsighted");
	return 1;
}, true);

// status_procs.dm:85
rt.def("/mob/living/carbon/proc/become_nearsighted", function* become_nearsighted(f: Frame) {
	if (rt.bitAnd(this.disabilities, 8)) return f.dot;
	(rt.modSrcVar(f, "disabilities", 8, rt.bitOr));
	yield* this.overlay_fullscreen("nearsighted", T("/obj/screen/fullscreen/impaired"), 1);
	return 1;
}, true);

// status_procs.dm:91
rt.def("/mob/living/carbon/proc/cure_husk", function* cure_husk(f: Frame) {
	if (!rt.bitAnd(this.disabilities, 64)) return f.dot;
	(rt.modSrcVar(f, "disabilities", 16777151, rt.bitAnd));
	(rt.modSrcVar(f, "status_flags", 16760831, rt.bitAnd));
	yield* this.update_body();
	return 1;
}, true);

// status_procs.dm:98
rt.def("/mob/living/carbon/proc/become_husk", function* become_husk(f: Frame) {
	if (rt.bitAnd(this.disabilities, 64)) {
		return f.dot;
	}
	(rt.modSrcVar(f, "disabilities", 64, rt.bitOr));
	(rt.modSrcVar(f, "status_flags", DISFIGURED, rt.bitOr));
	yield* this.update_body();
	return 1;
}, true);
