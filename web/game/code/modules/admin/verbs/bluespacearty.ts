// From code/modules/admin/verbs/bluespacearty.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /client/proc/bluespace_artillery  (code/modules/admin/verbs/bluespacearty.dm:2)  may sleep
rt.def("/client/proc/bluespace_artillery", function* bluespace_artillery(f: Frame, M: Value) {
	let target: Value = null, _T: Value = null;
	f.vars = () => [M, target, _T];
	if ((!truthy(rt.sv(f, "holder")) || !truthy((yield* g.call(f, P("/proc/check_rights"), null, [8]))))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype((target = live(M)), T("/mob/living")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be used on instances of type /mob/living"]);
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/explosion"), null, [rt.fv(f, "loc", live(target)), 0, 0, 0, 0]);
	if (truthy((rt.istype((_T = rt.getStep(f, live(target), 0)), T("/turf/open/floor")) ? 1 : 0))) {
		if (truthy(rt.op(f, "Prob", [], [80]))) {
			yield* g.callName(f, live(_T), "break_tile_to_plating", []);
		} else {
			yield* g.callName(f, live(_T), "break_tile", []);
		}
	}
	if (rt.le(rt.fv(f, "health", live(target)), 1)) {
		yield* g.callName(f, live(target), "gib", [1, 1]);
	} else {
		yield* g.callName(f, live(target), "adjustBruteLoss", [(yield* g.call(f, P("/proc/min"), null, [99, subtract(rt.fv(f, "health", live(target)), 1)]))]);
		yield* g.callName(f, live(target), "Knockdown", [400]);
		rt.setFv(f, "stuttering", live(target), 20);
	}
	return f.dot;
}, true);
