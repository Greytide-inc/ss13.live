// From code/modules/mob/living/silicon/robot/say.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/silicon/robot/proc/IsVocal  (code/modules/mob/living/silicon/robot/say.dm:2)
rt.def("/mob/living/silicon/robot/proc/IsVocal", function IsVocal(f: Frame) {
	return (!truthy(rt.fv(f, "silent_borg", rt.gl("config"))) ? 1 : 0);
});
