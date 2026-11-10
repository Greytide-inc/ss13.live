// Based on /tg/station's code/modules/events/mass_hallucination.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(312, "/datum/round_event/mass_hallucination", "/datum/round_event", {});

// mass_hallucination.dm:9
rt.def("/datum/round_event/mass_hallucination/proc/start", function start(f: Frame) {
	let C: Value = null;
	for (C of each(GLOB.living_mob_list, T("/mob/living/carbon"))) {
		C.hallucination += rand(20, 50);
	}
	return f.dot;
});
