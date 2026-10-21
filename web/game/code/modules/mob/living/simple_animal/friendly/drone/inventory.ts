// From code/modules/mob/living/simple_animal/friendly/drone/inventory.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/simple_animal/drone/proc/doUnEquip  (code/modules/mob/living/simple_animal/friendly/drone/inventory.dm:10)  may sleep
rt.def("/mob/living/simple_animal/drone/proc/doUnEquip", function* doUnEquip(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		yield* g.srcCall(f, "update_inv_hands");
		if (isEqual(live(f.args[0]), rt.sv(f, "head"))) {
			rt.setSv(f, "head", null);
			yield* g.srcCall(f, "update_inv_head");
		}
		if (isEqual(live(f.args[0]), rt.sv(f, "internal_storage"))) {
			rt.setSv(f, "internal_storage", null);
			yield* g.srcCall(f, "update_inv_internal_storage");
		}
		return 1;
	}
	return 0;
}, true, { args: ["I", "force"] });

// /mob/living/simple_animal/drone/proc/can_equip  (code/modules/mob/living/simple_animal/friendly/drone/inventory.dm:23)
rt.def("/mob/living/simple_animal/drone/proc/can_equip", function can_equip(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(f.args[1]);
	if ($0 === 11) {
		if (truthy(rt.sv(f, "head"))) {
			return 0;
		}
		if (!(truthy(rt.bitAnd(rt.fv(f, "slot_flags", live(f.args[0])), 64)) || truthy(rt.bitAnd(rt.fv(f, "slot_flags", live(f.args[0])), 32)))) {
			return 0;
		}
		return 1;
	} else if ($0 === 20) {
		if (truthy(rt.sv(f, "internal_storage"))) {
			return 0;
		}
		return 1;
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["I", "slot"] });

// /mob/living/simple_animal/drone/proc/get_item_by_slot  (code/modules/mob/living/simple_animal/friendly/drone/inventory.dm:38)
rt.def("/mob/living/simple_animal/drone/proc/get_item_by_slot", function get_item_by_slot(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(f.args[0]);
	if ($0 === 11) {
		return rt.sv(f, "head");
	} else if ($0 === 20) {
		return rt.sv(f, "internal_storage");
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["slot_id"] });

// /mob/living/simple_animal/drone/proc/equip_to_slot  (code/modules/mob/living/simple_animal/friendly/drone/inventory.dm:47)  may sleep
rt.def("/mob/living/simple_animal/drone/proc/equip_to_slot", function* equip_to_slot(f: Frame, I: Value, slot: Value) {
	let index: Value = null;
	let $0: any;
	f.vars = () => [I, slot, index, $0];
	if (!truthy(live(slot))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(I), T("/obj/item")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (truthy((index = (yield* g.srcCall(f, "get_held_index_of_item", live(I)))))) {
		rt.setAt(rt.sv(f, "held_items"), live(index), null);
	}
	yield* g.srcCall(f, "update_inv_hands");
	if (truthy(rt.fv(f, "pulledby", live(I)))) {
		yield* g.callName(f, rt.fv(f, "pulledby", live(I)), "stop_pulling", []);
	}
	rt.setFv(f, "screen_loc", live(I), null);
	rt.setFv(f, "loc", live(I), live(f.src));
	rt.setFv(f, "layer", live(I), 20);
	rt.setFv(f, "plane", live(I), 20);
	$0 = live(slot);
	if ($0 === 11) {
		rt.setSv(f, "head", live(I));
		yield* g.srcCall(f, "update_inv_head");
	} else if ($0 === 20) {
		rt.setSv(f, "internal_storage", live(I));
		yield* g.srcCall(f, "update_inv_internal_storage");
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'>You are trying to equip this item to an unsupported inventory slot. Report this to a coder!</span>"]);
		return live(f.dot);
	}
	yield* g.callName(f, live(I), "equipped", [live(f.src), live(slot)]);
	return f.dot;
}, true);
