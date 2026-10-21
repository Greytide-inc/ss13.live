// From code/modules/mob/inventory.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/proc/get_active_held_item  (code/modules/mob/inventory.dm:6)
rt.def("/mob/proc/get_active_held_item", function get_active_held_item(f: Frame) {
	return rt.callSrc(f, "get_item_for_held_index", [rt.sv(f, "active_hand_index")]);
});

// /mob/proc/get_inactive_held_item  (code/modules/mob/inventory.dm:12)
rt.def("/mob/proc/get_inactive_held_item", function get_inactive_held_item(f: Frame) {
	return rt.callSrc(f, "get_item_for_held_index", [rt.callSrc(f, "get_inactive_hand_index", [])]);
});

// /mob/proc/get_inactive_hand_index  (code/modules/mob/inventory.dm:19)
rt.def("/mob/proc/get_inactive_hand_index", function get_inactive_hand_index(f: Frame) {
	let other_hand: Value = null;
	f.vars = () => [other_hand];
	other_hand = 0;
	if (!truthy(rt.modulus(rt.sv(f, "active_hand_index"), 2))) {
		other_hand = subtract(rt.sv(f, "active_hand_index"), 1);
	} else {
		other_hand = add(rt.sv(f, "active_hand_index"), 1);
	}
	if ((rt.lt(live(other_hand), 0) || rt.gt(live(other_hand), rt.len(f, rt.sv(f, "held_items"))))) {
		other_hand = 0;
	}
	return live(other_hand);
});

// /mob/proc/get_item_for_held_index  (code/modules/mob/inventory.dm:29)
rt.def("/mob/proc/get_item_for_held_index", function get_item_for_held_index(f: Frame, i: Value) {
	if ((rt.gt(live(i), 0) && rt.le(live(i), rt.len(f, rt.sv(f, "held_items"))))) {
		return rt.index(rt.sv(f, "held_items"), live(i));
	}
	return 0;
});

// /mob/proc/held_index_to_dir  (code/modules/mob/inventory.dm:36)
rt.def("/mob/proc/held_index_to_dir", function held_index_to_dir(f: Frame, i: Value) {
	if (!truthy(rt.modulus(live(i), 2))) {
		return "r";
	}
	return "l";
});

// /mob/proc/has_active_hand  (code/modules/mob/inventory.dm:48)
rt.def("/mob/proc/has_active_hand", function has_active_hand(f: Frame) {
	return rt.callSrc(f, "has_hand_for_held_index", [rt.sv(f, "active_hand_index")]);
});

// /mob/proc/get_empty_held_index_for_side  (code/modules/mob/inventory.dm:58)
rt.def("/mob/proc/get_empty_held_index_for_side", function get_empty_held_index_for_side(f: Frame, side: Value, all: Value) {
	let start: Value = null, empty_indexes: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [side, all, start, empty_indexes, i, $e];
	if (live(side) === null) {
		side = "left";
	}
	if (live(all) === null) {
		all = 0;
	}
	start = 0;
	if (truthy(rt.index(rt.gl("lefts"), live(side)))) {
		start = 1;
	} else {
		if (truthy(rt.index(rt.gl("rights"), live(side)))) {
			start = 2;
		}
	}
	if (!truthy(live(start))) {
		return 0;
	}
	empty_indexes = null;
	i = null;
	rt.forRange(f, 0, live(start), rt.len(f, rt.sv(f, "held_items")), 2);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (!truthy(rt.index(rt.sv(f, "held_items"), live(i)))) {
			if (!truthy(live(all))) {
				return live(i);
			}
			if (!truthy(live(empty_indexes))) {
				empty_indexes = rt.list();
			}
			empty_indexes = rt.modify(live(empty_indexes), live(i), add);
		}
	}
	rt.endFor(f, 0);
	return live(empty_indexes);
});

// /mob/proc/get_held_items_for_side  (code/modules/mob/inventory.dm:80)
rt.def("/mob/proc/get_held_items_for_side", function get_held_items_for_side(f: Frame, side: Value, all: Value) {
	let start: Value = null, holding_items: Value = null, i: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [side, all, start, holding_items, i, I, $e];
	if (live(side) === null) {
		side = "left";
	}
	if (live(all) === null) {
		all = 0;
	}
	start = 0;
	if (truthy(rt.index(rt.gl("lefts#2"), live(side)))) {
		start = 1;
	} else {
		if (truthy(rt.index(rt.gl("rights#2"), live(side)))) {
			start = 2;
		}
	}
	if (!truthy(live(start))) {
		return 0;
	}
	holding_items = null;
	i = null;
	rt.forRange(f, 0, live(start), rt.len(f, rt.sv(f, "held_items")), 2);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (truthy((I = rt.index(rt.sv(f, "held_items"), live(i))))) {
			if (!truthy(live(all))) {
				return live(I);
			}
			if (!truthy(live(holding_items))) {
				holding_items = rt.list();
			}
			holding_items = rt.modify(live(holding_items), live(I), add);
		}
	}
	rt.endFor(f, 0);
	return live(holding_items);
});

// /mob/proc/get_empty_held_indexes  (code/modules/mob/inventory.dm:100)
rt.def("/mob/proc/get_empty_held_indexes", function get_empty_held_indexes(f: Frame) {
	let L: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [L, i, $e];
	L = null;
	i = null;
	rt.forRange(f, 0, 1, rt.len(f, rt.sv(f, "held_items")), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (!truthy(rt.index(rt.sv(f, "held_items"), live(i)))) {
			if (!truthy(live(L))) {
				L = rt.list();
			}
			L = rt.modify(live(L), live(i), add);
		}
	}
	rt.endFor(f, 0);
	return live(L);
});

// /mob/proc/get_held_index_of_item  (code/modules/mob/inventory.dm:108)
rt.def("/mob/proc/get_held_index_of_item", function get_held_index_of_item(f: Frame, I: Value) {
	return rt.callName(f, rt.sv(f, "held_items"), "Find", [live(I)]);
});

// /mob/proc/is_holding  (code/modules/mob/inventory.dm:114)
rt.def("/mob/proc/is_holding", function is_holding(f: Frame, I: Value) {
	return rt.callSrc(f, "get_held_index_of_item", [live(I)]);
});

// /mob/proc/is_holding_item_of_type  (code/modules/mob/inventory.dm:119)
rt.def("/mob/proc/is_holding_item_of_type", function is_holding_item_of_type(f: Frame, typepath: Value) {
	let I: Value = null;
	let $e: any;
	f.vars = () => [I, $e];
	I = null;
	rt.forList(f, 0, rt.sv(f, "held_items"), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (truthy(rt.op(f, "IsType", [], [live(I), live(typepath)]))) {
			return live(I);
		}
	}
	rt.endFor(f, 0);
	return 0;
});

// /mob/proc/get_held_index_name  (code/modules/mob/inventory.dm:129)
rt.def("/mob/proc/get_held_index_name", function get_held_index_name(f: Frame, i: Value) {
	let hand: Value = null, num: Value = null;
	f.vars = () => [hand, num];
	hand = rt.list();
	if (rt.gt(live(i), 2)) {
		hand = rt.modify(live(hand), "upper ", add);
	}
	num = 0;
	if (!truthy(rt.modulus(live(i), 2))) {
		num = subtract(live(i), 2);
		hand = rt.modify(live(hand), "right hand", add);
	} else {
		num = subtract(live(i), 1);
		hand = rt.modify(live(hand), "left hand", add);
	}
	(num = rt.modify(live(num), multiply(live(num), 0.5), subtract));
	if (rt.gt(live(num), 1)) {
		hand = rt.modify(live(hand), fmt(" #＀", [live(num)]), add);
	}
	return rt.callName(f, live(hand), "Join", []);
});

// /mob/proc/can_put_in_hand  (code/modules/mob/inventory.dm:152)
rt.def("/mob/proc/can_put_in_hand", function can_put_in_hand(f: Frame, I: Value, hand_index: Value) {
	if (!truthy(rt.callSrc(f, "put_in_hand_check", [live(I)]))) {
		return 0;
	}
	if (!truthy(rt.callSrc(f, "has_hand_for_held_index", [live(hand_index)]))) {
		return 0;
	}
	return (!truthy(rt.index(rt.sv(f, "held_items"), live(hand_index))) ? 1 : 0);
});

// /mob/proc/put_in_hand  (code/modules/mob/inventory.dm:159)  may sleep
rt.def("/mob/proc/put_in_hand", function* put_in_hand(f: Frame, I: Value, hand_index: Value) {
	f.vars = () => [I, hand_index];
	if (truthy((yield* g.srcCall(f, "can_put_in_hand", live(I), live(hand_index))))) {
		yield* g.callName(f, live(I), "forceMove", [live(f.src)]);
		rt.setAt(rt.sv(f, "held_items"), live(hand_index), live(I));
		rt.setFv(f, "layer", live(I), 20);
		rt.setFv(f, "plane", live(I), 20);
		yield* g.callName(f, live(I), "equipped", [live(f.src), 4]);
		if (truthy(rt.fv(f, "pulledby", live(I)))) {
			yield* g.callName(f, rt.fv(f, "pulledby", live(I)), "stop_pulling", []);
		}
		yield* g.srcCall(f, "update_inv_hands");
		rt.setFv(f, "pixel_x", live(I), rt.initial(f, live(I), "pixel_x"));
		rt.setFv(f, "pixel_y", live(I), rt.initial(f, live(I), "pixel_y"));
		return (live(hand_index) || 1);
	}
	return 0;
}, true);

// /mob/proc/put_in_l_hand  (code/modules/mob/inventory.dm:176)  may sleep
rt.def("/mob/proc/put_in_l_hand", function* put_in_l_hand(f: Frame, I: Value) {
	f.vars = () => [I];
	return (yield* g.srcCall(f, "put_in_hand", live(I), (yield* g.srcCall(f, "get_empty_held_index_for_side", "l"))));
}, true);

// /mob/proc/put_in_r_hand  (code/modules/mob/inventory.dm:181)  may sleep
rt.def("/mob/proc/put_in_r_hand", function* put_in_r_hand(f: Frame, I: Value) {
	f.vars = () => [I];
	return (yield* g.srcCall(f, "put_in_hand", live(I), (yield* g.srcCall(f, "get_empty_held_index_for_side", "r"))));
}, true);

// /mob/proc/put_in_hand_check  (code/modules/mob/inventory.dm:185)
rt.def("/mob/proc/put_in_hand_check", function put_in_hand_check(f: Frame, I: Value) {
	if ((truthy(rt.sv(f, "lying")) && !truthy(rt.bitAnd(rt.fv(f, "flags", live(I)), 128)))) {
		return 0;
	}
	if (!truthy((rt.istype(live(I), T("/obj/item")) ? 1 : 0))) {
		return 0;
	}
	return 1;
});

// /mob/proc/put_in_active_hand  (code/modules/mob/inventory.dm:194)  may sleep
rt.def("/mob/proc/put_in_active_hand", function* put_in_active_hand(f: Frame, I: Value) {
	f.vars = () => [I];
	return (yield* g.srcCall(f, "put_in_hand", live(I), rt.sv(f, "active_hand_index")));
}, true);

// /mob/proc/put_in_inactive_hand  (code/modules/mob/inventory.dm:199)  may sleep
rt.def("/mob/proc/put_in_inactive_hand", function* put_in_inactive_hand(f: Frame, I: Value) {
	f.vars = () => [I];
	return (yield* g.srcCall(f, "put_in_hand", live(I), (yield* g.srcCall(f, "get_inactive_hand_index"))));
}, true);

// /mob/proc/put_in_hands  (code/modules/mob/inventory.dm:206)  may sleep
rt.def("/mob/proc/put_in_hands", function* put_in_hands(f: Frame, I: Value, del_on_fail: Value) {
	let hand: Value = null;
	f.vars = () => [I, del_on_fail, hand];
	if (live(del_on_fail) === null) {
		del_on_fail = 0;
	}
	if (!truthy(live(I))) {
		return 0;
	}
	if (truthy((yield* g.srcCall(f, "put_in_active_hand", live(I))))) {
		return 1;
	}
	if (!truthy((hand = (yield* g.srcCall(f, "get_empty_held_index_for_side", "l"))))) {
		hand = (yield* g.srcCall(f, "get_empty_held_index_for_side", "r"));
	}
	if (truthy(live(hand))) {
		if (truthy((yield* g.srcCall(f, "put_in_hand", live(I), live(hand))))) {
			return 1;
		}
	}
	if (truthy(live(del_on_fail))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(I)]);
		return 0;
	}
	yield* g.callName(f, live(I), "forceMove", [rt.getStep(f, live(f.src), 0)]);
	rt.setFv(f, "layer", live(I), rt.initial(f, live(I), "layer"));
	rt.setFv(f, "plane", live(I), rt.initial(f, live(I), "plane"));
	yield* g.callName(f, live(I), "dropped", [live(f.src)]);
	return 0;
}, true);

// /mob/proc/put_in_hands_or_del  (code/modules/mob/inventory.dm:227)  may sleep
rt.def("/mob/proc/put_in_hands_or_del", function* put_in_hands_or_del(f: Frame, I: Value) {
	f.vars = () => [I];
	return (yield* g.srcCall(f, "put_in_hands", live(I), 1));
}, true);

// /mob/proc/drop_item_v  (code/modules/mob/inventory.dm:231)  may sleep
rt.def("/mob/proc/drop_item_v", function* drop_item_v(f: Frame) {
	if ((isEqual(rt.sv(f, "stat"), 0) && truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")]))))) {
		return (yield* g.srcCall(f, "drop_item"));
	}
	return 0;
}, true);

// /mob/proc/drop_all_held_items  (code/modules/mob/inventory.dm:237)  may sleep
rt.def("/mob/proc/drop_all_held_items", function* drop_all_held_items(f: Frame) {
	let I: Value = null;
	let $e: any;
	f.vars = () => [I, $e];
	if ((!truthy(rt.sv(f, "loc")) || !truthy((yield* g.callName(f, rt.sv(f, "loc"), "allow_drop", []))))) {
		return live(f.dot);
	}
	I = null;
	rt.forList(f, 0, rt.sv(f, "held_items"), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		yield* g.srcCall(f, "dropItemToGround", live(I));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /mob/proc/drop_item  (code/modules/mob/inventory.dm:244)  may sleep
rt.def("/mob/proc/drop_item", function* drop_item(f: Frame) {
	let held: Value = null;
	f.vars = () => [held];
	if ((!truthy(rt.sv(f, "loc")) || !truthy((yield* g.callName(f, rt.sv(f, "loc"), "allow_drop", []))))) {
		return live(f.dot);
	}
	return (yield* g.srcCall(f, "dropItemToGround", (held = (yield* g.srcCall(f, "get_active_held_item")))));
}, true);

// /mob/proc/canUnEquip  (code/modules/mob/inventory.dm:253)
rt.def("/mob/proc/canUnEquip", function canUnEquip(f: Frame, I: Value, force: Value) {
	if (!truthy(live(I))) {
		return 1;
	}
	if ((truthy(rt.bitAnd(rt.fv(f, "flags", live(I)), 2)) && !truthy(live(force)))) {
		return 0;
	}
	return 1;
});

// /mob/proc/putItemFromInventoryInHandIfPossible  (code/modules/mob/inventory.dm:260)  may sleep
rt.def("/mob/proc/putItemFromInventoryInHandIfPossible", function* putItemFromInventoryInHandIfPossible(f: Frame, I: Value, hand_index: Value, force_removal: Value) {
	f.vars = () => [I, hand_index, force_removal];
	if (live(force_removal) === null) {
		force_removal = 0;
	}
	if (!truthy((yield* g.srcCall(f, "can_put_in_hand", live(I), live(hand_index))))) {
		return 0;
	}
	if (!truthy((yield* g.srcCall(f, "temporarilyRemoveItemFromInventory", live(I), live(force_removal))))) {
		return 0;
	}
	yield* g.callName(f, live(I), "remove_item_from_storage", [live(f.src)]);
	if (!truthy((yield* g.srcCall(f, "put_in_hand", live(I), live(hand_index))))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(I)]);
		yield* g.call(f, P("/proc/CRASH"), null, ["Assertion failure: putItemFromInventoryInHandIfPossible"]);
	}
	return 1;
}, true);

// /mob/proc/dropItemToGround  (code/modules/mob/inventory.dm:275)  may sleep
rt.def("/mob/proc/dropItemToGround", function* dropItemToGround(f: Frame, I: Value, force: Value) {
	f.vars = () => [I, force];
	if (live(force) === null) {
		force = 0;
	}
	return (yield* g.srcCall(f, "doUnEquip", live(I), live(force), rt.sv(f, "loc"), 0));
}, true, { argTypes: [{ type: 4, path: "/obj/item" }, {  }] });

// /mob/proc/transferItemToLoc  (code/modules/mob/inventory.dm:279)  may sleep
rt.def("/mob/proc/transferItemToLoc", function* transferItemToLoc(f: Frame, I: Value, newloc: Value, force: Value) {
	f.vars = () => [I, newloc, force];
	if (live(newloc) === null) {
		newloc = null;
	}
	if (live(force) === null) {
		force = 0;
	}
	return (yield* g.srcCall(f, "doUnEquip", live(I), live(force), live(newloc), 0));
}, true);

// /mob/proc/temporarilyRemoveItemFromInventory  (code/modules/mob/inventory.dm:284)  may sleep
rt.def("/mob/proc/temporarilyRemoveItemFromInventory", function* temporarilyRemoveItemFromInventory(f: Frame, I: Value, force: Value, idrop: Value) {
	f.vars = () => [I, force, idrop];
	if (live(force) === null) {
		force = 0;
	}
	if (live(idrop) === null) {
		idrop = 1;
	}
	return (yield* g.srcCall(f, "doUnEquip", live(I), live(force), null, 1, live(idrop)));
}, true);

// /mob/proc/doUnEquip  (code/modules/mob/inventory.dm:292)  may sleep
rt.def("/mob/proc/doUnEquip", function* doUnEquip(f: Frame, I: Value, force: Value, newloc: Value, no_move: Value, invdrop: Value) {
	let hand_index: Value = null;
	f.vars = () => [I, force, newloc, no_move, invdrop, hand_index];
	if (live(invdrop) === null) {
		invdrop = 1;
	}
	if (!truthy(live(I))) {
		return 1;
	}
	if ((truthy(rt.bitAnd(rt.fv(f, "flags", live(I)), 2)) && !truthy(live(force)))) {
		return 0;
	}
	if (truthy((hand_index = (yield* g.srcCall(f, "get_held_index_of_item", live(I)))))) {
		rt.setAt(rt.sv(f, "held_items"), live(hand_index), null);
		yield* g.srcCall(f, "update_inv_hands");
	}
	if (truthy(live(I))) {
		if (truthy(rt.sv(f, "client"))) {
			(rt.modField(f, rt.sv(f, "client"), "screen", live(I), subtract));
		}
		rt.setFv(f, "layer", live(I), rt.initial(f, live(I), "layer"));
		rt.setFv(f, "plane", live(I), rt.initial(f, live(I), "plane"));
		(rt.modField(f, live(I), "appearance_flags", 16777199, rt.bitAnd));
		if ((!truthy(live(no_move)) && !truthy(rt.bitAnd(rt.fv(f, "flags", live(I)), 16384)))) {
			yield* g.callName(f, live(I), "forceMove", [live(newloc)]);
			if (((truthy((yield* g.call(f, P("/proc/isturf"), null, [live(newloc)]))) && truthy((rt.istype(live(I), T("/obj/item")) ? 1 : 0))) && isEqual(rt.fv(f, "loc", live(I)), live(newloc)))) {
				yield* g.callName(f, live(I), "do_drop_animation", [live(f.src)]);
			}
		}
		yield* g.callName(f, live(I), "dropped", [live(f.src)]);
	}
	return 1;
}, true);

// /mob/living/carbon/proc/get_equipped_items  (code/modules/mob/inventory.dm:321)
rt.def("/mob/living/carbon/proc/get_equipped_items", function get_equipped_items(f: Frame) {
	let items: Value = null;
	f.vars = () => [items];
	items = rt.list();
	if (truthy(rt.sv(f, "back"))) {
		items = rt.modify(live(items), rt.sv(f, "back"), add);
	}
	if (truthy(rt.sv(f, "head"))) {
		items = rt.modify(live(items), rt.sv(f, "head"), add);
	}
	if (truthy(rt.sv(f, "wear_mask"))) {
		items = rt.modify(live(items), rt.sv(f, "wear_mask"), add);
	}
	if (truthy(rt.sv(f, "wear_neck"))) {
		items = rt.modify(live(items), rt.sv(f, "wear_neck"), add);
	}
	return live(items);
});

// /mob/living/carbon/human/proc/get_equipped_items  (code/modules/mob/inventory.dm:333)
rt.def("/mob/living/carbon/human/proc/get_equipped_items", function get_equipped_items(f: Frame) {
	let items: Value = null;
	f.vars = () => [items];
	items = rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "belt"))) {
		items = rt.modify(live(items), rt.sv(f, "belt"), add);
	}
	if (truthy(rt.sv(f, "ears"))) {
		items = rt.modify(live(items), rt.sv(f, "ears"), add);
	}
	if (truthy(rt.sv(f, "glasses"))) {
		items = rt.modify(live(items), rt.sv(f, "glasses"), add);
	}
	if (truthy(rt.sv(f, "gloves"))) {
		items = rt.modify(live(items), rt.sv(f, "gloves"), add);
	}
	if (truthy(rt.sv(f, "shoes"))) {
		items = rt.modify(live(items), rt.sv(f, "shoes"), add);
	}
	if (truthy(rt.sv(f, "wear_id"))) {
		items = rt.modify(live(items), rt.sv(f, "wear_id"), add);
	}
	if (truthy(rt.sv(f, "wear_suit"))) {
		items = rt.modify(live(items), rt.sv(f, "wear_suit"), add);
	}
	if (truthy(rt.sv(f, "w_uniform"))) {
		items = rt.modify(live(items), rt.sv(f, "w_uniform"), add);
	}
	return live(items);
});

// /mob/living/proc/unequip_everything  (code/modules/mob/inventory.dm:353)  may sleep
rt.def("/mob/living/proc/unequip_everything", function* unequip_everything(f: Frame) {
	let items: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [items, I, $e];
	items = rt.list();
	(items = rt.modify(live(items), (yield* g.srcCall(f, "get_equipped_items")), rt.bitOr));
	I = null;
	rt.forList(f, 0, live(items));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		yield* g.srcCall(f, "dropItemToGround", live(I));
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "drop_all_held_items");
	return f.dot;
}, true);

// /obj/item/proc/equip_to_best_slot  (code/modules/mob/inventory.dm:360)  may sleep
rt.def("/obj/item/proc/equip_to_best_slot", function* equip_to_best_slot(f: Frame, M: Value) {
	let S: Value = null;
	f.vars = () => [M, S];
	if (!isEqual(live(f.src), (yield* g.callName(f, live(M), "get_active_held_item", [])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='warning'>You are not holding anything to equip!</span>"]);
		return 0;
	}
	if (truthy((yield* g.callName(f, live(M), "equip_to_appropriate_slot", [live(f.src)])))) {
		yield* g.callName(f, live(M), "update_inv_hands", []);
		return 1;
	} else {
		if (truthy(rt.sv(f, "equip_delay_self"))) {
			return live(f.dot);
		}
	}
	if ((truthy(rt.fv(f, "s_active", live(M))) && truthy((yield* g.callName(f, rt.fv(f, "s_active", live(M)), "can_be_inserted", [live(f.src), 1]))))) {
		yield* g.callName(f, rt.fv(f, "s_active", live(M)), "handle_item_insertion", [live(f.src)]);
		return 1;
	}
	if ((truthy((rt.istype((S = (yield* g.callName(f, live(M), "get_inactive_held_item", []))), T("/obj/item/weapon/storage")) ? 1 : 0)) && truthy((yield* g.callName(f, live(S), "can_be_inserted", [live(f.src), 1]))))) {
		yield* g.callName(f, live(S), "handle_item_insertion", [live(f.src)]);
		return 1;
	}
	if ((truthy((rt.istype((S = (yield* g.callName(f, live(M), "get_item_by_slot", [5]))), T("/obj/item/weapon/storage")) ? 1 : 0)) && truthy((yield* g.callName(f, live(S), "can_be_inserted", [live(f.src), 1]))))) {
		yield* g.callName(f, live(S), "handle_item_insertion", [live(f.src)]);
		return 1;
	}
	if ((truthy((rt.istype((S = (yield* g.callName(f, live(M), "get_item_by_slot", [20]))), T("/obj/item/weapon/storage")) ? 1 : 0)) && truthy((yield* g.callName(f, live(S), "can_be_inserted", [live(f.src), 1]))))) {
		yield* g.callName(f, live(S), "handle_item_insertion", [live(f.src)]);
	}
	if ((truthy((rt.istype((S = (yield* g.callName(f, live(M), "get_item_by_slot", [1]))), T("/obj/item/weapon/storage")) ? 1 : 0)) && truthy((yield* g.callName(f, live(S), "can_be_inserted", [live(f.src), 1]))))) {
		yield* g.callName(f, live(S), "handle_item_insertion", [live(f.src)]);
		return 1;
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='warning'>You are unable to equip that!</span>"]);
	return 0;
}, true);

// /mob/verb/quick_equip  (code/modules/mob/inventory.dm:402)  may sleep
rt.def("/mob/verb/quick_equip", function* quick_equip(f: Frame) {
	let I: Value = null;
	f.vars = () => [I];
	if (!truthy((I = (yield* g.srcCall(f, "get_active_held_item"))))) return f.dot;
	yield* g.callName(f, live(I), "equip_to_best_slot", [live(f.src)]);
	return f.dot;
}, true, { hidden: true, verb: { name: "quick-equip" } });
