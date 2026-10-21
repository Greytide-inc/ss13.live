// From code/modules/language/language.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(2775, "/datum/language", "/datum", {
	name: "an unknown language",
	desc: "A language.",
	speech_verb: "says",
	ask_verb: "asks",
	exclaim_verb: "exclaims",
	whisper_verb: "whispers",
	signlang_verb: null,
	key: null,
	flags: null,
	syllables: null,
	sentence_chance: 5,
	space_chance: 55,
	spans: null,
	scramble_cache: null,
	default_priority: 0,
	icon: rt.rsc("icons/misc/language.dmi"),
	icon_state: "popcorn",
});

// /datum/language/proc/<init>  (code/modules/language/language.dm:21)
rt.def("/datum/language/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "signlang_verb", rt.list("signs", "gestures"));
	$0 = $0;
	rt.setSv(f, "spans", rt.list());
	$0 = $0;
	rt.setSv(f, "scramble_cache", rt.list());
	return f.dot;
});

// /datum/language/proc/display_icon  (code/modules/language/language.dm:30)  may sleep
rt.def("/datum/language/proc/display_icon", function* display_icon(f: Frame, hearer: Value) {
	let understands: Value = null;
	f.vars = () => [hearer, understands];
	understands = (yield* g.callName(f, live(hearer), "has_language", [rt.fv(f, "type", live(f.src))]));
	if ((truthy(rt.bitAnd(rt.sv(f, "flags"), 4)) && truthy(live(understands)))) {
		return 0;
	}
	if ((truthy(rt.bitAnd(rt.sv(f, "flags"), 8)) && !truthy(live(understands)))) {
		return 0;
	}
	return 1;
}, true);

// /datum/language/proc/get_icon  (code/modules/language/language.dm:38)
rt.def("/datum/language/proc/get_icon", function get_icon(f: Frame) {
	return fmt("＀", [rt.call(f, P("/proc/bicon"), null, [rt.call(f, P("/proc/icon"), null, [rt.sv(f, "icon"), rt.sv(f, "icon_state")])])]);
});

// /datum/language/proc/get_random_name  (code/modules/language/language.dm:41)
rt.def("/datum/language/proc/get_random_name", function get_random_name(f: Frame, gender: Value, name_count: Value, syllable_count: Value, syllable_divisor: Value) {
	let full_name: Value = null, new_name: Value = null, i: Value = null, Y: Value = null, x: Value = null;
	let $e: any;
	f.vars = () => [name_count, syllable_count, syllable_divisor, full_name, new_name, i, Y, x, $e];
	if (live(name_count) === null) {
		name_count = 2;
	}
	if (live(syllable_count) === null) {
		syllable_count = 4;
	}
	if (live(syllable_divisor) === null) {
		syllable_divisor = 2;
	}
	if ((!truthy(rt.sv(f, "syllables")) || !truthy(rt.len(f, rt.sv(f, "syllables"))))) {
		if (isEqual(live(gender), "female")) {
			return add(add(rt.call(f, P("/proc/capitalize"), null, [rt.op(f, "PickUnweighted", [1], [rt.gl("first_names_female")])]), " "), rt.call(f, P("/proc/capitalize"), null, [rt.op(f, "PickUnweighted", [1], [rt.gl("last_names")])]));
		}
		return add(add(rt.call(f, P("/proc/capitalize"), null, [rt.op(f, "PickUnweighted", [1], [rt.gl("first_names_male")])]), " "), rt.call(f, P("/proc/capitalize"), null, [rt.op(f, "PickUnweighted", [1], [rt.gl("last_names")])]));
	}
	full_name = "";
	new_name = "";
	i = null;
	rt.forRange(f, 0, 0, live(name_count), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		new_name = "";
		Y = rt.call(f, P("/proc/rand"), null, [rt.call(f, P("/proc/Floor"), null, [divide(live(syllable_count), live(syllable_divisor))]), live(syllable_count)]);
		x = null;
		rt.forRange(f, 1, live(Y), 0, 1);
		while (($e = rt.next(f, 1)) !== undefined) {
			x = $e;
			new_name = rt.modify(live(new_name), rt.op(f, "PickUnweighted", [1], [rt.sv(f, "syllables")]), add);
		}
		rt.endFor(f, 1);
		full_name = rt.modify(live(full_name), fmt(" ＀", [rt.call(f, P("/proc/capitalize"), null, [rt.call(f, P("/proc/lowertext"), null, [live(new_name)])])]), add);
	}
	rt.endFor(f, 0);
	return fmt("＀", [rt.call(f, P("/proc/trim"), null, [live(full_name)])]);
});

// /datum/language/proc/check_cache  (code/modules/language/language.dm:60)
rt.def("/datum/language/proc/check_cache", function check_cache(f: Frame, input: Value) {
	let lookup: Value = null;
	f.vars = () => [lookup];
	if (truthy((lookup = rt.index(rt.sv(f, "scramble_cache"), live(input))))) {
		(rt.modSrcVar(f, "scramble_cache", live(input), subtract));
		rt.setAt(rt.sv(f, "scramble_cache"), live(input), live(lookup));
	}
	f.dot = live(lookup);
	return f.dot;
});

// /datum/language/proc/add_to_cache  (code/modules/language/language.dm:69)
rt.def("/datum/language/proc/add_to_cache", function add_to_cache(f: Frame, input: Value, scrambled_text: Value) {
	rt.setAt(rt.sv(f, "scramble_cache"), live(input), live(scrambled_text));
	if (!rt.gt(rt.len(f, rt.sv(f, "scramble_cache")), 50)) return f.dot;
	rt.callName(f, rt.sv(f, "scramble_cache"), "Cut", [1, subtract(subtract(rt.len(f, rt.sv(f, "scramble_cache")), 50), 1)]);
	return f.dot;
});

// /datum/language/proc/scramble  (code/modules/language/language.dm:74)
rt.def("/datum/language/proc/scramble", function scramble(f: Frame, input: Value) {
	let lookup: Value = null, input_size: Value = null, scrambled_text: Value = null, capitalize: Value = null, next: Value = null, chance: Value = null, ending: Value = null, input_ending: Value = null;
	f.vars = () => [lookup, input_size, scrambled_text, capitalize, next, chance, ending, input_ending];
	if ((!truthy(rt.sv(f, "syllables")) || !truthy(rt.len(f, rt.sv(f, "syllables"))))) {
		return rt.call(f, P("/proc/stars"), null, [live(input)]);
	}
	if (truthy((lookup = rt.callSrc(f, "check_cache", [live(input)])))) {
		return live(lookup);
	}
	input_size = rt.length(live(input));
	scrambled_text = "";
	capitalize = 1;
	while (rt.lt(rt.length(live(scrambled_text)), live(input_size))) {
		next = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "syllables")]);
		if (truthy(live(capitalize))) {
			next = rt.call(f, P("/proc/capitalize"), null, [live(next)]);
			capitalize = 0;
		}
		scrambled_text = rt.modify(live(scrambled_text), live(next), add);
		if (rt.le((chance = rt.call(f, P("/proc/rand"), null, [100])), rt.sv(f, "sentence_chance"))) {
			scrambled_text = rt.modify(live(scrambled_text), ". ", add);
			capitalize = 1;
		} else {
			if ((rt.gt(live(chance), rt.sv(f, "sentence_chance")) && rt.le(live(chance), rt.sv(f, "space_chance")))) {
				scrambled_text = rt.modify(live(scrambled_text), " ", add);
			}
		}
	}
	scrambled_text = rt.call(f, P("/proc/trim"), null, [live(scrambled_text)]);
	if (isEqual((ending = rt.call(f, P("/proc/copytext"), null, [live(scrambled_text), rt.length(live(scrambled_text))])), ".")) {
		scrambled_text = rt.call(f, P("/proc/copytext"), null, [live(scrambled_text), 1, subtract(rt.length(live(scrambled_text)), 1)]);
	}
	if (truthy((rt.isIn(f, (input_ending = rt.call(f, P("/proc/copytext"), null, [live(input), live(input_size)])), rt.list("!", "?", ".")) ? 1 : 0))) {
		scrambled_text = rt.modify(live(scrambled_text), live(input_ending), add);
	}
	rt.callSrc(f, "add_to_cache", [live(input), live(scrambled_text)]);
	return live(scrambled_text);
});

// /datum/language/proc/get_spoken_verb  (code/modules/language/language.dm:112)
rt.def("/datum/language/proc/get_spoken_verb", function get_spoken_verb(f: Frame, msg_end: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(msg_end);
	if ($0 === "!") {
		return rt.sv(f, "exclaim_verb");
	} else if ($0 === "?") {
		return rt.sv(f, "ask_verb");
	}
	return rt.sv(f, "speech_verb");
});
