// From code/game/gamemodes/changeling/powers/humanform.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11235, "/obj/effect/proc_holder/changeling/humanform", "/obj/effect/proc_holder/changeling", {
	chemical_cost: 5,
	req_dna: 1,
	name: "Human Form",
	desc: "We change into a human.",
});

// /obj/effect/proc_holder/changeling/humanform/proc/sting_action  (code/game/gamemodes/changeling/powers/humanform.dm:9)  may sleep
rt.def("/obj/effect/proc_holder/changeling/humanform/proc/sting_action", function* sting_action(f: Frame, user: Value) {
	let changeling: Value = null, names: Value = null, prof: Value = null, chosen_name: Value = null, chosen_prof: Value = null, newmob: Value = null;
	let $e: any;
	f.vars = () => [user, changeling, names, prof, chosen_name, chosen_prof, newmob, $e];
	changeling = rt.gv(f, "changeling", rt.fv(f, "mind", live(user)));
	names = rt.list();
	prof = null;
	rt.forList(f, 0, rt.fv(f, "stored_profiles", live(changeling)), T("/datum/changelingprofile"));
	while (($e = rt.next(f, 0)) !== undefined) {
		prof = $e;
		names = rt.modify(live(names), fmt("＀", [rt.fv(f, "name", live(prof))]), add);
	}
	rt.endFor(f, 0);
	if (!truthy((chosen_name = (yield* g.op(f, "Prompt", [1], [null, null, "Target DNA", "Select the target DNA: ", live(names)]))))) {
		return live(f.dot);
	}
	if (!truthy((chosen_prof = (yield* g.callName(f, live(changeling), "get_dna", [live(chosen_name)]))))) {
		return live(f.dot);
	}
	if ((!truthy(live(user)) || truthy(rt.fv(f, "notransform", live(user))))) {
		return 0;
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>We transform our appearance.</span>"]);
	(rt.modField(f, live(changeling), "purchasedpowers", live(f.src), subtract));
	yield* g.call(f, P("/proc/changeling_transform"), null, [(newmob = (yield* g.callName(f, live(user), "humanize", [279]))), live(chosen_prof)]);
	return 1;
}, true);
