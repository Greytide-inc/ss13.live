// Based on /tg/station's code/game/turfs/simulated/floor/plasteel_floor.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(4612, "/turf/open/floor/plasteel", "/turf/open/floor", {
	broken_states: null,
	burnt_states: null,
	icon_state: "floor",
	floor_tile: rt.typePath("/obj/item/stack/tile/plasteel"),
});

// plasteel_floor.dm:8
rt.def("/turf/open/floor/plasteel/proc/update_icon", function update_icon(f: Frame) {
	if (!parent_proc()) {
		return 0;
	}
	if (!(!this.broken && !this.burnt)) return f.dot;
	this.icon_state = this.icon_regular_floor;
	return f.dot;
});
