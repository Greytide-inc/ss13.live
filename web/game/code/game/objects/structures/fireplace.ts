// From code/game/objects/structures/fireplace.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12750, "/obj/structure/fireplace", "/obj/structure", {
	lit: 0,
	fuel_added: 0,
	flame_expiry_timer: null,
	anchored: 1,
	name: "fireplace",
	desc: "A large stone brick fireplace.",
	icon: rt.rsc("icons/obj/fireplace.dmi"),
	icon_state: "fireplace",
	density: 0,
	pixel_x: -16,
	resistance_flags: 2,
});

// /obj/structure/fireplace/proc/New  (code/game/objects/structures/fireplace.dm:20)  may sleep
rt.def("/obj/structure/fireplace/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	return f.dot;
}, true);

// /obj/structure/fireplace/proc/Destroy  (code/game/objects/structures/fireplace.dm:24)  may sleep
rt.def("/obj/structure/fireplace/proc/Destroy", function* Destroy(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/structure/fireplace/proc/try_light  (code/game/objects/structures/fireplace.dm:29)  may sleep
rt.def("/obj/structure/fireplace/proc/try_light", function* try_light(f: Frame, O: Value, user: Value) {
	let msg: Value = null;
	f.vars = () => [O, user, msg];
	if (truthy(rt.sv(f, "lit"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>It's already lit!</span>"]);
		return 0;
	}
	if (!truthy(rt.sv(f, "fuel_added"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ needs some fuel to burn!</span>", [live(f.src)])]);
		return 0;
	}
	if (!truthy((msg = (yield* g.callName(f, live(O), "ignition_effect", [live(f.src), live(user)]))))) return f.dot;
	yield* g.srcCall(f, "visible_message", live(msg));
	yield* g.srcCall(f, "ignite");
	return 1;
}, true);

// /obj/structure/fireplace/proc/attackby  (code/game/objects/structures/fireplace.dm:41)  may sleep
rt.def("/obj/structure/fireplace/proc/attackby", function* attackby(f: Frame) {
	let wood: Value = null, space_remaining: Value = null, space_for_logs: Value = null, logs_used: Value = null, paper_bin: Value = null;
	f.vars = () => [wood, space_remaining, space_for_logs, logs_used, paper_bin];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/sheet/mineral/wood")) ? 1 : 0))) {
		wood = live(f.args[0]);
		space_remaining = subtract(3000, (yield* g.srcCall(f, "burn_time_remaining")));
		if (rt.lt((space_for_logs = (yield* g.call(f, P("/proc/round"), null, [divide(live(space_remaining), 150)]))), 1)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>You can't fit any more of ＀ in ＀!</span>", [live(f.args[0]), live(f.src)])]);
			return live(f.dot);
		}
		logs_used = (yield* g.call(f, P("/proc/min"), null, [live(space_for_logs), rt.fv(f, "amount", live(wood))]));
		yield* g.callName(f, live(wood), "use", [live(logs_used)]);
		yield* g.srcCall(f, "adjust_fuel_timer", multiply(150, live(logs_used)));
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ tosses some wood into ＀.</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You add some fuel to ＀.</span>", [live(f.src)])]);
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/paper_bin")) ? 1 : 0))) {
			paper_bin = live(f.args[0]);
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ throws ＀ into ＀.</span>", [live(f.args[1]), live(f.args[0]), live(f.src)]), fmt("<span class='notice'>You add ＀ to ＀.</span>", [live(f.args[0]), live(f.src)])]);
			yield* g.srcCall(f, "adjust_fuel_timer", multiply(5, rt.fv(f, "total_paper", live(paper_bin))));
			yield* g.call(f, P("/proc/qdel"), null, [live(paper_bin)]);
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/paper")) ? 1 : 0))) {
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ throws ＀ into ＀.</span>", [live(f.args[1]), live(f.args[0]), live(f.src)]), fmt("<span class='notice'>You throw ＀ into ＀.</span>", [live(f.args[0]), live(f.src)])]);
				yield* g.srcCall(f, "adjust_fuel_timer", 5);
				yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
			} else {
				if (truthy((yield* g.srcCall(f, "try_light", live(f.args[0]), live(f.args[1]))))) {
					return live(f.dot);
				} else {
					f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
				}
			}
		}
	}
	return f.dot;
}, true, { args: ["T", "user"] });

// /obj/structure/fireplace/proc/update_icon  (code/game/objects/structures/fireplace.dm:73)
rt.def("/obj/structure/fireplace/proc/update_icon", function update_icon(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	rt.callSrc(f, "cut_overlays", []);
	if (!truthy(rt.sv(f, "lit"))) return f.dot;
	$0 = rt.callSrc(f, "burn_time_remaining", []);
	if (rt.inRange($0, 0, 500)) {
		rt.callSrc(f, "add_overlay", ["fireplace_fire0"]);
	} else if (rt.inRange($0, 500, 1000)) {
		rt.callSrc(f, "add_overlay", ["fireplace_fire1"]);
	} else if (rt.inRange($0, 1000, 1500)) {
		rt.callSrc(f, "add_overlay", ["fireplace_fire2"]);
	} else if (rt.inRange($0, 1500, 2000)) {
		rt.callSrc(f, "add_overlay", ["fireplace_fire3"]);
	} else if (rt.inRange($0, 2000, 3000)) {
		rt.callSrc(f, "add_overlay", ["fireplace_fire4"]);
	}
	rt.callSrc(f, "add_overlay", ["fireplace_glow"]);
	return f.dot;
});

// /obj/structure/fireplace/proc/adjust_light  (code/game/objects/structures/fireplace.dm:89)
rt.def("/obj/structure/fireplace/proc/adjust_light", function adjust_light(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (!truthy(rt.sv(f, "lit"))) {
		rt.callSrc(f, "set_light", [0]);
		return live(f.dot);
	}
	$0 = rt.callSrc(f, "burn_time_remaining", []);
	if (rt.inRange($0, 0, 500)) {
		rt.callSrc(f, "set_light", [1]);
	} else if (rt.inRange($0, 500, 1000)) {
		rt.callSrc(f, "set_light", [2]);
	} else if (rt.inRange($0, 1000, 1500)) {
		rt.callSrc(f, "set_light", [3]);
	} else if (rt.inRange($0, 1500, 2000)) {
		rt.callSrc(f, "set_light", [4]);
	} else if (rt.inRange($0, 2000, 3000)) {
		rt.callSrc(f, "set_light", [6]);
	}
	return f.dot;
});

// /obj/structure/fireplace/proc/process  (code/game/objects/structures/fireplace.dm:106)  may sleep
rt.def("/obj/structure/fireplace/proc/process", function* process(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	if (!truthy(rt.sv(f, "lit"))) {
		return live(f.dot);
	}
	if (rt.gt(rt.worldTime(f), rt.sv(f, "flame_expiry_timer"))) {
		yield* g.srcCall(f, "put_out");
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/comfyfire.ogg"), 50, 0, 0, 1]);
	yield* g.callName(f, (_T = rt.getStep(f, live(f.src), 0)), "hotspot_expose", [700, 5]);
	yield* g.srcCall(f, "update_icon");
	yield* g.srcCall(f, "adjust_light");
	return f.dot;
}, true, { waitfor: false });

// /obj/structure/fireplace/proc/extinguish  (code/game/objects/structures/fireplace.dm:120)
rt.def("/obj/structure/fireplace/proc/extinguish", function extinguish(f: Frame) {
	let fuel: Value = null;
	f.vars = () => [fuel];
	if (truthy(rt.sv(f, "lit"))) {
		fuel = rt.callSrc(f, "burn_time_remaining", []);
		rt.setSv(f, "flame_expiry_timer", 0);
		rt.callSrc(f, "put_out", []);
		rt.callSrc(f, "adjust_fuel_timer", [live(fuel)]);
	}
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

// /obj/structure/fireplace/proc/adjust_fuel_timer  (code/game/objects/structures/fireplace.dm:128)
rt.def("/obj/structure/fireplace/proc/adjust_fuel_timer", function adjust_fuel_timer(f: Frame, amount: Value) {
	if (truthy(rt.sv(f, "lit"))) {
		rt.modSrcVar(f, "flame_expiry_timer", live(amount), add);
		if (rt.lt(rt.callSrc(f, "burn_time_remaining", []), 3000)) {
			rt.setSv(f, "flame_expiry_timer", add(rt.worldTime(f), 3000));
		}
	} else {
		rt.setSv(f, "fuel_added", rt.call(f, P("/proc/max"), null, [0, rt.call(f, P("/proc/min"), null, [add(rt.sv(f, "fuel_added"), live(amount)), 3000])]));
	}
	return f.dot;
});

// /obj/structure/fireplace/proc/burn_time_remaining  (code/game/objects/structures/fireplace.dm:136)
rt.def("/obj/structure/fireplace/proc/burn_time_remaining", function burn_time_remaining(f: Frame) {
	if (truthy(rt.sv(f, "lit"))) {
		return rt.call(f, P("/proc/max"), null, [0, subtract(rt.sv(f, "flame_expiry_timer"), rt.worldTime(f))]);
	}
	return rt.call(f, P("/proc/max"), null, [0, rt.sv(f, "fuel_added")]);
});

// /obj/structure/fireplace/proc/ignite  (code/game/objects/structures/fireplace.dm:142)
rt.def("/obj/structure/fireplace/proc/ignite", function ignite(f: Frame) {
	rt.setSv(f, "lit", 1);
	rt.setSv(f, "desc", "A large stone brick fireplace, warm and cozy.");
	rt.setSv(f, "flame_expiry_timer", add(rt.worldTime(f), rt.sv(f, "fuel_added")));
	rt.setSv(f, "fuel_added", 0);
	rt.callSrc(f, "update_icon", []);
	rt.callSrc(f, "adjust_light", []);
	return f.dot;
});

// /obj/structure/fireplace/proc/put_out  (code/game/objects/structures/fireplace.dm:150)
rt.def("/obj/structure/fireplace/proc/put_out", function put_out(f: Frame) {
	rt.setSv(f, "lit", 0);
	rt.callSrc(f, "update_icon", []);
	rt.callSrc(f, "adjust_light", []);
	rt.setSv(f, "desc", rt.initial(f, live(f.src), "desc"));
	return f.dot;
});
