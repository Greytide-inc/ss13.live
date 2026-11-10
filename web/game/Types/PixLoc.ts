// Based on BYOND's Types/PixLoc.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// PixLoc.dm:13
rt.def("/proc/pixloc", function pixloc(f: Frame, x: Value, y: Value, z: Value) {
	return new_(T("/pixloc"), x, y, z);
});
