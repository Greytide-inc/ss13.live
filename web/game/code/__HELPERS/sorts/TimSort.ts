// Based on /tg/station's code/__HELPERS/sorts/TimSort.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { P } = rt;


// TimSort.dm:3
rt.def("/proc/sortTim", function* sortTim(f: Frame, L: Value, cmp: Value, associative: Value, fromIndex: Value, toIndex: Value) {
	cmp ??= P("/proc/cmp_numeric_asc");
	fromIndex ??= 1;
	toIndex ??= 0;
	if (L && rt.len(f, L) >= 2) {
		fromIndex = fromIndex % rt.len(f, L);
		toIndex = toIndex % (rt.len(f, L) + 1);
		if (fromIndex <= 0) {
			fromIndex += rt.len(f, L);
		}
		if (toIndex <= 0) {
			toIndex += rt.len(f, L) + 1;
		}
		GLOB.sortInstance.L = L;
		GLOB.sortInstance.cmp = cmp;
		GLOB.sortInstance.associative = associative;
		yield* GLOB.sortInstance.timSort(fromIndex, toIndex);
	}
	return L;
}, true);
