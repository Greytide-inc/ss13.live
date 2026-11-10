// Based on /tg/station's code/controllers/subsystem/processing/processing.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(52, "/datum/controller/subsystem/processing", "/datum/controller/subsystem", {
	stat_tag: "P",
	processing: null,
	currentrun: null,
	name: "Processing",
	priority: 25,
	flags: 69,
	wait: 10,
});

// processing.dm:3
rt.def("/datum/controller/subsystem/processing/proc/New", function* New(f: Frame) {
	if (GLOB.SSprocessing != this) {
		if (rt.istype(GLOB.SSprocessing, T("/datum/controller/subsystem/processing"))) {
			yield* this.Recover();
			yield* qdel(GLOB.SSprocessing);
		}
		GLOB.SSprocessing = this;
	}
	this.PreInit();
	return f.dot;
}, true);

// processing.dm:10
rt.def("/datum/controller/subsystem/processing/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.processing = list();

	this.currentrun = list();
	return f.dot;
});

// processing.dm:14
rt.def("/datum/controller/subsystem/processing/proc/stat_entry", function* stat_entry(f: Frame) {
	yield* parent_proc(`${this.stat_tag}:${rt.len(f, this.processing)}`);
	return f.dot;
}, true);

// processing.dm:17
rt.def("/datum/controller/subsystem/processing/proc/fire", function fire(f: Frame, resumed: Value) {
	let thing: Value = null;
	resumed ??= 0;
	if (!resumed) {
		this.currentrun = this.processing.Copy();
	}
	let current_run: Value = this.currentrun;
	while (rt.len(f, current_run)) {
		thing = rt.index(current_run, rt.len(f, current_run));
		current_run.len--;
		if (!thing || thing.gc_destroyed || thing.process(this.wait) == PROCESS_KILL) {
			this.processing -= thing;
		}
		if (rt.tickUsage(f) > GLOB.current_ticklimit || this.state != 2 ? this.pause() : 0) {
			return f.dot;
		}
	}
	return f.dot;
});

// processing.dm:33
rt.def("/datum/proc/process", function process(f: Frame) {
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	return 0;
}, false, { waitfor: false });
