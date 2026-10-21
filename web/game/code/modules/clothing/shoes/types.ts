// Types declared in code/modules/clothing/shoes that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";

rt.type(8461, "/obj/item/clothing/shoes/combat/gang", "/obj/item/clothing/shoes/combat", {
	flags: 1024,
	name: "Wetwork boots",
	desc: "A gang's best hitmen are prepared for anything.",
	permeability_coefficient: 0.01,
});
rt.type(8462, "/obj/item/clothing/shoes/combat/coldres", "/obj/item/clothing/shoes/combat", {
	name: "insulated combat boots",
	desc: "High speed, low drag combat boots, now with an added layer of insulation.",
	min_cold_protection_temperature: 60,
});
rt.type(8490, "/obj/item/clothing/shoes/magboots/advance", "/obj/item/clothing/shoes/magboots", {
	magboot_state: "advmag",
	slowdown_active: 0,
	desc: "Advanced magnetic boots that have a lighter magnetic pull, placing less burden on the wearer.",
	name: "advanced magboots",
	icon_state: "advmag0",
	origin_tech: null,
	resistance_flags: 99,
});
rt.type(8491, "/obj/item/clothing/shoes/magboots/syndie", "/obj/item/clothing/shoes/magboots", {
	magboot_state: "syndiemag",
	desc: "Reverse-engineered magnetic boots that have a heavy magnetic pull. Property of Gorlex Marauders.",
	name: "blood-red magboots",
	icon_state: "syndiemag0",
	origin_tech: "magnets=4;syndicate=2",
});
