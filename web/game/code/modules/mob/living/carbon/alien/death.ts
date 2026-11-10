// Based on /tg/station's code/modules/mob/living/carbon/alien/death.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// death.dm:3
rt.def("/mob/living/carbon/alien/proc/spawn_gibs", function* spawn_gibs(f: Frame, with_bodyparts: Value) {
	if (with_bodyparts) {
		yield* new_(T("/obj/effect/gibspawner/xeno"), this.loc, this.viruses);
	} else {
		yield* new_(T("/obj/effect/gibspawner/xenobodypartless"), this.loc, this.viruses);
	}
	return f.dot;
}, true);

// death.dm:8
rt.def("/mob/living/carbon/alien/proc/gib_animation", function* gib_animation(f: Frame) {
	yield* new_(T("/obj/effect/temp_visual/gib_animation"), this.loc, "gibbed-a");
	return f.dot;
}, true);

// death.dm:11
rt.def("/mob/living/carbon/alien/proc/spawn_dust", function* spawn_dust(f: Frame) {
	yield* new_(T("/obj/effect/decal/remains/xeno"), this.loc);
	return f.dot;
}, true);

// death.dm:14
rt.def("/mob/living/carbon/alien/proc/dust_animation", function* dust_animation(f: Frame) {
	yield* new_(T("/obj/effect/temp_visual/dust_animation"), this.loc, "dust-a");
	return f.dot;
}, true);
