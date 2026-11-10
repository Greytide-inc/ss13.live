// Based on /tg/station's code/controllers/subsystem/tgui.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(44, "/datum/controller/subsystem/tgui", "/datum/controller/subsystem", {
	currentrun: null,
	open_uis: null,
	processing_uis: null,
	basehtml: null,
	name: "tgui",
	wait: 9,
	flags: 1,
	priority: 110,
	runlevels: 15,
});

// tgui.dm:1
rt.def("/datum/controller/subsystem/tgui/proc/New", function* New(f: Frame) {
	if (GLOB.SStgui != this) {
		if (rt.istype(GLOB.SStgui, T("/datum/controller/subsystem/tgui"))) {
			yield* this.Recover();
			yield* qdel(GLOB.SStgui);
		}
		GLOB.SStgui = this;
	}
	this.PreInit();
	return f.dot;
}, true);

// tgui.dm:8
rt.def("/datum/controller/subsystem/tgui/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.currentrun = list();

	this.open_uis = list();

	this.processing_uis = list();
	return f.dot;
});

// tgui.dm:14
rt.def("/datum/controller/subsystem/tgui/proc/PreInit", function PreInit(f: Frame) {
	this.basehtml = file2text(rt.rsc("tgui/tgui.html"));
	return f.dot;
});

// tgui.dm:17
rt.def("/datum/controller/subsystem/tgui/proc/Shutdown", function* Shutdown(f: Frame) {
	yield* this.close_all_uis();
	return f.dot;
}, true);

// tgui.dm:20
rt.def("/datum/controller/subsystem/tgui/proc/stat_entry", function* stat_entry(f: Frame) {
	yield* parent_proc(`P:${rt.len(f, this.processing_uis)}`);
	return f.dot;
}, true);

// tgui.dm:23
rt.def("/datum/controller/subsystem/tgui/proc/fire", function fire(f: Frame, resumed: Value) {
	let ui: Value = null;
	resumed ??= 0;
	if (!resumed) {
		this.currentrun = this.processing_uis.Copy();
	}
	let currentrun: Value = this.currentrun;
	while (rt.len(f, currentrun)) {
		ui = rt.index(currentrun, rt.len(f, currentrun));
		currentrun.len--;
		if (ui && ui.user && ui.src_object) {
			ui.process();
		} else {
			this.processing_uis.Remove(ui);
		}
		if (rt.tickUsage(f) > GLOB.current_ticklimit || this.state != 2 ? this.pause() : 0) {
			return f.dot;
		}
	}
	return f.dot;
});
