// From code/__HELPERS/type2type.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/hex2num  (code/__HELPERS/type2type.dm:17)
rt.def("/proc/hex2num", function hex2num(f: Frame, hex: Value) {
	let negative: Value = null, len: Value = null, i: Value = null, num: Value = null;
	let $0: any;
	f.vars = () => [negative, len, i, num, $0];
	f.dot = 0;
	if (truthy(rt.call(f, P("/proc/istext"), null, [live(hex)]))) {
		negative = 0;
		len = rt.length(live(hex));
		i = null;
		i = 1;
		while (rt.le(live(i), live(len))) {
			blk46: {
				$0 = (num = rt.call(f, P("/proc/text2ascii"), null, [live(hex), live(i)]));
				if (rt.inRange($0, 48, 57)) {
					(num = rt.modify(live(num), 48, subtract));
				} else if (rt.inRange($0, 97, 102)) {
					(num = rt.modify(live(num), 87, subtract));
				} else if (rt.inRange($0, 65, 70)) {
					(num = rt.modify(live(num), 55, subtract));
				} else if ($0 === 45) {
					negative = 1;
				} else {
					if (truthy(live(num))) {
						break;
					}
					break blk46;
				}
				(f.dot = rt.modify(live(f.dot), 16, multiply));
				f.dot = rt.modify(live(f.dot), live(num), add);
			}
			i = rt.inc(live(i), 1);
		}
		if (truthy(live(negative))) {
			(f.dot = rt.modify(live(f.dot), -1, multiply));
		}
	}
	return live(f.dot);
});

// /proc/num2hex  (code/__HELPERS/type2type.dm:49)
rt.def("/proc/num2hex", function num2hex(f: Frame, num: Value, len: Value) {
	let i: Value = null, remainder: Value = null;
	let $0: any;
	f.vars = () => [num, len, i, remainder, $0];
	if (live(len) === null) {
		len = 2;
	}
	if (!truthy(rt.call(f, P("/proc/isnum"), null, [live(num)]))) {
		num = 0;
	}
	num = rt.call(f, P("/proc/round"), null, [rt.op(f, "Abs", [], [live(num)])]);
	f.dot = "";
	i = 0;
	while (true) {
		if (rt.le(live(len), 0)) {
			if (!truthy(live(num))) {
				break;
			}
		} else {
			if (rt.ge(live(i), live(len))) {
				break;
			}
		}
		num = rt.call(f, P("/proc/round"), null, [(remainder = divide(live(num), 16))]);
		$0 = (remainder = multiply(subtract(live(remainder), live(num)), 16));
		if ($0 === 9 || $0 === 8 || $0 === 7 || $0 === 6 || $0 === 5 || $0 === 4 || $0 === 3 || $0 === 2 || $0 === 1) {
			f.dot = add(fmt("＀", [live(remainder)]), live(f.dot));
		} else if ($0 === 10 || $0 === 11 || $0 === 12 || $0 === 13 || $0 === 14 || $0 === 15) {
			f.dot = add(rt.call(f, P("/proc/ascii2text"), null, [add(live(remainder), 87)]), live(f.dot));
		} else {
			f.dot = add("0", live(f.dot));
		}
		i = rt.inc(live(i), 1);
	}
	return live(f.dot);
});

// /world/proc/file2list  (code/__HELPERS/type2type.dm:76)
rt.def("/world/proc/file2list", function file2list(f: Frame, filename: Value, seperator: Value) {
	f.vars = () => [seperator];
	if (live(seperator) === null) {
		seperator = "\n";
	}
	return rt.call(f, P("/proc/splittext"), null, [rt.call(f, P("/proc/file2text"), null, [live(filename)]), live(seperator)]);
});

// /proc/dir2text  (code/__HELPERS/type2type.dm:80)
rt.def("/proc/dir2text", function dir2text(f: Frame, direction: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(direction);
	if ($0 === 1) {
		return "north";
	} else if ($0 === 2) {
		return "south";
	} else if ($0 === 4) {
		return "east";
	} else if ($0 === 8) {
		return "west";
	} else if ($0 === 5) {
		return "northeast";
	} else if ($0 === 6) {
		return "southeast";
	} else if ($0 === 9) {
		return "northwest";
	} else if ($0 === 10) {
		return "southwest";
	}
	return live(f.dot);
});

// /proc/text2dir  (code/__HELPERS/type2type.dm:102)
rt.def("/proc/text2dir", function text2dir(f: Frame, direction: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.call(f, P("/proc/uppertext"), null, [live(direction)]);
	if ($0 === "NORTH") {
		return 1;
	} else if ($0 === "SOUTH") {
		return 2;
	} else if ($0 === "EAST") {
		return 4;
	} else if ($0 === "WEST") {
		return 8;
	} else if ($0 === "NORTHEAST") {
		return 5;
	} else if ($0 === "NORTHWEST") {
		return 9;
	} else if ($0 === "SOUTHEAST") {
		return 6;
	} else if ($0 === "SOUTHWEST") {
		return 10;
	}
	return live(f.dot);
});

// /proc/angle2dir  (code/__HELPERS/type2type.dm:125)
rt.def("/proc/angle2dir", function angle2dir(f: Frame, degree: Value) {
	f.vars = () => [degree];
	if (rt.lt((degree = rt.call(f, P("/proc/SimplifyDegrees"), null, [live(degree)])), 45)) {
		return 1;
	}
	if (rt.lt(live(degree), 90)) {
		return 5;
	}
	if (rt.lt(live(degree), 135)) {
		return 4;
	}
	if (rt.lt(live(degree), 180)) {
		return 6;
	}
	if (rt.lt(live(degree), 225)) {
		return 2;
	}
	if (rt.lt(live(degree), 270)) {
		return 10;
	}
	if (rt.lt(live(degree), 315)) {
		return 8;
	}
	return 9;
});

// /proc/dir2angle  (code/__HELPERS/type2type.dm:146)
rt.def("/proc/dir2angle", function dir2angle(f: Frame, D: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(D);
	if ($0 === 1) {
		return 0;
	} else if ($0 === 2) {
		return 180;
	} else if ($0 === 4) {
		return 90;
	} else if ($0 === 8) {
		return 270;
	} else if ($0 === 5) {
		return 45;
	} else if ($0 === 6) {
		return 135;
	} else if ($0 === 9) {
		return 315;
	} else if ($0 === 10) {
		return 225;
	} else {
		return null;
	}
	return f.dot;
});

// /proc/angle2text  (code/__HELPERS/type2type.dm:168)
rt.def("/proc/angle2text", function angle2text(f: Frame, degree: Value) {
	return rt.call(f, P("/proc/dir2text"), null, [rt.call(f, P("/proc/angle2dir"), null, [live(degree)])]);
});

// /proc/blendMode2iconMode  (code/__HELPERS/type2type.dm:172)
rt.def("/proc/blendMode2iconMode", function blendMode2iconMode(f: Frame, blend_mode: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(blend_mode);
	if ($0 === 4) {
		return 2;
	} else if ($0 === 2) {
		return 0;
	} else if ($0 === 3) {
		return 1;
	} else {
		return 3;
	}
	return f.dot;
});

// /proc/rights2text  (code/__HELPERS/type2type.dm:184)
rt.def("/proc/rights2text", function rights2text(f: Frame, rights: Value, seperator: Value, adds: Value, subs: Value) {
	let verbpath: Value = null;
	let $e: any;
	f.vars = () => [seperator, verbpath, $e];
	if (live(seperator) === null) {
		seperator = "";
	}
	if (truthy(rt.bitAnd(live(rights), 1))) {
		f.dot = rt.modify(live(f.dot), fmt("＀+BUILDMODE", [live(seperator)]), add);
	}
	if (truthy(rt.bitAnd(live(rights), 2))) {
		f.dot = rt.modify(live(f.dot), fmt("＀+ADMIN", [live(seperator)]), add);
	}
	if (truthy(rt.bitAnd(live(rights), 4))) {
		f.dot = rt.modify(live(f.dot), fmt("＀+BAN", [live(seperator)]), add);
	}
	if (truthy(rt.bitAnd(live(rights), 8))) {
		f.dot = rt.modify(live(f.dot), fmt("＀+FUN", [live(seperator)]), add);
	}
	if (truthy(rt.bitAnd(live(rights), 16))) {
		f.dot = rt.modify(live(f.dot), fmt("＀+SERVER", [live(seperator)]), add);
	}
	if (truthy(rt.bitAnd(live(rights), 32))) {
		f.dot = rt.modify(live(f.dot), fmt("＀+DEBUG", [live(seperator)]), add);
	}
	if (truthy(rt.bitAnd(live(rights), 64))) {
		f.dot = rt.modify(live(f.dot), fmt("＀+POSSESS", [live(seperator)]), add);
	}
	if (truthy(rt.bitAnd(live(rights), 128))) {
		f.dot = rt.modify(live(f.dot), fmt("＀+PERMISSIONS", [live(seperator)]), add);
	}
	if (truthy(rt.bitAnd(live(rights), 256))) {
		f.dot = rt.modify(live(f.dot), fmt("＀+STEALTH", [live(seperator)]), add);
	}
	if (truthy(rt.bitAnd(live(rights), 512))) {
		f.dot = rt.modify(live(f.dot), fmt("＀+POLL", [live(seperator)]), add);
	}
	if (truthy(rt.bitAnd(live(rights), 1024))) {
		f.dot = rt.modify(live(f.dot), fmt("＀+VAREDIT", [live(seperator)]), add);
	}
	if (truthy(rt.bitAnd(live(rights), 2048))) {
		f.dot = rt.modify(live(f.dot), fmt("＀+SOUND", [live(seperator)]), add);
	}
	if (truthy(rt.bitAnd(live(rights), 4096))) {
		f.dot = rt.modify(live(f.dot), fmt("＀+SPAWN", [live(seperator)]), add);
	}
	verbpath = null;
	rt.forList(f, 0, live(adds));
	while (($e = rt.next(f, 0)) !== undefined) {
		verbpath = $e;
		f.dot = rt.modify(live(f.dot), fmt("＀+＀", [live(seperator), live(verbpath)]), add);
	}
	rt.endFor(f, 0);
	verbpath = null;
	rt.forList(f, 0, live(subs));
	while (($e = rt.next(f, 0)) !== undefined) {
		verbpath = $e;
		f.dot = rt.modify(live(f.dot), fmt("＀-＀", [live(seperator), live(verbpath)]), add);
	}
	rt.endFor(f, 0);
	return live(f.dot);
});

// /proc/ui_style2icon  (code/__HELPERS/type2type.dm:218)
rt.def("/proc/ui_style2icon", function ui_style2icon(f: Frame, ui_style: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(ui_style);
	if ($0 === "Retro") {
		return rt.rsc("icons/mob/screen_retro.dmi");
	} else if ($0 === "Plasmafire") {
		return rt.rsc("icons/mob/screen_plasmafire.dmi");
	} else if ($0 === "Slimecore") {
		return rt.rsc("icons/mob/screen_slimecore.dmi");
	} else if ($0 === "Operative") {
		return rt.rsc("icons/mob/screen_operative.dmi");
	} else if ($0 === "Clockwork") {
		return rt.rsc("icons/mob/screen_clockwork.dmi");
	} else {
		return rt.rsc("icons/mob/screen_midnight.dmi");
	}
	return f.dot;
});

// /proc/rgb2hsl  (code/__HELPERS/type2type.dm:234)
rt.def("/proc/rgb2hsl", function rgb2hsl(f: Frame, red: Value, green: Value, blue: Value) {
	let max: Value = null, min: Value = null, range: Value = null, hue: Value = null, saturation: Value = null, lightness: Value = null, dred: Value = null, dgreen: Value = null, dblue: Value = null;
	f.vars = () => [red, green, blue, max, min, range, hue, saturation, lightness, dred, dgreen, dblue];
	(red = rt.modify(live(red), 255, divide));
	(green = rt.modify(live(green), 255, divide));
	(blue = rt.modify(live(blue), 255, divide));
	max = rt.call(f, P("/proc/max"), null, [live(red), live(green), live(blue)]);
	min = rt.call(f, P("/proc/min"), null, [live(red), live(green), live(blue)]);
	range = subtract(live(max), live(min));
	hue = 0;
	saturation = 0;
	lightness = 0;
	lightness = divide(add(live(max), live(min)), 2);
	if (!isEqual(live(range), 0)) {
		if (rt.lt(live(lightness), 0.5)) {
			saturation = divide(live(range), add(live(max), live(min)));
		} else {
			saturation = divide(live(range), subtract(subtract(2, live(max)), live(min)));
		}
		dred = add(divide(subtract(live(max), live(red)), multiply(6, live(max))), 0.5);
		dgreen = add(divide(subtract(live(max), live(green)), multiply(6, live(max))), 0.5);
		dblue = add(divide(subtract(live(max), live(blue)), multiply(6, live(max))), 0.5);
		if (isEqual(live(max), live(red))) {
			hue = subtract(live(dblue), live(dgreen));
		} else {
			if (isEqual(live(max), live(green))) {
				hue = add(subtract(live(dred), live(dblue)), 0.3333333432674408);
			} else {
				hue = add(subtract(live(dgreen), live(dred)), 0.6666666865348816);
			}
		}
		if (rt.lt(live(hue), 0)) {
			hue = rt.inc(live(hue), 1);
		} else {
			if (rt.gt(live(hue), 1)) {
				hue = rt.inc(live(hue), -1);
			}
		}
	}
	return rt.list(live(hue), live(saturation), live(lightness));
});

// /proc/hsl2rgb  (code/__HELPERS/type2type.dm:266)
rt.def("/proc/hsl2rgb", function hsl2rgb(f: Frame, hue: Value, saturation: Value, lightness: Value) {
	let red: Value = null, green: Value = null, blue: Value = null, a: Value = null, b: Value = null;
	f.vars = () => [red, green, blue, a, b];
	red = null;
	green = null;
	blue = null;
	if (isEqual(live(saturation), 0)) {
		green = (red = multiply(live(lightness), 255));
		blue = live(red);
	} else {
		a = null;
		b = null;
		if (rt.lt(live(lightness), 0.5)) {
			b = multiply(live(lightness), add(1, live(saturation)));
		} else {
			b = subtract(add(live(lightness), live(saturation)), multiply(live(saturation), live(lightness)));
		}
		a = subtract(multiply(2, live(lightness)), live(b));
		red = rt.call(f, P("/proc/round"), null, [multiply(255, rt.call(f, P("/proc/hue2rgb"), null, [live(a), live(b), add(live(hue), 0.3333333432674408)]))]);
		green = rt.call(f, P("/proc/round"), null, [multiply(255, rt.call(f, P("/proc/hue2rgb"), null, [live(a), live(b), live(hue)]))]);
		blue = rt.call(f, P("/proc/round"), null, [multiply(255, rt.call(f, P("/proc/hue2rgb"), null, [live(a), live(b), subtract(live(hue), 0.3333333432674408)]))]);
	}
	return rt.list(live(red), live(green), live(blue));
});

// /proc/hue2rgb  (code/__HELPERS/type2type.dm:285)
rt.def("/proc/hue2rgb", function hue2rgb(f: Frame, a: Value, b: Value, hue: Value) {
	f.vars = () => [hue];
	if (rt.lt(live(hue), 0)) {
		hue = rt.inc(live(hue), 1);
	} else {
		if (rt.gt(live(hue), 1)) {
			hue = rt.inc(live(hue), -1);
		}
	}
	if (rt.lt(multiply(6, live(hue)), 1)) {
		return add(live(a), multiply(multiply(subtract(live(b), live(a)), 6), live(hue)));
	}
	if (rt.lt(multiply(2, live(hue)), 1)) {
		return live(b);
	}
	if (rt.lt(multiply(3, live(hue)), 2)) {
		return add(live(a), multiply(multiply(subtract(live(b), live(a)), subtract(0.6666666865348816, live(hue))), 6));
	}
	return live(a);
});

// /proc/unix2date  (code/__HELPERS/type2type.dm:301)
rt.def("/proc/unix2date", function unix2date(f: Frame, timestamp: Value, seperator: Value) {
	let year: Value = null, dayInSeconds: Value = null, daysInYear: Value = null, daysInLYear: Value = null, days: Value = null, tmpDays: Value = null, monthsInDays: Value = null, month: Value = null, day: Value = null, mDays: Value = null, monthIndex: Value = null, m: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any, $e: any;
	f.vars = () => [seperator, year, dayInSeconds, daysInYear, daysInLYear, days, tmpDays, monthsInDays, month, day, mDays, monthIndex, m, $0, $1, $2, $3, $4, $e];
	if (live(seperator) === null) {
		seperator = "-";
	}
	if (rt.lt(live(timestamp), 0)) {
		return 0;
	}
	year = 1970;
	dayInSeconds = 86400;
	daysInYear = 365;
	daysInLYear = add(live(daysInYear), 1);
	days = rt.call(f, P("/proc/round"), null, [divide(live(timestamp), live(dayInSeconds))]);
	tmpDays = add(live(days), 1);
	monthsInDays = rt.list();
	month = 1;
	day = null;
	while (rt.gt(live(tmpDays), live(daysInYear))) {
		year = rt.inc(live(year), 1);
		if (truthy(rt.call(f, P("/proc/isLeap"), null, [live(year)]))) {
			(tmpDays = rt.modify(live(tmpDays), live(daysInLYear), subtract));
		} else {
			(tmpDays = rt.modify(live(tmpDays), live(daysInYear), subtract));
		}
	}
	if (truthy(rt.call(f, P("/proc/isLeap"), null, [live(year)]))) {
		monthsInDays = rt.list(-1, 30, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334);
	} else {
		monthsInDays = rt.list(0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334);
	}
	mDays = 0;
	monthIndex = 0;
	m = null;
	rt.forList(f, 0, live(monthsInDays));
	while (($e = rt.next(f, 0)) !== undefined) {
		m = $e;
		monthIndex = rt.inc(live(monthIndex), 1);
		if (rt.gt(live(tmpDays), live(m))) {
			mDays = live(m);
			month = live(monthIndex);
		}
	}
	rt.endFor(f, 0);
	day = subtract(live(tmpDays), live(mDays));
	$0 = live(year);
	$1 = live(seperator);
	if (rt.lt(live(month), 10)) {
		$2 = fmt("0＀", [live(month)]);
	} else {
		$2 = live(month);
	}
	$3 = live(seperator);
	if (rt.lt(live(day), 10)) {
		$4 = fmt("0＀", [live(day)]);
	} else {
		$4 = live(day);
	}
	return fmt("＀＀＀＀＀", [$0, $1, $2, $3, $4]);
});

// /proc/isLeap  (code/__HELPERS/type2type.dm:340)
rt.def("/proc/isLeap", function isLeap(f: Frame, y: Value) {
	return ((isEqual(rt.modulus(live(y), 4), 0) ? 1 : 0) && ((!isEqual(rt.modulus(live(y), 100), 0) ? 1 : 0) || (isEqual(rt.modulus(live(y), 400), 0) ? 1 : 0)));
});

// /proc/body_parts_covered2organ_names  (code/__HELPERS/type2type.dm:347)
rt.def("/proc/body_parts_covered2organ_names", function body_parts_covered2organ_names(f: Frame, bpc: Value) {
	let covered_parts: Value = null;
	f.vars = () => [covered_parts];
	covered_parts = rt.list();
	if (!truthy(live(bpc))) {
		return 0;
	}
	if (truthy(rt.bitAnd(live(bpc), 4095))) {
		(covered_parts = rt.modify(live(covered_parts), rt.list("l_arm", "r_arm", "head", "chest", "l_leg", "r_leg"), rt.bitOr));
	} else {
		if (truthy(rt.bitAnd(live(bpc), 1))) {
			(covered_parts = rt.modify(live(covered_parts), rt.list("head"), rt.bitOr));
		}
		if (truthy(rt.bitAnd(live(bpc), 2))) {
			(covered_parts = rt.modify(live(covered_parts), rt.list("chest"), rt.bitOr));
		}
		if (truthy(rt.bitAnd(live(bpc), 4))) {
			(covered_parts = rt.modify(live(covered_parts), rt.list("chest"), rt.bitOr));
		}
		if (truthy(rt.bitAnd(live(bpc), 384))) {
			(covered_parts = rt.modify(live(covered_parts), rt.list("l_arm", "r_arm"), rt.bitOr));
		} else {
			if (truthy(rt.bitAnd(live(bpc), 128))) {
				(covered_parts = rt.modify(live(covered_parts), rt.list("l_arm"), rt.bitOr));
			}
			if (truthy(rt.bitAnd(live(bpc), 256))) {
				(covered_parts = rt.modify(live(covered_parts), rt.list("r_arm"), rt.bitOr));
			}
		}
		if (truthy(rt.bitAnd(live(bpc), 1536))) {
			(covered_parts = rt.modify(live(covered_parts), rt.list("l_arm", "r_arm"), rt.bitOr));
		} else {
			if (truthy(rt.bitAnd(live(bpc), 512))) {
				(covered_parts = rt.modify(live(covered_parts), rt.list("l_arm"), rt.bitOr));
			}
			if (truthy(rt.bitAnd(live(bpc), 1024))) {
				(covered_parts = rt.modify(live(covered_parts), rt.list("r_arm"), rt.bitOr));
			}
		}
		if (truthy(rt.bitAnd(live(bpc), 24))) {
			(covered_parts = rt.modify(live(covered_parts), rt.list("l_leg", "r_leg"), rt.bitOr));
		} else {
			if (truthy(rt.bitAnd(live(bpc), 8))) {
				(covered_parts = rt.modify(live(covered_parts), rt.list("l_leg"), rt.bitOr));
			}
			if (truthy(rt.bitAnd(live(bpc), 16))) {
				(covered_parts = rt.modify(live(covered_parts), rt.list("r_leg"), rt.bitOr));
			}
		}
		if (truthy(rt.bitAnd(live(bpc), 96))) {
			(covered_parts = rt.modify(live(covered_parts), rt.list("l_leg", "r_leg"), rt.bitOr));
		} else {
			if (truthy(rt.bitAnd(live(bpc), 32))) {
				(covered_parts = rt.modify(live(covered_parts), rt.list("l_leg"), rt.bitOr));
			}
			if (truthy(rt.bitAnd(live(bpc), 64))) {
				(covered_parts = rt.modify(live(covered_parts), rt.list("r_leg"), rt.bitOr));
			}
		}
	}
	return live(covered_parts);
});

// /proc/heat2colour  (code/__HELPERS/type2type.dm:401)
rt.def("/proc/heat2colour", function heat2colour(f: Frame, temp: Value) {
	return rt.op(f, "Rgb", [1, 3], [rt.call(f, P("/proc/heat2colour_r"), null, [live(temp)]), rt.call(f, P("/proc/heat2colour_g"), null, [live(temp)]), rt.call(f, P("/proc/heat2colour_b"), null, [live(temp)])]);
});

// /proc/heat2colour_r  (code/__HELPERS/type2type.dm:405)
rt.def("/proc/heat2colour_r", function heat2colour_r(f: Frame, temp: Value) {
	f.vars = () => [temp];
	(temp = rt.modify(live(temp), 100, divide));
	if (rt.le(live(temp), 66)) {
		f.dot = 255;
	} else {
		f.dot = rt.call(f, P("/proc/max"), null, [0, rt.call(f, P("/proc/min"), null, [255, multiply(329.69873046875, rt.power(subtract(live(temp), 60), -0.13320475816726685))])]);
	}
	return f.dot;
});

// /proc/heat2colour_g  (code/__HELPERS/type2type.dm:413)
rt.def("/proc/heat2colour_g", function heat2colour_g(f: Frame, temp: Value) {
	f.vars = () => [temp];
	(temp = rt.modify(live(temp), 100, divide));
	if (rt.le(live(temp), 66)) {
		f.dot = rt.call(f, P("/proc/max"), null, [0, rt.call(f, P("/proc/min"), null, [255, subtract(multiply(99.4708023071289, rt.op(f, "LogE", [], [live(temp)])), 161.11956787109375)])]);
	} else {
		f.dot = rt.call(f, P("/proc/max"), null, [0, rt.call(f, P("/proc/min"), null, [255, multiply(288.1221618652344, rt.power(subtract(live(temp), 60), -0.07514849305152893))])]);
	}
	return f.dot;
});

// /proc/heat2colour_b  (code/__HELPERS/type2type.dm:421)
rt.def("/proc/heat2colour_b", function heat2colour_b(f: Frame, temp: Value) {
	f.vars = () => [temp];
	(temp = rt.modify(live(temp), 100, divide));
	if (rt.ge(live(temp), 66)) {
		f.dot = 255;
	} else {
		if (rt.le(live(temp), 16)) {
			f.dot = 0;
		} else {
			f.dot = rt.call(f, P("/proc/max"), null, [0, rt.call(f, P("/proc/min"), null, [255, subtract(multiply(138.51773071289062, rt.op(f, "LogE", [], [subtract(live(temp), 10)])), 305.0447998046875)])]);
		}
	}
	return f.dot;
});

// /proc/color2hex  (code/__HELPERS/type2type.dm:431)
rt.def("/proc/color2hex", function color2hex(f: Frame, color: Value) {
	let $0: any;
	f.vars = () => [$0];
	if (!truthy(live(color))) {
		return "#000000";
	}
	$0 = live(color);
	if ($0 === "white") {
		return "#FFFFFF";
	} else if ($0 === "black") {
		return "#000000";
	} else if ($0 === "gray") {
		return "#808080";
	} else if ($0 === "brown") {
		return "#A52A2A";
	} else if ($0 === "red") {
		return "#FF0000";
	} else if ($0 === "darkred") {
		return "#8B0000";
	} else if ($0 === "crimson") {
		return "#DC143C";
	} else if ($0 === "orange") {
		return "#FFA500";
	} else if ($0 === "yellow") {
		return "#FFFF00";
	} else if ($0 === "green") {
		return "#008000";
	} else if ($0 === "lime") {
		return "#00FF00";
	} else if ($0 === "darkgreen") {
		return "#006400";
	} else if ($0 === "cyan") {
		return "#00FFFF";
	} else if ($0 === "blue") {
		return "#0000FF";
	} else if ($0 === "navy") {
		return "#000080";
	} else if ($0 === "teal") {
		return "#008080";
	} else if ($0 === "purple") {
		return "#800080";
	} else if ($0 === "indigo") {
		return "#4B0082";
	} else {
		return "#FFFFFF";
	}
	return f.dot;
});

// /proc/string2listofvars  (code/__HELPERS/type2type.dm:485)
rt.def("/proc/string2listofvars", function string2listofvars(f: Frame, t_string: Value, var_source: Value) {
	let var_found: Value = null, list_value: Value = null, intermediate_stage: Value = null, value: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [t_string, var_found, list_value, intermediate_stage, value, A, $e];
	if ((!truthy(live(t_string)) || !truthy(live(var_source)))) {
		return rt.list();
	}
	f.dot = rt.list();
	if (!truthy((var_found = rt.call(f, P("/proc/findtext"), null, [live(t_string), "["])))) return f.dot;
	t_string = rt.call(f, P("/proc/replacetext"), null, [live(t_string), "[", "[ "]);
	list_value = rt.call(f, P("/proc/splittext"), null, [live(t_string), "["]);
	list_value = rt.call(f, P("/proc/splittext"), null, [(intermediate_stage = rt.call(f, P("/proc/jointext"), null, [live(list_value), null])), " "]);
	value = null;
	rt.forList(f, 0, live(list_value));
	while (($e = rt.next(f, 0)) !== undefined) {
		value = $e;
		if (truthy(rt.call(f, P("/proc/findtext"), null, [live(value), "]"]))) {
			value = rt.call(f, P("/proc/splittext"), null, [live(value), "]"]);
			A = null;
			rt.forList(f, 1, live(value));
			while (($e = rt.next(f, 1)) !== undefined) {
				A = $e;
				if (truthy(rt.callName(f, rt.fv(f, "vars", live(var_source)), "Find", [live(A)]))) {
					f.dot = rt.modify(live(f.dot), live(A), add);
				}
			}
			rt.endFor(f, 1);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /proc/color_hex2num  (code/__HELPERS/type2type.dm:513)
rt.def("/proc/color_hex2num", function color_hex2num(f: Frame, A: Value) {
	let R: Value = null, G: Value = null, B: Value = null;
	f.vars = () => [R, G, B];
	if (!truthy(live(A))) {
		return 0;
	}
	R = rt.call(f, P("/proc/hex2num"), null, [rt.call(f, P("/proc/copytext"), null, [live(A), 2, 4])]);
	G = rt.call(f, P("/proc/hex2num"), null, [rt.call(f, P("/proc/copytext"), null, [live(A), 4, 6])]);
	B = rt.call(f, P("/proc/hex2num"), null, [rt.call(f, P("/proc/copytext"), null, [live(A), 6, 0])]);
	return add(add(live(R), live(G)), live(B));
});

// /proc/color_hex2color_matrix  (code/__HELPERS/type2type.dm:522)
rt.def("/proc/color_hex2color_matrix", function color_hex2color_matrix(f: Frame, string: Value) {
	let length: Value = null, r: Value = null, _g: Value = null, b: Value = null, a: Value = null;
	f.vars = () => [length, r, _g, b, a];
	if ((!isEqual((length = rt.length(live(string))), 7) && !isEqual(live(length), 9))) {
		return rt.call(f, P("/proc/color_matrix_identity"), null, []);
	}
	r = divide(rt.call(f, P("/proc/hex2num"), null, [rt.call(f, P("/proc/copytext"), null, [live(string), 2, 4])]), 255);
	_g = divide(rt.call(f, P("/proc/hex2num"), null, [rt.call(f, P("/proc/copytext"), null, [live(string), 4, 6])]), 255);
	b = divide(rt.call(f, P("/proc/hex2num"), null, [rt.call(f, P("/proc/copytext"), null, [live(string), 6, 8])]), 255);
	a = 1;
	if (isEqual(live(length), 9)) {
		a = divide(rt.call(f, P("/proc/hex2num"), null, [rt.call(f, P("/proc/copytext"), null, [live(string), 8, 10])]), 255);
	}
	if ((((!truthy(rt.call(f, P("/proc/isnum"), null, [live(r)])) || !truthy(rt.call(f, P("/proc/isnum"), null, [live(_g)]))) || !truthy(rt.call(f, P("/proc/isnum"), null, [live(b)]))) || !truthy(rt.call(f, P("/proc/isnum"), null, [live(a)])))) {
		return rt.call(f, P("/proc/color_matrix_identity"), null, []);
	}
	return rt.list(live(r), 0, 0, 0, 0, live(_g), 0, 0, 0, 0, live(b), 0, 0, 0, 0, live(a), 0, 0, 0, 0);
});

// /proc/color_matrix2color_hex  (code/__HELPERS/type2type.dm:537)
rt.def("/proc/color_matrix2color_hex", function color_matrix2color_hex(f: Frame, the_matrix: Value) {
	if ((!truthy((rt.istype(live(the_matrix), T("/list")) ? 1 : 0)) || !isEqual(rt.len(f, live(the_matrix)), 20))) {
		return "#ffffffff";
	}
	return rt.op(f, "Rgb", [1, 4], [multiply(rt.index(live(the_matrix), 1), 255), multiply(rt.index(live(the_matrix), 6), 255), multiply(rt.index(live(the_matrix), 11), 255), multiply(rt.index(live(the_matrix), 16), 255)]);
});
