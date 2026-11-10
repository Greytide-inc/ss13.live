// Based on /tg/station's code/modules/cargo/exports/materials.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(2009, "/datum/export/material", "/datum/export", {
	material_id: null,
	cost: 5,
	message: "cm3 of developer's tears. Please, report this on github",
	export_types: null,
});

// materials.dm:5
rt.def("/datum/export/material/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.export_types = list(T("/obj/item/stack/sheet/mineral"), T("/obj/item/stack/tile/mineral"), T("/obj/item/weapon/ore"), T("/obj/item/weapon/coin"));
	return f.dot;
});

// materials.dm:12
rt.def("/datum/export/material/proc/get_amount", function get_amount(f: Frame, O: Value) {
	let S: Value = null;
	if (!this.material_id) {
		return 0;
	}
	if (!rt.istype(O, T("/obj/item"))) {
		return 0;
	}
	let I: Value = O;
	if (!rt.isIn(f, this.material_id, I.materials)) {
		return 0;
	}
	let amount: Value = rt.index(I.materials, this.material_id);
	if (rt.istype(I, T("/obj/item/stack"))) {
		amount *= (S = I).amount;
	} else if (rt.istype(I, T("/obj/item/weapon/ore"))) {
		amount *= 0.8;
	}
	return round(amount / MINERAL_MATERIAL_AMOUNT);
});

rt.type(2018, "/datum/export/material/metal", "/datum/export/material", {
	message: "cm3 of metal",
	material_id: "$metal",
	export_types: null,
});

// materials.dm:85
rt.def("/datum/export/material/metal/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.export_types = list(T("/obj/item/stack/sheet/metal"), T("/obj/item/stack/tile/plasteel"), T("/obj/item/stack/rods"), T("/obj/item/weapon/ore"), T("/obj/item/weapon/coin"));
	return f.dot;
});

rt.type(2019, "/datum/export/material/glass", "/datum/export/material", {
	message: "cm3 of glass",
	material_id: "$glass",
	export_types: null,
});

// materials.dm:93
rt.def("/datum/export/material/glass/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.export_types = list(T("/obj/item/stack/sheet/glass"), T("/obj/item/weapon/ore"), T("/obj/item/weapon/shard"));
	return f.dot;
});
