// From code/game/machinery/doors/checkForMultipleDoors.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /obj/machinery/door/proc/checkForMultipleDoors  (code/game/machinery/doors/checkForMultipleDoors.dm:2)
rt.def("/obj/machinery/door/proc/checkForMultipleDoors", function checkForMultipleDoors(f: Frame) {
	let D: Value = null;
	let $e: any;
	f.vars = () => [D, $e];
	if (!truthy(rt.fv(f, "loc", live(f.src)))) {
		return 0;
	}
	D = null;
	rt.forList(f, 0, rt.fv(f, "loc", live(f.src)), T("/obj/machinery/door"));
	while (($e = rt.next(f, 0)) !== undefined) {
		D = $e;
		if (((!truthy((rt.istype(live(D), T("/obj/machinery/door/window")) ? 1 : 0)) && truthy(rt.fv(f, "density", live(D)))) && !isEqual(live(D), live(f.src)))) {
			return 0;
		}
	}
	rt.endFor(f, 0);
	return 1;
});

// /turf/closed/wall/proc/checkForMultipleDoors  (code/game/machinery/doors/checkForMultipleDoors.dm:10)
rt.def("/turf/closed/wall/proc/checkForMultipleDoors", function checkForMultipleDoors(f: Frame) {
	let D: Value = null;
	let $e: any;
	f.vars = () => [D, $e];
	if (!truthy(rt.fv(f, "loc", live(f.src)))) {
		return 0;
	}
	D = null;
	rt.forList(f, 0, rt.locate(rt.fv(f, "x", live(f.src)), rt.fv(f, "y", live(f.src)), rt.fv(f, "z", live(f.src))), T("/obj/machinery/door"));
	while (($e = rt.next(f, 0)) !== undefined) {
		D = $e;
		if ((!truthy((rt.istype(live(D), T("/obj/machinery/door/window")) ? 1 : 0)) && truthy(rt.fv(f, "density", live(D))))) {
			return 0;
		}
	}
	rt.endFor(f, 0);
	return 1;
});
