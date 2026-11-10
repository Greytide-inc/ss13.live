// Based on /tg/station's code/modules/mob/living/carbon/human/inventory.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// inventory.dm:2
rt.def("/mob/living/carbon/human/proc/can_equip", function* can_equip(f: Frame, I: Value, slot: Value, disable_warning: Value, bypass_equip_delay_self: Value) {
	disable_warning ??= 0;
	bypass_equip_delay_self ??= 0;
	return (yield* this.dna.species.can_equip(I, slot, disable_warning, this, bypass_equip_delay_self));
}, true);

// inventory.dm:6
rt.def("/mob/living/carbon/human/proc/get_item_by_slot", function get_item_by_slot(f: Frame, slot_id: Value) {
	if (slot_id === slot_back) {
		return this.back;
	} else if (slot_id === slot_wear_mask) {
		return this.wear_mask;
	} else if (slot_id === slot_neck) {
		return this.wear_neck;
	} else if (slot_id === slot_handcuffed) {
		return this.handcuffed;
	} else if (slot_id === slot_legcuffed) {
		return this.legcuffed;
	} else if (slot_id === slot_belt) {
		return this.belt;
	} else if (slot_id === slot_wear_id) {
		return this.wear_id;
	} else if (slot_id === slot_ears) {
		return this.ears;
	} else if (slot_id === slot_glasses) {
		return this.glasses;
	} else if (slot_id === slot_gloves) {
		return this.gloves;
	} else if (slot_id === slot_head) {
		return this.head;
	} else if (slot_id === slot_shoes) {
		return this.shoes;
	} else if (slot_id === slot_wear_suit) {
		return this.wear_suit;
	} else if (slot_id === slot_w_uniform) {
		return this.w_uniform;
	} else if (slot_id === slot_l_store) {
		return this.l_store;
	} else if (slot_id === slot_r_store) {
		return this.r_store;
	} else if (slot_id === slot_s_store) {
		return this.s_store;
	}
	return null;
});

// inventory.dm:71
rt.def("/mob/living/carbon/human/proc/get_storage_slots", function get_storage_slots(f: Frame) {
	return list(this.back, this.belt, this.l_store, this.r_store, this.s_store);
});

// inventory.dm:81
rt.def("/mob/living/carbon/human/proc/equip_to_slot", function* equip_to_slot(f: Frame, I: Value, slot: Value) {
	let G: Value = null;
	if (!(yield* parent_proc())) {
		return f.dot;
	}
	let not_handled: Value = 0;
	if (slot === slot_belt) {
		this.belt = I;
		this.update_inv_belt();
	} else if (slot === slot_wear_id) {
		this.wear_id = I;
		yield* this.sec_hud_set_ID();
		this.update_inv_wear_id();
	} else if (slot === slot_ears) {
		this.ears = I;
		this.update_inv_ears();
	} else if (slot === slot_glasses) {
		this.glasses = I;
		if ((G = I).glass_colour_type) {
			yield* this.update_glasses_color(G, 1);
		}
		if (G.tint) {
			yield* this.update_tint();
		}
		if (G.vision_correction) {
			yield* this.clear_fullscreen("nearsighted");
		}
		if (G.vision_flags || G.darkness_view || G.invis_override || G.invis_view || G.lighting_alpha !== null) {
			yield* this.update_sight();
		}
		this.update_inv_glasses();
	} else if (slot === slot_gloves) {
		this.gloves = I;
		this.update_inv_gloves();
	} else if (slot === slot_shoes) {
		this.shoes = I;
		this.update_inv_shoes();
	} else if (slot === slot_wear_suit) {
		this.wear_suit = I;
		if (rt.bitAnd(I.flags_inv, HIDEJUMPSUIT)) {
			yield* this.update_inv_w_uniform();
		}
		if (this.wear_suit.breakouttime) {
			yield* this.stop_pulling();
			yield* this.update_action_buttons_icon();
		}
		yield* this.update_inv_wear_suit();
	} else if (slot === slot_w_uniform) {
		this.w_uniform = I;
		yield* this.update_suit_sensors();
		yield* this.update_inv_w_uniform();
	} else if (slot === slot_l_store) {
		this.l_store = I;
		this.update_inv_pockets();
	} else if (slot === slot_r_store) {
		this.r_store = I;
		this.update_inv_pockets();
	} else if (slot === slot_s_store) {
		this.s_store = I;
		this.update_inv_s_store();
	} else {
		to_chat(this, "<span class='danger'>You are trying to equip this item to an unsupported inventory slot. Report this to a coder!</span>");
	}
	if (!not_handled) {
		yield* I.equipped(this, slot);
	}
	return not_handled;
}, true);

// inventory.dm:145
rt.def("/mob/living/carbon/human/proc/doUnEquip", function* doUnEquip(f: Frame) {
	let G: Value = null;
	if (f.args[4] === null) {
		f.args[4] = 1;
	}
	let index: Value = this.get_held_index_of_item(f.args[0]);
	f.dot = (yield* parent_proc());
	if (!f.dot || !f.args[0]) {
		return f.dot;
	}
	if (index && this.dna.species.mutanthands) {
		yield* this.put_in_hand((yield* new_(this.dna.species.mutanthands)), index);
	}
	if (f.args[0] == this.wear_suit) {
		if (this.s_store && f.args[4]) {
			yield* this.dropItemToGround(this.s_store, 1);
		}
		if (this.wear_suit.breakouttime) {
			yield* this.update_action_buttons_icon();
		}
		this.wear_suit = null;
		if (rt.bitAnd(f.args[0].flags_inv, HIDEJUMPSUIT)) {
			yield* this.update_inv_w_uniform();
		}
		yield* this.update_inv_wear_suit();
	} else if (f.args[0] == this.w_uniform) {
		if (f.args[4]) {
			if (this.r_store) {
				yield* this.dropItemToGround(this.r_store, 1);
			}
			if (this.l_store) {
				yield* this.dropItemToGround(this.l_store, 1);
			}
			if (this.wear_id) {
				yield* this.dropItemToGround(this.wear_id);
			}
			if (this.belt) {
				yield* this.dropItemToGround(this.belt);
			}
		}
		this.w_uniform = null;
		yield* this.update_suit_sensors();
		yield* this.update_inv_w_uniform(f.args[4]);
	} else if (f.args[0] == this.gloves) {
		this.gloves = null;
		this.update_inv_gloves();
	} else if (f.args[0] == this.glasses) {
		this.glasses = null;
		if ((G = f.args[0]).glass_colour_type) {
			yield* this.update_glasses_color(G, 0);
		}
		if (G.tint) {
			yield* this.update_tint();
		}
		if (G.vision_correction) {
			if (rt.bitAnd(this.disabilities, 8)) {
				yield* this.overlay_fullscreen("nearsighted", T("/obj/screen/fullscreen/impaired"), 1);
			}
		}
		if (G.vision_flags || G.darkness_view || G.invis_override || G.invis_view || G.lighting_alpha !== null) {
			yield* this.update_sight();
		}
		this.update_inv_glasses();
	} else if (f.args[0] == this.ears) {
		this.ears = null;
		this.update_inv_ears();
	} else if (f.args[0] == this.shoes) {
		this.shoes = null;
		this.update_inv_shoes();
	} else if (f.args[0] == this.belt) {
		this.belt = null;
		this.update_inv_belt();
	} else if (f.args[0] == this.wear_id) {
		this.wear_id = null;
		yield* this.sec_hud_set_ID();
		this.update_inv_wear_id();
	} else if (f.args[0] == this.r_store) {
		this.r_store = null;
		this.update_inv_pockets();
	} else if (f.args[0] == this.l_store) {
		this.l_store = null;
		this.update_inv_pockets();
	} else {
		if (f.args[0] != this.s_store) return f.dot;
		this.s_store = null;
		this.update_inv_s_store();
	}
	return f.dot;
}, true, { args: ["I", "force", "newloc", "no_move", "invdrop"] });

// inventory.dm:213
rt.def("/mob/living/carbon/human/proc/wear_mask_update", function* wear_mask_update(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 1;
	}
	if (rt.bitAnd(f.args[0].flags_inv, 768) || rt.bitAnd(rt.initial(f, f.args[0], "flags_inv"), 768)) {
		yield* this.update_hair();
	}
	if (f.args[1] && this.internal && !this.getorganslot("breathing_tube")) {
		this.update_internals_hud_icon(0);
		this.internal = null;
	}
	if (rt.bitAnd(f.args[0].flags_inv, HIDEEYES)) {
		this.update_inv_glasses();
	}
	this.sec_hud_set_security_status();
	yield* parent_proc();
	return f.dot;
}, true, { args: ["C", "toggle_off"] });

// inventory.dm:224
rt.def("/mob/living/carbon/human/proc/head_update", function* head_update(f: Frame, I: Value, forced: Value) {
	if (rt.bitAnd(I.flags_inv, 768) || forced) {
		yield* this.update_hair();
	}
	if (rt.bitAnd(I.flags_inv, HIDEEYES) || forced) {
		this.update_inv_glasses();
	}
	if (rt.bitAnd(I.flags_inv, HIDEEARS) || forced) {
		yield* this.update_body();
	}
	this.sec_hud_set_security_status();
	yield* parent_proc();
	return f.dot;
}, true);

// inventory.dm:236
rt.def("/mob/living/carbon/human/proc/equipOutfit", function* equipOutfit(f: Frame, outfit: Value, visualsOnly: Value) {
	let O: Value = null;
	visualsOnly ??= 0;
	if (ispath(outfit)) {
		O = (yield* new_(outfit));
	} else if (!rt.istype((O = outfit), T("/datum/outfit"))) {
		return 0;
	}
	if (!O) {
		return 0;
	}
	return (yield* O.equip(this, visualsOnly));
}, true);
