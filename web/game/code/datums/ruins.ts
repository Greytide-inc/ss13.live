// From code/datums/ruins.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(756, "/datum/map_template/ruin", "/datum/map_template", {
	id: null,
	description: "In the middle of a clearing in the rockface, there's a chest filled with gold coins with Spanish engravings. How is there a wooden container filled with 18th century coinage in the middle of a lavawracked hellscape? It is clearly a mystery.",
	cost: null,
	allow_duplicates: 1,
	prefix: null,
	suffix: null,
	name: null,
});

// /datum/map_template/ruin/proc/New  (code/datums/ruins.dm:16)  may sleep
rt.def("/datum/map_template/ruin/proc/New", function* New(f: Frame) {
	if ((!truthy(rt.sv(f, "name")) && truthy(rt.sv(f, "id")))) {
		rt.setSv(f, "name", rt.sv(f, "id"));
	}
	rt.setSv(f, "mappath", add(rt.sv(f, "prefix"), rt.sv(f, "suffix")));
	yield* g.callSuper(f, ["path", rt.sv(f, "mappath")], rt.Args.Named);
	return f.dot;
}, true);
