// From code/modules/mob/living/carbon/damage_procs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/carbon/proc/apply_damage  (code/modules/mob/living/carbon/damage_procs.dm:4)  may sleep
rt.def("/mob/living/carbon/proc/apply_damage", function* apply_damage(f: Frame, damage: Value, damagetype: Value, def_zone: Value, blocked: Value) {
	let hit_percent: Value = null, BP: Value = null;
	let $0: any;
	f.vars = () => [damage, damagetype, def_zone, blocked, hit_percent, BP, $0];
	if (live(damagetype) === null) {
		damagetype = "brute";
	}
	if (live(def_zone) === null) {
		def_zone = null;
	}
	if (live(blocked) === null) {
		blocked = 0;
	}
	hit_percent = divide(subtract(100, live(blocked)), 100);
	if ((!truthy(live(damage)) || rt.le(live(hit_percent), 0))) {
		return 0;
	}
	BP = null;
	if (truthy((rt.istype(live(def_zone), T("/obj/item/bodypart")) ? 1 : 0))) {
		BP = live(def_zone);
	} else {
		if (!truthy(live(def_zone))) {
			def_zone = (yield* g.call(f, P("/proc/ran_zone"), null, [live(def_zone)]));
		}
		if (!truthy((BP = (yield* g.srcCall(f, "get_bodypart", (yield* g.call(f, P("/proc/check_zone"), null, [live(def_zone)]))))))) {
			BP = rt.index(rt.sv(f, "bodyparts"), 1);
		}
	}
	$0 = live(damagetype);
	if ($0 === "brute") {
		if (truthy(live(BP))) {
			if (truthy((yield* g.callName(f, live(BP), "receive_damage", [multiply(live(damage), live(hit_percent)), 0])))) {
				yield* g.srcCall(f, "update_damage_overlays");
			}
		} else {
			yield* g.srcCall(f, "adjustBruteLoss", multiply(live(damage), live(hit_percent)));
		}
	} else if ($0 === "fire") {
		if (truthy(live(BP))) {
			if (truthy((yield* g.callName(f, live(BP), "receive_damage", [0, multiply(live(damage), live(hit_percent))])))) {
				yield* g.srcCall(f, "update_damage_overlays");
			}
		} else {
			yield* g.srcCall(f, "adjustFireLoss", multiply(live(damage), live(hit_percent)));
		}
	} else if ($0 === "tox") {
		yield* g.srcCall(f, "adjustToxLoss", multiply(live(damage), live(hit_percent)));
	} else if ($0 === "oxy") {
		yield* g.srcCall(f, "adjustOxyLoss", multiply(live(damage), live(hit_percent)));
	} else if ($0 === "clone") {
		yield* g.srcCall(f, "adjustCloneLoss", multiply(live(damage), live(hit_percent)));
	} else if ($0 === "stamina") {
		yield* g.srcCall(f, "adjustStaminaLoss", multiply(live(damage), live(hit_percent)));
	}
	return 1;
}, true);

// /mob/living/carbon/proc/getBruteLoss  (code/modules/mob/living/carbon/damage_procs.dm:45)
rt.def("/mob/living/carbon/proc/getBruteLoss", function getBruteLoss(f: Frame) {
	let amount: Value = null, X: Value = null, BP: Value = null;
	let $e: any;
	f.vars = () => [amount, X, BP, $e];
	amount = 0;
	X = null;
	rt.forList(f, 0, rt.sv(f, "bodyparts"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		amount = rt.modify(live(amount), rt.gv(f, "brute_dam", (BP = live(X))), add);
	}
	rt.endFor(f, 0);
	return live(amount);
});

// /mob/living/carbon/proc/getFireLoss  (code/modules/mob/living/carbon/damage_procs.dm:52)
rt.def("/mob/living/carbon/proc/getFireLoss", function getFireLoss(f: Frame) {
	let amount: Value = null, X: Value = null, BP: Value = null;
	let $e: any;
	f.vars = () => [amount, X, BP, $e];
	amount = 0;
	X = null;
	rt.forList(f, 0, rt.sv(f, "bodyparts"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		amount = rt.modify(live(amount), rt.gv(f, "burn_dam", (BP = live(X))), add);
	}
	rt.endFor(f, 0);
	return live(amount);
});

// /mob/living/carbon/proc/adjustBruteLoss  (code/modules/mob/living/carbon/damage_procs.dm:59)  may sleep
rt.def("/mob/living/carbon/proc/adjustBruteLoss", function* adjustBruteLoss(f: Frame, amount: Value, updating_health: Value, forced: Value) {
	f.vars = () => [amount, updating_health, forced];
	if (live(updating_health) === null) {
		updating_health = 1;
	}
	if (live(forced) === null) {
		forced = 0;
	}
	if ((!truthy(live(forced)) && truthy(rt.bitAnd(rt.sv(f, "status_flags"), 4096)))) {
		return 0;
	}
	if (rt.gt(live(amount), 0)) {
		yield* g.srcCall(f, "take_overall_damage", live(amount), 0, live(updating_health));
	} else {
		yield* g.srcCall(f, "heal_overall_damage", rt.neg(live(amount)), 0, 0, 1, live(updating_health));
	}
	return live(amount);
}, true);

// /mob/living/carbon/proc/adjustFireLoss  (code/modules/mob/living/carbon/damage_procs.dm:68)  may sleep
rt.def("/mob/living/carbon/proc/adjustFireLoss", function* adjustFireLoss(f: Frame, amount: Value, updating_health: Value, forced: Value) {
	f.vars = () => [amount, updating_health, forced];
	if (live(updating_health) === null) {
		updating_health = 1;
	}
	if (live(forced) === null) {
		forced = 0;
	}
	if ((!truthy(live(forced)) && truthy(rt.bitAnd(rt.sv(f, "status_flags"), 4096)))) {
		return 0;
	}
	if (rt.gt(live(amount), 0)) {
		yield* g.srcCall(f, "take_overall_damage", 0, live(amount), live(updating_health));
	} else {
		yield* g.srcCall(f, "heal_overall_damage", 0, rt.neg(live(amount)), 0, 1, live(updating_health));
	}
	return live(amount);
}, true);

// /mob/living/carbon/proc/adjustToxLoss  (code/modules/mob/living/carbon/damage_procs.dm:78)  may sleep
rt.def("/mob/living/carbon/proc/adjustToxLoss", function* adjustToxLoss(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if (truthy((rt.isIn(f, (((!truthy(live(f.args[2])) ? 1 : 0) && (yield* g.srcCall(f, "has_dna"))) && 24), rt.gv(f, "species_traits", rt.fv(f, "species", rt.sv(f, "dna")))) ? 1 : 0))) {
		if (rt.gt((f.args[0] = rt.neg(live(f.args[0]))), 0)) {
			(rt.modSrcVar(f, "blood_volume", multiply(5, live(f.args[0])), subtract));
		} else {
			(rt.modSrcVar(f, "blood_volume", live(f.args[0]), subtract));
		}
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["amount", "updating_health", "forced"] });

// /mob/living/carbon/proc/get_damaged_bodyparts  (code/modules/mob/living/carbon/damage_procs.dm:90)
rt.def("/mob/living/carbon/proc/get_damaged_bodyparts", function get_damaged_bodyparts(f: Frame, brute: Value, burn: Value) {
	let parts: Value = null, X: Value = null, BP: Value = null;
	let $e: any;
	f.vars = () => [parts, X, BP, $e];
	parts = rt.list();
	X = null;
	rt.forList(f, 0, rt.sv(f, "bodyparts"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		BP = live(X);
		if (((truthy(live(brute)) && truthy(rt.fv(f, "brute_dam", live(BP)))) || (truthy(live(burn)) && truthy(rt.fv(f, "burn_dam", live(BP)))))) {
			parts = rt.modify(live(parts), live(BP), add);
		}
	}
	rt.endFor(f, 0);
	return live(parts);
});

// /mob/living/carbon/proc/get_damageable_bodyparts  (code/modules/mob/living/carbon/damage_procs.dm:99)
rt.def("/mob/living/carbon/proc/get_damageable_bodyparts", function get_damageable_bodyparts(f: Frame) {
	let parts: Value = null, X: Value = null, BP: Value = null;
	let $e: any;
	f.vars = () => [parts, X, BP, $e];
	parts = rt.list();
	X = null;
	rt.forList(f, 0, rt.sv(f, "bodyparts"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		if (rt.lt(add(rt.gv(f, "brute_dam", (BP = live(X))), rt.fv(f, "burn_dam", live(BP))), rt.fv(f, "max_damage", live(BP)))) {
			parts = rt.modify(live(parts), live(BP), add);
		}
	}
	rt.endFor(f, 0);
	return live(parts);
});

// /mob/living/carbon/proc/heal_bodypart_damage  (code/modules/mob/living/carbon/damage_procs.dm:110)  may sleep
rt.def("/mob/living/carbon/proc/heal_bodypart_damage", function* heal_bodypart_damage(f: Frame, brute: Value, burn: Value, only_robotic: Value, only_organic: Value) {
	let parts: Value = null, picked: Value = null;
	f.vars = () => [brute, burn, only_robotic, only_organic, parts, picked];
	if (live(only_robotic) === null) {
		only_robotic = 0;
	}
	if (live(only_organic) === null) {
		only_organic = 1;
	}
	if (!truthy(rt.getLen(f, (parts = (yield* g.srcCall(f, "get_damaged_bodyparts", live(brute), live(burn))))))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.callName(f, (picked = rt.op(f, "PickUnweighted", [1], [live(parts)])), "heal_damage", [live(brute), live(burn), live(only_robotic), live(only_organic)])))) return f.dot;
	yield* g.srcCall(f, "update_damage_overlays");
	return f.dot;
}, true);

// /mob/living/carbon/proc/take_bodypart_damage  (code/modules/mob/living/carbon/damage_procs.dm:121)  may sleep
rt.def("/mob/living/carbon/proc/take_bodypart_damage", function* take_bodypart_damage(f: Frame, brute: Value, burn: Value) {
	let parts: Value = null, picked: Value = null;
	f.vars = () => [brute, burn, parts, picked];
	if (!truthy(rt.getLen(f, (parts = (yield* g.srcCall(f, "get_damageable_bodyparts")))))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.callName(f, (picked = rt.op(f, "PickUnweighted", [1], [live(parts)])), "receive_damage", [live(brute), live(burn)])))) return f.dot;
	yield* g.srcCall(f, "update_damage_overlays");
	return f.dot;
}, true);

// /mob/living/carbon/proc/heal_overall_damage  (code/modules/mob/living/carbon/damage_procs.dm:131)  may sleep
rt.def("/mob/living/carbon/proc/heal_overall_damage", function* heal_overall_damage(f: Frame, brute: Value, burn: Value, only_robotic: Value, only_organic: Value, updating_health: Value) {
	let parts: Value = null, update: Value = null, picked: Value = null, brute_was: Value = null, burn_was: Value = null;
	f.vars = () => [brute, burn, only_robotic, only_organic, updating_health, parts, update, picked, brute_was, burn_was];
	if (live(only_robotic) === null) {
		only_robotic = 0;
	}
	if (live(only_organic) === null) {
		only_organic = 1;
	}
	if (live(updating_health) === null) {
		updating_health = 1;
	}
	parts = (yield* g.srcCall(f, "get_damaged_bodyparts", live(brute), live(burn)));
	update = 0;
	while (truthy(rt.len(f, live(parts))) && (rt.gt(live(brute), 0) || rt.gt(live(burn), 0))) {
		picked = rt.op(f, "PickUnweighted", [1], [live(parts)]);
		brute_was = rt.fv(f, "brute_dam", live(picked));
		burn_was = rt.fv(f, "burn_dam", live(picked));
		(update = rt.modify(live(update), (yield* g.callName(f, live(picked), "heal_damage", [live(brute), live(burn), live(only_robotic), live(only_organic), 0])), rt.bitOr));
		(brute = rt.modify(live(brute), subtract(live(brute_was), rt.fv(f, "brute_dam", live(picked))), subtract));
		(burn = rt.modify(live(burn), subtract(live(burn_was), rt.fv(f, "burn_dam", live(picked))), subtract));
		(parts = rt.modify(live(parts), live(picked), subtract));
	}
	if (truthy(live(updating_health))) {
		yield* g.srcCall(f, "updatehealth");
	}
	if (!truthy(live(update))) return f.dot;
	yield* g.srcCall(f, "update_damage_overlays");
	return f.dot;
}, true);

// /mob/living/carbon/proc/take_overall_damage  (code/modules/mob/living/carbon/damage_procs.dm:153)  may sleep
rt.def("/mob/living/carbon/proc/take_overall_damage", function* take_overall_damage(f: Frame, brute: Value, burn: Value, updating_health: Value) {
	let parts: Value = null, update: Value = null, picked: Value = null, brute_per_part: Value = null, burn_per_part: Value = null, brute_was: Value = null, burn_was: Value = null;
	f.vars = () => [brute, burn, updating_health, parts, update, picked, brute_per_part, burn_per_part, brute_was, burn_was];
	if (live(updating_health) === null) {
		updating_health = 1;
	}
	if (truthy(rt.bitAnd(rt.sv(f, "status_flags"), 4096))) {
		return live(f.dot);
	}
	parts = (yield* g.srcCall(f, "get_damageable_bodyparts"));
	update = 0;
	while (truthy(rt.len(f, live(parts))) && (rt.gt(live(brute), 0) || rt.gt(live(burn), 0))) {
		picked = rt.op(f, "PickUnweighted", [1], [live(parts)]);
		brute_per_part = (yield* g.call(f, P("/proc/round"), null, [divide(live(brute), rt.len(f, live(parts))), 0.009999999776482582]));
		burn_per_part = (yield* g.call(f, P("/proc/round"), null, [divide(live(burn), rt.len(f, live(parts))), 0.009999999776482582]));
		brute_was = rt.fv(f, "brute_dam", live(picked));
		burn_was = rt.fv(f, "burn_dam", live(picked));
		(update = rt.modify(live(update), (yield* g.callName(f, live(picked), "receive_damage", [live(brute_per_part), live(burn_per_part), 0])), rt.bitOr));
		(brute = rt.modify(live(brute), subtract(rt.fv(f, "brute_dam", live(picked)), live(brute_was)), subtract));
		(burn = rt.modify(live(burn), subtract(rt.fv(f, "burn_dam", live(picked)), live(burn_was)), subtract));
		(parts = rt.modify(live(parts), live(picked), subtract));
	}
	if (truthy(live(updating_health))) {
		yield* g.srcCall(f, "updatehealth");
	}
	if (!truthy(live(update))) return f.dot;
	yield* g.srcCall(f, "update_damage_overlays");
	return f.dot;
}, true);

// /mob/living/carbon/proc/adjustStaminaLoss  (code/modules/mob/living/carbon/damage_procs.dm:181)  may sleep
rt.def("/mob/living/carbon/proc/adjustStaminaLoss", function* adjustStaminaLoss(f: Frame, amount: Value, updating_stamina: Value) {
	f.vars = () => [amount, updating_stamina];
	if (live(updating_stamina) === null) {
		updating_stamina = 1;
	}
	if (truthy(rt.bitAnd(rt.sv(f, "status_flags"), 4096))) {
		return 0;
	}
	rt.setSv(f, "staminaloss", (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [add(rt.sv(f, "staminaloss"), live(amount)), multiply(rt.sv(f, "maxHealth"), 2)]))])));
	if (!truthy(live(updating_stamina))) return f.dot;
	yield* g.srcCall(f, "update_stamina");
	return f.dot;
}, true);

// /mob/living/carbon/proc/setStaminaLoss  (code/modules/mob/living/carbon/damage_procs.dm:189)  may sleep
rt.def("/mob/living/carbon/proc/setStaminaLoss", function* setStaminaLoss(f: Frame, amount: Value, updating_stamina: Value) {
	f.vars = () => [amount, updating_stamina];
	if (live(updating_stamina) === null) {
		updating_stamina = 1;
	}
	if (truthy(rt.bitAnd(rt.sv(f, "status_flags"), 4096))) {
		return 0;
	}
	rt.setSv(f, "staminaloss", live(amount));
	if (!truthy(live(updating_stamina))) return f.dot;
	yield* g.srcCall(f, "update_stamina");
	return f.dot;
}, true);
