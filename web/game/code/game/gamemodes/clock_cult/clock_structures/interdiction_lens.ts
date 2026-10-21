// From code/game/gamemodes/clock_cult/clock_structures/interdiction_lens.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12154, "/obj/structure/destructible/clockwork/powered/interdiction_lens", "/obj/structure/destructible/clockwork/powered", {
	recharging: 0,
	recharge_time: 1200,
	disabled: 0,
	interdiction_range: 14,
	clockwork_desc: "A powerful totem that constantly drains nearby electronics and funnels the power drained into nearby Sigils of Transmission or the area's APC.",
	construction_value: 20,
	active_icon: "interdiction_lens_active",
	inactive_icon: "interdiction_lens",
	unanchored_icon: "interdiction_lens_unwrenched",
	name: "interdiction lens",
	desc: "An ominous, double-pronged brass totem. There's a strange gemstone clasped between the pincers.",
	icon_state: "interdiction_lens",
	break_message: "<span class='warning'>The lens flares a blinding violet before the totem beneath it shatters!</span>",
	break_sound: rt.rsc("sound/effects/glassbr3.ogg"),
	debris: null,
}, { global: { rage_messages: 784 } });

// /obj/structure/destructible/clockwork/powered/interdiction_lens/proc/<init>  (code/game/gamemodes/clock_cult/clock_structures/interdiction_lens.dm:13)
rt.def("/obj/structure/destructible/clockwork/powered/interdiction_lens/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "debris", rt.alist(f, [T("/obj/item/clockwork/alloy_shards/small"), 2, T("/obj/item/clockwork/alloy_shards/large"), 2, T("/obj/item/clockwork/component/belligerent_eye/lens_gem"), 1]));
	return f.dot;
});

// /obj/structure/destructible/clockwork/powered/interdiction_lens/proc/Initialize  (code/game/gamemodes/clock_cult/clock_structures/interdiction_lens.dm:23)
rt.def("/obj/structure/destructible/clockwork/powered/interdiction_lens/proc/Initialize", function Initialize(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "update_current_glow", []);
	return f.dot;
});

// /obj/structure/destructible/clockwork/powered/interdiction_lens/proc/examine  (code/game/gamemodes/clock_cult/clock_structures/interdiction_lens.dm:27)
rt.def("/obj/structure/destructible/clockwork/powered/interdiction_lens/proc/examine", function examine(f: Frame) {
	let $0: any, $1: any, $2: any;
	f.vars = () => [$0, $1, $2];
	rt.callSuper(f, [], rt.Args.Same);
	$0 = live(f.args[0]);
	if (rt.gt(rt.sv(f, "recharging"), rt.worldTime(f))) {
		$1 = "neovgre_small";
	} else {
		$1 = "brass";
	}
	if (rt.gt(rt.sv(f, "recharging"), rt.worldTime(f))) {
		$2 = "has been breached by writhing tendrils of blackness that cover the totem";
	} else {
		$2 = "vibrates in place and thrums with power";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='＀'>Its gemstone ＀.</span>", [$1, $2])]);
	if (!(truthy(rt.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[0])])) || truthy((rt.istype(live(f.args[0]), T("/mob/dead/observer")) ? 1 : 0)))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='neovgre_small'>If it fails to drain any electronics or has nothing to return power to, it will disable itself for <b>＀</b> minutes.</span>", [rt.call(f, P("/proc/round"), null, [divide(rt.sv(f, "recharge_time"), 600), 1])])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/structure/destructible/clockwork/powered/interdiction_lens/proc/update_anchored  (code/game/gamemodes/clock_cult/clock_structures/interdiction_lens.dm:34)  may sleep
rt.def("/obj/structure/destructible/clockwork/powered/interdiction_lens/proc/update_anchored", function* update_anchored(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "update_current_glow");
	return f.dot;
}, true, { args: ["user", "do_damage"] });

// /obj/structure/destructible/clockwork/powered/interdiction_lens/proc/toggle  (code/game/gamemodes/clock_cult/clock_structures/interdiction_lens.dm:38)
rt.def("/obj/structure/destructible/clockwork/powered/interdiction_lens/proc/toggle", function toggle(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "update_current_glow", []);
	return f.dot;
}, false, { args: ["fast_process", "user"] });

// /obj/structure/destructible/clockwork/powered/interdiction_lens/proc/update_current_glow  (code/game/gamemodes/clock_cult/clock_structures/interdiction_lens.dm:44)
rt.def("/obj/structure/destructible/clockwork/powered/interdiction_lens/proc/update_current_glow", function update_current_glow(f: Frame) {
	if (truthy(rt.sv(f, "active"))) {
		if (truthy(rt.sv(f, "disabled"))) {
			rt.callSrc(f, "set_light", [2, 1.600000023841858, "#151200"]);
		} else {
			rt.callSrc(f, "set_light", [2, 1.600000023841858, "#EE54EE"]);
		}
	} else {
		if (truthy(rt.sv(f, "anchored"))) {
			rt.callSrc(f, "set_light", [1.399999976158142, 0.800000011920929, "#F42B9D"]);
		} else {
			rt.callSrc(f, "set_light", [0]);
		}
	}
	return f.dot;
});

// /obj/structure/destructible/clockwork/powered/interdiction_lens/proc/attack_hand  (code/game/gamemodes/clock_cult/clock_structures/interdiction_lens.dm:54)
rt.def("/obj/structure/destructible/clockwork/powered/interdiction_lens/proc/attack_hand", function attack_hand(f: Frame, user: Value) {
	if (!truthy(rt.callName(f, live(user), "canUseTopic", [live(f.src), (!truthy((rt.istype(live(user), T("/mob/living/silicon")) ? 1 : 0)) ? 1 : 0), 1]))) return f.dot;
	if (truthy(rt.sv(f, "disabled"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>As you place your hand on the gemstone, cold tendrils of black matter crawl up your arm. You quickly pull back.</span>"]);
		return 0;
	}
	rt.callSrc(f, "toggle", [0, live(user)]);
	return f.dot;
});

// /obj/structure/destructible/clockwork/powered/interdiction_lens/proc/forced_disable  (code/game/gamemodes/clock_cult/clock_structures/interdiction_lens.dm:61)
rt.def("/obj/structure/destructible/clockwork/powered/interdiction_lens/proc/forced_disable", function forced_disable(f: Frame, bad_effects: Value) {
	if ((truthy(rt.sv(f, "disabled")) || !truthy(rt.sv(f, "anchored")))) {
		return 0;
	}
	if (!truthy(rt.sv(f, "active"))) {
		rt.callSrc(f, "toggle", [0]);
	}
	rt.callSrc(f, "visible_message", ["<span class='warning'>The gemstone suddenly turns horribly dark, writhing tendrils covering it!</span>"]);
	rt.setSv(f, "recharging", add(rt.worldTime(f), rt.sv(f, "recharge_time")));
	rt.call(f, P("/proc/flick"), null, ["interdiction_lens_discharged", live(f.src)]);
	rt.setSv(f, "icon_state", "interdiction_lens_inactive");
	rt.setSv(f, "disabled", 1);
	rt.callSrc(f, "update_current_glow", []);
	return 1;
});

// /obj/structure/destructible/clockwork/powered/interdiction_lens/proc/process  (code/game/gamemodes/clock_cult/clock_structures/interdiction_lens.dm:74)  may sleep
rt.def("/obj/structure/destructible/clockwork/powered/interdiction_lens/proc/process", function* process(f: Frame) {
	let successfulprocess: Value = null, power_drained: Value = null, atoms_to_test: Value = null, A: Value = null, _T: Value = null, M: Value = null, unconverted_ai: Value = null, efficiency: Value = null, rage_modifier: Value = null, i: Value = null, AI: Value = null, M_6: Value = null, A_7: Value = null, C: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [successfulprocess, power_drained, atoms_to_test, A, _T, M, unconverted_ai, efficiency, rage_modifier, i, AI, M_6, A_7, C, O, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (rt.gt(rt.sv(f, "recharging"), rt.worldTime(f))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "disabled"))) {
		yield* g.srcCall(f, "visible_message", "<span class='warning'>The writhing tendrils return to the gemstone, which begins to glow with power!</span>");
		yield* g.call(f, P("/proc/flick"), null, ["interdiction_lens_recharged", live(f.src)]);
		rt.setSv(f, "disabled", 0);
		yield* g.srcCall(f, "toggle", 0);
	} else {
		if (!truthy((yield* g.srcCall(f, "check_apc_and_sigils")))) {
			yield* g.srcCall(f, "forced_disable");
			return live(f.dot);
		}
		successfulprocess = 0;
		power_drained = 0;
		atoms_to_test = rt.list();
		A = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/spiral_range_turfs"), null, [rt.sv(f, "interdiction_range"), live(f.src)])));
		while (($e = rt.next(f, 0)) !== undefined) {
			A = $e;
			_T = live(A);
			M = null;
			rt.forList(f, 1, live(_T));
			while (($e = rt.next(f, 1)) !== undefined) {
				M = $e;
				(atoms_to_test = rt.modify(live(atoms_to_test), live(M), rt.bitOr));
			}
			rt.endFor(f, 1);
			if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
				yield* g.call(f, P("/proc/stoplag"), null, []);
			}
		}
		rt.endFor(f, 0);
		unconverted_ai = 0;
		efficiency = (yield* g.srcCall(f, "get_efficiency_mod"));
		rage_modifier = (yield* g.srcCall(f, "get_efficiency_mod", 1));
		i = null;
		rt.forList(f, 0, rt.gl("ai_list"));
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			if (((truthy((AI = live(i))) && !isEqual(rt.fv(f, "stat", live(AI)), 2)) && !truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(AI)]))))) {
				unconverted_ai = 1;
			}
		}
		rt.endFor(f, 0);
		M_6 = null;
		rt.forList(f, 0, live(atoms_to_test));
		while (($e = rt.next(f, 0)) !== undefined) {
			M_6 = $e;
			if (((!truthy((A_7 = live(M_6))) || (!truthy(live(A_7)) || truthy(rt.fv(f, "gc_destroyed", live(A_7))))) || isEqual(live(A_7), rt.sv(f, "target_apc")))) {
				continue;
			}
			power_drained = rt.modify(live(power_drained), (yield* g.call(f, P("/proc/Floor"), null, [multiply((yield* g.callName(f, live(A_7), "power_drain", [1])), live(efficiency)), 25])), add);
			if (truthy(rt.op(f, "Prob", [], [multiply(1, live(rage_modifier))]))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(A_7), fmt("<span class='neovgre'>\"＀\"</span>", [(yield* g.call(f, P("/proc/text2ratvar"), null, [rt.op(f, "PickUnweighted", [1], [rt.gl("rage_messages")])]))])]);
			}
			if (truthy(rt.op(f, "Prob", [], [multiply(100, multiply(live(efficiency), live(efficiency)))]))) {
				if ((truthy((rt.istype(live(A_7), T("/obj/machinery/camera")) ? 1 : 0)) && truthy(live(unconverted_ai)))) {
					if ((truthy((yield* g.callName(f, (C = live(A_7)), "isEmpProof", []))) || !truthy(rt.fv(f, "status", live(C))))) {
						continue;
					}
					successfulprocess = 1;
					if (truthy(rt.fv(f, "emped", live(C)))) {
						continue;
					}
					yield* g.callName(f, live(C), "emp_act", [1]);
				} else {
					if (truthy((rt.istype(live(A_7), T("/obj/item/device/radio")) ? 1 : 0))) {
						O = live(A_7);
						successfulprocess = 1;
						if ((truthy(rt.fv(f, "emped", live(O))) || !truthy(rt.fv(f, "on", live(O))))) {
							continue;
						}
						yield* g.callName(f, live(O), "emp_act", [1]);
					} else {
						if ((((truthy((rt.istype(live(A_7), T("/mob/living")) ? 1 : 0)) && !truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(A_7)])))) || truthy((rt.istype(live(A_7), T("/obj/structure/closet")) ? 1 : 0))) || truthy((rt.istype(live(A_7), T("/obj/item/weapon/storage")) ? 1 : 0)))) {
							O = null;
							rt.forList(f, 1, (yield* g.callName(f, live(A_7), "GetAllContents", [])), T("/obj/item/device/radio"));
							while (($e = rt.next(f, 1)) !== undefined) {
								O = $e;
								successfulprocess = 1;
								if ((truthy(rt.fv(f, "emped", live(O))) || !truthy(rt.fv(f, "on", live(O))))) {
									continue;
								}
								yield* g.callName(f, live(O), "emp_act", [1]);
							}
							rt.endFor(f, 1);
						}
					}
				}
			}
			if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
				yield* g.call(f, P("/proc/stoplag"), null, []);
			}
		}
		rt.endFor(f, 0);
		if (((truthy(live(power_drained)) && rt.ge(live(power_drained), 25)) && truthy((yield* g.srcCall(f, "return_power", live(power_drained)))))) {
			successfulprocess = 1;
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/items/pshoom.ogg"), multiply(50, live(efficiency)), 1, subtract(rt.sv(f, "interdiction_range"), 7), 1]);
		}
		if (truthy(live(successfulprocess))) return f.dot;
		yield* g.srcCall(f, "forced_disable");
	}
	return f.dot;
}, true, { waitfor: false });
