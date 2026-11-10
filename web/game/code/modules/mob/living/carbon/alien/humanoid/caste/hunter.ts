// Based on /tg/station's code/modules/mob/living/carbon/alien/humanoid/caste/hunter.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(4829, "/mob/living/carbon/alien/humanoid/hunter", "/mob/living/carbon/alien/humanoid", {
	leap_icon: null,
	caste: "h",
	name: "alien hunter",
	maxHealth: 125,
	health: 125,
	icon_state: "alienh",
});

// hunter.dm:10
rt.def("/mob/living/carbon/alien/humanoid/hunter/proc/create_internal_organs", function* create_internal_organs(f: Frame) {
	this.internal_organs += (yield* new_(T("/obj/item/organ/alien/plasmavessel/small")));
	yield* parent_proc();
	return f.dot;
}, true);

// hunter.dm:15
rt.def("/mob/living/carbon/alien/humanoid/hunter/proc/movement_delay", function movement_delay(f: Frame) {
	f.dot = -1;
	f.dot += parent_proc();
	return f.dot;
});

// hunter.dm:21
rt.def("/mob/living/carbon/alien/humanoid/hunter/proc/toggle_leap", function* toggle_leap(f: Frame, message: Value) {
	message ??= 1;
	this.leap_on_click = (!this.leap_on_click ? 1 : 0);
	let $0: any = this.leap_icon;
	$0.icon_state = `leap_${this.leap_on_click ? "on" : "off"}`;
	yield* this.update_icons();
	if (message) {
		to_chat(this, `<span class='noticealien'>You will now ${this.leap_on_click ? "leap at" : "slash at"} enemies!</span>`);
	} else {
		return f.dot;
	}
	return f.dot;
}, true);

// hunter.dm:31
rt.def("/mob/living/carbon/alien/humanoid/hunter/proc/ClickOn", function* ClickOn(f: Frame, A: Value, params: Value) {
	yield* this.face_atom(A);
	if (this.leap_on_click) {
		yield* this.leap_at(A);
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// hunter.dm:41
rt.def("/mob/living/carbon/alien/humanoid/hunter/proc/leap_at", function* leap_at(f: Frame, A: Value) {
	if (this.pounce_cooldown > rt.worldTime(f)) {
		to_chat(this, "<span class='alertalien'>You are too fatigued to pounce right now!</span>");
		return f.dot;
	}
	if (this.leaping || this.stat || this.buckled || this.lying) {
		return f.dot;
	}
	if (!this.has_gravity() || !A.has_gravity()) {
		to_chat(this, "<span class='alertalien'>It is unsafe to leap without gravity!</span>");
		return f.dot;
	} else {
		this.leaping = 1;
		this.weather_immunities += "lava";
		yield* this.update_icons();
		yield* this.throw_at(A, 7, 1, { spin: 0, diagonals_first: 1, callback: (yield* new_(T("/datum/callback"), this, P("/mob/living/carbon/alien/humanoid/hunter/proc/leap_end"))) });
	}
	return f.dot;
}, true);

// hunter.dm:61
rt.def("/mob/living/carbon/alien/humanoid/hunter/proc/leap_end", function* leap_end(f: Frame) {
	this.leaping = 0;
	this.weather_immunities -= "lava";
	yield* this.update_icons();
	return f.dot;
}, true);

// hunter.dm:66
rt.def("/mob/living/carbon/alien/humanoid/hunter/proc/throw_impact", function* throw_impact(f: Frame, A: Value) {
	let L: Value = null, blocked: Value = null, H: Value = null;
	if (!this.leaping) {
		return (yield* parent_proc());
	}
	if (!A) return f.dot;
	if (rt.istype(A, T("/mob/living"))) {
		L = A;
		blocked = 0;
		if (rt.istype(A, T("/mob/living/carbon/human"))) {
			if (yield* (H = A).check_shields(0, `the ${this.name}`, this, { attack_type: 5 })) {
				blocked = 1;
			}
		}
		if (!blocked) {
			L.visible_message(`<span class ='danger'>${this} pounces on ${L}!</span>`, `<span class ='userdanger'>${this} pounces on you!</span>`);
			yield* L.Knockdown(100);
			yield* sleep(2);
			yield* step_towards(this, L);
		} else {
			yield* this.Knockdown(40, 1, 1);
		}
		yield* this.toggle_leap(0);
		this.pounce_cooldown = rt.worldTime(f) + this.pounce_cooldown_time;
	} else if (A.density && !(yield* A.CanPass(this))) {
		this.visible_message(`<span class ='danger'>${this} smashes into ${A}!</span>`, `<span class ='alertalien'>${this} smashes into ${A}!</span>`);
		yield* this.Knockdown(40, 1, 1);
	}
	if (!this.leaping) return f.dot;
	this.leaping = 0;
	yield* this.update_icons();
	yield* this.update_canmove();
	return f.dot;
}, true, { waitfor: false });

// hunter.dm:100
rt.def("/mob/living/carbon/alien/humanoid/proc/float", function* float(f: Frame, on: Value) {
	if (this.leaping) {
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);
