// From code/modules/events/prison_break.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(317, "/datum/round_event/grey_tide", "/datum/round_event", {
	areasToOpen: null,
	severity: 1,
	potential_areas: null,
	announceWhen: 50,
	endWhen: 20,
});

// /datum/round_event/grey_tide/proc/<init>  (code/modules/events/prison_break.dm:10)
rt.def("/datum/round_event/grey_tide/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "areasToOpen", rt.list());
	$0 = $0;
	rt.setSv(f, "potential_areas", rt.list(T("/area/bridge"), T("/area/engine"), T("/area/medical"), T("/area/security"), T("/area/quartermaster"), T("/area/science")));
	return f.dot;
});

// /datum/round_event/grey_tide/proc/setup  (code/modules/events/prison_break.dm:21)
rt.def("/datum/round_event/grey_tide/proc/setup", function setup(f: Frame) {
	let i: Value = null, picked_area: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [i, picked_area, A, $e];
	rt.setSv(f, "announceWhen", rt.call(f, P("/proc/rand"), null, [50, 60]));
	rt.setSv(f, "endWhen", rt.call(f, P("/proc/rand"), null, [20, 30]));
	rt.setSv(f, "severity", rt.call(f, P("/proc/rand"), null, [1, 3]));
	i = null;
	rt.forRange(f, 0, 1, rt.sv(f, "severity"), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		picked_area = rt.call(f, P("/proc/pick_n_take"), null, [rt.sv(f, "potential_areas")]);
		A = null;
		rt.forList(f, 1, rt.world(), T("/area"));
		while (($e = rt.next(f, 1)) !== undefined) {
			A = $e;
			if (truthy(rt.op(f, "IsType", [], [live(A), live(picked_area)]))) {
				rt.modSrcVar(f, "areasToOpen", live(A), add);
			}
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/round_event/grey_tide/proc/announce  (code/modules/events/prison_break.dm:32)  may sleep
rt.def("/datum/round_event/grey_tide/proc/announce", function* announce(f: Frame) {
	if ((truthy(rt.sv(f, "areasToOpen")) && rt.gt(rt.len(f, rt.sv(f, "areasToOpen")), 0))) {
		yield* g.call(f, P("/proc/priority_announce"), null, [fmt("Gr3y.T1d3 virus detected in ＀ door subroutines. Severity level of ＀. Recommend station AI involvement.", [(yield* g.call(f, P("/proc/station_name"), null, [])), rt.sv(f, "severity")]), "Security Alert"]);
	} else {
		yield* g.call(f, P("/proc/log_world"), null, ["ERROR: Could not initate grey-tide. No areas in the list!"]);
		yield* g.srcCall(f, "kill");
	}
	return f.dot;
}, true);

// /datum/round_event/grey_tide/proc/start  (code/modules/events/prison_break.dm:40)
rt.def("/datum/round_event/grey_tide/proc/start", function start(f: Frame) {
	let A: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [A, L, $e];
	A = null;
	rt.forList(f, 0, rt.sv(f, "areasToOpen"), T("/area"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		L = null;
		rt.forList(f, 1, live(A), T("/obj/machinery/light"));
		while (($e = rt.next(f, 1)) !== undefined) {
			L = $e;
			rt.callName(f, live(L), "flicker", [10]);
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/round_event/grey_tide/proc/end  (code/modules/events/prison_break.dm:45)  may sleep
rt.def("/datum/round_event/grey_tide/proc/end", function* end(f: Frame) {
	let A: Value = null, O: Value = null, temp: Value = null;
	let $e: any;
	f.vars = () => [A, O, temp, $e];
	A = null;
	rt.forList(f, 0, rt.sv(f, "areasToOpen"), T("/area"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		O = null;
		rt.forList(f, 1, live(A), T("/obj"));
		while (($e = rt.next(f, 1)) !== undefined) {
			O = $e;
			if (truthy((rt.istype(live(O), T("/obj/machinery/power/apc")) ? 1 : 0))) {
				yield* g.callName(f, (temp = live(O)), "overload_lighting", []);
			} else {
				if (truthy((rt.istype(live(O), T("/obj/structure/closet/secure_closet")) ? 1 : 0))) {
					rt.setFv(f, "locked", (temp = live(O)), 0);
					yield* g.callName(f, live(temp), "update_icon", []);
				} else {
					if (truthy((rt.istype(live(O), T("/obj/machinery/door/airlock")) ? 1 : 0))) {
						yield* g.callName(f, (temp = live(O)), "prison_open", []);
					} else {
						if (truthy((rt.istype(live(O), T("/obj/machinery/door_timer")) ? 1 : 0))) {
							yield* g.callName(f, (temp = live(O)), "timer_end", ["forced", 1], rt.Args.Named);
						}
					}
				}
			}
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
