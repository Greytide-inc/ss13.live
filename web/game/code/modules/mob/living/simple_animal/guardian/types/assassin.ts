// From code/modules/mob/living/simple_animal/guardian/types/assassin.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4873, "/mob/living/simple_animal/hostile/guardian/assassin", "/mob/living/simple_animal/hostile/guardian", {
	toggle: 0,
	stealthcooldown: 160,
	canstealthalert: null,
	instealthalert: null,
	playstyle_string: "<span class='holoparasite'>As an <b>assassin</b> type you do medium damage and have no damage resistance, but can enter stealth, massively increasing the damage of your next attack and causing it to ignore armor. Stealth is broken when you attack or take damage.</span>",
	magic_fluff_string: "<span class='holoparasite'>..And draw the Space Ninja, a lethal, invisible assassin.</span>",
	tech_fluff_string: "<span class='holoparasite'>Boot sequence complete. Assassin modules loaded. Holoparasite swarm online.</span>",
	carp_fluff_string: "<span class='holoparasite'>CARP CARP CARP! Caught one! It's an assassin carp! Just when you thought it was safe to go back to the water... which is unhelpful, because we're in space.</span>",
	melee_damage_lower: 15,
	melee_damage_upper: 15,
	attacktext: "slashes",
	attack_sound: rt.rsc("sound/weapons/bladeslice.ogg"),
	damage_coeff: null,
	toggle_button_type: rt.typePath("/obj/screen/guardian/ToggleMode/Assassin"),
});

// /mob/living/simple_animal/hostile/guardian/assassin/proc/<init>  (code/modules/mob/living/simple_animal/guardian/types/assassin.dm:7)
rt.def("/mob/living/simple_animal/hostile/guardian/assassin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "damage_coeff", rt.alist(f, ["brute", 1, "fire", 1, "tox", 1, "clone", 1, "stamina", 0, "oxy", 1]));
	return f.dot;
});

// /mob/living/simple_animal/hostile/guardian/assassin/proc/Initialize  (code/modules/mob/living/simple_animal/guardian/types/assassin.dm:20)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/assassin/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "stealthcooldown", 0);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/guardian/assassin/proc/Life  (code/modules/mob/living/simple_animal/guardian/types/assassin.dm:24)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/assassin/proc/Life", function* Life(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "updatestealthalert");
	if (!(isEqual(rt.sv(f, "loc"), rt.sv(f, "summoner")) && truthy(rt.sv(f, "toggle")))) return f.dot;
	yield* g.srcCall(f, "ToggleMode", 0);
	return f.dot;
}, true, { waitfor: false });

// /mob/living/simple_animal/hostile/guardian/assassin/proc/Stat  (code/modules/mob/living/simple_animal/guardian/types/assassin.dm:30)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/assassin/proc/Stat", function* Stat(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((yield* g.call(f, P("/proc/statpanel"), null, ["Status"])))) return f.dot;
	if (!rt.ge(rt.sv(f, "stealthcooldown"), rt.worldTime(f))) return f.dot;
	yield* g.call(f, P("/proc/stat"), null, [null, fmt("Stealth Cooldown Remaining: ＀ seconds", [(yield* g.call(f, P("/proc/max"), null, [(yield* g.call(f, P("/proc/round"), null, [multiply(subtract(rt.sv(f, "stealthcooldown"), rt.worldTime(f)), 0.10000000149011612), 0.10000000149011612])), 0]))])]);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/guardian/assassin/proc/AttackingTarget  (code/modules/mob/living/simple_animal/guardian/types/assassin.dm:36)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/assassin/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	if (!(truthy(rt.sv(f, "toggle")) && ((truthy((rt.istype(rt.sv(f, "target"), T("/mob/living")) ? 1 : 0)) || truthy((rt.istype(rt.sv(f, "target"), T("/obj/structure/window")) ? 1 : 0))) || truthy((rt.istype(rt.sv(f, "target"), T("/obj/structure/grille")) ? 1 : 0))))) return f.dot;
	yield* g.srcCall(f, "ToggleMode", 1);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/guardian/assassin/proc/adjustHealth  (code/modules/mob/living/simple_animal/guardian/types/assassin.dm:42)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/assassin/proc/adjustHealth", function* adjustHealth(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(rt.gt(live(f.dot), 0) && truthy(rt.sv(f, "toggle")))) return f.dot;
	yield* g.srcCall(f, "ToggleMode", 1);
	return f.dot;
}, true, { args: ["amount", "updating_health", "forced"] });

// /mob/living/simple_animal/hostile/guardian/assassin/proc/Recall  (code/modules/mob/living/simple_animal/guardian/types/assassin.dm:47)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/assassin/proc/Recall", function* Recall(f: Frame) {
	if (!(truthy((yield* g.callSuper(f, [], rt.Args.Same))) && truthy(rt.sv(f, "toggle")))) return f.dot;
	yield* g.srcCall(f, "ToggleMode", 0);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/guardian/assassin/proc/ToggleMode  (code/modules/mob/living/simple_animal/guardian/types/assassin.dm:52)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/assassin/proc/ToggleMode", function* ToggleMode(f: Frame, forced: Value) {
	f.vars = () => [forced];
	if (live(forced) === null) {
		forced = 0;
	}
	if (truthy(rt.sv(f, "toggle"))) {
		rt.setSv(f, "melee_damage_lower", rt.initial(f, live(f.src), "melee_damage_lower"));
		rt.setSv(f, "melee_damage_upper", rt.initial(f, live(f.src), "melee_damage_upper"));
		rt.setSv(f, "armour_penetration", rt.initial(f, live(f.src), "armour_penetration"));
		rt.setSv(f, "obj_damage", rt.initial(f, live(f.src), "obj_damage"));
		rt.setSv(f, "environment_smash", rt.initial(f, live(f.src), "environment_smash"));
		rt.setSv(f, "alpha", rt.initial(f, live(f.src), "alpha"));
		if (!truthy(live(forced))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'><B>You exit stealth.</span></B>"]);
		} else {
			yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＄！ suddenly appears!</span>", [live(f.src)]));
			rt.setSv(f, "stealthcooldown", add(rt.worldTime(f), rt.initial(f, live(f.src), "stealthcooldown")));
			rt.setSv(f, "cooldown", add(rt.worldTime(f), 40));
		}
		yield* g.srcCall(f, "updatestealthalert");
		rt.setSv(f, "toggle", 0);
	} else {
		if (rt.le(rt.sv(f, "stealthcooldown"), rt.worldTime(f))) {
			if (isEqual(rt.fv(f, "loc", live(f.src)), rt.sv(f, "summoner"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'><B>You have to be manifested to enter stealth!</span></B>"]);
				return live(f.dot);
			}
			rt.setSv(f, "melee_damage_lower", 50);
			rt.setSv(f, "melee_damage_upper", 50);
			rt.setSv(f, "armour_penetration", 100);
			rt.setSv(f, "obj_damage", 0);
			rt.setSv(f, "environment_smash", 0);
			yield* g.new_(f, T("/obj/effect/temp_visual/guardian/phase/out"), [rt.getStep(f, live(f.src), 0)]);
			rt.setSv(f, "alpha", 15);
			if (!truthy(live(forced))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'><B>You enter stealth, empowering your next attack.</span></B>"]);
			}
			yield* g.srcCall(f, "updatestealthalert");
			rt.setSv(f, "toggle", 1);
		} else {
			if (truthy(live(forced))) return f.dot;
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='danger'><B>You cannot yet enter stealth, wait another ＀ seconds!</span></B>", [(yield* g.call(f, P("/proc/max"), null, [(yield* g.call(f, P("/proc/round"), null, [multiply(subtract(rt.sv(f, "stealthcooldown"), rt.worldTime(f)), 0.10000000149011612), 0.10000000149011612])), 0]))])]);
		}
	}
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/guardian/assassin/proc/updatestealthalert  (code/modules/mob/living/simple_animal/guardian/types/assassin.dm:85)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/assassin/proc/updatestealthalert", function* updatestealthalert(f: Frame) {
	if (rt.le(rt.sv(f, "stealthcooldown"), rt.worldTime(f))) {
		if (truthy(rt.sv(f, "toggle"))) {
			if (!truthy(rt.sv(f, "instealthalert"))) {
				rt.setSv(f, "instealthalert", (yield* g.srcCall(f, "throw_alert", "instealth", T("/obj/screen/alert/instealth"))));
				yield* g.srcCall(f, "clear_alert", "canstealth");
				rt.setSv(f, "canstealthalert", null);
			}
		} else {
			if (!truthy(rt.sv(f, "canstealthalert"))) {
				rt.setSv(f, "canstealthalert", (yield* g.srcCall(f, "throw_alert", "canstealth", T("/obj/screen/alert/canstealth"))));
				yield* g.srcCall(f, "clear_alert", "instealth");
				rt.setSv(f, "instealthalert", null);
			}
		}
	} else {
		yield* g.srcCall(f, "clear_alert", "instealth");
		rt.setSv(f, "instealthalert", null);
		yield* g.srcCall(f, "clear_alert", "canstealth");
		rt.setSv(f, "canstealthalert", null);
	}
	return f.dot;
}, true);
