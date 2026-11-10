// Based on /tg/station's code/modules/mob/living/carbon/damage_procs.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// damage_procs.dm:4
rt.def("/mob/living/carbon/proc/apply_damage", function* apply_damage(f: Frame, damage: Value, damagetype: Value, def_zone: Value, blocked: Value) {
	let BP: Value = null;
	damagetype ??= "brute";
	blocked ??= 0;
	let hit_percent: Value = (100 - blocked) / 100;
	if (!damage || hit_percent <= 0) {
		return 0;
	}
	if (rt.istype(def_zone, T("/obj/item/bodypart"))) {
		BP = def_zone;
	} else {
		if (!def_zone) {
			def_zone = ran_zone(def_zone);
		}
		if (!(BP = this.get_bodypart(check_zone(def_zone)))) {
			BP = rt.index(this.bodyparts, 1);
		}
	}
	if (damagetype === "brute") {
		if (BP) {
			if (yield* BP.receive_damage(damage * hit_percent, 0)) {
				this.update_damage_overlays();
			}
		} else {
			yield* this.adjustBruteLoss(damage * hit_percent);
		}
	} else if (damagetype === "fire") {
		if (BP) {
			if (yield* BP.receive_damage(0, damage * hit_percent)) {
				this.update_damage_overlays();
			}
		} else {
			yield* this.adjustFireLoss(damage * hit_percent);
		}
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

// damage_procs.dm:45
rt.def("/mob/living/carbon/proc/getBruteLoss", function getBruteLoss(f: Frame) {
	let X: Value = null, BP: Value = null;
	let amount: Value = 0;
	for (X of each(this.bodyparts)) {
		amount += (BP = X).brute_dam;
	}
	return amount;
});

// damage_procs.dm:52
rt.def("/mob/living/carbon/proc/getFireLoss", function getFireLoss(f: Frame) {
	let X: Value = null, BP: Value = null;
	let amount: Value = 0;
	for (X of each(this.bodyparts)) {
		amount += (BP = X).burn_dam;
	}
	return amount;
});

// damage_procs.dm:59
rt.def("/mob/living/carbon/proc/adjustBruteLoss", function* adjustBruteLoss(f: Frame, amount: Value, updating_health: Value, forced: Value) {
	updating_health ??= 1;
	forced ??= 0;
	if (!forced && rt.bitAnd(this.status_flags, 4096)) {
		return 0;
	}
	if (amount > 0) {
		yield* this.take_overall_damage(amount, 0, updating_health);
	} else {
		yield* this.heal_overall_damage(-amount, 0, 0, 1, updating_health);
	}
	return amount;
}, true);

// damage_procs.dm:68
rt.def("/mob/living/carbon/proc/adjustFireLoss", function* adjustFireLoss(f: Frame, amount: Value, updating_health: Value, forced: Value) {
	updating_health ??= 1;
	forced ??= 0;
	if (!forced && rt.bitAnd(this.status_flags, 4096)) {
		return 0;
	}
	if (amount > 0) {
		yield* this.take_overall_damage(0, amount, updating_health);
	} else {
		yield* this.heal_overall_damage(0, -amount, 0, 1, updating_health);
	}
	return amount;
}, true);

// damage_procs.dm:78
rt.def("/mob/living/carbon/proc/adjustToxLoss", function* adjustToxLoss(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 1;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (rt.isIn(f, (((!f.args[2] ? 1 : 0) && this.has_dna()) && TOXINLOVER), this.dna.species.species_traits)) {
		if ((f.args[0] = -f.args[0]) > 0) {
			this.blood_volume -= 5 * f.args[0];
		} else {
			this.blood_volume -= f.args[0];
		}
	}
	return (yield* parent_proc());
}, true, { args: ["amount", "updating_health", "forced"] });

// damage_procs.dm:90
rt.def("/mob/living/carbon/proc/get_damaged_bodyparts", function get_damaged_bodyparts(f: Frame, brute: Value, burn: Value) {
	let X: Value = null, BP: Value = null;
	let parts: Value = list();
	for (X of each(this.bodyparts)) {
		BP = X;
		if (brute && BP.brute_dam || burn && BP.burn_dam) {
			parts += BP;
		}
	}
	return parts;
});

// damage_procs.dm:99
rt.def("/mob/living/carbon/proc/get_damageable_bodyparts", function get_damageable_bodyparts(f: Frame) {
	let X: Value = null, BP: Value = null;
	let parts: Value = list();
	for (X of each(this.bodyparts)) {
		if ((BP = X).brute_dam + BP.burn_dam < BP.max_damage) {
			parts += BP;
		}
	}
	return parts;
});

// damage_procs.dm:110
rt.def("/mob/living/carbon/proc/heal_bodypart_damage", function* heal_bodypart_damage(f: Frame, brute: Value, burn: Value, only_robotic: Value, only_organic: Value) {
	let parts: Value = null, picked: Value = null;
	only_robotic ??= 0;
	only_organic ??= 1;
	if (!rt.len(f, (parts = this.get_damaged_bodyparts(brute, burn)))) {
		return f.dot;
	}
	if (!(yield* (picked = pick(parts)).heal_damage(brute, burn, only_robotic, only_organic))) return f.dot;
	this.update_damage_overlays();
	return f.dot;
}, true);

// damage_procs.dm:121
rt.def("/mob/living/carbon/proc/take_bodypart_damage", function* take_bodypart_damage(f: Frame, brute: Value, burn: Value) {
	let parts: Value = null, picked: Value = null;
	if (!rt.len(f, (parts = this.get_damageable_bodyparts()))) {
		return f.dot;
	}
	if (!(yield* (picked = pick(parts)).receive_damage(brute, burn))) return f.dot;
	this.update_damage_overlays();
	return f.dot;
}, true);

// damage_procs.dm:131
rt.def("/mob/living/carbon/proc/heal_overall_damage", function* heal_overall_damage(f: Frame, brute: Value, burn: Value, only_robotic: Value, only_organic: Value, updating_health: Value) {
	let picked: Value = null, brute_was: Value = null, burn_was: Value = null;
	only_robotic ??= 0;
	only_organic ??= 1;
	updating_health ??= 1;
	let parts: Value = this.get_damaged_bodyparts(brute, burn);
	let update: Value = 0;
	while (rt.len(f, parts) && (brute > 0 || burn > 0)) {
		picked = pick(parts);
		brute_was = picked.brute_dam;
		burn_was = picked.burn_dam;
		(update = rt.modify(update, (yield* picked.heal_damage(brute, burn, only_robotic, only_organic, 0)), rt.bitOr));
		brute -= brute_was - picked.brute_dam;
		burn -= burn_was - picked.burn_dam;
		parts -= picked;
	}
	if (updating_health) {
		yield* this.updatehealth();
	}
	if (!update) return f.dot;
	this.update_damage_overlays();
	return f.dot;
}, true);

// damage_procs.dm:153
rt.def("/mob/living/carbon/proc/take_overall_damage", function* take_overall_damage(f: Frame, brute: Value, burn: Value, updating_health: Value) {
	let picked: Value = null, brute_per_part: Value = null, burn_per_part: Value = null, brute_was: Value = null, burn_was: Value = null;
	updating_health ??= 1;
	if (rt.bitAnd(this.status_flags, 4096)) {
		return f.dot;
	}
	let parts: Value = this.get_damageable_bodyparts();
	let update: Value = 0;
	while (rt.len(f, parts) && (brute > 0 || burn > 0)) {
		picked = pick(parts);
		brute_per_part = round(brute / rt.len(f, parts), 0.01);
		burn_per_part = round(burn / rt.len(f, parts), 0.01);
		brute_was = picked.brute_dam;
		burn_was = picked.burn_dam;
		(update = rt.modify(update, (yield* picked.receive_damage(brute_per_part, burn_per_part, 0)), rt.bitOr));
		brute -= picked.brute_dam - brute_was;
		burn -= picked.burn_dam - burn_was;
		parts -= picked;
	}
	if (updating_health) {
		yield* this.updatehealth();
	}
	if (!update) return f.dot;
	this.update_damage_overlays();
	return f.dot;
}, true);

// damage_procs.dm:181
rt.def("/mob/living/carbon/proc/adjustStaminaLoss", function* adjustStaminaLoss(f: Frame, amount: Value, updating_stamina: Value) {
	updating_stamina ??= 1;
	if (rt.bitAnd(this.status_flags, 4096)) {
		return 0;
	}
	this.staminaloss = max(0, min(this.staminaloss + amount, this.maxHealth * 2));
	if (!updating_stamina) return f.dot;
	yield* this.update_stamina();
	return f.dot;
}, true);

// damage_procs.dm:189
rt.def("/mob/living/carbon/proc/setStaminaLoss", function* setStaminaLoss(f: Frame, amount: Value, updating_stamina: Value) {
	updating_stamina ??= 1;
	if (rt.bitAnd(this.status_flags, 4096)) {
		return 0;
	}
	this.staminaloss = amount;
	if (!updating_stamina) return f.dot;
	yield* this.update_stamina();
	return f.dot;
}, true);
