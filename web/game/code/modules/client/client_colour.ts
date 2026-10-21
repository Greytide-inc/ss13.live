// From code/modules/client/client_colour.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/proc/add_client_colour  (code/modules/client/client_colour.dm:30)  may sleep
rt.def("/mob/proc/add_client_colour", function* add_client_colour(f: Frame, colour_type: Value) {
	let CC: Value = null;
	f.vars = () => [colour_type, CC];
	if (!truthy((yield* g.call(f, P("/proc/ispath"), null, [live(colour_type), T("/datum/client_colour")])))) {
		return live(f.dot);
	}
	(rt.modSrcVar(f, "client_colours", (CC = (yield* g.new_(f, live(colour_type), []))), rt.bitOr));
	yield* g.call(f, P("/proc/sortTim"), null, [rt.sv(f, "client_colours"), P("/proc/cmp_clientcolour_priority")]);
	yield* g.srcCall(f, "update_client_colour");
	return f.dot;
}, true);

// /mob/proc/remove_client_colour  (code/modules/client/client_colour.dm:44)  may sleep
rt.def("/mob/proc/remove_client_colour", function* remove_client_colour(f: Frame, colour_type: Value) {
	let cc: Value = null, CC: Value = null;
	let $e: any;
	f.vars = () => [colour_type, cc, CC, $e];
	if (!truthy((yield* g.call(f, P("/proc/ispath"), null, [live(colour_type), T("/datum/client_colour")])))) {
		return live(f.dot);
	}
	cc = null;
	rt.forList(f, 0, rt.sv(f, "client_colours"));
	while (($e = rt.next(f, 0)) !== undefined) {
		cc = $e;
		if (isEqual(rt.gv(f, "type", (CC = live(cc))), live(colour_type))) {
			(rt.modSrcVar(f, "client_colours", live(CC), subtract));
			yield* g.call(f, P("/proc/qdel"), null, [live(CC)]);
			break;
		}
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "update_client_colour");
	return f.dot;
}, true);

// /mob/proc/update_client_colour  (code/modules/client/client_colour.dm:61)
rt.def("/mob/proc/update_client_colour", function update_client_colour(f: Frame) {
	let CC: Value = null;
	f.vars = () => [CC];
	if (!truthy(rt.sv(f, "client"))) {
		return live(f.dot);
	}
	rt.setFv(f, "color", rt.sv(f, "client"), "");
	if (!truthy(rt.len(f, rt.sv(f, "client_colours")))) {
		return live(f.dot);
	}
	if (!truthy((CC = rt.index(rt.sv(f, "client_colours"), 1)))) return f.dot;
	rt.setFv(f, "color", rt.sv(f, "client"), rt.fv(f, "colour", live(CC)));
	return f.dot;
});
