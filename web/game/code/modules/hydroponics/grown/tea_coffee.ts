// Based on /tg/station's code/modules/hydroponics/grown/tea_coffee.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10075, "/obj/item/seeds/tea", "/obj/item/seeds", {
	species: "teaaspera",
	plantname: "Tea Aspera Plant",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/tea"),
	lifespan: 20,
	maturation: 5,
	production: 5,
	yield: 5,
	growthstages: 5,
	icon_dead: "tea-dead",
	genes: null,
	reagents_add: null,
	name: "pack of tea aspera seeds",
	desc: "These seeds grow into tea plants.",
	icon_state: "seed-teaaspera",
	mutatelist: null,
});

// tea_coffee.dm:15
rt.def("/obj/item/seeds/tea/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.genes = list(T("/datum/plant_gene/trait/repeated_harvest"));
	this.reagents_add = rt.alist(f, ["vitamin", 0.04, "teapowder", 0.1]);

	this.mutatelist = list(T("/obj/item/seeds/tea/astra"));
	return f.dot;
});

rt.type(10076, "/obj/item/seeds/tea/astra", "/obj/item/seeds/tea", {
	species: "teaastra",
	plantname: "Tea Astra Plant",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/tea/astra"),
	mutatelist: null,
	reagents_add: null,
	rarity: 20,
	name: "pack of tea astra seeds",
	icon_state: "seed-teaastra",
});

// tea_coffee.dm:33
rt.def("/obj/item/seeds/tea/astra/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mutatelist = list();
	this.reagents_add = rt.alist(f, ["synaptizine", 0.1, "vitamin", 0.04, "teapowder", 0.1]);
	return f.dot;
});

rt.type(10077, "/obj/item/seeds/coffee", "/obj/item/seeds", {
	species: "coffeea",
	plantname: "Coffee Arabica Bush",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/coffee"),
	lifespan: 30,
	endurance: 20,
	maturation: 5,
	production: 5,
	yield: 5,
	growthstages: 5,
	icon_dead: "coffee-dead",
	genes: null,
	reagents_add: null,
	name: "pack of coffee arabica seeds",
	desc: "These seeds grow into coffee arabica bushes.",
	icon_state: "seed-coffeea",
	mutatelist: null,
});

// tea_coffee.dm:59
rt.def("/obj/item/seeds/coffee/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.genes = list(T("/datum/plant_gene/trait/repeated_harvest"));
	this.reagents_add = rt.alist(f, ["vitamin", 0.04, "coffeepowder", 0.1]);

	this.mutatelist = list(T("/obj/item/seeds/coffee/robusta"));
	return f.dot;
});

rt.type(10078, "/obj/item/seeds/coffee/robusta", "/obj/item/seeds/coffee", {
	species: "coffeer",
	plantname: "Coffee Robusta Bush",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/coffee/robusta"),
	mutatelist: null,
	reagents_add: null,
	rarity: 20,
	name: "pack of coffee robusta seeds",
	desc: "These seeds grow into coffee robusta bushes.",
	icon_state: "seed-coffeer",
});

// tea_coffee.dm:79
rt.def("/obj/item/seeds/coffee/robusta/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mutatelist = list();
	this.reagents_add = rt.alist(f, ["ephedrine", 0.1, "vitamin", 0.04, "coffeepowder", 0.1]);
	return f.dot;
});
