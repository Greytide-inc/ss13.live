// From code/modules/hydroponics/grown/ambrosia.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/item/seeds/ambrosia/proc/<init>  (code/modules/hydroponics/grown/ambrosia.dm:24)
rt.def("/obj/item/seeds/ambrosia/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "genes", rt.list(T("/datum/plant_gene/trait/repeated_harvest")));
	rt.setSv(f, "reagents_add", rt.alist(f, ["space_drugs", 0.15000000596046448, "bicaridine", 0.10000000149011612, "kelotane", 0.10000000149011612, "vitamin", 0.03999999910593033, "nutriment", 0.05000000074505806, "toxin", 0.10000000149011612]));
	$0 = $0;
	rt.setSv(f, "mutatelist", rt.list(T("/obj/item/seeds/ambrosia/deus")));
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

// /obj/item/seeds/ambrosia/deus/proc/<init>  (code/modules/hydroponics/grown/ambrosia.dm:43)
rt.def("/obj/item/seeds/ambrosia/deus/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reagents_add", rt.alist(f, ["omnizine", 0.15000000596046448, "synaptizine", 0.15000000596046448, "space_drugs", 0.10000000149011612, "vitamin", 0.03999999910593033, "nutriment", 0.05000000074505806]));
	$0 = $0;
	rt.setSv(f, "mutatelist", rt.list(T("/obj/item/seeds/ambrosia/gaia")));
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

// /obj/item/seeds/ambrosia/gaia/proc/<init>  (code/modules/hydroponics/grown/ambrosia.dm:62)
rt.def("/obj/item/seeds/ambrosia/gaia/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mutatelist", rt.list(T("/obj/item/seeds/ambrosia/deus")));
	rt.setSv(f, "reagents_add", rt.alist(f, ["earthsblood", 0.05000000074505806, "nutriment", 0.05999999865889549, "vitamin", 0.05000000074505806]));
	$0 = $0;
	rt.setSv(f, "genes", rt.list());
	return f.dot;
});
