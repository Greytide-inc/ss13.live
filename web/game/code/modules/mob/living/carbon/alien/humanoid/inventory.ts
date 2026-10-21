// From code/modules/mob/living/carbon/alien/humanoid/inventory.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/carbon/alien/humanoid/proc/doUnEquip  (code/modules/mob/living/carbon/alien/humanoid/inventory.dm:2)  may sleep
rt.def("/mob/living/carbon/alien/humanoid/proc/doUnEquip", function* doUnEquip(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(!truthy(live(f.dot)) || !truthy(live(f.args[0])))) return f.dot;
	return live(f.dot);
}, true, { args: ["I"] });
