// From code/modules/hydroponics/grown/misc.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10041, "/obj/item/seeds/starthistle", "/obj/item/seeds", {
	species: "starthistle",
	plantname: "Starthistle",
	lifespan: 70,
	endurance: 50,
	maturation: 5,
	production: 1,
	yield: 2,
	potency: 10,
	growthstages: 3,
	growing_icon: rt.rsc("icons/obj/hydroponics/growing_flowers.dmi"),
	genes: null,
	mutatelist: null,
	name: "pack of starthistle seeds",
	desc: "A robust species of weed that often springs up in-between the cracks of spaceship parking lots",
	icon_state: "seed-starthistle",
});

// /obj/item/seeds/starthistle/proc/<init>  (code/modules/hydroponics/grown/misc.dm:16)
rt.def("/obj/item/seeds/starthistle/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "genes", rt.list(T("/datum/plant_gene/trait/plant_type/weed_hardy")));
	$0 = $0;
	rt.setSv(f, "mutatelist", rt.list(T("/obj/item/seeds/harebell")));
	return f.dot;
});

// /obj/item/seeds/starthistle/proc/harvest  (code/modules/hydroponics/grown/misc.dm:20)  may sleep
rt.def("/obj/item/seeds/starthistle/proc/harvest", function* harvest(f: Frame, user: Value) {
	let parent: Value = null, seed_count: Value = null, output_loc: Value = null, i: Value = null, harvestseeds: Value = null;
	let $0: any, $e: any;
	f.vars = () => [user, parent, seed_count, output_loc, i, harvestseeds, $0, $e];
	parent = rt.sv(f, "loc");
	seed_count = rt.sv(f, "yield");
	if (truthy(rt.op(f, "Prob", [], [multiply((yield* g.srcCall(f, "getYield")), 20)]))) {
		seed_count = rt.inc(live(seed_count), 1);
		if (truthy((yield* g.callName(f, live(parent), "Adjacent", [live(user)])))) {
			$0 = rt.fv(f, "loc", live(user));
		} else {
			$0 = rt.fv(f, "loc", live(parent));
		}
		output_loc = $0;
		i = null;
		rt.forRange(f, 0, 1, live(seed_count), 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			yield* g.callName(f, (harvestseeds = (yield* g.srcCall(f, "Copy"))), "forceMove", [live(output_loc)]);
		}
		rt.endFor(f, 0);
	}
	yield* g.callName(f, live(parent), "update_tray", []);
	return f.dot;
}, true);

rt.type(10042, "/obj/item/seeds/cabbage", "/obj/item/seeds", {
	species: "cabbage",
	plantname: "Cabbages",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/cabbage"),
	lifespan: 50,
	endurance: 25,
	maturation: 3,
	production: 5,
	yield: 4,
	growthstages: 1,
	growing_icon: rt.rsc("icons/obj/hydroponics/growing_vegetables.dmi"),
	genes: null,
	reagents_add: null,
	name: "pack of cabbage seeds",
	desc: "These seeds grow into cabbages.",
	icon_state: "seed-cabbage",
	mutatelist: null,
});

// /obj/item/seeds/cabbage/proc/<init>  (code/modules/hydroponics/grown/misc.dm:46)
rt.def("/obj/item/seeds/cabbage/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "genes", rt.list(T("/datum/plant_gene/trait/repeated_harvest")));
	rt.setSv(f, "reagents_add", rt.alist(f, ["vitamin", 0.03999999910593033, "nutriment", 0.10000000149011612]));
	$0 = $0;
	rt.setSv(f, "mutatelist", rt.list(T("/obj/item/seeds/replicapod")));
	return f.dot;
});

rt.type(10043, "/obj/item/seeds/sugarcane", "/obj/item/seeds", {
	species: "sugarcane",
	plantname: "Sugarcane",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/sugarcane"),
	genes: null,
	lifespan: 60,
	endurance: 50,
	maturation: 3,
	yield: 4,
	growthstages: 3,
	reagents_add: null,
	name: "pack of sugarcane seeds",
	desc: "These seeds grow into sugarcane.",
	icon_state: "seed-sugarcane",
});

// /obj/item/seeds/sugarcane/proc/<init>  (code/modules/hydroponics/grown/misc.dm:67)
rt.def("/obj/item/seeds/sugarcane/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "genes", rt.list(T("/datum/plant_gene/trait/repeated_harvest")));
	rt.setSv(f, "reagents_add", rt.alist(f, ["sugar", 0.25]));
	return f.dot;
});

rt.type(10044, "/obj/item/seeds/gatfruit", "/obj/item/seeds", {
	species: "gatfruit",
	plantname: "Gatfruit Tree",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/shell/gatfruit"),
	genes: null,
	lifespan: 20,
	endurance: 20,
	maturation: 40,
	production: 10,
	yield: 2,
	potency: 60,
	growthstages: 2,
	rarity: 60,
	growing_icon: rt.rsc("icons/obj/hydroponics/growing_fruits.dmi"),
	reagents_add: null,
	name: "pack of gatfruit seeds",
	desc: "These seeds grow into .357 revolvers.",
	icon_state: "seed-gatfruit",
});

// /obj/item/seeds/gatfruit/proc/<init>  (code/modules/hydroponics/grown/misc.dm:92)
rt.def("/obj/item/seeds/gatfruit/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "genes", rt.list(T("/datum/plant_gene/trait/repeated_harvest")));
	rt.setSv(f, "reagents_add", rt.alist(f, ["sulfur", 0.10000000149011612, "carbon", 0.10000000149011612, "nitrogen", 0.07000000029802322, "potassium", 0.05000000074505806]));
	return f.dot;
});

rt.type(10004, "/obj/item/seeds/cherry/bomb", "/obj/item/seeds/cherry", {
	species: "cherry_bomb",
	plantname: "Cherry Bomb Tree",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/cherry_bomb"),
	mutatelist: null,
	reagents_add: null,
	rarity: 60,
	name: "pack of cherry bomb pits",
	desc: "They give you vibes of dread and frustration.",
	icon_state: "seed-cherry_bomb",
});

// /obj/item/seeds/cherry/bomb/proc/<init>  (code/modules/hydroponics/grown/misc.dm:121)
rt.def("/obj/item/seeds/cherry/bomb/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mutatelist", rt.list());
	rt.setSv(f, "reagents_add", rt.alist(f, ["nutriment", 0.10000000149011612, "sugar", 0.10000000149011612, "blackpowder", 0.699999988079071]));
	return f.dot;
});

rt.type(6314, "/obj/item/weapon/reagent_containers/food/snacks/grown/cherry_bomb", "/obj/item/weapon/reagent_containers/food/snacks/grown", {
	filling_color: "#141414",
	bitesize_mod: 2,
	name: "cherry bombs",
	desc: "You think you can hear the hissing of a tiny fuse.",
	icon_state: "cherry_bomb",
	seed: rt.typePath("/obj/item/seeds/cherry/bomb"),
	volume: 125,
	obj_integrity: 40,
	max_integrity: 40,
});

// /obj/item/weapon/reagent_containers/food/snacks/grown/cherry_bomb/proc/attack_self  (code/modules/hydroponics/grown/misc.dm:137)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/cherry_bomb/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let A: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [user, A, $0, $1, $2];
	A = (yield* g.call(f, P("/proc/get_area"), null, [live(user)]));
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀ plucks the stem from ＀!</span>", [live(user), live(f.src)]), fmt("<span class='userdanger'>You pluck the stem from ＀, which begins to hiss loudly!</span>", [live(f.src)])]);
	$0 = fmt("＀＀ ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(user)])), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(user)]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(user)])]);
	$1 = live(A);
	if (truthy(live(user))) {
		$2 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(user)), rt.fv(f, "y", live(user)), rt.fv(f, "z", live(user))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(user)), rt.fv(f, "y", live(user)), rt.fv(f, "z", live(user))])]);
	} else {
		$2 = "nonexistent location";
	}
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ primed a cherry bomb for detonation at ＀ ＀", [$0, $1, fmt("＀", [$2])])]);
	yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ primed a cherry bomb for detonation at ＀ ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)])), live(A), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(user)), rt.fv(f, "y", live(user)), rt.fv(f, "z", live(user))])])]);
	yield* g.srcCall(f, "prime");
	return f.dot;
}, true);

// /obj/item/weapon/reagent_containers/food/snacks/grown/cherry_bomb/proc/deconstruct  (code/modules/hydroponics/grown/misc.dm:144)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/cherry_bomb/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	f.vars = () => [disassembled];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (!truthy(live(disassembled))) {
		yield* g.srcCall(f, "prime");
	}
	if (!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/weapon/reagent_containers/food/snacks/grown/cherry_bomb/proc/ex_act  (code/modules/hydroponics/grown/misc.dm:150)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/cherry_bomb/proc/ex_act", function* ex_act(f: Frame, severity: Value) {
	f.vars = () => [severity];
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { waitfor: false });

// /obj/item/weapon/reagent_containers/food/snacks/grown/cherry_bomb/proc/prime  (code/modules/hydroponics/grown/misc.dm:153)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/cherry_bomb/proc/prime", function* prime(f: Frame) {
	rt.setSv(f, "icon_state", "cherry_bomb_lit");
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/fuse.ogg"), rt.fv(f, "potency", rt.sv(f, "seed")), 0]);
	rt.setFv(f, "chem_temp", rt.sv(f, "reagents"), 1000);
	yield* g.callName(f, rt.sv(f, "reagents"), "handle_reactions", []);
	return f.dot;
}, true);
