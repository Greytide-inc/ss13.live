// From code/__HELPERS/time.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/worldtime2text  (code/__HELPERS/time.dm:3)
rt.def("/proc/worldtime2text", function worldtime2text(f: Frame) {
	return rt.call(f, P("/proc/gameTimestamp"), null, ["hh:mm:ss", rt.worldTime(f)]);
});

// /proc/time_stamp  (code/__HELPERS/time.dm:6)
rt.def("/proc/time_stamp", function time_stamp(f: Frame, format: Value, show_ds: Value) {
	let time_string: Value = null;
	let $0: any;
	f.vars = () => [format, time_string, $0];
	if (live(format) === null) {
		format = "hh:mm:ss";
	}
	time_string = rt.call(f, P("/proc/time2text"), null, [rt.fv(f, "timeofday", rt.world()), live(format)]);
	if (truthy(live(show_ds))) {
		$0 = fmt("＀:＀", [live(time_string), rt.modulus(rt.fv(f, "timeofday", rt.world()), 10)]);
	} else {
		$0 = live(time_string);
	}
	return $0;
});

// /proc/gameTimestamp  (code/__HELPERS/time.dm:10)
rt.def("/proc/gameTimestamp", function gameTimestamp(f: Frame, format: Value, wtime: Value) {
	f.vars = () => [format, wtime];
	if (live(format) === null) {
		format = "hh:mm:ss";
	}
	if (live(wtime) === null) {
		wtime = null;
	}
	if (!truthy(live(wtime))) {
		wtime = rt.worldTime(f);
	}
	return rt.call(f, P("/proc/time2text"), null, [subtract(add(subtract(live(wtime), rt.gl("timezoneOffset")), rt.fv(f, "gametime_offset", rt.gl("SSticker"))), rt.fv(f, "round_start_time", rt.gl("SSticker"))), live(format)]);
});

// /proc/isDay  (code/__HELPERS/time.dm:16)
rt.def("/proc/isDay", function isDay(f: Frame, month: Value, day: Value) {
	let MM: Value = null, DD: Value = null;
	f.vars = () => [MM, DD];
	if (!(truthy(rt.call(f, P("/proc/isnum"), null, [live(month)])) && truthy(rt.call(f, P("/proc/isnum"), null, [live(day)])))) return f.dot;
	MM = rt.call(f, P("/proc/text2num"), null, [rt.call(f, P("/proc/time2text"), null, [rt.fv(f, "timeofday", rt.world()), "MM"])]);
	DD = rt.call(f, P("/proc/text2num"), null, [rt.call(f, P("/proc/time2text"), null, [rt.fv(f, "timeofday", rt.world()), "DD"])]);
	if (!(isEqual(live(month), live(MM)) && isEqual(live(day), live(DD)))) return f.dot;
	return 1;
});

// /proc/SQLtime  (code/__HELPERS/time.dm:28)
rt.def("/proc/SQLtime", function SQLtime(f: Frame, timevar: Value) {
	f.vars = () => [timevar];
	if (!truthy(live(timevar))) {
		timevar = rt.fv(f, "realtime", rt.world());
	}
	return rt.call(f, P("/proc/time2text"), null, [live(timevar), "YYYY-MM-DD hh:mm:ss"]);
});

// /datum/controller/global_vars/proc/InitGlobalmidnight_rollovers  (code/__HELPERS/time.dm:33)
rt.def("/datum/controller/global_vars/proc/InitGlobalmidnight_rollovers", function InitGlobalmidnight_rollovers(f: Frame) {
	rt.setGl("midnight_rollovers", 0);
	rt.modSrcVar(f, "gvars_datum_init_order", "midnight_rollovers", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalrollovercheck_last_timeofday  (code/__HELPERS/time.dm:34)
rt.def("/datum/controller/global_vars/proc/InitGlobalrollovercheck_last_timeofday", function InitGlobalrollovercheck_last_timeofday(f: Frame) {
	rt.setGl("rollovercheck_last_timeofday", 0);
	rt.modSrcVar(f, "gvars_datum_init_order", "rollovercheck_last_timeofday", add);
	return f.dot;
});

// /proc/update_midnight_rollover  (code/__HELPERS/time.dm:36)
rt.def("/proc/update_midnight_rollover", function update_midnight_rollover(f: Frame) {
	if (rt.lt(rt.fv(f, "timeofday", rt.world()), rt.gl("rollovercheck_last_timeofday"))) {
		return rt.incGl("midnight_rollovers", 1, true);
	}
	return rt.gl("midnight_rollovers");
});

// /proc/weekdayofthemonth  (code/__HELPERS/time.dm:41)
rt.def("/proc/weekdayofthemonth", function weekdayofthemonth(f: Frame) {
	let DD: Value = null;
	let $0: any;
	f.vars = () => [DD, $0];
	$0 = (DD = rt.call(f, P("/proc/text2num"), null, [rt.call(f, P("/proc/time2text"), null, [rt.fv(f, "timeofday", rt.world()), "DD"])]));
	if (rt.inRange($0, 8, 13)) {
		return 2;
	} else if (rt.inRange($0, 14, 20)) {
		return 3;
	} else if (rt.inRange($0, 21, 27)) {
		return 4;
	} else if (rt.inRange($0, 28, 9.999999848243207e+30)) {
		return 5;
	} else {
		return 1;
	}
	return f.dot;
});
