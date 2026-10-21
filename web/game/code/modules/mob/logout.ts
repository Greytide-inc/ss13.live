// From code/modules/mob/logout.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/proc/Logout  (code/modules/mob/logout.dm:2)  may sleep
rt.def("/mob/proc/Logout", function* Logout(f: Frame) {
	yield* g.srcCall(f, "set_typing_indicator", 0);
	yield* g.callName(f, rt.gl("SStgui"), "on_logout", [live(f.src)]);
	yield* g.srcCall(f, "unset_machine");
	(rt.modGl("player_list", live(f.src), subtract));
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "loc"))) {
		yield* g.callName(f, rt.sv(f, "loc"), "on_log", [0]);
	}
	return 1;
}, true);
