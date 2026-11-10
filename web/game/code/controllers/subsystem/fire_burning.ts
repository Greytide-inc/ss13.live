// Based on /tg/station's code/controllers/subsystem/fire_burning.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(20, "/datum/controller/subsystem/fire_burning", "/datum/controller/subsystem", {
	currentrun: null,
	processing: null,
	name: "Fire Burning",
	priority: 40,
	flags: 5,
	runlevels: 12,
});

// fire_burning.dm:1
rt.def("/datum/controller/subsystem/fire_burning/proc/New", function* New(f: Frame) {
	if (GLOB.SSfire_burning != this) {
		if (rt.istype(GLOB.SSfire_burning, T("/datum/controller/subsystem/fire_burning"))) {
			yield* this.Recover();
			yield* qdel(GLOB.SSfire_burning);
		}
		GLOB.SSfire_burning = this;
	}
	this.PreInit();
	return f.dot;
}, true);

// fire_burning.dm:7
rt.def("/datum/controller/subsystem/fire_burning/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.currentrun = list();

	this.processing = list();
	return f.dot;
});

// fire_burning.dm:11
rt.def("/datum/controller/subsystem/fire_burning/proc/stat_entry", function* stat_entry(f: Frame) {
	yield* parent_proc(`P:${rt.len(f, this.processing)}`);
	return f.dot;
}, true);

// fire_burning.dm:15
rt.def("/datum/controller/subsystem/fire_burning/proc/fire", function* fire(f: Frame, resumed: Value) {
	let O: Value = null;
	let $0: any;
	resumed ??= 0;
	if (!resumed) {
		this.currentrun = (yield* this.processing.Copy());
	}
	let currentrun: Value = this.currentrun;
	while (rt.len(f, currentrun)) {
		O = rt.index(currentrun, rt.len(f, currentrun));
		currentrun.len--;
		if (!O || !O || O.gc_destroyed) {
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
		if (rt.bitAnd(O.resistance_flags, 8)) {
			yield* O.take_damage(20, "fire", "fire", 0);
		} else {
			this.processing -= O;
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
