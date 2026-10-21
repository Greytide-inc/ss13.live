// From code/modules/clothing/suits/utility.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7910, "/obj/item/clothing/suit/fire", "/obj/item/clothing/suit", {
	flags: 8193,
	name: "emergency firesuit",
	desc: "A suit that helps protect against fire and heat.",
	icon_state: "fire",
	item_state: "ro_suit",
	w_class: 4,
	gas_transfer_coefficient: 0.9,
	permeability_coefficient: 0.5,
	body_parts_covered: 2046,
	allowed: null,
	slowdown: 1,
	flags_inv: 13,
	heat_protection: 2046,
	max_heat_protection_temperature: 30000,
	cold_protection: 2046,
	min_cold_protection_temperature: 60,
	strip_delay: 60,
	equip_delay_other: 60,
	resistance_flags: 2,
});

// /obj/item/clothing/suit/fire/proc/<init>  (code/modules/clothing/suits/utility.dm:21)
rt.def("/obj/item/clothing/suit/fire/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/device/flashlight"), T("/obj/item/weapon/tank/internals/emergency_oxygen"), T("/obj/item/weapon/extinguisher"), T("/obj/item/weapon/crowbar")));
	return f.dot;
});

rt.type(8186, "/obj/item/clothing/head/bomb_hood", "/obj/item/clothing/head", {
	flags: 8192,
	name: "bomb hood",
	desc: "Use in case of bomb.",
	icon_state: "bombsuit",
	armor: null,
	flags_inv: 1008,
	cold_protection: 1,
	min_cold_protection_temperature: 160,
	heat_protection: 1,
	max_heat_protection_temperature: 600,
	strip_delay: 70,
	equip_delay_other: 70,
	flags_cover: 20,
	resistance_flags: 0,
});

// /obj/item/clothing/head/bomb_hood/proc/<init>  (code/modules/clothing/suits/utility.dm:60)
rt.def("/obj/item/clothing/head/bomb_hood/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 20, "bullet", 0, "laser", 20, "energy", 10, "bomb", 100, "bio", 0, "rad", 0, "fire", 80, "acid", 50]));
	return f.dot;
});

rt.type(7914, "/obj/item/clothing/suit/bomb_suit", "/obj/item/clothing/suit", {
	flags: 8192,
	name: "bomb suit",
	desc: "A suit designed for safety when handling explosives.",
	icon_state: "bombsuit",
	item_state: "bombsuit",
	w_class: 4,
	gas_transfer_coefficient: 0.01,
	permeability_coefficient: 0.01,
	body_parts_covered: 2046,
	slowdown: 2,
	armor: null,
	flags_inv: 4,
	heat_protection: 2046,
	max_heat_protection_temperature: 600,
	cold_protection: 2046,
	min_cold_protection_temperature: 160,
	strip_delay: 70,
	equip_delay_other: 70,
	resistance_flags: 0,
});

// /obj/item/clothing/suit/bomb_suit/proc/<init>  (code/modules/clothing/suits/utility.dm:83)
rt.def("/obj/item/clothing/suit/bomb_suit/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 20, "bullet", 0, "laser", 20, "energy", 10, "bomb", 100, "bio", 0, "rad", 0, "fire", 80, "acid", 50]));
	return f.dot;
});

rt.type(7915, "/obj/item/clothing/suit/bomb_suit/security", "/obj/item/clothing/suit/bomb_suit", {
	icon_state: "bombsuitsec",
	item_state: "bombsuitsec",
	allowed: null,
});

// /obj/item/clothing/suit/bomb_suit/security/proc/<init>  (code/modules/clothing/suits/utility.dm:102)
rt.def("/obj/item/clothing/suit/bomb_suit/security/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/weapon/gun/energy"), T("/obj/item/weapon/melee/baton"), T("/obj/item/weapon/restraints/handcuffs")));
	return f.dot;
});

rt.type(8188, "/obj/item/clothing/head/radiation", "/obj/item/clothing/head", {
	flags: 8192,
	name: "radiation hood",
	icon_state: "rad",
	desc: "A hood with radiation protective properties. The label reads, 'Made with lead. Please do not consume insulation.'",
	flags_inv: 1008,
	armor: null,
	strip_delay: 60,
	equip_delay_other: 60,
	flags_cover: 20,
	resistance_flags: 0,
});

// /obj/item/clothing/head/radiation/proc/<init>  (code/modules/clothing/suits/utility.dm:113)
rt.def("/obj/item/clothing/head/radiation/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 60, "rad", 100, "fire", 30, "acid", 30]));
	return f.dot;
});

rt.type(7916, "/obj/item/clothing/suit/radiation", "/obj/item/clothing/suit", {
	flags: 8192,
	name: "radiation suit",
	desc: "A suit that protects against radiation. The label reads, 'Made with lead. Please do not consume insulation.'",
	icon_state: "rad",
	item_state: "rad_suit",
	w_class: 4,
	gas_transfer_coefficient: 0.9,
	permeability_coefficient: 0.5,
	body_parts_covered: 2046,
	allowed: null,
	slowdown: 1.5,
	armor: null,
	strip_delay: 60,
	equip_delay_other: 60,
	flags_inv: 4,
	resistance_flags: 0,
});

// /obj/item/clothing/suit/radiation/proc/<init>  (code/modules/clothing/suits/utility.dm:129)
rt.def("/obj/item/clothing/suit/radiation/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/device/flashlight"), T("/obj/item/weapon/tank/internals/emergency_oxygen"), T("/obj/item/device/geiger_counter")));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 60, "rad", 100, "fire", 30, "acid", 30]));
	return f.dot;
});
