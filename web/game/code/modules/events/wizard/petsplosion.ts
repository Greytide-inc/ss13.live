// Based on /tg/station's code/modules/events/wizard/petsplosion.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1371, "/datum/round_event_control/wizard/petsplosion", "/datum/round_event_control/wizard", {
	mobs_to_dupe: 0,
	name: "Petsplosion",
	weight: 2,
	typepath: rt.typePath("/datum/round_event/wizard/petsplosion"),
	max_occurrences: 1,
	earliest_start: 0,
});

// petsplosion.dm:10
rt.def("/datum/round_event_control/wizard/petsplosion/proc/preRunEvent", function* preRunEvent(f: Frame) {
	let F: Value = null;
	for (F of each(GLOB.living_mob_list, T("/mob/living/simple_animal"))) {
		if (!rt.istype(F, T("/mob/living/simple_animal/hostile")) && F.z == ZLEVEL_STATION) {
			this.mobs_to_dupe++;
		}
	}
	if (this.mobs_to_dupe > 100 || !this.mobs_to_dupe) {
		return EVENT_CANT_RUN;
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(347, "/datum/round_event/wizard/petsplosion", "/datum/round_event/wizard", {
	countdown: 0,
	mobs_duped: 0,
	endWhen: 61,
});

// petsplosion.dm:24
rt.def("/datum/round_event/wizard/petsplosion/proc/tick", function* tick(f: Frame) {
	let F: Value = null;
	if (!(this.activeFor >= 30 * this.countdown)) return f.dot;
	this.countdown += 1;
	for (F of each(GLOB.living_mob_list, T("/mob/living/simple_animal"))) {
		if (!rt.istype(F, T("/mob/living/simple_animal/hostile")) && F.z == ZLEVEL_STATION) {
			yield* new_(F.type, F.loc);
			this.mobs_duped++;
			if (this.mobs_duped > 400) {
				this.kill();
			}
		}
	}
	return f.dot;
}, true);
