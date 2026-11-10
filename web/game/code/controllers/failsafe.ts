// Based on /tg/station's code/controllers/failsafe.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, isEqual, add, subtract, multiply, fmt } = rt;


rt.type(9, "/datum/controller/failsafe", "/datum/controller", {
	processing_interval: 20,
	defcon: 5,
	lasttick: 0,
	master_iteration: 0,
	running: 1,
	name: "Failsafe",
});

// failsafe.dm:27
rt.def("/datum/controller/failsafe/proc/New", function* New(f: Frame) {
	if (GLOB.Failsafe != this) {
		if (rt.istype(GLOB.Failsafe, T("/datum/controller/failsafe"))) {
			yield* qdel(GLOB.Failsafe);
		}
	}
	GLOB.Failsafe = this;
	yield* this.Initialize();
	return f.dot;
}, true);

// failsafe.dm:35
// Mid-round snapshots (tools/make-snapshot.mjs): Loop's code runs in this frame (failsafeLoop here, failsafeLoopWhile after Loop) instead of as a call,
// so the sleeping failsafe is one frame whose sleeps are tail data ("Failsafe.Initialize loop"). Loop is never called elsewhere.
rt.def("/datum/controller/failsafe/proc/Initialize", function* Initialize(f: Frame) {
	return yield* failsafeLoop(f);
}, true, { waitfor: false });
function* failsafeLoop(f: Frame) {
	yield* failsafeLoopWhile(f);
	if (!f.src || rt.fv(f, "gc_destroyed", f.src)) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [f.src]);
	return f.dot;
}
rt.tail("Failsafe.Initialize loop", failsafeLoop);

// failsafe.dm:41
rt.def("/datum/controller/failsafe/proc/Destroy", function* Destroy(f: Frame) {
	this.running = 0;
	yield* parent_proc();
	return QDEL_HINT_HARDDEL_NOW;
}, true);

// failsafe.dm:47
rt.def("/datum/controller/failsafe/proc/Loop", function* Loop(f: Frame) {
	let rtn: Value = null;
	while (this.running) {
		this.lasttick = rt.worldTime(f);
		if (!GLOB.Master) {
			yield* new_(T("/datum/controller/master"));
		}
		if (this.processing_interval > 0) {
			if (GLOB.Master.processing && GLOB.Master.iteration) {
				if (GLOB.Master.iteration == this.master_iteration) {
					if (this.defcon === 4 || this.defcon === 5) {
						--this.defcon;
					} else if (this.defcon === 3) {
						to_chat(GLOB.admins, `<span class='adminnotice'>Notice: DEFCON ${this.defcon_pretty()}. The Master Controller has not fired in the last ${(5 - this.defcon) * this.processing_interval} ticks.`);
						--this.defcon;
					} else if (this.defcon === 2) {
						to_chat(GLOB.admins, `<span class='boldannounce'>Warning: DEFCON ${this.defcon_pretty()}. The Master Controller has not fired in the last ${(5 - this.defcon) * this.processing_interval} ticks. Automatic restart in ${this.processing_interval} ticks.</span>`);
						--this.defcon;
					} else if (this.defcon === 1) {
						to_chat(GLOB.admins, `<span class='boldannounce'>Warning: DEFCON ${this.defcon_pretty()}. The Master Controller has still not fired within the last ${(5 - this.defcon) * this.processing_interval} ticks. Killing and restarting...</span>`);
						--this.defcon;
						if ((rtn = (yield* Recreate_MC())) > 0) {
							this.defcon = 4;
							this.master_iteration = 0;
							to_chat(GLOB.admins, "<span class='adminnotice'>MC restarted successfully</span>");
						} else if (rtn < 0) {
							log_game("FailSafe: Could not restart MC, runtime encountered. Entering defcon 0");
							to_chat(GLOB.admins, `<span class='boldannounce'>ERROR: DEFCON ${this.defcon_pretty()}. Could not restart MC, runtime encountered. I will silently keep retrying.</span>`);
						}
					} else if (this.defcon === 0) {
						if ((rtn = (yield* Recreate_MC())) > 0) {
							this.defcon = 4;
							this.master_iteration = 0;
							to_chat(GLOB.admins, "<span class='adminnotice'>MC restarted successfully</span>");
						}
					}
				} else {
					this.defcon = min(this.defcon + 1, 5);
					this.master_iteration = GLOB.Master.iteration;
				}
			}
			if (this.defcon <= 1) {
				yield* sleep(this.processing_interval * 2);
			} else {
				yield* sleep(this.processing_interval);
			}
		} else {
			this.defcon = 5;
			yield* sleep(rt.initial(f, this, "processing_interval"));
		}
	}
	return f.dot;
}, true);

// Loop's code for Initialize (failsafe.dm:48-81); each sleep ends an iteration.
function* failsafeLoopWhile(f: Frame) {
	let rtn: Value = null;
	let $0: any;
	f.vars = () => [rtn, $0];
	while (rt.sv(f, "running")) {
		rt.setSv(f, "lasttick", rt.worldTime(f));
		if (!rt.gl("Master")) {
			yield* g.new_(f, T("/datum/controller/master"), []);
		}
		if (rt.gt(rt.sv(f, "processing_interval"), 0)) {
			if (rt.fv(f, "processing", rt.gl("Master")) && rt.fv(f, "iteration", rt.gl("Master"))) {
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
							if (rt.lt(rtn, 0)) {
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
			yield* rt.sleepKeep(f, rt.initial(f, f.src, "processing_interval"), "Failsafe.Initialize loop", []);
		}
	}
}


// failsafe.dm:99
rt.def("/datum/controller/failsafe/proc/stat_entry", function* stat_entry(f: Frame) {
	if (!this.statclick) {
		this.statclick = (yield* new_(T("/obj/effect/statclick/debug"), null, "Initializing...", this));
	}
	stat("Failsafe Controller:", (yield* this.statclick.update(`Defcon: ${this.defcon_pretty()} (Interval: ${GLOB.Failsafe.processing_interval} | Iteration: ${GLOB.Failsafe.master_iteration})`)));
	return f.dot;
}, true);
