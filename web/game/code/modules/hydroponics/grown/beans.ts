// Based on /tg/station's code/modules/hydroponics/grown/beans.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(9996, "/obj/item/seeds/soya", "/obj/item/seeds", {
	species: "soybean",
	plantname: "Soybean Plants",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/soybeans"),
	maturation: 4,
	production: 4,
	potency: 15,
	growthstages: 4,
	growing_icon: rt.rsc("icons/obj/hydroponics/growing_vegetables.dmi"),
	icon_grow: "soybean-grow",
	icon_dead: "soybean-dead",
	genes: null,
	reagents_add: null,
	name: "pack of soybean seeds",
	desc: "These seeds grow into soybean plants.",
	icon_state: "seed-soybean",
	mutatelist: null,
});

// beans.dm:16
rt.def("/obj/item/seeds/soya/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.genes = list(T("/datum/plant_gene/trait/repeated_harvest"));
	this.reagents_add = rt.alist(f, ["vitamin", 0.04, "nutriment", 0.05]);

	this.mutatelist = list(T("/obj/item/seeds/soya/koi"));
	return f.dot;
});

rt.type(9997, "/obj/item/seeds/soya/koi", "/obj/item/seeds/soya", {
	species: "koibean",
	plantname: "Koibean Plants",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/koibeans"),
	potency: 10,
	mutatelist: null,
	reagents_add: null,
	rarity: 20,
	name: "pack of koibean seeds",
	desc: "These seeds grow into koibean plants.",
	icon_state: "seed-koibean",
});

// beans.dm:38
rt.def("/obj/item/seeds/soya/koi/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mutatelist = list();
	this.reagents_add = rt.alist(f, ["carpotoxin", 0.1, "vitamin", 0.04, "nutriment", 0.05]);
	return f.dot;
});
