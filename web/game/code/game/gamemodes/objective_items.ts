// Based on /tg/station's code/game/gamemodes/objective_items.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1159, "/datum/objective_item", "/datum", {
	name: "A silly bike horn! Honk!",
	difficulty: 9001,
	excludefromjob: null,
	altitems: null,
	special_equipment: null,
	targetitem: rt.typePath("/obj/item/weapon/bikehorn"),
});

// objective_items.dm:7
rt.def("/datum/objective_item/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.excludefromjob = list();

	this.altitems = list();

	this.special_equipment = list();
	return f.dot;
});

rt.type(1161, "/datum/objective_item/steal/caplaser", "/datum/objective_item/steal", {
	name: "the captain's antique laser gun",
	difficulty: 5,
	excludefromjob: null,
	targetitem: rt.typePath("/obj/item/weapon/gun/energy/laser/captain"),
});

// objective_items.dm:18
rt.def("/datum/objective_item/steal/caplaser/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.excludefromjob = list("Captain");
	return f.dot;
});

rt.type(1162, "/datum/objective_item/steal/hoslaser", "/datum/objective_item/steal", {
	name: "the head of security's personal laser gun",
	difficulty: 10,
	excludefromjob: null,
	targetitem: rt.typePath("/obj/item/weapon/gun/energy/e_gun/hos"),
});

// objective_items.dm:24
rt.def("/datum/objective_item/steal/hoslaser/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.excludefromjob = list("Head Of Security");
	return f.dot;
});

rt.type(1163, "/datum/objective_item/steal/handtele", "/datum/objective_item/steal", {
	name: "a hand teleporter",
	difficulty: 5,
	excludefromjob: null,
	targetitem: rt.typePath("/obj/item/weapon/hand_tele"),
});

// objective_items.dm:30
rt.def("/datum/objective_item/steal/handtele/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.excludefromjob = list("Captain");
	return f.dot;
});

rt.type(1164, "/datum/objective_item/steal/jetpack", "/datum/objective_item/steal", {
	name: "the Captain's jetpack",
	difficulty: 5,
	excludefromjob: null,
	targetitem: rt.typePath("/obj/item/weapon/tank/jetpack/oxygen/captain"),
});

// objective_items.dm:36
rt.def("/datum/objective_item/steal/jetpack/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.excludefromjob = list("Captain");
	return f.dot;
});

rt.type(1165, "/datum/objective_item/steal/magboots", "/datum/objective_item/steal", {
	name: "the chief engineer's advanced magnetic boots",
	difficulty: 5,
	excludefromjob: null,
	targetitem: rt.typePath("/obj/item/clothing/shoes/magboots/advance"),
});

// objective_items.dm:42
rt.def("/datum/objective_item/steal/magboots/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.excludefromjob = list("Chief Engineer");
	return f.dot;
});

rt.type(1166, "/datum/objective_item/steal/capmedal", "/datum/objective_item/steal", {
	name: "the medal of captaincy",
	difficulty: 5,
	excludefromjob: null,
	targetitem: rt.typePath("/obj/item/clothing/accessory/medal/gold/captain"),
});

// objective_items.dm:48
rt.def("/datum/objective_item/steal/capmedal/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.excludefromjob = list("Captain");
	return f.dot;
});

rt.type(1167, "/datum/objective_item/steal/hypo", "/datum/objective_item/steal", {
	name: "the hypospray",
	difficulty: 5,
	excludefromjob: null,
	targetitem: rt.typePath("/obj/item/weapon/reagent_containers/hypospray/CMO"),
});

// objective_items.dm:54
rt.def("/datum/objective_item/steal/hypo/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.excludefromjob = list("Chief Medical Officer");
	return f.dot;
});

rt.type(1168, "/datum/objective_item/steal/nukedisc", "/datum/objective_item/steal", {
	name: "the nuclear authentication disk",
	difficulty: 5,
	excludefromjob: null,
	targetitem: rt.typePath("/obj/item/weapon/disk/nuclear"),
});

// objective_items.dm:60
rt.def("/datum/objective_item/steal/nukedisc/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.excludefromjob = list("Captain");
	return f.dot;
});

rt.type(1170, "/datum/objective_item/steal/reactive", "/datum/objective_item/steal", {
	name: "the reactive teleport armor",
	difficulty: 5,
	excludefromjob: null,
	targetitem: rt.typePath("/obj/item/clothing/suit/armor/reactive"),
});

// objective_items.dm:72
rt.def("/datum/objective_item/steal/reactive/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.excludefromjob = list("Research Director");
	return f.dot;
});

rt.type(1172, "/datum/objective_item/steal/nuke_core", "/datum/objective_item/steal", {
	name: "the heavily radioactive plutonium core from the onboard self-destruct. Take care to wear the proper safety equipment when extracting the core",
	difficulty: 15,
	targetitem: rt.typePath("/obj/item/nuke_core"),
});

// objective_items.dm:85
rt.def("/datum/objective_item/steal/nuke_core/proc/New", function New(f: Frame) {
	this.special_equipment += T("/obj/item/weapon/storage/box/syndie_kit/nuke");
	parent_proc();
	return f.dot;
});

rt.type(1173, "/datum/objective_item/steal/supermatter", "/datum/objective_item/steal", {
	name: "a sliver of a supermatter crystal. Be sure to use the proper safety equipment when extracting the sliver!",
	difficulty: 15,
	targetitem: rt.typePath("/obj/item/nuke_core/supermatter_sliver"),
});

// objective_items.dm:94
rt.def("/datum/objective_item/steal/supermatter/proc/New", function New(f: Frame) {
	this.special_equipment += T("/obj/item/weapon/storage/box/syndie_kit/supermatter");
	parent_proc();
	return f.dot;
});

rt.type(1174, "/datum/objective_item/steal/plasma", "/datum/objective_item/steal", {
	name: "28 moles of plasma (full tank)",
	difficulty: 3,
	excludefromjob: null,
	targetitem: rt.typePath("/obj/item/weapon/tank"),
});

// objective_items.dm:105
rt.def("/datum/objective_item/steal/plasma/proc/check_special_completion", function check_special_completion(f: Frame, _T: Value) {
	let $0: any;
	let target_amount: Value = text2num(this.name);
	let found_amount: Value = 0;
	if (rt.index(_T.air_contents.gases, "plasma")) {
		$0 = rt.index(rt.index(_T.air_contents.gases, "plasma"), 1);
	} else {
		$0 = 0;
	}
	return ((found_amount += $0) >= target_amount ? 1 : 0);
});

rt.type(1175, "/datum/objective_item/steal/functionalai", "/datum/objective_item/steal", {
	name: "a functional AI",
	difficulty: 20,
	targetitem: rt.typePath("/obj/item/device/aicard"),
});

// objective_items.dm:117
rt.def("/datum/objective_item/steal/functionalai/proc/check_special_completion", function check_special_completion(f: Frame, C: Value) {
	let A: Value = null;
	for (A of each(C, T("/mob/living/silicon/ai"))) {
		if (rt.istype(A, T("/mob/living/silicon/ai")) && A.stat != 2) {
			return 1;
		}
	}
	return 0;
});

rt.type(1176, "/datum/objective_item/steal/blueprints", "/datum/objective_item/steal", {
	name: "the station blueprints",
	difficulty: 10,
	excludefromjob: null,
	targetitem: rt.typePath("/obj/item/areaeditor/blueprints"),
	altitems: null,
});

// objective_items.dm:126
rt.def("/datum/objective_item/steal/blueprints/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.excludefromjob = list("Chief Engineer");

	this.altitems = list(T("/obj/item/weapon/photo"));
	return f.dot;
});

// objective_items.dm:130
rt.def("/datum/objective_item/steal/blueprints/proc/check_special_completion", function check_special_completion(f: Frame, I: Value) {
	let _P: Value = null;
	if (rt.istype(I, T("/obj/item/areaeditor/blueprints"))) {
		return 1;
	}
	if (rt.istype(I, T("/obj/item/weapon/photo"))) {
		if ((_P = I).blueprints) {
			return 1;
		}
	}
	return 0;
});

rt.type(1177, "/datum/objective_item/steal/slime", "/datum/objective_item/steal", {
	name: "an unused sample of slime extract",
	difficulty: 3,
	excludefromjob: null,
	targetitem: rt.typePath("/obj/item/slime_extract"),
});

// objective_items.dm:145
rt.def("/datum/objective_item/steal/slime/proc/check_special_completion", function check_special_completion(f: Frame, E: Value) {
	if (E.Uses > 0) {
		return 1;
	}
	return 0;
});

rt.type(1189, "/datum/objective_item/stack", "/datum/objective_item", {
	name: "5 cardboards",
	difficulty: 9001,
	targetitem: rt.typePath("/obj/item/stack/sheet/cardboard"),
});

// objective_items.dm:203
rt.def("/datum/objective_item/stack/proc/check_special_completion", function check_special_completion(f: Frame, S: Value) {
	let target_amount: Value = text2num(this.name);
	let found_amount: Value = 0;
	if (rt.op(f, "IsType", [], [S, this.targetitem])) {
		found_amount = S.amount;
	}
	return (found_amount >= target_amount ? 1 : 0);
});
