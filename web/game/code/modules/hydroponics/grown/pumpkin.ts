// From code/modules/hydroponics/grown/pumpkin.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10067, "/obj/item/seeds/pumpkin", "/obj/item/seeds", {
	species: "pumpkin",
	plantname: "Pumpkin Vines",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/pumpkin"),
	lifespan: 50,
	endurance: 40,
	growthstages: 3,
	growing_icon: rt.rsc("icons/obj/hydroponics/growing_fruits.dmi"),
	icon_grow: "pumpkin-grow",
	icon_dead: "pumpkin-dead",
	genes: null,
	reagents_add: null,
	name: "pack of pumpkin seeds",
	desc: "These seeds grow into pumpkin vines.",
	icon_state: "seed-pumpkin",
	mutatelist: null,
});

// /obj/item/seeds/pumpkin/proc/<init>  (code/modules/hydroponics/grown/pumpkin.dm:15)
rt.def("/obj/item/seeds/pumpkin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "genes", rt.list(T("/datum/plant_gene/trait/repeated_harvest")));
	rt.setSv(f, "reagents_add", rt.alist(f, ["vitamin", 0.03999999910593033, "nutriment", 0.20000000298023224]));
	$0 = $0;
	rt.setSv(f, "mutatelist", rt.list(T("/obj/item/seeds/pumpkin/blumpkin")));
	return f.dot;
});

rt.type(6331, "/obj/item/weapon/reagent_containers/food/snacks/grown/pumpkin", "/obj/item/weapon/reagent_containers/food/snacks/grown", {
	filling_color: "#FFA500",
	bitesize_mod: 2,
	seed: rt.typePath("/obj/item/seeds/pumpkin"),
	name: "pumpkin",
	desc: "It's large and scary.",
	icon_state: "pumpkin",
});

// /obj/item/weapon/reagent_containers/food/snacks/grown/pumpkin/proc/attackby  (code/modules/hydroponics/grown/pumpkin.dm:28)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/pumpkin/proc/attackby", function* attackby(f: Frame) {
	if (truthy((yield* g.callName(f, live(f.args[0]), "is_sharp", [])))) {
		yield* g.callName(f, live(f.args[1]), "show_message", [fmt("<span class='notice'>You carve a face into ＀!</span>", [live(f.src)]), 1]);
		yield* g.new_(f, T("/obj/item/clothing/head/hardhat/pumpkinhead"), [rt.fv(f, "loc", live(f.args[1]))]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

rt.type(10068, "/obj/item/seeds/pumpkin/blumpkin", "/obj/item/seeds/pumpkin", {
	species: "blumpkin",
	plantname: "Blumpkin Vines",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/blumpkin"),
	mutatelist: null,
	reagents_add: null,
	rarity: 20,
	name: "pack of blumpkin seeds",
	desc: "These seeds grow into blumpkin vines.",
	icon_state: "seed-blumpkin",
});

// /obj/item/seeds/pumpkin/blumpkin/proc/<init>  (code/modules/hydroponics/grown/pumpkin.dm:44)
rt.def("/obj/item/seeds/pumpkin/blumpkin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mutatelist", rt.list());
	rt.setSv(f, "reagents_add", rt.alist(f, ["ammonia", 0.20000000298023224, "chlorine", 0.10000000149011612, "nutriment", 0.20000000298023224]));
	return f.dot;
});
