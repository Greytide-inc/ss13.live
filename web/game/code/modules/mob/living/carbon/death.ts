// Based on /tg/station's code/modules/mob/living/carbon/death.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// death.dm:2
rt.def("/mob/living/carbon/proc/death", function* death(f: Frame, gibbed: Value) {
	if (this.stat == 2) {
		return f.dot;
	}
	this.silent = 0;
	this.losebreath = 0;
	if (!gibbed) {
		yield* this.emote("deathgasp");
	}
	f.dot = (yield* parent_proc());
	if (!(GLOB.SSticker && GLOB.SSticker.mode)) return f.dot;
	GLOB.SSticker.mode.check_win();
	return f.dot;
}, true);

// death.dm:16
rt.def("/mob/living/carbon/proc/gib", function* gib(f: Frame, no_brain: Value, no_organs: Value, no_bodyparts: Value) {
	let M: Value = null;
	for (M of each(this, T("/mob"))) {
		if (rt.isIn(f, M, this.stomach_contents)) {
			yield* this.stomach_contents.Remove(M);
		}
		yield* M.forceMove(this.loc);
		this.visible_message(`<span class='danger'>${M} bursts out of ${this}!</span>`);
	}
	yield* parent_proc();
	return f.dot;
}, true);

// death.dm:24
rt.def("/mob/living/carbon/proc/spill_organs", function* spill_organs(f: Frame, no_brain: Value, no_organs: Value, no_bodyparts: Value) {
	let X: Value = null, O: Value = null, org_zone: Value = null, I: Value = null;
	if (!no_bodyparts) {
		if (no_organs) {
			for (X of each(this.internal_organs)) {
				if (no_brain || !rt.istype(X, T("/obj/item/organ/brain"))) {
					yield* qdel(X);
				}
			}
		} else {
			X = null;
			for (X of each(this.internal_organs)) {
				O = X;
				if (no_brain && rt.istype(O, T("/obj/item/organ/brain"))) {
					yield* qdel(O);
					continue;
				}
				if ((org_zone = check_zone(O.zone)) == "chest") {
					yield* O.Remove(this);
					yield* O.forceMove(rt.getStep(f, this, 0));
					yield* O.throw_at(get_edge_target_turf(this, pick(GLOB.alldirs)), rand(1, 3), 5);
				}
			}
		}
	} else {
		X = null;
		for (X of each(this.internal_organs)) {
			I = X;
			if (no_brain && rt.istype(I, T("/obj/item/organ/brain"))) {
				yield* qdel(I);
				continue;
			}
			if (no_organs && !rt.istype(I, T("/obj/item/organ/brain"))) {
				yield* qdel(I);
				continue;
			}
			yield* I.Remove(this);
			yield* I.forceMove(rt.getStep(f, this, 0));
			yield* I.throw_at(get_edge_target_turf(this, pick(GLOB.alldirs)), rand(1, 3), 5);
		}
	}
	return f.dot;
}, true);

// death.dm:55
rt.def("/mob/living/carbon/proc/spread_bodyparts", function* spread_bodyparts(f: Frame) {
	let X: Value = null, BP: Value = null;
	for (X of each(this.bodyparts)) {
		yield* (BP = X).drop_limb();
		yield* BP.throw_at(get_edge_target_turf(this, pick(GLOB.alldirs)), rand(1, 3), 5);
	}
	return f.dot;
}, true);
