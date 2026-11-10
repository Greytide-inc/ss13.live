// Based on /tg/station's code/game/machinery/doors/checkForMultipleDoors.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// checkForMultipleDoors.dm:2
rt.def("/obj/machinery/door/proc/checkForMultipleDoors", function checkForMultipleDoors(f: Frame) {
	let D: Value = null;
	if (!this.loc) {
		return 0;
	}
	for (D of each(this.loc, T("/obj/machinery/door"))) {
		if (!rt.istype(D, T("/obj/machinery/door/window")) && D.density && D != this) {
			return 0;
		}
	}
	return 1;
});

// checkForMultipleDoors.dm:10
rt.def("/turf/closed/wall/proc/checkForMultipleDoors", function checkForMultipleDoors(f: Frame) {
	let D: Value = null;
	if (!this.loc) {
		return 0;
	}
	for (D of each(rt.locate(this.x, this.y, this.z), T("/obj/machinery/door"))) {
		if (!rt.istype(D, T("/obj/machinery/door/window")) && D.density) {
			return 0;
		}
	}
	return 1;
});
