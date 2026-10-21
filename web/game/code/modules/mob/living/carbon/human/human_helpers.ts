// From code/modules/mob/living/carbon/human/human_helpers.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/carbon/human/proc/restrained  (code/modules/mob/living/carbon/human/human_helpers.dm:3)
rt.def("/mob/living/carbon/human/proc/restrained", function restrained(f: Frame) {
	f.dot = ((rt.sv(f, "wear_suit") && rt.fv(f, "breakouttime", rt.sv(f, "wear_suit"))) || rt.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, false, { args: ["ignore_grab"] });

// /mob/living/carbon/human/proc/canBeHandcuffed  (code/modules/mob/living/carbon/human/human_helpers.dm:7)
rt.def("/mob/living/carbon/human/proc/canBeHandcuffed", function canBeHandcuffed(f: Frame) {
	if (rt.ge(rt.callSrc(f, "get_num_arms", []), 2)) {
		return 1;
	} else {
		return 0;
	}
	return f.dot;
});

// /mob/living/carbon/human/proc/get_assignment  (code/modules/mob/living/carbon/human/human_helpers.dm:15)
rt.def("/mob/living/carbon/human/proc/get_assignment", function get_assignment(f: Frame, if_no_id: Value, if_no_job: Value) {
	let id: Value = null, pda: Value = null;
	f.vars = () => [if_no_id, if_no_job, id, pda];
	if (live(if_no_id) === null) {
		if_no_id = "No id";
	}
	if (live(if_no_job) === null) {
		if_no_job = "No job";
	}
	if (truthy((id = rt.callSrc(f, "get_idcard", [])))) {
		f.dot = rt.fv(f, "assignment", live(id));
	} else {
		if (truthy((rt.istype((pda = rt.sv(f, "wear_id")), T("/obj/item/device/pda")) ? 1 : 0))) {
			f.dot = rt.fv(f, "ownjob", live(pda));
		} else {
			return live(if_no_id);
		}
	}
	if (truthy(live(f.dot))) return f.dot;
	return live(if_no_job);
});

// /mob/living/carbon/human/proc/get_authentification_name  (code/modules/mob/living/carbon/human/human_helpers.dm:30)
rt.def("/mob/living/carbon/human/proc/get_authentification_name", function get_authentification_name(f: Frame, if_no_id: Value) {
	let id: Value = null, pda: Value = null;
	f.vars = () => [if_no_id, id, pda];
	if (live(if_no_id) === null) {
		if_no_id = "Unknown";
	}
	if (truthy((id = rt.callSrc(f, "get_idcard", [])))) {
		return rt.fv(f, "registered_name", live(id));
	}
	if (truthy((rt.istype((pda = rt.sv(f, "wear_id")), T("/obj/item/device/pda")) ? 1 : 0))) {
		return rt.fv(f, "owner", live(pda));
	}
	return live(if_no_id);
});

// /mob/living/carbon/human/proc/get_visible_name  (code/modules/mob/living/carbon/human/human_helpers.dm:40)
rt.def("/mob/living/carbon/human/proc/get_visible_name", function get_visible_name(f: Frame) {
	let face_name: Value = null, id_name: Value = null;
	f.vars = () => [face_name, id_name];
	face_name = rt.callSrc(f, "get_face_name", [""]);
	id_name = rt.callSrc(f, "get_id_name", [""]);
	if (truthy(rt.sv(f, "name_override"))) {
		return rt.sv(f, "name_override");
	}
	if (truthy(live(face_name))) {
		if ((truthy(live(id_name)) && !isEqual(live(id_name), live(face_name)))) {
			return fmt("＀ (as ＀)", [live(face_name), live(id_name)]);
		}
		return live(face_name);
	}
	if (truthy(live(id_name))) {
		return live(id_name);
	}
	return "Unknown";
});

// /mob/living/carbon/human/proc/get_face_name  (code/modules/mob/living/carbon/human/human_helpers.dm:54)
rt.def("/mob/living/carbon/human/proc/get_face_name", function get_face_name(f: Frame, if_no_face: Value) {
	let O: Value = null;
	f.vars = () => [if_no_face, O];
	if (live(if_no_face) === null) {
		if_no_face = "Unknown";
	}
	if ((truthy(rt.sv(f, "wear_mask")) && truthy(rt.bitAnd(rt.fv(f, "flags_inv", rt.sv(f, "wear_mask")), 128)))) {
		return live(if_no_face);
	}
	if ((truthy(rt.sv(f, "head")) && truthy(rt.bitAnd(rt.fv(f, "flags_inv", rt.sv(f, "head")), 128)))) {
		return live(if_no_face);
	}
	if (((((!truthy((O = rt.callSrc(f, "get_bodypart", ["head"]))) || truthy(rt.bitAnd(rt.sv(f, "status_flags"), 16384))) || rt.gt(add(rt.fv(f, "brutestate", live(O)), rt.fv(f, "burnstate", live(O))), 2)) || rt.gt(rt.sv(f, "cloneloss"), 50)) || !truthy(rt.sv(f, "real_name")))) {
		return live(if_no_face);
	}
	return rt.sv(f, "real_name");
});

// /mob/living/carbon/human/proc/get_id_name  (code/modules/mob/living/carbon/human/human_helpers.dm:66)
rt.def("/mob/living/carbon/human/proc/get_id_name", function get_id_name(f: Frame, if_no_id: Value) {
	let wallet: Value = null, pda: Value = null, id: Value = null, tablet: Value = null, card_slot: Value = null;
	f.vars = () => [if_no_id, wallet, pda, id, tablet, card_slot];
	if (live(if_no_id) === null) {
		if_no_id = "Unknown";
	}
	wallet = rt.sv(f, "wear_id");
	pda = rt.sv(f, "wear_id");
	id = rt.sv(f, "wear_id");
	tablet = rt.sv(f, "wear_id");
	if (truthy((rt.istype(live(wallet), T("/obj/item/weapon/storage/wallet")) ? 1 : 0))) {
		id = rt.fv(f, "front_id", live(wallet));
	}
	if (truthy((rt.istype(live(id), T("/obj/item/weapon/card/id")) ? 1 : 0))) {
		f.dot = rt.fv(f, "registered_name", live(id));
	} else {
		if (truthy((rt.istype(live(pda), T("/obj/item/device/pda")) ? 1 : 0))) {
			f.dot = rt.fv(f, "owner", live(pda));
		} else {
			if (truthy((rt.istype(live(tablet), T("/obj/item/device/modular_computer/tablet")) ? 1 : 0))) {
				if ((truthy((card_slot = rt.index(rt.fv(f, "all_components", live(tablet)), "CARD"))) && (truthy(rt.fv(f, "stored_card2", live(card_slot))) || truthy(rt.fv(f, "stored_card", live(card_slot)))))) {
					if (truthy(rt.fv(f, "stored_card2", live(card_slot)))) {
						f.dot = rt.gv(f, "registered_name", rt.fv(f, "stored_card2", live(card_slot)));
					} else {
						if (truthy(rt.fv(f, "stored_card", live(card_slot)))) {
							f.dot = rt.gv(f, "registered_name", rt.fv(f, "stored_card", live(card_slot)));
						}
					}
				}
			}
		}
	}
	if (!truthy(live(f.dot))) {
		f.dot = live(if_no_id);
	}
	return live(f.dot);
});

// /mob/living/carbon/human/proc/get_idcard  (code/modules/mob/living/carbon/human/human_helpers.dm:91)
rt.def("/mob/living/carbon/human/proc/get_idcard", function get_idcard(f: Frame) {
	if (!truthy(rt.sv(f, "wear_id"))) return f.dot;
	return rt.callName(f, rt.sv(f, "wear_id"), "GetID", []);
});

// /mob/living/carbon/human/proc/abiotic  (code/modules/mob/living/carbon/human/human_helpers.dm:96)
rt.def("/mob/living/carbon/human/proc/abiotic", function abiotic(f: Frame, full_body: Value) {
	let abiotic_hands: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [full_body, abiotic_hands, I, $e];
	if (live(full_body) === null) {
		full_body = 0;
	}
	abiotic_hands = 0;
	I = null;
	rt.forList(f, 0, rt.sv(f, "held_items"), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (!truthy(rt.bitAnd(rt.fv(f, "flags", live(I)), 2))) {
			abiotic_hands = 1;
			break;
		}
	}
	rt.endFor(f, 0);
	if (((truthy(live(full_body)) && truthy(live(abiotic_hands))) && (((((((((truthy(rt.sv(f, "back")) && !truthy(rt.bitAnd(rt.fv(f, "flags", rt.sv(f, "back")), 2))) || (truthy(rt.sv(f, "wear_mask")) && !truthy(rt.bitAnd(rt.fv(f, "flags", rt.sv(f, "wear_mask")), 2)))) || (truthy(rt.sv(f, "head")) && !truthy(rt.bitAnd(rt.fv(f, "flags", rt.sv(f, "head")), 2)))) || (truthy(rt.sv(f, "shoes")) && !truthy(rt.bitAnd(rt.fv(f, "flags", rt.sv(f, "shoes")), 2)))) || (truthy(rt.sv(f, "w_uniform")) && !truthy(rt.bitAnd(rt.fv(f, "flags", rt.sv(f, "w_uniform")), 2)))) || (truthy(rt.sv(f, "wear_suit")) && !truthy(rt.bitAnd(rt.fv(f, "flags", rt.sv(f, "wear_suit")), 2)))) || (truthy(rt.sv(f, "glasses")) && !truthy(rt.bitAnd(rt.fv(f, "flags", rt.sv(f, "glasses")), 2)))) || (truthy(rt.sv(f, "ears")) && !truthy(rt.bitAnd(rt.fv(f, "flags", rt.sv(f, "ears")), 2)))) || (truthy(rt.sv(f, "gloves")) && !truthy(rt.bitAnd(rt.fv(f, "flags", rt.sv(f, "gloves")), 2)))))) {
		return 1;
	}
	return live(abiotic_hands);
});

// /mob/living/carbon/human/proc/InCritical  (code/modules/mob/living/carbon/human/human_helpers.dm:109)
rt.def("/mob/living/carbon/human/proc/InCritical", function InCritical(f: Frame) {
	return ((rt.le(rt.sv(f, "health"), 0) ? 1 : 0) && (isEqual(rt.sv(f, "stat"), 1) ? 1 : 0));
});

// /mob/living/carbon/human/proc/reagent_check  (code/modules/mob/living/carbon/human/human_helpers.dm:112)  may sleep
rt.def("/mob/living/carbon/human/proc/reagent_check", function* reagent_check(f: Frame, R: Value) {
	f.vars = () => [R];
	return (yield* g.callName(f, rt.fv(f, "species", rt.sv(f, "dna")), "handle_chemicals", [live(R), live(f.src)]));
}, true);

// /mob/living/carbon/human/proc/can_track  (code/modules/mob/living/carbon/human/human_helpers.dm:117)
rt.def("/mob/living/carbon/human/proc/can_track", function can_track(f: Frame) {
	let hat: Value = null;
	f.vars = () => [hat];
	if ((truthy(rt.sv(f, "wear_id")) && truthy((rt.istype(rt.callName(f, rt.sv(f, "wear_id"), "GetID", []), T("/obj/item/weapon/card/id/syndicate")) ? 1 : 0)))) {
		return 0;
	}
	if (truthy((rt.istype(rt.sv(f, "head"), T("/obj/item/clothing/head")) ? 1 : 0))) {
		if (truthy(rt.gv(f, "blockTracking", (hat = rt.sv(f, "head"))))) {
			return 0;
		}
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["user"] });

// /mob/living/carbon/human/proc/get_permeability_protection  (code/modules/mob/living/carbon/human/human_helpers.dm:127)
rt.def("/mob/living/carbon/human/proc/get_permeability_protection", function get_permeability_protection(f: Frame) {
	let prot: Value = null, I: Value = null, protection: Value = null;
	let $e: any;
	f.vars = () => [prot, I, protection, $e];
	prot = rt.alist(f, ["hands", 0, "chest", 0, "groin", 0, "legs", 0, "feet", 0, "arms", 0, "head", 0]);
	I = null;
	rt.forList(f, 0, rt.callSrc(f, "get_equipped_items", []), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (truthy(rt.bitAnd(rt.fv(f, "body_parts_covered", live(I)), 1536))) {
			rt.setAt(live(prot), "hands", rt.call(f, P("/proc/max"), null, [subtract(1, rt.fv(f, "permeability_coefficient", live(I))), rt.at(live(prot), "hands")]));
		}
		if (truthy(rt.bitAnd(rt.fv(f, "body_parts_covered", live(I)), 2))) {
			rt.setAt(live(prot), "chest", rt.call(f, P("/proc/max"), null, [subtract(1, rt.fv(f, "permeability_coefficient", live(I))), rt.at(live(prot), "chest")]));
		}
		if (truthy(rt.bitAnd(rt.fv(f, "body_parts_covered", live(I)), 4))) {
			rt.setAt(live(prot), "groin", rt.call(f, P("/proc/max"), null, [subtract(1, rt.fv(f, "permeability_coefficient", live(I))), rt.at(live(prot), "groin")]));
		}
		if (truthy(rt.bitAnd(rt.fv(f, "body_parts_covered", live(I)), 24))) {
			rt.setAt(live(prot), "legs", rt.call(f, P("/proc/max"), null, [subtract(1, rt.fv(f, "permeability_coefficient", live(I))), rt.at(live(prot), "legs")]));
		}
		if (truthy(rt.bitAnd(rt.fv(f, "body_parts_covered", live(I)), 96))) {
			rt.setAt(live(prot), "feet", rt.call(f, P("/proc/max"), null, [subtract(1, rt.fv(f, "permeability_coefficient", live(I))), rt.at(live(prot), "feet")]));
		}
		if (truthy(rt.bitAnd(rt.fv(f, "body_parts_covered", live(I)), 384))) {
			rt.setAt(live(prot), "arms", rt.call(f, P("/proc/max"), null, [subtract(1, rt.fv(f, "permeability_coefficient", live(I))), rt.at(live(prot), "arms")]));
		}
		if (truthy(rt.bitAnd(rt.fv(f, "body_parts_covered", live(I)), 1))) {
			rt.setAt(live(prot), "head", rt.call(f, P("/proc/max"), null, [subtract(1, rt.fv(f, "permeability_coefficient", live(I))), rt.at(live(prot), "head")]));
		}
	}
	rt.endFor(f, 0);
	return (protection = divide(add(add(add(add(add(add(rt.at(live(prot), "head"), rt.at(live(prot), "arms")), rt.at(live(prot), "feet")), rt.at(live(prot), "legs")), rt.at(live(prot), "groin")), rt.at(live(prot), "chest")), rt.at(live(prot), "hands")), 7));
});

// /mob/living/carbon/human/proc/can_use_guns  (code/modules/mob/living/carbon/human/human_helpers.dm:147)
rt.def("/mob/living/carbon/human/proc/can_use_guns", function can_use_guns(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (isEqual(rt.fv(f, "trigger_guard", live(f.args[0])), 1)) {
		if (truthy(rt.callName(f, rt.fv(f, "dna", live(f.src)), "check_mutation", ["Hulk"]))) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>Your meaty finger is much too large for the trigger guard!</span>"]);
			return 0;
		}
		if (truthy((rt.isIn(f, 11, rt.gv(f, "species_traits", rt.gv(f, "species", rt.fv(f, "dna", live(f.src))))) ? 1 : 0))) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>Your fingers don't fit in the trigger guard!</span>"]);
			return 0;
		}
	}
	if (truthy(rt.sv(f, "mind"))) {
		if ((truthy(rt.fv(f, "martial_art", rt.sv(f, "mind"))) && truthy(rt.gv(f, "no_guns", rt.fv(f, "martial_art", rt.sv(f, "mind")))))) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>Use of ranged weaponry would bring dishonor to the clan.</span>"]);
			return 0;
		}
	}
	return live(f.dot);
}, false, { args: ["G"] });
