// Based on /tg/station's code/game/objects/effects/spawners/lootdrop.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(11865, "/obj/effect/spawner/lootdrop", "/obj/effect/spawner", {
	lootcount: 1,
	lootdoubles: 1,
	loot: null,
	icon: rt.rsc("icons/mob/screen_gen.dmi"),
	icon_state: "x2",
	color: "#00FF00",
});

// lootdrop.dm:10
rt.def("/obj/effect/spawner/lootdrop/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	let _T: Value = null, lootspawn: Value = null;
	yield* parent_proc();
	if (this.loot && rt.len(f, this.loot)) {
		_T = rt.getStep(f, this, 0);
		while (this.lootcount && rt.len(f, this.loot)) {
			lootspawn = pickweight(this.loot);
			if (!this.lootdoubles) {
				yield* this.loot.Remove(lootspawn);
			}
			if (lootspawn) {
				yield* new_(lootspawn, _T);
			}
			this.lootcount--;
		}
	}
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(11866, "/obj/effect/spawner/lootdrop/armory_contraband", "/obj/effect/spawner/lootdrop", {
	lootdoubles: 0,
	loot: null,
	name: "armory contraband gun spawner",
});

// lootdrop.dm:27
rt.def("/obj/effect/spawner/lootdrop/armory_contraband/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.loot = rt.alist(f, [T("/obj/item/weapon/gun/ballistic/automatic/pistol"), 8, T("/obj/item/weapon/gun/ballistic/shotgun/automatic/combat"), 5, null, T("/obj/item/weapon/gun/ballistic/revolver/mateba"), null, T("/obj/item/weapon/gun/ballistic/automatic/pistol/deagle")]);
	return f.dot;
});

rt.type(11867, "/obj/effect/spawner/lootdrop/gambling", "/obj/effect/spawner/lootdrop", {
	loot: null,
	name: "gambling valuables spawner",
});

// lootdrop.dm:36
rt.def("/obj/effect/spawner/lootdrop/gambling/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.loot = rt.alist(f, [T("/obj/item/weapon/gun/ballistic/revolver/russian"), 5, T("/obj/item/weapon/storage/box/syndie_kit/throwing_weapons"), 1, T("/obj/item/toy/cards/deck/syndicate"), 2]);
	return f.dot;
});

rt.type(11868, "/obj/effect/spawner/lootdrop/grille_or_trash", "/obj/effect/spawner/lootdrop", {
	name: "maint grille or trash spawner",
	loot: null,
});

// lootdrop.dm:44
rt.def("/obj/effect/spawner/lootdrop/grille_or_trash/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.loot = rt.alist(f, [T("/obj/structure/grille"), 5, T("/obj/item/weapon/cigbutt"), 1, T("/obj/item/trash/cheesie"), 1, T("/obj/item/trash/candy"), 1, T("/obj/item/trash/chips"), 1, T("/obj/item/trash/deadmouse"), 1, T("/obj/item/trash/pistachios"), 1, T("/obj/item/trash/plate"), 1, T("/obj/item/trash/popcorn"), 1, T("/obj/item/trash/raisins"), 1, T("/obj/item/trash/sosjerky"), 1, T("/obj/item/trash/syndi_cakes"), 1]);
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

// lootdrop.dm:61
rt.def("/obj/effect/spawner/lootdrop/three_course_meal/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.soups = list(T("/obj/item/weapon/reagent_containers/food/snacks/soup/beet"), T("/obj/item/weapon/reagent_containers/food/snacks/soup/sweetpotato"), T("/obj/item/weapon/reagent_containers/food/snacks/soup/stew"), T("/obj/item/weapon/reagent_containers/food/snacks/soup/hotchili"), T("/obj/item/weapon/reagent_containers/food/snacks/soup/nettle"), T("/obj/item/weapon/reagent_containers/food/snacks/soup/meatball"));

	this.salads = list(T("/obj/item/weapon/reagent_containers/food/snacks/salad/herbsalad"), T("/obj/item/weapon/reagent_containers/food/snacks/salad/validsalad"), T("/obj/item/weapon/reagent_containers/food/snacks/salad/fruit"), T("/obj/item/weapon/reagent_containers/food/snacks/salad/jungle"), T("/obj/item/weapon/reagent_containers/food/snacks/salad/aesirsalad"));

	this.mains = list(T("/obj/item/weapon/reagent_containers/food/snacks/bearsteak"), T("/obj/item/weapon/reagent_containers/food/snacks/enchiladas"), T("/obj/item/weapon/reagent_containers/food/snacks/stewedsoymeat"), T("/obj/item/weapon/reagent_containers/food/snacks/burger/bigbite"), T("/obj/item/weapon/reagent_containers/food/snacks/burger/superbite"), T("/obj/item/weapon/reagent_containers/food/snacks/burger/fivealarm"));
	return f.dot;
});

// lootdrop.dm:83
rt.def("/obj/effect/spawner/lootdrop/three_course_meal/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	this.loot = rt.alist(f, [pick(this.soups), 1, pick(this.salads), 1, pick(this.mains), 1]);
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

rt.type(11870, "/obj/effect/spawner/lootdrop/maintenance", "/obj/effect/spawner/lootdrop", {
	name: "maintenance loot spawner",
});

// lootdrop.dm:91
rt.def("/obj/effect/spawner/lootdrop/maintenance/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	this.loot = GLOB.maintenance_loot;
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(11871, "/obj/effect/spawner/lootdrop/crate_spawner", "/obj/effect/spawner/lootdrop", {
	lootdoubles: 0,
	name: "lootcrate spawner",
	loot: null,
});

// lootdrop.dm:98
rt.def("/obj/effect/spawner/lootdrop/crate_spawner/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.loot = rt.alist(f, [T("/obj/structure/closet/crate/secure/loot"), 20, "", 80]);
	return f.dot;
});

rt.type(11872, "/obj/effect/spawner/lootdrop/organ_spawner", "/obj/effect/spawner/lootdrop", {
	loot: null,
	lootcount: 3,
	name: "organ spawner",
});

// lootdrop.dm:105
rt.def("/obj/effect/spawner/lootdrop/organ_spawner/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.loot = rt.alist(f, [T("/obj/item/organ/heart/gland/bloody"), 7, T("/obj/item/organ/heart/gland/bodysnatch"), 4, T("/obj/item/organ/heart/gland/egg"), 7, T("/obj/item/organ/heart/gland/emp"), 3, T("/obj/item/organ/heart/gland/mindshock"), 5, T("/obj/item/organ/heart/gland/plasma"), 7, T("/obj/item/organ/heart/gland/pop"), 5, T("/obj/item/organ/heart/gland/slime"), 4, T("/obj/item/organ/heart/gland/spiderman"), 5, T("/obj/item/organ/heart/gland/ventcrawling"), 1, T("/obj/item/organ/body_egg/alien_embryo"), 1, T("/obj/item/organ/regenerative_core"), 2]);
	return f.dot;
});

rt.type(11873, "/obj/effect/spawner/lootdrop/two_percent_xeno_egg_spawner", "/obj/effect/spawner/lootdrop", {
	name: "2% chance xeno egg spawner",
	loot: null,
});

// lootdrop.dm:122
rt.def("/obj/effect/spawner/lootdrop/two_percent_xeno_egg_spawner/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.loot = rt.alist(f, [T("/obj/effect/decal/remains/xeno"), 49, T("/obj/effect/spawner/xeno_egg_delivery"), 1]);
	return f.dot;
});

rt.type(11874, "/obj/effect/spawner/lootdrop/costume", "/obj/effect/spawner/lootdrop", {
	name: "random costume spawner",
});

// lootdrop.dm:130
rt.def("/obj/effect/spawner/lootdrop/costume/proc/Initialize", function* Initialize(f: Frame) {
	let path: Value = null;
	this.loot = list();
	for (path of each(typesof(T("/obj/effect/spawner/bundle/costume")) - T("/obj/effect/spawner/bundle/costume"))) {
		rt.setAt(this.loot, path, 1);
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(11876, "/obj/effect/spawner/lootdrop/minor/beret_or_rabbitears", "/obj/effect/spawner/lootdrop/minor", {
	loot: null,
	name: "beret or rabbit ears spawner",
});

// lootdrop.dm:139
rt.def("/obj/effect/spawner/lootdrop/minor/beret_or_rabbitears/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.loot = rt.alist(f, [T("/obj/item/clothing/head/beret"), 1, T("/obj/item/clothing/head/rabbitears"), 1]);
	return f.dot;
});

rt.type(11877, "/obj/effect/spawner/lootdrop/minor/bowler_or_that", "/obj/effect/spawner/lootdrop/minor", {
	loot: null,
	name: "bowler or top hat spawner",
});

// lootdrop.dm:145
rt.def("/obj/effect/spawner/lootdrop/minor/bowler_or_that/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.loot = rt.alist(f, [T("/obj/item/clothing/head/bowler"), 1, T("/obj/item/clothing/head/that"), 1]);
	return f.dot;
});

rt.type(11878, "/obj/effect/spawner/lootdrop/minor/kittyears_or_rabbitears", "/obj/effect/spawner/lootdrop/minor", {
	loot: null,
	name: "kitty ears or rabbit ears spawner",
});

// lootdrop.dm:151
rt.def("/obj/effect/spawner/lootdrop/minor/kittyears_or_rabbitears/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.loot = rt.alist(f, [T("/obj/item/clothing/head/kitty"), 1, T("/obj/item/clothing/head/rabbitears"), 1]);
	return f.dot;
});

rt.type(11879, "/obj/effect/spawner/lootdrop/minor/pirate_or_bandana", "/obj/effect/spawner/lootdrop/minor", {
	loot: null,
	name: "pirate hat or bandana spawner",
});

// lootdrop.dm:157
rt.def("/obj/effect/spawner/lootdrop/minor/pirate_or_bandana/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.loot = rt.alist(f, [T("/obj/item/clothing/head/pirate"), 1, T("/obj/item/clothing/head/bandana"), 1]);
	return f.dot;
});

rt.type(11880, "/obj/effect/spawner/lootdrop/minor/twentyfive_percent_cyborg_mask", "/obj/effect/spawner/lootdrop/minor", {
	loot: null,
	name: "25% cyborg mask spawner",
});

// lootdrop.dm:163
rt.def("/obj/effect/spawner/lootdrop/minor/twentyfive_percent_cyborg_mask/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.loot = rt.alist(f, [T("/obj/item/clothing/mask/gas/cyborg"), 25, "", 75]);
	return f.dot;
});
