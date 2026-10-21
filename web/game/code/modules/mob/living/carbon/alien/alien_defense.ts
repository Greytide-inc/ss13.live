// From code/modules/mob/living/carbon/alien/alien_defense.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/carbon/alien/proc/get_eye_protection  (code/modules/mob/living/carbon/alien/alien_defense.dm:3)
rt.def("/mob/living/carbon/alien/proc/get_eye_protection", function get_eye_protection(f: Frame) {
	return add(rt.callSuper(f, [], rt.Args.Same), 2);
});

// /mob/living/carbon/alien/proc/hitby  (code/modules/mob/living/carbon/alien/alien_defense.dm:9)  may sleep
rt.def("/mob/living/carbon/alien/proc/hitby", function* hitby(f: Frame, AM: Value, skipcatch: Value, hitpush: Value) {
	f.vars = () => [AM, skipcatch, hitpush];
	yield* g.callSuper(f, [null, live(AM), "skipcatch", 1, "hitpush", 0], rt.Args.Named);
	return f.dot;
}, true);

// /mob/living/carbon/alien/proc/attack_alien  (code/modules/mob/living/carbon/alien/alien_defense.dm:17)  may sleep
rt.def("/mob/living/carbon/alien/proc/attack_alien", function* attack_alien(f: Frame, M: Value) {
	let $0: any;
	f.vars = () => [M, $0];
	if ((truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")]))) && truthy((rt.istype(rt.fv(f, "loc", rt.sv(f, "loc")), T("/area/start")) ? 1 : 0)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(M), "No attacking people at spawn, you jackass."]);
		return live(f.dot);
	}
	$0 = rt.fv(f, "a_intent", live(M));
	if ($0 === "help") {
		rt.setSv(f, "resting", 0);
		yield* g.srcCall(f, "AdjustStun", -60);
		yield* g.srcCall(f, "AdjustKnockdown", -60);
		yield* g.srcCall(f, "AdjustUnconscious", -60);
		yield* g.srcCall(f, "AdjustSleeping", -100);
		yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>＀ nuzzles ＀ trying to wake ＀ up!</span>", [rt.fv(f, "name", live(M)), live(f.src), (yield* g.srcCall(f, "p_them"))]));
	} else if ($0 === "grab") {
		yield* g.srcCall(f, "grabbedby", live(M));
	} else {
		if (rt.gt(rt.sv(f, "health"), 0)) {
			yield* g.callName(f, live(M), "do_attack_animation", [live(f.src), "bite"]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/bite.ogg"), 50, 1, -1]);
			yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ bites ＀!</span>", [rt.fv(f, "name", live(M)), live(f.src)]), fmt("<span class='userdanger'>＀ bites ＀!</span>", [rt.fv(f, "name", live(M)), live(f.src)]), null, 3);
			yield* g.srcCall(f, "adjustBruteLoss", 1);
			yield* g.call(f, P("/proc/add_logs"), null, [live(M), live(f.src), "attacked"]);
			yield* g.srcCall(f, "updatehealth");
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='warning'>＀ is too injured for that.</span>", [rt.sv(f, "name")])]);
		}
	}
	return f.dot;
}, true);

// /mob/living/carbon/alien/proc/attack_larva  (code/modules/mob/living/carbon/alien/alien_defense.dm:48)  may sleep
rt.def("/mob/living/carbon/alien/proc/attack_larva", function* attack_larva(f: Frame, L: Value) {
	f.vars = () => [L];
	return (yield* g.srcCall(f, "attack_alien", live(L)));
}, true);

// /mob/living/carbon/alien/proc/attack_hand  (code/modules/mob/living/carbon/alien/alien_defense.dm:52)  may sleep
rt.def("/mob/living/carbon/alien/proc/attack_hand", function* attack_hand(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 0;
	}
	$0 = rt.fv(f, "a_intent", live(f.args[0]));
	if ($0 === "help") {
		yield* g.srcCall(f, "help_shake_act", live(f.args[0]));
	} else if ($0 === "grab") {
		yield* g.srcCall(f, "grabbedby", live(f.args[0]));
	} else if ($0 === "harm") {
		yield* g.callName(f, live(f.args[0]), "do_attack_animation", [live(f.src), "punch"]);
		return 1;
	} else if ($0 === "disarm") {
		yield* g.callName(f, live(f.args[0]), "do_attack_animation", [live(f.src), "disarm"]);
		return 1;
	}
	return 0;
}, true, { args: ["M"] });

// /mob/living/carbon/alien/proc/attack_paw  (code/modules/mob/living/carbon/alien/alien_defense.dm:70)  may sleep
rt.def("/mob/living/carbon/alien/proc/attack_paw", function* attack_paw(f: Frame) {
	let affecting: Value = null;
	f.vars = () => [affecting];
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	if (isEqual(rt.sv(f, "stat"), 2)) return f.dot;
	affecting = (yield* g.srcCall(f, "get_bodypart", (yield* g.call(f, P("/proc/ran_zone"), null, [rt.fv(f, "zone_selected", live(f.args[0]))]))));
	yield* g.srcCall(f, "apply_damage", (yield* g.call(f, P("/proc/rand"), null, [1, 3])), "brute", live(affecting));
	return f.dot;
}, true, { args: ["M"] });

// /mob/living/carbon/alien/proc/attack_animal  (code/modules/mob/living/carbon/alien/alien_defense.dm:77)  may sleep
rt.def("/mob/living/carbon/alien/proc/attack_animal", function* attack_animal(f: Frame) {
	let damage: Value = null;
	let $0: any;
	f.vars = () => [damage, $0];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	damage = (yield* g.call(f, P("/proc/rand"), null, [rt.fv(f, "melee_damage_lower", live(f.args[0])), rt.fv(f, "melee_damage_upper", live(f.args[0]))]));
	$0 = rt.fv(f, "melee_damage_type", live(f.args[0]));
	if ($0 === "brute") {
		yield* g.srcCall(f, "adjustBruteLoss", live(damage));
	} else if ($0 === "fire") {
		yield* g.srcCall(f, "adjustFireLoss", live(damage));
	} else if ($0 === "tox") {
		yield* g.srcCall(f, "adjustToxLoss", live(damage));
	} else if ($0 === "oxy") {
		yield* g.srcCall(f, "adjustOxyLoss", live(damage));
	} else if ($0 === "clone") {
		yield* g.srcCall(f, "adjustCloneLoss", live(damage));
	} else if ($0 === "stamina") {
		yield* g.srcCall(f, "adjustStaminaLoss", live(damage));
	}
	return f.dot;
}, true, { args: ["M"] });

// /mob/living/carbon/alien/proc/attack_slime  (code/modules/mob/living/carbon/alien/alien_defense.dm:95)  may sleep
rt.def("/mob/living/carbon/alien/proc/attack_slime", function* attack_slime(f: Frame) {
	let damage: Value = null;
	f.vars = () => [damage];
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	damage = (yield* g.call(f, P("/proc/rand"), null, [5, 35]));
	if (truthy(rt.fv(f, "is_adult", live(f.args[0])))) {
		damage = (yield* g.call(f, P("/proc/rand"), null, [10, 40]));
	}
	yield* g.srcCall(f, "adjustBruteLoss", live(damage));
	yield* g.call(f, P("/proc/add_logs"), null, [live(f.args[0]), live(f.src), "attacked"]);
	yield* g.srcCall(f, "updatehealth");
	return f.dot;
}, true, { args: ["M"] });

// /mob/living/carbon/alien/proc/ex_act  (code/modules/mob/living/carbon/alien/alien_defense.dm:104)  may sleep
rt.def("/mob/living/carbon/alien/proc/ex_act", function* ex_act(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (((truthy(live(f.args[2])) && truthy((rt.istype(live(f.args[2]), T("/datum/spacevine_mutation")) ? 1 : 0))) && truthy((yield* g.call(f, P("/proc/isvineimmune"), null, [live(f.src)]))))) {
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	$0 = live(f.args[0]);
	if ($0 === 1) {
		yield* g.srcCall(f, "gib");
		return live(f.dot);
	} else if ($0 === 2) {
		yield* g.srcCall(f, "take_overall_damage", 60, 60);
		yield* g.srcCall(f, "adjustEarDamage", 30, 120);
	} else if ($0 === 3) {
		yield* g.srcCall(f, "take_overall_damage", 30, 0);
		if (truthy(rt.op(f, "Prob", [], [50]))) {
			yield* g.srcCall(f, "Unconscious", 20);
		}
		yield* g.srcCall(f, "adjustEarDamage", 15, 60);
	}
	return f.dot;
}, true, { args: ["severity", "target", "origin"], waitfor: false });
