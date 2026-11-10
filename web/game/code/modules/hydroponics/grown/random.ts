// Based on /tg/station's code/modules/hydroponics/grown/random.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(10069, "/obj/item/seeds/random", "/obj/item/seeds", {
	species: "?????",
	plantname: "strange plant",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/random"),
	icon_grow: "xpod-grow",
	icon_dead: "xpod-dead",
	icon_harvest: "xpod-harvest",
	growthstages: 4,
	name: "pack of strange seeds",
	desc: "Mysterious seeds as strange as their name implies. Spooky",
	icon_state: "seed-x",
});

// random.dm:16
rt.def("/obj/item/seeds/random/proc/New", function* New(f: Frame) {
	this.randomize_stats();
	yield* parent_proc();
	if (prob(60)) {
		yield* this.add_random_reagents();
	}
	if (prob(50)) {
		yield* this.add_random_traits();
	}
	yield* this.add_random_plant_type(35);
	return f.dot;
}, true);
