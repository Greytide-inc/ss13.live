// From code/modules/food_and_drinks/food/snacks_pizza.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(6112, "/obj/item/weapon/reagent_containers/food/snacks/pizza", "/obj/item/weapon/reagent_containers/food/snacks", {
	slices_num: 6,
	tastes: null,
	icon: rt.rsc("icons/obj/food/pizzaspaghetti.dmi"),
	w_class: 3,
	volume: 80,
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/pizza/proc/<init>  (code/modules/food_and_drinks/food/snacks_pizza.dm:10)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/pizza/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["crust", 1, "tomato", 1, "cheese", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 30, "tomatojuice", 6, "vitamin", 5]));
	return f.dot;
});

rt.type(6120, "/obj/item/weapon/reagent_containers/food/snacks/pizzaslice", "/obj/item/weapon/reagent_containers/food/snacks", {
	icon: rt.rsc("icons/obj/food/pizzaspaghetti.dmi"),
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/pizzaslice/proc/<init>  (code/modules/food_and_drinks/food/snacks_pizza.dm:14)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/pizzaslice/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 5]));
	return f.dot;
});

rt.type(6113, "/obj/item/weapon/reagent_containers/food/snacks/pizza/margherita", "/obj/item/weapon/reagent_containers/food/snacks/pizza", {
	bonus_reagents: null,
	tastes: null,
	name: "margherita",
	desc: "The most cheezy pizza in galaxy.",
	icon_state: "pizzamargherita",
	slice_path: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/pizzaslice/margherita"),
});

// /obj/item/weapon/reagent_containers/food/snacks/pizza/margherita/proc/<init>  (code/modules/food_and_drinks/food/snacks_pizza.dm:21)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/pizza/margherita/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 5, "vitamin", 5]));
	rt.setSv(f, "tastes", rt.alist(f, ["crust", 1, "tomato", 1, "cheese", 1]));
	return f.dot;
});

rt.type(6121, "/obj/item/weapon/reagent_containers/food/snacks/pizzaslice/margherita", "/obj/item/weapon/reagent_containers/food/snacks/pizzaslice", {
	filling_color: "#FFA500",
	tastes: null,
	name: "margherita slice",
	desc: "A slice of the most cheezy pizza in galaxy.",
	icon_state: "pizzamargheritaslice",
});

// /obj/item/weapon/reagent_containers/food/snacks/pizzaslice/margherita/proc/<init>  (code/modules/food_and_drinks/food/snacks_pizza.dm:29)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/pizzaslice/margherita/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["crust", 1, "tomato", 1, "cheese", 1]));
	return f.dot;
});

rt.type(6114, "/obj/item/weapon/reagent_containers/food/snacks/pizza/meat", "/obj/item/weapon/reagent_containers/food/snacks/pizza", {
	bonus_reagents: null,
	tastes: null,
	name: "meatpizza",
	desc: "Greasy pizza with delicious meat.",
	icon_state: "meatpizza",
	slice_path: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/pizzaslice/meat"),
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/pizza/meat/proc/<init>  (code/modules/food_and_drinks/food/snacks_pizza.dm:36)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/pizza/meat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 5, "vitamin", 8]));
	rt.setSv(f, "tastes", rt.alist(f, ["crust", 1, "tomato", 1, "cheese", 1, "meat", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 30, "tomatojuice", 6, "vitamin", 8]));
	return f.dot;
});

rt.type(6122, "/obj/item/weapon/reagent_containers/food/snacks/pizzaslice/meat", "/obj/item/weapon/reagent_containers/food/snacks/pizzaslice", {
	filling_color: "#A52A2A",
	tastes: null,
	name: "meatpizza slice",
	desc: "A nutritious slice of meatpizza.",
	icon_state: "meatpizzaslice",
});

// /obj/item/weapon/reagent_containers/food/snacks/pizzaslice/meat/proc/<init>  (code/modules/food_and_drinks/food/snacks_pizza.dm:45)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/pizzaslice/meat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["crust", 1, "tomato", 1, "cheese", 1, "meat", 1]));
	return f.dot;
});

rt.type(6115, "/obj/item/weapon/reagent_containers/food/snacks/pizza/mushroom", "/obj/item/weapon/reagent_containers/food/snacks/pizza", {
	bonus_reagents: null,
	tastes: null,
	name: "mushroom pizza",
	desc: "Very special pizza.",
	icon_state: "mushroompizza",
	slice_path: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/pizzaslice/mushroom"),
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/pizza/mushroom/proc/<init>  (code/modules/food_and_drinks/food/snacks_pizza.dm:52)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/pizza/mushroom/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 5, "vitamin", 5]));
	rt.setSv(f, "tastes", rt.alist(f, ["crust", 1, "tomato", 1, "cheese", 1, "mushroom", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 30, "vitamin", 5]));
	return f.dot;
});

rt.type(6123, "/obj/item/weapon/reagent_containers/food/snacks/pizzaslice/mushroom", "/obj/item/weapon/reagent_containers/food/snacks/pizzaslice", {
	filling_color: "#FFE4C4",
	tastes: null,
	name: "mushroom pizza slice",
	desc: "Maybe it is the last slice of pizza in your life.",
	icon_state: "mushroompizzaslice",
});

// /obj/item/weapon/reagent_containers/food/snacks/pizzaslice/mushroom/proc/<init>  (code/modules/food_and_drinks/food/snacks_pizza.dm:61)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/pizzaslice/mushroom/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["crust", 1, "tomato", 1, "cheese", 1, "mushroom", 1]));
	return f.dot;
});

rt.type(6116, "/obj/item/weapon/reagent_containers/food/snacks/pizza/vegetable", "/obj/item/weapon/reagent_containers/food/snacks/pizza", {
	bonus_reagents: null,
	tastes: null,
	name: "vegetable pizza",
	desc: "No one of Tomatos Sapiens were harmed during making this pizza.",
	icon_state: "vegetablepizza",
	slice_path: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/pizzaslice/vegetable"),
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/pizza/vegetable/proc/<init>  (code/modules/food_and_drinks/food/snacks_pizza.dm:68)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/pizza/vegetable/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 5, "vitamin", 5]));
	rt.setSv(f, "tastes", rt.alist(f, ["crust", 1, "tomato", 2, "cheese", 1, "carrot", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 25, "tomatojuice", 6, "oculine", 12, "vitamin", 5]));
	return f.dot;
});

rt.type(6124, "/obj/item/weapon/reagent_containers/food/snacks/pizzaslice/vegetable", "/obj/item/weapon/reagent_containers/food/snacks/pizzaslice", {
	filling_color: "#FFA500",
	tastes: null,
	name: "vegetable pizza slice",
	desc: "A slice of the most green pizza of all pizzas not containing green ingredients.",
	icon_state: "vegetablepizzaslice",
});

// /obj/item/weapon/reagent_containers/food/snacks/pizzaslice/vegetable/proc/<init>  (code/modules/food_and_drinks/food/snacks_pizza.dm:77)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/pizzaslice/vegetable/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["crust", 1, "tomato", 2, "cheese", 1, "carrot", 1]));
	return f.dot;
});

rt.type(6117, "/obj/item/weapon/reagent_containers/food/snacks/pizza/donkpocket", "/obj/item/weapon/reagent_containers/food/snacks/pizza", {
	bonus_reagents: null,
	tastes: null,
	name: "donkpocket pizza",
	desc: "Who thought this would be a good idea?",
	icon_state: "donkpocketpizza",
	slice_path: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/pizzaslice/donkpocket"),
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/pizza/donkpocket/proc/<init>  (code/modules/food_and_drinks/food/snacks_pizza.dm:84)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/pizza/donkpocket/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 5, "vitamin", 5]));
	rt.setSv(f, "tastes", rt.alist(f, ["crust", 1, "tomato", 1, "cheese", 1, "meat", 1, "laziness", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 25, "tomatojuice", 6, "omnizine", 10, "vitamin", 5]));
	return f.dot;
});

rt.type(6125, "/obj/item/weapon/reagent_containers/food/snacks/pizzaslice/donkpocket", "/obj/item/weapon/reagent_containers/food/snacks/pizzaslice", {
	filling_color: "#FFA500",
	tastes: null,
	name: "donkpocket pizza slice",
	desc: "Smells like donkpocket.",
	icon_state: "donkpocketpizzaslice",
});

// /obj/item/weapon/reagent_containers/food/snacks/pizzaslice/donkpocket/proc/<init>  (code/modules/food_and_drinks/food/snacks_pizza.dm:93)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/pizzaslice/donkpocket/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["crust", 1, "tomato", 1, "cheese", 1, "meat", 1, "laziness", 1]));
	return f.dot;
});

rt.type(6118, "/obj/item/weapon/reagent_containers/food/snacks/pizza/dank", "/obj/item/weapon/reagent_containers/food/snacks/pizza", {
	bonus_reagents: null,
	tastes: null,
	name: "dank pizza",
	desc: "The hippie's pizza of choice.",
	icon_state: "dankpizza",
	slice_path: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/pizzaslice/dank"),
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/pizza/dank/proc/<init>  (code/modules/food_and_drinks/food/snacks_pizza.dm:100)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/pizza/dank/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 2, "vitamin", 6]));
	rt.setSv(f, "tastes", rt.alist(f, ["crust", 1, "tomato", 1, "cheese", 1, "meat", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 25, "doctorsdelight", 5, "tomatojuice", 6, "vitamin", 5]));
	return f.dot;
});

rt.type(6126, "/obj/item/weapon/reagent_containers/food/snacks/pizzaslice/dank", "/obj/item/weapon/reagent_containers/food/snacks/pizzaslice", {
	filling_color: "#2E8B57",
	tastes: null,
	name: "dank pizza slice",
	desc: "So good, man...",
	icon_state: "dankpizzaslice",
});

// /obj/item/weapon/reagent_containers/food/snacks/pizzaslice/dank/proc/<init>  (code/modules/food_and_drinks/food/snacks_pizza.dm:109)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/pizzaslice/dank/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["crust", 1, "tomato", 1, "cheese", 1, "meat", 1]));
	return f.dot;
});

rt.type(6119, "/obj/item/weapon/reagent_containers/food/snacks/pizza/sassysage", "/obj/item/weapon/reagent_containers/food/snacks/pizza", {
	bonus_reagents: null,
	tastes: null,
	name: "sassysage pizza",
	desc: "You can really smell the sassiness.",
	icon_state: "sassysagepizza",
	slice_path: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/pizzaslice/sassysage"),
});

// /obj/item/weapon/reagent_containers/food/snacks/pizza/sassysage/proc/<init>  (code/modules/food_and_drinks/food/snacks_pizza.dm:116)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/pizza/sassysage/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 6, "vitamin", 6]));
	rt.setSv(f, "tastes", rt.alist(f, ["crust", 1, "tomato", 1, "cheese", 1, "meat", 1]));
	return f.dot;
});

rt.type(6127, "/obj/item/weapon/reagent_containers/food/snacks/pizzaslice/sassysage", "/obj/item/weapon/reagent_containers/food/snacks/pizzaslice", {
	filling_color: "#FF4500",
	tastes: null,
	name: "sassysage pizza slice",
	desc: "Deliciously sassy.",
	icon_state: "sassysagepizzaslice",
});

// /obj/item/weapon/reagent_containers/food/snacks/pizzaslice/sassysage/proc/<init>  (code/modules/food_and_drinks/food/snacks_pizza.dm:124)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/pizzaslice/sassysage/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["crust", 1, "tomato", 1, "cheese", 1, "meat", 1]));
	return f.dot;
});
