// Types declared in code/modules/reagents that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../build/dist/src/translate/runtime.js";

rt.type(12526, "/obj/structure/reagent_dispensers/watertank", "/obj/structure/reagent_dispensers", {
	name: "water tank",
	desc: "A water tank.",
	icon_state: "water",
});
rt.type(12527, "/obj/structure/reagent_dispensers/watertank/high", "/obj/structure/reagent_dispensers/watertank", {
	tank_volume: 100000,
	name: "high-capacity water tank",
	desc: "A highly pressurized water tank made to hold gargantuan amounts of water.",
	icon_state: "water_high",
});
rt.type(12531, "/obj/structure/reagent_dispensers/virusfood", "/obj/structure/reagent_dispensers", {
	anchored: 1,
	reagent_id: "virusfood",
	name: "virus food dispenser",
	desc: "A dispenser of low-potency virus mutagenic.",
	icon_state: "virus_food",
});
