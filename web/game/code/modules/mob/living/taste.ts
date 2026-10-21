// From code/modules/mob/living/taste.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/carbon/proc/get_taste_sensitivity  (code/modules/mob/living/taste.dm:11)
rt.def("/mob/living/carbon/proc/get_taste_sensitivity", function get_taste_sensitivity(f: Frame) {
	let tongue: Value = null;
	f.vars = () => [tongue];
	if (truthy((rt.istype((tongue = rt.callSrc(f, "getorganslot", ["tongue"])), T("/obj/item/organ/tongue")) ? 1 : 0))) {
		f.dot = rt.fv(f, "taste_sensitivity", live(tongue));
	} else {
		f.dot = 101;
	}
	return f.dot;
});

// /mob/living/proc/taste  (code/modules/mob/living/taste.dm:19)
rt.def("/mob/living/proc/taste", function taste(f: Frame, from: Value) {
	let taste_sensitivity: Value = null, text_output: Value = null;
	f.vars = () => [taste_sensitivity, text_output];
	if (!rt.lt(add(rt.sv(f, "last_taste_time"), 50), rt.worldTime(f))) return f.dot;
	taste_sensitivity = rt.callSrc(f, "get_taste_sensitivity", []);
	text_output = rt.callName(f, live(from), "generate_taste_message", [live(taste_sensitivity)]);
	if ((rt.gt(rt.sv(f, "hallucination"), 50) && truthy(rt.op(f, "Prob", [], [25])))) {
		text_output = rt.op(f, "PickUnweighted", [27], ["spiders", "dreams", "nightmares", "the future", "the past", "victory", "defeat", "pain", "bliss", "revenge", "poison", "time", "space", "death", "life", "truth", "lies", "justice", "memory", "regrets", "your soul", "suffering", "music", "noise", "blood", "hunger", "the american way"]);
	}
	if (!(!isEqual(live(text_output), rt.sv(f, "last_taste_text")) || rt.lt(add(rt.sv(f, "last_taste_time"), 100), rt.worldTime(f)))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='notice'>You can taste ＀.</span>", [live(text_output)])]);
	rt.setSv(f, "last_taste_time", rt.worldTime(f));
	rt.setSv(f, "last_taste_text", live(text_output));
	return f.dot;
});
