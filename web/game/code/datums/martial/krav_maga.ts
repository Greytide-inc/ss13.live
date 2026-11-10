// Based on /tg/station's code/datums/martial/krav_maga.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(570, "/datum/martial_art/krav_maga", "/datum/martial_art", {
	neckchop: null,
	legsweep: null,
	lungpunch: null,
	name: "Krav Maga",
});

// krav_maga.dm:3
rt.def("/datum/martial_art/krav_maga/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.neckchop = (yield* new_(T("/datum/action/neck_chop")));

	this.legsweep = (yield* new_(T("/datum/action/leg_sweep")));

	this.lungpunch = (yield* new_(T("/datum/action/lung_punch")));
	return f.dot;
}, true);

rt.type(258, "/datum/action/neck_chop", "/datum/action", {
	name: "Neck Chop - Injures the neck, stopping the victim from speaking for a while.",
	button_icon_state: "neckchop",
});

// krav_maga.dm:12
rt.def("/datum/action/neck_chop/proc/Trigger", function Trigger(f: Frame) {
	let H: Value = null;
	if (this.owner.incapacitated()) {
		to_chat(this.owner, "<span class='warning'>You can't use Krav Maga while you're incapacitated.</span>");
		return f.dot;
	}
	if ((H = this.owner).mind.martial_art.streak == "neck_chop") {
		this.owner.visible_message(`<span class='danger'>${this.owner} assumes a neutral stance.</span>`, "<b><i>Your next attack is cleared.</i></b>");
		H.mind.martial_art.streak = "";
	} else {
		this.owner.visible_message(`<span class='danger'>${this.owner} assumes the Neck Chop stance!</span>`, "<b><i>Your next attack will be a Neck Chop.</i></b>");
		H.mind.martial_art.streak = "neck_chop";
	}
	return f.dot;
});

rt.type(259, "/datum/action/leg_sweep", "/datum/action", {
	name: "Leg Sweep - Trips the victim, knocking them down for a brief moment.",
	button_icon_state: "legsweep",
});

// krav_maga.dm:28
rt.def("/datum/action/leg_sweep/proc/Trigger", function Trigger(f: Frame) {
	let H: Value = null;
	if (this.owner.incapacitated()) {
		to_chat(this.owner, "<span class='warning'>You can't use Krav Maga while you're incapacitated.</span>");
		return f.dot;
	}
	if ((H = this.owner).mind.martial_art.streak == "leg_sweep") {
		this.owner.visible_message(`<span class='danger'>${this.owner} assumes a neutral stance.</span>`, "<b><i>Your next attack is cleared.</i></b>");
		H.mind.martial_art.streak = "";
	} else {
		this.owner.visible_message(`<span class='danger'>${this.owner} assumes the Leg Sweep stance!</span>`, "<b><i>Your next attack will be a Leg Sweep.</i></b>");
		H.mind.martial_art.streak = "leg_sweep";
	}
	return f.dot;
});

rt.type(260, "/datum/action/lung_punch", "/datum/action", {
	name: "Lung Punch - Delivers a strong punch just above the victim's abdomen, constraining the lungs. The victim will be unable to breathe for a short time.",
	button_icon_state: "lungpunch",
});

// krav_maga.dm:44
rt.def("/datum/action/lung_punch/proc/Trigger", function Trigger(f: Frame) {
	let H: Value = null;
	if (this.owner.incapacitated()) {
		to_chat(this.owner, "<span class='warning'>You can't use Krav Maga while you're incapacitated.</span>");
		return f.dot;
	}
	if ((H = this.owner).mind.martial_art.streak == "quick_choke") {
		this.owner.visible_message(`<span class='danger'>${this.owner} assumes a neutral stance.</span>`, "<b><i>Your next attack is cleared.</i></b>");
		H.mind.martial_art.streak = "";
	} else {
		this.owner.visible_message(`<span class='danger'>${this.owner} assumes the Lung Punch stance!</span>`, "<b><i>Your next attack will be a Lung Punch.</i></b>");
		H.mind.martial_art.streak = "quick_choke";
	}
	return f.dot;
});

// krav_maga.dm:56
rt.def("/datum/martial_art/krav_maga/proc/teach", function* teach(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	to_chat(f.args[0], "<span class = 'userdanger'>You know the arts of Krav Maga!</span>");
	to_chat(f.args[0], "<span class = 'danger'>Place your cursor over a move at the top of the screen to see what it does.</span>");
	yield* this.neckchop.Grant(f.args[0]);
	yield* this.legsweep.Grant(f.args[0]);
	yield* this.lungpunch.Grant(f.args[0]);
	return f.dot;
}, true, { args: ["H", "make_temporary"] });

// krav_maga.dm:64
rt.def("/datum/martial_art/krav_maga/proc/remove", function* remove(f: Frame, H: Value) {
	yield* parent_proc();
	to_chat(H, "<span class = 'userdanger'>You suddenly forget the arts of Krav Maga...</span>");
	yield* this.neckchop.Remove(H);
	yield* this.legsweep.Remove(H);
	yield* this.lungpunch.Remove(H);
	return f.dot;
}, true);

// krav_maga.dm:71
rt.def("/datum/martial_art/krav_maga/proc/check_streak", function* check_streak(f: Frame, A: Value, D: Value) {
	if (this.streak === "neck_chop") {
		this.streak = "";
		yield* this.neck_chop(A, D);
		return 1;
	} else if (this.streak === "leg_sweep") {
		this.streak = "";
		yield* this.leg_sweep(A, D);
		return 1;
	} else if (this.streak === "quick_choke") {
		this.streak = "";
		yield* this.quick_choke(A, D);
		return 1;
	}
	return 0;
}, true);

// krav_maga.dm:87
rt.def("/datum/martial_art/krav_maga/proc/leg_sweep", function* leg_sweep(f: Frame, A: Value, D: Value) {
	if (D.stat || D.IsKnockdown()) {
		return 0;
	}
	D.visible_message(`<span class='warning'>${A} leg sweeps ${D}!</span>`, `<span class='userdanger'>${A} leg sweeps you!</span>`);
	playsound(rt.getStep(f, A, 0), rt.rsc("sound/effects/hit_kick.ogg"), 50, 1, -1);
	yield* D.apply_damage(5, "brute");
	yield* D.Knockdown(40);
	add_logs(A, D, "leg sweeped");
	return 1;
}, true);

// krav_maga.dm:98
rt.def("/datum/martial_art/krav_maga/proc/quick_choke", function* quick_choke(f: Frame, A: Value, D: Value) {
	D.visible_message(`<span class='warning'>${A} pounds ${D} on the chest!</span>`, `<span class='userdanger'>${A} slams your chest! You can't breathe!</span>`);
	playsound(rt.getStep(f, A, 0), rt.rsc("sound/effects/hit_punch.ogg"), 50, 1, -1);
	if (D.losebreath <= 10) {
		D.losebreath = max(0, min(D.losebreath + 5, 10));
	}
	yield* D.adjustOxyLoss(10);
	add_logs(A, D, "quickchoked");
	return 1;
}, true);

// krav_maga.dm:108
rt.def("/datum/martial_art/krav_maga/proc/neck_chop", function* neck_chop(f: Frame, A: Value, D: Value) {
	D.visible_message(`<span class='warning'>${A} karate chops ${D}'s neck!</span>`, `<span class='userdanger'>${A} karate chops your neck, rendering you unable to speak!</span>`);
	playsound(rt.getStep(f, A, 0), rt.rsc("sound/effects/hit_punch.ogg"), 50, 1, -1);
	yield* D.apply_damage(5, "brute");
	if (D.silent <= 10) {
		D.silent = max(0, min(D.silent + 10, 10));
	}
	add_logs(A, D, "neck chopped");
	return 1;
}, true);

// krav_maga.dm:118
rt.def("/datum/martial_art/krav_maga/proc/grab_act", function* grab_act(f: Frame, A: Value, D: Value) {
	if (yield* this.check_streak(A, D)) {
		return 1;
	}
	add_logs(A, D, "grabbed with krav maga");
	yield* parent_proc();
	return f.dot;
}, true);

// krav_maga.dm:124
rt.def("/datum/martial_art/krav_maga/proc/harm_act", function* harm_act(f: Frame, A: Value, D: Value) {
	if (yield* this.check_streak(A, D)) {
		return 1;
	}
	add_logs(A, D, "punched");
	let picked_hit_type: Value = pick("punches", "kicks");
	let bonus_damage: Value = 10;
	if (D.IsKnockdown() || D.resting || D.lying) {
		bonus_damage += 5;
		picked_hit_type = "stomps on";
	}
	yield* D.apply_damage(bonus_damage, "brute");
	if (picked_hit_type == "kicks" || picked_hit_type == "stomps on") {
		yield* A.do_attack_animation(D, "kick");
		playsound(rt.getStep(f, D, 0), rt.rsc("sound/effects/hit_kick.ogg"), 50, 1, -1);
	} else {
		yield* A.do_attack_animation(D, "punch");
		playsound(rt.getStep(f, D, 0), rt.rsc("sound/effects/hit_punch.ogg"), 50, 1, -1);
	}
	D.visible_message(`<span class='danger'>${A} ${picked_hit_type} ${D}!</span>`, `<span class='userdanger'>${A} ${picked_hit_type} you!</span>`);
	add_logs(A, D, `${picked_hit_type} with Krav Maga`);
	return 1;
}, true);

// krav_maga.dm:145
rt.def("/datum/martial_art/krav_maga/proc/disarm_act", function* disarm_act(f: Frame, A: Value, D: Value) {
	let I: Value = null;
	if (yield* this.check_streak(A, D)) {
		return 1;
	}
	if (prob(60)) {
		if (I = D.get_active_held_item()) {
			if (yield* D.drop_item()) {
				yield* A.put_in_hands(I);
			}
		}
		D.visible_message(`<span class='danger'>${A} has disarmed ${D}!</span>`, `<span class='userdanger'>${A} has disarmed ${D}!</span>`);
		playsound(D, rt.rsc("sound/weapons/thudswoosh.ogg"), 50, 1, -1);
	} else {
		D.visible_message(`<span class='danger'>${A} attempted to disarm ${D}!</span>`, `<span class='userdanger'>${A} attempted to disarm ${D}!</span>`);
		playsound(D, rt.rsc("sound/weapons/punchmiss.ogg"), 25, 1, -1);
	}
	let $0: any = A;
	let $1: any = D;
	let $2: any = "disarmed with krav maga";
	add_logs($0, $1, $2, `${I ? fmt(" removing ％！", [I]) : ""}`);
	return 1;
}, true);

rt.type(7658, "/obj/item/clothing/gloves/krav_maga", "/obj/item/clothing/gloves", {
	style: null,
});

// krav_maga.dm:166
rt.def("/obj/item/clothing/gloves/krav_maga/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.style = (yield* new_(T("/datum/martial_art/krav_maga")));
	return f.dot;
}, true);

// krav_maga.dm:169
rt.def("/obj/item/clothing/gloves/krav_maga/proc/equipped", function* equipped(f: Frame, user: Value, slot: Value) {
	if (!rt.istype(user, T("/mob/living/carbon/human"))) {
		return f.dot;
	}
	if (slot != slot_gloves) return f.dot;
	let H: Value = user;
	yield* this.style.teach(H, 1);
	return f.dot;
}, true);

// krav_maga.dm:176
rt.def("/obj/item/clothing/gloves/krav_maga/proc/dropped", function* dropped(f: Frame, user: Value) {
	let H: Value = null;
	if (!rt.istype(user, T("/mob/living/carbon/human"))) {
		return f.dot;
	}
	if ((H = user).get_item_by_slot(slot_gloves) != this) return f.dot;
	yield* this.style.remove(H);
	return f.dot;
}, true);
