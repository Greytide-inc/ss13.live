// From code/modules/hydroponics/grown/eggplant.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/item/seeds/eggplant/proc/<init>  (code/modules/hydroponics/grown/eggplant.dm:14)
rt.def("/obj/item/seeds/eggplant/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "genes", rt.list(T("/datum/plant_gene/trait/repeated_harvest")));
	rt.setSv(f, "reagents_add", rt.alist(f, ["vitamin", 0.03999999910593033, "nutriment", 0.10000000149011612]));
	$0 = $0;
	rt.setSv(f, "mutatelist", rt.list(T("/obj/item/seeds/eggplant/eggy")));
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

// /obj/item/seeds/eggplant/eggy/proc/<init>  (code/modules/hydroponics/grown/eggplant.dm:34)
rt.def("/obj/item/seeds/eggplant/eggy/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mutatelist", rt.list());
	rt.setSv(f, "reagents_add", rt.alist(f, ["nutriment", 0.10000000149011612]));
	return f.dot;
});
