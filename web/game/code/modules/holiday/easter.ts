// Based on /tg/station's code/modules/holiday/easter.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// easter.dm:3
rt.def("/datum/holiday/easter/proc/greet", function greet(f: Frame) {
	return "Greetings! Have a Happy Easter and keep an eye out for Easter Bunnies!";
});

rt.type(356, "/datum/round_event/easter", "/datum/round_event", {});

// easter.dm:14
rt.def("/datum/round_event/easter/proc/announce", function* announce(f: Frame) {
	yield* priority_announce(pick("Hip-hop into Easter!", "Find some Bunny's stash!", "Today is National 'Hunt a Wabbit' Day.", "Be kind, give Chocolate Eggs!"));
	return f.dot;
}, true);

rt.type(357, "/datum/round_event/rabbitrelease", "/datum/round_event", {});

// easter.dm:25
rt.def("/datum/round_event/rabbitrelease/proc/announce", function* announce(f: Frame) {
	yield* priority_announce(`Unidentified furry objects detected coming aboard ${station_name()}. Beware of Adorable-ness.`, "Fluffy Alert", rt.rsc("sound/ai/aliens.ogg"));
	return f.dot;
}, true);

// easter.dm:29
rt.def("/datum/round_event/rabbitrelease/proc/start", function* start(f: Frame) {
	let R: Value = null;
	for (R of each(GLOB.landmarks_list, T("/obj/effect/landmark"))) {
		if (R.name != "blobspawn") {
			if (prob(35)) {
				if (rt.istype(R.loc, T("/turf/open/space"))) {
					yield* new_(T("/mob/living/simple_animal/chicken/rabbit/space"), R.loc);
				} else {
					yield* new_(T("/mob/living/simple_animal/chicken/rabbit"), R.loc);
				}
			}
		}
	}
	return f.dot;
}, true);

rt.type(5070, "/mob/living/simple_animal/chicken/rabbit", "/mob/living/simple_animal/chicken", {
	name: "１rabbit",
	desc: "The hippiest hop around.",
	icon: rt.rsc("icons/mob/easter.dmi"),
	icon_state: "rabbit_white",
	icon_living: "rabbit_white",
	icon_dead: "rabbit_white_dead",
	speak: null,
	speak_emote: null,
	emote_hear: null,
	emote_see: null,
	butcher_results: null,
	eggsleft: 10,
	eggsFertile: 0,
	icon_prefix: "rabbit",
	feedMessages: null,
	layMessage: null,
	egg_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/egg/loaded"),
	food_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/carrot"),
});

// easter.dm:46
rt.def("/mob/living/simple_animal/chicken/rabbit/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.speak = list("Hop into Easter!", "Come get your eggs!", "Prizes for everyone!");
	this.speak_emote = list("sniffles", "twitches");

	this.emote_hear = list("hops.");
	this.emote_see = list("hops around", "bounces up and down");

	this.butcher_results = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab"), 1]);
	this.feedMessages = list("It nibbles happily.", "It noms happily.");
	this.layMessage = list("hides an egg.", "scampers around suspiciously.", "begins making a huge racket.", "begins shuffling.");
	return f.dot;
});

rt.type(5072, "/mob/living/simple_animal/chicken/rabbit/space", "/mob/living/simple_animal/chicken/rabbit", {
	icon_prefix: "s_rabbit",
	icon_state: "s_rabbit_white",
	icon_living: "s_rabbit_white",
	icon_dead: "s_rabbit_white_dead",
	atmos_requirements: null,
	minbodytemp: 0,
	maxbodytemp: 1500,
	unsuitable_atmos_damage: 0,
});

// easter.dm:62
rt.def("/mob/living/simple_animal/chicken/rabbit/space/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.atmos_requirements = rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]);
	return f.dot;
});

rt.type(5541, "/obj/item/weapon/storage/bag/easterbasket", "/obj/item/weapon/storage/bag", {
	name: "Easter Basket",
	icon: rt.rsc("icons/mob/easter.dmi"),
	icon_state: "basket",
	can_hold: null,
});

// easter.dm:72
rt.def("/obj/item/weapon/storage/bag/easterbasket/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.can_hold = list(T("/obj/item/weapon/reagent_containers/food/snacks/egg"), T("/obj/item/weapon/reagent_containers/food/snacks/chocolateegg"), T("/obj/item/weapon/reagent_containers/food/snacks/boiledegg"));
	return f.dot;
});

// easter.dm:75
rt.def("/obj/item/weapon/storage/bag/easterbasket/proc/countEggs", function countEggs(f: Frame) {
	this.cut_overlays();
	this.add_overlay("basket-grass");
	this.add_overlay(`basket-egg${min(rt.len(f, this.contents), 5)}`);
	return f.dot;
});

// easter.dm:80
rt.def("/obj/item/weapon/storage/bag/easterbasket/proc/remove_from_storage", function* remove_from_storage(f: Frame, W: Value, new_location: Value) {
	yield* parent_proc();
	this.countEggs();
	return f.dot;
}, true);

// easter.dm:84
rt.def("/obj/item/weapon/storage/bag/easterbasket/proc/handle_item_insertion", function* handle_item_insertion(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	f.dot = (yield* parent_proc());
	this.countEggs();
	return f.dot;
}, true, { args: ["I", "prevent_warning"] });

rt.type(5981, "/obj/item/weapon/reagent_containers/food/snacks/egg/loaded", "/obj/item/weapon/reagent_containers/food/snacks/egg", {
	containsPrize: 1,
});

// easter.dm:113
rt.def("/obj/item/weapon/reagent_containers/food/snacks/egg/loaded/proc/New", function* New(f: Frame) {
	let eggcolor: Value = null;
	yield* parent_proc();
	this.icon_state = `egg-${(eggcolor = pick("blue", "green", "mime", "orange", "purple", "rainbow", "red", "yellow"))}`;
	this.item_color = `${eggcolor}`;
	return f.dot;
}, true);

// easter.dm:119
rt.def("/obj/item/weapon/reagent_containers/food/snacks/egg/proc/dispensePrize", function* dispensePrize(f: Frame, where: Value) {
	let won: Value = pick(T("/obj/item/clothing/head/bunnyhead"), T("/obj/item/clothing/suit/bunnysuit"), T("/obj/item/weapon/reagent_containers/food/snacks/grown/carrot"), T("/obj/item/weapon/reagent_containers/food/snacks/chocolateegg"), T("/obj/item/toy/balloon"), T("/obj/item/toy/gun"), T("/obj/item/toy/sword"), T("/obj/item/toy/foamblade"), T("/obj/item/toy/prize/ripley"), T("/obj/item/toy/prize/honk"), T("/obj/item/toy/carpplushie"), T("/obj/item/toy/redbutton"), T("/obj/item/clothing/head/collectable/rabbitears"));
	yield* new_(won, where);
	yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/chocolateegg"), where);
	return f.dot;
}, true);

// easter.dm:136
rt.def("/obj/item/weapon/reagent_containers/food/snacks/egg/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	yield* parent_proc();
	if (!this.containsPrize) return f.dot;
	to_chat(user, `<span class='notice'>You unwrap the ${this} and find a prize inside!</span>`);
	yield* this.dispensePrize(rt.getStep(f, user, 0));
	this.containsPrize = 0;
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(1796, "/datum/crafting_recipe/food/food/hotcrossbun", "/datum/crafting_recipe/food/food", {
	name: "Hot-Cross Bun",
	category: "Misc. Food",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/hotcrossbun"),
});

// easter.dm:152
rt.def("/datum/crafting_recipe/food/food/hotcrossbun/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/store/bread/plain"), 1, T("/datum/reagent/consumable/sugar"), 1]);
	return f.dot;
});

rt.type(5909, "/obj/item/weapon/reagent_containers/food/snacks/store/cake/brioche", "/obj/item/weapon/reagent_containers/food/snacks/store/cake", {
	slices_num: 6,
	bonus_reagents: null,
	name: "brioche cake",
	desc: "A ring of sweet, glazed buns.",
	icon_state: "briochecake",
	slice_path: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/cakeslice/brioche"),
});

// easter.dm:166
rt.def("/obj/item/weapon/reagent_containers/food/snacks/store/cake/brioche/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.bonus_reagents = rt.alist(f, ["nutriment", 10, "vitamin", 2]);
	return f.dot;
});

rt.type(1797, "/datum/crafting_recipe/food/food/briochecake", "/datum/crafting_recipe/food/food", {
	name: "Brioche cake",
	category: "Misc. Food",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/store/cake/brioche"),
});

// easter.dm:176
rt.def("/datum/crafting_recipe/food/food/briochecake/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/store/cake/plain"), 1, T("/datum/reagent/consumable/sugar"), 2]);
	return f.dot;
});

rt.type(6255, "/obj/item/weapon/reagent_containers/food/snacks/scotchegg", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	bitesize: 3,
	filling_color: "#FFFFF0",
	name: "scotch egg",
	desc: "A boiled egg wrapped in a delicious, seasoned meatball.",
	icon_state: "scotchegg",
	list_reagents: null,
});

// easter.dm:187
rt.def("/obj/item/weapon/reagent_containers/food/snacks/scotchegg/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.bonus_reagents = rt.alist(f, ["nutriment", 2, "vitamin", 2]);
	this.list_reagents = rt.alist(f, ["nutriment", 6]);
	return f.dot;
});

rt.type(1798, "/datum/crafting_recipe/food/scotchegg", "/datum/crafting_recipe/food", {
	name: "Scotch egg",
	category: "Misc. Food",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/scotchegg"),
});

// easter.dm:194
rt.def("/datum/crafting_recipe/food/scotchegg/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/datum/reagent/consumable/sodiumchloride"), 1, T("/datum/reagent/consumable/blackpepper"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/boiledegg"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/faggot"), 1]);
	return f.dot;
});

rt.type(6177, "/obj/item/weapon/reagent_containers/food/snacks/soup/mammi", "/obj/item/weapon/reagent_containers/food/snacks/soup", {
	bonus_reagents: null,
	name: "Mammi",
	desc: "A bowl of mushy bread and milk. It reminds you, not too fondly, of a bowel movement.",
	icon_state: "mammi",
	list_reagents: null,
});

// easter.dm:207
rt.def("/obj/item/weapon/reagent_containers/food/snacks/soup/mammi/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.bonus_reagents = rt.alist(f, ["nutriment", 3, "vitamin", 1]);
	this.list_reagents = rt.alist(f, ["nutriment", 8, "vitamin", 1]);
	return f.dot;
});

rt.type(1799, "/datum/crafting_recipe/food/mammi", "/datum/crafting_recipe/food", {
	name: "Mammi",
	category: "Misc. Food",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/soup/mammi"),
});

// easter.dm:212
rt.def("/datum/crafting_recipe/food/mammi/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/store/bread/plain"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/chocolatebar"), 1, T("/datum/reagent/consumable/milk"), 5]);
	return f.dot;
});

rt.type(6256, "/obj/item/weapon/reagent_containers/food/snacks/chocolatebunny", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	filling_color: "#A0522D",
	name: "chocolate bunny",
	desc: "Contains less than 10% real rabbit!",
	icon_state: "chocolatebunny",
	list_reagents: null,
});

// easter.dm:224
rt.def("/obj/item/weapon/reagent_containers/food/snacks/chocolatebunny/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.bonus_reagents = rt.alist(f, ["nutriment", 1, "vitamin", 1]);
	this.list_reagents = rt.alist(f, ["nutriment", 4, "sugar", 2, "cocoa", 2]);
	return f.dot;
});

rt.type(1800, "/datum/crafting_recipe/food/chocolatebunny", "/datum/crafting_recipe/food", {
	name: "Chocolate bunny",
	category: "Misc. Food",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/chocolatebunny"),
});

// easter.dm:230
rt.def("/datum/crafting_recipe/food/chocolatebunny/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/datum/reagent/consumable/sugar"), 2, T("/obj/item/weapon/reagent_containers/food/snacks/chocolatebar"), 1]);
	return f.dot;
});
