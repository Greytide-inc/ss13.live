// Based on /tg/station's code/controllers/subsystem/time_track.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(47, "/datum/controller/subsystem/time_track", "/datum/controller/subsystem", {
	time_dilation_current: 0,
	time_dilation_avg_fast: 0,
	time_dilation_avg: 0,
	time_dilation_avg_slow: 0,
	first_run: 1,
	last_tick_realtime: 0,
	last_tick_byond_time: 0,
	last_tick_tickcount: 0,
	name: "Time Tracking",
	wait: 600,
	flags: 9,
	runlevels: 15,
});

// time_track.dm:1
rt.def("/datum/controller/subsystem/time_track/proc/New", function* New(f: Frame) {
	if (GLOB.SStime_track != this) {
		if (rt.istype(GLOB.SStime_track, T("/datum/controller/subsystem/time_track"))) {
			yield* this.Recover();
			yield* qdel(GLOB.SStime_track);
		}
		GLOB.SStime_track = this;
	}
	this.PreInit();
	return f.dot;
}, true);

// time_track.dm:21
rt.def("/datum/controller/subsystem/time_track/proc/fire", function fire(f: Frame) {
	let tick_drift: Value = null;
	let $2: any;
	let $0: any = rt.world().timeofday;
	let $1: any = 864000;
	if (GLOB.rollovercheck_last_timeofday != rt.world().timeofday) {
		$2 = update_midnight_rollover();
	} else {
		$2 = GLOB.midnight_rollovers;
	}
	let current_realtime: Value = $0 + $1 * $2;
	let current_byondtime: Value = rt.worldTime(f);
	let current_tickcount: Value = rt.worldTime(f) / rt.world().tick_lag;
	if (!this.first_run) {
		this.time_dilation_current = (tick_drift = max(0, (current_realtime - this.last_tick_realtime - (current_byondtime - this.last_tick_byond_time)) / rt.world().tick_lag)) / (current_tickcount - this.last_tick_tickcount) * 100;
		this.time_dilation_avg_fast = 0.7 * this.time_dilation_avg_fast + 0.3 * this.time_dilation_current;
		this.time_dilation_avg = 0.8 * this.time_dilation_avg + 0.2 * this.time_dilation_avg_fast;
		this.time_dilation_avg_slow = 0.9 * this.time_dilation_avg_slow + 0.1 * this.time_dilation_avg;
	} else {
		this.first_run = 0;
	}
	this.last_tick_realtime = current_realtime;
	this.last_tick_byond_time = current_byondtime;
	this.last_tick_tickcount = current_tickcount;
	return f.dot;
});
