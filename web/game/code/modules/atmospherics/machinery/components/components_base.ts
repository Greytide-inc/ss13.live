// From code/modules/atmospherics/machinery/components/components_base.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10560, "/obj/machinery/atmospherics/components", "/obj/machinery/atmospherics", {
	welded: 0,
	showpipe: 0,
	parents: null,
	airs: null,
});

// /obj/machinery/atmospherics/components/proc/New  (code/modules/atmospherics/machinery/components/components_base.dm:14)  may sleep
rt.def("/obj/machinery/atmospherics/components/proc/New", function* New(f: Frame) {
	let I: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [I, A, $e];
	rt.setSv(f, "parents", (yield* g.new_(f, T("/list"), [rt.sv(f, "device_type")])));
	rt.setSv(f, "airs", (yield* g.new_(f, T("/list"), [rt.sv(f, "device_type")])));
	yield* g.callSuper(f, [], rt.Args.Same);
	I = null;
	rt.forRange(f, 0, 1, rt.sv(f, "device_type"), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		rt.setFv(f, "volume", (A = (yield* g.new_(f, T("/datum/gas_mixture"), []))), 200);
		rt.setAt(rt.sv(f, "airs"), live(I), live(A));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/machinery/atmospherics/components/proc/icon_addintact  (code/modules/atmospherics/machinery/components/components_base.dm:27)
rt.def("/obj/machinery/atmospherics/components/proc/icon_addintact", function icon_addintact(f: Frame, node: Value) {
	let img: Value = null;
	f.vars = () => [img];
	rt.modSrcVar(f, "underlays", (img = rt.callSrc(f, "getpipeimage", [rt.rsc("icons/obj/atmospherics/components/binary_devices.dmi"), "pipe_intact", rt.getDir(f, live(f.src), live(node)), rt.fv(f, "pipe_color", live(node))])), add);
	return rt.fv(f, "dir", live(img));
});

// /obj/machinery/atmospherics/components/proc/icon_addbroken  (code/modules/atmospherics/machinery/components/components_base.dm:33)
rt.def("/obj/machinery/atmospherics/components/proc/icon_addbroken", function icon_addbroken(f: Frame, connected: Value) {
	let unconnected: Value = null, direction: Value = null;
	let $e: any;
	f.vars = () => [connected, unconnected, direction, $e];
	if (live(connected) === null) {
		connected = 0;
	}
	unconnected = rt.bitAnd(rt.op(f, "BitNot", [], [live(connected)]), rt.sv(f, "initialize_directions"));
	direction = null;
	rt.forList(f, 0, rt.gl("cardinal"));
	while (($e = rt.next(f, 0)) !== undefined) {
		direction = $e;
		if (truthy(rt.bitAnd(live(unconnected), live(direction)))) {
			rt.modSrcVar(f, "underlays", rt.callSrc(f, "getpipeimage", [rt.rsc("icons/obj/atmospherics/components/binary_devices.dmi"), "pipe_exposed", live(direction)]), add);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/machinery/atmospherics/components/proc/update_icon  (code/modules/atmospherics/machinery/components/components_base.dm:42)
rt.def("/obj/machinery/atmospherics/components/proc/update_icon", function update_icon(f: Frame) {
	let _T: Value = null, connected: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [_T, connected, I, $e];
	rt.callSrc(f, "update_icon_nopipes", []);
	rt.callName(f, rt.sv(f, "underlays"), "Cut", []);
	_T = rt.sv(f, "loc");
	if ((isEqual(rt.sv(f, "level"), 2) || !truthy(rt.fv(f, "intact", live(_T))))) {
		rt.setSv(f, "showpipe", 1);
	} else {
		rt.setSv(f, "showpipe", 0);
	}
	if (!truthy(rt.sv(f, "showpipe"))) {
		return live(f.dot);
	}
	connected = 0;
	I = null;
	rt.forRange(f, 0, 1, rt.sv(f, "device_type"), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (truthy(rt.index(rt.sv(f, "nodes"), live(I)))) {
			(connected = rt.modify(live(connected), rt.callSrc(f, "icon_addintact", [rt.index(rt.sv(f, "nodes"), live(I))]), rt.bitOr));
		}
	}
	rt.endFor(f, 0);
	rt.callSrc(f, "icon_addbroken", [live(connected)]);
	return f.dot;
});

// /obj/machinery/atmospherics/components/proc/nullifyNode  (code/modules/atmospherics/machinery/components/components_base.dm:69)  may sleep
rt.def("/obj/machinery/atmospherics/components/proc/nullifyNode", function* nullifyNode(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.index(rt.sv(f, "nodes"), live(f.args[0])))) return f.dot;
	yield* g.srcCall(f, "nullifyPipenet", rt.index(rt.sv(f, "parents"), live(f.args[0])));
	yield* g.call(f, P("/proc/qdel"), null, [rt.index(rt.sv(f, "airs"), live(f.args[0]))]);
	rt.setAt(rt.sv(f, "airs"), live(f.args[0]), null);
	return f.dot;
}, true, { args: ["I"] });

// /obj/machinery/atmospherics/components/proc/on_construction  (code/modules/atmospherics/machinery/components/components_base.dm:76)  may sleep
rt.def("/obj/machinery/atmospherics/components/proc/on_construction", function* on_construction(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "update_parents");
	return f.dot;
}, true);

// /obj/machinery/atmospherics/components/proc/build_network  (code/modules/atmospherics/machinery/components/components_base.dm:80)
rt.def("/obj/machinery/atmospherics/components/proc/build_network", function build_network(f: Frame) {
	let I: Value = null, _P: Value = null;
	let $e: any;
	f.vars = () => [I, _P, $e];
	I = null;
	rt.forRange(f, 0, 1, rt.sv(f, "device_type"), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (!truthy(rt.index(rt.sv(f, "parents"), live(I)))) {
			rt.setAt(rt.sv(f, "parents"), live(I), rt.new_(f, T("/datum/pipeline"), []));
			rt.callName(f, (_P = rt.index(rt.sv(f, "parents"), live(I))), "build_pipeline", [live(f.src)]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/machinery/atmospherics/components/proc/nullifyPipenet  (code/modules/atmospherics/machinery/components/components_base.dm:87)
rt.def("/obj/machinery/atmospherics/components/proc/nullifyPipenet", function nullifyPipenet(f: Frame, reference: Value) {
	let I: Value = null;
	f.vars = () => [I];
	I = rt.callName(f, rt.sv(f, "parents"), "Find", [live(reference)]);
	(rt.modField(f, live(reference), "other_airs", rt.index(rt.sv(f, "airs"), live(I)), subtract));
	(rt.modField(f, live(reference), "other_atmosmch", live(f.src), subtract));
	rt.setAt(rt.sv(f, "parents"), live(I), null);
	return f.dot;
});

// /obj/machinery/atmospherics/components/proc/returnPipenetAir  (code/modules/atmospherics/machinery/components/components_base.dm:93)
rt.def("/obj/machinery/atmospherics/components/proc/returnPipenetAir", function returnPipenetAir(f: Frame, reference: Value) {
	let I: Value = null;
	f.vars = () => [I];
	I = rt.callName(f, rt.sv(f, "parents"), "Find", [live(reference)]);
	return rt.index(rt.sv(f, "airs"), live(I));
});

// /obj/machinery/atmospherics/components/proc/pipeline_expansion  (code/modules/atmospherics/machinery/components/components_base.dm:98)
rt.def("/obj/machinery/atmospherics/components/proc/pipeline_expansion", function pipeline_expansion(f: Frame) {
	let I: Value = null;
	f.vars = () => [I];
	if (truthy(live(f.args[0]))) {
		I = rt.callName(f, rt.sv(f, "parents"), "Find", [live(f.args[0])]);
		return rt.list(rt.index(rt.sv(f, "nodes"), live(I)));
	} else {
		return rt.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, false, { args: ["reference"] });

// /obj/machinery/atmospherics/components/proc/setPipenet  (code/modules/atmospherics/machinery/components/components_base.dm:104)
rt.def("/obj/machinery/atmospherics/components/proc/setPipenet", function setPipenet(f: Frame, reference: Value, A: Value) {
	let I: Value = null;
	f.vars = () => [I];
	I = rt.callName(f, rt.sv(f, "nodes"), "Find", [live(A)]);
	rt.setAt(rt.sv(f, "parents"), live(I), live(reference));
	return f.dot;
});

// /obj/machinery/atmospherics/components/proc/returnPipenet  (code/modules/atmospherics/machinery/components/components_base.dm:108)
rt.def("/obj/machinery/atmospherics/components/proc/returnPipenet", function returnPipenet(f: Frame, A: Value) {
	let I: Value = null;
	f.vars = () => [A, I];
	if (live(A) === null) {
		A = rt.index(rt.sv(f, "nodes"), 1);
	}
	if (rt.gl("pipe_rebuild_defer") !== null) rt.call(f, P("/proc/flush_pipe_rebuilds"), null, []); // stress2c
	I = rt.callName(f, rt.sv(f, "nodes"), "Find", [live(A)]);
	return rt.index(rt.sv(f, "parents"), live(I));
});

// /obj/machinery/atmospherics/components/proc/replacePipenet  (code/modules/atmospherics/machinery/components/components_base.dm:112)
rt.def("/obj/machinery/atmospherics/components/proc/replacePipenet", function replacePipenet(f: Frame, Old: Value, New: Value) {
	let I: Value = null;
	f.vars = () => [I];
	I = rt.callName(f, rt.sv(f, "parents"), "Find", [live(Old)]);
	rt.setAt(rt.sv(f, "parents"), live(I), live(New));
	return f.dot;
});

// /obj/machinery/atmospherics/components/proc/unsafe_pressure_release  (code/modules/atmospherics/machinery/components/components_base.dm:116)  may sleep
rt.def("/obj/machinery/atmospherics/components/proc/unsafe_pressure_release", function* unsafe_pressure_release(f: Frame) {
	let _T: Value = null, environment: Value = null, lost: Value = null, times_lost: Value = null, I: Value = null, air: Value = null, shared_loss: Value = null, to_release: Value = null, I_6: Value = null, air_7: Value = null;
	let $e: any;
	f.vars = () => [_T, environment, lost, times_lost, I, air, shared_loss, to_release, I_6, air_7, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((_T = rt.getStep(f, live(f.src), 0)))) return f.dot;
	environment = (yield* g.callName(f, live(_T), "return_air", []));
	lost = null;
	times_lost = 0;
	I = null;
	rt.forRange(f, 0, 1, rt.sv(f, "device_type"), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		air = rt.index(rt.sv(f, "airs"), live(I));
		lost = rt.modify(live(lost), divide(multiply(live(f.args[1]), rt.fv(f, "volume", live(environment))), multiply(rt.fv(f, "temperature", live(air)), 8.3100004196167)), add);
		times_lost = rt.inc(live(times_lost), 1);
	}
	rt.endFor(f, 0);
	shared_loss = divide(live(lost), live(times_lost));
	to_release = null;
	I_6 = null;
	rt.forRange(f, 0, 1, rt.sv(f, "device_type"), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		I_6 = $e;
		air_7 = rt.index(rt.sv(f, "airs"), live(I_6));
		if (!truthy(live(to_release))) {
			to_release = (yield* g.callName(f, live(air_7), "remove", [live(shared_loss)]));
			continue;
		}
		yield* g.callName(f, live(to_release), "merge", [(yield* g.callName(f, live(air_7), "remove", [live(shared_loss)]))]);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, live(_T), "assume_air", [live(to_release)]);
	yield* g.srcCall(f, "air_update_turf", 1);
	return f.dot;
}, true, { args: ["user", "pressures"] });

// /obj/machinery/atmospherics/components/proc/safe_input  (code/modules/atmospherics/machinery/components/components_base.dm:141)  may sleep
rt.def("/obj/machinery/atmospherics/components/proc/safe_input", function* safe_input(f: Frame, title: Value, text: Value, default_set: Value) {
	let new_value: Value = null;
	f.vars = () => [title, text, default_set, new_value];
	new_value = (yield* g.op(f, "Prompt", [32], [live(default_set), live(title), live(text), live(f.usr), null]));
	if (truthy((yield* g.callName(f, live(f.usr), "canUseTopic", [live(f.src)])))) {
		return live(new_value);
	}
	return live(default_set);
}, true);

// /obj/machinery/atmospherics/components/proc/update_parents  (code/modules/atmospherics/machinery/components/components_base.dm:151)
rt.def("/obj/machinery/atmospherics/components/proc/update_parents", function update_parents(f: Frame) {
	let I: Value = null, parent: Value = null;
	let $e: any;
	f.vars = () => [I, parent, $e];
	if (rt.gl("pipe_rebuild_defer") !== null) rt.call(f, P("/proc/flush_pipe_rebuilds"), null, []); // stress2c: rebuilds waiting for the end of a singularity pass
	I = null;
	rt.forRange(f, 0, 1, rt.sv(f, "device_type"), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (!truthy((parent = rt.index(rt.sv(f, "parents"), live(I))))) {
			rt.throw_(f, rt.new_(f, T("/exception"), ["Component is missing a pipenet! Rebuilding...", "code/modules/atmospherics/machinery/components/components_base.dm", 154]));
			rt.callSrc(f, "build_network", []);
		}
		rt.setFv(f, "update", live(parent), 1);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/machinery/atmospherics/components/proc/returnPipenets  (code/modules/atmospherics/machinery/components/components_base.dm:159)
rt.def("/obj/machinery/atmospherics/components/proc/returnPipenets", function returnPipenets(f: Frame) {
	let I: Value = null;
	let $e: any;
	f.vars = () => [I, $e];
	f.dot = rt.list();
	I = null;
	rt.forRange(f, 0, 1, rt.sv(f, "device_type"), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		f.dot = rt.modify(live(f.dot), rt.callSrc(f, "returnPipenet", [rt.index(rt.sv(f, "nodes"), live(I))]), add);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/machinery/atmospherics/components/proc/ui_status  (code/modules/atmospherics/machinery/components/components_base.dm:168)
rt.def("/obj/machinery/atmospherics/components/proc/ui_status", function ui_status(f: Frame) {
	if (truthy(rt.callSrc(f, "allowed", [live(f.args[0])]))) {
		return rt.callSuper(f, [], rt.Args.Same);
	}
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='danger'>Access denied.</span>"]);
	return -1;
}, false, { args: ["user"] });
