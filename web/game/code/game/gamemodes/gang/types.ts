// Types declared in code/game/gamemodes/gang that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";

rt.type(1253, "/datum/gang_item/clothing", "/datum/gang_item", {
	category: "Purchase Influence-Enhancing Clothes:",
});
rt.type(1256, "/datum/gang_item/clothing/hat", "/datum/gang_item/clothing", {
	name: "Pimp Hat",
	id: "hat",
	cost: 16,
	item_path: rt.typePath("/obj/item/clothing/head/collectable/petehat/gang"),
});
rt.type(1257, "/datum/gang_item/clothing/mask", "/datum/gang_item/clothing", {
	name: "Golden Death Mask",
	id: "mask",
	cost: 18,
	item_path: rt.typePath("/obj/item/clothing/mask/gskull"),
});
rt.type(1258, "/datum/gang_item/clothing/shoes", "/datum/gang_item/clothing", {
	name: "Bling Boots",
	id: "boots",
	cost: 22,
	item_path: rt.typePath("/obj/item/clothing/shoes/gang"),
});
rt.type(1259, "/datum/gang_item/clothing/neck", "/datum/gang_item/clothing", {
	name: "Gold Necklace",
	id: "necklace",
	cost: 9,
	item_path: rt.typePath("/obj/item/clothing/neck/necklace/dope"),
});
rt.type(1260, "/datum/gang_item/clothing/hands", "/datum/gang_item/clothing", {
	name: "Decorative Brass Knuckles",
	id: "hand",
	cost: 11,
	item_path: rt.typePath("/obj/item/clothing/gloves/gang"),
});
rt.type(1261, "/datum/gang_item/clothing/belt", "/datum/gang_item/clothing", {
	name: "Badass Belt",
	id: "belt",
	cost: 13,
	item_path: rt.typePath("/obj/item/weapon/storage/belt/military/gang"),
});
rt.type(1262, "/datum/gang_item/weapon", "/datum/gang_item", {
	category: "Purchase Weapons:",
});
rt.type(1264, "/datum/gang_item/weapon/ammo/surplus_ammo", "/datum/gang_item/weapon/ammo", {
	name: "Surplus Rifle Ammo",
	id: "surplus_ammo",
	cost: 5,
	item_path: rt.typePath("/obj/item/ammo_box/magazine/m10mm/rifle"),
});
rt.type(1265, "/datum/gang_item/weapon/ammo/improvised_ammo", "/datum/gang_item/weapon/ammo", {
	name: "Box of Buckshot",
	id: "buckshot",
	cost: 5,
	item_path: rt.typePath("/obj/item/weapon/storage/box/lethalshot"),
});
rt.type(1266, "/datum/gang_item/weapon/ammo/pistol_ammo", "/datum/gang_item/weapon/ammo", {
	name: "10mm Ammo",
	id: "pistol_ammo",
	cost: 10,
	item_path: rt.typePath("/obj/item/ammo_box/magazine/m10mm"),
});
rt.type(1267, "/datum/gang_item/weapon/ammo/sniper_ammo", "/datum/gang_item/weapon/ammo", {
	name: "Smuggled .50cal Sniper Rounds",
	id: "sniper_ammo",
	cost: 15,
	item_path: rt.typePath("/obj/item/ammo_box/magazine/sniper_rounds/gang"),
});
rt.type(1268, "/datum/gang_item/weapon/ammo/sleeper_ammo", "/datum/gang_item/weapon/ammo", {
	name: "Illicit Tranquilizer Cartridges",
	id: "sniper_ammo",
	cost: 15,
	item_path: rt.typePath("/obj/item/ammo_box/magazine/sniper_rounds/gang/sleeper"),
});
rt.type(1269, "/datum/gang_item/weapon/ammo/uzi_ammo", "/datum/gang_item/weapon/ammo", {
	name: "Uzi Ammo",
	id: "uzi_ammo",
	cost: 40,
	item_path: rt.typePath("/obj/item/ammo_box/magazine/uzim9mm"),
});
rt.type(1270, "/datum/gang_item/weapon/shuriken", "/datum/gang_item/weapon", {
	name: "Shuriken",
	id: "shuriken",
	cost: 3,
	item_path: rt.typePath("/obj/item/weapon/throwing_star"),
});
rt.type(1271, "/datum/gang_item/weapon/switchblade", "/datum/gang_item/weapon", {
	name: "Switchblade",
	id: "switchblade",
	cost: 5,
	item_path: rt.typePath("/obj/item/weapon/switchblade"),
});
rt.type(1272, "/datum/gang_item/weapon/surplus", "/datum/gang_item/weapon", {
	name: "Surplus Rifle",
	id: "surplus",
	cost: 8,
	item_path: rt.typePath("/obj/item/weapon/gun/ballistic/automatic/surplus"),
});
rt.type(1273, "/datum/gang_item/weapon/improvised", "/datum/gang_item/weapon", {
	name: "Sawn-Off Improvised Shotgun",
	id: "sawn",
	cost: 6,
	item_path: rt.typePath("/obj/item/weapon/gun/ballistic/revolver/doublebarrel/improvised/sawn"),
});
rt.type(1274, "/datum/gang_item/weapon/pistol", "/datum/gang_item/weapon", {
	name: "10mm Pistol",
	id: "pistol",
	cost: 30,
	item_path: rt.typePath("/obj/item/weapon/gun/ballistic/automatic/pistol"),
});
rt.type(1275, "/datum/gang_item/weapon/sniper", "/datum/gang_item/weapon", {
	name: "Black Market .50cal Sniper Rifle",
	id: "sniper",
	cost: 40,
	item_path: rt.typePath("/obj/item/weapon/gun/ballistic/automatic/sniper_rifle/gang"),
});
rt.type(1276, "/datum/gang_item/weapon/machinegun", "/datum/gang_item/weapon", {
	name: "Mounted Machine Gun",
	id: "MG",
	cost: 50,
	spawn_msg: "<span class='notice'>The mounted machine gun features enhanced responsiveness. Hold down on the trigger while firing to control where you're shooting.</span>",
	item_path: rt.typePath("/obj/machinery/manned_turret"),
});
rt.type(1277, "/datum/gang_item/weapon/uzi", "/datum/gang_item/weapon", {
	name: "Uzi SMG",
	id: "uzi",
	cost: 60,
	item_path: rt.typePath("/obj/item/weapon/gun/ballistic/automatic/mini_uzi"),
});
rt.type(1278, "/datum/gang_item/equipment", "/datum/gang_item", {
	category: "Purchase Equipment:",
});
rt.type(1279, "/datum/gang_item/equipment/spraycan", "/datum/gang_item/equipment", {
	name: "Territory Spraycan",
	id: "spraycan",
	cost: 5,
	item_path: rt.typePath("/obj/item/toy/crayon/spraycan/gang"),
});
rt.type(1280, "/datum/gang_item/equipment/sharpener", "/datum/gang_item/equipment", {
	name: "Sharpener",
	id: "whetstone",
	cost: 3,
	item_path: rt.typePath("/obj/item/weapon/sharpener"),
});
rt.type(1281, "/datum/gang_item/equipment/emp", "/datum/gang_item/equipment", {
	name: "EMP Grenade",
	id: "EMP",
	cost: 5,
	item_path: rt.typePath("/obj/item/weapon/grenade/empgrenade"),
});
rt.type(1282, "/datum/gang_item/equipment/c4", "/datum/gang_item/equipment", {
	name: "C4 Explosive",
	id: "c4",
	cost: 7,
	item_path: rt.typePath("/obj/item/weapon/grenade/plastic/c4"),
});
rt.type(1283, "/datum/gang_item/equipment/frag", "/datum/gang_item/equipment", {
	name: "Fragmentation Grenade",
	id: "frag nade",
	cost: 18,
	item_path: rt.typePath("/obj/item/weapon/grenade/syndieminibomb/concussion/frag"),
});
rt.type(1284, "/datum/gang_item/equipment/stimpack", "/datum/gang_item/equipment", {
	name: "Black Market Stimulants",
	id: "stimpack",
	cost: 12,
	item_path: rt.typePath("/obj/item/weapon/reagent_containers/syringe/stimulants"),
});
rt.type(1286, "/datum/gang_item/equipment/wetwork_boots", "/datum/gang_item/equipment", {
	name: "Wetwork boots",
	id: "wetwork",
	cost: 20,
	item_path: rt.typePath("/obj/item/clothing/shoes/combat/gang"),
});
rt.type(9145, "/obj/item/device/gangtool/spare", "/obj/item/device/gangtool", {
	outfits: 1,
});
rt.type(9146, "/obj/item/device/gangtool/spare/lt", "/obj/item/device/gangtool/spare", {
	promotable: 1,
});
