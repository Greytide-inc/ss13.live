// From code/modules/mob/living/carbon/alien/humanoid/caste/hunter.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4829, "/mob/living/carbon/alien/humanoid/hunter", "/mob/living/carbon/alien/humanoid", {
	leap_icon: null,
	caste: "h",
	name: "alien hunter",
	maxHealth: 125,
	health: 125,
	icon_state: "alienh",
});

// /mob/living/carbon/alien/humanoid/hunter/proc/create_internal_organs  (code/modules/mob/living/carbon/alien/humanoid/caste/hunter.dm:10)  may sleep
rt.def("/mob/living/carbon/alien/humanoid/hunter/proc/create_internal_organs", function* create_internal_organs(f: Frame) {
	rt.modSrcVar(f, "internal_organs", (yield* g.new_(f, T("/obj/item/organ/alien/plasmavessel/small"), [])), add);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /mob/living/carbon/alien/humanoid/hunter/proc/movement_delay  (code/modules/mob/living/carbon/alien/humanoid/caste/hunter.dm:15)
rt.def("/mob/living/carbon/alien/humanoid/hunter/proc/movement_delay", function movement_delay(f: Frame) {
	f.dot = -1;
	f.dot = rt.modify(live(f.dot), rt.callSuper(f, [], rt.Args.Same), add);
	return f.dot;
});

// /mob/living/carbon/alien/humanoid/hunter/proc/toggle_leap  (code/modules/mob/living/carbon/alien/humanoid/caste/hunter.dm:21)  may sleep
rt.def("/mob/living/carbon/alien/humanoid/hunter/proc/toggle_leap", function* toggle_leap(f: Frame, message: Value) {
	let $0: any, $1: any;
	f.vars = () => [message, $0, $1];
	if (live(message) === null) {
		message = 1;
	}
	rt.setSv(f, "leap_on_click", (!truthy(rt.sv(f, "leap_on_click")) ? 1 : 0));
	$0 = rt.sv(f, "leap_icon");
	if (truthy(rt.sv(f, "leap_on_click"))) {
		$1 = "on";
	} else {
		$1 = "off";
	}
	rt.setFv(f, "icon_state", $0, fmt("leap_＀", [$1]));
	yield* g.srcCall(f, "update_icons");
	if (truthy(live(message))) {
		$0 = live(f.src);
		if (truthy(rt.sv(f, "leap_on_click"))) {
			$1 = "leap at";
		} else {
			$1 = "slash at";
		}
		yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='noticealien'>You will now ＀ enemies!</span>", [$1])]);
	} else {
		return live(f.dot);
	}
	return f.dot;
}, true);

// /mob/living/carbon/alien/humanoid/hunter/proc/ClickOn  (code/modules/mob/living/carbon/alien/humanoid/caste/hunter.dm:31)  may sleep
rt.def("/mob/living/carbon/alien/humanoid/hunter/proc/ClickOn", function* ClickOn(f: Frame) {
	yield* g.srcCall(f, "face_atom", live(f.args[0]));
	if (truthy(rt.sv(f, "leap_on_click"))) {
		yield* g.srcCall(f, "leap_at", live(f.args[0]));
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["A", "params"] });

// /mob/living/carbon/alien/humanoid/hunter/proc/leap_at  (code/modules/mob/living/carbon/alien/humanoid/caste/hunter.dm:41)  may sleep
rt.def("/mob/living/carbon/alien/humanoid/hunter/proc/leap_at", function* leap_at(f: Frame, A: Value) {
	f.vars = () => [A];
	if (rt.gt(rt.sv(f, "pounce_cooldown"), rt.worldTime(f))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='alertalien'>You are too fatigued to pounce right now!</span>"]);
		return live(f.dot);
	}
	if ((((truthy(rt.sv(f, "leaping")) || truthy(rt.sv(f, "stat"))) || truthy(rt.sv(f, "buckled"))) || truthy(rt.sv(f, "lying")))) {
		return live(f.dot);
	}
	if ((!truthy((yield* g.srcCall(f, "has_gravity"))) || !truthy((yield* g.callName(f, live(A), "has_gravity", []))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='alertalien'>It is unsafe to leap without gravity!</span>"]);
		return live(f.dot);
	} else {
		rt.setSv(f, "leaping", 1);
		rt.modSrcVar(f, "weather_immunities", "lava", add);
		yield* g.srcCall(f, "update_icons");
		yield* g.callSrc(f, "throw_at", [null, live(A), null, 7, null, 1, "spin", 0, "diagonals_first", 1, "callback", (yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/mob/living/carbon/alien/humanoid/hunter/proc/leap_end")]))], rt.Args.Named);
	}
	return f.dot;
}, true);

// /mob/living/carbon/alien/humanoid/hunter/proc/leap_end  (code/modules/mob/living/carbon/alien/humanoid/caste/hunter.dm:61)  may sleep
rt.def("/mob/living/carbon/alien/humanoid/hunter/proc/leap_end", function* leap_end(f: Frame) {
	rt.setSv(f, "leaping", 0);
	(rt.modSrcVar(f, "weather_immunities", "lava", subtract));
	yield* g.srcCall(f, "update_icons");
	return f.dot;
}, true);

// /mob/living/carbon/alien/humanoid/hunter/proc/throw_impact  (code/modules/mob/living/carbon/alien/humanoid/caste/hunter.dm:66)  may sleep
rt.def("/mob/living/carbon/alien/humanoid/hunter/proc/throw_impact", function* throw_impact(f: Frame) {
	let L: Value = null, blocked: Value = null, H: Value = null;
	f.vars = () => [L, blocked, H];
	if (!truthy(rt.sv(f, "leaping"))) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if (!truthy(live(f.args[0]))) return f.dot;
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) {
		L = live(f.args[0]);
		blocked = 0;
		if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) {
			if (truthy((yield* g.callName(f, (H = live(f.args[0])), "check_shields", [null, 0, null, fmt("the ＀", [rt.sv(f, "name")]), null, live(f.src), "attack_type", 5], rt.Args.Named)))) {
				blocked = 1;
			}
		}
		if (!truthy(live(blocked))) {
			yield* g.callName(f, live(L), "visible_message", [fmt("<span class ='danger'>＀ pounces on ＀!</span>", [live(f.src), live(L)]), fmt("<span class ='userdanger'>＀ pounces on you!</span>", [live(f.src)])]);
			yield* g.callName(f, live(L), "Knockdown", [100]);
			yield* g.call(f, P("/proc/sleep"), null, [2]);
			yield* g.call(f, P("/proc/step_towards"), null, [live(f.src), live(L)]);
		} else {
			yield* g.srcCall(f, "Knockdown", 40, 1, 1);
		}
		yield* g.srcCall(f, "toggle_leap", 0);
		rt.setSv(f, "pounce_cooldown", add(rt.worldTime(f), rt.sv(f, "pounce_cooldown_time")));
	} else {
		if ((truthy(rt.fv(f, "density", live(f.args[0]))) && !truthy((yield* g.callName(f, live(f.args[0]), "CanPass", [live(f.src)]))))) {
			yield* g.srcCall(f, "visible_message", fmt("<span class ='danger'>＀ smashes into ＀!</span>", [live(f.src), live(f.args[0])]), fmt("<span class ='alertalien'>＀ smashes into ＀!</span>", [live(f.src), live(f.args[0])]));
			yield* g.srcCall(f, "Knockdown", 40, 1, 1);
		}
	}
	if (!truthy(rt.sv(f, "leaping"))) return f.dot;
	rt.setSv(f, "leaping", 0);
	yield* g.srcCall(f, "update_icons");
	yield* g.srcCall(f, "update_canmove");
	return f.dot;
}, true, { args: ["A"], waitfor: false });

// /mob/living/carbon/alien/humanoid/proc/float  (code/modules/mob/living/carbon/alien/humanoid/caste/hunter.dm:100)  may sleep
rt.def("/mob/living/carbon/alien/humanoid/proc/float", function* float(f: Frame) {
	if (truthy(rt.sv(f, "leaping"))) {
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["on"] });
