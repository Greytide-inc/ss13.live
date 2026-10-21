// From code/modules/hydroponics/grown/potato.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10065, "/obj/item/seeds/potato", "/obj/item/seeds", {
	species: "potato",
	plantname: "Potato Plants",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/potato"),
	lifespan: 30,
	maturation: 10,
	production: 1,
	yield: 4,
	growthstages: 4,
	growing_icon: rt.rsc("icons/obj/hydroponics/growing_vegetables.dmi"),
	icon_grow: "potato-grow",
	icon_dead: "potato-dead",
	genes: null,
	reagents_add: null,
	name: "pack of potato seeds",
	desc: "Boil 'em! Mash 'em! Stick 'em in a stew!",
	icon_state: "seed-potato",
	mutatelist: null,
});

// /obj/item/seeds/potato/proc/<init>  (code/modules/hydroponics/grown/potato.dm:17)
rt.def("/obj/item/seeds/potato/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "genes", rt.list(T("/datum/plant_gene/trait/battery")));
	rt.setSv(f, "reagents_add", rt.alist(f, ["vitamin", 0.03999999910593033, "nutriment", 0.10000000149011612]));
	$0 = $0;
	rt.setSv(f, "mutatelist", rt.list(T("/obj/item/seeds/potato/sweet")));
	return f.dot;
});

rt.type(6328, "/obj/item/weapon/reagent_containers/food/snacks/grown/potato", "/obj/item/weapon/reagent_containers/food/snacks/grown", {
	filling_color: "#E9967A",
	bitesize: 100,
	seed: rt.typePath("/obj/item/seeds/potato"),
	name: "potato",
	desc: "Boil 'em! Mash 'em! Stick 'em in a stew!",
	icon_state: "potato",
});

// /obj/item/weapon/reagent_containers/food/snacks/grown/potato/proc/attackby  (code/modules/hydroponics/grown/potato.dm:39)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/potato/proc/attackby", function* attackby(f: Frame) {
	let Wedges: Value = null;
	f.vars = () => [Wedges];
	if (truthy((yield* g.callName(f, live(f.args[0]), "is_sharp", [])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You cut the potato into wedges with ＀.</span>", [live(f.args[0])])]);
		Wedges = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/grown/potato/wedges"), []));
		yield* g.srcCall(f, "remove_item_from_storage", live(f.args[1]));
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		yield* g.callName(f, live(f.args[1]), "put_in_hands", [live(Wedges)]);
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

rt.type(10066, "/obj/item/seeds/potato/sweet", "/obj/item/seeds/potato", {
	species: "sweetpotato",
	plantname: "Sweet Potato Plants",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/potato/sweet"),
	mutatelist: null,
	reagents_add: null,
	name: "pack of sweet potato seeds",
	desc: "These seeds grow into sweet potato plants.",
	icon_state: "seed-sweetpotato",
});

// /obj/item/seeds/potato/sweet/proc/<init>  (code/modules/hydroponics/grown/potato.dm:57)
rt.def("/obj/item/seeds/potato/sweet/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mutatelist", rt.list());
	rt.setSv(f, "reagents_add", rt.alist(f, ["vitamin", 0.10000000149011612, "sugar", 0.10000000149011612, "nutriment", 0.10000000149011612]));
	return f.dot;
});
