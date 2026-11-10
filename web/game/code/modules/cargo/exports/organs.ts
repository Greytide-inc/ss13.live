// Based on /tg/station's code/modules/cargo/exports/organs.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(2021, "/datum/export/organ/alien", "/datum/export/organ", {});

// organs.dm:6
rt.def("/datum/export/organ/alien/proc/get_cost", function get_cost(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	f.dot = parent_proc();
	if (!f.args[2]) return f.dot;
	f.dot *= 2;
	return f.dot;
}, false, { args: ["O", "contr", "emag"] });

rt.type(2022, "/datum/export/organ/alien/brain", "/datum/export/organ/alien", {
	cost: 5000,
	unit_name: "alien brain",
	export_types: null,
});

// organs.dm:13
rt.def("/datum/export/organ/alien/brain/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.export_types = list(T("/obj/item/organ/brain/alien"));
	return f.dot;
});

rt.type(2023, "/datum/export/organ/alien/acid", "/datum/export/organ/alien", {
	cost: 5000,
	unit_name: "alien acid gland",
	export_types: null,
});

// organs.dm:18
rt.def("/datum/export/organ/alien/acid/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.export_types = list(T("/obj/item/organ/alien/acid"));
	return f.dot;
});

rt.type(2024, "/datum/export/organ/alien/hivenode", "/datum/export/organ/alien", {
	cost: 5000,
	unit_name: "alien hive node",
	export_types: null,
});

// organs.dm:23
rt.def("/datum/export/organ/alien/hivenode/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.export_types = list(T("/obj/item/organ/alien/hivenode"));
	return f.dot;
});

rt.type(2025, "/datum/export/organ/alien/neurotoxin", "/datum/export/organ/alien", {
	cost: 5000,
	unit_name: "alien neurotoxin gland",
	export_types: null,
});

// organs.dm:28
rt.def("/datum/export/organ/alien/neurotoxin/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.export_types = list(T("/obj/item/organ/alien/neurotoxin"));
	return f.dot;
});

rt.type(2027, "/datum/export/organ/alien/plasmavessel", "/datum/export/organ/alien", {
	cost: 5000,
	unit_name: "alien plasma vessel",
	export_types: null,
});

// organs.dm:37
rt.def("/datum/export/organ/alien/plasmavessel/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.export_types = list(T("/obj/item/organ/alien/plasmavessel"));
	return f.dot;
});

// organs.dm:40
rt.def("/datum/export/organ/alien/plasmavessel/proc/get_cost", function get_cost(f: Frame, P: Value) {
	return parent_proc() + P.max_plasma * 2 + P.plasma_rate * 20;
}, false);

rt.type(2028, "/datum/export/organ/alien/embryo", "/datum/export/organ/alien", {
	cost: 5000,
	unit_name: "alien embryo",
	export_types: null,
});

// organs.dm:47
rt.def("/datum/export/organ/alien/embryo/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.export_types = list(T("/obj/item/organ/body_egg/alien_embryo"));
	return f.dot;
});

rt.type(2029, "/datum/export/organ/alien/eggsac", "/datum/export/organ/alien", {
	cost: 10000,
	unit_name: "alien egg sac",
	export_types: null,
});

// organs.dm:52
rt.def("/datum/export/organ/alien/eggsac/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.export_types = list(T("/obj/item/organ/alien/eggsac"));
	return f.dot;
});

rt.type(2030, "/datum/export/organ/alien/abductor", "/datum/export/organ/alien", {
	cost: 2500,
	unit_name: "abductor gland",
	export_types: null,
});

// organs.dm:59
rt.def("/datum/export/organ/alien/abductor/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.export_types = list(T("/obj/item/organ/heart/gland"));
	return f.dot;
});

rt.type(2031, "/datum/export/organ/alien/changeling_egg", "/datum/export/organ/alien", {
	cost: 50000,
	unit_name: "changeling egg",
	export_types: null,
});

// organs.dm:64
rt.def("/datum/export/organ/alien/changeling_egg/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.export_types = list(T("/obj/item/organ/body_egg/changeling_egg"));
	return f.dot;
});

rt.type(2032, "/datum/export/organ/hivelord", "/datum/export/organ", {
	cost: 1500,
	unit_name: "active regenerative core",
	export_types: null,
});

// organs.dm:70
rt.def("/datum/export/organ/hivelord/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.export_types = list(T("/obj/item/organ/regenerative_core"));
	return f.dot;
});

// organs.dm:73
rt.def("/datum/export/organ/alien/plasmavessel/proc/get_cost", function get_cost(f: Frame, C: Value) {
	if (C.inert) {
		return parent_proc() / 3;
	}
	if (C.preserved) {
		return parent_proc() * 2;
	}
	return parent_proc();
}, false);

rt.type(2034, "/datum/export/organ/cat/ears", "/datum/export/organ/cat", {
	cost: 1000,
	unit_name: "cat ears",
	export_types: null,
});

// organs.dm:84
rt.def("/datum/export/organ/cat/ears/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.export_types = list(T("/obj/item/organ/ears/cat"));
	return f.dot;
});

rt.type(2035, "/datum/export/organ/cat/tail", "/datum/export/organ/cat", {
	cost: 1000,
	unit_name: "cat tail",
	export_types: null,
});

// organs.dm:89
rt.def("/datum/export/organ/cat/tail/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.export_types = list(T("/obj/item/organ/tail/cat"));
	return f.dot;
});

rt.type(2037, "/datum/export/organ/human/heart", "/datum/export/organ/human", {
	cost: 500,
	unit_name: "heart",
	export_types: null,
});

// organs.dm:103
rt.def("/datum/export/organ/human/heart/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.export_types = list(T("/obj/item/organ/heart"));
	return f.dot;
});

rt.type(2038, "/datum/export/organ/human/lungs", "/datum/export/organ/human", {
	cost: 400,
	unit_name: "pair",
	message: "of lungs",
	export_types: null,
});

// organs.dm:109
rt.def("/datum/export/organ/human/lungs/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.export_types = list(T("/obj/item/organ/lungs"));
	return f.dot;
});

rt.type(2039, "/datum/export/organ/human/appendix", "/datum/export/organ/human", {
	cost: 50,
	unit_name: "appendix",
	export_types: null,
});

// organs.dm:114
rt.def("/datum/export/organ/human/appendix/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.export_types = list(T("/obj/item/organ/appendix"));
	return f.dot;
});

// organs.dm:117
rt.def("/datum/export/organ/human/appendix/proc/get_cost", function get_cost(f: Frame, O: Value) {
	if (O.inflamed) {
		return 0;
	}
	return parent_proc();
}, false);
