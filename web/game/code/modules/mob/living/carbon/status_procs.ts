// From code/modules/mob/living/carbon/status_procs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/carbon/proc/damage_eyes  (code/modules/mob/living/carbon/status_procs.dm:6)  may sleep
rt.def("/mob/living/carbon/proc/damage_eyes", function* damage_eyes(f: Frame, amount: Value) {
	let eyes: Value = null;
	f.vars = () => [amount, eyes];
	if (!truthy((eyes = (yield* g.srcCall(f, "getorganslot", "eyes_sight"))))) {
		return live(f.dot);
	}
	if (!rt.gt(live(amount), 0)) return f.dot;
	rt.setFv(f, "eye_damage", live(eyes), live(amount));
	if (!rt.gt(rt.fv(f, "eye_damage", live(eyes)), 20)) return f.dot;
	if (rt.gt(rt.fv(f, "eye_damage", live(eyes)), 30)) {
		yield* g.srcCall(f, "overlay_fullscreen", "eye_damage", T("/obj/screen/fullscreen/impaired"), 2);
	} else {
		yield* g.srcCall(f, "overlay_fullscreen", "eye_damage", T("/obj/screen/fullscreen/impaired"), 1);
	}
	return f.dot;
}, true);

// /mob/living/carbon/proc/set_eye_damage  (code/modules/mob/living/carbon/status_procs.dm:18)  may sleep
rt.def("/mob/living/carbon/proc/set_eye_damage", function* set_eye_damage(f: Frame, amount: Value) {
	let eyes: Value = null;
	f.vars = () => [amount, eyes];
	if (!truthy((eyes = (yield* g.srcCall(f, "getorganslot", "eyes_sight"))))) {
		return live(f.dot);
	}
	rt.setFv(f, "eye_damage", live(eyes), (yield* g.call(f, P("/proc/max"), null, [live(amount), 0])));
	if (rt.gt(rt.fv(f, "eye_damage", live(eyes)), 20)) {
		if (rt.gt(rt.fv(f, "eye_damage", live(eyes)), 30)) {
			yield* g.srcCall(f, "overlay_fullscreen", "eye_damage", T("/obj/screen/fullscreen/impaired"), 2);
		} else {
			yield* g.srcCall(f, "overlay_fullscreen", "eye_damage", T("/obj/screen/fullscreen/impaired"), 1);
		}
	} else {
		yield* g.srcCall(f, "clear_fullscreen", "eye_damage");
	}
	return f.dot;
}, true);

// /mob/living/carbon/proc/adjust_eye_damage  (code/modules/mob/living/carbon/status_procs.dm:31)  may sleep
rt.def("/mob/living/carbon/proc/adjust_eye_damage", function* adjust_eye_damage(f: Frame, amount: Value) {
	let eyes: Value = null;
	f.vars = () => [amount, eyes];
	if (!truthy((eyes = (yield* g.srcCall(f, "getorganslot", "eyes_sight"))))) {
		return live(f.dot);
	}
	rt.setFv(f, "eye_damage", live(eyes), (yield* g.call(f, P("/proc/max"), null, [add(rt.fv(f, "eye_damage", live(eyes)), live(amount)), 0])));
	if (rt.gt(rt.fv(f, "eye_damage", live(eyes)), 20)) {
		if (rt.gt(rt.fv(f, "eye_damage", live(eyes)), 30)) {
			yield* g.srcCall(f, "overlay_fullscreen", "eye_damage", T("/obj/screen/fullscreen/impaired"), 2);
		} else {
			yield* g.srcCall(f, "overlay_fullscreen", "eye_damage", T("/obj/screen/fullscreen/impaired"), 1);
		}
	} else {
		yield* g.srcCall(f, "clear_fullscreen", "eye_damage");
	}
	return f.dot;
}, true);

// /mob/living/carbon/proc/adjust_drugginess  (code/modules/mob/living/carbon/status_procs.dm:44)  may sleep
rt.def("/mob/living/carbon/proc/adjust_drugginess", function* adjust_drugginess(f: Frame, amount: Value) {
	let old_druggy: Value = null;
	f.vars = () => [amount, old_druggy];
	old_druggy = rt.sv(f, "druggy");
	if (rt.gt(live(amount), 0)) {
		rt.modSrcVar(f, "druggy", live(amount), add);
		if (!truthy(live(old_druggy))) {
			yield* g.srcCall(f, "overlay_fullscreen", "high", T("/obj/screen/fullscreen/high"));
			yield* g.srcCall(f, "throw_alert", "high", T("/obj/screen/alert/high"));
		}
	} else {
		if (!truthy(live(old_druggy))) return f.dot;
		rt.setSv(f, "druggy", (yield* g.call(f, P("/proc/max"), null, [add(rt.sv(f, "druggy"), live(amount)), 0])));
		if (truthy(rt.sv(f, "druggy"))) return f.dot;
		yield* g.srcCall(f, "clear_fullscreen", "high");
		yield* g.srcCall(f, "clear_alert", "high");
	}
	return f.dot;
}, true);

// /mob/living/carbon/proc/set_drugginess  (code/modules/mob/living/carbon/status_procs.dm:56)  may sleep
rt.def("/mob/living/carbon/proc/set_drugginess", function* set_drugginess(f: Frame, amount: Value) {
	let old_druggy: Value = null;
	f.vars = () => [amount, old_druggy];
	old_druggy = rt.sv(f, "druggy");
	rt.setSv(f, "druggy", live(amount));
	if (rt.gt(live(amount), 0)) {
		if (!truthy(live(old_druggy))) {
			yield* g.srcCall(f, "overlay_fullscreen", "high", T("/obj/screen/fullscreen/high"));
			yield* g.srcCall(f, "throw_alert", "high", T("/obj/screen/alert/high"));
		}
	} else {
		if (!truthy(live(old_druggy))) return f.dot;
		yield* g.srcCall(f, "clear_fullscreen", "high");
		yield* g.srcCall(f, "clear_alert", "high");
	}
	return f.dot;
}, true);

// /mob/living/carbon/proc/cure_blind  (code/modules/mob/living/carbon/status_procs.dm:68)  may sleep
rt.def("/mob/living/carbon/proc/cure_blind", function* cure_blind(f: Frame) {
	if (!truthy(rt.bitAnd(rt.sv(f, "disabilities"), 1))) return f.dot;
	(rt.modSrcVar(f, "disabilities", 16777214, rt.bitAnd));
	yield* g.srcCall(f, "adjust_blindness", -1);
	return 1;
}, true);

// /mob/living/carbon/proc/become_blind  (code/modules/mob/living/carbon/status_procs.dm:73)  may sleep
rt.def("/mob/living/carbon/proc/become_blind", function* become_blind(f: Frame) {
	if (truthy(rt.bitAnd(rt.sv(f, "disabilities"), 1))) return f.dot;
	(rt.modSrcVar(f, "disabilities", 1, rt.bitOr));
	yield* g.srcCall(f, "blind_eyes", 1);
	return 1;
}, true);

// /mob/living/carbon/proc/cure_nearsighted  (code/modules/mob/living/carbon/status_procs.dm:79)  may sleep
rt.def("/mob/living/carbon/proc/cure_nearsighted", function* cure_nearsighted(f: Frame) {
	if (!truthy(rt.bitAnd(rt.sv(f, "disabilities"), 8))) return f.dot;
	(rt.modSrcVar(f, "disabilities", 16777207, rt.bitAnd));
	yield* g.srcCall(f, "clear_fullscreen", "nearsighted");
	return 1;
}, true);

// /mob/living/carbon/proc/become_nearsighted  (code/modules/mob/living/carbon/status_procs.dm:85)  may sleep
rt.def("/mob/living/carbon/proc/become_nearsighted", function* become_nearsighted(f: Frame) {
	if (truthy(rt.bitAnd(rt.sv(f, "disabilities"), 8))) return f.dot;
	(rt.modSrcVar(f, "disabilities", 8, rt.bitOr));
	yield* g.srcCall(f, "overlay_fullscreen", "nearsighted", T("/obj/screen/fullscreen/impaired"), 1);
	return 1;
}, true);

// /mob/living/carbon/proc/cure_husk  (code/modules/mob/living/carbon/status_procs.dm:91)  may sleep
rt.def("/mob/living/carbon/proc/cure_husk", function* cure_husk(f: Frame) {
	if (!truthy(rt.bitAnd(rt.sv(f, "disabilities"), 64))) return f.dot;
	(rt.modSrcVar(f, "disabilities", 16777151, rt.bitAnd));
	(rt.modSrcVar(f, "status_flags", 16760831, rt.bitAnd));
	yield* g.srcCall(f, "update_body");
	return 1;
}, true);

// /mob/living/carbon/proc/become_husk  (code/modules/mob/living/carbon/status_procs.dm:98)  may sleep
rt.def("/mob/living/carbon/proc/become_husk", function* become_husk(f: Frame) {
	if (truthy(rt.bitAnd(rt.sv(f, "disabilities"), 64))) {
		return live(f.dot);
	}
	(rt.modSrcVar(f, "disabilities", 64, rt.bitOr));
	(rt.modSrcVar(f, "status_flags", 16384, rt.bitOr));
	yield* g.srcCall(f, "update_body");
	return 1;
}, true);
