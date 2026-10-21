// From code/game/gamemodes/clock_cult/clock_structures/mania_motor.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12155, "/obj/structure/destructible/clockwork/powered/mania_motor", "/obj/structure/destructible/clockwork/powered", {
	mania_cost: 150,
	clockwork_desc: "A transmitter that allows Sevtug to whisper into the minds of nearby non-servants, causing a variety of negative mental effects, up to and including conversion.",
	active_icon: "mania_motor",
	inactive_icon: "mania_motor_inactive",
	unanchored_icon: "mania_motor_unwrenched",
	construction_value: 20,
	light_color: "#AF0AAF",
	name: "mania motor",
	desc: "A pair of antenna with what appear to be sockets around the base. It reminds you of an antlion.",
	icon_state: "mania_motor_inactive",
	break_message: "<span class='warning'>The antenna break off, leaving a pile of shards!</span>",
	max_integrity: 100,
	obj_integrity: 100,
	debris: null,
});

// /obj/structure/destructible/clockwork/powered/mania_motor/proc/<init>  (code/game/gamemodes/clock_cult/clock_structures/mania_motor.dm:15)
rt.def("/obj/structure/destructible/clockwork/powered/mania_motor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "debris", rt.alist(f, [T("/obj/item/clockwork/alloy_shards/large"), 2, T("/obj/item/clockwork/alloy_shards/small"), 2, T("/obj/item/clockwork/component/geis_capacitor/antennae"), 1]));
	return f.dot;
});

// /obj/structure/destructible/clockwork/powered/mania_motor/proc/examine  (code/game/gamemodes/clock_cult/clock_structures/mania_motor.dm:21)
rt.def("/obj/structure/destructible/clockwork/powered/mania_motor/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!(truthy(rt.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[0])])) || truthy((rt.istype(live(f.args[0]), T("/mob/dead/observer")) ? 1 : 0)))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='sevtug_small'>It requires <b>＀W</b> to run.</span>", [rt.sv(f, "mania_cost")])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/structure/destructible/clockwork/powered/mania_motor/proc/forced_disable  (code/game/gamemodes/clock_cult/clock_structures/mania_motor.dm:28)  may sleep
rt.def("/obj/structure/destructible/clockwork/powered/mania_motor/proc/forced_disable", function* forced_disable(f: Frame, bad_effects: Value) {
	f.vars = () => [bad_effects];
	if (!truthy(rt.sv(f, "active"))) return f.dot;
	if (truthy(live(bad_effects))) {
		yield* g.srcCall(f, "try_use_power", 100);
	}
	yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ hums loudly, then the sockets at its base fall dark!</span>", [live(f.src)]));
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/screech.ogg"), 40, 1]);
	yield* g.srcCall(f, "toggle");
	return 1;
}, true);

// /obj/structure/destructible/clockwork/powered/mania_motor/proc/attack_hand  (code/game/gamemodes/clock_cult/clock_structures/mania_motor.dm:35)
rt.def("/obj/structure/destructible/clockwork/powered/mania_motor/proc/attack_hand", function attack_hand(f: Frame, user: Value) {
	if (!(truthy(rt.callName(f, live(user), "canUseTopic", [live(f.src), (!truthy((rt.istype(live(user), T("/mob/living/silicon")) ? 1 : 0)) ? 1 : 0), 1])) && truthy(rt.call(f, P("/proc/is_servant_of_ratvar"), null, [live(user)])))) return f.dot;
	if (rt.ge((!truthy(rt.callSrc(f, "total_accessable_power", [])) ? 1 : 0), rt.sv(f, "mania_cost"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ needs more power to function!</span>", [live(f.src)])]);
		return 0;
	}
	rt.callSrc(f, "toggle", [0, live(user)]);
	return f.dot;
});

// /obj/structure/destructible/clockwork/powered/mania_motor/proc/toggle  (code/game/gamemodes/clock_cult/clock_structures/mania_motor.dm:42)
rt.def("/obj/structure/destructible/clockwork/powered/mania_motor/proc/toggle", function toggle(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "active"))) {
		rt.callSrc(f, "set_light", [2, 0.8999999761581421]);
	} else {
		rt.callSrc(f, "set_light", [0]);
	}
	return f.dot;
}, false, { args: ["fast_process", "user"] });

// /obj/structure/destructible/clockwork/powered/mania_motor/proc/process  (code/game/gamemodes/clock_cult/clock_structures/mania_motor.dm:49)  may sleep
rt.def("/obj/structure/destructible/clockwork/powered/mania_motor/proc/process", function* process(f: Frame) {
	let efficiency: Value = null, H: Value = null, effects: Value = null, M: Value = null, MM: Value = null;
	let $e: any;
	f.vars = () => [efficiency, H, effects, M, MM, $e];
	if (!truthy((yield* g.srcCall(f, "try_use_power", rt.sv(f, "mania_cost"))))) {
		yield* g.srcCall(f, "forced_disable", 0);
		return live(f.dot);
	}
	efficiency = (yield* g.srcCall(f, "get_efficiency_mod"));
	H = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/viewers"), null, [7, live(f.src)])), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		H = $e;
		if (truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(H)])))) {
			continue;
		}
		effects = (yield* g.callName(f, live(H), "has_status_effect_list", [T("/datum/status_effect/maniamotor")]));
		M = null;
		MM = null;
		rt.forList(f, 1, live(effects), T("/datum/status_effect/maniamotor"));
		while (($e = rt.next(f, 1)) !== undefined) {
			MM = $e;
			if (isEqual(rt.fv(f, "motor", live(MM)), live(f.src))) {
				M = live(MM);
				break;
			}
		}
		rt.endFor(f, 1);
		if (!truthy(live(M))) {
			M = (yield* g.callName(f, live(H), "apply_status_effect", [T("/datum/status_effect/maniamotor"), live(f.src)]));
		}
		rt.setFv(f, "severity", live(M), (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "severity", live(M)), multiply(multiply(subtract(11, (yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(H)]))), live(efficiency)), live(efficiency))), 100]))])));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { waitfor: false });
