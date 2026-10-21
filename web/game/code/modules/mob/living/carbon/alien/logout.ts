// From code/modules/mob/living/carbon/alien/logout.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/carbon/alien/proc/Logout  (code/modules/mob/living/carbon/alien/logout.dm:2)  may sleep
rt.def("/mob/living/carbon/alien/proc/Logout", function* Logout(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "RemoveInfectionImages");
	return live(f.dot);
}, true);
