// Based on /tg/station's code/controllers/subsystem/garbage.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


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

// garbage.dm:1
rt.def("/datum/controller/subsystem/garbage/proc/New", function* New(f: Frame) {
	if (GLOB.SSgarbage != this) {
		if (rt.istype(GLOB.SSgarbage, T("/datum/controller/subsystem/garbage"))) {
			yield* this.Recover();
			yield* qdel(GLOB.SSgarbage);
		}
		GLOB.SSgarbage = this;
	}
	this.PreInit();
	return f.dot;
}, true);

// garbage.dm:17
rt.def("/datum/controller/subsystem/garbage/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.queue = list();

	this.tobequeued = list();

	this.didntgc = list();

	this.sleptDestroy = list();

	this.noqdelhint = list();

	this.noforcerespect = list();
	return f.dot;
});

// garbage.dm:37
rt.def("/datum/controller/subsystem/garbage/proc/stat_entry", function* stat_entry(f: Frame, msg: Value) {
	msg += `Q:${rt.len(f, this.queue)}|D:${this.delslasttick}|G:${this.gcedlasttick}|`;
	msg += "GR:";
	if (!(this.delslasttick + this.gcedlasttick)) {
		msg += "n/a|";
	} else {
		msg += `${round(this.gcedlasttick / (this.delslasttick + this.gcedlasttick) * 100, 0.01)}%|`;
	}
	msg += `TD:${this.totaldels}|TG:${this.totalgcs}|`;
	if (!(this.totaldels + this.totalgcs)) {
		msg += "n/a|";
	} else {
		msg += `TGR:${round(this.totalgcs / (this.totaldels + this.totalgcs) * 100, 0.01)}%`;
	}
	yield* parent_proc(msg);
	return f.dot;
}, true);

// garbage.dm:53
rt.def("/datum/controller/subsystem/garbage/proc/Shutdown", function Shutdown(f: Frame) {
	let path: Value = null;
	if (!(rt.len(f, this.didntgc) || rt.len(f, this.sleptDestroy))) return f.dot;
	let dellog: Value = list();
	for (path of each(this.didntgc)) {
		dellog += `Path : ${path} \n`;
		dellog += `Failures : ${rt.index(this.didntgc, path)} \n`;
		if (rt.isIn(f, path, this.sleptDestroy)) {
			dellog += `Sleeps : ${rt.index(this.sleptDestroy, path)} \n`;
			this.sleptDestroy -= path;
		}
	}
	path = null;
	for (path of each(this.sleptDestroy)) {
		dellog += `Path : ${path} \n`;
		dellog += `Sleeps : ${rt.index(this.sleptDestroy, path)} \n`;
	}
	text2file(dellog.Join(), `${GLOB.log_directory}/qdel.log`);
	return f.dot;
});

// garbage.dm:67
rt.def("/datum/controller/subsystem/garbage/proc/fire", function fire(f: Frame) {
	this.HandleToBeQueued();
	if (this.state == SS_RUNNING) {
		this.HandleQueue();
	}
	if (this.state != SS_PAUSED) return f.dot;
	this.state = SS_RUNNING;
	return f.dot;
});

// garbage.dm:80
rt.def("/datum/controller/subsystem/garbage/proc/HandleToBeQueued", function HandleToBeQueued(f: Frame) {
	let ref: Value = null;
	let tobequeued: Value = this.tobequeued;
	let starttime: Value = rt.worldTime(f);
	let starttimeofday: Value = rt.world().timeofday;
	while (rt.len(f, tobequeued) && starttime == rt.worldTime(f) && starttimeofday == rt.world().timeofday) {
		if (rt.tickUsage(f) > GLOB.current_ticklimit || this.state != 2 ? this.pause() : 0) {
			break;
		}
		this.Queue((ref = rt.index(tobequeued, 1)));
		tobequeued.Cut(1, 2);
	}
	return f.dot;
});

// garbage.dm:90
rt.def("/datum/controller/subsystem/garbage/proc/HandleQueue", function HandleQueue(f: Frame) {
	let refID: Value = null, GCd_at_time: Value = null, A: Value = null, type: Value = null;
	this.delslasttick = 0;
	this.gcedlasttick = 0;
	let time_to_kill: Value = rt.worldTime(f) - this.collection_timeout;
	let queue: Value = this.queue;
	let starttime: Value = rt.worldTime(f);
	let starttimeofday: Value = rt.world().timeofday;
	while (rt.len(f, queue) && starttime == rt.worldTime(f) && starttimeofday == rt.world().timeofday) {
		if (rt.tickUsage(f) > GLOB.current_ticklimit || this.state != 2 ? this.pause() : 0) {
			break;
		}
		if (!(refID = rt.index(queue, 1))) {
			queue.Cut(1, 2);
			continue;
		}
		if ((GCd_at_time = rt.index(queue, refID)) > time_to_kill) {
			break;
		}
		queue.Cut(1, 2);
		A = null;
		if ((A = rt.locateIn(f, refID, rt.world())) && A.gc_destroyed == GCd_at_time) {
			type = A.type;
			rt.incAt(this.didntgc, `${type}`, 1, true);
			this.HardDelete(A);
			++this.delslasttick;
			++this.totaldels;
		} else {
			++this.gcedlasttick;
			++this.totalgcs;
		}
	}
	return f.dot;
});

// garbage.dm:127
rt.def("/datum/controller/subsystem/garbage/proc/QueueForQueuing", function QueueForQueuing(f: Frame, A: Value) {
	if (!(rt.istype(A, T("/datum")) && A.gc_destroyed == GC_CURRENTLY_BEING_QDELETED)) return f.dot;
	this.tobequeued += A;
	A.gc_destroyed = GC_QUEUED_FOR_QUEUING;
	return f.dot;
});

// garbage.dm:132
rt.def("/datum/controller/subsystem/garbage/proc/Queue", function Queue(f: Frame, A: Value) {
	if (A === null || A.gc_destroyed !== null && A.gc_destroyed >= 0) {
		return f.dot;
	}
	if (A.gc_destroyed == GC_QUEUED_FOR_HARD_DEL) {
		this.HardDelete(A);
		return f.dot;
	}
	let gctime: Value = rt.worldTime(f);
	let refid: Value = fmt("＃", [A]);
	A.gc_destroyed = gctime;
	if (rt.index(this.queue, refid)) {
		this.queue -= refid;
	}
	rt.setAt(this.queue, refid, gctime);
	return f.dot;
});

// garbage.dm:154
rt.def("/datum/controller/subsystem/garbage/proc/HardDelete", function HardDelete(f: Frame, A: Value) {
	let time: Value = rt.world().timeofday;
	let tick: Value = rt.tickUsage(f);
	let ticktime: Value = rt.worldTime(f);
	let type: Value = A.type;
	let refID: Value = fmt("＃", [A]);
	rt.del(f, A);
	if ((tick = rt.tickUsage(f) - tick + (rt.worldTime(f) - ticktime) / rt.world().tick_lag * 100) > this.highest_del_tickusage) {
		this.highest_del_tickusage = tick;
	}
	if (!(time = rt.world().timeofday - time) && tick * rt.world().tick_lag > 1) {
		time = tick * rt.world().tick_lag / 100;
	}
	if (time > this.highest_del_time) {
		this.highest_del_time = time;
	}
	if (!(time > 10)) return f.dot;
	log_game(`Error: ${type}(${refID}) took longer than 1 second to delete (took ${time / 10} seconds to delete)`);
	message_admins(`Error: ${type}(${refID}) took longer than 1 second to delete (took ${time / 10} seconds to delete).`);
	this.postpone(time / 5);
	return f.dot;
});

// garbage.dm:172
rt.def("/datum/controller/subsystem/garbage/proc/HardQueue", function HardQueue(f: Frame, A: Value) {
	if (!(rt.istype(A, T("/datum")) && A.gc_destroyed == GC_CURRENTLY_BEING_QDELETED)) return f.dot;
	this.tobequeued += A;
	A.gc_destroyed = GC_QUEUED_FOR_HARD_DEL;
	return f.dot;
});

// garbage.dm:177
rt.def("/datum/controller/subsystem/garbage/proc/Recover", function Recover(f: Frame) {
	if (rt.istype(GLOB.SSgarbage.queue, T("/list"))) {
		(rt.modSrcVar(f, "queue", GLOB.SSgarbage.queue, rt.bitOr));
	}
	if (!rt.istype(GLOB.SSgarbage.tobequeued, T("/list"))) return f.dot;
	(rt.modSrcVar(f, "tobequeued", GLOB.SSgarbage.tobequeued, rt.bitOr));
	return f.dot;
});

// garbage.dm:185
rt.def("/proc/qdel", function* qdel(f: Frame, D: Value, force: Value) {
	let start_time: Value = null, hint: Value = null;
	force ??= QDEL_HINT_QUEUE;
	if (!rt.istype(D, T("/datum"))) {
		yield* g.del(f, D);
		return f.dot;
	}
	if (D.gc_destroyed === null) {
		D.gc_destroyed = GC_CURRENTLY_BEING_QDELETED;
		start_time = rt.worldTime(f);
		hint = (yield* D.Destroy(force));
		if (rt.worldTime(f) != start_time) {
			rt.incAt(GLOB.SSgarbage.sleptDestroy, `${D.type}`, QDEL_HINT_LETMELIVE, true);
		}
		if (!D) {
			return f.dot;
		}
		if (hint === QDEL_HINT_QUEUE) {
			GLOB.SSgarbage.QueueForQueuing(D);
		} else if (hint === QDEL_HINT_IWILLGC) {
			D.gc_destroyed = rt.worldTime(f);
			return f.dot;
		} else if (hint === QDEL_HINT_LETMELIVE) {
			if (!force) {
				D.gc_destroyed = null;
				return f.dot;
			}
			if (!rt.index(GLOB.SSgarbage.noforcerespect, `${D.type}`)) {
				rt.setAt(GLOB.SSgarbage.noforcerespect, `${D.type}`, `${D.type}`);
			}
			GLOB.SSgarbage.QueueForQueuing(D);
		} else if (hint === QDEL_HINT_HARDDEL) {
			GLOB.SSgarbage.HardQueue(D);
		} else if (hint === QDEL_HINT_HARDDEL_NOW) {
			GLOB.SSgarbage.HardDelete(D);
		} else if (hint === QDEL_HINT_FINDREFERENCE) {
			GLOB.SSgarbage.QueueForQueuing(D);
		} else {
			if (!rt.index(GLOB.SSgarbage.noqdelhint, `${D.type}`)) {
				rt.setAt(GLOB.SSgarbage.noqdelhint, `${D.type}`, `${D.type}`);
			}
			GLOB.SSgarbage.QueueForQueuing(D);
		}
	} else {
		if (D.gc_destroyed != GC_CURRENTLY_BEING_QDELETED) return f.dot;
		CRASH(`${D.type} destroy proc was called multiple times, likely due to a qdel loop in the Destroy logic`);
	}
	return f.dot;
}, true, { argTypes: [{ path: "/datum" }, {  }] });

// garbage.dm:241
rt.def("/datum/proc/Destroy", function* Destroy(f: Frame, force: Value) {
	let thing: Value = null, timer: Value = null;
	force ??= 0;
	this.tag = null;
	let timers: Value = this.active_timers;
	this.active_timers = null;
	for (thing of each(timers)) {
		if ((timer = thing).spent) {
			continue;
		}
		yield* qdel(timer);
	}
	return 0;
}, true);
