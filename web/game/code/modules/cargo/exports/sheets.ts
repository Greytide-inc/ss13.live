// From code/modules/cargo/exports/sheets.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(2048, "/datum/export/stack", "/datum/export", {
	unit_name: "sheet",
});

// /datum/export/stack/proc/get_amount  (code/modules/cargo/exports/sheets.dm:9)
rt.def("/datum/export/stack/proc/get_amount", function get_amount(f: Frame, O: Value) {
	let S: Value = null;
	f.vars = () => [S];
	if (truthy((rt.istype((S = live(O)), T("/obj/item/stack")) ? 1 : 0))) {
		return rt.fv(f, "amount", live(S));
	}
	return 0;
});

rt.type(2050, "/datum/export/stack/skin/monkey", "/datum/export/stack/skin", {
	cost: 150,
	unit_name: "monkey hide",
	export_types: null,
});

// /datum/export/stack/skin/monkey/proc/<init>  (code/modules/cargo/exports/sheets.dm:24)
rt.def("/datum/export/stack/skin/monkey/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/stack/sheet/animalhide/monkey")));
	return f.dot;
});

rt.type(2051, "/datum/export/stack/skin/human", "/datum/export/stack/skin", {
	cost: 2000,
	contraband: 1,
	unit_name: "piece",
	message: "of human skin",
	export_types: null,
});

// /datum/export/stack/skin/human/proc/<init>  (code/modules/cargo/exports/sheets.dm:32)
rt.def("/datum/export/stack/skin/human/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/stack/sheet/animalhide/human")));
	return f.dot;
});

rt.type(2052, "/datum/export/stack/skin/goliath_hide", "/datum/export/stack/skin", {
	cost: 2500,
	unit_name: "goliath hide",
	export_types: null,
});

// /datum/export/stack/skin/goliath_hide/proc/<init>  (code/modules/cargo/exports/sheets.dm:38)
rt.def("/datum/export/stack/skin/goliath_hide/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/stack/sheet/animalhide/goliath_hide")));
	return f.dot;
});

rt.type(2053, "/datum/export/stack/skin/cat", "/datum/export/stack/skin", {
	cost: 2000,
	contraband: 1,
	unit_name: "cat hide",
	export_types: null,
});

// /datum/export/stack/skin/cat/proc/<init>  (code/modules/cargo/exports/sheets.dm:45)
rt.def("/datum/export/stack/skin/cat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/stack/sheet/animalhide/cat")));
	return f.dot;
});

rt.type(2054, "/datum/export/stack/skin/corgi", "/datum/export/stack/skin", {
	cost: 2500,
	contraband: 1,
	unit_name: "corgi hide",
	export_types: null,
});

// /datum/export/stack/skin/corgi/proc/<init>  (code/modules/cargo/exports/sheets.dm:52)
rt.def("/datum/export/stack/skin/corgi/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/stack/sheet/animalhide/corgi")));
	return f.dot;
});

rt.type(2055, "/datum/export/stack/skin/lizard", "/datum/export/stack/skin", {
	cost: 5000,
	unit_name: "lizard hide",
	export_types: null,
});

// /datum/export/stack/skin/lizard/proc/<init>  (code/modules/cargo/exports/sheets.dm:58)
rt.def("/datum/export/stack/skin/lizard/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/stack/sheet/animalhide/lizard")));
	return f.dot;
});

rt.type(2056, "/datum/export/stack/skin/xeno", "/datum/export/stack/skin", {
	cost: 3000,
	unit_name: "alien hide",
	export_types: null,
});

// /datum/export/stack/skin/xeno/proc/<init>  (code/modules/cargo/exports/sheets.dm:64)
rt.def("/datum/export/stack/skin/xeno/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/stack/sheet/animalhide/xeno")));
	return f.dot;
});

rt.type(2057, "/datum/export/stack/plasteel", "/datum/export/stack", {
	cost: 305,
	message: "of plasteel",
	export_types: null,
});

// /datum/export/stack/plasteel/proc/<init>  (code/modules/cargo/exports/sheets.dm:74)
rt.def("/datum/export/stack/plasteel/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/stack/sheet/plasteel")));
	return f.dot;
});

rt.type(2058, "/datum/export/stack/rglass", "/datum/export/stack", {
	cost: 8,
	message: "of reinforced glass",
	export_types: null,
});

// /datum/export/stack/rglass/proc/<init>  (code/modules/cargo/exports/sheets.dm:80)
rt.def("/datum/export/stack/rglass/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/stack/sheet/rglass")));
	return f.dot;
});

rt.type(2059, "/datum/export/stack/bscrystal", "/datum/export/stack", {
	cost: 750,
	message: "of bluespace crystals",
	export_types: null,
});

// /datum/export/stack/bscrystal/proc/<init>  (code/modules/cargo/exports/sheets.dm:87)
rt.def("/datum/export/stack/bscrystal/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/stack/sheet/bluespace_crystal")));
	return f.dot;
});

rt.type(2060, "/datum/export/stack/wood", "/datum/export/stack", {
	cost: 50,
	unit_name: "wood plank",
	export_types: null,
});

// /datum/export/stack/wood/proc/<init>  (code/modules/cargo/exports/sheets.dm:93)
rt.def("/datum/export/stack/wood/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/stack/sheet/mineral/wood")));
	return f.dot;
});

rt.type(2061, "/datum/export/stack/cardboard", "/datum/export/stack", {
	cost: 2,
	message: "of cardboard",
	export_types: null,
});

// /datum/export/stack/cardboard/proc/<init>  (code/modules/cargo/exports/sheets.dm:99)
rt.def("/datum/export/stack/cardboard/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/stack/sheet/cardboard")));
	return f.dot;
});

rt.type(2062, "/datum/export/stack/sandstone", "/datum/export/stack", {
	cost: 1,
	unit_name: "block",
	message: "of sandstone",
	export_types: null,
});

// /datum/export/stack/sandstone/proc/<init>  (code/modules/cargo/exports/sheets.dm:106)
rt.def("/datum/export/stack/sandstone/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/stack/sheet/mineral/sandstone")));
	return f.dot;
});

rt.type(2063, "/datum/export/stack/cable", "/datum/export/stack", {
	cost: 0.2,
	unit_name: "cable piece",
	export_types: null,
});

// /datum/export/stack/cable/proc/<init>  (code/modules/cargo/exports/sheets.dm:112)
rt.def("/datum/export/stack/cable/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/stack/cable_coil")));
	return f.dot;
});

rt.type(2064, "/datum/export/stack/abductor", "/datum/export/stack", {
	cost: 5000,
	message: "of alien alloy",
	export_types: null,
});

// /datum/export/stack/abductor/proc/<init>  (code/modules/cargo/exports/sheets.dm:122)
rt.def("/datum/export/stack/abductor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/stack/sheet/mineral/abductor")));
	return f.dot;
});

rt.type(2065, "/datum/export/stack/adamantine", "/datum/export/stack", {
	unit_name: "bar",
	cost: 7500,
	message: "of adamantine",
	export_types: null,
});

// /datum/export/stack/adamantine/proc/<init>  (code/modules/cargo/exports/sheets.dm:129)
rt.def("/datum/export/stack/adamantine/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/stack/sheet/mineral/adamantine")));
	return f.dot;
});

rt.type(2066, "/datum/export/stack/mythril", "/datum/export/stack", {
	cost: 15000,
	message: "of mythril",
	export_types: null,
});

// /datum/export/stack/mythril/proc/<init>  (code/modules/cargo/exports/sheets.dm:135)
rt.def("/datum/export/stack/mythril/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/stack/sheet/mineral/mythril")));
	return f.dot;
});
