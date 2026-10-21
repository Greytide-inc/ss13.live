// From code/modules/cargo/exports/tools.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(2067, "/datum/export/toolbox", "/datum/export", {
	cost: 4,
	unit_name: "toolbox",
	export_types: null,
});

// /datum/export/toolbox/proc/<init>  (code/modules/cargo/exports/tools.dm:6)
rt.def("/datum/export/toolbox/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/weapon/storage/toolbox")));
	return f.dot;
});

rt.type(2068, "/datum/export/screwdriver", "/datum/export", {
	cost: 2,
	unit_name: "screwdriver",
	include_subtypes: 0,
	export_types: null,
});

// /datum/export/screwdriver/proc/<init>  (code/modules/cargo/exports/tools.dm:17)
rt.def("/datum/export/screwdriver/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/weapon/screwdriver")));
	return f.dot;
});

rt.type(2069, "/datum/export/wrench", "/datum/export", {
	cost: 2,
	unit_name: "wrench",
	export_types: null,
});

// /datum/export/wrench/proc/<init>  (code/modules/cargo/exports/tools.dm:23)
rt.def("/datum/export/wrench/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/weapon/wrench")));
	return f.dot;
});

rt.type(2070, "/datum/export/crowbar", "/datum/export", {
	cost: 2,
	unit_name: "crowbar",
	export_types: null,
});

// /datum/export/crowbar/proc/<init>  (code/modules/cargo/exports/tools.dm:28)
rt.def("/datum/export/crowbar/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/weapon/crowbar")));
	return f.dot;
});

rt.type(2071, "/datum/export/wirecutters", "/datum/export", {
	cost: 2,
	unit_name: "pair",
	message: "of wirecutters",
	export_types: null,
});

// /datum/export/wirecutters/proc/<init>  (code/modules/cargo/exports/tools.dm:34)
rt.def("/datum/export/wirecutters/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/weapon/wirecutters")));
	return f.dot;
});

rt.type(2072, "/datum/export/weldingtool", "/datum/export", {
	cost: 5,
	unit_name: "welding tool",
	include_subtypes: 0,
	export_types: null,
});

// /datum/export/weldingtool/proc/<init>  (code/modules/cargo/exports/tools.dm:41)
rt.def("/datum/export/weldingtool/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/weapon/weldingtool")));
	return f.dot;
});

rt.type(2073, "/datum/export/weldingtool/emergency", "/datum/export/weldingtool", {
	cost: 2,
	unit_name: "emergency welding tool",
	export_types: null,
});

// /datum/export/weldingtool/emergency/proc/<init>  (code/modules/cargo/exports/tools.dm:47)
rt.def("/datum/export/weldingtool/emergency/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/weapon/weldingtool/mini")));
	return f.dot;
});

rt.type(2074, "/datum/export/weldingtool/industrial", "/datum/export/weldingtool", {
	cost: 10,
	unit_name: "industrial welding tool",
	export_types: null,
});

// /datum/export/weldingtool/industrial/proc/<init>  (code/modules/cargo/exports/tools.dm:52)
rt.def("/datum/export/weldingtool/industrial/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/weapon/weldingtool/largetank"), T("/obj/item/weapon/weldingtool/hugetank")));
	return f.dot;
});

rt.type(2075, "/datum/export/extinguisher", "/datum/export", {
	cost: 15,
	unit_name: "fire extinguisher",
	include_subtypes: 0,
	export_types: null,
});

// /datum/export/extinguisher/proc/<init>  (code/modules/cargo/exports/tools.dm:59)
rt.def("/datum/export/extinguisher/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/weapon/extinguisher")));
	return f.dot;
});

rt.type(2076, "/datum/export/extinguisher/mini", "/datum/export/extinguisher", {
	cost: 2,
	unit_name: "pocket fire extinguisher",
	export_types: null,
});

// /datum/export/extinguisher/mini/proc/<init>  (code/modules/cargo/exports/tools.dm:65)
rt.def("/datum/export/extinguisher/mini/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/weapon/extinguisher/mini")));
	return f.dot;
});

rt.type(2077, "/datum/export/flashlight", "/datum/export", {
	cost: 5,
	unit_name: "flashlight",
	include_subtypes: 0,
	export_types: null,
});

// /datum/export/flashlight/proc/<init>  (code/modules/cargo/exports/tools.dm:72)
rt.def("/datum/export/flashlight/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/device/flashlight")));
	return f.dot;
});

rt.type(2078, "/datum/export/flashlight/flare", "/datum/export/flashlight", {
	cost: 2,
	unit_name: "flare",
	export_types: null,
});

// /datum/export/flashlight/flare/proc/<init>  (code/modules/cargo/exports/tools.dm:78)
rt.def("/datum/export/flashlight/flare/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/device/flashlight/flare")));
	return f.dot;
});

rt.type(2079, "/datum/export/flashlight/seclite", "/datum/export/flashlight", {
	cost: 10,
	unit_name: "seclite",
	export_types: null,
});

// /datum/export/flashlight/seclite/proc/<init>  (code/modules/cargo/exports/tools.dm:83)
rt.def("/datum/export/flashlight/seclite/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/device/flashlight/seclite")));
	return f.dot;
});

rt.type(2080, "/datum/export/analyzer", "/datum/export", {
	cost: 5,
	unit_name: "analyzer",
	export_types: null,
});

// /datum/export/analyzer/proc/<init>  (code/modules/cargo/exports/tools.dm:90)
rt.def("/datum/export/analyzer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/device/analyzer")));
	return f.dot;
});

rt.type(2081, "/datum/export/analyzer/t_scanner", "/datum/export/analyzer", {
	cost: 10,
	unit_name: "t-ray scanner",
	export_types: null,
});

// /datum/export/analyzer/t_scanner/proc/<init>  (code/modules/cargo/exports/tools.dm:95)
rt.def("/datum/export/analyzer/t_scanner/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/device/t_scanner")));
	return f.dot;
});

rt.type(2082, "/datum/export/radio", "/datum/export", {
	cost: 5,
	unit_name: "radio",
	export_types: null,
	exclude_types: null,
});

// /datum/export/radio/proc/<init>  (code/modules/cargo/exports/tools.dm:101)
rt.def("/datum/export/radio/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/device/radio")));
	$0 = $0;
	rt.setSv(f, "exclude_types", rt.list(T("/obj/item/device/radio/mech")));
	return f.dot;
});

rt.type(2083, "/datum/export/rcd", "/datum/export", {
	cost: 100,
	unit_name: "rapid construction device",
	export_types: null,
});

// /datum/export/rcd/proc/<init>  (code/modules/cargo/exports/tools.dm:109)
rt.def("/datum/export/rcd/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/weapon/construction/rcd")));
	return f.dot;
});

rt.type(2084, "/datum/export/rcd_ammo", "/datum/export", {
	cost: 60,
	unit_name: "compressed matter cardridge",
	export_types: null,
});

// /datum/export/rcd_ammo/proc/<init>  (code/modules/cargo/exports/tools.dm:114)
rt.def("/datum/export/rcd_ammo/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/weapon/rcd_ammo")));
	return f.dot;
});

rt.type(2085, "/datum/export/rpd", "/datum/export", {
	cost: 350,
	unit_name: "rapid piping device",
	export_types: null,
});

// /datum/export/rpd/proc/<init>  (code/modules/cargo/exports/tools.dm:119)
rt.def("/datum/export/rpd/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/weapon/pipe_dispenser")));
	return f.dot;
});
