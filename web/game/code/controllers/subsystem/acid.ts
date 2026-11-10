// Based on /tg/station's code/controllers/subsystem/acid.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12, "/datum/controller/subsystem/acid", "/datum/controller/subsystem", {
	currentrun: null,
	processing: null,
	name: "Acid",
	priority: 40,
	flags: 5,
	runlevels: 12,
});

// acid.dm:1
rt.def("/datum/controller/subsystem/acid/proc/New", function* New(f: Frame) {
	if (GLOB.SSacid != this) {
		if (rt.istype(GLOB.SSacid, T("/datum/controller/subsystem/acid"))) {
			yield* this.Recover();
			yield* qdel(GLOB.SSacid);
		}
		GLOB.SSacid = this;
	}
	this.PreInit();
	return f.dot;
}, true);

// acid.dm:7
rt.def("/datum/controller/subsystem/acid/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.currentrun = list();

	this.processing = list();
	return f.dot;
});

// acid.dm:11
rt.def("/datum/controller/subsystem/acid/proc/stat_entry", function* stat_entry(f: Frame) {
	yield* parent_proc(`P:${rt.len(f, this.processing)}`);
	return f.dot;
}, true);

// acid.dm:15
rt.def("/datum/controller/subsystem/acid/proc/fire", function* fire(f: Frame, resumed: Value) {
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
		if (!(O.acid_level && (yield* O.acid_processing()))) {
			O.cut_overlay(GLOB.acid_overlay, 1);
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
