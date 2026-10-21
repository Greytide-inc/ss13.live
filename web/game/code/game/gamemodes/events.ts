// From code/game/gamemodes/events.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/power_failure  (code/game/gamemodes/events.dm:2)  may sleep
rt.def("/proc/power_failure", function* power_failure(f: Frame) {
	let S: Value = null, skipped_areas: Value = null, A: Value = null, skip: Value = null, area_type: Value = null, AT: Value = null, C: Value = null, A_2: Value = null, skip_3: Value = null, area_type_4: Value = null;
	let $e: any;
	f.vars = () => [S, skipped_areas, A, skip, area_type, AT, C, A_2, skip_3, area_type_4, $e];
	yield* g.call(f, P("/proc/priority_announce"), null, [fmt("Abnormal activity detected in ＀'s powernet. As a precautionary measure, the station's power will be shut off for an indeterminate duration.", [(yield* g.call(f, P("/proc/station_name"), null, []))]), "Critical Power Failure", rt.rsc("sound/ai/poweroff.ogg")]);
	S = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/power/smes"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		if ((truthy((rt.istype((yield* g.call(f, P("/proc/get_area"), null, [live(S)])), T("/area/ai_monitored/turret_protected")) ? 1 : 0)) || !isEqual(rt.fv(f, "z", live(S)), 2))) {
			continue;
		}
		rt.setFv(f, "charge", live(S), 0);
		rt.setFv(f, "output_level", live(S), 0);
		rt.setFv(f, "output_attempt", live(S), 0);
		yield* g.callName(f, live(S), "update_icon", []);
		yield* g.callName(f, live(S), "power_change", []);
	}
	rt.endFor(f, 0);
	skipped_areas = rt.list(T("/area/engine/engineering"), T("/area/engine/supermatter"), T("/area/engine/atmospherics_engine"), T("/area/ai_monitored/turret_protected/ai"));
	A = null;
	rt.forList(f, 0, rt.world(), T("/area"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if ((!truthy(rt.fv(f, "requires_power", live(A))) || truthy(rt.fv(f, "always_unpowered", live(A))))) {
			continue;
		}
		skip = 0;
		area_type = null;
		rt.forList(f, 1, live(skipped_areas));
		while (($e = rt.next(f, 1)) !== undefined) {
			area_type = $e;
			if (truthy(rt.op(f, "IsType", [], [live(A), live(area_type)]))) {
				skip = 1;
				break;
			}
		}
		rt.endFor(f, 1);
		if (truthy(rt.fv(f, "contents", live(A)))) {
			AT = null;
			rt.forList(f, 1, rt.fv(f, "contents", live(A)), T("/atom"));
			if (($e = rt.next(f, 1)) !== undefined) {
				AT = $e;
				if (!isEqual(rt.fv(f, "z", live(AT)), 2)) {
					skip = 1;
				}
			}
			rt.endFor(f, 1);
		}
		if (truthy(live(skip))) {
			continue;
		}
		rt.setFv(f, "power_light", live(A), 0);
		rt.setFv(f, "power_equip", live(A), 0);
		rt.setFv(f, "power_environ", live(A), 0);
		yield* g.callName(f, live(A), "power_change", []);
	}
	rt.endFor(f, 0);
	C = null;
	rt.forList(f, 0, rt.gl("apcs_list"), T("/obj/machinery/power/apc"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		if ((truthy(rt.fv(f, "cell", live(C))) && isEqual(rt.fv(f, "z", live(C)), 2))) {
			A_2 = (yield* g.call(f, P("/proc/get_area"), null, [live(C)]));
			skip_3 = 0;
			area_type_4 = null;
			rt.forList(f, 1, live(skipped_areas));
			while (($e = rt.next(f, 1)) !== undefined) {
				area_type_4 = $e;
				if (truthy(rt.op(f, "IsType", [], [live(A_2), live(area_type_4)]))) {
					skip_3 = 1;
					break;
				}
			}
			rt.endFor(f, 1);
			if (truthy(live(skip_3))) {
				continue;
			}
			rt.setFv(f, "charge", rt.fv(f, "cell", live(C)), 0);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /proc/power_restore  (code/game/gamemodes/events.dm:49)  may sleep
rt.def("/proc/power_restore", function* power_restore(f: Frame) {
	let C: Value = null, S: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [C, S, A, $e];
	yield* g.call(f, P("/proc/priority_announce"), null, [fmt("Power has been restored to ＀. We apologize for the inconvenience.", [(yield* g.call(f, P("/proc/station_name"), null, []))]), "Power Systems Nominal", rt.rsc("sound/ai/poweron.ogg")]);
	C = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/power/apc"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		if ((truthy(rt.fv(f, "cell", live(C))) && isEqual(rt.fv(f, "z", live(C)), 2))) {
			rt.setFv(f, "charge", rt.fv(f, "cell", live(C)), rt.gv(f, "maxcharge", rt.fv(f, "cell", live(C))));
			rt.setFv(f, "failure_timer", live(C), 0);
		}
	}
	rt.endFor(f, 0);
	S = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/power/smes"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		if (!isEqual(rt.fv(f, "z", live(S)), 2)) {
			continue;
		}
		rt.setFv(f, "charge", live(S), rt.fv(f, "capacity", live(S)));
		rt.setFv(f, "output_level", live(S), rt.fv(f, "output_level_max", live(S)));
		rt.setFv(f, "output_attempt", live(S), 1);
		yield* g.callName(f, live(S), "update_icon", []);
		yield* g.callName(f, live(S), "power_change", []);
	}
	rt.endFor(f, 0);
	A = null;
	rt.forList(f, 0, rt.world(), T("/area"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (((!truthy((rt.istype(live(A), T("/area/space")) ? 1 : 0)) && !truthy((rt.istype(live(A), T("/area/shuttle")) ? 1 : 0))) && !truthy((rt.istype(live(A), T("/area/arrival")) ? 1 : 0)))) {
			rt.setFv(f, "power_light", live(A), 1);
			rt.setFv(f, "power_equip", live(A), 1);
			rt.setFv(f, "power_environ", live(A), 1);
			yield* g.callName(f, live(A), "power_change", []);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /proc/power_restore_quick  (code/game/gamemodes/events.dm:71)  may sleep
rt.def("/proc/power_restore_quick", function* power_restore_quick(f: Frame) {
	let S: Value = null;
	let $e: any;
	f.vars = () => [S, $e];
	yield* g.call(f, P("/proc/priority_announce"), null, [fmt("All SMESs on ＀ have been recharged. We apologize for the inconvenience.", [(yield* g.call(f, P("/proc/station_name"), null, []))]), "Power Systems Nominal", rt.rsc("sound/ai/poweron.ogg")]);
	S = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/power/smes"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		if (!isEqual(rt.fv(f, "z", live(S)), 2)) {
			continue;
		}
		rt.setFv(f, "charge", live(S), rt.fv(f, "capacity", live(S)));
		rt.setFv(f, "output_level", live(S), rt.fv(f, "output_level_max", live(S)));
		rt.setFv(f, "output_attempt", live(S), 1);
		yield* g.callName(f, live(S), "update_icon", []);
		yield* g.callName(f, live(S), "power_change", []);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
