// Based on /tg/station's code/modules/mob/living/carbon/alien/login.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// login.dm:2
rt.def("/mob/living/carbon/alien/proc/Login", function* Login(f: Frame) {
	yield* parent_proc();
	this.AddInfectionImages();
	return f.dot;
}, true);
