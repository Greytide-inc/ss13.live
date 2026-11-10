// Based on /tg/station's code/modules/mob/living/carbon/monkey/update_icons.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// update_icons.dm:3
rt.def("/mob/living/carbon/monkey/proc/regenerate_icons", function* regenerate_icons(f: Frame) {
	if (yield* parent_proc()) return f.dot;
	yield* this.update_body_parts();
	yield* this.update_hair();
	yield* this.update_inv_wear_mask();
	yield* this.update_inv_head();
	this.update_inv_back();
	yield* this.update_transform();
	return f.dot;
}, true);

// update_icons.dm:16
rt.def("/mob/living/carbon/monkey/proc/update_hair", function update_hair(f: Frame) {
	let HD: Value = null, I: Value = null, M: Value = null;
	this.remove_overlay(HAIR_LAYER);
	if (!(HD = this.get_bodypart("head"))) {
		return f.dot;
	}
	if (rt.bitAnd(this.disabilities, 64)) {
		return f.dot;
	}
	let hair_hidden: Value = 0;
	if (this.head) {
		if (rt.bitAnd((I = this.head).flags_inv, HIDEHAIR)) {
			hair_hidden = 1;
		}
	}
	if (this.wear_mask) {
		if (rt.bitAnd((M = this.wear_mask).flags_inv, HIDEHAIR)) {
			hair_hidden = 1;
		}
	}
	if (hair_hidden) return f.dot;
	if (this.getorgan(T("/obj/item/organ/brain"))) return f.dot;
	rt.setAt(this.overlays_standing, HAIR_LAYER, mutable_appearance(rt.rsc("icons/mob/human_face.dmi"), "debrained", -8));
	this.apply_overlay(HAIR_LAYER);
	return f.dot;
});

// update_icons.dm:42
rt.def("/mob/living/carbon/monkey/proc/update_fire", function update_fire(f: Frame) {
	parent_proc("Monkey_burning");
	return f.dot;
});

// update_icons.dm:45
rt.def("/mob/living/carbon/monkey/proc/update_inv_legcuffed", function update_inv_legcuffed(f: Frame) {
	let legcuff_overlay: Value = null;
	this.remove_overlay(LEGCUFF_LAYER);
	if (this.legcuffed) {
		(legcuff_overlay = mutable_appearance(rt.rsc("icons/mob/mob.dmi"), "legcuff1", -4)).pixel_y = 8;
		rt.setAt(this.overlays_standing, LEGCUFF_LAYER, legcuff_overlay);
	}
	this.apply_overlay(LEGCUFF_LAYER);
	return f.dot;
});

// update_icons.dm:57
rt.def("/mob/living/carbon/monkey/proc/update_hud_head", function update_hud_head(f: Frame, I: Value) {
	if (!(this.client && this.hud_used && this.hud_used.hud_shown)) return f.dot;
	I.screen_loc = "CENTER-5:13,SOUTH:5";
	this.client.screen += I;
	return f.dot;
});

// update_icons.dm:63
rt.def("/mob/living/carbon/monkey/proc/update_hud_wear_mask", function update_hud_wear_mask(f: Frame, I: Value) {
	if (!(this.client && this.hud_used && this.hud_used.hud_shown)) return f.dot;
	I.screen_loc = "CENTER-4:14,SOUTH:5";
	this.client.screen += I;
	return f.dot;
});

// update_icons.dm:69
rt.def("/mob/living/carbon/monkey/proc/update_hud_neck", function update_hud_neck(f: Frame, I: Value) {
	if (!(this.client && this.hud_used && this.hud_used.hud_shown)) return f.dot;
	I.screen_loc = "CENTER-3:15,SOUTH:5";
	this.client.screen += I;
	return f.dot;
});

// update_icons.dm:75
rt.def("/mob/living/carbon/monkey/proc/update_hud_back", function update_hud_back(f: Frame, I: Value) {
	if (!(this.client && this.hud_used && this.hud_used.hud_shown)) return f.dot;
	I.screen_loc = "CENTER-2:16,SOUTH:5";
	this.client.screen += I;
	return f.dot;
});
