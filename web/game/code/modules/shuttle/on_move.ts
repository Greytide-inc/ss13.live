// From code/modules/shuttle/on_move.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /atom/movable/proc/onShuttleMove  (code/modules/shuttle/on_move.dm:8)  may sleep
rt.def("/atom/movable/proc/onShuttleMove", function* onShuttleMove(f: Frame, T1: Value, rotation: Value, knockdown: Value) {
	f.vars = () => [T1, rotation, knockdown];
	if (live(knockdown) === null) {
		knockdown = 1;
	}
	if (truthy(live(rotation))) {
		yield* g.srcCall(f, "shuttleRotate", live(rotation));
	}
	rt.setSv(f, "loc", live(T1));
	if (truthy(rt.length(rt.sv(f, "client_mobs_in_contents")))) {
		yield* g.srcCall(f, "update_parallax_contents");
	}
	return 1;
}, true);

// /obj/proc/onShuttleMove  (code/modules/shuttle/on_move.dm:20)  may sleep
rt.def("/obj/proc/onShuttleMove", function* onShuttleMove(f: Frame) {
	if (rt.ge(rt.sv(f, "invisibility"), 101)) {
		return 0;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/machinery/door/airlock/proc/onShuttleMove  (code/modules/shuttle/on_move.dm:30)  may sleep
rt.def("/obj/machinery/door/airlock/proc/onShuttleMove", function* onShuttleMove(f: Frame) {
	let A: Value = null;
	let $e: any;
	f.vars = () => [A, $e];
	rt.setSv(f, "shuttledocked", 0);
	A = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [1, live(f.src)])), T("/obj/machinery/door/airlock"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		rt.setFv(f, "shuttledocked", live(A), 0);
		rt.setFv(f, "air_tight", live(A), 1);
		yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(A), P("/obj/machinery/door/proc/close")]);
	}
	rt.endFor(f, 0);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "shuttledocked", 1);
	A = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [1, live(f.src)])), T("/obj/machinery/door/airlock"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		rt.setFv(f, "shuttledocked", live(A), 1);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /mob/proc/onShuttleMove  (code/modules/shuttle/on_move.dm:39)  may sleep
rt.def("/mob/proc/onShuttleMove", function* onShuttleMove(f: Frame) {
	if (!truthy(rt.sv(f, "move_on_shuttle"))) {
		return 0;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "client"))) return f.dot;
	if (truthy(rt.sv(f, "buckled"))) {
		yield* g.call(f, P("/proc/shake_camera"), null, [live(f.src), 2, 1]);
	} else {
		yield* g.call(f, P("/proc/shake_camera"), null, [live(f.src), 7, 1]);
	}
	return f.dot;
}, true);

// /mob/living/carbon/proc/onShuttleMove  (code/modules/shuttle/on_move.dm:51)  may sleep
rt.def("/mob/living/carbon/proc/onShuttleMove", function* onShuttleMove(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) {
		return live(f.dot);
	}
	if (!(!truthy(rt.sv(f, "buckled")) && truthy(live(f.args[2])))) return f.dot;
	yield* g.srcCall(f, "Knockdown", 60);
	return f.dot;
}, true, { args: ["T1", "rotation", "knockdown"] });

// /obj/effect/abstract/proximity_checker/proc/onShuttleMove  (code/modules/shuttle/on_move.dm:59)  may sleep
rt.def("/obj/effect/abstract/proximity_checker/proc/onShuttleMove", function* onShuttleMove(f: Frame) {
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [rt.sv(f, "monitor"), P("/datum/proximity_monitor/proc/SetRange"), rt.fv(f, "current_range", rt.sv(f, "monitor")), 1])), 0, 1]);
	return f.dot;
}, true);

// /atom/proc/shuttleRotate  (code/modules/shuttle/on_move.dm:65)  may sleep
rt.def("/atom/proc/shuttleRotate", function* shuttleRotate(f: Frame, rotation: Value) {
	let turntimes: Value = null, oldPX: Value = null, oldPY: Value = null;
	f.vars = () => [rotation, turntimes, oldPX, oldPY];
	yield* g.srcCall(f, "setDir", (yield* g.call(f, P("/proc/angle2dir"), null, [add(live(rotation), (yield* g.call(f, P("/proc/dir2angle"), null, [rt.sv(f, "dir")])))])));
	if (truthy(rt.sv(f, "smooth"))) {
		yield* g.call(f, P("/proc/queue_smooth"), null, [live(f.src)]);
	}
	if (!(truthy(rt.sv(f, "pixel_x")) || truthy(rt.sv(f, "pixel_y")))) return f.dot;
	if (rt.lt(live(rotation), 0)) {
		rotation = rt.modify(live(rotation), 360, add);
	}
	turntimes = null;
	turntimes = divide(live(rotation), 90);
	while (rt.gt(live(turntimes), 0)) {
		oldPX = rt.sv(f, "pixel_x");
		rt.setSv(f, "pixel_x", (oldPY = rt.sv(f, "pixel_y")));
		rt.setSv(f, "pixel_y", multiply(live(oldPX), -1));
		turntimes = rt.inc(live(turntimes), -1);
	}
	return f.dot;
}, true);
