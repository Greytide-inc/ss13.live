// From code/game/objects/items/weapons/vending_items.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7373, "/obj/item/weapon/vending_refill", "/obj/item/weapon", {
	machine_name: "Generic",
	charges: null,
	init_charges: null,
	flags: 64,
	throw_speed: 1,
	throw_range: 7,
	name: "resupply canister",
	icon: rt.rsc("icons/obj/vending_restock.dmi"),
	icon_state: "refill_snack",
	item_state: "restock_unit",
	force: 7,
	throwforce: 10,
	w_class: 4,
	armor: null,
});

// /obj/item/weapon/vending_refill/proc/<init>  (code/game/objects/items/weapons/vending_items.dm:14)
rt.def("/obj/item/weapon/vending_refill/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "charges", rt.list(0, 0, 0));
	rt.setSv(f, "init_charges", rt.list(0, 0, 0));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 70, "acid", 30]));
	return f.dot;
});

// /obj/item/weapon/vending_refill/proc/New  (code/game/objects/items/weapons/vending_items.dm:20)  may sleep
rt.def("/obj/item/weapon/vending_refill/proc/New", function* New(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = -1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "name", fmt("ÿ\u0016＀ restocking unit", [rt.sv(f, "machine_name")]));
	if (!(truthy((yield* g.call(f, P("/proc/isnum"), null, [live(f.args[0])]))) && rt.gt(live(f.args[0]), -1))) return f.dot;
	rt.setAt(rt.sv(f, "charges"), 1, live(f.args[0]));
	return f.dot;
}, true, { args: ["amt"] });

// /obj/item/weapon/vending_refill/proc/examine  (code/game/objects/items/weapons/vending_items.dm:26)
rt.def("/obj/item/weapon/vending_refill/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (rt.gt(rt.index(rt.sv(f, "charges"), 1), 0)) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("It can restock ＀ item(s).", [add(add(rt.index(rt.sv(f, "charges"), 1), rt.index(rt.sv(f, "charges"), 2)), rt.index(rt.sv(f, "charges"), 3))])]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "It's empty!"]);
	}
	return f.dot;
}, false, { args: ["user"] });
