// From code/modules/cargo/exports/manifest.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(2005, "/datum/export/manifest_correct", "/datum/export", {
	cost: 200,
	k_elasticity: 0,
	unit_name: "approved manifest",
	export_types: null,
});

// /datum/export/manifest_correct/proc/<init>  (code/modules/cargo/exports/manifest.dm:7)
rt.def("/datum/export/manifest_correct/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/weapon/paper/manifest")));
	return f.dot;
});

// /datum/export/manifest_correct/proc/applies_to  (code/modules/cargo/exports/manifest.dm:10)
rt.def("/datum/export/manifest_correct/proc/applies_to", function applies_to(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if (!truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return 0;
	}
	if ((truthy(rt.callName(f, (M = live(f.args[0])), "is_approved", [])) && !truthy(rt.fv(f, "errors", live(M))))) {
		return 1;
	}
	return 0;
}, false, { args: ["O"] });

rt.type(2006, "/datum/export/manifest_error_denied", "/datum/export", {
	cost: -500,
	k_elasticity: 0,
	unit_name: "correctly denied manifest",
	export_types: null,
});

// /datum/export/manifest_error_denied/proc/<init>  (code/modules/cargo/exports/manifest.dm:24)
rt.def("/datum/export/manifest_error_denied/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/weapon/paper/manifest")));
	return f.dot;
});

// /datum/export/manifest_error_denied/proc/applies_to  (code/modules/cargo/exports/manifest.dm:27)
rt.def("/datum/export/manifest_error_denied/proc/applies_to", function applies_to(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if (!truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return 0;
	}
	if ((truthy(rt.callName(f, (M = live(f.args[0])), "is_denied", [])) && truthy(rt.fv(f, "errors", live(M))))) {
		return 1;
	}
	return 0;
}, false, { args: ["O"] });

// /datum/export/manifest_error_denied/proc/get_cost  (code/modules/cargo/exports/manifest.dm:36)
rt.def("/datum/export/manifest_error_denied/proc/get_cost", function get_cost(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	M = live(f.args[0]);
	return add(rt.callSuper(f, [], rt.Args.Same), rt.fv(f, "order_cost", live(M)));
}, false, { args: ["O"] });

rt.type(2007, "/datum/export/manifest_error", "/datum/export", {
	unit_name: "erroneously approved manifest",
	export_types: null,
});

// /datum/export/manifest_error/proc/<init>  (code/modules/cargo/exports/manifest.dm:44)
rt.def("/datum/export/manifest_error/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/weapon/paper/manifest")));
	return f.dot;
});

// /datum/export/manifest_error/proc/applies_to  (code/modules/cargo/exports/manifest.dm:47)
rt.def("/datum/export/manifest_error/proc/applies_to", function applies_to(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if (!truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return 0;
	}
	if ((truthy(rt.callName(f, (M = live(f.args[0])), "is_approved", [])) && truthy(rt.fv(f, "errors", live(M))))) {
		return 1;
	}
	return 0;
}, false, { args: ["O"] });

// /datum/export/manifest_error/proc/get_cost  (code/modules/cargo/exports/manifest.dm:56)
rt.def("/datum/export/manifest_error/proc/get_cost", function get_cost(f: Frame, O: Value) {
	let M: Value = null;
	f.vars = () => [M];
	return rt.neg(rt.gv(f, "order_cost", (M = live(O))));
});

rt.type(2008, "/datum/export/manifest_correct_denied", "/datum/export", {
	cost: 500,
	unit_name: "erroneously denied manifest",
	export_types: null,
});

// /datum/export/manifest_correct_denied/proc/<init>  (code/modules/cargo/exports/manifest.dm:65)
rt.def("/datum/export/manifest_correct_denied/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/weapon/paper/manifest")));
	return f.dot;
});

// /datum/export/manifest_correct_denied/proc/applies_to  (code/modules/cargo/exports/manifest.dm:68)
rt.def("/datum/export/manifest_correct_denied/proc/applies_to", function applies_to(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if (!truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return 0;
	}
	if ((truthy(rt.callName(f, (M = live(f.args[0])), "is_denied", [])) && !truthy(rt.fv(f, "errors", live(M))))) {
		return 1;
	}
	return 0;
}, false, { args: ["O"] });

// /datum/export/manifest_correct_denied/proc/get_cost  (code/modules/cargo/exports/manifest.dm:77)
rt.def("/datum/export/manifest_correct_denied/proc/get_cost", function get_cost(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	M = live(f.args[0]);
	return subtract(rt.callSuper(f, [], rt.Args.Same), rt.fv(f, "order_cost", live(M)));
}, false, { args: ["O"] });
