// Based on /tg/station's code/modules/events/prison_break.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(317, "/datum/round_event/grey_tide", "/datum/round_event", {
	areasToOpen: null,
	severity: 1,
	potential_areas: null,
	announceWhen: 50,
	endWhen: 20,
});

// prison_break.dm:10
rt.def("/datum/round_event/grey_tide/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.areasToOpen = list();

	this.potential_areas = list(T("/area/bridge"), T("/area/engine"), T("/area/medical"), T("/area/security"), T("/area/quartermaster"), T("/area/science"));
	return f.dot;
});

// prison_break.dm:21
rt.def("/datum/round_event/grey_tide/proc/setup", function setup(f: Frame) {
	let i: Value = null, picked_area: Value = null, A: Value = null;
	let $e: any;
	this.announceWhen = rand(50, 60);
	this.endWhen = rand(20, 30);
	this.severity = rand(1, 3);
	rt.forRange(f, 0, 1, this.severity, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		picked_area = pick_n_take(this.potential_areas);
		A = null;
		for (A of each(rt.world(), T("/area"))) {
			if (rt.op(f, "IsType", [], [A, picked_area])) {
				this.areasToOpen += A;
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// prison_break.dm:32
rt.def("/datum/round_event/grey_tide/proc/announce", function* announce(f: Frame) {
	if (this.areasToOpen && rt.len(f, this.areasToOpen) > 0) {
		yield* priority_announce(`Gr3y.T1d3 virus detected in ${station_name()} door subroutines. Severity level of ${this.severity}. Recommend station AI involvement.`, "Security Alert");
	} else {
		log_world("ERROR: Could not initate grey-tide. No areas in the list!");
		this.kill();
	}
	return f.dot;
}, true);

// prison_break.dm:40
rt.def("/datum/round_event/grey_tide/proc/start", function start(f: Frame) {
	let A: Value = null, L: Value = null;
	for (A of each(this.areasToOpen, T("/area"))) {
		L = null;
		for (L of each(A, T("/obj/machinery/light"))) {
			L.flicker(10);
		}
	}
	return f.dot;
});

// prison_break.dm:45
rt.def("/datum/round_event/grey_tide/proc/end", function* end(f: Frame) {
	let A: Value = null, O: Value = null, temp: Value = null;
	for (A of each(this.areasToOpen, T("/area"))) {
		O = null;
		for (O of each(A, T("/obj"))) {
			if (rt.istype(O, T("/obj/machinery/power/apc"))) {
				yield* (temp = O).overload_lighting();
			} else if (rt.istype(O, T("/obj/structure/closet/secure_closet"))) {
				(temp = O).locked = 0;
				yield* temp.update_icon();
			} else if (rt.istype(O, T("/obj/machinery/door/airlock"))) {
				yield* (temp = O).prison_open();
			} else if (rt.istype(O, T("/obj/machinery/door_timer"))) {
				yield* (temp = O).timer_end({ forced: 1 });
			}
		}
	}
	return f.dot;
}, true);
