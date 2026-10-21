// From code/game/objects/effects/proximity.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1506, "/datum/proximity_monitor", "/datum", {
	host: null,
	last_host_loc: null,
	checkers: null,
	current_range: null,
	ignore_if_not_on_turf: null,
});

// /datum/proximity_monitor/proc/New  (code/game/objects/effects/proximity.dm:9)  may sleep
rt.def("/datum/proximity_monitor/proc/New", function* New(f: Frame, _host: Value, range: Value, _ignore_if_not_on_turf: Value) {
	f.vars = () => [_host, range, _ignore_if_not_on_turf];
	if (live(_ignore_if_not_on_turf) === null) {
		_ignore_if_not_on_turf = 1;
	}
	rt.setSv(f, "host", live(_host));
	rt.setSv(f, "last_host_loc", rt.fv(f, "loc", live(_host)));
	rt.setSv(f, "ignore_if_not_on_turf", live(_ignore_if_not_on_turf));
	rt.setSv(f, "checkers", rt.list());
	yield* g.srcCall(f, "SetRange", live(range));
	return f.dot;
}, true);

// /datum/proximity_monitor/proc/Destroy  (code/game/objects/effects/proximity.dm:18)  may sleep
rt.def("/datum/proximity_monitor/proc/Destroy", function* Destroy(f: Frame) {
	let I: Value = null;
	let $e: any;
	f.vars = () => [I, $e];
	rt.setSv(f, "host", null);
	rt.setSv(f, "last_host_loc", null);
	if (truthy(rt.sv(f, "checkers"))) {
		I = null;
		rt.forList(f, 0, rt.sv(f, "checkers"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			yield* g.call(f, P("/proc/qdel"), null, [live(I)]);
		}
		rt.endFor(f, 0);
		yield* g.callName(f, rt.sv(f, "checkers"), "Cut", []);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/proximity_monitor/proc/HandleMove  (code/game/objects/effects/proximity.dm:22)  may sleep
rt.def("/datum/proximity_monitor/proc/HandleMove", function* HandleMove(f: Frame) {
	let _host: Value = null, new_host_loc: Value = null, curr_range: Value = null;
	f.vars = () => [_host, new_host_loc, curr_range];
	_host = rt.sv(f, "host");
	new_host_loc = rt.fv(f, "loc", live(_host));
	if (isEqual(rt.sv(f, "last_host_loc"), live(new_host_loc))) return f.dot;
	rt.setSv(f, "last_host_loc", live(new_host_loc));
	yield* g.srcCall(f, "SetRange", (curr_range = rt.sv(f, "current_range")), 1);
	if (!truthy(live(curr_range))) return f.dot;
	yield* g.callName(f, live(_host), "HasProximity", [rt.sv(f, "host")]);
	return f.dot;
}, true);

// /datum/proximity_monitor/proc/SetRange  (code/game/objects/effects/proximity.dm:33)  may sleep
rt.def("/datum/proximity_monitor/proc/SetRange", function* SetRange(f: Frame, range: Value, force_rebuild: Value) {
	let checkers_local: Value = null, old_checkers_len: Value = null, _host: Value = null, loc_to_use: Value = null, pc: Value = null, I: Value = null, turfs: Value = null, turfs_len: Value = null, old_checkers_used: Value = null, I_7: Value = null, pc_8: Value = null;
	let $0: any, $e: any;
	f.vars = () => [range, force_rebuild, checkers_local, old_checkers_len, _host, loc_to_use, pc, I, turfs, turfs_len, old_checkers_used, I_7, pc_8, $0, $e];
	if (live(force_rebuild) === null) {
		force_rebuild = 0;
	}
	if ((!truthy(live(force_rebuild)) && isEqual(live(range), rt.sv(f, "current_range")))) {
		return 0;
	}
	f.dot = 1;
	rt.setSv(f, "current_range", live(range));
	checkers_local = rt.sv(f, "checkers");
	old_checkers_len = rt.len(f, live(checkers_local));
	_host = rt.sv(f, "host");
	if (truthy(rt.sv(f, "ignore_if_not_on_turf"))) {
		$0 = rt.fv(f, "loc", live(_host));
	} else {
		$0 = rt.getStep(f, live(_host), 0);
	}
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [(loc_to_use = $0)])))) {
		if (truthy(live(range))) {
			pc = null;
			if (truthy(live(old_checkers_len))) {
				pc = rt.index(live(checkers_local), live(old_checkers_len));
				rt.incField(f, live(checkers_local), "len", -1, false);
				if (truthy(live(checkers_local))) {
					I = null;
					rt.forList(f, 0, live(checkers_local));
					while (($e = rt.next(f, 0)) !== undefined) {
						I = $e;
						yield* g.call(f, P("/proc/qdel"), null, [live(I)]);
					}
					rt.endFor(f, 0);
					yield* g.callName(f, live(checkers_local), "Cut", []);
				}
			} else {
				pc = (yield* g.new_(f, T("/obj/effect/abstract/proximity_checker"), [live(loc_to_use), live(f.src)]));
			}
			checkers_local = rt.modify(live(checkers_local), live(pc), add);
		}
		return live(f.dot);
	}
	turfs = (yield* g.call(f, P("/proc/block"), null, [rt.locate((yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "x", live(loc_to_use)), live(range)), 1])), (yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "y", live(loc_to_use)), live(range)), 1])), rt.fv(f, "z", live(loc_to_use))), rt.locate((yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "x", live(loc_to_use)), live(range)), rt.fv(f, "maxx", rt.world())])), (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "y", live(loc_to_use)), live(range)), rt.fv(f, "maxy", rt.world())])), rt.fv(f, "z", live(loc_to_use)))]));
	turfs_len = rt.len(f, live(turfs));
	old_checkers_used = (yield* g.call(f, P("/proc/min"), null, [live(turfs_len), live(old_checkers_len)]));
	I_7 = null;
	rt.forRange(f, 0, 1, live(old_checkers_len), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		I_7 = $e;
		if (rt.le(live(I_7), live(old_checkers_used))) {
			rt.setFv(f, "loc", (pc_8 = rt.index(live(checkers_local), live(I_7))), rt.index(live(turfs), live(I_7)));
		} else {
			yield* g.call(f, P("/proc/qdel"), null, [rt.index(live(checkers_local), live(I_7))]);
		}
	}
	rt.endFor(f, 0);
	if (rt.lt(live(old_checkers_len), live(turfs_len))) {
		I_7 = null;
		rt.forRange(f, 0, add(live(old_checkers_used), 1), live(turfs_len), 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			I_7 = $e;
			checkers_local = rt.modify(live(checkers_local), (yield* g.new_(f, T("/obj/effect/abstract/proximity_checker"), [rt.index(live(turfs), live(I_7)), live(f.src)])), add);
		}
		rt.endFor(f, 0);
	} else {
		yield* g.callName(f, live(checkers_local), "Cut", [add(live(old_checkers_used), 1), live(old_checkers_len)]);
	}
	return f.dot;
}, true);

rt.type(11804, "/obj/effect/abstract/proximity_checker", "/obj/effect/abstract", {
	monitor: null,
	anchored: 1,
	invisibility: 101,
});

// /obj/effect/abstract/proximity_checker/proc/Initialize  (code/game/objects/effects/proximity.dm:83)
rt.def("/obj/effect/abstract/proximity_checker/proc/Initialize", function Initialize(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (truthy(live(f.args[1]))) {
		rt.setSv(f, "monitor", live(f.args[1]));
	} else {
		rt.call(f, P("/proc/stack_trace"), null, ["proximity_checker created without host"]);
		return 2;
	}
	return f.dot;
}, false, { args: ["mapload", "_monitor"] });

// /obj/effect/abstract/proximity_checker/proc/Destroy  (code/game/objects/effects/proximity.dm:92)  may sleep
rt.def("/obj/effect/abstract/proximity_checker/proc/Destroy", function* Destroy(f: Frame) {
	rt.setSv(f, "monitor", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/effect/abstract/proximity_checker/proc/Crossed  (code/game/objects/effects/proximity.dm:96)  may sleep
rt.def("/obj/effect/abstract/proximity_checker/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	f.vars = () => [AM];
	yield* g.callName(f, rt.fv(f, "host", rt.sv(f, "monitor")), "HasProximity", [live(AM)]);
	return f.dot;
}, true, { waitfor: false });
