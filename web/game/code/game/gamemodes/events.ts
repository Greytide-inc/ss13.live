// Based on /tg/station's code/game/gamemodes/events.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// events.dm:2
rt.def("/proc/power_failure", function* power_failure(f: Frame) {
	let S: Value = null, A: Value = null, skip: Value = null, area_type: Value = null, AT: Value = null, C: Value = null, A_2: Value = null, skip_3: Value = null, area_type_4: Value = null;
	let $e: any;
	yield* priority_announce(`Abnormal activity detected in ${station_name()}'s powernet. As a precautionary measure, the station's power will be shut off for an indeterminate duration.`, "Critical Power Failure", rt.rsc("sound/ai/poweroff.ogg"));
	for (S of each(GLOB.machines, T("/obj/machinery/power/smes"))) {
		if (rt.istype(get_area(S), T("/area/ai_monitored/turret_protected")) || S.z != ZLEVEL_STATION) {
			continue;
		}
		S.charge = 0;
		S.output_level = 0;
		S.output_attempt = 0;
		yield* S.update_icon();
		yield* S.power_change();
	}
	let skipped_areas: Value = list(T("/area/engine/engineering"), T("/area/engine/supermatter"), T("/area/engine/atmospherics_engine"), T("/area/ai_monitored/turret_protected/ai"));
	for (A of each(rt.world(), T("/area"))) {
		if (!A.requires_power || A.always_unpowered) {
			continue;
		}
		skip = 0;
		area_type = null;
		for (area_type of each(skipped_areas)) {
			if (rt.op(f, "IsType", [], [A, area_type])) {
				skip = 1;
				break;
			}
		}
		if (A.contents) {
			AT = null;
			rt.forList(f, 1, A.contents, T("/atom"));
			if (($e = rt.next(f, 1)) !== undefined) {
				AT = $e;
				if (AT.z != ZLEVEL_STATION) {
					skip = 1;
				}
			}
			rt.endFor(f, 1);
		}
		if (skip) {
			continue;
		}
		A.power_light = 0;
		A.power_equip = 0;
		A.power_environ = 0;
		yield* A.power_change();
	}
	for (C of each(GLOB.apcs_list, T("/obj/machinery/power/apc"))) {
		if (C.cell && C.z == ZLEVEL_STATION) {
			A_2 = get_area(C);
			skip_3 = 0;
			area_type_4 = null;
			for (area_type_4 of each(skipped_areas)) {
				if (rt.op(f, "IsType", [], [A_2, area_type_4])) {
					skip_3 = 1;
					break;
				}
			}
			if (skip_3) {
				continue;
			}
			C.cell.charge = 0;
		}
	}
	return f.dot;
}, true);

// events.dm:49
rt.def("/proc/power_restore", function* power_restore(f: Frame) {
	let C: Value = null, S: Value = null, A: Value = null;
	yield* priority_announce(`Power has been restored to ${station_name()}. We apologize for the inconvenience.`, "Power Systems Nominal", rt.rsc("sound/ai/poweron.ogg"));
	for (C of each(GLOB.machines, T("/obj/machinery/power/apc"))) {
		if (C.cell && C.z == ZLEVEL_STATION) {
			C.cell.charge = C.cell.maxcharge;
			C.failure_timer = 0;
		}
	}
	for (S of each(GLOB.machines, T("/obj/machinery/power/smes"))) {
		if (S.z != ZLEVEL_STATION) {
			continue;
		}
		S.charge = S.capacity;
		S.output_level = S.output_level_max;
		S.output_attempt = 1;
		yield* S.update_icon();
		yield* S.power_change();
	}
	for (A of each(rt.world(), T("/area"))) {
		if (!rt.istype(A, T("/area/space")) && !rt.istype(A, T("/area/shuttle")) && !rt.istype(A, T("/area/arrival"))) {
			A.power_light = 1;
			A.power_equip = 1;
			A.power_environ = 1;
			yield* A.power_change();
		}
	}
	return f.dot;
}, true);

// events.dm:71
rt.def("/proc/power_restore_quick", function* power_restore_quick(f: Frame) {
	let S: Value = null;
	yield* priority_announce(`All SMESs on ${station_name()} have been recharged. We apologize for the inconvenience.`, "Power Systems Nominal", rt.rsc("sound/ai/poweron.ogg"));
	for (S of each(GLOB.machines, T("/obj/machinery/power/smes"))) {
		if (S.z != ZLEVEL_STATION) {
			continue;
		}
		S.charge = S.capacity;
		S.output_level = S.output_level_max;
		S.output_attempt = 1;
		yield* S.update_icon();
		yield* S.power_change();
	}
	return f.dot;
}, true);
