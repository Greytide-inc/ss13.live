// Based on /tg/station's code/modules/mob/living/silicon/ai/login.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// login.dm:2
rt.def("/mob/living/silicon/ai/proc/Login", function* Login(f: Frame) {
	let rune: Value = null, blood: Value = null, O: Value = null;
	yield* parent_proc();
	for (rune of each(rt.world(), T("/obj/effect/rune"))) {
		(blood = (yield* image({ loc: rune }))).override = 1;
		this.client.images += blood;
	}
	if (this.stat != 2) {
		for (O of each(GLOB.ai_status_displays, T("/obj/machinery/ai_status_display"))) {
			O.mode = 1;
			O.emotion = "Neutral";
		}
	}
	yield* this.view_core();
	return f.dot;
}, true);
