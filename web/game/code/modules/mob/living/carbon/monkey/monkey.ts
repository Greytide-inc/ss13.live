// From code/modules/mob/living/carbon/monkey/monkey.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/carbon/monkey/proc/Initialize  (code/modules/mob/living/carbon/monkey/monkey.dm:21)  may sleep
rt.def("/mob/living/carbon/monkey/proc/Initialize", function* Initialize(f: Frame) {
	rt.modSrcVar(f, "verbs", P("/mob/living/proc/mob_sleep"), add);
	rt.modSrcVar(f, "verbs", P("/mob/living/proc/lay_down"), add);
	if (truthy(rt.sv(f, "unique_name"))) {
		rt.setSv(f, "gender", rt.op(f, "PickUnweighted", [2], ["male", "female"]));
	}
	rt.setSv(f, "real_name", rt.sv(f, "name"));
	yield* g.srcCall(f, "create_bodyparts");
	yield* g.srcCall(f, "create_internal_organs");
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "create_dna", live(f.src));
	yield* g.callName(f, rt.sv(f, "dna"), "initialize_dna", [(yield* g.call(f, P("/proc/random_blood_type"), null, []))]);
	return f.dot;
}, true);

// /mob/living/carbon/monkey/proc/create_internal_organs  (code/modules/mob/living/carbon/monkey/monkey.dm:39)  may sleep
rt.def("/mob/living/carbon/monkey/proc/create_internal_organs", function* create_internal_organs(f: Frame) {
	rt.modSrcVar(f, "internal_organs", (yield* g.new_(f, T("/obj/item/organ/appendix"), [])), add);
	rt.modSrcVar(f, "internal_organs", (yield* g.new_(f, T("/obj/item/organ/lungs"), [])), add);
	rt.modSrcVar(f, "internal_organs", (yield* g.new_(f, T("/obj/item/organ/heart"), [])), add);
	rt.modSrcVar(f, "internal_organs", (yield* g.new_(f, T("/obj/item/organ/brain"), [])), add);
	rt.modSrcVar(f, "internal_organs", (yield* g.new_(f, T("/obj/item/organ/tongue"), [])), add);
	rt.modSrcVar(f, "internal_organs", (yield* g.new_(f, T("/obj/item/organ/eyes"), [])), add);
	rt.modSrcVar(f, "internal_organs", (yield* g.new_(f, T("/obj/item/organ/ears"), [])), add);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /mob/living/carbon/monkey/proc/movement_delay  (code/modules/mob/living/carbon/monkey/monkey.dm:50)
rt.def("/mob/living/carbon/monkey/proc/movement_delay", function movement_delay(f: Frame) {
	let health_deficiency: Value = null;
	f.vars = () => [health_deficiency];
	if (truthy(rt.sv(f, "reagents"))) {
		if (truthy(rt.callName(f, rt.sv(f, "reagents"), "has_reagent", ["morphine"]))) {
			return -1;
		}
		if (truthy(rt.callName(f, rt.sv(f, "reagents"), "has_reagent", ["nuka_cola"]))) {
			return -1;
		}
	}
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (rt.ge((health_deficiency = subtract(100, rt.sv(f, "health"))), 45)) {
		f.dot = rt.modify(live(f.dot), divide(live(health_deficiency), 25), add);
	}
	if (rt.lt(rt.sv(f, "bodytemperature"), 283.22198486328125)) {
		f.dot = rt.modify(live(f.dot), multiply(divide(subtract(283.22198486328125, rt.sv(f, "bodytemperature")), 10), 1.75), add);
	}
	return add(live(f.dot), rt.fv(f, "monkey_delay", rt.gl("config")));
});

// /mob/living/carbon/monkey/proc/Stat  (code/modules/mob/living/carbon/monkey/monkey.dm:66)  may sleep
rt.def("/mob/living/carbon/monkey/proc/Stat", function* Stat(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((yield* g.call(f, P("/proc/statpanel"), null, ["Status"])))) {
		yield* g.call(f, P("/proc/stat"), null, [null, fmt("Intent: ＀", [rt.sv(f, "a_intent")])]);
		yield* g.call(f, P("/proc/stat"), null, [null, fmt("Move Mode: ＀", [rt.sv(f, "m_intent")])]);
		if ((truthy(rt.sv(f, "client")) && truthy(rt.sv(f, "mind")))) {
			if (truthy(rt.fv(f, "changeling", rt.sv(f, "mind")))) {
				yield* g.call(f, P("/proc/stat"), null, ["Chemical Storage", fmt("＀/＀", [rt.gv(f, "chem_charges", rt.fv(f, "changeling", rt.sv(f, "mind"))), rt.gv(f, "chem_storage", rt.fv(f, "changeling", rt.sv(f, "mind")))])]);
				yield* g.call(f, P("/proc/stat"), null, ["Absorbed DNA", rt.gv(f, "absorbedcount", rt.fv(f, "changeling", rt.sv(f, "mind")))]);
			}
		}
	}
	return live(f.dot);
}, true);

// /mob/living/carbon/monkey/proc/assess_threat  (code/modules/mob/living/carbon/monkey/monkey.dm:94)  may sleep
rt.def("/mob/living/carbon/monkey/proc/assess_threat", function* assess_threat(f: Frame, judgement_criteria: Value, lasercolor: Value, weaponcheck: Value) {
	let threatcount: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [judgement_criteria, lasercolor, weaponcheck, threatcount, I, $e];
	if (live(lasercolor) === null) {
		lasercolor = "";
	}
	if (live(weaponcheck) === null) {
		weaponcheck = null;
	}
	if (truthy(rt.bitAnd(live(judgement_criteria), 1))) {
		return 10;
	}
	threatcount = 0;
	if ((!truthy(rt.bitAnd(live(judgement_criteria), 16)) && truthy(rt.bitAnd(live(judgement_criteria), 2)))) {
		threatcount = rt.modify(live(threatcount), 4, add);
	}
	if (truthy(live(lasercolor))) {
		if (isEqual(live(lasercolor), "b")) {
			if (truthy((yield* g.srcCall(f, "is_holding_item_of_type", T("/obj/item/weapon/gun/energy/laser/redtag"))))) {
				threatcount = rt.modify(live(threatcount), 4, add);
			}
		}
		if (isEqual(live(lasercolor), "r")) {
			if (truthy((yield* g.srcCall(f, "is_holding_item_of_type", T("/obj/item/weapon/gun/energy/laser/bluetag"))))) {
				threatcount = rt.modify(live(threatcount), 4, add);
			}
		}
		return live(threatcount);
	}
	if ((truthy(rt.bitAnd(live(judgement_criteria), 4)) && truthy(live(weaponcheck)))) {
		I = null;
		rt.forList(f, 0, rt.sv(f, "held_items"), T("/obj/item"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			if (truthy((yield* g.callName(f, live(weaponcheck), "Invoke", [live(I)])))) {
				threatcount = rt.modify(live(threatcount), 4, add);
			}
		}
		rt.endFor(f, 0);
	}
	if (truthy((yield* g.srcCall(f, "isloyal")))) {
		(threatcount = rt.modify(live(threatcount), 1, subtract));
	}
	return live(threatcount);
}, true);

// /mob/living/carbon/monkey/proc/get_permeability_protection  (code/modules/mob/living/carbon/monkey/monkey.dm:130)
rt.def("/mob/living/carbon/monkey/proc/get_permeability_protection", function get_permeability_protection(f: Frame) {
	let protection: Value = null;
	f.vars = () => [protection];
	protection = 0;
	if (truthy(rt.sv(f, "head"))) {
		protection = subtract(1, rt.fv(f, "permeability_coefficient", rt.sv(f, "head")));
	}
	if (truthy(rt.sv(f, "wear_mask"))) {
		protection = rt.call(f, P("/proc/max"), null, [subtract(1, rt.fv(f, "permeability_coefficient", rt.sv(f, "wear_mask"))), live(protection)]);
	}
	return (protection = divide(live(protection), 7));
});

// /mob/living/carbon/monkey/proc/IsVocal  (code/modules/mob/living/carbon/monkey/monkey.dm:137)
rt.def("/mob/living/carbon/monkey/proc/IsVocal", function IsVocal(f: Frame) {
	if (!truthy(rt.callSrc(f, "getorganslot", ["lungs"]))) {
		return 0;
	}
	return 1;
});

rt.type(4820, "/mob/living/carbon/monkey/angry", "/mob/living/carbon/monkey", {
	aggressive: 1,
});

// /mob/living/carbon/monkey/angry/proc/Initialize  (code/modules/mob/living/carbon/monkey/monkey.dm:148)  may sleep
rt.def("/mob/living/carbon/monkey/angry/proc/Initialize", function* Initialize(f: Frame) {
	let helmet: Value = null;
	f.vars = () => [helmet];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.op(f, "Prob", [], [10]))) return f.dot;
	yield* g.srcCall(f, "equip_to_slot_or_del", (helmet = (yield* g.new_(f, T("/obj/item/clothing/head/helmet/justice/escape"), [live(f.src)]))), 11);
	yield* g.callName(f, live(helmet), "attack_self", [live(f.src)]);
	return f.dot;
}, true);
