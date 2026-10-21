// From code/modules/mob/living/carbon/say.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/carbon/proc/treat_message  (code/modules/mob/living/carbon/say.dm:2)
rt.def("/mob/living/carbon/proc/treat_message", function treat_message(f: Frame, message: Value) {
	let _T: Value = null, tongueless_lower: Value = null, tongueless_upper: Value = null;
	f.vars = () => [message, _T, tongueless_lower, tongueless_upper];
	message = rt.callSuper(f, [live(message)]);
	if (!truthy((_T = rt.callSrc(f, "getorganslot", ["tongue"])))) {
		tongueless_lower = rt.new_(f, T("/regex"), ["[gdntke]+", "g"]);
		tongueless_upper = rt.new_(f, T("/regex"), ["[GDNTKE]+", "g"]);
		if (!isEqual(rt.call(f, P("/proc/copytext"), null, [live(message), 1, 2]), "*")) {
			message = rt.callName(f, live(tongueless_lower), "Replace", [live(message), rt.op(f, "PickUnweighted", [3], ["aa", "oo", "'"])]);
			message = rt.callName(f, live(tongueless_upper), "Replace", [live(message), rt.op(f, "PickUnweighted", [3], ["AA", "OO", "'"])]);
		}
	} else {
		message = rt.callName(f, live(_T), "TongueSpeech", [live(message)]);
	}
	if (truthy(rt.sv(f, "wear_mask"))) {
		message = rt.callName(f, rt.sv(f, "wear_mask"), "speechModification", [live(message)]);
	}
	return live(message);
});

// /mob/living/carbon/proc/can_speak_vocal  (code/modules/mob/living/carbon/say.dm:20)
rt.def("/mob/living/carbon/proc/can_speak_vocal", function can_speak_vocal(f: Frame) {
	if (truthy(rt.sv(f, "silent"))) {
		return 0;
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["message"] });

// /mob/living/carbon/proc/get_spans  (code/modules/mob/living/carbon/say.dm:23)
rt.def("/mob/living/carbon/proc/get_spans", function get_spans(f: Frame) {
	let _T: Value = null, I: Value = null;
	f.vars = () => [_T, I];
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (truthy((_T = rt.callSrc(f, "getorganslot", ["tongue"])))) {
		(f.dot = rt.modify(live(f.dot), rt.callName(f, live(_T), "get_spans", []), rt.bitOr));
	}
	if (!truthy((I = rt.callSrc(f, "get_active_held_item", [])))) return f.dot;
	(f.dot = rt.modify(live(f.dot), rt.callName(f, live(I), "get_held_item_speechspans", [live(f.src)]), rt.bitOr));
	return f.dot;
});

// /mob/living/carbon/proc/could_speak_in_language  (code/modules/mob/living/carbon/say.dm:33)
rt.def("/mob/living/carbon/proc/could_speak_in_language", function could_speak_in_language(f: Frame, dt: Value) {
	let _T: Value = null;
	f.vars = () => [_T];
	if (truthy((_T = rt.callSrc(f, "getorganslot", ["tongue"])))) {
		f.dot = rt.callName(f, live(_T), "could_speak_in_language", [live(dt)]);
	} else {
		f.dot = rt.bitAnd(rt.initial(f, live(dt), "flags"), 2);
	}
	return f.dot;
});
