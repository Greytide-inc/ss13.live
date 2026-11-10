// Based on /tg/station's code/modules/awaymissions/super_secret_room.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12933, "/obj/structure/speaking_tile", "/obj/structure", {
	speaking: 0,
	times_spoken_to: 0,
	shenanigans: null,
	verb_say: "intones",
	name: "strange tile",
	desc: "A weird tile that beckons you towards it. Maybe it can help you get out of this mess...",
	icon: rt.rsc("icons/obj/structures.dmi"),
	icon_state: "speaking_tile",
	layer: 5,
});

// super_secret_room.dm:10
rt.def("/obj/structure/speaking_tile/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.shenanigans = list();
	return f.dot;
});

// super_secret_room.dm:13
rt.def("/obj/structure/speaking_tile/proc/New", function* New(f: Frame) {
	let S: Value = null;
	this.shenanigans = rt.input(f, rt.R.index, null, [(S = (yield* new_(T("/savefile"), "data/npc_saves/Poly.sav"))), "phrases"]);
	yield* parent_proc();
	return f.dot;
}, true);

// super_secret_room.dm:18
rt.def("/obj/structure/speaking_tile/proc/interact", function* interact(f: Frame, user: Value) {
	let S: Value = null, smoke: Value = null, the_ride: Value = null, never_ends: Value = null;
	let $e: any;
	if (!rt.istype(user, T("/mob/living")) || this.speaking) {
		return f.dot;
	}
	this.speaking = 1;
	if (this.times_spoken_to === 0) {
		yield* this.SpeakPeace(list("Welcome to the error handling room.", "Something's goofed up bad to send you here.", "You should probably tell an admin what you were doing, or make a bug report."));
		rt.forList(f, 0, orange(7), T("/obj/structure/signpost/salvation"));
		if (($e = rt.next(f, 0)) !== undefined) {
			S = $e;
			S.invisibility = 0;
			yield* (smoke = (yield* new_(T("/datum/effect_system/smoke_spread")))).set_up(1, S.loc);
			yield* smoke.start();
		}
		rt.endFor(f, 0);
	} else if (this.times_spoken_to === 1) {
		yield* this.SpeakPeace(list("Take that ladder up.", "It'll send you back to the station.", "Hopefully you'll never need to see this place again."));
	} else if (this.times_spoken_to === 2) {
		yield* this.SpeakPeace(list("Curious about what happened?", "Somehow your corporeal form was sent to nullspace with you still in it.", "Lucky for you this room exists to save you from that horrible fate."));
	} else if (this.times_spoken_to === 3) {
		yield* this.SpeakPeace(list("So yeah, you're welcome.", "Anyway don't you have things to do?", "There's no real point to sticking around here forever."));
	} else if (this.times_spoken_to === 4) {
		yield* this.SpeakPeace(list("I'm flattered you care this much about this room.", "However it's not proper to just stand in here all shift and see what I'll say.", "I'm going to work hard to be more boring so you'll leave."));
	} else if (rt.inRange(this.times_spoken_to, 5, 8)) {
		yield* this.SpeakPeace(list("..."));
	} else if (this.times_spoken_to === 9) {
		yield* this.SpeakPeace(list("Alright maybe that's <b>too</b> boring.", "I can't keep manually typing these lines out though.", "It's hard to explain but the code structure I'm using is kind of terrible."));
	} else if (this.times_spoken_to === 10) {
		yield* this.SpeakPeace(list("Oh I have an idea!", "Lets outsource this endless banter to Poly!", "Then you'll be able to keep listening to this without getting bored!"));
		if (this.shenanigans === null) {
			this.shenanigans = list("Except the poly file is missing...");
		}
	} else if (rt.inRange(this.times_spoken_to, 11, 14) || rt.inRange(this.times_spoken_to, 16, 50) || rt.inRange(this.times_spoken_to, 52, 99) || rt.inRange(this.times_spoken_to, 103, 107) || rt.inRange(this.times_spoken_to, 109, 203) || rt.inRange(this.times_spoken_to, 205, 249) || rt.inRange(this.times_spoken_to, 252, 665) || rt.inRange(this.times_spoken_to, 667, 999) || rt.inRange(this.times_spoken_to, 1001, 5642)) {
		yield* this.SpeakPeace(list(pick(this.shenanigans), pick(this.shenanigans), pick(this.shenanigans)));
		if (this.times_spoken_to * 0.1 == round(this.times_spoken_to * 0.1)) {
			yield* this.SpeakPeace(list(`That's ${this.times_spoken_to} times you've spoken to me by the way.`));
		}
	} else if (this.times_spoken_to === 15) {
		yield* this.SpeakPeace(list("See? Isn't this fun?", "Now you can mash this for hours without getting bored.", "Anyway I'll leave you it."));
	} else if (this.times_spoken_to === 51) {
		yield* this.SpeakPeace(list("The fun never ends around here.", "The Poly text files stores up to 500 statements.", "But you've probably heard a few repeats by now."));
	} else if (this.times_spoken_to === 100) {
		yield* this.SpeakPeace(list("And that's a solid hundred.", "Good hustle I guess.", "You've probably heard a lot of repeats by now."));
	} else if (this.times_spoken_to === 101) {
		yield* this.SpeakPeace(list("I hope you're getting the reference this room is presenting.", "As well as the more obscure meta reference this conversation is presenting.", "This stuff has layers."));
	} else if (this.times_spoken_to === 102) {
		yield* this.SpeakPeace(list("I am very tempted to just stretch this out forever.", "It's technically easier than doing this.", "Just an option."));
	} else if (this.times_spoken_to === 108) {
		yield* this.SpeakPeace(list("But you have my respect for being this dedicated to the joke.", "So tell you what we're going to do, we're going to set a goal.", "250 is your final mission."));
	} else if (this.times_spoken_to === 204) {
		yield* this.SpeakPeace(list("Notice how there was no special message at 200?", "The slow automation of what used to be meaningful milestones?", "It's all part of the joke."));
	} else if (this.times_spoken_to === 250) {
		yield* this.SpeakPeace(list("Congratulations.", "By my very loose calculations you've now wasted a decent chunk of the round doing this.", "But you've seen this meme to its conclusion, and that's a experience in itself, right?"));
	} else if (this.times_spoken_to === 251) {
		yield* this.SpeakPeace(list("Anyway, here.", "I can't give you anything that would impact the progression of the round.", "But you've earned this at least."));
		(the_ride = (yield* new_(T("/obj/item/weapon/reagent_containers/food/drinks/trophy/silver_cup"), rt.getStep(f, user, 0)))).name = "Overextending The Joke: Second Place";
		the_ride.desc = "There's a point where this needed to stop, and we've clearly passed it.";
	} else if (this.times_spoken_to === 252) {
		yield* this.SpeakPeace(list("You know what this means right?", "Of course it's not over!", "The question becomes now is it more impressive to solider on to an unknown finish, or to have to common sense to stop here?"));
	} else if (this.times_spoken_to === 666) {
		yield* this.SpeakPeace(list("The darkness in your heart won't be filled by simple platitudes.", "You won't stop now, you're in this to the end.", "Will you reach the finish line before the round ends?"));
	} else if (this.times_spoken_to === 1000) {
		yield* this.SpeakPeace(list("The ends exists somewhere beyond meaningful milestones.", "There will be no more messages until then.", "You disgust me."));
	} else if (this.times_spoken_to === 5643) {
		(never_ends = (yield* new_(T("/obj/item/weapon/reagent_containers/food/drinks/trophy/gold_cup"), rt.getStep(f, user, 0)))).name = "Overextending The Joke: First Place";
		never_ends.desc = "And so we are left alone with our regrets.";
	} else {
		this.y += 2;
	}
	this.speaking = 0;
	this.times_spoken_to++;
	return f.dot;
}, true);

// super_secret_room.dm:89
rt.def("/obj/structure/speaking_tile/proc/SpeakPeace", function* SpeakPeace(f: Frame, statements: Value) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, rt.len(f, statements), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* this.say(`<span class='deadsay'>${rt.index(statements, i)}</span>`);
		if (i != rt.len(f, statements)) {
			yield* sleep(30);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(9971, "/obj/item/rupee", "/obj/item", {
	w_class: 2,
	materials: null,
	name: "weird crystal",
	desc: "Your excitement boils away as you realize it's just colored glass. Why would someone hoard these things?",
	icon: rt.rsc("icons/obj/economy.dmi"),
	icon_state: "rupee",
});

// super_secret_room.dm:100
rt.def("/obj/item/rupee/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$glass", 500]);
	return f.dot;
});

// super_secret_room.dm:103
rt.def("/obj/item/rupee/proc/New", function* New(f: Frame) {
	let newcolor: Value = null;
	this.add_atom_colour((newcolor = color2hex(rt.op(f, "PickWeighted", [4], [10, "green", 5, "blue", 3, "red", 1, "purple"]))), FIXED_COLOUR_PRIORITY);
	yield* parent_proc();
	return f.dot;
}, true);

// super_secret_room.dm:108
rt.def("/obj/item/rupee/proc/Crossed", function* Crossed(f: Frame, M: Value) {
	if (!rt.istype(M, T("/mob"))) {
		return f.dot;
	}
	if (yield* M.put_in_hands(this)) {
		if (this != M.get_active_held_item()) {
			M.swap_hand();
		}
		yield* this.equip_to_best_slot(M);
	}
	yield* parent_proc();
	return f.dot;
}, true);

// super_secret_room.dm:117
rt.def("/obj/item/rupee/proc/equipped", function* equipped(f: Frame, user: Value, slot: Value) {
	playsound(rt.getStep(f, this.loc, 0), rt.rsc("sound/misc/server-ready.ogg"), 50, 1, -1);
	yield* parent_proc();
	return f.dot;
}, true);
