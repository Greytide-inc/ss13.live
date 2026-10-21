// From code/modules/events/_event.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1351, "/datum/round_event_control", "/datum", {
	name: null,
	typepath: null,
	weight: 10,
	earliest_start: 12000,
	min_players: 0,
	occurrences: 0,
	max_occurrences: 20,
	holidayID: "",
	wizardevent: 0,
	alertadmins: 1,
	gamemode_blacklist: null,
	gamemode_whitelist: null,
	triggering: null,
});

// /datum/round_event_control/proc/<init>  (code/modules/events/_event.dm:25)
rt.def("/datum/round_event_control/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "gamemode_blacklist", rt.list());
	$0 = $0;
	rt.setSv(f, "gamemode_whitelist", rt.list());
	return f.dot;
});

// /datum/round_event_control/proc/New  (code/modules/events/_event.dm:31)
rt.def("/datum/round_event_control/proc/New", function New(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!(truthy(rt.gl("config")) && !truthy(rt.sv(f, "wizardevent")))) return f.dot;
	rt.setSv(f, "earliest_start", rt.call(f, P("/proc/Ceiling"), null, [multiply(rt.sv(f, "earliest_start"), rt.fv(f, "events_min_time_mul", rt.gl("config")))]));
	rt.setSv(f, "min_players", rt.call(f, P("/proc/Ceiling"), null, [multiply(rt.sv(f, "min_players"), rt.fv(f, "events_min_players_mul", rt.gl("config")))]));
	return f.dot;
});

// /datum/round_event_control/proc/canSpawnEvent  (code/modules/events/_event.dm:42)
rt.def("/datum/round_event_control/proc/canSpawnEvent", function canSpawnEvent(f: Frame, players_amt: Value, gamemode: Value) {
	if (rt.ge(rt.sv(f, "occurrences"), rt.sv(f, "max_occurrences"))) {
		return 0;
	}
	if (rt.ge(rt.sv(f, "earliest_start"), rt.worldTime(f))) {
		return 0;
	}
	if (!isEqual(rt.sv(f, "wizardevent"), rt.fv(f, "wizardmode", rt.gl("SSevents")))) {
		return 0;
	}
	if (rt.lt(live(players_amt), rt.sv(f, "min_players"))) {
		return 0;
	}
	if ((truthy(rt.len(f, rt.sv(f, "gamemode_blacklist"))) && truthy((rt.isIn(f, live(gamemode), rt.sv(f, "gamemode_blacklist")) ? 1 : 0)))) {
		return 0;
	}
	if ((truthy(rt.len(f, rt.sv(f, "gamemode_whitelist"))) && !truthy((rt.isIn(f, live(gamemode), rt.sv(f, "gamemode_whitelist")) ? 1 : 0)))) {
		return 0;
	}
	if ((truthy(rt.sv(f, "holidayID")) && (!truthy(rt.fv(f, "holidays", rt.gl("SSevents"))) || !truthy(rt.index(rt.fv(f, "holidays", rt.gl("SSevents")), rt.sv(f, "holidayID")))))) {
		return 0;
	}
	return 1;
});

// /datum/round_event_control/proc/preRunEvent  (code/modules/events/_event.dm:59)  may sleep
rt.def("/datum/round_event_control/proc/preRunEvent", function* preRunEvent(f: Frame) {
	let gamemode: Value = null, players_amt: Value = null;
	f.vars = () => [gamemode, players_amt];
	if (!truthy((yield* g.call(f, P("/proc/ispath"), null, [rt.sv(f, "typepath"), T("/datum/round_event")])))) {
		return 0;
	}
	rt.setSv(f, "triggering", 1);
	if (truthy(rt.sv(f, "alertadmins"))) {
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("Random Event triggering in 10 seconds: ＀ (＀) (<a href='?src=＃;cancel=1'>CANCEL</a>)", [rt.sv(f, "name"), rt.sv(f, "typepath"), live(f.src)])]);
		yield* g.call(f, P("/proc/sleep"), null, [100]);
		gamemode = rt.gv(f, "config_tag", rt.fv(f, "mode", rt.gl("SSticker")));
		if (!truthy((yield* g.srcCall(f, "canSpawnEvent", (players_amt = (yield* g.call(f, P("/proc/get_active_player_count"), null, ["alive_check", 1, "afk_check", 1, "human_check", 1], rt.Args.Named))), live(gamemode))))) {
			yield* g.call(f, P("/proc/message_admins"), null, [fmt("Second pre-condition check for ＀ failed, skipping...", [rt.sv(f, "name")])]);
			return 3;
		}
	}
	if (!truthy(rt.sv(f, "triggering"))) {
		return 2;
	}
	rt.setSv(f, "triggering", 0);
	return 1;
}, true);

// /datum/round_event_control/proc/Topic  (code/modules/events/_event.dm:78)
rt.def("/datum/round_event_control/proc/Topic", function Topic(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.at(live(f.args[1]), "cancel"))) return f.dot;
	if (!truthy(rt.sv(f, "triggering"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='admin'>You are too late to cancel that event</span>"]);
		return live(f.dot);
	}
	rt.setSv(f, "triggering", 0);
	rt.call(f, P("/proc/message_admins"), null, [fmt("＀ cancelled event ＀.", [rt.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]), rt.sv(f, "name")])]);
	rt.call(f, P("/proc/log_admin_private"), null, [fmt("＀ cancelled event ＀.", [rt.call(f, P("/proc/key_name"), null, [live(f.usr)]), rt.sv(f, "name")])]);
	return f.dot;
}, false, { args: ["href", "href_list"] });

// /datum/round_event_control/proc/runEvent  (code/modules/events/_event.dm:89)  may sleep
rt.def("/datum/round_event_control/proc/runEvent", function* runEvent(f: Frame, random: Value) {
	let E: Value = null;
	f.vars = () => [random, E];
	rt.setFv(f, "current_players", (E = (yield* g.new_(f, rt.sv(f, "typepath"), []))), (yield* g.call(f, P("/proc/get_active_player_count"), null, ["alive_check", 1, "afk_check", 1, "human_check", 1], rt.Args.Named)));
	rt.setFv(f, "control", live(E), live(f.src));
	rt.incSrcVar(f, "occurrences", 1, true);
	if (truthy(live(random))) {
		if (truthy(rt.sv(f, "alertadmins"))) {
			yield* g.call(f, P("/proc/deadchat_broadcast"), null, [fmt("<span class='deadsay'><b>＀</b> has just been randomly triggered!</span>", [rt.sv(f, "name")])]);
		}
		yield* g.call(f, P("/proc/log_game"), null, [fmt("Random Event triggering: ＀ (＀)", [rt.sv(f, "name"), rt.sv(f, "typepath")])]);
	}
	return live(E);
}, true);

rt.type(272, "/datum/round_event", "/datum", {
	processing: 1,
	control: null,
	startWhen: 0,
	announceWhen: 0,
	endWhen: 0,
	activeFor: 0,
	current_players: 0,
});

// /datum/round_event/proc/process  (code/modules/events/_event.dm:157)  may sleep
rt.def("/datum/round_event/proc/process", function* process(f: Frame) {
	if (!truthy(rt.sv(f, "processing"))) {
		return live(f.dot);
	}
	if (isEqual(rt.sv(f, "activeFor"), rt.sv(f, "startWhen"))) {
		yield* g.srcCall(f, "start");
	}
	if (isEqual(rt.sv(f, "activeFor"), rt.sv(f, "announceWhen"))) {
		yield* g.srcCall(f, "announce");
	}
	if ((rt.lt(rt.sv(f, "startWhen"), rt.sv(f, "activeFor")) && rt.lt(rt.sv(f, "activeFor"), rt.sv(f, "endWhen")))) {
		yield* g.srcCall(f, "tick");
	}
	if (isEqual(rt.sv(f, "activeFor"), rt.sv(f, "endWhen"))) {
		yield* g.srcCall(f, "end");
	}
	if (((rt.ge(rt.sv(f, "activeFor"), rt.sv(f, "endWhen")) && rt.ge(rt.sv(f, "activeFor"), rt.sv(f, "announceWhen"))) && rt.ge(rt.sv(f, "activeFor"), rt.sv(f, "startWhen")))) {
		yield* g.srcCall(f, "kill");
	}
	rt.incSrcVar(f, "activeFor", 1, true);
	return f.dot;
}, true, { waitfor: false });

// /datum/round_event/proc/kill  (code/modules/events/_event.dm:183)
rt.def("/datum/round_event/proc/kill", function kill(f: Frame) {
	(rt.modField(f, rt.gl("SSevents"), "running", live(f.src), subtract));
	return f.dot;
});

// /datum/round_event/proc/New  (code/modules/events/_event.dm:188)
rt.def("/datum/round_event/proc/New", function New(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = 1;
	}
	rt.callSrc(f, "setup", []);
	rt.setSv(f, "processing", live(f.args[0]));
	rt.modField(f, rt.gl("SSevents"), "running", live(f.src), add);
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["my_processing"] });
