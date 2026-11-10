// Based on /tg/station's code/datums/callback.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { g } = rt;


rt.type(390, "/datum/callback", "/datum", {
	object: "some_magic_bullshit",
	delegate: null,
	arguments: null,
});

// callback.dm:54
rt.def("/datum/callback/proc/New", function New(f: Frame) {
	if (f.args[0]) {
		this.object = f.args[0];
	}
	this.delegate = f.args[1];
	if (!(rt.length(f.argsList) > 2)) return f.dot;
	rt.setSv(f, "arguments", f.argsList.Copy(3));
	return f.dot;
}, false, { args: ["thingtocall", "proctocall"] });

// callback.dm:62
rt.def("/proc/ImmediateInvokeAsync", function* ImmediateInvokeAsync(f: Frame) {
	if (!f.args[0]) {
		return f.dot;
	}
	let calling_arguments: Value = rt.length(f.argsList) > 2 ? (yield* f.argsList.Copy(3)) : null;
	if (f.args[0] == "some_magic_bullshit") {
		yield* g.callDyn(f, f.args[1], undefined, [calling_arguments], rt.Args.List);
	} else {
		yield* g.callDyn(f, f.args[0], f.args[1], [calling_arguments], rt.Args.List);
	}
	return f.dot;
}, true, { args: ["thingtocall", "proctocall"], waitfor: false });

// callback.dm:73
rt.def("/datum/callback/proc/Invoke", function* Invoke(f: Frame) {
	if (!this.object) {
		return f.dot;
	}
	let calling_arguments: Value = rt.sv(f, "arguments");
	if (rt.length(f.argsList)) {
		if (rt.length(rt.sv(f, "arguments"))) {
			calling_arguments = calling_arguments + f.argsList;
		} else {
			calling_arguments = f.argsList;
		}
	}
	if (this.var_edited) {
		return (yield* WrapAdminProcCall(this.object, this.delegate, calling_arguments));
	}
	if (this.object == "some_magic_bullshit") {
		return (yield* g.callDyn(f, this.delegate, undefined, [calling_arguments], rt.Args.List));
	}
	return (yield* g.callDyn(f, this.object, this.delegate, [calling_arguments], rt.Args.List));
}, true);

// callback.dm:90
rt.def("/datum/callback/proc/InvokeAsync", function* InvokeAsync(f: Frame) {
	if (!this.object) {
		return f.dot;
	}
	let calling_arguments: Value = rt.sv(f, "arguments");
	if (rt.length(f.argsList)) {
		if (rt.length(rt.sv(f, "arguments"))) {
			calling_arguments = calling_arguments + f.argsList;
		} else {
			calling_arguments = f.argsList;
		}
	}
	if (this.var_edited) {
		return (yield* WrapAdminProcCall(this.object, this.delegate, calling_arguments));
	}
	if (this.object == "some_magic_bullshit") {
		return (yield* g.callDyn(f, this.delegate, undefined, [calling_arguments], rt.Args.List));
	}
	return (yield* g.callDyn(f, this.object, this.delegate, [calling_arguments], rt.Args.List));
}, true, { waitfor: false });
