// Based on /tg/station's code/modules/mob/living/carbon/alien/logout.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// logout.dm:2
rt.def("/mob/living/carbon/alien/proc/Logout", function* Logout(f: Frame) {
	yield* parent_proc();
	yield* this.RemoveInfectionImages();
	return f.dot;
}, true);
