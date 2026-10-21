// From code/controllers/subsystem/time_track.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /datum/controller/subsystem/time_track/proc/New  (code/controllers/subsystem/time_track.dm:1)  may sleep
rt.def("/datum/controller/subsystem/time_track/proc/New", function* New(f: Frame) {
	if (!isEqual(rt.gl("SStime_track"), live(f.src))) {
		if (truthy((rt.istype(rt.gl("SStime_track"), T("/datum/controller/subsystem/time_track")) ? 1 : 0))) {
			yield* g.srcCall(f, "Recover");
			yield* g.call(f, P("/proc/qdel"), null, [rt.gl("SStime_track")]);
		}
		rt.setGl("SStime_track", live(f.src));
	}
	yield* g.srcCall(f, "PreInit");
	return f.dot;
}, true);

// /datum/controller/subsystem/time_track/proc/fire  (code/controllers/subsystem/time_track.dm:21)
rt.def("/datum/controller/subsystem/time_track/proc/fire", function fire(f: Frame) {
	let current_realtime: Value = null, current_byondtime: Value = null, current_tickcount: Value = null, tick_drift: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [current_realtime, current_byondtime, current_tickcount, tick_drift, $0, $1, $2];
	$0 = rt.fv(f, "timeofday", rt.world());
	$1 = 864000;
	if (!isEqual(rt.gl("rollovercheck_last_timeofday"), rt.fv(f, "timeofday", rt.world()))) {
		$2 = rt.call(f, P("/proc/update_midnight_rollover"), null, []);
	} else {
		$2 = rt.gl("midnight_rollovers");
	}
	current_realtime = add($0, multiply($1, $2));
	current_byondtime = rt.worldTime(f);
	current_tickcount = divide(rt.worldTime(f), rt.fv(f, "tick_lag", rt.world()));
	if (!truthy(rt.sv(f, "first_run"))) {
		rt.setSv(f, "time_dilation_current", multiply(divide((tick_drift = rt.call(f, P("/proc/max"), null, [0, divide(subtract(subtract(live(current_realtime), rt.sv(f, "last_tick_realtime")), subtract(live(current_byondtime), rt.sv(f, "last_tick_byond_time"))), rt.fv(f, "tick_lag", rt.world()))])), subtract(live(current_tickcount), rt.sv(f, "last_tick_tickcount"))), 100));
		rt.setSv(f, "time_dilation_avg_fast", add(multiply(0.699999988079071, rt.sv(f, "time_dilation_avg_fast")), multiply(0.30000001192092896, rt.sv(f, "time_dilation_current"))));
		rt.setSv(f, "time_dilation_avg", add(multiply(0.800000011920929, rt.sv(f, "time_dilation_avg")), multiply(0.20000000298023224, rt.sv(f, "time_dilation_avg_fast"))));
		rt.setSv(f, "time_dilation_avg_slow", add(multiply(0.8999999761581421, rt.sv(f, "time_dilation_avg_slow")), multiply(0.10000000149011612, rt.sv(f, "time_dilation_avg"))));
	} else {
		rt.setSv(f, "first_run", 0);
	}
	rt.setSv(f, "last_tick_realtime", live(current_realtime));
	rt.setSv(f, "last_tick_byond_time", live(current_byondtime));
	rt.setSv(f, "last_tick_tickcount", live(current_tickcount));
	return f.dot;
});
