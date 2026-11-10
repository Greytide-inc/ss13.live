// Based on /tg/station's code/game/objects/structures/crates_lockers/closets/job_closets.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12309, "/obj/structure/closet/gmcloset", "/obj/structure/closet", {
	icon_door: "black",
	name: "formal closet",
	desc: "It's a storage unit for formal clothing.",
});

// job_closets.dm:9
rt.def("/obj/structure/closet/gmcloset/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/item/clothing/head/that"), this);
	yield* new_(T("/obj/item/device/radio/headset/headset_srv"), this);
	yield* new_(T("/obj/item/device/radio/headset/headset_srv"), this);
	yield* new_(T("/obj/item/clothing/head/that"), this);
	yield* new_(T("/obj/item/clothing/under/sl_suit"), this);
	yield* new_(T("/obj/item/clothing/under/sl_suit"), this);
	yield* new_(T("/obj/item/clothing/under/rank/bartender"), this);
	yield* new_(T("/obj/item/clothing/under/rank/bartender"), this);
	yield* new_(T("/obj/item/clothing/accessory/waistcoat"), this);
	yield* new_(T("/obj/item/clothing/accessory/waistcoat"), this);
	yield* new_(T("/obj/item/clothing/head/soft/black"), this);
	yield* new_(T("/obj/item/clothing/head/soft/black"), this);
	yield* new_(T("/obj/item/clothing/shoes/sneakers/black"), this);
	yield* new_(T("/obj/item/clothing/shoes/sneakers/black"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/glass/rag"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/glass/rag"), this);
	yield* new_(T("/obj/item/weapon/storage/box/beanbag"), this);
	yield* new_(T("/obj/item/clothing/suit/armor/vest/alt"), this);
	yield* new_(T("/obj/item/clothing/glasses/sunglasses/reagent"), this);
	yield* new_(T("/obj/item/weapon/storage/belt/bandolier"), this);
	return f.dot;
}, true);

rt.type(12310, "/obj/structure/closet/chefcloset", "/obj/structure/closet", {
	icon_door: "black",
	name: "０chef's closet",
	desc: "It's a storage unit for foodservice garments and mouse traps.",
});

// job_closets.dm:37
rt.def("/obj/structure/closet/chefcloset/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	yield* parent_proc();
	yield* new_(T("/obj/item/clothing/under/waiter"), this);
	yield* new_(T("/obj/item/clothing/under/waiter"), this);
	yield* new_(T("/obj/item/device/radio/headset/headset_srv"), this);
	yield* new_(T("/obj/item/device/radio/headset/headset_srv"), this);
	yield* new_(T("/obj/item/clothing/accessory/waistcoat"), this);
	yield* new_(T("/obj/item/clothing/accessory/waistcoat"), this);
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/suit/apron/chef"), this);
	}
	rt.endFor(f, 0);
	yield* new_(T("/obj/item/clothing/head/soft/mime"), this);
	yield* new_(T("/obj/item/clothing/head/soft/mime"), this);
	yield* new_(T("/obj/item/weapon/storage/box/mousetraps"), this);
	yield* new_(T("/obj/item/weapon/storage/box/mousetraps"), this);
	yield* new_(T("/obj/item/clothing/suit/toggle/chef"), this);
	yield* new_(T("/obj/item/clothing/under/rank/chef"), this);
	yield* new_(T("/obj/item/clothing/head/chefhat"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/glass/rag"), this);
	return f.dot;
}, true);

rt.type(12311, "/obj/structure/closet/jcloset", "/obj/structure/closet", {
	icon_door: "mixed",
	name: "custodial closet",
	desc: "It's a storage unit for janitorial clothes and gear.",
});

// job_closets.dm:61
rt.def("/obj/structure/closet/jcloset/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	yield* parent_proc();
	yield* new_(T("/obj/item/clothing/under/rank/janitor"), this);
	yield* new_(T("/obj/item/weapon/cartridge/janitor"), this);
	yield* new_(T("/obj/item/clothing/gloves/color/black"), this);
	yield* new_(T("/obj/item/clothing/head/soft/purple"), this);
	yield* new_(T("/obj/item/weapon/paint/paint_remover"), this);
	yield* new_(T("/obj/item/weapon/melee/flyswatter"), this);
	yield* new_(T("/obj/item/device/flashlight"), this);
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/caution"), this);
	}
	rt.endFor(f, 0);
	yield* new_(T("/obj/item/weapon/holosign_creator"), this);
	yield* new_(T("/obj/item/device/lightreplacer"), this);
	yield* new_(T("/obj/item/weapon/soap"), this);
	yield* new_(T("/obj/item/weapon/storage/bag/trash"), this);
	yield* new_(T("/obj/item/clothing/shoes/galoshes"), this);
	yield* new_(T("/obj/item/weapon/watertank/janitor"), this);
	yield* new_(T("/obj/item/weapon/storage/belt/janitor"), this);
	return f.dot;
}, true);

rt.type(12312, "/obj/structure/closet/lawcloset", "/obj/structure/closet", {
	icon_door: "blue",
	name: "legal closet",
	desc: "It's a storage unit for courtroom apparel and items.",
});

// job_closets.dm:86
rt.def("/obj/structure/closet/lawcloset/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/item/clothing/under/lawyer/female"), this);
	yield* new_(T("/obj/item/clothing/under/lawyer/black"), this);
	yield* new_(T("/obj/item/clothing/under/lawyer/red"), this);
	yield* new_(T("/obj/item/clothing/under/lawyer/bluesuit"), this);
	yield* new_(T("/obj/item/clothing/suit/toggle/lawyer"), this);
	yield* new_(T("/obj/item/clothing/under/lawyer/purpsuit"), this);
	yield* new_(T("/obj/item/clothing/suit/toggle/lawyer/purple"), this);
	yield* new_(T("/obj/item/clothing/under/lawyer/blacksuit"), this);
	yield* new_(T("/obj/item/clothing/suit/toggle/lawyer/black"), this);
	yield* new_(T("/obj/item/clothing/shoes/laceup"), this);
	yield* new_(T("/obj/item/clothing/shoes/laceup"), this);
	yield* new_(T("/obj/item/clothing/accessory/lawyers_badge"), this);
	yield* new_(T("/obj/item/clothing/accessory/lawyers_badge"), this);
	return f.dot;
}, true);

rt.type(12314, "/obj/structure/closet/wardrobe/chaplain_black", "/obj/structure/closet/wardrobe", {
	icon_door: "black",
	name: "chapel wardrobe",
	desc: "It's a storage unit for Nanotrasen-approved religious attire.",
});

// job_closets.dm:107
rt.def("/obj/structure/closet/wardrobe/chaplain_black/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/clothing/under/rank/chaplain"), this);
	yield* new_(T("/obj/item/clothing/shoes/sneakers/black"), this);
	yield* new_(T("/obj/item/clothing/suit/nun"), this);
	yield* new_(T("/obj/item/clothing/head/nun_hood"), this);
	yield* new_(T("/obj/item/clothing/suit/studentuni"), this);
	yield* new_(T("/obj/item/clothing/head/cage"), this);
	yield* new_(T("/obj/item/clothing/suit/witchhunter"), this);
	yield* new_(T("/obj/item/clothing/head/witchunter_hat"), this);
	yield* new_(T("/obj/item/clothing/suit/hooded/chaplain_hoodie"), this);
	yield* new_(T("/obj/item/clothing/suit/holidaypriest"), this);
	yield* new_(T("/obj/item/weapon/storage/backpack/cultpack"), this);
	yield* new_(T("/obj/item/clothing/head/helmet/knight/templar"), this);
	yield* new_(T("/obj/item/clothing/suit/armor/riot/knight/templar"), this);
	yield* new_(T("/obj/item/weapon/storage/fancy/candle_box"), this);
	yield* new_(T("/obj/item/weapon/storage/fancy/candle_box"), this);
	return f.dot;
}, true);

rt.type(12315, "/obj/structure/closet/wardrobe/red", "/obj/structure/closet/wardrobe", {
	icon_door: "red",
	name: "security wardrobe",
});

// job_closets.dm:141
rt.def("/obj/structure/closet/wardrobe/red/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	yield* new_(T("/obj/item/clothing/suit/hooded/wintercoat/security"), this);
	yield* new_(T("/obj/item/weapon/storage/backpack/security"), this);
	yield* new_(T("/obj/item/weapon/storage/backpack/satchel/sec"), this);
	yield* new_(T("/obj/item/weapon/storage/backpack/duffelbag/sec"), this);
	yield* new_(T("/obj/item/weapon/storage/backpack/duffelbag/sec"), this);
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/under/rank/security"), this);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/shoes/jackboots"), this);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/head/beret/sec"), this);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/head/soft/sec"), this);
	}
	rt.endFor(f, 0);
	yield* new_(T("/obj/item/clothing/mask/bandana/red"), this);
	yield* new_(T("/obj/item/clothing/mask/bandana/red"), this);
	return f.dot;
}, true);

rt.type(12316, "/obj/structure/closet/wardrobe/cargotech", "/obj/structure/closet/wardrobe", {
	icon_door: "orange",
	name: "cargo wardrobe",
});

// job_closets.dm:164
rt.def("/obj/structure/closet/wardrobe/cargotech/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	yield* new_(T("/obj/item/clothing/suit/hooded/wintercoat/cargo"), this);
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/under/rank/cargotech"), this);
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
		yield* new_(T("/obj/item/clothing/gloves/fingerless"), this);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/head/soft"), this);
	}
	rt.endFor(f, 0);
	yield* new_(T("/obj/item/device/radio/headset/headset_cargo"), this);
	return f.dot;
}, true);

rt.type(12317, "/obj/structure/closet/wardrobe/atmospherics_yellow", "/obj/structure/closet/wardrobe", {
	icon_door: "atmos_wardrobe",
	name: "atmospherics wardrobe",
});

// job_closets.dm:180
rt.def("/obj/structure/closet/wardrobe/atmospherics_yellow/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	yield* new_(T("/obj/item/weapon/storage/backpack/duffelbag/engineering"), this);
	yield* new_(T("/obj/item/weapon/storage/backpack/satchel/eng"), this);
	yield* new_(T("/obj/item/weapon/storage/backpack/industrial"), this);
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/suit/hooded/wintercoat/engineering/atmos"), this);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/under/rank/atmospheric_technician"), this);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/shoes/sneakers/black"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(12318, "/obj/structure/closet/wardrobe/engineering_yellow", "/obj/structure/closet/wardrobe", {
	icon_door: "yellow",
	name: "engineering wardrobe",
});

// job_closets.dm:196
rt.def("/obj/structure/closet/wardrobe/engineering_yellow/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	yield* new_(T("/obj/item/weapon/storage/backpack/duffelbag/engineering"), this);
	yield* new_(T("/obj/item/weapon/storage/backpack/industrial"), this);
	yield* new_(T("/obj/item/weapon/storage/backpack/satchel/eng"), this);
	yield* new_(T("/obj/item/clothing/suit/hooded/wintercoat/engineering"), this);
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/under/rank/engineer"), this);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/suit/hazardvest"), this);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/shoes/workboots"), this);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/head/hardhat"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(12320, "/obj/structure/closet/wardrobe/white/medical", "/obj/structure/closet/wardrobe/white", {
	name: "medical doctor's wardrobe",
});

// job_closets.dm:214
rt.def("/obj/structure/closet/wardrobe/white/medical/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	yield* new_(T("/obj/item/weapon/storage/backpack/duffelbag/med"), this);
	yield* new_(T("/obj/item/weapon/storage/backpack/medic"), this);
	yield* new_(T("/obj/item/weapon/storage/backpack/satchel/med"), this);
	yield* new_(T("/obj/item/clothing/suit/hooded/wintercoat/medical"), this);
	yield* new_(T("/obj/item/clothing/under/rank/nursesuit"), this);
	yield* new_(T("/obj/item/clothing/head/nursehat"), this);
	yield* new_(T("/obj/item/clothing/under/rank/medical/blue"), this);
	yield* new_(T("/obj/item/clothing/under/rank/medical/green"), this);
	yield* new_(T("/obj/item/clothing/under/rank/medical/purple"), this);
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/under/rank/medical"), this);
	}
	rt.endFor(f, 0);
	yield* new_(T("/obj/item/clothing/suit/toggle/labcoat"), this);
	yield* new_(T("/obj/item/clothing/suit/toggle/labcoat"), this);
	yield* new_(T("/obj/item/clothing/suit/toggle/labcoat/emt"), this);
	yield* new_(T("/obj/item/clothing/suit/toggle/labcoat/emt"), this);
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
		yield* new_(T("/obj/item/clothing/head/soft/emt"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(12321, "/obj/structure/closet/wardrobe/robotics_black", "/obj/structure/closet/wardrobe", {
	icon_door: "black",
	name: "robotics wardrobe",
});

// job_closets.dm:240
rt.def("/obj/structure/closet/wardrobe/robotics_black/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/clothing/glasses/hud/diagnostic"), this);
	yield* new_(T("/obj/item/clothing/glasses/hud/diagnostic"), this);
	yield* new_(T("/obj/item/clothing/under/rank/roboticist"), this);
	yield* new_(T("/obj/item/clothing/under/rank/roboticist"), this);
	yield* new_(T("/obj/item/clothing/suit/toggle/labcoat"), this);
	yield* new_(T("/obj/item/clothing/suit/toggle/labcoat"), this);
	yield* new_(T("/obj/item/clothing/shoes/sneakers/black"), this);
	yield* new_(T("/obj/item/clothing/shoes/sneakers/black"), this);
	yield* new_(T("/obj/item/clothing/gloves/fingerless"), this);
	yield* new_(T("/obj/item/clothing/gloves/fingerless"), this);
	yield* new_(T("/obj/item/clothing/head/soft/black"), this);
	yield* new_(T("/obj/item/clothing/head/soft/black"), this);
	if (prob(40)) {
		yield* new_(T("/obj/item/clothing/mask/bandana/skull"), this);
	}
	if (prob(40)) {
		yield* new_(T("/obj/item/clothing/mask/bandana/skull"), this);
	}
	return f.dot;
}, true);

rt.type(12322, "/obj/structure/closet/wardrobe/chemistry_white", "/obj/structure/closet/wardrobe", {
	icon_door: "white",
	name: "chemistry wardrobe",
});

// job_closets.dm:264
rt.def("/obj/structure/closet/wardrobe/chemistry_white/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/clothing/under/rank/chemist"), this);
	yield* new_(T("/obj/item/clothing/under/rank/chemist"), this);
	yield* new_(T("/obj/item/clothing/shoes/sneakers/white"), this);
	yield* new_(T("/obj/item/clothing/shoes/sneakers/white"), this);
	yield* new_(T("/obj/item/clothing/suit/toggle/labcoat/chemist"), this);
	yield* new_(T("/obj/item/clothing/suit/toggle/labcoat/chemist"), this);
	yield* new_(T("/obj/item/weapon/storage/backpack/chemistry"), this);
	yield* new_(T("/obj/item/weapon/storage/backpack/chemistry"), this);
	yield* new_(T("/obj/item/weapon/storage/backpack/satchel/chem"), this);
	yield* new_(T("/obj/item/weapon/storage/backpack/satchel/chem"), this);
	yield* new_(T("/obj/item/weapon/storage/bag/chemistry"), this);
	yield* new_(T("/obj/item/weapon/storage/bag/chemistry"), this);
	return f.dot;
}, true);

rt.type(12323, "/obj/structure/closet/wardrobe/genetics_white", "/obj/structure/closet/wardrobe", {
	icon_door: "white",
	name: "genetics wardrobe",
});

// job_closets.dm:284
rt.def("/obj/structure/closet/wardrobe/genetics_white/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/clothing/under/rank/geneticist"), this);
	yield* new_(T("/obj/item/clothing/under/rank/geneticist"), this);
	yield* new_(T("/obj/item/clothing/shoes/sneakers/white"), this);
	yield* new_(T("/obj/item/clothing/shoes/sneakers/white"), this);
	yield* new_(T("/obj/item/clothing/suit/toggle/labcoat/genetics"), this);
	yield* new_(T("/obj/item/clothing/suit/toggle/labcoat/genetics"), this);
	yield* new_(T("/obj/item/weapon/storage/backpack/genetics"), this);
	yield* new_(T("/obj/item/weapon/storage/backpack/genetics"), this);
	yield* new_(T("/obj/item/weapon/storage/backpack/satchel/gen"), this);
	yield* new_(T("/obj/item/weapon/storage/backpack/satchel/gen"), this);
	return f.dot;
}, true);

rt.type(12324, "/obj/structure/closet/wardrobe/virology_white", "/obj/structure/closet/wardrobe", {
	icon_door: "white",
	name: "virology wardrobe",
});

// job_closets.dm:302
rt.def("/obj/structure/closet/wardrobe/virology_white/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/clothing/under/rank/virologist"), this);
	yield* new_(T("/obj/item/clothing/under/rank/virologist"), this);
	yield* new_(T("/obj/item/clothing/shoes/sneakers/white"), this);
	yield* new_(T("/obj/item/clothing/shoes/sneakers/white"), this);
	yield* new_(T("/obj/item/clothing/suit/toggle/labcoat/virologist"), this);
	yield* new_(T("/obj/item/clothing/suit/toggle/labcoat/virologist"), this);
	yield* new_(T("/obj/item/clothing/mask/surgical"), this);
	yield* new_(T("/obj/item/clothing/mask/surgical"), this);
	yield* new_(T("/obj/item/weapon/storage/backpack/virology"), this);
	yield* new_(T("/obj/item/weapon/storage/backpack/virology"), this);
	yield* new_(T("/obj/item/weapon/storage/backpack/satchel/vir"), this);
	yield* new_(T("/obj/item/weapon/storage/backpack/satchel/vir"), this);
	return f.dot;
}, true);

rt.type(12325, "/obj/structure/closet/wardrobe/science_white", "/obj/structure/closet/wardrobe", {
	icon_door: "white",
	name: "science wardrobe",
});

// job_closets.dm:321
rt.def("/obj/structure/closet/wardrobe/science_white/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	yield* new_(T("/obj/item/weapon/storage/backpack/science"), this);
	yield* new_(T("/obj/item/weapon/storage/backpack/science"), this);
	yield* new_(T("/obj/item/weapon/storage/backpack/satchel/tox"), this);
	yield* new_(T("/obj/item/weapon/storage/backpack/satchel/tox"), this);
	yield* new_(T("/obj/item/clothing/suit/hooded/wintercoat/science"), this);
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/under/rank/scientist"), this);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/suit/toggle/labcoat/science"), this);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/shoes/sneakers/white"), this);
	}
	rt.endFor(f, 0);
	yield* new_(T("/obj/item/device/radio/headset/headset_sci"), this);
	yield* new_(T("/obj/item/device/radio/headset/headset_sci"), this);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/mask/gas"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(12326, "/obj/structure/closet/wardrobe/botanist", "/obj/structure/closet/wardrobe", {
	icon_door: "green",
	name: "botanist wardrobe",
});

// job_closets.dm:343
rt.def("/obj/structure/closet/wardrobe/botanist/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	yield* new_(T("/obj/item/weapon/storage/backpack/botany"), this);
	yield* new_(T("/obj/item/weapon/storage/backpack/botany"), this);
	yield* new_(T("/obj/item/weapon/storage/backpack/satchel/hyd"), this);
	yield* new_(T("/obj/item/weapon/storage/backpack/satchel/hyd"), this);
	yield* new_(T("/obj/item/clothing/suit/hooded/wintercoat/hydro"), this);
	yield* new_(T("/obj/item/clothing/suit/apron"), this);
	yield* new_(T("/obj/item/clothing/suit/apron"), this);
	yield* new_(T("/obj/item/clothing/suit/apron/overalls"), this);
	yield* new_(T("/obj/item/clothing/suit/apron/overalls"), this);
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/under/rank/hydroponics"), this);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/mask/bandana"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(12327, "/obj/structure/closet/wardrobe/curator", "/obj/structure/closet/wardrobe", {
	icon_door: "black",
	name: "treasure hunting wardrobe",
});

// job_closets.dm:363
rt.def("/obj/structure/closet/wardrobe/curator/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/clothing/head/fedora/curator"), this);
	yield* new_(T("/obj/item/clothing/suit/curator"), this);
	yield* new_(T("/obj/item/clothing/under/rank/curator/treasure_hunter"), this);
	yield* new_(T("/obj/item/clothing/shoes/workboots/mining"), this);
	yield* new_(T("/obj/item/weapon/storage/backpack/satchel/explorer"), this);
	return f.dot;
}, true);
