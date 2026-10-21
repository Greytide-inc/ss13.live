// From code/modules/surgery/bodyparts/dismemberment.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /obj/item/bodypart/proc/can_dismember  (code/modules/surgery/bodyparts/dismemberment.dm:4)
rt.def("/obj/item/bodypart/proc/can_dismember", function can_dismember(f: Frame, I: Value) {
	if (!truthy(rt.sv(f, "dismemberable"))) return f.dot;
	f.dot = (rt.ge(rt.callSrc(f, "get_damage", []), subtract(rt.sv(f, "max_damage"), divide(rt.fv(f, "armour_penetration", live(I)), 2))) ? 1 : 0);
	return f.dot;
});

// /obj/item/bodypart/proc/dismember  (code/modules/surgery/bodyparts/dismemberment.dm:8)  may sleep
rt.def("/obj/item/bodypart/proc/dismember", function* dismember(f: Frame, dam_type: Value) {
	let C: Value = null, H: Value = null, affecting: Value = null, location: Value = null, direction: Value = null, t_range: Value = null, target_turf: Value = null, i: Value = null, new_turf: Value = null;
	let $e: any;
	f.vars = () => [dam_type, C, H, affecting, location, direction, t_range, target_turf, i, new_turf, $e];
	if (live(dam_type) === null) {
		dam_type = "brute";
	}
	if (!truthy(rt.sv(f, "owner"))) {
		return 0;
	}
	C = rt.sv(f, "owner");
	if (!truthy(rt.sv(f, "dismemberable"))) {
		return 0;
	}
	if (truthy(rt.bitAnd(rt.fv(f, "status_flags", live(C)), 4096))) {
		return 0;
	}
	if (truthy((rt.istype(live(C), T("/mob/living/carbon/human")) ? 1 : 0))) {
		H = live(C);
		if (truthy((rt.isIn(f, 18, rt.gv(f, "species_traits", rt.gv(f, "species", rt.fv(f, "dna", live(H))))) ? 1 : 0))) {
			return 0;
		}
	}
	yield* g.callName(f, (affecting = (yield* g.callName(f, live(C), "get_bodypart", ["chest"]))), "receive_damage", [(yield* g.call(f, P("/proc/max"), null, [15, (yield* g.call(f, P("/proc/min"), null, [divide(rt.sv(f, "brute_dam"), 2), 50]))])), (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [divide(rt.sv(f, "burn_dam"), 2), 50]))]))]);
	yield* g.callName(f, live(C), "visible_message", [fmt("<span class='danger'><B>＀'s ＀ has been violently dismembered!</B></span>", [live(C), rt.fv(f, "name", live(f.src))])]);
	yield* g.callName(f, live(C), "emote", ["scream"]);
	yield* g.srcCall(f, "drop_limb");
	if (isEqual(live(dam_type), "fire")) {
		yield* g.srcCall(f, "burn");
		return 1;
	}
	yield* g.srcCall(f, "add_mob_blood", live(C));
	if (truthy((rt.istype((location = rt.fv(f, "loc", live(C))), T("/turf")) ? 1 : 0))) {
		yield* g.callName(f, live(C), "add_splatter_floor", [live(location)]);
	}
	direction = rt.op(f, "PickUnweighted", [1], [rt.gl("cardinal")]);
	t_range = (yield* g.call(f, P("/proc/rand"), null, [2, (yield* g.call(f, P("/proc/max"), null, [divide(rt.sv(f, "throw_range"), 2), 2]))]));
	target_turf = rt.getStep(f, live(f.src), 0);
	i = null;
	rt.forRange(f, 0, 1, subtract(live(t_range), 1), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (!truthy((new_turf = rt.getStep(f, live(target_turf), live(direction))))) {
			break;
		}
		target_turf = live(new_turf);
		if (truthy(rt.fv(f, "density", live(new_turf)))) {
			break;
		}
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "throw_at", live(target_turf), rt.sv(f, "throw_range"), rt.sv(f, "throw_speed"));
	return 1;
}, true);

// /obj/item/bodypart/chest/proc/dismember  (code/modules/surgery/bodyparts/dismemberment.dm:48)  may sleep
rt.def("/obj/item/bodypart/chest/proc/dismember", function* dismember(f: Frame) {
	let C: Value = null, H: Value = null, organ_spilled: Value = null, _T: Value = null, X: Value = null, O: Value = null, org_zone: Value = null;
	let $e: any;
	f.vars = () => [C, H, organ_spilled, _T, X, O, org_zone, $e];
	if (!truthy(rt.sv(f, "owner"))) {
		return 0;
	}
	C = rt.sv(f, "owner");
	if (!truthy(rt.sv(f, "dismemberable"))) {
		return 0;
	}
	if (truthy((rt.istype(live(C), T("/mob/living/carbon/human")) ? 1 : 0))) {
		H = live(C);
		if (truthy((rt.isIn(f, 18, rt.gv(f, "species_traits", rt.gv(f, "species", rt.fv(f, "dna", live(H))))) ? 1 : 0))) {
			return 0;
		}
	}
	organ_spilled = 0;
	_T = rt.getStep(f, live(C), 0);
	yield* g.callName(f, live(C), "add_splatter_floor", [live(_T)]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(C), 0), rt.rsc("sound/misc/splort.ogg"), 80, 1]);
	X = null;
	rt.forList(f, 0, rt.fv(f, "internal_organs", live(C)));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		O = live(X);
		if (!isEqual((org_zone = (yield* g.call(f, P("/proc/check_zone"), null, [rt.fv(f, "zone", live(O))]))), "chest")) {
			continue;
		}
		yield* g.callName(f, live(O), "Remove", [live(C)]);
		yield* g.callName(f, live(O), "forceMove", [live(_T)]);
		organ_spilled = 1;
	}
	rt.endFor(f, 0);
	if (truthy(rt.sv(f, "cavity_item"))) {
		yield* g.callName(f, rt.sv(f, "cavity_item"), "forceMove", [live(_T)]);
		rt.setSv(f, "cavity_item", null);
		organ_spilled = 1;
	}
	if (truthy(live(organ_spilled))) {
		yield* g.callName(f, live(C), "visible_message", [fmt("<span class='danger'><B>＀'s internal organs spill out onto the floor!</B></span>", [live(C)])]);
	}
	return 1;
}, true);

// /obj/item/bodypart/proc/drop_limb  (code/modules/surgery/bodyparts/dismemberment.dm:83)  may sleep
rt.def("/obj/item/bodypart/proc/drop_limb", function* drop_limb(f: Frame, special: Value) {
	let _T: Value = null, C: Value = null, X: Value = null, S: Value = null, I: Value = null, MT: Value = null, O: Value = null, org_zone: Value = null;
	let $e: any;
	f.vars = () => [special, _T, C, X, S, I, MT, O, org_zone, $e];
	if (!truthy(rt.sv(f, "owner"))) {
		return live(f.dot);
	}
	_T = rt.getStep(f, rt.sv(f, "owner"), 0);
	C = rt.sv(f, "owner");
	yield* g.srcCall(f, "update_limb", 1);
	(rt.modField(f, live(C), "bodyparts", live(f.src), subtract));
	if (truthy(rt.sv(f, "held_index"))) {
		yield* g.callName(f, live(C), "dropItemToGround", [(yield* g.callName(f, rt.sv(f, "owner"), "get_item_for_held_index", [rt.sv(f, "held_index")])), 1]);
		rt.setAt(rt.fv(f, "hand_bodyparts", live(C)), rt.sv(f, "held_index"), null);
	}
	rt.setSv(f, "owner", null);
	X = null;
	rt.forList(f, 0, rt.fv(f, "surgeries", live(C)));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		if (isEqual(rt.gv(f, "operated_bodypart", (S = live(X))), live(f.src))) {
			(rt.modField(f, live(C), "surgeries", live(S), subtract));
			yield* g.call(f, P("/proc/qdel"), null, [live(S)]);
			break;
		}
	}
	rt.endFor(f, 0);
	I = null;
	rt.forList(f, 0, rt.sv(f, "embedded_objects"), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		(rt.modSrcVar(f, "embedded_objects", live(I), subtract));
		rt.setFv(f, "loc", live(I), live(f.src));
	}
	rt.endFor(f, 0);
	if (!truthy((yield* g.callName(f, live(C), "has_embedded_objects", [])))) {
		yield* g.callName(f, live(C), "clear_alert", ["embeddedobject"]);
	}
	if (!truthy(live(special))) {
		if (truthy(rt.fv(f, "dna", live(C)))) {
			X = null;
			rt.forList(f, 0, rt.gv(f, "mutations", rt.fv(f, "dna", live(C))));
			while (($e = rt.next(f, 0)) !== undefined) {
				X = $e;
				if ((truthy(rt.gv(f, "limb_req", (MT = live(X)))) && isEqual(rt.fv(f, "limb_req", live(MT)), rt.sv(f, "body_zone")))) {
					yield* g.callName(f, live(MT), "force_lose", [live(C)]);
				}
			}
			rt.endFor(f, 0);
		}
		X = null;
		rt.forList(f, 0, rt.fv(f, "internal_organs", live(C)));
		while (($e = rt.next(f, 0)) !== undefined) {
			X = $e;
			O = live(X);
			if (!isEqual((org_zone = (yield* g.call(f, P("/proc/check_zone"), null, [rt.fv(f, "zone", live(O))]))), rt.sv(f, "body_zone"))) {
				continue;
			}
			yield* g.callName(f, live(O), "transfer_to_limb", [live(f.src), live(C)]);
		}
		rt.endFor(f, 0);
	}
	yield* g.srcCall(f, "update_icon_dropped");
	yield* g.srcCall(f, "forceMove", live(_T));
	yield* g.callName(f, live(C), "update_health_hud", []);
	yield* g.callName(f, live(C), "update_body", []);
	yield* g.callName(f, live(C), "update_hair", []);
	yield* g.callName(f, live(C), "update_canmove", []);
	if (!truthy(rt.sv(f, "is_pseudopart"))) return f.dot;
	yield* g.srcCall(f, "drop_organs", live(C));
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/organ/proc/transfer_to_limb  (code/modules/surgery/bodyparts/dismemberment.dm:136)  may sleep
rt.def("/obj/item/organ/proc/transfer_to_limb", function* transfer_to_limb(f: Frame, LB: Value, C: Value) {
	f.vars = () => [LB, C];
	yield* g.srcCall(f, "Remove", live(C));
	rt.setSv(f, "loc", live(LB));
	return f.dot;
}, true);

// /obj/item/organ/brain/proc/transfer_to_limb  (code/modules/surgery/bodyparts/dismemberment.dm:140)  may sleep
rt.def("/obj/item/organ/brain/proc/transfer_to_limb", function* transfer_to_limb(f: Frame, LB: Value, C: Value) {
	f.vars = () => [LB, C];
	yield* g.srcCall(f, "Remove", live(C));
	rt.setSv(f, "loc", live(LB));
	rt.setFv(f, "brain", live(LB), live(f.src));
	if (!truthy(rt.sv(f, "brainmob"))) return f.dot;
	rt.setFv(f, "brainmob", live(LB), rt.sv(f, "brainmob"));
	rt.setSv(f, "brainmob", null);
	rt.setFv(f, "loc", rt.fv(f, "brainmob", live(LB)), live(LB));
	rt.setFv(f, "container", rt.fv(f, "brainmob", live(LB)), live(LB));
	rt.setFv(f, "stat", rt.fv(f, "brainmob", live(LB)), 2);
	return f.dot;
}, true);

// /obj/item/organ/eyes/proc/transfer_to_limb  (code/modules/surgery/bodyparts/dismemberment.dm:152)  may sleep
rt.def("/obj/item/organ/eyes/proc/transfer_to_limb", function* transfer_to_limb(f: Frame) {
	rt.setFv(f, "eyes", live(f.args[0]), live(f.src));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["LB", "C"] });

rt.type(10178, "/obj/item/bodypart/r_arm", "/obj/item/bodypart", {
	attack_verb: null,
	max_damage: 50,
	body_zone: "r_arm",
	body_part: 256,
	held_index: 2,
	px_x: 6,
	px_y: 0,
	name: "right arm",
	desc: "Over 87% of humans are right handed. That figure is much lower among humans missing their right arm.",
	icon_state: "default_human_r_arm",
});

// /obj/item/bodypart/r_arm/proc/drop_limb  (code/modules/surgery/bodyparts/dismemberment.dm:158)  may sleep
rt.def("/obj/item/bodypart/r_arm/proc/drop_limb", function* drop_limb(f: Frame) {
	let C: Value = null, R: Value = null;
	f.vars = () => [C, R];
	C = rt.sv(f, "owner");
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!(truthy(live(C)) && !truthy(live(f.args[0])))) return f.dot;
	if (truthy(rt.fv(f, "handcuffed", live(C)))) {
		rt.setFv(f, "loc", rt.fv(f, "handcuffed", live(C)), rt.fv(f, "loc", live(C)));
		yield* g.callName(f, rt.fv(f, "handcuffed", live(C)), "dropped", [live(C)]);
		rt.setFv(f, "handcuffed", live(C), null);
		yield* g.callName(f, live(C), "update_handcuffed", []);
	}
	if (truthy(rt.fv(f, "hud_used", live(C)))) {
		if (truthy((R = rt.index(rt.gv(f, "hand_slots", rt.fv(f, "hud_used", live(C))), fmt("＀", [rt.sv(f, "held_index")]))))) {
			yield* g.callName(f, live(R), "update_icon", []);
		}
	}
	if (truthy(rt.fv(f, "gloves", live(C)))) {
		yield* g.callName(f, live(C), "dropItemToGround", [rt.fv(f, "gloves", live(C)), 1]);
	}
	yield* g.callName(f, live(C), "update_inv_gloves", []);
	return f.dot;
}, true, { args: ["special"] });

rt.type(10172, "/obj/item/bodypart/l_arm", "/obj/item/bodypart", {
	attack_verb: null,
	max_damage: 50,
	body_zone: "l_arm",
	body_part: 128,
	held_index: 1,
	px_x: -6,
	px_y: 0,
	name: "left arm",
	desc: "Did you know that the word 'sinister' stems originally from the Latin 'sinestra' (left hand), because the left hand was supposed to be possessed by the devil? This arm appears to be possessed by no one though.",
	icon_state: "default_human_l_arm",
});

// /obj/item/bodypart/l_arm/proc/drop_limb  (code/modules/surgery/bodyparts/dismemberment.dm:176)  may sleep
rt.def("/obj/item/bodypart/l_arm/proc/drop_limb", function* drop_limb(f: Frame) {
	let C: Value = null, L: Value = null;
	f.vars = () => [C, L];
	C = rt.sv(f, "owner");
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!(truthy(live(C)) && !truthy(live(f.args[0])))) return f.dot;
	if (truthy(rt.fv(f, "handcuffed", live(C)))) {
		rt.setFv(f, "loc", rt.fv(f, "handcuffed", live(C)), rt.fv(f, "loc", live(C)));
		yield* g.callName(f, rt.fv(f, "handcuffed", live(C)), "dropped", [live(C)]);
		rt.setFv(f, "handcuffed", live(C), null);
		yield* g.callName(f, live(C), "update_handcuffed", []);
	}
	if (truthy(rt.fv(f, "hud_used", live(C)))) {
		if (truthy((L = rt.index(rt.gv(f, "hand_slots", rt.fv(f, "hud_used", live(C))), fmt("＀", [rt.sv(f, "held_index")]))))) {
			yield* g.callName(f, live(L), "update_icon", []);
		}
	}
	if (truthy(rt.fv(f, "gloves", live(C)))) {
		yield* g.callName(f, live(C), "dropItemToGround", [rt.fv(f, "gloves", live(C)), 1]);
	}
	yield* g.callName(f, live(C), "update_inv_gloves", []);
	return f.dot;
}, true, { args: ["special"] });

rt.type(10191, "/obj/item/bodypart/r_leg", "/obj/item/bodypart", {
	attack_verb: null,
	max_damage: 50,
	body_zone: "r_leg",
	body_part: 16,
	px_x: 2,
	px_y: 12,
	name: "right leg",
	desc: "You put your right leg in, your right leg out. In, out, in, out, shake it all about. And apparently then it detaches.\nThe hokey pokey has certainly changed a lot since space colonisation.",
	icon_state: "default_human_r_leg",
});

// /obj/item/bodypart/r_leg/proc/drop_limb  (code/modules/surgery/bodyparts/dismemberment.dm:194)  may sleep
rt.def("/obj/item/bodypart/r_leg/proc/drop_limb", function* drop_limb(f: Frame) {
	if ((truthy(rt.sv(f, "owner")) && !truthy(live(f.args[0])))) {
		if (truthy(rt.fv(f, "legcuffed", rt.sv(f, "owner")))) {
			rt.setFv(f, "loc", rt.fv(f, "legcuffed", rt.sv(f, "owner")), rt.fv(f, "loc", rt.sv(f, "owner")));
			yield* g.callName(f, rt.fv(f, "legcuffed", rt.sv(f, "owner")), "dropped", [rt.sv(f, "owner")]);
			rt.setFv(f, "legcuffed", rt.sv(f, "owner"), null);
			yield* g.callName(f, rt.sv(f, "owner"), "update_inv_legcuffed", []);
		}
		if (truthy(rt.fv(f, "shoes", rt.sv(f, "owner")))) {
			yield* g.callName(f, rt.sv(f, "owner"), "dropItemToGround", [rt.fv(f, "shoes", rt.sv(f, "owner")), 1]);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["special"] });

rt.type(10184, "/obj/item/bodypart/l_leg", "/obj/item/bodypart", {
	attack_verb: null,
	max_damage: 50,
	body_zone: "l_leg",
	body_part: 8,
	px_x: -2,
	px_y: 12,
	name: "left leg",
	desc: "Some athletes prefer to tie their left shoelaces first for good luck. In this instance, it probably would not have helped.",
	icon_state: "default_human_l_leg",
});

// /obj/item/bodypart/l_leg/proc/drop_limb  (code/modules/surgery/bodyparts/dismemberment.dm:205)  may sleep
rt.def("/obj/item/bodypart/l_leg/proc/drop_limb", function* drop_limb(f: Frame) {
	if ((truthy(rt.sv(f, "owner")) && !truthy(live(f.args[0])))) {
		if (truthy(rt.fv(f, "legcuffed", rt.sv(f, "owner")))) {
			rt.setFv(f, "loc", rt.fv(f, "legcuffed", rt.sv(f, "owner")), rt.fv(f, "loc", rt.sv(f, "owner")));
			yield* g.callName(f, rt.fv(f, "legcuffed", rt.sv(f, "owner")), "dropped", [rt.sv(f, "owner")]);
			rt.setFv(f, "legcuffed", rt.sv(f, "owner"), null);
			yield* g.callName(f, rt.sv(f, "owner"), "update_inv_legcuffed", []);
		}
		if (truthy(rt.fv(f, "shoes", rt.sv(f, "owner")))) {
			yield* g.callName(f, rt.sv(f, "owner"), "dropItemToGround", [rt.fv(f, "shoes", rt.sv(f, "owner")), 1]);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["special"] });

// /obj/item/bodypart/head/proc/drop_limb  (code/modules/surgery/bodyparts/dismemberment.dm:216)  may sleep
rt.def("/obj/item/bodypart/head/proc/drop_limb", function* drop_limb(f: Frame) {
	let X: Value = null, I: Value = null, AP: Value = null, pill: Value = null;
	let $e: any;
	f.vars = () => [X, I, AP, pill, $e];
	if (!truthy(live(f.args[0]))) {
		X = null;
		rt.forList(f, 0, rt.list(rt.fv(f, "glasses", rt.sv(f, "owner")), rt.fv(f, "ears", rt.sv(f, "owner")), rt.fv(f, "wear_mask", rt.sv(f, "owner")), rt.fv(f, "head", rt.sv(f, "owner"))));
		while (($e = rt.next(f, 0)) !== undefined) {
			X = $e;
			I = live(X);
			yield* g.callName(f, rt.sv(f, "owner"), "dropItemToGround", [live(I), 1]);
		}
		rt.endFor(f, 0);
	}
	AP = null;
	rt.forList(f, 0, rt.fv(f, "actions", rt.sv(f, "owner")), T("/datum/action/item_action/hands_free/activate_pill"));
	while (($e = rt.next(f, 0)) !== undefined) {
		AP = $e;
		yield* g.callName(f, live(AP), "Remove", [rt.sv(f, "owner")]);
		if (truthy((pill = rt.fv(f, "target", live(AP))))) {
			yield* g.callName(f, live(pill), "forceMove", [live(f.src)]);
		}
	}
	rt.endFor(f, 0);
	rt.setSv(f, "name", fmt("＀'s head", [rt.fv(f, "real_name", rt.sv(f, "owner"))]));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["special"] });

// /obj/item/bodypart/proc/replace_limb  (code/modules/surgery/bodyparts/dismemberment.dm:239)  may sleep
rt.def("/obj/item/bodypart/proc/replace_limb", function* replace_limb(f: Frame, C: Value, special: Value) {
	let O: Value = null;
	f.vars = () => [C, special, O];
	if (!truthy((rt.istype(live(C), T("/mob/living/carbon")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (truthy((O = rt.locateIn(f, rt.fv(f, "type", live(f.src)), rt.fv(f, "bodyparts", live(C)))))) {
		yield* g.callName(f, live(O), "drop_limb", [1]);
	}
	yield* g.srcCall(f, "attach_limb", live(C), live(special));
	return f.dot;
}, true);

// /obj/item/bodypart/head/proc/replace_limb  (code/modules/surgery/bodyparts/dismemberment.dm:247)  may sleep
rt.def("/obj/item/bodypart/head/proc/replace_limb", function* replace_limb(f: Frame, C: Value, special: Value) {
	let O: Value = null;
	f.vars = () => [C, special, O];
	if (!truthy((rt.istype(live(C), T("/mob/living/carbon")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (truthy((O = rt.locateIn(f, rt.fv(f, "type", live(f.src)), rt.fv(f, "bodyparts", live(C)))))) {
		if (!truthy(live(special))) {
			return live(f.dot);
		} else {
			yield* g.callName(f, live(O), "drop_limb", [1]);
		}
	}
	yield* g.srcCall(f, "attach_limb", live(C), live(special));
	return f.dot;
}, true);

// /obj/item/bodypart/proc/attach_limb  (code/modules/surgery/bodyparts/dismemberment.dm:259)  may sleep
rt.def("/obj/item/bodypart/proc/attach_limb", function* attach_limb(f: Frame, C: Value, special: Value) {
	let hand: Value = null, X: Value = null, S: Value = null, surgery_zone: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [C, special, hand, X, S, surgery_zone, O, $e];
	rt.setSv(f, "loc", null);
	rt.setSv(f, "owner", live(C));
	rt.modField(f, live(C), "bodyparts", live(f.src), add);
	if (truthy(rt.sv(f, "held_index"))) {
		if (rt.gt(rt.sv(f, "held_index"), rt.getLen(f, rt.fv(f, "hand_bodyparts", live(C))))) {
			rt.setFv(f, "len", rt.fv(f, "hand_bodyparts", live(C)), rt.sv(f, "held_index"));
		}
		rt.setAt(rt.fv(f, "hand_bodyparts", live(C)), rt.sv(f, "held_index"), live(f.src));
		if ((truthy(rt.gv(f, "mutanthands", rt.gv(f, "species", rt.fv(f, "dna", live(C))))) && !truthy(rt.sv(f, "is_pseudopart")))) {
			yield* g.callName(f, live(C), "put_in_hand", [(yield* g.new_(f, rt.gv(f, "mutanthands", rt.gv(f, "species", rt.fv(f, "dna", live(C)))), [])), rt.sv(f, "held_index")]);
		}
		if (truthy(rt.fv(f, "hud_used", live(C)))) {
			if (truthy((hand = rt.index(rt.gv(f, "hand_slots", rt.fv(f, "hud_used", live(C))), fmt("＀", [rt.sv(f, "held_index")]))))) {
				yield* g.callName(f, live(hand), "update_icon", []);
			}
		}
		yield* g.callName(f, live(C), "update_inv_gloves", []);
	}
	if (truthy(live(special))) {
		X = null;
		rt.forList(f, 0, rt.fv(f, "surgeries", live(C)));
		while (($e = rt.next(f, 0)) !== undefined) {
			X = $e;
			S = live(X);
			if (isEqual((surgery_zone = (yield* g.call(f, P("/proc/check_zone"), null, [rt.fv(f, "location", live(S))]))), rt.sv(f, "body_zone"))) {
				(rt.modField(f, live(C), "surgeries", live(S), subtract));
				yield* g.call(f, P("/proc/qdel"), null, [live(S)]);
				break;
			}
		}
		rt.endFor(f, 0);
	}
	O = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/obj/item/organ"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		yield* g.callName(f, live(O), "Insert", [live(C)]);
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "update_bodypart_damage_state");
	yield* g.callName(f, live(C), "updatehealth", []);
	yield* g.callName(f, live(C), "update_body", []);
	yield* g.callName(f, live(C), "update_hair", []);
	yield* g.callName(f, live(C), "update_damage_overlays", []);
	yield* g.callName(f, live(C), "update_canmove", []);
	return f.dot;
}, true);

// /obj/item/bodypart/head/proc/attach_limb  (code/modules/surgery/bodyparts/dismemberment.dm:298)  may sleep
rt.def("/obj/item/bodypart/head/proc/attach_limb", function* attach_limb(f: Frame) {
	let H: Value = null, _P: Value = null, AP: Value = null;
	let $e: any;
	f.vars = () => [H, _P, AP, $e];
	if (truthy(rt.sv(f, "brain"))) {
		if (truthy(rt.sv(f, "brainmob"))) {
			rt.setFv(f, "container", rt.sv(f, "brainmob"), null);
			rt.setFv(f, "loc", rt.sv(f, "brainmob"), rt.sv(f, "brain"));
			rt.setFv(f, "brainmob", rt.sv(f, "brain"), rt.sv(f, "brainmob"));
			rt.setSv(f, "brainmob", null);
		}
		yield* g.callName(f, rt.sv(f, "brain"), "Insert", [live(f.args[0])]);
		rt.setSv(f, "brain", null);
	}
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) {
		rt.setFv(f, "hair_color", (H = live(f.args[0])), rt.sv(f, "hair_color"));
		rt.setFv(f, "hair_style", live(H), rt.sv(f, "hair_style"));
		rt.setFv(f, "facial_hair_color", live(H), rt.sv(f, "facial_hair_color"));
		rt.setFv(f, "facial_hair_style", live(H), rt.sv(f, "facial_hair_style"));
		rt.setFv(f, "lip_style", live(H), rt.sv(f, "lip_style"));
		rt.setFv(f, "lip_color", live(H), rt.sv(f, "lip_color"));
	}
	if (truthy(rt.sv(f, "real_name"))) {
		rt.setFv(f, "real_name", live(f.args[0]), rt.sv(f, "real_name"));
	}
	rt.setSv(f, "real_name", "");
	rt.setSv(f, "name", rt.initial(f, live(f.src), "name"));
	_P = null;
	rt.forList(f, 0, live(f.src), T("/obj/item/weapon/reagent_containers/pill"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_P = $e;
		AP = null;
		rt.forList(f, 1, rt.fv(f, "actions", live(_P)), T("/datum/action/item_action/hands_free/activate_pill"));
		if (($e = rt.next(f, 1)) !== undefined) {
			AP = $e;
			yield* g.callName(f, live(_P), "forceMove", [live(f.args[0])]);
			yield* g.callName(f, live(AP), "Grant", [live(f.args[0])]);
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["C", "special"] });

// /mob/living/carbon/proc/regenerate_limbs  (code/modules/surgery/bodyparts/dismemberment.dm:335)  may sleep
rt.def("/mob/living/carbon/proc/regenerate_limbs", function* regenerate_limbs(f: Frame, noheal: Value, excluded_limbs: Value) {
	let limb_list: Value = null, Z: Value = null;
	let $e: any;
	f.vars = () => [noheal, excluded_limbs, limb_list, Z, $e];
	limb_list = rt.list("head", "chest", "r_arm", "l_arm", "r_leg", "l_leg");
	if (truthy(live(excluded_limbs))) {
		(limb_list = rt.modify(live(limb_list), live(excluded_limbs), subtract));
	}
	Z = null;
	rt.forList(f, 0, live(limb_list));
	while (($e = rt.next(f, 0)) !== undefined) {
		Z = $e;
		f.dot = rt.modify(live(f.dot), (yield* g.srcCall(f, "regenerate_limb", live(Z), live(noheal))), add);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /mob/living/carbon/proc/regenerate_limb  (code/modules/surgery/bodyparts/dismemberment.dm:344)  may sleep
rt.def("/mob/living/carbon/proc/regenerate_limb", function* regenerate_limb(f: Frame, limb_zone: Value, noheal: Value) {
	let L: Value = null;
	f.vars = () => [limb_zone, noheal, L];
	L = null;
	if (truthy((yield* g.srcCall(f, "get_bodypart", live(limb_zone))))) {
		return 0;
	}
	if (!truthy((L = (yield* g.srcCall(f, "newBodyPart", live(limb_zone), 0, 0))))) return f.dot;
	if (!truthy(live(noheal))) {
		rt.setFv(f, "brute_dam", live(L), 0);
		rt.setFv(f, "burn_dam", live(L), 0);
		rt.setFv(f, "brutestate", live(L), 0);
		rt.setFv(f, "burnstate", live(L), 0);
	}
	yield* g.callName(f, live(L), "attach_limb", [live(f.src), 1]);
	return 1;
}, true);
