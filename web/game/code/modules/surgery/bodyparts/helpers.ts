// From code/modules/surgery/bodyparts/helpers.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/carbon/proc/get_bodypart  (code/modules/surgery/bodyparts/helpers.dm:6)
rt.def("/mob/living/carbon/proc/get_bodypart", function get_bodypart(f: Frame, zone: Value) {
	let X: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [zone, X, L, $e];
	if (!truthy(live(zone))) {
		zone = "chest";
	}
	X = null;
	rt.forList(f, 0, rt.sv(f, "bodyparts"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		if (isEqual(rt.gv(f, "body_zone", (L = live(X))), live(zone))) {
			return live(L);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /mob/living/carbon/proc/has_hand_for_held_index  (code/modules/surgery/bodyparts/helpers.dm:15)
rt.def("/mob/living/carbon/proc/has_hand_for_held_index", function has_hand_for_held_index(f: Frame, i: Value) {
	let L: Value = null;
	f.vars = () => [L];
	if (truthy(live(i))) {
		if (truthy((L = rt.index(rt.sv(f, "hand_bodyparts"), live(i))))) {
			return live(L);
		}
	}
	return 0;
});

// /mob/living/carbon/proc/has_left_hand  (code/modules/surgery/bodyparts/helpers.dm:27)
rt.def("/mob/living/carbon/proc/has_left_hand", function has_left_hand(f: Frame) {
	let L: Value = null;
	let $e: any;
	f.vars = () => [L, $e];
	L = null;
	rt.forList(f, 0, rt.sv(f, "hand_bodyparts"), T("/obj/item/bodypart"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if (truthy(rt.modulus(rt.fv(f, "held_index", live(L)), 2))) {
			return 1;
		}
	}
	rt.endFor(f, 0);
	return 0;
});

// /mob/living/carbon/proc/has_right_hand  (code/modules/surgery/bodyparts/helpers.dm:40)
rt.def("/mob/living/carbon/proc/has_right_hand", function has_right_hand(f: Frame) {
	let L: Value = null;
	let $e: any;
	f.vars = () => [L, $e];
	L = null;
	rt.forList(f, 0, rt.sv(f, "hand_bodyparts"), T("/obj/item/bodypart"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if (!truthy(rt.modulus(rt.fv(f, "held_index", live(L)), 2))) {
			return 1;
		}
	}
	rt.endFor(f, 0);
	return 0;
});

// /mob/living/carbon/proc/get_num_arms  (code/modules/surgery/bodyparts/helpers.dm:56)
rt.def("/mob/living/carbon/proc/get_num_arms", function get_num_arms(f: Frame) {
	let X: Value = null, affecting: Value = null;
	let $e: any;
	f.vars = () => [X, affecting, $e];
	f.dot = 0;
	X = null;
	rt.forList(f, 0, rt.sv(f, "bodyparts"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		if (isEqual(rt.gv(f, "body_part", (affecting = live(X))), 256)) {
			f.dot = rt.inc(live(f.dot), 1);
		}
		if (isEqual(rt.fv(f, "body_part", live(affecting)), 128)) {
			f.dot = rt.inc(live(f.dot), 1);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /mob/living/carbon/proc/get_num_legs  (code/modules/surgery/bodyparts/helpers.dm:77)
rt.def("/mob/living/carbon/proc/get_num_legs", function get_num_legs(f: Frame) {
	let X: Value = null, affecting: Value = null;
	let $e: any;
	f.vars = () => [X, affecting, $e];
	f.dot = 0;
	X = null;
	rt.forList(f, 0, rt.sv(f, "bodyparts"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		if (isEqual(rt.gv(f, "body_part", (affecting = live(X))), 16)) {
			f.dot = rt.inc(live(f.dot), 1);
		}
		if (isEqual(rt.fv(f, "body_part", live(affecting)), 8)) {
			f.dot = rt.inc(live(f.dot), 1);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /mob/living/carbon/human/proc/get_leg_ignore  (code/modules/surgery/bodyparts/helpers.dm:92)
rt.def("/mob/living/carbon/human/proc/get_leg_ignore", function get_leg_ignore(f: Frame) {
	let J: Value = null;
	f.vars = () => [J];
	if (truthy(rt.bitAnd(rt.sv(f, "movement_type"), 2))) {
		return 1;
	}
	if (((truthy((J = rt.callSrc(f, "get_jetpack", []))) && truthy(rt.fv(f, "on", live(J)))) && !truthy(rt.callSrc(f, "has_gravity", [])))) {
		return 1;
	}
	return 0;
});

// /mob/living/proc/get_missing_limbs  (code/modules/surgery/bodyparts/helpers.dm:100)
rt.def("/mob/living/proc/get_missing_limbs", function get_missing_limbs(f: Frame) {
	return rt.list();
});

// /mob/living/carbon/proc/get_missing_limbs  (code/modules/surgery/bodyparts/helpers.dm:104)
rt.def("/mob/living/carbon/proc/get_missing_limbs", function get_missing_limbs(f: Frame) {
	let full: Value = null, zone: Value = null;
	let $e: any;
	f.vars = () => [full, zone, $e];
	full = rt.list("head", "chest", "r_arm", "l_arm", "r_leg", "l_leg");
	zone = null;
	rt.forList(f, 0, live(full));
	while (($e = rt.next(f, 0)) !== undefined) {
		zone = $e;
		if (truthy(rt.callSrc(f, "get_bodypart", [live(zone)]))) {
			(full = rt.modify(live(full), live(zone), subtract));
		}
	}
	rt.endFor(f, 0);
	return live(full);
});

// /mob/living/carbon/alien/larva/proc/get_missing_limbs  (code/modules/surgery/bodyparts/helpers.dm:111)
rt.def("/mob/living/carbon/alien/larva/proc/get_missing_limbs", function get_missing_limbs(f: Frame) {
	let full: Value = null, zone: Value = null;
	let $e: any;
	f.vars = () => [full, zone, $e];
	full = rt.list("head", "chest");
	zone = null;
	rt.forList(f, 0, live(full));
	while (($e = rt.next(f, 0)) !== undefined) {
		zone = $e;
		if (truthy(rt.callSrc(f, "get_bodypart", [live(zone)]))) {
			(full = rt.modify(live(full), live(zone), subtract));
		}
	}
	rt.endFor(f, 0);
	return live(full);
});

// /mob/living/carbon/proc/remove_all_embedded_objects  (code/modules/surgery/bodyparts/helpers.dm:118)  may sleep
rt.def("/mob/living/carbon/proc/remove_all_embedded_objects", function* remove_all_embedded_objects(f: Frame) {
	let _T: Value = null, X: Value = null, L: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [_T, X, L, I, $e];
	_T = rt.getStep(f, live(f.src), 0);
	X = null;
	rt.forList(f, 0, rt.sv(f, "bodyparts"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		L = live(X);
		I = null;
		rt.forList(f, 1, rt.fv(f, "embedded_objects", live(L)), T("/obj/item"));
		while (($e = rt.next(f, 1)) !== undefined) {
			I = $e;
			(rt.modField(f, live(L), "embedded_objects", live(I), subtract));
			rt.setFv(f, "loc", live(I), live(_T));
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "clear_alert", "embeddedobject");
	return f.dot;
}, true);

// /mob/living/carbon/proc/has_embedded_objects  (code/modules/surgery/bodyparts/helpers.dm:130)
rt.def("/mob/living/carbon/proc/has_embedded_objects", function has_embedded_objects(f: Frame) {
	let X: Value = null, L: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [X, L, I, $e];
	f.dot = 0;
	X = null;
	rt.forList(f, 0, rt.sv(f, "bodyparts"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		L = live(X);
		I = null;
		rt.forList(f, 1, rt.fv(f, "embedded_objects", live(L)), T("/obj/item"));
		while (($e = rt.next(f, 1)) !== undefined) {
			I = $e;
			return 1;
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /mob/living/carbon/proc/newBodyPart  (code/modules/surgery/bodyparts/helpers.dm:139)  may sleep
rt.def("/mob/living/carbon/proc/newBodyPart", function* newBodyPart(f: Frame, zone: Value, robotic: Value, fixed_icon: Value) {
	let L: Value = null;
	let $0: any;
	f.vars = () => [zone, robotic, fixed_icon, L, $0];
	L = null;
	$0 = live(zone);
	if ($0 === "l_arm") {
		L = (yield* g.new_(f, T("/obj/item/bodypart/l_arm"), []));
	} else if ($0 === "r_arm") {
		L = (yield* g.new_(f, T("/obj/item/bodypart/r_arm"), []));
	} else if ($0 === "head") {
		L = (yield* g.new_(f, T("/obj/item/bodypart/head"), []));
	} else if ($0 === "l_leg") {
		L = (yield* g.new_(f, T("/obj/item/bodypart/l_leg"), []));
	} else if ($0 === "r_leg") {
		L = (yield* g.new_(f, T("/obj/item/bodypart/r_leg"), []));
	} else if ($0 === "chest") {
		L = (yield* g.new_(f, T("/obj/item/bodypart/chest"), []));
	}
	if (truthy(live(L))) {
		yield* g.callName(f, live(L), "update_limb", [live(fixed_icon), live(f.src)]);
		if (truthy(live(robotic))) {
			yield* g.callName(f, live(L), "change_bodypart_status", [2]);
		}
	}
	f.dot = live(L);
	return f.dot;
}, true);

// /mob/living/carbon/monkey/proc/newBodyPart  (code/modules/surgery/bodyparts/helpers.dm:160)  may sleep
rt.def("/mob/living/carbon/monkey/proc/newBodyPart", function* newBodyPart(f: Frame, zone: Value, robotic: Value, fixed_icon: Value) {
	let L: Value = null;
	let $0: any;
	f.vars = () => [zone, robotic, fixed_icon, L, $0];
	L = null;
	$0 = live(zone);
	if ($0 === "l_arm") {
		L = (yield* g.new_(f, T("/obj/item/bodypart/l_arm/monkey"), []));
	} else if ($0 === "r_arm") {
		L = (yield* g.new_(f, T("/obj/item/bodypart/r_arm/monkey"), []));
	} else if ($0 === "head") {
		L = (yield* g.new_(f, T("/obj/item/bodypart/head/monkey"), []));
	} else if ($0 === "l_leg") {
		L = (yield* g.new_(f, T("/obj/item/bodypart/l_leg/monkey"), []));
	} else if ($0 === "r_leg") {
		L = (yield* g.new_(f, T("/obj/item/bodypart/r_leg/monkey"), []));
	} else if ($0 === "chest") {
		L = (yield* g.new_(f, T("/obj/item/bodypart/chest/monkey"), []));
	}
	if (truthy(live(L))) {
		yield* g.callName(f, live(L), "update_limb", [live(fixed_icon), live(f.src)]);
		if (truthy(live(robotic))) {
			yield* g.callName(f, live(L), "change_bodypart_status", [2]);
		}
	}
	f.dot = live(L);
	return f.dot;
}, true);

// /mob/living/carbon/alien/larva/proc/newBodyPart  (code/modules/surgery/bodyparts/helpers.dm:181)  may sleep
rt.def("/mob/living/carbon/alien/larva/proc/newBodyPart", function* newBodyPart(f: Frame, zone: Value, robotic: Value, fixed_icon: Value) {
	let L: Value = null;
	let $0: any;
	f.vars = () => [zone, robotic, fixed_icon, L, $0];
	L = null;
	$0 = live(zone);
	if ($0 === "head") {
		L = (yield* g.new_(f, T("/obj/item/bodypart/head/larva"), []));
	} else if ($0 === "chest") {
		L = (yield* g.new_(f, T("/obj/item/bodypart/chest/larva"), []));
	}
	if (truthy(live(L))) {
		yield* g.callName(f, live(L), "update_limb", [live(fixed_icon), live(f.src)]);
		if (truthy(live(robotic))) {
			yield* g.callName(f, live(L), "change_bodypart_status", [2]);
		}
	}
	f.dot = live(L);
	return f.dot;
}, true);

// /mob/living/carbon/alien/humanoid/proc/newBodyPart  (code/modules/surgery/bodyparts/helpers.dm:194)  may sleep
rt.def("/mob/living/carbon/alien/humanoid/proc/newBodyPart", function* newBodyPart(f: Frame, zone: Value, robotic: Value, fixed_icon: Value) {
	let L: Value = null;
	let $0: any;
	f.vars = () => [zone, robotic, fixed_icon, L, $0];
	L = null;
	$0 = live(zone);
	if ($0 === "l_arm") {
		L = (yield* g.new_(f, T("/obj/item/bodypart/l_arm/alien"), []));
	} else if ($0 === "r_arm") {
		L = (yield* g.new_(f, T("/obj/item/bodypart/r_arm/alien"), []));
	} else if ($0 === "head") {
		L = (yield* g.new_(f, T("/obj/item/bodypart/head/alien"), []));
	} else if ($0 === "l_leg") {
		L = (yield* g.new_(f, T("/obj/item/bodypart/l_leg/alien"), []));
	} else if ($0 === "r_leg") {
		L = (yield* g.new_(f, T("/obj/item/bodypart/r_leg/alien"), []));
	} else if ($0 === "chest") {
		L = (yield* g.new_(f, T("/obj/item/bodypart/chest/alien"), []));
	}
	if (truthy(live(L))) {
		yield* g.callName(f, live(L), "update_limb", [live(fixed_icon), live(f.src)]);
		if (truthy(live(robotic))) {
			yield* g.callName(f, live(L), "change_bodypart_status", [2]);
		}
	}
	f.dot = live(L);
	return f.dot;
}, true);

// /proc/skintone2hex  (code/modules/surgery/bodyparts/helpers.dm:216)
rt.def("/proc/skintone2hex", function skintone2hex(f: Frame, skin_tone: Value) {
	let $0: any;
	f.vars = () => [$0];
	f.dot = 0;
	$0 = live(skin_tone);
	if ($0 === "caucasian1") {
		f.dot = "ffe0d1";
	} else if ($0 === "caucasian2") {
		f.dot = "fcccb3";
	} else if ($0 === "caucasian3") {
		f.dot = "e8b59b";
	} else if ($0 === "latino") {
		f.dot = "d9ae96";
	} else if ($0 === "mediterranean") {
		f.dot = "c79b8b";
	} else if ($0 === "asian1") {
		f.dot = "ffdeb3";
	} else if ($0 === "asian2") {
		f.dot = "e3ba84";
	} else if ($0 === "arab") {
		f.dot = "c4915e";
	} else if ($0 === "indian") {
		f.dot = "b87840";
	} else if ($0 === "african1") {
		f.dot = "754523";
	} else if ($0 === "african2") {
		f.dot = "471c18";
	} else if ($0 === "albino") {
		f.dot = "fff4e6";
	} else if ($0 === "orange") {
		f.dot = "ffc905";
	}
	return f.dot;
});

// /mob/living/carbon/proc/Digitigrade_Leg_Swap  (code/modules/surgery/bodyparts/helpers.dm:246)  may sleep
rt.def("/mob/living/carbon/proc/Digitigrade_Leg_Swap", function* Digitigrade_Leg_Swap(f: Frame, swap_back: Value) {
	let body_plan_changed: Value = null, X: Value = null, O: Value = null, N: Value = null, H: Value = null, U: Value = null;
	let $e: any;
	f.vars = () => [swap_back, body_plan_changed, X, O, N, H, U, $e];
	body_plan_changed = 0;
	X = null;
	rt.forList(f, 0, rt.sv(f, "bodyparts"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		O = live(X);
		N = null;
		if (((!truthy(rt.fv(f, "use_digitigrade", live(O))) && isEqual(live(swap_back), 0)) || (truthy(rt.fv(f, "use_digitigrade", live(O))) && isEqual(live(swap_back), 1)))) {
			if (isEqual(rt.fv(f, "body_part", live(O)), 8)) {
				if (isEqual(live(swap_back), 1)) {
					N = (yield* g.new_(f, T("/obj/item/bodypart/l_leg"), []));
				} else {
					N = (yield* g.new_(f, T("/obj/item/bodypart/l_leg/digitigrade"), []));
				}
			} else {
				if (isEqual(rt.fv(f, "body_part", live(O)), 16)) {
					if (isEqual(live(swap_back), 1)) {
						N = (yield* g.new_(f, T("/obj/item/bodypart/r_leg"), []));
					} else {
						N = (yield* g.new_(f, T("/obj/item/bodypart/r_leg/digitigrade"), []));
					}
				}
			}
		}
		if (!truthy(live(N))) {
			continue;
		}
		body_plan_changed = 1;
		yield* g.callName(f, live(O), "drop_limb", [1]);
		yield* g.call(f, P("/proc/qdel"), null, [live(O)]);
		yield* g.callName(f, live(N), "attach_limb", [live(f.src)]);
	}
	rt.endFor(f, 0);
	if (!(truthy(live(body_plan_changed)) && truthy((rt.istype(live(f.src), T("/mob/living/carbon/human")) ? 1 : 0)))) return f.dot;
	if (truthy(rt.gv(f, "w_uniform", (H = live(f.src))))) {
		if (truthy(rt.gv(f, "mutantrace_variation", (U = rt.fv(f, "w_uniform", live(H)))))) {
			if (truthy(live(swap_back))) {
				rt.setFv(f, "adjusted", live(U), 0);
			} else {
				rt.setFv(f, "adjusted", live(U), 2);
			}
			yield* g.callName(f, live(H), "update_inv_w_uniform", []);
		}
	}
	if (!(truthy(rt.fv(f, "shoes", live(H))) && !truthy(live(swap_back)))) return f.dot;
	yield* g.callName(f, live(H), "dropItemToGround", [rt.fv(f, "shoes", live(H))]);
	return f.dot;
}, true);
