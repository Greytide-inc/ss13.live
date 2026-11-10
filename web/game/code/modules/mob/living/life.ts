// Based on /tg/station's code/modules/mob/living/life.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// life.dm:6
rt.def("/mob/living/proc/Life", function* Life(f: Frame, seconds: Value, times_fired: Value) {
	let E: Value = null;
	let $e: any;
	if (this.digitalinvis) {
		this.handle_diginvis();
	}
	if (this.notransform) {
		return f.dot;
	}
	if (!this.loc) {
		if (this.client) {
			rt.forList(f, 0, GLOB.landmarks_list, T("/obj/effect/landmark/error"));
			if (($e = rt.next(f, 0)) !== undefined) {
				E = $e;
				this.loc = E.loc;
			}
			rt.endFor(f, 0);
			message_admins(`${key_name_admin(this)} was found to have no .loc with an attached client, if the cause is unknown it would be wise to ask how this was accomplished.`);
			log_game(`${key_name(this)} was found to have no .loc with an attached client.`);
		} else {
			return f.dot;
		}
	}
	let environment: Value = this.loc.return_air();
	if (this.stat != 2) {
		yield* this.handle_breathing(times_fired);
	}
	if (this.stat != 2) {
		yield* this.handle_mutations_and_radiation();
	}
	if (this.stat != 2) {
		yield* this.handle_chemicals_in_body();
	}
	if (this.stat != 2) {
		yield* this.handle_random_events();
	}
	if (environment) {
		yield* this.handle_environment(environment);
	}
	yield* this.handle_fire();
	yield* this.handle_stomach();
	yield* this.update_gravity(this.mob_has_gravity());
	if (this.machine) {
		yield* this.machine.check_eye(this);
	}
	if (this.stat != 2) {
		yield* this.handle_disabilities();
	}
	if (this.stat != 2) {
		yield* this.handle_status_effects();
	}
	if (this.stat == 2) return f.dot;
	return 1;
}, true, { waitfor: false });

// life.dm:67
rt.def("/mob/living/proc/handle_diginvis", function handle_diginvis(f: Frame) {
	let AI: Value = null;
	if (!this.digitaldisguise) {
		this.digitaldisguise = image({ loc: this });
	}
	this.digitaldisguise.override = 1;
	for (AI of each(GLOB.player_list, T("/mob/living/silicon/ai"))) {
		(rt.modField(f, AI.client, "images", this.digitaldisguise, rt.bitOr));
	}
	return f.dot;
});

// life.dm:81
rt.def("/mob/living/proc/handle_fire", function* handle_fire(f: Frame) {
	let G: Value = null, location: Value = null;
	if (this.fire_stacks < 0) {
		this.fire_stacks = min(0, this.fire_stacks + 1);
	}
	if (!this.on_fire) {
		return 1;
	}
	if (this.fire_stacks > 0) {
		yield* this.adjust_fire_stacks(-0.1);
	} else {
		yield* this.ExtinguishMob();
		return f.dot;
	}
	if (!rt.index((G = this.loc.return_air()).gases, "o2") || rt.index(rt.index(G.gases, "o2"), 1) < 1) {
		yield* this.ExtinguishMob();
		return f.dot;
	}
	yield* (location = rt.getStep(f, this, 0)).hotspot_expose(700, 50, 1);
	return f.dot;
}, true);

// life.dm:103
rt.def("/mob/living/proc/handle_status_effects", function handle_status_effects(f: Frame) {
	if (!this.confused) return f.dot;
	this.confused = max(0, this.confused - 1);
	return f.dot;
});

// life.dm:108
rt.def("/mob/living/proc/handle_disabilities", function* handle_disabilities(f: Frame) {
	if (this.eye_blind) {
		if (!this.stat && !rt.bitAnd(this.disabilities, 1)) {
			this.eye_blind = max(this.eye_blind - 1, 0);
			if (this.client && !this.eye_blind) {
				yield* this.clear_alert("blind");
				yield* this.clear_fullscreen("blind");
			}
		} else {
			this.eye_blind = max(this.eye_blind - 1, 1);
		}
	} else {
		if (!this.eye_blurry) return f.dot;
		this.eye_blurry = max(this.eye_blurry - 1, 0);
		if (!(this.client && !this.eye_blurry)) return f.dot;
		yield* this.clear_fullscreen("blurry");
	}
	return f.dot;
}, true);
