// Based on /tg/station's code/controllers/subsystem/machines.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(27, "/datum/controller/subsystem/machines", "/datum/controller/subsystem", {
	processing: null,
	currentrun: null,
	powernets: null,
	name: "Machines",
	init_order: 9,
	flags: 32,
});

// machines.dm:1
rt.def("/datum/controller/subsystem/machines/proc/New", function* New(f: Frame) {
	if (GLOB.SSmachines != this) {
		if (rt.istype(GLOB.SSmachines, T("/datum/controller/subsystem/machines"))) {
			yield* this.Recover();
			yield* qdel(GLOB.SSmachines);
		}
		GLOB.SSmachines = this;
	}
	this.PreInit();
	return f.dot;
}, true);

// machines.dm:5
rt.def("/datum/controller/subsystem/machines/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.processing = list();

	this.currentrun = list();

	this.powernets = list();
	return f.dot;
});

// machines.dm:10
rt.def("/datum/controller/subsystem/machines/proc/Initialize", function* Initialize(f: Frame) {
	yield* this.makepowernets();
	yield* this.fire();
	yield* parent_proc();
	return f.dot;
}, true);

// machines.dm:15
rt.def("/datum/controller/subsystem/machines/proc/makepowernets", function* makepowernets(f: Frame) {
	let PN: Value = null, PC: Value = null, NewPN: Value = null;
	for (PN of each(this.powernets, T("/datum/powernet"))) {
		yield* qdel(PN);
	}
	this.powernets.Cut();
	for (PC of each(GLOB.cable_list, T("/obj/structure/cable"))) {
		if (!PC.powernet) {
			yield* (NewPN = (yield* new_(T("/datum/powernet")))).add_cable(PC);
			yield* propagate_network(PC, PC.powernet);
		}
	}
	return f.dot;
}, true);

// machines.dm:26
rt.def("/datum/controller/subsystem/machines/proc/stat_entry", function* stat_entry(f: Frame) {
	yield* parent_proc(`M:${rt.len(f, this.processing)}|PN:${rt.len(f, this.powernets)}`);
	return f.dot;
}, true);

// machines.dm:30
rt.def("/datum/controller/subsystem/machines/proc/fire", function fire(f: Frame, resumed: Value) {
	let Powernet: Value = null, thing: Value = null;
	let $e: any;
	resumed ??= 0;
	if (!resumed) {
		for (Powernet of each(this.powernets, T("/datum/powernet"))) {
			Powernet.reset();
		}
		this.currentrun = this.processing.Copy();
	}
	let currentrun: Value = this.currentrun;
	let seconds: Value = this.wait * 0.1;
	while (rt.len(f, currentrun)) {
		thing = rt.index(currentrun, rt.len(f, currentrun));
		currentrun.len--;
		if (thing && thing.process(seconds) != PROCESS_KILL) {
			if (thing.use_power) {
				thing.auto_use_power();
			}
		} else {
			this.processing -= thing;
			if (thing) {
				thing.isprocessing = 0;
			}
		}
		if (rt.tickUsage(f) > GLOB.current_ticklimit || this.state != 2 ? this.pause() : 0) {
			return f.dot;
		}
	}
	return f.dot;
});

// machines.dm:53
rt.def("/datum/controller/subsystem/machines/proc/setup_template_powernets", function* setup_template_powernets(f: Frame, cables: Value) {
	let A: Value = null, PC: Value = null, NewPN: Value = null;
	for (A of each(cables)) {
		if (!(PC = A).powernet) {
			yield* (NewPN = (yield* new_(T("/datum/powernet")))).add_cable(PC);
			yield* propagate_network(PC, PC.powernet);
		}
	}
	return f.dot;
}, true);

// machines.dm:61
rt.def("/datum/controller/subsystem/machines/proc/Recover", function Recover(f: Frame) {
	if (rt.istype(GLOB.SSmachines.processing, T("/list"))) {
		this.processing = GLOB.SSmachines.processing;
	}
	if (!rt.istype(GLOB.SSmachines.powernets, T("/list"))) return f.dot;
	this.powernets = GLOB.SSmachines.powernets;
	return f.dot;
});
