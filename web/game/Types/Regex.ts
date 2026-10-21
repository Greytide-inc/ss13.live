// From Types/Regex.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(13812, "/regex", "/datum", {
	flags: null,
	group: null,
	index: null,
	match: null,
	name: null,
	next: null,
	text: null,
});

// /regex/proc/New  (Types/Regex.dm:13)
rt.def("/regex/proc/New", function New(f: Frame, pattern: Value, flags: Value) {
	let Regex: Value = null;
	f.vars = () => [Regex];
	if (truthy((rt.istype(live(pattern), T("/regex")) ? 1 : 0))) {
		Regex = live(pattern);
		rt.setFv(f, "name", live(f.src), rt.fv(f, "name", live(Regex)));
		rt.setFv(f, "flags", live(f.src), rt.fv(f, "flags", live(Regex)));
	} else {
		rt.setFv(f, "name", live(f.src), live(pattern));
		rt.setFv(f, "flags", live(f.src), live(flags));
	}
	return f.dot;
});
