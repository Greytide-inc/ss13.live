// From code/modules/hydroponics/grown/grass_carpet.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10036, "/obj/item/seeds/grass", "/obj/item/seeds", {
	species: "grass",
	plantname: "Grass",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/grass"),
	lifespan: 40,
	endurance: 40,
	maturation: 2,
	production: 5,
	yield: 5,
	growthstages: 2,
	icon_grow: "grass-grow",
	icon_dead: "grass-dead",
	genes: null,
	reagents_add: null,
	name: "pack of grass seeds",
	desc: "These seeds grow into grass. Yummy!",
	icon_state: "seed-grass",
	mutatelist: null,
});

// /obj/item/seeds/grass/proc/<init>  (code/modules/hydroponics/grown/grass_carpet.dm:17)
rt.def("/obj/item/seeds/grass/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "genes", rt.list(T("/datum/plant_gene/trait/repeated_harvest")));
	rt.setSv(f, "reagents_add", rt.alist(f, ["nutriment", 0.019999999552965164, "hydrogen", 0.05000000074505806]));
	$0 = $0;
	rt.setSv(f, "mutatelist", rt.list(T("/obj/item/seeds/grass/carpet")));
	return f.dot;
});

rt.type(6307, "/obj/item/weapon/reagent_containers/food/snacks/grown/grass", "/obj/item/weapon/reagent_containers/food/snacks/grown", {
	tile_coefficient: 0.02,
	stacktype: rt.typePath("/obj/item/stack/tile/grass"),
	filling_color: "#32CD32",
	bitesize_mod: 2,
	seed: rt.typePath("/obj/item/seeds/grass"),
	name: "grass",
	desc: "Green and lush.",
	icon_state: "grassclump",
});

// /obj/item/weapon/reagent_containers/food/snacks/grown/grass/proc/attack_self  (code/modules/hydroponics/grown/grass_carpet.dm:32)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/grass/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let grassAmt: Value = null, G: Value = null, GT: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [user, grassAmt, G, GT, _T, $e];
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You prepare the astroturf.</span>"]);
	grassAmt = add(1, (yield* g.call(f, P("/proc/round"), null, [multiply(rt.fv(f, "potency", rt.sv(f, "seed")), rt.sv(f, "tile_coefficient"))])));
	G = null;
	rt.forList(f, 0, rt.fv(f, "loc", live(user)), T("/obj/item/weapon/reagent_containers/food/snacks/grown/grass"));
	while (($e = rt.next(f, 0)) !== undefined) {
		G = $e;
		if (!isEqual(rt.fv(f, "type", live(G)), rt.sv(f, "type"))) {
			continue;
		}
		grassAmt = rt.modify(live(grassAmt), add(1, (yield* g.call(f, P("/proc/round"), null, [multiply(rt.gv(f, "potency", rt.fv(f, "seed", live(G))), rt.sv(f, "tile_coefficient"))]))), add);
		yield* g.call(f, P("/proc/qdel"), null, [live(G)]);
	}
	rt.endFor(f, 0);
	GT = (yield* g.new_(f, rt.sv(f, "stacktype"), [rt.fv(f, "loc", live(user))]));
	while (rt.gt(live(grassAmt), rt.fv(f, "max_amount", live(GT)))) {
		rt.setFv(f, "amount", live(GT), rt.fv(f, "max_amount", live(GT)));
		(grassAmt = rt.modify(live(grassAmt), rt.fv(f, "max_amount", live(GT)), subtract));
		GT = (yield* g.new_(f, rt.sv(f, "stacktype"), [rt.fv(f, "loc", live(user))]));
	}
	rt.setFv(f, "amount", live(GT), live(grassAmt));
	_T = null;
	rt.forList(f, 0, rt.fv(f, "loc", live(user)), T("/obj/item/stack/tile"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		if ((isEqual(rt.fv(f, "type", live(_T)), rt.sv(f, "stacktype")) && rt.lt(rt.fv(f, "amount", live(_T)), rt.fv(f, "max_amount", live(_T))))) {
			yield* g.callName(f, live(GT), "merge", [live(_T)]);
			if (rt.le(rt.fv(f, "amount", live(GT)), 0)) {
				break;
			}
		}
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return live(f.dot);
}, true);

rt.type(10037, "/obj/item/seeds/grass/carpet", "/obj/item/seeds/grass", {
	species: "carpet",
	plantname: "Carpet",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/grass/carpet"),
	mutatelist: null,
	rarity: 10,
	name: "pack of carpet seeds",
	desc: "These seeds grow into stylish carpet samples.",
	icon_state: "seed-carpet",
});

// /obj/item/seeds/grass/carpet/proc/<init>  (code/modules/hydroponics/grown/grass_carpet.dm:61)
rt.def("/obj/item/seeds/grass/carpet/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mutatelist", rt.list());
	return f.dot;
});
