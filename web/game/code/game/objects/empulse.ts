// From code/game/objects/empulse.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/empulse  (code/game/objects/empulse.dm:2)  may sleep
rt.def("/proc/empulse", function* empulse(f: Frame, epicenter: Value, heavy_range: Value, light_range: Value, log: Value) {
	let A: Value = null, _T: Value = null, distance: Value = null;
	let $e: any;
	f.vars = () => [epicenter, heavy_range, light_range, log, A, _T, distance, $e];
	if (live(log) === null) {
		log = 0;
	}
	if (!truthy(live(epicenter))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [live(epicenter)])))) {
		epicenter = rt.getStep(f, rt.fv(f, "loc", live(epicenter)), 0);
	}
	if (truthy(live(log))) {
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("EMP with size (＀, ＀) in area ＀ ", [live(heavy_range), live(light_range), rt.gv(f, "name", rt.fv(f, "loc", live(epicenter)))])]);
		yield* g.call(f, P("/proc/log_game"), null, [fmt("EMP with size (＀, ＀) in area ＀ ", [live(heavy_range), live(light_range), rt.gv(f, "name", rt.fv(f, "loc", live(epicenter)))])]);
	}
	if (rt.gt(live(heavy_range), 1)) {
		yield* g.new_(f, T("/obj/effect/temp_visual/emp/pulse"), [live(epicenter)]);
	}
	if (rt.gt(live(heavy_range), live(light_range))) {
		light_range = live(heavy_range);
	}
	A = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/spiral_range"), null, [live(light_range), live(epicenter)])));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		_T = live(A);
		if (rt.lt((distance = (yield* g.call(f, P("/proc/get_dist"), null, [live(epicenter), live(_T)]))), 0)) {
			distance = 0;
		}
		if (rt.lt(live(distance), live(heavy_range))) {
			yield* g.callName(f, live(_T), "emp_act", [1]);
		} else {
			if (isEqual(live(distance), live(heavy_range))) {
				if (truthy(rt.op(f, "Prob", [], [50]))) {
					yield* g.callName(f, live(_T), "emp_act", [1]);
				} else {
					yield* g.callName(f, live(_T), "emp_act", [2]);
				}
			} else {
				if (rt.le(live(distance), live(light_range))) {
					yield* g.callName(f, live(_T), "emp_act", [2]);
				}
			}
		}
	}
	rt.endFor(f, 0);
	return 1;
}, true);
