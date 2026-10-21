// From code/modules/mob/living/silicon/examine.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/silicon/proc/examine  (code/modules/mob/living/silicon/examine.dm:2)
rt.def("/mob/living/silicon/proc/examine", function examine(f: Frame, user: Value) {
	if (!(truthy(rt.sv(f, "laws")) && truthy((rt.istype(live(user), T("/mob/dead/observer")) ? 1 : 0)))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<b>＀ has the following laws:</b>", [live(f.src)])]);
	rt.callName(f, rt.sv(f, "laws"), "show_laws", [live(user)]);
	return f.dot;
});
