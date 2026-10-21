// From code/modules/mob/living/carbon/monkey/update_icons.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/carbon/monkey/proc/regenerate_icons  (code/modules/mob/living/carbon/monkey/update_icons.dm:3)  may sleep
rt.def("/mob/living/carbon/monkey/proc/regenerate_icons", function* regenerate_icons(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	yield* g.srcCall(f, "update_body_parts");
	yield* g.srcCall(f, "update_hair");
	yield* g.srcCall(f, "update_inv_wear_mask");
	yield* g.srcCall(f, "update_inv_head");
	yield* g.srcCall(f, "update_inv_back");
	yield* g.srcCall(f, "update_transform");
	return f.dot;
}, true);

// /mob/living/carbon/monkey/proc/update_hair  (code/modules/mob/living/carbon/monkey/update_icons.dm:16)
rt.def("/mob/living/carbon/monkey/proc/update_hair", function update_hair(f: Frame) {
	let HD: Value = null, hair_hidden: Value = null, I: Value = null, M: Value = null;
	f.vars = () => [HD, hair_hidden, I, M];
	rt.callSrc(f, "remove_overlay", [8]);
	if (!truthy((HD = rt.callSrc(f, "get_bodypart", ["head"])))) {
		return live(f.dot);
	}
	if (truthy(rt.bitAnd(rt.sv(f, "disabilities"), 64))) {
		return live(f.dot);
	}
	hair_hidden = 0;
	if (truthy(rt.sv(f, "head"))) {
		if (truthy(rt.bitAnd(rt.gv(f, "flags_inv", (I = rt.sv(f, "head"))), 256))) {
			hair_hidden = 1;
		}
	}
	if (truthy(rt.sv(f, "wear_mask"))) {
		if (truthy(rt.bitAnd(rt.gv(f, "flags_inv", (M = rt.sv(f, "wear_mask"))), 256))) {
			hair_hidden = 1;
		}
	}
	if (truthy(live(hair_hidden))) return f.dot;
	if (truthy(rt.callSrc(f, "getorgan", [T("/obj/item/organ/brain")]))) return f.dot;
	rt.setAt(rt.sv(f, "overlays_standing"), 8, rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/mob/human_face.dmi"), "debrained", -8]));
	rt.callSrc(f, "apply_overlay", [8]);
	return f.dot;
});

// /mob/living/carbon/monkey/proc/update_fire  (code/modules/mob/living/carbon/monkey/update_icons.dm:42)
rt.def("/mob/living/carbon/monkey/proc/update_fire", function update_fire(f: Frame) {
	rt.callSuper(f, ["Monkey_burning"]);
	return f.dot;
});

// /mob/living/carbon/monkey/proc/update_inv_legcuffed  (code/modules/mob/living/carbon/monkey/update_icons.dm:45)
rt.def("/mob/living/carbon/monkey/proc/update_inv_legcuffed", function update_inv_legcuffed(f: Frame) {
	let legcuff_overlay: Value = null;
	f.vars = () => [legcuff_overlay];
	rt.callSrc(f, "remove_overlay", [4]);
	if (truthy(rt.sv(f, "legcuffed"))) {
		rt.setFv(f, "pixel_y", (legcuff_overlay = rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/mob/mob.dmi"), "legcuff1", -4])), 8);
		rt.setAt(rt.sv(f, "overlays_standing"), 4, live(legcuff_overlay));
	}
	rt.callSrc(f, "apply_overlay", [4]);
	return f.dot;
});

// /mob/living/carbon/monkey/proc/update_hud_head  (code/modules/mob/living/carbon/monkey/update_icons.dm:57)
rt.def("/mob/living/carbon/monkey/proc/update_hud_head", function update_hud_head(f: Frame, I: Value) {
	if (!((truthy(rt.sv(f, "client")) && truthy(rt.sv(f, "hud_used"))) && truthy(rt.fv(f, "hud_shown", rt.sv(f, "hud_used"))))) return f.dot;
	rt.setFv(f, "screen_loc", live(I), "CENTER-5:13,SOUTH:5");
	rt.modField(f, rt.sv(f, "client"), "screen", live(I), add);
	return f.dot;
});

// /mob/living/carbon/monkey/proc/update_hud_wear_mask  (code/modules/mob/living/carbon/monkey/update_icons.dm:63)
rt.def("/mob/living/carbon/monkey/proc/update_hud_wear_mask", function update_hud_wear_mask(f: Frame, I: Value) {
	if (!((truthy(rt.sv(f, "client")) && truthy(rt.sv(f, "hud_used"))) && truthy(rt.fv(f, "hud_shown", rt.sv(f, "hud_used"))))) return f.dot;
	rt.setFv(f, "screen_loc", live(I), "CENTER-4:14,SOUTH:5");
	rt.modField(f, rt.sv(f, "client"), "screen", live(I), add);
	return f.dot;
});

// /mob/living/carbon/monkey/proc/update_hud_neck  (code/modules/mob/living/carbon/monkey/update_icons.dm:69)
rt.def("/mob/living/carbon/monkey/proc/update_hud_neck", function update_hud_neck(f: Frame, I: Value) {
	if (!((truthy(rt.sv(f, "client")) && truthy(rt.sv(f, "hud_used"))) && truthy(rt.fv(f, "hud_shown", rt.sv(f, "hud_used"))))) return f.dot;
	rt.setFv(f, "screen_loc", live(I), "CENTER-3:15,SOUTH:5");
	rt.modField(f, rt.sv(f, "client"), "screen", live(I), add);
	return f.dot;
});

// /mob/living/carbon/monkey/proc/update_hud_back  (code/modules/mob/living/carbon/monkey/update_icons.dm:75)
rt.def("/mob/living/carbon/monkey/proc/update_hud_back", function update_hud_back(f: Frame, I: Value) {
	if (!((truthy(rt.sv(f, "client")) && truthy(rt.sv(f, "hud_used"))) && truthy(rt.fv(f, "hud_shown", rt.sv(f, "hud_used"))))) return f.dot;
	rt.setFv(f, "screen_loc", live(I), "CENTER-2:16,SOUTH:5");
	rt.modField(f, rt.sv(f, "client"), "screen", live(I), add);
	return f.dot;
});
