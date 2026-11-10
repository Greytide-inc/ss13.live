// Based on /tg/station's code/modules/mob/living/silicon/silicon_defense.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// silicon_defense.dm:9
rt.def("/mob/living/silicon/proc/attack_alien", function* attack_alien(f: Frame, M: Value) {
	if (!(yield* parent_proc())) return f.dot;
	let damage: Value = 20;
	if (prob(90)) {
		add_logs(M, this, "attacked");
		playsound(this.loc, rt.rsc("sound/weapons/slash.ogg"), 25, 1, -1);
		this.visible_message(`<span class='danger'>${M} has slashed at ${this}!</span>`, `<span class='userdanger'>${M} has slashed at ${this}!</span>`);
		if (prob(8)) {
			yield* this.flash_act({ affect_silicon: 1 });
		}
		add_logs(M, this, "attacked");
		yield* this.adjustBruteLoss(damage);
		yield* this.updatehealth();
	} else {
		playsound(this.loc, rt.rsc("sound/weapons/slashmiss.ogg"), 25, 1, -1);
		this.visible_message(`<span class='danger'>${M} took a swipe at ${this}!</span>`, `<span class='userdanger'>${M} took a swipe at ${this}!</span>`);
	}
	return f.dot;
}, true);

// silicon_defense.dm:27
rt.def("/mob/living/silicon/proc/attack_animal", function* attack_animal(f: Frame, M: Value) {
	let damage: Value = null, N: Value = null;
	let $e: any;
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	if (prob((damage = rand(M.melee_damage_lower, M.melee_damage_upper)))) {
		for (N of each(this.buckled_mobs, T("/mob/living"))) {
			yield* N.Knockdown(20);
			yield* this.unbuckle_mob(N);
			N.visible_message(`<span class='boldwarning'>${N} is knocked off of ${this} by ${M}!</span>`);
		}
	}
	if (M.melee_damage_type === "brute") {
		yield* this.adjustBruteLoss(damage);
	} else if (M.melee_damage_type === "fire") {
		yield* this.adjustFireLoss(damage);
	} else if (M.melee_damage_type === "tox") {
		yield* this.adjustToxLoss(damage);
	} else if (M.melee_damage_type === "oxy") {
		yield* this.adjustOxyLoss(damage);
	} else if (M.melee_damage_type === "clone") {
		yield* this.adjustCloneLoss(damage);
	} else if (M.melee_damage_type === "stamina") {
		yield* this.adjustStaminaLoss(damage);
	}
	return f.dot;
}, true);

// silicon_defense.dm:50
rt.def("/mob/living/silicon/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	return (yield* this.attack_hand(user));
}, true);

// silicon_defense.dm:53
rt.def("/mob/living/silicon/proc/attack_larva", function attack_larva(f: Frame, L: Value) {
	if (L.a_intent != "help") return f.dot;
	this.visible_message(`${L.name} rubs its head against ${this}.`);
	return f.dot;
});

// silicon_defense.dm:57
rt.def("/mob/living/silicon/proc/attack_hulk", function* attack_hulk(f: Frame, user: Value, does_attack_animation: Value) {
	does_attack_animation ??= 0;
	if (user.a_intent == "harm") {
		yield* parent_proc(user, 1);
		yield* this.adjustBruteLoss(rand(10, 15));
		playsound(this.loc, "punch", 25, 1, -1);
		this.visible_message(`<span class='danger'>${user} has punched ${this}!</span>`, `<span class='userdanger'>${user} has punched ${this}!</span>`);
		return 1;
	}
	return 0;
}, true);

// silicon_defense.dm:67
rt.def("/mob/living/silicon/proc/attack_hand", function* attack_hand(f: Frame, M: Value) {
	if (M.a_intent === "help") {
		M.visible_message(`${M} pets ${this}.`, `<span class='notice'>You pet ${this}.</span>`);
	} else if (M.a_intent === "grab") {
		yield* this.grabbedby(M);
	} else {
		yield* M.do_attack_animation(this, "punch");
		playsound(this.loc, rt.rsc("sound/effects/bang.ogg"), 10, 1);
		this.visible_message(`<span class='danger'>${M} punches ${this}, but doesn't leave a dent.</span>`, `<span class='warning'>${M} punches ${this}, but doesn't leave a dent.</span>`, null, 3);
	}
	return 0;
}, true);

// silicon_defense.dm:82
rt.def("/mob/living/silicon/proc/electrocute_act", function* electrocute_act(f: Frame, shock_damage: Value, source: Value, siemens_coeff: Value, safety: Value, tesla_shock: Value, illusion: Value, stun: Value) {
	let M: Value = null;
	siemens_coeff ??= 1;
	safety ??= 0;
	tesla_shock ??= 0;
	illusion ??= 0;
	stun ??= 1;
	if (this.buckled_mobs) {
		for (M of each(this.buckled_mobs, T("/mob/living"))) {
			yield* this.unbuckle_mob(M);
			yield* M.electrocute_act(shock_damage / 100, source, siemens_coeff, safety, tesla_shock, illusion, stun);
		}
	}
	return 0;
}, true);

// silicon_defense.dm:88
rt.def("/mob/living/silicon/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	let M: Value = null;
	let $e: any;
	if (severity === 1) {
		yield* this.take_bodypart_damage(20);
	} else if (severity === 2) {
		yield* this.take_bodypart_damage(10);
	}
	to_chat(this, "<span class='userdanger'>*BZZZT*</span>");
	to_chat(this, "<span class='danger'>Warning: Electromagnetic pulse detected.</span>");
	for (M of each(this.buckled_mobs, T("/mob/living"))) {
		if (prob(severity * 50)) {
			yield* this.unbuckle_mob(M);
			yield* M.Knockdown(40);
			M.visible_message(`<span class='boldwarning'>${M} is thrown off of ${this}!</span>`);
		}
	}
	yield* this.flash_act({ affect_silicon: 1 });
	yield* parent_proc();
	return f.dot;
}, true);

// silicon_defense.dm:104
rt.def("/mob/living/silicon/proc/bullet_act", function* bullet_act(f: Frame, Proj: Value) {
	let M: Value = null;
	if (Proj.damage_type == "brute" || Proj.damage_type == "fire") {
		yield* this.adjustBruteLoss(Proj.damage);
		if (prob(Proj.damage * 1.5)) {
			for (M of each(this.buckled_mobs, T("/mob/living"))) {
				M.visible_message(`<span class='boldwarning'>${M} is knocked off of ${this}!</span>`);
				yield* this.unbuckle_mob(M);
				yield* M.Knockdown(40);
			}
		}
	}
	if (Proj.stun || Proj.knockdown) {
		M = null;
		for (M of each(this.buckled_mobs, T("/mob/living"))) {
			yield* this.unbuckle_mob(M);
			M.visible_message(`<span class='boldwarning'>${M} is knocked off of ${this} by the ${Proj}!</span>`);
		}
	}
	yield* Proj.on_hit(this);
	return 2;
}, true);

// silicon_defense.dm:120
rt.def("/mob/living/silicon/proc/flash_act", function* flash_act(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = 1;
	}
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (f.args[3] === null) {
		f.args[3] = 0;
	}
	if (f.args[4] === null) {
		f.args[4] = T("/obj/screen/fullscreen/flash/static");
	}
	if (!f.args[2]) return f.dot;
	return (yield* parent_proc());
}, true, { args: ["intensity", "override_blindness_check", "affect_silicon", "visual", "type"] });
