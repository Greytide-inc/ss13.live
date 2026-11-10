// Based on BYOND's Types/Regex.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(13812, "/regex", "/datum", {
	flags: null,
	group: null,
	index: null,
	match: null,
	name: null,
	next: null,
	text: null,
});

// Regex.dm:13
rt.def("/regex/proc/New", function New(f: Frame, pattern: Value, flags: Value) {
	let Regex: Value = null;
	if (rt.istype(pattern, T("/regex"))) {
		Regex = pattern;
		this.name = Regex.name;
		this.flags = Regex.flags;
	} else {
		this.name = pattern;
		this.flags = flags;
	}
	return f.dot;
});
