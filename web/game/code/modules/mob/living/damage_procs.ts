// From code/modules/mob/living/damage_procs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/proc/apply_damage  (code/modules/mob/living/damage_procs.dm:12)  may sleep
rt.def("/mob/living/proc/apply_damage", function* apply_damage(f: Frame, damage: Value, damagetype: Value, def_zone: Value, blocked: Value) {
	let hit_percent: Value = null;
	let $0: any;
	f.vars = () => [damage, damagetype, def_zone, blocked, hit_percent, $0];
	if (live(damage) === null) {
		damage = 0;
	}
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
	$0 = live(damagetype);
	if ($0 === "brute") {
		yield* g.srcCall(f, "adjustBruteLoss", multiply(live(damage), live(hit_percent)));
	} else if ($0 === "fire") {
		yield* g.srcCall(f, "adjustFireLoss", multiply(live(damage), live(hit_percent)));
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

// /mob/living/proc/apply_damage_type  (code/modules/mob/living/damage_procs.dm:31)  may sleep
rt.def("/mob/living/proc/apply_damage_type", function* apply_damage_type(f: Frame, damage: Value, damagetype: Value) {
	let $0: any;
	f.vars = () => [damage, damagetype, $0];
	if (live(damage) === null) {
		damage = 0;
	}
	if (live(damagetype) === null) {
		damagetype = "brute";
	}
	$0 = live(damagetype);
	if ($0 === "brute") {
		return (yield* g.srcCall(f, "adjustBruteLoss", live(damage)));
	} else if ($0 === "fire") {
		return (yield* g.srcCall(f, "adjustFireLoss", live(damage)));
	} else if ($0 === "tox") {
		return (yield* g.srcCall(f, "adjustToxLoss", live(damage)));
	} else if ($0 === "oxy") {
		return (yield* g.srcCall(f, "adjustOxyLoss", live(damage)));
	} else if ($0 === "clone") {
		return (yield* g.srcCall(f, "adjustCloneLoss", live(damage)));
	} else if ($0 === "stamina") {
		return (yield* g.srcCall(f, "adjustStaminaLoss", live(damage)));
	}
	return f.dot;
}, true);

// /mob/living/proc/get_damage_amount  (code/modules/mob/living/damage_procs.dm:46)
rt.def("/mob/living/proc/get_damage_amount", function get_damage_amount(f: Frame, damagetype: Value) {
	let $0: any;
	f.vars = () => [damagetype, $0];
	if (live(damagetype) === null) {
		damagetype = "brute";
	}
	$0 = live(damagetype);
	if ($0 === "brute") {
		return rt.callSrc(f, "getBruteLoss", []);
	} else if ($0 === "fire") {
		return rt.callSrc(f, "getFireLoss", []);
	} else if ($0 === "tox") {
		return rt.callSrc(f, "getToxLoss", []);
	} else if ($0 === "oxy") {
		return rt.callSrc(f, "getOxyLoss", []);
	} else if ($0 === "clone") {
		return rt.callSrc(f, "getCloneLoss", []);
	} else if ($0 === "stamina") {
		return rt.callSrc(f, "getStaminaLoss", []);
	}
	return f.dot;
});

// /mob/living/proc/apply_effect  (code/modules/mob/living/damage_procs.dm:81)  may sleep
rt.def("/mob/living/proc/apply_effect", function* apply_effect(f: Frame, effect: Value, effecttype: Value, blocked: Value) {
	let hit_percent: Value = null;
	let $0: any;
	f.vars = () => [effect, effecttype, blocked, hit_percent, $0];
	if (live(effect) === null) {
		effect = 0;
	}
	if (live(effecttype) === null) {
		effecttype = "stun";
	}
	if (live(blocked) === null) {
		blocked = 0;
	}
	hit_percent = divide(subtract(100, live(blocked)), 100);
	if ((!truthy(live(effect)) || rt.le(live(hit_percent), 0))) {
		return 0;
	}
	$0 = live(effecttype);
	if ($0 === "stun") {
		yield* g.srcCall(f, "Stun", multiply(live(effect), live(hit_percent)));
	} else if ($0 === "knockdown") {
		yield* g.srcCall(f, "Knockdown", multiply(live(effect), live(hit_percent)));
	} else if ($0 === 1) {
		yield* g.srcCall(f, "Unconscious", multiply(live(effect), live(hit_percent)));
	} else if ($0 === "irradiate") {
		rt.modSrcVar(f, "radiation", (yield* g.call(f, P("/proc/max"), null, [multiply(live(effect), live(hit_percent)), 0])), add);
	} else if ($0 === "slur") {
		rt.setSv(f, "slurring", (yield* g.call(f, P("/proc/max"), null, [rt.sv(f, "slurring"), multiply(live(effect), live(hit_percent))])));
	} else if ($0 === "stutter") {
		if (truthy(rt.bitAnd(rt.sv(f, "status_flags"), 1))) {
			rt.setSv(f, "stuttering", (yield* g.call(f, P("/proc/max"), null, [rt.sv(f, "stuttering"), multiply(live(effect), live(hit_percent))])));
		}
	} else if ($0 === "eye_blur") {
		yield* g.srcCall(f, "blur_eyes", multiply(live(effect), live(hit_percent)));
	} else if ($0 === "drowsy") {
		rt.setSv(f, "drowsyness", (yield* g.call(f, P("/proc/max"), null, [rt.sv(f, "drowsyness"), multiply(live(effect), live(hit_percent))])));
	} else if ($0 === "jitter") {
		if (truthy(rt.bitAnd(rt.sv(f, "status_flags"), 1))) {
			rt.setSv(f, "jitteriness", (yield* g.call(f, P("/proc/max"), null, [rt.sv(f, "jitteriness"), multiply(live(effect), live(hit_percent))])));
		}
	}
	return 1;
}, true);

// /mob/living/proc/apply_effects  (code/modules/mob/living/damage_procs.dm:109)  may sleep
rt.def("/mob/living/proc/apply_effects", function* apply_effects(f: Frame, stun: Value, knockdown: Value, unconscious: Value, irradiate: Value, slur: Value, stutter: Value, eyeblur: Value, drowsy: Value, blocked: Value, stamina: Value, jitter: Value) {
	f.vars = () => [stun, knockdown, unconscious, irradiate, slur, stutter, eyeblur, drowsy, blocked, stamina, jitter];
	if (live(stun) === null) {
		stun = 0;
	}
	if (live(knockdown) === null) {
		knockdown = 0;
	}
	if (live(unconscious) === null) {
		unconscious = 0;
	}
	if (live(irradiate) === null) {
		irradiate = 0;
	}
	if (live(slur) === null) {
		slur = 0;
	}
	if (live(stutter) === null) {
		stutter = 0;
	}
	if (live(eyeblur) === null) {
		eyeblur = 0;
	}
	if (live(drowsy) === null) {
		drowsy = 0;
	}
	if (live(blocked) === null) {
		blocked = 0;
	}
	if (live(stamina) === null) {
		stamina = 0;
	}
	if (live(jitter) === null) {
		jitter = 0;
	}
	if (rt.ge(live(blocked), 100)) {
		return 0;
	}
	if (truthy(live(stun))) {
		yield* g.srcCall(f, "apply_effect", live(stun), "stun", live(blocked));
	}
	if (truthy(live(knockdown))) {
		yield* g.srcCall(f, "apply_effect", live(knockdown), "knockdown", live(blocked));
	}
	if (truthy(live(unconscious))) {
		yield* g.srcCall(f, "apply_effect", live(unconscious), 1, live(blocked));
	}
	if (truthy(live(irradiate))) {
		yield* g.srcCall(f, "apply_effect", live(irradiate), "irradiate", live(blocked));
	}
	if (truthy(live(slur))) {
		yield* g.srcCall(f, "apply_effect", live(slur), "slur", live(blocked));
	}
	if (truthy(live(stutter))) {
		yield* g.srcCall(f, "apply_effect", live(stutter), "stutter", live(blocked));
	}
	if (truthy(live(eyeblur))) {
		yield* g.srcCall(f, "apply_effect", live(eyeblur), "eye_blur", live(blocked));
	}
	if (truthy(live(drowsy))) {
		yield* g.srcCall(f, "apply_effect", live(drowsy), "drowsy", live(blocked));
	}
	if (truthy(live(stamina))) {
		yield* g.srcCall(f, "apply_damage", live(stamina), "stamina", null, live(blocked));
	}
	if (truthy(live(jitter))) {
		yield* g.srcCall(f, "apply_effect", live(jitter), "jitter", live(blocked));
	}
	return 1;
}, true);

// /mob/living/proc/adjustBruteLoss  (code/modules/mob/living/damage_procs.dm:138)  may sleep
rt.def("/mob/living/proc/adjustBruteLoss", function* adjustBruteLoss(f: Frame, amount: Value, updating_health: Value, forced: Value) {
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
	rt.setSv(f, "bruteloss", (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [add(rt.sv(f, "bruteloss"), multiply(live(amount), rt.fv(f, "damage_multiplier", rt.gl("config")))), multiply(rt.sv(f, "maxHealth"), 2)]))])));
	if (truthy(live(updating_health))) {
		yield* g.srcCall(f, "updatehealth");
	}
	return live(amount);
}, true);

// /mob/living/proc/adjustOxyLoss  (code/modules/mob/living/damage_procs.dm:149)  may sleep
rt.def("/mob/living/proc/adjustOxyLoss", function* adjustOxyLoss(f: Frame, amount: Value, updating_health: Value, forced: Value) {
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
	rt.setSv(f, "oxyloss", (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [add(rt.sv(f, "oxyloss"), multiply(live(amount), rt.fv(f, "damage_multiplier", rt.gl("config")))), multiply(rt.sv(f, "maxHealth"), 2)]))])));
	if (truthy(live(updating_health))) {
		yield* g.srcCall(f, "updatehealth");
	}
	return live(amount);
}, true);

// /mob/living/proc/setOxyLoss  (code/modules/mob/living/damage_procs.dm:157)  may sleep
rt.def("/mob/living/proc/setOxyLoss", function* setOxyLoss(f: Frame, amount: Value, updating_health: Value, forced: Value) {
	f.vars = () => [amount, updating_health, forced];
	if (live(updating_health) === null) {
		updating_health = 1;
	}
	if (live(forced) === null) {
		forced = 0;
	}
	if (truthy(rt.bitAnd(rt.sv(f, "status_flags"), 4096))) {
		return 0;
	}
	rt.setSv(f, "oxyloss", live(amount));
	if (truthy(live(updating_health))) {
		yield* g.srcCall(f, "updatehealth");
	}
	return live(amount);
}, true);

// /mob/living/proc/adjustToxLoss  (code/modules/mob/living/damage_procs.dm:168)  may sleep
rt.def("/mob/living/proc/adjustToxLoss", function* adjustToxLoss(f: Frame, amount: Value, updating_health: Value, forced: Value) {
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
	rt.setSv(f, "toxloss", (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [add(rt.sv(f, "toxloss"), multiply(live(amount), rt.fv(f, "damage_multiplier", rt.gl("config")))), multiply(rt.sv(f, "maxHealth"), 2)]))])));
	if (truthy(live(updating_health))) {
		yield* g.srcCall(f, "updatehealth");
	}
	return live(amount);
}, true);

// /mob/living/proc/setToxLoss  (code/modules/mob/living/damage_procs.dm:176)  may sleep
rt.def("/mob/living/proc/setToxLoss", function* setToxLoss(f: Frame, amount: Value, updating_health: Value, forced: Value) {
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
	rt.setSv(f, "toxloss", live(amount));
	if (truthy(live(updating_health))) {
		yield* g.srcCall(f, "updatehealth");
	}
	return live(amount);
}, true);

// /mob/living/proc/adjustFireLoss  (code/modules/mob/living/damage_procs.dm:187)  may sleep
rt.def("/mob/living/proc/adjustFireLoss", function* adjustFireLoss(f: Frame, amount: Value, updating_health: Value, forced: Value) {
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
	rt.setSv(f, "fireloss", (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [add(rt.sv(f, "fireloss"), multiply(live(amount), rt.fv(f, "damage_multiplier", rt.gl("config")))), multiply(rt.sv(f, "maxHealth"), 2)]))])));
	if (truthy(live(updating_health))) {
		yield* g.srcCall(f, "updatehealth");
	}
	return live(amount);
}, true);

// /mob/living/proc/adjustCloneLoss  (code/modules/mob/living/damage_procs.dm:198)  may sleep
rt.def("/mob/living/proc/adjustCloneLoss", function* adjustCloneLoss(f: Frame, amount: Value, updating_health: Value, forced: Value) {
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
	rt.setSv(f, "cloneloss", (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [add(rt.sv(f, "cloneloss"), multiply(live(amount), rt.fv(f, "damage_multiplier", rt.gl("config")))), multiply(rt.sv(f, "maxHealth"), 2)]))])));
	if (truthy(live(updating_health))) {
		yield* g.srcCall(f, "updatehealth");
	}
	return live(amount);
}, true);

// /mob/living/proc/setCloneLoss  (code/modules/mob/living/damage_procs.dm:206)  may sleep
rt.def("/mob/living/proc/setCloneLoss", function* setCloneLoss(f: Frame, amount: Value, updating_health: Value, forced: Value) {
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
	rt.setSv(f, "cloneloss", live(amount));
	if (truthy(live(updating_health))) {
		yield* g.srcCall(f, "updatehealth");
	}
	return live(amount);
}, true);

// /mob/living/proc/adjustBrainLoss  (code/modules/mob/living/damage_procs.dm:217)
rt.def("/mob/living/proc/adjustBrainLoss", function adjustBrainLoss(f: Frame, amount: Value) {
	if (truthy(rt.bitAnd(rt.sv(f, "status_flags"), 4096))) {
		return 0;
	}
	rt.setSv(f, "brainloss", rt.call(f, P("/proc/max"), null, [0, rt.call(f, P("/proc/min"), null, [add(rt.sv(f, "brainloss"), multiply(live(amount), rt.fv(f, "damage_multiplier", rt.gl("config")))), multiply(rt.sv(f, "maxHealth"), 2)])]));
	return f.dot;
});

// /mob/living/proc/setBrainLoss  (code/modules/mob/living/damage_procs.dm:222)
rt.def("/mob/living/proc/setBrainLoss", function setBrainLoss(f: Frame, amount: Value) {
	if (truthy(rt.bitAnd(rt.sv(f, "status_flags"), 4096))) {
		return 0;
	}
	rt.setSv(f, "brainloss", live(amount));
	return f.dot;
});

// /mob/living/proc/heal_bodypart_damage  (code/modules/mob/living/damage_procs.dm:238)  may sleep
rt.def("/mob/living/proc/heal_bodypart_damage", function* heal_bodypart_damage(f: Frame, brute: Value, burn: Value, updating_health: Value) {
	f.vars = () => [brute, burn, updating_health];
	if (live(updating_health) === null) {
		updating_health = 1;
	}
	yield* g.srcCall(f, "adjustBruteLoss", rt.neg(live(brute)), 0);
	yield* g.srcCall(f, "adjustFireLoss", rt.neg(live(burn)), 0);
	if (!truthy(live(updating_health))) return f.dot;
	yield* g.srcCall(f, "updatehealth");
	return f.dot;
}, true);

// /mob/living/proc/take_bodypart_damage  (code/modules/mob/living/damage_procs.dm:245)  may sleep
rt.def("/mob/living/proc/take_bodypart_damage", function* take_bodypart_damage(f: Frame, brute: Value, burn: Value, updating_health: Value) {
	f.vars = () => [brute, burn, updating_health];
	if (live(updating_health) === null) {
		updating_health = 1;
	}
	yield* g.srcCall(f, "adjustBruteLoss", live(brute), 0);
	yield* g.srcCall(f, "adjustFireLoss", live(burn), 0);
	if (!truthy(live(updating_health))) return f.dot;
	yield* g.srcCall(f, "updatehealth");
	return f.dot;
}, true);

// /mob/living/proc/heal_overall_damage  (code/modules/mob/living/damage_procs.dm:252)  may sleep
rt.def("/mob/living/proc/heal_overall_damage", function* heal_overall_damage(f: Frame, brute: Value, burn: Value, only_robotic: Value, only_organic: Value, updating_health: Value) {
	f.vars = () => [brute, burn, only_robotic, only_organic, updating_health];
	if (live(only_robotic) === null) {
		only_robotic = 0;
	}
	if (live(only_organic) === null) {
		only_organic = 1;
	}
	if (live(updating_health) === null) {
		updating_health = 1;
	}
	yield* g.srcCall(f, "adjustBruteLoss", rt.neg(live(brute)), 0);
	yield* g.srcCall(f, "adjustFireLoss", rt.neg(live(burn)), 0);
	if (!truthy(live(updating_health))) return f.dot;
	yield* g.srcCall(f, "updatehealth");
	return f.dot;
}, true);

// /mob/living/proc/take_overall_damage  (code/modules/mob/living/damage_procs.dm:259)  may sleep
rt.def("/mob/living/proc/take_overall_damage", function* take_overall_damage(f: Frame, brute: Value, burn: Value, updating_health: Value) {
	f.vars = () => [brute, burn, updating_health];
	if (live(updating_health) === null) {
		updating_health = 1;
	}
	yield* g.srcCall(f, "adjustBruteLoss", live(brute), 0);
	yield* g.srcCall(f, "adjustFireLoss", live(burn), 0);
	if (!truthy(live(updating_health))) return f.dot;
	yield* g.srcCall(f, "updatehealth");
	return f.dot;
}, true);

// /mob/living/proc/heal_ordered_damage  (code/modules/mob/living/damage_procs.dm:266)  may sleep
rt.def("/mob/living/proc/heal_ordered_damage", function* heal_ordered_damage(f: Frame, amount: Value, damage_types: Value) {
	let i: Value = null, amount_to_heal: Value = null;
	let $e: any;
	f.vars = () => [amount, damage_types, i, amount_to_heal, $e];
	f.dot = live(amount);
	i = null;
	rt.forList(f, 0, live(damage_types));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (truthy((amount_to_heal = (yield* g.call(f, P("/proc/min"), null, [live(amount), (yield* g.srcCall(f, "get_damage_amount", live(i)))]))))) {
			yield* g.srcCall(f, "apply_damage_type", rt.neg(live(amount_to_heal)), live(i));
			(amount = rt.modify(live(amount), live(amount_to_heal), subtract));
		}
		if (!truthy(live(amount))) {
			break;
		}
	}
	rt.endFor(f, 0);
	(f.dot = rt.modify(live(f.dot), live(amount), subtract));
	return f.dot;
}, true);
