// Based on /tg/station's code/modules/mob/living/carbon/monkey/death.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// death.dm:2
rt.def("/mob/living/carbon/monkey/proc/gib_animation", function* gib_animation(f: Frame) {
	yield* new_(T("/obj/effect/temp_visual/gib_animation"), this.loc, "gibbed-m");
	return f.dot;
}, true);

// death.dm:5
rt.def("/mob/living/carbon/monkey/proc/dust_animation", function* dust_animation(f: Frame) {
	yield* new_(T("/obj/effect/temp_visual/dust_animation"), this.loc, "dust-m");
	return f.dot;
}, true);
