// Based on /tg/station's code/game/objects/structures/crates_lockers/closets/l3closet.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12338, "/obj/structure/closet/l3closet", "/obj/structure/closet", {
	name: "level-3 biohazard gear closet",
	desc: "It's a storage unit for level-3 biohazard gear.",
	icon_state: "bio",
});

// l3closet.dm:7
rt.def("/obj/structure/closet/l3closet/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/item/weapon/storage/bag/bio"), this);
	yield* new_(T("/obj/item/clothing/suit/bio_suit/general"), this);
	yield* new_(T("/obj/item/clothing/head/bio_hood/general"), this);
	return f.dot;
}, true);

rt.type(12339, "/obj/structure/closet/l3closet/virology", "/obj/structure/closet/l3closet", {
	icon_state: "bio_viro",
});

// l3closet.dm:17
rt.def("/obj/structure/closet/l3closet/virology/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/weapon/storage/bag/bio"), this);
	yield* new_(T("/obj/item/clothing/suit/bio_suit/virology"), this);
	yield* new_(T("/obj/item/clothing/head/bio_hood/virology"), this);
	return f.dot;
}, true);

rt.type(12340, "/obj/structure/closet/l3closet/security", "/obj/structure/closet/l3closet", {
	icon_state: "bio_sec",
});

// l3closet.dm:26
rt.def("/obj/structure/closet/l3closet/security/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/clothing/suit/bio_suit/security"), this);
	yield* new_(T("/obj/item/clothing/head/bio_hood/security"), this);
	return f.dot;
}, true);

rt.type(12341, "/obj/structure/closet/l3closet/janitor", "/obj/structure/closet/l3closet", {
	icon_state: "bio_jan",
});

// l3closet.dm:34
rt.def("/obj/structure/closet/l3closet/janitor/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/clothing/suit/bio_suit/janitor"), this);
	yield* new_(T("/obj/item/clothing/head/bio_hood/janitor"), this);
	return f.dot;
}, true);

rt.type(12342, "/obj/structure/closet/l3closet/scientist", "/obj/structure/closet/l3closet", {
	icon_state: "bio_viro",
});

// l3closet.dm:42
rt.def("/obj/structure/closet/l3closet/scientist/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/weapon/storage/bag/bio"), this);
	yield* new_(T("/obj/item/clothing/suit/bio_suit/scientist"), this);
	yield* new_(T("/obj/item/clothing/head/bio_hood/scientist"), this);
	return f.dot;
}, true);
