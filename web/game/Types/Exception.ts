// From Types/Exception.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(13806, "/exception", "/datum", {
	name: null,
	desc: null,
	file: null,
	line: null,
});

// /exception/proc/New  (Types/Exception.dm:10)
rt.def("/exception/proc/New", function New(f: Frame, N: Value, F: Value, L: Value) {
	rt.setSv(f, "name", live(N));
	rt.setSv(f, "file", live(F));
	rt.setSv(f, "line", live(L));
	return f.dot;
});
