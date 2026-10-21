// From code/modules/food_and_drinks/food/snacks_salad.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(6129, "/obj/item/weapon/reagent_containers/food/snacks/salad", "/obj/item/weapon/reagent_containers/food/snacks", {
	bitesize: 3,
	tastes: null,
	icon: rt.rsc("icons/obj/food/soupsalad.dmi"),
	trash: rt.typePath("/obj/item/weapon/reagent_containers/glass/bowl"),
	w_class: 3,
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/salad/proc/<init>  (code/modules/food_and_drinks/food/snacks_salad.dm:9)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/salad/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["leaves", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 7, "vitamin", 2]));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/food/snacks/salad/proc/New  (code/modules/food_and_drinks/food/snacks_salad.dm:12)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/salad/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "eatverb", rt.op(f, "PickUnweighted", [6], ["crunch", "devour", "nibble", "gnaw", "gobble", "chomp"]));
	return f.dot;
}, true);

rt.type(6130, "/obj/item/weapon/reagent_containers/food/snacks/salad/aesirsalad", "/obj/item/weapon/reagent_containers/food/snacks/salad", {
	bonus_reagents: null,
	tastes: null,
	name: "１Aesir salad",
	desc: "Probably too incredible for mortal men to fully enjoy.",
	icon_state: "aesirsalad",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/salad/aesirsalad/proc/<init>  (code/modules/food_and_drinks/food/snacks_salad.dm:19)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/salad/aesirsalad/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["omnizine", 2, "vitamin", 6]));
	rt.setSv(f, "tastes", rt.alist(f, ["leaves", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 8, "omnizine", 8, "vitamin", 6]));
	return f.dot;
});

rt.type(6131, "/obj/item/weapon/reagent_containers/food/snacks/salad/herbsalad", "/obj/item/weapon/reagent_containers/food/snacks/salad", {
	bonus_reagents: null,
	tastes: null,
	name: "herb salad",
	desc: "A tasty salad with apples on top.",
	icon_state: "herbsalad",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/salad/herbsalad/proc/<init>  (code/modules/food_and_drinks/food/snacks_salad.dm:27)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/salad/herbsalad/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["vitamin", 4]));
	rt.setSv(f, "tastes", rt.alist(f, ["leaves", 1, "apple", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 8, "vitamin", 2]));
	return f.dot;
});

rt.type(6132, "/obj/item/weapon/reagent_containers/food/snacks/salad/validsalad", "/obj/item/weapon/reagent_containers/food/snacks/salad", {
	bonus_reagents: null,
	tastes: null,
	name: "valid salad",
	desc: "It's just an herb salad with meatballs and fried potato slices. Nothing suspicious about it.",
	icon_state: "validsalad",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/salad/validsalad/proc/<init>  (code/modules/food_and_drinks/food/snacks_salad.dm:35)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/salad/validsalad/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["doctorsdelight", 5, "vitamin", 4]));
	rt.setSv(f, "tastes", rt.alist(f, ["leaves", 1, "potato", 1, "meat", 1, "valids", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 8, "doctorsdelight", 5, "vitamin", 2]));
	return f.dot;
});

rt.type(6133, "/obj/item/weapon/reagent_containers/food/snacks/salad/oatmeal", "/obj/item/weapon/reagent_containers/food/snacks/salad", {
	bonus_reagents: null,
	tastes: null,
	name: "oatmeal",
	desc: "A nice bowl of oatmeal.",
	icon_state: "oatmeal",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/salad/oatmeal/proc/<init>  (code/modules/food_and_drinks/food/snacks_salad.dm:43)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/salad/oatmeal/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 4, "vitamin", 4]));
	rt.setSv(f, "tastes", rt.alist(f, ["oats", 1, "milk", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 7, "milk", 10, "vitamin", 2]));
	return f.dot;
});

rt.type(6134, "/obj/item/weapon/reagent_containers/food/snacks/salad/fruit", "/obj/item/weapon/reagent_containers/food/snacks/salad", {
	bonus_reagents: null,
	tastes: null,
	name: "fruit salad",
	desc: "Your standard fruit salad.",
	icon_state: "fruitsalad",
});

// /obj/item/weapon/reagent_containers/food/snacks/salad/fruit/proc/<init>  (code/modules/food_and_drinks/food/snacks_salad.dm:51)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/salad/fruit/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 2, "vitamin", 4]));
	rt.setSv(f, "tastes", rt.alist(f, ["fruit", 1]));
	return f.dot;
});

rt.type(6135, "/obj/item/weapon/reagent_containers/food/snacks/salad/jungle", "/obj/item/weapon/reagent_containers/food/snacks/salad", {
	bonus_reagents: null,
	tastes: null,
	name: "jungle salad",
	desc: "Exotic fruits in a bowl.",
	icon_state: "junglesalad",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/salad/jungle/proc/<init>  (code/modules/food_and_drinks/food/snacks_salad.dm:58)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/salad/jungle/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 4, "vitamin", 4]));
	rt.setSv(f, "tastes", rt.alist(f, ["fruit", 1, "the jungle", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 7, "banana", 5, "vitamin", 4]));
	return f.dot;
});

rt.type(6136, "/obj/item/weapon/reagent_containers/food/snacks/salad/citrusdelight", "/obj/item/weapon/reagent_containers/food/snacks/salad", {
	bonus_reagents: null,
	tastes: null,
	name: "citrus delight",
	desc: "Citrus overload!",
	icon_state: "citrusdelight",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/salad/citrusdelight/proc/<init>  (code/modules/food_and_drinks/food/snacks_salad.dm:66)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/salad/citrusdelight/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 4, "vitamin", 4]));
	rt.setSv(f, "tastes", rt.alist(f, ["sourness", 1, "leaves", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 7, "vitamin", 5]));
	return f.dot;
});

rt.type(6137, "/obj/item/weapon/reagent_containers/food/snacks/salad/ricebowl", "/obj/item/weapon/reagent_containers/food/snacks/salad", {
	tastes: null,
	name: "ricebowl",
	desc: "A bowl of raw rice.",
	icon_state: "ricebowl",
	cooked_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/salad/boiledrice"),
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/salad/ricebowl/proc/<init>  (code/modules/food_and_drinks/food/snacks_salad.dm:76)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/salad/ricebowl/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["rice", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 4]));
	return f.dot;
});

rt.type(6138, "/obj/item/weapon/reagent_containers/food/snacks/salad/boiledrice", "/obj/item/weapon/reagent_containers/food/snacks/salad", {
	bonus_reagents: null,
	tastes: null,
	name: "boiled rice",
	desc: "A warm bowl of rice.",
	icon_state: "boiledrice",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/salad/boiledrice/proc/<init>  (code/modules/food_and_drinks/food/snacks_salad.dm:82)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/salad/boiledrice/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "vitamin", 1]));
	rt.setSv(f, "tastes", rt.alist(f, ["rice", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 5, "vitamin", 1]));
	return f.dot;
});

rt.type(6139, "/obj/item/weapon/reagent_containers/food/snacks/salad/ricepudding", "/obj/item/weapon/reagent_containers/food/snacks/salad", {
	bonus_reagents: null,
	tastes: null,
	name: "rice pudding",
	desc: "Everybody loves rice pudding!",
	icon_state: "ricepudding",
});

// /obj/item/weapon/reagent_containers/food/snacks/salad/ricepudding/proc/<init>  (code/modules/food_and_drinks/food/snacks_salad.dm:90)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/salad/ricepudding/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 4, "vitamin", 2]));
	rt.setSv(f, "tastes", rt.alist(f, ["rice", 1, "sweetness", 1]));
	return f.dot;
});

rt.type(6140, "/obj/item/weapon/reagent_containers/food/snacks/salad/ricepork", "/obj/item/weapon/reagent_containers/food/snacks/salad", {
	bonus_reagents: null,
	tastes: null,
	name: "rice and pork",
	desc: "Well, it looks like pork...",
	icon_state: "riceporkbowl",
});

// /obj/item/weapon/reagent_containers/food/snacks/salad/ricepork/proc/<init>  (code/modules/food_and_drinks/food/snacks_salad.dm:97)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/salad/ricepork/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 4, "vitamin", 4]));
	rt.setSv(f, "tastes", rt.alist(f, ["rice", 1, "meat", 1]));
	return f.dot;
});

rt.type(6141, "/obj/item/weapon/reagent_containers/food/snacks/salad/eggbowl", "/obj/item/weapon/reagent_containers/food/snacks/salad", {
	bonus_reagents: null,
	tastes: null,
	name: "egg bowl",
	desc: "A bowl of rice with a fried egg.",
	icon_state: "eggbowl",
});

// /obj/item/weapon/reagent_containers/food/snacks/salad/eggbowl/proc/<init>  (code/modules/food_and_drinks/food/snacks_salad.dm:104)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/salad/eggbowl/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 4, "vitamin", 4]));
	rt.setSv(f, "tastes", rt.alist(f, ["rice", 1, "egg", 1]));
	return f.dot;
});
