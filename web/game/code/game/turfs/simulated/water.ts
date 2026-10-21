// From code/game/turfs/simulated/water.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4799, "/turf/open/water", "/turf/open", {
	slowdown: 1,
	wet: 1,
	name: "water",
	desc: "Shallow water.",
	icon: rt.rsc("icons/turf/floors.dmi"),
	icon_state: "riverwater",
	baseturf: rt.typePath("/turf/open/chasm/straight_down/lava_land_surface"),
	initial_gas_mix: "o2=14;n2=23;TEMP=300",
	planetary_atmos: 1,
});

// /turf/open/water/proc/HandleWet  (code/game/turfs/simulated/water.dm:13)  may sleep
rt.def("/turf/open/water/proc/HandleWet", function* HandleWet(f: Frame) {
	if (isEqual(rt.sv(f, "wet"), 1)) {
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "MakeSlippery", 1);
	return f.dot;
}, true);
