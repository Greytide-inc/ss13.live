// From code/game/objects/effects/countdown.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11791, "/obj/effect/countdown", "/obj/effect", {
	displayed_text: null,
	attached_to: null,
	text_size: 4,
	started: 0,
	anchored: 1,
	name: "countdown",
	desc: "We're leaving together\nBut still it's farewell\nAnd maybe we'll come back\nTo earth, who can tell?",
	color: "#ff0000",
	invisibility: 60,
	layer: 6,
});

// /obj/effect/countdown/proc/New  (code/game/objects/effects/countdown.dm:18)  may sleep
rt.def("/obj/effect/countdown/proc/New", function* New(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "attach", live(f.args[0]));
	return f.dot;
}, true, { args: ["A"] });

// /obj/effect/countdown/proc/examine  (code/game/objects/effects/countdown.dm:22)
rt.def("/obj/effect/countdown/proc/examine", function examine(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("This countdown is displaying: ＀", [rt.sv(f, "displayed_text")])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/effect/countdown/proc/attach  (code/game/objects/effects/countdown.dm:26)
rt.def("/obj/effect/countdown/proc/attach", function attach(f: Frame, A: Value) {
	rt.setSv(f, "attached_to", live(A));
	rt.setSv(f, "loc", rt.getStep(f, live(A), 0));
	return f.dot;
});

// /obj/effect/countdown/proc/start  (code/game/objects/effects/countdown.dm:30)
rt.def("/obj/effect/countdown/proc/start", function start(f: Frame) {
	if (truthy(rt.sv(f, "started"))) return f.dot;
	if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
		rt.setFv(f, "isprocessing", live(f.src), 1);
		rt.modField(f, rt.gl("SSfastprocess"), "processing", live(f.src), add);
	}
	rt.setSv(f, "started", 1);
	return f.dot;
});

// /obj/effect/countdown/proc/stop  (code/game/objects/effects/countdown.dm:37)
rt.def("/obj/effect/countdown/proc/stop", function stop(f: Frame) {
	if (!truthy(rt.sv(f, "started"))) return f.dot;
	rt.setSv(f, "maptext", null);
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSfastprocess"), "processing", live(f.src), subtract));
	rt.setSv(f, "started", 0);
	return f.dot;
});

// /obj/effect/countdown/proc/process  (code/game/objects/effects/countdown.dm:45)  may sleep
rt.def("/obj/effect/countdown/proc/process", function* process(f: Frame) {
	let new_val: Value = null;
	f.vars = () => [new_val];
	if ((!truthy(rt.sv(f, "attached_to")) || (!truthy(rt.sv(f, "attached_to")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "attached_to")))))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	yield* g.srcCall(f, "forceMove", rt.getStep(f, rt.sv(f, "attached_to"), 0));
	if (isEqual((new_val = (yield* g.srcCall(f, "get_value"))), rt.sv(f, "displayed_text"))) {
		return live(f.dot);
	}
	rt.setSv(f, "displayed_text", live(new_val));
	if (truthy(rt.sv(f, "displayed_text"))) {
		rt.setSv(f, "maptext", fmt("<font size = ＀>＀</font>", [rt.sv(f, "text_size"), rt.sv(f, "displayed_text")]));
	} else {
		rt.setSv(f, "maptext", null);
	}
	return f.dot;
}, true, { waitfor: false });

// /obj/effect/countdown/proc/Destroy  (code/game/objects/effects/countdown.dm:60)  may sleep
rt.def("/obj/effect/countdown/proc/Destroy", function* Destroy(f: Frame) {
	rt.setSv(f, "attached_to", null);
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSfastprocess"), "processing", live(f.src), subtract));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

rt.type(11792, "/obj/effect/countdown/syndicatebomb", "/obj/effect/countdown", {
	name: "syndicate bomb countdown",
});

// /obj/effect/countdown/syndicatebomb/proc/get_value  (code/game/objects/effects/countdown.dm:70)
rt.def("/obj/effect/countdown/syndicatebomb/proc/get_value", function get_value(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	if (!truthy((rt.istype((S = rt.sv(f, "attached_to")), T("/obj/machinery/syndicatebomb")) ? 1 : 0))) {
		return live(f.dot);
	} else {
		if (!truthy(rt.fv(f, "active", live(S)))) return f.dot;
		return rt.callName(f, live(S), "seconds_remaining", []);
	}
	return f.dot;
});

rt.type(11793, "/obj/effect/countdown/nuclearbomb", "/obj/effect/countdown", {
	name: "nuclear bomb countdown",
	color: "#81FF14",
});

// /obj/effect/countdown/nuclearbomb/proc/get_value  (code/game/objects/effects/countdown.dm:81)
rt.def("/obj/effect/countdown/nuclearbomb/proc/get_value", function get_value(f: Frame) {
	let N: Value = null;
	f.vars = () => [N];
	if (!truthy((rt.istype((N = rt.sv(f, "attached_to")), T("/obj/machinery/nuclearbomb")) ? 1 : 0))) {
		return live(f.dot);
	} else {
		if (!truthy(rt.fv(f, "timing", live(N)))) return f.dot;
		return rt.call(f, P("/proc/round"), null, [rt.callName(f, live(N), "get_time_left", []), 1]);
	}
	return f.dot;
});

rt.type(11794, "/obj/effect/countdown/clonepod", "/obj/effect/countdown", {
	text_size: 1,
	name: "cloning pod countdown",
	color: "#0C479D",
});

// /obj/effect/countdown/clonepod/proc/get_value  (code/game/objects/effects/countdown.dm:93)
rt.def("/obj/effect/countdown/clonepod/proc/get_value", function get_value(f: Frame) {
	let C: Value = null, completion: Value = null;
	f.vars = () => [C, completion];
	if (!truthy((rt.istype((C = rt.sv(f, "attached_to")), T("/obj/machinery/clonepod")) ? 1 : 0))) {
		return live(f.dot);
	} else {
		if (!truthy(rt.fv(f, "occupant", live(C)))) return f.dot;
		return (completion = rt.call(f, P("/proc/round"), null, [rt.callName(f, live(C), "get_completion", [])]));
	}
	return f.dot;
});

rt.type(11795, "/obj/effect/countdown/dominator", "/obj/effect/countdown", {
	text_size: 1,
	name: "dominator countdown",
	color: "#ff00ff",
});

// /obj/effect/countdown/dominator/proc/get_value  (code/game/objects/effects/countdown.dm:106)
rt.def("/obj/effect/countdown/dominator/proc/get_value", function get_value(f: Frame) {
	let D: Value = null, timer: Value = null;
	f.vars = () => [D, timer];
	if (!truthy((rt.istype((D = rt.sv(f, "attached_to")), T("/obj/machinery/dominator")) ? 1 : 0))) {
		return live(f.dot);
	} else {
		if ((truthy(rt.fv(f, "gang", live(D))) && truthy(rt.gv(f, "is_dominating", rt.fv(f, "gang", live(D)))))) {
			return (timer = rt.callName(f, rt.fv(f, "gang", live(D)), "domination_time_remaining", []));
		} else {
			return "OFFLINE";
		}
	}
	return f.dot;
});

rt.type(11796, "/obj/effect/countdown/clockworkgate", "/obj/effect/countdown", {
	text_size: 1,
	name: "gateway countdown",
	color: "#BE8700",
	layer: 12,
});

// /obj/effect/countdown/clockworkgate/proc/get_value  (code/game/objects/effects/countdown.dm:122)
rt.def("/obj/effect/countdown/clockworkgate/proc/get_value", function get_value(f: Frame) {
	let G: Value = null;
	f.vars = () => [G];
	if (!truthy((rt.istype((G = rt.sv(f, "attached_to")), T("/obj/structure/destructible/clockwork/massive/celestial_gateway")) ? 1 : 0))) {
		return live(f.dot);
	} else {
		if (!(truthy(rt.fv(f, "obj_integrity", live(G))) && !truthy(rt.fv(f, "purpose_fulfilled", live(G))))) return f.dot;
		return fmt("<div align='center' valign='middle' style='position:relative; top:0px; left:6px'>＀</div>", [rt.callName(f, live(G), "get_arrival_text", [0])]);
	}
	return f.dot;
});

rt.type(11797, "/obj/effect/countdown/supermatter", "/obj/effect/countdown", {
	text_size: 1,
	name: "supermatter damage",
	color: "#ED84F4",
});

// /obj/effect/countdown/supermatter/proc/get_value  (code/game/objects/effects/countdown.dm:134)
rt.def("/obj/effect/countdown/supermatter/proc/get_value", function get_value(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	if (!truthy((rt.istype((S = rt.sv(f, "attached_to")), T("/obj/machinery/power/supermatter_shard")) ? 1 : 0))) {
		return live(f.dot);
	}
	return fmt("<div align='center' valign='middle' style='position:relative; top:0px; left:6px'>＀</div>", [rt.call(f, P("/proc/round"), null, [multiply(divide(rt.fv(f, "damage", live(S)), rt.fv(f, "explosion_point", live(S))), 100)])]);
	return f.dot;
});

rt.type(11798, "/obj/effect/countdown/transformer", "/obj/effect/countdown", {
	name: "transformer countdown",
	color: "#4C5866",
});

// /obj/effect/countdown/transformer/proc/get_value  (code/game/objects/effects/countdown.dm:144)
rt.def("/obj/effect/countdown/transformer/proc/get_value", function get_value(f: Frame) {
	let _T: Value = null, seconds_left: Value = null;
	f.vars = () => [_T, seconds_left];
	if (!truthy((rt.istype((_T = rt.sv(f, "attached_to")), T("/obj/machinery/transformer")) ? 1 : 0))) {
		return live(f.dot);
	} else {
		if (!truthy(rt.fv(f, "cooldown", live(_T)))) return f.dot;
		return fmt("＀", [rt.call(f, P("/proc/round"), null, [(seconds_left = rt.call(f, P("/proc/max"), null, [0, divide(subtract(rt.fv(f, "cooldown_timer", live(_T)), rt.worldTime(f)), 10)]))])]);
	}
	return f.dot;
});

rt.type(11799, "/obj/effect/countdown/doomsday", "/obj/effect/countdown", {
	text_size: 3,
	name: "doomsday countdown",
});

// /obj/effect/countdown/doomsday/proc/get_value  (code/game/objects/effects/countdown.dm:156)
rt.def("/obj/effect/countdown/doomsday/proc/get_value", function get_value(f: Frame) {
	let DD: Value = null;
	f.vars = () => [DD];
	if (!truthy((rt.istype((DD = rt.sv(f, "attached_to")), T("/obj/machinery/doomsday_device")) ? 1 : 0))) {
		return live(f.dot);
	} else {
		if (!truthy(rt.fv(f, "timing", live(DD)))) return f.dot;
		return fmt("<div align='center' valign='middle' style='position:relative; top:0px; left:0px'>＀</div>", [rt.callName(f, live(DD), "seconds_remaining", [])]);
	}
	return f.dot;
});

rt.type(11800, "/obj/effect/countdown/anomaly", "/obj/effect/countdown", {
	name: "anomaly countdown",
});

// /obj/effect/countdown/anomaly/proc/get_value  (code/game/objects/effects/countdown.dm:166)
rt.def("/obj/effect/countdown/anomaly/proc/get_value", function get_value(f: Frame) {
	let A: Value = null, time_left: Value = null;
	f.vars = () => [A, time_left];
	if (!truthy((rt.istype((A = rt.sv(f, "attached_to")), T("/obj/effect/anomaly")) ? 1 : 0))) {
		return live(f.dot);
	} else {
		return rt.call(f, P("/proc/round"), null, [(time_left = rt.call(f, P("/proc/max"), null, [0, divide(subtract(rt.fv(f, "death_time", live(A)), rt.worldTime(f)), 10)]))]);
	}
	return f.dot;
});
