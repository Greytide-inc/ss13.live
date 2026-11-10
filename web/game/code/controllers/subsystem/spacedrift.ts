// Based on /tg/station's code/controllers/subsystem/spacedrift.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(40, "/datum/controller/subsystem/spacedrift", "/datum/controller/subsystem", {
	currentrun: null,
	processing: null,
	name: "Space Drift",
	priority: 30,
	wait: 5,
	flags: 33,
	runlevels: 12,
});

// spacedrift.dm:1
rt.def("/datum/controller/subsystem/spacedrift/proc/New", function* New(f: Frame) {
	if (GLOB.SSspacedrift != this) {
		if (rt.istype(GLOB.SSspacedrift, T("/datum/controller/subsystem/spacedrift"))) {
			yield* this.Recover();
			yield* qdel(GLOB.SSspacedrift);
		}
		GLOB.SSspacedrift = this;
	}
	this.PreInit();
	return f.dot;
}, true);

// spacedrift.dm:8
rt.def("/datum/controller/subsystem/spacedrift/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.currentrun = list();

	this.processing = list();
	return f.dot;
});

// spacedrift.dm:12
rt.def("/datum/controller/subsystem/spacedrift/proc/stat_entry", function* stat_entry(f: Frame) {
	yield* parent_proc(`P:${rt.len(f, this.processing)}`);
	return f.dot;
}, true);

// spacedrift.dm:16
rt.def("/datum/controller/subsystem/spacedrift/proc/fire", function* fire(f: Frame, resumed: Value) {
	let AM: Value = null, old_dir: Value = null, old_loc: Value = null;
	let $0: any;
	resumed ??= 0;
	if (!resumed) {
		this.currentrun = (yield* this.processing.Copy());
	}
	let currentrun: Value = this.currentrun;
	while (rt.len(f, currentrun)) {
		AM = rt.index(currentrun, rt.len(f, currentrun));
		currentrun.len--;
		if (!AM) {
			this.processing -= AM;
			if (rt.tickUsage(f) > GLOB.current_ticklimit || this.state != 2) {
				$0 = this.pause();
			} else {
				$0 = 0;
			}
			if ($0) {
				return f.dot;
			}
			continue;
		}
		if (AM.inertia_next_move > rt.worldTime(f)) {
			if (rt.tickUsage(f) > GLOB.current_ticklimit || this.state != 2) {
				$0 = this.pause();
			} else {
				$0 = 0;
			}
			if ($0) {
				return f.dot;
			}
			continue;
		}
		if (!AM.loc || AM.loc != AM.inertia_last_loc || (yield* AM.Process_Spacemove(0))) {
			AM.inertia_dir = 0;
		}
		if (!AM.inertia_dir) {
			AM.inertia_last_loc = null;
			this.processing -= AM;
			if (rt.tickUsage(f) > GLOB.current_ticklimit || this.state != 2) {
				$0 = this.pause();
			} else {
				$0 = 0;
			}
			if ($0) {
				return f.dot;
			}
			continue;
		}
		old_dir = AM.dir;
		old_loc = AM.loc;
		AM.glide_size = max(1, min(32 / max(AM.inertia_move_delay / rt.world().tick_lag, 1), 32));
		AM.inertia_moving = 1;
		yield* step(AM, AM.inertia_dir);
		AM.inertia_moving = 0;
		AM.inertia_next_move = rt.worldTime(f) + AM.inertia_move_delay;
		if (AM.loc == old_loc) {
			AM.inertia_dir = 0;
		}
		yield* AM.setDir(old_dir);
		AM.inertia_last_loc = AM.loc;
		if (rt.tickUsage(f) > GLOB.current_ticklimit || this.state != 2) {
			$0 = this.pause();
		} else {
			$0 = 0;
		}
		if ($0) {
			return f.dot;
		}
	}
	return f.dot;
}, true);
