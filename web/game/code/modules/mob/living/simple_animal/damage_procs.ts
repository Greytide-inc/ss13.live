// From code/modules/mob/living/simple_animal/damage_procs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/simple_animal/proc/adjustHealth  (code/modules/mob/living/simple_animal/damage_procs.dm:3)  may sleep
rt.def("/mob/living/simple_animal/proc/adjustHealth", function* adjustHealth(f: Frame, amount: Value, updating_health: Value, forced: Value) {
	f.vars = () => [amount, updating_health, forced];
	if (live(updating_health) === null) {
		updating_health = 1;
	}
	if (live(forced) === null) {
		forced = 0;
	}
	if ((!truthy(live(forced)) && truthy(rt.bitAnd(rt.sv(f, "status_flags"), 4096)))) {
		return 0;
	}
	rt.setSv(f, "bruteloss", (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [add(rt.sv(f, "bruteloss"), live(amount)), rt.sv(f, "maxHealth")]))])));
	if (truthy(live(updating_health))) {
		yield* g.srcCall(f, "updatehealth");
	}
	return live(amount);
}, true);

// /mob/living/simple_animal/proc/adjustBruteLoss  (code/modules/mob/living/simple_animal/damage_procs.dm:12)  may sleep
rt.def("/mob/living/simple_animal/proc/adjustBruteLoss", function* adjustBruteLoss(f: Frame, amount: Value, updating_health: Value, forced: Value) {
	f.vars = () => [amount, updating_health, forced];
	if (live(updating_health) === null) {
		updating_health = 1;
	}
	if (live(forced) === null) {
		forced = 0;
	}
	if (truthy(live(forced))) {
		f.dot = (yield* g.srcCall(f, "adjustHealth", multiply(live(amount), rt.fv(f, "damage_multiplier", rt.gl("config"))), live(updating_health), live(forced)));
	} else {
		if (!truthy(rt.at(rt.sv(f, "damage_coeff"), "brute"))) return f.dot;
		f.dot = (yield* g.srcCall(f, "adjustHealth", multiply(multiply(live(amount), rt.at(rt.sv(f, "damage_coeff"), "brute")), rt.fv(f, "damage_multiplier", rt.gl("config"))), live(updating_health), live(forced)));
	}
	return f.dot;
}, true);

// /mob/living/simple_animal/proc/adjustFireLoss  (code/modules/mob/living/simple_animal/damage_procs.dm:18)  may sleep
rt.def("/mob/living/simple_animal/proc/adjustFireLoss", function* adjustFireLoss(f: Frame, amount: Value, updating_health: Value, forced: Value) {
	f.vars = () => [amount, updating_health, forced];
	if (live(updating_health) === null) {
		updating_health = 1;
	}
	if (live(forced) === null) {
		forced = 0;
	}
	if (truthy(live(forced))) {
		f.dot = (yield* g.srcCall(f, "adjustHealth", multiply(live(amount), rt.fv(f, "damage_multiplier", rt.gl("config"))), live(updating_health), live(forced)));
	} else {
		if (!truthy(rt.at(rt.sv(f, "damage_coeff"), "fire"))) return f.dot;
		f.dot = (yield* g.srcCall(f, "adjustHealth", multiply(multiply(live(amount), rt.at(rt.sv(f, "damage_coeff"), "fire")), rt.fv(f, "damage_multiplier", rt.gl("config"))), live(updating_health), live(forced)));
	}
	return f.dot;
}, true);

// /mob/living/simple_animal/proc/adjustOxyLoss  (code/modules/mob/living/simple_animal/damage_procs.dm:24)  may sleep
rt.def("/mob/living/simple_animal/proc/adjustOxyLoss", function* adjustOxyLoss(f: Frame, amount: Value, updating_health: Value, forced: Value) {
	f.vars = () => [amount, updating_health, forced];
	if (live(updating_health) === null) {
		updating_health = 1;
	}
	if (live(forced) === null) {
		forced = 0;
	}
	if (truthy(live(forced))) {
		f.dot = (yield* g.srcCall(f, "adjustHealth", multiply(live(amount), rt.fv(f, "damage_multiplier", rt.gl("config"))), live(updating_health), live(forced)));
	} else {
		if (!truthy(rt.at(rt.sv(f, "damage_coeff"), "oxy"))) return f.dot;
		f.dot = (yield* g.srcCall(f, "adjustHealth", multiply(multiply(live(amount), rt.at(rt.sv(f, "damage_coeff"), "oxy")), rt.fv(f, "damage_multiplier", rt.gl("config"))), live(updating_health), live(forced)));
	}
	return f.dot;
}, true);

// /mob/living/simple_animal/proc/adjustToxLoss  (code/modules/mob/living/simple_animal/damage_procs.dm:30)  may sleep
rt.def("/mob/living/simple_animal/proc/adjustToxLoss", function* adjustToxLoss(f: Frame, amount: Value, updating_health: Value, forced: Value) {
	f.vars = () => [amount, updating_health, forced];
	if (live(updating_health) === null) {
		updating_health = 1;
	}
	if (live(forced) === null) {
		forced = 0;
	}
	if (truthy(live(forced))) {
		f.dot = (yield* g.srcCall(f, "adjustHealth", multiply(live(amount), rt.fv(f, "damage_multiplier", rt.gl("config"))), live(updating_health), live(forced)));
	} else {
		if (!truthy(rt.at(rt.sv(f, "damage_coeff"), "tox"))) return f.dot;
		f.dot = (yield* g.srcCall(f, "adjustHealth", multiply(multiply(live(amount), rt.at(rt.sv(f, "damage_coeff"), "tox")), rt.fv(f, "damage_multiplier", rt.gl("config"))), live(updating_health), live(forced)));
	}
	return f.dot;
}, true);

// /mob/living/simple_animal/proc/adjustCloneLoss  (code/modules/mob/living/simple_animal/damage_procs.dm:36)  may sleep
rt.def("/mob/living/simple_animal/proc/adjustCloneLoss", function* adjustCloneLoss(f: Frame, amount: Value, updating_health: Value, forced: Value) {
	f.vars = () => [amount, updating_health, forced];
	if (live(updating_health) === null) {
		updating_health = 1;
	}
	if (live(forced) === null) {
		forced = 0;
	}
	if (truthy(live(forced))) {
		f.dot = (yield* g.srcCall(f, "adjustHealth", multiply(live(amount), rt.fv(f, "damage_multiplier", rt.gl("config"))), live(updating_health), live(forced)));
	} else {
		if (!truthy(rt.at(rt.sv(f, "damage_coeff"), "clone"))) return f.dot;
		f.dot = (yield* g.srcCall(f, "adjustHealth", multiply(multiply(live(amount), rt.at(rt.sv(f, "damage_coeff"), "clone")), rt.fv(f, "damage_multiplier", rt.gl("config"))), live(updating_health), live(forced)));
	}
	return f.dot;
}, true);
