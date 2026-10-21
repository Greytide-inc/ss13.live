// From code/modules/mob/living/simple_animal/guardian/types/fire.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4877, "/mob/living/simple_animal/hostile/guardian/fire", "/mob/living/simple_animal/hostile/guardian", {
	range: 7,
	playstyle_string: "<span class='holoparasite'>As a <b>chaos</b> type, you have only light damage resistance, but will ignite any enemy you bump into. In addition, your melee attacks will cause human targets to see everyone as you.</span>",
	magic_fluff_string: "<span class='holoparasite'>..And draw the Wizard, bringer of endless chaos!</span>",
	tech_fluff_string: "<span class='holoparasite'>Boot sequence complete. Crowd control modules activated. Holoparasite swarm online.</span>",
	carp_fluff_string: "<span class='holoparasite'>CARP CARP CARP! You caught one! OH GOD, EVERYTHING'S ON FIRE. Except you and the fish.</span>",
	a_intent: "help",
	melee_damage_lower: 7,
	melee_damage_upper: 7,
	attack_sound: rt.rsc("sound/items/welder.ogg"),
	attacktext: "ignites",
	damage_coeff: null,
});

// /mob/living/simple_animal/hostile/guardian/fire/proc/<init>  (code/modules/mob/living/simple_animal/guardian/types/fire.dm:8)
rt.def("/mob/living/simple_animal/hostile/guardian/fire/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "damage_coeff", rt.alist(f, ["brute", 0.699999988079071, "fire", 0.699999988079071, "tox", 0.699999988079071, "clone", 0.699999988079071, "stamina", 0, "oxy", 0.699999988079071]));
	return f.dot;
});

// /mob/living/simple_animal/hostile/guardian/fire/proc/Life  (code/modules/mob/living/simple_animal/guardian/types/fire.dm:16)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/fire/proc/Life", function* Life(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.sv(f, "summoner"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "summoner"), "ExtinguishMob", []);
	yield* g.callName(f, rt.sv(f, "summoner"), "adjust_fire_stacks", [-20]);
	return f.dot;
}, true, { waitfor: false });

// /mob/living/simple_animal/hostile/guardian/fire/proc/AttackingTarget  (code/modules/mob/living/simple_animal/guardian/types/fire.dm:22)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/fire/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!((truthy(live(f.dot)) && truthy((rt.istype(rt.sv(f, "target"), T("/mob/living/carbon/human")) ? 1 : 0))) && !isEqual(rt.sv(f, "target"), rt.sv(f, "summoner")))) return f.dot;
	yield* g.new_(f, T("/obj/effect/hallucination/delusion"), [rt.fv(f, "loc", rt.sv(f, "target")), rt.sv(f, "target"), "custom", 200, 0, rt.sv(f, "icon_state"), rt.sv(f, "icon")]);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/guardian/fire/proc/Crossed  (code/modules/mob/living/simple_animal/guardian/types/fire.dm:27)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/fire/proc/Crossed", function* Crossed(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "collision_ignite", live(f.args[0]));
	return f.dot;
}, true, { args: ["AM"] });

// /mob/living/simple_animal/hostile/guardian/fire/proc/Bumped  (code/modules/mob/living/simple_animal/guardian/types/fire.dm:31)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/fire/proc/Bumped", function* Bumped(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "collision_ignite", live(f.args[0]));
	return f.dot;
}, true, { args: ["AM"] });

// /mob/living/simple_animal/hostile/guardian/fire/proc/Bump  (code/modules/mob/living/simple_animal/guardian/types/fire.dm:35)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/fire/proc/Bump", function* Bump(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "collision_ignite", live(f.args[0]));
	return f.dot;
}, true, { args: ["AM"] });

// /mob/living/simple_animal/hostile/guardian/fire/proc/collision_ignite  (code/modules/mob/living/simple_animal/guardian/types/fire.dm:39)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/fire/proc/collision_ignite", function* collision_ignite(f: Frame, AM: Value) {
	let M: Value = null;
	f.vars = () => [AM, M];
	if (!truthy((rt.istype(live(AM), T("/mob/living")) ? 1 : 0))) return f.dot;
	if (!((!truthy((yield* g.srcCall(f, "hasmatchingsummoner", (M = live(AM))))) && !isEqual(live(M), rt.sv(f, "summoner"))) && rt.lt(rt.fv(f, "fire_stacks", live(M)), 7))) return f.dot;
	rt.setFv(f, "fire_stacks", live(M), 7);
	yield* g.callName(f, live(M), "IgniteMob", []);
	return f.dot;
}, true);
