// From code/game/say.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalfreqtospan  (code/game/say.dm:6)
rt.def("/datum/controller/global_vars/proc/InitGlobalfreqtospan", function InitGlobalfreqtospan(f: Frame) {
	rt.setGl("freqtospan", rt.alist(f, ["1351", "sciradio", "1355", "medradio", "1357", "engradio", "1347", "suppradio", "1349", "servradio", "1359", "secradio", "1353", "comradio", "1447", "aiprivradio", "1213", "syndradio", "1337", "centcomradio", "1215", "redteamradio", "1217", "blueteamradio"]));
	rt.modSrcVar(f, "gvars_datum_init_order", "freqtospan", add);
	return f.dot;
});

// /atom/movable/proc/say  (code/game/say.dm:22)  may sleep
rt.def("/atom/movable/proc/say", function* say(f: Frame, message: Value, language: Value) {
	let spans: Value = null;
	f.vars = () => [message, language, spans];
	if (live(language) === null) {
		language = null;
	}
	if (!truthy((yield* g.srcCall(f, "can_speak")))) {
		return live(f.dot);
	}
	if ((isEqual(live(message), "") || !truthy(live(message)))) {
		return live(f.dot);
	}
	spans = (yield* g.srcCall(f, "get_spans"));
	if (!truthy(live(language))) {
		language = (yield* g.srcCall(f, "get_default_language"));
	}
	yield* g.callSrc(f, "send_speech", [null, live(message), null, 7, null, live(f.src), null, null, null, live(spans), "message_language", live(language)], rt.Args.Named);
	return f.dot;
}, true);

// /atom/movable/proc/send_speech  (code/game/say.dm:38)  may sleep
rt.def("/atom/movable/proc/send_speech", function* send_speech(f: Frame, message: Value, range: Value, source: Value, bubble_type: Value, spans: Value, message_language: Value, message_mode: Value) {
	let rendered: Value = null, _AM: Value = null, AM: Value = null;
	let $e: any;
	f.vars = () => [message, range, source, bubble_type, spans, message_language, message_mode, rendered, _AM, AM, $e];
	if (live(range) === null) {
		range = 7;
	}
	if (live(source) === null) {
		source = live(f.src);
	}
	if (live(message_language) === null) {
		message_language = null;
	}
	rendered = (yield* g.srcCall(f, "compose_message", live(f.src), live(message_language), live(message), null, live(spans), live(message_mode)));
	_AM = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/get_hearers_in_view"), null, [live(range), live(source)])));
	while (($e = rt.next(f, 0)) !== undefined) {
		_AM = $e;
		yield* g.callName(f, (AM = live(_AM)), "Hear", [live(rendered), live(f.src), live(message_language), live(message), null, live(spans), live(message_mode)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /atom/movable/proc/get_spans  (code/game/say.dm:45)
rt.def("/atom/movable/proc/get_spans", function get_spans(f: Frame) {
	return rt.list();
});

// /atom/movable/proc/compose_message  (code/game/say.dm:50)  may sleep
rt.def("/atom/movable/proc/compose_message", function* compose_message(f: Frame, speaker: Value, message_language: Value, raw_message: Value, radio_freq: Value, spans: Value, message_mode: Value) {
	let spanpart1: Value = null, spanpart2: Value = null, freqpart: Value = null, namepart: Value = null, endspanpart: Value = null, messagepart: Value = null, languageicon: Value = null, D: Value = null;
	let $0: any;
	f.vars = () => [speaker, message_language, raw_message, radio_freq, spans, message_mode, spanpart1, spanpart2, freqpart, namepart, endspanpart, messagepart, languageicon, D, $0];
	if (truthy(live(radio_freq))) {
		$0 = (yield* g.call(f, P("/proc/get_radio_span"), null, [live(radio_freq)]));
	} else {
		$0 = "game say";
	}
	spanpart1 = fmt("<span class='＀'>", [$0]);
	spanpart2 = "<span class='name'>";
	if (truthy(live(radio_freq))) {
		$0 = fmt("[＀] ", [(yield* g.call(f, P("/proc/get_radio_name"), null, [live(radio_freq)]))]);
	} else {
		$0 = "";
	}
	freqpart = $0;
	namepart = fmt("＀＀", [(yield* g.callName(f, live(speaker), "GetVoice", [])), (yield* g.callName(f, live(speaker), "get_alt_name", []))]);
	endspanpart = "</span>";
	messagepart = fmt(" <span class='message'>＀</span></span>", [(yield* g.srcCall(f, "lang_treat", live(speaker), live(message_language), live(raw_message), live(spans), live(message_mode)))]);
	languageicon = "";
	if ((truthy((rt.istype((D = rt.index(rt.gl("language_datum_instances"), live(message_language))), T("/datum/language")) ? 1 : 0)) && truthy((yield* g.callName(f, live(D), "display_icon", [live(f.src)]))))) {
		languageicon = fmt("＀ ", [(yield* g.callName(f, live(D), "get_icon", []))]);
	}
	return fmt("＀＀＀＀＀＀＀＀＀", [live(spanpart1), live(spanpart2), live(freqpart), live(languageicon), (yield* g.srcCall(f, "compose_track_href", live(speaker), live(namepart))), live(namepart), (yield* g.srcCall(f, "compose_job", live(speaker), live(message_language), live(raw_message), live(radio_freq))), live(endspanpart), live(messagepart)]);
}, true);

// /atom/movable/proc/compose_track_href  (code/game/say.dm:71)
rt.def("/atom/movable/proc/compose_track_href", function compose_track_href(f: Frame, speaker: Value, message_langs: Value, raw_message: Value, radio_freq: Value) {
	return "";
});

// /atom/movable/proc/compose_job  (code/game/say.dm:74)
rt.def("/atom/movable/proc/compose_job", function compose_job(f: Frame, speaker: Value, message_langs: Value, raw_message: Value, radio_freq: Value) {
	return "";
});

// /atom/movable/proc/say_mod  (code/game/say.dm:77)
rt.def("/atom/movable/proc/say_mod", function say_mod(f: Frame, input: Value, message_mode: Value) {
	let ending: Value = null;
	f.vars = () => [ending];
	ending = rt.call(f, P("/proc/copytext"), null, [live(input), rt.length(live(input))]);
	if (isEqual(rt.call(f, P("/proc/copytext"), null, [live(input), subtract(rt.length(live(input)), 1)]), "!!")) {
		return rt.sv(f, "verb_yell");
	} else {
		if (isEqual(live(ending), "?")) {
			return rt.sv(f, "verb_ask");
		} else {
			if (isEqual(live(ending), "!")) {
				return rt.sv(f, "verb_exclaim");
			} else {
				return rt.sv(f, "verb_say");
			}
		}
	}
	return f.dot;
});

// /atom/movable/proc/say_quote  (code/game/say.dm:88)
rt.def("/atom/movable/proc/say_quote", function say_quote(f: Frame, input: Value, spans: Value, message_mode: Value) {
	let spanned: Value = null;
	f.vars = () => [input, spans, spanned];
	if (live(spans) === null) {
		spans = rt.list();
	}
	if (!truthy(live(input))) {
		input = "...";
	}
	if (isEqual(rt.call(f, P("/proc/copytext"), null, [live(input), subtract(rt.length(live(input)), 1)]), "!!")) {
		(spans = rt.modify(live(spans), "yell", rt.bitOr));
	}
	spanned = rt.call(f, P("/proc/attach_spans"), null, [live(input), live(spans)]);
	return fmt("＀, \"＀\"", [rt.callSrc(f, "say_mod", [live(input), live(message_mode)]), live(spanned)]);
});

// /atom/movable/proc/lang_treat  (code/game/say.dm:98)  may sleep
rt.def("/atom/movable/proc/lang_treat", function* lang_treat(f: Frame, speaker: Value, language: Value, raw_message: Value, spans: Value, message_mode: Value) {
	let AM: Value = null, D: Value = null;
	f.vars = () => [speaker, language, raw_message, spans, message_mode, AM, D];
	if (truthy((yield* g.srcCall(f, "has_language", live(language))))) {
		if (truthy((AM = (yield* g.callName(f, live(speaker), "GetSource", []))))) {
			return (yield* g.callName(f, live(AM), "say_quote", [live(raw_message), live(spans), live(message_mode)]));
		}
		return (yield* g.callName(f, live(speaker), "say_quote", [live(raw_message), live(spans), live(message_mode)]));
	} else {
		if (truthy(live(language))) {
			AM = (yield* g.callName(f, live(speaker), "GetSource", []));
			raw_message = (yield* g.callName(f, (D = rt.index(rt.gl("language_datum_instances"), live(language))), "scramble", [live(raw_message)]));
			if (truthy(live(AM))) {
				return (yield* g.callName(f, live(AM), "say_quote", [live(raw_message), live(spans), live(message_mode)]));
			}
			return (yield* g.callName(f, live(speaker), "say_quote", [live(raw_message), live(spans), live(message_mode)]));
		} else {
			return "makes a strange sound.";
		}
	}
	return f.dot;
}, true);

// /proc/get_radio_span  (code/game/say.dm:116)
rt.def("/proc/get_radio_span", function get_radio_span(f: Frame, freq: Value) {
	let returntext: Value = null;
	f.vars = () => [returntext];
	if (truthy((returntext = rt.index(rt.gl("freqtospan"), fmt("＀", [live(freq)]))))) {
		return live(returntext);
	}
	return "radio";
});

// /proc/get_radio_name  (code/game/say.dm:122)
rt.def("/proc/get_radio_name", function get_radio_name(f: Frame, freq: Value) {
	let returntext: Value = null;
	f.vars = () => [returntext];
	if (truthy((returntext = rt.index(rt.gl("reverseradiochannels"), fmt("＀", [live(freq)]))))) {
		return live(returntext);
	}
	return fmt("＀.＀", [rt.call(f, P("/proc/copytext"), null, [fmt("＀", [live(freq)]), 1, 4]), rt.call(f, P("/proc/copytext"), null, [fmt("＀", [live(freq)]), 4, 5])]);
});

// /proc/attach_spans  (code/game/say.dm:128)
rt.def("/proc/attach_spans", function attach_spans(f: Frame, input: Value, spans: Value) {
	return fmt("＀＀</span>", [rt.call(f, P("/proc/message_spans_start"), null, [live(spans)]), live(input)]);
});

// /proc/message_spans_start  (code/game/say.dm:131)
rt.def("/proc/message_spans_start", function message_spans_start(f: Frame, spans: Value) {
	let output: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [output, S, $e];
	output = "<span class='";
	S = null;
	rt.forList(f, 0, live(spans));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		output = fmt("＀＀ ", [live(output), live(S)]);
	}
	rt.endFor(f, 0);
	return (output = fmt("＀'>", [live(output)]));
});

// /proc/say_test  (code/game/say.dm:138)
rt.def("/proc/say_test", function say_test(f: Frame, text: Value) {
	let ending: Value = null;
	f.vars = () => [ending];
	if (isEqual((ending = rt.call(f, P("/proc/copytext"), null, [live(text), rt.length(live(text))])), "?")) {
		return "1";
	}
	if (isEqual(live(ending), "!")) {
		return "2";
	}
	return "0";
});

// /atom/movable/proc/GetVoice  (code/game/say.dm:146)
rt.def("/atom/movable/proc/GetVoice", function GetVoice(f: Frame) {
	return fmt("＀", [live(f.src)]);
});
