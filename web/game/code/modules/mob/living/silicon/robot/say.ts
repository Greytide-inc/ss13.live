// Based on /tg/station's code/modules/mob/living/silicon/robot/say.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// say.dm:2
rt.def("/mob/living/silicon/robot/proc/IsVocal", function IsVocal(f: Frame) {
	return (!GLOB.config.silent_borg ? 1 : 0);
});
