// From code/modules/holiday/easter.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/holiday/easter/proc/greet  (code/modules/holiday/easter.dm:3)
rt.def("/datum/holiday/easter/proc/greet", function greet(f: Frame) {
	return "Greetings! Have a Happy Easter and keep an eye out for Easter Bunnies!";
});

rt.type(356, "/datum/round_event/easter", "/datum/round_event", {});

// /datum/round_event/easter/proc/announce  (code/modules/holiday/easter.dm:14)  may sleep
rt.def("/datum/round_event/easter/proc/announce", function* announce(f: Frame) {
	yield* g.call(f, P("/proc/priority_announce"), null, [rt.op(f, "PickUnweighted", [4], ["Hip-hop into Easter!", "Find some Bunny's stash!", "Today is National 'Hunt a Wabbit' Day.", "Be kind, give Chocolate Eggs!"])]);
	return f.dot;
}, true);

rt.type(357, "/datum/round_event/rabbitrelease", "/datum/round_event", {});

// /datum/round_event/rabbitrelease/proc/announce  (code/modules/holiday/easter.dm:25)  may sleep
rt.def("/datum/round_event/rabbitrelease/proc/announce", function* announce(f: Frame) {
	yield* g.call(f, P("/proc/priority_announce"), null, [fmt("Unidentified furry objects detected coming aboard ＀. Beware of Adorable-ness.", [(yield* g.call(f, P("/proc/station_name"), null, []))]), "Fluffy Alert", rt.rsc("sound/ai/aliens.ogg")]);
	return f.dot;
}, true);

// /datum/round_event/rabbitrelease/proc/start  (code/modules/holiday/easter.dm:29)  may sleep
rt.def("/datum/round_event/rabbitrelease/proc/start", function* start(f: Frame) {
	let R: Value = null;
	let $e: any;
	f.vars = () => [R, $e];
	R = null;
	rt.forList(f, 0, rt.gl("landmarks_list"), T("/obj/effect/landmark"));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		if (!isEqual(rt.fv(f, "name", live(R)), "blobspawn")) {
			if (truthy(rt.op(f, "Prob", [], [35]))) {
				if (truthy((rt.istype(rt.fv(f, "loc", live(R)), T("/turf/open/space")) ? 1 : 0))) {
					yield* g.new_(f, T("/mob/living/simple_animal/chicken/rabbit/space"), [rt.fv(f, "loc", live(R))]);
				} else {
					yield* g.new_(f, T("/mob/living/simple_animal/chicken/rabbit"), [rt.fv(f, "loc", live(R))]);
				}
			}
		}
	}
	rt.endFor(f, 0);
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

// /mob/living/simple_animal/chicken/rabbit/proc/<init>  (code/modules/holiday/easter.dm:46)
rt.def("/mob/living/simple_animal/chicken/rabbit/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "speak", rt.list("Hop into Easter!", "Come get your eggs!", "Prizes for everyone!"));
	rt.setSv(f, "speak_emote", rt.list("sniffles", "twitches"));
	$0 = $0;
	rt.setSv(f, "emote_hear", rt.list("hops."));
	rt.setSv(f, "emote_see", rt.list("hops around", "bounces up and down"));
	$0 = $0;
	rt.setSv(f, "butcher_results", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab"), 1]));
	rt.setSv(f, "feedMessages", rt.list("It nibbles happily.", "It noms happily."));
	rt.setSv(f, "layMessage", rt.list("hides an egg.", "scampers around suspiciously.", "begins making a huge racket.", "begins shuffling."));
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

// /mob/living/simple_animal/chicken/rabbit/space/proc/<init>  (code/modules/holiday/easter.dm:62)
rt.def("/mob/living/simple_animal/chicken/rabbit/space/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "atmos_requirements", rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]));
	return f.dot;
});

rt.type(5541, "/obj/item/weapon/storage/bag/easterbasket", "/obj/item/weapon/storage/bag", {
	name: "Easter Basket",
	icon: rt.rsc("icons/mob/easter.dmi"),
	icon_state: "basket",
	can_hold: null,
});

// /obj/item/weapon/storage/bag/easterbasket/proc/<init>  (code/modules/holiday/easter.dm:72)
rt.def("/obj/item/weapon/storage/bag/easterbasket/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "can_hold", rt.list(T("/obj/item/weapon/reagent_containers/food/snacks/egg"), T("/obj/item/weapon/reagent_containers/food/snacks/chocolateegg"), T("/obj/item/weapon/reagent_containers/food/snacks/boiledegg")));
	return f.dot;
});

// /obj/item/weapon/storage/bag/easterbasket/proc/countEggs  (code/modules/holiday/easter.dm:75)
rt.def("/obj/item/weapon/storage/bag/easterbasket/proc/countEggs", function countEggs(f: Frame) {
	rt.callSrc(f, "cut_overlays", []);
	rt.callSrc(f, "add_overlay", ["basket-grass"]);
	rt.callSrc(f, "add_overlay", [fmt("basket-egg＀", [rt.call(f, P("/proc/min"), null, [rt.len(f, rt.sv(f, "contents")), 5])])]);
	return f.dot;
});

// /obj/item/weapon/storage/bag/easterbasket/proc/remove_from_storage  (code/modules/holiday/easter.dm:80)  may sleep
rt.def("/obj/item/weapon/storage/bag/easterbasket/proc/remove_from_storage", function* remove_from_storage(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "countEggs");
	return f.dot;
}, true, { args: ["W", "new_location"] });

// /obj/item/weapon/storage/bag/easterbasket/proc/handle_item_insertion  (code/modules/holiday/easter.dm:84)  may sleep
rt.def("/obj/item/weapon/storage/bag/easterbasket/proc/handle_item_insertion", function* handle_item_insertion(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "countEggs");
	return f.dot;
}, true, { args: ["I", "prevent_warning"] });

rt.type(5981, "/obj/item/weapon/reagent_containers/food/snacks/egg/loaded", "/obj/item/weapon/reagent_containers/food/snacks/egg", {
	containsPrize: 1,
});

// /obj/item/weapon/reagent_containers/food/snacks/egg/loaded/proc/New  (code/modules/holiday/easter.dm:113)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/egg/loaded/proc/New", function* New(f: Frame) {
	let eggcolor: Value = null;
	f.vars = () => [eggcolor];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "icon_state", fmt("egg-＀", [(eggcolor = rt.op(f, "PickUnweighted", [8], ["blue", "green", "mime", "orange", "purple", "rainbow", "red", "yellow"]))]));
	rt.setSv(f, "item_color", fmt("＀", [live(eggcolor)]));
	return f.dot;
}, true);

// /obj/item/weapon/reagent_containers/food/snacks/egg/proc/dispensePrize  (code/modules/holiday/easter.dm:119)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/egg/proc/dispensePrize", function* dispensePrize(f: Frame, where: Value) {
	let won: Value = null;
	f.vars = () => [where, won];
	won = rt.op(f, "PickUnweighted", [13], [T("/obj/item/clothing/head/bunnyhead"), T("/obj/item/clothing/suit/bunnysuit"), T("/obj/item/weapon/reagent_containers/food/snacks/grown/carrot"), T("/obj/item/weapon/reagent_containers/food/snacks/chocolateegg"), T("/obj/item/toy/balloon"), T("/obj/item/toy/gun"), T("/obj/item/toy/sword"), T("/obj/item/toy/foamblade"), T("/obj/item/toy/prize/ripley"), T("/obj/item/toy/prize/honk"), T("/obj/item/toy/carpplushie"), T("/obj/item/toy/redbutton"), T("/obj/item/clothing/head/collectable/rabbitears")]);
	yield* g.new_(f, live(won), [live(where)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/chocolateegg"), [live(where)]);
	return f.dot;
}, true);

// /obj/item/weapon/reagent_containers/food/snacks/egg/proc/attack_self  (code/modules/holiday/easter.dm:136)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/egg/proc/attack_self", function* attack_self(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "containsPrize"))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>You unwrap the ＀ and find a prize inside!</span>", [live(f.src)])]);
	yield* g.srcCall(f, "dispensePrize", rt.getStep(f, live(f.args[0]), 0));
	rt.setSv(f, "containsPrize", 0);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["user"] });

rt.type(1796, "/datum/crafting_recipe/food/food/hotcrossbun", "/datum/crafting_recipe/food/food", {
	name: "Hot-Cross Bun",
	category: "Misc. Food",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/hotcrossbun"),
});

// /datum/crafting_recipe/food/food/hotcrossbun/proc/<init>  (code/modules/holiday/easter.dm:152)
rt.def("/datum/crafting_recipe/food/food/hotcrossbun/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/store/bread/plain"), 1, T("/datum/reagent/consumable/sugar"), 1]));
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

// /obj/item/weapon/reagent_containers/food/snacks/store/cake/brioche/proc/<init>  (code/modules/holiday/easter.dm:166)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/store/cake/brioche/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 10, "vitamin", 2]));
	return f.dot;
});

rt.type(1797, "/datum/crafting_recipe/food/food/briochecake", "/datum/crafting_recipe/food/food", {
	name: "Brioche cake",
	category: "Misc. Food",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/store/cake/brioche"),
});

// /datum/crafting_recipe/food/food/briochecake/proc/<init>  (code/modules/holiday/easter.dm:176)
rt.def("/datum/crafting_recipe/food/food/briochecake/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/store/cake/plain"), 1, T("/datum/reagent/consumable/sugar"), 2]));
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

// /obj/item/weapon/reagent_containers/food/snacks/scotchegg/proc/<init>  (code/modules/holiday/easter.dm:187)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/scotchegg/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 2, "vitamin", 2]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 6]));
	return f.dot;
});

rt.type(1798, "/datum/crafting_recipe/food/scotchegg", "/datum/crafting_recipe/food", {
	name: "Scotch egg",
	category: "Misc. Food",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/scotchegg"),
});

// /datum/crafting_recipe/food/scotchegg/proc/<init>  (code/modules/holiday/easter.dm:194)
rt.def("/datum/crafting_recipe/food/scotchegg/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/consumable/sodiumchloride"), 1, T("/datum/reagent/consumable/blackpepper"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/boiledegg"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/faggot"), 1]));
	return f.dot;
});

rt.type(6177, "/obj/item/weapon/reagent_containers/food/snacks/soup/mammi", "/obj/item/weapon/reagent_containers/food/snacks/soup", {
	bonus_reagents: null,
	name: "Mammi",
	desc: "A bowl of mushy bread and milk. It reminds you, not too fondly, of a bowel movement.",
	icon_state: "mammi",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/soup/mammi/proc/<init>  (code/modules/holiday/easter.dm:207)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/soup/mammi/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 3, "vitamin", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 8, "vitamin", 1]));
	return f.dot;
});

rt.type(1799, "/datum/crafting_recipe/food/mammi", "/datum/crafting_recipe/food", {
	name: "Mammi",
	category: "Misc. Food",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/soup/mammi"),
});

// /datum/crafting_recipe/food/mammi/proc/<init>  (code/modules/holiday/easter.dm:212)
rt.def("/datum/crafting_recipe/food/mammi/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/store/bread/plain"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/chocolatebar"), 1, T("/datum/reagent/consumable/milk"), 5]));
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

// /obj/item/weapon/reagent_containers/food/snacks/chocolatebunny/proc/<init>  (code/modules/holiday/easter.dm:224)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/chocolatebunny/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "vitamin", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 4, "sugar", 2, "cocoa", 2]));
	return f.dot;
});

rt.type(1800, "/datum/crafting_recipe/food/chocolatebunny", "/datum/crafting_recipe/food", {
	name: "Chocolate bunny",
	category: "Misc. Food",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/chocolatebunny"),
});

// /datum/crafting_recipe/food/chocolatebunny/proc/<init>  (code/modules/holiday/easter.dm:230)
rt.def("/datum/crafting_recipe/food/chocolatebunny/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/consumable/sugar"), 2, T("/obj/item/weapon/reagent_containers/food/snacks/chocolatebar"), 1]));
	return f.dot;
});
