// Based on /tg/station's code/game/gamemodes/devil/true_devil/inventory.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// inventory.dm:2
rt.def("/mob/living/carbon/true_devil/proc/doUnEquip", function* doUnEquip(f: Frame, I: Value, force: Value) {
	if (yield* parent_proc()) {
		yield* this.update_inv_hands();
		return 1;
	}
	return 0;
}, true);

// inventory.dm:9
rt.def("/mob/living/carbon/true_devil/proc/update_inv_hands", function update_inv_hands(f: Frame) {
	let r_hand: Value = null, r_state: Value = null, r_hand_overlay: Value = null, l_state: Value = null, l_hand_overlay: Value = null;
	this.remove_overlay(DEVIL_HANDS_LAYER);
	let hands_overlays: Value = list();
	let l_hand: Value = this.get_item_for_held_index(1);
	if (r_hand = this.get_item_for_held_index(2)) {
		if (!(r_state = r_hand.item_state)) {
			r_state = r_hand.icon_state;
		}
		hands_overlays += (r_hand_overlay = r_hand.build_worn_icon({ state: r_state, default_layer: DEVIL_HANDS_LAYER, default_icon_file: r_hand.righthand_file, isinhands: DEVIL_HANDS_LAYER }));
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
		hands_overlays += (l_hand_overlay = l_hand.build_worn_icon({ state: l_state, default_layer: DEVIL_HANDS_LAYER, default_icon_file: l_hand.lefthand_file, isinhands: DEVIL_HANDS_LAYER }));
		if (this.client && this.hud_used && this.hud_used.hud_version != HUD_STYLE_NOHUD) {
			l_hand.layer = ABOVE_HUD_LAYER;
			l_hand.plane = ABOVE_HUD_PLANE;
			l_hand.screen_loc = ui_hand_position(this.get_held_index_of_item(l_hand));
			(rt.modField(f, this.client, "screen", l_hand, rt.bitOr));
		}
	}
	if (rt.len(f, hands_overlays)) {
		rt.setAt(this.devil_overlays, DEVIL_HANDS_LAYER, hands_overlays);
	}
	this.apply_overlay(DEVIL_HANDS_LAYER);
	return f.dot;
});

// inventory.dm:50
rt.def("/mob/living/carbon/true_devil/proc/remove_overlay", function remove_overlay(f: Frame, cache_index: Value) {
	let I: Value = null;
	if (!(I = rt.index(this.devil_overlays, cache_index))) return f.dot;
	this.cut_overlay(I);
	rt.setAt(this.devil_overlays, cache_index, null);
	return f.dot;
});

// inventory.dm:57
rt.def("/mob/living/carbon/true_devil/proc/apply_overlay", function apply_overlay(f: Frame, cache_index: Value) {
	if (!(f.dot = rt.index(this.devil_overlays, cache_index))) return f.dot;
	this.add_overlay(f.dot);
	return f.dot;
});
