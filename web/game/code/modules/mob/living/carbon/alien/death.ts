// From code/modules/mob/living/carbon/alien/death.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/carbon/alien/proc/spawn_gibs  (code/modules/mob/living/carbon/alien/death.dm:3)  may sleep
rt.def("/mob/living/carbon/alien/proc/spawn_gibs", function* spawn_gibs(f: Frame, with_bodyparts: Value) {
	f.vars = () => [with_bodyparts];
	if (truthy(live(with_bodyparts))) {
		yield* g.new_(f, T("/obj/effect/gibspawner/xeno"), [rt.sv(f, "loc"), rt.sv(f, "viruses")]);
	} else {
		yield* g.new_(f, T("/obj/effect/gibspawner/xenobodypartless"), [rt.sv(f, "loc"), rt.sv(f, "viruses")]);
	}
	return f.dot;
}, true);

// /mob/living/carbon/alien/proc/gib_animation  (code/modules/mob/living/carbon/alien/death.dm:8)  may sleep
rt.def("/mob/living/carbon/alien/proc/gib_animation", function* gib_animation(f: Frame) {
	yield* g.new_(f, T("/obj/effect/temp_visual/gib_animation"), [rt.sv(f, "loc"), "gibbed-a"]);
	return f.dot;
}, true);

// /mob/living/carbon/alien/proc/spawn_dust  (code/modules/mob/living/carbon/alien/death.dm:11)  may sleep
rt.def("/mob/living/carbon/alien/proc/spawn_dust", function* spawn_dust(f: Frame) {
	yield* g.new_(f, T("/obj/effect/decal/remains/xeno"), [rt.sv(f, "loc")]);
	return f.dot;
}, true);

// /mob/living/carbon/alien/proc/dust_animation  (code/modules/mob/living/carbon/alien/death.dm:14)  may sleep
rt.def("/mob/living/carbon/alien/proc/dust_animation", function* dust_animation(f: Frame) {
	yield* g.new_(f, T("/obj/effect/temp_visual/dust_animation"), [rt.sv(f, "loc"), "dust-a"]);
	return f.dot;
}, true);
