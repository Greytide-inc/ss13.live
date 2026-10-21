// From code/modules/mob/living/carbon/human/update_icons.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/carbon/human/proc/update_hair  (code/modules/mob/living/carbon/human/update_icons.dm:53)  may sleep
rt.def("/mob/living/carbon/human/proc/update_hair", function* update_hair(f: Frame) {
	yield* g.callName(f, rt.fv(f, "species", rt.sv(f, "dna")), "handle_hair", [live(f.src)]);
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/update_mutant_bodyparts  (code/modules/mob/living/carbon/human/update_icons.dm:57)  may sleep
rt.def("/mob/living/carbon/human/proc/update_mutant_bodyparts", function* update_mutant_bodyparts(f: Frame) {
	yield* g.callName(f, rt.fv(f, "species", rt.sv(f, "dna")), "handle_mutant_bodyparts", [live(f.src)]);
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/update_body  (code/modules/mob/living/carbon/human/update_icons.dm:61)  may sleep
rt.def("/mob/living/carbon/human/proc/update_body", function* update_body(f: Frame) {
	yield* g.srcCall(f, "remove_overlay", 22);
	yield* g.callName(f, rt.fv(f, "species", rt.sv(f, "dna")), "handle_body", [live(f.src)]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/update_fire  (code/modules/mob/living/carbon/human/update_icons.dm:66)
rt.def("/mob/living/carbon/human/proc/update_fire", function update_fire(f: Frame) {
	rt.callSuper(f, ["Standing"]);
	return f.dot;
});

// /mob/living/carbon/human/proc/regenerate_icons  (code/modules/mob/living/carbon/human/update_icons.dm:73)  may sleep
rt.def("/mob/living/carbon/human/proc/regenerate_icons", function* regenerate_icons(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	rt.setSv(f, "icon_render_key", null);
	yield* g.srcCall(f, "update_body");
	yield* g.srcCall(f, "update_hair");
	yield* g.srcCall(f, "update_inv_w_uniform");
	yield* g.srcCall(f, "update_inv_wear_id");
	yield* g.srcCall(f, "update_inv_gloves");
	yield* g.srcCall(f, "update_inv_glasses");
	yield* g.srcCall(f, "update_inv_ears");
	yield* g.srcCall(f, "update_inv_shoes");
	yield* g.srcCall(f, "update_inv_s_store");
	yield* g.srcCall(f, "update_inv_wear_mask");
	yield* g.srcCall(f, "update_inv_head");
	yield* g.srcCall(f, "update_inv_belt");
	yield* g.srcCall(f, "update_inv_back");
	yield* g.srcCall(f, "update_inv_wear_suit");
	yield* g.srcCall(f, "update_inv_pockets");
	yield* g.srcCall(f, "update_inv_neck");
	yield* g.srcCall(f, "update_transform");
	yield* g.srcCall(f, "update_mutations_overlay");
	yield* g.srcCall(f, "update_damage_overlays");
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/update_inv_w_uniform  (code/modules/mob/living/carbon/human/update_icons.dm:101)  may sleep
rt.def("/mob/living/carbon/human/proc/update_inv_w_uniform", function* update_inv_w_uniform(f: Frame, invdrop: Value) {
	let inv: Value = null, U: Value = null, t_color: Value = null, uniform_overlay: Value = null, G: Value = null, thing: Value = null;
	let $0: any, $e: any;
	f.vars = () => [invdrop, inv, U, t_color, uniform_overlay, G, thing, $0, $e];
	if (live(invdrop) === null) {
		invdrop = 1;
	}
	yield* g.srcCall(f, "remove_overlay", 19);
	if ((truthy(rt.sv(f, "client")) && truthy(rt.sv(f, "hud_used")))) {
		yield* g.callName(f, (inv = rt.index(rt.fv(f, "inv_slots", rt.sv(f, "hud_used")), 14)), "update_icon", []);
	}
	if (truthy((rt.istype(rt.sv(f, "w_uniform"), T("/obj/item/clothing/under")) ? 1 : 0))) {
		rt.setFv(f, "screen_loc", (U = rt.sv(f, "w_uniform")), "WEST:6,SOUTH+1:7");
		if (((truthy(rt.sv(f, "client")) && truthy(rt.sv(f, "hud_used"))) && truthy(rt.fv(f, "hud_shown", rt.sv(f, "hud_used"))))) {
			if (truthy(rt.fv(f, "inventory_shown", rt.sv(f, "hud_used")))) {
				rt.modField(f, rt.sv(f, "client"), "screen", rt.sv(f, "w_uniform"), add);
			}
		}
		yield* g.srcCall(f, "update_observer_view", rt.sv(f, "w_uniform"), 1);
		if ((truthy(rt.sv(f, "wear_suit")) && truthy(rt.bitAnd(rt.fv(f, "flags_inv", rt.sv(f, "wear_suit")), 4)))) {
			return live(f.dot);
		}
		if (!truthy((t_color = rt.fv(f, "item_color", live(U))))) {
			t_color = rt.fv(f, "icon_state", live(U));
		}
		if (isEqual(rt.fv(f, "adjusted", live(U)), 1)) {
			t_color = fmt("＀_d", [live(t_color)]);
		} else {
			if (isEqual(rt.fv(f, "adjusted", live(U)), 2)) {
				t_color = fmt("＀_l", [live(t_color)]);
			}
		}
		uniform_overlay = null;
		if ((truthy(rt.sv(f, "dna")) && truthy(rt.gv(f, "sexes", rt.fv(f, "species", rt.sv(f, "dna")))))) {
			if (isEqual(rt.sv(f, "gender"), "female")) {
				$0 = "f";
			} else {
				$0 = "m";
			}
			if ((isEqual((G = $0), "f") && !isEqual(rt.fv(f, "fitted", live(U)), 0))) {
				uniform_overlay = (yield* g.callName(f, live(U), "build_worn_icon", ["state", fmt("＀", [live(t_color)]), "default_layer", 19, "default_icon_file", rt.rsc("icons/mob/uniform.dmi"), "isinhands", 0, "femaleuniform", rt.fv(f, "fitted", live(U))], rt.Args.Named));
			}
		}
		if (!truthy(live(uniform_overlay))) {
			uniform_overlay = (yield* g.callName(f, live(U), "build_worn_icon", ["state", fmt("＀", [live(t_color)]), "default_layer", 19, "default_icon_file", rt.rsc("icons/mob/uniform.dmi"), "isinhands", 0], rt.Args.Named));
		}
		rt.setAt(rt.sv(f, "overlays_standing"), 19, live(uniform_overlay));
	} else {
		if ((!(truthy(rt.sv(f, "dna")) && truthy(rt.gv(f, "nojumpsuit", rt.fv(f, "species", rt.sv(f, "dna"))))) && truthy(live(invdrop)))) {
			thing = null;
			rt.forList(f, 0, rt.list(rt.sv(f, "r_store"), rt.sv(f, "l_store"), rt.sv(f, "wear_id"), rt.sv(f, "belt")), T("/obj/item"));
			while (($e = rt.next(f, 0)) !== undefined) {
				thing = $e;
				yield* g.srcCall(f, "dropItemToGround", live(thing));
			}
			rt.endFor(f, 0);
		}
	}
	yield* g.srcCall(f, "apply_overlay", 19);
	yield* g.srcCall(f, "update_mutant_bodyparts");
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/update_inv_wear_id  (code/modules/mob/living/carbon/human/update_icons.dm:149)
rt.def("/mob/living/carbon/human/proc/update_inv_wear_id", function update_inv_wear_id(f: Frame) {
	let inv: Value = null;
	f.vars = () => [inv];
	rt.callSrc(f, "remove_overlay", [18]);
	if ((truthy(rt.sv(f, "client")) && truthy(rt.sv(f, "hud_used")))) {
		rt.callName(f, (inv = rt.index(rt.fv(f, "inv_slots", rt.sv(f, "hud_used")), 6)), "update_icon", []);
	}
	if (truthy(rt.sv(f, "wear_id"))) {
		rt.setFv(f, "screen_loc", rt.sv(f, "wear_id"), "CENTER-4:12,SOUTH:5");
		if (((truthy(rt.sv(f, "client")) && truthy(rt.sv(f, "hud_used"))) && truthy(rt.fv(f, "hud_shown", rt.sv(f, "hud_used"))))) {
			rt.modField(f, rt.sv(f, "client"), "screen", rt.sv(f, "wear_id"), add);
		}
		rt.callSrc(f, "update_observer_view", [rt.sv(f, "wear_id")]);
		rt.setAt(rt.sv(f, "overlays_standing"), 18, rt.callName(f, rt.sv(f, "wear_id"), "build_worn_icon", ["state", rt.fv(f, "item_state", rt.sv(f, "wear_id")), "default_layer", 18, "default_icon_file", rt.rsc("icons/mob/mob.dmi")], rt.Args.Named));
	}
	rt.callSrc(f, "apply_overlay", [18]);
	return f.dot;
});

// /mob/living/carbon/human/proc/update_inv_gloves  (code/modules/mob/living/carbon/human/update_icons.dm:168)
rt.def("/mob/living/carbon/human/proc/update_inv_gloves", function update_inv_gloves(f: Frame) {
	let inv: Value = null, bloody_overlay: Value = null, t_state: Value = null;
	f.vars = () => [inv, bloody_overlay, t_state];
	rt.callSrc(f, "remove_overlay", [16]);
	if (((truthy(rt.sv(f, "client")) && truthy(rt.sv(f, "hud_used"))) && truthy(rt.index(rt.fv(f, "inv_slots", rt.sv(f, "hud_used")), 9)))) {
		rt.callName(f, (inv = rt.index(rt.fv(f, "inv_slots", rt.sv(f, "hud_used")), 9)), "update_icon", []);
	}
	if ((!truthy(rt.sv(f, "gloves")) && truthy(rt.sv(f, "blood_DNA")))) {
		bloody_overlay = rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/effects/blood.dmi"), "bloodyhands", -16]);
		if (rt.lt(rt.callSrc(f, "get_num_arms", []), 2)) {
			if (truthy(rt.callSrc(f, "has_left_hand", []))) {
				rt.setFv(f, "icon_state", live(bloody_overlay), "bloodyhands_left");
			} else {
				if (truthy(rt.callSrc(f, "has_right_hand", []))) {
					rt.setFv(f, "icon_state", live(bloody_overlay), "bloodyhands_right");
				}
			}
		}
		rt.setAt(rt.sv(f, "overlays_standing"), 16, live(bloody_overlay));
	}
	if (truthy(rt.sv(f, "gloves"))) {
		rt.setFv(f, "screen_loc", rt.sv(f, "gloves"), "WEST+2:10,SOUTH+1:7");
		if (((truthy(rt.sv(f, "client")) && truthy(rt.sv(f, "hud_used"))) && truthy(rt.fv(f, "hud_shown", rt.sv(f, "hud_used"))))) {
			if (truthy(rt.fv(f, "inventory_shown", rt.sv(f, "hud_used")))) {
				rt.modField(f, rt.sv(f, "client"), "screen", rt.sv(f, "gloves"), add);
			}
		}
		rt.callSrc(f, "update_observer_view", [rt.sv(f, "gloves"), 1]);
		if (!truthy((t_state = rt.fv(f, "item_state", rt.sv(f, "gloves"))))) {
			t_state = rt.fv(f, "icon_state", rt.sv(f, "gloves"));
		}
		rt.setAt(rt.sv(f, "overlays_standing"), 16, rt.callName(f, rt.sv(f, "gloves"), "build_worn_icon", ["state", live(t_state), "default_layer", 16, "default_icon_file", rt.rsc("icons/mob/hands.dmi")], rt.Args.Named));
	}
	rt.callSrc(f, "apply_overlay", [16]);
	return f.dot;
});

// /mob/living/carbon/human/proc/update_inv_glasses  (code/modules/mob/living/carbon/human/update_icons.dm:199)
rt.def("/mob/living/carbon/human/proc/update_inv_glasses", function update_inv_glasses(f: Frame) {
	let inv: Value = null;
	f.vars = () => [inv];
	rt.callSrc(f, "remove_overlay", [13]);
	if (!truthy(rt.callSrc(f, "get_bodypart", ["head"]))) {
		return live(f.dot);
	}
	if ((truthy(rt.sv(f, "client")) && truthy(rt.sv(f, "hud_used")))) {
		rt.callName(f, (inv = rt.index(rt.fv(f, "inv_slots", rt.sv(f, "hud_used")), 8)), "update_icon", []);
	}
	if (truthy(rt.sv(f, "glasses"))) {
		rt.setFv(f, "screen_loc", rt.sv(f, "glasses"), "WEST:6,SOUTH+3:11");
		if (((truthy(rt.sv(f, "client")) && truthy(rt.sv(f, "hud_used"))) && truthy(rt.fv(f, "hud_shown", rt.sv(f, "hud_used"))))) {
			if (truthy(rt.fv(f, "inventory_shown", rt.sv(f, "hud_used")))) {
				rt.modField(f, rt.sv(f, "client"), "screen", rt.sv(f, "glasses"), add);
			}
		}
		rt.callSrc(f, "update_observer_view", [rt.sv(f, "glasses"), 1]);
		if ((!(truthy(rt.sv(f, "head")) && truthy(rt.bitAnd(rt.fv(f, "flags_inv", rt.sv(f, "head")), 64))) && !(truthy(rt.sv(f, "wear_mask")) && truthy(rt.bitAnd(rt.fv(f, "flags_inv", rt.sv(f, "wear_mask")), 64))))) {
			rt.setAt(rt.sv(f, "overlays_standing"), 13, rt.callName(f, rt.sv(f, "glasses"), "build_worn_icon", ["state", rt.fv(f, "icon_state", rt.sv(f, "glasses")), "default_layer", 13, "default_icon_file", rt.rsc("icons/mob/eyes.dmi")], rt.Args.Named));
		}
	}
	rt.callSrc(f, "apply_overlay", [13]);
	return f.dot;
});

// /mob/living/carbon/human/proc/update_inv_ears  (code/modules/mob/living/carbon/human/update_icons.dm:222)
rt.def("/mob/living/carbon/human/proc/update_inv_ears", function update_inv_ears(f: Frame) {
	let inv: Value = null;
	f.vars = () => [inv];
	rt.callSrc(f, "remove_overlay", [15]);
	if (!truthy(rt.callSrc(f, "get_bodypart", ["head"]))) {
		return live(f.dot);
	}
	if ((truthy(rt.sv(f, "client")) && truthy(rt.sv(f, "hud_used")))) {
		rt.callName(f, (inv = rt.index(rt.fv(f, "inv_slots", rt.sv(f, "hud_used")), 7)), "update_icon", []);
	}
	if (truthy(rt.sv(f, "ears"))) {
		rt.setFv(f, "screen_loc", rt.sv(f, "ears"), "WEST+2:10,SOUTH+2:9");
		if (((truthy(rt.sv(f, "client")) && truthy(rt.sv(f, "hud_used"))) && truthy(rt.fv(f, "hud_shown", rt.sv(f, "hud_used"))))) {
			if (truthy(rt.fv(f, "inventory_shown", rt.sv(f, "hud_used")))) {
				rt.modField(f, rt.sv(f, "client"), "screen", rt.sv(f, "ears"), add);
			}
		}
		rt.callSrc(f, "update_observer_view", [rt.sv(f, "ears"), 1]);
		rt.setAt(rt.sv(f, "overlays_standing"), 15, rt.callName(f, rt.sv(f, "ears"), "build_worn_icon", ["state", rt.fv(f, "icon_state", rt.sv(f, "ears")), "default_layer", 15, "default_icon_file", rt.rsc("icons/mob/ears.dmi")], rt.Args.Named));
	}
	rt.callSrc(f, "apply_overlay", [15]);
	return f.dot;
});

// /mob/living/carbon/human/proc/update_inv_shoes  (code/modules/mob/living/carbon/human/update_icons.dm:244)
rt.def("/mob/living/carbon/human/proc/update_inv_shoes", function update_inv_shoes(f: Frame) {
	let inv: Value = null;
	f.vars = () => [inv];
	rt.callSrc(f, "remove_overlay", [17]);
	if (rt.lt(rt.callSrc(f, "get_num_legs", []), 2)) {
		return live(f.dot);
	}
	if ((truthy(rt.sv(f, "client")) && truthy(rt.sv(f, "hud_used")))) {
		rt.callName(f, (inv = rt.index(rt.fv(f, "inv_slots", rt.sv(f, "hud_used")), 12)), "update_icon", []);
	}
	if (truthy(rt.sv(f, "shoes"))) {
		rt.setFv(f, "screen_loc", rt.sv(f, "shoes"), "WEST+1:8,SOUTH:5");
		if (((truthy(rt.sv(f, "client")) && truthy(rt.sv(f, "hud_used"))) && truthy(rt.fv(f, "hud_shown", rt.sv(f, "hud_used"))))) {
			if (truthy(rt.fv(f, "inventory_shown", rt.sv(f, "hud_used")))) {
				rt.modField(f, rt.sv(f, "client"), "screen", rt.sv(f, "shoes"), add);
			}
		}
		rt.callSrc(f, "update_observer_view", [rt.sv(f, "shoes"), 1]);
		rt.setAt(rt.sv(f, "overlays_standing"), 17, rt.callName(f, rt.sv(f, "shoes"), "build_worn_icon", ["state", rt.fv(f, "icon_state", rt.sv(f, "shoes")), "default_layer", 17, "default_icon_file", rt.rsc("icons/mob/feet.dmi")], rt.Args.Named));
	}
	rt.callSrc(f, "apply_overlay", [17]);
	return f.dot;
});

// /mob/living/carbon/human/proc/update_inv_s_store  (code/modules/mob/living/carbon/human/update_icons.dm:265)
rt.def("/mob/living/carbon/human/proc/update_inv_s_store", function update_inv_s_store(f: Frame) {
	let inv: Value = null, t_state: Value = null;
	f.vars = () => [inv, t_state];
	rt.callSrc(f, "remove_overlay", [11]);
	if ((truthy(rt.sv(f, "client")) && truthy(rt.sv(f, "hud_used")))) {
		rt.callName(f, (inv = rt.index(rt.fv(f, "inv_slots", rt.sv(f, "hud_used")), 17)), "update_icon", []);
	}
	if (truthy(rt.sv(f, "s_store"))) {
		rt.setFv(f, "screen_loc", rt.sv(f, "s_store"), "CENTER-5:10,SOUTH:5");
		if (((truthy(rt.sv(f, "client")) && truthy(rt.sv(f, "hud_used"))) && truthy(rt.fv(f, "hud_shown", rt.sv(f, "hud_used"))))) {
			rt.modField(f, rt.sv(f, "client"), "screen", rt.sv(f, "s_store"), add);
		}
		rt.callSrc(f, "update_observer_view", [rt.sv(f, "s_store")]);
		if (!truthy((t_state = rt.fv(f, "item_state", rt.sv(f, "s_store"))))) {
			t_state = rt.fv(f, "icon_state", rt.sv(f, "s_store"));
		}
		rt.setAt(rt.sv(f, "overlays_standing"), 11, rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/mob/belt_mirror.dmi"), live(t_state), -11]));
	}
	rt.callSrc(f, "apply_overlay", [11]);
	return f.dot;
});

// /mob/living/carbon/human/proc/update_inv_head  (code/modules/mob/living/carbon/human/update_icons.dm:285)  may sleep
rt.def("/mob/living/carbon/human/proc/update_inv_head", function* update_inv_head(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "update_mutant_bodyparts");
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/update_inv_belt  (code/modules/mob/living/carbon/human/update_icons.dm:289)
rt.def("/mob/living/carbon/human/proc/update_inv_belt", function update_inv_belt(f: Frame) {
	let inv: Value = null, t_state: Value = null;
	f.vars = () => [inv, t_state];
	rt.callSrc(f, "remove_overlay", [12]);
	if ((truthy(rt.sv(f, "client")) && truthy(rt.sv(f, "hud_used")))) {
		rt.callName(f, (inv = rt.index(rt.fv(f, "inv_slots", rt.sv(f, "hud_used")), 5)), "update_icon", []);
	}
	if (truthy(rt.sv(f, "belt"))) {
		rt.setFv(f, "screen_loc", rt.sv(f, "belt"), "CENTER-3:14,SOUTH:5");
		if (((truthy(rt.sv(f, "client")) && truthy(rt.sv(f, "hud_used"))) && truthy(rt.fv(f, "hud_shown", rt.sv(f, "hud_used"))))) {
			rt.modField(f, rt.sv(f, "client"), "screen", rt.sv(f, "belt"), add);
		}
		rt.callSrc(f, "update_observer_view", [rt.sv(f, "belt")]);
		if (!truthy((t_state = rt.fv(f, "item_state", rt.sv(f, "belt"))))) {
			t_state = rt.fv(f, "icon_state", rt.sv(f, "belt"));
		}
		rt.setAt(rt.sv(f, "overlays_standing"), 12, rt.callName(f, rt.sv(f, "belt"), "build_worn_icon", ["state", live(t_state), "default_layer", 12, "default_icon_file", rt.rsc("icons/mob/belt.dmi")], rt.Args.Named));
	}
	rt.callSrc(f, "apply_overlay", [12]);
	return f.dot;
});

// /mob/living/carbon/human/proc/update_inv_wear_suit  (code/modules/mob/living/carbon/human/update_icons.dm:313)  may sleep
rt.def("/mob/living/carbon/human/proc/update_inv_wear_suit", function* update_inv_wear_suit(f: Frame) {
	let inv: Value = null;
	f.vars = () => [inv];
	yield* g.srcCall(f, "remove_overlay", 14);
	if ((truthy(rt.sv(f, "client")) && truthy(rt.sv(f, "hud_used")))) {
		yield* g.callName(f, (inv = rt.index(rt.fv(f, "inv_slots", rt.sv(f, "hud_used")), 13)), "update_icon", []);
	}
	if (truthy((rt.istype(rt.sv(f, "wear_suit"), T("/obj/item/clothing/suit")) ? 1 : 0))) {
		rt.setFv(f, "screen_loc", rt.sv(f, "wear_suit"), "WEST+1:8,SOUTH+1:7");
		if (((truthy(rt.sv(f, "client")) && truthy(rt.sv(f, "hud_used"))) && truthy(rt.fv(f, "hud_shown", rt.sv(f, "hud_used"))))) {
			if (truthy(rt.fv(f, "inventory_shown", rt.sv(f, "hud_used")))) {
				rt.modField(f, rt.sv(f, "client"), "screen", rt.sv(f, "wear_suit"), add);
			}
		}
		yield* g.srcCall(f, "update_observer_view", rt.sv(f, "wear_suit"), 1);
		rt.setAt(rt.sv(f, "overlays_standing"), 14, (yield* g.callName(f, rt.sv(f, "wear_suit"), "build_worn_icon", ["state", rt.fv(f, "icon_state", rt.sv(f, "wear_suit")), "default_layer", 14, "default_icon_file", rt.rsc("icons/mob/suit.dmi")], rt.Args.Named)));
		if (truthy(rt.fv(f, "breakouttime", rt.sv(f, "wear_suit")))) {
			yield* g.srcCall(f, "drop_all_held_items");
		}
	}
	yield* g.srcCall(f, "update_hair");
	yield* g.srcCall(f, "update_mutant_bodyparts");
	yield* g.srcCall(f, "apply_overlay", 14);
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/update_inv_pockets  (code/modules/mob/living/carbon/human/update_icons.dm:338)
rt.def("/mob/living/carbon/human/proc/update_inv_pockets", function update_inv_pockets(f: Frame) {
	let inv: Value = null;
	f.vars = () => [inv];
	if (!(truthy(rt.sv(f, "client")) && truthy(rt.sv(f, "hud_used")))) return f.dot;
	inv = null;
	rt.callName(f, (inv = rt.index(rt.fv(f, "inv_slots", rt.sv(f, "hud_used")), 15)), "update_icon", []);
	rt.callName(f, (inv = rt.index(rt.fv(f, "inv_slots", rt.sv(f, "hud_used")), 16)), "update_icon", []);
	if (truthy(rt.sv(f, "l_store"))) {
		rt.setFv(f, "screen_loc", rt.sv(f, "l_store"), "CENTER+1:18,SOUTH:5");
		if (truthy(rt.fv(f, "hud_shown", rt.sv(f, "hud_used")))) {
			rt.modField(f, rt.sv(f, "client"), "screen", rt.sv(f, "l_store"), add);
		}
		rt.callSrc(f, "update_observer_view", [rt.sv(f, "l_store")]);
	}
	if (!truthy(rt.sv(f, "r_store"))) return f.dot;
	rt.setFv(f, "screen_loc", rt.sv(f, "r_store"), "CENTER+2:20,SOUTH:5");
	if (truthy(rt.fv(f, "hud_shown", rt.sv(f, "hud_used")))) {
		rt.modField(f, rt.sv(f, "client"), "screen", rt.sv(f, "r_store"), add);
	}
	rt.callSrc(f, "update_observer_view", [rt.sv(f, "r_store")]);
	return f.dot;
});

// /mob/living/carbon/human/proc/update_inv_wear_mask  (code/modules/mob/living/carbon/human/update_icons.dm:361)  may sleep
rt.def("/mob/living/carbon/human/proc/update_inv_wear_mask", function* update_inv_wear_mask(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "update_mutant_bodyparts");
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/update_inv_legcuffed  (code/modules/mob/living/carbon/human/update_icons.dm:366)  may sleep
rt.def("/mob/living/carbon/human/proc/update_inv_legcuffed", function* update_inv_legcuffed(f: Frame) {
	yield* g.srcCall(f, "remove_overlay", 4);
	yield* g.srcCall(f, "clear_alert", "legcuffed");
	if (!truthy(rt.sv(f, "legcuffed"))) return f.dot;
	rt.setAt(rt.sv(f, "overlays_standing"), 4, (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/mob/mob.dmi"), "legcuff1", -4])));
	yield* g.srcCall(f, "apply_overlay", 4);
	yield* g.callSrc(f, "throw_alert", [null, "legcuffed", null, T("/obj/screen/alert/restrained/legcuffed"), "new_master", rt.fv(f, "legcuffed", live(f.src))], rt.Args.Named);
	return f.dot;
}, true);

// /proc/wear_female_version  (code/modules/mob/living/carbon/human/update_icons.dm:374)
rt.def("/proc/wear_female_version", function wear_female_version(f: Frame, t_color: Value, icon: Value, layer: Value, type: Value) {
	let index: Value = null, female_clothing_icon: Value = null;
	f.vars = () => [index, female_clothing_icon];
	index = live(t_color);
	if (!truthy((female_clothing_icon = rt.index(rt.gl("female_clothing_icons"), live(index))))) {
		rt.call(f, P("/proc/generate_female_clothing"), null, [live(index), live(t_color), live(icon), live(type)]);
	}
	return rt.call(f, P("/proc/mutable_appearance"), null, [null, rt.index(rt.gl("female_clothing_icons"), live(t_color)), "layer", rt.neg(live(layer))], rt.Args.Named);
});

// /mob/living/carbon/human/proc/get_overlays_copy  (code/modules/mob/living/carbon/human/update_icons.dm:381)
rt.def("/mob/living/carbon/human/proc/get_overlays_copy", function get_overlays_copy(f: Frame, unwantedLayers: Value) {
	let out: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [out, i, $e];
	out = rt.new_(f, T("/list"), []);
	i = null;
	rt.forRange(f, 0, 1, 26, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (truthy(rt.index(rt.sv(f, "overlays_standing"), live(i)))) {
			if (truthy((rt.isIn(f, live(i), live(unwantedLayers)) ? 1 : 0))) {
				continue;
			}
			out = rt.modify(live(out), rt.index(rt.sv(f, "overlays_standing"), live(i)), add);
		}
	}
	rt.endFor(f, 0);
	return live(out);
});

// /mob/living/carbon/human/proc/update_hud_head  (code/modules/mob/living/carbon/human/update_icons.dm:394)
rt.def("/mob/living/carbon/human/proc/update_hud_head", function update_hud_head(f: Frame, I: Value) {
	rt.setFv(f, "screen_loc", live(I), "WEST+1:8,SOUTH+3:11");
	if (((truthy(rt.sv(f, "client")) && truthy(rt.sv(f, "hud_used"))) && truthy(rt.fv(f, "hud_shown", rt.sv(f, "hud_used"))))) {
		if (truthy(rt.fv(f, "inventory_shown", rt.sv(f, "hud_used")))) {
			rt.modField(f, rt.sv(f, "client"), "screen", live(I), add);
		}
	}
	rt.callSrc(f, "update_observer_view", [live(I), 1]);
	return f.dot;
});

// /mob/living/carbon/human/proc/update_hud_wear_mask  (code/modules/mob/living/carbon/human/update_icons.dm:402)
rt.def("/mob/living/carbon/human/proc/update_hud_wear_mask", function update_hud_wear_mask(f: Frame, I: Value) {
	rt.setFv(f, "screen_loc", live(I), "WEST+1:8,SOUTH+2:9");
	if (((truthy(rt.sv(f, "client")) && truthy(rt.sv(f, "hud_used"))) && truthy(rt.fv(f, "hud_shown", rt.sv(f, "hud_used"))))) {
		if (truthy(rt.fv(f, "inventory_shown", rt.sv(f, "hud_used")))) {
			rt.modField(f, rt.sv(f, "client"), "screen", live(I), add);
		}
	}
	rt.callSrc(f, "update_observer_view", [live(I), 1]);
	return f.dot;
});

// /mob/living/carbon/human/proc/update_hud_neck  (code/modules/mob/living/carbon/human/update_icons.dm:410)
rt.def("/mob/living/carbon/human/proc/update_hud_neck", function update_hud_neck(f: Frame, I: Value) {
	rt.setFv(f, "screen_loc", live(I), "WEST:6,SOUTH+2:9");
	if (((truthy(rt.sv(f, "client")) && truthy(rt.sv(f, "hud_used"))) && truthy(rt.fv(f, "hud_shown", rt.sv(f, "hud_used"))))) {
		if (truthy(rt.fv(f, "inventory_shown", rt.sv(f, "hud_used")))) {
			rt.modField(f, rt.sv(f, "client"), "screen", live(I), add);
		}
	}
	rt.callSrc(f, "update_observer_view", [live(I), 1]);
	return f.dot;
});

// /mob/living/carbon/human/proc/update_hud_back  (code/modules/mob/living/carbon/human/update_icons.dm:418)
rt.def("/mob/living/carbon/human/proc/update_hud_back", function update_hud_back(f: Frame, I: Value) {
	rt.setFv(f, "screen_loc", live(I), "CENTER-2:14,SOUTH:5");
	if (((truthy(rt.sv(f, "client")) && truthy(rt.sv(f, "hud_used"))) && truthy(rt.fv(f, "hud_shown", rt.sv(f, "hud_used"))))) {
		rt.modField(f, rt.sv(f, "client"), "screen", live(I), add);
	}
	rt.callSrc(f, "update_observer_view", [live(I)]);
	return f.dot;
});

// /obj/item/proc/build_worn_icon  (code/modules/mob/living/carbon/human/update_icons.dm:455)
rt.def("/obj/item/proc/build_worn_icon", function build_worn_icon(f: Frame, state: Value, default_layer: Value, default_icon_file: Value, isinhands: Value, femaleuniform: Value) {
	let file2use: Value = null, layer2use: Value = null, standing: Value = null, worn_overlays: Value = null, M: Value = null, L: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [state, default_layer, default_icon_file, isinhands, femaleuniform, file2use, layer2use, standing, worn_overlays, M, L, $0, $1, $2];
	if (live(state) === null) {
		state = "";
	}
	if (live(default_layer) === null) {
		default_layer = 0;
	}
	if (live(default_icon_file) === null) {
		default_icon_file = null;
	}
	if (live(isinhands) === null) {
		isinhands = 0;
	}
	if (live(femaleuniform) === null) {
		femaleuniform = 0;
	}
	file2use = null;
	if ((!truthy(live(isinhands)) && truthy(rt.sv(f, "alternate_worn_icon")))) {
		file2use = rt.sv(f, "alternate_worn_icon");
	}
	if (!truthy(live(file2use))) {
		file2use = live(default_icon_file);
	}
	layer2use = null;
	if (truthy(rt.sv(f, "alternate_worn_layer"))) {
		layer2use = rt.sv(f, "alternate_worn_layer");
	}
	if (!truthy(live(layer2use))) {
		layer2use = live(default_layer);
	}
	standing = null;
	if (truthy(live(femaleuniform))) {
		standing = rt.call(f, P("/proc/wear_female_version"), null, [live(state), live(file2use), live(layer2use), live(femaleuniform)]);
	}
	if (!truthy(live(standing))) {
		standing = rt.call(f, P("/proc/mutable_appearance"), null, [live(file2use), live(state), rt.neg(live(layer2use))]);
	}
	if ((truthy((worn_overlays = rt.callSrc(f, "worn_overlays", [live(isinhands)]))) && truthy(rt.len(f, live(worn_overlays))))) {
		rt.callName(f, rt.fv(f, "overlays", live(standing)), "Add", [live(worn_overlays)]);
	}
	$0 = live(standing);
	if (truthy(live(isinhands))) {
		$1 = rt.sv(f, "inhand_x_dimension");
	} else {
		$1 = rt.sv(f, "worn_x_dimension");
	}
	if (truthy(live(isinhands))) {
		$2 = rt.sv(f, "inhand_y_dimension");
	} else {
		$2 = rt.sv(f, "worn_y_dimension");
	}
	standing = rt.call(f, P("/proc/center_image"), null, [$0, $1, $2]);
	if (truthy((rt.istype((M = rt.sv(f, "loc")), T("/mob")) ? 1 : 0))) {
		if (truthy((L = rt.callSrc(f, "get_held_offsets", [])))) {
			rt.modField(f, live(standing), "pixel_x", rt.at(live(L), "x"), add);
			rt.modField(f, live(standing), "pixel_y", rt.at(live(L), "y"), add);
		}
	}
	rt.setFv(f, "alpha", live(standing), rt.sv(f, "alpha"));
	rt.setFv(f, "color", live(standing), rt.sv(f, "color"));
	return live(standing);
});

// /obj/item/proc/get_held_offsets  (code/modules/mob/living/carbon/human/update_icons.dm:497)
rt.def("/obj/item/proc/get_held_offsets", function get_held_offsets(f: Frame) {
	let L: Value = null, M: Value = null;
	f.vars = () => [L, M];
	L = null;
	if (truthy(rt.call(f, P("/proc/ismob"), null, [rt.sv(f, "loc")]))) {
		L = rt.callName(f, (M = rt.sv(f, "loc")), "get_item_offsets_for_index", [rt.callName(f, live(M), "get_held_index_of_item", [live(f.src)])]);
	}
	return live(L);
});

// /mob/proc/get_item_offsets_for_index  (code/modules/mob/living/carbon/human/update_icons.dm:505)
rt.def("/mob/proc/get_item_offsets_for_index", function get_item_offsets_for_index(f: Frame, i: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(i);
	if ($0 === 3) {
		return rt.alist(f, ["x", 0, "y", 16]);
	} else if ($0 === 4) {
		return rt.alist(f, ["x", 0, "y", 16]);
	} else {
		return rt.alist(f, ["x", 0, "y", 0]);
	}
	return f.dot;
});

// /mob/living/carbon/human/proc/generate_icon_render_key  (code/modules/mob/living/carbon/human/update_icons.dm:517)
rt.def("/mob/living/carbon/human/proc/generate_icon_render_key", function generate_icon_render_key(f: Frame) {
	let X: Value = null, BP: Value = null;
	let $e: any;
	f.vars = () => [X, BP, $e];
	f.dot = fmt("＀", [rt.gv(f, "limbs_id", rt.fv(f, "species", rt.sv(f, "dna")))]);
	if (truthy(rt.callName(f, rt.sv(f, "dna"), "check_mutation", ["Hulk"]))) {
		f.dot = rt.modify(live(f.dot), "-coloured-hulk", add);
	} else {
		if (truthy(rt.gv(f, "use_skintones", rt.fv(f, "species", rt.sv(f, "dna"))))) {
			f.dot = rt.modify(live(f.dot), fmt("-coloured-＀", [rt.sv(f, "skin_tone")]), add);
		} else {
			if (truthy(rt.gv(f, "fixed_mut_color", rt.fv(f, "species", rt.sv(f, "dna"))))) {
				f.dot = rt.modify(live(f.dot), fmt("-coloured-＀", [rt.gv(f, "fixed_mut_color", rt.fv(f, "species", rt.sv(f, "dna")))]), add);
			} else {
				if (truthy(rt.index(rt.fv(f, "features", rt.sv(f, "dna")), "mcolor"))) {
					f.dot = rt.modify(live(f.dot), fmt("-coloured-＀", [rt.index(rt.fv(f, "features", rt.sv(f, "dna")), "mcolor")]), add);
				} else {
					f.dot = rt.modify(live(f.dot), "-not_coloured", add);
				}
			}
		}
	}
	f.dot = rt.modify(live(f.dot), fmt("-＀", [rt.sv(f, "gender")]), add);
	X = null;
	rt.forList(f, 0, rt.sv(f, "bodyparts"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		f.dot = rt.modify(live(f.dot), fmt("-＀", [rt.gv(f, "body_zone", (BP = live(X)))]), add);
		if (isEqual(rt.fv(f, "status", live(BP)), 1)) {
			f.dot = rt.modify(live(f.dot), "-organic", add);
		} else {
			f.dot = rt.modify(live(f.dot), "-robotic", add);
		}
		if (truthy(rt.fv(f, "use_digitigrade", live(BP)))) {
			f.dot = rt.modify(live(f.dot), fmt("-digitigrade＀", [rt.fv(f, "use_digitigrade", live(BP))]), add);
		}
		if (truthy(rt.fv(f, "dmg_overlay_type", live(BP)))) {
			f.dot = rt.modify(live(f.dot), fmt("-＀", [rt.fv(f, "dmg_overlay_type", live(BP))]), add);
		}
	}
	rt.endFor(f, 0);
	if (!truthy(rt.bitAnd(rt.sv(f, "disabilities"), 64))) return f.dot;
	f.dot = rt.modify(live(f.dot), "-husk", add);
	return f.dot;
});

// /mob/living/carbon/human/proc/load_limb_from_cache  (code/modules/mob/living/carbon/human/update_icons.dm:548)  may sleep
rt.def("/mob/living/carbon/human/proc/load_limb_from_cache", function* load_limb_from_cache(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "update_hair");
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/update_observer_view  (code/modules/mob/living/carbon/human/update_icons.dm:554)
rt.def("/mob/living/carbon/human/proc/update_observer_view", function update_observer_view(f: Frame, I: Value, inventory: Value) {
	let M: Value = null, observe: Value = null;
	let $e: any;
	f.vars = () => [M, observe, $e];
	if (!(truthy(rt.sv(f, "observers")) && truthy(rt.len(f, rt.sv(f, "observers"))))) return f.dot;
	M = null;
	rt.forList(f, 0, rt.sv(f, "observers"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if ((truthy(rt.gv(f, "client", (observe = live(M)))) && isEqual(rt.gv(f, "eye", rt.fv(f, "client", live(observe))), live(f.src)))) {
			if (truthy(rt.fv(f, "hud_used", live(observe)))) {
				if ((truthy(live(inventory)) && !truthy(rt.gv(f, "inventory_shown", rt.fv(f, "hud_used", live(observe)))))) {
					continue;
				}
				rt.modField(f, rt.fv(f, "client", live(observe)), "screen", live(I), add);
			}
		} else {
			(rt.modSrcVar(f, "observers", live(observe), subtract));
			if (!truthy(rt.len(f, rt.sv(f, "observers")))) {
				rt.setSv(f, "observers", null);
				break;
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});
