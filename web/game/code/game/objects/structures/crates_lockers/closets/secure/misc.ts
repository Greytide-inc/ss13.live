// From code/game/objects/structures/crates_lockers/closets/secure/misc.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12380, "/obj/structure/closet/secure_closet/ertCom", "/obj/structure/closet/secure_closet", {
	name: "commander's closet",
	desc: "Emergency Response Team equipment locker.",
	req_access: null,
	icon_state: "cap",
});

// /obj/structure/closet/secure_closet/ertCom/proc/<init>  (code/game/objects/structures/crates_lockers/closets/secure/misc.dm:4)
rt.def("/obj/structure/closet/secure_closet/ertCom/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(109));
	return f.dot;
});

// /obj/structure/closet/secure_closet/ertCom/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/secure/misc.dm:8)  may sleep
rt.def("/obj/structure/closet/secure_closet/ertCom/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/weapon/storage/firstaid/regular"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/box/handcuffs"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/aicard"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/assembly/flash/handheld"), [live(f.src)]);
	if (truthy(rt.op(f, "Prob", [], [50]))) {
		yield* g.new_(f, T("/obj/item/ammo_box/magazine/m50"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/ammo_box/magazine/m50"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/gun/ballistic/automatic/pistol/deagle"), [live(f.src)]);
	} else {
		yield* g.new_(f, T("/obj/item/ammo_box/a357"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/ammo_box/a357"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/gun/ballistic/revolver/mateba"), [live(f.src)]);
	}
	return f.dot;
}, true);

rt.type(12381, "/obj/structure/closet/secure_closet/ertSec", "/obj/structure/closet/secure_closet", {
	name: "security closet",
	desc: "Emergency Response Team equipment locker.",
	req_access: null,
	icon_state: "hos",
});

// /obj/structure/closet/secure_closet/ertSec/proc/<init>  (code/game/objects/structures/crates_lockers/closets/secure/misc.dm:25)
rt.def("/obj/structure/closet/secure_closet/ertSec/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(103));
	return f.dot;
});

// /obj/structure/closet/secure_closet/ertSec/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/secure/misc.dm:29)  may sleep
rt.def("/obj/structure/closet/secure_closet/ertSec/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/weapon/storage/box/flashbangs"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/box/teargas"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/box/flashes"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/box/handcuffs"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/shield/riot/tele"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(12382, "/obj/structure/closet/secure_closet/ertMed", "/obj/structure/closet/secure_closet", {
	name: "medical closet",
	desc: "Emergency Response Team equipment locker.",
	req_access: null,
	icon_state: "cmo",
});

// /obj/structure/closet/secure_closet/ertMed/proc/<init>  (code/game/objects/structures/crates_lockers/closets/secure/misc.dm:39)
rt.def("/obj/structure/closet/secure_closet/ertMed/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(104));
	return f.dot;
});

// /obj/structure/closet/secure_closet/ertMed/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/secure/misc.dm:43)  may sleep
rt.def("/obj/structure/closet/secure_closet/ertMed/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/weapon/storage/firstaid/o2"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/firstaid/toxin"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/firstaid/fire"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/firstaid/brute"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/firstaid/regular"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/defibrillator/compact/combat/loaded"), [live(f.src)]);
	yield* g.new_(f, T("/mob/living/simple_animal/bot/medbot"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(12383, "/obj/structure/closet/secure_closet/ertEngi", "/obj/structure/closet/secure_closet", {
	name: "engineer closet",
	desc: "Emergency Response Team equipment locker.",
	req_access: null,
	icon_state: "ce",
});

// /obj/structure/closet/secure_closet/ertEngi/proc/<init>  (code/game/objects/structures/crates_lockers/closets/secure/misc.dm:55)
rt.def("/obj/structure/closet/secure_closet/ertEngi/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(106));
	return f.dot;
});

// /obj/structure/closet/secure_closet/ertEngi/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/secure/misc.dm:59)  may sleep
rt.def("/obj/structure/closet/secure_closet/ertEngi/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/stack/sheet/plasteel"), [live(f.src), 50]);
	yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [live(f.src), 50]);
	yield* g.new_(f, T("/obj/item/stack/sheet/glass"), [live(f.src), 50]);
	yield* g.new_(f, T("/obj/item/stack/sheet/mineral/sandbags"), [live(f.src), 30]);
	yield* g.new_(f, T("/obj/item/clothing/shoes/magboots"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/box/metalfoam"), [live(f.src)]);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/rcd_ammo/large"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
