// Based on /tg/station's code/__HELPERS/icons.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(4807, "/icon", "/datum", {
	icon: null,
});

// icons.dm:221
rt.def("/icon/proc/ChangeOpacity", function ChangeOpacity(f: Frame, opacity: Value) {
	opacity ??= 1;
	this.MapColors(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, opacity, 0, 0, 0, 0);
	return f.dot;
});

// icons.dm:225
rt.def("/icon/proc/GrayScale", function GrayScale(f: Frame) {
	this.MapColors(0.3, 0.3, 0.3, 0.59, 0.59, 0.59, 0.11, 0.11, 0.11, 0, 0, 0);
	return f.dot;
});

// icons.dm:228
rt.def("/icon/proc/ColorTone", function ColorTone(f: Frame, tone: Value) {
	this.GrayScale();
	let TONE: Value = ReadRGB(tone);
	let gray: Value = round(rt.index(TONE, 1) * 0.3 + rt.index(TONE, 2) * 0.59 + rt.index(TONE, 3) * 0.11, 1);
	let upper: Value = 255 - gray ? new_(T("/icon"), this) : null;
	if (gray) {
		this.MapColors(255 / gray, 0, 0, 0, 255 / gray, 0, 0, 0, 255 / gray, 0, 0, 0);
		this.Blend(tone, 2);
	} else {
		this.SetIntensity(0);
	}
	if (!(255 - gray)) return f.dot;
	upper.Blend(rt.op(f, "Rgb", [1, 3], [gray, gray, gray]), 1);
	upper.MapColors((255 - rt.index(TONE, 1)) / (255 - gray), 0, 0, 0, 0, (255 - rt.index(TONE, 2)) / (255 - gray), 0, 0, 0, 0, (255 - rt.index(TONE, 3)) / (255 - gray), 0, 0, 0, 0, 0, 0, 0, 0, 1);
	this.Blend(upper, 0);
	return f.dot;
});

// icons.dm:275
rt.def("/icon/proc/BecomeAlphaMask", function BecomeAlphaMask(f: Frame) {
	this.SwapColor(null, "#000000ff");
	this.MapColors(0, 0, 0, 0.3, 0, 0, 0, 0.59, 0, 0, 0, 0.11, 0, 0, 0, 0, 1, 1, 1, 0);
	return f.dot;
});

// icons.dm:283
rt.def("/icon/proc/AddAlphaMask", function AddAlphaMask(f: Frame, mask: Value) {
	let M: Value = null;
	(M = new_(T("/icon"), mask)).Blend("#ffffff", 1);
	this.Blend(M, 0);
	return f.dot;
});

// icons.dm:311
rt.def("/proc/ReadRGB", function ReadRGB(f: Frame, rgb: Value) {
	let ch: Value = null, usealpha: Value = null;
	if (!rgb) {
		return f.dot;
	}
	let i: Value = 1;
	let start: Value = 1;
	if (text2ascii(rgb) == 35) {
		start++;
	}
	let which: Value = 0;
	let r: Value = 0;
	let _g: Value = 0;
	let b: Value = 0;
	let alpha: Value = 0;
	let digits: Value = 0;
	i = start;
	while (i <= rt.length(rgb)) {
		if ((ch = text2ascii(rgb, i)) < 48 || ch > 57 && ch < 65 || ch > 70 && ch < 97 || ch > 102) {
			break;
		}
		digits++;
		if (digits == 8) {
			break;
		}
		i++;
	}
	let single: Value = (digits < 6 ? 1 : 0);
	if (digits != 3 && digits != 4 && digits != 6 && digits != 8) {
		return f.dot;
	}
	if (digits == 4 || digits == 8) {
		usealpha = 1;
	}
	i = start;
	while (digits > 0) {
		if ((ch = text2ascii(rgb, i)) >= 48 && ch <= 57) {
			ch -= 48;
		} else if (ch >= 65 && ch <= 70) {
			ch -= 55;
		} else if (ch >= 97 && ch <= 102) {
			ch -= 87;
		} else {
			break;
		}
		digits--;
		if (which === 0) {
			r = rt.bitOr(rt.shiftLeft(r, 4), ch);
			if (single) {
				(r = rt.modify(r, rt.shiftLeft(r, 4), rt.bitOr));
				which++;
			} else if (!rt.bitAnd(digits, 1)) {
				which++;
			}
		} else if (which === 1) {
			_g = rt.bitOr(rt.shiftLeft(_g, 4), ch);
			if (single) {
				(_g = rt.modify(_g, rt.shiftLeft(_g, 4), rt.bitOr));
				which++;
			} else if (!rt.bitAnd(digits, 1)) {
				which++;
			}
		} else if (which === 2) {
			b = rt.bitOr(rt.shiftLeft(b, 4), ch);
			if (single) {
				(b = rt.modify(b, rt.shiftLeft(b, 4), rt.bitOr));
				which++;
			} else if (!rt.bitAnd(digits, 1)) {
				which++;
			}
		} else if (which === 3) {
			alpha = rt.bitOr(rt.shiftLeft(alpha, 4), ch);
			if (single) {
				(alpha = rt.modify(alpha, rt.shiftLeft(alpha, 4), rt.bitOr));
			}
		}
		i++;
	}
	f.dot = list(r, _g, b);
	if (!usealpha) return f.dot;
	f.dot += alpha;
	return f.dot;
});

// icons.dm:361
rt.def("/proc/ReadHSV", function ReadHSV(f: Frame, hsv: Value) {
	let ch: Value = null, usealpha: Value = null;
	let $0: any, $1: any;
	if (!hsv) {
		return f.dot;
	}
	let i: Value = 1;
	let start: Value = 1;
	if (text2ascii(hsv) == 35) {
		start++;
	}
	let which: Value = 0;
	let hue: Value = 0;
	let sat: Value = 0;
	let val: Value = 0;
	let alpha: Value = 0;
	let digits: Value = 0;
	i = start;
	while (i <= rt.length(hsv)) {
		if ((ch = text2ascii(hsv, i)) < 48 || ch > 57 && ch < 65 || ch > 70 && ch < 97 || ch > 102) {
			break;
		}
		digits++;
		if (digits == 9) {
			break;
		}
		i++;
	}
	if (digits > 7) {
		usealpha = 1;
	}
	if (digits <= 4) {
		which++;
	}
	if (digits <= 2) {
		which++;
	}
	i = start;
	while (digits > 0) {
		if ((ch = text2ascii(hsv, i)) >= 48 && ch <= 57) {
			ch -= 48;
		} else if (ch >= 65 && ch <= 70) {
			ch -= 55;
		} else if (ch >= 97 && ch <= 102) {
			ch -= 87;
		} else {
			break;
		}
		digits--;
		if (which === 0) {
			hue = rt.bitOr(rt.shiftLeft(hue, 4), ch);
			$0 = digits;
			if (usealpha) {
				$1 = 6;
			} else {
				$1 = 4;
			}
			if ($0 == $1) {
				which++;
			}
		} else if (which === 1) {
			sat = rt.bitOr(rt.shiftLeft(sat, 4), ch);
			$0 = digits;
			if (usealpha) {
				$1 = 4;
			} else {
				$1 = 2;
			}
			if ($0 == $1) {
				which++;
			}
		} else if (which === 2) {
			val = rt.bitOr(rt.shiftLeft(val, 4), ch);
			$0 = digits;
			if (usealpha) {
				$1 = 2;
			} else {
				$1 = 0;
			}
			if ($0 == $1) {
				which++;
			}
		} else if (which === 3) {
			alpha = rt.bitOr(rt.shiftLeft(alpha, 4), ch);
		}
		i++;
	}
	f.dot = list(hue, sat, val);
	if (!usealpha) return f.dot;
	f.dot += alpha;
	return f.dot;
});

// icons.dm:428
rt.def("/proc/RGBtoHSV", function RGBtoHSV(f: Frame, rgb: Value) {
	let RGB: Value = null, dir: Value = null, mid: Value = null;
	let $0: any;
	if (!rgb) {
		return "#0000000";
	}
	if (!(RGB = ReadRGB(rgb))) {
		return "#0000000";
	}
	let r: Value = rt.index(RGB, 1);
	let _g: Value = rt.index(RGB, 2);
	let b: Value = rt.index(RGB, 3);
	let hi: Value = max(r, _g, b);
	let lo: Value = min(r, _g, b);
	let val: Value = hi;
	let sat: Value = hi ? round((hi - lo) * 255 / hi, 1) : 0;
	let hue: Value = 0;
	if (sat) {
		if (hi == r) {
			if (lo == b) {
				hue = 0;
				dir = 1;
				mid = _g;
			} else {
				hue = 1535;
				dir = -1;
				mid = b;
			}
		} else if (hi == _g) {
			if (lo == r) {
				hue = 512;
				dir = 1;
				mid = b;
			} else {
				hue = 511;
				dir = -1;
				mid = r;
			}
		} else if (hi == b) {
			if (lo == _g) {
				hue = 1024;
				dir = 1;
				mid = r;
			} else {
				hue = 1023;
				dir = -1;
				mid = _g;
			}
		}
		hue += dir * round((mid - lo) * 255 / (hi - lo), 1);
	}
	$0 = hue;
	let $1: any = sat;
	let $2: any = val;
	return hsv($0, $1, $2, rt.len(f, RGB) > 3 ? rt.index(RGB, 4) : null);
});

// icons.dm:459
rt.def("/proc/hsv", function hsv(f: Frame, hue: Value, sat: Value, val: Value, alpha: Value) {
	let $1: any;
	if (hue < 0 || hue >= 1536) {
		hue %= 1536;
	}
	if (hue < 0) {
		hue += 1536;
	}
	if (rt.bitAnd(hue, 255) == 255) {
		hue++;
		if (hue >= 1536) {
			hue = 0;
		}
	}
	if (sat < 0) {
		sat = 0;
	}
	if (sat > 255) {
		sat = 255;
	}
	if (val < 0) {
		val = 0;
	}
	if (val > 255) {
		val = 255;
	}
	f.dot = "#";
	let $0: any = rt.bitAnd(rt.shiftRight(hue, 8), 15);
	if (rt.bitAnd(rt.shiftRight(hue, 8), 15) < 10) {
		$1 = 48;
	} else {
		$1 = 87;
	}
	f.dot += ascii2text($0 + $1);
	$0 = rt.bitAnd(rt.shiftRight(hue, 4), 15);
	if (rt.bitAnd(rt.shiftRight(hue, 4), 15) < 10) {
		$1 = 48;
	} else {
		$1 = 87;
	}
	f.dot += ascii2text($0 + $1);
	$0 = rt.bitAnd(hue, 15);
	if (rt.bitAnd(hue, 15) < 10) {
		$1 = 48;
	} else {
		$1 = 87;
	}
	f.dot += ascii2text($0 + $1);
	$0 = rt.bitAnd(rt.shiftRight(sat, 4), 15);
	if (rt.bitAnd(rt.shiftRight(sat, 4), 15) < 10) {
		$1 = 48;
	} else {
		$1 = 87;
	}
	f.dot += ascii2text($0 + $1);
	$0 = rt.bitAnd(sat, 15);
	if (rt.bitAnd(sat, 15) < 10) {
		$1 = 48;
	} else {
		$1 = 87;
	}
	f.dot += ascii2text($0 + $1);
	$0 = rt.bitAnd(rt.shiftRight(val, 4), 15);
	if (rt.bitAnd(rt.shiftRight(val, 4), 15) < 10) {
		$1 = 48;
	} else {
		$1 = 87;
	}
	f.dot += ascii2text($0 + $1);
	$0 = rt.bitAnd(val, 15);
	if (rt.bitAnd(val, 15) < 10) {
		$1 = 48;
	} else {
		$1 = 87;
	}
	f.dot += ascii2text($0 + $1);
	if (alpha === null) return f.dot;
	if (alpha < 0) {
		alpha = 0;
	}
	if (alpha > 255) {
		alpha = 255;
	}
	$0 = rt.bitAnd(rt.shiftRight(alpha, 4), 15);
	if (rt.bitAnd(rt.shiftRight(alpha, 4), 15) < 10) {
		$1 = 48;
	} else {
		$1 = 87;
	}
	f.dot += ascii2text($0 + $1);
	$0 = rt.bitAnd(alpha, 15);
	if (rt.bitAnd(alpha, 15) < 10) {
		$1 = 48;
	} else {
		$1 = 87;
	}
	f.dot += ascii2text($0 + $1);
	return f.dot;
});

// icons.dm:546
rt.def("/proc/BlendRGB", function BlendRGB(f: Frame, rgb1: Value, rgb2: Value, amount: Value) {
	let alpha: Value = null;
	let $0: any;
	let RGB1: Value = ReadRGB(rgb1);
	let RGB2: Value = ReadRGB(rgb2);
	if (rt.len(f, RGB1) < rt.len(f, RGB2)) {
		RGB1 += 255;
	} else if (rt.len(f, RGB2) < rt.len(f, RGB1)) {
		RGB2 += 255;
	}
	let usealpha: Value = (rt.len(f, RGB1) > 3 ? 1 : 0);
	let r: Value = round(rt.index(RGB1, 1) + (rt.index(RGB2, 1) - rt.index(RGB1, 1)) * amount, 1);
	let _g: Value = round(rt.index(RGB1, 2) + (rt.index(RGB2, 2) - rt.index(RGB1, 2)) * amount, 1);
	let b: Value = round(rt.index(RGB1, 3) + (rt.index(RGB2, 3) - rt.index(RGB1, 3)) * amount, 1);
	if (usealpha) {
		$0 = round(rt.index(RGB1, 4) + (rt.index(RGB2, 4) - rt.index(RGB1, 4)) * amount, 1);
	} else {
		$0 = null;
	}
	if ((alpha = $0) === null) {
		$0 = rt.op(f, "Rgb", [1, 3], [r, _g, b]);
	} else {
		$0 = rt.op(f, "Rgb", [1, 4], [r, _g, b, alpha]);
	}
	return $0;
});

// icons.dm:605
rt.def("/proc/GrayScale", function GrayScale(f: Frame, rgb: Value) {
	let $0: any;
	let RGB: Value = ReadRGB(rgb);
	let gray: Value = rt.index(RGB, 1) * 0.3 + rt.index(RGB, 2) * 0.59 + rt.index(RGB, 3) * 0.11;
	if (rt.len(f, RGB) > 3) {
		$0 = rt.op(f, "Rgb", [1, 4], [gray, gray, gray, rt.index(RGB, 4)]);
	} else {
		$0 = rt.op(f, "Rgb", [1, 3], [gray, gray, gray]);
	}
	return $0;
});

// icons.dm:611
rt.def("/proc/ColorTone", function ColorTone(f: Frame, rgb: Value, tone: Value) {
	let RGB: Value = ReadRGB(rgb);
	let TONE: Value = ReadRGB(tone);
	let gray: Value = rt.index(RGB, 1) * 0.3 + rt.index(RGB, 2) * 0.59 + rt.index(RGB, 3) * 0.11;
	let tone_gray: Value = rt.index(TONE, 1) * 0.3 + rt.index(TONE, 2) * 0.59 + rt.index(TONE, 3) * 0.11;
	if (gray <= tone_gray) {
		return BlendRGB("#000000", tone, gray / (tone_gray || 1));
	}
	return BlendRGB(tone, "#ffffff", (gray - tone_gray) / (255 - tone_gray || 1));
});

// icons.dm:623
rt.def("/proc/GetColors", function GetColors(f: Frame, hex: Value) {
	let $0: any, $1: any, $2: any, $3: any;
	if (rt.length((hex = uppertext(hex))) == 7) {
		hex += "FF";
	}
	let hi1: Value = text2ascii(hex, 2);
	let lo1: Value = text2ascii(hex, 3);
	let hi2: Value = text2ascii(hex, 4);
	let lo2: Value = text2ascii(hex, 5);
	let hi3: Value = text2ascii(hex, 6);
	let lo3: Value = text2ascii(hex, 7);
	let hi4: Value = text2ascii(hex, 8);
	let lo4: Value = text2ascii(hex, 9);
	if (hi1 >= 65) {
		$0 = hi1 - 55;
	} else {
		$0 = hi1 - 48;
	}
	$0 = rt.shiftLeft($0, 4);
	if (lo1 >= 65) {
		$1 = lo1 - 55;
	} else {
		$1 = lo1 - 48;
	}
	$0 = rt.bitOr($0, $1);
	if (hi2 >= 65) {
		$1 = hi2 - 55;
	} else {
		$1 = hi2 - 48;
	}
	$1 = rt.shiftLeft($1, 4);
	if (lo2 >= 65) {
		$2 = lo2 - 55;
	} else {
		$2 = lo2 - 48;
	}
	$1 = rt.bitOr($1, $2);
	if (hi3 >= 65) {
		$2 = hi3 - 55;
	} else {
		$2 = hi3 - 48;
	}
	$2 = rt.shiftLeft($2, 4);
	if (lo3 >= 65) {
		$3 = lo3 - 55;
	} else {
		$3 = lo3 - 48;
	}
	$2 = rt.bitOr($2, $3);
	if (hi4 >= 65) {
		$3 = hi4 - 55;
	} else {
		$3 = hi4 - 48;
	}
	$3 = rt.shiftLeft($3, 4);
	return list($0, $1, $2, rt.bitOr($3, lo4 >= 65 ? lo4 - 55 : lo4 - 48));
});

// icons.dm:650
rt.def("/proc/getFlatIcon", function getFlatIcon(f: Frame, A: Value, defdir: Value, deficon: Value, defstate: Value, defblend: Value) {
	let curicon: Value = null, curstate: Value = null, curdir: Value = null, curblend: Value = null, copy: Value = null, current: Value = null, currentLayer: Value = null, compare: Value = null, cmpIndex: Value = null, _add: Value = null, addX1: Value = null, addX2: Value = null, addY1: Value = null, addY2: Value = null, I: Value = null;
	defdir ??= A.dir;
	deficon ??= A.icon;
	defstate ??= A.icon_state;
	defblend ??= A.blend_mode;
	let flat: Value = icon(rt.rsc("icons/effects/effects.dmi"), "nothing");
	if (!A) {
		return flat;
	}
	if (A.alpha <= 0) {
		return flat;
	}
	let noIcon: Value = 0;
	if (A.icon) {
		curicon = A.icon;
	} else {
		curicon = deficon;
	}
	if (!curicon) {
		noIcon = 1;
	}
	if (A.icon_state) {
		curstate = A.icon_state;
	} else {
		curstate = defstate;
	}
	if (!noIcon && !rt.isIn(f, curstate, icon_states(curicon))) {
		if (rt.isIn(f, "", icon_states(curicon))) {
			curstate = "";
		} else {
			noIcon = 1;
		}
	}
	if (A.dir != 2) {
		curdir = A.dir;
	} else {
		curdir = defdir;
	}
	if (A.blend_mode == 0) {
		curblend = defblend;
	} else {
		curblend = A.blend_mode;
	}
	let layers: Value = list();
	if (!noIcon) {
		(copy = image({ icon: curicon, icon_state: curstate, layer: A.layer, dir: curdir })).color = A.color;
		copy.alpha = A.alpha;
		copy.blend_mode = curblend;
		rt.setAt(layers, copy, A.layer);
	}
	let process: Value = A.underlays;
	let pSet: Value = 0;
	let curIndex: Value = 1;
	while (true) {
		if (curIndex <= rt.len(f, process)) {
			if (!(current = rt.index(process, curIndex))) {
				curIndex++;
				continue;
			}
			if ((currentLayer = current.layer) < 0) {
				if (currentLayer <= -1000) {
					return flat;
				}
				if (pSet == 0) {
					currentLayer = A.layer + currentLayer / 1000;
				} else {
					currentLayer = A.layer + (1000 + currentLayer) / 1000;
				}
			}
			cmpIndex = 1;
			while (cmpIndex <= rt.len(f, layers)) {
				compare = rt.index(layers, cmpIndex);
				if (currentLayer < rt.index(layers, compare)) {
					layers.Insert(cmpIndex, current);
					rt.setAt(layers, current, currentLayer);
					break;
				}
				cmpIndex++;
			}
			if (cmpIndex > rt.len(f, layers)) {
				rt.setAt(layers, current, currentLayer);
			}
			curIndex++;
		}
		if (curIndex > rt.len(f, process)) {
			if (pSet == 0) {
				curIndex = 1;
				pSet = 1;
				process = A.overlays;
			} else {
				break;
			}
		}
	}
	let flatX1: Value = 1;
	let flatX2: Value = flat.Width();
	let flatY1: Value = 1;
	let flatY2: Value = flat.Height();
	for (I of each(layers)) {
		if (I.alpha == 0) {
			continue;
		}
		if (I == copy) {
			curblend = 1;
			_add = icon(I.icon, I.icon_state, I.dir);
		} else {
			_add = rt.call(f, P("/proc/getFlatIcon"), null, [new_(T("/image"), I), curdir, curicon, curstate, curblend]);
		}
		addX1 = min(flatX1, I.pixel_x + 1);
		addX2 = max(flatX2, I.pixel_x + _add.Width());
		addY1 = min(flatY1, I.pixel_y + 1);
		addY2 = max(flatY2, I.pixel_y + _add.Height());
		if (addX1 != flatX1 || addX2 != flatX2 || addY1 != flatY1 || addY2 != flatY2) {
			flat.Crop(addX1 - flatX1 + 1, addY1 - flatY1 + 1, addX2 - flatX1 + 1, addY2 - flatY1 + 1);
			flatX1 = addX1;
			flatX2 = addX2;
			flatY1 = addY1;
			flatY2 = addY2;
		}
		flat.Blend(_add, blendMode2iconMode(curblend), I.pixel_x + 2 - flatX1, I.pixel_y + 2 - flatY1);
	}
	if (A.color) {
		flat.Blend(A.color, 2);
	}
	if (A.alpha < 255) {
		flat.Blend(rt.op(f, "Rgb", [1, 4], [255, 255, 255, A.alpha]), 2);
	}
	return icon(flat, "", 2);
});

// icons.dm:814
rt.def("/proc/getHologramIcon", function getHologramIcon(f: Frame, A: Value, safety: Value) {
	let flat_icon: Value = null;
	safety ??= 1;
	(flat_icon = safety ? A : new_(T("/icon"), A)).ColorTone("#7db4e1");
	flat_icon.ChangeOpacity(0.5);
	let alpha_mask: Value = new_(T("/icon"), rt.rsc("icons/effects/effects.dmi"), "scanline");
	flat_icon.AddAlphaMask(alpha_mask);
	return flat_icon;
});

// icons.dm:833
rt.def("/proc/getStaticIcon", function getStaticIcon(f: Frame, A: Value, safety: Value) {
	let flat_icon: Value = null, static_icon: Value = null;
	safety ??= 1;
	(flat_icon = safety ? A : new_(T("/icon"), A)).Blend("#ffffff");
	flat_icon.BecomeAlphaMask();
	(static_icon = new_(T("/icon"), rt.rsc("icons/effects/effects.dmi"), "static_base")).AddAlphaMask(flat_icon);
	return static_icon;
});

// icons.dm:844
rt.def("/proc/getBlankIcon", function getBlankIcon(f: Frame, A: Value, safety: Value) {
	let flat_icon: Value = null, blank_icon: Value = null;
	safety ??= 1;
	(flat_icon = safety ? A : new_(T("/icon"), A)).Blend("#ffffff");
	flat_icon.BecomeAlphaMask();
	(blank_icon = new_(T("/icon"), rt.rsc("icons/effects/effects.dmi"), "blank_base")).AddAlphaMask(flat_icon);
	return blank_icon;
});

// icons.dm:855
rt.def("/proc/getLetterImage", function* getLetterImage(f: Frame, A: Value, letter: Value, uppercase: Value) {
	let text_image: Value = null;
	letter ??= "";
	uppercase ??= 0;
	if (!A) {
		return f.dot;
	}
	let atom_icon: Value = (yield* new_(T("/icon"), A.icon, A.icon_state));
	if (!letter) {
		letter = copytext(A.name, 1, 2);
		if (uppercase == 1) {
			letter = uppertext(letter);
		} else if (uppercase == -1) {
			letter = lowertext(letter);
		}
	}
	(text_image = (yield* new_(T("/image"), { loc: A }))).maptext = `<font size = 4>${letter}</font>`;
	text_image.pixel_x = 7;
	text_image.pixel_y = 5;
	yield* qdel(atom_icon);
	return text_image;
}, true);

// icons.dm:874
rt.def("/datum/controller/global_vars/proc/InitGlobalfriendly_animal_types", function InitGlobalfriendly_animal_types(f: Frame) {
	GLOB.friendly_animal_types = list();
	this.gvars_datum_init_order += "friendly_animal_types";
	return f.dot;
});

// icons.dm:878
rt.def("/proc/getRandomAnimalImage", function getRandomAnimalImage(f: Frame, A: Value) {
	let _T: Value = null, SA: Value = null;
	if (!rt.len(f, GLOB.friendly_animal_types)) {
		for (_T of each(typesof(T("/mob/living/simple_animal")))) {
			if (rt.initial(f, (SA = _T), "gold_core_spawnable") == 2) {
				GLOB.friendly_animal_types += SA;
			}
		}
	}
	let SA_0: Value = pick(GLOB.friendly_animal_types);
	let icon: Value = rt.initial(f, SA_0, "icon");
	let icon_state: Value = rt.initial(f, SA_0, "icon_state");
	let final_image: Value = image(icon, { icon_state: icon_state, loc: A });
	if (ispath(SA_0, T("/mob/living/simple_animal/butterfly"))) {
		final_image.color = rt.op(f, "Rgb", [1, 3], [rand(0, 255), rand(0, 255), rand(0, 255)]);
	}
	final_image.text = rt.initial(f, SA_0, "name");
	return final_image;
});

// icons.dm:902
rt.def("/proc/DrawPixel", function DrawPixel(f: Frame, I: Value, colour: Value, drawX: Value, drawY: Value) {
	if (!I) {
		return 0;
	}
	let Iwidth: Value = I.Width();
	let Iheight: Value = I.Height();
	if (drawX > Iwidth || drawX <= 0) {
		return 0;
	}
	if (drawY > Iheight || drawY <= 0) {
		return 0;
	}
	I.DrawBox(colour, drawX, drawY);
	return I;
});

// icons.dm:919
rt.def("/atom/proc/DrawPixelOn", function DrawPixelOn(f: Frame, colour: Value, drawX: Value, drawY: Value) {
	let J: Value = null;
	let I: Value = new_(T("/icon"), this.icon);
	if (J = DrawPixel(I, colour, drawX, drawY)) {
		this.icon = J;
		return J;
	}
	return 0;
});

// icons.dm:929
rt.def("/proc/get_flat_human_icon", function* get_flat_human_icon(f: Frame, icon_id: Value, J: Value, prefs: Value) {
	let body: Value = null, out_icon: Value = null, partial: Value = null;
	if (!icon_id || !rt.index(GLOB.humanoid_icon_cache, icon_id)) {
		body = (yield* new_(T("/mob/living/carbon/human/dummy")));
		if (prefs) {
			yield* prefs.copy_to(body);
		}
		if (J) {
			yield* J.equip(body, 1, 0);
		}
		yield* GLOB.SSoverlays.Flush();
		out_icon = icon(rt.rsc("icons/effects/effects.dmi"), "nothing");
		yield* body.setDir(1);
		partial = getFlatIcon(body);
		yield* out_icon.Insert(partial, { dir: 1 });
		yield* body.setDir(2);
		partial = getFlatIcon(body);
		yield* out_icon.Insert(partial, { dir: 2 });
		yield* body.setDir(8);
		partial = getFlatIcon(body);
		yield* out_icon.Insert(partial, { dir: 8 });
		yield* body.setDir(4);
		partial = getFlatIcon(body);
		yield* out_icon.Insert(partial, { dir: 4 });
		yield* qdel(body);
		rt.setAt(GLOB.humanoid_icon_cache, icon_id, out_icon);
		return out_icon;
	} else {
		return rt.index(GLOB.humanoid_icon_cache, icon_id);
	}
}, true);

// icons.dm:969
rt.def("/image/proc/setDir", function setDir(f: Frame, newdir: Value) {
	this.dir = newdir;
	return f.dot;
});

// icons.dm:972
rt.def("/atom/proc/freeze_icon_index", function freeze_icon_index(f: Frame) {
	return fmt("＃-＀", [rt.initial(f, this, "icon"), rt.initial(f, this, "icon_state")]);
});

// icons.dm:977
rt.def("/obj/proc/make_frozen_visual", function make_frozen_visual(f: Frame) {
	let IC: Value = null, _P: Value = null, iconstate: Value = null, O: Value = null;
	let $0: any, $e: any;
	if (this.secondary_flags) {
		$0 = rt.index(this.secondary_flags, "frozen");
	} else {
		$0 = 0;
	}
	if (!(!$0 && rt.initial(f, this, "icon") && rt.initial(f, this, "icon_state"))) return f.dot;
	let index: Value = this.freeze_icon_index();
	if (!(_P = rt.index(GLOB.freeze_item_icons, index))) {
		_P = new_(T("/icon"));
		for (iconstate of each(icon_states(this.icon))) {
			O = new_(T("/icon"), rt.rsc("icons/effects/freeze.dmi"), "ice_cube");
			IC = new_(T("/icon"), this.icon, iconstate);
			O.Blend(IC, 0);
			_P.Insert(O, iconstate);
		}
		rt.setAt(GLOB.freeze_item_icons, index, _P);
	}
	this.icon = _P;
	this.name = `frozen ${this.name}`;
	if (!this.secondary_flags) {
		this.secondary_flags = list();
	}
	rt.setAt(this.secondary_flags, "frozen", 1);
	return f.dot;
});

// icons.dm:995
rt.def("/obj/proc/make_unfrozen", function make_unfrozen(f: Frame) {
	this.icon = rt.initial(f, this, "icon");
	this.name = replacetext(this.name, "frozen ", "");
	if (!this.secondary_flags) return f.dot;
	rt.setAt(this.secondary_flags, "frozen", null);
	return f.dot;
});
