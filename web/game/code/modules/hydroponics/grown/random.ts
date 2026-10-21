// From code/modules/hydroponics/grown/random.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/item/seeds/random/proc/New  (code/modules/hydroponics/grown/random.dm:16)  may sleep
rt.def("/obj/item/seeds/random/proc/New", function* New(f: Frame) {
	yield* g.srcCall(f, "randomize_stats");
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.op(f, "Prob", [], [60]))) {
		yield* g.srcCall(f, "add_random_reagents");
	}
	if (truthy(rt.op(f, "Prob", [], [50]))) {
		yield* g.srcCall(f, "add_random_traits");
	}
	yield* g.srcCall(f, "add_random_plant_type", 35);
	return f.dot;
}, true);
