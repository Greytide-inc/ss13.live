// Based on /tg/station's code/game/turfs/simulated/floor/plating/misc_plating.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4535, "/turf/open/floor/plating/abductor", "/turf/open/floor/plating", {
	name: "alien floor",
	icon_state: "alienpod1",
});

// misc_plating.dm:11
rt.def("/turf/open/floor/plating/abductor/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	this.icon_state = `alienpod${rand(1, 9)}`;
	return f.dot;
}, true);

rt.type(4522, "/turf/open/floor/plating/ashplanet", "/turf/open/floor/plating", {
	smooth_icon: rt.rsc("icons/turf/floors/ash.dmi"),
	icon: rt.rsc("icons/turf/mining.dmi"),
	name: "ash",
	icon_state: "ash",
	smooth: 10,
	desc: "The ground is covered in volcanic ash.",
	baseturf: rt.typePath("/turf/open/floor/plating/ashplanet/wateryrock"),
	initial_gas_mix: "o2=14;n2=23;TEMP=300",
	planetary_atmos: 1,
});

// misc_plating.dm:48
rt.def("/turf/open/floor/plating/ashplanet/proc/Initialize", function* Initialize(f: Frame) {
	if (this.smooth) {
		this.pixel_y = -4;
		this.pixel_x = -4;
		this.icon = this.smooth_icon;
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(4523, "/turf/open/floor/plating/ashplanet/ash", "/turf/open/floor/plating/ashplanet", {
	canSmoothWith: null,
	layer: 2.03,
	slowdown: 1,
});

// misc_plating.dm:58
rt.def("/turf/open/floor/plating/ashplanet/ash/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = list(T("/turf/open/floor/plating/ashplanet/ash"), T("/turf/closed"));
	return f.dot;
});

rt.type(4524, "/turf/open/floor/plating/ashplanet/rocky", "/turf/open/floor/plating/ashplanet", {
	smooth_icon: rt.rsc("icons/turf/floors/rocky_ash.dmi"),
	name: "rocky ground",
	icon_state: "rockyash",
	layer: 2.02,
	canSmoothWith: null,
});

// misc_plating.dm:67
rt.def("/turf/open/floor/plating/ashplanet/rocky/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = list(T("/turf/open/floor/plating/ashplanet/rocky"), T("/turf/closed"));
	return f.dot;
});

rt.type(4525, "/turf/open/floor/plating/ashplanet/wateryrock", "/turf/open/floor/plating/ashplanet", {
	name: "wet rocky ground",
	smooth: null,
	icon_state: "wateryrock",
	slowdown: 2,
});

// misc_plating.dm:76
rt.def("/turf/open/floor/plating/ashplanet/wateryrock/proc/Initialize", function* Initialize(f: Frame) {
	this.icon_state = `${this.icon_state}${rand(1, 9)}`;
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(4538, "/turf/open/floor/plating/beach", "/turf/open/floor/plating", {
	name: "beach",
	icon: rt.rsc("icons/misc/beach.dmi"),
	flags: 0,
});

// misc_plating.dm:86
rt.def("/turf/open/floor/plating/beach/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	yield* this.contents_explosion(severity, target);
	return f.dot;
}, true, { waitfor: false });

rt.type(4543, "/turf/open/floor/plating/ironsand", "/turf/open/floor/plating", {
	name: "iron sand",
	desc: "Like sand, but more <i>metal</i>.",
});

// misc_plating.dm:117
rt.def("/turf/open/floor/plating/ironsand/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	this.icon_state = `ironsand${rand(1, 15)}`;
	return f.dot;
}, true);
