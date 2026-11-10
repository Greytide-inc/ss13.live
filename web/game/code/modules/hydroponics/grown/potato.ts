// Based on /tg/station's code/modules/hydroponics/grown/potato.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10065, "/obj/item/seeds/potato", "/obj/item/seeds", {
	species: "potato",
	plantname: "Potato Plants",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/potato"),
	lifespan: 30,
	maturation: 10,
	production: 1,
	yield: 4,
	growthstages: 4,
	growing_icon: rt.rsc("icons/obj/hydroponics/growing_vegetables.dmi"),
	icon_grow: "potato-grow",
	icon_dead: "potato-dead",
	genes: null,
	reagents_add: null,
	name: "pack of potato seeds",
	desc: "Boil 'em! Mash 'em! Stick 'em in a stew!",
	icon_state: "seed-potato",
	mutatelist: null,
});

// potato.dm:17
rt.def("/obj/item/seeds/potato/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.genes = list(T("/datum/plant_gene/trait/battery"));
	this.reagents_add = rt.alist(f, ["vitamin", 0.04, "nutriment", 0.1]);

	this.mutatelist = list(T("/obj/item/seeds/potato/sweet"));
	return f.dot;
});

rt.type(6328, "/obj/item/weapon/reagent_containers/food/snacks/grown/potato", "/obj/item/weapon/reagent_containers/food/snacks/grown", {
	filling_color: "#E9967A",
	bitesize: 100,
	seed: rt.typePath("/obj/item/seeds/potato"),
	name: "potato",
	desc: "Boil 'em! Mash 'em! Stick 'em in a stew!",
	icon_state: "potato",
});

// potato.dm:39
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/potato/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let Wedges: Value = null;
	if (W.is_sharp()) {
		to_chat(user, `<span class='notice'>You cut the potato into wedges with ${W}.</span>`);
		Wedges = (yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/grown/potato/wedges")));
		yield* this.remove_item_from_storage(user);
		yield* qdel(this);
		yield* user.put_in_hands(Wedges);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

rt.type(10066, "/obj/item/seeds/potato/sweet", "/obj/item/seeds/potato", {
	species: "sweetpotato",
	plantname: "Sweet Potato Plants",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/potato/sweet"),
	mutatelist: null,
	reagents_add: null,
	name: "pack of sweet potato seeds",
	desc: "These seeds grow into sweet potato plants.",
	icon_state: "seed-sweetpotato",
});

// potato.dm:57
rt.def("/obj/item/seeds/potato/sweet/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mutatelist = list();
	this.reagents_add = rt.alist(f, ["vitamin", 0.1, "sugar", 0.1, "nutriment", 0.1]);
	return f.dot;
});
