// Based on /tg/station's code/game/objects/structures/crates_lockers/closets/secure/scientist.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12387, "/obj/structure/closet/secure_closet/RD", "/obj/structure/closet/secure_closet", {
	name: "０research director's locker",
	req_access: null,
	icon_state: "rd",
});

// scientist.dm:3
rt.def("/obj/structure/closet/secure_closet/RD/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(30);
	return f.dot;
});

// scientist.dm:7
rt.def("/obj/structure/closet/secure_closet/RD/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/item/clothing/neck/cloak/rd"), this);
	yield* new_(T("/obj/item/clothing/suit/bio_suit/scientist"), this);
	yield* new_(T("/obj/item/clothing/head/bio_hood/scientist"), this);
	yield* new_(T("/obj/item/clothing/suit/toggle/labcoat"), this);
	yield* new_(T("/obj/item/clothing/under/rank/research_director"), this);
	yield* new_(T("/obj/item/clothing/under/rank/research_director/alt"), this);
	yield* new_(T("/obj/item/clothing/under/rank/research_director/turtleneck"), this);
	yield* new_(T("/obj/item/clothing/shoes/sneakers/brown"), this);
	yield* new_(T("/obj/item/weapon/cartridge/rd"), this);
	yield* new_(T("/obj/item/clothing/gloves/color/latex"), this);
	yield* new_(T("/obj/item/device/radio/headset/heads/rd"), this);
	yield* new_(T("/obj/item/weapon/tank/internals/air"), this);
	yield* new_(T("/obj/item/clothing/mask/gas"), this);
	yield* new_(T("/obj/item/device/megaphone/command"), this);
	yield* new_(T("/obj/item/weapon/storage/lockbox/medal/sci"), this);
	yield* new_(T("/obj/item/clothing/suit/armor/reactive/teleport"), this);
	yield* new_(T("/obj/item/device/assembly/flash/handheld"), this);
	yield* new_(T("/obj/item/device/laser_pointer"), this);
	yield* new_(T("/obj/item/weapon/door_remote/research_director"), this);
	yield* new_(T("/obj/item/weapon/storage/box/firingpins"), this);
	return f.dot;
}, true);
