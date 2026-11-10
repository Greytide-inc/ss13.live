// Based on /tg/station's code/game/gamemodes/changeling/powers/biodegrade.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(11226, "/obj/effect/proc_holder/changeling/biodegrade", "/obj/effect/proc_holder/changeling", {
	helptext: "This is obvious to nearby people, and can destroy standard restraints and closets.",
	chemical_cost: 30,
	dna_cost: 2,
	req_human: 1,
	name: "Biodegrade",
	desc: "Dissolves restraints or other objects preventing free movement.",
});

// biodegrade.dm:11
rt.def("/obj/effect/proc_holder/changeling/biodegrade/proc/sting_action", function* sting_action(f: Frame, user: Value) {
	let O: Value = null, S: Value = null, C: Value = null;
	let used: Value = 0;
	if (!user.restrained() && rt.istype(user.loc, T("/turf/open"))) {
		to_chat(user, "<span class='warning'>We are already free!</span>");
		return 0;
	}
	if (user.handcuffed) {
		if (!rt.istype((O = user.get_item_by_slot(slot_handcuffed)), T("/obj"))) {
			return 0;
		}
		user.visible_message(`<span class='warning'>${user} vomits a glob of acid on ${user.p_their()} ${O}!</span>`, "<span class='warning'>We vomit acidic ooze onto our restraints!</span>");
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/effect/proc_holder/changeling/biodegrade/proc/dissolve_handcuffs"), user, O)), 30);
		used = 1;
	}
	if (user.wear_suit && user.wear_suit.breakouttime && !used) {
		if (!rt.istype((S = user.get_item_by_slot(slot_wear_suit)), T("/obj/item/clothing/suit"))) {
			return 0;
		}
		user.visible_message(`<span class='warning'>${user} vomits a glob of acid across the front of ${user.p_their()} ${S}!</span>`, "<span class='warning'>We vomit acidic ooze onto our straight jacket!</span>");
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/effect/proc_holder/changeling/biodegrade/proc/dissolve_straightjacket"), user, S)), 30);
		used = 1;
	}
	if (rt.istype(user.loc, T("/obj/structure/closet")) && !used) {
		if (!rt.istype((C = user.loc), T("/obj/structure/closet"))) {
			return 0;
		}
		C.visible_message(`<span class='warning'>${C}'s hinges suddenly begin to melt and run!</span>`);
		to_chat(user, `<span class='warning'>We vomit acidic goop onto the interior of ${C}!</span>`);
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/effect/proc_holder/changeling/biodegrade/proc/open_closet"), user, C)), 70);
		used = 1;
	}
	if (rt.istype(user.loc, T("/obj/structure/spider/cocoon")) && !used) {
		if (!rt.istype((C = user.loc), T("/obj/structure/spider/cocoon"))) {
			return 0;
		}
		C.visible_message(`<span class='warning'>${this} shifts and starts to fall apart!</span>`);
		to_chat(user, "<span class='warning'>We secrete acidic enzymes from our skin and begin melting our cocoon...</span>");
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/effect/proc_holder/changeling/biodegrade/proc/dissolve_cocoon"), user, C)), 25);
		used = 1;
	}
	return used;
}, true);

// biodegrade.dm:56
rt.def("/obj/effect/proc_holder/changeling/biodegrade/proc/dissolve_handcuffs", function* dissolve_handcuffs(f: Frame, user: Value, O: Value) {
	if (!(O && user.handcuffed == O)) return f.dot;
	this.visible_message(`<span class='warning'>${O} dissolves into a puddle of sizzling goop.</span>`);
	yield* qdel(O);
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living/carbon/human" }, { type: 4, path: "/obj" }] });

// biodegrade.dm:61
rt.def("/obj/effect/proc_holder/changeling/biodegrade/proc/dissolve_straightjacket", function* dissolve_straightjacket(f: Frame, user: Value, S: Value) {
	if (!(S && user.wear_suit == S)) return f.dot;
	this.visible_message(`<span class='warning'>${S} dissolves into a puddle of sizzling goop.</span>`);
	yield* qdel(S);
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living/carbon/human" }, { type: 4, path: "/obj" }] });

// biodegrade.dm:66
rt.def("/obj/effect/proc_holder/changeling/biodegrade/proc/open_closet", function* open_closet(f: Frame, user: Value, C: Value) {
	if (!(C && user.loc == C)) return f.dot;
	C.visible_message(`<span class='warning'>${C}'s door breaks and opens!</span>`);
	C.welded = 0;
	C.locked = 0;
	C.broken = 1;
	yield* C.open();
	to_chat(user, "<span class='warning'>We open the container restraining us!</span>");
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living/carbon/human" }, { type: 4, path: "/obj/structure/closet" }] });

// biodegrade.dm:75
rt.def("/obj/effect/proc_holder/changeling/biodegrade/proc/dissolve_cocoon", function* dissolve_cocoon(f: Frame, user: Value, C: Value) {
	if (!(C && user.loc == C)) return f.dot;
	yield* qdel(C);
	to_chat(user, "<span class='warning'>We dissolve the cocoon!</span>");
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living/carbon/human" }, { type: 4, path: "/obj/structure/spider/cocoon" }] });
