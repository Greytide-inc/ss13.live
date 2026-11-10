// Based on /tg/station's code/modules/mob/living/carbon/carbon_movement.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// carbon_movement.dm:3
rt.def("/mob/living/carbon/proc/movement_delay", function movement_delay(f: Frame) {
	let FP: Value = null, C: Value = null, F: Value = null;
	if (rt.istype(this, T("/mob/living/carbon"))) {
		C = this;
		if (rt.istype((F = C.get_flightpack()), T("/obj/item/device/flightpack")) && F.flight) {
			FP = 1;
		}
	}
	f.dot = parent_proc(FP);
	if (!FP) {
		f.dot += this.grab_state * 1;
	} else {
		f.dot += this.grab_state * 3;
	}
	if (this.get_leg_ignore()) return f.dot;
	let leg_amount: Value = this.get_num_legs();
	f.dot += 6 - 3 * leg_amount;
	if (!leg_amount) {
		f.dot += 6 - 3 * this.get_num_arms();
	}
	if (!this.legcuffed) return f.dot;
	f.dot += this.legcuffed.slowdown;
	return f.dot;
});

// carbon_movement.dm:23
rt.def("/mob/living/carbon/proc/slip", function* slip(f: Frame, knockdown_amount: Value, O: Value, lube: Value) {
	if (rt.bitAnd(this.movement_type, 2)) {
		return 0;
	}
	if (!rt.bitAnd(lube, SLIDE_ICE)) {
		add_logs(this, null, "slipped", null, `on ${O ? O.name : "floor"}`);
	}
	return (yield* this.loc.handle_slip(this, knockdown_amount, O, lube));
}, true);

// carbon_movement.dm:31
rt.def("/mob/living/carbon/proc/Process_Spacemove", function* Process_Spacemove(f: Frame) {
	let F: Value = null, _T: Value = null, J: Value = null;
	if (f.args[0] === null) {
		f.args[0] = 0;
	}
	if (yield* parent_proc()) {
		return 1;
	}
	if (!isturf(this.loc)) {
		return 0;
	}
	if (rt.istype((F = this.get_flightpack()), T("/obj/item/device/flightpack")) && F.flight && (yield* F.allow_thrust(0.01, this))) {
		return 1;
	}
	if (rt.istype((_T = this.getorganslot("thrusters")), T("/obj/item/organ/cyberimp/chest/thrusters")) && f.args[0] && (yield* _T.allow_thrust(0.01))) {
		return 1;
	}
	if (!(rt.istype((J = this.get_jetpack()), T("/obj/item/weapon/tank/jetpack")) && (f.args[0] || J.stabilizers) && (yield* J.allow_thrust(0.01, this)))) return f.dot;
	return 1;
}, true, { args: ["movement_dir"] });

// carbon_movement.dm:50
rt.def("/mob/living/carbon/proc/Move", function* Move(f: Frame, NewLoc: Value, direct: Value) {
	f.dot = (yield* parent_proc());
	if (!(f.dot && this.mob_has_gravity())) return f.dot;
	if (this.dna && this.dna.species && rt.isIn(f, NOHUNGER, this.dna.species.species_traits)) {
		this.nutrition = 349;
	} else if (this.nutrition && this.stat != 2) {
		this.nutrition -= 0.01;
		if (this.m_intent == "run") {
			this.nutrition -= 0.01;
		}
	}
	if (!(rt.bitAnd(this.disabilities, 32) && this.m_intent == "run" && this.bodytemperature <= 360)) return f.dot;
	this.bodytemperature += 2;
	return f.dot;
}, true);

// carbon_movement.dm:62
rt.def("/mob/living/carbon/proc/Moved", function* Moved(f: Frame, oldLoc: Value, Dir: Value) {
	let O: Value = null;
	f.dot = (yield* parent_proc());
	for (O of each(this.internal_organs, T("/obj"))) {
		yield* O.on_mob_move(this.dir, this, oldLoc);
	}
	return f.dot;
}, true);

// carbon_movement.dm:67
rt.def("/mob/living/carbon/proc/setDir", function* setDir(f: Frame, newdir: Value) {
	let O: Value = null;
	f.dot = (yield* parent_proc());
	for (O of each(this.internal_organs, T("/obj"))) {
		yield* O.on_mob_turn(newdir, this);
	}
	return f.dot;
}, true);
