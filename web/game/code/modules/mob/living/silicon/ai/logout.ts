// Based on /tg/station's code/modules/mob/living/silicon/ai/logout.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// logout.dm:2
rt.def("/mob/living/silicon/ai/proc/Logout", function* Logout(f: Frame) {
	let O: Value = null;
	yield* parent_proc();
	for (O of each(GLOB.ai_status_displays, T("/obj/machinery/ai_status_display"))) {
		O.mode = 0;
	}
	yield* this.view_core();
	return f.dot;
}, true);
