// From code/modules/events/false_alarm.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1398, "/datum/round_event_control/falsealarm", "/datum/round_event_control", {
	name: "False Alarm",
	typepath: rt.typePath("/datum/round_event/falsealarm"),
	weight: 20,
	max_occurrences: 5,
});

// /datum/round_event_control/falsealarm/proc/canSpawnEvent  (code/modules/events/false_alarm.dm:8)
rt.def("/datum/round_event_control/falsealarm/proc/canSpawnEvent", function canSpawnEvent(f: Frame) {
	return (rt.callSuper(f, [], rt.Args.Same) && rt.length(rt.call(f, P("/proc/gather_false_events"), null, [])));
}, false, { args: ["players_amt", "gamemode"] });

rt.type(301, "/datum/round_event/falsealarm", "/datum/round_event", {
	announceWhen: 0,
	endWhen: 1,
});

// /datum/round_event/falsealarm/proc/announce  (code/modules/events/false_alarm.dm:15)  may sleep
rt.def("/datum/round_event/falsealarm/proc/announce", function* announce(f: Frame) {
	let players_amt: Value = null, gamemode: Value = null, events_list: Value = null, event_control: Value = null, Event: Value = null;
	f.vars = () => [players_amt, gamemode, events_list, event_control, Event];
	players_amt = (yield* g.call(f, P("/proc/get_active_player_count"), null, ["alive_check", 1, "afk_check", 1, "human_check", 1], rt.Args.Named));
	gamemode = rt.gv(f, "config_tag", rt.fv(f, "mode", rt.gl("SSticker")));
	events_list = (yield* g.call(f, P("/proc/gather_false_events"), null, [live(players_amt), live(gamemode)]));
	if (!truthy((event_control = rt.op(f, "PickUnweighted", [1], [live(events_list)])))) return f.dot;
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("False Alarm: ＀", [(Event = (yield* g.new_(f, rt.fv(f, "typepath", live(event_control)), [])))])]);
	yield* g.callName(f, live(Event), "kill", []);
	yield* g.callName(f, live(Event), "announce", []);
	return f.dot;
}, true);

// /proc/gather_false_events  (code/modules/events/false_alarm.dm:27)
rt.def("/proc/gather_false_events", function gather_false_events(f: Frame, players_amt: Value, gamemode: Value) {
	let E: Value = null, event: Value = null;
	let $e: any;
	f.vars = () => [E, event, $e];
	f.dot = rt.list();
	E = null;
	rt.forList(f, 0, rt.fv(f, "control", rt.gl("SSevents")), T("/datum/round_event_control"));
	while (($e = rt.next(f, 0)) !== undefined) {
		E = $e;
		if (truthy((rt.istype(live(E), T("/datum/round_event_control/falsealarm")) ? 1 : 0))) {
			continue;
		}
		if (!truthy(rt.callName(f, live(E), "canSpawnEvent", [live(players_amt), live(gamemode)]))) {
			continue;
		}
		if (rt.le(rt.initial(f, (event = rt.fv(f, "typepath", live(E))), "announceWhen"), 0)) {
			continue;
		}
		f.dot = rt.modify(live(f.dot), live(E), add);
	}
	rt.endFor(f, 0);
	return f.dot;
});
