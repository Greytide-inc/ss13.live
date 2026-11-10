// Based on /tg/station's code/modules/hydroponics/grown/melon.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10039, "/obj/item/seeds/watermelon", "/obj/item/seeds", {
	species: "watermelon",
	plantname: "Watermelon Vines",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/watermelon"),
	lifespan: 50,
	endurance: 40,
	growing_icon: rt.rsc("icons/obj/hydroponics/growing_fruits.dmi"),
	icon_dead: "watermelon-dead",
	genes: null,
	reagents_add: null,
	name: "pack of watermelon seeds",
	desc: "These seeds grow into watermelon plants.",
	icon_state: "seed-watermelon",
	mutatelist: null,
});

// melon.dm:13
rt.def("/obj/item/seeds/watermelon/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.genes = list(T("/datum/plant_gene/trait/repeated_harvest"));
	this.reagents_add = rt.alist(f, ["water", 0.2, "vitamin", 0.04, "nutriment", 0.2]);

	this.mutatelist = list(T("/obj/item/seeds/watermelon/holy"));
	return f.dot;
});

rt.type(10040, "/obj/item/seeds/watermelon/holy", "/obj/item/seeds/watermelon", {
	species: "holymelon",
	plantname: "Holy Melon Vines",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/holymelon"),
	mutatelist: null,
	reagents_add: null,
	rarity: 20,
	name: "pack of holymelon seeds",
	desc: "These seeds grow into holymelon plants.",
	icon_state: "seed-holymelon",
});

// melon.dm:37
rt.def("/obj/item/seeds/watermelon/holy/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mutatelist = list();
	this.reagents_add = rt.alist(f, ["holywater", 0.2, "vitamin", 0.04, "nutriment", 0.1]);
	return f.dot;
});
