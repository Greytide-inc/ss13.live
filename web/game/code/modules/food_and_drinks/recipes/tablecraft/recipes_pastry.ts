// From code/modules/food_and_drinks/recipes/tablecraft/recipes_pastry.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1698, "/datum/crafting_recipe/food/chaosdonut", "/datum/crafting_recipe/food", {
	name: "Chaos donut",
	subcategory: "Pastries",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/donut/chaos"),
});

// /datum/crafting_recipe/food/chaosdonut/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_pastry.dm:8)
rt.def("/datum/crafting_recipe/food/chaosdonut/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/consumable/frostoil"), 5, T("/datum/reagent/consumable/capsaicin"), 5, T("/obj/item/weapon/reagent_containers/food/snacks/pastrybase"), 1]));
	return f.dot;
});

rt.type(1699, "/datum/crafting_recipe/food/donut", "/datum/crafting_recipe/food", {
	time: 15,
	name: "Donut",
	subcategory: "Pastries",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/donut"),
});

// /datum/crafting_recipe/food/donut/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_pastry.dm:19)
rt.def("/datum/crafting_recipe/food/donut/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/consumable/sugar"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/pastrybase"), 1]));
	return f.dot;
});

rt.type(1700, "/datum/crafting_recipe/food/jellydonut", "/datum/crafting_recipe/food", {
	name: "Jelly donut",
	subcategory: "Pastries",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/donut/jelly"),
});

// /datum/crafting_recipe/food/jellydonut/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_pastry.dm:28)
rt.def("/datum/crafting_recipe/food/jellydonut/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/consumable/berryjuice"), 5, T("/obj/item/weapon/reagent_containers/food/snacks/pastrybase"), 1]));
	return f.dot;
});

rt.type(1701, "/datum/crafting_recipe/food/cherryjellydonut", "/datum/crafting_recipe/food", {
	name: "Cherry jelly donut",
	subcategory: "Pastries",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/donut/jelly/cherryjelly"),
});

// /datum/crafting_recipe/food/cherryjellydonut/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_pastry.dm:37)
rt.def("/datum/crafting_recipe/food/cherryjellydonut/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/consumable/cherryjelly"), 5, T("/obj/item/weapon/reagent_containers/food/snacks/pastrybase"), 1]));
	return f.dot;
});

rt.type(1702, "/datum/crafting_recipe/food/slimejellydonut", "/datum/crafting_recipe/food", {
	name: "Slime jelly donut",
	subcategory: "Pastries",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/donut/jelly/slimejelly"),
});

// /datum/crafting_recipe/food/slimejellydonut/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_pastry.dm:46)
rt.def("/datum/crafting_recipe/food/slimejellydonut/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/toxin/slimejelly"), 5, T("/obj/item/weapon/reagent_containers/food/snacks/pastrybase"), 1]));
	return f.dot;
});

rt.type(1703, "/datum/crafting_recipe/food/waffles", "/datum/crafting_recipe/food", {
	time: 15,
	name: "Waffles",
	subcategory: "Pastries",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/waffles"),
});

// /datum/crafting_recipe/food/waffles/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_pastry.dm:58)
rt.def("/datum/crafting_recipe/food/waffles/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/pastrybase"), 2]));
	return f.dot;
});

rt.type(1704, "/datum/crafting_recipe/food/soylenviridians", "/datum/crafting_recipe/food", {
	name: "Soylent viridians",
	subcategory: "Pastries",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/soylenviridians"),
});

// /datum/crafting_recipe/food/soylenviridians/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_pastry.dm:67)
rt.def("/datum/crafting_recipe/food/soylenviridians/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/pastrybase"), 2, T("/obj/item/weapon/reagent_containers/food/snacks/grown/soybeans"), 1]));
	return f.dot;
});

rt.type(1705, "/datum/crafting_recipe/food/soylentgreen", "/datum/crafting_recipe/food", {
	name: "Soylent green",
	subcategory: "Pastries",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/soylentgreen"),
});

// /datum/crafting_recipe/food/soylentgreen/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_pastry.dm:76)
rt.def("/datum/crafting_recipe/food/soylentgreen/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/pastrybase"), 2, T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human"), 2]));
	return f.dot;
});

rt.type(1706, "/datum/crafting_recipe/food/rofflewaffles", "/datum/crafting_recipe/food", {
	name: "Roffle waffles",
	subcategory: "Pastries",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/rofflewaffles"),
});

// /datum/crafting_recipe/food/rofflewaffles/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_pastry.dm:86)
rt.def("/datum/crafting_recipe/food/rofflewaffles/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/mushroomhallucinogen"), 5, T("/obj/item/weapon/reagent_containers/food/snacks/pastrybase"), 2]));
	return f.dot;
});

rt.type(1707, "/datum/crafting_recipe/food/donkpocket", "/datum/crafting_recipe/food", {
	time: 15,
	name: "Donkpocket",
	subcategory: "Pastries",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/donkpocket"),
});

// /datum/crafting_recipe/food/donkpocket/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_pastry.dm:98)
rt.def("/datum/crafting_recipe/food/donkpocket/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/pastrybase"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/faggot"), 1]));
	return f.dot;
});

rt.type(1708, "/datum/crafting_recipe/food/dankpocket", "/datum/crafting_recipe/food", {
	time: 15,
	name: "Dankpocket",
	subcategory: "Pastries",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/dankpocket"),
});

// /datum/crafting_recipe/food/dankpocket/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_pastry.dm:108)
rt.def("/datum/crafting_recipe/food/dankpocket/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/pastrybase"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/cannabis"), 1]));
	return f.dot;
});

rt.type(1709, "/datum/crafting_recipe/food/muffin", "/datum/crafting_recipe/food", {
	time: 15,
	name: "Muffin",
	subcategory: "Pastries",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/muffin"),
});

// /datum/crafting_recipe/food/muffin/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_pastry.dm:120)
rt.def("/datum/crafting_recipe/food/muffin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/consumable/milk"), 5, T("/obj/item/weapon/reagent_containers/food/snacks/pastrybase"), 1]));
	return f.dot;
});

rt.type(1710, "/datum/crafting_recipe/food/berrymuffin", "/datum/crafting_recipe/food", {
	name: "Berry muffin",
	subcategory: "Pastries",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/muffin/berry"),
});

// /datum/crafting_recipe/food/berrymuffin/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_pastry.dm:129)
rt.def("/datum/crafting_recipe/food/berrymuffin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/consumable/milk"), 5, T("/obj/item/weapon/reagent_containers/food/snacks/pastrybase"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/berries"), 1]));
	return f.dot;
});

rt.type(1711, "/datum/crafting_recipe/food/booberrymuffin", "/datum/crafting_recipe/food", {
	name: "Booberry muffin",
	subcategory: "Pastries",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/muffin/booberry"),
});

// /datum/crafting_recipe/food/booberrymuffin/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_pastry.dm:139)
rt.def("/datum/crafting_recipe/food/booberrymuffin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/consumable/milk"), 5, T("/obj/item/weapon/reagent_containers/food/snacks/pastrybase"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/berries"), 1, T("/obj/item/weapon/ectoplasm"), 1]));
	return f.dot;
});

rt.type(1712, "/datum/crafting_recipe/food/chawanmushi", "/datum/crafting_recipe/food", {
	name: "Chawanmushi",
	subcategory: "Pastries",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/chawanmushi"),
});

// /datum/crafting_recipe/food/chawanmushi/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_pastry.dm:150)
rt.def("/datum/crafting_recipe/food/chawanmushi/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/water"), 5, T("/datum/reagent/consumable/soysauce"), 5, T("/obj/item/weapon/reagent_containers/food/snacks/boiledegg"), 2, T("/obj/item/weapon/reagent_containers/food/snacks/grown/mushroom/chanterelle"), 1]));
	return f.dot;
});

rt.type(1713, "/datum/crafting_recipe/food/hotdog", "/datum/crafting_recipe/food", {
	name: "Hot dog",
	subcategory: "Pastries",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/hotdog"),
});

// /datum/crafting_recipe/food/hotdog/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_pastry.dm:163)
rt.def("/datum/crafting_recipe/food/hotdog/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/consumable/ketchup"), 5, T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/sausage"), 1]));
	return f.dot;
});

rt.type(1714, "/datum/crafting_recipe/food/meatbun", "/datum/crafting_recipe/food", {
	name: "Meat bun",
	subcategory: "Pastries",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/meatbun"),
});

// /datum/crafting_recipe/food/meatbun/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_pastry.dm:173)
rt.def("/datum/crafting_recipe/food/meatbun/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/consumable/soysauce"), 5, T("/obj/item/weapon/reagent_containers/food/snacks/bun"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/faggot"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/cabbage"), 1]));
	return f.dot;
});

rt.type(1715, "/datum/crafting_recipe/food/khachapuri", "/datum/crafting_recipe/food", {
	name: "Khachapuri",
	subcategory: "Pastries",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/khachapuri"),
});

// /datum/crafting_recipe/food/khachapuri/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_pastry.dm:184)
rt.def("/datum/crafting_recipe/food/khachapuri/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/consumable/eggyolk"), 5, T("/obj/item/weapon/reagent_containers/food/snacks/cheesewedge"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/store/bread/plain"), 1]));
	return f.dot;
});

rt.type(1716, "/datum/crafting_recipe/food/sugarcookie", "/datum/crafting_recipe/food", {
	time: 15,
	name: "Sugar cookie",
	subcategory: "Pastries",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/sugarcookie"),
});

// /datum/crafting_recipe/food/sugarcookie/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_pastry.dm:195)
rt.def("/datum/crafting_recipe/food/sugarcookie/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/consumable/sugar"), 5, T("/obj/item/weapon/reagent_containers/food/snacks/pastrybase"), 1]));
	return f.dot;
});

rt.type(1717, "/datum/crafting_recipe/food/fortunecookie", "/datum/crafting_recipe/food", {
	time: 15,
	name: "Fortune cookie",
	subcategory: "Pastries",
	reqs: null,
	parts: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/fortunecookie"),
});

// /datum/crafting_recipe/food/fortunecookie/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_pastry.dm:205)
rt.def("/datum/crafting_recipe/food/fortunecookie/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/pastrybase"), 1, T("/obj/item/weapon/paper"), 1]));
	$0 = $0;
	rt.setSv(f, "parts", rt.alist(f, [T("/obj/item/weapon/paper"), 1]));
	return f.dot;
});

rt.type(1718, "/datum/crafting_recipe/food/poppypretzel", "/datum/crafting_recipe/food", {
	time: 15,
	name: "Poppy pretzel",
	subcategory: "Pastries",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/poppypretzel"),
});

// /datum/crafting_recipe/food/poppypretzel/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_pastry.dm:218)
rt.def("/datum/crafting_recipe/food/poppypretzel/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/seeds/poppy"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/pastrybase"), 1]));
	return f.dot;
});

rt.type(1719, "/datum/crafting_recipe/food/plumphelmetbiscuit", "/datum/crafting_recipe/food", {
	time: 15,
	name: "Plumphelmet biscuit",
	subcategory: "Pastries",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/plumphelmetbiscuit"),
});

// /datum/crafting_recipe/food/plumphelmetbiscuit/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_pastry.dm:228)
rt.def("/datum/crafting_recipe/food/plumphelmetbiscuit/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/pastrybase"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/mushroom/plumphelmet"), 1]));
	return f.dot;
});

rt.type(1720, "/datum/crafting_recipe/food/cracker", "/datum/crafting_recipe/food", {
	time: 15,
	name: "Cracker",
	subcategory: "Pastries",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/cracker"),
});

// /datum/crafting_recipe/food/cracker/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_pastry.dm:238)
rt.def("/datum/crafting_recipe/food/cracker/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/consumable/sodiumchloride"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/pastrybase"), 1]));
	return f.dot;
});

rt.type(1721, "/datum/crafting_recipe/food/chococornet", "/datum/crafting_recipe/food", {
	name: "Choco cornet",
	subcategory: "Pastries",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/chococornet"),
});

// /datum/crafting_recipe/food/chococornet/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_pastry.dm:247)
rt.def("/datum/crafting_recipe/food/chococornet/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/consumable/sodiumchloride"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/pastrybase"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/chocolatebar"), 1]));
	return f.dot;
});

rt.type(1722, "/datum/crafting_recipe/food/oatmealcookie", "/datum/crafting_recipe/food", {
	name: "Oatmeal cookie",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/oatmealcookie"),
});

// /datum/crafting_recipe/food/oatmealcookie/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_pastry.dm:257)
rt.def("/datum/crafting_recipe/food/oatmealcookie/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/pastrybase"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/oat"), 1]));
	return f.dot;
});

rt.type(1723, "/datum/crafting_recipe/food/raisincookie", "/datum/crafting_recipe/food", {
	name: "Raisin cookie",
	subcategory: "Pastries",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/raisincookie"),
});

// /datum/crafting_recipe/food/raisincookie/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_pastry.dm:265)
rt.def("/datum/crafting_recipe/food/raisincookie/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/no_raisin"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/pastrybase"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/oat"), 1]));
	return f.dot;
});

rt.type(1724, "/datum/crafting_recipe/food/cherrycupcake", "/datum/crafting_recipe/food", {
	name: "Cherry cupcake",
	subcategory: "Pastries",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/cherrycupcake"),
});

// /datum/crafting_recipe/food/cherrycupcake/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_pastry.dm:275)
rt.def("/datum/crafting_recipe/food/cherrycupcake/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/pastrybase"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/cherries"), 1]));
	return f.dot;
});

rt.type(1725, "/datum/crafting_recipe/food/bluecherrycupcake", "/datum/crafting_recipe/food", {
	name: "Blue cherry cupcake",
	subcategory: "Pastries",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/bluecherrycupcake"),
});

// /datum/crafting_recipe/food/bluecherrycupcake/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_pastry.dm:284)
rt.def("/datum/crafting_recipe/food/bluecherrycupcake/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/pastrybase"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/bluecherries"), 1]));
	return f.dot;
});

rt.type(1726, "/datum/crafting_recipe/food/honeybun", "/datum/crafting_recipe/food", {
	name: "Honey bun",
	subcategory: "Pastries",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/honeybun"),
});

// /datum/crafting_recipe/food/honeybun/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_pastry.dm:293)
rt.def("/datum/crafting_recipe/food/honeybun/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/pastrybase"), 1, T("/datum/reagent/consumable/honey"), 5]));
	return f.dot;
});
