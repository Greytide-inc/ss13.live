// From code/controllers/subsystem/events.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(19, "/datum/controller/subsystem/events", "/datum/controller/subsystem", {
	control: null,
	running: null,
	currentrun: null,
	scheduled: 0,
	frequency_lower: 1800,
	frequency_upper: 6000,
	holidays: null,
	wizardmode: 0,
	name: "Events",
	init_order: 14,
	runlevels: 4,
});

// /datum/controller/subsystem/events/proc/New  (code/controllers/subsystem/events.dm:1)  may sleep
rt.def("/datum/controller/subsystem/events/proc/New", function* New(f: Frame) {
	if (!isEqual(rt.gl("SSevents"), live(f.src))) {
		if (truthy((rt.istype(rt.gl("SSevents"), T("/datum/controller/subsystem/events")) ? 1 : 0))) {
			yield* g.srcCall(f, "Recover");
			yield* g.call(f, P("/proc/qdel"), null, [rt.gl("SSevents")]);
		}
		rt.setGl("SSevents", live(f.src));
	}
	yield* g.srcCall(f, "PreInit");
	return f.dot;
}, true);

// /datum/controller/subsystem/events/proc/<init>  (code/controllers/subsystem/events.dm:6)
rt.def("/datum/controller/subsystem/events/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "control", rt.list());
	$0 = $0;
	rt.setSv(f, "running", rt.list());
	$0 = $0;
	rt.setSv(f, "currentrun", rt.list());
	return f.dot;
});

// /datum/controller/subsystem/events/proc/Initialize  (code/controllers/subsystem/events.dm:18)  may sleep
rt.def("/datum/controller/subsystem/events/proc/Initialize", function* Initialize(f: Frame) {
	let type: Value = null, E: Value = null;
	let $e: any;
	f.vars = () => [type, E, $e];
	type = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/typesof"), null, [T("/datum/round_event_control")])));
	while (($e = rt.next(f, 0)) !== undefined) {
		type = $e;
		if (!truthy(rt.gv(f, "typepath", (E = (yield* g.new_(f, live(type), [])))))) {
			continue;
		}
		rt.modSrcVar(f, "control", live(E), add);
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "reschedule");
	yield* g.srcCall(f, "getHoliday");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["time", "zlevel"] });

// /datum/controller/subsystem/events/proc/fire  (code/controllers/subsystem/events.dm:29)
rt.def("/datum/controller/subsystem/events/proc/fire", function fire(f: Frame, resumed: Value) {
	let currentrun: Value = null, thing: Value = null;
	let $0: any;
	f.vars = () => [resumed, currentrun, thing, $0];
	if (live(resumed) === null) {
		resumed = 0;
	}
	if (!truthy(live(resumed))) {
		rt.callSrc(f, "checkEvent", []);
		rt.setFv(f, "currentrun", live(f.src), rt.callName(f, rt.sv(f, "running"), "Copy", []));
	}
	currentrun = rt.fv(f, "currentrun", live(f.src));
	while (truthy(rt.len(f, live(currentrun)))) {
		thing = rt.index(live(currentrun), rt.len(f, live(currentrun)));
		rt.incField(f, live(currentrun), "len", -1, true);
		if (truthy(live(thing))) {
			rt.callName(f, live(thing), "process", []);
		} else {
			rt.callName(f, rt.sv(f, "running"), "Remove", [live(thing)]);
		}
		if ((rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit")) || !isEqual(rt.fv(f, "state", live(f.src)), 2))) {
			$0 = rt.callSrc(f, "pause", []);
		} else {
			$0 = 0;
		}
		if (truthy($0)) {
			return live(f.dot);
		}
	}
	return f.dot;
});

// /datum/controller/subsystem/events/proc/checkEvent  (code/controllers/subsystem/events.dm:48)
rt.def("/datum/controller/subsystem/events/proc/checkEvent", function checkEvent(f: Frame) {
	if (!rt.le(rt.sv(f, "scheduled"), rt.worldTime(f))) return f.dot;
	rt.callSrc(f, "spawnEvent", []);
	rt.callSrc(f, "reschedule", []);
	return f.dot;
});

// /datum/controller/subsystem/events/proc/reschedule  (code/controllers/subsystem/events.dm:54)
rt.def("/datum/controller/subsystem/events/proc/reschedule", function reschedule(f: Frame) {
	rt.setSv(f, "scheduled", add(rt.worldTime(f), rt.call(f, P("/proc/rand"), null, [rt.sv(f, "frequency_lower"), rt.call(f, P("/proc/max"), null, [rt.sv(f, "frequency_lower"), rt.sv(f, "frequency_upper")])])));
	return f.dot;
});

// /datum/controller/subsystem/events/proc/spawnEvent  (code/controllers/subsystem/events.dm:59)  may sleep
rt.def("/datum/controller/subsystem/events/proc/spawnEvent", function* spawnEvent(f: Frame) {
	let gamemode: Value = null, players_amt: Value = null, sum_of_weights: Value = null, E: Value = null, res: Value = null;
	let $e: any;
	f.vars = () => [gamemode, players_amt, sum_of_weights, E, res, $e];
	if (!truthy(rt.fv(f, "allow_random_events", rt.gl("config")))) {
		return live(f.dot);
	}
	gamemode = rt.gv(f, "config_tag", rt.fv(f, "mode", rt.gl("SSticker")));
	players_amt = (yield* g.call(f, P("/proc/get_active_player_count"), null, ["alive_check", 1, "afk_check", 1, "human_check", 1], rt.Args.Named));
	sum_of_weights = 0;
	E = null;
	rt.forList(f, 0, rt.sv(f, "control"), T("/datum/round_event_control"));
	while (($e = rt.next(f, 0)) !== undefined) {
		E = $e;
		if (!truthy((yield* g.callName(f, live(E), "canSpawnEvent", [live(players_amt), live(gamemode)])))) {
			continue;
		}
		if (rt.lt(rt.fv(f, "weight", live(E)), 0)) {
			if (isEqual((res = (yield* g.srcCall(f, "TriggerEvent", live(E)))), 3)) {
				continue;
			}
			if (isEqual(live(res), 0)) {
				return live(f.dot);
			}
		}
		sum_of_weights = rt.modify(live(sum_of_weights), rt.fv(f, "weight", live(E)), add);
	}
	rt.endFor(f, 0);
	sum_of_weights = (yield* g.call(f, P("/proc/rand"), null, [0, live(sum_of_weights)]));
	E = null;
	rt.forList(f, 0, rt.sv(f, "control"), T("/datum/round_event_control"));
	while (($e = rt.next(f, 0)) !== undefined) {
		E = $e;
		if (!truthy((yield* g.callName(f, live(E), "canSpawnEvent", [live(players_amt), live(gamemode)])))) {
			continue;
		}
		(sum_of_weights = rt.modify(live(sum_of_weights), rt.fv(f, "weight", live(E)), subtract));
		if (rt.le(live(sum_of_weights), 0)) {
			if (truthy((yield* g.srcCall(f, "TriggerEvent", live(E))))) {
				return live(f.dot);
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { waitfor: false });

// /datum/controller/subsystem/events/proc/TriggerEvent  (code/controllers/subsystem/events.dm:92)  may sleep
rt.def("/datum/controller/subsystem/events/proc/TriggerEvent", function* TriggerEvent(f: Frame, E: Value) {
	f.vars = () => [E];
	f.dot = (yield* g.callName(f, live(E), "preRunEvent", []));
	if (isEqual(live(f.dot), 0)) {
		rt.setFv(f, "max_occurrences", live(E), 0);
	} else {
		if (!isEqual(live(f.dot), 1)) return f.dot;
		yield* g.callName(f, live(E), "runEvent", [1]);
	}
	return f.dot;
}, true);

// /datum/round_event/proc/findEventArea  (code/controllers/subsystem/events.dm:99)
rt.def("/datum/round_event/proc/findEventArea", function findEventArea(f: Frame) {
	let safe_areas: Value = null, danger_areas: Value = null;
	f.vars = () => [safe_areas, danger_areas];
	safe_areas = rt.list(T("/area/ai_monitored/turret_protected/ai"), T("/area/ai_monitored/turret_protected/ai_upload"), T("/area/engine"), T("/area/solar"), T("/area/holodeck"), T("/area/shuttle"));
	danger_areas = rt.list(T("/area/engine/break_room"), T("/area/crew_quarters/heads/chief"));
	return rt.locateIn(f, rt.op(f, "PickUnweighted", [1], [add(subtract(rt.gl("the_station_areas"), live(safe_areas)), live(danger_areas))]), rt.world());
});

// /client/proc/forceEvent  (code/controllers/subsystem/events.dm:123)  may sleep
rt.def("/client/proc/forceEvent", function* forceEvent(f: Frame) {
	if ((!truthy(rt.sv(f, "holder")) || !truthy((yield* g.call(f, P("/proc/check_rights"), null, [8]))))) {
		return live(f.dot);
	}
	yield* g.callName(f, rt.sv(f, "holder"), "forceEvent", []);
	return f.dot;
}, true, { verb: { name: "Trigger Event", category: "Fun" } });

// /datum/admins/proc/forceEvent  (code/controllers/subsystem/events.dm:129)  may sleep
rt.def("/datum/admins/proc/forceEvent", function* forceEvent(f: Frame) {
	let dat: Value = null, normal: Value = null, magic: Value = null, holiday: Value = null, E: Value = null, popup: Value = null;
	let $e: any;
	f.vars = () => [dat, normal, magic, holiday, E, popup, $e];
	dat = "";
	normal = "";
	magic = "";
	holiday = "";
	E = null;
	rt.forList(f, 0, rt.fv(f, "control", rt.gl("SSevents")), T("/datum/round_event_control"));
	while (($e = rt.next(f, 0)) !== undefined) {
		E = $e;
		dat = fmt("<BR><A href='?src=＃;forceevent=＃'>＀</A>", [live(f.src), live(E), live(E)]);
		if (truthy(rt.fv(f, "holidayID", live(E)))) {
			holiday = rt.modify(live(holiday), live(dat), add);
		} else {
			if (truthy(rt.fv(f, "wizardevent", live(E)))) {
				magic = rt.modify(live(magic), live(dat), add);
			} else {
				normal = rt.modify(live(normal), live(dat), add);
			}
		}
	}
	rt.endFor(f, 0);
	dat = add(add(add(add(live(normal), "<BR>"), live(magic)), "<BR>"), live(holiday));
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(f.usr), "forceevent", "Force Random Event", 300, 750]))), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "open", []);
	return f.dot;
}, true);

// /datum/controller/subsystem/events/proc/getHoliday  (code/controllers/subsystem/events.dm:172)  may sleep
rt.def("/datum/controller/subsystem/events/proc/getHoliday", function* getHoliday(f: Frame) {
	let YY: Value = null, MM: Value = null, DD: Value = null, DDD: Value = null, W: Value = null, H: Value = null, holiday: Value = null;
	let $e: any;
	f.vars = () => [YY, MM, DD, DDD, W, H, holiday, $e];
	if (!truthy(rt.fv(f, "allow_holidays", rt.gl("config")))) {
		return live(f.dot);
	}
	YY = (yield* g.call(f, P("/proc/text2num"), null, [(yield* g.call(f, P("/proc/time2text"), null, [rt.fv(f, "timeofday", rt.world()), "YY"]))]));
	MM = (yield* g.call(f, P("/proc/text2num"), null, [(yield* g.call(f, P("/proc/time2text"), null, [rt.fv(f, "timeofday", rt.world()), "MM"]))]));
	DD = (yield* g.call(f, P("/proc/text2num"), null, [(yield* g.call(f, P("/proc/time2text"), null, [rt.fv(f, "timeofday", rt.world()), "DD"]))]));
	DDD = (yield* g.call(f, P("/proc/text2num"), null, [(yield* g.call(f, P("/proc/time2text"), null, [rt.fv(f, "timeofday", rt.world()), "DDD"]))]));
	W = (yield* g.call(f, P("/proc/weekdayofthemonth"), null, []));
	H = null;
	rt.forList(f, 0, subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/holiday")])), T("/datum/holiday")));
	while (($e = rt.next(f, 0)) !== undefined) {
		H = $e;
		if (truthy((yield* g.callName(f, (holiday = (yield* g.new_(f, live(H), []))), "shouldCelebrate", [live(DD), live(MM), live(YY), live(W), live(DDD)])))) {
			yield* g.callName(f, live(holiday), "celebrate", []);
			if (!truthy(rt.sv(f, "holidays"))) {
				rt.setSv(f, "holidays", rt.list());
			}
			rt.setAt(rt.sv(f, "holidays"), rt.fv(f, "name", live(holiday)), live(holiday));
		} else {
			yield* g.call(f, P("/proc/qdel"), null, [live(holiday)]);
		}
	}
	rt.endFor(f, 0);
	if (!truthy(rt.sv(f, "holidays"))) return f.dot;
	rt.setSv(f, "holidays", (yield* g.call(f, P("/proc/shuffle"), null, [rt.sv(f, "holidays")])));
	yield* g.call(f, P("/proc/set_station_name"), null, [(yield* g.call(f, P("/proc/new_station_name"), null, []))]);
	yield* g.callName(f, rt.world(), "update_status", []);
	return f.dot;
}, true);

// /datum/controller/subsystem/events/proc/toggleWizardmode  (code/controllers/subsystem/events.dm:198)
rt.def("/datum/controller/subsystem/events/proc/toggleWizardmode", function toggleWizardmode(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	rt.setSv(f, "wizardmode", (!truthy(rt.sv(f, "wizardmode")) ? 1 : 0));
	if (truthy(rt.sv(f, "wizardmode"))) {
		$0 = fmt("enabled, events will occur every ＀ to ＀ minutes", [divide(rt.fv(f, "frequency_lower", rt.gl("SSevents")), 600), divide(rt.fv(f, "frequency_upper", rt.gl("SSevents")), 600)]);
	} else {
		$0 = "disabled";
	}
	rt.call(f, P("/proc/message_admins"), null, [fmt("Summon Events has been ＀!", [$0])]);
	if (truthy(rt.sv(f, "wizardmode"))) {
		$0 = "enabled";
	} else {
		$0 = "disabled";
	}
	rt.call(f, P("/proc/log_game"), null, [fmt("Summon Events was ＀!", [$0])]);
	return f.dot;
});

// /datum/controller/subsystem/events/proc/resetFrequency  (code/controllers/subsystem/events.dm:204)
rt.def("/datum/controller/subsystem/events/proc/resetFrequency", function resetFrequency(f: Frame) {
	rt.setSv(f, "frequency_lower", rt.initial(f, live(f.src), "frequency_lower"));
	rt.setSv(f, "frequency_upper", rt.initial(f, live(f.src), "frequency_upper"));
	return f.dot;
});
