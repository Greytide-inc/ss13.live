// Based on /tg/station's code/modules/mob/status_procs.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// status_procs.dm:22
rt.def("/mob/living/proc/IsUnconscious", function IsUnconscious(f: Frame) {
	return this.has_status_effect(T("/datum/status_effect/incapacitating/unconscious"));
});

// status_procs.dm:25
rt.def("/mob/living/proc/AmountUnconscious", function AmountUnconscious(f: Frame) {
	let U: Value = null;
	if (U = this.IsUnconscious()) {
		return U.duration - rt.worldTime(f);
	}
	return 0;
});

// status_procs.dm:31
rt.def("/mob/living/proc/Unconscious", function* Unconscious(f: Frame, amount: Value, updating: Value, ignore_canunconscious: Value) {
	let U: Value = null;
	if (rt.bitAnd(this.status_flags, 4096) && amount > 0) return null; // tg_js: GODMODE stops stuns too, as in modern tg
	updating ??= 1;
	ignore_canunconscious ??= 0;
	if (!(rt.bitAnd(this.status_flags, 4) || ignore_canunconscious)) return f.dot;
	if (U = this.IsUnconscious()) {
		U.duration = max(rt.worldTime(f) + amount, U.duration);
	} else if (amount > 0) {
		U = (yield* this.apply_status_effect(T("/datum/status_effect/incapacitating/unconscious"), amount, updating));
	}
	return U;
}, true);

// status_procs.dm:40
rt.def("/mob/living/proc/SetUnconscious", function* SetUnconscious(f: Frame, amount: Value, updating: Value, ignore_canunconscious: Value) {
	if (rt.bitAnd(this.status_flags, 4096) && amount > 0) return null; // tg_js: GODMODE stops stuns too, as in modern tg
	updating ??= 1;
	ignore_canunconscious ??= 0;
	if (!(rt.bitAnd(this.status_flags, 4) || ignore_canunconscious)) return f.dot;
	let U: Value = this.IsUnconscious();
	if (amount <= 0) {
		if (U) {
			yield* qdel(U);
		}
	} else if (U) {
		U.duration = rt.worldTime(f) + amount;
	} else {
		U = (yield* this.apply_status_effect(T("/datum/status_effect/incapacitating/unconscious"), amount, updating));
	}
	return U;
}, true);

// status_procs.dm:52
rt.def("/mob/living/proc/AdjustUnconscious", function* AdjustUnconscious(f: Frame, amount: Value, updating: Value, ignore_canunconscious: Value) {
	let U: Value = null;
	if (rt.bitAnd(this.status_flags, 4096) && amount > 0) return null; // tg_js: GODMODE stops stuns too, as in modern tg
	updating ??= 1;
	ignore_canunconscious ??= 0;
	if (!(rt.bitAnd(this.status_flags, 4) || ignore_canunconscious)) return f.dot;
	if (U = this.IsUnconscious()) {
		U.duration += amount;
	} else if (amount > 0) {
		U = (yield* this.apply_status_effect(T("/datum/status_effect/incapacitating/unconscious"), amount, updating));
	}
	return U;
}, true);

// status_procs.dm:63
rt.def("/mob/living/proc/IsSleeping", function IsSleeping(f: Frame) {
	return this.has_status_effect(T("/datum/status_effect/incapacitating/sleeping"));
});

// status_procs.dm:66
rt.def("/mob/living/proc/AmountSleeping", function AmountSleeping(f: Frame) {
	let S: Value = null;
	if (S = this.IsSleeping()) {
		return S.duration - rt.worldTime(f);
	}
	return 0;
});

// status_procs.dm:72
rt.def("/mob/living/proc/Sleeping", function* Sleeping(f: Frame, amount: Value, updating: Value) {
	let S: Value = null;
	if (rt.bitAnd(this.status_flags, 4096) && amount > 0) return null; // tg_js: GODMODE stops stuns too, as in modern tg
	updating ??= 1;
	if (S = this.IsSleeping()) {
		S.duration = max(rt.worldTime(f) + amount, S.duration);
	} else if (amount > 0) {
		S = (yield* this.apply_status_effect(T("/datum/status_effect/incapacitating/sleeping"), amount, updating));
	}
	return S;
}, true);

// status_procs.dm:80
rt.def("/mob/living/proc/SetSleeping", function* SetSleeping(f: Frame, amount: Value, updating: Value) {
	if (rt.bitAnd(this.status_flags, 4096) && amount > 0) return null; // tg_js: GODMODE stops stuns too, as in modern tg
	updating ??= 1;
	let S: Value = this.IsSleeping();
	if (amount <= 0) {
		if (S) {
			yield* qdel(S);
		}
	} else if (S) {
		S.duration = rt.worldTime(f) + amount;
	} else {
		S = (yield* this.apply_status_effect(T("/datum/status_effect/incapacitating/sleeping"), amount, updating));
	}
	return S;
}, true);

// status_procs.dm:91
rt.def("/mob/living/proc/AdjustSleeping", function* AdjustSleeping(f: Frame, amount: Value, updating: Value) {
	let S: Value = null;
	if (rt.bitAnd(this.status_flags, 4096) && amount > 0) return null; // tg_js: GODMODE stops stuns too, as in modern tg
	updating ??= 1;
	if (S = this.IsSleeping()) {
		S.duration += amount;
	} else if (amount > 0) {
		S = (yield* this.apply_status_effect(T("/datum/status_effect/incapacitating/sleeping"), amount, updating));
	}
	return S;
}, true);

// status_procs.dm:124
rt.def("/mob/proc/Jitter", function Jitter(f: Frame, amount: Value) {
	this.jitteriness = max(this.jitteriness, amount, 0);
	return f.dot;
});

// status_procs.dm:129
rt.def("/mob/proc/Dizzy", function Dizzy(f: Frame, amount: Value) {
	this.dizziness = max(this.dizziness, amount, 0);
	return f.dot;
});

// status_procs.dm:145
rt.def("/mob/proc/blind_eyes", function* blind_eyes(f: Frame, amount: Value) {
	if (!(amount > 0)) return f.dot;
	let old_eye_blind: Value = this.eye_blind;
	this.eye_blind = max(this.eye_blind, amount);
	if (old_eye_blind) return f.dot;
	if (this.stat == 0) {
		yield* this.throw_alert("blind", T("/obj/screen/alert/blind"));
	}
	yield* this.overlay_fullscreen("blind", T("/obj/screen/fullscreen/blind"));
	return f.dot;
}, true);

// status_procs.dm:154
rt.def("/mob/proc/adjust_blindness", function* adjust_blindness(f: Frame, amount: Value) {
	let old_eye_blind: Value = null, blind_minimum: Value = null;
	if (amount > 0) {
		old_eye_blind = this.eye_blind;
		this.eye_blind += amount;
		if (!old_eye_blind) {
			if (this.stat == 0) {
				yield* this.throw_alert("blind", T("/obj/screen/alert/blind"));
			}
			yield* this.overlay_fullscreen("blind", T("/obj/screen/fullscreen/blind"));
		}
	} else {
		if (!this.eye_blind) return f.dot;
		blind_minimum = 0;
		if (this.stat != 0 || rt.bitAnd(this.disabilities, 1)) {
			blind_minimum = 1;
		}
		this.eye_blind = max(this.eye_blind + amount, blind_minimum);
		if (this.eye_blind) return f.dot;
		yield* this.clear_alert("blind");
		yield* this.clear_fullscreen("blind");
	}
	return f.dot;
}, true);

// status_procs.dm:171
rt.def("/mob/proc/set_blindness", function* set_blindness(f: Frame, amount: Value) {
	let old_eye_blind: Value = null, blind_minimum: Value = null;
	if (amount > 0) {
		old_eye_blind = this.eye_blind;
		this.eye_blind = amount;
		if (this.client && !old_eye_blind) {
			if (this.stat == 0) {
				yield* this.throw_alert("blind", T("/obj/screen/alert/blind"));
			}
			yield* this.overlay_fullscreen("blind", T("/obj/screen/fullscreen/blind"));
		}
	} else {
		if (!this.eye_blind) return f.dot;
		blind_minimum = 0;
		if (this.stat != 0 || rt.bitAnd(this.disabilities, 1)) {
			blind_minimum = 1;
		}
		this.eye_blind = blind_minimum;
		if (this.eye_blind) return f.dot;
		yield* this.clear_alert("blind");
		yield* this.clear_fullscreen("blind");
	}
	return f.dot;
}, true);

// status_procs.dm:190
rt.def("/mob/proc/blur_eyes", function* blur_eyes(f: Frame, amount: Value) {
	if (!(amount > 0)) return f.dot;
	let old_eye_blurry: Value = this.eye_blurry;
	this.eye_blurry = max(amount, this.eye_blurry);
	if (old_eye_blurry) return f.dot;
	yield* this.overlay_fullscreen("blurry", T("/obj/screen/fullscreen/blurry"));
	return f.dot;
}, true);

// status_procs.dm:197
rt.def("/mob/proc/adjust_blurriness", function* adjust_blurriness(f: Frame, amount: Value) {
	let old_eye_blurry: Value = this.eye_blurry;
	this.eye_blurry = max(this.eye_blurry + amount, 0);
	if (amount > 0) {
		if (!old_eye_blurry) {
			yield* this.overlay_fullscreen("blurry", T("/obj/screen/fullscreen/blurry"));
		}
	} else {
		if (!(old_eye_blurry && !this.eye_blurry)) return f.dot;
		yield* this.clear_fullscreen("blurry");
	}
	return f.dot;
}, true);

// status_procs.dm:206
rt.def("/mob/proc/set_blurriness", function* set_blurriness(f: Frame, amount: Value) {
	let old_eye_blurry: Value = this.eye_blurry;
	this.eye_blurry = max(amount, 0);
	if (amount > 0) {
		if (!old_eye_blurry) {
			yield* this.overlay_fullscreen("blurry", T("/obj/screen/fullscreen/blurry"));
		}
	} else {
		if (!old_eye_blurry) return f.dot;
		yield* this.clear_fullscreen("blurry");
	}
	return f.dot;
}, true);
