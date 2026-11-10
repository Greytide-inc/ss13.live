// Based on /tg/station's code/game/objects/structures/crates_lockers/closets/gimmick.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12302, "/obj/structure/closet/gimmick/russian", "/obj/structure/closet/gimmick", {
	name: "russian surplus closet",
	desc: "It's a storage unit for Russian standard-issue surplus.",
});

// gimmick.dm:25
rt.def("/obj/structure/closet/gimmick/russian/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	yield* parent_proc();
	rt.forRange(f, 0, 1, 5, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/head/ushanka"), this);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 5, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/under/soviet"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(12303, "/obj/structure/closet/gimmick/tacticool", "/obj/structure/closet/gimmick", {
	name: "tacticool gear closet",
	desc: "It's a storage unit for Tacticool gear.",
});

// gimmick.dm:36
rt.def("/obj/structure/closet/gimmick/tacticool/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/item/clothing/glasses/eyepatch"), this);
	yield* new_(T("/obj/item/clothing/glasses/sunglasses"), this);
	yield* new_(T("/obj/item/clothing/gloves/combat"), this);
	yield* new_(T("/obj/item/clothing/gloves/combat"), this);
	yield* new_(T("/obj/item/clothing/head/helmet/swat"), this);
	yield* new_(T("/obj/item/clothing/head/helmet/swat"), this);
	yield* new_(T("/obj/item/clothing/mask/gas/sechailer/swat"), this);
	yield* new_(T("/obj/item/clothing/mask/gas/sechailer/swat"), this);
	yield* new_(T("/obj/item/clothing/shoes/combat/swat"), this);
	yield* new_(T("/obj/item/clothing/shoes/combat/swat"), this);
	yield* new_(T("/obj/item/clothing/suit/space/hardsuit/deathsquad"), this);
	yield* new_(T("/obj/item/clothing/suit/space/hardsuit/deathsquad"), this);
	yield* new_(T("/obj/item/clothing/under/syndicate/tacticool"), this);
	yield* new_(T("/obj/item/clothing/under/syndicate/tacticool"), this);
	return f.dot;
}, true);

rt.type(12305, "/obj/structure/closet/thunderdome/tdred", "/obj/structure/closet/thunderdome", {
	icon_door: "red",
	name: "red-team Thunderdome closet",
});

// gimmick.dm:63
rt.def("/obj/structure/closet/thunderdome/tdred/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	yield* parent_proc();
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/suit/armor/tdome/red"), this);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/melee/energy/sword/saber"), this);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/gun/energy/laser"), this);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/melee/baton/loaded"), this);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/storage/box/flashbangs"), this);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/head/helmet/thunderdome"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(12306, "/obj/structure/closet/thunderdome/tdgreen", "/obj/structure/closet/thunderdome", {
	icon_door: "green",
	name: "green-team Thunderdome closet",
});

// gimmick.dm:82
rt.def("/obj/structure/closet/thunderdome/tdgreen/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	yield* parent_proc();
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/suit/armor/tdome/green"), this);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/melee/energy/sword/saber"), this);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/gun/energy/laser"), this);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/melee/baton/loaded"), this);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/storage/box/flashbangs"), this);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/head/helmet/thunderdome"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(12308, "/obj/structure/closet/malf/suits", "/obj/structure/closet/malf", {
	desc: "It's a storage unit for operational gear.",
	icon_state: "syndicate",
});

// gimmick.dm:101
rt.def("/obj/structure/closet/malf/suits/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/item/weapon/tank/jetpack/void"), this);
	yield* new_(T("/obj/item/clothing/mask/breath"), this);
	yield* new_(T("/obj/item/clothing/head/helmet/space/nasavoid"), this);
	yield* new_(T("/obj/item/clothing/suit/space/nasavoid"), this);
	yield* new_(T("/obj/item/weapon/crowbar"), this);
	yield* new_(T("/obj/item/weapon/stock_parts/cell"), this);
	yield* new_(T("/obj/item/device/multitool"), this);
	return f.dot;
}, true);
