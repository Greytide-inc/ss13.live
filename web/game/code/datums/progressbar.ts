// From code/datums/progressbar.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(737, "/datum/progressbar", "/datum", {
	goal: 1,
	bar: null,
	shown: 0,
	user: null,
	client: null,
	listindex: null,
});

// /datum/progressbar/proc/New  (code/datums/progressbar.dm:12)
rt.def("/datum/progressbar/proc/New", function New(f: Frame) {
	let bars: Value = null;
	f.vars = () => [bars];
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (!truthy((rt.istype(live(f.args[2]), T("/atom")) ? 1 : 0))) {
		rt.new_(f, T("/exception"), ["Invalid target given", "code/datums/progressbar.dm", 14]);
	}
	if (truthy(live(f.args[1]))) {
		rt.setSv(f, "goal", live(f.args[1]));
	}
	rt.setSv(f, "bar", rt.call(f, P("/proc/image"), null, [rt.rsc("icons/effects/progessbar.dmi"), live(f.args[2]), "prog_bar_0", 19]));
	rt.setFv(f, "plane", rt.sv(f, "bar"), 19);
	rt.setFv(f, "appearance_flags", rt.sv(f, "bar"), 30);
	rt.setSv(f, "user", live(f.args[0]));
	if (truthy(rt.sv(f, "user"))) {
		rt.setSv(f, "client", rt.fv(f, "client", rt.sv(f, "user")));
	}
	if (!truthy(rt.fv(f, "progressbars", rt.sv(f, "user")))) {
		rt.setFv(f, "progressbars", rt.sv(f, "user"), rt.list());
	}
	if (!truthy(rt.index(rt.fv(f, "progressbars", rt.sv(f, "user")), rt.fv(f, "loc", rt.sv(f, "bar"))))) {
		rt.setAt(rt.fv(f, "progressbars", rt.sv(f, "user")), rt.fv(f, "loc", rt.sv(f, "bar")), rt.list());
	}
	rt.callName(f, (bars = rt.index(rt.fv(f, "progressbars", rt.sv(f, "user")), rt.fv(f, "loc", rt.sv(f, "bar")))), "Add", [live(f.src)]);
	rt.setSv(f, "listindex", rt.len(f, live(bars)));
	rt.setFv(f, "pixel_y", rt.sv(f, "bar"), add(32, multiply(6, subtract(rt.sv(f, "listindex"), 1))));
	return f.dot;
}, false, { args: ["User", "goal_number", "target"] });

// /datum/progressbar/proc/update  (code/datums/progressbar.dm:33)
rt.def("/datum/progressbar/proc/update", function update(f: Frame, progress: Value) {
	f.vars = () => [progress];
	if ((!truthy(rt.sv(f, "user")) || !truthy(rt.fv(f, "client", rt.sv(f, "user"))))) {
		rt.setSv(f, "shown", 0);
		return live(f.dot);
	}
	if (!isEqual(rt.fv(f, "client", rt.sv(f, "user")), rt.sv(f, "client"))) {
		if (truthy(rt.sv(f, "client"))) {
			(rt.modField(f, rt.sv(f, "client"), "images", rt.sv(f, "bar"), subtract));
		}
		if (truthy(rt.fv(f, "client", rt.sv(f, "user")))) {
			rt.modField(f, rt.fv(f, "client", rt.sv(f, "user")), "images", rt.sv(f, "bar"), add);
		}
	}
	progress = rt.call(f, P("/proc/max"), null, [0, rt.call(f, P("/proc/min"), null, [live(progress), rt.sv(f, "goal")])]);
	rt.setFv(f, "icon_state", rt.sv(f, "bar"), fmt("prog_bar_＀", [rt.call(f, P("/proc/round"), null, [multiply(divide(live(progress), rt.sv(f, "goal")), 100), 5])]));
	if (truthy(rt.sv(f, "shown"))) return f.dot;
	rt.modField(f, rt.fv(f, "client", rt.sv(f, "user")), "images", rt.sv(f, "bar"), add);
	rt.setSv(f, "shown", 1);
	return f.dot;
});

// /datum/progressbar/proc/shiftDown  (code/datums/progressbar.dm:49)
rt.def("/datum/progressbar/proc/shiftDown", function shiftDown(f: Frame) {
	rt.incSrcVar(f, "listindex", -1, false);
	(rt.modField(f, rt.sv(f, "bar"), "pixel_y", 6, subtract));
	return f.dot;
});

// /datum/progressbar/proc/Destroy  (code/datums/progressbar.dm:53)  may sleep
rt.def("/datum/progressbar/proc/Destroy", function* Destroy(f: Frame) {
	let I: Value = null, _P: Value = null, bars: Value = null;
	let $e: any;
	f.vars = () => [I, _P, bars, $e];
	I = null;
	rt.forList(f, 0, rt.index(rt.fv(f, "progressbars", rt.sv(f, "user")), rt.fv(f, "loc", rt.sv(f, "bar"))));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if ((!isEqual((_P = live(I)), live(f.src)) && rt.gt(rt.fv(f, "listindex", live(_P)), rt.sv(f, "listindex")))) {
			yield* g.callName(f, live(_P), "shiftDown", []);
		}
	}
	rt.endFor(f, 0);
	yield* g.callName(f, (bars = rt.index(rt.fv(f, "progressbars", rt.sv(f, "user")), rt.fv(f, "loc", rt.sv(f, "bar")))), "Remove", [live(f.src)]);
	if (!truthy(rt.len(f, live(bars)))) {
		if (truthy(rt.fv(f, "progressbars", rt.sv(f, "user")))) {
			(rt.modField(f, rt.sv(f, "user"), "progressbars", rt.fv(f, "loc", rt.sv(f, "bar")), subtract));
			if (!truthy(rt.getLen(f, rt.fv(f, "progressbars", rt.sv(f, "user"))))) {
				rt.setFv(f, "progressbars", rt.sv(f, "user"), null);
			}
		}
	}
	if (truthy(rt.sv(f, "client"))) {
		(rt.modField(f, rt.sv(f, "client"), "images", rt.sv(f, "bar"), subtract));
	}
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "bar")]);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);
