// From code/modules/hydroponics/grown/onion.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10063, "/obj/item/seeds/onion", "/obj/item/seeds", {
	species: "onion",
	plantname: "Onion Sprouts",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/onion"),
	lifespan: 20,
	maturation: 3,
	production: 4,
	yield: 6,
	endurance: 25,
	growthstages: 3,
	weed_chance: 3,
	growing_icon: rt.rsc("icons/obj/hydroponics/growing_vegetables.dmi"),
	reagents_add: null,
	name: "pack of onion seeds",
	desc: "These seeds grow into onions.",
	icon_state: "seed-onion",
	mutatelist: null,
});

// /obj/item/seeds/onion/proc/<init>  (code/modules/hydroponics/grown/onion.dm:16)
rt.def("/obj/item/seeds/onion/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reagents_add", rt.alist(f, ["vitamin", 0.03999999910593033, "nutriment", 0.10000000149011612]));
	$0 = $0;
	rt.setSv(f, "mutatelist", rt.list(T("/obj/item/seeds/onion/red")));
	return f.dot;
});

rt.type(6326, "/obj/item/weapon/reagent_containers/food/snacks/grown/onion", "/obj/item/weapon/reagent_containers/food/snacks/grown", {
	filling_color: "#C0C9A0",
	bitesize_mod: 2,
	tastes: null,
	slices_num: 2,
	seed: rt.typePath("/obj/item/seeds/onion"),
	name: "onion",
	desc: "Nothing to cry over.",
	icon_state: "onion",
	slice_path: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/onion_slice"),
});

// /obj/item/weapon/reagent_containers/food/snacks/grown/onion/proc/<init>  (code/modules/hydroponics/grown/onion.dm:26)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/onion/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["onions", 1]));
	return f.dot;
});

rt.type(10064, "/obj/item/seeds/onion/red", "/obj/item/seeds/onion", {
	species: "onion_red",
	plantname: "Red Onion Sprouts",
	weed_chance: 1,
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/onion/red"),
	reagents_add: null,
	name: "pack of red onion seeds",
	desc: "For growing exceptionally potent onions.",
	icon_state: "seed-onionred",
});

// /obj/item/seeds/onion/red/proc/<init>  (code/modules/hydroponics/grown/onion.dm:38)
rt.def("/obj/item/seeds/onion/red/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reagents_add", rt.alist(f, ["vitamin", 0.03999999910593033, "nutriment", 0.10000000149011612, "tearjuice", 0.05000000074505806]));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/food/snacks/grown/onion/proc/slice  (code/modules/hydroponics/grown/onion.dm:49)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/onion/proc/slice", function* slice(f: Frame) {
	let S: Value = null, splat_location: Value = null;
	f.vars = () => [S, splat_location];
	S = (yield* g.new_(f, T("/datum/effect_system/smoke_spread/chem"), []));
	splat_location = rt.getStep(f, live(f.src), 0);
	yield* g.callName(f, live(S), "attach", [live(splat_location)]);
	yield* g.callName(f, live(S), "set_up", [rt.sv(f, "reagents"), 0, live(splat_location), 0]);
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		yield* g.callName(f, live(S), "start", []);
		return 1;
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(S)]);
	return f.dot;
}, true, { args: ["accuracy", "W", "user"] });

rt.type(6355, "/obj/item/weapon/reagent_containers/food/snacks/onion_slice", "/obj/item/weapon/reagent_containers/food/snacks", {
	filling_color: "#C0C9A0",
	cooked_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/onionrings"),
	name: "onion slices",
	desc: "Rings, not for wearing.",
	icon_state: "onionslice",
	list_reagents: null,
	gender: "plural",
});

// /obj/item/weapon/reagent_containers/food/snacks/onion_slice/proc/<init>  (code/modules/hydroponics/grown/onion.dm:62)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/onion_slice/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 5, "vitamin", 2]));
	return f.dot;
});

rt.type(6356, "/obj/item/weapon/reagent_containers/food/snacks/onion_slice/red", "/obj/item/weapon/reagent_containers/food/snacks/onion_slice", {
	filling_color: "#C29ACF",
	name: "red onion slices",
	desc: "They shine like exceptionally low quality amethyst.",
	icon_state: "onionslice_red",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/onion_slice/red/proc/<init>  (code/modules/hydroponics/grown/onion.dm:72)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/onion_slice/red/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 5, "vitamin", 2, "tearjuice", 2.5]));
	return f.dot;
});
