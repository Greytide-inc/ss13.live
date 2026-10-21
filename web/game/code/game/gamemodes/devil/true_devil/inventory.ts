// From code/game/gamemodes/devil/true_devil/inventory.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/carbon/true_devil/proc/doUnEquip  (code/game/gamemodes/devil/true_devil/inventory.dm:2)  may sleep
rt.def("/mob/living/carbon/true_devil/proc/doUnEquip", function* doUnEquip(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		yield* g.srcCall(f, "update_inv_hands");
		return 1;
	}
	return 0;
}, true, { args: ["I", "force"] });

// /mob/living/carbon/true_devil/proc/update_inv_hands  (code/game/gamemodes/devil/true_devil/inventory.dm:9)
rt.def("/mob/living/carbon/true_devil/proc/update_inv_hands", function update_inv_hands(f: Frame) {
	let hands_overlays: Value = null, l_hand: Value = null, r_hand: Value = null, r_state: Value = null, r_hand_overlay: Value = null, l_state: Value = null, l_hand_overlay: Value = null;
	f.vars = () => [hands_overlays, l_hand, r_hand, r_state, r_hand_overlay, l_state, l_hand_overlay];
	rt.callSrc(f, "remove_overlay", [1]);
	hands_overlays = rt.list();
	l_hand = rt.callSrc(f, "get_item_for_held_index", [1]);
	if (truthy((r_hand = rt.callSrc(f, "get_item_for_held_index", [2])))) {
		if (!truthy((r_state = rt.fv(f, "item_state", live(r_hand))))) {
			r_state = rt.fv(f, "icon_state", live(r_hand));
		}
		hands_overlays = rt.modify(live(hands_overlays), (r_hand_overlay = rt.callName(f, live(r_hand), "build_worn_icon", ["state", live(r_state), "default_layer", 1, "default_icon_file", rt.fv(f, "righthand_file", live(r_hand)), "isinhands", 1], rt.Args.Named)), add);
		if (((truthy(rt.sv(f, "client")) && truthy(rt.sv(f, "hud_used"))) && !isEqual(rt.fv(f, "hud_version", rt.sv(f, "hud_used")), 3))) {
			rt.setFv(f, "layer", live(r_hand), 20);
			rt.setFv(f, "plane", live(r_hand), 20);
			rt.setFv(f, "screen_loc", live(r_hand), rt.call(f, P("/proc/ui_hand_position"), null, [rt.callSrc(f, "get_held_index_of_item", [live(r_hand)])]));
			(rt.modField(f, rt.sv(f, "client"), "screen", live(r_hand), rt.bitOr));
		}
	}
	if (truthy(live(l_hand))) {
		if (!truthy((l_state = rt.fv(f, "item_state", live(l_hand))))) {
			l_state = rt.fv(f, "icon_state", live(l_hand));
		}
		hands_overlays = rt.modify(live(hands_overlays), (l_hand_overlay = rt.callName(f, live(l_hand), "build_worn_icon", ["state", live(l_state), "default_layer", 1, "default_icon_file", rt.fv(f, "lefthand_file", live(l_hand)), "isinhands", 1], rt.Args.Named)), add);
		if (((truthy(rt.sv(f, "client")) && truthy(rt.sv(f, "hud_used"))) && !isEqual(rt.fv(f, "hud_version", rt.sv(f, "hud_used")), 3))) {
			rt.setFv(f, "layer", live(l_hand), 20);
			rt.setFv(f, "plane", live(l_hand), 20);
			rt.setFv(f, "screen_loc", live(l_hand), rt.call(f, P("/proc/ui_hand_position"), null, [rt.callSrc(f, "get_held_index_of_item", [live(l_hand)])]));
			(rt.modField(f, rt.sv(f, "client"), "screen", live(l_hand), rt.bitOr));
		}
	}
	if (truthy(rt.len(f, live(hands_overlays)))) {
		rt.setAt(rt.sv(f, "devil_overlays"), 1, live(hands_overlays));
	}
	rt.callSrc(f, "apply_overlay", [1]);
	return f.dot;
});

// /mob/living/carbon/true_devil/proc/remove_overlay  (code/game/gamemodes/devil/true_devil/inventory.dm:50)
rt.def("/mob/living/carbon/true_devil/proc/remove_overlay", function remove_overlay(f: Frame, cache_index: Value) {
	let I: Value = null;
	f.vars = () => [I];
	if (!truthy((I = rt.index(rt.sv(f, "devil_overlays"), live(cache_index))))) return f.dot;
	rt.callSrc(f, "cut_overlay", [live(I)]);
	rt.setAt(rt.sv(f, "devil_overlays"), live(cache_index), null);
	return f.dot;
});

// /mob/living/carbon/true_devil/proc/apply_overlay  (code/game/gamemodes/devil/true_devil/inventory.dm:57)
rt.def("/mob/living/carbon/true_devil/proc/apply_overlay", function apply_overlay(f: Frame, cache_index: Value) {
	if (!truthy((f.dot = rt.index(rt.sv(f, "devil_overlays"), live(cache_index))))) return f.dot;
	rt.callSrc(f, "add_overlay", [live(f.dot)]);
	return f.dot;
});
