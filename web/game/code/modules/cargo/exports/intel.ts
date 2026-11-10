// Based on /tg/station's code/modules/cargo/exports/intel.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1969, "/datum/export/intel", "/datum/export", {
	copy_path: null,
	cost: 25000,
	k_elasticity: 0,
	unit_name: "original article",
	message: "of enemy intelligence",
	export_types: null,
}, { global: { originals_recieved: 657, copies_recieved: 658 } });

// intel.dm:12
rt.def("/datum/export/intel/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.export_types = list(T("/obj/item/documents/syndicate"));
	return f.dot;
});

// intel.dm:15
rt.def("/datum/export/intel/proc/applies_to", function applies_to(f: Frame) {
	let C: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (!parent_proc()) {
		return 0;
	}
	if (this.emagged != f.args[2]) {
		return 0;
	}
	if (rt.istype(f.args[0], T("/obj/item/documents/photocopy"))) {
		if (!(C = f.args[0]).copy_type) {
			return 0;
		}
		if (rt.isIn(f, C.copy_type, GLOB.originals_recieved) || rt.isIn(f, C.copy_type, GLOB.copies_recieved)) {
			return 0;
		}
		if (this.copy_path && !ispath(C.copy_type, this.copy_path)) {
			return 0;
		}
	} else if (rt.isIn(f, f.args[0].type, GLOB.originals_recieved)) {
		return 0;
	}
	return 1;
}, false, { args: ["O", "contr", "emag"] });

// intel.dm:37
rt.def("/datum/export/intel/proc/get_cost", function get_cost(f: Frame, O: Value) {
	if (rt.isIn(f, O.type, GLOB.copies_recieved)) {
		return parent_proc() - 15000;
	}
	return parent_proc();
}, false);

// intel.dm:42
rt.def("/datum/export/intel/proc/sell_object", function sell_object(f: Frame, O: Value) {
	let C: Value = null;
	parent_proc();
	if (rt.istype(O, T("/obj/item/documents/photocopy"))) {
		GLOB.copies_recieved += (C = O).copy_type;
	} else {
		GLOB.originals_recieved += O.type;
	}
	return f.dot;
}, false);

rt.type(1970, "/datum/export/intel/photocopy", "/datum/export/intel", {
	cost: 15000,
	unit_name: "photocopied article",
	export_types: null,
	copy_path: rt.typePath("/obj/item/documents/syndicate"),
});

// intel.dm:52
rt.def("/datum/export/intel/photocopy/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.export_types = list(T("/obj/item/documents/photocopy"));
	return f.dot;
});

rt.type(1971, "/datum/export/intel/syndie", "/datum/export/intel", {
	message: "of Nanotrasen intelligence",
	emagged: 1,
	export_types: null,
});

// intel.dm:60
rt.def("/datum/export/intel/syndie/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.export_types = list(T("/obj/item/documents/nanotrasen"));
	return f.dot;
});

rt.type(1972, "/datum/export/intel/syndie/photocopy", "/datum/export/intel/syndie", {
	cost: 15000,
	unit_name: "photocopied article",
	export_types: null,
	copy_path: rt.typePath("/obj/item/documents/nanotrasen"),
});

// intel.dm:66
rt.def("/datum/export/intel/syndie/photocopy/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.export_types = list(T("/obj/item/documents/photocopy"));
	return f.dot;
});

rt.type(1973, "/datum/export/intel/syndie/recovered", "/datum/export/intel/syndie", {
	cost: 15000,
	unit_name: "recovered article",
	message: "of Syndicate intelligence",
	export_types: null,
});

// intel.dm:74
rt.def("/datum/export/intel/syndie/recovered/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.export_types = list(T("/obj/item/documents/syndicate"));
	return f.dot;
});
