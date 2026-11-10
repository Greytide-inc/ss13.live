// Based on /tg/station's code/modules/events/wizard/invincible.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(344, "/datum/round_event/wizard/invincible", "/datum/round_event/wizard", {});

// invincible.dm:10
rt.def("/datum/round_event/wizard/invincible/proc/start", function* start(f: Frame) {
	let H: Value = null;
	for (H of each(GLOB.living_mob_list, T("/mob/living/carbon/human"))) {
		yield* H.reagents.add_reagent("adminordrazine", 40);
		to_chat(H, "<span class='notice'>You feel invincible, nothing can hurt you!</span>");
	}
	return f.dot;
}, true);
