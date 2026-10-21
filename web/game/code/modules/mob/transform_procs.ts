// From code/modules/mob/transform_procs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/carbon/proc/monkeyize  (code/modules/mob/transform_procs.dm:7)  may sleep
rt.def("/mob/living/carbon/proc/monkeyize", function* monkeyize(f: Frame, tr_flags: Value) {
	let stored_implants: Value = null, int_organs: Value = null, X: Value = null, IMP: Value = null, missing_bodyparts_zones: Value = null, cavity_object: Value = null, CH: Value = null, Itemlist: Value = null, W: Value = null, O: Value = null, R: Value = null, D: Value = null, Y: Value = null, IMP_7: Value = null, X_6: Value = null, I: Value = null, torso: Value = null, missing_zone: Value = null, BP: Value = null, X_9: Value = null, G: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [tr_flags, stored_implants, int_organs, X, IMP, missing_bodyparts_zones, cavity_object, CH, Itemlist, W, O, R, D, Y, IMP_7, X_6, I, torso, missing_zone, BP, X_9, G, A, $e];
	if (live(tr_flags) === null) {
		tr_flags = 67;
	}
	if (truthy(rt.sv(f, "notransform"))) {
		return live(f.dot);
	}
	stored_implants = rt.list();
	int_organs = rt.list();
	if (truthy(rt.bitAnd(live(tr_flags), 16))) {
		X = null;
		rt.forList(f, 0, rt.sv(f, "implants"));
		while (($e = rt.next(f, 0)) !== undefined) {
			X = $e;
			stored_implants = rt.modify(live(stored_implants), (IMP = live(X)), add);
			yield* g.callName(f, live(IMP), "removed", [live(f.src), 1, 1]);
		}
		rt.endFor(f, 0);
	}
	missing_bodyparts_zones = (yield* g.srcCall(f, "get_missing_limbs"));
	cavity_object = null;
	if (truthy(rt.gv(f, "cavity_item", (CH = (yield* g.srcCall(f, "get_bodypart", "chest")))))) {
		cavity_object = rt.fv(f, "cavity_item", live(CH));
		rt.setFv(f, "cavity_item", live(CH), null);
	}
	if (truthy(rt.bitAnd(live(tr_flags), 1))) {
		Itemlist = (yield* g.srcCall(f, "get_equipped_items"));
		Itemlist = rt.modify(live(Itemlist), rt.sv(f, "held_items"), add);
		W = null;
		rt.forList(f, 0, live(Itemlist), T("/obj/item"));
		while (($e = rt.next(f, 0)) !== undefined) {
			W = $e;
			yield* g.srcCall(f, "dropItemToGround", live(W));
		}
		rt.endFor(f, 0);
	}
	rt.setSv(f, "notransform", 1);
	rt.setSv(f, "canmove", 0);
	yield* g.callSrc(f, "Stun", [null, 22, "ignore_canstun", 1], rt.Args.Named);
	rt.setSv(f, "icon", null);
	yield* g.srcCall(f, "cut_overlays");
	rt.setSv(f, "invisibility", 100);
	yield* g.new_(f, T("/obj/effect/temp_visual/monkeyify"), [rt.sv(f, "loc")]);
	yield* g.call(f, P("/proc/sleep"), null, [22]);
	O = (yield* g.new_(f, T("/mob/living/carbon/monkey"), [rt.sv(f, "loc")]));
	if (truthy(rt.bitAnd(live(tr_flags), 8))) {
		rt.setFv(f, "name", live(O), fmt("monkey (＀)", [(yield* g.call(f, P("/proc/copytext"), null, [(yield* g.call(f, P("/proc/md5"), null, [rt.sv(f, "real_name")])), 2, 6]))]));
		rt.setFv(f, "real_name", live(O), fmt("monkey (＀)", [(yield* g.call(f, P("/proc/copytext"), null, [(yield* g.call(f, P("/proc/md5"), null, [rt.sv(f, "real_name")])), 2, 6]))]));
	}
	yield* g.callName(f, rt.sv(f, "dna"), "transfer_identity", [live(O)]);
	yield* g.callName(f, live(O), "updateappearance", ["icon_update", 0], rt.Args.Named);
	if (truthy(rt.bitAnd(live(tr_flags), 32))) {
		rt.setFv(f, "struc_enzymes", rt.fv(f, "dna", live(O)), rt.fv(f, "struc_enzymes", rt.sv(f, "dna")));
		R = rt.at(rt.gl("mutations_list"), "Monkified");
		rt.setFv(f, "struc_enzymes", rt.fv(f, "dna", live(O)), (yield* g.callName(f, live(R), "set_se", [null, rt.gv(f, "struc_enzymes", rt.fv(f, "dna", live(O))), "on", 1], rt.Args.Named)));
	}
	if (truthy(rt.sv(f, "suiciding"))) {
		rt.setFv(f, "suiciding", live(O), rt.sv(f, "suiciding"));
	}
	if (truthy(rt.sv(f, "hellbound"))) {
		rt.setFv(f, "hellbound", live(O), rt.sv(f, "hellbound"));
	}
	rt.setFv(f, "loc", live(O), rt.sv(f, "loc"));
	rt.setFv(f, "a_intent", live(O), "harm");
	if (truthy(rt.bitAnd(live(tr_flags), 2))) {
		rt.setFv(f, "viruses", live(O), rt.sv(f, "viruses"));
		rt.setSv(f, "viruses", rt.list());
		D = null;
		rt.forList(f, 0, rt.fv(f, "viruses", live(O)), T("/datum/disease"));
		while (($e = rt.next(f, 0)) !== undefined) {
			D = $e;
			rt.setFv(f, "affected_mob", live(D), live(O));
			rt.setFv(f, "holder", live(D), live(O));
		}
		rt.endFor(f, 0);
	}
	if (truthy(rt.bitAnd(live(tr_flags), 4))) {
		yield* g.callName(f, live(O), "setToxLoss", [(yield* g.srcCall(f, "getToxLoss")), 0]);
		yield* g.callName(f, live(O), "adjustBruteLoss", [(yield* g.srcCall(f, "getBruteLoss")), 0]);
		yield* g.callName(f, live(O), "setOxyLoss", [(yield* g.srcCall(f, "getOxyLoss")), 0]);
		yield* g.callName(f, live(O), "setCloneLoss", [(yield* g.srcCall(f, "getCloneLoss")), 0]);
		yield* g.callName(f, live(O), "adjustFireLoss", [(yield* g.srcCall(f, "getFireLoss")), 0]);
		yield* g.callName(f, live(O), "setBrainLoss", [(yield* g.srcCall(f, "getBrainLoss")), 0]);
		yield* g.callName(f, live(O), "updatehealth", []);
		rt.setFv(f, "radiation", live(O), rt.sv(f, "radiation"));
	}
	if (truthy(rt.bitAnd(live(tr_flags), 16))) {
		Y = null;
		rt.forList(f, 0, rt.sv(f, "implants"));
		while (($e = rt.next(f, 0)) !== undefined) {
			Y = $e;
			yield* g.callName(f, (IMP_7 = live(Y)), "implant", [live(O), null, 1]);
		}
		rt.endFor(f, 0);
	}
	if (truthy(rt.bitAnd(live(tr_flags), 256))) {
		X_6 = null;
		rt.forList(f, 0, rt.fv(f, "internal_organs", live(O)));
		while (($e = rt.next(f, 0)) !== undefined) {
			X_6 = $e;
			yield* g.callName(f, (I = live(X_6)), "Remove", [live(O), 1]);
		}
		rt.endFor(f, 0);
		if (truthy(rt.sv(f, "mind"))) {
			yield* g.callName(f, rt.sv(f, "mind"), "transfer_to", [live(O)]);
			if (truthy(rt.gv(f, "changeling", rt.fv(f, "mind", live(O))))) {
				rt.modField(f, rt.gv(f, "changeling", rt.fv(f, "mind", live(O))), "purchasedpowers", (yield* g.new_(f, T("/obj/effect/proc_holder/changeling/humanform"), [null])), add);
			}
		}
		X_6 = null;
		rt.forList(f, 0, rt.sv(f, "internal_organs"));
		while (($e = rt.next(f, 0)) !== undefined) {
			X_6 = $e;
			int_organs = rt.modify(live(int_organs), (I = live(X_6)), add);
			yield* g.callName(f, live(I), "Remove", [live(f.src), 1]);
		}
		rt.endFor(f, 0);
		X_6 = null;
		rt.forList(f, 0, live(int_organs));
		while (($e = rt.next(f, 0)) !== undefined) {
			X_6 = $e;
			yield* g.callName(f, (I = live(X_6)), "Insert", [live(O), 1]);
		}
		rt.endFor(f, 0);
	}
	torso = (yield* g.callName(f, live(O), "get_bodypart", ["chest"]));
	if (truthy(live(cavity_object))) {
		rt.setFv(f, "cavity_item", live(torso), live(cavity_object));
		rt.setFv(f, "loc", live(cavity_object), live(O));
	}
	missing_zone = null;
	rt.forList(f, 0, live(missing_bodyparts_zones));
	while (($e = rt.next(f, 0)) !== undefined) {
		missing_zone = $e;
		yield* g.callName(f, (BP = (yield* g.callName(f, live(O), "get_bodypart", [live(missing_zone)]))), "drop_limb", [1]);
		if (!truthy(rt.bitAnd(live(tr_flags), 256))) {
			X_9 = null;
			rt.forList(f, 1, rt.fv(f, "internal_organs", live(O)));
			while (($e = rt.next(f, 1)) !== undefined) {
				X_9 = $e;
				G = live(X_9);
				if (isEqual(rt.fv(f, "body_zone", live(BP)), (yield* g.call(f, P("/proc/check_zone"), null, [rt.fv(f, "zone", live(G))])))) {
					if (((truthy(rt.sv(f, "mind")) && truthy(rt.fv(f, "changeling", rt.sv(f, "mind")))) && truthy((rt.istype(live(G), T("/obj/item/organ/brain")) ? 1 : 0)))) {
						continue;
					}
					yield* g.call(f, P("/proc/qdel"), null, [live(G)]);
				}
			}
			rt.endFor(f, 1);
		}
		yield* g.call(f, P("/proc/qdel"), null, [live(BP)]);
	}
	rt.endFor(f, 0);
	if (truthy(rt.sv(f, "mind"))) {
		yield* g.callName(f, rt.sv(f, "mind"), "transfer_to", [live(O)]);
		if (truthy(rt.gv(f, "changeling", rt.fv(f, "mind", live(O))))) {
			rt.modField(f, rt.gv(f, "changeling", rt.fv(f, "mind", live(O))), "purchasedpowers", (yield* g.new_(f, T("/obj/effect/proc_holder/changeling/humanform"), [null])), add);
		}
	}
	if (truthy(rt.bitAnd(live(tr_flags), 64))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(O), "<B>You are now a monkey.</B>"]);
	}
	A = null;
	rt.forList(f, 0, rt.fv(f, "vars", rt.sv(f, "loc")));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (isEqual(rt.index(rt.fv(f, "vars", rt.sv(f, "loc")), live(A)), live(f.src))) {
			rt.setAt(rt.fv(f, "vars", rt.sv(f, "loc")), live(A), live(O));
		}
	}
	rt.endFor(f, 0);
	f.dot = live(O);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /mob/living/carbon/proc/humanize  (code/modules/mob/transform_procs.dm:153)  may sleep
rt.def("/mob/living/carbon/proc/humanize", function* humanize(f: Frame, tr_flags: Value) {
	let stored_implants: Value = null, int_organs: Value = null, X: Value = null, IMP: Value = null, missing_bodyparts_zones: Value = null, cavity_object: Value = null, CH: Value = null, Itemlist: Value = null, W: Value = null, O: Value = null, C: Value = null, R: Value = null, D: Value = null, Y: Value = null, IMP_7: Value = null, X_6: Value = null, I: Value = null, HF: Value = null, torso: Value = null, missing_zone: Value = null, BP: Value = null, X_9: Value = null, G: Value = null, HF_7: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [tr_flags, stored_implants, int_organs, X, IMP, missing_bodyparts_zones, cavity_object, CH, Itemlist, W, O, C, R, D, Y, IMP_7, X_6, I, HF, torso, missing_zone, BP, X_9, G, HF_7, A, $e];
	if (live(tr_flags) === null) {
		tr_flags = 67;
	}
	if (truthy(rt.sv(f, "notransform"))) {
		return live(f.dot);
	}
	stored_implants = rt.list();
	int_organs = rt.list();
	if (truthy(rt.bitAnd(live(tr_flags), 16))) {
		X = null;
		rt.forList(f, 0, rt.sv(f, "implants"));
		while (($e = rt.next(f, 0)) !== undefined) {
			X = $e;
			stored_implants = rt.modify(live(stored_implants), (IMP = live(X)), add);
			yield* g.callName(f, live(IMP), "removed", [live(f.src), 1, 1]);
		}
		rt.endFor(f, 0);
	}
	missing_bodyparts_zones = (yield* g.srcCall(f, "get_missing_limbs"));
	cavity_object = null;
	if (truthy(rt.gv(f, "cavity_item", (CH = (yield* g.srcCall(f, "get_bodypart", "chest")))))) {
		cavity_object = rt.fv(f, "cavity_item", live(CH));
		rt.setFv(f, "cavity_item", live(CH), null);
	}
	if (truthy(rt.bitAnd(live(tr_flags), 1))) {
		Itemlist = (yield* g.srcCall(f, "get_equipped_items"));
		Itemlist = rt.modify(live(Itemlist), rt.sv(f, "held_items"), add);
		W = null;
		rt.forList(f, 0, live(Itemlist), T("/obj/item"));
		while (($e = rt.next(f, 0)) !== undefined) {
			W = $e;
			yield* g.srcCall(f, "dropItemToGround", live(W), 1);
			if (truthy(rt.sv(f, "client"))) {
				(rt.modField(f, rt.sv(f, "client"), "screen", live(W), subtract));
			}
		}
		rt.endFor(f, 0);
	}
	rt.setSv(f, "notransform", 1);
	rt.setSv(f, "canmove", 0);
	yield* g.callSrc(f, "Stun", [null, 22, "ignore_canstun", 1], rt.Args.Named);
	rt.setSv(f, "icon", null);
	yield* g.srcCall(f, "cut_overlays");
	rt.setSv(f, "invisibility", 100);
	yield* g.new_(f, T("/obj/effect/temp_visual/monkeyify/humanify"), [rt.sv(f, "loc")]);
	yield* g.call(f, P("/proc/sleep"), null, [22]);
	O = (yield* g.new_(f, T("/mob/living/carbon/human"), [rt.sv(f, "loc")]));
	C = null;
	rt.forList(f, 0, rt.fv(f, "loc", live(O)), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		yield* g.callName(f, live(O), "equip_to_appropriate_slot", [live(C)]);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, rt.sv(f, "dna"), "transfer_identity", [live(O)]);
	yield* g.callName(f, live(O), "updateappearance", ["mutcolor_update", 1], rt.Args.Named);
	if (truthy((yield* g.call(f, P("/proc/cmptext"), null, ["monkey", (yield* g.call(f, P("/proc/copytext"), null, [rt.gv(f, "real_name", rt.fv(f, "dna", live(O))), 1, 7]))])))) {
		rt.setFv(f, "real_name", live(O), (yield* g.call(f, P("/proc/random_unique_name"), null, [rt.fv(f, "gender", live(O))])));
		yield* g.callName(f, rt.fv(f, "dna", live(O)), "generate_unique_enzymes", [live(O)]);
	} else {
		rt.setFv(f, "real_name", live(O), rt.gv(f, "real_name", rt.fv(f, "dna", live(O))));
	}
	rt.setFv(f, "name", live(O), rt.fv(f, "real_name", live(O)));
	if (truthy(rt.bitAnd(live(tr_flags), 32))) {
		rt.setFv(f, "struc_enzymes", rt.fv(f, "dna", live(O)), rt.fv(f, "struc_enzymes", rt.sv(f, "dna")));
		R = rt.at(rt.gl("mutations_list"), "Monkified");
		rt.setFv(f, "struc_enzymes", rt.fv(f, "dna", live(O)), (yield* g.callName(f, live(R), "set_se", [null, rt.gv(f, "struc_enzymes", rt.fv(f, "dna", live(O))), "on", 0], rt.Args.Named)));
		yield* g.callName(f, live(O), "domutcheck", []);
	}
	if (truthy(rt.sv(f, "suiciding"))) {
		rt.setFv(f, "suiciding", live(O), rt.sv(f, "suiciding"));
	}
	if (truthy(rt.sv(f, "hellbound"))) {
		rt.setFv(f, "hellbound", live(O), rt.sv(f, "hellbound"));
	}
	rt.setFv(f, "loc", live(O), rt.sv(f, "loc"));
	if (truthy(rt.bitAnd(live(tr_flags), 2))) {
		rt.setFv(f, "viruses", live(O), rt.sv(f, "viruses"));
		rt.setSv(f, "viruses", rt.list());
		D = null;
		rt.forList(f, 0, rt.fv(f, "viruses", live(O)), T("/datum/disease"));
		while (($e = rt.next(f, 0)) !== undefined) {
			D = $e;
			rt.setFv(f, "affected_mob", live(D), live(O));
			rt.setFv(f, "holder", live(D), live(O));
		}
		rt.endFor(f, 0);
		yield* g.callName(f, live(O), "med_hud_set_status", []);
	}
	if (truthy(rt.bitAnd(live(tr_flags), 4))) {
		yield* g.callName(f, live(O), "setToxLoss", [(yield* g.srcCall(f, "getToxLoss")), 0]);
		yield* g.callName(f, live(O), "adjustBruteLoss", [(yield* g.srcCall(f, "getBruteLoss")), 0]);
		yield* g.callName(f, live(O), "setOxyLoss", [(yield* g.srcCall(f, "getOxyLoss")), 0]);
		yield* g.callName(f, live(O), "setCloneLoss", [(yield* g.srcCall(f, "getCloneLoss")), 0]);
		yield* g.callName(f, live(O), "adjustFireLoss", [(yield* g.srcCall(f, "getFireLoss")), 0]);
		yield* g.callName(f, live(O), "setBrainLoss", [(yield* g.srcCall(f, "getBrainLoss")), 0]);
		yield* g.callName(f, live(O), "updatehealth", []);
		rt.setFv(f, "radiation", live(O), rt.sv(f, "radiation"));
	}
	if (truthy(rt.bitAnd(live(tr_flags), 16))) {
		Y = null;
		rt.forList(f, 0, rt.sv(f, "implants"));
		while (($e = rt.next(f, 0)) !== undefined) {
			Y = $e;
			yield* g.callName(f, (IMP_7 = live(Y)), "implant", [live(O), null, 1]);
		}
		rt.endFor(f, 0);
	}
	if (truthy(rt.bitAnd(live(tr_flags), 256))) {
		X_6 = null;
		rt.forList(f, 0, rt.fv(f, "internal_organs", live(O)));
		while (($e = rt.next(f, 0)) !== undefined) {
			X_6 = $e;
			yield* g.callName(f, (I = live(X_6)), "Remove", [live(O), 1]);
		}
		rt.endFor(f, 0);
		if (truthy(rt.sv(f, "mind"))) {
			yield* g.callName(f, rt.sv(f, "mind"), "transfer_to", [live(O)]);
			if (truthy(rt.gv(f, "changeling", rt.fv(f, "mind", live(O))))) {
				HF = null;
				rt.forList(f, 0, rt.gv(f, "purchasedpowers", rt.gv(f, "changeling", rt.fv(f, "mind", live(O)))), T("/obj/effect/proc_holder/changeling/humanform"));
				while (($e = rt.next(f, 0)) !== undefined) {
					HF = $e;
					(rt.modField(f, rt.gv(f, "changeling", rt.fv(f, "mind", live(O))), "purchasedpowers", live(HF), subtract));
				}
				rt.endFor(f, 0);
			}
		}
		X_6 = null;
		rt.forList(f, 0, rt.sv(f, "internal_organs"));
		while (($e = rt.next(f, 0)) !== undefined) {
			X_6 = $e;
			int_organs = rt.modify(live(int_organs), (I = live(X_6)), add);
			yield* g.callName(f, live(I), "Remove", [live(f.src), 1]);
		}
		rt.endFor(f, 0);
		X_6 = null;
		rt.forList(f, 0, live(int_organs));
		while (($e = rt.next(f, 0)) !== undefined) {
			X_6 = $e;
			yield* g.callName(f, (I = live(X_6)), "Insert", [live(O), 1]);
		}
		rt.endFor(f, 0);
	}
	torso = (yield* g.srcCall(f, "get_bodypart", "chest"));
	if (truthy(live(cavity_object))) {
		rt.setFv(f, "cavity_item", live(torso), live(cavity_object));
		rt.setFv(f, "loc", live(cavity_object), live(O));
	}
	missing_zone = null;
	rt.forList(f, 0, live(missing_bodyparts_zones));
	while (($e = rt.next(f, 0)) !== undefined) {
		missing_zone = $e;
		yield* g.callName(f, (BP = (yield* g.callName(f, live(O), "get_bodypart", [live(missing_zone)]))), "drop_limb", [1]);
		if (!truthy(rt.bitAnd(live(tr_flags), 256))) {
			X_9 = null;
			rt.forList(f, 1, rt.fv(f, "internal_organs", live(O)));
			while (($e = rt.next(f, 1)) !== undefined) {
				X_9 = $e;
				G = live(X_9);
				if (isEqual(rt.fv(f, "body_zone", live(BP)), (yield* g.call(f, P("/proc/check_zone"), null, [rt.fv(f, "zone", live(G))])))) {
					if (((truthy(rt.sv(f, "mind")) && truthy(rt.fv(f, "changeling", rt.sv(f, "mind")))) && truthy((rt.istype(live(G), T("/obj/item/organ/brain")) ? 1 : 0)))) {
						continue;
					}
					yield* g.call(f, P("/proc/qdel"), null, [live(G)]);
				}
			}
			rt.endFor(f, 1);
		}
		yield* g.call(f, P("/proc/qdel"), null, [live(BP)]);
	}
	rt.endFor(f, 0);
	if (truthy(rt.sv(f, "mind"))) {
		yield* g.callName(f, rt.sv(f, "mind"), "transfer_to", [live(O)]);
		if (truthy(rt.gv(f, "changeling", rt.fv(f, "mind", live(O))))) {
			HF_7 = null;
			rt.forList(f, 0, rt.gv(f, "purchasedpowers", rt.gv(f, "changeling", rt.fv(f, "mind", live(O)))), T("/obj/effect/proc_holder/changeling/humanform"));
			while (($e = rt.next(f, 0)) !== undefined) {
				HF_7 = $e;
				(rt.modField(f, rt.gv(f, "changeling", rt.fv(f, "mind", live(O))), "purchasedpowers", live(HF_7), subtract));
			}
			rt.endFor(f, 0);
		}
	}
	rt.setFv(f, "a_intent", live(O), "help");
	if (truthy(rt.bitAnd(live(tr_flags), 64))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(O), "<B>You are now a human.</B>"]);
	}
	f.dot = live(O);
	A = null;
	rt.forList(f, 0, rt.fv(f, "vars", rt.sv(f, "loc")));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (isEqual(rt.index(rt.fv(f, "vars", rt.sv(f, "loc")), live(A)), live(f.src))) {
			rt.setAt(rt.fv(f, "vars", rt.sv(f, "loc")), live(A), live(O));
		}
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/AIize  (code/modules/mob/transform_procs.dm:303)  may sleep
rt.def("/mob/living/carbon/human/proc/AIize", function* AIize(f: Frame) {
	let t: Value = null;
	let $e: any;
	f.vars = () => [t, $e];
	if (truthy(rt.sv(f, "notransform"))) {
		return live(f.dot);
	}
	t = null;
	rt.forList(f, 0, rt.sv(f, "bodyparts"));
	while (($e = rt.next(f, 0)) !== undefined) {
		t = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(t)]);
	}
	rt.endFor(f, 0);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /mob/living/carbon/proc/AIize  (code/modules/mob/transform_procs.dm:311)  may sleep
rt.def("/mob/living/carbon/proc/AIize", function* AIize(f: Frame) {
	let W: Value = null;
	let $e: any;
	f.vars = () => [W, $e];
	if (truthy(rt.sv(f, "notransform"))) {
		return live(f.dot);
	}
	W = null;
	rt.forList(f, 0, live(f.src), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		W = $e;
		yield* g.srcCall(f, "dropItemToGround", live(W));
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "regenerate_icons");
	rt.setSv(f, "notransform", 1);
	rt.setSv(f, "canmove", 0);
	rt.setSv(f, "icon", null);
	rt.setSv(f, "invisibility", 100);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /mob/proc/AIize  (code/modules/mob/transform_procs.dm:322)  may sleep
rt.def("/mob/proc/AIize", function* AIize(f: Frame, transfer_after: Value) {
	let loc_landmark: Value = null, sloc: Value = null, tripai: Value = null;
	let $e: any;
	f.vars = () => [transfer_after, loc_landmark, sloc, tripai, $e];
	if (live(transfer_after) === null) {
		transfer_after = 1;
	}
	if (truthy(rt.sv(f, "client"))) {
		yield* g.srcCall(f, "stop_sound_channel", 1024);
	}
	loc_landmark = null;
	sloc = null;
	rt.forList(f, 0, rt.gl("landmarks_list"), T("/obj/effect/landmark/start"));
	while (($e = rt.next(f, 0)) !== undefined) {
		sloc = $e;
		if (!isEqual(rt.fv(f, "name", live(sloc)), "AI")) {
			continue;
		}
		if (truthy(rt.locateIn(f, T("/mob/living/silicon/ai"), rt.fv(f, "loc", live(sloc))))) {
			continue;
		}
		loc_landmark = rt.fv(f, "loc", live(sloc));
	}
	rt.endFor(f, 0);
	if (!truthy(live(loc_landmark))) {
		tripai = null;
		rt.forList(f, 0, rt.gl("landmarks_list"), T("/obj/effect/landmark"));
		while (($e = rt.next(f, 0)) !== undefined) {
			tripai = $e;
			if (isEqual(rt.fv(f, "name", live(tripai)), "tripai")) {
				if (truthy(rt.locateIn(f, T("/mob/living/silicon/ai"), rt.fv(f, "loc", live(tripai))))) {
					continue;
				}
				loc_landmark = rt.fv(f, "loc", live(tripai));
			}
		}
		rt.endFor(f, 0);
	}
	if (!truthy(live(loc_landmark))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Oh god sorry we can't find an unoccupied AI spawn location, so we're spawning you on top of someone."]);
		sloc = null;
		rt.forList(f, 0, rt.gl("landmarks_list"), T("/obj/effect/landmark/start"));
		while (($e = rt.next(f, 0)) !== undefined) {
			sloc = $e;
			if (isEqual(rt.fv(f, "name", live(sloc)), "AI")) {
				loc_landmark = rt.fv(f, "loc", live(sloc));
			}
		}
		rt.endFor(f, 0);
	}
	if (!truthy(live(transfer_after))) {
		rt.setFv(f, "active", rt.sv(f, "mind"), 0);
	}
	f.dot = (yield* g.new_(f, T("/mob/living/silicon/ai"), [live(loc_landmark), null, live(f.src)]));
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/Robotize  (code/modules/mob/transform_procs.dm:353)  may sleep
rt.def("/mob/living/carbon/human/proc/Robotize", function* Robotize(f: Frame, delete_items: Value, transfer_after: Value) {
	let W: Value = null, t: Value = null, R: Value = null;
	let $e: any;
	f.vars = () => [delete_items, transfer_after, W, t, R, $e];
	if (live(delete_items) === null) {
		delete_items = 0;
	}
	if (live(transfer_after) === null) {
		transfer_after = 1;
	}
	if (truthy(rt.sv(f, "notransform"))) {
		return live(f.dot);
	}
	W = null;
	rt.forList(f, 0, live(f.src), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		W = $e;
		if (truthy(live(delete_items))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(W)]);
		} else {
			yield* g.srcCall(f, "dropItemToGround", live(W));
		}
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "regenerate_icons");
	rt.setSv(f, "notransform", 1);
	rt.setSv(f, "canmove", 0);
	rt.setSv(f, "icon", null);
	rt.setSv(f, "invisibility", 100);
	t = null;
	rt.forList(f, 0, rt.sv(f, "bodyparts"));
	while (($e = rt.next(f, 0)) !== undefined) {
		t = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(t)]);
	}
	rt.endFor(f, 0);
	rt.setFv(f, "cell", (R = (yield* g.new_(f, T("/mob/living/silicon/robot"), [rt.sv(f, "loc")]))), (yield* g.new_(f, T("/obj/item/weapon/stock_parts/cell"), [live(R)])));
	rt.setFv(f, "maxcharge", rt.fv(f, "cell", live(R)), 7500);
	rt.setFv(f, "charge", rt.fv(f, "cell", live(R)), 7500);
	rt.setFv(f, "gender", live(R), rt.sv(f, "gender"));
	rt.setFv(f, "invisibility", live(R), 0);
	if (truthy(rt.sv(f, "mind"))) {
		if (!truthy(live(transfer_after))) {
			rt.setFv(f, "active", rt.sv(f, "mind"), 0);
		}
		yield* g.callName(f, rt.sv(f, "mind"), "transfer_to", [live(R)]);
		if (truthy(rt.fv(f, "special_role", rt.sv(f, "mind")))) {
			yield* g.callName(f, rt.fv(f, "mind", live(R)), "store_memory", ["In case you look at this after being borged, the objectives are only here until I find a way to make them not show up for you, as I can't simply delete them without screwing up round-end reporting. --NeoFite"]);
		}
	} else {
		if (truthy(live(transfer_after))) {
			rt.setFv(f, "key", live(R), rt.sv(f, "key"));
		}
	}
	if (truthy(rt.fv(f, "rename_cyborg", rt.gl("config")))) {
		yield* g.callName(f, live(R), "rename_self", ["cyborg"]);
	}
	if (truthy(rt.fv(f, "mmi", live(R)))) {
		rt.setFv(f, "name", rt.fv(f, "mmi", live(R)), fmt("Man-Machine Interface: ＀", [rt.sv(f, "real_name")]));
		if (truthy(rt.gv(f, "brain", rt.fv(f, "mmi", live(R))))) {
			rt.setFv(f, "name", rt.gv(f, "brain", rt.fv(f, "mmi", live(R))), fmt("＀'s brain", [rt.sv(f, "real_name")]));
		}
		if (truthy(rt.gv(f, "brainmob", rt.fv(f, "mmi", live(R))))) {
			rt.setFv(f, "real_name", rt.gv(f, "brainmob", rt.fv(f, "mmi", live(R))), rt.sv(f, "real_name"));
			rt.setFv(f, "name", rt.gv(f, "brainmob", rt.fv(f, "mmi", live(R))), rt.sv(f, "real_name"));
		}
	}
	rt.setFv(f, "loc", live(R), rt.sv(f, "loc"));
	rt.setFv(f, "job", live(R), "Cyborg");
	yield* g.callName(f, live(R), "notify_ai", [1]);
	f.dot = live(R);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/Alienize  (code/modules/mob/transform_procs.dm:408)  may sleep
rt.def("/mob/living/carbon/human/proc/Alienize", function* Alienize(f: Frame) {
	let W: Value = null, t: Value = null, alien_caste: Value = null, new_xeno: Value = null;
	let $0: any, $e: any;
	f.vars = () => [W, t, alien_caste, new_xeno, $0, $e];
	if (truthy(rt.sv(f, "notransform"))) {
		return live(f.dot);
	}
	W = null;
	rt.forList(f, 0, live(f.src), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		W = $e;
		yield* g.srcCall(f, "dropItemToGround", live(W));
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "regenerate_icons");
	rt.setSv(f, "notransform", 1);
	rt.setSv(f, "canmove", 0);
	rt.setSv(f, "icon", null);
	rt.setSv(f, "invisibility", 100);
	t = null;
	rt.forList(f, 0, rt.sv(f, "bodyparts"));
	while (($e = rt.next(f, 0)) !== undefined) {
		t = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(t)]);
	}
	rt.endFor(f, 0);
	alien_caste = rt.op(f, "PickUnweighted", [3], ["Hunter", "Sentinel", "Drone"]);
	new_xeno = null;
	$0 = live(alien_caste);
	if ($0 === "Hunter") {
		new_xeno = (yield* g.new_(f, T("/mob/living/carbon/alien/humanoid/hunter"), [rt.sv(f, "loc")]));
	} else if ($0 === "Sentinel") {
		new_xeno = (yield* g.new_(f, T("/mob/living/carbon/alien/humanoid/sentinel"), [rt.sv(f, "loc")]));
	} else if ($0 === "Drone") {
		new_xeno = (yield* g.new_(f, T("/mob/living/carbon/alien/humanoid/drone"), [rt.sv(f, "loc")]));
	}
	rt.setFv(f, "a_intent", live(new_xeno), "harm");
	rt.setFv(f, "key", live(new_xeno), rt.sv(f, "key"));
	yield* g.call(f, P("/proc/to_chat"), null, [live(new_xeno), "<B>You are now an alien.</B>"]);
	f.dot = live(new_xeno);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/slimeize  (code/modules/mob/transform_procs.dm:438)  may sleep
rt.def("/mob/living/carbon/human/proc/slimeize", function* slimeize(f: Frame, reproduce: Value) {
	let W: Value = null, t: Value = null, new_slime: Value = null, number: Value = null, babies: Value = null, i: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [reproduce, W, t, new_slime, number, babies, i, M, $e];
	if (truthy(rt.sv(f, "notransform"))) {
		return live(f.dot);
	}
	W = null;
	rt.forList(f, 0, live(f.src), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		W = $e;
		yield* g.srcCall(f, "dropItemToGround", live(W));
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "regenerate_icons");
	rt.setSv(f, "notransform", 1);
	rt.setSv(f, "canmove", 0);
	rt.setSv(f, "icon", null);
	rt.setSv(f, "invisibility", 100);
	t = null;
	rt.forList(f, 0, rt.sv(f, "bodyparts"));
	while (($e = rt.next(f, 0)) !== undefined) {
		t = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(t)]);
	}
	rt.endFor(f, 0);
	new_slime = null;
	if (truthy(live(reproduce))) {
		number = rt.op(f, "PickWeighted", [3], [14, 2, 100, 3, 100, 4]);
		babies = rt.list();
		i = null;
		i = 1;
		while (rt.le(live(i), live(number))) {
			rt.setFv(f, "nutrition", (M = (yield* g.new_(f, T("/mob/living/simple_animal/slime"), [rt.sv(f, "loc")]))), (yield* g.call(f, P("/proc/round"), null, [divide(rt.sv(f, "nutrition"), live(number))])));
			yield* g.call(f, P("/proc/step_away"), null, [live(M), live(f.src)]);
			babies = rt.modify(live(babies), live(M), add);
			i = rt.inc(live(i), 1);
		}
		new_slime = rt.op(f, "PickUnweighted", [1], [live(babies)]);
	} else {
		new_slime = (yield* g.new_(f, T("/mob/living/simple_animal/slime"), [rt.sv(f, "loc")]));
	}
	rt.setFv(f, "a_intent", live(new_slime), "harm");
	rt.setFv(f, "key", live(new_slime), rt.sv(f, "key"));
	yield* g.call(f, P("/proc/to_chat"), null, [live(new_slime), "<B>You are now a slime. Skreee!</B>"]);
	f.dot = live(new_slime);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /mob/proc/become_overmind  (code/modules/mob/transform_procs.dm:468)  may sleep
rt.def("/mob/proc/become_overmind", function* become_overmind(f: Frame, mode_made: Value, starting_points: Value) {
	let B: Value = null;
	f.vars = () => [mode_made, starting_points, B];
	if (live(starting_points) === null) {
		starting_points = 60;
	}
	B = (yield* g.new_(f, T("/mob/camera/blob"), [rt.sv(f, "loc"), 0, live(mode_made), live(starting_points)]));
	if (truthy(rt.sv(f, "mind"))) {
		yield* g.callName(f, rt.sv(f, "mind"), "transfer_to", [live(B)]);
	} else {
		rt.setFv(f, "key", live(B), rt.sv(f, "key"));
	}
	f.dot = live(B);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/corgize  (code/modules/mob/transform_procs.dm:480)  may sleep
rt.def("/mob/living/carbon/human/proc/corgize", function* corgize(f: Frame) {
	let W: Value = null, t: Value = null, new_corgi: Value = null;
	let $e: any;
	f.vars = () => [W, t, new_corgi, $e];
	if (truthy(rt.sv(f, "notransform"))) {
		return live(f.dot);
	}
	W = null;
	rt.forList(f, 0, live(f.src), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		W = $e;
		yield* g.srcCall(f, "dropItemToGround", live(W));
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "regenerate_icons");
	rt.setSv(f, "notransform", 1);
	rt.setSv(f, "canmove", 0);
	rt.setSv(f, "icon", null);
	rt.setSv(f, "invisibility", 100);
	t = null;
	rt.forList(f, 0, rt.sv(f, "bodyparts"));
	while (($e = rt.next(f, 0)) !== undefined) {
		t = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(t)]);
	}
	rt.endFor(f, 0);
	rt.setFv(f, "a_intent", (new_corgi = (yield* g.new_(f, T("/mob/living/simple_animal/pet/dog/corgi"), [rt.sv(f, "loc")]))), "harm");
	rt.setFv(f, "key", live(new_corgi), rt.sv(f, "key"));
	yield* g.call(f, P("/proc/to_chat"), null, [live(new_corgi), "<B>You are now a Corgi. Yap Yap!</B>"]);
	f.dot = live(new_corgi);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/Animalize  (code/modules/mob/transform_procs.dm:500)  may sleep
rt.def("/mob/living/carbon/human/proc/Animalize", function* Animalize(f: Frame) {
	let mobtypes: Value = null, mobpath: Value = null, W: Value = null, t: Value = null, new_mob: Value = null;
	let $e: any;
	f.vars = () => [mobtypes, mobpath, W, t, new_mob, $e];
	mobtypes = (yield* g.call(f, P("/proc/typesof"), null, [T("/mob/living/simple_animal")]));
	if (!truthy((yield* g.srcCall(f, "safe_animal", (mobpath = (yield* g.op(f, "Prompt", [0], [null, null, "Choose a type", fmt("Which type of mob should ＀ turn into?", [live(f.src)]), live(mobtypes)]))))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='danger'>Sorry but this mob type is currently unavailable.</span>"]);
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "notransform"))) {
		return live(f.dot);
	}
	W = null;
	rt.forList(f, 0, live(f.src), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		W = $e;
		yield* g.srcCall(f, "dropItemToGround", live(W));
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "regenerate_icons");
	rt.setSv(f, "notransform", 1);
	rt.setSv(f, "canmove", 0);
	rt.setSv(f, "icon", null);
	rt.setSv(f, "invisibility", 100);
	t = null;
	rt.forList(f, 0, rt.sv(f, "bodyparts"));
	while (($e = rt.next(f, 0)) !== undefined) {
		t = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(t)]);
	}
	rt.endFor(f, 0);
	rt.setFv(f, "key", (new_mob = (yield* g.new_(f, live(mobpath), [rt.fv(f, "loc", live(f.src))]))), rt.sv(f, "key"));
	rt.setFv(f, "a_intent", live(new_mob), "harm");
	yield* g.call(f, P("/proc/to_chat"), null, [live(new_mob), "You suddenly feel more... animalistic."]);
	f.dot = live(new_mob);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /mob/proc/Animalize  (code/modules/mob/transform_procs.dm:533)  may sleep
rt.def("/mob/proc/Animalize", function* Animalize(f: Frame) {
	let mobtypes: Value = null, mobpath: Value = null, new_mob: Value = null;
	f.vars = () => [mobtypes, mobpath, new_mob];
	mobtypes = (yield* g.call(f, P("/proc/typesof"), null, [T("/mob/living/simple_animal")]));
	if (!truthy((yield* g.srcCall(f, "safe_animal", (mobpath = (yield* g.op(f, "Prompt", [0], [null, null, "Choose a type", fmt("Which type of mob should ＀ turn into?", [live(f.src)]), live(mobtypes)]))))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='danger'>Sorry but this mob type is currently unavailable.</span>"]);
		return live(f.dot);
	}
	rt.setFv(f, "key", (new_mob = (yield* g.new_(f, live(mobpath), [rt.fv(f, "loc", live(f.src))]))), rt.sv(f, "key"));
	rt.setFv(f, "a_intent", live(new_mob), "harm");
	yield* g.call(f, P("/proc/to_chat"), null, [live(new_mob), "You feel more... animalistic"]);
	f.dot = live(new_mob);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /mob/proc/safe_animal  (code/modules/mob/transform_procs.dm:557)
rt.def("/mob/proc/safe_animal", function safe_animal(f: Frame, MP: Value) {
	if (!truthy(live(MP))) {
		return 0;
	}
	if (truthy(rt.call(f, P("/proc/ispath"), null, [live(MP), T("/mob/living/simple_animal/hostile/construct")]))) {
		return 0;
	}
	if (truthy(rt.call(f, P("/proc/ispath"), null, [live(MP), T("/mob/living/simple_animal/pet/cat")]))) {
		return 1;
	}
	if (truthy(rt.call(f, P("/proc/ispath"), null, [live(MP), T("/mob/living/simple_animal/pet/dog/corgi")]))) {
		return 1;
	}
	if (truthy(rt.call(f, P("/proc/ispath"), null, [live(MP), T("/mob/living/simple_animal/crab")]))) {
		return 1;
	}
	if (truthy(rt.call(f, P("/proc/ispath"), null, [live(MP), T("/mob/living/simple_animal/hostile/carp")]))) {
		return 1;
	}
	if (truthy(rt.call(f, P("/proc/ispath"), null, [live(MP), T("/mob/living/simple_animal/hostile/mushroom")]))) {
		return 1;
	}
	if (truthy(rt.call(f, P("/proc/ispath"), null, [live(MP), T("/mob/living/simple_animal/shade")]))) {
		return 1;
	}
	if (truthy(rt.call(f, P("/proc/ispath"), null, [live(MP), T("/mob/living/simple_animal/hostile/killertomato")]))) {
		return 1;
	}
	if (truthy(rt.call(f, P("/proc/ispath"), null, [live(MP), T("/mob/living/simple_animal/mouse")]))) {
		return 1;
	}
	if (truthy(rt.call(f, P("/proc/ispath"), null, [live(MP), T("/mob/living/simple_animal/hostile/bear")]))) {
		return 1;
	}
	if (truthy(rt.call(f, P("/proc/ispath"), null, [live(MP), T("/mob/living/simple_animal/parrot")]))) {
		return 1;
	}
	return 0;
});
