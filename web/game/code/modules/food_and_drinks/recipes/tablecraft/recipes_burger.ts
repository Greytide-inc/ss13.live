// Based on /tg/station's code/modules/food_and_drinks/recipes/tablecraft/recipes_burger.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1605, "/datum/crafting_recipe/food/humanburger", "/datum/crafting_recipe/food", {
	name: "Human burger",
	subcategory: "Burgers",
	reqs: null,
	parts: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/burger/human"),
});

// recipes_burger.dm:9
rt.def("/datum/crafting_recipe/food/humanburger/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/meat/steak/plain/human"), 1]);

	this.parts = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/steak/plain/human"), 1]);
	return f.dot;
});

rt.type(1606, "/datum/crafting_recipe/food/burger", "/datum/crafting_recipe/food", {
	name: "Burger",
	subcategory: "Burgers",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/burger/plain"),
});

// recipes_burger.dm:21
rt.def("/datum/crafting_recipe/food/burger/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/steak/plain"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1]);
	return f.dot;
});

rt.type(1607, "/datum/crafting_recipe/food/corgiburger", "/datum/crafting_recipe/food", {
	name: "Corgi burger",
	subcategory: "Burgers",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/burger/corgi"),
});

// recipes_burger.dm:31
rt.def("/datum/crafting_recipe/food/corgiburger/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/corgi"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1]);
	return f.dot;
});

rt.type(1608, "/datum/crafting_recipe/food/appendixburger", "/datum/crafting_recipe/food", {
	name: "Appendix burger",
	subcategory: "Burgers",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/burger/appendix"),
});

// recipes_burger.dm:41
rt.def("/datum/crafting_recipe/food/appendixburger/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/obj/item/organ/appendix"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1]);
	return f.dot;
});

rt.type(1609, "/datum/crafting_recipe/food/brainburger", "/datum/crafting_recipe/food", {
	name: "Brain burger",
	subcategory: "Burgers",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/burger/brain"),
});

// recipes_burger.dm:50
rt.def("/datum/crafting_recipe/food/brainburger/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/obj/item/organ/brain"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1]);
	return f.dot;
});

rt.type(1610, "/datum/crafting_recipe/food/xenoburger", "/datum/crafting_recipe/food", {
	name: "Xeno burger",
	subcategory: "Burgers",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/burger/xeno"),
});

// recipes_burger.dm:59
rt.def("/datum/crafting_recipe/food/xenoburger/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/steak/xeno"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1]);
	return f.dot;
});

rt.type(1611, "/datum/crafting_recipe/food/bearger", "/datum/crafting_recipe/food", {
	name: "Bearger",
	subcategory: "Burgers",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/burger/bearger"),
});

// recipes_burger.dm:68
rt.def("/datum/crafting_recipe/food/bearger/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/steak/bear"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1]);
	return f.dot;
});

rt.type(1612, "/datum/crafting_recipe/food/fishburger", "/datum/crafting_recipe/food", {
	name: "Fish burger",
	subcategory: "Burgers",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/burger/fish"),
});

// recipes_burger.dm:77
rt.def("/datum/crafting_recipe/food/fishburger/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/carpmeat"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1]);
	return f.dot;
});

rt.type(1613, "/datum/crafting_recipe/food/tofuburger", "/datum/crafting_recipe/food", {
	name: "Tofu burger",
	subcategory: "Burgers",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/burger/tofu"),
});

// recipes_burger.dm:86
rt.def("/datum/crafting_recipe/food/tofuburger/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/tofu"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1]);
	return f.dot;
});

rt.type(1614, "/datum/crafting_recipe/food/ghostburger", "/datum/crafting_recipe/food", {
	name: "Ghost burger",
	subcategory: "Burgers",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/burger/ghost"),
});

// recipes_burger.dm:95
rt.def("/datum/crafting_recipe/food/ghostburger/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/obj/item/weapon/ectoplasm"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1]);
	return f.dot;
});

rt.type(1615, "/datum/crafting_recipe/food/clownburger", "/datum/crafting_recipe/food", {
	name: "Clown burger",
	subcategory: "Burgers",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/burger/clown"),
});

// recipes_burger.dm:104
rt.def("/datum/crafting_recipe/food/clownburger/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/obj/item/clothing/mask/gas/clown_hat"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1]);
	return f.dot;
});

rt.type(1616, "/datum/crafting_recipe/food/mimeburger", "/datum/crafting_recipe/food", {
	name: "Mime burger",
	subcategory: "Burgers",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/burger/mime"),
});

// recipes_burger.dm:113
rt.def("/datum/crafting_recipe/food/mimeburger/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/obj/item/clothing/mask/gas/mime"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1]);
	return f.dot;
});

rt.type(1617, "/datum/crafting_recipe/food/redburger", "/datum/crafting_recipe/food", {
	name: "Red burger",
	subcategory: "Burgers",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/burger/red"),
});

// recipes_burger.dm:122
rt.def("/datum/crafting_recipe/food/redburger/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/steak/plain"), 1, T("/obj/item/toy/crayon/red"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1]);
	return f.dot;
});

rt.type(1618, "/datum/crafting_recipe/food/orangeburger", "/datum/crafting_recipe/food", {
	name: "Orange burger",
	subcategory: "Burgers",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/burger/orange"),
});

// recipes_burger.dm:132
rt.def("/datum/crafting_recipe/food/orangeburger/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/steak/plain"), 1, T("/obj/item/toy/crayon/orange"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1]);
	return f.dot;
});

rt.type(1619, "/datum/crafting_recipe/food/yellowburger", "/datum/crafting_recipe/food", {
	name: "Yellow burger",
	subcategory: "Burgers",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/burger/yellow"),
});

// recipes_burger.dm:142
rt.def("/datum/crafting_recipe/food/yellowburger/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/steak/plain"), 1, T("/obj/item/toy/crayon/yellow"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1]);
	return f.dot;
});

rt.type(1620, "/datum/crafting_recipe/food/greenburger", "/datum/crafting_recipe/food", {
	name: "Green burger",
	subcategory: "Burgers",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/burger/green"),
});

// recipes_burger.dm:152
rt.def("/datum/crafting_recipe/food/greenburger/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/steak/plain"), 1, T("/obj/item/toy/crayon/green"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1]);
	return f.dot;
});

rt.type(1621, "/datum/crafting_recipe/food/blueburger", "/datum/crafting_recipe/food", {
	name: "Blue burger",
	subcategory: "Burgers",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/burger/blue"),
});

// recipes_burger.dm:162
rt.def("/datum/crafting_recipe/food/blueburger/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/steak/plain"), 1, T("/obj/item/toy/crayon/blue"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1]);
	return f.dot;
});

rt.type(1622, "/datum/crafting_recipe/food/purpleburger", "/datum/crafting_recipe/food", {
	name: "Purple burger",
	subcategory: "Burgers",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/burger/purple"),
});

// recipes_burger.dm:172
rt.def("/datum/crafting_recipe/food/purpleburger/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/steak/plain"), 1, T("/obj/item/toy/crayon/purple"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1]);
	return f.dot;
});

rt.type(1623, "/datum/crafting_recipe/food/spellburger", "/datum/crafting_recipe/food", {
	name: "Spell burger",
	subcategory: "Burgers",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/burger/spell"),
});

// recipes_burger.dm:182
rt.def("/datum/crafting_recipe/food/spellburger/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/obj/item/clothing/head/wizard/fake"), 1]);
	return f.dot;
});

rt.type(1624, "/datum/crafting_recipe/food/spellburger2", "/datum/crafting_recipe/food", {
	name: "Spell burger",
	subcategory: "Burgers",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/burger/spell"),
});

// recipes_burger.dm:190
rt.def("/datum/crafting_recipe/food/spellburger2/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/obj/item/clothing/head/wizard"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1]);
	return f.dot;
});

rt.type(1625, "/datum/crafting_recipe/food/bigbiteburger", "/datum/crafting_recipe/food", {
	name: "Big bite burger",
	subcategory: "Burgers",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/burger/bigbite"),
});

// recipes_burger.dm:199
rt.def("/datum/crafting_recipe/food/bigbiteburger/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/steak/plain"), 3, T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1]);
	return f.dot;
});

rt.type(1626, "/datum/crafting_recipe/food/superbiteburger", "/datum/crafting_recipe/food", {
	name: "Super bite burger",
	subcategory: "Burgers",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/burger/superbite"),
});

// recipes_burger.dm:208
rt.def("/datum/crafting_recipe/food/superbiteburger/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/datum/reagent/consumable/sodiumchloride"), 5, T("/datum/reagent/consumable/blackpepper"), 5, T("/obj/item/weapon/reagent_containers/food/snacks/meat/steak/plain"), 5, T("/obj/item/weapon/reagent_containers/food/snacks/grown/tomato"), 4, T("/obj/item/weapon/reagent_containers/food/snacks/cheesewedge"), 3, T("/obj/item/weapon/reagent_containers/food/snacks/boiledegg"), 2, T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1]);
	return f.dot;
});

rt.type(1627, "/datum/crafting_recipe/food/slimeburger", "/datum/crafting_recipe/food", {
	name: "Jelly burger",
	subcategory: "Burgers",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/burger/jelly/slime"),
});

// recipes_burger.dm:223
rt.def("/datum/crafting_recipe/food/slimeburger/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/datum/reagent/toxin/slimejelly"), 5, T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1]);
	return f.dot;
});

rt.type(1628, "/datum/crafting_recipe/food/jellyburger", "/datum/crafting_recipe/food", {
	name: "Jelly burger",
	subcategory: "Burgers",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/burger/jelly/cherry"),
});

// recipes_burger.dm:232
rt.def("/datum/crafting_recipe/food/jellyburger/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/datum/reagent/consumable/cherryjelly"), 5, T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1]);
	return f.dot;
});

rt.type(1629, "/datum/crafting_recipe/food/fivealarmburger", "/datum/crafting_recipe/food", {
	name: "Five alarm burger",
	subcategory: "Burgers",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/burger/fivealarm"),
});

// recipes_burger.dm:241
rt.def("/datum/crafting_recipe/food/fivealarmburger/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/grown/ghost_chili"), 2, T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1]);
	return f.dot;
});

rt.type(1630, "/datum/crafting_recipe/food/ratburger", "/datum/crafting_recipe/food", {
	name: "Rat burger",
	subcategory: "Burgers",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/burger/rat"),
});

// recipes_burger.dm:250
rt.def("/datum/crafting_recipe/food/ratburger/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/obj/item/trash/deadmouse"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1]);
	return f.dot;
});

rt.type(1631, "/datum/crafting_recipe/food/baseballburger", "/datum/crafting_recipe/food", {
	name: "Home run baseball burger",
	subcategory: "Burgers",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/burger/baseball"),
});

// recipes_burger.dm:259
rt.def("/datum/crafting_recipe/food/baseballburger/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/obj/item/weapon/melee/baseball_bat"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1]);
	return f.dot;
});

rt.type(1632, "/datum/crafting_recipe/food/baconburger", "/datum/crafting_recipe/food", {
	name: "Bacon Burger",
	subcategory: "Burgers",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/burger/baconburger"),
});

// recipes_burger.dm:268
rt.def("/datum/crafting_recipe/food/baconburger/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/bacon"), 3, T("/obj/item/weapon/reagent_containers/food/snacks/cheesewedge"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1]);
	return f.dot;
});
