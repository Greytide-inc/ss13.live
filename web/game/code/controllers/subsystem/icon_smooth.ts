// Based on /tg/station's code/controllers/subsystem/icon_smooth.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(22, "/datum/controller/subsystem/icon_smooth", "/datum/controller/subsystem", {
	smooth_queue: null,
	name: "Icon Smoothing",
	init_order: -5,
	wait: 1,
	priority: 35,
	flags: 16,
});

// icon_smooth.dm:1
rt.def("/datum/controller/subsystem/icon_smooth/proc/New", function* New(f: Frame) {
	if (GLOB.SSicon_smooth != this) {
		if (rt.istype(GLOB.SSicon_smooth, T("/datum/controller/subsystem/icon_smooth"))) {
			yield* this.Recover();
			yield* qdel(GLOB.SSicon_smooth);
		}
		GLOB.SSicon_smooth = this;
	}
	this.PreInit();
	return f.dot;
}, true);

// icon_smooth.dm:8
rt.def("/datum/controller/subsystem/icon_smooth/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.smooth_queue = list();
	return f.dot;
});

// icon_smooth.dm:11
rt.def("/datum/controller/subsystem/icon_smooth/proc/fire", function fire(f: Frame) {
	let A: Value = null;
	while (rt.len(f, this.smooth_queue)) {
		A = rt.index(this.smooth_queue, rt.len(f, this.smooth_queue));
		this.smooth_queue.len--;
		smooth_icon(A);
		if (rt.tickUsage(f) > GLOB.current_ticklimit || this.state != 2 ? this.pause() : 0) {
			return f.dot;
		}
	}
	if (rt.len(f, this.smooth_queue)) return f.dot;
	this.can_fire = 0;
	return f.dot;
});

// icon_smooth.dm:21
rt.def("/datum/controller/subsystem/icon_smooth/proc/Initialize", function* Initialize(f: Frame) {
	let V: Value = null, A: Value = null;
	smooth_zlevel(1, 1);
	smooth_zlevel(2, 1);
	let queue: Value = this.smooth_queue;
	this.smooth_queue = list();
	for (V of each(queue)) {
		if (!(A = V) || A.z <= 2) {
			continue;
		}
		smooth_icon(A);
		if (rt.tickUsage(f) > GLOB.current_ticklimit) {
			yield* stoplag();
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);
