// Based on /tg/station's code/controllers/subsystem.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(11, "/datum/controller/subsystem", "/datum/controller", {
	init_order: 0,
	wait: 20,
	priority: 50,
	flags: 0,
	can_fire: 1,
	last_fire: 0,
	next_fire: 0,
	cost: 0,
	tick_usage: 0,
	tick_overrun: 0,
	state: 0,
	paused_ticks: 0,
	paused_tick_usage: null,
	ticks: 1,
	times_fired: 0,
	queued_time: 0,
	queued_priority: null,
	queue_next: null,
	queue_prev: null,
	runlevels: 14,
	name: "fire coderbus",
}, { global: { failure_strikes: 617 } });

// subsystem.dm:50
rt.def("/datum/controller/subsystem/proc/ignite", function* ignite(f: Frame, resumed: Value) {
	resumed ??= 0;
	f.dot = SS_SLEEPING;
	yield* this.fire(resumed);
	f.dot = this.state;
	if (this.state == SS_SLEEPING) {
		this.state = SS_IDLE;
	}
	if (this.state != SS_PAUSING) return f.dot;
	let QT: Value = this.queued_time;
	this.enqueue();
	this.state = SS_PAUSED;
	this.queued_time = QT;
	return f.dot;
}, true, { waitfor: false });

// subsystem.dm:64
rt.def("/datum/controller/subsystem/proc/fire", function fire(f: Frame, resumed: Value) {
	resumed ??= 0;
	(rt.modSrcVar(f, "flags", SS_NO_FIRE, rt.bitOr));
	rt.throw_(f, new_(T("/exception"), `Subsystem ${this}(${this.type}) does not fire() but did not set the SS_NO_FIRE flag. Please add the SS_NO_FIRE flag to any subsystem that doesn't fire so it doesn't get added to the processing list and waste cpu.`, "code/controllers/subsystem.dm", 65));
	return f.dot;
});

// subsystem.dm:68
rt.def("/datum/controller/subsystem/proc/Destroy", function Destroy(f: Frame) {
	this.dequeue();
	this.can_fire = 0;
	(rt.modSrcVar(f, "flags", SS_NO_FIRE, rt.bitOr));
	GLOB.Master.subsystems -= this;
	return f.dot;
});

// subsystem.dm:78
rt.def("/datum/controller/subsystem/proc/enqueue", function enqueue(f: Frame) {
	let queue_node_priority: Value = null, queue_node_flags: Value = null;
	let SS_priority: Value = this.priority;
	let SS_flags: Value = this.flags;
	let queue_node: Value = GLOB.Master.queue_head;
	while (queue_node) {
		queue_node_priority = queue_node.queued_priority;
		blk57: {
			if (rt.bitAnd((queue_node_flags = queue_node.flags), SS_TICKER)) {
				if (!rt.bitAnd(SS_flags, SS_TICKER)) {
					break blk57;
				}
				if (queue_node_priority < SS_priority) {
					break;
				}
			} else if (rt.bitAnd(queue_node_flags, SS_BACKGROUND)) {
				if (!rt.bitAnd(SS_flags, SS_BACKGROUND)) {
					break;
				}
				if (queue_node_priority < SS_priority) {
					break;
				}
			} else if (!rt.bitAnd(SS_flags, SS_BACKGROUND)) {
				if (rt.bitAnd(SS_flags, SS_TICKER)) {
					break;
				}
				if (queue_node_priority < SS_priority) {
					break;
				}
			}
		}
		queue_node = queue_node.queue_next;
	}
	this.queued_time = rt.worldTime(f);
	this.queued_priority = SS_priority;
	this.state = SS_QUEUED;
	if (rt.bitAnd(SS_flags, SS_BACKGROUND)) {
		GLOB.Master.queue_priority_count_bg += SS_priority;
	} else {
		GLOB.Master.queue_priority_count += SS_priority;
	}
	this.queue_next = queue_node;
	if (!queue_node) {
		this.queue_prev = GLOB.Master.queue_tail;
		if (GLOB.Master.queue_tail) {
			GLOB.Master.queue_tail.queue_next = this;
		} else {
			GLOB.Master.queue_head = this;
		}
		GLOB.Master.queue_tail = this;
	} else if (queue_node == GLOB.Master.queue_head) {
		GLOB.Master.queue_head.queue_prev = this;
		GLOB.Master.queue_head = this;
		this.queue_prev = null;
	} else {
		queue_node.queue_prev.queue_next = this;
		this.queue_prev = queue_node.queue_prev;
		queue_node.queue_prev = this;
	}
	return f.dot;
});

// subsystem.dm:140
rt.def("/datum/controller/subsystem/proc/dequeue", function dequeue(f: Frame) {
	if (this.queue_next) {
		this.queue_next.queue_prev = this.queue_prev;
	}
	if (this.queue_prev) {
		this.queue_prev.queue_next = this.queue_next;
	}
	if (this == GLOB.Master.queue_tail) {
		GLOB.Master.queue_tail = this.queue_prev;
	}
	if (this == GLOB.Master.queue_head) {
		GLOB.Master.queue_head = this.queue_next;
	}
	this.queued_time = 0;
	if (this.state != SS_QUEUED) return f.dot;
	this.state = SS_IDLE;
	return f.dot;
});

// subsystem.dm:151
rt.def("/datum/controller/subsystem/proc/pause", function pause(f: Frame) {
	f.dot = 1;
	if (this.state === SS_RUNNING) {
		this.state = SS_PAUSED;
	} else if (this.state === SS_SLEEPING) {
		this.state = SS_PAUSING;
	}
	return f.dot;
});

// subsystem.dm:160
rt.def("/datum/controller/subsystem/proc/Initialize", function Initialize(f: Frame, start_timeofday: Value) {
	let $2: any;
	let $0: any = rt.world().timeofday;
	let $1: any = 864000;
	if (GLOB.rollovercheck_last_timeofday != rt.world().timeofday) {
		$2 = update_midnight_rollover();
	} else {
		$2 = GLOB.midnight_rollovers;
	}
	let time: Value = ($0 + $1 * $2 - start_timeofday) / 10;
	let msg: Value = `Initialized ${this.name} subsystem within ${time} second${time == 1 ? "" : "s"}!`;
	to_chat(rt.world(), `<span class='boldannounce'>${msg}</span>`);
	log_world(msg);
	return time;
});

// subsystem.dm:168
rt.def("/datum/controller/subsystem/proc/stat_entry", function* stat_entry(f: Frame, msg: Value) {
	if (!this.statclick) {
		this.statclick = (yield* new_(T("/obj/effect/statclick/debug"), null, "Initializing...", this));
	}
	if (this.can_fire && !rt.isIn(f, SS_NO_FIRE, this.flags)) {
		msg = `${round(this.cost, 1)}ms|${round(this.tick_usage, 1)}%(${round(this.tick_overrun, 1)}%)|${round(this.ticks, 0.1)}\t${msg}`;
	} else {
		msg = `OFFLINE\t${msg}`;
	}
	let title: Value = this.name;
	if (this.can_fire) {
		title = `[${this.state_letter()}]${title}`;
	}
	stat(title, (yield* this.statclick.update(msg)));
	return f.dot;
}, true);

// subsystem.dm:185
rt.def("/datum/controller/subsystem/proc/state_letter", function state_letter(f: Frame) {
	if (this.state === SS_RUNNING) {
		f.dot = "R";
	} else if (this.state === SS_QUEUED) {
		f.dot = "Q";
	} else if (this.state === SS_PAUSED || this.state === SS_PAUSING) {
		f.dot = "P";
	} else if (this.state === SS_SLEEPING) {
		f.dot = "S";
	} else if (this.state === SS_IDLE) {
		f.dot = "  ";
	}
	return f.dot;
});

// subsystem.dm:200
rt.def("/datum/controller/subsystem/proc/postpone", function postpone(f: Frame, cycles: Value) {
	cycles ??= 1;
	if (!(this.next_fire - rt.worldTime(f) < this.wait)) return f.dot;
	this.next_fire += this.wait * cycles;
	return f.dot;
});

// subsystem.dm:208
rt.def("/datum/controller/subsystem/proc/vv_edit_var", function vv_edit_var(f: Frame, var_name: Value, var_value: Value) {
	if (var_name === "can_fire") {
		if (var_value) {
			this.next_fire = rt.worldTime(f) + this.wait;
		}
	} else if (var_name === "queued_priority") {
		return 0;
	}
	f.dot = parent_proc();
	return f.dot;
}, false);
