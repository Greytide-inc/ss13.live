// From code/modules/events/carp_migration.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(294, "/datum/round_event/carp_migration", "/datum/round_event", {
	announceWhen: 3,
	startWhen: 50,
});

// /datum/round_event/carp_migration/proc/setup  (code/modules/events/carp_migration.dm:14)
rt.def("/datum/round_event/carp_migration/proc/setup", function setup(f: Frame) {
	rt.setSv(f, "startWhen", rt.call(f, P("/proc/rand"), null, [40, 60]));
	return f.dot;
});

// /datum/round_event/carp_migration/proc/announce  (code/modules/events/carp_migration.dm:17)  may sleep
rt.def("/datum/round_event/carp_migration/proc/announce", function* announce(f: Frame) {
	yield* g.call(f, P("/proc/priority_announce"), null, [fmt("Unknown biological entities have been detected near ＀, please stand-by.", [(yield* g.call(f, P("/proc/station_name"), null, []))]), "Lifesign Alert"]);
	return f.dot;
}, true);

// /datum/round_event/carp_migration/proc/start  (code/modules/events/carp_migration.dm:21)  may sleep
rt.def("/datum/round_event/carp_migration/proc/start", function* start(f: Frame) {
	let C: Value = null;
	let $e: any;
	f.vars = () => [C, $e];
	C = null;
	rt.forList(f, 0, rt.gl("landmarks_list"), T("/obj/effect/landmark"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		if (isEqual(rt.fv(f, "name", live(C)), "carpspawn")) {
			if (truthy(rt.op(f, "Prob", [], [95]))) {
				yield* g.new_(f, T("/mob/living/simple_animal/hostile/carp"), [rt.fv(f, "loc", live(C))]);
			} else {
				yield* g.new_(f, T("/mob/living/simple_animal/hostile/carp/megacarp"), [rt.fv(f, "loc", live(C))]);
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
