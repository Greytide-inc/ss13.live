// From code/game/gamemodes/clock_cult/clock_structures/tinkerers_cache.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12164, "/obj/structure/destructible/clockwork/cache", "/obj/structure/destructible/clockwork", {
	wall_generation_cooldown: null,
	linkedwall: null,
	clockwork_desc: "A brass container capable of storing a large amount of components.\nShares components with all other caches and will gradually generate components if near a Clockwork Wall.",
	unanchored_icon: "tinkerers_cache_unwrenched",
	construction_value: 10,
	light_color: "#C2852F",
	name: "tinkerer's cache",
	desc: "A large brass spire with a flaming hole in its center.",
	icon_state: "tinkerers_cache",
	break_message: "<span class='warning'>The cache's fire winks out before it falls in on itself!</span>",
	max_integrity: 80,
	obj_integrity: 80,
}, { global: { linked_caches: 792 } });

// /obj/structure/destructible/clockwork/cache/proc/Initialize  (code/game/gamemodes/clock_cult/clock_structures/tinkerers_cache.dm:19)  may sleep
rt.def("/obj/structure/destructible/clockwork/cache/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
		rt.setFv(f, "isprocessing", live(f.src), 1);
		rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	}
	rt.incGl("clockwork_caches", 1, true);
	yield* g.call(f, P("/proc/update_slab_info"), null, []);
	yield* g.srcCall(f, "set_light", 2, 0.699999988079071);
	return f.dot;
}, true);

// /obj/structure/destructible/clockwork/cache/proc/Destroy  (code/game/gamemodes/clock_cult/clock_structures/tinkerers_cache.dm:26)  may sleep
rt.def("/obj/structure/destructible/clockwork/cache/proc/Destroy", function* Destroy(f: Frame) {
	rt.incGl("clockwork_caches", -1, true);
	yield* g.call(f, P("/proc/update_slab_info"), null, []);
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	if (truthy(rt.sv(f, "linkedwall"))) {
		rt.incGl("linked_caches", -1, true);
		rt.setFv(f, "linkedcache", rt.sv(f, "linkedwall"), null);
		rt.setSv(f, "linkedwall", null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/destructible/clockwork/cache/proc/process  (code/game/gamemodes/clock_cult/clock_structures/tinkerers_cache.dm:36)  may sleep
rt.def("/obj/structure/destructible/clockwork/cache/proc/process", function* process(f: Frame) {
	let C: Value = null, component_id: Value = null;
	let $e: any;
	f.vars = () => [C, component_id, $e];
	if (!truthy(rt.sv(f, "anchored"))) {
		if (truthy(rt.sv(f, "linkedwall"))) {
			rt.incGl("linked_caches", -1, true);
			rt.setFv(f, "linkedcache", rt.sv(f, "linkedwall"), null);
			rt.setSv(f, "linkedwall", null);
		}
		return live(f.dot);
	}
	C = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [4, live(f.src)])), T("/turf/closed/wall/clockwork"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		if ((!truthy(rt.fv(f, "linkedcache", live(C))) && !truthy(rt.sv(f, "linkedwall")))) {
			rt.incGl("linked_caches", 1, true);
			rt.setFv(f, "linkedcache", live(C), live(f.src));
			rt.setSv(f, "linkedwall", live(C));
			rt.setSv(f, "wall_generation_cooldown", add(rt.worldTime(f), (yield* g.srcCall(f, "get_production_time"))));
			yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ starts to whirr in the presence of ＀...</span>", [live(f.src), live(C)]));
			break;
		}
	}
	rt.endFor(f, 0);
	if (!(truthy(rt.sv(f, "linkedwall")) && rt.le(rt.sv(f, "wall_generation_cooldown"), rt.worldTime(f)))) return f.dot;
	rt.setSv(f, "wall_generation_cooldown", add(rt.worldTime(f), (yield* g.srcCall(f, "get_production_time"))));
	component_id = (yield* g.call(f, P("/proc/generate_cache_component"), null, [null, live(f.src)]));
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "linkedwall"), rt.rsc("sound/magic/clockwork/fellowship_armory.ogg"), (yield* g.call(f, P("/proc/rand"), null, [15, 20])), 1, -3, 1, 1]);
	yield* g.srcCall(f, "visible_message", fmt("<span class='＀'>Something</span><span class='warning'> cl＀s around inside of ＀...</span>", [(yield* g.call(f, P("/proc/get_component_span"), null, [live(component_id)])), rt.op(f, "PickUnweighted", [4], ["ank", "ink", "unk", "ang"]), live(f.src)]));
	return f.dot;
}, true, { waitfor: false });

// /obj/structure/destructible/clockwork/cache/proc/attackby  (code/game/gamemodes/clock_cult/clock_structures/tinkerers_cache.dm:57)  may sleep
rt.def("/obj/structure/destructible/clockwork/cache/proc/attackby", function* attackby(f: Frame) {
	let C: Value = null, S: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [C, S, i, $e];
	if (!truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[1])])))) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/clockwork/component")) ? 1 : 0))) {
		C = live(f.args[0]);
		if (!truthy(rt.sv(f, "anchored"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ needs to be secured to place ＀ into it!</span>", [live(f.src), live(C)])]);
		} else {
			rt.incAt(rt.gl("clockwork_component_cache"), rt.fv(f, "component_id", live(C)), 1, true);
			yield* g.call(f, P("/proc/update_slab_info"), null, []);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You add ＀ to ＀.</span>", [live(C), live(f.src)])]);
			yield* g.callName(f, live(f.args[1]), "drop_item", []);
			yield* g.call(f, P("/proc/qdel"), null, [live(C)]);
		}
		return 1;
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/clockwork/slab")) ? 1 : 0))) {
			S = live(f.args[0]);
			if (!truthy(rt.sv(f, "anchored"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ needs to be secured to offload your slab's components into it!</span>", [live(f.src)])]);
			} else {
				i = null;
				rt.forList(f, 0, rt.fv(f, "stored_components", live(S)));
				while (($e = rt.next(f, 0)) !== undefined) {
					i = $e;
					rt.modAt(rt.gl("clockwork_component_cache"), live(i), rt.index(rt.fv(f, "stored_components", live(S)), live(i)), add);
					rt.setAt(rt.fv(f, "stored_components", live(S)), live(i), 0);
				}
				rt.endFor(f, 0);
				yield* g.call(f, P("/proc/update_slab_info"), null, []);
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ empties ＀ into ＀.</span>", [live(f.args[1]), live(S), live(f.src)]), fmt("<span class='notice'>You offload your slab's components into ＀.</span>", [live(f.src)])]);
			}
			return 1;
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/structure/destructible/clockwork/cache/proc/update_anchored  (code/game/gamemodes/clock_cult/clock_structures/tinkerers_cache.dm:85)  may sleep
rt.def("/obj/structure/destructible/clockwork/cache/proc/update_anchored", function* update_anchored(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "anchored"))) {
		yield* g.srcCall(f, "set_light", 2, 0.699999988079071);
	} else {
		yield* g.srcCall(f, "set_light", 0);
	}
	return f.dot;
}, true, { args: ["user", "do_damage"] });

// /obj/structure/destructible/clockwork/cache/proc/attack_hand  (code/game/gamemodes/clock_cult/clock_structures/tinkerers_cache.dm:92)  may sleep
rt.def("/obj/structure/destructible/clockwork/cache/proc/attack_hand", function* attack_hand(f: Frame) {
	let temp_time: Value = null;
	let $0: any, $1: any, $2: any, $3: any;
	f.vars = () => [temp_time, $0, $1, $2, $3];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[0])])))) return f.dot;
	if (truthy(rt.sv(f, "linkedwall"))) {
		if (rt.gt(rt.sv(f, "wall_generation_cooldown"), rt.worldTime(f))) {
			temp_time = multiply(subtract(rt.sv(f, "wall_generation_cooldown"), rt.worldTime(f)), 0.10000000149011612);
			$0 = live(f.args[0]);
			$1 = live(f.src);
			$2 = live(temp_time);
			if (isEqual(live(temp_time), 1)) {
				$3 = "";
			} else {
				$3 = "s";
			}
			yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='alloy'>＀ will produce a component in <b>＀</b> second＀.</span>", [$1, $2, $3])]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='brass'>＀ is about to produce a component!</span>", [live(f.src)])]);
		}
	} else {
		if (truthy(rt.sv(f, "anchored"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='alloy'>＀ is unlinked! Construct a Clockwork Wall nearby to generate components!</span>", [live(f.src)])]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='alloy'>＀ needs to be secured to generate components!</span>", [live(f.src)])]);
		}
	}
	return f.dot;
}, true, { args: ["user"] });

// /obj/structure/destructible/clockwork/cache/proc/examine  (code/game/gamemodes/clock_cult/clock_structures/tinkerers_cache.dm:106)
rt.def("/obj/structure/destructible/clockwork/cache/proc/examine", function examine(f: Frame) {
	let i: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $e: any;
	f.vars = () => [i, $0, $1, $2, $3, $e];
	rt.callSuper(f, [], rt.Args.Same);
	if (!(truthy(rt.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[0])])) || truthy((rt.istype(live(f.args[0]), T("/mob/dead/observer")) ? 1 : 0)))) return f.dot;
	if (truthy(rt.sv(f, "linkedwall"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='brass'>It is linked to a Clockwork Wall and will generate a component every <b>＀</b> seconds!</span>", [rt.call(f, P("/proc/round"), null, [multiply(rt.callSrc(f, "get_production_time", []), 0.10000000149011612), 0.10000000149011612])])]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='alloy'>It is unlinked! Construct a Clockwork Wall nearby to generate components!</span>"]);
	}
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<b>Stored components:</b>"]);
	i = null;
	rt.forList(f, 0, rt.gl("clockwork_component_cache"));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		$0 = live(f.args[0]);
		$1 = rt.call(f, P("/proc/get_component_span"), null, [live(i)]);
		$2 = rt.call(f, P("/proc/get_component_name"), null, [live(i)]);
		if (!isEqual(live(i), "replicant_alloy")) {
			$3 = "s";
		} else {
			$3 = "";
		}
		rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='＀_small'><i>＀＀:</i> <b>＀</b></span>", [$1, $2, $3, rt.index(rt.gl("clockwork_component_cache"), live(i))])]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, false, { args: ["user"] });

// /obj/structure/destructible/clockwork/cache/proc/get_production_time  (code/game/gamemodes/clock_cult/clock_structures/tinkerers_cache.dm:117)
rt.def("/obj/structure/destructible/clockwork/cache/proc/get_production_time", function get_production_time(f: Frame) {
	return multiply(add(300, multiply(50, rt.gl("linked_caches"))), rt.callSrc(f, "get_efficiency_mod", [1]));
});
