// From code/modules/hydroponics/grown/cocoa_vanilla.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10023, "/obj/item/seeds/cocoapod", "/obj/item/seeds", {
	species: "cocoapod",
	plantname: "Cocao Tree",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/cocoapod"),
	lifespan: 20,
	maturation: 5,
	production: 5,
	yield: 2,
	growthstages: 5,
	growing_icon: rt.rsc("icons/obj/hydroponics/growing_fruits.dmi"),
	icon_grow: "cocoapod-grow",
	icon_dead: "cocoapod-dead",
	genes: null,
	reagents_add: null,
	name: "pack of cocoa pod seeds",
	desc: "These seeds grow into cacao trees. They look fattening.",
	icon_state: "seed-cocoapod",
	mutatelist: null,
});

// /obj/item/seeds/cocoapod/proc/<init>  (code/modules/hydroponics/grown/cocoa_vanilla.dm:17)
rt.def("/obj/item/seeds/cocoapod/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "genes", rt.list(T("/datum/plant_gene/trait/repeated_harvest")));
	rt.setSv(f, "reagents_add", rt.alist(f, ["cocoa", 0.25, "nutriment", 0.10000000149011612]));
	$0 = $0;
	rt.setSv(f, "mutatelist", rt.list(T("/obj/item/seeds/cocoapod/vanillapod")));
	return f.dot;
});

rt.type(10024, "/obj/item/seeds/cocoapod/vanillapod", "/obj/item/seeds/cocoapod", {
	species: "vanillapod",
	plantname: "Vanilla Tree",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/vanillapod"),
	genes: null,
	mutatelist: null,
	reagents_add: null,
	name: "pack of vanilla pod seeds",
	desc: "These seeds grow into vanilla trees. They look fattening.",
	icon_state: "seed-vanillapod",
});

// /obj/item/seeds/cocoapod/vanillapod/proc/<init>  (code/modules/hydroponics/grown/cocoa_vanilla.dm:37)
rt.def("/obj/item/seeds/cocoapod/vanillapod/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "genes", rt.list(T("/datum/plant_gene/trait/repeated_harvest")));
	$0 = $0;
	rt.setSv(f, "mutatelist", rt.list());
	rt.setSv(f, "reagents_add", rt.alist(f, ["vanilla", 0.25, "nutriment", 0.10000000149011612]));
	return f.dot;
});
