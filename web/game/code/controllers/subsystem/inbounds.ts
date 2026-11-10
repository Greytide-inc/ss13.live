// Based on /tg/station's code/controllers/subsystem/inbounds.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(23, "/datum/controller/subsystem/inbounds", "/datum/controller/subsystem", {
	processing: null,
	currentrun: null,
	name: "Inbounds",
	priority: 40,
	flags: 1,
	runlevels: 4,
});

// inbounds.dm:1
rt.def("/datum/controller/subsystem/inbounds/proc/New", function* New(f: Frame) {
	if (GLOB.SSinbounds != this) {
		if (rt.istype(GLOB.SSinbounds, T("/datum/controller/subsystem/inbounds"))) {
			yield* this.Recover();
			yield* qdel(GLOB.SSinbounds);
		}
		GLOB.SSinbounds = this;
	}
	this.PreInit();
	return f.dot;
}, true);

// inbounds.dm:7
rt.def("/datum/controller/subsystem/inbounds/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.processing = list();

	this.currentrun = list();
	return f.dot;
});

// inbounds.dm:11
rt.def("/datum/controller/subsystem/inbounds/proc/stat_entry", function* stat_entry(f: Frame) {
	yield* parent_proc(`P:${rt.len(f, this.processing)}`);
	return f.dot;
}, true);

// inbounds.dm:14
rt.def("/datum/controller/subsystem/inbounds/proc/fire", function* fire(f: Frame, resumed: Value) {
	let thing: Value = null;
	resumed ??= 0;
	if (!resumed) {
		this.currentrun = (yield* this.processing.Copy());
	}
	let currentrun: Value = this.currentrun;
	while (rt.len(f, currentrun)) {
		thing = rt.index(currentrun, rt.len(f, currentrun));
		currentrun.len--;
		if (thing) {
			yield* thing.check_in_bounds(this.wait);
		} else {
			GLOB.SSinbounds.processing -= thing;
		}
		if (rt.tickUsage(f) > GLOB.current_ticklimit || this.state != 2 ? this.pause() : 0) {
			return f.dot;
		}
	}
	return f.dot;
}, true);
