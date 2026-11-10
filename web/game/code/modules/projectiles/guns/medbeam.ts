// Based on /tg/station's code/modules/projectiles/guns/medbeam.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(5279, "/obj/item/weapon/gun/medbeam", "/obj/item/weapon/gun", {
	current_target: null,
	last_check: 0,
	check_delay: 10,
	max_range: 8,
	active: 0,
	current_beam: null,
	mounted: 0,
	weapon_weight: 2,
	name: "Medical Beamgun",
	desc: "Don't cross the streams!",
	icon: rt.rsc("icons/obj/chronos.dmi"),
	icon_state: "chronogun",
	item_state: "chronogun",
	w_class: 3,
});

// medbeam.dm:20
rt.def("/obj/item/weapon/gun/medbeam/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSobj.processing += this;
	return f.dot;
}, true);

// medbeam.dm:24
rt.def("/obj/item/weapon/gun/medbeam/proc/Destroy", function* Destroy(f: Frame, user: Value) {
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	yield* this.LoseTarget();
	return (yield* parent_proc());
}, true);

// medbeam.dm:29
rt.def("/obj/item/weapon/gun/medbeam/proc/dropped", function* dropped(f: Frame, user: Value) {
	yield* parent_proc();
	yield* this.LoseTarget();
	return f.dot;
}, true);

// medbeam.dm:33
rt.def("/obj/item/weapon/gun/medbeam/proc/equipped", function* equipped(f: Frame, user: Value) {
	yield* parent_proc();
	yield* this.LoseTarget();
	return f.dot;
}, true);

// medbeam.dm:38
rt.def("/obj/item/weapon/gun/medbeam/proc/LoseTarget", function* LoseTarget(f: Frame) {
	if (this.active) {
		yield* qdel(this.current_beam);
		this.current_beam = null;
		this.active = 0;
		this.on_beam_release(this.current_target);
	}
	this.current_target = null;
	return f.dot;
}, true);

// medbeam.dm:45
rt.def("/obj/item/weapon/gun/medbeam/proc/process_fire", function* process_fire(f: Frame, target: Value, user: Value, message: Value, params: Value, zone_override: Value) {
	message ??= 1;
	if (rt.istype(user, T("/mob/living"))) {
		yield* this.add_fingerprint(user);
	}
	if (this.current_target) {
		yield* this.LoseTarget();
	}
	if (!rt.istype(target, T("/mob/living"))) {
		return f.dot;
	}
	this.current_target = target;
	this.active = 1;
	this.current_beam = (yield* new_(T("/datum/beam"), user, this.current_target, { time: 6000, beam_icon_state: "medbeam", btype: T("/obj/effect/ebeam/medical") }));
	yield* ImmediateInvokeAsync(this.current_beam, P("/datum/beam/proc/Start"));
	return f.dot;
}, true);

// medbeam.dm:62
rt.def("/obj/item/weapon/gun/medbeam/proc/process", function* process(f: Frame) {
	let source: Value = this.loc;
	if (!this.mounted && !rt.istype(source, T("/mob/living"))) {
		yield* this.LoseTarget();
		return f.dot;
	}
	if (!this.current_target) {
		yield* this.LoseTarget();
		return f.dot;
	}
	if (rt.worldTime(f) <= this.last_check + this.check_delay) {
		return f.dot;
	}
	this.last_check = rt.worldTime(f);
	if (get_dist(source, this.current_target) > this.max_range || !(yield* this.los_check(source, this.current_target))) {
		yield* this.LoseTarget();
		if (rt.istype(source, T("/mob/living"))) {
			to_chat(source, "<span class='warning'>You lose control of the beam!</span>");
		}
		return f.dot;
	}
	if (!this.current_target) return f.dot;
	yield* this.on_beam_tick(this.current_target);
	return f.dot;
}, true, { waitfor: false });

// medbeam.dm:88
rt.def("/obj/item/weapon/gun/medbeam/proc/los_check", function* los_check(f: Frame, user: Value, target: Value) {
	let dummy: Value = null, turf: Value = null, AM: Value = null, B: Value = null;
	let user_turf: Value = user.loc;
	if (this.mounted) {
		user_turf = rt.getStep(f, user, 0);
	} else if (!rt.istype(user_turf, T("/turf"))) {
		return 0;
	}
	(rt.modField(f, (dummy = (yield* new_(T("/obj"), user_turf))), "pass_flags", 7, rt.bitOr));
	for (turf of each(getline(user_turf, target), T("/turf"))) {
		if (this.mounted && turf == user_turf) {
			continue;
		}
		if (turf.density) {
			yield* qdel(dummy);
			return 0;
		}
		AM = null;
		for (AM of each(turf, T("/atom/movable"))) {
			if (!(yield* AM.CanPass(dummy, turf, 1))) {
				yield* qdel(dummy);
				return 0;
			}
		}
		B = null;
		for (B of each(turf, T("/obj/effect/ebeam/medical"))) {
			if (B.owner != this.current_beam) {
				yield* explosion(B.loc, 0, 3, 5, 8);
				yield* qdel(dummy);
				return 0;
			}
		}
	}
	yield* qdel(dummy);
	return 1;
}, true);

// medbeam.dm:115
rt.def("/obj/item/weapon/gun/medbeam/proc/on_beam_tick", function* on_beam_tick(f: Frame, target: Value) {
	if (target.health != target.maxHealth) {
		yield* new_(T("/obj/effect/temp_visual/heal"), rt.getStep(f, target, 0), "#80F5FF");
	}
	yield* target.adjustBruteLoss(-4);
	yield* target.adjustFireLoss(-4);
	return f.dot;
}, true);

rt.type(5280, "/obj/item/weapon/gun/medbeam/mech", "/obj/item/weapon/gun/medbeam", {
	mounted: 1,
});

// medbeam.dm:132
rt.def("/obj/item/weapon/gun/medbeam/mech/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	return f.dot;
}, true);
