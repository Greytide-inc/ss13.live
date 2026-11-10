// Based on /tg/station's code/game/objects/structures/crates_lockers/closets/secure/security.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12388, "/obj/structure/closet/secure_closet/captains", "/obj/structure/closet/secure_closet", {
	name: "０captain's locker",
	req_access: null,
	icon_state: "cap",
});

// security.dm:3
rt.def("/obj/structure/closet/secure_closet/captains/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(20);
	return f.dot;
});

// security.dm:7
rt.def("/obj/structure/closet/secure_closet/captains/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/item/clothing/suit/hooded/wintercoat/captain"), this);
	if (prob(50)) {
		yield* new_(T("/obj/item/weapon/storage/backpack/captain"), this);
	} else {
		yield* new_(T("/obj/item/weapon/storage/backpack/satchel/cap"), this);
	}
	yield* new_(T("/obj/item/clothing/neck/cloak/cap"), this);
	yield* new_(T("/obj/item/weapon/storage/backpack/duffelbag/captain"), this);
	yield* new_(T("/obj/item/clothing/head/crown/fancy"), this);
	yield* new_(T("/obj/item/clothing/suit/captunic"), this);
	yield* new_(T("/obj/item/clothing/under/captainparade"), this);
	yield* new_(T("/obj/item/clothing/head/caphat/parade"), this);
	yield* new_(T("/obj/item/clothing/under/rank/captain"), this);
	yield* new_(T("/obj/item/clothing/suit/armor/vest/capcarapace/alt"), this);
	yield* new_(T("/obj/item/weapon/cartridge/captain"), this);
	yield* new_(T("/obj/item/clothing/shoes/sneakers/brown"), this);
	yield* new_(T("/obj/item/weapon/storage/box/silver_ids"), this);
	yield* new_(T("/obj/item/device/radio/headset/heads/captain/alt"), this);
	yield* new_(T("/obj/item/device/radio/headset/heads/captain"), this);
	yield* new_(T("/obj/item/clothing/glasses/sunglasses/gar/supergar"), this);
	yield* new_(T("/obj/item/clothing/gloves/color/captain"), this);
	yield* new_(T("/obj/item/weapon/restraints/handcuffs/cable/zipties"), this);
	yield* new_(T("/obj/item/weapon/storage/belt/sabre"), this);
	yield* new_(T("/obj/item/weapon/gun/energy/e_gun"), this);
	yield* new_(T("/obj/item/weapon/door_remote/captain"), this);
	return f.dot;
}, true);

rt.type(12389, "/obj/structure/closet/secure_closet/hop", "/obj/structure/closet/secure_closet", {
	name: "０head of personnel's locker",
	req_access: null,
	icon_state: "hop",
});

// security.dm:35
rt.def("/obj/structure/closet/secure_closet/hop/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(57);
	return f.dot;
});

// security.dm:39
rt.def("/obj/structure/closet/secure_closet/hop/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/item/clothing/neck/cloak/hop"), this);
	yield* new_(T("/obj/item/clothing/under/rank/head_of_personnel"), this);
	yield* new_(T("/obj/item/clothing/head/hopcap"), this);
	yield* new_(T("/obj/item/weapon/cartridge/hop"), this);
	yield* new_(T("/obj/item/device/radio/headset/heads/hop"), this);
	yield* new_(T("/obj/item/clothing/shoes/sneakers/brown"), this);
	yield* new_(T("/obj/item/weapon/storage/box/ids"), this);
	yield* new_(T("/obj/item/weapon/storage/box/ids"), this);
	yield* new_(T("/obj/item/device/megaphone/command"), this);
	yield* new_(T("/obj/item/clothing/suit/armor/vest/alt"), this);
	yield* new_(T("/obj/item/device/assembly/flash/handheld"), this);
	yield* new_(T("/obj/item/clothing/glasses/sunglasses"), this);
	yield* new_(T("/obj/item/weapon/restraints/handcuffs/cable/zipties"), this);
	yield* new_(T("/obj/item/weapon/gun/energy/e_gun"), this);
	yield* new_(T("/obj/item/clothing/neck/petcollar"), this);
	yield* new_(T("/obj/item/weapon/door_remote/civillian"), this);
	return f.dot;
}, true);

rt.type(12390, "/obj/structure/closet/secure_closet/hos", "/obj/structure/closet/secure_closet", {
	name: "０head of security's locker",
	req_access: null,
	icon_state: "hos",
});

// security.dm:59
rt.def("/obj/structure/closet/secure_closet/hos/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(58);
	return f.dot;
});

// security.dm:63
rt.def("/obj/structure/closet/secure_closet/hos/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/item/clothing/neck/cloak/hos"), this);
	yield* new_(T("/obj/item/weapon/cartridge/hos"), this);
	yield* new_(T("/obj/item/device/radio/headset/heads/hos"), this);
	yield* new_(T("/obj/item/clothing/under/hosparadefem"), this);
	yield* new_(T("/obj/item/clothing/under/hosparademale"), this);
	yield* new_(T("/obj/item/clothing/suit/armor/vest/leather"), this);
	yield* new_(T("/obj/item/clothing/suit/armor/hos"), this);
	yield* new_(T("/obj/item/clothing/under/rank/head_of_security/alt"), this);
	yield* new_(T("/obj/item/clothing/head/HoS"), this);
	yield* new_(T("/obj/item/clothing/glasses/hud/security/sunglasses/eyepatch"), this);
	yield* new_(T("/obj/item/clothing/glasses/hud/security/sunglasses/gars/supergars"), this);
	yield* new_(T("/obj/item/clothing/under/rank/head_of_security/grey"), this);
	yield* new_(T("/obj/item/weapon/storage/lockbox/medal/sec"), this);
	yield* new_(T("/obj/item/device/megaphone/sec"), this);
	yield* new_(T("/obj/item/weapon/holosign_creator/security"), this);
	yield* new_(T("/obj/item/weapon/storage/lockbox/loyalty"), this);
	yield* new_(T("/obj/item/clothing/mask/gas/sechailer/swat"), this);
	yield* new_(T("/obj/item/weapon/storage/box/flashbangs"), this);
	yield* new_(T("/obj/item/weapon/shield/riot/tele"), this);
	yield* new_(T("/obj/item/weapon/storage/belt/security/full"), this);
	yield* new_(T("/obj/item/weapon/gun/energy/e_gun/hos"), this);
	yield* new_(T("/obj/item/device/flashlight/seclite"), this);
	yield* new_(T("/obj/item/weapon/pinpointer"), this);
	return f.dot;
}, true);

rt.type(12391, "/obj/structure/closet/secure_closet/warden", "/obj/structure/closet/secure_closet", {
	name: "０warden's locker",
	req_access: null,
	icon_state: "warden",
});

// security.dm:90
rt.def("/obj/structure/closet/secure_closet/warden/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(3);
	return f.dot;
});

// security.dm:94
rt.def("/obj/structure/closet/secure_closet/warden/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/item/device/radio/headset/headset_sec"), this);
	yield* new_(T("/obj/item/clothing/suit/armor/vest/warden"), this);
	yield* new_(T("/obj/item/clothing/head/warden"), this);
	yield* new_(T("/obj/item/clothing/head/beret/sec/navywarden"), this);
	yield* new_(T("/obj/item/clothing/suit/armor/vest/warden/alt"), this);
	yield* new_(T("/obj/item/clothing/under/rank/warden/navyblue"), this);
	yield* new_(T("/obj/item/clothing/glasses/hud/security/sunglasses"), this);
	yield* new_(T("/obj/item/weapon/holosign_creator/security"), this);
	yield* new_(T("/obj/item/clothing/mask/gas/sechailer"), this);
	yield* new_(T("/obj/item/weapon/storage/box/zipties"), this);
	yield* new_(T("/obj/item/weapon/storage/box/flashbangs"), this);
	yield* new_(T("/obj/item/weapon/storage/belt/security/full"), this);
	yield* new_(T("/obj/item/device/flashlight/seclite"), this);
	yield* new_(T("/obj/item/clothing/gloves/krav_maga/sec"), this);
	yield* new_(T("/obj/item/weapon/door_remote/head_of_security"), this);
	yield* new_(T("/obj/item/weapon/gun/ballistic/shotgun/automatic/combat/compact"), this);
	return f.dot;
}, true);

rt.type(12392, "/obj/structure/closet/secure_closet/security", "/obj/structure/closet/secure_closet", {
	name: "security officer's locker",
	req_access: null,
	icon_state: "sec",
});

// security.dm:114
rt.def("/obj/structure/closet/secure_closet/security/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(1);
	return f.dot;
});

// security.dm:118
rt.def("/obj/structure/closet/secure_closet/security/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/item/clothing/suit/armor/vest"), this);
	yield* new_(T("/obj/item/clothing/head/helmet/sec"), this);
	yield* new_(T("/obj/item/device/radio/headset/headset_sec"), this);
	yield* new_(T("/obj/item/device/radio/headset/headset_sec/alt"), this);
	yield* new_(T("/obj/item/clothing/glasses/hud/security/sunglasses"), this);
	yield* new_(T("/obj/item/device/flashlight/seclite"), this);
	return f.dot;
}, true);

rt.type(12393, "/obj/structure/closet/secure_closet/security/sec", "/obj/structure/closet/secure_closet/security", {});

// security.dm:129
rt.def("/obj/structure/closet/secure_closet/security/sec/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/item/weapon/storage/belt/security/full"), this);
	return f.dot;
}, true);

rt.type(12394, "/obj/structure/closet/secure_closet/security/cargo", "/obj/structure/closet/secure_closet/security", {});

// security.dm:135
rt.def("/obj/structure/closet/secure_closet/security/cargo/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/item/clothing/accessory/armband/cargo"), this);
	yield* new_(T("/obj/item/device/encryptionkey/headset_cargo"), this);
	return f.dot;
}, true);

rt.type(12395, "/obj/structure/closet/secure_closet/security/engine", "/obj/structure/closet/secure_closet/security", {});

// security.dm:142
rt.def("/obj/structure/closet/secure_closet/security/engine/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/item/clothing/accessory/armband/engine"), this);
	yield* new_(T("/obj/item/device/encryptionkey/headset_eng"), this);
	return f.dot;
}, true);

rt.type(12396, "/obj/structure/closet/secure_closet/security/science", "/obj/structure/closet/secure_closet/security", {});

// security.dm:149
rt.def("/obj/structure/closet/secure_closet/security/science/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/item/clothing/accessory/armband/science"), this);
	yield* new_(T("/obj/item/device/encryptionkey/headset_sci"), this);
	return f.dot;
}, true);

rt.type(12397, "/obj/structure/closet/secure_closet/security/med", "/obj/structure/closet/secure_closet/security", {});

// security.dm:156
rt.def("/obj/structure/closet/secure_closet/security/med/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/item/clothing/accessory/armband/medblue"), this);
	yield* new_(T("/obj/item/device/encryptionkey/headset_med"), this);
	return f.dot;
}, true);

rt.type(12398, "/obj/structure/closet/secure_closet/detective", "/obj/structure/closet/secure_closet", {
	name: "０detective's cabinet",
	req_access: null,
	icon_state: "cabinet",
	resistance_flags: 4,
	obj_integrity: 70,
	max_integrity: 70,
});

// security.dm:162
rt.def("/obj/structure/closet/secure_closet/detective/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(4);
	return f.dot;
});

// security.dm:169
rt.def("/obj/structure/closet/secure_closet/detective/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/item/clothing/under/rank/det"), this);
	yield* new_(T("/obj/item/clothing/suit/det_suit"), this);
	yield* new_(T("/obj/item/clothing/head/fedora/det_hat"), this);
	yield* new_(T("/obj/item/clothing/gloves/color/black"), this);
	yield* new_(T("/obj/item/clothing/under/rank/det/grey"), this);
	yield* new_(T("/obj/item/clothing/accessory/waistcoat"), this);
	yield* new_(T("/obj/item/clothing/suit/det_suit/grey"), this);
	yield* new_(T("/obj/item/clothing/head/fedora"), this);
	yield* new_(T("/obj/item/clothing/shoes/laceup"), this);
	yield* new_(T("/obj/item/weapon/storage/box/evidence"), this);
	yield* new_(T("/obj/item/device/radio/headset/headset_sec"), this);
	yield* new_(T("/obj/item/device/detective_scanner"), this);
	yield* new_(T("/obj/item/device/flashlight/seclite"), this);
	yield* new_(T("/obj/item/weapon/holosign_creator/security"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/spray/pepper"), this);
	yield* new_(T("/obj/item/clothing/suit/armor/vest/det_suit"), this);
	yield* new_(T("/obj/item/weapon/storage/belt/holster/full"), this);
	return f.dot;
}, true);

rt.type(12399, "/obj/structure/closet/secure_closet/injection", "/obj/structure/closet/secure_closet", {
	name: "lethal injections",
	req_access: null,
});

// security.dm:190
rt.def("/obj/structure/closet/secure_closet/injection/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(58);
	return f.dot;
});

// security.dm:193
rt.def("/obj/structure/closet/secure_closet/injection/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	yield* parent_proc();
	rt.forRange(f, 0, 1, 5, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/reagent_containers/syringe/lethal/execution"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(12400, "/obj/structure/closet/secure_closet/brig", "/obj/structure/closet/secure_closet", {
	id: null,
	anchored: 1,
	name: "brig locker",
	req_access: null,
});

// security.dm:199
rt.def("/obj/structure/closet/secure_closet/brig/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(2);
	return f.dot;
});

// security.dm:204
rt.def("/obj/structure/closet/secure_closet/brig/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/item/clothing/under/rank/prisoner"), this);
	yield* new_(T("/obj/item/clothing/shoes/sneakers/orange"), this);
	return f.dot;
}, true);

rt.type(12401, "/obj/structure/closet/secure_closet/courtroom", "/obj/structure/closet/secure_closet", {
	name: "courtroom locker",
	req_access: null,
});

// security.dm:210
rt.def("/obj/structure/closet/secure_closet/courtroom/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(42);
	return f.dot;
});

// security.dm:213
rt.def("/obj/structure/closet/secure_closet/courtroom/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	yield* parent_proc();
	yield* new_(T("/obj/item/clothing/shoes/sneakers/brown"), this);
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/paper/Court"), this);
	}
	rt.endFor(f, 0);
	yield* new_(T("/obj/item/weapon/pen"), this);
	yield* new_(T("/obj/item/clothing/suit/judgerobe"), this);
	yield* new_(T("/obj/item/clothing/head/powdered_wig"), this);
	yield* new_(T("/obj/item/weapon/storage/briefcase"), this);
	return f.dot;
}, true);

rt.type(12402, "/obj/structure/closet/secure_closet/armory1", "/obj/structure/closet/secure_closet", {
	name: "armory armor locker",
	req_access: null,
	icon_state: "armory",
});

// security.dm:224
rt.def("/obj/structure/closet/secure_closet/armory1/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(3);
	return f.dot;
});

// security.dm:228
rt.def("/obj/structure/closet/secure_closet/armory1/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	yield* parent_proc();
	yield* new_(T("/obj/item/clothing/suit/armor/laserproof"), this);
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/suit/armor/riot"), this);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/head/helmet/riot"), this);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/shield/riot"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(12403, "/obj/structure/closet/secure_closet/armory2", "/obj/structure/closet/secure_closet", {
	name: "armory ballistics locker",
	req_access: null,
	icon_state: "armory",
});

// security.dm:239
rt.def("/obj/structure/closet/secure_closet/armory2/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(3);
	return f.dot;
});

// security.dm:243
rt.def("/obj/structure/closet/secure_closet/armory2/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	yield* parent_proc();
	yield* new_(T("/obj/item/weapon/storage/box/firingpins"), this);
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/storage/box/rubbershot"), this);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/gun/ballistic/shotgun/riot"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(12404, "/obj/structure/closet/secure_closet/armory3", "/obj/structure/closet/secure_closet", {
	name: "armory energy gun locker",
	req_access: null,
	icon_state: "armory",
});

// security.dm:252
rt.def("/obj/structure/closet/secure_closet/armory3/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(3);
	return f.dot;
});

// security.dm:256
rt.def("/obj/structure/closet/secure_closet/armory3/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	yield* parent_proc();
	yield* new_(T("/obj/item/weapon/storage/box/firingpins"), this);
	yield* new_(T("/obj/item/weapon/gun/energy/ionrifle"), this);
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/gun/energy/e_gun"), this);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/gun/energy/laser"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(12405, "/obj/structure/closet/secure_closet/tac", "/obj/structure/closet/secure_closet", {
	name: "armory tac locker",
	req_access: null,
	icon_state: "tac",
});

// security.dm:266
rt.def("/obj/structure/closet/secure_closet/tac/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(3);
	return f.dot;
});

// security.dm:270
rt.def("/obj/structure/closet/secure_closet/tac/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/item/weapon/gun/ballistic/automatic/wt550"), this);
	yield* new_(T("/obj/item/clothing/head/helmet/alt"), this);
	yield* new_(T("/obj/item/clothing/mask/gas/sechailer"), this);
	yield* new_(T("/obj/item/clothing/suit/armor/bulletproof"), this);
	return f.dot;
}, true);

rt.type(12406, "/obj/structure/closet/secure_closet/lethalshots", "/obj/structure/closet/secure_closet", {
	name: "shotgun lethal rounds",
	req_access: null,
	icon_state: "tac",
});

// security.dm:278
rt.def("/obj/structure/closet/secure_closet/lethalshots/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(3);
	return f.dot;
});

// security.dm:282
rt.def("/obj/structure/closet/secure_closet/lethalshots/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	yield* parent_proc();
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/storage/box/lethalshot"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
