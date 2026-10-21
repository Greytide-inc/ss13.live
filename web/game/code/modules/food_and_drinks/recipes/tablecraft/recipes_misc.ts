// From code/modules/food_and_drinks/recipes/tablecraft/recipes_misc.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1666, "/datum/crafting_recipe/food/candiedapple", "/datum/crafting_recipe/food", {
	name: "Candied apple",
	subcategory: "Misc. Food",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/candiedapple"),
});

// /datum/crafting_recipe/food/candiedapple/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_misc.dm:8)
rt.def("/datum/crafting_recipe/food/candiedapple/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/water"), 5, T("/datum/reagent/consumable/sugar"), 5, T("/obj/item/weapon/reagent_containers/food/snacks/grown/apple"), 1]));
	return f.dot;
});

rt.type(1667, "/datum/crafting_recipe/food/chococoin", "/datum/crafting_recipe/food", {
	name: "Choco coin",
	subcategory: "Misc. Food",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/chococoin"),
});

// /datum/crafting_recipe/food/chococoin/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_misc.dm:17)
rt.def("/datum/crafting_recipe/food/chococoin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/coin"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/chocolatebar"), 1]));
	return f.dot;
});

rt.type(1668, "/datum/crafting_recipe/food/fudgedice", "/datum/crafting_recipe/food", {
	name: "Fudge dice",
	subcategory: "Misc. Food",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/fudgedice"),
});

// /datum/crafting_recipe/food/fudgedice/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_misc.dm:26)
rt.def("/datum/crafting_recipe/food/fudgedice/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/dice"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/chocolatebar"), 1]));
	return f.dot;
});

rt.type(1669, "/datum/crafting_recipe/food/chocoorange", "/datum/crafting_recipe/food", {
	name: "Choco orange",
	subcategory: "Misc. Food",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/chocoorange"),
});

// /datum/crafting_recipe/food/chocoorange/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_misc.dm:35)
rt.def("/datum/crafting_recipe/food/chocoorange/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/grown/citrus/orange"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/chocolatebar"), 1]));
	return f.dot;
});

rt.type(1670, "/datum/crafting_recipe/food/loadedbakedpotato", "/datum/crafting_recipe/food", {
	name: "Loaded baked potato",
	time: 40,
	subcategory: "Misc. Food",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/loadedbakedpotato"),
});

// /datum/crafting_recipe/food/loadedbakedpotato/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_misc.dm:45)
rt.def("/datum/crafting_recipe/food/loadedbakedpotato/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/grown/potato"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/cheesewedge"), 1]));
	return f.dot;
});

rt.type(1671, "/datum/crafting_recipe/food/cheesyfries", "/datum/crafting_recipe/food", {
	name: "Cheesy fries",
	subcategory: "Misc. Food",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/cheesyfries"),
});

// /datum/crafting_recipe/food/cheesyfries/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_misc.dm:54)
rt.def("/datum/crafting_recipe/food/cheesyfries/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/fries"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/cheesewedge"), 1]));
	return f.dot;
});

rt.type(1672, "/datum/crafting_recipe/food/wrap", "/datum/crafting_recipe/food", {
	name: "Wrap",
	subcategory: "Misc. Food",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/eggwrap"),
});

// /datum/crafting_recipe/food/wrap/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_misc.dm:63)
rt.def("/datum/crafting_recipe/food/wrap/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/consumable/soysauce"), 10, T("/obj/item/weapon/reagent_containers/food/snacks/friedegg"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/cabbage"), 1]));
	return f.dot;
});

rt.type(1673, "/datum/crafting_recipe/food/beans", "/datum/crafting_recipe/food", {
	name: "Beans",
	time: 40,
	subcategory: "Misc. Food",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/beans"),
});

// /datum/crafting_recipe/food/beans/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_misc.dm:73)
rt.def("/datum/crafting_recipe/food/beans/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/consumable/ketchup"), 5, T("/obj/item/weapon/reagent_containers/food/snacks/grown/soybeans"), 2]));
	return f.dot;
});

rt.type(1674, "/datum/crafting_recipe/food/eggplantparm", "/datum/crafting_recipe/food", {
	name: "Eggplant parmigiana",
	subcategory: "Misc. Food",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/eggplantparm"),
});

// /datum/crafting_recipe/food/eggplantparm/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_misc.dm:81)
rt.def("/datum/crafting_recipe/food/eggplantparm/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/cheesewedge"), 2, T("/obj/item/weapon/reagent_containers/food/snacks/grown/eggplant"), 1]));
	return f.dot;
});

rt.type(1675, "/datum/crafting_recipe/food/baguette", "/datum/crafting_recipe/food", {
	name: "Baguette",
	time: 40,
	subcategory: "Misc. Food",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/baguette"),
});

// /datum/crafting_recipe/food/baguette/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_misc.dm:91)
rt.def("/datum/crafting_recipe/food/baguette/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/consumable/sodiumchloride"), 1, T("/datum/reagent/consumable/blackpepper"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/pastrybase"), 2]));
	return f.dot;
});

rt.type(1676, "/datum/crafting_recipe/food/slimetoast", "/datum/crafting_recipe/food", {
	name: "Slime toast",
	subcategory: "Misc. Food",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/jelliedtoast/slime"),
});

// /datum/crafting_recipe/food/slimetoast/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_misc.dm:102)
rt.def("/datum/crafting_recipe/food/slimetoast/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/toxin/slimejelly"), 5, T("/obj/item/weapon/reagent_containers/food/snacks/breadslice/plain"), 1]));
	return f.dot;
});

rt.type(1677, "/datum/crafting_recipe/food/jelliedyoast", "/datum/crafting_recipe/food", {
	name: "Jellied toast",
	subcategory: "Misc. Food",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/jelliedtoast/cherry"),
});

// /datum/crafting_recipe/food/jelliedyoast/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_misc.dm:111)
rt.def("/datum/crafting_recipe/food/jelliedyoast/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/consumable/cherryjelly"), 5, T("/obj/item/weapon/reagent_containers/food/snacks/breadslice/plain"), 1]));
	return f.dot;
});

rt.type(1678, "/datum/crafting_recipe/food/twobread", "/datum/crafting_recipe/food", {
	name: "Two bread",
	subcategory: "Misc. Food",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/twobread"),
});

// /datum/crafting_recipe/food/twobread/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_misc.dm:120)
rt.def("/datum/crafting_recipe/food/twobread/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/consumable/ethanol/wine"), 5, T("/obj/item/weapon/reagent_containers/food/snacks/breadslice/plain"), 2]));
	return f.dot;
});

rt.type(1679, "/datum/crafting_recipe/food/burrito", "/datum/crafting_recipe/food", {
	name: "Burrito",
	subcategory: "Misc. Food",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/burrito"),
});

// /datum/crafting_recipe/food/burrito/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_misc.dm:129)
rt.def("/datum/crafting_recipe/food/burrito/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/tortilla"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/soybeans"), 2]));
	return f.dot;
});

rt.type(1680, "/datum/crafting_recipe/food/cheesyburrito", "/datum/crafting_recipe/food", {
	name: "Cheesy burrito",
	subcategory: "Misc. Food",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/cheesyburrito"),
});

// /datum/crafting_recipe/food/cheesyburrito/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_misc.dm:138)
rt.def("/datum/crafting_recipe/food/cheesyburrito/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/tortilla"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/cheesewedge"), 2, T("/obj/item/weapon/reagent_containers/food/snacks/grown/soybeans"), 1]));
	return f.dot;
});

rt.type(1681, "/datum/crafting_recipe/food/carneburrito", "/datum/crafting_recipe/food", {
	name: "Carne de asada burrito",
	subcategory: "Misc. Food",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/carneburrito"),
});

// /datum/crafting_recipe/food/carneburrito/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_misc.dm:148)
rt.def("/datum/crafting_recipe/food/carneburrito/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/tortilla"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet"), 2, T("/obj/item/weapon/reagent_containers/food/snacks/grown/soybeans"), 1]));
	return f.dot;
});

rt.type(1682, "/datum/crafting_recipe/food/fuegoburrito", "/datum/crafting_recipe/food", {
	name: "Fuego plasma burrito",
	subcategory: "Misc. Food",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/fuegoburrito"),
});

// /datum/crafting_recipe/food/fuegoburrito/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_misc.dm:158)
rt.def("/datum/crafting_recipe/food/fuegoburrito/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/tortilla"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/ghost_chili"), 2, T("/obj/item/weapon/reagent_containers/food/snacks/grown/soybeans"), 1]));
	return f.dot;
});

rt.type(1683, "/datum/crafting_recipe/food/melonfruitbowl", "/datum/crafting_recipe/food", {
	name: "Melon fruit bowl",
	subcategory: "Misc. Food",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/melonfruitbowl"),
});

// /datum/crafting_recipe/food/melonfruitbowl/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_misc.dm:168)
rt.def("/datum/crafting_recipe/food/melonfruitbowl/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/grown/watermelon"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/apple"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/citrus/orange"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/citrus/lemon"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/banana"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/ambrosia"), 1]));
	return f.dot;
});

rt.type(1684, "/datum/crafting_recipe/food/spacefreezy", "/datum/crafting_recipe/food", {
	name: "Space freezy",
	subcategory: "Misc. Food",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/spacefreezy"),
});

// /datum/crafting_recipe/food/spacefreezy/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_misc.dm:181)
rt.def("/datum/crafting_recipe/food/spacefreezy/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/consumable/bluecherryjelly"), 5, T("/datum/reagent/consumable/spacemountainwind"), 15, T("/obj/item/weapon/reagent_containers/food/snacks/icecream"), 1]));
	return f.dot;
});

rt.type(1685, "/datum/crafting_recipe/food/sundae", "/datum/crafting_recipe/food", {
	name: "Sundae",
	subcategory: "Misc. Food",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/sundae"),
});

// /datum/crafting_recipe/food/sundae/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_misc.dm:191)
rt.def("/datum/crafting_recipe/food/sundae/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/consumable/cream"), 5, T("/obj/item/weapon/reagent_containers/food/snacks/grown/cherries"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/banana"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/icecream"), 1]));
	return f.dot;
});

rt.type(1686, "/datum/crafting_recipe/food/honkdae", "/datum/crafting_recipe/food", {
	name: "Honkdae",
	subcategory: "Misc. Food",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/honkdae"),
});

// /datum/crafting_recipe/food/honkdae/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_misc.dm:202)
rt.def("/datum/crafting_recipe/food/honkdae/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/consumable/cream"), 5, T("/obj/item/clothing/mask/gas/clown_hat"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/cherries"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/banana"), 2, T("/obj/item/weapon/reagent_containers/food/snacks/icecream"), 1]));
	return f.dot;
});

rt.type(1687, "/datum/crafting_recipe/food/nachos", "/datum/crafting_recipe/food", {
	name: "Nachos",
	subcategory: "Misc. Food",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/nachos"),
});

// /datum/crafting_recipe/food/nachos/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_misc.dm:214)
rt.def("/datum/crafting_recipe/food/nachos/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/consumable/sodiumchloride"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/tortilla"), 1]));
	return f.dot;
});

rt.type(1688, "/datum/crafting_recipe/food/cheesynachos", "/datum/crafting_recipe/food", {
	name: "Cheesy nachos",
	subcategory: "Misc. Food",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/cheesynachos"),
});

// /datum/crafting_recipe/food/cheesynachos/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_misc.dm:223)
rt.def("/datum/crafting_recipe/food/cheesynachos/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/consumable/sodiumchloride"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/cheesewedge"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/tortilla"), 1]));
	return f.dot;
});

rt.type(1689, "/datum/crafting_recipe/food/cubannachos", "/datum/crafting_recipe/food", {
	name: "Cuban nachos",
	subcategory: "Misc. Food",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/cubannachos"),
});

// /datum/crafting_recipe/food/cubannachos/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_misc.dm:233)
rt.def("/datum/crafting_recipe/food/cubannachos/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/consumable/ketchup"), 5, T("/obj/item/weapon/reagent_containers/food/snacks/grown/chili"), 2, T("/obj/item/weapon/reagent_containers/food/snacks/tortilla"), 1]));
	return f.dot;
});

rt.type(1690, "/datum/crafting_recipe/food/melonkeg", "/datum/crafting_recipe/food", {
	name: "Melon keg",
	subcategory: "Misc. Food",
	reqs: null,
	parts: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/melonkeg"),
});

// /datum/crafting_recipe/food/melonkeg/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_misc.dm:243)
rt.def("/datum/crafting_recipe/food/melonkeg/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/consumable/ethanol/vodka"), 25, T("/obj/item/weapon/reagent_containers/food/snacks/grown/holymelon"), 1, T("/obj/item/weapon/reagent_containers/food/drinks/bottle/vodka"), 1]));
	$0 = $0;
	rt.setSv(f, "parts", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/drinks/bottle/vodka"), 1]));
	return f.dot;
});

rt.type(1691, "/datum/crafting_recipe/food/honeybar", "/datum/crafting_recipe/food", {
	name: "Honey nut bar",
	subcategory: "Misc. Food",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/honeybar"),
});

// /datum/crafting_recipe/food/honeybar/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_misc.dm:254)
rt.def("/datum/crafting_recipe/food/honeybar/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/grown/oat"), 1, T("/datum/reagent/consumable/honey"), 5]));
	return f.dot;
});

rt.type(1692, "/datum/crafting_recipe/food/stuffedlegion", "/datum/crafting_recipe/food", {
	name: "Stuffed legion",
	time: 40,
	subcategory: "Misc. Food",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/stuffedlegion"),
});

// /datum/crafting_recipe/food/stuffedlegion/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_misc.dm:265)
rt.def("/datum/crafting_recipe/food/stuffedlegion/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/steak/goliath"), 1, T("/obj/item/organ/regenerative_core/legion"), 1, T("/datum/reagent/consumable/ketchup"), 2, T("/datum/reagent/consumable/capsaicin"), 2]));
	return f.dot;
});

rt.type(1693, "/datum/crafting_recipe/food/lizardwine", "/datum/crafting_recipe/food", {
	name: "Lizard wine",
	time: 40,
	subcategory: "Misc. Food",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/drinks/bottle/lizardwine"),
});

// /datum/crafting_recipe/food/lizardwine/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_misc.dm:278)
rt.def("/datum/crafting_recipe/food/lizardwine/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/severedtail"), 1, T("/datum/reagent/consumable/ethanol"), 100]));
	return f.dot;
});

rt.type(1694, "/datum/crafting_recipe/food/powercrepe", "/datum/crafting_recipe/food", {
	name: "Powercrepe",
	time: 40,
	subcategory: "Misc. Food",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/powercrepe"),
});

// /datum/crafting_recipe/food/powercrepe/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_misc.dm:289)
rt.def("/datum/crafting_recipe/food/powercrepe/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/flatdough"), 1, T("/datum/reagent/consumable/milk"), 1, T("/datum/reagent/consumable/cherryjelly"), 5, T("/obj/item/weapon/stock_parts/cell/super"), 1, T("/obj/item/weapon/melee/sabre"), 1]));
	return f.dot;
});

rt.type(1695, "/datum/crafting_recipe/food/taco", "/datum/crafting_recipe/food", {
	name: "Classic Taco",
	subcategory: "Misc. Food",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/taco"),
});

// /datum/crafting_recipe/food/taco/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_misc.dm:301)
rt.def("/datum/crafting_recipe/food/taco/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/tortilla"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/cheesewedge"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/cabbage"), 1]));
	return f.dot;
});

rt.type(1696, "/datum/crafting_recipe/food/tacoplain", "/datum/crafting_recipe/food", {
	name: "Plain Taco",
	subcategory: "Misc. Food",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/taco/plain"),
});

// /datum/crafting_recipe/food/tacoplain/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_misc.dm:312)
rt.def("/datum/crafting_recipe/food/tacoplain/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/tortilla"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/cheesewedge"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet"), 1]));
	return f.dot;
});

rt.type(1697, "/datum/crafting_recipe/food/branrequests", "/datum/crafting_recipe/food", {
	name: "Bran Requests Cereal",
	subcategory: "Misc. Food",
	reqs: null,
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/branrequests"),
});

// /datum/crafting_recipe/food/branrequests/proc/<init>  (code/modules/food_and_drinks/recipes/tablecraft/recipes_misc.dm:322)
rt.def("/datum/crafting_recipe/food/branrequests/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/grown/wheat"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/no_raisin"), 1]));
	return f.dot;
});
