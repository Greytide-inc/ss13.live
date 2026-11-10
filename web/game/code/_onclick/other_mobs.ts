// Based on /tg/station's code/_onclick/other_mobs.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// other_mobs.dm:9
rt.def("/mob/living/carbon/human/proc/UnarmedAttack", function* UnarmedAttack(f: Frame, A: Value, proximity: Value) {
	let HM: Value = null;
	if (!this.has_active_hand()) {
		to_chat(this, "<span class='notice'>You look at your arm and sigh.</span>");
		return f.dot;
	}
	let G: Value = this.gloves;
	if (proximity && rt.istype(G, T("/obj/item/clothing/gloves")) && (yield* G.Touch(A, 1))) {
		return f.dot;
	}
	let override: Value = 0;
	for (HM of each(this.dna.mutations, T("/datum/mutation/human"))) {
		override += (yield* HM.on_attack_hand(this, A, proximity));
	}
	if (override) {
		return f.dot;
	}
	yield* A.attack_hand(this);
	return f.dot;
}, true);

// other_mobs.dm:46
rt.def("/mob/living/carbon/human/proc/RangedAttack", function* RangedAttack(f: Frame, A: Value) {
	let G: Value = null, HM: Value = null;
	if (this.gloves) {
		if (rt.istype((G = this.gloves), T("/obj/item/clothing/gloves")) && (yield* G.Touch(A, 0))) {
			return f.dot;
		}
	}
	for (HM of each(this.dna.mutations, T("/datum/mutation/human"))) {
		yield* HM.on_ranged_attack(this, A);
	}
	if (!(isturf(A) && get_dist(this, A) <= 1)) return f.dot;
	yield* this.Move_Pulled(A);
	return f.dot;
}, true);

// other_mobs.dm:60
rt.def("/mob/living/proc/UnarmedAttack", function* UnarmedAttack(f: Frame, A: Value) {
	yield* A.attack_animal(this);
	return f.dot;
}, true);

// other_mobs.dm:71
rt.def("/mob/living/carbon/monkey/proc/UnarmedAttack", function* UnarmedAttack(f: Frame, A: Value) {
	yield* A.attack_paw(this);
	return f.dot;
}, true);

// other_mobs.dm:83
rt.def("/mob/living/carbon/monkey/proc/RestrainedClickOn", function* RestrainedClickOn(f: Frame, A: Value) {
	let ML: Value = null, affecting: Value = null, H: Value = null, D: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (this.a_intent != "harm" || !ismob(A)) {
		return f.dot;
	}
	if (this.is_muzzled()) {
		return f.dot;
	}
	if (!rt.istype((ML = A), T("/mob/living/carbon"))) return f.dot;
	let dam_zone: Value = pick("chest", "l_hand", "r_hand", "l_leg", "r_leg");
	if (rt.istype(ML, T("/mob/living/carbon/human"))) {
		affecting = (H = ML).get_bodypart(ran_zone(dam_zone));
	}
	let armor: Value = ML.run_armor_check(affecting, "melee");
	if (prob(75)) {
		yield* ML.apply_damage(rand(1, 3), "brute", affecting, armor);
		ML.visible_message(`<span class='danger'>${this.name} bites ${ML}!</span>`, `<span class='userdanger'>${this.name} bites ${ML}!</span>`);
		if (armor >= 2) {
			return f.dot;
		}
		for (D of each(this.viruses, T("/datum/disease"))) {
			yield* ML.ForceContractDisease(D);
		}
	} else {
		ML.visible_message(`<span class='danger'>${this} has attempted to bite ${ML}!</span>`);
	}
	return f.dot;
}, true);

// other_mobs.dm:113
rt.def("/mob/living/carbon/alien/proc/UnarmedAttack", function* UnarmedAttack(f: Frame, A: Value) {
	yield* A.attack_alien(this);
	return f.dot;
}, true);

// other_mobs.dm:115
rt.def("/atom/proc/attack_alien", function* attack_alien(f: Frame, user: Value) {
	yield* this.attack_paw(user);
	return f.dot;
}, true);

// other_mobs.dm:122
rt.def("/mob/living/carbon/alien/larva/proc/UnarmedAttack", function* UnarmedAttack(f: Frame, A: Value) {
	yield* A.attack_larva(this);
	return f.dot;
}, true);

// other_mobs.dm:132
rt.def("/mob/living/simple_animal/slime/proc/UnarmedAttack", function* UnarmedAttack(f: Frame, A: Value) {
	yield* A.attack_slime(this);
	return f.dot;
}, true);

// other_mobs.dm:143
rt.def("/mob/living/simple_animal/drone/proc/UnarmedAttack", function* UnarmedAttack(f: Frame, A: Value) {
	yield* A.attack_drone(this);
	return f.dot;
}, true);

// other_mobs.dm:146
rt.def("/atom/proc/attack_drone", function* attack_drone(f: Frame, user: Value) {
	yield* this.attack_hand(user);
	return f.dot;
}, true);

// other_mobs.dm:157
rt.def("/mob/living/carbon/true_devil/proc/UnarmedAttack", function* UnarmedAttack(f: Frame, A: Value, proximity: Value) {
	yield* A.attack_hand(this);
	return f.dot;
}, true);

// other_mobs.dm:180
rt.def("/mob/living/simple_animal/proc/UnarmedAttack", function* UnarmedAttack(f: Frame, A: Value, proximity: Value) {
	if (!this.dextrous) {
		return (yield* parent_proc());
	}
	if (ismob(A)) return f.dot;
	yield* A.attack_hand(this);
	yield* this.update_inv_hands();
	return f.dot;
}, true);

// other_mobs.dm:192
rt.def("/mob/living/simple_animal/hostile/proc/UnarmedAttack", function* UnarmedAttack(f: Frame, A: Value) {
	this.target = A;
	if (this.dextrous && !is_type_in_typecache(A, this.environment_target_typecache) && !ismob(A)) {
		yield* parent_proc();
	} else {
		yield* this.AttackingTarget();
	}
	return f.dot;
}, true);
