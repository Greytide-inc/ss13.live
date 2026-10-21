// From code/game/objects/structures/crates_lockers/closets/job_closets.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12309, "/obj/structure/closet/gmcloset", "/obj/structure/closet", {
	icon_door: "black",
	name: "formal closet",
	desc: "It's a storage unit for formal clothing.",
});

// /obj/structure/closet/gmcloset/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/job_closets.dm:9)  may sleep
rt.def("/obj/structure/closet/gmcloset/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/clothing/head/that"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/radio/headset/headset_srv"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/radio/headset/headset_srv"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/head/that"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/sl_suit"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/sl_suit"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/rank/bartender"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/rank/bartender"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/accessory/waistcoat"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/accessory/waistcoat"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/head/soft/black"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/head/soft/black"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/shoes/sneakers/black"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/shoes/sneakers/black"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/rag"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/rag"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/box/beanbag"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/armor/vest/alt"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/glasses/sunglasses/reagent"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/belt/bandolier"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(12310, "/obj/structure/closet/chefcloset", "/obj/structure/closet", {
	icon_door: "black",
	name: "０chef's closet",
	desc: "It's a storage unit for foodservice garments and mouse traps.",
});

// /obj/structure/closet/chefcloset/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/job_closets.dm:37)  may sleep
rt.def("/obj/structure/closet/chefcloset/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/clothing/under/waiter"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/waiter"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/radio/headset/headset_srv"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/radio/headset/headset_srv"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/accessory/waistcoat"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/accessory/waistcoat"), [live(f.src)]);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/suit/apron/chef"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	yield* g.new_(f, T("/obj/item/clothing/head/soft/mime"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/head/soft/mime"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/box/mousetraps"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/box/mousetraps"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/toggle/chef"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/rank/chef"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/head/chefhat"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/rag"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(12311, "/obj/structure/closet/jcloset", "/obj/structure/closet", {
	icon_door: "mixed",
	name: "custodial closet",
	desc: "It's a storage unit for janitorial clothes and gear.",
});

// /obj/structure/closet/jcloset/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/job_closets.dm:61)  may sleep
rt.def("/obj/structure/closet/jcloset/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/clothing/under/rank/janitor"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/cartridge/janitor"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/gloves/color/black"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/head/soft/purple"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/paint/paint_remover"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/melee/flyswatter"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/flashlight"), [live(f.src)]);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/caution"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	yield* g.new_(f, T("/obj/item/weapon/holosign_creator"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/lightreplacer"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/soap"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/bag/trash"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/shoes/galoshes"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/watertank/janitor"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/belt/janitor"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(12312, "/obj/structure/closet/lawcloset", "/obj/structure/closet", {
	icon_door: "blue",
	name: "legal closet",
	desc: "It's a storage unit for courtroom apparel and items.",
});

// /obj/structure/closet/lawcloset/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/job_closets.dm:86)  may sleep
rt.def("/obj/structure/closet/lawcloset/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/clothing/under/lawyer/female"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/lawyer/black"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/lawyer/red"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/lawyer/bluesuit"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/toggle/lawyer"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/lawyer/purpsuit"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/toggle/lawyer/purple"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/lawyer/blacksuit"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/toggle/lawyer/black"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/shoes/laceup"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/shoes/laceup"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/accessory/lawyers_badge"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/accessory/lawyers_badge"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(12314, "/obj/structure/closet/wardrobe/chaplain_black", "/obj/structure/closet/wardrobe", {
	icon_door: "black",
	name: "chapel wardrobe",
	desc: "It's a storage unit for Nanotrasen-approved religious attire.",
});

// /obj/structure/closet/wardrobe/chaplain_black/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/job_closets.dm:107)  may sleep
rt.def("/obj/structure/closet/wardrobe/chaplain_black/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/clothing/under/rank/chaplain"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/shoes/sneakers/black"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/nun"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/head/nun_hood"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/studentuni"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/head/cage"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/witchhunter"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/head/witchunter_hat"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/hooded/chaplain_hoodie"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/holidaypriest"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/backpack/cultpack"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/head/helmet/knight/templar"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/armor/riot/knight/templar"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/fancy/candle_box"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/fancy/candle_box"), [live(f.src)]);
	return live(f.dot);
}, true);

rt.type(12315, "/obj/structure/closet/wardrobe/red", "/obj/structure/closet/wardrobe", {
	icon_door: "red",
	name: "security wardrobe",
});

// /obj/structure/closet/wardrobe/red/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/job_closets.dm:141)  may sleep
rt.def("/obj/structure/closet/wardrobe/red/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	yield* g.new_(f, T("/obj/item/clothing/suit/hooded/wintercoat/security"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/backpack/security"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/backpack/satchel/sec"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/backpack/duffelbag/sec"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/backpack/duffelbag/sec"), [live(f.src)]);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/under/rank/security"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/shoes/jackboots"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/head/beret/sec"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/head/soft/sec"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	yield* g.new_(f, T("/obj/item/clothing/mask/bandana/red"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/mask/bandana/red"), [live(f.src)]);
	return live(f.dot);
}, true);

rt.type(12316, "/obj/structure/closet/wardrobe/cargotech", "/obj/structure/closet/wardrobe", {
	icon_door: "orange",
	name: "cargo wardrobe",
});

// /obj/structure/closet/wardrobe/cargotech/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/job_closets.dm:164)  may sleep
rt.def("/obj/structure/closet/wardrobe/cargotech/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	yield* g.new_(f, T("/obj/item/clothing/suit/hooded/wintercoat/cargo"), [live(f.src)]);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/under/rank/cargotech"), [live(f.src)]);
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
		yield* g.new_(f, T("/obj/item/clothing/gloves/fingerless"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/head/soft"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	yield* g.new_(f, T("/obj/item/device/radio/headset/headset_cargo"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(12317, "/obj/structure/closet/wardrobe/atmospherics_yellow", "/obj/structure/closet/wardrobe", {
	icon_door: "atmos_wardrobe",
	name: "atmospherics wardrobe",
});

// /obj/structure/closet/wardrobe/atmospherics_yellow/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/job_closets.dm:180)  may sleep
rt.def("/obj/structure/closet/wardrobe/atmospherics_yellow/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	yield* g.new_(f, T("/obj/item/weapon/storage/backpack/duffelbag/engineering"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/backpack/satchel/eng"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/backpack/industrial"), [live(f.src)]);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/suit/hooded/wintercoat/engineering/atmos"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/under/rank/atmospheric_technician"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/shoes/sneakers/black"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return live(f.dot);
}, true);

rt.type(12318, "/obj/structure/closet/wardrobe/engineering_yellow", "/obj/structure/closet/wardrobe", {
	icon_door: "yellow",
	name: "engineering wardrobe",
});

// /obj/structure/closet/wardrobe/engineering_yellow/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/job_closets.dm:196)  may sleep
rt.def("/obj/structure/closet/wardrobe/engineering_yellow/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	yield* g.new_(f, T("/obj/item/weapon/storage/backpack/duffelbag/engineering"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/backpack/industrial"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/backpack/satchel/eng"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/hooded/wintercoat/engineering"), [live(f.src)]);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/under/rank/engineer"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/suit/hazardvest"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/shoes/workboots"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/head/hardhat"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return live(f.dot);
}, true);

rt.type(12320, "/obj/structure/closet/wardrobe/white/medical", "/obj/structure/closet/wardrobe/white", {
	name: "medical doctor's wardrobe",
});

// /obj/structure/closet/wardrobe/white/medical/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/job_closets.dm:214)  may sleep
rt.def("/obj/structure/closet/wardrobe/white/medical/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	yield* g.new_(f, T("/obj/item/weapon/storage/backpack/duffelbag/med"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/backpack/medic"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/backpack/satchel/med"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/hooded/wintercoat/medical"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/rank/nursesuit"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/head/nursehat"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/rank/medical/blue"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/rank/medical/green"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/rank/medical/purple"), [live(f.src)]);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/under/rank/medical"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	yield* g.new_(f, T("/obj/item/clothing/suit/toggle/labcoat"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/toggle/labcoat"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/toggle/labcoat/emt"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/toggle/labcoat/emt"), [live(f.src)]);
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
		yield* g.new_(f, T("/obj/item/clothing/head/soft/emt"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return live(f.dot);
}, true);

rt.type(12321, "/obj/structure/closet/wardrobe/robotics_black", "/obj/structure/closet/wardrobe", {
	icon_door: "black",
	name: "robotics wardrobe",
});

// /obj/structure/closet/wardrobe/robotics_black/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/job_closets.dm:240)  may sleep
rt.def("/obj/structure/closet/wardrobe/robotics_black/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/clothing/glasses/hud/diagnostic"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/glasses/hud/diagnostic"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/rank/roboticist"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/rank/roboticist"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/toggle/labcoat"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/toggle/labcoat"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/shoes/sneakers/black"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/shoes/sneakers/black"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/gloves/fingerless"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/gloves/fingerless"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/head/soft/black"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/head/soft/black"), [live(f.src)]);
	if (truthy(rt.op(f, "Prob", [], [40]))) {
		yield* g.new_(f, T("/obj/item/clothing/mask/bandana/skull"), [live(f.src)]);
	}
	if (truthy(rt.op(f, "Prob", [], [40]))) {
		yield* g.new_(f, T("/obj/item/clothing/mask/bandana/skull"), [live(f.src)]);
	}
	return live(f.dot);
}, true);

rt.type(12322, "/obj/structure/closet/wardrobe/chemistry_white", "/obj/structure/closet/wardrobe", {
	icon_door: "white",
	name: "chemistry wardrobe",
});

// /obj/structure/closet/wardrobe/chemistry_white/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/job_closets.dm:264)  may sleep
rt.def("/obj/structure/closet/wardrobe/chemistry_white/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/clothing/under/rank/chemist"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/rank/chemist"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/shoes/sneakers/white"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/shoes/sneakers/white"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/toggle/labcoat/chemist"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/toggle/labcoat/chemist"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/backpack/chemistry"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/backpack/chemistry"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/backpack/satchel/chem"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/backpack/satchel/chem"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/bag/chemistry"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/bag/chemistry"), [live(f.src)]);
	return live(f.dot);
}, true);

rt.type(12323, "/obj/structure/closet/wardrobe/genetics_white", "/obj/structure/closet/wardrobe", {
	icon_door: "white",
	name: "genetics wardrobe",
});

// /obj/structure/closet/wardrobe/genetics_white/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/job_closets.dm:284)  may sleep
rt.def("/obj/structure/closet/wardrobe/genetics_white/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/clothing/under/rank/geneticist"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/rank/geneticist"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/shoes/sneakers/white"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/shoes/sneakers/white"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/toggle/labcoat/genetics"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/toggle/labcoat/genetics"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/backpack/genetics"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/backpack/genetics"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/backpack/satchel/gen"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/backpack/satchel/gen"), [live(f.src)]);
	return live(f.dot);
}, true);

rt.type(12324, "/obj/structure/closet/wardrobe/virology_white", "/obj/structure/closet/wardrobe", {
	icon_door: "white",
	name: "virology wardrobe",
});

// /obj/structure/closet/wardrobe/virology_white/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/job_closets.dm:302)  may sleep
rt.def("/obj/structure/closet/wardrobe/virology_white/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/clothing/under/rank/virologist"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/rank/virologist"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/shoes/sneakers/white"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/shoes/sneakers/white"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/toggle/labcoat/virologist"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/toggle/labcoat/virologist"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/mask/surgical"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/mask/surgical"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/backpack/virology"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/backpack/virology"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/backpack/satchel/vir"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/backpack/satchel/vir"), [live(f.src)]);
	return live(f.dot);
}, true);

rt.type(12325, "/obj/structure/closet/wardrobe/science_white", "/obj/structure/closet/wardrobe", {
	icon_door: "white",
	name: "science wardrobe",
});

// /obj/structure/closet/wardrobe/science_white/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/job_closets.dm:321)  may sleep
rt.def("/obj/structure/closet/wardrobe/science_white/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	yield* g.new_(f, T("/obj/item/weapon/storage/backpack/science"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/backpack/science"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/backpack/satchel/tox"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/backpack/satchel/tox"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/hooded/wintercoat/science"), [live(f.src)]);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/under/rank/scientist"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/suit/toggle/labcoat/science"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/shoes/sneakers/white"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	yield* g.new_(f, T("/obj/item/device/radio/headset/headset_sci"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/radio/headset/headset_sci"), [live(f.src)]);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/mask/gas"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return live(f.dot);
}, true);

rt.type(12326, "/obj/structure/closet/wardrobe/botanist", "/obj/structure/closet/wardrobe", {
	icon_door: "green",
	name: "botanist wardrobe",
});

// /obj/structure/closet/wardrobe/botanist/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/job_closets.dm:343)  may sleep
rt.def("/obj/structure/closet/wardrobe/botanist/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	yield* g.new_(f, T("/obj/item/weapon/storage/backpack/botany"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/backpack/botany"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/backpack/satchel/hyd"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/backpack/satchel/hyd"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/hooded/wintercoat/hydro"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/apron"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/apron"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/apron/overalls"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/apron/overalls"), [live(f.src)]);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/under/rank/hydroponics"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/mask/bandana"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(12327, "/obj/structure/closet/wardrobe/curator", "/obj/structure/closet/wardrobe", {
	icon_door: "black",
	name: "treasure hunting wardrobe",
});

// /obj/structure/closet/wardrobe/curator/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/job_closets.dm:363)  may sleep
rt.def("/obj/structure/closet/wardrobe/curator/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/clothing/head/fedora/curator"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/curator"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/rank/curator/treasure_hunter"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/shoes/workboots/mining"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/backpack/satchel/explorer"), [live(f.src)]);
	return f.dot;
}, true);
