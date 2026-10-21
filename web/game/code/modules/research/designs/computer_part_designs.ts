// From code/modules/research/designs/computer_part_designs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(3112, "/datum/design/disk/normal", "/datum/design/disk", {
	name: "Hard Disk Drive",
	id: "hdd_basic",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/computer_hardware/hard_drive"),
});

// /datum/design/disk/normal/proc/<init>  (code/modules/research/designs/computer_part_designs.dm:8)
rt.def("/datum/design/disk/normal/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 1, "engineering", 1]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 400, "$glass", 100]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Parts"));
	return f.dot;
});

rt.type(3113, "/datum/design/disk/advanced", "/datum/design/disk", {
	name: "Advanced Hard Disk Drive",
	id: "hdd_advanced",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/computer_hardware/hard_drive/advanced"),
});

// /datum/design/disk/advanced/proc/<init>  (code/modules/research/designs/computer_part_designs.dm:17)
rt.def("/datum/design/disk/advanced/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 2, "engineering", 2]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 800, "$glass", 200]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Parts"));
	return f.dot;
});

rt.type(3114, "/datum/design/disk/super", "/datum/design/disk", {
	name: "Super Hard Disk Drive",
	id: "hdd_super",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/computer_hardware/hard_drive/super"),
});

// /datum/design/disk/super/proc/<init>  (code/modules/research/designs/computer_part_designs.dm:26)
rt.def("/datum/design/disk/super/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 3, "engineering", 3]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 1600, "$glass", 400]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Parts"));
	return f.dot;
});

rt.type(3115, "/datum/design/disk/cluster", "/datum/design/disk", {
	name: "Cluster Hard Disk Drive",
	id: "hdd_cluster",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/computer_hardware/hard_drive/cluster"),
});

// /datum/design/disk/cluster/proc/<init>  (code/modules/research/designs/computer_part_designs.dm:35)
rt.def("/datum/design/disk/cluster/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 4, "engineering", 4]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 3200, "$glass", 800]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Parts"));
	return f.dot;
});

rt.type(3116, "/datum/design/disk/small", "/datum/design/disk", {
	name: "Solid State Drive",
	id: "ssd_small",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/computer_hardware/hard_drive/small"),
});

// /datum/design/disk/small/proc/<init>  (code/modules/research/designs/computer_part_designs.dm:44)
rt.def("/datum/design/disk/small/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 2, "engineering", 2]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 800, "$glass", 200]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Parts"));
	return f.dot;
});

rt.type(3117, "/datum/design/disk/micro", "/datum/design/disk", {
	name: "Micro Solid State Drive",
	id: "ssd_micro",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/computer_hardware/hard_drive/micro"),
});

// /datum/design/disk/micro/proc/<init>  (code/modules/research/designs/computer_part_designs.dm:53)
rt.def("/datum/design/disk/micro/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 1, "engineering", 1]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 400, "$glass", 100]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Parts"));
	return f.dot;
});

rt.type(3119, "/datum/design/netcard/basic", "/datum/design/netcard", {
	name: "Network Card",
	id: "netcard_basic",
	req_tech: null,
	build_type: 1,
	materials: null,
	reagents_list: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/computer_hardware/network_card"),
});

// /datum/design/netcard/basic/proc/<init>  (code/modules/research/designs/computer_part_designs.dm:64)
rt.def("/datum/design/netcard/basic/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 2, "engineering", 1]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 250, "$glass", 100]));
	rt.setSv(f, "reagents_list", rt.alist(f, ["sacid", 20]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Parts"));
	return f.dot;
});

rt.type(3120, "/datum/design/netcard/advanced", "/datum/design/netcard", {
	name: "Advanced Network Card",
	id: "netcard_advanced",
	req_tech: null,
	build_type: 1,
	materials: null,
	reagents_list: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/computer_hardware/network_card/advanced"),
});

// /datum/design/netcard/advanced/proc/<init>  (code/modules/research/designs/computer_part_designs.dm:74)
rt.def("/datum/design/netcard/advanced/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 4, "engineering", 2]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 500, "$glass", 200]));
	rt.setSv(f, "reagents_list", rt.alist(f, ["sacid", 20]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Parts"));
	return f.dot;
});

rt.type(3121, "/datum/design/netcard/wired", "/datum/design/netcard", {
	name: "Wired Network Card",
	id: "netcard_wired",
	req_tech: null,
	build_type: 1,
	materials: null,
	reagents_list: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/computer_hardware/network_card/wired"),
});

// /datum/design/netcard/wired/proc/<init>  (code/modules/research/designs/computer_part_designs.dm:84)
rt.def("/datum/design/netcard/wired/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 5, "engineering", 3]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 2500, "$glass", 400]));
	rt.setSv(f, "reagents_list", rt.alist(f, ["sacid", 20]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Parts"));
	return f.dot;
});

rt.type(3123, "/datum/design/portabledrive/basic", "/datum/design/portabledrive", {
	name: "Data Disk",
	id: "portadrive_basic",
	req_tech: null,
	build_type: 1,
	materials: null,
	reagents_list: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/computer_hardware/hard_drive/portable"),
});

// /datum/design/portabledrive/basic/proc/<init>  (code/modules/research/designs/computer_part_designs.dm:96)
rt.def("/datum/design/portabledrive/basic/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 1]));
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 800]));
	rt.setSv(f, "reagents_list", rt.alist(f, ["sacid", 20]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Parts"));
	return f.dot;
});

rt.type(3124, "/datum/design/portabledrive/advanced", "/datum/design/portabledrive", {
	name: "Advanced Data Disk",
	id: "portadrive_advanced",
	req_tech: null,
	build_type: 1,
	materials: null,
	reagents_list: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/computer_hardware/hard_drive/portable/advanced"),
});

// /datum/design/portabledrive/advanced/proc/<init>  (code/modules/research/designs/computer_part_designs.dm:106)
rt.def("/datum/design/portabledrive/advanced/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 2]));
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 1600]));
	rt.setSv(f, "reagents_list", rt.alist(f, ["sacid", 20]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Parts"));
	return f.dot;
});

rt.type(3125, "/datum/design/portabledrive/super", "/datum/design/portabledrive", {
	name: "Super Data Disk",
	id: "portadrive_super",
	req_tech: null,
	build_type: 1,
	materials: null,
	reagents_list: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/computer_hardware/hard_drive/portable/super"),
});

// /datum/design/portabledrive/super/proc/<init>  (code/modules/research/designs/computer_part_designs.dm:116)
rt.def("/datum/design/portabledrive/super/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 4]));
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 3200]));
	rt.setSv(f, "reagents_list", rt.alist(f, ["sacid", 20]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Parts"));
	return f.dot;
});

rt.type(3126, "/datum/design/cardslot", "/datum/design", {
	name: "ID Card Slot",
	id: "cardslot",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/computer_hardware/card_slot"),
});

// /datum/design/cardslot/proc/<init>  (code/modules/research/designs/computer_part_designs.dm:128)
rt.def("/datum/design/cardslot/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 2]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 600]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Parts"));
	return f.dot;
});

rt.type(3127, "/datum/design/aislot", "/datum/design", {
	name: "Intellicard Slot",
	id: "aislot",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/computer_hardware/ai_slot"),
});

// /datum/design/aislot/proc/<init>  (code/modules/research/designs/computer_part_designs.dm:138)
rt.def("/datum/design/aislot/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 2]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 600]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Parts"));
	return f.dot;
});

rt.type(3128, "/datum/design/miniprinter", "/datum/design", {
	name: "Miniprinter",
	id: "miniprinter",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/computer_hardware/printer/mini"),
});

// /datum/design/miniprinter/proc/<init>  (code/modules/research/designs/computer_part_designs.dm:148)
rt.def("/datum/design/miniprinter/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 2, "engineering", 2]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 600]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Parts"));
	return f.dot;
});

rt.type(3129, "/datum/design/APClink", "/datum/design", {
	name: "Area Power Connector",
	id: "APClink",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/computer_hardware/recharger/APC"),
});

// /datum/design/APClink/proc/<init>  (code/modules/research/designs/computer_part_designs.dm:159)
rt.def("/datum/design/APClink/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 2, "powerstorage", 3, "engineering", 2]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 2000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Parts"));
	return f.dot;
});

rt.type(3131, "/datum/design/battery/controller", "/datum/design/battery", {
	name: "Power Cell Controller",
	id: "bat_control",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/computer_hardware/battery"),
});

// /datum/design/battery/controller/proc/<init>  (code/modules/research/designs/computer_part_designs.dm:170)
rt.def("/datum/design/battery/controller/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["powerstorage", 1, "engineering", 1]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 400]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Parts"));
	return f.dot;
});

rt.type(3132, "/datum/design/battery/normal", "/datum/design/battery", {
	name: "Battery Module",
	id: "bat_normal",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/stock_parts/cell/computer"),
});

// /datum/design/battery/normal/proc/<init>  (code/modules/research/designs/computer_part_designs.dm:179)
rt.def("/datum/design/battery/normal/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["powerstorage", 1, "engineering", 1]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 400]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Parts"));
	return f.dot;
});

rt.type(3133, "/datum/design/battery/advanced", "/datum/design/battery", {
	name: "Advanced Battery Module",
	id: "bat_advanced",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/stock_parts/cell/computer/advanced"),
});

// /datum/design/battery/advanced/proc/<init>  (code/modules/research/designs/computer_part_designs.dm:188)
rt.def("/datum/design/battery/advanced/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["powerstorage", 2, "engineering", 2]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 800]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Parts"));
	return f.dot;
});

rt.type(3134, "/datum/design/battery/super", "/datum/design/battery", {
	name: "Super Battery Module",
	id: "bat_super",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/stock_parts/cell/computer/super"),
});

// /datum/design/battery/super/proc/<init>  (code/modules/research/designs/computer_part_designs.dm:197)
rt.def("/datum/design/battery/super/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["powerstorage", 3, "engineering", 3]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 1600]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Parts"));
	return f.dot;
});

rt.type(3135, "/datum/design/battery/nano", "/datum/design/battery", {
	name: "Nano Battery Module",
	id: "bat_nano",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/stock_parts/cell/computer/nano"),
});

// /datum/design/battery/nano/proc/<init>  (code/modules/research/designs/computer_part_designs.dm:206)
rt.def("/datum/design/battery/nano/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["powerstorage", 1, "engineering", 1]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 200]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Parts"));
	return f.dot;
});

rt.type(3136, "/datum/design/battery/micro", "/datum/design/battery", {
	name: "Micro Battery Module",
	id: "bat_micro",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/stock_parts/cell/computer/micro"),
});

// /datum/design/battery/micro/proc/<init>  (code/modules/research/designs/computer_part_designs.dm:215)
rt.def("/datum/design/battery/micro/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["powerstorage", 2, "engineering", 2]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 400]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Parts"));
	return f.dot;
});

rt.type(3137, "/datum/design/cpu", "/datum/design", {
	name: "Processor Board",
	id: "cpu_normal",
	req_tech: null,
	build_type: 1,
	materials: null,
	reagents_list: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/computer_hardware/processor_unit"),
});

// /datum/design/cpu/proc/<init>  (code/modules/research/designs/computer_part_designs.dm:226)
rt.def("/datum/design/cpu/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 3, "engineering", 2]));
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 1600]));
	rt.setSv(f, "reagents_list", rt.alist(f, ["sacid", 20]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Parts"));
	return f.dot;
});

rt.type(3138, "/datum/design/cpu/small", "/datum/design/cpu", {
	name: "Microprocessor",
	id: "cpu_small",
	req_tech: null,
	build_type: 1,
	materials: null,
	reagents_list: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/computer_hardware/processor_unit/small"),
});

// /datum/design/cpu/small/proc/<init>  (code/modules/research/designs/computer_part_designs.dm:236)
rt.def("/datum/design/cpu/small/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 2, "engineering", 2]));
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 800]));
	rt.setSv(f, "reagents_list", rt.alist(f, ["sacid", 20]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Parts"));
	return f.dot;
});

rt.type(3139, "/datum/design/cpu/photonic", "/datum/design/cpu", {
	name: "Photonic Processor Board",
	id: "pcpu_normal",
	req_tech: null,
	build_type: 1,
	materials: null,
	reagents_list: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/computer_hardware/processor_unit/photonic"),
});

// /datum/design/cpu/photonic/proc/<init>  (code/modules/research/designs/computer_part_designs.dm:246)
rt.def("/datum/design/cpu/photonic/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 5, "engineering", 4]));
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 6400, "$gold", 2000]));
	rt.setSv(f, "reagents_list", rt.alist(f, ["sacid", 40]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Parts"));
	return f.dot;
});

rt.type(3140, "/datum/design/cpu/photonic/small", "/datum/design/cpu/photonic", {
	name: "Photonic Microprocessor",
	id: "pcpu_small",
	req_tech: null,
	build_type: 1,
	materials: null,
	reagents_list: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/computer_hardware/processor_unit/photonic/small"),
});

// /datum/design/cpu/photonic/small/proc/<init>  (code/modules/research/designs/computer_part_designs.dm:256)
rt.def("/datum/design/cpu/photonic/small/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 4, "engineering", 3]));
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 3200, "$gold", 1000]));
	rt.setSv(f, "reagents_list", rt.alist(f, ["sacid", 20]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Parts"));
	return f.dot;
});
