// From code/modules/mob/living/logout.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/proc/Logout  (code/modules/mob/living/logout.dm:2)  may sleep
rt.def("/mob/living/proc/Logout", function* Logout(f: Frame) {
	if ((truthy(rt.sv(f, "ranged_ability")) && truthy(rt.sv(f, "client")))) {
		yield* g.callName(f, rt.sv(f, "ranged_ability"), "remove_mousepointer", [rt.sv(f, "client")]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!(!truthy(rt.sv(f, "key")) && truthy(rt.sv(f, "mind")))) return f.dot;
	rt.setFv(f, "active", rt.sv(f, "mind"), 0);
	return f.dot;
}, true);
