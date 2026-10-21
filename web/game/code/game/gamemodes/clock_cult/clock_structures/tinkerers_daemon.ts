// From code/game/gamemodes/clock_cult/clock_structures/tinkerers_daemon.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12157, "/obj/structure/destructible/clockwork/powered/tinkerers_daemon", "/obj/structure/destructible/clockwork/powered", {
	component_id_to_produce: null,
	production_time: 0,
	production_cooldown: 70,
	clockwork_desc: "An efficient machine that can rapidly produce components at a small power cost. It will only function if active daemons are outnumbered by servants at a rate to 5:1.",
	active_icon: "tinkerers_daemon",
	inactive_icon: "tinkerers_daemon",
	unanchored_icon: "tinkerers_daemon_unwrenched",
	construction_value: 20,
	name: "tinkerer's daemon",
	desc: "A strange machine with three small brass obelisks attached to it.",
	icon_state: "tinkerers_daemon",
	max_integrity: 100,
	obj_integrity: 100,
	break_message: "<span class='warning'>The daemon shatters into millions of pieces, leaving only a disc of metal!</span>",
	debris: null,
}, { global: { daemon_glow: 790, component_glow: 791 } });

// /obj/structure/destructible/clockwork/powered/tinkerers_daemon/proc/<init>  (code/game/gamemodes/clock_cult/clock_structures/tinkerers_daemon.dm:14)
rt.def("/obj/structure/destructible/clockwork/powered/tinkerers_daemon/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "debris", rt.alist(f, [T("/obj/item/clockwork/alloy_shards/medium"), 1, T("/obj/item/clockwork/alloy_shards/small"), 6, T("/obj/item/clockwork/component/replicant_alloy/replication_plate"), 1]));
	return f.dot;
});

// /obj/structure/destructible/clockwork/powered/tinkerers_daemon/proc/Destroy  (code/game/gamemodes/clock_cult/clock_structures/tinkerers_daemon.dm:24)  may sleep
rt.def("/obj/structure/destructible/clockwork/powered/tinkerers_daemon/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modGl("active_daemons", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/destructible/clockwork/powered/tinkerers_daemon/proc/examine  (code/game/gamemodes/clock_cult/clock_structures/tinkerers_daemon.dm:28)
rt.def("/obj/structure/destructible/clockwork/powered/tinkerers_daemon/proc/examine", function examine(f: Frame) {
	let i: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any, $5: any, $e: any;
	f.vars = () => [i, $0, $1, $2, $3, $4, $5, $e];
	rt.callSuper(f, [], rt.Args.Same);
	if (!(truthy(rt.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[0])])) || truthy((rt.istype(live(f.args[0]), T("/mob/dead/observer")) ? 1 : 0)))) return f.dot;
	if (truthy(rt.sv(f, "active"))) {
		if (truthy(rt.sv(f, "component_id_to_produce"))) {
			$0 = live(f.args[0]);
			$1 = rt.call(f, P("/proc/get_component_span"), null, [rt.sv(f, "component_id_to_produce")]);
			$2 = rt.call(f, P("/proc/get_component_name"), null, [rt.sv(f, "component_id_to_produce")]);
			if (!isEqual(rt.sv(f, "component_id_to_produce"), "replicant_alloy")) {
				$3 = "s";
			} else {
				$3 = "";
			}
			rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='＀_small'>It is currently producing ＀＀.</span>", [$1, $2, $3])]);
		} else {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='brass'>It is currently producing random components.</span>"]);
		}
	}
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='nezbere_small'>It will produce a component every <b>＀</b> seconds and requires at least the following power for each component type:</span>", [rt.call(f, P("/proc/round"), null, [multiply(multiply(rt.sv(f, "production_cooldown"), 0.10000000149011612), rt.callSrc(f, "get_efficiency_mod", [1])), 0.10000000149011612])])]);
	i = null;
	rt.forList(f, 0, rt.gl("clockwork_component_cache"));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		$0 = live(f.args[0]);
		$1 = rt.call(f, P("/proc/get_component_span"), null, [live(i)]);
		$2 = rt.call(f, P("/proc/get_component_name"), null, [live(i)]);
		$3 = rt.callSrc(f, "get_component_cost", [live(i)]);
		$4 = rt.index(rt.gl("clockwork_component_cache"), live(i));
		if (isEqual(rt.index(rt.gl("clockwork_component_cache"), live(i)), 1)) {
			$5 = "s";
		} else {
			$5 = "";
		}
		rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='＀_small'><i>＀:</i> <b>＀W</b> <i>(＀ exist＀)</i></span>", [$1, $2, $3, $4, $5])]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, false, { args: ["user"] });

// /obj/structure/destructible/clockwork/powered/tinkerers_daemon/proc/forced_disable  (code/game/gamemodes/clock_cult/clock_structures/tinkerers_daemon.dm:42)  may sleep
rt.def("/obj/structure/destructible/clockwork/powered/tinkerers_daemon/proc/forced_disable", function* forced_disable(f: Frame, bad_effects: Value) {
	f.vars = () => [bad_effects];
	if (!truthy(rt.sv(f, "active"))) return f.dot;
	if (truthy(live(bad_effects))) {
		yield* g.srcCall(f, "try_use_power", 100);
		yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ shuts down with a horrible grinding noise!</span>", [live(f.src)]));
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/magic/clockwork/anima_fragment_attack.ogg"), 50, 1]);
	} else {
		yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ shuts down!</span>", [live(f.src)]));
	}
	yield* g.srcCall(f, "toggle");
	return 1;
}, true);

// /obj/structure/destructible/clockwork/powered/tinkerers_daemon/proc/attack_hand  (code/game/gamemodes/clock_cult/clock_structures/tinkerers_daemon.dm:51)  may sleep
rt.def("/obj/structure/destructible/clockwork/powered/tinkerers_daemon/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let min_power_usable: Value = null, i: Value = null, servants: Value = null, L: Value = null, choice: Value = null, components: Value = null, i_4: Value = null, input_component: Value = null, L_5: Value = null, L_3: Value = null;
	let $0: any, $e: any;
	f.vars = () => [user, min_power_usable, i, servants, L, choice, components, i_4, input_component, L_5, L_3, $0, $e];
	if (!truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(user)])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You place your hand on the daemon, but nothing happens.</span>"]);
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "active"))) {
		yield* g.srcCall(f, "toggle", 0, live(user));
	} else {
		if (!truthy(rt.sv(f, "anchored"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ needs to be secured to the floor before it can be activated!</span>", [live(f.src)])]);
			return 0;
		}
		if (!truthy(rt.gl("clockwork_caches"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='nezbere'>\"You require a cache for this daemon to operate. Get to it.\"</span>"]);
			return live(f.dot);
		}
		min_power_usable = 0;
		i = null;
		rt.forList(f, 0, rt.gl("clockwork_component_cache"));
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			if (!truthy(live(min_power_usable))) {
				min_power_usable = (yield* g.srcCall(f, "get_component_cost", live(i)));
			} else {
				min_power_usable = (yield* g.call(f, P("/proc/min"), null, [live(min_power_usable), (yield* g.srcCall(f, "get_component_cost", live(i)))]));
			}
		}
		rt.endFor(f, 0);
		if (rt.lt((yield* g.srcCall(f, "total_accessable_power")), live(min_power_usable))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='nezbere'>\"You need more power to activate this daemon, friend.\"</span>"]);
			return live(f.dot);
		}
		servants = 0;
		L = null;
		rt.forList(f, 0, rt.gl("living_mob_list"), T("/mob/living"));
		while (($e = rt.next(f, 0)) !== undefined) {
			L = $e;
			if (truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(L)])))) {
				servants = rt.inc(live(servants), 1);
			}
		}
		rt.endFor(f, 0);
		if (rt.lt(multiply(live(servants), 0.20000000298023224), 1)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='nezbere'>\"There are too few servants for daemons to work.\"</span>"]);
			return live(f.dot);
		}
		$0 = (choice = (yield* g.call(f, P("/proc/alert"), null, [live(user), "Activate Daemon...", null, "Specific Component", "Random Component", "Cancel"])));
		if ($0 === "Specific Component") {
			components = rt.list();
			i_4 = null;
			rt.forList(f, 0, rt.gl("clockwork_component_cache"));
			while (($e = rt.next(f, 0)) !== undefined) {
				i_4 = $e;
				rt.setAt(live(components), fmt("＀ (＀W)", [(yield* g.call(f, P("/proc/get_component_name"), null, [live(i_4)])), (yield* g.srcCall(f, "get_component_cost", live(i_4)))]), live(i_4));
			}
			rt.endFor(f, 0);
			input_component = (yield* g.op(f, "Prompt", [1], [null, rt.sv(f, "name"), "Choose a component type.", live(user), live(components)]));
			rt.setSv(f, "component_id_to_produce", rt.index(live(components), live(input_component)));
			servants = 0;
			L_5 = null;
			rt.forList(f, 0, rt.gl("living_mob_list"), T("/mob/living"));
			while (($e = rt.next(f, 0)) !== undefined) {
				L_5 = $e;
				if (truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(L_5)])))) {
					servants = rt.inc(live(servants), 1);
				}
			}
			rt.endFor(f, 0);
			if (((((!truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(user)]))) || !truthy((yield* g.callName(f, live(user), "canUseTopic", [live(f.src), (!truthy((rt.istype(live(user), T("/mob/living/silicon")) ? 1 : 0)) ? 1 : 0), 1])))) || truthy(rt.sv(f, "active"))) || !truthy(rt.gl("clockwork_caches"))) || rt.lt(multiply(live(servants), 0.20000000298023224), 1))) {
				return live(f.dot);
			}
			if (!truthy(rt.sv(f, "component_id_to_produce"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You decide not to select a component and activate the daemon.</span>"]);
				return live(f.dot);
			}
			if (rt.lt((yield* g.srcCall(f, "total_accessable_power")), (yield* g.srcCall(f, "get_component_cost", rt.sv(f, "component_id_to_produce"))))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>There is too little power to produce this type of component!</span>"]);
				return live(f.dot);
			}
			yield* g.srcCall(f, "toggle", 0, live(user));
		} else if ($0 === "Random Component") {
			rt.setSv(f, "component_id_to_produce", null);
			servants = 0;
			L_3 = null;
			rt.forList(f, 0, rt.gl("living_mob_list"), T("/mob/living"));
			while (($e = rt.next(f, 0)) !== undefined) {
				L_3 = $e;
				if (truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(L_3)])))) {
					servants = rt.inc(live(servants), 1);
				}
			}
			rt.endFor(f, 0);
			if (((((!truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(user)]))) || !truthy((yield* g.callName(f, live(user), "canUseTopic", [live(f.src), (!truthy((rt.istype(live(user), T("/mob/living/silicon")) ? 1 : 0)) ? 1 : 0), 1])))) || truthy(rt.sv(f, "active"))) || !truthy(rt.gl("clockwork_caches"))) || rt.lt(multiply(live(servants), 0.20000000298023224), 1))) {
				return live(f.dot);
			}
			yield* g.srcCall(f, "toggle", 0, live(user));
		}
	}
	return f.dot;
}, true);

// /obj/structure/destructible/clockwork/powered/tinkerers_daemon/proc/toggle  (code/game/gamemodes/clock_cult/clock_structures/tinkerers_daemon.dm:111)
rt.def("/obj/structure/destructible/clockwork/powered/tinkerers_daemon/proc/toggle", function toggle(f: Frame) {
	let component_color: Value = null;
	let $0: any, $1: any;
	f.vars = () => [component_color, $0, $1];
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "active"))) {
		rt.modGl("active_daemons", live(f.src), add);
		component_color = rt.call(f, P("/proc/get_component_color"), null, [rt.sv(f, "component_id_to_produce")]);
		rt.setFv(f, "color", rt.gl("daemon_glow"), live(component_color));
		rt.callSrc(f, "add_overlay", [rt.gl("daemon_glow")]);
		$0 = rt.gl("component_glow");
		if (truthy(rt.sv(f, "component_id_to_produce"))) {
			$1 = rt.sv(f, "component_id_to_produce");
		} else {
			$1 = "random_component";
		}
		rt.setFv(f, "icon_state", $0, fmt("t_＀", [$1]));
		rt.setFv(f, "color", rt.gl("component_glow"), live(component_color));
		rt.callSrc(f, "add_overlay", [rt.gl("component_glow")]);
		rt.setSv(f, "production_time", add(rt.worldTime(f), rt.sv(f, "production_cooldown")));
		rt.callSrc(f, "set_light", [2, 0.8999999761581421, rt.call(f, P("/proc/get_component_color_bright"), null, [rt.sv(f, "component_id_to_produce")])]);
	} else {
		(rt.modGl("active_daemons", live(f.src), subtract));
		rt.callSrc(f, "cut_overlays", []);
		rt.callSrc(f, "set_light", [0]);
	}
	return f.dot;
}, false, { args: ["fast_process", "user"] });

// /obj/structure/destructible/clockwork/powered/tinkerers_daemon/proc/get_component_cost  (code/game/gamemodes/clock_cult/clock_structures/tinkerers_daemon.dm:128)
rt.def("/obj/structure/destructible/clockwork/powered/tinkerers_daemon/proc/get_component_cost", function get_component_cost(f: Frame, id: Value) {
	return rt.call(f, P("/proc/max"), null, [50, multiply(50, add(1, rt.call(f, P("/proc/round"), null, [multiply(rt.index(rt.gl("clockwork_component_cache"), live(id)), 0.20000000298023224)])))]);
});

// /obj/structure/destructible/clockwork/powered/tinkerers_daemon/proc/process  (code/game/gamemodes/clock_cult/clock_structures/tinkerers_daemon.dm:132)  may sleep
rt.def("/obj/structure/destructible/clockwork/powered/tinkerers_daemon/proc/process", function* process(f: Frame) {
	let servants: Value = null, L: Value = null, D: Value = null, min_power_usable: Value = null, i: Value = null, component_to_generate: Value = null, i_3: Value = null;
	let $e: any;
	f.vars = () => [servants, L, D, min_power_usable, i, component_to_generate, i_3, $e];
	servants = 0;
	L = null;
	rt.forList(f, 0, rt.gl("living_mob_list"), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if (truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(L)])))) {
			servants = rt.inc(live(servants), 1);
		}
	}
	rt.endFor(f, 0);
	while (rt.lt(multiply(live(servants), 0.20000000298023224), rt.length(rt.gl("active_daemons")))) {
		if (!truthy((rt.istype((D = rt.index(rt.gl("active_daemons"), 1)), T("/obj/structure/destructible/clockwork/powered/tinkerers_daemon")) ? 1 : 0))) {
			break;
		}
		if (truthy(rt.fv(f, "active", live(D)))) {
			yield* g.callName(f, live(D), "forced_disable", [0]);
			if (isEqual(live(D), live(f.src))) {
				return live(f.dot);
			}
		}
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	min_power_usable = 0;
	if (!truthy(rt.sv(f, "component_id_to_produce"))) {
		i = null;
		rt.forList(f, 0, rt.gl("clockwork_component_cache"));
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			if (!truthy(live(min_power_usable))) {
				min_power_usable = (yield* g.srcCall(f, "get_component_cost", live(i)));
			} else {
				min_power_usable = (yield* g.call(f, P("/proc/min"), null, [live(min_power_usable), (yield* g.srcCall(f, "get_component_cost", live(i)))]));
			}
		}
		rt.endFor(f, 0);
	} else {
		min_power_usable = (yield* g.srcCall(f, "get_component_cost", rt.sv(f, "component_id_to_produce")));
	}
	if ((!truthy(rt.gl("clockwork_caches")) || rt.lt(live(f.dot), live(min_power_usable)))) {
		yield* g.srcCall(f, "forced_disable", 0);
		return live(f.dot);
	}
	if (!rt.le(rt.sv(f, "production_time"), rt.worldTime(f))) return f.dot;
	if (!truthy((component_to_generate = rt.sv(f, "component_id_to_produce")))) {
		component_to_generate = (yield* g.call(f, P("/proc/get_weighted_component_id"), null, []));
	}
	if (!truthy((yield* g.srcCall(f, "try_use_power", (yield* g.srcCall(f, "get_component_cost", live(component_to_generate))))))) {
		component_to_generate = null;
		if (!truthy(rt.sv(f, "component_id_to_produce"))) {
			i_3 = null;
			rt.forList(f, 0, rt.gl("clockwork_component_cache"));
			while (($e = rt.next(f, 0)) !== undefined) {
				i_3 = $e;
				if (truthy((yield* g.srcCall(f, "try_use_power", (yield* g.srcCall(f, "get_component_cost", live(i_3))))))) {
					component_to_generate = live(i_3);
					break;
				}
			}
			rt.endFor(f, 0);
		}
	}
	if (truthy(live(component_to_generate))) {
		yield* g.call(f, P("/proc/generate_cache_component"), null, [live(component_to_generate), live(f.src)]);
		rt.setSv(f, "production_time", add(rt.worldTime(f), multiply(rt.sv(f, "production_cooldown"), (yield* g.srcCall(f, "get_efficiency_mod", 1)))));
		yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ hums as it produces a </span><span class='＀'>component</span><span class='warning'>.</span>", [live(f.src), (yield* g.call(f, P("/proc/get_component_span"), null, [live(component_to_generate)]))]));
	} else {
		yield* g.srcCall(f, "forced_disable", 0);
	}
	return f.dot;
}, true, { waitfor: false });
