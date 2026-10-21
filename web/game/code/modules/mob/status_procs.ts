// From code/modules/mob/status_procs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/proc/IsUnconscious  (code/modules/mob/status_procs.dm:22)
rt.def("/mob/living/proc/IsUnconscious", function IsUnconscious(f: Frame) {
	return rt.callSrc(f, "has_status_effect", [T("/datum/status_effect/incapacitating/unconscious")]);
});

// /mob/living/proc/AmountUnconscious  (code/modules/mob/status_procs.dm:25)
rt.def("/mob/living/proc/AmountUnconscious", function AmountUnconscious(f: Frame) {
	let U: Value = null;
	f.vars = () => [U];
	if (truthy((U = rt.callSrc(f, "IsUnconscious", [])))) {
		return subtract(rt.fv(f, "duration", live(U)), rt.worldTime(f));
	}
	return 0;
});

// /mob/living/proc/Unconscious  (code/modules/mob/status_procs.dm:31)  may sleep
rt.def("/mob/living/proc/Unconscious", function* Unconscious(f: Frame, amount: Value, updating: Value, ignore_canunconscious: Value) {
	let U: Value = null;
	f.vars = () => [amount, updating, ignore_canunconscious, U];
	if (live(updating) === null) {
		updating = 1;
	}
	if (live(ignore_canunconscious) === null) {
		ignore_canunconscious = 0;
	}
	if (!(truthy(rt.bitAnd(rt.sv(f, "status_flags"), 4)) || truthy(live(ignore_canunconscious)))) return f.dot;
	if (truthy((U = (yield* g.srcCall(f, "IsUnconscious"))))) {
		rt.setFv(f, "duration", live(U), (yield* g.call(f, P("/proc/max"), null, [add(rt.worldTime(f), live(amount)), rt.fv(f, "duration", live(U))])));
	} else {
		if (rt.gt(live(amount), 0)) {
			U = (yield* g.srcCall(f, "apply_status_effect", T("/datum/status_effect/incapacitating/unconscious"), live(amount), live(updating)));
		}
	}
	return live(U);
}, true);

// /mob/living/proc/SetUnconscious  (code/modules/mob/status_procs.dm:40)  may sleep
rt.def("/mob/living/proc/SetUnconscious", function* SetUnconscious(f: Frame, amount: Value, updating: Value, ignore_canunconscious: Value) {
	let U: Value = null;
	f.vars = () => [amount, updating, ignore_canunconscious, U];
	if (live(updating) === null) {
		updating = 1;
	}
	if (live(ignore_canunconscious) === null) {
		ignore_canunconscious = 0;
	}
	if (!(truthy(rt.bitAnd(rt.sv(f, "status_flags"), 4)) || truthy(live(ignore_canunconscious)))) return f.dot;
	U = (yield* g.srcCall(f, "IsUnconscious"));
	if (rt.le(live(amount), 0)) {
		if (truthy(live(U))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(U)]);
		}
	} else {
		if (truthy(live(U))) {
			rt.setFv(f, "duration", live(U), add(rt.worldTime(f), live(amount)));
		} else {
			U = (yield* g.srcCall(f, "apply_status_effect", T("/datum/status_effect/incapacitating/unconscious"), live(amount), live(updating)));
		}
	}
	return live(U);
}, true);

// /mob/living/proc/AdjustUnconscious  (code/modules/mob/status_procs.dm:52)  may sleep
rt.def("/mob/living/proc/AdjustUnconscious", function* AdjustUnconscious(f: Frame, amount: Value, updating: Value, ignore_canunconscious: Value) {
	let U: Value = null;
	f.vars = () => [amount, updating, ignore_canunconscious, U];
	if (live(updating) === null) {
		updating = 1;
	}
	if (live(ignore_canunconscious) === null) {
		ignore_canunconscious = 0;
	}
	if (!(truthy(rt.bitAnd(rt.sv(f, "status_flags"), 4)) || truthy(live(ignore_canunconscious)))) return f.dot;
	if (truthy((U = (yield* g.srcCall(f, "IsUnconscious"))))) {
		rt.modField(f, live(U), "duration", live(amount), add);
	} else {
		if (rt.gt(live(amount), 0)) {
			U = (yield* g.srcCall(f, "apply_status_effect", T("/datum/status_effect/incapacitating/unconscious"), live(amount), live(updating)));
		}
	}
	return live(U);
}, true);

// /mob/living/proc/IsSleeping  (code/modules/mob/status_procs.dm:63)
rt.def("/mob/living/proc/IsSleeping", function IsSleeping(f: Frame) {
	return rt.callSrc(f, "has_status_effect", [T("/datum/status_effect/incapacitating/sleeping")]);
});

// /mob/living/proc/AmountSleeping  (code/modules/mob/status_procs.dm:66)
rt.def("/mob/living/proc/AmountSleeping", function AmountSleeping(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	if (truthy((S = rt.callSrc(f, "IsSleeping", [])))) {
		return subtract(rt.fv(f, "duration", live(S)), rt.worldTime(f));
	}
	return 0;
});

// /mob/living/proc/Sleeping  (code/modules/mob/status_procs.dm:72)  may sleep
rt.def("/mob/living/proc/Sleeping", function* Sleeping(f: Frame, amount: Value, updating: Value) {
	let S: Value = null;
	f.vars = () => [amount, updating, S];
	if (live(updating) === null) {
		updating = 1;
	}
	if (truthy((S = (yield* g.srcCall(f, "IsSleeping"))))) {
		rt.setFv(f, "duration", live(S), (yield* g.call(f, P("/proc/max"), null, [add(rt.worldTime(f), live(amount)), rt.fv(f, "duration", live(S))])));
	} else {
		if (rt.gt(live(amount), 0)) {
			S = (yield* g.srcCall(f, "apply_status_effect", T("/datum/status_effect/incapacitating/sleeping"), live(amount), live(updating)));
		}
	}
	return live(S);
}, true);

// /mob/living/proc/SetSleeping  (code/modules/mob/status_procs.dm:80)  may sleep
rt.def("/mob/living/proc/SetSleeping", function* SetSleeping(f: Frame, amount: Value, updating: Value) {
	let S: Value = null;
	f.vars = () => [amount, updating, S];
	if (live(updating) === null) {
		updating = 1;
	}
	S = (yield* g.srcCall(f, "IsSleeping"));
	if (rt.le(live(amount), 0)) {
		if (truthy(live(S))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(S)]);
		}
	} else {
		if (truthy(live(S))) {
			rt.setFv(f, "duration", live(S), add(rt.worldTime(f), live(amount)));
		} else {
			S = (yield* g.srcCall(f, "apply_status_effect", T("/datum/status_effect/incapacitating/sleeping"), live(amount), live(updating)));
		}
	}
	return live(S);
}, true);

// /mob/living/proc/AdjustSleeping  (code/modules/mob/status_procs.dm:91)  may sleep
rt.def("/mob/living/proc/AdjustSleeping", function* AdjustSleeping(f: Frame, amount: Value, updating: Value) {
	let S: Value = null;
	f.vars = () => [amount, updating, S];
	if (live(updating) === null) {
		updating = 1;
	}
	if (truthy((S = (yield* g.srcCall(f, "IsSleeping"))))) {
		rt.modField(f, live(S), "duration", live(amount), add);
	} else {
		if (rt.gt(live(amount), 0)) {
			S = (yield* g.srcCall(f, "apply_status_effect", T("/datum/status_effect/incapacitating/sleeping"), live(amount), live(updating)));
		}
	}
	return live(S);
}, true);

// /mob/proc/Jitter  (code/modules/mob/status_procs.dm:124)
rt.def("/mob/proc/Jitter", function Jitter(f: Frame, amount: Value) {
	rt.setSv(f, "jitteriness", rt.call(f, P("/proc/max"), null, [rt.sv(f, "jitteriness"), live(amount), 0]));
	return f.dot;
});

// /mob/proc/Dizzy  (code/modules/mob/status_procs.dm:129)
rt.def("/mob/proc/Dizzy", function Dizzy(f: Frame, amount: Value) {
	rt.setSv(f, "dizziness", rt.call(f, P("/proc/max"), null, [rt.sv(f, "dizziness"), live(amount), 0]));
	return f.dot;
});

// /mob/proc/blind_eyes  (code/modules/mob/status_procs.dm:145)  may sleep
rt.def("/mob/proc/blind_eyes", function* blind_eyes(f: Frame, amount: Value) {
	let old_eye_blind: Value = null;
	f.vars = () => [amount, old_eye_blind];
	if (!rt.gt(live(amount), 0)) return f.dot;
	old_eye_blind = rt.sv(f, "eye_blind");
	rt.setSv(f, "eye_blind", (yield* g.call(f, P("/proc/max"), null, [rt.sv(f, "eye_blind"), live(amount)])));
	if (truthy(live(old_eye_blind))) return f.dot;
	if (isEqual(rt.sv(f, "stat"), 0)) {
		yield* g.srcCall(f, "throw_alert", "blind", T("/obj/screen/alert/blind"));
	}
	yield* g.srcCall(f, "overlay_fullscreen", "blind", T("/obj/screen/fullscreen/blind"));
	return f.dot;
}, true);

// /mob/proc/adjust_blindness  (code/modules/mob/status_procs.dm:154)  may sleep
rt.def("/mob/proc/adjust_blindness", function* adjust_blindness(f: Frame, amount: Value) {
	let old_eye_blind: Value = null, blind_minimum: Value = null;
	f.vars = () => [amount, old_eye_blind, blind_minimum];
	if (rt.gt(live(amount), 0)) {
		old_eye_blind = rt.sv(f, "eye_blind");
		rt.modSrcVar(f, "eye_blind", live(amount), add);
		if (!truthy(live(old_eye_blind))) {
			if (isEqual(rt.sv(f, "stat"), 0)) {
				yield* g.srcCall(f, "throw_alert", "blind", T("/obj/screen/alert/blind"));
			}
			yield* g.srcCall(f, "overlay_fullscreen", "blind", T("/obj/screen/fullscreen/blind"));
		}
	} else {
		if (!truthy(rt.sv(f, "eye_blind"))) return f.dot;
		blind_minimum = 0;
		if ((!isEqual(rt.sv(f, "stat"), 0) || truthy(rt.bitAnd(rt.sv(f, "disabilities"), 1)))) {
			blind_minimum = 1;
		}
		rt.setSv(f, "eye_blind", (yield* g.call(f, P("/proc/max"), null, [add(rt.sv(f, "eye_blind"), live(amount)), live(blind_minimum)])));
		if (truthy(rt.sv(f, "eye_blind"))) return f.dot;
		yield* g.srcCall(f, "clear_alert", "blind");
		yield* g.srcCall(f, "clear_fullscreen", "blind");
	}
	return f.dot;
}, true);

// /mob/proc/set_blindness  (code/modules/mob/status_procs.dm:171)  may sleep
rt.def("/mob/proc/set_blindness", function* set_blindness(f: Frame, amount: Value) {
	let old_eye_blind: Value = null, blind_minimum: Value = null;
	f.vars = () => [amount, old_eye_blind, blind_minimum];
	if (rt.gt(live(amount), 0)) {
		old_eye_blind = rt.sv(f, "eye_blind");
		rt.setSv(f, "eye_blind", live(amount));
		if ((truthy(rt.sv(f, "client")) && !truthy(live(old_eye_blind)))) {
			if (isEqual(rt.sv(f, "stat"), 0)) {
				yield* g.srcCall(f, "throw_alert", "blind", T("/obj/screen/alert/blind"));
			}
			yield* g.srcCall(f, "overlay_fullscreen", "blind", T("/obj/screen/fullscreen/blind"));
		}
	} else {
		if (!truthy(rt.sv(f, "eye_blind"))) return f.dot;
		blind_minimum = 0;
		if ((!isEqual(rt.sv(f, "stat"), 0) || truthy(rt.bitAnd(rt.sv(f, "disabilities"), 1)))) {
			blind_minimum = 1;
		}
		rt.setSv(f, "eye_blind", live(blind_minimum));
		if (truthy(rt.sv(f, "eye_blind"))) return f.dot;
		yield* g.srcCall(f, "clear_alert", "blind");
		yield* g.srcCall(f, "clear_fullscreen", "blind");
	}
	return f.dot;
}, true);

// /mob/proc/blur_eyes  (code/modules/mob/status_procs.dm:190)  may sleep
rt.def("/mob/proc/blur_eyes", function* blur_eyes(f: Frame, amount: Value) {
	let old_eye_blurry: Value = null;
	f.vars = () => [amount, old_eye_blurry];
	if (!rt.gt(live(amount), 0)) return f.dot;
	old_eye_blurry = rt.sv(f, "eye_blurry");
	rt.setSv(f, "eye_blurry", (yield* g.call(f, P("/proc/max"), null, [live(amount), rt.sv(f, "eye_blurry")])));
	if (truthy(live(old_eye_blurry))) return f.dot;
	yield* g.srcCall(f, "overlay_fullscreen", "blurry", T("/obj/screen/fullscreen/blurry"));
	return f.dot;
}, true);

// /mob/proc/adjust_blurriness  (code/modules/mob/status_procs.dm:197)  may sleep
rt.def("/mob/proc/adjust_blurriness", function* adjust_blurriness(f: Frame, amount: Value) {
	let old_eye_blurry: Value = null;
	f.vars = () => [amount, old_eye_blurry];
	old_eye_blurry = rt.sv(f, "eye_blurry");
	rt.setSv(f, "eye_blurry", (yield* g.call(f, P("/proc/max"), null, [add(rt.sv(f, "eye_blurry"), live(amount)), 0])));
	if (rt.gt(live(amount), 0)) {
		if (!truthy(live(old_eye_blurry))) {
			yield* g.srcCall(f, "overlay_fullscreen", "blurry", T("/obj/screen/fullscreen/blurry"));
		}
	} else {
		if (!(truthy(live(old_eye_blurry)) && !truthy(rt.sv(f, "eye_blurry")))) return f.dot;
		yield* g.srcCall(f, "clear_fullscreen", "blurry");
	}
	return f.dot;
}, true);

// /mob/proc/set_blurriness  (code/modules/mob/status_procs.dm:206)  may sleep
rt.def("/mob/proc/set_blurriness", function* set_blurriness(f: Frame, amount: Value) {
	let old_eye_blurry: Value = null;
	f.vars = () => [amount, old_eye_blurry];
	old_eye_blurry = rt.sv(f, "eye_blurry");
	rt.setSv(f, "eye_blurry", (yield* g.call(f, P("/proc/max"), null, [live(amount), 0])));
	if (rt.gt(live(amount), 0)) {
		if (!truthy(live(old_eye_blurry))) {
			yield* g.srcCall(f, "overlay_fullscreen", "blurry", T("/obj/screen/fullscreen/blurry"));
		}
	} else {
		if (!truthy(live(old_eye_blurry))) return f.dot;
		yield* g.srcCall(f, "clear_fullscreen", "blurry");
	}
	return f.dot;
}, true);
