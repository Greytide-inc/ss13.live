// From code/modules/events/wizard/summons.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1377, "/datum/round_event_control/wizard/summonguns", "/datum/round_event_control/wizard", {
	name: "Summon Guns",
	weight: 1,
	typepath: rt.typePath("/datum/round_event/wizard/summonguns"),
	max_occurrences: 1,
	earliest_start: 0,
});

// /datum/round_event_control/wizard/summonguns/proc/New  (code/modules/events/wizard/summons.dm:9)
rt.def("/datum/round_event_control/wizard/summonguns/proc/New", function New(f: Frame) {
	if (truthy(rt.fv(f, "no_summon_guns", rt.gl("config")))) {
		rt.setSv(f, "weight", 0);
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

rt.type(354, "/datum/round_event/wizard/summonguns", "/datum/round_event/wizard", {});

// /datum/round_event/wizard/summonguns/proc/start  (code/modules/events/wizard/summons.dm:14)  may sleep
rt.def("/datum/round_event/wizard/summonguns/proc/start", function* start(f: Frame) {
	yield* g.call(f, P("/proc/rightandwrong"), null, [0, null, 10]);
	return f.dot;
}, true);

rt.type(1378, "/datum/round_event_control/wizard/summonmagic", "/datum/round_event_control/wizard", {
	name: "Summon Magic",
	weight: 1,
	typepath: rt.typePath("/datum/round_event/wizard/summonmagic"),
	max_occurrences: 1,
	earliest_start: 0,
});

// /datum/round_event_control/wizard/summonmagic/proc/New  (code/modules/events/wizard/summons.dm:24)
rt.def("/datum/round_event_control/wizard/summonmagic/proc/New", function New(f: Frame) {
	if (truthy(rt.fv(f, "no_summon_magic", rt.gl("config")))) {
		rt.setSv(f, "weight", 0);
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

rt.type(355, "/datum/round_event/wizard/summonmagic", "/datum/round_event/wizard", {});

// /datum/round_event/wizard/summonmagic/proc/start  (code/modules/events/wizard/summons.dm:29)  may sleep
rt.def("/datum/round_event/wizard/summonmagic/proc/start", function* start(f: Frame) {
	yield* g.call(f, P("/proc/rightandwrong"), null, [1, null, 10]);
	return f.dot;
}, true);
