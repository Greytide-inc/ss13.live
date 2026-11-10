// Based on /tg/station's code/modules/mob/living/simple_animal/damage_procs.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// damage_procs.dm:3
rt.def("/mob/living/simple_animal/proc/adjustHealth", function* adjustHealth(f: Frame, amount: Value, updating_health: Value, forced: Value) {
	updating_health ??= 1;
	forced ??= 0;
	if (!forced && rt.bitAnd(this.status_flags, 4096)) {
		return 0;
	}
	this.bruteloss = max(0, min(this.bruteloss + amount, this.maxHealth));
	if (updating_health) {
		yield* this.updatehealth();
	}
	return amount;
}, true);

// damage_procs.dm:12
rt.def("/mob/living/simple_animal/proc/adjustBruteLoss", function* adjustBruteLoss(f: Frame, amount: Value, updating_health: Value, forced: Value) {
	updating_health ??= 1;
	forced ??= 0;
	if (forced) {
		f.dot = (yield* this.adjustHealth(amount * GLOB.config.damage_multiplier, updating_health, forced));
	} else {
		if (!rt.at(this.damage_coeff, "brute")) return f.dot;
		f.dot = (yield* this.adjustHealth(amount * rt.at(this.damage_coeff, "brute") * GLOB.config.damage_multiplier, updating_health, forced));
	}
	return f.dot;
}, true);

// damage_procs.dm:18
rt.def("/mob/living/simple_animal/proc/adjustFireLoss", function* adjustFireLoss(f: Frame, amount: Value, updating_health: Value, forced: Value) {
	updating_health ??= 1;
	forced ??= 0;
	if (forced) {
		f.dot = (yield* this.adjustHealth(amount * GLOB.config.damage_multiplier, updating_health, forced));
	} else {
		if (!rt.at(this.damage_coeff, "fire")) return f.dot;
		f.dot = (yield* this.adjustHealth(amount * rt.at(this.damage_coeff, "fire") * GLOB.config.damage_multiplier, updating_health, forced));
	}
	return f.dot;
}, true);

// damage_procs.dm:24
rt.def("/mob/living/simple_animal/proc/adjustOxyLoss", function* adjustOxyLoss(f: Frame, amount: Value, updating_health: Value, forced: Value) {
	updating_health ??= 1;
	forced ??= 0;
	if (forced) {
		f.dot = (yield* this.adjustHealth(amount * GLOB.config.damage_multiplier, updating_health, forced));
	} else {
		if (!rt.at(this.damage_coeff, "oxy")) return f.dot;
		f.dot = (yield* this.adjustHealth(amount * rt.at(this.damage_coeff, "oxy") * GLOB.config.damage_multiplier, updating_health, forced));
	}
	return f.dot;
}, true);

// damage_procs.dm:30
rt.def("/mob/living/simple_animal/proc/adjustToxLoss", function* adjustToxLoss(f: Frame, amount: Value, updating_health: Value, forced: Value) {
	updating_health ??= 1;
	forced ??= 0;
	if (forced) {
		f.dot = (yield* this.adjustHealth(amount * GLOB.config.damage_multiplier, updating_health, forced));
	} else {
		if (!rt.at(this.damage_coeff, "tox")) return f.dot;
		f.dot = (yield* this.adjustHealth(amount * rt.at(this.damage_coeff, "tox") * GLOB.config.damage_multiplier, updating_health, forced));
	}
	return f.dot;
}, true);

// damage_procs.dm:36
rt.def("/mob/living/simple_animal/proc/adjustCloneLoss", function* adjustCloneLoss(f: Frame, amount: Value, updating_health: Value, forced: Value) {
	updating_health ??= 1;
	forced ??= 0;
	if (forced) {
		f.dot = (yield* this.adjustHealth(amount * GLOB.config.damage_multiplier, updating_health, forced));
	} else {
		if (!rt.at(this.damage_coeff, "clone")) return f.dot;
		f.dot = (yield* this.adjustHealth(amount * rt.at(this.damage_coeff, "clone") * GLOB.config.damage_multiplier, updating_health, forced));
	}
	return f.dot;
}, true);
