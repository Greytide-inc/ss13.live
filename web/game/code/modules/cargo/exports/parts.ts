// Based on /tg/station's code/modules/cargo/exports/parts.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(2041, "/datum/export/solar/assembly", "/datum/export/solar", {
	cost: 50,
	unit_name: "solar panel assembly",
	export_types: null,
});

// parts.dm:6
rt.def("/datum/export/solar/assembly/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.export_types = list(T("/obj/item/solar_assembly"));
	return f.dot;
});

rt.type(2042, "/datum/export/solar/tracker_board", "/datum/export/solar", {
	cost: 100,
	unit_name: "solar tracker board",
	export_types: null,
});

// parts.dm:11
rt.def("/datum/export/solar/tracker_board/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.export_types = list(T("/obj/item/weapon/electronics/tracker"));
	return f.dot;
});

rt.type(2043, "/datum/export/solar/control_board", "/datum/export/solar", {
	cost: 150,
	unit_name: "solar panel control board",
	export_types: null,
});

// parts.dm:16
rt.def("/datum/export/solar/control_board/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.export_types = list(T("/obj/item/weapon/circuitboard/computer/solar_control"));
	return f.dot;
});

rt.type(2044, "/datum/export/swarmer", "/datum/export", {
	cost: 2000,
	unit_name: "deactivated alien deconstruction drone",
	export_types: null,
});

// parts.dm:23
rt.def("/datum/export/swarmer/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.export_types = list(T("/obj/item/device/unactivated_swarmer"));
	return f.dot;
});

// parts.dm:26
rt.def("/datum/export/swarmer/proc/applies_to", function applies_to(f: Frame) {
	let S: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (!parent_proc()) {
		return 0;
	}
	if (!(S = f.args[0]).crit_fail) {
		return 0;
	}
	return 1;
}, false, { args: ["O", "contr", "emag"] });
