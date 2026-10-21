// From code/game/turfs/simulated/floor/plating/lava.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4526, "/turf/open/floor/plating/lava", "/turf/open/floor/plating", {
	name: "lava",
	icon_state: "lava",
	gender: "plural",
	baseturf: rt.typePath("/turf/open/floor/plating/lava"),
	slowdown: 2,
	light_range: 2,
	light_power: 0.75,
	light_color: "#C48A18",
});

// /turf/open/floor/plating/lava/proc/Entered  (code/game/turfs/simulated/floor/plating/lava.dm:21)  may sleep
rt.def("/turf/open/floor/plating/lava/proc/Entered", function* Entered(f: Frame, AM: Value) {
	f.vars = () => [AM];
	if (!truthy((yield* g.srcCall(f, "burn_stuff", live(AM))))) return f.dot;
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	return f.dot;
}, true);

// /turf/open/floor/plating/lava/proc/hitby  (code/game/turfs/simulated/floor/plating/lava.dm:25)  may sleep
rt.def("/turf/open/floor/plating/lava/proc/hitby", function* hitby(f: Frame, AM: Value) {
	f.vars = () => [AM];
	if (!truthy((yield* g.srcCall(f, "burn_stuff", live(AM))))) return f.dot;
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	return f.dot;
}, true);

// /turf/open/floor/plating/lava/proc/process  (code/game/turfs/simulated/floor/plating/lava.dm:29)  may sleep
rt.def("/turf/open/floor/plating/lava/proc/process", function* process(f: Frame) {
	if (truthy((yield* g.srcCall(f, "burn_stuff")))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	return f.dot;
}, true, { waitfor: false });

// /turf/open/floor/plating/lava/proc/get_smooth_underlay_icon  (code/game/turfs/simulated/floor/plating/lava.dm:42)
rt.def("/turf/open/floor/plating/lava/proc/get_smooth_underlay_icon", function get_smooth_underlay_icon(f: Frame, underlay_appearance: Value, asking_turf: Value, adjacency_dir: Value) {
	rt.setFv(f, "icon", live(underlay_appearance), rt.rsc("icons/turf/floors.dmi"));
	rt.setFv(f, "icon_state", live(underlay_appearance), "basalt");
	return 1;
});

// /turf/open/floor/plating/lava/proc/is_safe  (code/game/turfs/simulated/floor/plating/lava.dm:58)
rt.def("/turf/open/floor/plating/lava/proc/is_safe", function is_safe(f: Frame) {
	let found_safeties: Value = null;
	f.vars = () => [found_safeties];
	return rt.length((found_safeties = rt.call(f, P("/proc/typecache_filter_list"), null, [rt.sv(f, "contents"), rt.gl("lava_safeties_typecache")])));
});

// /turf/open/floor/plating/lava/proc/burn_stuff  (code/game/turfs/simulated/floor/plating/lava.dm:65)  may sleep
rt.def("/turf/open/floor/plating/lava/proc/burn_stuff", function* burn_stuff(f: Frame, AM: Value) {
	let thing_to_check: Value = null, thing: Value = null, O: Value = null, L: Value = null, O_3: Value = null, _live: Value = null;
	let $e: any;
	f.vars = () => [AM, thing_to_check, thing, O, L, O_3, _live, $e];
	f.dot = 0;
	if (truthy((yield* g.srcCall(f, "is_safe")))) {
		return 0;
	}
	thing_to_check = live(f.src);
	if (truthy(live(AM))) {
		thing_to_check = rt.list(live(AM));
	}
	thing = null;
	rt.forList(f, 0, live(thing_to_check));
	while (($e = rt.next(f, 0)) !== undefined) {
		thing = $e;
		if (truthy((rt.istype(live(thing), T("/obj")) ? 1 : 0))) {
			if ((truthy(rt.bitAnd(rt.gv(f, "resistance_flags", (O = live(thing))), 65)) || truthy(rt.fv(f, "throwing", live(O))))) {
				continue;
			}
			f.dot = 1;
			if (truthy(rt.bitAnd(rt.fv(f, "resistance_flags", live(O)), 8))) {
				continue;
			}
			if (!truthy(rt.bitAnd(rt.fv(f, "resistance_flags", live(O)), 4))) {
				(rt.modField(f, live(O), "resistance_flags", 4, rt.bitOr));
			}
			if (truthy(rt.bitAnd(rt.fv(f, "resistance_flags", live(O)), 2))) {
				(rt.modField(f, live(O), "resistance_flags", 16777213, rt.bitAnd));
			}
			if (rt.gt(rt.index(rt.fv(f, "armor", live(O)), "fire"), 50)) {
				rt.setAt(rt.fv(f, "armor", live(O)), "fire", 50);
			}
			yield* g.callName(f, live(O), "fire_act", [10000, 1000]);
		} else {
			if (truthy((rt.istype(live(thing), T("/mob/living")) ? 1 : 0))) {
				f.dot = 1;
				if (truthy(rt.bitAnd(rt.gv(f, "movement_type", (L = live(thing))), 2))) {
					continue;
				}
				if (truthy((rt.isIn(f, "lava", rt.fv(f, "weather_immunities", live(L))) ? 1 : 0))) {
					continue;
				}
				if (truthy(rt.fv(f, "buckled", live(L)))) {
					if (truthy((rt.istype(rt.fv(f, "buckled", live(L)), T("/obj")) ? 1 : 0))) {
						if (truthy(rt.bitAnd(rt.gv(f, "resistance_flags", (O_3 = rt.fv(f, "buckled", live(L)))), 1))) {
							continue;
						}
					}
					if (truthy((rt.istype(rt.fv(f, "buckled", live(L)), T("/mob/living")) ? 1 : 0))) {
						_live = rt.fv(f, "buckled", live(L));
						if (truthy((rt.isIn(f, "lava", rt.fv(f, "weather_immunities", live(_live))) ? 1 : 0))) {
							continue;
						}
					}
				}
				yield* g.callName(f, live(L), "adjustFireLoss", [20]);
				if (truthy(live(L))) {
					yield* g.callName(f, live(L), "adjust_fire_stacks", [20]);
					yield* g.callName(f, live(L), "IgniteMob", []);
				}
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(4528, "/turf/open/floor/plating/lava/smooth", "/turf/open/floor/plating/lava", {
	name: "lava",
	baseturf: rt.typePath("/turf/open/floor/plating/lava/smooth"),
	icon: rt.rsc("icons/turf/floors/lava.dmi"),
	icon_state: "unsmooth",
	smooth: 10,
	canSmoothWith: null,
});

// /turf/open/floor/plating/lava/smooth/proc/<init>  (code/game/turfs/simulated/floor/plating/lava.dm:131)
rt.def("/turf/open/floor/plating/lava/smooth/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", rt.list(T("/turf/open/floor/plating/lava/smooth")));
	return f.dot;
});
