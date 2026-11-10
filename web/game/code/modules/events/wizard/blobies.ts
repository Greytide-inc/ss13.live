// Based on /tg/station's code/modules/events/wizard/blobies.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(336, "/datum/round_event/wizard/blobies", "/datum/round_event/wizard", {});

// blobies.dm:10
rt.def("/datum/round_event/wizard/blobies/proc/start", function* start(f: Frame) {
	let H: Value = null;
	for (H of each(GLOB.dead_mob_list, T("/mob/living/carbon/human"))) {
		yield* new_(T("/mob/living/simple_animal/hostile/blob/blobspore"), H.loc);
	}
	return f.dot;
}, true);
