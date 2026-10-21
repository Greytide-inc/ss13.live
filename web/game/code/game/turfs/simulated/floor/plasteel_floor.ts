// From code/game/turfs/simulated/floor/plasteel_floor.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4612, "/turf/open/floor/plasteel", "/turf/open/floor", {
	broken_states: null,
	burnt_states: null,
	icon_state: "floor",
	floor_tile: rt.typePath("/obj/item/stack/tile/plasteel"),
});

// /turf/open/floor/plasteel/proc/update_icon  (code/game/turfs/simulated/floor/plasteel_floor.dm:8)
rt.def("/turf/open/floor/plasteel/proc/update_icon", function update_icon(f: Frame) {
	if (!truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return 0;
	}
	if (!(!truthy(rt.sv(f, "broken")) && !truthy(rt.sv(f, "burnt")))) return f.dot;
	rt.setSv(f, "icon_state", rt.sv(f, "icon_regular_floor"));
	return f.dot;
});
