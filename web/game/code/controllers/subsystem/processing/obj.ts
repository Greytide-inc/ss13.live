// Based on /tg/station's code/controllers/subsystem/processing/obj.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(57, "/datum/controller/subsystem/obj", "/datum/controller/subsystem", {
	processing: null,
	currentrun: null,
	name: "Objects",
	priority: 40,
	flags: 1,
});

// obj.dm:1
rt.def("/datum/controller/subsystem/obj/proc/New", function* New(f: Frame) {
	if (GLOB.SSobj != this) {
		if (rt.istype(GLOB.SSobj, T("/datum/controller/subsystem/obj"))) {
			yield* this.Recover();
			yield* qdel(GLOB.SSobj);
		}
		GLOB.SSobj = this;
	}
	this.PreInit();
	return f.dot;
}, true);

// obj.dm:6
rt.def("/datum/controller/subsystem/obj/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.processing = list();

	this.currentrun = list();
	return f.dot;
});

// obj.dm:10
rt.def("/datum/controller/subsystem/obj/proc/stat_entry", function* stat_entry(f: Frame) {
	yield* parent_proc(`P:${rt.len(f, this.processing)}`);
	return f.dot;
}, true);

// obj.dm:13
rt.def("/datum/controller/subsystem/obj/proc/fire", function fire(f: Frame, resumed: Value) {
	let thing: Value = null;
	resumed ??= 0;
	if (!resumed) {
		this.currentrun = this.processing.Copy();
	}
	let currentrun: Value = this.currentrun;
	while (rt.len(f, currentrun)) {
		thing = rt.index(currentrun, rt.len(f, currentrun));
		currentrun.len--;
		if (thing) {
			thing.process(this.wait);
		} else {
			GLOB.SSobj.processing -= thing;
		}
		if (rt.tickUsage(f) > GLOB.current_ticklimit || this.state != 2 ? this.pause() : 0) {
			return f.dot;
		}
	}
	return f.dot;
});
