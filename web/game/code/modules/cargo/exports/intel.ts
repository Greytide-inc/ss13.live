// From code/modules/cargo/exports/intel.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1969, "/datum/export/intel", "/datum/export", {
	copy_path: null,
	cost: 25000,
	k_elasticity: 0,
	unit_name: "original article",
	message: "of enemy intelligence",
	export_types: null,
}, { global: { originals_recieved: 657, copies_recieved: 658 } });

// /datum/export/intel/proc/<init>  (code/modules/cargo/exports/intel.dm:12)
rt.def("/datum/export/intel/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/documents/syndicate")));
	return f.dot;
});

// /datum/export/intel/proc/applies_to  (code/modules/cargo/exports/intel.dm:15)
rt.def("/datum/export/intel/proc/applies_to", function applies_to(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if (!truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return 0;
	}
	if (!isEqual(rt.sv(f, "emagged"), live(f.args[2]))) {
		return 0;
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/documents/photocopy")) ? 1 : 0))) {
		if (!truthy(rt.gv(f, "copy_type", (C = live(f.args[0]))))) {
			return 0;
		}
		if ((truthy((rt.isIn(f, rt.fv(f, "copy_type", live(C)), rt.gl("originals_recieved")) ? 1 : 0)) || truthy((rt.isIn(f, rt.fv(f, "copy_type", live(C)), rt.gl("copies_recieved")) ? 1 : 0)))) {
			return 0;
		}
		if ((truthy(rt.sv(f, "copy_path")) && !truthy(rt.call(f, P("/proc/ispath"), null, [rt.fv(f, "copy_type", live(C)), rt.sv(f, "copy_path")])))) {
			return 0;
		}
	} else {
		if (truthy((rt.isIn(f, rt.fv(f, "type", live(f.args[0])), rt.gl("originals_recieved")) ? 1 : 0))) {
			return 0;
		}
	}
	return 1;
}, false, { args: ["O", "contr", "emag"] });

// /datum/export/intel/proc/get_cost  (code/modules/cargo/exports/intel.dm:37)
rt.def("/datum/export/intel/proc/get_cost", function get_cost(f: Frame) {
	if (truthy((rt.isIn(f, rt.fv(f, "type", live(f.args[0])), rt.gl("copies_recieved")) ? 1 : 0))) {
		return subtract(rt.callSuper(f, [], rt.Args.Same), 15000);
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["O"] });

// /datum/export/intel/proc/sell_object  (code/modules/cargo/exports/intel.dm:42)
rt.def("/datum/export/intel/proc/sell_object", function sell_object(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/documents/photocopy")) ? 1 : 0))) {
		rt.modGl("copies_recieved", rt.gv(f, "copy_type", (C = live(f.args[0]))), add);
	} else {
		rt.modGl("originals_recieved", rt.fv(f, "type", live(f.args[0])), add);
	}
	return f.dot;
}, false, { args: ["O"] });

rt.type(1970, "/datum/export/intel/photocopy", "/datum/export/intel", {
	cost: 15000,
	unit_name: "photocopied article",
	export_types: null,
	copy_path: rt.typePath("/obj/item/documents/syndicate"),
});

// /datum/export/intel/photocopy/proc/<init>  (code/modules/cargo/exports/intel.dm:52)
rt.def("/datum/export/intel/photocopy/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/documents/photocopy")));
	return f.dot;
});

rt.type(1971, "/datum/export/intel/syndie", "/datum/export/intel", {
	message: "of Nanotrasen intelligence",
	emagged: 1,
	export_types: null,
});

// /datum/export/intel/syndie/proc/<init>  (code/modules/cargo/exports/intel.dm:60)
rt.def("/datum/export/intel/syndie/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/documents/nanotrasen")));
	return f.dot;
});

rt.type(1972, "/datum/export/intel/syndie/photocopy", "/datum/export/intel/syndie", {
	cost: 15000,
	unit_name: "photocopied article",
	export_types: null,
	copy_path: rt.typePath("/obj/item/documents/nanotrasen"),
});

// /datum/export/intel/syndie/photocopy/proc/<init>  (code/modules/cargo/exports/intel.dm:66)
rt.def("/datum/export/intel/syndie/photocopy/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/documents/photocopy")));
	return f.dot;
});

rt.type(1973, "/datum/export/intel/syndie/recovered", "/datum/export/intel/syndie", {
	cost: 15000,
	unit_name: "recovered article",
	message: "of Syndicate intelligence",
	export_types: null,
});

// /datum/export/intel/syndie/recovered/proc/<init>  (code/modules/cargo/exports/intel.dm:74)
rt.def("/datum/export/intel/syndie/recovered/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/documents/syndicate")));
	return f.dot;
});
