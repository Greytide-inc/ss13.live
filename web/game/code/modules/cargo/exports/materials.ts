// From code/modules/cargo/exports/materials.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(2009, "/datum/export/material", "/datum/export", {
	material_id: null,
	cost: 5,
	message: "cm3 of developer's tears. Please, report this on github",
	export_types: null,
});

// /datum/export/material/proc/<init>  (code/modules/cargo/exports/materials.dm:5)
rt.def("/datum/export/material/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/stack/sheet/mineral"), T("/obj/item/stack/tile/mineral"), T("/obj/item/weapon/ore"), T("/obj/item/weapon/coin")));
	return f.dot;
});

// /datum/export/material/proc/get_amount  (code/modules/cargo/exports/materials.dm:12)
rt.def("/datum/export/material/proc/get_amount", function get_amount(f: Frame, O: Value) {
	let I: Value = null, amount: Value = null, S: Value = null;
	f.vars = () => [I, amount, S];
	if (!truthy(rt.sv(f, "material_id"))) {
		return 0;
	}
	if (!truthy((rt.istype(live(O), T("/obj/item")) ? 1 : 0))) {
		return 0;
	}
	I = live(O);
	if (!truthy((rt.isIn(f, rt.sv(f, "material_id"), rt.fv(f, "materials", live(I))) ? 1 : 0))) {
		return 0;
	}
	amount = rt.index(rt.fv(f, "materials", live(I)), rt.sv(f, "material_id"));
	if (truthy((rt.istype(live(I), T("/obj/item/stack")) ? 1 : 0))) {
		(amount = rt.modify(live(amount), rt.gv(f, "amount", (S = live(I))), multiply));
	} else {
		if (truthy((rt.istype(live(I), T("/obj/item/weapon/ore")) ? 1 : 0))) {
			(amount = rt.modify(live(amount), 0.800000011920929, multiply));
		}
	}
	return rt.call(f, P("/proc/round"), null, [divide(live(amount), 2000)]);
});

rt.type(2018, "/datum/export/material/metal", "/datum/export/material", {
	message: "cm3 of metal",
	material_id: "$metal",
	export_types: null,
});

// /datum/export/material/metal/proc/<init>  (code/modules/cargo/exports/materials.dm:85)
rt.def("/datum/export/material/metal/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/stack/sheet/metal"), T("/obj/item/stack/tile/plasteel"), T("/obj/item/stack/rods"), T("/obj/item/weapon/ore"), T("/obj/item/weapon/coin")));
	return f.dot;
});

rt.type(2019, "/datum/export/material/glass", "/datum/export/material", {
	message: "cm3 of glass",
	material_id: "$glass",
	export_types: null,
});

// /datum/export/material/glass/proc/<init>  (code/modules/cargo/exports/materials.dm:93)
rt.def("/datum/export/material/glass/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/stack/sheet/glass"), T("/obj/item/weapon/ore"), T("/obj/item/weapon/shard")));
	return f.dot;
});
