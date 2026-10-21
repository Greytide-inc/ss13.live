// From code/__HELPERS/icons.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4807, "/icon", "/datum", {
	icon: null,
});

// /icon/proc/ChangeOpacity  (code/__HELPERS/icons.dm:221)
rt.def("/icon/proc/ChangeOpacity", function ChangeOpacity(f: Frame, opacity: Value) {
	f.vars = () => [opacity];
	if (live(opacity) === null) {
		opacity = 1;
	}
	rt.callSrc(f, "MapColors", [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, live(opacity), 0, 0, 0, 0]);
	return f.dot;
});

// /icon/proc/GrayScale  (code/__HELPERS/icons.dm:225)
rt.def("/icon/proc/GrayScale", function GrayScale(f: Frame) {
	rt.callSrc(f, "MapColors", [0.30000001192092896, 0.30000001192092896, 0.30000001192092896, 0.5899999737739563, 0.5899999737739563, 0.5899999737739563, 0.10999999940395355, 0.10999999940395355, 0.10999999940395355, 0, 0, 0]);
	return f.dot;
});

// /icon/proc/ColorTone  (code/__HELPERS/icons.dm:228)
rt.def("/icon/proc/ColorTone", function ColorTone(f: Frame, tone: Value) {
	let TONE: Value = null, gray: Value = null, upper: Value = null;
	let $0: any;
	f.vars = () => [TONE, gray, upper, $0];
	rt.callSrc(f, "GrayScale", []);
	TONE = rt.call(f, P("/proc/ReadRGB"), null, [live(tone)]);
	gray = rt.call(f, P("/proc/round"), null, [add(add(multiply(rt.index(live(TONE), 1), 0.30000001192092896), multiply(rt.index(live(TONE), 2), 0.5899999737739563)), multiply(rt.index(live(TONE), 3), 0.10999999940395355)), 1]);
	if (truthy(subtract(255, live(gray)))) {
		$0 = rt.new_(f, T("/icon"), [live(f.src)]);
	} else {
		$0 = null;
	}
	upper = $0;
	if (truthy(live(gray))) {
		rt.callSrc(f, "MapColors", [divide(255, live(gray)), 0, 0, 0, divide(255, live(gray)), 0, 0, 0, divide(255, live(gray)), 0, 0, 0]);
		rt.callSrc(f, "Blend", [live(tone), 2]);
	} else {
		rt.callSrc(f, "SetIntensity", [0]);
	}
	if (!truthy(subtract(255, live(gray)))) return f.dot;
	rt.callName(f, live(upper), "Blend", [rt.op(f, "Rgb", [1, 3], [live(gray), live(gray), live(gray)]), 1]);
	rt.callName(f, live(upper), "MapColors", [divide(subtract(255, rt.index(live(TONE), 1)), subtract(255, live(gray))), 0, 0, 0, 0, divide(subtract(255, rt.index(live(TONE), 2)), subtract(255, live(gray))), 0, 0, 0, 0, divide(subtract(255, rt.index(live(TONE), 3)), subtract(255, live(gray))), 0, 0, 0, 0, 0, 0, 0, 0, 1]);
	rt.callSrc(f, "Blend", [live(upper), 0]);
	return f.dot;
});

// /icon/proc/MinColors  (code/__HELPERS/icons.dm:246)
rt.def("/icon/proc/MinColors", function MinColors(f: Frame, icon: Value) {
	let I: Value = null;
	f.vars = () => [I];
	rt.callName(f, (I = rt.new_(f, T("/icon"), [live(f.src)])), "Opaque", []);
	rt.callName(f, live(I), "Blend", [live(icon), 1]);
	rt.callSrc(f, "Blend", [live(I), 1]);
	return f.dot;
});

// /icon/proc/MaxColors  (code/__HELPERS/icons.dm:254)
rt.def("/icon/proc/MaxColors", function MaxColors(f: Frame, icon: Value) {
	let I: Value = null, J: Value = null;
	f.vars = () => [I, J];
	I = null;
	if (truthy(rt.call(f, P("/proc/isicon"), null, [live(icon)]))) {
		I = rt.new_(f, T("/icon"), [live(icon)]);
	} else {
		rt.callName(f, (I = rt.new_(f, T("/icon"), [live(f.src)])), "Blend", ["#000000", 3]);
		rt.callName(f, live(I), "SwapColor", ["#000000", null]);
		rt.callName(f, live(I), "Blend", [live(icon), 3]);
	}
	rt.callName(f, (J = rt.new_(f, T("/icon"), [live(f.src)])), "Opaque", []);
	rt.callName(f, live(I), "Blend", [live(J), 1]);
	rt.callSrc(f, "Blend", [live(I), 5]);
	return f.dot;
});

// /icon/proc/Opaque  (code/__HELPERS/icons.dm:269)
rt.def("/icon/proc/Opaque", function Opaque(f: Frame, background: Value) {
	f.vars = () => [background];
	if (live(background) === null) {
		background = "#000000";
	}
	rt.callSrc(f, "SwapColor", [null, live(background)]);
	rt.callSrc(f, "MapColors", [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1]);
	return f.dot;
});

// /icon/proc/BecomeAlphaMask  (code/__HELPERS/icons.dm:275)
rt.def("/icon/proc/BecomeAlphaMask", function BecomeAlphaMask(f: Frame) {
	rt.callSrc(f, "SwapColor", [null, "#000000ff"]);
	rt.callSrc(f, "MapColors", [0, 0, 0, 0.30000001192092896, 0, 0, 0, 0.5899999737739563, 0, 0, 0, 0.10999999940395355, 0, 0, 0, 0, 1, 1, 1, 0]);
	return f.dot;
});

// /icon/proc/UseAlphaMask  (code/__HELPERS/icons.dm:279)
rt.def("/icon/proc/UseAlphaMask", function UseAlphaMask(f: Frame, mask: Value) {
	rt.callSrc(f, "Opaque", []);
	rt.callSrc(f, "AddAlphaMask", [live(mask)]);
	return f.dot;
});

// /icon/proc/AddAlphaMask  (code/__HELPERS/icons.dm:283)
rt.def("/icon/proc/AddAlphaMask", function AddAlphaMask(f: Frame, mask: Value) {
	let M: Value = null;
	f.vars = () => [M];
	rt.callName(f, (M = rt.new_(f, T("/icon"), [live(mask)])), "Blend", ["#ffffff", 1]);
	rt.callSrc(f, "Blend", [live(M), 0]);
	return f.dot;
});

// /proc/ReadRGB  (code/__HELPERS/icons.dm:311)
rt.def("/proc/ReadRGB", function ReadRGB(f: Frame, rgb: Value) {
	let i: Value = null, start: Value = null, ch: Value = null, which: Value = null, r: Value = null, _g: Value = null, b: Value = null, alpha: Value = null, usealpha: Value = null, digits: Value = null, single: Value = null;
	let $0: any;
	f.vars = () => [i, start, ch, which, r, _g, b, alpha, usealpha, digits, single, $0];
	if (!truthy(live(rgb))) {
		return live(f.dot);
	}
	i = 1;
	start = 1;
	if (isEqual(rt.call(f, P("/proc/text2ascii"), null, [live(rgb)]), 35)) {
		start = rt.inc(live(start), 1);
	}
	ch = null;
	which = 0;
	r = 0;
	_g = 0;
	b = 0;
	alpha = 0;
	usealpha = null;
	digits = 0;
	i = live(start);
	while (rt.le(live(i), rt.length(live(rgb)))) {
		if ((((rt.lt((ch = rt.call(f, P("/proc/text2ascii"), null, [live(rgb), live(i)])), 48) || (rt.gt(live(ch), 57) && rt.lt(live(ch), 65))) || (rt.gt(live(ch), 70) && rt.lt(live(ch), 97))) || rt.gt(live(ch), 102))) {
			break;
		}
		digits = rt.inc(live(digits), 1);
		if (isEqual(live(digits), 8)) {
			break;
		}
		i = rt.inc(live(i), 1);
	}
	single = (rt.lt(live(digits), 6) ? 1 : 0);
	if ((((!isEqual(live(digits), 3) && !isEqual(live(digits), 4)) && !isEqual(live(digits), 6)) && !isEqual(live(digits), 8))) {
		return live(f.dot);
	}
	if ((isEqual(live(digits), 4) || isEqual(live(digits), 8))) {
		usealpha = 1;
	}
	i = live(start);
	while (rt.gt(live(digits), 0)) {
		if ((rt.ge((ch = rt.call(f, P("/proc/text2ascii"), null, [live(rgb), live(i)])), 48) && rt.le(live(ch), 57))) {
			(ch = rt.modify(live(ch), 48, subtract));
		} else {
			if ((rt.ge(live(ch), 65) && rt.le(live(ch), 70))) {
				(ch = rt.modify(live(ch), 55, subtract));
			} else {
				if ((rt.ge(live(ch), 97) && rt.le(live(ch), 102))) {
					(ch = rt.modify(live(ch), 87, subtract));
				} else {
					break;
				}
			}
		}
		digits = rt.inc(live(digits), -1);
		$0 = live(which);
		if ($0 === 0) {
			r = rt.bitOr(rt.shiftLeft(live(r), 4), live(ch));
			if (truthy(live(single))) {
				(r = rt.modify(live(r), rt.shiftLeft(live(r), 4), rt.bitOr));
				which = rt.inc(live(which), 1);
			} else {
				if (!truthy(rt.bitAnd(live(digits), 1))) {
					which = rt.inc(live(which), 1);
				}
			}
		} else if ($0 === 1) {
			_g = rt.bitOr(rt.shiftLeft(live(_g), 4), live(ch));
			if (truthy(live(single))) {
				(_g = rt.modify(live(_g), rt.shiftLeft(live(_g), 4), rt.bitOr));
				which = rt.inc(live(which), 1);
			} else {
				if (!truthy(rt.bitAnd(live(digits), 1))) {
					which = rt.inc(live(which), 1);
				}
			}
		} else if ($0 === 2) {
			b = rt.bitOr(rt.shiftLeft(live(b), 4), live(ch));
			if (truthy(live(single))) {
				(b = rt.modify(live(b), rt.shiftLeft(live(b), 4), rt.bitOr));
				which = rt.inc(live(which), 1);
			} else {
				if (!truthy(rt.bitAnd(live(digits), 1))) {
					which = rt.inc(live(which), 1);
				}
			}
		} else if ($0 === 3) {
			alpha = rt.bitOr(rt.shiftLeft(live(alpha), 4), live(ch));
			if (truthy(live(single))) {
				(alpha = rt.modify(live(alpha), rt.shiftLeft(live(alpha), 4), rt.bitOr));
			}
		}
		i = rt.inc(live(i), 1);
	}
	f.dot = rt.list(live(r), live(_g), live(b));
	if (!truthy(live(usealpha))) return f.dot;
	f.dot = rt.modify(live(f.dot), live(alpha), add);
	return f.dot;
});

// /proc/ReadHSV  (code/__HELPERS/icons.dm:361)
rt.def("/proc/ReadHSV", function ReadHSV(f: Frame, hsv: Value) {
	let i: Value = null, start: Value = null, ch: Value = null, which: Value = null, hue: Value = null, sat: Value = null, val: Value = null, alpha: Value = null, usealpha: Value = null, digits: Value = null;
	let $0: any, $1: any;
	f.vars = () => [i, start, ch, which, hue, sat, val, alpha, usealpha, digits, $0, $1];
	if (!truthy(live(hsv))) {
		return live(f.dot);
	}
	i = 1;
	start = 1;
	if (isEqual(rt.call(f, P("/proc/text2ascii"), null, [live(hsv)]), 35)) {
		start = rt.inc(live(start), 1);
	}
	ch = null;
	which = 0;
	hue = 0;
	sat = 0;
	val = 0;
	alpha = 0;
	usealpha = null;
	digits = 0;
	i = live(start);
	while (rt.le(live(i), rt.length(live(hsv)))) {
		if ((((rt.lt((ch = rt.call(f, P("/proc/text2ascii"), null, [live(hsv), live(i)])), 48) || (rt.gt(live(ch), 57) && rt.lt(live(ch), 65))) || (rt.gt(live(ch), 70) && rt.lt(live(ch), 97))) || rt.gt(live(ch), 102))) {
			break;
		}
		digits = rt.inc(live(digits), 1);
		if (isEqual(live(digits), 9)) {
			break;
		}
		i = rt.inc(live(i), 1);
	}
	if (rt.gt(live(digits), 7)) {
		usealpha = 1;
	}
	if (rt.le(live(digits), 4)) {
		which = rt.inc(live(which), 1);
	}
	if (rt.le(live(digits), 2)) {
		which = rt.inc(live(which), 1);
	}
	i = live(start);
	while (rt.gt(live(digits), 0)) {
		if ((rt.ge((ch = rt.call(f, P("/proc/text2ascii"), null, [live(hsv), live(i)])), 48) && rt.le(live(ch), 57))) {
			(ch = rt.modify(live(ch), 48, subtract));
		} else {
			if ((rt.ge(live(ch), 65) && rt.le(live(ch), 70))) {
				(ch = rt.modify(live(ch), 55, subtract));
			} else {
				if ((rt.ge(live(ch), 97) && rt.le(live(ch), 102))) {
					(ch = rt.modify(live(ch), 87, subtract));
				} else {
					break;
				}
			}
		}
		digits = rt.inc(live(digits), -1);
		$0 = live(which);
		if ($0 === 0) {
			hue = rt.bitOr(rt.shiftLeft(live(hue), 4), live(ch));
			$0 = live(digits);
			if (truthy(live(usealpha))) {
				$1 = 6;
			} else {
				$1 = 4;
			}
			if (isEqual($0, $1)) {
				which = rt.inc(live(which), 1);
			}
		} else if ($0 === 1) {
			sat = rt.bitOr(rt.shiftLeft(live(sat), 4), live(ch));
			$0 = live(digits);
			if (truthy(live(usealpha))) {
				$1 = 4;
			} else {
				$1 = 2;
			}
			if (isEqual($0, $1)) {
				which = rt.inc(live(which), 1);
			}
		} else if ($0 === 2) {
			val = rt.bitOr(rt.shiftLeft(live(val), 4), live(ch));
			$0 = live(digits);
			if (truthy(live(usealpha))) {
				$1 = 2;
			} else {
				$1 = 0;
			}
			if (isEqual($0, $1)) {
				which = rt.inc(live(which), 1);
			}
		} else if ($0 === 3) {
			alpha = rt.bitOr(rt.shiftLeft(live(alpha), 4), live(ch));
		}
		i = rt.inc(live(i), 1);
	}
	f.dot = rt.list(live(hue), live(sat), live(val));
	if (!truthy(live(usealpha))) return f.dot;
	f.dot = rt.modify(live(f.dot), live(alpha), add);
	return f.dot;
});

// /proc/HSVtoRGB  (code/__HELPERS/icons.dm:400)
rt.def("/proc/HSVtoRGB", function HSVtoRGB(f: Frame, hsv: Value) {
	let HSV: Value = null, hue: Value = null, sat: Value = null, val: Value = null, hi: Value = null, mid: Value = null, lo: Value = null, r: Value = null, _g: Value = null, b: Value = null;
	let $0: any;
	f.vars = () => [HSV, hue, sat, val, hi, mid, lo, r, _g, b, $0];
	if (!truthy(live(hsv))) {
		return "#000000";
	}
	if (!truthy((HSV = rt.call(f, P("/proc/ReadHSV"), null, [live(hsv)])))) {
		return "#000000";
	}
	hue = rt.index(live(HSV), 1);
	sat = rt.index(live(HSV), 2);
	val = rt.index(live(HSV), 3);
	(hue = rt.modify(live(hue), rt.shiftRight(live(hue), 8), subtract));
	if (rt.ge(live(hue), 1530)) {
		(hue = rt.modify(live(hue), 1530, subtract));
	}
	hi = null;
	mid = null;
	lo = null;
	r = null;
	_g = null;
	b = null;
	hi = live(val);
	mid = add((lo = rt.call(f, P("/proc/round"), null, [divide(multiply(subtract(255, live(sat)), live(val)), 255), 1])), rt.call(f, P("/proc/round"), null, [divide(multiply(rt.op(f, "Abs", [], [subtract(rt.call(f, P("/proc/round"), null, [live(hue), 510]), live(hue))]), subtract(live(hi), live(lo))), 255), 1]));
	if (rt.ge(live(hue), 765)) {
		if (rt.ge(live(hue), 1275)) {
			r = live(hi);
			_g = live(lo);
			b = live(mid);
		} else {
			if (rt.ge(live(hue), 1020)) {
				r = live(mid);
				_g = live(lo);
				b = live(hi);
			} else {
				r = live(lo);
				_g = live(mid);
				b = live(hi);
			}
		}
	} else {
		if (rt.ge(live(hue), 510)) {
			r = live(lo);
			_g = live(hi);
			b = live(mid);
		} else {
			if (rt.ge(live(hue), 255)) {
				r = live(mid);
				_g = live(hi);
				b = live(lo);
			} else {
				r = live(hi);
				_g = live(mid);
				b = live(lo);
			}
		}
	}
	if (rt.gt(rt.len(f, live(HSV)), 3)) {
		$0 = rt.op(f, "Rgb", [1, 4], [live(r), live(_g), live(b), rt.index(live(HSV), 4)]);
	} else {
		$0 = rt.op(f, "Rgb", [1, 3], [live(r), live(_g), live(b)]);
	}
	return $0;
});

// /proc/RGBtoHSV  (code/__HELPERS/icons.dm:428)
rt.def("/proc/RGBtoHSV", function RGBtoHSV(f: Frame, rgb: Value) {
	let RGB: Value = null, r: Value = null, _g: Value = null, b: Value = null, hi: Value = null, lo: Value = null, val: Value = null, sat: Value = null, hue: Value = null, dir: Value = null, mid: Value = null;
	let $0: any, $1: any, $2: any, $3: any;
	f.vars = () => [RGB, r, _g, b, hi, lo, val, sat, hue, dir, mid, $0, $1, $2, $3];
	if (!truthy(live(rgb))) {
		return "#0000000";
	}
	if (!truthy((RGB = rt.call(f, P("/proc/ReadRGB"), null, [live(rgb)])))) {
		return "#0000000";
	}
	r = rt.index(live(RGB), 1);
	_g = rt.index(live(RGB), 2);
	b = rt.index(live(RGB), 3);
	hi = rt.call(f, P("/proc/max"), null, [live(r), live(_g), live(b)]);
	lo = rt.call(f, P("/proc/min"), null, [live(r), live(_g), live(b)]);
	val = live(hi);
	if (truthy(live(hi))) {
		$0 = rt.call(f, P("/proc/round"), null, [divide(multiply(subtract(live(hi), live(lo)), 255), live(hi)), 1]);
	} else {
		$0 = 0;
	}
	sat = $0;
	hue = 0;
	if (truthy(live(sat))) {
		dir = null;
		mid = null;
		if (isEqual(live(hi), live(r))) {
			if (isEqual(live(lo), live(b))) {
				hue = 0;
				dir = 1;
				mid = live(_g);
			} else {
				hue = 1535;
				dir = -1;
				mid = live(b);
			}
		} else {
			if (isEqual(live(hi), live(_g))) {
				if (isEqual(live(lo), live(r))) {
					hue = 512;
					dir = 1;
					mid = live(b);
				} else {
					hue = 511;
					dir = -1;
					mid = live(r);
				}
			} else {
				if (isEqual(live(hi), live(b))) {
					if (isEqual(live(lo), live(_g))) {
						hue = 1024;
						dir = 1;
						mid = live(r);
					} else {
						hue = 1023;
						dir = -1;
						mid = live(_g);
					}
				}
			}
		}
		hue = rt.modify(live(hue), multiply(live(dir), rt.call(f, P("/proc/round"), null, [divide(multiply(subtract(live(mid), live(lo)), 255), subtract(live(hi), live(lo))), 1])), add);
	}
	$0 = live(hue);
	$1 = live(sat);
	$2 = live(val);
	if (rt.gt(rt.len(f, live(RGB)), 3)) {
		$3 = rt.index(live(RGB), 4);
	} else {
		$3 = null;
	}
	return rt.call(f, P("/proc/hsv"), null, [$0, $1, $2, $3]);
});

// /proc/hsv  (code/__HELPERS/icons.dm:459)
rt.def("/proc/hsv", function hsv(f: Frame, hue: Value, sat: Value, val: Value, alpha: Value) {
	let $0: any, $1: any;
	f.vars = () => [hue, sat, val, alpha, $0, $1];
	if ((rt.lt(live(hue), 0) || rt.ge(live(hue), 1536))) {
		(hue = rt.modify(live(hue), 1536, rt.modulus));
	}
	if (rt.lt(live(hue), 0)) {
		hue = rt.modify(live(hue), 1536, add);
	}
	if (isEqual(rt.bitAnd(live(hue), 255), 255)) {
		hue = rt.inc(live(hue), 1);
		if (rt.ge(live(hue), 1536)) {
			hue = 0;
		}
	}
	if (rt.lt(live(sat), 0)) {
		sat = 0;
	}
	if (rt.gt(live(sat), 255)) {
		sat = 255;
	}
	if (rt.lt(live(val), 0)) {
		val = 0;
	}
	if (rt.gt(live(val), 255)) {
		val = 255;
	}
	f.dot = "#";
	$0 = rt.bitAnd(rt.shiftRight(live(hue), 8), 15);
	if (rt.lt(rt.bitAnd(rt.shiftRight(live(hue), 8), 15), 10)) {
		$1 = 48;
	} else {
		$1 = 87;
	}
	f.dot = rt.modify(live(f.dot), rt.call(f, P("/proc/ascii2text"), null, [add($0, $1)]), add);
	$0 = rt.bitAnd(rt.shiftRight(live(hue), 4), 15);
	if (rt.lt(rt.bitAnd(rt.shiftRight(live(hue), 4), 15), 10)) {
		$1 = 48;
	} else {
		$1 = 87;
	}
	f.dot = rt.modify(live(f.dot), rt.call(f, P("/proc/ascii2text"), null, [add($0, $1)]), add);
	$0 = rt.bitAnd(live(hue), 15);
	if (rt.lt(rt.bitAnd(live(hue), 15), 10)) {
		$1 = 48;
	} else {
		$1 = 87;
	}
	f.dot = rt.modify(live(f.dot), rt.call(f, P("/proc/ascii2text"), null, [add($0, $1)]), add);
	$0 = rt.bitAnd(rt.shiftRight(live(sat), 4), 15);
	if (rt.lt(rt.bitAnd(rt.shiftRight(live(sat), 4), 15), 10)) {
		$1 = 48;
	} else {
		$1 = 87;
	}
	f.dot = rt.modify(live(f.dot), rt.call(f, P("/proc/ascii2text"), null, [add($0, $1)]), add);
	$0 = rt.bitAnd(live(sat), 15);
	if (rt.lt(rt.bitAnd(live(sat), 15), 10)) {
		$1 = 48;
	} else {
		$1 = 87;
	}
	f.dot = rt.modify(live(f.dot), rt.call(f, P("/proc/ascii2text"), null, [add($0, $1)]), add);
	$0 = rt.bitAnd(rt.shiftRight(live(val), 4), 15);
	if (rt.lt(rt.bitAnd(rt.shiftRight(live(val), 4), 15), 10)) {
		$1 = 48;
	} else {
		$1 = 87;
	}
	f.dot = rt.modify(live(f.dot), rt.call(f, P("/proc/ascii2text"), null, [add($0, $1)]), add);
	$0 = rt.bitAnd(live(val), 15);
	if (rt.lt(rt.bitAnd(live(val), 15), 10)) {
		$1 = 48;
	} else {
		$1 = 87;
	}
	f.dot = rt.modify(live(f.dot), rt.call(f, P("/proc/ascii2text"), null, [add($0, $1)]), add);
	if (live(alpha) === null) return f.dot;
	if (rt.lt(live(alpha), 0)) {
		alpha = 0;
	}
	if (rt.gt(live(alpha), 255)) {
		alpha = 255;
	}
	$0 = rt.bitAnd(rt.shiftRight(live(alpha), 4), 15);
	if (rt.lt(rt.bitAnd(rt.shiftRight(live(alpha), 4), 15), 10)) {
		$1 = 48;
	} else {
		$1 = 87;
	}
	f.dot = rt.modify(live(f.dot), rt.call(f, P("/proc/ascii2text"), null, [add($0, $1)]), add);
	$0 = rt.bitAnd(live(alpha), 15);
	if (rt.lt(rt.bitAnd(live(alpha), 15), 10)) {
		$1 = 48;
	} else {
		$1 = 87;
	}
	f.dot = rt.modify(live(f.dot), rt.call(f, P("/proc/ascii2text"), null, [add($0, $1)]), add);
	return f.dot;
});

// /proc/BlendHSV  (code/__HELPERS/icons.dm:492)
rt.def("/proc/BlendHSV", function BlendHSV(f: Frame, hsv1: Value, hsv2: Value, amount: Value) {
	let HSV1: Value = null, HSV2: Value = null, usealpha: Value = null, hue_diff: Value = null, hue: Value = null, sat: Value = null, val: Value = null, alpha: Value = null;
	let $0: any;
	f.vars = () => [HSV1, HSV2, usealpha, hue_diff, hue, sat, val, alpha, $0];
	HSV1 = rt.call(f, P("/proc/ReadHSV"), null, [live(hsv1)]);
	HSV2 = rt.call(f, P("/proc/ReadHSV"), null, [live(hsv2)]);
	if (rt.lt(rt.len(f, live(HSV1)), rt.len(f, live(HSV2)))) {
		HSV1 = rt.modify(live(HSV1), 255, add);
	} else {
		if (rt.lt(rt.len(f, live(HSV2)), rt.len(f, live(HSV1)))) {
			HSV2 = rt.modify(live(HSV2), 255, add);
		}
	}
	usealpha = (rt.gt(rt.len(f, live(HSV1)), 3) ? 1 : 0);
	if (rt.gt(rt.index(live(HSV1), 1), 1536)) {
		(rt.modAt(live(HSV1), 1, 1536, rt.modulus));
	}
	if (rt.gt(rt.index(live(HSV2), 1), 1536)) {
		(rt.modAt(live(HSV2), 1, 1536, rt.modulus));
	}
	if (rt.lt(rt.index(live(HSV1), 1), 0)) {
		rt.modAt(live(HSV1), 1, 1536, add);
	}
	if (rt.lt(rt.index(live(HSV2), 1), 0)) {
		rt.modAt(live(HSV2), 1, 1536, add);
	}
	if (!truthy(rt.index(live(HSV1), 3))) {
		rt.setAt(live(HSV1), 1, 0);
		rt.setAt(live(HSV1), 2, 0);
	}
	if (!truthy(rt.index(live(HSV2), 3))) {
		rt.setAt(live(HSV2), 1, 0);
		rt.setAt(live(HSV2), 2, 0);
	}
	if (!truthy(rt.index(live(HSV1), 3))) {
		rt.setAt(live(HSV1), 2, rt.index(live(HSV2), 2));
	}
	if (!truthy(rt.index(live(HSV2), 3))) {
		rt.setAt(live(HSV2), 2, rt.index(live(HSV1), 2));
	}
	if (!truthy(rt.index(live(HSV1), 2))) {
		rt.setAt(live(HSV1), 1, rt.index(live(HSV2), 1));
	}
	if (!truthy(rt.index(live(HSV2), 2))) {
		rt.setAt(live(HSV2), 1, rt.index(live(HSV1), 1));
	}
	(rt.modAt(live(HSV1), 1, rt.shiftRight(rt.index(live(HSV1), 1), 8), subtract));
	(rt.modAt(live(HSV2), 1, rt.shiftRight(rt.index(live(HSV2), 1), 8), subtract));
	if (rt.gt((hue_diff = subtract(rt.index(live(HSV2), 1), rt.index(live(HSV1), 1))), 765)) {
		(hue_diff = rt.modify(live(hue_diff), 1530, subtract));
	} else {
		if (rt.le(live(hue_diff), -765)) {
			hue_diff = rt.modify(live(hue_diff), 1530, add);
		}
	}
	hue = rt.call(f, P("/proc/round"), null, [add(rt.index(live(HSV1), 1), multiply(live(hue_diff), live(amount))), 1]);
	sat = rt.call(f, P("/proc/round"), null, [add(rt.index(live(HSV1), 2), multiply(subtract(rt.index(live(HSV2), 2), rt.index(live(HSV1), 2)), live(amount))), 1]);
	val = rt.call(f, P("/proc/round"), null, [add(rt.index(live(HSV1), 3), multiply(subtract(rt.index(live(HSV2), 3), rt.index(live(HSV1), 3)), live(amount))), 1]);
	if (truthy(live(usealpha))) {
		$0 = rt.call(f, P("/proc/round"), null, [add(rt.index(live(HSV1), 4), multiply(subtract(rt.index(live(HSV2), 4), rt.index(live(HSV1), 4)), live(amount))), 1]);
	} else {
		$0 = null;
	}
	alpha = $0;
	if ((rt.lt(live(hue), 0) || rt.ge(live(hue), 1530))) {
		(hue = rt.modify(live(hue), 1530, rt.modulus));
	}
	if (rt.lt(live(hue), 0)) {
		hue = rt.modify(live(hue), 1530, add);
	}
	return rt.call(f, P("/proc/hsv"), null, [(hue = rt.modify(live(hue), rt.call(f, P("/proc/round"), null, [divide(live(hue), 255)]), add)), live(sat), live(val), live(alpha)]);
});

// /proc/BlendRGB  (code/__HELPERS/icons.dm:546)
rt.def("/proc/BlendRGB", function BlendRGB(f: Frame, rgb1: Value, rgb2: Value, amount: Value) {
	let RGB1: Value = null, RGB2: Value = null, usealpha: Value = null, r: Value = null, _g: Value = null, b: Value = null, alpha: Value = null;
	let $0: any;
	f.vars = () => [RGB1, RGB2, usealpha, r, _g, b, alpha, $0];
	RGB1 = rt.call(f, P("/proc/ReadRGB"), null, [live(rgb1)]);
	RGB2 = rt.call(f, P("/proc/ReadRGB"), null, [live(rgb2)]);
	if (rt.lt(rt.len(f, live(RGB1)), rt.len(f, live(RGB2)))) {
		RGB1 = rt.modify(live(RGB1), 255, add);
	} else {
		if (rt.lt(rt.len(f, live(RGB2)), rt.len(f, live(RGB1)))) {
			RGB2 = rt.modify(live(RGB2), 255, add);
		}
	}
	usealpha = (rt.gt(rt.len(f, live(RGB1)), 3) ? 1 : 0);
	r = rt.call(f, P("/proc/round"), null, [add(rt.index(live(RGB1), 1), multiply(subtract(rt.index(live(RGB2), 1), rt.index(live(RGB1), 1)), live(amount))), 1]);
	_g = rt.call(f, P("/proc/round"), null, [add(rt.index(live(RGB1), 2), multiply(subtract(rt.index(live(RGB2), 2), rt.index(live(RGB1), 2)), live(amount))), 1]);
	b = rt.call(f, P("/proc/round"), null, [add(rt.index(live(RGB1), 3), multiply(subtract(rt.index(live(RGB2), 3), rt.index(live(RGB1), 3)), live(amount))), 1]);
	if (truthy(live(usealpha))) {
		$0 = rt.call(f, P("/proc/round"), null, [add(rt.index(live(RGB1), 4), multiply(subtract(rt.index(live(RGB2), 4), rt.index(live(RGB1), 4)), live(amount))), 1]);
	} else {
		$0 = null;
	}
	if ((alpha = $0) === null) {
		$0 = rt.op(f, "Rgb", [1, 3], [live(r), live(_g), live(b)]);
	} else {
		$0 = rt.op(f, "Rgb", [1, 4], [live(r), live(_g), live(b), live(alpha)]);
	}
	return $0;
});

// /proc/BlendRGBasHSV  (code/__HELPERS/icons.dm:562)
rt.def("/proc/BlendRGBasHSV", function BlendRGBasHSV(f: Frame, rgb1: Value, rgb2: Value, amount: Value) {
	return rt.call(f, P("/proc/HSVtoRGB"), null, [rt.call(f, P("/proc/RGBtoHSV"), null, [live(rgb1)]), rt.call(f, P("/proc/RGBtoHSV"), null, [live(rgb2)]), live(amount)]);
});

// /proc/HueToAngle  (code/__HELPERS/icons.dm:566)
rt.def("/proc/HueToAngle", function HueToAngle(f: Frame, hue: Value) {
	f.vars = () => [hue];
	if ((rt.lt(live(hue), 0) || rt.ge(live(hue), 1536))) {
		(hue = rt.modify(live(hue), 1536, rt.modulus));
	}
	if (rt.lt(live(hue), 0)) {
		hue = rt.modify(live(hue), 1536, add);
	}
	(hue = rt.modify(live(hue), rt.shiftRight(live(hue), 8), subtract));
	return divide(live(hue), 4.25);
});

// /proc/AngleToHue  (code/__HELPERS/icons.dm:574)
rt.def("/proc/AngleToHue", function AngleToHue(f: Frame, angle: Value) {
	let hue: Value = null;
	f.vars = () => [angle, hue];
	if ((rt.lt(live(angle), 0) || rt.ge(live(angle), 360))) {
		(angle = rt.modify(live(angle), multiply(360, rt.call(f, P("/proc/round"), null, [divide(live(angle), 360)])), subtract));
	}
	return (hue = rt.modify(live(hue), rt.call(f, P("/proc/round"), null, [divide((hue = multiply(live(angle), 4.25)), 255)]), add));
});

// /proc/RotateHue  (code/__HELPERS/icons.dm:583)
rt.def("/proc/RotateHue", function RotateHue(f: Frame, hsv: Value, angle: Value) {
	let HSV: Value = null;
	let $0: any, $1: any, $2: any, $3: any;
	f.vars = () => [angle, HSV, $0, $1, $2, $3];
	if (rt.ge(rt.index((HSV = rt.call(f, P("/proc/ReadHSV"), null, [live(hsv)])), 1), 1536)) {
		(rt.modAt(live(HSV), 1, 1536, rt.modulus));
	}
	if (rt.lt(rt.index(live(HSV), 1), 0)) {
		rt.modAt(live(HSV), 1, 1536, add);
	}
	(rt.modAt(live(HSV), 1, rt.shiftRight(rt.index(live(HSV), 1), 8), subtract));
	if ((rt.lt(live(angle), 0) || rt.ge(live(angle), 360))) {
		(angle = rt.modify(live(angle), multiply(360, rt.call(f, P("/proc/round"), null, [divide(live(angle), 360)])), subtract));
	}
	rt.setAt(live(HSV), 1, rt.call(f, P("/proc/round"), null, [add(rt.index(live(HSV), 1), multiply(live(angle), 4.25)), 1]));
	if ((rt.lt(rt.index(live(HSV), 1), 0) || rt.ge(rt.index(live(HSV), 1), 1530))) {
		(rt.modAt(live(HSV), 1, 1530, rt.modulus));
	}
	if (rt.lt(rt.index(live(HSV), 1), 0)) {
		rt.modAt(live(HSV), 1, 1530, add);
	}
	rt.modAt(live(HSV), 1, rt.call(f, P("/proc/round"), null, [divide(rt.index(live(HSV), 1), 255)]), add);
	$0 = rt.index(live(HSV), 1);
	$1 = rt.index(live(HSV), 2);
	$2 = rt.index(live(HSV), 3);
	if (rt.gt(rt.len(f, live(HSV)), 3)) {
		$3 = rt.index(live(HSV), 4);
	} else {
		$3 = null;
	}
	return rt.call(f, P("/proc/hsv"), null, [$0, $1, $2, $3]);
});

// /proc/GrayScale  (code/__HELPERS/icons.dm:605)
rt.def("/proc/GrayScale", function GrayScale(f: Frame, rgb: Value) {
	let RGB: Value = null, gray: Value = null;
	let $0: any;
	f.vars = () => [RGB, gray, $0];
	RGB = rt.call(f, P("/proc/ReadRGB"), null, [live(rgb)]);
	gray = add(add(multiply(rt.index(live(RGB), 1), 0.30000001192092896), multiply(rt.index(live(RGB), 2), 0.5899999737739563)), multiply(rt.index(live(RGB), 3), 0.10999999940395355));
	if (rt.gt(rt.len(f, live(RGB)), 3)) {
		$0 = rt.op(f, "Rgb", [1, 4], [live(gray), live(gray), live(gray), rt.index(live(RGB), 4)]);
	} else {
		$0 = rt.op(f, "Rgb", [1, 3], [live(gray), live(gray), live(gray)]);
	}
	return $0;
});

// /proc/ColorTone  (code/__HELPERS/icons.dm:611)
rt.def("/proc/ColorTone", function ColorTone(f: Frame, rgb: Value, tone: Value) {
	let RGB: Value = null, TONE: Value = null, gray: Value = null, tone_gray: Value = null;
	f.vars = () => [RGB, TONE, gray, tone_gray];
	RGB = rt.call(f, P("/proc/ReadRGB"), null, [live(rgb)]);
	TONE = rt.call(f, P("/proc/ReadRGB"), null, [live(tone)]);
	gray = add(add(multiply(rt.index(live(RGB), 1), 0.30000001192092896), multiply(rt.index(live(RGB), 2), 0.5899999737739563)), multiply(rt.index(live(RGB), 3), 0.10999999940395355));
	tone_gray = add(add(multiply(rt.index(live(TONE), 1), 0.30000001192092896), multiply(rt.index(live(TONE), 2), 0.5899999737739563)), multiply(rt.index(live(TONE), 3), 0.10999999940395355));
	if (rt.le(live(gray), live(tone_gray))) {
		return rt.call(f, P("/proc/BlendRGB"), null, ["#000000", live(tone), divide(live(gray), (live(tone_gray) || 1))]);
	}
	return rt.call(f, P("/proc/BlendRGB"), null, [live(tone), "#ffffff", divide(subtract(live(gray), live(tone_gray)), (subtract(255, live(tone_gray)) || 1))]);
});

// /proc/GetColors  (code/__HELPERS/icons.dm:623)
rt.def("/proc/GetColors", function GetColors(f: Frame, hex: Value) {
	let hi1: Value = null, lo1: Value = null, hi2: Value = null, lo2: Value = null, hi3: Value = null, lo3: Value = null, hi4: Value = null, lo4: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any;
	f.vars = () => [hex, hi1, lo1, hi2, lo2, hi3, lo3, hi4, lo4, $0, $1, $2, $3, $4];
	if (isEqual(rt.length((hex = rt.call(f, P("/proc/uppertext"), null, [live(hex)]))), 7)) {
		hex = rt.modify(live(hex), "FF", add);
	}
	hi1 = rt.call(f, P("/proc/text2ascii"), null, [live(hex), 2]);
	lo1 = rt.call(f, P("/proc/text2ascii"), null, [live(hex), 3]);
	hi2 = rt.call(f, P("/proc/text2ascii"), null, [live(hex), 4]);
	lo2 = rt.call(f, P("/proc/text2ascii"), null, [live(hex), 5]);
	hi3 = rt.call(f, P("/proc/text2ascii"), null, [live(hex), 6]);
	lo3 = rt.call(f, P("/proc/text2ascii"), null, [live(hex), 7]);
	hi4 = rt.call(f, P("/proc/text2ascii"), null, [live(hex), 8]);
	lo4 = rt.call(f, P("/proc/text2ascii"), null, [live(hex), 9]);
	if (rt.ge(live(hi1), 65)) {
		$0 = subtract(live(hi1), 55);
	} else {
		$0 = subtract(live(hi1), 48);
	}
	$0 = rt.shiftLeft($0, 4);
	if (rt.ge(live(lo1), 65)) {
		$1 = subtract(live(lo1), 55);
	} else {
		$1 = subtract(live(lo1), 48);
	}
	$0 = rt.bitOr($0, $1);
	if (rt.ge(live(hi2), 65)) {
		$1 = subtract(live(hi2), 55);
	} else {
		$1 = subtract(live(hi2), 48);
	}
	$1 = rt.shiftLeft($1, 4);
	if (rt.ge(live(lo2), 65)) {
		$2 = subtract(live(lo2), 55);
	} else {
		$2 = subtract(live(lo2), 48);
	}
	$1 = rt.bitOr($1, $2);
	if (rt.ge(live(hi3), 65)) {
		$2 = subtract(live(hi3), 55);
	} else {
		$2 = subtract(live(hi3), 48);
	}
	$2 = rt.shiftLeft($2, 4);
	if (rt.ge(live(lo3), 65)) {
		$3 = subtract(live(lo3), 55);
	} else {
		$3 = subtract(live(lo3), 48);
	}
	$2 = rt.bitOr($2, $3);
	if (rt.ge(live(hi4), 65)) {
		$3 = subtract(live(hi4), 55);
	} else {
		$3 = subtract(live(hi4), 48);
	}
	$3 = rt.shiftLeft($3, 4);
	if (rt.ge(live(lo4), 65)) {
		$4 = subtract(live(lo4), 55);
	} else {
		$4 = subtract(live(lo4), 48);
	}
	return rt.list($0, $1, $2, rt.bitOr($3, $4));
});

// /proc/getFlatIcon  (code/__HELPERS/icons.dm:650)
rt.def("/proc/getFlatIcon", function getFlatIcon(f: Frame, A: Value, defdir: Value, deficon: Value, defstate: Value, defblend: Value) {
	let flat: Value = null, noIcon: Value = null, curicon: Value = null, curstate: Value = null, curdir: Value = null, curblend: Value = null, layers: Value = null, copy: Value = null, process: Value = null, pSet: Value = null, curIndex: Value = null, current: Value = null, currentLayer: Value = null, compare: Value = null, cmpIndex: Value = null, _add: Value = null, flatX1: Value = null, flatX2: Value = null, flatY1: Value = null, flatY2: Value = null, addX1: Value = null, addX2: Value = null, addY1: Value = null, addY2: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [defdir, deficon, defstate, defblend, flat, noIcon, curicon, curstate, curdir, curblend, layers, copy, process, pSet, curIndex, current, currentLayer, compare, cmpIndex, _add, flatX1, flatX2, flatY1, flatY2, addX1, addX2, addY1, addY2, I, $e];
	if (live(defdir) === null) {
		defdir = rt.fv(f, "dir", live(A));
	}
	if (live(deficon) === null) {
		deficon = rt.fv(f, "icon", live(A));
	}
	if (live(defstate) === null) {
		defstate = rt.fv(f, "icon_state", live(A));
	}
	if (live(defblend) === null) {
		defblend = rt.fv(f, "blend_mode", live(A));
	}
	flat = rt.call(f, P("/proc/icon"), null, [rt.rsc("icons/effects/effects.dmi"), "nothing"]);
	if (!truthy(live(A))) {
		return live(flat);
	}
	if (rt.le(rt.fv(f, "alpha", live(A)), 0)) {
		return live(flat);
	}
	noIcon = 0;
	curicon = null;
	if (truthy(rt.fv(f, "icon", live(A)))) {
		curicon = rt.fv(f, "icon", live(A));
	} else {
		curicon = live(deficon);
	}
	if (!truthy(live(curicon))) {
		noIcon = 1;
	}
	curstate = null;
	if (truthy(rt.fv(f, "icon_state", live(A)))) {
		curstate = rt.fv(f, "icon_state", live(A));
	} else {
		curstate = live(defstate);
	}
	if ((!truthy(live(noIcon)) && !truthy((rt.isIn(f, live(curstate), rt.call(f, P("/proc/icon_states"), null, [live(curicon)])) ? 1 : 0)))) {
		if (truthy((rt.isIn(f, "", rt.call(f, P("/proc/icon_states"), null, [live(curicon)])) ? 1 : 0))) {
			curstate = "";
		} else {
			noIcon = 1;
		}
	}
	curdir = null;
	if (!isEqual(rt.fv(f, "dir", live(A)), 2)) {
		curdir = rt.fv(f, "dir", live(A));
	} else {
		curdir = live(defdir);
	}
	curblend = null;
	if (isEqual(rt.fv(f, "blend_mode", live(A)), 0)) {
		curblend = live(defblend);
	} else {
		curblend = rt.fv(f, "blend_mode", live(A));
	}
	layers = rt.list();
	copy = null;
	if (!truthy(live(noIcon))) {
		rt.setFv(f, "color", (copy = rt.call(f, P("/proc/image"), null, ["icon", live(curicon), "icon_state", live(curstate), "layer", rt.fv(f, "layer", live(A)), "dir", live(curdir)], rt.Args.Named)), rt.fv(f, "color", live(A)));
		rt.setFv(f, "alpha", live(copy), rt.fv(f, "alpha", live(A)));
		rt.setFv(f, "blend_mode", live(copy), live(curblend));
		rt.setAt(live(layers), live(copy), rt.fv(f, "layer", live(A)));
	}
	process = rt.fv(f, "underlays", live(A));
	pSet = 0;
	curIndex = 1;
	current = null;
	currentLayer = null;
	compare = null;
	cmpIndex = null;
	while (true) {
		if (rt.le(live(curIndex), rt.len(f, live(process)))) {
			if (!truthy((current = rt.index(live(process), live(curIndex))))) {
				curIndex = rt.inc(live(curIndex), 1);
				continue;
			}
			if (rt.lt((currentLayer = rt.fv(f, "layer", live(current))), 0)) {
				if (rt.le(live(currentLayer), -1000)) {
					return live(flat);
				}
				if (isEqual(live(pSet), 0)) {
					currentLayer = add(rt.fv(f, "layer", live(A)), divide(live(currentLayer), 1000));
				} else {
					currentLayer = add(rt.fv(f, "layer", live(A)), divide(add(1000, live(currentLayer)), 1000));
				}
			}
			cmpIndex = 1;
			while (rt.le(live(cmpIndex), rt.len(f, live(layers)))) {
				compare = rt.index(live(layers), live(cmpIndex));
				if (rt.lt(live(currentLayer), rt.index(live(layers), live(compare)))) {
					rt.callName(f, live(layers), "Insert", [live(cmpIndex), live(current)]);
					rt.setAt(live(layers), live(current), live(currentLayer));
					break;
				}
				cmpIndex = rt.inc(live(cmpIndex), 1);
			}
			if (rt.gt(live(cmpIndex), rt.len(f, live(layers)))) {
				rt.setAt(live(layers), live(current), live(currentLayer));
			}
			curIndex = rt.inc(live(curIndex), 1);
		}
		if (rt.gt(live(curIndex), rt.len(f, live(process)))) {
			if (isEqual(live(pSet), 0)) {
				curIndex = 1;
				pSet = 1;
				process = rt.fv(f, "overlays", live(A));
			} else {
				break;
			}
		}
	}
	_add = null;
	flatX1 = 1;
	flatX2 = rt.callName(f, live(flat), "Width", []);
	flatY1 = 1;
	flatY2 = rt.callName(f, live(flat), "Height", []);
	addX1 = null;
	addX2 = null;
	addY1 = null;
	addY2 = null;
	I = null;
	rt.forList(f, 0, live(layers));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (isEqual(rt.fv(f, "alpha", live(I)), 0)) {
			continue;
		}
		if (isEqual(live(I), live(copy))) {
			curblend = 1;
			_add = rt.call(f, P("/proc/icon"), null, [rt.fv(f, "icon", live(I)), rt.fv(f, "icon_state", live(I)), rt.fv(f, "dir", live(I))]);
		} else {
			_add = rt.call(f, P("/proc/getFlatIcon"), null, [rt.new_(f, T("/image"), [live(I)]), live(curdir), live(curicon), live(curstate), live(curblend)]);
		}
		addX1 = rt.call(f, P("/proc/min"), null, [live(flatX1), add(rt.fv(f, "pixel_x", live(I)), 1)]);
		addX2 = rt.call(f, P("/proc/max"), null, [live(flatX2), add(rt.fv(f, "pixel_x", live(I)), rt.callName(f, live(_add), "Width", []))]);
		addY1 = rt.call(f, P("/proc/min"), null, [live(flatY1), add(rt.fv(f, "pixel_y", live(I)), 1)]);
		addY2 = rt.call(f, P("/proc/max"), null, [live(flatY2), add(rt.fv(f, "pixel_y", live(I)), rt.callName(f, live(_add), "Height", []))]);
		if ((((!isEqual(live(addX1), live(flatX1)) || !isEqual(live(addX2), live(flatX2))) || !isEqual(live(addY1), live(flatY1))) || !isEqual(live(addY2), live(flatY2)))) {
			rt.callName(f, live(flat), "Crop", [add(subtract(live(addX1), live(flatX1)), 1), add(subtract(live(addY1), live(flatY1)), 1), add(subtract(live(addX2), live(flatX1)), 1), add(subtract(live(addY2), live(flatY1)), 1)]);
			flatX1 = live(addX1);
			flatX2 = live(addX2);
			flatY1 = live(addY1);
			flatY2 = live(addY2);
		}
		rt.callName(f, live(flat), "Blend", [live(_add), rt.call(f, P("/proc/blendMode2iconMode"), null, [live(curblend)]), subtract(add(rt.fv(f, "pixel_x", live(I)), 2), live(flatX1)), subtract(add(rt.fv(f, "pixel_y", live(I)), 2), live(flatY1))]);
	}
	rt.endFor(f, 0);
	if (truthy(rt.fv(f, "color", live(A)))) {
		rt.callName(f, live(flat), "Blend", [rt.fv(f, "color", live(A)), 2]);
	}
	if (rt.lt(rt.fv(f, "alpha", live(A)), 255)) {
		rt.callName(f, live(flat), "Blend", [rt.op(f, "Rgb", [1, 4], [255, 255, 255, rt.fv(f, "alpha", live(A))]), 2]);
	}
	return rt.call(f, P("/proc/icon"), null, [live(flat), "", 2]);
});

// /proc/getIconMask  (code/__HELPERS/icons.dm:784)
rt.def("/proc/getIconMask", function getIconMask(f: Frame, A: Value) {
	let alpha_mask: Value = null, I: Value = null, image_overlay: Value = null;
	let $e: any;
	f.vars = () => [alpha_mask, I, image_overlay, $e];
	alpha_mask = rt.new_(f, T("/icon"), [rt.fv(f, "icon", live(A)), rt.fv(f, "icon_state", live(A))]);
	I = null;
	rt.forList(f, 0, rt.fv(f, "overlays", live(A)));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (rt.gt(rt.fv(f, "layer", live(I)), rt.fv(f, "layer", live(A)))) {
			continue;
		}
		image_overlay = rt.new_(f, T("/icon"), [rt.fv(f, "icon", live(I)), rt.fv(f, "icon_state", live(I))]);
		rt.callName(f, live(alpha_mask), "Blend", [live(image_overlay), 5]);
	}
	rt.endFor(f, 0);
	return live(alpha_mask);
});

// /mob/proc/AddCamoOverlay  (code/__HELPERS/icons.dm:794)
rt.def("/mob/proc/AddCamoOverlay", function AddCamoOverlay(f: Frame, A: Value) {
	let opacity_icon: Value = null, alpha_mask: Value = null, i: Value = null, I: Value = null;
	let $0: any;
	f.vars = () => [opacity_icon, alpha_mask, i, I, $0];
	opacity_icon = rt.new_(f, T("/icon"), [rt.fv(f, "icon", live(A)), rt.fv(f, "icon_state", live(A))]);
	alpha_mask = rt.call(f, P("/proc/getIconMask"), null, [live(f.src)]);
	rt.callName(f, live(opacity_icon), "AddAlphaMask", [live(alpha_mask)]);
	rt.callName(f, live(opacity_icon), "ChangeOpacity", [0.4000000059604645]);
	i = null;
	i = 0;
	while (rt.lt(live(i), 5)) {
		I = rt.call(f, P("/proc/image"), null, ["icon", live(opacity_icon), "icon_state", rt.fv(f, "icon_state", live(A)), "layer", add(rt.sv(f, "layer"), 0.800000011920929)], rt.Args.Named);
		$0 = live(i);
		if ($0 === 1) {
			rt.incField(f, live(I), "pixel_x", -1, true);
		} else if ($0 === 2) {
			rt.incField(f, live(I), "pixel_x", 1, true);
		} else if ($0 === 3) {
			rt.incField(f, live(I), "pixel_y", -1, true);
		} else if ($0 === 4) {
			rt.incField(f, live(I), "pixel_y", 1, true);
		}
		rt.callSrc(f, "add_overlay", [live(I)]);
		i = rt.inc(live(i), 1);
	}
	return f.dot;
});

// /proc/getHologramIcon  (code/__HELPERS/icons.dm:814)
rt.def("/proc/getHologramIcon", function getHologramIcon(f: Frame, A: Value, safety: Value) {
	let flat_icon: Value = null, alpha_mask: Value = null;
	let $0: any;
	f.vars = () => [safety, flat_icon, alpha_mask, $0];
	if (live(safety) === null) {
		safety = 1;
	}
	if (truthy(live(safety))) {
		$0 = live(A);
	} else {
		$0 = rt.new_(f, T("/icon"), [live(A)]);
	}
	rt.callName(f, (flat_icon = $0), "ColorTone", ["#7db4e1"]);
	rt.callName(f, live(flat_icon), "ChangeOpacity", [0.5]);
	alpha_mask = rt.new_(f, T("/icon"), [rt.rsc("icons/effects/effects.dmi"), "scanline"]);
	rt.callName(f, live(flat_icon), "AddAlphaMask", [live(alpha_mask)]);
	return live(flat_icon);
});

// /proc/build_composite_icon  (code/__HELPERS/icons.dm:823)
rt.def("/proc/build_composite_icon", function build_composite_icon(f: Frame, A: Value) {
	let composite: Value = null, O: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [composite, O, I, $e];
	composite = rt.call(f, P("/proc/icon"), null, [rt.fv(f, "icon", live(A)), rt.fv(f, "icon_state", live(A)), rt.fv(f, "dir", live(A)), 1]);
	O = null;
	rt.forList(f, 0, rt.fv(f, "overlays", live(A)));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		I = live(O);
		rt.callName(f, live(composite), "Blend", [rt.call(f, P("/proc/icon"), null, [rt.fv(f, "icon", live(I)), rt.fv(f, "icon_state", live(I)), rt.fv(f, "dir", live(I)), 1]), 3]);
	}
	rt.endFor(f, 0);
	return live(composite);
});

// /proc/getStaticIcon  (code/__HELPERS/icons.dm:833)
rt.def("/proc/getStaticIcon", function getStaticIcon(f: Frame, A: Value, safety: Value) {
	let flat_icon: Value = null, static_icon: Value = null;
	let $0: any;
	f.vars = () => [safety, flat_icon, static_icon, $0];
	if (live(safety) === null) {
		safety = 1;
	}
	if (truthy(live(safety))) {
		$0 = live(A);
	} else {
		$0 = rt.new_(f, T("/icon"), [live(A)]);
	}
	rt.callName(f, (flat_icon = $0), "Blend", ["#ffffff"]);
	rt.callName(f, live(flat_icon), "BecomeAlphaMask", []);
	rt.callName(f, (static_icon = rt.new_(f, T("/icon"), [rt.rsc("icons/effects/effects.dmi"), "static_base"])), "AddAlphaMask", [live(flat_icon)]);
	return live(static_icon);
});

// /proc/getBlankIcon  (code/__HELPERS/icons.dm:844)
rt.def("/proc/getBlankIcon", function getBlankIcon(f: Frame, A: Value, safety: Value) {
	let flat_icon: Value = null, blank_icon: Value = null;
	let $0: any;
	f.vars = () => [safety, flat_icon, blank_icon, $0];
	if (live(safety) === null) {
		safety = 1;
	}
	if (truthy(live(safety))) {
		$0 = live(A);
	} else {
		$0 = rt.new_(f, T("/icon"), [live(A)]);
	}
	rt.callName(f, (flat_icon = $0), "Blend", ["#ffffff"]);
	rt.callName(f, live(flat_icon), "BecomeAlphaMask", []);
	rt.callName(f, (blank_icon = rt.new_(f, T("/icon"), [rt.rsc("icons/effects/effects.dmi"), "blank_base"])), "AddAlphaMask", [live(flat_icon)]);
	return live(blank_icon);
});

// /proc/getLetterImage  (code/__HELPERS/icons.dm:855)  may sleep
rt.def("/proc/getLetterImage", function* getLetterImage(f: Frame, A: Value, letter: Value, uppercase: Value) {
	let atom_icon: Value = null, text_image: Value = null;
	f.vars = () => [A, letter, uppercase, atom_icon, text_image];
	if (live(letter) === null) {
		letter = "";
	}
	if (live(uppercase) === null) {
		uppercase = 0;
	}
	if (!truthy(live(A))) {
		return live(f.dot);
	}
	atom_icon = (yield* g.new_(f, T("/icon"), [rt.fv(f, "icon", live(A)), rt.fv(f, "icon_state", live(A))]));
	if (!truthy(live(letter))) {
		letter = (yield* g.call(f, P("/proc/copytext"), null, [rt.fv(f, "name", live(A)), 1, 2]));
		if (isEqual(live(uppercase), 1)) {
			letter = (yield* g.call(f, P("/proc/uppertext"), null, [live(letter)]));
		} else {
			if (isEqual(live(uppercase), -1)) {
				letter = (yield* g.call(f, P("/proc/lowertext"), null, [live(letter)]));
			}
		}
	}
	rt.setFv(f, "maptext", (text_image = (yield* g.new_(f, T("/image"), ["loc", live(A)], rt.Args.Named))), fmt("<font size = 4>＀</font>", [live(letter)]));
	rt.setFv(f, "pixel_x", live(text_image), 7);
	rt.setFv(f, "pixel_y", live(text_image), 5);
	yield* g.call(f, P("/proc/qdel"), null, [live(atom_icon)]);
	return live(text_image);
}, true);

// /datum/controller/global_vars/proc/InitGlobalfriendly_animal_types  (code/__HELPERS/icons.dm:874)
rt.def("/datum/controller/global_vars/proc/InitGlobalfriendly_animal_types", function InitGlobalfriendly_animal_types(f: Frame) {
	rt.setGl("friendly_animal_types", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "friendly_animal_types", add);
	return f.dot;
});

// /proc/getRandomAnimalImage  (code/__HELPERS/icons.dm:878)
rt.def("/proc/getRandomAnimalImage", function getRandomAnimalImage(f: Frame, A: Value) {
	let _T: Value = null, SA: Value = null, SA_0: Value = null, icon: Value = null, icon_state: Value = null, final_image: Value = null;
	let $e: any;
	f.vars = () => [_T, SA, SA_0, icon, icon_state, final_image, $e];
	if (!truthy(rt.len(f, rt.gl("friendly_animal_types")))) {
		_T = null;
		rt.forList(f, 0, rt.call(f, P("/proc/typesof"), null, [T("/mob/living/simple_animal")]));
		while (($e = rt.next(f, 0)) !== undefined) {
			_T = $e;
			if (isEqual(rt.initial(f, (SA = live(_T)), "gold_core_spawnable"), 2)) {
				rt.modGl("friendly_animal_types", live(SA), add);
			}
		}
		rt.endFor(f, 0);
	}
	SA_0 = rt.op(f, "PickUnweighted", [1], [rt.gl("friendly_animal_types")]);
	icon = rt.initial(f, live(SA_0), "icon");
	icon_state = rt.initial(f, live(SA_0), "icon_state");
	final_image = rt.call(f, P("/proc/image"), null, [null, live(icon), "icon_state", live(icon_state), "loc", live(A)], rt.Args.Named);
	if (truthy(rt.call(f, P("/proc/ispath"), null, [live(SA_0), T("/mob/living/simple_animal/butterfly")]))) {
		rt.setFv(f, "color", live(final_image), rt.op(f, "Rgb", [1, 3], [rt.call(f, P("/proc/rand"), null, [0, 255]), rt.call(f, P("/proc/rand"), null, [0, 255]), rt.call(f, P("/proc/rand"), null, [0, 255])]));
	}
	rt.setFv(f, "text", live(final_image), rt.initial(f, live(SA_0), "name"));
	return live(final_image);
});

// /proc/DrawPixel  (code/__HELPERS/icons.dm:902)
rt.def("/proc/DrawPixel", function DrawPixel(f: Frame, I: Value, colour: Value, drawX: Value, drawY: Value) {
	let Iwidth: Value = null, Iheight: Value = null;
	f.vars = () => [Iwidth, Iheight];
	if (!truthy(live(I))) {
		return 0;
	}
	Iwidth = rt.callName(f, live(I), "Width", []);
	Iheight = rt.callName(f, live(I), "Height", []);
	if ((rt.gt(live(drawX), live(Iwidth)) || rt.le(live(drawX), 0))) {
		return 0;
	}
	if ((rt.gt(live(drawY), live(Iheight)) || rt.le(live(drawY), 0))) {
		return 0;
	}
	rt.callName(f, live(I), "DrawBox", [live(colour), live(drawX), live(drawY)]);
	return live(I);
});

// /atom/proc/DrawPixelOn  (code/__HELPERS/icons.dm:919)
rt.def("/atom/proc/DrawPixelOn", function DrawPixelOn(f: Frame, colour: Value, drawX: Value, drawY: Value) {
	let I: Value = null, J: Value = null;
	f.vars = () => [I, J];
	I = rt.new_(f, T("/icon"), [rt.sv(f, "icon")]);
	if (truthy((J = rt.call(f, P("/proc/DrawPixel"), null, [live(I), live(colour), live(drawX), live(drawY)])))) {
		rt.setSv(f, "icon", live(J));
		return live(J);
	}
	return 0;
});

// /proc/get_flat_human_icon  (code/__HELPERS/icons.dm:929)  may sleep
rt.def("/proc/get_flat_human_icon", function* get_flat_human_icon(f: Frame, icon_id: Value, J: Value, prefs: Value) {
	let body: Value = null, out_icon: Value = null, partial: Value = null;
	f.vars = () => [icon_id, J, prefs, body, out_icon, partial];
	if ((!truthy(live(icon_id)) || !truthy(rt.index(rt.gl("humanoid_icon_cache"), live(icon_id))))) {
		body = (yield* g.new_(f, T("/mob/living/carbon/human/dummy"), []));
		if (truthy(live(prefs))) {
			yield* g.callName(f, live(prefs), "copy_to", [live(body)]);
		}
		if (truthy(live(J))) {
			yield* g.callName(f, live(J), "equip", [live(body), 1, 0]);
		}
		yield* g.callName(f, rt.gl("SSoverlays"), "Flush", []);
		out_icon = (yield* g.call(f, P("/proc/icon"), null, [rt.rsc("icons/effects/effects.dmi"), "nothing"]));
		yield* g.callName(f, live(body), "setDir", [1]);
		partial = (yield* g.call(f, P("/proc/getFlatIcon"), null, [live(body)]));
		yield* g.callName(f, live(out_icon), "Insert", [null, live(partial), "dir", 1], rt.Args.Named);
		yield* g.callName(f, live(body), "setDir", [2]);
		partial = (yield* g.call(f, P("/proc/getFlatIcon"), null, [live(body)]));
		yield* g.callName(f, live(out_icon), "Insert", [null, live(partial), "dir", 2], rt.Args.Named);
		yield* g.callName(f, live(body), "setDir", [8]);
		partial = (yield* g.call(f, P("/proc/getFlatIcon"), null, [live(body)]));
		yield* g.callName(f, live(out_icon), "Insert", [null, live(partial), "dir", 8], rt.Args.Named);
		yield* g.callName(f, live(body), "setDir", [4]);
		partial = (yield* g.call(f, P("/proc/getFlatIcon"), null, [live(body)]));
		yield* g.callName(f, live(out_icon), "Insert", [null, live(partial), "dir", 4], rt.Args.Named);
		yield* g.call(f, P("/proc/qdel"), null, [live(body)]);
		rt.setAt(rt.gl("humanoid_icon_cache"), live(icon_id), live(out_icon));
		return live(out_icon);
	} else {
		return rt.index(rt.gl("humanoid_icon_cache"), live(icon_id));
	}
	return f.dot;
}, true);

// /image/proc/setDir  (code/__HELPERS/icons.dm:969)
rt.def("/image/proc/setDir", function setDir(f: Frame, newdir: Value) {
	rt.setSv(f, "dir", live(newdir));
	return f.dot;
});

// /atom/proc/freeze_icon_index  (code/__HELPERS/icons.dm:972)
rt.def("/atom/proc/freeze_icon_index", function freeze_icon_index(f: Frame) {
	return fmt("＃-＀", [rt.initial(f, live(f.src), "icon"), rt.initial(f, live(f.src), "icon_state")]);
});

// /obj/proc/make_frozen_visual  (code/__HELPERS/icons.dm:977)
rt.def("/obj/proc/make_frozen_visual", function make_frozen_visual(f: Frame) {
	let index: Value = null, IC: Value = null, _P: Value = null, iconstate: Value = null, O: Value = null;
	let $0: any, $e: any;
	f.vars = () => [index, IC, _P, iconstate, O, $0, $e];
	if (truthy(rt.fv(f, "secondary_flags", live(f.src)))) {
		$0 = rt.index(rt.fv(f, "secondary_flags", live(f.src)), "frozen");
	} else {
		$0 = 0;
	}
	if (!(!truthy($0) && (truthy(rt.initial(f, live(f.src), "icon")) && truthy(rt.initial(f, live(f.src), "icon_state"))))) return f.dot;
	index = rt.callSrc(f, "freeze_icon_index", []);
	IC = null;
	if (!truthy((_P = rt.index(rt.gl("freeze_item_icons"), live(index))))) {
		_P = rt.new_(f, T("/icon"), []);
		iconstate = null;
		rt.forList(f, 0, rt.call(f, P("/proc/icon_states"), null, [rt.sv(f, "icon")]));
		while (($e = rt.next(f, 0)) !== undefined) {
			iconstate = $e;
			O = rt.new_(f, T("/icon"), [rt.rsc("icons/effects/freeze.dmi"), "ice_cube"]);
			IC = rt.new_(f, T("/icon"), [rt.sv(f, "icon"), live(iconstate)]);
			rt.callName(f, live(O), "Blend", [live(IC), 0]);
			rt.callName(f, live(_P), "Insert", [live(O), live(iconstate)]);
		}
		rt.endFor(f, 0);
		rt.setAt(rt.gl("freeze_item_icons"), live(index), live(_P));
	}
	rt.setSv(f, "icon", live(_P));
	rt.setSv(f, "name", fmt("frozen ＀", [rt.sv(f, "name")]));
	if (!truthy(rt.fv(f, "secondary_flags", live(f.src)))) {
		rt.setFv(f, "secondary_flags", live(f.src), rt.list());
	}
	rt.setAt(rt.fv(f, "secondary_flags", live(f.src)), "frozen", 1);
	return f.dot;
});

// /obj/proc/make_unfrozen  (code/__HELPERS/icons.dm:995)
rt.def("/obj/proc/make_unfrozen", function make_unfrozen(f: Frame) {
	rt.setSv(f, "icon", rt.initial(f, live(f.src), "icon"));
	rt.setSv(f, "name", rt.call(f, P("/proc/replacetext"), null, [rt.sv(f, "name"), "frozen ", ""]));
	if (!truthy(rt.fv(f, "secondary_flags", live(f.src)))) return f.dot;
	rt.setAt(rt.fv(f, "secondary_flags", live(f.src)), "frozen", null);
	return f.dot;
});
