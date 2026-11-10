// Based on /tg/station's code/modules/mob/living/carbon/update_icons.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// update_icons.dm:3
rt.def("/mob/living/carbon/proc/update_transform", function update_transform(f: Frame) {
	let ntransform: Value = matrix(this.transform);
	let final_pixel_y: Value = this.pixel_y;
	let final_dir: Value = this.dir;
	let changed: Value = 0;
	if (this.lying != this.lying_prev && this.rotate_on_lying) {
		changed++;
		ntransform.TurnTo(this.lying_prev, this.lying);
		if (this.lying == 0) {
			final_pixel_y = this.get_standard_pixel_y_offset();
		} else if (this.lying_prev == 0) {
			this.pixel_y = this.get_standard_pixel_y_offset();
			final_pixel_y = this.get_standard_pixel_y_offset(this.lying);
			if (rt.bitAnd(this.dir, 12)) {
				final_dir = pick(1, 2);
			}
		}
	}
	if (this.resize != 1) {
		changed++;
		ntransform.Scale(this.resize);
		this.resize = 1;
	}
	if (!changed) return f.dot;
	rt.op(f, "Animate", [2, 12], [null, this, "transform", ntransform, "time", 2, "pixel_y", final_pixel_y, "dir", final_dir, "easing", 192]);
	this.floating = 0;
	return f.dot;
});

// update_icons.dm:33
rt.def("/mob/living/carbon/proc/apply_overlay", function apply_overlay(f: Frame, cache_index: Value) {
	if (!(f.dot = rt.index(this.overlays_standing, cache_index))) return f.dot;
	this.add_overlay(f.dot);
	return f.dot;
});

// update_icons.dm:37
rt.def("/mob/living/carbon/proc/remove_overlay", function remove_overlay(f: Frame, cache_index: Value) {
	let I: Value = null;
	if (!(I = rt.index(this.overlays_standing, cache_index))) return f.dot;
	this.cut_overlay(I);
	rt.setAt(this.overlays_standing, cache_index, null);
	return f.dot;
});

// update_icons.dm:45
rt.def("/mob/living/carbon/proc/regenerate_icons", function* regenerate_icons(f: Frame) {
	if (this.notransform) {
		return 1;
	}
	yield* this.update_inv_hands();
	this.update_inv_handcuffed();
	yield* this.update_inv_legcuffed();
	this.update_fire();
	return f.dot;
}, true);

// update_icons.dm:52
rt.def("/mob/living/carbon/proc/update_inv_hands", function* update_inv_hands(f: Frame) {
	let I: Value = null, M: Value = null, observe: Value = null, t_state: Value = null, icon_file: Value = null;
	this.remove_overlay(HANDS_LAYER);
	if (this.handcuffed) {
		yield* this.drop_all_held_items();
		return f.dot;
	}
	let hands: Value = list();
	for (I of each(this.held_items, T("/obj/item"))) {
		if (this.client && this.hud_used && this.hud_used.hud_version != HUD_STYLE_NOHUD) {
			I.screen_loc = ui_hand_position(this.get_held_index_of_item(I));
			this.client.screen += I;
			if (this.observers && rt.len(f, this.observers)) {
				M = null;
				for (M of each(this.observers)) {
					if ((observe = M).client && observe.client.eye == this) {
						observe.client.screen += I;
					} else {
						this.observers -= observe;
						if (!rt.len(f, this.observers)) {
							this.observers = null;
							break;
						}
					}
				}
			}
		}
		if (!(t_state = I.item_state)) {
			t_state = I.icon_state;
		}
		icon_file = I.lefthand_file;
		if (this.get_held_index_of_item(I) % 2 == 0) {
			icon_file = I.righthand_file;
		}
		hands += (yield* I.build_worn_icon({ state: t_state, default_layer: HANDS_LAYER, default_icon_file: icon_file, isinhands: 1 }));
	}
	rt.setAt(this.overlays_standing, HANDS_LAYER, hands);
	this.apply_overlay(HANDS_LAYER);
	return f.dot;
}, true);

// update_icons.dm:88
rt.def("/mob/living/carbon/proc/update_fire", function update_fire(f: Frame, fire_icon: Value) {
	let new_fire_overlay: Value = null;
	fire_icon ??= "Generic_mob_burning";
	this.remove_overlay(FIRE_LAYER);
	if (this.on_fire) {
		(new_fire_overlay = mutable_appearance(rt.rsc("icons/mob/onfire.dmi"), fire_icon, -1)).appearance_flags = 2;
		rt.setAt(this.overlays_standing, FIRE_LAYER, new_fire_overlay);
	}
	this.apply_overlay(FIRE_LAYER);
	return f.dot;
});

// update_icons.dm:99
rt.def("/mob/living/carbon/proc/update_damage_overlays", function update_damage_overlays(f: Frame) {
	let X: Value = null, BP: Value = null;
	this.remove_overlay(DAMAGE_LAYER);
	let damage_overlay: Value = mutable_appearance(rt.rsc("icons/mob/dam_mob.dmi"), "blank", -20);
	rt.setAt(this.overlays_standing, DAMAGE_LAYER, damage_overlay);
	for (X of each(this.bodyparts)) {
		if ((BP = X).dmg_overlay_type) {
			if (BP.brutestate) {
				damage_overlay.add_overlay(`${BP.dmg_overlay_type}_${BP.body_zone}_${BP.brutestate}0`);
			}
			if (BP.burnstate) {
				damage_overlay.add_overlay(`${BP.dmg_overlay_type}_${BP.body_zone}_0${BP.burnstate}`);
			}
		}
	}
	this.apply_overlay(DAMAGE_LAYER);
	return f.dot;
});

// update_icons.dm:116
rt.def("/mob/living/carbon/proc/update_inv_wear_mask", function update_inv_wear_mask(f: Frame) {
	let inv: Value = null;
	this.remove_overlay(FACEMASK_LAYER);
	if (!this.get_bodypart("head")) {
		return f.dot;
	}
	if (this.client && this.hud_used && rt.index(this.hud_used.inv_slots, slot_wear_mask)) {
		(inv = rt.index(this.hud_used.inv_slots, slot_wear_mask)).update_icon();
	}
	if (this.wear_mask) {
		if (!(this.head && rt.bitAnd(this.head.flags_inv, HIDEMASK))) {
			rt.setAt(this.overlays_standing, FACEMASK_LAYER, this.wear_mask.build_worn_icon({ state: this.wear_mask.icon_state, default_layer: FACEMASK_LAYER, default_icon_file: rt.rsc("icons/mob/mask.dmi") }));
		}
		this.update_hud_wear_mask(this.wear_mask);
	}
	this.apply_overlay(FACEMASK_LAYER);
	return f.dot;
});

// update_icons.dm:133
rt.def("/mob/living/carbon/proc/update_inv_neck", function update_inv_neck(f: Frame) {
	let inv: Value = null;
	this.remove_overlay(NECK_LAYER);
	if (this.client && this.hud_used && rt.index(this.hud_used.inv_slots, slot_neck)) {
		(inv = rt.index(this.hud_used.inv_slots, slot_neck)).update_icon();
	}
	if (this.wear_neck) {
		if (!(this.head && rt.bitAnd(this.head.flags_inv, HIDENECK))) {
			rt.setAt(this.overlays_standing, NECK_LAYER, this.wear_neck.build_worn_icon({ state: this.wear_neck.icon_state, default_layer: NECK_LAYER, default_icon_file: rt.rsc("icons/mob/neck.dmi") }));
		}
		this.update_hud_neck(this.wear_neck);
	}
	this.apply_overlay(NECK_LAYER);
	return f.dot;
});

// update_icons.dm:147
rt.def("/mob/living/carbon/proc/update_inv_back", function update_inv_back(f: Frame) {
	let inv: Value = null;
	this.remove_overlay(BACK_LAYER);
	if (this.client && this.hud_used && rt.index(this.hud_used.inv_slots, slot_back)) {
		(inv = rt.index(this.hud_used.inv_slots, slot_back)).update_icon();
	}
	if (this.back) {
		rt.setAt(this.overlays_standing, BACK_LAYER, this.back.build_worn_icon({ state: this.back.icon_state, default_layer: BACK_LAYER, default_icon_file: rt.rsc("icons/mob/back.dmi") }));
		this.update_hud_back(this.back);
	}
	this.apply_overlay(BACK_LAYER);
	return f.dot;
});

// update_icons.dm:159
rt.def("/mob/living/carbon/proc/update_inv_head", function update_inv_head(f: Frame) {
	let inv: Value = null;
	this.remove_overlay(HEAD_LAYER);
	if (!this.get_bodypart("head")) {
		return f.dot;
	}
	if (this.client && this.hud_used && rt.index(this.hud_used.inv_slots, slot_back)) {
		(inv = rt.index(this.hud_used.inv_slots, slot_head)).update_icon();
	}
	if (this.head) {
		rt.setAt(this.overlays_standing, HEAD_LAYER, this.head.build_worn_icon({ state: this.head.icon_state, default_layer: HEAD_LAYER, default_icon_file: rt.rsc("icons/mob/head.dmi") }));
		this.update_hud_head(this.head);
	}
	this.apply_overlay(HEAD_LAYER);
	return f.dot;
});

// update_icons.dm:176
rt.def("/mob/living/carbon/proc/update_inv_handcuffed", function update_inv_handcuffed(f: Frame) {
	this.remove_overlay(HANDCUFF_LAYER);
	if (!this.handcuffed) return f.dot;
	rt.setAt(this.overlays_standing, HANDCUFF_LAYER, mutable_appearance(rt.rsc("icons/mob/mob.dmi"), "handcuff1", -5));
	this.apply_overlay(HANDCUFF_LAYER);
	return f.dot;
});

// update_icons.dm:187
rt.def("/mob/living/carbon/proc/update_hud_handcuffed", function update_hud_handcuffed(f: Frame) {
	let hand: Value = null, H: Value = null;
	if (!this.hud_used) return f.dot;
	for (hand of each(this.hud_used.hand_slots)) {
		if (H = rt.index(this.hud_used.hand_slots, hand)) {
			H.update_icon();
		}
	}
	return f.dot;
});

// update_icons.dm:213
rt.def("/obj/item/proc/worn_overlays", function worn_overlays(f: Frame, isinhands: Value) {
	isinhands ??= 0;
	f.dot = list();
	return f.dot;
});

// update_icons.dm:217
rt.def("/mob/living/carbon/proc/update_body", function* update_body(f: Frame) {
	yield* this.update_body_parts();
	return f.dot;
}, true);

// update_icons.dm:221
rt.def("/mob/living/carbon/proc/update_body_parts", function* update_body_parts(f: Frame) {
	let X: Value = null, BP: Value = null, X_2: Value = null, BP_3: Value = null;
	let oldkey: Value = this.icon_render_key;
	this.icon_render_key = this.generate_icon_render_key();
	if (oldkey == this.icon_render_key) {
		return f.dot;
	}
	this.remove_overlay(BODYPARTS_LAYER);
	for (X of each(this.bodyparts)) {
		(BP = X).update_limb();
	}
	if (rt.index(GLOB.limb_icon_cache, this.icon_render_key)) {
		yield* this.load_limb_from_cache();
		return f.dot;
	}
	let new_limbs: Value = list();
	for (X_2 of each(this.bodyparts)) {
		new_limbs += (BP_3 = X_2).get_limb_icon();
	}
	if (rt.len(f, new_limbs)) {
		rt.setAt(this.overlays_standing, BODYPARTS_LAYER, new_limbs);
		rt.setAt(GLOB.limb_icon_cache, this.icon_render_key, new_limbs);
	}
	this.apply_overlay(BODYPARTS_LAYER);
	this.update_damage_overlays();
	return f.dot;
}, true);

// update_icons.dm:268
rt.def("/mob/living/carbon/proc/generate_icon_render_key", function generate_icon_render_key(f: Frame) {
	let X: Value = null, BP: Value = null;
	for (X of each(this.bodyparts)) {
		f.dot += `-${(BP = X).body_zone}`;
		if (BP.use_digitigrade) {
			f.dot += `-digitigrade${BP.use_digitigrade}`;
		}
		if (BP.animal_origin) {
			f.dot += `-${BP.animal_origin}`;
		}
		if (BP.status == BODYPART_ORGANIC) {
			f.dot += "-organic";
		} else {
			f.dot += "-robotic";
		}
	}
	if (!rt.bitAnd(this.disabilities, 64)) return f.dot;
	f.dot += "-husk";
	return f.dot;
});

// update_icons.dm:286
rt.def("/mob/living/carbon/proc/load_limb_from_cache", function load_limb_from_cache(f: Frame) {
	if (rt.index(GLOB.limb_icon_cache, this.icon_render_key)) {
		this.remove_overlay(BODYPARTS_LAYER);
		rt.setAt(this.overlays_standing, BODYPARTS_LAYER, rt.index(GLOB.limb_icon_cache, this.icon_render_key));
		this.apply_overlay(BODYPARTS_LAYER);
	}
	this.update_damage_overlays();
	return f.dot;
});
