// Based on /tg/station's code/modules/mining/lavaland/ruins/gym.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(12962, "/obj/structure/punching_bag", "/obj/structure", {
	hit_sounds: null,
	anchored: 1,
	name: "punching bag",
	desc: "A punching bag. Can you get to speed level 4???",
	icon: rt.rsc("icons/obj/gym_equipment.dmi"),
	icon_state: "punchingbag",
	layer: 4.25,
});

// gym.dm:12
rt.def("/obj/structure/punching_bag/proc/attack_hand", function attack_hand(f: Frame, user: Value) {
	flick(`${this.icon_state}-punch`, this);
	playsound(this.loc, pick(this.hit_sounds), 25, 1, -1);
	return f.dot;
});

rt.type(12963, "/obj/structure/stacklifter", "/obj/structure", {
	anchored: 1,
	name: "chest press machine",
	desc: "Just looking at this thing makes you feel tired.",
	icon: rt.rsc("icons/obj/gym_equipment.dmi"),
	icon_state: "stacklifter",
	density: 1,
});

// gym.dm:25
rt.def("/obj/structure/stacklifter/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let press_overlay: Value = null, bragmessage: Value = null, lifts: Value = null, finishmessage: Value = null;
	let $t: any;
	if (this.in_use) {
		to_chat(user, "It's already in use - wait a bit.");
		return f.dot;
	} else {
		this.in_use = 1;
		this.icon_state = "stacklifter-u";
		this.add_overlay((press_overlay = mutable_appearance(this.icon, "stacklifter-o", 4.1)));
		yield* user.setDir(2);
		yield* user.Stun(80);
		user.loc = this.loc;
		bragmessage = pick("pushing it to the limit", "going into overdrive", "burning with determination", "rising up to the challenge", "getting strong now", "getting ripped");
		user.visible_message(`<B>${user} is ${bragmessage}!</B>`);
		lifts = 0;
		while (($t = lifts, lifts = rt.inc($t, 1), $t) < 6) {
			if (user.loc != this.loc) {
				break;
			}
			yield* sleep(3);
			rt.op(f, "Animate", [2, 6], [null, user, "pixel_y", -2, "time", 3]);
			yield* sleep(3);
			rt.op(f, "Animate", [2, 6], [null, user, "pixel_y", -4, "time", 3]);
			yield* sleep(3);
			playsound(user, rt.rsc("sound/machines/creak.ogg"), 60, 1);
		}
		playsound(user, rt.rsc("sound/machines/click.ogg"), 60, 1);
		this.in_use = 0;
		user.pixel_y = 0;
		finishmessage = pick("You feel stronger!", "You feel like you can take on the world!", "You feel robust!", "You feel indestructible!");
		this.icon_state = "stacklifter";
		this.cut_overlay(press_overlay);
		to_chat(user, finishmessage);
	}
	return f.dot;
}, true);

rt.type(12964, "/obj/structure/weightlifter", "/obj/structure", {
	anchored: 1,
	name: "inline bench press",
	desc: "Just looking at this thing makes you feel tired.",
	icon: rt.rsc("icons/obj/gym_equipment.dmi"),
	icon_state: "benchpress",
	density: 1,
});

// gym.dm:63
rt.def("/obj/structure/weightlifter/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let swole_overlay: Value = null, bragmessage: Value = null, reps: Value = null, innerReps: Value = null, finishmessage: Value = null;
	let $t: any;
	if (this.in_use) {
		to_chat(user, "It's already in use - wait a bit.");
		return f.dot;
	} else {
		this.in_use = 1;
		this.icon_state = "benchpress-u";
		yield* user.setDir(2);
		yield* user.Stun(80);
		user.loc = this.loc;
		this.add_overlay((swole_overlay = mutable_appearance(this.icon, "benchpress-o", 4.1)));
		bragmessage = pick("pushing it to the limit", "going into overdrive", "burning with determination", "rising up to the challenge", "getting strong now", "getting ripped");
		user.visible_message(`<B>${user} is ${bragmessage}!</B>`);
		reps = 0;
		user.pixel_y = 5;
		while (($t = reps, reps = rt.inc($t, 1), $t) < 6) {
			if (user.loc != this.loc) {
				break;
			}
			innerReps = max(reps, 1);
			while (innerReps > 0) {
				yield* sleep(3);
				rt.op(f, "Animate", [2, 6], [null, user, "pixel_y", user.pixel_y == 3 ? 5 : 3, "time", 3]);
				innerReps--;
			}
			playsound(user, rt.rsc("sound/machines/creak.ogg"), 60, 1);
		}
		yield* sleep(3);
		rt.op(f, "Animate", [2, 6], [null, user, "pixel_y", 2, "time", 3]);
		yield* sleep(3);
		playsound(user, rt.rsc("sound/machines/click.ogg"), 60, 1);
		this.in_use = 0;
		rt.op(f, "Animate", [2, 6], [null, user, "pixel_y", 0, "time", 3]);
		finishmessage = pick("You feel stronger!", "You feel like you can take on the world!", "You feel robust!", "You feel indestructible!");
		this.icon_state = "benchpress";
		this.cut_overlay(swole_overlay);
		to_chat(user, `${finishmessage}`);
	}
	return f.dot;
}, true);
