// From code/modules/holodeck/turfs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4768, "/turf/open/floor/holofloor", "/turf/open/floor", {
	broken_states: null,
	burnt_states: null,
	icon_state: "floor",
	thermal_conductivity: 0,
	flags: 0,
});

// /turf/open/floor/holofloor/proc/<init>  (code/modules/holodeck/turfs.dm:4)
rt.def("/turf/open/floor/holofloor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "broken_states", rt.list("engine"));
	$0 = $0;
	rt.setSv(f, "burnt_states", rt.list("engine"));
	return f.dot;
});

rt.type(4776, "/turf/open/floor/holofloor/asteroid", "/turf/open/floor/holofloor", {
	name: "asteroid sand",
	icon_state: "asteroid",
	icon: rt.rsc("icons/turf/floors.dmi"),
});

// /turf/open/floor/holofloor/asteroid/proc/Initialize  (code/modules/holodeck/turfs.dm:46)  may sleep
rt.def("/turf/open/floor/holofloor/asteroid/proc/Initialize", function* Initialize(f: Frame) {
	rt.setSv(f, "icon_state", fmt("asteroid＀", [(yield* g.call(f, P("/proc/rand"), null, [0, 12]))]));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(4777, "/turf/open/floor/holofloor/basalt", "/turf/open/floor/holofloor", {
	name: "basalt",
	icon_state: "basalt0",
});

// /turf/open/floor/holofloor/basalt/proc/Initialize  (code/modules/holodeck/turfs.dm:54)  may sleep
rt.def("/turf/open/floor/holofloor/basalt/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.op(f, "Prob", [], [15]))) return f.dot;
	rt.setSv(f, "icon_state", fmt("basalt＀", [(yield* g.call(f, P("/proc/rand"), null, [0, 12]))]));
	yield* g.call(f, P("/proc/set_basalt_light"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(4778, "/turf/open/floor/holofloor/space", "/turf/open/floor/holofloor", {
	name: "Space",
	icon: rt.rsc("icons/turf/space.dmi"),
	icon_state: "0",
});

// /turf/open/floor/holofloor/space/proc/Initialize  (code/modules/holodeck/turfs.dm:65)  may sleep
rt.def("/turf/open/floor/holofloor/space/proc/Initialize", function* Initialize(f: Frame) {
	rt.setSv(f, "icon_state", fmt("＀", [rt.modulus(rt.bitXor(add(rt.sv(f, "x"), rt.sv(f, "y")), add(rt.op(f, "BitNot", [], [multiply(rt.sv(f, "x"), rt.sv(f, "y"))]), rt.sv(f, "z"))), 25)]));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(4779, "/turf/open/floor/holofloor/hyperspace", "/turf/open/floor/holofloor", {
	name: "hyperspace",
	icon: rt.rsc("icons/turf/space.dmi"),
	icon_state: "speedspace_ns_1",
});

// /turf/open/floor/holofloor/hyperspace/proc/Initialize  (code/modules/holodeck/turfs.dm:74)  may sleep
rt.def("/turf/open/floor/holofloor/hyperspace/proc/Initialize", function* Initialize(f: Frame) {
	rt.setSv(f, "icon_state", fmt("speedspace_ns_＀", [add(rt.modulus(add(add(rt.sv(f, "x"), multiply(5, rt.sv(f, "y"))), multiply(add(rt.modulus(rt.sv(f, "y"), 2), 1), 7)), 15), 1)]));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(4780, "/turf/open/floor/holofloor/hyperspace/ns", "/turf/open/floor/holofloor/hyperspace", {});

// /turf/open/floor/holofloor/hyperspace/ns/proc/Initialize  (code/modules/holodeck/turfs.dm:78)  may sleep
rt.def("/turf/open/floor/holofloor/hyperspace/ns/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "icon_state", fmt("speedspace_ns_＀", [add(rt.modulus(add(add(rt.sv(f, "x"), multiply(5, rt.sv(f, "y"))), multiply(add(rt.modulus(rt.sv(f, "y"), 2), 1), 7)), 15), 1)]));
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

// /turf/open/floor/holofloor/carpet/proc/<init>  (code/modules/holodeck/turfs.dm:87)
rt.def("/turf/open/floor/holofloor/carpet/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "broken_states", rt.list("damaged"));
	return f.dot;
});

// /turf/open/floor/holofloor/carpet/proc/Initialize  (code/modules/holodeck/turfs.dm:92)  may sleep
rt.def("/turf/open/floor/holofloor/carpet/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/turf/open/floor/holofloor/carpet/proc/update_icon")])), 1]);
	return f.dot;
}, true);

// /turf/open/floor/holofloor/carpet/proc/update_icon  (code/modules/holodeck/turfs.dm:96)
rt.def("/turf/open/floor/holofloor/carpet/proc/update_icon", function update_icon(f: Frame) {
	if (!truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return 0;
	}
	if (!truthy(rt.sv(f, "intact"))) return f.dot;
	rt.call(f, P("/proc/queue_smooth"), null, [live(f.src)]);
	return f.dot;
});
