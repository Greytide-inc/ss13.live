// Based on /tg/station's code/modules/events/spontaneous_appendicitis.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(323, "/datum/round_event/spontaneous_appendicitis", "/datum/round_event", {});

// spontaneous_appendicitis.dm:10
rt.def("/datum/round_event/spontaneous_appendicitis/proc/start", function* start(f: Frame) {
	let H: Value = null, foundAlready: Value = null, D: Value = null;
	for (H of each(shuffle(GLOB.living_mob_list), T("/mob/living/carbon/human"))) {
		foundAlready = 0;
		D = null;
		for (D of each(H.viruses, T("/datum/disease"))) {
			foundAlready = 1;
		}
		if (H.stat == 2 || foundAlready) {
			continue;
		}
		D = (yield* new_(T("/datum/disease/appendicitis")));
		yield* H.ForceContractDisease(D);
		break;
	}
	return f.dot;
}, true);
