// Based on /tg/station's code/game/objects/structures/crates_lockers/closets/secure/medical.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12374, "/obj/structure/closet/secure_closet/medical1", "/obj/structure/closet/secure_closet", {
	name: "medicine closet",
	desc: "Filled to the brim with medical junk.",
	icon_state: "med",
	req_access: null,
});

// medical.dm:5
rt.def("/obj/structure/closet/secure_closet/medical1/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(5);
	return f.dot;
});

// medical.dm:8
rt.def("/obj/structure/closet/secure_closet/medical1/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	yield* parent_proc();
	yield* new_(T("/obj/item/weapon/reagent_containers/glass/beaker"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/glass/beaker"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/dropper"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/dropper"), this);
	yield* new_(T("/obj/item/weapon/storage/belt/medical"), this);
	yield* new_(T("/obj/item/weapon/storage/box/syringes"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/glass/bottle/toxin"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/glass/bottle/morphine"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/glass/bottle/morphine"), this);
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/reagent_containers/glass/bottle/epinephrine"), this);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/reagent_containers/glass/bottle/charcoal"), this);
	}
	rt.endFor(f, 0);
	yield* new_(T("/obj/item/weapon/storage/box/rxglasses"), this);
	return f.dot;
}, true);

rt.type(12375, "/obj/structure/closet/secure_closet/medical2", "/obj/structure/closet/secure_closet", {
	name: "anesthetic closet",
	desc: "Used to knock people out.",
	req_access: null,
});

// medical.dm:27
rt.def("/obj/structure/closet/secure_closet/medical2/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(45);
	return f.dot;
});

// medical.dm:30
rt.def("/obj/structure/closet/secure_closet/medical2/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	yield* parent_proc();
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/tank/internals/anesthetic"), this);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/mask/breath/medical"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(12376, "/obj/structure/closet/secure_closet/medical3", "/obj/structure/closet/secure_closet", {
	name: "medical doctor's locker",
	req_access: null,
	icon_state: "med_secure",
});

// medical.dm:38
rt.def("/obj/structure/closet/secure_closet/medical3/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(45);
	return f.dot;
});

// medical.dm:42
rt.def("/obj/structure/closet/secure_closet/medical3/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/item/device/radio/headset/headset_med"), this);
	yield* new_(T("/obj/item/weapon/defibrillator/loaded"), this);
	yield* new_(T("/obj/item/clothing/gloves/color/latex/nitrile"), this);
	yield* new_(T("/obj/item/weapon/storage/belt/medical"), this);
	yield* new_(T("/obj/item/clothing/glasses/hud/health"), this);
	return f.dot;
}, true);

rt.type(12377, "/obj/structure/closet/secure_closet/CMO", "/obj/structure/closet/secure_closet", {
	name: "０chief medical officer's locker",
	req_access: null,
	icon_state: "cmo",
});

// medical.dm:52
rt.def("/obj/structure/closet/secure_closet/CMO/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(40);
	return f.dot;
});

// medical.dm:56
rt.def("/obj/structure/closet/secure_closet/CMO/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/item/clothing/neck/cloak/cmo"), this);
	yield* new_(T("/obj/item/weapon/storage/backpack/duffelbag/med"), this);
	yield* new_(T("/obj/item/clothing/suit/bio_suit/cmo"), this);
	yield* new_(T("/obj/item/clothing/head/bio_hood/cmo"), this);
	yield* new_(T("/obj/item/clothing/suit/toggle/labcoat/cmo"), this);
	yield* new_(T("/obj/item/clothing/under/rank/chief_medical_officer"), this);
	yield* new_(T("/obj/item/clothing/shoes/sneakers/brown"), this);
	yield* new_(T("/obj/item/weapon/cartridge/cmo"), this);
	yield* new_(T("/obj/item/device/radio/headset/heads/cmo"), this);
	yield* new_(T("/obj/item/device/megaphone/command"), this);
	yield* new_(T("/obj/item/weapon/defibrillator/compact/loaded"), this);
	yield* new_(T("/obj/item/clothing/gloves/color/latex/nitrile"), this);
	yield* new_(T("/obj/item/weapon/storage/belt/medical"), this);
	yield* new_(T("/obj/item/device/assembly/flash/handheld"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/hypospray/CMO"), this);
	yield* new_(T("/obj/item/device/autosurgeon/cmo"), this);
	yield* new_(T("/obj/item/weapon/door_remote/chief_medical_officer"), this);
	return f.dot;
}, true);

rt.type(12378, "/obj/structure/closet/secure_closet/animal", "/obj/structure/closet/secure_closet", {
	name: "animal control",
	req_access: null,
});

// medical.dm:77
rt.def("/obj/structure/closet/secure_closet/animal/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(45);
	return f.dot;
});

// medical.dm:80
rt.def("/obj/structure/closet/secure_closet/animal/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	yield* parent_proc();
	yield* new_(T("/obj/item/device/assembly/signaler"), this);
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/device/electropack"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(12379, "/obj/structure/closet/secure_closet/chemical", "/obj/structure/closet/secure_closet", {
	icon_door: "chemical",
	name: "chemical closet",
	desc: "Store dangerous chemicals in here.",
});

// medical.dm:91
rt.def("/obj/structure/closet/secure_closet/chemical/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/item/weapon/storage/box/pillbottles"), this);
	yield* new_(T("/obj/item/weapon/storage/box/pillbottles"), this);
	return f.dot;
}, true);
