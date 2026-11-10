// Based on /tg/station's code/datums/martial/sleeping_carp.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(572, "/datum/martial_art/the_sleeping_carp", "/datum/martial_art", {
	name: "The Sleeping Carp",
	deflection_chance: 100,
	no_guns: 1,
	allow_temp_override: 0,
	help_verb: rt.procRef("/mob/living/carbon/human/proc/sleeping_carp_help"),
});

// sleeping_carp.dm:15
rt.def("/datum/martial_art/the_sleeping_carp/proc/check_streak", function* check_streak(f: Frame, A: Value, D: Value) {
	if (findtext(this.streak, "DD")) {
		this.streak = "";
		yield* this.wristWrench(A, D);
		return 1;
	}
	if (findtext(this.streak, "HG")) {
		this.streak = "";
		yield* this.backKick(A, D);
		return 1;
	}
	if (findtext(this.streak, "GH")) {
		this.streak = "";
		yield* this.kneeStomach(A, D);
		return 1;
	}
	if (findtext(this.streak, "DHH")) {
		this.streak = "";
		yield* this.headKick(A, D);
		return 1;
	}
	if (findtext(this.streak, "HDHDH")) {
		this.streak = "";
		yield* this.elbowDrop(A, D);
		return 1;
	}
	return 0;
}, true);

// sleeping_carp.dm:38
rt.def("/datum/martial_art/the_sleeping_carp/proc/wristWrench", function* wristWrench(f: Frame, A: Value, D: Value) {
	if (!D.stat && !D.IsStun() && !D.IsKnockdown()) {
		yield* A.do_attack_animation(D, "punch");
		D.visible_message(`<span class='warning'>${A} grabs ${D}'s wrist and wrenches it sideways!</span>`, `<span class='userdanger'>${A} grabs your wrist and violently wrenches it to the side!</span>`);
		playsound(rt.getStep(f, A, 0), rt.rsc("sound/weapons/thudswoosh.ogg"), 50, 1, -1);
		yield* D.emote("scream");
		yield* D.drop_item();
		yield* D.apply_damage(5, "brute", pick("l_arm", "r_arm"));
		yield* D.Stun(60);
		return 1;
	}
	add_logs(A, D, "wrist wrenched (Sleeping Carp)");
	return (yield* this.basic_hit(A, D));
}, true);

// sleeping_carp.dm:52
rt.def("/datum/martial_art/the_sleeping_carp/proc/backKick", function* backKick(f: Frame, A: Value, D: Value) {
	if (A.dir == D.dir && !D.stat && !D.IsKnockdown()) {
		yield* A.do_attack_animation(D, "punch");
		D.visible_message(`<span class='warning'>${A} kicks ${D} in the back!</span>`, `<span class='userdanger'>${A} kicks you in the back, making you stumble and fall!</span>`);
		yield* step_to(D, rt.getStep(f, D, D.dir), 1);
		yield* D.Knockdown(80);
		playsound(rt.getStep(f, D, 0), rt.rsc("sound/weapons/punch1.ogg"), 50, 1, -1);
		return 1;
	}
	add_logs(A, D, "back-kicked (Sleeping Carp)");
	return (yield* this.basic_hit(A, D));
}, true);

// sleeping_carp.dm:64
rt.def("/datum/martial_art/the_sleeping_carp/proc/kneeStomach", function* kneeStomach(f: Frame, A: Value, D: Value) {
	if (!D.stat && !D.IsKnockdown()) {
		yield* A.do_attack_animation(D, "kick");
		D.visible_message(`<span class='warning'>${A} knees ${D} in the stomach!</span>`, `<span class='userdanger'>${A} winds you with a knee in the stomach!</span>`);
		D.audible_message(`<b>${D}</b> gags!`);
		D.losebreath += 3;
		yield* D.Stun(40);
		playsound(rt.getStep(f, D, 0), rt.rsc("sound/weapons/punch1.ogg"), 50, 1, -1);
		return 1;
	}
	add_logs(A, D, "stomach kneed (Sleeping Carp)");
	return (yield* this.basic_hit(A, D));
}, true);

// sleeping_carp.dm:77
rt.def("/datum/martial_art/the_sleeping_carp/proc/headKick", function* headKick(f: Frame, A: Value, D: Value) {
	if (!D.stat && !D.IsKnockdown()) {
		yield* A.do_attack_animation(D, "kick");
		D.visible_message(`<span class='warning'>${A} kicks ${D} in the head!</span>`, `<span class='userdanger'>${A} kicks you in the jaw!</span>`);
		yield* D.apply_damage(20, "brute", "head");
		yield* D.drop_item();
		playsound(rt.getStep(f, D, 0), rt.rsc("sound/weapons/punch1.ogg"), 50, 1, -1);
		yield* D.Stun(80);
		return 1;
	}
	add_logs(A, D, "head kicked (Sleeping Carp)");
	return (yield* this.basic_hit(A, D));
}, true);

// sleeping_carp.dm:90
rt.def("/datum/martial_art/the_sleeping_carp/proc/elbowDrop", function* elbowDrop(f: Frame, A: Value, D: Value) {
	if (D.IsKnockdown() || D.resting || D.stat) {
		yield* A.do_attack_animation(D, "punch");
		D.visible_message(`<span class='warning'>${A} elbow drops ${D}!</span>`, `<span class='userdanger'>${A} piledrives you with their elbow!</span>`);
		if (D.stat) {
			yield* D.death();
		}
		yield* D.apply_damage(50, "brute", "chest");
		playsound(rt.getStep(f, D, 0), rt.rsc("sound/weapons/punch1.ogg"), 75, 1, -1);
		return 1;
	}
	add_logs(A, D, "elbow dropped (Sleeping Carp)");
	return (yield* this.basic_hit(A, D));
}, true);

// sleeping_carp.dm:103
rt.def("/datum/martial_art/the_sleeping_carp/proc/grab_act", function* grab_act(f: Frame, A: Value, D: Value) {
	this.add_to_streak("G", D);
	if (yield* this.check_streak(A, D)) {
		return 1;
	}
	if (A.grab_state >= 1) {
		yield* D.grabbedby(A, 1);
	} else {
		yield* A.start_pulling(D, 1);
		if (A.pulling) {
			yield* D.drop_all_held_items();
			yield* D.stop_pulling();
			if (A.a_intent == "grab") {
				yield* add_logs(A, D, "grabbed", { addition: "aggressively" });
				A.grab_state = 1;
			} else {
				yield* add_logs(A, D, "grabbed", { addition: "passively" });
				A.grab_state = 0;
			}
		}
	}
	return 1;
}, true);

// sleeping_carp.dm:122
rt.def("/datum/martial_art/the_sleeping_carp/proc/harm_act", function* harm_act(f: Frame, A: Value, D: Value) {
	this.add_to_streak("H", D);
	if (yield* this.check_streak(A, D)) {
		return 1;
	}
	yield* A.do_attack_animation(D, "punch");
	let atk_verb: Value = pick("punches", "kicks", "chops", "hits", "slams");
	D.visible_message(`<span class='danger'>${A} ${atk_verb} ${D}!</span>`, `<span class='userdanger'>${A} ${atk_verb} you!</span>`);
	yield* D.apply_damage(rand(10, 15), "brute");
	playsound(rt.getStep(f, D, 0), rt.rsc("sound/weapons/punch1.ogg"), 25, 1, -1);
	if (prob(D.getBruteLoss()) && !D.lying) {
		D.visible_message(`<span class='warning'>${D} stumbles and falls!</span>`, "<span class='userdanger'>The blow sends you to the ground!</span>");
		yield* D.Knockdown(80);
	}
	add_logs(A, D, `${atk_verb} (Sleeping Carp)`);
	return 1;
}, true);

// sleeping_carp.dm:139
rt.def("/datum/martial_art/the_sleeping_carp/proc/disarm_act", function* disarm_act(f: Frame, A: Value, D: Value) {
	this.add_to_streak("D", D);
	if (yield* this.check_streak(A, D)) {
		return 1;
	}
	return (yield* parent_proc());
}, true);

// sleeping_carp.dm:149
rt.def("/mob/living/carbon/human/proc/sleeping_carp_help", function sleeping_carp_help(f: Frame) {
	to_chat(f.usr, "<b><i>You retreat inward and recall the teachings of the Sleeping Carp...</i></b>");
	to_chat(f.usr, "<span class='notice'>Wrist Wrench</span>: Disarm Disarm. Forces opponent to drop item in hand.");
	to_chat(f.usr, "<span class='notice'>Back Kick</span>: Harm Grab. Opponent must be facing away. Knocks down.");
	to_chat(f.usr, "<span class='notice'>Stomach Knee</span>: Grab Harm. Knocks the wind out of opponent and stuns.");
	to_chat(f.usr, "<span class='notice'>Head Kick</span>: Disarm Harm Harm. Decent damage, forces opponent to drop item in hand.");
	to_chat(f.usr, "<span class='notice'>Elbow Drop</span>: Harm Disarm Harm Disarm Harm. Opponent must be on the ground. Deals huge damage, instantly kills anyone in critical condition.");
	return f.dot;
}, false, { verb: { name: "Recall Teachings", category: "Sleeping Carp", desc: "Remember the martial techniques of the Sleeping Carp clan." } });

rt.type(5610, "/obj/item/weapon/sleeping_carp_scroll", "/obj/item/weapon", {
	name: "mysterious scroll",
	desc: "A scroll filled with strange markings. It seems to be drawings of some sort of martial art.",
	icon: rt.rsc("icons/obj/wizard.dmi"),
	icon_state: "scroll2",
});

// sleeping_carp.dm:164
rt.def("/obj/item/weapon/sleeping_carp_scroll/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let theSleepingCarp: Value = null;
	if (!rt.istype(user, T("/mob/living/carbon/human")) || !user) {
		return f.dot;
	}
	let message: Value = "<span class='sciradio'>You have learned the ancient martial art of the Sleeping Carp! Your hand-to-hand combat has become much more effective, and you are now able to deflect any projectiles directed toward you. However, you are also unable to use any ranged weaponry. You can learn more about your newfound art by using the Recall Teachings verb in the Sleeping Carp tab.</span>";
	to_chat(user, message);
	yield* (theSleepingCarp = (yield* new_(T("/datum/martial_art/the_sleeping_carp"), null))).teach(user);
	yield* user.drop_item();
	this.visible_message(`<span class='warning'>${this} lights up in fire and quickly burns to ash.</span>`);
	yield* new_(T("/obj/effect/decal/cleanable/ash"), rt.getStep(f, this, 0));
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(5612, "/obj/item/weapon/twohanded/bostaff", "/obj/item/weapon/twohanded", {
	throw_speed: 2,
	name: "bo staff",
	desc: "A long, tall staff made of polished wood. Traditionally used in ancient old-Earth martial arts. Can be wielded to both kill and incapacitate.",
	force: 10,
	w_class: 4,
	slot_flags: 1024,
	force_unwielded: 10,
	force_wielded: 24,
	throwforce: 20,
	attack_verb: null,
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "bostaff0",
	block_chance: 50,
});

// sleeping_carp.dm:192
rt.def("/obj/item/weapon/twohanded/bostaff/proc/update_icon", function update_icon(f: Frame) {
	this.icon_state = `bostaff${this.wielded}`;
	return f.dot;
});

// sleeping_carp.dm:196
rt.def("/obj/item/weapon/twohanded/bostaff/proc/attack", function* attack(f: Frame, target: Value, user: Value) {
	let H: Value = null, C: Value = null, H_1: Value = null, fluffmessages: Value = null, total_health: Value = null;
	yield* this.add_fingerprint(user);
	if (rt.isIn(f, 256, user.disabilities) && prob(50)) {
		to_chat(user, `<span class ='warning'>You club yourself over the head with ${this}.</span>`);
		yield* user.Knockdown(60);
		if (rt.istype(user, T("/mob/living/carbon/human"))) {
			yield* (H = user).apply_damage(2 * this.force, "brute", "head");
		} else {
			yield* user.take_bodypart_damage(2 * this.force);
		}
		return f.dot;
	}
	if (rt.istype(target, T("/mob/living/silicon/robot"))) {
		return (yield* parent_proc());
	}
	if (!rt.istype(target, T("/mob/living"))) {
		return (yield* parent_proc());
	}
	if ((C = target).stat) {
		to_chat(user, "<span class='warning'>It would be dishonorable to attack a foe while they cannot retaliate.</span>");
		return f.dot;
	}
	if (user.a_intent == "disarm") {
		if (!this.wielded) {
			return (yield* parent_proc());
		}
		if (!rt.istype(target, T("/mob/living/carbon/human"))) {
			return (yield* parent_proc());
		}
		H_1 = target;
		fluffmessages = list(`${user} clubs ${H_1} with ${this}!`, `${user} smacks ${H_1} with the butt of ${this}!`, `${user} broadsides ${H_1} with ${this}!`, `${user} smashes ${H_1}'s head with ${this}!`, `${user} beats ${H_1} with front of ${this}!`, `${user} twirls and slams ${H_1} with ${this}!`);
		H_1.visible_message(`<span class='warning'>${pick(fluffmessages)}</span>`, `<span class='userdanger'>${pick(fluffmessages)}</span>`);
		playsound(rt.getStep(f, user, 0), rt.rsc("sound/effects/woodhit.ogg"), 75, 1, -1);
		yield* H_1.adjustStaminaLoss(rand(13, 20));
		if (prob(10)) {
			H_1.visible_message(`<span class='warning'>${H_1} collapses!</span>`, "<span class='userdanger'>Your legs give out!</span>");
			yield* H_1.Knockdown(80);
		}
		if (H_1.staminaloss && !H_1.IsSleeping()) {
			if ((total_health = H_1.health - H_1.staminaloss) <= 0 && !H_1.stat) {
				H_1.visible_message(`<span class='warning'>${user} delivers a heavy hit to ${H_1}'s head, knocking them out cold!</span>`, `<span class='userdanger'>${user} knocks you unconscious!</span>`);
				yield* H_1.SetSleeping(600);
				yield* H_1.adjustBrainLoss(25);
			}
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// sleeping_carp.dm:246
rt.def("/obj/item/weapon/twohanded/bostaff/proc/hit_reaction", function hit_reaction(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = "the attack";
	}
	if (f.args[3] === null) {
		f.args[3] = 0;
	}
	if (f.args[4] === null) {
		f.args[4] = 0;
	}
	if (f.args[5] === null) {
		f.args[5] = 1;
	}
	if (this.wielded) {
		return parent_proc();
	}
	return 0;
}, false, { args: ["owner", "hitby", "attack_text", "final_block_chance", "damage", "attack_type"] });
