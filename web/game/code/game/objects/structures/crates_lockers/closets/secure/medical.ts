// From code/game/objects/structures/crates_lockers/closets/secure/medical.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12374, "/obj/structure/closet/secure_closet/medical1", "/obj/structure/closet/secure_closet", {
	name: "medicine closet",
	desc: "Filled to the brim with medical junk.",
	icon_state: "med",
	req_access: null,
});

// /obj/structure/closet/secure_closet/medical1/proc/<init>  (code/game/objects/structures/crates_lockers/closets/secure/medical.dm:5)
rt.def("/obj/structure/closet/secure_closet/medical1/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(5));
	return f.dot;
});

// /obj/structure/closet/secure_closet/medical1/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/secure/medical.dm:8)  may sleep
rt.def("/obj/structure/closet/secure_closet/medical1/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/beaker"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/beaker"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/dropper"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/dropper"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/belt/medical"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/box/syringes"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/bottle/toxin"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/bottle/morphine"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/bottle/morphine"), [live(f.src)]);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/bottle/epinephrine"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/bottle/charcoal"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	yield* g.new_(f, T("/obj/item/weapon/storage/box/rxglasses"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(12375, "/obj/structure/closet/secure_closet/medical2", "/obj/structure/closet/secure_closet", {
	name: "anesthetic closet",
	desc: "Used to knock people out.",
	req_access: null,
});

// /obj/structure/closet/secure_closet/medical2/proc/<init>  (code/game/objects/structures/crates_lockers/closets/secure/medical.dm:27)
rt.def("/obj/structure/closet/secure_closet/medical2/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(45));
	return f.dot;
});

// /obj/structure/closet/secure_closet/medical2/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/secure/medical.dm:30)  may sleep
rt.def("/obj/structure/closet/secure_closet/medical2/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/tank/internals/anesthetic"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/mask/breath/medical"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(12376, "/obj/structure/closet/secure_closet/medical3", "/obj/structure/closet/secure_closet", {
	name: "medical doctor's locker",
	req_access: null,
	icon_state: "med_secure",
});

// /obj/structure/closet/secure_closet/medical3/proc/<init>  (code/game/objects/structures/crates_lockers/closets/secure/medical.dm:38)
rt.def("/obj/structure/closet/secure_closet/medical3/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(45));
	return f.dot;
});

// /obj/structure/closet/secure_closet/medical3/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/secure/medical.dm:42)  may sleep
rt.def("/obj/structure/closet/secure_closet/medical3/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/device/radio/headset/headset_med"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/defibrillator/loaded"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/gloves/color/latex/nitrile"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/belt/medical"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/glasses/hud/health"), [live(f.src)]);
	return live(f.dot);
}, true);

rt.type(12377, "/obj/structure/closet/secure_closet/CMO", "/obj/structure/closet/secure_closet", {
	name: "０chief medical officer's locker",
	req_access: null,
	icon_state: "cmo",
});

// /obj/structure/closet/secure_closet/CMO/proc/<init>  (code/game/objects/structures/crates_lockers/closets/secure/medical.dm:52)
rt.def("/obj/structure/closet/secure_closet/CMO/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(40));
	return f.dot;
});

// /obj/structure/closet/secure_closet/CMO/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/secure/medical.dm:56)  may sleep
rt.def("/obj/structure/closet/secure_closet/CMO/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/clothing/neck/cloak/cmo"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/backpack/duffelbag/med"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/bio_suit/cmo"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/head/bio_hood/cmo"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/toggle/labcoat/cmo"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/rank/chief_medical_officer"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/shoes/sneakers/brown"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/cartridge/cmo"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/radio/headset/heads/cmo"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/megaphone/command"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/defibrillator/compact/loaded"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/gloves/color/latex/nitrile"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/belt/medical"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/assembly/flash/handheld"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/hypospray/CMO"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/autosurgeon/cmo"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/door_remote/chief_medical_officer"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(12378, "/obj/structure/closet/secure_closet/animal", "/obj/structure/closet/secure_closet", {
	name: "animal control",
	req_access: null,
});

// /obj/structure/closet/secure_closet/animal/proc/<init>  (code/game/objects/structures/crates_lockers/closets/secure/medical.dm:77)
rt.def("/obj/structure/closet/secure_closet/animal/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(45));
	return f.dot;
});

// /obj/structure/closet/secure_closet/animal/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/secure/medical.dm:80)  may sleep
rt.def("/obj/structure/closet/secure_closet/animal/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/device/assembly/signaler"), [live(f.src)]);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/device/electropack"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(12379, "/obj/structure/closet/secure_closet/chemical", "/obj/structure/closet/secure_closet", {
	icon_door: "chemical",
	name: "chemical closet",
	desc: "Store dangerous chemicals in here.",
});

// /obj/structure/closet/secure_closet/chemical/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/secure/medical.dm:91)  may sleep
rt.def("/obj/structure/closet/secure_closet/chemical/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/weapon/storage/box/pillbottles"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/box/pillbottles"), [live(f.src)]);
	return f.dot;
}, true);
