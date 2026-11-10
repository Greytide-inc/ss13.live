// Based on /tg/station's code/game/area/areas/mining.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(13618, "/area/mine/explored", "/area/mine", {
	music: null,
	always_unpowered: 1,
	requires_power: 1,
	poweralm: 0,
	power_environ: 0,
	power_equip: 0,
	power_light: 0,
	outdoors: 1,
	ambientsounds: null,
	flags: 0,
	name: "Mine",
	icon_state: "explored",
});

// mining.dm:18
rt.def("/area/mine/explored/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.ambientsounds = list(rt.rsc("sound/ambience/ambimine.ogg"));
	return f.dot;
});

rt.type(13619, "/area/mine/unexplored", "/area/mine", {
	music: null,
	always_unpowered: 1,
	requires_power: 1,
	poweralm: 0,
	power_environ: 0,
	power_equip: 0,
	power_light: 0,
	outdoors: 1,
	ambientsounds: null,
	flags: 0,
	name: "Mine",
	icon_state: "unexplored",
});

// mining.dm:32
rt.def("/area/mine/unexplored/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.ambientsounds = list(rt.rsc("sound/ambience/ambimine.ogg"));
	return f.dot;
});

rt.type(13635, "/area/lavaland/surface", "/area/lavaland", {
	music: null,
	always_unpowered: 1,
	poweralm: 0,
	power_environ: 0,
	power_equip: 0,
	power_light: 0,
	requires_power: 1,
	ambientsounds: null,
	name: "Lavaland",
	icon_state: "explored",
});

// mining.dm:101
rt.def("/area/lavaland/surface/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.ambientsounds = list(rt.rsc("sound/ambience/ambilava.ogg"));
	return f.dot;
});

rt.type(13640, "/area/lavaland/underground", "/area/lavaland", {
	music: null,
	always_unpowered: 1,
	requires_power: 1,
	poweralm: 0,
	power_environ: 0,
	power_equip: 0,
	power_light: 0,
	ambientsounds: null,
	name: "Lavaland Caves",
	icon_state: "unexplored",
});

// mining.dm:113
rt.def("/area/lavaland/underground/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.ambientsounds = list(rt.rsc("sound/ambience/ambilava.ogg"));
	return f.dot;
});
