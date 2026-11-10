// Based on /tg/station's code/game/objects/structures/crates_lockers/closets/secure/misc.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12380, "/obj/structure/closet/secure_closet/ertCom", "/obj/structure/closet/secure_closet", {
	name: "commander's closet",
	desc: "Emergency Response Team equipment locker.",
	req_access: null,
	icon_state: "cap",
});

// misc.dm:4
rt.def("/obj/structure/closet/secure_closet/ertCom/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(109);
	return f.dot;
});

// misc.dm:8
rt.def("/obj/structure/closet/secure_closet/ertCom/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/item/weapon/storage/firstaid/regular"), this);
	yield* new_(T("/obj/item/weapon/storage/box/handcuffs"), this);
	yield* new_(T("/obj/item/device/aicard"), this);
	yield* new_(T("/obj/item/device/assembly/flash/handheld"), this);
	if (prob(50)) {
		yield* new_(T("/obj/item/ammo_box/magazine/m50"), this);
		yield* new_(T("/obj/item/ammo_box/magazine/m50"), this);
		yield* new_(T("/obj/item/weapon/gun/ballistic/automatic/pistol/deagle"), this);
	} else {
		yield* new_(T("/obj/item/ammo_box/a357"), this);
		yield* new_(T("/obj/item/ammo_box/a357"), this);
		yield* new_(T("/obj/item/weapon/gun/ballistic/revolver/mateba"), this);
	}
	return f.dot;
}, true);

rt.type(12381, "/obj/structure/closet/secure_closet/ertSec", "/obj/structure/closet/secure_closet", {
	name: "security closet",
	desc: "Emergency Response Team equipment locker.",
	req_access: null,
	icon_state: "hos",
});

// misc.dm:25
rt.def("/obj/structure/closet/secure_closet/ertSec/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(103);
	return f.dot;
});

// misc.dm:29
rt.def("/obj/structure/closet/secure_closet/ertSec/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/item/weapon/storage/box/flashbangs"), this);
	yield* new_(T("/obj/item/weapon/storage/box/teargas"), this);
	yield* new_(T("/obj/item/weapon/storage/box/flashes"), this);
	yield* new_(T("/obj/item/weapon/storage/box/handcuffs"), this);
	yield* new_(T("/obj/item/weapon/shield/riot/tele"), this);
	return f.dot;
}, true);

rt.type(12382, "/obj/structure/closet/secure_closet/ertMed", "/obj/structure/closet/secure_closet", {
	name: "medical closet",
	desc: "Emergency Response Team equipment locker.",
	req_access: null,
	icon_state: "cmo",
});

// misc.dm:39
rt.def("/obj/structure/closet/secure_closet/ertMed/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(104);
	return f.dot;
});

// misc.dm:43
rt.def("/obj/structure/closet/secure_closet/ertMed/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/item/weapon/storage/firstaid/o2"), this);
	yield* new_(T("/obj/item/weapon/storage/firstaid/toxin"), this);
	yield* new_(T("/obj/item/weapon/storage/firstaid/fire"), this);
	yield* new_(T("/obj/item/weapon/storage/firstaid/brute"), this);
	yield* new_(T("/obj/item/weapon/storage/firstaid/regular"), this);
	yield* new_(T("/obj/item/weapon/defibrillator/compact/combat/loaded"), this);
	yield* new_(T("/mob/living/simple_animal/bot/medbot"), this);
	return f.dot;
}, true);

rt.type(12383, "/obj/structure/closet/secure_closet/ertEngi", "/obj/structure/closet/secure_closet", {
	name: "engineer closet",
	desc: "Emergency Response Team equipment locker.",
	req_access: null,
	icon_state: "ce",
});

// misc.dm:55
rt.def("/obj/structure/closet/secure_closet/ertEngi/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(106);
	return f.dot;
});

// misc.dm:59
rt.def("/obj/structure/closet/secure_closet/ertEngi/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	yield* parent_proc();
	yield* new_(T("/obj/item/stack/sheet/plasteel"), this, 50);
	yield* new_(T("/obj/item/stack/sheet/metal"), this, 50);
	yield* new_(T("/obj/item/stack/sheet/glass"), this, 50);
	yield* new_(T("/obj/item/stack/sheet/mineral/sandbags"), this, 30);
	yield* new_(T("/obj/item/clothing/shoes/magboots"), this);
	yield* new_(T("/obj/item/weapon/storage/box/metalfoam"), this);
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/rcd_ammo/large"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
