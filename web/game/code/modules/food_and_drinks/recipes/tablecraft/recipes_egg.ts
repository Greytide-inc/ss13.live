// From code/modules/food_and_drinks/recipes/tablecraft/recipes_egg.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1645, "/datum/crafting_recipe/food/friedegg", "/datum/crafting_recipe/food", {
	name: "Fried egg",
	subcategory: "Egg-Based Food",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/friedegg"),
});

// /datum/crafting_recipe/food/friedegg/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_egg.dm:8)
rt.def("/datum/crafting_recipe/food/friedegg/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/consumable/sodiumchloride"), 1, T("/datum/reagent/consumable/blackpepper"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/boiledegg"), 1]));
	return f.dot;
});

rt.type(1646, "/datum/crafting_recipe/food/omelette", "/datum/crafting_recipe/food", {
	name: "omelette",
	subcategory: "Egg-Based Food",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/omelette"),
});

// /datum/crafting_recipe/food/omelette/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_egg.dm:18)
rt.def("/datum/crafting_recipe/food/omelette/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/boiledegg"), 2, T("/obj/item/weapon/reagent_containers/food/snacks/cheesewedge"), 2]));
	return f.dot;
});

rt.type(1647, "/datum/crafting_recipe/food/chocolateegg", "/datum/crafting_recipe/food", {
	name: "Chocolate egg",
	subcategory: "Egg-Based Food",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/chocolateegg"),
});

// /datum/crafting_recipe/food/chocolateegg/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_egg.dm:27)
rt.def("/datum/crafting_recipe/food/chocolateegg/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/boiledegg"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/chocolatebar"), 1]));
	return f.dot;
});

rt.type(1648, "/datum/crafting_recipe/food/eggsbenedict", "/datum/crafting_recipe/food", {
	name: "Eggs benedict",
	subcategory: "Egg-Based Food",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/benedict"),
});

// /datum/crafting_recipe/food/eggsbenedict/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_egg.dm:36)
rt.def("/datum/crafting_recipe/food/eggsbenedict/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/friedegg"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/meat/steak"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/breadslice/plain"), 1]));
	return f.dot;
});
