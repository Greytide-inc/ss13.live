// Based on /tg/station's code/__HELPERS/text.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { g, fmt } = rt;


// text.dm:31
rt.def("/proc/strip_html_simple", function strip_html_simple(f: Frame, t: Value, limit: Value) {
	let char: Value = null, index: Value = null;
	limit ??= 1024;
	let strip_chars: Value = list("<", ">");
	t = copytext(t, 1, limit);
	for (char of each(strip_chars)) {
		index = findtext(t, char);
		while (index) {
			index = findtext((t = copytext(t, 1, index) + copytext(t, index + 1)), char);
		}
	}
	return t;
});

// text.dm:41
rt.def("/proc/sanitize_simple", function sanitize_simple(f: Frame, t: Value, repl_chars: Value) {
	let char: Value = null, index: Value = null;
	repl_chars ??= rt.alist(f, ["\n", "#", "\t", "#"]);
	for (char of each(repl_chars)) {
		index = findtext(t, char);
		while (index) {
			index = findtext((t = copytext(t, 1, index) + rt.index(repl_chars, char) + copytext(t, index + 1)), char, index + 1);
		}
	}
	return t;
});

// text.dm:50
rt.def("/proc/sanitize", function sanitize(f: Frame, t: Value, repl_chars: Value) {
	return html_encode(sanitize_simple(t, repl_chars));
});

// text.dm:55
rt.def("/proc/strip_html", function strip_html(f: Frame, t: Value, limit: Value) {
	limit ??= 1024;
	return copytext(sanitize(strip_html_simple(t)), 1, limit);
});

// text.dm:60
rt.def("/proc/adminscrub", function adminscrub(f: Frame, t: Value, limit: Value) {
	limit ??= 1024;
	return copytext(html_encode(strip_html_simple(t)), 1, limit);
});

// text.dm:65
rt.def("/proc/reject_bad_text", function reject_bad_text(f: Frame, text: Value, max_length: Value) {
	max_length ??= 512;
	if (rt.length(text) > max_length) {
		return f.dot;
	}
	let non_whitespace: Value = 0;
	let i: Value = 1;
	while (i <= rt.length(text)) {
		const text2ascii_2 = text2ascii(text, i);
		if (text2ascii_2 === 62 || text2ascii_2 === 60 || text2ascii_2 === 92 || text2ascii_2 === 47) {
			return f.dot;
		} else if (rt.inRange(text2ascii_2, 127, 255)) {
			return f.dot;
		} else if (rt.inRange(text2ascii_2, 0, 31)) {
			return f.dot;
		} else if (text2ascii_2 === 32) {
		} else {
			non_whitespace = 1;
		}
		i++;
	}
	if (!non_whitespace) return f.dot;
	return text;
});

// text.dm:86
rt.def("/proc/stripped_input", function* stripped_input(f: Frame, user: Value, message: Value, title: Value, _default: Value, max_length: Value, no_trim: Value) {
	message ??= "";
	title ??= "";
	_default ??= "";
	max_length ??= 1024;
	no_trim ??= 0;
	let name: Value = (yield* g.op(f, "Prompt", [3], [_default, title, message, user, null]));
	if (no_trim) {
		return copytext(html_encode(name), 1, max_length);
	}
	return trim(html_encode(name), max_length);
}, true);

// text.dm:94
rt.def("/proc/stripped_multiline_input", function* stripped_multiline_input(f: Frame, user: Value, message: Value, title: Value, _default: Value, max_length: Value, no_trim: Value) {
	message ??= "";
	title ??= "";
	_default ??= "";
	max_length ??= 1024;
	no_trim ??= 0;
	let name: Value = (yield* g.op(f, "Prompt", [65], [_default, title, message, user, null]));
	if (no_trim) {
		return copytext(html_encode(name), 1, max_length);
	}
	return trim(html_encode(name), max_length);
}, true);

// text.dm:102
rt.def("/proc/reject_bad_name", function reject_bad_name(f: Frame, t_in: Value, allow_numbers: Value, max_length: Value) {
	let ascii_char: Value = null, bad_name: Value = null;
	let $e: any;
	allow_numbers ??= 0;
	max_length ??= 42;
	if (!t_in || rt.length(t_in) > max_length) {
		return f.dot;
	}
	let number_of_alphanumeric: Value = 0;
	let last_char_group: Value = 0;
	let t_out: Value = "";
	let i: Value = 1;
	while (i <= rt.length(t_in)) {
		blk123: {
			const subject = (ascii_char = text2ascii(t_in, i));
			if (rt.inRange(subject, 65, 90)) {
				t_out += ascii2text(ascii_char);
				number_of_alphanumeric++;
				last_char_group = 4;
			} else if (rt.inRange(subject, 97, 122)) {
				if (last_char_group < 2) {
					t_out += ascii2text(ascii_char - 32);
				} else {
					t_out += ascii2text(ascii_char);
				}
				number_of_alphanumeric++;
				last_char_group = 4;
			} else if (rt.inRange(subject, 48, 57)) {
				if (!last_char_group) {
					break blk123;
				}
				if (!allow_numbers) {
					break blk123;
				}
				t_out += ascii2text(ascii_char);
				number_of_alphanumeric++;
				last_char_group = 3;
			} else if (subject === 39 || subject === 45 || subject === 46) {
				if (!last_char_group) {
					break blk123;
				}
				t_out += ascii2text(ascii_char);
				last_char_group = 2;
			} else if (subject === 126 || subject === 124 || subject === 64 || subject === 58 || subject === 35 || subject === 36 || subject === 37 || subject === 38 || subject === 42 || subject === 43) {
				if (!last_char_group) {
					break blk123;
				}
				if (!allow_numbers) {
					break blk123;
				}
				t_out += ascii2text(ascii_char);
				last_char_group = 2;
			} else if (subject === 32) {
				if (!(last_char_group <= 1)) {
					t_out += ascii2text(ascii_char);
					last_char_group = 1;
				}
			} else {
				return f.dot;
			}
		}
		i++;
	}
	if (number_of_alphanumeric < 2) {
		return f.dot;
	}
	if (last_char_group == 1) {
		t_out = copytext(t_out, 1, rt.length(t_out));
	}
	for (bad_name of each(list("space", "floor", "wall", "r-wall", "monkey", "unknown", "inactive ai"))) {
		if (cmptext(t_out, bad_name)) {
			return f.dot;
		}
	}
	return t_out;
});

// text.dm:191
rt.def("/proc/dd_hasprefix", function dd_hasprefix(f: Frame, text: Value, prefix: Value) {
	let start: Value = 1;
	let end: Value = rt.length(prefix) + 1;
	return findtext(text, prefix, start, end);
});

// text.dm:198
rt.def("/proc/dd_hasprefix_case", function dd_hasprefix_case(f: Frame, text: Value, prefix: Value) {
	let start: Value = 1;
	let end: Value = rt.length(prefix) + 1;
	return findtextEx(text, prefix, start, end);
});

// text.dm:204
rt.def("/proc/dd_hassuffix", function dd_hassuffix(f: Frame, text: Value, suffix: Value) {
	let start: Value = null;
	if (start = rt.length(text) - rt.length(suffix)) {
		return findtext(text, suffix, start, null);
	}
	return f.dot;
});

// text.dm:232
rt.def("/proc/add_zero", function add_zero(f: Frame, t: Value, u: Value) {
	while (rt.length(t) < u) {
		t = `0${t}`;
	}
	return t;
});

// text.dm:250
rt.def("/proc/trim_left", function trim_left(f: Frame, text: Value) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, rt.length(text), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (text2ascii(text, i) > 32) {
			return copytext(text, i);
		}
	}
	rt.endFor(f, 0);
	return "";
});

// text.dm:257
rt.def("/proc/trim_right", function trim_right(f: Frame, text: Value) {
	let i: Value = rt.length(text);
	while (i > 0) {
		if (text2ascii(text, i) > 32) {
			return copytext(text, 1, i + 1);
		}
		i--;
	}
	return "";
});

// text.dm:266
rt.def("/proc/trim", function trim(f: Frame, text: Value, max_length: Value) {
	if (max_length) {
		text = copytext(text, 1, max_length);
	}
	return trim_left(trim_right(text));
});

// text.dm:271
rt.def("/proc/capitalize", function capitalize(f: Frame, t: Value) {
	return uppertext(copytext(t, 1, 2)) + copytext(t, 2);
});

// text.dm:292
rt.def("/proc/dd_limittext", function dd_limittext(f: Frame, message: Value, length: Value) {
	let size: Value = null;
	if ((size = rt.length(message)) <= length) {
		return message;
	}
	return copytext(message, 1, length + 1);
});

// text.dm:337
rt.def("/datum/controller/global_vars/proc/InitGlobalzero_character_only", function InitGlobalzero_character_only(f: Frame) {
	GLOB.zero_character_only = list("0");
	this.gvars_datum_init_order += "zero_character_only";
	return f.dot;
});

// text.dm:338
rt.def("/datum/controller/global_vars/proc/InitGlobalhex_characters", function InitGlobalhex_characters(f: Frame) {
	GLOB.hex_characters = list("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f");
	this.gvars_datum_init_order += "hex_characters";
	return f.dot;
});

// text.dm:339
rt.def("/datum/controller/global_vars/proc/InitGlobalalphabet", function InitGlobalalphabet(f: Frame) {
	GLOB.alphabet = list("a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z");
	this.gvars_datum_init_order += "alphabet";
	return f.dot;
});

// text.dm:340
rt.def("/datum/controller/global_vars/proc/InitGlobalbinary", function InitGlobalbinary(f: Frame) {
	GLOB.binary = list("0", "1");
	this.gvars_datum_init_order += "binary";
	return f.dot;
});

// text.dm:342
rt.def("/proc/random_string", function random_string(f: Frame, length: Value, characters: Value) {
	f.dot = "";
	let i: Value = 1;
	while (i <= length) {
		f.dot += pick(characters);
		i++;
	}
	return f.dot;
});

// text.dm:347
rt.def("/proc/repeat_string", function repeat_string(f: Frame, times: Value, string: Value) {
	string ??= "";
	f.dot = "";
	let i: Value = 1;
	while (i <= times) {
		f.dot += string;
		i++;
	}
	return f.dot;
});

// text.dm:352
rt.def("/proc/random_short_color", function random_short_color(f: Frame) {
	return random_string(3, GLOB.hex_characters);
});

// text.dm:355
rt.def("/proc/random_color", function random_color(f: Frame) {
	return random_string(6, GLOB.hex_characters);
});

// text.dm:373
rt.def("/proc/merge_text", function merge_text(f: Frame, into: Value, from: Value, null_char: Value) {
	let ascii: Value = null;
	null_char ??= "_";
	f.dot = "";
	if (!istext(into)) {
		into = "";
	}
	if (!istext(from)) {
		from = "";
	}
	let null_ascii: Value = istext(null_char) ? text2ascii(null_char, 1) : null_char;
	let previous: Value = 0;
	let start: Value = 1;
	let end: Value = rt.length(into) + 1;
	let i: Value = 1;
	while (i < end) {
		if ((ascii = text2ascii(from, i)) == null_ascii) {
			if (previous != 1) {
				f.dot += copytext(from, start, i);
				start = i;
				previous = 1;
			}
		} else if (previous != 0) {
			f.dot += copytext(into, start, i);
			start = i;
			previous = 0;
		}
		i++;
	}
	if (previous == 0) {
		f.dot += copytext(from, start, end);
	} else {
		f.dot += copytext(into, start, end);
	}
	return f.dot;
});

// text.dm:407
rt.def("/proc/findchar", function findchar(f: Frame, haystack: Value, needles: Value, start: Value, end: Value) {
	let temp: Value = null;
	start ??= 1;
	end ??= 0;
	let len: Value = rt.length(needles);
	let i: Value = 1;
	while (i <= len) {
		if (temp = findtextEx(haystack, ascii2text(text2ascii(needles, i)), start, end)) {
			end = temp;
		}
		i++;
	}
	return end;
});

// text.dm:416
rt.def("/proc/parsepencode", function parsepencode(f: Frame, t: Value, user: Value, signfont: Value) {
	signfont ??= "Times New Roman";
	if (rt.length(t) < 1) {
		return f.dot;
	}
	t = replacetext((t = replacetext((t = replacetext((t = replacetext((t = replacetext((t = replacetext((t = replacetext((t = replacetext((t = replacetext((t = replacetext((t = replacetext(t, "[center]", "<center>")), "[/center]", "</center>")), "[br]", "<BR>")), "[b]", "<B>")), "[/b]", "</B>")), "[i]", "<I>")), "[/i]", "</I>")), "[u]", "<U>")), "[/u]", "</U>")), "[large]", "<font size=\"4\">")), "[/large]", "</font>");
	if (user) {
		t = replacetext(t, "[sign]", `<font face="${signfont}"><i>${user.real_name}</i></font>`);
	} else {
		t = replacetext(t, "[sign]", "");
	}
	return (t = replacetext((t = replacetext((t = replacetext((t = replacetext((t = replacetext((t = replacetext((t = replacetext(t, "[field]", "<span class=\"paper_field\"></span>")), "[*]", "<li>")), "[hr]", "<HR>")), "[small]", "<font size = \"1\">")), "[/small]", "</font>")), "[list]", "<ul>")), "[/list]", "</ul>"));
});

// text.dm:448
rt.def("/proc/rot13", function rot13(f: Frame, text: Value) {
	let c: Value = null, ca: Value = null;
	text ??= "";
	let textlist: Value = splittext(text, regex("(.)")) - splittext(text, "");
	let result: Value = list();
	for (c of each(textlist)) {
		if ((ca = text2ascii(c)) >= text2ascii("a") && ca <= text2ascii("m")) {
			ca += 13;
		} else if (ca >= text2ascii("n") && ca <= text2ascii("z")) {
			ca -= 13;
		} else if (ca >= text2ascii("A") && ca <= text2ascii("M")) {
			ca += 13;
		} else if (ca >= text2ascii("N") && ca <= text2ascii("Z")) {
			ca -= 13;
		}
		result += ascii2text(ca);
	}
	return jointext(result, "");
});

// text.dm:560
rt.def("/proc/apply_text_macros", function apply_text_macros(f: Frame, string: Value) {
	let next_backslash: Value = null, next_space: Value = null;
	if (!(next_backslash = findtext(string, "\\"))) {
		return string;
	}
	let leng: Value = rt.length(string);
	if (!(next_space = findtext(string, " ", next_backslash + 1))) {
		next_space = leng - next_backslash;
	}
	if (!next_space) {
		return string;
	}
	let base: Value = next_backslash == 1 ? "" : copytext(string, 1, next_backslash);
	let macro: Value = lowertext(copytext(string, next_backslash + 1, next_space));
	let rest: Value = next_backslash > leng ? "" : copytext(string, next_space + 1);
	if (macro === "the") {
		rest = fmt("％！", [rest]);
	} else if (macro === "a") {
		rest = fmt("＇！", [rest]);
	} else if (macro === "an") {
		rest = fmt("＇！", [rest]);
	} else if (macro === "proper") {
		rest = `ÿ\u0015${rest}`;
	} else if (macro === "improper") {
		rest = `ÿ\u0016${rest}`;
	} else if (macro === "roman") {
		rest = fmt("２ ！", [rest]);
	} else if (macro === "th") {
		base = fmt("＀４", [rest]);
	} else if (macro === "s") {
		base = fmt("＀５", [rest]);
	} else if (macro === "he") {
		base = fmt("＀）", [rest]);
	} else if (macro === "she") {
		base = fmt("＀）", [rest]);
	} else if (macro === "his") {
		base = fmt("＀＋", [rest]);
	} else if (macro === "himself") {
		base = fmt("＀－", [rest]);
	} else if (macro === "herself") {
		base = fmt("＀－", [rest]);
	} else if (macro === "hers") {
		base = fmt("＀／", [rest]);
	}
	f.dot = base;
	if (!rest) return f.dot;
	f.dot += rt.callSelf(f, [rest]);
	return f.dot;
});
