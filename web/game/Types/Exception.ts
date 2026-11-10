// Based on BYOND's Types/Exception.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(13806, "/exception", "/datum", {
	name: null,
	desc: null,
	file: null,
	line: null,
});

// Exception.dm:10
rt.def("/exception/proc/New", function New(f: Frame, N: Value, F: Value, L: Value) {
	this.name = N;
	this.file = F;
	this.line = L;
	return f.dot;
});
