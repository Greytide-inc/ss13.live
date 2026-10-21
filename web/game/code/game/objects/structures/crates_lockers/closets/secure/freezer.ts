// From code/game/objects/structures/crates_lockers/closets/secure/freezer.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12365, "/obj/structure/closet/secure_closet/freezer/kitchen", "/obj/structure/closet/secure_closet/freezer", {
	name: "kitchen Cabinet",
	req_access: null,
});

// /obj/structure/closet/secure_closet/freezer/kitchen/proc/<init>  (code/game/objects/structures/crates_lockers/closets/secure/freezer.dm:6)
rt.def("/obj/structure/closet/secure_closet/freezer/kitchen/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(28));
	return f.dot;
});

// /obj/structure/closet/secure_closet/freezer/kitchen/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/secure/freezer.dm:9)  may sleep
rt.def("/obj/structure/closet/secure_closet/freezer/kitchen/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	f.vars = () => [i];
	yield* g.callSuper(f, [], rt.Args.Same);
	i = null;
	i = 0;
	while (rt.lt(live(i), 3)) {
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/condiment/flour"), [live(f.src)]);
		i = rt.inc(live(i), 1);
	}
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/condiment/rice"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/condiment/sugar"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(12366, "/obj/structure/closet/secure_closet/freezer/kitchen/maintenance", "/obj/structure/closet/secure_closet/freezer/kitchen", {
	name: "maintenance refrigerator",
	desc: "This refrigerator looks quite dusty, is there anything edible still inside?",
	req_access: null,
});

// /obj/structure/closet/secure_closet/freezer/kitchen/maintenance/proc/<init>  (code/game/objects/structures/crates_lockers/closets/secure/freezer.dm:18)
rt.def("/obj/structure/closet/secure_closet/freezer/kitchen/maintenance/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list());
	return f.dot;
});

// /obj/structure/closet/secure_closet/freezer/kitchen/maintenance/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/secure/freezer.dm:21)  may sleep
rt.def("/obj/structure/closet/secure_closet/freezer/kitchen/maintenance/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	f.vars = () => [i];
	yield* g.callSuper(f, [], rt.Args.Same);
	i = null;
	i = 0;
	while (rt.lt(live(i), 5)) {
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/condiment/milk"), [live(f.src)]);
		i = rt.inc(live(i), 1);
	}
	i = null;
	i = 0;
	while (rt.lt(live(i), 5)) {
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/condiment/soymilk"), [live(f.src)]);
		i = rt.inc(live(i), 1);
	}
	i = null;
	i = 0;
	while (rt.lt(live(i), 2)) {
		yield* g.new_(f, T("/obj/item/weapon/storage/fancy/egg_box"), [live(f.src)]);
		i = rt.inc(live(i), 1);
	}
	return f.dot;
}, true);

rt.type(12367, "/obj/structure/closet/secure_closet/freezer/kitchen/mining", "/obj/structure/closet/secure_closet/freezer/kitchen", {
	req_access: null,
});

// /obj/structure/closet/secure_closet/freezer/kitchen/mining/proc/<init>  (code/game/objects/structures/crates_lockers/closets/secure/freezer.dm:30)
rt.def("/obj/structure/closet/secure_closet/freezer/kitchen/mining/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list());
	return f.dot;
});

rt.type(12368, "/obj/structure/closet/secure_closet/freezer/meat", "/obj/structure/closet/secure_closet/freezer", {
	name: "meat fridge",
});

// /obj/structure/closet/secure_closet/freezer/meat/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/secure/freezer.dm:36)  may sleep
rt.def("/obj/structure/closet/secure_closet/freezer/meat/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	f.vars = () => [i];
	yield* g.callSuper(f, [], rt.Args.Same);
	i = null;
	i = 0;
	while (rt.lt(live(i), 4)) {
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/monkey"), [live(f.src)]);
		i = rt.inc(live(i), 1);
	}
	return f.dot;
}, true);

rt.type(12369, "/obj/structure/closet/secure_closet/freezer/fridge", "/obj/structure/closet/secure_closet/freezer", {
	name: "refrigerator",
});

// /obj/structure/closet/secure_closet/freezer/fridge/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/secure/freezer.dm:43)  may sleep
rt.def("/obj/structure/closet/secure_closet/freezer/fridge/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	f.vars = () => [i];
	yield* g.callSuper(f, [], rt.Args.Same);
	i = null;
	i = 0;
	while (rt.lt(live(i), 5)) {
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/condiment/milk"), [live(f.src)]);
		i = rt.inc(live(i), 1);
	}
	i = null;
	i = 0;
	while (rt.lt(live(i), 5)) {
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/condiment/soymilk"), [live(f.src)]);
		i = rt.inc(live(i), 1);
	}
	i = null;
	i = 0;
	while (rt.lt(live(i), 2)) {
		yield* g.new_(f, T("/obj/item/weapon/storage/fancy/egg_box"), [live(f.src)]);
		i = rt.inc(live(i), 1);
	}
	return f.dot;
}, true);

rt.type(12370, "/obj/structure/closet/secure_closet/freezer/money", "/obj/structure/closet/secure_closet/freezer", {
	name: "freezer",
	desc: "This contains cold hard cash.",
	req_access: null,
});

// /obj/structure/closet/secure_closet/freezer/money/proc/<init>  (code/game/objects/structures/crates_lockers/closets/secure/freezer.dm:54)
rt.def("/obj/structure/closet/secure_closet/freezer/money/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(53));
	return f.dot;
});

// /obj/structure/closet/secure_closet/freezer/money/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/secure/freezer.dm:57)  may sleep
rt.def("/obj/structure/closet/secure_closet/freezer/money/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	f.vars = () => [i];
	yield* g.callSuper(f, [], rt.Args.Same);
	i = null;
	i = 0;
	while (rt.lt(live(i), 3)) {
		yield* g.new_(f, T("/obj/item/stack/spacecash/c1000"), [live(f.src)]);
		i = rt.inc(live(i), 1);
	}
	i = null;
	i = 0;
	while (rt.lt(live(i), 5)) {
		yield* g.new_(f, T("/obj/item/stack/spacecash/c500"), [live(f.src)]);
		i = rt.inc(live(i), 1);
	}
	i = null;
	i = 0;
	while (rt.lt(live(i), 6)) {
		yield* g.new_(f, T("/obj/item/stack/spacecash/c200"), [live(f.src)]);
		i = rt.inc(live(i), 1);
	}
	return f.dot;
}, true);

rt.type(12371, "/obj/structure/closet/secure_closet/freezer/cream_pie", "/obj/structure/closet/secure_closet/freezer", {
	name: "cream pie closet",
	desc: "Contains pies filled with cream and/or custard, you sickos.",
	req_access: null,
});

// /obj/structure/closet/secure_closet/freezer/cream_pie/proc/<init>  (code/game/objects/structures/crates_lockers/closets/secure/freezer.dm:68)
rt.def("/obj/structure/closet/secure_closet/freezer/cream_pie/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(46));
	return f.dot;
});

rt.type(12372, "/obj/structure/closet/secure_closet/freezer/pie", "/obj/structure/closet/secure_closet/freezer", {});

// /obj/structure/closet/secure_closet/freezer/pie/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/secure/freezer.dm:71)  may sleep
rt.def("/obj/structure/closet/secure_closet/freezer/pie/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/pie/cream"), [live(f.src)]);
	return f.dot;
}, true);
