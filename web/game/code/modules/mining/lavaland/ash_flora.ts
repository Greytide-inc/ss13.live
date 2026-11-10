// Based on /tg/station's code/modules/mining/lavaland/ash_flora.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(12511, "/obj/structure/flora/ash", "/obj/structure/flora", {
	harvested_name: "shortened mushrooms",
	harvested_desc: "Some quickly regrowing mushrooms, formerly known to be quite large.",
	needs_sharp_harvest: 1,
	harvest: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/ash_flora/shavings"),
	harvest_amount_low: 1,
	harvest_amount_high: 3,
	harvest_time: 60,
	harvest_message_low: "You pick a mushroom, but fail to collect many shavings from its cap.",
	harvest_message_med: "You pick a mushroom, carefully collecting the shavings from its cap.",
	harvest_message_high: "You harvest and collect shavings from several mushroom caps.",
	harvested: 0,
	base_icon: null,
	regrowth_time_low: 4800,
	regrowth_time_high: 8400,
	gender: "plural",
	layer: 2.75,
	icon: rt.rsc("icons/obj/lavaland/ash_flora.dmi"),
	icon_state: "l_mushroom",
	name: "large mushrooms",
	desc: "A number of large mushrooms, covered in a faint layer of ash and what can only be spores.",
});

// ash_flora.dm:24
rt.def("/obj/structure/flora/ash/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.base_icon = `${this.icon_state}${rand(1, 4)}`;
	this.icon_state = this.base_icon;
	if (!prob(15)) return f.dot;
	yield* this.harvest(null, 1);
	return f.dot;
}, true);

// ash_flora.dm:33
rt.def("/obj/structure/flora/ash/proc/harvest", function* harvest(f: Frame, user: Value, no_drop: Value) {
	let rand_harvested: Value = null, msg: Value = null, i: Value = null;
	let $e: any;
	if (this.harvested) {
		return 0;
	}
	if (!no_drop) {
		if (rand_harvested = rand(this.harvest_amount_low, this.harvest_amount_high)) {
			if (user) {
				msg = this.harvest_message_med;
				if (rand_harvested == this.harvest_amount_low) {
					msg = this.harvest_message_low;
				} else if (rand_harvested == this.harvest_amount_high) {
					msg = this.harvest_message_high;
				}
				to_chat(user, `<span class='notice'>${msg}</span>`);
			}
			rt.forRange(f, 0, 1, rand_harvested, 1);
			while (($e = rt.next(f, 0)) !== undefined) {
				i = $e;
				yield* new_(this.harvest, rt.getStep(f, this, 0));
			}
			rt.endFor(f, 0);
		}
	}
	this.icon_state = `${this.base_icon}p`;
	this.name = this.harvested_name;
	this.desc = this.harvested_desc;
	this.harvested = 1;
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/structure/flora/ash/proc/regrow"))), rand(this.regrowth_time_low, this.regrowth_time_high));
	return 1;
}, true);

// ash_flora.dm:53
rt.def("/obj/structure/flora/ash/proc/regrow", function regrow(f: Frame) {
	this.icon_state = this.base_icon;
	this.name = rt.initial(f, this, "name");
	this.desc = rt.initial(f, this, "desc");
	this.harvested = 0;
	return f.dot;
});

// ash_flora.dm:59
rt.def("/obj/structure/flora/ash/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (!this.harvested && this.needs_sharp_harvest && W.sharpness) {
		user.visible_message(`<span class='notice'>${user} starts to harvest from ${this} with ${W}.</span>`, `<span class='notice'>You begin to harvest from ${this} with ${W}.</span>`);
		if (yield* do_after(user, this.harvest_time, { target: this })) {
			yield* this.harvest(user);
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// ash_flora.dm:67
rt.def("/obj/structure/flora/ash/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (!this.harvested && !this.needs_sharp_harvest) {
		user.visible_message(`<span class='notice'>${user} starts to harvest from ${this}.</span>`, `<span class='notice'>You begin to harvest from ${this}.</span>`);
		if (yield* do_after(user, this.harvest_time, { target: this })) {
			yield* this.harvest(user);
		}
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

rt.type(12516, "/obj/structure/flora/ash/cacti", "/obj/structure/flora/ash", {
	harvested_name: "cacti",
	harvested_desc: "A bunch of prickly cacti. You can see fruits slowly growing beneath the covering of ash.",
	harvest: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/ash_flora/cactus_fruit"),
	needs_sharp_harvest: 0,
	harvest_amount_high: 2,
	harvest_time: 10,
	harvest_message_low: "You pick a cactus fruit.",
	harvest_message_med: "You pick several cactus fruit.",
	harvest_message_high: "You pick a pair of cactus fruit.",
	regrowth_time_low: 4800,
	regrowth_time_high: 7200,
	icon_state: "cactus",
	name: "fruiting cacti",
	desc: "Several prickly cacti, brimming with ripe fruit and covered in a thin layer of ash.",
});

// ash_flora.dm:141
rt.def("/obj/structure/flora/ash/cacti/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	let H: Value = null, O: Value = null;
	if (!(rt.istype(AM, T("/mob/living/carbon/human")) && this.has_gravity(this.loc) && prob(70))) return f.dot;
	if (!(!(H = AM).shoes && !H.lying)) return f.dot;
	let picked_def_zone: Value = pick("l_leg", "r_leg");
	if (!rt.istype((O = H.get_bodypart(picked_def_zone)), T("/obj/item/bodypart")) || rt.isIn(f, PIERCEIMMUNE, H.dna.species.species_traits)) {
		return f.dot;
	}
	yield* H.apply_damage(rand(3, 6), "brute", picked_def_zone);
	yield* H.Knockdown(40);
	H.visible_message(`<span class='danger'>${H} steps on a cactus!</span>`, "<span class='userdanger'>You step on a cactus!</span>");
	return f.dot;
}, true);

rt.type(6349, "/obj/item/weapon/reagent_containers/food/snacks/grown/ash_flora", "/obj/item/weapon/reagent_containers/food/snacks/grown", {
	name: "mushroom shavings",
	desc: "Some shavings from a tall mushroom. With enough, might serve as a bowl.",
	icon: rt.rsc("icons/obj/lavaland/ash_flora.dmi"),
	icon_state: "mushroom_shavings",
	list_reagents: null,
	w_class: 1,
	resistance_flags: 4,
	obj_integrity: 100,
	max_integrity: 100,
	seed: rt.typePath("/obj/item/seeds/lavaland/polypore"),
});

// ash_flora.dm:158
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/ash_flora/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["sugar", 3, "ethanol", 2, "stabilizing_agent", 3, "minttoxin", 2]);
	return f.dot;
});

// ash_flora.dm:166
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/ash_flora/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.pixel_x = rand(-4, 4);
	this.pixel_y = rand(-4, 4);
	return f.dot;
}, true);

rt.type(6351, "/obj/item/weapon/reagent_containers/food/snacks/grown/ash_flora/mushroom_leaf", "/obj/item/weapon/reagent_containers/food/snacks/grown/ash_flora", {
	name: "mushroom leaf",
	desc: "A leaf, from a mushroom.",
	list_reagents: null,
	icon_state: "mushroom_leaf",
	seed: rt.typePath("/obj/item/seeds/lavaland/porcini"),
});

// ash_flora.dm:176
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/ash_flora/mushroom_leaf/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["nutriment", 3, "vitfro", 2, "nicotine", 2]);
	return f.dot;
});

rt.type(6352, "/obj/item/weapon/reagent_containers/food/snacks/grown/ash_flora/mushroom_cap", "/obj/item/weapon/reagent_containers/food/snacks/grown/ash_flora", {
	name: "mushroom cap",
	desc: "The cap of a large mushroom.",
	list_reagents: null,
	icon_state: "mushroom_cap",
	seed: rt.typePath("/obj/item/seeds/lavaland/inocybe"),
});

// ash_flora.dm:184
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/ash_flora/mushroom_cap/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["mindbreaker", 2, "entpoly", 4, "mushroomhallucinogen", 2]);
	return f.dot;
});

rt.type(6353, "/obj/item/weapon/reagent_containers/food/snacks/grown/ash_flora/mushroom_stem", "/obj/item/weapon/reagent_containers/food/snacks/grown/ash_flora", {
	name: "mushroom stem",
	desc: "A long mushroom stem. It's slightly glowing.",
	list_reagents: null,
	icon_state: "mushroom_stem",
	luminosity: 1,
	seed: rt.typePath("/obj/item/seeds/lavaland/ember"),
});

// ash_flora.dm:192
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/ash_flora/mushroom_stem/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["tinlux", 2, "vitamin", 1, "space_drugs", 1]);
	return f.dot;
});

rt.type(6354, "/obj/item/weapon/reagent_containers/food/snacks/grown/ash_flora/cactus_fruit", "/obj/item/weapon/reagent_containers/food/snacks/grown/ash_flora", {
	name: "cactus fruit",
	list_reagents: null,
	desc: "A cactus fruit covered in a thick, reddish skin. And some ash.",
	icon_state: "cactus_fruit",
	seed: rt.typePath("/obj/item/seeds/lavaland/cactus"),
});

// ash_flora.dm:199
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/ash_flora/cactus_fruit/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["vitamin", 2, "nutriment", 2, "vitfro", 4]);
	return f.dot;
});

rt.type(1801, "/datum/crafting_recipe/mushroom_bowl", "/datum/crafting_recipe", {
	name: "Mushroom Bowl",
	time: 30,
	category: "Tribal",
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/drinks/mushroom_bowl"),
	reqs: null,
});

// ash_flora.dm:219
rt.def("/datum/crafting_recipe/mushroom_bowl/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/grown/ash_flora/shavings"), 5]);
	return f.dot;
});
