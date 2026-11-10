// Based on /tg/station's code/modules/food_and_drinks/recipes/tablecraft/recipes_salad.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1750, "/datum/crafting_recipe/food/herbsalad", "/datum/crafting_recipe/food", {
	name: "Herb salad",
	subcategory: "Salads",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/salad/herbsalad"),
});

// recipes_salad.dm:8
rt.def("/datum/crafting_recipe/food/herbsalad/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/obj/item/weapon/reagent_containers/glass/bowl"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/ambrosia/vulgaris"), 3, T("/obj/item/weapon/reagent_containers/food/snacks/grown/apple"), 1]);
	return f.dot;
});

rt.type(1751, "/datum/crafting_recipe/food/aesirsalad", "/datum/crafting_recipe/food", {
	name: "Aesir salad",
	subcategory: "Salads",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/salad/aesirsalad"),
});

// recipes_salad.dm:18
rt.def("/datum/crafting_recipe/food/aesirsalad/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/obj/item/weapon/reagent_containers/glass/bowl"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/ambrosia/deus"), 3, T("/obj/item/weapon/reagent_containers/food/snacks/grown/apple/gold"), 1]);
	return f.dot;
});

rt.type(1752, "/datum/crafting_recipe/food/validsalad", "/datum/crafting_recipe/food", {
	name: "Valid salad",
	subcategory: "Salads",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/salad/validsalad"),
});

// recipes_salad.dm:28
rt.def("/datum/crafting_recipe/food/validsalad/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/obj/item/weapon/reagent_containers/glass/bowl"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/ambrosia/vulgaris"), 3, T("/obj/item/weapon/reagent_containers/food/snacks/grown/potato"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/faggot"), 1]);
	return f.dot;
});

rt.type(1753, "/datum/crafting_recipe/food/monkeysdelight", "/datum/crafting_recipe/food", {
	name: "Monkeys delight",
	subcategory: "Salads",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/soup/monkeysdelight"),
});

// recipes_salad.dm:39
rt.def("/datum/crafting_recipe/food/monkeysdelight/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/datum/reagent/consumable/flour"), 5, T("/datum/reagent/consumable/sodiumchloride"), 1, T("/datum/reagent/consumable/blackpepper"), 1, T("/obj/item/weapon/reagent_containers/glass/bowl"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/monkeycube"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/banana"), 1]);
	return f.dot;
});

rt.type(1754, "/datum/crafting_recipe/food/oatmeal", "/datum/crafting_recipe/food", {
	name: "Oatmeal",
	subcategory: "Salads",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/salad/oatmeal"),
});

// recipes_salad.dm:52
rt.def("/datum/crafting_recipe/food/oatmeal/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/datum/reagent/consumable/milk"), 10, T("/obj/item/weapon/reagent_containers/glass/bowl"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/oat"), 1]);
	return f.dot;
});

rt.type(1755, "/datum/crafting_recipe/food/fruitsalad", "/datum/crafting_recipe/food", {
	name: "Fruit salad",
	subcategory: "Salads",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/salad/fruit"),
});

// recipes_salad.dm:62
rt.def("/datum/crafting_recipe/food/fruitsalad/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/obj/item/weapon/reagent_containers/glass/bowl"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/citrus/orange"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/apple"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/grapes"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/watermelonslice"), 2]);
	return f.dot;
});

rt.type(1756, "/datum/crafting_recipe/food/junglesalad", "/datum/crafting_recipe/food", {
	name: "Jungle salad",
	subcategory: "Salads",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/salad/jungle"),
});

// recipes_salad.dm:75
rt.def("/datum/crafting_recipe/food/junglesalad/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/obj/item/weapon/reagent_containers/glass/bowl"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/apple"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/grapes"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/banana"), 2, T("/obj/item/weapon/reagent_containers/food/snacks/watermelonslice"), 2]);
	return f.dot;
});

rt.type(1757, "/datum/crafting_recipe/food/citrusdelight", "/datum/crafting_recipe/food", {
	name: "Citrus delight",
	subcategory: "Salads",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/salad/citrusdelight"),
});

// recipes_salad.dm:88
rt.def("/datum/crafting_recipe/food/citrusdelight/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/obj/item/weapon/reagent_containers/glass/bowl"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/citrus/lime"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/citrus/lemon"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/citrus/orange"), 1]);
	return f.dot;
});

rt.type(1758, "/datum/crafting_recipe/food/ricepork", "/datum/crafting_recipe/food", {
	name: "Rice and pork",
	subcategory: "Salads",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/salad/ricepork"),
});

// recipes_salad.dm:100
rt.def("/datum/crafting_recipe/food/ricepork/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/salad/boiledrice"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet"), 2]);
	return f.dot;
});

rt.type(1759, "/datum/crafting_recipe/food/eggbowl", "/datum/crafting_recipe/food", {
	name: "Egg bowl",
	subcategory: "Salads",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/salad/eggbowl"),
});

// recipes_salad.dm:109
rt.def("/datum/crafting_recipe/food/eggbowl/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/salad/boiledrice"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/boiledegg"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/carrot"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/corn"), 1]);
	return f.dot;
});

rt.type(1760, "/datum/crafting_recipe/food/ricepudding", "/datum/crafting_recipe/food", {
	name: "Rice pudding",
	subcategory: "Salads",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/salad/ricepudding"),
});

// recipes_salad.dm:120
rt.def("/datum/crafting_recipe/food/ricepudding/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/datum/reagent/consumable/milk"), 5, T("/datum/reagent/consumable/sugar"), 5, T("/obj/item/weapon/reagent_containers/food/snacks/salad/boiledrice"), 1]);
	return f.dot;
});
