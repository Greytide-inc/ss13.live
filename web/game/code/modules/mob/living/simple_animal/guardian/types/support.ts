// From code/modules/mob/living/simple_animal/guardian/types/support.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4882, "/mob/living/simple_animal/hostile/guardian/healer", "/mob/living/simple_animal/hostile/guardian", {
	beacon: null,
	beacon_cooldown: 0,
	toggle: 0,
	playstyle_string: "<span class='holoparasite'>As a <b>support</b> type, you may toggle your basic attacks to a healing mode. In addition, Alt-Clicking on an adjacent object or mob will warp them to your bluespace beacon after a short delay.</span>",
	magic_fluff_string: "<span class='holoparasite'>..And draw the CMO, a potent force of life... and death.</span>",
	carp_fluff_string: "<span class='holoparasite'>CARP CARP CARP! You caught a support carp. It's a kleptocarp!</span>",
	tech_fluff_string: "<span class='holoparasite'>Boot sequence complete. Support modules active. Holoparasite swarm online.</span>",
	a_intent: "harm",
	friendly: "heals",
	speed: 0,
	damage_coeff: null,
	melee_damage_lower: 15,
	melee_damage_upper: 15,
	toggle_button_type: rt.typePath("/obj/screen/guardian/ToggleMode"),
});

// /mob/living/simple_animal/hostile/guardian/healer/proc/<init>  (code/modules/mob/living/simple_animal/guardian/types/support.dm:6)
rt.def("/mob/living/simple_animal/hostile/guardian/healer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "damage_coeff", rt.alist(f, ["brute", 0.699999988079071, "fire", 0.699999988079071, "tox", 0.699999988079071, "clone", 0.699999988079071, "stamina", 0, "oxy", 0.699999988079071]));
	return f.dot;
});

// /mob/living/simple_animal/hostile/guardian/healer/proc/Initialize  (code/modules/mob/living/simple_animal/guardian/types/support.dm:19)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/healer/proc/Initialize", function* Initialize(f: Frame) {
	let medsensor: Value = null;
	f.vars = () => [medsensor];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.callName(f, (medsensor = rt.index(rt.gl("huds"), 4)), "add_hud_to", [live(f.src)]);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/guardian/healer/proc/Stat  (code/modules/mob/living/simple_animal/guardian/types/support.dm:24)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/healer/proc/Stat", function* Stat(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((yield* g.call(f, P("/proc/statpanel"), null, ["Status"])))) return f.dot;
	if (!rt.ge(rt.sv(f, "beacon_cooldown"), rt.worldTime(f))) return f.dot;
	yield* g.call(f, P("/proc/stat"), null, [null, fmt("Beacon Cooldown Remaining: ＀ seconds", [(yield* g.call(f, P("/proc/max"), null, [(yield* g.call(f, P("/proc/round"), null, [multiply(subtract(rt.sv(f, "beacon_cooldown"), rt.worldTime(f)), 0.10000000149011612), 0.10000000149011612])), 0]))])]);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/guardian/healer/proc/AttackingTarget  (code/modules/mob/living/simple_animal/guardian/types/support.dm:30)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/healer/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	let C: Value = null, H: Value = null;
	f.vars = () => [C, H];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(truthy(rt.sv(f, "toggle")) && truthy((rt.istype(rt.sv(f, "target"), T("/mob/living/carbon")) ? 1 : 0)))) return f.dot;
	yield* g.callName(f, (C = rt.sv(f, "target")), "adjustBruteLoss", [-5]);
	yield* g.callName(f, live(C), "adjustFireLoss", [-5]);
	yield* g.callName(f, live(C), "adjustOxyLoss", [-5]);
	yield* g.callName(f, live(C), "adjustToxLoss", [-5]);
	H = (yield* g.new_(f, T("/obj/effect/temp_visual/heal"), [rt.getStep(f, live(C), 0)]));
	if (truthy(rt.sv(f, "namedatum"))) {
		rt.setFv(f, "color", live(H), rt.fv(f, "colour", rt.sv(f, "namedatum")));
	}
	if (!isEqual(live(C), rt.sv(f, "summoner"))) return f.dot;
	yield* g.srcCall(f, "update_health_hud");
	yield* g.srcCall(f, "med_hud_set_health");
	yield* g.srcCall(f, "med_hud_set_status");
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/guardian/healer/proc/ToggleMode  (code/modules/mob/living/simple_animal/guardian/types/support.dm:46)
rt.def("/mob/living/simple_animal/hostile/guardian/healer/proc/ToggleMode", function ToggleMode(f: Frame) {
	if (isEqual(rt.fv(f, "loc", live(f.src)), rt.sv(f, "summoner"))) {
		if (truthy(rt.sv(f, "toggle"))) {
			rt.setSv(f, "a_intent", "harm");
			rt.setSv(f, "speed", 0);
			rt.setSv(f, "damage_coeff", rt.alist(f, ["brute", 0.699999988079071, "fire", 0.699999988079071, "tox", 0.699999988079071, "clone", 0.699999988079071, "stamina", 0, "oxy", 0.699999988079071]));
			rt.setSv(f, "melee_damage_lower", 15);
			rt.setSv(f, "melee_damage_upper", 15);
			rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'><B>You switch to combat mode.</span></B>"]);
			rt.setSv(f, "toggle", 0);
		} else {
			rt.setSv(f, "a_intent", "help");
			rt.setSv(f, "speed", 1);
			rt.setSv(f, "damage_coeff", rt.alist(f, ["brute", 1, "fire", 1, "tox", 1, "clone", 1, "stamina", 0, "oxy", 1]));
			rt.setSv(f, "melee_damage_lower", 0);
			rt.setSv(f, "melee_damage_upper", 0);
			rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'><B>You switch to healing mode.</span></B>"]);
			rt.setSv(f, "toggle", 1);
		}
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'><B>You have to be recalled to toggle modes!</span></B>"]);
	}
	return f.dot;
});

// /mob/living/simple_animal/hostile/guardian/healer/verb/Beacon  (code/modules/mob/living/simple_animal/guardian/types/support.dm:72)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/healer/verb/Beacon", function* Beacon(f: Frame) {
	let beacon_loc: Value = null;
	f.vars = () => [beacon_loc];
	if (rt.ge(rt.sv(f, "beacon_cooldown"), rt.worldTime(f))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'><B>Your power is on cooldown. You must wait five minutes between placing beacons.</span></B>"]);
		return live(f.dot);
	}
	if (!truthy((rt.istype((beacon_loc = rt.getStep(f, rt.fv(f, "loc", live(f.src)), 0)), T("/turf/open/floor")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "beacon"))) {
		yield* g.callName(f, rt.sv(f, "beacon"), "disappear", []);
		rt.setSv(f, "beacon", null);
	}
	rt.setSv(f, "beacon", (yield* g.new_(f, T("/obj/structure/recieving_pad"), [live(beacon_loc), live(f.src)])));
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'><B>Beacon placed! You may now warp targets and objects to it, including your user, via Alt+Click.</span></B>"]);
	rt.setSv(f, "beacon_cooldown", add(rt.worldTime(f), 3000));
	return f.dot;
}, true, { verb: { name: "Place Bluespace Beacon", category: "Guardian", desc: "Mark a floor as your beacon point, allowing you to warp targets to it. Your beacon will not work at extreme distances." } });

rt.type(12966, "/obj/structure/recieving_pad", "/obj/structure", {
	light_range: 1,
	anchored: 1,
	name: "bluespace recieving pad",
	icon: rt.rsc("icons/turf/floors.dmi"),
	desc: "A recieving zone for bluespace teleportations.",
	icon_state: "light_on-w",
	density: 0,
	layer: 2.04,
});

// /obj/structure/recieving_pad/proc/New  (code/modules/mob/living/simple_animal/guardian/types/support.dm:101)  may sleep
rt.def("/obj/structure/recieving_pad/proc/New", function* New(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.fv(f, "namedatum", live(f.args[1])))) return f.dot;
	yield* g.srcCall(f, "add_atom_colour", rt.gv(f, "colour", rt.fv(f, "namedatum", live(f.args[1]))), 4);
	return f.dot;
}, true, { args: ["loc", "G"] });

// /obj/structure/recieving_pad/proc/disappear  (code/modules/mob/living/simple_animal/guardian/types/support.dm:106)  may sleep
rt.def("/obj/structure/recieving_pad/proc/disappear", function* disappear(f: Frame) {
	yield* g.srcCall(f, "visible_message", fmt("＀ vanishes!", [live(f.src)]));
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/guardian/healer/proc/AltClickOn  (code/modules/mob/living/simple_animal/guardian/types/support.dm:110)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/healer/proc/AltClickOn", function* AltClickOn(f: Frame, A: Value) {
	let _T: Value = null, L: Value = null;
	f.vars = () => [A, _T, L];
	if (!truthy((rt.istype(live(A), T("/atom/movable")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (isEqual(rt.fv(f, "loc", live(f.src)), rt.sv(f, "summoner"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'><B>You must be manifested to warp a target!</span></B>"]);
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "beacon"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'><B>You need a beacon placed to warp things!</span></B>"]);
		return live(f.dot);
	}
	if (!truthy((yield* g.srcCall(f, "Adjacent", live(A))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'><B>You must be adjacent to your target!</span></B>"]);
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "anchored", live(A)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'><B>Your target cannot be anchored!</span></B>"]);
		return live(f.dot);
	}
	_T = rt.getStep(f, live(A), 0);
	if (!isEqual(rt.fv(f, "z", rt.sv(f, "beacon")), rt.fv(f, "z", live(_T)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'><B>The beacon is too far away to warp to!</span></B>"]);
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='danger'><B>You begin to warp ＀.</span></B>", [live(A)])]);
	yield* g.callName(f, live(A), "visible_message", [fmt("<span class='danger'>＀ starts to glow faintly!</span>", [live(A)]), "<span class='userdanger'>You start to faintly glow, and you feel strangely weightless!</span>"]);
	yield* g.srcCall(f, "do_attack_animation", live(A), null, 1);
	if (!truthy((yield* g.call(f, P("/proc/do_mob"), null, [live(f.src), live(A), 60])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'><B>You need to hold still!</span></B>"]);
		return live(f.dot);
	}
	yield* g.new_(f, T("/obj/effect/temp_visual/guardian/phase/out"), [live(_T)]);
	if (truthy((rt.istype(live(A), T("/mob/living")) ? 1 : 0))) {
		yield* g.callName(f, (L = live(A)), "flash_act", []);
	}
	yield* g.callName(f, live(A), "visible_message", [fmt("<span class='danger'>＀ disappears in a flash of light!</span>", [live(A)]), "<span class='userdanger'>Your vision is obscured by a flash of light!</span>"]);
	yield* g.call(f, P("/proc/do_teleport"), null, [live(A), rt.sv(f, "beacon"), 0]);
	yield* g.new_(f, T("/obj/effect/temp_visual/guardian/phase"), [rt.getStep(f, live(A), 0)]);
	return f.dot;
}, true);
