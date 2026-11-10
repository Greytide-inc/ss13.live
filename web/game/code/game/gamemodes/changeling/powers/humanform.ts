// Based on /tg/station's code/game/gamemodes/changeling/powers/humanform.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


rt.type(11235, "/obj/effect/proc_holder/changeling/humanform", "/obj/effect/proc_holder/changeling", {
	chemical_cost: 5,
	req_dna: 1,
	name: "Human Form",
	desc: "We change into a human.",
});

// humanform.dm:9
rt.def("/obj/effect/proc_holder/changeling/humanform/proc/sting_action", function* sting_action(f: Frame, user: Value) {
	let prof: Value = null, chosen_name: Value = null, chosen_prof: Value = null, newmob: Value = null;
	let changeling: Value = user.mind.changeling;
	let names: Value = list();
	for (prof of each(changeling.stored_profiles, T("/datum/changelingprofile"))) {
		names += `${prof.name}`;
	}
	if (!(chosen_name = (yield* g.op(f, "Prompt", [TR_KEEPITEMS], [null, null, "Target DNA", "Select the target DNA: ", names])))) {
		return f.dot;
	}
	if (!(chosen_prof = changeling.get_dna(chosen_name))) {
		return f.dot;
	}
	if (!user || user.notransform) {
		return 0;
	}
	to_chat(user, "<span class='notice'>We transform our appearance.</span>");
	changeling.purchasedpowers -= this;
	yield* changeling_transform((newmob = (yield* user.humanize(279))), chosen_prof);
	return TR_KEEPITEMS;
}, true);
