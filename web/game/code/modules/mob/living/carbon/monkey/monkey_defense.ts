// Based on /tg/station's code/modules/mob/living/carbon/monkey/monkey_defense.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


// monkey_defense.dm:2
rt.def("/mob/living/carbon/monkey/proc/help_shake_act", function* help_shake_act(f: Frame, M: Value) {
	let H: Value = null;
	if (this.health < 0 && rt.istype(M, T("/mob/living/carbon/human"))) {
		yield* (H = M).do_cpr(this);
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// monkey_defense.dm:9
rt.def("/mob/living/carbon/monkey/proc/attack_paw", function* attack_paw(f: Frame, M: Value) {
	let affecting: Value = null, dmg: Value = null;
	if (!(yield* parent_proc())) return f.dot;
	let dam_zone: Value = pick("chest", "l_hand", "r_hand", "l_leg", "r_leg");
	if (!(affecting = this.get_bodypart(ran_zone(dam_zone)))) {
		affecting = this.get_bodypart("chest");
	}
	if (M.limb_destroyer) {
		yield* this.dismembering_strike(M, affecting.body_zone);
	}
	if (this.stat == 2) return f.dot;
	yield* this.apply_damage((dmg = rand(1, 5)), "brute", affecting);
	yield* this.damage_clothes(dmg, "brute", "melee", affecting.body_zone);
	return f.dot;
}, true);

// monkey_defense.dm:24
rt.def("/mob/living/carbon/monkey/proc/attack_larva", function* attack_larva(f: Frame, L: Value) {
	let affecting: Value = null;
	if (!(yield* parent_proc())) return f.dot;
	let damage: Value = rand(1, 3);
	if (this.stat == 2) return f.dot;
	L.amount_grown = min(L.amount_grown + damage, L.max_grown);
	if (!(affecting = this.get_bodypart(ran_zone(L.zone_selected)))) {
		affecting = this.get_bodypart("chest");
	}
	yield* this.apply_damage(damage, "brute", affecting);
	yield* this.damage_clothes(damage, "brute", "melee", affecting.body_zone);
	return f.dot;
}, true);

// monkey_defense.dm:35
rt.def("/mob/living/carbon/monkey/proc/attack_hand", function* attack_hand(f: Frame, M: Value) {
	let damage: Value = null, affecting: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (M.a_intent === "help") {
		yield* this.help_shake_act(M);
	} else if (M.a_intent === "grab") {
		yield* this.grabbedby(M);
	} else if (M.a_intent === "harm") {
		yield* M.do_attack_animation(this, "punch");
		if (prob(75)) {
			this.visible_message(`<span class='danger'>${M} has punched ${this.name}!</span>`, `<span class='userdanger'>${M} has punched ${this.name}!</span>`, null, 3);
			playsound(this.loc, "punch", 25, 1, -1);
			damage = rand(5, 10);
			if (prob(40)) {
				damage = rand(10, 15);
				if (this.AmountUnconscious() < 100 && this.health > 0) {
					yield* this.Unconscious(rand(200, 300));
					this.visible_message(`<span class='danger'>${M} has knocked out ${this.name}!</span>`, `<span class='userdanger'>${M} has knocked out ${this.name}!</span>`, null, 5);
				}
			}
			if (!(affecting = this.get_bodypart(ran_zone(M.zone_selected)))) {
				affecting = this.get_bodypart("chest");
			}
			yield* this.apply_damage(damage, "brute", affecting);
			yield* this.damage_clothes(damage, "brute", "melee", affecting.body_zone);
			add_logs(M, this, "attacked");
		} else {
			playsound(this.loc, rt.rsc("sound/weapons/punchmiss.ogg"), 25, 1, -1);
			this.visible_message(`<span class='danger'>${M} has attempted to punch ${this.name}!</span>`, `<span class='userdanger'>${M} has attempted to punch ${this.name}!</span>`, null, 3);
		}
	} else if (M.a_intent === "disarm") {
		if (this.IsUnconscious()) return f.dot;
		yield* M.do_attack_animation(this, "disarm");
		if (prob(25)) {
			yield* this.Knockdown(40);
			playsound(this.loc, rt.rsc("sound/weapons/thudswoosh.ogg"), 50, 1, -1);
			add_logs(M, this, "pushed");
			this.visible_message(`<span class='danger'>${M} has pushed down ${this}!</span>`, `<span class='userdanger'>${M} has pushed down ${this}!</span>`, null, 3);
		} else {
			if (!(yield* this.drop_item())) return f.dot;
			playsound(this.loc, rt.rsc("sound/weapons/thudswoosh.ogg"), 50, 1, -1);
			this.visible_message(`<span class='danger'>${M} has disarmed ${this}!</span>`, `<span class='userdanger'>${M} has disarmed ${this}!</span>`, null, 3);
		}
	}
	return f.dot;
}, true);

// monkey_defense.dm:84
rt.def("/mob/living/carbon/monkey/proc/attack_alien", function* attack_alien(f: Frame, M: Value) {
	let damage: Value = null, affecting: Value = null, I: Value = null;
	if (!(yield* parent_proc())) return f.dot;
	if (M.a_intent == "harm") {
		if (prob(95) && this.health > 0) {
			playsound(this.loc, rt.rsc("sound/weapons/slice.ogg"), 25, 1, -1);
			if ((damage = rand(15, 30)) >= 25) {
				damage = rand(20, 40);
				if (this.AmountUnconscious() < 300) {
					yield* this.Unconscious(rand(200, 300));
				}
				this.visible_message(`<span class='danger'>${M} has wounded ${this.name}!</span>`, `<span class='userdanger'>${M} has wounded ${this.name}!</span>`, null, 3);
			} else {
				this.visible_message(`<span class='danger'>${M} has slashed ${this.name}!</span>`, `<span class='userdanger'>${M} has slashed ${this.name}!</span>`, null, 3);
			}
			affecting = this.get_bodypart(ran_zone(M.zone_selected));
			add_logs(M, this, "attacked");
			if (!affecting) {
				affecting = this.get_bodypart("chest");
			}
			if (!(yield* this.dismembering_strike(M, affecting.body_zone))) {
				return 1;
			}
			yield* this.apply_damage(damage, "brute", affecting);
			yield* this.damage_clothes(damage, "brute", "melee", affecting.body_zone);
		} else {
			playsound(this.loc, rt.rsc("sound/weapons/slashmiss.ogg"), 25, 1, -1);
			this.visible_message(`<span class='danger'>${M} has attempted to lunge at ${this.name}!</span>`, `<span class='userdanger'>${M} has attempted to lunge at ${this.name}!</span>`, null, 3);
		}
	}
	if (M.a_intent != "disarm") return f.dot;
	playsound(this.loc, rt.rsc("sound/weapons/pierce.ogg"), 25, 1, -1);
	if (prob(95)) {
		yield* this.Knockdown(20);
		this.visible_message(`<span class='danger'>${M} has tackled down ${this.name}!</span>`, `<span class='userdanger'>${M} has tackled down ${this.name}!</span>`, null, 3);
	} else {
		I = this.get_active_held_item();
		if (yield* this.drop_item()) {
			this.visible_message(`<span class='danger'>${M} has disarmed ${this.name}!</span>`, `<span class='userdanger'>${M} has disarmed ${this.name}!</span>`, null, 3);
		} else {
			I = null;
		}
	}
	let $0: any = M;
	let $1: any = this;
	let $2: any = "disarmed";
	add_logs($0, $1, $2, `${I ? fmt(" removing ％！", [I]) : ""}`);
	yield* this.updatehealth();
	return f.dot;
}, true);

// monkey_defense.dm:133
rt.def("/mob/living/carbon/monkey/proc/attack_animal", function* attack_animal(f: Frame, M: Value) {
	let dam_zone: Value = null, affecting: Value = null;
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	let damage: Value = rand(M.melee_damage_lower, M.melee_damage_upper);
	if (!(dam_zone = (yield* this.dismembering_strike(M, pick("chest", "l_hand", "r_hand", "l_leg", "r_leg"))))) {
		return 1;
	}
	if (!(affecting = this.get_bodypart(ran_zone(dam_zone)))) {
		affecting = this.get_bodypart("chest");
	}
	yield* this.apply_damage(damage, M.melee_damage_type, affecting);
	yield* this.damage_clothes(damage, M.melee_damage_type, "melee", affecting.body_zone);
	return f.dot;
}, true);

// monkey_defense.dm:148
rt.def("/mob/living/carbon/monkey/proc/attack_slime", function* attack_slime(f: Frame, M: Value) {
	let dam_zone: Value = null, affecting: Value = null;
	if (!(yield* parent_proc())) return f.dot;
	let damage: Value = rand(5, 35);
	if (M.is_adult) {
		damage = rand(20, 40);
	}
	if (!(dam_zone = (yield* this.dismembering_strike(M, pick("head", "chest", "l_arm", "r_arm", "l_leg", "r_leg"))))) {
		return 1;
	}
	if (!(affecting = this.get_bodypart(ran_zone(dam_zone)))) {
		affecting = this.get_bodypart("chest");
	}
	yield* this.apply_damage(damage, "brute", affecting);
	yield* this.damage_clothes(damage, "brute", "melee", affecting.body_zone);
	return f.dot;
}, true);

// monkey_defense.dm:164
rt.def("/mob/living/carbon/monkey/proc/acid_act", function* acid_act(f: Frame, acidpwr: Value, acid_volume: Value, bodyzone_hit: Value) {
	f.dot = 1;
	if (!bodyzone_hit || bodyzone_hit == "head") {
		if (this.wear_mask) {
			if (!rt.bitAnd(this.wear_mask.resistance_flags, UNACIDABLE)) {
				yield* this.wear_mask.acid_act(acidpwr);
			} else {
				to_chat(this, "<span class='warning'>Your mask protects you from the acid.</span>");
			}
			return f.dot;
		}
		if (this.head) {
			if (!rt.bitAnd(this.head.resistance_flags, UNACIDABLE)) {
				yield* this.head.acid_act(acidpwr);
			} else {
				to_chat(this, "<span class='warning'>Your hat protects you from the acid.</span>");
			}
			return f.dot;
		}
	}
	yield* this.take_bodypart_damage(acidpwr * min(0.6, acid_volume * 0.1));
	return f.dot;
}, true);

// monkey_defense.dm:181
rt.def("/mob/living/carbon/monkey/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value, origin: Value) {
	let X: Value = null, BP: Value = null;
	let $e: any;
	if (origin && rt.istype(origin, T("/datum/spacevine_mutation")) && isvineimmune(this)) {
		return f.dot;
	}
	yield* parent_proc();
	if (severity === 1) {
		yield* this.gib();
		return f.dot;
	} else if (severity === 2) {
		yield* this.take_overall_damage(60, 60);
		yield* this.damage_clothes(200, "brute", "bomb");
		this.adjustEarDamage(30, 120);
		if (prob(70)) {
			yield* this.Unconscious(200);
		}
	} else if (severity === 3) {
		yield* this.take_overall_damage(30, 0);
		yield* this.damage_clothes(50, "brute", "bomb");
		this.adjustEarDamage(15, 60);
		if (prob(50)) {
			yield* this.Unconscious(160);
		}
	}
	if (!(severity <= 2)) return f.dot;
	let max_limb_loss: Value = round(4 / severity);
	for (X of each(this.bodyparts)) {
		BP = X;
		if (prob(50 / severity) && BP.body_zone != "chest") {
			BP.brute_dam = BP.max_damage;
			yield* BP.dismember();
			max_limb_loss--;
			if (!max_limb_loss) {
				break;
			}
		}
	}
	return f.dot;
}, true, { waitfor: false });
