// Based on /tg/station's code/game/gamemodes/changeling/powers/panacea.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(11246, "/obj/effect/proc_holder/changeling/panacea", "/obj/effect/proc_holder/changeling", {
	helptext: "Can be used while unconscious.",
	chemical_cost: 20,
	dna_cost: 1,
	req_stat: 1,
	name: "Anatomic Panacea",
	desc: "Expels impurifications from our form; curing diseases, removing parasites, sobering us, purging toxins and radiation, and resetting our genetic code completely.",
});

// panacea.dm:11
rt.def("/obj/effect/proc_holder/changeling/panacea/proc/sting_action", function* sting_action(f: Frame, user: Value) {
	let o: Value = null, O: Value = null, C: Value = null, D: Value = null;
	to_chat(user, "<span class='notice'>We cleanse impurities from our form.</span>");
	let bad_organs: Value = list(user.getorgan(T("/obj/item/organ/body_egg")), user.getorgan(T("/obj/item/organ/zombie_infection")));
	for (o of each(bad_organs)) {
		if (!rt.istype((O = o), T("/obj/item/organ"))) {
			continue;
		}
		yield* O.Remove(user);
		if (rt.istype(user, T("/mob/living/carbon"))) {
			yield* (C = user).vomit(0, { toxic: 1 });
		}
		yield* O.forceMove(rt.getStep(f, user, 0));
	}
	yield* user.reagents.add_reagent("mutadone", 10);
	yield* user.reagents.add_reagent("pen_acid", 20);
	yield* user.reagents.add_reagent("antihol", 10);
	yield* user.reagents.add_reagent("mannitol", 25);
	for (D of each(user.viruses, T("/datum/disease"))) {
		yield* D.cure();
	}
	return 1;
}, true);
