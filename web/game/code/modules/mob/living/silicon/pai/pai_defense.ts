// Based on /tg/station's code/modules/mob/living/silicon/pai/pai_defense.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// pai_defense.dm:6
rt.def("/mob/living/silicon/pai/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	yield* this.take_holo_damage(50 / severity);
	yield* this.Knockdown(400 / severity);
	this.silent = max(30 / severity, this.silent);
	if (!this.holoform) return f.dot;
	yield* this.fold_in({ force: 1 });
	return f.dot;
}, true);

// pai_defense.dm:14
rt.def("/mob/living/silicon/pai/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	yield* this.take_holo_damage(severity * 50);
	if (severity === 1) {
		yield* qdel(this.card);
		yield* qdel(this);
	} else if (severity === 2) {
		yield* this.fold_in({ force: 1 });
		yield* this.Knockdown(400);
	} else if (severity === 3) {
		yield* this.fold_in({ force: 1 });
		yield* this.Knockdown(200);
	}
	return f.dot;
}, true, { waitfor: false });

// pai_defense.dm:27
rt.def("/mob/living/silicon/pai/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (user.a_intent === "help") {
		this.visible_message(`<span class='notice'>${user} gently pats ${this} on the head, eliciting an off-putting buzzing from its holographic field.</span>`);
	} else if (user.a_intent === "disarm") {
		this.visible_message(`<span class='notice'>${user} boops ${this} on the head!</span>`);
	} else if (user.a_intent === "harm") {
		yield* user.do_attack_animation(this);
		if (user.name == this.master) {
			this.visible_message(`<span class='notice'>Responding to its master's touch, ${this} disengages its holochassis emitter, rapidly losing coherence.</span>`);
			rt.spawnTail(f, 10, "/mob/living/silicon/pai/proc/attack_hand: spawn at modules/mob/living/silicon/pai/pai_defense.dm:36", user);
		} else {
			this.visible_message(`<span class='danger'>${user} stomps on ${this}!.</span>`);
			yield* this.take_holo_damage(2);
		}
	}
	return f.dot;
}, true);

// a spawn(10) body of /mob/living/silicon/pai/proc/attack_hand, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/silicon/pai/proc/attack_hand: spawn at modules/mob/living/silicon/pai/pai_defense.dm:36", function* (f: Frame, user: Value) {
	yield* this.fold_in();
	if (yield* user.put_in_hands(this.card)) {
		user.visible_message(`<span class='notice'>${user} promptly scoops up their pAI's card.</span>`);
	}
	return null;
});

// pai_defense.dm:45
rt.def("/mob/living/silicon/pai/proc/bullet_act", function* bullet_act(f: Frame, Proj: Value) {
	if (Proj.stun) {
		yield* this.fold_in({ force: 1 });
		this.visible_message(`<span class='warning'>The electrically-charged projectile disrupts ${this}'s holomatrix, forcing ${this} to fold in!</span>`);
	}
	f.dot = (yield* parent_proc(Proj));
	return f.dot;
}, true);

// pai_defense.dm:51
rt.def("/mob/living/silicon/pai/proc/stripPanelUnequip", function stripPanelUnequip(f: Frame, what: Value, who: Value, where: Value) {
	to_chat(this, "<span class='warning'>Your holochassis stutters and warps intensely as you attempt to interact with the object, forcing you to cease lest the field fail.</span>");
	return f.dot;
});

// pai_defense.dm:54
rt.def("/mob/living/silicon/pai/proc/stripPanelEquip", function stripPanelEquip(f: Frame, what: Value, who: Value, where: Value) {
	to_chat(this, "<span class='warning'>Your holochassis stutters and warps intensely as you attempt to interact with the object, forcing you to cease lest the field fail.</span>");
	return f.dot;
});

// pai_defense.dm:60
rt.def("/mob/living/silicon/pai/proc/take_holo_damage", function* take_holo_damage(f: Frame, amount: Value) {
	this.emitterhealth = max(-50, min(this.emitterhealth - amount, this.emittermaxhealth));
	if (this.emitterhealth < 0) {
		yield* this.fold_in({ force: 1 });
	}
	to_chat(this, "<span class='userdanger'>The impact degrades your holochassis!</span>");
	this.hit_slowdown += amount;
	return amount;
}, true);

// pai_defense.dm:68
rt.def("/mob/living/silicon/pai/proc/adjustBruteLoss", function* adjustBruteLoss(f: Frame, amount: Value, updating_health: Value, forced: Value) {
	updating_health ??= 1;
	forced ??= 0;
	return (yield* this.take_holo_damage(amount));
}, true);

// pai_defense.dm:71
rt.def("/mob/living/silicon/pai/proc/adjustFireLoss", function* adjustFireLoss(f: Frame, amount: Value, updating_health: Value, forced: Value) {
	updating_health ??= 1;
	forced ??= 0;
	return (yield* this.take_holo_damage(amount));
}, true);

// pai_defense.dm:83
rt.def("/mob/living/silicon/pai/proc/adjustStaminaLoss", function* adjustStaminaLoss(f: Frame, amount: Value) {
	yield* this.take_holo_damage(rt.bitAnd(amount, 0.25));
	return f.dot;
}, true);

// pai_defense.dm:86
rt.def("/mob/living/silicon/pai/proc/adjustBrainLoss", function* adjustBrainLoss(f: Frame, amount: Value) {
	yield* this.Knockdown(amount * 0.2);
	return f.dot;
}, true);

// pai_defense.dm:89
rt.def("/mob/living/silicon/pai/proc/getBruteLoss", function getBruteLoss(f: Frame) {
	return this.emittermaxhealth - this.emitterhealth;
});

// pai_defense.dm:92
rt.def("/mob/living/silicon/pai/proc/getFireLoss", function getFireLoss(f: Frame) {
	return this.emittermaxhealth - this.emitterhealth;
});
