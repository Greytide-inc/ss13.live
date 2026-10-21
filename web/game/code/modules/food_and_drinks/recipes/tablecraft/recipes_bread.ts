// From code/modules/food_and_drinks/recipes/tablecraft/recipes_bread.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1596, "/datum/crafting_recipe/food/meatbread", "/datum/crafting_recipe/food", {
	name: "Meat bread",
	subcategory: "Breads",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/store/bread/meat"),
});

// /datum/crafting_recipe/food/meatbread/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_bread.dm:8)
rt.def("/datum/crafting_recipe/food/meatbread/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/store/bread/plain"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet/plain"), 3, T("/obj/item/weapon/reagent_containers/food/snacks/cheesewedge"), 3]));
	return f.dot;
});

rt.type(1597, "/datum/crafting_recipe/food/xenomeatbread", "/datum/crafting_recipe/food", {
	name: "Xenomeat bread",
	subcategory: "Breads",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/store/bread/xenomeat"),
});

// /datum/crafting_recipe/food/xenomeatbread/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_bread.dm:18)
rt.def("/datum/crafting_recipe/food/xenomeatbread/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/store/bread/plain"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet/xeno"), 3, T("/obj/item/weapon/reagent_containers/food/snacks/cheesewedge"), 3]));
	return f.dot;
});

rt.type(1598, "/datum/crafting_recipe/food/spidermeatbread", "/datum/crafting_recipe/food", {
	name: "Spidermeat bread",
	subcategory: "Breads",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/store/bread/spidermeat"),
});

// /datum/crafting_recipe/food/spidermeatbread/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_bread.dm:28)
rt.def("/datum/crafting_recipe/food/spidermeatbread/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/store/bread/plain"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet/spider"), 3, T("/obj/item/weapon/reagent_containers/food/snacks/cheesewedge"), 3]));
	return f.dot;
});

rt.type(1599, "/datum/crafting_recipe/food/banananutbread", "/datum/crafting_recipe/food", {
	name: "Banana nut bread",
	subcategory: "Breads",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/store/bread/banana"),
});

// /datum/crafting_recipe/food/banananutbread/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_bread.dm:38)
rt.def("/datum/crafting_recipe/food/banananutbread/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/consumable/milk"), 5, T("/obj/item/weapon/reagent_containers/food/snacks/store/bread/plain"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/boiledegg"), 3, T("/obj/item/weapon/reagent_containers/food/snacks/grown/banana"), 1]));
	return f.dot;
});

rt.type(1600, "/datum/crafting_recipe/food/tofubread", "/datum/crafting_recipe/food", {
	name: "Tofu bread",
	subcategory: "Breads",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/store/bread/tofu"),
});

// /datum/crafting_recipe/food/tofubread/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_bread.dm:49)
rt.def("/datum/crafting_recipe/food/tofubread/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/store/bread/plain"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/tofu"), 3, T("/obj/item/weapon/reagent_containers/food/snacks/cheesewedge"), 3]));
	return f.dot;
});

rt.type(1601, "/datum/crafting_recipe/food/creamcheesebread", "/datum/crafting_recipe/food", {
	name: "Cream cheese bread",
	subcategory: "Breads",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/store/bread/creamcheese"),
});

// /datum/crafting_recipe/food/creamcheesebread/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_bread.dm:59)
rt.def("/datum/crafting_recipe/food/creamcheesebread/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/consumable/milk"), 5, T("/obj/item/weapon/reagent_containers/food/snacks/store/bread/plain"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/cheesewedge"), 2]));
	return f.dot;
});

rt.type(1602, "/datum/crafting_recipe/food/mimanabread", "/datum/crafting_recipe/food", {
	name: "Mimana bread",
	subcategory: "Breads",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/store/bread/mimana"),
});

// /datum/crafting_recipe/food/mimanabread/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_bread.dm:69)
rt.def("/datum/crafting_recipe/food/mimanabread/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/consumable/soymilk"), 5, T("/obj/item/weapon/reagent_containers/food/snacks/store/bread/plain"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/tofu"), 3, T("/obj/item/weapon/reagent_containers/food/snacks/grown/banana/mime"), 1]));
	return f.dot;
});

rt.type(1603, "/datum/crafting_recipe/food/butteredtoast", "/datum/crafting_recipe/food", {
	name: "Buttered Toast",
	subcategory: "Breads",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/butteredtoast"),
});

// /datum/crafting_recipe/food/butteredtoast/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_bread.dm:80)
rt.def("/datum/crafting_recipe/food/butteredtoast/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/breadslice/plain"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/butter"), 1]));
	return f.dot;
});

rt.type(1604, "/datum/crafting_recipe/food/butterbiscuit", "/datum/crafting_recipe/food", {
	name: "Butter Biscuit",
	subcategory: "Breads",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/butterbiscuit"),
});

// /datum/crafting_recipe/food/butterbiscuit/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_bread.dm:89)
rt.def("/datum/crafting_recipe/food/butterbiscuit/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/butter"), 1]));
	return f.dot;
});
