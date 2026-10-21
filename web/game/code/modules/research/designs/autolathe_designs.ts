// From code/modules/research/designs/autolathe_designs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(2992, "/datum/design/bucket", "/datum/design", {
	name: "Bucket",
	id: "bucket",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/reagent_containers/glass/bucket"),
});

// /datum/design/bucket/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:9)
rt.def("/datum/design/bucket/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 200]));
	rt.setSv(f, "category", rt.list("initial", "Tools"));
	return f.dot;
});

rt.type(2993, "/datum/design/crowbar", "/datum/design", {
	name: "Pocket Crowbar",
	id: "crowbar",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/crowbar"),
});

// /datum/design/crowbar/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:17)
rt.def("/datum/design/crowbar/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 50]));
	rt.setSv(f, "category", rt.list("initial", "Tools"));
	return f.dot;
});

rt.type(2994, "/datum/design/flashlight", "/datum/design", {
	name: "Flashlight",
	id: "flashlight",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/device/flashlight"),
});

// /datum/design/flashlight/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:25)
rt.def("/datum/design/flashlight/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 50, "$glass", 20]));
	rt.setSv(f, "category", rt.list("initial", "Tools"));
	return f.dot;
});

rt.type(2995, "/datum/design/extinguisher", "/datum/design", {
	name: "Fire Extinguisher",
	id: "extinguisher",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/extinguisher"),
});

// /datum/design/extinguisher/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:33)
rt.def("/datum/design/extinguisher/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 90]));
	rt.setSv(f, "category", rt.list("initial", "Tools"));
	return f.dot;
});

rt.type(2996, "/datum/design/multitool", "/datum/design", {
	name: "Multitool",
	id: "multitool",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/device/multitool"),
});

// /datum/design/multitool/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:41)
rt.def("/datum/design/multitool/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 50, "$glass", 20]));
	rt.setSv(f, "category", rt.list("initial", "Tools"));
	return f.dot;
});

rt.type(2997, "/datum/design/analyzer", "/datum/design", {
	name: "Analyzer",
	id: "analyzer",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/device/analyzer"),
});

// /datum/design/analyzer/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:49)
rt.def("/datum/design/analyzer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 30, "$glass", 20]));
	rt.setSv(f, "category", rt.list("initial", "Tools"));
	return f.dot;
});

rt.type(2998, "/datum/design/tscanner", "/datum/design", {
	name: "T-Ray Scanner",
	id: "tscanner",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/device/t_scanner"),
});

// /datum/design/tscanner/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:57)
rt.def("/datum/design/tscanner/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 150]));
	rt.setSv(f, "category", rt.list("initial", "Tools"));
	return f.dot;
});

rt.type(2999, "/datum/design/weldingtool", "/datum/design", {
	name: "Welding Tool",
	id: "welding_tool",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/weldingtool"),
});

// /datum/design/weldingtool/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:65)
rt.def("/datum/design/weldingtool/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 70, "$glass", 20]));
	rt.setSv(f, "category", rt.list("initial", "Tools"));
	return f.dot;
});

rt.type(3000, "/datum/design/mini_weldingtool", "/datum/design", {
	name: "Emergency Welding Tool",
	id: "mini_welding_tool",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/weldingtool/mini"),
});

// /datum/design/mini_weldingtool/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:73)
rt.def("/datum/design/mini_weldingtool/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 30, "$glass", 10]));
	rt.setSv(f, "category", rt.list("initial", "Tools"));
	return f.dot;
});

rt.type(3001, "/datum/design/screwdriver", "/datum/design", {
	name: "Screwdriver",
	id: "screwdriver",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/screwdriver"),
});

// /datum/design/screwdriver/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:81)
rt.def("/datum/design/screwdriver/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 75]));
	rt.setSv(f, "category", rt.list("initial", "Tools"));
	return f.dot;
});

rt.type(3002, "/datum/design/wirecutters", "/datum/design", {
	name: "Wirecutters",
	id: "wirecutters",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/wirecutters"),
});

// /datum/design/wirecutters/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:89)
rt.def("/datum/design/wirecutters/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 80]));
	rt.setSv(f, "category", rt.list("initial", "Tools"));
	return f.dot;
});

rt.type(3003, "/datum/design/wrench", "/datum/design", {
	name: "Wrench",
	id: "wrench",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/wrench"),
});

// /datum/design/wrench/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:97)
rt.def("/datum/design/wrench/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 150]));
	rt.setSv(f, "category", rt.list("initial", "Tools"));
	return f.dot;
});

rt.type(3004, "/datum/design/welding_helmet", "/datum/design", {
	name: "Welding Helmet",
	id: "welding_helmet",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/clothing/head/welding"),
});

// /datum/design/welding_helmet/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:105)
rt.def("/datum/design/welding_helmet/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 1750, "$glass", 400]));
	rt.setSv(f, "category", rt.list("initial", "Tools"));
	return f.dot;
});

rt.type(3005, "/datum/design/cable_coil", "/datum/design", {
	name: "Cable Coil",
	id: "cable_coil",
	build_type: 4,
	materials: null,
	category: null,
	maxstack: 30,
	build_path: rt.typePath("/obj/item/stack/cable_coil/random"),
});

// /datum/design/cable_coil/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:113)
rt.def("/datum/design/cable_coil/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 10, "$glass", 5]));
	rt.setSv(f, "category", rt.list("initial", "Tools"));
	return f.dot;
});

rt.type(3006, "/datum/design/toolbox", "/datum/design", {
	name: "Toolbox",
	id: "tool_box",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/storage/toolbox"),
});

// /datum/design/toolbox/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:122)
rt.def("/datum/design/toolbox/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 500]));
	rt.setSv(f, "category", rt.list("initial", "Tools"));
	return f.dot;
});

rt.type(3007, "/datum/design/console_screen", "/datum/design", {
	name: "Console Screen",
	id: "console_screen",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/stock_parts/console_screen"),
});

// /datum/design/console_screen/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:130)
rt.def("/datum/design/console_screen/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 200]));
	rt.setSv(f, "category", rt.list("initial", "Electronics"));
	return f.dot;
});

rt.type(3008, "/datum/design/apc_board", "/datum/design", {
	name: "APC Module",
	id: "power control",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/electronics/apc"),
});

// /datum/design/apc_board/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:138)
rt.def("/datum/design/apc_board/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 100, "$glass", 100]));
	rt.setSv(f, "category", rt.list("initial", "Electronics"));
	return f.dot;
});

rt.type(3009, "/datum/design/airlock_board", "/datum/design", {
	name: "Airlock Electronics",
	id: "airlock_board",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/electronics/airlock"),
});

// /datum/design/airlock_board/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:146)
rt.def("/datum/design/airlock_board/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 50, "$glass", 50]));
	rt.setSv(f, "category", rt.list("initial", "Electronics"));
	return f.dot;
});

rt.type(3010, "/datum/design/firelock_board", "/datum/design", {
	name: "Firelock Circuitry",
	id: "firelock_board",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/electronics/firelock"),
});

// /datum/design/firelock_board/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:154)
rt.def("/datum/design/firelock_board/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 50, "$glass", 50]));
	rt.setSv(f, "category", rt.list("initial", "Electronics"));
	return f.dot;
});

rt.type(3011, "/datum/design/airalarm_electronics", "/datum/design", {
	name: "Air Alarm Electronics",
	id: "airalarm_electronics",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/electronics/airalarm"),
});

// /datum/design/airalarm_electronics/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:162)
rt.def("/datum/design/airalarm_electronics/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 50, "$glass", 50]));
	rt.setSv(f, "category", rt.list("initial", "Electronics"));
	return f.dot;
});

rt.type(3012, "/datum/design/firealarm_electronics", "/datum/design", {
	name: "Fire Alarm Electronics",
	id: "firealarm_electronics",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/electronics/firealarm"),
});

// /datum/design/firealarm_electronics/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:170)
rt.def("/datum/design/firealarm_electronics/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 50, "$glass", 50]));
	rt.setSv(f, "category", rt.list("initial", "Electronics"));
	return f.dot;
});

rt.type(3013, "/datum/design/earmuffs", "/datum/design", {
	name: "Earmuffs",
	id: "earmuffs",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/clothing/ears/earmuffs"),
});

// /datum/design/earmuffs/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:178)
rt.def("/datum/design/earmuffs/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 500, "$glass", 500]));
	rt.setSv(f, "category", rt.list("initial", "Misc"));
	return f.dot;
});

rt.type(3014, "/datum/design/pipe_painter", "/datum/design", {
	name: "Pipe Painter",
	id: "pipe_painter",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/device/pipe_painter"),
});

// /datum/design/pipe_painter/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:186)
rt.def("/datum/design/pipe_painter/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 5000, "$glass", 2000]));
	rt.setSv(f, "category", rt.list("initial", "Misc"));
	return f.dot;
});

rt.type(3015, "/datum/design/airlock_painter", "/datum/design", {
	name: "Airlock Painter",
	id: "airlock_painter",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/airlock_painter"),
});

// /datum/design/airlock_painter/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:194)
rt.def("/datum/design/airlock_painter/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 50, "$glass", 50]));
	rt.setSv(f, "category", rt.list("initial", "Misc"));
	return f.dot;
});

rt.type(3016, "/datum/design/metal", "/datum/design", {
	name: "Metal",
	id: "metal",
	build_type: 4,
	materials: null,
	category: null,
	maxstack: 50,
	build_path: rt.typePath("/obj/item/stack/sheet/metal"),
});

// /datum/design/metal/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:202)
rt.def("/datum/design/metal/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 2000]));
	rt.setSv(f, "category", rt.list("initial", "Construction"));
	return f.dot;
});

rt.type(3017, "/datum/design/glass", "/datum/design", {
	name: "Glass",
	id: "glass",
	build_type: 4,
	materials: null,
	category: null,
	maxstack: 50,
	build_path: rt.typePath("/obj/item/stack/sheet/glass"),
});

// /datum/design/glass/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:211)
rt.def("/datum/design/glass/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 2000]));
	rt.setSv(f, "category", rt.list("initial", "Construction"));
	return f.dot;
});

rt.type(3018, "/datum/design/rglass", "/datum/design", {
	name: "Reinforced Glass",
	id: "rglass",
	build_type: 132,
	materials: null,
	category: null,
	maxstack: 50,
	build_path: rt.typePath("/obj/item/stack/sheet/rglass"),
});

// /datum/design/rglass/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:220)
rt.def("/datum/design/rglass/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 1000, "$glass", 2000]));
	rt.setSv(f, "category", rt.list("initial", "Construction"));
	return f.dot;
});

rt.type(3019, "/datum/design/rods", "/datum/design", {
	name: "Metal Rod",
	id: "rods",
	build_type: 4,
	materials: null,
	category: null,
	maxstack: 50,
	build_path: rt.typePath("/obj/item/stack/rods"),
});

// /datum/design/rods/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:229)
rt.def("/datum/design/rods/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 1000]));
	rt.setSv(f, "category", rt.list("initial", "Construction"));
	return f.dot;
});

rt.type(3020, "/datum/design/rcd_ammo", "/datum/design", {
	name: "Compressed Matter Cartridge",
	id: "rcd_ammo",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/rcd_ammo"),
});

// /datum/design/rcd_ammo/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:238)
rt.def("/datum/design/rcd_ammo/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 12000, "$glass", 8000]));
	rt.setSv(f, "category", rt.list("initial", "Construction"));
	return f.dot;
});

rt.type(3021, "/datum/design/kitchen_knife", "/datum/design", {
	name: "Kitchen Knife",
	id: "kitchen_knife",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/kitchen/knife"),
});

// /datum/design/kitchen_knife/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:246)
rt.def("/datum/design/kitchen_knife/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 12000]));
	rt.setSv(f, "category", rt.list("initial", "Dinnerware"));
	return f.dot;
});

rt.type(3022, "/datum/design/fork", "/datum/design", {
	name: "Fork",
	id: "fork",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/kitchen/fork"),
});

// /datum/design/fork/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:254)
rt.def("/datum/design/fork/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 80]));
	rt.setSv(f, "category", rt.list("initial", "Dinnerware"));
	return f.dot;
});

rt.type(3023, "/datum/design/tray", "/datum/design", {
	name: "Tray",
	id: "tray",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/storage/bag/tray"),
});

// /datum/design/tray/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:262)
rt.def("/datum/design/tray/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 3000]));
	rt.setSv(f, "category", rt.list("initial", "Dinnerware"));
	return f.dot;
});

rt.type(3024, "/datum/design/bowl", "/datum/design", {
	name: "Bowl",
	id: "bowl",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/reagent_containers/glass/bowl"),
});

// /datum/design/bowl/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:270)
rt.def("/datum/design/bowl/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 500]));
	rt.setSv(f, "category", rt.list("initial", "Dinnerware"));
	return f.dot;
});

rt.type(3025, "/datum/design/drinking_glass", "/datum/design", {
	name: "Drinking Glass",
	id: "drinking_glass",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/reagent_containers/food/drinks/drinkingglass"),
});

// /datum/design/drinking_glass/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:278)
rt.def("/datum/design/drinking_glass/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 500]));
	rt.setSv(f, "category", rt.list("initial", "Dinnerware"));
	return f.dot;
});

rt.type(3026, "/datum/design/shot_glass", "/datum/design", {
	name: "Shot Glass",
	id: "shot_glass",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/reagent_containers/food/drinks/drinkingglass/shotglass"),
});

// /datum/design/shot_glass/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:286)
rt.def("/datum/design/shot_glass/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 100]));
	rt.setSv(f, "category", rt.list("initial", "Dinnerware"));
	return f.dot;
});

rt.type(3027, "/datum/design/shaker", "/datum/design", {
	name: "Shaker",
	id: "shaker",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/reagent_containers/food/drinks/shaker"),
});

// /datum/design/shaker/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:294)
rt.def("/datum/design/shaker/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 1500]));
	rt.setSv(f, "category", rt.list("initial", "Dinnerware"));
	return f.dot;
});

rt.type(3028, "/datum/design/cultivator", "/datum/design", {
	name: "Cultivator",
	id: "cultivator",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/cultivator"),
});

// /datum/design/cultivator/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:302)
rt.def("/datum/design/cultivator/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 50]));
	rt.setSv(f, "category", rt.list("initial", "Misc"));
	return f.dot;
});

rt.type(3029, "/datum/design/plant_analyzer", "/datum/design", {
	name: "Plant Analyzer",
	id: "plant_analyzer",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/device/plant_analyzer"),
});

// /datum/design/plant_analyzer/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:310)
rt.def("/datum/design/plant_analyzer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 30, "$glass", 20]));
	rt.setSv(f, "category", rt.list("initial", "Misc"));
	return f.dot;
});

rt.type(3030, "/datum/design/shovel", "/datum/design", {
	name: "Shovel",
	id: "shovel",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/shovel"),
});

// /datum/design/shovel/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:318)
rt.def("/datum/design/shovel/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 50]));
	rt.setSv(f, "category", rt.list("initial", "Misc"));
	return f.dot;
});

rt.type(3031, "/datum/design/spade", "/datum/design", {
	name: "Spade",
	id: "spade",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/shovel/spade"),
});

// /datum/design/spade/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:326)
rt.def("/datum/design/spade/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 50]));
	rt.setSv(f, "category", rt.list("initial", "Misc"));
	return f.dot;
});

rt.type(3032, "/datum/design/hatchet", "/datum/design", {
	name: "Hatchet",
	id: "hatchet",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/hatchet"),
});

// /datum/design/hatchet/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:334)
rt.def("/datum/design/hatchet/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 15000]));
	rt.setSv(f, "category", rt.list("initial", "Misc"));
	return f.dot;
});

rt.type(3033, "/datum/design/scalpel", "/datum/design", {
	name: "Scalpel",
	id: "scalpel",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/scalpel"),
});

// /datum/design/scalpel/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:342)
rt.def("/datum/design/scalpel/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 4000, "$glass", 1000]));
	rt.setSv(f, "category", rt.list("initial", "Medical"));
	return f.dot;
});

rt.type(3034, "/datum/design/circular_saw", "/datum/design", {
	name: "Circular Saw",
	id: "circular_saw",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circular_saw"),
});

// /datum/design/circular_saw/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:350)
rt.def("/datum/design/circular_saw/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 10000, "$glass", 6000]));
	rt.setSv(f, "category", rt.list("initial", "Medical"));
	return f.dot;
});

rt.type(3035, "/datum/design/surgicaldrill", "/datum/design", {
	name: "Surgical Drill",
	id: "surgicaldrill",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/surgicaldrill"),
});

// /datum/design/surgicaldrill/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:358)
rt.def("/datum/design/surgicaldrill/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 10000, "$glass", 6000]));
	rt.setSv(f, "category", rt.list("initial", "Medical"));
	return f.dot;
});

rt.type(3036, "/datum/design/retractor", "/datum/design", {
	name: "Retractor",
	id: "retractor",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/retractor"),
});

// /datum/design/retractor/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:366)
rt.def("/datum/design/retractor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 6000, "$glass", 3000]));
	rt.setSv(f, "category", rt.list("initial", "Medical"));
	return f.dot;
});

rt.type(3037, "/datum/design/cautery", "/datum/design", {
	name: "Cautery",
	id: "cautery",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/cautery"),
});

// /datum/design/cautery/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:374)
rt.def("/datum/design/cautery/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 2500, "$glass", 750]));
	rt.setSv(f, "category", rt.list("initial", "Medical"));
	return f.dot;
});

rt.type(3038, "/datum/design/hemostat", "/datum/design", {
	name: "Hemostat",
	id: "hemostat",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/hemostat"),
});

// /datum/design/hemostat/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:382)
rt.def("/datum/design/hemostat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 5000, "$glass", 2500]));
	rt.setSv(f, "category", rt.list("initial", "Medical"));
	return f.dot;
});

rt.type(3039, "/datum/design/beaker", "/datum/design", {
	name: "Beaker",
	id: "beaker",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/reagent_containers/glass/beaker"),
});

// /datum/design/beaker/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:390)
rt.def("/datum/design/beaker/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 500]));
	rt.setSv(f, "category", rt.list("initial", "Medical"));
	return f.dot;
});

rt.type(3040, "/datum/design/large_beaker", "/datum/design", {
	name: "Large Beaker",
	id: "large_beaker",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/reagent_containers/glass/beaker/large"),
});

// /datum/design/large_beaker/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:398)
rt.def("/datum/design/large_beaker/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 2500]));
	rt.setSv(f, "category", rt.list("initial", "Medical"));
	return f.dot;
});

rt.type(3041, "/datum/design/healthanalyzer", "/datum/design", {
	name: "Health Analyzer",
	id: "healthanalyzer",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/device/healthanalyzer"),
});

// /datum/design/healthanalyzer/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:406)
rt.def("/datum/design/healthanalyzer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 500, "$glass", 50]));
	rt.setSv(f, "category", rt.list("initial", "Medical"));
	return f.dot;
});

rt.type(3042, "/datum/design/beanbag_slug", "/datum/design", {
	name: "Beanbag Slug",
	id: "beanbag_slug",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/ammo_casing/shotgun/beanbag"),
});

// /datum/design/beanbag_slug/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:414)
rt.def("/datum/design/beanbag_slug/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 250]));
	rt.setSv(f, "category", rt.list("initial", "Security"));
	return f.dot;
});

rt.type(3043, "/datum/design/rubbershot", "/datum/design", {
	name: "Rubber Shot",
	id: "rubber_shot",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/ammo_casing/shotgun/rubbershot"),
});

// /datum/design/rubbershot/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:422)
rt.def("/datum/design/rubbershot/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 4000]));
	rt.setSv(f, "category", rt.list("initial", "Security"));
	return f.dot;
});

rt.type(3044, "/datum/design/c38", "/datum/design", {
	name: "Speed Loader (.38)",
	id: "c38",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/ammo_box/c38"),
});

// /datum/design/c38/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:430)
rt.def("/datum/design/c38/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 30000]));
	rt.setSv(f, "category", rt.list("initial", "Security"));
	return f.dot;
});

rt.type(3045, "/datum/design/recorder", "/datum/design", {
	name: "Universal Recorder",
	id: "recorder",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/device/taperecorder/empty"),
});

// /datum/design/recorder/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:438)
rt.def("/datum/design/recorder/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 60, "$glass", 30]));
	rt.setSv(f, "category", rt.list("initial", "Misc"));
	return f.dot;
});

rt.type(3046, "/datum/design/tape", "/datum/design", {
	name: "Tape",
	id: "tape",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/device/tape"),
});

// /datum/design/tape/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:446)
rt.def("/datum/design/tape/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 20, "$glass", 5]));
	rt.setSv(f, "category", rt.list("initial", "Misc"));
	return f.dot;
});

rt.type(3047, "/datum/design/igniter", "/datum/design", {
	name: "Igniter",
	id: "igniter",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/device/assembly/igniter"),
});

// /datum/design/igniter/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:454)
rt.def("/datum/design/igniter/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 500, "$glass", 50]));
	rt.setSv(f, "category", rt.list("initial", "Misc"));
	return f.dot;
});

rt.type(3048, "/datum/design/signaler", "/datum/design", {
	name: "Remote Signaling Device",
	id: "signaler",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/device/assembly/signaler"),
});

// /datum/design/signaler/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:462)
rt.def("/datum/design/signaler/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 400, "$glass", 120]));
	rt.setSv(f, "category", rt.list("initial", "T-Comm"));
	return f.dot;
});

rt.type(3049, "/datum/design/radio_headset", "/datum/design", {
	name: "Radio Headset",
	id: "radio_headset",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/device/radio/headset"),
});

// /datum/design/radio_headset/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:470)
rt.def("/datum/design/radio_headset/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 75]));
	rt.setSv(f, "category", rt.list("initial", "T-Comm"));
	return f.dot;
});

rt.type(3050, "/datum/design/bounced_radio", "/datum/design", {
	name: "Station Bounced Radio",
	id: "bounced_radio",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/device/radio/off"),
});

// /datum/design/bounced_radio/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:478)
rt.def("/datum/design/bounced_radio/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 75, "$glass", 25]));
	rt.setSv(f, "category", rt.list("initial", "T-Comm"));
	return f.dot;
});

rt.type(3051, "/datum/design/intercom_frame", "/datum/design", {
	name: "Intercom Frame",
	id: "intercom_frame",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/wallframe/intercom"),
});

// /datum/design/intercom_frame/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:486)
rt.def("/datum/design/intercom_frame/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 75, "$glass", 25]));
	rt.setSv(f, "category", rt.list("initial", "T-Comm"));
	return f.dot;
});

rt.type(3052, "/datum/design/infrared_emitter", "/datum/design", {
	name: "Infrared Emitter",
	id: "infrared_emitter",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/device/assembly/infra"),
});

// /datum/design/infrared_emitter/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:494)
rt.def("/datum/design/infrared_emitter/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 1000, "$glass", 500]));
	rt.setSv(f, "category", rt.list("initial", "Misc"));
	return f.dot;
});

rt.type(3053, "/datum/design/health_sensor", "/datum/design", {
	name: "Health Sensor",
	id: "health_sensor",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/device/assembly/health"),
});

// /datum/design/health_sensor/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:502)
rt.def("/datum/design/health_sensor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 800, "$glass", 200]));
	rt.setSv(f, "category", rt.list("initial", "Medical"));
	return f.dot;
});

rt.type(3054, "/datum/design/timer", "/datum/design", {
	name: "Timer",
	id: "timer",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/device/assembly/timer"),
});

// /datum/design/timer/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:510)
rt.def("/datum/design/timer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 500, "$glass", 50]));
	rt.setSv(f, "category", rt.list("initial", "Misc"));
	return f.dot;
});

rt.type(3055, "/datum/design/voice_analyser", "/datum/design", {
	name: "Voice Analyser",
	id: "voice_analyser",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/device/assembly/voice"),
});

// /datum/design/voice_analyser/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:518)
rt.def("/datum/design/voice_analyser/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 500, "$glass", 50]));
	rt.setSv(f, "category", rt.list("initial", "Misc"));
	return f.dot;
});

rt.type(3056, "/datum/design/light_tube", "/datum/design", {
	name: "Light Tube",
	id: "light_tube",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/light/tube"),
});

// /datum/design/light_tube/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:526)
rt.def("/datum/design/light_tube/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 100]));
	rt.setSv(f, "category", rt.list("initial", "Construction"));
	return f.dot;
});

rt.type(3057, "/datum/design/light_bulb", "/datum/design", {
	name: "Light Bulb",
	id: "light_bulb",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/light/bulb"),
});

// /datum/design/light_bulb/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:534)
rt.def("/datum/design/light_bulb/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 100]));
	rt.setSv(f, "category", rt.list("initial", "Construction"));
	return f.dot;
});

rt.type(3058, "/datum/design/camera_assembly", "/datum/design", {
	name: "Camera Assembly",
	id: "camera_assembly",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/wallframe/camera"),
});

// /datum/design/camera_assembly/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:542)
rt.def("/datum/design/camera_assembly/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 400, "$glass", 250]));
	rt.setSv(f, "category", rt.list("initial", "Construction"));
	return f.dot;
});

rt.type(3059, "/datum/design/newscaster_frame", "/datum/design", {
	name: "Newscaster Frame",
	id: "newscaster_frame",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/wallframe/newscaster"),
});

// /datum/design/newscaster_frame/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:550)
rt.def("/datum/design/newscaster_frame/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 14000, "$glass", 8000]));
	rt.setSv(f, "category", rt.list("initial", "Construction"));
	return f.dot;
});

rt.type(3060, "/datum/design/syringe", "/datum/design", {
	name: "Syringe",
	id: "syringe",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/reagent_containers/syringe"),
});

// /datum/design/syringe/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:558)
rt.def("/datum/design/syringe/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 10, "$glass", 20]));
	rt.setSv(f, "category", rt.list("initial", "Medical"));
	return f.dot;
});

rt.type(3061, "/datum/design/prox_sensor", "/datum/design", {
	name: "Proximity Sensor",
	id: "prox_sensor",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/device/assembly/prox_sensor"),
});

// /datum/design/prox_sensor/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:566)
rt.def("/datum/design/prox_sensor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 800, "$glass", 200]));
	rt.setSv(f, "category", rt.list("initial", "Misc"));
	return f.dot;
});

rt.type(3062, "/datum/design/foam_dart", "/datum/design", {
	name: "Box of Foam Darts",
	id: "foam_dart",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/ammo_box/foambox"),
});

// /datum/design/foam_dart/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:574)
rt.def("/datum/design/foam_dart/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 500]));
	rt.setSv(f, "category", rt.list("initial", "Misc"));
	return f.dot;
});

rt.type(3063, "/datum/design/flamethrower", "/datum/design", {
	name: "Flamethrower",
	id: "flamethrower",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/flamethrower/full"),
});

// /datum/design/flamethrower/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:583)
rt.def("/datum/design/flamethrower/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 500]));
	rt.setSv(f, "category", rt.list("hacked", "Weapons and ammo"));
	return f.dot;
});

rt.type(3064, "/datum/design/rcd", "/datum/design", {
	name: "Rapid Construction Device (RCD)",
	id: "rcd",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/construction/rcd"),
});

// /datum/design/rcd/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:591)
rt.def("/datum/design/rcd/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 30000]));
	rt.setSv(f, "category", rt.list("hacked", "Construction"));
	return f.dot;
});

rt.type(3065, "/datum/design/rpd", "/datum/design", {
	name: "Rapid Pipe Dispenser (RPD)",
	id: "rpd",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/pipe_dispenser"),
});

// /datum/design/rpd/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:599)
rt.def("/datum/design/rpd/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 75000, "$glass", 37500]));
	rt.setSv(f, "category", rt.list("hacked", "Construction"));
	return f.dot;
});

rt.type(3066, "/datum/design/electropack", "/datum/design", {
	name: "Electropack",
	id: "electropack",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/device/electropack"),
});

// /datum/design/electropack/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:607)
rt.def("/datum/design/electropack/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 10000, "$glass", 2500]));
	rt.setSv(f, "category", rt.list("hacked", "Tools"));
	return f.dot;
});

rt.type(3067, "/datum/design/large_welding_tool", "/datum/design", {
	name: "Industrial Welding Tool",
	id: "large_welding_tool",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/weldingtool/largetank"),
});

// /datum/design/large_welding_tool/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:615)
rt.def("/datum/design/large_welding_tool/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 70, "$glass", 60]));
	rt.setSv(f, "category", rt.list("hacked", "Tools"));
	return f.dot;
});

rt.type(3068, "/datum/design/handcuffs", "/datum/design", {
	name: "Handcuffs",
	id: "handcuffs",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/restraints/handcuffs"),
});

// /datum/design/handcuffs/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:623)
rt.def("/datum/design/handcuffs/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 500]));
	rt.setSv(f, "category", rt.list("hacked", "Security"));
	return f.dot;
});

rt.type(3069, "/datum/design/receiver", "/datum/design", {
	name: "Modular Receiver",
	id: "reciever",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weaponcrafting/receiver"),
});

// /datum/design/receiver/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:631)
rt.def("/datum/design/receiver/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 15000]));
	rt.setSv(f, "category", rt.list("hacked", "Security"));
	return f.dot;
});

rt.type(3070, "/datum/design/shotgun_slug", "/datum/design", {
	name: "Shotgun Slug",
	id: "shotgun_slug",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/ammo_casing/shotgun"),
});

// /datum/design/shotgun_slug/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:639)
rt.def("/datum/design/shotgun_slug/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 4000]));
	rt.setSv(f, "category", rt.list("hacked", "Security"));
	return f.dot;
});

rt.type(3071, "/datum/design/buckshot_shell", "/datum/design", {
	name: "Buckshot Shell",
	id: "buckshot_shell",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/ammo_casing/shotgun/buckshot"),
});

// /datum/design/buckshot_shell/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:647)
rt.def("/datum/design/buckshot_shell/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 4000]));
	rt.setSv(f, "category", rt.list("hacked", "Security"));
	return f.dot;
});

rt.type(3072, "/datum/design/shotgun_dart", "/datum/design", {
	name: "Shotgun Dart",
	id: "shotgun_dart",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/ammo_casing/shotgun/dart"),
});

// /datum/design/shotgun_dart/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:655)
rt.def("/datum/design/shotgun_dart/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 4000]));
	rt.setSv(f, "category", rt.list("hacked", "Security"));
	return f.dot;
});

rt.type(3073, "/datum/design/incendiary_slug", "/datum/design", {
	name: "Incendiary Slug",
	id: "incendiary_slug",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/ammo_casing/shotgun/incendiary"),
});

// /datum/design/incendiary_slug/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:663)
rt.def("/datum/design/incendiary_slug/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 4000]));
	rt.setSv(f, "category", rt.list("hacked", "Security"));
	return f.dot;
});

rt.type(3074, "/datum/design/riot_dart", "/datum/design", {
	name: "Foam Riot Dart",
	id: "riot_dart",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/ammo_casing/caseless/foam_dart/riot"),
});

// /datum/design/riot_dart/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:671)
rt.def("/datum/design/riot_dart/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 1000]));
	rt.setSv(f, "category", rt.list("hacked", "Security"));
	return f.dot;
});

rt.type(3075, "/datum/design/riot_darts", "/datum/design", {
	name: "Foam Riot Dart Box",
	id: "riot_darts",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/ammo_box/foambox/riot"),
});

// /datum/design/riot_darts/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:679)
rt.def("/datum/design/riot_darts/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 50000]));
	rt.setSv(f, "category", rt.list("hacked", "Security"));
	return f.dot;
});

rt.type(3076, "/datum/design/a357", "/datum/design", {
	name: "Ammo Box (.357)",
	id: "a357",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/ammo_box/a357"),
});

// /datum/design/a357/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:687)
rt.def("/datum/design/a357/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 30000]));
	rt.setSv(f, "category", rt.list("hacked", "Security"));
	return f.dot;
});

rt.type(3077, "/datum/design/c10mm", "/datum/design", {
	name: "Ammo Box (10mm)",
	id: "c10mm",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/ammo_box/c10mm"),
});

// /datum/design/c10mm/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:695)
rt.def("/datum/design/c10mm/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 30000]));
	rt.setSv(f, "category", rt.list("hacked", "Security"));
	return f.dot;
});

rt.type(3078, "/datum/design/c45", "/datum/design", {
	name: "Ammo Box (.45)",
	id: "c45",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/ammo_box/c45"),
});

// /datum/design/c45/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:703)
rt.def("/datum/design/c45/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 30000]));
	rt.setSv(f, "category", rt.list("hacked", "Security"));
	return f.dot;
});

rt.type(3079, "/datum/design/c9mm", "/datum/design", {
	name: "Ammo Box (9mm)",
	id: "c9mm",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/ammo_box/c9mm"),
});

// /datum/design/c9mm/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:711)
rt.def("/datum/design/c9mm/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 30000]));
	rt.setSv(f, "category", rt.list("hacked", "Security"));
	return f.dot;
});

rt.type(3080, "/datum/design/cleaver", "/datum/design", {
	name: "Butcher's Cleaver",
	id: "cleaver",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/kitchen/knife/butcher"),
});

// /datum/design/cleaver/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:719)
rt.def("/datum/design/cleaver/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 18000]));
	rt.setSv(f, "category", rt.list("hacked", "Dinnerware"));
	return f.dot;
});

rt.type(3081, "/datum/design/spraycan", "/datum/design", {
	name: "Spraycan",
	id: "spraycan",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/toy/crayon/spraycan"),
});

// /datum/design/spraycan/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:727)
rt.def("/datum/design/spraycan/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 100, "$glass", 100]));
	rt.setSv(f, "category", rt.list("initial", "Tools"));
	return f.dot;
});

rt.type(3082, "/datum/design/desttagger", "/datum/design", {
	name: "Destination Tagger",
	id: "desttagger",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/device/destTagger"),
});

// /datum/design/desttagger/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:735)
rt.def("/datum/design/desttagger/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 250, "$glass", 125]));
	rt.setSv(f, "category", rt.list("initial", "Electronics"));
	return f.dot;
});

rt.type(3083, "/datum/design/handlabeler", "/datum/design", {
	name: "Hand Labeler",
	id: "handlabel",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/hand_labeler"),
});

// /datum/design/handlabeler/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:743)
rt.def("/datum/design/handlabeler/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 150, "$glass", 125]));
	rt.setSv(f, "category", rt.list("initial", "Electronics"));
	return f.dot;
});

rt.type(3084, "/datum/design/geiger", "/datum/design", {
	name: "Geiger Counter",
	id: "geigercounter",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/device/geiger_counter"),
});

// /datum/design/geiger/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:751)
rt.def("/datum/design/geiger/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 150, "$glass", 150]));
	rt.setSv(f, "category", rt.list("initial", "Tools"));
	return f.dot;
});

rt.type(3085, "/datum/design/turret_control_frame", "/datum/design", {
	name: "Turret Control Frame",
	id: "turret_control",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/wallframe/turret_control"),
});

// /datum/design/turret_control_frame/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:759)
rt.def("/datum/design/turret_control_frame/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 12000]));
	rt.setSv(f, "category", rt.list("initial", "Construction"));
	return f.dot;
});

rt.type(3086, "/datum/design/conveyor_belt", "/datum/design", {
	name: "Conveyor Belt",
	id: "conveyor_belt",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/conveyor_construct"),
});

// /datum/design/conveyor_belt/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:767)
rt.def("/datum/design/conveyor_belt/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 5000]));
	rt.setSv(f, "category", rt.list("initial", "Construction"));
	return f.dot;
});

rt.type(3087, "/datum/design/conveyor_switch", "/datum/design", {
	name: "Conveyor Belt Switch",
	id: "conveyor_switch",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/conveyor_switch_construct"),
});

// /datum/design/conveyor_switch/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:775)
rt.def("/datum/design/conveyor_switch/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 450, "$glass", 190]));
	rt.setSv(f, "category", rt.list("initial", "Construction"));
	return f.dot;
});

rt.type(3088, "/datum/design/laptop", "/datum/design", {
	name: "Laptop Frame",
	id: "laptop",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/device/modular_computer/laptop/buildable"),
});

// /datum/design/laptop/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:783)
rt.def("/datum/design/laptop/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 10000, "$glass", 1000]));
	rt.setSv(f, "category", rt.list("initial", "Misc"));
	return f.dot;
});

rt.type(3089, "/datum/design/tablet", "/datum/design", {
	name: "Tablet Frame",
	id: "tablet",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/device/modular_computer/tablet"),
});

// /datum/design/tablet/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:791)
rt.def("/datum/design/tablet/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 2000, "$glass", 1000]));
	rt.setSv(f, "category", rt.list("initial", "Misc"));
	return f.dot;
});

rt.type(3090, "/datum/design/slime_scanner", "/datum/design", {
	name: "Slime Scanner",
	id: "slime_scanner",
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/device/slime_scanner"),
});

// /datum/design/slime_scanner/proc/<init>  (code/modules/research/designs/autolathe_designs.dm:799)
rt.def("/datum/design/slime_scanner/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 300, "$glass", 200]));
	rt.setSv(f, "category", rt.list("initial", "Misc"));
	return f.dot;
});
