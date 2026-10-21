// From code/modules/cargo/packs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(2100, "/datum/supply_pack", "/datum", {
	name: "Crate",
	group: "",
	hidden: 0,
	contraband: 0,
	cost: 700,
	access: 0,
	access_any: 0,
	contains: null,
	crate_name: "crate",
	dangerous: 0,
	special: 0,
	special_enabled: 0,
	crate_type: rt.typePath("/obj/structure/closet/crate"),
});

// /datum/supply_pack/proc/generate  (code/modules/cargo/packs.dm:17)  may sleep
rt.def("/datum/supply_pack/proc/generate", function* generate(f: Frame, _T: Value) {
	let C: Value = null;
	f.vars = () => [_T, C];
	rt.setFv(f, "name", (C = (yield* g.new_(f, rt.sv(f, "crate_type"), [live(_T)]))), rt.sv(f, "crate_name"));
	if (truthy(rt.sv(f, "access"))) {
		rt.setFv(f, "req_access", live(C), rt.list(rt.sv(f, "access")));
	}
	if (truthy(rt.sv(f, "access_any"))) {
		rt.setFv(f, "req_one_access", live(C), rt.sv(f, "access_any"));
	}
	yield* g.srcCall(f, "fill", live(C));
	return live(C);
}, true);

// /datum/supply_pack/proc/fill  (code/modules/cargo/packs.dm:29)  may sleep
rt.def("/datum/supply_pack/proc/fill", function* fill(f: Frame, C: Value) {
	let item: Value = null;
	let $e: any;
	f.vars = () => [C, item, $e];
	item = null;
	rt.forList(f, 0, rt.sv(f, "contains"));
	while (($e = rt.next(f, 0)) !== undefined) {
		item = $e;
		yield* g.new_(f, live(item), [live(C)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(2102, "/datum/supply_pack/emergency/spacesuit", "/datum/supply_pack/emergency", {
	name: "Space Suit Crate",
	cost: 3000,
	crate_name: "space suit crate",
	access: 18,
	contains: null,
	crate_type: rt.typePath("/obj/structure/closet/crate/secure"),
});

// /datum/supply_pack/emergency/spacesuit/proc/<init>  (code/modules/cargo/packs.dm:44)
rt.def("/datum/supply_pack/emergency/spacesuit/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/clothing/suit/space"), T("/obj/item/clothing/suit/space"), T("/obj/item/clothing/head/helmet/space"), T("/obj/item/clothing/head/helmet/space"), T("/obj/item/clothing/mask/breath"), T("/obj/item/clothing/mask/breath")));
	return f.dot;
});

rt.type(2103, "/datum/supply_pack/emergency/vehicle", "/datum/supply_pack/emergency", {
	name: "Biker Gang Kit",
	cost: 2000,
	contraband: 1,
	crate_name: "Biker Kit",
	contains: null,
	crate_type: rt.typePath("/obj/structure/closet/crate/large"),
});

// /datum/supply_pack/emergency/vehicle/proc/<init>  (code/modules/cargo/packs.dm:57)
rt.def("/datum/supply_pack/emergency/vehicle/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/vehicle/atv"), T("/obj/item/key"), T("/obj/item/clothing/suit/jacket/leather/overcoat"), T("/obj/item/clothing/gloves/color/black"), T("/obj/item/clothing/head/soft"), T("/obj/item/clothing/mask/bandana/skull")));
	return f.dot;
});

rt.type(2104, "/datum/supply_pack/emergency/equipment", "/datum/supply_pack/emergency", {
	name: "Emergency Equipment",
	cost: 3500,
	crate_name: "emergency crate",
	contains: null,
	crate_type: rt.typePath("/obj/structure/closet/crate/internals"),
});

// /datum/supply_pack/emergency/equipment/proc/<init>  (code/modules/cargo/packs.dm:69)
rt.def("/datum/supply_pack/emergency/equipment/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/mob/living/simple_animal/bot/floorbot"), T("/mob/living/simple_animal/bot/floorbot"), T("/mob/living/simple_animal/bot/medbot"), T("/mob/living/simple_animal/bot/medbot"), T("/obj/item/weapon/tank/internals/air"), T("/obj/item/weapon/tank/internals/air"), T("/obj/item/weapon/tank/internals/air"), T("/obj/item/weapon/tank/internals/air"), T("/obj/item/weapon/tank/internals/air"), T("/obj/item/clothing/mask/gas"), T("/obj/item/clothing/mask/gas"), T("/obj/item/clothing/mask/gas"), T("/obj/item/clothing/mask/gas"), T("/obj/item/clothing/mask/gas")));
	return f.dot;
});

rt.type(2105, "/datum/supply_pack/emergency/internals", "/datum/supply_pack/emergency", {
	name: "Internals Crate",
	cost: 1000,
	crate_name: "internals crate",
	contains: null,
	crate_type: rt.typePath("/obj/structure/closet/crate/internals"),
});

// /datum/supply_pack/emergency/internals/proc/<init>  (code/modules/cargo/packs.dm:89)
rt.def("/datum/supply_pack/emergency/internals/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/clothing/mask/gas"), T("/obj/item/clothing/mask/gas"), T("/obj/item/clothing/mask/gas"), T("/obj/item/clothing/mask/breath"), T("/obj/item/clothing/mask/breath"), T("/obj/item/clothing/mask/breath"), T("/obj/item/weapon/tank/internals/emergency_oxygen"), T("/obj/item/weapon/tank/internals/emergency_oxygen"), T("/obj/item/weapon/tank/internals/emergency_oxygen"), T("/obj/item/weapon/tank/internals/air"), T("/obj/item/weapon/tank/internals/air"), T("/obj/item/weapon/tank/internals/air")));
	return f.dot;
});

rt.type(2106, "/datum/supply_pack/emergency/firefighting", "/datum/supply_pack/emergency", {
	name: "Firefighting Crate",
	cost: 1000,
	crate_name: "firefighting crate",
	contains: null,
});

// /datum/supply_pack/emergency/firefighting/proc/<init>  (code/modules/cargo/packs.dm:107)
rt.def("/datum/supply_pack/emergency/firefighting/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/clothing/suit/fire/firefighter"), T("/obj/item/clothing/suit/fire/firefighter"), T("/obj/item/clothing/mask/gas"), T("/obj/item/clothing/mask/gas"), T("/obj/item/device/flashlight"), T("/obj/item/device/flashlight"), T("/obj/item/weapon/tank/internals/oxygen/red"), T("/obj/item/weapon/tank/internals/oxygen/red"), T("/obj/item/weapon/extinguisher"), T("/obj/item/weapon/extinguisher"), T("/obj/item/clothing/head/hardhat/red"), T("/obj/item/clothing/head/hardhat/red")));
	return f.dot;
});

rt.type(2107, "/datum/supply_pack/emergency/atmostank", "/datum/supply_pack/emergency", {
	name: "Firefighting Watertank",
	cost: 1000,
	crate_name: "firefighting watertank crate",
	access: 24,
	contains: null,
	crate_type: rt.typePath("/obj/structure/closet/crate/secure"),
});

// /datum/supply_pack/emergency/atmostank/proc/<init>  (code/modules/cargo/packs.dm:125)
rt.def("/datum/supply_pack/emergency/atmostank/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/watertank/atmos")));
	return f.dot;
});

rt.type(2108, "/datum/supply_pack/emergency/radiation", "/datum/supply_pack/emergency", {
	name: "Radiation Protection Crate",
	cost: 1000,
	crate_name: "radiation protection crate",
	contains: null,
	crate_type: rt.typePath("/obj/structure/closet/crate/radiation"),
});

// /datum/supply_pack/emergency/radiation/proc/<init>  (code/modules/cargo/packs.dm:132)
rt.def("/datum/supply_pack/emergency/radiation/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/clothing/head/radiation"), T("/obj/item/clothing/head/radiation"), T("/obj/item/clothing/suit/radiation"), T("/obj/item/clothing/suit/radiation"), T("/obj/item/device/geiger_counter"), T("/obj/item/device/geiger_counter"), T("/obj/item/weapon/reagent_containers/food/drinks/bottle/vodka"), T("/obj/item/weapon/reagent_containers/food/drinks/drinkingglass/shotglass"), T("/obj/item/weapon/reagent_containers/food/drinks/drinkingglass/shotglass")));
	return f.dot;
});

rt.type(2109, "/datum/supply_pack/emergency/weedcontrol", "/datum/supply_pack/emergency", {
	name: "Weed Control Crate",
	cost: 1500,
	crate_name: "weed control crate",
	access: 35,
	contains: null,
	crate_type: rt.typePath("/obj/structure/closet/crate/secure/hydroponics"),
});

// /datum/supply_pack/emergency/weedcontrol/proc/<init>  (code/modules/cargo/packs.dm:148)
rt.def("/datum/supply_pack/emergency/weedcontrol/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/scythe"), T("/obj/item/clothing/mask/gas"), T("/obj/item/weapon/grenade/chem_grenade/antiweed"), T("/obj/item/weapon/grenade/chem_grenade/antiweed")));
	return f.dot;
});

rt.type(2110, "/datum/supply_pack/emergency/metalfoam", "/datum/supply_pack/emergency", {
	name: "Metal Foam Grenade Crate",
	cost: 1000,
	crate_name: "metal foam grenade crate",
	contains: null,
});

// /datum/supply_pack/emergency/metalfoam/proc/<init>  (code/modules/cargo/packs.dm:158)
rt.def("/datum/supply_pack/emergency/metalfoam/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/storage/box/metalfoam")));
	return f.dot;
});

rt.type(2111, "/datum/supply_pack/emergency/droneshells", "/datum/supply_pack/emergency", {
	name: "Drone Shell Crate",
	cost: 1000,
	crate_name: "drone shell crate",
	contains: null,
});

// /datum/supply_pack/emergency/droneshells/proc/<init>  (code/modules/cargo/packs.dm:164)
rt.def("/datum/supply_pack/emergency/droneshells/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/drone_shell"), T("/obj/item/drone_shell"), T("/obj/item/drone_shell")));
	return f.dot;
});

rt.type(2112, "/datum/supply_pack/emergency/specialops", "/datum/supply_pack/emergency", {
	name: "Special Ops Supplies",
	hidden: 1,
	cost: 2000,
	crate_name: "emergency crate",
	contains: null,
	crate_type: rt.typePath("/obj/structure/closet/crate/internals"),
});

// /datum/supply_pack/emergency/specialops/proc/<init>  (code/modules/cargo/packs.dm:173)
rt.def("/datum/supply_pack/emergency/specialops/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/storage/box/emps"), T("/obj/item/weapon/grenade/smokebomb"), T("/obj/item/weapon/grenade/smokebomb"), T("/obj/item/weapon/grenade/smokebomb"), T("/obj/item/weapon/pen/sleepy"), T("/obj/item/weapon/grenade/chem_grenade/incendiary")));
	return f.dot;
});

rt.type(2113, "/datum/supply_pack/emergency/syndicate", "/datum/supply_pack/emergency", {
	name: "NULL_ENTRY",
	hidden: 1,
	cost: 20000,
	contains: null,
	crate_name: "emergency crate",
	dangerous: 1,
	crate_type: rt.typePath("/obj/structure/closet/crate/internals"),
});

// /datum/supply_pack/emergency/syndicate/proc/<init>  (code/modules/cargo/packs.dm:186)
rt.def("/datum/supply_pack/emergency/syndicate/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list());
	return f.dot;
});

// /datum/supply_pack/emergency/syndicate/proc/fill  (code/modules/cargo/packs.dm:193)  may sleep
rt.def("/datum/supply_pack/emergency/syndicate/proc/fill", function* fill(f: Frame, C: Value) {
	let crate_value: Value = null, uplink_items: Value = null, category: Value = null, item: Value = null, I: Value = null;
	f.vars = () => [C, crate_value, uplink_items, category, item, I];
	crate_value = 30;
	uplink_items = (yield* g.call(f, P("/proc/get_uplink_items"), null, [rt.fv(f, "mode", rt.gl("SSticker"))]));
	while (truthy(live(crate_value))) {
		category = rt.op(f, "PickUnweighted", [1], [live(uplink_items)]);
		item = rt.op(f, "PickUnweighted", [1], [rt.index(live(uplink_items), live(category))]);
		if ((!truthy(rt.gv(f, "surplus", (I = rt.index(rt.index(live(uplink_items), live(category)), live(item))))) || truthy(rt.op(f, "Prob", [], [subtract(100, rt.fv(f, "surplus", live(I)))])))) {
			continue;
		}
		if (rt.lt(live(crate_value), rt.fv(f, "cost", live(I)))) {
			continue;
		}
		(crate_value = rt.modify(live(crate_value), rt.fv(f, "cost", live(I)), subtract));
		yield* g.new_(f, rt.fv(f, "item", live(I)), [live(C)]);
	}
	return f.dot;
}, true);

rt.type(2115, "/datum/supply_pack/security/supplies", "/datum/supply_pack/security", {
	name: "Security Supplies Crate",
	cost: 1000,
	crate_name: "security supply crate",
	contains: null,
});

// /datum/supply_pack/security/supplies/proc/<init>  (code/modules/cargo/packs.dm:218)
rt.def("/datum/supply_pack/security/supplies/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/storage/box/flashbangs"), T("/obj/item/weapon/storage/box/teargas"), T("/obj/item/weapon/storage/box/flashes"), T("/obj/item/weapon/storage/box/handcuffs")));
	return f.dot;
});

rt.type(2116, "/datum/supply_pack/security/helmets", "/datum/supply_pack/security", {
	name: "Helmets Crate",
	cost: 1000,
	crate_name: "helmet crate",
	contains: null,
});

// /datum/supply_pack/security/helmets/proc/<init>  (code/modules/cargo/packs.dm:227)
rt.def("/datum/supply_pack/security/helmets/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/clothing/head/helmet/sec"), T("/obj/item/clothing/head/helmet/sec"), T("/obj/item/clothing/head/helmet/sec")));
	return f.dot;
});

rt.type(2117, "/datum/supply_pack/security/armor", "/datum/supply_pack/security", {
	name: "Armor Crate",
	cost: 1000,
	crate_name: "armor crate",
	contains: null,
});

// /datum/supply_pack/security/armor/proc/<init>  (code/modules/cargo/packs.dm:235)
rt.def("/datum/supply_pack/security/armor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/clothing/suit/armor/vest"), T("/obj/item/clothing/suit/armor/vest"), T("/obj/item/clothing/suit/armor/vest")));
	return f.dot;
});

rt.type(2118, "/datum/supply_pack/security/baton", "/datum/supply_pack/security", {
	name: "Stun Batons Crate",
	cost: 1000,
	crate_name: "stun baton crate",
	contains: null,
});

// /datum/supply_pack/security/baton/proc/<init>  (code/modules/cargo/packs.dm:243)
rt.def("/datum/supply_pack/security/baton/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/melee/baton/loaded"), T("/obj/item/weapon/melee/baton/loaded"), T("/obj/item/weapon/melee/baton/loaded")));
	return f.dot;
});

rt.type(2119, "/datum/supply_pack/security/wall_flash", "/datum/supply_pack/security", {
	name: "Wall-Mounted Flash Crate",
	cost: 1000,
	crate_name: "wall-mounted flash crate",
	contains: null,
});

// /datum/supply_pack/security/wall_flash/proc/<init>  (code/modules/cargo/packs.dm:251)
rt.def("/datum/supply_pack/security/wall_flash/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/storage/box/wall_flash"), T("/obj/item/weapon/storage/box/wall_flash"), T("/obj/item/weapon/storage/box/wall_flash"), T("/obj/item/weapon/storage/box/wall_flash")));
	return f.dot;
});

rt.type(2120, "/datum/supply_pack/security/laser", "/datum/supply_pack/security", {
	name: "Lasers Crate",
	cost: 2000,
	crate_name: "laser crate",
	contains: null,
});

// /datum/supply_pack/security/laser/proc/<init>  (code/modules/cargo/packs.dm:260)
rt.def("/datum/supply_pack/security/laser/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/gun/energy/laser"), T("/obj/item/weapon/gun/energy/laser"), T("/obj/item/weapon/gun/energy/laser")));
	return f.dot;
});

rt.type(2121, "/datum/supply_pack/security/taser", "/datum/supply_pack/security", {
	name: "Taser Crate",
	cost: 3000,
	crate_name: "taser crate",
	contains: null,
});

// /datum/supply_pack/security/taser/proc/<init>  (code/modules/cargo/packs.dm:268)
rt.def("/datum/supply_pack/security/taser/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/gun/energy/e_gun/advtaser"), T("/obj/item/weapon/gun/energy/e_gun/advtaser"), T("/obj/item/weapon/gun/energy/e_gun/advtaser")));
	return f.dot;
});

rt.type(2122, "/datum/supply_pack/security/disabler", "/datum/supply_pack/security", {
	name: "Disabler Crate",
	cost: 1500,
	crate_name: "disabler crate",
	contains: null,
});

// /datum/supply_pack/security/disabler/proc/<init>  (code/modules/cargo/packs.dm:276)
rt.def("/datum/supply_pack/security/disabler/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/gun/energy/disabler"), T("/obj/item/weapon/gun/energy/disabler"), T("/obj/item/weapon/gun/energy/disabler")));
	return f.dot;
});

rt.type(2123, "/datum/supply_pack/security/forensics", "/datum/supply_pack/security", {
	name: "Forensics Crate",
	cost: 2000,
	crate_name: "forensics crate",
	contains: null,
});

// /datum/supply_pack/security/forensics/proc/<init>  (code/modules/cargo/packs.dm:284)
rt.def("/datum/supply_pack/security/forensics/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/device/detective_scanner"), T("/obj/item/weapon/storage/box/evidence"), T("/obj/item/device/camera"), T("/obj/item/device/taperecorder"), T("/obj/item/toy/crayon/white"), T("/obj/item/clothing/head/fedora/det_hat")));
	return f.dot;
});

rt.type(2125, "/datum/supply_pack/security/armory/riothelmets", "/datum/supply_pack/security/armory", {
	name: "Riot Helmets Crate",
	cost: 1500,
	crate_name: "riot helmets crate",
	contains: null,
});

// /datum/supply_pack/security/armory/riothelmets/proc/<init>  (code/modules/cargo/packs.dm:299)
rt.def("/datum/supply_pack/security/armory/riothelmets/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/clothing/head/helmet/riot"), T("/obj/item/clothing/head/helmet/riot"), T("/obj/item/clothing/head/helmet/riot")));
	return f.dot;
});

rt.type(2126, "/datum/supply_pack/security/armory/riotarmor", "/datum/supply_pack/security/armory", {
	name: "Riot Armor Crate",
	cost: 1500,
	crate_name: "riot armor crate",
	contains: null,
});

// /datum/supply_pack/security/armory/riotarmor/proc/<init>  (code/modules/cargo/packs.dm:307)
rt.def("/datum/supply_pack/security/armory/riotarmor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/clothing/suit/armor/riot"), T("/obj/item/clothing/suit/armor/riot"), T("/obj/item/clothing/suit/armor/riot")));
	return f.dot;
});

rt.type(2127, "/datum/supply_pack/security/armory/riotshields", "/datum/supply_pack/security/armory", {
	name: "Riot Shields Crate",
	cost: 2000,
	crate_name: "riot shields crate",
	contains: null,
});

// /datum/supply_pack/security/armory/riotshields/proc/<init>  (code/modules/cargo/packs.dm:315)
rt.def("/datum/supply_pack/security/armory/riotshields/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/shield/riot"), T("/obj/item/weapon/shield/riot"), T("/obj/item/weapon/shield/riot")));
	return f.dot;
});

rt.type(2128, "/datum/supply_pack/security/armory/bulletarmor", "/datum/supply_pack/security/armory", {
	name: "Bulletproof Armor Crate",
	cost: 1500,
	crate_name: "bulletproof armor crate",
	contains: null,
});

// /datum/supply_pack/security/armory/bulletarmor/proc/<init>  (code/modules/cargo/packs.dm:323)
rt.def("/datum/supply_pack/security/armory/bulletarmor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/clothing/suit/armor/bulletproof"), T("/obj/item/clothing/suit/armor/bulletproof"), T("/obj/item/clothing/suit/armor/bulletproof")));
	return f.dot;
});

rt.type(2129, "/datum/supply_pack/security/armory/swat", "/datum/supply_pack/security/armory", {
	name: "SWAT Crate",
	cost: 6000,
	crate_name: "swat crate",
	contains: null,
});

// /datum/supply_pack/security/armory/swat/proc/<init>  (code/modules/cargo/packs.dm:331)
rt.def("/datum/supply_pack/security/armory/swat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/clothing/head/helmet/swat/nanotrasen"), T("/obj/item/clothing/head/helmet/swat/nanotrasen"), T("/obj/item/clothing/suit/space/swat"), T("/obj/item/clothing/suit/space/swat"), T("/obj/item/clothing/mask/gas/sechailer/swat"), T("/obj/item/clothing/mask/gas/sechailer/swat"), T("/obj/item/weapon/storage/belt/military/assault"), T("/obj/item/weapon/storage/belt/military/assault"), T("/obj/item/clothing/gloves/combat"), T("/obj/item/clothing/gloves/combat")));
	return f.dot;
});

rt.type(2130, "/datum/supply_pack/security/armory/combatknives", "/datum/supply_pack/security/armory", {
	name: "Combat Knives Crate",
	cost: 3000,
	crate_name: "combat knife crate",
	contains: null,
});

// /datum/supply_pack/security/armory/combatknives/proc/<init>  (code/modules/cargo/packs.dm:346)
rt.def("/datum/supply_pack/security/armory/combatknives/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/kitchen/knife/combat"), T("/obj/item/weapon/kitchen/knife/combat"), T("/obj/item/weapon/kitchen/knife/combat")));
	return f.dot;
});

rt.type(2131, "/datum/supply_pack/security/armory/laserarmor", "/datum/supply_pack/security/armory", {
	name: "Reflector Vest Crate",
	cost: 2000,
	crate_name: "reflector vest crate",
	contains: null,
	crate_type: rt.typePath("/obj/structure/closet/crate/secure/plasma"),
});

// /datum/supply_pack/security/armory/laserarmor/proc/<init>  (code/modules/cargo/packs.dm:354)
rt.def("/datum/supply_pack/security/armory/laserarmor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/clothing/suit/armor/laserproof"), T("/obj/item/clothing/suit/armor/laserproof")));
	return f.dot;
});

rt.type(2132, "/datum/supply_pack/security/armory/ballistic", "/datum/supply_pack/security/armory", {
	name: "Combat Shotguns Crate",
	cost: 8000,
	crate_name: "combat shotguns crate",
	contains: null,
});

// /datum/supply_pack/security/armory/ballistic/proc/<init>  (code/modules/cargo/packs.dm:362)
rt.def("/datum/supply_pack/security/armory/ballistic/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/gun/ballistic/shotgun/automatic/combat"), T("/obj/item/weapon/gun/ballistic/shotgun/automatic/combat"), T("/obj/item/weapon/gun/ballistic/shotgun/automatic/combat"), T("/obj/item/weapon/storage/belt/bandolier"), T("/obj/item/weapon/storage/belt/bandolier"), T("/obj/item/weapon/storage/belt/bandolier")));
	return f.dot;
});

rt.type(2133, "/datum/supply_pack/security/armory/energy", "/datum/supply_pack/security/armory", {
	name: "Energy Guns Crate",
	cost: 2500,
	crate_name: "energy gun crate",
	contains: null,
	crate_type: rt.typePath("/obj/structure/closet/crate/secure/plasma"),
});

// /datum/supply_pack/security/armory/energy/proc/<init>  (code/modules/cargo/packs.dm:373)
rt.def("/datum/supply_pack/security/armory/energy/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/gun/energy/e_gun"), T("/obj/item/weapon/gun/energy/e_gun")));
	return f.dot;
});

rt.type(2134, "/datum/supply_pack/security/armory/fire", "/datum/supply_pack/security/armory", {
	name: "Incendiary Weapons Crate",
	cost: 1500,
	crate_name: "incendiary weapons crate",
	dangerous: 1,
	access: 19,
	contains: null,
	crate_type: rt.typePath("/obj/structure/closet/crate/secure/plasma"),
});

// /datum/supply_pack/security/armory/fire/proc/<init>  (code/modules/cargo/packs.dm:382)
rt.def("/datum/supply_pack/security/armory/fire/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/flamethrower/full"), T("/obj/item/weapon/tank/internals/plasma"), T("/obj/item/weapon/tank/internals/plasma"), T("/obj/item/weapon/tank/internals/plasma"), T("/obj/item/weapon/grenade/chem_grenade/incendiary"), T("/obj/item/weapon/grenade/chem_grenade/incendiary"), T("/obj/item/weapon/grenade/chem_grenade/incendiary")));
	return f.dot;
});

rt.type(2135, "/datum/supply_pack/security/armory/wt550", "/datum/supply_pack/security/armory", {
	name: "WT-550 Auto Rifle Crate",
	cost: 3500,
	crate_name: "auto rifle crate",
	contains: null,
});

// /datum/supply_pack/security/armory/wt550/proc/<init>  (code/modules/cargo/packs.dm:396)
rt.def("/datum/supply_pack/security/armory/wt550/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/gun/ballistic/automatic/wt550"), T("/obj/item/weapon/gun/ballistic/automatic/wt550")));
	return f.dot;
});

rt.type(2136, "/datum/supply_pack/security/armory/wt550ammo", "/datum/supply_pack/security/armory", {
	name: "WT-550 Auto Rifle Ammo Crate",
	cost: 3000,
	crate_name: "auto rifle ammo crate",
	contains: null,
});

// /datum/supply_pack/security/armory/wt550ammo/proc/<init>  (code/modules/cargo/packs.dm:403)
rt.def("/datum/supply_pack/security/armory/wt550ammo/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/ammo_box/magazine/wt550m9"), T("/obj/item/ammo_box/magazine/wt550m9"), T("/obj/item/ammo_box/magazine/wt550m9"), T("/obj/item/ammo_box/magazine/wt550m9")));
	return f.dot;
});

rt.type(2137, "/datum/supply_pack/security/armory/mindshield", "/datum/supply_pack/security/armory", {
	name: "mindshield implants Crate",
	cost: 4000,
	crate_name: "mindshield implant crate",
	contains: null,
});

// /datum/supply_pack/security/armory/mindshield/proc/<init>  (code/modules/cargo/packs.dm:412)
rt.def("/datum/supply_pack/security/armory/mindshield/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/storage/lockbox/loyalty")));
	return f.dot;
});

rt.type(2138, "/datum/supply_pack/security/armory/trackingimp", "/datum/supply_pack/security/armory", {
	name: "Tracking Implants Crate",
	cost: 2000,
	crate_name: "tracking implant crate",
	contains: null,
});

// /datum/supply_pack/security/armory/trackingimp/proc/<init>  (code/modules/cargo/packs.dm:418)
rt.def("/datum/supply_pack/security/armory/trackingimp/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/storage/box/trackimp")));
	return f.dot;
});

rt.type(2139, "/datum/supply_pack/security/armory/chemimp", "/datum/supply_pack/security/armory", {
	name: "Chemical Implants Crate",
	cost: 2000,
	crate_name: "chemical implant crate",
	contains: null,
});

// /datum/supply_pack/security/armory/chemimp/proc/<init>  (code/modules/cargo/packs.dm:424)
rt.def("/datum/supply_pack/security/armory/chemimp/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/storage/box/chemimp")));
	return f.dot;
});

rt.type(2140, "/datum/supply_pack/security/armory/exileimp", "/datum/supply_pack/security/armory", {
	name: "Exile Implants Crate",
	cost: 3000,
	crate_name: "exile implant crate",
	contains: null,
});

// /datum/supply_pack/security/armory/exileimp/proc/<init>  (code/modules/cargo/packs.dm:430)
rt.def("/datum/supply_pack/security/armory/exileimp/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/storage/box/exileimp")));
	return f.dot;
});

rt.type(2141, "/datum/supply_pack/security/securitybarriers", "/datum/supply_pack/security", {
	name: "Security Barriers Crate",
	cost: 2000,
	crate_name: "security barriers crate",
	contains: null,
});

// /datum/supply_pack/security/securitybarriers/proc/<init>  (code/modules/cargo/packs.dm:435)
rt.def("/datum/supply_pack/security/securitybarriers/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/grenade/barrier"), T("/obj/item/weapon/grenade/barrier"), T("/obj/item/weapon/grenade/barrier"), T("/obj/item/weapon/grenade/barrier")));
	return f.dot;
});

rt.type(2142, "/datum/supply_pack/security/firingpins", "/datum/supply_pack/security", {
	name: "Standard Firing Pins Crate",
	cost: 2000,
	crate_name: "firing pins crate",
	contains: null,
});

// /datum/supply_pack/security/firingpins/proc/<init>  (code/modules/cargo/packs.dm:445)
rt.def("/datum/supply_pack/security/firingpins/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/storage/box/firingpins"), T("/obj/item/weapon/storage/box/firingpins")));
	return f.dot;
});

rt.type(2143, "/datum/supply_pack/security/securityclothes", "/datum/supply_pack/security", {
	name: "Security Clothing Crate",
	cost: 3000,
	crate_name: "security clothing crate",
	contains: null,
});

// /datum/supply_pack/security/securityclothes/proc/<init>  (code/modules/cargo/packs.dm:452)
rt.def("/datum/supply_pack/security/securityclothes/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/clothing/under/rank/security/navyblue"), T("/obj/item/clothing/under/rank/security/navyblue"), T("/obj/item/clothing/suit/security/officer"), T("/obj/item/clothing/suit/security/officer"), T("/obj/item/clothing/head/beret/sec/navyofficer"), T("/obj/item/clothing/head/beret/sec/navyofficer"), T("/obj/item/clothing/under/rank/warden/navyblue"), T("/obj/item/clothing/suit/security/warden"), T("/obj/item/clothing/head/beret/sec/navywarden"), T("/obj/item/clothing/under/rank/head_of_security/navyblue"), T("/obj/item/clothing/suit/security/hos"), T("/obj/item/clothing/head/beret/sec/navyhos")));
	return f.dot;
});

rt.type(2144, "/datum/supply_pack/security/justiceinbound", "/datum/supply_pack/security", {
	name: "Standard Justice Enforcer Crate",
	cost: 6000,
	contraband: 1,
	crate_name: "security clothing crate",
	contains: null,
});

// /datum/supply_pack/security/justiceinbound/proc/<init>  (code/modules/cargo/packs.dm:470)
rt.def("/datum/supply_pack/security/justiceinbound/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/clothing/head/helmet/justice"), T("/obj/item/clothing/mask/gas/sechailer")));
	return f.dot;
});

rt.type(2146, "/datum/supply_pack/engineering/fueltank", "/datum/supply_pack/engineering", {
	name: "Fuel Tank Crate",
	cost: 800,
	crate_name: "fuel tank crate",
	contains: null,
	crate_type: rt.typePath("/obj/structure/closet/crate/large"),
});

// /datum/supply_pack/engineering/fueltank/proc/<init>  (code/modules/cargo/packs.dm:485)
rt.def("/datum/supply_pack/engineering/fueltank/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/structure/reagent_dispensers/fueltank")));
	return f.dot;
});

rt.type(2147, "/datum/supply_pack/engineering/oxygen", "/datum/supply_pack/engineering", {
	name: "Oxygen Canister",
	cost: 1500,
	crate_name: "oxygen canister crate",
	contains: null,
	crate_type: rt.typePath("/obj/structure/closet/crate/large"),
});

// /datum/supply_pack/engineering/oxygen/proc/<init>  (code/modules/cargo/packs.dm:492)
rt.def("/datum/supply_pack/engineering/oxygen/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/machinery/portable_atmospherics/canister/oxygen")));
	return f.dot;
});

rt.type(2148, "/datum/supply_pack/engineering/nitrogen", "/datum/supply_pack/engineering", {
	name: "Nitrogen Canister",
	cost: 2000,
	crate_name: "nitrogen canister crate",
	contains: null,
	crate_type: rt.typePath("/obj/structure/closet/crate/large"),
});

// /datum/supply_pack/engineering/nitrogen/proc/<init>  (code/modules/cargo/packs.dm:499)
rt.def("/datum/supply_pack/engineering/nitrogen/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/machinery/portable_atmospherics/canister/nitrogen")));
	return f.dot;
});

rt.type(2149, "/datum/supply_pack/engineering/carbon_dio", "/datum/supply_pack/engineering", {
	name: "Carbon Dioxide Canister",
	cost: 3000,
	crate_name: "carbon dioxide canister crate",
	contains: null,
	crate_type: rt.typePath("/obj/structure/closet/crate/large"),
});

// /datum/supply_pack/engineering/carbon_dio/proc/<init>  (code/modules/cargo/packs.dm:506)
rt.def("/datum/supply_pack/engineering/carbon_dio/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/machinery/portable_atmospherics/canister/carbon_dioxide")));
	return f.dot;
});

rt.type(2171, "/datum/supply_pack/science/nitrous_oxide_canister", "/datum/supply_pack/science", {
	name: "Nitrous Oxide Canister",
	cost: 3000,
	crate_name: "nitrous oxide canister crate",
	access: 24,
	contains: null,
	crate_type: rt.typePath("/obj/structure/closet/crate/secure"),
});

// /datum/supply_pack/science/nitrous_oxide_canister/proc/<init>  (code/modules/cargo/packs.dm:514)
rt.def("/datum/supply_pack/science/nitrous_oxide_canister/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/machinery/portable_atmospherics/canister/nitrous_oxide")));
	return f.dot;
});

rt.type(2150, "/datum/supply_pack/engineering/tools", "/datum/supply_pack/engineering", {
	name: "Toolbox Crate",
	cost: 1000,
	crate_name: "toolbox crate",
	contains: null,
});

// /datum/supply_pack/engineering/tools/proc/<init>  (code/modules/cargo/packs.dm:520)
rt.def("/datum/supply_pack/engineering/tools/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/storage/toolbox/electrical"), T("/obj/item/weapon/storage/toolbox/electrical"), T("/obj/item/weapon/storage/toolbox/mechanical"), T("/obj/item/weapon/storage/toolbox/electrical"), T("/obj/item/weapon/storage/toolbox/mechanical"), T("/obj/item/weapon/storage/toolbox/mechanical")));
	return f.dot;
});

rt.type(2151, "/datum/supply_pack/engineering/powergamermitts", "/datum/supply_pack/engineering", {
	name: "Insulated Gloves Crate",
	cost: 2000,
	crate_name: "insulated gloves crate",
	contains: null,
});

// /datum/supply_pack/engineering/powergamermitts/proc/<init>  (code/modules/cargo/packs.dm:532)
rt.def("/datum/supply_pack/engineering/powergamermitts/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/clothing/gloves/color/yellow"), T("/obj/item/clothing/gloves/color/yellow"), T("/obj/item/clothing/gloves/color/yellow")));
	return f.dot;
});

rt.type(2152, "/datum/supply_pack/engineering/power", "/datum/supply_pack/engineering", {
	name: "Powercell Crate",
	cost: 1000,
	crate_name: "electrical maintenance crate",
	contains: null,
	crate_type: rt.typePath("/obj/structure/closet/crate/engineering/electrical"),
});

// /datum/supply_pack/engineering/power/proc/<init>  (code/modules/cargo/packs.dm:540)
rt.def("/datum/supply_pack/engineering/power/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/stock_parts/cell/high"), T("/obj/item/weapon/stock_parts/cell/high"), T("/obj/item/weapon/stock_parts/cell/high")));
	return f.dot;
});

rt.type(2153, "/datum/supply_pack/engineering/inducers", "/datum/supply_pack/engineering", {
	name: "NT-75 Electromagnetic Power Inducers Crate",
	cost: 2000,
	crate_name: "inducer crate",
	contains: null,
	crate_type: rt.typePath("/obj/structure/closet/crate/engineering/electrical"),
});

// /datum/supply_pack/engineering/inducers/proc/<init>  (code/modules/cargo/packs.dm:549)
rt.def("/datum/supply_pack/engineering/inducers/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/inducer/sci"), T("/obj/item/weapon/inducer/sci")));
	return f.dot;
});

rt.type(2154, "/datum/supply_pack/engineering/engiequipment", "/datum/supply_pack/engineering", {
	name: "Engineering Gear Crate",
	cost: 1300,
	crate_name: "engineering gear crate",
	contains: null,
});

// /datum/supply_pack/engineering/engiequipment/proc/<init>  (code/modules/cargo/packs.dm:556)
rt.def("/datum/supply_pack/engineering/engiequipment/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/storage/belt/utility"), T("/obj/item/weapon/storage/belt/utility"), T("/obj/item/weapon/storage/belt/utility"), T("/obj/item/clothing/suit/hazardvest"), T("/obj/item/clothing/suit/hazardvest"), T("/obj/item/clothing/suit/hazardvest"), T("/obj/item/clothing/head/welding"), T("/obj/item/clothing/head/welding"), T("/obj/item/clothing/head/welding"), T("/obj/item/clothing/head/hardhat"), T("/obj/item/clothing/head/hardhat"), T("/obj/item/clothing/head/hardhat"), T("/obj/item/clothing/glasses/meson/engine"), T("/obj/item/clothing/glasses/meson/engine")));
	return f.dot;
});

rt.type(2155, "/datum/supply_pack/engineering/shieldgen", "/datum/supply_pack/engineering", {
	name: "Anti-breach Shield Projector Crate",
	cost: 2500,
	crate_name: "anti-breach shield projector crate",
	contains: null,
});

// /datum/supply_pack/engineering/shieldgen/proc/<init>  (code/modules/cargo/packs.dm:576)
rt.def("/datum/supply_pack/engineering/shieldgen/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/machinery/shieldgen"), T("/obj/machinery/shieldgen")));
	return f.dot;
});

rt.type(2156, "/datum/supply_pack/engineering/grounding_rods", "/datum/supply_pack/engineering", {
	name: "Grounding Rod Crate",
	cost: 1700,
	crate_name: "grounding rod crate",
	contains: null,
	crate_type: rt.typePath("/obj/structure/closet/crate/engineering/electrical"),
});

// /datum/supply_pack/engineering/grounding_rods/proc/<init>  (code/modules/cargo/packs.dm:583)
rt.def("/datum/supply_pack/engineering/grounding_rods/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/machinery/power/grounding_rod"), T("/obj/machinery/power/grounding_rod"), T("/obj/machinery/power/grounding_rod"), T("/obj/machinery/power/grounding_rod")));
	return f.dot;
});

rt.type(2157, "/datum/supply_pack/engineering/pacman", "/datum/supply_pack/engineering", {
	name: "P.A.C.M.A.N Generator Crate",
	cost: 2500,
	crate_name: "PACMAN generator crate",
	contains: null,
	crate_type: rt.typePath("/obj/structure/closet/crate/engineering/electrical"),
});

// /datum/supply_pack/engineering/pacman/proc/<init>  (code/modules/cargo/packs.dm:593)
rt.def("/datum/supply_pack/engineering/pacman/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/machinery/power/port_gen/pacman")));
	return f.dot;
});

rt.type(2158, "/datum/supply_pack/engineering/solar", "/datum/supply_pack/engineering", {
	name: "Solar Panel Crate",
	cost: 2000,
	crate_name: "solar panel crate",
	contains: null,
	crate_type: rt.typePath("/obj/structure/closet/crate/engineering/electrical"),
});

// /datum/supply_pack/engineering/solar/proc/<init>  (code/modules/cargo/packs.dm:600)
rt.def("/datum/supply_pack/engineering/solar/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/solar_assembly"), T("/obj/item/solar_assembly"), T("/obj/item/solar_assembly"), T("/obj/item/solar_assembly"), T("/obj/item/solar_assembly"), T("/obj/item/solar_assembly"), T("/obj/item/solar_assembly"), T("/obj/item/solar_assembly"), T("/obj/item/solar_assembly"), T("/obj/item/solar_assembly"), T("/obj/item/solar_assembly"), T("/obj/item/solar_assembly"), T("/obj/item/solar_assembly"), T("/obj/item/solar_assembly"), T("/obj/item/solar_assembly"), T("/obj/item/solar_assembly"), T("/obj/item/solar_assembly"), T("/obj/item/solar_assembly"), T("/obj/item/solar_assembly"), T("/obj/item/solar_assembly"), T("/obj/item/solar_assembly"), T("/obj/item/weapon/circuitboard/computer/solar_control"), T("/obj/item/weapon/electronics/tracker"), T("/obj/item/weapon/paper/solar")));
	return f.dot;
});

rt.type(2159, "/datum/supply_pack/engineering/engine", "/datum/supply_pack/engineering", {
	name: "Emitter Crate",
	cost: 1500,
	crate_name: "emitter crate",
	dangerous: 1,
	access: 56,
	contains: null,
	crate_type: rt.typePath("/obj/structure/closet/crate/secure/engineering"),
});

// /datum/supply_pack/engineering/engine/proc/<init>  (code/modules/cargo/packs.dm:631)
rt.def("/datum/supply_pack/engineering/engine/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/machinery/power/emitter"), T("/obj/machinery/power/emitter")));
	return f.dot;
});

rt.type(2160, "/datum/supply_pack/engineering/engine/field_gen", "/datum/supply_pack/engineering/engine", {
	name: "Field Generator Crate",
	cost: 1500,
	crate_name: "field generator crate",
	contains: null,
});

// /datum/supply_pack/engineering/engine/field_gen/proc/<init>  (code/modules/cargo/packs.dm:640)
rt.def("/datum/supply_pack/engineering/engine/field_gen/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/machinery/field/generator"), T("/obj/machinery/field/generator")));
	return f.dot;
});

rt.type(2161, "/datum/supply_pack/engineering/engine/sing_gen", "/datum/supply_pack/engineering/engine", {
	name: "Singularity Generator Crate",
	cost: 5000,
	crate_name: "singularity generator crate",
	contains: null,
});

// /datum/supply_pack/engineering/engine/sing_gen/proc/<init>  (code/modules/cargo/packs.dm:647)
rt.def("/datum/supply_pack/engineering/engine/sing_gen/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/machinery/the_singularitygen")));
	return f.dot;
});

rt.type(2162, "/datum/supply_pack/engineering/engine/tesla_gen", "/datum/supply_pack/engineering/engine", {
	name: "Tesla Generator Crate",
	cost: 5000,
	crate_name: "tesla generator crate",
	contains: null,
});

// /datum/supply_pack/engineering/engine/tesla_gen/proc/<init>  (code/modules/cargo/packs.dm:653)
rt.def("/datum/supply_pack/engineering/engine/tesla_gen/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/machinery/the_singularitygen/tesla")));
	return f.dot;
});

rt.type(2163, "/datum/supply_pack/engineering/engine/collector", "/datum/supply_pack/engineering/engine", {
	name: "Collector Crate",
	cost: 2500,
	crate_name: "collector crate",
	contains: null,
});

// /datum/supply_pack/engineering/engine/collector/proc/<init>  (code/modules/cargo/packs.dm:659)
rt.def("/datum/supply_pack/engineering/engine/collector/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/machinery/power/rad_collector"), T("/obj/machinery/power/rad_collector"), T("/obj/machinery/power/rad_collector")));
	return f.dot;
});

rt.type(2164, "/datum/supply_pack/engineering/engine/PA", "/datum/supply_pack/engineering/engine", {
	name: "Particle Accelerator Crate",
	cost: 3000,
	crate_name: "particle accelerator crate",
	contains: null,
});

// /datum/supply_pack/engineering/engine/PA/proc/<init>  (code/modules/cargo/packs.dm:667)
rt.def("/datum/supply_pack/engineering/engine/PA/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/structure/particle_accelerator/fuel_chamber"), T("/obj/machinery/particle_accelerator/control_box"), T("/obj/structure/particle_accelerator/particle_emitter/center"), T("/obj/structure/particle_accelerator/particle_emitter/left"), T("/obj/structure/particle_accelerator/particle_emitter/right"), T("/obj/structure/particle_accelerator/power_box"), T("/obj/structure/particle_accelerator/end_cap")));
	return f.dot;
});

rt.type(2165, "/datum/supply_pack/engineering/engine/supermatter_shard", "/datum/supply_pack/engineering/engine", {
	name: "Supermatter Shard Crate",
	cost: 10000,
	crate_name: "supermatter shard crate",
	dangerous: 1,
	access: 56,
	contains: null,
	crate_type: rt.typePath("/obj/structure/closet/crate/secure/engineering"),
});

// /datum/supply_pack/engineering/engine/supermatter_shard/proc/<init>  (code/modules/cargo/packs.dm:680)
rt.def("/datum/supply_pack/engineering/engine/supermatter_shard/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/machinery/power/supermatter_shard")));
	return f.dot;
});

rt.type(2166, "/datum/supply_pack/engineering/engine/am_shielding", "/datum/supply_pack/engineering/engine", {
	name: "Antimatter Shielding Crate",
	cost: 2000,
	crate_name: "antimatter shielding crate",
	contains: null,
});

// /datum/supply_pack/engineering/engine/am_shielding/proc/<init>  (code/modules/cargo/packs.dm:688)
rt.def("/datum/supply_pack/engineering/engine/am_shielding/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/device/am_shielding_container"), T("/obj/item/device/am_shielding_container"), T("/obj/item/device/am_shielding_container"), T("/obj/item/device/am_shielding_container"), T("/obj/item/device/am_shielding_container"), T("/obj/item/device/am_shielding_container"), T("/obj/item/device/am_shielding_container"), T("/obj/item/device/am_shielding_container"), T("/obj/item/device/am_shielding_container"), T("/obj/item/device/am_shielding_container")));
	return f.dot;
});

rt.type(2167, "/datum/supply_pack/engineering/engine/am_core", "/datum/supply_pack/engineering/engine", {
	name: "Antimatter Control Crate",
	cost: 5000,
	crate_name: "antimatter control crate",
	contains: null,
});

// /datum/supply_pack/engineering/engine/am_core/proc/<init>  (code/modules/cargo/packs.dm:703)
rt.def("/datum/supply_pack/engineering/engine/am_core/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/machinery/power/am_control_unit")));
	return f.dot;
});

rt.type(2168, "/datum/supply_pack/engineering/engine/am_jar", "/datum/supply_pack/engineering/engine", {
	name: "Antimatter Containment Jar Crate",
	cost: 2000,
	crate_name: "antimatter jar crate",
	contains: null,
});

// /datum/supply_pack/engineering/engine/am_jar/proc/<init>  (code/modules/cargo/packs.dm:709)
rt.def("/datum/supply_pack/engineering/engine/am_jar/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/am_containment"), T("/obj/item/weapon/am_containment")));
	return f.dot;
});

rt.type(2169, "/datum/supply_pack/engineering/shuttle_engine", "/datum/supply_pack/engineering", {
	name: "Shuttle Engine Crate",
	cost: 5000,
	crate_name: "shuttle engine crate",
	special: 1,
	access: 56,
	contains: null,
	crate_type: rt.typePath("/obj/structure/closet/crate/secure/engineering"),
});

// /datum/supply_pack/engineering/shuttle_engine/proc/<init>  (code/modules/cargo/packs.dm:717)
rt.def("/datum/supply_pack/engineering/shuttle_engine/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/structure/shuttle/engine/propulsion/burst/cargo")));
	return f.dot;
});

rt.type(2183, "/datum/supply_pack/medical/supplies", "/datum/supply_pack/medical", {
	name: "Medical Supplies Crate",
	cost: 2000,
	crate_name: "medical supplies crate",
	contains: null,
});

// /datum/supply_pack/medical/supplies/proc/<init>  (code/modules/cargo/packs.dm:733)
rt.def("/datum/supply_pack/medical/supplies/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/reagent_containers/glass/bottle/charcoal"), T("/obj/item/weapon/reagent_containers/glass/bottle/charcoal"), T("/obj/item/weapon/reagent_containers/glass/bottle/epinephrine"), T("/obj/item/weapon/reagent_containers/glass/bottle/epinephrine"), T("/obj/item/weapon/reagent_containers/glass/bottle/morphine"), T("/obj/item/weapon/reagent_containers/glass/bottle/morphine"), T("/obj/item/weapon/reagent_containers/glass/bottle/morphine"), T("/obj/item/weapon/reagent_containers/glass/bottle/morphine"), T("/obj/item/weapon/reagent_containers/glass/bottle/morphine"), T("/obj/item/weapon/reagent_containers/glass/bottle/morphine"), T("/obj/item/weapon/reagent_containers/glass/bottle/toxin"), T("/obj/item/weapon/reagent_containers/glass/bottle/toxin"), T("/obj/item/weapon/reagent_containers/glass/beaker/large"), T("/obj/item/weapon/reagent_containers/glass/beaker/large"), T("/obj/item/weapon/reagent_containers/pill/insulin"), T("/obj/item/weapon/reagent_containers/pill/insulin"), T("/obj/item/weapon/reagent_containers/pill/insulin"), T("/obj/item/weapon/reagent_containers/pill/insulin"), T("/obj/item/stack/medical/gauze"), T("/obj/item/weapon/storage/box/beakers"), T("/obj/item/weapon/storage/box/syringes"), T("/obj/item/weapon/storage/box/bodybags")));
	return f.dot;
});

rt.type(2184, "/datum/supply_pack/medical/firstaid", "/datum/supply_pack/medical", {
	name: "First Aid Kit Crate",
	cost: 1000,
	crate_name: "first aid kit crate",
	contains: null,
});

// /datum/supply_pack/medical/firstaid/proc/<init>  (code/modules/cargo/packs.dm:760)
rt.def("/datum/supply_pack/medical/firstaid/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/storage/firstaid/regular"), T("/obj/item/weapon/storage/firstaid/regular"), T("/obj/item/weapon/storage/firstaid/regular"), T("/obj/item/weapon/storage/firstaid/regular")));
	return f.dot;
});

rt.type(2185, "/datum/supply_pack/medical/firstaidbruises", "/datum/supply_pack/medical", {
	name: "Bruise Treatment Kit Crate",
	cost: 1000,
	crate_name: "brute treatment kit crate",
	contains: null,
});

// /datum/supply_pack/medical/firstaidbruises/proc/<init>  (code/modules/cargo/packs.dm:769)
rt.def("/datum/supply_pack/medical/firstaidbruises/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/storage/firstaid/brute"), T("/obj/item/weapon/storage/firstaid/brute"), T("/obj/item/weapon/storage/firstaid/brute")));
	return f.dot;
});

rt.type(2186, "/datum/supply_pack/medical/firstaidburns", "/datum/supply_pack/medical", {
	name: "Burn Treatment Kit Crate",
	cost: 1000,
	crate_name: "burn treatment kit crate",
	contains: null,
});

// /datum/supply_pack/medical/firstaidburns/proc/<init>  (code/modules/cargo/packs.dm:777)
rt.def("/datum/supply_pack/medical/firstaidburns/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/storage/firstaid/fire"), T("/obj/item/weapon/storage/firstaid/fire"), T("/obj/item/weapon/storage/firstaid/fire")));
	return f.dot;
});

rt.type(2187, "/datum/supply_pack/medical/firstaidtoxins", "/datum/supply_pack/medical", {
	name: "Toxin Treatment Kit Crate",
	cost: 1000,
	crate_name: "toxin treatment kit crate",
	contains: null,
});

// /datum/supply_pack/medical/firstaidtoxins/proc/<init>  (code/modules/cargo/packs.dm:785)
rt.def("/datum/supply_pack/medical/firstaidtoxins/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/storage/firstaid/toxin"), T("/obj/item/weapon/storage/firstaid/toxin"), T("/obj/item/weapon/storage/firstaid/toxin")));
	return f.dot;
});

rt.type(2188, "/datum/supply_pack/medical/firstaidoxygen", "/datum/supply_pack/medical", {
	name: "Oxygen Deprivation Kit Crate",
	cost: 1000,
	crate_name: "oxygen deprivation kit crate",
	contains: null,
});

// /datum/supply_pack/medical/firstaidoxygen/proc/<init>  (code/modules/cargo/packs.dm:793)
rt.def("/datum/supply_pack/medical/firstaidoxygen/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/storage/firstaid/o2"), T("/obj/item/weapon/storage/firstaid/o2"), T("/obj/item/weapon/storage/firstaid/o2")));
	return f.dot;
});

rt.type(2189, "/datum/supply_pack/medical/virus", "/datum/supply_pack/medical", {
	name: "Virus Crate",
	cost: 2500,
	crate_name: "virus crate",
	dangerous: 1,
	access: 40,
	contains: null,
	crate_type: rt.typePath("/obj/structure/closet/crate/secure/plasma"),
});

// /datum/supply_pack/medical/virus/proc/<init>  (code/modules/cargo/packs.dm:802)
rt.def("/datum/supply_pack/medical/virus/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/reagent_containers/glass/bottle/flu_virion"), T("/obj/item/weapon/reagent_containers/glass/bottle/cold"), T("/obj/item/weapon/reagent_containers/glass/bottle/epiglottis_virion"), T("/obj/item/weapon/reagent_containers/glass/bottle/liver_enhance_virion"), T("/obj/item/weapon/reagent_containers/glass/bottle/fake_gbs"), T("/obj/item/weapon/reagent_containers/glass/bottle/magnitis"), T("/obj/item/weapon/reagent_containers/glass/bottle/pierrot_throat"), T("/obj/item/weapon/reagent_containers/glass/bottle/brainrot"), T("/obj/item/weapon/reagent_containers/glass/bottle/hullucigen_virion"), T("/obj/item/weapon/reagent_containers/glass/bottle/anxiety"), T("/obj/item/weapon/reagent_containers/glass/bottle/beesease"), T("/obj/item/weapon/storage/box/syringes"), T("/obj/item/weapon/storage/box/beakers"), T("/obj/item/weapon/reagent_containers/glass/bottle/mutagen")));
	return f.dot;
});

rt.type(2190, "/datum/supply_pack/medical/bloodpacks", "/datum/supply_pack/medical", {
	name: "Blood Pack Variety Crate",
	cost: 3500,
	crate_name: "blood freezer",
	contains: null,
	crate_type: rt.typePath("/obj/structure/closet/crate/freezer"),
});

// /datum/supply_pack/medical/bloodpacks/proc/<init>  (code/modules/cargo/packs.dm:823)
rt.def("/datum/supply_pack/medical/bloodpacks/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/reagent_containers/blood/empty"), T("/obj/item/weapon/reagent_containers/blood/empty"), T("/obj/item/weapon/reagent_containers/blood/APlus"), T("/obj/item/weapon/reagent_containers/blood/AMinus"), T("/obj/item/weapon/reagent_containers/blood/BPlus"), T("/obj/item/weapon/reagent_containers/blood/BMinus"), T("/obj/item/weapon/reagent_containers/blood/OPlus"), T("/obj/item/weapon/reagent_containers/blood/OMinus")));
	return f.dot;
});

rt.type(2191, "/datum/supply_pack/medical/iv_drip", "/datum/supply_pack/medical", {
	name: "IV Drip Crate",
	cost: 1000,
	crate_name: "iv drip crate",
	contains: null,
});

// /datum/supply_pack/medical/iv_drip/proc/<init>  (code/modules/cargo/packs.dm:837)
rt.def("/datum/supply_pack/medical/iv_drip/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/machinery/iv_drip")));
	return f.dot;
});

rt.type(2192, "/datum/supply_pack/medical/defibs", "/datum/supply_pack/medical", {
	name: "Defibrillator Crate",
	cost: 2500,
	crate_name: "defibrillator crate",
	contains: null,
});

// /datum/supply_pack/medical/defibs/proc/<init>  (code/modules/cargo/packs.dm:843)
rt.def("/datum/supply_pack/medical/defibs/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/defibrillator/loaded"), T("/obj/item/weapon/defibrillator/loaded")));
	return f.dot;
});

rt.type(2193, "/datum/supply_pack/medical/vending", "/datum/supply_pack/medical", {
	name: "Medical Vending Crate",
	cost: 2000,
	crate_name: "medical vending crate",
	contains: null,
});

// /datum/supply_pack/medical/vending/proc/<init>  (code/modules/cargo/packs.dm:850)
rt.def("/datum/supply_pack/medical/vending/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/vending_refill/medical"), T("/obj/item/weapon/vending_refill/medical"), T("/obj/item/weapon/vending_refill/medical")));
	return f.dot;
});

rt.type(2172, "/datum/supply_pack/science/robotics", "/datum/supply_pack/science", {
	name: "Robotics Assembly Crate",
	cost: 1000,
	crate_name: "robotics assembly crate",
	access: 29,
	contains: null,
	crate_type: rt.typePath("/obj/structure/closet/crate/secure/science"),
});

// /datum/supply_pack/science/robotics/proc/<init>  (code/modules/cargo/packs.dm:867)
rt.def("/datum/supply_pack/science/robotics/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/device/assembly/prox_sensor"), T("/obj/item/device/assembly/prox_sensor"), T("/obj/item/device/assembly/prox_sensor"), T("/obj/item/weapon/storage/toolbox/electrical"), T("/obj/item/weapon/storage/box/flashes"), T("/obj/item/weapon/stock_parts/cell/high"), T("/obj/item/weapon/stock_parts/cell/high")));
	return f.dot;
});

rt.type(2173, "/datum/supply_pack/science/robotics/mecha_ripley", "/datum/supply_pack/science/robotics", {
	name: "Circuit Crate (Ripley APLU)",
	cost: 3000,
	crate_name: "１APLU Ripley circuit crate",
	access: 29,
	contains: null,
	crate_type: rt.typePath("/obj/structure/closet/crate/secure/science"),
});

// /datum/supply_pack/science/robotics/mecha_ripley/proc/<init>  (code/modules/cargo/packs.dm:881)
rt.def("/datum/supply_pack/science/robotics/mecha_ripley/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/book/manual/ripley_build_and_repair"), T("/obj/item/weapon/circuitboard/mecha/ripley/main"), T("/obj/item/weapon/circuitboard/mecha/ripley/peripherals")));
	return f.dot;
});

rt.type(2174, "/datum/supply_pack/science/robotics/mecha_odysseus", "/datum/supply_pack/science/robotics", {
	name: "Circuit Crate (Odysseus)",
	cost: 2500,
	crate_name: "１Odysseus circuit crate",
	access: 29,
	contains: null,
	crate_type: rt.typePath("/obj/structure/closet/crate/secure/science"),
});

// /datum/supply_pack/science/robotics/mecha_odysseus/proc/<init>  (code/modules/cargo/packs.dm:891)
rt.def("/datum/supply_pack/science/robotics/mecha_odysseus/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/circuitboard/mecha/odysseus/peripherals"), T("/obj/item/weapon/circuitboard/mecha/odysseus/main")));
	return f.dot;
});

rt.type(2175, "/datum/supply_pack/science/plasma", "/datum/supply_pack/science", {
	name: "Plasma Assembly Crate",
	cost: 1000,
	crate_name: "plasma assembly crate",
	access: 8,
	contains: null,
	crate_type: rt.typePath("/obj/structure/closet/crate/secure/plasma"),
});

// /datum/supply_pack/science/plasma/proc/<init>  (code/modules/cargo/packs.dm:900)
rt.def("/datum/supply_pack/science/plasma/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/tank/internals/plasma"), T("/obj/item/weapon/tank/internals/plasma"), T("/obj/item/weapon/tank/internals/plasma"), T("/obj/item/device/assembly/igniter"), T("/obj/item/device/assembly/igniter"), T("/obj/item/device/assembly/igniter"), T("/obj/item/device/assembly/prox_sensor"), T("/obj/item/device/assembly/prox_sensor"), T("/obj/item/device/assembly/prox_sensor"), T("/obj/item/device/assembly/timer"), T("/obj/item/device/assembly/timer"), T("/obj/item/device/assembly/timer")));
	return f.dot;
});

rt.type(2176, "/datum/supply_pack/science/shieldwalls", "/datum/supply_pack/science", {
	name: "Shield Generators",
	cost: 2000,
	crate_name: "shield generators crate",
	access: 17,
	contains: null,
	crate_type: rt.typePath("/obj/structure/closet/crate/secure/science"),
});

// /datum/supply_pack/science/shieldwalls/proc/<init>  (code/modules/cargo/packs.dm:919)
rt.def("/datum/supply_pack/science/shieldwalls/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/machinery/shieldwallgen"), T("/obj/machinery/shieldwallgen"), T("/obj/machinery/shieldwallgen"), T("/obj/machinery/shieldwallgen")));
	return f.dot;
});

rt.type(2177, "/datum/supply_pack/science/transfer_valves", "/datum/supply_pack/science", {
	name: "Tank Transfer Valves Crate",
	cost: 6000,
	crate_name: "tank transfer valves crate",
	dangerous: 1,
	access: 30,
	contains: null,
	crate_type: rt.typePath("/obj/structure/closet/crate/secure/science"),
});

// /datum/supply_pack/science/transfer_valves/proc/<init>  (code/modules/cargo/packs.dm:930)
rt.def("/datum/supply_pack/science/transfer_valves/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/device/transfer_valve"), T("/obj/item/device/transfer_valve")));
	return f.dot;
});

rt.type(2178, "/datum/supply_pack/science/bz_canister", "/datum/supply_pack/science", {
	name: "BZ Canister",
	cost: 2000,
	crate_name: "bz canister crate",
	dangerous: 1,
	access_any: null,
	contains: null,
	crate_type: rt.typePath("/obj/structure/closet/crate/secure/science"),
});

// /datum/supply_pack/science/bz_canister/proc/<init>  (code/modules/cargo/packs.dm:940)
rt.def("/datum/supply_pack/science/bz_canister/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "access_any", rt.list(30, 24));
	$0 = $0;
	rt.setSv(f, "contains", rt.list(T("/obj/machinery/portable_atmospherics/canister/bz")));
	return f.dot;
});

rt.type(2179, "/datum/supply_pack/science/freon_canister", "/datum/supply_pack/science", {
	name: "Freon Canister",
	cost: 6000,
	crate_name: "freon canister crate",
	dangerous: 1,
	access_any: null,
	contains: null,
	crate_type: rt.typePath("/obj/structure/closet/crate/secure/science"),
});

// /datum/supply_pack/science/freon_canister/proc/<init>  (code/modules/cargo/packs.dm:949)
rt.def("/datum/supply_pack/science/freon_canister/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "access_any", rt.list(30, 24));
	$0 = $0;
	rt.setSv(f, "contains", rt.list(T("/obj/machinery/portable_atmospherics/canister/freon")));
	return f.dot;
});

rt.type(2180, "/datum/supply_pack/science/research", "/datum/supply_pack/science", {
	name: "Machine Prototype Crate",
	cost: 8000,
	crate_name: "machine prototype crate",
	access: 47,
	contains: null,
	crate_type: rt.typePath("/obj/structure/closet/crate/secure/science"),
});

// /datum/supply_pack/science/research/proc/<init>  (code/modules/cargo/packs.dm:958)
rt.def("/datum/supply_pack/science/research/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/device/machineprototype")));
	return f.dot;
});

rt.type(2181, "/datum/supply_pack/science/tablets", "/datum/supply_pack/science", {
	name: "Tablet Crate",
	cost: 5000,
	crate_name: "tablet crate",
	contains: null,
});

// /datum/supply_pack/science/tablets/proc/<init>  (code/modules/cargo/packs.dm:965)
rt.def("/datum/supply_pack/science/tablets/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/device/modular_computer/tablet/preset/cargo"), T("/obj/item/device/modular_computer/tablet/preset/cargo"), T("/obj/item/device/modular_computer/tablet/preset/cargo"), T("/obj/item/device/modular_computer/tablet/preset/cargo"), T("/obj/item/device/modular_computer/tablet/preset/cargo")));
	return f.dot;
});

rt.type(2195, "/datum/supply_pack/organic/food", "/datum/supply_pack/organic", {
	name: "Food Crate",
	cost: 1000,
	crate_name: "food crate",
	contains: null,
});

// /datum/supply_pack/organic/food/proc/<init>  (code/modules/cargo/packs.dm:983)
rt.def("/datum/supply_pack/organic/food/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/reagent_containers/food/condiment/flour"), T("/obj/item/weapon/reagent_containers/food/condiment/rice"), T("/obj/item/weapon/reagent_containers/food/condiment/milk"), T("/obj/item/weapon/reagent_containers/food/condiment/soymilk"), T("/obj/item/weapon/reagent_containers/food/condiment/saltshaker"), T("/obj/item/weapon/reagent_containers/food/condiment/peppermill"), T("/obj/item/weapon/storage/fancy/egg_box"), T("/obj/item/weapon/reagent_containers/food/condiment/enzyme"), T("/obj/item/weapon/reagent_containers/food/condiment/sugar"), T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/monkey"), T("/obj/item/weapon/reagent_containers/food/snacks/grown/banana"), T("/obj/item/weapon/reagent_containers/food/snacks/grown/banana"), T("/obj/item/weapon/reagent_containers/food/snacks/grown/banana")));
	return f.dot;
});

rt.type(2196, "/datum/supply_pack/organic/pizza", "/datum/supply_pack/organic", {
	name: "Pizza Crate",
	cost: 6000,
	crate_name: "pizza crate",
	contains: null,
});

// /datum/supply_pack/organic/pizza/proc/<init>  (code/modules/cargo/packs.dm:1001)
rt.def("/datum/supply_pack/organic/pizza/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/pizzabox/margherita"), T("/obj/item/pizzabox/mushroom"), T("/obj/item/pizzabox/meat"), T("/obj/item/pizzabox/vegetable")));
	return f.dot;
});

rt.type(2197, "/datum/supply_pack/organic/cream_piee", "/datum/supply_pack/organic", {
	name: "High-yield Clown-grade Cream Pie Crate",
	cost: 6000,
	crate_name: "party equipment crate",
	contraband: 1,
	contains: null,
	access: 46,
	crate_type: rt.typePath("/obj/structure/closet/crate/secure"),
});

// /datum/supply_pack/organic/cream_piee/proc/<init>  (code/modules/cargo/packs.dm:1010)
rt.def("/datum/supply_pack/organic/cream_piee/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/storage/backpack/duffelbag/clown/cream_pie")));
	return f.dot;
});

rt.type(2198, "/datum/supply_pack/organic/monkey", "/datum/supply_pack/organic", {
	name: "Monkey Crate",
	cost: 2000,
	crate_name: "monkey crate",
	contains: null,
});

// /datum/supply_pack/organic/monkey/proc/<init>  (code/modules/cargo/packs.dm:1019)
rt.def("/datum/supply_pack/organic/monkey/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/storage/box/monkeycubes")));
	return f.dot;
});

rt.type(2199, "/datum/supply_pack/organic/party", "/datum/supply_pack/organic", {
	name: "Party Equipment",
	cost: 2000,
	crate_name: "party equipment crate",
	contains: null,
});

// /datum/supply_pack/organic/party/proc/<init>  (code/modules/cargo/packs.dm:1025)
rt.def("/datum/supply_pack/organic/party/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/storage/box/drinkingglasses"), T("/obj/item/weapon/reagent_containers/food/drinks/shaker"), T("/obj/item/weapon/reagent_containers/food/drinks/bottle/patron"), T("/obj/item/weapon/reagent_containers/food/drinks/bottle/goldschlager"), T("/obj/item/weapon/reagent_containers/food/drinks/ale"), T("/obj/item/weapon/reagent_containers/food/drinks/ale"), T("/obj/item/weapon/reagent_containers/food/drinks/beer"), T("/obj/item/weapon/reagent_containers/food/drinks/beer"), T("/obj/item/weapon/reagent_containers/food/drinks/beer"), T("/obj/item/weapon/reagent_containers/food/drinks/beer"), T("/obj/item/device/flashlight/glowstick"), T("/obj/item/device/flashlight/glowstick/red"), T("/obj/item/device/flashlight/glowstick/blue"), T("/obj/item/device/flashlight/glowstick/cyan"), T("/obj/item/device/flashlight/glowstick/orange"), T("/obj/item/device/flashlight/glowstick/yellow"), T("/obj/item/device/flashlight/glowstick/pink")));
	return f.dot;
});

rt.type(2201, "/datum/supply_pack/organic/critter/cow", "/datum/supply_pack/organic/critter", {
	name: "Cow Crate",
	cost: 3000,
	crate_name: "cow crate",
	contains: null,
});

// /datum/supply_pack/organic/critter/cow/proc/<init>  (code/modules/cargo/packs.dm:1050)
rt.def("/datum/supply_pack/organic/critter/cow/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/mob/living/simple_animal/cow")));
	return f.dot;
});

rt.type(2202, "/datum/supply_pack/organic/critter/goat", "/datum/supply_pack/organic/critter", {
	name: "Goat Crate",
	cost: 2500,
	crate_name: "goat crate",
	contains: null,
});

// /datum/supply_pack/organic/critter/goat/proc/<init>  (code/modules/cargo/packs.dm:1056)
rt.def("/datum/supply_pack/organic/critter/goat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/mob/living/simple_animal/hostile/retaliate/goat")));
	return f.dot;
});

rt.type(2203, "/datum/supply_pack/organic/critter/chick", "/datum/supply_pack/organic/critter", {
	name: "Chicken Crate",
	cost: 2000,
	crate_name: "chicken crate",
	contains: null,
});

// /datum/supply_pack/organic/critter/chick/proc/<init>  (code/modules/cargo/packs.dm:1062)
rt.def("/datum/supply_pack/organic/critter/chick/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/mob/living/simple_animal/chick")));
	return f.dot;
});

rt.type(2204, "/datum/supply_pack/organic/critter/corgi", "/datum/supply_pack/organic/critter", {
	name: "Corgi Crate",
	cost: 5000,
	crate_name: "corgi crate",
	contains: null,
});

// /datum/supply_pack/organic/critter/corgi/proc/<init>  (code/modules/cargo/packs.dm:1068)
rt.def("/datum/supply_pack/organic/critter/corgi/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/mob/living/simple_animal/pet/dog/corgi"), T("/obj/item/clothing/neck/petcollar")));
	return f.dot;
});

// /datum/supply_pack/organic/critter/corgi/proc/generate  (code/modules/cargo/packs.dm:1073)  may sleep
rt.def("/datum/supply_pack/organic/critter/corgi/proc/generate", function* generate(f: Frame) {
	let D: Value = null;
	f.vars = () => [D];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.op(f, "Prob", [], [50]))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [(D = rt.locateIn(f, T("/mob/living/simple_animal/pet/dog/corgi"), live(f.dot)))]);
	yield* g.new_(f, T("/mob/living/simple_animal/pet/dog/corgi/Lisa"), [live(f.dot)]);
	return f.dot;
}, true);

rt.type(2205, "/datum/supply_pack/organic/critter/cat", "/datum/supply_pack/organic/critter", {
	name: "Cat Crate",
	cost: 5000,
	crate_name: "cat crate",
	contains: null,
});

// /datum/supply_pack/organic/critter/cat/proc/<init>  (code/modules/cargo/packs.dm:1082)
rt.def("/datum/supply_pack/organic/critter/cat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/mob/living/simple_animal/pet/cat"), T("/obj/item/clothing/neck/petcollar"), T("/obj/item/toy/cattoy")));
	return f.dot;
});

// /datum/supply_pack/organic/critter/cat/proc/generate  (code/modules/cargo/packs.dm:1088)  may sleep
rt.def("/datum/supply_pack/organic/critter/cat/proc/generate", function* generate(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.op(f, "Prob", [], [50]))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [(C = rt.locateIn(f, T("/mob/living/simple_animal/pet/cat"), live(f.dot)))]);
	yield* g.new_(f, T("/mob/living/simple_animal/pet/cat/Proc"), [live(f.dot)]);
	return f.dot;
}, true);

rt.type(2206, "/datum/supply_pack/organic/critter/pug", "/datum/supply_pack/organic/critter", {
	name: "Pug Crate",
	cost: 5000,
	crate_name: "pug crate",
	contains: null,
});

// /datum/supply_pack/organic/critter/pug/proc/<init>  (code/modules/cargo/packs.dm:1097)
rt.def("/datum/supply_pack/organic/critter/pug/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/mob/living/simple_animal/pet/dog/pug"), T("/obj/item/clothing/neck/petcollar")));
	return f.dot;
});

rt.type(2207, "/datum/supply_pack/organic/critter/fox", "/datum/supply_pack/organic/critter", {
	name: "Fox Crate",
	cost: 5000,
	crate_name: "fox crate",
	contains: null,
});

// /datum/supply_pack/organic/critter/fox/proc/<init>  (code/modules/cargo/packs.dm:1104)
rt.def("/datum/supply_pack/organic/critter/fox/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/mob/living/simple_animal/pet/fox"), T("/obj/item/clothing/neck/petcollar")));
	return f.dot;
});

rt.type(2208, "/datum/supply_pack/organic/critter/butterfly", "/datum/supply_pack/organic/critter", {
	name: "Butterflies Crate",
	contraband: 1,
	cost: 5000,
	crate_name: "entomology samples crate",
	contains: null,
});

// /datum/supply_pack/organic/critter/butterfly/proc/<init>  (code/modules/cargo/packs.dm:1112)
rt.def("/datum/supply_pack/organic/critter/butterfly/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/mob/living/simple_animal/butterfly")));
	return f.dot;
});

// /datum/supply_pack/organic/critter/butterfly/proc/generate  (code/modules/cargo/packs.dm:1116)  may sleep
rt.def("/datum/supply_pack/organic/critter/butterfly/proc/generate", function* generate(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	i = null;
	rt.forRange(f, 0, 1, 49, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/mob/living/simple_animal/butterfly"), [live(f.dot)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(2209, "/datum/supply_pack/organic/hydroponics", "/datum/supply_pack/organic", {
	name: "Hydroponics Crate",
	cost: 1500,
	crate_name: "hydroponics crate",
	contains: null,
	crate_type: rt.typePath("/obj/structure/closet/crate/hydroponics"),
});

// /datum/supply_pack/organic/hydroponics/proc/<init>  (code/modules/cargo/packs.dm:1123)
rt.def("/datum/supply_pack/organic/hydroponics/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/reagent_containers/spray/plantbgone"), T("/obj/item/weapon/reagent_containers/spray/plantbgone"), T("/obj/item/weapon/reagent_containers/glass/bottle/ammonia"), T("/obj/item/weapon/reagent_containers/glass/bottle/ammonia"), T("/obj/item/weapon/hatchet"), T("/obj/item/weapon/cultivator"), T("/obj/item/device/plant_analyzer"), T("/obj/item/clothing/gloves/botanic_leather"), T("/obj/item/clothing/suit/apron")));
	return f.dot;
});

rt.type(2210, "/datum/supply_pack/organic/hydroponics/hydrotank", "/datum/supply_pack/organic/hydroponics", {
	name: "Hydroponics Backpack Crate",
	cost: 1000,
	crate_name: "hydroponics backpack crate",
	access: 35,
	contains: null,
	crate_type: rt.typePath("/obj/structure/closet/crate/secure"),
});

// /datum/supply_pack/organic/hydroponics/hydrotank/proc/<init>  (code/modules/cargo/packs.dm:1139)
rt.def("/datum/supply_pack/organic/hydroponics/hydrotank/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/watertank")));
	return f.dot;
});

rt.type(2215, "/datum/supply_pack/organic/potted_plants", "/datum/supply_pack/organic", {
	name: "Potted Plants Crate",
	cost: 700,
	crate_name: "potted plants crate",
	contains: null,
	crate_type: rt.typePath("/obj/structure/closet/crate/hydroponics"),
});

// /datum/supply_pack/organic/potted_plants/proc/<init>  (code/modules/cargo/packs.dm:1146)
rt.def("/datum/supply_pack/organic/potted_plants/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/twohanded/required/kirbyplants/random"), T("/obj/item/weapon/twohanded/required/kirbyplants/random"), T("/obj/item/weapon/twohanded/required/kirbyplants/random"), T("/obj/item/weapon/twohanded/required/kirbyplants/random"), T("/obj/item/weapon/twohanded/required/kirbyplants/random")));
	return f.dot;
});

rt.type(2211, "/datum/supply_pack/organic/hydroponics/seeds", "/datum/supply_pack/organic/hydroponics", {
	name: "Seeds Crate",
	cost: 1000,
	crate_name: "seeds crate",
	contains: null,
});

// /datum/supply_pack/organic/hydroponics/seeds/proc/<init>  (code/modules/cargo/packs.dm:1157)
rt.def("/datum/supply_pack/organic/hydroponics/seeds/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/seeds/chili"), T("/obj/item/seeds/berry"), T("/obj/item/seeds/corn"), T("/obj/item/seeds/eggplant"), T("/obj/item/seeds/tomato"), T("/obj/item/seeds/soya"), T("/obj/item/seeds/wheat"), T("/obj/item/seeds/wheat/rice"), T("/obj/item/seeds/carrot"), T("/obj/item/seeds/sunflower"), T("/obj/item/seeds/chanter"), T("/obj/item/seeds/potato"), T("/obj/item/seeds/sugarcane")));
	return f.dot;
});

rt.type(2212, "/datum/supply_pack/organic/hydroponics/exoticseeds", "/datum/supply_pack/organic/hydroponics", {
	name: "Exotic Seeds Crate",
	cost: 1500,
	crate_name: "exotic seeds crate",
	contains: null,
});

// /datum/supply_pack/organic/hydroponics/exoticseeds/proc/<init>  (code/modules/cargo/packs.dm:1175)
rt.def("/datum/supply_pack/organic/hydroponics/exoticseeds/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/seeds/nettle"), T("/obj/item/seeds/replicapod"), T("/obj/item/seeds/replicapod"), T("/obj/item/seeds/replicapod"), T("/obj/item/seeds/plump"), T("/obj/item/seeds/liberty"), T("/obj/item/seeds/amanita"), T("/obj/item/seeds/reishi"), T("/obj/item/seeds/banana"), T("/obj/item/seeds/eggplant/eggy"), T("/obj/item/seeds/random"), T("/obj/item/seeds/random")));
	return f.dot;
});

rt.type(2213, "/datum/supply_pack/organic/hydroponics/beekeeping_fullkit", "/datum/supply_pack/organic/hydroponics", {
	name: "Beekeeping Starter Crate",
	cost: 1500,
	crate_name: "beekeeping starter crate",
	contains: null,
});

// /datum/supply_pack/organic/hydroponics/beekeeping_fullkit/proc/<init>  (code/modules/cargo/packs.dm:1192)
rt.def("/datum/supply_pack/organic/hydroponics/beekeeping_fullkit/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/structure/beebox"), T("/obj/item/honey_frame"), T("/obj/item/honey_frame"), T("/obj/item/honey_frame"), T("/obj/item/queen_bee/bought"), T("/obj/item/clothing/head/beekeeper_head"), T("/obj/item/clothing/suit/beekeeper_suit"), T("/obj/item/weapon/melee/flyswatter")));
	return f.dot;
});

rt.type(2214, "/datum/supply_pack/organic/hydroponics/beekeeping_suits", "/datum/supply_pack/organic/hydroponics", {
	name: "Beekeeper Suit Crate",
	cost: 1000,
	crate_name: "beekeeper suits",
	contains: null,
});

// /datum/supply_pack/organic/hydroponics/beekeeping_suits/proc/<init>  (code/modules/cargo/packs.dm:1205)
rt.def("/datum/supply_pack/organic/hydroponics/beekeeping_suits/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/clothing/head/beekeeper_head"), T("/obj/item/clothing/suit/beekeeper_suit"), T("/obj/item/clothing/head/beekeeper_head"), T("/obj/item/clothing/suit/beekeeper_suit")));
	return f.dot;
});

rt.type(2216, "/datum/supply_pack/organic/vending", "/datum/supply_pack/organic", {
	name: "Bartending Supply Crate",
	cost: 2000,
	crate_name: "bartending supply crate",
	contains: null,
});

// /datum/supply_pack/organic/vending/proc/<init>  (code/modules/cargo/packs.dm:1214)
rt.def("/datum/supply_pack/organic/vending/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/vending_refill/boozeomat"), T("/obj/item/weapon/vending_refill/boozeomat"), T("/obj/item/weapon/vending_refill/boozeomat"), T("/obj/item/weapon/vending_refill/coffee"), T("/obj/item/weapon/vending_refill/coffee"), T("/obj/item/weapon/vending_refill/coffee")));
	return f.dot;
});

rt.type(2217, "/datum/supply_pack/organic/vending/snack", "/datum/supply_pack/organic/vending", {
	name: "Snack Supply Crate",
	cost: 1500,
	crate_name: "snacks supply crate",
	contains: null,
});

// /datum/supply_pack/organic/vending/snack/proc/<init>  (code/modules/cargo/packs.dm:1225)
rt.def("/datum/supply_pack/organic/vending/snack/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/vending_refill/snack"), T("/obj/item/weapon/vending_refill/snack"), T("/obj/item/weapon/vending_refill/snack")));
	return f.dot;
});

rt.type(2218, "/datum/supply_pack/organic/vending/cola", "/datum/supply_pack/organic/vending", {
	name: "Softdrinks Supply Crate",
	cost: 1500,
	crate_name: "soft drinks supply crate",
	contains: null,
});

// /datum/supply_pack/organic/vending/cola/proc/<init>  (code/modules/cargo/packs.dm:1233)
rt.def("/datum/supply_pack/organic/vending/cola/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/vending_refill/cola"), T("/obj/item/weapon/vending_refill/cola"), T("/obj/item/weapon/vending_refill/cola")));
	return f.dot;
});

rt.type(2219, "/datum/supply_pack/organic/vending/cigarette", "/datum/supply_pack/organic/vending", {
	name: "Cigarette Supply Crate",
	cost: 1500,
	crate_name: "cigarette supply crate",
	contains: null,
});

// /datum/supply_pack/organic/vending/cigarette/proc/<init>  (code/modules/cargo/packs.dm:1241)
rt.def("/datum/supply_pack/organic/vending/cigarette/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/vending_refill/cigarette"), T("/obj/item/weapon/vending_refill/cigarette"), T("/obj/item/weapon/vending_refill/cigarette")));
	return f.dot;
});

rt.type(2221, "/datum/supply_pack/materials/metal50", "/datum/supply_pack/materials", {
	name: "50 Metal Sheets",
	cost: 1000,
	crate_name: "metal sheets crate",
	contains: null,
});

// /datum/supply_pack/materials/metal50/proc/<init>  (code/modules/cargo/packs.dm:1256)
rt.def("/datum/supply_pack/materials/metal50/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/stack/sheet/metal/fifty")));
	return f.dot;
});

rt.type(2222, "/datum/supply_pack/materials/plasteel20", "/datum/supply_pack/materials", {
	name: "20 Plasteel Sheets",
	cost: 7500,
	crate_name: "plasteel sheets crate",
	contains: null,
});

// /datum/supply_pack/materials/plasteel20/proc/<init>  (code/modules/cargo/packs.dm:1262)
rt.def("/datum/supply_pack/materials/plasteel20/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/stack/sheet/plasteel/twenty")));
	return f.dot;
});

rt.type(2223, "/datum/supply_pack/materials/plasteel50", "/datum/supply_pack/materials", {
	name: "50 Plasteel Sheets",
	cost: 16500,
	crate_name: "plasteel sheets crate",
	contains: null,
});

// /datum/supply_pack/materials/plasteel50/proc/<init>  (code/modules/cargo/packs.dm:1268)
rt.def("/datum/supply_pack/materials/plasteel50/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/stack/sheet/plasteel/fifty")));
	return f.dot;
});

rt.type(2224, "/datum/supply_pack/materials/glass50", "/datum/supply_pack/materials", {
	name: "50 Glass Sheets",
	cost: 1000,
	crate_name: "glass sheets crate",
	contains: null,
});

// /datum/supply_pack/materials/glass50/proc/<init>  (code/modules/cargo/packs.dm:1274)
rt.def("/datum/supply_pack/materials/glass50/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/stack/sheet/glass/fifty")));
	return f.dot;
});

rt.type(2225, "/datum/supply_pack/materials/wood50", "/datum/supply_pack/materials", {
	name: "50 Wood Planks",
	cost: 2000,
	crate_name: "wood planks crate",
	contains: null,
});

// /datum/supply_pack/materials/wood50/proc/<init>  (code/modules/cargo/packs.dm:1280)
rt.def("/datum/supply_pack/materials/wood50/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/stack/sheet/mineral/wood/fifty")));
	return f.dot;
});

rt.type(2226, "/datum/supply_pack/materials/cardboard50", "/datum/supply_pack/materials", {
	name: "50 Cardboard Sheets",
	cost: 1000,
	crate_name: "cardboard sheets crate",
	contains: null,
});

// /datum/supply_pack/materials/cardboard50/proc/<init>  (code/modules/cargo/packs.dm:1286)
rt.def("/datum/supply_pack/materials/cardboard50/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/stack/sheet/cardboard/fifty")));
	return f.dot;
});

rt.type(2227, "/datum/supply_pack/materials/plastic50", "/datum/supply_pack/materials", {
	name: "50 Plastic Sheets",
	cost: 1000,
	crate_name: "plastic sheets crate",
	contains: null,
});

// /datum/supply_pack/materials/plastic50/proc/<init>  (code/modules/cargo/packs.dm:1292)
rt.def("/datum/supply_pack/materials/plastic50/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/stack/sheet/plastic/fifty")));
	return f.dot;
});

rt.type(2228, "/datum/supply_pack/materials/sandstone30", "/datum/supply_pack/materials", {
	name: "30 Sandstone Blocks",
	cost: 1000,
	crate_name: "sandstone blocks crate",
	contains: null,
});

// /datum/supply_pack/materials/sandstone30/proc/<init>  (code/modules/cargo/packs.dm:1298)
rt.def("/datum/supply_pack/materials/sandstone30/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/stack/sheet/mineral/sandstone/thirty")));
	return f.dot;
});

rt.type(2230, "/datum/supply_pack/misc/minerkit", "/datum/supply_pack/misc", {
	name: "Shaft Miner Starter Kit",
	cost: 2500,
	crate_name: "shaft miner starter kit",
	access: 41,
	contains: null,
	crate_type: rt.typePath("/obj/structure/closet/crate/secure"),
});

// /datum/supply_pack/misc/minerkit/proc/<init>  (code/modules/cargo/packs.dm:1312)
rt.def("/datum/supply_pack/misc/minerkit/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/pickaxe/mini"), T("/obj/item/clothing/glasses/meson"), T("/obj/item/device/t_scanner/adv_mining_scanner/lesser"), T("/obj/item/device/radio/headset/headset_cargo/mining"), T("/obj/item/weapon/storage/bag/ore"), T("/obj/item/clothing/suit/hooded/explorer"), T("/obj/item/clothing/mask/gas/explorer")));
	return f.dot;
});

rt.type(2231, "/datum/supply_pack/misc/mule", "/datum/supply_pack/misc", {
	name: "MULEbot Crate",
	cost: 2000,
	crate_name: "１MULEbot Crate",
	contains: null,
	crate_type: rt.typePath("/obj/structure/closet/crate/large"),
});

// /datum/supply_pack/misc/mule/proc/<init>  (code/modules/cargo/packs.dm:1325)
rt.def("/datum/supply_pack/misc/mule/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/mob/living/simple_animal/bot/mulebot")));
	return f.dot;
});

rt.type(2232, "/datum/supply_pack/misc/conveyor", "/datum/supply_pack/misc", {
	name: "Conveyor Assembly Crate",
	cost: 1500,
	crate_name: "conveyor assembly crate",
	contains: null,
});

// /datum/supply_pack/misc/conveyor/proc/<init>  (code/modules/cargo/packs.dm:1332)
rt.def("/datum/supply_pack/misc/conveyor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/conveyor_construct"), T("/obj/item/conveyor_construct"), T("/obj/item/conveyor_construct"), T("/obj/item/conveyor_construct"), T("/obj/item/conveyor_construct"), T("/obj/item/conveyor_construct"), T("/obj/item/conveyor_switch_construct"), T("/obj/item/weapon/paper/conveyor")));
	return f.dot;
});

rt.type(2233, "/datum/supply_pack/misc/watertank", "/datum/supply_pack/misc", {
	name: "Water Tank Crate",
	cost: 600,
	crate_name: "water tank crate",
	contains: null,
	crate_type: rt.typePath("/obj/structure/closet/crate/large"),
});

// /datum/supply_pack/misc/watertank/proc/<init>  (code/modules/cargo/packs.dm:1345)
rt.def("/datum/supply_pack/misc/watertank/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/structure/reagent_dispensers/watertank")));
	return f.dot;
});

rt.type(2234, "/datum/supply_pack/misc/hightank", "/datum/supply_pack/misc", {
	name: "High-Capacity Water Tank Crate",
	cost: 1200,
	crate_name: "high-capacity water tank crate",
	contains: null,
	crate_type: rt.typePath("/obj/structure/closet/crate/large"),
});

// /datum/supply_pack/misc/hightank/proc/<init>  (code/modules/cargo/packs.dm:1352)
rt.def("/datum/supply_pack/misc/hightank/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/structure/reagent_dispensers/watertank/high")));
	return f.dot;
});

rt.type(2235, "/datum/supply_pack/misc/water_vapor", "/datum/supply_pack/misc", {
	name: "Water Vapor Canister",
	cost: 2500,
	crate_name: "water vapor canister crate",
	contains: null,
	crate_type: rt.typePath("/obj/structure/closet/crate/large"),
});

// /datum/supply_pack/misc/water_vapor/proc/<init>  (code/modules/cargo/packs.dm:1359)
rt.def("/datum/supply_pack/misc/water_vapor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/machinery/portable_atmospherics/canister/water_vapor")));
	return f.dot;
});

rt.type(2236, "/datum/supply_pack/misc/lasertag", "/datum/supply_pack/misc", {
	name: "Laser Tag Crate",
	cost: 1500,
	crate_name: "laser tag crate",
	contains: null,
});

// /datum/supply_pack/misc/lasertag/proc/<init>  (code/modules/cargo/packs.dm:1366)
rt.def("/datum/supply_pack/misc/lasertag/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/gun/energy/laser/redtag"), T("/obj/item/weapon/gun/energy/laser/redtag"), T("/obj/item/weapon/gun/energy/laser/redtag"), T("/obj/item/weapon/gun/energy/laser/bluetag"), T("/obj/item/weapon/gun/energy/laser/bluetag"), T("/obj/item/weapon/gun/energy/laser/bluetag"), T("/obj/item/clothing/suit/redtag"), T("/obj/item/clothing/suit/redtag"), T("/obj/item/clothing/suit/redtag"), T("/obj/item/clothing/suit/bluetag"), T("/obj/item/clothing/suit/bluetag"), T("/obj/item/clothing/suit/bluetag"), T("/obj/item/clothing/head/helmet/redtaghelm"), T("/obj/item/clothing/head/helmet/redtaghelm"), T("/obj/item/clothing/head/helmet/redtaghelm"), T("/obj/item/clothing/head/helmet/bluetaghelm"), T("/obj/item/clothing/head/helmet/bluetaghelm"), T("/obj/item/clothing/head/helmet/bluetaghelm")));
	return f.dot;
});

rt.type(2237, "/datum/supply_pack/misc/lasertag/pins", "/datum/supply_pack/misc/lasertag", {
	name: "Laser Tag Firing Pins Crate",
	cost: 3000,
	contraband: 1,
	crate_name: "laser tag crate",
	contains: null,
});

// /datum/supply_pack/misc/lasertag/pins/proc/<init>  (code/modules/cargo/packs.dm:1390)
rt.def("/datum/supply_pack/misc/lasertag/pins/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/storage/box/lasertagpins")));
	return f.dot;
});

rt.type(2238, "/datum/supply_pack/misc/clownpin", "/datum/supply_pack/misc", {
	name: "Hilarious Firing Pin Crate",
	cost: 5000,
	contraband: 1,
	crate_name: "toy crate",
	contains: null,
});

// /datum/supply_pack/misc/clownpin/proc/<init>  (code/modules/cargo/packs.dm:1397)
rt.def("/datum/supply_pack/misc/clownpin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/device/firing_pin/clown")));
	return f.dot;
});

rt.type(2239, "/datum/supply_pack/misc/religious_supplies", "/datum/supply_pack/misc", {
	name: "Religious Supplies Crate",
	cost: 4000,
	crate_name: "religious supplies crate",
	contains: null,
});

// /datum/supply_pack/misc/religious_supplies/proc/<init>  (code/modules/cargo/packs.dm:1404)
rt.def("/datum/supply_pack/misc/religious_supplies/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/reagent_containers/food/drinks/bottle/holywater"), T("/obj/item/weapon/reagent_containers/food/drinks/bottle/holywater"), T("/obj/item/weapon/storage/book/bible/booze"), T("/obj/item/weapon/storage/book/bible/booze"), T("/obj/item/clothing/suit/hooded/chaplain_hoodie"), T("/obj/item/clothing/suit/hooded/chaplain_hoodie"), T("/obj/item/clothing/under/burial"), T("/obj/item/clothing/under/burial")));
	return f.dot;
});

rt.type(2240, "/datum/supply_pack/misc/book_crate", "/datum/supply_pack/misc", {
	name: "Book Crate",
	cost: 1500,
	contains: null,
});

// /datum/supply_pack/misc/book_crate/proc/<init>  (code/modules/cargo/packs.dm:1417)
rt.def("/datum/supply_pack/misc/book_crate/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/book/codex_gigas"), T("/obj/item/weapon/book/manual/random"), T("/obj/item/weapon/book/manual/random"), T("/obj/item/weapon/book/manual/random"), T("/obj/item/weapon/book/random/triple")));
	return f.dot;
});

rt.type(2241, "/datum/supply_pack/misc/paper", "/datum/supply_pack/misc", {
	name: "Bureaucracy Crate",
	cost: 1500,
	crate_name: "bureaucracy crate",
	contains: null,
});

// /datum/supply_pack/misc/paper/proc/<init>  (code/modules/cargo/packs.dm:1426)
rt.def("/datum/supply_pack/misc/paper/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/structure/filingcabinet/chestdrawer/wheeled"), T("/obj/item/device/camera_film"), T("/obj/item/weapon/hand_labeler"), T("/obj/item/hand_labeler_refill"), T("/obj/item/hand_labeler_refill"), T("/obj/item/weapon/paper_bin"), T("/obj/item/weapon/pen/fourcolor"), T("/obj/item/weapon/pen/fourcolor"), T("/obj/item/weapon/pen"), T("/obj/item/weapon/pen/fountain"), T("/obj/item/weapon/pen/blue"), T("/obj/item/weapon/pen/red"), T("/obj/item/weapon/folder/blue"), T("/obj/item/weapon/folder/red"), T("/obj/item/weapon/folder/yellow"), T("/obj/item/weapon/clipboard"), T("/obj/item/weapon/clipboard"), T("/obj/item/weapon/stamp"), T("/obj/item/weapon/stamp/denied")));
	return f.dot;
});

rt.type(2242, "/datum/supply_pack/misc/fountainpens", "/datum/supply_pack/misc", {
	name: "Calligraphy Crate",
	cost: 700,
	contains: null,
	crate_type: rt.typePath("/obj/structure/closet/crate/wooden"),
});

// /datum/supply_pack/misc/fountainpens/proc/<init>  (code/modules/cargo/packs.dm:1450)
rt.def("/datum/supply_pack/misc/fountainpens/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/storage/box/fountainpens")));
	return f.dot;
});

rt.type(2243, "/datum/supply_pack/misc/toner", "/datum/supply_pack/misc", {
	name: "Toner Crate",
	cost: 1000,
	crate_name: "toner crate",
	contains: null,
});

// /datum/supply_pack/misc/toner/proc/<init>  (code/modules/cargo/packs.dm:1456)
rt.def("/datum/supply_pack/misc/toner/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/device/toner"), T("/obj/item/device/toner"), T("/obj/item/device/toner"), T("/obj/item/device/toner"), T("/obj/item/device/toner"), T("/obj/item/device/toner")));
	return f.dot;
});

rt.type(2244, "/datum/supply_pack/misc/janitor", "/datum/supply_pack/misc", {
	name: "Janitorial Supplies Crate",
	cost: 1000,
	crate_name: "janitorial supplies crate",
	contains: null,
});

// /datum/supply_pack/misc/janitor/proc/<init>  (code/modules/cargo/packs.dm:1467)
rt.def("/datum/supply_pack/misc/janitor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/reagent_containers/glass/bucket"), T("/obj/item/weapon/reagent_containers/glass/bucket"), T("/obj/item/weapon/reagent_containers/glass/bucket"), T("/obj/item/weapon/mop"), T("/obj/item/weapon/caution"), T("/obj/item/weapon/caution"), T("/obj/item/weapon/caution"), T("/obj/item/weapon/storage/bag/trash"), T("/obj/item/weapon/reagent_containers/spray/cleaner"), T("/obj/item/weapon/reagent_containers/glass/rag"), T("/obj/item/weapon/grenade/chem_grenade/cleaner"), T("/obj/item/weapon/grenade/chem_grenade/cleaner"), T("/obj/item/weapon/grenade/chem_grenade/cleaner")));
	return f.dot;
});

rt.type(2245, "/datum/supply_pack/misc/janitor/janicart", "/datum/supply_pack/misc/janitor", {
	name: "Janitorial Cart and Galoshes Crate",
	cost: 2000,
	crate_name: "janitorial cart crate",
	contains: null,
	crate_type: rt.typePath("/obj/structure/closet/crate/large"),
});

// /datum/supply_pack/misc/janitor/janicart/proc/<init>  (code/modules/cargo/packs.dm:1485)
rt.def("/datum/supply_pack/misc/janitor/janicart/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/structure/janitorialcart"), T("/obj/item/clothing/shoes/galoshes")));
	return f.dot;
});

rt.type(2246, "/datum/supply_pack/misc/janitor/janitank", "/datum/supply_pack/misc/janitor", {
	name: "Janitor Backpack Crate",
	cost: 1000,
	crate_name: "janitor backpack crate",
	access: 26,
	contains: null,
	crate_type: rt.typePath("/obj/structure/closet/crate/secure"),
});

// /datum/supply_pack/misc/janitor/janitank/proc/<init>  (code/modules/cargo/packs.dm:1494)
rt.def("/datum/supply_pack/misc/janitor/janitank/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/watertank/janitor")));
	return f.dot;
});

rt.type(2247, "/datum/supply_pack/misc/janitor/lightbulbs", "/datum/supply_pack/misc/janitor", {
	name: "Replacement Lights",
	cost: 1000,
	crate_name: "replacement lights",
	contains: null,
});

// /datum/supply_pack/misc/janitor/lightbulbs/proc/<init>  (code/modules/cargo/packs.dm:1501)
rt.def("/datum/supply_pack/misc/janitor/lightbulbs/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/storage/box/lights/mixed"), T("/obj/item/weapon/storage/box/lights/mixed"), T("/obj/item/weapon/storage/box/lights/mixed")));
	return f.dot;
});

rt.type(2248, "/datum/supply_pack/misc/noslipfloor", "/datum/supply_pack/misc", {
	name: "High-traction Floor Tiles",
	cost: 2000,
	crate_name: "high-traction floor tiles crate",
	contains: null,
});

// /datum/supply_pack/misc/noslipfloor/proc/<init>  (code/modules/cargo/packs.dm:1509)
rt.def("/datum/supply_pack/misc/noslipfloor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/stack/tile/noslip/thirty")));
	return f.dot;
});

rt.type(2249, "/datum/supply_pack/misc/plasmaman", "/datum/supply_pack/misc", {
	name: "Plasmaman Supply Kit",
	cost: 2000,
	crate_name: "plasmaman supply kit",
	contains: null,
});

// /datum/supply_pack/misc/plasmaman/proc/<init>  (code/modules/cargo/packs.dm:1515)
rt.def("/datum/supply_pack/misc/plasmaman/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/clothing/under/plasmaman"), T("/obj/item/clothing/under/plasmaman"), T("/obj/item/weapon/tank/internals/plasmaman/belt/full"), T("/obj/item/weapon/tank/internals/plasmaman/belt/full"), T("/obj/item/clothing/head/helmet/space/plasmaman"), T("/obj/item/clothing/head/helmet/space/plasmaman")));
	return f.dot;
});

rt.type(2250, "/datum/supply_pack/misc/costume", "/datum/supply_pack/misc", {
	name: "Standard Costume Crate",
	cost: 1000,
	crate_name: "standard costume crate",
	access: 46,
	contains: null,
	crate_type: rt.typePath("/obj/structure/closet/crate/secure"),
});

// /datum/supply_pack/misc/costume/proc/<init>  (code/modules/cargo/packs.dm:1527)
rt.def("/datum/supply_pack/misc/costume/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/storage/backpack/clown"), T("/obj/item/clothing/shoes/clown_shoes"), T("/obj/item/clothing/mask/gas/clown_hat"), T("/obj/item/clothing/under/rank/clown"), T("/obj/item/weapon/bikehorn"), T("/obj/item/clothing/under/rank/mime"), T("/obj/item/clothing/shoes/sneakers/black"), T("/obj/item/clothing/gloves/color/white"), T("/obj/item/clothing/mask/gas/mime"), T("/obj/item/clothing/head/beret"), T("/obj/item/clothing/suit/suspenders"), T("/obj/item/weapon/reagent_containers/food/drinks/bottle/bottleofnothing"), T("/obj/item/weapon/storage/backpack/mime")));
	return f.dot;
});

rt.type(2251, "/datum/supply_pack/misc/costume_original", "/datum/supply_pack/misc", {
	name: "Original Costume Crate",
	cost: 1000,
	crate_name: "original costume crate",
	contains: null,
});

// /datum/supply_pack/misc/costume_original/proc/<init>  (code/modules/cargo/packs.dm:1546)
rt.def("/datum/supply_pack/misc/costume_original/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/clothing/head/snowman"), T("/obj/item/clothing/suit/snowman"), T("/obj/item/clothing/head/chicken"), T("/obj/item/clothing/suit/chickensuit"), T("/obj/item/clothing/mask/gas/monkeymask"), T("/obj/item/clothing/suit/monkeysuit"), T("/obj/item/clothing/head/cardborg"), T("/obj/item/clothing/suit/cardborg"), T("/obj/item/clothing/head/xenos"), T("/obj/item/clothing/suit/xenos"), T("/obj/item/clothing/suit/hooded/ian_costume"), T("/obj/item/clothing/suit/hooded/carp_costume"), T("/obj/item/clothing/suit/hooded/bee_costume")));
	return f.dot;
});

rt.type(2252, "/datum/supply_pack/misc/wizard", "/datum/supply_pack/misc", {
	name: "Wizard Costume Crate",
	cost: 2000,
	crate_name: "wizard costume crate",
	contains: null,
});

// /datum/supply_pack/misc/wizard/proc/<init>  (code/modules/cargo/packs.dm:1564)
rt.def("/datum/supply_pack/misc/wizard/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/staff"), T("/obj/item/clothing/suit/wizrobe/fake"), T("/obj/item/clothing/shoes/sandal"), T("/obj/item/clothing/head/wizard/fake")));
	return f.dot;
});

rt.type(2253, "/datum/supply_pack/misc/randomised", "/datum/supply_pack/misc", {
	num_contained: 3,
	name: "Collectable Hats Crate!",
	cost: 20000,
	crate_name: "collectable hats crate",
	contains: null,
});

// /datum/supply_pack/misc/randomised/proc/<init>  (code/modules/cargo/packs.dm:1574)
rt.def("/datum/supply_pack/misc/randomised/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/clothing/head/collectable/chef"), T("/obj/item/clothing/head/collectable/paper"), T("/obj/item/clothing/head/collectable/tophat"), T("/obj/item/clothing/head/collectable/captain"), T("/obj/item/clothing/head/collectable/beret"), T("/obj/item/clothing/head/collectable/welding"), T("/obj/item/clothing/head/collectable/flatcap"), T("/obj/item/clothing/head/collectable/pirate"), T("/obj/item/clothing/head/collectable/kitty"), T("/obj/item/clothing/head/collectable/rabbitears"), T("/obj/item/clothing/head/collectable/wizard"), T("/obj/item/clothing/head/collectable/hardhat"), T("/obj/item/clothing/head/collectable/HoS"), T("/obj/item/clothing/head/collectable/HoP"), T("/obj/item/clothing/head/collectable/thunderdome"), T("/obj/item/clothing/head/collectable/swat"), T("/obj/item/clothing/head/collectable/slime"), T("/obj/item/clothing/head/collectable/police"), T("/obj/item/clothing/head/collectable/slime"), T("/obj/item/clothing/head/collectable/xenom"), T("/obj/item/clothing/head/collectable/petehat")));
	return f.dot;
});

// /datum/supply_pack/misc/randomised/proc/fill  (code/modules/cargo/packs.dm:1598)  may sleep
rt.def("/datum/supply_pack/misc/randomised/proc/fill", function* fill(f: Frame, C: Value) {
	let L: Value = null, i: Value = null, item: Value = null;
	let $e: any;
	f.vars = () => [C, L, i, item, $e];
	L = (yield* g.callName(f, rt.sv(f, "contains"), "Copy", []));
	i = null;
	rt.forRange(f, 0, 1, rt.sv(f, "num_contained"), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		item = (yield* g.call(f, P("/proc/pick_n_take"), null, [live(L)]));
		yield* g.new_(f, live(item), [live(C)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(2254, "/datum/supply_pack/misc/randomised/contraband", "/datum/supply_pack/misc/randomised", {
	name: "Contraband Crate",
	contraband: 1,
	cost: 3000,
	num_contained: 5,
	crate_name: "crate",
	contains: null,
});

// /datum/supply_pack/misc/randomised/contraband/proc/<init>  (code/modules/cargo/packs.dm:1609)
rt.def("/datum/supply_pack/misc/randomised/contraband/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/poster/random_contraband"), T("/obj/item/weapon/storage/fancy/cigarettes/cigpack_shadyjims"), T("/obj/item/weapon/storage/fancy/cigarettes/cigpack_midori"), T("/obj/item/seeds/ambrosia/deus"), T("/obj/item/clothing/neck/necklace/dope")));
	return f.dot;
});

rt.type(2255, "/datum/supply_pack/misc/randomised/toys", "/datum/supply_pack/misc/randomised", {
	name: "Toy Crate",
	cost: 5000,
	num_contained: 5,
	crate_name: "toy crate",
	contains: null,
});

// /datum/supply_pack/misc/randomised/toys/proc/<init>  (code/modules/cargo/packs.dm:1621)
rt.def("/datum/supply_pack/misc/randomised/toys/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/toy/spinningtoy"), T("/obj/item/toy/sword"), T("/obj/item/toy/foamblade"), T("/obj/item/toy/talking/AI"), T("/obj/item/toy/talking/owl"), T("/obj/item/toy/talking/griffin"), T("/obj/item/toy/nuke"), T("/obj/item/toy/minimeteor"), T("/obj/item/toy/carpplushie"), T("/obj/item/weapon/coin/antagtoken"), T("/obj/item/stack/tile/fakespace/loaded"), T("/obj/item/weapon/gun/ballistic/shotgun/toy/crossbow"), T("/obj/item/toy/redbutton"), T("/obj/item/toy/eightball")));
	return f.dot;
});

rt.type(2256, "/datum/supply_pack/misc/autodrobe", "/datum/supply_pack/misc", {
	name: "Autodrobe Supply Crate",
	cost: 1500,
	crate_name: "autodrobe supply crate",
	contains: null,
});

// /datum/supply_pack/misc/autodrobe/proc/<init>  (code/modules/cargo/packs.dm:1640)
rt.def("/datum/supply_pack/misc/autodrobe/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/vending_refill/autodrobe"), T("/obj/item/weapon/vending_refill/autodrobe")));
	return f.dot;
});

rt.type(2257, "/datum/supply_pack/misc/formalwear", "/datum/supply_pack/misc", {
	name: "Formalwear Crate",
	cost: 3000,
	crate_name: "formalwear crate",
	contains: null,
});

// /datum/supply_pack/misc/formalwear/proc/<init>  (code/modules/cargo/packs.dm:1647)
rt.def("/datum/supply_pack/misc/formalwear/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/clothing/under/blacktango"), T("/obj/item/clothing/under/assistantformal"), T("/obj/item/clothing/under/assistantformal"), T("/obj/item/clothing/under/lawyer/bluesuit"), T("/obj/item/clothing/suit/toggle/lawyer"), T("/obj/item/clothing/under/lawyer/purpsuit"), T("/obj/item/clothing/suit/toggle/lawyer/purple"), T("/obj/item/clothing/under/lawyer/blacksuit"), T("/obj/item/clothing/suit/toggle/lawyer/black"), T("/obj/item/clothing/accessory/waistcoat"), T("/obj/item/clothing/neck/tie/blue"), T("/obj/item/clothing/neck/tie/red"), T("/obj/item/clothing/neck/tie/black"), T("/obj/item/clothing/head/bowler"), T("/obj/item/clothing/head/fedora"), T("/obj/item/clothing/head/flatcap"), T("/obj/item/clothing/head/beret"), T("/obj/item/clothing/head/that"), T("/obj/item/clothing/shoes/laceup"), T("/obj/item/clothing/shoes/laceup"), T("/obj/item/clothing/shoes/laceup"), T("/obj/item/clothing/under/suit_jacket/charcoal"), T("/obj/item/clothing/under/suit_jacket/navy"), T("/obj/item/clothing/under/suit_jacket/burgundy"), T("/obj/item/clothing/under/suit_jacket/checkered"), T("/obj/item/clothing/under/suit_jacket/tan"), T("/obj/item/weapon/lipstick/random")));
	return f.dot;
});

rt.type(2258, "/datum/supply_pack/misc/foamforce", "/datum/supply_pack/misc", {
	name: "Foam Force Crate",
	cost: 1000,
	crate_name: "foam force crate",
	contains: null,
});

// /datum/supply_pack/misc/foamforce/proc/<init>  (code/modules/cargo/packs.dm:1679)
rt.def("/datum/supply_pack/misc/foamforce/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/gun/ballistic/shotgun/toy"), T("/obj/item/weapon/gun/ballistic/shotgun/toy"), T("/obj/item/weapon/gun/ballistic/shotgun/toy"), T("/obj/item/weapon/gun/ballistic/shotgun/toy"), T("/obj/item/weapon/gun/ballistic/shotgun/toy"), T("/obj/item/weapon/gun/ballistic/shotgun/toy"), T("/obj/item/weapon/gun/ballistic/shotgun/toy"), T("/obj/item/weapon/gun/ballistic/shotgun/toy")));
	return f.dot;
});

rt.type(2259, "/datum/supply_pack/misc/foamforce/bonus", "/datum/supply_pack/misc/foamforce", {
	name: "Foam Force Pistols Crate",
	contraband: 1,
	cost: 4000,
	crate_name: "foam force crate",
	contains: null,
});

// /datum/supply_pack/misc/foamforce/bonus/proc/<init>  (code/modules/cargo/packs.dm:1693)
rt.def("/datum/supply_pack/misc/foamforce/bonus/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/gun/ballistic/automatic/toy/pistol"), T("/obj/item/weapon/gun/ballistic/automatic/toy/pistol"), T("/obj/item/ammo_box/magazine/toy/pistol"), T("/obj/item/ammo_box/magazine/toy/pistol")));
	return f.dot;
});

rt.type(2260, "/datum/supply_pack/misc/artsupply", "/datum/supply_pack/misc", {
	name: "Art Supplies",
	cost: 800,
	crate_name: "art supply crate",
	contains: null,
});

// /datum/supply_pack/misc/artsupply/proc/<init>  (code/modules/cargo/packs.dm:1702)
rt.def("/datum/supply_pack/misc/artsupply/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/structure/easel"), T("/obj/structure/easel"), T("/obj/item/weapon/canvas/nineteenXnineteen"), T("/obj/item/weapon/canvas/nineteenXnineteen"), T("/obj/item/weapon/canvas/twentythreeXnineteen"), T("/obj/item/weapon/canvas/twentythreeXnineteen"), T("/obj/item/weapon/canvas/twentythreeXtwentythree"), T("/obj/item/weapon/canvas/twentythreeXtwentythree"), T("/obj/item/toy/crayon/rainbow"), T("/obj/item/toy/crayon/rainbow")));
	return f.dot;
});

rt.type(2261, "/datum/supply_pack/misc/bsa", "/datum/supply_pack/misc", {
	name: "Bluespace Artillery Parts",
	cost: 15000,
	special: 1,
	crate_name: "bluespace artillery parts crate",
	contains: null,
});

// /datum/supply_pack/misc/bsa/proc/<init>  (code/modules/cargo/packs.dm:1718)
rt.def("/datum/supply_pack/misc/bsa/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/circuitboard/machine/bsa/front"), T("/obj/item/weapon/circuitboard/machine/bsa/middle"), T("/obj/item/weapon/circuitboard/machine/bsa/back"), T("/obj/item/weapon/circuitboard/computer/bsa_control")));
	return f.dot;
});

rt.type(2262, "/datum/supply_pack/misc/dna_vault", "/datum/supply_pack/misc", {
	name: "DNA Vault Parts",
	cost: 12000,
	special: 1,
	crate_name: "dna vault parts crate",
	contains: null,
});

// /datum/supply_pack/misc/dna_vault/proc/<init>  (code/modules/cargo/packs.dm:1729)
rt.def("/datum/supply_pack/misc/dna_vault/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/circuitboard/machine/dna_vault"), T("/obj/item/device/dna_probe"), T("/obj/item/device/dna_probe"), T("/obj/item/device/dna_probe"), T("/obj/item/device/dna_probe"), T("/obj/item/device/dna_probe")));
	return f.dot;
});

rt.type(2263, "/datum/supply_pack/misc/dna_probes", "/datum/supply_pack/misc", {
	name: "DNA Vault Samplers",
	cost: 3000,
	special: 1,
	crate_name: "dna samplers crate",
	contains: null,
});

// /datum/supply_pack/misc/dna_probes/proc/<init>  (code/modules/cargo/packs.dm:1743)
rt.def("/datum/supply_pack/misc/dna_probes/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/device/dna_probe"), T("/obj/item/device/dna_probe"), T("/obj/item/device/dna_probe"), T("/obj/item/device/dna_probe"), T("/obj/item/device/dna_probe")));
	return f.dot;
});

rt.type(2264, "/datum/supply_pack/misc/shield_sat", "/datum/supply_pack/misc", {
	name: "Shield Generator Satellite",
	cost: 3000,
	special: 1,
	crate_name: "shield sat crate",
	contains: null,
});

// /datum/supply_pack/misc/shield_sat/proc/<init>  (code/modules/cargo/packs.dm:1756)
rt.def("/datum/supply_pack/misc/shield_sat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/machinery/satellite/meteor_shield"), T("/obj/machinery/satellite/meteor_shield"), T("/obj/machinery/satellite/meteor_shield")));
	return f.dot;
});

rt.type(2265, "/datum/supply_pack/misc/shield_sat_control", "/datum/supply_pack/misc", {
	name: "Shield System Control Board",
	cost: 5000,
	special: 1,
	crate_name: "shield control board crate",
	contains: null,
});

// /datum/supply_pack/misc/shield_sat_control/proc/<init>  (code/modules/cargo/packs.dm:1768)
rt.def("/datum/supply_pack/misc/shield_sat_control/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/item/weapon/circuitboard/machine/computer/sat_control")));
	return f.dot;
});

rt.type(2266, "/datum/supply_pack/misc/bicycle", "/datum/supply_pack/misc", {
	name: "Bicycle",
	cost: 1000000,
	crate_name: "Bicycle Crate",
	contains: null,
	crate_type: rt.typePath("/obj/structure/closet/crate/large"),
});

// /datum/supply_pack/misc/bicycle/proc/<init>  (code/modules/cargo/packs.dm:1776)
rt.def("/datum/supply_pack/misc/bicycle/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "contains", rt.list(T("/obj/vehicle/bicycle")));
	return f.dot;
});
