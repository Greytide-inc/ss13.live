// Based on /tg/station's code/modules/mob/living/carbon/human/death.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


// death.dm:2
rt.def("/mob/living/carbon/human/proc/gib_animation", function* gib_animation(f: Frame) {
	yield* new_(T("/obj/effect/temp_visual/gib_animation"), this.loc, "gibbed-h");
	return f.dot;
}, true);

// death.dm:5
rt.def("/mob/living/carbon/human/proc/dust_animation", function* dust_animation(f: Frame) {
	yield* new_(T("/obj/effect/temp_visual/dust_animation"), this.loc, "dust-h");
	return f.dot;
}, true);

// death.dm:9
rt.def("/mob/living/carbon/human/proc/spawn_gibs", function* spawn_gibs(f: Frame, with_bodyparts: Value) {
	if (with_bodyparts) {
		yield* new_(T("/obj/effect/gibspawner/human"), this.loc, this.viruses, this.dna);
	} else {
		yield* new_(T("/obj/effect/gibspawner/humanbodypartless"), this.loc, this.viruses, this.dna);
	}
	return f.dot;
}, true);

// death.dm:15
rt.def("/mob/living/carbon/human/proc/spawn_dust", function* spawn_dust(f: Frame, just_ash: Value) {
	just_ash ??= 0;
	if (just_ash) {
		yield* new_(T("/obj/effect/decal/cleanable/ash"), this.loc);
	} else {
		yield* new_(T("/obj/effect/decal/remains/human"), this.loc);
	}
	return f.dot;
}, true);

// death.dm:20
rt.def("/mob/living/carbon/human/proc/death", function* death(f: Frame, gibbed: Value) {
	let M: Value = null;
	if (this.stat == 2) {
		return f.dot;
	}
	f.dot = (yield* parent_proc());
	this.dizziness = 0;
	this.jitteriness = 0;
	if (rt.istype(this.loc, T("/obj/mecha"))) {
		if ((M = this.loc).occupant == this) {
			yield* M.go_out();
		}
	}
	yield* this.dna.species.spec_death(gibbed, this);
	if (!is_devil(this)) return f.dot;
	yield* ImmediateInvokeAsync(is_devil(this), P("/datum/antagonist/devil/proc/beginResurrectionCheck"), this);
	return f.dot;
}, true);

// death.dm:47
rt.def("/mob/living/carbon/proc/Drain", function* Drain(f: Frame) {
	yield* this.become_husk();
	(rt.modSrcVar(f, "disabilities", 128, rt.bitOr));
	this.blood_volume = 0;
	return 1;
}, true);
