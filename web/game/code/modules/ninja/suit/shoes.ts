// From code/modules/ninja/suit/shoes.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(8513, "/obj/item/clothing/shoes/space_ninja", "/obj/item/clothing/shoes", {
	flags: 1024,
	name: "ninja shoes",
	desc: "A pair of running shoes. Excellent for running and even better for smashing skulls.",
	icon_state: "s-ninja",
	item_state: "secshoes",
	permeability_coefficient: 0.01,
	resistance_flags: 35,
	armor: null,
	strip_delay: 120,
	cold_protection: 96,
	min_cold_protection_temperature: 2,
	heat_protection: 96,
	max_heat_protection_temperature: 1500,
});

// /obj/item/clothing/shoes/space_ninja/proc/<init>  (code/modules/ninja/suit/shoes.dm:10)
rt.def("/obj/item/clothing/shoes/space_ninja/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 60, "bullet", 50, "laser", 30, "energy", 15, "bomb", 30, "bio", 30, "rad", 30, "fire", 100, "acid", 100]));
	return f.dot;
});
