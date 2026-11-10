// Based on /tg/station's code/game/machinery/doors/unpowered.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(10298, "/obj/machinery/door/unpowered", "/obj/machinery/door", {});

// unpowered.dm:4
rt.def("/obj/machinery/door/unpowered/proc/Bumped", function* Bumped(f: Frame, AM: Value) {
	if (this.locked) {
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// unpowered.dm:12
rt.def("/obj/machinery/door/unpowered/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (this.locked) {
		return f.dot;
	} else {
		return (yield* parent_proc());
	}
}, true);
