// Based on /tg/station's code/controllers/master.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// master.dm:63
rt.def("/datum/controller/master/proc/New", function* New(f: Frame) {
	this.subsystems = list();
	if (GLOB.Master != this) {
		if (rt.istype(GLOB.Master, T("/datum/controller/master"))) {
			yield* this.Recover();
			yield* qdel(GLOB.Master);
		} else {
			yield* init_subtypes(T("/datum/controller/subsystem"), this.subsystems);
		}
		GLOB.Master = this;
	}
	if (GLOB.GLOB) return f.dot;
	yield* new_(T("/datum/controller/global_vars"));
	return f.dot;
}, true);

// master.dm:76
rt.def("/datum/controller/master/proc/Destroy", function* Destroy(f: Frame) {
	yield* parent_proc();
	return QDEL_HINT_HARDDEL_NOW;
}, true);

// master.dm:82
rt.def("/datum/controller/master/proc/Shutdown", function* Shutdown(f: Frame) {
	let ss: Value = null;
	this.processing = 0;
	yield* sortTim(this.subsystems, P("/proc/cmp_subsystem_init"));
	reverseRange(this.subsystems);
	for (ss of each(this.subsystems, T("/datum/controller/subsystem"))) {
		yield* ss.Shutdown();
	}
	return f.dot;
}, true);

// master.dm:92
rt.def("/proc/Recreate_MC", function* Recreate_MC(f: Frame) {
	f.dot = -1;
	if (rt.worldTime(f) < GLOB.restart_timeout) {
		return 0;
	}
	if (rt.worldTime(f) < GLOB.restart_clear) {
		GLOB.restart_count *= 0.5;
	}
	let delay: Value = 50 * rt.incGl("restart_count", 1, false);
	GLOB.restart_timeout = rt.worldTime(f) + delay;
	GLOB.restart_clear = rt.worldTime(f) + delay * 2;
	GLOB.Master.processing = 0;
	rt.tryOpen(f);
	try {
		yield* new_(T("/datum/controller/master"));
		rt.tryClose(f);
	} catch ($err) {
		rt.catchValue(f, $err);
		return -1;
	}
	return 1;
}, true);

// master.dm:109
rt.def("/datum/controller/master/proc/Recover", function* Recover(f: Frame) {
	let varname: Value = null, varval: Value = null, D: Value = null;
	let $e: any;
	let msg: Value = `## DEBUG: ${time2text(rt.world().timeofday)} MC restarted. Reports:\n`;
	for (varname of each(GLOB.Master.vars)) {
		if (varname === "name" || varname === "tag" || varname === "bestF" || varname === "type" || varname === "parent_type" || varname === "vars" || varname === "statclick") {
			continue;
		} else if (rt.istype((varval = rt.index(GLOB.Master.vars, varname)), T("/datum"))) {
			D = varval;
			msg += `\t ${varname} = ${D}(${D.type})\n`;
		} else {
			msg += `\t ${varname} = ${varval}\n`;
		}
	}
	log_world(msg);
	let BadBoy: Value = GLOB.Master.last_type_processed;
	let FireHim: Value = 0;
	if (rt.istype(BadBoy, T("/datum/controller/subsystem"))) {
		msg = null;
		const incGl_2 = rt.incGl("failure_strikes", 1, false);
		if (incGl_2 === 2) {
			msg = `The ${BadBoy.name} subsystem was the last to fire for 2 controller restarts. It will be recovered now and disabled if it happens again.`;
			FireHim = 1;
		} else if (incGl_2 === 3) {
			msg = `The ${BadBoy.name} subsystem seems to be destabilizing the MC and will be offlined.`;
			(rt.modField(f, BadBoy, "flags", SS_NO_FIRE, rt.bitOr));
		}
		if (msg) {
			to_chat(GLOB.admins, `<span class='boldannounce'>${msg}</span>`);
			log_world(msg);
		}
	}
	if (rt.istype(GLOB.Master.subsystems, T("/list"))) {
		if (FireHim) {
			GLOB.Master.subsystems += (yield* new_(BadBoy.type));
		}
		this.subsystems = GLOB.Master.subsystems;
		this.current_runlevel = GLOB.Master.current_runlevel;
		yield* this.StartProcessing(10);
	} else {
		to_chat(rt.world(), "<span class='boldannounce'>The Master Controller is having some issues, we will need to re-initialize EVERYTHING</span>");
		yield* this.Initialize(20, 1);
	}
	return f.dot;
}, true);

// master.dm:155
rt.def("/datum/controller/master/proc/Initialize", function* Initialize(f: Frame, delay: Value, init_sss: Value) {
	let SS: Value = null;
	let $2: any, $3: any, $e: any;
	if (delay) {
		yield* sleep(delay);
	}
	if (init_sss) {
		yield* init_subtypes(T("/datum/controller/subsystem"), this.subsystems);
	}
	to_chat(rt.world(), "<span class='boldannounce'>Initializing subsystems...</span>");
	yield* sortTim(this.subsystems, P("/proc/cmp_subsystem_init"));
	let $0: any = rt.world().timeofday;
	let $1: any = 864000;
	if (GLOB.rollovercheck_last_timeofday != rt.world().timeofday) {
		$2 = update_midnight_rollover();
	} else {
		$2 = GLOB.midnight_rollovers;
	}
	let start_timeofday: Value = $0 + $1 * $2;
	GLOB.current_ticklimit = GLOB.config.tick_limit_mc_init;
	for (SS of each(this.subsystems, T("/datum/controller/subsystem"))) {
		if (rt.bitAnd(SS.flags, 1)) {
			continue;
		}
		$0 = SS;
		$1 = rt.world().timeofday;
		$2 = 864000;
		if (GLOB.rollovercheck_last_timeofday != rt.world().timeofday) {
			$3 = update_midnight_rollover();
		} else {
			$3 = GLOB.midnight_rollovers;
		}
		yield* $0.Initialize($1 + $2 * $3);
		if (rt.tickUsage(f) > GLOB.current_ticklimit) {
			yield* stoplag();
		}
	}
	GLOB.current_ticklimit = 60;
	$0 = rt.world().timeofday;
	$1 = 864000;
	if (GLOB.rollovercheck_last_timeofday != rt.world().timeofday) {
		$2 = update_midnight_rollover();
	} else {
		$2 = GLOB.midnight_rollovers;
	}
	let time: Value = ($0 + $1 * $2 - start_timeofday) / 10;
	let msg: Value = `Initializations complete within ${time} second${time == 1 ? "" : "s"}!`;
	to_chat(rt.world(), `<span class='boldannounce'>${msg}</span>`);
	log_world(msg);
	if (!this.current_runlevel) {
		this.SetRunLevel(1);
	}
	yield* sortTim(this.subsystems, P("/proc/cmp_subsystem_display"));
	rt.world().sleep_offline = 1;
	rt.world().fps = GLOB.config.fps;
	$0 = rt.world().timeofday;
	$1 = 864000;
	if (GLOB.rollovercheck_last_timeofday != rt.world().timeofday) {
		$2 = update_midnight_rollover();
	} else {
		$2 = GLOB.midnight_rollovers;
	}
	let initialized_tod: Value = $0 + $1 * $2;
	return yield* rt.sleepThen(f, 1, "Master.Initialize after sleep(1)", [initialized_tod]); // the lobby snapshot is saved during this sleep
}, true, { waitfor: false });

// the end of /datum/controller/master/proc/Initialize (master.dm:190-192), run in its frame after its sleep(1).
rt.tail("Master.Initialize after sleep(1)", function* (f: Frame, initialized_tod: Value) {
	let $3: any;
	let $0: any = initialized_tod;
	let $1: any = rt.world().timeofday;
	let $2: any = 864000;
	if (GLOB.rollovercheck_last_timeofday != rt.world().timeofday) {
		$3 = update_midnight_rollover();
	} else {
		$3 = GLOB.midnight_rollovers;
	}
	this.initializations_finished_with_no_players_logged_in = ($0 < $1 + $2 * $3 - 10 ? 1 : 0);
	yield* GLOB.Master.StartProcessing(0);
	return f.dot;
});

// master.dm:195
rt.def("/datum/controller/master/proc/SetRunLevel", function SetRunLevel(f: Frame, new_runlevel: Value) {
	let old_runlevel: Value = null;
	if ((old_runlevel = this.current_runlevel) === null) {
		old_runlevel = "NULL";
	}
	this.current_runlevel = rt.op(f, "Log", [], [new_runlevel, 2]) + 1;
	if (!(this.current_runlevel < 1)) return f.dot;
	CRASH(`Attempted to set invalid runlevel: ${new_runlevel}`);
	return f.dot;
});

// master.dm:208
// Mid-round snapshots (tools/make-snapshot.mjs): Loop's code (master.dm:229) runs in this proc's own frame, not as a call to
// /proc/Loop, and its sleeps are rt.sleepKeep, so the sleeping MC is one frame holding its loop state as tail data
// ("Master.Loop"). Loop is otherwise unchanged; it returned -1 on a crash and is never called from anywhere else.
rt.def("/datum/controller/master/proc/StartProcessing", function* StartProcessing(f: Frame, delay: Value) {
	let thing: Value = null, SS: Value = null, ss_runlevels: Value = null, added_to_any: Value = null, I: Value = null, I_3: Value = null;
	let $2: any, $e: any;
	if (delay) {
		yield* sleep(delay);
	}
	let tickersubsystems: Value = list();
	let runlevel_sorted_subsystems: Value = list(list());
	let timer: Value = rt.worldTime(f);
	for (thing of each(this.subsystems)) {
		if (rt.bitAnd((SS = thing).flags, 2)) {
			continue;
		}
		SS.queued_time = 0;
		SS.queue_next = null;
		SS.queue_prev = null;
		SS.state = 0;
		if (rt.bitAnd(SS.flags, 16)) {
			tickersubsystems += SS;
			timer += rt.world().tick_lag * rand(1, 5);
			SS.next_fire = timer;
			continue;
		}
		ss_runlevels = SS.runlevels;
		added_to_any = 0;
		I = null;
		rt.forRange(f, 1, 1, rt.len(f, GLOB.bitflags), 1);
		while (($e = rt.next(f, 1)) !== undefined) {
			I = $e;
			if (rt.bitAnd(ss_runlevels, rt.index(GLOB.bitflags, I))) {
				while (rt.len(f, runlevel_sorted_subsystems) < I) {
					runlevel_sorted_subsystems += list(list());
				}
				rt.modAt(runlevel_sorted_subsystems, I, SS, add);
				added_to_any = 1;
			}
		}
		rt.endFor(f, 1);
		if (!added_to_any) {
			warning(`${`${SS.name} subsystem is not SS_NO_FIRE but also does not have any runlevels set!`} in ${"code/controllers/master.dm"} at line ${255} src: ${this} usr: ${f.usr}.`);
		}
	}
	this.queue_head = null;
	this.queue_tail = null;
	yield* sortTim(tickersubsystems, P("/proc/cmp_subsystem_priority"));
	for (I_3 of each(runlevel_sorted_subsystems)) {
		yield* sortTim(runlevel_sorted_subsystems, P("/proc/cmp_subsystem_priority"));
		I_3 += tickersubsystems;
	}
	let cached_runlevel: Value = this.current_runlevel;
	let current_runlevel_subsystems: Value = rt.index(runlevel_sorted_subsystems, cached_runlevel);
	let $0: any = rt.world().timeofday;
	let $1: any = 864000;
	if (GLOB.rollovercheck_last_timeofday != rt.world().timeofday) {
		$2 = update_midnight_rollover();
	} else {
		$2 = GLOB.midnight_rollovers;
	}
	this.init_timeofday = $0 + $1 * $2;
	this.init_time = rt.worldTime(f);
	this.iteration = 1;
	let error_level: Value = 0;
	let sleep_delta: Value = 0;
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
		$1 = multiply(0.7, rt.sv(f, "tickdrift"));
		$2 = 0.3;
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
			sleep_delta = rt.modify(sleep_delta, 2, add);
			rt.setGl("current_ticklimit", 30);
			yield* rt.sleepKeep(f, multiply(rt.fv(f, "tick_lag", rt.world()), add(rt.sv(f, "processing"), sleep_delta)), "Master.Loop", [tickersubsystems, runlevel_sorted_subsystems, cached_runlevel, current_runlevel_subsystems, error_level, sleep_delta]);
			continue;
		}
		sleep_delta = add(multiply(0.7, sleep_delta), 0);
		if (rt.gt(add(rt.sv(f, "last_run"), multiply(rt.fv(f, "tick_lag", rt.world()), rt.sv(f, "processing"))), rt.worldTime(f))) {
			sleep_delta = rt.modify(sleep_delta, 1, add);
		}
		if (rt.gt(rt.tickUsage(f), 25)) {
			sleep_delta = rt.modify(sleep_delta, 1, add);
		}
		if (rt.sv(f, "make_runtime")) {
			SS_8 = null;
			rt.setFv(f, "can_fire", SS_8, 0);
		}
		if (!rt.gl("Failsafe") || rt.gt(rt.fv(f, "processing_interval", rt.gl("Failsafe")), 0) && rt.lt(add(rt.fv(f, "lasttick", rt.gl("Failsafe")), multiply(rt.fv(f, "processing_interval", rt.gl("Failsafe")), 5)), rt.worldTime(f))) {
			yield* g.new_(f, T("/datum/controller/failsafe"), []);
		}
		if (!rt.sv(f, "queue_head") || !rt.modulus(rt.sv(f, "iteration"), 3)) {
			checking_runlevel = rt.sv(f, "current_runlevel");
			if (!isEqual(cached_runlevel, checking_runlevel)) {
				cached_runlevel = checking_runlevel;
				current_runlevel_subsystems = rt.index(runlevel_sorted_subsystems, cached_runlevel);
				stagger = rt.worldTime(f);
				I_10 = null;
				rt.forList(f, 0, current_runlevel_subsystems);
				while (($e = rt.next(f, 0)) !== undefined) {
					I_10 = $e;
					if (rt.le(rt.fv(f, "next_fire", (SS_11 = I_10)), rt.worldTime(f))) {
						stagger = rt.modify(stagger, multiply(rt.fv(f, "tick_lag", rt.world()), (yield* g.call(f, P("/proc/rand"), null, [1, 5]))), add);
						rt.setFv(f, "next_fire", SS_11, stagger);
					}
				}
				rt.endFor(f, 0);
			}
			subsystems_to_check = current_runlevel_subsystems;
		} else {
			subsystems_to_check = tickersubsystems;
		}
		if (rt.le((yield* g.srcCall(f, "CheckQueue", subsystems_to_check)), 0)) {
			if (!(yield* g.srcCall(f, "SoftReset", tickersubsystems, runlevel_sorted_subsystems))) {
				yield* g.call(f, P("/proc/log_world"), null, ["MC: SoftReset() failed, crashing"]);
				return -1; // Loop's `.` (it set . = -1 first)
			}
			if (!error_level) {
				rt.incSrcVar(f, "iteration", 1, true);
			}
			error_level = rt.inc(error_level, 1);
			rt.setGl("current_ticklimit", 60);
			yield* rt.sleepKeep(f, 10, "Master.Loop", [tickersubsystems, runlevel_sorted_subsystems, cached_runlevel, current_runlevel_subsystems, error_level, sleep_delta]);
			continue;
		}
		if (rt.sv(f, "queue_head")) {
			if (rt.le((yield* g.srcCall(f, "RunQueue")), 0)) {
				if (!(yield* g.srcCall(f, "SoftReset", tickersubsystems, runlevel_sorted_subsystems))) {
					yield* g.call(f, P("/proc/log_world"), null, ["MC: SoftReset() failed, crashing"]);
					return -1; // Loop's `.` (it set . = -1 first)
				}
				if (!error_level) {
					rt.incSrcVar(f, "iteration", 1, true);
				}
				error_level = rt.inc(error_level, 1);
				rt.setGl("current_ticklimit", 60);
				yield* rt.sleepKeep(f, 10, "Master.Loop", [tickersubsystems, runlevel_sorted_subsystems, cached_runlevel, current_runlevel_subsystems, error_level, sleep_delta]);
				continue;
			}
		}
		error_level = rt.inc(error_level, -1);
		if (!rt.sv(f, "queue_head")) {
			rt.setSv(f, "queue_priority_count", 0);
			rt.setSv(f, "queue_priority_count_bg", 0);
		}
		rt.incSrcVar(f, "iteration", 1, true);
		rt.setSv(f, "last_run", rt.worldTime(f));
		rt.setFv(f, "sleep_delta", f.src, add(multiply(0.7, rt.fv(f, "sleep_delta", f.src)), multiply(0.3, sleep_delta)));
		rt.setGl("current_ticklimit", 45);
		yield* rt.sleepKeep(f, multiply(rt.fv(f, "tick_lag", rt.world()), add(rt.sv(f, "processing"), sleep_delta)), "Master.Loop", [tickersubsystems, runlevel_sorted_subsystems, cached_runlevel, current_runlevel_subsystems, error_level, sleep_delta]);
	}
	return -1;
}

// The rest of StartProcessing (master.dm:213-221): rtn is what Loop returned.
function* masterAfterLoop(f: Frame, rtn: Value) {
	let rtn2: Value = null;
	if (rt.gt(rtn, 0) || rt.lt(rt.sv(f, "processing"), 0)) {
		return f.dot;
	}
	yield* g.call(f, P("/proc/log_game"), null, ["MC crashed or runtimed, restarting"]);
	yield* g.call(f, P("/proc/message_admins"), null, ["MC crashed or runtimed, restarting"]);
	if (!rt.le((rtn2 = (yield* g.call(f, P("/proc/Recreate_MC"), null, []))), 0)) return f.dot;
	yield* g.call(f, P("/proc/log_game"), null, [fmt("Failed to recreate MC (Error code: ＀), it's up to the failsafe now", [rtn2])]);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("Failed to recreate MC (Error code: ＀), it's up to the failsafe now", [rtn2])]);
	rt.setFv(f, "defcon", rt.gl("Failsafe"), 2);
	return f.dot;
}

// master.dm:363
rt.def("/datum/controller/master/proc/CheckQueue", function CheckQueue(f: Frame, subsystemstocheck: Value) {
	let SS: Value = null, SS_flags: Value = null, thing: Value = null;
	f.dot = 0;
	for (thing of each(subsystemstocheck)) {
		if (!thing) {
			subsystemstocheck -= thing;
		}
		if ((SS = thing).state != SS_IDLE) {
			continue;
		}
		if (SS.can_fire <= 0) {
			continue;
		}
		if (SS.next_fire > rt.worldTime(f)) {
			continue;
		}
		if (rt.bitAnd((SS_flags = SS.flags), SS_NO_FIRE)) {
			subsystemstocheck -= SS;
			continue;
		}
		if (!rt.bitAnd(SS_flags, SS_TICKER) && rt.bitAnd(SS_flags, SS_KEEP_TIMING) && SS.last_fire + SS.wait * 0.75 > rt.worldTime(f)) {
			continue;
		}
		SS.enqueue();
	}
	f.dot = 1;
	return f.dot;
});

// master.dm:401
rt.def("/datum/controller/master/proc/RunQueue", function RunQueue(f: Frame) {
	let queue_node: Value = null, queue_node_flags: Value = null, queue_node_priority: Value = null, queue_node_paused: Value = null, current_tick_budget: Value = null, tick_precentage: Value = null, tick_remaining: Value = null, bg_calc: Value = null, tick_usage: Value = null, state: Value = null;
	let $0: any, $1: any, $2: any;
	f.dot = 0;
	let ran: Value = 1;
	let ran_non_ticker: Value = 0;
	while (ran && this.queue_head && rt.tickUsage(f) < TICK_LIMIT_MC) {
		ran = 0;
		bg_calc = 0;
		current_tick_budget = this.queue_priority_count;
		queue_node = this.queue_head;
		while (queue_node) {
			if (ran && rt.tickUsage(f) > TICK_LIMIT_RUNNING) {
				break;
			}
			queue_node_flags = queue_node.flags;
			queue_node_priority = queue_node.queued_priority;
			if (rt.bitAnd(queue_node_flags, SS_NO_TICK_CHECK)) {
				if (queue_node.tick_usage > TICK_LIMIT_RUNNING - rt.tickUsage(f) && ran_non_ticker) {
					queue_node.queued_priority += this.queue_priority_count * 0.1;
					this.queue_priority_count -= queue_node_priority;
					this.queue_priority_count += queue_node.queued_priority;
					current_tick_budget -= queue_node_priority;
					queue_node = queue_node.queue_next;
					continue;
				}
			}
			if (rt.bitAnd(queue_node_flags, SS_BACKGROUND) && !bg_calc) {
				current_tick_budget = this.queue_priority_count_bg;
				bg_calc = 1;
			}
			tick_remaining = TICK_LIMIT_RUNNING - rt.tickUsage(f);
			if (current_tick_budget > 0 && queue_node_priority > 0) {
				tick_precentage = tick_remaining / (current_tick_budget / queue_node_priority);
			} else {
				tick_precentage = tick_remaining;
			}
			tick_precentage = max(tick_precentage * 0.5, tick_precentage - queue_node.tick_overrun);
			GLOB.current_ticklimit = round(rt.tickUsage(f) + tick_precentage);
			if (!rt.bitAnd(queue_node_flags, SS_TICKER)) {
				ran_non_ticker = 1;
			}
			ran = 1;
			queue_node_paused = ((queue_node.state == SS_PAUSED ? 1 : 0) || (queue_node.state == SS_PAUSING ? 1 : 0));
			this.last_type_processed = queue_node;
			queue_node.state = SS_RUNNING;
			tick_usage = rt.tickUsage(f);
			state = queue_node.ignite(queue_node_paused);
			tick_usage = rt.tickUsage(f) - tick_usage;
			if (state == SS_RUNNING) {
				state = SS_IDLE;
			}
			current_tick_budget -= queue_node_priority;
			if (tick_usage < 0) {
				tick_usage = 0;
			}
			$0 = queue_node;
			$1 = 0;
			if (queue_node.tick_overrun > tick_usage - tick_precentage) {
				$2 = 0.9 * queue_node.tick_overrun + 0.1 * (tick_usage - tick_precentage);
			} else {
				$2 = 0.7 * queue_node.tick_overrun + 0.3 * (tick_usage - tick_precentage);
			}
			$0.tick_overrun = max($1, $2);
			queue_node.state = state;
			if (state == SS_PAUSED) {
				queue_node.paused_ticks++;
				queue_node.paused_tick_usage += tick_usage;
				queue_node = queue_node.queue_next;
				continue;
			}
			queue_node.ticks = 0.8 * queue_node.ticks + 0.2 * queue_node.paused_ticks;
			tick_usage += queue_node.paused_tick_usage;
			queue_node.tick_usage = 0.7 * queue_node.tick_usage + 0.3 * tick_usage;
			queue_node.cost = 0.7 * queue_node.cost + 0.3 * (tick_usage * rt.world().tick_lag);
			queue_node.paused_ticks = 0;
			queue_node.paused_tick_usage = 0;
			if (rt.bitAnd(queue_node_flags, SS_BACKGROUND)) {
				this.queue_priority_count_bg -= queue_node_priority;
			} else {
				this.queue_priority_count -= queue_node_priority;
			}
			queue_node.last_fire = rt.worldTime(f);
			queue_node.times_fired++;
			if (rt.bitAnd(queue_node_flags, SS_TICKER)) {
				queue_node.next_fire = rt.worldTime(f) + rt.world().tick_lag * (queue_node.wait + queue_node.tick_overrun / 100);
			} else if (rt.bitAnd(queue_node_flags, SS_POST_FIRE_TIMING)) {
				queue_node.next_fire = rt.worldTime(f) + queue_node.wait + rt.world().tick_lag * (queue_node.tick_overrun / 100);
			} else if (rt.bitAnd(queue_node_flags, SS_KEEP_TIMING)) {
				queue_node.next_fire += queue_node.wait;
			} else {
				queue_node.next_fire = queue_node.queued_time + queue_node.wait + rt.world().tick_lag * (queue_node.tick_overrun / 100);
			}
			queue_node.queued_time = 0;
			queue_node.dequeue();
			queue_node = queue_node.queue_next;
		}
	}
	f.dot = 1;
	return f.dot;
});

// master.dm:510
rt.def("/datum/controller/master/proc/SoftReset", function SoftReset(f: Frame, ticker_SS: Value, runlevel_SS: Value) {
	let I: Value = null, thing: Value = null, SS: Value = null, I_3: Value = null;
	f.dot = 0;
	log_world("MC: SoftReset called, resetting MC queue state.");
	if (!rt.istype(this.subsystems, T("/list")) || !rt.istype(ticker_SS, T("/list")) || !rt.istype(runlevel_SS, T("/list"))) {
		log_world(`MC: SoftReset: Bad list contents: '${this.subsystems}' '${ticker_SS}' '${runlevel_SS}'`);
		return f.dot;
	}
	let subsystemstocheck: Value = this.subsystems + ticker_SS;
	for (I of each(runlevel_SS)) {
		(subsystemstocheck = rt.modify(subsystemstocheck, I, rt.bitOr));
	}
	for (thing of each(subsystemstocheck)) {
		if (!(SS = thing) || !rt.istype(SS, T("/datum/controller/subsystem"))) {
			this.subsystems -= list(SS);
			ticker_SS -= list(SS);
			I_3 = null;
			for (I_3 of each(runlevel_SS)) {
				I_3 -= list(SS);
			}
			log_world(`MC: SoftReset: Found bad entry in subsystem list, '${SS}'`);
			continue;
		}
		if (SS.queue_next && !rt.istype(SS.queue_next, T("/datum/controller/subsystem"))) {
			log_world(`MC: SoftReset: Found bad data in subsystem queue, queue_next = '${SS.queue_next}'`);
		}
		SS.queue_next = null;
		if (SS.queue_prev && !rt.istype(SS.queue_prev, T("/datum/controller/subsystem"))) {
			log_world(`MC: SoftReset: Found bad data in subsystem queue, queue_prev = '${SS.queue_prev}'`);
		}
		SS.queue_prev = null;
		SS.queued_priority = 0;
		SS.queued_time = 0;
		SS.state = SS_IDLE;
	}
	if (this.queue_head && !rt.istype(this.queue_head, T("/datum/controller/subsystem"))) {
		log_world(`MC: SoftReset: Found bad data in subsystem queue, queue_head = '${this.queue_head}'`);
	}
	this.queue_head = null;
	if (this.queue_tail && !rt.istype(this.queue_tail, T("/datum/controller/subsystem"))) {
		log_world(`MC: SoftReset: Found bad data in subsystem queue, queue_tail = '${this.queue_tail}'`);
	}
	this.queue_tail = null;
	this.queue_priority_count = 0;
	this.queue_priority_count_bg = 0;
	log_world("MC: SoftReset: Finished.");
	f.dot = 1;
	return f.dot;
});

// master.dm:551
rt.def("/datum/controller/master/proc/stat_entry", function* stat_entry(f: Frame) {
	if (!this.statclick) {
		this.statclick = (yield* new_(T("/obj/effect/statclick/debug"), null, "Initializing...", this));
	}
	stat("Byond:", `(FPS:${rt.world().fps}) (TickCount:${rt.worldTime(f) / rt.world().tick_lag}) (TickDrift:${round(GLOB.Master.tickdrift, 1)}(${round(GLOB.Master.tickdrift / (rt.worldTime(f) / rt.world().tick_lag) * 100, 0.1)}%))`);
	stat("Master Controller:", (yield* this.statclick.update(`(TickRate:${GLOB.Master.processing}) (Iteration:${GLOB.Master.iteration})`)));
	return f.dot;
}, true);

// master.dm:560
rt.def("/datum/controller/master/proc/StartLoadingMap", function* StartLoadingMap(f: Frame) {
	let S: Value = null, SS: Value = null;
	while (this.map_loading) {
		yield* stoplag();
	}
	for (S of each(this.subsystems)) {
		yield* (SS = S).StartLoadingMap();
	}
	this.map_loading = 1;
	return f.dot;
}, true);

// master.dm:568
rt.def("/datum/controller/master/proc/StopLoadingMap", function StopLoadingMap(f: Frame, bounds: Value) {
	let S: Value = null, SS: Value = null;
	this.map_loading = 0;
	for (S of each(this.subsystems)) {
		(SS = S).StopLoadingMap();
	}
	return f.dot;
});
