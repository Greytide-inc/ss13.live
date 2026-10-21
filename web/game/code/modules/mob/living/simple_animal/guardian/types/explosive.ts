// From code/modules/mob/living/simple_animal/guardian/types/explosive.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4876, "/mob/living/simple_animal/hostile/guardian/bomb", "/mob/living/simple_animal/hostile/guardian", {
	bomb_cooldown: 0,
	range: 13,
	playstyle_string: "<span class='holoparasite'>As an <b>explosive</b> type, you have moderate close combat abilities, may explosively teleport targets on attack, and are capable of converting nearby items and objects into disguised bombs via alt click.</span>",
	magic_fluff_string: "<span class='holoparasite'>..And draw the Scientist, master of explosive death.</span>",
	tech_fluff_string: "<span class='holoparasite'>Boot sequence complete. Explosive modules active. Holoparasite swarm online.</span>",
	carp_fluff_string: "<span class='holoparasite'>CARP CARP CARP! Caught one! It's an explosive carp! Boom goes the fishy.</span>",
	melee_damage_lower: 15,
	melee_damage_upper: 15,
	damage_coeff: null,
});

// /mob/living/simple_animal/hostile/guardian/bomb/proc/<init>  (code/modules/mob/living/simple_animal/guardian/types/explosive.dm:5)
rt.def("/mob/living/simple_animal/hostile/guardian/bomb/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "damage_coeff", rt.alist(f, ["brute", 0.6000000238418579, "fire", 0.6000000238418579, "tox", 0.6000000238418579, "clone", 0.6000000238418579, "stamina", 0, "oxy", 0.6000000238418579]));
	return f.dot;
});

// /mob/living/simple_animal/hostile/guardian/bomb/proc/Stat  (code/modules/mob/living/simple_animal/guardian/types/explosive.dm:14)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/bomb/proc/Stat", function* Stat(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((yield* g.call(f, P("/proc/statpanel"), null, ["Status"])))) return f.dot;
	if (!rt.ge(rt.sv(f, "bomb_cooldown"), rt.worldTime(f))) return f.dot;
	yield* g.call(f, P("/proc/stat"), null, [null, fmt("Bomb Cooldown Remaining: ＀ seconds", [(yield* g.call(f, P("/proc/max"), null, [(yield* g.call(f, P("/proc/round"), null, [multiply(subtract(rt.sv(f, "bomb_cooldown"), rt.worldTime(f)), 0.10000000149011612), 0.10000000149011612])), 0]))])]);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/guardian/bomb/proc/AttackingTarget  (code/modules/mob/living/simple_animal/guardian/types/explosive.dm:20)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/bomb/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	let M: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [M, L, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!((truthy(live(f.dot)) && truthy(rt.op(f, "Prob", [], [40]))) && truthy((rt.istype(rt.sv(f, "target"), T("/mob/living")) ? 1 : 0)))) return f.dot;
	if (!((!truthy(rt.gv(f, "anchored", (M = rt.sv(f, "target")))) && !isEqual(live(M), rt.sv(f, "summoner"))) && !truthy((yield* g.srcCall(f, "hasmatchingsummoner", live(M)))))) return f.dot;
	yield* g.new_(f, T("/obj/effect/temp_visual/guardian/phase/out"), [rt.getStep(f, live(M), 0)]);
	yield* g.call(f, P("/proc/do_teleport"), null, [live(M), live(M), 10]);
	L = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [1, live(M)])), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if (truthy((yield* g.srcCall(f, "hasmatchingsummoner", live(L))))) {
			continue;
		}
		if ((!isEqual(live(L), live(f.src)) && !isEqual(live(L), rt.sv(f, "summoner")))) {
			yield* g.callName(f, live(L), "apply_damage", [15, "brute"]);
		}
	}
	rt.endFor(f, 0);
	yield* g.new_(f, T("/obj/effect/temp_visual/explosion"), [rt.getStep(f, live(M), 0)]);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/guardian/bomb/proc/AltClickOn  (code/modules/mob/living/simple_animal/guardian/types/explosive.dm:34)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/bomb/proc/AltClickOn", function* AltClickOn(f: Frame, A: Value) {
	let B: Value = null;
	f.vars = () => [A, B];
	if (!truthy((rt.istype(live(A), T("/atom/movable")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (isEqual(rt.fv(f, "loc", live(f.src)), rt.sv(f, "summoner"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'><B>You must be manifested to create bombs!</span></B>"]);
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(A), T("/obj")) ? 1 : 0))) return f.dot;
	if ((rt.le(rt.sv(f, "bomb_cooldown"), rt.worldTime(f)) && !truthy(rt.sv(f, "stat")))) {
		B = (yield* g.new_(f, T("/obj/guardian_bomb"), [rt.getStep(f, live(A), 0)]));
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'><B>Success! Bomb armed!</span></B>"]);
		rt.setSv(f, "bomb_cooldown", add(rt.worldTime(f), 200));
		rt.setFv(f, "spawner", live(B), live(f.src));
		yield* g.callName(f, live(B), "disguise", [live(A)]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'><B>Your powers are on cooldown! You must wait 20 seconds between bombs.</span></B>"]);
	}
	return f.dot;
}, true);

rt.type(13072, "/obj/guardian_bomb", "/obj", {
	stored_obj: null,
	spawner: null,
	name: "bomb",
	desc: "You shouldn't be seeing this!",
});

// /obj/guardian_bomb/proc/disguise  (code/modules/mob/living/simple_animal/guardian/types/explosive.dm:58)  may sleep
rt.def("/obj/guardian_bomb/proc/disguise", function* disguise(f: Frame, A: Value) {
	f.vars = () => [A];
	rt.setFv(f, "loc", live(A), live(f.src));
	rt.setSv(f, "stored_obj", live(A));
	rt.setSv(f, "opacity", rt.fv(f, "opacity", live(A)));
	rt.setSv(f, "anchored", rt.fv(f, "anchored", live(A)));
	rt.setSv(f, "density", rt.fv(f, "density", live(A)));
	rt.setSv(f, "appearance", rt.fv(f, "appearance", live(A)));
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/guardian_bomb/proc/disable")])), 600]);
	return f.dot;
}, true);

// /obj/guardian_bomb/proc/disable  (code/modules/mob/living/simple_animal/guardian/types/explosive.dm:66)  may sleep
rt.def("/obj/guardian_bomb/proc/disable", function* disable(f: Frame) {
	yield* g.callName(f, rt.sv(f, "stored_obj"), "forceMove", [rt.getStep(f, live(f.src), 0)]);
	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "spawner"), "<span class='danger'><B>Failure! Your trap didn't catch anyone this time.</span></B>"]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/guardian_bomb/proc/detonate  (code/modules/mob/living/simple_animal/guardian/types/explosive.dm:71)  may sleep
rt.def("/obj/guardian_bomb/proc/detonate", function* detonate(f: Frame, user: Value) {
	let _T: Value = null;
	f.vars = () => [user, _T];
	if (!truthy((rt.istype(live(user), T("/mob/living")) ? 1 : 0))) return f.dot;
	if (((!isEqual(live(user), rt.sv(f, "spawner")) && !isEqual(live(user), rt.fv(f, "summoner", rt.sv(f, "spawner")))) && !truthy((yield* g.callName(f, rt.sv(f, "spawner"), "hasmatchingsummoner", [live(user)]))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='danger'><B>The ＀ was boobytrapped!</span></B>", [live(f.src)])]);
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "spawner"), fmt("<span class='danger'><B>Success! Your trap caught ＀</span></B>", [live(user)])]);
		_T = rt.getStep(f, live(f.src), 0);
		yield* g.callName(f, rt.sv(f, "stored_obj"), "forceMove", [live(_T)]);
		yield* g.call(f, P("/proc/playsound"), null, [live(_T), rt.rsc("sound/effects/explosion2.ogg"), 200, 1]);
		yield* g.new_(f, T("/obj/effect/temp_visual/explosion"), [live(_T)]);
		yield* g.callName(f, live(user), "ex_act", [2]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='holoparasite'>＀ glows with a strange <font color=\"＀\">light</font>, and you don't touch it.</span>", [live(f.src), rt.gv(f, "colour", rt.fv(f, "namedatum", rt.sv(f, "spawner")))])]);
	}
	return f.dot;
}, true);

// /obj/guardian_bomb/proc/Bump  (code/modules/mob/living/simple_animal/guardian/types/explosive.dm:85)  may sleep
rt.def("/obj/guardian_bomb/proc/Bump", function* Bump(f: Frame) {
	yield* g.srcCall(f, "detonate", live(f.args[0]));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["A"] });

// /obj/guardian_bomb/proc/attackby  (code/modules/mob/living/simple_animal/guardian/types/explosive.dm:89)  may sleep
rt.def("/obj/guardian_bomb/proc/attackby", function* attackby(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "detonate", live(user));
	return f.dot;
}, true);

// /obj/guardian_bomb/proc/attack_hand  (code/modules/mob/living/simple_animal/guardian/types/explosive.dm:92)  may sleep
rt.def("/obj/guardian_bomb/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "detonate", live(user));
	return f.dot;
}, true);

// /obj/guardian_bomb/proc/examine  (code/modules/mob/living/simple_animal/guardian/types/explosive.dm:95)  may sleep
rt.def("/obj/guardian_bomb/proc/examine", function* examine(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, rt.sv(f, "stored_obj"), "examine", [live(user)]);
	if (!rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(user), live(f.src)])), 2)) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='holoparasite'>It glows with a strange <font color=\"＀\">light</font>!</span>", [rt.gv(f, "colour", rt.fv(f, "namedatum", rt.sv(f, "spawner")))])]);
	return f.dot;
}, true);
