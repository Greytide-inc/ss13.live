// From code/modules/food_and_drinks/recipes/drinks_recipes.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(2331, "/datum/chemical_reaction/goldschlager", "/datum/chemical_reaction", {
	name: "Goldschlager",
	id: "goldschlager",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/goldschlager/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:7)
rt.def("/datum/chemical_reaction/goldschlager/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["goldschlager", 10]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["vodka", 10, "gold", 1]));
	return f.dot;
});

rt.type(2332, "/datum/chemical_reaction/patron", "/datum/chemical_reaction", {
	name: "Patron",
	id: "patron",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/patron/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:13)
rt.def("/datum/chemical_reaction/patron/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["patron", 10]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["tequila", 10, "silver", 1]));
	return f.dot;
});

rt.type(2333, "/datum/chemical_reaction/bilk", "/datum/chemical_reaction", {
	name: "Bilk",
	id: "bilk",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/bilk/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:19)
rt.def("/datum/chemical_reaction/bilk/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["bilk", 2]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["milk", 1, "beer", 1]));
	return f.dot;
});

rt.type(2334, "/datum/chemical_reaction/icetea", "/datum/chemical_reaction", {
	name: "Iced Tea",
	id: "icetea",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/icetea/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:25)
rt.def("/datum/chemical_reaction/icetea/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["icetea", 4]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["ice", 1, "tea", 3]));
	return f.dot;
});

rt.type(2335, "/datum/chemical_reaction/icecoffee", "/datum/chemical_reaction", {
	name: "Iced Coffee",
	id: "icecoffee",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/icecoffee/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:31)
rt.def("/datum/chemical_reaction/icecoffee/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["icecoffee", 4]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["ice", 1, "coffee", 3]));
	return f.dot;
});

rt.type(2336, "/datum/chemical_reaction/nuka_cola", "/datum/chemical_reaction", {
	name: "Nuka Cola",
	id: "nuka_cola",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/nuka_cola/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:37)
rt.def("/datum/chemical_reaction/nuka_cola/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["nuka_cola", 6]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["uranium", 1, "cola", 6]));
	return f.dot;
});

rt.type(2337, "/datum/chemical_reaction/moonshine", "/datum/chemical_reaction", {
	name: "Moonshine",
	id: "moonshine",
	results: null,
	required_reagents: null,
	required_catalysts: null,
});

// /datum/chemical_reaction/moonshine/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:43)
rt.def("/datum/chemical_reaction/moonshine/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["moonshine", 10]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["nutriment", 5, "sugar", 5]));
	rt.setSv(f, "required_catalysts", rt.alist(f, ["enzyme", 5]));
	return f.dot;
});

rt.type(2338, "/datum/chemical_reaction/wine", "/datum/chemical_reaction", {
	name: "Wine",
	id: "wine",
	results: null,
	required_reagents: null,
	required_catalysts: null,
});

// /datum/chemical_reaction/wine/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:50)
rt.def("/datum/chemical_reaction/wine/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["wine", 10]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["grapejuice", 10]));
	rt.setSv(f, "required_catalysts", rt.alist(f, ["enzyme", 5]));
	return f.dot;
});

rt.type(2339, "/datum/chemical_reaction/spacebeer", "/datum/chemical_reaction", {
	name: "Space Beer",
	id: "spacebeer",
	results: null,
	required_reagents: null,
	required_catalysts: null,
});

// /datum/chemical_reaction/spacebeer/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:57)
rt.def("/datum/chemical_reaction/spacebeer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["beer", 10]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["flour", 10]));
	rt.setSv(f, "required_catalysts", rt.alist(f, ["enzyme", 5]));
	return f.dot;
});

rt.type(2340, "/datum/chemical_reaction/vodka", "/datum/chemical_reaction", {
	name: "Vodka",
	id: "vodka",
	results: null,
	required_reagents: null,
	required_catalysts: null,
});

// /datum/chemical_reaction/vodka/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:64)
rt.def("/datum/chemical_reaction/vodka/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["vodka", 10]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["potato", 10]));
	rt.setSv(f, "required_catalysts", rt.alist(f, ["enzyme", 5]));
	return f.dot;
});

rt.type(2341, "/datum/chemical_reaction/kahlua", "/datum/chemical_reaction", {
	name: "Kahlua",
	id: "kahlua",
	results: null,
	required_reagents: null,
	required_catalysts: null,
});

// /datum/chemical_reaction/kahlua/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:71)
rt.def("/datum/chemical_reaction/kahlua/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["kahlua", 5]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["coffee", 5, "sugar", 5]));
	rt.setSv(f, "required_catalysts", rt.alist(f, ["enzyme", 5]));
	return f.dot;
});

rt.type(2342, "/datum/chemical_reaction/gin_tonic", "/datum/chemical_reaction", {
	name: "Gin and Tonic",
	id: "gintonic",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/gin_tonic/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:78)
rt.def("/datum/chemical_reaction/gin_tonic/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["gintonic", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["gin", 2, "tonic", 1]));
	return f.dot;
});

rt.type(2343, "/datum/chemical_reaction/cuba_libre", "/datum/chemical_reaction", {
	name: "Cuba Libre",
	id: "cubalibre",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/cuba_libre/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:84)
rt.def("/datum/chemical_reaction/cuba_libre/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["cubalibre", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["rum", 2, "cola", 1]));
	return f.dot;
});

rt.type(2344, "/datum/chemical_reaction/martini", "/datum/chemical_reaction", {
	name: "Classic Martini",
	id: "martini",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/martini/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:90)
rt.def("/datum/chemical_reaction/martini/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["martini", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["gin", 2, "vermouth", 1]));
	return f.dot;
});

rt.type(2345, "/datum/chemical_reaction/vodkamartini", "/datum/chemical_reaction", {
	name: "Vodka Martini",
	id: "vodkamartini",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/vodkamartini/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:96)
rt.def("/datum/chemical_reaction/vodkamartini/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["vodkamartini", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["vodka", 2, "vermouth", 1]));
	return f.dot;
});

rt.type(2346, "/datum/chemical_reaction/white_russian", "/datum/chemical_reaction", {
	name: "White Russian",
	id: "whiterussian",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/white_russian/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:102)
rt.def("/datum/chemical_reaction/white_russian/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["whiterussian", 5]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["blackrussian", 3, "cream", 2]));
	return f.dot;
});

rt.type(2347, "/datum/chemical_reaction/whiskey_cola", "/datum/chemical_reaction", {
	name: "Whiskey Cola",
	id: "whiskeycola",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/whiskey_cola/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:108)
rt.def("/datum/chemical_reaction/whiskey_cola/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["whiskeycola", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["whiskey", 2, "cola", 1]));
	return f.dot;
});

rt.type(2348, "/datum/chemical_reaction/screwdriver", "/datum/chemical_reaction", {
	name: "Screwdriver",
	id: "screwdrivercocktail",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/screwdriver/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:114)
rt.def("/datum/chemical_reaction/screwdriver/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["screwdrivercocktail", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["vodka", 2, "orangejuice", 1]));
	return f.dot;
});

rt.type(2349, "/datum/chemical_reaction/bloody_mary", "/datum/chemical_reaction", {
	name: "Bloody Mary",
	id: "bloodymary",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/bloody_mary/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:120)
rt.def("/datum/chemical_reaction/bloody_mary/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["bloodymary", 4]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["vodka", 1, "tomatojuice", 2, "limejuice", 1]));
	return f.dot;
});

rt.type(2350, "/datum/chemical_reaction/gargle_blaster", "/datum/chemical_reaction", {
	name: "Pan-Galactic Gargle Blaster",
	id: "gargleblaster",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/gargle_blaster/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:126)
rt.def("/datum/chemical_reaction/gargle_blaster/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["gargleblaster", 5]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["vodka", 1, "gin", 1, "whiskey", 1, "cognac", 1, "limejuice", 1]));
	return f.dot;
});

rt.type(2351, "/datum/chemical_reaction/brave_bull", "/datum/chemical_reaction", {
	name: "Brave Bull",
	id: "bravebull",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/brave_bull/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:132)
rt.def("/datum/chemical_reaction/brave_bull/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["bravebull", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["tequila", 2, "kahlua", 1]));
	return f.dot;
});

rt.type(2352, "/datum/chemical_reaction/tequila_sunrise", "/datum/chemical_reaction", {
	name: "tequila Sunrise",
	id: "tequilasunrise",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/tequila_sunrise/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:138)
rt.def("/datum/chemical_reaction/tequila_sunrise/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["tequilasunrise", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["tequila", 2, "orangejuice", 1]));
	return f.dot;
});

rt.type(2353, "/datum/chemical_reaction/toxins_special", "/datum/chemical_reaction", {
	name: "Toxins Special",
	id: "toxinsspecial",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/toxins_special/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:144)
rt.def("/datum/chemical_reaction/toxins_special/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["toxinsspecial", 5]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["rum", 2, "vermouth", 1, "plasma", 2]));
	return f.dot;
});

rt.type(2354, "/datum/chemical_reaction/beepsky_smash", "/datum/chemical_reaction", {
	name: "Beepksy Smash",
	id: "beepksysmash",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/beepsky_smash/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:150)
rt.def("/datum/chemical_reaction/beepsky_smash/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["beepskysmash", 4]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["limejuice", 2, "whiskey", 2, "iron", 1]));
	return f.dot;
});

rt.type(2355, "/datum/chemical_reaction/doctor_delight", "/datum/chemical_reaction", {
	name: "The Doctor's Delight",
	id: "doctordelight",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/doctor_delight/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:156)
rt.def("/datum/chemical_reaction/doctor_delight/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["doctorsdelight", 5]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["limejuice", 1, "tomatojuice", 1, "orangejuice", 1, "cream", 1, "cryoxadone", 1]));
	return f.dot;
});

rt.type(2356, "/datum/chemical_reaction/irish_cream", "/datum/chemical_reaction", {
	name: "Irish Cream",
	id: "irishcream",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/irish_cream/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:162)
rt.def("/datum/chemical_reaction/irish_cream/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["irishcream", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["whiskey", 2, "cream", 1]));
	return f.dot;
});

rt.type(2357, "/datum/chemical_reaction/manly_dorf", "/datum/chemical_reaction", {
	name: "The Manly Dorf",
	id: "manlydorf",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/manly_dorf/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:168)
rt.def("/datum/chemical_reaction/manly_dorf/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["manlydorf", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["beer", 1, "ale", 2]));
	return f.dot;
});

rt.type(2358, "/datum/chemical_reaction/greenbeer", "/datum/chemical_reaction", {
	name: "Green Beer",
	id: "greenbeer",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/greenbeer/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:174)
rt.def("/datum/chemical_reaction/greenbeer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["greenbeer", 10]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["greencrayonpowder", 1, "beer", 10]));
	return f.dot;
});

rt.type(2359, "/datum/chemical_reaction/hooch", "/datum/chemical_reaction", {
	name: "Hooch",
	id: "hooch",
	results: null,
	required_reagents: null,
	required_catalysts: null,
});

// /datum/chemical_reaction/hooch/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:180)
rt.def("/datum/chemical_reaction/hooch/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["hooch", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["ethanol", 2, "welding_fuel", 1]));
	rt.setSv(f, "required_catalysts", rt.alist(f, ["enzyme", 1]));
	return f.dot;
});

rt.type(2360, "/datum/chemical_reaction/irish_coffee", "/datum/chemical_reaction", {
	name: "Irish Coffee",
	id: "irishcoffee",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/irish_coffee/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:187)
rt.def("/datum/chemical_reaction/irish_coffee/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["irishcoffee", 2]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["irishcream", 1, "coffee", 1]));
	return f.dot;
});

rt.type(2361, "/datum/chemical_reaction/b52", "/datum/chemical_reaction", {
	name: "B-52",
	id: "b52",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/b52/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:193)
rt.def("/datum/chemical_reaction/b52/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["b52", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["irishcream", 1, "kahlua", 1, "cognac", 1]));
	return f.dot;
});

rt.type(2362, "/datum/chemical_reaction/atomicbomb", "/datum/chemical_reaction", {
	name: "Atomic Bomb",
	id: "atomicbomb",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/atomicbomb/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:199)
rt.def("/datum/chemical_reaction/atomicbomb/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["atomicbomb", 10]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["b52", 10, "uranium", 1]));
	return f.dot;
});

rt.type(2363, "/datum/chemical_reaction/margarita", "/datum/chemical_reaction", {
	name: "Margarita",
	id: "margarita",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/margarita/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:205)
rt.def("/datum/chemical_reaction/margarita/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["margarita", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["tequila", 2, "limejuice", 1]));
	return f.dot;
});

rt.type(2364, "/datum/chemical_reaction/longislandicedtea", "/datum/chemical_reaction", {
	name: "Long Island Iced Tea",
	id: "longislandicedtea",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/longislandicedtea/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:211)
rt.def("/datum/chemical_reaction/longislandicedtea/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["longislandicedtea", 4]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["vodka", 1, "gin", 1, "tequila", 1, "cubalibre", 1]));
	return f.dot;
});

rt.type(2365, "/datum/chemical_reaction/threemileisland", "/datum/chemical_reaction", {
	name: "Three Mile Island Iced Tea",
	id: "threemileisland",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/threemileisland/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:217)
rt.def("/datum/chemical_reaction/threemileisland/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["threemileisland", 10]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["longislandicedtea", 10, "uranium", 1]));
	return f.dot;
});

rt.type(2366, "/datum/chemical_reaction/whiskeysoda", "/datum/chemical_reaction", {
	name: "Whiskey Soda",
	id: "whiskeysoda",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/whiskeysoda/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:223)
rt.def("/datum/chemical_reaction/whiskeysoda/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["whiskeysoda", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["whiskey", 2, "sodawater", 1]));
	return f.dot;
});

rt.type(2367, "/datum/chemical_reaction/black_russian", "/datum/chemical_reaction", {
	name: "Black Russian",
	id: "blackrussian",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/black_russian/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:229)
rt.def("/datum/chemical_reaction/black_russian/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["blackrussian", 5]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["vodka", 3, "kahlua", 2]));
	return f.dot;
});

rt.type(2368, "/datum/chemical_reaction/manhattan", "/datum/chemical_reaction", {
	name: "Manhattan",
	id: "manhattan",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/manhattan/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:235)
rt.def("/datum/chemical_reaction/manhattan/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["manhattan", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["whiskey", 2, "vermouth", 1]));
	return f.dot;
});

rt.type(2369, "/datum/chemical_reaction/manhattan_proj", "/datum/chemical_reaction", {
	name: "Manhattan Project",
	id: "manhattan_proj",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/manhattan_proj/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:241)
rt.def("/datum/chemical_reaction/manhattan_proj/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["manhattan_proj", 10]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["manhattan", 10, "uranium", 1]));
	return f.dot;
});

rt.type(2370, "/datum/chemical_reaction/vodka_tonic", "/datum/chemical_reaction", {
	name: "Vodka and Tonic",
	id: "vodkatonic",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/vodka_tonic/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:247)
rt.def("/datum/chemical_reaction/vodka_tonic/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["vodkatonic", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["vodka", 2, "tonic", 1]));
	return f.dot;
});

rt.type(2371, "/datum/chemical_reaction/gin_fizz", "/datum/chemical_reaction", {
	name: "Gin Fizz",
	id: "ginfizz",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/gin_fizz/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:253)
rt.def("/datum/chemical_reaction/gin_fizz/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["ginfizz", 4]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["gin", 2, "sodawater", 1, "limejuice", 1]));
	return f.dot;
});

rt.type(2372, "/datum/chemical_reaction/bahama_mama", "/datum/chemical_reaction", {
	name: "Bahama mama",
	id: "bahama_mama",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/bahama_mama/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:259)
rt.def("/datum/chemical_reaction/bahama_mama/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["bahama_mama", 6]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["rum", 2, "orangejuice", 2, "limejuice", 1, "ice", 1]));
	return f.dot;
});

rt.type(2373, "/datum/chemical_reaction/singulo", "/datum/chemical_reaction", {
	name: "Singulo",
	id: "singulo",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/singulo/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:265)
rt.def("/datum/chemical_reaction/singulo/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["singulo", 10]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["vodka", 5, "radium", 1, "wine", 5]));
	return f.dot;
});

rt.type(2374, "/datum/chemical_reaction/alliescocktail", "/datum/chemical_reaction", {
	name: "Allies Cocktail",
	id: "alliescocktail",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/alliescocktail/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:271)
rt.def("/datum/chemical_reaction/alliescocktail/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["alliescocktail", 2]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["martini", 1, "vodka", 1]));
	return f.dot;
});

rt.type(2375, "/datum/chemical_reaction/demonsblood", "/datum/chemical_reaction", {
	name: "Demons Blood",
	id: "demonsblood",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/demonsblood/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:277)
rt.def("/datum/chemical_reaction/demonsblood/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["demonsblood", 4]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["rum", 1, "spacemountainwind", 1, "blood", 1, "dr_gibb", 1]));
	return f.dot;
});

rt.type(2376, "/datum/chemical_reaction/booger", "/datum/chemical_reaction", {
	name: "Booger",
	id: "booger",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/booger/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:283)
rt.def("/datum/chemical_reaction/booger/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["booger", 4]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["cream", 1, "banana", 1, "rum", 1, "watermelonjuice", 1]));
	return f.dot;
});

rt.type(2377, "/datum/chemical_reaction/antifreeze", "/datum/chemical_reaction", {
	name: "Anti-freeze",
	id: "antifreeze",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/antifreeze/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:289)
rt.def("/datum/chemical_reaction/antifreeze/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["antifreeze", 4]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["vodka", 2, "cream", 1, "ice", 1]));
	return f.dot;
});

rt.type(2378, "/datum/chemical_reaction/barefoot", "/datum/chemical_reaction", {
	name: "Barefoot",
	id: "barefoot",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/barefoot/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:295)
rt.def("/datum/chemical_reaction/barefoot/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["barefoot", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["berryjuice", 1, "cream", 1, "vermouth", 1]));
	return f.dot;
});

rt.type(2379, "/datum/chemical_reaction/sbiten", "/datum/chemical_reaction", {
	name: "Sbiten",
	id: "sbiten",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/sbiten/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:304)
rt.def("/datum/chemical_reaction/sbiten/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["sbiten", 10]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["vodka", 10, "capsaicin", 1]));
	return f.dot;
});

rt.type(2380, "/datum/chemical_reaction/red_mead", "/datum/chemical_reaction", {
	name: "Red Mead",
	id: "red_mead",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/red_mead/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:310)
rt.def("/datum/chemical_reaction/red_mead/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["red_mead", 2]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["blood", 1, "mead", 1]));
	return f.dot;
});

rt.type(2381, "/datum/chemical_reaction/mead", "/datum/chemical_reaction", {
	name: "Mead",
	id: "mead",
	results: null,
	required_reagents: null,
	required_catalysts: null,
});

// /datum/chemical_reaction/mead/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:316)
rt.def("/datum/chemical_reaction/mead/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["mead", 2]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["honey", 2]));
	rt.setSv(f, "required_catalysts", rt.alist(f, ["enzyme", 5]));
	return f.dot;
});

rt.type(2382, "/datum/chemical_reaction/iced_beer", "/datum/chemical_reaction", {
	name: "Iced Beer",
	id: "iced_beer",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/iced_beer/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:323)
rt.def("/datum/chemical_reaction/iced_beer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["iced_beer", 6]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["beer", 5, "ice", 1]));
	return f.dot;
});

rt.type(2383, "/datum/chemical_reaction/grog", "/datum/chemical_reaction", {
	name: "Grog",
	id: "grog",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/grog/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:329)
rt.def("/datum/chemical_reaction/grog/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["grog", 2]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["rum", 1, "water", 1]));
	return f.dot;
});

rt.type(2384, "/datum/chemical_reaction/soy_latte", "/datum/chemical_reaction", {
	name: "Soy Latte",
	id: "soy_latte",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/soy_latte/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:335)
rt.def("/datum/chemical_reaction/soy_latte/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["soy_latte", 2]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["coffee", 1, "soymilk", 1]));
	return f.dot;
});

rt.type(2385, "/datum/chemical_reaction/cafe_latte", "/datum/chemical_reaction", {
	name: "Cafe Latte",
	id: "cafe_latte",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/cafe_latte/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:341)
rt.def("/datum/chemical_reaction/cafe_latte/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["cafe_latte", 2]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["coffee", 1, "milk", 1]));
	return f.dot;
});

rt.type(2386, "/datum/chemical_reaction/acidspit", "/datum/chemical_reaction", {
	name: "Acid Spit",
	id: "acidspit",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/acidspit/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:347)
rt.def("/datum/chemical_reaction/acidspit/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["acidspit", 6]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["sacid", 1, "wine", 5]));
	return f.dot;
});

rt.type(2387, "/datum/chemical_reaction/amasec", "/datum/chemical_reaction", {
	name: "Amasec",
	id: "amasec",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/amasec/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:353)
rt.def("/datum/chemical_reaction/amasec/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["amasec", 10]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["iron", 1, "wine", 5, "vodka", 5]));
	return f.dot;
});

rt.type(2388, "/datum/chemical_reaction/changelingsting", "/datum/chemical_reaction", {
	name: "Changeling Sting",
	id: "changelingsting",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/changelingsting/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:359)
rt.def("/datum/chemical_reaction/changelingsting/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["changelingsting", 5]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["screwdrivercocktail", 1, "lemon_lime", 2]));
	return f.dot;
});

rt.type(2389, "/datum/chemical_reaction/aloe", "/datum/chemical_reaction", {
	name: "Aloe",
	id: "aloe",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/aloe/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:365)
rt.def("/datum/chemical_reaction/aloe/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["aloe", 2]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["irishcream", 1, "watermelonjuice", 1]));
	return f.dot;
});

rt.type(2390, "/datum/chemical_reaction/andalusia", "/datum/chemical_reaction", {
	name: "Andalusia",
	id: "andalusia",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/andalusia/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:371)
rt.def("/datum/chemical_reaction/andalusia/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["andalusia", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["rum", 1, "whiskey", 1, "lemonjuice", 1]));
	return f.dot;
});

rt.type(2391, "/datum/chemical_reaction/neurotoxin", "/datum/chemical_reaction", {
	name: "Neurotoxin",
	id: "neurotoxin",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/neurotoxin/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:377)
rt.def("/datum/chemical_reaction/neurotoxin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["neurotoxin", 2]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["gargleblaster", 1, "morphine", 1]));
	return f.dot;
});

rt.type(2392, "/datum/chemical_reaction/snowwhite", "/datum/chemical_reaction", {
	name: "Snow White",
	id: "snowwhite",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/snowwhite/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:383)
rt.def("/datum/chemical_reaction/snowwhite/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["snowwhite", 2]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["beer", 1, "lemon_lime", 1]));
	return f.dot;
});

rt.type(2393, "/datum/chemical_reaction/irishcarbomb", "/datum/chemical_reaction", {
	name: "Irish Car Bomb",
	id: "irishcarbomb",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/irishcarbomb/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:389)
rt.def("/datum/chemical_reaction/irishcarbomb/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["irishcarbomb", 2]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["ale", 1, "irishcream", 1]));
	return f.dot;
});

rt.type(2394, "/datum/chemical_reaction/syndicatebomb", "/datum/chemical_reaction", {
	name: "Syndicate Bomb",
	id: "syndicatebomb",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/syndicatebomb/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:395)
rt.def("/datum/chemical_reaction/syndicatebomb/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["syndicatebomb", 2]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["beer", 1, "whiskeycola", 1]));
	return f.dot;
});

rt.type(2395, "/datum/chemical_reaction/erikasurprise", "/datum/chemical_reaction", {
	name: "Erika Surprise",
	id: "erikasurprise",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/erikasurprise/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:401)
rt.def("/datum/chemical_reaction/erikasurprise/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["erikasurprise", 5]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["ale", 1, "limejuice", 1, "whiskey", 1, "banana", 1, "ice", 1]));
	return f.dot;
});

rt.type(2396, "/datum/chemical_reaction/devilskiss", "/datum/chemical_reaction", {
	name: "Devils Kiss",
	id: "devilskiss",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/devilskiss/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:407)
rt.def("/datum/chemical_reaction/devilskiss/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["devilskiss", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["blood", 1, "kahlua", 1, "rum", 1]));
	return f.dot;
});

rt.type(2397, "/datum/chemical_reaction/hippiesdelight", "/datum/chemical_reaction", {
	name: "Hippies Delight",
	id: "hippiesdelight",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/hippiesdelight/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:413)
rt.def("/datum/chemical_reaction/hippiesdelight/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["hippiesdelight", 2]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["mushroomhallucinogen", 1, "gargleblaster", 1]));
	return f.dot;
});

rt.type(2398, "/datum/chemical_reaction/bananahonk", "/datum/chemical_reaction", {
	name: "Banana Honk",
	id: "bananahonk",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/bananahonk/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:419)
rt.def("/datum/chemical_reaction/bananahonk/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["bananahonk", 2]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["laughter", 1, "cream", 1]));
	return f.dot;
});

rt.type(2399, "/datum/chemical_reaction/silencer", "/datum/chemical_reaction", {
	name: "Silencer",
	id: "silencer",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/silencer/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:425)
rt.def("/datum/chemical_reaction/silencer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["silencer", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["nothing", 1, "cream", 1, "sugar", 1]));
	return f.dot;
});

rt.type(2400, "/datum/chemical_reaction/driestmartini", "/datum/chemical_reaction", {
	name: "Driest Martini",
	id: "driestmartini",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/driestmartini/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:431)
rt.def("/datum/chemical_reaction/driestmartini/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["driestmartini", 2]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["nothing", 1, "gin", 1]));
	return f.dot;
});

rt.type(2401, "/datum/chemical_reaction/thirteenloko", "/datum/chemical_reaction", {
	name: "Thirteen Loko",
	id: "thirteenloko",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/thirteenloko/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:437)
rt.def("/datum/chemical_reaction/thirteenloko/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["thirteenloko", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["vodka", 1, "coffee", 1, "limejuice", 1]));
	return f.dot;
});

rt.type(2402, "/datum/chemical_reaction/chocolatepudding", "/datum/chemical_reaction", {
	name: "Chocolate Pudding",
	id: "chocolatepudding",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/chocolatepudding/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:443)
rt.def("/datum/chemical_reaction/chocolatepudding/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["chocolatepudding", 20]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["cocoa", 5, "milk", 5, "eggyolk", 5]));
	return f.dot;
});

rt.type(2403, "/datum/chemical_reaction/vanillapudding", "/datum/chemical_reaction", {
	name: "Vanilla Pudding",
	id: "vanillapudding",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/vanillapudding/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:449)
rt.def("/datum/chemical_reaction/vanillapudding/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["vanillapudding", 20]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["vanilla", 5, "milk", 5, "eggyolk", 5]));
	return f.dot;
});

rt.type(2404, "/datum/chemical_reaction/cherryshake", "/datum/chemical_reaction", {
	name: "Cherry Shake",
	id: "cherryshake",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/cherryshake/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:455)
rt.def("/datum/chemical_reaction/cherryshake/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["cherryshake", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["cherryjelly", 1, "ice", 1, "cream", 1]));
	return f.dot;
});

rt.type(2405, "/datum/chemical_reaction/bluecherryshake", "/datum/chemical_reaction", {
	name: "Blue Cherry Shake",
	id: "bluecherryshake",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/bluecherryshake/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:461)
rt.def("/datum/chemical_reaction/bluecherryshake/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["bluecherryshake", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["bluecherryjelly", 1, "ice", 1, "cream", 1]));
	return f.dot;
});

rt.type(2406, "/datum/chemical_reaction/drunkenblumpkin", "/datum/chemical_reaction", {
	name: "Drunken Blumpkin",
	id: "drunkenblumpkin",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/drunkenblumpkin/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:467)
rt.def("/datum/chemical_reaction/drunkenblumpkin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["drunkenblumpkin", 4]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["blumpkinjuice", 1, "irishcream", 2, "ice", 1]));
	return f.dot;
});

rt.type(2407, "/datum/chemical_reaction/pumpkin_latte", "/datum/chemical_reaction", {
	name: "Pumpkin space latte",
	id: "pumpkin_latte",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/pumpkin_latte/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:473)
rt.def("/datum/chemical_reaction/pumpkin_latte/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["pumpkin_latte", 15]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["pumpkinjuice", 5, "coffee", 5, "cream", 5]));
	return f.dot;
});

rt.type(2408, "/datum/chemical_reaction/gibbfloats", "/datum/chemical_reaction", {
	name: "Gibb Floats",
	id: "gibbfloats",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/gibbfloats/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:479)
rt.def("/datum/chemical_reaction/gibbfloats/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["gibbfloats", 15]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["dr_gibb", 5, "ice", 5, "cream", 5]));
	return f.dot;
});

rt.type(2409, "/datum/chemical_reaction/triple_citrus", "/datum/chemical_reaction", {
	name: "triple_citrus",
	id: "triple_citrus",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/triple_citrus/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:485)
rt.def("/datum/chemical_reaction/triple_citrus/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["triple_citrus", 5]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["lemonjuice", 1, "limejuice", 1, "orangejuice", 1]));
	return f.dot;
});

rt.type(2410, "/datum/chemical_reaction/grape_soda", "/datum/chemical_reaction", {
	name: "grape soda",
	id: "grapesoda",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/grape_soda/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:491)
rt.def("/datum/chemical_reaction/grape_soda/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["grapesoda", 2]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["grapejuice", 1, "sodawater", 1]));
	return f.dot;
});

rt.type(2411, "/datum/chemical_reaction/grappa", "/datum/chemical_reaction", {
	name: "grappa",
	id: "grappa",
	results: null,
	required_reagents: null,
	required_catalysts: null,
});

// /datum/chemical_reaction/grappa/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:497)
rt.def("/datum/chemical_reaction/grappa/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["grappa", 10]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["wine", 10]));
	rt.setSv(f, "required_catalysts", rt.alist(f, ["enzyme", 5]));
	return f.dot;
});

rt.type(2412, "/datum/chemical_reaction/whiskey_sour", "/datum/chemical_reaction", {
	name: "Whiskey Sour",
	id: "whiskey_sour",
	mix_message: "The mixture darkens to a rich gold hue.",
	mix_sound: null,
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/whiskey_sour/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:504)
rt.def("/datum/chemical_reaction/whiskey_sour/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["whiskey_sour", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["whiskey", 1, "lemonjuice", 1, "sugar", 1]));
	return f.dot;
});

rt.type(2413, "/datum/chemical_reaction/fetching_fizz", "/datum/chemical_reaction", {
	name: "Fetching Fizz",
	id: "fetching_fizz",
	mix_message: "The mixture slightly vibrates before settling.",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/fetching_fizz/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:512)
rt.def("/datum/chemical_reaction/fetching_fizz/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["fetching_fizz", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["nuka_cola", 1, "iron", 1]));
	return f.dot;
});

rt.type(2414, "/datum/chemical_reaction/hearty_punch", "/datum/chemical_reaction", {
	name: "Hearty Punch",
	id: "hearty_punch",
	mix_message: "The mixture darkens to a healthy crimson.",
	mix_sound: null,
	required_temp: 315,
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/hearty_punch/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:519)
rt.def("/datum/chemical_reaction/hearty_punch/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["hearty_punch", 1]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["bravebull", 5, "syndicatebomb", 5, "absinthe", 5]));
	return f.dot;
});

rt.type(2415, "/datum/chemical_reaction/bacchus_blessing", "/datum/chemical_reaction", {
	name: "Bacchus' Blessing",
	id: "bacchus_blessing",
	mix_message: "<span class='warning'>The mixture turns to a sickening froth.</span>",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/bacchus_blessing/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:528)
rt.def("/datum/chemical_reaction/bacchus_blessing/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["bacchus_blessing", 4]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["hooch", 1, "absinthe", 1, "manlydorf", 1, "syndicatebomb", 1]));
	return f.dot;
});

rt.type(2416, "/datum/chemical_reaction/arnold_palmer", "/datum/chemical_reaction", {
	name: "Arnold Palmer",
	id: "arnold_palmer",
	mix_message: "The smells of fresh green grass and sand traps waft through the air as the mixture turns a friendly yellow-orange.",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/arnold_palmer/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:535)
rt.def("/datum/chemical_reaction/arnold_palmer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["arnold_palmer", 2]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["tea", 1, "lemonjuice", 1]));
	return f.dot;
});

rt.type(2417, "/datum/chemical_reaction/chocolate_milk", "/datum/chemical_reaction", {
	name: "chocolate milk",
	id: "chocolate_milk",
	mix_message: "The color changes as the mixture blends smoothly.",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/chocolate_milk/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:542)
rt.def("/datum/chemical_reaction/chocolate_milk/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["chocolate_milk", 2]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["milk", 1, "cocoa", 1]));
	return f.dot;
});

rt.type(2418, "/datum/chemical_reaction/eggnog", "/datum/chemical_reaction", {
	name: "eggnog",
	id: "eggnog",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/eggnog/proc/<init>  (code/modules/food_and_drinks/recipes/drinks_recipes.dm:549)
rt.def("/datum/chemical_reaction/eggnog/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["eggnog", 15]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["rum", 5, "cream", 5, "eggyolk", 5]));
	return f.dot;
});
