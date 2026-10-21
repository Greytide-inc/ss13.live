// From code/modules/mining/money_bag.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/item/weapon/storage/bag/money/proc/<init>  (code/modules/mining/money_bag.dm:15)
rt.def("/obj/item/weapon/storage/bag/money/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "can_hold", rt.list(T("/obj/item/weapon/coin"), T("/obj/item/stack/spacecash")));
	return f.dot;
});

rt.type(5543, "/obj/item/weapon/storage/bag/money/vault", "/obj/item/weapon/storage/bag/money", {});

// /obj/item/weapon/storage/bag/money/vault/proc/New  (code/modules/mining/money_bag.dm:19)  may sleep
rt.def("/obj/item/weapon/storage/bag/money/vault/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/weapon/coin/silver"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/coin/silver"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/coin/silver"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/coin/silver"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/coin/gold"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/coin/gold"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/coin/adamantine"), [live(f.src)]);
	return f.dot;
}, true);
