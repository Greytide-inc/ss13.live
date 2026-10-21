// From code/game/gamemodes/clock_cult/clock_helpers/ratvarian_language.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/text2ratvar  (code/game/gamemodes/clock_cult/clock_helpers/ratvarian_language.dm:70)
rt.def("/proc/text2ratvar", function text2ratvar(f: Frame, text: Value) {
	let ratvarian: Value = null;
	f.vars = () => [ratvarian];
	return rt.call(f, P("/proc/add_ratvarian_regex"), null, [(ratvarian = rt.call(f, P("/proc/rot13"), null, [(ratvarian = rt.call(f, P("/proc/add_ratvarian_regex"), null, [live(text)]))]))]);
});

// /proc/add_ratvarian_regex  (code/game/gamemodes/clock_cult/clock_helpers/ratvarian_language.dm:75)
rt.def("/proc/add_ratvarian_regex", function add_ratvarian_regex(f: Frame, text: Value) {
	let ratvarian: Value = null;
	f.vars = () => [ratvarian];
	return rt.call(f, P("/proc/replacetext"), null, [(ratvarian = rt.call(f, P("/proc/replacetext"), null, [(ratvarian = rt.call(f, P("/proc/replacetext"), null, [(ratvarian = rt.call(f, P("/proc/replacetext"), null, [(ratvarian = rt.call(f, P("/proc/replacetext"), null, [(ratvarian = rt.call(f, P("/proc/replacetext"), null, [(ratvarian = rt.call(f, P("/proc/replacetext"), null, [(ratvarian = rt.call(f, P("/proc/replacetext"), null, [(ratvarian = rt.call(f, P("/proc/replacetext"), null, [(ratvarian = rt.call(f, P("/proc/replacetext"), null, [live(text), rt.call(f, P("/proc/regex"), null, ["(\\w)\\s([oO][fF])", "g"]), "$1-$2"])), rt.call(f, P("/proc/regex"), null, ["([gG][uU])([aA])", "g"]), "$1-$2"])), rt.call(f, P("/proc/regex"), null, ["([tT][hH]\\w)(\\w)", "g"]), "$1`$2"])), rt.call(f, P("/proc/regex"), null, ["([tT][iI])(\\w)", "g"]), "$1`$2"])), rt.call(f, P("/proc/regex"), null, ["(\\w)([eE][tT])", "g"]), "$1-$2"])), rt.call(f, P("/proc/regex"), null, ["([tT][eE])(\\w)", "g"]), "$1-$2"])), rt.call(f, P("/proc/regex"), null, ["(\\w)\\s([aA][nN][dD])(\\W)", "g"]), "$1-$2$3"])), rt.call(f, P("/proc/regex"), null, ["(\\W)([aA][nN][dD])\\s(\\w)", "g"]), "$1$2-$3"])), rt.call(f, P("/proc/regex"), null, ["(\\s)([tT][oO])\\s(\\w)", "g"]), "$1$2-$3"])), rt.call(f, P("/proc/regex"), null, ["(\\s)([mM][yY])\\s(\\w)", "g"]), "$1$2-$3"]);
});

// /proc/ratvar2text  (code/game/gamemodes/clock_cult/clock_helpers/ratvarian_language.dm:87)
rt.def("/proc/ratvar2text", function ratvar2text(f: Frame, ratvarian: Value) {
	let text: Value = null;
	f.vars = () => [text];
	return rt.call(f, P("/proc/remove_ratvarian_regex"), null, [(text = rt.call(f, P("/proc/replacetext"), null, [rt.call(f, P("/proc/rot13"), null, [(text = rt.call(f, P("/proc/remove_ratvarian_regex"), null, [live(ratvarian)]))]), "`", ""]))]);
});

// /proc/remove_ratvarian_regex  (code/game/gamemodes/clock_cult/clock_helpers/ratvarian_language.dm:92)
rt.def("/proc/remove_ratvarian_regex", function remove_ratvarian_regex(f: Frame, ratvarian: Value) {
	let text: Value = null;
	f.vars = () => [text];
	return rt.call(f, P("/proc/replacetext"), null, [(text = rt.call(f, P("/proc/replacetext"), null, [(text = rt.call(f, P("/proc/replacetext"), null, [(text = rt.call(f, P("/proc/replacetext"), null, [(text = rt.call(f, P("/proc/replacetext"), null, [(text = rt.call(f, P("/proc/replacetext"), null, [(text = rt.call(f, P("/proc/replacetext"), null, [live(ratvarian), rt.call(f, P("/proc/regex"), null, ["([gG][uU])-([aA])", "g"]), "$1$2"])), rt.call(f, P("/proc/regex"), null, ["(\\w)-([aA][nN][dD])", "g"]), "$1 $2"])), rt.call(f, P("/proc/regex"), null, ["([aA][nN][dD])-(\\w)", "g"]), "$1 $2"])), rt.call(f, P("/proc/regex"), null, ["([tTmM][oOyY])-", "g"]), "$1 "])), rt.call(f, P("/proc/regex"), null, ["([tT][eE])-", "g"]), "$1"])), rt.call(f, P("/proc/regex"), null, ["-([eE][tT])", "g"]), "$1"])), rt.call(f, P("/proc/regex"), null, ["-([oO][fF])", "g"]), " $1"]);
});

// /proc/clockwork_say  (code/game/gamemodes/clock_cult/clock_helpers/ratvarian_language.dm:102)  may sleep
rt.def("/proc/clockwork_say", function* clockwork_say(f: Frame, AM: Value, message: Value, whisper: Value) {
	let spans: Value = null, L: Value = null;
	f.vars = () => [AM, message, whisper, spans, L];
	if (live(whisper) === null) {
		whisper = 0;
	}
	spans = rt.list("robot");
	if (truthy((rt.istype(live(AM), T("/mob/living")) ? 1 : 0))) {
		L = live(AM);
		if (!truthy(live(whisper))) {
			yield* g.callName(f, live(L), "say", [null, live(message), null, "clock", null, live(spans), "language", T("/datum/language/common")], rt.Args.Named);
		} else {
			yield* g.callName(f, live(L), "whisper", [null, live(message), null, "clock", null, live(spans), "language", T("/datum/language/common")], rt.Args.Named);
		}
	} else {
		yield* g.callName(f, live(AM), "say", [null, live(message), "language", T("/datum/language/common")], rt.Args.Named);
	}
	return f.dot;
}, true);
