// From code/game/objects/structures/crates_lockers/closets/gimmick.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12302, "/obj/structure/closet/gimmick/russian", "/obj/structure/closet/gimmick", {
	name: "russian surplus closet",
	desc: "It's a storage unit for Russian standard-issue surplus.",
});

// /obj/structure/closet/gimmick/russian/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/gimmick.dm:25)  may sleep
rt.def("/obj/structure/closet/gimmick/russian/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	i = null;
	rt.forRange(f, 0, 1, 5, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/head/ushanka"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 5, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/under/soviet"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(12303, "/obj/structure/closet/gimmick/tacticool", "/obj/structure/closet/gimmick", {
	name: "tacticool gear closet",
	desc: "It's a storage unit for Tacticool gear.",
});

// /obj/structure/closet/gimmick/tacticool/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/gimmick.dm:36)  may sleep
rt.def("/obj/structure/closet/gimmick/tacticool/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/clothing/glasses/eyepatch"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/glasses/sunglasses"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/gloves/combat"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/gloves/combat"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/head/helmet/swat"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/head/helmet/swat"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/mask/gas/sechailer/swat"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/mask/gas/sechailer/swat"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/shoes/combat/swat"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/shoes/combat/swat"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/space/hardsuit/deathsquad"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/space/hardsuit/deathsquad"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/syndicate/tacticool"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/syndicate/tacticool"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(12305, "/obj/structure/closet/thunderdome/tdred", "/obj/structure/closet/thunderdome", {
	icon_door: "red",
	name: "red-team Thunderdome closet",
});

// /obj/structure/closet/thunderdome/tdred/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/gimmick.dm:63)  may sleep
rt.def("/obj/structure/closet/thunderdome/tdred/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/suit/armor/tdome/red"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/melee/energy/sword/saber"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/gun/energy/laser"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/melee/baton/loaded"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/storage/box/flashbangs"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/head/helmet/thunderdome"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(12306, "/obj/structure/closet/thunderdome/tdgreen", "/obj/structure/closet/thunderdome", {
	icon_door: "green",
	name: "green-team Thunderdome closet",
});

// /obj/structure/closet/thunderdome/tdgreen/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/gimmick.dm:82)  may sleep
rt.def("/obj/structure/closet/thunderdome/tdgreen/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/suit/armor/tdome/green"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/melee/energy/sword/saber"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/gun/energy/laser"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/melee/baton/loaded"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/storage/box/flashbangs"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/head/helmet/thunderdome"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(12308, "/obj/structure/closet/malf/suits", "/obj/structure/closet/malf", {
	desc: "It's a storage unit for operational gear.",
	icon_state: "syndicate",
});

// /obj/structure/closet/malf/suits/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/gimmick.dm:101)  may sleep
rt.def("/obj/structure/closet/malf/suits/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/weapon/tank/jetpack/void"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/mask/breath"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/head/helmet/space/nasavoid"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/space/nasavoid"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/crowbar"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/stock_parts/cell"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/multitool"), [live(f.src)]);
	return f.dot;
}, true);
