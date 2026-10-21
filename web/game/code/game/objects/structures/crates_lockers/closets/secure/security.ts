// From code/game/objects/structures/crates_lockers/closets/secure/security.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12388, "/obj/structure/closet/secure_closet/captains", "/obj/structure/closet/secure_closet", {
	name: "０captain's locker",
	req_access: null,
	icon_state: "cap",
});

// /obj/structure/closet/secure_closet/captains/proc/<init>  (code/game/objects/structures/crates_lockers/closets/secure/security.dm:3)
rt.def("/obj/structure/closet/secure_closet/captains/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(20));
	return f.dot;
});

// /obj/structure/closet/secure_closet/captains/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/secure/security.dm:7)  may sleep
rt.def("/obj/structure/closet/secure_closet/captains/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/clothing/suit/hooded/wintercoat/captain"), [live(f.src)]);
	if (truthy(rt.op(f, "Prob", [], [50]))) {
		yield* g.new_(f, T("/obj/item/weapon/storage/backpack/captain"), [live(f.src)]);
	} else {
		yield* g.new_(f, T("/obj/item/weapon/storage/backpack/satchel/cap"), [live(f.src)]);
	}
	yield* g.new_(f, T("/obj/item/clothing/neck/cloak/cap"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/backpack/duffelbag/captain"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/head/crown/fancy"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/captunic"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/captainparade"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/head/caphat/parade"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/rank/captain"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/armor/vest/capcarapace/alt"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/cartridge/captain"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/shoes/sneakers/brown"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/box/silver_ids"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/radio/headset/heads/captain/alt"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/radio/headset/heads/captain"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/glasses/sunglasses/gar/supergar"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/gloves/color/captain"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/restraints/handcuffs/cable/zipties"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/belt/sabre"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/gun/energy/e_gun"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/door_remote/captain"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(12389, "/obj/structure/closet/secure_closet/hop", "/obj/structure/closet/secure_closet", {
	name: "０head of personnel's locker",
	req_access: null,
	icon_state: "hop",
});

// /obj/structure/closet/secure_closet/hop/proc/<init>  (code/game/objects/structures/crates_lockers/closets/secure/security.dm:35)
rt.def("/obj/structure/closet/secure_closet/hop/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(57));
	return f.dot;
});

// /obj/structure/closet/secure_closet/hop/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/secure/security.dm:39)  may sleep
rt.def("/obj/structure/closet/secure_closet/hop/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/clothing/neck/cloak/hop"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/rank/head_of_personnel"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/head/hopcap"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/cartridge/hop"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/radio/headset/heads/hop"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/shoes/sneakers/brown"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/box/ids"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/box/ids"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/megaphone/command"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/armor/vest/alt"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/assembly/flash/handheld"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/glasses/sunglasses"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/restraints/handcuffs/cable/zipties"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/gun/energy/e_gun"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/neck/petcollar"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/door_remote/civillian"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(12390, "/obj/structure/closet/secure_closet/hos", "/obj/structure/closet/secure_closet", {
	name: "０head of security's locker",
	req_access: null,
	icon_state: "hos",
});

// /obj/structure/closet/secure_closet/hos/proc/<init>  (code/game/objects/structures/crates_lockers/closets/secure/security.dm:59)
rt.def("/obj/structure/closet/secure_closet/hos/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(58));
	return f.dot;
});

// /obj/structure/closet/secure_closet/hos/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/secure/security.dm:63)  may sleep
rt.def("/obj/structure/closet/secure_closet/hos/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/clothing/neck/cloak/hos"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/cartridge/hos"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/radio/headset/heads/hos"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/hosparadefem"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/hosparademale"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/armor/vest/leather"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/armor/hos"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/rank/head_of_security/alt"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/head/HoS"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/glasses/hud/security/sunglasses/eyepatch"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/glasses/hud/security/sunglasses/gars/supergars"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/rank/head_of_security/grey"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/lockbox/medal/sec"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/megaphone/sec"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/holosign_creator/security"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/lockbox/loyalty"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/mask/gas/sechailer/swat"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/box/flashbangs"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/shield/riot/tele"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/belt/security/full"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/gun/energy/e_gun/hos"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/flashlight/seclite"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/pinpointer"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(12391, "/obj/structure/closet/secure_closet/warden", "/obj/structure/closet/secure_closet", {
	name: "０warden's locker",
	req_access: null,
	icon_state: "warden",
});

// /obj/structure/closet/secure_closet/warden/proc/<init>  (code/game/objects/structures/crates_lockers/closets/secure/security.dm:90)
rt.def("/obj/structure/closet/secure_closet/warden/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(3));
	return f.dot;
});

// /obj/structure/closet/secure_closet/warden/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/secure/security.dm:94)  may sleep
rt.def("/obj/structure/closet/secure_closet/warden/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/device/radio/headset/headset_sec"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/armor/vest/warden"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/head/warden"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/head/beret/sec/navywarden"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/armor/vest/warden/alt"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/rank/warden/navyblue"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/glasses/hud/security/sunglasses"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/holosign_creator/security"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/mask/gas/sechailer"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/box/zipties"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/box/flashbangs"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/belt/security/full"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/flashlight/seclite"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/gloves/krav_maga/sec"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/door_remote/head_of_security"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/gun/ballistic/shotgun/automatic/combat/compact"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(12392, "/obj/structure/closet/secure_closet/security", "/obj/structure/closet/secure_closet", {
	name: "security officer's locker",
	req_access: null,
	icon_state: "sec",
});

// /obj/structure/closet/secure_closet/security/proc/<init>  (code/game/objects/structures/crates_lockers/closets/secure/security.dm:114)
rt.def("/obj/structure/closet/secure_closet/security/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(1));
	return f.dot;
});

// /obj/structure/closet/secure_closet/security/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/secure/security.dm:118)  may sleep
rt.def("/obj/structure/closet/secure_closet/security/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/clothing/suit/armor/vest"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/head/helmet/sec"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/radio/headset/headset_sec"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/radio/headset/headset_sec/alt"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/glasses/hud/security/sunglasses"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/flashlight/seclite"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(12393, "/obj/structure/closet/secure_closet/security/sec", "/obj/structure/closet/secure_closet/security", {});

// /obj/structure/closet/secure_closet/security/sec/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/secure/security.dm:129)  may sleep
rt.def("/obj/structure/closet/secure_closet/security/sec/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/weapon/storage/belt/security/full"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(12394, "/obj/structure/closet/secure_closet/security/cargo", "/obj/structure/closet/secure_closet/security", {});

// /obj/structure/closet/secure_closet/security/cargo/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/secure/security.dm:135)  may sleep
rt.def("/obj/structure/closet/secure_closet/security/cargo/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/clothing/accessory/armband/cargo"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/encryptionkey/headset_cargo"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(12395, "/obj/structure/closet/secure_closet/security/engine", "/obj/structure/closet/secure_closet/security", {});

// /obj/structure/closet/secure_closet/security/engine/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/secure/security.dm:142)  may sleep
rt.def("/obj/structure/closet/secure_closet/security/engine/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/clothing/accessory/armband/engine"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/encryptionkey/headset_eng"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(12396, "/obj/structure/closet/secure_closet/security/science", "/obj/structure/closet/secure_closet/security", {});

// /obj/structure/closet/secure_closet/security/science/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/secure/security.dm:149)  may sleep
rt.def("/obj/structure/closet/secure_closet/security/science/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/clothing/accessory/armband/science"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/encryptionkey/headset_sci"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(12397, "/obj/structure/closet/secure_closet/security/med", "/obj/structure/closet/secure_closet/security", {});

// /obj/structure/closet/secure_closet/security/med/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/secure/security.dm:156)  may sleep
rt.def("/obj/structure/closet/secure_closet/security/med/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/clothing/accessory/armband/medblue"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/encryptionkey/headset_med"), [live(f.src)]);
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

// /obj/structure/closet/secure_closet/detective/proc/<init>  (code/game/objects/structures/crates_lockers/closets/secure/security.dm:162)
rt.def("/obj/structure/closet/secure_closet/detective/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(4));
	return f.dot;
});

// /obj/structure/closet/secure_closet/detective/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/secure/security.dm:169)  may sleep
rt.def("/obj/structure/closet/secure_closet/detective/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/clothing/under/rank/det"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/det_suit"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/head/fedora/det_hat"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/gloves/color/black"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/rank/det/grey"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/accessory/waistcoat"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/det_suit/grey"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/head/fedora"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/shoes/laceup"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/box/evidence"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/radio/headset/headset_sec"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/detective_scanner"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/flashlight/seclite"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/holosign_creator/security"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/spray/pepper"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/armor/vest/det_suit"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/belt/holster/full"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(12399, "/obj/structure/closet/secure_closet/injection", "/obj/structure/closet/secure_closet", {
	name: "lethal injections",
	req_access: null,
});

// /obj/structure/closet/secure_closet/injection/proc/<init>  (code/game/objects/structures/crates_lockers/closets/secure/security.dm:190)
rt.def("/obj/structure/closet/secure_closet/injection/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(58));
	return f.dot;
});

// /obj/structure/closet/secure_closet/injection/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/secure/security.dm:193)  may sleep
rt.def("/obj/structure/closet/secure_closet/injection/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	i = null;
	rt.forRange(f, 0, 1, 5, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/syringe/lethal/execution"), [live(f.src)]);
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

// /obj/structure/closet/secure_closet/brig/proc/<init>  (code/game/objects/structures/crates_lockers/closets/secure/security.dm:199)
rt.def("/obj/structure/closet/secure_closet/brig/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(2));
	return f.dot;
});

// /obj/structure/closet/secure_closet/brig/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/secure/security.dm:204)  may sleep
rt.def("/obj/structure/closet/secure_closet/brig/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/clothing/under/rank/prisoner"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/shoes/sneakers/orange"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(12401, "/obj/structure/closet/secure_closet/courtroom", "/obj/structure/closet/secure_closet", {
	name: "courtroom locker",
	req_access: null,
});

// /obj/structure/closet/secure_closet/courtroom/proc/<init>  (code/game/objects/structures/crates_lockers/closets/secure/security.dm:210)
rt.def("/obj/structure/closet/secure_closet/courtroom/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(42));
	return f.dot;
});

// /obj/structure/closet/secure_closet/courtroom/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/secure/security.dm:213)  may sleep
rt.def("/obj/structure/closet/secure_closet/courtroom/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/clothing/shoes/sneakers/brown"), [live(f.src)]);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/paper/Court"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	yield* g.new_(f, T("/obj/item/weapon/pen"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/judgerobe"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/head/powdered_wig"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/briefcase"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(12402, "/obj/structure/closet/secure_closet/armory1", "/obj/structure/closet/secure_closet", {
	name: "armory armor locker",
	req_access: null,
	icon_state: "armory",
});

// /obj/structure/closet/secure_closet/armory1/proc/<init>  (code/game/objects/structures/crates_lockers/closets/secure/security.dm:224)
rt.def("/obj/structure/closet/secure_closet/armory1/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(3));
	return f.dot;
});

// /obj/structure/closet/secure_closet/armory1/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/secure/security.dm:228)  may sleep
rt.def("/obj/structure/closet/secure_closet/armory1/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/clothing/suit/armor/laserproof"), [live(f.src)]);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/suit/armor/riot"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/head/helmet/riot"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/shield/riot"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(12403, "/obj/structure/closet/secure_closet/armory2", "/obj/structure/closet/secure_closet", {
	name: "armory ballistics locker",
	req_access: null,
	icon_state: "armory",
});

// /obj/structure/closet/secure_closet/armory2/proc/<init>  (code/game/objects/structures/crates_lockers/closets/secure/security.dm:239)
rt.def("/obj/structure/closet/secure_closet/armory2/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(3));
	return f.dot;
});

// /obj/structure/closet/secure_closet/armory2/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/secure/security.dm:243)  may sleep
rt.def("/obj/structure/closet/secure_closet/armory2/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/weapon/storage/box/firingpins"), [live(f.src)]);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/storage/box/rubbershot"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/gun/ballistic/shotgun/riot"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(12404, "/obj/structure/closet/secure_closet/armory3", "/obj/structure/closet/secure_closet", {
	name: "armory energy gun locker",
	req_access: null,
	icon_state: "armory",
});

// /obj/structure/closet/secure_closet/armory3/proc/<init>  (code/game/objects/structures/crates_lockers/closets/secure/security.dm:252)
rt.def("/obj/structure/closet/secure_closet/armory3/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(3));
	return f.dot;
});

// /obj/structure/closet/secure_closet/armory3/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/secure/security.dm:256)  may sleep
rt.def("/obj/structure/closet/secure_closet/armory3/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/weapon/storage/box/firingpins"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/gun/energy/ionrifle"), [live(f.src)]);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/gun/energy/e_gun"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/gun/energy/laser"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(12405, "/obj/structure/closet/secure_closet/tac", "/obj/structure/closet/secure_closet", {
	name: "armory tac locker",
	req_access: null,
	icon_state: "tac",
});

// /obj/structure/closet/secure_closet/tac/proc/<init>  (code/game/objects/structures/crates_lockers/closets/secure/security.dm:266)
rt.def("/obj/structure/closet/secure_closet/tac/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(3));
	return f.dot;
});

// /obj/structure/closet/secure_closet/tac/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/secure/security.dm:270)  may sleep
rt.def("/obj/structure/closet/secure_closet/tac/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/weapon/gun/ballistic/automatic/wt550"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/head/helmet/alt"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/mask/gas/sechailer"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/armor/bulletproof"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(12406, "/obj/structure/closet/secure_closet/lethalshots", "/obj/structure/closet/secure_closet", {
	name: "shotgun lethal rounds",
	req_access: null,
	icon_state: "tac",
});

// /obj/structure/closet/secure_closet/lethalshots/proc/<init>  (code/game/objects/structures/crates_lockers/closets/secure/security.dm:278)
rt.def("/obj/structure/closet/secure_closet/lethalshots/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(3));
	return f.dot;
});

// /obj/structure/closet/secure_closet/lethalshots/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/secure/security.dm:282)  may sleep
rt.def("/obj/structure/closet/secure_closet/lethalshots/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/storage/box/lethalshot"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
