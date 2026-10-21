// From code/modules/admin/verbs/atmosdebug.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /client/proc/atmosscan  (code/modules/admin/verbs/atmosdebug.dm:4)
rt.def("/client/proc/atmosscan", function atmosscan(f: Frame) {
	let plumbing: Value = null, pipe: Value = null;
	let $e: any;
	f.vars = () => [plumbing, pipe, $e];
	if (!truthy(rt.fv(f, "holder", live(f.src)))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.src), "Only administrators may use this command."]);
		return live(f.dot);
	}
	plumbing = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/atmospherics"));
	while (($e = rt.next(f, 0)) !== undefined) {
		plumbing = $e;
		if (truthy(rt.fv(f, "nodealert", live(plumbing)))) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("Unconnected ＀ located at ＀,＀,＀ (＀)", [rt.fv(f, "name", live(plumbing)), rt.fv(f, "x", live(plumbing)), rt.fv(f, "y", live(plumbing)), rt.fv(f, "z", live(plumbing)), rt.call(f, P("/proc/get_area"), null, [rt.fv(f, "loc", live(plumbing))])])]);
		}
	}
	rt.endFor(f, 0);
	pipe = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/atmospherics/pipe/manifold"));
	while (($e = rt.next(f, 0)) !== undefined) {
		pipe = $e;
		if (((!truthy(rt.index(rt.fv(f, "nodes", live(pipe)), 1)) || !truthy(rt.index(rt.fv(f, "nodes", live(pipe)), 2))) || !truthy(rt.index(rt.fv(f, "nodes", live(pipe)), 3)))) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("Unconnected ＀ located at ＀,＀,＀ (＀)", [rt.fv(f, "name", live(pipe)), rt.fv(f, "x", live(pipe)), rt.fv(f, "y", live(pipe)), rt.fv(f, "z", live(pipe)), rt.call(f, P("/proc/get_area"), null, [rt.fv(f, "loc", live(pipe))])])]);
		}
	}
	rt.endFor(f, 0);
	pipe = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/atmospherics/pipe/simple"));
	while (($e = rt.next(f, 0)) !== undefined) {
		pipe = $e;
		if ((!truthy(rt.index(rt.fv(f, "nodes", live(pipe)), 1)) || !truthy(rt.index(rt.fv(f, "nodes", live(pipe)), 2)))) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("Unconnected ＀ located at ＀,＀,＀ (＀)", [rt.fv(f, "name", live(pipe)), rt.fv(f, "x", live(pipe)), rt.fv(f, "y", live(pipe)), rt.fv(f, "z", live(pipe)), rt.call(f, P("/proc/get_area"), null, [rt.fv(f, "loc", live(pipe))])])]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, false, { verb: { name: "Check Plumbing", category: "Mapping" } });

// /client/proc/powerdebug  (code/modules/admin/verbs/atmosdebug.dm:27)
rt.def("/client/proc/powerdebug", function powerdebug(f: Frame) {
	let PN: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [PN, C, $e];
	if (!truthy(rt.fv(f, "holder", live(f.src)))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.src), "Only administrators may use this command."]);
		return live(f.dot);
	}
	PN = null;
	rt.forList(f, 0, rt.gl("powernets"), T("/datum/powernet"));
	while (($e = rt.next(f, 0)) !== undefined) {
		PN = $e;
		if ((!truthy(rt.fv(f, "nodes", live(PN))) || !truthy(rt.getLen(f, rt.fv(f, "nodes", live(PN)))))) {
			if ((truthy(rt.fv(f, "cables", live(PN))) && rt.gt(rt.getLen(f, rt.fv(f, "cables", live(PN))), 1))) {
				C = rt.index(rt.fv(f, "cables", live(PN)), 1);
				rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("Powernet with no nodes! (number ＀) - example cable at ＀, ＀, ＀ in area ＀", [rt.fv(f, "number", live(PN)), rt.fv(f, "x", live(C)), rt.fv(f, "y", live(C)), rt.fv(f, "z", live(C)), rt.call(f, P("/proc/get_area"), null, [rt.fv(f, "loc", live(C))])])]);
			}
		}
		if ((!truthy(rt.fv(f, "cables", live(PN))) || rt.lt(rt.getLen(f, rt.fv(f, "cables", live(PN))), 10))) {
			if ((truthy(rt.fv(f, "cables", live(PN))) && rt.gt(rt.getLen(f, rt.fv(f, "cables", live(PN))), 1))) {
				C = rt.index(rt.fv(f, "cables", live(PN)), 1);
				rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("Powernet with fewer than 10 cables! (number ＀) - example cable at ＀, ＀, ＀ in area ＀", [rt.fv(f, "number", live(PN)), rt.fv(f, "x", live(C)), rt.fv(f, "y", live(C)), rt.fv(f, "z", live(C)), rt.call(f, P("/proc/get_area"), null, [rt.fv(f, "loc", live(C))])])]);
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, false, { verb: { name: "Check Power", category: "Mapping" } });
