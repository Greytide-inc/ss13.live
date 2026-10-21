// From code/modules/html_interface/html_interface_client.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(2710, "/datum/html_interface_client", "/datum", {
	client: null,
	layout: null,
	title: null,
	is_loaded: 0,
	active: 1,
	extra_vars: null,
	content_elements: null,
});

// /datum/html_interface_client/proc/<init>  (code/modules/html_interface/html_interface_client.dm:9)
rt.def("/datum/html_interface_client/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "content_elements", rt.new_(f, T("/list"), []));
	return f.dot;
});

// /datum/html_interface_client/proc/New  (code/modules/html_interface/html_interface_client.dm:24)
rt.def("/datum/html_interface_client/proc/New", function New(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	rt.setFv(f, "client", live(f.src), live(f.args[0]));
	return f.dot;
}, false, { args: ["client"] });

// /datum/html_interface_client/proc/putExtraVar  (code/modules/html_interface/html_interface_client.dm:29)
rt.def("/datum/html_interface_client/proc/putExtraVar", function putExtraVar(f: Frame, key: Value, value: Value) {
	if (!truthy(rt.fv(f, "extra_vars", live(f.src)))) {
		rt.setFv(f, "extra_vars", live(f.src), rt.new_(f, T("/list"), []));
	}
	rt.setAt(rt.fv(f, "extra_vars", live(f.src)), live(key), live(value));
	return f.dot;
});

// /datum/html_interface_client/proc/removeExtraVar  (code/modules/html_interface/html_interface_client.dm:33)
rt.def("/datum/html_interface_client/proc/removeExtraVar", function removeExtraVar(f: Frame, key: Value) {
	if (truthy(rt.fv(f, "extra_vars", live(f.src)))) {
		f.dot = rt.index(rt.fv(f, "extra_vars", live(f.src)), live(key));
		rt.callName(f, rt.fv(f, "extra_vars", live(f.src)), "Remove", [live(key)]);
		if (!truthy(rt.getLen(f, rt.fv(f, "extra_vars", live(f.src))))) {
			rt.setFv(f, "extra_vars", live(f.src), null);
		}
	}
	return live(f.dot);
});

// /datum/html_interface_client/proc/getExtraVar  (code/modules/html_interface/html_interface_client.dm:43)
rt.def("/datum/html_interface_client/proc/getExtraVar", function getExtraVar(f: Frame, key: Value) {
	if (!truthy(rt.fv(f, "extra_vars", live(f.src)))) return f.dot;
	return rt.index(rt.fv(f, "extra_vars", live(f.src)), live(key));
});
