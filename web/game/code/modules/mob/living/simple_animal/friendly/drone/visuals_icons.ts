// From code/modules/mob/living/simple_animal/friendly/drone/visuals_icons.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/simple_animal/drone/proc/apply_overlay  (code/modules/mob/living/simple_animal/friendly/drone/visuals_icons.dm:10)
rt.def("/mob/living/simple_animal/drone/proc/apply_overlay", function apply_overlay(f: Frame, cache_index: Value) {
	if (!truthy((f.dot = rt.index(rt.sv(f, "drone_overlays"), live(cache_index))))) return f.dot;
	rt.callSrc(f, "add_overlay", [live(f.dot)]);
	return f.dot;
});

// /mob/living/simple_animal/drone/proc/remove_overlay  (code/modules/mob/living/simple_animal/friendly/drone/visuals_icons.dm:15)
rt.def("/mob/living/simple_animal/drone/proc/remove_overlay", function remove_overlay(f: Frame, cache_index: Value) {
	let I: Value = null;
	f.vars = () => [I];
	if (!truthy((I = rt.index(rt.sv(f, "drone_overlays"), live(cache_index))))) return f.dot;
	rt.callSrc(f, "cut_overlay", [live(I)]);
	rt.setAt(rt.sv(f, "drone_overlays"), live(cache_index), null);
	return f.dot;
});

// /mob/living/simple_animal/drone/proc/update_inv_hands  (code/modules/mob/living/simple_animal/friendly/drone/visuals_icons.dm:22)
rt.def("/mob/living/simple_animal/drone/proc/update_inv_hands", function update_inv_hands(f: Frame) {
	let hands_overlays: Value = null, l_hand: Value = null, r_hand: Value = null, y_shift: Value = null, r_state: Value = null, r_hand_overlay: Value = null, l_state: Value = null, l_hand_overlay: Value = null;
	f.vars = () => [hands_overlays, l_hand, r_hand, y_shift, r_state, r_hand_overlay, l_state, l_hand_overlay];
	rt.callSrc(f, "remove_overlay", [1]);
	hands_overlays = rt.list();
	l_hand = rt.callSrc(f, "get_item_for_held_index", [1]);
	r_hand = rt.callSrc(f, "get_item_for_held_index", [2]);
	y_shift = rt.callSrc(f, "getItemPixelShiftY", []);
	if (truthy(live(r_hand))) {
		if (!truthy((r_state = rt.fv(f, "item_state", live(r_hand))))) {
			r_state = rt.fv(f, "icon_state", live(r_hand));
		}
		r_hand_overlay = rt.callName(f, live(r_hand), "build_worn_icon", ["state", live(r_state), "default_layer", 1, "default_icon_file", rt.fv(f, "righthand_file", live(r_hand)), "isinhands", 1], rt.Args.Named);
		if (truthy(live(y_shift))) {
			rt.modField(f, live(r_hand_overlay), "pixel_y", live(y_shift), add);
		}
		hands_overlays = rt.modify(live(hands_overlays), live(r_hand_overlay), add);
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
		l_hand_overlay = rt.callName(f, live(l_hand), "build_worn_icon", ["state", live(l_state), "default_layer", 1, "default_icon_file", rt.fv(f, "lefthand_file", live(l_hand)), "isinhands", 1], rt.Args.Named);
		if (truthy(live(y_shift))) {
			rt.modField(f, live(l_hand_overlay), "pixel_y", live(y_shift), add);
		}
		hands_overlays = rt.modify(live(hands_overlays), live(l_hand_overlay), add);
		if (((truthy(rt.sv(f, "client")) && truthy(rt.sv(f, "hud_used"))) && !isEqual(rt.fv(f, "hud_version", rt.sv(f, "hud_used")), 3))) {
			rt.setFv(f, "layer", live(l_hand), 20);
			rt.setFv(f, "plane", live(l_hand), 20);
			rt.setFv(f, "screen_loc", live(l_hand), rt.call(f, P("/proc/ui_hand_position"), null, [rt.callSrc(f, "get_held_index_of_item", [live(l_hand)])]));
			(rt.modField(f, rt.sv(f, "client"), "screen", live(l_hand), rt.bitOr));
		}
	}
	if (truthy(rt.len(f, live(hands_overlays)))) {
		rt.setAt(rt.sv(f, "drone_overlays"), 1, live(hands_overlays));
	}
	rt.callSrc(f, "apply_overlay", [1]);
	return f.dot;
});

// /mob/living/simple_animal/drone/proc/update_inv_internal_storage  (code/modules/mob/living/simple_animal/friendly/drone/visuals_icons.dm:73)
rt.def("/mob/living/simple_animal/drone/proc/update_inv_internal_storage", function update_inv_internal_storage(f: Frame) {
	if (!(((truthy(rt.sv(f, "internal_storage")) && truthy(rt.sv(f, "client"))) && truthy(rt.sv(f, "hud_used"))) && truthy(rt.fv(f, "hud_shown", rt.sv(f, "hud_used"))))) return f.dot;
	rt.setFv(f, "screen_loc", rt.sv(f, "internal_storage"), "CENTER-2:14,SOUTH:5");
	rt.modField(f, rt.sv(f, "client"), "screen", rt.sv(f, "internal_storage"), add);
	return f.dot;
});

// /mob/living/simple_animal/drone/proc/update_inv_head  (code/modules/mob/living/simple_animal/friendly/drone/visuals_icons.dm:79)
rt.def("/mob/living/simple_animal/drone/proc/update_inv_head", function update_inv_head(f: Frame) {
	let used_head_icon: Value = null, head_overlay: Value = null;
	f.vars = () => [used_head_icon, head_overlay];
	rt.callSrc(f, "remove_overlay", [2]);
	if (truthy(rt.sv(f, "head"))) {
		if (((truthy(rt.sv(f, "client")) && truthy(rt.sv(f, "hud_used"))) && truthy(rt.fv(f, "hud_shown", rt.sv(f, "hud_used"))))) {
			rt.setFv(f, "screen_loc", rt.sv(f, "head"), "CENTER-3:14,SOUTH:5");
			rt.modField(f, rt.sv(f, "client"), "screen", rt.sv(f, "head"), add);
		}
		used_head_icon = rt.rsc("icons/mob/head.dmi");
		if (truthy((rt.istype(rt.sv(f, "head"), T("/obj/item/clothing/mask")) ? 1 : 0))) {
			used_head_icon = rt.rsc("icons/mob/mask.dmi");
		}
		rt.modField(f, (head_overlay = rt.callName(f, rt.sv(f, "head"), "build_worn_icon", ["state", rt.fv(f, "icon_state", rt.sv(f, "head")), "default_layer", 2, "default_icon_file", live(used_head_icon)], rt.Args.Named)), "pixel_y", -15, add);
		rt.setAt(rt.sv(f, "drone_overlays"), 2, live(head_overlay));
	}
	rt.callSrc(f, "apply_overlay", [2]);
	return f.dot;
});

// /mob/living/simple_animal/drone/proc/update_inv_wear_mask  (code/modules/mob/living/simple_animal/friendly/drone/visuals_icons.dm:96)
rt.def("/mob/living/simple_animal/drone/proc/update_inv_wear_mask", function update_inv_wear_mask(f: Frame) {
	rt.callSrc(f, "update_inv_head", []);
	return f.dot;
});

// /mob/living/simple_animal/drone/proc/regenerate_icons  (code/modules/mob/living/simple_animal/friendly/drone/visuals_icons.dm:101)
rt.def("/mob/living/simple_animal/drone/proc/regenerate_icons", function regenerate_icons(f: Frame) {
	rt.callSrc(f, "update_inv_hands", []);
	rt.callSrc(f, "update_inv_head", []);
	rt.callSrc(f, "update_inv_internal_storage", []);
	return f.dot;
});

// /mob/living/simple_animal/drone/proc/pickVisualAppearence  (code/modules/mob/living/simple_animal/friendly/drone/visuals_icons.dm:108)  may sleep
rt.def("/mob/living/simple_animal/drone/proc/pickVisualAppearence", function* pickVisualAppearence(f: Frame) {
	let appearence: Value = null;
	let $0: any;
	f.vars = () => [appearence, $0];
	rt.setSv(f, "picked", 0);
	$0 = (appearence = (yield* g.op(f, "Prompt", [0], [null, "Maintenance Drone", "Appearence", "Choose your appearence!", rt.list("Maintenance Drone", "Repair Drone", "Scout Drone")])));
	if ($0 === "Maintenance Drone") {
		rt.setSv(f, "visualAppearence", "drone_maint");
		rt.setSv(f, "colour", (yield* g.op(f, "Prompt", [0], [null, "grey", "Colour", "Choose your colour!", rt.list("grey", "blue", "red", "green", "pink", "orange")])));
		rt.setSv(f, "icon_state", fmt("＀_＀", [rt.sv(f, "visualAppearence"), rt.sv(f, "colour")]));
		rt.setSv(f, "icon_living", fmt("＀_＀", [rt.sv(f, "visualAppearence"), rt.sv(f, "colour")]));
		rt.setSv(f, "icon_dead", fmt("＀_dead", [rt.sv(f, "visualAppearence")]));
	} else if ($0 === "Repair Drone") {
		rt.setSv(f, "visualAppearence", "drone_repair");
		rt.setSv(f, "icon_state", rt.sv(f, "visualAppearence"));
		rt.setSv(f, "icon_living", rt.sv(f, "visualAppearence"));
		rt.setSv(f, "icon_dead", fmt("＀_dead", [rt.sv(f, "visualAppearence")]));
	} else if ($0 === "Scout Drone") {
		rt.setSv(f, "visualAppearence", "drone_scout");
		rt.setSv(f, "icon_state", rt.sv(f, "visualAppearence"));
		rt.setSv(f, "icon_living", rt.sv(f, "visualAppearence"));
		rt.setSv(f, "icon_dead", fmt("＀_dead", [rt.sv(f, "visualAppearence")]));
	} else {
		return live(f.dot);
	}
	rt.setSv(f, "picked", 1);
	return f.dot;
}, true);

// /mob/living/simple_animal/drone/proc/getItemPixelShiftY  (code/modules/mob/living/simple_animal/friendly/drone/visuals_icons.dm:137)
rt.def("/mob/living/simple_animal/drone/proc/getItemPixelShiftY", function getItemPixelShiftY(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.sv(f, "visualAppearence");
	if ($0 === "drone_maint") {
		f.dot = 0;
	} else if ($0 === "drone_repair" || $0 === "drone_scout" || $0 === "drone_clock") {
		f.dot = -6;
	}
	return f.dot;
});

// /mob/living/simple_animal/drone/proc/updateSeeStaticMobs  (code/modules/mob/living/simple_animal/friendly/drone/visuals_icons.dm:144)
rt.def("/mob/living/simple_animal/drone/proc/updateSeeStaticMobs", function updateSeeStaticMobs(f: Frame) {
	let i: Value = null, L: Value = null, chosen: Value = null;
	let $e: any;
	f.vars = () => [i, L, chosen, $e];
	if (!truthy(rt.sv(f, "client"))) {
		return live(f.dot);
	}
	i = null;
	rt.forList(f, 0, rt.sv(f, "staticOverlays"));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		rt.callName(f, rt.fv(f, "images", rt.sv(f, "client")), "Remove", [live(i)]);
		rt.callName(f, rt.sv(f, "staticOverlays"), "Remove", [live(i)]);
	}
	rt.endFor(f, 0);
	rt.setFv(f, "len", rt.sv(f, "staticOverlays"), 0);
	if (!truthy(rt.sv(f, "seeStatic"))) return f.dot;
	L = null;
	rt.forList(f, 0, rt.gl("mob_list"), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if (truthy((rt.istype(live(L), T("/mob/living/simple_animal/drone")) ? 1 : 0))) {
			continue;
		}
		chosen = null;
		if (truthy((rt.isIn(f, rt.sv(f, "staticChoice"), rt.fv(f, "staticOverlays", live(L))) ? 1 : 0))) {
			chosen = rt.index(rt.fv(f, "staticOverlays", live(L)), rt.sv(f, "staticChoice"));
		} else {
			chosen = rt.index(rt.fv(f, "staticOverlays", live(L)), "static");
		}
		(rt.modSrcVar(f, "staticOverlays", live(chosen), rt.bitOr));
		(rt.modField(f, rt.sv(f, "client"), "images", live(chosen), rt.bitOr));
	}
	rt.endFor(f, 0);
	return f.dot;
});
