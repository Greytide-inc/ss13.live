// Based on /tg/station's code/game/gamemodes/changeling/powers/chameleon_skin.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(11227, "/obj/effect/proc_holder/changeling/chameleon_skin", "/obj/effect/proc_holder/changeling", {
	helptext: "Allows us to become invisible after a few seconds of standing still. Can be toggled on and off.",
	dna_cost: 2,
	chemical_cost: 25,
	req_human: 1,
	name: "Chameleon Skin",
	desc: "Our skin pigmentation rapidly changes to suit our current environment.",
});

// chameleon_skin.dm:10
rt.def("/obj/effect/proc_holder/changeling/chameleon_skin/proc/sting_action", function* sting_action(f: Frame, user: Value) {
	let H: Value = null, HM: Value = null;
	if (!rt.istype((H = user), T("/mob/living/carbon/human"))) {
		return f.dot;
	}
	if (rt.isIn(f, (HM = rt.at(GLOB.mutations_list, "Chameleon")), H.dna.mutations)) {
		yield* HM.force_lose(H);
	} else {
		yield* HM.force_give(H);
	}
	return 1;
}, true);

// chameleon_skin.dm:21
rt.def("/obj/effect/proc_holder/changeling/chameleon_skin/proc/on_refund", function* on_refund(f: Frame, user: Value) {
	let HM: Value = null;
	if (!user.has_dna()) return f.dot;
	let C: Value = user;
	if (!rt.isIn(f, (HM = rt.at(GLOB.mutations_list, "Chameleon")), C.dna.mutations)) return f.dot;
	yield* HM.force_lose(C);
	return f.dot;
}, true);
