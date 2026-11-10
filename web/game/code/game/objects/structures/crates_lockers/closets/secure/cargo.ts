// Based on /tg/station's code/game/objects/structures/crates_lockers/closets/secure/cargo.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12358, "/obj/structure/closet/secure_closet/quartermaster", "/obj/structure/closet/secure_closet", {
	name: "０quartermaster's locker",
	req_access: null,
	icon_state: "qm",
});

// cargo.dm:3
rt.def("/obj/structure/closet/secure_closet/quartermaster/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(41);
	return f.dot;
});

// cargo.dm:7
rt.def("/obj/structure/closet/secure_closet/quartermaster/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/item/clothing/neck/cloak/qm"), this);
	yield* new_(T("/obj/item/clothing/under/rank/cargo"), this);
	yield* new_(T("/obj/item/clothing/shoes/sneakers/brown"), this);
	yield* new_(T("/obj/item/device/radio/headset/headset_cargo"), this);
	yield* new_(T("/obj/item/clothing/suit/fire/firefighter"), this);
	yield* new_(T("/obj/item/clothing/gloves/fingerless"), this);
	yield* new_(T("/obj/item/device/megaphone/cargo"), this);
	yield* new_(T("/obj/item/weapon/tank/internals/emergency_oxygen"), this);
	yield* new_(T("/obj/item/clothing/mask/gas"), this);
	yield* new_(T("/obj/item/clothing/head/soft"), this);
	yield* new_(T("/obj/item/device/export_scanner"), this);
	yield* new_(T("/obj/item/weapon/door_remote/quartermaster"), this);
	return f.dot;
}, true);
