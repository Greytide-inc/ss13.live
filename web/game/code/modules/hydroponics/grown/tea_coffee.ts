// From code/modules/hydroponics/grown/tea_coffee.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10075, "/obj/item/seeds/tea", "/obj/item/seeds", {
	species: "teaaspera",
	plantname: "Tea Aspera Plant",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/tea"),
	lifespan: 20,
	maturation: 5,
	production: 5,
	yield: 5,
	growthstages: 5,
	icon_dead: "tea-dead",
	genes: null,
	reagents_add: null,
	name: "pack of tea aspera seeds",
	desc: "These seeds grow into tea plants.",
	icon_state: "seed-teaaspera",
	mutatelist: null,
});

// /obj/item/seeds/tea/proc/<init>  (code/modules/hydroponics/grown/tea_coffee.dm:15)
rt.def("/obj/item/seeds/tea/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "genes", rt.list(T("/datum/plant_gene/trait/repeated_harvest")));
	rt.setSv(f, "reagents_add", rt.alist(f, ["vitamin", 0.03999999910593033, "teapowder", 0.10000000149011612]));
	$0 = $0;
	rt.setSv(f, "mutatelist", rt.list(T("/obj/item/seeds/tea/astra")));
	return f.dot;
});

rt.type(10076, "/obj/item/seeds/tea/astra", "/obj/item/seeds/tea", {
	species: "teaastra",
	plantname: "Tea Astra Plant",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/tea/astra"),
	mutatelist: null,
	reagents_add: null,
	rarity: 20,
	name: "pack of tea astra seeds",
	icon_state: "seed-teaastra",
});

// /obj/item/seeds/tea/astra/proc/<init>  (code/modules/hydroponics/grown/tea_coffee.dm:33)
rt.def("/obj/item/seeds/tea/astra/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mutatelist", rt.list());
	rt.setSv(f, "reagents_add", rt.alist(f, ["synaptizine", 0.10000000149011612, "vitamin", 0.03999999910593033, "teapowder", 0.10000000149011612]));
	return f.dot;
});

rt.type(10077, "/obj/item/seeds/coffee", "/obj/item/seeds", {
	species: "coffeea",
	plantname: "Coffee Arabica Bush",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/coffee"),
	lifespan: 30,
	endurance: 20,
	maturation: 5,
	production: 5,
	yield: 5,
	growthstages: 5,
	icon_dead: "coffee-dead",
	genes: null,
	reagents_add: null,
	name: "pack of coffee arabica seeds",
	desc: "These seeds grow into coffee arabica bushes.",
	icon_state: "seed-coffeea",
	mutatelist: null,
});

// /obj/item/seeds/coffee/proc/<init>  (code/modules/hydroponics/grown/tea_coffee.dm:59)
rt.def("/obj/item/seeds/coffee/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "genes", rt.list(T("/datum/plant_gene/trait/repeated_harvest")));
	rt.setSv(f, "reagents_add", rt.alist(f, ["vitamin", 0.03999999910593033, "coffeepowder", 0.10000000149011612]));
	$0 = $0;
	rt.setSv(f, "mutatelist", rt.list(T("/obj/item/seeds/coffee/robusta")));
	return f.dot;
});

rt.type(10078, "/obj/item/seeds/coffee/robusta", "/obj/item/seeds/coffee", {
	species: "coffeer",
	plantname: "Coffee Robusta Bush",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/coffee/robusta"),
	mutatelist: null,
	reagents_add: null,
	rarity: 20,
	name: "pack of coffee robusta seeds",
	desc: "These seeds grow into coffee robusta bushes.",
	icon_state: "seed-coffeer",
});

// /obj/item/seeds/coffee/robusta/proc/<init>  (code/modules/hydroponics/grown/tea_coffee.dm:79)
rt.def("/obj/item/seeds/coffee/robusta/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mutatelist", rt.list());
	rt.setSv(f, "reagents_add", rt.alist(f, ["ephedrine", 0.10000000149011612, "vitamin", 0.03999999910593033, "coffeepowder", 0.10000000149011612]));
	return f.dot;
});
