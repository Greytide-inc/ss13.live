// From code/modules/mob/living/silicon/login.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/silicon/proc/Login  (code/modules/mob/living/silicon/login.dm:2)  may sleep
rt.def("/mob/living/silicon/proc/Login", function* Login(f: Frame) {
	if ((truthy(rt.sv(f, "mind")) && truthy(rt.fv(f, "mode", rt.gl("SSticker"))))) {
		yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "remove_cultist", [rt.sv(f, "mind"), 0, 0]);
		yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "remove_revolutionary", [rt.sv(f, "mind"), 0]);
		yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "remove_gangster", [null, rt.sv(f, "mind"), "remove_bosses", 1], rt.Args.Named);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);
