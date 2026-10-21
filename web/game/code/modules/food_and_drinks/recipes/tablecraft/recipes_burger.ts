// From code/modules/food_and_drinks/recipes/tablecraft/recipes_burger.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1605, "/datum/crafting_recipe/food/humanburger", "/datum/crafting_recipe/food", {
	name: "Human burger",
	subcategory: "Burgers",
	reqs: null,
	parts: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/burger/human"),
});

// /datum/crafting_recipe/food/humanburger/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_burger.dm:9)
rt.def("/datum/crafting_recipe/food/humanburger/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/meat/steak/plain/human"), 1]));
	$0 = $0;
	rt.setSv(f, "parts", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/steak/plain/human"), 1]));
	return f.dot;
});

rt.type(1606, "/datum/crafting_recipe/food/burger", "/datum/crafting_recipe/food", {
	name: "Burger",
	subcategory: "Burgers",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/burger/plain"),
});

// /datum/crafting_recipe/food/burger/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_burger.dm:21)
rt.def("/datum/crafting_recipe/food/burger/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/steak/plain"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1]));
	return f.dot;
});

rt.type(1607, "/datum/crafting_recipe/food/corgiburger", "/datum/crafting_recipe/food", {
	name: "Corgi burger",
	subcategory: "Burgers",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/burger/corgi"),
});

// /datum/crafting_recipe/food/corgiburger/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_burger.dm:31)
rt.def("/datum/crafting_recipe/food/corgiburger/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/corgi"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1]));
	return f.dot;
});

rt.type(1608, "/datum/crafting_recipe/food/appendixburger", "/datum/crafting_recipe/food", {
	name: "Appendix burger",
	subcategory: "Burgers",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/burger/appendix"),
});

// /datum/crafting_recipe/food/appendixburger/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_burger.dm:41)
rt.def("/datum/crafting_recipe/food/appendixburger/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/organ/appendix"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1]));
	return f.dot;
});

rt.type(1609, "/datum/crafting_recipe/food/brainburger", "/datum/crafting_recipe/food", {
	name: "Brain burger",
	subcategory: "Burgers",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/burger/brain"),
});

// /datum/crafting_recipe/food/brainburger/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_burger.dm:50)
rt.def("/datum/crafting_recipe/food/brainburger/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/organ/brain"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1]));
	return f.dot;
});

rt.type(1610, "/datum/crafting_recipe/food/xenoburger", "/datum/crafting_recipe/food", {
	name: "Xeno burger",
	subcategory: "Burgers",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/burger/xeno"),
});

// /datum/crafting_recipe/food/xenoburger/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_burger.dm:59)
rt.def("/datum/crafting_recipe/food/xenoburger/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/steak/xeno"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1]));
	return f.dot;
});

rt.type(1611, "/datum/crafting_recipe/food/bearger", "/datum/crafting_recipe/food", {
	name: "Bearger",
	subcategory: "Burgers",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/burger/bearger"),
});

// /datum/crafting_recipe/food/bearger/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_burger.dm:68)
rt.def("/datum/crafting_recipe/food/bearger/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/steak/bear"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1]));
	return f.dot;
});

rt.type(1612, "/datum/crafting_recipe/food/fishburger", "/datum/crafting_recipe/food", {
	name: "Fish burger",
	subcategory: "Burgers",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/burger/fish"),
});

// /datum/crafting_recipe/food/fishburger/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_burger.dm:77)
rt.def("/datum/crafting_recipe/food/fishburger/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/carpmeat"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1]));
	return f.dot;
});

rt.type(1613, "/datum/crafting_recipe/food/tofuburger", "/datum/crafting_recipe/food", {
	name: "Tofu burger",
	subcategory: "Burgers",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/burger/tofu"),
});

// /datum/crafting_recipe/food/tofuburger/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_burger.dm:86)
rt.def("/datum/crafting_recipe/food/tofuburger/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/tofu"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1]));
	return f.dot;
});

rt.type(1614, "/datum/crafting_recipe/food/ghostburger", "/datum/crafting_recipe/food", {
	name: "Ghost burger",
	subcategory: "Burgers",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/burger/ghost"),
});

// /datum/crafting_recipe/food/ghostburger/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_burger.dm:95)
rt.def("/datum/crafting_recipe/food/ghostburger/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/ectoplasm"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1]));
	return f.dot;
});

rt.type(1615, "/datum/crafting_recipe/food/clownburger", "/datum/crafting_recipe/food", {
	name: "Clown burger",
	subcategory: "Burgers",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/burger/clown"),
});

// /datum/crafting_recipe/food/clownburger/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_burger.dm:104)
rt.def("/datum/crafting_recipe/food/clownburger/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/clothing/mask/gas/clown_hat"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1]));
	return f.dot;
});

rt.type(1616, "/datum/crafting_recipe/food/mimeburger", "/datum/crafting_recipe/food", {
	name: "Mime burger",
	subcategory: "Burgers",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/burger/mime"),
});

// /datum/crafting_recipe/food/mimeburger/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_burger.dm:113)
rt.def("/datum/crafting_recipe/food/mimeburger/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/clothing/mask/gas/mime"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1]));
	return f.dot;
});

rt.type(1617, "/datum/crafting_recipe/food/redburger", "/datum/crafting_recipe/food", {
	name: "Red burger",
	subcategory: "Burgers",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/burger/red"),
});

// /datum/crafting_recipe/food/redburger/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_burger.dm:122)
rt.def("/datum/crafting_recipe/food/redburger/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/steak/plain"), 1, T("/obj/item/toy/crayon/red"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1]));
	return f.dot;
});

rt.type(1618, "/datum/crafting_recipe/food/orangeburger", "/datum/crafting_recipe/food", {
	name: "Orange burger",
	subcategory: "Burgers",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/burger/orange"),
});

// /datum/crafting_recipe/food/orangeburger/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_burger.dm:132)
rt.def("/datum/crafting_recipe/food/orangeburger/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/steak/plain"), 1, T("/obj/item/toy/crayon/orange"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1]));
	return f.dot;
});

rt.type(1619, "/datum/crafting_recipe/food/yellowburger", "/datum/crafting_recipe/food", {
	name: "Yellow burger",
	subcategory: "Burgers",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/burger/yellow"),
});

// /datum/crafting_recipe/food/yellowburger/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_burger.dm:142)
rt.def("/datum/crafting_recipe/food/yellowburger/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/steak/plain"), 1, T("/obj/item/toy/crayon/yellow"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1]));
	return f.dot;
});

rt.type(1620, "/datum/crafting_recipe/food/greenburger", "/datum/crafting_recipe/food", {
	name: "Green burger",
	subcategory: "Burgers",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/burger/green"),
});

// /datum/crafting_recipe/food/greenburger/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_burger.dm:152)
rt.def("/datum/crafting_recipe/food/greenburger/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/steak/plain"), 1, T("/obj/item/toy/crayon/green"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1]));
	return f.dot;
});

rt.type(1621, "/datum/crafting_recipe/food/blueburger", "/datum/crafting_recipe/food", {
	name: "Blue burger",
	subcategory: "Burgers",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/burger/blue"),
});

// /datum/crafting_recipe/food/blueburger/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_burger.dm:162)
rt.def("/datum/crafting_recipe/food/blueburger/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/steak/plain"), 1, T("/obj/item/toy/crayon/blue"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1]));
	return f.dot;
});

rt.type(1622, "/datum/crafting_recipe/food/purpleburger", "/datum/crafting_recipe/food", {
	name: "Purple burger",
	subcategory: "Burgers",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/burger/purple"),
});

// /datum/crafting_recipe/food/purpleburger/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_burger.dm:172)
rt.def("/datum/crafting_recipe/food/purpleburger/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/steak/plain"), 1, T("/obj/item/toy/crayon/purple"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1]));
	return f.dot;
});

rt.type(1623, "/datum/crafting_recipe/food/spellburger", "/datum/crafting_recipe/food", {
	name: "Spell burger",
	subcategory: "Burgers",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/burger/spell"),
});

// /datum/crafting_recipe/food/spellburger/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_burger.dm:182)
rt.def("/datum/crafting_recipe/food/spellburger/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/clothing/head/wizard/fake"), 1]));
	return f.dot;
});

rt.type(1624, "/datum/crafting_recipe/food/spellburger2", "/datum/crafting_recipe/food", {
	name: "Spell burger",
	subcategory: "Burgers",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/burger/spell"),
});

// /datum/crafting_recipe/food/spellburger2/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_burger.dm:190)
rt.def("/datum/crafting_recipe/food/spellburger2/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/clothing/head/wizard"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1]));
	return f.dot;
});

rt.type(1625, "/datum/crafting_recipe/food/bigbiteburger", "/datum/crafting_recipe/food", {
	name: "Big bite burger",
	subcategory: "Burgers",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/burger/bigbite"),
});

// /datum/crafting_recipe/food/bigbiteburger/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_burger.dm:199)
rt.def("/datum/crafting_recipe/food/bigbiteburger/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/steak/plain"), 3, T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1]));
	return f.dot;
});

rt.type(1626, "/datum/crafting_recipe/food/superbiteburger", "/datum/crafting_recipe/food", {
	name: "Super bite burger",
	subcategory: "Burgers",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/burger/superbite"),
});

// /datum/crafting_recipe/food/superbiteburger/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_burger.dm:208)
rt.def("/datum/crafting_recipe/food/superbiteburger/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/consumable/sodiumchloride"), 5, T("/datum/reagent/consumable/blackpepper"), 5, T("/obj/item/weapon/reagent_containers/food/snacks/meat/steak/plain"), 5, T("/obj/item/weapon/reagent_containers/food/snacks/grown/tomato"), 4, T("/obj/item/weapon/reagent_containers/food/snacks/cheesewedge"), 3, T("/obj/item/weapon/reagent_containers/food/snacks/boiledegg"), 2, T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1]));
	return f.dot;
});

rt.type(1627, "/datum/crafting_recipe/food/slimeburger", "/datum/crafting_recipe/food", {
	name: "Jelly burger",
	subcategory: "Burgers",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/burger/jelly/slime"),
});

// /datum/crafting_recipe/food/slimeburger/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_burger.dm:223)
rt.def("/datum/crafting_recipe/food/slimeburger/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/toxin/slimejelly"), 5, T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1]));
	return f.dot;
});

rt.type(1628, "/datum/crafting_recipe/food/jellyburger", "/datum/crafting_recipe/food", {
	name: "Jelly burger",
	subcategory: "Burgers",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/burger/jelly/cherry"),
});

// /datum/crafting_recipe/food/jellyburger/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_burger.dm:232)
rt.def("/datum/crafting_recipe/food/jellyburger/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/consumable/cherryjelly"), 5, T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1]));
	return f.dot;
});

rt.type(1629, "/datum/crafting_recipe/food/fivealarmburger", "/datum/crafting_recipe/food", {
	name: "Five alarm burger",
	subcategory: "Burgers",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/burger/fivealarm"),
});

// /datum/crafting_recipe/food/fivealarmburger/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_burger.dm:241)
rt.def("/datum/crafting_recipe/food/fivealarmburger/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/grown/ghost_chili"), 2, T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1]));
	return f.dot;
});

rt.type(1630, "/datum/crafting_recipe/food/ratburger", "/datum/crafting_recipe/food", {
	name: "Rat burger",
	subcategory: "Burgers",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/burger/rat"),
});

// /datum/crafting_recipe/food/ratburger/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_burger.dm:250)
rt.def("/datum/crafting_recipe/food/ratburger/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/trash/deadmouse"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1]));
	return f.dot;
});

rt.type(1631, "/datum/crafting_recipe/food/baseballburger", "/datum/crafting_recipe/food", {
	name: "Home run baseball burger",
	subcategory: "Burgers",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/burger/baseball"),
});

// /datum/crafting_recipe/food/baseballburger/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_burger.dm:259)
rt.def("/datum/crafting_recipe/food/baseballburger/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/melee/baseball_bat"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1]));
	return f.dot;
});

rt.type(1632, "/datum/crafting_recipe/food/baconburger", "/datum/crafting_recipe/food", {
	name: "Bacon Burger",
	subcategory: "Burgers",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/burger/baconburger"),
});

// /datum/crafting_recipe/food/baconburger/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_burger.dm:268)
rt.def("/datum/crafting_recipe/food/baconburger/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/bacon"), 3, T("/obj/item/weapon/reagent_containers/food/snacks/cheesewedge"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1]));
	return f.dot;
});
