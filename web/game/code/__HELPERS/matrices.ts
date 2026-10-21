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

// /matrix/proc/tolist  (code/__HELPERS/matrices.dm:29)
rt.def("/matrix/proc/tolist", function tolist(f: Frame) {
	f.dot = rt.list();
	f.dot = rt.modify(live(f.dot), rt.sv(f, "a"), add);
	f.dot = rt.modify(live(f.dot), rt.sv(f, "b"), add);
	f.dot = rt.modify(live(f.dot), rt.sv(f, "c"), add);
	f.dot = rt.modify(live(f.dot), rt.sv(f, "d"), add);
	f.dot = rt.modify(live(f.dot), rt.sv(f, "e"), add);
	f.dot = rt.modify(live(f.dot), rt.sv(f, "f"), add);
	return f.dot;
});

// /matrix/proc/togrid  (code/__HELPERS/matrices.dm:44)
rt.def("/matrix/proc/togrid", function togrid(f: Frame) {
	f.dot = rt.list();
	f.dot = rt.modify(live(f.dot), rt.sv(f, "a"), add);
	f.dot = rt.modify(live(f.dot), rt.sv(f, "d"), add);
	f.dot = rt.modify(live(f.dot), 0, add);
	f.dot = rt.modify(live(f.dot), rt.sv(f, "b"), add);
	f.dot = rt.modify(live(f.dot), rt.sv(f, "e"), add);
	f.dot = rt.modify(live(f.dot), 0, add);
	f.dot = rt.modify(live(f.dot), rt.sv(f, "c"), add);
	f.dot = rt.modify(live(f.dot), rt.sv(f, "f"), add);
	f.dot = rt.modify(live(f.dot), 1, add);
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

// /matrix/proc/get_x_skew  (code/__HELPERS/matrices.dm:64)
rt.def("/matrix/proc/get_x_skew", function get_x_skew(f: Frame) {
	f.dot = rt.sv(f, "b");
	return f.dot;
});

// /matrix/proc/get_y_skew  (code/__HELPERS/matrices.dm:67)
rt.def("/matrix/proc/get_y_skew", function get_y_skew(f: Frame) {
	f.dot = rt.sv(f, "d");
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

// /proc/color_matrix_identity  (code/__HELPERS/matrices.dm:96)
rt.def("/proc/color_matrix_identity", function color_matrix_identity(f: Frame) {
	return rt.list(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0);
});

// /proc/color_matrix_lightness  (code/__HELPERS/matrices.dm:101)
rt.def("/proc/color_matrix_lightness", function color_matrix_lightness(f: Frame, power: Value) {
	return rt.list(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, live(power), live(power), live(power), 0);
});

// /proc/color_matrix_saturation  (code/__HELPERS/matrices.dm:106)
rt.def("/proc/color_matrix_saturation", function color_matrix_saturation(f: Frame, value: Value) {
	let inv: Value = null, R: Value = null, G: Value = null, B: Value = null;
	f.vars = () => [inv, R, G, B];
	inv = subtract(1, live(value));
	R = rt.call(f, P("/proc/round"), null, [multiply(0.21299999952316284, live(inv)), 0.0010000000474974513]);
	G = rt.call(f, P("/proc/round"), null, [multiply(0.7149999737739563, live(inv)), 0.0010000000474974513]);
	B = rt.call(f, P("/proc/round"), null, [multiply(0.07199999690055847, live(inv)), 0.0010000000474974513]);
	return rt.list(add(live(R), live(value)), live(R), live(R), 0, live(G), add(live(G), live(value)), live(G), 0, live(B), live(B), add(live(B), live(value)), 0, 0, 0, 0, 1, 0, 0, 0, 0);
});

// /proc/color_matrix_contrast  (code/__HELPERS/matrices.dm:116)
rt.def("/proc/color_matrix_contrast", function color_matrix_contrast(f: Frame, value: Value) {
	let _add: Value = null;
	f.vars = () => [_add];
	_add = divide(subtract(1, live(value)), 2);
	return rt.list(live(value), 0, 0, 0, 0, live(value), 0, 0, 0, 0, live(value), 0, 0, 0, 0, 1, live(_add), live(_add), live(_add), 0);
});

// /proc/color_matrix_rotate_hue  (code/__HELPERS/matrices.dm:122)
rt.def("/proc/color_matrix_rotate_hue", function color_matrix_rotate_hue(f: Frame, angle: Value) {
	let sin: Value = null, cos: Value = null, cos_inv_third: Value = null, sqrt3_sin: Value = null;
	f.vars = () => [sin, cos, cos_inv_third, sqrt3_sin];
	sin = rt.op(f, "Sin", [], [live(angle)]);
	cos = rt.op(f, "Cos", [], [live(angle)]);
	cos_inv_third = multiply(0.3330000042915344, subtract(1, live(cos)));
	sqrt3_sin = multiply(1.7320507764816284, live(sin));
	return rt.list(rt.call(f, P("/proc/round"), null, [add(live(cos), live(cos_inv_third)), 0.0010000000474974513]), rt.call(f, P("/proc/round"), null, [add(live(cos_inv_third), live(sqrt3_sin)), 0.0010000000474974513]), rt.call(f, P("/proc/round"), null, [subtract(live(cos_inv_third), live(sqrt3_sin)), 0.0010000000474974513]), 0, rt.call(f, P("/proc/round"), null, [subtract(live(cos_inv_third), live(sqrt3_sin)), 0.0010000000474974513]), rt.call(f, P("/proc/round"), null, [add(live(cos), live(cos_inv_third)), 0.0010000000474974513]), rt.call(f, P("/proc/round"), null, [add(live(cos_inv_third), live(sqrt3_sin)), 0.0010000000474974513]), 0, rt.call(f, P("/proc/round"), null, [add(live(cos_inv_third), live(sqrt3_sin)), 0.0010000000474974513]), rt.call(f, P("/proc/round"), null, [subtract(live(cos_inv_third), live(sqrt3_sin)), 0.0010000000474974513]), rt.call(f, P("/proc/round"), null, [add(live(cos), live(cos_inv_third)), 0.0010000000474974513]), 0, 0, 0, 0, 1, 0, 0, 0, 0);
});

// /proc/color_matrix_rotate_x  (code/__HELPERS/matrices.dm:136)
rt.def("/proc/color_matrix_rotate_x", function color_matrix_rotate_x(f: Frame, angle: Value) {
	let sinval: Value = null, cosval: Value = null;
	f.vars = () => [sinval, cosval];
	sinval = rt.call(f, P("/proc/round"), null, [rt.op(f, "Sin", [], [live(angle)]), 0.0010000000474974513]);
	cosval = rt.call(f, P("/proc/round"), null, [rt.op(f, "Cos", [], [live(angle)]), 0.0010000000474974513]);
	return rt.list(1, 0, 0, 0, 0, live(cosval), live(sinval), 0, 0, rt.neg(live(sinval)), live(cosval), 0, 0, 0, 0, 1, 0, 0, 0, 0);
});

// /proc/color_matrix_rotate_y  (code/__HELPERS/matrices.dm:140)
rt.def("/proc/color_matrix_rotate_y", function color_matrix_rotate_y(f: Frame, angle: Value) {
	let sinval: Value = null, cosval: Value = null;
	f.vars = () => [sinval, cosval];
	sinval = rt.call(f, P("/proc/round"), null, [rt.op(f, "Sin", [], [live(angle)]), 0.0010000000474974513]);
	return rt.list((cosval = rt.call(f, P("/proc/round"), null, [rt.op(f, "Cos", [], [live(angle)]), 0.0010000000474974513])), 0, rt.neg(live(sinval)), 0, 0, 1, 0, 0, live(sinval), 0, live(cosval), 0, 0, 0, 0, 1, 0, 0, 0, 0);
});

// /proc/color_matrix_rotate_z  (code/__HELPERS/matrices.dm:144)
rt.def("/proc/color_matrix_rotate_z", function color_matrix_rotate_z(f: Frame, angle: Value) {
	let sinval: Value = null, cosval: Value = null;
	f.vars = () => [sinval, cosval];
	sinval = rt.call(f, P("/proc/round"), null, [rt.op(f, "Sin", [], [live(angle)]), 0.0010000000474974513]);
	return rt.list((cosval = rt.call(f, P("/proc/round"), null, [rt.op(f, "Cos", [], [live(angle)]), 0.0010000000474974513])), live(sinval), 0, 0, rt.neg(live(sinval)), live(cosval), 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0);
});

// /proc/color_matrix_add  (code/__HELPERS/matrices.dm:150)
rt.def("/proc/color_matrix_add", function color_matrix_add(f: Frame, A: Value, B: Value) {
	let output: Value = null, value: Value = null;
	let $e: any;
	f.vars = () => [output, value, $e];
	if ((!truthy((rt.istype(live(A), T("/list")) ? 1 : 0)) || !truthy((rt.istype(live(B), T("/list")) ? 1 : 0)))) {
		return rt.call(f, P("/proc/color_matrix_identity"), null, []);
	}
	if ((!isEqual(rt.len(f, live(A)), 20) || !isEqual(rt.len(f, live(B)), 20))) {
		return rt.call(f, P("/proc/color_matrix_identity"), null, []);
	}
	rt.setFv(f, "len", (output = rt.list()), 20);
	value = null;
	rt.forRange(f, 0, 1, 20, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		value = $e;
		rt.setAt(live(output), live(value), add(rt.index(live(A), live(value)), rt.index(live(B), live(value))));
	}
	rt.endFor(f, 0);
	return live(output);
});

// /proc/color_matrix_multiply  (code/__HELPERS/matrices.dm:162)
rt.def("/proc/color_matrix_multiply", function color_matrix_multiply(f: Frame, A: Value, B: Value) {
	let output: Value = null, x: Value = null, y: Value = null, offset: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $e: any;
	f.vars = () => [output, x, y, offset, $0, $1, $2, $3, $e];
	if ((!truthy((rt.istype(live(A), T("/list")) ? 1 : 0)) || !truthy((rt.istype(live(B), T("/list")) ? 1 : 0)))) {
		return rt.call(f, P("/proc/color_matrix_identity"), null, []);
	}
	if ((!isEqual(rt.len(f, live(A)), 20) || !isEqual(rt.len(f, live(B)), 20))) {
		return rt.call(f, P("/proc/color_matrix_identity"), null, []);
	}
	rt.setFv(f, "len", (output = rt.list()), 20);
	x = 1;
	y = 1;
	offset = 0;
	rt.forRange(f, 0, 1, 5, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		y = $e;
		offset = multiply(subtract(live(y), 1), 4);
		rt.forRange(f, 1, 1, 4, 1);
		while (($e = rt.next(f, 1)) !== undefined) {
			x = $e;
			$0 = live(output);
			$1 = add(live(offset), live(x));
			$2 = add(add(add(multiply(rt.index(live(A), add(live(offset), 1)), rt.index(live(B), live(x))), multiply(rt.index(live(A), add(live(offset), 2)), rt.index(live(B), add(live(x), 4)))), multiply(rt.index(live(A), add(live(offset), 3)), rt.index(live(B), add(live(x), 8)))), multiply(rt.index(live(A), add(live(offset), 4)), rt.index(live(B), add(live(x), 12))));
			if (isEqual(live(y), 5)) {
				$3 = rt.index(live(B), add(live(x), 16));
			} else {
				$3 = 0;
			}
			rt.setAt($0, $1, rt.call(f, P("/proc/round"), null, [add($2, $3), 0.0010000000474974513]));
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	return live(output);
});
