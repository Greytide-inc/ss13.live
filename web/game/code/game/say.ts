// Based on /tg/station's code/game/say.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// say.dm:6
rt.def("/datum/controller/global_vars/proc/InitGlobalfreqtospan", function InitGlobalfreqtospan(f: Frame) {
	GLOB.freqtospan = rt.alist(f, ["1351", "sciradio", "1355", "medradio", "1357", "engradio", "1347", "suppradio", "1349", "servradio", "1359", "secradio", "1353", "comradio", "1447", "aiprivradio", "1213", "syndradio", "1337", "centcomradio", "1215", "redteamradio", "1217", "blueteamradio"]);
	this.gvars_datum_init_order += "freqtospan";
	return f.dot;
});

// say.dm:22
rt.def("/atom/movable/proc/say", function* say(f: Frame, message: Value, language: Value) {
	if (!this.can_speak()) {
		return f.dot;
	}
	if (message == "" || !message) {
		return f.dot;
	}
	let spans: Value = this.get_spans();
	if (!language) {
		language = (yield* this.get_default_language());
	}
	yield* this.send_speech(message, 7, this, null, spans, { message_language: language });
	return f.dot;
}, true);

// say.dm:38
rt.def("/atom/movable/proc/send_speech", function* send_speech(f: Frame, message: Value, range: Value, source: Value, bubble_type: Value, spans: Value, message_language: Value, message_mode: Value) {
	let _AM: Value = null, AM: Value = null;
	range ??= 7;
	source ??= this;
	let rendered: Value = (yield* this.compose_message(this, message_language, message, null, spans, message_mode));
	for (_AM of each(get_hearers_in_view(range, source))) {
		yield* (AM = _AM).Hear(rendered, this, message_language, message, null, spans, message_mode);
	}
	return f.dot;
}, true);

// say.dm:45
rt.def("/atom/movable/proc/get_spans", function get_spans(f: Frame) {
	return list();
});

// say.dm:50
rt.def("/atom/movable/proc/compose_message", function* compose_message(f: Frame, speaker: Value, message_language: Value, raw_message: Value, radio_freq: Value, spans: Value, message_mode: Value) {
	let D: Value = null;
	let spanpart1: Value = `<span class='${radio_freq ? get_radio_span(radio_freq) : "game say"}'>`;
	let spanpart2: Value = "<span class='name'>";
	let freqpart: Value = radio_freq ? `[${get_radio_name(radio_freq)}] ` : "";
	let namepart: Value = `${speaker.GetVoice()}${speaker.get_alt_name()}`;
	let endspanpart: Value = "</span>";
	let messagepart: Value = ` <span class='message'>${(yield* this.lang_treat(speaker, message_language, raw_message, spans, message_mode))}</span></span>`;
	let languageicon: Value = "";
	if (rt.istype((D = rt.index(GLOB.language_datum_instances, message_language)), T("/datum/language")) && (yield* D.display_icon(this))) {
		languageicon = `${D.get_icon()} `;
	}
	return `${spanpart1}${spanpart2}${freqpart}${languageicon}${this.compose_track_href(speaker, namepart)}${namepart}${this.compose_job(speaker, message_language, raw_message, radio_freq)}${endspanpart}${messagepart}`;
}, true);

// say.dm:71
rt.def("/atom/movable/proc/compose_track_href", function compose_track_href(f: Frame, speaker: Value, message_langs: Value, raw_message: Value, radio_freq: Value) {
	return "";
});

// say.dm:74
rt.def("/atom/movable/proc/compose_job", function compose_job(f: Frame, speaker: Value, message_langs: Value, raw_message: Value, radio_freq: Value) {
	return "";
});

// say.dm:77
rt.def("/atom/movable/proc/say_mod", function say_mod(f: Frame, input: Value, message_mode: Value) {
	let ending: Value = copytext(input, rt.length(input));
	if (copytext(input, rt.length(input) - 1) == "!!") {
		return this.verb_yell;
	} else if (ending == "?") {
		return this.verb_ask;
	} else if (ending == "!") {
		return this.verb_exclaim;
	} else {
		return this.verb_say;
	}
});

// say.dm:88
rt.def("/atom/movable/proc/say_quote", function say_quote(f: Frame, input: Value, spans: Value, message_mode: Value) {
	spans ??= list();
	if (!input) {
		input = "...";
	}
	if (copytext(input, rt.length(input) - 1) == "!!") {
		(spans = rt.modify(spans, "yell", rt.bitOr));
	}
	let spanned: Value = attach_spans(input, spans);
	return `${this.say_mod(input, message_mode)}, "${spanned}"`;
});

// say.dm:98
rt.def("/atom/movable/proc/lang_treat", function* lang_treat(f: Frame, speaker: Value, language: Value, raw_message: Value, spans: Value, message_mode: Value) {
	let AM: Value = null, D: Value = null;
	if (yield* this.has_language(language)) {
		if (AM = speaker.GetSource()) {
			return AM.say_quote(raw_message, spans, message_mode);
		}
		return speaker.say_quote(raw_message, spans, message_mode);
	} else if (language) {
		AM = speaker.GetSource();
		raw_message = (D = rt.index(GLOB.language_datum_instances, language)).scramble(raw_message);
		if (AM) {
			return AM.say_quote(raw_message, spans, message_mode);
		}
		return speaker.say_quote(raw_message, spans, message_mode);
	} else {
		return "makes a strange sound.";
	}
}, true);

// say.dm:116
rt.def("/proc/get_radio_span", function get_radio_span(f: Frame, freq: Value) {
	let returntext: Value = null;
	if (returntext = rt.index(GLOB.freqtospan, `${freq}`)) {
		return returntext;
	}
	return "radio";
});

// say.dm:122
rt.def("/proc/get_radio_name", function get_radio_name(f: Frame, freq: Value) {
	let returntext: Value = null;
	if (returntext = rt.index(GLOB.reverseradiochannels, `${freq}`)) {
		return returntext;
	}
	return `${copytext(`${freq}`, 1, 4)}.${copytext(`${freq}`, 4, 5)}`;
});

// say.dm:128
rt.def("/proc/attach_spans", function attach_spans(f: Frame, input: Value, spans: Value) {
	return `${message_spans_start(spans)}${input}</span>`;
});

// say.dm:131
rt.def("/proc/message_spans_start", function message_spans_start(f: Frame, spans: Value) {
	let S: Value = null;
	let output: Value = "<span class='";
	for (S of each(spans)) {
		output = `${output}${S} `;
	}
	return (output = `${output}'>`);
});

// say.dm:146
rt.def("/atom/movable/proc/GetVoice", function GetVoice(f: Frame) {
	return `${this}`;
});
