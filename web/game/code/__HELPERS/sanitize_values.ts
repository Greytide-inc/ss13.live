// Based on /tg/station's code/__HELPERS/sanitize_values.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { P } = rt;


// sanitize_values.dm:3
rt.def("/proc/sanitize_integer", function sanitize_integer(f: Frame, number: Value, min: Value, max: Value, _default: Value) {
	min ??= 0;
	max ??= 1;
	_default ??= 0;
	if (isnum(number)) {
		number = round(number);
		if (min <= number && number <= max) {
			return number;
		}
	}
	return _default;
});

// sanitize_values.dm:10
rt.def("/proc/sanitize_text", function sanitize_text(f: Frame, text: Value, _default: Value) {
	_default ??= "";
	if (istext(text)) {
		return text;
	}
	return _default;
});

// sanitize_values.dm:15
rt.def("/proc/sanitize_inlist", function sanitize_inlist(f: Frame, value: Value, List: Value, _default: Value) {
	if (rt.isIn(f, value, List)) {
		return value;
	}
	if (_default) {
		return _default;
	}
	if (!(List && rt.len(f, List))) return f.dot;
	return pick(List);
});

// sanitize_values.dm:26
rt.def("/proc/sanitize_gender", function sanitize_gender(f: Frame, gender: Value, neuter: Value, plural: Value, _default: Value) {
	neuter ??= 0;
	plural ??= 0;
	_default ??= "male";
	if (gender === "male" || gender === "female") {
		return gender;
	} else if (gender === "neuter") {
		if (neuter) {
			return gender;
		} else {
			return _default;
		}
	} else if (gender === "plural") {
		if (plural) {
			return gender;
		} else {
			return _default;
		}
	}
	return _default;
});

// sanitize_values.dm:42
rt.def("/proc/sanitize_hexcolor", function sanitize_hexcolor(f: Frame, color: Value, desired_format: Value, include_crunch: Value, _default: Value) {
	let ascii: Value = null;
	desired_format ??= 3;
	include_crunch ??= 0;
	let crunch: Value = include_crunch ? "#" : "";
	if (!istext(color)) {
		color = "";
	}
	let start: Value = 1 + (text2ascii(color, 1) == 35 ? 1 : 0);
	let len: Value = rt.length(color);
	let step_size: Value = 1 + (len + 1 - start != desired_format ? 1 : 0);
	f.dot = "";
	let i: Value = start;
	while (i <= len) {
		const subject = (ascii = text2ascii(color, i));
		if (rt.inRange(subject, 48, 57)) {
			f.dot += ascii2text(ascii);
		} else if (rt.inRange(subject, 97, 102)) {
			f.dot += ascii2text(ascii);
		} else if (rt.inRange(subject, 65, 70)) {
			f.dot += ascii2text(ascii + 32);
		} else {
			break;
		}
		i += step_size;
	}
	if (rt.length(f.dot) != desired_format) {
		if (_default) {
			return _default;
		}
		return crunch + repeat_string(desired_format, "0");
	}
	return crunch + f.dot;
});

// sanitize_values.dm:71
rt.def("/proc/sanitize_ooccolor", function sanitize_ooccolor(f: Frame, color: Value) {
	let HSL: Value = null, RGB: Value = null;
	// tg 5beb871aea: only #RRGGBB goes through; anything else is the normal OOC colour
	if (typeof color !== "string" || !/^#[0-9a-fA-F]{6}$/.test(color)) return GLOB.normal_ooc_colour;
	rt.setAt((HSL = rgb2hsl(hex2num(copytext(color, 2, 4)), hex2num(copytext(color, 4, 6)), hex2num(copytext(color, 6, 8)))), 3, min(rt.index(HSL, 3), 0.4));
	// ss13.live: black and near-black is no colour (null): an unset colour loads as #000000, unreadable in dark chat
	if (Number(rt.index(HSL, 3)) < 0.15) return null;
	return `#${num2hex(rt.index((RGB = rt.call(f, P("/proc/hsl2rgb"), null, [HSL], rt.Args.List)), 1), 2)}${num2hex(rt.index(RGB, 2), 2)}${num2hex(rt.index(RGB, 3), 2)}`;
});
