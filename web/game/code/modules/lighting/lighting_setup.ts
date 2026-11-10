// Based on /tg/station's code/modules/lighting/lighting_setup.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// lighting_setup.dm:2
rt.def("/proc/create_all_lighting_objects", function* create_all_lighting_objects(f: Frame) {
	let A: Value = null, _T: Value = null;
	for (A of each(rt.world(), T("/area"))) {
		if (!A.dynamic_lighting) {
			continue;
		}
		_T = null;
		for (_T of each(A, T("/turf"))) {
			if (!_T.dynamic_lighting) {
				continue;
			}
			yield* new_(T("/atom/movable/lighting_object"), _T);
			if (rt.tickUsage(f) > GLOB.current_ticklimit) {
				yield* stoplag();
			}
		}
		if (rt.tickUsage(f) > GLOB.current_ticklimit) {
			yield* stoplag();
		}
	}
	return f.dot;
}, true);
