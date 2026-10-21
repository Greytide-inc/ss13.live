// From code/modules/mob/living/silicon/silicon_defense.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/silicon/proc/attack_alien  (code/modules/mob/living/silicon/silicon_defense.dm:9)  may sleep
rt.def("/mob/living/silicon/proc/attack_alien", function* attack_alien(f: Frame) {
	let damage: Value = null;
	f.vars = () => [damage];
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	damage = 20;
	if (truthy(rt.op(f, "Prob", [], [90]))) {
		yield* g.call(f, P("/proc/add_logs"), null, [live(f.args[0]), live(f.src), "attacked"]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/slash.ogg"), 25, 1, -1]);
		yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ has slashed at ＀!</span>", [live(f.args[0]), live(f.src)]), fmt("<span class='userdanger'>＀ has slashed at ＀!</span>", [live(f.args[0]), live(f.src)]));
		if (truthy(rt.op(f, "Prob", [], [8]))) {
			yield* g.callSrc(f, "flash_act", ["affect_silicon", 1], rt.Args.Named);
		}
		yield* g.call(f, P("/proc/add_logs"), null, [live(f.args[0]), live(f.src), "attacked"]);
		yield* g.srcCall(f, "adjustBruteLoss", live(damage));
		yield* g.srcCall(f, "updatehealth");
	} else {
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/slashmiss.ogg"), 25, 1, -1]);
		yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ took a swipe at ＀!</span>", [live(f.args[0]), live(f.src)]), fmt("<span class='userdanger'>＀ took a swipe at ＀!</span>", [live(f.args[0]), live(f.src)]));
	}
	return f.dot;
}, true, { args: ["M"] });

// /mob/living/silicon/proc/attack_animal  (code/modules/mob/living/silicon/silicon_defense.dm:27)  may sleep
rt.def("/mob/living/silicon/proc/attack_animal", function* attack_animal(f: Frame) {
	let damage: Value = null, N: Value = null;
	let $0: any, $e: any;
	f.vars = () => [damage, N, $0, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	if (truthy(rt.op(f, "Prob", [], [(damage = (yield* g.call(f, P("/proc/rand"), null, [rt.fv(f, "melee_damage_lower", live(f.args[0])), rt.fv(f, "melee_damage_upper", live(f.args[0]))])))]))) {
		N = null;
		rt.forList(f, 0, rt.sv(f, "buckled_mobs"), T("/mob/living"));
		while (($e = rt.next(f, 0)) !== undefined) {
			N = $e;
			yield* g.callName(f, live(N), "Knockdown", [20]);
			yield* g.srcCall(f, "unbuckle_mob", live(N));
			yield* g.callName(f, live(N), "visible_message", [fmt("<span class='boldwarning'>＀ is knocked off of ＀ by ＀!</span>", [live(N), live(f.src), live(f.args[0])])]);
		}
		rt.endFor(f, 0);
	}
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

// /mob/living/silicon/proc/attack_paw  (code/modules/mob/living/silicon/silicon_defense.dm:50)  may sleep
rt.def("/mob/living/silicon/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.srcCall(f, "attack_hand", live(user)));
}, true);

// /mob/living/silicon/proc/attack_larva  (code/modules/mob/living/silicon/silicon_defense.dm:53)
rt.def("/mob/living/silicon/proc/attack_larva", function attack_larva(f: Frame, L: Value) {
	if (!isEqual(rt.fv(f, "a_intent", live(L)), "help")) return f.dot;
	rt.callSrc(f, "visible_message", [fmt("＀ rubs its head against ＀.", [rt.fv(f, "name", live(L)), live(f.src)])]);
	return f.dot;
});

// /mob/living/silicon/proc/attack_hulk  (code/modules/mob/living/silicon/silicon_defense.dm:57)  may sleep
rt.def("/mob/living/silicon/proc/attack_hulk", function* attack_hulk(f: Frame, user: Value, does_attack_animation: Value) {
	f.vars = () => [user, does_attack_animation];
	if (live(does_attack_animation) === null) {
		does_attack_animation = 0;
	}
	if (isEqual(rt.fv(f, "a_intent", live(user)), "harm")) {
		yield* g.callSuper(f, [live(user), 1]);
		yield* g.srcCall(f, "adjustBruteLoss", (yield* g.call(f, P("/proc/rand"), null, [10, 15])));
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), "punch", 25, 1, -1]);
		yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ has punched ＀!</span>", [live(user), live(f.src)]), fmt("<span class='userdanger'>＀ has punched ＀!</span>", [live(user), live(f.src)]));
		return 1;
	}
	return 0;
}, true);

// /mob/living/silicon/proc/attack_hand  (code/modules/mob/living/silicon/silicon_defense.dm:67)  may sleep
rt.def("/mob/living/silicon/proc/attack_hand", function* attack_hand(f: Frame, M: Value) {
	let $0: any;
	f.vars = () => [M, $0];
	$0 = rt.fv(f, "a_intent", live(M));
	if ($0 === "help") {
		yield* g.callName(f, live(M), "visible_message", [fmt("＀ pets ＀.", [live(M), live(f.src)]), fmt("<span class='notice'>You pet ＀.</span>", [live(f.src)])]);
	} else if ($0 === "grab") {
		yield* g.srcCall(f, "grabbedby", live(M));
	} else {
		yield* g.callName(f, live(M), "do_attack_animation", [live(f.src), "punch"]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/bang.ogg"), 10, 1]);
		yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ punches ＀, but doesn't leave a dent.</span>", [live(M), live(f.src)]), fmt("<span class='warning'>＀ punches ＀, but doesn't leave a dent.</span>", [live(M), live(f.src)]), null, 3);
	}
	return 0;
}, true);

// /mob/living/silicon/proc/electrocute_act  (code/modules/mob/living/silicon/silicon_defense.dm:82)  may sleep
rt.def("/mob/living/silicon/proc/electrocute_act", function* electrocute_act(f: Frame, shock_damage: Value, source: Value, siemens_coeff: Value, safety: Value, tesla_shock: Value, illusion: Value, stun: Value) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [shock_damage, source, siemens_coeff, safety, tesla_shock, illusion, stun, M, $e];
	if (live(siemens_coeff) === null) {
		siemens_coeff = 1;
	}
	if (live(safety) === null) {
		safety = 0;
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
	if (truthy(rt.sv(f, "buckled_mobs"))) {
		M = null;
		rt.forList(f, 0, rt.sv(f, "buckled_mobs"), T("/mob/living"));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			yield* g.srcCall(f, "unbuckle_mob", live(M));
			yield* g.callName(f, live(M), "electrocute_act", [divide(live(shock_damage), 100), live(source), live(siemens_coeff), live(safety), live(tesla_shock), live(illusion), live(stun)]);
		}
		rt.endFor(f, 0);
	}
	return 0;
}, true);

// /mob/living/silicon/proc/emp_act  (code/modules/mob/living/silicon/silicon_defense.dm:88)  may sleep
rt.def("/mob/living/silicon/proc/emp_act", function* emp_act(f: Frame) {
	let M: Value = null;
	let $0: any, $e: any;
	f.vars = () => [M, $0, $e];
	$0 = live(f.args[0]);
	if ($0 === 1) {
		yield* g.callName(f, live(f.src), "take_bodypart_damage", [20]);
	} else if ($0 === 2) {
		yield* g.callName(f, live(f.src), "take_bodypart_damage", [10]);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='userdanger'>*BZZZT*</span>"]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'>Warning: Electromagnetic pulse detected.</span>"]);
	M = null;
	rt.forList(f, 0, rt.sv(f, "buckled_mobs"), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (truthy(rt.op(f, "Prob", [], [multiply(live(f.args[0]), 50)]))) {
			yield* g.srcCall(f, "unbuckle_mob", live(M));
			yield* g.callName(f, live(M), "Knockdown", [40]);
			yield* g.callName(f, live(M), "visible_message", [fmt("<span class='boldwarning'>＀ is thrown off of ＀!</span>", [live(M), live(f.src)])]);
		}
	}
	rt.endFor(f, 0);
	yield* g.callSrc(f, "flash_act", ["affect_silicon", 1], rt.Args.Named);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["severity"] });

// /mob/living/silicon/proc/bullet_act  (code/modules/mob/living/silicon/silicon_defense.dm:104)  may sleep
rt.def("/mob/living/silicon/proc/bullet_act", function* bullet_act(f: Frame, Proj: Value) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [Proj, M, $e];
	if ((isEqual(rt.fv(f, "damage_type", live(Proj)), "brute") || isEqual(rt.fv(f, "damage_type", live(Proj)), "fire"))) {
		yield* g.srcCall(f, "adjustBruteLoss", rt.fv(f, "damage", live(Proj)));
		if (truthy(rt.op(f, "Prob", [], [multiply(rt.fv(f, "damage", live(Proj)), 1.5)]))) {
			M = null;
			rt.forList(f, 0, rt.sv(f, "buckled_mobs"), T("/mob/living"));
			while (($e = rt.next(f, 0)) !== undefined) {
				M = $e;
				yield* g.callName(f, live(M), "visible_message", [fmt("<span class='boldwarning'>＀ is knocked off of ＀!</span>", [live(M), live(f.src)])]);
				yield* g.srcCall(f, "unbuckle_mob", live(M));
				yield* g.callName(f, live(M), "Knockdown", [40]);
			}
			rt.endFor(f, 0);
		}
	}
	if ((truthy(rt.fv(f, "stun", live(Proj))) || truthy(rt.fv(f, "knockdown", live(Proj))))) {
		M = null;
		rt.forList(f, 0, rt.sv(f, "buckled_mobs"), T("/mob/living"));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			yield* g.srcCall(f, "unbuckle_mob", live(M));
			yield* g.callName(f, live(M), "visible_message", [fmt("<span class='boldwarning'>＀ is knocked off of ＀ by the ＀!</span>", [live(M), live(f.src), live(Proj)])]);
		}
		rt.endFor(f, 0);
	}
	yield* g.callName(f, live(Proj), "on_hit", [live(f.src)]);
	return 2;
}, true);

// /mob/living/silicon/proc/flash_act  (code/modules/mob/living/silicon/silicon_defense.dm:120)  may sleep
rt.def("/mob/living/silicon/proc/flash_act", function* flash_act(f: Frame) {
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
	if (live(f.args[4]) === null) {
		f.args[4] = T("/obj/screen/fullscreen/flash/static");
	}
	if (!truthy(live(f.args[2]))) return f.dot;
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["intensity", "override_blindness_check", "affect_silicon", "visual", "type"] });
