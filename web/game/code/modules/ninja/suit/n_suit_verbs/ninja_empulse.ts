// From code/modules/ninja/suit/n_suit_verbs/ninja_empulse.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /obj/item/clothing/suit/space/space_ninja/proc/ninjapulse  (code/modules/ninja/suit/n_suit_verbs/ninja_empulse.dm:6)  may sleep
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/ninjapulse", function* ninjapulse(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if (truthy((yield* g.srcCall(f, "ninjacost", 250, 1)))) return f.dot;
	yield* g.call(f, P("/proc/playsound"), null, [rt.gv(f, "loc", (H = rt.sv(f, "affecting"))), rt.rsc("sound/effects/empulse.ogg"), 60, 2]);
	yield* g.call(f, P("/proc/empulse"), null, [live(H), 4, 6]);
	rt.setSv(f, "s_coold", 2);
	return f.dot;
}, true);
