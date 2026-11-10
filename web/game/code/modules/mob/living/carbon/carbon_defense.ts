// Based on /tg/station's code/modules/mob/living/carbon/carbon_defense.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


// carbon_defense.dm:3
rt.def("/mob/living/carbon/proc/get_eye_protection", function get_eye_protection(f: Frame) {
	let HFP: Value = null, GFP: Value = null, MFP: Value = null, E: Value = null;
	let number: Value = parent_proc();
	if (rt.istype(this.head, T("/obj/item/clothing/head"))) {
		number += (HFP = this.head).flash_protect;
	}
	if (rt.istype(this.glasses, T("/obj/item/clothing/glasses"))) {
		number += (GFP = this.glasses).flash_protect;
	}
	if (rt.istype(this.wear_mask, T("/obj/item/clothing/mask"))) {
		number += (MFP = this.wear_mask).flash_protect;
	}
	if (!(E = this.getorganslot("eye_sight"))) {
		number = 1e+31;
	} else {
		number += E.flash_protect;
	}
	return number;
});

// carbon_defense.dm:26
rt.def("/mob/living/carbon/proc/get_ear_protection", function get_ear_protection(f: Frame) {
	let E: Value = null;
	let number: Value = parent_proc();
	let $0: any = this.ears;
	if ($0) {
		if (this.ears.secondary_flags) {
			$0 = rt.index(this.ears.secondary_flags, "bang_protect");
		} else {
			$0 = 0;
		}
	}
	if ($0) {
		number += 1;
	}
	$0 = this.head;
	if ($0) {
		if (this.head.secondary_flags) {
			$0 = rt.index(this.head.secondary_flags, "bang_protect");
		} else {
			$0 = 0;
		}
	}
	if ($0) {
		number += 1;
	}
	if (!(E = this.getorganslot("ears"))) {
		number = 1e+31;
	} else {
		number += E.bang_protect;
	}
	return number;
});

// carbon_defense.dm:39
rt.def("/mob/living/carbon/proc/is_mouth_covered", function is_mouth_covered(f: Frame, head_only: Value, mask_only: Value) {
	head_only ??= 0;
	mask_only ??= 0;
	if (!(!mask_only && this.head && rt.bitAnd(this.head.flags_cover, HEADCOVERSMOUTH) || !head_only && this.wear_mask && rt.bitAnd(this.wear_mask.flags_cover, MASKCOVERSMOUTH))) return f.dot;
	return 1;
});

// carbon_defense.dm:43
rt.def("/mob/living/carbon/proc/is_eyes_covered", function is_eyes_covered(f: Frame, check_glasses: Value, check_head: Value, check_mask: Value) {
	check_glasses ??= 1;
	check_head ??= 1;
	check_mask ??= 1;
	if (check_glasses && this.glasses && rt.bitAnd(this.glasses.flags_cover, 1)) {
		return 1;
	}
	if (check_head && this.head && rt.bitAnd(this.head.flags_cover, HEADCOVERSEYES)) {
		return 1;
	}
	if (!(check_mask && this.wear_mask && rt.bitAnd(this.wear_mask.flags_cover, MASKCOVERSMOUTH))) return f.dot;
	return 1;
});

// carbon_defense.dm:51
rt.def("/mob/living/carbon/proc/check_projectile_dismemberment", function* check_projectile_dismemberment(f: Frame, _P: Value, def_zone: Value) {
	let affecting: Value = null;
	if (!((affecting = this.get_bodypart(def_zone)) && affecting.dismemberable && affecting.get_damage() >= affecting.max_damage - _P.dismemberment)) return f.dot;
	yield* affecting.dismember(_P.damtype);
	return f.dot;
}, true);

// carbon_defense.dm:56
rt.def("/mob/living/carbon/proc/hitby", function* hitby(f: Frame) {
	let I: Value = null;
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	if (f.args[3] === null) {
		f.args[3] = 0;
	}
	if (!f.args[1]) {
		if (this.in_throw_mode && !this.get_active_held_item()) {
			if (this.canmove && !this.restrained()) {
				if (rt.istype(f.args[0], T("/obj/item"))) {
					if (isturf((I = f.args[0]).loc)) {
						yield* this.put_in_active_hand(I);
						this.visible_message(`<span class='warning'>${this} catches ${I}!</span>`);
						this.throw_mode_off();
						return 1;
					}
				}
			}
		}
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["AM", "skipcatch", "hitpush", "blocked"] });

// carbon_defense.dm:70
rt.def("/mob/living/carbon/proc/attacked_by", function* attacked_by(f: Frame, I: Value, user: Value) {
	let affecting: Value = null, location: Value = null, probability: Value = null;
	if (!(affecting = this.get_bodypart(ran_zone(user.zone_selected)))) {
		affecting = rt.index(this.bodyparts, 1);
	}
	this.send_item_attack_message(I, user, affecting.name);
	if (!I.force) return f.dot;
	yield* this.apply_damage(I.force, I.damtype, affecting);
	yield* this.damage_clothes(I.force, I.damtype, "melee", affecting.body_zone);
	if (I.damtype == "brute" && affecting.status == BODYPART_ORGANIC) {
		if (prob(33)) {
			yield* I.add_mob_blood(this);
			yield* this.add_splatter_floor((location = rt.getStep(f, this, 0)));
			if (get_dist(user, this) <= 1) {
				yield* user.add_mob_blood(this);
			}
			if (affecting.body_zone == "head") {
				if (this.wear_mask) {
					yield* this.wear_mask.add_mob_blood(this);
					yield* this.update_inv_wear_mask();
				}
				if (this.wear_neck) {
					yield* this.wear_neck.add_mob_blood(this);
					this.update_inv_neck();
				}
				if (this.head) {
					yield* this.head.add_mob_blood(this);
					yield* this.update_inv_head();
				}
			}
		}
	}
	if (prob((probability = I.get_dismemberment_chance(affecting)))) {
		if (yield* affecting.dismember(I.damtype)) {
			yield* I.add_mob_blood(this);
			playsound(rt.getStep(f, this, 0), I.get_dismember_sound(), 80, 1);
		}
	}
	return 1;
}, true);

// carbon_defense.dm:109
rt.def("/mob/living/carbon/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let D: Value = null, S: Value = null;
	for (D of each(this.viruses, T("/datum/disease"))) {
		if (D.IsSpreadByTouch()) {
			yield* user.ContractDisease(D);
		}
	}
	D = null;
	for (D of each(user.viruses, T("/datum/disease"))) {
		if (D.IsSpreadByTouch()) {
			yield* this.ContractDisease(D);
		}
	}
	if (this.lying && rt.len(f, this.surgeries)) {
		if (user.a_intent == "help") {
			for (S of each(this.surgeries, T("/datum/surgery"))) {
				if (yield* S.next_step(user)) {
					return 1;
				}
			}
		}
	}
	return 0;
}, true);

// carbon_defense.dm:126
rt.def("/mob/living/carbon/proc/attack_paw", function* attack_paw(f: Frame, M: Value) {
	let D: Value = null;
	for (D of each(this.viruses, T("/datum/disease"))) {
		if (D.IsSpreadByTouch()) {
			yield* M.ContractDisease(D);
		}
	}
	D = null;
	for (D of each(M.viruses, T("/datum/disease"))) {
		if (D.IsSpreadByTouch()) {
			yield* this.ContractDisease(D);
		}
	}
	if (M.a_intent == "help") {
		yield* this.help_shake_act(M);
		return 0;
	}
	if (!(yield* parent_proc())) return f.dot;
	D = null;
	for (D of each(M.viruses, T("/datum/disease"))) {
		yield* this.ForceContractDisease(D);
	}
	return 1;
}, true);

// carbon_defense.dm:145
rt.def("/mob/living/carbon/proc/attack_slime", function* attack_slime(f: Frame, M: Value) {
	let stunprob: Value = null, power: Value = null;
	if (!(yield* parent_proc())) return f.dot;
	if (M.powerlevel > 0) {
		if (prob((stunprob = M.powerlevel * 7 + 10))) {
			M.powerlevel -= 3;
			if (M.powerlevel < 0) {
				M.powerlevel = 0;
			}
			this.visible_message(`<span class='danger'>The ${M.name} has shocked ${this}!</span>`, `<span class='userdanger'>The ${M.name} has shocked ${this}!</span>`);
			yield* do_sparks(5, 1, this);
			yield* this.Knockdown((power = M.powerlevel + rand(0, 3)) * 20);
			if (this.stuttering < power) {
				this.stuttering = power;
			}
			if (prob(stunprob) && M.powerlevel >= 8) {
				yield* this.adjustFireLoss(M.powerlevel * rand(6, 10));
				yield* this.updatehealth();
			}
		}
	}
	return 1;
}, true);

// carbon_defense.dm:167
rt.def("/mob/living/carbon/proc/dismembering_strike", function* dismembering_strike(f: Frame, attacker: Value, dam_zone: Value) {
	let affecting: Value = null, things_to_ruin: Value = null, B: Value = null, bodypart: Value = null;
	if (!attacker.limb_destroyer) {
		return dam_zone;
	}
	if (dam_zone && attacker.client) {
		affecting = this.get_bodypart(ran_zone(dam_zone));
	} else {
		things_to_ruin = shuffle((yield* this.bodyparts.Copy()));
		for (B of each(things_to_ruin)) {
			if ((bodypart = B).body_zone == "head" || bodypart.body_zone == "chest") {
				continue;
			}
			if (!affecting || affecting.get_damage() / affecting.max_damage < bodypart.get_damage() / bodypart.max_damage) {
				affecting = bodypart;
			}
		}
	}
	if (affecting) {
		dam_zone = affecting.body_zone;
		if (affecting.get_damage() >= affecting.max_damage) {
			yield* affecting.dismember();
			return null;
		}
		return affecting.body_zone;
	}
	return dam_zone;
}, true);

// carbon_defense.dm:190
rt.def("/mob/living/carbon/proc/blob_act", function* blob_act(f: Frame, B: Value) {
	if (this.stat == 2) {
		return f.dot;
	} else {
		this.show_message("<span class='userdanger'>The blob attacks!</span>");
		yield* this.adjustBruteLoss(10);
	}
	return f.dot;
}, true);

// carbon_defense.dm:197
rt.def("/mob/living/carbon/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	let X: Value = null, O: Value = null;
	for (X of each(this.internal_organs)) {
		yield* (O = X).emp_act(severity);
	}
	yield* parent_proc();
	return f.dot;
}, true);

// carbon_defense.dm:203
rt.def("/mob/living/carbon/proc/electrocute_act", function* electrocute_act(f: Frame, shock_damage: Value, source: Value, siemens_coeff: Value, safety: Value, override: Value, tesla_shock: Value, illusion: Value, stun: Value) {
	siemens_coeff ??= 1;
	safety ??= 0;
	override ??= 0;
	tesla_shock ??= 0;
	illusion ??= 0;
	stun ??= 1;
	let $0: any = tesla_shock;
	if ($0) {
		if (this.secondary_flags) {
			$0 = rt.index(this.secondary_flags, "tesla_ignore");
		} else {
			$0 = 0;
		}
	}
	if ($0) {
		return 0;
	}
	shock_damage *= siemens_coeff;
	if (this.dna && this.dna.species) {
		shock_damage *= this.dna.species.siemens_coeff;
	}
	if (shock_damage < 1 && !override) {
		return 0;
	}
	if (this.reagents.has_reagent("teslium")) {
		shock_damage *= 1.5;
	}
	if (illusion) {
		yield* this.adjustStaminaLoss(shock_damage);
	} else {
		yield* this.take_overall_damage(0, shock_damage);
	}
	this.visible_message(fmt("<span class='danger'>＀ was shocked by ％！!</span>", [this, source]), "<span class='userdanger'>You feel a powerful shock coursing through your body!</span>", "<span class='italics'>You hear a heavy electrical crack.</span>");
	this.do_jitter_animation((this.jitteriness += 1000));
	this.stuttering += 2;
	if ((!tesla_shock || tesla_shock && siemens_coeff > 0.5) && stun) {
		yield* this.Stun(40);
	}
	rt.spawnTail(f, 20, "/mob/living/carbon/proc/electrocute_act: spawn at modules/mob/living/carbon/carbon_defense.dm:226", shock_damage, source, siemens_coeff, safety, override, tesla_shock, illusion, stun);
	if (override) {
		return override;
	} else {
		return shock_damage;
	}
}, true);

// a spawn(20) body of /mob/living/carbon/proc/electrocute_act, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/carbon/proc/electrocute_act: spawn at modules/mob/living/carbon/carbon_defense.dm:226", function* (f: Frame, shock_damage: Value, source: Value, siemens_coeff: Value, safety: Value, override: Value, tesla_shock: Value, illusion: Value, stun: Value) {
	this.jitteriness = max(this.jitteriness - 990, 10);
	if ((!tesla_shock || tesla_shock && siemens_coeff > 0.5) && stun) {
		yield* this.Knockdown(60);
	}
	return null;
});

// carbon_defense.dm:237
rt.def("/mob/living/carbon/proc/help_shake_act", function* help_shake_act(f: Frame, M: Value) {
	if (this.on_fire) {
		to_chat(M, "<span class='warning'>You can't put them out with just your bare hands!");
		return f.dot;
	}
	if (!(this.health >= 0 && !rt.bitAnd(this.status_flags, 8192))) return f.dot;
	if (this.lying) {
		M.visible_message(`<span class='notice'>${M} shakes ${this} trying to get ${this.p_them()} up!</span>`, `<span class='notice'>You shake ${this} trying to get ${this.p_them()} up!</span>`);
	} else {
		M.visible_message(`<span class='notice'>${M} hugs ${this} to make ${this.p_them()} feel better!</span>`, `<span class='notice'>You hug ${this} to make ${this.p_them()} feel better!</span>`);
	}
	yield* this.AdjustStun(-60);
	yield* this.AdjustKnockdown(-60);
	yield* this.AdjustUnconscious(-60);
	yield* this.AdjustSleeping(-100);
	if (this.resting) {
		this.resting = 0;
		yield* this.update_canmove();
	}
	playsound(this.loc, rt.rsc("sound/weapons/thudswoosh.ogg"), 50, 1, -1);
	return f.dot;
}, true);

// carbon_defense.dm:260
rt.def("/mob/living/carbon/proc/flash_act", function* flash_act(f: Frame) {
	let eyes: Value = null;
	if (f.args[0] === null) {
		f.args[0] = 1;
	}
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (f.args[3] === null) {
		f.args[3] = 0;
	}
	f.dot = (yield* parent_proc());
	let damage: Value = f.args[0] - this.get_eye_protection();
	if (f.dot) {
		if (!(eyes = this.getorganslot("eyes_sight"))) {
			return f.dot;
		}
		if (f.args[3]) {
			return f.dot;
		}
		if (damage == 1) {
			to_chat(this, "<span class='warning'>Your eyes sting a little.</span>");
			if (prob(40)) {
				yield* this.adjust_eye_damage(1);
			}
		} else if (damage == 2) {
			to_chat(this, "<span class='warning'>Your eyes burn.</span>");
			yield* this.adjust_eye_damage(rand(2, 4));
		} else if (damage > 3) {
			to_chat(this, "<span class='warning'>Your eyes itch and burn severely!</span>");
			yield* this.adjust_eye_damage(rand(12, 16));
		}
		if (eyes.eye_damage > 10) {
			yield* this.blind_eyes(damage);
			yield* this.blur_eyes(damage * rand(3, 6));
			if (eyes.eye_damage > 20) {
				if (prob(eyes.eye_damage - 20)) {
					if (yield* this.become_nearsighted()) {
						to_chat(this, "<span class='warning'>Your eyes start to burn badly!</span>");
					}
				} else if (prob(eyes.eye_damage - 25)) {
					if (yield* this.become_blind()) {
						to_chat(this, "<span class='warning'>You can't see anything!</span>");
					}
				}
			} else {
				to_chat(this, "<span class='warning'>Your eyes are really starting to hurt. This can't be good for you!</span>");
			}
		}
		if (this.has_bane("light")) {
			yield* this.mind.disrupt_spells(-500);
		}
		return 1;
	} else {
		if (damage != 0) return f.dot;
		if (prob(20)) {
			to_chat(this, "<span class='notice'>Something bright flashes in the corner of your vision!</span>");
		}
		if (!this.has_bane("light")) return f.dot;
		yield* this.mind.disrupt_spells(0);
	}
	return f.dot;
}, true, { args: ["intensity", "override_blindness_check", "affect_silicon", "visual"] });

// carbon_defense.dm:307
rt.def("/mob/living/carbon/proc/soundbang_act", function* soundbang_act(f: Frame, intensity: Value, stun_pwr: Value, damage_pwr: Value, deafen_pwr: Value) {
	let effect_amount: Value = null, ear_damage: Value = null, deaf: Value = null;
	intensity ??= 1;
	stun_pwr ??= 20;
	damage_pwr ??= 5;
	deafen_pwr ??= 15;
	let ear_safety: Value = this.get_ear_protection();
	let ears: Value = this.getorganslot("ears");
	if (!((effect_amount = intensity - ear_safety) > 0)) return f.dot;
	if (stun_pwr) {
		yield* this.Knockdown(stun_pwr * effect_amount);
	}
	if (rt.istype(ears, T("/obj/item/organ/ears")) && (deafen_pwr || damage_pwr)) {
		ear_damage = damage_pwr * effect_amount;
		deaf = max(ears.deaf, deafen_pwr * effect_amount);
		this.adjustEarDamage(ear_damage, deaf);
		if (ears.ear_damage >= 15) {
			to_chat(this, "<span class='warning'>Your ears start to ring badly!</span>");
			if (prob(ears.ear_damage - 5)) {
				to_chat(this, "<span class='userdanger'>You can't hear anything!</span>");
				ears.ear_damage = min(ears.ear_damage, UNHEALING_EAR_DAMAGE);
			}
		} else if (ears.ear_damage >= 5) {
			to_chat(this, "<span class='warning'>Your ears start to ring!</span>");
		}
		rt.op(f, "Output", [], [this, sound(rt.rsc("sound/weapons/flash_ring.ogg"), 0, 1, 0, 250)], false);
	}
	return effect_amount;
}, true);

// carbon_defense.dm:332
rt.def("/mob/living/carbon/proc/damage_clothes", function* damage_clothes(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value, def_zone: Value) {
	let hit_clothes: Value = null;
	damage_type ??= "brute";
	damage_flag ??= 0;
	if (damage_type != "brute" && damage_type != "fire") {
		return f.dot;
	}
	damage_amount *= 0.5;
	if (!(!def_zone || def_zone == "head")) return f.dot;
	if (this.wear_mask) {
		hit_clothes = this.wear_mask;
	}
	if (this.wear_neck) {
		hit_clothes = this.wear_neck;
	}
	if (this.head) {
		hit_clothes = this.head;
	}
	if (!hit_clothes) return f.dot;
	yield* hit_clothes.take_damage(damage_amount, damage_type, damage_flag, 0);
	return f.dot;
}, true);

// carbon_defense.dm:348
rt.def("/mob/living/carbon/proc/can_hear", function can_hear(f: Frame) {
	let ears: Value = null;
	f.dot = 0;
	if (!(rt.istype((ears = this.getorganslot("ears")), T("/obj/item/organ/ears")) && !ears.deaf)) return f.dot;
	f.dot = 1;
	return f.dot;
});
