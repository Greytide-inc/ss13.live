// Based on /tg/station's code/modules/hydroponics/grown/tobacco.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10079, "/obj/item/seeds/tobacco", "/obj/item/seeds", {
	species: "tobacco",
	plantname: "Tobacco Plant",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/tobacco"),
	lifespan: 20,
	maturation: 5,
	production: 5,
	yield: 10,
	growthstages: 3,
	icon_dead: "tobacco-dead",
	reagents_add: null,
	name: "pack of tobacco seeds",
	desc: "These seeds grow into tobacco plants.",
	icon_state: "seed-tobacco",
	mutatelist: null,
});

// tobacco.dm:16
rt.def("/obj/item/seeds/tobacco/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reagents_add = rt.alist(f, ["nicotine", 0.03, "nutriment", 0.03]);

	this.mutatelist = list(T("/obj/item/seeds/tobacco/space"));
	return f.dot;
});

rt.type(10080, "/obj/item/seeds/tobacco/space", "/obj/item/seeds/tobacco", {
	species: "stobacco",
	plantname: "Space Tobacco Plant",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/tobacco/space"),
	mutatelist: null,
	reagents_add: null,
	rarity: 20,
	name: "pack of space tobacco seeds",
	desc: "These seeds grow into space tobacco plants.",
	icon_state: "seed-stobacco",
});

// tobacco.dm:33
rt.def("/obj/item/seeds/tobacco/space/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mutatelist = list();
	this.reagents_add = rt.alist(f, ["salbutamol", 0.05, "nicotine", 0.08, "nutriment", 0.03]);
	return f.dot;
});
