// From code/controllers/master.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10, "/datum/controller/master", "/datum/controller", {
	processing: 1,
	iteration: 0,
	last_run: null,
	subsystems: null,
	init_timeofday: null,
	init_time: null,
	tickdrift: 0,
	sleep_delta: null,
	make_runtime: 0,
	initializations_finished_with_no_players_logged_in: null,
	last_type_processed: null,
	queue_head: null,
	queue_tail: null,
	queue_priority_count: 0,
	queue_priority_count_bg: 0,
	map_loading: 0,
	current_runlevel: null,
	name: "Master",
}, { global: { restart_clear: 613, restart_timeout: 614, restart_count: 615, current_ticklimit: 616 } });

// /datum/controller/master/proc/New  (code/controllers/master.dm:63)  may sleep
rt.def("/datum/controller/master/proc/New", function* New(f: Frame) {
	rt.setSv(f, "subsystems", rt.list());
	if (!isEqual(rt.gl("Master"), live(f.src))) {
		if (truthy((rt.istype(rt.gl("Master"), T("/datum/controller/master")) ? 1 : 0))) {
			yield* g.srcCall(f, "Recover");
			yield* g.call(f, P("/proc/qdel"), null, [rt.gl("Master")]);
		} else {
			yield* g.call(f, P("/proc/init_subtypes"), null, [T("/datum/controller/subsystem"), rt.sv(f, "subsystems")]);
		}
		rt.setGl("Master", live(f.src));
	}
	if (truthy(rt.gl("GLOB"))) return f.dot;
	yield* g.new_(f, T("/datum/controller/global_vars"), []);
	return f.dot;
}, true);

// /datum/controller/master/proc/Destroy  (code/controllers/master.dm:76)  may sleep
rt.def("/datum/controller/master/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	return 4;
}, true);

// /datum/controller/master/proc/Shutdown  (code/controllers/master.dm:82)  may sleep
rt.def("/datum/controller/master/proc/Shutdown", function* Shutdown(f: Frame) {
	let ss: Value = null;
	let $e: any;
	f.vars = () => [ss, $e];
	rt.setSv(f, "processing", 0);
	yield* g.call(f, P("/proc/sortTim"), null, [rt.sv(f, "subsystems"), P("/proc/cmp_subsystem_init")]);
	yield* g.call(f, P("/proc/reverseRange"), null, [rt.sv(f, "subsystems")]);
	ss = null;
	rt.forList(f, 0, rt.sv(f, "subsystems"), T("/datum/controller/subsystem"));
	while (($e = rt.next(f, 0)) !== undefined) {
		ss = $e;
		yield* g.callName(f, live(ss), "Shutdown", []);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /proc/Recreate_MC  (code/controllers/master.dm:92)  may sleep
rt.def("/proc/Recreate_MC", function* Recreate_MC(f: Frame) {
	let delay: Value = null;
	f.vars = () => [delay];
	f.dot = -1;
	if (rt.lt(rt.worldTime(f), rt.gl("restart_timeout"))) {
		return 0;
	}
	if (rt.lt(rt.worldTime(f), rt.gl("restart_clear"))) {
		(rt.modGl("restart_count", 0.5, multiply));
	}
	delay = multiply(50, rt.incGl("restart_count", 1, false));
	rt.setGl("restart_timeout", add(rt.worldTime(f), live(delay)));
	rt.setGl("restart_clear", add(rt.worldTime(f), multiply(live(delay), 2)));
	rt.setFv(f, "processing", rt.gl("Master"), 0);
	rt.tryOpen(f);
	try {
		yield* g.new_(f, T("/datum/controller/master"), []);
		rt.tryClose(f);
	} catch ($err) {
		rt.catchValue(f, $err);
		return -1;
	}
	return 1;
}, true);

// /datum/controller/master/proc/Recover  (code/controllers/master.dm:109)  may sleep
rt.def("/datum/controller/master/proc/Recover", function* Recover(f: Frame) {
	let msg: Value = null, varname: Value = null, varval: Value = null, D: Value = null, BadBoy: Value = null, FireHim: Value = null;
	let $0: any, $e: any;
	f.vars = () => [msg, varname, varval, D, BadBoy, FireHim, $0, $e];
	msg = fmt("## DEBUG: ＀ MC restarted. Reports:\n", [(yield* g.call(f, P("/proc/time2text"), null, [rt.fv(f, "timeofday", rt.world())]))]);
	varname = null;
	rt.forList(f, 0, rt.fv(f, "vars", rt.gl("Master")));
	while (($e = rt.next(f, 0)) !== undefined) {
		varname = $e;
		$0 = live(varname);
		if ($0 === "name" || $0 === "tag" || $0 === "bestF" || $0 === "type" || $0 === "parent_type" || $0 === "vars" || $0 === "statclick") {
			continue;
		} else {
			if (truthy((rt.istype((varval = rt.index(rt.fv(f, "vars", rt.gl("Master")), live(varname))), T("/datum")) ? 1 : 0))) {
				D = live(varval);
				msg = rt.modify(live(msg), fmt("\t ＀ = ＀(＀)\n", [live(varname), live(D), rt.fv(f, "type", live(D))]), add);
			} else {
				msg = rt.modify(live(msg), fmt("\t ＀ = ＀\n", [live(varname), live(varval)]), add);
			}
		}
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/log_world"), null, [live(msg)]);
	BadBoy = rt.fv(f, "last_type_processed", rt.gl("Master"));
	FireHim = 0;
	if (truthy((rt.istype(live(BadBoy), T("/datum/controller/subsystem")) ? 1 : 0))) {
		msg = null;
		$0 = rt.incGl("failure_strikes", 1, false);
		if ($0 === 2) {
			msg = fmt("The ＀ subsystem was the last to fire for 2 controller restarts. It will be recovered now and disabled if it happens again.", [rt.fv(f, "name", live(BadBoy))]);
			FireHim = 1;
		} else if ($0 === 3) {
			msg = fmt("The ＀ subsystem seems to be destabilizing the MC and will be offlined.", [rt.fv(f, "name", live(BadBoy))]);
			(rt.modField(f, live(BadBoy), "flags", 2, rt.bitOr));
		}
		if (truthy(live(msg))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.gl("admins"), fmt("<span class='boldannounce'>＀</span>", [live(msg)])]);
			yield* g.call(f, P("/proc/log_world"), null, [live(msg)]);
		}
	}
	if (truthy((rt.istype(rt.fv(f, "subsystems", rt.gl("Master")), T("/list")) ? 1 : 0))) {
		if (truthy(live(FireHim))) {
			rt.modField(f, rt.gl("Master"), "subsystems", (yield* g.new_(f, rt.fv(f, "type", live(BadBoy)), [])), add);
		}
		rt.setSv(f, "subsystems", rt.fv(f, "subsystems", rt.gl("Master")));
		rt.setSv(f, "current_runlevel", rt.fv(f, "current_runlevel", rt.gl("Master")));
		yield* g.srcCall(f, "StartProcessing", 10);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), "<span class='boldannounce'>The Master Controller is having some issues, we will need to re-initialize EVERYTHING</span>"]);
		yield* g.srcCall(f, "Initialize", 20, 1);
	}
	return f.dot;
}, true);

// /datum/controller/master/proc/Initialize  (code/controllers/master.dm:155)  may sleep
rt.def("/datum/controller/master/proc/Initialize", function* Initialize(f: Frame, delay: Value, init_sss: Value) {
	let start_timeofday: Value = null, SS: Value = null, time: Value = null, msg: Value = null, initialized_tod: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $e: any;
	f.vars = () => [delay, init_sss, start_timeofday, SS, time, msg, initialized_tod, $0, $1, $2, $3, $e];
	if (truthy(live(delay))) {
		yield* g.call(f, P("/proc/sleep"), null, [live(delay)]);
	}
	if (truthy(live(init_sss))) {
		yield* g.call(f, P("/proc/init_subtypes"), null, [T("/datum/controller/subsystem"), rt.sv(f, "subsystems")]);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), "<span class='boldannounce'>Initializing subsystems...</span>"]);
	yield* g.call(f, P("/proc/sortTim"), null, [rt.sv(f, "subsystems"), P("/proc/cmp_subsystem_init")]);
	$0 = rt.fv(f, "timeofday", rt.world());
	$1 = 864000;
	if (!isEqual(rt.gl("rollovercheck_last_timeofday"), rt.fv(f, "timeofday", rt.world()))) {
		$2 = (yield* g.call(f, P("/proc/update_midnight_rollover"), null, []));
	} else {
		$2 = rt.gl("midnight_rollovers");
	}
	start_timeofday = add($0, multiply($1, $2));
	rt.setGl("current_ticklimit", rt.fv(f, "tick_limit_mc_init", rt.gl("config")));
	SS = null;
	rt.forList(f, 0, rt.sv(f, "subsystems"), T("/datum/controller/subsystem"));
	while (($e = rt.next(f, 0)) !== undefined) {
		SS = $e;
		if (truthy(rt.bitAnd(rt.fv(f, "flags", live(SS)), 1))) {
			continue;
		}
		$0 = live(SS);
		$1 = rt.fv(f, "timeofday", rt.world());
		$2 = 864000;
		if (!isEqual(rt.gl("rollovercheck_last_timeofday"), rt.fv(f, "timeofday", rt.world()))) {
			$3 = (yield* g.call(f, P("/proc/update_midnight_rollover"), null, []));
		} else {
			$3 = rt.gl("midnight_rollovers");
		}
		yield* g.callName(f, $0, "Initialize", [add($1, multiply($2, $3))]);
		if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
			yield* g.call(f, P("/proc/stoplag"), null, []);
		}
	}
	rt.endFor(f, 0);
	rt.setGl("current_ticklimit", 60);
	$0 = rt.fv(f, "timeofday", rt.world());
	$1 = 864000;
	if (!isEqual(rt.gl("rollovercheck_last_timeofday"), rt.fv(f, "timeofday", rt.world()))) {
		$2 = (yield* g.call(f, P("/proc/update_midnight_rollover"), null, []));
	} else {
		$2 = rt.gl("midnight_rollovers");
	}
	time = divide(subtract(add($0, multiply($1, $2)), live(start_timeofday)), 10);
	$0 = live(time);
	if (isEqual(live(time), 1)) {
		$1 = "";
	} else {
		$1 = "s";
	}
	msg = fmt("Initializations complete within ＀ second＀!", [$0, $1]);
	yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("<span class='boldannounce'>＀</span>", [live(msg)])]);
	yield* g.call(f, P("/proc/log_world"), null, [live(msg)]);
	if (!truthy(rt.sv(f, "current_runlevel"))) {
		yield* g.srcCall(f, "SetRunLevel", 1);
	}
	yield* g.call(f, P("/proc/sortTim"), null, [rt.sv(f, "subsystems"), P("/proc/cmp_subsystem_display")]);
	rt.setFv(f, "sleep_offline", rt.world(), 1);
	rt.setFv(f, "fps", rt.world(), rt.fv(f, "fps", rt.gl("config")));
	$0 = rt.fv(f, "timeofday", rt.world());
	$1 = 864000;
	if (!isEqual(rt.gl("rollovercheck_last_timeofday"), rt.fv(f, "timeofday", rt.world()))) {
		$2 = (yield* g.call(f, P("/proc/update_midnight_rollover"), null, []));
	} else {
		$2 = rt.gl("midnight_rollovers");
	}
	initialized_tod = add($0, multiply($1, $2));
	return yield* rt.sleepThen(f, 1, "Master.Initialize after sleep(1)", [initialized_tod]); // the lobby snapshot is saved during this sleep
}, true, { waitfor: false });

// the end of /datum/controller/master/proc/Initialize (master.dm:190-192), run in its frame after its sleep(1).
rt.tail("Master.Initialize after sleep(1)", function* (f: Frame, initialized_tod: Value) {
	let $0: any, $1: any, $2: any, $3: any;
	f.vars = () => [initialized_tod, $0, $1, $2, $3];
	$0 = live(initialized_tod);
	$1 = rt.fv(f, "timeofday", rt.world());
	$2 = 864000;
	if (!isEqual(rt.gl("rollovercheck_last_timeofday"), rt.fv(f, "timeofday", rt.world()))) {
		$3 = (yield* g.call(f, P("/proc/update_midnight_rollover"), null, []));
	} else {
		$3 = rt.gl("midnight_rollovers");
	}
	rt.setSv(f, "initializations_finished_with_no_players_logged_in", (rt.lt($0, subtract(add($1, multiply($2, $3)), 10)) ? 1 : 0));
	yield* g.callName(f, rt.gl("Master"), "StartProcessing", [0]);
	return f.dot;
});

// /datum/controller/master/proc/SetRunLevel  (code/controllers/master.dm:195)
rt.def("/datum/controller/master/proc/SetRunLevel", function SetRunLevel(f: Frame, new_runlevel: Value) {
	let old_runlevel: Value = null;
	f.vars = () => [old_runlevel];
	if ((old_runlevel = rt.sv(f, "current_runlevel")) === null) {
		old_runlevel = "NULL";
	}
	rt.setSv(f, "current_runlevel", add(rt.op(f, "Log", [], [live(new_runlevel), 2]), 1));
	if (!rt.lt(rt.sv(f, "current_runlevel"), 1)) return f.dot;
	rt.call(f, P("/proc/CRASH"), null, [fmt("Attempted to set invalid runlevel: ＀", [live(new_runlevel)])]);
	return f.dot;
});

// /datum/controller/master/proc/StartProcessing  (code/controllers/master.dm:208)  may sleep
// Mid-round snapshots (tools/make-snapshot.mjs): Loop's code (master.dm:229) runs in this proc's own frame, not as a call to
// /proc/Loop, and its sleeps are rt.sleepKeep, so the sleeping MC is one frame holding its loop state as tail data
// ("Master.Loop"). Loop is otherwise unchanged; it returned -1 on a crash and is never called from anywhere else.
rt.def("/datum/controller/master/proc/StartProcessing", function* StartProcessing(f: Frame, delay: Value) {
	let tickersubsystems: Value = null, runlevel_sorted_subsystems: Value = null, timer: Value = null, thing: Value = null, SS: Value = null, ss_runlevels: Value = null, added_to_any: Value = null, I: Value = null, I_3: Value = null, cached_runlevel: Value = null, current_runlevel_subsystems: Value = null, error_level: Value = null, sleep_delta: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [delay, tickersubsystems, runlevel_sorted_subsystems, timer, thing, SS, ss_runlevels, added_to_any, I, I_3, cached_runlevel, current_runlevel_subsystems, error_level, sleep_delta, $0, $1, $2, $e];
	if (truthy(live(delay))) {
		yield* g.call(f, P("/proc/sleep"), null, [live(delay)]);
	}
	tickersubsystems = rt.list();
	runlevel_sorted_subsystems = rt.list(rt.list());
	timer = rt.worldTime(f);
	thing = null;
	rt.forList(f, 0, rt.sv(f, "subsystems"));
	while (($e = rt.next(f, 0)) !== undefined) {
		thing = $e;
		if (truthy(rt.bitAnd(rt.gv(f, "flags", (SS = live(thing))), 2))) {
			continue;
		}
		rt.setFv(f, "queued_time", live(SS), 0);
		rt.setFv(f, "queue_next", live(SS), null);
		rt.setFv(f, "queue_prev", live(SS), null);
		rt.setFv(f, "state", live(SS), 0);
		if (truthy(rt.bitAnd(rt.fv(f, "flags", live(SS)), 16))) {
			tickersubsystems = rt.modify(live(tickersubsystems), live(SS), add);
			timer = rt.modify(live(timer), multiply(rt.fv(f, "tick_lag", rt.world()), (yield* g.call(f, P("/proc/rand"), null, [1, 5]))), add);
			rt.setFv(f, "next_fire", live(SS), live(timer));
			continue;
		}
		ss_runlevels = rt.fv(f, "runlevels", live(SS));
		added_to_any = 0;
		I = null;
		rt.forRange(f, 1, 1, rt.len(f, rt.gl("bitflags")), 1);
		while (($e = rt.next(f, 1)) !== undefined) {
			I = $e;
			if (truthy(rt.bitAnd(live(ss_runlevels), rt.index(rt.gl("bitflags"), live(I))))) {
				while (rt.lt(rt.len(f, live(runlevel_sorted_subsystems)), live(I))) {
					runlevel_sorted_subsystems = rt.modify(live(runlevel_sorted_subsystems), rt.list(rt.list()), add);
				}
				rt.modAt(live(runlevel_sorted_subsystems), live(I), live(SS), add);
				added_to_any = 1;
			}
		}
		rt.endFor(f, 1);
		if (!truthy(live(added_to_any))) {
			yield* g.call(f, P("/proc/warning"), null, [fmt("＀ in ＀ at line ＀ src: ＀ usr: ＀.", [fmt("＀ subsystem is not SS_NO_FIRE but also does not have any runlevels set!", [rt.fv(f, "name", live(SS))]), "code/controllers/master.dm", 255, live(f.src), live(f.usr)])]);
		}
	}
	rt.endFor(f, 0);
	rt.setSv(f, "queue_head", null);
	rt.setSv(f, "queue_tail", null);
	yield* g.call(f, P("/proc/sortTim"), null, [live(tickersubsystems), P("/proc/cmp_subsystem_priority")]);
	I_3 = null;
	rt.forList(f, 0, live(runlevel_sorted_subsystems));
	while (($e = rt.next(f, 0)) !== undefined) {
		I_3 = $e;
		yield* g.call(f, P("/proc/sortTim"), null, [live(runlevel_sorted_subsystems), P("/proc/cmp_subsystem_priority")]);
		I_3 = rt.modify(live(I_3), live(tickersubsystems), add);
	}
	rt.endFor(f, 0);
	cached_runlevel = rt.sv(f, "current_runlevel");
	current_runlevel_subsystems = rt.index(live(runlevel_sorted_subsystems), live(cached_runlevel));
	$0 = rt.fv(f, "timeofday", rt.world());
	$1 = 864000;
	if (!isEqual(rt.gl("rollovercheck_last_timeofday"), rt.fv(f, "timeofday", rt.world()))) {
		$2 = (yield* g.call(f, P("/proc/update_midnight_rollover"), null, []));
	} else {
		$2 = rt.gl("midnight_rollovers");
	}
	rt.setSv(f, "init_timeofday", add($0, multiply($1, $2)));
	rt.setSv(f, "init_time", rt.worldTime(f));
	rt.setSv(f, "iteration", 1);
	error_level = 0;
	sleep_delta = 0;
	return yield* masterLoop(f, tickersubsystems, runlevel_sorted_subsystems, cached_runlevel, current_runlevel_subsystems, error_level, sleep_delta);
}, true, { waitfor: false });

// Loop's `while (true)` (master.dm:268), then the rest of StartProcessing with what Loop returned.
function* masterLoop(f: Frame, tickersubsystems: Value, runlevel_sorted_subsystems: Value, cached_runlevel: Value, current_runlevel_subsystems: Value, error_level: Value, sleep_delta: Value) {
	return yield* masterAfterLoop(f, yield* masterLoopWhile(f, tickersubsystems, runlevel_sorted_subsystems, cached_runlevel, current_runlevel_subsystems, error_level, sleep_delta));
}
rt.tail("Master.Loop", masterLoop);

function* masterLoopWhile(f: Frame, tickersubsystems: Value, runlevel_sorted_subsystems: Value, cached_runlevel: Value, current_runlevel_subsystems: Value, error_level: Value, sleep_delta: Value) {
	let subsystems_to_check: Value = null, SS_8: Value = null, checking_runlevel: Value = null, stagger: Value = null, I_10: Value = null, SS_11: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any, $5: any, $e: any;
	f.vars = () => [tickersubsystems, runlevel_sorted_subsystems, cached_runlevel, current_runlevel_subsystems, error_level, sleep_delta, subsystems_to_check, SS_8, checking_runlevel, stagger, I_10, SS_11, $0, $1, $2, $3, $4, $5, $e];
	while (true) {
		$0 = 0;
		$1 = multiply(0.699999988079071, rt.sv(f, "tickdrift"));
		$2 = 0.30000001192092896;
		$3 = rt.fv(f, "timeofday", rt.world());
		$4 = 864000;
		if (!isEqual(rt.gl("rollovercheck_last_timeofday"), rt.fv(f, "timeofday", rt.world()))) {
			$5 = (yield* g.call(f, P("/proc/update_midnight_rollover"), null, []));
		} else {
			$5 = rt.gl("midnight_rollovers");
		}
		rt.setSv(f, "tickdrift", (yield* g.call(f, P("/proc/max"), null, [$0, add($1, multiply($2, divide(subtract(subtract(add($3, multiply($4, $5)), rt.sv(f, "init_timeofday")), subtract(rt.worldTime(f), rt.sv(f, "init_time"))), rt.fv(f, "tick_lag", rt.world()))))])));
		if (rt.le(rt.sv(f, "processing"), 0)) {
			rt.setGl("current_ticklimit", 60);
			yield* rt.sleepKeep(f, 10, "Master.Loop", [tickersubsystems, runlevel_sorted_subsystems, cached_runlevel, current_runlevel_subsystems, error_level, sleep_delta]);
			continue;
		}
		if (rt.gt(rt.tickUsage(f), 50)) {
			sleep_delta = rt.modify(live(sleep_delta), 2, add);
			rt.setGl("current_ticklimit", 30);
			yield* rt.sleepKeep(f, multiply(rt.fv(f, "tick_lag", rt.world()), add(rt.sv(f, "processing"), live(sleep_delta))), "Master.Loop", [tickersubsystems, runlevel_sorted_subsystems, cached_runlevel, current_runlevel_subsystems, error_level, sleep_delta]);
			continue;
		}
		sleep_delta = add(multiply(0.699999988079071, live(sleep_delta)), 0);
		if (rt.gt(add(rt.sv(f, "last_run"), multiply(rt.fv(f, "tick_lag", rt.world()), rt.sv(f, "processing"))), rt.worldTime(f))) {
			sleep_delta = rt.modify(live(sleep_delta), 1, add);
		}
		if (rt.gt(rt.tickUsage(f), 25)) {
			sleep_delta = rt.modify(live(sleep_delta), 1, add);
		}
		if (truthy(rt.sv(f, "make_runtime"))) {
			SS_8 = null;
			rt.setFv(f, "can_fire", live(SS_8), 0);
		}
		if ((!truthy(rt.gl("Failsafe")) || (rt.gt(rt.fv(f, "processing_interval", rt.gl("Failsafe")), 0) && rt.lt(add(rt.fv(f, "lasttick", rt.gl("Failsafe")), multiply(rt.fv(f, "processing_interval", rt.gl("Failsafe")), 5)), rt.worldTime(f))))) {
			yield* g.new_(f, T("/datum/controller/failsafe"), []);
		}
		if ((!truthy(rt.sv(f, "queue_head")) || !truthy(rt.modulus(rt.sv(f, "iteration"), 3)))) {
			checking_runlevel = rt.sv(f, "current_runlevel");
			if (!isEqual(live(cached_runlevel), live(checking_runlevel))) {
				cached_runlevel = live(checking_runlevel);
				current_runlevel_subsystems = rt.index(live(runlevel_sorted_subsystems), live(cached_runlevel));
				stagger = rt.worldTime(f);
				I_10 = null;
				rt.forList(f, 0, live(current_runlevel_subsystems));
				while (($e = rt.next(f, 0)) !== undefined) {
					I_10 = $e;
					if (rt.le(rt.gv(f, "next_fire", (SS_11 = live(I_10))), rt.worldTime(f))) {
						stagger = rt.modify(live(stagger), multiply(rt.fv(f, "tick_lag", rt.world()), (yield* g.call(f, P("/proc/rand"), null, [1, 5]))), add);
						rt.setFv(f, "next_fire", live(SS_11), live(stagger));
					}
				}
				rt.endFor(f, 0);
			}
			subsystems_to_check = live(current_runlevel_subsystems);
		} else {
			subsystems_to_check = live(tickersubsystems);
		}
		if (rt.le((yield* g.srcCall(f, "CheckQueue", live(subsystems_to_check))), 0)) {
			if (!truthy((yield* g.srcCall(f, "SoftReset", live(tickersubsystems), live(runlevel_sorted_subsystems))))) {
				yield* g.call(f, P("/proc/log_world"), null, ["MC: SoftReset() failed, crashing"]);
				return -1; // Loop's `.` (it set . = -1 first)
			}
			if (!truthy(live(error_level))) {
				rt.incSrcVar(f, "iteration", 1, true);
			}
			error_level = rt.inc(live(error_level), 1);
			rt.setGl("current_ticklimit", 60);
			yield* rt.sleepKeep(f, 10, "Master.Loop", [tickersubsystems, runlevel_sorted_subsystems, cached_runlevel, current_runlevel_subsystems, error_level, sleep_delta]);
			continue;
		}
		if (truthy(rt.sv(f, "queue_head"))) {
			if (rt.le((yield* g.srcCall(f, "RunQueue")), 0)) {
				if (!truthy((yield* g.srcCall(f, "SoftReset", live(tickersubsystems), live(runlevel_sorted_subsystems))))) {
					yield* g.call(f, P("/proc/log_world"), null, ["MC: SoftReset() failed, crashing"]);
					return -1; // Loop's `.` (it set . = -1 first)
				}
				if (!truthy(live(error_level))) {
					rt.incSrcVar(f, "iteration", 1, true);
				}
				error_level = rt.inc(live(error_level), 1);
				rt.setGl("current_ticklimit", 60);
				yield* rt.sleepKeep(f, 10, "Master.Loop", [tickersubsystems, runlevel_sorted_subsystems, cached_runlevel, current_runlevel_subsystems, error_level, sleep_delta]);
				continue;
			}
		}
		error_level = rt.inc(live(error_level), -1);
		if (!truthy(rt.sv(f, "queue_head"))) {
			rt.setSv(f, "queue_priority_count", 0);
			rt.setSv(f, "queue_priority_count_bg", 0);
		}
		rt.incSrcVar(f, "iteration", 1, true);
		rt.setSv(f, "last_run", rt.worldTime(f));
		rt.setFv(f, "sleep_delta", live(f.src), add(multiply(0.699999988079071, rt.fv(f, "sleep_delta", live(f.src))), multiply(0.30000001192092896, live(sleep_delta))));
		rt.setGl("current_ticklimit", 45);
		yield* rt.sleepKeep(f, multiply(rt.fv(f, "tick_lag", rt.world()), add(rt.sv(f, "processing"), live(sleep_delta))), "Master.Loop", [tickersubsystems, runlevel_sorted_subsystems, cached_runlevel, current_runlevel_subsystems, error_level, sleep_delta]);
	}
	return -1;
}

// The rest of StartProcessing (master.dm:213-221): rtn is what Loop returned.
function* masterAfterLoop(f: Frame, rtn: Value) {
	let rtn2: Value = null;
	if ((rt.gt(live(rtn), 0) || rt.lt(rt.sv(f, "processing"), 0))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/log_game"), null, ["MC crashed or runtimed, restarting"]);
	yield* g.call(f, P("/proc/message_admins"), null, ["MC crashed or runtimed, restarting"]);
	if (!rt.le((rtn2 = (yield* g.call(f, P("/proc/Recreate_MC"), null, []))), 0)) return f.dot;
	yield* g.call(f, P("/proc/log_game"), null, [fmt("Failed to recreate MC (Error code: ＀), it's up to the failsafe now", [live(rtn2)])]);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("Failed to recreate MC (Error code: ＀), it's up to the failsafe now", [live(rtn2)])]);
	rt.setFv(f, "defcon", rt.gl("Failsafe"), 2);
	return f.dot;
}

// /datum/controller/master/proc/CheckQueue  (code/controllers/master.dm:363)
rt.def("/datum/controller/master/proc/CheckQueue", function CheckQueue(f: Frame, subsystemstocheck: Value) {
	let SS: Value = null, SS_flags: Value = null, thing: Value = null;
	let $e: any;
	f.vars = () => [subsystemstocheck, SS, SS_flags, thing, $e];
	f.dot = 0;
	SS = null;
	SS_flags = null;
	thing = null;
	rt.forList(f, 0, live(subsystemstocheck));
	while (($e = rt.next(f, 0)) !== undefined) {
		thing = $e;
		if (!truthy(live(thing))) {
			(subsystemstocheck = rt.modify(live(subsystemstocheck), live(thing), subtract));
		}
		if (!isEqual(rt.gv(f, "state", (SS = live(thing))), 0)) {
			continue;
		}
		if (rt.le(rt.fv(f, "can_fire", live(SS)), 0)) {
			continue;
		}
		if (rt.gt(rt.fv(f, "next_fire", live(SS)), rt.worldTime(f))) {
			continue;
		}
		if (truthy(rt.bitAnd((SS_flags = rt.fv(f, "flags", live(SS))), 2))) {
			(subsystemstocheck = rt.modify(live(subsystemstocheck), live(SS), subtract));
			continue;
		}
		if (((!truthy(rt.bitAnd(live(SS_flags), 16)) && truthy(rt.bitAnd(live(SS_flags), 32))) && rt.gt(add(rt.fv(f, "last_fire", live(SS)), multiply(rt.fv(f, "wait", live(SS)), 0.75)), rt.worldTime(f)))) {
			continue;
		}
		rt.callName(f, live(SS), "enqueue", []);
	}
	rt.endFor(f, 0);
	f.dot = 1;
	return f.dot;
});

// /datum/controller/master/proc/RunQueue  (code/controllers/master.dm:401)
rt.def("/datum/controller/master/proc/RunQueue", function RunQueue(f: Frame) {
	let queue_node: Value = null, queue_node_flags: Value = null, queue_node_priority: Value = null, queue_node_paused: Value = null, current_tick_budget: Value = null, tick_precentage: Value = null, tick_remaining: Value = null, ran: Value = null, ran_non_ticker: Value = null, bg_calc: Value = null, tick_usage: Value = null, state: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [queue_node, queue_node_flags, queue_node_priority, queue_node_paused, current_tick_budget, tick_precentage, tick_remaining, ran, ran_non_ticker, bg_calc, tick_usage, state, $0, $1, $2];
	f.dot = 0;
	queue_node = null;
	queue_node_flags = null;
	queue_node_priority = null;
	queue_node_paused = null;
	current_tick_budget = null;
	tick_precentage = null;
	tick_remaining = null;
	ran = 1;
	ran_non_ticker = 0;
	bg_calc = null;
	tick_usage = null;
	while ((truthy(live(ran)) && truthy(rt.sv(f, "queue_head"))) && rt.lt(rt.tickUsage(f), 50)) {
		ran = 0;
		bg_calc = 0;
		current_tick_budget = rt.sv(f, "queue_priority_count");
		queue_node = rt.sv(f, "queue_head");
		while (truthy(live(queue_node))) {
			if ((truthy(live(ran)) && rt.gt(rt.tickUsage(f), 60))) {
				break;
			}
			queue_node_flags = rt.fv(f, "flags", live(queue_node));
			queue_node_priority = rt.fv(f, "queued_priority", live(queue_node));
			if (truthy(rt.bitAnd(live(queue_node_flags), 8))) {
				if ((rt.gt(rt.fv(f, "tick_usage", live(queue_node)), subtract(60, rt.tickUsage(f))) && truthy(live(ran_non_ticker)))) {
					rt.modField(f, live(queue_node), "queued_priority", multiply(rt.sv(f, "queue_priority_count"), 0.10000000149011612), add);
					(rt.modSrcVar(f, "queue_priority_count", live(queue_node_priority), subtract));
					rt.modSrcVar(f, "queue_priority_count", rt.fv(f, "queued_priority", live(queue_node)), add);
					(current_tick_budget = rt.modify(live(current_tick_budget), live(queue_node_priority), subtract));
					queue_node = rt.fv(f, "queue_next", live(queue_node));
					continue;
				}
			}
			if ((truthy(rt.bitAnd(live(queue_node_flags), 4)) && !truthy(live(bg_calc)))) {
				current_tick_budget = rt.sv(f, "queue_priority_count_bg");
				bg_calc = 1;
			}
			tick_remaining = subtract(60, rt.tickUsage(f));
			if ((rt.gt(live(current_tick_budget), 0) && rt.gt(live(queue_node_priority), 0))) {
				tick_precentage = divide(live(tick_remaining), divide(live(current_tick_budget), live(queue_node_priority)));
			} else {
				tick_precentage = live(tick_remaining);
			}
			tick_precentage = rt.call(f, P("/proc/max"), null, [multiply(live(tick_precentage), 0.5), subtract(live(tick_precentage), rt.fv(f, "tick_overrun", live(queue_node)))]);
			rt.setGl("current_ticklimit", rt.call(f, P("/proc/round"), null, [add(rt.tickUsage(f), live(tick_precentage))]));
			if (!truthy(rt.bitAnd(live(queue_node_flags), 16))) {
				ran_non_ticker = 1;
			}
			ran = 1;
			queue_node_paused = ((isEqual(rt.fv(f, "state", live(queue_node)), 3) ? 1 : 0) || (isEqual(rt.fv(f, "state", live(queue_node)), 5) ? 1 : 0));
			rt.setSv(f, "last_type_processed", live(queue_node));
			rt.setFv(f, "state", live(queue_node), 2);
			tick_usage = rt.tickUsage(f);
			state = rt.callName(f, live(queue_node), "ignite", [live(queue_node_paused)]);
			tick_usage = subtract(rt.tickUsage(f), live(tick_usage));
			if (isEqual(live(state), 2)) {
				state = 0;
			}
			(current_tick_budget = rt.modify(live(current_tick_budget), live(queue_node_priority), subtract));
			if (rt.lt(live(tick_usage), 0)) {
				tick_usage = 0;
			}
			$0 = live(queue_node);
			$1 = 0;
			if (rt.gt(rt.fv(f, "tick_overrun", live(queue_node)), subtract(live(tick_usage), live(tick_precentage)))) {
				$2 = add(multiply(0.8999999761581421, rt.fv(f, "tick_overrun", live(queue_node))), multiply(0.10000000149011612, subtract(live(tick_usage), live(tick_precentage))));
			} else {
				$2 = add(multiply(0.699999988079071, rt.fv(f, "tick_overrun", live(queue_node))), multiply(0.30000001192092896, subtract(live(tick_usage), live(tick_precentage))));
			}
			rt.setFv(f, "tick_overrun", $0, rt.call(f, P("/proc/max"), null, [$1, $2]));
			rt.setFv(f, "state", live(queue_node), live(state));
			if (isEqual(live(state), 3)) {
				rt.incField(f, live(queue_node), "paused_ticks", 1, true);
				rt.modField(f, live(queue_node), "paused_tick_usage", live(tick_usage), add);
				queue_node = rt.fv(f, "queue_next", live(queue_node));
				continue;
			}
			rt.setFv(f, "ticks", live(queue_node), add(multiply(0.800000011920929, rt.fv(f, "ticks", live(queue_node))), multiply(0.20000000298023224, rt.fv(f, "paused_ticks", live(queue_node)))));
			tick_usage = rt.modify(live(tick_usage), rt.fv(f, "paused_tick_usage", live(queue_node)), add);
			rt.setFv(f, "tick_usage", live(queue_node), add(multiply(0.699999988079071, rt.fv(f, "tick_usage", live(queue_node))), multiply(0.30000001192092896, live(tick_usage))));
			rt.setFv(f, "cost", live(queue_node), add(multiply(0.699999988079071, rt.fv(f, "cost", live(queue_node))), multiply(0.30000001192092896, multiply(live(tick_usage), rt.fv(f, "tick_lag", rt.world())))));
			rt.setFv(f, "paused_ticks", live(queue_node), 0);
			rt.setFv(f, "paused_tick_usage", live(queue_node), 0);
			if (truthy(rt.bitAnd(live(queue_node_flags), 4))) {
				(rt.modSrcVar(f, "queue_priority_count_bg", live(queue_node_priority), subtract));
			} else {
				(rt.modSrcVar(f, "queue_priority_count", live(queue_node_priority), subtract));
			}
			rt.setFv(f, "last_fire", live(queue_node), rt.worldTime(f));
			rt.incField(f, live(queue_node), "times_fired", 1, true);
			if (truthy(rt.bitAnd(live(queue_node_flags), 16))) {
				rt.setFv(f, "next_fire", live(queue_node), add(rt.worldTime(f), multiply(rt.fv(f, "tick_lag", rt.world()), add(rt.fv(f, "wait", live(queue_node)), divide(rt.fv(f, "tick_overrun", live(queue_node)), 100)))));
			} else {
				if (truthy(rt.bitAnd(live(queue_node_flags), 64))) {
					rt.setFv(f, "next_fire", live(queue_node), add(add(rt.worldTime(f), rt.fv(f, "wait", live(queue_node))), multiply(rt.fv(f, "tick_lag", rt.world()), divide(rt.fv(f, "tick_overrun", live(queue_node)), 100))));
				} else {
					if (truthy(rt.bitAnd(live(queue_node_flags), 32))) {
						rt.modField(f, live(queue_node), "next_fire", rt.fv(f, "wait", live(queue_node)), add);
					} else {
						rt.setFv(f, "next_fire", live(queue_node), add(add(rt.fv(f, "queued_time", live(queue_node)), rt.fv(f, "wait", live(queue_node))), multiply(rt.fv(f, "tick_lag", rt.world()), divide(rt.fv(f, "tick_overrun", live(queue_node)), 100))));
					}
				}
			}
			rt.setFv(f, "queued_time", live(queue_node), 0);
			rt.callName(f, live(queue_node), "dequeue", []);
			queue_node = rt.fv(f, "queue_next", live(queue_node));
		}
	}
	f.dot = 1;
	return f.dot;
});

// /datum/controller/master/proc/SoftReset  (code/controllers/master.dm:510)
rt.def("/datum/controller/master/proc/SoftReset", function SoftReset(f: Frame, ticker_SS: Value, runlevel_SS: Value) {
	let subsystemstocheck: Value = null, I: Value = null, thing: Value = null, SS: Value = null, I_3: Value = null;
	let $e: any;
	f.vars = () => [ticker_SS, subsystemstocheck, I, thing, SS, I_3, $e];
	f.dot = 0;
	rt.call(f, P("/proc/log_world"), null, ["MC: SoftReset called, resetting MC queue state."]);
	if (((!truthy((rt.istype(rt.sv(f, "subsystems"), T("/list")) ? 1 : 0)) || !truthy((rt.istype(live(ticker_SS), T("/list")) ? 1 : 0))) || !truthy((rt.istype(live(runlevel_SS), T("/list")) ? 1 : 0)))) {
		rt.call(f, P("/proc/log_world"), null, [fmt("MC: SoftReset: Bad list contents: '＀' '＀' '＀'", [rt.sv(f, "subsystems"), live(ticker_SS), live(runlevel_SS)])]);
		return live(f.dot);
	}
	subsystemstocheck = add(rt.sv(f, "subsystems"), live(ticker_SS));
	I = null;
	rt.forList(f, 0, live(runlevel_SS));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		(subsystemstocheck = rt.modify(live(subsystemstocheck), live(I), rt.bitOr));
	}
	rt.endFor(f, 0);
	thing = null;
	rt.forList(f, 0, live(subsystemstocheck));
	while (($e = rt.next(f, 0)) !== undefined) {
		thing = $e;
		if ((!truthy((SS = live(thing))) || !truthy((rt.istype(live(SS), T("/datum/controller/subsystem")) ? 1 : 0)))) {
			(rt.modSrcVar(f, "subsystems", rt.list(live(SS)), subtract));
			(ticker_SS = rt.modify(live(ticker_SS), rt.list(live(SS)), subtract));
			I_3 = null;
			rt.forList(f, 1, live(runlevel_SS));
			while (($e = rt.next(f, 1)) !== undefined) {
				I_3 = $e;
				(I_3 = rt.modify(live(I_3), rt.list(live(SS)), subtract));
			}
			rt.endFor(f, 1);
			rt.call(f, P("/proc/log_world"), null, [fmt("MC: SoftReset: Found bad entry in subsystem list, '＀'", [live(SS)])]);
			continue;
		}
		if ((truthy(rt.fv(f, "queue_next", live(SS))) && !truthy((rt.istype(rt.fv(f, "queue_next", live(SS)), T("/datum/controller/subsystem")) ? 1 : 0)))) {
			rt.call(f, P("/proc/log_world"), null, [fmt("MC: SoftReset: Found bad data in subsystem queue, queue_next = '＀'", [rt.fv(f, "queue_next", live(SS))])]);
		}
		rt.setFv(f, "queue_next", live(SS), null);
		if ((truthy(rt.fv(f, "queue_prev", live(SS))) && !truthy((rt.istype(rt.fv(f, "queue_prev", live(SS)), T("/datum/controller/subsystem")) ? 1 : 0)))) {
			rt.call(f, P("/proc/log_world"), null, [fmt("MC: SoftReset: Found bad data in subsystem queue, queue_prev = '＀'", [rt.fv(f, "queue_prev", live(SS))])]);
		}
		rt.setFv(f, "queue_prev", live(SS), null);
		rt.setFv(f, "queued_priority", live(SS), 0);
		rt.setFv(f, "queued_time", live(SS), 0);
		rt.setFv(f, "state", live(SS), 0);
	}
	rt.endFor(f, 0);
	if ((truthy(rt.sv(f, "queue_head")) && !truthy((rt.istype(rt.sv(f, "queue_head"), T("/datum/controller/subsystem")) ? 1 : 0)))) {
		rt.call(f, P("/proc/log_world"), null, [fmt("MC: SoftReset: Found bad data in subsystem queue, queue_head = '＀'", [rt.sv(f, "queue_head")])]);
	}
	rt.setSv(f, "queue_head", null);
	if ((truthy(rt.sv(f, "queue_tail")) && !truthy((rt.istype(rt.sv(f, "queue_tail"), T("/datum/controller/subsystem")) ? 1 : 0)))) {
		rt.call(f, P("/proc/log_world"), null, [fmt("MC: SoftReset: Found bad data in subsystem queue, queue_tail = '＀'", [rt.sv(f, "queue_tail")])]);
	}
	rt.setSv(f, "queue_tail", null);
	rt.setSv(f, "queue_priority_count", 0);
	rt.setSv(f, "queue_priority_count_bg", 0);
	rt.call(f, P("/proc/log_world"), null, ["MC: SoftReset: Finished."]);
	f.dot = 1;
	return f.dot;
});

// /datum/controller/master/proc/stat_entry  (code/controllers/master.dm:551)  may sleep
rt.def("/datum/controller/master/proc/stat_entry", function* stat_entry(f: Frame) {
	if (!truthy(rt.sv(f, "statclick"))) {
		rt.setSv(f, "statclick", (yield* g.new_(f, T("/obj/effect/statclick/debug"), [null, "Initializing...", live(f.src)])));
	}
	yield* g.call(f, P("/proc/stat"), null, ["Byond:", fmt("(FPS:＀) (TickCount:＀) (TickDrift:＀(＀%))", [rt.fv(f, "fps", rt.world()), divide(rt.worldTime(f), rt.fv(f, "tick_lag", rt.world())), (yield* g.call(f, P("/proc/round"), null, [rt.fv(f, "tickdrift", rt.gl("Master")), 1])), (yield* g.call(f, P("/proc/round"), null, [multiply(divide(rt.fv(f, "tickdrift", rt.gl("Master")), divide(rt.worldTime(f), rt.fv(f, "tick_lag", rt.world()))), 100), 0.10000000149011612]))])]);
	yield* g.call(f, P("/proc/stat"), null, ["Master Controller:", (yield* g.callName(f, rt.sv(f, "statclick"), "update", [fmt("(TickRate:＀) (Iteration:＀)", [rt.fv(f, "processing", rt.gl("Master")), rt.fv(f, "iteration", rt.gl("Master"))])]))]);
	return f.dot;
}, true);

// /datum/controller/master/proc/StartLoadingMap  (code/controllers/master.dm:560)  may sleep
rt.def("/datum/controller/master/proc/StartLoadingMap", function* StartLoadingMap(f: Frame) {
	let S: Value = null, SS: Value = null;
	let $e: any;
	f.vars = () => [S, SS, $e];
	while (truthy(rt.sv(f, "map_loading"))) {
		yield* g.call(f, P("/proc/stoplag"), null, []);
	}
	S = null;
	rt.forList(f, 0, rt.sv(f, "subsystems"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		yield* g.callName(f, (SS = live(S)), "StartLoadingMap", []);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "map_loading", 1);
	return f.dot;
}, true);

// /datum/controller/master/proc/StopLoadingMap  (code/controllers/master.dm:568)
rt.def("/datum/controller/master/proc/StopLoadingMap", function StopLoadingMap(f: Frame, bounds: Value) {
	let S: Value = null, SS: Value = null;
	let $e: any;
	f.vars = () => [bounds, S, SS, $e];
	if (live(bounds) === null) {
		bounds = null;
	}
	rt.setSv(f, "map_loading", 0);
	S = null;
	rt.forList(f, 0, rt.sv(f, "subsystems"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		rt.callName(f, (SS = live(S)), "StopLoadingMap", []);
	}
	rt.endFor(f, 0);
	return f.dot;
});
