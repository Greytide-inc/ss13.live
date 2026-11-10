// Based on /tg/station's code/game/objects/structures/crates_lockers/closets/syndicate.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12344, "/obj/structure/closet/syndicate/personal", "/obj/structure/closet/syndicate", {
	desc: "It's a personal storage unit for operative gear.",
});

// syndicate.dm:10
rt.def("/obj/structure/closet/syndicate/personal/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/item/clothing/under/syndicate"), this);
	yield* new_(T("/obj/item/clothing/shoes/sneakers/black"), this);
	yield* new_(T("/obj/item/device/radio/headset/syndicate"), this);
	yield* new_(T("/obj/item/ammo_box/magazine/m10mm"), this);
	yield* new_(T("/obj/item/weapon/storage/belt/military"), this);
	yield* new_(T("/obj/item/weapon/crowbar/red"), this);
	yield* new_(T("/obj/item/clothing/glasses/night"), this);
	return f.dot;
}, true);

rt.type(12345, "/obj/structure/closet/syndicate/nuclear", "/obj/structure/closet/syndicate", {
	desc: "It's a storage unit for a Syndicate boarding party.",
});

// syndicate.dm:24
rt.def("/obj/structure/closet/syndicate/nuclear/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 5, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/ammo_box/magazine/m10mm"), this);
	}
	rt.endFor(f, 0);
	yield* new_(T("/obj/item/weapon/storage/box/flashbangs"), this);
	yield* new_(T("/obj/item/weapon/storage/box/teargas"), this);
	yield* new_(T("/obj/item/weapon/storage/backpack/duffelbag/syndie/med"), this);
	yield* new_(T("/obj/item/device/pda/syndicate"), this);
	return f.dot;
}, true);

rt.type(12346, "/obj/structure/closet/syndicate/resources", "/obj/structure/closet/syndicate", {
	desc: "An old, dusty locker.",
});

// syndicate.dm:36
rt.def("/obj/structure/closet/syndicate/resources/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let pickednum: Value = null, _P: Value = null;
	yield* parent_proc();
	let common_min: Value = 30;
	let common_max: Value = 50;
	let rare_min: Value = 5;
	let rare_max: Value = 20;
	if ((pickednum = rand(1, 50)) == 1) {
		(_P = (yield* new_(T("/obj/item/weapon/paper"), this))).name = "ÿ\u0016IOU";
		_P.info = "Sorry man, we needed the money so we sold your stash. It's ok, we'll double our money for sure this time!";
	}
	if (pickednum >= 2) {
		yield* new_(T("/obj/item/stack/sheet/metal"), this, rand(common_min, common_max));
	}
	if (pickednum >= 5) {
		yield* new_(T("/obj/item/stack/sheet/glass"), this, rand(common_min, common_max));
	}
	if (pickednum >= 10) {
		yield* new_(T("/obj/item/stack/sheet/plasteel"), this, rand(common_min, common_max));
	}
	if (pickednum >= 15) {
		yield* new_(T("/obj/item/stack/sheet/mineral/plasma"), this, rand(rare_min, rare_max));
	}
	if (pickednum >= 20) {
		yield* new_(T("/obj/item/stack/sheet/mineral/silver"), this, rand(rare_min, rare_max));
	}
	if (pickednum >= 30) {
		yield* new_(T("/obj/item/stack/sheet/mineral/gold"), this, rand(rare_min, rare_max));
	}
	if (pickednum >= 40) {
		yield* new_(T("/obj/item/stack/sheet/mineral/uranium"), this, rand(rare_min, rare_max));
	}
	if (pickednum >= 40) {
		yield* new_(T("/obj/item/stack/sheet/mineral/titanium"), this, rand(rare_min, rare_max));
	}
	if (pickednum >= 40) {
		yield* new_(T("/obj/item/stack/sheet/mineral/plastitanium"), this, rand(rare_min, rare_max));
	}
	if (pickednum >= 45) {
		yield* new_(T("/obj/item/stack/sheet/mineral/diamond"), this, rand(rare_min, rare_max));
	}
	if (pickednum == 50) {
		yield* new_(T("/obj/item/weapon/tank/jetpack/carbondioxide"), this);
	}
	return f.dot;
}, true);

rt.type(12347, "/obj/structure/closet/syndicate/resources/everything", "/obj/structure/closet/syndicate/resources", {
	desc: "It's an emergency storage closet for repairs.",
});

// syndicate.dm:101
rt.def("/obj/structure/closet/syndicate/resources/everything/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let res: Value = null, R: Value = null;
	let resources: Value = list(T("/obj/item/stack/sheet/metal"), T("/obj/item/stack/sheet/glass"), T("/obj/item/stack/sheet/mineral/gold"), T("/obj/item/stack/sheet/mineral/silver"), T("/obj/item/stack/sheet/mineral/plasma"), T("/obj/item/stack/sheet/mineral/uranium"), T("/obj/item/stack/sheet/mineral/diamond"), T("/obj/item/stack/sheet/mineral/bananium"), T("/obj/item/stack/sheet/plasteel"), T("/obj/item/stack/sheet/mineral/titanium"), T("/obj/item/stack/sheet/mineral/plastitanium"), T("/obj/item/stack/rods"));
	let i: Value = 0;
	while (i < 2) {
		res = null;
		for (res of each(resources)) {
			(R = (yield* new_(res, this))).amount = R.max_amount;
		}
		i++;
	}
	return f.dot;
}, true);
