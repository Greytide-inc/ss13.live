// Based on /tg/station's code/game/objects/structures/crates_lockers/closets/wardrobe.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12313, "/obj/structure/closet/wardrobe", "/obj/structure/closet", {
	icon_door: "blue",
	name: "wardrobe",
	desc: "It's a storage unit for standard-issue Nanotrasen attire.",
});

// wardrobe.dm:7
rt.def("/obj/structure/closet/wardrobe/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	yield* parent_proc();
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/under/color/blue"), this);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/shoes/sneakers/brown"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(12328, "/obj/structure/closet/wardrobe/pink", "/obj/structure/closet/wardrobe", {
	icon_door: "pink",
	name: "pink wardrobe",
});

// wardrobe.dm:19
rt.def("/obj/structure/closet/wardrobe/pink/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/under/color/pink"), this);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/shoes/sneakers/brown"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(12329, "/obj/structure/closet/wardrobe/black", "/obj/structure/closet/wardrobe", {
	icon_door: "black",
	name: "black wardrobe",
});

// wardrobe.dm:30
rt.def("/obj/structure/closet/wardrobe/black/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/under/color/black"), this);
	}
	rt.endFor(f, 0);
	if (prob(25)) {
		yield* new_(T("/obj/item/clothing/suit/jacket/leather"), this);
	}
	if (prob(20)) {
		yield* new_(T("/obj/item/clothing/suit/jacket/leather/overcoat"), this);
	}
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/shoes/sneakers/black"), this);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/head/that"), this);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/head/soft/black"), this);
	}
	rt.endFor(f, 0);
	yield* new_(T("/obj/item/clothing/mask/bandana/black"), this);
	yield* new_(T("/obj/item/clothing/mask/bandana/black"), this);
	if (prob(40)) {
		yield* new_(T("/obj/item/clothing/mask/bandana/skull"), this);
	}
	return f.dot;
}, true);

rt.type(12330, "/obj/structure/closet/wardrobe/green", "/obj/structure/closet/wardrobe", {
	icon_door: "green",
	name: "green wardrobe",
});

// wardrobe.dm:54
rt.def("/obj/structure/closet/wardrobe/green/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/under/color/green"), this);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/shoes/sneakers/black"), this);
	}
	rt.endFor(f, 0);
	yield* new_(T("/obj/item/clothing/mask/bandana/green"), this);
	yield* new_(T("/obj/item/clothing/mask/bandana/green"), this);
	return f.dot;
}, true);

rt.type(12331, "/obj/structure/closet/wardrobe/orange", "/obj/structure/closet/wardrobe", {
	icon_door: "orange",
	name: "prison wardrobe",
	desc: "It's a storage unit for Nanotrasen-regulation prisoner attire.",
});

// wardrobe.dm:69
rt.def("/obj/structure/closet/wardrobe/orange/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/under/rank/prisoner"), this);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/shoes/sneakers/orange"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(12332, "/obj/structure/closet/wardrobe/yellow", "/obj/structure/closet/wardrobe", {
	icon_door: "yellow",
	name: "yellow wardrobe",
});

// wardrobe.dm:81
rt.def("/obj/structure/closet/wardrobe/yellow/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/under/color/yellow"), this);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/shoes/sneakers/orange"), this);
	}
	rt.endFor(f, 0);
	yield* new_(T("/obj/item/clothing/mask/bandana/gold"), this);
	yield* new_(T("/obj/item/clothing/mask/bandana/gold"), this);
	return f.dot;
}, true);

rt.type(12319, "/obj/structure/closet/wardrobe/white", "/obj/structure/closet/wardrobe", {
	icon_door: "white",
	name: "white wardrobe",
});

// wardrobe.dm:95
rt.def("/obj/structure/closet/wardrobe/white/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/under/color/white"), this);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/shoes/sneakers/white"), this);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/head/soft/mime"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(12333, "/obj/structure/closet/wardrobe/pjs", "/obj/structure/closet/wardrobe", {
	icon_door: "white",
	name: "pajama wardrobe",
});

// wardrobe.dm:108
rt.def("/obj/structure/closet/wardrobe/pjs/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	yield* new_(T("/obj/item/clothing/under/pj/red"), this);
	yield* new_(T("/obj/item/clothing/under/pj/red"), this);
	yield* new_(T("/obj/item/clothing/under/pj/blue"), this);
	yield* new_(T("/obj/item/clothing/under/pj/blue"), this);
	rt.forRange(f, 0, 1, 4, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/shoes/sneakers/white"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(12334, "/obj/structure/closet/wardrobe/grey", "/obj/structure/closet/wardrobe", {
	icon_door: "grey",
	name: "grey wardrobe",
});

// wardrobe.dm:122
rt.def("/obj/structure/closet/wardrobe/grey/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/under/color/grey"), this);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/shoes/sneakers/black"), this);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/head/soft/grey"), this);
	}
	rt.endFor(f, 0);
	if (prob(50)) {
		yield* new_(T("/obj/item/weapon/storage/backpack/duffelbag"), this);
	}
	if (prob(40)) {
		yield* new_(T("/obj/item/clothing/mask/bandana/black"), this);
		yield* new_(T("/obj/item/clothing/mask/bandana/black"), this);
	}
	if (prob(40)) {
		yield* new_(T("/obj/item/clothing/under/assistantformal"), this);
	}
	if (prob(40)) {
		yield* new_(T("/obj/item/clothing/under/assistantformal"), this);
	}
	if (prob(30)) {
		yield* new_(T("/obj/item/clothing/suit/hooded/wintercoat"), this);
		yield* new_(T("/obj/item/clothing/shoes/winterboots"), this);
	}
	if (prob(30)) {
		yield* new_(T("/obj/item/clothing/accessory/pocketprotector"), this);
	}
	return f.dot;
}, true);

rt.type(12335, "/obj/structure/closet/wardrobe/mixed", "/obj/structure/closet/wardrobe", {
	icon_door: "mixed",
	name: "mixed wardrobe",
});

// wardrobe.dm:150
rt.def("/obj/structure/closet/wardrobe/mixed/proc/PopulateContents", function* PopulateContents(f: Frame) {
	if (prob(40)) {
		yield* new_(T("/obj/item/clothing/suit/jacket"), this);
	}
	if (prob(40)) {
		yield* new_(T("/obj/item/clothing/suit/jacket"), this);
	}
	yield* new_(T("/obj/item/clothing/under/color/white"), this);
	yield* new_(T("/obj/item/clothing/under/color/blue"), this);
	yield* new_(T("/obj/item/clothing/under/color/yellow"), this);
	yield* new_(T("/obj/item/clothing/under/color/green"), this);
	yield* new_(T("/obj/item/clothing/under/color/orange"), this);
	yield* new_(T("/obj/item/clothing/under/color/pink"), this);
	yield* new_(T("/obj/item/clothing/under/color/red"), this);
	yield* new_(T("/obj/item/clothing/under/color/darkblue"), this);
	yield* new_(T("/obj/item/clothing/under/color/teal"), this);
	yield* new_(T("/obj/item/clothing/under/color/lightpurple"), this);
	yield* new_(T("/obj/item/clothing/under/color/green"), this);
	yield* new_(T("/obj/item/clothing/mask/bandana/red"), this);
	yield* new_(T("/obj/item/clothing/mask/bandana/red"), this);
	yield* new_(T("/obj/item/clothing/mask/bandana/blue"), this);
	yield* new_(T("/obj/item/clothing/mask/bandana/blue"), this);
	yield* new_(T("/obj/item/clothing/mask/bandana/gold"), this);
	yield* new_(T("/obj/item/clothing/mask/bandana/gold"), this);
	yield* new_(T("/obj/item/clothing/shoes/sneakers/black"), this);
	yield* new_(T("/obj/item/clothing/shoes/sneakers/brown"), this);
	yield* new_(T("/obj/item/clothing/shoes/sneakers/white"), this);
	if (prob(30)) {
		yield* new_(T("/obj/item/clothing/suit/hooded/wintercoat"), this);
		yield* new_(T("/obj/item/clothing/shoes/winterboots"), this);
	}
	return f.dot;
}, true);
