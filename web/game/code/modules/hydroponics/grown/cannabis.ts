// From code/modules/hydroponics/grown/cannabis.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10007, "/obj/item/seeds/cannabis", "/obj/item/seeds", {
	species: "cannabis",
	plantname: "Cannabis Plant",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/cannabis"),
	maturation: 8,
	potency: 20,
	growthstages: 1,
	growing_icon: rt.rsc("icons/obj/hydroponics/growing.dmi"),
	icon_grow: "cannabis-grow",
	icon_dead: "cannabis-dead",
	genes: null,
	reagents_add: null,
	name: "pack of cannabis seeds",
	desc: "Taxable.",
	icon_state: "seed-cannabis",
	mutatelist: null,
});

// /obj/item/seeds/cannabis/proc/<init>  (code/modules/hydroponics/grown/cannabis.dm:15)
rt.def("/obj/item/seeds/cannabis/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "genes", rt.list(T("/datum/plant_gene/trait/repeated_harvest")));
	rt.setSv(f, "reagents_add", rt.alist(f, ["space_drugs", 0.15000000596046448, "lipolicide", 0.3499999940395355]));
	$0 = $0;
	rt.setSv(f, "mutatelist", rt.list(T("/obj/item/seeds/cannabis/rainbow"), T("/obj/item/seeds/cannabis/death"), T("/obj/item/seeds/cannabis/white"), T("/obj/item/seeds/cannabis/ultimate")));
	return f.dot;
});

rt.type(10008, "/obj/item/seeds/cannabis/rainbow", "/obj/item/seeds/cannabis", {
	species: "megacannabis",
	plantname: "Rainbow Weed",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/cannabis/rainbow"),
	mutatelist: null,
	reagents_add: null,
	rarity: 40,
	name: "pack of rainbow weed seeds",
	desc: "These seeds grow into rainbow weed. Groovy.",
	icon_state: "seed-megacannabis",
});

// /obj/item/seeds/cannabis/rainbow/proc/<init>  (code/modules/hydroponics/grown/cannabis.dm:30)
rt.def("/obj/item/seeds/cannabis/rainbow/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mutatelist", rt.list());
	rt.setSv(f, "reagents_add", rt.alist(f, ["mindbreaker", 0.15000000596046448, "lipolicide", 0.3499999940395355]));
	return f.dot;
});

rt.type(10009, "/obj/item/seeds/cannabis/death", "/obj/item/seeds/cannabis", {
	species: "blackcannabis",
	plantname: "Deathweed",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/cannabis/death"),
	mutatelist: null,
	reagents_add: null,
	rarity: 40,
	name: "pack of deathweed seeds",
	desc: "These seeds grow into deathweed. Not groovy.",
	icon_state: "seed-blackcannabis",
});

// /obj/item/seeds/cannabis/death/proc/<init>  (code/modules/hydroponics/grown/cannabis.dm:41)
rt.def("/obj/item/seeds/cannabis/death/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mutatelist", rt.list());
	rt.setSv(f, "reagents_add", rt.alist(f, ["cyanide", 0.3499999940395355, "space_drugs", 0.15000000596046448, "lipolicide", 0.15000000596046448]));
	return f.dot;
});

rt.type(10010, "/obj/item/seeds/cannabis/white", "/obj/item/seeds/cannabis", {
	species: "whitecannabis",
	plantname: "Lifeweed",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/cannabis/white"),
	mutatelist: null,
	reagents_add: null,
	rarity: 40,
	name: "pack of lifeweed seeds",
	desc: "I will give unto him that is munchies of the fountain of the cravings of life, freely.",
	icon_state: "seed-whitecannabis",
});

// /obj/item/seeds/cannabis/white/proc/<init>  (code/modules/hydroponics/grown/cannabis.dm:52)
rt.def("/obj/item/seeds/cannabis/white/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mutatelist", rt.list());
	rt.setSv(f, "reagents_add", rt.alist(f, ["omnizine", 0.3499999940395355, "space_drugs", 0.15000000596046448, "lipolicide", 0.15000000596046448]));
	return f.dot;
});

rt.type(10011, "/obj/item/seeds/cannabis/ultimate", "/obj/item/seeds/cannabis", {
	species: "ocannabis",
	plantname: "Omega Weed",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/cannabis/ultimate"),
	mutatelist: null,
	reagents_add: null,
	rarity: 69,
	name: "pack of omega weed seeds",
	desc: "These seeds grow into omega weed.",
	icon_state: "seed-ocannabis",
});

// /obj/item/seeds/cannabis/ultimate/proc/<init>  (code/modules/hydroponics/grown/cannabis.dm:64)
rt.def("/obj/item/seeds/cannabis/ultimate/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mutatelist", rt.list());
	rt.setSv(f, "reagents_add", rt.alist(f, ["space_drugs", 0.30000001192092896, "mindbreaker", 0.30000001192092896, "mercury", 0.15000000596046448, "lithium", 0.15000000596046448, "atropine", 0.15000000596046448, "haloperidol", 0.15000000596046448, "methamphetamine", 0.15000000596046448, "capsaicin", 0.15000000596046448, "barbers_aid", 0.15000000596046448, "bath_salts", 0.15000000596046448, "itching_powder", 0.15000000596046448, "crank", 0.15000000596046448, "krokodil", 0.15000000596046448, "histamine", 0.15000000596046448, "lipolicide", 0.15000000596046448]));
	return f.dot;
});
