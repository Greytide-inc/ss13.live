// Based on /tg/station's code/modules/mob/living/simple_animal/slime/say.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// say.dm:2
rt.def("/mob/living/simple_animal/slime/proc/Hear", function* Hear(f: Frame, message: Value, speaker: Value, message_langs: Value, raw_message: Value, radio_freq: Value, spans: Value, message_mode: Value) {
	if (speaker != this && !radio_freq && !this.stat) {
		if (rt.isIn(f, speaker, this.Friends)) {
			this.speech_buffer = list();
			this.speech_buffer += speaker;
			this.speech_buffer += lowertext(html_decode(message));
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);
