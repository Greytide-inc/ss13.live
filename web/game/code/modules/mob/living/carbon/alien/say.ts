// From code/modules/mob/living/carbon/alien/say.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/proc/alien_talk  (code/modules/mob/living/carbon/alien/say.dm:2)
rt.def("/mob/living/proc/alien_talk", function alien_talk(f: Frame, message: Value, shown_name: Value) {
	let message_a: Value = null, rendered: Value = null, S: Value = null, link: Value = null;
	let $e: any;
	f.vars = () => [message, shown_name, message_a, rendered, S, link, $e];
	if (live(shown_name) === null) {
		shown_name = rt.sv(f, "real_name");
	}
	rt.call(f, P("/proc/log_say"), null, [fmt("＀ : ＀", [rt.call(f, P("/proc/key_name"), null, [live(f.src)]), live(message)])]);
	if (!truthy((message = rt.call(f, P("/proc/trim"), null, [live(message)])))) {
		return live(f.dot);
	}
	message_a = rt.callSrc(f, "say_quote", [live(message), rt.callSrc(f, "get_spans", [])]);
	rendered = fmt("<i><span class='alien'>Hivemind, <span class='name'>＀</span> <span class='message'>＀</span></span></i>", [live(shown_name), live(message_a)]);
	S = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		if ((!truthy(rt.fv(f, "stat", live(S))) && truthy(rt.callName(f, live(S), "hivecheck", [])))) {
			rt.call(f, P("/proc/to_chat"), null, [live(S), live(rendered)]);
		}
		if (truthy((rt.isIn(f, live(S), rt.gl("dead_mob_list")) ? 1 : 0))) {
			link = fmt("<a href=?src=＃;follow=＃>(F)</a>", [live(S), live(f.src)]);
			rt.call(f, P("/proc/to_chat"), null, [live(S), fmt("＀ ＀", [live(link), live(rendered)])]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /mob/living/carbon/alien/humanoid/royal/queen/proc/alien_talk  (code/modules/mob/living/carbon/alien/say.dm:16)
rt.def("/mob/living/carbon/alien/humanoid/royal/queen/proc/alien_talk", function alien_talk(f: Frame, message: Value, shown_name: Value) {
	f.vars = () => [shown_name];
	if (live(shown_name) === null) {
		shown_name = rt.sv(f, "name");
	}
	shown_name = fmt("<FONT size = 3>＀</FONT>", [live(shown_name)]);
	rt.callSuper(f, [live(message), live(shown_name)]);
	return f.dot;
});

// /mob/living/carbon/proc/hivecheck  (code/modules/mob/living/carbon/alien/say.dm:20)
rt.def("/mob/living/carbon/proc/hivecheck", function hivecheck(f: Frame) {
	let N: Value = null;
	f.vars = () => [N];
	if (!(truthy((N = rt.callSrc(f, "getorgan", [T("/obj/item/organ/alien/hivenode")]))) && !truthy(rt.fv(f, "recent_queen_death", live(N))))) return f.dot;
	return live(N);
});
