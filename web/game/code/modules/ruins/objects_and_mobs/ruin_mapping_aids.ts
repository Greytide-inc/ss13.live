// From code/modules/ruins/objects_and_mobs/ruin_mapping_aids.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12098, "/obj/effect/baseturf_helper", "/obj/effect", {
	baseturf: rt.typePath("/turf/open/floor/plating/lava/smooth/lava_land_surface"),
	name: "lava baseturf editor",
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "syndballoon",
});

// /obj/effect/baseturf_helper/proc/Initialize  (code/modules/ruins/objects_and_mobs/ruin_mapping_aids.dm:10)  may sleep
rt.def("/obj/effect/baseturf_helper/proc/Initialize", function* Initialize(f: Frame) {
	let thearea: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [thearea, _T, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	thearea = (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]));
	_T = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/get_area_turfs"), null, [live(thearea), rt.sv(f, "z")])), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		if (!isEqual(rt.fv(f, "baseturf", live(_T)), rt.fv(f, "type", live(_T)))) {
			rt.setFv(f, "baseturf", live(_T), rt.sv(f, "baseturf"));
		}
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);
