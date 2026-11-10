// Based on /tg/station's code/game/objects/structures/crates_lockers/closets/secure/freezer.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12365, "/obj/structure/closet/secure_closet/freezer/kitchen", "/obj/structure/closet/secure_closet/freezer", {
	name: "kitchen Cabinet",
	req_access: null,
});

// freezer.dm:6
rt.def("/obj/structure/closet/secure_closet/freezer/kitchen/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(28);
	return f.dot;
});

// freezer.dm:9
rt.def("/obj/structure/closet/secure_closet/freezer/kitchen/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* parent_proc();
	let i: Value = 0;
	while (i < 3) {
		yield* new_(T("/obj/item/weapon/reagent_containers/food/condiment/flour"), this);
		i++;
	}
	yield* new_(T("/obj/item/weapon/reagent_containers/food/condiment/rice"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/food/condiment/sugar"), this);
	return f.dot;
}, true);

rt.type(12366, "/obj/structure/closet/secure_closet/freezer/kitchen/maintenance", "/obj/structure/closet/secure_closet/freezer/kitchen", {
	name: "maintenance refrigerator",
	desc: "This refrigerator looks quite dusty, is there anything edible still inside?",
	req_access: null,
});

// freezer.dm:18
rt.def("/obj/structure/closet/secure_closet/freezer/kitchen/maintenance/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list();
	return f.dot;
});

// freezer.dm:21
rt.def("/obj/structure/closet/secure_closet/freezer/kitchen/maintenance/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* parent_proc();
	let i: Value = 0;
	while (i < 5) {
		yield* new_(T("/obj/item/weapon/reagent_containers/food/condiment/milk"), this);
		i++;
	}
	i = 0;
	while (i < 5) {
		yield* new_(T("/obj/item/weapon/reagent_containers/food/condiment/soymilk"), this);
		i++;
	}
	i = 0;
	while (i < 2) {
		yield* new_(T("/obj/item/weapon/storage/fancy/egg_box"), this);
		i++;
	}
	return f.dot;
}, true);

rt.type(12367, "/obj/structure/closet/secure_closet/freezer/kitchen/mining", "/obj/structure/closet/secure_closet/freezer/kitchen", {
	req_access: null,
});

// freezer.dm:30
rt.def("/obj/structure/closet/secure_closet/freezer/kitchen/mining/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list();
	return f.dot;
});

rt.type(12368, "/obj/structure/closet/secure_closet/freezer/meat", "/obj/structure/closet/secure_closet/freezer", {
	name: "meat fridge",
});

// freezer.dm:36
rt.def("/obj/structure/closet/secure_closet/freezer/meat/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* parent_proc();
	let i: Value = 0;
	while (i < 4) {
		yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/monkey"), this);
		i++;
	}
	return f.dot;
}, true);

rt.type(12369, "/obj/structure/closet/secure_closet/freezer/fridge", "/obj/structure/closet/secure_closet/freezer", {
	name: "refrigerator",
});

// freezer.dm:43
rt.def("/obj/structure/closet/secure_closet/freezer/fridge/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* parent_proc();
	let i: Value = 0;
	while (i < 5) {
		yield* new_(T("/obj/item/weapon/reagent_containers/food/condiment/milk"), this);
		i++;
	}
	i = 0;
	while (i < 5) {
		yield* new_(T("/obj/item/weapon/reagent_containers/food/condiment/soymilk"), this);
		i++;
	}
	i = 0;
	while (i < 2) {
		yield* new_(T("/obj/item/weapon/storage/fancy/egg_box"), this);
		i++;
	}
	return f.dot;
}, true);

rt.type(12370, "/obj/structure/closet/secure_closet/freezer/money", "/obj/structure/closet/secure_closet/freezer", {
	name: "freezer",
	desc: "This contains cold hard cash.",
	req_access: null,
});

// freezer.dm:54
rt.def("/obj/structure/closet/secure_closet/freezer/money/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(53);
	return f.dot;
});

// freezer.dm:57
rt.def("/obj/structure/closet/secure_closet/freezer/money/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* parent_proc();
	let i: Value = 0;
	while (i < 3) {
		yield* new_(T("/obj/item/stack/spacecash/c1000"), this);
		i++;
	}
	i = 0;
	while (i < 5) {
		yield* new_(T("/obj/item/stack/spacecash/c500"), this);
		i++;
	}
	i = 0;
	while (i < 6) {
		yield* new_(T("/obj/item/stack/spacecash/c200"), this);
		i++;
	}
	return f.dot;
}, true);

rt.type(12371, "/obj/structure/closet/secure_closet/freezer/cream_pie", "/obj/structure/closet/secure_closet/freezer", {
	name: "cream pie closet",
	desc: "Contains pies filled with cream and/or custard, you sickos.",
	req_access: null,
});

// freezer.dm:68
rt.def("/obj/structure/closet/secure_closet/freezer/cream_pie/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(46);
	return f.dot;
});

rt.type(12372, "/obj/structure/closet/secure_closet/freezer/pie", "/obj/structure/closet/secure_closet/freezer", {});

// freezer.dm:71
rt.def("/obj/structure/closet/secure_closet/freezer/pie/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/pie/cream"), this);
	return f.dot;
}, true);
