// From code/controllers/subsystem/timer.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(48, "/datum/controller/subsystem/timer", "/datum/controller/subsystem", {
	processing: null,
	hashes: null,
	head_offset: 0,
	practical_offset: 0,
	bucket_resolution: 0,
	bucket_count: 0,
	bucket_list: null,
	timer_id_dict: null,
	clienttime_timers: null,
	last_invoke_tick: 0,
	name: "Timer",
	wait: 1,
	init_order: 1,
	flags: 17,
}, { global: { last_invoke_warning: 622, bucket_auto_reset: 623 } });

// /datum/controller/subsystem/timer/proc/New  (code/controllers/subsystem/timer.dm:4)  may sleep
rt.def("/datum/controller/subsystem/timer/proc/New", function* New(f: Frame) {
	if (!isEqual(rt.gl("SStimer"), live(f.src))) {
		if (truthy((rt.istype(rt.gl("SStimer"), T("/datum/controller/subsystem/timer")) ? 1 : 0))) {
			yield* g.srcCall(f, "Recover");
			yield* g.call(f, P("/proc/qdel"), null, [rt.gl("SStimer")]);
		}
		rt.setGl("SStimer", live(f.src));
	}
	yield* g.srcCall(f, "PreInit");
	return f.dot;
}, true);

// /datum/controller/subsystem/timer/proc/<init>  (code/controllers/subsystem/timer.dm:11)
rt.def("/datum/controller/subsystem/timer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "processing", rt.list());
	$0 = $0;
	rt.setSv(f, "hashes", rt.list());
	$0 = $0;
	rt.setSv(f, "bucket_list", rt.list());
	$0 = $0;
	rt.setSv(f, "timer_id_dict", rt.list());
	$0 = $0;
	rt.setSv(f, "clienttime_timers", rt.list());
	return f.dot;
});

// /datum/controller/subsystem/timer/proc/stat_entry  (code/controllers/subsystem/timer.dm:30)  may sleep
rt.def("/datum/controller/subsystem/timer/proc/stat_entry", function* stat_entry(f: Frame, msg: Value) {
	f.vars = () => [msg];
	yield* g.callSuper(f, [fmt("B:＀ P:＀ H:＀ C:＀", [rt.sv(f, "bucket_count"), rt.length(rt.sv(f, "processing")), rt.length(rt.sv(f, "hashes")), rt.length(rt.sv(f, "clienttime_timers"))])]);
	return f.dot;
}, true);

// /datum/controller/subsystem/timer/proc/fire  (code/controllers/subsystem/timer.dm:33)  may sleep
rt.def("/datum/controller/subsystem/timer/proc/fire", function* fire(f: Frame, resumed: Value) {
	let lit: Value = null, last_check: Value = null, msg: Value = null, I: Value = null, TE: Value = null, CB: Value = null, first: Value = null, J: Value = null, ctime_timer: Value = null, callBack: Value = null, bucket_list: Value = null, spent_timer: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $e: any;
	f.vars = () => [resumed, lit, last_check, msg, I, TE, CB, first, J, ctime_timer, callBack, bucket_list, spent_timer, $0, $1, $2, $3, $e];
	if (live(resumed) === null) {
		resumed = 0;
	}
	lit = rt.sv(f, "last_invoke_tick");
	last_check = subtract(rt.worldTime(f), 600);
	if (!truthy(rt.sv(f, "bucket_count"))) {
		rt.setSv(f, "last_invoke_tick", rt.worldTime(f));
	}
	if (((truthy(live(lit)) && rt.lt(live(lit), live(last_check))) && rt.lt(rt.gl("last_invoke_warning"), live(last_check)))) {
		rt.setGl("last_invoke_warning", rt.worldTime(f));
		$0 = 600;
		if (truthy(rt.gl("bucket_auto_reset"))) {
			$1 = ", resetting buckets";
		} else {
			$1 = "";
		}
		yield* g.call(f, P("/proc/message_admins"), null, [(msg = fmt("No regular timers processed in the last ＀ ticks＀!", [$0, $1]))]);
		yield* g.call(f, P("/proc/warning"), null, [fmt("＀ in ＀ at line ＀ src: ＀ usr: ＀.", [live(msg), "code/controllers/subsystem/timer.dm", 43, live(f.src), live(f.usr)])]);
		if (truthy(rt.gl("bucket_auto_reset"))) {
			rt.setSv(f, "bucket_resolution", 0);
		}
		yield* g.call(f, P("/proc/log_world"), null, [fmt("Active timers at tick ＀:", [rt.worldTime(f)])]);
		I = null;
		rt.forList(f, 0, rt.sv(f, "processing"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			msg = fmt("Timer: ＀: TTR: ＀, Flags: ＀, ", [rt.gv(f, "id", (TE = live(I))), rt.fv(f, "timeToRun", live(TE)), rt.fv(f, "flags", live(TE))]);
			if (truthy(rt.fv(f, "spent", live(TE)))) {
				msg = rt.modify(live(msg), "SPENT", add);
			} else {
				CB = rt.fv(f, "callBack", live(TE));
				msg = rt.modify(live(msg), "callBack: ", add);
				if (isEqual(rt.fv(f, "object", live(CB)), "some_magic_bullshit")) {
					msg = rt.modify(live(msg), fmt("GP: ＀", [rt.fv(f, "delegate", live(CB))]), add);
				} else {
					if (!(!truthy(rt.fv(f, "object", live(CB))) || truthy(rt.gv(f, "gc_destroyed", rt.fv(f, "object", live(CB)))))) {
						$0 = rt.fv(f, "object", live(CB));
					} else {
						$0 = "SRC DELETED";
					}
					msg = rt.modify(live(msg), fmt("＀: ＀(", [$0, rt.fv(f, "delegate", live(CB))]), add);
					first = 1;
					J = null;
					rt.forList(f, 1, rt.fv(f, "arguments", live(CB)));
					while (($e = rt.next(f, 1)) !== undefined) {
						J = $e;
						if (truthy(live(first))) {
							$0 = "";
						} else {
							$0 = ", ";
						}
						msg = rt.modify(live(msg), fmt("＀＀", [$0, live(J)]), add);
						first = 0;
					}
					rt.endFor(f, 1);
					msg = rt.modify(live(msg), ")", add);
				}
			}
			yield* g.call(f, P("/proc/log_world"), null, [live(msg)]);
		}
		rt.endFor(f, 0);
	}
	while (truthy(rt.length(rt.sv(f, "clienttime_timers")))) {
		$0 = rt.gv(f, "timeToRun", (ctime_timer = rt.index(rt.sv(f, "clienttime_timers"), rt.len(f, rt.sv(f, "clienttime_timers")))));
		$1 = rt.fv(f, "timeofday", rt.world());
		$2 = 864000;
		if (!isEqual(rt.gl("rollovercheck_last_timeofday"), rt.fv(f, "timeofday", rt.world()))) {
			$3 = (yield* g.call(f, P("/proc/update_midnight_rollover"), null, []));
		} else {
			$3 = rt.gl("midnight_rollovers");
		}
		if (rt.le($0, add($1, multiply($2, $3)))) {
			rt.incField(f, rt.sv(f, "clienttime_timers"), "len", -1, false);
			callBack = rt.fv(f, "callBack", live(ctime_timer));
			rt.setFv(f, "spent", live(ctime_timer), 1);
			yield* g.callName(f, live(callBack), "InvokeAsync", []);
			yield* g.call(f, P("/proc/qdel"), null, [live(ctime_timer)]);
		} else {
			break;
		}
		if ((rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit")) || !isEqual(rt.fv(f, "state", live(f.src)), 2))) {
			$0 = (yield* g.srcCall(f, "pause"));
		} else {
			$0 = 0;
		}
		if (truthy($0)) {
			return live(f.dot);
		}
	}
	if ((rt.gt(rt.sv(f, "practical_offset"), multiply(multiply(rt.fv(f, "fps", rt.world()), 1), 60)) || ((!truthy(live(resumed)) && !isEqual(rt.length(rt.fv(f, "bucket_list", live(f.src))), multiply(multiply(rt.fv(f, "fps", rt.world()), 1), 60))) || !isEqual(rt.fv(f, "tick_lag", rt.world()), rt.sv(f, "bucket_resolution"))))) {
		yield* g.srcCall(f, "shift_buckets");
		resumed = 0;
	}
	if (!truthy(live(resumed))) {
		rt.setGl("timer", null);
		rt.setGl("head", null);
	}
	bucket_list = rt.fv(f, "bucket_list", live(f.src));
	while (true) {
		$0 = ((rt.le(rt.sv(f, "practical_offset"), multiply(multiply(rt.fv(f, "fps", rt.world()), 1), 60)) ? 1 : 0) && (rt.le(add(rt.sv(f, "head_offset"), multiply(rt.sv(f, "practical_offset"), rt.fv(f, "tick_lag", rt.world()))), rt.worldTime(f)) ? 1 : 0));
		if (truthy($0)) {
			if ((rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit")) || !isEqual(rt.fv(f, "state", live(f.src)), 2))) {
				$0 = (yield* g.srcCall(f, "pause"));
			} else {
				$0 = 0;
			}
			$0 = (!truthy($0) ? 1 : 0);
		}
		if (!truthy($0)) break;
		if (((!truthy(rt.gl("timer")) || !truthy(rt.gl("head"))) || isEqual(rt.gl("timer"), rt.gl("head")))) {
			rt.setGl("head", rt.index(live(bucket_list), rt.sv(f, "practical_offset")));
			if (!truthy(rt.gl("head"))) {
				rt.incSrcVar(f, "practical_offset", 1, true);
				if ((rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit")) || !isEqual(rt.fv(f, "state", live(f.src)), 2))) {
					$0 = (yield* g.srcCall(f, "pause"));
				} else {
					$0 = 0;
				}
				if (truthy($0)) {
					break;
				}
				continue;
			}
			rt.setGl("timer", rt.gl("head"));
		}
		while (true) {
			if (!truthy((callBack = rt.fv(f, "callBack", rt.gl("timer"))))) {
				yield* g.call(f, P("/proc/qdel"), null, [rt.gl("timer")]);
				rt.setSv(f, "bucket_resolution", null);
				yield* g.call(f, P("/proc/CRASH"), null, [fmt("Invalid timer: timer.timeToRun=＀||QDELETED(timer)=＀||world.time=＀||head_offset=＀||practical_offset=＀||timer.spent=＀", [rt.fv(f, "timeToRun", rt.gl("timer")), ((!truthy(rt.gl("timer")) ? 1 : 0) || rt.fv(f, "gc_destroyed", rt.gl("timer"))), rt.worldTime(f), rt.sv(f, "head_offset"), rt.sv(f, "practical_offset"), rt.fv(f, "spent", rt.gl("timer"))])]);
			}
			if (!truthy(rt.fv(f, "spent", rt.gl("timer")))) {
				rt.modGl("spent", rt.gl("timer"), add);
				rt.setFv(f, "spent", rt.gl("timer"), 1);
				yield* g.callName(f, live(callBack), "InvokeAsync", []);
				rt.setSv(f, "last_invoke_tick", rt.worldTime(f));
			}
			rt.setGl("timer", rt.fv(f, "next", rt.gl("timer")));
			if ((rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit")) || !isEqual(rt.fv(f, "state", live(f.src)), 2))) {
				$0 = (yield* g.srcCall(f, "pause"));
			} else {
				$0 = 0;
			}
			if (truthy($0)) {
				return live(f.dot);
			}
			if (!(truthy(rt.gl("timer")) && !isEqual(rt.gl("timer"), rt.gl("head")))) break;
		}
		rt.setGl("timer", null);
		rt.setAt(live(bucket_list), rt.incSrcVar(f, "practical_offset", 1, true), null);
		if ((rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit")) || !isEqual(rt.fv(f, "state", live(f.src)), 2))) {
			$0 = (yield* g.srcCall(f, "pause"));
		} else {
			$0 = 0;
		}
		if (truthy($0)) {
			return live(f.dot);
		}
	}
	(rt.modSrcVar(f, "bucket_count", rt.length(rt.gl("spent")), subtract));
	spent_timer = null;
	rt.forList(f, 0, rt.gl("spent"));
	while (($e = rt.next(f, 0)) !== undefined) {
		spent_timer = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(spent_timer)]);
	}
	rt.endFor(f, 0);
	rt.setFv(f, "len", rt.gl("spent"), 0);
	return f.dot;
}, true);

// /datum/controller/subsystem/timer/proc/shift_buckets  (code/controllers/subsystem/timer.dm:137)  may sleep
rt.def("/datum/controller/subsystem/timer/proc/shift_buckets", function* shift_buckets(f: Frame) {
	let bucket_list: Value = null, alltimers: Value = null, bucket_head: Value = null, bucket_node: Value = null, head: Value = null, timers_to_remove: Value = null, thing: Value = null, timer: Value = null, bucket_pos: Value = null, bucket_head_7: Value = null;
	let $e: any;
	f.vars = () => [bucket_list, alltimers, bucket_head, bucket_node, head, timers_to_remove, thing, timer, bucket_pos, bucket_head_7, $e];
	bucket_list = rt.fv(f, "bucket_list", live(f.src));
	alltimers = rt.list();
	bucket_head = null;
	rt.forList(f, 0, live(bucket_list));
	while (($e = rt.next(f, 0)) !== undefined) {
		bucket_head = $e;
		if (!truthy(live(bucket_head))) {
			continue;
		}
		bucket_node = live(bucket_head);
		while (true) {
			alltimers = rt.modify(live(alltimers), live(bucket_node), add);
			if (!(truthy((bucket_node = rt.fv(f, "next", live(bucket_node)))) && !isEqual(live(bucket_node), live(bucket_head)))) break;
		}
	}
	rt.endFor(f, 0);
	rt.setFv(f, "len", live(bucket_list), 0);
	rt.setFv(f, "len", live(bucket_list), multiply(multiply(rt.fv(f, "fps", rt.world()), 1), 60));
	rt.setSv(f, "practical_offset", 1);
	rt.setSv(f, "bucket_count", 0);
	rt.setSv(f, "head_offset", rt.worldTime(f));
	rt.setSv(f, "bucket_resolution", rt.fv(f, "tick_lag", rt.world()));
	if (!truthy(rt.length((alltimers = rt.modify(live(alltimers), rt.sv(f, "processing"), add))))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/sortTim"), null, [live(alltimers), P("/proc/cmp_timer")]);
	if (rt.lt(rt.gv(f, "timeToRun", (head = rt.index(live(alltimers), 1))), rt.sv(f, "head_offset"))) {
		rt.setSv(f, "head_offset", rt.fv(f, "timeToRun", live(head)));
	}
	timers_to_remove = rt.list();
	thing = null;
	rt.forList(f, 0, live(alltimers));
	while (($e = rt.next(f, 0)) !== undefined) {
		thing = $e;
		if (!truthy((timer = live(thing)))) {
			timers_to_remove = rt.modify(live(timers_to_remove), live(timer), add);
			continue;
		}
		if (rt.gt((bucket_pos = add((yield* g.call(f, P("/proc/round"), null, [divide(subtract(rt.fv(f, "timeToRun", live(timer)), rt.fv(f, "head_offset", rt.gl("SStimer"))), rt.fv(f, "tick_lag", rt.world()))])), 1)), multiply(multiply(rt.fv(f, "fps", rt.world()), 1), 60))) {
			break;
		}
		timers_to_remove = rt.modify(live(timers_to_remove), live(timer), add);
		if ((!truthy(rt.fv(f, "callBack", live(timer))) || truthy(rt.fv(f, "spent", live(timer))))) {
			continue;
		}
		rt.incSrcVar(f, "bucket_count", 1, true);
		if (!truthy((bucket_head_7 = rt.index(live(bucket_list), live(bucket_pos))))) {
			rt.setAt(live(bucket_list), live(bucket_pos), live(timer));
			rt.setFv(f, "next", live(timer), null);
			rt.setFv(f, "prev", live(timer), null);
			continue;
		}
		if (!truthy(rt.fv(f, "prev", live(bucket_head_7)))) {
			rt.setFv(f, "prev", live(bucket_head_7), live(bucket_head_7));
		}
		rt.setFv(f, "next", live(timer), live(bucket_head_7));
		rt.setFv(f, "prev", live(timer), rt.fv(f, "prev", live(bucket_head_7)));
		rt.setFv(f, "prev", rt.fv(f, "next", live(timer)), live(timer));
		rt.setFv(f, "next", rt.fv(f, "prev", live(timer)), live(timer));
	}
	rt.endFor(f, 0);
	rt.setSv(f, "processing", subtract(live(alltimers), live(timers_to_remove)));
	return f.dot;
}, true);

// /datum/controller/subsystem/timer/proc/Recover  (code/controllers/subsystem/timer.dm:201)
rt.def("/datum/controller/subsystem/timer/proc/Recover", function Recover(f: Frame) {
	(rt.modSrcVar(f, "processing", rt.fv(f, "processing", rt.gl("SStimer")), rt.bitOr));
	(rt.modSrcVar(f, "hashes", rt.fv(f, "hashes", rt.gl("SStimer")), rt.bitOr));
	(rt.modSrcVar(f, "timer_id_dict", rt.fv(f, "timer_id_dict", rt.gl("SStimer")), rt.bitOr));
	(rt.modSrcVar(f, "bucket_list", rt.fv(f, "bucket_list", rt.gl("SStimer")), rt.bitOr));
	return f.dot;
});

rt.type(361, "/datum/timedevent", "/datum", {
	id: null,
	callBack: null,
	timeToRun: null,
	hash: null,
	flags: null,
	spent: 0,
	next: null,
	prev: null,
}, { global: { nextid: 632 } });

// /datum/timedevent/proc/New  (code/controllers/subsystem/timer.dm:222)
rt.def("/datum/timedevent/proc/New", function New(f: Frame, callBack: Value, timeToRun: Value, flags: Value, hash: Value) {
	let ctts: Value = null, cttl: Value = null, Last: Value = null, I: Value = null, E: Value = null, bucket_list: Value = null, bucket_pos: Value = null, bucket_head: Value = null;
	let $e: any;
	f.vars = () => [ctts, cttl, Last, I, E, bucket_list, bucket_pos, bucket_head, $e];
	rt.setSv(f, "id", rt.incGl("nextid", 1, true));
	rt.setFv(f, "callBack", live(f.src), live(callBack));
	rt.setFv(f, "timeToRun", live(f.src), live(timeToRun));
	rt.setFv(f, "flags", live(f.src), live(flags));
	rt.setFv(f, "hash", live(f.src), live(hash));
	if (truthy(rt.bitAnd(live(flags), 1))) {
		rt.setAt(rt.fv(f, "hashes", rt.gl("SStimer")), live(hash), live(f.src));
	}
	if (truthy(rt.bitAnd(live(flags), 8))) {
		rt.setAt(rt.fv(f, "timer_id_dict", rt.gl("SStimer")), fmt("timerid＀", [rt.sv(f, "id")]), live(f.src));
	}
	if (!isEqual(rt.fv(f, "object", live(callBack)), "some_magic_bullshit")) {
		if (!truthy(rt.gv(f, "active_timers", rt.fv(f, "object", live(callBack))))) {
			rt.setFv(f, "active_timers", rt.fv(f, "object", live(callBack)), rt.list());
		}
		rt.modField(f, rt.fv(f, "object", live(callBack)), "active_timers", live(f.src), add);
	}
	if (truthy(rt.bitAnd(live(flags), 4))) {
		ctts = rt.fv(f, "clienttime_timers", rt.gl("SStimer"));
		if (truthy((cttl = rt.length(live(ctts))))) {
			if (rt.ge(rt.gv(f, "timeToRun", (Last = rt.index(live(ctts), live(cttl)))), live(timeToRun))) {
				ctts = rt.modify(live(ctts), live(f.src), add);
			} else {
				if (rt.gt(live(cttl), 1)) {
					I = null;
					rt.forRange(f, 0, live(cttl), 1, 1);
					while (($e = rt.next(f, 0)) !== undefined) {
						I = $e;
						if (rt.le(rt.gv(f, "timeToRun", (E = rt.index(live(ctts), live(I)))), live(timeToRun))) {
							rt.callName(f, live(ctts), "Insert", [live(f.src), live(I)]);
							break;
						}
					}
					rt.endFor(f, 0);
				}
			}
		} else {
			ctts = rt.modify(live(ctts), live(f.src), add);
		}
		return live(f.dot);
	}
	bucket_list = rt.fv(f, "bucket_list", rt.gl("SStimer"));
	if (rt.gt((bucket_pos = add(rt.call(f, P("/proc/round"), null, [divide(subtract(rt.fv(f, "timeToRun", live(f.src)), rt.fv(f, "head_offset", rt.gl("SStimer"))), rt.fv(f, "tick_lag", rt.world()))]), 1)), rt.length(live(bucket_list)))) {
		rt.modField(f, rt.gl("SStimer"), "processing", live(f.src), add);
		return live(f.dot);
	}
	bucket_head = rt.index(live(bucket_list), live(bucket_pos));
	rt.incField(f, rt.gl("SStimer"), "bucket_count", 1, true);
	if (!truthy(live(bucket_head))) {
		rt.setAt(live(bucket_list), live(bucket_pos), live(f.src));
		if (rt.lt(live(bucket_pos), rt.fv(f, "practical_offset", rt.gl("SStimer")))) {
			rt.setFv(f, "practical_offset", rt.gl("SStimer"), live(bucket_pos));
		}
		return live(f.dot);
	}
	if (!truthy(rt.fv(f, "prev", live(bucket_head)))) {
		rt.setFv(f, "prev", live(bucket_head), live(bucket_head));
	}
	rt.setSv(f, "next", live(bucket_head));
	rt.setSv(f, "prev", rt.fv(f, "prev", live(bucket_head)));
	rt.setFv(f, "prev", rt.sv(f, "next"), live(f.src));
	rt.setFv(f, "next", rt.sv(f, "prev"), live(f.src));
	return f.dot;
});

// /datum/timedevent/proc/Destroy  (code/controllers/subsystem/timer.dm:280)  may sleep
rt.def("/datum/timedevent/proc/Destroy", function* Destroy(f: Frame) {
	let bucketpos: Value = null, buckethead: Value = null, bucket_list: Value = null;
	f.vars = () => [bucketpos, buckethead, bucket_list];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.bitAnd(rt.sv(f, "flags"), 1))) {
		(rt.modField(f, rt.gl("SStimer"), "hashes", rt.sv(f, "hash"), subtract));
	}
	if ((((truthy(rt.sv(f, "callBack")) && truthy(rt.fv(f, "object", rt.sv(f, "callBack")))) && !isEqual(rt.fv(f, "object", rt.sv(f, "callBack")), "some_magic_bullshit")) && truthy(rt.gv(f, "active_timers", rt.fv(f, "object", rt.sv(f, "callBack")))))) {
		(rt.modField(f, rt.fv(f, "object", rt.sv(f, "callBack")), "active_timers", live(f.src), subtract));
		if ((truthy(rt.gv(f, "active_timers", rt.fv(f, "object", rt.sv(f, "callBack")))) && !truthy(rt.getLen(f, rt.gv(f, "active_timers", rt.fv(f, "object", rt.sv(f, "callBack"))))))) {
			rt.setFv(f, "active_timers", rt.fv(f, "object", rt.sv(f, "callBack")), null);
		}
	}
	rt.setSv(f, "callBack", null);
	if (truthy(rt.bitAnd(rt.sv(f, "flags"), 8))) {
		(rt.modField(f, rt.gl("SStimer"), "timer_id_dict", fmt("timerid＀", [rt.sv(f, "id")]), subtract));
	}
	if (truthy(rt.bitAnd(rt.sv(f, "flags"), 4))) {
		(rt.modField(f, rt.gl("SStimer"), "clienttime_timers", live(f.src), subtract));
		return 2;
	}
	if (!truthy(rt.sv(f, "spent"))) {
		if ((isEqual(rt.sv(f, "prev"), rt.sv(f, "next")) && truthy(rt.sv(f, "next")))) {
			rt.setFv(f, "prev", rt.sv(f, "next"), null);
			rt.setFv(f, "next", rt.sv(f, "prev"), null);
		} else {
			if (truthy(rt.sv(f, "prev"))) {
				rt.setFv(f, "next", rt.sv(f, "prev"), rt.sv(f, "next"));
			}
			if (truthy(rt.sv(f, "next"))) {
				rt.setFv(f, "prev", rt.sv(f, "next"), rt.sv(f, "prev"));
			}
		}
		bucketpos = add((yield* g.call(f, P("/proc/round"), null, [divide(subtract(rt.fv(f, "timeToRun", live(f.src)), rt.fv(f, "head_offset", rt.gl("SStimer"))), rt.fv(f, "tick_lag", rt.world()))])), 1);
		buckethead = null;
		bucket_list = rt.fv(f, "bucket_list", rt.gl("SStimer"));
		if ((rt.gt(live(bucketpos), 0) && rt.le(live(bucketpos), rt.length(live(bucket_list))))) {
			buckethead = rt.index(live(bucket_list), live(bucketpos));
			rt.incField(f, rt.gl("SStimer"), "bucket_count", -1, true);
		} else {
			(rt.modField(f, rt.gl("SStimer"), "processing", live(f.src), subtract));
		}
		if (isEqual(live(buckethead), live(f.src))) {
			rt.setAt(live(bucket_list), live(bucketpos), rt.sv(f, "next"));
		}
	} else {
		if ((truthy(rt.sv(f, "prev")) && isEqual(rt.fv(f, "next", rt.sv(f, "prev")), live(f.src)))) {
			rt.setFv(f, "next", rt.sv(f, "prev"), rt.sv(f, "next"));
		}
		if ((truthy(rt.sv(f, "next")) && isEqual(rt.fv(f, "prev", rt.sv(f, "next")), live(f.src)))) {
			rt.setFv(f, "prev", rt.sv(f, "next"), rt.sv(f, "prev"));
		}
	}
	rt.setSv(f, "next", null);
	rt.setSv(f, "prev", null);
	return 2;
}, true);

// /proc/addtimer  (code/controllers/subsystem/timer.dm:330)  may sleep
rt.def("/proc/addtimer", function* addtimer(f: Frame, callback: Value, wait: Value, flags: Value) {
	let hash: Value = null, hashlist: Value = null, hash_timer: Value = null, timeToRun: Value = null, timer: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [callback, wait, flags, hash, hashlist, hash_timer, timeToRun, timer, $0, $1, $2];
	if (!truthy(live(callback))) {
		return live(f.dot);
	}
	wait = (yield* g.call(f, P("/proc/max"), null, [live(wait), 0]));
	hash = null;
	if (truthy(rt.bitAnd(live(flags), 1))) {
		hashlist = null;
		if (truthy(rt.bitAnd(live(flags), 16))) {
			hashlist = rt.list(rt.fv(f, "object", live(callback)), fmt("(＃)", [rt.fv(f, "object", live(callback))]), rt.fv(f, "delegate", live(callback)), rt.bitAnd(live(flags), 4));
		} else {
			hashlist = rt.list(rt.fv(f, "object", live(callback)), fmt("(＃)", [rt.fv(f, "object", live(callback))]), rt.fv(f, "delegate", live(callback)), live(wait), rt.bitAnd(live(flags), 4));
		}
		hash = (yield* g.callName(f, (hashlist = rt.modify(live(hashlist), rt.fv(f, "arguments", live(callback)), add)), "Join", ["|||||||"]));
		if (truthy((hash_timer = rt.index(rt.fv(f, "hashes", rt.gl("SStimer")), live(hash))))) {
			if (truthy(rt.fv(f, "spent", live(hash_timer)))) {
				rt.setFv(f, "hash", live(hash_timer), null);
				(rt.modField(f, rt.gl("SStimer"), "hashes", live(hash), subtract));
			} else {
				if (truthy(rt.bitAnd(live(flags), 2))) {
					yield* g.call(f, P("/proc/qdel"), null, [live(hash_timer)]);
				} else {
					if (truthy(rt.bitAnd(rt.fv(f, "flags", live(hash_timer)), 8))) {
						f.dot = rt.fv(f, "id", live(hash_timer));
					}
					return live(f.dot);
				}
			}
		}
	}
	timeToRun = add(rt.worldTime(f), live(wait));
	if (truthy(rt.bitAnd(live(flags), 4))) {
		$0 = rt.fv(f, "timeofday", rt.world());
		$1 = 864000;
		if (!isEqual(rt.gl("rollovercheck_last_timeofday"), rt.fv(f, "timeofday", rt.world()))) {
			$2 = (yield* g.call(f, P("/proc/update_midnight_rollover"), null, []));
		} else {
			$2 = rt.gl("midnight_rollovers");
		}
		timeToRun = add(add($0, multiply($1, $2)), live(wait));
	}
	timer = (yield* g.new_(f, T("/datum/timedevent"), [live(callback), live(timeToRun), live(flags), live(hash)]));
	if (truthy(rt.bitAnd(live(flags), 8))) {
		return rt.fv(f, "id", live(timer));
	}
	return -1;
}, true, { argTypes: [{ path: "/datum/callback" }, {  }, {  }] });

// /proc/deltimer  (code/controllers/subsystem/timer.dm:371)  may sleep
rt.def("/proc/deltimer", function* deltimer(f: Frame, id: Value) {
	let timer: Value = null;
	f.vars = () => [id, timer];
	if (!truthy(live(id))) {
		return 0;
	}
	if (isEqual(live(id), -1)) {
		yield* g.call(f, P("/proc/CRASH"), null, ["Tried to delete a null timerid. Use TIMER_STOPPABLE flag"]);
	}
	if (!truthy((yield* g.call(f, P("/proc/istext"), null, [live(id)])))) {
		if (truthy((rt.istype(live(id), T("/datum/timedevent")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(id)]);
			return 1;
		}
	}
	if ((truthy((timer = rt.index(rt.fv(f, "timer_id_dict", rt.gl("SStimer")), fmt("timerid＀", [live(id)])))) && !truthy(rt.fv(f, "spent", live(timer))))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(timer)]);
		return 1;
	}
	return 0;
}, true);
