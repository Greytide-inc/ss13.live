// Based on /tg/station's code/modules/mob/living/carbon/human/life.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// life.dm:32
rt.def("/mob/living/carbon/human/proc/Life", function* Life(f: Frame) {
	let HM: Value = null;
	if (this.notransform) {
		return f.dot;
	}
	if (yield* parent_proc()) {
		for (HM of each(this.dna.mutations, T("/datum/mutation/human"))) {
			yield* HM.on_life(this);
		}
	}
	if (this.stat != 2) {
		yield* this.handle_heart();
	}
	if (this.stat != 2) {
		yield* this.handle_embedded_objects();
	}
	this.name = this.get_visible_name();
	yield* this.dna.species.spec_life(this);
	if (this.stat == 2) return f.dot;
	return 1;
}, true, { waitfor: false });

// life.dm:54
rt.def("/mob/living/carbon/human/proc/calculate_affecting_pressure", function calculate_affecting_pressure(f: Frame, pressure: Value) {
	if (this.wear_suit && rt.bitAnd(this.wear_suit.flags, STOPSPRESSUREDMAGE) && this.head && rt.bitAnd(this.head.flags, STOPSPRESSUREDMAGE)) {
		return ONE_ATMOSPHERE;
	} else {
		return pressure;
	}
});

// life.dm:62
rt.def("/mob/living/carbon/human/proc/handle_disabilities", function* handle_disabilities(f: Frame) {
	if (this.eye_blind) {
		if (this.tinttotal >= TINT_BLIND) {
			yield* this.adjust_blindness(-3);
		} else {
			yield* this.adjust_blindness(-1);
		}
	} else if (this.eye_blurry) {
		yield* this.adjust_blurriness(-1);
	}
	if (!(this.getBrainLoss() >= 60 && this.stat != 2)) return f.dot;
	if (!prob(3)) return f.dot;
	if (prob(25)) {
		yield* this.emote("drool");
	} else {
		yield* this.say(strings_replacement("brain_damage_lines.json", "brain_damage"));
	}
	return f.dot;
}, true);

// life.dm:78
rt.def("/mob/living/carbon/human/proc/handle_mutations_and_radiation", function* handle_mutations_and_radiation(f: Frame) {
	if (!(!this.dna || !(yield* this.dna.species.handle_mutations_and_radiation(this)))) return f.dot;
	yield* parent_proc();
	return f.dot;
}, true);

// life.dm:82
rt.def("/mob/living/carbon/human/proc/breathe", function* breathe(f: Frame) {
	if (yield* this.dna.species.breathe(this)) return f.dot;
	yield* parent_proc();
	return f.dot;
}, true);

// life.dm:88
rt.def("/mob/living/carbon/human/proc/check_breath", function* check_breath(f: Frame, breath: Value) {
	let L: Value = null, S: Value = null, lun: Value = null;
	if (!(L = this.getorganslot("lungs"))) {
		if (this.health >= 0) {
			yield* this.adjustOxyLoss(4);
		} else if (!rt.isIn(f, NOCRITDAMAGE, this.dna.species.species_traits)) {
			yield* this.adjustOxyLoss(GLOB.SSmobs.wait / 30);
		}
		this.failed_last_breath = 1;
		if (this.dna && this.dna.species) {
			if ((S = this.dna.species).breathid == "o2") {
				yield* this.throw_alert("oxy", T("/obj/screen/alert/oxy"));
			} else if (S.breathid == "tox") {
				yield* this.throw_alert("not_enough_tox", T("/obj/screen/alert/not_enough_tox"));
			} else if (S.breathid == "co2") {
				yield* this.throw_alert("not_enough_co2", T("/obj/screen/alert/not_enough_co2"));
			}
		}
		return 0;
	} else {
		if (!rt.istype(L, T("/obj/item/organ/lungs"))) return f.dot;
		yield* (lun = L).check_breath(breath, this);
	}
	return f.dot;
}, true);

// life.dm:118
rt.def("/mob/living/carbon/human/proc/handle_environment", function* handle_environment(f: Frame, environment: Value) {
	yield* this.dna.species.handle_environment(environment, this);
	return f.dot;
}, true);

// life.dm:122
rt.def("/mob/living/carbon/human/proc/handle_fire", function* handle_fire(f: Frame) {
	yield* parent_proc();
	if (!this.dna) return f.dot;
	yield* this.dna.species.handle_fire(this);
	return f.dot;
}, true);

// life.dm:129
rt.def("/mob/living/carbon/human/proc/get_thermal_protection", function get_thermal_protection(f: Frame) {
	let thermal_protection: Value = 0;
	if (this.wear_suit) {
		if (this.wear_suit.max_heat_protection_temperature >= FIRE_SUIT_MAX_TEMP_PROTECT) {
			thermal_protection += this.wear_suit.max_heat_protection_temperature * 0.7;
		}
	}
	if (this.head) {
		if (this.head.max_heat_protection_temperature >= 30000) {
			thermal_protection += this.head.max_heat_protection_temperature * 0.3;
		}
	}
	return (thermal_protection = round(thermal_protection));
});

// life.dm:140
rt.def("/mob/living/carbon/human/proc/IgniteMob", function* IgniteMob(f: Frame) {
	if (!this.dna || this.dna.species.CanIgniteMob(this)) {
		return (yield* parent_proc());
	}
	f.dot = 0;
	return f.dot;
}, true);

// life.dm:145
rt.def("/mob/living/carbon/human/proc/ExtinguishMob", function* ExtinguishMob(f: Frame) {
	if (!(!this.dna || !(yield* this.dna.species.ExtinguishMob(this)))) return f.dot;
	yield* parent_proc();
	return f.dot;
}, true);

// life.dm:155
rt.def("/mob/living/carbon/human/proc/get_heat_protection_flags", function get_heat_protection_flags(f: Frame, temperature: Value) {
	let thermal_protection_flags: Value = 0;
	if (this.head) {
		if (this.head.max_heat_protection_temperature && this.head.max_heat_protection_temperature >= temperature) {
			(thermal_protection_flags = rt.modify(thermal_protection_flags, this.head.heat_protection, rt.bitOr));
		}
	}
	if (this.wear_suit) {
		if (this.wear_suit.max_heat_protection_temperature && this.wear_suit.max_heat_protection_temperature >= temperature) {
			(thermal_protection_flags = rt.modify(thermal_protection_flags, this.wear_suit.heat_protection, rt.bitOr));
		}
	}
	if (this.w_uniform) {
		if (this.w_uniform.max_heat_protection_temperature && this.w_uniform.max_heat_protection_temperature >= temperature) {
			(thermal_protection_flags = rt.modify(thermal_protection_flags, this.w_uniform.heat_protection, rt.bitOr));
		}
	}
	if (this.shoes) {
		if (this.shoes.max_heat_protection_temperature && this.shoes.max_heat_protection_temperature >= temperature) {
			(thermal_protection_flags = rt.modify(thermal_protection_flags, this.shoes.heat_protection, rt.bitOr));
		}
	}
	if (this.gloves) {
		if (this.gloves.max_heat_protection_temperature && this.gloves.max_heat_protection_temperature >= temperature) {
			(thermal_protection_flags = rt.modify(thermal_protection_flags, this.gloves.heat_protection, rt.bitOr));
		}
	}
	if (this.wear_mask) {
		if (this.wear_mask.max_heat_protection_temperature && this.wear_mask.max_heat_protection_temperature >= temperature) {
			(thermal_protection_flags = rt.modify(thermal_protection_flags, this.wear_mask.heat_protection, rt.bitOr));
		}
	}
	return thermal_protection_flags;
});

// life.dm:176
rt.def("/mob/living/carbon/human/proc/get_heat_protection", function get_heat_protection(f: Frame, temperature: Value) {
	let thermal_protection_flags: Value = this.get_heat_protection_flags(temperature);
	let thermal_protection: Value = 0;
	if (thermal_protection_flags) {
		if (rt.bitAnd(thermal_protection_flags, HEAD)) {
			thermal_protection += THERMAL_PROTECTION_HEAD;
		}
		if (rt.bitAnd(thermal_protection_flags, CHEST)) {
			thermal_protection += THERMAL_PROTECTION_CHEST;
		}
		if (rt.bitAnd(thermal_protection_flags, GROIN)) {
			thermal_protection += THERMAL_PROTECTION_GROIN;
		}
		if (rt.bitAnd(thermal_protection_flags, LEG_LEFT)) {
			thermal_protection += THERMAL_PROTECTION_LEG_LEFT;
		}
		if (rt.bitAnd(thermal_protection_flags, LEG_RIGHT)) {
			thermal_protection += THERMAL_PROTECTION_LEG_RIGHT;
		}
		if (rt.bitAnd(thermal_protection_flags, FOOT_LEFT)) {
			thermal_protection += THERMAL_PROTECTION_FOOT_LEFT;
		}
		if (rt.bitAnd(thermal_protection_flags, FOOT_RIGHT)) {
			thermal_protection += THERMAL_PROTECTION_FOOT_RIGHT;
		}
		if (rt.bitAnd(thermal_protection_flags, ARM_LEFT)) {
			thermal_protection += THERMAL_PROTECTION_ARM_LEFT;
		}
		if (rt.bitAnd(thermal_protection_flags, ARM_RIGHT)) {
			thermal_protection += THERMAL_PROTECTION_ARM_RIGHT;
		}
		if (rt.bitAnd(thermal_protection_flags, HAND_LEFT)) {
			thermal_protection += THERMAL_PROTECTION_HAND_LEFT;
		}
		if (rt.bitAnd(thermal_protection_flags, HAND_RIGHT)) {
			thermal_protection += THERMAL_PROTECTION_HAND_RIGHT;
		}
	}
	return min(1, thermal_protection);
});

// life.dm:212
rt.def("/mob/living/carbon/human/proc/get_cold_protection_flags", function get_cold_protection_flags(f: Frame, temperature: Value) {
	let thermal_protection_flags: Value = 0;
	if (this.head) {
		if (this.head.min_cold_protection_temperature && this.head.min_cold_protection_temperature <= temperature) {
			(thermal_protection_flags = rt.modify(thermal_protection_flags, this.head.cold_protection, rt.bitOr));
		}
	}
	if (this.wear_suit) {
		if (this.wear_suit.min_cold_protection_temperature && this.wear_suit.min_cold_protection_temperature <= temperature) {
			(thermal_protection_flags = rt.modify(thermal_protection_flags, this.wear_suit.cold_protection, rt.bitOr));
		}
	}
	if (this.w_uniform) {
		if (this.w_uniform.min_cold_protection_temperature && this.w_uniform.min_cold_protection_temperature <= temperature) {
			(thermal_protection_flags = rt.modify(thermal_protection_flags, this.w_uniform.cold_protection, rt.bitOr));
		}
	}
	if (this.shoes) {
		if (this.shoes.min_cold_protection_temperature && this.shoes.min_cold_protection_temperature <= temperature) {
			(thermal_protection_flags = rt.modify(thermal_protection_flags, this.shoes.cold_protection, rt.bitOr));
		}
	}
	if (this.gloves) {
		if (this.gloves.min_cold_protection_temperature && this.gloves.min_cold_protection_temperature <= temperature) {
			(thermal_protection_flags = rt.modify(thermal_protection_flags, this.gloves.cold_protection, rt.bitOr));
		}
	}
	if (this.wear_mask) {
		if (this.wear_mask.min_cold_protection_temperature && this.wear_mask.min_cold_protection_temperature <= temperature) {
			(thermal_protection_flags = rt.modify(thermal_protection_flags, this.wear_mask.cold_protection, rt.bitOr));
		}
	}
	return thermal_protection_flags;
});

// life.dm:234
rt.def("/mob/living/carbon/human/proc/get_cold_protection", function get_cold_protection(f: Frame, temperature: Value) {
	if (this.dna.check_mutation("Cold Resistance")) {
		return 1;
	}
	if (this.dna && rt.isIn(f, RESISTCOLD, this.dna.species.species_traits)) {
		return 1;
	}
	temperature = max(temperature, 2.7);
	let thermal_protection_flags: Value = this.get_cold_protection_flags(temperature);
	let thermal_protection: Value = 0;
	if (thermal_protection_flags) {
		if (rt.bitAnd(thermal_protection_flags, HEAD)) {
			thermal_protection += THERMAL_PROTECTION_HEAD;
		}
		if (rt.bitAnd(thermal_protection_flags, CHEST)) {
			thermal_protection += THERMAL_PROTECTION_CHEST;
		}
		if (rt.bitAnd(thermal_protection_flags, GROIN)) {
			thermal_protection += THERMAL_PROTECTION_GROIN;
		}
		if (rt.bitAnd(thermal_protection_flags, LEG_LEFT)) {
			thermal_protection += THERMAL_PROTECTION_LEG_LEFT;
		}
		if (rt.bitAnd(thermal_protection_flags, LEG_RIGHT)) {
			thermal_protection += THERMAL_PROTECTION_LEG_RIGHT;
		}
		if (rt.bitAnd(thermal_protection_flags, FOOT_LEFT)) {
			thermal_protection += THERMAL_PROTECTION_FOOT_LEFT;
		}
		if (rt.bitAnd(thermal_protection_flags, FOOT_RIGHT)) {
			thermal_protection += THERMAL_PROTECTION_FOOT_RIGHT;
		}
		if (rt.bitAnd(thermal_protection_flags, ARM_LEFT)) {
			thermal_protection += THERMAL_PROTECTION_ARM_LEFT;
		}
		if (rt.bitAnd(thermal_protection_flags, ARM_RIGHT)) {
			thermal_protection += THERMAL_PROTECTION_ARM_RIGHT;
		}
		if (rt.bitAnd(thermal_protection_flags, HAND_LEFT)) {
			thermal_protection += THERMAL_PROTECTION_HAND_LEFT;
		}
		if (rt.bitAnd(thermal_protection_flags, HAND_RIGHT)) {
			thermal_protection += THERMAL_PROTECTION_HAND_RIGHT;
		}
	}
	return min(1, thermal_protection);
});

// life.dm:273
rt.def("/mob/living/carbon/human/proc/handle_chemicals_in_body", function* handle_chemicals_in_body(f: Frame) {
	if (this.reagents) {
		yield* this.reagents.metabolize(this, { can_overdose: 1 });
	}
	yield* this.dna.species.handle_chemicals_in_body(this);
	return f.dot;
}, true);

// life.dm:279
rt.def("/mob/living/carbon/human/proc/handle_random_events", function* handle_random_events(f: Frame) {
	if (this.stat) return f.dot;
	if (!(this.getToxLoss() >= 45 && this.nutrition > 20)) return f.dot;
	if (!((this.lastpuke += prob(50)) >= 50)) return f.dot;
	yield* this.vomit(20, { toxic: 1 });
	this.lastpuke = 0;
	return f.dot;
}, true);

// life.dm:289
rt.def("/mob/living/carbon/human/proc/has_smoke_protection", function has_smoke_protection(f: Frame) {
	if (this.wear_mask) {
		if (rt.bitAnd(this.wear_mask.flags, 4096)) {
			f.dot = 1;
		}
	}
	if (this.glasses) {
		if (rt.bitAnd(this.glasses.flags, 4096)) {
			f.dot = 1;
		}
	}
	if (this.head) {
		if (rt.bitAnd(this.head.flags, 4096)) {
			f.dot = 1;
		}
	}
	if (rt.isIn(f, 10, this.dna.species.species_traits)) {
		f.dot = 1;
	}
	return f.dot;
});

// life.dm:303
rt.def("/mob/living/carbon/human/proc/handle_embedded_objects", function* handle_embedded_objects(f: Frame) {
	let X: Value = null, BP: Value = null, I: Value = null;
	for (X of each(this.bodyparts)) {
		BP = X;
		I = null;
		for (I of each(BP.embedded_objects, T("/obj/item"))) {
			if (prob(I.embedded_pain_chance)) {
				yield* BP.receive_damage(I.w_class * I.embedded_pain_multiplier);
				to_chat(this, `<span class='userdanger'>${I} embedded in your ${BP.name} hurts!</span>`);
			}
			if (prob(I.embedded_fall_chance)) {
				yield* BP.receive_damage(I.w_class * I.embedded_fall_pain_multiplier);
				BP.embedded_objects -= I;
				I.loc = rt.getStep(f, this, 0);
				this.visible_message(`<span class='danger'>${I} falls out of ${this.name}'s ${BP.name}!</span>`, `<span class='userdanger'>${I} falls out of your ${BP.name}!</span>`);
				if (!this.has_embedded_objects()) {
					yield* this.clear_alert("embeddedobject");
				}
			}
		}
	}
	return f.dot;
}, true);

// life.dm:319
rt.def("/mob/living/carbon/human/proc/can_heartattack", function can_heartattack(f: Frame) {
	if (!this.dna || !this.dna.species) {
		return f.dot;
	}
	if (rt.isIn(f, NOBLOOD, this.dna.species.species_traits)) {
		return 0;
	}
	return 1;
});

// life.dm:325
rt.def("/mob/living/carbon/human/proc/undergoing_cardiac_arrest", function undergoing_cardiac_arrest(f: Frame) {
	let heart: Value = null;
	if (!this.can_heartattack()) {
		return 0;
	}
	if (rt.istype((heart = this.getorganslot("heart")), T("/obj/item/organ/heart")) && heart.beating) {
		return 0;
	}
	return 1;
});

// life.dm:333
rt.def("/mob/living/carbon/human/proc/set_heartattack", function set_heartattack(f: Frame, status: Value) {
	let heart: Value = null;
	if (!this.can_heartattack()) {
		return 0;
	}
	if (!rt.istype((heart = this.getorganslot("heart")), T("/obj/item/organ/heart"))) {
		return f.dot;
	}
	heart.beating = (!status ? 1 : 0);
	return f.dot;
});

// life.dm:344
rt.def("/mob/living/carbon/human/proc/handle_heart", function* handle_heart(f: Frame) {
	if (!this.can_heartattack()) {
		return f.dot;
	}
	let we_breath: Value = (!rt.isIn(f, NOBREATH, this.dna.species.species_traits) ? 1 : 0);
	if (!this.undergoing_cardiac_arrest()) {
		return f.dot;
	}
	if (this.reagents.get_reagent_amount("corazone")) {
		return f.dot;
	}
	if (we_breath) {
		yield* this.adjustOxyLoss(8);
		yield* this.Unconscious(80);
	}
	yield* this.adjustBruteLoss(2);
	return f.dot;
}, true);

// life.dm:383
rt.def("/mob/living/carbon/human/proc/handle_status_effects", function* handle_status_effects(f: Frame) {
	yield* parent_proc();
	if (!this.drunkenness) return f.dot;
	this.drunkenness = max(this.drunkenness - this.drunkenness * 0.04, 0);
	if (this.drunkenness >= 6) {
		if (prob(25)) {
			this.slurring += 2;
		}
		this.jitteriness = max(this.jitteriness - 3, 0);
	}
	if (this.drunkenness >= 11 && this.slurring < 5) {
		this.slurring += 1.2;
	}
	if (this.drunkenness >= 41) {
		if (prob(25)) {
			this.confused += 2;
		}
		this.Dizzy(10);
	}
	if (this.drunkenness >= 51) {
		if (prob(5)) {
			this.confused += 10;
			yield* this.vomit();
		}
		this.Dizzy(25);
	}
	if (this.drunkenness >= 61) {
		if (prob(50)) {
			yield* this.blur_eyes(5);
		}
	}
	if (this.drunkenness >= 71) {
		yield* this.blur_eyes(5);
	}
	if (this.drunkenness >= 81) {
		yield* this.adjustToxLoss(0.2);
		if (prob(5) && !this.stat) {
			to_chat(this, "<span class='warning'>Maybe you should lie down for a bit...</span>");
		}
	}
	if (this.drunkenness >= 91) {
		yield* this.adjustBrainLoss(0.4);
		if (prob(20) && !this.stat) {
			if (GLOB.SSshuttle.emergency.mode == "docked" && this.z == ZLEVEL_STATION) {
				to_chat(this, "<span class='warning'>You're so tired... but you can't miss that shuttle...</span>");
			} else {
				to_chat(this, "<span class='warning'>Just a quick nap...</span>");
				yield* this.Sleeping(900);
			}
		}
	}
	if (!(this.drunkenness >= 101)) return f.dot;
	yield* this.adjustToxLoss(4);
	return f.dot;
}, true);
