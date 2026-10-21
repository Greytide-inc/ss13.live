// From code/modules/mob/living/say.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobaldepartment_radio_prefixes  (code/modules/mob/living/say.dm:1)
rt.def("/datum/controller/global_vars/proc/InitGlobaldepartment_radio_prefixes", function InitGlobaldepartment_radio_prefixes(f: Frame) {
	rt.setGl("department_radio_prefixes", rt.list(":", "."));
	rt.modSrcVar(f, "gvars_datum_init_order", "department_radio_prefixes", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaldepartment_radio_keys  (code/modules/mob/living/say.dm:3)
rt.def("/datum/controller/global_vars/proc/InitGlobaldepartment_radio_keys", function InitGlobaldepartment_radio_keys(f: Frame) {
	rt.setGl("department_radio_keys", rt.alist(f, ["r", "right hand", "l", "left hand", "i", "intercom", "h", "department", "c", "Command", "n", "Science", "m", "Medical", "e", "Engineering", "s", "Security", "u", "Supply", "v", "Service", "t", "Syndicate", "y", "Centcom", "b", "binary", "g", "changeling", "a", "alientalk", "p", "admin", "d", "deadmin", "o", "AI Private", "x", "cords", "�", "right hand", "�", "left hand", "�", "intercom", "�", "department", "�", "Command", "�", "Science", "�", "Medical", "�", "Engineering", "�", "Security", "�", "Supply", "�", "Service", "�", "Syndicate", "�", "Centcom", "�", "binary", "�", "changeling", "�", "alientalk", "�", "admin", "�", "deadmin", "�", "AI Private", "�", "cords"]));
	rt.modSrcVar(f, "gvars_datum_init_order", "department_radio_keys", add);
	return f.dot;
});

// /mob/living/proc/say  (code/modules/mob/living/say.dm:79)  may sleep
rt.def("/mob/living/proc/say", function* say(f: Frame, message: Value, bubble_type: Value, spans: Value, sanitize: Value, language: Value) {
	let message_mode: Value = null, original_message: Value = null, in_critical: Value = null, message_language: Value = null, message_range: Value = null, succumbed: Value = null, health_diff: Value = null, message_len: Value = null, L: Value = null, radio_return: Value = null, _T: Value = null, environment: Value = null, pressure: Value = null;
	let $0: any, $1: any;
	f.vars = () => [message, bubble_type, spans, sanitize, language, message_mode, original_message, in_critical, message_language, message_range, succumbed, health_diff, message_len, L, radio_return, _T, environment, pressure, $0, $1];
	if (live(spans) === null) {
		spans = rt.list();
	}
	if (live(sanitize) === null) {
		sanitize = 1;
	}
	if (live(language) === null) {
		language = null;
	}
	if (truthy(live(sanitize))) {
		message = (yield* g.call(f, P("/proc/trim"), null, [(yield* g.call(f, P("/proc/copytext"), null, [(yield* g.call(f, P("/proc/sanitize"), null, [live(message)])), 1, 1024]))]));
	}
	if ((!truthy(live(message)) || isEqual(live(message), ""))) {
		return live(f.dot);
	}
	message_mode = (yield* g.srcCall(f, "get_message_mode", live(message)));
	original_message = live(message);
	in_critical = (yield* g.srcCall(f, "InCritical"));
	if (truthy(rt.index(rt.gl("one_character_prefix"), live(message_mode)))) {
		message = (yield* g.call(f, P("/proc/copytext"), null, [live(message), 2]));
	} else {
		if (truthy(live(message_mode))) {
			message = (yield* g.call(f, P("/proc/copytext"), null, [live(message), 3]));
		}
	}
	if (truthy((yield* g.call(f, P("/proc/findtext"), null, [live(message), " ", 1, 2])))) {
		message = (yield* g.call(f, P("/proc/copytext"), null, [live(message), 2]));
	}
	if (isEqual(live(message_mode), "admin")) {
		if (truthy(rt.sv(f, "client"))) {
			yield* g.callName(f, rt.sv(f, "client"), "cmd_admin_say", [live(message)]);
		}
		return live(f.dot);
	}
	if (isEqual(live(message_mode), "deadmin")) {
		if (truthy(rt.sv(f, "client"))) {
			yield* g.callName(f, rt.sv(f, "client"), "dsay", [live(message)]);
		}
		return live(f.dot);
	}
	if (isEqual(rt.sv(f, "stat"), 2)) {
		yield* g.srcCall(f, "say_dead", live(original_message));
		return live(f.dot);
	}
	if ((truthy((yield* g.srcCall(f, "check_emote", live(original_message)))) || !truthy((yield* g.srcCall(f, "can_speak_basic", live(original_message)))))) {
		return live(f.dot);
	}
	if (truthy(live(in_critical))) {
		if (!truthy(rt.index(rt.gl("crit_allowed_modes"), live(message_mode)))) {
			return live(f.dot);
		}
	} else {
		if (isEqual(rt.sv(f, "stat"), 1)) {
			if (!truthy(rt.index(rt.gl("unconscious_allowed_modes"), live(message_mode)))) {
				return live(f.dot);
			}
		}
	}
	if (truthy((message_language = (yield* g.srcCall(f, "get_message_language", live(message)))))) {
		if (truthy((yield* g.srcCall(f, "can_speak_in_language", live(message_language))))) {
			language = live(message_language);
		}
		if (truthy((yield* g.call(f, P("/proc/findtext"), null, [(message = (yield* g.call(f, P("/proc/copytext"), null, [live(message), 3]))), " ", 1, 2])))) {
			message = (yield* g.call(f, P("/proc/copytext"), null, [live(message), 2]));
		}
	}
	if (!truthy(live(language))) {
		language = (yield* g.srcCall(f, "get_default_language"));
	}
	if (truthy((yield* g.srcCall(f, "handle_inherent_channels", live(message), live(message_mode), live(language))))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.srcCall(f, "can_speak_vocal", live(message))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>You find yourself unable to speak!</span>"]);
		return live(f.dot);
	}
	message_range = 7;
	succumbed = 0;
	if (isEqual(live(message_mode), "whisper")) {
		message_range = 1;
		(spans = rt.modify(live(spans), "italics", rt.bitOr));
		yield* g.call(f, P("/proc/log_whisper"), null, [fmt("＀/＀ : ＀", [rt.fv(f, "name", live(f.src)), rt.fv(f, "key", live(f.src)), live(message)])]);
		if (truthy(live(in_critical))) {
			health_diff = (yield* g.call(f, P("/proc/round"), null, [add(100, rt.sv(f, "health"))]));
			message_len = rt.length(live(message));
			$0 = (yield* g.call(f, P("/proc/copytext"), null, [live(message), 1, live(health_diff)]));
			if (rt.gt(live(message_len), live(health_diff))) {
				$1 = "-..";
			} else {
				$1 = "...";
			}
			message = (yield* g.call(f, P("/proc/Ellipsis"), null, [(message = add($0, fmt("＀", [$1]))), 10, 1]));
			message_mode = "whispercrit";
			succumbed = 1;
		}
	} else {
		yield* g.call(f, P("/proc/log_say"), null, [fmt("＀/＀ : ＀", [rt.sv(f, "name"), rt.sv(f, "key"), live(message)])]);
	}
	if (!truthy((message = (yield* g.srcCall(f, "treat_message", live(message)))))) {
		return live(f.dot);
	}
	spans = rt.modify(live(spans), (yield* g.srcCall(f, "get_spans")), add);
	if (truthy(live(language))) {
		(spans = rt.modify(live(spans), rt.gv(f, "spans", (L = rt.index(rt.gl("language_datum_instances"), live(language)))), rt.bitOr));
	}
	yield* g.srcCall(f, "log_message", live(message), "Say log");
	if (truthy(rt.bitAnd((radio_return = (yield* g.srcCall(f, "radio", live(message), live(message_mode), live(spans), live(language)))), 1))) {
		(spans = rt.modify(live(spans), "italics", rt.bitOr));
	}
	if (truthy(rt.bitAnd(live(radio_return), 2))) {
		message_range = 1;
	}
	_T = rt.getStep(f, live(f.src), 0);
	environment = (yield* g.callName(f, live(_T), "return_air", []));
	if (truthy(live(environment))) {
		$0 = (yield* g.callName(f, live(environment), "return_pressure", []));
	} else {
		$0 = 0;
	}
	if (rt.lt((pressure = $0), 10)) {
		message_range = 1;
	}
	if (rt.lt(live(pressure), 40.529998779296875)) {
		(spans = rt.modify(live(spans), "italics", rt.bitOr));
	}
	yield* g.srcCall(f, "send_speech", live(message), live(message_range), live(f.src), live(bubble_type), live(spans), live(language), live(message_mode));
	if (truthy(live(succumbed))) {
		yield* g.srcCall(f, "succumb", 1);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), (yield* g.srcCall(f, "compose_message", live(f.src), live(language), live(message), null, live(spans), live(message_mode)))]);
	}
	return 1;
}, true);

// /mob/living/proc/Hear  (code/modules/mob/living/say.dm:201)  may sleep
rt.def("/mob/living/proc/Hear", function* Hear(f: Frame, message: Value, speaker: Value, message_language: Value, raw_message: Value, radio_freq: Value, spans: Value, message_mode: Value) {
	let deaf_message: Value = null, deaf_type: Value = null;
	f.vars = () => [message, speaker, message_language, raw_message, radio_freq, spans, message_mode, deaf_message, deaf_type];
	if (!truthy(rt.sv(f, "client"))) {
		return live(f.dot);
	}
	deaf_message = null;
	deaf_type = null;
	if (!isEqual(live(speaker), live(f.src))) {
		if (!truthy(live(radio_freq))) {
			deaf_message = fmt("<span class='name'>＀</span> ＀ something but you cannot hear them.", [live(speaker), rt.fv(f, "verb_say", live(speaker))]);
			deaf_type = 1;
		}
	} else {
		deaf_message = "<span class='notice'>You can't hear yourself!</span>";
		deaf_type = 2;
	}
	yield* g.srcCall(f, "show_message", (message = (yield* g.srcCall(f, "compose_message", live(speaker), live(message_language), live(raw_message), live(radio_freq), live(spans), live(message_mode)))), 2, live(deaf_message), live(deaf_type));
	if (!truthy(live(radio_freq))) {
		yield* g.srcCall(f, "show_runechat", live(speaker), live(message_language), live(raw_message), live(spans));
	}
	return live(message);
}, true);

// /mob/living/proc/send_speech  (code/modules/mob/living/say.dm:223)  may sleep
rt.def("/mob/living/proc/send_speech", function* send_speech(f: Frame, message: Value, message_range: Value, source: Value, bubble_type: Value, spans: Value, message_language: Value, message_mode: Value) {
	let eavesdrop_range: Value = null, listening: Value = null, the_dead: Value = null, _M: Value = null, M: Value = null, eavesdropping: Value = null, eavesrendered: Value = null, rendered: Value = null, _AM: Value = null, AM: Value = null;
	let $e: any;
	f.vars = () => [message, message_range, source, bubble_type, spans, message_language, message_mode, eavesdrop_range, listening, the_dead, _M, M, eavesdropping, eavesrendered, rendered, _AM, AM, $e];
	if (live(message_range) === null) {
		message_range = 6;
	}
	if (live(source) === null) {
		source = live(f.src);
	}
	if (live(bubble_type) === null) {
		bubble_type = rt.sv(f, "bubble_icon");
	}
	if (live(message_language) === null) {
		message_language = null;
	}
	eavesdrop_range = 0;
	if (truthy(rt.index(rt.gl("eavesdropping_modes"), live(message_mode)))) {
		eavesdrop_range = 1;
	}
	listening = (yield* g.call(f, P("/proc/get_hearers_in_view"), null, [add(live(message_range), live(eavesdrop_range)), live(source)]));
	the_dead = rt.list();
	_M = null;
	rt.forList(f, 0, rt.gl("player_list"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_M = $e;
		if (!isEqual(rt.gv(f, "stat", (M = live(_M))), 2)) {
			continue;
		}
		if ((!truthy(rt.fv(f, "client", live(M))) || !truthy(rt.sv(f, "client")))) {
			continue;
		}
		if ((rt.gt((yield* g.call(f, P("/proc/get_dist"), null, [live(M), live(f.src)])), 7) || !isEqual(rt.fv(f, "z", live(M)), rt.sv(f, "z")))) {
			if ((truthy(rt.index(rt.gl("eavesdropping_modes"), live(message_mode))) && !truthy(rt.bitAnd(rt.gv(f, "chat_toggles", rt.gv(f, "prefs", rt.fv(f, "client", live(M)))), 128)))) {
				continue;
			}
			if (!truthy(rt.bitAnd(rt.gv(f, "chat_toggles", rt.gv(f, "prefs", rt.fv(f, "client", live(M)))), 4))) {
				continue;
			}
		}
		(listening = rt.modify(live(listening), live(M), rt.bitOr));
		rt.setAt(live(the_dead), live(M), 1);
	}
	rt.endFor(f, 0);
	eavesdropping = null;
	eavesrendered = null;
	if (truthy(live(eavesdrop_range))) {
		eavesdropping = (yield* g.call(f, P("/proc/stars"), null, [live(message)]));
		eavesrendered = (yield* g.srcCall(f, "compose_message", live(f.src), live(message_language), live(eavesdropping), null, live(spans), live(message_mode)));
	}
	rendered = (yield* g.srcCall(f, "compose_message", live(f.src), live(message_language), live(message), null, live(spans), live(message_mode)));
	_AM = null;
	rt.forList(f, 0, live(listening));
	while (($e = rt.next(f, 0)) !== undefined) {
		_AM = $e;
		AM = live(_AM);
		if (((truthy(live(eavesdrop_range)) && rt.gt((yield* g.call(f, P("/proc/get_dist"), null, [live(source), live(AM)])), live(message_range))) && !truthy(rt.index(live(the_dead), live(AM))))) {
			yield* g.callName(f, live(AM), "Hear", [live(eavesrendered), live(f.src), live(message_language), live(eavesdropping), null, live(spans), live(message_mode)]);
		} else {
			yield* g.callName(f, live(AM), "Hear", [live(rendered), live(f.src), live(message_language), live(message), null, live(spans), live(message_mode)]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /mob/living/proc/can_speak  (code/modules/mob/living/say.dm:261)
rt.def("/mob/living/proc/can_speak", function can_speak(f: Frame, message: Value) {
	if (!(truthy(rt.callSrc(f, "can_speak_basic", [live(message)])) && truthy(rt.callSrc(f, "can_speak_vocal", [live(message)])))) return f.dot;
	return 1;
});

// /mob/living/proc/can_speak_basic  (code/modules/mob/living/say.dm:266)
rt.def("/mob/living/proc/can_speak_basic", function can_speak_basic(f: Frame, message: Value) {
	if (truthy(rt.sv(f, "client"))) {
		if (truthy(rt.bitAnd(rt.gv(f, "muted", rt.fv(f, "prefs", rt.sv(f, "client"))), 1))) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'>You cannot speak in IC (muted).</span>"]);
			return 0;
		}
		if (truthy(rt.callName(f, rt.sv(f, "client"), "handle_spam_prevention", [live(message), 1]))) {
			return 0;
		}
	}
	return 1;
});

// /mob/living/proc/can_speak_vocal  (code/modules/mob/living/say.dm:275)
rt.def("/mob/living/proc/can_speak_vocal", function can_speak_vocal(f: Frame, message: Value) {
	if (truthy(rt.bitAnd(rt.sv(f, "disabilities"), 2))) {
		return 0;
	}
	if (truthy(rt.callSrc(f, "is_muzzled", []))) {
		return 0;
	}
	if (!truthy(rt.callSrc(f, "IsVocal", []))) {
		return 0;
	}
	return 1;
});

// /mob/living/proc/check_emote  (code/modules/mob/living/say.dm:287)  may sleep
rt.def("/mob/living/proc/check_emote", function* check_emote(f: Frame, message: Value) {
	f.vars = () => [message];
	if (!isEqual((yield* g.call(f, P("/proc/copytext"), null, [live(message), 1, 2])), "*")) return f.dot;
	yield* g.srcCall(f, "emote", (yield* g.call(f, P("/proc/copytext"), null, [live(message), 2])));
	return 1;
}, true);

// /mob/living/proc/get_message_mode  (code/modules/mob/living/say.dm:292)
rt.def("/mob/living/proc/get_message_mode", function get_message_mode(f: Frame, message: Value) {
	let key: Value = null, key_symbol: Value = null;
	f.vars = () => [key, key_symbol];
	if (isEqual((key = rt.call(f, P("/proc/copytext"), null, [live(message), 1, 2])), ";")) {
		return "headset";
	}
	if (isEqual(live(key), "#")) {
		return "whisper";
	}
	if (!(rt.gt(rt.length(live(message)), 2) && truthy((rt.isIn(f, live(key), rt.gl("department_radio_prefixes")) ? 1 : 0)))) return f.dot;
	key_symbol = rt.call(f, P("/proc/lowertext"), null, [rt.call(f, P("/proc/copytext"), null, [live(message), 2, 3])]);
	return rt.index(rt.gl("department_radio_keys"), live(key_symbol));
});

// /mob/living/proc/get_message_language  (code/modules/mob/living/say.dm:302)
rt.def("/mob/living/proc/get_message_language", function get_message_language(f: Frame, message: Value) {
	let key: Value = null, ld: Value = null, LD: Value = null;
	let $e: any;
	f.vars = () => [key, ld, LD, $e];
	if (isEqual(rt.call(f, P("/proc/copytext"), null, [live(message), 1, 2]), ",")) {
		key = rt.call(f, P("/proc/copytext"), null, [live(message), 2, 3]);
		ld = null;
		rt.forList(f, 0, rt.gl("all_languages"));
		while (($e = rt.next(f, 0)) !== undefined) {
			ld = $e;
			if (isEqual(rt.initial(f, (LD = live(ld)), "key"), live(key))) {
				return live(LD);
			}
		}
		rt.endFor(f, 0);
	}
	return null;
});

// /mob/living/proc/handle_inherent_channels  (code/modules/mob/living/say.dm:311)  may sleep
rt.def("/mob/living/proc/handle_inherent_channels", function* handle_inherent_channels(f: Frame, message: Value, message_mode: Value) {
	let msg: Value = null, _M: Value = null, M: Value = null, link: Value = null, C: Value = null, V: Value = null;
	let $0: any, $e: any;
	f.vars = () => [message, message_mode, msg, _M, M, link, C, V, $0, $e];
	if (isEqual(live(message_mode), "changeling")) {
		$0 = (yield* g.srcCall(f, "lingcheck"));
		if ($0 === 3) {
			msg = fmt("<i><font color=#800040><b>＀:</b> ＀</font></i>", [rt.fv(f, "mind", live(f.src)), live(message)]);
			_M = null;
			rt.forList(f, 0, rt.gl("mob_list"));
			while (($e = rt.next(f, 0)) !== undefined) {
				_M = $e;
				if (truthy((rt.isIn(f, (M = live(_M)), rt.gl("dead_mob_list")) ? 1 : 0))) {
					link = fmt("<a href=?src=＃;follow=＃>(F)</a>", [live(M), live(f.src)]);
					yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("＀ ＀", [live(link), live(msg)])]);
				} else {
					$0 = (yield* g.callName(f, live(M), "lingcheck", []));
					if ($0 === 3) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(M), live(msg)]);
					} else if ($0 === 2) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(M), live(msg)]);
					} else if ($0 === 1) {
						if (truthy(rt.op(f, "Prob", [], [40]))) {
							yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<i><font color=#800080>We can faintly sense an outsider trying to communicate through the hivemind...</font></i>"]);
						}
					}
				}
			}
			rt.endFor(f, 0);
		} else if ($0 === 2) {
			msg = fmt("<i><font color=#800080><b>＀:</b> ＀</font></i>", [rt.gv(f, "changelingID", rt.fv(f, "changeling", rt.sv(f, "mind"))), live(message)]);
			yield* g.call(f, P("/proc/log_say"), null, [fmt("＀/＀ : ＀", [rt.gv(f, "changelingID", rt.fv(f, "changeling", rt.sv(f, "mind"))), rt.fv(f, "key", live(f.src)), live(message)])]);
			_M = null;
			rt.forList(f, 0, rt.gl("mob_list"));
			while (($e = rt.next(f, 0)) !== undefined) {
				_M = $e;
				if (truthy((rt.isIn(f, (M = live(_M)), rt.gl("dead_mob_list")) ? 1 : 0))) {
					link = fmt("<a href=?src=＃;follow=＃>(F)</a>", [live(M), live(f.src)]);
					yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("＀ ＀", [live(link), live(msg)])]);
				} else {
					$0 = (yield* g.callName(f, live(M), "lingcheck", []));
					if ($0 === 3) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(M), live(msg)]);
					} else if ($0 === 2) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(M), live(msg)]);
					} else if ($0 === 1) {
						if (truthy(rt.op(f, "Prob", [], [40]))) {
							yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<i><font color=#800080>We can faintly sense another of our kind trying to communicate through the hivemind...</font></i>"]);
						}
					}
				}
			}
			rt.endFor(f, 0);
		} else if ($0 === 1) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<i><font color=#800080>Our senses have not evolved enough to be able to communicate this way...</font></i>"]);
		}
		return 1;
	}
	if (isEqual(live(message_mode), "alientalk")) {
		if (truthy((yield* g.srcCall(f, "hivecheck")))) {
			yield* g.srcCall(f, "alien_talk", live(message));
		}
		return 1;
	}
	if (isEqual(live(message_mode), "cords")) {
		if (truthy((rt.istype(live(f.src), T("/mob/living/carbon")) ? 1 : 0))) {
			C = live(f.src);
			if ((truthy((V = (yield* g.callName(f, live(C), "getorganslot", ["vocal_cords"])))) && truthy((yield* g.callName(f, live(V), "can_speak_with", []))))) {
				yield* g.callName(f, live(V), "handle_speech", [live(message)]);
				yield* g.callName(f, live(V), "speak_with", [live(message)]);
			}
		}
		return 1;
	}
	return 0;
}, true);

// /mob/living/proc/treat_message  (code/modules/mob/living/say.dm:364)
rt.def("/mob/living/proc/treat_message", function treat_message(f: Frame, message: Value) {
	f.vars = () => [message];
	if (rt.ge(rt.callSrc(f, "getBrainLoss", []), 60)) {
		message = rt.call(f, P("/proc/derpspeech"), null, [live(message), rt.sv(f, "stuttering")]);
	}
	if (truthy(rt.sv(f, "stuttering"))) {
		message = rt.call(f, P("/proc/stutter"), null, [live(message)]);
	}
	if (truthy(rt.sv(f, "slurring"))) {
		message = rt.call(f, P("/proc/slur"), null, [live(message)]);
	}
	if (truthy(rt.sv(f, "cultslurring"))) {
		message = rt.call(f, P("/proc/cultslur"), null, [live(message)]);
	}
	return (message = rt.call(f, P("/proc/capitalize"), null, [live(message)]));
});

// /mob/living/proc/radio  (code/modules/mob/living/say.dm:381)  may sleep
rt.def("/mob/living/proc/radio", function* radio(f: Frame, message: Value, message_mode: Value, spans: Value, language: Value) {
	let r_hand: Value = null, l_hand: Value = null, I: Value = null;
	let $0: any, $e: any;
	f.vars = () => [message, message_mode, spans, language, r_hand, l_hand, I, $0, $e];
	$0 = live(message_mode);
	if ($0 === "right hand") {
		r_hand = null;
		rt.forList(f, 0, (yield* g.callSrc(f, "get_held_items_for_side", [null, "r", "all", 1], rt.Args.Named)), T("/obj/item"));
		while (($e = rt.next(f, 0)) !== undefined) {
			r_hand = $e;
			if (truthy(live(r_hand))) {
				return (yield* g.callName(f, live(r_hand), "talk_into", [live(f.src), live(message), null, live(spans), live(language)]));
			}
			return 3;
		}
		rt.endFor(f, 0);
	} else if ($0 === "left hand") {
		l_hand = null;
		rt.forList(f, 0, (yield* g.callSrc(f, "get_held_items_for_side", [null, "l", "all", 1], rt.Args.Named)), T("/obj/item"));
		while (($e = rt.next(f, 0)) !== undefined) {
			l_hand = $e;
			if (truthy(live(l_hand))) {
				return (yield* g.callName(f, live(l_hand), "talk_into", [live(f.src), live(message), null, live(spans), live(language)]));
			}
			return 3;
		}
		rt.endFor(f, 0);
	} else if ($0 === "intercom") {
		I = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/view"), null, [1, null])), T("/obj/item/device/radio/intercom"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			yield* g.callName(f, live(I), "talk_into", [live(f.src), live(message), null, live(spans), live(language)]);
		}
		rt.endFor(f, 0);
		return 3;
	} else if ($0 === "binary") {
		if (truthy((yield* g.srcCall(f, "binarycheck")))) {
			yield* g.srcCall(f, "robot_talk", live(message));
		}
		return 3;
	}
	return 0;
}, true);

// /mob/living/proc/lingcheck  (code/modules/mob/living/say.dm:405)
rt.def("/mob/living/proc/lingcheck", function lingcheck(f: Frame) {
	if ((truthy(rt.sv(f, "mind")) && truthy(rt.fv(f, "changeling", rt.sv(f, "mind"))))) {
		if (truthy(rt.gv(f, "changeling_speak", rt.fv(f, "changeling", rt.sv(f, "mind"))))) {
			return 2;
		}
		return 1;
	}
	if ((truthy(rt.sv(f, "mind")) && truthy(rt.fv(f, "linglink", rt.sv(f, "mind"))))) {
		return 3;
	}
	return 0;
});

// /mob/living/proc/say_mod  (code/modules/mob/living/say.dm:414)
rt.def("/mob/living/proc/say_mod", function say_mod(f: Frame) {
	if (isEqual(live(f.args[1]), "whisper")) {
		f.dot = rt.sv(f, "verb_whisper");
	} else {
		if (isEqual(live(f.args[1]), "whispercrit")) {
			f.dot = fmt("＀ in ＀ last breath", [rt.sv(f, "verb_whisper"), rt.callSrc(f, "p_their", [])]);
		} else {
			if (truthy(rt.sv(f, "stuttering"))) {
				f.dot = "stammers";
			} else {
				if (rt.ge(rt.callSrc(f, "getBrainLoss", []), 60)) {
					f.dot = "gibbers";
				} else {
					f.dot = rt.callSuper(f, [], rt.Args.Same);
				}
			}
		}
	}
	return f.dot;
}, false, { args: ["input", "message_mode"] });

// /mob/living/proc/whisper  (code/modules/mob/living/say.dm:426)  may sleep
rt.def("/mob/living/proc/whisper", function* whisper(f: Frame, message: Value, bubble_type: Value, spans: Value, sanitize: Value, language: Value) {
	f.vars = () => [message, bubble_type, spans, sanitize, language];
	if (live(spans) === null) {
		spans = rt.list();
	}
	if (live(sanitize) === null) {
		sanitize = 1;
	}
	if (live(language) === null) {
		language = null;
	}
	yield* g.srcCall(f, "say", fmt("#＀", [live(message)]), live(bubble_type), live(spans), live(sanitize), live(language));
	return f.dot;
}, true);

// /mob/living/proc/get_language_holder  (code/modules/mob/living/say.dm:429)  may sleep
rt.def("/mob/living/proc/get_language_holder", function* get_language_holder(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = 1;
	}
	if ((truthy(rt.sv(f, "mind")) && truthy(live(f.args[0])))) {
		f.dot = (yield* g.callName(f, rt.sv(f, "mind"), "get_language_holder", []));
		if (truthy(live(f.dot))) {
			return live(f.dot);
		}
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["shadow"] });
