// From code/modules/mob/living/silicon/pai/pai_defense.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/silicon/pai/proc/emp_act  (code/modules/mob/living/silicon/pai/pai_defense.dm:6)  may sleep
rt.def("/mob/living/silicon/pai/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	f.vars = () => [severity];
	yield* g.srcCall(f, "take_holo_damage", divide(50, live(severity)));
	yield* g.srcCall(f, "Knockdown", divide(400, live(severity)));
	rt.setSv(f, "silent", (yield* g.call(f, P("/proc/max"), null, [divide(30, live(severity)), rt.sv(f, "silent")])));
	if (!truthy(rt.sv(f, "holoform"))) return f.dot;
	yield* g.callSrc(f, "fold_in", ["force", 1], rt.Args.Named);
	return f.dot;
}, true);

// /mob/living/silicon/pai/proc/ex_act  (code/modules/mob/living/silicon/pai/pai_defense.dm:14)  may sleep
rt.def("/mob/living/silicon/pai/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	let $0: any;
	f.vars = () => [severity, target, $0];
	yield* g.srcCall(f, "take_holo_damage", multiply(live(severity), 50));
	$0 = live(severity);
	if ($0 === 1) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "card")]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	} else if ($0 === 2) {
		yield* g.callSrc(f, "fold_in", ["force", 1], rt.Args.Named);
		yield* g.srcCall(f, "Knockdown", 400);
	} else if ($0 === 3) {
		yield* g.callSrc(f, "fold_in", ["force", 1], rt.Args.Named);
		yield* g.srcCall(f, "Knockdown", 200);
	}
	return f.dot;
}, true, { waitfor: false });

// /mob/living/silicon/pai/proc/attack_hand  (code/modules/mob/living/silicon/pai/pai_defense.dm:27)  may sleep
rt.def("/mob/living/silicon/pai/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let $0: any;
	f.vars = () => [user, $0];
	$0 = rt.fv(f, "a_intent", live(user));
	if ($0 === "help") {
		yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>＀ gently pats ＀ on the head, eliciting an off-putting buzzing from its holographic field.</span>", [live(user), live(f.src)]));
	} else if ($0 === "disarm") {
		yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>＀ boops ＀ on the head!</span>", [live(user), live(f.src)]));
	} else if ($0 === "harm") {
		yield* g.callName(f, live(user), "do_attack_animation", [live(f.src)]);
		if (isEqual(rt.fv(f, "name", live(user)), rt.sv(f, "master"))) {
			yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>Responding to its master's touch, ＀ disengages its holochassis emitter, rapidly losing coherence.</span>", [live(f.src)]));
			rt.spawnTail(f, 10, "/mob/living/silicon/pai/proc/attack_hand: spawn at modules/mob/living/silicon/pai/pai_defense.dm:36", user);
		} else {
			yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ stomps on ＀!.</span>", [live(user), live(f.src)]));
			yield* g.srcCall(f, "take_holo_damage", 2);
		}
	}
	return f.dot;
}, true);

// a spawn(10) body of /mob/living/silicon/pai/proc/attack_hand, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/silicon/pai/proc/attack_hand: spawn at modules/mob/living/silicon/pai/pai_defense.dm:36", function* (f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "fold_in");
	if (truthy((yield* g.callName(f, live(user), "put_in_hands", [rt.sv(f, "card")])))) {
		yield* g.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀ promptly scoops up their pAI's card.</span>", [live(user)])]);
	}
	return null;
});

// /mob/living/silicon/pai/proc/bullet_act  (code/modules/mob/living/silicon/pai/pai_defense.dm:45)  may sleep
rt.def("/mob/living/silicon/pai/proc/bullet_act", function* bullet_act(f: Frame, Proj: Value) {
	f.vars = () => [Proj];
	if (truthy(rt.fv(f, "stun", live(Proj)))) {
		yield* g.callSrc(f, "fold_in", ["force", 1], rt.Args.Named);
		yield* g.callName(f, live(f.src), "visible_message", [fmt("<span class='warning'>The electrically-charged projectile disrupts ＀'s holomatrix, forcing ＀ to fold in!</span>", [live(f.src), live(f.src)])]);
	}
	f.dot = (yield* g.callSuper(f, [live(Proj)]));
	return f.dot;
}, true);

// /mob/living/silicon/pai/proc/stripPanelUnequip  (code/modules/mob/living/silicon/pai/pai_defense.dm:51)
rt.def("/mob/living/silicon/pai/proc/stripPanelUnequip", function stripPanelUnequip(f: Frame, what: Value, who: Value, where: Value) {
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>Your holochassis stutters and warps intensely as you attempt to interact with the object, forcing you to cease lest the field fail.</span>"]);
	return f.dot;
});

// /mob/living/silicon/pai/proc/stripPanelEquip  (code/modules/mob/living/silicon/pai/pai_defense.dm:54)
rt.def("/mob/living/silicon/pai/proc/stripPanelEquip", function stripPanelEquip(f: Frame, what: Value, who: Value, where: Value) {
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>Your holochassis stutters and warps intensely as you attempt to interact with the object, forcing you to cease lest the field fail.</span>"]);
	return f.dot;
});

// /mob/living/silicon/pai/proc/take_holo_damage  (code/modules/mob/living/silicon/pai/pai_defense.dm:60)  may sleep
rt.def("/mob/living/silicon/pai/proc/take_holo_damage", function* take_holo_damage(f: Frame, amount: Value) {
	f.vars = () => [amount];
	rt.setSv(f, "emitterhealth", (yield* g.call(f, P("/proc/max"), null, [-50, (yield* g.call(f, P("/proc/min"), null, [subtract(rt.sv(f, "emitterhealth"), live(amount)), rt.sv(f, "emittermaxhealth")]))])));
	if (rt.lt(rt.sv(f, "emitterhealth"), 0)) {
		yield* g.callSrc(f, "fold_in", ["force", 1], rt.Args.Named);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='userdanger'>The impact degrades your holochassis!</span>"]);
	rt.modSrcVar(f, "hit_slowdown", live(amount), add);
	return live(amount);
}, true);

// /mob/living/silicon/pai/proc/adjustBruteLoss  (code/modules/mob/living/silicon/pai/pai_defense.dm:68)  may sleep
rt.def("/mob/living/silicon/pai/proc/adjustBruteLoss", function* adjustBruteLoss(f: Frame, amount: Value, updating_health: Value, forced: Value) {
	f.vars = () => [amount, updating_health, forced];
	if (live(updating_health) === null) {
		updating_health = 1;
	}
	if (live(forced) === null) {
		forced = 0;
	}
	return (yield* g.srcCall(f, "take_holo_damage", live(amount)));
}, true);

// /mob/living/silicon/pai/proc/adjustFireLoss  (code/modules/mob/living/silicon/pai/pai_defense.dm:71)  may sleep
rt.def("/mob/living/silicon/pai/proc/adjustFireLoss", function* adjustFireLoss(f: Frame, amount: Value, updating_health: Value, forced: Value) {
	f.vars = () => [amount, updating_health, forced];
	if (live(updating_health) === null) {
		updating_health = 1;
	}
	if (live(forced) === null) {
		forced = 0;
	}
	return (yield* g.srcCall(f, "take_holo_damage", live(amount)));
}, true);

// /mob/living/silicon/pai/proc/adjustStaminaLoss  (code/modules/mob/living/silicon/pai/pai_defense.dm:83)  may sleep
rt.def("/mob/living/silicon/pai/proc/adjustStaminaLoss", function* adjustStaminaLoss(f: Frame, amount: Value) {
	f.vars = () => [amount];
	yield* g.srcCall(f, "take_holo_damage", rt.bitAnd(live(amount), 0.25));
	return f.dot;
}, true);

// /mob/living/silicon/pai/proc/adjustBrainLoss  (code/modules/mob/living/silicon/pai/pai_defense.dm:86)  may sleep
rt.def("/mob/living/silicon/pai/proc/adjustBrainLoss", function* adjustBrainLoss(f: Frame, amount: Value) {
	f.vars = () => [amount];
	yield* g.srcCall(f, "Knockdown", multiply(live(amount), 0.20000000298023224));
	return f.dot;
}, true);

// /mob/living/silicon/pai/proc/getBruteLoss  (code/modules/mob/living/silicon/pai/pai_defense.dm:89)
rt.def("/mob/living/silicon/pai/proc/getBruteLoss", function getBruteLoss(f: Frame) {
	return subtract(rt.sv(f, "emittermaxhealth"), rt.sv(f, "emitterhealth"));
});

// /mob/living/silicon/pai/proc/getFireLoss  (code/modules/mob/living/silicon/pai/pai_defense.dm:92)
rt.def("/mob/living/silicon/pai/proc/getFireLoss", function getFireLoss(f: Frame) {
	return subtract(rt.sv(f, "emittermaxhealth"), rt.sv(f, "emitterhealth"));
});
