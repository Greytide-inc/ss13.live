// Based on /tg/station's code/__HELPERS/maths.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { P } = rt;


// maths.dm:3
rt.def("/datum/controller/global_vars/proc/InitGlobalE", function InitGlobalE(f: Frame) {
	GLOB.E = 2.7182817;
	this.gvars_datum_init_order += "E";
	return f.dot;
});

// maths.dm:4
rt.def("/datum/controller/global_vars/proc/InitGlobalSqrt2", function InitGlobalSqrt2(f: Frame) {
	GLOB.Sqrt2 = 1.4142135;
	this.gvars_datum_init_order += "Sqrt2";
	return f.dot;
});

// maths.dm:7
rt.def("/datum/controller/global_vars/proc/InitGlobalsqrtTable", function InitGlobalsqrtTable(f: Frame) {
	GLOB.sqrtTable = list(1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 10);
	this.gvars_datum_init_order += "sqrtTable";
	return f.dot;
});

// maths.dm:13
rt.def("/proc/sign", function sign(f: Frame, x: Value) {
	return x != 0 ? x / rt.op(f, "Abs", [], [x]) : 0;
});

// maths.dm:16
rt.def("/proc/Atan2", function Atan2(f: Frame, x: Value, y: Value) {
	if (!x && !y) {
		return 0;
	}
	let a: Value = rt.op(f, "ArcCos", [], [x / rt.op(f, "Sqrt", [], [x * x + y * y])]);
	return y >= 0 ? a : -a;
});

// maths.dm:21
rt.def("/proc/Ceiling", function Ceiling(f: Frame, x: Value, y: Value) {
	y ??= 1;
	return -round(-x / y) * y;
});

// maths.dm:24
rt.def("/proc/Floor", function Floor(f: Frame, x: Value, y: Value) {
	y ??= 1;
	return round(x / y) * y;
});

// maths.dm:37
rt.def("/proc/Default", function Default(f: Frame, a: Value, b: Value) {
	return a ? a : b;
});

// maths.dm:41
rt.def("/proc/Gcd", function Gcd(f: Frame, a: Value, b: Value) {
	return b ? rt.call(f, P("/proc/Gcd"), null, [b, a % b]) : a;
});

// maths.dm:44
rt.def("/proc/Inverse", function Inverse(f: Frame, x: Value) {
	return 1 / x;
});

// maths.dm:50
rt.def("/proc/IsEven", function IsEven(f: Frame, x: Value) {
	return (x % 2 == 0 ? 1 : 0);
});

// maths.dm:54
rt.def("/proc/IsInRange", function IsInRange(f: Frame, val: Value, min: Value, max: Value) {
	return ((min <= val ? 1 : 0) && (val <= max ? 1 : 0));
});

// maths.dm:57
rt.def("/proc/IsInteger", function IsInteger(f: Frame, x: Value) {
	return (round(x) == x ? 1 : 0);
});

// maths.dm:60
rt.def("/proc/IsOdd", function IsOdd(f: Frame, x: Value) {
	return (!IsEven(x) ? 1 : 0);
});

// maths.dm:63
rt.def("/proc/IsMultiple", function IsMultiple(f: Frame, x: Value, y: Value) {
	return (x % y == 0 ? 1 : 0);
});

// maths.dm:73
rt.def("/proc/Lerp", function Lerp(f: Frame, a: Value, b: Value, amount: Value) {
	amount ??= 0.5;
	return a + (b - a) * amount;
});

// maths.dm:88
rt.def("/proc/Root", function Root(f: Frame, n: Value, x: Value) {
	return x ** (1 / n);
});

// maths.dm:92
rt.def("/proc/Sec", function Sec(f: Frame, x: Value) {
	return 1 / rt.op(f, "Cos", [], [x]);
});

// maths.dm:109
rt.def("/proc/Tan", function Tan(f: Frame, x: Value) {
	return rt.op(f, "Sin", [], [x]) / rt.op(f, "Cos", [], [x]);
});

// maths.dm:122
rt.def("/proc/SimplifyDegrees", function SimplifyDegrees(f: Frame, degrees: Value) {
	if ((degrees = degrees % 360) < 0) {
		degrees += 360;
	}
	return degrees;
});

// maths.dm:129
rt.def("/proc/Wrap", function Wrap(f: Frame, val: Value, min: Value, max: Value) {
	let d: Value = max - min;
	let t: Value = round((val - min) / d);
	return val - t * d;
});

// maths.dm:137
rt.def("/proc/get_angle_of_incidence", function get_angle_of_incidence(f: Frame, face_angle: Value, angle_in: Value, auto_normalize: Value) {
	let $0: any;
	auto_normalize ??= 1;
	if (angle_in % 360 + (angle_in - round(angle_in, 1)) > 0) {
		$0 = angle_in % 360 + (angle_in - round(angle_in, 1));
	} else {
		$0 = angle_in % 360 + (angle_in - round(angle_in, 1)) + 360;
	}
	let angle_in_s: Value = $0;
	if (face_angle % 360 + (face_angle - round(face_angle, 1)) > 0) {
		$0 = face_angle % 360 + (face_angle - round(face_angle, 1));
	} else {
		$0 = face_angle % 360 + (face_angle - round(face_angle, 1)) + 360;
	}
	let face_angle_s: Value = $0;
	let incidence: Value = face_angle_s - angle_in_s;
	let incidence_s: Value = incidence;
	while (incidence_s < -90) {
		incidence_s += 180;
	}
	while (incidence_s > 90) {
		incidence_s -= 180;
	}
	if (auto_normalize) {
		return incidence_s;
	} else {
		return incidence;
	}
});

// maths.dm:154
rt.def("/proc/TransformUsingVariable", function TransformUsingVariable(f: Frame, input: Value, inputmaximum: Value, scaling_modifier: Value) {
	let size_factor: Value = null;
	scaling_modifier ??= 0;
	let inputToDegrees: Value = input / inputmaximum * 180;
	return (size_factor = (-rt.op(f, "Cos", [], [inputToDegrees]) + 1) / 2) + scaling_modifier;
});

// maths.dm:171
rt.def("/proc/gaussian", function gaussian(f: Frame, mean: Value, stddev: Value) {
	let R1: Value = null, R2: Value = null, working: Value = null;
	if (GLOB.gaussian_next !== null) {
		R1 = GLOB.gaussian_next;
		GLOB.gaussian_next = null;
	} else {
		while (true) {
			R1 = rand(-10000, 10000) / 10000;
			R2 = rand(-10000, 10000) / 10000;
			if (!((working = R1 * R1 + R2 * R2) >= 1 || working == 0)) break;
		}
		R1 *= (working = rt.op(f, "Sqrt", [], [-2 * rt.op(f, "LogE", [], [working]) / working]));
		GLOB.gaussian_next = R2 * working;
	}
	return mean + stddev * R1;
});
