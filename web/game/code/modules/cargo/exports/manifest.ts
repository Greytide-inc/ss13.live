// Based on /tg/station's code/modules/cargo/exports/manifest.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(2005, "/datum/export/manifest_correct", "/datum/export", {
	cost: 200,
	k_elasticity: 0,
	unit_name: "approved manifest",
	export_types: null,
});

// manifest.dm:7
rt.def("/datum/export/manifest_correct/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.export_types = list(T("/obj/item/weapon/paper/manifest"));
	return f.dot;
});

// manifest.dm:10
rt.def("/datum/export/manifest_correct/proc/applies_to", function applies_to(f: Frame, O: Value) {
	let M: Value = null;
	if (!parent_proc()) {
		return 0;
	}
	if ((M = O).is_approved() && !M.errors) {
		return 1;
	}
	return 0;
}, false);

rt.type(2006, "/datum/export/manifest_error_denied", "/datum/export", {
	cost: -500,
	k_elasticity: 0,
	unit_name: "correctly denied manifest",
	export_types: null,
});

// manifest.dm:24
rt.def("/datum/export/manifest_error_denied/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.export_types = list(T("/obj/item/weapon/paper/manifest"));
	return f.dot;
});

// manifest.dm:27
rt.def("/datum/export/manifest_error_denied/proc/applies_to", function applies_to(f: Frame, O: Value) {
	let M: Value = null;
	if (!parent_proc()) {
		return 0;
	}
	if ((M = O).is_denied() && M.errors) {
		return 1;
	}
	return 0;
}, false);

// manifest.dm:36
rt.def("/datum/export/manifest_error_denied/proc/get_cost", function get_cost(f: Frame, O: Value) {
	let M: Value = O;
	return parent_proc() + M.order_cost;
}, false);

rt.type(2007, "/datum/export/manifest_error", "/datum/export", {
	unit_name: "erroneously approved manifest",
	export_types: null,
});

// manifest.dm:44
rt.def("/datum/export/manifest_error/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.export_types = list(T("/obj/item/weapon/paper/manifest"));
	return f.dot;
});

// manifest.dm:47
rt.def("/datum/export/manifest_error/proc/applies_to", function applies_to(f: Frame, O: Value) {
	let M: Value = null;
	if (!parent_proc()) {
		return 0;
	}
	if ((M = O).is_approved() && M.errors) {
		return 1;
	}
	return 0;
}, false);

// manifest.dm:56
rt.def("/datum/export/manifest_error/proc/get_cost", function get_cost(f: Frame, O: Value) {
	let M: Value = null;
	return -(M = O).order_cost;
});

rt.type(2008, "/datum/export/manifest_correct_denied", "/datum/export", {
	cost: 500,
	unit_name: "erroneously denied manifest",
	export_types: null,
});

// manifest.dm:65
rt.def("/datum/export/manifest_correct_denied/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.export_types = list(T("/obj/item/weapon/paper/manifest"));
	return f.dot;
});

// manifest.dm:68
rt.def("/datum/export/manifest_correct_denied/proc/applies_to", function applies_to(f: Frame, O: Value) {
	let M: Value = null;
	if (!parent_proc()) {
		return 0;
	}
	if ((M = O).is_denied() && !M.errors) {
		return 1;
	}
	return 0;
}, false);

// manifest.dm:77
rt.def("/datum/export/manifest_correct_denied/proc/get_cost", function get_cost(f: Frame, O: Value) {
	let M: Value = O;
	return parent_proc() - M.order_cost;
}, false);
