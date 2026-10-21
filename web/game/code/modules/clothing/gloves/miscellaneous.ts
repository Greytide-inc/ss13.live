// From code/modules/clothing/gloves/miscellaneous.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7694, "/obj/item/clothing/gloves/botanic_leather", "/obj/item/clothing/gloves", {
	name: "botanist's leather gloves",
	desc: "These leather gloves protect against thorns, barbs, prickles, spikes and other harmful objects of floral origin.  They're also quite warm.",
	icon_state: "leather",
	item_state: "ggloves",
	permeability_coefficient: 0.9,
	cold_protection: 1536,
	min_cold_protection_temperature: 2,
	heat_protection: 1536,
	max_heat_protection_temperature: 1500,
	resistance_flags: 0,
	armor: null,
});

// /obj/item/clothing/gloves/botanic_leather/proc/<init>  (code/modules/clothing/gloves/miscellaneous.dm:25)
rt.def("/obj/item/clothing/gloves/botanic_leather/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 70, "acid", 30]));
	return f.dot;
});

rt.type(7695, "/obj/item/clothing/gloves/combat", "/obj/item/clothing/gloves", {
	name: "combat gloves",
	desc: "These tactical gloves are fireproof and shock resistant.",
	icon_state: "black",
	item_state: "blackgloves",
	siemens_coefficient: 0,
	permeability_coefficient: 0.05,
	strip_delay: 80,
	cold_protection: 1536,
	min_cold_protection_temperature: 2,
	heat_protection: 1536,
	max_heat_protection_temperature: 1500,
	resistance_flags: 0,
	armor: null,
});

// /obj/item/clothing/gloves/combat/proc/<init>  (code/modules/clothing/gloves/miscellaneous.dm:40)
rt.def("/obj/item/clothing/gloves/combat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 80, "acid", 50]));
	return f.dot;
});

rt.type(7696, "/obj/item/clothing/gloves/bracer", "/obj/item/clothing/gloves", {
	transfer_prints: 1,
	name: "bone bracers",
	desc: "For when you're expecting to get slapped on the wrist. Offers modest protection to your arms.",
	icon_state: "bracers",
	item_state: "bracers",
	item_color: null,
	strip_delay: 40,
	equip_delay_other: 20,
	body_parts_covered: 384,
	cold_protection: 384,
	min_cold_protection_temperature: 2,
	max_heat_protection_temperature: 1500,
	resistance_flags: 0,
	armor: null,
});

// /obj/item/clothing/gloves/bracer/proc/<init>  (code/modules/clothing/gloves/miscellaneous.dm:57)
rt.def("/obj/item/clothing/gloves/bracer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 15, "bullet", 35, "laser", 35, "energy", 20, "bomb", 35, "bio", 35, "rad", 35, "fire", 0, "acid", 0]));
	return f.dot;
});
