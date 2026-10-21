// From code/modules/cargo/exports/weapons.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(2087, "/datum/export/weapon/baton", "/datum/export/weapon", {
	cost: 100,
	unit_name: "stun baton",
	include_subtypes: 1,
	export_types: null,
	exclude_types: null,
});

// /datum/export/weapon/baton/proc/<init>  (code/modules/cargo/exports/weapons.dm:9)
rt.def("/datum/export/weapon/baton/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/weapon/melee/baton")));
	$0 = $0;
	rt.setSv(f, "exclude_types", rt.list(T("/obj/item/weapon/melee/baton/cattleprod")));
	return f.dot;
});

rt.type(2088, "/datum/export/weapon/knife", "/datum/export/weapon", {
	cost: 750,
	unit_name: "combat knife",
	export_types: null,
});

// /datum/export/weapon/knife/proc/<init>  (code/modules/cargo/exports/weapons.dm:16)
rt.def("/datum/export/weapon/knife/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/weapon/kitchen/knife/combat")));
	return f.dot;
});

rt.type(2089, "/datum/export/weapon/taser", "/datum/export/weapon", {
	cost: 250,
	unit_name: "advanced taser",
	export_types: null,
});

// /datum/export/weapon/taser/proc/<init>  (code/modules/cargo/exports/weapons.dm:22)
rt.def("/datum/export/weapon/taser/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/weapon/gun/energy/e_gun/advtaser")));
	return f.dot;
});

rt.type(2090, "/datum/export/weapon/laser", "/datum/export/weapon", {
	cost: 250,
	unit_name: "laser gun",
	export_types: null,
});

// /datum/export/weapon/laser/proc/<init>  (code/modules/cargo/exports/weapons.dm:27)
rt.def("/datum/export/weapon/laser/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/weapon/gun/energy/laser")));
	return f.dot;
});

rt.type(2091, "/datum/export/weapon/disabler", "/datum/export/weapon", {
	cost: 100,
	unit_name: "disabler",
	export_types: null,
});

// /datum/export/weapon/disabler/proc/<init>  (code/modules/cargo/exports/weapons.dm:32)
rt.def("/datum/export/weapon/disabler/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/weapon/gun/energy/disabler")));
	return f.dot;
});

rt.type(2092, "/datum/export/weapon/energy_gun", "/datum/export/weapon", {
	cost: 900,
	unit_name: "energy gun",
	export_types: null,
});

// /datum/export/weapon/energy_gun/proc/<init>  (code/modules/cargo/exports/weapons.dm:37)
rt.def("/datum/export/weapon/energy_gun/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/weapon/gun/energy/e_gun")));
	return f.dot;
});

rt.type(2093, "/datum/export/weapon/wt550", "/datum/export/weapon", {
	cost: 1400,
	unit_name: "WT-550 automatic rifle",
	export_types: null,
});

// /datum/export/weapon/wt550/proc/<init>  (code/modules/cargo/exports/weapons.dm:43)
rt.def("/datum/export/weapon/wt550/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/weapon/gun/ballistic/automatic/wt550")));
	return f.dot;
});

rt.type(2094, "/datum/export/weapon/shotgun", "/datum/export/weapon", {
	cost: 350,
	unit_name: "combat shotgun",
	export_types: null,
});

// /datum/export/weapon/shotgun/proc/<init>  (code/modules/cargo/exports/weapons.dm:48)
rt.def("/datum/export/weapon/shotgun/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/weapon/gun/ballistic/shotgun/automatic/combat")));
	return f.dot;
});

rt.type(2095, "/datum/export/weapon/flashbang", "/datum/export/weapon", {
	cost: 15,
	unit_name: "flashbang grenade",
	export_types: null,
});

// /datum/export/weapon/flashbang/proc/<init>  (code/modules/cargo/exports/weapons.dm:54)
rt.def("/datum/export/weapon/flashbang/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/weapon/grenade/flashbang")));
	return f.dot;
});

rt.type(2096, "/datum/export/weapon/teargas", "/datum/export/weapon", {
	cost: 15,
	unit_name: "tear gas grenade",
	export_types: null,
});

// /datum/export/weapon/teargas/proc/<init>  (code/modules/cargo/exports/weapons.dm:59)
rt.def("/datum/export/weapon/teargas/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/weapon/grenade/chem_grenade/teargas")));
	return f.dot;
});

rt.type(2097, "/datum/export/weapon/flash", "/datum/export/weapon", {
	cost: 10,
	unit_name: "handheld flash",
	include_subtypes: 1,
	export_types: null,
});

// /datum/export/weapon/flash/proc/<init>  (code/modules/cargo/exports/weapons.dm:65)
rt.def("/datum/export/weapon/flash/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/device/assembly/flash")));
	return f.dot;
});

rt.type(2098, "/datum/export/weapon/handcuffs", "/datum/export/weapon", {
	cost: 3,
	unit_name: "pair",
	message: "of handcuffs",
	export_types: null,
});

// /datum/export/weapon/handcuffs/proc/<init>  (code/modules/cargo/exports/weapons.dm:72)
rt.def("/datum/export/weapon/handcuffs/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/weapon/restraints/handcuffs")));
	return f.dot;
});
