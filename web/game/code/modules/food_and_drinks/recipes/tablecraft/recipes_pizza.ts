// From code/modules/food_and_drinks/recipes/tablecraft/recipes_pizza.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1743, "/datum/crafting_recipe/food/margheritapizza", "/datum/crafting_recipe/food", {
	name: "Margherita pizza",
	subcategory: "Pizzas",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/pizza/margherita"),
});

// /datum/crafting_recipe/food/margheritapizza/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_pizza.dm:8)
rt.def("/datum/crafting_recipe/food/margheritapizza/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/pizzabread"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/cheesewedge"), 4, T("/obj/item/weapon/reagent_containers/food/snacks/grown/tomato"), 1]));
	return f.dot;
});

rt.type(1744, "/datum/crafting_recipe/food/meatpizza", "/datum/crafting_recipe/food", {
	name: "Meat pizza",
	subcategory: "Pizzas",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/pizza/meat"),
});

// /datum/crafting_recipe/food/meatpizza/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_pizza.dm:18)
rt.def("/datum/crafting_recipe/food/meatpizza/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/pizzabread"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet"), 4, T("/obj/item/weapon/reagent_containers/food/snacks/cheesewedge"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/tomato"), 1]));
	return f.dot;
});

rt.type(1745, "/datum/crafting_recipe/food/mushroompizza", "/datum/crafting_recipe/food", {
	name: "Mushroom pizza",
	subcategory: "Pizzas",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/pizza/mushroom"),
});

// /datum/crafting_recipe/food/mushroompizza/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_pizza.dm:29)
rt.def("/datum/crafting_recipe/food/mushroompizza/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/pizzabread"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/mushroom"), 5]));
	return f.dot;
});

rt.type(1746, "/datum/crafting_recipe/food/vegetablepizza", "/datum/crafting_recipe/food", {
	name: "Vegetable pizza",
	subcategory: "Pizzas",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/pizza/vegetable"),
});

// /datum/crafting_recipe/food/vegetablepizza/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_pizza.dm:38)
rt.def("/datum/crafting_recipe/food/vegetablepizza/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/pizzabread"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/eggplant"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/carrot"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/corn"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/tomato"), 1]));
	return f.dot;
});

rt.type(1747, "/datum/crafting_recipe/food/donpocketpizza", "/datum/crafting_recipe/food", {
	name: "Donkpocket pizza",
	subcategory: "Pizzas",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/pizza/donkpocket"),
});

// /datum/crafting_recipe/food/donpocketpizza/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_pizza.dm:50)
rt.def("/datum/crafting_recipe/food/donpocketpizza/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/pizzabread"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/donkpocket/warm"), 3, T("/obj/item/weapon/reagent_containers/food/snacks/cheesewedge"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/tomato"), 1]));
	return f.dot;
});

rt.type(1748, "/datum/crafting_recipe/food/dankpizza", "/datum/crafting_recipe/food", {
	name: "Dank pizza",
	subcategory: "Pizzas",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/pizza/dank"),
});

// /datum/crafting_recipe/food/dankpizza/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_pizza.dm:61)
rt.def("/datum/crafting_recipe/food/dankpizza/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/pizzabread"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/ambrosia/vulgaris"), 3, T("/obj/item/weapon/reagent_containers/food/snacks/cheesewedge"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/tomato"), 1]));
	return f.dot;
});

rt.type(1749, "/datum/crafting_recipe/food/sassysagepizza", "/datum/crafting_recipe/food", {
	name: "Sassysage pizza",
	subcategory: "Pizzas",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/pizza/sassysage"),
});

// /datum/crafting_recipe/food/sassysagepizza/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_pizza.dm:72)
rt.def("/datum/crafting_recipe/food/sassysagepizza/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/pizzabread"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/faggot"), 3, T("/obj/item/weapon/reagent_containers/food/snacks/cheesewedge"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/tomato"), 1]));
	return f.dot;
});
