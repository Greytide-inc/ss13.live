// From code/modules/food_and_drinks/recipes/tablecraft/recipes_cake.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1633, "/datum/crafting_recipe/food/carrotcake", "/datum/crafting_recipe/food", {
	name: "Carrot cake",
	subcategory: "Cakes",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/store/cake/carrot"),
});

// /datum/crafting_recipe/food/carrotcake/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_cake.dm:8)
rt.def("/datum/crafting_recipe/food/carrotcake/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/store/cake/plain"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/carrot"), 2]));
	return f.dot;
});

rt.type(1634, "/datum/crafting_recipe/food/cheesecake", "/datum/crafting_recipe/food", {
	name: "Cheese cake",
	subcategory: "Cakes",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/store/cake/cheese"),
});

// /datum/crafting_recipe/food/cheesecake/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_cake.dm:17)
rt.def("/datum/crafting_recipe/food/cheesecake/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/store/cake/plain"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/cheesewedge"), 2]));
	return f.dot;
});

rt.type(1635, "/datum/crafting_recipe/food/applecake", "/datum/crafting_recipe/food", {
	name: "Apple cake",
	subcategory: "Cakes",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/store/cake/apple"),
});

// /datum/crafting_recipe/food/applecake/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_cake.dm:26)
rt.def("/datum/crafting_recipe/food/applecake/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/store/cake/plain"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/apple"), 2]));
	return f.dot;
});

rt.type(1636, "/datum/crafting_recipe/food/orangecake", "/datum/crafting_recipe/food", {
	name: "Orange cake",
	subcategory: "Cakes",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/store/cake/orange"),
});

// /datum/crafting_recipe/food/orangecake/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_cake.dm:35)
rt.def("/datum/crafting_recipe/food/orangecake/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/store/cake/plain"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/citrus/orange"), 2]));
	return f.dot;
});

rt.type(1637, "/datum/crafting_recipe/food/limecake", "/datum/crafting_recipe/food", {
	name: "Lime cake",
	subcategory: "Cakes",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/store/cake/lime"),
});

// /datum/crafting_recipe/food/limecake/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_cake.dm:44)
rt.def("/datum/crafting_recipe/food/limecake/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/store/cake/plain"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/citrus/lime"), 2]));
	return f.dot;
});

rt.type(1638, "/datum/crafting_recipe/food/lemoncake", "/datum/crafting_recipe/food", {
	name: "Lemon cake",
	subcategory: "Cakes",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/store/cake/lemon"),
});

// /datum/crafting_recipe/food/lemoncake/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_cake.dm:53)
rt.def("/datum/crafting_recipe/food/lemoncake/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/store/cake/plain"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/citrus/lemon"), 2]));
	return f.dot;
});

rt.type(1639, "/datum/crafting_recipe/food/chocolatecake", "/datum/crafting_recipe/food", {
	name: "Chocolate cake",
	subcategory: "Cakes",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/store/cake/chocolate"),
});

// /datum/crafting_recipe/food/chocolatecake/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_cake.dm:62)
rt.def("/datum/crafting_recipe/food/chocolatecake/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/store/cake/plain"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/chocolatebar"), 2]));
	return f.dot;
});

rt.type(1640, "/datum/crafting_recipe/food/birthdaycake", "/datum/crafting_recipe/food", {
	name: "Birthday cake",
	subcategory: "Cakes",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/store/cake/birthday"),
});

// /datum/crafting_recipe/food/birthdaycake/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_cake.dm:71)
rt.def("/datum/crafting_recipe/food/birthdaycake/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/clothing/head/hardhat/cakehat"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/store/cake/plain"), 1]));
	return f.dot;
});

rt.type(1641, "/datum/crafting_recipe/food/braincake", "/datum/crafting_recipe/food", {
	name: "Brain cake",
	subcategory: "Cakes",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/store/cake/brain"),
});

// /datum/crafting_recipe/food/braincake/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_cake.dm:80)
rt.def("/datum/crafting_recipe/food/braincake/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/organ/brain"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/store/cake/plain"), 1]));
	return f.dot;
});

rt.type(1642, "/datum/crafting_recipe/food/slimecake", "/datum/crafting_recipe/food", {
	name: "Slime cake",
	subcategory: "Cakes",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/store/cake/slimecake"),
});

// /datum/crafting_recipe/food/slimecake/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_cake.dm:89)
rt.def("/datum/crafting_recipe/food/slimecake/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/slime_extract"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/store/cake/plain"), 1]));
	return f.dot;
});

rt.type(1643, "/datum/crafting_recipe/food/pumpkinspicecake", "/datum/crafting_recipe/food", {
	name: "Pumpkin spice cake",
	subcategory: "Cakes",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/store/cake/pumpkinspice"),
});

// /datum/crafting_recipe/food/pumpkinspicecake/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_cake.dm:98)
rt.def("/datum/crafting_recipe/food/pumpkinspicecake/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/store/cake/plain"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/pumpkin"), 2]));
	return f.dot;
});

rt.type(1644, "/datum/crafting_recipe/food/cak", "/datum/crafting_recipe/food", {
	name: "Living cat/cake hybrid",
	subcategory: "Cakes",
	reqs: null,
	result: rt.typePath("/mob/living/simple_animal/pet/cat/cak"),
});

// /datum/crafting_recipe/food/cak/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_cake.dm:107)
rt.def("/datum/crafting_recipe/food/cak/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/organ/brain"), 1, T("/obj/item/organ/heart"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/store/cake/birthday"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab"), 3, T("/datum/reagent/blood"), 30, T("/datum/reagent/consumable/sprinkles"), 5, T("/datum/reagent/teslium"), 1]));
	return f.dot;
});
