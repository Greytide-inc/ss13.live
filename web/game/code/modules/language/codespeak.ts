// Based on /tg/station's code/modules/language/codespeak.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(2777, "/datum/language/codespeak", "/datum/language", {
	name: "Codespeak",
	desc: "Syndicate operatives can use a series of codewords to convey complex information, while sounding like random concepts and drinks to anyone listening in.",
	key: "t",
	default_priority: 0,
	flags: 10,
	icon_state: "codespeak",
});

// codespeak.dm:10
rt.def("/datum/language/codespeak/proc/scramble", function scramble(f: Frame, input: Value) {
	let lookup: Value = null;
	if (lookup = this.check_cache(input)) {
		return lookup;
	}
	f.dot = "";
	let words: Value = list();
	while (rt.length(f.dot) < rt.length(input)) {
		f.dot = jointext((words += generate_code_phrase({ return_list: 1 })), ", ");
	}
	f.dot = capitalize(f.dot);
	let input_ending: Value = copytext(input, rt.length(input));
	if (!GLOB.endings) {
		GLOB.endings = list("!", "?", ".");
	}
	if (rt.isIn(f, input_ending, GLOB.endings)) {
		f.dot += input_ending;
	}
	this.add_to_cache(input, f.dot);
	return f.dot;
});

rt.type(7511, "/obj/item/weapon/codespeak_manual", "/obj/item/weapon", {
	charges: 1,
	name: "codespeak manual",
	desc: "The book's cover reads: \"Codespeak(tm) - Secure your communication with metaphors so elaborate, they seem randomly generated!\"",
	icon: rt.rsc("icons/obj/library.dmi"),
	icon_state: "book2",
});

// codespeak.dm:41
rt.def("/obj/item/weapon/codespeak_manual/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	if (!rt.istype(user, T("/mob/living"))) {
		return f.dot;
	}
	if (yield* user.has_language(T("/datum/language/codespeak"))) {
		to_chat(user, `<span class='boldannounce'>You start skimming through ${this}, but you already know Codespeak.</span>`);
		return f.dot;
	}
	to_chat(user, `<span class='boldannounce'>You start skimming through ${this}, and suddenly your mind is filled with codewords and responses.</span>`);
	yield* user.grant_language(T("/datum/language/codespeak"));
	yield* this.use_charge(user);
	return f.dot;
}, true);

// codespeak.dm:54
rt.def("/obj/item/weapon/codespeak_manual/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	if (!rt.istype(M, T("/mob/living")) || !rt.istype(user, T("/mob/living"))) {
		return f.dot;
	}
	if (M == user) {
		yield* this.attack_self(user);
		return f.dot;
	}
	playsound(this.loc, "punch", 25, 1, -1);
	if (M.stat == 2) {
		M.visible_message(`<span class='danger'>${user} smacks ${M}'s lifeless corpse with ${this}.</span>`, `<span class='userdanger'>${user} smacks your lifeless corpse with ${this}.</span>`, "<span class='italics'>You hear smacking.</span>");
	} else if (yield* M.has_language(T("/datum/language/codespeak"))) {
		M.visible_message(`<span class='danger'>${user} beats ${M} over the head with ${this}!</span>`, `<span class='userdanger'>${user} beats you over the head with ${this}!</span>`, "<span class='italics'>You hear smacking.</span>");
	} else {
		M.visible_message(`<span class='notice'>${user} teaches ${M} by beating them over the head with ${this}!</span>`, `<span class='boldnotice'>As ${user} hits you with ${this}, codewords and responses flow through your mind.</span>`, "<span class='italics'>You hear smacking.</span>");
		yield* M.grant_language(T("/datum/language/codespeak"));
		yield* this.use_charge(user);
	}
	return f.dot;
}, true);

// codespeak.dm:72
rt.def("/obj/item/weapon/codespeak_manual/proc/use_charge", function* use_charge(f: Frame, user: Value) {
	let _T: Value = null;
	this.charges--;
	if (this.charges) return f.dot;
	(_T = rt.getStep(f, this, 0)).visible_message(`<span class='warning'>The cover and contents of ${this} start shifting and changing!</span>`);
	yield* qdel(this);
	let book: Value = (yield* new_(T("/obj/item/weapon/book/manual/random"), _T));
	yield* user.put_in_active_hand(book);
	return f.dot;
}, true);
