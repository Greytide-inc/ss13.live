// From code/modules/hydroponics/grown/chili.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10016, "/obj/item/seeds/chili", "/obj/item/seeds", {
	species: "chili",
	plantname: "Chili Plants",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/chili"),
	lifespan: 20,
	maturation: 5,
	production: 5,
	yield: 4,
	potency: 20,
	growing_icon: rt.rsc("icons/obj/hydroponics/growing_vegetables.dmi"),
	icon_grow: "chili-grow",
	icon_dead: "chili-dead",
	genes: null,
	reagents_add: null,
	name: "pack of chili seeds",
	desc: "These seeds grow into chili plants. HOT! HOT! HOT!",
	icon_state: "seed-chili",
	mutatelist: null,
});

// /obj/item/seeds/chili/proc/<init>  (code/modules/hydroponics/grown/chili.dm:17)
rt.def("/obj/item/seeds/chili/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "genes", rt.list(T("/datum/plant_gene/trait/repeated_harvest")));
	rt.setSv(f, "reagents_add", rt.alist(f, ["capsaicin", 0.25, "vitamin", 0.03999999910593033, "nutriment", 0.03999999910593033]));
	$0 = $0;
	rt.setSv(f, "mutatelist", rt.list(T("/obj/item/seeds/chili/ice"), T("/obj/item/seeds/chili/ghost")));
	return f.dot;
});

rt.type(10017, "/obj/item/seeds/chili/ice", "/obj/item/seeds/chili", {
	species: "chiliice",
	plantname: "Ice Pepper Plants",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/icepepper"),
	lifespan: 25,
	maturation: 4,
	production: 4,
	rarity: 20,
	mutatelist: null,
	reagents_add: null,
	name: "pack of ice pepper seeds",
	desc: "These seeds grow into ice pepper plants.",
	icon_state: "seed-icepepper",
});

// /obj/item/seeds/chili/ice/proc/<init>  (code/modules/hydroponics/grown/chili.dm:41)
rt.def("/obj/item/seeds/chili/ice/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mutatelist", rt.list());
	rt.setSv(f, "reagents_add", rt.alist(f, ["frostoil", 0.25, "vitamin", 0.019999999552965164, "nutriment", 0.019999999552965164]));
	return f.dot;
});

rt.type(10018, "/obj/item/seeds/chili/ghost", "/obj/item/seeds/chili", {
	species: "chilighost",
	plantname: "Ghost Chili Plants",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/ghost_chili"),
	endurance: 10,
	maturation: 10,
	production: 10,
	yield: 3,
	rarity: 20,
	mutatelist: null,
	reagents_add: null,
	name: "pack of ghost chili seeds",
	desc: "These seeds grow into a chili said to be the hottest in the galaxy.",
	icon_state: "seed-chilighost",
});

// /obj/item/seeds/chili/ghost/proc/<init>  (code/modules/hydroponics/grown/chili.dm:66)
rt.def("/obj/item/seeds/chili/ghost/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mutatelist", rt.list());
	rt.setSv(f, "reagents_add", rt.alist(f, ["condensedcapsaicin", 0.30000001192092896, "capsaicin", 0.550000011920929, "nutriment", 0.03999999910593033]));
	return f.dot;
});

rt.type(6292, "/obj/item/weapon/reagent_containers/food/snacks/grown/ghost_chili", "/obj/item/weapon/reagent_containers/food/snacks/grown", {
	held_mob: null,
	filling_color: "#F8F8FF",
	bitesize_mod: 4,
	seed: rt.typePath("/obj/item/seeds/chili/ghost"),
	name: "ghost chili",
	desc: "It seems to be vibrating gently.",
	icon_state: "ghostchilipepper",
	origin_tech: "biotech=4;magnets=5",
});

// /obj/item/weapon/reagent_containers/food/snacks/grown/ghost_chili/proc/attack_hand  (code/modules/hydroponics/grown/chili.dm:80)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/ghost_chili/proc/attack_hand", function* attack_hand(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.fv(f, "loc", live(f.src))])))) return f.dot;
	rt.setSv(f, "held_mob", rt.fv(f, "loc", live(f.src)));
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/weapon/reagent_containers/food/snacks/grown/ghost_chili/proc/process  (code/modules/hydroponics/grown/chili.dm:86)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/ghost_chili/proc/process", function process(f: Frame) {
	if ((truthy(rt.sv(f, "held_mob")) && isEqual(rt.fv(f, "loc", live(f.src)), rt.sv(f, "held_mob")))) {
		if (truthy(rt.callName(f, rt.sv(f, "held_mob"), "is_holding", [live(f.src)]))) {
			if ((truthy(rt.call(f, P("/proc/hasvar"), null, [rt.sv(f, "held_mob"), "gloves"])) && truthy(rt.fv(f, "gloves", rt.sv(f, "held_mob"))))) {
				return live(f.dot);
			}
			rt.modField(f, rt.sv(f, "held_mob"), "bodytemperature", 22.5, add);
			if (truthy(rt.op(f, "Prob", [], [10]))) {
				rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "held_mob"), fmt("<span class='warning'>Your hand holding ＀ burns!</span>", [live(f.src)])]);
			}
		}
	} else {
		rt.setSv(f, "held_mob", null);
		rt.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, false, { waitfor: false });
