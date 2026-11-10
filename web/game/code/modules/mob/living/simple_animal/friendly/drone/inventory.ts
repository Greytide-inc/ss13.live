// Based on /tg/station's code/modules/mob/living/simple_animal/friendly/drone/inventory.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// inventory.dm:10
rt.def("/mob/living/simple_animal/drone/proc/doUnEquip", function* doUnEquip(f: Frame, I: Value, force: Value) {
	if (yield* parent_proc()) {
		yield* this.update_inv_hands();
		if (I == this.head) {
			this.head = null;
			yield* this.update_inv_head();
		}
		if (I == this.internal_storage) {
			this.internal_storage = null;
			this.update_inv_internal_storage();
		}
		return 1;
	}
	return 0;
}, true);

// inventory.dm:23
rt.def("/mob/living/simple_animal/drone/proc/can_equip", function can_equip(f: Frame, I: Value, slot: Value) {
	if (slot === slot_head) {
		if (this.head) {
			return 0;
		}
		if (!(rt.bitAnd(I.slot_flags, SLOT_HEAD) || rt.bitAnd(I.slot_flags, SLOT_MASK))) {
			return 0;
		}
		return 1;
	} else if (slot === slot_generic_dextrous_storage) {
		if (this.internal_storage) {
			return 0;
		}
		return 1;
	}
	parent_proc();
	return f.dot;
}, false);

// inventory.dm:38
rt.def("/mob/living/simple_animal/drone/proc/get_item_by_slot", function get_item_by_slot(f: Frame, slot_id: Value) {
	if (slot_id === slot_head) {
		return this.head;
	} else if (slot_id === slot_generic_dextrous_storage) {
		return this.internal_storage;
	}
	return parent_proc();
}, false);

// inventory.dm:47
rt.def("/mob/living/simple_animal/drone/proc/equip_to_slot", function* equip_to_slot(f: Frame, I: Value, slot: Value) {
	let index: Value = null;
	if (!slot) {
		return f.dot;
	}
	if (!rt.istype(I, T("/obj/item"))) {
		return f.dot;
	}
	if (index = this.get_held_index_of_item(I)) {
		rt.setAt(this.held_items, index, null);
	}
	yield* this.update_inv_hands();
	if (I.pulledby) {
		yield* I.pulledby.stop_pulling();
	}
	I.screen_loc = null;
	I.loc = this;
	I.layer = ABOVE_HUD_LAYER;
	I.plane = ABOVE_HUD_PLANE;
	if (slot === slot_head) {
		this.head = I;
		yield* this.update_inv_head();
	} else if (slot === slot_generic_dextrous_storage) {
		this.internal_storage = I;
		this.update_inv_internal_storage();
	} else {
		to_chat(this, "<span class='danger'>You are trying to equip this item to an unsupported inventory slot. Report this to a coder!</span>");
		return f.dot;
	}
	yield* I.equipped(this, slot);
	return f.dot;
}, true);
