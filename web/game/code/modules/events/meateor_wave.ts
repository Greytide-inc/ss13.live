// Based on /tg/station's code/modules/events/meateor_wave.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(308, "/datum/round_event/meteor_wave/meaty", "/datum/round_event/meteor_wave", {
	wave_name: "meaty",
});

// meateor_wave.dm:11
rt.def("/datum/round_event/meteor_wave/meaty/proc/announce", function* announce(f: Frame) {
	yield* priority_announce("Meaty ores have been detected on collision course with the station.", "Oh crap, get the mop.", rt.rsc("sound/ai/meteors.ogg"));
	return f.dot;
}, true);
