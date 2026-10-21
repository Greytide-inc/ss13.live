// From code/modules/hydroponics/grown/melon.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10039, "/obj/item/seeds/watermelon", "/obj/item/seeds", {
	species: "watermelon",
	plantname: "Watermelon Vines",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/watermelon"),
	lifespan: 50,
	endurance: 40,
	growing_icon: rt.rsc("icons/obj/hydroponics/growing_fruits.dmi"),
	icon_dead: "watermelon-dead",
	genes: null,
	reagents_add: null,
	name: "pack of watermelon seeds",
	desc: "These seeds grow into watermelon plants.",
	icon_state: "seed-watermelon",
	mutatelist: null,
});

// /obj/item/seeds/watermelon/proc/<init>  (code/modules/hydroponics/grown/melon.dm:13)
rt.def("/obj/item/seeds/watermelon/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "genes", rt.list(T("/datum/plant_gene/trait/repeated_harvest")));
	rt.setSv(f, "reagents_add", rt.alist(f, ["water", 0.20000000298023224, "vitamin", 0.03999999910593033, "nutriment", 0.20000000298023224]));
	$0 = $0;
	rt.setSv(f, "mutatelist", rt.list(T("/obj/item/seeds/watermelon/holy")));
	return f.dot;
});

rt.type(10040, "/obj/item/seeds/watermelon/holy", "/obj/item/seeds/watermelon", {
	species: "holymelon",
	plantname: "Holy Melon Vines",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/holymelon"),
	mutatelist: null,
	reagents_add: null,
	rarity: 20,
	name: "pack of holymelon seeds",
	desc: "These seeds grow into holymelon plants.",
	icon_state: "seed-holymelon",
});

// /obj/item/seeds/watermelon/holy/proc/<init>  (code/modules/hydroponics/grown/melon.dm:37)
rt.def("/obj/item/seeds/watermelon/holy/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mutatelist", rt.list());
	rt.setSv(f, "reagents_add", rt.alist(f, ["holywater", 0.20000000298023224, "vitamin", 0.03999999910593033, "nutriment", 0.10000000149011612]));
	return f.dot;
});
