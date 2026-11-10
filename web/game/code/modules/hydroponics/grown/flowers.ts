// Based on /tg/station's code/modules/hydroponics/grown/flowers.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


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

// flowers.dm:18
rt.def("/obj/item/seeds/poppy/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reagents_add = rt.alist(f, ["bicaridine", 0.2, "nutriment", 0.05]);

	this.mutatelist = list(T("/obj/item/seeds/poppy/geranium"), T("/obj/item/seeds/poppy/lily"));
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

// flowers.dm:37
rt.def("/obj/item/seeds/poppy/lily/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mutatelist = list();
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

// flowers.dm:54
rt.def("/obj/item/seeds/poppy/geranium/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mutatelist = list();
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

// flowers.dm:79
rt.def("/obj/item/seeds/harebell/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.genes = list(T("/datum/plant_gene/trait/plant_type/weed_hardy"));
	this.reagents_add = rt.alist(f, ["nutriment", 0.04]);
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

// flowers.dm:109
rt.def("/obj/item/seeds/sunflower/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reagents_add = rt.alist(f, ["cornoil", 0.08, "nutriment", 0.04]);

	this.mutatelist = list(T("/obj/item/seeds/sunflower/moonflower"), T("/obj/item/seeds/sunflower/novaflower"));
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

// flowers.dm:125
rt.def("/obj/item/weapon/grown/sunflower/proc/attack", function attack(f: Frame, M: Value, user: Value) {
	to_chat(M, `<font color='green'><b> ${user} smacks you with a sunflower!</font><font color='yellow'><b>FLOWER POWER<b></font>`);
	to_chat(user, `<font color='green'>Your sunflower's </font><font color='yellow'><b>FLOWER POWER</b></font><font color='green'>strikes ${M}</font>`);
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

// flowers.dm:136
rt.def("/obj/item/seeds/sunflower/moonflower/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mutatelist = list();
	this.reagents_add = rt.alist(f, ["moonshine", 0.2, "vitamin", 0.02, "nutriment", 0.02]);
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

// flowers.dm:157
rt.def("/obj/item/seeds/sunflower/novaflower/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mutatelist = list();
	this.reagents_add = rt.alist(f, ["condensedcapsaicin", 0.25, "capsaicin", 0.3, "nutriment", 0]);
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

// flowers.dm:176
rt.def("/obj/item/weapon/grown/novaflower/proc/add_juice", function add_juice(f: Frame) {
	parent_proc();
	this.force = round(5 + this.seed.potency / 5, 1);
	return f.dot;
});

// flowers.dm:180
rt.def("/obj/item/weapon/grown/novaflower/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	if (!(yield* parent_proc())) {
		return f.dot;
	}
	if (!rt.istype(M, T("/mob/living"))) return f.dot;
	to_chat(M, `<span class='danger'>You are lit on fire from the intense heat of the ${this.name}!</span>`);
	yield* M.adjust_fire_stacks(this.seed.potency / 20);
	if (!(yield* M.IgniteMob())) return f.dot;
	message_admins(`${key_name_admin(user)} set ${key_name_admin(M)} on fire`);
	log_game(`${key_name(user)} set ${key_name(M)} on fire`);
	return f.dot;
}, true);

// flowers.dm:190
rt.def("/obj/item/weapon/grown/novaflower/proc/afterattack", function* afterattack(f: Frame, A: Value, user: Value, proximity: Value) {
	if (!proximity) {
		return f.dot;
	}
	if (this.force > 0) {
		this.force -= rand(1, this.force / 3 + 1);
	} else {
		to_chat(f.usr, `<span class='warning'>All the petals have fallen off the ${this.name} from violent whacking!</span>`);
		yield* qdel(this);
	}
	return f.dot;
}, true);

// flowers.dm:198
rt.def("/obj/item/weapon/grown/novaflower/proc/pickup", function* pickup(f: Frame, user: Value) {
	yield* parent_proc();
	if (user.gloves) return f.dot;
	to_chat(user, `<span class='danger'>The ${this.name} burns your bare hand!</span>`);
	yield* user.adjustFireLoss(rand(1, 5));
	return f.dot;
}, true);
