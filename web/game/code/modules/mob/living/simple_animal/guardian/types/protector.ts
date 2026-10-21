// From code/modules/mob/living/simple_animal/guardian/types/protector.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4879, "/mob/living/simple_animal/hostile/guardian/protector", "/mob/living/simple_animal/hostile/guardian", {
	toggle: 0,
	range: 15,
	playstyle_string: "<span class='holoparasite'>As a <b>protector</b> type you cause your summoner to leash to you instead of you leashing to them and have two modes; Combat Mode, where you do and take medium damage, and Protection Mode, where you do and take almost no damage, but move slightly slower.</span>",
	magic_fluff_string: "<span class='holoparasite'>..And draw the Guardian, a stalwart protector that never leaves the side of its charge.</span>",
	tech_fluff_string: "<span class='holoparasite'>Boot sequence complete. Protector modules loaded. Holoparasite swarm online.</span>",
	carp_fluff_string: "<span class='holoparasite'>CARP CARP CARP! You caught one! Wait, no... it caught you! The fisher has become the fishy.</span>",
	melee_damage_lower: 15,
	melee_damage_upper: 15,
	damage_coeff: null,
	toggle_button_type: rt.typePath("/obj/screen/guardian/ToggleMode"),
});

// /mob/living/simple_animal/hostile/guardian/protector/proc/<init>  (code/modules/mob/living/simple_animal/guardian/types/protector.dm:6)
rt.def("/mob/living/simple_animal/hostile/guardian/protector/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "damage_coeff", rt.alist(f, ["brute", 0.4000000059604645, "fire", 0.4000000059604645, "tox", 0.4000000059604645, "clone", 0.4000000059604645, "stamina", 0, "oxy", 0.4000000059604645]));
	return f.dot;
});

// /mob/living/simple_animal/hostile/guardian/protector/proc/ex_act  (code/modules/mob/living/simple_animal/guardian/types/protector.dm:15)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/protector/proc/ex_act", function* ex_act(f: Frame) {
	if (isEqual(live(f.args[0]), 1)) {
		yield* g.srcCall(f, "adjustBruteLoss", 400);
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	if (!truthy(rt.sv(f, "toggle"))) return f.dot;
	yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>The explosion glances off ＀'s energy shielding!</span>", [live(f.src)]));
	return f.dot;
}, true, { args: ["severity"], waitfor: false });

// /mob/living/simple_animal/hostile/guardian/protector/proc/adjustHealth  (code/modules/mob/living/simple_animal/guardian/types/protector.dm:23)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/protector/proc/adjustHealth", function* adjustHealth(f: Frame) {
	let I: Value = null;
	f.vars = () => [I];
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(rt.gt(live(f.dot), 0) && truthy(rt.sv(f, "toggle")))) return f.dot;
	I = (yield* g.new_(f, T("/image"), [null, rt.rsc("icons/effects/effects.dmi"), null, live(f.src), null, "shield-flash", null, 4.010000228881836, "dir", rt.op(f, "PickUnweighted", [1], [rt.gl("cardinal")])], rt.Args.Named));
	if (truthy(rt.sv(f, "namedatum"))) {
		rt.setFv(f, "color", live(I), rt.fv(f, "colour", rt.sv(f, "namedatum")));
	}
	yield* g.call(f, P("/proc/flick_overlay_view"), null, [live(I), live(f.src), 5]);
	return f.dot;
}, true, { args: ["amount", "updating_health", "forced"] });

// /mob/living/simple_animal/hostile/guardian/protector/proc/ToggleMode  (code/modules/mob/living/simple_animal/guardian/types/protector.dm:31)
rt.def("/mob/living/simple_animal/hostile/guardian/protector/proc/ToggleMode", function ToggleMode(f: Frame) {
	let shield_overlay: Value = null;
	f.vars = () => [shield_overlay];
	if (rt.gt(rt.sv(f, "cooldown"), rt.worldTime(f))) {
		return 0;
	}
	rt.setSv(f, "cooldown", add(rt.worldTime(f), 10));
	if (truthy(rt.sv(f, "toggle"))) {
		rt.callSrc(f, "cut_overlays", []);
		rt.setSv(f, "melee_damage_lower", rt.initial(f, live(f.src), "melee_damage_lower"));
		rt.setSv(f, "melee_damage_upper", rt.initial(f, live(f.src), "melee_damage_upper"));
		rt.setSv(f, "speed", rt.initial(f, live(f.src), "speed"));
		rt.setSv(f, "damage_coeff", rt.alist(f, ["brute", 0.4000000059604645, "fire", 0.4000000059604645, "tox", 0.4000000059604645, "clone", 0.4000000059604645, "stamina", 0, "oxy", 0.4000000059604645]));
		rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'><B>You switch to combat mode.</span></B>"]);
		rt.setSv(f, "toggle", 0);
	} else {
		shield_overlay = rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/effects/effects.dmi"), "shield-grey"]);
		if (truthy(rt.sv(f, "namedatum"))) {
			rt.setFv(f, "color", live(shield_overlay), rt.fv(f, "colour", rt.sv(f, "namedatum")));
		}
		rt.callSrc(f, "add_overlay", [live(shield_overlay)]);
		rt.setSv(f, "melee_damage_lower", 2);
		rt.setSv(f, "melee_damage_upper", 2);
		rt.setSv(f, "speed", 1);
		rt.setSv(f, "damage_coeff", rt.alist(f, ["brute", 0.05000000074505806, "fire", 0.05000000074505806, "tox", 0.05000000074505806, "clone", 0.05000000074505806, "stamina", 0, "oxy", 0.05000000074505806]));
		rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'><B>You switch to protection mode.</span></B>"]);
		rt.setSv(f, "toggle", 1);
	}
	return f.dot;
});

// /mob/living/simple_animal/hostile/guardian/protector/proc/snapback  (code/modules/mob/living/simple_animal/guardian/types/protector.dm:56)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/protector/proc/snapback", function* snapback(f: Frame) {
	if (!truthy(rt.sv(f, "summoner"))) return f.dot;
	if (rt.le((yield* g.call(f, P("/proc/get_dist"), null, [rt.getStep(f, rt.sv(f, "summoner"), 0), rt.getStep(f, live(f.src), 0)])), rt.sv(f, "range"))) {
		return live(f.dot);
	} else {
		if (truthy((rt.istype(rt.fv(f, "loc", rt.sv(f, "summoner")), T("/obj/effect")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='holoparasite'>You moved out of range, and were pulled back! You can only move ＀ meters from ＀!</span>", [rt.sv(f, "range"), rt.fv(f, "real_name", rt.sv(f, "summoner"))])]);
			yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＄！ jumps back to its user.</span>", [live(f.src)]));
			yield* g.srcCall(f, "Recall", 1);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "summoner"), fmt("<span class='holoparasite'>You moved out of range, and were pulled back! You can only move ＀ meters from <font color=\"＀\"><b>＀</b></font>!</span>", [rt.sv(f, "range"), rt.fv(f, "colour", rt.sv(f, "namedatum")), rt.sv(f, "real_name")])]);
			yield* g.callName(f, rt.sv(f, "summoner"), "visible_message", [fmt("<span class='danger'>＄！ jumps back to ＀ protector.</span>", [rt.sv(f, "summoner"), (yield* g.callName(f, rt.sv(f, "summoner"), "p_their", []))])]);
			yield* g.new_(f, T("/obj/effect/temp_visual/guardian/phase/out"), [rt.getStep(f, rt.sv(f, "summoner"), 0)]);
			yield* g.callName(f, rt.sv(f, "summoner"), "forceMove", [rt.getStep(f, live(f.src), 0)]);
			yield* g.new_(f, T("/obj/effect/temp_visual/guardian/phase"), [rt.getStep(f, rt.sv(f, "summoner"), 0)]);
		}
	}
	return f.dot;
}, true);
