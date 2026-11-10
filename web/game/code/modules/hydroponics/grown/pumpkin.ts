// Based on /tg/station's code/modules/hydroponics/grown/pumpkin.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10067, "/obj/item/seeds/pumpkin", "/obj/item/seeds", {
	species: "pumpkin",
	plantname: "Pumpkin Vines",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/pumpkin"),
	lifespan: 50,
	endurance: 40,
	growthstages: 3,
	growing_icon: rt.rsc("icons/obj/hydroponics/growing_fruits.dmi"),
	icon_grow: "pumpkin-grow",
	icon_dead: "pumpkin-dead",
	genes: null,
	reagents_add: null,
	name: "pack of pumpkin seeds",
	desc: "These seeds grow into pumpkin vines.",
	icon_state: "seed-pumpkin",
	mutatelist: null,
});

// pumpkin.dm:15
rt.def("/obj/item/seeds/pumpkin/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.genes = list(T("/datum/plant_gene/trait/repeated_harvest"));
	this.reagents_add = rt.alist(f, ["vitamin", 0.04, "nutriment", 0.2]);

	this.mutatelist = list(T("/obj/item/seeds/pumpkin/blumpkin"));
	return f.dot;
});

rt.type(6331, "/obj/item/weapon/reagent_containers/food/snacks/grown/pumpkin", "/obj/item/weapon/reagent_containers/food/snacks/grown", {
	filling_color: "#FFA500",
	bitesize_mod: 2,
	seed: rt.typePath("/obj/item/seeds/pumpkin"),
	name: "pumpkin",
	desc: "It's large and scary.",
	icon_state: "pumpkin",
});

// pumpkin.dm:28
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/pumpkin/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (W.is_sharp()) {
		user.show_message(`<span class='notice'>You carve a face into ${this}!</span>`, 1);
		yield* new_(T("/obj/item/clothing/head/hardhat/pumpkinhead"), user.loc);
		yield* qdel(this);
		return f.dot;
	} else {
		return (yield* parent_proc());
	}
}, true);

rt.type(10068, "/obj/item/seeds/pumpkin/blumpkin", "/obj/item/seeds/pumpkin", {
	species: "blumpkin",
	plantname: "Blumpkin Vines",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/blumpkin"),
	mutatelist: null,
	reagents_add: null,
	rarity: 20,
	name: "pack of blumpkin seeds",
	desc: "These seeds grow into blumpkin vines.",
	icon_state: "seed-blumpkin",
});

// pumpkin.dm:44
rt.def("/obj/item/seeds/pumpkin/blumpkin/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mutatelist = list();
	this.reagents_add = rt.alist(f, ["ammonia", 0.2, "chlorine", 0.1, "nutriment", 0.2]);
	return f.dot;
});
