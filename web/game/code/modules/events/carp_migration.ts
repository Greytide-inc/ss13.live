// Based on /tg/station's code/modules/events/carp_migration.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(294, "/datum/round_event/carp_migration", "/datum/round_event", {
	announceWhen: 3,
	startWhen: 50,
});

// carp_migration.dm:14
rt.def("/datum/round_event/carp_migration/proc/setup", function setup(f: Frame) {
	this.startWhen = rand(40, 60);
	return f.dot;
});

// carp_migration.dm:17
rt.def("/datum/round_event/carp_migration/proc/announce", function* announce(f: Frame) {
	yield* priority_announce(`Unknown biological entities have been detected near ${station_name()}, please stand-by.`, "Lifesign Alert");
	return f.dot;
}, true);

// carp_migration.dm:21
rt.def("/datum/round_event/carp_migration/proc/start", function* start(f: Frame) {
	let C: Value = null;
	for (C of each(GLOB.landmarks_list, T("/obj/effect/landmark"))) {
		if (C.name == "carpspawn") {
			if (prob(95)) {
				yield* new_(T("/mob/living/simple_animal/hostile/carp"), C.loc);
			} else {
				yield* new_(T("/mob/living/simple_animal/hostile/carp/megacarp"), C.loc);
			}
		}
	}
	return f.dot;
}, true);
