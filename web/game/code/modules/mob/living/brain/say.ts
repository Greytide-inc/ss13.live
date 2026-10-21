// From code/modules/mob/living/brain/say.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/brain/proc/say  (code/modules/mob/living/brain/say.dm:2)  may sleep
rt.def("/mob/living/brain/proc/say", function* say(f: Frame) {
	if (!(truthy(rt.sv(f, "container")) && truthy((rt.istype(rt.sv(f, "container"), T("/obj/item/device/mmi")) ? 1 : 0)))) {
		return live(f.dot);
	} else {
		if (truthy(rt.op(f, "Prob", [], [multiply(rt.sv(f, "emp_damage"), 4)]))) {
			if (truthy(rt.op(f, "Prob", [], [10]))) {
				return live(f.dot);
			} else {
				f.args[0] = (yield* g.call(f, P("/proc/Gibberish"), null, [live(f.args[0]), multiply(rt.sv(f, "emp_damage"), 6)]));
			}
		}
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["message", "language"] });

// /mob/living/brain/proc/get_spans  (code/modules/mob/living/brain/say.dm:14)
rt.def("/mob/living/brain/proc/get_spans", function get_spans(f: Frame) {
	return rt.bitOr(rt.callSuper(f, [], rt.Args.Same), "robot");
});

// /mob/living/brain/proc/radio  (code/modules/mob/living/brain/say.dm:17)  may sleep
rt.def("/mob/living/brain/proc/radio", function* radio(f: Frame, message: Value, message_mode: Value, spans: Value, language: Value) {
	let R: Value = null;
	f.vars = () => [message, message_mode, spans, language, R];
	if (!(truthy(live(message_mode)) && truthy((rt.istype(rt.sv(f, "container"), T("/obj/item/device/mmi")) ? 1 : 0)))) return f.dot;
	if (!truthy(rt.gv(f, "radio", (R = rt.sv(f, "container"))))) return f.dot;
	yield* g.callName(f, rt.fv(f, "radio", live(R)), "talk_into", [live(f.src), live(message), null, (yield* g.srcCall(f, "get_spans")), live(language)]);
	return 3;
}, true);

// /mob/living/brain/proc/treat_message  (code/modules/mob/living/brain/say.dm:27)
rt.def("/mob/living/brain/proc/treat_message", function treat_message(f: Frame, message: Value) {
	f.vars = () => [message];
	return (message = rt.call(f, P("/proc/capitalize"), null, [live(message)]));
});

// /mob/living/brain/proc/could_speak_in_language  (code/modules/mob/living/brain/say.dm:31)
rt.def("/mob/living/brain/proc/could_speak_in_language", function could_speak_in_language(f: Frame) {
	if (truthy((rt.istype(rt.sv(f, "container"), T("/obj/item/device/mmi/posibrain/soul_vessel")) ? 1 : 0))) {
		f.dot = rt.call(f, P("/proc/ispath"), null, [live(f.args[0]), T("/datum/language/ratvar")]);
	} else {
		f.dot = rt.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, false, { args: ["dt"] });
