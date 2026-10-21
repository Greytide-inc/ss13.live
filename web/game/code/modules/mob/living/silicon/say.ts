// From code/modules/mob/living/silicon/say.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/silicon/proc/get_spans  (code/modules/mob/living/silicon/say.dm:3)
rt.def("/mob/living/silicon/proc/get_spans", function get_spans(f: Frame) {
	return rt.bitOr(rt.callSuper(f, [], rt.Args.Same), "robot");
});

// /mob/living/proc/robot_talk  (code/modules/mob/living/silicon/say.dm:6)
rt.def("/mob/living/proc/robot_talk", function robot_talk(f: Frame, message: Value) {
	let desig: Value = null, S: Value = null, message_a: Value = null, rendered: Value = null, M: Value = null, renderedAI: Value = null, following: Value = null, ai: Value = null, link: Value = null;
	let $e: any;
	f.vars = () => [desig, S, message_a, rendered, M, renderedAI, following, ai, link, $e];
	rt.call(f, P("/proc/log_say"), null, [fmt("＀ : ＀", [rt.call(f, P("/proc/key_name"), null, [live(f.src)]), live(message)])]);
	rt.callSrc(f, "log_message", [live(message), "Say log"]);
	desig = "Default Cyborg";
	if (truthy((rt.istype(live(f.src), T("/mob/living/silicon")) ? 1 : 0))) {
		desig = rt.call(f, P("/proc/trim_left"), null, [add(add(rt.gv(f, "designation", (S = live(f.src))), " "), rt.fv(f, "job", live(S)))]);
	}
	message_a = rt.callSrc(f, "say_quote", [live(message), rt.callSrc(f, "get_spans", [])]);
	rendered = fmt("<i><span class='game say'>Robotic Talk, <span class='name'>＀</span> <span class='message'>＀</span></span></i>", [rt.sv(f, "name"), live(message_a)]);
	M = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (truthy(rt.callName(f, live(M), "binarycheck", []))) {
			if (truthy((rt.istype(live(M), T("/mob/living/silicon/ai")) ? 1 : 0))) {
				renderedAI = fmt("<i><span class='game say'>Robotic Talk, <a href='?src=＃;track=＀'><span class='name'>＀ (＀)</span></a> <span class='message'>＀</span></span></i>", [live(M), rt.call(f, P("/proc/html_encode"), null, [rt.sv(f, "name")]), rt.sv(f, "name"), live(desig), live(message_a)]);
				rt.call(f, P("/proc/to_chat"), null, [live(M), live(renderedAI)]);
			} else {
				rt.call(f, P("/proc/to_chat"), null, [live(M), live(rendered)]);
			}
		}
		if (truthy((rt.istype(live(M), T("/mob/dead/observer")) ? 1 : 0))) {
			following = live(f.src);
			if (truthy((rt.istype(live(f.src), T("/mob/living/silicon/ai")) ? 1 : 0))) {
				following = rt.gv(f, "eyeobj", (ai = live(f.src)));
			}
			link = fmt("<a href=?src=＃;follow=＃>(F)</a>", [live(M), live(following)]);
			rt.call(f, P("/proc/to_chat"), null, [live(M), fmt("＀ ＀", [live(link), live(rendered)])]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /mob/living/silicon/proc/radio  (code/modules/mob/living/silicon/say.dm:38)  may sleep
rt.def("/mob/living/silicon/proc/radio", function* radio(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!isEqual(live(f.dot), 0)) {
		return live(f.dot);
	}
	if (isEqual(live(f.args[1]), "robot")) {
		if (truthy(rt.sv(f, "radio"))) {
			yield* g.callName(f, rt.sv(f, "radio"), "talk_into", [live(f.src), live(f.args[0]), null, live(f.args[2]), live(f.args[3])]);
		}
		return 2;
	} else {
		if (truthy((rt.isIn(f, live(f.args[1]), rt.gl("radiochannels")) ? 1 : 0))) {
			if (truthy(rt.sv(f, "radio"))) {
				yield* g.callName(f, rt.sv(f, "radio"), "talk_into", [live(f.src), live(f.args[0]), live(f.args[1]), live(f.args[2]), live(f.args[3])]);
				return 3;
			}
		}
	}
	return 0;
}, true, { args: ["message", "message_mode", "spans", "language"] });

// /mob/living/silicon/proc/get_message_mode  (code/modules/mob/living/silicon/say.dm:55)
rt.def("/mob/living/silicon/proc/get_message_mode", function get_message_mode(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (isEqual(rt.callSuper(f, [], rt.Args.Same), "headset")) {
		return "robot";
	}
	return live(f.dot);
}, false, { args: ["message"] });

// /mob/living/silicon/proc/handle_inherent_channels  (code/modules/mob/living/silicon/say.dm:62)  may sleep
rt.def("/mob/living/silicon/proc/handle_inherent_channels", function* handle_inherent_channels(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(live(f.dot))) {
		return live(f.dot);
	}
	if (isEqual(live(f.args[1]), "binary")) {
		if (truthy((yield* g.srcCall(f, "binarycheck")))) {
			yield* g.srcCall(f, "robot_talk", live(f.args[0]));
		}
		return 1;
	}
	return 0;
}, true, { args: ["message", "message_mode"] });
