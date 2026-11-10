// Based on /tg/station's code/modules/hydroponics/grown/chili.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


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

// chili.dm:17
rt.def("/obj/item/seeds/chili/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.genes = list(T("/datum/plant_gene/trait/repeated_harvest"));
	this.reagents_add = rt.alist(f, ["capsaicin", 0.25, "vitamin", 0.04, "nutriment", 0.04]);

	this.mutatelist = list(T("/obj/item/seeds/chili/ice"), T("/obj/item/seeds/chili/ghost"));
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

// chili.dm:41
rt.def("/obj/item/seeds/chili/ice/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mutatelist = list();
	this.reagents_add = rt.alist(f, ["frostoil", 0.25, "vitamin", 0.02, "nutriment", 0.02]);
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

// chili.dm:66
rt.def("/obj/item/seeds/chili/ghost/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mutatelist = list();
	this.reagents_add = rt.alist(f, ["condensedcapsaicin", 0.3, "capsaicin", 0.55, "nutriment", 0.04]);
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

// chili.dm:80
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/ghost_chili/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	yield* parent_proc();
	if (!ismob(this.loc)) return f.dot;
	this.held_mob = this.loc;
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSobj.processing += this;
	return f.dot;
}, true);

// chili.dm:86
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/ghost_chili/proc/process", function process(f: Frame) {
	if (this.held_mob && this.loc == this.held_mob) {
		if (this.held_mob.is_holding(this)) {
			if (hasvar(this.held_mob, "gloves") && this.held_mob.gloves) {
				return f.dot;
			}
			this.held_mob.bodytemperature += 22.5;
			if (prob(10)) {
				to_chat(this.held_mob, `<span class='warning'>Your hand holding ${this} burns!</span>`);
			}
		}
	} else {
		this.held_mob = null;
		parent_proc();
	}
	return f.dot;
}, false, { waitfor: false });
