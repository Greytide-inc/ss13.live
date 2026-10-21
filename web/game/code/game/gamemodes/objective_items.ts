// From code/game/gamemodes/objective_items.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1159, "/datum/objective_item", "/datum", {
	name: "A silly bike horn! Honk!",
	difficulty: 9001,
	excludefromjob: null,
	altitems: null,
	special_equipment: null,
	targetitem: rt.typePath("/obj/item/weapon/bikehorn"),
});

// /datum/objective_item/proc/<init>  (code/game/gamemodes/objective_items.dm:7)
rt.def("/datum/objective_item/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "excludefromjob", rt.list());
	$0 = $0;
	rt.setSv(f, "altitems", rt.list());
	$0 = $0;
	rt.setSv(f, "special_equipment", rt.list());
	return f.dot;
});

rt.type(1161, "/datum/objective_item/steal/caplaser", "/datum/objective_item/steal", {
	name: "the captain's antique laser gun",
	difficulty: 5,
	excludefromjob: null,
	targetitem: rt.typePath("/obj/item/weapon/gun/energy/laser/captain"),
});

// /datum/objective_item/steal/caplaser/proc/<init>  (code/game/gamemodes/objective_items.dm:18)
rt.def("/datum/objective_item/steal/caplaser/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "excludefromjob", rt.list("Captain"));
	return f.dot;
});

rt.type(1162, "/datum/objective_item/steal/hoslaser", "/datum/objective_item/steal", {
	name: "the head of security's personal laser gun",
	difficulty: 10,
	excludefromjob: null,
	targetitem: rt.typePath("/obj/item/weapon/gun/energy/e_gun/hos"),
});

// /datum/objective_item/steal/hoslaser/proc/<init>  (code/game/gamemodes/objective_items.dm:24)
rt.def("/datum/objective_item/steal/hoslaser/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "excludefromjob", rt.list("Head Of Security"));
	return f.dot;
});

rt.type(1163, "/datum/objective_item/steal/handtele", "/datum/objective_item/steal", {
	name: "a hand teleporter",
	difficulty: 5,
	excludefromjob: null,
	targetitem: rt.typePath("/obj/item/weapon/hand_tele"),
});

// /datum/objective_item/steal/handtele/proc/<init>  (code/game/gamemodes/objective_items.dm:30)
rt.def("/datum/objective_item/steal/handtele/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "excludefromjob", rt.list("Captain"));
	return f.dot;
});

rt.type(1164, "/datum/objective_item/steal/jetpack", "/datum/objective_item/steal", {
	name: "the Captain's jetpack",
	difficulty: 5,
	excludefromjob: null,
	targetitem: rt.typePath("/obj/item/weapon/tank/jetpack/oxygen/captain"),
});

// /datum/objective_item/steal/jetpack/proc/<init>  (code/game/gamemodes/objective_items.dm:36)
rt.def("/datum/objective_item/steal/jetpack/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "excludefromjob", rt.list("Captain"));
	return f.dot;
});

rt.type(1165, "/datum/objective_item/steal/magboots", "/datum/objective_item/steal", {
	name: "the chief engineer's advanced magnetic boots",
	difficulty: 5,
	excludefromjob: null,
	targetitem: rt.typePath("/obj/item/clothing/shoes/magboots/advance"),
});

// /datum/objective_item/steal/magboots/proc/<init>  (code/game/gamemodes/objective_items.dm:42)
rt.def("/datum/objective_item/steal/magboots/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "excludefromjob", rt.list("Chief Engineer"));
	return f.dot;
});

rt.type(1166, "/datum/objective_item/steal/capmedal", "/datum/objective_item/steal", {
	name: "the medal of captaincy",
	difficulty: 5,
	excludefromjob: null,
	targetitem: rt.typePath("/obj/item/clothing/accessory/medal/gold/captain"),
});

// /datum/objective_item/steal/capmedal/proc/<init>  (code/game/gamemodes/objective_items.dm:48)
rt.def("/datum/objective_item/steal/capmedal/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "excludefromjob", rt.list("Captain"));
	return f.dot;
});

rt.type(1167, "/datum/objective_item/steal/hypo", "/datum/objective_item/steal", {
	name: "the hypospray",
	difficulty: 5,
	excludefromjob: null,
	targetitem: rt.typePath("/obj/item/weapon/reagent_containers/hypospray/CMO"),
});

// /datum/objective_item/steal/hypo/proc/<init>  (code/game/gamemodes/objective_items.dm:54)
rt.def("/datum/objective_item/steal/hypo/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "excludefromjob", rt.list("Chief Medical Officer"));
	return f.dot;
});

rt.type(1168, "/datum/objective_item/steal/nukedisc", "/datum/objective_item/steal", {
	name: "the nuclear authentication disk",
	difficulty: 5,
	excludefromjob: null,
	targetitem: rt.typePath("/obj/item/weapon/disk/nuclear"),
});

// /datum/objective_item/steal/nukedisc/proc/<init>  (code/game/gamemodes/objective_items.dm:60)
rt.def("/datum/objective_item/steal/nukedisc/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "excludefromjob", rt.list("Captain"));
	return f.dot;
});

rt.type(1170, "/datum/objective_item/steal/reactive", "/datum/objective_item/steal", {
	name: "the reactive teleport armor",
	difficulty: 5,
	excludefromjob: null,
	targetitem: rt.typePath("/obj/item/clothing/suit/armor/reactive"),
});

// /datum/objective_item/steal/reactive/proc/<init>  (code/game/gamemodes/objective_items.dm:72)
rt.def("/datum/objective_item/steal/reactive/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "excludefromjob", rt.list("Research Director"));
	return f.dot;
});

rt.type(1172, "/datum/objective_item/steal/nuke_core", "/datum/objective_item/steal", {
	name: "the heavily radioactive plutonium core from the onboard self-destruct. Take care to wear the proper safety equipment when extracting the core",
	difficulty: 15,
	targetitem: rt.typePath("/obj/item/nuke_core"),
});

// /datum/objective_item/steal/nuke_core/proc/New  (code/game/gamemodes/objective_items.dm:85)
rt.def("/datum/objective_item/steal/nuke_core/proc/New", function New(f: Frame) {
	rt.modSrcVar(f, "special_equipment", T("/obj/item/weapon/storage/box/syndie_kit/nuke"), add);
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

rt.type(1173, "/datum/objective_item/steal/supermatter", "/datum/objective_item/steal", {
	name: "a sliver of a supermatter crystal. Be sure to use the proper safety equipment when extracting the sliver!",
	difficulty: 15,
	targetitem: rt.typePath("/obj/item/nuke_core/supermatter_sliver"),
});

// /datum/objective_item/steal/supermatter/proc/New  (code/game/gamemodes/objective_items.dm:94)
rt.def("/datum/objective_item/steal/supermatter/proc/New", function New(f: Frame) {
	rt.modSrcVar(f, "special_equipment", T("/obj/item/weapon/storage/box/syndie_kit/supermatter"), add);
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

rt.type(1174, "/datum/objective_item/steal/plasma", "/datum/objective_item/steal", {
	name: "28 moles of plasma (full tank)",
	difficulty: 3,
	excludefromjob: null,
	targetitem: rt.typePath("/obj/item/weapon/tank"),
});

// /datum/objective_item/steal/plasma/proc/check_special_completion  (code/game/gamemodes/objective_items.dm:105)
rt.def("/datum/objective_item/steal/plasma/proc/check_special_completion", function check_special_completion(f: Frame, _T: Value) {
	let target_amount: Value = null, found_amount: Value = null;
	let $0: any;
	f.vars = () => [target_amount, found_amount, $0];
	target_amount = rt.call(f, P("/proc/text2num"), null, [rt.sv(f, "name")]);
	found_amount = 0;
	if (truthy(rt.index(rt.gv(f, "gases", rt.fv(f, "air_contents", live(_T))), "plasma"))) {
		$0 = rt.index(rt.index(rt.gv(f, "gases", rt.fv(f, "air_contents", live(_T))), "plasma"), 1);
	} else {
		$0 = 0;
	}
	return (rt.ge((found_amount = rt.modify(live(found_amount), $0, add)), live(target_amount)) ? 1 : 0);
});

rt.type(1175, "/datum/objective_item/steal/functionalai", "/datum/objective_item/steal", {
	name: "a functional AI",
	difficulty: 20,
	targetitem: rt.typePath("/obj/item/device/aicard"),
});

// /datum/objective_item/steal/functionalai/proc/check_special_completion  (code/game/gamemodes/objective_items.dm:117)
rt.def("/datum/objective_item/steal/functionalai/proc/check_special_completion", function check_special_completion(f: Frame, C: Value) {
	let A: Value = null;
	let $e: any;
	f.vars = () => [A, $e];
	A = null;
	rt.forList(f, 0, live(C), T("/mob/living/silicon/ai"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if ((truthy((rt.istype(live(A), T("/mob/living/silicon/ai")) ? 1 : 0)) && !isEqual(rt.fv(f, "stat", live(A)), 2))) {
			return 1;
		}
	}
	rt.endFor(f, 0);
	return 0;
});

rt.type(1176, "/datum/objective_item/steal/blueprints", "/datum/objective_item/steal", {
	name: "the station blueprints",
	difficulty: 10,
	excludefromjob: null,
	targetitem: rt.typePath("/obj/item/areaeditor/blueprints"),
	altitems: null,
});

// /datum/objective_item/steal/blueprints/proc/<init>  (code/game/gamemodes/objective_items.dm:126)
rt.def("/datum/objective_item/steal/blueprints/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "excludefromjob", rt.list("Chief Engineer"));
	$0 = $0;
	rt.setSv(f, "altitems", rt.list(T("/obj/item/weapon/photo")));
	return f.dot;
});

// /datum/objective_item/steal/blueprints/proc/check_special_completion  (code/game/gamemodes/objective_items.dm:130)
rt.def("/datum/objective_item/steal/blueprints/proc/check_special_completion", function check_special_completion(f: Frame, I: Value) {
	let _P: Value = null;
	f.vars = () => [_P];
	if (truthy((rt.istype(live(I), T("/obj/item/areaeditor/blueprints")) ? 1 : 0))) {
		return 1;
	}
	if (truthy((rt.istype(live(I), T("/obj/item/weapon/photo")) ? 1 : 0))) {
		if (truthy(rt.gv(f, "blueprints", (_P = live(I))))) {
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

// /datum/objective_item/steal/slime/proc/check_special_completion  (code/game/gamemodes/objective_items.dm:145)
rt.def("/datum/objective_item/steal/slime/proc/check_special_completion", function check_special_completion(f: Frame, E: Value) {
	if (rt.gt(rt.fv(f, "Uses", live(E)), 0)) {
		return 1;
	}
	return 0;
});

rt.type(1189, "/datum/objective_item/stack", "/datum/objective_item", {
	name: "5 cardboards",
	difficulty: 9001,
	targetitem: rt.typePath("/obj/item/stack/sheet/cardboard"),
});

// /datum/objective_item/stack/proc/check_special_completion  (code/game/gamemodes/objective_items.dm:203)
rt.def("/datum/objective_item/stack/proc/check_special_completion", function check_special_completion(f: Frame, S: Value) {
	let target_amount: Value = null, found_amount: Value = null;
	f.vars = () => [target_amount, found_amount];
	target_amount = rt.call(f, P("/proc/text2num"), null, [rt.sv(f, "name")]);
	found_amount = 0;
	if (truthy(rt.op(f, "IsType", [], [live(S), rt.sv(f, "targetitem")]))) {
		found_amount = rt.fv(f, "amount", live(S));
	}
	return (rt.ge(live(found_amount), live(target_amount)) ? 1 : 0);
});
