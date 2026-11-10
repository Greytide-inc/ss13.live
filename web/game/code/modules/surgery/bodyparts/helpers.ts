// Based on /tg/station's code/modules/surgery/bodyparts/helpers.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// helpers.dm:6
rt.def("/mob/living/carbon/proc/get_bodypart", function get_bodypart(f: Frame, zone: Value) {
	let X: Value = null, L: Value = null;
	if (!zone) {
		zone = "chest";
	}
	for (X of each(this.bodyparts)) {
		if ((L = X).body_zone == zone) {
			return L;
		}
	}
	return f.dot;
});

// helpers.dm:15
rt.def("/mob/living/carbon/proc/has_hand_for_held_index", function has_hand_for_held_index(f: Frame, i: Value) {
	let L: Value = null;
	if (i) {
		if (L = rt.index(this.hand_bodyparts, i)) {
			return L;
		}
	}
	return 0;
});

// helpers.dm:27
rt.def("/mob/living/carbon/proc/has_left_hand", function has_left_hand(f: Frame) {
	let L: Value = null;
	for (L of each(this.hand_bodyparts, T("/obj/item/bodypart"))) {
		if (L.held_index % 2) {
			return 1;
		}
	}
	return 0;
});

// helpers.dm:40
rt.def("/mob/living/carbon/proc/has_right_hand", function has_right_hand(f: Frame) {
	let L: Value = null;
	for (L of each(this.hand_bodyparts, T("/obj/item/bodypart"))) {
		if (!(L.held_index % 2)) {
			return 1;
		}
	}
	return 0;
});

// helpers.dm:56
rt.def("/mob/living/carbon/proc/get_num_arms", function get_num_arms(f: Frame) {
	let X: Value = null, affecting: Value = null;
	f.dot = 0;
	for (X of each(this.bodyparts)) {
		if ((affecting = X).body_part == ARM_RIGHT) {
			f.dot++;
		}
		if (affecting.body_part == ARM_LEFT) {
			f.dot++;
		}
	}
	return f.dot;
});

// helpers.dm:77
rt.def("/mob/living/carbon/proc/get_num_legs", function get_num_legs(f: Frame) {
	let X: Value = null, affecting: Value = null;
	f.dot = 0;
	for (X of each(this.bodyparts)) {
		if ((affecting = X).body_part == LEG_RIGHT) {
			f.dot++;
		}
		if (affecting.body_part == LEG_LEFT) {
			f.dot++;
		}
	}
	return f.dot;
});

// helpers.dm:92
rt.def("/mob/living/carbon/human/proc/get_leg_ignore", function get_leg_ignore(f: Frame) {
	let J: Value = null;
	if (rt.bitAnd(this.movement_type, 2)) {
		return 1;
	}
	if ((J = this.get_jetpack()) && J.on && !this.has_gravity()) {
		return 1;
	}
	return 0;
});

// helpers.dm:100
rt.def("/mob/living/proc/get_missing_limbs", function get_missing_limbs(f: Frame) {
	return list();
});

// helpers.dm:104
rt.def("/mob/living/carbon/proc/get_missing_limbs", function get_missing_limbs(f: Frame) {
	let zone: Value = null;
	let full: Value = list("head", "chest", "r_arm", "l_arm", "r_leg", "l_leg");
	for (zone of each(full)) {
		if (this.get_bodypart(zone)) {
			full -= zone;
		}
	}
	return full;
});

// helpers.dm:111
rt.def("/mob/living/carbon/alien/larva/proc/get_missing_limbs", function get_missing_limbs(f: Frame) {
	let zone: Value = null;
	let full: Value = list("head", "chest");
	for (zone of each(full)) {
		if (this.get_bodypart(zone)) {
			full -= zone;
		}
	}
	return full;
});

// helpers.dm:118
rt.def("/mob/living/carbon/proc/remove_all_embedded_objects", function* remove_all_embedded_objects(f: Frame) {
	let X: Value = null, L: Value = null, I: Value = null;
	let _T: Value = rt.getStep(f, this, 0);
	for (X of each(this.bodyparts)) {
		L = X;
		I = null;
		for (I of each(L.embedded_objects, T("/obj/item"))) {
			L.embedded_objects -= I;
			I.loc = _T;
		}
	}
	yield* this.clear_alert("embeddedobject");
	return f.dot;
}, true);

// helpers.dm:130
rt.def("/mob/living/carbon/proc/has_embedded_objects", function has_embedded_objects(f: Frame) {
	let X: Value = null, L: Value = null, I: Value = null;
	f.dot = 0;
	for (X of each(this.bodyparts)) {
		L = X;
		I = null;
		for (I of each(L.embedded_objects, T("/obj/item"))) {
			return 1;
		}
	}
	return f.dot;
});

// helpers.dm:139
rt.def("/mob/living/carbon/proc/newBodyPart", function* newBodyPart(f: Frame, zone: Value, robotic: Value, fixed_icon: Value) {
	let L: Value = null;
	if (zone === "l_arm") {
		L = (yield* new_(T("/obj/item/bodypart/l_arm")));
	} else if (zone === "r_arm") {
		L = (yield* new_(T("/obj/item/bodypart/r_arm")));
	} else if (zone === "head") {
		L = (yield* new_(T("/obj/item/bodypart/head")));
	} else if (zone === "l_leg") {
		L = (yield* new_(T("/obj/item/bodypart/l_leg")));
	} else if (zone === "r_leg") {
		L = (yield* new_(T("/obj/item/bodypart/r_leg")));
	} else if (zone === "chest") {
		L = (yield* new_(T("/obj/item/bodypart/chest")));
	}
	if (L) {
		L.update_limb(fixed_icon, this);
		if (robotic) {
			yield* L.change_bodypart_status(BODYPART_ROBOTIC);
		}
	}
	f.dot = L;
	return f.dot;
}, true);

// helpers.dm:160
rt.def("/mob/living/carbon/monkey/proc/newBodyPart", function* newBodyPart(f: Frame, zone: Value, robotic: Value, fixed_icon: Value) {
	let L: Value = null;
	if (zone === "l_arm") {
		L = (yield* new_(T("/obj/item/bodypart/l_arm/monkey")));
	} else if (zone === "r_arm") {
		L = (yield* new_(T("/obj/item/bodypart/r_arm/monkey")));
	} else if (zone === "head") {
		L = (yield* new_(T("/obj/item/bodypart/head/monkey")));
	} else if (zone === "l_leg") {
		L = (yield* new_(T("/obj/item/bodypart/l_leg/monkey")));
	} else if (zone === "r_leg") {
		L = (yield* new_(T("/obj/item/bodypart/r_leg/monkey")));
	} else if (zone === "chest") {
		L = (yield* new_(T("/obj/item/bodypart/chest/monkey")));
	}
	if (L) {
		L.update_limb(fixed_icon, this);
		if (robotic) {
			yield* L.change_bodypart_status(BODYPART_ROBOTIC);
		}
	}
	f.dot = L;
	return f.dot;
}, true);

// helpers.dm:181
rt.def("/mob/living/carbon/alien/larva/proc/newBodyPart", function* newBodyPart(f: Frame, zone: Value, robotic: Value, fixed_icon: Value) {
	let L: Value = null;
	if (zone === "head") {
		L = (yield* new_(T("/obj/item/bodypart/head/larva")));
	} else if (zone === "chest") {
		L = (yield* new_(T("/obj/item/bodypart/chest/larva")));
	}
	if (L) {
		L.update_limb(fixed_icon, this);
		if (robotic) {
			yield* L.change_bodypart_status(BODYPART_ROBOTIC);
		}
	}
	f.dot = L;
	return f.dot;
}, true);

// helpers.dm:194
rt.def("/mob/living/carbon/alien/humanoid/proc/newBodyPart", function* newBodyPart(f: Frame, zone: Value, robotic: Value, fixed_icon: Value) {
	let L: Value = null;
	if (zone === "l_arm") {
		L = (yield* new_(T("/obj/item/bodypart/l_arm/alien")));
	} else if (zone === "r_arm") {
		L = (yield* new_(T("/obj/item/bodypart/r_arm/alien")));
	} else if (zone === "head") {
		L = (yield* new_(T("/obj/item/bodypart/head/alien")));
	} else if (zone === "l_leg") {
		L = (yield* new_(T("/obj/item/bodypart/l_leg/alien")));
	} else if (zone === "r_leg") {
		L = (yield* new_(T("/obj/item/bodypart/r_leg/alien")));
	} else if (zone === "chest") {
		L = (yield* new_(T("/obj/item/bodypart/chest/alien")));
	}
	if (L) {
		L.update_limb(fixed_icon, this);
		if (robotic) {
			yield* L.change_bodypart_status(BODYPART_ROBOTIC);
		}
	}
	f.dot = L;
	return f.dot;
}, true);

// helpers.dm:216
rt.def("/proc/skintone2hex", function skintone2hex(f: Frame, skin_tone: Value) {
	f.dot = 0;
	if (skin_tone === "caucasian1") {
		f.dot = "ffe0d1";
	} else if (skin_tone === "caucasian2") {
		f.dot = "fcccb3";
	} else if (skin_tone === "caucasian3") {
		f.dot = "e8b59b";
	} else if (skin_tone === "latino") {
		f.dot = "d9ae96";
	} else if (skin_tone === "mediterranean") {
		f.dot = "c79b8b";
	} else if (skin_tone === "asian1") {
		f.dot = "ffdeb3";
	} else if (skin_tone === "asian2") {
		f.dot = "e3ba84";
	} else if (skin_tone === "arab") {
		f.dot = "c4915e";
	} else if (skin_tone === "indian") {
		f.dot = "b87840";
	} else if (skin_tone === "african1") {
		f.dot = "754523";
	} else if (skin_tone === "african2") {
		f.dot = "471c18";
	} else if (skin_tone === "albino") {
		f.dot = "fff4e6";
	} else if (skin_tone === "orange") {
		f.dot = "ffc905";
	}
	return f.dot;
});

// helpers.dm:246
rt.def("/mob/living/carbon/proc/Digitigrade_Leg_Swap", function* Digitigrade_Leg_Swap(f: Frame, swap_back: Value) {
	let X: Value = null, O: Value = null, N: Value = null, H: Value = null, U: Value = null;
	let body_plan_changed: Value = 0;
	for (X of each(this.bodyparts)) {
		O = X;
		N = null;
		if (!O.use_digitigrade && swap_back == 0 || O.use_digitigrade && swap_back == 1) {
			if (O.body_part == LEG_LEFT) {
				if (swap_back == 1) {
					N = (yield* new_(T("/obj/item/bodypart/l_leg")));
				} else {
					N = (yield* new_(T("/obj/item/bodypart/l_leg/digitigrade")));
				}
			} else if (O.body_part == LEG_RIGHT) {
				if (swap_back == 1) {
					N = (yield* new_(T("/obj/item/bodypart/r_leg")));
				} else {
					N = (yield* new_(T("/obj/item/bodypart/r_leg/digitigrade")));
				}
			}
		}
		if (!N) {
			continue;
		}
		body_plan_changed = 1;
		yield* O.drop_limb(1);
		yield* qdel(O);
		yield* N.attach_limb(this);
	}
	if (!(body_plan_changed && rt.istype(this, T("/mob/living/carbon/human")))) return f.dot;
	if ((H = this).w_uniform) {
		if ((U = H.w_uniform).mutantrace_variation) {
			if (swap_back) {
				U.adjusted = NORMAL_STYLE;
			} else {
				U.adjusted = DIGITIGRADE_STYLE;
			}
			yield* H.update_inv_w_uniform();
		}
	}
	if (!(H.shoes && !swap_back)) return f.dot;
	yield* H.dropItemToGround(H.shoes);
	return f.dot;
}, true);
