// Based on /tg/station's code/game/objects/items/weapons/vending_items.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



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

// vending_items.dm:14
rt.def("/obj/item/weapon/vending_refill/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.charges = list(0, 0, 0);
	this.init_charges = list(0, 0, 0);
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 70, "acid", 30]);
	return f.dot;
});

// vending_items.dm:20
rt.def("/obj/item/weapon/vending_refill/proc/New", function* New(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = -1;
	}
	yield* parent_proc();
	this.name = `ÿ\u0016${this.machine_name} restocking unit`;
	if (!(isnum(f.args[0]) && f.args[0] > -1)) return f.dot;
	rt.setAt(this.charges, 1, f.args[0]);
	return f.dot;
}, true, { args: ["amt"] });

// vending_items.dm:26
rt.def("/obj/item/weapon/vending_refill/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (rt.index(this.charges, 1) > 0) {
		to_chat(user, `It can restock ${rt.index(this.charges, 1) + rt.index(this.charges, 2) + rt.index(this.charges, 3)} item(s).`);
	} else {
		to_chat(user, "It's empty!");
	}
	return f.dot;
}, false);
