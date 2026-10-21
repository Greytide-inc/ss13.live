// From code/game/turfs/simulated/floor/plating/misc_plating.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4535, "/turf/open/floor/plating/abductor", "/turf/open/floor/plating", {
	name: "alien floor",
	icon_state: "alienpod1",
});

// /turf/open/floor/plating/abductor/proc/Initialize  (code/game/turfs/simulated/floor/plating/misc_plating.dm:11)  may sleep
rt.def("/turf/open/floor/plating/abductor/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "icon_state", fmt("alienpod＀", [(yield* g.call(f, P("/proc/rand"), null, [1, 9]))]));
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

// /turf/open/floor/plating/ashplanet/proc/Initialize  (code/game/turfs/simulated/floor/plating/misc_plating.dm:48)  may sleep
rt.def("/turf/open/floor/plating/ashplanet/proc/Initialize", function* Initialize(f: Frame) {
	if (truthy(rt.sv(f, "smooth"))) {
		rt.setSv(f, "pixel_y", -4);
		rt.setSv(f, "pixel_x", -4);
		rt.setSv(f, "icon", rt.sv(f, "smooth_icon"));
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(4523, "/turf/open/floor/plating/ashplanet/ash", "/turf/open/floor/plating/ashplanet", {
	canSmoothWith: null,
	layer: 2.03,
	slowdown: 1,
});

// /turf/open/floor/plating/ashplanet/ash/proc/<init>  (code/game/turfs/simulated/floor/plating/misc_plating.dm:58)
rt.def("/turf/open/floor/plating/ashplanet/ash/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", rt.list(T("/turf/open/floor/plating/ashplanet/ash"), T("/turf/closed")));
	return f.dot;
});

rt.type(4524, "/turf/open/floor/plating/ashplanet/rocky", "/turf/open/floor/plating/ashplanet", {
	smooth_icon: rt.rsc("icons/turf/floors/rocky_ash.dmi"),
	name: "rocky ground",
	icon_state: "rockyash",
	layer: 2.02,
	canSmoothWith: null,
});

// /turf/open/floor/plating/ashplanet/rocky/proc/<init>  (code/game/turfs/simulated/floor/plating/misc_plating.dm:67)
rt.def("/turf/open/floor/plating/ashplanet/rocky/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", rt.list(T("/turf/open/floor/plating/ashplanet/rocky"), T("/turf/closed")));
	return f.dot;
});

rt.type(4525, "/turf/open/floor/plating/ashplanet/wateryrock", "/turf/open/floor/plating/ashplanet", {
	name: "wet rocky ground",
	smooth: null,
	icon_state: "wateryrock",
	slowdown: 2,
});

// /turf/open/floor/plating/ashplanet/wateryrock/proc/Initialize  (code/game/turfs/simulated/floor/plating/misc_plating.dm:76)  may sleep
rt.def("/turf/open/floor/plating/ashplanet/wateryrock/proc/Initialize", function* Initialize(f: Frame) {
	rt.setSv(f, "icon_state", fmt("＀＀", [rt.sv(f, "icon_state"), (yield* g.call(f, P("/proc/rand"), null, [1, 9]))]));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(4538, "/turf/open/floor/plating/beach", "/turf/open/floor/plating", {
	name: "beach",
	icon: rt.rsc("icons/misc/beach.dmi"),
	flags: 0,
});

// /turf/open/floor/plating/beach/proc/ex_act  (code/game/turfs/simulated/floor/plating/misc_plating.dm:86)  may sleep
rt.def("/turf/open/floor/plating/beach/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	f.vars = () => [severity, target];
	yield* g.srcCall(f, "contents_explosion", live(severity), live(target));
	return f.dot;
}, true, { waitfor: false });

rt.type(4543, "/turf/open/floor/plating/ironsand", "/turf/open/floor/plating", {
	name: "iron sand",
	desc: "Like sand, but more <i>metal</i>.",
});

// /turf/open/floor/plating/ironsand/proc/Initialize  (code/game/turfs/simulated/floor/plating/misc_plating.dm:117)  may sleep
rt.def("/turf/open/floor/plating/ironsand/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "icon_state", fmt("ironsand＀", [(yield* g.call(f, P("/proc/rand"), null, [1, 15]))]));
	return f.dot;
}, true);
