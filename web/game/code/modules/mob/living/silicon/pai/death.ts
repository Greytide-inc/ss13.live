// From code/modules/mob/living/silicon/pai/death.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/silicon/pai/proc/death  (code/modules/mob/living/silicon/pai/death.dm:2)  may sleep
rt.def("/mob/living/silicon/pai/proc/death", function* death(f: Frame, gibbed: Value) {
	f.vars = () => [gibbed];
	if (isEqual(rt.sv(f, "stat"), 2)) {
		return live(f.dot);
	}
	rt.setSv(f, "stat", 2);
	rt.setSv(f, "canmove", 0);
	yield* g.callName(f, rt.sv(f, "card"), "removePersonality", []);
	yield* g.callName(f, rt.sv(f, "card"), "forceMove", [rt.sv(f, "loc")]);
	yield* g.srcCall(f, "update_sight");
	yield* g.srcCall(f, "clear_fullscreens");
	(rt.modGl("living_mob_list", live(f.src), subtract));
	yield* g.srcCall(f, "ghostize");
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);
