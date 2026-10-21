// From code/modules/language/codespeak.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(2777, "/datum/language/codespeak", "/datum/language", {
	name: "Codespeak",
	desc: "Syndicate operatives can use a series of codewords to convey complex information, while sounding like random concepts and drinks to anyone listening in.",
	key: "t",
	default_priority: 0,
	flags: 10,
	icon_state: "codespeak",
});

// /datum/language/codespeak/proc/scramble  (code/modules/language/codespeak.dm:10)
rt.def("/datum/language/codespeak/proc/scramble", function scramble(f: Frame, input: Value) {
	let lookup: Value = null, words: Value = null, input_ending: Value = null;
	f.vars = () => [lookup, words, input_ending];
	if (truthy((lookup = rt.callSrc(f, "check_cache", [live(input)])))) {
		return live(lookup);
	}
	f.dot = "";
	words = rt.list();
	while (rt.lt(rt.length(live(f.dot)), rt.length(live(input)))) {
		f.dot = rt.call(f, P("/proc/jointext"), null, [(words = rt.modify(live(words), rt.call(f, P("/proc/generate_code_phrase"), null, ["return_list", 1], rt.Args.Named), add)), ", "]);
	}
	f.dot = rt.call(f, P("/proc/capitalize"), null, [live(f.dot)]);
	input_ending = rt.call(f, P("/proc/copytext"), null, [live(input), rt.length(live(input))]);
	if (!truthy(rt.gl("endings"))) {
		rt.setGl("endings", rt.list("!", "?", "."));
	}
	if (truthy((rt.isIn(f, live(input_ending), rt.gl("endings")) ? 1 : 0))) {
		f.dot = rt.modify(live(f.dot), live(input_ending), add);
	}
	rt.callSrc(f, "add_to_cache", [live(input), live(f.dot)]);
	return f.dot;
});

rt.type(7511, "/obj/item/weapon/codespeak_manual", "/obj/item/weapon", {
	charges: 1,
	name: "codespeak manual",
	desc: "The book's cover reads: \"Codespeak(tm) - Secure your communication with metaphors so elaborate, they seem randomly generated!\"",
	icon: rt.rsc("icons/obj/library.dmi"),
	icon_state: "book2",
});

// /obj/item/weapon/codespeak_manual/proc/attack_self  (code/modules/language/codespeak.dm:41)  may sleep
rt.def("/obj/item/weapon/codespeak_manual/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy((rt.istype(live(user), T("/mob/living")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (truthy((yield* g.callName(f, live(user), "has_language", [T("/datum/language/codespeak")])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='boldannounce'>You start skimming through ＀, but you already know Codespeak.</span>", [live(f.src)])]);
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='boldannounce'>You start skimming through ＀, and suddenly your mind is filled with codewords and responses.</span>", [live(f.src)])]);
	yield* g.callName(f, live(user), "grant_language", [T("/datum/language/codespeak")]);
	yield* g.srcCall(f, "use_charge", live(user));
	return f.dot;
}, true);

// /obj/item/weapon/codespeak_manual/proc/attack  (code/modules/language/codespeak.dm:54)  may sleep
rt.def("/obj/item/weapon/codespeak_manual/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	f.vars = () => [M, user];
	if ((!truthy((rt.istype(live(M), T("/mob/living")) ? 1 : 0)) || !truthy((rt.istype(live(user), T("/mob/living")) ? 1 : 0)))) {
		return live(f.dot);
	}
	if (isEqual(live(M), live(user))) {
		yield* g.srcCall(f, "attack_self", live(user));
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), "punch", 25, 1, -1]);
	if (isEqual(rt.fv(f, "stat", live(M)), 2)) {
		yield* g.callName(f, live(M), "visible_message", [fmt("<span class='danger'>＀ smacks ＀'s lifeless corpse with ＀.</span>", [live(user), live(M), live(f.src)]), fmt("<span class='userdanger'>＀ smacks your lifeless corpse with ＀.</span>", [live(user), live(f.src)]), "<span class='italics'>You hear smacking.</span>"]);
	} else {
		if (truthy((yield* g.callName(f, live(M), "has_language", [T("/datum/language/codespeak")])))) {
			yield* g.callName(f, live(M), "visible_message", [fmt("<span class='danger'>＀ beats ＀ over the head with ＀!</span>", [live(user), live(M), live(f.src)]), fmt("<span class='userdanger'>＀ beats you over the head with ＀!</span>", [live(user), live(f.src)]), "<span class='italics'>You hear smacking.</span>"]);
		} else {
			yield* g.callName(f, live(M), "visible_message", [fmt("<span class='notice'>＀ teaches ＀ by beating them over the head with ＀!</span>", [live(user), live(M), live(f.src)]), fmt("<span class='boldnotice'>As ＀ hits you with ＀, codewords and responses flow through your mind.</span>", [live(user), live(f.src)]), "<span class='italics'>You hear smacking.</span>"]);
			yield* g.callName(f, live(M), "grant_language", [T("/datum/language/codespeak")]);
			yield* g.srcCall(f, "use_charge", live(user));
		}
	}
	return f.dot;
}, true);

// /obj/item/weapon/codespeak_manual/proc/use_charge  (code/modules/language/codespeak.dm:72)  may sleep
rt.def("/obj/item/weapon/codespeak_manual/proc/use_charge", function* use_charge(f: Frame, user: Value) {
	let _T: Value = null, book: Value = null;
	f.vars = () => [user, _T, book];
	rt.incSrcVar(f, "charges", -1, true);
	if (truthy(rt.sv(f, "charges"))) return f.dot;
	yield* g.callName(f, (_T = rt.getStep(f, live(f.src), 0)), "visible_message", [fmt("<span class='warning'>The cover and contents of ＀ start shifting and changing!</span>", [live(f.src)])]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	book = (yield* g.new_(f, T("/obj/item/weapon/book/manual/random"), [live(_T)]));
	yield* g.callName(f, live(user), "put_in_active_hand", [live(book)]);
	return f.dot;
}, true);
