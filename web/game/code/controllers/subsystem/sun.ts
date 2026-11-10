// Based on /tg/station's code/controllers/subsystem/sun.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(43, "/datum/controller/subsystem/sun", "/datum/controller/subsystem", {
	angle: null,
	dx: null,
	dy: null,
	rate: null,
	solars: null,
	name: "Sun",
	wait: 600,
	flags: 9,
});

// sun.dm:1
rt.def("/datum/controller/subsystem/sun/proc/New", function* New(f: Frame) {
	if (GLOB.SSsun != this) {
		if (rt.istype(GLOB.SSsun, T("/datum/controller/subsystem/sun"))) {
			yield* this.Recover();
			yield* qdel(GLOB.SSsun);
		}
		GLOB.SSsun = this;
	}
	this.PreInit();
	return f.dot;
}, true);

// sun.dm:9
rt.def("/datum/controller/subsystem/sun/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.solars = list();
	return f.dot;
});

// sun.dm:12
rt.def("/datum/controller/subsystem/sun/proc/PreInit", function PreInit(f: Frame) {
	this.angle = rand(0, 360);
	this.rate = rand(50, 200) / 100;
	if (!prob(50)) return f.dot;
	this.rate = -this.rate;
	return f.dot;
});

// sun.dm:18
rt.def("/datum/controller/subsystem/sun/proc/stat_entry", function* stat_entry(f: Frame, msg: Value) {
	yield* parent_proc(`P:${rt.len(f, this.solars)}`);
	return f.dot;
}, true);

// sun.dm:21
rt.def("/datum/controller/subsystem/sun/proc/fire", function* fire(f: Frame) {
	let SC: Value = null;
	this.angle = (360 + this.angle + this.rate * 6) % 360;
	let s: Value = rt.op(f, "Sin", [], [this.angle]);
	let c: Value = rt.op(f, "Cos", [], [this.angle]);
	if (rt.op(f, "Abs", [], [s]) < rt.op(f, "Abs", [], [c])) {
		this.dx = s / rt.op(f, "Abs", [], [c]);
		this.dy = c / rt.op(f, "Abs", [], [c]);
	} else {
		this.dx = s / rt.op(f, "Abs", [], [s]);
		this.dy = c / rt.op(f, "Abs", [], [s]);
	}
	for (SC of each(this.solars, T("/obj/machinery/power/solar_control"))) {
		if (!SC.powernet) {
			yield* this.solars.Remove(SC);
			continue;
		}
		yield* SC.update();
	}
	return f.dot;
}, true);
