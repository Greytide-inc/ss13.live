// From code/modules/food_and_drinks/recipes/tablecraft/recipes_pie.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1727, "/datum/crafting_recipe/food/bananacreampie", "/datum/crafting_recipe/food", {
	name: "Banana cream pie",
	subcategory: "Pies",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/pie/cream"),
});

// /datum/crafting_recipe/food/bananacreampie/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_pie.dm:8)
rt.def("/datum/crafting_recipe/food/bananacreampie/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/consumable/milk"), 5, T("/obj/item/weapon/reagent_containers/food/snacks/pie/plain"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/banana"), 1]));
	return f.dot;
});

rt.type(1728, "/datum/crafting_recipe/food/meatpie", "/datum/crafting_recipe/food", {
	name: "Meat pie",
	subcategory: "Pies",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/pie/meatpie"),
});

// /datum/crafting_recipe/food/meatpie/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_pie.dm:18)
rt.def("/datum/crafting_recipe/food/meatpie/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/consumable/blackpepper"), 1, T("/datum/reagent/consumable/sodiumchloride"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/pie/plain"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/meat/steak/plain"), 1]));
	return f.dot;
});

rt.type(1729, "/datum/crafting_recipe/food/tofupie", "/datum/crafting_recipe/food", {
	name: "Tofu pie",
	subcategory: "Pies",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/pie/tofupie"),
});

// /datum/crafting_recipe/food/tofupie/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_pie.dm:29)
rt.def("/datum/crafting_recipe/food/tofupie/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/pie/plain"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/tofu"), 1]));
	return f.dot;
});

rt.type(1730, "/datum/crafting_recipe/food/xenopie", "/datum/crafting_recipe/food", {
	name: "Xeno pie",
	subcategory: "Pies",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/pie/xemeatpie"),
});

// /datum/crafting_recipe/food/xenopie/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_pie.dm:38)
rt.def("/datum/crafting_recipe/food/xenopie/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/pie/plain"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet/xeno"), 1]));
	return f.dot;
});

rt.type(1731, "/datum/crafting_recipe/food/cherrypie", "/datum/crafting_recipe/food", {
	name: "Cherry pie",
	subcategory: "Pies",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/pie/cherrypie"),
});

// /datum/crafting_recipe/food/cherrypie/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_pie.dm:47)
rt.def("/datum/crafting_recipe/food/cherrypie/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/pie/plain"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/cherries"), 1]));
	return f.dot;
});

rt.type(1732, "/datum/crafting_recipe/food/berryclafoutis", "/datum/crafting_recipe/food", {
	name: "Berry clafoutis",
	subcategory: "Pies",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/pie/berryclafoutis"),
});

// /datum/crafting_recipe/food/berryclafoutis/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_pie.dm:56)
rt.def("/datum/crafting_recipe/food/berryclafoutis/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/pie/plain"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/berries"), 1]));
	return f.dot;
});

rt.type(1733, "/datum/crafting_recipe/food/bearypie", "/datum/crafting_recipe/food", {
	name: "Beary Pie",
	subcategory: "Pies",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/pie/bearypie"),
});

// /datum/crafting_recipe/food/bearypie/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_pie.dm:65)
rt.def("/datum/crafting_recipe/food/bearypie/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/pie/plain"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/berries"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/meat/steak/bear"), 1]));
	return f.dot;
});

rt.type(1734, "/datum/crafting_recipe/food/amanitapie", "/datum/crafting_recipe/food", {
	name: "Amanita pie",
	subcategory: "Pies",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/pie/amanita_pie"),
});

// /datum/crafting_recipe/food/amanitapie/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_pie.dm:75)
rt.def("/datum/crafting_recipe/food/amanitapie/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/pie/plain"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/mushroom/amanita"), 1]));
	return f.dot;
});

rt.type(1735, "/datum/crafting_recipe/food/plumppie", "/datum/crafting_recipe/food", {
	name: "Plump pie",
	subcategory: "Pies",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/pie/plump_pie"),
});

// /datum/crafting_recipe/food/plumppie/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_pie.dm:84)
rt.def("/datum/crafting_recipe/food/plumppie/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/pie/plain"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/mushroom/plumphelmet"), 1]));
	return f.dot;
});

rt.type(1736, "/datum/crafting_recipe/food/applepie", "/datum/crafting_recipe/food", {
	name: "Apple pie",
	subcategory: "Pies",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/pie/applepie"),
});

// /datum/crafting_recipe/food/applepie/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_pie.dm:93)
rt.def("/datum/crafting_recipe/food/applepie/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/pie/plain"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/apple"), 1]));
	return f.dot;
});

rt.type(1737, "/datum/crafting_recipe/food/pumpkinpie", "/datum/crafting_recipe/food", {
	name: "Pumpkin pie",
	subcategory: "Pies",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/pie/pumpkinpie"),
});

// /datum/crafting_recipe/food/pumpkinpie/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_pie.dm:102)
rt.def("/datum/crafting_recipe/food/pumpkinpie/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/consumable/milk"), 5, T("/datum/reagent/consumable/sugar"), 5, T("/obj/item/weapon/reagent_containers/food/snacks/pie/plain"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/pumpkin"), 1]));
	return f.dot;
});

rt.type(1738, "/datum/crafting_recipe/food/goldenappletart", "/datum/crafting_recipe/food", {
	name: "Golden apple tart",
	subcategory: "Pies",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/pie/appletart"),
});

// /datum/crafting_recipe/food/goldenappletart/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_pie.dm:113)
rt.def("/datum/crafting_recipe/food/goldenappletart/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/consumable/milk"), 5, T("/datum/reagent/consumable/sugar"), 5, T("/obj/item/weapon/reagent_containers/food/snacks/pie/plain"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/apple/gold"), 1]));
	return f.dot;
});

rt.type(1739, "/datum/crafting_recipe/food/grapetart", "/datum/crafting_recipe/food", {
	name: "Grape tart",
	subcategory: "Pies",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/pie/grapetart"),
});

// /datum/crafting_recipe/food/grapetart/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_pie.dm:124)
rt.def("/datum/crafting_recipe/food/grapetart/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/consumable/milk"), 5, T("/datum/reagent/consumable/sugar"), 5, T("/obj/item/weapon/reagent_containers/food/snacks/pie/plain"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/grapes"), 3]));
	return f.dot;
});

rt.type(1740, "/datum/crafting_recipe/food/blumpkinpie", "/datum/crafting_recipe/food", {
	name: "Blumpkin pie",
	subcategory: "Pies",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/pie/blumpkinpie"),
});

// /datum/crafting_recipe/food/blumpkinpie/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_pie.dm:135)
rt.def("/datum/crafting_recipe/food/blumpkinpie/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/consumable/milk"), 5, T("/datum/reagent/consumable/sugar"), 5, T("/obj/item/weapon/reagent_containers/food/snacks/pie/plain"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/blumpkin"), 1]));
	return f.dot;
});

rt.type(1741, "/datum/crafting_recipe/food/dulcedebatata", "/datum/crafting_recipe/food", {
	name: "Dulce de batata",
	subcategory: "Pies",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/pie/dulcedebatata"),
});

// /datum/crafting_recipe/food/dulcedebatata/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_pie.dm:146)
rt.def("/datum/crafting_recipe/food/dulcedebatata/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/consumable/vanilla"), 5, T("/datum/reagent/water"), 5, T("/obj/item/weapon/reagent_containers/food/snacks/grown/potato/sweet"), 2]));
	return f.dot;
});

rt.type(1742, "/datum/crafting_recipe/food/frostypie", "/datum/crafting_recipe/food", {
	name: "Frosty pie",
	subcategory: "Pies",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/pie/frostypie"),
});

// /datum/crafting_recipe/food/frostypie/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_pie.dm:156)
rt.def("/datum/crafting_recipe/food/frostypie/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/pie/plain"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/bluecherries"), 1]));
	return f.dot;
});
