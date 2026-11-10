// Based on /tg/station's code/modules/mob/living/carbon/alien/larva/death.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// death.dm:2
rt.def("/mob/living/carbon/alien/larva/proc/death", function* death(f: Frame, gibbed: Value) {
	if (this.stat == 2) {
		return f.dot;
	}
	f.dot = (yield* parent_proc());
	yield* this.update_icons();
	return f.dot;
}, true);

// death.dm:11
rt.def("/mob/living/carbon/alien/larva/proc/spawn_gibs", function* spawn_gibs(f: Frame, with_bodyparts: Value) {
	if (with_bodyparts) {
		yield* new_(T("/obj/effect/gibspawner/larva"), this.loc, this.viruses);
	} else {
		yield* new_(T("/obj/effect/gibspawner/larvabodypartless"), this.loc, this.viruses);
	}
	return f.dot;
}, true);

// death.dm:16
rt.def("/mob/living/carbon/alien/larva/proc/gib_animation", function* gib_animation(f: Frame) {
	yield* new_(T("/obj/effect/temp_visual/gib_animation"), this.loc, "gibbed-l");
	return f.dot;
}, true);

// death.dm:19
rt.def("/mob/living/carbon/alien/larva/proc/spawn_dust", function* spawn_dust(f: Frame) {
	yield* new_(T("/obj/effect/decal/remains/xeno"), this.loc);
	return f.dot;
}, true);

// death.dm:22
rt.def("/mob/living/carbon/alien/larva/proc/dust_animation", function* dust_animation(f: Frame) {
	yield* new_(T("/obj/effect/temp_visual/dust_animation"), this.loc, "dust-l");
	return f.dot;
}, true);
