// Based on /tg/station's code/modules/mob/living/silicon/login.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// login.dm:2
rt.def("/mob/living/silicon/proc/Login", function* Login(f: Frame) {
	if (this.mind && GLOB.SSticker.mode) {
		yield* GLOB.SSticker.mode.remove_cultist(this.mind, 0, 0);
		yield* GLOB.SSticker.mode.remove_revolutionary(this.mind, 0);
		yield* GLOB.SSticker.mode.remove_gangster(this.mind, { remove_bosses: 1 });
	}
	yield* parent_proc();
	return f.dot;
}, true);
