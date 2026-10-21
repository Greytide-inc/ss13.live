// From code/modules/hydroponics/grown/beans.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9996, "/obj/item/seeds/soya", "/obj/item/seeds", {
	species: "soybean",
	plantname: "Soybean Plants",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/soybeans"),
	maturation: 4,
	production: 4,
	potency: 15,
	growthstages: 4,
	growing_icon: rt.rsc("icons/obj/hydroponics/growing_vegetables.dmi"),
	icon_grow: "soybean-grow",
	icon_dead: "soybean-dead",
	genes: null,
	reagents_add: null,
	name: "pack of soybean seeds",
	desc: "These seeds grow into soybean plants.",
	icon_state: "seed-soybean",
	mutatelist: null,
});

// /obj/item/seeds/soya/proc/<init>  (code/modules/hydroponics/grown/beans.dm:16)
rt.def("/obj/item/seeds/soya/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "genes", rt.list(T("/datum/plant_gene/trait/repeated_harvest")));
	rt.setSv(f, "reagents_add", rt.alist(f, ["vitamin", 0.03999999910593033, "nutriment", 0.05000000074505806]));
	$0 = $0;
	rt.setSv(f, "mutatelist", rt.list(T("/obj/item/seeds/soya/koi")));
	return f.dot;
});

rt.type(9997, "/obj/item/seeds/soya/koi", "/obj/item/seeds/soya", {
	species: "koibean",
	plantname: "Koibean Plants",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/koibeans"),
	potency: 10,
	mutatelist: null,
	reagents_add: null,
	rarity: 20,
	name: "pack of koibean seeds",
	desc: "These seeds grow into koibean plants.",
	icon_state: "seed-koibean",
});

// /obj/item/seeds/soya/koi/proc/<init>  (code/modules/hydroponics/grown/beans.dm:38)
rt.def("/obj/item/seeds/soya/koi/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mutatelist", rt.list());
	rt.setSv(f, "reagents_add", rt.alist(f, ["carpotoxin", 0.10000000149011612, "vitamin", 0.03999999910593033, "nutriment", 0.05000000074505806]));
	return f.dot;
});
