// From code/game/gamemodes/clock_cult/clock_structures/prolonging_prism.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12156, "/obj/structure/destructible/clockwork/powered/prolonging_prism", "/obj/structure/destructible/clockwork/powered", {
	clockwork_desc: "A powerful prism that will delay the arrival of an emergency shuttle.",
	active_icon: "prolonging_prism",
	inactive_icon: "prolonging_prism_inactive",
	unanchored_icon: "prolonging_prism_unwrenched",
	construction_value: 20,
	name: "prolonging prism",
	desc: "A dark onyx prism, held in midair by spiraling tendrils of stone.",
	icon_state: "prolonging_prism_inactive",
	max_integrity: 125,
	obj_integrity: 125,
	break_message: "<span class='warning'>The prism falls to the ground with a heavy thud!</span>",
	debris: null,
}, { global: { component_refund: 785, delay_cost: 786, delay_cost_increase: 787, delay_remaining: 788 } });

// /obj/structure/destructible/clockwork/powered/prolonging_prism/proc/<init>  (code/game/gamemodes/clock_cult/clock_structures/prolonging_prism.dm:14)
rt.def("/obj/structure/destructible/clockwork/powered/prolonging_prism/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "debris", rt.alist(f, [T("/obj/item/clockwork/alloy_shards/small"), 3, T("/obj/item/clockwork/alloy_shards/medium"), 1, T("/obj/item/clockwork/alloy_shards/large"), 1, T("/obj/item/clockwork/component/vanguard_cogwheel/onyx_prism"), 1]));
	return f.dot;
});

// /obj/structure/destructible/clockwork/powered/prolonging_prism/proc/examine  (code/game/gamemodes/clock_cult/clock_structures/prolonging_prism.dm:24)
rt.def("/obj/structure/destructible/clockwork/powered/prolonging_prism/proc/examine", function examine(f: Frame) {
	let efficiency: Value = null;
	f.vars = () => [efficiency];
	rt.callSuper(f, [], rt.Args.Same);
	if (!(truthy(rt.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[0])])) || truthy((rt.istype(live(f.args[0]), T("/mob/dead/observer")) ? 1 : 0)))) return f.dot;
	if ((((isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "docked") || isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "igniting")) || isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "stranded")) || isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "escape"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='inathneq'>An emergency shuttle has arrived and this prism is no longer useful; attempt to activate it to gain a partial refund of components used.</span>"]);
	} else {
		efficiency = rt.callSrc(f, "get_efficiency_mod", [1]);
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='inathneq_small'>It requires at least <b>＀W</b> of power to attempt to delay the arrival of an emergency shuttle by <b>＀</b> minutes.</span>", [rt.callSrc(f, "get_delay_cost", []), multiply(2, live(efficiency))])]);
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='inathneq_small'>This cost increases by <b>＀W</b> for every <b>10 CV</b> and <b>＀W</b> for every previous activation.</span>", [multiply(rt.gl("delay_cost_increase"), 0.10000000149011612), rt.gl("delay_cost_increase")])]);
	}
	return f.dot;
}, false, { args: ["user"] });

// /obj/structure/destructible/clockwork/powered/prolonging_prism/proc/forced_disable  (code/game/gamemodes/clock_cult/clock_structures/prolonging_prism.dm:36)  may sleep
rt.def("/obj/structure/destructible/clockwork/powered/prolonging_prism/proc/forced_disable", function* forced_disable(f: Frame, bad_effects: Value) {
	f.vars = () => [bad_effects];
	if (!truthy(rt.sv(f, "active"))) return f.dot;
	if (truthy(live(bad_effects))) {
		yield* g.srcCall(f, "try_use_power", 100);
	}
	yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ emits an airy chuckling sound and falls dark!</span>", [live(f.src)]));
	yield* g.srcCall(f, "toggle");
	return 1;
}, true);

// /obj/structure/destructible/clockwork/powered/prolonging_prism/proc/attack_hand  (code/game/gamemodes/clock_cult/clock_structures/prolonging_prism.dm:42)  may sleep
rt.def("/obj/structure/destructible/clockwork/powered/prolonging_prism/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let i: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [user, i, _T, $e];
	if (!(truthy((yield* g.callName(f, live(user), "canUseTopic", [live(f.src), (!truthy((rt.istype(live(user), T("/mob/living/silicon")) ? 1 : 0)) ? 1 : 0), 1]))) && truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(user)]))))) return f.dot;
	if ((((isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "docked") || isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "igniting")) || isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "stranded")) || isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "escape"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='brass'>You break ＀ apart, refunding some of the components used.</span>", [live(f.src)])]);
		i = null;
		rt.forList(f, 0, rt.gl("component_refund"));
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			yield* g.call(f, P("/proc/generate_cache_component"), null, [live(i), live(f.src)]);
		}
		rt.endFor(f, 0);
		yield* g.srcCall(f, "take_damage", rt.sv(f, "max_integrity"));
		return 0;
	}
	if (truthy(rt.sv(f, "active"))) {
		return 0;
	}
	if ((!truthy((_T = rt.getStep(f, live(f.src), 0))) || !isEqual(rt.fv(f, "z", live(_T)), 2))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ must be on the station to function!</span>", [live(f.src)])]);
		return 0;
	}
	if (!isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "call")) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>No emergency shuttles are attempting to arrive at the station!</span>"]);
		return 0;
	}
	if (!truthy((yield* g.srcCall(f, "try_use_power", (yield* g.srcCall(f, "get_delay_cost")))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ needs more power to function!</span>", [live(f.src)])]);
		return 0;
	}
	rt.modGl("delay_cost", rt.gl("delay_cost_increase"), add);
	rt.modGl("delay_remaining", 1200, add);
	yield* g.srcCall(f, "toggle", 0, live(user));
	return f.dot;
}, true);

// /obj/structure/destructible/clockwork/powered/prolonging_prism/proc/process  (code/game/gamemodes/clock_cult/clock_structures/prolonging_prism.dm:66)  may sleep
rt.def("/obj/structure/destructible/clockwork/powered/prolonging_prism/proc/process", function* process(f: Frame) {
	let own_turf: Value = null, delay_amount: Value = null, efficiency: Value = null, highest_y: Value = null, highest_x: Value = null, lowest_y: Value = null, lowest_x: Value = null, prism_turfs: Value = null, t: Value = null, _T: Value = null, mean_y: Value = null, mean_x: Value = null, semi_random_center_turf: Value = null, t_11: Value = null, placement_style: Value = null, t_12: Value = null, _T_13: Value = null;
	let $e: any;
	f.vars = () => [own_turf, delay_amount, efficiency, highest_y, highest_x, lowest_y, lowest_x, prism_turfs, t, _T, mean_y, mean_x, semi_random_center_turf, t_11, placement_style, t_12, _T_13, $e];
	own_turf = rt.getStep(f, live(f.src), 0);
	if ((((!isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "call") || rt.le(rt.gl("delay_remaining"), 0)) || !truthy(live(own_turf))) || !isEqual(rt.fv(f, "z", live(own_turf)), 2))) {
		yield* g.srcCall(f, "forced_disable", 0);
		return live(f.dot);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	(rt.modGl("delay_remaining", (delay_amount = 40), subtract));
	efficiency = (yield* g.srcCall(f, "get_efficiency_mod"));
	yield* g.callName(f, rt.fv(f, "emergency", rt.gl("SSshuttle")), "setTimer", [add((yield* g.callName(f, rt.fv(f, "emergency", rt.gl("SSshuttle")), "timeLeft", [1])), multiply(live(delay_amount), live(efficiency)))]);
	highest_y = null;
	highest_x = null;
	lowest_y = null;
	lowest_x = null;
	prism_turfs = rt.list();
	t = null;
	rt.forList(f, 0, (yield* g.callName(f, rt.fv(f, "emergency", rt.gl("SSshuttle")), "ripple_area", [(yield* g.callName(f, rt.gl("SSshuttle"), "getDock", ["emergency_home"]))])));
	while (($e = rt.next(f, 0)) !== undefined) {
		t = $e;
		rt.setAt(live(prism_turfs), live(t), 1);
		_T = live(t);
		if ((!truthy(live(highest_y)) || rt.gt(rt.fv(f, "y", live(_T)), live(highest_y)))) {
			highest_y = rt.fv(f, "y", live(_T));
		}
		if ((!truthy(live(highest_x)) || rt.gt(rt.fv(f, "x", live(_T)), live(highest_x)))) {
			highest_x = rt.fv(f, "x", live(_T));
		}
		if ((!truthy(live(lowest_y)) || rt.lt(rt.fv(f, "y", live(_T)), live(lowest_y)))) {
			lowest_y = rt.fv(f, "y", live(_T));
		}
		if ((!truthy(live(lowest_x)) || rt.lt(rt.fv(f, "x", live(_T)), live(lowest_x)))) {
			lowest_x = rt.fv(f, "x", live(_T));
		}
	}
	rt.endFor(f, 0);
	mean_y = (yield* g.call(f, P("/proc/Lerp"), null, [live(lowest_y), live(highest_y)]));
	mean_x = (yield* g.call(f, P("/proc/Lerp"), null, [live(lowest_x), live(highest_x)]));
	if (truthy(rt.op(f, "Prob", [], [50]))) {
		mean_y = (yield* g.call(f, P("/proc/Ceiling"), null, [live(mean_y)]));
	} else {
		mean_y = (yield* g.call(f, P("/proc/Floor"), null, [live(mean_y)]));
	}
	if (truthy(rt.op(f, "Prob", [], [50]))) {
		mean_x = (yield* g.call(f, P("/proc/Ceiling"), null, [live(mean_x)]));
	} else {
		mean_x = (yield* g.call(f, P("/proc/Floor"), null, [live(mean_x)]));
	}
	semi_random_center_turf = rt.locate(live(mean_x), live(mean_y), 2);
	t_11 = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/getline"), null, [live(f.src), live(semi_random_center_turf)])));
	while (($e = rt.next(f, 0)) !== undefined) {
		t_11 = $e;
		rt.setAt(live(prism_turfs), live(t_11), 1);
	}
	rt.endFor(f, 0);
	placement_style = rt.op(f, "Prob", [], [50]);
	t_12 = null;
	rt.forList(f, 0, live(prism_turfs));
	while (($e = rt.next(f, 0)) !== undefined) {
		t_12 = $e;
		_T_13 = live(t_12);
		if (truthy(live(placement_style))) {
			if (truthy((yield* g.call(f, P("/proc/IsOdd"), null, [add(rt.fv(f, "x", live(_T_13)), rt.fv(f, "y", live(_T_13)))])))) {
				yield* g.srcCall(f, "seven_random_hexes", live(_T_13), live(efficiency));
			} else {
				if (truthy(rt.op(f, "Prob", [], [multiply(50, live(efficiency))]))) {
					yield* g.new_(f, T("/obj/effect/temp_visual/ratvar/prolonging_prism"), [live(_T_13)]);
				}
			}
		} else {
			if (truthy((yield* g.call(f, P("/proc/IsEven"), null, [add(rt.fv(f, "x", live(_T_13)), rt.fv(f, "y", live(_T_13)))])))) {
				yield* g.srcCall(f, "seven_random_hexes", live(_T_13), live(efficiency));
			} else {
				if (truthy(rt.op(f, "Prob", [], [multiply(50, live(efficiency))]))) {
					yield* g.new_(f, T("/obj/effect/temp_visual/ratvar/prolonging_prism"), [live(_T_13)]);
				}
			}
		}
		if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
			yield* g.call(f, P("/proc/stoplag"), null, []);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { waitfor: false });

// /obj/structure/destructible/clockwork/powered/prolonging_prism/proc/get_delay_cost  (code/game/gamemodes/clock_cult/clock_structures/prolonging_prism.dm:120)
rt.def("/obj/structure/destructible/clockwork/powered/prolonging_prism/proc/get_delay_cost", function get_delay_cost(f: Frame) {
	return rt.call(f, P("/proc/Floor"), null, [add(multiply(multiply(rt.gl("clockwork_construction_value"), rt.gl("delay_cost_increase")), 0.009999999776482582), rt.gl("delay_cost")), 25]);
});

// /obj/structure/destructible/clockwork/powered/prolonging_prism/proc/seven_random_hexes  (code/game/gamemodes/clock_cult/clock_structures/prolonging_prism.dm:125)  may sleep
rt.def("/obj/structure/destructible/clockwork/powered/prolonging_prism/proc/seven_random_hexes", function* seven_random_hexes(f: Frame, _T: Value, efficiency: Value) {
	let hex_combo: Value = null, n: Value = null;
	let $e: any;
	f.vars = () => [_T, efficiency, hex_combo, n, $e];
	hex_combo = null;
	n = null;
	rt.forList(f, 0, rt.gl("hex_states"));
	while (($e = rt.next(f, 0)) !== undefined) {
		n = $e;
		if (truthy(rt.op(f, "Prob", [], [multiply(50, live(efficiency))]))) {
			if (!truthy(live(hex_combo))) {
				hex_combo = (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/effects/64x64.dmi"), live(n), 5.099999904632568]));
			} else {
				rt.modField(f, live(hex_combo), "overlays", (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/effects/64x64.dmi"), live(n), 5.099999904632568])), add);
			}
		}
	}
	rt.endFor(f, 0);
	if (!truthy(live(hex_combo))) return f.dot;
	rt.setFv(f, "pixel_x", live(hex_combo), -16);
	rt.setFv(f, "pixel_y", live(hex_combo), -16);
	rt.setFv(f, "mouse_opacity", live(hex_combo), 0);
	rt.setFv(f, "plane", live(hex_combo), 0);
	yield* g.new_(f, T("/obj/effect/temp_visual/ratvar/prolonging_prism"), [live(_T), live(hex_combo)]);
	return f.dot;
}, true);
