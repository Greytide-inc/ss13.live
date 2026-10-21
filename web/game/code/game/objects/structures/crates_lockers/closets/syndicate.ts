// From code/game/objects/structures/crates_lockers/closets/syndicate.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12344, "/obj/structure/closet/syndicate/personal", "/obj/structure/closet/syndicate", {
	desc: "It's a personal storage unit for operative gear.",
});

// /obj/structure/closet/syndicate/personal/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/syndicate.dm:10)  may sleep
rt.def("/obj/structure/closet/syndicate/personal/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/clothing/under/syndicate"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/shoes/sneakers/black"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/radio/headset/syndicate"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/ammo_box/magazine/m10mm"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/belt/military"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/crowbar/red"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/glasses/night"), [live(f.src)]);
	return live(f.dot);
}, true);

rt.type(12345, "/obj/structure/closet/syndicate/nuclear", "/obj/structure/closet/syndicate", {
	desc: "It's a storage unit for a Syndicate boarding party.",
});

// /obj/structure/closet/syndicate/nuclear/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/syndicate.dm:24)  may sleep
rt.def("/obj/structure/closet/syndicate/nuclear/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 5, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/ammo_box/magazine/m10mm"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	yield* g.new_(f, T("/obj/item/weapon/storage/box/flashbangs"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/box/teargas"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/backpack/duffelbag/syndie/med"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/pda/syndicate"), [live(f.src)]);
	return live(f.dot);
}, true);

rt.type(12346, "/obj/structure/closet/syndicate/resources", "/obj/structure/closet/syndicate", {
	desc: "An old, dusty locker.",
});

// /obj/structure/closet/syndicate/resources/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/syndicate.dm:36)  may sleep
rt.def("/obj/structure/closet/syndicate/resources/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let common_min: Value = null, common_max: Value = null, rare_min: Value = null, rare_max: Value = null, pickednum: Value = null, _P: Value = null;
	f.vars = () => [common_min, common_max, rare_min, rare_max, pickednum, _P];
	yield* g.callSuper(f, [], rt.Args.Same);
	common_min = 30;
	common_max = 50;
	rare_min = 5;
	rare_max = 20;
	if (isEqual((pickednum = (yield* g.call(f, P("/proc/rand"), null, [1, 50]))), 1)) {
		rt.setFv(f, "name", (_P = (yield* g.new_(f, T("/obj/item/weapon/paper"), [live(f.src)]))), "ÿ\u0016IOU");
		rt.setFv(f, "info", live(_P), "Sorry man, we needed the money so we sold your stash. It's ok, we'll double our money for sure this time!");
	}
	if (rt.ge(live(pickednum), 2)) {
		yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [live(f.src), (yield* g.call(f, P("/proc/rand"), null, [live(common_min), live(common_max)]))]);
	}
	if (rt.ge(live(pickednum), 5)) {
		yield* g.new_(f, T("/obj/item/stack/sheet/glass"), [live(f.src), (yield* g.call(f, P("/proc/rand"), null, [live(common_min), live(common_max)]))]);
	}
	if (rt.ge(live(pickednum), 10)) {
		yield* g.new_(f, T("/obj/item/stack/sheet/plasteel"), [live(f.src), (yield* g.call(f, P("/proc/rand"), null, [live(common_min), live(common_max)]))]);
	}
	if (rt.ge(live(pickednum), 15)) {
		yield* g.new_(f, T("/obj/item/stack/sheet/mineral/plasma"), [live(f.src), (yield* g.call(f, P("/proc/rand"), null, [live(rare_min), live(rare_max)]))]);
	}
	if (rt.ge(live(pickednum), 20)) {
		yield* g.new_(f, T("/obj/item/stack/sheet/mineral/silver"), [live(f.src), (yield* g.call(f, P("/proc/rand"), null, [live(rare_min), live(rare_max)]))]);
	}
	if (rt.ge(live(pickednum), 30)) {
		yield* g.new_(f, T("/obj/item/stack/sheet/mineral/gold"), [live(f.src), (yield* g.call(f, P("/proc/rand"), null, [live(rare_min), live(rare_max)]))]);
	}
	if (rt.ge(live(pickednum), 40)) {
		yield* g.new_(f, T("/obj/item/stack/sheet/mineral/uranium"), [live(f.src), (yield* g.call(f, P("/proc/rand"), null, [live(rare_min), live(rare_max)]))]);
	}
	if (rt.ge(live(pickednum), 40)) {
		yield* g.new_(f, T("/obj/item/stack/sheet/mineral/titanium"), [live(f.src), (yield* g.call(f, P("/proc/rand"), null, [live(rare_min), live(rare_max)]))]);
	}
	if (rt.ge(live(pickednum), 40)) {
		yield* g.new_(f, T("/obj/item/stack/sheet/mineral/plastitanium"), [live(f.src), (yield* g.call(f, P("/proc/rand"), null, [live(rare_min), live(rare_max)]))]);
	}
	if (rt.ge(live(pickednum), 45)) {
		yield* g.new_(f, T("/obj/item/stack/sheet/mineral/diamond"), [live(f.src), (yield* g.call(f, P("/proc/rand"), null, [live(rare_min), live(rare_max)]))]);
	}
	if (isEqual(live(pickednum), 50)) {
		yield* g.new_(f, T("/obj/item/weapon/tank/jetpack/carbondioxide"), [live(f.src)]);
	}
	return live(f.dot);
}, true);

rt.type(12347, "/obj/structure/closet/syndicate/resources/everything", "/obj/structure/closet/syndicate/resources", {
	desc: "It's an emergency storage closet for repairs.",
});

// /obj/structure/closet/syndicate/resources/everything/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/syndicate.dm:101)  may sleep
rt.def("/obj/structure/closet/syndicate/resources/everything/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let resources: Value = null, i: Value = null, res: Value = null, R: Value = null;
	let $e: any;
	f.vars = () => [resources, i, res, R, $e];
	resources = rt.list(T("/obj/item/stack/sheet/metal"), T("/obj/item/stack/sheet/glass"), T("/obj/item/stack/sheet/mineral/gold"), T("/obj/item/stack/sheet/mineral/silver"), T("/obj/item/stack/sheet/mineral/plasma"), T("/obj/item/stack/sheet/mineral/uranium"), T("/obj/item/stack/sheet/mineral/diamond"), T("/obj/item/stack/sheet/mineral/bananium"), T("/obj/item/stack/sheet/plasteel"), T("/obj/item/stack/sheet/mineral/titanium"), T("/obj/item/stack/sheet/mineral/plastitanium"), T("/obj/item/stack/rods"));
	i = null;
	i = 0;
	while (rt.lt(live(i), 2)) {
		res = null;
		rt.forList(f, 0, live(resources));
		while (($e = rt.next(f, 0)) !== undefined) {
			res = $e;
			rt.setFv(f, "amount", (R = (yield* g.new_(f, live(res), [live(f.src)]))), rt.fv(f, "max_amount", live(R)));
		}
		rt.endFor(f, 0);
		i = rt.inc(live(i), 1);
	}
	return live(f.dot);
}, true);
