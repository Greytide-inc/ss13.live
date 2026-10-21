// From code/modules/mob/living/carbon/alien/larva/death.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/carbon/alien/larva/proc/death  (code/modules/mob/living/carbon/alien/larva/death.dm:2)  may sleep
rt.def("/mob/living/carbon/alien/larva/proc/death", function* death(f: Frame) {
	if (isEqual(rt.sv(f, "stat"), 2)) {
		return live(f.dot);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "update_icons");
	return f.dot;
}, true, { args: ["gibbed"] });

// /mob/living/carbon/alien/larva/proc/spawn_gibs  (code/modules/mob/living/carbon/alien/larva/death.dm:11)  may sleep
rt.def("/mob/living/carbon/alien/larva/proc/spawn_gibs", function* spawn_gibs(f: Frame, with_bodyparts: Value) {
	f.vars = () => [with_bodyparts];
	if (truthy(live(with_bodyparts))) {
		yield* g.new_(f, T("/obj/effect/gibspawner/larva"), [rt.sv(f, "loc"), rt.sv(f, "viruses")]);
	} else {
		yield* g.new_(f, T("/obj/effect/gibspawner/larvabodypartless"), [rt.sv(f, "loc"), rt.sv(f, "viruses")]);
	}
	return f.dot;
}, true);

// /mob/living/carbon/alien/larva/proc/gib_animation  (code/modules/mob/living/carbon/alien/larva/death.dm:16)  may sleep
rt.def("/mob/living/carbon/alien/larva/proc/gib_animation", function* gib_animation(f: Frame) {
	yield* g.new_(f, T("/obj/effect/temp_visual/gib_animation"), [rt.sv(f, "loc"), "gibbed-l"]);
	return f.dot;
}, true);

// /mob/living/carbon/alien/larva/proc/spawn_dust  (code/modules/mob/living/carbon/alien/larva/death.dm:19)  may sleep
rt.def("/mob/living/carbon/alien/larva/proc/spawn_dust", function* spawn_dust(f: Frame) {
	yield* g.new_(f, T("/obj/effect/decal/remains/xeno"), [rt.sv(f, "loc")]);
	return f.dot;
}, true);

// /mob/living/carbon/alien/larva/proc/dust_animation  (code/modules/mob/living/carbon/alien/larva/death.dm:22)  may sleep
rt.def("/mob/living/carbon/alien/larva/proc/dust_animation", function* dust_animation(f: Frame) {
	yield* g.new_(f, T("/obj/effect/temp_visual/dust_animation"), [rt.sv(f, "loc"), "dust-l"]);
	return f.dot;
}, true);
