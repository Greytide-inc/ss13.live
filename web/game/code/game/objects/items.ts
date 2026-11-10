// Based on /tg/station's code/game/objects/items.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


// items.dm:1
rt.def("/datum/controller/global_vars/proc/InitGlobalfire_overlay", function InitGlobalfire_overlay(f: Frame) {
	GLOB.fire_overlay = mutable_appearance(rt.rsc("icons/effects/fire.dmi"), "fire");
	this.gvars_datum_init_order += "fire_overlay";
	return f.dot;
});

// items.dm:3
rt.def("/datum/controller/global_vars/proc/InitGlobalrpg_loot_items", function InitGlobalrpg_loot_items(f: Frame) {
	GLOB.rpg_loot_items = 0;
	this.gvars_datum_init_order += "rpg_loot_items";
	return f.dot;
});

rt.type(5108, "/obj/item", "/obj", {
	canMouseDown: 0,
	item_state: null,
	lefthand_file: rt.rsc("icons/mob/inhands/items_lefthand.dmi"),
	righthand_file: rt.rsc("icons/mob/inhands/items_righthand.dmi"),
	worn_x_dimension: 32,
	worn_y_dimension: 32,
	inhand_x_dimension: 32,
	inhand_y_dimension: 32,
	alternate_worn_icon: null,
	alternate_worn_layer: null,
	hitsound: null,
	usesound: null,
	throwhitsound: null,
	w_class: 3,
	slot_flags: 0,
	master: null,
	heat_protection: 0,
	cold_protection: 0,
	max_heat_protection_temperature: null,
	min_cold_protection_temperature: null,
	actions: null,
	actions_types: null,
	flags_inv: null,
	item_color: null,
	body_parts_covered: 0,
	gas_transfer_coefficient: 1,
	permeability_coefficient: 1,
	siemens_coefficient: 1,
	slowdown: 0,
	armour_penetration: 0,
	allowed: null,
	hidden_uplink: null,
	equip_delay_self: 0,
	equip_delay_other: 20,
	strip_delay: 40,
	breakouttime: 0,
	materials: null,
	origin_tech: null,
	needs_permit: 0,
	attack_verb: null,
	species_exception: null,
	suittoggled: 0,
	hooded: 0,
	thrownby: null,
	embed_chance: 45,
	embedded_fall_chance: 5,
	embedded_pain_chance: 15,
	embedded_pain_multiplier: 2,
	embedded_fall_pain_multiplier: 5,
	embedded_impact_pain_multiplier: 4,
	embedded_unsafe_removal_pain_multiplier: 8,
	embedded_unsafe_removal_time: 30,
	flags_cover: 0,
	heat: 0,
	sharpness: 0,
	toolspeed: 1,
	block_chance: 0,
	hit_reaction_chance: 0,
	reach: 1,
	slot_equipment_priority: null,
	dog_fashion: null,
	rpg_loot: null,
	in_inventory: 0,
	force_string: null,
	last_force_string_check: 0,
	tip_timer: null,
	force_string_override: null,
	pass_flags: 1,
	pressure_resistance: 4,
	name: "item",
	icon: rt.rsc("icons/obj/items.dmi"),
	obj_integrity: 200,
	max_integrity: 200,
	mouse_drag_pointer: 1,
});

// items.dm:118
rt.def("/obj/item/proc/Initialize", function* Initialize(f: Frame) {
	let path: Value = null;
	if (!this.materials) {
		this.materials = list();
	}
	f.dot = (yield* parent_proc());
	for (path of each(this.actions_types)) {
		yield* new_(path, this);
	}
	this.actions_types = null;
	if (GLOB.rpg_loot_items) {
		this.rpg_loot = (yield* new_(T("/datum/rpg_loot"), this));
	}
	if (!this.force_string) return f.dot;
	this.force_string_override = 1;
	return f.dot;
}, true);

// items.dm:132
rt.def("/obj/item/proc/Destroy", function* Destroy(f: Frame) {
	let m: Value = null, X: Value = null;
	(rt.modSrcVar(f, "flags", 16760831, rt.bitAnd));
	if (ismob(this.loc)) {
		yield* (m = this.loc).temporarilyRemoveItemFromInventory(this, 1);
	}
	for (X of each(this.actions)) {
		yield* qdel(X);
	}
	yield* qdel(this.rpg_loot);
	this.rpg_loot = null;
	return (yield* parent_proc());
}, true);

// items.dm:145
rt.def("/obj/item/proc/check_allowed_items", function check_allowed_items(f: Frame, target: Value, not_inside: Value, target_self: Value) {
	if (rt.isIn(f, this, target) && !target_self || !isturf(target.loc) && !isturf(target) && not_inside) {
		return 0;
	} else {
		return 1;
	}
});

// items.dm:151
rt.def("/obj/item/proc/blob_act", function* blob_act(f: Frame, B: Value) {
	if (!(B && B.loc == this.loc)) return f.dot;
	yield* qdel(this);
	return f.dot;
}, true);

// items.dm:169
rt.def("/obj/item/verb/move_to_top", function move_to_top(f: Frame) {
	if (!isturf(this.loc) || f.usr.stat || f.usr.restrained() || !f.usr.canmove) {
		return f.dot;
	}
	let _T: Value = this.loc;
	this.loc = null;
	this.loc = _T;
	return f.dot;
}, false, { verb: { name: "Move To Top", category: "Object", src: 3, range: 1 } });

// items.dm:179
rt.def("/obj/item/proc/examine", function examine(f: Frame, user: Value) {
	let pronoun: Value = null, techlvls: Value = null, _T: Value = null, mat: Value = null;
	parent_proc();
	if (this.gender == "plural") {
		pronoun = "They are";
	} else {
		pronoun = "It is";
	}
	let size: Value = weightclass2text(this.w_class);
	to_chat(user, `${pronoun} a ${size} item.`);
	if (!user.research_scanner) return f.dot;
	let msg: Value = "*--------* <BR>";
	if (this.origin_tech) {
		msg += "<span class='notice'>Testing potentials:</span><BR>";
		techlvls = params2list(this.origin_tech);
		for (_T of each(techlvls)) {
			msg += `Tech: ${CallTechName(_T)} | magnitude: ${rt.index(techlvls, _T)} <BR>`;
		}
	} else {
		msg += "<span class='danger'>No tech origins detected.</span><BR>";
	}
	if (rt.len(f, this.materials)) {
		msg += "<span class='notice'>Extractable materials:<BR>";
		for (mat of each(this.materials)) {
			msg += `${CallMaterialName(mat)}<BR>`;
		}
	} else {
		msg += "<span class='danger'>No extractable materials detected.</span><BR>";
	}
	msg += "*--------*";
	to_chat(user, msg);
	return f.dot;
}, false);

// items.dm:211
rt.def("/obj/item/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	yield* this.interact(user);
	return f.dot;
}, true);

// items.dm:214
rt.def("/obj/item/proc/interact", function* interact(f: Frame, user: Value) {
	yield* this.add_fingerprint(user);
	if (this.hidden_uplink && this.hidden_uplink.active) {
		yield* this.hidden_uplink.interact(user);
		return 1;
	}
	yield* this.ui_interact(user);
	return f.dot;
}, true);

// items.dm:221
rt.def("/obj/item/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	yield* this.add_fingerprint(f.usr);
	return (yield* parent_proc());
}, true);

// items.dm:225
rt.def("/obj/item/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let C: Value = null, affecting: Value = null, S: Value = null;
	let $0: any, $1: any;
	if (!user) {
		return f.dot;
	}
	if (this.anchored) {
		return f.dot;
	}
	if (rt.bitAnd(this.resistance_flags, 8)) {
		if (rt.istype((C = user), T("/mob/living/carbon"))) {
			if (C.gloves && C.gloves.max_heat_protection_temperature > 360) {
				yield* this.extinguish();
				to_chat(user, `<span class='notice'>You put out the fire on ${this}.</span>`);
			} else {
				to_chat(user, `<span class='warning'>You burn your hand on ${this}!</span>`);
				$0 = C;
				if (user.active_hand_index % 2 == 0) {
					$1 = "r";
				} else {
					$1 = "l";
				}
				if ((affecting = $0.get_bodypart(`${$1}_arm`)) && (yield* affecting.receive_damage(0, 5))) {
					C.update_damage_overlays();
				}
				return f.dot;
			}
		} else {
			yield* this.extinguish();
		}
	}
	if (this.acid_level > 20 && !ismob(this.loc)) {
		if (rt.istype((C = user), T("/mob/living/carbon"))) {
			if (!C.gloves || !rt.bitAnd(C.gloves.resistance_flags, 48)) {
				to_chat(user, `<span class='warning'>The acid on ${this} burns your hand!</span>`);
				$0 = C;
				if (user.active_hand_index % 2 == 0) {
					$1 = "r";
				} else {
					$1 = "l";
				}
				if ((affecting = $0.get_bodypart(`${$1}_arm`)) && (yield* affecting.receive_damage(0, 5))) {
					C.update_damage_overlays();
				}
			}
		}
	}
	if (rt.istype(this.loc, T("/obj/item/weapon/storage"))) {
		yield* (S = this.loc).remove_from_storage(this, user.loc);
	}
	if (this.throwing) {
		yield* this.throwing.finalize(0);
	}
	if (this.loc == user) {
		if (!(yield* user.dropItemToGround(this))) {
			return f.dot;
		}
	}
	yield* this.pickup(user);
	yield* this.add_fingerprint(user);
	let pickup_from: Value = isturf(this.loc) ? this.loc : null;
	if (!(yield* user.put_in_active_hand(this))) {
		yield* this.dropped(user);
	} else {
		if (!pickup_from) return f.dot;
		yield* this.do_pickup_animation(user, pickup_from);
	}
	return f.dot;
}, true);

// items.dm:276
rt.def("/obj/item/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	let S: Value = null;
	if (!user) {
		return f.dot;
	}
	if (this.anchored) {
		return f.dot;
	}
	if (rt.istype(this.loc, T("/obj/item/weapon/storage"))) {
		yield* (S = this.loc).remove_from_storage(this, user.loc);
	}
	if (this.throwing) {
		yield* this.throwing.finalize(0);
	}
	if (this.loc == user) {
		if (!(yield* user.dropItemToGround(this))) {
			return f.dot;
		}
	}
	yield* this.pickup(user);
	yield* this.add_fingerprint(user);
	let pickup_from: Value = isturf(this.loc) ? this.loc : null;
	if (!(yield* user.put_in_active_hand(this))) {
		yield* this.dropped(user);
	} else {
		if (!pickup_from) return f.dot;
		yield* this.do_pickup_animation(user, pickup_from);
	}
	return f.dot;
}, true);

// items.dm:300
rt.def("/obj/item/proc/attack_alien", function* attack_alien(f: Frame, user: Value) {
	let A: Value = null;
	if (!(A = user).has_fine_manipulation) {
		if (rt.isIn(f, this, A.contents)) {
			yield* A.dropItemToGround(this);
		}
		to_chat(user, "<span class='warning'>Your claws aren't capable of such fine manipulation!</span>");
		return f.dot;
	}
	yield* this.attack_paw(A);
	return f.dot;
}, true);

// items.dm:310
rt.def("/obj/item/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	let R: Value = null;
	if (!rt.istype(this.loc, T("/obj/item/weapon/robot_module"))) return f.dot;
	if (!rt.istype(user, T("/mob/living/silicon/robot"))) {
		return f.dot;
	}
	if ((R = user).low_power_mode) return f.dot;
	yield* R.activate_module(this);
	R.hud_used.update_robot_modules_display();
	return f.dot;
}, true);

// items.dm:323
rt.def("/obj/item/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let S: Value = null, rejections: Value = null, things: Value = null, len: Value = null, progress: Value = null;
	if (!rt.istype(W, T("/obj/item/weapon/storage"))) return f.dot;
	if (!(S = W).use_to_pickup) return f.dot;
	if (S.collection_mode) {
		if (isturf(this.loc)) {
			rejections = list();
			things = (yield* this.loc.contents.Copy());
			if (S.collection_mode == 2) {
				things = typecache_filter_list(things, typecacheof(this.type));
			}
			if (!(len = rt.len(f, things))) {
				to_chat(user, `<span class='notice'>You failed to pick up anything with ${S}.</span>`);
				return f.dot;
			}
			progress = (yield* new_(T("/datum/progressbar"), user, len, this.loc));
			while (yield* do_after(user, 10, 1, S, 0, (yield* new_(T("/datum/callback"), this, P("/obj/item/proc/handle_mass_pickup"), S, things, this.loc, rejections, progress)))) {
				yield* sleep(1);
			}
			yield* qdel(progress);
			to_chat(user, `<span class='notice'>You put everything you could ${S.preposition} ${S}.</span>`);
		}
	} else {
		if (!S.can_be_inserted(this)) return f.dot;
		yield* S.handle_item_insertion(this);
	}
	return f.dot;
}, true);

// items.dm:351
rt.def("/obj/item/proc/handle_mass_pickup", function* handle_mass_pickup(f: Frame, S: Value, things: Value, thing_loc: Value, rejections: Value, progress: Value) {
	let I: Value = null;
	for (I of each(things, T("/obj/item"))) {
		things -= I;
		if (I.loc != thing_loc) {
			continue;
		}
		if (rt.isIn(f, I.type, rejections)) {
			continue;
		}
		if (!(yield* S.can_be_inserted(I, { stop_messages: 1 }))) {
			if (rt.len(f, S.contents) >= S.storage_slots) {
				break;
			}
			rejections += I.type;
			continue;
		}
		yield* S.handle_item_insertion(I, 1);
		if (rt.tickUsage(f) > GLOB.current_ticklimit) {
			yield* progress.update(progress.goal - rt.len(f, things));
			return 1;
		}
	}
	yield* progress.update(progress.goal - rt.len(f, things));
	return 0;
}, true, { argTypes: [{ type: 4, path: "/obj/item/weapon/storage" }, { path: "/list" }, { path: "/atom" }, { path: "/list" }, { path: "/datum/progressbar" }] });

// items.dm:375
rt.def("/obj/item/proc/hit_reaction", function hit_reaction(f: Frame, owner: Value, hitby: Value, attack_text: Value, final_block_chance: Value, damage: Value, attack_type: Value) {
	attack_text ??= "the attack";
	final_block_chance ??= 0;
	damage ??= 0;
	attack_type ??= 1;
	if (prob(final_block_chance)) {
		owner.visible_message(`<span class='danger'>${owner} blocks ${attack_text} with ${this}!</span>`);
		return 1;
	}
	return 0;
});

// items.dm:384
rt.def("/obj/item/proc/dropped", function* dropped(f: Frame, user: Value) {
	let X: Value = null, A: Value = null;
	for (X of each(this.actions)) {
		yield* (A = X).Remove(user);
	}
	if (rt.bitAnd(DROPDEL, this.flags)) {
		yield* qdel(this);
	}
	this.in_inventory = 0;
	return f.dot;
}, true);

// items.dm:394
rt.def("/obj/item/proc/do_pickup_animation", function* do_pickup_animation(f: Frame, target: Value, from: Value) {
	let I: Value = null, M: Value = null;
	if (!target || !from) {
		return f.dot;
	}
	(I = (yield* image({ icon: this.icon, icon_state: this.icon_state, loc: from, layer: ABOVE_ALL_MOB_LAYER }))).overlays = (yield* this.overlays.Copy());
	I.pixel_x = this.pixel_x;
	I.pixel_y = this.pixel_y;
	let to_x: Value = (target.x - from.x) * rt.world().icon_size;
	let to_y: Value = (target.y - from.y) * rt.world().icon_size;
	yield* flick_overlay_view(I, from, 5);
	(M = matrix(I.transform)).Scale(0.65);
	rt.op(f, "Animate", [2, 14], [null, I, "alpha", 175, "pixel_x", to_x, "pixel_y", to_y, "transform", M, "time", 3, "easing", 3]);
	rt.op(f, "Animate", [2, 4], ["alpha", 0, "time", 2]);
	return f.dot;
}, true, { waitfor: false });

// items.dm:411
rt.def("/obj/item/proc/do_drop_animation", function* do_drop_animation(f: Frame, source: Value) {
	let _T: Value = this.loc;
	if (!source || !isturf(_T) || _T == rt.getStep(f, source, 0)) {
		return f.dot;
	}
	yield* sleep(0);
	if (!isturf(this.loc) || this.loc != _T) {
		return f.dot;
	}
	let px: Value = this.pixel_x;
	let py: Value = this.pixel_y;
	this.pixel_x = px + (source.x - _T.x) * rt.world().icon_size;
	this.pixel_y = py + (source.y - _T.y) * rt.world().icon_size;
	rt.op(f, "Animate", [2, 10], [null, this, "pixel_x", px, "pixel_y", py, "time", 3, "easing", 3]);
	return f.dot;
}, true, { waitfor: false });

// items.dm:447
rt.def("/obj/item/proc/equipped", function* equipped(f: Frame, user: Value, slot: Value) {
	let X: Value = null, A: Value = null;
	for (X of each(this.actions)) {
		A = X;
		if (this.item_action_slot_check(slot, user)) {
			yield* A.Grant(user);
		}
	}
	this.in_inventory = 1;
	return f.dot;
}, true);

// items.dm:455
rt.def("/obj/item/proc/item_action_slot_check", function item_action_slot_check(f: Frame, slot: Value, user: Value) {
	if (slot == slot_in_backpack || slot == slot_legcuffed) {
		return 0;
	}
	return 1;
});

// items.dm:464
rt.def("/obj/item/proc/mob_can_equip", function* mob_can_equip(f: Frame, M: Value, equipper: Value, slot: Value, disable_warning: Value, bypass_equip_delay_self: Value) {
	disable_warning ??= 0;
	bypass_equip_delay_self ??= 0;
	if (!M) {
		return 0;
	}
	return (yield* M.can_equip(this, slot, disable_warning, bypass_equip_delay_self));
}, true);

// items.dm:474
rt.def("/obj/item/verb/verb_pickup", function* verb_pickup(f: Frame) {
	if (f.usr.incapacitated() || !this.Adjacent(f.usr) || f.usr.lying) {
		return f.dot;
	}
	if (f.usr.get_active_held_item() !== null) return f.dot;
	yield* f.usr.UnarmedAttack(this);
	return f.dot;
}, true, { verb: { name: "Pick up", category: "Object", src: 3, range: 1 } });

// items.dm:484
rt.def("/obj/item/proc/ui_action_click", function* ui_action_click(f: Frame, user: Value, actiontype: Value) {
	yield* this.attack_self(user);
	return f.dot;
}, true);

// items.dm:492
rt.def("/obj/item/proc/eyestab", function* eyestab(f: Frame, M: Value, user: Value) {
	let H: Value = null, Mo: Value = null, U: Value = null, eyes: Value = null;
	let is_human_victim: Value = 0;
	let affecting: Value = M.get_bodypart("head");
	if (rt.istype(M, T("/mob/living/carbon/human"))) {
		if (!affecting) {
			return f.dot;
		}
		is_human_victim = 1;
		if ((H = M).head && rt.bitAnd(H.head.flags_cover, HEADCOVERSEYES) || H.wear_mask && rt.bitAnd(H.wear_mask.flags_cover, MASKCOVERSEYES) || H.glasses && rt.bitAnd(H.glasses.flags_cover, GLASSESCOVERSEYES)) {
			to_chat(user, "<span class='danger'>You're going to need to remove that mask/helmet/glasses first!</span>");
			return f.dot;
		}
	}
	if (rt.istype(M, T("/mob/living/carbon/monkey"))) {
		if ((Mo = M).wear_mask && rt.bitAnd(Mo.wear_mask.flags_cover, MASKCOVERSEYES)) {
			to_chat(user, "<span class='danger'>You're going to need to remove that mask/helmet/glasses first!</span>");
			return f.dot;
		}
	}
	if (rt.istype(M, T("/mob/living/carbon/alien"))) {
		to_chat(user, "<span class='warning'>You cannot locate any eyes on this creature!</span>");
		return f.dot;
	}
	if (rt.istype(M, T("/mob/living/brain"))) {
		to_chat(user, "<span class='danger'>You cannot locate any organic eyes on this brain!</span>");
		return f.dot;
	}
	yield* this.add_fingerprint(user);
	playsound(this.loc, this.hitsound, 30, 1, -1);
	yield* user.do_attack_animation(M);
	if (M != user) {
		M.visible_message(`<span class='danger'>${user} has stabbed ${M} in the eye with ${this}!</span>`, `<span class='userdanger'>${user} stabs you in the eye with ${this}!</span>`);
	} else {
		user.visible_message(`<span class='danger'>${user} has stabbed themself in the eyes with ${this}!</span>`, `<span class='userdanger'>You stab yourself in the eyes with ${this}!</span>`);
	}
	if (is_human_victim) {
		yield* (U = M).apply_damage(7, "brute", affecting);
	} else {
		yield* M.take_bodypart_damage(7);
	}
	add_logs(user, M, "attacked", `${this.name}`, `(INTENT: ${uppertext(user.a_intent)})`);
	yield* M.adjust_blurriness(3);
	yield* M.adjust_eye_damage(rand(2, 4));
	if (!(eyes = M.getorganslot("eyes_sight"))) {
		return f.dot;
	}
	if (!(eyes.eye_damage >= 10)) return f.dot;
	yield* M.adjust_blurriness(15);
	if (M.stat != 2) {
		to_chat(M, "<span class='danger'>Your eyes start to bleed profusely!</span>");
	}
	if (!rt.bitAnd(M.disabilities, 9)) {
		if (yield* M.become_nearsighted()) {
			to_chat(M, "<span class='danger'>You become nearsighted!</span>");
		}
	}
	if (prob(50)) {
		if (M.stat != 2) {
			if (yield* M.drop_item()) {
				to_chat(M, "<span class='danger'>You drop what you're holding and clutch at your eyes!</span>");
			}
		}
		yield* M.adjust_blurriness(10);
		yield* M.Unconscious(20);
		yield* M.Knockdown(40);
	}
	if (!prob(eyes.eye_damage - 10 + 1)) return f.dot;
	if (!(yield* M.become_blind())) return f.dot;
	to_chat(M, "<span class='danger'>You go blind!</span>");
	return f.dot;
}, true);

// items.dm:567
rt.def("/obj/item/proc/clean_blood", function clean_blood(f: Frame) {
	let blood_splatter_icon: Value = null;
	f.dot = parent_proc();
	if (!f.dot) return f.dot;
	if (!(rt.initial(f, this, "icon") && rt.initial(f, this, "icon_state"))) return f.dot;
	let index: Value = this.blood_splatter_index();
	if (!(blood_splatter_icon = rt.index(GLOB.blood_splatter_icons, index))) return f.dot;
	this.cut_overlay(blood_splatter_icon);
	return f.dot;
});

// items.dm:576
rt.def("/obj/item/clothing/gloves/proc/clean_blood", function clean_blood(f: Frame) {
	f.dot = parent_proc();
	if (!f.dot) return f.dot;
	this.transfer_blood = 0;
	return f.dot;
});

// items.dm:581
rt.def("/obj/item/proc/singularity_pull", function* singularity_pull(f: Frame, S: Value, current_size: Value) {
	if (current_size >= STAGE_FOUR) {
		yield* this.throw_at(S, 14, 3, { spin: 0 });
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// items.dm:586
rt.def("/obj/item/proc/throw_impact", function* throw_impact(f: Frame, A: Value) {
	let L: Value = null;
	if (!(A && !(!A || A.gc_destroyed))) return f.dot;
	if (this.is_hot() && rt.istype(A, T("/mob/living"))) {
		yield* (L = A).IgniteMob();
	}
	let itempush: Value = 1;
	if (this.w_class < 4) {
		itempush = 0;
	}
	return (yield* A.hitby(this, 0, itempush));
}, true, { waitfor: false });

// items.dm:596
rt.def("/obj/item/proc/throw_at", function* throw_at(f: Frame, target: Value, range: Value, speed: Value, thrower: Value, spin: Value, diagonals_first: Value, callback: Value) {
	spin ??= 1;
	diagonals_first ??= 0;
	this.thrownby = thrower;
	callback = (yield* new_(T("/datum/callback"), this, P("/obj/item/proc/after_throw"), callback));
	f.dot = (yield* parent_proc(target, range, speed, thrower, spin, diagonals_first, callback));
	return f.dot;
}, true);

// items.dm:603
rt.def("/obj/item/proc/after_throw", function* after_throw(f: Frame, callback: Value) {
	if (callback) {
		f.dot = (yield* callback.Invoke());
	}
	this.throw_speed = rt.initial(f, this, "throw_speed");
	this.in_inventory = 0;
	return f.dot;
}, true, { argTypes: [{ path: "/datum/callback" }] });

// items.dm:608
rt.def("/obj/item/proc/remove_item_from_storage", function* remove_item_from_storage(f: Frame, newLoc: Value) {
	let S: Value = null;
	if (!newLoc) {
		return 0;
	}
	if (rt.istype(this.loc, T("/obj/item/weapon/storage"))) {
		yield* (S = this.loc).remove_from_storage(this, newLoc);
		return 1;
	}
	return 0;
}, true);

// items.dm:623
rt.def("/obj/item/proc/get_dismemberment_chance", function get_dismemberment_chance(f: Frame, affecting: Value) {
	if (!affecting.can_dismember(this)) return f.dot;
	if (!((this.sharpness || this.damtype == "fire") && this.w_class >= 3)) return f.dot;
	f.dot = this.force * (this.w_class - 1);
	return f.dot;
});

// items.dm:628
rt.def("/obj/item/proc/get_dismember_sound", function get_dismember_sound(f: Frame) {
	if (this.damtype == "fire") {
		f.dot = rt.rsc("sound/weapons/sear.ogg");
	} else {
		f.dot = pick(rt.rsc("sound/misc/desceration-01.ogg"), rt.rsc("sound/misc/desceration-02.ogg"), rt.rsc("sound/misc/desceration-03.ogg"));
	}
	return f.dot;
});

// items.dm:634
rt.def("/obj/item/proc/open_flame", function* open_flame(f: Frame, flame_heat: Value) {
	let location: Value = null, M: Value = null, success: Value = null;
	flame_heat ??= 700;
	if (ismob((location = this.loc))) {
		M = location;
		success = 0;
		if (this == M.get_item_by_slot(slot_wear_mask)) {
			success = 1;
		}
		if (success) {
			location = rt.getStep(f, M, 0);
		}
	}
	if (!isturf(location)) return f.dot;
	yield* location.hotspot_expose(flame_heat, 5);
	return f.dot;
}, true);

// items.dm:646
rt.def("/obj/item/proc/ignition_effect", function ignition_effect(f: Frame, A: Value, user: Value) {
	if (this.is_hot()) {
		f.dot = `<span class='notice'>${user} lights ${A} with ${this}.</span>`;
	} else {
		f.dot = "";
	}
	return f.dot;
});

// items.dm:669
rt.def("/obj/item/proc/burn", function* burn(f: Frame) {
	let A: Value = null;
	if (!this || this.gc_destroyed) return f.dot;
	let _T: Value = rt.getStep(f, this, 0);
	let ash_type: Value = T("/obj/effect/decal/cleanable/ash");
	if (this.w_class == WEIGHT_CLASS_HUGE || this.w_class == WEIGHT_CLASS_GIGANTIC) {
		ash_type = T("/obj/effect/decal/cleanable/ash/large");
	}
	(A = (yield* new_(ash_type, _T))).desc += fmt("\nLooks like this used to be ＇！ some time ago.", [this.name]);
	yield* parent_proc();
	return f.dot;
}, true);

// items.dm:679
rt.def("/obj/item/proc/acid_melt", function* acid_melt(f: Frame) {
	let MO: Value = null;
	if (!this || this.gc_destroyed) return f.dot;
	let _T: Value = rt.getStep(f, this, 0);
	(MO = (yield* new_(T("/obj/effect/decal/cleanable/molten_object"), _T))).pixel_x = rand(-16, 16);
	MO.pixel_y = rand(-16, 16);
	MO.desc = fmt("Looks like this was ＇！ some time ago.", [this]);
	yield* parent_proc();
	return f.dot;
}, true);

// items.dm:688
rt.def("/obj/item/proc/microwave_act", function microwave_act(f: Frame, M: Value) {
	if (!(M && M.dirty < 100)) return f.dot;
	M.dirty++;
	return f.dot;
});

// items.dm:694
rt.def("/obj/item/proc/set_force_string", function set_force_string(f: Frame) {
	if (rt.inRange(this.force, 0, 4)) {
		this.force_string = "very low";
	} else if (rt.inRange(this.force, 4, 7)) {
		this.force_string = "low";
	} else if (rt.inRange(this.force, 7, 10)) {
		this.force_string = "medium";
	} else if (rt.inRange(this.force, 10, 11)) {
		this.force_string = "high";
	} else if (rt.inRange(this.force, 11, 20)) {
		this.force_string = "robust";
	} else if (rt.inRange(this.force, 20, 25)) {
		this.force_string = "very robust";
	} else {
		this.force_string = "exceptionally robust";
	}
	this.last_force_string_check = this.force;
	return f.dot;
});

// items.dm:712
rt.def("/obj/item/proc/openTip", function openTip(f: Frame, location: Value, control: Value, params: Value, user: Value) {
	let $0: any, $1: any, $2: any, $3: any, $4: any, $5: any, $6: any, $7: any, $8: any, $9: any, $10: any;
	if (this.last_force_string_check != this.force && !this.force_string_override) {
		this.set_force_string();
	}
	if (!this.force_string_override) {
		$0 = null;
		$1 = user;
		$2 = null;
		$3 = this;
		$4 = null;
		$5 = params;
		$6 = "title";
		$7 = this.name;
		$8 = "content";
		$9 = this.desc;
		if (this.force) {
			$10 = `<b>Force:</b> ${this.force_string}`;
		} else {
			$10 = "";
		}
		rt.call(f, P("/proc/openToolTip"), null, [$0, $1, $2, $3, $4, $5, $6, $7, $8, `${$9}<br>${$10}`, "theme", ""], rt.Args.Named);
	} else {
		openToolTip(user, this, params, { title: this.name, content: `${this.desc}<br><b>Force:</b> ${this.force_string}`, theme: "" });
	}
	return f.dot;
});

// items.dm:720
rt.def("/obj/item/proc/MouseEntered", function* MouseEntered(f: Frame, location: Value, control: Value, params: Value) {
	yield* parent_proc();
	if (!(this.in_inventory && f.usr.client.prefs.enable_tips)) return f.dot;
	let timedelay: Value = f.usr.client.prefs.tip_delay / 100;
	let user: Value = f.usr;
	this.tip_timer = (yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/proc/openTip"), location, control, params, user)), timedelay, 8));
	return f.dot;
}, true);

// items.dm:727
rt.def("/obj/item/proc/MouseExited", function* MouseExited(f: Frame) {
	yield* parent_proc();
	yield* deltimer(this.tip_timer);
	closeToolTip(f.usr);
	return f.dot;
}, true);
