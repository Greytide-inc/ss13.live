// From code/modules/mob/living/carbon/update_icons.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/carbon/proc/update_transform  (code/modules/mob/living/carbon/update_icons.dm:3)
rt.def("/mob/living/carbon/proc/update_transform", function update_transform(f: Frame) {
	let ntransform: Value = null, final_pixel_y: Value = null, final_dir: Value = null, changed: Value = null;
	f.vars = () => [ntransform, final_pixel_y, final_dir, changed];
	ntransform = rt.call(f, P("/proc/matrix"), null, [rt.sv(f, "transform")]);
	final_pixel_y = rt.sv(f, "pixel_y");
	final_dir = rt.sv(f, "dir");
	changed = 0;
	if ((!isEqual(rt.sv(f, "lying"), rt.sv(f, "lying_prev")) && truthy(rt.sv(f, "rotate_on_lying")))) {
		changed = rt.inc(live(changed), 1);
		rt.callName(f, live(ntransform), "TurnTo", [rt.sv(f, "lying_prev"), rt.sv(f, "lying")]);
		if (isEqual(rt.sv(f, "lying"), 0)) {
			final_pixel_y = rt.callSrc(f, "get_standard_pixel_y_offset", []);
		} else {
			if (isEqual(rt.sv(f, "lying_prev"), 0)) {
				rt.setSv(f, "pixel_y", rt.callSrc(f, "get_standard_pixel_y_offset", []));
				final_pixel_y = rt.callSrc(f, "get_standard_pixel_y_offset", [rt.sv(f, "lying")]);
				if (truthy(rt.bitAnd(rt.sv(f, "dir"), 12))) {
					final_dir = rt.op(f, "PickUnweighted", [2], [1, 2]);
				}
			}
		}
	}
	if (!isEqual(rt.sv(f, "resize"), 1)) {
		changed = rt.inc(live(changed), 1);
		rt.callName(f, live(ntransform), "Scale", [rt.sv(f, "resize")]);
		rt.setSv(f, "resize", 1);
	}
	if (!truthy(live(changed))) return f.dot;
	rt.op(f, "Animate", [2, 12], [null, live(f.src), "transform", live(ntransform), "time", 2, "pixel_y", live(final_pixel_y), "dir", live(final_dir), "easing", 192]);
	rt.setSv(f, "floating", 0);
	return f.dot;
});

// /mob/living/carbon/proc/apply_overlay  (code/modules/mob/living/carbon/update_icons.dm:33)
rt.def("/mob/living/carbon/proc/apply_overlay", function apply_overlay(f: Frame, cache_index: Value) {
	if (!truthy((f.dot = rt.index(rt.sv(f, "overlays_standing"), live(cache_index))))) return f.dot;
	rt.callSrc(f, "add_overlay", [live(f.dot)]);
	return f.dot;
});

// /mob/living/carbon/proc/remove_overlay  (code/modules/mob/living/carbon/update_icons.dm:37)
rt.def("/mob/living/carbon/proc/remove_overlay", function remove_overlay(f: Frame, cache_index: Value) {
	let I: Value = null;
	f.vars = () => [I];
	if (!truthy((I = rt.index(rt.sv(f, "overlays_standing"), live(cache_index))))) return f.dot;
	rt.callSrc(f, "cut_overlay", [live(I)]);
	rt.setAt(rt.sv(f, "overlays_standing"), live(cache_index), null);
	return f.dot;
});

// /mob/living/carbon/proc/regenerate_icons  (code/modules/mob/living/carbon/update_icons.dm:45)  may sleep
rt.def("/mob/living/carbon/proc/regenerate_icons", function* regenerate_icons(f: Frame) {
	if (truthy(rt.sv(f, "notransform"))) {
		return 1;
	}
	yield* g.srcCall(f, "update_inv_hands");
	yield* g.srcCall(f, "update_inv_handcuffed");
	yield* g.srcCall(f, "update_inv_legcuffed");
	yield* g.srcCall(f, "update_fire");
	return f.dot;
}, true);

// /mob/living/carbon/proc/update_inv_hands  (code/modules/mob/living/carbon/update_icons.dm:52)  may sleep
rt.def("/mob/living/carbon/proc/update_inv_hands", function* update_inv_hands(f: Frame) {
	let hands: Value = null, I: Value = null, M: Value = null, observe: Value = null, t_state: Value = null, icon_file: Value = null;
	let $e: any;
	f.vars = () => [hands, I, M, observe, t_state, icon_file, $e];
	yield* g.srcCall(f, "remove_overlay", 3);
	if (truthy(rt.sv(f, "handcuffed"))) {
		yield* g.srcCall(f, "drop_all_held_items");
		return live(f.dot);
	}
	hands = rt.list();
	I = null;
	rt.forList(f, 0, rt.sv(f, "held_items"), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (((truthy(rt.sv(f, "client")) && truthy(rt.sv(f, "hud_used"))) && !isEqual(rt.fv(f, "hud_version", rt.sv(f, "hud_used")), 3))) {
			rt.setFv(f, "screen_loc", live(I), (yield* g.call(f, P("/proc/ui_hand_position"), null, [(yield* g.srcCall(f, "get_held_index_of_item", live(I)))])));
			rt.modField(f, rt.sv(f, "client"), "screen", live(I), add);
			if ((truthy(rt.sv(f, "observers")) && truthy(rt.len(f, rt.sv(f, "observers"))))) {
				M = null;
				rt.forList(f, 1, rt.sv(f, "observers"));
				while (($e = rt.next(f, 1)) !== undefined) {
					M = $e;
					if ((truthy(rt.gv(f, "client", (observe = live(M)))) && isEqual(rt.gv(f, "eye", rt.fv(f, "client", live(observe))), live(f.src)))) {
						rt.modField(f, rt.fv(f, "client", live(observe)), "screen", live(I), add);
					} else {
						(rt.modSrcVar(f, "observers", live(observe), subtract));
						if (!truthy(rt.len(f, rt.sv(f, "observers")))) {
							rt.setSv(f, "observers", null);
							break;
						}
					}
				}
				rt.endFor(f, 1);
			}
		}
		if (!truthy((t_state = rt.fv(f, "item_state", live(I))))) {
			t_state = rt.fv(f, "icon_state", live(I));
		}
		icon_file = rt.fv(f, "lefthand_file", live(I));
		if (isEqual(rt.modulus((yield* g.srcCall(f, "get_held_index_of_item", live(I))), 2), 0)) {
			icon_file = rt.fv(f, "righthand_file", live(I));
		}
		hands = rt.modify(live(hands), (yield* g.callName(f, live(I), "build_worn_icon", ["state", live(t_state), "default_layer", 3, "default_icon_file", live(icon_file), "isinhands", 1], rt.Args.Named)), add);
	}
	rt.endFor(f, 0);
	rt.setAt(rt.sv(f, "overlays_standing"), 3, live(hands));
	yield* g.srcCall(f, "apply_overlay", 3);
	return f.dot;
}, true);

// /mob/living/carbon/proc/update_fire  (code/modules/mob/living/carbon/update_icons.dm:88)
rt.def("/mob/living/carbon/proc/update_fire", function update_fire(f: Frame, fire_icon: Value) {
	let new_fire_overlay: Value = null;
	f.vars = () => [fire_icon, new_fire_overlay];
	if (live(fire_icon) === null) {
		fire_icon = "Generic_mob_burning";
	}
	rt.callSrc(f, "remove_overlay", [1]);
	if (truthy(rt.sv(f, "on_fire"))) {
		rt.setFv(f, "appearance_flags", (new_fire_overlay = rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/mob/onfire.dmi"), live(fire_icon), -1])), 2);
		rt.setAt(rt.sv(f, "overlays_standing"), 1, live(new_fire_overlay));
	}
	rt.callSrc(f, "apply_overlay", [1]);
	return f.dot;
});

// /mob/living/carbon/proc/update_damage_overlays  (code/modules/mob/living/carbon/update_icons.dm:99)
rt.def("/mob/living/carbon/proc/update_damage_overlays", function update_damage_overlays(f: Frame) {
	let damage_overlay: Value = null, X: Value = null, BP: Value = null;
	let $e: any;
	f.vars = () => [damage_overlay, X, BP, $e];
	rt.callSrc(f, "remove_overlay", [20]);
	damage_overlay = rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/mob/dam_mob.dmi"), "blank", -20]);
	rt.setAt(rt.sv(f, "overlays_standing"), 20, live(damage_overlay));
	X = null;
	rt.forList(f, 0, rt.sv(f, "bodyparts"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		if (truthy(rt.gv(f, "dmg_overlay_type", (BP = live(X))))) {
			if (truthy(rt.fv(f, "brutestate", live(BP)))) {
				rt.callName(f, live(damage_overlay), "add_overlay", [fmt("＀_＀_＀0", [rt.fv(f, "dmg_overlay_type", live(BP)), rt.fv(f, "body_zone", live(BP)), rt.fv(f, "brutestate", live(BP))])]);
			}
			if (truthy(rt.fv(f, "burnstate", live(BP)))) {
				rt.callName(f, live(damage_overlay), "add_overlay", [fmt("＀_＀_0＀", [rt.fv(f, "dmg_overlay_type", live(BP)), rt.fv(f, "body_zone", live(BP)), rt.fv(f, "burnstate", live(BP))])]);
			}
		}
	}
	rt.endFor(f, 0);
	rt.callSrc(f, "apply_overlay", [20]);
	return f.dot;
});

// /mob/living/carbon/proc/update_inv_wear_mask  (code/modules/mob/living/carbon/update_icons.dm:116)
rt.def("/mob/living/carbon/proc/update_inv_wear_mask", function update_inv_wear_mask(f: Frame) {
	let inv: Value = null;
	f.vars = () => [inv];
	rt.callSrc(f, "remove_overlay", [7]);
	if (!truthy(rt.callSrc(f, "get_bodypart", ["head"]))) {
		return live(f.dot);
	}
	if (((truthy(rt.sv(f, "client")) && truthy(rt.sv(f, "hud_used"))) && truthy(rt.index(rt.fv(f, "inv_slots", rt.sv(f, "hud_used")), 2)))) {
		rt.callName(f, (inv = rt.index(rt.fv(f, "inv_slots", rt.sv(f, "hud_used")), 2)), "update_icon", []);
	}
	if (truthy(rt.sv(f, "wear_mask"))) {
		if (!(truthy(rt.sv(f, "head")) && truthy(rt.bitAnd(rt.fv(f, "flags_inv", rt.sv(f, "head")), 16)))) {
			rt.setAt(rt.sv(f, "overlays_standing"), 7, rt.callName(f, rt.sv(f, "wear_mask"), "build_worn_icon", ["state", rt.fv(f, "icon_state", rt.sv(f, "wear_mask")), "default_layer", 7, "default_icon_file", rt.rsc("icons/mob/mask.dmi")], rt.Args.Named));
		}
		rt.callSrc(f, "update_hud_wear_mask", [rt.sv(f, "wear_mask")]);
	}
	rt.callSrc(f, "apply_overlay", [7]);
	return f.dot;
});

// /mob/living/carbon/proc/update_inv_neck  (code/modules/mob/living/carbon/update_icons.dm:133)
rt.def("/mob/living/carbon/proc/update_inv_neck", function update_inv_neck(f: Frame) {
	let inv: Value = null;
	f.vars = () => [inv];
	rt.callSrc(f, "remove_overlay", [10]);
	if (((truthy(rt.sv(f, "client")) && truthy(rt.sv(f, "hud_used"))) && truthy(rt.index(rt.fv(f, "inv_slots", rt.sv(f, "hud_used")), 10)))) {
		rt.callName(f, (inv = rt.index(rt.fv(f, "inv_slots", rt.sv(f, "hud_used")), 10)), "update_icon", []);
	}
	if (truthy(rt.sv(f, "wear_neck"))) {
		if (!(truthy(rt.sv(f, "head")) && truthy(rt.bitAnd(rt.fv(f, "flags_inv", rt.sv(f, "head")), 1024)))) {
			rt.setAt(rt.sv(f, "overlays_standing"), 10, rt.callName(f, rt.sv(f, "wear_neck"), "build_worn_icon", ["state", rt.fv(f, "icon_state", rt.sv(f, "wear_neck")), "default_layer", 10, "default_icon_file", rt.rsc("icons/mob/neck.dmi")], rt.Args.Named));
		}
		rt.callSrc(f, "update_hud_neck", [rt.sv(f, "wear_neck")]);
	}
	rt.callSrc(f, "apply_overlay", [10]);
	return f.dot;
});

// /mob/living/carbon/proc/update_inv_back  (code/modules/mob/living/carbon/update_icons.dm:147)
rt.def("/mob/living/carbon/proc/update_inv_back", function update_inv_back(f: Frame) {
	let inv: Value = null;
	f.vars = () => [inv];
	rt.callSrc(f, "remove_overlay", [9]);
	if (((truthy(rt.sv(f, "client")) && truthy(rt.sv(f, "hud_used"))) && truthy(rt.index(rt.fv(f, "inv_slots", rt.sv(f, "hud_used")), 1)))) {
		rt.callName(f, (inv = rt.index(rt.fv(f, "inv_slots", rt.sv(f, "hud_used")), 1)), "update_icon", []);
	}
	if (truthy(rt.sv(f, "back"))) {
		rt.setAt(rt.sv(f, "overlays_standing"), 9, rt.callName(f, rt.sv(f, "back"), "build_worn_icon", ["state", rt.fv(f, "icon_state", rt.sv(f, "back")), "default_layer", 9, "default_icon_file", rt.rsc("icons/mob/back.dmi")], rt.Args.Named));
		rt.callSrc(f, "update_hud_back", [rt.sv(f, "back")]);
	}
	rt.callSrc(f, "apply_overlay", [9]);
	return f.dot;
});

// /mob/living/carbon/proc/update_inv_head  (code/modules/mob/living/carbon/update_icons.dm:159)
rt.def("/mob/living/carbon/proc/update_inv_head", function update_inv_head(f: Frame) {
	let inv: Value = null;
	f.vars = () => [inv];
	rt.callSrc(f, "remove_overlay", [6]);
	if (!truthy(rt.callSrc(f, "get_bodypart", ["head"]))) {
		return live(f.dot);
	}
	if (((truthy(rt.sv(f, "client")) && truthy(rt.sv(f, "hud_used"))) && truthy(rt.index(rt.fv(f, "inv_slots", rt.sv(f, "hud_used")), 1)))) {
		rt.callName(f, (inv = rt.index(rt.fv(f, "inv_slots", rt.sv(f, "hud_used")), 11)), "update_icon", []);
	}
	if (truthy(rt.sv(f, "head"))) {
		rt.setAt(rt.sv(f, "overlays_standing"), 6, rt.callName(f, rt.sv(f, "head"), "build_worn_icon", ["state", rt.fv(f, "icon_state", rt.sv(f, "head")), "default_layer", 6, "default_icon_file", rt.rsc("icons/mob/head.dmi")], rt.Args.Named));
		rt.callSrc(f, "update_hud_head", [rt.sv(f, "head")]);
	}
	rt.callSrc(f, "apply_overlay", [6]);
	return f.dot;
});

// /mob/living/carbon/proc/update_inv_handcuffed  (code/modules/mob/living/carbon/update_icons.dm:176)
rt.def("/mob/living/carbon/proc/update_inv_handcuffed", function update_inv_handcuffed(f: Frame) {
	rt.callSrc(f, "remove_overlay", [5]);
	if (!truthy(rt.sv(f, "handcuffed"))) return f.dot;
	rt.setAt(rt.sv(f, "overlays_standing"), 5, rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/mob/mob.dmi"), "handcuff1", -5]));
	rt.callSrc(f, "apply_overlay", [5]);
	return f.dot;
});

// /mob/living/carbon/proc/update_hud_handcuffed  (code/modules/mob/living/carbon/update_icons.dm:187)
rt.def("/mob/living/carbon/proc/update_hud_handcuffed", function update_hud_handcuffed(f: Frame) {
	let hand: Value = null, H: Value = null;
	let $e: any;
	f.vars = () => [hand, H, $e];
	if (!truthy(rt.sv(f, "hud_used"))) return f.dot;
	hand = null;
	rt.forList(f, 0, rt.fv(f, "hand_slots", rt.sv(f, "hud_used")));
	while (($e = rt.next(f, 0)) !== undefined) {
		hand = $e;
		if (truthy((H = rt.index(rt.fv(f, "hand_slots", rt.sv(f, "hud_used")), live(hand))))) {
			rt.callName(f, live(H), "update_icon", []);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/item/proc/worn_overlays  (code/modules/mob/living/carbon/update_icons.dm:213)
rt.def("/obj/item/proc/worn_overlays", function worn_overlays(f: Frame, isinhands: Value) {
	f.vars = () => [isinhands];
	if (live(isinhands) === null) {
		isinhands = 0;
	}
	f.dot = rt.list();
	return f.dot;
});

// /mob/living/carbon/proc/update_body  (code/modules/mob/living/carbon/update_icons.dm:217)  may sleep
rt.def("/mob/living/carbon/proc/update_body", function* update_body(f: Frame) {
	yield* g.srcCall(f, "update_body_parts");
	return f.dot;
}, true);

// /mob/living/carbon/proc/update_body_parts  (code/modules/mob/living/carbon/update_icons.dm:221)  may sleep
rt.def("/mob/living/carbon/proc/update_body_parts", function* update_body_parts(f: Frame) {
	let oldkey: Value = null, X: Value = null, BP: Value = null, new_limbs: Value = null, X_2: Value = null, BP_3: Value = null;
	let $e: any;
	f.vars = () => [oldkey, X, BP, new_limbs, X_2, BP_3, $e];
	oldkey = rt.sv(f, "icon_render_key");
	rt.setSv(f, "icon_render_key", (yield* g.srcCall(f, "generate_icon_render_key")));
	if (isEqual(live(oldkey), rt.sv(f, "icon_render_key"))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "remove_overlay", 24);
	X = null;
	rt.forList(f, 0, rt.sv(f, "bodyparts"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		yield* g.callName(f, (BP = live(X)), "update_limb", []);
	}
	rt.endFor(f, 0);
	if (truthy(rt.index(rt.gl("limb_icon_cache"), rt.sv(f, "icon_render_key")))) {
		yield* g.srcCall(f, "load_limb_from_cache");
		return live(f.dot);
	}
	new_limbs = rt.list();
	X_2 = null;
	rt.forList(f, 0, rt.sv(f, "bodyparts"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X_2 = $e;
		new_limbs = rt.modify(live(new_limbs), (yield* g.callName(f, (BP_3 = live(X_2)), "get_limb_icon", [])), add);
	}
	rt.endFor(f, 0);
	if (truthy(rt.len(f, live(new_limbs)))) {
		rt.setAt(rt.sv(f, "overlays_standing"), 24, live(new_limbs));
		rt.setAt(rt.gl("limb_icon_cache"), rt.sv(f, "icon_render_key"), live(new_limbs));
	}
	yield* g.srcCall(f, "apply_overlay", 24);
	yield* g.srcCall(f, "update_damage_overlays");
	return f.dot;
}, true);

// /mob/living/carbon/proc/generate_icon_render_key  (code/modules/mob/living/carbon/update_icons.dm:268)
rt.def("/mob/living/carbon/proc/generate_icon_render_key", function generate_icon_render_key(f: Frame) {
	let X: Value = null, BP: Value = null;
	let $e: any;
	f.vars = () => [X, BP, $e];
	X = null;
	rt.forList(f, 0, rt.sv(f, "bodyparts"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		f.dot = rt.modify(live(f.dot), fmt("-＀", [rt.gv(f, "body_zone", (BP = live(X)))]), add);
		if (truthy(rt.fv(f, "use_digitigrade", live(BP)))) {
			f.dot = rt.modify(live(f.dot), fmt("-digitigrade＀", [rt.fv(f, "use_digitigrade", live(BP))]), add);
		}
		if (truthy(rt.fv(f, "animal_origin", live(BP)))) {
			f.dot = rt.modify(live(f.dot), fmt("-＀", [rt.fv(f, "animal_origin", live(BP))]), add);
		}
		if (isEqual(rt.fv(f, "status", live(BP)), 1)) {
			f.dot = rt.modify(live(f.dot), "-organic", add);
		} else {
			f.dot = rt.modify(live(f.dot), "-robotic", add);
		}
	}
	rt.endFor(f, 0);
	if (!truthy(rt.bitAnd(rt.sv(f, "disabilities"), 64))) return f.dot;
	f.dot = rt.modify(live(f.dot), "-husk", add);
	return f.dot;
});

// /mob/living/carbon/proc/load_limb_from_cache  (code/modules/mob/living/carbon/update_icons.dm:286)
rt.def("/mob/living/carbon/proc/load_limb_from_cache", function load_limb_from_cache(f: Frame) {
	if (truthy(rt.index(rt.gl("limb_icon_cache"), rt.sv(f, "icon_render_key")))) {
		rt.callSrc(f, "remove_overlay", [24]);
		rt.setAt(rt.sv(f, "overlays_standing"), 24, rt.index(rt.gl("limb_icon_cache"), rt.sv(f, "icon_render_key")));
		rt.callSrc(f, "apply_overlay", [24]);
	}
	rt.callSrc(f, "update_damage_overlays", []);
	return f.dot;
});
