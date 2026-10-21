// From code/modules/mob/living/silicon/robot/login.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/silicon/robot/proc/Login  (code/modules/mob/living/silicon/robot/login.dm:3)  may sleep
rt.def("/mob/living/silicon/robot/proc/Login", function* Login(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "regenerate_icons");
	yield* g.srcCall(f, "show_laws", 0);
	if (!truthy(rt.sv(f, "mind"))) return f.dot;
	yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "remove_revolutionary", [rt.sv(f, "mind")]);
	yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "remove_gangster", [null, rt.sv(f, "mind"), null, 1, "remove_bosses", 1], rt.Args.Named);
	return f.dot;
}, true);
