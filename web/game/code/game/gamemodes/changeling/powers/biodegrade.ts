// From code/game/gamemodes/changeling/powers/biodegrade.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11226, "/obj/effect/proc_holder/changeling/biodegrade", "/obj/effect/proc_holder/changeling", {
	helptext: "This is obvious to nearby people, and can destroy standard restraints and closets.",
	chemical_cost: 30,
	dna_cost: 2,
	req_human: 1,
	name: "Biodegrade",
	desc: "Dissolves restraints or other objects preventing free movement.",
});

// /obj/effect/proc_holder/changeling/biodegrade/proc/sting_action  (code/game/gamemodes/changeling/powers/biodegrade.dm:11)  may sleep
rt.def("/obj/effect/proc_holder/changeling/biodegrade/proc/sting_action", function* sting_action(f: Frame, user: Value) {
	let used: Value = null, O: Value = null, S: Value = null, C: Value = null;
	f.vars = () => [user, used, O, S, C];
	used = 0;
	if ((!truthy((yield* g.callName(f, live(user), "restrained", []))) && truthy((rt.istype(rt.fv(f, "loc", live(user)), T("/turf/open")) ? 1 : 0)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>We are already free!</span>"]);
		return 0;
	}
	if (truthy(rt.fv(f, "handcuffed", live(user)))) {
		if (!truthy((rt.istype((O = (yield* g.callName(f, live(user), "get_item_by_slot", [3]))), T("/obj")) ? 1 : 0))) {
			return 0;
		}
		yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀ vomits a glob of acid on ＀ ＀!</span>", [live(user), (yield* g.callName(f, live(user), "p_their", [])), live(O)]), "<span class='warning'>We vomit acidic ooze onto our restraints!</span>"]);
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/effect/proc_holder/changeling/biodegrade/proc/dissolve_handcuffs"), live(user), live(O)])), 30]);
		used = 1;
	}
	if (((truthy(rt.fv(f, "wear_suit", live(user))) && truthy(rt.gv(f, "breakouttime", rt.fv(f, "wear_suit", live(user))))) && !truthy(live(used)))) {
		if (!truthy((rt.istype((S = (yield* g.callName(f, live(user), "get_item_by_slot", [13]))), T("/obj/item/clothing/suit")) ? 1 : 0))) {
			return 0;
		}
		yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀ vomits a glob of acid across the front of ＀ ＀!</span>", [live(user), (yield* g.callName(f, live(user), "p_their", [])), live(S)]), "<span class='warning'>We vomit acidic ooze onto our straight jacket!</span>"]);
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/effect/proc_holder/changeling/biodegrade/proc/dissolve_straightjacket"), live(user), live(S)])), 30]);
		used = 1;
	}
	if ((truthy((rt.istype(rt.fv(f, "loc", live(user)), T("/obj/structure/closet")) ? 1 : 0)) && !truthy(live(used)))) {
		if (!truthy((rt.istype((C = rt.fv(f, "loc", live(user))), T("/obj/structure/closet")) ? 1 : 0))) {
			return 0;
		}
		yield* g.callName(f, live(C), "visible_message", [fmt("<span class='warning'>＀'s hinges suddenly begin to melt and run!</span>", [live(C)])]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>We vomit acidic goop onto the interior of ＀!</span>", [live(C)])]);
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/effect/proc_holder/changeling/biodegrade/proc/open_closet"), live(user), live(C)])), 70]);
		used = 1;
	}
	if ((truthy((rt.istype(rt.fv(f, "loc", live(user)), T("/obj/structure/spider/cocoon")) ? 1 : 0)) && !truthy(live(used)))) {
		if (!truthy((rt.istype((C = rt.fv(f, "loc", live(user))), T("/obj/structure/spider/cocoon")) ? 1 : 0))) {
			return 0;
		}
		yield* g.callName(f, live(C), "visible_message", [fmt("<span class='warning'>＀ shifts and starts to fall apart!</span>", [live(f.src)])]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>We secrete acidic enzymes from our skin and begin melting our cocoon...</span>"]);
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/effect/proc_holder/changeling/biodegrade/proc/dissolve_cocoon"), live(user), live(C)])), 25]);
		used = 1;
	}
	return live(used);
}, true);

// /obj/effect/proc_holder/changeling/biodegrade/proc/dissolve_handcuffs  (code/game/gamemodes/changeling/powers/biodegrade.dm:56)  may sleep
rt.def("/obj/effect/proc_holder/changeling/biodegrade/proc/dissolve_handcuffs", function* dissolve_handcuffs(f: Frame, user: Value, O: Value) {
	f.vars = () => [user, O];
	if (!(truthy(live(O)) && isEqual(rt.fv(f, "handcuffed", live(user)), live(O)))) return f.dot;
	yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ dissolves into a puddle of sizzling goop.</span>", [live(O)]));
	yield* g.call(f, P("/proc/qdel"), null, [live(O)]);
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living/carbon/human" }, { type: 4, path: "/obj" }] });

// /obj/effect/proc_holder/changeling/biodegrade/proc/dissolve_straightjacket  (code/game/gamemodes/changeling/powers/biodegrade.dm:61)  may sleep
rt.def("/obj/effect/proc_holder/changeling/biodegrade/proc/dissolve_straightjacket", function* dissolve_straightjacket(f: Frame, user: Value, S: Value) {
	f.vars = () => [user, S];
	if (!(truthy(live(S)) && isEqual(rt.fv(f, "wear_suit", live(user)), live(S)))) return f.dot;
	yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ dissolves into a puddle of sizzling goop.</span>", [live(S)]));
	yield* g.call(f, P("/proc/qdel"), null, [live(S)]);
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living/carbon/human" }, { type: 4, path: "/obj" }] });

// /obj/effect/proc_holder/changeling/biodegrade/proc/open_closet  (code/game/gamemodes/changeling/powers/biodegrade.dm:66)  may sleep
rt.def("/obj/effect/proc_holder/changeling/biodegrade/proc/open_closet", function* open_closet(f: Frame, user: Value, C: Value) {
	f.vars = () => [user, C];
	if (!(truthy(live(C)) && isEqual(rt.fv(f, "loc", live(user)), live(C)))) return f.dot;
	yield* g.callName(f, live(C), "visible_message", [fmt("<span class='warning'>＀'s door breaks and opens!</span>", [live(C)])]);
	rt.setFv(f, "welded", live(C), 0);
	rt.setFv(f, "locked", live(C), 0);
	rt.setFv(f, "broken", live(C), 1);
	yield* g.callName(f, live(C), "open", []);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>We open the container restraining us!</span>"]);
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living/carbon/human" }, { type: 4, path: "/obj/structure/closet" }] });

// /obj/effect/proc_holder/changeling/biodegrade/proc/dissolve_cocoon  (code/game/gamemodes/changeling/powers/biodegrade.dm:75)  may sleep
rt.def("/obj/effect/proc_holder/changeling/biodegrade/proc/dissolve_cocoon", function* dissolve_cocoon(f: Frame, user: Value, C: Value) {
	f.vars = () => [user, C];
	if (!(truthy(live(C)) && isEqual(rt.fv(f, "loc", live(user)), live(C)))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(C)]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>We dissolve the cocoon!</span>"]);
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living/carbon/human" }, { type: 4, path: "/obj/structure/spider/cocoon" }] });
