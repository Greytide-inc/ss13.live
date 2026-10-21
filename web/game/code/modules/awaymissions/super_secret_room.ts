// From code/modules/awaymissions/super_secret_room.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/structure/speaking_tile/proc/<init>  (code/modules/awaymissions/super_secret_room.dm:10)
rt.def("/obj/structure/speaking_tile/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "shenanigans", rt.list());
	return f.dot;
});

// /obj/structure/speaking_tile/proc/New  (code/modules/awaymissions/super_secret_room.dm:13)  may sleep
rt.def("/obj/structure/speaking_tile/proc/New", function* New(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	rt.setSv(f, "shenanigans", rt.input(f, rt.R.index, null, [(S = (yield* g.new_(f, T("/savefile"), ["data/npc_saves/Poly.sav"]))), "phrases"]));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/structure/speaking_tile/proc/interact  (code/modules/awaymissions/super_secret_room.dm:18)  may sleep
rt.def("/obj/structure/speaking_tile/proc/interact", function* interact(f: Frame, user: Value) {
	let S: Value = null, smoke: Value = null, the_ride: Value = null, never_ends: Value = null;
	let $0: any, $e: any;
	f.vars = () => [user, S, smoke, the_ride, never_ends, $0, $e];
	if ((!truthy((rt.istype(live(user), T("/mob/living")) ? 1 : 0)) || truthy(rt.sv(f, "speaking")))) {
		return live(f.dot);
	}
	rt.setSv(f, "speaking", 1);
	$0 = rt.sv(f, "times_spoken_to");
	if ($0 === 0) {
		yield* g.srcCall(f, "SpeakPeace", rt.list("Welcome to the error handling room.", "Something's goofed up bad to send you here.", "You should probably tell an admin what you were doing, or make a bug report."));
		S = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/orange"), null, [7])), T("/obj/structure/signpost/salvation"));
		if (($e = rt.next(f, 0)) !== undefined) {
			S = $e;
			rt.setFv(f, "invisibility", live(S), 0);
			yield* g.callName(f, (smoke = (yield* g.new_(f, T("/datum/effect_system/smoke_spread"), []))), "set_up", [1, rt.fv(f, "loc", live(S))]);
			yield* g.callName(f, live(smoke), "start", []);
		}
		rt.endFor(f, 0);
	} else if ($0 === 1) {
		yield* g.srcCall(f, "SpeakPeace", rt.list("Take that ladder up.", "It'll send you back to the station.", "Hopefully you'll never need to see this place again."));
	} else if ($0 === 2) {
		yield* g.srcCall(f, "SpeakPeace", rt.list("Curious about what happened?", "Somehow your corporeal form was sent to nullspace with you still in it.", "Lucky for you this room exists to save you from that horrible fate."));
	} else if ($0 === 3) {
		yield* g.srcCall(f, "SpeakPeace", rt.list("So yeah, you're welcome.", "Anyway don't you have things to do?", "There's no real point to sticking around here forever."));
	} else if ($0 === 4) {
		yield* g.srcCall(f, "SpeakPeace", rt.list("I'm flattered you care this much about this room.", "However it's not proper to just stand in here all shift and see what I'll say.", "I'm going to work hard to be more boring so you'll leave."));
	} else if (rt.inRange($0, 5, 8)) {
		yield* g.srcCall(f, "SpeakPeace", rt.list("..."));
	} else if ($0 === 9) {
		yield* g.srcCall(f, "SpeakPeace", rt.list("Alright maybe that's <b>too</b> boring.", "I can't keep manually typing these lines out though.", "It's hard to explain but the code structure I'm using is kind of terrible."));
	} else if ($0 === 10) {
		yield* g.srcCall(f, "SpeakPeace", rt.list("Oh I have an idea!", "Lets outsource this endless banter to Poly!", "Then you'll be able to keep listening to this without getting bored!"));
		if (rt.sv(f, "shenanigans") === null) {
			rt.setSv(f, "shenanigans", rt.list("Except the poly file is missing..."));
		}
	} else if (rt.inRange($0, 11, 14) || rt.inRange($0, 16, 50) || rt.inRange($0, 52, 99) || rt.inRange($0, 103, 107) || rt.inRange($0, 109, 203) || rt.inRange($0, 205, 249) || rt.inRange($0, 252, 665) || rt.inRange($0, 667, 999) || rt.inRange($0, 1001, 5642)) {
		yield* g.srcCall(f, "SpeakPeace", rt.list(rt.op(f, "PickUnweighted", [1], [rt.sv(f, "shenanigans")]), rt.op(f, "PickUnweighted", [1], [rt.sv(f, "shenanigans")]), rt.op(f, "PickUnweighted", [1], [rt.sv(f, "shenanigans")])));
		if (isEqual(multiply(rt.sv(f, "times_spoken_to"), 0.10000000149011612), (yield* g.call(f, P("/proc/round"), null, [multiply(rt.sv(f, "times_spoken_to"), 0.10000000149011612)])))) {
			yield* g.srcCall(f, "SpeakPeace", rt.list(fmt("That's ＀ times you've spoken to me by the way.", [rt.sv(f, "times_spoken_to")])));
		}
	} else if ($0 === 15) {
		yield* g.srcCall(f, "SpeakPeace", rt.list("See? Isn't this fun?", "Now you can mash this for hours without getting bored.", "Anyway I'll leave you it."));
	} else if ($0 === 51) {
		yield* g.srcCall(f, "SpeakPeace", rt.list("The fun never ends around here.", "The Poly text files stores up to 500 statements.", "But you've probably heard a few repeats by now."));
	} else if ($0 === 100) {
		yield* g.srcCall(f, "SpeakPeace", rt.list("And that's a solid hundred.", "Good hustle I guess.", "You've probably heard a lot of repeats by now."));
	} else if ($0 === 101) {
		yield* g.srcCall(f, "SpeakPeace", rt.list("I hope you're getting the reference this room is presenting.", "As well as the more obscure meta reference this conversation is presenting.", "This stuff has layers."));
	} else if ($0 === 102) {
		yield* g.srcCall(f, "SpeakPeace", rt.list("I am very tempted to just stretch this out forever.", "It's technically easier than doing this.", "Just an option."));
	} else if ($0 === 108) {
		yield* g.srcCall(f, "SpeakPeace", rt.list("But you have my respect for being this dedicated to the joke.", "So tell you what we're going to do, we're going to set a goal.", "250 is your final mission."));
	} else if ($0 === 204) {
		yield* g.srcCall(f, "SpeakPeace", rt.list("Notice how there was no special message at 200?", "The slow automation of what used to be meaningful milestones?", "It's all part of the joke."));
	} else if ($0 === 250) {
		yield* g.srcCall(f, "SpeakPeace", rt.list("Congratulations.", "By my very loose calculations you've now wasted a decent chunk of the round doing this.", "But you've seen this meme to its conclusion, and that's a experience in itself, right?"));
	} else if ($0 === 251) {
		yield* g.srcCall(f, "SpeakPeace", rt.list("Anyway, here.", "I can't give you anything that would impact the progression of the round.", "But you've earned this at least."));
		rt.setFv(f, "name", (the_ride = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/drinks/trophy/silver_cup"), [rt.getStep(f, live(user), 0)]))), "Overextending The Joke: Second Place");
		rt.setFv(f, "desc", live(the_ride), "There's a point where this needed to stop, and we've clearly passed it.");
	} else if ($0 === 252) {
		yield* g.srcCall(f, "SpeakPeace", rt.list("You know what this means right?", "Of course it's not over!", "The question becomes now is it more impressive to solider on to an unknown finish, or to have to common sense to stop here?"));
	} else if ($0 === 666) {
		yield* g.srcCall(f, "SpeakPeace", rt.list("The darkness in your heart won't be filled by simple platitudes.", "You won't stop now, you're in this to the end.", "Will you reach the finish line before the round ends?"));
	} else if ($0 === 1000) {
		yield* g.srcCall(f, "SpeakPeace", rt.list("The ends exists somewhere beyond meaningful milestones.", "There will be no more messages until then.", "You disgust me."));
	} else if ($0 === 5643) {
		rt.setFv(f, "name", (never_ends = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/drinks/trophy/gold_cup"), [rt.getStep(f, live(user), 0)]))), "Overextending The Joke: First Place");
		rt.setFv(f, "desc", live(never_ends), "And so we are left alone with our regrets.");
	} else {
		rt.modSrcVar(f, "y", 2, add);
	}
	rt.setSv(f, "speaking", 0);
	rt.incSrcVar(f, "times_spoken_to", 1, true);
	return f.dot;
}, true);

// /obj/structure/speaking_tile/proc/SpeakPeace  (code/modules/awaymissions/super_secret_room.dm:89)  may sleep
rt.def("/obj/structure/speaking_tile/proc/SpeakPeace", function* SpeakPeace(f: Frame, statements: Value) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [statements, i, $e];
	i = null;
	rt.forRange(f, 0, 1, rt.len(f, live(statements)), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.srcCall(f, "say", fmt("<span class='deadsay'>＀</span>", [rt.index(live(statements), live(i))]));
		if (!isEqual(live(i), rt.len(f, live(statements)))) {
			yield* g.call(f, P("/proc/sleep"), null, [30]);
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

// /obj/item/rupee/proc/<init>  (code/modules/awaymissions/super_secret_room.dm:100)
rt.def("/obj/item/rupee/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 500]));
	return f.dot;
});

// /obj/item/rupee/proc/New  (code/modules/awaymissions/super_secret_room.dm:103)  may sleep
rt.def("/obj/item/rupee/proc/New", function* New(f: Frame) {
	let newcolor: Value = null;
	f.vars = () => [newcolor];
	yield* g.srcCall(f, "add_atom_colour", (newcolor = (yield* g.call(f, P("/proc/color2hex"), null, [rt.op(f, "PickWeighted", [4], [10, "green", 5, "blue", 3, "red", 1, "purple"])]))), 4);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/item/rupee/proc/Crossed  (code/modules/awaymissions/super_secret_room.dm:108)  may sleep
rt.def("/obj/item/rupee/proc/Crossed", function* Crossed(f: Frame) {
	if (!truthy((rt.istype(live(f.args[0]), T("/mob")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (truthy((yield* g.callName(f, live(f.args[0]), "put_in_hands", [live(f.src)])))) {
		if (!isEqual(live(f.src), (yield* g.callName(f, live(f.args[0]), "get_active_held_item", [])))) {
			yield* g.callName(f, live(f.args[0]), "swap_hand", []);
		}
		yield* g.srcCall(f, "equip_to_best_slot", live(f.args[0]));
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

// /obj/item/rupee/proc/equipped  (code/modules/awaymissions/super_secret_room.dm:117)  may sleep
rt.def("/obj/item/rupee/proc/equipped", function* equipped(f: Frame) {
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, rt.sv(f, "loc"), 0), rt.rsc("sound/misc/server-ready.ogg"), 50, 1, -1]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user", "slot"] });
