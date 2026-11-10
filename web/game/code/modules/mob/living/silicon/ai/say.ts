// Based on /tg/station's code/modules/mob/living/silicon/ai/say.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


// say.dm:2
rt.def("/mob/living/silicon/ai/proc/say", function* say(f: Frame, message: Value, language: Value) {
	if (this.parent && rt.istype(this.parent, T("/mob/living/silicon/ai")) && this.parent.stat != 2) {
		yield* this.parent.say(message, language);
		return f.dot;
	}
	yield* parent_proc(message);
	return f.dot;
}, true);

// say.dm:8
rt.def("/mob/living/silicon/ai/proc/compose_track_href", function compose_track_href(f: Frame, speaker: Value, namepart: Value) {
	let M: Value = null;
	if (M = speaker.GetSource()) {
		return fmt("<a href='?src=＃;track=＀'>", [this, html_encode(namepart)]);
	}
	return "";
});

// say.dm:15
rt.def("/mob/living/silicon/ai/proc/compose_job", function compose_job(f: Frame, speaker: Value, message_langs: Value, raw_message: Value, radio_freq: Value) {
	let $0: any;
	if (radio_freq) {
		$0 = " (" + speaker.GetJob() + ")";
	} else {
		$0 = "";
	}
	$0 = `${$0}`;
	return $0 + `${speaker.GetSource() ? "</a>" : ""}`;
});

// say.dm:18
rt.def("/mob/living/silicon/ai/proc/IsVocal", function IsVocal(f: Frame) {
	return (!GLOB.config.silent_ai ? 1 : 0);
});

// say.dm:21
rt.def("/mob/living/silicon/ai/proc/radio", function* radio(f: Frame, message: Value, message_mode: Value, spans: Value, language: Value) {
	if (!this.radio_enabled || this.aiRestorePowerRoutine || this.stat) {
		to_chat(this, "<span class='danger'>Your radio transmitter is offline!</span>");
		return 0;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// say.dm:27
rt.def("/mob/living/silicon/ai/proc/get_message_mode", function get_message_mode(f: Frame, message: Value) {
	if (rt.isIn(f, copytext(message, 1, 3), list(":h", ":H", ".h", ".H", "#h", "#H"))) {
		return "holopad";
	}
	return parent_proc();
}, false);

// say.dm:33
rt.def("/mob/living/silicon/ai/proc/handle_inherent_channels", function* handle_inherent_channels(f: Frame, message: Value, message_mode: Value, language: Value) {
	f.dot = (yield* parent_proc());
	if (f.dot) {
		return f.dot;
	}
	if (message_mode != "holopad") return f.dot;
	yield* this.holopad_talk(message, language);
	return 1;
}, true);

// say.dm:43
rt.def("/mob/living/silicon/ai/proc/holopad_talk", function* holopad_talk(f: Frame, message: Value, language: Value) {
	let _T: Value = null;
	log_say(`${key_name(this)} : ${message}`);
	if (!(message = trim(message))) {
		return f.dot;
	}
	if (rt.istype((_T = this.current), T("/obj/machinery/holopad")) && rt.index(_T.masters, this)) {
		yield* this.send_speech(message, 7, _T, "robot", this.get_spans(), language);
		to_chat(this, `<i><span class='game say'>Holopad transmitted, <span class='name'>${this.real_name}</span> <span class='message robot'>"${message}"</span></span></i>`);
	} else {
		to_chat(this, "No holopad connected.");
	}
	return f.dot;
}, true);

// say.dm:67
rt.def("/mob/living/silicon/ai/verb/announcement_help", function* announcement_help(f: Frame) {
	let word: Value = null, popup: Value = null;
	if (f.usr.stat == 2) {
		return f.dot;
	}
	let dat: Value = "Here is a list of words you can type into the 'Announcement' button to create sentences to vocally announce to everyone on the same level at you.<BR> <UL><LI>You can also click on the word to preview it.</LI><LI>You can only say 30 words for every announcement.</LI><LI>Do not use punctuation as you would normally, if you want a pause you can use the full stop and comma characters by separating them with spaces, like so: 'Alpha . Test , Bravo'.</LI></UL><font class='bad'>WARNING:</font><BR>Misuse of the announcement system will get you job banned.<HR>";
	let index: Value = 0;
	for (word of each(GLOB.vox_sounds)) {
		index++;
		dat += fmt("<A href='?src=＃;say_word=＀'>＀</A>", [this, word, capitalize(word)]);
		if (index != rt.len(f, GLOB.vox_sounds)) {
			dat += " / ";
		}
	}
	(popup = (yield* new_(T("/datum/browser"), this, "announce_help", "Announcement Help", 500, 400))).set_content(dat);
	yield* popup.open();
	return f.dot;
}, true, { verb: { name: "Announcement Help", category: "AI Commands", desc: "Display a list of vocal words to announce to the crew." } });

// say.dm:90
rt.def("/mob/living/silicon/ai/proc/announcement", function* announcement(f: Frame) {
	let message: Value = null, word: Value = null;
	if (GLOB.announcing_vox > rt.worldTime(f)) {
		to_chat(this, `<span class='notice'>Please wait ${round((GLOB.announcing_vox - rt.worldTime(f)) / 10)} seconds.</span>`);
		return f.dot;
	}
	this.last_announcement = (message = (yield* g.op(f, "Prompt", [2], [this.last_announcement, "Announcement", "WARNING: Misuse of this verb can result in you being job banned. More help is available in 'Announcement Help'", this, null])));
	if (!message || GLOB.announcing_vox > rt.worldTime(f)) {
		return f.dot;
	}
	if (this.stat != 0) {
		return f.dot;
	}
	if (this.control_disabled) {
		to_chat(this, "<span class='notice'>Wireless interface disabled, unable to interact with announcement PA.</span>");
		return f.dot;
	}
	let words: Value = splittext(trim(message), " ");
	let incorrect_words: Value = list();
	if (rt.len(f, words) > 30) {
		words.len = 30;
	}
	for (word of each(words)) {
		if (!(word = lowertext(trim(word)))) {
			words -= word;
			continue;
		}
		if (!rt.index(GLOB.vox_sounds, word)) {
			incorrect_words += word;
		}
	}
	if (rt.len(f, incorrect_words)) {
		to_chat(this, `<span class='notice'>These words are not available on the announcement system: ${english_list(incorrect_words)}.</span>`);
		return f.dot;
	}
	GLOB.announcing_vox = rt.worldTime(f) + 600;
	log_game(`${key_name(this)} made a vocal announcement with the following message: ${message}.`);
	word = null;
	for (word of each(words)) {
		play_vox_word(word, this.z, null);
	}
	return f.dot;
}, true);

// say.dm:144
rt.def("/proc/play_vox_word", function play_vox_word(f: Frame, word: Value, z_level: Value, only_listener: Value) {
	let sound_file: Value = null, voice: Value = null, M: Value = null, _T: Value = null;
	word = lowertext(word);
	if (rt.index(GLOB.vox_sounds, word)) {
		sound_file = rt.index(GLOB.vox_sounds, word);
		(voice = sound(sound_file, { wait: 1, channel: 1022 })).status = 4;
		if (!only_listener) {
			for (M of each(GLOB.player_list, T("/mob"))) {
				if (M.client && M.can_hear() && rt.bitAnd(M.client.prefs.toggles, 2048)) {
					if ((_T = rt.getStep(f, M, 0)).z == z_level) {
						rt.op(f, "Output", [], [M, voice], false);
					}
				}
			}
		} else {
			rt.op(f, "Output", [], [only_listener, voice], false);
		}
		return 1;
	}
	return 0;
});

// say.dm:168
rt.def("/mob/living/silicon/ai/proc/could_speak_in_language", function could_speak_in_language(f: Frame, dt: Value) {
	if (is_servant_of_ratvar(this)) {
		f.dot = ispath(dt, T("/datum/language/ratvar"));
	} else {
		f.dot = parent_proc();
	}
	return f.dot;
}, false);
