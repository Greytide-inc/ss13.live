// Based on /tg/station's code/modules/events/false_alarm.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1398, "/datum/round_event_control/falsealarm", "/datum/round_event_control", {
	name: "False Alarm",
	typepath: rt.typePath("/datum/round_event/falsealarm"),
	weight: 20,
	max_occurrences: 5,
});

// false_alarm.dm:8
rt.def("/datum/round_event_control/falsealarm/proc/canSpawnEvent", function canSpawnEvent(f: Frame, players_amt: Value, gamemode: Value) {
	return (parent_proc() && rt.length(gather_false_events()));
}, false);

rt.type(301, "/datum/round_event/falsealarm", "/datum/round_event", {
	announceWhen: 0,
	endWhen: 1,
});

// false_alarm.dm:15
rt.def("/datum/round_event/falsealarm/proc/announce", function* announce(f: Frame) {
	let event_control: Value = null, Event: Value = null;
	let players_amt: Value = (yield* get_active_player_count({ alive_check: 1, afk_check: 1, human_check: 1 }));
	let gamemode: Value = GLOB.SSticker.mode.config_tag;
	let events_list: Value = gather_false_events(players_amt, gamemode);
	if (!(event_control = pick(events_list))) return f.dot;
	message_admins(`False Alarm: ${(Event = (yield* new_(event_control.typepath)))}`);
	Event.kill();
	yield* Event.announce();
	return f.dot;
}, true);

// false_alarm.dm:27
rt.def("/proc/gather_false_events", function gather_false_events(f: Frame, players_amt: Value, gamemode: Value) {
	let E: Value = null, event: Value = null;
	f.dot = list();
	for (E of each(GLOB.SSevents.control, T("/datum/round_event_control"))) {
		if (rt.istype(E, T("/datum/round_event_control/falsealarm"))) {
			continue;
		}
		if (!E.canSpawnEvent(players_amt, gamemode)) {
			continue;
		}
		if (rt.initial(f, (event = E.typepath), "announceWhen") <= 0) {
			continue;
		}
		f.dot += E;
	}
	return f.dot;
});
