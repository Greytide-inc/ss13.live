// From code/game/objects/items/weapons/storage/internal.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5514, "/obj/item/weapon/storage/internal", "/obj/item/weapon/storage", {
	storage_slots: 2,
	max_w_class: 2,
	max_combined_w_class: 50,
	w_class: 4,
	rustle_jimmies: 0,
});

// /obj/item/weapon/storage/internal/proc/Adjacent  (code/game/objects/items/weapons/storage/internal.dm:10)
rt.def("/obj/item/weapon/storage/internal/proc/Adjacent", function Adjacent(f: Frame, A: Value) {
	if (!truthy(rt.sv(f, "loc"))) return f.dot;
	return rt.callName(f, rt.sv(f, "loc"), "Adjacent", [live(A)]);
});

rt.type(5516, "/obj/item/weapon/storage/internal/pocket", "/obj/item/weapon/storage/internal", {
	priority: 1,
	quickdraw: 0,
});

// /obj/item/weapon/storage/internal/pocket/proc/New  (code/game/objects/items/weapons/storage/internal.dm:20)  may sleep
rt.def("/obj/item/weapon/storage/internal/pocket/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "loc"))) return f.dot;
	rt.setSv(f, "name", rt.fv(f, "name", rt.sv(f, "loc")));
	return f.dot;
}, true);

// /obj/item/weapon/storage/internal/pocket/proc/handle_item_insertion  (code/game/objects/items/weapons/storage/internal.dm:25)  may sleep
rt.def("/obj/item/weapon/storage/internal/pocket/proc/handle_item_insertion", function* handle_item_insertion(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!((truthy(live(f.dot)) && truthy(rt.sv(f, "silent"))) && !truthy(live(f.args[1])))) return f.dot;
	if (truthy(rt.sv(f, "quickdraw"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[2]), fmt("<span class='notice'>You discreetly slip ＀ into ＀. Alt-click ＀ to remove it.</span>", [live(f.args[0]), live(f.src), live(f.src)])]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[2]), fmt("<span class='notice'>You discreetly slip ＀ into ＀.", [live(f.args[0]), live(f.src)])]);
	}
	return f.dot;
}, true, { args: ["W", "prevent_warning", "user"] });

rt.type(5521, "/obj/item/weapon/storage/internal/pocket/shoes", "/obj/item/weapon/storage/internal/pocket", {
	priority: 0,
	quickdraw: 1,
	silent: 1,
	can_hold: null,
});

// /obj/item/weapon/storage/internal/pocket/shoes/proc/<init>  (code/game/objects/items/weapons/storage/internal.dm:45)
rt.def("/obj/item/weapon/storage/internal/pocket/shoes/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "can_hold", rt.list(T("/obj/item/weapon/kitchen/knife"), T("/obj/item/weapon/switchblade"), T("/obj/item/weapon/pen"), T("/obj/item/weapon/scalpel"), T("/obj/item/weapon/reagent_containers/syringe"), T("/obj/item/weapon/dnainjector"), T("/obj/item/weapon/reagent_containers/hypospray/medipen"), T("/obj/item/weapon/reagent_containers/dropper"), T("/obj/item/weapon/implanter"), T("/obj/item/weapon/screwdriver"), T("/obj/item/weapon/weldingtool/mini"), T("/obj/item/device/firing_pin")));
	return f.dot;
});

rt.type(5522, "/obj/item/weapon/storage/internal/pocket/shoes/clown", "/obj/item/weapon/storage/internal/pocket/shoes", {
	can_hold: null,
});

// /obj/item/weapon/storage/internal/pocket/shoes/clown/proc/<init>  (code/game/objects/items/weapons/storage/internal.dm:59)
rt.def("/obj/item/weapon/storage/internal/pocket/shoes/clown/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "can_hold", rt.list(T("/obj/item/weapon/kitchen/knife"), T("/obj/item/weapon/switchblade"), T("/obj/item/weapon/pen"), T("/obj/item/weapon/scalpel"), T("/obj/item/weapon/reagent_containers/syringe"), T("/obj/item/weapon/dnainjector"), T("/obj/item/weapon/reagent_containers/hypospray/medipen"), T("/obj/item/weapon/reagent_containers/dropper"), T("/obj/item/weapon/implanter"), T("/obj/item/weapon/screwdriver"), T("/obj/item/weapon/weldingtool/mini"), T("/obj/item/device/firing_pin"), T("/obj/item/weapon/bikehorn")));
	return f.dot;
});

rt.type(5519, "/obj/item/weapon/storage/internal/pocket/small/detective", "/obj/item/weapon/storage/internal/pocket/small", {
	priority: 1,
});

// /obj/item/weapon/storage/internal/pocket/small/detective/proc/PopulateContents  (code/game/objects/items/weapons/storage/internal.dm:70)  may sleep
rt.def("/obj/item/weapon/storage/internal/pocket/small/detective/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/drinks/flask/det"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5523, "/obj/item/weapon/storage/internal/pocket/pocketprotector", "/obj/item/weapon/storage/internal/pocket", {
	storage_slots: 3,
	max_w_class: 1,
	can_hold: null,
});

// /obj/item/weapon/storage/internal/pocket/pocketprotector/proc/<init>  (code/game/objects/items/weapons/storage/internal.dm:75)
rt.def("/obj/item/weapon/storage/internal/pocket/pocketprotector/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "can_hold", rt.list(T("/obj/item/weapon/pen"), T("/obj/item/toy/crayon"), T("/obj/item/weapon/lipstick"), T("/obj/item/device/flashlight/pen"), T("/obj/item/clothing/mask/cigarette")));
	return f.dot;
});

rt.type(5524, "/obj/item/weapon/storage/internal/pocket/pocketprotector/cosmetology", "/obj/item/weapon/storage/internal/pocket/pocketprotector", {});

// /obj/item/weapon/storage/internal/pocket/pocketprotector/cosmetology/proc/PopulateContents  (code/game/objects/items/weapons/storage/internal.dm:83)  may sleep
rt.def("/obj/item/weapon/storage/internal/pocket/pocketprotector/cosmetology/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/lipstick/random"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5525, "/obj/item/weapon/storage/internal/pocket/pocketprotector/full", "/obj/item/weapon/storage/internal/pocket/pocketprotector", {});

// /obj/item/weapon/storage/internal/pocket/pocketprotector/full/proc/PopulateContents  (code/game/objects/items/weapons/storage/internal.dm:87)  may sleep
rt.def("/obj/item/weapon/storage/internal/pocket/pocketprotector/full/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/weapon/pen/red"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/pen"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/pen/blue"), [live(f.src)]);
	return f.dot;
}, true);
