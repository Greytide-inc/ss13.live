// From code/modules/mob/living/silicon/ai/logout.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/silicon/ai/proc/Logout  (code/modules/mob/living/silicon/ai/logout.dm:2)  may sleep
rt.def("/mob/living/silicon/ai/proc/Logout", function* Logout(f: Frame) {
	let O: Value = null;
	let $e: any;
	f.vars = () => [O, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	O = null;
	rt.forList(f, 0, rt.gl("ai_status_displays"), T("/obj/machinery/ai_status_display"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		rt.setFv(f, "mode", live(O), 0);
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "view_core");
	return f.dot;
}, true);
