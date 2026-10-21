// From code/game/objects/structures/crates_lockers/closets/utility_closets.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12348, "/obj/structure/closet/emcloset", "/obj/structure/closet", {
	name: "emergency closet",
	desc: "It's a storage unit for emergency breath masks and O2 tanks.",
	icon_state: "emergency",
});

// /obj/structure/closet/emcloset/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/utility_closets.dm:21)  may sleep
rt.def("/obj/structure/closet/emcloset/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.op(f, "Prob", [], [40]))) {
		yield* g.new_(f, T("/obj/item/weapon/storage/toolbox/emergency"), [live(f.src)]);
	}
	$0 = (yield* g.call(f, P("/proc/pickweight"), null, [rt.alist(f, ["small", 40, "aid", 25, "tank", 20, "both", 10, "nothing", 4, "delete", 1])]));
	if ($0 === "small") {
		yield* g.new_(f, T("/obj/item/weapon/tank/internals/emergency_oxygen"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/tank/internals/emergency_oxygen"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/clothing/mask/breath"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/clothing/mask/breath"), [live(f.src)]);
	} else if ($0 === "aid") {
		yield* g.new_(f, T("/obj/item/weapon/tank/internals/emergency_oxygen"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/storage/firstaid/o2"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/clothing/mask/breath"), [live(f.src)]);
	} else if ($0 === "tank") {
		yield* g.new_(f, T("/obj/item/weapon/tank/internals/air"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/clothing/mask/breath"), [live(f.src)]);
	} else if ($0 === "both") {
		yield* g.new_(f, T("/obj/item/weapon/tank/internals/emergency_oxygen"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/clothing/mask/breath"), [live(f.src)]);
	} else if ($0 === "nothing") {
	} else if ($0 === "delete") {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	return f.dot;
}, true);

rt.type(12349, "/obj/structure/closet/firecloset", "/obj/structure/closet", {
	name: "fire-safety closet",
	desc: "It's a storage unit for fire-fighting supplies.",
	icon_state: "fire",
});

// /obj/structure/closet/firecloset/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/utility_closets.dm:67)  may sleep
rt.def("/obj/structure/closet/firecloset/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/clothing/suit/fire/firefighter"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/mask/gas"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/tank/internals/oxygen/red"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/extinguisher"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/head/hardhat/red"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(12350, "/obj/structure/closet/firecloset/full", "/obj/structure/closet/firecloset", {});

// /obj/structure/closet/firecloset/full/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/utility_closets.dm:76)  may sleep
rt.def("/obj/structure/closet/firecloset/full/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/clothing/suit/fire/firefighter"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/mask/gas"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/flashlight"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/tank/internals/oxygen/red"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/extinguisher"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/head/hardhat/red"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(12351, "/obj/structure/closet/toolcloset", "/obj/structure/closet", {
	icon_door: "eng_tool",
	name: "tool closet",
	desc: "It's a storage unit for tools.",
	icon_state: "eng",
});

// /obj/structure/closet/toolcloset/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/utility_closets.dm:93)  may sleep
rt.def("/obj/structure/closet/toolcloset/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.op(f, "Prob", [], [40]))) {
		yield* g.new_(f, T("/obj/item/clothing/suit/hazardvest"), [live(f.src)]);
	}
	if (truthy(rt.op(f, "Prob", [], [70]))) {
		yield* g.new_(f, T("/obj/item/device/flashlight"), [live(f.src)]);
	}
	if (truthy(rt.op(f, "Prob", [], [70]))) {
		yield* g.new_(f, T("/obj/item/weapon/screwdriver"), [live(f.src)]);
	}
	if (truthy(rt.op(f, "Prob", [], [70]))) {
		yield* g.new_(f, T("/obj/item/weapon/wrench"), [live(f.src)]);
	}
	if (truthy(rt.op(f, "Prob", [], [70]))) {
		yield* g.new_(f, T("/obj/item/weapon/weldingtool"), [live(f.src)]);
	}
	if (truthy(rt.op(f, "Prob", [], [70]))) {
		yield* g.new_(f, T("/obj/item/weapon/crowbar"), [live(f.src)]);
	}
	if (truthy(rt.op(f, "Prob", [], [70]))) {
		yield* g.new_(f, T("/obj/item/weapon/wirecutters"), [live(f.src)]);
	}
	if (truthy(rt.op(f, "Prob", [], [70]))) {
		yield* g.new_(f, T("/obj/item/device/t_scanner"), [live(f.src)]);
	}
	if (truthy(rt.op(f, "Prob", [], [20]))) {
		yield* g.new_(f, T("/obj/item/weapon/storage/belt/utility"), [live(f.src)]);
	}
	if (truthy(rt.op(f, "Prob", [], [30]))) {
		yield* g.new_(f, T("/obj/item/stack/cable_coil/random"), [live(f.src)]);
	}
	if (truthy(rt.op(f, "Prob", [], [30]))) {
		yield* g.new_(f, T("/obj/item/stack/cable_coil/random"), [live(f.src)]);
	}
	if (truthy(rt.op(f, "Prob", [], [30]))) {
		yield* g.new_(f, T("/obj/item/stack/cable_coil/random"), [live(f.src)]);
	}
	if (truthy(rt.op(f, "Prob", [], [20]))) {
		yield* g.new_(f, T("/obj/item/device/multitool"), [live(f.src)]);
	}
	if (truthy(rt.op(f, "Prob", [], [5]))) {
		yield* g.new_(f, T("/obj/item/clothing/gloves/color/yellow"), [live(f.src)]);
	}
	if (!truthy(rt.op(f, "Prob", [], [40]))) return f.dot;
	yield* g.new_(f, T("/obj/item/clothing/head/hardhat"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(12352, "/obj/structure/closet/radiation", "/obj/structure/closet", {
	icon_door: "eng_rad",
	name: "radiation suit closet",
	desc: "It's a storage unit for rad-protective suits.",
	icon_state: "eng",
});

// /obj/structure/closet/radiation/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/utility_closets.dm:136)  may sleep
rt.def("/obj/structure/closet/radiation/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/device/geiger_counter"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/radiation"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/head/radiation"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(12353, "/obj/structure/closet/bombcloset", "/obj/structure/closet", {
	name: "１EOD closet",
	desc: "It's a storage unit for explosion-protective suits.",
	icon_state: "bomb",
});

// /obj/structure/closet/bombcloset/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/utility_closets.dm:150)  may sleep
rt.def("/obj/structure/closet/bombcloset/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/clothing/suit/bomb_suit"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/color/black"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/shoes/sneakers/black"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/head/bomb_hood"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(12354, "/obj/structure/closet/bombclosetsecurity", "/obj/structure/closet", {
	name: "１EOD closet",
	desc: "It's a storage unit for explosion-protective suits.",
	icon_state: "bomb",
});

// /obj/structure/closet/bombclosetsecurity/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/utility_closets.dm:163)  may sleep
rt.def("/obj/structure/closet/bombclosetsecurity/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/clothing/suit/bomb_suit/security"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/rank/security"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/shoes/sneakers/brown"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/head/bomb_hood/security"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(12355, "/obj/structure/closet/ammunitionlocker", "/obj/structure/closet", {
	name: "ammunition locker",
});

// /obj/structure/closet/ammunitionlocker/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/utility_closets.dm:175)  may sleep
rt.def("/obj/structure/closet/ammunitionlocker/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	i = null;
	rt.forRange(f, 0, 1, 8, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/ammo_casing/shotgun/beanbag"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
