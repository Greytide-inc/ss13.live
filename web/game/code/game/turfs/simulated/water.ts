// Based on /tg/station's code/game/turfs/simulated/water.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



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

// water.dm:13
rt.def("/turf/open/water/proc/HandleWet", function* HandleWet(f: Frame) {
	if (this.wet == 1) {
		return f.dot;
	}
	yield* parent_proc();
	yield* this.MakeSlippery(TURF_WET_WATER);
	return f.dot;
}, true);
