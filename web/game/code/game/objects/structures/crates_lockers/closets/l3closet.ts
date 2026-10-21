// From code/game/objects/structures/crates_lockers/closets/l3closet.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12338, "/obj/structure/closet/l3closet", "/obj/structure/closet", {
	name: "level-3 biohazard gear closet",
	desc: "It's a storage unit for level-3 biohazard gear.",
	icon_state: "bio",
});

// /obj/structure/closet/l3closet/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/l3closet.dm:7)  may sleep
rt.def("/obj/structure/closet/l3closet/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/weapon/storage/bag/bio"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/bio_suit/general"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/head/bio_hood/general"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(12339, "/obj/structure/closet/l3closet/virology", "/obj/structure/closet/l3closet", {
	icon_state: "bio_viro",
});

// /obj/structure/closet/l3closet/virology/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/l3closet.dm:17)  may sleep
rt.def("/obj/structure/closet/l3closet/virology/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/weapon/storage/bag/bio"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/bio_suit/virology"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/head/bio_hood/virology"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(12340, "/obj/structure/closet/l3closet/security", "/obj/structure/closet/l3closet", {
	icon_state: "bio_sec",
});

// /obj/structure/closet/l3closet/security/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/l3closet.dm:26)  may sleep
rt.def("/obj/structure/closet/l3closet/security/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/clothing/suit/bio_suit/security"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/head/bio_hood/security"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(12341, "/obj/structure/closet/l3closet/janitor", "/obj/structure/closet/l3closet", {
	icon_state: "bio_jan",
});

// /obj/structure/closet/l3closet/janitor/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/l3closet.dm:34)  may sleep
rt.def("/obj/structure/closet/l3closet/janitor/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/clothing/suit/bio_suit/janitor"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/head/bio_hood/janitor"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(12342, "/obj/structure/closet/l3closet/scientist", "/obj/structure/closet/l3closet", {
	icon_state: "bio_viro",
});

// /obj/structure/closet/l3closet/scientist/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/l3closet.dm:42)  may sleep
rt.def("/obj/structure/closet/l3closet/scientist/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/weapon/storage/bag/bio"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/bio_suit/scientist"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/head/bio_hood/scientist"), [live(f.src)]);
	return f.dot;
}, true);
