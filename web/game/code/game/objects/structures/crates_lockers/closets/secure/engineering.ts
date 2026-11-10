// Based on /tg/station's code/game/objects/structures/crates_lockers/closets/secure/engineering.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12359, "/obj/structure/closet/secure_closet/engineering_chief", "/obj/structure/closet/secure_closet", {
	name: "０chief engineer's locker",
	req_access: null,
	icon_state: "ce",
});

// engineering.dm:3
rt.def("/obj/structure/closet/secure_closet/engineering_chief/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(56);
	return f.dot;
});

// engineering.dm:7
rt.def("/obj/structure/closet/secure_closet/engineering_chief/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/item/clothing/neck/cloak/ce"), this);
	yield* new_(T("/obj/item/clothing/under/rank/chief_engineer"), this);
	yield* new_(T("/obj/item/clothing/head/hardhat/white"), this);
	yield* new_(T("/obj/item/clothing/head/welding"), this);
	yield* new_(T("/obj/item/clothing/gloves/color/yellow"), this);
	yield* new_(T("/obj/item/clothing/shoes/sneakers/brown"), this);
	yield* new_(T("/obj/item/weapon/tank/jetpack/suit"), this);
	yield* new_(T("/obj/item/weapon/cartridge/ce"), this);
	yield* new_(T("/obj/item/device/radio/headset/heads/ce"), this);
	yield* new_(T("/obj/item/weapon/storage/toolbox/mechanical"), this);
	yield* new_(T("/obj/item/clothing/suit/hazardvest"), this);
	yield* new_(T("/obj/item/device/megaphone/command"), this);
	yield* new_(T("/obj/item/areaeditor/blueprints"), this);
	yield* new_(T("/obj/item/weapon/airlock_painter"), this);
	yield* new_(T("/obj/item/weapon/holosign_creator/engineering"), this);
	yield* new_(T("/obj/item/clothing/mask/gas"), this);
	yield* new_(T("/obj/item/device/multitool"), this);
	yield* new_(T("/obj/item/device/assembly/flash/handheld"), this);
	yield* new_(T("/obj/item/clothing/glasses/meson/engine"), this);
	yield* new_(T("/obj/item/weapon/door_remote/chief_engineer"), this);
	yield* new_(T("/obj/item/weapon/pipe_dispenser"), this);
	yield* new_(T("/obj/item/weapon/inducer"), this);
	return f.dot;
}, true);

rt.type(12360, "/obj/structure/closet/secure_closet/engineering_electrical", "/obj/structure/closet/secure_closet", {
	icon_door: "eng_elec",
	name: "electrical supplies locker",
	req_access: null,
	icon_state: "eng",
});

// engineering.dm:33
rt.def("/obj/structure/closet/secure_closet/engineering_electrical/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(11);
	return f.dot;
});

// engineering.dm:38
rt.def("/obj/structure/closet/secure_closet/engineering_electrical/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	yield* parent_proc();
	yield* new_(T("/obj/item/clothing/gloves/color/yellow"), this);
	yield* new_(T("/obj/item/clothing/gloves/color/yellow"), this);
	yield* new_(T("/obj/item/weapon/inducer"), this);
	yield* new_(T("/obj/item/weapon/inducer"), this);
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/storage/toolbox/electrical"), this);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/electronics/apc"), this);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/device/multitool"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(12361, "/obj/structure/closet/secure_closet/engineering_welding", "/obj/structure/closet/secure_closet", {
	icon_door: "eng_weld",
	name: "welding supplies locker",
	req_access: null,
	icon_state: "eng",
});

// engineering.dm:52
rt.def("/obj/structure/closet/secure_closet/engineering_welding/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(11);
	return f.dot;
});

// engineering.dm:57
rt.def("/obj/structure/closet/secure_closet/engineering_welding/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	yield* parent_proc();
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/head/welding"), this);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/weldingtool"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(12362, "/obj/structure/closet/secure_closet/engineering_personal", "/obj/structure/closet/secure_closet", {
	name: "engineer's locker",
	req_access: null,
	icon_state: "eng_secure",
});

// engineering.dm:65
rt.def("/obj/structure/closet/secure_closet/engineering_personal/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(11);
	return f.dot;
});

// engineering.dm:69
rt.def("/obj/structure/closet/secure_closet/engineering_personal/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/item/device/radio/headset/headset_eng"), this);
	yield* new_(T("/obj/item/weapon/storage/toolbox/mechanical"), this);
	yield* new_(T("/obj/item/weapon/tank/internals/emergency_oxygen/engi"), this);
	yield* new_(T("/obj/item/weapon/holosign_creator/engineering"), this);
	yield* new_(T("/obj/item/clothing/mask/gas"), this);
	yield* new_(T("/obj/item/clothing/glasses/meson/engine"), this);
	yield* new_(T("/obj/item/weapon/storage/box/emptysandbags"), this);
	return f.dot;
}, true);

rt.type(12363, "/obj/structure/closet/secure_closet/atmospherics", "/obj/structure/closet/secure_closet", {
	name: "０atmospheric technician's locker",
	req_access: null,
	icon_state: "atmos",
});

// engineering.dm:81
rt.def("/obj/structure/closet/secure_closet/atmospherics/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(24);
	return f.dot;
});

// engineering.dm:85
rt.def("/obj/structure/closet/secure_closet/atmospherics/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/item/device/radio/headset/headset_eng"), this);
	yield* new_(T("/obj/item/weapon/pipe_dispenser"), this);
	yield* new_(T("/obj/item/weapon/storage/toolbox/mechanical"), this);
	yield* new_(T("/obj/item/weapon/tank/internals/emergency_oxygen/engi"), this);
	yield* new_(T("/obj/item/device/analyzer"), this);
	yield* new_(T("/obj/item/weapon/holosign_creator/atmos"), this);
	yield* new_(T("/obj/item/weapon/watertank/atmos"), this);
	yield* new_(T("/obj/item/clothing/suit/fire/atmos"), this);
	yield* new_(T("/obj/item/clothing/head/hardhat/atmos"), this);
	yield* new_(T("/obj/item/clothing/glasses/meson/engine/tray"), this);
	return f.dot;
}, true);
