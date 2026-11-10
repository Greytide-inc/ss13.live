// Based on /tg/station's code/modules/mob/living/carbon/human/human_defense.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


// human_defense.dm:6
rt.def("/mob/living/carbon/human/proc/getarmor", function getarmor(f: Frame, def_zone: Value, type: Value) {
	let affecting: Value = null, X: Value = null, BP: Value = null;
	let armorval: Value = 0;
	let organnum: Value = 0;
	if (def_zone) {
		if (rt.istype(def_zone, T("/obj/item/bodypart"))) {
			return this.checkarmor(def_zone, type);
		}
		return this.checkarmor((affecting = this.get_bodypart(ran_zone(def_zone))), type);
	}
	for (X of each(this.bodyparts)) {
		armorval += this.checkarmor((BP = X), type);
		organnum++;
	}
	return armorval / max(organnum, 1);
});

// human_defense.dm:21
rt.def("/mob/living/carbon/human/proc/checkarmor", function checkarmor(f: Frame, def_zone: Value, d_type: Value) {
	let bp: Value = null, C: Value = null;
	if (!d_type) {
		return 0;
	}
	let protection: Value = 0;
	let body_parts: Value = list(this.head, this.wear_mask, this.wear_suit, this.w_uniform, this.back, this.gloves, this.shoes, this.belt, this.s_store, this.glasses, this.ears, this.wear_id);
	for (bp of each(body_parts)) {
		if (!bp) {
			continue;
		}
		if (bp && rt.istype(bp, T("/obj/item/clothing"))) {
			if (rt.bitAnd((C = bp).body_parts_covered, def_zone.body_part)) {
				protection += rt.index(C.armor, d_type);
			}
		}
	}
	return protection;
});

// human_defense.dm:35
rt.def("/mob/living/carbon/human/proc/on_hit", function* on_hit(f: Frame, _P: Value) {
	yield* this.dna.species.on_hit(_P, this);
	return f.dot;
}, true);

// human_defense.dm:39
rt.def("/mob/living/carbon/human/proc/bullet_act", function* bullet_act(f: Frame, _P: Value, def_zone: Value) {
	let spec_return: Value = null, new_x: Value = null, new_y: Value = null, curloc: Value = null;
	if (spec_return = (yield* this.dna.species.bullet_act(_P, this))) {
		return spec_return;
	}
	if (this.mind) {
		if (this.mind.martial_art && this.mind.martial_art.deflection_chance) {
			if (prob(this.mind.martial_art.deflection_chance)) {
				if (!this.lying && this.dna && !this.dna.check_mutation("Hulk")) {
					this.visible_message(`<span class='danger'>${this} deflects the projectile; ${this.p_they()} can't be hit with ranged weapons!</span>`, "<span class='userdanger'>You deflect the projectile!</span>");
					playsound(this, pick(rt.rsc("sound/weapons/bulletflyby.ogg"), rt.rsc("sound/weapons/bulletflyby2.ogg"), rt.rsc("sound/weapons/bulletflyby3.ogg")), 75, 1);
					return 0;
				}
			}
		}
	}
	if (!(_P.original == this && _P.firer == this)) {
		if (rt.istype(_P, T("/obj/item/projectile/energy")) || rt.istype(_P, T("/obj/item/projectile/beam"))) {
			if (yield* this.check_reflect(def_zone)) {
				this.visible_message(`<span class='danger'>The ${_P.name} gets reflected by ${this}!</span>`, `<span class='userdanger'>The ${_P.name} gets reflected by ${this}!</span>`);
				if (_P.starting) {
					new_x = _P.starting.x + pick(0, 0, 0, 0, 0, -1, 1, -2, 2);
					new_y = _P.starting.y + pick(0, 0, 0, 0, 0, -1, 1, -2, 2);
					curloc = rt.getStep(f, this, 0);
					_P.original = rt.locate(new_x, new_y, _P.z);
					_P.starting = curloc;
					_P.current = curloc;
					_P.firer = this;
					_P.yo = new_y - curloc.y;
					_P.xo = new_x - curloc.x;
					_P.Angle = null;
				}
				return -1;
			}
		}
		if (yield* this.check_shields(_P, _P.damage, `the ${_P.name}`, 3, _P.armour_penetration)) {
			yield* _P.on_hit(this, 100, def_zone);
			return 2;
		}
	}
	return (yield* parent_proc(_P, def_zone));
}, true);

// human_defense.dm:81
rt.def("/mob/living/carbon/human/proc/check_reflect", function* check_reflect(f: Frame, def_zone: Value) {
	let I: Value = null;
	if (this.wear_suit) {
		if ((yield* this.wear_suit.IsReflect(def_zone)) == 1) {
			return 1;
		}
	}
	for (I of each(this.held_items, T("/obj/item"))) {
		if ((yield* I.IsReflect(def_zone)) == 1) {
			return 1;
		}
	}
	return 0;
}, true);

// human_defense.dm:89
rt.def("/mob/living/carbon/human/proc/check_shields", function* check_shields(f: Frame, AM: Value, damage: Value, attack_text: Value, attack_type: Value, armour_penetration: Value) {
	let I: Value = null, final_block_chance: Value = null, final_block_chance_1: Value = null;
	attack_text ??= "the attack";
	attack_type ??= 1;
	armour_penetration ??= 0;
	let block_chance_modifier: Value = round(damage / -3);
	for (I of each(this.held_items, T("/obj/item"))) {
		if (!rt.istype(I, T("/obj/item/clothing"))) {
			final_block_chance = I.block_chance - max(0, min((armour_penetration - I.armour_penetration) / 2, 100)) + block_chance_modifier;
			if (yield* I.hit_reaction(this, AM, attack_text, final_block_chance, damage, attack_type)) {
				return 1;
			}
		}
	}
	if (this.wear_suit) {
		final_block_chance_1 = this.wear_suit.block_chance - max(0, min((armour_penetration - this.wear_suit.armour_penetration) / 2, 100)) + block_chance_modifier;
		if (yield* this.wear_suit.hit_reaction(this, AM, attack_text, final_block_chance_1, damage, attack_type)) {
			return 1;
		}
	}
	if (this.w_uniform) {
		final_block_chance_1 = this.w_uniform.block_chance - max(0, min((armour_penetration - this.w_uniform.armour_penetration) / 2, 100)) + block_chance_modifier;
		if (yield* this.w_uniform.hit_reaction(this, AM, attack_text, final_block_chance_1, damage, attack_type)) {
			return 1;
		}
	}
	return 0;
}, true);

// human_defense.dm:108
rt.def("/mob/living/carbon/human/proc/check_block", function check_block(f: Frame) {
	if (this.mind) {
		if (this.mind.martial_art && prob(this.mind.martial_art.block_chance) && this.in_throw_mode && !this.stat && !this.IsKnockdown() && !this.IsStun()) {
			return 1;
		}
	}
	return 0;
});

// human_defense.dm:113
rt.def("/mob/living/carbon/human/proc/hitby", function* hitby(f: Frame) {
	let spec_return: Value = null, I: Value = null, L: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	if (f.args[3] === null) {
		f.args[3] = 0;
	}
	if (spec_return = (yield* this.dna.species.spec_hitby(f.args[0], this))) {
		return spec_return;
	}
	let throwpower: Value = 30;
	if (rt.istype(f.args[0], T("/obj/item"))) {
		throwpower = (I = f.args[0]).throwforce;
		if (I.thrownby == this) {
			return (yield* parent_proc());
		}
	}
	if (yield* this.check_shields(f.args[0], throwpower, fmt("％！", [f.args[0].name]), 4)) {
		f.args[2] = 0;
		f.args[1] = 1;
		f.args[3] = 1;
	} else if (I) {
		if (I.throw_speed >= EMBED_THROWSPEED_THRESHOLD) {
			if (can_embed(I)) {
				if (prob(I.embed_chance) && !(this.dna && rt.isIn(f, PIERCEIMMUNE, this.dna.species.species_traits))) {
					yield* this.throw_alert("embeddedobject", T("/obj/screen/alert/embeddedobject"));
					(rt.modField(f, (L = pick(this.bodyparts)), "embedded_objects", I, rt.bitOr));
					yield* I.add_mob_blood(this);
					I.loc = this;
					yield* L.receive_damage(I.w_class * I.embedded_impact_pain_multiplier);
					this.visible_message(`<span class='danger'>${I} embeds itself in ${this}'s ${L.name}!</span>`, `<span class='userdanger'>${I} embeds itself in your ${L.name}!</span>`);
					f.args[2] = 0;
					f.args[1] = 1;
				}
			}
		}
	}
	return (yield* parent_proc());
}, true, { args: ["AM", "skipcatch", "hitpush", "blocked"] });

// human_defense.dm:144
rt.def("/mob/living/carbon/human/proc/grabbedby", function* grabbedby(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[0] == this && this.pulling && !this.pulling.anchored && this.grab_state >= 1 && rt.bitAnd(this.disabilities, 32) && rt.istype(this.pulling, T("/mob/living/carbon/monkey"))) {
		yield* this.devour_mob(this.pulling);
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true, { args: ["user", "supress_message"] });

// human_defense.dm:151
rt.def("/mob/living/carbon/human/proc/grippedby", function* grippedby(f: Frame, user: Value) {
	if (this.w_uniform) {
		yield* this.w_uniform.add_fingerprint(user);
	}
	yield* parent_proc();
	return f.dot;
}, true);

// human_defense.dm:156
rt.def("/mob/living/carbon/human/proc/attacked_by", function* attacked_by(f: Frame, I: Value, user: Value) {
	if (!I || !user) {
		return 0;
	}
	let affecting: Value = this.get_bodypart(ran_zone(user.zone_selected));
	let target_area: Value = parse_zone(check_zone(user.zone_selected));
	return (yield* this.dna.species.spec_attacked_by(I, user, affecting, this.a_intent, this));
}, true);

// human_defense.dm:169
rt.def("/mob/living/carbon/human/proc/attack_hulk", function* attack_hulk(f: Frame, user: Value, does_attack_animation: Value) {
	let message: Value = null;
	does_attack_animation ??= 0;
	if (user.a_intent != "harm") return f.dot;
	let hulk_verb: Value = pick("smash", "pummel");
	if (yield* this.check_shields(user, 15, `the ${hulk_verb}ing`)) {
		return f.dot;
	}
	yield* parent_proc(user, 1);
	playsound(this.loc, user.dna.species.attack_sound, 25, 1, -1);
	this.visible_message(`<span class='danger'>${(message = `${user} has ${hulk_verb}ed ${this}!`)}</span>`, `<span class='userdanger'>${message}</span>`);
	yield* this.adjustBruteLoss(15);
	yield* this.damage_clothes(15, "brute", "melee");
	return 1;
}, true);

// human_defense.dm:183
rt.def("/mob/living/carbon/human/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let H: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (!rt.istype(user, T("/mob/living/carbon/human"))) return f.dot;
	if ((H = user).a_intent == "disarm") {
		if (H.buckled_mobs && rt.isIn(f, this, H.buckled_mobs) && H.riding_datum) {
			yield* H.riding_datum.force_dismount(this);
		}
	}
	yield* this.dna.species.spec_attack_hand(H, this);
	return f.dot;
}, true);

// human_defense.dm:194
rt.def("/mob/living/carbon/human/proc/attack_paw", function* attack_paw(f: Frame, M: Value) {
	let affecting: Value = null, damage: Value = null;
	let dam_zone: Value = pick("chest", "l_hand", "r_hand", "l_leg", "r_leg");
	if (!(affecting = this.get_bodypart(ran_zone(dam_zone)))) {
		affecting = this.get_bodypart("chest");
	}
	if (M.a_intent == "help") {
		yield* parent_proc();
		return 0;
	}
	if (M.a_intent == "disarm") {
		if (this.get_active_held_item() && (yield* this.drop_item())) {
			playsound(this.loc, rt.rsc("sound/weapons/slash.ogg"), 25, 1, -1);
			this.visible_message(`<span class='danger'>${M} disarmed ${this}!</span>`, `<span class='userdanger'>${M} disarmed ${this}!</span>`);
		} else if (!M.client || prob(5)) {
			playsound(this.loc, rt.rsc("sound/weapons/pierce.ogg"), 25, 1, -1);
			yield* this.Knockdown(100);
			add_logs(M, this, "tackled");
			this.visible_message(`<span class='danger'>${M} has tackled down ${this}!</span>`, `<span class='userdanger'>${M} has tackled down ${this}!</span>`);
		}
	}
	if (M.limb_destroyer) {
		yield* this.dismembering_strike(M, affecting.body_zone);
	}
	if (!(yield* this.can_inject(M, 1, affecting))) return f.dot;
	if (yield* parent_proc()) {
		damage = rand(1, 3);
		if (yield* this.check_shields(M, damage, `the ${M.name}`)) {
			return 0;
		}
		if (this.stat != 2) {
			yield* this.apply_damage(damage, "brute", affecting, this.run_armor_check(affecting, "melee"));
			yield* this.damage_clothes(damage, "brute", "melee", affecting.body_zone);
		}
	}
	return 1;
}, true);

// human_defense.dm:228
rt.def("/mob/living/carbon/human/proc/attack_alien", function* attack_alien(f: Frame, M: Value) {
	let damage: Value = null, affecting: Value = null, armor_block: Value = null;
	if (yield* this.check_shields(M, 0, "the M.name")) {
		this.visible_message(`<span class='danger'>${M} attempted to touch ${this}!</span>`);
		return 0;
	}
	if (!(yield* parent_proc())) return f.dot;
	if (M.a_intent == "harm") {
		if (this.w_uniform) {
			yield* this.w_uniform.add_fingerprint(M);
		}
		if (!(damage = prob(90) ? 20 : 0)) {
			playsound(this.loc, rt.rsc("sound/weapons/slashmiss.ogg"), 50, 1, -1);
			this.visible_message(`<span class='danger'>${M} has lunged at ${this}!</span>`, `<span class='userdanger'>${M} has lunged at ${this}!</span>`);
			return 0;
		}
		if (!(affecting = this.get_bodypart(ran_zone(M.zone_selected)))) {
			affecting = this.get_bodypart("chest");
		}
		armor_block = this.run_armor_check(affecting, "melee", "", "", 10);
		playsound(this.loc, rt.rsc("sound/weapons/slice.ogg"), 25, 1, -1);
		this.visible_message(`<span class='danger'>${M} has slashed at ${this}!</span>`, `<span class='userdanger'>${M} has slashed at ${this}!</span>`);
		add_logs(M, this, "attacked");
		if (!(yield* this.dismembering_strike(M, M.zone_selected))) {
			return 1;
		}
		yield* this.apply_damage(damage, "brute", affecting, armor_block);
		yield* this.damage_clothes(damage, "brute", "melee", affecting.body_zone);
	}
	if (M.a_intent != "disarm") return f.dot;
	if (this.get_active_held_item() && (yield* this.drop_item())) {
		playsound(this.loc, rt.rsc("sound/weapons/slash.ogg"), 25, 1, -1);
		this.visible_message(`<span class='danger'>${M} disarmed ${this}!</span>`, `<span class='userdanger'>${M} disarmed ${this}!</span>`);
	} else {
		playsound(this.loc, rt.rsc("sound/weapons/pierce.ogg"), 25, 1, -1);
		yield* this.Knockdown(100);
		add_logs(M, this, "tackled");
		this.visible_message(`<span class='danger'>${M} has tackled down ${this}!</span>`, `<span class='userdanger'>${M} has tackled down ${this}!</span>`);
	}
	return f.dot;
}, true);

// human_defense.dm:271
rt.def("/mob/living/carbon/human/proc/attack_larva", function* attack_larva(f: Frame, L: Value) {
	let affecting: Value = null;
	if (!(yield* parent_proc())) return f.dot;
	let damage: Value = rand(1, 3);
	if (yield* this.check_shields(L, damage, `the ${L.name}`)) {
		return 0;
	}
	if (this.stat == 2) return f.dot;
	L.amount_grown = min(L.amount_grown + damage, L.max_grown);
	if (!(affecting = this.get_bodypart(ran_zone(L.zone_selected)))) {
		affecting = this.get_bodypart("chest");
	}
	let armor_block: Value = this.run_armor_check(affecting, "melee");
	yield* this.apply_damage(damage, "brute", affecting, armor_block);
	yield* this.damage_clothes(damage, "brute", "melee", affecting.body_zone);
	return f.dot;
}, true);

// human_defense.dm:286
rt.def("/mob/living/carbon/human/proc/attack_animal", function* attack_animal(f: Frame, M: Value) {
	let dam_zone: Value = null, affecting: Value = null;
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	let damage: Value = rand(M.melee_damage_lower, M.melee_damage_upper);
	if (yield* this.check_shields(M, damage, `the ${M.name}`, 1, M.armour_penetration)) {
		return 0;
	}
	if (!(dam_zone = (yield* this.dismembering_strike(M, pick("chest", "l_hand", "r_hand", "l_leg", "r_leg"))))) {
		return 1;
	}
	if (!(affecting = this.get_bodypart(ran_zone(dam_zone)))) {
		affecting = this.get_bodypart("chest");
	}
	let armor: Value = (yield* this.run_armor_check(affecting, "melee", { armour_penetration: M.armour_penetration }));
	yield* this.apply_damage(damage, M.melee_damage_type, affecting, armor);
	yield* this.damage_clothes(damage, M.melee_damage_type, "melee", affecting.body_zone);
	return f.dot;
}, true);

// human_defense.dm:303
rt.def("/mob/living/carbon/human/proc/attack_slime", function* attack_slime(f: Frame, M: Value) {
	let dam_zone: Value = null, affecting: Value = null;
	if (!(yield* parent_proc())) return f.dot;
	let damage: Value = rand(5, 25);
	if (M.is_adult) {
		damage = rand(10, 35);
	}
	if (yield* this.check_shields(M, damage, `the ${M.name}`)) {
		return 0;
	}
	if (!(dam_zone = (yield* this.dismembering_strike(M, pick("head", "chest", "l_arm", "r_arm", "l_leg", "r_leg"))))) {
		return 1;
	}
	if (!(affecting = this.get_bodypart(ran_zone(dam_zone)))) {
		affecting = this.get_bodypart("chest");
	}
	let armor_block: Value = this.run_armor_check(affecting, "melee");
	yield* this.apply_damage(damage, "brute", affecting, armor_block);
	yield* this.damage_clothes(damage, "brute", "melee", affecting.body_zone);
	return f.dot;
}, true);

// human_defense.dm:324
rt.def("/mob/living/carbon/human/proc/mech_melee_attack", function* mech_melee_attack(f: Frame, M: Value) {
	let temp: Value = null, update: Value = null, dmg: Value = null;
	if (M.occupant.a_intent == "harm") {
		yield* M.do_attack_animation(this);
		if (M.damtype == "brute") {
			yield* step_away(this, M, 15);
		}
		if (temp = this.get_bodypart(pick("chest", "chest", "chest", "head"))) {
			update = 0;
			dmg = rand(M.force / 2, M.force);
			if (M.damtype === "brute") {
				if (M.force > 20) {
					yield* this.Unconscious(20);
				}
				(update = rt.modify(update, (yield* temp.receive_damage(dmg, 0)), rt.bitOr));
				playsound(this, rt.rsc("sound/weapons/punch4.ogg"), 50, 1);
				yield* this.damage_clothes(dmg, "brute", "melee", temp.body_zone);
			} else if (M.damtype === "fire") {
				(update = rt.modify(update, (yield* temp.receive_damage(0, dmg)), rt.bitOr));
				playsound(this, rt.rsc("sound/items/welder.ogg"), 50, 1);
				yield* this.damage_clothes(dmg, "fire", "melee", temp.body_zone);
			} else if (M.damtype === "tox") {
				yield* M.mech_toxin_damage(this);
			} else {
				return f.dot;
			}
			if (update) {
				this.update_damage_overlays();
			}
			yield* this.updatehealth();
		}
		this.visible_message(`<span class='danger'>${M.name} has hit ${this}!</span>`, `<span class='userdanger'>${M.name} has hit ${this}!</span>`, null, 3);
		add_logs(M.occupant, this, "attacked", M, `(INTENT: ${uppertext(M.occupant.a_intent)}) (DAMTYPE: ${uppertext(M.damtype)})`);
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// human_defense.dm:361
rt.def("/mob/living/carbon/human/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value, origin: Value) {
	let throw_target: Value = null, X: Value = null, BP: Value = null;
	let $e: any;
	if (origin && rt.istype(origin, T("/datum/spacevine_mutation")) && isvineimmune(this)) {
		return f.dot;
	}
	yield* parent_proc();
	let b_loss: Value = 0;
	let f_loss: Value = 0;
	let bomb_armor: Value = this.getarmor(null, "bomb");
	if (severity === 1) {
		if (prob(bomb_armor)) {
			b_loss = 500;
			yield* this.throw_at((throw_target = get_edge_target_turf(this, rt.getDir(f, this, get_step_away(this, this)))), 200, 4);
			yield* this.damage_clothes(400 - bomb_armor, "brute", "bomb");
		} else {
			yield* this.gib();
			return f.dot;
		}
	} else if (severity === 2) {
		b_loss = 60;
		f_loss = 60;
		if (bomb_armor) {
			f_loss = (b_loss = 30 * (2 - round(bomb_armor * 0.01, 0.05)));
		}
		yield* this.damage_clothes(200 - bomb_armor, "brute", "bomb");
		if (!rt.istype(this.ears, T("/obj/item/clothing/ears/earmuffs"))) {
			this.adjustEarDamage(30, 120);
		}
		if (prob(max(70 - bomb_armor * 0.5, 0))) {
			yield* this.Unconscious(200);
		}
	} else if (severity === 3) {
		b_loss = 30;
		if (bomb_armor) {
			b_loss = 15 * (2 - round(bomb_armor * 0.01, 0.05));
		}
		yield* this.damage_clothes(max(50 - bomb_armor, 0), "brute", "bomb");
		if (!rt.istype(this.ears, T("/obj/item/clothing/ears/earmuffs"))) {
			this.adjustEarDamage(15, 60);
		}
		if (prob(max(50 - bomb_armor * 0.5, 0))) {
			yield* this.Unconscious(160);
		}
	}
	yield* this.take_overall_damage(b_loss, f_loss);
	if (!(severity <= 2 || !bomb_armor)) return f.dot;
	let max_limb_loss: Value = round(4 / severity);
	for (X of each(this.bodyparts)) {
		BP = X;
		if (prob(50 / severity) && !prob(this.getarmor(BP, "bomb")) && BP.body_zone != "head" && BP.body_zone != "chest") {
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

// human_defense.dm:417
rt.def("/mob/living/carbon/human/proc/blob_act", function* blob_act(f: Frame, B: Value) {
	if (this.stat == 2) {
		return f.dot;
	}
	this.show_message("<span class='userdanger'>The blob attacks you!</span>");
	let dam_zone: Value = pick("chest", "l_hand", "r_hand", "l_leg", "r_leg");
	let affecting: Value = this.get_bodypart(ran_zone(dam_zone));
	yield* this.apply_damage(5, "brute", affecting, this.run_armor_check(affecting, "melee"));
	return f.dot;
}, true);

// human_defense.dm:430
rt.def("/mob/living/carbon/human/proc/electrocute_act", function* electrocute_act(f: Frame, shock_damage: Value, source: Value, siemens_coeff: Value, safety: Value, override: Value, tesla_shock: Value, illusion: Value, stun: Value) {
	let total_coeff: Value = null, G: Value = null, S: Value = null, gloves_siemens_coeff: Value = null, heart: Value = null;
	siemens_coeff ??= 1;
	safety ??= 0;
	override ??= 0;
	tesla_shock ??= 0;
	illusion ??= 0;
	stun ??= 1;
	if (tesla_shock) {
		total_coeff = 1;
		if (this.gloves) {
			if ((G = this.gloves).siemens_coefficient <= 0) {
				total_coeff -= 0.5;
			}
		}
		if (this.wear_suit) {
			if ((S = this.wear_suit).siemens_coefficient <= 0) {
				total_coeff -= 0.95;
			} else if (S.siemens_coefficient == -1) {
				total_coeff -= 1;
			}
		}
		siemens_coeff = total_coeff;
		if (this.secondary_flags ? rt.index(this.secondary_flags, "tesla_ignore") : 0) {
			siemens_coeff = 0;
		}
	} else if (!safety) {
		gloves_siemens_coeff = 1;
		if (this.gloves) {
			gloves_siemens_coeff = (G = this.gloves).siemens_coefficient;
		}
		siemens_coeff = gloves_siemens_coeff;
	}
	if (this.undergoing_cardiac_arrest() && !illusion) {
		if (shock_damage * siemens_coeff >= 1 && prob(25)) {
			(heart = this.getorganslot("heart")).beating = 1;
			if (this.stat == 0) {
				to_chat(this, "<span class='notice'>You feel your heart beating again!</span>");
			}
		}
	}
	f.dot = (yield* parent_proc(shock_damage, source, siemens_coeff, safety, override, tesla_shock, illusion, stun));
	if (!f.dot) return f.dot;
	yield* this.electrocution_animation(40);
	return f.dot;
}, true);

// human_defense.dm:461
rt.def("/mob/living/carbon/human/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	let L: Value = null;
	let $e: any;
	let informed: Value = 0;
	for (L of each(this.bodyparts, T("/obj/item/bodypart"))) {
		if (L.status == BODYPART_ROBOTIC) {
			if (!informed) {
				to_chat(this, "<span class='userdanger'>You feel a sharp pain as your robotic limbs overload.</span>");
				informed = 1;
			}
			if (severity === 1) {
				yield* L.receive_damage(0, 10);
				yield* this.Stun(200);
			} else if (severity === 2) {
				yield* L.receive_damage(0, 5);
				yield* this.Stun(100);
			}
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// human_defense.dm:476
rt.def("/mob/living/carbon/human/proc/acid_act", function* acid_act(f: Frame, acidpwr: Value, acid_volume: Value, bodyzone_hit: Value) {
	let head_clothes: Value = null, chest_clothes: Value = null, arm_clothes: Value = null, leg_clothes: Value = null, affecting: Value = null, I: Value = null;
	let damaged: Value = list();
	let inventory_items_to_kill: Value = list();
	let acidity: Value = acidpwr * min(acid_volume * 0.005, 0.1);
	if (!bodyzone_hit || bodyzone_hit == "head") {
		if (this.glasses) {
			head_clothes = this.glasses;
		}
		if (this.wear_mask) {
			head_clothes = this.wear_mask;
		}
		if (this.wear_neck) {
			head_clothes = this.wear_neck;
		}
		if (this.head) {
			head_clothes = this.head;
		}
		if (head_clothes) {
			if (!rt.bitAnd(head_clothes.resistance_flags, UNACIDABLE)) {
				yield* head_clothes.acid_act(acidpwr, acid_volume);
				this.update_inv_glasses();
				yield* this.update_inv_wear_mask();
				this.update_inv_neck();
				yield* this.update_inv_head();
			} else {
				to_chat(this, `<span class='notice'>Your ${head_clothes.name} protects your head and face from the acid!</span>`);
			}
		} else {
			f.dot = this.get_bodypart("head");
			if (f.dot) {
				damaged += f.dot;
			}
			if (this.ears) {
				inventory_items_to_kill += this.ears;
			}
		}
	}
	if (!bodyzone_hit || bodyzone_hit == "chest") {
		if (this.w_uniform) {
			chest_clothes = this.w_uniform;
		}
		if (this.wear_suit) {
			chest_clothes = this.wear_suit;
		}
		if (chest_clothes) {
			if (!rt.bitAnd(chest_clothes.resistance_flags, UNACIDABLE)) {
				yield* chest_clothes.acid_act(acidpwr, acid_volume);
				yield* this.update_inv_w_uniform();
				yield* this.update_inv_wear_suit();
			} else {
				to_chat(this, `<span class='notice'>Your ${chest_clothes.name} protects your body from the acid!</span>`);
			}
		} else {
			f.dot = this.get_bodypart("chest");
			if (f.dot) {
				damaged += f.dot;
			}
			if (this.wear_id) {
				inventory_items_to_kill += this.wear_id;
			}
			if (this.r_store) {
				inventory_items_to_kill += this.r_store;
			}
			if (this.l_store) {
				inventory_items_to_kill += this.l_store;
			}
			if (this.s_store) {
				inventory_items_to_kill += this.s_store;
			}
		}
	}
	if (!bodyzone_hit || bodyzone_hit == "l_arm" || bodyzone_hit == "r_arm") {
		if (this.gloves) {
			arm_clothes = this.gloves;
		}
		if (this.w_uniform && (rt.bitAnd(this.w_uniform.body_parts_covered, HANDS) || rt.bitAnd(this.w_uniform.body_parts_covered, ARMS))) {
			arm_clothes = this.w_uniform;
		}
		if (this.wear_suit && (rt.bitAnd(this.wear_suit.body_parts_covered, HANDS) || rt.bitAnd(this.wear_suit.body_parts_covered, ARMS))) {
			arm_clothes = this.wear_suit;
		}
		if (arm_clothes) {
			if (!rt.bitAnd(arm_clothes.resistance_flags, UNACIDABLE)) {
				yield* arm_clothes.acid_act(acidpwr, acid_volume);
				this.update_inv_gloves();
				yield* this.update_inv_w_uniform();
				yield* this.update_inv_wear_suit();
			} else {
				to_chat(this, `<span class='notice'>Your ${arm_clothes.name} protects your arms and hands from the acid!</span>`);
			}
		} else {
			f.dot = this.get_bodypart("r_arm");
			if (f.dot) {
				damaged += f.dot;
			}
			f.dot = this.get_bodypart("l_arm");
			if (f.dot) {
				damaged += f.dot;
			}
		}
	}
	if (!bodyzone_hit || bodyzone_hit == "l_leg" || bodyzone_hit == "r_leg" || bodyzone_hit == "feet") {
		if (this.shoes) {
			leg_clothes = this.shoes;
		}
		if (this.w_uniform && (rt.bitAnd(this.w_uniform.body_parts_covered, FEET) || bodyzone_hit != "feet" && rt.bitAnd(this.w_uniform.body_parts_covered, LEGS))) {
			leg_clothes = this.w_uniform;
		}
		if (this.wear_suit && (rt.bitAnd(this.wear_suit.body_parts_covered, FEET) || bodyzone_hit != "feet" && rt.bitAnd(this.wear_suit.body_parts_covered, LEGS))) {
			leg_clothes = this.wear_suit;
		}
		if (leg_clothes) {
			if (!rt.bitAnd(leg_clothes.resistance_flags, UNACIDABLE)) {
				yield* leg_clothes.acid_act(acidpwr, acid_volume);
				this.update_inv_shoes();
				yield* this.update_inv_w_uniform();
				yield* this.update_inv_wear_suit();
			} else {
				to_chat(this, `<span class='notice'>Your ${leg_clothes.name} protects your legs and feet from the acid!</span>`);
			}
		} else {
			f.dot = this.get_bodypart("r_leg");
			if (f.dot) {
				damaged += f.dot;
			}
			f.dot = this.get_bodypart("l_leg");
			if (f.dot) {
				damaged += f.dot;
			}
		}
	}
	for (affecting of each(damaged, T("/obj/item/bodypart"))) {
		yield* affecting.receive_damage(acidity, 2 * acidity);
		if (affecting.name == "head") {
			if (prob(min(acidpwr * acid_volume / 10, 90))) {
				yield* affecting.receive_damage(acidity, 2 * acidity);
				yield* this.emote("scream");
				this.facial_hair_style = "Shaved";
				this.hair_style = "Bald";
				yield* this.update_hair();
				(rt.modSrcVar(f, "status_flags", DISFIGURED, rt.bitOr));
			}
		}
		this.update_damage_overlays();
	}
	if (!bodyzone_hit) {
		if (this.back) {
			inventory_items_to_kill += this.back;
		}
		if (this.belt) {
			inventory_items_to_kill += this.belt;
		}
		inventory_items_to_kill += this.held_items;
	}
	for (I of each(inventory_items_to_kill, T("/obj/item"))) {
		yield* I.acid_act(acidpwr, acid_volume);
	}
	return 1;
}, true);

// human_defense.dm:619
rt.def("/mob/living/carbon/human/proc/singularity_act", function* singularity_act(f: Frame) {
	let gain: Value = 20;
	if (this.mind) {
		if (this.mind.assigned_role == "Station Engineer" || this.mind.assigned_role == "Chief Engineer") {
			gain = 100;
		}
		if (this.mind.assigned_role == "Clown") {
			gain = rand(-300, 300);
		}
	}
	this.investigate_log(`(${key_name(this)}) has been consumed by the singularity.`, "singulo");
	yield* this.gib();
	return gain;
}, true);

// human_defense.dm:628
rt.def("/mob/living/carbon/human/proc/help_shake_act", function* help_shake_act(f: Frame, M: Value) {
	let missing: Value = null, X: Value = null, LB: Value = null, status: Value = null, brutedamage: Value = null, burndamage: Value = null, I: Value = null, t: Value = null;
	let $e: any;
	if (!rt.istype(M, T("/mob/living/carbon"))) {
		return f.dot;
	}
	if (!(this.health >= 0)) return f.dot;
	if (this == M) {
		this.visible_message(`${this} examines ${this.p_them()}self.`, "<span class='notice'>You check yourself for injuries.</span>");
		missing = list("head", "chest", "l_arm", "r_arm", "l_leg", "r_leg");
		for (X of each(this.bodyparts)) {
			missing -= (LB = X).body_zone;
			status = "";
			brutedamage = LB.brute_dam;
			burndamage = LB.burn_dam;
			if (this.hallucination) {
				if (prob(30)) {
					brutedamage += rand(30, 40);
				}
				if (prob(30)) {
					burndamage += rand(30, 40);
				}
			}
			if (brutedamage > 0) {
				status = "bruised";
			}
			if (brutedamage > 20) {
				status = "battered";
			}
			if (brutedamage > 40) {
				status = "mangled";
			}
			if (brutedamage > 0 && burndamage > 0) {
				status += " and ";
			}
			if (burndamage > 40) {
				status += "peeling away";
			} else if (burndamage > 10) {
				status += "blistered";
			} else if (burndamage > 0) {
				status += "numb";
			}
			if (status == "") {
				status = "OK";
			}
			to_chat(this, `\t <span class='${status == "OK" ? "notice" : "warning"}'>Your ${LB.name} is ${status}.</span>`);
			I = null;
			for (I of each(LB.embedded_objects, T("/obj/item"))) {
				to_chat(this, fmt("\t <a href='?src=＃;embedded_object=＃;embedded_limb=＃' class='warning'>There is ＇！ embedded in your ＀!</a>", [this, I, LB, I, LB.name]));
			}
		}
		for (t of each(missing)) {
			to_chat(this, `<span class='boldannounce'>Your ${parse_zone(t)} is missing!</span>`);
		}
		if (this.bleed_rate) {
			to_chat(this, "<span class='danger'>You are bleeding!</span>");
		}
		if (this.staminaloss) {
			if (this.staminaloss > 30) {
				to_chat(this, "<span class='info'>You're completely exhausted.</span>");
			} else {
				to_chat(this, "<span class='info'>You feel fatigued.</span>");
			}
		}
	} else {
		if (this.wear_suit) {
			yield* this.wear_suit.add_fingerprint(M);
		} else if (this.w_uniform) {
			yield* this.w_uniform.add_fingerprint(M);
		}
		yield* parent_proc();
	}
	return f.dot;
}, true);

// human_defense.dm:691
rt.def("/mob/living/carbon/human/proc/damage_clothes", function* damage_clothes(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value, def_zone: Value) {
	let head_clothes: Value = null, chest_clothes: Value = null, arm_clothes: Value = null, leg_clothes: Value = null, I: Value = null;
	damage_type ??= "brute";
	damage_flag ??= 0;
	if (damage_type != "brute" && damage_type != "fire") {
		return f.dot;
	}
	damage_amount *= 0.5;
	let torn_items: Value = list();
	if (!def_zone || def_zone == "head") {
		if (this.glasses) {
			head_clothes = this.glasses;
		}
		if (this.wear_mask) {
			head_clothes = this.wear_mask;
		}
		if (this.wear_neck) {
			head_clothes = this.wear_neck;
		}
		if (this.head) {
			head_clothes = this.head;
		}
		if (head_clothes) {
			torn_items += head_clothes;
		} else if (this.ears) {
			torn_items += this.ears;
		}
	}
	if (!def_zone || def_zone == "chest") {
		if (this.w_uniform) {
			chest_clothes = this.w_uniform;
		}
		if (this.wear_suit) {
			chest_clothes = this.wear_suit;
		}
		if (chest_clothes) {
			torn_items += chest_clothes;
		}
	}
	if (!def_zone || def_zone == "l_arm" || def_zone == "r_arm") {
		if (this.gloves) {
			arm_clothes = this.gloves;
		}
		if (this.w_uniform && (rt.bitAnd(this.w_uniform.body_parts_covered, HANDS) || rt.bitAnd(this.w_uniform.body_parts_covered, ARMS))) {
			arm_clothes = this.w_uniform;
		}
		if (this.wear_suit && (rt.bitAnd(this.wear_suit.body_parts_covered, HANDS) || rt.bitAnd(this.wear_suit.body_parts_covered, ARMS))) {
			arm_clothes = this.wear_suit;
		}
		if (arm_clothes) {
			torn_items += arm_clothes;
		}
	}
	if (!def_zone || def_zone == "l_leg" || def_zone == "r_leg") {
		if (this.shoes) {
			leg_clothes = this.shoes;
		}
		if (this.w_uniform && (rt.bitAnd(this.w_uniform.body_parts_covered, FEET) || rt.bitAnd(this.w_uniform.body_parts_covered, LEGS))) {
			leg_clothes = this.w_uniform;
		}
		if (this.wear_suit && (rt.bitAnd(this.wear_suit.body_parts_covered, FEET) || rt.bitAnd(this.wear_suit.body_parts_covered, LEGS))) {
			leg_clothes = this.wear_suit;
		}
		if (leg_clothes) {
			torn_items += leg_clothes;
		}
	}
	for (I of each(torn_items, T("/obj/item"))) {
		yield* I.take_damage(damage_amount, damage_type, damage_flag, 0);
	}
	return f.dot;
}, true);
