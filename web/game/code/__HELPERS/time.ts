// Based on /tg/station's code/__HELPERS/time.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// time.dm:3
rt.def("/proc/worldtime2text", function worldtime2text(f: Frame) {
	return gameTimestamp("hh:mm:ss", rt.worldTime(f));
});

// time.dm:6
rt.def("/proc/time_stamp", function time_stamp(f: Frame, format: Value, show_ds: Value) {
	format ??= "hh:mm:ss";
	let time_string: Value = time2text(rt.world().timeofday, format);
	return show_ds ? `${time_string}:${rt.world().timeofday % 10}` : time_string;
});

// time.dm:10
rt.def("/proc/gameTimestamp", function gameTimestamp(f: Frame, format: Value, wtime: Value) {
	format ??= "hh:mm:ss";
	if (!wtime) {
		wtime = rt.worldTime(f);
	}
	return time2text(wtime - GLOB.timezoneOffset + GLOB.SSticker.gametime_offset - GLOB.SSticker.round_start_time, format);
});

// time.dm:28
rt.def("/proc/SQLtime", function SQLtime(f: Frame, timevar: Value) {
	if (!timevar) {
		timevar = rt.world().realtime;
	}
	return time2text(timevar, "YYYY-MM-DD hh:mm:ss");
});

// time.dm:33
rt.def("/datum/controller/global_vars/proc/InitGlobalmidnight_rollovers", function InitGlobalmidnight_rollovers(f: Frame) {
	GLOB.midnight_rollovers = 0;
	this.gvars_datum_init_order += "midnight_rollovers";
	return f.dot;
});

// time.dm:34
rt.def("/datum/controller/global_vars/proc/InitGlobalrollovercheck_last_timeofday", function InitGlobalrollovercheck_last_timeofday(f: Frame) {
	GLOB.rollovercheck_last_timeofday = 0;
	this.gvars_datum_init_order += "rollovercheck_last_timeofday";
	return f.dot;
});

// time.dm:36
rt.def("/proc/update_midnight_rollover", function update_midnight_rollover(f: Frame) {
	if (rt.world().timeofday < GLOB.rollovercheck_last_timeofday) {
		return rt.incGl("midnight_rollovers", 1, true);
	}
	return GLOB.midnight_rollovers;
});

// time.dm:41
rt.def("/proc/weekdayofthemonth", function weekdayofthemonth(f: Frame) {
	let DD: Value = null;
	const subject = (DD = text2num(time2text(rt.world().timeofday, "DD")));
	if (rt.inRange(subject, 8, 13)) {
		return 2;
	} else if (rt.inRange(subject, 14, 20)) {
		return 3;
	} else if (rt.inRange(subject, 21, 27)) {
		return 4;
	} else if (rt.inRange(subject, 28, 1e+31)) {
		return 5;
	} else {
		return 1;
	}
});
