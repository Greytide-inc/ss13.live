// From code/game/objects/structures/crates_lockers/closets/wardrobe.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12313, "/obj/structure/closet/wardrobe", "/obj/structure/closet", {
	icon_door: "blue",
	name: "wardrobe",
	desc: "It's a storage unit for standard-issue Nanotrasen attire.",
});

// /obj/structure/closet/wardrobe/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/wardrobe.dm:7)  may sleep
rt.def("/obj/structure/closet/wardrobe/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/under/color/blue"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/shoes/sneakers/brown"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return live(f.dot);
}, true);

rt.type(12328, "/obj/structure/closet/wardrobe/pink", "/obj/structure/closet/wardrobe", {
	icon_door: "pink",
	name: "pink wardrobe",
});

// /obj/structure/closet/wardrobe/pink/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/wardrobe.dm:19)  may sleep
rt.def("/obj/structure/closet/wardrobe/pink/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/under/color/pink"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/shoes/sneakers/brown"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return live(f.dot);
}, true);

rt.type(12329, "/obj/structure/closet/wardrobe/black", "/obj/structure/closet/wardrobe", {
	icon_door: "black",
	name: "black wardrobe",
});

// /obj/structure/closet/wardrobe/black/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/wardrobe.dm:30)  may sleep
rt.def("/obj/structure/closet/wardrobe/black/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/under/color/black"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	if (truthy(rt.op(f, "Prob", [], [25]))) {
		yield* g.new_(f, T("/obj/item/clothing/suit/jacket/leather"), [live(f.src)]);
	}
	if (truthy(rt.op(f, "Prob", [], [20]))) {
		yield* g.new_(f, T("/obj/item/clothing/suit/jacket/leather/overcoat"), [live(f.src)]);
	}
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/shoes/sneakers/black"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/head/that"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/head/soft/black"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	yield* g.new_(f, T("/obj/item/clothing/mask/bandana/black"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/mask/bandana/black"), [live(f.src)]);
	if (truthy(rt.op(f, "Prob", [], [40]))) {
		yield* g.new_(f, T("/obj/item/clothing/mask/bandana/skull"), [live(f.src)]);
	}
	return live(f.dot);
}, true);

rt.type(12330, "/obj/structure/closet/wardrobe/green", "/obj/structure/closet/wardrobe", {
	icon_door: "green",
	name: "green wardrobe",
});

// /obj/structure/closet/wardrobe/green/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/wardrobe.dm:54)  may sleep
rt.def("/obj/structure/closet/wardrobe/green/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/under/color/green"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/shoes/sneakers/black"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	yield* g.new_(f, T("/obj/item/clothing/mask/bandana/green"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/mask/bandana/green"), [live(f.src)]);
	return live(f.dot);
}, true);

rt.type(12331, "/obj/structure/closet/wardrobe/orange", "/obj/structure/closet/wardrobe", {
	icon_door: "orange",
	name: "prison wardrobe",
	desc: "It's a storage unit for Nanotrasen-regulation prisoner attire.",
});

// /obj/structure/closet/wardrobe/orange/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/wardrobe.dm:69)  may sleep
rt.def("/obj/structure/closet/wardrobe/orange/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/under/rank/prisoner"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/shoes/sneakers/orange"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return live(f.dot);
}, true);

rt.type(12332, "/obj/structure/closet/wardrobe/yellow", "/obj/structure/closet/wardrobe", {
	icon_door: "yellow",
	name: "yellow wardrobe",
});

// /obj/structure/closet/wardrobe/yellow/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/wardrobe.dm:81)  may sleep
rt.def("/obj/structure/closet/wardrobe/yellow/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/under/color/yellow"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/shoes/sneakers/orange"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	yield* g.new_(f, T("/obj/item/clothing/mask/bandana/gold"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/mask/bandana/gold"), [live(f.src)]);
	return live(f.dot);
}, true);

rt.type(12319, "/obj/structure/closet/wardrobe/white", "/obj/structure/closet/wardrobe", {
	icon_door: "white",
	name: "white wardrobe",
});

// /obj/structure/closet/wardrobe/white/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/wardrobe.dm:95)  may sleep
rt.def("/obj/structure/closet/wardrobe/white/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/under/color/white"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/shoes/sneakers/white"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/head/soft/mime"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return live(f.dot);
}, true);

rt.type(12333, "/obj/structure/closet/wardrobe/pjs", "/obj/structure/closet/wardrobe", {
	icon_door: "white",
	name: "pajama wardrobe",
});

// /obj/structure/closet/wardrobe/pjs/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/wardrobe.dm:108)  may sleep
rt.def("/obj/structure/closet/wardrobe/pjs/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	yield* g.new_(f, T("/obj/item/clothing/under/pj/red"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/pj/red"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/pj/blue"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/pj/blue"), [live(f.src)]);
	i = null;
	rt.forRange(f, 0, 1, 4, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/shoes/sneakers/white"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return live(f.dot);
}, true);

rt.type(12334, "/obj/structure/closet/wardrobe/grey", "/obj/structure/closet/wardrobe", {
	icon_door: "grey",
	name: "grey wardrobe",
});

// /obj/structure/closet/wardrobe/grey/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/wardrobe.dm:122)  may sleep
rt.def("/obj/structure/closet/wardrobe/grey/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/under/color/grey"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/shoes/sneakers/black"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/head/soft/grey"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	if (truthy(rt.op(f, "Prob", [], [50]))) {
		yield* g.new_(f, T("/obj/item/weapon/storage/backpack/duffelbag"), [live(f.src)]);
	}
	if (truthy(rt.op(f, "Prob", [], [40]))) {
		yield* g.new_(f, T("/obj/item/clothing/mask/bandana/black"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/clothing/mask/bandana/black"), [live(f.src)]);
	}
	if (truthy(rt.op(f, "Prob", [], [40]))) {
		yield* g.new_(f, T("/obj/item/clothing/under/assistantformal"), [live(f.src)]);
	}
	if (truthy(rt.op(f, "Prob", [], [40]))) {
		yield* g.new_(f, T("/obj/item/clothing/under/assistantformal"), [live(f.src)]);
	}
	if (truthy(rt.op(f, "Prob", [], [30]))) {
		yield* g.new_(f, T("/obj/item/clothing/suit/hooded/wintercoat"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/clothing/shoes/winterboots"), [live(f.src)]);
	}
	if (truthy(rt.op(f, "Prob", [], [30]))) {
		yield* g.new_(f, T("/obj/item/clothing/accessory/pocketprotector"), [live(f.src)]);
	}
	return live(f.dot);
}, true);

rt.type(12335, "/obj/structure/closet/wardrobe/mixed", "/obj/structure/closet/wardrobe", {
	icon_door: "mixed",
	name: "mixed wardrobe",
});

// /obj/structure/closet/wardrobe/mixed/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/wardrobe.dm:150)  may sleep
rt.def("/obj/structure/closet/wardrobe/mixed/proc/PopulateContents", function* PopulateContents(f: Frame) {
	if (truthy(rt.op(f, "Prob", [], [40]))) {
		yield* g.new_(f, T("/obj/item/clothing/suit/jacket"), [live(f.src)]);
	}
	if (truthy(rt.op(f, "Prob", [], [40]))) {
		yield* g.new_(f, T("/obj/item/clothing/suit/jacket"), [live(f.src)]);
	}
	yield* g.new_(f, T("/obj/item/clothing/under/color/white"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/color/blue"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/color/yellow"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/color/green"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/color/orange"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/color/pink"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/color/red"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/color/darkblue"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/color/teal"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/color/lightpurple"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/color/green"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/mask/bandana/red"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/mask/bandana/red"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/mask/bandana/blue"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/mask/bandana/blue"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/mask/bandana/gold"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/mask/bandana/gold"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/shoes/sneakers/black"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/shoes/sneakers/brown"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/shoes/sneakers/white"), [live(f.src)]);
	if (truthy(rt.op(f, "Prob", [], [30]))) {
		yield* g.new_(f, T("/obj/item/clothing/suit/hooded/wintercoat"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/clothing/shoes/winterboots"), [live(f.src)]);
	}
	return live(f.dot);
}, true);
