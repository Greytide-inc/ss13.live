// Based on /tg/station's code/modules/events/wizard/summons.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(1377, "/datum/round_event_control/wizard/summonguns", "/datum/round_event_control/wizard", {
	name: "Summon Guns",
	weight: 1,
	typepath: rt.typePath("/datum/round_event/wizard/summonguns"),
	max_occurrences: 1,
	earliest_start: 0,
});

// summons.dm:9
rt.def("/datum/round_event_control/wizard/summonguns/proc/New", function New(f: Frame) {
	if (GLOB.config.no_summon_guns) {
		this.weight = 0;
	}
	parent_proc();
	return f.dot;
});

rt.type(354, "/datum/round_event/wizard/summonguns", "/datum/round_event/wizard", {});

// summons.dm:14
rt.def("/datum/round_event/wizard/summonguns/proc/start", function* start(f: Frame) {
	yield* rightandwrong(0, null, 10);
	return f.dot;
}, true);

rt.type(1378, "/datum/round_event_control/wizard/summonmagic", "/datum/round_event_control/wizard", {
	name: "Summon Magic",
	weight: 1,
	typepath: rt.typePath("/datum/round_event/wizard/summonmagic"),
	max_occurrences: 1,
	earliest_start: 0,
});

// summons.dm:24
rt.def("/datum/round_event_control/wizard/summonmagic/proc/New", function New(f: Frame) {
	if (GLOB.config.no_summon_magic) {
		this.weight = 0;
	}
	parent_proc();
	return f.dot;
});

rt.type(355, "/datum/round_event/wizard/summonmagic", "/datum/round_event/wizard", {});

// summons.dm:29
rt.def("/datum/round_event/wizard/summonmagic/proc/start", function* start(f: Frame) {
	yield* rightandwrong(1, null, 10);
	return f.dot;
}, true);
