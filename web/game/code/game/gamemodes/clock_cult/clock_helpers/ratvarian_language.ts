// Based on /tg/station's code/game/gamemodes/clock_cult/clock_helpers/ratvarian_language.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// ratvarian_language.dm:70
rt.def("/proc/text2ratvar", function text2ratvar(f: Frame, text: Value) {
	let ratvarian: Value = null;
	return add_ratvarian_regex((ratvarian = rot13((ratvarian = add_ratvarian_regex(text)))));
});

// ratvarian_language.dm:75
rt.def("/proc/add_ratvarian_regex", function add_ratvarian_regex(f: Frame, text: Value) {
	let ratvarian: Value = null;
	return replacetext((ratvarian = replacetext((ratvarian = replacetext((ratvarian = replacetext((ratvarian = replacetext((ratvarian = replacetext((ratvarian = replacetext((ratvarian = replacetext((ratvarian = replacetext((ratvarian = replacetext(text, regex("(\\w)\\s([oO][fF])", "g"), "$1-$2")), regex("([gG][uU])([aA])", "g"), "$1-$2")), regex("([tT][hH]\\w)(\\w)", "g"), "$1`$2")), regex("([tT][iI])(\\w)", "g"), "$1`$2")), regex("(\\w)([eE][tT])", "g"), "$1-$2")), regex("([tT][eE])(\\w)", "g"), "$1-$2")), regex("(\\w)\\s([aA][nN][dD])(\\W)", "g"), "$1-$2$3")), regex("(\\W)([aA][nN][dD])\\s(\\w)", "g"), "$1$2-$3")), regex("(\\s)([tT][oO])\\s(\\w)", "g"), "$1$2-$3")), regex("(\\s)([mM][yY])\\s(\\w)", "g"), "$1$2-$3");
});

// ratvarian_language.dm:102
rt.def("/proc/clockwork_say", function* clockwork_say(f: Frame, AM: Value, message: Value, whisper: Value) {
	let L: Value = null;
	whisper ??= 0;
	let spans: Value = list("robot");
	if (rt.istype(AM, T("/mob/living"))) {
		L = AM;
		if (!whisper) {
			yield* L.say(message, "clock", spans, { language: T("/datum/language/common") });
		} else {
			yield* L.whisper(message, "clock", spans, { language: T("/datum/language/common") });
		}
	} else {
		yield* AM.say(message, { language: T("/datum/language/common") });
	}
	return f.dot;
}, true);
