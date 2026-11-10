// Based on /tg/station's code/controllers/subsystem/mobs.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(30, "/datum/controller/subsystem/mobs", "/datum/controller/subsystem", {
	currentrun: null,
	name: "Mobs",
	priority: 100,
	flags: 33,
	runlevels: 12,
});

// mobs.dm:1
rt.def("/datum/controller/subsystem/mobs/proc/New", function* New(f: Frame) {
	if (GLOB.SSmobs != this) {
		if (rt.istype(GLOB.SSmobs, T("/datum/controller/subsystem/mobs"))) {
			yield* this.Recover();
			yield* qdel(GLOB.SSmobs);
		}
		GLOB.SSmobs = this;
	}
	this.PreInit();
	return f.dot;
}, true);

// mobs.dm:7
rt.def("/datum/controller/subsystem/mobs/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.currentrun = list();
	return f.dot;
});

// mobs.dm:10
rt.def("/datum/controller/subsystem/mobs/proc/stat_entry", function* stat_entry(f: Frame) {
	yield* parent_proc(`P:${rt.len(f, GLOB.mob_list)}`);
	return f.dot;
}, true);

// mobs.dm:14
rt.def("/datum/controller/subsystem/mobs/proc/fire", function fire(f: Frame, resumed: Value) {
	let M: Value = null;
	resumed ??= 0;
	let seconds: Value = this.wait * 0.1;
	if (!resumed) {
		this.currentrun = GLOB.mob_list.Copy();
	}
	let currentrun: Value = this.currentrun;
	let times_fired: Value = this.times_fired;
	while (rt.len(f, currentrun)) {
		M = rt.index(currentrun, rt.len(f, currentrun));
		currentrun.len--;
		if (M) {
			M.Life(seconds, times_fired);
		} else {
			GLOB.mob_list.Remove(M);
		}
		if (rt.tickUsage(f) > GLOB.current_ticklimit || this.state != 2 ? this.pause() : 0) {
			return f.dot;
		}
	}
	return f.dot;
});
