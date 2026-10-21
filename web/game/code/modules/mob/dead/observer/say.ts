// From code/modules/mob/dead/observer/say.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/dead/observer/proc/say  (code/modules/mob/dead/observer/say.dm:2)  may sleep
rt.def("/mob/dead/observer/proc/say", function* say(f: Frame, message: Value) {
	f.vars = () => [message];
	if (!truthy((message = (yield* g.call(f, P("/proc/trim"), null, [(yield* g.call(f, P("/proc/copytext"), null, [(yield* g.call(f, P("/proc/sanitize"), null, [live(message)])), 1, 1024]))]))))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/log_say"), null, [fmt("Ghost/＀ : ＀", [rt.fv(f, "key", live(f.src)), live(message)])]);
	f.dot = (yield* g.callName(f, live(f.src), "say_dead", [live(message)]));
	return f.dot;
}, true);

// /mob/dead/observer/proc/Hear  (code/modules/mob/dead/observer/say.dm:12)  may sleep
rt.def("/mob/dead/observer/proc/Hear", function* Hear(f: Frame, message: Value, speaker: Value, message_language: Value, raw_message: Value, radio_freq: Value, spans: Value, message_mode: Value) {
	let to_follow: Value = null, V: Value = null, S: Value = null, link: Value = null;
	f.vars = () => [message, speaker, message_language, raw_message, radio_freq, spans, message_mode, to_follow, V, S, link];
	to_follow = live(speaker);
	if (truthy(live(radio_freq))) {
		if (truthy((rt.istype(rt.gv(f, "source", (V = live(speaker))), T("/mob/living/silicon/ai")) ? 1 : 0))) {
			to_follow = rt.gv(f, "eyeobj", (S = rt.fv(f, "source", live(V))));
		} else {
			to_follow = rt.fv(f, "source", live(V));
		}
	}
	link = fmt("<a href=?src=＃;follow=＃>(F)</a>", [live(f.src), live(to_follow)]);
	message = (yield* g.srcCall(f, "compose_message", live(speaker), live(message_language), live(raw_message), live(radio_freq), live(spans), live(message_mode)));
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("＀ ＀", [live(link), live(message)])]);
	return f.dot;
}, true);
