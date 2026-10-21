// From code/modules/lighting/lighting_setup.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/create_all_lighting_objects  (code/modules/lighting/lighting_setup.dm:2)  may sleep
rt.def("/proc/create_all_lighting_objects", function* create_all_lighting_objects(f: Frame) {
	let A: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [A, _T, $e];
	A = null;
	rt.forList(f, 0, rt.world(), T("/area"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (!truthy(rt.fv(f, "dynamic_lighting", live(A)))) {
			continue;
		}
		_T = null;
		rt.forList(f, 1, live(A), T("/turf"));
		while (($e = rt.next(f, 1)) !== undefined) {
			_T = $e;
			if (!truthy(rt.fv(f, "dynamic_lighting", live(_T)))) {
				continue;
			}
			yield* g.new_(f, T("/atom/movable/lighting_object"), [live(_T)]);
			if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
				yield* g.call(f, P("/proc/stoplag"), null, []);
			}
		}
		rt.endFor(f, 1);
		if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
			yield* g.call(f, P("/proc/stoplag"), null, []);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
