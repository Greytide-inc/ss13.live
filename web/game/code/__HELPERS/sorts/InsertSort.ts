// Based on /tg/station's code/__HELPERS/sorts/InsertSort.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { P } = rt;


// InsertSort.dm:3
rt.def("/proc/sortInsert", function* sortInsert(f: Frame, L: Value, cmp: Value, associative: Value, fromIndex: Value, toIndex: Value) {
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
		yield* GLOB.sortInstance.binarySort(fromIndex, toIndex, fromIndex);
	}
	return L;
}, true);
