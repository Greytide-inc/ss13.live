// Based on /tg/station's code/modules/mob/living/simple_animal/guardian/types/charger.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(4874, "/mob/living/simple_animal/hostile/guardian/charger", "/mob/living/simple_animal/hostile/guardian", {
	charging: 0,
	chargealert: null,
	playstyle_string: "<span class='holoparasite'>As a <b>charger</b> type you do medium damage, have medium damage resistance, move very fast, and can charge at a location, damaging any target hit and forcing them to drop any items they are holding.</span>",
	magic_fluff_string: "<span class='holoparasite'>..And draw the Hunter, an alien master of rapid assault.</span>",
	tech_fluff_string: "<span class='holoparasite'>Boot sequence complete. Charge modules loaded. Holoparasite swarm online.</span>",
	carp_fluff_string: "<span class='holoparasite'>CARP CARP CARP! Caught one! It's a charger carp, that likes running at people. But it doesn't have any legs...</span>",
	melee_damage_lower: 15,
	melee_damage_upper: 15,
	ranged: 1,
	ranged_message: "charges",
	ranged_cooldown_time: 40,
	speed: -1,
	damage_coeff: null,
});

// charger.dm:9
rt.def("/mob/living/simple_animal/hostile/guardian/charger/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.damage_coeff = rt.alist(f, ["brute", 0.6, "fire", 0.6, "tox", 0.6, "clone", 0.6, "stamina", 0, "oxy", 0.6]);
	return f.dot;
});

// charger.dm:18
rt.def("/mob/living/simple_animal/hostile/guardian/charger/proc/Life", function* Life(f: Frame) {
	f.dot = (yield* parent_proc());
	if (this.ranged_cooldown <= rt.worldTime(f)) {
		if (!this.chargealert) {
			this.chargealert = (yield* this.throw_alert("charge", T("/obj/screen/alert/cancharge")));
		}
	} else {
		yield* this.clear_alert("charge");
		this.chargealert = null;
	}
	return f.dot;
}, true, { waitfor: false });

// charger.dm:27
rt.def("/mob/living/simple_animal/hostile/guardian/charger/proc/OpenFire", function* OpenFire(f: Frame, A: Value) {
	if (this.charging) return f.dot;
	this.visible_message(`<span class='danger'><b>${this}</b> ${this.ranged_message} at ${A}!</span>`);
	this.ranged_cooldown = rt.worldTime(f) + this.ranged_cooldown_time;
	yield* this.clear_alert("charge");
	this.chargealert = null;
	yield* this.Shoot(A);
	return f.dot;
}, true);

// charger.dm:36
rt.def("/mob/living/simple_animal/hostile/guardian/charger/proc/Shoot", function* Shoot(f: Frame, targeted_atom: Value) {
	this.charging = 1;
	yield* this.throw_at(targeted_atom, this.range, 1, this, 0, { callback: (yield* new_(T("/datum/callback"), this, P("/mob/living/simple_animal/hostile/guardian/charger/proc/charging_end"))) });
	return f.dot;
}, true);

// charger.dm:43
rt.def("/mob/living/simple_animal/hostile/guardian/charger/proc/Move", function* Move(f: Frame) {
	if (this.charging) {
		yield* new_(T("/obj/effect/temp_visual/decoy/fading"), this.loc, this);
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// charger.dm:47
rt.def("/mob/living/simple_animal/hostile/guardian/charger/proc/snapback", function* snapback(f: Frame) {
	if (this.charging) return f.dot;
	yield* parent_proc();
	return f.dot;
}, true);

// charger.dm:51
rt.def("/mob/living/simple_animal/hostile/guardian/charger/proc/throw_impact", function* throw_impact(f: Frame, A: Value) {
	let L: Value = null, blocked: Value = null, H: Value = null;
	if (!this.charging) {
		return (yield* parent_proc());
	}
	if (!A) return f.dot;
	if (rt.istype(A, T("/mob/living")) && A != this.summoner) {
		L = A;
		blocked = 0;
		if (this.hasmatchingsummoner(A)) {
			blocked = 1;
		}
		if (rt.istype(A, T("/mob/living/carbon/human"))) {
			if (yield* (H = A).check_shields(this, 90, `${this.name}`, { attack_type: 4 })) {
				blocked = 1;
			}
		}
		if (!blocked) {
			yield* L.drop_all_held_items();
			L.visible_message(`<span class='danger'>${this} slams into ${L}!</span>`, `<span class='userdanger'>${this} slams into you!</span>`);
			yield* L.apply_damage(20, "brute");
			playsound(rt.getStep(f, L, 0), rt.rsc("sound/effects/meteorimpact.ogg"), 100, 1);
			shake_camera(L, 4, 3);
			shake_camera(this, 2, 3);
		}
	}
	this.charging = 0;
	return f.dot;
}, true, { waitfor: false });
