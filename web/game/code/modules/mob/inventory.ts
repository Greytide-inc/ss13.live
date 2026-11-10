// Based on /tg/station's code/modules/mob/inventory.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// inventory.dm:6
rt.def("/mob/proc/get_active_held_item", function get_active_held_item(f: Frame) {
	return this.get_item_for_held_index(this.active_hand_index);
});

// inventory.dm:12
rt.def("/mob/proc/get_inactive_held_item", function get_inactive_held_item(f: Frame) {
	return this.get_item_for_held_index(this.get_inactive_hand_index());
});

// inventory.dm:19
rt.def("/mob/proc/get_inactive_hand_index", function get_inactive_hand_index(f: Frame) {
	let other_hand: Value = 0;
	if (!(this.active_hand_index % 2)) {
		other_hand = this.active_hand_index - 1;
	} else {
		other_hand = this.active_hand_index + 1;
	}
	if (other_hand < 0 || other_hand > rt.len(f, this.held_items)) {
		other_hand = 0;
	}
	return other_hand;
});

// inventory.dm:29
rt.def("/mob/proc/get_item_for_held_index", function get_item_for_held_index(f: Frame, i: Value) {
	if (i > 0 && i <= rt.len(f, this.held_items)) {
		return rt.index(this.held_items, i);
	}
	return 0;
});

// inventory.dm:36
rt.def("/mob/proc/held_index_to_dir", function held_index_to_dir(f: Frame, i: Value) {
	if (!(i % 2)) {
		return "r";
	}
	return "l";
});

// inventory.dm:48
rt.def("/mob/proc/has_active_hand", function has_active_hand(f: Frame) {
	return this.has_hand_for_held_index(this.active_hand_index);
});

// inventory.dm:58
rt.def("/mob/proc/get_empty_held_index_for_side", function get_empty_held_index_for_side(f: Frame, side: Value, all: Value) {
	let empty_indexes: Value = null, i: Value = null;
	let $e: any;
	side ??= "left";
	all ??= 0;
	let start: Value = 0;
	if (rt.index(GLOB.lefts, side)) {
		start = 1;
	} else if (rt.index(GLOB.rights, side)) {
		start = 2;
	}
	if (!start) {
		return 0;
	}
	rt.forRange(f, 0, start, rt.len(f, this.held_items), 2);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (!rt.index(this.held_items, i)) {
			if (!all) {
				return i;
			}
			if (!empty_indexes) {
				empty_indexes = list();
			}
			empty_indexes += i;
		}
	}
	rt.endFor(f, 0);
	return empty_indexes;
});

// inventory.dm:80
rt.def("/mob/proc/get_held_items_for_side", function get_held_items_for_side(f: Frame, side: Value, all: Value) {
	let holding_items: Value = null, i: Value = null, I: Value = null;
	let $e: any;
	side ??= "left";
	all ??= 0;
	let start: Value = 0;
	if (rt.index(rt.gl("lefts#2"), side)) {
		start = 1;
	} else if (rt.index(rt.gl("rights#2"), side)) {
		start = 2;
	}
	if (!start) {
		return 0;
	}
	rt.forRange(f, 0, start, rt.len(f, this.held_items), 2);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (I = rt.index(this.held_items, i)) {
			if (!all) {
				return I;
			}
			if (!holding_items) {
				holding_items = list();
			}
			holding_items += I;
		}
	}
	rt.endFor(f, 0);
	return holding_items;
});

// inventory.dm:100
rt.def("/mob/proc/get_empty_held_indexes", function get_empty_held_indexes(f: Frame) {
	let L: Value = null, i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, rt.len(f, this.held_items), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (!rt.index(this.held_items, i)) {
			if (!L) {
				L = list();
			}
			L += i;
		}
	}
	rt.endFor(f, 0);
	return L;
});

// inventory.dm:108
rt.def("/mob/proc/get_held_index_of_item", function get_held_index_of_item(f: Frame, I: Value) {
	return this.held_items.Find(I);
});

// inventory.dm:114
rt.def("/mob/proc/is_holding", function is_holding(f: Frame, I: Value) {
	return this.get_held_index_of_item(I);
});

// inventory.dm:119
rt.def("/mob/proc/is_holding_item_of_type", function is_holding_item_of_type(f: Frame, typepath: Value) {
	let I: Value = null;
	for (I of each(this.held_items, T("/obj/item"))) {
		if (rt.op(f, "IsType", [], [I, typepath])) {
			return I;
		}
	}
	return 0;
});

// inventory.dm:129
rt.def("/mob/proc/get_held_index_name", function get_held_index_name(f: Frame, i: Value) {
	let hand: Value = list();
	if (i > 2) {
		hand += "upper ";
	}
	let num: Value = 0;
	if (!(i % 2)) {
		num = i - 2;
		hand += "right hand";
	} else {
		num = i - 1;
		hand += "left hand";
	}
	num -= num * 0.5;
	if (num > 1) {
		hand += ` #${num}`;
	}
	return hand.Join();
});

// inventory.dm:152
rt.def("/mob/proc/can_put_in_hand", function can_put_in_hand(f: Frame, I: Value, hand_index: Value) {
	if (!this.put_in_hand_check(I)) {
		return 0;
	}
	if (!this.has_hand_for_held_index(hand_index)) {
		return 0;
	}
	return (!rt.index(this.held_items, hand_index) ? 1 : 0);
});

// inventory.dm:159
rt.def("/mob/proc/put_in_hand", function* put_in_hand(f: Frame, I: Value, hand_index: Value) {
	if (this.can_put_in_hand(I, hand_index)) {
		yield* I.forceMove(this);
		rt.setAt(this.held_items, hand_index, I);
		I.layer = ABOVE_HUD_LAYER;
		I.plane = ABOVE_HUD_PLANE;
		yield* I.equipped(this, slot_hands);
		if (I.pulledby) {
			yield* I.pulledby.stop_pulling();
		}
		yield* this.update_inv_hands();
		I.pixel_x = rt.initial(f, I, "pixel_x");
		I.pixel_y = rt.initial(f, I, "pixel_y");
		return (hand_index || 1);
	}
	return 0;
}, true);

// inventory.dm:176
rt.def("/mob/proc/put_in_l_hand", function* put_in_l_hand(f: Frame, I: Value) {
	return (yield* this.put_in_hand(I, this.get_empty_held_index_for_side("l")));
}, true);

// inventory.dm:181
rt.def("/mob/proc/put_in_r_hand", function* put_in_r_hand(f: Frame, I: Value) {
	return (yield* this.put_in_hand(I, this.get_empty_held_index_for_side("r")));
}, true);

// inventory.dm:185
rt.def("/mob/proc/put_in_hand_check", function put_in_hand_check(f: Frame, I: Value) {
	if (this.lying && !rt.bitAnd(I.flags, ABSTRACT)) {
		return 0;
	}
	if (!rt.istype(I, T("/obj/item"))) {
		return 0;
	}
	return 1;
});

// inventory.dm:194
rt.def("/mob/proc/put_in_active_hand", function* put_in_active_hand(f: Frame, I: Value) {
	return (yield* this.put_in_hand(I, this.active_hand_index));
}, true);

// inventory.dm:199
rt.def("/mob/proc/put_in_inactive_hand", function* put_in_inactive_hand(f: Frame, I: Value) {
	return (yield* this.put_in_hand(I, this.get_inactive_hand_index()));
}, true);

// inventory.dm:206
rt.def("/mob/proc/put_in_hands", function* put_in_hands(f: Frame, I: Value, del_on_fail: Value) {
	let hand: Value = null;
	del_on_fail ??= 0;
	if (!I) {
		return 0;
	}
	if (yield* this.put_in_active_hand(I)) {
		return 1;
	}
	if (!(hand = this.get_empty_held_index_for_side("l"))) {
		hand = this.get_empty_held_index_for_side("r");
	}
	if (hand) {
		if (yield* this.put_in_hand(I, hand)) {
			return 1;
		}
	}
	if (del_on_fail) {
		yield* qdel(I);
		return 0;
	}
	yield* I.forceMove(rt.getStep(f, this, 0));
	I.layer = rt.initial(f, I, "layer");
	I.plane = rt.initial(f, I, "plane");
	yield* I.dropped(this);
	return 0;
}, true);

// inventory.dm:227
rt.def("/mob/proc/put_in_hands_or_del", function* put_in_hands_or_del(f: Frame, I: Value) {
	return (yield* this.put_in_hands(I, 1));
}, true);

// inventory.dm:231
rt.def("/mob/proc/drop_item_v", function* drop_item_v(f: Frame) {
	if (this.stat == 0 && isturf(this.loc)) {
		return (yield* this.drop_item());
	}
	return 0;
}, true);

// inventory.dm:237
rt.def("/mob/proc/drop_all_held_items", function* drop_all_held_items(f: Frame) {
	let I: Value = null;
	if (!this.loc || !this.loc.allow_drop()) {
		return f.dot;
	}
	for (I of each(this.held_items, T("/obj/item"))) {
		yield* this.dropItemToGround(I);
	}
	return f.dot;
}, true);

// inventory.dm:244
rt.def("/mob/proc/drop_item", function* drop_item(f: Frame) {
	let held: Value = null;
	if (!this.loc || !this.loc.allow_drop()) {
		return f.dot;
	}
	return (yield* this.dropItemToGround((held = this.get_active_held_item())));
}, true);

// inventory.dm:253
rt.def("/mob/proc/canUnEquip", function canUnEquip(f: Frame, I: Value, force: Value) {
	if (!I) {
		return 1;
	}
	if (rt.bitAnd(I.flags, NODROP) && !force) {
		return 0;
	}
	return 1;
});

// inventory.dm:260
rt.def("/mob/proc/putItemFromInventoryInHandIfPossible", function* putItemFromInventoryInHandIfPossible(f: Frame, I: Value, hand_index: Value, force_removal: Value) {
	force_removal ??= 0;
	if (!this.can_put_in_hand(I, hand_index)) {
		return 0;
	}
	if (!(yield* this.temporarilyRemoveItemFromInventory(I, force_removal))) {
		return 0;
	}
	yield* I.remove_item_from_storage(this);
	if (!(yield* this.put_in_hand(I, hand_index))) {
		yield* qdel(I);
		CRASH("Assertion failure: putItemFromInventoryInHandIfPossible");
	}
	return 1;
}, true);

// inventory.dm:275
rt.def("/mob/proc/dropItemToGround", function* dropItemToGround(f: Frame, I: Value, force: Value) {
	force ??= 0;
	return (yield* this.doUnEquip(I, force, this.loc, 0));
}, true, { argTypes: [{ type: 4, path: "/obj/item" }, {  }] });

// inventory.dm:279
rt.def("/mob/proc/transferItemToLoc", function* transferItemToLoc(f: Frame, I: Value, newloc: Value, force: Value) {
	force ??= 0;
	return (yield* this.doUnEquip(I, force, newloc, 0));
}, true);

// inventory.dm:284
rt.def("/mob/proc/temporarilyRemoveItemFromInventory", function* temporarilyRemoveItemFromInventory(f: Frame, I: Value, force: Value, idrop: Value) {
	force ??= 0;
	idrop ??= 1;
	return (yield* this.doUnEquip(I, force, null, 1, idrop));
}, true);

// inventory.dm:292
rt.def("/mob/proc/doUnEquip", function* doUnEquip(f: Frame, I: Value, force: Value, newloc: Value, no_move: Value, invdrop: Value) {
	let hand_index: Value = null;
	invdrop ??= 1;
	if (!I) {
		return 1;
	}
	if (rt.bitAnd(I.flags, NODROP) && !force) {
		return 0;
	}
	if (hand_index = this.get_held_index_of_item(I)) {
		rt.setAt(this.held_items, hand_index, null);
		yield* this.update_inv_hands();
	}
	if (I) {
		if (this.client) {
			this.client.screen -= I;
		}
		I.layer = rt.initial(f, I, "layer");
		I.plane = rt.initial(f, I, "plane");
		(rt.modField(f, I, "appearance_flags", 16777199, rt.bitAnd));
		if (!no_move && !rt.bitAnd(I.flags, DROPDEL)) {
			yield* I.forceMove(newloc);
			if (isturf(newloc) && rt.istype(I, T("/obj/item")) && I.loc == newloc) {
				yield* I.do_drop_animation(this);
			}
		}
		yield* I.dropped(this);
	}
	return 1;
}, true);

// inventory.dm:321
rt.def("/mob/living/carbon/proc/get_equipped_items", function get_equipped_items(f: Frame) {
	let items: Value = list();
	if (this.back) {
		items += this.back;
	}
	if (this.head) {
		items += this.head;
	}
	if (this.wear_mask) {
		items += this.wear_mask;
	}
	if (this.wear_neck) {
		items += this.wear_neck;
	}
	return items;
});

// inventory.dm:333
rt.def("/mob/living/carbon/human/proc/get_equipped_items", function get_equipped_items(f: Frame) {
	let items: Value = parent_proc();
	if (this.belt) {
		items += this.belt;
	}
	if (this.ears) {
		items += this.ears;
	}
	if (this.glasses) {
		items += this.glasses;
	}
	if (this.gloves) {
		items += this.gloves;
	}
	if (this.shoes) {
		items += this.shoes;
	}
	if (this.wear_id) {
		items += this.wear_id;
	}
	if (this.wear_suit) {
		items += this.wear_suit;
	}
	if (this.w_uniform) {
		items += this.w_uniform;
	}
	return items;
});

// inventory.dm:353
rt.def("/mob/living/proc/unequip_everything", function* unequip_everything(f: Frame) {
	let I: Value = null;
	let items: Value = list();
	(items = rt.modify(items, this.get_equipped_items(), rt.bitOr));
	for (I of each(items)) {
		yield* this.dropItemToGround(I);
	}
	yield* this.drop_all_held_items();
	return f.dot;
}, true);

// inventory.dm:360
rt.def("/obj/item/proc/equip_to_best_slot", function* equip_to_best_slot(f: Frame, M: Value) {
	let S: Value = null;
	if (this != M.get_active_held_item()) {
		to_chat(M, "<span class='warning'>You are not holding anything to equip!</span>");
		return 0;
	}
	if (yield* M.equip_to_appropriate_slot(this)) {
		yield* M.update_inv_hands();
		return 1;
	} else if (this.equip_delay_self) {
		return f.dot;
	}
	if (M.s_active && M.s_active.can_be_inserted(this, 1)) {
		yield* M.s_active.handle_item_insertion(this);
		return 1;
	}
	if (rt.istype((S = M.get_inactive_held_item()), T("/obj/item/weapon/storage")) && S.can_be_inserted(this, 1)) {
		yield* S.handle_item_insertion(this);
		return 1;
	}
	if (rt.istype((S = M.get_item_by_slot(slot_belt)), T("/obj/item/weapon/storage")) && S.can_be_inserted(this, 1)) {
		yield* S.handle_item_insertion(this);
		return 1;
	}
	if (rt.istype((S = M.get_item_by_slot(slot_generic_dextrous_storage)), T("/obj/item/weapon/storage")) && S.can_be_inserted(this, 1)) {
		yield* S.handle_item_insertion(this);
	}
	if (rt.istype((S = M.get_item_by_slot(1)), T("/obj/item/weapon/storage")) && S.can_be_inserted(this, 1)) {
		yield* S.handle_item_insertion(this);
		return 1;
	}
	to_chat(M, "<span class='warning'>You are unable to equip that!</span>");
	return 0;
}, true);

// inventory.dm:402
rt.def("/mob/verb/quick_equip", function* quick_equip(f: Frame) {
	let I: Value = null;
	if (!(I = this.get_active_held_item())) return f.dot;
	yield* I.equip_to_best_slot(this);
	return f.dot;
}, true, { hidden: true, verb: { name: "quick-equip" } });
