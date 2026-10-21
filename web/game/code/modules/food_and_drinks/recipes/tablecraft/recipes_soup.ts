// From code/modules/food_and_drinks/recipes/tablecraft/recipes_soup.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1767, "/datum/crafting_recipe/food/meatballsoup", "/datum/crafting_recipe/food", {
	name: "Meatball soup",
	subcategory: "Soups",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/soup/meatball"),
});

// /datum/crafting_recipe/food/meatballsoup/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_soup.dm:8)
rt.def("/datum/crafting_recipe/food/meatballsoup/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/water"), 10, T("/obj/item/weapon/reagent_containers/glass/bowl"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/faggot"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/carrot"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/potato"), 1]));
	return f.dot;
});

rt.type(1768, "/datum/crafting_recipe/food/vegetablesoup", "/datum/crafting_recipe/food", {
	name: "Vegetable soup",
	subcategory: "Soups",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/soup/vegetable"),
});

// /datum/crafting_recipe/food/vegetablesoup/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_soup.dm:20)
rt.def("/datum/crafting_recipe/food/vegetablesoup/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/water"), 10, T("/obj/item/weapon/reagent_containers/glass/bowl"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/carrot"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/corn"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/eggplant"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/potato"), 1]));
	return f.dot;
});

rt.type(1769, "/datum/crafting_recipe/food/nettlesoup", "/datum/crafting_recipe/food", {
	name: "Nettle soup",
	subcategory: "Soups",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/soup/nettle"),
});

// /datum/crafting_recipe/food/nettlesoup/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_soup.dm:33)
rt.def("/datum/crafting_recipe/food/nettlesoup/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/water"), 10, T("/obj/item/weapon/reagent_containers/glass/bowl"), 1, T("/obj/item/weapon/grown/nettle"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/potato"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/boiledegg"), 1]));
	return f.dot;
});

rt.type(1770, "/datum/crafting_recipe/food/wingfangchu", "/datum/crafting_recipe/food", {
	name: "Wingfangchu",
	subcategory: "Soups",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/soup/wingfangchu"),
});

// /datum/crafting_recipe/food/wingfangchu/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_soup.dm:45)
rt.def("/datum/crafting_recipe/food/wingfangchu/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/glass/bowl"), 1, T("/datum/reagent/consumable/soysauce"), 5, T("/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet/xeno"), 2]));
	return f.dot;
});

rt.type(1771, "/datum/crafting_recipe/food/wishsoup", "/datum/crafting_recipe/food", {
	name: "Wish soup",
	subcategory: "Soups",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/soup/wish"),
});

// /datum/crafting_recipe/food/wishsoup/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_soup.dm:55)
rt.def("/datum/crafting_recipe/food/wishsoup/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/water"), 20, T("/obj/item/weapon/reagent_containers/glass/bowl"), 1]));
	return f.dot;
});

rt.type(1772, "/datum/crafting_recipe/food/hotchili", "/datum/crafting_recipe/food", {
	name: "Hot chili",
	subcategory: "Soups",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/soup/hotchili"),
});

// /datum/crafting_recipe/food/hotchili/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_soup.dm:64)
rt.def("/datum/crafting_recipe/food/hotchili/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/glass/bowl"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet"), 2, T("/obj/item/weapon/reagent_containers/food/snacks/grown/chili"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/tomato"), 1]));
	return f.dot;
});

rt.type(1773, "/datum/crafting_recipe/food/coldchili", "/datum/crafting_recipe/food", {
	name: "Cold chili",
	subcategory: "Soups",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/soup/coldchili"),
});

// /datum/crafting_recipe/food/coldchili/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_soup.dm:75)
rt.def("/datum/crafting_recipe/food/coldchili/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/glass/bowl"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet"), 2, T("/obj/item/weapon/reagent_containers/food/snacks/grown/icepepper"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/tomato"), 1]));
	return f.dot;
});

rt.type(1774, "/datum/crafting_recipe/food/tomatosoup", "/datum/crafting_recipe/food", {
	name: "Tomato soup",
	subcategory: "Soups",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/soup/tomato"),
});

// /datum/crafting_recipe/food/tomatosoup/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_soup.dm:86)
rt.def("/datum/crafting_recipe/food/tomatosoup/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/water"), 10, T("/obj/item/weapon/reagent_containers/glass/bowl"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/tomato"), 2]));
	return f.dot;
});

rt.type(1775, "/datum/crafting_recipe/food/eyeballsoup", "/datum/crafting_recipe/food", {
	name: "Eyeball soup",
	subcategory: "Soups",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/soup/tomato/eyeball"),
});

// /datum/crafting_recipe/food/eyeballsoup/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_soup.dm:96)
rt.def("/datum/crafting_recipe/food/eyeballsoup/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/water"), 10, T("/obj/item/weapon/reagent_containers/glass/bowl"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/tomato"), 2, T("/obj/item/organ/eyes"), 1]));
	return f.dot;
});

rt.type(1776, "/datum/crafting_recipe/food/milosoup", "/datum/crafting_recipe/food", {
	name: "Milo soup",
	subcategory: "Soups",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/soup/milo"),
});

// /datum/crafting_recipe/food/milosoup/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_soup.dm:108)
rt.def("/datum/crafting_recipe/food/milosoup/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/water"), 10, T("/obj/item/weapon/reagent_containers/glass/bowl"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/soydope"), 2, T("/obj/item/weapon/reagent_containers/food/snacks/tofu"), 2]));
	return f.dot;
});

rt.type(1777, "/datum/crafting_recipe/food/bloodsoup", "/datum/crafting_recipe/food", {
	name: "Blood soup",
	subcategory: "Soups",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/soup/blood"),
});

// /datum/crafting_recipe/food/bloodsoup/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_soup.dm:119)
rt.def("/datum/crafting_recipe/food/bloodsoup/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/blood"), 10, T("/obj/item/weapon/reagent_containers/glass/bowl"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/tomato/blood"), 2]));
	return f.dot;
});

rt.type(1778, "/datum/crafting_recipe/food/slimesoup", "/datum/crafting_recipe/food", {
	name: "Slime soup",
	subcategory: "Soups",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/soup/slime"),
});

// /datum/crafting_recipe/food/slimesoup/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_soup.dm:129)
rt.def("/datum/crafting_recipe/food/slimesoup/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/water"), 10, T("/datum/reagent/toxin/slimejelly"), 5, T("/obj/item/weapon/reagent_containers/glass/bowl"), 1]));
	return f.dot;
});

rt.type(1779, "/datum/crafting_recipe/food/clownstears", "/datum/crafting_recipe/food", {
	name: "Clowns tears",
	subcategory: "Soups",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/soup/clownstears"),
});

// /datum/crafting_recipe/food/clownstears/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_soup.dm:139)
rt.def("/datum/crafting_recipe/food/clownstears/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/water"), 10, T("/obj/item/weapon/reagent_containers/glass/bowl"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/banana"), 1, T("/obj/item/weapon/ore/bananium"), 1]));
	return f.dot;
});

rt.type(1780, "/datum/crafting_recipe/food/mysterysoup", "/datum/crafting_recipe/food", {
	name: "Mystery soup",
	subcategory: "Soups",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/soup/mystery"),
});

// /datum/crafting_recipe/food/mysterysoup/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_soup.dm:150)
rt.def("/datum/crafting_recipe/food/mysterysoup/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/water"), 10, T("/obj/item/weapon/reagent_containers/glass/bowl"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/badrecipe"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/tofu"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/boiledegg"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/cheesewedge"), 1]));
	return f.dot;
});

rt.type(1781, "/datum/crafting_recipe/food/mushroomsoup", "/datum/crafting_recipe/food", {
	name: "Mushroom soup",
	subcategory: "Soups",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/soup/mushroom"),
});

// /datum/crafting_recipe/food/mushroomsoup/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_soup.dm:163)
rt.def("/datum/crafting_recipe/food/mushroomsoup/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/consumable/milk"), 5, T("/datum/reagent/water"), 5, T("/obj/item/weapon/reagent_containers/glass/bowl"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/mushroom/chanterelle"), 1]));
	return f.dot;
});

rt.type(1782, "/datum/crafting_recipe/food/beetsoup", "/datum/crafting_recipe/food", {
	name: "Beet soup",
	subcategory: "Soups",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/soup/beet"),
});

// /datum/crafting_recipe/food/beetsoup/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_soup.dm:174)
rt.def("/datum/crafting_recipe/food/beetsoup/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/water"), 10, T("/obj/item/weapon/reagent_containers/glass/bowl"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/whitebeet"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/cabbage"), 1]));
	return f.dot;
});

rt.type(1783, "/datum/crafting_recipe/food/stew", "/datum/crafting_recipe/food", {
	name: "Stew",
	subcategory: "Soups",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/soup/stew"),
});

// /datum/crafting_recipe/food/stew/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_soup.dm:185)
rt.def("/datum/crafting_recipe/food/stew/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/water"), 10, T("/obj/item/weapon/reagent_containers/glass/bowl"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/tomato"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet"), 3, T("/obj/item/weapon/reagent_containers/food/snacks/grown/potato"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/carrot"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/eggplant"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/mushroom"), 1]));
	return f.dot;
});

rt.type(1784, "/datum/crafting_recipe/food/spacylibertyduff", "/datum/crafting_recipe/food", {
	name: "Spacy liberty duff",
	subcategory: "Soups",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/soup/spacylibertyduff"),
});

// /datum/crafting_recipe/food/spacylibertyduff/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_soup.dm:200)
rt.def("/datum/crafting_recipe/food/spacylibertyduff/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/consumable/ethanol/vodka"), 5, T("/obj/item/weapon/reagent_containers/glass/bowl"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/mushroom/libertycap"), 3]));
	return f.dot;
});

rt.type(1785, "/datum/crafting_recipe/food/amanitajelly", "/datum/crafting_recipe/food", {
	name: "Amanita jelly",
	subcategory: "Soups",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/soup/amanitajelly"),
});

// /datum/crafting_recipe/food/amanitajelly/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_soup.dm:210)
rt.def("/datum/crafting_recipe/food/amanitajelly/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/consumable/ethanol/vodka"), 5, T("/obj/item/weapon/reagent_containers/glass/bowl"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/mushroom/amanita"), 3]));
	return f.dot;
});

rt.type(1786, "/datum/crafting_recipe/food/sweetpotatosoup", "/datum/crafting_recipe/food", {
	name: "Sweet potato soup",
	subcategory: "Soups",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/soup/sweetpotato"),
});

// /datum/crafting_recipe/food/sweetpotatosoup/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_soup.dm:220)
rt.def("/datum/crafting_recipe/food/sweetpotatosoup/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/water"), 10, T("/datum/reagent/consumable/sugar"), 5, T("/obj/item/weapon/reagent_containers/glass/bowl"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/potato/sweet"), 2]));
	return f.dot;
});

rt.type(1787, "/datum/crafting_recipe/food/redbeetsoup", "/datum/crafting_recipe/food", {
	name: "Red beet soup",
	subcategory: "Soups",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/soup/beet/red"),
});

// /datum/crafting_recipe/food/redbeetsoup/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_soup.dm:231)
rt.def("/datum/crafting_recipe/food/redbeetsoup/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/water"), 10, T("/obj/item/weapon/reagent_containers/glass/bowl"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/redbeet"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/cabbage"), 1]));
	return f.dot;
});
