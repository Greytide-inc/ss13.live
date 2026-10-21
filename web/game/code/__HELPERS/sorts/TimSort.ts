// From code/__HELPERS/sorts/TimSort.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/sortTim  (code/__HELPERS/sorts/TimSort.dm:3)  may sleep
rt.def("/proc/sortTim", function* sortTim(f: Frame, L: Value, cmp: Value, associative: Value, fromIndex: Value, toIndex: Value) {
	f.vars = () => [L, cmp, associative, fromIndex, toIndex];
	if (live(cmp) === null) {
		cmp = P("/proc/cmp_numeric_asc");
	}
	if (live(fromIndex) === null) {
		fromIndex = 1;
	}
	if (live(toIndex) === null) {
		toIndex = 0;
	}
	if ((truthy(live(L)) && rt.ge(rt.len(f, live(L)), 2))) {
		fromIndex = rt.modulus(live(fromIndex), rt.len(f, live(L)));
		toIndex = rt.modulus(live(toIndex), add(rt.len(f, live(L)), 1));
		if (rt.le(live(fromIndex), 0)) {
			fromIndex = rt.modify(live(fromIndex), rt.len(f, live(L)), add);
		}
		if (rt.le(live(toIndex), 0)) {
			toIndex = rt.modify(live(toIndex), add(rt.len(f, live(L)), 1), add);
		}
		rt.setFv(f, "L", rt.gl("sortInstance"), live(L));
		rt.setFv(f, "cmp", rt.gl("sortInstance"), live(cmp));
		rt.setFv(f, "associative", rt.gl("sortInstance"), live(associative));
		yield* g.callName(f, rt.gl("sortInstance"), "timSort", [live(fromIndex), live(toIndex)]);
	}
	return live(L);
}, true);
