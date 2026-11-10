// Based on /tg/station's code/modules/mob/living/carbon/alien/humanoid/update_icons.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// update_icons.dm:3
rt.def("/mob/living/carbon/alien/humanoid/proc/update_icons", function* update_icons(f: Frame) {
	let I: Value = null, old_icon: Value = null;
	this.cut_overlays();
	for (I of each(this.overlays_standing)) {
		this.add_overlay(I);
	}
	let asleep: Value = this.IsSleeping();
	if (this.stat == 2) {
		if (this.fireloss > 125) {
			this.icon_state = `alien${this.caste}_husked`;
		} else {
			this.icon_state = `alien${this.caste}_dead`;
		}
	} else if (this.stat == 1 && !asleep || this.IsKnockdown()) {
		this.icon_state = `alien${this.caste}_unconscious`;
	} else if (this.leap_on_click) {
		this.icon_state = `alien${this.caste}_pounce`;
	} else if (this.lying || this.resting || asleep) {
		this.icon_state = `alien${this.caste}_sleep`;
	} else if (this.mob_size == MOB_SIZE_LARGE) {
		this.icon_state = `alien${this.caste}`;
		if (this.drooling) {
			this.add_overlay(`alienspit_${this.caste}`);
		}
	} else {
		this.icon_state = `alien${this.caste}`;
		if (this.drooling) {
			this.add_overlay("alienspit");
		}
	}
	if (this.leaping) {
		if (this.alt_icon == rt.initial(f, this, "alt_icon")) {
			old_icon = this.icon;
			this.icon = this.alt_icon;
			this.alt_icon = old_icon;
		}
		this.icon_state = `alien${this.caste}_leap`;
		this.pixel_x = -32;
		this.pixel_y = -32;
	} else {
		if (this.alt_icon != rt.initial(f, this, "alt_icon")) {
			old_icon = this.icon;
			this.icon = this.alt_icon;
			this.alt_icon = old_icon;
		}
		this.pixel_x = this.get_standard_pixel_x_offset(this.lying);
		this.pixel_y = this.get_standard_pixel_y_offset(this.lying);
	}
	yield* this.update_inv_hands();
	this.update_inv_handcuffed();
	return f.dot;
}, true);

// update_icons.dm:50
rt.def("/mob/living/carbon/alien/humanoid/proc/regenerate_icons", function* regenerate_icons(f: Frame) {
	if (yield* parent_proc()) return f.dot;
	yield* this.update_transform();
	return f.dot;
}, true);

// update_icons.dm:55
rt.def("/mob/living/carbon/alien/humanoid/proc/update_transform", function* update_transform(f: Frame) {
	if (this.lying > 0) {
		this.lying = 90;
	}
	yield* parent_proc();
	yield* this.update_icons();
	return f.dot;
}, true);

// update_icons.dm:61
rt.def("/mob/living/carbon/alien/humanoid/proc/update_inv_handcuffed", function update_inv_handcuffed(f: Frame) {
	this.remove_overlay(HANDCUFF_LAYER);
	let cuff_icon: Value = "aliencuff";
	let dmi_file: Value = rt.rsc("icons/mob/alien.dmi");
	if (this.mob_size == MOB_SIZE_LARGE) {
		cuff_icon = `aliencuff_${this.caste}`;
		dmi_file = rt.rsc("icons/mob/alienqueen.dmi");
	}
	if (!this.handcuffed) return f.dot;
	rt.setAt(this.overlays_standing, HANDCUFF_LAYER, mutable_appearance(dmi_file, cuff_icon, -5));
	this.apply_overlay(HANDCUFF_LAYER);
	return f.dot;
});

// update_icons.dm:75
rt.def("/mob/living/carbon/alien/humanoid/royal/proc/update_inv_hands", function* update_inv_hands(f: Frame) {
	let l_hand: Value = null, itm_state: Value = null, r_hand: Value = null, itm_state_3: Value = null;
	yield* parent_proc();
	this.remove_overlay(HANDS_LAYER);
	let hands: Value = list();
	if (l_hand = this.get_item_for_held_index(1)) {
		if (!(itm_state = l_hand.item_state)) {
			itm_state = l_hand.icon_state;
		}
		hands += mutable_appearance(this.alt_inhands_file, `${itm_state}${this.caste}_l`, -3);
	}
	if (r_hand = this.get_item_for_held_index(2)) {
		if (!(itm_state_3 = r_hand.item_state)) {
			itm_state_3 = r_hand.icon_state;
		}
		hands += mutable_appearance(this.alt_inhands_file, `${itm_state_3}${this.caste}_r`, -3);
	}
	rt.setAt(this.overlays_standing, HANDS_LAYER, hands);
	this.apply_overlay(HANDS_LAYER);
	return f.dot;
}, true);
