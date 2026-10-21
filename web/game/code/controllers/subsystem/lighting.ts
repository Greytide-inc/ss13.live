// From code/controllers/subsystem/lighting.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGloballighting_update_lights  (code/controllers/subsystem/lighting.dm:1)
rt.def("/datum/controller/global_vars/proc/InitGloballighting_update_lights", function InitGloballighting_update_lights(f: Frame) {
	rt.setGl("lighting_update_lights", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "lighting_update_lights", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGloballighting_update_corners  (code/controllers/subsystem/lighting.dm:2)
rt.def("/datum/controller/global_vars/proc/InitGloballighting_update_corners", function InitGloballighting_update_corners(f: Frame) {
	rt.setGl("lighting_update_corners", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "lighting_update_corners", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGloballighting_update_objects  (code/controllers/subsystem/lighting.dm:3)
rt.def("/datum/controller/global_vars/proc/InitGloballighting_update_objects", function InitGloballighting_update_objects(f: Frame) {
	rt.setGl("lighting_update_objects", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "lighting_update_objects", add);
	return f.dot;
});

rt.type(26, "/datum/controller/subsystem/lighting", "/datum/controller/subsystem", {
	initialized: 0,
	name: "Lighting",
	wait: 2,
	init_order: -20,
	flags: 16,
});

// /datum/controller/subsystem/lighting/proc/New  (code/controllers/subsystem/lighting.dm:5)  may sleep
rt.def("/datum/controller/subsystem/lighting/proc/New", function* New(f: Frame) {
	if (!isEqual(rt.gl("SSlighting"), live(f.src))) {
		if (truthy((rt.istype(rt.gl("SSlighting"), T("/datum/controller/subsystem/lighting")) ? 1 : 0))) {
			yield* g.srcCall(f, "Recover");
			yield* g.call(f, P("/proc/qdel"), null, [rt.gl("SSlighting")]);
		}
		rt.setGl("SSlighting", live(f.src));
	}
	yield* g.srcCall(f, "PreInit");
	return f.dot;
}, true);

// /datum/controller/subsystem/lighting/proc/stat_entry  (code/controllers/subsystem/lighting.dm:14)  may sleep
rt.def("/datum/controller/subsystem/lighting/proc/stat_entry", function* stat_entry(f: Frame) {
	yield* g.callSuper(f, [fmt("L:＀|C:＀|O:＀", [rt.len(f, rt.gl("lighting_update_lights")), rt.len(f, rt.gl("lighting_update_corners")), rt.len(f, rt.gl("lighting_update_objects"))])]);
	return f.dot;
}, true);

// /datum/controller/subsystem/lighting/proc/Initialize  (code/controllers/subsystem/lighting.dm:18)  may sleep
rt.def("/datum/controller/subsystem/lighting/proc/Initialize", function* Initialize(f: Frame) {
	let I: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [I, A, $e];
	if (!truthy(rt.sv(f, "initialized"))) {
		if (truthy(rt.fv(f, "starlight", rt.gl("config")))) {
			I = null;
			rt.forList(f, 0, rt.gl("sortedAreas"));
			while (($e = rt.next(f, 0)) !== undefined) {
				I = $e;
				if (isEqual(rt.gv(f, "dynamic_lighting", (A = live(I))), 3)) {
					rt.setFv(f, "luminosity", live(A), 0);
				}
			}
			rt.endFor(f, 0);
		}
		yield* g.call(f, P("/proc/create_all_lighting_objects"), null, []);
		rt.setSv(f, "initialized", 1);
	}
	yield* g.srcCall(f, "fire", 0, 1);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["timeofday"] });

// /datum/controller/subsystem/lighting/proc/fire  (code/controllers/subsystem/lighting.dm:33)  may sleep
rt.def("/datum/controller/subsystem/lighting/proc/fire", function* fire(f: Frame, resumed: Value, init_tick_checks: Value) {
	let original_tick_limit: Value = null, split_tick_phases: Value = null, i: Value = null, L: Value = null, C: Value = null, O: Value = null;
	let $0: any, $e: any;
	f.vars = () => [resumed, init_tick_checks, original_tick_limit, split_tick_phases, i, L, C, O, $0, $e];
	original_tick_limit = rt.gl("current_ticklimit");
	split_tick_phases = 3;
	if (!truthy(live(init_tick_checks))) {
		if (rt.gt(live(split_tick_phases), 1)) {
			rt.setGl("current_ticklimit", add(divide(subtract(live(original_tick_limit), rt.tickUsage(f)), live(split_tick_phases)), rt.tickUsage(f)));
			split_tick_phases = rt.inc(live(split_tick_phases), -1);
		} else {
			rt.setGl("current_ticklimit", live(original_tick_limit));
		}
	}
	i = 0;
	rt.forRange(f, 0, 1, rt.len(f, rt.gl("lighting_update_lights")), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.callName(f, (L = rt.index(rt.gl("lighting_update_lights"), live(i))), "update_corners", []);
		rt.setFv(f, "needs_update", live(L), 0);
		if (truthy(live(init_tick_checks))) {
			if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
				yield* g.call(f, P("/proc/stoplag"), null, []);
			}
		} else {
			if ((rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit")) || !isEqual(rt.fv(f, "state", live(f.src)), 2))) {
				$0 = (yield* g.srcCall(f, "pause"));
			} else {
				$0 = 0;
			}
			if (truthy($0)) {
				break;
			}
		}
	}
	rt.endFor(f, 0);
	if (truthy(live(i))) {
		yield* g.callName(f, rt.gl("lighting_update_lights"), "Cut", [1, add(live(i), 1)]);
		i = 0;
	}
	if (!truthy(live(init_tick_checks))) {
		if (rt.gt(live(split_tick_phases), 1)) {
			rt.setGl("current_ticklimit", add(divide(subtract(live(original_tick_limit), rt.tickUsage(f)), live(split_tick_phases)), rt.tickUsage(f)));
			split_tick_phases = rt.inc(live(split_tick_phases), -1);
		} else {
			rt.setGl("current_ticklimit", live(original_tick_limit));
		}
	}
	rt.forRange(f, 0, 1, rt.len(f, rt.gl("lighting_update_corners")), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.callName(f, (C = rt.index(rt.gl("lighting_update_corners"), live(i))), "update_objects", []);
		rt.setFv(f, "needs_update", live(C), 0);
		if (truthy(live(init_tick_checks))) {
			if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
				yield* g.call(f, P("/proc/stoplag"), null, []);
			}
		} else {
			if ((rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit")) || !isEqual(rt.fv(f, "state", live(f.src)), 2))) {
				$0 = (yield* g.srcCall(f, "pause"));
			} else {
				$0 = 0;
			}
			if (truthy($0)) {
				break;
			}
		}
	}
	rt.endFor(f, 0);
	if (truthy(live(i))) {
		yield* g.callName(f, rt.gl("lighting_update_corners"), "Cut", [1, add(live(i), 1)]);
		i = 0;
	}
	if (!truthy(live(init_tick_checks))) {
		if (rt.gt(live(split_tick_phases), 1)) {
			rt.setGl("current_ticklimit", add(divide(subtract(live(original_tick_limit), rt.tickUsage(f)), live(split_tick_phases)), rt.tickUsage(f)));
			split_tick_phases = rt.inc(live(split_tick_phases), -1);
		} else {
			rt.setGl("current_ticklimit", live(original_tick_limit));
		}
	}
	rt.forRange(f, 0, 1, rt.len(f, rt.gl("lighting_update_objects")), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if ((!truthy((O = rt.index(rt.gl("lighting_update_objects"), live(i)))) || truthy(rt.fv(f, "gc_destroyed", live(O))))) {
			continue;
		}
		yield* g.callName(f, live(O), "update", []);
		rt.setFv(f, "needs_update", live(O), 0);
		if (truthy(live(init_tick_checks))) {
			if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
				yield* g.call(f, P("/proc/stoplag"), null, []);
			}
		} else {
			if ((rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit")) || !isEqual(rt.fv(f, "state", live(f.src)), 2))) {
				$0 = (yield* g.srcCall(f, "pause"));
			} else {
				$0 = 0;
			}
			if (truthy($0)) {
				break;
			}
		}
	}
	rt.endFor(f, 0);
	if (!truthy(live(i))) return f.dot;
	yield* g.callName(f, rt.gl("lighting_update_objects"), "Cut", [1, add(live(i), 1)]);
	return f.dot;
}, true);

// /datum/controller/subsystem/lighting/proc/Recover  (code/controllers/subsystem/lighting.dm:90)
rt.def("/datum/controller/subsystem/lighting/proc/Recover", function Recover(f: Frame) {
	rt.setSv(f, "initialized", rt.fv(f, "initialized", rt.gl("SSlighting")));
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});
