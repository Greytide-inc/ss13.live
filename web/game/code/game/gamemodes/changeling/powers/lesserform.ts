// Based on /tg/station's code/game/gamemodes/changeling/powers/lesserform.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(11236, "/obj/effect/proc_holder/changeling/lesserform", "/obj/effect/proc_holder/changeling", {
	chemical_cost: 5,
	dna_cost: 1,
	req_human: 1,
	name: "Lesser Form",
	desc: "We debase ourselves and become lesser. We become a monkey.",
});

// lesserform.dm:10
rt.def("/obj/effect/proc_holder/changeling/lesserform/proc/sting_action", function* sting_action(f: Frame, user: Value) {
	if (!user || user.notransform) {
		return 0;
	}
	to_chat(user, "<span class='warning'>Our genes cry out!</span>");
	yield* user.monkeyize(311);
	return TR_KEEPITEMS;
}, true);
