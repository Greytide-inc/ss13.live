// Based on /tg/station's code/modules/mob/living/silicon/say.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


// say.dm:3
rt.def("/mob/living/silicon/proc/get_spans", function get_spans(f: Frame) {
	return rt.bitOr(parent_proc(), "robot");
});

// say.dm:6
rt.def("/mob/living/proc/robot_talk", function robot_talk(f: Frame, message: Value) {
	let S: Value = null, M: Value = null, renderedAI: Value = null, following: Value = null, ai: Value = null, link: Value = null;
	log_say(`${key_name(this)} : ${message}`);
	this.log_message(message, "Say log");
	let desig: Value = "Default Cyborg";
	if (rt.istype(this, T("/mob/living/silicon"))) {
		desig = trim_left((S = this).designation + " " + S.job);
	}
	let message_a: Value = this.say_quote(message, this.get_spans());
	let rendered: Value = `<i><span class='game say'>Robotic Talk, <span class='name'>${this.name}</span> <span class='message'>${message_a}</span></span></i>`;
	for (M of each(GLOB.player_list, T("/mob"))) {
		if (M.binarycheck()) {
			if (rt.istype(M, T("/mob/living/silicon/ai"))) {
				renderedAI = fmt("<i><span class='game say'>Robotic Talk, <a href='?src=＃;track=＀'><span class='name'>＀ (＀)</span></a> <span class='message'>＀</span></span></i>", [M, html_encode(this.name), this.name, desig, message_a]);
				to_chat(M, renderedAI);
			} else {
				to_chat(M, rendered);
			}
		}
		if (rt.istype(M, T("/mob/dead/observer"))) {
			following = this;
			if (rt.istype(this, T("/mob/living/silicon/ai"))) {
				following = (ai = this).eyeobj;
			}
			link = fmt("<a href=?src=＃;follow=＃>(F)</a>", [M, following]);
			to_chat(M, `${link} ${rendered}`);
		}
	}
	return f.dot;
});

// say.dm:38
rt.def("/mob/living/silicon/proc/radio", function* radio(f: Frame, message: Value, message_mode: Value, spans: Value, language: Value) {
	f.dot = (yield* parent_proc());
	if (f.dot != 0) {
		return f.dot;
	}
	if (message_mode == "robot") {
		if (this.radio) {
			yield* this.radio.talk_into(this, message, null, spans, language);
		}
		return 2;
	} else if (rt.isIn(f, message_mode, GLOB.radiochannels)) {
		if (this.radio) {
			yield* this.radio.talk_into(this, message, message_mode, spans, language);
			return 3;
		}
	}
	return 0;
}, true);

// say.dm:55
rt.def("/mob/living/silicon/proc/get_message_mode", function get_message_mode(f: Frame, message: Value) {
	f.dot = parent_proc();
	if (parent_proc() == "headset") {
		return "robot";
	}
	return f.dot;
}, false);

// say.dm:62
rt.def("/mob/living/silicon/proc/handle_inherent_channels", function* handle_inherent_channels(f: Frame, message: Value, message_mode: Value) {
	f.dot = (yield* parent_proc());
	if (f.dot) {
		return f.dot;
	}
	if (message_mode == "binary") {
		if (this.binarycheck()) {
			this.robot_talk(message);
		}
		return 1;
	}
	return 0;
}, true);
