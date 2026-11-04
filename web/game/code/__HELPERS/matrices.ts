// From code/__HELPERS/matrices.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(13073, "/matrix", "/datum", {
	a: 1,
	b: 0,
	c: 0,
	d: 0,
	e: 1,
	f: 0,
});

// /matrix/proc/TurnTo  (code/__HELPERS/matrices.dm:2)
rt.def("/matrix/proc/TurnTo", function TurnTo(f: Frame, old_angle: Value, new_angle: Value) {
	f.dot = subtract(live(new_angle), live(old_angle));
	rt.callSrc(f, "Turn", [live(f.dot)]);
	return f.dot;
});

// /atom/proc/SpinAnimation  (code/__HELPERS/matrices.dm:6)
rt.def("/atom/proc/SpinAnimation", function SpinAnimation(f: Frame, speed: Value, loops: Value, clockwise: Value, segments: Value) {
	let segment: Value = null, matrices: Value = null, i: Value = null, M: Value = null, last: Value = null, i_3: Value = null;
	let $e: any;
	f.vars = () => [speed, loops, clockwise, segments, segment, matrices, i, M, last, i_3, $e];
	if (live(speed) === null) {
		speed = 10;
	}
	if (live(loops) === null) {
		loops = -1;
	}
	if (live(clockwise) === null) {
		clockwise = 1;
	}
	if (live(segments) === null) {
		segments = 3;
	}
	if (!truthy(live(segments))) {
		return live(f.dot);
	}
	segment = divide(360, live(segments));
	if (!truthy(live(clockwise))) {
		segment = rt.neg(live(segment));
	}
	matrices = rt.list();
	i = null;
	rt.forRange(f, 0, 1, subtract(live(segments), 1), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		rt.callName(f, (M = rt.call(f, P("/proc/matrix"), null, [rt.sv(f, "transform")])), "Turn", [multiply(live(segment), live(i))]);
		matrices = rt.modify(live(matrices), live(M), add);
	}
	rt.endFor(f, 0);
	matrices = rt.modify(live(matrices), (last = rt.call(f, P("/proc/matrix"), null, [rt.sv(f, "transform")])), add);
	(speed = rt.modify(live(speed), live(segments), divide));
	rt.op(f, "Animate", [2, 8], [null, live(f.src), "transform", rt.index(live(matrices), 1), "time", live(speed), null, live(loops)]);
	i_3 = null;
	rt.forRange(f, 0, 2, live(segments), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i_3 = $e;
		rt.op(f, "Animate", [2, 4], ["transform", rt.index(live(matrices), live(i_3)), "time", live(speed)]);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /matrix/proc/get_x_shift  (code/__HELPERS/matrices.dm:57)
rt.def("/matrix/proc/get_x_shift", function get_x_shift(f: Frame) {
	f.dot = rt.sv(f, "c");
	return f.dot;
});

// /matrix/proc/get_y_shift  (code/__HELPERS/matrices.dm:61)
rt.def("/matrix/proc/get_y_shift", function get_y_shift(f: Frame) {
	f.dot = rt.sv(f, "f");
	return f.dot;
});

// /matrix/proc/set_skew  (code/__HELPERS/matrices.dm:75)
rt.def("/matrix/proc/set_skew", function set_skew(f: Frame, x: Value, y: Value) {
	f.vars = () => [x, y];
	if (live(x) === null) {
		x = 0;
	}
	if (live(y) === null) {
		y = 0;
	}
	rt.setSv(f, "b", live(x));
	rt.setSv(f, "d", live(y));
	return f.dot;
});
