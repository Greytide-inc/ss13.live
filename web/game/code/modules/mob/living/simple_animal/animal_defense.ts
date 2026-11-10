// Based on /tg/station's code/modules/mob/living/simple_animal/animal_defense.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// animal_defense.dm:4
rt.def("/mob/living/simple_animal/proc/attack_hand", function* attack_hand(f: Frame, M: Value) {
	yield* parent_proc();
	if (M.a_intent === "help") {
		if (this.health > 0) {
			this.visible_message(`<span class='notice'>${M} ${this.response_help} ${this}.</span>`);
			playsound(this.loc, rt.rsc("sound/weapons/thudswoosh.ogg"), 50, 1, -1);
		}
	} else if (M.a_intent === "grab") {
		yield* this.grabbedby(M);
	} else if (M.a_intent === "harm" || M.a_intent === "disarm") {
		yield* M.do_attack_animation(this, "punch");
		this.visible_message(`<span class='danger'>${M} ${this.response_harm} ${this}!</span>`, `<span class='userdanger'>${M} ${this.response_harm} ${this}!</span>`, null, 3);
		playsound(this.loc, this.attacked_sound, 25, 1, -1);
		yield* this.attack_threshold_check(this.harm_intent_damage);
		add_logs(M, this, "attacked");
		yield* this.updatehealth();
		return 1;
	}
	return f.dot;
}, true);

// animal_defense.dm:26
rt.def("/mob/living/simple_animal/proc/attack_hulk", function* attack_hulk(f: Frame, user: Value, does_attack_animation: Value) {
	does_attack_animation ??= 0;
	if (user.a_intent != "harm") return f.dot;
	yield* parent_proc(user, 1);
	playsound(this.loc, "punch", 25, 1, -1);
	this.visible_message(`<span class='danger'>${user} has punched ${this}!</span>`, `<span class='userdanger'>${user} has punched ${this}!</span>`, null, 3);
	yield* this.adjustBruteLoss(15);
	return 1;
}, true);

// animal_defense.dm:35
rt.def("/mob/living/simple_animal/proc/attack_paw", function* attack_paw(f: Frame, M: Value) {
	let damage: Value = null;
	if (yield* parent_proc()) {
		if (this.stat != 2) {
			yield* this.attack_threshold_check((damage = rand(1, 3)));
			return 1;
		}
	}
	if (M.a_intent != "help") return f.dot;
	if (!(this.health > 0)) return f.dot;
	this.visible_message(`<span class='notice'>${M.name} ${this.response_help} ${this}.</span>`);
	playsound(this.loc, rt.rsc("sound/weapons/thudswoosh.ogg"), 50, 1, -1);
	return f.dot;
}, true);

// animal_defense.dm:47
rt.def("/mob/living/simple_animal/proc/attack_alien", function* attack_alien(f: Frame, M: Value) {
	let damage: Value = null;
	if (!(yield* parent_proc())) return f.dot;
	if (M.a_intent == "disarm") {
		playsound(this.loc, rt.rsc("sound/weapons/pierce.ogg"), 25, 1, -1);
		this.visible_message(`<span class='danger'>${M} ${this.response_disarm} ${this.name}!</span>`, `<span class='userdanger'>${M} ${this.response_disarm} ${this.name}!</span>`, null, 3);
		add_logs(M, this, "disarmed");
	} else {
		damage = rand(15, 30);
		this.visible_message(`<span class='danger'>${M} has slashed at ${this}!</span>`, `<span class='userdanger'>${M} has slashed at ${this}!</span>`, null, 3);
		playsound(this.loc, rt.rsc("sound/weapons/slice.ogg"), 25, 1, -1);
		yield* this.attack_threshold_check(damage);
		add_logs(M, this, "attacked");
	}
	return 1;
}, true);

// animal_defense.dm:63
rt.def("/mob/living/simple_animal/proc/attack_larva", function* attack_larva(f: Frame, L: Value) {
	let damage: Value = null;
	f.dot = (yield* parent_proc());
	if (!(f.dot && this.stat != 2)) return f.dot;
	f.dot = (yield* this.attack_threshold_check((damage = rand(5, 10))));
	if (!f.dot) return f.dot;
	L.amount_grown = min(L.amount_grown + damage, L.max_grown);
	return f.dot;
}, true);

// animal_defense.dm:71
rt.def("/mob/living/simple_animal/proc/attack_animal", function* attack_animal(f: Frame, M: Value) {
	let damage: Value = null;
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	return (yield* this.attack_threshold_check((damage = rand(M.melee_damage_lower, M.melee_damage_upper)), M.melee_damage_type));
}, true);

// animal_defense.dm:77
rt.def("/mob/living/simple_animal/proc/attack_slime", function* attack_slime(f: Frame, M: Value) {
	if (!(yield* parent_proc())) return f.dot;
	let damage: Value = rand(15, 25);
	if (M.is_adult) {
		damage = rand(20, 35);
	}
	return (yield* this.attack_threshold_check(damage));
}, true);

// animal_defense.dm:84
rt.def("/mob/living/simple_animal/proc/attack_threshold_check", function* attack_threshold_check(f: Frame, damage: Value, damagetype: Value, armorcheck: Value) {
	damagetype ??= "brute";
	armorcheck ??= "melee";
	let temp_damage: Value = damage;
	if (!rt.index(this.damage_coeff, damagetype)) {
		temp_damage = 0;
	} else {
		temp_damage *= rt.index(this.damage_coeff, damagetype);
	}
	if (temp_damage >= 0 && temp_damage <= this.force_threshold) {
		this.visible_message(`<span class='warning'>${this} looks unharmed.</span>`);
		return 0;
	} else {
		yield* this.apply_damage(damage, damagetype, null, this.getarmor(null, armorcheck));
		return 1;
	}
}, true);

// animal_defense.dm:98
rt.def("/mob/living/simple_animal/proc/bullet_act", function* bullet_act(f: Frame, Proj: Value) {
	if (!Proj) {
		return f.dot;
	}
	yield* this.apply_damage(Proj.damage, Proj.damage_type);
	yield* Proj.on_hit(this);
	return 0;
}, true);

// animal_defense.dm:105
rt.def("/mob/living/simple_animal/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value, origin: Value) {
	let bloss: Value = null;
	if (origin && rt.istype(origin, T("/datum/spacevine_mutation")) && isvineimmune(this)) {
		return f.dot;
	}
	yield* parent_proc();
	let bomb_armor: Value = this.getarmor(null, "bomb");
	if (severity === 1) {
		if (prob(bomb_armor)) {
			yield* this.adjustBruteLoss(500);
		} else {
			yield* this.gib();
			return f.dot;
		}
	} else if (severity === 2) {
		bloss = 60;
		if (prob(bomb_armor)) {
			bloss = bloss / 1.5;
		}
		yield* this.adjustBruteLoss(bloss);
	} else if (severity === 3) {
		bloss = 30;
		if (prob(bomb_armor)) {
			bloss = bloss / 1.5;
		}
		yield* this.adjustBruteLoss(bloss);
	}
	return f.dot;
}, true, { waitfor: false });

// animal_defense.dm:129
rt.def("/mob/living/simple_animal/proc/blob_act", function* blob_act(f: Frame, B: Value) {
	yield* this.adjustBruteLoss(20);
	return f.dot;
}, true);

// animal_defense.dm:133
rt.def("/mob/living/simple_animal/proc/do_attack_animation", function* do_attack_animation(f: Frame) {
	if (!f.args[3] && !f.args[1] && this.melee_damage_upper) {
		if (this.melee_damage_upper < 10) {
			f.args[1] = "punch";
		} else {
			f.args[1] = "smash";
		}
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["A", "visual_effect_icon", "used_item", "no_effect", "end_pixel_y"] });
