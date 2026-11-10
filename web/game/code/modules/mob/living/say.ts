// Based on /tg/station's code/modules/mob/living/say.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, fmt } = rt;


// say.dm:1
rt.def("/datum/controller/global_vars/proc/InitGlobaldepartment_radio_prefixes", function InitGlobaldepartment_radio_prefixes(f: Frame) {
	GLOB.department_radio_prefixes = list(":", ".");
	this.gvars_datum_init_order += "department_radio_prefixes";
	return f.dot;
});

// say.dm:3
rt.def("/datum/controller/global_vars/proc/InitGlobaldepartment_radio_keys", function InitGlobaldepartment_radio_keys(f: Frame) {
	GLOB.department_radio_keys = rt.alist(f, ["r", "right hand", "l", "left hand", "i", "intercom", "h", "department", "c", "Command", "n", "Science", "m", "Medical", "e", "Engineering", "s", "Security", "u", "Supply", "v", "Service", "t", "Syndicate", "y", "Centcom", "b", "binary", "g", "changeling", "a", "alientalk", "p", "admin", "d", "deadmin", "o", "AI Private", "x", "cords", "�", "right hand", "�", "left hand", "�", "intercom", "�", "department", "�", "Command", "�", "Science", "�", "Medical", "�", "Engineering", "�", "Security", "�", "Supply", "�", "Service", "�", "Syndicate", "�", "Centcom", "�", "binary", "�", "changeling", "�", "alientalk", "�", "admin", "�", "deadmin", "�", "AI Private", "�", "cords"]);
	this.gvars_datum_init_order += "department_radio_keys";
	return f.dot;
});

// say.dm:79
rt.def("/mob/living/proc/say", function* say(f: Frame, message: Value, bubble_type: Value, spans: Value, sanitize: Value, language: Value) {
	let message_language: Value = null, health_diff: Value = null, message_len: Value = null, L: Value = null, radio_return: Value = null, pressure: Value = null;
	spans ??= list();
	sanitize ??= 1;
	if (sanitize) {
		message = trim(copytext((yield* g.call(f, P("/proc/sanitize"), null, [message])), 1, 1024));
	}
	if (!message || message == "") {
		return f.dot;
	}
	let message_mode: Value = this.get_message_mode(message);
	let original_message: Value = message;
	let in_critical: Value = this.InCritical();
	if (rt.index(GLOB.one_character_prefix, message_mode)) {
		message = copytext(message, 2);
	} else if (message_mode) {
		message = copytext(message, 3);
	}
	if (findtext(message, " ", 1, 2)) {
		message = copytext(message, 2);
	}
	if (message_mode == "admin") {
		if (this.client) {
			this.client.cmd_admin_say(message);
		}
		return f.dot;
	}
	if (message_mode == "deadmin") {
		if (this.client) {
			this.client.dsay(message);
		}
		return f.dot;
	}
	if (this.stat == 2) {
		yield* this.say_dead(original_message);
		return f.dot;
	}
	if ((yield* this.check_emote(original_message)) || !this.can_speak_basic(original_message)) {
		return f.dot;
	}
	if (in_critical) {
		if (!rt.index(GLOB.crit_allowed_modes, message_mode)) {
			return f.dot;
		}
	} else if (this.stat == 1) {
		if (!rt.index(GLOB.unconscious_allowed_modes, message_mode)) {
			return f.dot;
		}
	}
	if (message_language = this.get_message_language(message)) {
		if (yield* this.can_speak_in_language(message_language)) {
			language = message_language;
		}
		if (findtext((message = copytext(message, 3)), " ", 1, 2)) {
			message = copytext(message, 2);
		}
	}
	if (!language) {
		language = (yield* this.get_default_language());
	}
	if (yield* this.handle_inherent_channels(message, message_mode, language)) {
		return f.dot;
	}
	if (!this.can_speak_vocal(message)) {
		to_chat(this, "<span class='warning'>You find yourself unable to speak!</span>");
		return f.dot;
	}
	let message_range: Value = 7;
	let succumbed: Value = 0;
	if (message_mode == "whisper") {
		message_range = 1;
		(spans = rt.modify(spans, "italics", rt.bitOr));
		log_whisper(`${this.name}/${this.key} : ${message}`);
		if (in_critical) {
			health_diff = round(100 + this.health);
			message_len = rt.length(message);
			message = Ellipsis((message = copytext(message, 1, health_diff) + `${message_len > health_diff ? "-.." : "..."}`), 10, 1);
			message_mode = "whispercrit";
			succumbed = 1;
		}
	} else {
		log_say(`${this.name}/${this.key} : ${message}`);
	}
	if (!(message = this.treat_message(message))) {
		return f.dot;
	}
	spans += this.get_spans();
	if (language) {
		(spans = rt.modify(spans, (L = rt.index(GLOB.language_datum_instances, language)).spans, rt.bitOr));
	}
	this.log_message(message, "Say log");
	if (rt.bitAnd((radio_return = (yield* this.radio(message, message_mode, spans, language))), 1)) {
		(spans = rt.modify(spans, "italics", rt.bitOr));
	}
	if (rt.bitAnd(radio_return, 2)) {
		message_range = 1;
	}
	let _T: Value = rt.getStep(f, this, 0);
	let environment: Value = _T.return_air();
	if ((pressure = environment ? environment.return_pressure() : 0) < 10) {
		message_range = 1;
	}
	if (pressure < 40.53) {
		(spans = rt.modify(spans, "italics", rt.bitOr));
	}
	yield* this.send_speech(message, message_range, this, bubble_type, spans, language, message_mode);
	if (succumbed) {
		yield* this.succumb(1);
		to_chat(this, (yield* this.compose_message(this, language, message, null, spans, message_mode)));
	}
	return 1;
}, true);

// say.dm:201
rt.def("/mob/living/proc/Hear", function* Hear(f: Frame, message: Value, speaker: Value, message_language: Value, raw_message: Value, radio_freq: Value, spans: Value, message_mode: Value) {
	let deaf_message: Value = null, deaf_type: Value = null;
	if (!this.client) {
		return f.dot;
	}
	if (speaker != this) {
		if (!radio_freq) {
			deaf_message = `<span class='name'>${speaker}</span> ${speaker.verb_say} something but you cannot hear them.`;
			deaf_type = 1;
		}
	} else {
		deaf_message = "<span class='notice'>You can't hear yourself!</span>";
		deaf_type = 2;
	}
	this.show_message((message = (yield* this.compose_message(speaker, message_language, raw_message, radio_freq, spans, message_mode))), 2, deaf_message, deaf_type);
	if (!radio_freq) {
		yield* this.show_runechat(speaker, message_language, raw_message, spans);
	}
	return message;
}, true);

// say.dm:223
rt.def("/mob/living/proc/send_speech", function* send_speech(f: Frame, message: Value, message_range: Value, source: Value, bubble_type: Value, spans: Value, message_language: Value, message_mode: Value) {
	let _M: Value = null, M: Value = null, eavesdropping: Value = null, eavesrendered: Value = null, _AM: Value = null, AM: Value = null;
	message_range ??= 6;
	source ??= this;
	bubble_type ??= this.bubble_icon;
	let eavesdrop_range: Value = 0;
	if (rt.index(GLOB.eavesdropping_modes, message_mode)) {
		eavesdrop_range = EAVESDROP_EXTRA_RANGE;
	}
	let listening: Value = get_hearers_in_view(message_range + eavesdrop_range, source);
	let the_dead: Value = list();
	for (_M of each(GLOB.player_list)) {
		if ((M = _M).stat != 2) {
			continue;
		}
		if (!M.client || !this.client) {
			continue;
		}
		if (get_dist(M, this) > 7 || M.z != this.z) {
			if (rt.index(GLOB.eavesdropping_modes, message_mode) && !rt.bitAnd(M.client.prefs.chat_toggles, 128)) {
				continue;
			}
			if (!rt.bitAnd(M.client.prefs.chat_toggles, 4)) {
				continue;
			}
		}
		(listening = rt.modify(listening, M, rt.bitOr));
		rt.setAt(the_dead, M, 1);
	}
	if (eavesdrop_range) {
		eavesdropping = stars(message);
		eavesrendered = (yield* this.compose_message(this, message_language, eavesdropping, null, spans, message_mode));
	}
	let rendered: Value = (yield* this.compose_message(this, message_language, message, null, spans, message_mode));
	for (_AM of each(listening)) {
		AM = _AM;
		if (eavesdrop_range && get_dist(source, AM) > message_range && !rt.index(the_dead, AM)) {
			yield* AM.Hear(eavesrendered, this, message_language, eavesdropping, null, spans, message_mode);
		} else {
			yield* AM.Hear(rendered, this, message_language, message, null, spans, message_mode);
		}
	}
	return f.dot;
}, true);

// say.dm:261
rt.def("/mob/living/proc/can_speak", function can_speak(f: Frame, message: Value) {
	if (!(this.can_speak_basic(message) && this.can_speak_vocal(message))) return f.dot;
	return 1;
});

// say.dm:266
rt.def("/mob/living/proc/can_speak_basic", function can_speak_basic(f: Frame, message: Value) {
	if (this.client) {
		if (rt.bitAnd(this.client.prefs.muted, 1)) {
			to_chat(this, "<span class='danger'>You cannot speak in IC (muted).</span>");
			return 0;
		}
		if (this.client.handle_spam_prevention(message, 1)) {
			return 0;
		}
	}
	return 1;
});

// say.dm:275
rt.def("/mob/living/proc/can_speak_vocal", function can_speak_vocal(f: Frame, message: Value) {
	if (rt.bitAnd(this.disabilities, 2)) {
		return 0;
	}
	if (this.is_muzzled()) {
		return 0;
	}
	if (!this.IsVocal()) {
		return 0;
	}
	return 1;
});

// say.dm:287
rt.def("/mob/living/proc/check_emote", function* check_emote(f: Frame, message: Value) {
	if (copytext(message, 1, 2) != "*") return f.dot;
	yield* this.emote(copytext(message, 2));
	return 1;
}, true);

// say.dm:292
rt.def("/mob/living/proc/get_message_mode", function get_message_mode(f: Frame, message: Value) {
	let key: Value = null;
	if ((key = copytext(message, 1, 2)) == ";") {
		return "headset";
	}
	if (key == "#") {
		return "whisper";
	}
	if (!(rt.length(message) > 2 && rt.isIn(f, key, GLOB.department_radio_prefixes))) return f.dot;
	let key_symbol: Value = lowertext(copytext(message, 2, 3));
	return rt.index(GLOB.department_radio_keys, key_symbol);
});

// say.dm:302
rt.def("/mob/living/proc/get_message_language", function get_message_language(f: Frame, message: Value) {
	let key: Value = null, ld: Value = null, LD: Value = null;
	if (copytext(message, 1, 2) == ",") {
		key = copytext(message, 2, 3);
		for (ld of each(GLOB.all_languages)) {
			if (rt.initial(f, (LD = ld), "key") == key) {
				return LD;
			}
		}
	}
	return null;
});

// say.dm:311
rt.def("/mob/living/proc/handle_inherent_channels", function* handle_inherent_channels(f: Frame, message: Value, message_mode: Value) {
	let msg: Value = null, _M: Value = null, M: Value = null, link: Value = null, C: Value = null, V: Value = null;
	let $e: any;
	if (message_mode == "changeling") {
		const lingcheck = this.lingcheck();
		if (lingcheck === 3) {
			msg = `<i><font color=#800040><b>${this.mind}:</b> ${message}</font></i>`;
			for (_M of each(GLOB.mob_list)) {
				if (rt.isIn(f, (M = _M), GLOB.dead_mob_list)) {
					link = fmt("<a href=?src=＃;follow=＃>(F)</a>", [M, this]);
					to_chat(M, `${link} ${msg}`);
				} else {
					const lingcheck_2 = M.lingcheck();
					if (lingcheck_2 === 3) {
						to_chat(M, msg);
					} else if (lingcheck_2 === 2) {
						to_chat(M, msg);
					} else if (lingcheck_2 === 1) {
						if (prob(40)) {
							to_chat(M, "<i><font color=#800080>We can faintly sense an outsider trying to communicate through the hivemind...</font></i>");
						}
					}
				}
			}
		} else if (lingcheck === 2) {
			msg = `<i><font color=#800080><b>${this.mind.changeling.changelingID}:</b> ${message}</font></i>`;
			log_say(`${this.mind.changeling.changelingID}/${this.key} : ${message}`);
			_M = null;
			for (_M of each(GLOB.mob_list)) {
				if (rt.isIn(f, (M = _M), GLOB.dead_mob_list)) {
					link = fmt("<a href=?src=＃;follow=＃>(F)</a>", [M, this]);
					to_chat(M, `${link} ${msg}`);
				} else {
					const lingcheck_2 = M.lingcheck();
					if (lingcheck_2 === 3) {
						to_chat(M, msg);
					} else if (lingcheck_2 === 2) {
						to_chat(M, msg);
					} else if (lingcheck_2 === 1) {
						if (prob(40)) {
							to_chat(M, "<i><font color=#800080>We can faintly sense another of our kind trying to communicate through the hivemind...</font></i>");
						}
					}
				}
			}
		} else if (lingcheck === 1) {
			to_chat(this, "<i><font color=#800080>Our senses have not evolved enough to be able to communicate this way...</font></i>");
		}
		return 1;
	}
	if (message_mode == "alientalk") {
		if (this.hivecheck()) {
			this.alien_talk(message);
		}
		return 1;
	}
	if (message_mode == "cords") {
		if (rt.istype(this, T("/mob/living/carbon"))) {
			C = this;
			if ((V = C.getorganslot("vocal_cords")) && V.can_speak_with()) {
				yield* V.handle_speech(message);
				yield* V.speak_with(message);
			}
		}
		return 1;
	}
	return 0;
}, true);

// say.dm:364
rt.def("/mob/living/proc/treat_message", function treat_message(f: Frame, message: Value) {
	if (this.getBrainLoss() >= 60) {
		message = derpspeech(message, this.stuttering);
	}
	if (this.stuttering) {
		message = stutter(message);
	}
	if (this.slurring) {
		message = slur(message);
	}
	if (this.cultslurring) {
		message = cultslur(message);
	}
	return (message = capitalize(message));
});

// say.dm:381
rt.def("/mob/living/proc/radio", function* radio(f: Frame, message: Value, message_mode: Value, spans: Value, language: Value) {
	let r_hand: Value = null, l_hand: Value = null, I: Value = null;
	let $e: any;
	if (message_mode === "right hand") {
		for (r_hand of each((yield* this.get_held_items_for_side("r", { all: 1 })), T("/obj/item"))) {
			if (r_hand) {
				return (yield* r_hand.talk_into(this, message, null, spans, language));
			}
			return 3;
		}
	} else if (message_mode === "left hand") {
		for (l_hand of each((yield* this.get_held_items_for_side("l", { all: ITALICS })), T("/obj/item"))) {
			if (l_hand) {
				return (yield* l_hand.talk_into(this, message, null, spans, language));
			}
			return 3;
		}
	} else if (message_mode === "intercom") {
		for (I of each(view(ITALICS, null), T("/obj/item/device/radio/intercom"))) {
			yield* I.talk_into(this, message, null, spans, language);
		}
		return 3;
	} else if (message_mode === "binary") {
		if (this.binarycheck()) {
			this.robot_talk(message);
		}
		return 3;
	}
	return 0;
}, true);

// say.dm:405
rt.def("/mob/living/proc/lingcheck", function lingcheck(f: Frame) {
	if (this.mind && this.mind.changeling) {
		if (this.mind.changeling.changeling_speak) {
			return 2;
		}
		return 1;
	}
	if (this.mind && this.mind.linglink) {
		return 3;
	}
	return 0;
});

// say.dm:414
rt.def("/mob/living/proc/say_mod", function say_mod(f: Frame, input: Value, message_mode: Value) {
	if (message_mode == "whisper") {
		f.dot = this.verb_whisper;
	} else if (message_mode == "whispercrit") {
		f.dot = `${this.verb_whisper} in ${this.p_their()} last breath`;
	} else if (this.stuttering) {
		f.dot = "stammers";
	} else if (this.getBrainLoss() >= 60) {
		f.dot = "gibbers";
	} else {
		f.dot = parent_proc();
	}
	return f.dot;
}, false);

// say.dm:426
rt.def("/mob/living/proc/whisper", function* whisper(f: Frame, message: Value, bubble_type: Value, spans: Value, sanitize: Value, language: Value) {
	spans ??= list();
	sanitize ??= 1;
	yield* this.say(`#${message}`, bubble_type, spans, sanitize, language);
	return f.dot;
}, true);

// say.dm:429
rt.def("/mob/living/proc/get_language_holder", function* get_language_holder(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = 1;
	}
	if (this.mind && f.args[0]) {
		f.dot = (yield* this.mind.get_language_holder());
		if (f.dot) {
			return f.dot;
		}
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true, { args: ["shadow"] });
