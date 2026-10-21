// From code/modules/crafting/recipes.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1535, "/datum/crafting_recipe", "/datum", {
	name: "",
	reqs: null,
	result: null,
	tools: null,
	time: 30,
	parts: null,
	chem_catalysts: null,
	category: "",
	subcategory: "",
});

// /datum/crafting_recipe/proc/<init>  (code/modules/crafting/recipes.dm:4)
rt.def("/datum/crafting_recipe/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.list());
	$0 = $0;
	rt.setSv(f, "tools", rt.list());
	$0 = $0;
	rt.setSv(f, "parts", rt.list());
	$0 = $0;
	rt.setSv(f, "chem_catalysts", rt.list());
	return f.dot;
});

rt.type(1537, "/datum/crafting_recipe/pin_removal", "/datum/crafting_recipe", {
	name: "Pin Removal",
	time: 50,
	category: "Weaponry",
	subcategory: "Weapons",
	result: rt.typePath("/obj/item/weapon/gun"),
	reqs: null,
	parts: null,
	tools: null,
});

// /datum/crafting_recipe/pin_removal/proc/<init>  (code/modules/crafting/recipes.dm:17)
rt.def("/datum/crafting_recipe/pin_removal/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/gun"), 1]));
	$0 = $0;
	rt.setSv(f, "parts", rt.alist(f, [T("/obj/item/weapon/gun"), 1]));
	$0 = $0;
	rt.setSv(f, "tools", rt.list(T("/obj/item/weapon/weldingtool"), T("/obj/item/weapon/screwdriver"), T("/obj/item/weapon/wirecutters")));
	return f.dot;
});

rt.type(1538, "/datum/crafting_recipe/IED", "/datum/crafting_recipe", {
	name: "IED",
	time: 15,
	category: "Weaponry",
	subcategory: "Weapons",
	result: rt.typePath("/obj/item/weapon/grenade/iedcasing"),
	reqs: null,
	parts: null,
});

// /datum/crafting_recipe/IED/proc/<init>  (code/modules/crafting/recipes.dm:27)
rt.def("/datum/crafting_recipe/IED/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/fuel"), 50, T("/obj/item/stack/cable_coil"), 1, T("/obj/item/device/assembly/igniter"), 1, T("/obj/item/weapon/reagent_containers/food/drinks/soda_cans"), 1]));
	$0 = $0;
	rt.setSv(f, "parts", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/drinks/soda_cans"), 1]));
	return f.dot;
});

rt.type(1539, "/datum/crafting_recipe/lance", "/datum/crafting_recipe", {
	name: "explosive lance (grenade)",
	time: 15,
	category: "Weaponry",
	subcategory: "Weapons",
	result: rt.typePath("/obj/item/weapon/twohanded/spear"),
	reqs: null,
	parts: null,
});

// /datum/crafting_recipe/lance/proc/<init>  (code/modules/crafting/recipes.dm:39)
rt.def("/datum/crafting_recipe/lance/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/twohanded/spear"), 1, T("/obj/item/weapon/grenade"), 1]));
	$0 = $0;
	rt.setSv(f, "parts", rt.alist(f, [T("/obj/item/weapon/twohanded/spear"), 1, T("/obj/item/weapon/grenade"), 1]));
	return f.dot;
});

rt.type(1540, "/datum/crafting_recipe/strobeshield", "/datum/crafting_recipe", {
	name: "strobe shield",
	time: 40,
	category: "Weaponry",
	subcategory: "Weapons",
	result: rt.typePath("/obj/item/device/assembly/flash/shield"),
	reqs: null,
});

// /datum/crafting_recipe/strobeshield/proc/<init>  (code/modules/crafting/recipes.dm:50)
rt.def("/datum/crafting_recipe/strobeshield/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/wallframe/flasher"), 1, T("/obj/item/device/assembly/flash/handheld"), 1, T("/obj/item/weapon/shield/riot"), 1]));
	return f.dot;
});

rt.type(1541, "/datum/crafting_recipe/molotov", "/datum/crafting_recipe", {
	name: "Molotov",
	time: 40,
	category: "Weaponry",
	subcategory: "Weapons",
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/drinks/bottle/molotov"),
	reqs: null,
	parts: null,
});

// /datum/crafting_recipe/molotov/proc/<init>  (code/modules/crafting/recipes.dm:60)
rt.def("/datum/crafting_recipe/molotov/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/glass/rag"), 1, T("/obj/item/weapon/reagent_containers/food/drinks/bottle"), 1]));
	$0 = $0;
	rt.setSv(f, "parts", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/drinks/bottle"), 1]));
	return f.dot;
});

rt.type(1542, "/datum/crafting_recipe/stunprod", "/datum/crafting_recipe", {
	name: "Stunprod",
	time: 40,
	category: "Weaponry",
	subcategory: "Weapons",
	result: rt.typePath("/obj/item/weapon/melee/baton/cattleprod"),
	reqs: null,
});

// /datum/crafting_recipe/stunprod/proc/<init>  (code/modules/crafting/recipes.dm:70)
rt.def("/datum/crafting_recipe/stunprod/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/restraints/handcuffs/cable"), 1, T("/obj/item/stack/rods"), 1, T("/obj/item/device/assembly/igniter"), 1]));
	return f.dot;
});

rt.type(1543, "/datum/crafting_recipe/teleprod", "/datum/crafting_recipe", {
	name: "Teleprod",
	time: 40,
	category: "Weaponry",
	subcategory: "Weapons",
	result: rt.typePath("/obj/item/weapon/melee/baton/cattleprod/teleprod"),
	reqs: null,
});

// /datum/crafting_recipe/teleprod/proc/<init>  (code/modules/crafting/recipes.dm:80)
rt.def("/datum/crafting_recipe/teleprod/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/restraints/handcuffs/cable"), 1, T("/obj/item/stack/rods"), 1, T("/obj/item/device/assembly/igniter"), 1, T("/obj/item/weapon/ore/bluespace_crystal"), 1]));
	return f.dot;
});

rt.type(1544, "/datum/crafting_recipe/bola", "/datum/crafting_recipe", {
	name: "Bola",
	time: 20,
	category: "Weapons",
	subcategory: "Weapons",
	result: rt.typePath("/obj/item/weapon/restraints/legcuffs/bola"),
	reqs: null,
});

// /datum/crafting_recipe/bola/proc/<init>  (code/modules/crafting/recipes.dm:91)
rt.def("/datum/crafting_recipe/bola/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/restraints/handcuffs/cable"), 1, T("/obj/item/stack/sheet/metal"), 6]));
	return f.dot;
});

rt.type(1545, "/datum/crafting_recipe/tailclub", "/datum/crafting_recipe", {
	name: "Tail Club",
	time: 40,
	category: "Weaponry",
	subcategory: "Weapons",
	result: rt.typePath("/obj/item/weapon/tailclub"),
	reqs: null,
});

// /datum/crafting_recipe/tailclub/proc/<init>  (code/modules/crafting/recipes.dm:100)
rt.def("/datum/crafting_recipe/tailclub/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/severedtail"), 1, T("/obj/item/stack/sheet/metal"), 1]));
	return f.dot;
});

rt.type(1546, "/datum/crafting_recipe/tailwhip", "/datum/crafting_recipe", {
	name: "Liz O' Nine Tails",
	time: 40,
	category: "Weaponry",
	subcategory: "Weapons",
	result: rt.typePath("/obj/item/weapon/melee/chainofcommand/tailwhip"),
	reqs: null,
});

// /datum/crafting_recipe/tailwhip/proc/<init>  (code/modules/crafting/recipes.dm:109)
rt.def("/datum/crafting_recipe/tailwhip/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/severedtail"), 1, T("/obj/item/stack/cable_coil"), 1]));
	return f.dot;
});

rt.type(1547, "/datum/crafting_recipe/catwhip", "/datum/crafting_recipe", {
	name: "Cat O' Nine Tails",
	time: 40,
	category: "Weaponry",
	subcategory: "Weapons",
	result: rt.typePath("/obj/item/weapon/melee/chainofcommand/tailwhip/kitty"),
	reqs: null,
});

// /datum/crafting_recipe/catwhip/proc/<init>  (code/modules/crafting/recipes.dm:118)
rt.def("/datum/crafting_recipe/catwhip/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/organ/tail/cat"), 1, T("/obj/item/stack/cable_coil"), 1]));
	return f.dot;
});

rt.type(1548, "/datum/crafting_recipe/ed209", "/datum/crafting_recipe", {
	name: "ED209",
	time: 60,
	category: "Robots",
	result: rt.typePath("/mob/living/simple_animal/bot/ed209"),
	reqs: null,
	tools: null,
});

// /datum/crafting_recipe/ed209/proc/<init>  (code/modules/crafting/recipes.dm:127)
rt.def("/datum/crafting_recipe/ed209/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/robot_suit"), 1, T("/obj/item/clothing/head/helmet"), 1, T("/obj/item/clothing/suit/armor/vest"), 1, T("/obj/item/bodypart/l_leg/robot"), 1, T("/obj/item/bodypart/r_leg/robot"), 1, T("/obj/item/stack/sheet/metal"), 1, T("/obj/item/stack/cable_coil"), 1, T("/obj/item/weapon/gun/energy/e_gun/advtaser"), 1, T("/obj/item/weapon/stock_parts/cell"), 1, T("/obj/item/device/assembly/prox_sensor"), 1]));
	$0 = $0;
	rt.setSv(f, "tools", rt.list(T("/obj/item/weapon/weldingtool"), T("/obj/item/weapon/screwdriver")));
	return f.dot;
});

rt.type(1549, "/datum/crafting_recipe/secbot", "/datum/crafting_recipe", {
	name: "Secbot",
	time: 60,
	category: "Robots",
	result: rt.typePath("/mob/living/simple_animal/bot/secbot"),
	reqs: null,
	tools: null,
});

// /datum/crafting_recipe/secbot/proc/<init>  (code/modules/crafting/recipes.dm:144)
rt.def("/datum/crafting_recipe/secbot/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/device/assembly/signaler"), 1, T("/obj/item/clothing/head/helmet/sec"), 1, T("/obj/item/weapon/melee/baton"), 1, T("/obj/item/device/assembly/prox_sensor"), 1, T("/obj/item/bodypart/r_arm/robot"), 1]));
	$0 = $0;
	rt.setSv(f, "tools", rt.list(T("/obj/item/weapon/weldingtool")));
	return f.dot;
});

rt.type(1550, "/datum/crafting_recipe/cleanbot", "/datum/crafting_recipe", {
	name: "Cleanbot",
	time: 40,
	category: "Robots",
	result: rt.typePath("/mob/living/simple_animal/bot/cleanbot"),
	reqs: null,
});

// /datum/crafting_recipe/cleanbot/proc/<init>  (code/modules/crafting/recipes.dm:156)
rt.def("/datum/crafting_recipe/cleanbot/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/glass/bucket"), 1, T("/obj/item/device/assembly/prox_sensor"), 1, T("/obj/item/bodypart/r_arm/robot"), 1]));
	return f.dot;
});

rt.type(1551, "/datum/crafting_recipe/floorbot", "/datum/crafting_recipe", {
	name: "Floorbot",
	time: 40,
	category: "Robots",
	result: rt.typePath("/mob/living/simple_animal/bot/floorbot"),
	reqs: null,
});

// /datum/crafting_recipe/floorbot/proc/<init>  (code/modules/crafting/recipes.dm:165)
rt.def("/datum/crafting_recipe/floorbot/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/storage/toolbox/mechanical"), 1, T("/obj/item/stack/tile/plasteel"), 1, T("/obj/item/device/assembly/prox_sensor"), 1, T("/obj/item/bodypart/r_arm/robot"), 1]));
	return f.dot;
});

rt.type(1552, "/datum/crafting_recipe/medbot", "/datum/crafting_recipe", {
	name: "Medbot",
	time: 40,
	category: "Robots",
	result: rt.typePath("/mob/living/simple_animal/bot/medbot"),
	reqs: null,
});

// /datum/crafting_recipe/medbot/proc/<init>  (code/modules/crafting/recipes.dm:175)
rt.def("/datum/crafting_recipe/medbot/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/device/healthanalyzer"), 1, T("/obj/item/weapon/storage/firstaid"), 1, T("/obj/item/device/assembly/prox_sensor"), 1, T("/obj/item/bodypart/r_arm/robot"), 1]));
	return f.dot;
});

rt.type(1553, "/datum/crafting_recipe/improvised_pneumatic_cannon", "/datum/crafting_recipe", {
	name: "Pneumatic Cannon",
	time: 300,
	category: "Weaponry",
	subcategory: "Weapons",
	result: rt.typePath("/obj/item/weapon/pneumatic_cannon/ghetto"),
	tools: null,
	reqs: null,
});

// /datum/crafting_recipe/improvised_pneumatic_cannon/proc/<init>  (code/modules/crafting/recipes.dm:185)
rt.def("/datum/crafting_recipe/improvised_pneumatic_cannon/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tools", rt.list(T("/obj/item/weapon/weldingtool"), T("/obj/item/weapon/wrench")));
	$0 = $0;
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/stack/sheet/metal"), 4, T("/obj/item/stack/packageWrap"), 8, T("/obj/item/pipe"), 2]));
	return f.dot;
});

rt.type(1554, "/datum/crafting_recipe/flamethrower", "/datum/crafting_recipe", {
	name: "Flamethrower",
	time: 10,
	category: "Weaponry",
	subcategory: "Weapons",
	result: rt.typePath("/obj/item/weapon/flamethrower"),
	reqs: null,
	parts: null,
	tools: null,
});

// /datum/crafting_recipe/flamethrower/proc/<init>  (code/modules/crafting/recipes.dm:197)
rt.def("/datum/crafting_recipe/flamethrower/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/weldingtool"), 1, T("/obj/item/device/assembly/igniter"), 1, T("/obj/item/stack/rods"), 1]));
	$0 = $0;
	rt.setSv(f, "parts", rt.alist(f, [T("/obj/item/device/assembly/igniter"), 1, T("/obj/item/weapon/weldingtool"), 1]));
	$0 = $0;
	rt.setSv(f, "tools", rt.list(T("/obj/item/weapon/screwdriver")));
	return f.dot;
});

rt.type(1555, "/datum/crafting_recipe/meteorshot", "/datum/crafting_recipe", {
	name: "Meteorshot Shell",
	time: 5,
	category: "Weaponry",
	subcategory: "Ammunition",
	result: rt.typePath("/obj/item/ammo_casing/shotgun/meteorshot"),
	reqs: null,
	tools: null,
});

// /datum/crafting_recipe/meteorshot/proc/<init>  (code/modules/crafting/recipes.dm:210)
rt.def("/datum/crafting_recipe/meteorshot/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/ammo_casing/shotgun/techshell"), 1, T("/obj/item/weapon/rcd_ammo"), 1, T("/obj/item/weapon/stock_parts/manipulator"), 2]));
	$0 = $0;
	rt.setSv(f, "tools", rt.list(T("/obj/item/weapon/screwdriver")));
	return f.dot;
});

rt.type(1556, "/datum/crafting_recipe/pulseslug", "/datum/crafting_recipe", {
	name: "Pulse Slug Shell",
	time: 5,
	category: "Weaponry",
	subcategory: "Ammunition",
	result: rt.typePath("/obj/item/ammo_casing/shotgun/pulseslug"),
	reqs: null,
	tools: null,
});

// /datum/crafting_recipe/pulseslug/proc/<init>  (code/modules/crafting/recipes.dm:221)
rt.def("/datum/crafting_recipe/pulseslug/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/ammo_casing/shotgun/techshell"), 1, T("/obj/item/weapon/stock_parts/capacitor/adv"), 2, T("/obj/item/weapon/stock_parts/micro_laser/ultra"), 1]));
	$0 = $0;
	rt.setSv(f, "tools", rt.list(T("/obj/item/weapon/screwdriver")));
	return f.dot;
});

rt.type(1557, "/datum/crafting_recipe/dragonsbreath", "/datum/crafting_recipe", {
	name: "Dragonsbreath Shell",
	time: 5,
	category: "Weaponry",
	subcategory: "Ammunition",
	result: rt.typePath("/obj/item/ammo_casing/shotgun/incendiary/dragonsbreath"),
	reqs: null,
	tools: null,
});

// /datum/crafting_recipe/dragonsbreath/proc/<init>  (code/modules/crafting/recipes.dm:232)
rt.def("/datum/crafting_recipe/dragonsbreath/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/ammo_casing/shotgun/techshell"), 1, T("/datum/reagent/phosphorus"), 5]));
	$0 = $0;
	rt.setSv(f, "tools", rt.list(T("/obj/item/weapon/screwdriver")));
	return f.dot;
});

rt.type(1558, "/datum/crafting_recipe/frag12", "/datum/crafting_recipe", {
	name: "FRAG-12 Shell",
	time: 5,
	category: "Weaponry",
	subcategory: "Ammunition",
	result: rt.typePath("/obj/item/ammo_casing/shotgun/frag12"),
	reqs: null,
	tools: null,
});

// /datum/crafting_recipe/frag12/proc/<init>  (code/modules/crafting/recipes.dm:241)
rt.def("/datum/crafting_recipe/frag12/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/ammo_casing/shotgun/techshell"), 1, T("/datum/reagent/glycerol"), 5, T("/datum/reagent/toxin/acid"), 5, T("/datum/reagent/toxin/acid/fluacid"), 5]));
	$0 = $0;
	rt.setSv(f, "tools", rt.list(T("/obj/item/weapon/screwdriver")));
	return f.dot;
});

rt.type(1559, "/datum/crafting_recipe/ionslug", "/datum/crafting_recipe", {
	name: "Ion Scatter Shell",
	time: 5,
	category: "Weaponry",
	subcategory: "Ammunition",
	result: rt.typePath("/obj/item/ammo_casing/shotgun/ion"),
	reqs: null,
	tools: null,
});

// /datum/crafting_recipe/ionslug/proc/<init>  (code/modules/crafting/recipes.dm:253)
rt.def("/datum/crafting_recipe/ionslug/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/ammo_casing/shotgun/techshell"), 1, T("/obj/item/weapon/stock_parts/micro_laser/ultra"), 1, T("/obj/item/weapon/stock_parts/subspace/crystal"), 1]));
	$0 = $0;
	rt.setSv(f, "tools", rt.list(T("/obj/item/weapon/screwdriver")));
	return f.dot;
});

rt.type(1560, "/datum/crafting_recipe/improvisedslug", "/datum/crafting_recipe", {
	name: "Improvised Shotgun Shell",
	time: 5,
	category: "Weaponry",
	subcategory: "Ammunition",
	result: rt.typePath("/obj/item/ammo_casing/shotgun/improvised"),
	reqs: null,
	tools: null,
});

// /datum/crafting_recipe/improvisedslug/proc/<init>  (code/modules/crafting/recipes.dm:264)
rt.def("/datum/crafting_recipe/improvisedslug/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/grenade/chem_grenade"), 1, T("/obj/item/stack/sheet/metal"), 1, T("/obj/item/stack/cable_coil"), 1, T("/datum/reagent/fuel"), 10]));
	$0 = $0;
	rt.setSv(f, "tools", rt.list(T("/obj/item/weapon/screwdriver")));
	return f.dot;
});

rt.type(1561, "/datum/crafting_recipe/improvisedslugoverload", "/datum/crafting_recipe", {
	name: "Overload Improvised Shell",
	time: 5,
	category: "Weaponry",
	subcategory: "Ammunition",
	result: rt.typePath("/obj/item/ammo_casing/shotgun/improvised/overload"),
	reqs: null,
	tools: null,
});

// /datum/crafting_recipe/improvisedslugoverload/proc/<init>  (code/modules/crafting/recipes.dm:276)
rt.def("/datum/crafting_recipe/improvisedslugoverload/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/ammo_casing/shotgun/improvised"), 1, T("/datum/reagent/blackpowder"), 10, T("/datum/reagent/toxin/plasma"), 20]));
	$0 = $0;
	rt.setSv(f, "tools", rt.list(T("/obj/item/weapon/screwdriver")));
	return f.dot;
});

rt.type(1562, "/datum/crafting_recipe/laserslug", "/datum/crafting_recipe", {
	name: "Laser Slug Shell",
	time: 5,
	category: "Weaponry",
	subcategory: "Ammunition",
	result: rt.typePath("/obj/item/ammo_casing/shotgun/laserslug"),
	reqs: null,
	tools: null,
});

// /datum/crafting_recipe/laserslug/proc/<init>  (code/modules/crafting/recipes.dm:287)
rt.def("/datum/crafting_recipe/laserslug/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/ammo_casing/shotgun/techshell"), 1, T("/obj/item/weapon/stock_parts/capacitor/adv"), 1, T("/obj/item/weapon/stock_parts/micro_laser/high"), 1]));
	$0 = $0;
	rt.setSv(f, "tools", rt.list(T("/obj/item/weapon/screwdriver")));
	return f.dot;
});

rt.type(1563, "/datum/crafting_recipe/ishotgun", "/datum/crafting_recipe", {
	name: "Improvised Shotgun",
	time: 100,
	category: "Weaponry",
	subcategory: "Weapons",
	result: rt.typePath("/obj/item/weapon/gun/ballistic/revolver/doublebarrel/improvised"),
	reqs: null,
	tools: null,
});

// /datum/crafting_recipe/ishotgun/proc/<init>  (code/modules/crafting/recipes.dm:298)
rt.def("/datum/crafting_recipe/ishotgun/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weaponcrafting/receiver"), 1, T("/obj/item/pipe"), 1, T("/obj/item/weaponcrafting/stock"), 1, T("/obj/item/stack/packageWrap"), 5]));
	$0 = $0;
	rt.setSv(f, "tools", rt.list(T("/obj/item/weapon/screwdriver")));
	return f.dot;
});

rt.type(1564, "/datum/crafting_recipe/chainsaw", "/datum/crafting_recipe", {
	name: "Chainsaw",
	time: 50,
	category: "Weaponry",
	subcategory: "Weapons",
	result: rt.typePath("/obj/item/weapon/twohanded/required/chainsaw"),
	reqs: null,
	tools: null,
});

// /datum/crafting_recipe/chainsaw/proc/<init>  (code/modules/crafting/recipes.dm:310)
rt.def("/datum/crafting_recipe/chainsaw/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/circular_saw"), 1, T("/obj/item/stack/cable_coil"), 1, T("/obj/item/stack/sheet/plasteel"), 1]));
	$0 = $0;
	rt.setSv(f, "tools", rt.list(T("/obj/item/weapon/weldingtool")));
	return f.dot;
});

rt.type(1565, "/datum/crafting_recipe/spear", "/datum/crafting_recipe", {
	name: "Spear",
	time: 40,
	category: "Weaponry",
	subcategory: "Weapons",
	result: rt.typePath("/obj/item/weapon/twohanded/spear"),
	reqs: null,
});

// /datum/crafting_recipe/spear/proc/<init>  (code/modules/crafting/recipes.dm:321)
rt.def("/datum/crafting_recipe/spear/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/restraints/handcuffs/cable"), 1, T("/obj/item/weapon/shard"), 1, T("/obj/item/stack/rods"), 1]));
	return f.dot;
});

rt.type(1566, "/datum/crafting_recipe/spooky_camera", "/datum/crafting_recipe", {
	name: "Camera Obscura",
	time: 15,
	category: "Misc",
	result: rt.typePath("/obj/item/device/camera/spooky"),
	reqs: null,
	parts: null,
});

// /datum/crafting_recipe/spooky_camera/proc/<init>  (code/modules/crafting/recipes.dm:332)
rt.def("/datum/crafting_recipe/spooky_camera/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/device/camera"), 1, T("/datum/reagent/water/holywater"), 10]));
	$0 = $0;
	rt.setSv(f, "parts", rt.alist(f, [T("/obj/item/device/camera"), 1]));
	return f.dot;
});

rt.type(1567, "/datum/crafting_recipe/lizardhat", "/datum/crafting_recipe", {
	name: "Lizard Cloche Hat",
	time: 10,
	category: "Misc",
	result: rt.typePath("/obj/item/clothing/head/lizard"),
	reqs: null,
});

// /datum/crafting_recipe/lizardhat/proc/<init>  (code/modules/crafting/recipes.dm:341)
rt.def("/datum/crafting_recipe/lizardhat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/severedtail"), 1]));
	return f.dot;
});

rt.type(1568, "/datum/crafting_recipe/lizardhat_alternate", "/datum/crafting_recipe", {
	name: "Lizard Cloche Hat",
	time: 10,
	category: "Misc",
	result: rt.typePath("/obj/item/clothing/head/lizard"),
	reqs: null,
});

// /datum/crafting_recipe/lizardhat_alternate/proc/<init>  (code/modules/crafting/recipes.dm:348)
rt.def("/datum/crafting_recipe/lizardhat_alternate/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/stack/sheet/animalhide/lizard"), 1]));
	return f.dot;
});

rt.type(1569, "/datum/crafting_recipe/kittyears", "/datum/crafting_recipe", {
	name: "Kitty Ears",
	time: 10,
	category: "Misc",
	result: rt.typePath("/obj/item/clothing/head/kitty/genuine"),
	reqs: null,
});

// /datum/crafting_recipe/kittyears/proc/<init>  (code/modules/crafting/recipes.dm:355)
rt.def("/datum/crafting_recipe/kittyears/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/organ/tail/cat"), 1, T("/obj/item/organ/ears/cat"), 1]));
	return f.dot;
});

rt.type(1570, "/datum/crafting_recipe/skateboard", "/datum/crafting_recipe", {
	name: "Skateboard",
	time: 60,
	category: "Misc",
	result: rt.typePath("/obj/vehicle/scooter/skateboard"),
	reqs: null,
});

// /datum/crafting_recipe/skateboard/proc/<init>  (code/modules/crafting/recipes.dm:363)
rt.def("/datum/crafting_recipe/skateboard/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/stack/sheet/metal"), 5, T("/obj/item/stack/rods"), 10]));
	return f.dot;
});

rt.type(1571, "/datum/crafting_recipe/scooter", "/datum/crafting_recipe", {
	name: "Scooter",
	time: 65,
	category: "Misc",
	result: rt.typePath("/obj/vehicle/scooter"),
	reqs: null,
});

// /datum/crafting_recipe/scooter/proc/<init>  (code/modules/crafting/recipes.dm:371)
rt.def("/datum/crafting_recipe/scooter/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/stack/sheet/metal"), 5, T("/obj/item/stack/rods"), 12]));
	return f.dot;
});

rt.type(1572, "/datum/crafting_recipe/papersack", "/datum/crafting_recipe", {
	name: "Paper Sack",
	time: 10,
	category: "Misc",
	result: rt.typePath("/obj/item/weapon/storage/box/papersack"),
	reqs: null,
});

// /datum/crafting_recipe/papersack/proc/<init>  (code/modules/crafting/recipes.dm:379)
rt.def("/datum/crafting_recipe/papersack/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/paper"), 5]));
	return f.dot;
});

rt.type(1573, "/datum/crafting_recipe/flashlight_eyes", "/datum/crafting_recipe", {
	name: "Flashlight Eyes",
	time: 10,
	category: "Misc",
	result: rt.typePath("/obj/item/organ/eyes/robotic/flashlight"),
	reqs: null,
});

// /datum/crafting_recipe/flashlight_eyes/proc/<init>  (code/modules/crafting/recipes.dm:387)
rt.def("/datum/crafting_recipe/flashlight_eyes/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/device/flashlight"), 2, T("/obj/item/weapon/restraints/handcuffs/cable"), 1]));
	return f.dot;
});

rt.type(1574, "/datum/crafting_recipe/paperframes", "/datum/crafting_recipe", {
	name: "Paper Frames",
	time: 10,
	category: "Misc",
	result: rt.typePath("/obj/item/stack/sheet/paperframes/five"),
	reqs: null,
});

// /datum/crafting_recipe/paperframes/proc/<init>  (code/modules/crafting/recipes.dm:397)
rt.def("/datum/crafting_recipe/paperframes/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/stack/sheet/mineral/wood"), 5, T("/obj/item/weapon/paper"), 20]));
	return f.dot;
});

rt.type(1575, "/datum/crafting_recipe/naturalpaper", "/datum/crafting_recipe", {
	name: "Hand-Pressed Paper",
	time: 30,
	category: "Misc",
	reqs: null,
	tools: null,
	result: rt.typePath("/obj/item/weapon/paper_bin/bundlenatural"),
});

// /datum/crafting_recipe/naturalpaper/proc/<init>  (code/modules/crafting/recipes.dm:403)
rt.def("/datum/crafting_recipe/naturalpaper/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/datum/reagent/water"), 50, T("/obj/item/stack/sheet/mineral/wood"), 1]));
	$0 = $0;
	rt.setSv(f, "tools", rt.list(T("/obj/item/weapon/hatchet")));
	return f.dot;
});

rt.type(1576, "/datum/crafting_recipe/toysword", "/datum/crafting_recipe", {
	name: "Toy Sword",
	category: "Misc",
	reqs: null,
	result: rt.typePath("/obj/item/toy/sword"),
});

// /datum/crafting_recipe/toysword/proc/<init>  (code/modules/crafting/recipes.dm:410)
rt.def("/datum/crafting_recipe/toysword/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/light/bulb"), 1, T("/obj/item/stack/cable_coil"), 1, T("/obj/item/stack/sheet/plastic"), 4]));
	return f.dot;
});

rt.type(1577, "/datum/crafting_recipe/blackcarpet", "/datum/crafting_recipe", {
	name: "Black Carpet",
	category: "Misc",
	reqs: null,
	result: rt.typePath("/obj/item/stack/tile/carpet/black/fifty"),
});

// /datum/crafting_recipe/blackcarpet/proc/<init>  (code/modules/crafting/recipes.dm:416)
rt.def("/datum/crafting_recipe/blackcarpet/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/stack/tile/carpet"), 50, T("/obj/item/toy/crayon/black"), 1]));
	return f.dot;
});

rt.type(1578, "/datum/crafting_recipe/showercurtain", "/datum/crafting_recipe", {
	name: "Shower Curtains",
	category: "Misc",
	reqs: null,
	result: rt.typePath("/obj/structure/curtain"),
});

// /datum/crafting_recipe/showercurtain/proc/<init>  (code/modules/crafting/recipes.dm:422)
rt.def("/datum/crafting_recipe/showercurtain/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/stack/sheet/cloth"), 2, T("/obj/item/stack/sheet/plastic"), 2, T("/obj/item/stack/rods"), 1]));
	return f.dot;
});

rt.type(1579, "/datum/crafting_recipe/chemical_payload", "/datum/crafting_recipe", {
	name: "Chemical Payload (C4)",
	time: 30,
	category: "Weaponry",
	subcategory: "Weapons",
	result: rt.typePath("/obj/item/weapon/bombcore/chemical"),
	reqs: null,
	parts: null,
});

// /datum/crafting_recipe/chemical_payload/proc/<init>  (code/modules/crafting/recipes.dm:430)
rt.def("/datum/crafting_recipe/chemical_payload/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/stock_parts/matter_bin"), 1, T("/obj/item/weapon/grenade/plastic/c4"), 1, T("/obj/item/weapon/grenade/chem_grenade"), 2]));
	$0 = $0;
	rt.setSv(f, "parts", rt.alist(f, [T("/obj/item/weapon/stock_parts/matter_bin"), 1, T("/obj/item/weapon/grenade/chem_grenade"), 2]));
	return f.dot;
});

rt.type(1580, "/datum/crafting_recipe/chemical_payload2", "/datum/crafting_recipe", {
	name: "Chemical Payload (gibtonite)",
	time: 50,
	category: "Weaponry",
	subcategory: "Weapons",
	result: rt.typePath("/obj/item/weapon/bombcore/chemical"),
	reqs: null,
	parts: null,
});

// /datum/crafting_recipe/chemical_payload2/proc/<init>  (code/modules/crafting/recipes.dm:443)
rt.def("/datum/crafting_recipe/chemical_payload2/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/stock_parts/matter_bin"), 1, T("/obj/item/weapon/twohanded/required/gibtonite"), 1, T("/obj/item/weapon/grenade/chem_grenade"), 2]));
	$0 = $0;
	rt.setSv(f, "parts", rt.alist(f, [T("/obj/item/weapon/stock_parts/matter_bin"), 1, T("/obj/item/weapon/grenade/chem_grenade"), 2]));
	return f.dot;
});

rt.type(1581, "/datum/crafting_recipe/bonearmor", "/datum/crafting_recipe", {
	name: "Bone Armor",
	time: 30,
	category: "Tribal",
	result: rt.typePath("/obj/item/clothing/suit/armor/bone"),
	reqs: null,
});

// /datum/crafting_recipe/bonearmor/proc/<init>  (code/modules/crafting/recipes.dm:457)
rt.def("/datum/crafting_recipe/bonearmor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/stack/sheet/bone"), 6]));
	return f.dot;
});

rt.type(1582, "/datum/crafting_recipe/bonetalisman", "/datum/crafting_recipe", {
	name: "Bone Talisman",
	time: 20,
	category: "Tribal",
	result: rt.typePath("/obj/item/clothing/accessory/talisman"),
	reqs: null,
});

// /datum/crafting_recipe/bonetalisman/proc/<init>  (code/modules/crafting/recipes.dm:464)
rt.def("/datum/crafting_recipe/bonetalisman/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/stack/sheet/bone"), 2, T("/obj/item/stack/sheet/sinew"), 1]));
	return f.dot;
});

rt.type(1583, "/datum/crafting_recipe/bonecodpiece", "/datum/crafting_recipe", {
	name: "Skull Codpiece",
	time: 20,
	category: "Tribal",
	result: rt.typePath("/obj/item/clothing/accessory/skullcodpiece"),
	reqs: null,
});

// /datum/crafting_recipe/bonecodpiece/proc/<init>  (code/modules/crafting/recipes.dm:472)
rt.def("/datum/crafting_recipe/bonecodpiece/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/stack/sheet/bone"), 2, T("/obj/item/stack/sheet/animalhide/goliath_hide"), 1]));
	return f.dot;
});

rt.type(1584, "/datum/crafting_recipe/bracers", "/datum/crafting_recipe", {
	name: "Bone Bracers",
	time: 20,
	category: "Tribal",
	result: rt.typePath("/obj/item/clothing/gloves/bracer"),
	reqs: null,
});

// /datum/crafting_recipe/bracers/proc/<init>  (code/modules/crafting/recipes.dm:480)
rt.def("/datum/crafting_recipe/bracers/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/stack/sheet/bone"), 2, T("/obj/item/stack/sheet/sinew"), 1]));
	return f.dot;
});

rt.type(1585, "/datum/crafting_recipe/skullhelm", "/datum/crafting_recipe", {
	name: "Skull Helmet",
	time: 30,
	category: "Tribal",
	result: rt.typePath("/obj/item/clothing/head/helmet/skull"),
	reqs: null,
});

// /datum/crafting_recipe/skullhelm/proc/<init>  (code/modules/crafting/recipes.dm:488)
rt.def("/datum/crafting_recipe/skullhelm/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/stack/sheet/bone"), 4]));
	return f.dot;
});

rt.type(1586, "/datum/crafting_recipe/goliathcloak", "/datum/crafting_recipe", {
	name: "Goliath Cloak",
	time: 50,
	category: "Tribal",
	result: rt.typePath("/obj/item/clothing/suit/hooded/cloak/goliath"),
	reqs: null,
});

// /datum/crafting_recipe/goliathcloak/proc/<init>  (code/modules/crafting/recipes.dm:495)
rt.def("/datum/crafting_recipe/goliathcloak/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/stack/sheet/leather"), 2, T("/obj/item/stack/sheet/sinew"), 2, T("/obj/item/stack/sheet/animalhide/goliath_hide"), 2]));
	return f.dot;
});

rt.type(1587, "/datum/crafting_recipe/drakecloak", "/datum/crafting_recipe", {
	name: "Ash Drake Armour",
	time: 60,
	category: "Tribal",
	result: rt.typePath("/obj/item/clothing/suit/hooded/cloak/drake"),
	reqs: null,
});

// /datum/crafting_recipe/drakecloak/proc/<init>  (code/modules/crafting/recipes.dm:504)
rt.def("/datum/crafting_recipe/drakecloak/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/stack/sheet/bone"), 10, T("/obj/item/stack/sheet/sinew"), 2, T("/obj/item/stack/sheet/animalhide/ashdrake"), 5]));
	return f.dot;
});

rt.type(1588, "/datum/crafting_recipe/gold_horn", "/datum/crafting_recipe", {
	name: "Golden bike horn",
	time: 20,
	category: "Misc",
	result: rt.typePath("/obj/item/weapon/bikehorn/golden"),
	reqs: null,
});

// /datum/crafting_recipe/gold_horn/proc/<init>  (code/modules/crafting/recipes.dm:513)
rt.def("/datum/crafting_recipe/gold_horn/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/stack/sheet/mineral/bananium"), 5, null, T("/obj/item/weapon/bikehorn")]));
	return f.dot;
});

rt.type(1589, "/datum/crafting_recipe/bonedagger", "/datum/crafting_recipe", {
	name: "Bone Dagger",
	time: 20,
	category: "Tribal",
	result: rt.typePath("/obj/item/weapon/kitchen/knife/combat/bone"),
	reqs: null,
});

// /datum/crafting_recipe/bonedagger/proc/<init>  (code/modules/crafting/recipes.dm:521)
rt.def("/datum/crafting_recipe/bonedagger/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/stack/sheet/bone"), 2]));
	return f.dot;
});

rt.type(1590, "/datum/crafting_recipe/bonespear", "/datum/crafting_recipe", {
	name: "Bone Spear",
	time: 30,
	category: "Tribal",
	result: rt.typePath("/obj/item/weapon/twohanded/bonespear"),
	reqs: null,
});

// /datum/crafting_recipe/bonespear/proc/<init>  (code/modules/crafting/recipes.dm:528)
rt.def("/datum/crafting_recipe/bonespear/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/stack/sheet/bone"), 4, T("/obj/item/stack/sheet/sinew"), 1]));
	return f.dot;
});

rt.type(1591, "/datum/crafting_recipe/boneaxe", "/datum/crafting_recipe", {
	name: "Bone Axe",
	time: 50,
	category: "Tribal",
	result: rt.typePath("/obj/item/weapon/twohanded/fireaxe/boneaxe"),
	reqs: null,
});

// /datum/crafting_recipe/boneaxe/proc/<init>  (code/modules/crafting/recipes.dm:536)
rt.def("/datum/crafting_recipe/boneaxe/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/stack/sheet/bone"), 6, T("/obj/item/stack/sheet/sinew"), 3]));
	return f.dot;
});

rt.type(1592, "/datum/crafting_recipe/bonfire", "/datum/crafting_recipe", {
	name: "Bonfire",
	time: 60,
	category: "Tribal",
	reqs: null,
	result: rt.typePath("/obj/structure/bonfire"),
});

// /datum/crafting_recipe/bonfire/proc/<init>  (code/modules/crafting/recipes.dm:543)
rt.def("/datum/crafting_recipe/bonfire/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/grown/log"), 5]));
	return f.dot;
});

rt.type(1593, "/datum/crafting_recipe/smallcarton", "/datum/crafting_recipe", {
	name: "Small Carton",
	time: 10,
	category: "Misc",
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/drinks/sillycup/smallcarton"),
	reqs: null,
});

// /datum/crafting_recipe/smallcarton/proc/<init>  (code/modules/crafting/recipes.dm:551)
rt.def("/datum/crafting_recipe/smallcarton/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/stack/sheet/cardboard"), 1]));
	return f.dot;
});

rt.type(1594, "/datum/crafting_recipe/pressureplate", "/datum/crafting_recipe", {
	name: "Pressure Plate",
	time: 5,
	category: "Misc",
	result: rt.typePath("/obj/item/device/pressure_plate"),
	reqs: null,
});

// /datum/crafting_recipe/pressureplate/proc/<init>  (code/modules/crafting/recipes.dm:558)
rt.def("/datum/crafting_recipe/pressureplate/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/stack/sheet/plasteel"), 1, T("/obj/item/stack/tile/plasteel"), 1, T("/obj/item/stack/cable_coil"), 2]));
	return f.dot;
});
