// From code/game/objects/structures/crates_lockers/closets/secure/scientist.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12387, "/obj/structure/closet/secure_closet/RD", "/obj/structure/closet/secure_closet", {
	name: "０research director's locker",
	req_access: null,
	icon_state: "rd",
});

// /obj/structure/closet/secure_closet/RD/proc/<init>  (code/game/objects/structures/crates_lockers/closets/secure/scientist.dm:3)
rt.def("/obj/structure/closet/secure_closet/RD/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(30));
	return f.dot;
});

// /obj/structure/closet/secure_closet/RD/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/secure/scientist.dm:7)  may sleep
rt.def("/obj/structure/closet/secure_closet/RD/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/clothing/neck/cloak/rd"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/bio_suit/scientist"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/head/bio_hood/scientist"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/toggle/labcoat"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/rank/research_director"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/rank/research_director/alt"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/rank/research_director/turtleneck"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/shoes/sneakers/brown"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/cartridge/rd"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/gloves/color/latex"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/radio/headset/heads/rd"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/tank/internals/air"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/mask/gas"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/megaphone/command"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/lockbox/medal/sci"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/armor/reactive/teleport"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/assembly/flash/handheld"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/laser_pointer"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/door_remote/research_director"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/box/firingpins"), [live(f.src)]);
	return f.dot;
}, true);
