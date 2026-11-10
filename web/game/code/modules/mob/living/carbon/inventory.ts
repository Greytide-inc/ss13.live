// Based on /tg/station's code/modules/mob/living/carbon/inventory.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// inventory.dm:2
rt.def("/mob/living/carbon/proc/get_item_by_slot", function get_item_by_slot(f: Frame, slot_id: Value) {
	if (slot_id === slot_back) {
		return this.back;
	} else if (slot_id === slot_wear_mask) {
		return this.wear_mask;
	} else if (slot_id === slot_neck) {
		return this.wear_neck;
	} else if (slot_id === slot_head) {
		return this.head;
	} else if (slot_id === slot_handcuffed) {
		return this.handcuffed;
	} else if (slot_id === slot_legcuffed) {
		return this.legcuffed;
	}
	return null;
});

// inventory.dm:18
rt.def("/mob/living/carbon/proc/equip_in_one_of_slots", function* equip_in_one_of_slots(f: Frame, I: Value, slots: Value, qdel_on_fail: Value) {
	let slot: Value = null;
	qdel_on_fail ??= 1;
	for (slot of each(slots)) {
		if (yield* this.equip_to_slot_if_possible(I, rt.index(slots, slot), { qdel_on_fail: 0, disable_warning: 1 })) {
			return slot;
		}
	}
	if (qdel_on_fail) {
		yield* qdel(I);
	}
	return null;
}, true);

// inventory.dm:27
rt.def("/mob/living/carbon/proc/equip_to_slot", function* equip_to_slot(f: Frame, I: Value, slot: Value) {
	let index: Value = null, M: Value = null, observe: Value = null, B: Value = null, prev_jimmies: Value = null;
	let $e: any;
	if (!slot) {
		return f.dot;
	}
	if (!rt.istype(I, T("/obj/item"))) {
		return f.dot;
	}
	if (index = this.get_held_index_of_item(I)) {
		rt.setAt(this.held_items, index, null);
	}
	if (I.pulledby) {
		yield* I.pulledby.stop_pulling();
	}
	I.screen_loc = null;
	if (this.client) {
		this.client.screen -= I;
	}
	if (this.observers && rt.len(f, this.observers)) {
		for (M of each(this.observers)) {
			if ((observe = M).client) {
				observe.client.screen -= I;
			}
		}
	}
	I.loc = this;
	I.layer = ABOVE_HUD_LAYER;
	I.plane = ABOVE_HUD_PLANE;
	(rt.modField(f, I, "appearance_flags", 16, rt.bitOr));
	let not_handled: Value = 0;
	if (slot === slot_back) {
		this.back = I;
		this.update_inv_back();
	} else if (slot === slot_wear_mask) {
		this.wear_mask = I;
		yield* this.wear_mask_update(I, { toggle_off: 0 });
	} else if (slot === slot_head) {
		this.head = I;
		yield* this.head_update(I);
	} else if (slot === slot_neck) {
		this.wear_neck = I;
		this.update_inv_neck(I);
	} else if (slot === slot_handcuffed) {
		this.handcuffed = I;
		yield* this.update_handcuffed();
	} else if (slot === slot_legcuffed) {
		this.legcuffed = I;
		yield* this.update_inv_legcuffed();
	} else if (slot === slot_hands) {
		yield* this.put_in_hands(I);
		yield* this.update_inv_hands();
	} else if (slot === slot_in_backpack) {
		B = this.back;
		prev_jimmies = B.rustle_jimmies;
		B.rustle_jimmies = 0;
		yield* B.handle_item_insertion(I, 1, this);
		B.rustle_jimmies = prev_jimmies;
	} else {
		not_handled = 1;
	}
	if (!not_handled) {
		yield* I.equipped(this, slot);
	}
	return not_handled;
}, true);

// inventory.dm:92
rt.def("/mob/living/carbon/proc/doUnEquip", function* doUnEquip(f: Frame, I: Value) {
	f.dot = (yield* parent_proc());
	if (!f.dot || !I) {
		return f.dot;
	}
	if (I == this.head) {
		this.head = null;
		yield* this.head_update(I);
	} else if (I == this.back) {
		this.back = null;
		this.update_inv_back();
	} else if (I == this.wear_mask) {
		this.wear_mask = null;
		yield* this.wear_mask_update(I, { toggle_off: 1 });
	}
	if (I == this.wear_neck) {
		this.wear_neck = null;
		this.update_inv_neck(I);
	} else if (I == this.handcuffed) {
		this.handcuffed = null;
		if (this.buckled && this.buckled.buckle_requires_restraints) {
			yield* this.buckled.unbuckle_mob(this);
		}
		yield* this.update_handcuffed();
	} else {
		if (I != this.legcuffed) return f.dot;
		this.legcuffed = null;
		yield* this.update_inv_legcuffed();
	}
	return f.dot;
}, true);

// inventory.dm:119
rt.def("/mob/living/proc/wear_mask_update", function* wear_mask_update(f: Frame, C: Value, toggle_off: Value) {
	toggle_off ??= 1;
	yield* this.update_inv_wear_mask();
	return f.dot;
}, true);

// inventory.dm:122
rt.def("/mob/living/carbon/proc/wear_mask_update", function* wear_mask_update(f: Frame, C: Value, toggle_off: Value) {
	toggle_off ??= 1;
	if (C.tint || rt.initial(f, C, "tint")) {
		yield* this.update_tint();
	}
	yield* this.update_inv_wear_mask();
	return f.dot;
}, true);

// inventory.dm:128
rt.def("/mob/living/carbon/proc/head_update", function* head_update(f: Frame, I: Value, forced: Value) {
	let C: Value = null;
	if (rt.istype(I, T("/obj/item/clothing"))) {
		if ((C = I).tint || rt.initial(f, C, "tint")) {
			yield* this.update_tint();
		}
		yield* this.update_sight();
	}
	if (rt.bitAnd(I.flags_inv, HIDEMASK) || forced) {
		yield* this.update_inv_wear_mask();
	}
	yield* this.update_inv_head();
	return f.dot;
}, true);
