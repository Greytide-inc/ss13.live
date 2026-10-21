// From code/modules/mob/dead/new_player/logout.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/dead/new_player/proc/Logout  (code/modules/mob/dead/new_player/logout.dm:3)  may sleep
rt.def("/mob/dead/new_player/proc/Logout", function* Logout(f: Frame) {
	rt.setSv(f, "ready", 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "spawning"))) {
		rt.setSv(f, "key", null);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	return live(f.dot);
}, true);
