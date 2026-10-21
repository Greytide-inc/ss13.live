// From code/game/gamemodes/changeling/powers/digitalcamo.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11228, "/obj/effect/proc_holder/changeling/digitalcamo", "/obj/effect/proc_holder/changeling", {
	helptext: "We cannot be tracked by camera or seen by AI units while using this skill. However, humans looking at us will find us... uncanny.",
	dna_cost: 1,
	name: "Digital Camouflage",
	desc: "By evolving the ability to distort our form and proprotions, we defeat common altgorithms used to detect lifeforms on cameras.",
});

// /obj/effect/proc_holder/changeling/digitalcamo/proc/sting_action  (code/game/gamemodes/changeling/powers/digitalcamo.dm:10)
rt.def("/obj/effect/proc_holder/changeling/digitalcamo/proc/sting_action", function sting_action(f: Frame, user: Value) {
	if (truthy(rt.fv(f, "digitalcamo", live(user)))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>We return to normal.</span>"]);
		rt.setFv(f, "digitalinvis", live(user), 0);
		rt.setFv(f, "digitalcamo", live(user), 0);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>We distort our form to hide from the AI</span>"]);
		rt.setFv(f, "digitalcamo", live(user), 1);
		rt.setFv(f, "digitalinvis", live(user), 1);
	}
	return 1;
});

// /obj/effect/proc_holder/changeling/digitalcamo/proc/on_refund  (code/game/gamemodes/changeling/powers/digitalcamo.dm:21)
rt.def("/obj/effect/proc_holder/changeling/digitalcamo/proc/on_refund", function on_refund(f: Frame, user: Value) {
	rt.setFv(f, "digitalcamo", live(user), 0);
	rt.setFv(f, "digitalinvis", live(user), 0);
	return f.dot;
});
