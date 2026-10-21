// From Types/PixLoc.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/pixloc  (Types/PixLoc.dm:13)
rt.def("/proc/pixloc", function pixloc(f: Frame, x: Value, y: Value, z: Value) {
	return rt.new_(f, T("/pixloc"), [live(x), live(y), live(z)]);
});
