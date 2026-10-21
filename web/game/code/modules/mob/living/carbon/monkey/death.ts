// From code/modules/mob/living/carbon/monkey/death.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/carbon/monkey/proc/gib_animation  (code/modules/mob/living/carbon/monkey/death.dm:2)  may sleep
rt.def("/mob/living/carbon/monkey/proc/gib_animation", function* gib_animation(f: Frame) {
	yield* g.new_(f, T("/obj/effect/temp_visual/gib_animation"), [rt.sv(f, "loc"), "gibbed-m"]);
	return f.dot;
}, true);

// /mob/living/carbon/monkey/proc/dust_animation  (code/modules/mob/living/carbon/monkey/death.dm:5)  may sleep
rt.def("/mob/living/carbon/monkey/proc/dust_animation", function* dust_animation(f: Frame) {
	yield* g.new_(f, T("/obj/effect/temp_visual/dust_animation"), [rt.sv(f, "loc"), "dust-m"]);
	return f.dot;
}, true);
