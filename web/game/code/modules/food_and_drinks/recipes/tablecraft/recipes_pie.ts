// Based on /tg/station's code/modules/food_and_drinks/recipes/tablecraft/recipes_pie.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1727, "/datum/crafting_recipe/food/bananacreampie", "/datum/crafting_recipe/food", {
	name: "Banana cream pie",
	subcategory: "Pies",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/pie/cream"),
});

// recipes_pie.dm:8
rt.def("/datum/crafting_recipe/food/bananacreampie/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/datum/reagent/consumable/milk"), 5, T("/obj/item/weapon/reagent_containers/food/snacks/pie/plain"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/banana"), 1]);
	return f.dot;
});

rt.type(1728, "/datum/crafting_recipe/food/meatpie", "/datum/crafting_recipe/food", {
	name: "Meat pie",
	subcategory: "Pies",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/pie/meatpie"),
});

// recipes_pie.dm:18
rt.def("/datum/crafting_recipe/food/meatpie/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/datum/reagent/consumable/blackpepper"), 1, T("/datum/reagent/consumable/sodiumchloride"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/pie/plain"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/meat/steak/plain"), 1]);
	return f.dot;
});

rt.type(1729, "/datum/crafting_recipe/food/tofupie", "/datum/crafting_recipe/food", {
	name: "Tofu pie",
	subcategory: "Pies",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/pie/tofupie"),
});

// recipes_pie.dm:29
rt.def("/datum/crafting_recipe/food/tofupie/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/pie/plain"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/tofu"), 1]);
	return f.dot;
});

rt.type(1730, "/datum/crafting_recipe/food/xenopie", "/datum/crafting_recipe/food", {
	name: "Xeno pie",
	subcategory: "Pies",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/pie/xemeatpie"),
});

// recipes_pie.dm:38
rt.def("/datum/crafting_recipe/food/xenopie/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/pie/plain"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet/xeno"), 1]);
	return f.dot;
});

rt.type(1731, "/datum/crafting_recipe/food/cherrypie", "/datum/crafting_recipe/food", {
	name: "Cherry pie",
	subcategory: "Pies",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/pie/cherrypie"),
});

// recipes_pie.dm:47
rt.def("/datum/crafting_recipe/food/cherrypie/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/pie/plain"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/cherries"), 1]);
	return f.dot;
});

rt.type(1732, "/datum/crafting_recipe/food/berryclafoutis", "/datum/crafting_recipe/food", {
	name: "Berry clafoutis",
	subcategory: "Pies",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/pie/berryclafoutis"),
});

// recipes_pie.dm:56
rt.def("/datum/crafting_recipe/food/berryclafoutis/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/pie/plain"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/berries"), 1]);
	return f.dot;
});

rt.type(1733, "/datum/crafting_recipe/food/bearypie", "/datum/crafting_recipe/food", {
	name: "Beary Pie",
	subcategory: "Pies",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/pie/bearypie"),
});

// recipes_pie.dm:65
rt.def("/datum/crafting_recipe/food/bearypie/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/pie/plain"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/berries"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/meat/steak/bear"), 1]);
	return f.dot;
});

rt.type(1734, "/datum/crafting_recipe/food/amanitapie", "/datum/crafting_recipe/food", {
	name: "Amanita pie",
	subcategory: "Pies",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/pie/amanita_pie"),
});

// recipes_pie.dm:75
rt.def("/datum/crafting_recipe/food/amanitapie/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/pie/plain"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/mushroom/amanita"), 1]);
	return f.dot;
});

rt.type(1735, "/datum/crafting_recipe/food/plumppie", "/datum/crafting_recipe/food", {
	name: "Plump pie",
	subcategory: "Pies",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/pie/plump_pie"),
});

// recipes_pie.dm:84
rt.def("/datum/crafting_recipe/food/plumppie/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/pie/plain"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/mushroom/plumphelmet"), 1]);
	return f.dot;
});

rt.type(1736, "/datum/crafting_recipe/food/applepie", "/datum/crafting_recipe/food", {
	name: "Apple pie",
	subcategory: "Pies",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/pie/applepie"),
});

// recipes_pie.dm:93
rt.def("/datum/crafting_recipe/food/applepie/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/pie/plain"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/apple"), 1]);
	return f.dot;
});

rt.type(1737, "/datum/crafting_recipe/food/pumpkinpie", "/datum/crafting_recipe/food", {
	name: "Pumpkin pie",
	subcategory: "Pies",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/pie/pumpkinpie"),
});

// recipes_pie.dm:102
rt.def("/datum/crafting_recipe/food/pumpkinpie/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/datum/reagent/consumable/milk"), 5, T("/datum/reagent/consumable/sugar"), 5, T("/obj/item/weapon/reagent_containers/food/snacks/pie/plain"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/pumpkin"), 1]);
	return f.dot;
});

rt.type(1738, "/datum/crafting_recipe/food/goldenappletart", "/datum/crafting_recipe/food", {
	name: "Golden apple tart",
	subcategory: "Pies",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/pie/appletart"),
});

// recipes_pie.dm:113
rt.def("/datum/crafting_recipe/food/goldenappletart/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/datum/reagent/consumable/milk"), 5, T("/datum/reagent/consumable/sugar"), 5, T("/obj/item/weapon/reagent_containers/food/snacks/pie/plain"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/apple/gold"), 1]);
	return f.dot;
});

rt.type(1739, "/datum/crafting_recipe/food/grapetart", "/datum/crafting_recipe/food", {
	name: "Grape tart",
	subcategory: "Pies",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/pie/grapetart"),
});

// recipes_pie.dm:124
rt.def("/datum/crafting_recipe/food/grapetart/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/datum/reagent/consumable/milk"), 5, T("/datum/reagent/consumable/sugar"), 5, T("/obj/item/weapon/reagent_containers/food/snacks/pie/plain"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/grapes"), 3]);
	return f.dot;
});

rt.type(1740, "/datum/crafting_recipe/food/blumpkinpie", "/datum/crafting_recipe/food", {
	name: "Blumpkin pie",
	subcategory: "Pies",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/pie/blumpkinpie"),
});

// recipes_pie.dm:135
rt.def("/datum/crafting_recipe/food/blumpkinpie/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/datum/reagent/consumable/milk"), 5, T("/datum/reagent/consumable/sugar"), 5, T("/obj/item/weapon/reagent_containers/food/snacks/pie/plain"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/blumpkin"), 1]);
	return f.dot;
});

rt.type(1741, "/datum/crafting_recipe/food/dulcedebatata", "/datum/crafting_recipe/food", {
	name: "Dulce de batata",
	subcategory: "Pies",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/pie/dulcedebatata"),
});

// recipes_pie.dm:146
rt.def("/datum/crafting_recipe/food/dulcedebatata/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/datum/reagent/consumable/vanilla"), 5, T("/datum/reagent/water"), 5, T("/obj/item/weapon/reagent_containers/food/snacks/grown/potato/sweet"), 2]);
	return f.dot;
});

rt.type(1742, "/datum/crafting_recipe/food/frostypie", "/datum/crafting_recipe/food", {
	name: "Frosty pie",
	subcategory: "Pies",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/pie/frostypie"),
});

// recipes_pie.dm:156
rt.def("/datum/crafting_recipe/food/frostypie/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/pie/plain"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/bluecherries"), 1]);
	return f.dot;
});
