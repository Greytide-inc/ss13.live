// Types declared in code/modules/food_and_drinks/drinks that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";

rt.type(5861, "/obj/item/weapon/reagent_containers/food/drinks/britcup", "/obj/item/weapon/reagent_containers/food/drinks", {
	name: "cup",
	desc: "A cup with the british flag emblazoned on it.",
	icon_state: "britcup",
	volume: 30,
	spillable: 1,
});
rt.type(5862, "/obj/item/weapon/reagent_containers/food/drinks/mushroom_bowl", "/obj/item/weapon/reagent_containers/food/drinks", {
	name: "mushroom bowl",
	desc: "A bowl made out of mushrooms. Not food, though it might have contained some at some point.",
	icon: rt.rsc("icons/obj/lavaland/ash_flora.dmi"),
	icon_state: "mushroom_bowl",
	w_class: 2,
	resistance_flags: 0,
});
