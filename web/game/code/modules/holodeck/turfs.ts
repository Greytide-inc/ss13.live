// Based on /tg/station's code/modules/holodeck/turfs.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(4768, "/turf/open/floor/holofloor", "/turf/open/floor", {
	broken_states: null,
	burnt_states: null,
	icon_state: "floor",
	thermal_conductivity: 0,
	flags: 0,
});

// turfs.dm:4
rt.def("/turf/open/floor/holofloor/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.broken_states = list("engine");

	this.burnt_states = list("engine");
	return f.dot;
});

rt.type(4776, "/turf/open/floor/holofloor/asteroid", "/turf/open/floor/holofloor", {
	name: "asteroid sand",
	icon_state: "asteroid",
	icon: rt.rsc("icons/turf/floors.dmi"),
});

// turfs.dm:46
rt.def("/turf/open/floor/holofloor/asteroid/proc/Initialize", function* Initialize(f: Frame) {
	this.icon_state = `asteroid${rand(0, 12)}`;
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(4777, "/turf/open/floor/holofloor/basalt", "/turf/open/floor/holofloor", {
	name: "basalt",
	icon_state: "basalt0",
});

// turfs.dm:54
rt.def("/turf/open/floor/holofloor/basalt/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	if (!prob(15)) return f.dot;
	this.icon_state = `basalt${rand(0, 12)}`;
	set_basalt_light(this);
	return f.dot;
}, true);

rt.type(4778, "/turf/open/floor/holofloor/space", "/turf/open/floor/holofloor", {
	name: "Space",
	icon: rt.rsc("icons/turf/space.dmi"),
	icon_state: "0",
});

// turfs.dm:65
rt.def("/turf/open/floor/holofloor/space/proc/Initialize", function* Initialize(f: Frame) {
	this.icon_state = `${rt.bitXor(this.x + this.y, rt.op(f, "BitNot", [], [this.x * this.y]) + this.z) % 25}`;
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(4779, "/turf/open/floor/holofloor/hyperspace", "/turf/open/floor/holofloor", {
	name: "hyperspace",
	icon: rt.rsc("icons/turf/space.dmi"),
	icon_state: "speedspace_ns_1",
});

// turfs.dm:74
rt.def("/turf/open/floor/holofloor/hyperspace/proc/Initialize", function* Initialize(f: Frame) {
	this.icon_state = `speedspace_ns_${(this.x + 5 * this.y + (this.y % 2 + 1) * 7) % 15 + 1}`;
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(4780, "/turf/open/floor/holofloor/hyperspace/ns", "/turf/open/floor/holofloor/hyperspace", {});

// turfs.dm:78
rt.def("/turf/open/floor/holofloor/hyperspace/ns/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	this.icon_state = `speedspace_ns_${(this.x + 5 * this.y + (this.y % 2 + 1) * 7) % 15 + 1}`;
	return f.dot;
}, true);

rt.type(4781, "/turf/open/floor/holofloor/carpet", "/turf/open/floor/holofloor", {
	broken_states: null,
	name: "carpet",
	desc: "Electrically inviting.",
	icon: rt.rsc("icons/turf/floors/carpet.dmi"),
	icon_state: "carpet",
	floor_tile: rt.typePath("/obj/item/stack/tile/carpet"),
	smooth: 1,
	canSmoothWith: null,
});

// turfs.dm:87
rt.def("/turf/open/floor/holofloor/carpet/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.broken_states = list("damaged");
	return f.dot;
});

// turfs.dm:92
rt.def("/turf/open/floor/holofloor/carpet/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/turf/open/floor/holofloor/carpet/proc/update_icon"))), 1);
	return f.dot;
}, true);

// turfs.dm:96
rt.def("/turf/open/floor/holofloor/carpet/proc/update_icon", function update_icon(f: Frame) {
	if (!parent_proc()) {
		return 0;
	}
	if (!this.intact) return f.dot;
	queue_smooth(this);
	return f.dot;
});
