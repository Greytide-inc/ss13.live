// Based on /tg/station's code/modules/hydroponics/grown/cocoa_vanilla.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


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

// cocoa_vanilla.dm:17
rt.def("/obj/item/seeds/cocoapod/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.genes = list(T("/datum/plant_gene/trait/repeated_harvest"));
	this.reagents_add = rt.alist(f, ["cocoa", 0.25, "nutriment", 0.1]);

	this.mutatelist = list(T("/obj/item/seeds/cocoapod/vanillapod"));
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

// cocoa_vanilla.dm:37
rt.def("/obj/item/seeds/cocoapod/vanillapod/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.genes = list(T("/datum/plant_gene/trait/repeated_harvest"));

	this.mutatelist = list();
	this.reagents_add = rt.alist(f, ["vanilla", 0.25, "nutriment", 0.1]);
	return f.dot;
});
