// From code/game/objects/items/weapons/storage/uplink_kits.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5417, "/obj/item/weapon/storage/box/syndicate", "/obj/item/weapon/storage/box", {});

// /obj/item/weapon/storage/box/syndicate/proc/PopulateContents  (code/game/objects/items/weapons/storage/uplink_kits.dm:4)  may sleep
rt.def("/obj/item/weapon/storage/box/syndicate/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.call(f, P("/proc/pickweight"), null, [rt.alist(f, ["bloodyspai", 3, "stealth", 2, "bond", 2, "screwed", 2, "sabotage", 3, "guns", 2, "murder", 2, "implant", 1, "hacker", 3, "darklord", 1, "sniper", 1, "metaops", 1, "ninja", 1])]));
	if ($0 === "bloodyspai") {
		yield* g.new_(f, T("/obj/item/clothing/under/chameleon"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/clothing/mask/chameleon"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/card/id/syndicate"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/clothing/shoes/chameleon"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/device/camera_bug"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/device/multitool/ai_detect"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/device/encryptionkey/syndicate"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/syringe/mulligan"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/switchblade"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/storage/fancy/cigarettes/cigpack_syndicate"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/device/flashlight/emp"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/device/chameleon"), [live(f.src)]);
	} else if ($0 === "stealth") {
		yield* g.new_(f, T("/obj/item/weapon/gun/energy/kinetic_accelerator/crossbow"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/pen/sleepy"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/device/healthanalyzer/rad_laser"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/device/chameleon"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/soap/syndie"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/clothing/glasses/thermal/syndi"), [live(f.src)]);
	} else if ($0 === "bond") {
		yield* g.new_(f, T("/obj/item/weapon/gun/ballistic/automatic/pistol"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/suppressor"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/ammo_box/magazine/m10mm"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/ammo_box/magazine/m10mm"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/clothing/under/chameleon"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/card/id/syndicate"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/syringe/stimulants"), [live(f.src)]);
	} else if ($0 === "screwed") {
		yield* g.new_(f, T("/obj/item/device/sbeacondrop/bomb"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/grenade/syndieminibomb"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/device/sbeacondrop/powersink"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/clothing/suit/space/syndicate/black/red"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/clothing/head/helmet/space/syndicate/black/red"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/device/encryptionkey/syndicate"), [live(f.src)]);
	} else if ($0 === "guns") {
		yield* g.new_(f, T("/obj/item/weapon/gun/ballistic/revolver"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/ammo_box/a357"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/ammo_box/a357"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/card/emag"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/grenade/plastic/c4"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/clothing/gloves/color/latex/nitrile"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/clothing/mask/gas/clown_hat"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/clothing/under/suit_jacket/really_black"), [live(f.src)]);
	} else if ($0 === "murder") {
		yield* g.new_(f, T("/obj/item/weapon/melee/energy/sword/saber"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/clothing/glasses/thermal/syndi"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/card/emag"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/clothing/shoes/chameleon"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/device/encryptionkey/syndicate"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/grenade/syndieminibomb"), [live(f.src)]);
	} else if ($0 === "implant") {
		yield* g.new_(f, T("/obj/item/weapon/implanter/freedom"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/implanter/uplink/precharged"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/implanter/emp"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/implanter/adrenalin"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/implanter/explosive"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/implanter/storage"), [live(f.src)]);
	} else if ($0 === "hacker") {
		yield* g.new_(f, T("/obj/item/weapon/aiModule/syndicate"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/card/emag"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/device/encryptionkey/binary"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/aiModule/toyAI"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/device/multitool/ai_detect"), [live(f.src)]);
	} else if ($0 === "lordsingulo") {
		yield* g.new_(f, T("/obj/item/device/sbeacondrop"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/clothing/suit/space/syndicate/black/red"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/clothing/head/helmet/space/syndicate/black/red"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/card/emag"), [live(f.src)]);
	} else if ($0 === "sabotage") {
		yield* g.new_(f, T("/obj/item/weapon/grenade/plastic/c4"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/grenade/plastic/c4"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/device/doorCharge"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/device/doorCharge"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/device/camera_bug"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/device/sbeacondrop/powersink"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/cartridge/virus/syndicate"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/storage/toolbox/syndicate"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/pizzabox/bomb"), []);
	} else if ($0 === "darklord") {
		yield* g.new_(f, T("/obj/item/weapon/twohanded/dualsaber"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/dnainjector/telemut/darkbundle"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/clothing/suit/hooded/chaplain_hoodie"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/card/id/syndicate"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/clothing/shoes/chameleon"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/spellbook/oneuse/summonitem"), [live(f.src)]);
	} else if ($0 === "sniper") {
		yield* g.new_(f, T("/obj/item/weapon/gun/ballistic/automatic/sniper_rifle"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/ammo_box/magazine/sniper_rounds/penetrator"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/clothing/glasses/thermal/syndi"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/clothing/gloves/color/latex/nitrile"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/clothing/mask/gas/clown_hat"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/clothing/under/suit_jacket/really_black"), [live(f.src)]);
	} else if ($0 === "metaops") {
		yield* g.new_(f, T("/obj/item/clothing/suit/space/hardsuit/syndi"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/gun/ballistic/automatic/shotgun/bulldog/unrestricted"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/implanter/explosive"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/ammo_box/magazine/m12g/buckshot"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/ammo_box/magazine/m12g/buckshot"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/grenade/plastic/c4"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/grenade/plastic/c4"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/card/emag"), [live(f.src)]);
	} else if ($0 === "ninja") {
		yield* g.new_(f, T("/obj/item/weapon/katana"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/implanter/adrenalin"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/throwing_star"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/throwing_star"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/throwing_star"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/throwing_star"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/throwing_star"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/throwing_star"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/storage/belt/chameleon"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/card/id/syndicate"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/device/chameleon"), [live(f.src)]);
	}
	return f.dot;
}, true);

rt.type(5419, "/obj/item/weapon/storage/box/syndie_kit/imp_freedom", "/obj/item/weapon/storage/box/syndie_kit", {
	name: "boxed freedom implant (with injector)",
});

// /obj/item/weapon/storage/box/syndie_kit/imp_freedom/proc/PopulateContents  (code/game/objects/items/weapons/storage/uplink_kits.dm:143)  may sleep
rt.def("/obj/item/weapon/storage/box/syndie_kit/imp_freedom/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let O: Value = null;
	f.vars = () => [O];
	rt.setFv(f, "imp", (O = (yield* g.new_(f, T("/obj/item/weapon/implanter"), [live(f.src)]))), (yield* g.new_(f, T("/obj/item/weapon/implant/freedom"), [live(O)])));
	yield* g.callName(f, live(O), "update_icon", []);
	return f.dot;
}, true);

rt.type(5420, "/obj/item/weapon/storage/box/syndie_kit/imp_microbomb", "/obj/item/weapon/storage/box/syndie_kit", {
	name: "Microbomb Implant (with injector)",
});

// /obj/item/weapon/storage/box/syndie_kit/imp_microbomb/proc/PopulateContents  (code/game/objects/items/weapons/storage/uplink_kits.dm:151)  may sleep
rt.def("/obj/item/weapon/storage/box/syndie_kit/imp_microbomb/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let O: Value = null;
	f.vars = () => [O];
	rt.setFv(f, "imp", (O = (yield* g.new_(f, T("/obj/item/weapon/implanter"), [live(f.src)]))), (yield* g.new_(f, T("/obj/item/weapon/implant/explosive"), [live(O)])));
	yield* g.callName(f, live(O), "update_icon", []);
	return f.dot;
}, true);

rt.type(5421, "/obj/item/weapon/storage/box/syndie_kit/imp_macrobomb", "/obj/item/weapon/storage/box/syndie_kit", {
	name: "Macrobomb Implant (with injector)",
});

// /obj/item/weapon/storage/box/syndie_kit/imp_macrobomb/proc/PopulateContents  (code/game/objects/items/weapons/storage/uplink_kits.dm:159)  may sleep
rt.def("/obj/item/weapon/storage/box/syndie_kit/imp_macrobomb/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let O: Value = null;
	f.vars = () => [O];
	rt.setFv(f, "imp", (O = (yield* g.new_(f, T("/obj/item/weapon/implanter"), [live(f.src)]))), (yield* g.new_(f, T("/obj/item/weapon/implant/explosive/macro"), [live(O)])));
	yield* g.callName(f, live(O), "update_icon", []);
	return f.dot;
}, true);

rt.type(5422, "/obj/item/weapon/storage/box/syndie_kit/imp_uplink", "/obj/item/weapon/storage/box/syndie_kit", {
	name: "boxed uplink implant (with injector)",
});

// /obj/item/weapon/storage/box/syndie_kit/imp_uplink/proc/PopulateContents  (code/game/objects/items/weapons/storage/uplink_kits.dm:167)  may sleep
rt.def("/obj/item/weapon/storage/box/syndie_kit/imp_uplink/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let O: Value = null;
	f.vars = () => [O];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setFv(f, "imp", (O = (yield* g.new_(f, T("/obj/item/weapon/implanter"), [live(f.src)]))), (yield* g.new_(f, T("/obj/item/weapon/implant/uplink"), [live(O)])));
	yield* g.callName(f, live(O), "update_icon", []);
	return f.dot;
}, true);

rt.type(5423, "/obj/item/weapon/storage/box/syndie_kit/bioterror", "/obj/item/weapon/storage/box/syndie_kit", {
	name: "bioterror syringe box",
});

// /obj/item/weapon/storage/box/syndie_kit/bioterror/proc/PopulateContents  (code/game/objects/items/weapons/storage/uplink_kits.dm:176)  may sleep
rt.def("/obj/item/weapon/storage/box/syndie_kit/bioterror/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/syringe/bioterror"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5424, "/obj/item/weapon/storage/box/syndie_kit/imp_adrenal", "/obj/item/weapon/storage/box/syndie_kit", {
	name: "boxed adrenal implant (with injector)",
});

// /obj/item/weapon/storage/box/syndie_kit/imp_adrenal/proc/PopulateContents  (code/game/objects/items/weapons/storage/uplink_kits.dm:183)  may sleep
rt.def("/obj/item/weapon/storage/box/syndie_kit/imp_adrenal/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let O: Value = null;
	f.vars = () => [O];
	rt.setFv(f, "imp", (O = (yield* g.new_(f, T("/obj/item/weapon/implanter"), [live(f.src)]))), (yield* g.new_(f, T("/obj/item/weapon/implant/adrenalin"), [live(O)])));
	yield* g.callName(f, live(O), "update_icon", []);
	return f.dot;
}, true);

rt.type(5425, "/obj/item/weapon/storage/box/syndie_kit/imp_storage", "/obj/item/weapon/storage/box/syndie_kit", {
	name: "boxed storage implant (with injector)",
});

// /obj/item/weapon/storage/box/syndie_kit/imp_storage/proc/PopulateContents  (code/game/objects/items/weapons/storage/uplink_kits.dm:191)  may sleep
rt.def("/obj/item/weapon/storage/box/syndie_kit/imp_storage/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/weapon/implanter/storage"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5426, "/obj/item/weapon/storage/box/syndie_kit/space", "/obj/item/weapon/storage/box/syndie_kit", {
	name: "boxed space suit and helmet",
	max_w_class: 3,
	can_hold: null,
});

// /obj/item/weapon/storage/box/syndie_kit/space/proc/<init>  (code/game/objects/items/weapons/storage/uplink_kits.dm:195)
rt.def("/obj/item/weapon/storage/box/syndie_kit/space/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "can_hold", rt.list(T("/obj/item/clothing/suit/space/syndicate"), T("/obj/item/clothing/head/helmet/space/syndicate")));
	return f.dot;
});

// /obj/item/weapon/storage/box/syndie_kit/space/proc/PopulateContents  (code/game/objects/items/weapons/storage/uplink_kits.dm:199)  may sleep
rt.def("/obj/item/weapon/storage/box/syndie_kit/space/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/clothing/suit/space/syndicate/black/red"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/head/helmet/space/syndicate/black/red"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5427, "/obj/item/weapon/storage/box/syndie_kit/emp", "/obj/item/weapon/storage/box/syndie_kit", {
	name: "boxed EMP kit",
});

// /obj/item/weapon/storage/box/syndie_kit/emp/proc/PopulateContents  (code/game/objects/items/weapons/storage/uplink_kits.dm:206)  may sleep
rt.def("/obj/item/weapon/storage/box/syndie_kit/emp/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/weapon/grenade/empgrenade"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/grenade/empgrenade"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/grenade/empgrenade"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/grenade/empgrenade"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/grenade/empgrenade"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/implanter/emp"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5428, "/obj/item/weapon/storage/box/syndie_kit/chemical", "/obj/item/weapon/storage/box/syndie_kit", {
	name: "boxed chemical kit",
	storage_slots: 14,
});

// /obj/item/weapon/storage/box/syndie_kit/chemical/proc/PopulateContents  (code/game/objects/items/weapons/storage/uplink_kits.dm:218)  may sleep
rt.def("/obj/item/weapon/storage/box/syndie_kit/chemical/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/bottle/polonium"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/bottle/venom"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/bottle/neurotoxin2"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/bottle/formaldehyde"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/bottle/spewium"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/bottle/cyanide"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/bottle/histamine"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/bottle/initropidril"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/bottle/pancuronium"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/bottle/sodium_thiopental"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/bottle/coniine"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/bottle/curare"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/bottle/amanitin"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/syringe"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5429, "/obj/item/weapon/storage/box/syndie_kit/nuke", "/obj/item/weapon/storage/box/syndie_kit", {
	name: "box",
});

// /obj/item/weapon/storage/box/syndie_kit/nuke/proc/PopulateContents  (code/game/objects/items/weapons/storage/uplink_kits.dm:237)  may sleep
rt.def("/obj/item/weapon/storage/box/syndie_kit/nuke/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/weapon/screwdriver/nuke"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/nuke_core_container"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/paper/nuke_instructions"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5430, "/obj/item/weapon/storage/box/syndie_kit/supermatter", "/obj/item/weapon/storage/box/syndie_kit", {
	name: "box",
});

// /obj/item/weapon/storage/box/syndie_kit/supermatter/proc/PopulateContents  (code/game/objects/items/weapons/storage/uplink_kits.dm:245)  may sleep
rt.def("/obj/item/weapon/storage/box/syndie_kit/supermatter/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/weapon/scalpel/supermatter"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/hemostat/supermatter"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/nuke_core_container/supermatter"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/paper/supermatter_sliver_instructions"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5431, "/obj/item/weapon/storage/box/syndie_kit/tuberculosisgrenade", "/obj/item/weapon/storage/box/syndie_kit", {
	name: "boxed virus grenade kit",
});

// /obj/item/weapon/storage/box/syndie_kit/tuberculosisgrenade/proc/PopulateContents  (code/game/objects/items/weapons/storage/uplink_kits.dm:254)  may sleep
rt.def("/obj/item/weapon/storage/box/syndie_kit/tuberculosisgrenade/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	yield* g.new_(f, T("/obj/item/weapon/grenade/chem_grenade/tuberculosis"), [live(f.src)]);
	i = null;
	rt.forRange(f, 0, 1, 5, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/hypospray/medipen/tuberculosiscure"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/syringe"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/bottle/tuberculosiscure"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5432, "/obj/item/weapon/storage/box/syndie_kit/chameleon", "/obj/item/weapon/storage/box/syndie_kit", {
	name: "chameleon kit",
});

// /obj/item/weapon/storage/box/syndie_kit/chameleon/proc/PopulateContents  (code/game/objects/items/weapons/storage/uplink_kits.dm:264)  may sleep
rt.def("/obj/item/weapon/storage/box/syndie_kit/chameleon/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/clothing/under/chameleon"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/chameleon"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/gloves/chameleon"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/shoes/chameleon"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/glasses/chameleon"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/head/chameleon"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/mask/chameleon"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/backpack/chameleon"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/radio/headset/chameleon"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/stamp/chameleon"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/pda/chameleon"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/gun/energy/laser/chameleon"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5433, "/obj/item/weapon/storage/box/syndie_kit/throwing_weapons", "/obj/item/weapon/storage/box/syndie_kit", {});

// /obj/item/weapon/storage/box/syndie_kit/throwing_weapons/proc/PopulateContents  (code/game/objects/items/weapons/storage/uplink_kits.dm:280)  may sleep
rt.def("/obj/item/weapon/storage/box/syndie_kit/throwing_weapons/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/weapon/throwing_star"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/throwing_star"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/throwing_star"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/throwing_star"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/throwing_star"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/restraints/legcuffs/bola/tactical"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/restraints/legcuffs/bola/tactical"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5434, "/obj/item/weapon/storage/box/syndie_kit/cutouts", "/obj/item/weapon/storage/box/syndie_kit", {});

// /obj/item/weapon/storage/box/syndie_kit/cutouts/proc/PopulateContents  (code/game/objects/items/weapons/storage/uplink_kits.dm:289)  may sleep
rt.def("/obj/item/weapon/storage/box/syndie_kit/cutouts/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/cardboard_cutout/adaptive"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	yield* g.new_(f, T("/obj/item/toy/crayon/rainbow"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5435, "/obj/item/weapon/storage/box/syndie_kit/romerol", "/obj/item/weapon/storage/box/syndie_kit", {});

// /obj/item/weapon/storage/box/syndie_kit/romerol/proc/PopulateContents  (code/game/objects/items/weapons/storage/uplink_kits.dm:294)  may sleep
rt.def("/obj/item/weapon/storage/box/syndie_kit/romerol/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/bottle/romerol"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/syringe"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/dropper"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5436, "/obj/item/weapon/storage/box/syndie_kit/ez_clean", "/obj/item/weapon/storage/box/syndie_kit", {});

// /obj/item/weapon/storage/box/syndie_kit/ez_clean/proc/PopulateContents  (code/game/objects/items/weapons/storage/uplink_kits.dm:299)  may sleep
rt.def("/obj/item/weapon/storage/box/syndie_kit/ez_clean/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/grenade/chem_grenade/ez_clean"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5395, "/obj/item/weapon/storage/box/hug/reverse_revolver", "/obj/item/weapon/storage/box/hug", {});

// /obj/item/weapon/storage/box/hug/reverse_revolver/proc/PopulateContents  (code/game/objects/items/weapons/storage/uplink_kits.dm:303)  may sleep
rt.def("/obj/item/weapon/storage/box/hug/reverse_revolver/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/weapon/gun/ballistic/revolver/reverse"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5437, "/obj/item/weapon/storage/box/syndie_kit/mimery", "/obj/item/weapon/storage/box/syndie_kit", {});

// /obj/item/weapon/storage/box/syndie_kit/mimery/proc/PopulateContents  (code/game/objects/items/weapons/storage/uplink_kits.dm:306)  may sleep
rt.def("/obj/item/weapon/storage/box/syndie_kit/mimery/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/weapon/spellbook/oneuse/mimery_blockade"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/spellbook/oneuse/mimery_guns"), [live(f.src)]);
	return f.dot;
}, true);
