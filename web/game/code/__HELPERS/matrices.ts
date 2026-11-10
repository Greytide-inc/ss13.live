// Based on /tg/station's code/__HELPERS/matrices.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";


rt.type(13073, "/matrix", "/datum", {
	a: 1,
	b: 0,
	c: 0,
	d: 0,
	e: 1,
	f: 0,
});

// matrices.dm:2
rt.def("/matrix/proc/TurnTo", function TurnTo(f: Frame, old_angle: Value, new_angle: Value) {
	f.dot = new_angle - old_angle;
	this.Turn(f.dot);
	return f.dot;
});

// matrices.dm:6
rt.def("/atom/proc/SpinAnimation", function SpinAnimation(f: Frame, speed: Value, loops: Value, clockwise: Value, segments: Value) {
	let i: Value = null, M: Value = null, last: Value = null, i_3: Value = null;
	let $e: any;
	speed ??= 10;
	loops ??= -1;
	clockwise ??= 1;
	segments ??= 3;
	if (!segments) {
		return f.dot;
	}
	let segment: Value = 360 / segments;
	if (!clockwise) {
		segment = -segment;
	}
	let matrices: Value = list();
	rt.forRange(f, 0, 1, segments - 1, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		(M = matrix(this.transform)).Turn(segment * i);
		matrices += M;
	}
	rt.endFor(f, 0);
	matrices += (last = matrix(this.transform));
	speed /= segments;
	rt.op(f, "Animate", [2, 8], [null, this, "transform", rt.index(matrices, 1), "time", speed, null, loops]);
	rt.forRange(f, 0, 2, segments, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i_3 = $e;
		rt.op(f, "Animate", [2, 4], ["transform", rt.index(matrices, i_3), "time", speed]);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// matrices.dm:57
rt.def("/matrix/proc/get_x_shift", function get_x_shift(f: Frame) {
	f.dot = this.c;
	return f.dot;
});

// matrices.dm:61
rt.def("/matrix/proc/get_y_shift", function get_y_shift(f: Frame) {
	f.dot = this.f;
	return f.dot;
});

// matrices.dm:75
rt.def("/matrix/proc/set_skew", function set_skew(f: Frame, x: Value, y: Value) {
	x ??= 0;
	y ??= 0;
	this.b = x;
	this.d = y;
	return f.dot;
});
