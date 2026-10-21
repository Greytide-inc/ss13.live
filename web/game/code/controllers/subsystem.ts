// From code/controllers/subsystem.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /datum/controller/subsystem/proc/ignite  (code/controllers/subsystem.dm:50)  may sleep
rt.def("/datum/controller/subsystem/proc/ignite", function* ignite(f: Frame, resumed: Value) {
	let QT: Value = null;
	f.vars = () => [resumed, QT];
	if (live(resumed) === null) {
		resumed = 0;
	}
	f.dot = 4;
	yield* g.srcCall(f, "fire", live(resumed));
	f.dot = rt.sv(f, "state");
	if (isEqual(rt.sv(f, "state"), 4)) {
		rt.setSv(f, "state", 0);
	}
	if (!isEqual(rt.sv(f, "state"), 5)) return f.dot;
	QT = rt.sv(f, "queued_time");
	yield* g.srcCall(f, "enqueue");
	rt.setSv(f, "state", 3);
	rt.setSv(f, "queued_time", live(QT));
	return f.dot;
}, true, { waitfor: false });

// /datum/controller/subsystem/proc/fire  (code/controllers/subsystem.dm:64)
rt.def("/datum/controller/subsystem/proc/fire", function fire(f: Frame, resumed: Value) {
	f.vars = () => [resumed];
	if (live(resumed) === null) {
		resumed = 0;
	}
	(rt.modSrcVar(f, "flags", 2, rt.bitOr));
	rt.throw_(f, rt.new_(f, T("/exception"), [fmt("Subsystem ＀(＀) does not fire() but did not set the SS_NO_FIRE flag. Please add the SS_NO_FIRE flag to any subsystem that doesn't fire so it doesn't get added to the processing list and waste cpu.", [live(f.src), rt.sv(f, "type")]), "code/controllers/subsystem.dm", 65]));
	return f.dot;
});

// /datum/controller/subsystem/proc/Destroy  (code/controllers/subsystem.dm:68)
rt.def("/datum/controller/subsystem/proc/Destroy", function Destroy(f: Frame) {
	rt.callSrc(f, "dequeue", []);
	rt.setSv(f, "can_fire", 0);
	(rt.modSrcVar(f, "flags", 2, rt.bitOr));
	(rt.modField(f, rt.gl("Master"), "subsystems", live(f.src), subtract));
	return f.dot;
});

// /datum/controller/subsystem/proc/enqueue  (code/controllers/subsystem.dm:78)
rt.def("/datum/controller/subsystem/proc/enqueue", function enqueue(f: Frame) {
	let SS_priority: Value = null, SS_flags: Value = null, queue_node: Value = null, queue_node_priority: Value = null, queue_node_flags: Value = null;
	f.vars = () => [SS_priority, SS_flags, queue_node, queue_node_priority, queue_node_flags];
	SS_priority = rt.sv(f, "priority");
	SS_flags = rt.sv(f, "flags");
	queue_node = null;
	queue_node_priority = null;
	queue_node_flags = null;
	queue_node = rt.fv(f, "queue_head", rt.gl("Master"));
	while (truthy(live(queue_node))) {
		queue_node_priority = rt.fv(f, "queued_priority", live(queue_node));
		blk57: {
			if (truthy(rt.bitAnd((queue_node_flags = rt.fv(f, "flags", live(queue_node))), 16))) {
				if (!truthy(rt.bitAnd(live(SS_flags), 16))) {
					break blk57;
				}
				if (rt.lt(live(queue_node_priority), live(SS_priority))) {
					break;
				}
			} else {
				if (truthy(rt.bitAnd(live(queue_node_flags), 4))) {
					if (!truthy(rt.bitAnd(live(SS_flags), 4))) {
						break;
					}
					if (rt.lt(live(queue_node_priority), live(SS_priority))) {
						break;
					}
				} else {
					if (!truthy(rt.bitAnd(live(SS_flags), 4))) {
						if (truthy(rt.bitAnd(live(SS_flags), 16))) {
							break;
						}
						if (rt.lt(live(queue_node_priority), live(SS_priority))) {
							break;
						}
					}
				}
			}
		}
		queue_node = rt.fv(f, "queue_next", live(queue_node));
	}
	rt.setSv(f, "queued_time", rt.worldTime(f));
	rt.setSv(f, "queued_priority", live(SS_priority));
	rt.setSv(f, "state", 1);
	if (truthy(rt.bitAnd(live(SS_flags), 4))) {
		rt.modField(f, rt.gl("Master"), "queue_priority_count_bg", live(SS_priority), add);
	} else {
		rt.modField(f, rt.gl("Master"), "queue_priority_count", live(SS_priority), add);
	}
	rt.setSv(f, "queue_next", live(queue_node));
	if (!truthy(live(queue_node))) {
		rt.setSv(f, "queue_prev", rt.fv(f, "queue_tail", rt.gl("Master")));
		if (truthy(rt.fv(f, "queue_tail", rt.gl("Master")))) {
			rt.setFv(f, "queue_next", rt.fv(f, "queue_tail", rt.gl("Master")), live(f.src));
		} else {
			rt.setFv(f, "queue_head", rt.gl("Master"), live(f.src));
		}
		rt.setFv(f, "queue_tail", rt.gl("Master"), live(f.src));
	} else {
		if (isEqual(live(queue_node), rt.fv(f, "queue_head", rt.gl("Master")))) {
			rt.setFv(f, "queue_prev", rt.fv(f, "queue_head", rt.gl("Master")), live(f.src));
			rt.setFv(f, "queue_head", rt.gl("Master"), live(f.src));
			rt.setSv(f, "queue_prev", null);
		} else {
			rt.setFv(f, "queue_next", rt.fv(f, "queue_prev", live(queue_node)), live(f.src));
			rt.setSv(f, "queue_prev", rt.fv(f, "queue_prev", live(queue_node)));
			rt.setFv(f, "queue_prev", live(queue_node), live(f.src));
		}
	}
	return f.dot;
});

// /datum/controller/subsystem/proc/dequeue  (code/controllers/subsystem.dm:140)
rt.def("/datum/controller/subsystem/proc/dequeue", function dequeue(f: Frame) {
	if (truthy(rt.sv(f, "queue_next"))) {
		rt.setFv(f, "queue_prev", rt.sv(f, "queue_next"), rt.sv(f, "queue_prev"));
	}
	if (truthy(rt.sv(f, "queue_prev"))) {
		rt.setFv(f, "queue_next", rt.sv(f, "queue_prev"), rt.sv(f, "queue_next"));
	}
	if (isEqual(live(f.src), rt.fv(f, "queue_tail", rt.gl("Master")))) {
		rt.setFv(f, "queue_tail", rt.gl("Master"), rt.sv(f, "queue_prev"));
	}
	if (isEqual(live(f.src), rt.fv(f, "queue_head", rt.gl("Master")))) {
		rt.setFv(f, "queue_head", rt.gl("Master"), rt.sv(f, "queue_next"));
	}
	rt.setSv(f, "queued_time", 0);
	if (!isEqual(rt.sv(f, "state"), 1)) return f.dot;
	rt.setSv(f, "state", 0);
	return f.dot;
});

// /datum/controller/subsystem/proc/pause  (code/controllers/subsystem.dm:151)
rt.def("/datum/controller/subsystem/proc/pause", function pause(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	f.dot = 1;
	$0 = rt.sv(f, "state");
	if ($0 === 2) {
		rt.setSv(f, "state", 3);
	} else if ($0 === 4) {
		rt.setSv(f, "state", 5);
	}
	return f.dot;
});

// /datum/controller/subsystem/proc/Initialize  (code/controllers/subsystem.dm:160)
rt.def("/datum/controller/subsystem/proc/Initialize", function Initialize(f: Frame, start_timeofday: Value) {
	let time: Value = null, msg: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [time, msg, $0, $1, $2];
	$0 = rt.fv(f, "timeofday", rt.world());
	$1 = 864000;
	if (!isEqual(rt.gl("rollovercheck_last_timeofday"), rt.fv(f, "timeofday", rt.world()))) {
		$2 = rt.call(f, P("/proc/update_midnight_rollover"), null, []);
	} else {
		$2 = rt.gl("midnight_rollovers");
	}
	time = divide(subtract(add($0, multiply($1, $2)), live(start_timeofday)), 10);
	$0 = rt.sv(f, "name");
	$1 = live(time);
	if (isEqual(live(time), 1)) {
		$2 = "";
	} else {
		$2 = "s";
	}
	msg = fmt("Initialized ＀ subsystem within ＀ second＀!", [$0, $1, $2]);
	rt.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("<span class='boldannounce'>＀</span>", [live(msg)])]);
	rt.call(f, P("/proc/log_world"), null, [live(msg)]);
	return live(time);
});

// /datum/controller/subsystem/proc/stat_entry  (code/controllers/subsystem.dm:168)  may sleep
rt.def("/datum/controller/subsystem/proc/stat_entry", function* stat_entry(f: Frame, msg: Value) {
	let title: Value = null;
	f.vars = () => [msg, title];
	if (!truthy(rt.sv(f, "statclick"))) {
		rt.setSv(f, "statclick", (yield* g.new_(f, T("/obj/effect/statclick/debug"), [null, "Initializing...", live(f.src)])));
	}
	if ((truthy(rt.sv(f, "can_fire")) && !truthy((rt.isIn(f, 2, rt.sv(f, "flags")) ? 1 : 0)))) {
		msg = fmt("＀ms|＀%(＀%)|＀\t＀", [(yield* g.call(f, P("/proc/round"), null, [rt.sv(f, "cost"), 1])), (yield* g.call(f, P("/proc/round"), null, [rt.sv(f, "tick_usage"), 1])), (yield* g.call(f, P("/proc/round"), null, [rt.sv(f, "tick_overrun"), 1])), (yield* g.call(f, P("/proc/round"), null, [rt.sv(f, "ticks"), 0.10000000149011612])), live(msg)]);
	} else {
		msg = fmt("OFFLINE\t＀", [live(msg)]);
	}
	title = rt.sv(f, "name");
	if (truthy(rt.sv(f, "can_fire"))) {
		title = fmt("[＀]＀", [(yield* g.srcCall(f, "state_letter")), live(title)]);
	}
	yield* g.call(f, P("/proc/stat"), null, [live(title), (yield* g.callName(f, rt.sv(f, "statclick"), "update", [live(msg)]))]);
	return f.dot;
}, true);

// /datum/controller/subsystem/proc/state_letter  (code/controllers/subsystem.dm:185)
rt.def("/datum/controller/subsystem/proc/state_letter", function state_letter(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.sv(f, "state");
	if ($0 === 2) {
		f.dot = "R";
	} else if ($0 === 1) {
		f.dot = "Q";
	} else if ($0 === 3 || $0 === 5) {
		f.dot = "P";
	} else if ($0 === 4) {
		f.dot = "S";
	} else if ($0 === 0) {
		f.dot = "  ";
	}
	return f.dot;
});

// /datum/controller/subsystem/proc/postpone  (code/controllers/subsystem.dm:200)
rt.def("/datum/controller/subsystem/proc/postpone", function postpone(f: Frame, cycles: Value) {
	f.vars = () => [cycles];
	if (live(cycles) === null) {
		cycles = 1;
	}
	if (!rt.lt(subtract(rt.sv(f, "next_fire"), rt.worldTime(f)), rt.sv(f, "wait"))) return f.dot;
	rt.modSrcVar(f, "next_fire", multiply(rt.sv(f, "wait"), live(cycles)), add);
	return f.dot;
});

// /datum/controller/subsystem/proc/vv_edit_var  (code/controllers/subsystem.dm:208)
rt.def("/datum/controller/subsystem/proc/vv_edit_var", function vv_edit_var(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(f.args[0]);
	if ($0 === "can_fire") {
		if (truthy(live(f.args[1]))) {
			rt.setSv(f, "next_fire", add(rt.worldTime(f), rt.sv(f, "wait")));
		}
	} else if ($0 === "queued_priority") {
		return 0;
	}
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["var_name", "var_value"] });
