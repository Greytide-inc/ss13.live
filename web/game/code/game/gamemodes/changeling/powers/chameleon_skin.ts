// From code/game/gamemodes/changeling/powers/chameleon_skin.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11227, "/obj/effect/proc_holder/changeling/chameleon_skin", "/obj/effect/proc_holder/changeling", {
	helptext: "Allows us to become invisible after a few seconds of standing still. Can be toggled on and off.",
	dna_cost: 2,
	chemical_cost: 25,
	req_human: 1,
	name: "Chameleon Skin",
	desc: "Our skin pigmentation rapidly changes to suit our current environment.",
});

// /obj/effect/proc_holder/changeling/chameleon_skin/proc/sting_action  (code/game/gamemodes/changeling/powers/chameleon_skin.dm:10)  may sleep
rt.def("/obj/effect/proc_holder/changeling/chameleon_skin/proc/sting_action", function* sting_action(f: Frame, user: Value) {
	let H: Value = null, HM: Value = null;
	f.vars = () => [user, H, HM];
	if (!truthy((rt.istype((H = live(user)), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (truthy((rt.isIn(f, (HM = rt.at(rt.gl("mutations_list"), "Chameleon")), rt.gv(f, "mutations", rt.fv(f, "dna", live(H)))) ? 1 : 0))) {
		yield* g.callName(f, live(HM), "force_lose", [live(H)]);
	} else {
		yield* g.callName(f, live(HM), "force_give", [live(H)]);
	}
	return 1;
}, true);

// /obj/effect/proc_holder/changeling/chameleon_skin/proc/on_refund  (code/game/gamemodes/changeling/powers/chameleon_skin.dm:21)  may sleep
rt.def("/obj/effect/proc_holder/changeling/chameleon_skin/proc/on_refund", function* on_refund(f: Frame, user: Value) {
	let C: Value = null, HM: Value = null;
	f.vars = () => [user, C, HM];
	if (!truthy((yield* g.callName(f, live(user), "has_dna", [])))) return f.dot;
	C = live(user);
	if (!truthy((rt.isIn(f, (HM = rt.at(rt.gl("mutations_list"), "Chameleon")), rt.gv(f, "mutations", rt.fv(f, "dna", live(C)))) ? 1 : 0))) return f.dot;
	yield* g.callName(f, live(HM), "force_lose", [live(C)]);
	return f.dot;
}, true);
