// Based on /tg/station's code/modules/hydroponics/grown/root.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10071, "/obj/item/seeds/carrot", "/obj/item/seeds", {
	species: "carrot",
	plantname: "Carrots",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/carrot"),
	maturation: 10,
	production: 1,
	yield: 5,
	growthstages: 3,
	growing_icon: rt.rsc("icons/obj/hydroponics/growing_vegetables.dmi"),
	reagents_add: null,
	name: "pack of carrot seeds",
	desc: "These seeds grow into carrots.",
	icon_state: "seed-carrot",
	mutatelist: null,
});

// root.dm:15
rt.def("/obj/item/seeds/carrot/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reagents_add = rt.alist(f, ["oculine", 0.25, "vitamin", 0.04, "nutriment", 0.05]);

	this.mutatelist = list(T("/obj/item/seeds/carrot/parsnip"));
	return f.dot;
});

rt.type(6334, "/obj/item/weapon/reagent_containers/food/snacks/grown/carrot", "/obj/item/weapon/reagent_containers/food/snacks/grown", {
	filling_color: "#FFA500",
	bitesize_mod: 2,
	seed: rt.typePath("/obj/item/seeds/carrot"),
	name: "carrot",
	desc: "It's good for the eyes!",
	icon_state: "carrot",
});

// root.dm:26
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/carrot/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let Shiv: Value = null;
	if (I.is_sharp()) {
		to_chat(user, `<span class='notice'>You sharpen the carrot into a shiv with ${I}.</span>`);
		Shiv = (yield* new_(T("/obj/item/weapon/kitchen/knife/carrotshiv")));
		yield* this.remove_item_from_storage(user);
		yield* qdel(this);
		yield* user.put_in_hands(Shiv);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

rt.type(10072, "/obj/item/seeds/carrot/parsnip", "/obj/item/seeds/carrot", {
	species: "parsnip",
	plantname: "Parsnip",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/parsnip"),
	icon_dead: "carrot-dead",
	mutatelist: null,
	reagents_add: null,
	name: "pack of parsnip seeds",
	desc: "These seeds grow into parsnips.",
	icon_state: "seed-parsnip",
});

// root.dm:44
rt.def("/obj/item/seeds/carrot/parsnip/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mutatelist = list();
	this.reagents_add = rt.alist(f, ["vitamin", 0.05, "nutriment", 0.05]);
	return f.dot;
});

rt.type(10073, "/obj/item/seeds/whitebeet", "/obj/item/seeds", {
	species: "whitebeet",
	plantname: "White-Beet Plants",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/whitebeet"),
	lifespan: 60,
	endurance: 50,
	yield: 6,
	growing_icon: rt.rsc("icons/obj/hydroponics/growing_vegetables.dmi"),
	icon_dead: "whitebeet-dead",
	reagents_add: null,
	name: "pack of white-beet seeds",
	desc: "These seeds grow into sugary beet producing plants.",
	icon_state: "seed-whitebeet",
	mutatelist: null,
});

// root.dm:69
rt.def("/obj/item/seeds/whitebeet/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reagents_add = rt.alist(f, ["vitamin", 0.04, "sugar", 0.2, "nutriment", 0.05]);

	this.mutatelist = list(T("/obj/item/seeds/redbeet"));
	return f.dot;
});

rt.type(10074, "/obj/item/seeds/redbeet", "/obj/item/seeds", {
	species: "redbeet",
	plantname: "Red-Beet Plants",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/redbeet"),
	lifespan: 60,
	endurance: 50,
	yield: 6,
	growing_icon: rt.rsc("icons/obj/hydroponics/growing_vegetables.dmi"),
	icon_dead: "whitebeet-dead",
	genes: null,
	reagents_add: null,
	name: "pack of redbeet seeds",
	desc: "These seeds grow into red beet producing plants.",
	icon_state: "seed-redbeet",
});

// root.dm:92
rt.def("/obj/item/seeds/redbeet/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.genes = list(T("/datum/plant_gene/trait/maxchem"));
	this.reagents_add = rt.alist(f, ["vitamin", 0.05, "nutriment", 0.05]);
	return f.dot;
});
