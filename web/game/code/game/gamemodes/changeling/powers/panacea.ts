// From code/game/gamemodes/changeling/powers/panacea.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11246, "/obj/effect/proc_holder/changeling/panacea", "/obj/effect/proc_holder/changeling", {
	helptext: "Can be used while unconscious.",
	chemical_cost: 20,
	dna_cost: 1,
	req_stat: 1,
	name: "Anatomic Panacea",
	desc: "Expels impurifications from our form; curing diseases, removing parasites, sobering us, purging toxins and radiation, and resetting our genetic code completely.",
});

// /obj/effect/proc_holder/changeling/panacea/proc/sting_action  (code/game/gamemodes/changeling/powers/panacea.dm:11)  may sleep
rt.def("/obj/effect/proc_holder/changeling/panacea/proc/sting_action", function* sting_action(f: Frame, user: Value) {
	let bad_organs: Value = null, o: Value = null, O: Value = null, C: Value = null, D: Value = null;
	let $e: any;
	f.vars = () => [user, bad_organs, o, O, C, D, $e];
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>We cleanse impurities from our form.</span>"]);
	bad_organs = rt.list((yield* g.callName(f, live(user), "getorgan", [T("/obj/item/organ/body_egg")])), (yield* g.callName(f, live(user), "getorgan", [T("/obj/item/organ/zombie_infection")])));
	o = null;
	rt.forList(f, 0, live(bad_organs));
	while (($e = rt.next(f, 0)) !== undefined) {
		o = $e;
		if (!truthy((rt.istype((O = live(o)), T("/obj/item/organ")) ? 1 : 0))) {
			continue;
		}
		yield* g.callName(f, live(O), "Remove", [live(user)]);
		if (truthy((rt.istype(live(user), T("/mob/living/carbon")) ? 1 : 0))) {
			yield* g.callName(f, (C = live(user)), "vomit", [null, 0, "toxic", 1], rt.Args.Named);
		}
		yield* g.callName(f, live(O), "forceMove", [rt.getStep(f, live(user), 0)]);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, rt.fv(f, "reagents", live(user)), "add_reagent", ["mutadone", 10]);
	yield* g.callName(f, rt.fv(f, "reagents", live(user)), "add_reagent", ["pen_acid", 20]);
	yield* g.callName(f, rt.fv(f, "reagents", live(user)), "add_reagent", ["antihol", 10]);
	yield* g.callName(f, rt.fv(f, "reagents", live(user)), "add_reagent", ["mannitol", 25]);
	D = null;
	rt.forList(f, 0, rt.fv(f, "viruses", live(user)), T("/datum/disease"));
	while (($e = rt.next(f, 0)) !== undefined) {
		D = $e;
		yield* g.callName(f, live(D), "cure", []);
	}
	rt.endFor(f, 0);
	return 1;
}, true);
