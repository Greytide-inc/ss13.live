// From code/modules/cargo/exports/gear.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1946, "/datum/export/gear/sec_helmet", "/datum/export/gear", {
	cost: 100,
	unit_name: "helmet",
	export_types: null,
});

// /datum/export/gear/sec_helmet/proc/<init>  (code/modules/cargo/exports/gear.dm:9)
rt.def("/datum/export/gear/sec_helmet/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/clothing/head/helmet/sec")));
	return f.dot;
});

rt.type(1947, "/datum/export/gear/sec_armor", "/datum/export/gear", {
	cost: 100,
	unit_name: "armor vest",
	include_subtypes: 0,
	export_types: null,
});

// /datum/export/gear/sec_armor/proc/<init>  (code/modules/cargo/exports/gear.dm:14)
rt.def("/datum/export/gear/sec_armor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/clothing/suit/armor/vest")));
	return f.dot;
});

rt.type(1948, "/datum/export/gear/riot_helmet", "/datum/export/gear", {
	cost: 250,
	unit_name: "riot helmet",
	export_types: null,
});

// /datum/export/gear/riot_helmet/proc/<init>  (code/modules/cargo/exports/gear.dm:21)
rt.def("/datum/export/gear/riot_helmet/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/clothing/head/helmet/riot")));
	return f.dot;
});

rt.type(1949, "/datum/export/gear/riot_armor", "/datum/export/gear", {
	cost: 250,
	unit_name: "riot armor suit",
	export_types: null,
});

// /datum/export/gear/riot_armor/proc/<init>  (code/modules/cargo/exports/gear.dm:26)
rt.def("/datum/export/gear/riot_armor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/clothing/suit/armor/riot")));
	return f.dot;
});

rt.type(1950, "/datum/export/gear/bulletproof_armor", "/datum/export/gear", {
	cost: 250,
	unit_name: "bulletproof armor vest",
	export_types: null,
});

// /datum/export/gear/bulletproof_armor/proc/<init>  (code/modules/cargo/exports/gear.dm:31)
rt.def("/datum/export/gear/bulletproof_armor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/clothing/suit/armor/bulletproof")));
	return f.dot;
});

rt.type(1951, "/datum/export/gear/reflector_armor", "/datum/export/gear", {
	cost: 650,
	unit_name: "reflector armor vest",
	export_types: null,
});

// /datum/export/gear/reflector_armor/proc/<init>  (code/modules/cargo/exports/gear.dm:36)
rt.def("/datum/export/gear/reflector_armor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/clothing/suit/armor/laserproof")));
	return f.dot;
});

rt.type(1952, "/datum/export/gear/riot_shield", "/datum/export/gear", {
	cost: 400,
	unit_name: "riot shield",
	export_types: null,
});

// /datum/export/gear/riot_shield/proc/<init>  (code/modules/cargo/exports/gear.dm:42)
rt.def("/datum/export/gear/riot_shield/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/weapon/shield/riot")));
	return f.dot;
});

rt.type(1954, "/datum/export/gear/mask/breath", "/datum/export/gear/mask", {
	cost: 2,
	unit_name: "breath mask",
	export_types: null,
});

// /datum/export/gear/mask/breath/proc/<init>  (code/modules/cargo/exports/gear.dm:49)
rt.def("/datum/export/gear/mask/breath/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/clothing/mask/breath")));
	return f.dot;
});

rt.type(1955, "/datum/export/gear/mask/gas", "/datum/export/gear/mask", {
	cost: 10,
	unit_name: "gas mask",
	include_subtypes: 0,
	export_types: null,
});

// /datum/export/gear/mask/gas/proc/<init>  (code/modules/cargo/exports/gear.dm:54)
rt.def("/datum/export/gear/mask/gas/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/clothing/mask/gas")));
	return f.dot;
});

rt.type(1957, "/datum/export/gear/space/helmet", "/datum/export/gear/space", {
	cost: 500,
	unit_name: "space helmet",
	export_types: null,
});

// /datum/export/gear/space/helmet/proc/<init>  (code/modules/cargo/exports/gear.dm:66)
rt.def("/datum/export/gear/space/helmet/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/clothing/head/helmet/space"), T("/obj/item/clothing/head/helmet/space/eva")));
	return f.dot;
});

rt.type(1958, "/datum/export/gear/space/suit", "/datum/export/gear/space", {
	cost: 600,
	unit_name: "space suit",
	export_types: null,
});

// /datum/export/gear/space/suit/proc/<init>  (code/modules/cargo/exports/gear.dm:71)
rt.def("/datum/export/gear/space/suit/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/clothing/suit/space"), T("/obj/item/clothing/suit/space/eva")));
	return f.dot;
});

rt.type(1959, "/datum/export/gear/space/voidhelmet", "/datum/export/gear/space", {
	cost: 550,
	unit_name: "void helmet",
	export_types: null,
});

// /datum/export/gear/space/voidhelmet/proc/<init>  (code/modules/cargo/exports/gear.dm:77)
rt.def("/datum/export/gear/space/voidhelmet/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/clothing/head/helmet/space/nasavoid")));
	return f.dot;
});

rt.type(1960, "/datum/export/gear/space/voidsuit", "/datum/export/gear/space", {
	cost: 650,
	unit_name: "void suit",
	export_types: null,
});

// /datum/export/gear/space/voidsuit/proc/<init>  (code/modules/cargo/exports/gear.dm:82)
rt.def("/datum/export/gear/space/voidsuit/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/clothing/suit/space/nasavoid")));
	return f.dot;
});

rt.type(1961, "/datum/export/gear/space/syndiehelmet", "/datum/export/gear/space", {
	cost: 1000,
	unit_name: "Syndicate space helmet",
	include_subtypes: 1,
	export_types: null,
});

// /datum/export/gear/space/syndiehelmet/proc/<init>  (code/modules/cargo/exports/gear.dm:88)
rt.def("/datum/export/gear/space/syndiehelmet/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/clothing/head/helmet/space/syndicate")));
	return f.dot;
});

rt.type(1962, "/datum/export/gear/space/syndiesuit", "/datum/export/gear/space", {
	cost: 1500,
	unit_name: "Syndicate space suit",
	include_subtypes: 1,
	export_types: null,
});

// /datum/export/gear/space/syndiesuit/proc/<init>  (code/modules/cargo/exports/gear.dm:94)
rt.def("/datum/export/gear/space/syndiesuit/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/clothing/suit/space/syndicate")));
	return f.dot;
});

rt.type(1963, "/datum/export/gear/radhelmet", "/datum/export/gear", {
	cost: 50,
	unit_name: "radsuit hood",
	export_types: null,
});

// /datum/export/gear/radhelmet/proc/<init>  (code/modules/cargo/exports/gear.dm:102)
rt.def("/datum/export/gear/radhelmet/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/clothing/head/radiation")));
	return f.dot;
});

rt.type(1964, "/datum/export/gear/radsuit", "/datum/export/gear", {
	cost: 100,
	unit_name: "radsuit",
	export_types: null,
});

// /datum/export/gear/radsuit/proc/<init>  (code/modules/cargo/exports/gear.dm:107)
rt.def("/datum/export/gear/radsuit/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/clothing/suit/radiation")));
	return f.dot;
});

rt.type(1965, "/datum/export/gear/biohood", "/datum/export/gear", {
	cost: 50,
	unit_name: "biosuit hood",
	export_types: null,
});

// /datum/export/gear/biohood/proc/<init>  (code/modules/cargo/exports/gear.dm:113)
rt.def("/datum/export/gear/biohood/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/clothing/head/bio_hood")));
	return f.dot;
});

rt.type(1966, "/datum/export/gear/biosuit", "/datum/export/gear", {
	cost: 100,
	unit_name: "biosuit",
	export_types: null,
});

// /datum/export/gear/biosuit/proc/<init>  (code/modules/cargo/exports/gear.dm:118)
rt.def("/datum/export/gear/biosuit/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/clothing/suit/bio_suit")));
	return f.dot;
});

rt.type(1967, "/datum/export/gear/bombhelmet", "/datum/export/gear", {
	cost: 100,
	unit_name: "bomb suit hood",
	export_types: null,
});

// /datum/export/gear/bombhelmet/proc/<init>  (code/modules/cargo/exports/gear.dm:124)
rt.def("/datum/export/gear/bombhelmet/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/clothing/head/bomb_hood")));
	return f.dot;
});

rt.type(1968, "/datum/export/gear/bombsuit", "/datum/export/gear", {
	cost: 300,
	unit_name: "bomb suit",
	export_types: null,
});

// /datum/export/gear/bombsuit/proc/<init>  (code/modules/cargo/exports/gear.dm:129)
rt.def("/datum/export/gear/bombsuit/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/clothing/suit/bomb_suit")));
	return f.dot;
});
