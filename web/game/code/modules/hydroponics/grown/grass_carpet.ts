// Based on /tg/station's code/modules/hydroponics/grown/grass_carpet.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10036, "/obj/item/seeds/grass", "/obj/item/seeds", {
	species: "grass",
	plantname: "Grass",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/grass"),
	lifespan: 40,
	endurance: 40,
	maturation: 2,
	production: 5,
	yield: 5,
	growthstages: 2,
	icon_grow: "grass-grow",
	icon_dead: "grass-dead",
	genes: null,
	reagents_add: null,
	name: "pack of grass seeds",
	desc: "These seeds grow into grass. Yummy!",
	icon_state: "seed-grass",
	mutatelist: null,
});

// grass_carpet.dm:17
rt.def("/obj/item/seeds/grass/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.genes = list(T("/datum/plant_gene/trait/repeated_harvest"));
	this.reagents_add = rt.alist(f, ["nutriment", 0.02, "hydrogen", 0.05]);

	this.mutatelist = list(T("/obj/item/seeds/grass/carpet"));
	return f.dot;
});

rt.type(6307, "/obj/item/weapon/reagent_containers/food/snacks/grown/grass", "/obj/item/weapon/reagent_containers/food/snacks/grown", {
	tile_coefficient: 0.02,
	stacktype: rt.typePath("/obj/item/stack/tile/grass"),
	filling_color: "#32CD32",
	bitesize_mod: 2,
	seed: rt.typePath("/obj/item/seeds/grass"),
	name: "grass",
	desc: "Green and lush.",
	icon_state: "grassclump",
});

// grass_carpet.dm:32
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/grass/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let G: Value = null, _T: Value = null;
	to_chat(user, "<span class='notice'>You prepare the astroturf.</span>");
	let grassAmt: Value = 1 + round(this.seed.potency * this.tile_coefficient);
	for (G of each(user.loc, T("/obj/item/weapon/reagent_containers/food/snacks/grown/grass"))) {
		if (G.type != this.type) {
			continue;
		}
		grassAmt += 1 + round(G.seed.potency * this.tile_coefficient);
		yield* qdel(G);
	}
	let GT: Value = (yield* new_(this.stacktype, user.loc));
	while (grassAmt > GT.max_amount) {
		GT.amount = GT.max_amount;
		grassAmt -= GT.max_amount;
		GT = (yield* new_(this.stacktype, user.loc));
	}
	GT.amount = grassAmt;
	for (_T of each(user.loc, T("/obj/item/stack/tile"))) {
		if ((_T.type == this.stacktype && _T.amount < _T.max_amount)) {
			yield* GT.merge(_T);
			if (GT.amount <= 0) {
				break;
			}
		}
	}
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(10037, "/obj/item/seeds/grass/carpet", "/obj/item/seeds/grass", {
	species: "carpet",
	plantname: "Carpet",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/grass/carpet"),
	mutatelist: null,
	rarity: 10,
	name: "pack of carpet seeds",
	desc: "These seeds grow into stylish carpet samples.",
	icon_state: "seed-carpet",
});

// grass_carpet.dm:61
rt.def("/obj/item/seeds/grass/carpet/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mutatelist = list();
	return f.dot;
});
