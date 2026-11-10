// Based on /tg/station's code/modules/hydroponics/grown/eggplant.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10027, "/obj/item/seeds/eggplant", "/obj/item/seeds", {
	species: "eggplant",
	plantname: "Eggplants",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/eggplant"),
	yield: 2,
	potency: 20,
	growing_icon: rt.rsc("icons/obj/hydroponics/growing_vegetables.dmi"),
	icon_grow: "eggplant-grow",
	icon_dead: "eggplant-dead",
	genes: null,
	reagents_add: null,
	name: "pack of eggplant seeds",
	desc: "These seeds grow to produce berries that look nothing like eggs.",
	icon_state: "seed-eggplant",
	mutatelist: null,
});

// eggplant.dm:14
rt.def("/obj/item/seeds/eggplant/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.genes = list(T("/datum/plant_gene/trait/repeated_harvest"));
	this.reagents_add = rt.alist(f, ["vitamin", 0.04, "nutriment", 0.1]);

	this.mutatelist = list(T("/obj/item/seeds/eggplant/eggy"));
	return f.dot;
});

rt.type(10028, "/obj/item/seeds/eggplant/eggy", "/obj/item/seeds/eggplant", {
	species: "eggy",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/shell/eggy"),
	lifespan: 75,
	production: 12,
	mutatelist: null,
	reagents_add: null,
	desc: "These seeds grow to produce berries that look a lot like eggs.",
	icon_state: "seed-eggy",
});

// eggplant.dm:34
rt.def("/obj/item/seeds/eggplant/eggy/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mutatelist = list();
	this.reagents_add = rt.alist(f, ["nutriment", 0.1]);
	return f.dot;
});
