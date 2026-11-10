// Based on /tg/station's code/__HELPERS/type2type.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { P } = rt;


// type2type.dm:17
rt.def("/proc/hex2num", function hex2num(f: Frame, hex: Value) {
	let negative: Value = null, len: Value = null, i: Value = null, num: Value = null;
	f.dot = 0;
	if (istext(hex)) {
		negative = 0;
		len = rt.length(hex);
		i = 1;
		while (i <= len) {
			blk46: {
				const subject = (num = text2ascii(hex, i));
				if (rt.inRange(subject, 48, 57)) {
					num -= 48;
				} else if (rt.inRange(subject, 97, 102)) {
					num -= 87;
				} else if (rt.inRange(subject, 65, 70)) {
					num -= 55;
				} else if (subject === 45) {
					negative = 1;
				} else {
					if (num) {
						break;
					}
					break blk46;
				}
				f.dot *= 16;
				f.dot += num;
			}
			i++;
		}
		if (negative) {
			f.dot *= -1;
		}
	}
	return f.dot;
});

// type2type.dm:49
rt.def("/proc/num2hex", function num2hex(f: Frame, num: Value, len: Value) {
	let remainder: Value = null;
	len ??= 2;
	if (!isnum(num)) {
		num = 0;
	}
	num = round(rt.op(f, "Abs", [], [num]));
	f.dot = "";
	let i: Value = 0;
	while (true) {
		if (len <= 0) {
			if (!num) {
				break;
			}
		} else if (i >= len) {
			break;
		}
		num = round((remainder = num / 16));
		const subject = (remainder = (remainder - num) * 16);
		if (subject === 9 || subject === 8 || subject === 7 || subject === 6 || subject === 5 || subject === 4 || subject === 3 || subject === 2 || subject === 1) {
			f.dot = `${remainder}` + f.dot;
		} else if (subject === 10 || subject === 11 || subject === 12 || subject === 13 || subject === 14 || subject === 15) {
			f.dot = ascii2text(remainder + 87) + f.dot;
		} else {
			f.dot = "0" + f.dot;
		}
		i++;
	}
	return f.dot;
});

// type2type.dm:76
rt.def("/world/proc/file2list", function file2list(f: Frame, filename: Value, seperator: Value) {
	seperator ??= "\n";
	return splittext(file2text(filename), seperator);
});

// type2type.dm:80
rt.def("/proc/dir2text", function dir2text(f: Frame, direction: Value) {
	if (direction === 1) {
		return "north";
	} else if (direction === 2) {
		return "south";
	} else if (direction === 4) {
		return "east";
	} else if (direction === 8) {
		return "west";
	} else if (direction === 5) {
		return "northeast";
	} else if (direction === 6) {
		return "southeast";
	} else if (direction === 9) {
		return "northwest";
	} else if (direction === 10) {
		return "southwest";
	}
	return f.dot;
});

// type2type.dm:125
rt.def("/proc/angle2dir", function angle2dir(f: Frame, degree: Value) {
	if ((degree = SimplifyDegrees(degree)) < 45) {
		return 1;
	}
	if (degree < 90) {
		return 5;
	}
	if (degree < 135) {
		return 4;
	}
	if (degree < 180) {
		return 6;
	}
	if (degree < 225) {
		return 2;
	}
	if (degree < 270) {
		return 10;
	}
	if (degree < 315) {
		return 8;
	}
	return 9;
});

// type2type.dm:146
rt.def("/proc/dir2angle", function dir2angle(f: Frame, D: Value) {
	if (D === 1) {
		return 0;
	} else if (D === 2) {
		return 180;
	} else if (D === 4) {
		return 90;
	} else if (D === 8) {
		return 270;
	} else if (D === 5) {
		return 45;
	} else if (D === 6) {
		return 135;
	} else if (D === 9) {
		return 315;
	} else if (D === 10) {
		return 225;
	} else {
		return null;
	}
});

// type2type.dm:168
rt.def("/proc/angle2text", function angle2text(f: Frame, degree: Value) {
	return dir2text(angle2dir(degree));
});

// type2type.dm:172
rt.def("/proc/blendMode2iconMode", function blendMode2iconMode(f: Frame, blend_mode: Value) {
	if (blend_mode === 4) {
		return 2;
	} else if (blend_mode === 2) {
		return 0;
	} else if (blend_mode === 3) {
		return 1;
	} else {
		return 3;
	}
});

// type2type.dm:184
rt.def("/proc/rights2text", function rights2text(f: Frame, rights: Value, seperator: Value, adds: Value, subs: Value) {
	let verbpath: Value = null;
	seperator ??= "";
	if (rt.bitAnd(rights, 1)) {
		f.dot += `${seperator}+BUILDMODE`;
	}
	if (rt.bitAnd(rights, 2)) {
		f.dot += `${seperator}+ADMIN`;
	}
	if (rt.bitAnd(rights, 4)) {
		f.dot += `${seperator}+BAN`;
	}
	if (rt.bitAnd(rights, 8)) {
		f.dot += `${seperator}+FUN`;
	}
	if (rt.bitAnd(rights, 16)) {
		f.dot += `${seperator}+SERVER`;
	}
	if (rt.bitAnd(rights, 32)) {
		f.dot += `${seperator}+DEBUG`;
	}
	if (rt.bitAnd(rights, 64)) {
		f.dot += `${seperator}+POSSESS`;
	}
	if (rt.bitAnd(rights, 128)) {
		f.dot += `${seperator}+PERMISSIONS`;
	}
	if (rt.bitAnd(rights, 256)) {
		f.dot += `${seperator}+STEALTH`;
	}
	if (rt.bitAnd(rights, 512)) {
		f.dot += `${seperator}+POLL`;
	}
	if (rt.bitAnd(rights, 1024)) {
		f.dot += `${seperator}+VAREDIT`;
	}
	if (rt.bitAnd(rights, 2048)) {
		f.dot += `${seperator}+SOUND`;
	}
	if (rt.bitAnd(rights, 4096)) {
		f.dot += `${seperator}+SPAWN`;
	}
	for (verbpath of each(adds)) {
		f.dot += `${seperator}+${verbpath}`;
	}
	verbpath = null;
	for (verbpath of each(subs)) {
		f.dot += `${seperator}-${verbpath}`;
	}
	return f.dot;
});

// type2type.dm:218
rt.def("/proc/ui_style2icon", function ui_style2icon(f: Frame, ui_style: Value) {
	if (ui_style === "Retro") {
		return rt.rsc("icons/mob/screen_retro.dmi");
	} else if (ui_style === "Plasmafire") {
		return rt.rsc("icons/mob/screen_plasmafire.dmi");
	} else if (ui_style === "Slimecore") {
		return rt.rsc("icons/mob/screen_slimecore.dmi");
	} else if (ui_style === "Operative") {
		return rt.rsc("icons/mob/screen_operative.dmi");
	} else if (ui_style === "Clockwork") {
		return rt.rsc("icons/mob/screen_clockwork.dmi");
	} else {
		return rt.rsc("icons/mob/screen_midnight.dmi");
	}
});

// type2type.dm:234
rt.def("/proc/rgb2hsl", function rgb2hsl(f: Frame, red: Value, green: Value, blue: Value) {
	let dred: Value = null, dgreen: Value = null, dblue: Value = null;
	red /= 255;
	green /= 255;
	blue /= 255;
	let max: Value = rt.call(f, P("/proc/max"), null, [red, green, blue]);
	let min: Value = rt.call(f, P("/proc/min"), null, [red, green, blue]);
	let range: Value = max - min;
	let hue: Value = 0;
	let saturation: Value = 0;
	let lightness: Value = (max + min) / 2;
	if (range != 0) {
		if (lightness < 0.5) {
			saturation = range / (max + min);
		} else {
			saturation = range / (2 - max - min);
		}
		dred = (max - red) / (6 * max) + 0.5;
		dgreen = (max - green) / (6 * max) + 0.5;
		dblue = (max - blue) / (6 * max) + 0.5;
		if (max == red) {
			hue = dblue - dgreen;
		} else if (max == green) {
			hue = dred - dblue + 0.33333334;
		} else {
			hue = dgreen - dred + 0.6666667;
		}
		if (hue < 0) {
			hue++;
		} else if (hue > 1) {
			hue--;
		}
	}
	return list(hue, saturation, lightness);
});

// type2type.dm:266
rt.def("/proc/hsl2rgb", function hsl2rgb(f: Frame, hue: Value, saturation: Value, lightness: Value) {
	let red: Value = null, green: Value = null, blue: Value = null, a: Value = null, b: Value = null;
	if (saturation == 0) {
		green = (red = lightness * 255);
		blue = red;
	} else {
		if (lightness < 0.5) {
			b = lightness * (1 + saturation);
		} else {
			b = lightness + saturation - saturation * lightness;
		}
		a = 2 * lightness - b;
		red = round(255 * hue2rgb(a, b, hue + 0.33333334));
		green = round(255 * hue2rgb(a, b, hue));
		blue = round(255 * hue2rgb(a, b, hue - 0.33333334));
	}
	return list(red, green, blue);
});

// type2type.dm:285
rt.def("/proc/hue2rgb", function hue2rgb(f: Frame, a: Value, b: Value, hue: Value) {
	if (hue < 0) {
		hue++;
	} else if (hue > 1) {
		hue--;
	}
	if (6 * hue < 1) {
		return a + (b - a) * 6 * hue;
	}
	if (2 * hue < 1) {
		return b;
	}
	if (3 * hue < 2) {
		return a + (b - a) * (0.6666667 - hue) * 6;
	}
	return a;
});

// type2type.dm:405
rt.def("/proc/heat2colour_r", function heat2colour_r(f: Frame, temp: Value) {
	temp /= 100;
	if (temp <= 66) {
		f.dot = 255;
	} else {
		f.dot = max(0, min(255, 329.69873 * (temp - 60) ** -0.13320476));
	}
	return f.dot;
});

// type2type.dm:413
rt.def("/proc/heat2colour_g", function heat2colour_g(f: Frame, temp: Value) {
	temp /= 100;
	if (temp <= 66) {
		f.dot = max(0, min(255, 99.4708 * rt.op(f, "LogE", [], [temp]) - 161.11957));
	} else {
		f.dot = max(0, min(255, 288.12216 * (temp - 60) ** -0.07514849));
	}
	return f.dot;
});

// type2type.dm:421
rt.def("/proc/heat2colour_b", function heat2colour_b(f: Frame, temp: Value) {
	temp /= 100;
	if (temp >= 66) {
		f.dot = 255;
	} else if (temp <= 16) {
		f.dot = 0;
	} else {
		f.dot = max(0, min(255, 138.51773 * rt.op(f, "LogE", [], [temp - 10]) - 305.0448));
	}
	return f.dot;
});

// type2type.dm:431
rt.def("/proc/color2hex", function color2hex(f: Frame, color: Value) {
	if (!color) {
		return "#000000";
	}
	if (color === "white") {
		return "#FFFFFF";
	} else if (color === "black") {
		return "#000000";
	} else if (color === "gray") {
		return "#808080";
	} else if (color === "brown") {
		return "#A52A2A";
	} else if (color === "red") {
		return "#FF0000";
	} else if (color === "darkred") {
		return "#8B0000";
	} else if (color === "crimson") {
		return "#DC143C";
	} else if (color === "orange") {
		return "#FFA500";
	} else if (color === "yellow") {
		return "#FFFF00";
	} else if (color === "green") {
		return "#008000";
	} else if (color === "lime") {
		return "#00FF00";
	} else if (color === "darkgreen") {
		return "#006400";
	} else if (color === "cyan") {
		return "#00FFFF";
	} else if (color === "blue") {
		return "#0000FF";
	} else if (color === "navy") {
		return "#000080";
	} else if (color === "teal") {
		return "#008080";
	} else if (color === "purple") {
		return "#800080";
	} else if (color === "indigo") {
		return "#4B0082";
	} else {
		return "#FFFFFF";
	}
});

// type2type.dm:485
rt.def("/proc/string2listofvars", function string2listofvars(f: Frame, t_string: Value, var_source: Value) {
	let var_found: Value = null, intermediate_stage: Value = null, value: Value = null, A: Value = null;
	if (!t_string || !var_source) {
		return list();
	}
	f.dot = list();
	if (!(var_found = findtext(t_string, "["))) return f.dot;
	t_string = replacetext(t_string, "[", "[ ");
	let list_value: Value = splittext(t_string, "[");
	list_value = splittext((intermediate_stage = jointext(list_value, null)), " ");
	for (value of each(list_value)) {
		if (findtext(value, "]")) {
			value = splittext(value, "]");
			A = null;
			for (A of each(value)) {
				if (var_source.vars.Find(A)) {
					f.dot += A;
				}
			}
		}
	}
	return f.dot;
});

// type2type.dm:513
rt.def("/proc/color_hex2num", function color_hex2num(f: Frame, A: Value) {
	if (!A) {
		return 0;
	}
	let R: Value = hex2num(copytext(A, 2, 4));
	let G: Value = hex2num(copytext(A, 4, 6));
	let B: Value = hex2num(copytext(A, 6, 0));
	return R + G + B;
});
