// From code/modules/research/designs/stock_parts_designs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(3301, "/datum/design/RPED", "/datum/design", {
	name: "Rapid Part Exchange Device",
	desc: "Special mechanical module made to store, sort, and apply standard machine parts.",
	id: "rped",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/storage/part_replacer"),
});

// /datum/design/RPED/proc/<init>  (code/modules/research/designs/stock_parts_designs.dm:9)
rt.def("/datum/design/RPED/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["engineering", 1]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 10000, "$glass", 5000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Stock Parts"));
	return f.dot;
});

rt.type(3302, "/datum/design/BS_RPED", "/datum/design", {
	name: "Bluespace RPED",
	desc: "Powered by bluespace technology, this RPED variant can upgrade buildings from a distance, without needing to remove the panel first.",
	id: "bs_rped",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/storage/part_replacer/bluespace"),
});

// /datum/design/BS_RPED/proc/<init>  (code/modules/research/designs/stock_parts_designs.dm:19)
rt.def("/datum/design/BS_RPED/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["engineering", 4, "bluespace", 3]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 15000, "$glass", 5000, "$silver", 2500]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Stock Parts"));
	return f.dot;
});

rt.type(3303, "/datum/design/basic_capacitor", "/datum/design", {
	name: "Basic Capacitor",
	desc: "A stock part used in the construction of various devices.",
	id: "basic_capacitor",
	req_tech: null,
	build_type: 6,
	materials: null,
	category: null,
	lathe_time_factor: 0.2,
	build_path: rt.typePath("/obj/item/weapon/stock_parts/capacitor"),
});

// /datum/design/basic_capacitor/proc/<init>  (code/modules/research/designs/stock_parts_designs.dm:30)
rt.def("/datum/design/basic_capacitor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["powerstorage", 1]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 100, "$glass", 100]));
	rt.setSv(f, "category", rt.list("Stock Parts", "Machinery", "initial"));
	return f.dot;
});

rt.type(3304, "/datum/design/adv_capacitor", "/datum/design", {
	name: "Advanced Capacitor",
	desc: "A stock part used in the construction of various devices.",
	id: "adv_capacitor",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	lathe_time_factor: 0.2,
	build_path: rt.typePath("/obj/item/weapon/stock_parts/capacitor/adv"),
});

// /datum/design/adv_capacitor/proc/<init>  (code/modules/research/designs/stock_parts_designs.dm:41)
rt.def("/datum/design/adv_capacitor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["powerstorage", 3]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 150, "$glass", 150]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Stock Parts"));
	return f.dot;
});

rt.type(3305, "/datum/design/super_capacitor", "/datum/design", {
	name: "Super Capacitor",
	desc: "A stock part used in the construction of various devices.",
	id: "super_capacitor",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	lathe_time_factor: 0.2,
	build_path: rt.typePath("/obj/item/weapon/stock_parts/capacitor/super"),
});

// /datum/design/super_capacitor/proc/<init>  (code/modules/research/designs/stock_parts_designs.dm:52)
rt.def("/datum/design/super_capacitor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["powerstorage", 5, "engineering", 5]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 200, "$glass", 200, "$gold", 100]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Stock Parts"));
	return f.dot;
});

rt.type(3306, "/datum/design/quadratic_capacitor", "/datum/design", {
	name: "Quadratic Capacitor",
	desc: "A stock part used in the construction of various devices.",
	id: "quadratic_capacitor",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	lathe_time_factor: 0.2,
	build_path: rt.typePath("/obj/item/weapon/stock_parts/capacitor/quadratic"),
});

// /datum/design/quadratic_capacitor/proc/<init>  (code/modules/research/designs/stock_parts_designs.dm:63)
rt.def("/datum/design/quadratic_capacitor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["powerstorage", 6, "engineering", 5, "materials", 5, "bluespace", 5]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 200, "$glass", 200, "$gold", 100, "$diamond", 100]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Stock Parts"));
	return f.dot;
});

rt.type(3307, "/datum/design/basic_scanning", "/datum/design", {
	name: "Basic Scanning Module",
	desc: "A stock part used in the construction of various devices.",
	id: "basic_scanning",
	req_tech: null,
	build_type: 6,
	materials: null,
	category: null,
	lathe_time_factor: 0.2,
	build_path: rt.typePath("/obj/item/weapon/stock_parts/scanning_module"),
});

// /datum/design/basic_scanning/proc/<init>  (code/modules/research/designs/stock_parts_designs.dm:75)
rt.def("/datum/design/basic_scanning/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["magnets", 1]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 100, "$glass", 50]));
	rt.setSv(f, "category", rt.list("Stock Parts", "Machinery", "initial"));
	return f.dot;
});

rt.type(3308, "/datum/design/adv_scanning", "/datum/design", {
	name: "Advanced Scanning Module",
	desc: "A stock part used in the construction of various devices.",
	id: "adv_scanning",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	lathe_time_factor: 0.2,
	build_path: rt.typePath("/obj/item/weapon/stock_parts/scanning_module/adv"),
});

// /datum/design/adv_scanning/proc/<init>  (code/modules/research/designs/stock_parts_designs.dm:86)
rt.def("/datum/design/adv_scanning/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["magnets", 3]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 150, "$glass", 100]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Stock Parts"));
	return f.dot;
});

rt.type(3309, "/datum/design/phasic_scanning", "/datum/design", {
	name: "Phasic Scanning Module",
	desc: "A stock part used in the construction of various devices.",
	id: "phasic_scanning",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	lathe_time_factor: 0.2,
	build_path: rt.typePath("/obj/item/weapon/stock_parts/scanning_module/phasic"),
});

// /datum/design/phasic_scanning/proc/<init>  (code/modules/research/designs/stock_parts_designs.dm:97)
rt.def("/datum/design/phasic_scanning/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["magnets", 5, "engineering", 5]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 200, "$glass", 150, "$silver", 60]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Stock Parts"));
	return f.dot;
});

rt.type(3310, "/datum/design/triphasic_scanning", "/datum/design", {
	name: "Triphasic Scanning Module",
	desc: "A stock part used in the construction of various devices.",
	id: "triphasic_scanning",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	lathe_time_factor: 0.2,
	build_path: rt.typePath("/obj/item/weapon/stock_parts/scanning_module/triphasic"),
});

// /datum/design/triphasic_scanning/proc/<init>  (code/modules/research/designs/stock_parts_designs.dm:108)
rt.def("/datum/design/triphasic_scanning/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["magnets", 6, "materials", 5, "engineering", 5, "bluespace", 5]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 200, "$glass", 200, "$diamond", 30, "$bluespace", 30]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Stock Parts"));
	return f.dot;
});

rt.type(3311, "/datum/design/micro_mani", "/datum/design", {
	name: "Micro Manipulator",
	desc: "A stock part used in the construction of various devices.",
	id: "micro_mani",
	req_tech: null,
	build_type: 6,
	materials: null,
	category: null,
	lathe_time_factor: 0.2,
	build_path: rt.typePath("/obj/item/weapon/stock_parts/manipulator"),
});

// /datum/design/micro_mani/proc/<init>  (code/modules/research/designs/stock_parts_designs.dm:120)
rt.def("/datum/design/micro_mani/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 1]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 100]));
	rt.setSv(f, "category", rt.list("Stock Parts", "Machinery", "initial"));
	return f.dot;
});

rt.type(3312, "/datum/design/nano_mani", "/datum/design", {
	name: "Nano Manipulator",
	desc: "A stock part used in the construction of various devices.",
	id: "nano_mani",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	lathe_time_factor: 0.2,
	build_path: rt.typePath("/obj/item/weapon/stock_parts/manipulator/nano"),
});

// /datum/design/nano_mani/proc/<init>  (code/modules/research/designs/stock_parts_designs.dm:131)
rt.def("/datum/design/nano_mani/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 3, "programming", 2]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 150]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Stock Parts"));
	return f.dot;
});

rt.type(3313, "/datum/design/pico_mani", "/datum/design", {
	name: "Pico Manipulator",
	desc: "A stock part used in the construction of various devices.",
	id: "pico_mani",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	lathe_time_factor: 0.2,
	build_path: rt.typePath("/obj/item/weapon/stock_parts/manipulator/pico"),
});

// /datum/design/pico_mani/proc/<init>  (code/modules/research/designs/stock_parts_designs.dm:142)
rt.def("/datum/design/pico_mani/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 5, "programming", 4, "engineering", 5]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 200]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Stock Parts"));
	return f.dot;
});

rt.type(3314, "/datum/design/femto_mani", "/datum/design", {
	name: "Femto Manipulator",
	desc: "A stock part used in the construction of various devices.",
	id: "femto_mani",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	lathe_time_factor: 0.2,
	build_path: rt.typePath("/obj/item/weapon/stock_parts/manipulator/femto"),
});

// /datum/design/femto_mani/proc/<init>  (code/modules/research/designs/stock_parts_designs.dm:153)
rt.def("/datum/design/femto_mani/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 7, "programming", 5, "engineering", 5, "bluespace", 5]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 200, "$diamond", 30, "$titanium", 30]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Stock Parts"));
	return f.dot;
});

rt.type(3315, "/datum/design/basic_micro_laser", "/datum/design", {
	name: "Basic Micro-Laser",
	desc: "A stock part used in the construction of various devices.",
	id: "basic_micro_laser",
	req_tech: null,
	build_type: 6,
	materials: null,
	category: null,
	lathe_time_factor: 0.2,
	build_path: rt.typePath("/obj/item/weapon/stock_parts/micro_laser"),
});

// /datum/design/basic_micro_laser/proc/<init>  (code/modules/research/designs/stock_parts_designs.dm:165)
rt.def("/datum/design/basic_micro_laser/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["magnets", 1]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 100, "$glass", 50]));
	rt.setSv(f, "category", rt.list("Stock Parts", "Machinery", "initial"));
	return f.dot;
});

rt.type(3316, "/datum/design/high_micro_laser", "/datum/design", {
	name: "High-Power Micro-Laser",
	desc: "A stock part used in the construction of various devices.",
	id: "high_micro_laser",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	lathe_time_factor: 0.2,
	build_path: rt.typePath("/obj/item/weapon/stock_parts/micro_laser/high"),
});

// /datum/design/high_micro_laser/proc/<init>  (code/modules/research/designs/stock_parts_designs.dm:176)
rt.def("/datum/design/high_micro_laser/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["magnets", 3]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 150, "$glass", 100]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Stock Parts"));
	return f.dot;
});

rt.type(3317, "/datum/design/ultra_micro_laser", "/datum/design", {
	name: "Ultra-High-Power Micro-Laser",
	desc: "A stock part used in the construction of various devices.",
	id: "ultra_micro_laser",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	lathe_time_factor: 0.2,
	build_path: rt.typePath("/obj/item/weapon/stock_parts/micro_laser/ultra"),
});

// /datum/design/ultra_micro_laser/proc/<init>  (code/modules/research/designs/stock_parts_designs.dm:187)
rt.def("/datum/design/ultra_micro_laser/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["magnets", 5, "engineering", 5]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 200, "$glass", 150, "$uranium", 60]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Stock Parts"));
	return f.dot;
});

rt.type(3318, "/datum/design/quadultra_micro_laser", "/datum/design", {
	name: "Quad-Ultra Micro-Laser",
	desc: "A stock part used in the construction of various devices.",
	id: "quadultra_micro_laser",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	lathe_time_factor: 0.2,
	build_path: rt.typePath("/obj/item/weapon/stock_parts/micro_laser/quadultra"),
});

// /datum/design/quadultra_micro_laser/proc/<init>  (code/modules/research/designs/stock_parts_designs.dm:198)
rt.def("/datum/design/quadultra_micro_laser/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["magnets", 6, "materials", 5, "engineering", 5, "bluespace", 5]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 200, "$glass", 200, "$uranium", 100, "$diamond", 60]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Stock Parts"));
	return f.dot;
});

rt.type(3319, "/datum/design/basic_matter_bin", "/datum/design", {
	name: "Basic Matter Bin",
	desc: "A stock part used in the construction of various devices.",
	id: "basic_matter_bin",
	req_tech: null,
	build_type: 6,
	materials: null,
	category: null,
	lathe_time_factor: 0.2,
	build_path: rt.typePath("/obj/item/weapon/stock_parts/matter_bin"),
});

// /datum/design/basic_matter_bin/proc/<init>  (code/modules/research/designs/stock_parts_designs.dm:209)
rt.def("/datum/design/basic_matter_bin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 1]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 100]));
	rt.setSv(f, "category", rt.list("Stock Parts", "Machinery", "initial"));
	return f.dot;
});

rt.type(3320, "/datum/design/adv_matter_bin", "/datum/design", {
	name: "Advanced Matter Bin",
	desc: "A stock part used in the construction of various devices.",
	id: "adv_matter_bin",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	lathe_time_factor: 0.2,
	build_path: rt.typePath("/obj/item/weapon/stock_parts/matter_bin/adv"),
});

// /datum/design/adv_matter_bin/proc/<init>  (code/modules/research/designs/stock_parts_designs.dm:220)
rt.def("/datum/design/adv_matter_bin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 3]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 150]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Stock Parts"));
	return f.dot;
});

rt.type(3321, "/datum/design/super_matter_bin", "/datum/design", {
	name: "Super Matter Bin",
	desc: "A stock part used in the construction of various devices.",
	id: "super_matter_bin",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	lathe_time_factor: 0.2,
	build_path: rt.typePath("/obj/item/weapon/stock_parts/matter_bin/super"),
});

// /datum/design/super_matter_bin/proc/<init>  (code/modules/research/designs/stock_parts_designs.dm:231)
rt.def("/datum/design/super_matter_bin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 5, "engineering", 5]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 200]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Stock Parts"));
	return f.dot;
});

rt.type(3322, "/datum/design/bluespace_matter_bin", "/datum/design", {
	name: "Bluespace Matter Bin",
	desc: "A stock part used in the construction of various devices.",
	id: "bluespace_matter_bin",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	lathe_time_factor: 0.2,
	build_path: rt.typePath("/obj/item/weapon/stock_parts/matter_bin/bluespace"),
});

// /datum/design/bluespace_matter_bin/proc/<init>  (code/modules/research/designs/stock_parts_designs.dm:242)
rt.def("/datum/design/bluespace_matter_bin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 7, "engineering", 5, "bluespace", 5]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 250, "$diamond", 100, "$bluespace", 100]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Stock Parts"));
	return f.dot;
});

rt.type(3323, "/datum/design/subspace_ansible", "/datum/design", {
	name: "Subspace Ansible",
	desc: "A compact module capable of sensing extradimensional activity.",
	id: "s-ansible",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/stock_parts/subspace/ansible"),
});

// /datum/design/subspace_ansible/proc/<init>  (code/modules/research/designs/stock_parts_designs.dm:254)
rt.def("/datum/design/subspace_ansible/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 2, "magnets", 2, "materials", 2]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 100, "$silver", 100]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Stock Parts"));
	return f.dot;
});

rt.type(3324, "/datum/design/hyperwave_filter", "/datum/design", {
	name: "Hyperwave Filter",
	desc: "A tiny device capable of filtering and converting super-intense radiowaves.",
	id: "s-filter",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/stock_parts/subspace/filter"),
});

// /datum/design/hyperwave_filter/proc/<init>  (code/modules/research/designs/stock_parts_designs.dm:264)
rt.def("/datum/design/hyperwave_filter/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 3, "magnets", 3]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 100, "$silver", 100]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Stock Parts"));
	return f.dot;
});

rt.type(3325, "/datum/design/subspace_amplifier", "/datum/design", {
	name: "Subspace Amplifier",
	desc: "A compact micro-machine capable of amplifying weak subspace transmissions.",
	id: "s-amplifier",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/stock_parts/subspace/amplifier"),
});

// /datum/design/subspace_amplifier/proc/<init>  (code/modules/research/designs/stock_parts_designs.dm:274)
rt.def("/datum/design/subspace_amplifier/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 3, "magnets", 4, "materials", 3, "bluespace", 2]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 100, "$gold", 100, "$uranium", 100]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Stock Parts"));
	return f.dot;
});

rt.type(3326, "/datum/design/subspace_treatment", "/datum/design", {
	name: "Subspace Treatment Disk",
	desc: "A compact micro-machine capable of stretching out hyper-compressed radio waves.",
	id: "s-treatment",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/stock_parts/subspace/treatment"),
});

// /datum/design/subspace_treatment/proc/<init>  (code/modules/research/designs/stock_parts_designs.dm:284)
rt.def("/datum/design/subspace_treatment/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 2, "magnets", 3, "materials", 2, "bluespace", 3]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 100, "$silver", 200]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Stock Parts"));
	return f.dot;
});

rt.type(3327, "/datum/design/subspace_analyzer", "/datum/design", {
	name: "Subspace Analyzer",
	desc: "A sophisticated analyzer capable of analyzing cryptic subspace wavelengths.",
	id: "s-analyzer",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/stock_parts/subspace/analyzer"),
});

// /datum/design/subspace_analyzer/proc/<init>  (code/modules/research/designs/stock_parts_designs.dm:294)
rt.def("/datum/design/subspace_analyzer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 3, "magnets", 4, "materials", 2, "bluespace", 3]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 100, "$gold", 100]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Stock Parts"));
	return f.dot;
});

rt.type(3328, "/datum/design/subspace_crystal", "/datum/design", {
	name: "Ansible Crystal",
	desc: "A sophisticated analyzer capable of analyzing cryptic subspace wavelengths.",
	id: "s-crystal",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/stock_parts/subspace/crystal"),
});

// /datum/design/subspace_crystal/proc/<init>  (code/modules/research/designs/stock_parts_designs.dm:304)
rt.def("/datum/design/subspace_crystal/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["magnets", 2, "materials", 2, "bluespace", 3, "plasmatech", 3]));
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 800, "$silver", 100, "$gold", 100]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Stock Parts"));
	return f.dot;
});

rt.type(3329, "/datum/design/subspace_transmitter", "/datum/design", {
	name: "Subspace Transmitter",
	desc: "A large piece of equipment used to open a window into the subspace dimension.",
	id: "s-transmitter",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/stock_parts/subspace/transmitter"),
});

// /datum/design/subspace_transmitter/proc/<init>  (code/modules/research/designs/stock_parts_designs.dm:314)
rt.def("/datum/design/subspace_transmitter/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["magnets", 3, "materials", 4, "bluespace", 4]));
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 100, "$silver", 100, "$uranium", 100]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Stock Parts"));
	return f.dot;
});
