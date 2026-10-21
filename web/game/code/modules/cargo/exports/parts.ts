// From code/modules/cargo/exports/parts.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(2041, "/datum/export/solar/assembly", "/datum/export/solar", {
	cost: 50,
	unit_name: "solar panel assembly",
	export_types: null,
});

// /datum/export/solar/assembly/proc/<init>  (code/modules/cargo/exports/parts.dm:6)
rt.def("/datum/export/solar/assembly/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/solar_assembly")));
	return f.dot;
});

rt.type(2042, "/datum/export/solar/tracker_board", "/datum/export/solar", {
	cost: 100,
	unit_name: "solar tracker board",
	export_types: null,
});

// /datum/export/solar/tracker_board/proc/<init>  (code/modules/cargo/exports/parts.dm:11)
rt.def("/datum/export/solar/tracker_board/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/weapon/electronics/tracker")));
	return f.dot;
});

rt.type(2043, "/datum/export/solar/control_board", "/datum/export/solar", {
	cost: 150,
	unit_name: "solar panel control board",
	export_types: null,
});

// /datum/export/solar/control_board/proc/<init>  (code/modules/cargo/exports/parts.dm:16)
rt.def("/datum/export/solar/control_board/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/weapon/circuitboard/computer/solar_control")));
	return f.dot;
});

rt.type(2044, "/datum/export/swarmer", "/datum/export", {
	cost: 2000,
	unit_name: "deactivated alien deconstruction drone",
	export_types: null,
});

// /datum/export/swarmer/proc/<init>  (code/modules/cargo/exports/parts.dm:23)
rt.def("/datum/export/swarmer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/device/unactivated_swarmer")));
	return f.dot;
});

// /datum/export/swarmer/proc/applies_to  (code/modules/cargo/exports/parts.dm:26)
rt.def("/datum/export/swarmer/proc/applies_to", function applies_to(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if (!truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return 0;
	}
	if (!truthy(rt.gv(f, "crit_fail", (S = live(f.args[0]))))) {
		return 0;
	}
	return 1;
}, false, { args: ["O", "contr", "emag"] });
