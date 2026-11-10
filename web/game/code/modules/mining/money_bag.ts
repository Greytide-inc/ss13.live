// Based on /tg/station's code/modules/mining/money_bag.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(5542, "/obj/item/weapon/storage/bag/money", "/obj/item/weapon/storage/bag", {
	name: "money bag",
	icon_state: "moneybag",
	force: 10,
	throwforce: 0,
	resistance_flags: 4,
	obj_integrity: 100,
	max_integrity: 100,
	w_class: 4,
	max_w_class: 3,
	storage_slots: 80,
	max_combined_w_class: 40,
	can_hold: null,
});

// money_bag.dm:15
rt.def("/obj/item/weapon/storage/bag/money/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.can_hold = list(T("/obj/item/weapon/coin"), T("/obj/item/stack/spacecash"));
	return f.dot;
});

rt.type(5543, "/obj/item/weapon/storage/bag/money/vault", "/obj/item/weapon/storage/bag/money", {});

// money_bag.dm:19
rt.def("/obj/item/weapon/storage/bag/money/vault/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/item/weapon/coin/silver"), this);
	yield* new_(T("/obj/item/weapon/coin/silver"), this);
	yield* new_(T("/obj/item/weapon/coin/silver"), this);
	yield* new_(T("/obj/item/weapon/coin/silver"), this);
	yield* new_(T("/obj/item/weapon/coin/gold"), this);
	yield* new_(T("/obj/item/weapon/coin/gold"), this);
	yield* new_(T("/obj/item/weapon/coin/adamantine"), this);
	return f.dot;
}, true);
