// Based on /tg/station's code/modules/mob/living/damage_procs.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// damage_procs.dm:12
rt.def("/mob/living/proc/apply_damage", function* apply_damage(f: Frame, damage: Value, damagetype: Value, def_zone: Value, blocked: Value) {
	damage ??= 0;
	damagetype ??= "brute";
	blocked ??= 0;
	let hit_percent: Value = (100 - blocked) / 100;
	if (!damage || hit_percent <= 0) {
		return 0;
	}
	if (damagetype === "brute") {
		yield* this.adjustBruteLoss(damage * hit_percent);
	} else if (damagetype === "fire") {
		yield* this.adjustFireLoss(damage * hit_percent);
	} else if (damagetype === "tox") {
		yield* this.adjustToxLoss(damage * hit_percent);
	} else if (damagetype === "oxy") {
		yield* this.adjustOxyLoss(damage * hit_percent);
	} else if (damagetype === "clone") {
		yield* this.adjustCloneLoss(damage * hit_percent);
	} else if (damagetype === "stamina") {
		yield* this.adjustStaminaLoss(damage * hit_percent);
	}
	return 1;
}, true);

// damage_procs.dm:31
rt.def("/mob/living/proc/apply_damage_type", function* apply_damage_type(f: Frame, damage: Value, damagetype: Value) {
	damage ??= 0;
	damagetype ??= "brute";
	if (damagetype === "brute") {
		return (yield* this.adjustBruteLoss(damage));
	} else if (damagetype === "fire") {
		return (yield* this.adjustFireLoss(damage));
	} else if (damagetype === "tox") {
		return (yield* this.adjustToxLoss(damage));
	} else if (damagetype === "oxy") {
		return (yield* this.adjustOxyLoss(damage));
	} else if (damagetype === "clone") {
		return (yield* this.adjustCloneLoss(damage));
	} else if (damagetype === "stamina") {
		return (yield* this.adjustStaminaLoss(damage));
	}
	return f.dot;
}, true);

// damage_procs.dm:46
rt.def("/mob/living/proc/get_damage_amount", function get_damage_amount(f: Frame, damagetype: Value) {
	damagetype ??= "brute";
	if (damagetype === "brute") {
		return this.getBruteLoss();
	} else if (damagetype === "fire") {
		return this.getFireLoss();
	} else if (damagetype === "tox") {
		return this.getToxLoss();
	} else if (damagetype === "oxy") {
		return this.getOxyLoss();
	} else if (damagetype === "clone") {
		return this.getCloneLoss();
	} else if (damagetype === "stamina") {
		return this.getStaminaLoss();
	}
	return f.dot;
});

// damage_procs.dm:81
rt.def("/mob/living/proc/apply_effect", function* apply_effect(f: Frame, effect: Value, effecttype: Value, blocked: Value) {
	effect ??= 0;
	effecttype ??= "stun";
	blocked ??= 0;
	let hit_percent: Value = (100 - blocked) / 100;
	if (!effect || hit_percent <= 0) {
		return 0;
	}
	if (effecttype === "stun") {
		yield* this.Stun(effect * hit_percent);
	} else if (effecttype === "knockdown") {
		yield* this.Knockdown(effect * hit_percent);
	} else if (effecttype === 1) {
		yield* this.Unconscious(effect * hit_percent);
	} else if (effecttype === "irradiate") {
		this.radiation += max(effect * hit_percent, 0);
	} else if (effecttype === "slur") {
		this.slurring = max(this.slurring, effect * hit_percent);
	} else if (effecttype === "stutter") {
		if (rt.bitAnd(this.status_flags, 1)) {
			this.stuttering = max(this.stuttering, effect * hit_percent);
		}
	} else if (effecttype === "eye_blur") {
		yield* this.blur_eyes(effect * hit_percent);
	} else if (effecttype === "drowsy") {
		this.drowsyness = max(this.drowsyness, effect * hit_percent);
	} else if (effecttype === "jitter") {
		if (rt.bitAnd(this.status_flags, 1)) {
			this.jitteriness = max(this.jitteriness, effect * hit_percent);
		}
	}
	return 1;
}, true);

// damage_procs.dm:109
rt.def("/mob/living/proc/apply_effects", function* apply_effects(f: Frame, stun: Value, knockdown: Value, unconscious: Value, irradiate: Value, slur: Value, stutter: Value, eyeblur: Value, drowsy: Value, blocked: Value, stamina: Value, jitter: Value) {
	stun ??= 0;
	knockdown ??= 0;
	unconscious ??= 0;
	irradiate ??= 0;
	slur ??= 0;
	stutter ??= 0;
	eyeblur ??= 0;
	drowsy ??= 0;
	blocked ??= 0;
	stamina ??= 0;
	jitter ??= 0;
	if (blocked >= 100) {
		return 0;
	}
	if (stun) {
		yield* this.apply_effect(stun, "stun", blocked);
	}
	if (knockdown) {
		yield* this.apply_effect(knockdown, "knockdown", blocked);
	}
	if (unconscious) {
		yield* this.apply_effect(unconscious, 1, blocked);
	}
	if (irradiate) {
		yield* this.apply_effect(irradiate, "irradiate", blocked);
	}
	if (slur) {
		yield* this.apply_effect(slur, "slur", blocked);
	}
	if (stutter) {
		yield* this.apply_effect(stutter, "stutter", blocked);
	}
	if (eyeblur) {
		yield* this.apply_effect(eyeblur, "eye_blur", blocked);
	}
	if (drowsy) {
		yield* this.apply_effect(drowsy, "drowsy", blocked);
	}
	if (stamina) {
		yield* this.apply_damage(stamina, "stamina", null, blocked);
	}
	if (jitter) {
		yield* this.apply_effect(jitter, "jitter", blocked);
	}
	return 1;
}, true);

// damage_procs.dm:138
rt.def("/mob/living/proc/adjustBruteLoss", function* adjustBruteLoss(f: Frame, amount: Value, updating_health: Value, forced: Value) {
	updating_health ??= 1;
	forced ??= 0;
	if (!forced && rt.bitAnd(this.status_flags, 4096)) {
		return 0;
	}
	this.bruteloss = max(0, min(this.bruteloss + amount * GLOB.config.damage_multiplier, this.maxHealth * 2));
	if (updating_health) {
		yield* this.updatehealth();
	}
	return amount;
}, true);

// damage_procs.dm:149
rt.def("/mob/living/proc/adjustOxyLoss", function* adjustOxyLoss(f: Frame, amount: Value, updating_health: Value, forced: Value) {
	updating_health ??= 1;
	forced ??= 0;
	if (!forced && rt.bitAnd(this.status_flags, 4096)) {
		return 0;
	}
	this.oxyloss = max(0, min(this.oxyloss + amount * GLOB.config.damage_multiplier, this.maxHealth * 2));
	if (updating_health) {
		yield* this.updatehealth();
	}
	return amount;
}, true);

// damage_procs.dm:157
rt.def("/mob/living/proc/setOxyLoss", function* setOxyLoss(f: Frame, amount: Value, updating_health: Value, forced: Value) {
	updating_health ??= 1;
	forced ??= 0;
	if (rt.bitAnd(this.status_flags, 4096)) {
		return 0;
	}
	this.oxyloss = amount;
	if (updating_health) {
		yield* this.updatehealth();
	}
	return amount;
}, true);

// damage_procs.dm:168
rt.def("/mob/living/proc/adjustToxLoss", function* adjustToxLoss(f: Frame, amount: Value, updating_health: Value, forced: Value) {
	updating_health ??= 1;
	forced ??= 0;
	if (!forced && rt.bitAnd(this.status_flags, 4096)) {
		return 0;
	}
	this.toxloss = max(0, min(this.toxloss + amount * GLOB.config.damage_multiplier, this.maxHealth * 2));
	if (updating_health) {
		yield* this.updatehealth();
	}
	return amount;
}, true);

// damage_procs.dm:176
rt.def("/mob/living/proc/setToxLoss", function* setToxLoss(f: Frame, amount: Value, updating_health: Value, forced: Value) {
	updating_health ??= 1;
	forced ??= 0;
	if (!forced && rt.bitAnd(this.status_flags, 4096)) {
		return 0;
	}
	this.toxloss = amount;
	if (updating_health) {
		yield* this.updatehealth();
	}
	return amount;
}, true);

// damage_procs.dm:187
rt.def("/mob/living/proc/adjustFireLoss", function* adjustFireLoss(f: Frame, amount: Value, updating_health: Value, forced: Value) {
	updating_health ??= 1;
	forced ??= 0;
	if (!forced && rt.bitAnd(this.status_flags, 4096)) {
		return 0;
	}
	this.fireloss = max(0, min(this.fireloss + amount * GLOB.config.damage_multiplier, this.maxHealth * 2));
	if (updating_health) {
		yield* this.updatehealth();
	}
	return amount;
}, true);

// damage_procs.dm:198
rt.def("/mob/living/proc/adjustCloneLoss", function* adjustCloneLoss(f: Frame, amount: Value, updating_health: Value, forced: Value) {
	updating_health ??= 1;
	forced ??= 0;
	if (!forced && rt.bitAnd(this.status_flags, 4096)) {
		return 0;
	}
	this.cloneloss = max(0, min(this.cloneloss + amount * GLOB.config.damage_multiplier, this.maxHealth * 2));
	if (updating_health) {
		yield* this.updatehealth();
	}
	return amount;
}, true);

// damage_procs.dm:206
rt.def("/mob/living/proc/setCloneLoss", function* setCloneLoss(f: Frame, amount: Value, updating_health: Value, forced: Value) {
	updating_health ??= 1;
	forced ??= 0;
	if (!forced && rt.bitAnd(this.status_flags, 4096)) {
		return 0;
	}
	this.cloneloss = amount;
	if (updating_health) {
		yield* this.updatehealth();
	}
	return amount;
}, true);

// damage_procs.dm:217
rt.def("/mob/living/proc/adjustBrainLoss", function adjustBrainLoss(f: Frame, amount: Value) {
	if (rt.bitAnd(this.status_flags, 4096)) {
		return 0;
	}
	this.brainloss = max(0, min(this.brainloss + amount * GLOB.config.damage_multiplier, this.maxHealth * 2));
	return f.dot;
});

// damage_procs.dm:222
rt.def("/mob/living/proc/setBrainLoss", function setBrainLoss(f: Frame, amount: Value) {
	if (rt.bitAnd(this.status_flags, 4096)) {
		return 0;
	}
	this.brainloss = amount;
	return f.dot;
});

// damage_procs.dm:238
rt.def("/mob/living/proc/heal_bodypart_damage", function* heal_bodypart_damage(f: Frame, brute: Value, burn: Value, updating_health: Value) {
	updating_health ??= 1;
	yield* this.adjustBruteLoss(-brute, 0);
	yield* this.adjustFireLoss(-burn, 0);
	if (!updating_health) return f.dot;
	yield* this.updatehealth();
	return f.dot;
}, true);

// damage_procs.dm:245
rt.def("/mob/living/proc/take_bodypart_damage", function* take_bodypart_damage(f: Frame, brute: Value, burn: Value, updating_health: Value) {
	updating_health ??= 1;
	yield* this.adjustBruteLoss(brute, 0);
	yield* this.adjustFireLoss(burn, 0);
	if (!updating_health) return f.dot;
	yield* this.updatehealth();
	return f.dot;
}, true);

// damage_procs.dm:252
rt.def("/mob/living/proc/heal_overall_damage", function* heal_overall_damage(f: Frame, brute: Value, burn: Value, only_robotic: Value, only_organic: Value, updating_health: Value) {
	only_robotic ??= 0;
	only_organic ??= 1;
	updating_health ??= 1;
	yield* this.adjustBruteLoss(-brute, 0);
	yield* this.adjustFireLoss(-burn, 0);
	if (!updating_health) return f.dot;
	yield* this.updatehealth();
	return f.dot;
}, true);

// damage_procs.dm:259
rt.def("/mob/living/proc/take_overall_damage", function* take_overall_damage(f: Frame, brute: Value, burn: Value, updating_health: Value) {
	updating_health ??= 1;
	yield* this.adjustBruteLoss(brute, 0);
	yield* this.adjustFireLoss(burn, 0);
	if (!updating_health) return f.dot;
	yield* this.updatehealth();
	return f.dot;
}, true);

// damage_procs.dm:266
rt.def("/mob/living/proc/heal_ordered_damage", function* heal_ordered_damage(f: Frame, amount: Value, damage_types: Value) {
	let i: Value = null, amount_to_heal: Value = null;
	f.dot = amount;
	for (i of each(damage_types)) {
		if (amount_to_heal = min(amount, this.get_damage_amount(i))) {
			yield* this.apply_damage_type(-amount_to_heal, i);
			amount -= amount_to_heal;
		}
		if (!amount) {
			break;
		}
	}
	f.dot -= amount;
	return f.dot;
}, true);
