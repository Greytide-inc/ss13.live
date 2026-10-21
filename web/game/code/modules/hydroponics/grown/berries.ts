// From code/modules/hydroponics/grown/berries.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9998, "/obj/item/seeds/berry", "/obj/item/seeds", {
	species: "berry",
	plantname: "Berry Bush",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/berries"),
	lifespan: 20,
	maturation: 5,
	production: 5,
	yield: 2,
	growing_icon: rt.rsc("icons/obj/hydroponics/growing_fruits.dmi"),
	icon_grow: "berry-grow",
	icon_dead: "berry-dead",
	genes: null,
	reagents_add: null,
	name: "pack of berry seeds",
	desc: "These seeds grow into berry bushes.",
	icon_state: "seed-berry",
	mutatelist: null,
});

// /obj/item/seeds/berry/proc/<init>  (code/modules/hydroponics/grown/berries.dm:16)
rt.def("/obj/item/seeds/berry/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "genes", rt.list(T("/datum/plant_gene/trait/repeated_harvest")));
	rt.setSv(f, "reagents_add", rt.alist(f, ["vitamin", 0.03999999910593033, "nutriment", 0.10000000149011612]));
	$0 = $0;
	rt.setSv(f, "mutatelist", rt.list(T("/obj/item/seeds/berry/glow"), T("/obj/item/seeds/berry/poison")));
	return f.dot;
});

rt.type(9999, "/obj/item/seeds/berry/poison", "/obj/item/seeds/berry", {
	species: "poisonberry",
	plantname: "Poison-Berry Bush",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/berries/poison"),
	reagents_add: null,
	rarity: 10,
	name: "pack of poison-berry seeds",
	desc: "These seeds grow into poison-berry bushes.",
	icon_state: "seed-poisonberry",
	mutatelist: null,
});

// /obj/item/seeds/berry/poison/proc/<init>  (code/modules/hydroponics/grown/berries.dm:38)
rt.def("/obj/item/seeds/berry/poison/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reagents_add", rt.alist(f, ["cyanide", 0.15000000596046448, "tirizene", 0.20000000298023224, "vitamin", 0.03999999910593033, "nutriment", 0.10000000149011612]));
	$0 = $0;
	rt.setSv(f, "mutatelist", rt.list(T("/obj/item/seeds/berry/death")));
	return f.dot;
});

rt.type(10000, "/obj/item/seeds/berry/death", "/obj/item/seeds/berry", {
	species: "deathberry",
	plantname: "Death Berry Bush",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/berries/death"),
	lifespan: 30,
	potency: 50,
	mutatelist: null,
	reagents_add: null,
	rarity: 30,
	name: "pack of death-berry seeds",
	desc: "These seeds grow into death berries.",
	icon_state: "seed-deathberry",
});

// /obj/item/seeds/berry/death/proc/<init>  (code/modules/hydroponics/grown/berries.dm:58)
rt.def("/obj/item/seeds/berry/death/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mutatelist", rt.list());
	rt.setSv(f, "reagents_add", rt.alist(f, ["coniine", 0.07999999821186066, "tirizene", 0.10000000149011612, "vitamin", 0.03999999910593033, "nutriment", 0.10000000149011612]));
	return f.dot;
});

rt.type(10001, "/obj/item/seeds/berry/glow", "/obj/item/seeds/berry", {
	species: "glowberry",
	plantname: "Glow-Berry Bush",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/berries/glow"),
	lifespan: 30,
	endurance: 25,
	mutatelist: null,
	genes: null,
	reagents_add: null,
	rarity: 20,
	name: "pack of glow-berry seeds",
	desc: "These seeds grow into glow-berry bushes.",
	icon_state: "seed-glowberry",
});

// /obj/item/seeds/berry/glow/proc/<init>  (code/modules/hydroponics/grown/berries.dm:79)
rt.def("/obj/item/seeds/berry/glow/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mutatelist", rt.list());
	$0 = $0;
	rt.setSv(f, "genes", rt.list(T("/datum/plant_gene/trait/glow/berry"), T("/datum/plant_gene/trait/noreact"), T("/datum/plant_gene/trait/repeated_harvest")));
	rt.setSv(f, "reagents_add", rt.alist(f, ["uranium", 0.25, "iodine", 0.20000000298023224, "vitamin", 0.03999999910593033, "nutriment", 0.10000000149011612]));
	return f.dot;
});

rt.type(10002, "/obj/item/seeds/cherry", "/obj/item/seeds", {
	species: "cherry",
	plantname: "Cherry Tree",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/cherries"),
	lifespan: 35,
	endurance: 35,
	maturation: 5,
	production: 5,
	growthstages: 5,
	growing_icon: rt.rsc("icons/obj/hydroponics/growing_fruits.dmi"),
	icon_grow: "cherry-grow",
	icon_dead: "cherry-dead",
	genes: null,
	reagents_add: null,
	name: "pack of cherry pits",
	desc: "Careful not to crack a tooth on one... That'd be the pits.",
	icon_state: "seed-cherry",
	mutatelist: null,
});

// /obj/item/seeds/cherry/proc/<init>  (code/modules/hydroponics/grown/berries.dm:108)
rt.def("/obj/item/seeds/cherry/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "genes", rt.list(T("/datum/plant_gene/trait/repeated_harvest")));
	rt.setSv(f, "reagents_add", rt.alist(f, ["nutriment", 0.07000000029802322, "sugar", 0.07000000029802322]));
	$0 = $0;
	rt.setSv(f, "mutatelist", rt.list(T("/obj/item/seeds/cherry/blue")));
	return f.dot;
});

rt.type(10003, "/obj/item/seeds/cherry/blue", "/obj/item/seeds/cherry", {
	species: "bluecherry",
	plantname: "Blue Cherry Tree",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/bluecherries"),
	mutatelist: null,
	reagents_add: null,
	rarity: 10,
	name: "pack of blue cherry pits",
	desc: "The blue kind of cherries",
	icon_state: "seed-bluecherry",
});

// /obj/item/seeds/cherry/blue/proc/<init>  (code/modules/hydroponics/grown/berries.dm:129)
rt.def("/obj/item/seeds/cherry/blue/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mutatelist", rt.list());
	rt.setSv(f, "reagents_add", rt.alist(f, ["nutriment", 0.07000000029802322, "sugar", 0.07000000029802322]));
	return f.dot;
});

rt.type(10005, "/obj/item/seeds/grape", "/obj/item/seeds", {
	species: "grape",
	plantname: "Grape Vine",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/grapes"),
	lifespan: 50,
	endurance: 25,
	maturation: 3,
	production: 5,
	yield: 4,
	growthstages: 2,
	growing_icon: rt.rsc("icons/obj/hydroponics/growing_fruits.dmi"),
	icon_grow: "grape-grow",
	icon_dead: "grape-dead",
	genes: null,
	reagents_add: null,
	name: "pack of grape seeds",
	desc: "These seeds grow into grape vines.",
	icon_state: "seed-grapes",
	mutatelist: null,
});

// /obj/item/seeds/grape/proc/<init>  (code/modules/hydroponics/grown/berries.dm:158)
rt.def("/obj/item/seeds/grape/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "genes", rt.list(T("/datum/plant_gene/trait/repeated_harvest")));
	rt.setSv(f, "reagents_add", rt.alist(f, ["vitamin", 0.03999999910593033, "nutriment", 0.10000000149011612, "sugar", 0.10000000149011612]));
	$0 = $0;
	rt.setSv(f, "mutatelist", rt.list(T("/obj/item/seeds/grape/green")));
	return f.dot;
});

rt.type(10006, "/obj/item/seeds/grape/green", "/obj/item/seeds/grape", {
	species: "greengrape",
	plantname: "Green-Grape Vine",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/grapes/green"),
	reagents_add: null,
	mutatelist: null,
	name: "pack of green grape seeds",
	desc: "These seeds grow into green-grape vines.",
	icon_state: "seed-greengrapes",
});

// /obj/item/seeds/grape/green/proc/<init>  (code/modules/hydroponics/grown/berries.dm:179)
rt.def("/obj/item/seeds/grape/green/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reagents_add", rt.alist(f, ["kelotane", 0.20000000298023224, "vitamin", 0.03999999910593033, "nutriment", 0.10000000149011612, "sugar", 0.10000000149011612]));
	$0 = $0;
	rt.setSv(f, "mutatelist", rt.list());
	return f.dot;
});
