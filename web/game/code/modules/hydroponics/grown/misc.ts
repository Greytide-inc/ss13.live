// Based on /tg/station's code/modules/hydroponics/grown/misc.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


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

// misc.dm:16
rt.def("/obj/item/seeds/starthistle/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.genes = list(T("/datum/plant_gene/trait/plant_type/weed_hardy"));

	this.mutatelist = list(T("/obj/item/seeds/harebell"));
	return f.dot;
});

// misc.dm:20
rt.def("/obj/item/seeds/starthistle/proc/harvest", function* harvest(f: Frame, user: Value) {
	let output_loc: Value = null, i: Value = null, harvestseeds: Value = null;
	let $e: any;
	let parent: Value = this.loc;
	let seed_count: Value = this.yield;
	if (prob(this.getYield() * 20)) {
		seed_count++;
		output_loc = parent.Adjacent(user) ? user.loc : parent.loc;
		rt.forRange(f, 0, 1, seed_count, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			yield* (harvestseeds = (yield* this.Copy())).forceMove(output_loc);
		}
		rt.endFor(f, 0);
	}
	yield* parent.update_tray();
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

// misc.dm:46
rt.def("/obj/item/seeds/cabbage/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.genes = list(T("/datum/plant_gene/trait/repeated_harvest"));
	this.reagents_add = rt.alist(f, ["vitamin", 0.04, "nutriment", 0.1]);

	this.mutatelist = list(T("/obj/item/seeds/replicapod"));
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

// misc.dm:67
rt.def("/obj/item/seeds/sugarcane/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.genes = list(T("/datum/plant_gene/trait/repeated_harvest"));
	this.reagents_add = rt.alist(f, ["sugar", 0.25]);
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

// misc.dm:92
rt.def("/obj/item/seeds/gatfruit/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.genes = list(T("/datum/plant_gene/trait/repeated_harvest"));
	this.reagents_add = rt.alist(f, ["sulfur", 0.1, "carbon", 0.1, "nitrogen", 0.07, "potassium", 0.05]);
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

// misc.dm:121
rt.def("/obj/item/seeds/cherry/bomb/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mutatelist = list();
	this.reagents_add = rt.alist(f, ["nutriment", 0.1, "sugar", 0.1, "blackpowder", 0.7]);
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

// misc.dm:137
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/cherry_bomb/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let $2: any;
	let A: Value = get_area(user);
	user.visible_message(`<span class='warning'>${user} plucks the stem from ${this}!</span>`, `<span class='userdanger'>You pluck the stem from ${this}, which begins to hiss loudly!</span>`);
	let $0: any = `${key_name_admin(user)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [user])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [user])}`;
	let $1: any = A;
	if (user) {
		$2 = `${`(${user.x},${user.y},${user.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${user.x};Y=${user.y};Z=${user.z}'>JMP</a>)`}`;
	} else {
		$2 = "nonexistent location";
	}
	message_admins(`${$0} primed a cherry bomb for detonation at ${$1} ${`${$2}`}`);
	log_game(`${key_name(user)} primed a cherry bomb for detonation at ${A} ${`(${user.x},${user.y},${user.z})`}.`);
	yield* this.prime();
	return f.dot;
}, true);

// misc.dm:144
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/cherry_bomb/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	disassembled ??= 1;
	if (!disassembled) {
		yield* this.prime();
	}
	if (!this || this.gc_destroyed) return f.dot;
	yield* qdel(this);
	return f.dot;
}, true);

// misc.dm:150
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/cherry_bomb/proc/ex_act", function* ex_act(f: Frame, severity: Value) {
	yield* qdel(this);
	return f.dot;
}, true, { waitfor: false });

// misc.dm:153
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/cherry_bomb/proc/prime", function* prime(f: Frame) {
	this.icon_state = "cherry_bomb_lit";
	playsound(this, rt.rsc("sound/effects/fuse.ogg"), this.seed.potency, 0);
	this.reagents.chem_temp = 1000;
	yield* this.reagents.handle_reactions();
	return f.dot;
}, true);
