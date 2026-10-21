// From code/__HELPERS/maths.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalE  (code/__HELPERS/maths.dm:3)
rt.def("/datum/controller/global_vars/proc/InitGlobalE", function InitGlobalE(f: Frame) {
	rt.setGl("E", 2.7182817459106445);
	rt.modSrcVar(f, "gvars_datum_init_order", "E", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalSqrt2  (code/__HELPERS/maths.dm:4)
rt.def("/datum/controller/global_vars/proc/InitGlobalSqrt2", function InitGlobalSqrt2(f: Frame) {
	rt.setGl("Sqrt2", 1.4142135381698608);
	rt.modSrcVar(f, "gvars_datum_init_order", "Sqrt2", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalsqrtTable  (code/__HELPERS/maths.dm:7)
rt.def("/datum/controller/global_vars/proc/InitGlobalsqrtTable", function InitGlobalsqrtTable(f: Frame) {
	rt.setGl("sqrtTable", rt.list(1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 10));
	rt.modSrcVar(f, "gvars_datum_init_order", "sqrtTable", add);
	return f.dot;
});

// /proc/sign  (code/__HELPERS/maths.dm:13)
rt.def("/proc/sign", function sign(f: Frame, x: Value) {
	let $0: any;
	f.vars = () => [$0];
	if (!isEqual(live(x), 0)) {
		$0 = divide(live(x), rt.op(f, "Abs", [], [live(x)]));
	} else {
		$0 = 0;
	}
	return $0;
});

// /proc/Atan2  (code/__HELPERS/maths.dm:16)
rt.def("/proc/Atan2", function Atan2(f: Frame, x: Value, y: Value) {
	let a: Value = null;
	let $0: any;
	f.vars = () => [a, $0];
	if ((!truthy(live(x)) && !truthy(live(y)))) {
		return 0;
	}
	a = rt.op(f, "ArcCos", [], [divide(live(x), rt.op(f, "Sqrt", [], [add(multiply(live(x), live(x)), multiply(live(y), live(y)))]))]);
	if (rt.ge(live(y), 0)) {
		$0 = live(a);
	} else {
		$0 = rt.neg(live(a));
	}
	return $0;
});

// /proc/Ceiling  (code/__HELPERS/maths.dm:21)
rt.def("/proc/Ceiling", function Ceiling(f: Frame, x: Value, y: Value) {
	f.vars = () => [y];
	if (live(y) === null) {
		y = 1;
	}
	return multiply(rt.neg(rt.call(f, P("/proc/round"), null, [divide(rt.neg(live(x)), live(y))])), live(y));
});

// /proc/Floor  (code/__HELPERS/maths.dm:24)
rt.def("/proc/Floor", function Floor(f: Frame, x: Value, y: Value) {
	f.vars = () => [y];
	if (live(y) === null) {
		y = 1;
	}
	return multiply(rt.call(f, P("/proc/round"), null, [divide(live(x), live(y))]), live(y));
});

// /proc/Cot  (code/__HELPERS/maths.dm:30)
rt.def("/proc/Cot", function Cot(f: Frame, x: Value) {
	return divide(1, rt.call(f, P("/proc/Tan"), null, [live(x)]));
});

// /proc/Csc  (code/__HELPERS/maths.dm:34)
rt.def("/proc/Csc", function Csc(f: Frame, x: Value) {
	return divide(1, rt.op(f, "Sin", [], [live(x)]));
});

// /proc/Default  (code/__HELPERS/maths.dm:37)
rt.def("/proc/Default", function Default(f: Frame, a: Value, b: Value) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy(live(a))) {
		$0 = live(a);
	} else {
		$0 = live(b);
	}
	return $0;
});

// /proc/Gcd  (code/__HELPERS/maths.dm:41)
rt.def("/proc/Gcd", function Gcd(f: Frame, a: Value, b: Value) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy(live(b))) {
		$0 = rt.call(f, P("/proc/Gcd"), null, [live(b), rt.modulus(live(a), live(b))]);
	} else {
		$0 = live(a);
	}
	return $0;
});

// /proc/Inverse  (code/__HELPERS/maths.dm:44)
rt.def("/proc/Inverse", function Inverse(f: Frame, x: Value) {
	return divide(1, live(x));
});

// /proc/IsAboutEqual  (code/__HELPERS/maths.dm:47)
rt.def("/proc/IsAboutEqual", function IsAboutEqual(f: Frame, a: Value, b: Value, deviation: Value) {
	f.vars = () => [deviation];
	if (live(deviation) === null) {
		deviation = 0.10000000149011612;
	}
	return (rt.le(rt.op(f, "Abs", [], [subtract(live(a), live(b))]), live(deviation)) ? 1 : 0);
});

// /proc/IsEven  (code/__HELPERS/maths.dm:50)
rt.def("/proc/IsEven", function IsEven(f: Frame, x: Value) {
	return (isEqual(rt.modulus(live(x), 2), 0) ? 1 : 0);
});

// /proc/IsInRange  (code/__HELPERS/maths.dm:54)
rt.def("/proc/IsInRange", function IsInRange(f: Frame, val: Value, min: Value, max: Value) {
	return ((rt.le(live(min), live(val)) ? 1 : 0) && (rt.le(live(val), live(max)) ? 1 : 0));
});

// /proc/IsInteger  (code/__HELPERS/maths.dm:57)
rt.def("/proc/IsInteger", function IsInteger(f: Frame, x: Value) {
	return (isEqual(rt.call(f, P("/proc/round"), null, [live(x)]), live(x)) ? 1 : 0);
});

// /proc/IsOdd  (code/__HELPERS/maths.dm:60)
rt.def("/proc/IsOdd", function IsOdd(f: Frame, x: Value) {
	return (!truthy(rt.call(f, P("/proc/IsEven"), null, [live(x)])) ? 1 : 0);
});

// /proc/IsMultiple  (code/__HELPERS/maths.dm:63)
rt.def("/proc/IsMultiple", function IsMultiple(f: Frame, x: Value, y: Value) {
	return (isEqual(rt.modulus(live(x), live(y)), 0) ? 1 : 0);
});

// /proc/Lcm  (code/__HELPERS/maths.dm:67)
rt.def("/proc/Lcm", function Lcm(f: Frame, a: Value, b: Value) {
	return multiply(divide(rt.op(f, "Abs", [], [live(a)]), rt.call(f, P("/proc/Gcd"), null, [live(a), live(b)])), rt.op(f, "Abs", [], [live(b)]));
});

// /proc/Lerp  (code/__HELPERS/maths.dm:73)
rt.def("/proc/Lerp", function Lerp(f: Frame, a: Value, b: Value, amount: Value) {
	f.vars = () => [amount];
	if (live(amount) === null) {
		amount = 0.5;
	}
	return add(live(a), multiply(subtract(live(b), live(a)), live(amount)));
});

// /proc/Sum  (code/__HELPERS/maths.dm:78)
rt.def("/proc/Sum", function Sum(f: Frame, data: Value) {
	let val: Value = null;
	let $e: any;
	f.vars = () => [val, $e];
	f.dot = 0;
	val = null;
	rt.forList(f, 0, live(data));
	while (($e = rt.next(f, 0)) !== undefined) {
		val = $e;
		f.dot = rt.modify(live(f.dot), live(val), add);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /proc/Mean  (code/__HELPERS/maths.dm:83)
rt.def("/proc/Mean", function Mean(f: Frame, data: Value) {
	f.dot = divide(rt.call(f, P("/proc/Sum"), null, [live(data)]), rt.len(f, live(data)));
	return f.dot;
});

// /proc/Root  (code/__HELPERS/maths.dm:88)
rt.def("/proc/Root", function Root(f: Frame, n: Value, x: Value) {
	return rt.power(live(x), divide(1, live(n)));
});

// /proc/Sec  (code/__HELPERS/maths.dm:92)
rt.def("/proc/Sec", function Sec(f: Frame, x: Value) {
	return divide(1, rt.op(f, "Cos", [], [live(x)]));
});

// /proc/SolveQuadratic  (code/__HELPERS/maths.dm:97)
rt.def("/proc/SolveQuadratic", function SolveQuadratic(f: Frame, a: Value, b: Value, c: Value) {
	let d: Value = null, bottom: Value = null, root: Value = null;
	let $0: any;
	f.vars = () => [d, bottom, root, $0];
	if (truthy(live(a))) {
		$0 = null;
	} else {
		$0 = rt.call(f, P("/proc/CRASH"), null, ["Assertion Failed: a"]);
	}
	f.dot = rt.list();
	d = subtract(multiply(live(b), live(b)), multiply(multiply(4, live(a)), live(c)));
	bottom = multiply(2, live(a));
	if (rt.lt(live(d), 0)) {
		return live(f.dot);
	}
	root = rt.op(f, "Sqrt", [], [live(d)]);
	f.dot = rt.modify(live(f.dot), divide(add(rt.neg(live(b)), live(root)), live(bottom)), add);
	if (!truthy(live(d))) {
		return live(f.dot);
	}
	f.dot = rt.modify(live(f.dot), divide(subtract(rt.neg(live(b)), live(root)), live(bottom)), add);
	return f.dot;
});

// /proc/Tan  (code/__HELPERS/maths.dm:109)
rt.def("/proc/Tan", function Tan(f: Frame, x: Value) {
	return divide(rt.op(f, "Sin", [], [live(x)]), rt.op(f, "Cos", [], [live(x)]));
});

// /proc/ToDegrees  (code/__HELPERS/maths.dm:113)
rt.def("/proc/ToDegrees", function ToDegrees(f: Frame, radians: Value) {
	return multiply(live(radians), 57.295780181884766);
});

// /proc/ToRadians  (code/__HELPERS/maths.dm:117)
rt.def("/proc/ToRadians", function ToRadians(f: Frame, degrees: Value) {
	return multiply(live(degrees), 0.01745329238474369);
});

// /proc/SimplifyDegrees  (code/__HELPERS/maths.dm:122)
rt.def("/proc/SimplifyDegrees", function SimplifyDegrees(f: Frame, degrees: Value) {
	f.vars = () => [degrees];
	if (rt.lt((degrees = rt.modulus(live(degrees), 360)), 0)) {
		degrees = rt.modify(live(degrees), 360, add);
	}
	return live(degrees);
});

// /proc/Wrap  (code/__HELPERS/maths.dm:129)
rt.def("/proc/Wrap", function Wrap(f: Frame, val: Value, min: Value, max: Value) {
	let d: Value = null, t: Value = null;
	f.vars = () => [d, t];
	d = subtract(live(max), live(min));
	t = rt.call(f, P("/proc/round"), null, [divide(subtract(live(val), live(min)), live(d))]);
	return subtract(live(val), multiply(live(t), live(d)));
});

// /proc/get_angle_of_incidence  (code/__HELPERS/maths.dm:137)
rt.def("/proc/get_angle_of_incidence", function get_angle_of_incidence(f: Frame, face_angle: Value, angle_in: Value, auto_normalize: Value) {
	let angle_in_s: Value = null, face_angle_s: Value = null, incidence: Value = null, incidence_s: Value = null;
	let $0: any;
	f.vars = () => [auto_normalize, angle_in_s, face_angle_s, incidence, incidence_s, $0];
	if (live(auto_normalize) === null) {
		auto_normalize = 1;
	}
	if (rt.gt(add(rt.modulus(live(angle_in), 360), subtract(live(angle_in), rt.call(f, P("/proc/round"), null, [live(angle_in), 1]))), 0)) {
		$0 = add(rt.modulus(live(angle_in), 360), subtract(live(angle_in), rt.call(f, P("/proc/round"), null, [live(angle_in), 1])));
	} else {
		$0 = add(add(rt.modulus(live(angle_in), 360), subtract(live(angle_in), rt.call(f, P("/proc/round"), null, [live(angle_in), 1]))), 360);
	}
	angle_in_s = $0;
	if (rt.gt(add(rt.modulus(live(face_angle), 360), subtract(live(face_angle), rt.call(f, P("/proc/round"), null, [live(face_angle), 1]))), 0)) {
		$0 = add(rt.modulus(live(face_angle), 360), subtract(live(face_angle), rt.call(f, P("/proc/round"), null, [live(face_angle), 1])));
	} else {
		$0 = add(add(rt.modulus(live(face_angle), 360), subtract(live(face_angle), rt.call(f, P("/proc/round"), null, [live(face_angle), 1]))), 360);
	}
	face_angle_s = $0;
	incidence = subtract(live(face_angle_s), live(angle_in_s));
	incidence_s = live(incidence);
	while (rt.lt(live(incidence_s), -90)) {
		incidence_s = rt.modify(live(incidence_s), 180, add);
	}
	while (rt.gt(live(incidence_s), 90)) {
		(incidence_s = rt.modify(live(incidence_s), 180, subtract));
	}
	if (truthy(live(auto_normalize))) {
		return live(incidence_s);
	} else {
		return live(incidence);
	}
	return f.dot;
});

// /proc/TransformUsingVariable  (code/__HELPERS/maths.dm:154)
rt.def("/proc/TransformUsingVariable", function TransformUsingVariable(f: Frame, input: Value, inputmaximum: Value, scaling_modifier: Value) {
	let inputToDegrees: Value = null, size_factor: Value = null;
	f.vars = () => [scaling_modifier, inputToDegrees, size_factor];
	if (live(scaling_modifier) === null) {
		scaling_modifier = 0;
	}
	inputToDegrees = multiply(divide(live(input), live(inputmaximum)), 180);
	return add((size_factor = divide(add(rt.neg(rt.op(f, "Cos", [], [live(inputToDegrees)])), 1), 2)), live(scaling_modifier));
});

// /proc/gaussian  (code/__HELPERS/maths.dm:171)
rt.def("/proc/gaussian", function gaussian(f: Frame, mean: Value, stddev: Value) {
	let R1: Value = null, R2: Value = null, working: Value = null;
	f.vars = () => [R1, R2, working];
	R1 = null;
	R2 = null;
	working = null;
	if (rt.gl("gaussian_next") !== null) {
		R1 = rt.gl("gaussian_next");
		rt.setGl("gaussian_next", null);
	} else {
		while (true) {
			R1 = divide(rt.call(f, P("/proc/rand"), null, [-10000, 10000]), 10000);
			R2 = divide(rt.call(f, P("/proc/rand"), null, [-10000, 10000]), 10000);
			if (!(rt.ge((working = add(multiply(live(R1), live(R1)), multiply(live(R2), live(R2)))), 1) || isEqual(live(working), 0))) break;
		}
		(R1 = rt.modify(live(R1), (working = rt.op(f, "Sqrt", [], [divide(multiply(-2, rt.op(f, "LogE", [], [live(working)])), live(working))])), multiply));
		rt.setGl("gaussian_next", multiply(live(R2), live(working)));
	}
	return add(live(mean), multiply(live(stddev), live(R1)));
});
