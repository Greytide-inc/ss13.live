// From code/modules/hydroponics/grown/tobacco.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10079, "/obj/item/seeds/tobacco", "/obj/item/seeds", {
	species: "tobacco",
	plantname: "Tobacco Plant",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/tobacco"),
	lifespan: 20,
	maturation: 5,
	production: 5,
	yield: 10,
	growthstages: 3,
	icon_dead: "tobacco-dead",
	reagents_add: null,
	name: "pack of tobacco seeds",
	desc: "These seeds grow into tobacco plants.",
	icon_state: "seed-tobacco",
	mutatelist: null,
});

// /obj/item/seeds/tobacco/proc/<init>  (code/modules/hydroponics/grown/tobacco.dm:16)
rt.def("/obj/item/seeds/tobacco/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reagents_add", rt.alist(f, ["nicotine", 0.029999999329447746, "nutriment", 0.029999999329447746]));
	$0 = $0;
	rt.setSv(f, "mutatelist", rt.list(T("/obj/item/seeds/tobacco/space")));
	return f.dot;
});

rt.type(10080, "/obj/item/seeds/tobacco/space", "/obj/item/seeds/tobacco", {
	species: "stobacco",
	plantname: "Space Tobacco Plant",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/tobacco/space"),
	mutatelist: null,
	reagents_add: null,
	rarity: 20,
	name: "pack of space tobacco seeds",
	desc: "These seeds grow into space tobacco plants.",
	icon_state: "seed-stobacco",
});

// /obj/item/seeds/tobacco/space/proc/<init>  (code/modules/hydroponics/grown/tobacco.dm:33)
rt.def("/obj/item/seeds/tobacco/space/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mutatelist", rt.list());
	rt.setSv(f, "reagents_add", rt.alist(f, ["salbutamol", 0.05000000074505806, "nicotine", 0.07999999821186066, "nutriment", 0.029999999329447746]));
	return f.dot;
});
