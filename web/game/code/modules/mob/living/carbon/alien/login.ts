// From code/modules/mob/living/carbon/alien/login.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/carbon/alien/proc/Login  (code/modules/mob/living/carbon/alien/login.dm:2)  may sleep
rt.def("/mob/living/carbon/alien/proc/Login", function* Login(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "AddInfectionImages");
	return live(f.dot);
}, true);
