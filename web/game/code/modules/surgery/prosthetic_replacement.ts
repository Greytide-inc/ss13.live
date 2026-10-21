// From code/modules/surgery/prosthetic_replacement.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1322, "/datum/surgery/prosthetic_replacement", "/datum/surgery", {
	name: "prosthetic replacement",
	steps: null,
	possible_locs: null,
	requires_bodypart: 0,
	species: null,
});

// /datum/surgery/prosthetic_replacement/proc/<init>  (code/modules/surgery/prosthetic_replacement.dm:3)
rt.def("/datum/surgery/prosthetic_replacement/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "steps", rt.list(T("/datum/surgery_step/incise"), T("/datum/surgery_step/clamp_bleeders"), T("/datum/surgery_step/retract_skin"), T("/datum/surgery_step/add_prosthetic")));
	rt.setSv(f, "possible_locs", rt.list("r_arm", "l_arm", "l_leg", "r_leg", "head"));
	$0 = $0;
	rt.setSv(f, "species", rt.list(T("/mob/living/carbon/human"), T("/mob/living/carbon/monkey")));
	return f.dot;
});

// /datum/surgery/prosthetic_replacement/proc/can_start  (code/modules/surgery/prosthetic_replacement.dm:9)
rt.def("/datum/surgery/prosthetic_replacement/proc/can_start", function can_start(f: Frame, user: Value, target: Value) {
	let C: Value = null;
	f.vars = () => [C];
	if (!truthy((rt.istype(live(target), T("/mob/living/carbon")) ? 1 : 0))) {
		return 0;
	}
	if (truthy(rt.callName(f, (C = live(target)), "get_bodypart", [rt.fv(f, "zone_selected", live(user))]))) return f.dot;
	return 1;
});

rt.type(1347, "/datum/surgery_step/add_prosthetic", "/datum/surgery_step", {
	organ_rejection_dam: 0,
	name: "add prosthetic",
	implements: null,
	time: 32,
});

// /datum/surgery_step/add_prosthetic/proc/<init>  (code/modules/surgery/prosthetic_replacement.dm:19)
rt.def("/datum/surgery_step/add_prosthetic/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "implements", rt.alist(f, [T("/obj/item/bodypart"), 100, T("/obj/item/weapon/organ_storage"), 100, T("/obj/item/weapon/twohanded/required/chainsaw"), 100, T("/obj/item/weapon/melee/synthetic_arm_blade"), 100]));
	return f.dot;
});

// /datum/surgery_step/add_prosthetic/proc/preop  (code/modules/surgery/prosthetic_replacement.dm:24)
rt.def("/datum/surgery_step/add_prosthetic/proc/preop", function preop(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	let I: Value = null, BP: Value = null, H: Value = null;
	f.vars = () => [tool, I, BP, H];
	if (truthy((rt.istype(live(tool), T("/obj/item/weapon/organ_storage")) ? 1 : 0))) {
		if (!truthy(rt.getLen(f, rt.fv(f, "contents", live(tool))))) {
			rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>There is nothing inside ＀!</span>", [live(tool)])]);
			return -1;
		}
		if (!truthy((rt.istype((I = rt.index(rt.fv(f, "contents", live(tool)), 1)), T("/obj/item/bodypart")) ? 1 : 0))) {
			rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀ cannot be attached!</span>", [live(I)])]);
			return -1;
		}
		tool = live(I);
	}
	if (truthy((rt.istype(live(tool), T("/obj/item/bodypart")) ? 1 : 0))) {
		BP = live(tool);
		if (truthy((rt.istype(live(target), T("/mob/living/carbon/monkey")) ? 1 : 0))) {
			if ((isEqual(rt.fv(f, "status", live(BP)), 2) || !isEqual(rt.fv(f, "animal_origin", live(BP)), "monkey"))) {
				rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ doesn't match the patient's morphology.</span>", [live(BP)])]);
				return -1;
			}
		}
		if (!isEqual(rt.fv(f, "status", live(BP)), 2)) {
			rt.setSv(f, "organ_rejection_dam", 10);
			if (truthy((rt.istype(live(target), T("/mob/living/carbon/human")) ? 1 : 0))) {
				if (truthy(rt.fv(f, "animal_origin", live(BP)))) {
					rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ doesn't match the patient's morphology.</span>", [live(BP)])]);
					return -1;
				}
				if (!isEqual(rt.gv(f, "id", rt.gv(f, "species", rt.gv(f, "dna", (H = live(target))))), rt.fv(f, "species_id", live(BP)))) {
					rt.setSv(f, "organ_rejection_dam", 30);
				}
			}
		}
		if (isEqual(live(target_zone), rt.fv(f, "body_zone", live(BP)))) {
			rt.callName(f, live(user), "visible_message", [fmt("＀ begins to replace ＀'s ＀.", [live(user), live(target), rt.call(f, P("/proc/parse_zone"), null, [live(target_zone)])]), fmt("<span class ='notice'>You begin to replace ＀'s ＀...</span>", [live(target), rt.call(f, P("/proc/parse_zone"), null, [live(target_zone)])])]);
		} else {
			rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ isn't the right type for ＀.</span>", [live(tool), rt.call(f, P("/proc/parse_zone"), null, [live(target_zone)])])]);
			return -1;
		}
	} else {
		if ((isEqual(live(target_zone), "l_arm") || isEqual(live(target_zone), "r_arm"))) {
			rt.callName(f, live(user), "visible_message", [fmt("＀ begins to attach ＀ onto ＀.", [live(user), live(tool), live(target)]), fmt("<span class='notice'>You begin to attach ＀ onto ＀...</span>", [live(tool), live(target)])]);
		} else {
			rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ must be installed onto an arm.</span>", [live(tool)])]);
			return -1;
		}
	}
	return f.dot;
});

// /datum/surgery_step/add_prosthetic/proc/success  (code/modules/surgery/prosthetic_replacement.dm:61)  may sleep
rt.def("/datum/surgery_step/add_prosthetic/proc/success", function* success(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	let L: Value = null, new_arm: Value = null;
	let $0: any;
	f.vars = () => [user, target, target_zone, tool, surgery, L, new_arm, $0];
	if (truthy((rt.istype(live(tool), T("/obj/item/weapon/organ_storage")) ? 1 : 0))) {
		rt.setFv(f, "icon_state", live(tool), "evidenceobj");
		rt.setFv(f, "desc", live(tool), "A container for holding body parts.");
		yield* g.callName(f, live(tool), "cut_overlays", []);
		tool = rt.index(rt.fv(f, "contents", live(tool)), 1);
	}
	if (truthy((rt.istype(live(tool), T("/obj/item/bodypart")) ? 1 : 0))) {
		L = live(tool);
		yield* g.callName(f, live(user), "drop_item", []);
		yield* g.callName(f, live(L), "attach_limb", [live(target)]);
		if (truthy(rt.sv(f, "organ_rejection_dam"))) {
			yield* g.callName(f, live(target), "adjustToxLoss", [rt.sv(f, "organ_rejection_dam")]);
		}
		yield* g.callName(f, live(user), "visible_message", [fmt("＀ successfully replaces ＀'s ＀!", [live(user), live(target), (yield* g.call(f, P("/proc/parse_zone"), null, [live(target_zone)]))]), fmt("<span class='notice'>You succeed in replacing ＀'s ＀.</span>", [live(target), (yield* g.call(f, P("/proc/parse_zone"), null, [live(target_zone)]))])]);
		return 1;
	} else {
		rt.setFv(f, "is_pseudopart", (L = (yield* g.callName(f, live(target), "newBodyPart", [live(target_zone), 0, 0]))), 1);
		yield* g.callName(f, live(L), "attach_limb", [live(target)]);
		yield* g.callName(f, live(user), "visible_message", [fmt("＀ finishes attaching ＀!", [live(user), live(tool)]), fmt("<span class='notice'>You attach ＀.</span>", [live(tool)])]);
		yield* g.call(f, P("/proc/qdel"), null, [live(tool)]);
		if (truthy((rt.istype(live(tool), T("/obj/item/weapon/twohanded/required/chainsaw")) ? 1 : 0))) {
			new_arm = (yield* g.new_(f, T("/obj/item/weapon/mounted_chainsaw"), [live(target)]));
			if (isEqual(live(target_zone), "r_arm")) {
				$0 = (yield* g.callName(f, live(target), "put_in_r_hand", [live(new_arm)]));
			} else {
				$0 = (yield* g.callName(f, live(target), "put_in_l_hand", [live(new_arm)]));
			}
			return 1;
		} else {
			if (!truthy((rt.istype(live(tool), T("/obj/item/weapon/melee/synthetic_arm_blade")) ? 1 : 0))) return f.dot;
			new_arm = (yield* g.new_(f, T("/obj/item/weapon/melee/arm_blade"), [live(target), 1, 1]));
			if (isEqual(live(target_zone), "r_arm")) {
				$0 = (yield* g.callName(f, live(target), "put_in_r_hand", [live(new_arm)]));
			} else {
				$0 = (yield* g.callName(f, live(target), "put_in_l_hand", [live(new_arm)]));
			}
			return 1;
		}
	}
	return f.dot;
}, true);
