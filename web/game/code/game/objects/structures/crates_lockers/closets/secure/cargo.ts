// From code/game/objects/structures/crates_lockers/closets/secure/cargo.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12358, "/obj/structure/closet/secure_closet/quartermaster", "/obj/structure/closet/secure_closet", {
	name: "０quartermaster's locker",
	req_access: null,
	icon_state: "qm",
});

// /obj/structure/closet/secure_closet/quartermaster/proc/<init>  (code/game/objects/structures/crates_lockers/closets/secure/cargo.dm:3)
rt.def("/obj/structure/closet/secure_closet/quartermaster/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(41));
	return f.dot;
});

// /obj/structure/closet/secure_closet/quartermaster/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/secure/cargo.dm:7)  may sleep
rt.def("/obj/structure/closet/secure_closet/quartermaster/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/clothing/neck/cloak/qm"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/rank/cargo"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/shoes/sneakers/brown"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/radio/headset/headset_cargo"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/fire/firefighter"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/gloves/fingerless"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/megaphone/cargo"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/tank/internals/emergency_oxygen"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/mask/gas"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/head/soft"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/export_scanner"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/door_remote/quartermaster"), [live(f.src)]);
	return f.dot;
}, true);
