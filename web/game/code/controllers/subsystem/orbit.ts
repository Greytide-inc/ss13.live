// Based on /tg/station's code/controllers/subsystem/orbit.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(32, "/datum/controller/subsystem/orbit", "/datum/controller/subsystem", {
	currentrun: null,
	processing: null,
	name: "Orbits",
	priority: 35,
	wait: 2,
	flags: 17,
});

// orbit.dm:1
rt.def("/datum/controller/subsystem/orbit/proc/New", function* New(f: Frame) {
	if (GLOB.SSorbit != this) {
		if (rt.istype(GLOB.SSorbit, T("/datum/controller/subsystem/orbit"))) {
			yield* this.Recover();
			yield* qdel(GLOB.SSorbit);
		}
		GLOB.SSorbit = this;
	}
	this.PreInit();
	return f.dot;
}, true);

// orbit.dm:7
rt.def("/datum/controller/subsystem/orbit/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.currentrun = list();

	this.processing = list();
	return f.dot;
});

// orbit.dm:11
rt.def("/datum/controller/subsystem/orbit/proc/stat_entry", function* stat_entry(f: Frame) {
	yield* parent_proc(`P:${rt.len(f, this.processing)}`);
	return f.dot;
}, true);

// orbit.dm:15
rt.def("/datum/controller/subsystem/orbit/proc/fire", function* fire(f: Frame, resumed: Value) {
	let O: Value = null, targetloc: Value = null;
	let $0: any;
	resumed ??= 0;
	if (!resumed) {
		this.currentrun = (yield* this.processing.Copy());
	}
	let currentrun: Value = this.currentrun;
	while (rt.len(f, currentrun)) {
		O = rt.index(currentrun, rt.len(f, currentrun));
		currentrun.len--;
		if (!O) {
			this.processing -= O;
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
		if (!O.orbiter) {
			yield* qdel(O);
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
		if (O.lastprocess >= rt.worldTime(f)) {
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
		if ((targetloc = rt.getStep(f, O.orbiting, 0)) != O.lastloc || O.orbiter.loc != targetloc) {
			yield* O.Check(targetloc);
		}
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
