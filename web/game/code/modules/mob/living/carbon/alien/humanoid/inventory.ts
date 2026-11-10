// Based on /tg/station's code/modules/mob/living/carbon/alien/humanoid/inventory.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// inventory.dm:2
rt.def("/mob/living/carbon/alien/humanoid/proc/doUnEquip", function* doUnEquip(f: Frame, I: Value) {
	f.dot = (yield* parent_proc());
	if (!(!f.dot || !I)) return f.dot;
	return f.dot;
}, true);
