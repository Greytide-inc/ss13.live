// From code/modules/food_and_drinks/recipes/tablecraft/recipes_sandwich.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1761, "/datum/crafting_recipe/food/sandwich", "/datum/crafting_recipe/food", {
	name: "Sandwich",
	subcategory: "Sandwiches",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/sandwich"),
});

// /datum/crafting_recipe/food/sandwich/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_sandwich.dm:11)
rt.def("/datum/crafting_recipe/food/sandwich/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/breadslice/plain"), 2, T("/obj/item/weapon/reagent_containers/food/snacks/meat/steak"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/cheesewedge"), 1]));
	return f.dot;
});

rt.type(1762, "/datum/crafting_recipe/food/grilledcheesesandwich", "/datum/crafting_recipe/food", {
	name: "Grilled cheese sandwich",
	subcategory: "Sandwiches",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grilledcheese"),
});

// /datum/crafting_recipe/food/grilledcheesesandwich/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_sandwich.dm:21)
rt.def("/datum/crafting_recipe/food/grilledcheesesandwich/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/breadslice/plain"), 2, T("/obj/item/weapon/reagent_containers/food/snacks/cheesewedge"), 2]));
	return f.dot;
});

rt.type(1763, "/datum/crafting_recipe/food/slimesandwich", "/datum/crafting_recipe/food", {
	name: "Jelly sandwich",
	subcategory: "Sandwiches",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/jellysandwich/slime"),
});

// /datum/crafting_recipe/food/slimesandwich/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_sandwich.dm:30)
rt.def("/datum/crafting_recipe/food/slimesandwich/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/toxin/slimejelly"), 5, T("/obj/item/weapon/reagent_containers/food/snacks/breadslice/plain"), 2]));
	return f.dot;
});

rt.type(1764, "/datum/crafting_recipe/food/cherrysandwich", "/datum/crafting_recipe/food", {
	name: "Jelly sandwich",
	subcategory: "Sandwiches",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/jellysandwich/cherry"),
});

// /datum/crafting_recipe/food/cherrysandwich/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_sandwich.dm:39)
rt.def("/datum/crafting_recipe/food/cherrysandwich/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/consumable/cherryjelly"), 5, T("/obj/item/weapon/reagent_containers/food/snacks/breadslice/plain"), 2]));
	return f.dot;
});

rt.type(1765, "/datum/crafting_recipe/food/icecreamsandwich", "/datum/crafting_recipe/food", {
	name: "Icecream sandwich",
	subcategory: "Sandwiches",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/icecreamsandwich"),
});

// /datum/crafting_recipe/food/icecreamsandwich/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_sandwich.dm:48)
rt.def("/datum/crafting_recipe/food/icecreamsandwich/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/consumable/cream"), 5, T("/datum/reagent/consumable/ice"), 5, T("/obj/item/weapon/reagent_containers/food/snacks/icecream"), 1]));
	return f.dot;
});

rt.type(1766, "/datum/crafting_recipe/food/notasandwich", "/datum/crafting_recipe/food", {
	name: "Not a sandwich",
	subcategory: "Sandwiches",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/notasandwich"),
});

// /datum/crafting_recipe/food/notasandwich/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_sandwich.dm:58)
rt.def("/datum/crafting_recipe/food/notasandwich/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/breadslice/plain"), 2, T("/obj/item/clothing/mask/fakemoustache"), 1]));
	return f.dot;
});
