// From code/modules/hydroponics/grown/apple.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9990, "/obj/item/seeds/apple", "/obj/item/seeds", {
	species: "apple",
	plantname: "Apple Tree",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/apple"),
	lifespan: 55,
	endurance: 35,
	yield: 5,
	growing_icon: rt.rsc("icons/obj/hydroponics/growing_fruits.dmi"),
	icon_grow: "apple-grow",
	icon_dead: "apple-dead",
	genes: null,
	reagents_add: null,
	name: "pack of apple seeds",
	desc: "These seeds grow into apple trees.",
	icon_state: "seed-apple",
	mutatelist: null,
});

// /obj/item/seeds/apple/proc/<init>  (code/modules/hydroponics/grown/apple.dm:15)
rt.def("/obj/item/seeds/apple/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "genes", rt.list(T("/datum/plant_gene/trait/repeated_harvest")));
	rt.setSv(f, "reagents_add", rt.alist(f, ["vitamin", 0.03999999910593033, "nutriment", 0.10000000149011612]));
	$0 = $0;
	rt.setSv(f, "mutatelist", rt.list(T("/obj/item/seeds/apple/gold")));
	return f.dot;
});

rt.type(9991, "/obj/item/seeds/apple/poisoned", "/obj/item/seeds/apple", {
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/apple/poisoned"),
	mutatelist: null,
	reagents_add: null,
	rarity: 50,
});

// /obj/item/seeds/apple/poisoned/proc/<init>  (code/modules/hydroponics/grown/apple.dm:30)
rt.def("/obj/item/seeds/apple/poisoned/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mutatelist", rt.list());
	rt.setSv(f, "reagents_add", rt.alist(f, ["zombiepowder", 0.5, "vitamin", 0.03999999910593033, "nutriment", 0.10000000149011612]));
	return f.dot;
});

rt.type(9992, "/obj/item/seeds/apple/gold", "/obj/item/seeds/apple", {
	species: "goldapple",
	plantname: "Golden Apple Tree",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/apple/gold"),
	maturation: 10,
	production: 10,
	mutatelist: null,
	reagents_add: null,
	rarity: 40,
	name: "pack of golden apple seeds",
	desc: "These seeds grow into golden apple trees. Good thing there are no firebirds in space.",
	icon_state: "seed-goldapple",
});

// /obj/item/seeds/apple/gold/proc/<init>  (code/modules/hydroponics/grown/apple.dm:47)
rt.def("/obj/item/seeds/apple/gold/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mutatelist", rt.list());
	rt.setSv(f, "reagents_add", rt.alist(f, ["gold", 0.20000000298023224, "vitamin", 0.03999999910593033, "nutriment", 0.10000000149011612]));
	return f.dot;
});
