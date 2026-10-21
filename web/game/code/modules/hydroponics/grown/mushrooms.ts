// From code/modules/hydroponics/grown/mushrooms.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10051, "/obj/item/seeds/reishi", "/obj/item/seeds", {
	species: "reishi",
	plantname: "Reishi",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/mushroom/reishi"),
	lifespan: 35,
	endurance: 35,
	maturation: 10,
	production: 5,
	yield: 4,
	potency: 15,
	growthstages: 4,
	genes: null,
	growing_icon: rt.rsc("icons/obj/hydroponics/growing_mushrooms.dmi"),
	reagents_add: null,
	name: "pack of reishi mycelium",
	desc: "This mycelium grows into something medicinal and relaxing.",
	icon_state: "mycelium-reishi",
});

// /obj/item/seeds/reishi/proc/<init>  (code/modules/hydroponics/grown/mushrooms.dm:21)
rt.def("/obj/item/seeds/reishi/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "genes", rt.list(T("/datum/plant_gene/trait/plant_type/fungal_metabolism")));
	rt.setSv(f, "reagents_add", rt.alist(f, ["morphine", 0.3499999940395355, "charcoal", 0.3499999940395355, "nutriment", 0]));
	return f.dot;
});

rt.type(10052, "/obj/item/seeds/amanita", "/obj/item/seeds", {
	species: "amanita",
	plantname: "Fly Amanitas",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/mushroom/amanita"),
	lifespan: 50,
	endurance: 35,
	maturation: 10,
	production: 5,
	yield: 4,
	growthstages: 3,
	genes: null,
	growing_icon: rt.rsc("icons/obj/hydroponics/growing_mushrooms.dmi"),
	reagents_add: null,
	name: "pack of fly amanita mycelium",
	desc: "This mycelium grows into something horrible.",
	icon_state: "mycelium-amanita",
	mutatelist: null,
});

// /obj/item/seeds/amanita/proc/<init>  (code/modules/hydroponics/grown/mushrooms.dm:47)
rt.def("/obj/item/seeds/amanita/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "genes", rt.list(T("/datum/plant_gene/trait/plant_type/fungal_metabolism")));
	rt.setSv(f, "reagents_add", rt.alist(f, ["mushroomhallucinogen", 0.03999999910593033, "amatoxin", 0.3499999940395355, "nutriment", 0, "growthserum", 0.10000000149011612]));
	$0 = $0;
	rt.setSv(f, "mutatelist", rt.list(T("/obj/item/seeds/angel")));
	return f.dot;
});

rt.type(10053, "/obj/item/seeds/angel", "/obj/item/seeds", {
	species: "angel",
	plantname: "Destroying Angels",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/mushroom/angel"),
	lifespan: 50,
	endurance: 35,
	maturation: 12,
	production: 5,
	yield: 2,
	potency: 35,
	growthstages: 3,
	genes: null,
	growing_icon: rt.rsc("icons/obj/hydroponics/growing_mushrooms.dmi"),
	reagents_add: null,
	rarity: 30,
	origin_tech: "biotech=5",
	name: "pack of destroying angel mycelium",
	desc: "This mycelium grows into something devastating.",
	icon_state: "mycelium-angel",
});

// /obj/item/seeds/angel/proc/<init>  (code/modules/hydroponics/grown/mushrooms.dm:75)
rt.def("/obj/item/seeds/angel/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "genes", rt.list(T("/datum/plant_gene/trait/plant_type/fungal_metabolism")));
	rt.setSv(f, "reagents_add", rt.alist(f, ["mushroomhallucinogen", 0.03999999910593033, "amatoxin", 0.10000000149011612, "nutriment", 0, "amanitin", 0.20000000298023224]));
	return f.dot;
});

rt.type(10054, "/obj/item/seeds/liberty", "/obj/item/seeds", {
	species: "liberty",
	plantname: "Liberty-Caps",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/mushroom/libertycap"),
	maturation: 7,
	production: 1,
	yield: 5,
	potency: 15,
	growthstages: 3,
	genes: null,
	growing_icon: rt.rsc("icons/obj/hydroponics/growing_mushrooms.dmi"),
	reagents_add: null,
	name: "pack of liberty-cap mycelium",
	desc: "This mycelium grows into liberty-cap mushrooms.",
	icon_state: "mycelium-liberty",
});

// /obj/item/seeds/liberty/proc/<init>  (code/modules/hydroponics/grown/mushrooms.dm:102)
rt.def("/obj/item/seeds/liberty/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "genes", rt.list(T("/datum/plant_gene/trait/plant_type/fungal_metabolism")));
	rt.setSv(f, "reagents_add", rt.alist(f, ["mushroomhallucinogen", 0.25, "nutriment", 0.019999999552965164]));
	return f.dot;
});

rt.type(10055, "/obj/item/seeds/plump", "/obj/item/seeds", {
	species: "plump",
	plantname: "Plump-Helmet Mushrooms",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/mushroom/plumphelmet"),
	maturation: 8,
	production: 1,
	yield: 4,
	potency: 15,
	growthstages: 3,
	genes: null,
	growing_icon: rt.rsc("icons/obj/hydroponics/growing_mushrooms.dmi"),
	reagents_add: null,
	name: "pack of plump-helmet mycelium",
	desc: "This mycelium grows into helmets... maybe.",
	icon_state: "mycelium-plump",
	mutatelist: null,
});

// /obj/item/seeds/plump/proc/<init>  (code/modules/hydroponics/grown/mushrooms.dm:127)
rt.def("/obj/item/seeds/plump/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "genes", rt.list(T("/datum/plant_gene/trait/plant_type/fungal_metabolism")));
	rt.setSv(f, "reagents_add", rt.alist(f, ["vitamin", 0.03999999910593033, "nutriment", 0.10000000149011612]));
	$0 = $0;
	rt.setSv(f, "mutatelist", rt.list(T("/obj/item/seeds/plump/walkingmushroom")));
	return f.dot;
});

rt.type(10056, "/obj/item/seeds/plump/walkingmushroom", "/obj/item/seeds/plump", {
	species: "walkingmushroom",
	plantname: "Walking Mushrooms",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/mushroom/walkingmushroom"),
	lifespan: 30,
	endurance: 30,
	maturation: 5,
	yield: 1,
	growing_icon: rt.rsc("icons/obj/hydroponics/growing_mushrooms.dmi"),
	mutatelist: null,
	reagents_add: null,
	rarity: 30,
	name: "pack of walking mushroom mycelium",
	desc: "This mycelium will grow into huge stuff!",
	icon_state: "mycelium-walkingmushroom",
});

// /obj/item/seeds/plump/walkingmushroom/proc/<init>  (code/modules/hydroponics/grown/mushrooms.dm:153)
rt.def("/obj/item/seeds/plump/walkingmushroom/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mutatelist", rt.list());
	rt.setSv(f, "reagents_add", rt.alist(f, ["vitamin", 0.05000000074505806, "nutriment", 0.15000000596046448]));
	return f.dot;
});

rt.type(6321, "/obj/item/weapon/reagent_containers/food/snacks/grown/mushroom/walkingmushroom", "/obj/item/weapon/reagent_containers/food/snacks/grown/mushroom", {
	filling_color: "#9370DB",
	seed: rt.typePath("/obj/item/seeds/plump/walkingmushroom"),
	name: "walking mushroom",
	desc: "<I>Plumus Locomotus</I>: The beginning of the great walk.",
	icon_state: "walkingmushroom",
	origin_tech: "biotech=4;programming=5",
});

// /obj/item/weapon/reagent_containers/food/snacks/grown/mushroom/walkingmushroom/proc/attack_self  (code/modules/hydroponics/grown/mushrooms.dm:166)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/mushroom/walkingmushroom/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let M: Value = null;
	f.vars = () => [user, M];
	if (truthy((rt.istype(rt.fv(f, "loc", live(user)), T("/turf/open/space")) ? 1 : 0))) {
		return live(f.dot);
	}
	rt.modField(f, (M = (yield* g.new_(f, T("/mob/living/simple_animal/hostile/mushroom"), [rt.fv(f, "loc", live(user))]))), "maxHealth", (yield* g.call(f, P("/proc/round"), null, [divide(rt.fv(f, "endurance", rt.sv(f, "seed")), 4)])), add);
	rt.modField(f, live(M), "melee_damage_lower", (yield* g.call(f, P("/proc/round"), null, [divide(rt.fv(f, "potency", rt.sv(f, "seed")), 20)])), add);
	rt.modField(f, live(M), "melee_damage_upper", (yield* g.call(f, P("/proc/round"), null, [divide(rt.fv(f, "potency", rt.sv(f, "seed")), 20)])), add);
	(rt.modField(f, live(M), "move_to_delay", (yield* g.call(f, P("/proc/round"), null, [divide(rt.fv(f, "production", rt.sv(f, "seed")), 50)])), subtract));
	rt.setFv(f, "health", live(M), rt.fv(f, "maxHealth", live(M)));
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You plant the walking mushroom.</span>"]);
	return f.dot;
}, true);

rt.type(10057, "/obj/item/seeds/chanter", "/obj/item/seeds", {
	species: "chanter",
	plantname: "Chanterelle Mushrooms",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/mushroom/chanterelle"),
	lifespan: 35,
	endurance: 20,
	maturation: 7,
	production: 1,
	yield: 5,
	potency: 15,
	growthstages: 3,
	genes: null,
	growing_icon: rt.rsc("icons/obj/hydroponics/growing_mushrooms.dmi"),
	reagents_add: null,
	name: "pack of chanterelle mycelium",
	desc: "This mycelium grows into chanterelle mushrooms.",
	icon_state: "mycelium-chanter",
});

// /obj/item/seeds/chanter/proc/<init>  (code/modules/hydroponics/grown/mushrooms.dm:193)
rt.def("/obj/item/seeds/chanter/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "genes", rt.list(T("/datum/plant_gene/trait/plant_type/fungal_metabolism")));
	rt.setSv(f, "reagents_add", rt.alist(f, ["nutriment", 0.10000000149011612]));
	return f.dot;
});

rt.type(10058, "/obj/item/seeds/glowshroom", "/obj/item/seeds", {
	species: "glowshroom",
	plantname: "Glowshrooms",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/mushroom/glowshroom"),
	lifespan: 100,
	endurance: 30,
	maturation: 15,
	production: 1,
	yield: 3,
	potency: 30,
	growthstages: 4,
	rarity: 20,
	genes: null,
	growing_icon: rt.rsc("icons/obj/hydroponics/growing_mushrooms.dmi"),
	reagents_add: null,
	name: "pack of glowshroom mycelium",
	desc: "This mycelium -glows- into mushrooms!",
	icon_state: "mycelium-glowshroom",
	mutatelist: null,
});

// /obj/item/seeds/glowshroom/proc/<init>  (code/modules/hydroponics/grown/mushrooms.dm:221)
rt.def("/obj/item/seeds/glowshroom/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "genes", rt.list(T("/datum/plant_gene/trait/glow"), T("/datum/plant_gene/trait/plant_type/fungal_metabolism")));
	rt.setSv(f, "reagents_add", rt.alist(f, ["radium", 0.10000000149011612, "phosphorus", 0.10000000149011612, "nutriment", 0.03999999910593033]));
	$0 = $0;
	rt.setSv(f, "mutatelist", rt.list(T("/obj/item/seeds/glowshroom/glowcap"), T("/obj/item/seeds/glowshroom/shadowshroom")));
	return f.dot;
});

rt.type(6323, "/obj/item/weapon/reagent_containers/food/snacks/grown/mushroom/glowshroom", "/obj/item/weapon/reagent_containers/food/snacks/grown/mushroom", {
	effect_path: rt.typePath("/obj/structure/glowshroom"),
	filling_color: "#00FA9A",
	seed: rt.typePath("/obj/item/seeds/glowshroom"),
	name: "glowshroom cluster",
	desc: "<I>Mycena Bregprox</I>: This species of mushroom glows in the dark.",
	icon_state: "glowshroom",
	origin_tech: "biotech=4;plasmatech=6",
});

// /obj/item/weapon/reagent_containers/food/snacks/grown/mushroom/glowshroom/proc/attack_self  (code/modules/hydroponics/grown/mushrooms.dm:236)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/mushroom/glowshroom/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let count: Value = null, maxcount: Value = null, tempdir: Value = null, wall: Value = null, G: Value = null;
	let $e: any;
	f.vars = () => [user, count, maxcount, tempdir, wall, G, $e];
	if (truthy((rt.istype(rt.fv(f, "loc", live(user)), T("/turf/open/space")) ? 1 : 0))) {
		return 0;
	}
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(user))])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You need more space to plant ＀.</span>", [live(f.src)])]);
		return 0;
	}
	count = 0;
	maxcount = 1;
	tempdir = null;
	rt.forList(f, 0, rt.gl("cardinal"));
	while (($e = rt.next(f, 0)) !== undefined) {
		tempdir = $e;
		if (truthy((rt.istype((wall = rt.getStep(f, rt.fv(f, "loc", live(user)), live(tempdir))), T("/turf/closed")) ? 1 : 0))) {
			maxcount = rt.inc(live(maxcount), 1);
		}
	}
	rt.endFor(f, 0);
	G = null;
	rt.forList(f, 0, rt.fv(f, "loc", live(user)), T("/obj/structure/glowshroom"));
	while (($e = rt.next(f, 0)) !== undefined) {
		G = $e;
		count = rt.inc(live(count), 1);
	}
	rt.endFor(f, 0);
	if (rt.ge(live(count), live(maxcount))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>There are too many shrooms here to plant ＀.</span>", [live(f.src)])]);
		return 0;
	}
	yield* g.new_(f, rt.sv(f, "effect_path"), [rt.fv(f, "loc", live(user)), rt.sv(f, "seed")]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You plant ＀.</span>", [live(f.src)])]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return 1;
}, true);

rt.type(10059, "/obj/item/seeds/glowshroom/glowcap", "/obj/item/seeds/glowshroom", {
	species: "glowcap",
	icon_grow: "glowshroom-grow",
	icon_dead: "glowshroom-dead",
	plantname: "Glowcaps",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/mushroom/glowshroom/glowcap"),
	genes: null,
	mutatelist: null,
	reagents_add: null,
	rarity: 30,
	name: "pack of glowcap mycelium",
	desc: "This mycelium -powers- into mushrooms!",
	icon_state: "mycelium-glowcap",
});

// /obj/item/seeds/glowshroom/glowcap/proc/<init>  (code/modules/hydroponics/grown/mushrooms.dm:268)
rt.def("/obj/item/seeds/glowshroom/glowcap/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "genes", rt.list(T("/datum/plant_gene/trait/glow/red"), T("/datum/plant_gene/trait/cell_charge"), T("/datum/plant_gene/trait/plant_type/fungal_metabolism")));
	$0 = $0;
	rt.setSv(f, "mutatelist", rt.list());
	rt.setSv(f, "reagents_add", rt.alist(f, ["teslium", 0.10000000149011612, "nutriment", 0.03999999910593033]));
	return f.dot;
});

rt.type(10060, "/obj/item/seeds/glowshroom/shadowshroom", "/obj/item/seeds/glowshroom", {
	species: "shadowshroom",
	icon_grow: "shadowshroom-grow",
	icon_dead: "shadowshroom-dead",
	plantname: "Shadowshrooms",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/mushroom/glowshroom/shadowshroom"),
	genes: null,
	mutatelist: null,
	reagents_add: null,
	rarity: 30,
	name: "pack of shadowshroom mycelium",
	desc: "This mycelium will grow into something shadowy.",
	icon_state: "mycelium-shadowshroom",
});

// /obj/item/seeds/glowshroom/shadowshroom/proc/<init>  (code/modules/hydroponics/grown/mushrooms.dm:293)
rt.def("/obj/item/seeds/glowshroom/shadowshroom/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "genes", rt.list(T("/datum/plant_gene/trait/glow/shadow"), T("/datum/plant_gene/trait/plant_type/fungal_metabolism")));
	$0 = $0;
	rt.setSv(f, "mutatelist", rt.list());
	rt.setSv(f, "reagents_add", rt.alist(f, ["radium", 0.20000000298023224, "nutriment", 0.03999999910593033]));
	return f.dot;
});

rt.type(6325, "/obj/item/weapon/reagent_containers/food/snacks/grown/mushroom/glowshroom/shadowshroom", "/obj/item/weapon/reagent_containers/food/snacks/grown/mushroom/glowshroom", {
	seed: rt.typePath("/obj/item/seeds/glowshroom/shadowshroom"),
	name: "shadowshroom cluster",
	desc: "<I>Mycena Umbra</I>: This species of mushroom emits shadow instead of light.",
	icon_state: "shadowshroom",
	effect_path: rt.typePath("/obj/structure/glowshroom/shadowshroom"),
	origin_tech: "biotech=4;plasmatech=4;magnets=4",
});

// /obj/item/weapon/reagent_containers/food/snacks/grown/mushroom/glowshroom/shadowshroom/proc/attack_self  (code/modules/hydroponics/grown/mushrooms.dm:307)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/mushroom/glowshroom/shadowshroom/proc/attack_self", function* attack_self(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	yield* g.srcCall(f, "investigate_log", fmt("was planted by ＀ at ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.args[0])])), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(f.args[0])), rt.fv(f, "y", live(f.args[0])), rt.fv(f, "z", live(f.args[0]))])]), "botany");
	return f.dot;
}, true, { args: ["user"] });

rt.type(10045, "/obj/item/seeds/lavaland", "/obj/item/seeds", {
	lifespan: 50,
	endurance: 25,
	maturation: 7,
	production: 4,
	yield: 4,
	potency: 15,
	growthstages: 3,
	rarity: 20,
	reagents_add: null,
	name: "lavaland seeds",
	desc: "You should never see this.",
	resistance_flags: 2,
});

// /obj/item/seeds/lavaland/proc/<init>  (code/modules/hydroponics/grown/mushrooms.dm:326)
rt.def("/obj/item/seeds/lavaland/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reagents_add", rt.alist(f, ["nutriment", 0.10000000149011612]));
	return f.dot;
});

rt.type(10047, "/obj/item/seeds/lavaland/polypore", "/obj/item/seeds/lavaland", {
	species: "polypore",
	plantname: "Polypore Mushrooms",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/ash_flora/shavings"),
	genes: null,
	growing_icon: rt.rsc("icons/obj/hydroponics/growing_mushrooms.dmi"),
	name: "pack of polypore mycelium",
	desc: "This mycelium grows into bracket mushrooms, also known as polypores. Woody and firm, shaft miners often use them for makeshift crafts.",
	icon_state: "mycelium-polypore",
});

// /obj/item/seeds/lavaland/polypore/proc/<init>  (code/modules/hydroponics/grown/mushrooms.dm:336)
rt.def("/obj/item/seeds/lavaland/polypore/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "genes", rt.list(T("/datum/plant_gene/trait/plant_type/fungal_metabolism")));
	return f.dot;
});

rt.type(10048, "/obj/item/seeds/lavaland/porcini", "/obj/item/seeds/lavaland", {
	species: "porcini",
	plantname: "Porcini Mushrooms",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/ash_flora/mushroom_leaf"),
	genes: null,
	growing_icon: rt.rsc("icons/obj/hydroponics/growing_mushrooms.dmi"),
	name: "pack of porcini mycelium",
	desc: "This mycelium grows into Boletus edulus, also known as porcini. Native to the late Earth, but discovered on Lavaland. Has culinary, medicinal and relaxant effects.",
	icon_state: "mycelium-porcini",
});

// /obj/item/seeds/lavaland/porcini/proc/<init>  (code/modules/hydroponics/grown/mushrooms.dm:348)
rt.def("/obj/item/seeds/lavaland/porcini/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "genes", rt.list(T("/datum/plant_gene/trait/plant_type/fungal_metabolism")));
	return f.dot;
});

rt.type(10049, "/obj/item/seeds/lavaland/inocybe", "/obj/item/seeds/lavaland", {
	species: "inocybe",
	plantname: "Inocybe Mushrooms",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/ash_flora/mushroom_cap"),
	genes: null,
	growing_icon: rt.rsc("icons/obj/hydroponics/growing_mushrooms.dmi"),
	name: "pack of inocybe mycelium",
	desc: "This mycelium grows into an inocybe mushroom, a species of Lavaland origin with hallucinatory and toxic effects.",
	icon_state: "mycelium-inocybe",
});

// /obj/item/seeds/lavaland/inocybe/proc/<init>  (code/modules/hydroponics/grown/mushrooms.dm:360)
rt.def("/obj/item/seeds/lavaland/inocybe/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "genes", rt.list(T("/datum/plant_gene/trait/plant_type/fungal_metabolism")));
	return f.dot;
});

rt.type(10050, "/obj/item/seeds/lavaland/ember", "/obj/item/seeds/lavaland", {
	species: "ember",
	plantname: "Embershroom Mushrooms",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/ash_flora/mushroom_stem"),
	genes: null,
	growing_icon: rt.rsc("icons/obj/hydroponics/growing_mushrooms.dmi"),
	name: "pack of embershroom mycelium",
	desc: "This mycelium grows into embershrooms, a species of bioluminescent mushrooms native to Lavaland.",
	icon_state: "mycelium-ember",
});

// /obj/item/seeds/lavaland/ember/proc/<init>  (code/modules/hydroponics/grown/mushrooms.dm:372)
rt.def("/obj/item/seeds/lavaland/ember/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "genes", rt.list(T("/datum/plant_gene/trait/plant_type/fungal_metabolism"), T("/datum/plant_gene/trait/glow")));
	return f.dot;
});
