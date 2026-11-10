// Based on /tg/station's code/modules/mob/living/carbon/alien/alien_defense.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// alien_defense.dm:3
rt.def("/mob/living/carbon/alien/proc/get_eye_protection", function get_eye_protection(f: Frame) {
	return parent_proc() + 2;
});

// alien_defense.dm:9
rt.def("/mob/living/carbon/alien/proc/hitby", function* hitby(f: Frame, AM: Value, skipcatch: Value, hitpush: Value) {
	yield* parent_proc(AM, { skipcatch: 1, hitpush: 0 });
	return f.dot;
}, true);

// alien_defense.dm:17
rt.def("/mob/living/carbon/alien/proc/attack_alien", function* attack_alien(f: Frame, M: Value) {
	if (isturf(this.loc) && rt.istype(this.loc.loc, T("/area/start"))) {
		to_chat(M, "No attacking people at spawn, you jackass.");
		return f.dot;
	}
	if (M.a_intent === "help") {
		this.resting = 0;
		yield* this.AdjustStun(-60);
		yield* this.AdjustKnockdown(-60);
		yield* this.AdjustUnconscious(-60);
		yield* this.AdjustSleeping(-100);
		this.visible_message(`<span class='notice'>${M.name} nuzzles ${this} trying to wake ${this.p_them()} up!</span>`);
	} else if (M.a_intent === "grab") {
		yield* this.grabbedby(M);
	} else if (this.health > 0) {
		yield* M.do_attack_animation(this, "bite");
		playsound(this.loc, rt.rsc("sound/weapons/bite.ogg"), 50, 1, -1);
		this.visible_message(`<span class='danger'>${M.name} bites ${this}!</span>`, `<span class='userdanger'>${M.name} bites ${this}!</span>`, null, 3);
		yield* this.adjustBruteLoss(1);
		add_logs(M, this, "attacked");
		yield* this.updatehealth();
	} else {
		to_chat(M, `<span class='warning'>${this.name} is too injured for that.</span>`);
	}
	return f.dot;
}, true);

// alien_defense.dm:48
rt.def("/mob/living/carbon/alien/proc/attack_larva", function* attack_larva(f: Frame, L: Value) {
	return (yield* this.attack_alien(L));
}, true);

// alien_defense.dm:52
rt.def("/mob/living/carbon/alien/proc/attack_hand", function* attack_hand(f: Frame, M: Value) {
	if (yield* parent_proc()) {
		return 0;
	}
	if (M.a_intent === "help") {
		yield* this.help_shake_act(M);
	} else if (M.a_intent === "grab") {
		yield* this.grabbedby(M);
	} else if (M.a_intent === "harm") {
		yield* M.do_attack_animation(this, "punch");
		return 1;
	} else if (M.a_intent === "disarm") {
		yield* M.do_attack_animation(this, "disarm");
		return 1;
	}
	return 0;
}, true);

// alien_defense.dm:70
rt.def("/mob/living/carbon/alien/proc/attack_paw", function* attack_paw(f: Frame, M: Value) {
	if (!(yield* parent_proc())) return f.dot;
	if (this.stat == 2) return f.dot;
	let affecting: Value = this.get_bodypart(ran_zone(M.zone_selected));
	yield* this.apply_damage(rand(1, 3), "brute", affecting);
	return f.dot;
}, true);

// alien_defense.dm:77
rt.def("/mob/living/carbon/alien/proc/attack_animal", function* attack_animal(f: Frame, M: Value) {
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	let damage: Value = rand(M.melee_damage_lower, M.melee_damage_upper);
	if (M.melee_damage_type === "brute") {
		yield* this.adjustBruteLoss(damage);
	} else if (M.melee_damage_type === "fire") {
		yield* this.adjustFireLoss(damage);
	} else if (M.melee_damage_type === "tox") {
		yield* this.adjustToxLoss(damage);
	} else if (M.melee_damage_type === "oxy") {
		yield* this.adjustOxyLoss(damage);
	} else if (M.melee_damage_type === "clone") {
		yield* this.adjustCloneLoss(damage);
	} else if (M.melee_damage_type === "stamina") {
		yield* this.adjustStaminaLoss(damage);
	}
	return f.dot;
}, true);

// alien_defense.dm:95
rt.def("/mob/living/carbon/alien/proc/attack_slime", function* attack_slime(f: Frame, M: Value) {
	if (!(yield* parent_proc())) return f.dot;
	let damage: Value = rand(5, 35);
	if (M.is_adult) {
		damage = rand(10, 40);
	}
	yield* this.adjustBruteLoss(damage);
	add_logs(M, this, "attacked");
	yield* this.updatehealth();
	return f.dot;
}, true);

// alien_defense.dm:104
rt.def("/mob/living/carbon/alien/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value, origin: Value) {
	if (origin && rt.istype(origin, T("/datum/spacevine_mutation")) && isvineimmune(this)) {
		return f.dot;
	}
	yield* parent_proc();
	if (severity === 1) {
		yield* this.gib();
		return f.dot;
	} else if (severity === 2) {
		yield* this.take_overall_damage(60, 60);
		this.adjustEarDamage(30, 120);
	} else if (severity === 3) {
		yield* this.take_overall_damage(30, 0);
		if (prob(50)) {
			yield* this.Unconscious(20);
		}
		this.adjustEarDamage(15, 60);
	}
	return f.dot;
}, true, { waitfor: false });
