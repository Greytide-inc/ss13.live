// Based on /tg/station's code/game/objects/items/weapons/storage/uplink_kits.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(5417, "/obj/item/weapon/storage/box/syndicate", "/obj/item/weapon/storage/box", {});

// uplink_kits.dm:4
rt.def("/obj/item/weapon/storage/box/syndicate/proc/PopulateContents", function* PopulateContents(f: Frame) {
	const pickweight_2 = pickweight(rt.alist(f, ["bloodyspai", 3, "stealth", 2, "bond", 2, "screwed", 2, "sabotage", 3, "guns", 2, "murder", 2, "implant", 1, "hacker", 3, "darklord", 1, "sniper", 1, "metaops", 1, "ninja", 1]));
	if (pickweight_2 === "bloodyspai") {
		yield* new_(T("/obj/item/clothing/under/chameleon"), this);
		yield* new_(T("/obj/item/clothing/mask/chameleon"), this);
		yield* new_(T("/obj/item/weapon/card/id/syndicate"), this);
		yield* new_(T("/obj/item/clothing/shoes/chameleon"), this);
		yield* new_(T("/obj/item/device/camera_bug"), this);
		yield* new_(T("/obj/item/device/multitool/ai_detect"), this);
		yield* new_(T("/obj/item/device/encryptionkey/syndicate"), this);
		yield* new_(T("/obj/item/weapon/reagent_containers/syringe/mulligan"), this);
		yield* new_(T("/obj/item/weapon/switchblade"), this);
		yield* new_(T("/obj/item/weapon/storage/fancy/cigarettes/cigpack_syndicate"), this);
		yield* new_(T("/obj/item/device/flashlight/emp"), this);
		yield* new_(T("/obj/item/device/chameleon"), this);
	} else if (pickweight_2 === "stealth") {
		yield* new_(T("/obj/item/weapon/gun/energy/kinetic_accelerator/crossbow"), this);
		yield* new_(T("/obj/item/weapon/pen/sleepy"), this);
		yield* new_(T("/obj/item/device/healthanalyzer/rad_laser"), this);
		yield* new_(T("/obj/item/device/chameleon"), this);
		yield* new_(T("/obj/item/weapon/soap/syndie"), this);
		yield* new_(T("/obj/item/clothing/glasses/thermal/syndi"), this);
	} else if (pickweight_2 === "bond") {
		yield* new_(T("/obj/item/weapon/gun/ballistic/automatic/pistol"), this);
		yield* new_(T("/obj/item/weapon/suppressor"), this);
		yield* new_(T("/obj/item/ammo_box/magazine/m10mm"), this);
		yield* new_(T("/obj/item/ammo_box/magazine/m10mm"), this);
		yield* new_(T("/obj/item/clothing/under/chameleon"), this);
		yield* new_(T("/obj/item/weapon/card/id/syndicate"), this);
		yield* new_(T("/obj/item/weapon/reagent_containers/syringe/stimulants"), this);
	} else if (pickweight_2 === "screwed") {
		yield* new_(T("/obj/item/device/sbeacondrop/bomb"), this);
		yield* new_(T("/obj/item/weapon/grenade/syndieminibomb"), this);
		yield* new_(T("/obj/item/device/sbeacondrop/powersink"), this);
		yield* new_(T("/obj/item/clothing/suit/space/syndicate/black/red"), this);
		yield* new_(T("/obj/item/clothing/head/helmet/space/syndicate/black/red"), this);
		yield* new_(T("/obj/item/device/encryptionkey/syndicate"), this);
	} else if (pickweight_2 === "guns") {
		yield* new_(T("/obj/item/weapon/gun/ballistic/revolver"), this);
		yield* new_(T("/obj/item/ammo_box/a357"), this);
		yield* new_(T("/obj/item/ammo_box/a357"), this);
		yield* new_(T("/obj/item/weapon/card/emag"), this);
		yield* new_(T("/obj/item/weapon/grenade/plastic/c4"), this);
		yield* new_(T("/obj/item/clothing/gloves/color/latex/nitrile"), this);
		yield* new_(T("/obj/item/clothing/mask/gas/clown_hat"), this);
		yield* new_(T("/obj/item/clothing/under/suit_jacket/really_black"), this);
	} else if (pickweight_2 === "murder") {
		yield* new_(T("/obj/item/weapon/melee/energy/sword/saber"), this);
		yield* new_(T("/obj/item/clothing/glasses/thermal/syndi"), this);
		yield* new_(T("/obj/item/weapon/card/emag"), this);
		yield* new_(T("/obj/item/clothing/shoes/chameleon"), this);
		yield* new_(T("/obj/item/device/encryptionkey/syndicate"), this);
		yield* new_(T("/obj/item/weapon/grenade/syndieminibomb"), this);
	} else if (pickweight_2 === "implant") {
		yield* new_(T("/obj/item/weapon/implanter/freedom"), this);
		yield* new_(T("/obj/item/weapon/implanter/uplink/precharged"), this);
		yield* new_(T("/obj/item/weapon/implanter/emp"), this);
		yield* new_(T("/obj/item/weapon/implanter/adrenalin"), this);
		yield* new_(T("/obj/item/weapon/implanter/explosive"), this);
		yield* new_(T("/obj/item/weapon/implanter/storage"), this);
	} else if (pickweight_2 === "hacker") {
		yield* new_(T("/obj/item/weapon/aiModule/syndicate"), this);
		yield* new_(T("/obj/item/weapon/card/emag"), this);
		yield* new_(T("/obj/item/device/encryptionkey/binary"), this);
		yield* new_(T("/obj/item/weapon/aiModule/toyAI"), this);
		yield* new_(T("/obj/item/device/multitool/ai_detect"), this);
	} else if (pickweight_2 === "lordsingulo") {
		yield* new_(T("/obj/item/device/sbeacondrop"), this);
		yield* new_(T("/obj/item/clothing/suit/space/syndicate/black/red"), this);
		yield* new_(T("/obj/item/clothing/head/helmet/space/syndicate/black/red"), this);
		yield* new_(T("/obj/item/weapon/card/emag"), this);
	} else if (pickweight_2 === "sabotage") {
		yield* new_(T("/obj/item/weapon/grenade/plastic/c4"), this);
		yield* new_(T("/obj/item/weapon/grenade/plastic/c4"), this);
		yield* new_(T("/obj/item/device/doorCharge"), this);
		yield* new_(T("/obj/item/device/doorCharge"), this);
		yield* new_(T("/obj/item/device/camera_bug"), this);
		yield* new_(T("/obj/item/device/sbeacondrop/powersink"), this);
		yield* new_(T("/obj/item/weapon/cartridge/virus/syndicate"), this);
		yield* new_(T("/obj/item/weapon/storage/toolbox/syndicate"), this);
		yield* new_(T("/obj/item/pizzabox/bomb"));
	} else if (pickweight_2 === "darklord") {
		yield* new_(T("/obj/item/weapon/twohanded/dualsaber"), this);
		yield* new_(T("/obj/item/weapon/dnainjector/telemut/darkbundle"), this);
		yield* new_(T("/obj/item/clothing/suit/hooded/chaplain_hoodie"), this);
		yield* new_(T("/obj/item/weapon/card/id/syndicate"), this);
		yield* new_(T("/obj/item/clothing/shoes/chameleon"), this);
		yield* new_(T("/obj/item/weapon/spellbook/oneuse/summonitem"), this);
	} else if (pickweight_2 === "sniper") {
		yield* new_(T("/obj/item/weapon/gun/ballistic/automatic/sniper_rifle"), this);
		yield* new_(T("/obj/item/ammo_box/magazine/sniper_rounds/penetrator"), this);
		yield* new_(T("/obj/item/clothing/glasses/thermal/syndi"), this);
		yield* new_(T("/obj/item/clothing/gloves/color/latex/nitrile"), this);
		yield* new_(T("/obj/item/clothing/mask/gas/clown_hat"), this);
		yield* new_(T("/obj/item/clothing/under/suit_jacket/really_black"), this);
	} else if (pickweight_2 === "metaops") {
		yield* new_(T("/obj/item/clothing/suit/space/hardsuit/syndi"), this);
		yield* new_(T("/obj/item/weapon/gun/ballistic/automatic/shotgun/bulldog/unrestricted"), this);
		yield* new_(T("/obj/item/weapon/implanter/explosive"), this);
		yield* new_(T("/obj/item/ammo_box/magazine/m12g/buckshot"), this);
		yield* new_(T("/obj/item/ammo_box/magazine/m12g/buckshot"), this);
		yield* new_(T("/obj/item/weapon/grenade/plastic/c4"), this);
		yield* new_(T("/obj/item/weapon/grenade/plastic/c4"), this);
		yield* new_(T("/obj/item/weapon/card/emag"), this);
	} else if (pickweight_2 === "ninja") {
		yield* new_(T("/obj/item/weapon/katana"), this);
		yield* new_(T("/obj/item/weapon/implanter/adrenalin"), this);
		yield* new_(T("/obj/item/weapon/throwing_star"), this);
		yield* new_(T("/obj/item/weapon/throwing_star"), this);
		yield* new_(T("/obj/item/weapon/throwing_star"), this);
		yield* new_(T("/obj/item/weapon/throwing_star"), this);
		yield* new_(T("/obj/item/weapon/throwing_star"), this);
		yield* new_(T("/obj/item/weapon/throwing_star"), this);
		yield* new_(T("/obj/item/weapon/storage/belt/chameleon"), this);
		yield* new_(T("/obj/item/weapon/card/id/syndicate"), this);
		yield* new_(T("/obj/item/device/chameleon"), this);
	}
	return f.dot;
}, true);

rt.type(5419, "/obj/item/weapon/storage/box/syndie_kit/imp_freedom", "/obj/item/weapon/storage/box/syndie_kit", {
	name: "boxed freedom implant (with injector)",
});

// uplink_kits.dm:143
rt.def("/obj/item/weapon/storage/box/syndie_kit/imp_freedom/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let O: Value = null;
	(O = (yield* new_(T("/obj/item/weapon/implanter"), this))).imp = (yield* new_(T("/obj/item/weapon/implant/freedom"), O));
	yield* O.update_icon();
	return f.dot;
}, true);

rt.type(5420, "/obj/item/weapon/storage/box/syndie_kit/imp_microbomb", "/obj/item/weapon/storage/box/syndie_kit", {
	name: "Microbomb Implant (with injector)",
});

// uplink_kits.dm:151
rt.def("/obj/item/weapon/storage/box/syndie_kit/imp_microbomb/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let O: Value = null;
	(O = (yield* new_(T("/obj/item/weapon/implanter"), this))).imp = (yield* new_(T("/obj/item/weapon/implant/explosive"), O));
	yield* O.update_icon();
	return f.dot;
}, true);

rt.type(5421, "/obj/item/weapon/storage/box/syndie_kit/imp_macrobomb", "/obj/item/weapon/storage/box/syndie_kit", {
	name: "Macrobomb Implant (with injector)",
});

// uplink_kits.dm:159
rt.def("/obj/item/weapon/storage/box/syndie_kit/imp_macrobomb/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let O: Value = null;
	(O = (yield* new_(T("/obj/item/weapon/implanter"), this))).imp = (yield* new_(T("/obj/item/weapon/implant/explosive/macro"), O));
	yield* O.update_icon();
	return f.dot;
}, true);

rt.type(5422, "/obj/item/weapon/storage/box/syndie_kit/imp_uplink", "/obj/item/weapon/storage/box/syndie_kit", {
	name: "boxed uplink implant (with injector)",
});

// uplink_kits.dm:167
rt.def("/obj/item/weapon/storage/box/syndie_kit/imp_uplink/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let O: Value = null;
	yield* parent_proc();
	(O = (yield* new_(T("/obj/item/weapon/implanter"), this))).imp = (yield* new_(T("/obj/item/weapon/implant/uplink"), O));
	yield* O.update_icon();
	return f.dot;
}, true);

rt.type(5423, "/obj/item/weapon/storage/box/syndie_kit/bioterror", "/obj/item/weapon/storage/box/syndie_kit", {
	name: "bioterror syringe box",
});

// uplink_kits.dm:176
rt.def("/obj/item/weapon/storage/box/syndie_kit/bioterror/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/reagent_containers/syringe/bioterror"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5424, "/obj/item/weapon/storage/box/syndie_kit/imp_adrenal", "/obj/item/weapon/storage/box/syndie_kit", {
	name: "boxed adrenal implant (with injector)",
});

// uplink_kits.dm:183
rt.def("/obj/item/weapon/storage/box/syndie_kit/imp_adrenal/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let O: Value = null;
	(O = (yield* new_(T("/obj/item/weapon/implanter"), this))).imp = (yield* new_(T("/obj/item/weapon/implant/adrenalin"), O));
	yield* O.update_icon();
	return f.dot;
}, true);

rt.type(5425, "/obj/item/weapon/storage/box/syndie_kit/imp_storage", "/obj/item/weapon/storage/box/syndie_kit", {
	name: "boxed storage implant (with injector)",
});

// uplink_kits.dm:191
rt.def("/obj/item/weapon/storage/box/syndie_kit/imp_storage/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/weapon/implanter/storage"), this);
	return f.dot;
}, true);

rt.type(5426, "/obj/item/weapon/storage/box/syndie_kit/space", "/obj/item/weapon/storage/box/syndie_kit", {
	name: "boxed space suit and helmet",
	max_w_class: 3,
	can_hold: null,
});

// uplink_kits.dm:195
rt.def("/obj/item/weapon/storage/box/syndie_kit/space/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.can_hold = list(T("/obj/item/clothing/suit/space/syndicate"), T("/obj/item/clothing/head/helmet/space/syndicate"));
	return f.dot;
});

// uplink_kits.dm:199
rt.def("/obj/item/weapon/storage/box/syndie_kit/space/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/clothing/suit/space/syndicate/black/red"), this);
	yield* new_(T("/obj/item/clothing/head/helmet/space/syndicate/black/red"), this);
	return f.dot;
}, true);

rt.type(5427, "/obj/item/weapon/storage/box/syndie_kit/emp", "/obj/item/weapon/storage/box/syndie_kit", {
	name: "boxed EMP kit",
});

// uplink_kits.dm:206
rt.def("/obj/item/weapon/storage/box/syndie_kit/emp/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/weapon/grenade/empgrenade"), this);
	yield* new_(T("/obj/item/weapon/grenade/empgrenade"), this);
	yield* new_(T("/obj/item/weapon/grenade/empgrenade"), this);
	yield* new_(T("/obj/item/weapon/grenade/empgrenade"), this);
	yield* new_(T("/obj/item/weapon/grenade/empgrenade"), this);
	yield* new_(T("/obj/item/weapon/implanter/emp"), this);
	return f.dot;
}, true);

rt.type(5428, "/obj/item/weapon/storage/box/syndie_kit/chemical", "/obj/item/weapon/storage/box/syndie_kit", {
	name: "boxed chemical kit",
	storage_slots: 14,
});

// uplink_kits.dm:218
rt.def("/obj/item/weapon/storage/box/syndie_kit/chemical/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/weapon/reagent_containers/glass/bottle/polonium"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/glass/bottle/venom"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/glass/bottle/neurotoxin2"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/glass/bottle/formaldehyde"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/glass/bottle/spewium"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/glass/bottle/cyanide"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/glass/bottle/histamine"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/glass/bottle/initropidril"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/glass/bottle/pancuronium"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/glass/bottle/sodium_thiopental"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/glass/bottle/coniine"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/glass/bottle/curare"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/glass/bottle/amanitin"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/syringe"), this);
	return f.dot;
}, true);

rt.type(5429, "/obj/item/weapon/storage/box/syndie_kit/nuke", "/obj/item/weapon/storage/box/syndie_kit", {
	name: "box",
});

// uplink_kits.dm:237
rt.def("/obj/item/weapon/storage/box/syndie_kit/nuke/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/weapon/screwdriver/nuke"), this);
	yield* new_(T("/obj/item/nuke_core_container"), this);
	yield* new_(T("/obj/item/weapon/paper/nuke_instructions"), this);
	return f.dot;
}, true);

rt.type(5430, "/obj/item/weapon/storage/box/syndie_kit/supermatter", "/obj/item/weapon/storage/box/syndie_kit", {
	name: "box",
});

// uplink_kits.dm:245
rt.def("/obj/item/weapon/storage/box/syndie_kit/supermatter/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/weapon/scalpel/supermatter"), this);
	yield* new_(T("/obj/item/weapon/hemostat/supermatter"), this);
	yield* new_(T("/obj/item/nuke_core_container/supermatter"), this);
	yield* new_(T("/obj/item/weapon/paper/supermatter_sliver_instructions"), this);
	return f.dot;
}, true);

rt.type(5431, "/obj/item/weapon/storage/box/syndie_kit/tuberculosisgrenade", "/obj/item/weapon/storage/box/syndie_kit", {
	name: "boxed virus grenade kit",
});

// uplink_kits.dm:254
rt.def("/obj/item/weapon/storage/box/syndie_kit/tuberculosisgrenade/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	yield* new_(T("/obj/item/weapon/grenade/chem_grenade/tuberculosis"), this);
	rt.forRange(f, 0, 1, 5, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/reagent_containers/hypospray/medipen/tuberculosiscure"), this);
	}
	rt.endFor(f, 0);
	yield* new_(T("/obj/item/weapon/reagent_containers/syringe"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/glass/bottle/tuberculosiscure"), this);
	return f.dot;
}, true);

rt.type(5432, "/obj/item/weapon/storage/box/syndie_kit/chameleon", "/obj/item/weapon/storage/box/syndie_kit", {
	name: "chameleon kit",
});

// uplink_kits.dm:264
rt.def("/obj/item/weapon/storage/box/syndie_kit/chameleon/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/clothing/under/chameleon"), this);
	yield* new_(T("/obj/item/clothing/suit/chameleon"), this);
	yield* new_(T("/obj/item/clothing/gloves/chameleon"), this);
	yield* new_(T("/obj/item/clothing/shoes/chameleon"), this);
	yield* new_(T("/obj/item/clothing/glasses/chameleon"), this);
	yield* new_(T("/obj/item/clothing/head/chameleon"), this);
	yield* new_(T("/obj/item/clothing/mask/chameleon"), this);
	yield* new_(T("/obj/item/weapon/storage/backpack/chameleon"), this);
	yield* new_(T("/obj/item/device/radio/headset/chameleon"), this);
	yield* new_(T("/obj/item/weapon/stamp/chameleon"), this);
	yield* new_(T("/obj/item/device/pda/chameleon"), this);
	yield* new_(T("/obj/item/weapon/gun/energy/laser/chameleon"), this);
	return f.dot;
}, true);

rt.type(5433, "/obj/item/weapon/storage/box/syndie_kit/throwing_weapons", "/obj/item/weapon/storage/box/syndie_kit", {});

// uplink_kits.dm:280
rt.def("/obj/item/weapon/storage/box/syndie_kit/throwing_weapons/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/weapon/throwing_star"), this);
	yield* new_(T("/obj/item/weapon/throwing_star"), this);
	yield* new_(T("/obj/item/weapon/throwing_star"), this);
	yield* new_(T("/obj/item/weapon/throwing_star"), this);
	yield* new_(T("/obj/item/weapon/throwing_star"), this);
	yield* new_(T("/obj/item/weapon/restraints/legcuffs/bola/tactical"), this);
	yield* new_(T("/obj/item/weapon/restraints/legcuffs/bola/tactical"), this);
	return f.dot;
}, true);

rt.type(5434, "/obj/item/weapon/storage/box/syndie_kit/cutouts", "/obj/item/weapon/storage/box/syndie_kit", {});

// uplink_kits.dm:289
rt.def("/obj/item/weapon/storage/box/syndie_kit/cutouts/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/cardboard_cutout/adaptive"), this);
	}
	rt.endFor(f, 0);
	yield* new_(T("/obj/item/toy/crayon/rainbow"), this);
	return f.dot;
}, true);

rt.type(5435, "/obj/item/weapon/storage/box/syndie_kit/romerol", "/obj/item/weapon/storage/box/syndie_kit", {});

// uplink_kits.dm:294
rt.def("/obj/item/weapon/storage/box/syndie_kit/romerol/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/weapon/reagent_containers/glass/bottle/romerol"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/syringe"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/dropper"), this);
	return f.dot;
}, true);

rt.type(5436, "/obj/item/weapon/storage/box/syndie_kit/ez_clean", "/obj/item/weapon/storage/box/syndie_kit", {});

// uplink_kits.dm:299
rt.def("/obj/item/weapon/storage/box/syndie_kit/ez_clean/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/grenade/chem_grenade/ez_clean"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5395, "/obj/item/weapon/storage/box/hug/reverse_revolver", "/obj/item/weapon/storage/box/hug", {});

// uplink_kits.dm:303
rt.def("/obj/item/weapon/storage/box/hug/reverse_revolver/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/weapon/gun/ballistic/revolver/reverse"), this);
	return f.dot;
}, true);

rt.type(5437, "/obj/item/weapon/storage/box/syndie_kit/mimery", "/obj/item/weapon/storage/box/syndie_kit", {});

// uplink_kits.dm:306
rt.def("/obj/item/weapon/storage/box/syndie_kit/mimery/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/weapon/spellbook/oneuse/mimery_blockade"), this);
	yield* new_(T("/obj/item/weapon/spellbook/oneuse/mimery_guns"), this);
	return f.dot;
}, true);
