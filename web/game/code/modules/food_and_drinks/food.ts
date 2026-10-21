// From code/modules/food_and_drinks/food.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5800, "/obj/item/weapon/reagent_containers/food", "/obj/item/weapon/reagent_containers", {
	container_type: 1024,
	possible_transfer_amounts: null,
	volume: 50,
	resistance_flags: 4,
});

// /obj/item/weapon/reagent_containers/food/proc/<init>  (code/modules/food_and_drinks/food.dm:5)
rt.def("/obj/item/weapon/reagent_containers/food/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_transfer_amounts", rt.list());
	return f.dot;
});

// /obj/item/weapon/reagent_containers/food/proc/New  (code/modules/food_and_drinks/food.dm:11)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "pixel_x", (yield* g.call(f, P("/proc/rand"), null, [-5, 5])));
	rt.setSv(f, "pixel_y", (yield* g.call(f, P("/proc/rand"), null, [-5, 5])));
	return f.dot;
}, true);
