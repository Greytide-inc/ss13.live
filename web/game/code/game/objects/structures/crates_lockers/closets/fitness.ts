// From code/game/objects/structures/crates_lockers/closets/fitness.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12293, "/obj/structure/closet/athletic_mixed", "/obj/structure/closet", {
	icon_door: "mixed",
	name: "athletic wardrobe",
	desc: "It's a storage unit for athletic wear.",
});

// /obj/structure/closet/athletic_mixed/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/fitness.dm:7)  may sleep
rt.def("/obj/structure/closet/athletic_mixed/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/clothing/under/shorts/purple"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/shorts/grey"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/shorts/black"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/shorts/red"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/shorts/blue"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/shorts/green"), [live(f.src)]);
	if (!truthy(rt.op(f, "Prob", [], [3]))) return f.dot;
	yield* g.new_(f, T("/obj/item/clothing/under/jabroni"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(12294, "/obj/structure/closet/boxinggloves", "/obj/structure/closet", {
	name: "boxing gloves",
	desc: "It's a storage unit for gloves for use in the boxing ring.",
});

// /obj/structure/closet/boxinggloves/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/fitness.dm:23)  may sleep
rt.def("/obj/structure/closet/boxinggloves/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/clothing/gloves/boxing/blue"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/gloves/boxing/green"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/gloves/boxing/yellow"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/gloves/boxing"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(12295, "/obj/structure/closet/masks", "/obj/structure/closet", {
	name: "mask closet",
	desc: "IT'S A STORAGE UNIT FOR FIGHTER MASKS OLE!",
});

// /obj/structure/closet/masks/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/fitness.dm:35)  may sleep
rt.def("/obj/structure/closet/masks/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/clothing/mask/luchador"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/mask/luchador/rudos"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/mask/luchador/tecnicos"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(12297, "/obj/structure/closet/lasertag/red", "/obj/structure/closet/lasertag", {
	icon_door: "red",
	name: "red laser tag equipment",
	desc: "It's a storage unit for laser tag equipment.",
});

// /obj/structure/closet/lasertag/red/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/fitness.dm:47)  may sleep
rt.def("/obj/structure/closet/lasertag/red/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/gun/energy/laser/redtag"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/suit/redtag"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	yield* g.new_(f, T("/obj/item/clothing/head/helmet/redtaghelm"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(12298, "/obj/structure/closet/lasertag/blue", "/obj/structure/closet/lasertag", {
	icon_door: "blue",
	name: "blue laser tag equipment",
	desc: "It's a storage unit for laser tag equipment.",
});

// /obj/structure/closet/lasertag/blue/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/fitness.dm:61)  may sleep
rt.def("/obj/structure/closet/lasertag/blue/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/gun/energy/laser/bluetag"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/suit/bluetag"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	yield* g.new_(f, T("/obj/item/clothing/head/helmet/bluetaghelm"), [live(f.src)]);
	return f.dot;
}, true);
