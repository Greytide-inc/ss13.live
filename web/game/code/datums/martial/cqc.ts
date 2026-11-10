// Based on /tg/station's code/datums/martial/cqc.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(569, "/datum/martial_art/cqc", "/datum/martial_art", {
	name: "CQC",
	block_chance: 75,
	help_verb: rt.procRef("/mob/living/carbon/human/proc/CQC_help"),
});

// cqc.dm:16
rt.def("/datum/martial_art/cqc/proc/check_streak", function* check_streak(f: Frame, A: Value, D: Value) {
	if (findtext(this.streak, "GH")) {
		this.streak = "";
		yield* this.Slam(A, D);
		return 1;
	}
	if (findtext(this.streak, "HH")) {
		this.streak = "";
		yield* this.Kick(A, D);
		return 1;
	}
	if (findtext(this.streak, "GG")) {
		this.streak = "";
		yield* this.Restrain(A, D);
		return 1;
	}
	if (findtext(this.streak, "DG")) {
		this.streak = "";
		yield* this.Pressure(A, D);
		return 1;
	}
	if (findtext(this.streak, "DDH")) {
		this.streak = "";
		yield* this.Consecutive(A, D);
	}
	return 0;
}, true);

// cqc.dm:38
rt.def("/datum/martial_art/cqc/proc/Slam", function* Slam(f: Frame, A: Value, D: Value) {
	if (!D.stat || !D.IsKnockdown()) {
		D.visible_message(`<span class='warning'>${A} slams ${D} into the ground!</span>`, `<span class='userdanger'>${A} slams you into the ground!</span>`);
		playsound(rt.getStep(f, A, 0), rt.rsc("sound/weapons/slam.ogg"), 50, 1, -1);
		yield* D.apply_damage(10, "brute");
		yield* D.Knockdown(120);
		add_logs(A, D, "cqc slammed");
	}
	return 1;
}, true);

// cqc.dm:48
rt.def("/datum/martial_art/cqc/proc/Kick", function* Kick(f: Frame, A: Value, D: Value) {
	let throw_target: Value = null;
	if (!D.stat || !D.IsKnockdown()) {
		D.visible_message(`<span class='warning'>${A} kicks ${D} back!</span>`, `<span class='userdanger'>${A} kicks you back!</span>`);
		playsound(rt.getStep(f, A, 0), rt.rsc("sound/weapons/cqchit1.ogg"), 50, 1, -1);
		throw_target = get_edge_target_turf(D, A.dir);
		yield* D.throw_at(throw_target, 1, 14, A);
		yield* D.apply_damage(10, "brute");
		add_logs(A, D, "cqc kicked");
	}
	if (D.IsKnockdown() && !D.stat) {
		D.visible_message(`<span class='warning'>${A} kicks ${D}'s head, knocking them out!</span>`, `<span class='userdanger'>${A} kicks your head, knocking you out!</span>`);
		playsound(rt.getStep(f, A, 0), rt.rsc("sound/weapons/genhit1.ogg"), 50, 1, -1);
		yield* D.SetSleeping(300);
		yield* D.adjustBrainLoss(25);
	}
	return 1;
}, true);

// cqc.dm:65
rt.def("/datum/martial_art/cqc/proc/Pressure", function* Pressure(f: Frame, A: Value, D: Value) {
	D.visible_message(`<span class='warning'>${A} forces their arm on ${D}'s neck!</span>`);
	yield* D.adjustStaminaLoss(60);
	playsound(rt.getStep(f, A, 0), rt.rsc("sound/weapons/cqchit1.ogg"), 50, 1, -1);
	return 1;
}, true);

// cqc.dm:73
rt.def("/datum/martial_art/cqc/proc/Restrain", function* Restrain(f: Frame, A: Value, D: Value) {
	if (this.restraining) {
		return f.dot;
	}
	if (!D.stat) {
		D.visible_message(`<span class='warning'>${A} locks ${D} into a restraining position!</span>`, `<span class='userdanger'>${A} locks you into a restraining position!</span>`);
		yield* D.adjustStaminaLoss(20);
		yield* D.Stun(100);
		this.restraining = 1;
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/datum/martial_art/cqc/proc/drop_restraining"))), 50, 1);
	}
	return 1;
}, true);

// cqc.dm:83
rt.def("/datum/martial_art/cqc/proc/Consecutive", function* Consecutive(f: Frame, A: Value, D: Value) {
	let I: Value = null;
	if (!D.stat) {
		D.visible_message(`<span class='warning'>${A} strikes ${D}'s abdomen, neck and back consecutively</span>`, `<span class='userdanger'>${A} strikes your abdomen, neck and back consecutively!</span>`);
		playsound(rt.getStep(f, D, 0), rt.rsc("sound/weapons/cqchit2.ogg"), 50, 1, -1);
		if ((I = D.get_active_held_item()) && (yield* D.drop_item())) {
			yield* A.put_in_hands(I);
		}
		yield* D.adjustStaminaLoss(50);
		yield* D.apply_damage(25, "brute");
	}
	return 1;
}, true);

// cqc.dm:95
rt.def("/datum/martial_art/cqc/proc/grab_act", function* grab_act(f: Frame, A: Value, D: Value) {
	this.add_to_streak("G", D);
	if (yield* this.check_streak(A, D)) {
		return 1;
	}
	if (A.grab_state >= 1) {
		yield* D.grabbedby(A, 1);
	} else {
		yield* A.start_pulling(D, 1);
		if (A.pulling) {
			yield* D.stop_pulling();
			yield* add_logs(A, D, "grabbed", { addition: "aggressively" });
			A.grab_state = 1;
		}
	}
	return 1;
}, true);

// cqc.dm:110
rt.def("/datum/martial_art/cqc/proc/harm_act", function* harm_act(f: Frame, A: Value, D: Value) {
	this.add_to_streak("H", D);
	if (yield* this.check_streak(A, D)) {
		return 1;
	}
	add_logs(A, D, "CQC'd");
	yield* A.do_attack_animation(D);
	let picked_hit_type: Value = pick("CQC'd", "Big Bossed");
	let bonus_damage: Value = 13;
	if (D.IsKnockdown() || D.resting || D.lying) {
		bonus_damage += 5;
		picked_hit_type = "stomps on";
	}
	yield* D.apply_damage(bonus_damage, "brute");
	if (picked_hit_type == "kicks" || picked_hit_type == "stomps on") {
		playsound(rt.getStep(f, D, 0), rt.rsc("sound/weapons/cqchit2.ogg"), 50, 1, -1);
	} else {
		playsound(rt.getStep(f, D, 0), rt.rsc("sound/weapons/cqchit1.ogg"), 50, 1, -1);
	}
	D.visible_message(`<span class='danger'>${A} ${picked_hit_type} ${D}!</span>`, `<span class='userdanger'>${A} ${picked_hit_type} you!</span>`);
	add_logs(A, D, `${picked_hit_type} with CQC`);
	if (A.resting && !D.stat && !D.IsKnockdown()) {
		D.visible_message(`<span class='warning'>${A} leg sweeps ${D}!`, `<span class='userdanger'>${A} leg sweeps you!</span>`);
		playsound(rt.getStep(f, A, 0), rt.rsc("sound/effects/hit_kick.ogg"), 50, 1, -1);
		yield* D.apply_damage(10, "brute");
		yield* D.Knockdown(60);
		add_logs(A, D, "cqc sweeped");
	}
	return 1;
}, true);

// cqc.dm:138
rt.def("/datum/martial_art/cqc/proc/disarm_act", function* disarm_act(f: Frame, A: Value, D: Value) {
	let I: Value = null;
	this.add_to_streak("D", D);
	if (yield* this.check_streak(A, D)) {
		return 1;
	}
	if (prob(65)) {
		if (!D.stat || !D.IsKnockdown() || !this.restraining) {
			I = D.get_active_held_item();
			D.visible_message(`<span class='warning'>${A} strikes ${D}'s jaw with their hand!</span>`, `<span class='userdanger'>${A} strikes your jaw, disorienting you!</span>`);
			playsound(rt.getStep(f, D, 0), rt.rsc("sound/weapons/cqchit1.ogg"), 50, 1, -1);
			if (I && (yield* D.drop_item())) {
				yield* A.put_in_hands(I);
			}
			D.Jitter(2);
			yield* D.apply_damage(5, "brute");
		}
	} else {
		D.visible_message(`<span class='danger'>${A} attempted to disarm ${D}!</span>`, `<span class='userdanger'>${A} attempted to disarm ${D}!</span>`);
		playsound(D, rt.rsc("sound/weapons/punchmiss.ogg"), 25, 1, -1);
	}
	let $0: any = A;
	let $1: any = D;
	let $2: any = "disarmed with CQC";
	add_logs($0, $1, $2, `${I ? fmt(" grabbing ％！", [I]) : ""}`);
	if (this.restraining && A.pulling == D) {
		D.visible_message(`<span class='danger'>${A} puts ${D} into a chokehold!</span>`, `<span class='userdanger'>${A} puts you into a chokehold!</span>`);
		yield* D.SetSleeping(400);
		this.restraining = 0;
		if (A.grab_state < 2) {
			A.grab_state = 2;
		}
	} else {
		this.restraining = 0;
		return 0;
	}
	return 1;
}, true);

// cqc.dm:174
rt.def("/mob/living/carbon/human/proc/CQC_help", function CQC_help(f: Frame) {
	to_chat(f.usr, "<b><i>You try to remember some of the basics of CQC.</i></b>");
	to_chat(f.usr, "<span class='notice'>Slam</span>: Grab Harm. Slam opponent into the ground, knocking them down.");
	to_chat(f.usr, "<span class='notice'>CQC Kick</span>: Harm Disarm Harm. Knocks opponent away. Knocks out stunned or knocked down opponents.");
	to_chat(f.usr, "<span class='notice'>Restrain</span>: Grab Grab. Locks opponents into a restraining position, disarm to knock them out with a choke hold.");
	to_chat(f.usr, "<span class='notice'>Pressure</span>: Disarm Grab. Decent stamina damage.");
	to_chat(f.usr, "<span class='notice'>Consecutive CQC</span>: Disarm Disarm Harm. Mainly offensive move, huge damage and decent stamina damage.");
	to_chat(f.usr, "<b><i>In addition, by having your throw mode on when being attacked, you enter an active defense mode where you have a chance to block and sometimes even counter attacks done to you.</i></b>");
	return f.dot;
}, false, { verb: { name: "Remember The Basics", category: "CQC", desc: "You try to remember some of the basics of CQC." } });

rt.type(5608, "/obj/item/weapon/cqc_manual", "/obj/item/weapon", {
	name: "old manual",
	desc: "A small, black manual. There are drawn instructions of tactical hand-to-hand combat.",
	icon: rt.rsc("icons/obj/library.dmi"),
	icon_state: "cqcmanual",
});

// cqc.dm:191
rt.def("/obj/item/weapon/cqc_manual/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let D: Value = null;
	if (!rt.istype(user, T("/mob/living/carbon/human")) || !user) {
		return f.dot;
	}
	to_chat(user, "<span class='boldannounce'>You remember the basics of CQC.</span>");
	yield* (D = (yield* new_(T("/datum/martial_art/cqc"), null))).teach(user);
	yield* user.drop_item();
	this.visible_message(`<span class='warning'>${this} beeps ominously, and a moment later it bursts up in flames.</span>`);
	yield* new_(T("/obj/effect/decal/cleanable/ash"), rt.getStep(f, this, 0));
	yield* qdel(this);
	return f.dot;
}, true);
