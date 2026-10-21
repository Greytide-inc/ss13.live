// From code/game/machinery/ai_slipper.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10773, "/obj/machinery/ai_slipper", "/obj/machinery", {
	uses: 20,
	cooldown: 0,
	cooldown_time: 100,
	anchored: 1,
	name: "foam dispenser",
	desc: "A remotely-activatable dispenser for crowd-controlling foam.",
	icon: rt.rsc("icons/obj/device.dmi"),
	icon_state: "ai-slipper0",
	layer: 2.75,
	obj_integrity: 200,
	max_integrity: 200,
	armor: null,
	req_access: null,
});

// /obj/machinery/ai_slipper/proc/<init>  (code/game/machinery/ai_slipper.dm:10)
rt.def("/obj/machinery/ai_slipper/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 50, "bullet", 20, "laser", 20, "energy", 20, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 30]));
	$0 = $0;
	rt.setSv(f, "req_access", rt.list(16));
	return f.dot;
});

// /obj/machinery/ai_slipper/proc/examine  (code/game/machinery/ai_slipper.dm:18)
rt.def("/obj/machinery/ai_slipper/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>It has <b>＀</b> uses of foam remaining.</span>", [rt.sv(f, "uses")])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/machinery/ai_slipper/proc/power_change  (code/game/machinery/ai_slipper.dm:22)
rt.def("/obj/machinery/ai_slipper/proc/power_change", function power_change(f: Frame) {
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
		return live(f.dot);
	} else {
		if (truthy(rt.callSrc(f, "powered", []))) {
			(rt.modSrcVar(f, "stat", 16777213, rt.bitAnd));
		} else {
			(rt.modSrcVar(f, "stat", 2, rt.bitOr));
		}
		if (((truthy(rt.bitAnd(rt.sv(f, "stat"), 3)) || rt.gt(rt.sv(f, "cooldown_time"), rt.worldTime(f))) || !truthy(rt.sv(f, "uses")))) {
			rt.setSv(f, "icon_state", "ai-slipper0");
		} else {
			rt.setSv(f, "icon_state", "ai-slipper1");
		}
	}
	return f.dot;
});

// /obj/machinery/ai_slipper/proc/attack_ai  (code/game/machinery/ai_slipper.dm:35)  may sleep
rt.def("/obj/machinery/ai_slipper/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.srcCall(f, "attack_hand", live(user)));
}, true);

// /obj/machinery/ai_slipper/proc/attack_hand  (code/game/machinery/ai_slipper.dm:38)  may sleep
rt.def("/obj/machinery/ai_slipper/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.srcCall(f, "allowed", live(user))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>Access denied.</span>"]);
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "uses"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='danger'>＀ is out of foam and cannot be activated.</span>", [live(f.src)])]);
		return live(f.dot);
	}
	if (rt.gt(rt.sv(f, "cooldown_time"), rt.worldTime(f))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='danger'>＀ cannot be activated for another <b>＀</b> second５.</span>", [live(f.src), (yield* g.call(f, P("/proc/round"), null, [multiply(subtract(rt.worldTime(f), rt.sv(f, "cooldown_time")), 0.10000000149011612)]))])]);
		return live(f.dot);
	}
	yield* g.new_(f, T("/obj/effect/particle_effect/foam"), [rt.sv(f, "loc")]);
	rt.incSrcVar(f, "uses", -1, true);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You activate ＀. It now has <b>＀</b> uses of foam remaining.</span>", [live(f.src), rt.sv(f, "uses")])]);
	rt.setSv(f, "cooldown", add(rt.worldTime(f), rt.sv(f, "cooldown_time")));
	yield* g.srcCall(f, "power_change");
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/machinery/ai_slipper/proc/power_change")])), rt.sv(f, "cooldown_time")]);
	return f.dot;
}, true);
