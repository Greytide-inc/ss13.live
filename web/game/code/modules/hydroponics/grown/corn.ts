// From code/modules/hydroponics/grown/corn.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10025, "/obj/item/seeds/corn", "/obj/item/seeds", {
	species: "corn",
	plantname: "Corn Stalks",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/corn"),
	maturation: 8,
	potency: 20,
	growthstages: 3,
	growing_icon: rt.rsc("icons/obj/hydroponics/growing_vegetables.dmi"),
	icon_grow: "corn-grow",
	icon_dead: "corn-dead",
	reagents_add: null,
	name: "pack of corn seeds",
	desc: "I don't mean to sound corny...",
	icon_state: "seed-corn",
	mutatelist: null,
});

// /obj/item/seeds/corn/proc/<init>  (code/modules/hydroponics/grown/corn.dm:16)
rt.def("/obj/item/seeds/corn/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reagents_add", rt.alist(f, ["cornoil", 0.20000000298023224, "vitamin", 0.03999999910593033, "nutriment", 0.10000000149011612]));
	$0 = $0;
	rt.setSv(f, "mutatelist", rt.list(T("/obj/item/seeds/corn/snapcorn")));
	return f.dot;
});

rt.type(7497, "/obj/item/weapon/grown/corncob", "/obj/item/weapon/grown", {
	throw_speed: 3,
	throw_range: 7,
	name: "corn cob",
	desc: "A reminder of meals gone by.",
	icon_state: "corncob",
	item_state: "corncob",
	w_class: 1,
	throwforce: 0,
});

// /obj/item/weapon/grown/corncob/proc/attackby  (code/modules/hydroponics/grown/corn.dm:39)  may sleep
rt.def("/obj/item/weapon/grown/corncob/proc/attackby", function* attackby(f: Frame) {
	if (truthy((yield* g.callName(f, live(f.args[0]), "is_sharp", [])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You use ＀ to fashion a pipe out of the corn cob!</span>", [live(f.args[0])])]);
		yield* g.new_(f, T("/obj/item/clothing/mask/cigarette/pipe/cobpipe"), [rt.fv(f, "loc", live(f.args[1]))]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

rt.type(10026, "/obj/item/seeds/corn/snapcorn", "/obj/item/seeds/corn", {
	species: "snapcorn",
	plantname: "Snapcorn Stalks",
	product: rt.typePath("/obj/item/weapon/grown/snapcorn"),
	mutatelist: null,
	rarity: 10,
	name: "pack of snapcorn seeds",
	desc: "Oh snap!",
	icon_state: "seed-snapcorn",
});

// /obj/item/seeds/corn/snapcorn/proc/<init>  (code/modules/hydroponics/grown/corn.dm:54)
rt.def("/obj/item/seeds/corn/snapcorn/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mutatelist", rt.list());
	return f.dot;
});

rt.type(7498, "/obj/item/weapon/grown/snapcorn", "/obj/item/weapon/grown", {
	snap_pops: 1,
	throw_speed: 3,
	throw_range: 7,
	seed: rt.typePath("/obj/item/seeds/corn/snapcorn"),
	name: "snap corn",
	desc: "A cob with snap pops",
	icon_state: "snapcorn",
	item_state: "corncob",
	w_class: 1,
	throwforce: 0,
});

// /obj/item/weapon/grown/snapcorn/proc/add_juice  (code/modules/hydroponics/grown/corn.dm:70)
rt.def("/obj/item/weapon/grown/snapcorn/proc/add_juice", function add_juice(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "snap_pops", rt.call(f, P("/proc/max"), null, [rt.call(f, P("/proc/round"), null, [divide(rt.fv(f, "potency", rt.sv(f, "seed")), 8)]), 1]));
	return f.dot;
});

// /obj/item/weapon/grown/snapcorn/proc/attack_self  (code/modules/hydroponics/grown/corn.dm:74)  may sleep
rt.def("/obj/item/weapon/grown/snapcorn/proc/attack_self", function* attack_self(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>You pick a snap pop from the cob.</span>"]);
	S = (yield* g.new_(f, T("/obj/item/toy/snappop"), [rt.fv(f, "loc", live(f.args[0]))]));
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) {
		yield* g.callName(f, live(f.args[0]), "put_in_hands", [live(S)]);
	}
	(rt.modSrcVar(f, "snap_pops", 1, subtract));
	if (truthy(rt.sv(f, "snap_pops"))) return f.dot;
	yield* g.new_(f, T("/obj/item/weapon/grown/corncob"), [rt.fv(f, "loc", live(f.args[0]))]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["user"] });
