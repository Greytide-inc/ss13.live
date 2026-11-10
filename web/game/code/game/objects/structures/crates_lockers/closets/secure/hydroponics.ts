// Based on /tg/station's code/game/objects/structures/crates_lockers/closets/secure/hydroponics.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12373, "/obj/structure/closet/secure_closet/hydroponics", "/obj/structure/closet/secure_closet", {
	name: "botanist's locker",
	req_access: null,
	icon_state: "hydro",
});

// hydroponics.dm:3
rt.def("/obj/structure/closet/secure_closet/hydroponics/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(35);
	return f.dot;
});

// hydroponics.dm:7
rt.def("/obj/structure/closet/secure_closet/hydroponics/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/item/weapon/storage/bag/plants/portaseeder"), this);
	yield* new_(T("/obj/item/device/plant_analyzer"), this);
	yield* new_(T("/obj/item/device/radio/headset/headset_srv"), this);
	yield* new_(T("/obj/item/weapon/cultivator"), this);
	yield* new_(T("/obj/item/weapon/hatchet"), this);
	yield* new_(T("/obj/item/weapon/storage/box/disks_plantgene"), this);
	return f.dot;
}, true);
