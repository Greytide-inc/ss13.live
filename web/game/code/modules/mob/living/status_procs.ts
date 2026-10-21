// From code/modules/mob/living/status_procs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/proc/IsStun  (code/modules/mob/living/status_procs.dm:9)
rt.def("/mob/living/proc/IsStun", function IsStun(f: Frame) {
	return rt.callSrc(f, "has_status_effect", [T("/datum/status_effect/incapacitating/stun")]);
});

// /mob/living/proc/AmountStun  (code/modules/mob/living/status_procs.dm:12)
rt.def("/mob/living/proc/AmountStun", function AmountStun(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	if (truthy((S = rt.callSrc(f, "IsStun", [])))) {
		return subtract(rt.fv(f, "duration", live(S)), rt.worldTime(f));
	}
	return 0;
});

// /mob/living/proc/Stun  (code/modules/mob/living/status_procs.dm:18)  may sleep
rt.def("/mob/living/proc/Stun", function* Stun(f: Frame, amount: Value, updating: Value, ignore_canstun: Value) {
	let S: Value = null;
	f.vars = () => [amount, updating, ignore_canstun, S];
	if (live(updating) === null) {
		updating = 1;
	}
	if (live(ignore_canstun) === null) {
		ignore_canstun = 0;
	}
	if (!(truthy(rt.bitAnd(rt.sv(f, "status_flags"), 1)) || truthy(live(ignore_canstun)))) return f.dot;
	if (truthy((yield* g.srcCall(f, "absorb_stun", live(amount), live(ignore_canstun))))) {
		return live(f.dot);
	}
	if (truthy((S = (yield* g.srcCall(f, "IsStun"))))) {
		rt.setFv(f, "duration", live(S), (yield* g.call(f, P("/proc/max"), null, [add(rt.worldTime(f), live(amount)), rt.fv(f, "duration", live(S))])));
	} else {
		if (rt.gt(live(amount), 0)) {
			S = (yield* g.srcCall(f, "apply_status_effect", T("/datum/status_effect/incapacitating/stun"), live(amount), live(updating)));
		}
	}
	return live(S);
}, true);

// /mob/living/proc/SetStun  (code/modules/mob/living/status_procs.dm:29)  may sleep
rt.def("/mob/living/proc/SetStun", function* SetStun(f: Frame, amount: Value, updating: Value, ignore_canstun: Value) {
	let S: Value = null;
	f.vars = () => [amount, updating, ignore_canstun, S];
	if (live(updating) === null) {
		updating = 1;
	}
	if (live(ignore_canstun) === null) {
		ignore_canstun = 0;
	}
	if (!(truthy(rt.bitAnd(rt.sv(f, "status_flags"), 1)) || truthy(live(ignore_canstun)))) return f.dot;
	S = (yield* g.srcCall(f, "IsStun"));
	if (rt.le(live(amount), 0)) {
		if (truthy(live(S))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(S)]);
		}
	} else {
		if (truthy((yield* g.srcCall(f, "absorb_stun", live(amount), live(ignore_canstun))))) {
			return live(f.dot);
		}
		if (truthy(live(S))) {
			rt.setFv(f, "duration", live(S), add(rt.worldTime(f), live(amount)));
		} else {
			S = (yield* g.srcCall(f, "apply_status_effect", T("/datum/status_effect/incapacitating/stun"), live(amount), live(updating)));
		}
	}
	return live(S);
}, true);

// /mob/living/proc/AdjustStun  (code/modules/mob/living/status_procs.dm:44)  may sleep
rt.def("/mob/living/proc/AdjustStun", function* AdjustStun(f: Frame, amount: Value, updating: Value, ignore_canstun: Value) {
	let S: Value = null;
	f.vars = () => [amount, updating, ignore_canstun, S];
	if (live(updating) === null) {
		updating = 1;
	}
	if (live(ignore_canstun) === null) {
		ignore_canstun = 0;
	}
	if (!(truthy(rt.bitAnd(rt.sv(f, "status_flags"), 1)) || truthy(live(ignore_canstun)))) return f.dot;
	if (truthy((yield* g.srcCall(f, "absorb_stun", live(amount), live(ignore_canstun))))) {
		return live(f.dot);
	}
	if (truthy((S = (yield* g.srcCall(f, "IsStun"))))) {
		rt.modField(f, live(S), "duration", live(amount), add);
	} else {
		if (rt.gt(live(amount), 0)) {
			S = (yield* g.srcCall(f, "apply_status_effect", T("/datum/status_effect/incapacitating/stun"), live(amount), live(updating)));
		}
	}
	return live(S);
}, true);

// /mob/living/proc/IsKnockdown  (code/modules/mob/living/status_procs.dm:57)
rt.def("/mob/living/proc/IsKnockdown", function IsKnockdown(f: Frame) {
	return rt.callSrc(f, "has_status_effect", [T("/datum/status_effect/incapacitating/knockdown")]);
});

// /mob/living/proc/AmountKnockdown  (code/modules/mob/living/status_procs.dm:60)
rt.def("/mob/living/proc/AmountKnockdown", function AmountKnockdown(f: Frame) {
	let K: Value = null;
	f.vars = () => [K];
	if (truthy((K = rt.callSrc(f, "IsKnockdown", [])))) {
		return subtract(rt.fv(f, "duration", live(K)), rt.worldTime(f));
	}
	return 0;
});

// /mob/living/proc/Knockdown  (code/modules/mob/living/status_procs.dm:66)  may sleep
rt.def("/mob/living/proc/Knockdown", function* Knockdown(f: Frame, amount: Value, updating: Value, ignore_canknockdown: Value) {
	let K: Value = null;
	f.vars = () => [amount, updating, ignore_canknockdown, K];
	if (live(updating) === null) {
		updating = 1;
	}
	if (live(ignore_canknockdown) === null) {
		ignore_canknockdown = 0;
	}
	if (!(truthy(rt.bitAnd(rt.sv(f, "status_flags"), 2)) || truthy(live(ignore_canknockdown)))) return f.dot;
	if (truthy((yield* g.srcCall(f, "absorb_stun", live(amount), live(ignore_canknockdown))))) {
		return live(f.dot);
	}
	if (truthy((K = (yield* g.srcCall(f, "IsKnockdown"))))) {
		rt.setFv(f, "duration", live(K), (yield* g.call(f, P("/proc/max"), null, [add(rt.worldTime(f), live(amount)), rt.fv(f, "duration", live(K))])));
	} else {
		if (rt.gt(live(amount), 0)) {
			K = (yield* g.srcCall(f, "apply_status_effect", T("/datum/status_effect/incapacitating/knockdown"), live(amount), live(updating)));
		}
	}
	return live(K);
}, true);

// /mob/living/proc/SetKnockdown  (code/modules/mob/living/status_procs.dm:77)  may sleep
rt.def("/mob/living/proc/SetKnockdown", function* SetKnockdown(f: Frame, amount: Value, updating: Value, ignore_canknockdown: Value) {
	let K: Value = null;
	f.vars = () => [amount, updating, ignore_canknockdown, K];
	if (live(updating) === null) {
		updating = 1;
	}
	if (live(ignore_canknockdown) === null) {
		ignore_canknockdown = 0;
	}
	if (!(truthy(rt.bitAnd(rt.sv(f, "status_flags"), 2)) || truthy(live(ignore_canknockdown)))) return f.dot;
	K = (yield* g.srcCall(f, "IsKnockdown"));
	if (rt.le(live(amount), 0)) {
		if (truthy(live(K))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(K)]);
		}
	} else {
		if (truthy((yield* g.srcCall(f, "absorb_stun", live(amount), live(ignore_canknockdown))))) {
			return live(f.dot);
		}
		if (truthy(live(K))) {
			rt.setFv(f, "duration", live(K), add(rt.worldTime(f), live(amount)));
		} else {
			K = (yield* g.srcCall(f, "apply_status_effect", T("/datum/status_effect/incapacitating/knockdown"), live(amount), live(updating)));
		}
	}
	return live(K);
}, true);

// /mob/living/proc/AdjustKnockdown  (code/modules/mob/living/status_procs.dm:92)  may sleep
rt.def("/mob/living/proc/AdjustKnockdown", function* AdjustKnockdown(f: Frame, amount: Value, updating: Value, ignore_canknockdown: Value) {
	let K: Value = null;
	f.vars = () => [amount, updating, ignore_canknockdown, K];
	if (live(updating) === null) {
		updating = 1;
	}
	if (live(ignore_canknockdown) === null) {
		ignore_canknockdown = 0;
	}
	if (!(truthy(rt.bitAnd(rt.sv(f, "status_flags"), 2)) || truthy(live(ignore_canknockdown)))) return f.dot;
	if (truthy((yield* g.srcCall(f, "absorb_stun", live(amount), live(ignore_canknockdown))))) {
		return live(f.dot);
	}
	if (truthy((K = (yield* g.srcCall(f, "IsKnockdown"))))) {
		rt.modField(f, live(K), "duration", live(amount), add);
	} else {
		if (rt.gt(live(amount), 0)) {
			K = (yield* g.srcCall(f, "apply_status_effect", T("/datum/status_effect/incapacitating/knockdown"), live(amount), live(updating)));
		}
	}
	return live(K);
}, true);

// /mob/living/proc/add_stun_absorption  (code/modules/mob/living/status_procs.dm:106)
rt.def("/mob/living/proc/add_stun_absorption", function add_stun_absorption(f: Frame, key: Value, duration: Value, priority: Value, message: Value, self_message: Value, examine_message: Value) {
	if (!truthy((rt.istype(rt.sv(f, "stun_absorption"), T("/list")) ? 1 : 0))) {
		rt.setSv(f, "stun_absorption", rt.list());
	}
	if (truthy(rt.index(rt.sv(f, "stun_absorption"), live(key)))) {
		rt.setAt(rt.index(rt.sv(f, "stun_absorption"), live(key)), "end_time", add(rt.worldTime(f), live(duration)));
		rt.setAt(rt.index(rt.sv(f, "stun_absorption"), live(key)), "priority", live(priority));
		rt.setAt(rt.index(rt.sv(f, "stun_absorption"), live(key)), "stuns_absorbed", 0);
	} else {
		rt.setAt(rt.sv(f, "stun_absorption"), live(key), rt.alist(f, ["end_time", add(rt.worldTime(f), live(duration)), "priority", live(priority), "stuns_absorbed", 0, "visible_message", live(message), "self_message", live(self_message), "examine_message", live(examine_message)]));
	}
	return f.dot;
});

// /mob/living/proc/absorb_stun  (code/modules/mob/living/status_procs.dm:117)
rt.def("/mob/living/proc/absorb_stun", function absorb_stun(f: Frame, amount: Value, ignoring_flag_presence: Value) {
	let priority_absorb_key: Value = null, highest_priority: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [priority_absorb_key, highest_priority, i, $e];
	if (((((!truthy(live(amount)) || rt.le(live(amount), 0)) || truthy(rt.sv(f, "stat"))) || truthy(live(ignoring_flag_presence))) || !truthy((rt.istype(rt.sv(f, "stun_absorption"), T("/list")) ? 1 : 0)))) {
		return 0;
	}
	priority_absorb_key = null;
	highest_priority = null;
	i = null;
	rt.forList(f, 0, rt.sv(f, "stun_absorption"));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if ((rt.gt(rt.index(rt.index(rt.sv(f, "stun_absorption"), live(i)), "end_time"), rt.worldTime(f)) && (!truthy(live(priority_absorb_key)) || rt.gt(rt.index(rt.index(rt.sv(f, "stun_absorption"), live(i)), "priority"), live(highest_priority))))) {
			highest_priority = rt.index((priority_absorb_key = rt.index(rt.sv(f, "stun_absorption"), live(i))), "priority");
		}
	}
	rt.endFor(f, 0);
	if (!truthy(live(priority_absorb_key))) return f.dot;
	if ((truthy(rt.at(live(priority_absorb_key), "visible_message")) || truthy(rt.at(live(priority_absorb_key), "self_message")))) {
		if ((truthy(rt.at(live(priority_absorb_key), "visible_message")) && truthy(rt.at(live(priority_absorb_key), "self_message")))) {
			rt.callSrc(f, "visible_message", [fmt("<span class='warning'>＀＀</span>", [live(f.src), rt.at(live(priority_absorb_key), "visible_message")]), fmt("<span class='boldwarning'>＀</span>", [rt.at(live(priority_absorb_key), "self_message")])]);
		} else {
			if (truthy(rt.at(live(priority_absorb_key), "visible_message"))) {
				rt.callSrc(f, "visible_message", [fmt("<span class='warning'>＀＀</span>", [live(f.src), rt.at(live(priority_absorb_key), "visible_message")])]);
			} else {
				if (truthy(rt.at(live(priority_absorb_key), "self_message"))) {
					rt.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='boldwarning'>＀</span>", [rt.at(live(priority_absorb_key), "self_message")])]);
				}
			}
		}
	}
	rt.modAt(live(priority_absorb_key), "stuns_absorbed", live(amount), add);
	return 1;
});
