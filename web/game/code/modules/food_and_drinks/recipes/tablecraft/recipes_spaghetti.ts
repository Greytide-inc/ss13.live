// From code/modules/food_and_drinks/recipes/tablecraft/recipes_spaghetti.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1788, "/datum/crafting_recipe/food/tomatopasta", "/datum/crafting_recipe/food", {
	name: "Tomato pasta",
	subcategory: "Spaghettis",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/pastatomato"),
});

// /datum/crafting_recipe/food/tomatopasta/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_spaghetti.dm:8)
rt.def("/datum/crafting_recipe/food/tomatopasta/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/boiledspaghetti"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/tomato"), 2]));
	return f.dot;
});

rt.type(1789, "/datum/crafting_recipe/food/copypasta", "/datum/crafting_recipe/food", {
	name: "Copypasta",
	subcategory: "Spaghettis",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/copypasta"),
});

// /datum/crafting_recipe/food/copypasta/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_spaghetti.dm:17)
rt.def("/datum/crafting_recipe/food/copypasta/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/pastatomato"), 2]));
	return f.dot;
});

rt.type(1790, "/datum/crafting_recipe/food/spaghettimeatball", "/datum/crafting_recipe/food", {
	name: "Spaghetti meatball",
	subcategory: "Spaghettis",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/meatballspaghetti"),
});

// /datum/crafting_recipe/food/spaghettimeatball/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_spaghetti.dm:25)
rt.def("/datum/crafting_recipe/food/spaghettimeatball/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/boiledspaghetti"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/faggot"), 2]));
	return f.dot;
});

rt.type(1791, "/datum/crafting_recipe/food/spesslaw", "/datum/crafting_recipe/food", {
	name: "Spesslaw",
	subcategory: "Spaghettis",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/spesslaw"),
});

// /datum/crafting_recipe/food/spesslaw/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_spaghetti.dm:34)
rt.def("/datum/crafting_recipe/food/spesslaw/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/boiledspaghetti"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/faggot"), 4]));
	return f.dot;
});

rt.type(1792, "/datum/crafting_recipe/food/beefnoodle", "/datum/crafting_recipe/food", {
	name: "Beef noodle",
	subcategory: "Spaghettis",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/beefnoodle"),
});

// /datum/crafting_recipe/food/beefnoodle/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_spaghetti.dm:43)
rt.def("/datum/crafting_recipe/food/beefnoodle/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/glass/bowl"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/boiledspaghetti"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet"), 2, T("/obj/item/weapon/reagent_containers/food/snacks/grown/cabbage"), 1]));
	return f.dot;
});

rt.type(1793, "/datum/crafting_recipe/food/chowmein", "/datum/crafting_recipe/food", {
	name: "Chowmein",
	subcategory: "Spaghettis",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/chowmein"),
});

// /datum/crafting_recipe/food/chowmein/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_spaghetti.dm:54)
rt.def("/datum/crafting_recipe/food/chowmein/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/boiledspaghetti"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/cabbage"), 2, T("/obj/item/weapon/reagent_containers/food/snacks/grown/carrot"), 1]));
	return f.dot;
});

rt.type(1794, "/datum/crafting_recipe/food/butternoodles", "/datum/crafting_recipe/food", {
	name: "Butter Noodles",
	subcategory: "Spaghettis",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/butternoodles"),
});

// /datum/crafting_recipe/food/butternoodles/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_spaghetti.dm:65)
rt.def("/datum/crafting_recipe/food/butternoodles/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/boiledspaghetti"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/butter"), 1]));
	return f.dot;
});
