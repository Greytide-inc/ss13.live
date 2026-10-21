// From code/controllers/failsafe.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9, "/datum/controller/failsafe", "/datum/controller", {
	processing_interval: 20,
	defcon: 5,
	lasttick: 0,
	master_iteration: 0,
	running: 1,
	name: "Failsafe",
});

// /datum/controller/failsafe/proc/New  (code/controllers/failsafe.dm:27)  may sleep
rt.def("/datum/controller/failsafe/proc/New", function* New(f: Frame) {
	if (!isEqual(rt.gl("Failsafe"), live(f.src))) {
		if (truthy((rt.istype(rt.gl("Failsafe"), T("/datum/controller/failsafe")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/qdel"), null, [rt.gl("Failsafe")]);
		}
	}
	rt.setGl("Failsafe", live(f.src));
	yield* g.srcCall(f, "Initialize");
	return f.dot;
}, true);

// /datum/controller/failsafe/proc/Initialize  (code/controllers/failsafe.dm:35)  may sleep
// Mid-round snapshots (tools/make-snapshot.mjs): Loop's code runs in this frame (failsafeLoop here, failsafeLoopWhile after Loop) instead of as a call,
// so the sleeping failsafe is one frame whose sleeps are tail data ("Failsafe.Initialize loop"). Loop is never called elsewhere.
rt.def("/datum/controller/failsafe/proc/Initialize", function* Initialize(f: Frame) {
	return yield* failsafeLoop(f);
}, true, { waitfor: false });
function* failsafeLoop(f: Frame) {
	yield* failsafeLoopWhile(f);
	if (!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}
rt.tail("Failsafe.Initialize loop", failsafeLoop);

// /datum/controller/failsafe/proc/Destroy  (code/controllers/failsafe.dm:41)  may sleep
rt.def("/datum/controller/failsafe/proc/Destroy", function* Destroy(f: Frame) {
	rt.setSv(f, "running", 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	return 4;
}, true);

// /datum/controller/failsafe/proc/Loop  (code/controllers/failsafe.dm:47)  may sleep
rt.def("/datum/controller/failsafe/proc/Loop", function* Loop(f: Frame) {
	let rtn: Value = null;
	let $0: any;
	f.vars = () => [rtn, $0];
	while (truthy(rt.sv(f, "running"))) {
		rt.setSv(f, "lasttick", rt.worldTime(f));
		if (!truthy(rt.gl("Master"))) {
			yield* g.new_(f, T("/datum/controller/master"), []);
		}
		if (rt.gt(rt.sv(f, "processing_interval"), 0)) {
			if ((truthy(rt.fv(f, "processing", rt.gl("Master"))) && truthy(rt.fv(f, "iteration", rt.gl("Master"))))) {
				if (isEqual(rt.fv(f, "iteration", rt.gl("Master")), rt.sv(f, "master_iteration"))) {
					$0 = rt.sv(f, "defcon");
					if ($0 === 4 || $0 === 5) {
						rt.incSrcVar(f, "defcon", -1, false);
					} else if ($0 === 3) {
						yield* g.call(f, P("/proc/to_chat"), null, [rt.gl("admins"), fmt("<span class='adminnotice'>Notice: DEFCON ＀. The Master Controller has not fired in the last ＀ ticks.", [(yield* g.srcCall(f, "defcon_pretty")), multiply(subtract(5, rt.sv(f, "defcon")), rt.sv(f, "processing_interval"))])]);
						rt.incSrcVar(f, "defcon", -1, false);
					} else if ($0 === 2) {
						yield* g.call(f, P("/proc/to_chat"), null, [rt.gl("admins"), fmt("<span class='boldannounce'>Warning: DEFCON ＀. The Master Controller has not fired in the last ＀ ticks. Automatic restart in ＀ ticks.</span>", [(yield* g.srcCall(f, "defcon_pretty")), multiply(subtract(5, rt.sv(f, "defcon")), rt.sv(f, "processing_interval")), rt.sv(f, "processing_interval")])]);
						rt.incSrcVar(f, "defcon", -1, false);
					} else if ($0 === 1) {
						yield* g.call(f, P("/proc/to_chat"), null, [rt.gl("admins"), fmt("<span class='boldannounce'>Warning: DEFCON ＀. The Master Controller has still not fired within the last ＀ ticks. Killing and restarting...</span>", [(yield* g.srcCall(f, "defcon_pretty")), multiply(subtract(5, rt.sv(f, "defcon")), rt.sv(f, "processing_interval"))])]);
						rt.incSrcVar(f, "defcon", -1, false);
						if (rt.gt((rtn = (yield* g.call(f, P("/proc/Recreate_MC"), null, []))), 0)) {
							rt.setSv(f, "defcon", 4);
							rt.setSv(f, "master_iteration", 0);
							yield* g.call(f, P("/proc/to_chat"), null, [rt.gl("admins"), "<span class='adminnotice'>MC restarted successfully</span>"]);
						} else {
							if (rt.lt(live(rtn), 0)) {
								yield* g.call(f, P("/proc/log_game"), null, ["FailSafe: Could not restart MC, runtime encountered. Entering defcon 0"]);
								yield* g.call(f, P("/proc/to_chat"), null, [rt.gl("admins"), fmt("<span class='boldannounce'>ERROR: DEFCON ＀. Could not restart MC, runtime encountered. I will silently keep retrying.</span>", [(yield* g.srcCall(f, "defcon_pretty"))])]);
							}
						}
					} else if ($0 === 0) {
						if (rt.gt((rtn = (yield* g.call(f, P("/proc/Recreate_MC"), null, []))), 0)) {
							rt.setSv(f, "defcon", 4);
							rt.setSv(f, "master_iteration", 0);
							yield* g.call(f, P("/proc/to_chat"), null, [rt.gl("admins"), "<span class='adminnotice'>MC restarted successfully</span>"]);
						}
					}
				} else {
					rt.setSv(f, "defcon", (yield* g.call(f, P("/proc/min"), null, [add(rt.sv(f, "defcon"), 1), 5])));
					rt.setSv(f, "master_iteration", rt.fv(f, "iteration", rt.gl("Master")));
				}
			}
			if (rt.le(rt.sv(f, "defcon"), 1)) {
				yield* g.call(f, P("/proc/sleep"), null, [multiply(rt.sv(f, "processing_interval"), 2)]);
			} else {
				yield* g.call(f, P("/proc/sleep"), null, [rt.sv(f, "processing_interval")]);
			}
		} else {
			rt.setSv(f, "defcon", 5);
			yield* g.call(f, P("/proc/sleep"), null, [rt.initial(f, live(f.src), "processing_interval")]);
		}
	}
	return f.dot;
}, true);

// Loop's code for Initialize (failsafe.dm:48-81); each sleep ends an iteration.
function* failsafeLoopWhile(f: Frame) {
	let rtn: Value = null;
	let $0: any;
	f.vars = () => [rtn, $0];
	while (truthy(rt.sv(f, "running"))) {
		rt.setSv(f, "lasttick", rt.worldTime(f));
		if (!truthy(rt.gl("Master"))) {
			yield* g.new_(f, T("/datum/controller/master"), []);
		}
		if (rt.gt(rt.sv(f, "processing_interval"), 0)) {
			if ((truthy(rt.fv(f, "processing", rt.gl("Master"))) && truthy(rt.fv(f, "iteration", rt.gl("Master"))))) {
				if (isEqual(rt.fv(f, "iteration", rt.gl("Master")), rt.sv(f, "master_iteration"))) {
					$0 = rt.sv(f, "defcon");
					if ($0 === 4 || $0 === 5) {
						rt.incSrcVar(f, "defcon", -1, false);
					} else if ($0 === 3) {
						yield* g.call(f, P("/proc/to_chat"), null, [rt.gl("admins"), fmt("<span class='adminnotice'>Notice: DEFCON ＀. The Master Controller has not fired in the last ＀ ticks.", [(yield* g.srcCall(f, "defcon_pretty")), multiply(subtract(5, rt.sv(f, "defcon")), rt.sv(f, "processing_interval"))])]);
						rt.incSrcVar(f, "defcon", -1, false);
					} else if ($0 === 2) {
						yield* g.call(f, P("/proc/to_chat"), null, [rt.gl("admins"), fmt("<span class='boldannounce'>Warning: DEFCON ＀. The Master Controller has not fired in the last ＀ ticks. Automatic restart in ＀ ticks.</span>", [(yield* g.srcCall(f, "defcon_pretty")), multiply(subtract(5, rt.sv(f, "defcon")), rt.sv(f, "processing_interval")), rt.sv(f, "processing_interval")])]);
						rt.incSrcVar(f, "defcon", -1, false);
					} else if ($0 === 1) {
						yield* g.call(f, P("/proc/to_chat"), null, [rt.gl("admins"), fmt("<span class='boldannounce'>Warning: DEFCON ＀. The Master Controller has still not fired within the last ＀ ticks. Killing and restarting...</span>", [(yield* g.srcCall(f, "defcon_pretty")), multiply(subtract(5, rt.sv(f, "defcon")), rt.sv(f, "processing_interval"))])]);
						rt.incSrcVar(f, "defcon", -1, false);
						if (rt.gt((rtn = (yield* g.call(f, P("/proc/Recreate_MC"), null, []))), 0)) {
							rt.setSv(f, "defcon", 4);
							rt.setSv(f, "master_iteration", 0);
							yield* g.call(f, P("/proc/to_chat"), null, [rt.gl("admins"), "<span class='adminnotice'>MC restarted successfully</span>"]);
						} else {
							if (rt.lt(live(rtn), 0)) {
								yield* g.call(f, P("/proc/log_game"), null, ["FailSafe: Could not restart MC, runtime encountered. Entering defcon 0"]);
								yield* g.call(f, P("/proc/to_chat"), null, [rt.gl("admins"), fmt("<span class='boldannounce'>ERROR: DEFCON ＀. Could not restart MC, runtime encountered. I will silently keep retrying.</span>", [(yield* g.srcCall(f, "defcon_pretty"))])]);
							}
						}
					} else if ($0 === 0) {
						if (rt.gt((rtn = (yield* g.call(f, P("/proc/Recreate_MC"), null, []))), 0)) {
							rt.setSv(f, "defcon", 4);
							rt.setSv(f, "master_iteration", 0);
							yield* g.call(f, P("/proc/to_chat"), null, [rt.gl("admins"), "<span class='adminnotice'>MC restarted successfully</span>"]);
						}
					}
				} else {
					rt.setSv(f, "defcon", (yield* g.call(f, P("/proc/min"), null, [add(rt.sv(f, "defcon"), 1), 5])));
					rt.setSv(f, "master_iteration", rt.fv(f, "iteration", rt.gl("Master")));
				}
			}
			if (rt.le(rt.sv(f, "defcon"), 1)) {
				yield* rt.sleepKeep(f, multiply(rt.sv(f, "processing_interval"), 2), "Failsafe.Initialize loop", []);
			} else {
				yield* rt.sleepKeep(f, rt.sv(f, "processing_interval"), "Failsafe.Initialize loop", []);
			}
		} else {
			rt.setSv(f, "defcon", 5);
			yield* rt.sleepKeep(f, rt.initial(f, live(f.src), "processing_interval"), "Failsafe.Initialize loop", []);
		}
	}
}


// /datum/controller/failsafe/proc/stat_entry  (code/controllers/failsafe.dm:99)  may sleep
rt.def("/datum/controller/failsafe/proc/stat_entry", function* stat_entry(f: Frame) {
	if (!truthy(rt.sv(f, "statclick"))) {
		rt.setSv(f, "statclick", (yield* g.new_(f, T("/obj/effect/statclick/debug"), [null, "Initializing...", live(f.src)])));
	}
	yield* g.call(f, P("/proc/stat"), null, ["Failsafe Controller:", (yield* g.callName(f, rt.sv(f, "statclick"), "update", [fmt("Defcon: ＀ (Interval: ＀ | Iteration: ＀)", [(yield* g.srcCall(f, "defcon_pretty")), rt.fv(f, "processing_interval", rt.gl("Failsafe")), rt.fv(f, "master_iteration", rt.gl("Failsafe"))])]))]);
	return f.dot;
}, true);
