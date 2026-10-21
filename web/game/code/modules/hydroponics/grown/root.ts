// From code/modules/hydroponics/grown/root.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10071, "/obj/item/seeds/carrot", "/obj/item/seeds", {
	species: "carrot",
	plantname: "Carrots",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/carrot"),
	maturation: 10,
	production: 1,
	yield: 5,
	growthstages: 3,
	growing_icon: rt.rsc("icons/obj/hydroponics/growing_vegetables.dmi"),
	reagents_add: null,
	name: "pack of carrot seeds",
	desc: "These seeds grow into carrots.",
	icon_state: "seed-carrot",
	mutatelist: null,
});

// /obj/item/seeds/carrot/proc/<init>  (code/modules/hydroponics/grown/root.dm:15)
rt.def("/obj/item/seeds/carrot/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reagents_add", rt.alist(f, ["oculine", 0.25, "vitamin", 0.03999999910593033, "nutriment", 0.05000000074505806]));
	$0 = $0;
	rt.setSv(f, "mutatelist", rt.list(T("/obj/item/seeds/carrot/parsnip")));
	return f.dot;
});

rt.type(6334, "/obj/item/weapon/reagent_containers/food/snacks/grown/carrot", "/obj/item/weapon/reagent_containers/food/snacks/grown", {
	filling_color: "#FFA500",
	bitesize_mod: 2,
	seed: rt.typePath("/obj/item/seeds/carrot"),
	name: "carrot",
	desc: "It's good for the eyes!",
	icon_state: "carrot",
});

// /obj/item/weapon/reagent_containers/food/snacks/grown/carrot/proc/attackby  (code/modules/hydroponics/grown/root.dm:26)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/carrot/proc/attackby", function* attackby(f: Frame) {
	let Shiv: Value = null;
	f.vars = () => [Shiv];
	if (truthy((yield* g.callName(f, live(f.args[0]), "is_sharp", [])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You sharpen the carrot into a shiv with ＀.</span>", [live(f.args[0])])]);
		Shiv = (yield* g.new_(f, T("/obj/item/weapon/kitchen/knife/carrotshiv"), []));
		yield* g.srcCall(f, "remove_item_from_storage", live(f.args[1]));
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		yield* g.callName(f, live(f.args[1]), "put_in_hands", [live(Shiv)]);
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

rt.type(10072, "/obj/item/seeds/carrot/parsnip", "/obj/item/seeds/carrot", {
	species: "parsnip",
	plantname: "Parsnip",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/parsnip"),
	icon_dead: "carrot-dead",
	mutatelist: null,
	reagents_add: null,
	name: "pack of parsnip seeds",
	desc: "These seeds grow into parsnips.",
	icon_state: "seed-parsnip",
});

// /obj/item/seeds/carrot/parsnip/proc/<init>  (code/modules/hydroponics/grown/root.dm:44)
rt.def("/obj/item/seeds/carrot/parsnip/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mutatelist", rt.list());
	rt.setSv(f, "reagents_add", rt.alist(f, ["vitamin", 0.05000000074505806, "nutriment", 0.05000000074505806]));
	return f.dot;
});

rt.type(10073, "/obj/item/seeds/whitebeet", "/obj/item/seeds", {
	species: "whitebeet",
	plantname: "White-Beet Plants",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/whitebeet"),
	lifespan: 60,
	endurance: 50,
	yield: 6,
	growing_icon: rt.rsc("icons/obj/hydroponics/growing_vegetables.dmi"),
	icon_dead: "whitebeet-dead",
	reagents_add: null,
	name: "pack of white-beet seeds",
	desc: "These seeds grow into sugary beet producing plants.",
	icon_state: "seed-whitebeet",
	mutatelist: null,
});

// /obj/item/seeds/whitebeet/proc/<init>  (code/modules/hydroponics/grown/root.dm:69)
rt.def("/obj/item/seeds/whitebeet/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reagents_add", rt.alist(f, ["vitamin", 0.03999999910593033, "sugar", 0.20000000298023224, "nutriment", 0.05000000074505806]));
	$0 = $0;
	rt.setSv(f, "mutatelist", rt.list(T("/obj/item/seeds/redbeet")));
	return f.dot;
});

rt.type(10074, "/obj/item/seeds/redbeet", "/obj/item/seeds", {
	species: "redbeet",
	plantname: "Red-Beet Plants",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/redbeet"),
	lifespan: 60,
	endurance: 50,
	yield: 6,
	growing_icon: rt.rsc("icons/obj/hydroponics/growing_vegetables.dmi"),
	icon_dead: "whitebeet-dead",
	genes: null,
	reagents_add: null,
	name: "pack of redbeet seeds",
	desc: "These seeds grow into red beet producing plants.",
	icon_state: "seed-redbeet",
});

// /obj/item/seeds/redbeet/proc/<init>  (code/modules/hydroponics/grown/root.dm:92)
rt.def("/obj/item/seeds/redbeet/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "genes", rt.list(T("/datum/plant_gene/trait/maxchem")));
	rt.setSv(f, "reagents_add", rt.alist(f, ["vitamin", 0.05000000074505806, "nutriment", 0.05000000074505806]));
	return f.dot;
});
