// From code/modules/events/meateor_wave.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(308, "/datum/round_event/meteor_wave/meaty", "/datum/round_event/meteor_wave", {
	wave_name: "meaty",
});

// /datum/round_event/meteor_wave/meaty/proc/announce  (code/modules/events/meateor_wave.dm:11)  may sleep
rt.def("/datum/round_event/meteor_wave/meaty/proc/announce", function* announce(f: Frame) {
	yield* g.call(f, P("/proc/priority_announce"), null, ["Meaty ores have been detected on collision course with the station.", "Oh crap, get the mop.", rt.rsc("sound/ai/meteors.ogg")]);
	return f.dot;
}, true);
