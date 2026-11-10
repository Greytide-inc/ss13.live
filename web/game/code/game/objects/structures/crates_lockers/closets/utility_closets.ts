// Based on /tg/station's code/game/objects/structures/crates_lockers/closets/utility_closets.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12348, "/obj/structure/closet/emcloset", "/obj/structure/closet", {
	name: "emergency closet",
	desc: "It's a storage unit for emergency breath masks and O2 tanks.",
	icon_state: "emergency",
});

// utility_closets.dm:21
rt.def("/obj/structure/closet/emcloset/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* parent_proc();
	if (prob(40)) {
		yield* new_(T("/obj/item/weapon/storage/toolbox/emergency"), this);
	}
	const pickweight_2 = pickweight(rt.alist(f, ["small", 40, "aid", 25, "tank", 20, "both", 10, "nothing", 4, "delete", 1]));
	if (pickweight_2 === "small") {
		yield* new_(T("/obj/item/weapon/tank/internals/emergency_oxygen"), this);
		yield* new_(T("/obj/item/weapon/tank/internals/emergency_oxygen"), this);
		yield* new_(T("/obj/item/clothing/mask/breath"), this);
		yield* new_(T("/obj/item/clothing/mask/breath"), this);
	} else if (pickweight_2 === "aid") {
		yield* new_(T("/obj/item/weapon/tank/internals/emergency_oxygen"), this);
		yield* new_(T("/obj/item/weapon/storage/firstaid/o2"), this);
		yield* new_(T("/obj/item/clothing/mask/breath"), this);
	} else if (pickweight_2 === "tank") {
		yield* new_(T("/obj/item/weapon/tank/internals/air"), this);
		yield* new_(T("/obj/item/clothing/mask/breath"), this);
	} else if (pickweight_2 === "both") {
		yield* new_(T("/obj/item/weapon/tank/internals/emergency_oxygen"), this);
		yield* new_(T("/obj/item/clothing/mask/breath"), this);
	} else if (pickweight_2 === "nothing") {
	} else if (pickweight_2 === "delete") {
		yield* qdel(this);
	}
	return f.dot;
}, true);

rt.type(12349, "/obj/structure/closet/firecloset", "/obj/structure/closet", {
	name: "fire-safety closet",
	desc: "It's a storage unit for fire-fighting supplies.",
	icon_state: "fire",
});

// utility_closets.dm:67
rt.def("/obj/structure/closet/firecloset/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/item/clothing/suit/fire/firefighter"), this);
	yield* new_(T("/obj/item/clothing/mask/gas"), this);
	yield* new_(T("/obj/item/weapon/tank/internals/oxygen/red"), this);
	yield* new_(T("/obj/item/weapon/extinguisher"), this);
	yield* new_(T("/obj/item/clothing/head/hardhat/red"), this);
	return f.dot;
}, true);

rt.type(12350, "/obj/structure/closet/firecloset/full", "/obj/structure/closet/firecloset", {});

// utility_closets.dm:76
rt.def("/obj/structure/closet/firecloset/full/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/clothing/suit/fire/firefighter"), this);
	yield* new_(T("/obj/item/clothing/mask/gas"), this);
	yield* new_(T("/obj/item/device/flashlight"), this);
	yield* new_(T("/obj/item/weapon/tank/internals/oxygen/red"), this);
	yield* new_(T("/obj/item/weapon/extinguisher"), this);
	yield* new_(T("/obj/item/clothing/head/hardhat/red"), this);
	return f.dot;
}, true);

rt.type(12351, "/obj/structure/closet/toolcloset", "/obj/structure/closet", {
	icon_door: "eng_tool",
	name: "tool closet",
	desc: "It's a storage unit for tools.",
	icon_state: "eng",
});

// utility_closets.dm:93
rt.def("/obj/structure/closet/toolcloset/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* parent_proc();
	if (prob(40)) {
		yield* new_(T("/obj/item/clothing/suit/hazardvest"), this);
	}
	if (prob(70)) {
		yield* new_(T("/obj/item/device/flashlight"), this);
	}
	if (prob(70)) {
		yield* new_(T("/obj/item/weapon/screwdriver"), this);
	}
	if (prob(70)) {
		yield* new_(T("/obj/item/weapon/wrench"), this);
	}
	if (prob(70)) {
		yield* new_(T("/obj/item/weapon/weldingtool"), this);
	}
	if (prob(70)) {
		yield* new_(T("/obj/item/weapon/crowbar"), this);
	}
	if (prob(70)) {
		yield* new_(T("/obj/item/weapon/wirecutters"), this);
	}
	if (prob(70)) {
		yield* new_(T("/obj/item/device/t_scanner"), this);
	}
	if (prob(20)) {
		yield* new_(T("/obj/item/weapon/storage/belt/utility"), this);
	}
	if (prob(30)) {
		yield* new_(T("/obj/item/stack/cable_coil/random"), this);
	}
	if (prob(30)) {
		yield* new_(T("/obj/item/stack/cable_coil/random"), this);
	}
	if (prob(30)) {
		yield* new_(T("/obj/item/stack/cable_coil/random"), this);
	}
	if (prob(20)) {
		yield* new_(T("/obj/item/device/multitool"), this);
	}
	if (prob(5)) {
		yield* new_(T("/obj/item/clothing/gloves/color/yellow"), this);
	}
	if (!prob(40)) return f.dot;
	yield* new_(T("/obj/item/clothing/head/hardhat"), this);
	return f.dot;
}, true);

rt.type(12352, "/obj/structure/closet/radiation", "/obj/structure/closet", {
	icon_door: "eng_rad",
	name: "radiation suit closet",
	desc: "It's a storage unit for rad-protective suits.",
	icon_state: "eng",
});

// utility_closets.dm:136
rt.def("/obj/structure/closet/radiation/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/item/device/geiger_counter"), this);
	yield* new_(T("/obj/item/clothing/suit/radiation"), this);
	yield* new_(T("/obj/item/clothing/head/radiation"), this);
	return f.dot;
}, true);

rt.type(12353, "/obj/structure/closet/bombcloset", "/obj/structure/closet", {
	name: "１EOD closet",
	desc: "It's a storage unit for explosion-protective suits.",
	icon_state: "bomb",
});

// utility_closets.dm:150
rt.def("/obj/structure/closet/bombcloset/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/item/clothing/suit/bomb_suit"), this);
	yield* new_(T("/obj/item/clothing/under/color/black"), this);
	yield* new_(T("/obj/item/clothing/shoes/sneakers/black"), this);
	yield* new_(T("/obj/item/clothing/head/bomb_hood"), this);
	return f.dot;
}, true);

rt.type(12354, "/obj/structure/closet/bombclosetsecurity", "/obj/structure/closet", {
	name: "１EOD closet",
	desc: "It's a storage unit for explosion-protective suits.",
	icon_state: "bomb",
});

// utility_closets.dm:163
rt.def("/obj/structure/closet/bombclosetsecurity/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/clothing/suit/bomb_suit/security"), this);
	yield* new_(T("/obj/item/clothing/under/rank/security"), this);
	yield* new_(T("/obj/item/clothing/shoes/sneakers/brown"), this);
	yield* new_(T("/obj/item/clothing/head/bomb_hood/security"), this);
	return f.dot;
}, true);

rt.type(12355, "/obj/structure/closet/ammunitionlocker", "/obj/structure/closet", {
	name: "ammunition locker",
});

// utility_closets.dm:175
rt.def("/obj/structure/closet/ammunitionlocker/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	yield* parent_proc();
	rt.forRange(f, 0, 1, 8, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/ammo_casing/shotgun/beanbag"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
