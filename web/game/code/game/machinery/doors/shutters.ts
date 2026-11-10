// Based on /tg/station's code/game/machinery/doors/shutters.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(10296, "/obj/machinery/door/poddoor/shutters", "/obj/machinery/door/poddoor", {
	damage_deflection: 20,
	gender: "plural",
	name: "shutters",
	desc: "Heavy duty metal shutters that opens mechanically.",
	icon: rt.rsc("icons/obj/doors/shutters.dmi"),
	layer: 3.1,
});

// shutters.dm:18
rt.def("/obj/machinery/door/poddoor/shutters/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.layer = CLOSED_DOOR_LAYER;
	return f.dot;
}, true);

// shutters.dm:23
rt.def("/obj/machinery/door/poddoor/shutters/proc/open", function* open(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = 0;
	}
	yield* parent_proc();
	this.layer = CLOSED_DOOR_LAYER;
	return f.dot;
}, true, { args: ["ignorepower"] });

// shutters.dm:28
rt.def("/obj/machinery/door/poddoor/shutters/proc/close", function* close(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = 0;
	}
	yield* parent_proc();
	this.layer = CLOSED_DOOR_LAYER;
	return f.dot;
}, true, { args: ["ignorepower"] });
