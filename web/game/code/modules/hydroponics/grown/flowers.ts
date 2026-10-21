// From code/modules/hydroponics/grown/flowers.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10029, "/obj/item/seeds/poppy", "/obj/item/seeds", {
	species: "poppy",
	plantname: "Poppy Plants",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/poppy"),
	endurance: 10,
	maturation: 8,
	yield: 6,
	potency: 20,
	growthstages: 3,
	growing_icon: rt.rsc("icons/obj/hydroponics/growing_flowers.dmi"),
	icon_grow: "poppy-grow",
	icon_dead: "poppy-dead",
	reagents_add: null,
	name: "pack of poppy seeds",
	desc: "These seeds grow into poppies.",
	icon_state: "seed-poppy",
	mutatelist: null,
});

// /obj/item/seeds/poppy/proc/<init>  (code/modules/hydroponics/grown/flowers.dm:18)
rt.def("/obj/item/seeds/poppy/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reagents_add", rt.alist(f, ["bicaridine", 0.20000000298023224, "nutriment", 0.05000000074505806]));
	$0 = $0;
	rt.setSv(f, "mutatelist", rt.list(T("/obj/item/seeds/poppy/geranium"), T("/obj/item/seeds/poppy/lily")));
	return f.dot;
});

rt.type(10030, "/obj/item/seeds/poppy/lily", "/obj/item/seeds/poppy", {
	species: "lily",
	plantname: "Lily Plants",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/poppy/lily"),
	mutatelist: null,
	name: "pack of lily seeds",
	desc: "These seeds grow into lilies.",
	icon_state: "seed-lily",
});

// /obj/item/seeds/poppy/lily/proc/<init>  (code/modules/hydroponics/grown/flowers.dm:37)
rt.def("/obj/item/seeds/poppy/lily/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mutatelist", rt.list());
	return f.dot;
});

rt.type(10031, "/obj/item/seeds/poppy/geranium", "/obj/item/seeds/poppy", {
	species: "geranium",
	plantname: "Geranium Plants",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/poppy/geranium"),
	mutatelist: null,
	name: "pack of geranium seeds",
	desc: "These seeds grow into geranium.",
	icon_state: "seed-geranium",
});

// /obj/item/seeds/poppy/geranium/proc/<init>  (code/modules/hydroponics/grown/flowers.dm:54)
rt.def("/obj/item/seeds/poppy/geranium/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mutatelist", rt.list());
	return f.dot;
});

rt.type(10032, "/obj/item/seeds/harebell", "/obj/item/seeds", {
	species: "harebell",
	plantname: "Harebells",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/harebell"),
	lifespan: 100,
	endurance: 20,
	maturation: 7,
	production: 1,
	yield: 2,
	potency: 30,
	growthstages: 4,
	genes: null,
	growing_icon: rt.rsc("icons/obj/hydroponics/growing_flowers.dmi"),
	reagents_add: null,
	name: "pack of harebell seeds",
	desc: "These seeds grow into pretty little flowers.",
	icon_state: "seed-harebell",
});

// /obj/item/seeds/harebell/proc/<init>  (code/modules/hydroponics/grown/flowers.dm:79)
rt.def("/obj/item/seeds/harebell/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "genes", rt.list(T("/datum/plant_gene/trait/plant_type/weed_hardy")));
	rt.setSv(f, "reagents_add", rt.alist(f, ["nutriment", 0.03999999910593033]));
	return f.dot;
});

rt.type(10033, "/obj/item/seeds/sunflower", "/obj/item/seeds", {
	species: "sunflower",
	plantname: "Sunflowers",
	product: rt.typePath("/obj/item/weapon/grown/sunflower"),
	endurance: 20,
	production: 2,
	yield: 2,
	growthstages: 3,
	growing_icon: rt.rsc("icons/obj/hydroponics/growing_flowers.dmi"),
	icon_grow: "sunflower-grow",
	icon_dead: "sunflower-dead",
	reagents_add: null,
	name: "pack of sunflower seeds",
	desc: "These seeds grow into sunflowers.",
	icon_state: "seed-sunflower",
	mutatelist: null,
});

// /obj/item/seeds/sunflower/proc/<init>  (code/modules/hydroponics/grown/flowers.dm:109)
rt.def("/obj/item/seeds/sunflower/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reagents_add", rt.alist(f, ["cornoil", 0.07999999821186066, "nutriment", 0.03999999910593033]));
	$0 = $0;
	rt.setSv(f, "mutatelist", rt.list(T("/obj/item/seeds/sunflower/moonflower"), T("/obj/item/seeds/sunflower/novaflower")));
	return f.dot;
});

rt.type(7499, "/obj/item/weapon/grown/sunflower", "/obj/item/weapon/grown", {
	throw_speed: 1,
	throw_range: 3,
	seed: rt.typePath("/obj/item/seeds/sunflower"),
	name: "sunflower",
	desc: "It's beautiful! A certain person might beat you to death if you trample these.",
	icon_state: "sunflower",
	damtype: "fire",
	force: 0,
	slot_flags: 64,
	throwforce: 0,
	w_class: 1,
});

// /obj/item/weapon/grown/sunflower/proc/attack  (code/modules/hydroponics/grown/flowers.dm:125)
rt.def("/obj/item/weapon/grown/sunflower/proc/attack", function attack(f: Frame, M: Value, user: Value) {
	rt.call(f, P("/proc/to_chat"), null, [live(M), fmt("<font color='green'><b> ＀ smacks you with a sunflower!</font><font color='yellow'><b>FLOWER POWER<b></font>", [live(user)])]);
	rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<font color='green'>Your sunflower's </font><font color='yellow'><b>FLOWER POWER</b></font><font color='green'>strikes ＀</font>", [live(M)])]);
	return f.dot;
});

rt.type(10034, "/obj/item/seeds/sunflower/moonflower", "/obj/item/seeds/sunflower", {
	species: "moonflower",
	plantname: "Moonflowers",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/moonflower"),
	mutatelist: null,
	reagents_add: null,
	rarity: 15,
	name: "pack of moonflower seeds",
	desc: "These seeds grow into moonflowers.",
	icon_state: "seed-moonflower",
});

// /obj/item/seeds/sunflower/moonflower/proc/<init>  (code/modules/hydroponics/grown/flowers.dm:136)
rt.def("/obj/item/seeds/sunflower/moonflower/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mutatelist", rt.list());
	rt.setSv(f, "reagents_add", rt.alist(f, ["moonshine", 0.20000000298023224, "vitamin", 0.019999999552965164, "nutriment", 0.019999999552965164]));
	return f.dot;
});

rt.type(10035, "/obj/item/seeds/sunflower/novaflower", "/obj/item/seeds/sunflower", {
	species: "novaflower",
	plantname: "Novaflowers",
	product: rt.typePath("/obj/item/weapon/grown/novaflower"),
	mutatelist: null,
	reagents_add: null,
	rarity: 20,
	name: "pack of novaflower seeds",
	desc: "These seeds grow into novaflowers.",
	icon_state: "seed-novaflower",
});

// /obj/item/seeds/sunflower/novaflower/proc/<init>  (code/modules/hydroponics/grown/flowers.dm:157)
rt.def("/obj/item/seeds/sunflower/novaflower/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mutatelist", rt.list());
	rt.setSv(f, "reagents_add", rt.alist(f, ["condensedcapsaicin", 0.25, "capsaicin", 0.30000001192092896, "nutriment", 0]));
	return f.dot;
});

rt.type(7500, "/obj/item/weapon/grown/novaflower", "/obj/item/weapon/grown", {
	throw_speed: 1,
	throw_range: 3,
	seed: rt.typePath("/obj/item/seeds/sunflower/novaflower"),
	name: "novaflower",
	desc: "These beautiful flowers have a crisp smokey scent, like a summer bonfire.",
	icon_state: "novaflower",
	damtype: "fire",
	force: 0,
	slot_flags: 64,
	throwforce: 0,
	w_class: 1,
	attack_verb: null,
});

// /obj/item/weapon/grown/novaflower/proc/add_juice  (code/modules/hydroponics/grown/flowers.dm:176)
rt.def("/obj/item/weapon/grown/novaflower/proc/add_juice", function add_juice(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "force", rt.call(f, P("/proc/round"), null, [add(5, divide(rt.fv(f, "potency", rt.sv(f, "seed")), 5)), 1]));
	return f.dot;
});

// /obj/item/weapon/grown/novaflower/proc/attack  (code/modules/hydroponics/grown/flowers.dm:180)  may sleep
rt.def("/obj/item/weapon/grown/novaflower/proc/attack", function* attack(f: Frame) {
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='danger'>You are lit on fire from the intense heat of the ＀!</span>", [rt.sv(f, "name")])]);
	yield* g.callName(f, live(f.args[0]), "adjust_fire_stacks", [divide(rt.fv(f, "potency", rt.sv(f, "seed")), 20)]);
	if (!truthy((yield* g.callName(f, live(f.args[0]), "IgniteMob", [])))) return f.dot;
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ set ＀ on fire", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.args[1])])), (yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.args[0])]))])]);
	yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ set ＀ on fire", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.args[1])])), (yield* g.call(f, P("/proc/key_name"), null, [live(f.args[0])]))])]);
	return f.dot;
}, true, { args: ["M", "user"] });

// /obj/item/weapon/grown/novaflower/proc/afterattack  (code/modules/hydroponics/grown/flowers.dm:190)  may sleep
rt.def("/obj/item/weapon/grown/novaflower/proc/afterattack", function* afterattack(f: Frame, A: Value, user: Value, proximity: Value) {
	f.vars = () => [A, user, proximity];
	if (!truthy(live(proximity))) {
		return live(f.dot);
	}
	if (rt.gt(rt.sv(f, "force"), 0)) {
		(rt.modSrcVar(f, "force", (yield* g.call(f, P("/proc/rand"), null, [1, add(divide(rt.sv(f, "force"), 3), 1)])), subtract));
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>All the petals have fallen off the ＀ from violent whacking!</span>", [rt.sv(f, "name")])]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	return f.dot;
}, true);

// /obj/item/weapon/grown/novaflower/proc/pickup  (code/modules/hydroponics/grown/flowers.dm:198)  may sleep
rt.def("/obj/item/weapon/grown/novaflower/proc/pickup", function* pickup(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.fv(f, "gloves", live(f.args[0])))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='danger'>The ＀ burns your bare hand!</span>", [rt.sv(f, "name")])]);
	yield* g.callName(f, live(f.args[0]), "adjustFireLoss", [(yield* g.call(f, P("/proc/rand"), null, [1, 5]))]);
	return f.dot;
}, true, { args: ["user"] });
