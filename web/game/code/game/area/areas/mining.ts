// From code/game/area/areas/mining.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /area/mine/explored/proc/<init>  (code/game/area/areas/mining.dm:18)
rt.def("/area/mine/explored/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ambientsounds", rt.list(rt.rsc("sound/ambience/ambimine.ogg")));
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

// /area/mine/unexplored/proc/<init>  (code/game/area/areas/mining.dm:32)
rt.def("/area/mine/unexplored/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ambientsounds", rt.list(rt.rsc("sound/ambience/ambimine.ogg")));
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

// /area/lavaland/surface/proc/<init>  (code/game/area/areas/mining.dm:101)
rt.def("/area/lavaland/surface/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ambientsounds", rt.list(rt.rsc("sound/ambience/ambilava.ogg")));
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

// /area/lavaland/underground/proc/<init>  (code/game/area/areas/mining.dm:113)
rt.def("/area/lavaland/underground/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ambientsounds", rt.list(rt.rsc("sound/ambience/ambilava.ogg")));
	return f.dot;
});
