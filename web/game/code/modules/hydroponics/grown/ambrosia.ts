// Based on /tg/station's code/modules/hydroponics/grown/ambrosia.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(9987, "/obj/item/seeds/ambrosia", "/obj/item/seeds", {
	species: "ambrosiavulgaris",
	plantname: "Ambrosia Vulgaris",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/ambrosia/vulgaris"),
	lifespan: 60,
	endurance: 25,
	yield: 6,
	potency: 5,
	icon_dead: "ambrosia-dead",
	genes: null,
	reagents_add: null,
	name: "pack of ambrosia vulgaris seeds",
	desc: "These seeds grow into common ambrosia, a plant grown by and from medicine.",
	icon_state: "seed-ambrosiavulgaris",
	mutatelist: null,
});

// ambrosia.dm:24
rt.def("/obj/item/seeds/ambrosia/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.genes = list(T("/datum/plant_gene/trait/repeated_harvest"));
	this.reagents_add = rt.alist(f, ["space_drugs", 0.15, "bicaridine", 0.1, "kelotane", 0.1, "vitamin", 0.04, "nutriment", 0.05, "toxin", 0.1]);

	this.mutatelist = list(T("/obj/item/seeds/ambrosia/deus"));
	return f.dot;
});

rt.type(9988, "/obj/item/seeds/ambrosia/deus", "/obj/item/seeds/ambrosia", {
	species: "ambrosiadeus",
	plantname: "Ambrosia Deus",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/ambrosia/deus"),
	reagents_add: null,
	rarity: 40,
	name: "pack of ambrosia deus seeds",
	desc: "These seeds grow into ambrosia deus. Could it be the food of the gods..?",
	icon_state: "seed-ambrosiadeus",
	mutatelist: null,
});

// ambrosia.dm:43
rt.def("/obj/item/seeds/ambrosia/deus/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reagents_add = rt.alist(f, ["omnizine", 0.15, "synaptizine", 0.15, "space_drugs", 0.1, "vitamin", 0.04, "nutriment", 0.05]);

	this.mutatelist = list(T("/obj/item/seeds/ambrosia/gaia"));
	return f.dot;
});

rt.type(9989, "/obj/item/seeds/ambrosia/gaia", "/obj/item/seeds/ambrosia", {
	species: "ambrosia_gaia",
	plantname: "Ambrosia Gaia",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/ambrosia/gaia"),
	mutatelist: null,
	reagents_add: null,
	rarity: 30,
	genes: null,
	weed_rate: 4,
	weed_chance: 100,
	name: "pack of ambrosia gaia seeds",
	desc: "These seeds grow into ambrosia gaia, filled with infinite potential.",
	icon_state: "seed-ambrosia_gaia",
});

// ambrosia.dm:62
rt.def("/obj/item/seeds/ambrosia/gaia/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mutatelist = list(T("/obj/item/seeds/ambrosia/deus"));
	this.reagents_add = rt.alist(f, ["earthsblood", 0.05, "nutriment", 0.06, "vitamin", 0.05]);

	this.genes = list();
	return f.dot;
});
