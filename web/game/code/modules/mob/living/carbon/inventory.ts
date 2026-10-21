// From code/modules/mob/living/carbon/inventory.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/carbon/proc/get_item_by_slot  (code/modules/mob/living/carbon/inventory.dm:2)
rt.def("/mob/living/carbon/proc/get_item_by_slot", function get_item_by_slot(f: Frame, slot_id: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(slot_id);
	if ($0 === 1) {
		return rt.sv(f, "back");
	} else if ($0 === 2) {
		return rt.sv(f, "wear_mask");
	} else if ($0 === 10) {
		return rt.sv(f, "wear_neck");
	} else if ($0 === 11) {
		return rt.sv(f, "head");
	} else if ($0 === 3) {
		return rt.sv(f, "handcuffed");
	} else if ($0 === 19) {
		return rt.sv(f, "legcuffed");
	}
	return null;
});

// /mob/living/carbon/proc/equip_in_one_of_slots  (code/modules/mob/living/carbon/inventory.dm:18)  may sleep
rt.def("/mob/living/carbon/proc/equip_in_one_of_slots", function* equip_in_one_of_slots(f: Frame, I: Value, slots: Value, qdel_on_fail: Value) {
	let slot: Value = null;
	let $e: any;
	f.vars = () => [I, slots, qdel_on_fail, slot, $e];
	if (live(qdel_on_fail) === null) {
		qdel_on_fail = 1;
	}
	slot = null;
	rt.forList(f, 0, live(slots));
	while (($e = rt.next(f, 0)) !== undefined) {
		slot = $e;
		if (truthy((yield* g.callSrc(f, "equip_to_slot_if_possible", [null, live(I), null, rt.index(live(slots), live(slot)), "qdel_on_fail", 0, "disable_warning", 1], rt.Args.Named)))) {
			return live(slot);
		}
	}
	rt.endFor(f, 0);
	if (truthy(live(qdel_on_fail))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(I)]);
	}
	return null;
}, true);

// /mob/living/carbon/proc/equip_to_slot  (code/modules/mob/living/carbon/inventory.dm:27)  may sleep
rt.def("/mob/living/carbon/proc/equip_to_slot", function* equip_to_slot(f: Frame, I: Value, slot: Value) {
	let index: Value = null, M: Value = null, observe: Value = null, not_handled: Value = null, B: Value = null, prev_jimmies: Value = null;
	let $0: any, $e: any;
	f.vars = () => [I, slot, index, M, observe, not_handled, B, prev_jimmies, $0, $e];
	if (!truthy(live(slot))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(I), T("/obj/item")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (truthy((index = (yield* g.srcCall(f, "get_held_index_of_item", live(I)))))) {
		rt.setAt(rt.sv(f, "held_items"), live(index), null);
	}
	if (truthy(rt.fv(f, "pulledby", live(I)))) {
		yield* g.callName(f, rt.fv(f, "pulledby", live(I)), "stop_pulling", []);
	}
	rt.setFv(f, "screen_loc", live(I), null);
	if (truthy(rt.sv(f, "client"))) {
		(rt.modField(f, rt.sv(f, "client"), "screen", live(I), subtract));
	}
	if ((truthy(rt.sv(f, "observers")) && truthy(rt.len(f, rt.sv(f, "observers"))))) {
		M = null;
		rt.forList(f, 0, rt.sv(f, "observers"));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			if (truthy(rt.gv(f, "client", (observe = live(M))))) {
				(rt.modField(f, rt.fv(f, "client", live(observe)), "screen", live(I), subtract));
			}
		}
		rt.endFor(f, 0);
	}
	rt.setFv(f, "loc", live(I), live(f.src));
	rt.setFv(f, "layer", live(I), 20);
	rt.setFv(f, "plane", live(I), 20);
	(rt.modField(f, live(I), "appearance_flags", 16, rt.bitOr));
	not_handled = 0;
	$0 = live(slot);
	if ($0 === 1) {
		rt.setSv(f, "back", live(I));
		yield* g.srcCall(f, "update_inv_back");
	} else if ($0 === 2) {
		rt.setSv(f, "wear_mask", live(I));
		yield* g.callSrc(f, "wear_mask_update", [null, live(I), "toggle_off", 0], rt.Args.Named);
	} else if ($0 === 11) {
		rt.setSv(f, "head", live(I));
		yield* g.srcCall(f, "head_update", live(I));
	} else if ($0 === 10) {
		rt.setSv(f, "wear_neck", live(I));
		yield* g.srcCall(f, "update_inv_neck", live(I));
	} else if ($0 === 3) {
		rt.setSv(f, "handcuffed", live(I));
		yield* g.srcCall(f, "update_handcuffed");
	} else if ($0 === 19) {
		rt.setSv(f, "legcuffed", live(I));
		yield* g.srcCall(f, "update_inv_legcuffed");
	} else if ($0 === 4) {
		yield* g.srcCall(f, "put_in_hands", live(I));
		yield* g.srcCall(f, "update_inv_hands");
	} else if ($0 === 18) {
		B = rt.sv(f, "back");
		prev_jimmies = rt.fv(f, "rustle_jimmies", live(B));
		rt.setFv(f, "rustle_jimmies", live(B), 0);
		yield* g.callName(f, live(B), "handle_item_insertion", [live(I), 1, live(f.src)]);
		rt.setFv(f, "rustle_jimmies", live(B), live(prev_jimmies));
	} else {
		not_handled = 1;
	}
	if (!truthy(live(not_handled))) {
		yield* g.callName(f, live(I), "equipped", [live(f.src), live(slot)]);
	}
	return live(not_handled);
}, true);

// /mob/living/carbon/proc/doUnEquip  (code/modules/mob/living/carbon/inventory.dm:92)  may sleep
rt.def("/mob/living/carbon/proc/doUnEquip", function* doUnEquip(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if ((!truthy(live(f.dot)) || !truthy(live(f.args[0])))) {
		return live(f.dot);
	}
	if (isEqual(live(f.args[0]), rt.sv(f, "head"))) {
		rt.setSv(f, "head", null);
		yield* g.srcCall(f, "head_update", live(f.args[0]));
	} else {
		if (isEqual(live(f.args[0]), rt.sv(f, "back"))) {
			rt.setSv(f, "back", null);
			yield* g.srcCall(f, "update_inv_back");
		} else {
			if (isEqual(live(f.args[0]), rt.sv(f, "wear_mask"))) {
				rt.setSv(f, "wear_mask", null);
				yield* g.callSrc(f, "wear_mask_update", [null, live(f.args[0]), "toggle_off", 1], rt.Args.Named);
			}
		}
	}
	if (isEqual(live(f.args[0]), rt.sv(f, "wear_neck"))) {
		rt.setSv(f, "wear_neck", null);
		yield* g.srcCall(f, "update_inv_neck", live(f.args[0]));
	} else {
		if (isEqual(live(f.args[0]), rt.sv(f, "handcuffed"))) {
			rt.setSv(f, "handcuffed", null);
			if ((truthy(rt.sv(f, "buckled")) && truthy(rt.fv(f, "buckle_requires_restraints", rt.sv(f, "buckled"))))) {
				yield* g.callName(f, rt.sv(f, "buckled"), "unbuckle_mob", [live(f.src)]);
			}
			yield* g.srcCall(f, "update_handcuffed");
		} else {
			if (!isEqual(live(f.args[0]), rt.sv(f, "legcuffed"))) return f.dot;
			rt.setSv(f, "legcuffed", null);
			yield* g.srcCall(f, "update_inv_legcuffed");
		}
	}
	return f.dot;
}, true, { args: ["I"] });

// /mob/living/proc/wear_mask_update  (code/modules/mob/living/carbon/inventory.dm:119)  may sleep
rt.def("/mob/living/proc/wear_mask_update", function* wear_mask_update(f: Frame, C: Value, toggle_off: Value) {
	f.vars = () => [C, toggle_off];
	if (live(toggle_off) === null) {
		toggle_off = 1;
	}
	yield* g.srcCall(f, "update_inv_wear_mask");
	return f.dot;
}, true);

// /mob/living/carbon/proc/wear_mask_update  (code/modules/mob/living/carbon/inventory.dm:122)  may sleep
rt.def("/mob/living/carbon/proc/wear_mask_update", function* wear_mask_update(f: Frame, C: Value, toggle_off: Value) {
	f.vars = () => [C, toggle_off];
	if (live(toggle_off) === null) {
		toggle_off = 1;
	}
	if ((truthy(rt.fv(f, "tint", live(C))) || truthy(rt.initial(f, live(C), "tint")))) {
		yield* g.srcCall(f, "update_tint");
	}
	yield* g.srcCall(f, "update_inv_wear_mask");
	return f.dot;
}, true);

// /mob/living/carbon/proc/head_update  (code/modules/mob/living/carbon/inventory.dm:128)  may sleep
rt.def("/mob/living/carbon/proc/head_update", function* head_update(f: Frame, I: Value, forced: Value) {
	let C: Value = null;
	f.vars = () => [I, forced, C];
	if (truthy((rt.istype(live(I), T("/obj/item/clothing")) ? 1 : 0))) {
		if ((truthy(rt.gv(f, "tint", (C = live(I)))) || truthy(rt.initial(f, live(C), "tint")))) {
			yield* g.srcCall(f, "update_tint");
		}
		yield* g.srcCall(f, "update_sight");
	}
	if ((truthy(rt.bitAnd(rt.fv(f, "flags_inv", live(I)), 16)) || truthy(live(forced)))) {
		yield* g.srcCall(f, "update_inv_wear_mask");
	}
	yield* g.srcCall(f, "update_inv_head");
	return f.dot;
}, true);
