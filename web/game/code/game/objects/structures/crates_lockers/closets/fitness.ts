// Based on /tg/station's code/game/objects/structures/crates_lockers/closets/fitness.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12293, "/obj/structure/closet/athletic_mixed", "/obj/structure/closet", {
	icon_door: "mixed",
	name: "athletic wardrobe",
	desc: "It's a storage unit for athletic wear.",
});

// fitness.dm:7
rt.def("/obj/structure/closet/athletic_mixed/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/item/clothing/under/shorts/purple"), this);
	yield* new_(T("/obj/item/clothing/under/shorts/grey"), this);
	yield* new_(T("/obj/item/clothing/under/shorts/black"), this);
	yield* new_(T("/obj/item/clothing/under/shorts/red"), this);
	yield* new_(T("/obj/item/clothing/under/shorts/blue"), this);
	yield* new_(T("/obj/item/clothing/under/shorts/green"), this);
	if (!prob(3)) return f.dot;
	yield* new_(T("/obj/item/clothing/under/jabroni"), this);
	return f.dot;
}, true);

rt.type(12294, "/obj/structure/closet/boxinggloves", "/obj/structure/closet", {
	name: "boxing gloves",
	desc: "It's a storage unit for gloves for use in the boxing ring.",
});

// fitness.dm:23
rt.def("/obj/structure/closet/boxinggloves/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/item/clothing/gloves/boxing/blue"), this);
	yield* new_(T("/obj/item/clothing/gloves/boxing/green"), this);
	yield* new_(T("/obj/item/clothing/gloves/boxing/yellow"), this);
	yield* new_(T("/obj/item/clothing/gloves/boxing"), this);
	return f.dot;
}, true);

rt.type(12295, "/obj/structure/closet/masks", "/obj/structure/closet", {
	name: "mask closet",
	desc: "IT'S A STORAGE UNIT FOR FIGHTER MASKS OLE!",
});

// fitness.dm:35
rt.def("/obj/structure/closet/masks/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/item/clothing/mask/luchador"), this);
	yield* new_(T("/obj/item/clothing/mask/luchador/rudos"), this);
	yield* new_(T("/obj/item/clothing/mask/luchador/tecnicos"), this);
	return f.dot;
}, true);

rt.type(12297, "/obj/structure/closet/lasertag/red", "/obj/structure/closet/lasertag", {
	icon_door: "red",
	name: "red laser tag equipment",
	desc: "It's a storage unit for laser tag equipment.",
});

// fitness.dm:47
rt.def("/obj/structure/closet/lasertag/red/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	yield* parent_proc();
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/gun/energy/laser/redtag"), this);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/suit/redtag"), this);
	}
	rt.endFor(f, 0);
	yield* new_(T("/obj/item/clothing/head/helmet/redtaghelm"), this);
	return f.dot;
}, true);

rt.type(12298, "/obj/structure/closet/lasertag/blue", "/obj/structure/closet/lasertag", {
	icon_door: "blue",
	name: "blue laser tag equipment",
	desc: "It's a storage unit for laser tag equipment.",
});

// fitness.dm:61
rt.def("/obj/structure/closet/lasertag/blue/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	yield* parent_proc();
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/gun/energy/laser/bluetag"), this);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/suit/bluetag"), this);
	}
	rt.endFor(f, 0);
	yield* new_(T("/obj/item/clothing/head/helmet/bluetaghelm"), this);
	return f.dot;
}, true);
