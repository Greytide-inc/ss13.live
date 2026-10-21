// From code/controllers/subsystem/garbage.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(21, "/datum/controller/subsystem/garbage", "/datum/controller/subsystem", {
	collection_timeout: 3000,
	delslasttick: 0,
	gcedlasttick: 0,
	totaldels: 0,
	totalgcs: 0,
	highest_del_time: 0,
	highest_del_tickusage: 0,
	queue: null,
	tobequeued: null,
	didntgc: null,
	sleptDestroy: null,
	noqdelhint: null,
	noforcerespect: null,
	name: "Garbage",
	priority: 15,
	wait: 5,
	flags: 69,
	runlevels: 15,
});

// /datum/controller/subsystem/garbage/proc/New  (code/controllers/subsystem/garbage.dm:1)  may sleep
rt.def("/datum/controller/subsystem/garbage/proc/New", function* New(f: Frame) {
	if (!isEqual(rt.gl("SSgarbage"), live(f.src))) {
		if (truthy((rt.istype(rt.gl("SSgarbage"), T("/datum/controller/subsystem/garbage")) ? 1 : 0))) {
			yield* g.srcCall(f, "Recover");
			yield* g.call(f, P("/proc/qdel"), null, [rt.gl("SSgarbage")]);
		}
		rt.setGl("SSgarbage", live(f.src));
	}
	yield* g.srcCall(f, "PreInit");
	return f.dot;
}, true);

// /datum/controller/subsystem/garbage/proc/<init>  (code/controllers/subsystem/garbage.dm:17)
rt.def("/datum/controller/subsystem/garbage/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "queue", rt.list());
	$0 = $0;
	rt.setSv(f, "tobequeued", rt.list());
	$0 = $0;
	rt.setSv(f, "didntgc", rt.list());
	$0 = $0;
	rt.setSv(f, "sleptDestroy", rt.list());
	$0 = $0;
	rt.setSv(f, "noqdelhint", rt.list());
	$0 = $0;
	rt.setSv(f, "noforcerespect", rt.list());
	return f.dot;
});

// /datum/controller/subsystem/garbage/proc/stat_entry  (code/controllers/subsystem/garbage.dm:37)  may sleep
rt.def("/datum/controller/subsystem/garbage/proc/stat_entry", function* stat_entry(f: Frame, msg: Value) {
	f.vars = () => [msg];
	msg = rt.modify(live(msg), fmt("Q:＀|D:＀|G:＀|", [rt.len(f, rt.sv(f, "queue")), rt.sv(f, "delslasttick"), rt.sv(f, "gcedlasttick")]), add);
	msg = rt.modify(live(msg), "GR:", add);
	if (!truthy(add(rt.sv(f, "delslasttick"), rt.sv(f, "gcedlasttick")))) {
		msg = rt.modify(live(msg), "n/a|", add);
	} else {
		msg = rt.modify(live(msg), fmt("＀%|", [(yield* g.call(f, P("/proc/round"), null, [multiply(divide(rt.sv(f, "gcedlasttick"), add(rt.sv(f, "delslasttick"), rt.sv(f, "gcedlasttick"))), 100), 0.009999999776482582]))]), add);
	}
	msg = rt.modify(live(msg), fmt("TD:＀|TG:＀|", [rt.sv(f, "totaldels"), rt.sv(f, "totalgcs")]), add);
	if (!truthy(add(rt.sv(f, "totaldels"), rt.sv(f, "totalgcs")))) {
		msg = rt.modify(live(msg), "n/a|", add);
	} else {
		msg = rt.modify(live(msg), fmt("TGR:＀%", [(yield* g.call(f, P("/proc/round"), null, [multiply(divide(rt.sv(f, "totalgcs"), add(rt.sv(f, "totaldels"), rt.sv(f, "totalgcs"))), 100), 0.009999999776482582]))]), add);
	}
	yield* g.callSuper(f, [live(msg)]);
	return f.dot;
}, true);

// /datum/controller/subsystem/garbage/proc/Shutdown  (code/controllers/subsystem/garbage.dm:53)
rt.def("/datum/controller/subsystem/garbage/proc/Shutdown", function Shutdown(f: Frame) {
	let dellog: Value = null, path: Value = null;
	let $e: any;
	f.vars = () => [dellog, path, $e];
	if (!(truthy(rt.len(f, rt.sv(f, "didntgc"))) || truthy(rt.len(f, rt.sv(f, "sleptDestroy"))))) return f.dot;
	dellog = rt.list();
	path = null;
	rt.forList(f, 0, rt.sv(f, "didntgc"));
	while (($e = rt.next(f, 0)) !== undefined) {
		path = $e;
		dellog = rt.modify(live(dellog), fmt("Path : ＀ \n", [live(path)]), add);
		dellog = rt.modify(live(dellog), fmt("Failures : ＀ \n", [rt.index(rt.sv(f, "didntgc"), live(path))]), add);
		if (truthy((rt.isIn(f, live(path), rt.sv(f, "sleptDestroy")) ? 1 : 0))) {
			dellog = rt.modify(live(dellog), fmt("Sleeps : ＀ \n", [rt.index(rt.sv(f, "sleptDestroy"), live(path))]), add);
			(rt.modSrcVar(f, "sleptDestroy", live(path), subtract));
		}
	}
	rt.endFor(f, 0);
	path = null;
	rt.forList(f, 0, rt.sv(f, "sleptDestroy"));
	while (($e = rt.next(f, 0)) !== undefined) {
		path = $e;
		dellog = rt.modify(live(dellog), fmt("Path : ＀ \n", [live(path)]), add);
		dellog = rt.modify(live(dellog), fmt("Sleeps : ＀ \n", [rt.index(rt.sv(f, "sleptDestroy"), live(path))]), add);
	}
	rt.endFor(f, 0);
	rt.call(f, P("/proc/text2file"), null, [rt.callName(f, live(dellog), "Join", []), fmt("＀/qdel.log", [rt.gl("log_directory")])]);
	return f.dot;
});

// /datum/controller/subsystem/garbage/proc/fire  (code/controllers/subsystem/garbage.dm:67)
rt.def("/datum/controller/subsystem/garbage/proc/fire", function fire(f: Frame) {
	rt.callSrc(f, "HandleToBeQueued", []);
	if (isEqual(rt.sv(f, "state"), 2)) {
		rt.callSrc(f, "HandleQueue", []);
	}
	if (!isEqual(rt.sv(f, "state"), 3)) return f.dot;
	rt.setSv(f, "state", 2);
	return f.dot;
});

// /datum/controller/subsystem/garbage/proc/HandleToBeQueued  (code/controllers/subsystem/garbage.dm:80)
rt.def("/datum/controller/subsystem/garbage/proc/HandleToBeQueued", function HandleToBeQueued(f: Frame) {
	let tobequeued: Value = null, starttime: Value = null, starttimeofday: Value = null, ref: Value = null;
	let $0: any;
	f.vars = () => [tobequeued, starttime, starttimeofday, ref, $0];
	tobequeued = rt.fv(f, "tobequeued", live(f.src));
	starttime = rt.worldTime(f);
	starttimeofday = rt.fv(f, "timeofday", rt.world());
	while ((truthy(rt.len(f, live(tobequeued))) && isEqual(live(starttime), rt.worldTime(f))) && isEqual(live(starttimeofday), rt.fv(f, "timeofday", rt.world()))) {
		if ((rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit")) || !isEqual(rt.fv(f, "state", live(f.src)), 2))) {
			$0 = rt.callSrc(f, "pause", []);
		} else {
			$0 = 0;
		}
		if (truthy($0)) {
			break;
		}
		rt.callSrc(f, "Queue", [(ref = rt.index(live(tobequeued), 1))]);
		rt.callName(f, live(tobequeued), "Cut", [1, 2]);
	}
	return f.dot;
});

// /datum/controller/subsystem/garbage/proc/HandleQueue  (code/controllers/subsystem/garbage.dm:90)
rt.def("/datum/controller/subsystem/garbage/proc/HandleQueue", function HandleQueue(f: Frame) {
	let time_to_kill: Value = null, queue: Value = null, starttime: Value = null, starttimeofday: Value = null, refID: Value = null, GCd_at_time: Value = null, A: Value = null, type: Value = null;
	let $0: any;
	f.vars = () => [time_to_kill, queue, starttime, starttimeofday, refID, GCd_at_time, A, type, $0];
	rt.setSv(f, "delslasttick", 0);
	rt.setSv(f, "gcedlasttick", 0);
	time_to_kill = subtract(rt.worldTime(f), rt.sv(f, "collection_timeout"));
	queue = rt.fv(f, "queue", live(f.src));
	starttime = rt.worldTime(f);
	starttimeofday = rt.fv(f, "timeofday", rt.world());
	while ((truthy(rt.len(f, live(queue))) && isEqual(live(starttime), rt.worldTime(f))) && isEqual(live(starttimeofday), rt.fv(f, "timeofday", rt.world()))) {
		if ((rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit")) || !isEqual(rt.fv(f, "state", live(f.src)), 2))) {
			$0 = rt.callSrc(f, "pause", []);
		} else {
			$0 = 0;
		}
		if (truthy($0)) {
			break;
		}
		if (!truthy((refID = rt.index(live(queue), 1)))) {
			rt.callName(f, live(queue), "Cut", [1, 2]);
			continue;
		}
		if (rt.gt((GCd_at_time = rt.index(live(queue), live(refID))), live(time_to_kill))) {
			break;
		}
		rt.callName(f, live(queue), "Cut", [1, 2]);
		A = null;
		if ((truthy((A = rt.locateIn(f, live(refID), rt.world()))) && isEqual(rt.fv(f, "gc_destroyed", live(A)), live(GCd_at_time)))) {
			type = rt.fv(f, "type", live(A));
			rt.incAt(rt.sv(f, "didntgc"), fmt("＀", [live(type)]), 1, true);
			rt.callSrc(f, "HardDelete", [live(A)]);
			rt.incSrcVar(f, "delslasttick", 1, false);
			rt.incSrcVar(f, "totaldels", 1, false);
		} else {
			rt.incSrcVar(f, "gcedlasttick", 1, false);
			rt.incSrcVar(f, "totalgcs", 1, false);
		}
	}
	return f.dot;
});

// /datum/controller/subsystem/garbage/proc/QueueForQueuing  (code/controllers/subsystem/garbage.dm:127)
rt.def("/datum/controller/subsystem/garbage/proc/QueueForQueuing", function QueueForQueuing(f: Frame, A: Value) {
	if (!(truthy((rt.istype(live(A), T("/datum")) ? 1 : 0)) && isEqual(rt.fv(f, "gc_destroyed", live(A)), -3))) return f.dot;
	rt.modSrcVar(f, "tobequeued", live(A), add);
	rt.setFv(f, "gc_destroyed", live(A), -1);
	return f.dot;
});

// /datum/controller/subsystem/garbage/proc/Queue  (code/controllers/subsystem/garbage.dm:132)
rt.def("/datum/controller/subsystem/garbage/proc/Queue", function Queue(f: Frame, A: Value) {
	let gctime: Value = null, refid: Value = null;
	f.vars = () => [gctime, refid];
	if ((live(A) === null || (rt.fv(f, "gc_destroyed", live(A)) !== null && rt.ge(rt.fv(f, "gc_destroyed", live(A)), 0)))) {
		return live(f.dot);
	}
	if (isEqual(rt.fv(f, "gc_destroyed", live(A)), -2)) {
		rt.callSrc(f, "HardDelete", [live(A)]);
		return live(f.dot);
	}
	gctime = rt.worldTime(f);
	refid = fmt("＃", [live(A)]);
	rt.setFv(f, "gc_destroyed", live(A), live(gctime));
	if (truthy(rt.index(rt.sv(f, "queue"), live(refid)))) {
		(rt.modSrcVar(f, "queue", live(refid), subtract));
	}
	rt.setAt(rt.sv(f, "queue"), live(refid), live(gctime));
	return f.dot;
});

// /datum/controller/subsystem/garbage/proc/HardDelete  (code/controllers/subsystem/garbage.dm:154)
rt.def("/datum/controller/subsystem/garbage/proc/HardDelete", function HardDelete(f: Frame, A: Value) {
	let time: Value = null, tick: Value = null, ticktime: Value = null, type: Value = null, refID: Value = null;
	f.vars = () => [time, tick, ticktime, type, refID];
	time = rt.fv(f, "timeofday", rt.world());
	tick = rt.tickUsage(f);
	ticktime = rt.worldTime(f);
	type = rt.fv(f, "type", live(A));
	refID = fmt("＃", [live(A)]);
	rt.del(f, live(A));
	if (rt.gt((tick = add(subtract(rt.tickUsage(f), live(tick)), multiply(divide(subtract(rt.worldTime(f), live(ticktime)), rt.fv(f, "tick_lag", rt.world())), 100))), rt.sv(f, "highest_del_tickusage"))) {
		rt.setSv(f, "highest_del_tickusage", live(tick));
	}
	if ((!truthy((time = subtract(rt.fv(f, "timeofday", rt.world()), live(time)))) && rt.gt(multiply(live(tick), rt.fv(f, "tick_lag", rt.world())), 1))) {
		time = divide(multiply(live(tick), rt.fv(f, "tick_lag", rt.world())), 100);
	}
	if (rt.gt(live(time), rt.sv(f, "highest_del_time"))) {
		rt.setSv(f, "highest_del_time", live(time));
	}
	if (!rt.gt(live(time), 10)) return f.dot;
	rt.call(f, P("/proc/log_game"), null, [fmt("Error: ＀(＀) took longer than 1 second to delete (took ＀ seconds to delete)", [live(type), live(refID), divide(live(time), 10)])]);
	rt.call(f, P("/proc/message_admins"), null, [fmt("Error: ＀(＀) took longer than 1 second to delete (took ＀ seconds to delete).", [live(type), live(refID), divide(live(time), 10)])]);
	rt.callSrc(f, "postpone", [divide(live(time), 5)]);
	return f.dot;
});

// /datum/controller/subsystem/garbage/proc/HardQueue  (code/controllers/subsystem/garbage.dm:172)
rt.def("/datum/controller/subsystem/garbage/proc/HardQueue", function HardQueue(f: Frame, A: Value) {
	if (!(truthy((rt.istype(live(A), T("/datum")) ? 1 : 0)) && isEqual(rt.fv(f, "gc_destroyed", live(A)), -3))) return f.dot;
	rt.modSrcVar(f, "tobequeued", live(A), add);
	rt.setFv(f, "gc_destroyed", live(A), -2);
	return f.dot;
});

// /datum/controller/subsystem/garbage/proc/Recover  (code/controllers/subsystem/garbage.dm:177)
rt.def("/datum/controller/subsystem/garbage/proc/Recover", function Recover(f: Frame) {
	if (truthy((rt.istype(rt.fv(f, "queue", rt.gl("SSgarbage")), T("/list")) ? 1 : 0))) {
		(rt.modSrcVar(f, "queue", rt.fv(f, "queue", rt.gl("SSgarbage")), rt.bitOr));
	}
	if (!truthy((rt.istype(rt.fv(f, "tobequeued", rt.gl("SSgarbage")), T("/list")) ? 1 : 0))) return f.dot;
	(rt.modSrcVar(f, "tobequeued", rt.fv(f, "tobequeued", rt.gl("SSgarbage")), rt.bitOr));
	return f.dot;
});

// /proc/qdel  (code/controllers/subsystem/garbage.dm:185)  may sleep
rt.def("/proc/qdel", function* qdel(f: Frame, D: Value, force: Value) {
	let start_time: Value = null, hint: Value = null;
	let $0: any;
	f.vars = () => [D, force, start_time, hint, $0];
	if (live(force) === null) {
		force = 0;
	}
	if (!truthy((rt.istype(live(D), T("/datum")) ? 1 : 0))) {
		yield* g.del(f, live(D));
		return live(f.dot);
	}
	if (rt.fv(f, "gc_destroyed", live(D)) === null) {
		rt.setFv(f, "gc_destroyed", live(D), -3);
		start_time = rt.worldTime(f);
		hint = (yield* g.callName(f, live(D), "Destroy", [live(force)]));
		if (!isEqual(rt.worldTime(f), live(start_time))) {
			rt.incAt(rt.fv(f, "sleptDestroy", rt.gl("SSgarbage")), fmt("＀", [rt.fv(f, "type", live(D))]), 1, true);
		}
		if (!truthy(live(D))) {
			return live(f.dot);
		}
		$0 = live(hint);
		if ($0 === 0) {
			yield* g.callName(f, rt.gl("SSgarbage"), "QueueForQueuing", [live(D)]);
		} else if ($0 === 2) {
			rt.setFv(f, "gc_destroyed", live(D), rt.worldTime(f));
			return live(f.dot);
		} else if ($0 === 1) {
			if (!truthy(live(force))) {
				rt.setFv(f, "gc_destroyed", live(D), null);
				return live(f.dot);
			}
			if (!truthy(rt.index(rt.fv(f, "noforcerespect", rt.gl("SSgarbage")), fmt("＀", [rt.fv(f, "type", live(D))])))) {
				rt.setAt(rt.fv(f, "noforcerespect", rt.gl("SSgarbage")), fmt("＀", [rt.fv(f, "type", live(D))]), fmt("＀", [rt.fv(f, "type", live(D))]));
			}
			yield* g.callName(f, rt.gl("SSgarbage"), "QueueForQueuing", [live(D)]);
		} else if ($0 === 3) {
			yield* g.callName(f, rt.gl("SSgarbage"), "HardQueue", [live(D)]);
		} else if ($0 === 4) {
			yield* g.callName(f, rt.gl("SSgarbage"), "HardDelete", [live(D)]);
		} else if ($0 === 5) {
			yield* g.callName(f, rt.gl("SSgarbage"), "QueueForQueuing", [live(D)]);
		} else {
			if (!truthy(rt.index(rt.fv(f, "noqdelhint", rt.gl("SSgarbage")), fmt("＀", [rt.fv(f, "type", live(D))])))) {
				rt.setAt(rt.fv(f, "noqdelhint", rt.gl("SSgarbage")), fmt("＀", [rt.fv(f, "type", live(D))]), fmt("＀", [rt.fv(f, "type", live(D))]));
			}
			yield* g.callName(f, rt.gl("SSgarbage"), "QueueForQueuing", [live(D)]);
		}
	} else {
		if (!isEqual(rt.fv(f, "gc_destroyed", live(D)), -3)) return f.dot;
		yield* g.call(f, P("/proc/CRASH"), null, [fmt("＀ destroy proc was called multiple times, likely due to a qdel loop in the Destroy logic", [rt.fv(f, "type", live(D))])]);
	}
	return f.dot;
}, true, { argTypes: [{ path: "/datum" }, {  }] });

// /datum/proc/Destroy  (code/controllers/subsystem/garbage.dm:241)  may sleep
rt.def("/datum/proc/Destroy", function* Destroy(f: Frame, force: Value) {
	let timers: Value = null, thing: Value = null, timer: Value = null;
	let $e: any;
	f.vars = () => [force, timers, thing, timer, $e];
	if (live(force) === null) {
		force = 0;
	}
	rt.setSv(f, "tag", null);
	timers = rt.sv(f, "active_timers");
	rt.setSv(f, "active_timers", null);
	thing = null;
	rt.forList(f, 0, live(timers));
	while (($e = rt.next(f, 0)) !== undefined) {
		thing = $e;
		if (truthy(rt.gv(f, "spent", (timer = live(thing))))) {
			continue;
		}
		yield* g.call(f, P("/proc/qdel"), null, [live(timer)]);
	}
	rt.endFor(f, 0);
	return 0;
}, true);
