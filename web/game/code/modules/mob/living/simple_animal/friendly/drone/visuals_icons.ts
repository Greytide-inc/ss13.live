// Based on /tg/station's code/modules/mob/living/simple_animal/friendly/drone/visuals_icons.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


// visuals_icons.dm:10
rt.def("/mob/living/simple_animal/drone/proc/apply_overlay", function apply_overlay(f: Frame, cache_index: Value) {
	if (!(f.dot = rt.index(this.drone_overlays, cache_index))) return f.dot;
	this.add_overlay(f.dot);
	return f.dot;
});

// visuals_icons.dm:15
rt.def("/mob/living/simple_animal/drone/proc/remove_overlay", function remove_overlay(f: Frame, cache_index: Value) {
	let I: Value = null;
	if (!(I = rt.index(this.drone_overlays, cache_index))) return f.dot;
	this.cut_overlay(I);
	rt.setAt(this.drone_overlays, cache_index, null);
	return f.dot;
});

// visuals_icons.dm:22
rt.def("/mob/living/simple_animal/drone/proc/update_inv_hands", function update_inv_hands(f: Frame) {
	let r_state: Value = null, r_hand_overlay: Value = null, l_state: Value = null, l_hand_overlay: Value = null;
	this.remove_overlay(DRONE_HANDS_LAYER);
	let hands_overlays: Value = list();
	let l_hand: Value = this.get_item_for_held_index(1);
	let r_hand: Value = this.get_item_for_held_index(2);
	let y_shift: Value = this.getItemPixelShiftY();
	if (r_hand) {
		if (!(r_state = r_hand.item_state)) {
			r_state = r_hand.icon_state;
		}
		r_hand_overlay = r_hand.build_worn_icon({ state: r_state, default_layer: DRONE_HANDS_LAYER, default_icon_file: r_hand.righthand_file, isinhands: DRONE_HANDS_LAYER });
		if (y_shift) {
			r_hand_overlay.pixel_y += y_shift;
		}
		hands_overlays += r_hand_overlay;
		if (this.client && this.hud_used && this.hud_used.hud_version != HUD_STYLE_NOHUD) {
			r_hand.layer = ABOVE_HUD_LAYER;
			r_hand.plane = ABOVE_HUD_PLANE;
			r_hand.screen_loc = ui_hand_position(this.get_held_index_of_item(r_hand));
			(rt.modField(f, this.client, "screen", r_hand, rt.bitOr));
		}
	}
	if (l_hand) {
		if (!(l_state = l_hand.item_state)) {
			l_state = l_hand.icon_state;
		}
		l_hand_overlay = l_hand.build_worn_icon({ state: l_state, default_layer: DRONE_HANDS_LAYER, default_icon_file: l_hand.lefthand_file, isinhands: DRONE_HANDS_LAYER });
		if (y_shift) {
			l_hand_overlay.pixel_y += y_shift;
		}
		hands_overlays += l_hand_overlay;
		if (this.client && this.hud_used && this.hud_used.hud_version != HUD_STYLE_NOHUD) {
			l_hand.layer = ABOVE_HUD_LAYER;
			l_hand.plane = ABOVE_HUD_PLANE;
			l_hand.screen_loc = ui_hand_position(this.get_held_index_of_item(l_hand));
			(rt.modField(f, this.client, "screen", l_hand, rt.bitOr));
		}
	}
	if (rt.len(f, hands_overlays)) {
		rt.setAt(this.drone_overlays, DRONE_HANDS_LAYER, hands_overlays);
	}
	this.apply_overlay(DRONE_HANDS_LAYER);
	return f.dot;
});

// visuals_icons.dm:73
rt.def("/mob/living/simple_animal/drone/proc/update_inv_internal_storage", function update_inv_internal_storage(f: Frame) {
	if (!(this.internal_storage && this.client && this.hud_used && this.hud_used.hud_shown)) return f.dot;
	this.internal_storage.screen_loc = "CENTER-2:14,SOUTH:5";
	this.client.screen += this.internal_storage;
	return f.dot;
});

// visuals_icons.dm:79
rt.def("/mob/living/simple_animal/drone/proc/update_inv_head", function update_inv_head(f: Frame) {
	let used_head_icon: Value = null, head_overlay: Value = null;
	this.remove_overlay(DRONE_HEAD_LAYER);
	if (this.head) {
		if (this.client && this.hud_used && this.hud_used.hud_shown) {
			this.head.screen_loc = "CENTER-3:14,SOUTH:5";
			this.client.screen += this.head;
		}
		used_head_icon = rt.rsc("icons/mob/head.dmi");
		if (rt.istype(this.head, T("/obj/item/clothing/mask"))) {
			used_head_icon = rt.rsc("icons/mob/mask.dmi");
		}
		(head_overlay = this.head.build_worn_icon({ state: this.head.icon_state, default_layer: DRONE_HEAD_LAYER, default_icon_file: used_head_icon })).pixel_y += -15;
		rt.setAt(this.drone_overlays, DRONE_HEAD_LAYER, head_overlay);
	}
	this.apply_overlay(DRONE_HEAD_LAYER);
	return f.dot;
});

// visuals_icons.dm:96
rt.def("/mob/living/simple_animal/drone/proc/update_inv_wear_mask", function update_inv_wear_mask(f: Frame) {
	this.update_inv_head();
	return f.dot;
});

// visuals_icons.dm:101
rt.def("/mob/living/simple_animal/drone/proc/regenerate_icons", function regenerate_icons(f: Frame) {
	this.update_inv_hands();
	this.update_inv_head();
	this.update_inv_internal_storage();
	return f.dot;
});

// visuals_icons.dm:108
rt.def("/mob/living/simple_animal/drone/proc/pickVisualAppearence", function* pickVisualAppearence(f: Frame) {
	let appearence: Value = null;
	this.picked = 0;
	const subject = (appearence = (yield* g.op(f, "Prompt", [0], [null, "Maintenance Drone", "Appearence", "Choose your appearence!", list("Maintenance Drone", "Repair Drone", "Scout Drone")])));
	if (subject === "Maintenance Drone") {
		this.visualAppearence = "drone_maint";
		this.colour = (yield* g.op(f, "Prompt", [0], [null, "grey", "Colour", "Choose your colour!", list("grey", "blue", "red", "green", "pink", "orange")]));
		this.icon_state = `${this.visualAppearence}_${this.colour}`;
		this.icon_living = `${this.visualAppearence}_${this.colour}`;
		this.icon_dead = `${this.visualAppearence}_dead`;
	} else if (subject === "Repair Drone") {
		this.visualAppearence = "drone_repair";
		this.icon_state = this.visualAppearence;
		this.icon_living = this.visualAppearence;
		this.icon_dead = `${this.visualAppearence}_dead`;
	} else if (subject === "Scout Drone") {
		this.visualAppearence = "drone_scout";
		this.icon_state = this.visualAppearence;
		this.icon_living = this.visualAppearence;
		this.icon_dead = `${this.visualAppearence}_dead`;
	} else {
		return f.dot;
	}
	this.picked = 1;
	return f.dot;
}, true);

// visuals_icons.dm:137
rt.def("/mob/living/simple_animal/drone/proc/getItemPixelShiftY", function getItemPixelShiftY(f: Frame) {
	if (this.visualAppearence === "drone_maint") {
		f.dot = 0;
	} else if (this.visualAppearence === "drone_repair" || this.visualAppearence === "drone_scout" || this.visualAppearence === "drone_clock") {
		f.dot = -6;
	}
	return f.dot;
});

// visuals_icons.dm:144
rt.def("/mob/living/simple_animal/drone/proc/updateSeeStaticMobs", function updateSeeStaticMobs(f: Frame) {
	let i: Value = null, L: Value = null, chosen: Value = null;
	if (!this.client) {
		return f.dot;
	}
	for (i of each(this.staticOverlays)) {
		this.client.images.Remove(i);
		this.staticOverlays.Remove(i);
	}
	this.staticOverlays.len = 0;
	if (!this.seeStatic) return f.dot;
	for (L of each(GLOB.mob_list, T("/mob/living"))) {
		if (rt.istype(L, T("/mob/living/simple_animal/drone"))) {
			continue;
		}
		chosen = null;
		if (rt.isIn(f, this.staticChoice, L.staticOverlays)) {
			chosen = rt.index(L.staticOverlays, this.staticChoice);
		} else {
			chosen = rt.index(L.staticOverlays, "static");
		}
		(rt.modSrcVar(f, "staticOverlays", chosen, rt.bitOr));
		(rt.modField(f, this.client, "images", chosen, rt.bitOr));
	}
	return f.dot;
});
