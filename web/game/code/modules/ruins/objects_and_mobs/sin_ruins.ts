// Based on /tg/station's code/modules/ruins/objects_and_mobs/sin_ruins.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g } = rt;


rt.type(13031, "/obj/structure/cursed_slot_machine", "/obj/structure", {
	win_prob: 5,
	anchored: 1,
	name: "greed's slot machine",
	desc: "High stakes, high rewards.",
	icon: rt.rsc("icons/obj/economy.dmi"),
	icon_state: "slots1",
	density: 1,
});

// sin_ruins.dm:13
rt.def("/obj/structure/cursed_slot_machine/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (!rt.istype(user, T("/mob/living/carbon/human"))) {
		return f.dot;
	}
	if (this.in_use) {
		return f.dot;
	}
	this.in_use = 1;
	yield* user.adjustCloneLoss(20);
	if (user.stat) {
		to_chat(user, "<span class='userdanger'>No... just one more try...</span>");
		yield* user.gib();
	} else {
		user.visible_message(`<span class='warning'>${user} pulls ${this}'s lever with a glint in ${user.p_their()} eyes!</span>`, "<span class='warning'>You feel a draining as you pull the lever, but you know it'll be worth it.</span>");
	}
	this.icon_state = "slots2";
	playsound(this, rt.rsc("sound/lavaland/cursed_slot_machine.ogg"), 50, 0);
	yield* sleep(50);
	this.icon_state = "slots1";
	this.in_use = 0;
	if (prob(this.win_prob)) {
		playsound(this, rt.rsc("sound/lavaland/cursed_slot_machine_jackpot.ogg"), 50, 0);
		yield* new_(T("/obj/structure/cursed_money"), rt.getStep(f, this, 0));
		if (user) {
			to_chat(user, "<span class='boldwarning'>You've hit jackpot. Laughter echoes around you as your reward appears in the machine's place.</span>");
		}
		yield* qdel(this);
	} else {
		if (!user) return f.dot;
		to_chat(user, "<span class='boldwarning'>Fucking machine! Must be rigged. Still... one more try couldn't hurt, right?</span>");
	}
	return f.dot;
}, true);

rt.type(13032, "/obj/structure/cursed_money", "/obj/structure", {
	anchored: 0,
	name: "bag of money",
	desc: "RICH! YES! YOU KNEW IT WAS WORTH IT! YOU'RE RICH! RICH! RICH!",
	icon: rt.rsc("icons/obj/storage.dmi"),
	icon_state: "moneybag",
	density: 1,
});

// sin_ruins.dm:49
rt.def("/obj/structure/cursed_money/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/structure/cursed_money/proc/collapse"))), 600);
	return f.dot;
}, true);

// sin_ruins.dm:53
rt.def("/obj/structure/cursed_money/proc/collapse", function* collapse(f: Frame) {
	this.visible_message(`<span class='warning'>${this} falls in on itself, canvas rotting away and contents vanishing.</span>`);
	yield* qdel(this);
	return f.dot;
}, true);

// sin_ruins.dm:58
rt.def("/obj/structure/cursed_money/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	user.visible_message(`<span class='warning'>${user} opens the bag and and removes a die. The bag then vanishes.</span>`, "<span class='boldwarning'>You open the bag...!</span>\n<span class='danger'>And see a bag full of dice. Confused, you take one... and the bag vanishes.</span>");
	let _T: Value = rt.getStep(f, user, 0);
	let critical_fail: Value = (yield* new_(T("/obj/item/weapon/dice/d20/fate/one_use"), _T));
	yield* user.put_in_hands(critical_fail);
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(12099, "/obj/effect/gluttony", "/obj/effect", {
	anchored: 1,
	name: "gluttony's wall",
	desc: "Only those who truly indulge may pass.",
	density: 1,
	icon_state: "blob",
	icon: rt.rsc("icons/mob/blob.dmi"),
	color: "#919600",
});

// sin_ruins.dm:80
rt.def("/obj/effect/gluttony/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	let H: Value = null;
	height ??= 0;
	if (height == 0) {
		return 1;
	}
	if (rt.istype(mover, T("/mob/living/carbon/human"))) {
		if ((H = mover).nutrition >= NUTRITION_LEVEL_FAT) {
			H.visible_message(`<span class='warning'>${H} pushes through ${this}!</span>`, "<span class='notice'>You've seen and eaten worse than this.</span>");
			return 1;
		} else {
			to_chat(H, `<span class='warning'>You're repulsed by even looking at ${this}. Only a pig could force themselves to go through it.</span>`);
		}
	}
	if (rt.istype(mover, T("/mob/living/simple_animal/hostile/morph"))) {
		return 1;
	} else {
		return 0;
	}
});

rt.type(12810, "/obj/structure/mirror/magic/pride", "/obj/structure/mirror/magic", {
	name: "pride's mirror",
	desc: "Pride cometh before the...",
	icon_state: "magic_mirror",
});

// sin_ruins.dm:102
rt.def("/obj/structure/mirror/magic/pride/proc/curse", function* curse(f: Frame, user: Value) {
	let _T: Value = null, C: Value = null;
	user.visible_message(`<span class='danger'><B>The ground splits beneath ${user} as ${user.p_their()} hand leaves the mirror!</B></span>`, "<span class='notice'>Perfect. Much better! Now <i>nobody</i> will be able to resist yo-</span>");
	yield* (_T = rt.getStep(f, user, 0)).ChangeTurf(T("/turf/open/chasm/straight_down"));
	yield* g.callName(f, (C = _T), "drop", [user]);
	return f.dot;
}, true);

rt.type(7279, "/obj/item/weapon/kitchen/knife/envy", "/obj/item/weapon/kitchen/knife", {
	name: "envy's knife",
	desc: "Their success will be yours.",
	icon: rt.rsc("icons/obj/wizard.dmi"),
	icon_state: "render",
	item_state: "render",
	force: 18,
	throwforce: 10,
	w_class: 3,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
});

// sin_ruins.dm:123
rt.def("/obj/item/weapon/kitchen/knife/envy/proc/afterattack", function* afterattack(f: Frame, AM: Value, user: Value, proximity: Value) {
	yield* parent_proc();
	if (!proximity) {
		return f.dot;
	}
	if (!rt.istype(user, T("/mob/living/carbon/human"))) {
		return f.dot;
	}
	if (!rt.istype(AM, T("/mob/living/carbon/human"))) return f.dot;
	let H: Value = AM;
	if (user.real_name == H.dna.real_name) return f.dot;
	user.real_name = H.dna.real_name;
	yield* H.dna.transfer_identity(user, { transfer_SE: 1 });
	yield* user.updateappearance({ mutcolor_update: 1 });
	yield* user.domutcheck();
	user.visible_message(`<span class='warning'>${user}'s appearance shifts into ${H}'s!</span>`, "<span class='boldannounce'>They think they're <i>sooo</i> much better than you. Not anymore, they won't.</span>");
	return f.dot;
}, true);
