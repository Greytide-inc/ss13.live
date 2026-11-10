// Based on /tg/station's code/controllers/subsystem/disease.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(18, "/datum/controller/subsystem/disease", "/datum/controller/subsystem", {
	currentrun: null,
	processing: null,
	diseases: null,
	archive_diseases: null,
	name: "Disease",
	flags: 33,
	runlevels: 12,
}, { global: { list_symptoms: 946 } });

// disease.dm:1
rt.def("/datum/controller/subsystem/disease/proc/New", function* New(f: Frame) {
	if (GLOB.SSdisease != this) {
		if (rt.istype(GLOB.SSdisease, T("/datum/controller/subsystem/disease"))) {
			yield* this.Recover();
			yield* qdel(GLOB.SSdisease);
		}
		GLOB.SSdisease = this;
	}
	this.PreInit();
	return f.dot;
}, true);

// disease.dm:6
rt.def("/datum/controller/subsystem/disease/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.currentrun = list();

	this.processing = list();

	this.archive_diseases = list();
	return f.dot;
});

// disease.dm:15
rt.def("/datum/controller/subsystem/disease/proc/PreInit", function PreInit(f: Frame) {
	if (this.diseases) return f.dot;
	this.diseases = typesof(T("/datum/disease")) - T("/datum/disease");
	return f.dot;
});

// disease.dm:25
rt.def("/datum/controller/subsystem/disease/proc/stat_entry", function* stat_entry(f: Frame, msg: Value) {
	yield* parent_proc(`P:${rt.len(f, this.processing)}`);
	return f.dot;
}, true);

// disease.dm:28
rt.def("/datum/controller/subsystem/disease/proc/fire", function fire(f: Frame, resumed: Value) {
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
			thing.process();
		} else {
			this.processing.Remove(thing);
		}
		if (rt.tickUsage(f) > GLOB.current_ticklimit || this.state != 2 ? this.pause() : 0) {
			return f.dot;
		}
	}
	return f.dot;
});
