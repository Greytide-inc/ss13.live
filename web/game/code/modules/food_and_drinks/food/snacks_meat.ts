// From code/modules/food_and_drinks/food/snacks_meat.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5986, "/obj/item/weapon/reagent_containers/food/snacks/cubancarp", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	bitesize: 3,
	filling_color: "#CD853F",
	tastes: null,
	name: "１Cuban carp",
	desc: "A grifftastic sandwich that burns your tongue and then leaves it numb!",
	icon_state: "cubancarp",
	trash: rt.typePath("/obj/item/trash/plate"),
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/cubancarp/proc/<init>  (code/modules/food_and_drinks/food/snacks_meat.dm:11)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/cubancarp/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "vitamin", 4]));
	rt.setSv(f, "tastes", rt.alist(f, ["fish", 4, "batter", 1, "hot peppers", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 6, "capsaicin", 1]));
	return f.dot;
});

rt.type(5987, "/obj/item/weapon/reagent_containers/food/snacks/carpmeat", "/obj/item/weapon/reagent_containers/food/snacks", {
	bitesize: 6,
	filling_color: "#FA8072",
	tastes: null,
	name: "carp fillet",
	desc: "A fillet of spess carp meat.",
	icon_state: "fishfillet",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/carpmeat/proc/<init>  (code/modules/food_and_drinks/food/snacks_meat.dm:24)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/carpmeat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["fish", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 3, "carpotoxin", 2, "vitamin", 2]));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/food/snacks/carpmeat/proc/New  (code/modules/food_and_drinks/food/snacks_meat.dm:27)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/carpmeat/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "eatverb", rt.op(f, "PickUnweighted", [6], ["bite", "chew", "choke down", "gnaw", "swallow", "chomp"]));
	return f.dot;
}, true);

rt.type(5989, "/obj/item/weapon/reagent_containers/food/snacks/fishfingers", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	bitesize: 1,
	filling_color: "#CD853F",
	tastes: null,
	name: "fish fingers",
	desc: "A finger of fish.",
	icon_state: "fishfingers",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/fishfingers/proc/<init>  (code/modules/food_and_drinks/food/snacks_meat.dm:38)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/fishfingers/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "vitamin", 2]));
	rt.setSv(f, "tastes", rt.alist(f, ["fish", 1, "breadcrumbs", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 4]));
	return f.dot;
});

rt.type(5990, "/obj/item/weapon/reagent_containers/food/snacks/fishandchips", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	filling_color: "#FA8072",
	tastes: null,
	name: "fish and chips",
	desc: "I do say so myself chap.",
	icon_state: "fishandchips",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/fishandchips/proc/<init>  (code/modules/food_and_drinks/food/snacks_meat.dm:48)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/fishandchips/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "vitamin", 2]));
	rt.setSv(f, "tastes", rt.alist(f, ["fish", 1, "chips", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 6]));
	return f.dot;
});

rt.type(5991, "/obj/item/weapon/reagent_containers/food/snacks/tofu", "/obj/item/weapon/reagent_containers/food/snacks", {
	filling_color: "#F0E68C",
	tastes: null,
	name: "tofu",
	desc: "We all love tofu.",
	icon_state: "tofu",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/tofu/proc/<init>  (code/modules/food_and_drinks/food/snacks_meat.dm:61)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/tofu/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["tofu", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 2]));
	return f.dot;
});

rt.type(5992, "/obj/item/weapon/reagent_containers/food/snacks/spiderleg", "/obj/item/weapon/reagent_containers/food/snacks", {
	filling_color: "#000000",
	tastes: null,
	name: "spider leg",
	desc: "A still twitching leg of a giant spider... you don't really want to eat this, do you?",
	icon_state: "spiderleg",
	list_reagents: null,
	cooked_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/boiledspiderleg"),
});

// /obj/item/weapon/reagent_containers/food/snacks/spiderleg/proc/<init>  (code/modules/food_and_drinks/food/snacks_meat.dm:70)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/spiderleg/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["cobwebs", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 2, "toxin", 2]));
	return f.dot;
});

rt.type(5993, "/obj/item/weapon/reagent_containers/food/snacks/cornedbeef", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	tastes: null,
	name: "corned beef and cabbage",
	desc: "Now you can feel like a real tourist vacationing in Ireland.",
	icon_state: "cornedbeef",
	trash: rt.typePath("/obj/item/trash/plate"),
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/cornedbeef/proc/<init>  (code/modules/food_and_drinks/food/snacks_meat.dm:77)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/cornedbeef/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "vitamin", 4]));
	rt.setSv(f, "tastes", rt.alist(f, ["meat", 1, "cabbage", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 5]));
	return f.dot;
});

rt.type(5994, "/obj/item/weapon/reagent_containers/food/snacks/bearsteak", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	tastes: null,
	name: "Filet migrawr",
	desc: "Because eating bear wasn't manly enough.",
	icon_state: "bearsteak",
	trash: rt.typePath("/obj/item/trash/plate"),
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/bearsteak/proc/<init>  (code/modules/food_and_drinks/food/snacks_meat.dm:86)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/bearsteak/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 2, "vitamin", 6]));
	rt.setSv(f, "tastes", rt.alist(f, ["meat", 1, "salmon", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 2, "vitamin", 5, "manlydorf", 5]));
	return f.dot;
});

rt.type(5995, "/obj/item/weapon/reagent_containers/food/snacks/faggot", "/obj/item/weapon/reagent_containers/food/snacks", {
	filling_color: "#800000",
	tastes: null,
	name: "faggot",
	desc: "A great meal all round. Not a cord of wood.",
	icon_state: "faggot",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/faggot/proc/<init>  (code/modules/food_and_drinks/food/snacks_meat.dm:96)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/faggot/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["meat", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 4, "vitamin", 1]));
	return f.dot;
});

rt.type(5996, "/obj/item/weapon/reagent_containers/food/snacks/sausage", "/obj/item/weapon/reagent_containers/food/snacks", {
	filling_color: "#CD5C5C",
	bonus_reagents: null,
	tastes: null,
	name: "sausage",
	desc: "A piece of mixed, long meat.",
	icon_state: "sausage",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/sausage/proc/<init>  (code/modules/food_and_drinks/food/snacks_meat.dm:103)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/sausage/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "vitamin", 1]));
	rt.setSv(f, "tastes", rt.alist(f, ["meat", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 6, "vitamin", 1]));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/food/snacks/sausage/proc/New  (code/modules/food_and_drinks/food/snacks_meat.dm:108)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/sausage/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "eatverb", rt.op(f, "PickUnweighted", [6], ["bite", "chew", "nibble", "deep throat", "gobble", "chomp"]));
	return f.dot;
}, true);

rt.type(5997, "/obj/item/weapon/reagent_containers/food/snacks/kebab", "/obj/item/weapon/reagent_containers/food/snacks", {
	tastes: null,
	trash: rt.typePath("/obj/item/stack/rods"),
	icon_state: "kebab",
	w_class: 3,
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/kebab/proc/<init>  (code/modules/food_and_drinks/food/snacks_meat.dm:116)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/kebab/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["meat", 3, "metal", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 8]));
	return f.dot;
});

rt.type(5998, "/obj/item/weapon/reagent_containers/food/snacks/kebab/human", "/obj/item/weapon/reagent_containers/food/snacks/kebab", {
	bonus_reagents: null,
	tastes: null,
	name: "human-kebab",
	desc: "A human meat, on a stick.",
});

// /obj/item/weapon/reagent_containers/food/snacks/kebab/human/proc/<init>  (code/modules/food_and_drinks/food/snacks_meat.dm:121)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/kebab/human/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "vitamin", 6]));
	rt.setSv(f, "tastes", rt.alist(f, ["tender meat", 3, "metal", 1]));
	return f.dot;
});

rt.type(5999, "/obj/item/weapon/reagent_containers/food/snacks/kebab/monkey", "/obj/item/weapon/reagent_containers/food/snacks/kebab", {
	bonus_reagents: null,
	tastes: null,
	name: "meat-kebab",
	desc: "Delicious meat, on a stick.",
});

// /obj/item/weapon/reagent_containers/food/snacks/kebab/monkey/proc/<init>  (code/modules/food_and_drinks/food/snacks_meat.dm:127)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/kebab/monkey/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "vitamin", 2]));
	rt.setSv(f, "tastes", rt.alist(f, ["meat", 3, "metal", 1]));
	return f.dot;
});

rt.type(6000, "/obj/item/weapon/reagent_containers/food/snacks/kebab/tofu", "/obj/item/weapon/reagent_containers/food/snacks/kebab", {
	bonus_reagents: null,
	tastes: null,
	name: "tofu-kebab",
	desc: "Vegan meat, on a stick.",
});

// /obj/item/weapon/reagent_containers/food/snacks/kebab/tofu/proc/<init>  (code/modules/food_and_drinks/food/snacks_meat.dm:133)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/kebab/tofu/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1]));
	rt.setSv(f, "tastes", rt.alist(f, ["tofu", 3, "metal", 1]));
	return f.dot;
});

rt.type(6001, "/obj/item/weapon/reagent_containers/food/snacks/kebab/tail", "/obj/item/weapon/reagent_containers/food/snacks/kebab", {
	bonus_reagents: null,
	tastes: null,
	name: "lizard-tail kebab",
	desc: "Severed lizard tail on a stick.",
});

// /obj/item/weapon/reagent_containers/food/snacks/kebab/tail/proc/<init>  (code/modules/food_and_drinks/food/snacks_meat.dm:139)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/kebab/tail/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "vitamin", 4]));
	rt.setSv(f, "tastes", rt.alist(f, ["meat", 8, "metal", 4, "scales", 1]));
	return f.dot;
});

rt.type(6002, "/obj/item/weapon/reagent_containers/food/snacks/rawkhinkali", "/obj/item/weapon/reagent_containers/food/snacks", {
	tastes: null,
	name: "raw khinkali",
	desc: "One hundred khinkalis? Do I look like a pig?",
	icon_state: "khinkali",
	list_reagents: null,
	cooked_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/khinkali"),
});

// /obj/item/weapon/reagent_containers/food/snacks/rawkhinkali/proc/<init>  (code/modules/food_and_drinks/food/snacks_meat.dm:148)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/rawkhinkali/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["meat", 1, "onions", 1, "garlic", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 1, "vitamin", 1]));
	return f.dot;
});

rt.type(6003, "/obj/item/weapon/reagent_containers/food/snacks/khinkali", "/obj/item/weapon/reagent_containers/food/snacks", {
	bitesize: 3,
	filling_color: "#F0F0F0",
	tastes: null,
	name: "khinkali",
	desc: "One hundred khinkalis? Do I look like a pig?",
	icon_state: "khinkali",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/khinkali/proc/<init>  (code/modules/food_and_drinks/food/snacks_meat.dm:157)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/khinkali/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["meat", 1, "onions", 1, "garlic", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 4, "vitamin", 2]));
	return f.dot;
});

rt.type(6004, "/obj/item/weapon/reagent_containers/food/snacks/monkeycube", "/obj/item/weapon/reagent_containers/food/snacks", {
	bitesize: 12,
	filling_color: "#CD853F",
	tastes: null,
	name: "monkey cube",
	desc: "Just add water!",
	icon_state: "monkeycube",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/monkeycube/proc/<init>  (code/modules/food_and_drinks/food/snacks_meat.dm:166)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/monkeycube/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["the jungle", 1, "bananas", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 2]));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/food/snacks/monkeycube/proc/Expand  (code/modules/food_and_drinks/food/snacks_meat.dm:169)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/monkeycube/proc/Expand", function* Expand(f: Frame) {
	yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>＀ expands!</span>", [live(f.src)]));
	yield* g.new_(f, T("/mob/living/carbon/monkey"), [rt.getStep(f, live(f.src), 0)]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(6005, "/obj/item/weapon/reagent_containers/food/snacks/enchiladas", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	bitesize: 4,
	filling_color: "#FFA07A",
	tastes: null,
	name: "enchiladas",
	desc: "Viva La Mexico!",
	icon_state: "enchiladas",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/enchiladas/proc/<init>  (code/modules/food_and_drinks/food/snacks_meat.dm:177)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/enchiladas/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "vitamin", 2]));
	rt.setSv(f, "tastes", rt.alist(f, ["hot peppers", 1, "meat", 3, "cheese", 1, "sour cream", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 8, "capsaicin", 6]));
	return f.dot;
});

rt.type(6006, "/obj/item/weapon/reagent_containers/food/snacks/stewedsoymeat", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	filling_color: "#D2691E",
	tastes: null,
	name: "stewed soy meat",
	desc: "Even non-vegetarians will LOVE this!",
	icon_state: "stewedsoymeat",
	trash: rt.typePath("/obj/item/trash/plate"),
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/stewedsoymeat/proc/<init>  (code/modules/food_and_drinks/food/snacks_meat.dm:188)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/stewedsoymeat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1]));
	rt.setSv(f, "tastes", rt.alist(f, ["soy", 1, "vegetables", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 8]));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/food/snacks/stewedsoymeat/proc/New  (code/modules/food_and_drinks/food/snacks_meat.dm:194)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/stewedsoymeat/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "eatverb", rt.op(f, "PickUnweighted", [5], ["slurp", "sip", "suck", "inhale", "drink"]));
	return f.dot;
}, true);

rt.type(6007, "/obj/item/weapon/reagent_containers/food/snacks/boiledspiderleg", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	filling_color: "#000000",
	tastes: null,
	name: "boiled spider leg",
	desc: "A giant spider's leg that's still twitching after being cooked. Gross!",
	icon_state: "spiderlegcooked",
	trash: rt.typePath("/obj/item/trash/plate"),
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/boiledspiderleg/proc/<init>  (code/modules/food_and_drinks/food/snacks_meat.dm:202)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/boiledspiderleg/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "capsaicin", 2, "vitamin", 2]));
	rt.setSv(f, "tastes", rt.alist(f, ["hot peppers", 1, "cobwebs", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 3, "capsaicin", 2]));
	return f.dot;
});

rt.type(6008, "/obj/item/weapon/reagent_containers/food/snacks/spidereggsham", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	bitesize: 4,
	filling_color: "#7FFF00",
	tastes: null,
	name: "green eggs and ham",
	desc: "Would you eat them on a train? Would you eat them on a plane? Would you eat them on a state of the art corporate deathtrap floating through space?",
	icon_state: "spidereggsham",
	trash: rt.typePath("/obj/item/trash/plate"),
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/spidereggsham/proc/<init>  (code/modules/food_and_drinks/food/snacks_meat.dm:212)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/spidereggsham/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "vitamin", 3]));
	rt.setSv(f, "tastes", rt.alist(f, ["meat", 1, "the colour green", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 6]));
	return f.dot;
});

rt.type(6009, "/obj/item/weapon/reagent_containers/food/snacks/sashimi", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	filling_color: "#FA8072",
	tastes: null,
	name: "carp sashimi",
	desc: "Celebrate surviving attack from hostile alien lifeforms by hospitalising yourself.",
	icon_state: "sashimi",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/sashimi/proc/<init>  (code/modules/food_and_drinks/food/snacks_meat.dm:222)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/sashimi/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "capsaicin", 4, "vitamin", 4]));
	rt.setSv(f, "tastes", rt.alist(f, ["fish", 1, "hot peppers", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 6, "capsaicin", 5]));
	return f.dot;
});

rt.type(6010, "/obj/item/weapon/reagent_containers/food/snacks/nugget", "/obj/item/weapon/reagent_containers/food/snacks", {
	filling_color: "#B22222",
	bonus_reagents: null,
	tastes: null,
	name: "chicken nugget",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/nugget/proc/<init>  (code/modules/food_and_drinks/food/snacks_meat.dm:230)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/nugget/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "vitamin", 1]));
	rt.setSv(f, "tastes", rt.alist(f, ["\"chicken\"", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 2]));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/food/snacks/nugget/proc/New  (code/modules/food_and_drinks/food/snacks_meat.dm:235)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/nugget/proc/New", function* New(f: Frame) {
	let shape: Value = null;
	f.vars = () => [shape];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "desc", fmt("A 'chicken' nugget vaguely shaped like a ＀.", [(shape = rt.op(f, "PickUnweighted", [4], ["lump", "star", "lizard", "corgi"]))]));
	rt.setSv(f, "icon_state", fmt("nugget_＀", [live(shape)]));
	return f.dot;
}, true);

rt.type(6011, "/obj/item/weapon/reagent_containers/food/snacks/pigblanket", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	filling_color: "#800000",
	tastes: null,
	name: "pig in a blanket",
	desc: "A tiny sausage wrapped in a flakey, buttery roll. Free this pig from its blanket prison by eating it.",
	icon_state: "pigblanket",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/pigblanket/proc/<init>  (code/modules/food_and_drinks/food/snacks_meat.dm:245)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/pigblanket/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "vitamin", 1]));
	rt.setSv(f, "tastes", rt.alist(f, ["meat", 1, "butter", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 6, "vitamin", 1]));
	return f.dot;
});
