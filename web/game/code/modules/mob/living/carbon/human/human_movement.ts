// Based on /tg/station's code/modules/mob/living/carbon/human/human_movement.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// human_movement.dm:3
rt.def("/mob/living/carbon/human/proc/movement_delay", function* movement_delay(f: Frame) {
	f.dot = 0;
	f.dot += (yield* parent_proc());
	f.dot += GLOB.config.human_delay;
	f.dot += (yield* this.dna.species.movement_delay(this));
	return f.dot;
}, true);

// human_movement.dm:8
rt.def("/mob/living/carbon/human/proc/slip", function* slip(f: Frame, knockdown_amount: Value, O: Value, lube: Value) {
	if (rt.istype(this.shoes, T("/obj")) && rt.bitAnd(this.shoes.flags, NOSLIP) && !rt.bitAnd(lube, GALOSHES_DONT_HELP)) {
		return 0;
	}
	return (yield* parent_proc());
}, true);

// human_movement.dm:13
rt.def("/mob/living/carbon/human/proc/experience_pressure_difference", function experience_pressure_difference(f: Frame) {
	playsound(this, rt.rsc("sound/effects/space_wind.ogg"), 50, 1);
	if (this.shoes && rt.bitAnd(this.shoes.flags, NOSLIP)) {
		return 0;
	}
	return parent_proc();
}, false, { waitfor: false });

// human_movement.dm:19
rt.def("/mob/living/carbon/human/proc/mob_has_gravity", function mob_has_gravity(f: Frame) {
	f.dot = parent_proc();
	if (f.dot) return f.dot;
	if (!this.mob_negates_gravity()) return f.dot;
	f.dot = 1;
	return f.dot;
});

// human_movement.dm:25
rt.def("/mob/living/carbon/human/proc/mob_negates_gravity", function mob_negates_gravity(f: Frame) {
	return ((this.shoes && this.shoes.negates_gravity()) || this.dna.species.negates_gravity(this));
});

// human_movement.dm:28
rt.def("/mob/living/carbon/human/proc/Move", function* Move(f: Frame, NewLoc: Value, direct: Value) {
	let HM: Value = null, oldFP: Value = null, FP: Value = null;
	f.dot = (yield* parent_proc());
	for (HM of each(this.dna.mutations, T("/datum/mutation/human"))) {
		HM.on_move(this, NewLoc);
	}
	if (!this.shoes) return f.dot;
	if (!(!this.lying && !this.buckled)) return f.dot;
	if (this.loc != NewLoc) return f.dot;
	if (!this.has_gravity(this.loc)) {
		return f.dot;
	}
	let S: Value = this.shoes;
	let _T: Value = rt.getStep(f, this, 0);
	if (S.bloody_shoes && rt.index(S.bloody_shoes, S.blood_state)) {
		if ((oldFP = rt.locateIn(f, T("/obj/effect/decal/cleanable/blood/footprints"), _T)) && oldFP.blood_state == S.blood_state) {
			return f.dot;
		} else {
			rt.setAt(S.bloody_shoes, S.blood_state, max(0, rt.index(S.bloody_shoes, S.blood_state) - BLOOD_LOSS_PER_STEP));
			(FP = (yield* new_(T("/obj/effect/decal/cleanable/blood/footprints"), _T))).blood_state = S.blood_state;
			(rt.modField(f, FP, "entered_dirs", this.dir, rt.bitOr));
			FP.bloodiness = rt.index(S.bloody_shoes, S.blood_state);
			if (S.blood_DNA && rt.len(f, S.blood_DNA)) {
				FP.transfer_blood_dna(S.blood_DNA);
			}
			yield* FP.update_icon();
			this.update_inv_shoes();
		}
	}
	yield* S.step_action();
	return f.dot;
}, true);

// human_movement.dm:60
rt.def("/mob/living/carbon/human/proc/Moved", function* Moved(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!(this.buckled_mobs && rt.len(f, this.buckled_mobs) && this.riding_datum)) return f.dot;
	yield* this.riding_datum.on_vehicle_move();
	return f.dot;
}, true);

// human_movement.dm:65
rt.def("/mob/living/carbon/human/proc/Process_Spacemove", function* Process_Spacemove(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = 0;
	}
	if (yield* parent_proc()) {
		return 1;
	}
	return this.dna.species.space_move(this);
}, true, { args: ["movement_dir"] });
