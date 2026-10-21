// From code/modules/mob/living/carbon/carbon_defense.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/carbon/proc/get_eye_protection  (code/modules/mob/living/carbon/carbon_defense.dm:3)
rt.def("/mob/living/carbon/proc/get_eye_protection", function get_eye_protection(f: Frame) {
	let number: Value = null, HFP: Value = null, GFP: Value = null, MFP: Value = null, E: Value = null;
	f.vars = () => [number, HFP, GFP, MFP, E];
	number = rt.callSuper(f, [], rt.Args.Same);
	if (truthy((rt.istype(rt.fv(f, "head", live(f.src)), T("/obj/item/clothing/head")) ? 1 : 0))) {
		number = rt.modify(live(number), rt.gv(f, "flash_protect", (HFP = rt.fv(f, "head", live(f.src)))), add);
	}
	if (truthy((rt.istype(rt.fv(f, "glasses", live(f.src)), T("/obj/item/clothing/glasses")) ? 1 : 0))) {
		number = rt.modify(live(number), rt.gv(f, "flash_protect", (GFP = rt.fv(f, "glasses", live(f.src)))), add);
	}
	if (truthy((rt.istype(rt.fv(f, "wear_mask", live(f.src)), T("/obj/item/clothing/mask")) ? 1 : 0))) {
		number = rt.modify(live(number), rt.gv(f, "flash_protect", (MFP = rt.fv(f, "wear_mask", live(f.src)))), add);
	}
	if (!truthy((E = rt.callSrc(f, "getorganslot", ["eye_sight"])))) {
		number = 9.999999848243207e+30;
	} else {
		number = rt.modify(live(number), rt.fv(f, "flash_protect", live(E)), add);
	}
	return live(number);
});

// /mob/living/carbon/proc/get_ear_protection  (code/modules/mob/living/carbon/carbon_defense.dm:26)
rt.def("/mob/living/carbon/proc/get_ear_protection", function get_ear_protection(f: Frame) {
	let number: Value = null, E: Value = null;
	let $0: any;
	f.vars = () => [number, E, $0];
	number = rt.callSuper(f, [], rt.Args.Same);
	$0 = rt.sv(f, "ears");
	if (truthy($0)) {
		if (truthy(rt.fv(f, "secondary_flags", rt.sv(f, "ears")))) {
			$0 = rt.index(rt.fv(f, "secondary_flags", rt.sv(f, "ears")), "bang_protect");
		} else {
			$0 = 0;
		}
	}
	if (truthy($0)) {
		number = rt.modify(live(number), 1, add);
	}
	$0 = rt.sv(f, "head");
	if (truthy($0)) {
		if (truthy(rt.fv(f, "secondary_flags", rt.sv(f, "head")))) {
			$0 = rt.index(rt.fv(f, "secondary_flags", rt.sv(f, "head")), "bang_protect");
		} else {
			$0 = 0;
		}
	}
	if (truthy($0)) {
		number = rt.modify(live(number), 1, add);
	}
	if (!truthy((E = rt.callSrc(f, "getorganslot", ["ears"])))) {
		number = 9.999999848243207e+30;
	} else {
		number = rt.modify(live(number), rt.fv(f, "bang_protect", live(E)), add);
	}
	return live(number);
});

// /mob/living/carbon/proc/is_mouth_covered  (code/modules/mob/living/carbon/carbon_defense.dm:39)
rt.def("/mob/living/carbon/proc/is_mouth_covered", function is_mouth_covered(f: Frame, head_only: Value, mask_only: Value) {
	f.vars = () => [head_only, mask_only];
	if (live(head_only) === null) {
		head_only = 0;
	}
	if (live(mask_only) === null) {
		mask_only = 0;
	}
	if (!(((!truthy(live(mask_only)) && truthy(rt.sv(f, "head"))) && truthy(rt.bitAnd(rt.fv(f, "flags_cover", rt.sv(f, "head")), 16))) || ((!truthy(live(head_only)) && truthy(rt.sv(f, "wear_mask"))) && truthy(rt.bitAnd(rt.fv(f, "flags_cover", rt.sv(f, "wear_mask")), 8))))) return f.dot;
	return 1;
});

// /mob/living/carbon/proc/is_eyes_covered  (code/modules/mob/living/carbon/carbon_defense.dm:43)
rt.def("/mob/living/carbon/proc/is_eyes_covered", function is_eyes_covered(f: Frame, check_glasses: Value, check_head: Value, check_mask: Value) {
	f.vars = () => [check_glasses, check_head, check_mask];
	if (live(check_glasses) === null) {
		check_glasses = 1;
	}
	if (live(check_head) === null) {
		check_head = 1;
	}
	if (live(check_mask) === null) {
		check_mask = 1;
	}
	if (((truthy(live(check_glasses)) && truthy(rt.sv(f, "glasses"))) && truthy(rt.bitAnd(rt.fv(f, "flags_cover", rt.sv(f, "glasses")), 1)))) {
		return 1;
	}
	if (((truthy(live(check_head)) && truthy(rt.sv(f, "head"))) && truthy(rt.bitAnd(rt.fv(f, "flags_cover", rt.sv(f, "head")), 4)))) {
		return 1;
	}
	if (!((truthy(live(check_mask)) && truthy(rt.sv(f, "wear_mask"))) && truthy(rt.bitAnd(rt.fv(f, "flags_cover", rt.sv(f, "wear_mask")), 8)))) return f.dot;
	return 1;
});

// /mob/living/carbon/proc/check_projectile_dismemberment  (code/modules/mob/living/carbon/carbon_defense.dm:51)  may sleep
rt.def("/mob/living/carbon/proc/check_projectile_dismemberment", function* check_projectile_dismemberment(f: Frame, _P: Value, def_zone: Value) {
	let affecting: Value = null;
	f.vars = () => [_P, def_zone, affecting];
	if (!((truthy((affecting = (yield* g.srcCall(f, "get_bodypart", live(def_zone))))) && truthy(rt.fv(f, "dismemberable", live(affecting)))) && rt.ge((yield* g.callName(f, live(affecting), "get_damage", [])), subtract(rt.fv(f, "max_damage", live(affecting)), rt.fv(f, "dismemberment", live(_P)))))) return f.dot;
	yield* g.callName(f, live(affecting), "dismember", [rt.fv(f, "damtype", live(_P))]);
	return f.dot;
}, true);

// /mob/living/carbon/proc/hitby  (code/modules/mob/living/carbon/carbon_defense.dm:56)  may sleep
rt.def("/mob/living/carbon/proc/hitby", function* hitby(f: Frame) {
	let I: Value = null;
	f.vars = () => [I];
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	if (live(f.args[3]) === null) {
		f.args[3] = 0;
	}
	if (!truthy(live(f.args[1]))) {
		if ((truthy(rt.sv(f, "in_throw_mode")) && !truthy((yield* g.srcCall(f, "get_active_held_item"))))) {
			if ((truthy(rt.sv(f, "canmove")) && !truthy((yield* g.srcCall(f, "restrained"))))) {
				if (truthy((rt.istype(live(f.args[0]), T("/obj/item")) ? 1 : 0))) {
					if (truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.gv(f, "loc", (I = live(f.args[0])))])))) {
						yield* g.srcCall(f, "put_in_active_hand", live(I));
						yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ catches ＀!</span>", [live(f.src), live(I)]));
						yield* g.srcCall(f, "throw_mode_off");
						return 1;
					}
				}
			}
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["AM", "skipcatch", "hitpush", "blocked"] });

// /mob/living/carbon/proc/attacked_by  (code/modules/mob/living/carbon/carbon_defense.dm:70)  may sleep
rt.def("/mob/living/carbon/proc/attacked_by", function* attacked_by(f: Frame, I: Value, user: Value) {
	let affecting: Value = null, location: Value = null, probability: Value = null;
	f.vars = () => [I, user, affecting, location, probability];
	if (!truthy((affecting = (yield* g.srcCall(f, "get_bodypart", (yield* g.call(f, P("/proc/ran_zone"), null, [rt.fv(f, "zone_selected", live(user))]))))))) {
		affecting = rt.index(rt.sv(f, "bodyparts"), 1);
	}
	yield* g.srcCall(f, "send_item_attack_message", live(I), live(user), rt.fv(f, "name", live(affecting)));
	if (!truthy(rt.fv(f, "force", live(I)))) return f.dot;
	yield* g.srcCall(f, "apply_damage", rt.fv(f, "force", live(I)), rt.fv(f, "damtype", live(I)), live(affecting));
	yield* g.srcCall(f, "damage_clothes", rt.fv(f, "force", live(I)), rt.fv(f, "damtype", live(I)), "melee", rt.fv(f, "body_zone", live(affecting)));
	if ((isEqual(rt.fv(f, "damtype", live(I)), "brute") && isEqual(rt.fv(f, "status", live(affecting)), 1))) {
		if (truthy(rt.op(f, "Prob", [], [33]))) {
			yield* g.callName(f, live(I), "add_mob_blood", [live(f.src)]);
			yield* g.srcCall(f, "add_splatter_floor", (location = rt.getStep(f, live(f.src), 0)));
			if (rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(user), live(f.src)])), 1)) {
				yield* g.callName(f, live(user), "add_mob_blood", [live(f.src)]);
			}
			if (isEqual(rt.fv(f, "body_zone", live(affecting)), "head")) {
				if (truthy(rt.sv(f, "wear_mask"))) {
					yield* g.callName(f, rt.sv(f, "wear_mask"), "add_mob_blood", [live(f.src)]);
					yield* g.srcCall(f, "update_inv_wear_mask");
				}
				if (truthy(rt.sv(f, "wear_neck"))) {
					yield* g.callName(f, rt.sv(f, "wear_neck"), "add_mob_blood", [live(f.src)]);
					yield* g.srcCall(f, "update_inv_neck");
				}
				if (truthy(rt.sv(f, "head"))) {
					yield* g.callName(f, rt.sv(f, "head"), "add_mob_blood", [live(f.src)]);
					yield* g.srcCall(f, "update_inv_head");
				}
			}
		}
	}
	if (truthy(rt.op(f, "Prob", [], [(probability = (yield* g.callName(f, live(I), "get_dismemberment_chance", [live(affecting)])))]))) {
		if (truthy((yield* g.callName(f, live(affecting), "dismember", [rt.fv(f, "damtype", live(I))])))) {
			yield* g.callName(f, live(I), "add_mob_blood", [live(f.src)]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), (yield* g.callName(f, live(I), "get_dismember_sound", [])), 80, 1]);
		}
	}
	return 1;
}, true);

// /mob/living/carbon/proc/attack_hand  (code/modules/mob/living/carbon/carbon_defense.dm:109)  may sleep
rt.def("/mob/living/carbon/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let D: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [user, D, S, $e];
	D = null;
	rt.forList(f, 0, rt.sv(f, "viruses"), T("/datum/disease"));
	while (($e = rt.next(f, 0)) !== undefined) {
		D = $e;
		if (truthy((yield* g.callName(f, live(D), "IsSpreadByTouch", [])))) {
			yield* g.callName(f, live(user), "ContractDisease", [live(D)]);
		}
	}
	rt.endFor(f, 0);
	D = null;
	rt.forList(f, 0, rt.fv(f, "viruses", live(user)), T("/datum/disease"));
	while (($e = rt.next(f, 0)) !== undefined) {
		D = $e;
		if (truthy((yield* g.callName(f, live(D), "IsSpreadByTouch", [])))) {
			yield* g.srcCall(f, "ContractDisease", live(D));
		}
	}
	rt.endFor(f, 0);
	if ((truthy(rt.sv(f, "lying")) && truthy(rt.len(f, rt.sv(f, "surgeries"))))) {
		if (isEqual(rt.fv(f, "a_intent", live(user)), "help")) {
			S = null;
			rt.forList(f, 0, rt.sv(f, "surgeries"), T("/datum/surgery"));
			while (($e = rt.next(f, 0)) !== undefined) {
				S = $e;
				if (truthy((yield* g.callName(f, live(S), "next_step", [live(user)])))) {
					return 1;
				}
			}
			rt.endFor(f, 0);
		}
	}
	return 0;
}, true);

// /mob/living/carbon/proc/attack_paw  (code/modules/mob/living/carbon/carbon_defense.dm:126)  may sleep
rt.def("/mob/living/carbon/proc/attack_paw", function* attack_paw(f: Frame) {
	let D: Value = null;
	let $e: any;
	f.vars = () => [D, $e];
	D = null;
	rt.forList(f, 0, rt.sv(f, "viruses"), T("/datum/disease"));
	while (($e = rt.next(f, 0)) !== undefined) {
		D = $e;
		if (truthy((yield* g.callName(f, live(D), "IsSpreadByTouch", [])))) {
			yield* g.callName(f, live(f.args[0]), "ContractDisease", [live(D)]);
		}
	}
	rt.endFor(f, 0);
	D = null;
	rt.forList(f, 0, rt.fv(f, "viruses", live(f.args[0])), T("/datum/disease"));
	while (($e = rt.next(f, 0)) !== undefined) {
		D = $e;
		if (truthy((yield* g.callName(f, live(D), "IsSpreadByTouch", [])))) {
			yield* g.srcCall(f, "ContractDisease", live(D));
		}
	}
	rt.endFor(f, 0);
	if (isEqual(rt.fv(f, "a_intent", live(f.args[0])), "help")) {
		yield* g.srcCall(f, "help_shake_act", live(f.args[0]));
		return 0;
	}
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	D = null;
	rt.forList(f, 0, rt.fv(f, "viruses", live(f.args[0])), T("/datum/disease"));
	while (($e = rt.next(f, 0)) !== undefined) {
		D = $e;
		yield* g.srcCall(f, "ForceContractDisease", live(D));
	}
	rt.endFor(f, 0);
	return 1;
}, true, { args: ["M"] });

// /mob/living/carbon/proc/attack_slime  (code/modules/mob/living/carbon/carbon_defense.dm:145)  may sleep
rt.def("/mob/living/carbon/proc/attack_slime", function* attack_slime(f: Frame) {
	let stunprob: Value = null, power: Value = null;
	f.vars = () => [stunprob, power];
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	if (rt.gt(rt.fv(f, "powerlevel", live(f.args[0])), 0)) {
		if (truthy(rt.op(f, "Prob", [], [(stunprob = add(multiply(rt.fv(f, "powerlevel", live(f.args[0])), 7), 10))]))) {
			(rt.modField(f, live(f.args[0]), "powerlevel", 3, subtract));
			if (rt.lt(rt.fv(f, "powerlevel", live(f.args[0])), 0)) {
				rt.setFv(f, "powerlevel", live(f.args[0]), 0);
			}
			yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>The ＀ has shocked ＀!</span>", [rt.fv(f, "name", live(f.args[0])), live(f.src)]), fmt("<span class='userdanger'>The ＀ has shocked ＀!</span>", [rt.fv(f, "name", live(f.args[0])), live(f.src)]));
			yield* g.call(f, P("/proc/do_sparks"), null, [5, 1, live(f.src)]);
			yield* g.srcCall(f, "Knockdown", multiply((power = add(rt.fv(f, "powerlevel", live(f.args[0])), (yield* g.call(f, P("/proc/rand"), null, [0, 3])))), 20));
			if (rt.lt(rt.sv(f, "stuttering"), live(power))) {
				rt.setSv(f, "stuttering", live(power));
			}
			if ((truthy(rt.op(f, "Prob", [], [live(stunprob)])) && rt.ge(rt.fv(f, "powerlevel", live(f.args[0])), 8))) {
				yield* g.srcCall(f, "adjustFireLoss", multiply(rt.fv(f, "powerlevel", live(f.args[0])), (yield* g.call(f, P("/proc/rand"), null, [6, 10]))));
				yield* g.srcCall(f, "updatehealth");
			}
		}
	}
	return 1;
}, true, { args: ["M"] });

// /mob/living/carbon/proc/dismembering_strike  (code/modules/mob/living/carbon/carbon_defense.dm:167)  may sleep
rt.def("/mob/living/carbon/proc/dismembering_strike", function* dismembering_strike(f: Frame, attacker: Value, dam_zone: Value) {
	let affecting: Value = null, things_to_ruin: Value = null, B: Value = null, bodypart: Value = null;
	let $e: any;
	f.vars = () => [attacker, dam_zone, affecting, things_to_ruin, B, bodypart, $e];
	if (!truthy(rt.fv(f, "limb_destroyer", live(attacker)))) {
		return live(dam_zone);
	}
	affecting = null;
	if ((truthy(live(dam_zone)) && truthy(rt.fv(f, "client", live(attacker))))) {
		affecting = (yield* g.srcCall(f, "get_bodypart", (yield* g.call(f, P("/proc/ran_zone"), null, [live(dam_zone)]))));
	} else {
		things_to_ruin = (yield* g.call(f, P("/proc/shuffle"), null, [(yield* g.callName(f, rt.sv(f, "bodyparts"), "Copy", []))]));
		B = null;
		rt.forList(f, 0, live(things_to_ruin));
		while (($e = rt.next(f, 0)) !== undefined) {
			B = $e;
			if ((isEqual(rt.gv(f, "body_zone", (bodypart = live(B))), "head") || isEqual(rt.fv(f, "body_zone", live(bodypart)), "chest"))) {
				continue;
			}
			if ((!truthy(live(affecting)) || rt.lt(divide((yield* g.callName(f, live(affecting), "get_damage", [])), rt.fv(f, "max_damage", live(affecting))), divide((yield* g.callName(f, live(bodypart), "get_damage", [])), rt.fv(f, "max_damage", live(bodypart)))))) {
				affecting = live(bodypart);
			}
		}
		rt.endFor(f, 0);
	}
	if (truthy(live(affecting))) {
		dam_zone = rt.fv(f, "body_zone", live(affecting));
		if (rt.ge((yield* g.callName(f, live(affecting), "get_damage", [])), rt.fv(f, "max_damage", live(affecting)))) {
			yield* g.callName(f, live(affecting), "dismember", []);
			return null;
		}
		return rt.fv(f, "body_zone", live(affecting));
	}
	return live(dam_zone);
}, true);

// /mob/living/carbon/proc/blob_act  (code/modules/mob/living/carbon/carbon_defense.dm:190)  may sleep
rt.def("/mob/living/carbon/proc/blob_act", function* blob_act(f: Frame, B: Value) {
	f.vars = () => [B];
	if (isEqual(rt.sv(f, "stat"), 2)) {
		return live(f.dot);
	} else {
		yield* g.srcCall(f, "show_message", "<span class='userdanger'>The blob attacks!</span>");
		yield* g.srcCall(f, "adjustBruteLoss", 10);
	}
	return f.dot;
}, true);

// /mob/living/carbon/proc/emp_act  (code/modules/mob/living/carbon/carbon_defense.dm:197)  may sleep
rt.def("/mob/living/carbon/proc/emp_act", function* emp_act(f: Frame) {
	let X: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [X, O, $e];
	X = null;
	rt.forList(f, 0, rt.sv(f, "internal_organs"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		yield* g.callName(f, (O = live(X)), "emp_act", [live(f.args[0])]);
	}
	rt.endFor(f, 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["severity"] });

// /mob/living/carbon/proc/electrocute_act  (code/modules/mob/living/carbon/carbon_defense.dm:203)  may sleep
rt.def("/mob/living/carbon/proc/electrocute_act", function* electrocute_act(f: Frame, shock_damage: Value, source: Value, siemens_coeff: Value, safety: Value, override: Value, tesla_shock: Value, illusion: Value, stun: Value) {
	let $0: any;
	f.vars = () => [shock_damage, source, siemens_coeff, safety, override, tesla_shock, illusion, stun, $0];
	if (live(siemens_coeff) === null) {
		siemens_coeff = 1;
	}
	if (live(safety) === null) {
		safety = 0;
	}
	if (live(override) === null) {
		override = 0;
	}
	if (live(tesla_shock) === null) {
		tesla_shock = 0;
	}
	if (live(illusion) === null) {
		illusion = 0;
	}
	if (live(stun) === null) {
		stun = 1;
	}
	$0 = live(tesla_shock);
	if (truthy($0)) {
		if (truthy(rt.fv(f, "secondary_flags", live(f.src)))) {
			$0 = rt.index(rt.fv(f, "secondary_flags", live(f.src)), "tesla_ignore");
		} else {
			$0 = 0;
		}
	}
	if (truthy($0)) {
		return 0;
	}
	(shock_damage = rt.modify(live(shock_damage), live(siemens_coeff), multiply));
	if ((truthy(rt.sv(f, "dna")) && truthy(rt.fv(f, "species", rt.sv(f, "dna"))))) {
		(shock_damage = rt.modify(live(shock_damage), rt.gv(f, "siemens_coeff", rt.fv(f, "species", rt.sv(f, "dna"))), multiply));
	}
	if ((rt.lt(live(shock_damage), 1) && !truthy(live(override)))) {
		return 0;
	}
	if (truthy((yield* g.callName(f, rt.sv(f, "reagents"), "has_reagent", ["teslium"])))) {
		(shock_damage = rt.modify(live(shock_damage), 1.5, multiply));
	}
	if (truthy(live(illusion))) {
		yield* g.srcCall(f, "adjustStaminaLoss", live(shock_damage));
	} else {
		yield* g.srcCall(f, "take_overall_damage", 0, live(shock_damage));
	}
	yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ was shocked by ％！!</span>", [live(f.src), live(source)]), "<span class='userdanger'>You feel a powerful shock coursing through your body!</span>", "<span class='italics'>You hear a heavy electrical crack.</span>");
	yield* g.srcCall(f, "do_jitter_animation", (rt.modSrcVar(f, "jitteriness", 1000, add)));
	rt.modSrcVar(f, "stuttering", 2, add);
	if (((!truthy(live(tesla_shock)) || (truthy(live(tesla_shock)) && rt.gt(live(siemens_coeff), 0.5))) && truthy(live(stun)))) {
		yield* g.srcCall(f, "Stun", 40);
	}
	rt.spawnTail(f, 20, "/mob/living/carbon/proc/electrocute_act: spawn at modules/mob/living/carbon/carbon_defense.dm:226", shock_damage, source, siemens_coeff, safety, override, tesla_shock, illusion, stun);
	if (truthy(live(override))) {
		return live(override);
	} else {
		return live(shock_damage);
	}
	return f.dot;
}, true);

// a spawn(20) body of /mob/living/carbon/proc/electrocute_act, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/carbon/proc/electrocute_act: spawn at modules/mob/living/carbon/carbon_defense.dm:226", function* (f: Frame, shock_damage: Value, source: Value, siemens_coeff: Value, safety: Value, override: Value, tesla_shock: Value, illusion: Value, stun: Value) {
	f.vars = () => [shock_damage, source, siemens_coeff, safety, override, tesla_shock, illusion, stun];
	rt.setSv(f, "jitteriness", (yield* g.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "jitteriness"), 990), 10])));
	if (((!truthy(live(tesla_shock)) || (truthy(live(tesla_shock)) && rt.gt(live(siemens_coeff), 0.5))) && truthy(live(stun)))) {
		yield* g.srcCall(f, "Knockdown", 60);
	}
	return null;
});

// /mob/living/carbon/proc/help_shake_act  (code/modules/mob/living/carbon/carbon_defense.dm:237)  may sleep
rt.def("/mob/living/carbon/proc/help_shake_act", function* help_shake_act(f: Frame, M: Value) {
	f.vars = () => [M];
	if (truthy(rt.sv(f, "on_fire"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='warning'>You can't put them out with just your bare hands!"]);
		return live(f.dot);
	}
	if (!(rt.ge(rt.sv(f, "health"), 0) && !truthy(rt.bitAnd(rt.sv(f, "status_flags"), 8192)))) return f.dot;
	if (truthy(rt.sv(f, "lying"))) {
		yield* g.callName(f, live(M), "visible_message", [fmt("<span class='notice'>＀ shakes ＀ trying to get ＀ up!</span>", [live(M), live(f.src), (yield* g.srcCall(f, "p_them"))]), fmt("<span class='notice'>You shake ＀ trying to get ＀ up!</span>", [live(f.src), (yield* g.srcCall(f, "p_them"))])]);
	} else {
		yield* g.callName(f, live(M), "visible_message", [fmt("<span class='notice'>＀ hugs ＀ to make ＀ feel better!</span>", [live(M), live(f.src), (yield* g.srcCall(f, "p_them"))]), fmt("<span class='notice'>You hug ＀ to make ＀ feel better!</span>", [live(f.src), (yield* g.srcCall(f, "p_them"))])]);
	}
	yield* g.srcCall(f, "AdjustStun", -60);
	yield* g.srcCall(f, "AdjustKnockdown", -60);
	yield* g.srcCall(f, "AdjustUnconscious", -60);
	yield* g.srcCall(f, "AdjustSleeping", -100);
	if (truthy(rt.sv(f, "resting"))) {
		rt.setSv(f, "resting", 0);
		yield* g.srcCall(f, "update_canmove");
	}
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/thudswoosh.ogg"), 50, 1, -1]);
	return f.dot;
}, true);

// /mob/living/carbon/proc/flash_act  (code/modules/mob/living/carbon/carbon_defense.dm:260)  may sleep
rt.def("/mob/living/carbon/proc/flash_act", function* flash_act(f: Frame) {
	let damage: Value = null, eyes: Value = null;
	f.vars = () => [damage, eyes];
	if (live(f.args[0]) === null) {
		f.args[0] = 1;
	}
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if (live(f.args[3]) === null) {
		f.args[3] = 0;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	damage = subtract(live(f.args[0]), (yield* g.srcCall(f, "get_eye_protection")));
	if (truthy(live(f.dot))) {
		if (!truthy((eyes = (yield* g.srcCall(f, "getorganslot", "eyes_sight"))))) {
			return live(f.dot);
		}
		if (truthy(live(f.args[3]))) {
			return live(f.dot);
		}
		if (isEqual(live(damage), 1)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>Your eyes sting a little.</span>"]);
			if (truthy(rt.op(f, "Prob", [], [40]))) {
				yield* g.srcCall(f, "adjust_eye_damage", 1);
			}
		} else {
			if (isEqual(live(damage), 2)) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>Your eyes burn.</span>"]);
				yield* g.srcCall(f, "adjust_eye_damage", (yield* g.call(f, P("/proc/rand"), null, [2, 4])));
			} else {
				if (rt.gt(live(damage), 3)) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>Your eyes itch and burn severely!</span>"]);
					yield* g.srcCall(f, "adjust_eye_damage", (yield* g.call(f, P("/proc/rand"), null, [12, 16])));
				}
			}
		}
		if (rt.gt(rt.fv(f, "eye_damage", live(eyes)), 10)) {
			yield* g.srcCall(f, "blind_eyes", live(damage));
			yield* g.srcCall(f, "blur_eyes", multiply(live(damage), (yield* g.call(f, P("/proc/rand"), null, [3, 6]))));
			if (rt.gt(rt.fv(f, "eye_damage", live(eyes)), 20)) {
				if (truthy(rt.op(f, "Prob", [], [subtract(rt.fv(f, "eye_damage", live(eyes)), 20)]))) {
					if (truthy((yield* g.srcCall(f, "become_nearsighted")))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>Your eyes start to burn badly!</span>"]);
					}
				} else {
					if (truthy(rt.op(f, "Prob", [], [subtract(rt.fv(f, "eye_damage", live(eyes)), 25)]))) {
						if (truthy((yield* g.srcCall(f, "become_blind")))) {
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>You can't see anything!</span>"]);
						}
					}
				}
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>Your eyes are really starting to hurt. This can't be good for you!</span>"]);
			}
		}
		if (truthy((yield* g.srcCall(f, "has_bane", "light")))) {
			yield* g.callName(f, rt.sv(f, "mind"), "disrupt_spells", [-500]);
		}
		return 1;
	} else {
		if (!isEqual(live(damage), 0)) return f.dot;
		if (truthy(rt.op(f, "Prob", [], [20]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='notice'>Something bright flashes in the corner of your vision!</span>"]);
		}
		if (!truthy((yield* g.srcCall(f, "has_bane", "light")))) return f.dot;
		yield* g.callName(f, rt.sv(f, "mind"), "disrupt_spells", [0]);
	}
	return f.dot;
}, true, { args: ["intensity", "override_blindness_check", "affect_silicon", "visual"] });

// /mob/living/carbon/proc/soundbang_act  (code/modules/mob/living/carbon/carbon_defense.dm:307)  may sleep
rt.def("/mob/living/carbon/proc/soundbang_act", function* soundbang_act(f: Frame, intensity: Value, stun_pwr: Value, damage_pwr: Value, deafen_pwr: Value) {
	let ear_safety: Value = null, ears: Value = null, effect_amount: Value = null, ear_damage: Value = null, deaf: Value = null;
	f.vars = () => [intensity, stun_pwr, damage_pwr, deafen_pwr, ear_safety, ears, effect_amount, ear_damage, deaf];
	if (live(intensity) === null) {
		intensity = 1;
	}
	if (live(stun_pwr) === null) {
		stun_pwr = 20;
	}
	if (live(damage_pwr) === null) {
		damage_pwr = 5;
	}
	if (live(deafen_pwr) === null) {
		deafen_pwr = 15;
	}
	ear_safety = (yield* g.srcCall(f, "get_ear_protection"));
	ears = (yield* g.srcCall(f, "getorganslot", "ears"));
	if (!rt.gt((effect_amount = subtract(live(intensity), live(ear_safety))), 0)) return f.dot;
	if (truthy(live(stun_pwr))) {
		yield* g.srcCall(f, "Knockdown", multiply(live(stun_pwr), live(effect_amount)));
	}
	if ((truthy((rt.istype(live(ears), T("/obj/item/organ/ears")) ? 1 : 0)) && (truthy(live(deafen_pwr)) || truthy(live(damage_pwr))))) {
		ear_damage = multiply(live(damage_pwr), live(effect_amount));
		deaf = (yield* g.call(f, P("/proc/max"), null, [rt.fv(f, "deaf", live(ears)), multiply(live(deafen_pwr), live(effect_amount))]));
		yield* g.srcCall(f, "adjustEarDamage", live(ear_damage), live(deaf));
		if (rt.ge(rt.fv(f, "ear_damage", live(ears)), 15)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>Your ears start to ring badly!</span>"]);
			if (truthy(rt.op(f, "Prob", [], [subtract(rt.fv(f, "ear_damage", live(ears)), 5)]))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='userdanger'>You can't hear anything!</span>"]);
				rt.setFv(f, "ear_damage", live(ears), (yield* g.call(f, P("/proc/min"), null, [rt.fv(f, "ear_damage", live(ears)), 100])));
			}
		} else {
			if (rt.ge(rt.fv(f, "ear_damage", live(ears)), 5)) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>Your ears start to ring!</span>"]);
			}
		}
		rt.op(f, "Output", [], [live(f.src), (yield* g.call(f, P("/proc/sound"), null, [rt.rsc("sound/weapons/flash_ring.ogg"), 0, 1, 0, 250]))], false);
	}
	return live(effect_amount);
}, true);

// /mob/living/carbon/proc/damage_clothes  (code/modules/mob/living/carbon/carbon_defense.dm:332)  may sleep
rt.def("/mob/living/carbon/proc/damage_clothes", function* damage_clothes(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value, def_zone: Value) {
	let hit_clothes: Value = null;
	f.vars = () => [damage_amount, damage_type, damage_flag, def_zone, hit_clothes];
	if (live(damage_type) === null) {
		damage_type = "brute";
	}
	if (live(damage_flag) === null) {
		damage_flag = 0;
	}
	if ((!isEqual(live(damage_type), "brute") && !isEqual(live(damage_type), "fire"))) {
		return live(f.dot);
	}
	(damage_amount = rt.modify(live(damage_amount), 0.5, multiply));
	if (!(!truthy(live(def_zone)) || isEqual(live(def_zone), "head"))) return f.dot;
	hit_clothes = null;
	if (truthy(rt.sv(f, "wear_mask"))) {
		hit_clothes = rt.sv(f, "wear_mask");
	}
	if (truthy(rt.sv(f, "wear_neck"))) {
		hit_clothes = rt.sv(f, "wear_neck");
	}
	if (truthy(rt.sv(f, "head"))) {
		hit_clothes = rt.sv(f, "head");
	}
	if (!truthy(live(hit_clothes))) return f.dot;
	yield* g.callName(f, live(hit_clothes), "take_damage", [live(damage_amount), live(damage_type), live(damage_flag), 0]);
	return f.dot;
}, true);

// /mob/living/carbon/proc/can_hear  (code/modules/mob/living/carbon/carbon_defense.dm:348)
rt.def("/mob/living/carbon/proc/can_hear", function can_hear(f: Frame) {
	let ears: Value = null;
	f.vars = () => [ears];
	f.dot = 0;
	if (!(truthy((rt.istype((ears = rt.callSrc(f, "getorganslot", ["ears"])), T("/obj/item/organ/ears")) ? 1 : 0)) && !truthy(rt.fv(f, "deaf", live(ears))))) return f.dot;
	f.dot = 1;
	return f.dot;
});
