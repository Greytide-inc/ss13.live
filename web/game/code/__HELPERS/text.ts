// From code/__HELPERS/text.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/strip_html_simple  (code/__HELPERS/text.dm:31)
rt.def("/proc/strip_html_simple", function strip_html_simple(f: Frame, t: Value, limit: Value) {
	let strip_chars: Value = null, char: Value = null, index: Value = null;
	let $e: any;
	f.vars = () => [t, limit, strip_chars, char, index, $e];
	if (live(limit) === null) {
		limit = 1024;
	}
	strip_chars = rt.list("<", ">");
	t = rt.call(f, P("/proc/copytext"), null, [live(t), 1, live(limit)]);
	char = null;
	rt.forList(f, 0, live(strip_chars));
	while (($e = rt.next(f, 0)) !== undefined) {
		char = $e;
		index = rt.call(f, P("/proc/findtext"), null, [live(t), live(char)]);
		while (truthy(live(index))) {
			index = rt.call(f, P("/proc/findtext"), null, [(t = add(rt.call(f, P("/proc/copytext"), null, [live(t), 1, live(index)]), rt.call(f, P("/proc/copytext"), null, [live(t), add(live(index), 1)]))), live(char)]);
		}
	}
	rt.endFor(f, 0);
	return live(t);
});

// /proc/sanitize_simple  (code/__HELPERS/text.dm:41)
rt.def("/proc/sanitize_simple", function sanitize_simple(f: Frame, t: Value, repl_chars: Value) {
	let char: Value = null, index: Value = null;
	let $e: any;
	f.vars = () => [t, repl_chars, char, index, $e];
	if (live(repl_chars) === null) {
		repl_chars = rt.alist(f, ["\n", "#", "\t", "#"]);
	}
	char = null;
	rt.forList(f, 0, live(repl_chars));
	while (($e = rt.next(f, 0)) !== undefined) {
		char = $e;
		index = rt.call(f, P("/proc/findtext"), null, [live(t), live(char)]);
		while (truthy(live(index))) {
			index = rt.call(f, P("/proc/findtext"), null, [(t = add(add(rt.call(f, P("/proc/copytext"), null, [live(t), 1, live(index)]), rt.index(live(repl_chars), live(char))), rt.call(f, P("/proc/copytext"), null, [live(t), add(live(index), 1)]))), live(char), add(live(index), 1)]);
		}
	}
	rt.endFor(f, 0);
	return live(t);
});

// /proc/sanitize  (code/__HELPERS/text.dm:50)
rt.def("/proc/sanitize", function sanitize(f: Frame, t: Value, repl_chars: Value) {
	f.vars = () => [repl_chars];
	if (live(repl_chars) === null) {
		repl_chars = null;
	}
	return rt.call(f, P("/proc/html_encode"), null, [rt.call(f, P("/proc/sanitize_simple"), null, [live(t), live(repl_chars)])]);
});

// /proc/strip_html  (code/__HELPERS/text.dm:55)
rt.def("/proc/strip_html", function strip_html(f: Frame, t: Value, limit: Value) {
	f.vars = () => [limit];
	if (live(limit) === null) {
		limit = 1024;
	}
	return rt.call(f, P("/proc/copytext"), null, [rt.call(f, P("/proc/sanitize"), null, [rt.call(f, P("/proc/strip_html_simple"), null, [live(t)])]), 1, live(limit)]);
});

// /proc/adminscrub  (code/__HELPERS/text.dm:60)
rt.def("/proc/adminscrub", function adminscrub(f: Frame, t: Value, limit: Value) {
	f.vars = () => [limit];
	if (live(limit) === null) {
		limit = 1024;
	}
	return rt.call(f, P("/proc/copytext"), null, [rt.call(f, P("/proc/html_encode"), null, [rt.call(f, P("/proc/strip_html_simple"), null, [live(t)])]), 1, live(limit)]);
});

// /proc/reject_bad_text  (code/__HELPERS/text.dm:65)
rt.def("/proc/reject_bad_text", function reject_bad_text(f: Frame, text: Value, max_length: Value) {
	let non_whitespace: Value = null, i: Value = null;
	let $0: any;
	f.vars = () => [max_length, non_whitespace, i, $0];
	if (live(max_length) === null) {
		max_length = 512;
	}
	if (rt.gt(rt.length(live(text)), live(max_length))) {
		return live(f.dot);
	}
	non_whitespace = 0;
	i = null;
	i = 1;
	while (rt.le(live(i), rt.length(live(text)))) {
		$0 = rt.call(f, P("/proc/text2ascii"), null, [live(text), live(i)]);
		if ($0 === 62 || $0 === 60 || $0 === 92 || $0 === 47) {
			return live(f.dot);
		} else if (rt.inRange($0, 127, 255)) {
			return live(f.dot);
		} else if (rt.inRange($0, 0, 31)) {
			return live(f.dot);
		} else if ($0 === 32) {
		} else {
			non_whitespace = 1;
		}
		i = rt.inc(live(i), 1);
	}
	if (!truthy(live(non_whitespace))) return f.dot;
	return live(text);
});

// /proc/stripped_input  (code/__HELPERS/text.dm:86)  may sleep
rt.def("/proc/stripped_input", function* stripped_input(f: Frame, user: Value, message: Value, title: Value, _default: Value, max_length: Value, no_trim: Value) {
	let name: Value = null;
	f.vars = () => [user, message, title, _default, max_length, no_trim, name];
	if (live(message) === null) {
		message = "";
	}
	if (live(title) === null) {
		title = "";
	}
	if (live(_default) === null) {
		_default = "";
	}
	if (live(max_length) === null) {
		max_length = 1024;
	}
	if (live(no_trim) === null) {
		no_trim = 0;
	}
	name = (yield* g.op(f, "Prompt", [3], [live(_default), live(title), live(message), live(user), null]));
	if (truthy(live(no_trim))) {
		return (yield* g.call(f, P("/proc/copytext"), null, [(yield* g.call(f, P("/proc/html_encode"), null, [live(name)])), 1, live(max_length)]));
	}
	return (yield* g.call(f, P("/proc/trim"), null, [(yield* g.call(f, P("/proc/html_encode"), null, [live(name)])), live(max_length)]));
}, true);

// /proc/stripped_multiline_input  (code/__HELPERS/text.dm:94)  may sleep
rt.def("/proc/stripped_multiline_input", function* stripped_multiline_input(f: Frame, user: Value, message: Value, title: Value, _default: Value, max_length: Value, no_trim: Value) {
	let name: Value = null;
	f.vars = () => [user, message, title, _default, max_length, no_trim, name];
	if (live(message) === null) {
		message = "";
	}
	if (live(title) === null) {
		title = "";
	}
	if (live(_default) === null) {
		_default = "";
	}
	if (live(max_length) === null) {
		max_length = 1024;
	}
	if (live(no_trim) === null) {
		no_trim = 0;
	}
	name = (yield* g.op(f, "Prompt", [65], [live(_default), live(title), live(message), live(user), null]));
	if (truthy(live(no_trim))) {
		return (yield* g.call(f, P("/proc/copytext"), null, [(yield* g.call(f, P("/proc/html_encode"), null, [live(name)])), 1, live(max_length)]));
	}
	return (yield* g.call(f, P("/proc/trim"), null, [(yield* g.call(f, P("/proc/html_encode"), null, [live(name)])), live(max_length)]));
}, true);

// /proc/reject_bad_name  (code/__HELPERS/text.dm:102)
rt.def("/proc/reject_bad_name", function reject_bad_name(f: Frame, t_in: Value, allow_numbers: Value, max_length: Value) {
	let number_of_alphanumeric: Value = null, last_char_group: Value = null, t_out: Value = null, i: Value = null, ascii_char: Value = null, bad_name: Value = null;
	let $0: any, $e: any;
	f.vars = () => [allow_numbers, max_length, number_of_alphanumeric, last_char_group, t_out, i, ascii_char, bad_name, $0, $e];
	if (live(allow_numbers) === null) {
		allow_numbers = 0;
	}
	if (live(max_length) === null) {
		max_length = 42;
	}
	if ((!truthy(live(t_in)) || rt.gt(rt.length(live(t_in)), live(max_length)))) {
		return live(f.dot);
	}
	number_of_alphanumeric = 0;
	last_char_group = 0;
	t_out = "";
	i = null;
	i = 1;
	while (rt.le(live(i), rt.length(live(t_in)))) {
		blk123: {
			$0 = (ascii_char = rt.call(f, P("/proc/text2ascii"), null, [live(t_in), live(i)]));
			if (rt.inRange($0, 65, 90)) {
				t_out = rt.modify(live(t_out), rt.call(f, P("/proc/ascii2text"), null, [live(ascii_char)]), add);
				number_of_alphanumeric = rt.inc(live(number_of_alphanumeric), 1);
				last_char_group = 4;
			} else if (rt.inRange($0, 97, 122)) {
				if (rt.lt(live(last_char_group), 2)) {
					t_out = rt.modify(live(t_out), rt.call(f, P("/proc/ascii2text"), null, [subtract(live(ascii_char), 32)]), add);
				} else {
					t_out = rt.modify(live(t_out), rt.call(f, P("/proc/ascii2text"), null, [live(ascii_char)]), add);
				}
				number_of_alphanumeric = rt.inc(live(number_of_alphanumeric), 1);
				last_char_group = 4;
			} else if (rt.inRange($0, 48, 57)) {
				if (!truthy(live(last_char_group))) {
					break blk123;
				}
				if (!truthy(live(allow_numbers))) {
					break blk123;
				}
				t_out = rt.modify(live(t_out), rt.call(f, P("/proc/ascii2text"), null, [live(ascii_char)]), add);
				number_of_alphanumeric = rt.inc(live(number_of_alphanumeric), 1);
				last_char_group = 3;
			} else if ($0 === 39 || $0 === 45 || $0 === 46) {
				if (!truthy(live(last_char_group))) {
					break blk123;
				}
				t_out = rt.modify(live(t_out), rt.call(f, P("/proc/ascii2text"), null, [live(ascii_char)]), add);
				last_char_group = 2;
			} else if ($0 === 126 || $0 === 124 || $0 === 64 || $0 === 58 || $0 === 35 || $0 === 36 || $0 === 37 || $0 === 38 || $0 === 42 || $0 === 43) {
				if (!truthy(live(last_char_group))) {
					break blk123;
				}
				if (!truthy(live(allow_numbers))) {
					break blk123;
				}
				t_out = rt.modify(live(t_out), rt.call(f, P("/proc/ascii2text"), null, [live(ascii_char)]), add);
				last_char_group = 2;
			} else if ($0 === 32) {
				if (!rt.le(live(last_char_group), 1)) {
					t_out = rt.modify(live(t_out), rt.call(f, P("/proc/ascii2text"), null, [live(ascii_char)]), add);
					last_char_group = 1;
				}
			} else {
				return live(f.dot);
			}
		}
		i = rt.inc(live(i), 1);
	}
	if (rt.lt(live(number_of_alphanumeric), 2)) {
		return live(f.dot);
	}
	if (isEqual(live(last_char_group), 1)) {
		t_out = rt.call(f, P("/proc/copytext"), null, [live(t_out), 1, rt.length(live(t_out))]);
	}
	bad_name = null;
	rt.forList(f, 0, rt.list("space", "floor", "wall", "r-wall", "monkey", "unknown", "inactive ai"));
	while (($e = rt.next(f, 0)) !== undefined) {
		bad_name = $e;
		if (truthy(rt.call(f, P("/proc/cmptext"), null, [live(t_out), live(bad_name)]))) {
			return live(f.dot);
		}
	}
	rt.endFor(f, 0);
	return live(t_out);
});

// /proc/non_zero_min  (code/__HELPERS/text.dm:177)
rt.def("/proc/non_zero_min", function non_zero_min(f: Frame, a: Value, b: Value) {
	let $0: any;
	f.vars = () => [$0];
	if (!truthy(live(a))) {
		return live(b);
	}
	if (!truthy(live(b))) {
		return live(a);
	}
	if (rt.lt(live(a), live(b))) {
		$0 = live(a);
	} else {
		$0 = live(b);
	}
	return $0;
});

// /proc/dd_hasprefix  (code/__HELPERS/text.dm:191)
rt.def("/proc/dd_hasprefix", function dd_hasprefix(f: Frame, text: Value, prefix: Value) {
	let start: Value = null, end: Value = null;
	f.vars = () => [start, end];
	start = 1;
	end = add(rt.length(live(prefix)), 1);
	return rt.call(f, P("/proc/findtext"), null, [live(text), live(prefix), live(start), live(end)]);
});

// /proc/dd_hasprefix_case  (code/__HELPERS/text.dm:198)
rt.def("/proc/dd_hasprefix_case", function dd_hasprefix_case(f: Frame, text: Value, prefix: Value) {
	let start: Value = null, end: Value = null;
	f.vars = () => [start, end];
	start = 1;
	end = add(rt.length(live(prefix)), 1);
	return rt.call(f, P("/proc/findtextEx"), null, [live(text), live(prefix), live(start), live(end)]);
});

// /proc/dd_hassuffix  (code/__HELPERS/text.dm:204)
rt.def("/proc/dd_hassuffix", function dd_hassuffix(f: Frame, text: Value, suffix: Value) {
	let start: Value = null;
	f.vars = () => [start];
	if (truthy((start = subtract(rt.length(live(text)), rt.length(live(suffix)))))) {
		return rt.call(f, P("/proc/findtext"), null, [live(text), live(suffix), live(start), null]);
	}
	return live(f.dot);
});

// /proc/dd_hassuffix_case  (code/__HELPERS/text.dm:212)
rt.def("/proc/dd_hassuffix_case", function dd_hassuffix_case(f: Frame, text: Value, suffix: Value) {
	let start: Value = null;
	f.vars = () => [start];
	if (!truthy((start = subtract(rt.length(live(text)), rt.length(live(suffix)))))) return f.dot;
	return rt.call(f, P("/proc/findtextEx"), null, [live(text), live(suffix), live(start), null]);
});

// /proc/text_in_list  (code/__HELPERS/text.dm:218)
rt.def("/proc/text_in_list", function text_in_list(f: Frame, haystack: Value, needle_list: Value, start: Value, end: Value) {
	let needle: Value = null;
	let $e: any;
	f.vars = () => [start, end, needle, $e];
	if (live(start) === null) {
		start = 1;
	}
	if (live(end) === null) {
		end = 0;
	}
	needle = null;
	rt.forList(f, 0, live(needle_list));
	while (($e = rt.next(f, 0)) !== undefined) {
		needle = $e;
		if (truthy(rt.call(f, P("/proc/findtext"), null, [live(haystack), live(needle), live(start), live(end)]))) {
			return 1;
		}
	}
	rt.endFor(f, 0);
	return 0;
});

// /proc/text_in_list_case  (code/__HELPERS/text.dm:225)
rt.def("/proc/text_in_list_case", function text_in_list_case(f: Frame, haystack: Value, needle_list: Value, start: Value, end: Value) {
	let needle: Value = null;
	let $e: any;
	f.vars = () => [start, end, needle, $e];
	if (live(start) === null) {
		start = 1;
	}
	if (live(end) === null) {
		end = 0;
	}
	needle = null;
	rt.forList(f, 0, live(needle_list));
	while (($e = rt.next(f, 0)) !== undefined) {
		needle = $e;
		if (truthy(rt.call(f, P("/proc/findtextEx"), null, [live(haystack), live(needle), live(start), live(end)]))) {
			return 1;
		}
	}
	rt.endFor(f, 0);
	return 0;
});

// /proc/add_zero  (code/__HELPERS/text.dm:232)
rt.def("/proc/add_zero", function add_zero(f: Frame, t: Value, u: Value) {
	f.vars = () => [t];
	while (rt.lt(rt.length(live(t)), live(u))) {
		t = fmt("0＀", [live(t)]);
	}
	return live(t);
});

// /proc/add_lspace  (code/__HELPERS/text.dm:238)
rt.def("/proc/add_lspace", function add_lspace(f: Frame, t: Value, u: Value) {
	f.vars = () => [t];
	while (rt.lt(rt.length(live(t)), live(u))) {
		t = fmt(" ＀", [live(t)]);
	}
	return live(t);
});

// /proc/add_tspace  (code/__HELPERS/text.dm:244)
rt.def("/proc/add_tspace", function add_tspace(f: Frame, t: Value, u: Value) {
	f.vars = () => [t];
	while (rt.lt(rt.length(live(t)), live(u))) {
		t = fmt("＀ ", [live(t)]);
	}
	return live(t);
});

// /proc/trim_left  (code/__HELPERS/text.dm:250)
rt.def("/proc/trim_left", function trim_left(f: Frame, text: Value) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, rt.length(live(text)), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (rt.gt(rt.call(f, P("/proc/text2ascii"), null, [live(text), live(i)]), 32)) {
			return rt.call(f, P("/proc/copytext"), null, [live(text), live(i)]);
		}
	}
	rt.endFor(f, 0);
	return "";
});

// /proc/trim_right  (code/__HELPERS/text.dm:257)
rt.def("/proc/trim_right", function trim_right(f: Frame, text: Value) {
	let i: Value = null;
	f.vars = () => [i];
	i = null;
	i = rt.length(live(text));
	while (rt.gt(live(i), 0)) {
		if (rt.gt(rt.call(f, P("/proc/text2ascii"), null, [live(text), live(i)]), 32)) {
			return rt.call(f, P("/proc/copytext"), null, [live(text), 1, add(live(i), 1)]);
		}
		i = rt.inc(live(i), -1);
	}
	return "";
});

// /proc/trim  (code/__HELPERS/text.dm:266)
rt.def("/proc/trim", function trim(f: Frame, text: Value, max_length: Value) {
	f.vars = () => [text];
	if (truthy(live(max_length))) {
		text = rt.call(f, P("/proc/copytext"), null, [live(text), 1, live(max_length)]);
	}
	return rt.call(f, P("/proc/trim_left"), null, [rt.call(f, P("/proc/trim_right"), null, [live(text)])]);
});

// /proc/capitalize  (code/__HELPERS/text.dm:271)
rt.def("/proc/capitalize", function capitalize(f: Frame, t: Value) {
	return add(rt.call(f, P("/proc/uppertext"), null, [rt.call(f, P("/proc/copytext"), null, [live(t), 1, 2])]), rt.call(f, P("/proc/copytext"), null, [live(t), 2]));
});

// /proc/dd_centertext  (code/__HELPERS/text.dm:275)
rt.def("/proc/dd_centertext", function dd_centertext(f: Frame, message: Value, length: Value) {
	let new_message: Value = null, size: Value = null, delta: Value = null, spaces: Value = null;
	f.vars = () => [new_message, size, delta, spaces];
	new_message = live(message);
	size = rt.length(live(message));
	delta = subtract(live(length), live(size));
	if (isEqual(live(size), live(length))) {
		return live(new_message);
	}
	if (rt.gt(live(size), live(length))) {
		return rt.call(f, P("/proc/copytext"), null, [live(new_message), 1, add(live(length), 1)]);
	}
	if (isEqual(live(delta), 1)) {
		return add(live(new_message), " ");
	}
	if (truthy(rt.modulus(live(delta), 2))) {
		new_message = add(" ", live(new_message));
		delta = rt.inc(live(delta), -1);
	}
	return add(add((spaces = rt.call(f, P("/proc/add_lspace"), null, ["", subtract(divide(live(delta), 2), 1)])), live(new_message)), live(spaces));
});

// /proc/dd_limittext  (code/__HELPERS/text.dm:292)
rt.def("/proc/dd_limittext", function dd_limittext(f: Frame, message: Value, length: Value) {
	let size: Value = null;
	f.vars = () => [size];
	if (rt.le((size = rt.length(live(message))), live(length))) {
		return live(message);
	}
	return rt.call(f, P("/proc/copytext"), null, [live(message), 1, add(live(length), 1)]);
});

// /proc/stringmerge  (code/__HELPERS/text.dm:302)
rt.def("/proc/stringmerge", function stringmerge(f: Frame, text: Value, compare: Value, replace: Value) {
	let newtext: Value = null, i: Value = null, a: Value = null, b: Value = null;
	f.vars = () => [replace, newtext, i, a, b];
	if (live(replace) === null) {
		replace = "*";
	}
	newtext = live(text);
	if (!isEqual(rt.call(f, P("/proc/lentext"), null, [live(text)]), rt.call(f, P("/proc/lentext"), null, [live(compare)]))) {
		return 0;
	}
	i = null;
	i = 1;
	while (rt.lt(live(i), rt.call(f, P("/proc/lentext"), null, [live(text)]))) {
		a = rt.call(f, P("/proc/copytext"), null, [live(text), live(i), add(live(i), 1)]);
		b = rt.call(f, P("/proc/copytext"), null, [live(compare), live(i), add(live(i), 1)]);
		if (!isEqual(live(a), live(b))) {
			if (isEqual(live(a), live(replace))) {
				newtext = add(add(rt.call(f, P("/proc/copytext"), null, [live(newtext), 1, live(i)]), live(b)), rt.call(f, P("/proc/copytext"), null, [live(newtext), add(live(i), 1)]));
			} else {
				if (isEqual(live(b), live(replace))) {
					newtext = add(add(rt.call(f, P("/proc/copytext"), null, [live(newtext), 1, live(i)]), live(a)), rt.call(f, P("/proc/copytext"), null, [live(newtext), add(live(i), 1)]));
				} else {
					return 0;
				}
			}
		}
		i = rt.inc(live(i), 1);
	}
	return live(newtext);
});

// /proc/stringpercent  (code/__HELPERS/text.dm:322)
rt.def("/proc/stringpercent", function stringpercent(f: Frame, text: Value, character: Value) {
	let count: Value = null, i: Value = null, a: Value = null;
	f.vars = () => [character, count, i, a];
	if (live(character) === null) {
		character = "*";
	}
	if ((!truthy(live(text)) || !truthy(live(character)))) {
		return 0;
	}
	count = 0;
	i = null;
	i = 1;
	while (rt.le(live(i), rt.call(f, P("/proc/lentext"), null, [live(text)]))) {
		if (isEqual((a = rt.call(f, P("/proc/copytext"), null, [live(text), live(i), add(live(i), 1)])), live(character))) {
			count = rt.inc(live(count), 1);
		}
		i = rt.inc(live(i), 1);
	}
	return live(count);
});

// /proc/reverse_text  (code/__HELPERS/text.dm:332)
rt.def("/proc/reverse_text", function reverse_text(f: Frame, text: Value) {
	let new_text: Value = null, i: Value = null;
	f.vars = () => [text, new_text, i];
	if (live(text) === null) {
		text = "";
	}
	new_text = "";
	i = null;
	i = rt.length(live(text));
	while (rt.gt(live(i), 0)) {
		new_text = rt.modify(live(new_text), rt.call(f, P("/proc/copytext"), null, [live(text), live(i), add(live(i), 1)]), add);
		i = rt.inc(live(i), -1);
	}
	return live(new_text);
});

// /datum/controller/global_vars/proc/InitGlobalzero_character_only  (code/__HELPERS/text.dm:337)
rt.def("/datum/controller/global_vars/proc/InitGlobalzero_character_only", function InitGlobalzero_character_only(f: Frame) {
	rt.setGl("zero_character_only", rt.list("0"));
	rt.modSrcVar(f, "gvars_datum_init_order", "zero_character_only", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalhex_characters  (code/__HELPERS/text.dm:338)
rt.def("/datum/controller/global_vars/proc/InitGlobalhex_characters", function InitGlobalhex_characters(f: Frame) {
	rt.setGl("hex_characters", rt.list("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"));
	rt.modSrcVar(f, "gvars_datum_init_order", "hex_characters", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalalphabet  (code/__HELPERS/text.dm:339)
rt.def("/datum/controller/global_vars/proc/InitGlobalalphabet", function InitGlobalalphabet(f: Frame) {
	rt.setGl("alphabet", rt.list("a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"));
	rt.modSrcVar(f, "gvars_datum_init_order", "alphabet", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalbinary  (code/__HELPERS/text.dm:340)
rt.def("/datum/controller/global_vars/proc/InitGlobalbinary", function InitGlobalbinary(f: Frame) {
	rt.setGl("binary", rt.list("0", "1"));
	rt.modSrcVar(f, "gvars_datum_init_order", "binary", add);
	return f.dot;
});

// /proc/random_string  (code/__HELPERS/text.dm:342)
rt.def("/proc/random_string", function random_string(f: Frame, length: Value, characters: Value) {
	let i: Value = null;
	f.vars = () => [i];
	f.dot = "";
	i = null;
	i = 1;
	while (rt.le(live(i), live(length))) {
		f.dot = rt.modify(live(f.dot), rt.op(f, "PickUnweighted", [1], [live(characters)]), add);
		i = rt.inc(live(i), 1);
	}
	return f.dot;
});

// /proc/repeat_string  (code/__HELPERS/text.dm:347)
rt.def("/proc/repeat_string", function repeat_string(f: Frame, times: Value, string: Value) {
	let i: Value = null;
	f.vars = () => [string, i];
	if (live(string) === null) {
		string = "";
	}
	f.dot = "";
	i = null;
	i = 1;
	while (rt.le(live(i), live(times))) {
		f.dot = rt.modify(live(f.dot), live(string), add);
		i = rt.inc(live(i), 1);
	}
	return f.dot;
});

// /proc/random_short_color  (code/__HELPERS/text.dm:352)
rt.def("/proc/random_short_color", function random_short_color(f: Frame) {
	return rt.call(f, P("/proc/random_string"), null, [3, rt.gl("hex_characters")]);
});

// /proc/random_color  (code/__HELPERS/text.dm:355)
rt.def("/proc/random_color", function random_color(f: Frame) {
	return rt.call(f, P("/proc/random_string"), null, [6, rt.gl("hex_characters")]);
});

// /proc/add_zero2  (code/__HELPERS/text.dm:359)
rt.def("/proc/add_zero2", function add_zero2(f: Frame, t: Value, u: Value) {
	let temp1: Value = null;
	f.vars = () => [t, temp1];
	temp1 = null;
	while (rt.lt(rt.length(live(t)), live(u))) {
		t = fmt("0＀", [live(t)]);
	}
	temp1 = live(t);
	if (rt.gt(rt.length(live(t)), live(u))) {
		temp1 = rt.call(f, P("/proc/copytext"), null, [live(t), 2, add(live(u), 1)]);
	}
	return live(temp1);
});

// /proc/merge_text  (code/__HELPERS/text.dm:373)
rt.def("/proc/merge_text", function merge_text(f: Frame, into: Value, from: Value, null_char: Value) {
	let null_ascii: Value = null, previous: Value = null, start: Value = null, end: Value = null, i: Value = null, ascii: Value = null;
	let $0: any;
	f.vars = () => [into, from, null_char, null_ascii, previous, start, end, i, ascii, $0];
	if (live(null_char) === null) {
		null_char = "_";
	}
	f.dot = "";
	if (!truthy(rt.call(f, P("/proc/istext"), null, [live(into)]))) {
		into = "";
	}
	if (!truthy(rt.call(f, P("/proc/istext"), null, [live(from)]))) {
		from = "";
	}
	if (truthy(rt.call(f, P("/proc/istext"), null, [live(null_char)]))) {
		$0 = rt.call(f, P("/proc/text2ascii"), null, [live(null_char), 1]);
	} else {
		$0 = live(null_char);
	}
	null_ascii = $0;
	previous = 0;
	start = 1;
	end = add(rt.length(live(into)), 1);
	i = null;
	i = 1;
	while (rt.lt(live(i), live(end))) {
		if (isEqual((ascii = rt.call(f, P("/proc/text2ascii"), null, [live(from), live(i)])), live(null_ascii))) {
			if (!isEqual(live(previous), 1)) {
				f.dot = rt.modify(live(f.dot), rt.call(f, P("/proc/copytext"), null, [live(from), live(start), live(i)]), add);
				start = live(i);
				previous = 1;
			}
		} else {
			if (!isEqual(live(previous), 0)) {
				f.dot = rt.modify(live(f.dot), rt.call(f, P("/proc/copytext"), null, [live(into), live(start), live(i)]), add);
				start = live(i);
				previous = 0;
			}
		}
		i = rt.inc(live(i), 1);
	}
	if (isEqual(live(previous), 0)) {
		f.dot = rt.modify(live(f.dot), rt.call(f, P("/proc/copytext"), null, [live(from), live(start), live(end)]), add);
	} else {
		f.dot = rt.modify(live(f.dot), rt.call(f, P("/proc/copytext"), null, [live(into), live(start), live(end)]), add);
	}
	return f.dot;
});

// /proc/findchar  (code/__HELPERS/text.dm:407)
rt.def("/proc/findchar", function findchar(f: Frame, haystack: Value, needles: Value, start: Value, end: Value) {
	let temp: Value = null, len: Value = null, i: Value = null;
	f.vars = () => [start, end, temp, len, i];
	if (live(start) === null) {
		start = 1;
	}
	if (live(end) === null) {
		end = 0;
	}
	temp = null;
	len = rt.length(live(needles));
	i = null;
	i = 1;
	while (rt.le(live(i), live(len))) {
		if (truthy((temp = rt.call(f, P("/proc/findtextEx"), null, [live(haystack), rt.call(f, P("/proc/ascii2text"), null, [rt.call(f, P("/proc/text2ascii"), null, [live(needles), live(i)])]), live(start), live(end)])))) {
			end = live(temp);
		}
		i = rt.inc(live(i), 1);
	}
	return live(end);
});

// /proc/parsepencode  (code/__HELPERS/text.dm:416)
rt.def("/proc/parsepencode", function parsepencode(f: Frame, t: Value, user: Value, signfont: Value) {
	f.vars = () => [t, user, signfont];
	if (live(user) === null) {
		user = null;
	}
	if (live(signfont) === null) {
		signfont = "Times New Roman";
	}
	if (rt.lt(rt.length(live(t)), 1)) {
		return live(f.dot);
	}
	t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [live(t), "[center]", "<center>"])), "[/center]", "</center>"])), "[br]", "<BR>"])), "[b]", "<B>"])), "[/b]", "</B>"])), "[i]", "<I>"])), "[/i]", "</I>"])), "[u]", "<U>"])), "[/u]", "</U>"])), "[large]", "<font size=\"4\">"])), "[/large]", "</font>"]);
	if (truthy(live(user))) {
		t = rt.call(f, P("/proc/replacetext"), null, [live(t), "[sign]", fmt("<font face=\"＀\"><i>＀</i></font>", [live(signfont), rt.fv(f, "real_name", live(user))])]);
	} else {
		t = rt.call(f, P("/proc/replacetext"), null, [live(t), "[sign]", ""]);
	}
	return (t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [live(t), "[field]", "<span class=\"paper_field\"></span>"])), "[*]", "<li>"])), "[hr]", "<HR>"])), "[small]", "<font size = \"1\">"])), "[/small]", "</font>"])), "[list]", "<ul>"])), "[/list]", "</ul>"]));
});

// /proc/rot13  (code/__HELPERS/text.dm:448)
rt.def("/proc/rot13", function rot13(f: Frame, text: Value) {
	let textlist: Value = null, result: Value = null, c: Value = null, ca: Value = null;
	let $e: any;
	f.vars = () => [text, textlist, result, c, ca, $e];
	if (live(text) === null) {
		text = "";
	}
	textlist = subtract(rt.call(f, P("/proc/splittext"), null, [live(text), rt.call(f, P("/proc/regex"), null, ["(.)"])]), rt.call(f, P("/proc/splittext"), null, [live(text), ""]));
	result = rt.list();
	c = null;
	rt.forList(f, 0, live(textlist));
	while (($e = rt.next(f, 0)) !== undefined) {
		c = $e;
		if ((rt.ge((ca = rt.call(f, P("/proc/text2ascii"), null, [live(c)])), rt.call(f, P("/proc/text2ascii"), null, ["a"])) && rt.le(live(ca), rt.call(f, P("/proc/text2ascii"), null, ["m"])))) {
			ca = rt.modify(live(ca), 13, add);
		} else {
			if ((rt.ge(live(ca), rt.call(f, P("/proc/text2ascii"), null, ["n"])) && rt.le(live(ca), rt.call(f, P("/proc/text2ascii"), null, ["z"])))) {
				(ca = rt.modify(live(ca), 13, subtract));
			} else {
				if ((rt.ge(live(ca), rt.call(f, P("/proc/text2ascii"), null, ["A"])) && rt.le(live(ca), rt.call(f, P("/proc/text2ascii"), null, ["M"])))) {
					ca = rt.modify(live(ca), 13, add);
				} else {
					if ((rt.ge(live(ca), rt.call(f, P("/proc/text2ascii"), null, ["N"])) && rt.le(live(ca), rt.call(f, P("/proc/text2ascii"), null, ["Z"])))) {
						(ca = rt.modify(live(ca), 13, subtract));
					}
				}
			}
		}
		result = rt.modify(live(result), rt.call(f, P("/proc/ascii2text"), null, [live(ca)]), add);
	}
	rt.endFor(f, 0);
	return rt.call(f, P("/proc/jointext"), null, [live(result), ""]);
});

// /proc/apply_text_macros  (code/__HELPERS/text.dm:560)
rt.def("/proc/apply_text_macros", function apply_text_macros(f: Frame, string: Value) {
	let next_backslash: Value = null, leng: Value = null, next_space: Value = null, base: Value = null, macro: Value = null, rest: Value = null;
	let $0: any;
	f.vars = () => [next_backslash, leng, next_space, base, macro, rest, $0];
	if (!truthy((next_backslash = rt.call(f, P("/proc/findtext"), null, [live(string), "\\"])))) {
		return live(string);
	}
	leng = rt.length(live(string));
	if (!truthy((next_space = rt.call(f, P("/proc/findtext"), null, [live(string), " ", add(live(next_backslash), 1)])))) {
		next_space = subtract(live(leng), live(next_backslash));
	}
	if (!truthy(live(next_space))) {
		return live(string);
	}
	if (isEqual(live(next_backslash), 1)) {
		$0 = "";
	} else {
		$0 = rt.call(f, P("/proc/copytext"), null, [live(string), 1, live(next_backslash)]);
	}
	base = $0;
	macro = rt.call(f, P("/proc/lowertext"), null, [rt.call(f, P("/proc/copytext"), null, [live(string), add(live(next_backslash), 1), live(next_space)])]);
	if (rt.gt(live(next_backslash), live(leng))) {
		$0 = "";
	} else {
		$0 = rt.call(f, P("/proc/copytext"), null, [live(string), add(live(next_space), 1)]);
	}
	rest = $0;
	$0 = live(macro);
	if ($0 === "the") {
		rest = fmt("％！", [live(rest)]);
	} else if ($0 === "a") {
		rest = fmt("＇！", [live(rest)]);
	} else if ($0 === "an") {
		rest = fmt("＇！", [live(rest)]);
	} else if ($0 === "proper") {
		rest = fmt("ÿ\u0015＀", [live(rest)]);
	} else if ($0 === "improper") {
		rest = fmt("ÿ\u0016＀", [live(rest)]);
	} else if ($0 === "roman") {
		rest = fmt("２ ！", [live(rest)]);
	} else if ($0 === "th") {
		base = fmt("＀４", [live(rest)]);
	} else if ($0 === "s") {
		base = fmt("＀５", [live(rest)]);
	} else if ($0 === "he") {
		base = fmt("＀）", [live(rest)]);
	} else if ($0 === "she") {
		base = fmt("＀）", [live(rest)]);
	} else if ($0 === "his") {
		base = fmt("＀＋", [live(rest)]);
	} else if ($0 === "himself") {
		base = fmt("＀－", [live(rest)]);
	} else if ($0 === "herself") {
		base = fmt("＀－", [live(rest)]);
	} else if ($0 === "hers") {
		base = fmt("＀／", [live(rest)]);
	}
	f.dot = live(base);
	if (!truthy(live(rest))) return f.dot;
	f.dot = rt.modify(live(f.dot), rt.callSelf(f, [live(rest)]), add);
	return f.dot;
});
