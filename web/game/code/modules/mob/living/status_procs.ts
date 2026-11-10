// Based on /tg/station's code/modules/mob/living/status_procs.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, add } = rt;


// status_procs.dm:9
rt.def("/mob/living/proc/IsStun", function IsStun(f: Frame) {
	return this.has_status_effect(T("/datum/status_effect/incapacitating/stun"));
});

// status_procs.dm:12
rt.def("/mob/living/proc/AmountStun", function AmountStun(f: Frame) {
	let S: Value = null;
	if (S = this.IsStun()) {
		return S.duration - rt.worldTime(f);
	}
	return 0;
});

// status_procs.dm:18
rt.def("/mob/living/proc/Stun", function* Stun(f: Frame, amount: Value, updating: Value, ignore_canstun: Value) {
	let S: Value = null;
	if (rt.bitAnd(this.status_flags, 4096) && amount > 0) return null; // tg_js: GODMODE stops stuns too, as in modern tg
	updating ??= 1;
	ignore_canstun ??= 0;
	if (!(rt.bitAnd(this.status_flags, 1) || ignore_canstun)) return f.dot;
	if (this.absorb_stun(amount, ignore_canstun)) {
		return f.dot;
	}
	if (S = this.IsStun()) {
		S.duration = max(rt.worldTime(f) + amount, S.duration);
	} else if (amount > 0) {
		S = (yield* this.apply_status_effect(T("/datum/status_effect/incapacitating/stun"), amount, updating));
	}
	return S;
}, true);

// status_procs.dm:29
rt.def("/mob/living/proc/SetStun", function* SetStun(f: Frame, amount: Value, updating: Value, ignore_canstun: Value) {
	if (rt.bitAnd(this.status_flags, 4096) && amount > 0) return null; // tg_js: GODMODE stops stuns too, as in modern tg
	updating ??= 1;
	ignore_canstun ??= 0;
	if (!(rt.bitAnd(this.status_flags, 1) || ignore_canstun)) return f.dot;
	let S: Value = this.IsStun();
	if (amount <= 0) {
		if (S) {
			yield* qdel(S);
		}
	} else {
		if (this.absorb_stun(amount, ignore_canstun)) {
			return f.dot;
		}
		if (S) {
			S.duration = rt.worldTime(f) + amount;
		} else {
			S = (yield* this.apply_status_effect(T("/datum/status_effect/incapacitating/stun"), amount, updating));
		}
	}
	return S;
}, true);

// status_procs.dm:44
rt.def("/mob/living/proc/AdjustStun", function* AdjustStun(f: Frame, amount: Value, updating: Value, ignore_canstun: Value) {
	let S: Value = null;
	if (rt.bitAnd(this.status_flags, 4096) && amount > 0) return null; // tg_js: GODMODE stops stuns too, as in modern tg
	updating ??= 1;
	ignore_canstun ??= 0;
	if (!(rt.bitAnd(this.status_flags, 1) || ignore_canstun)) return f.dot;
	if (this.absorb_stun(amount, ignore_canstun)) {
		return f.dot;
	}
	if (S = this.IsStun()) {
		S.duration += amount;
	} else if (amount > 0) {
		S = (yield* this.apply_status_effect(T("/datum/status_effect/incapacitating/stun"), amount, updating));
	}
	return S;
}, true);

// status_procs.dm:57
rt.def("/mob/living/proc/IsKnockdown", function IsKnockdown(f: Frame) {
	return this.has_status_effect(T("/datum/status_effect/incapacitating/knockdown"));
});

// status_procs.dm:60
rt.def("/mob/living/proc/AmountKnockdown", function AmountKnockdown(f: Frame) {
	let K: Value = null;
	if (K = this.IsKnockdown()) {
		return K.duration - rt.worldTime(f);
	}
	return 0;
});

// status_procs.dm:66
rt.def("/mob/living/proc/Knockdown", function* Knockdown(f: Frame, amount: Value, updating: Value, ignore_canknockdown: Value) {
	let K: Value = null;
	if (rt.bitAnd(this.status_flags, 4096) && amount > 0) return null; // tg_js: GODMODE stops stuns too, as in modern tg
	updating ??= 1;
	ignore_canknockdown ??= 0;
	if (!(rt.bitAnd(this.status_flags, 2) || ignore_canknockdown)) return f.dot;
	if (this.absorb_stun(amount, ignore_canknockdown)) {
		return f.dot;
	}
	if (K = this.IsKnockdown()) {
		K.duration = max(rt.worldTime(f) + amount, K.duration);
	} else if (amount > 0) {
		K = (yield* this.apply_status_effect(T("/datum/status_effect/incapacitating/knockdown"), amount, updating));
	}
	return K;
}, true);

// status_procs.dm:77
rt.def("/mob/living/proc/SetKnockdown", function* SetKnockdown(f: Frame, amount: Value, updating: Value, ignore_canknockdown: Value) {
	if (rt.bitAnd(this.status_flags, 4096) && amount > 0) return null; // tg_js: GODMODE stops stuns too, as in modern tg
	updating ??= 1;
	ignore_canknockdown ??= 0;
	if (!(rt.bitAnd(this.status_flags, 2) || ignore_canknockdown)) return f.dot;
	let K: Value = this.IsKnockdown();
	if (amount <= 0) {
		if (K) {
			yield* qdel(K);
		}
	} else {
		if (this.absorb_stun(amount, ignore_canknockdown)) {
			return f.dot;
		}
		if (K) {
			K.duration = rt.worldTime(f) + amount;
		} else {
			K = (yield* this.apply_status_effect(T("/datum/status_effect/incapacitating/knockdown"), amount, updating));
		}
	}
	return K;
}, true);

// status_procs.dm:92
rt.def("/mob/living/proc/AdjustKnockdown", function* AdjustKnockdown(f: Frame, amount: Value, updating: Value, ignore_canknockdown: Value) {
	let K: Value = null;
	if (rt.bitAnd(this.status_flags, 4096) && amount > 0) return null; // tg_js: GODMODE stops stuns too, as in modern tg
	updating ??= 1;
	ignore_canknockdown ??= 0;
	if (!(rt.bitAnd(this.status_flags, 2) || ignore_canknockdown)) return f.dot;
	if (this.absorb_stun(amount, ignore_canknockdown)) {
		return f.dot;
	}
	if (K = this.IsKnockdown()) {
		K.duration += amount;
	} else if (amount > 0) {
		K = (yield* this.apply_status_effect(T("/datum/status_effect/incapacitating/knockdown"), amount, updating));
	}
	return K;
}, true);

// status_procs.dm:106
rt.def("/mob/living/proc/add_stun_absorption", function add_stun_absorption(f: Frame, key: Value, duration: Value, priority: Value, message: Value, self_message: Value, examine_message: Value) {
	if (!rt.istype(this.stun_absorption, T("/list"))) {
		this.stun_absorption = list();
	}
	if (rt.index(this.stun_absorption, key)) {
		rt.setAt(rt.index(this.stun_absorption, key), "end_time", rt.worldTime(f) + duration);
		rt.setAt(rt.index(this.stun_absorption, key), "priority", priority);
		rt.setAt(rt.index(this.stun_absorption, key), "stuns_absorbed", 0);
	} else {
		rt.setAt(this.stun_absorption, key, rt.alist(f, ["end_time", rt.worldTime(f) + duration, "priority", priority, "stuns_absorbed", 0, "visible_message", message, "self_message", self_message, "examine_message", examine_message]));
	}
	return f.dot;
});

// status_procs.dm:117
rt.def("/mob/living/proc/absorb_stun", function absorb_stun(f: Frame, amount: Value, ignoring_flag_presence: Value) {
	let priority_absorb_key: Value = null, highest_priority: Value = null, i: Value = null;
	if (!amount || amount <= 0 || this.stat || ignoring_flag_presence || !rt.istype(this.stun_absorption, T("/list"))) {
		return 0;
	}
	for (i of each(this.stun_absorption)) {
		if (rt.index(rt.index(this.stun_absorption, i), "end_time") > rt.worldTime(f) && (!priority_absorb_key || rt.index(rt.index(this.stun_absorption, i), "priority") > highest_priority)) {
			highest_priority = rt.index((priority_absorb_key = rt.index(this.stun_absorption, i)), "priority");
		}
	}
	if (!priority_absorb_key) return f.dot;
	if (rt.at(priority_absorb_key, "visible_message") || rt.at(priority_absorb_key, "self_message")) {
		if (rt.at(priority_absorb_key, "visible_message") && rt.at(priority_absorb_key, "self_message")) {
			this.visible_message(`<span class='warning'>${this}${rt.at(priority_absorb_key, "visible_message")}</span>`, `<span class='boldwarning'>${rt.at(priority_absorb_key, "self_message")}</span>`);
		} else if (rt.at(priority_absorb_key, "visible_message")) {
			this.visible_message(`<span class='warning'>${this}${rt.at(priority_absorb_key, "visible_message")}</span>`);
		} else if (rt.at(priority_absorb_key, "self_message")) {
			to_chat(this, `<span class='boldwarning'>${rt.at(priority_absorb_key, "self_message")}</span>`);
		}
	}
	rt.modAt(priority_absorb_key, "stuns_absorbed", amount, add);
	return 1;
});
