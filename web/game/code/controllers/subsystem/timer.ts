// Based on /tg/station's code/controllers/subsystem/timer.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


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

// timer.dm:4
rt.def("/datum/controller/subsystem/timer/proc/New", function* New(f: Frame) {
	if (GLOB.SStimer != this) {
		if (rt.istype(GLOB.SStimer, T("/datum/controller/subsystem/timer"))) {
			yield* this.Recover();
			yield* qdel(GLOB.SStimer);
		}
		GLOB.SStimer = this;
	}
	this.PreInit();
	return f.dot;
}, true);

// timer.dm:11
rt.def("/datum/controller/subsystem/timer/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.processing = list();

	this.hashes = list();

	this.bucket_list = list();

	this.timer_id_dict = list();

	this.clienttime_timers = list();
	return f.dot;
});

// timer.dm:30
rt.def("/datum/controller/subsystem/timer/proc/stat_entry", function* stat_entry(f: Frame, msg: Value) {
	yield* parent_proc(`B:${this.bucket_count} P:${rt.length(this.processing)} H:${rt.length(this.hashes)} C:${rt.length(this.clienttime_timers)}`);
	return f.dot;
}, true);

// timer.dm:33
rt.def("/datum/controller/subsystem/timer/proc/fire", function* fire(f: Frame, resumed: Value) {
	let msg: Value = null, I: Value = null, TE: Value = null, CB: Value = null, first: Value = null, J: Value = null, ctime_timer: Value = null, callBack: Value = null, spent_timer: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $e: any;
	resumed ??= 0;
	let lit: Value = this.last_invoke_tick;
	let last_check: Value = rt.worldTime(f) - TIMER_NO_INVOKE_WARNING;
	if (!this.bucket_count) {
		this.last_invoke_tick = rt.worldTime(f);
	}
	if (lit && lit < last_check && GLOB.last_invoke_warning < last_check) {
		GLOB.last_invoke_warning = rt.worldTime(f);
		$0 = TIMER_NO_INVOKE_WARNING;
		if (GLOB.bucket_auto_reset) {
			$1 = ", resetting buckets";
		} else {
			$1 = "";
		}
		message_admins((msg = `No regular timers processed in the last ${$0} ticks${$1}!`));
		warning(`${msg} in ${"code/controllers/subsystem/timer.dm"} at line ${43} src: ${this} usr: ${f.usr}.`);
		if (GLOB.bucket_auto_reset) {
			this.bucket_resolution = 0;
		}
		log_world(`Active timers at tick ${rt.worldTime(f)}:`);
		for (I of each(this.processing)) {
			msg = `Timer: ${(TE = I).id}: TTR: ${TE.timeToRun}, Flags: ${TE.flags}, `;
			if (TE.spent) {
				msg += "SPENT";
			} else {
				CB = TE.callBack;
				msg += "callBack: ";
				if (CB.object == "some_magic_bullshit") {
					msg += `GP: ${CB.delegate}`;
				} else {
					if (!(!CB.object || CB.object.gc_destroyed)) {
						$0 = CB.object;
					} else {
						$0 = "SRC DELETED";
					}
					msg += `${$0}: ${CB.delegate}(`;
					first = 1;
					J = null;
					for (J of each(rt.fv(f, "arguments", CB))) {
						if (first) {
							$0 = "";
						} else {
							$0 = ", ";
						}
						msg += `${$0}${J}`;
						first = 0;
					}
					msg += ")";
				}
			}
			log_world(msg);
		}
	}
	while (rt.length(this.clienttime_timers)) {
		$0 = (ctime_timer = rt.index(this.clienttime_timers, rt.len(f, this.clienttime_timers))).timeToRun;
		$1 = rt.world().timeofday;
		$2 = 864000;
		if (GLOB.rollovercheck_last_timeofday != rt.world().timeofday) {
			$3 = update_midnight_rollover();
		} else {
			$3 = GLOB.midnight_rollovers;
		}
		if ($0 <= $1 + $2 * $3) {
			--this.clienttime_timers.len;
			callBack = ctime_timer.callBack;
			ctime_timer.spent = 1;
			yield* callBack.InvokeAsync();
			yield* qdel(ctime_timer);
		} else {
			break;
		}
		if (rt.tickUsage(f) > GLOB.current_ticklimit || this.state != 2 ? this.pause() : 0) {
			return f.dot;
		}
	}
	if (this.practical_offset > rt.world().fps * 1 * 60 || !resumed && rt.length(this.bucket_list) != rt.world().fps * 1 * 60 || rt.world().tick_lag != this.bucket_resolution) {
		yield* this.shift_buckets();
		resumed = 0;
	}
	if (!resumed) {
		GLOB.timer = null;
		GLOB.head = null;
	}
	let bucket_list: Value = this.bucket_list;
	while (true) {
		$0 = ((this.practical_offset <= rt.world().fps * 1 * 60 ? 1 : 0) && (this.head_offset + this.practical_offset * rt.world().tick_lag <= rt.worldTime(f) ? 1 : 0));
		if ($0) {
			if (rt.tickUsage(f) > GLOB.current_ticklimit || this.state != 2) {
				$0 = this.pause();
			} else {
				$0 = 0;
			}
			$0 = (!$0 ? 1 : 0);
		}
		if (!$0) break;
		if (!GLOB.timer || !GLOB.head || GLOB.timer == GLOB.head) {
			GLOB.head = rt.index(bucket_list, this.practical_offset);
			if (!GLOB.head) {
				this.practical_offset++;
				if (rt.tickUsage(f) > GLOB.current_ticklimit || this.state != 2 ? this.pause() : 0) {
					break;
				}
				continue;
			}
			GLOB.timer = GLOB.head;
		}
		while (true) {
			if (!(callBack = GLOB.timer.callBack)) {
				yield* qdel(GLOB.timer);
				this.bucket_resolution = null;
				CRASH(`Invalid timer: timer.timeToRun=${GLOB.timer.timeToRun}||QDELETED(timer)=${((!GLOB.timer ? 1 : 0) || GLOB.timer.gc_destroyed)}||world.time=${rt.worldTime(f)}||head_offset=${this.head_offset}||practical_offset=${this.practical_offset}||timer.spent=${GLOB.timer.spent}`);
			}
			if (!GLOB.timer.spent) {
				GLOB.spent += GLOB.timer;
				GLOB.timer.spent = 1;
				yield* callBack.InvokeAsync();
				this.last_invoke_tick = rt.worldTime(f);
			}
			GLOB.timer = rt.fv(f, "next", GLOB.timer);
			if (rt.tickUsage(f) > GLOB.current_ticklimit || this.state != 2 ? this.pause() : 0) {
				return f.dot;
			}
			if (!(GLOB.timer && GLOB.timer != GLOB.head)) break;
		}
		GLOB.timer = null;
		rt.setAt(bucket_list, this.practical_offset++, null);
		if (rt.tickUsage(f) > GLOB.current_ticklimit || this.state != 2 ? this.pause() : 0) {
			return f.dot;
		}
	}
	this.bucket_count -= rt.length(GLOB.spent);
	for (spent_timer of each(GLOB.spent)) {
		yield* qdel(spent_timer);
	}
	GLOB.spent.len = 0;
	return f.dot;
}, true);

// timer.dm:137
rt.def("/datum/controller/subsystem/timer/proc/shift_buckets", function* shift_buckets(f: Frame) {
	let bucket_head: Value = null, bucket_node: Value = null, head: Value = null, thing: Value = null, timer: Value = null, bucket_pos: Value = null, bucket_head_7: Value = null;
	let bucket_list: Value = this.bucket_list;
	let alltimers: Value = list();
	for (bucket_head of each(bucket_list)) {
		if (!bucket_head) {
			continue;
		}
		bucket_node = bucket_head;
		while (true) {
			alltimers += bucket_node;
			if (!((bucket_node = rt.fv(f, "next", bucket_node)) && bucket_node != bucket_head)) break;
		}
	}
	bucket_list.len = 0;
	bucket_list.len = rt.world().fps * 1 * 60;
	this.practical_offset = 1;
	this.bucket_count = 0;
	this.head_offset = rt.worldTime(f);
	this.bucket_resolution = rt.world().tick_lag;
	if (!rt.length((alltimers += this.processing))) {
		return f.dot;
	}
	yield* sortTim(alltimers, P("/proc/cmp_timer"));
	if ((head = rt.index(alltimers, 1)).timeToRun < this.head_offset) {
		this.head_offset = head.timeToRun;
	}
	let timers_to_remove: Value = list();
	for (thing of each(alltimers)) {
		if (!(timer = thing)) {
			timers_to_remove += timer;
			continue;
		}
		if ((bucket_pos = round((timer.timeToRun - GLOB.SStimer.head_offset) / rt.world().tick_lag) + 1) > rt.world().fps * 1 * 60) {
			break;
		}
		timers_to_remove += timer;
		if (!timer.callBack || timer.spent) {
			continue;
		}
		this.bucket_count++;
		if (!(bucket_head_7 = rt.index(bucket_list, bucket_pos))) {
			rt.setAt(bucket_list, bucket_pos, timer);
			rt.setFv(f, "next", timer, null);
			timer.prev = null;
			continue;
		}
		if (!bucket_head_7.prev) {
			bucket_head_7.prev = bucket_head_7;
		}
		rt.setFv(f, "next", timer, bucket_head_7);
		timer.prev = bucket_head_7.prev;
		rt.fv(f, "next", timer).prev = timer;
		rt.setFv(f, "next", timer.prev, timer);
	}
	this.processing = alltimers - timers_to_remove;
	return f.dot;
}, true);

// timer.dm:201
rt.def("/datum/controller/subsystem/timer/proc/Recover", function Recover(f: Frame) {
	(rt.modSrcVar(f, "processing", GLOB.SStimer.processing, rt.bitOr));
	(rt.modSrcVar(f, "hashes", GLOB.SStimer.hashes, rt.bitOr));
	(rt.modSrcVar(f, "timer_id_dict", GLOB.SStimer.timer_id_dict, rt.bitOr));
	(rt.modSrcVar(f, "bucket_list", GLOB.SStimer.bucket_list, rt.bitOr));
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

// timer.dm:222
rt.def("/datum/timedevent/proc/New", function New(f: Frame, callBack: Value, timeToRun: Value, flags: Value, hash: Value) {
	let ctts: Value = null, cttl: Value = null, Last: Value = null, I: Value = null, E: Value = null, bucket_pos: Value = null;
	let $e: any;
	this.id = rt.incGl("nextid", 1, true);
	this.callBack = callBack;
	this.timeToRun = timeToRun;
	this.flags = flags;
	this.hash = hash;
	if (rt.bitAnd(flags, 1)) {
		rt.setAt(GLOB.SStimer.hashes, hash, this);
	}
	if (rt.bitAnd(flags, 8)) {
		rt.setAt(GLOB.SStimer.timer_id_dict, `timerid${this.id}`, this);
	}
	if (callBack.object != "some_magic_bullshit") {
		if (!callBack.object.active_timers) {
			callBack.object.active_timers = list();
		}
		callBack.object.active_timers += this;
	}
	if (rt.bitAnd(flags, 4)) {
		ctts = GLOB.SStimer.clienttime_timers;
		if (cttl = rt.length(ctts)) {
			if ((Last = rt.index(ctts, cttl)).timeToRun >= timeToRun) {
				ctts += this;
			} else if (cttl > 1) {
				rt.forRange(f, 0, cttl, 1, 1);
				while (($e = rt.next(f, 0)) !== undefined) {
					I = $e;
					if ((E = rt.index(ctts, I)).timeToRun <= timeToRun) {
						ctts.Insert(this, I);
						break;
					}
				}
				rt.endFor(f, 0);
			}
		} else {
			ctts += this;
		}
		return f.dot;
	}
	let bucket_list: Value = GLOB.SStimer.bucket_list;
	if ((bucket_pos = round((this.timeToRun - GLOB.SStimer.head_offset) / rt.world().tick_lag) + 1) > rt.length(bucket_list)) {
		GLOB.SStimer.processing += this;
		return f.dot;
	}
	let bucket_head: Value = rt.index(bucket_list, bucket_pos);
	GLOB.SStimer.bucket_count++;
	if (!bucket_head) {
		rt.setAt(bucket_list, bucket_pos, this);
		if (bucket_pos < GLOB.SStimer.practical_offset) {
			GLOB.SStimer.practical_offset = bucket_pos;
		}
		return f.dot;
	}
	if (!bucket_head.prev) {
		bucket_head.prev = bucket_head;
	}
	rt.setSv(f, "next", bucket_head);
	this.prev = bucket_head.prev;
	rt.sv(f, "next").prev = this;
	rt.setFv(f, "next", this.prev, this);
	return f.dot;
});

// timer.dm:280
rt.def("/datum/timedevent/proc/Destroy", function* Destroy(f: Frame) {
	let bucketpos: Value = null, buckethead: Value = null, bucket_list: Value = null;
	yield* parent_proc();
	if (rt.bitAnd(this.flags, 1)) {
		GLOB.SStimer.hashes -= this.hash;
	}
	if (this.callBack && this.callBack.object && this.callBack.object != "some_magic_bullshit" && this.callBack.object.active_timers) {
		this.callBack.object.active_timers -= this;
		if (this.callBack.object.active_timers && !rt.len(f, this.callBack.object.active_timers)) {
			this.callBack.object.active_timers = null;
		}
	}
	this.callBack = null;
	if (rt.bitAnd(this.flags, 8)) {
		GLOB.SStimer.timer_id_dict -= `timerid${this.id}`;
	}
	if (rt.bitAnd(this.flags, 4)) {
		GLOB.SStimer.clienttime_timers -= this;
		return QDEL_HINT_IWILLGC;
	}
	if (!this.spent) {
		if (this.prev == rt.sv(f, "next") && rt.sv(f, "next")) {
			rt.sv(f, "next").prev = null;
			rt.setFv(f, "next", this.prev, null);
		} else {
			if (this.prev) {
				rt.setFv(f, "next", this.prev, rt.sv(f, "next"));
			}
			if (rt.sv(f, "next")) {
				rt.sv(f, "next").prev = this.prev;
			}
		}
		bucketpos = round((this.timeToRun - GLOB.SStimer.head_offset) / rt.world().tick_lag) + 1;
		bucket_list = GLOB.SStimer.bucket_list;
		if (bucketpos > 0 && bucketpos <= rt.length(bucket_list)) {
			buckethead = rt.index(bucket_list, bucketpos);
			GLOB.SStimer.bucket_count--;
		} else {
			GLOB.SStimer.processing -= this;
		}
		if (buckethead == this) {
			rt.setAt(bucket_list, bucketpos, rt.sv(f, "next"));
		}
	} else {
		if (this.prev && rt.fv(f, "next", this.prev) == this) {
			rt.setFv(f, "next", this.prev, rt.sv(f, "next"));
		}
		if (rt.sv(f, "next") && rt.sv(f, "next").prev == this) {
			rt.sv(f, "next").prev = this.prev;
		}
	}
	rt.setSv(f, "next", null);
	this.prev = null;
	return QDEL_HINT_IWILLGC;
}, true);

// timer.dm:330
rt.def("/proc/addtimer", function* addtimer(f: Frame, callback: Value, wait: Value, flags: Value) {
	let hash: Value = null, hashlist: Value = null, hash_timer: Value = null;
	let $0: any, $1: any, $2: any;
	if (!callback) {
		return f.dot;
	}
	wait = max(wait, 0);
	if (rt.bitAnd(flags, 1)) {
		if (rt.bitAnd(flags, 16)) {
			hashlist = list(callback.object, fmt("(＃)", [callback.object]), callback.delegate, rt.bitAnd(flags, 4));
		} else {
			hashlist = list(callback.object, fmt("(＃)", [callback.object]), callback.delegate, wait, rt.bitAnd(flags, 4));
		}
		hash = (hashlist += rt.fv(f, "arguments", callback)).Join("|||||||");
		if (hash_timer = rt.index(GLOB.SStimer.hashes, hash)) {
			if (hash_timer.spent) {
				hash_timer.hash = null;
				GLOB.SStimer.hashes -= hash;
			} else if (rt.bitAnd(flags, 2)) {
				yield* qdel(hash_timer);
			} else {
				if (rt.bitAnd(hash_timer.flags, 8)) {
					f.dot = hash_timer.id;
				}
				return f.dot;
			}
		}
	}
	let timeToRun: Value = rt.worldTime(f) + wait;
	if (rt.bitAnd(flags, 4)) {
		$0 = rt.world().timeofday;
		$1 = 864000;
		if (GLOB.rollovercheck_last_timeofday != rt.world().timeofday) {
			$2 = update_midnight_rollover();
		} else {
			$2 = GLOB.midnight_rollovers;
		}
		timeToRun = $0 + $1 * $2 + wait;
	}
	let timer: Value = (yield* new_(T("/datum/timedevent"), callback, timeToRun, flags, hash));
	if (rt.bitAnd(flags, 8)) {
		return timer.id;
	}
	return TIMER_ID_NULL;
}, true, { argTypes: [{ path: "/datum/callback" }, {  }, {  }] });

// timer.dm:371
rt.def("/proc/deltimer", function* deltimer(f: Frame, id: Value) {
	let timer: Value = null;
	if (!id) {
		return 0;
	}
	if (id == TIMER_ID_NULL) {
		CRASH("Tried to delete a null timerid. Use TIMER_STOPPABLE flag");
	}
	if (!istext(id)) {
		if (rt.istype(id, T("/datum/timedevent"))) {
			yield* qdel(id);
			return 1;
		}
	}
	if ((timer = rt.index(GLOB.SStimer.timer_id_dict, `timerid${id}`)) && !timer.spent) {
		yield* qdel(timer);
		return 1;
	}
	return 0;
}, true);
