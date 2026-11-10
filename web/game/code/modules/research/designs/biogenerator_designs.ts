// Based on /tg/station's code/modules/research/designs/biogenerator_designs.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(3091, "/datum/design/milk", "/datum/design", {
	name: "10 Milk",
	id: "milk",
	build_type: 32,
	materials: null,
	make_reagents: null,
	category: null,
});

// biogenerator_designs.dm:9
rt.def("/datum/design/milk/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$biomass", 20]);
	this.make_reagents = rt.alist(f, ["milk", 10]);
	this.category = list("initial", "Food");
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

// biogenerator_designs.dm:17
rt.def("/datum/design/cream/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$biomass", 30]);
	this.make_reagents = rt.alist(f, ["cream", 10]);
	this.category = list("initial", "Food");
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

// biogenerator_designs.dm:25
rt.def("/datum/design/milk_carton/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$biomass", 100]);
	this.category = list("initial", "Food");
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

// biogenerator_designs.dm:33
rt.def("/datum/design/cream_carton/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$biomass", 300]);
	this.category = list("initial", "Food");
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

// biogenerator_designs.dm:41
rt.def("/datum/design/black_pepper/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$biomass", 25]);
	this.make_reagents = rt.alist(f, ["blackpepper", 10]);
	this.category = list("initial", "Food");
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

// biogenerator_designs.dm:49
rt.def("/datum/design/pepper_mill/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$biomass", 50]);

	this.make_reagents = list();
	this.category = list("initial", "Food");
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

// biogenerator_designs.dm:58
rt.def("/datum/design/monkey_cube/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$biomass", 250]);
	this.category = list("initial", "Food");
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

// biogenerator_designs.dm:66
rt.def("/datum/design/ez_nut/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$biomass", 10]);
	this.category = list("initial", "Botany Chemicals");
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

// biogenerator_designs.dm:74
rt.def("/datum/design/l4z_nut/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$biomass", 20]);
	this.category = list("initial", "Botany Chemicals");
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

// biogenerator_designs.dm:82
rt.def("/datum/design/rh_nut/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$biomass", 25]);
	this.category = list("initial", "Botany Chemicals");
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

// biogenerator_designs.dm:90
rt.def("/datum/design/weed_killer/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$biomass", 50]);
	this.category = list("initial", "Botany Chemicals");
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

// biogenerator_designs.dm:98
rt.def("/datum/design/pest_spray/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$biomass", 50]);
	this.category = list("initial", "Botany Chemicals");
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

// biogenerator_designs.dm:106
rt.def("/datum/design/botany_bottle/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$biomass", 5]);
	this.category = list("initial", "Botany Chemicals");
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

// biogenerator_designs.dm:114
rt.def("/datum/design/cloth/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$biomass", 50]);
	this.category = list("initial", "Leather and Cloth");
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

// biogenerator_designs.dm:122
rt.def("/datum/design/leather/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$biomass", 150]);
	this.category = list("initial", "Leather and Cloth");
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

// biogenerator_designs.dm:130
rt.def("/datum/design/secbelt/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$biomass", 300]);
	this.category = list("initial", "Leather and Cloth");
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

// biogenerator_designs.dm:138
rt.def("/datum/design/medbelt/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$biomass", 300]);
	this.category = list("initial", "Leather and Cloth");
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

// biogenerator_designs.dm:146
rt.def("/datum/design/janibelt/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$biomass", 300]);
	this.category = list("initial", "Leather and Cloth");
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

// biogenerator_designs.dm:154
rt.def("/datum/design/s_holster/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$biomass", 400]);
	this.category = list("initial", "Leather and Cloth");
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

// biogenerator_designs.dm:162
rt.def("/datum/design/rice_hat/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$biomass", 300]);
	this.category = list("initial", "Leather and Cloth");
	return f.dot;
});
