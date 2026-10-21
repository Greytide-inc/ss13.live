// From code/modules/research/designs/biogenerator_designs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(3091, "/datum/design/milk", "/datum/design", {
	name: "10 Milk",
	id: "milk",
	build_type: 32,
	materials: null,
	make_reagents: null,
	category: null,
});

// /datum/design/milk/proc/<init>  (code/modules/research/designs/biogenerator_designs.dm:9)
rt.def("/datum/design/milk/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$biomass", 20]));
	rt.setSv(f, "make_reagents", rt.alist(f, ["milk", 10]));
	rt.setSv(f, "category", rt.list("initial", "Food"));
	return f.dot;
});

rt.type(3092, "/datum/design/cream", "/datum/design", {
	name: "10 Cream",
	id: "cream",
	build_type: 32,
	materials: null,
	make_reagents: null,
	category: null,
});

// /datum/design/cream/proc/<init>  (code/modules/research/designs/biogenerator_designs.dm:17)
rt.def("/datum/design/cream/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$biomass", 30]));
	rt.setSv(f, "make_reagents", rt.alist(f, ["cream", 10]));
	rt.setSv(f, "category", rt.list("initial", "Food"));
	return f.dot;
});

rt.type(3093, "/datum/design/milk_carton", "/datum/design", {
	name: "Milk Carton",
	id: "milk_carton",
	build_type: 32,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/reagent_containers/food/condiment/milk"),
});

// /datum/design/milk_carton/proc/<init>  (code/modules/research/designs/biogenerator_designs.dm:25)
rt.def("/datum/design/milk_carton/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$biomass", 100]));
	rt.setSv(f, "category", rt.list("initial", "Food"));
	return f.dot;
});

rt.type(3094, "/datum/design/cream_carton", "/datum/design", {
	name: "Cream Carton",
	id: "cream_carton",
	build_type: 32,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/reagent_containers/food/drinks/bottle/cream"),
});

// /datum/design/cream_carton/proc/<init>  (code/modules/research/designs/biogenerator_designs.dm:33)
rt.def("/datum/design/cream_carton/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$biomass", 300]));
	rt.setSv(f, "category", rt.list("initial", "Food"));
	return f.dot;
});

rt.type(3095, "/datum/design/black_pepper", "/datum/design", {
	name: "10u Black Pepper",
	id: "black_pepper",
	build_type: 32,
	materials: null,
	make_reagents: null,
	category: null,
});

// /datum/design/black_pepper/proc/<init>  (code/modules/research/designs/biogenerator_designs.dm:41)
rt.def("/datum/design/black_pepper/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$biomass", 25]));
	rt.setSv(f, "make_reagents", rt.alist(f, ["blackpepper", 10]));
	rt.setSv(f, "category", rt.list("initial", "Food"));
	return f.dot;
});

rt.type(3096, "/datum/design/pepper_mill", "/datum/design", {
	name: "Pepper Mill",
	id: "pepper_mill",
	build_type: 32,
	materials: null,
	make_reagents: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/reagent_containers/food/condiment/peppermill"),
});

// /datum/design/pepper_mill/proc/<init>  (code/modules/research/designs/biogenerator_designs.dm:49)
rt.def("/datum/design/pepper_mill/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$biomass", 50]));
	$0 = $0;
	rt.setSv(f, "make_reagents", rt.list());
	rt.setSv(f, "category", rt.list("initial", "Food"));
	return f.dot;
});

rt.type(3097, "/datum/design/monkey_cube", "/datum/design", {
	name: "Monkey Cube",
	id: "mcube",
	build_type: 32,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/monkeycube"),
});

// /datum/design/monkey_cube/proc/<init>  (code/modules/research/designs/biogenerator_designs.dm:58)
rt.def("/datum/design/monkey_cube/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$biomass", 250]));
	rt.setSv(f, "category", rt.list("initial", "Food"));
	return f.dot;
});

rt.type(3098, "/datum/design/ez_nut", "/datum/design", {
	name: "E-Z Nutrient",
	id: "ez_nut",
	build_type: 32,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/reagent_containers/glass/bottle/nutrient/ez"),
});

// /datum/design/ez_nut/proc/<init>  (code/modules/research/designs/biogenerator_designs.dm:66)
rt.def("/datum/design/ez_nut/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$biomass", 10]));
	rt.setSv(f, "category", rt.list("initial", "Botany Chemicals"));
	return f.dot;
});

rt.type(3099, "/datum/design/l4z_nut", "/datum/design", {
	name: "Left 4 Zed",
	id: "l4z_nut",
	build_type: 32,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/reagent_containers/glass/bottle/nutrient/l4z"),
});

// /datum/design/l4z_nut/proc/<init>  (code/modules/research/designs/biogenerator_designs.dm:74)
rt.def("/datum/design/l4z_nut/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$biomass", 20]));
	rt.setSv(f, "category", rt.list("initial", "Botany Chemicals"));
	return f.dot;
});

rt.type(3100, "/datum/design/rh_nut", "/datum/design", {
	name: "Robust Harvest",
	id: "rh_nut",
	build_type: 32,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/reagent_containers/glass/bottle/nutrient/rh"),
});

// /datum/design/rh_nut/proc/<init>  (code/modules/research/designs/biogenerator_designs.dm:82)
rt.def("/datum/design/rh_nut/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$biomass", 25]));
	rt.setSv(f, "category", rt.list("initial", "Botany Chemicals"));
	return f.dot;
});

rt.type(3101, "/datum/design/weed_killer", "/datum/design", {
	name: "Weed Killer",
	id: "weed_killer",
	build_type: 32,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/reagent_containers/glass/bottle/killer/weedkiller"),
});

// /datum/design/weed_killer/proc/<init>  (code/modules/research/designs/biogenerator_designs.dm:90)
rt.def("/datum/design/weed_killer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$biomass", 50]));
	rt.setSv(f, "category", rt.list("initial", "Botany Chemicals"));
	return f.dot;
});

rt.type(3102, "/datum/design/pest_spray", "/datum/design", {
	name: "Pest Killer",
	id: "pest_spray",
	build_type: 32,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/reagent_containers/glass/bottle/killer/pestkiller"),
});

// /datum/design/pest_spray/proc/<init>  (code/modules/research/designs/biogenerator_designs.dm:98)
rt.def("/datum/design/pest_spray/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$biomass", 50]));
	rt.setSv(f, "category", rt.list("initial", "Botany Chemicals"));
	return f.dot;
});

rt.type(3103, "/datum/design/botany_bottle", "/datum/design", {
	name: "Empty Bottle",
	id: "botany_bottle",
	build_type: 32,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/reagent_containers/glass/bottle/nutrient/empty"),
});

// /datum/design/botany_bottle/proc/<init>  (code/modules/research/designs/biogenerator_designs.dm:106)
rt.def("/datum/design/botany_bottle/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$biomass", 5]));
	rt.setSv(f, "category", rt.list("initial", "Botany Chemicals"));
	return f.dot;
});

rt.type(3104, "/datum/design/cloth", "/datum/design", {
	name: "Roll of Cloth",
	id: "cloth",
	build_type: 32,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/stack/sheet/cloth"),
});

// /datum/design/cloth/proc/<init>  (code/modules/research/designs/biogenerator_designs.dm:114)
rt.def("/datum/design/cloth/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$biomass", 50]));
	rt.setSv(f, "category", rt.list("initial", "Leather and Cloth"));
	return f.dot;
});

rt.type(3105, "/datum/design/leather", "/datum/design", {
	name: "Sheet of Leather",
	id: "leather",
	build_type: 32,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/stack/sheet/leather"),
});

// /datum/design/leather/proc/<init>  (code/modules/research/designs/biogenerator_designs.dm:122)
rt.def("/datum/design/leather/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$biomass", 150]));
	rt.setSv(f, "category", rt.list("initial", "Leather and Cloth"));
	return f.dot;
});

rt.type(3106, "/datum/design/secbelt", "/datum/design", {
	name: "Security Belt",
	id: "secbelt",
	build_type: 32,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/storage/belt/security"),
});

// /datum/design/secbelt/proc/<init>  (code/modules/research/designs/biogenerator_designs.dm:130)
rt.def("/datum/design/secbelt/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$biomass", 300]));
	rt.setSv(f, "category", rt.list("initial", "Leather and Cloth"));
	return f.dot;
});

rt.type(3107, "/datum/design/medbelt", "/datum/design", {
	name: "Medical Belt",
	id: "medbel",
	build_type: 32,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/storage/belt/medical"),
});

// /datum/design/medbelt/proc/<init>  (code/modules/research/designs/biogenerator_designs.dm:138)
rt.def("/datum/design/medbelt/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$biomass", 300]));
	rt.setSv(f, "category", rt.list("initial", "Leather and Cloth"));
	return f.dot;
});

rt.type(3108, "/datum/design/janibelt", "/datum/design", {
	name: "Janitorial Belt",
	id: "janibelt",
	build_type: 32,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/storage/belt/janitor"),
});

// /datum/design/janibelt/proc/<init>  (code/modules/research/designs/biogenerator_designs.dm:146)
rt.def("/datum/design/janibelt/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$biomass", 300]));
	rt.setSv(f, "category", rt.list("initial", "Leather and Cloth"));
	return f.dot;
});

rt.type(3109, "/datum/design/s_holster", "/datum/design", {
	name: "Shoulder Holster",
	id: "s_holster",
	build_type: 32,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/storage/belt/holster"),
});

// /datum/design/s_holster/proc/<init>  (code/modules/research/designs/biogenerator_designs.dm:154)
rt.def("/datum/design/s_holster/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$biomass", 400]));
	rt.setSv(f, "category", rt.list("initial", "Leather and Cloth"));
	return f.dot;
});

rt.type(3110, "/datum/design/rice_hat", "/datum/design", {
	name: "Rice Hat",
	id: "rice_hat",
	build_type: 32,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/clothing/head/rice_hat"),
});

// /datum/design/rice_hat/proc/<init>  (code/modules/research/designs/biogenerator_designs.dm:162)
rt.def("/datum/design/rice_hat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$biomass", 300]));
	rt.setSv(f, "category", rt.list("initial", "Leather and Cloth"));
	return f.dot;
});
