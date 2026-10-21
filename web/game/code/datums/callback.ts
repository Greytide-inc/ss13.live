// From code/datums/callback.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(390, "/datum/callback", "/datum", {
	object: "some_magic_bullshit",
	delegate: null,
	arguments: null,
});

// /datum/callback/proc/New  (code/datums/callback.dm:54)
rt.def("/datum/callback/proc/New", function New(f: Frame) {
	if (truthy(live(f.args[0]))) {
		rt.setSv(f, "object", live(f.args[0]));
	}
	rt.setSv(f, "delegate", live(f.args[1]));
	if (!rt.gt(rt.length(f.argsList), 2)) return f.dot;
	rt.setSv(f, "arguments", rt.callName(f, f.argsList, "Copy", [3]));
	return f.dot;
}, false, { args: ["thingtocall", "proctocall"] });

// /proc/ImmediateInvokeAsync  (code/datums/callback.dm:62)  may sleep
rt.def("/proc/ImmediateInvokeAsync", function* ImmediateInvokeAsync(f: Frame) {
	let calling_arguments: Value = null;
	let $0: any;
	f.vars = () => [calling_arguments, $0];
	if (!truthy(live(f.args[0]))) {
		return live(f.dot);
	}
	if (rt.gt(rt.length(f.argsList), 2)) {
		$0 = (yield* g.callName(f, f.argsList, "Copy", [3]));
	} else {
		$0 = null;
	}
	calling_arguments = $0;
	if (isEqual(live(f.args[0]), "some_magic_bullshit")) {
		yield* g.callDyn(f, live(f.args[1]), undefined, [live(calling_arguments)], rt.Args.List);
	} else {
		yield* g.callDyn(f, live(f.args[0]), live(f.args[1]), [live(calling_arguments)], rt.Args.List);
	}
	return f.dot;
}, true, { args: ["thingtocall", "proctocall"], waitfor: false });

// /datum/callback/proc/Invoke  (code/datums/callback.dm:73)  may sleep
rt.def("/datum/callback/proc/Invoke", function* Invoke(f: Frame) {
	let calling_arguments: Value = null;
	f.vars = () => [calling_arguments];
	if (!truthy(rt.sv(f, "object"))) {
		return live(f.dot);
	}
	calling_arguments = rt.sv(f, "arguments");
	if (truthy(rt.length(f.argsList))) {
		if (truthy(rt.length(rt.sv(f, "arguments")))) {
			calling_arguments = add(live(calling_arguments), f.argsList);
		} else {
			calling_arguments = f.argsList;
		}
	}
	if (truthy(rt.sv(f, "var_edited"))) {
		return (yield* g.call(f, P("/proc/WrapAdminProcCall"), null, [rt.sv(f, "object"), rt.sv(f, "delegate"), live(calling_arguments)]));
	}
	if (isEqual(rt.sv(f, "object"), "some_magic_bullshit")) {
		return (yield* g.callDyn(f, rt.sv(f, "delegate"), undefined, [live(calling_arguments)], rt.Args.List));
	}
	return (yield* g.callDyn(f, rt.sv(f, "object"), rt.sv(f, "delegate"), [live(calling_arguments)], rt.Args.List));
}, true);

// /datum/callback/proc/InvokeAsync  (code/datums/callback.dm:90)  may sleep
rt.def("/datum/callback/proc/InvokeAsync", function* InvokeAsync(f: Frame) {
	let calling_arguments: Value = null;
	f.vars = () => [calling_arguments];
	if (!truthy(rt.sv(f, "object"))) {
		return live(f.dot);
	}
	calling_arguments = rt.sv(f, "arguments");
	if (truthy(rt.length(f.argsList))) {
		if (truthy(rt.length(rt.sv(f, "arguments")))) {
			calling_arguments = add(live(calling_arguments), f.argsList);
		} else {
			calling_arguments = f.argsList;
		}
	}
	if (truthy(rt.sv(f, "var_edited"))) {
		return (yield* g.call(f, P("/proc/WrapAdminProcCall"), null, [rt.sv(f, "object"), rt.sv(f, "delegate"), live(calling_arguments)]));
	}
	if (isEqual(rt.sv(f, "object"), "some_magic_bullshit")) {
		return (yield* g.callDyn(f, rt.sv(f, "delegate"), undefined, [live(calling_arguments)], rt.Args.List));
	}
	return (yield* g.callDyn(f, rt.sv(f, "object"), rt.sv(f, "delegate"), [live(calling_arguments)], rt.Args.List));
}, true, { waitfor: false });
