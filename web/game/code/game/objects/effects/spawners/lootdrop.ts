// From code/game/objects/effects/spawners/lootdrop.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11865, "/obj/effect/spawner/lootdrop", "/obj/effect/spawner", {
	lootcount: 1,
	lootdoubles: 1,
	loot: null,
	icon: rt.rsc("icons/mob/screen_gen.dmi"),
	icon_state: "x2",
	color: "#00FF00",
});

// /obj/effect/spawner/lootdrop/proc/Initialize  (code/game/objects/effects/spawners/lootdrop.dm:10)  may sleep
rt.def("/obj/effect/spawner/lootdrop/proc/Initialize", function* Initialize(f: Frame) {
	let _T: Value = null, lootspawn: Value = null;
	f.vars = () => [_T, lootspawn];
	yield* g.callSuper(f, [], rt.Args.Same);
	if ((truthy(rt.sv(f, "loot")) && truthy(rt.len(f, rt.sv(f, "loot"))))) {
		_T = rt.getStep(f, live(f.src), 0);
		while (truthy(rt.sv(f, "lootcount")) && truthy(rt.len(f, rt.sv(f, "loot")))) {
			lootspawn = (yield* g.call(f, P("/proc/pickweight"), null, [rt.sv(f, "loot")]));
			if (!truthy(rt.sv(f, "lootdoubles"))) {
				yield* g.callName(f, rt.sv(f, "loot"), "Remove", [live(lootspawn)]);
			}
			if (truthy(live(lootspawn))) {
				yield* g.new_(f, live(lootspawn), [live(_T)]);
			}
			rt.incSrcVar(f, "lootcount", -1, true);
		}
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["mapload"] });

rt.type(11866, "/obj/effect/spawner/lootdrop/armory_contraband", "/obj/effect/spawner/lootdrop", {
	lootdoubles: 0,
	loot: null,
	name: "armory contraband gun spawner",
});

// /obj/effect/spawner/lootdrop/armory_contraband/proc/<init>  (code/game/objects/effects/spawners/lootdrop.dm:27)
rt.def("/obj/effect/spawner/lootdrop/armory_contraband/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "loot", rt.alist(f, [T("/obj/item/weapon/gun/ballistic/automatic/pistol"), 8, T("/obj/item/weapon/gun/ballistic/shotgun/automatic/combat"), 5, null, T("/obj/item/weapon/gun/ballistic/revolver/mateba"), null, T("/obj/item/weapon/gun/ballistic/automatic/pistol/deagle")]));
	return f.dot;
});

rt.type(11867, "/obj/effect/spawner/lootdrop/gambling", "/obj/effect/spawner/lootdrop", {
	loot: null,
	name: "gambling valuables spawner",
});

// /obj/effect/spawner/lootdrop/gambling/proc/<init>  (code/game/objects/effects/spawners/lootdrop.dm:36)
rt.def("/obj/effect/spawner/lootdrop/gambling/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "loot", rt.alist(f, [T("/obj/item/weapon/gun/ballistic/revolver/russian"), 5, T("/obj/item/weapon/storage/box/syndie_kit/throwing_weapons"), 1, T("/obj/item/toy/cards/deck/syndicate"), 2]));
	return f.dot;
});

rt.type(11868, "/obj/effect/spawner/lootdrop/grille_or_trash", "/obj/effect/spawner/lootdrop", {
	name: "maint grille or trash spawner",
	loot: null,
});

// /obj/effect/spawner/lootdrop/grille_or_trash/proc/<init>  (code/game/objects/effects/spawners/lootdrop.dm:44)
rt.def("/obj/effect/spawner/lootdrop/grille_or_trash/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "loot", rt.alist(f, [T("/obj/structure/grille"), 5, T("/obj/item/weapon/cigbutt"), 1, T("/obj/item/trash/cheesie"), 1, T("/obj/item/trash/candy"), 1, T("/obj/item/trash/chips"), 1, T("/obj/item/trash/deadmouse"), 1, T("/obj/item/trash/pistachios"), 1, T("/obj/item/trash/plate"), 1, T("/obj/item/trash/popcorn"), 1, T("/obj/item/trash/raisins"), 1, T("/obj/item/trash/sosjerky"), 1, T("/obj/item/trash/syndi_cakes"), 1]));
	return f.dot;
});

rt.type(11869, "/obj/effect/spawner/lootdrop/three_course_meal", "/obj/effect/spawner/lootdrop", {
	soups: null,
	salads: null,
	mains: null,
	lootcount: 3,
	lootdoubles: 0,
	name: "three course meal spawner",
});

// /obj/effect/spawner/lootdrop/three_course_meal/proc/<init>  (code/game/objects/effects/spawners/lootdrop.dm:61)
rt.def("/obj/effect/spawner/lootdrop/three_course_meal/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "soups", rt.list(T("/obj/item/weapon/reagent_containers/food/snacks/soup/beet"), T("/obj/item/weapon/reagent_containers/food/snacks/soup/sweetpotato"), T("/obj/item/weapon/reagent_containers/food/snacks/soup/stew"), T("/obj/item/weapon/reagent_containers/food/snacks/soup/hotchili"), T("/obj/item/weapon/reagent_containers/food/snacks/soup/nettle"), T("/obj/item/weapon/reagent_containers/food/snacks/soup/meatball")));
	$0 = $0;
	rt.setSv(f, "salads", rt.list(T("/obj/item/weapon/reagent_containers/food/snacks/salad/herbsalad"), T("/obj/item/weapon/reagent_containers/food/snacks/salad/validsalad"), T("/obj/item/weapon/reagent_containers/food/snacks/salad/fruit"), T("/obj/item/weapon/reagent_containers/food/snacks/salad/jungle"), T("/obj/item/weapon/reagent_containers/food/snacks/salad/aesirsalad")));
	$0 = $0;
	rt.setSv(f, "mains", rt.list(T("/obj/item/weapon/reagent_containers/food/snacks/bearsteak"), T("/obj/item/weapon/reagent_containers/food/snacks/enchiladas"), T("/obj/item/weapon/reagent_containers/food/snacks/stewedsoymeat"), T("/obj/item/weapon/reagent_containers/food/snacks/burger/bigbite"), T("/obj/item/weapon/reagent_containers/food/snacks/burger/superbite"), T("/obj/item/weapon/reagent_containers/food/snacks/burger/fivealarm")));
	return f.dot;
});

// /obj/effect/spawner/lootdrop/three_course_meal/proc/Initialize  (code/game/objects/effects/spawners/lootdrop.dm:83)  may sleep
rt.def("/obj/effect/spawner/lootdrop/three_course_meal/proc/Initialize", function* Initialize(f: Frame) {
	rt.setSv(f, "loot", rt.alist(f, [rt.op(f, "PickUnweighted", [1], [rt.sv(f, "soups")]), 1, rt.op(f, "PickUnweighted", [1], [rt.sv(f, "salads")]), 1, rt.op(f, "PickUnweighted", [1], [rt.sv(f, "mains")]), 1]));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["mapload"] });

rt.type(11870, "/obj/effect/spawner/lootdrop/maintenance", "/obj/effect/spawner/lootdrop", {
	name: "maintenance loot spawner",
});

// /obj/effect/spawner/lootdrop/maintenance/proc/Initialize  (code/game/objects/effects/spawners/lootdrop.dm:91)  may sleep
rt.def("/obj/effect/spawner/lootdrop/maintenance/proc/Initialize", function* Initialize(f: Frame) {
	rt.setSv(f, "loot", rt.gl("maintenance_loot"));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["mapload"] });

rt.type(11871, "/obj/effect/spawner/lootdrop/crate_spawner", "/obj/effect/spawner/lootdrop", {
	lootdoubles: 0,
	name: "lootcrate spawner",
	loot: null,
});

// /obj/effect/spawner/lootdrop/crate_spawner/proc/<init>  (code/game/objects/effects/spawners/lootdrop.dm:98)
rt.def("/obj/effect/spawner/lootdrop/crate_spawner/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "loot", rt.alist(f, [T("/obj/structure/closet/crate/secure/loot"), 20, "", 80]));
	return f.dot;
});

rt.type(11872, "/obj/effect/spawner/lootdrop/organ_spawner", "/obj/effect/spawner/lootdrop", {
	loot: null,
	lootcount: 3,
	name: "organ spawner",
});

// /obj/effect/spawner/lootdrop/organ_spawner/proc/<init>  (code/game/objects/effects/spawners/lootdrop.dm:105)
rt.def("/obj/effect/spawner/lootdrop/organ_spawner/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "loot", rt.alist(f, [T("/obj/item/organ/heart/gland/bloody"), 7, T("/obj/item/organ/heart/gland/bodysnatch"), 4, T("/obj/item/organ/heart/gland/egg"), 7, T("/obj/item/organ/heart/gland/emp"), 3, T("/obj/item/organ/heart/gland/mindshock"), 5, T("/obj/item/organ/heart/gland/plasma"), 7, T("/obj/item/organ/heart/gland/pop"), 5, T("/obj/item/organ/heart/gland/slime"), 4, T("/obj/item/organ/heart/gland/spiderman"), 5, T("/obj/item/organ/heart/gland/ventcrawling"), 1, T("/obj/item/organ/body_egg/alien_embryo"), 1, T("/obj/item/organ/regenerative_core"), 2]));
	return f.dot;
});

rt.type(11873, "/obj/effect/spawner/lootdrop/two_percent_xeno_egg_spawner", "/obj/effect/spawner/lootdrop", {
	name: "2% chance xeno egg spawner",
	loot: null,
});

// /obj/effect/spawner/lootdrop/two_percent_xeno_egg_spawner/proc/<init>  (code/game/objects/effects/spawners/lootdrop.dm:122)
rt.def("/obj/effect/spawner/lootdrop/two_percent_xeno_egg_spawner/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "loot", rt.alist(f, [T("/obj/effect/decal/remains/xeno"), 49, T("/obj/effect/spawner/xeno_egg_delivery"), 1]));
	return f.dot;
});

rt.type(11874, "/obj/effect/spawner/lootdrop/costume", "/obj/effect/spawner/lootdrop", {
	name: "random costume spawner",
});

// /obj/effect/spawner/lootdrop/costume/proc/Initialize  (code/game/objects/effects/spawners/lootdrop.dm:130)  may sleep
rt.def("/obj/effect/spawner/lootdrop/costume/proc/Initialize", function* Initialize(f: Frame) {
	let path: Value = null;
	let $e: any;
	f.vars = () => [path, $e];
	rt.setSv(f, "loot", rt.list());
	path = null;
	rt.forList(f, 0, subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/obj/effect/spawner/bundle/costume")])), T("/obj/effect/spawner/bundle/costume")));
	while (($e = rt.next(f, 0)) !== undefined) {
		path = $e;
		rt.setAt(rt.sv(f, "loot"), live(path), 1);
	}
	rt.endFor(f, 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(11876, "/obj/effect/spawner/lootdrop/minor/beret_or_rabbitears", "/obj/effect/spawner/lootdrop/minor", {
	loot: null,
	name: "beret or rabbit ears spawner",
});

// /obj/effect/spawner/lootdrop/minor/beret_or_rabbitears/proc/<init>  (code/game/objects/effects/spawners/lootdrop.dm:139)
rt.def("/obj/effect/spawner/lootdrop/minor/beret_or_rabbitears/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "loot", rt.alist(f, [T("/obj/item/clothing/head/beret"), 1, T("/obj/item/clothing/head/rabbitears"), 1]));
	return f.dot;
});

rt.type(11877, "/obj/effect/spawner/lootdrop/minor/bowler_or_that", "/obj/effect/spawner/lootdrop/minor", {
	loot: null,
	name: "bowler or top hat spawner",
});

// /obj/effect/spawner/lootdrop/minor/bowler_or_that/proc/<init>  (code/game/objects/effects/spawners/lootdrop.dm:145)
rt.def("/obj/effect/spawner/lootdrop/minor/bowler_or_that/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "loot", rt.alist(f, [T("/obj/item/clothing/head/bowler"), 1, T("/obj/item/clothing/head/that"), 1]));
	return f.dot;
});

rt.type(11878, "/obj/effect/spawner/lootdrop/minor/kittyears_or_rabbitears", "/obj/effect/spawner/lootdrop/minor", {
	loot: null,
	name: "kitty ears or rabbit ears spawner",
});

// /obj/effect/spawner/lootdrop/minor/kittyears_or_rabbitears/proc/<init>  (code/game/objects/effects/spawners/lootdrop.dm:151)
rt.def("/obj/effect/spawner/lootdrop/minor/kittyears_or_rabbitears/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "loot", rt.alist(f, [T("/obj/item/clothing/head/kitty"), 1, T("/obj/item/clothing/head/rabbitears"), 1]));
	return f.dot;
});

rt.type(11879, "/obj/effect/spawner/lootdrop/minor/pirate_or_bandana", "/obj/effect/spawner/lootdrop/minor", {
	loot: null,
	name: "pirate hat or bandana spawner",
});

// /obj/effect/spawner/lootdrop/minor/pirate_or_bandana/proc/<init>  (code/game/objects/effects/spawners/lootdrop.dm:157)
rt.def("/obj/effect/spawner/lootdrop/minor/pirate_or_bandana/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "loot", rt.alist(f, [T("/obj/item/clothing/head/pirate"), 1, T("/obj/item/clothing/head/bandana"), 1]));
	return f.dot;
});

rt.type(11880, "/obj/effect/spawner/lootdrop/minor/twentyfive_percent_cyborg_mask", "/obj/effect/spawner/lootdrop/minor", {
	loot: null,
	name: "25% cyborg mask spawner",
});

// /obj/effect/spawner/lootdrop/minor/twentyfive_percent_cyborg_mask/proc/<init>  (code/game/objects/effects/spawners/lootdrop.dm:163)
rt.def("/obj/effect/spawner/lootdrop/minor/twentyfive_percent_cyborg_mask/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "loot", rt.alist(f, [T("/obj/item/clothing/mask/gas/cyborg"), 25, "", 75]));
	return f.dot;
});
