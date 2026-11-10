// Based on /tg/station's code/modules/language/language.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { P } = rt;


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

// language.dm:21
rt.def("/datum/language/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.signlang_verb = list("signs", "gestures");

	this.spans = list();

	this.scramble_cache = list();
	return f.dot;
});

// language.dm:30
rt.def("/datum/language/proc/display_icon", function* display_icon(f: Frame, hearer: Value) {
	let understands: Value = (yield* hearer.has_language(this.type));
	if (rt.bitAnd(this.flags, LANGUAGE_HIDE_ICON_IF_UNDERSTOOD) && understands) {
		return 0;
	}
	if (rt.bitAnd(this.flags, LANGUAGE_HIDE_ICON_IF_NOT_UNDERSTOOD) && !understands) {
		return 0;
	}
	return 1;
}, true);

// language.dm:38
rt.def("/datum/language/proc/get_icon", function get_icon(f: Frame) {
	return `${bicon(icon(this.icon, this.icon_state))}`;
});

// language.dm:60
rt.def("/datum/language/proc/check_cache", function check_cache(f: Frame, input: Value) {
	let lookup: Value = null;
	if (lookup = rt.index(this.scramble_cache, input)) {
		this.scramble_cache -= input;
		rt.setAt(this.scramble_cache, input, lookup);
	}
	f.dot = lookup;
	return f.dot;
});

// language.dm:69
rt.def("/datum/language/proc/add_to_cache", function add_to_cache(f: Frame, input: Value, scrambled_text: Value) {
	rt.setAt(this.scramble_cache, input, scrambled_text);
	if (!(rt.len(f, this.scramble_cache) > SCRAMBLE_CACHE_LEN)) return f.dot;
	this.scramble_cache.Cut(1, rt.len(f, this.scramble_cache) - SCRAMBLE_CACHE_LEN - 1);
	return f.dot;
});

// language.dm:74
rt.def("/datum/language/proc/scramble", function scramble(f: Frame, input: Value) {
	let lookup: Value = null, next: Value = null, chance: Value = null, ending: Value = null, input_ending: Value = null;
	if (!this.syllables || !rt.len(f, this.syllables)) {
		return stars(input);
	}
	if (lookup = this.check_cache(input)) {
		return lookup;
	}
	let input_size: Value = rt.length(input);
	let scrambled_text: Value = "";
	let capitalize: Value = 1;
	while (rt.length(scrambled_text) < input_size) {
		next = pick(this.syllables);
		if (capitalize) {
			next = rt.call(f, P("/proc/capitalize"), null, [next]);
			capitalize = 0;
		}
		scrambled_text += next;
		if ((chance = rand(100)) <= this.sentence_chance) {
			scrambled_text += ". ";
			capitalize = 1;
		} else if (chance > this.sentence_chance && chance <= this.space_chance) {
			scrambled_text += " ";
		}
	}
	scrambled_text = trim(scrambled_text);
	if ((ending = copytext(scrambled_text, rt.length(scrambled_text))) == ".") {
		scrambled_text = copytext(scrambled_text, 1, rt.length(scrambled_text) - 1);
	}
	if (rt.isIn(f, (input_ending = copytext(input, input_size)), list("!", "?", "."))) {
		scrambled_text += input_ending;
	}
	this.add_to_cache(input, scrambled_text);
	return scrambled_text;
});
