// From code/game/gamemodes/changeling/powers/lesserform.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11236, "/obj/effect/proc_holder/changeling/lesserform", "/obj/effect/proc_holder/changeling", {
	chemical_cost: 5,
	dna_cost: 1,
	req_human: 1,
	name: "Lesser Form",
	desc: "We debase ourselves and become lesser. We become a monkey.",
});

// /obj/effect/proc_holder/changeling/lesserform/proc/sting_action  (code/game/gamemodes/changeling/powers/lesserform.dm:10)  may sleep
rt.def("/obj/effect/proc_holder/changeling/lesserform/proc/sting_action", function* sting_action(f: Frame, user: Value) {
	f.vars = () => [user];
	if ((!truthy(live(user)) || truthy(rt.fv(f, "notransform", live(user))))) {
		return 0;
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Our genes cry out!</span>"]);
	yield* g.callName(f, live(user), "monkeyize", [311]);
	return 1;
}, true);
