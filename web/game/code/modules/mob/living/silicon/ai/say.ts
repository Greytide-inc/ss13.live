// From code/modules/mob/living/silicon/ai/say.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/silicon/ai/proc/say  (code/modules/mob/living/silicon/ai/say.dm:2)  may sleep
rt.def("/mob/living/silicon/ai/proc/say", function* say(f: Frame, message: Value, language: Value) {
	f.vars = () => [message, language];
	if (((truthy(rt.sv(f, "parent")) && truthy((rt.istype(rt.sv(f, "parent"), T("/mob/living/silicon/ai")) ? 1 : 0))) && !isEqual(rt.fv(f, "stat", rt.sv(f, "parent")), 2))) {
		yield* g.callName(f, rt.sv(f, "parent"), "say", [live(message), live(language)]);
		return live(f.dot);
	}
	yield* g.callSuper(f, [live(message)]);
	return f.dot;
}, true);

// /mob/living/silicon/ai/proc/compose_track_href  (code/modules/mob/living/silicon/ai/say.dm:8)
rt.def("/mob/living/silicon/ai/proc/compose_track_href", function compose_track_href(f: Frame, speaker: Value, namepart: Value) {
	let M: Value = null;
	f.vars = () => [M];
	if (truthy((M = rt.callName(f, live(speaker), "GetSource", [])))) {
		return fmt("<a href='?src=＃;track=＀'>", [live(f.src), rt.call(f, P("/proc/html_encode"), null, [live(namepart)])]);
	}
	return "";
});

// /mob/living/silicon/ai/proc/compose_job  (code/modules/mob/living/silicon/ai/say.dm:15)
rt.def("/mob/living/silicon/ai/proc/compose_job", function compose_job(f: Frame, speaker: Value, message_langs: Value, raw_message: Value, radio_freq: Value) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	if (truthy(live(radio_freq))) {
		$0 = add(add(" (", rt.callName(f, live(speaker), "GetJob", [])), ")");
	} else {
		$0 = "";
	}
	$0 = fmt("＀", [$0]);
	if (truthy(rt.callName(f, live(speaker), "GetSource", []))) {
		$1 = "</a>";
	} else {
		$1 = "";
	}
	return add($0, fmt("＀", [$1]));
});

// /mob/living/silicon/ai/proc/IsVocal  (code/modules/mob/living/silicon/ai/say.dm:18)
rt.def("/mob/living/silicon/ai/proc/IsVocal", function IsVocal(f: Frame) {
	return (!truthy(rt.fv(f, "silent_ai", rt.gl("config"))) ? 1 : 0);
});

// /mob/living/silicon/ai/proc/radio  (code/modules/mob/living/silicon/ai/say.dm:21)  may sleep
rt.def("/mob/living/silicon/ai/proc/radio", function* radio(f: Frame) {
	if (((!truthy(rt.sv(f, "radio_enabled")) || truthy(rt.sv(f, "aiRestorePowerRoutine"))) || truthy(rt.sv(f, "stat")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'>Your radio transmitter is offline!</span>"]);
		return 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["message", "message_mode", "spans", "language"] });

// /mob/living/silicon/ai/proc/get_message_mode  (code/modules/mob/living/silicon/ai/say.dm:27)
rt.def("/mob/living/silicon/ai/proc/get_message_mode", function get_message_mode(f: Frame) {
	if (truthy((rt.isIn(f, rt.call(f, P("/proc/copytext"), null, [live(f.args[0]), 1, 3]), rt.list(":h", ":H", ".h", ".H", "#h", "#H")) ? 1 : 0))) {
		return "holopad";
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["message"] });

// /mob/living/silicon/ai/proc/handle_inherent_channels  (code/modules/mob/living/silicon/ai/say.dm:33)  may sleep
rt.def("/mob/living/silicon/ai/proc/handle_inherent_channels", function* handle_inherent_channels(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(live(f.dot))) {
		return live(f.dot);
	}
	if (!isEqual(live(f.args[1]), "holopad")) return f.dot;
	yield* g.srcCall(f, "holopad_talk", live(f.args[0]), live(f.args[2]));
	return 1;
}, true, { args: ["message", "message_mode", "language"] });

// /mob/living/silicon/ai/proc/holopad_talk  (code/modules/mob/living/silicon/ai/say.dm:43)  may sleep
rt.def("/mob/living/silicon/ai/proc/holopad_talk", function* holopad_talk(f: Frame, message: Value, language: Value) {
	let _T: Value = null;
	f.vars = () => [message, language, _T];
	yield* g.call(f, P("/proc/log_say"), null, [fmt("＀ : ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.src)])), live(message)])]);
	if (!truthy((message = (yield* g.call(f, P("/proc/trim"), null, [live(message)]))))) {
		return live(f.dot);
	}
	if ((truthy((rt.istype((_T = rt.sv(f, "current")), T("/obj/machinery/holopad")) ? 1 : 0)) && truthy(rt.index(rt.fv(f, "masters", live(_T)), live(f.src))))) {
		yield* g.srcCall(f, "send_speech", live(message), 7, live(_T), "robot", (yield* g.srcCall(f, "get_spans")), live(language));
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<i><span class='game say'>Holopad transmitted, <span class='name'>＀</span> <span class='message robot'>\"＀\"</span></span></i>", [rt.sv(f, "real_name"), live(message)])]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "No holopad connected."]);
	}
	return f.dot;
}, true);

// /mob/living/silicon/ai/verb/announcement_help  (code/modules/mob/living/silicon/ai/say.dm:67)  may sleep
rt.def("/mob/living/silicon/ai/verb/announcement_help", function* announcement_help(f: Frame) {
	let dat: Value = null, index: Value = null, word: Value = null, popup: Value = null;
	let $e: any;
	f.vars = () => [dat, index, word, popup, $e];
	if (isEqual(rt.fv(f, "stat", live(f.usr)), 2)) {
		return live(f.dot);
	}
	dat = "Here is a list of words you can type into the 'Announcement' button to create sentences to vocally announce to everyone on the same level at you.<BR> <UL><LI>You can also click on the word to preview it.</LI><LI>You can only say 30 words for every announcement.</LI><LI>Do not use punctuation as you would normally, if you want a pause you can use the full stop and comma characters by separating them with spaces, like so: 'Alpha . Test , Bravo'.</LI></UL><font class='bad'>WARNING:</font><BR>Misuse of the announcement system will get you job banned.<HR>";
	index = 0;
	word = null;
	rt.forList(f, 0, rt.gl("vox_sounds"));
	while (($e = rt.next(f, 0)) !== undefined) {
		word = $e;
		index = rt.inc(live(index), 1);
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;say_word=＀'>＀</A>", [live(f.src), live(word), (yield* g.call(f, P("/proc/capitalize"), null, [live(word)]))]), add);
		if (!isEqual(live(index), rt.len(f, rt.gl("vox_sounds")))) {
			dat = rt.modify(live(dat), " / ", add);
		}
	}
	rt.endFor(f, 0);
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(f.src), "announce_help", "Announcement Help", 500, 400]))), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "open", []);
	return f.dot;
}, true, { verb: { name: "Announcement Help", category: "AI Commands", desc: "Display a list of vocal words to announce to the crew." } });

// /mob/living/silicon/ai/proc/announcement  (code/modules/mob/living/silicon/ai/say.dm:90)  may sleep
rt.def("/mob/living/silicon/ai/proc/announcement", function* announcement(f: Frame) {
	let message: Value = null, words: Value = null, incorrect_words: Value = null, word: Value = null;
	let $e: any;
	f.vars = () => [message, words, incorrect_words, word, $e];
	if (rt.gt(rt.gl("announcing_vox"), rt.worldTime(f))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='notice'>Please wait ＀ seconds.</span>", [(yield* g.call(f, P("/proc/round"), null, [divide(subtract(rt.gl("announcing_vox"), rt.worldTime(f)), 10)]))])]);
		return live(f.dot);
	}
	rt.setSv(f, "last_announcement", (message = (yield* g.op(f, "Prompt", [2], [rt.fv(f, "last_announcement", live(f.src)), "Announcement", "WARNING: Misuse of this verb can result in you being job banned. More help is available in 'Announcement Help'", live(f.src), null]))));
	if ((!truthy(live(message)) || rt.gt(rt.gl("announcing_vox"), rt.worldTime(f)))) {
		return live(f.dot);
	}
	if (!isEqual(rt.sv(f, "stat"), 0)) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "control_disabled"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='notice'>Wireless interface disabled, unable to interact with announcement PA.</span>"]);
		return live(f.dot);
	}
	words = (yield* g.call(f, P("/proc/splittext"), null, [(yield* g.call(f, P("/proc/trim"), null, [live(message)])), " "]));
	incorrect_words = rt.list();
	if (rt.gt(rt.len(f, live(words)), 30)) {
		rt.setFv(f, "len", live(words), 30);
	}
	word = null;
	rt.forList(f, 0, live(words));
	while (($e = rt.next(f, 0)) !== undefined) {
		word = $e;
		if (!truthy((word = (yield* g.call(f, P("/proc/lowertext"), null, [(yield* g.call(f, P("/proc/trim"), null, [live(word)]))]))))) {
			(words = rt.modify(live(words), live(word), subtract));
			continue;
		}
		if (!truthy(rt.index(rt.gl("vox_sounds"), live(word)))) {
			incorrect_words = rt.modify(live(incorrect_words), live(word), add);
		}
	}
	rt.endFor(f, 0);
	if (truthy(rt.len(f, live(incorrect_words)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='notice'>These words are not available on the announcement system: ＀.</span>", [(yield* g.call(f, P("/proc/english_list"), null, [live(incorrect_words)]))])]);
		return live(f.dot);
	}
	rt.setGl("announcing_vox", add(rt.worldTime(f), 600));
	yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ made a vocal announcement with the following message: ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.src)])), live(message)])]);
	word = null;
	rt.forList(f, 0, live(words));
	while (($e = rt.next(f, 0)) !== undefined) {
		word = $e;
		yield* g.call(f, P("/proc/play_vox_word"), null, [live(word), rt.fv(f, "z", live(f.src)), null]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /proc/play_vox_word  (code/modules/mob/living/silicon/ai/say.dm:144)
rt.def("/proc/play_vox_word", function play_vox_word(f: Frame, word: Value, z_level: Value, only_listener: Value) {
	let sound_file: Value = null, voice: Value = null, M: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [word, sound_file, voice, M, _T, $e];
	word = rt.call(f, P("/proc/lowertext"), null, [live(word)]);
	if (truthy(rt.index(rt.gl("vox_sounds"), live(word)))) {
		sound_file = rt.index(rt.gl("vox_sounds"), live(word));
		rt.setFv(f, "status", (voice = rt.call(f, P("/proc/sound"), null, [null, live(sound_file), "wait", 1, "channel", 1022], rt.Args.Named)), 4);
		if (!truthy(live(only_listener))) {
			M = null;
			rt.forList(f, 0, rt.gl("player_list"), T("/mob"));
			while (($e = rt.next(f, 0)) !== undefined) {
				M = $e;
				if (((truthy(rt.fv(f, "client", live(M))) && truthy(rt.callName(f, live(M), "can_hear", []))) && truthy(rt.bitAnd(rt.gv(f, "toggles", rt.gv(f, "prefs", rt.fv(f, "client", live(M)))), 2048)))) {
					if (isEqual(rt.gv(f, "z", (_T = rt.getStep(f, live(M), 0))), live(z_level))) {
						rt.op(f, "Output", [], [live(M), live(voice)], false);
					}
				}
			}
			rt.endFor(f, 0);
		} else {
			rt.op(f, "Output", [], [live(only_listener), live(voice)], false);
		}
		return 1;
	}
	return 0;
});

// /mob/living/silicon/ai/proc/could_speak_in_language  (code/modules/mob/living/silicon/ai/say.dm:168)
rt.def("/mob/living/silicon/ai/proc/could_speak_in_language", function could_speak_in_language(f: Frame) {
	if (truthy(rt.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.src)]))) {
		f.dot = rt.call(f, P("/proc/ispath"), null, [live(f.args[0]), T("/datum/language/ratvar")]);
	} else {
		f.dot = rt.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, false, { args: ["dt"] });
