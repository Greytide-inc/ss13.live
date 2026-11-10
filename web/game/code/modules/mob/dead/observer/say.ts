// Based on /tg/station's code/modules/mob/dead/observer/say.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


// say.dm:2
rt.def("/mob/dead/observer/proc/say", function* say(f: Frame, message: Value) {
	if (!(message = trim(copytext(sanitize(message), 1, 1024)))) {
		return f.dot;
	}
	log_say(`Ghost/${this.key} : ${message}`);
	f.dot = (yield* this.say_dead(message));
	return f.dot;
}, true);

// say.dm:12
rt.def("/mob/dead/observer/proc/Hear", function* Hear(f: Frame, message: Value, speaker: Value, message_language: Value, raw_message: Value, radio_freq: Value, spans: Value, message_mode: Value) {
	let V: Value = null, S: Value = null;
	let to_follow: Value = speaker;
	if (radio_freq) {
		if (rt.istype((V = speaker).source, T("/mob/living/silicon/ai"))) {
			to_follow = (S = V.source).eyeobj;
		} else {
			to_follow = V.source;
		}
	}
	let link: Value = fmt("<a href=?src=＃;follow=＃>(F)</a>", [this, to_follow]);
	message = (yield* this.compose_message(speaker, message_language, raw_message, radio_freq, spans, message_mode));
	to_chat(this, `${link} ${message}`);
	return f.dot;
}, true);
