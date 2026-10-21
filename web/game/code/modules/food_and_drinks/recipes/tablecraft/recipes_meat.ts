// From code/modules/food_and_drinks/recipes/tablecraft/recipes_meat.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1649, "/datum/crafting_recipe/food/humankebab", "/datum/crafting_recipe/food", {
	name: "Human kebab",
	subcategory: "Meats",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/kebab/human"),
});

// /datum/crafting_recipe/food/humankebab/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_meat.dm:7)
rt.def("/datum/crafting_recipe/food/humankebab/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/stack/rods"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/meat/steak/plain/human"), 2]));
	return f.dot;
});

rt.type(1650, "/datum/crafting_recipe/food/kebab", "/datum/crafting_recipe/food", {
	name: "Kebab",
	subcategory: "Meats",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/kebab/monkey"),
});

// /datum/crafting_recipe/food/kebab/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_meat.dm:16)
rt.def("/datum/crafting_recipe/food/kebab/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/stack/rods"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/meat/steak"), 2]));
	return f.dot;
});

rt.type(1651, "/datum/crafting_recipe/food/tofukebab", "/datum/crafting_recipe/food", {
	name: "Tofu kebab",
	subcategory: "Meats",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/kebab/tofu"),
});

// /datum/crafting_recipe/food/tofukebab/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_meat.dm:25)
rt.def("/datum/crafting_recipe/food/tofukebab/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/stack/rods"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/tofu"), 2]));
	return f.dot;
});

rt.type(1652, "/datum/crafting_recipe/food/tailkebab", "/datum/crafting_recipe/food", {
	name: "Lizard tail kebab",
	subcategory: "Meats",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/kebab/tail"),
});

// /datum/crafting_recipe/food/tailkebab/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_meat.dm:34)
rt.def("/datum/crafting_recipe/food/tailkebab/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/stack/rods"), 1, T("/obj/item/severedtail"), 1]));
	return f.dot;
});

rt.type(1653, "/datum/crafting_recipe/food/cubancarp", "/datum/crafting_recipe/food", {
	name: "Cuban carp",
	subcategory: "Meats",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/cubancarp"),
});

// /datum/crafting_recipe/food/cubancarp/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_meat.dm:47)
rt.def("/datum/crafting_recipe/food/cubancarp/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/consumable/flour"), 5, T("/obj/item/weapon/reagent_containers/food/snacks/grown/chili"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/carpmeat"), 1]));
	return f.dot;
});

rt.type(1654, "/datum/crafting_recipe/food/fishandchips", "/datum/crafting_recipe/food", {
	name: "Fish and chips",
	subcategory: "Meats",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/fishandchips"),
});

// /datum/crafting_recipe/food/fishandchips/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_meat.dm:57)
rt.def("/datum/crafting_recipe/food/fishandchips/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/fries"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/carpmeat"), 1]));
	return f.dot;
});

rt.type(1655, "/datum/crafting_recipe/food/fishfingers", "/datum/crafting_recipe/food", {
	name: "Fish fingers",
	subcategory: "Meats",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/fishfingers"),
});

// /datum/crafting_recipe/food/fishfingers/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_meat.dm:66)
rt.def("/datum/crafting_recipe/food/fishfingers/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/consumable/flour"), 5, T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/carpmeat"), 1]));
	return f.dot;
});

rt.type(1656, "/datum/crafting_recipe/food/sashimi", "/datum/crafting_recipe/food", {
	name: "Sashimi",
	subcategory: "Meats",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/sashimi"),
});

// /datum/crafting_recipe/food/sashimi/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_meat.dm:76)
rt.def("/datum/crafting_recipe/food/sashimi/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/consumable/soysauce"), 5, T("/obj/item/weapon/reagent_containers/food/snacks/spidereggs"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/carpmeat"), 1]));
	return f.dot;
});

rt.type(1657, "/datum/crafting_recipe/food/spidereggsham", "/datum/crafting_recipe/food", {
	name: "Spider eggs ham",
	subcategory: "Meats",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/spidereggsham"),
});

// /datum/crafting_recipe/food/spidereggsham/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_meat.dm:88)
rt.def("/datum/crafting_recipe/food/spidereggsham/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/consumable/sodiumchloride"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/spidereggs"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet/spider"), 2]));
	return f.dot;
});

rt.type(1658, "/datum/crafting_recipe/food/cornedbeef", "/datum/crafting_recipe/food", {
	name: "Corned beef",
	subcategory: "Meats",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/cornedbeef"),
});

// /datum/crafting_recipe/food/cornedbeef/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_meat.dm:100)
rt.def("/datum/crafting_recipe/food/cornedbeef/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/consumable/sodiumchloride"), 5, T("/obj/item/weapon/reagent_containers/food/snacks/meat/steak"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/cabbage"), 2]));
	return f.dot;
});

rt.type(1659, "/datum/crafting_recipe/food/bearsteak", "/datum/crafting_recipe/food", {
	name: "Filet migrawr",
	subcategory: "Meats",
	reqs: null,
	tools: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/bearsteak"),
});

// /datum/crafting_recipe/food/bearsteak/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_meat.dm:110)
rt.def("/datum/crafting_recipe/food/bearsteak/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/consumable/ethanol/manly_dorf"), 5, T("/obj/item/weapon/reagent_containers/food/snacks/meat/steak/bear"), 1]));
	$0 = $0;
	rt.setSv(f, "tools", rt.list(T("/obj/item/weapon/lighter")));
	return f.dot;
});

rt.type(1660, "/datum/crafting_recipe/food/enchiladas", "/datum/crafting_recipe/food", {
	name: "Enchiladas",
	subcategory: "Meats",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/enchiladas"),
});

// /datum/crafting_recipe/food/enchiladas/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_meat.dm:120)
rt.def("/datum/crafting_recipe/food/enchiladas/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet"), 2, T("/obj/item/weapon/reagent_containers/food/snacks/grown/chili"), 2, T("/obj/item/weapon/reagent_containers/food/snacks/tortilla"), 2]));
	return f.dot;
});

rt.type(1661, "/datum/crafting_recipe/food/stewedsoymeat", "/datum/crafting_recipe/food", {
	name: "Stewed soymeat",
	subcategory: "Meats",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/stewedsoymeat"),
});

// /datum/crafting_recipe/food/stewedsoymeat/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_meat.dm:130)
rt.def("/datum/crafting_recipe/food/stewedsoymeat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/soydope"), 2, T("/obj/item/weapon/reagent_containers/food/snacks/grown/carrot"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/tomato"), 1]));
	return f.dot;
});

rt.type(1662, "/datum/crafting_recipe/food/sausage", "/datum/crafting_recipe/food", {
	name: "Sausage",
	subcategory: "Meats",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/sausage"),
});

// /datum/crafting_recipe/food/sausage/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_meat.dm:140)
rt.def("/datum/crafting_recipe/food/sausage/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/faggot"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet"), 2]));
	return f.dot;
});

rt.type(1663, "/datum/crafting_recipe/food/nugget", "/datum/crafting_recipe/food", {
	name: "Chicken nugget",
	subcategory: "Meats",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/nugget"),
});

// /datum/crafting_recipe/food/nugget/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_meat.dm:149)
rt.def("/datum/crafting_recipe/food/nugget/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet"), 1]));
	return f.dot;
});

rt.type(1664, "/datum/crafting_recipe/food/rawkhinkali", "/datum/crafting_recipe/food", {
	name: "Raw Khinkali",
	subcategory: "Meats",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/rawkhinkali"),
});

// /datum/crafting_recipe/food/rawkhinkali/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_meat.dm:157)
rt.def("/datum/crafting_recipe/food/rawkhinkali/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/doughslice"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/faggot"), 1]));
	return f.dot;
});

rt.type(1665, "/datum/crafting_recipe/food/pigblanket", "/datum/crafting_recipe/food", {
	name: "Pig in a Blanket",
	subcategory: "Meats",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/pigblanket"),
});

// /datum/crafting_recipe/food/pigblanket/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_meat.dm:166)
rt.def("/datum/crafting_recipe/food/pigblanket/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/butter"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet"), 1]));
	return f.dot;
});
