// From code/modules/mob/living/simple_animal/guardian/types/charger.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4874, "/mob/living/simple_animal/hostile/guardian/charger", "/mob/living/simple_animal/hostile/guardian", {
	charging: 0,
	chargealert: null,
	playstyle_string: "<span class='holoparasite'>As a <b>charger</b> type you do medium damage, have medium damage resistance, move very fast, and can charge at a location, damaging any target hit and forcing them to drop any items they are holding.</span>",
	magic_fluff_string: "<span class='holoparasite'>..And draw the Hunter, an alien master of rapid assault.</span>",
	tech_fluff_string: "<span class='holoparasite'>Boot sequence complete. Charge modules loaded. Holoparasite swarm online.</span>",
	carp_fluff_string: "<span class='holoparasite'>CARP CARP CARP! Caught one! It's a charger carp, that likes running at people. But it doesn't have any legs...</span>",
	melee_damage_lower: 15,
	melee_damage_upper: 15,
	ranged: 1,
	ranged_message: "charges",
	ranged_cooldown_time: 40,
	speed: -1,
	damage_coeff: null,
});

// /mob/living/simple_animal/hostile/guardian/charger/proc/<init>  (code/modules/mob/living/simple_animal/guardian/types/charger.dm:9)
rt.def("/mob/living/simple_animal/hostile/guardian/charger/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "damage_coeff", rt.alist(f, ["brute", 0.6000000238418579, "fire", 0.6000000238418579, "tox", 0.6000000238418579, "clone", 0.6000000238418579, "stamina", 0, "oxy", 0.6000000238418579]));
	return f.dot;
});

// /mob/living/simple_animal/hostile/guardian/charger/proc/Life  (code/modules/mob/living/simple_animal/guardian/types/charger.dm:18)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/charger/proc/Life", function* Life(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (rt.le(rt.sv(f, "ranged_cooldown"), rt.worldTime(f))) {
		if (!truthy(rt.sv(f, "chargealert"))) {
			rt.setSv(f, "chargealert", (yield* g.srcCall(f, "throw_alert", "charge", T("/obj/screen/alert/cancharge"))));
		}
	} else {
		yield* g.srcCall(f, "clear_alert", "charge");
		rt.setSv(f, "chargealert", null);
	}
	return f.dot;
}, true, { waitfor: false });

// /mob/living/simple_animal/hostile/guardian/charger/proc/OpenFire  (code/modules/mob/living/simple_animal/guardian/types/charger.dm:27)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/charger/proc/OpenFire", function* OpenFire(f: Frame, A: Value) {
	f.vars = () => [A];
	if (truthy(rt.sv(f, "charging"))) return f.dot;
	yield* g.srcCall(f, "visible_message", fmt("<span class='danger'><b>＀</b> ＀ at ＀!</span>", [live(f.src), rt.sv(f, "ranged_message"), live(A)]));
	rt.setSv(f, "ranged_cooldown", add(rt.worldTime(f), rt.sv(f, "ranged_cooldown_time")));
	yield* g.srcCall(f, "clear_alert", "charge");
	rt.setSv(f, "chargealert", null);
	yield* g.srcCall(f, "Shoot", live(A));
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/guardian/charger/proc/Shoot  (code/modules/mob/living/simple_animal/guardian/types/charger.dm:36)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/charger/proc/Shoot", function* Shoot(f: Frame, targeted_atom: Value) {
	f.vars = () => [targeted_atom];
	rt.setSv(f, "charging", 1);
	yield* g.callSrc(f, "throw_at", [null, live(targeted_atom), null, rt.sv(f, "range"), null, 1, null, live(f.src), null, 0, "callback", (yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/mob/living/simple_animal/hostile/guardian/charger/proc/charging_end")]))], rt.Args.Named);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/guardian/charger/proc/Move  (code/modules/mob/living/simple_animal/guardian/types/charger.dm:43)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/charger/proc/Move", function* Move(f: Frame) {
	if (truthy(rt.sv(f, "charging"))) {
		yield* g.new_(f, T("/obj/effect/temp_visual/decoy/fading"), [rt.sv(f, "loc"), live(f.src)]);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/guardian/charger/proc/snapback  (code/modules/mob/living/simple_animal/guardian/types/charger.dm:47)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/charger/proc/snapback", function* snapback(f: Frame) {
	if (truthy(rt.sv(f, "charging"))) return f.dot;
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/guardian/charger/proc/throw_impact  (code/modules/mob/living/simple_animal/guardian/types/charger.dm:51)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/charger/proc/throw_impact", function* throw_impact(f: Frame) {
	let L: Value = null, blocked: Value = null, H: Value = null;
	f.vars = () => [L, blocked, H];
	if (!truthy(rt.sv(f, "charging"))) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if (!truthy(live(f.args[0]))) return f.dot;
	if ((truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0)) && !isEqual(live(f.args[0]), rt.sv(f, "summoner")))) {
		L = live(f.args[0]);
		blocked = 0;
		if (truthy((yield* g.srcCall(f, "hasmatchingsummoner", live(f.args[0]))))) {
			blocked = 1;
		}
		if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) {
			if (truthy((yield* g.callName(f, (H = live(f.args[0])), "check_shields", [null, live(f.src), null, 90, null, fmt("＀", [rt.sv(f, "name")]), "attack_type", 4], rt.Args.Named)))) {
				blocked = 1;
			}
		}
		if (!truthy(live(blocked))) {
			yield* g.callName(f, live(L), "drop_all_held_items", []);
			yield* g.callName(f, live(L), "visible_message", [fmt("<span class='danger'>＀ slams into ＀!</span>", [live(f.src), live(L)]), fmt("<span class='userdanger'>＀ slams into you!</span>", [live(f.src)])]);
			yield* g.callName(f, live(L), "apply_damage", [20, "brute"]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(L), 0), rt.rsc("sound/effects/meteorimpact.ogg"), 100, 1]);
			yield* g.call(f, P("/proc/shake_camera"), null, [live(L), 4, 3]);
			yield* g.call(f, P("/proc/shake_camera"), null, [live(f.src), 2, 3]);
		}
	}
	rt.setSv(f, "charging", 0);
	return f.dot;
}, true, { args: ["A"], waitfor: false });
