// From code/modules/mining/equipment/lazarus_injector.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7528, "/obj/item/weapon/lazarus_injector", "/obj/item/weapon", {
	loaded: 1,
	malfunctioning: 0,
	revive_type: 1,
	throw_speed: 3,
	throw_range: 5,
	name: "lazarus injector",
	desc: "An injector with a cocktail of nanomachines and chemicals, this device can seemingly raise animals from the dead, making them become friendly to the user. Unfortunately, the process is useless on higher forms of life and incredibly costly, so these were hidden in storage until an executive thought they'd be great motivation for some of their employees.",
	icon: rt.rsc("icons/obj/syringe.dmi"),
	icon_state: "lazarus_hypo",
	item_state: "hypo",
	throwforce: 0,
	w_class: 2,
	origin_tech: "biotech=4;magnets=6",
});

// /obj/item/weapon/lazarus_injector/proc/afterattack  (code/modules/mining/equipment/lazarus_injector.dm:18)  may sleep
rt.def("/obj/item/weapon/lazarus_injector/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity_flag: Value) {
	let M: Value = null, H: Value = null;
	f.vars = () => [target, user, proximity_flag, M, H];
	if (!truthy(rt.sv(f, "loaded"))) {
		return live(f.dot);
	}
	if (!(truthy((rt.istype(live(target), T("/mob/living")) ? 1 : 0)) && truthy(live(proximity_flag)))) return f.dot;
	if (truthy((rt.istype(live(target), T("/mob/living/simple_animal")) ? 1 : 0))) {
		if (!isEqual(rt.gv(f, "sentience_type", (M = live(target))), rt.sv(f, "revive_type"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='info'>＀ does not work on this sort of creature.</span>", [live(f.src)])]);
			return live(f.dot);
		}
		if (isEqual(rt.fv(f, "stat", live(M)), 2)) {
			rt.setFv(f, "faction", live(M), rt.list("neutral"));
			yield* g.callName(f, live(M), "revive", ["full_heal", 1, "admin_revive", 1], rt.Args.Named);
			if (truthy((rt.istype(live(target), T("/mob/living/simple_animal/hostile")) ? 1 : 0))) {
				H = live(M);
				if (truthy(rt.sv(f, "malfunctioning"))) {
					(rt.modField(f, live(H), "faction", rt.list("lazarus", fmt("＃", [live(user)])), rt.bitOr));
					rt.setFv(f, "robust_searching", live(H), 1);
					rt.modField(f, live(H), "friends", live(user), add);
					rt.setFv(f, "attack_same", live(H), 1);
					yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ has revived hostile mob ＀ with a malfunctioning lazarus injector", [live(user), live(target)])]);
				} else {
					rt.setFv(f, "attack_same", live(H), 0);
				}
			}
			rt.setSv(f, "loaded", 0);
			yield* g.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀ injects ＀ with ＀, reviving it.</span>", [live(user), live(M), live(f.src)])]);
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/refill.ogg"), 50, 1]);
			rt.setSv(f, "icon_state", "lazarus_empty");
			return live(f.dot);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='info'>＀ is only effective on the dead.</span>", [live(f.src)])]);
			return live(f.dot);
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='info'>＀ is only effective on lesser beings.</span>", [live(f.src)])]);
		return live(f.dot);
	}
	return f.dot;
}, true);

// /obj/item/weapon/lazarus_injector/proc/emp_act  (code/modules/mining/equipment/lazarus_injector.dm:53)
rt.def("/obj/item/weapon/lazarus_injector/proc/emp_act", function emp_act(f: Frame) {
	if (truthy(rt.sv(f, "malfunctioning"))) return f.dot;
	rt.setSv(f, "malfunctioning", 1);
	return f.dot;
});

// /obj/item/weapon/lazarus_injector/proc/examine  (code/modules/mining/equipment/lazarus_injector.dm:57)
rt.def("/obj/item/weapon/lazarus_injector/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "loaded"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='info'>＀ is empty.</span>", [live(f.src)])]);
	}
	if (!truthy(rt.sv(f, "malfunctioning"))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='info'>The display on ＀ seems to be flickering.</span>", [live(f.src)])]);
	return f.dot;
}, false, { args: ["user"] });
