// Based on /tg/station's code/modules/food_and_drinks/recipes/tablecraft/recipes_egg.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1645, "/datum/crafting_recipe/food/friedegg", "/datum/crafting_recipe/food", {
	name: "Fried egg",
	subcategory: "Egg-Based Food",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/friedegg"),
});

// recipes_egg.dm:8
rt.def("/datum/crafting_recipe/food/friedegg/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/datum/reagent/consumable/sodiumchloride"), 1, T("/datum/reagent/consumable/blackpepper"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/boiledegg"), 1]);
	return f.dot;
});

rt.type(1646, "/datum/crafting_recipe/food/omelette", "/datum/crafting_recipe/food", {
	name: "omelette",
	subcategory: "Egg-Based Food",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/omelette"),
});

// recipes_egg.dm:18
rt.def("/datum/crafting_recipe/food/omelette/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/boiledegg"), 2, T("/obj/item/weapon/reagent_containers/food/snacks/cheesewedge"), 2]);
	return f.dot;
});

rt.type(1647, "/datum/crafting_recipe/food/chocolateegg", "/datum/crafting_recipe/food", {
	name: "Chocolate egg",
	subcategory: "Egg-Based Food",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/chocolateegg"),
});

// recipes_egg.dm:27
rt.def("/datum/crafting_recipe/food/chocolateegg/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/boiledegg"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/chocolatebar"), 1]);
	return f.dot;
});

rt.type(1648, "/datum/crafting_recipe/food/eggsbenedict", "/datum/crafting_recipe/food", {
	name: "Eggs benedict",
	subcategory: "Egg-Based Food",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/benedict"),
});

// recipes_egg.dm:36
rt.def("/datum/crafting_recipe/food/eggsbenedict/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/friedegg"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/meat/steak"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/breadslice/plain"), 1]);
	return f.dot;
});
