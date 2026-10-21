// From code/game/objects/structures/crates_lockers/closets/secure/engineering.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12359, "/obj/structure/closet/secure_closet/engineering_chief", "/obj/structure/closet/secure_closet", {
	name: "０chief engineer's locker",
	req_access: null,
	icon_state: "ce",
});

// /obj/structure/closet/secure_closet/engineering_chief/proc/<init>  (code/game/objects/structures/crates_lockers/closets/secure/engineering.dm:3)
rt.def("/obj/structure/closet/secure_closet/engineering_chief/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(56));
	return f.dot;
});

// /obj/structure/closet/secure_closet/engineering_chief/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/secure/engineering.dm:7)  may sleep
rt.def("/obj/structure/closet/secure_closet/engineering_chief/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/clothing/neck/cloak/ce"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/rank/chief_engineer"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/head/hardhat/white"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/head/welding"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/gloves/color/yellow"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/shoes/sneakers/brown"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/tank/jetpack/suit"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/cartridge/ce"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/radio/headset/heads/ce"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/toolbox/mechanical"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/hazardvest"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/megaphone/command"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/areaeditor/blueprints"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/airlock_painter"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/holosign_creator/engineering"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/mask/gas"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/multitool"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/assembly/flash/handheld"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/glasses/meson/engine"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/door_remote/chief_engineer"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/pipe_dispenser"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/inducer"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(12360, "/obj/structure/closet/secure_closet/engineering_electrical", "/obj/structure/closet/secure_closet", {
	icon_door: "eng_elec",
	name: "electrical supplies locker",
	req_access: null,
	icon_state: "eng",
});

// /obj/structure/closet/secure_closet/engineering_electrical/proc/<init>  (code/game/objects/structures/crates_lockers/closets/secure/engineering.dm:33)
rt.def("/obj/structure/closet/secure_closet/engineering_electrical/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(11));
	return f.dot;
});

// /obj/structure/closet/secure_closet/engineering_electrical/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/secure/engineering.dm:38)  may sleep
rt.def("/obj/structure/closet/secure_closet/engineering_electrical/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/clothing/gloves/color/yellow"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/gloves/color/yellow"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/inducer"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/inducer"), [live(f.src)]);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/storage/toolbox/electrical"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/electronics/apc"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/device/multitool"), [live(f.src)]);
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

// /obj/structure/closet/secure_closet/engineering_welding/proc/<init>  (code/game/objects/structures/crates_lockers/closets/secure/engineering.dm:52)
rt.def("/obj/structure/closet/secure_closet/engineering_welding/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(11));
	return f.dot;
});

// /obj/structure/closet/secure_closet/engineering_welding/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/secure/engineering.dm:57)  may sleep
rt.def("/obj/structure/closet/secure_closet/engineering_welding/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/head/welding"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/weldingtool"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(12362, "/obj/structure/closet/secure_closet/engineering_personal", "/obj/structure/closet/secure_closet", {
	name: "engineer's locker",
	req_access: null,
	icon_state: "eng_secure",
});

// /obj/structure/closet/secure_closet/engineering_personal/proc/<init>  (code/game/objects/structures/crates_lockers/closets/secure/engineering.dm:65)
rt.def("/obj/structure/closet/secure_closet/engineering_personal/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(11));
	return f.dot;
});

// /obj/structure/closet/secure_closet/engineering_personal/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/secure/engineering.dm:69)  may sleep
rt.def("/obj/structure/closet/secure_closet/engineering_personal/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/device/radio/headset/headset_eng"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/toolbox/mechanical"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/tank/internals/emergency_oxygen/engi"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/holosign_creator/engineering"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/mask/gas"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/glasses/meson/engine"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/box/emptysandbags"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(12363, "/obj/structure/closet/secure_closet/atmospherics", "/obj/structure/closet/secure_closet", {
	name: "０atmospheric technician's locker",
	req_access: null,
	icon_state: "atmos",
});

// /obj/structure/closet/secure_closet/atmospherics/proc/<init>  (code/game/objects/structures/crates_lockers/closets/secure/engineering.dm:81)
rt.def("/obj/structure/closet/secure_closet/atmospherics/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(24));
	return f.dot;
});

// /obj/structure/closet/secure_closet/atmospherics/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/secure/engineering.dm:85)  may sleep
rt.def("/obj/structure/closet/secure_closet/atmospherics/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/device/radio/headset/headset_eng"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/pipe_dispenser"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/toolbox/mechanical"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/tank/internals/emergency_oxygen/engi"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/analyzer"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/holosign_creator/atmos"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/watertank/atmos"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/fire/atmos"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/head/hardhat/atmos"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/glasses/meson/engine/tray"), [live(f.src)]);
	return f.dot;
}, true);
