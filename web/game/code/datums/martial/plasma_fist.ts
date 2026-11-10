// Based on /tg/station's code/datums/martial/plasma_fist.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(571, "/datum/martial_art/plasma_fist", "/datum/martial_art", {
	name: "Plasma Fist",
	help_verb: rt.procRef("/mob/living/carbon/human/proc/plasma_fist_help"),
});

// plasma_fist.dm:11
rt.def("/datum/martial_art/plasma_fist/proc/check_streak", function* check_streak(f: Frame, A: Value, D: Value) {
	if (findtext(this.streak, "HHD")) {
		this.streak = "";
		yield* this.Tornado(A, D);
		return 1;
	}
	if (findtext(this.streak, "DHD")) {
		this.streak = "";
		yield* this.Throwback(A, D);
		return 1;
	}
	if (findtext(this.streak, "HDDDH")) {
		this.streak = "";
		yield* this.Plasma(A, D);
		return 1;
	}
	return 0;
}, true);

// plasma_fist.dm:27
rt.def("/datum/martial_art/plasma_fist/proc/TornadoAnimate", function* TornadoAnimate(f: Frame, A: Value) {
	let i: Value = null;
	for (i of each(list(1, 2, 4, 8, 4, 2, 1, 2, 4, 8, 4, 2))) {
		if (!A) {
			break;
		}
		yield* A.setDir(i);
		playsound(A.loc, rt.rsc("sound/weapons/punch1.ogg"), 15, 1, -1);
		yield* sleep(1);
	}
	return f.dot;
}, true, { waitfor: false });

// plasma_fist.dm:35
rt.def("/datum/martial_art/plasma_fist/proc/Tornado", function* Tornado(f: Frame, A: Value, D: Value) {
	let _T: Value = null;
	yield* A.say("TORNADO SWEEP!");
	yield* this.TornadoAnimate(A);
	let R: Value = (yield* new_(T("/obj/effect/proc_holder/spell/aoe_turf/repulse"), null));
	let turfs: Value = list();
	for (_T of each(range(1, A), T("/turf"))) {
		turfs.Add(_T);
	}
	yield* R.cast(turfs);
	add_logs(A, D, "tornado sweeped(Plasma Fist)");
	return f.dot;
}, true);

// plasma_fist.dm:46
rt.def("/datum/martial_art/plasma_fist/proc/Throwback", function* Throwback(f: Frame, A: Value, D: Value) {
	D.visible_message(`<span class='danger'>${A} has hit ${D} with Plasma Punch!</span>`, `<span class='userdanger'>${A} has hit ${D} with Plasma Punch!</span>`);
	playsound(D.loc, rt.rsc("sound/weapons/punch1.ogg"), 50, 1, -1);
	let throw_target: Value = get_edge_target_turf(D, rt.getDir(f, D, get_step_away(D, A)));
	yield* D.throw_at(throw_target, 200, 4, A);
	yield* A.say("HYAH!");
	add_logs(A, D, "threw back (Plasma Fist)");
	return f.dot;
}, true);

// plasma_fist.dm:56
rt.def("/datum/martial_art/plasma_fist/proc/Plasma", function* Plasma(f: Frame, A: Value, D: Value) {
	yield* A.do_attack_animation(D, "punch");
	playsound(D.loc, rt.rsc("sound/weapons/punch1.ogg"), 50, 1, -1);
	yield* A.say("PLASMA FIST!");
	D.visible_message(`<span class='danger'>${A} has hit ${D} with THE PLASMA FIST TECHNIQUE!</span>`, `<span class='userdanger'>${A} has hit ${D} with THE PLASMA FIST TECHNIQUE!</span>`);
	yield* D.gib();
	add_logs(A, D, "gibbed (Plasma Fist)");
	return f.dot;
}, true);

// plasma_fist.dm:66
rt.def("/datum/martial_art/plasma_fist/proc/harm_act", function* harm_act(f: Frame, A: Value, D: Value) {
	this.add_to_streak("H", D);
	if (yield* this.check_streak(A, D)) {
		return 1;
	}
	yield* this.basic_hit(A, D);
	return 1;
}, true);

// plasma_fist.dm:73
rt.def("/datum/martial_art/plasma_fist/proc/disarm_act", function* disarm_act(f: Frame, A: Value, D: Value) {
	this.add_to_streak("D", D);
	if (yield* this.check_streak(A, D)) {
		return 1;
	}
	yield* this.basic_hit(A, D);
	return 1;
}, true);

// plasma_fist.dm:80
rt.def("/datum/martial_art/plasma_fist/proc/grab_act", function* grab_act(f: Frame, A: Value, D: Value) {
	this.add_to_streak("G", D);
	if (yield* this.check_streak(A, D)) {
		return 1;
	}
	yield* this.basic_hit(A, D);
	return 1;
}, true);

// plasma_fist.dm:91
rt.def("/mob/living/carbon/human/proc/plasma_fist_help", function plasma_fist_help(f: Frame) {
	to_chat(f.usr, "<b><i>You clench your fists and have a flashback of knowledge...</i></b>");
	to_chat(f.usr, "<span class='notice'>Tornado Sweep</span>: Harm Harm Disarm. Repulses target and everyone back.");
	to_chat(f.usr, "<span class='notice'>Throwback</span>: Disarm Harm Disarm. Throws the target and an item at them.");
	to_chat(f.usr, "<span class='notice'>The Plasma Fist</span>: Harm Disarm Disarm Disarm Harm. Knocks the brain out of the opponent and gibs their body.");
	return f.dot;
}, false, { verb: { name: "Recall Teachings", category: "Plasma Fist", desc: "Remember the martial techniques of the Plasma Fist." } });

rt.type(5609, "/obj/item/weapon/plasma_fist_scroll", "/obj/item/weapon", {
	used: 0,
	name: "frayed scroll",
	desc: "An aged and frayed scrap of paper written in shifting runes. There are hand-drawn illustrations of pugilism.",
	icon: rt.rsc("icons/obj/wizard.dmi"),
	icon_state: "scroll2",
});

// plasma_fist.dm:104
rt.def("/obj/item/weapon/plasma_fist_scroll/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let F: Value = null;
	if (!rt.istype(user, T("/mob/living/carbon/human"))) {
		return f.dot;
	}
	if (this.used) return f.dot;
	let H: Value = user;
	(F = new_(T("/datum/martial_art/plasma_fist"), null)).teach(H);
	to_chat(H, "<span class='boldannounce'>You have learned the ancient martial art of Plasma Fist.</span>");
	this.used = 1;
	this.desc = "It's completely blank.";
	this.name = "empty scroll";
	this.icon_state = "blankscroll";
	return f.dot;
});
