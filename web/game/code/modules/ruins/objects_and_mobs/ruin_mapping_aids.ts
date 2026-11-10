// Based on /tg/station's code/modules/ruins/objects_and_mobs/ruin_mapping_aids.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12098, "/obj/effect/baseturf_helper", "/obj/effect", {
	baseturf: rt.typePath("/turf/open/floor/plating/lava/smooth/lava_land_surface"),
	name: "lava baseturf editor",
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "syndballoon",
});

// ruin_mapping_aids.dm:10
rt.def("/obj/effect/baseturf_helper/proc/Initialize", function* Initialize(f: Frame) {
	let _T: Value = null;
	f.dot = (yield* parent_proc());
	let thearea: Value = get_area(this);
	for (_T of each(get_area_turfs(thearea, this.z), T("/turf"))) {
		if (_T.baseturf != _T.type) {
			_T.baseturf = this.baseturf;
		}
	}
	yield* qdel(this);
	return f.dot;
}, true);
