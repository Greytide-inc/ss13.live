// From code/__HELPERS/sanitize_values.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/sanitize_integer  (code/__HELPERS/sanitize_values.dm:3)
rt.def("/proc/sanitize_integer", function sanitize_integer(f: Frame, number: Value, min: Value, max: Value, _default: Value) {
	f.vars = () => [number, min, max, _default];
	if (live(min) === null) {
		min = 0;
	}
	if (live(max) === null) {
		max = 1;
	}
	if (live(_default) === null) {
		_default = 0;
	}
	if (truthy(rt.call(f, P("/proc/isnum"), null, [live(number)]))) {
		number = rt.call(f, P("/proc/round"), null, [live(number)]);
		if ((rt.le(live(min), live(number)) && rt.le(live(number), live(max)))) {
			return live(number);
		}
	}
	return live(_default);
});

// /proc/sanitize_text  (code/__HELPERS/sanitize_values.dm:10)
rt.def("/proc/sanitize_text", function sanitize_text(f: Frame, text: Value, _default: Value) {
	f.vars = () => [_default];
	if (live(_default) === null) {
		_default = "";
	}
	if (truthy(rt.call(f, P("/proc/istext"), null, [live(text)]))) {
		return live(text);
	}
	return live(_default);
});

// /proc/sanitize_inlist  (code/__HELPERS/sanitize_values.dm:15)
rt.def("/proc/sanitize_inlist", function sanitize_inlist(f: Frame, value: Value, List: Value, _default: Value) {
	if (truthy((rt.isIn(f, live(value), live(List)) ? 1 : 0))) {
		return live(value);
	}
	if (truthy(live(_default))) {
		return live(_default);
	}
	if (!(truthy(live(List)) && truthy(rt.len(f, live(List))))) return f.dot;
	return rt.op(f, "PickUnweighted", [1], [live(List)]);
});

// /proc/sanitize_gender  (code/__HELPERS/sanitize_values.dm:26)
rt.def("/proc/sanitize_gender", function sanitize_gender(f: Frame, gender: Value, neuter: Value, plural: Value, _default: Value) {
	let $0: any;
	f.vars = () => [neuter, plural, _default, $0];
	if (live(neuter) === null) {
		neuter = 0;
	}
	if (live(plural) === null) {
		plural = 0;
	}
	if (live(_default) === null) {
		_default = "male";
	}
	$0 = live(gender);
	if ($0 === "male" || $0 === "female") {
		return live(gender);
	} else if ($0 === "neuter") {
		if (truthy(live(neuter))) {
			return live(gender);
		} else {
			return live(_default);
		}
	} else if ($0 === "plural") {
		if (truthy(live(plural))) {
			return live(gender);
		} else {
			return live(_default);
		}
	}
	return live(_default);
});

// /proc/sanitize_hexcolor  (code/__HELPERS/sanitize_values.dm:42)
rt.def("/proc/sanitize_hexcolor", function sanitize_hexcolor(f: Frame, color: Value, desired_format: Value, include_crunch: Value, _default: Value) {
	let crunch: Value = null, start: Value = null, len: Value = null, step_size: Value = null, i: Value = null, ascii: Value = null;
	let $0: any;
	f.vars = () => [color, desired_format, include_crunch, crunch, start, len, step_size, i, ascii, $0];
	if (live(desired_format) === null) {
		desired_format = 3;
	}
	if (live(include_crunch) === null) {
		include_crunch = 0;
	}
	if (truthy(live(include_crunch))) {
		$0 = "#";
	} else {
		$0 = "";
	}
	crunch = $0;
	if (!truthy(rt.call(f, P("/proc/istext"), null, [live(color)]))) {
		color = "";
	}
	start = add(1, (isEqual(rt.call(f, P("/proc/text2ascii"), null, [live(color), 1]), 35) ? 1 : 0));
	len = rt.length(live(color));
	step_size = add(1, (!isEqual(subtract(add(live(len), 1), live(start)), live(desired_format)) ? 1 : 0));
	f.dot = "";
	i = null;
	i = live(start);
	while (rt.le(live(i), live(len))) {
		$0 = (ascii = rt.call(f, P("/proc/text2ascii"), null, [live(color), live(i)]));
		if (rt.inRange($0, 48, 57)) {
			f.dot = rt.modify(live(f.dot), rt.call(f, P("/proc/ascii2text"), null, [live(ascii)]), add);
		} else if (rt.inRange($0, 97, 102)) {
			f.dot = rt.modify(live(f.dot), rt.call(f, P("/proc/ascii2text"), null, [live(ascii)]), add);
		} else if (rt.inRange($0, 65, 70)) {
			f.dot = rt.modify(live(f.dot), rt.call(f, P("/proc/ascii2text"), null, [add(live(ascii), 32)]), add);
		} else {
			break;
		}
		i = rt.modify(live(i), live(step_size), add);
	}
	if (!isEqual(rt.length(live(f.dot)), live(desired_format))) {
		if (truthy(live(_default))) {
			return live(_default);
		}
		return add(live(crunch), rt.call(f, P("/proc/repeat_string"), null, [live(desired_format), "0"]));
	}
	return add(live(crunch), live(f.dot));
});

// /proc/sanitize_ooccolor  (code/__HELPERS/sanitize_values.dm:71)
rt.def("/proc/sanitize_ooccolor", function sanitize_ooccolor(f: Frame, color: Value) {
	let HSL: Value = null, RGB: Value = null;
	f.vars = () => [HSL, RGB];
	// tg 5beb871aea: only #RRGGBB goes through; anything else is the normal OOC colour
	if (typeof color !== "string" || !/^#[0-9a-fA-F]{6}$/.test(color)) return rt.gl("normal_ooc_colour");
	rt.setAt((HSL = rt.call(f, P("/proc/rgb2hsl"), null, [rt.call(f, P("/proc/hex2num"), null, [rt.call(f, P("/proc/copytext"), null, [live(color), 2, 4])]), rt.call(f, P("/proc/hex2num"), null, [rt.call(f, P("/proc/copytext"), null, [live(color), 4, 6])]), rt.call(f, P("/proc/hex2num"), null, [rt.call(f, P("/proc/copytext"), null, [live(color), 6, 8])])])), 3, rt.call(f, P("/proc/min"), null, [rt.index(live(HSL), 3), 0.4000000059604645]));
	return fmt("#＀＀＀", [rt.call(f, P("/proc/num2hex"), null, [rt.index((RGB = rt.call(f, P("/proc/hsl2rgb"), null, [live(HSL)], rt.Args.List)), 1), 2]), rt.call(f, P("/proc/num2hex"), null, [rt.index(live(RGB), 2), 2]), rt.call(f, P("/proc/num2hex"), null, [rt.index(live(RGB), 3), 2])]);
});
