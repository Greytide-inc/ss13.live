// Based on /tg/station's code/controllers/subsystem/processing/flightpacks.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(55, "/datum/controller/subsystem/processing/flightpacks", "/datum/controller/subsystem/processing", {
	flightsuit_processing: 1,
	name: "Flightpack Movement",
	priority: 30,
	wait: 2,
	flags: 49,
	stat_tag: "FM",
});

// flightpacks.dm:1
rt.def("/datum/controller/subsystem/processing/flightpacks/proc/New", function* New(f: Frame) {
	if (GLOB.SSflightpacks != this) {
		if (rt.istype(GLOB.SSflightpacks, T("/datum/controller/subsystem/processing/flightpacks"))) {
			yield* this.Recover();
			yield* qdel(GLOB.SSflightpacks);
		}
		GLOB.SSflightpacks = this;
	}
	this.PreInit();
	return f.dot;
}, true);

// flightpacks.dm:11
rt.def("/datum/controller/subsystem/processing/flightpacks/proc/Initialize", function Initialize(f: Frame) {
	this.sync_flightsuit_processing();
	return f.dot;
});

// flightpacks.dm:14
rt.def("/datum/controller/subsystem/processing/flightpacks/proc/vv_edit_var", function vv_edit_var(f: Frame, var_name: Value, var_value: Value) {
	parent_proc();
	if (var_name === "flightsuit_processing") {
		this.sync_flightsuit_processing();
	}
	return f.dot;
}, false);

// flightpacks.dm:20
rt.def("/datum/controller/subsystem/processing/flightpacks/proc/sync_flightsuit_processing", function sync_flightsuit_processing(f: Frame) {
	let FP: Value = null;
	for (FP of each(this.processing, T("/obj/item/device/flightpack"))) {
		FP.sync_processing(this);
	}
	if (this.flightsuit_processing == 0) {
		this.can_fire = 0;
	} else {
		this.can_fire = 1;
	}
	return f.dot;
});
